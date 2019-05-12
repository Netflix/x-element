/**
 * Provides declarative 'properties' block.
 */

// TODO: should converge on terminology:
//  "setup", "analyze", "finalize", and "initialize"...
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;
const HAS_ANALYZED = Symbol.for('__hasAnalyzed__');
const ANALYZED_PROPERTIES = Symbol.for('__analyzedProperties__');
const FINALIZED_PROPERTIES = Symbol.for('__finalizedProperties__');
const PROPERTIES_INITIALIZED = Symbol.for('__propertiesInitialized__');
const PROPERTY_VALUE_CACHE = Symbol.for('__propertyValueCache__');

const caseMap = new Map();

/**
 * Provides property management via a declarative 'properties' block.
 */
export default superclass =>
  class extends superclass {
    constructor() {
      super();
      const ctor = this.constructor;
      if (
        ctor.hasOwnProperty(HAS_ANALYZED) === false ||
        ctor[HAS_ANALYZED] === false
      ) {
        ctor[ANALYZED_PROPERTIES] = ctor.analyzeProperties(ctor.properties);
      }
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

    static get analyzedProperties() {
      return this[ANALYZED_PROPERTIES];
    }

    get finalizedProperties() {
      return this[FINALIZED_PROPERTIES];
    }

    static analyzeProperty(property, definition, properties) {
      return definition;
    }

    static analyzeProperties(properties) {
      let next = properties;
      for (const [property, definition] of Object.entries(properties)) {
        next = Object.assign({}, next, {
          [property]: this.analyzeProperty(property, definition, properties),
        });
      }
      return next;
    }

    static finalizeProperty(target, property, definition, properties) {
      return definition;
    }

    static finalizeProperties(target, properties) {
      let next = properties;
      for (const [property, definition] of Object.entries(properties)) {
        const finalDefinition = this.finalizeProperty(
          target,
          property,
          definition,
          properties
        );
        next = Object.assign({}, next, { [property]: finalDefinition });
      }
      return next;
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
      const set = rawValue => {
        const oldRawValue = target[PROPERTY_VALUE_CACHE][property];
        const propertyShouldChange = this.shouldPropertyChange(
          target,
          property,
          definition,
          rawValue,
          oldRawValue
        );
        if (propertyShouldChange) {
          target[PROPERTY_VALUE_CACHE][property] = rawValue;
          const value = this.applyType(rawValue, definition.type);
          this.changeProperty(target, property, definition, value);
        }
      };
      const configurable = false;
      Reflect.deleteProperty(target, property);
      Reflect.defineProperty(target, property, { get, set, configurable });
    }

    static initializeProperties(target, properties) {
      for (const [property, definition] of Object.entries(properties)) {
        const value = this.getInitialValue(target, property, definition);
        this.initializeProperty(target, property, definition);
        target[property] = value;
      }

      // Allows us to guard against early handling in attributeChangedCallback.
      target[PROPERTIES_INITIALIZED] = true;
    }

    static beforeInitialRender(target) {
      super.beforeInitialRender(target);
      // Only reflect attributes when the element is connected
      // See https://dom.spec.whatwg.org/#dom-node-isconnected
      const finalizedProperties = this.finalizeProperties(
        target,
        this.analyzedProperties
      );
      target[FINALIZED_PROPERTIES] = finalizedProperties;
      target[PROPERTY_VALUE_CACHE] = {};
      this.initializeProperties(target, finalizedProperties);
    }

    static shouldPropertyChange(
      target,
      property,
      definition,
      rawValue,
      oldRawValue
    ) {
      return (
        !definition.readOnly &&
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
      // For internal use. Needed to set readOnly properties.
      const symbol = Symbol.for(property);
      this.propertyWillChange(target, property, definition, value);
      const oldValue = target[property];
      target[symbol] = value;
      this.propertyDidChange(target, property, definition, value, oldValue);
    }

    attributeChangedCallback(attribute, oldValue, newValue, namespace) {
      super.attributeChangedCallback(attribute, oldValue, newValue, namespace);
      if (newValue !== oldValue && this[PROPERTIES_INITIALIZED]) {
        const ctor = this.constructor;
        const property = ctor.dashToCamelCase(attribute);
        const definition = this.finalizedProperties[property];
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
