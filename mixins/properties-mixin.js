/**
 * Provides declarative 'properties' block.
 */
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;
const RAW_VALUES = Symbol.for('__rawValues__');

const caseMap = new Map();
const cachedPropertiesMap = new WeakMap();

/**
 * Provides property management via a declarative 'properties' block.
 */
export default superclass =>
  class extends superclass {
    static get properties() {
      return {};
    }

    static transformPropertyDefinition(definition) {
      return definition;
    }

    static get cachedProperties() {
      if (cachedPropertiesMap.has(this) === false) {
        const properties = {};
        for (const [property, definition] of Object.entries(this.properties)) {
          properties[property] = this.transformPropertyDefinition(definition);
        }
        cachedPropertiesMap.set(this, properties);
      }
      return cachedPropertiesMap.get(this);
    }

    static analyzeProperty(property, definition) {
      // Hook for subclasses.
    }

    static analyze() {
      super.analyze();
      const properties = this.cachedProperties;
      for (const [property, definition] of Object.entries(properties)) {
        this.analyzeProperty(property, definition);
      }
    }

    /**
     * Derives observed attributes using the `properties` definition block
     * See https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements#Observed_attributes
     */
    static get observedAttributes() {
      // Don't use cachedProperties, this is called during definition and would
      // not be testable.
      const properties = this.properties;
      if (properties) {
        return Object.keys(properties).map(this.camelToDashCase);
      }
    }

    static getInitialValue(target, property, definition) {
      // Process possible sources of initial state, with this priority:
      // 1. imperative, e.g. `element.prop = 'value';`
      // 2. declarative, e.g. `<element prop="value"></element>`
      // 3. definition, e.g. `properties: { prop: { value: 'value' } }`
      if (definition.readOnly) {
        return;
      }
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
      const set = raw => {
        const oldRaw = target[RAW_VALUES][property];
        const propertyShouldChange = this.shouldPropertyChange(
          target,
          property,
          definition,
          raw,
          oldRaw
        );
        if (propertyShouldChange) {
          target[RAW_VALUES][property] = raw;
          const value = this.applyType(raw, definition.type);
          this.changeProperty(target, property, definition, value);
        }
      };
      const configurable = false;
      Reflect.deleteProperty(target, property);
      Reflect.defineProperty(target, property, { get, set, configurable });
    }

    static beforeInitialRender(target) {
      super.beforeInitialRender(target);
      // Only reflect attributes when the element is connected
      // See https://dom.spec.whatwg.org/#dom-node-isconnected
      target[RAW_VALUES] = {};
      const properties = this.cachedProperties;
      for (const [property, definition] of Object.entries(properties)) {
        const value = this.getInitialValue(target, property, definition);
        this.initializeProperty(target, property, definition);
        target[property] = value;
      }
    }

    static shouldPropertyChange(target, property, definition, raw, oldRaw) {
      return (
        !definition.readOnly &&
        raw !== oldRaw &&
        (raw === raw || oldRaw === oldRaw)
      );
    }

    static propertyDidChange(target, property, definition, value, oldValue) {
      target.invalidate();
    }

    static changeProperty(target, property, definition, value) {
      // For internal use. Needed to set readOnly properties.
      const symbol = Symbol.for(property);
      const oldValue = target[property];
      target[symbol] = value;
      this.propertyDidChange(target, property, definition, value, oldValue);
    }

    attributeChangedCallback(attribute, oldValue, newValue, namespace) {
      super.attributeChangedCallback(attribute, oldValue, newValue, namespace);
      const ctor = this.constructor;
      if (newValue !== oldValue && ctor.isTargetInitialized(this)) {
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
