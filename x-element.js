/** Base element class for creating custom elements. */
export default class XElement extends HTMLElement {
  /**
   * Extends HTMLElement.observedAttributes to handle the properties block.
   * @returns {string[]}
   */
  static get observedAttributes() {
    XElement.#analyzeConstructor(this);
    return [...XElement.#constructors.get(this).attributeMap.keys()];
  }

  /**
   * Default templating engine. Use "templateEngine" to override.
   * @returns {{[key: string]: Function}}
   */
  static get defaultTemplateEngine() {
    return TemplateEngine.interface;
  }

  /**
   * Configured templating engine. Defaults to "defaultTemplateEngine".
   * Override this as needed if x-element's default template engine does not
   * meet your needs. A "render" method is the only required field. An "html"
   * tagged template literal is expected, but not strictly required.
   * @returns {{[key: string]: Function}}
   */
  static get templateEngine() {
    return XElement.defaultTemplateEngine;
  }

  /**
   * Declare an array of CSSStyleSheet objects to adopt on the shadow root.
   * Note that a CSSStyleSheet object is the type returned when importing a
   * stylesheet file via import attributes.
   * ```js
   * import importedStyle from './path-to.css' with { type: 'css' };
   * class MyElement extends XElement {
   *   static get styles() {
   *     const inlineStyle = new CSSStyleSheet();
   *     inlineStyle.replaceSync(`:host { display: block; }`);
   *     return [importedStyle, inlineStyle];
   *   }
   * }
   * ```
   * @returns {CSSStyleSheet[]}
   */
  static get styles() {
    return [];
  }

  /**
   * Observe callback.
   * @callback observeCallback
   * @param {HTMLElement} host
   * @param {any} value
   * @param {any} oldValue
   */

  /**
   * A property value.
   * @typedef {object} Property
   * @property {any} [type]
   * @property {string} [attribute]
   * @property {string[]} [input]
   * @property {Function} [compute]
   * @property {observeCallback} [observe]
   * @property {boolean} [reflect]
   * @property {boolean} [internal]
   * @property {boolean} [readOnly]
   * @property {any|Function} [initial]
   * @property {any|Function} [default]
   */

  /**
   * Declare watched properties (and related attributes) on an element.
   * ```js
   * static get properties() {
   *   return {
   *     property1: {
   *       type: String,
   *     },
   *     property2: {
   *       type: Number,
   *       input: ['property1'],
   *       compute: this.computeProperty2,
   *       reflect: true,
   *       observe: this.observeProperty2,
   *       default: 0,
   *     }
   *   };
   * }
   * ```
   * @returns {{[key: string]: Property}}
   */
  static get properties() {
    return {};
  }

  /**
   * Listen callback.
   * @callback delegatedListenCallback
   * @param {HTMLElement} host
   * @param {Event} event
   */

  /**
   * Declare event handlers on an element.
   * ```js
   * static get listeners() {
   *   return {
   *     click: this.onClick,
   *   }
   * }
   *```
   * Note that listeners are added to the element's render root. Listeners are
   * added during "connectedCallback" and removed during "disconnectedCallback".
   * The arguments passed to your callback are always "(host, event)".
   * @returns {{[key: string]: delegatedListenCallback}}
   */
  static get listeners() {
    return {};
  }

  /**
   * Customize shadow root initialization and optionally forgo encapsulation.
   * E.g., setup focus delegation or return host instead of host.shadowRoot.
   * @param {HTMLElement} host
   * @returns {HTMLElement|ShadowRoot}
   */
  static createRenderRoot(host) {
    return host.attachShadow({ mode: 'open' });
  }

  /**
   * Template callback.
   * @callback templateCallback
   * @param {object} properties
   * @param {HTMLElement} host
   */

  /**
   * Setup template callback to update DOM when properties change.
   * ```js
   * static template(html, { nullish }) {
   *   return (href) => {
   *     return html`<a href=${nullish(href)}>click me</a>`;
   *   }
   * }
   * ```
   * @param {Function} html
   * @param {{[key: string]: Function}} engine
   * @returns {templateCallback}
   */
  static template(html, engine) { // eslint-disable-line no-unused-vars
    return (properties, host) => {}; // eslint-disable-line no-unused-vars
  }

  /**
   * Standard instance constructor.
   */
  constructor() {
    super();
    XElement.#constructHost(this);
  }

  /**
   * Extends HTMLElement.prototype.connectedCallback.
   */
  connectedCallback() {
    XElement.#connectHost(this);
  }

  /**
   * Extends HTMLElement.prototype.attributeChangedCallback.
   * @param {string} attribute
   * @param {string|null} oldValue
   * @param {string|null} value
   */
  attributeChangedCallback(attribute, oldValue, value) {
    const { attributeMap } = XElement.#constructors.get(this.constructor);
    // Authors may extend "observedAttributes". Optionally chain to account for
    // attributes which we don't know about.
    attributeMap.get(attribute)?.sync(this, value, oldValue);
  }

  /**
   * Extends HTMLElement.prototype.adoptedCallback.
   */
  adoptedCallback() {}

  /**
   * Extends HTMLElement.prototype.disconnectedCallback.
   */
  disconnectedCallback() {
    XElement.#disconnectHost(this);
  }

  /**
   * Uses the result of your template callback to update your render root.
   *
   * This is called when properties update, but is exposed for advanced use cases.
   */
  render() {
    const { template, properties, renderRoot, render } = XElement.#hosts.get(this);
    const result = template(properties, this);
    try {
      render(renderRoot, result);
    } catch (error) {
      const pathString = XElement.#toPathString(this);
      // @ts-ignore — TypeScript doesn’t get that this can accept any class.
      const tagName = customElements.getName(this.constructor);
      const message = `Invalid template for "${this.constructor.name}" / <${tagName}> at path "${pathString}".`;
      throw new Error(message, { cause: error });
    }
  }

  /**
   * Listen callback.
   * @callback listenCallback
   * @param {Event} event
   */

  /**
   * Wrapper around HTMLElement.addEventListener.
   * Advanced — use this only if declaring listeners statically is not possible.
   * @param {EventTarget} element
   * @param {string} type
   * @param {listenCallback} callback
   * @param {object} [options]
   */
  listen(element, type, callback, options) {
    if (XElement.#typeIsWrong(EventTarget, element)) {
      const typeName = XElement.#getTypeName(element);
      throw new Error(`Unexpected element passed to listen (expected EventTarget, got ${typeName}).`);
    }
    if (XElement.#typeIsWrong(String, type)) {
      const typeName = XElement.#getTypeName(type);
      throw new Error(`Unexpected type passed to listen (expected String, got ${typeName}).`);
    }
    if (XElement.#typeIsWrong(Function, callback)) {
      const typeName = XElement.#getTypeName(callback);
      throw new Error(`Unexpected callback passed to listen (expected Function, got ${typeName}).`);
    }
    if (XElement.#notNullish(options) && XElement.#typeIsWrong(Object, options)) {
      const typeName = XElement.#getTypeName(options);
      throw new Error(`Unexpected options passed to listen (expected Object, got ${typeName}).`);
    }
    XElement.#addListener(this, element, type, callback, options);
  }

  /**
   * Wrapper around HTMLElement.removeEventListener. Inverse of "listen".
   * @param {EventTarget} element
   * @param {string} type
   * @param {listenCallback} callback
   * @param {object} [options]
   */
  unlisten(element, type, callback, options) {
    if (XElement.#typeIsWrong(EventTarget, element)) {
      const typeName = XElement.#getTypeName(element);
      throw new Error(`Unexpected element passed to unlisten (expected EventTarget, got ${typeName}).`);
    }
    if (XElement.#typeIsWrong(String, type)) {
      const typeName = XElement.#getTypeName(type);
      throw new Error(`Unexpected type passed to unlisten (expected String, got ${typeName}).`);
    }
    if (XElement.#typeIsWrong(Function, callback)) {
      const typeName = XElement.#getTypeName(callback);
      throw new Error(`Unexpected callback passed to unlisten (expected Function, got ${typeName}).`);
    }
    if (XElement.#notNullish(options) && XElement.#typeIsWrong(Object, options)) {
      const typeName = XElement.#getTypeName(options);
      throw new Error(`Unexpected options passed to unlisten (expected Object, got ${typeName}).`);
    }
    XElement.#removeListener(this, element, type, callback, options);
  }

  /**
   * Helper method to dispatch an "ErrorEvent" on the element.
   * @param {Error} error
   */
  dispatchError(error) {
    const { message } = error;
    const eventData = { error, message, bubbles: true, composed: true };
    this.dispatchEvent(new ErrorEvent('error', eventData));
  }

  /**
   * For element authors. Getter and setter for internal properties.
   * Note that you can set read-only properties from host.internal. However, you
   * must get read-only properties directly from the host.
   * @returns {object}
   */
  get internal() {
    return XElement.#hosts.get(this).internal;
  }

  // Called once per class — kicked off from "static get observedAttributes".
  static #analyzeConstructor(constructor) {
    const { styles, properties, listeners } = constructor;
    const propertiesEntries = Object.entries(properties);
    const listenersEntries = Object.entries(listeners);
    XElement.#validateProperties(constructor, properties, propertiesEntries);
    XElement.#validateListeners(constructor, listeners, listenersEntries);
    const propertyMap = new Map(propertiesEntries);
    const internalPropertyMap = new Map();
    // Use a normal object for better autocomplete when debugging in console.
    const propertiesTarget = {};
    const internalTarget = {};
    const attributeMap = new Map();
    for (const [key, property] of propertyMap) {
      // We mutate (vs copy) to allow cross-referencing property objects.
      XElement.#mutateProperty(constructor, propertyMap, key, property);
      if (property.internal || property.readOnly) {
        internalPropertyMap.set(key, property);
        internalTarget[key] = undefined;
      }
      propertiesTarget[key] = undefined;
      if (property.attribute) {
        attributeMap.set(property.attribute, property);
      }
    }
    const listenerMap = new Map(listenersEntries);
    XElement.#constructors.set(constructor, {
      styles, propertyMap, internalPropertyMap, attributeMap, listenerMap,
      propertiesTarget, internalTarget,
    });
  }

  // Called during constructor analysis.
  static #validateProperties(constructor, properties, entries) {
    const path = `${constructor.name}.properties`;
    for (const [key, property] of entries) {
      if (XElement.#typeIsWrong(Object, property)) {
        const typeName = XElement.#getTypeName(property);
        throw new Error(`${path}.${key} has an unexpected value (expected Object, got ${typeName}).`);
      }
    }
    for (const [key, property] of entries) {
      XElement.#validateProperty(constructor, key, property);
    }
    const attributes = new Set();
    const inputMap = new Map();
    for (const [key, property] of entries) {
      if (XElement.#propertyHasAttribute(property)) {
        // Attribute names are case-insensitive — lowercase to properly check for duplicates.
        const attribute = property.attribute ?? XElement.#camelToKebab(key);
        XElement.#validatePropertyAttribute(constructor, key, property, attribute);
        if (attributes.has(attribute)) {
          throw new Error(`${path}.${key} causes a duplicated attribute "${attribute}".`);
        }
        attributes.add(attribute);
      }
      if (property.input) {
        inputMap.set(property, property.input.map(inputKey => properties[inputKey]));
        for (const [index, inputKey] of Object.entries(property.input)) {
          if (XElement.#typeIsWrong(Object, properties[inputKey])) {
            throw new Error(`${path}.${key}.input[${index}] has an unexpected item ("${inputKey}" has not been declared).`);
          }
        }
      }
    }
    for (const [key, property] of entries) {
      if (XElement.#propertyIsCyclic(property, inputMap)) {
        throw new Error(`${path}.${key}.input is cyclic.`);
      }
    }
  }

  static #validateProperty(constructor, key, property) {
    const path = `${constructor.name}.properties.${key}`;
    if (key.includes('-')) {
      throw new Error(`Unexpected key "${path}" contains "-" (property names should be camelCased).`);
    }
    for (const propertyKey of Object.keys(property)) {
      if (XElement.#propertyKeys.has(propertyKey) === false) {
        throw new Error(`Unexpected key "${path}.${propertyKey}".`);
      }
    }
    const { type, attribute, compute, input, reflect, internal, readOnly } = property;
    if (Reflect.has(property, 'type') && XElement.#typeIsWrong(Function, type)) {
      const typeName = XElement.#getTypeName(type);
      throw new Error(`Unexpected value for "${path}.type" (expected constructor Function, got ${typeName}).`);
    }
    for (const subKey of ['compute', 'observe']) {
      if (Reflect.has(property, subKey) && XElement.#typeIsWrong(Function, property[subKey])) {
        const typeName = XElement.#getTypeName(property[subKey]);
        throw new Error(`Unexpected value for "${path}.${subKey}" (expected Function, got ${typeName}).`);
      }
    }
    for (const subKey of ['reflect', 'internal', 'readOnly']) {
      if (Reflect.has(property, subKey) && XElement.#typeIsWrong(Boolean, property[subKey])) {
        const typeName = XElement.#getTypeName(property[subKey]);
        throw new Error(`Unexpected value for "${path}.${subKey}" (expected Boolean, got ${typeName}).`);
      }
    }
    if (!internal && XElement.#prototypeInterface.has(key)) {
      throw new Error(`Unexpected key "${path}" shadows in XElement.prototype interface.`);
    }
    if (Reflect.has(property, 'attribute') && XElement.#typeIsWrong(String, attribute)) {
      const typeName = XElement.#getTypeName(attribute);
      throw new Error(`Unexpected value for "${path}.attribute" (expected String, got ${typeName}).`);
    }
    if (Reflect.has(property, 'attribute') && attribute === '') {
      throw new Error(`Unexpected value for "${path}.attribute" (expected non-empty String).`);
    }
    for (const subKey of ['initial', 'default']) {
      const value = Reflect.get(property, subKey);
      if (
        XElement.#notNullish(value) &&
        XElement.#typeIsWrong(Boolean, value) &&
        XElement.#typeIsWrong(String, value) &&
        XElement.#typeIsWrong(Number, value) &&
        XElement.#typeIsWrong(Function, value)
      ) {
        const typeName = XElement.#getTypeName(value);
        throw new Error(`Unexpected value for "${path}.${subKey}" (expected Boolean, String, Number, or Function, got ${typeName}).`);
      }
    }
    if (Reflect.has(property, 'input') && XElement.#typeIsWrong(Array, input)) {
      const typeName = XElement.#getTypeName(input);
      throw new Error(`Unexpected value for "${path}.input" (expected Array, got ${typeName}).`);
    }
    if (Reflect.has(property, 'input')) {
      for (const [index, inputKey] of Object.entries(input)) {
        if (XElement.#typeIsWrong(String, inputKey)) {
          const typeName = XElement.#getTypeName(inputKey);
          throw new Error(`Unexpected value for "${path}.input[${index}]" (expected String, got ${typeName}).`);
        }
      }
    }
    const unserializable = XElement.#serializableTypes.has(property.type) === false;
    const typeName = property.type?.prototype && property.type?.name ? property.type.name : XElement.#getTypeName(property.type);
    if (attribute && type && unserializable) {
      throw new Error(`Found unserializable "${path}.type" (${typeName}) but "${path}.attribute" is defined.`);
    }
    if (reflect && unserializable) {
      throw new Error(`Found unserializable "${path}.type" (${typeName}) but "${path}.reflect" is true.`);
    }
    if (compute && !input) {
      throw new Error(`Found "${path}.compute" without "${path}.input" (computed properties require input).`);
    }
    if (input && !compute) {
      throw new Error(`Found "${path}.input" without "${path}.compute" (computed properties require a compute callback).`);
    }
    if (Reflect.has(property, 'initial') && compute) {
      throw new Error(`Found "${path}.initial" and "${path}.compute" (computed properties cannot set an initial value).`);
    }
    if (Reflect.has(property, 'readOnly') && compute) {
      throw new Error(`Found "${path}.readOnly" and "${path}.compute" (computed properties cannot define read-only).`);
    }
    if (reflect && internal) {
      throw new Error(`Both "${path}.reflect" and "${path}.internal" are true (reflected properties cannot be internal).`);
    }
    if (internal && readOnly) {
      throw new Error(`Both "${path}.internal" and "${path}.readOnly" are true (read-only properties cannot be internal).`);
    }
    if (internal && attribute) {
      throw new Error(`Found "${path}.attribute" but "${path}.internal" is true (internal properties cannot have attributes).`);
    }
  }

  static #validatePropertyAttribute(constructor, key, property, attribute) {
    const path = `${constructor.name}.properties`;
    // Attribute names are case-insensitive — lowercase to properly check for duplicates.
    if (attribute !== attribute.toLowerCase()) {
      throw new Error(`${path}.${key} has non-standard attribute casing "${attribute}" (use lower-cased names).`);
    }
  }

  // Determines if computed property inputs form a cycle.
  static #propertyIsCyclic(property, inputMap, seen = new Set()) {
    if (inputMap.has(property)) {
      for (const input of inputMap.get(property)) {
        const nextSeen = new Set([...seen, property]);
        if (
          input === property ||
          seen.has(input) ||
          XElement.#propertyIsCyclic(input, inputMap, nextSeen)
        ) {
          return true;
        }
      }
    }
  }

  static #validateListeners(constructor, listeners, entries) {
    const path = `${constructor.name}.listeners`;
    for (const [type, listener] of entries) {
      if (XElement.#typeIsWrong(Function, listener)) {
        const typeName = XElement.#getTypeName(listener);
        throw new Error(`${path}.${type} has unexpected value (expected Function, got ${typeName}).`);
      }
    }
  }

  // Called once per-property during constructor analysis.
  static #mutateProperty(constructor, propertyMap, key, property) {
    property.key = key;
    property.attribute = XElement.#propertyHasAttribute(property)
      ? property.attribute ?? XElement.#camelToKebab(key)
      : undefined;
    property.input = new Set((property.input ?? []).map(inputKey => propertyMap.get(inputKey)));
    property.output = property.output ?? new Set();
    for (const input of property.input) {
      input.output = input.output ?? new Set();
      input.output.add(property);
    }
    XElement.#addPropertyInitial(constructor, property);
    XElement.#addPropertyDefault(constructor, property);
    XElement.#addPropertySync(constructor, property);
    XElement.#addPropertyCompute(constructor, property);
    XElement.#addPropertyReflect(constructor, property);
    XElement.#addPropertyObserve(constructor, property);
  }

  // Wrapper to improve ergonomics of coalescing nullish, initial value.
  static #addPropertyInitial(constructor, property) {
    // Should take `value` in and spit the initial or value out.
    if (Reflect.has(property, 'initial')) {
      const initialValue = property.initial;
      const isFunction = XElement.#typeIsWrong(Function, initialValue) === false;
      property.initial = value =>
        value ?? (isFunction ? initialValue.call(constructor) : initialValue);
    } else {
      property.initial = value => value;
    }
  }

  // Wrapper to improve ergonomics of coalescing nullish, default value.
  static #addPropertyDefault(constructor, property) {
    // Should take `value` in and spit the default or value out.
    if (Reflect.has(property, 'default')) {
      const { key, default: defaultValue } = property;
      const isFunction = XElement.#typeIsWrong(Function, defaultValue) === false;
      const getOrCreateDefault = host => {
        const { defaultMap } = XElement.#hosts.get(host);
        if (!defaultMap.has(key)) {
          const value = isFunction ? defaultValue.call(constructor) : defaultValue;
          defaultMap.set(key, value);
          return value;
        }
        return defaultMap.get(key);
      };
      property.default = (host, value) => value ?? getOrCreateDefault(host);
    } else {
      property.default = (host, value) => value;
    }
  }

  // Wrapper to improve ergonomics of syncing attributes back to properties.
  static #addPropertySync(constructor, property) {
    if (XElement.#propertyHasAttribute(property)) {
      property.sync = (host, value, oldValue) => {
        const { initialized, reflecting } = XElement.#hosts.get(host);
        if (reflecting === false && initialized && value !== oldValue) {
          const deserialization = XElement.#deserializeProperty(host, property, value);
          host[property.key] = deserialization;
        }
      };
    }
  }

  // Wrapper to centralize logic needed to perform reflection.
  static #addPropertyReflect(constructor, property) {
    if (property.reflect) {
      property.reflect = host => {
        const value = XElement.#getPropertyValue(host, property);
        const serialization = XElement.#serializeProperty(host, property, value);
        const hostInfo = XElement.#hosts.get(host);
        hostInfo.reflecting = true;
        serialization === undefined
          ? host.removeAttribute(property.attribute)
          : host.setAttribute(property.attribute, serialization);
        hostInfo.reflecting = false;
      };
    }
  }

  // Wrapper to prevent repeated compute callbacks.
  static #addPropertyCompute(constructor, property) {
    const { compute } = property;
    if (compute) {
      property.compute = host => {
        const { computeMap, valueMap } = XElement.#hosts.get(host);
        const saved = computeMap.get(property);
        if (saved.valid === false) {
          const args = [];
          for (const input of property.input) {
            args.push(XElement.#getPropertyValue(host, input));
          }
          if (saved.args === undefined || args.some((arg, index) => arg !== saved.args[index])) {
            const value = property.default(host, compute.call(constructor, ...args));
            XElement.#validatePropertyValue(host, property, value);
            valueMap.set(property, value);
            saved.args = args;
          }
          saved.valid = true;
        }
        return valueMap.get(property);
      };
    }
  }

  // Wrapper to provide last value to observe callbacks.
  static #addPropertyObserve(constructor, property) {
    const { observe } = property;
    if (observe) {
      property.observe = host => {
        const saved = XElement.#hosts.get(host).observeMap.get(property);
        const value = XElement.#getPropertyValue(host, property);
        if (Object.is(value, saved.value) === false) {
          observe.call(constructor, host, value, saved.value);
        }
        saved.value = value;
      };
    }
  }

  // Called once per-host during construction.
  static #constructHost(host) {
    const invalidProperties = new Set();
    // The weak map prevents memory leaks. E.g., adding anonymous listeners.
    const listenerMap = new WeakMap();
    const valueMap = new Map();
    const renderRoot = host.constructor.createRenderRoot(host);
    if (!renderRoot || renderRoot !== host && renderRoot !== host.shadowRoot) {
      throw new Error('Unexpected render root returned. Expected "host" or "host.shadowRoot".');
    }
    const { render, html, ...engine } = host.constructor.templateEngine;
    const template = host.constructor.template(html, { html, ...engine }).bind(host.constructor);
    const properties = XElement.#createProperties(host);
    const internal = XElement.#createInternal(host);
    const computeMap = new Map();
    const observeMap = new Map();
    const defaultMap = new Map();
    const { styles, propertyMap } = XElement.#constructors.get(host.constructor);
    if (styles.length > 0) {
      if (renderRoot === host.shadowRoot) {
        if (renderRoot.adoptedStyleSheets.length === 0) {
          renderRoot.adoptedStyleSheets = styles;
        } else {
          throw new Error('Unexpected "styles" declared when preexisting "adoptedStyleSheets" exist.');
        }
      } else {
        throw new Error('Unexpected "styles" declared without a shadow root.');
      }
    }
    for (const property of propertyMap.values()) {
      if (property.compute) {
        computeMap.set(property, { valid: false, args: undefined });
      }
      if (property.observe) {
        observeMap.set(property, { value: undefined });
      }
    }
    XElement.#hosts.set(host, {
      initialized: false, reflecting: false, invalidProperties, listenerMap,
      renderRoot, render, template, properties, internal, computeMap,
      observeMap, defaultMap, valueMap,
    });
  }

  // Called during host construction.
  static #createInternal(host) {
    const { propertyMap, internalPropertyMap, internalTarget } =  XElement.#constructors.get(host.constructor);
    // Everything but "get", "set", "has", and "ownKeys" are considered invalid.
    // Note that impossible traps like "apply" or "construct" are not guarded.
    const invalid = () => { throw new Error('Invalid use of internal proxy.'); };
    const get = (target, key) => {
      const internalProperty = internalPropertyMap.get(key);
      if (internalProperty?.internal) {
        return XElement.#getPropertyValue(host, internalProperty);
      } else {
        const path = `${host.constructor.name}.properties.${key}`;
        const property = propertyMap.get(key);
        if (property === undefined) {
          throw new Error(`Property "${path}" does not exist.`);
        } else {
          throw new Error(`Property "${path}" is publicly available (use normal getter).`);
        }
      }
    };
    const set = (target, key, value) => {
      const internalProperty = internalPropertyMap.get(key);
      if (internalProperty && Reflect.has(internalProperty, 'compute') === false) {
        XElement.#setPropertyValue(host, internalProperty, value);
        return true;
      } else {
        const path = `${host.constructor.name}.properties.${key}`;
        const property = propertyMap.get(key);
        if (property === undefined) {
          throw new Error(`Property "${path}" does not exist.`);
        } else if (property.compute) {
          throw new Error(`Property "${path}" is computed (computed properties are read-only).`);
        } else {
          throw new Error(`Property "${path}" is publicly available (use normal setter).`);
        }
      }
    };
    const has = (target, key) => internalPropertyMap.has(key);
    const ownKeys = () => [...internalPropertyMap.keys()];
    const handler = {
      defineProperty: invalid, deleteProperty: invalid, get,
      getOwnPropertyDescriptor: invalid, getPrototypeOf: invalid, has,
      isExtensible: invalid, ownKeys, preventExtensions: invalid,
      set, setPrototypeOf: invalid,
    };
    return new Proxy(internalTarget, handler);
  }

  // Only available in template callback. Provides getter for all properties.
  // Called during host construction.
  static #createProperties(host) {
    const { propertyMap, propertiesTarget } =  XElement.#constructors.get(host.constructor);
    // Everything but "get", "set", "has", and "ownKeys" are considered invalid.
    const invalid = () => { throw new Error('Invalid use of properties proxy.'); };
    const get = (target, key) => {
      if (propertyMap.has(key)) {
        return XElement.#getPropertyValue(host, propertyMap.get(key));
      } else {
        const path = `${host.constructor.name}.properties.${key}`;
        throw new Error(`Property "${path}" does not exist.`);
      }
    };
    const set = (target, key) => {
      const path = `${host.constructor.name}.properties.${key}`;
      if (propertyMap.has(key)) {
        throw new Error(`Cannot set "${path}" via "properties".`);
      } else {
        throw new Error(`Property "${path}" does not exist.`);
      }
    };
    const has = (target, key) => propertyMap.has(key);
    const ownKeys = () => [...propertyMap.keys()];
    const handler = {
      defineProperty: invalid, deleteProperty: invalid, get,
      getOwnPropertyDescriptor: invalid, getPrototypeOf: invalid, has,
      isExtensible: invalid, ownKeys, preventExtensions: invalid, set,
      setPrototypeOf: invalid,
    };
    return new Proxy(propertiesTarget, handler);
  }

  // Called once per-host from initial "connectedCallback".
  static #connectHost(host) {
    const initialized = XElement.#initializeHost(host);
    XElement.#addListeners(host);
    if (initialized) {
      XElement.#updateHost(host);
    }
  }

  static #disconnectHost(host) {
    XElement.#removeListeners(host);
  }

  static #initializeHost(host) {
    const hostInfo = XElement.#hosts.get(host);
    const { computeMap, initialized, invalidProperties } = hostInfo;
    if (initialized === false) {
      XElement.#upgradeOwnProperties(host);
      // Only reflect attributes when the element is connected.
      const { propertyMap } = XElement.#constructors.get(host.constructor);
      for (const property of propertyMap.values()) {
        const { value, found } = XElement.#getPreUpgradePropertyValue(host, property);
        XElement.#initializeProperty(host, property);
        if (found) {
          host[property.key] = property.default(host, property.initial(value));
        } else if (!property.compute) {
          // Set to a nullish value so that it coalesces to the default.
          XElement.#setPropertyValue(host, property, property.default(host, property.initial()));
        }
        invalidProperties.add(property);
        if (property.compute) {
          computeMap.get(property).valid = false;
        }
      }
      hostInfo.initialized = true;
      return true;
    }
    return false;
  }

  // Prevent shadowing from properties added to element instance pre-upgrade.
  static #upgradeOwnProperties(host) {
    for (const key of Reflect.ownKeys(host)) {
      const value = Reflect.get(host, key);
      Reflect.deleteProperty(host, key);
      Reflect.set(host, key, value);
    }
  }

  // Called during host initialization.
  static #getPreUpgradePropertyValue(host, property) {
    // Process possible sources of initial state, with this priority:
    // 1. imperative, e.g. `element.prop = 'value';`
    // 2. declarative, e.g. `<element prop="value"></element>`
    const { key, attribute, internal } = property;
    let value;
    let found = false;
    if (!internal) {
      // Only look for public (i.e., non-internal) properties.
      if (Reflect.has(host, key)) {
        value = host[key];
        found = true;
      } else if (attribute && host.hasAttribute(attribute)) {
        const attributeValue = host.getAttribute(attribute);
        value = XElement.#deserializeProperty(host, property, attributeValue);
        found = true;
      }
    }
    return { value, found };
  }

  static #initializeProperty(host, property) {
    if (!property.internal) {
      const { key, compute, readOnly } = property;
      const path = `${host.constructor.name}.properties.${key}`;
      const get = () => XElement.#getPropertyValue(host, property);
      const set = compute || readOnly
        ? () => {
          if (compute) {
            throw new Error(`Property "${path}" is computed (computed properties are read-only).`);
          } else {
            throw new Error(`Property "${path}" is read-only.`);
          }
        }
        : value => XElement.#setPropertyValue(host, property, value);
      Reflect.deleteProperty(host, key);
      Reflect.defineProperty(host, key, { get, set, enumerable: true });
    }
  }

  static #addListener(host, element, type, callback, options) {
    callback = XElement.#getListener(host, callback);
    element.addEventListener(type, callback, options);
  }

  static #addListeners(host) {
    const { listenerMap } = XElement.#constructors.get(host.constructor);
    const { renderRoot } = XElement.#hosts.get(host);
    for (const [type, listener] of listenerMap) {
      XElement.#addListener(host, renderRoot, type, listener);
    }
  }

  static #removeListener(host, element, type, callback, options) {
    callback = XElement.#getListener(host, callback);
    element.removeEventListener(type, callback, options);
  }

  static #removeListeners(host) {
    const { listenerMap } = XElement.#constructors.get(host.constructor);
    const { renderRoot } = XElement.#hosts.get(host);
    for (const [type, listener] of listenerMap) {
      XElement.#removeListener(host, renderRoot, type, listener);
    }
  }

  static #getListener(host, listener) {
    const { listenerMap } = XElement.#hosts.get(host);
    if (listenerMap.has(listener) === false) {
      listenerMap.set(listener, listener.bind(host.constructor, host));
    }
    return listenerMap.get(listener);
  }

  static #updateHost(host) {
    // Order of operations: compute, reflect, render, then observe.
    const { invalidProperties } = XElement.#hosts.get(host);
    const invalidPropertiesCopy = new Set(invalidProperties);
    invalidProperties.clear();
    for (const property of invalidPropertiesCopy) {
      property.reflect?.(host);
    }
    host.render();
    for (const property of invalidPropertiesCopy) {
      property.observe?.(host);
    }
  }

  // Used to improve error messaging by appending DOM path information.
  static #toPathString(host) {
    const path = [];
    let reference = host;
    while (reference) {
      path.push(reference);
      reference = reference.parentElement ?? reference.getRootNode().host;
    }
    return path
      .map(element => {
        const tag = element.localName;
        const attributes = Array.from(element.attributes)
          .map(({ name, value }) => value ? `${name}="${value}"` : name);
        return `${tag}${attributes.length ? `[${attributes.join('][')}]` : ''}`;
      })
      .join(' < ');
  }

  static async #invalidateProperty(host, property) {
    const { initialized, invalidProperties, computeMap } = XElement.#hosts.get(host);
    if (initialized) {
      for (const output of property.output) {
        XElement.#invalidateProperty(host, output);
      }
      const queueUpdate = invalidProperties.size === 0;
      invalidProperties.add(property);
      if (property.compute) {
        computeMap.get(property).valid = false;
      }
      if (queueUpdate) {
        // Queue a microtask. Allows multiple, synchronous changes.
        await Promise.resolve();
        XElement.#updateHost(host);
      }
    }
  }

  static #getPropertyValue(host, property) {
    const { valueMap } = XElement.#hosts.get(host);
    return property.compute?.(host) ?? valueMap.get(property);
  }

  static #validatePropertyValue(host, property, value) {
    if (property.type && XElement.#notNullish(value)) {
      if (XElement.#typeIsWrong(property.type, value)) {
        const path = `${host.constructor.name}.properties.${property.key}`;
        const typeName = XElement.#getTypeName(value);
        throw new Error(`Unexpected value for "${path}" (expected ${property.type.name}, got ${typeName}).`);
      }
    }
  }

  static #setPropertyValue(host, property, value) {
    const { valueMap } = XElement.#hosts.get(host);
    if (Object.is(value, valueMap.get(property)) === false) {
      value = property.default(host, value);
      XElement.#validatePropertyValue(host, property, value);
      valueMap.set(property, value);
      XElement.#invalidateProperty(host, property);
    }
  }

  static #serializeProperty(host, property, value) {
    if (XElement.#notNullish(value)) {
      if (property.type === Boolean) {
        return value ? '' : undefined;
      }
      return value.toString();
    }
  }

  static #deserializeProperty(host, property, value) {
    if (property.type === Boolean) {
      // Per HTML spec, every value other than null is considered true.
      return value !== null;
    } else if (value === null) {
      // Null as an attribute is really "undefined" as a property.
      return undefined;
    } else if (!property.type) {
      // Property doesn't have a type, leave it as a string.
      return value;
    } else {
      // Coerce type as needed.
      switch (property.type) {
        case Number:
          // Don't try and coerce something like "Number('') >> 0".
          return value.trim() ? property.type(value) : Number.NaN;
        default:
          return property.type(value);
      }
    }
  }

  // Public properties which are serializable or typeless have attributes.
  static #propertyHasAttribute(property) {
    return !property.internal && (XElement.#serializableTypes.has(property.type) || !property.type);
  }

  static #getTypeName(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  }

  static #notNullish(value) {
    return value !== undefined && value !== null;
  }

  static #typeIsWrong(type, value) {
    // Because `instanceof` fails on primitives (`'' instanceof String === false`)
    // and `Object.prototype.toString` cannot handle inheritance, we use both.
    return (
      XElement.#notNullish(value) === false ||
      (!(value instanceof type) && XElement.#getTypeName(value) !== type.name)
    );
  }

  static #camelToKebab(camel) {
    if (XElement.#caseMap.has(camel) === false) {
      XElement.#caseMap.set(camel, camel.replace(/([A-Z])/g, '-$1').toLowerCase());
    }
    return XElement.#caseMap.get(camel);
  }

  static #constructors = new WeakMap();
  static #hosts = new WeakMap();
  static #propertyKeys = new Set(['type', 'attribute', 'input', 'compute', 'observe', 'reflect', 'internal', 'readOnly', 'initial', 'default']);
  static #serializableTypes = new Set([Boolean, String, Number]);
  static #caseMap = new Map();
  static #prototypeInterface = new Set(Object.getOwnPropertyNames(XElement.prototype));
}

