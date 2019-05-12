/**
 * Provides declarative 'properties' block.
 */
// TODO: Can we cache properties information? See attributeChangedCallback...
// TODO: should converge on terminology, can setup move to `initialize`?
//  "analyze", "setup", , and "initialize"...
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;
const RAW_VALUES = Symbol.for('__rawValues__');

const caseMap = new Map();
const cachedPropertiesMap = new Map();
const propertiesInitializedSet = new WeakSet();

/**
 * Provides property management via a declarative 'properties' block.
 */
export default superclass =>
  class extends superclass {
    static get properties() {
      return {};
    }

    static get cachedProperties() {
      if (cachedPropertiesMap.has(this) === false) {
        cachedPropertiesMap.set(this, this.properties);
      }
      return cachedPropertiesMap.get(this);
    }

    static analyze() {
      super.analyze();
      this.analyzeProperties(this.cachedProperties);
    }

    /**
     * Derives observed attributes using the `properties` definition block
     * See https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements#Observed_attributes
     */
    static get observedAttributes() {
      if (this.cachedProperties) {
        return Object.keys(this.cachedProperties).map(this.camelToDashCase);
      }
    }

    static analyzeProperty(property, definition) {
      // Hook for subclasses.
    }

    static analyzeProperties(properties) {
      for (const [property, definition] of Object.entries(properties)) {
        this.analyzeProperty(property, definition);
      }
    }

    static getInitialValue(target, property, definition) {
      // Process possible sources of initial state, with this priority:
      // 1. imperative, e.g. `element.prop = 'value';`
      // 2. declarative, e.g. `<element prop="value"></element>`
      // 3. definition, e.g. `properties: { prop: { value: 'value' } }`
      const attribute = this.camelToDashCase(property);
      const initialPropertyValue = target[property];
      if (initialPropertyValue !== undefined) {
        return initialPropertyValue;
      } else if (target.hasAttribute(attribute)) {
        const value = target.getAttribute(attribute);
        return this.deserializeAttribute(target, property, definition, value);
      } else if (definition.value !== undefined) {
        const defaultValue = definition.value;
        return defaultValue instanceof Function ? defaultValue() : defaultValue;
      }
    }

    static initializeProperty(target, property, definition) {
      const symbol = Symbol.for(property);
      const get = () => target[symbol];
      const set = rawValue => {
        const oldRawValue = target[RAW_VALUES][property];
        const propertyShouldChange = this.shouldPropertyChange(
          target,
          property,
          definition,
          rawValue,
          oldRawValue
        );
        if (propertyShouldChange) {
          target[RAW_VALUES][property] = rawValue;
          const value = this.applyType(rawValue, definition.type);
          this.changeProperty(target, property, definition, value);
        }
      };
      const configurable = false;
      Reflect.deleteProperty(target, property);
      Reflect.defineProperty(target, property, { get, set, configurable });
    }

    static initializeProperties(target, properties) {
      // Allows us to guard early handling in attributeChangedCallback.
      propertiesInitializedSet.add(target);
      for (const [property, definition] of Object.entries(properties)) {
        const value = this.getInitialValue(target, property, definition);
        this.initializeProperty(target, property, definition);
        target[property] = value;
      }
    }

    static beforeInitialRender(target) {
      super.beforeInitialRender(target);
      // Only reflect attributes when the element is connected
      // See https://dom.spec.whatwg.org/#dom-node-isconnected
      target[RAW_VALUES] = {};
      this.initializeProperties(target, this.cachedProperties);
    }

    static shouldPropertyChange(
      target,
      property,
      definition,
      rawValue,
      oldRawValue
    ) {
      return (
        rawValue !== oldRawValue &&
        (rawValue === rawValue || oldRawValue === oldRawValue)
      );
    }

    static propertyWillChange(target, property, definition, value, oldValue) {
      // Provided for symmetry with propertyDidChange.
    }

    static propertyDidChange(target, property, definition, value, oldValue) {
      target.invalidate();
    }

    static changeProperty(target, property, definition, value) {
      // For internal use. Circumvents interface setter.
      const symbol = Symbol.for(property);
      this.propertyWillChange(target, property, definition, value);
      const oldValue = target[property];
      target[symbol] = value;
      this.propertyDidChange(target, property, definition, value, oldValue);
    }

    attributeChangedCallback(attribute, oldValue, newValue, namespace) {
      super.attributeChangedCallback(attribute, oldValue, newValue, namespace);
      if (newValue !== oldValue && propertiesInitializedSet.has(this)) {
        const ctor = this.constructor;
        const property = ctor.dashToCamelCase(attribute);
        const definition = ctor.cachedProperties[property];
        this[property] = ctor.deserializeAttribute(
          this,
          property,
          definition,
          newValue
        );
      }
    }

    static deserializeAttribute(target, property, definition, value) {
      if (definition.type.name === 'Boolean') {
        // per HTML spec, every value other than null is considered true
        return Object.is(value, null) === false;
      }
      return value;
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
