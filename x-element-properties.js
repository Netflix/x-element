/**
 * Implements property to attribute reflection.
 */

import XElementBasic from './x-element-basic.js';

const caseMap = new Map();
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;

export default class AbstractPropertiesElement extends XElementBasic {
  connectedCallback() {
    super.connectedCallback();
    // Only reflect attributes when the element is connected
    // See https://dom.spec.whatwg.org/#dom-node-isconnected
    this.constructor.initializeProperties(this);
  }

  attributeChangedCallback(attr, oldValue, newValue, ns) {
    super.attributeChangedCallback(attr, oldValue, newValue, ns);
    if (newValue !== oldValue && this.propertiesInitialized) {
      // Ensure all attribute changes are processed by property accessors.
      // This is required for frameworks which set attributes instead of props.
      // Keeping properties in sync with attributes is less confusing too.
      // NOTE: initial attribute values are processed in `connectedCallback`
      const props = this.constructor.properties;
      const prop = this.constructor.dashToCamelCase(attr);
      const type = props[prop].type;
      this[prop] = this.constructor.deserializeAttribute(attr, newValue, type);
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
      // Configure user defined property getter/setters
      const props = target.constructor.properties;
      for (const prop in props) {
        const { type, value, reflectToAttribute: reflect } = props[prop];
        this.addPropertyAccessor(target, prop, type, value, reflect);
      }
      target[Symbol.for('__propertiesInitialized__')] = true;
    }
  }

  static addPropertyAccessor(target, prop, type, defaultValue, reflect) {
    const symbol = Symbol.for(prop);
    const attr = this.camelToDashCase(prop);
    // Capture the property value prior to creating the accessor functions
    const initialValue = target[prop];
    Reflect.deleteProperty(target, prop);

    Object.defineProperty(target, prop, {
      get() {
        return target[symbol];
      },
      set(valueOrFn) {
        // Resolve values passed as functions
        const value = valueOrFn instanceof Function ? valueOrFn() : valueOrFn;
        // Apply the user-provided type function
        const result = this.constructor.applyType(value, type);
        // Save the typed result
        target[symbol] = result;
        if (reflect) {
          this.constructor.reflectProperty(target, attr, type, result);
        }
        // mark template dirty
        target.invalidate();
      },
    });

    // Process possible sources of initial state, with this priority:
    // 1. imperative, e.g. `element.prop = 'value';`
    // 2. declarative, e.g. `<element prop="value"></element>`
    // 3. definition, e.g. `properties: { prop: { value: 'value' } }`
    if (initialValue !== undefined) {
      // pass user provided initial state through the accessor
      target[prop] = initialValue;
    } else if (target.hasAttribute(attr)) {
      // Read attributes configured before the accessor functions exist as
      // these values were not yet passed through the property -> attribute path
      target[prop] = this.deserializeAttribute(
        attr,
        target.getAttribute(attr),
        type
      );
    } else if (defaultValue !== undefined) {
      // pass element default through the accessor
      target[prop] = defaultValue;
    }
  }

  static reflectProperty(target, attr, type, value) {
    if (type.name === 'Boolean') {
      if (value) {
        target.setAttribute(attr, '');
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
}