/** Internal implementation details for template engine. */
class TemplateEngine {
  static #UNSET = Symbol(); // Ensures a unique, initial comparison.
  static #ATTRIBUTE_PREFIXES = {
    attribute: 'x-element-attribute-',
    boolean: 'x-element-boolean-',
    property: 'x-element-property-',
  };
  static #CONTENT_PREFIX = 'x-element-content-';
  static #CONTENT_REGEX = new RegExp(`${TemplateEngine.#CONTENT_PREFIX}(\\d+)`);
  static #OPEN = /<[a-z][a-z0-9-]*(?=\s)/g;
  static #STEP = /\s+[a-z][a-z0-9-]*(?=[\s>])|\s+[a-z][a-zA-Z0-9-]*="[^"]*"/y;
  static #ATTRIBUTE = /\s+(\??([a-z][a-zA-Z0-9-]*))="$/y;
  static #PROPERTY = /\s+\.([a-z][a-zA-Z0-9_]*)="$/y;
  static #CLOSE = />/g;

  static #interface = null;
  static #stateMap = new WeakMap(); // Maps nodes to internal state.
  static #analysisMap = new WeakMap(); // Maps strings to cached computations.
  static #resultMap = new WeakMap(); // Maps symbols to results.
  static #updaterMap = new WeakMap(); // Maps symbols to updaters.

  /**
   * Declare HTML markup to be interpolated.
   * ```js
   * html`<div attr="${obj.attr}" .prop="${obj.prop}">${obj.content}</div>`;
   * ```
   * @param {string[]} strings
   * @param {any[]} values
   * @returns {any}
   */
  static html(strings, ...values) {
    const symbol = Symbol();
    const result = TemplateEngine.#createResult('html', strings, values);
    TemplateEngine.#resultMap.set(symbol, result);
    return symbol;
  }

  /**
   * Declare SVG markup to be interpolated.
   * ```js
   * svg`<circle r="${obj.r}" cx="${obj.cx}" cy="${obj.cy}"></div>`;
   * ```
   * @param {string[]} strings
   * @param {any[]} values
   * @returns {any}
   */
  static svg(strings, ...values) {
    const symbol = Symbol();
    const result = TemplateEngine.#createResult('svg', strings, values);
    TemplateEngine.#resultMap.set(symbol, result);
    return symbol;
  }

  /**
   * Core rendering entry point for x-element template engine.
   * Accepts a "container" element and renders the given "result" into it.
   * @param {HTMLElement} container
   * @param {any} resultReference
   */
  static render(container, resultReference) {
    const state = TemplateEngine.#setIfMissing(TemplateEngine.#stateMap, container, () => ({}));
    if (resultReference) {
      const result = TemplateEngine.#resultMap.get(resultReference);
      if (TemplateEngine.#cannotReuseResult(state.result, result)) {
        TemplateEngine.#removeWithin(container);
        TemplateEngine.#ready(result);
        TemplateEngine.#commit(result);
        TemplateEngine.#inject(result, container);
        state.result = result;
      } else {
        TemplateEngine.#assign(state.result, result);
        TemplateEngine.#commit(state.result);
      }
    } else {
      TemplateEngine.#clearObject(state);
      TemplateEngine.#removeWithin(container);
    }
  }

  /**
   * Updater to manage an attribute which may be undefined.
   * In the following example, the "ifDefined" updater will remove the
   * attribute if it's undefined. Else, it sets the key-value pair.
   * ```js
   * html`<a href="${ifDefined(obj.href)}"></div>`;
   * ```
   * @param {any} value
   * @returns {any}
   */
  static ifDefined(value) {
    const symbol = Symbol();
    const updater = (type, lastValue, details) => TemplateEngine.#ifDefined(type, value, lastValue, details);
    updater.value = value;
    TemplateEngine.#updaterMap.set(symbol, updater);
    return symbol;
  }

  /**
   * Updater to manage an attribute which may not exist.
   * In the following example, the "nullish" updater will remove the
   * attribute if it's nullish. Else, it sets the key-value pair.
   * ```js
   * html`<a href="${nullish(obj.href)}"></div>`;
   * ```
   * @param {any} value
   * @returns {any}
   */
  static nullish(value) {
    const symbol = Symbol();
    const updater = (type, lastValue, details) => TemplateEngine.#nullish(type, value, lastValue, details);
    updater.value = value;
    TemplateEngine.#updaterMap.set(symbol, updater);
    return symbol;
  }

  /**
   * Updater to manage a property which may change outside the template engine.
   * Typically, properties are declaratively managed from state and efficient
   * value checking is used (i.e., "value !== lastValue"). However, if DOM state
   * is expected to change, the "live" updater can be used to essentially change
   * this check to "value !== node[property]".
   * ```js
   * html`<input .value="${live(obj.value)}"/>`;
   * ```
   * @param {any} value
   * @returns {any}
   */
  static live(value) {
    const symbol = Symbol();
    const updater = (type, lastValue, details) => TemplateEngine.#live(type, value, lastValue, details);
    updater.value = value;
    TemplateEngine.#updaterMap.set(symbol, updater);
    return symbol;
  }

  /**
   * Updater to inject trusted HTML into the DOM.
   * Use with caution. The "unsafeHTML" updater allows arbitrary input to be
   * parsed as HTML and injected into the DOM.
   * ```js
   * html`<div>${unsafeHTML(obj.trustedMarkup)}</div>`;
   * ```
   * @param {any} value
   * @returns {any}
   */
  static unsafeHTML(value) {
    const symbol = Symbol();
    const updater = (type, lastValue, details) => TemplateEngine.#unsafeHTML(type, value, lastValue, details);
    updater.value = value;
    TemplateEngine.#updaterMap.set(symbol, updater);
    return symbol;
  }

  /**
   * Updater to inject trusted SVG into the DOM.
   * Use with caution. The "unsafeSVG" updater allows arbitrary input to be
   * parsed as SVG and injected into the DOM.
   * ```js
   * html`
   *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
   *     ${unsafeSVG(obj.trustedMarkup)}
   *   </svg>
   * `;
   * ```
   * @param {any} value
   * @returns {any}
   */
  static unsafeSVG(value) {
    const symbol = Symbol();
    const updater = (type, lastValue, details) => TemplateEngine.#unsafeSVG(type, value, lastValue, details);
    updater.value = value;
    TemplateEngine.#updaterMap.set(symbol, updater);
    return symbol;
  }

  /**
   * Updater to manage a keyed array of templates (allows for DOM reuse).
   * ```js
   * html`
   *   <ul>
   *     ${map(items, item => item.id, item => html`<li>${item.value}</li>`)}
   *   </div>
   * `;
   * ```
   * @param {any[]} items
   * @param {Function} identify
   * @param {Function} callback
   * @returns {any}
   */
  static map(items, identify, callback) {
    if (typeof identify !== 'function') {
      throw new Error(`Unexpected map identify "${identify}" provided, expected a function.`);
    }
    if (typeof callback !== 'function') {
      throw new Error(`Unexpected map callback "${callback}" provided, expected a function.`);
    }
    return TemplateEngine.#mapOrRepeat(items, identify, callback, 'map');
  }

  /**
   * Shim for prior "repeat" function. Use "map".
   * @param {any[]} items
   * @param {Function} identify
   * @param {Function} [callback]
   * @returns {any}
   */
  static repeat(items, identify, callback) {
    if (arguments.length === 2) {
      callback = identify;
      identify = null;
    }
    if (arguments.length !== 2 && typeof identify !== 'function') {
      throw new Error(`Unexpected repeat identify "${identify}" provided, expected a function.`);
    } else if (typeof callback !== 'function') {
      throw new Error(`Unexpected repeat callback "${callback}" provided, expected a function.`);
    }
    return TemplateEngine.#mapOrRepeat(items, identify, callback, 'repeat');
  }

  /**
   * Default template engine interface — what you get inside “template”.
   * @returns {{[key: string]: Function}}
   */
  static get interface() {
    if (!TemplateEngine.#interface) {
      TemplateEngine.#interface = Object.freeze({
        render: TemplateEngine.render,
        html: TemplateEngine.html,
        svg: TemplateEngine.svg,
        map: TemplateEngine.map,
        nullish: TemplateEngine.nullish,

        // Help folks migrate from prior interface or plug it back in.
        live: TemplateEngine.live, // Kept as-is for now.
        unsafeHTML: TemplateEngine.unsafeHTML, // Kept as-is for now.
        unsafeSVG: TemplateEngine.unsafeSVG, // Kept as-is for now.
        ifDefined: TemplateEngine.ifDefined, // Kept as-is for now.
        repeat: TemplateEngine.repeat, // Wrapper around "map". We may deprecate these soon.
        asyncAppend: TemplateEngine.#interfaceRemoved('asyncAppend'), // Removed.
        asyncReplace: TemplateEngine.#interfaceRemoved('asyncReplace'), // Removed.
        cache: TemplateEngine.#interfaceRemoved('cache'), // Removed.
        classMap: TemplateEngine.#interfaceRemoved('classMap'), // Removed.
        directive: TemplateEngine.#interfaceRemoved('directive'), // Removed.
        guard: TemplateEngine.#interfaceRemoved('guard'), // Removed.
        styleMap: TemplateEngine.#interfaceRemoved('styleMap'), // Removed.
        templateContent: TemplateEngine.#interfaceRemoved('templateContent'), // Removed.
        until: TemplateEngine.#interfaceRemoved('until'), // Removed.
      });
    }
    return TemplateEngine.#interface;
  }

  static #mapOrRepeat(value, identify, callback, name) {
    const symbol = Symbol();
    const context = { identify, callback };
    const updater = (type, lastValue, details) => TemplateEngine.#map(type, value, lastValue, details, context, name);
    updater.value = value;
    TemplateEngine.#updaterMap.set(symbol, updater);
    return symbol;
  }

  static #exhaustString(string, state) {
    if (!state.inside) {
      // We're outside the opening tag.
      TemplateEngine.#OPEN.lastIndex = state.index;
      const openMatch = TemplateEngine.#OPEN.exec(string);
      if (openMatch) {
        state.inside = true;
        state.index = TemplateEngine.#OPEN.lastIndex;
        TemplateEngine.#exhaustString(string, state);
      }
    } else {
      // We're inside the opening tag.
      TemplateEngine.#STEP.lastIndex = state.index;
      let stepMatch = TemplateEngine.#STEP.exec(string);
      while (stepMatch) {
        state.index = TemplateEngine.#STEP.lastIndex;
        stepMatch = TemplateEngine.#STEP.exec(string);
      }
      TemplateEngine.#CLOSE.lastIndex = state.index;
      const closeMatch = TemplateEngine.#CLOSE.exec(string);
      if (closeMatch) {
        state.inside = false;
        state.index = TemplateEngine.#CLOSE.lastIndex;
        TemplateEngine.#exhaustString(string, state);
      }
    }
  }

  static #getInitialDirections(node, path) {
    path = path ?? [];
    const initialDirections = [];
    if (node.nodeType === Node.ELEMENT_NODE) {
      const attributesToRemove = new Set();
      for (const attribute of node.attributes) {
        const name = attribute.name;
        const type = name.startsWith(TemplateEngine.#ATTRIBUTE_PREFIXES.attribute)
          ? 'attribute'
          : name.startsWith(TemplateEngine.#ATTRIBUTE_PREFIXES.boolean)
            ? 'boolean'
            : name.startsWith(TemplateEngine.#ATTRIBUTE_PREFIXES.property)
              ? 'property'
              : null;
        if (type) {
          const prefix = TemplateEngine.#ATTRIBUTE_PREFIXES[type];
          const key = name.slice(prefix.length);
          const value = attribute.value;
          initialDirections.push({ path, key, type, name: value });
          attributesToRemove.add(name);
        }
      }
      for (const attribute of attributesToRemove) {
        node.removeAttribute(attribute);
      }
      // Special case to handle elements which only allow text content (no comments).
      const localName = node.localName;
      if (
        (localName === 'style' || localName === 'script') &&
        TemplateEngine.#CONTENT_REGEX.exec(node.textContent)
      ) {
        throw new Error(`Interpolation of "${localName}" tags is not allowed.`);
      } else if (
        localName === 'plaintext' ||
        localName === 'textarea' ||
        localName === 'title'
      ) {
        const contentMatch = TemplateEngine.#CONTENT_REGEX.exec(node.textContent);
        if (contentMatch) {
          initialDirections.push({ path, key: contentMatch[1], type: 'text' });
        }
      }
    } else if (node.nodeType === Node.COMMENT_NODE) {
      const contentMatch = TemplateEngine.#CONTENT_REGEX.exec(node.textContent);
      if (contentMatch) {
        node.textContent = '';
        const startNode = document.createComment('');
        node.parentNode.insertBefore(startNode, node);
        path[path.length - 1] = path[path.length - 1] + 1;
        initialDirections.push({ path, key: contentMatch[1], type: 'content' });
      }
    }
    let iii = 0;
    for (const childNode of node.childNodes) {
      initialDirections.push(...TemplateEngine.#getInitialDirections(childNode, [...path, iii++]));
    }
    return initialDirections;
  }

  static #fillInHtml(type, strings) {
    const htmlStrings = [];
    const state = { inside: false, index: 0 };
    for (let iii = 0; iii < strings.length; iii++) {
      let string = strings[iii];
      TemplateEngine.#exhaustString(string, state);
      if (state.inside) {
        TemplateEngine.#ATTRIBUTE.lastIndex = state.index;
        const attributeMatch = TemplateEngine.#ATTRIBUTE.exec(string);
        if (attributeMatch) {
          const name = attributeMatch[2];
          if (attributeMatch[1].startsWith('?')) {
            // We found a match like this: html`<div ?hidden="${!!value}"></div>`.
            string = string.slice(0, -3 - name.length) + `${TemplateEngine.#ATTRIBUTE_PREFIXES.boolean}${iii}="${name}`;
          } else {
            // We found a match like this: html`<div title="${value}"></div>`.
            string = string.slice(0, -2 - name.length) + `${TemplateEngine.#ATTRIBUTE_PREFIXES.attribute}${iii}="${name}`;
          }
          state.index = 1; // Accounts for an expected quote character next.
        } else {
          TemplateEngine.#PROPERTY.lastIndex = state.index;
          const propertyMatch = TemplateEngine.#PROPERTY.exec(string);
          if (propertyMatch) {
            // We found a match like this: html`<div .title="${value}"></div>`.
            const name = propertyMatch[1];
            string = string.slice(0, -3 - name.length) + `${TemplateEngine.#ATTRIBUTE_PREFIXES.property}${iii}="${name}`;
            state.index = 1; // Accounts for an expected quote character next.
          } else {
            // It’s “on or after” because interpolated JS can span multiple lines.
            const handled = [...strings.slice(0, iii), string.slice(0, state.index)].join('');
            const lineCount = handled.split('\n').length;
            throw new Error(`Found invalid template on or after line ${lineCount} in substring \`${string}\`. Failed to parse \`${string.slice(state.index)}\`.`);
          }
        }
      } else {
        // Assume it's a match like this: html`<div>${value}</div>`.
        string += `<!--${TemplateEngine.#CONTENT_PREFIX}${iii}-->`;
        state.index = 0; // No characters to account for. Reset to zero.
      }
      htmlStrings[iii] = string;
    }
    return type === 'svg'
      ? `<svg xmlns="http://www.w3.org/2000/svg">${htmlStrings.join('')}</svg>`
      : htmlStrings.join('');
  }

  static #getFinalDirections(initialDirections, content) {
    const finalDirections = [];
    const lookup = new Map();
    const find = path => {
      let node = content;
      for (const index of path) {
        const ref = node;
        node = TemplateEngine.#setIfMissing(lookup, node, () => ref.childNodes)[index];
      }
      return node;
    };
    for (const direction of initialDirections) {
      const node = find(direction.path);
      switch (direction.type) {
        case 'attribute':
        case 'boolean':
        case 'property': {
          finalDirections.push({ key: direction.key, type: direction.type, name: direction.name, node });
          break;
        }
        case 'content': {
          const startNode = node.previousSibling;
          finalDirections.push({ key: direction.key, type: direction.type, node, startNode });
          break;
        }
        case 'text': {
          finalDirections.push({ key: direction.key, type: direction.type, node });
          break;
        }
      }
    }
    return finalDirections;
  }

  static #attribute(type, value, lastValue, { node, name }) {
    if (value !== lastValue) {
      node.setAttribute(name, value);
    }
  }

  static #boolean(type, value, lastValue, { node, name }) {
    if (value !== lastValue) {
      value ? node.setAttribute(name, '') : node.removeAttribute(name);
    }
  }

  static #property(type, value, lastValue, { node, name }) {
    if (value !== lastValue) {
      node[name] = value;
    }
  }

  static #text(type, value, lastValue, { node }) {
    if (value !== lastValue) {
      node.textContent = value;
    }
  }

  static #content(type, value, lastValue, { node, startNode }) {
    if (value !== lastValue) {
      const state = TemplateEngine.#setIfMissing(TemplateEngine.#stateMap, startNode, () => ({}));
      if (TemplateEngine.#resultMap.has(value)) {
        const result = TemplateEngine.#resultMap.get(value);
        if (TemplateEngine.#cannotReuseResult(state.result, result)) {
          TemplateEngine.#removeBetween(startNode, node);
          TemplateEngine.#clearObject(state);
          TemplateEngine.#ready(result);
          TemplateEngine.#commit(result);
          TemplateEngine.#inject(result, node, { before: true });
          state.result = result;
        } else {
          TemplateEngine.#assign(state.result, result);
          TemplateEngine.#commit(state.result);
        }
      } else if (Array.isArray(value)) {
        TemplateEngine.#mapInner(state, node, startNode, null, null, value, 'array');
      } else {
        if (state.result) {
          TemplateEngine.#removeBetween(startNode, node);
          TemplateEngine.#clearObject(state);
        }
        const previousSibling = node.previousSibling;
        if (previousSibling === startNode) {
          const textNode = document.createTextNode(value ?? '');
          node.parentNode.insertBefore(textNode, node);
        } else {
          previousSibling.textContent = value ?? '';
        }
      }
    }
  }

  static #ifDefined(type, value, lastValue, { node, name }) {
    if (type === 'attribute') {
      if (value !== lastValue) {
        value !== undefined
          ? node.setAttribute(name, value)
          : node.removeAttribute(name);
      }
    } else {
      throw new Error(`The ifDefined update must be used on ${TemplateEngine.#getTypeText('attribute')}, not on ${TemplateEngine.#getTypeText(type)}.`);
    }
  }

  static #nullish(type, value, lastValue, { node, name }) {
    if (type === 'attribute') {
      if (value !== lastValue) {
        value !== undefined && value !== null
          ? node.setAttribute(name, value)
          : node.removeAttribute(name);
      }
    } else {
      throw new Error(`The nullish update must be used on ${TemplateEngine.#getTypeText('attribute')}, not on ${TemplateEngine.#getTypeText(type)}.`);
    }
  }

  static #live(type, value, lastValue, { node, name }) {
    if (type === 'property') {
      if (node[name] !== value) {
        node[name] = value;
      }
    } else {
      throw new Error(`The live update must be used on ${TemplateEngine.#getTypeText('property')}, not on ${TemplateEngine.#getTypeText(type)}.`);
    }
  }

  static #unsafeHTML(type, value, lastValue, { node, startNode }) {
    if (type === 'content') {
      if (value !== lastValue) {
        if (typeof value === 'string') {
          const template = document.createElement('template');
          template.innerHTML = value;
          TemplateEngine.#removeBetween(startNode, node);
          TemplateEngine.#insertAllBefore(template.content.childNodes, node);
        } else {
          throw new Error(`Unexpected unsafeHTML value "${value}".`);
        }
      }
    } else {
      throw new Error(`The unsafeHTML update must be used on ${TemplateEngine.#getTypeText('content')}, not on ${TemplateEngine.#getTypeText(type)}.`);
    }
  }

  static #unsafeSVG(type, value, lastValue, { node, startNode }) {
    if (type === 'content') {
      if (value !== lastValue) {
        if (typeof value === 'string') {
          const template = document.createElement('template');
          template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${value}</svg>`;
          TemplateEngine.#removeBetween(startNode, node);
          TemplateEngine.#insertAllBefore(template.content.firstChild.childNodes, node);
        } else {
          throw new Error(`Unexpected unsafeSVG value "${value}".`);
        }
      }
    } else {
      throw new Error(`The unsafeSVG update must be used on ${TemplateEngine.#getTypeText('content')}, not on ${TemplateEngine.#getTypeText(type)}.`);
    }
  }

  static #mapInner(state, node, startNode, identify, callback, inputs, name) {
    if (!state.map) {
      TemplateEngine.#clearObject(state);
      state.map = new Map();
      let index = 0;
      for (const input of inputs) {
        const reference = callback ? callback(input, index) : input;
        const result = TemplateEngine.#resultMap.get(reference);
        if (result) {
          const id = identify ? identify(input, index) : String(index);
          const cursors = TemplateEngine.#createCursors(node);
          TemplateEngine.#ready(result);
          TemplateEngine.#commit(result);
          TemplateEngine.#inject(result, cursors.node, { before: true });
          state.map.set(id, { id, result, ...cursors });
        } else {
          throw new Error(`Unexpected ${name} value "${reference}" provided by callback.`);
        }
        index++;
      }
    } else {
      let lastItem;
      const ids = new Set();
      let index = 0;
      for (const input of inputs) {
        const reference = callback ? callback(input, index) : input;
        const result = TemplateEngine.#resultMap.get(reference);
        if (result) {
          const id = identify ? identify(input, index) : String(index);
          if (state.map.has(id)) {
            const item = state.map.get(id);
            if (TemplateEngine.#cannotReuseResult(item.result, result)) {
              // Add new comment cursors before removing old comment cursors.
              const cursors = TemplateEngine.#createCursors(item.startNode);
              TemplateEngine.#removeThrough(item.startNode, item.node);
              TemplateEngine.#ready(result);
              TemplateEngine.#commit(result);
              TemplateEngine.#inject(result, cursors.node, { before: true });
              Object.assign(item, { result, ...cursors });
            } else {
              TemplateEngine.#assign(item.result, result);
              TemplateEngine.#commit(item.result);
            }
          } else {
            const cursors = TemplateEngine.#createCursors(node);
            TemplateEngine.#ready(result);
            TemplateEngine.#commit(result);
            TemplateEngine.#inject(result, cursors.node, { before: true });
            const item = { id, result, ...cursors };
            state.map.set(id, item);
          }
          const item = state.map.get(id);
          const referenceNode = lastItem ? lastItem.node.nextSibling : startNode.nextSibling;
          if (referenceNode !== item.startNode) {
            const nodesToMove = [item.startNode];
            while (nodesToMove[nodesToMove.length - 1] !== item.node) {
              nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
            }
            TemplateEngine.#insertAllBefore(nodesToMove, referenceNode);
          }
          TemplateEngine.#commit(item.result);
          ids.add(item.id);
          lastItem = item;
        } else {
          throw new Error(`Unexpected ${name} value "${reference}" provided by callback.`);
        }
        index++;
      }
      for (const [id, item] of state.map.entries()) {
        if (!ids.has(id)) {
          TemplateEngine.#removeThrough(item.startNode, item.node);
          state.map.delete(id);
        }
      }
    }
  }

  static #map(type, value, lastValue, { node, startNode }, { identify, callback }, name) {
    if (type === 'content') {
      if (Array.isArray(value)) {
        const state = TemplateEngine.#setIfMissing(TemplateEngine.#stateMap, startNode, () => ({}));
        TemplateEngine.#mapInner(state, node, startNode, identify, callback, value, name);
      } else {
        throw new Error(`Unexpected ${name} value "${value}".`);
      }
    } else {
      throw new Error(`The ${name} update must be used on ${TemplateEngine.#getTypeText('content')}, not on ${TemplateEngine.#getTypeText(type)}.`);
    }
  }

  static #createResult(type, strings, values) {
    const lastValues = values.map(() => TemplateEngine.#UNSET);
    const injected = false;
    return { type, strings, values, lastValues, injected };
  }

  static #createCursors(referenceNode) {
    const startNode = document.createComment('');
    const node = document.createComment('');
    referenceNode.parentNode.insertBefore(startNode, referenceNode);
    referenceNode.parentNode.insertBefore(node, referenceNode);
    return { startNode, node };
  }

  static #getAnalysis(result) {
    const { type, strings } = result;
    const analysis = TemplateEngine.#setIfMissing(TemplateEngine.#analysisMap, strings, () => ({}));
    if (!analysis.done) {
      analysis.done = true;
      const initialElement = document.createElement('template');
      initialElement.innerHTML = TemplateEngine.#fillInHtml(type, strings);
      const initialDirections = TemplateEngine.#getInitialDirections(initialElement.content); // mutates element.
      Object.assign(analysis, { initialElement, initialDirections });
    }
    return analysis;
  }

  static #ready(result) {
    if (result.injected) {
      throw new Error(`Unexpected re-injection of template result.`);
    }
    result.injected = true;
    const { initialElement, initialDirections } = TemplateEngine.#getAnalysis(result);
    const element = initialElement.cloneNode(true);
    result.directions = TemplateEngine.#getFinalDirections(initialDirections, element.content);
    result.element = element;
  }

  static #inject(result, node, options) {
    options?.before
      ? result.type === 'svg'
        ? TemplateEngine.#insertAllBefore(result.element.content.firstChild.childNodes, node)
        : TemplateEngine.#insertAllBefore(result.element.content.childNodes, node)
      : result.type === 'svg'
        ? node.append(...result.element.content.firstChild.childNodes)
        : node.append(result.element.content);
    result.element = null;
  }

  static #assign(result, newResult) {
    result.lastValues = result.values;
    result.values = newResult.values;
  }

  static #commit(result) {
    const { directions, values, lastValues } = result;
    for (const { key, type, node, startNode, name } of directions) {
      const lastUpdater = TemplateEngine.#updaterMap.get(lastValues[key]);
      const lastValue = lastUpdater ? lastUpdater.value : lastValues[key];
      const updater = TemplateEngine.#updaterMap.get(values[key]);
      switch (type) {
        case 'attribute':
          updater
            ? updater(type, lastValue, { node, name })
            : TemplateEngine.#attribute(type, values[key], lastValue, { node, name });
          break;
        case 'boolean':
          updater
            ? updater(type, lastValue, { node, name })
            : TemplateEngine.#boolean(type, values[key], lastValue, { node, name });
          break;
        case 'property':
          updater
            ? updater(type, lastValue, { node, name })
            : TemplateEngine.#property(type, values[key], lastValue, { node, name });
          break;
        case 'content':
          updater
            ? updater(type, lastValue, { node, startNode })
            : TemplateEngine.#content(type, values[key], lastValue, { node, startNode });
          break;
        case 'text':
          updater
            ? updater(type, lastValue, { node })
            : TemplateEngine.#text(type, values[key], lastValue, { node });
          break;
      }
    }
  }

  static #cannotReuseResult(result, newResult) {
    return (
      result?.type !== newResult.type || result?.strings !== newResult.strings
    );
  }

  static #insertAllBefore(childNodes, node) {
    for (const childNode of [...childNodes]) {
      node.parentNode.insertBefore(childNode, node);
    }
  }

  static #removeWithin(node) {
    while(node.firstChild) {
      node.firstChild.remove();
    }
  }

  static #removeBetween(startNode, node) {
    while(node.previousSibling !== startNode) {
      node.previousSibling.remove();
    }
  }

  static #removeThrough(startNode, node) {
    TemplateEngine.#removeBetween(startNode, node);
    startNode.remove();
    node.remove();
  }

  static #clearObject(object) {
    for (const key of Object.keys(object)) {
      delete object[key];
    }
  }

  static #setIfMissing(map, key, callback) {
    // Values set in this file are ALL truthy, so "get" is used (versus "has").
    let value = map.get(key);
    if (!value) {
      value = callback();
      map.set(key, value);
    }
    return value;
  }

  static #getTypeText(type) {
    switch (type) {
      case 'attribute':
        return 'an attribute';
      case 'boolean':
        return 'a boolean attribute';
      case 'property':
        return 'a property';
      case 'content':
        return 'content';
      case 'text':
        return 'text content';
    }
  }

  static #interfaceRemoved (name) {
    return () => {
      throw new Error(`Removed "${name}" from default templating engine interface. Import and plug-in "lit-html" as your element's templating engine if you want this functionality.`);
    };
  }
}
