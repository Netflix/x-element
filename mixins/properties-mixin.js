const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;
const COMPUTED_REGEX = /^(.+)\((.+)\)$/;

const caseMap = new Map();

/**
 * Provides property management via a declarative 'properties' block.
 */
export default superclass =>
  class extends superclass {
    static initialize(target) {
      // Only reflect attributes when the element is connected
      // See https://dom.spec.whatwg.org/#dom-node-isconnected
      super.initialize(target);
      this.initializeProperties(target);
    }

    attributeChangedCallback(attr, oldValue, newValue, namespace) {
      super.attributeChangedCallback(attr, oldValue, newValue, namespace);
      if (newValue !== oldValue && this.propertiesInitialized) {
        // Ensure all attribute changes are processed by property accessors.
        // Required for frameworks which set attributes instead of props.
        // Keeping properties in sync with attributes is less confusing too.
        // NOTE: initial attribute values are processed in `connectedCallback`
        const props = this.constructor.properties;
        const prop = this.constructor.dashToCamelCase(attr);
        const type = props[prop].type;
        this[prop] = this.constructor.deserializeAttribute(
          attr,
          newValue,
          type
        );
      }
    }

    get propertiesInitialized() {
      return this[Symbol.for('__propertiesInitialized__')];
    }

    static get properties() {
      return {};
    }

    /**
     * Derives observed attributes using the `properties` definition block
     * See https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements#Observed_attributes
     */
    static get observedAttributes() {
      const props = this.properties;
      if (props) {
        return Object.keys(props).map(this.camelToDashCase);
      }
    }

    static initializeProperties(target) {
      if (!target.propertiesInitialized) {
        const definitions = this.properties;
        const properties = Reflect.ownKeys(definitions);

        // Initialize objects to be passed around to resolve computed properties
        // and observe values. These are mutated during initialization, but
        // remain constant after.
        const dependents = new Map();
        const dependencies = new Map();
        const resolvers = new Map();
        const observers = new Map();

        // Define all declared properties on target instance.
        for (const property of properties) {
          const definition = definitions[property];
          this.addPropertyAccessor(
            target,
            dependencies,
            dependents,
            resolvers,
            observers,
            property,
            definition
          );
        }

        // Validate and resolve computed properties.
        const computedProperties = properties.filter(
          property => !!definitions[property].computed
        );
        for (const property of computedProperties) {
          // Check for a cyclic dependency here to prevent max recursion errors.
          if (this.propertyHasCyclicDependencies(property, dependencies)) {
            throw new Error(`Property "${property}" has a cyclic dependency.`);
          }
          // Only allow access to defined properties.
          const strings = dependencies.get(property);
          for (const string of strings) {
            if (!properties.includes(string)) {
              throw new Error(`"${property}" depends on unknown "${string}".`);
            }
          }
        }
        const invalidProperties = new Set(computedProperties);
        this.resolveInvalidProperties(
          dependencies,
          resolvers,
          invalidProperties
        );

        target[Symbol.for('__propertiesInitialized__')] = true;

        // Call all observers after initialization. They may cause side effects.
        const observedProperties = properties.filter(
          property => definitions[property].observer
        );
        for (const property of observedProperties) {
          // Don't call observer if no initialization has happened.
          if (target[property] !== undefined) {
            observers.get(property)(undefined, target[property]);
          }
        }
      }
    }

    static addPropertyAccessor(
      target,
      dependencies,
      dependents,
      resolvers,
      observers,
      property,
      definition
    ) {
      const { computed, observer, type, reflect } = definition;
      const attribute = this.camelToDashCase(property);
      const symbol = Symbol.for(property);

      // If computed, generate dependents, dependencies & resolvers.
      if (computed) {
        // Parse computed DSL. E.g., "myFunc(propOne, propTwo)".
        const declarationMatch = computed.match(COMPUTED_REGEX);
        if (!declarationMatch) {
          throw new Error(`Malformed computed "${computed}".`);
        }
        const [methodName, dependenciesString = ''] = declarationMatch.slice(1);
        const strings = dependenciesString.split(',').map(dep => dep.trim());
        dependencies.set(property, strings);

        // Provide a resolver callback after computed property is invalidated.
        resolvers.set(property, () => {
          // Collect property values for all arguments from dependencies.
          const args = dependencies
            .get(property)
            .map(dependency => target[dependency]);
          // Method may be static or instance.
          const { method, thisArg } = this.resolveMethodName(
            target,
            methodName
          );
          const newValue = method.call(thisArg, ...args);
          // Ensure method's return is properly typed as per the user definition.
          const newTypedValue = this.applyType(newValue, type);
          // Store the old value in case we have an observer.
          const oldTypedValue = target[symbol];
          // Only make propagating changes if the property actually changed.
          if (newTypedValue !== oldTypedValue) {
            // Computed properties do not have a setter, set value directly.
            target[symbol] = newTypedValue;
            // Call observers immediately. Dependents aren't computed yet.
            if (target.propertiesInitialized && observers.has(property)) {
              observers.get(property)(oldTypedValue, newTypedValue);
            }
            if (reflect) {
              this.reflectProperty(target, attribute, type, newTypedValue);
            }
            // Mark template dirty. We have an edge case during initialization
            // where properties can be computed even though no dependencies have
            // been invalidated. This ensures a re-render in that case.
            target.invalidate();
          }
        });

        // Include property as a dependant of all it's dependencies.
        for (const dependency of dependencies.get(property)) {
          if (!dependents.has(dependency)) {
            dependents.set(dependency, new Set());
          }
          dependents.get(dependency).add(property);
        }
      }

      // If observed, create a callback for setters.
      if (observer) {
        const methodName = observer;
        observers.set(property, (oldValue, newValue) => {
          // Method may be static or instance.
          const { method, thisArg } = this.resolveMethodName(
            target,
            methodName
          );
          method.call(thisArg, oldValue, newValue);
        });
      }

      // Define getter and setter for property.
      const descriptor = {
        get() {
          return target[symbol];
        },
      };
      if (computed) {
        descriptor.set = () => {
          // Treat computed setter as a noop. No need to invalidate. This is how
          // we ensure reflected, computed properties only change internally.
          if (reflect) {
            this.reflectProperty(target, attribute, type, target[property]);
          }
        };
      } else {
        descriptor.set = newValue => {
          // Apply the user-provided type function and set with the result.
          const newTypedValue = this.applyType(newValue, type);
          // Store the old value in case we have an observer.
          const oldTypedValue = target[symbol];
          // Only make propagating changes if the property actually changed.
          if (newTypedValue !== oldTypedValue) {
            target[symbol] = newTypedValue;
            // Call observers immediately. Dependents aren't computed yet.
            if (target.propertiesInitialized && observers.has(property)) {
              observers.get(property)(oldTypedValue, newTypedValue);
            }
            if (reflect) {
              this.reflectProperty(target, attribute, type, newTypedValue);
            }
            // Post-initialization, ensure dependent properties are resolved.
            if (target.propertiesInitialized && dependents.has(property)) {
              const invalidProperties = this.invalidateProperty(
                dependents,
                property
              );
              this.resolveInvalidProperties(
                dependencies,
                resolvers,
                invalidProperties
              );
            }
            // Mark template dirty.
            target.invalidate();
          }
        };
      }

      // Store initial property value and then redefine with our descriptor.
      const initialPropertyValue = target[property];
      Reflect.deleteProperty(target, property);
      Reflect.defineProperty(target, property, descriptor);

      // If the property isn't computed, initialize it.
      if (!computed) {
        // Process possible sources of initial state, with this priority:
        // 1. imperative, e.g. `element.prop = 'value';`
        // 2. declarative, e.g. `<element prop="value"></element>`
        // 3. definition, e.g. `properties: { prop: { value: 'value' } }`
        const { value: defaultValue } = definition;
        if (initialPropertyValue !== undefined) {
          target[property] = initialPropertyValue;
        } else if (target.hasAttribute(attribute)) {
          const attributeValue = target.getAttribute(attribute);
          target[property] = this.deserializeAttribute(
            attribute,
            attributeValue,
            type
          );
        } else if (defaultValue !== undefined) {
          target[property] =
            defaultValue instanceof Function ? defaultValue() : defaultValue;
        }
      }
    }

    static reflectProperty(target, attr, type, value) {
      if (type.name === 'Boolean') {
        if (value) {
          // Any non-null attribute is a valid boolean. No need to change.
          if (Object.is(target.getAttribute(attr), null)) {
            target.setAttribute(attr, '');
          }
        } else {
          target.removeAttribute(attr);
        }
      } else if (type.name === 'String' || type.name === 'Number') {
        // avoid reflecting non-values
        if (value === undefined || Object.is(value, null)) {
          target.removeAttribute(attr);
        } else {
          target.setAttribute(attr, value);
        }
      } else {
        const message =
          `Attempted to write "${attr}" as a reflected attribute, ` +
          `but it is not a Boolean, String, or Number type (${type.name}).`;
        target.dispatchError(new Error(message));
      }
    }

    static applyType(value, type) {
      // null remains null
      if (Object.is(value, null)) {
        return null;
      }
      // undefined remains undefined
      if (value === undefined) {
        return undefined;
      }
      // only valid arrays (no coercion)
      if (type.name === 'Array') {
        return Array.isArray(value) ? value : null;
      }
      // only valid objects (no coercion)
      if (type.name === 'Object') {
        return Object.prototype.toString.call(value) === '[object Object]'
          ? value
          : null;
      }
      // otherwise coerce type as needed
      return value instanceof type ? value : type(value);
    }

    static deserializeAttribute(attr, value, type) {
      // per the HTML spec, every value other than null
      // is considered true for boolean attributes
      if (type.name === 'Boolean') {
        return Object.is(value, null) === false;
      }
      return value;
    }

    static propertyHasCyclicDependencies(property, dependencies, seen = []) {
      if (dependencies.has(property)) {
        for (const dependency of dependencies.get(property)) {
          if (
            dependency === property ||
            seen.includes(dependency) ||
            this.propertyHasCyclicDependencies(dependency, dependencies, [
              ...seen,
              property,
            ])
          ) {
            return true;
          }
        }
      }
      return false;
    }

    static invalidateProperty(dependents, property) {
      // Recursively generate the invalidity tree.
      const invalidProperties = new Set();
      if (dependents.has(property)) {
        dependents.get(property).forEach(dependent => {
          invalidProperties.add(dependent);
          const newSet = this.invalidateProperty(dependents, dependent);
          for (const invalidProperty of newSet) {
            invalidProperties.add(invalidProperty);
          }
        });
      }
      return invalidProperties;
    }

    static resolveInvalidProperties(
      dependencies,
      resolvers,
      invalidProperties
    ) {
      // Recursively resolve invalidity tree.
      const remainingInvalidProperties = new Set();
      for (const property of invalidProperties) {
        let canResolve = true;
        for (const dependency of dependencies.get(property)) {
          if (invalidProperties.has(dependency)) {
            canResolve = false;
            break;
          }
        }
        if (canResolve) {
          resolvers.get(property)();
        } else {
          remainingInvalidProperties.add(property);
        }
      }
      if (remainingInvalidProperties.size) {
        this.resolveInvalidProperties(
          dependencies,
          resolvers,
          remainingInvalidProperties
        );
      }
    }

    static resolveMethodName(target, methodName) {
      // Prioritize instance over static.
      const ctor = target.constructor;
      if (target[methodName] instanceof Function) {
        return { method: target[methodName], thisArg: target };
      } else if (ctor[methodName] instanceof Function) {
        return { method: ctor[methodName], thisArg: ctor };
      } else {
        const err = new Error(`Cannot resolve methodName "${methodName}".`);
        target.dispatchError(err);
      }
    }

    static dashToCamelCase(dash) {
      if (caseMap.has(dash) === false) {
        const camel =
          dash.indexOf('-') < 0
            ? dash
            : dash.replace(DASH_TO_CAMEL, m => m[1].toUpperCase());
        caseMap.set(dash, camel);
      }
      return caseMap.get(dash);
    }

    static camelToDashCase(camel) {
      if (caseMap.has(camel) === false) {
        const dash = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase();
        caseMap.set(camel, dash);
      }
      return caseMap.get(camel);
    }
  };
