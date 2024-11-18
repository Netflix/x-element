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
  // Special markers added to markup enabling discovery post-instantiation.
  static #NEXT_MARKER = 'x-element-next:'; // The ":" helps for debugging.
  static #CONTENT_MARKER = 'x-element-content';

  // Types of bindings that we can have.
  static #ATTRIBUTE = 'attribute';
  static #BOOLEAN = 'boolean';
  static #DEFINED = 'defined';
  static #PROPERTY = 'property';
  static #CONTENT = 'content';
  static #TEXT = 'text';

  // Patterns to find special edges in original html strings.
  static #OPEN_REGEX = /<[a-z][a-z0-9-]*(?=\s)/g;
  static #STEP_REGEX = /(?:\s+[a-z][a-z0-9-]*(?=[\s>])|\s+[a-z][a-zA-Z0-9-]*="[^"]*")+/y;
  static #ATTRIBUTE_OR_PROPERTY_REGEX = /\s+(?:(?<questions>\?{0,2})?(?<attribute>([a-z][a-zA-Z0-9-]*))|\.(?<property>[a-z][a-zA-Z0-9_]*))="$/y;
  static #CLOSE_REGEX = />/g;

  // Sentinels to manage internal state on nodes.
  static #STATE = Symbol();
  static #ARRAY_STATE = Symbol();

  // Sentinel to initialize the “last values” array.
  static #UNSET = Symbol();

  // Sentinel to identify result.
  static #RESULT = Symbol();

  // Mapping of tagged template function “strings” to caches computations.
  static #stringsToAnalysis = new WeakMap();

  /**
   * Default template engine interface — what you get inside “template”.
   * @type {{[key: string]: Function}}
   */
  static interface = Object.freeze({
    render: TemplateEngine.render,
    html: TemplateEngine.html,
    svg: TemplateEngine.svg,
  });

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
    return { [TemplateEngine.#RESULT]: true, type: 'html', strings, values };
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
    return { [TemplateEngine.#RESULT]: true, type: 'svg', strings, values };
  }

  /**
   * Core rendering entry point for x-element template engine.
   * Accepts a "container" element and renders the given "result" into it.
   * @param {HTMLElement} container
   * @param {any} resultReference
   */
  static render(container, resultReference) {
    container[TemplateEngine.#STATE] ??= {};
    const state = container[TemplateEngine.#STATE];
    if (resultReference) {
      const result = resultReference?.[TemplateEngine.#RESULT] ? resultReference : null;
      if (TemplateEngine.#cannotReuseResult(state.result, result)) {
        TemplateEngine.#removeWithin(container);
        TemplateEngine.#inject(result, container);
        state.result = result;
      } else {
        TemplateEngine.#update(state.result, result);
      }
    } else {
      TemplateEngine.#clearObject(state);
      TemplateEngine.#removeWithin(container);
    }
  }

  // Walk through each string from our tagged template function “strings” array
  //  in a stateful way so that we know what kind of bindings are implied at
  //  each interpolated value.
  static #exhaustString(string, state, context) {
    if (!state.inside) {
      // We're outside the opening tag.
      TemplateEngine.#OPEN_REGEX.lastIndex = state.index;
      const openMatch = TemplateEngine.#OPEN_REGEX.exec(string);
      if (openMatch) {
        state.inside = true;
        state.index = TemplateEngine.#OPEN_REGEX.lastIndex;
        state.lastOpenContext = context;
        state.lastOpenIndex = openMatch.index;
        TemplateEngine.#exhaustString(string, state, context);
      }
    } else {
      // We're inside the opening tag.
      TemplateEngine.#STEP_REGEX.lastIndex = state.index;
      const stepMatch = TemplateEngine.#STEP_REGEX.exec(string);
      if (stepMatch) {
        state.index = TemplateEngine.#STEP_REGEX.lastIndex;
      }
      TemplateEngine.#CLOSE_REGEX.lastIndex = state.index;
      const closeMatch = TemplateEngine.#CLOSE_REGEX.exec(string);
      if (closeMatch) {
        state.inside = false;
        state.index = TemplateEngine.#CLOSE_REGEX.lastIndex;
        TemplateEngine.#exhaustString(string, state, context);
      }
    }
  }

  // Flesh out an html string from our tagged template function “strings” array
  //  and add special markers that we can detect later, after instantiation.
  //
  // E.g., the user might have passed this interpolation:
  //
  // <div id="foo-bar-baz" foo="${foo}" bar="${bar}" .baz="${baz}">
  //   ${content}
  // </div>
  //
  // … and we would instrument it as follows:
  //
  // <!--x-element-next:attribute=foo,attribute=bar,attribute=baz--><div id="foo-bar-baz">
  //   <!--x-element-content-->
  // </div>
  //
  static #createHtml(type, strings) {
    const keyToKeyState = new Map();
    const htmlStrings = [];
    const state = { inside: false, index: 0, lastOpenContext: 0, lastOpenIndex: 0 };
    // We don’t have to test the last string since it is already on the other
    //  side of the last interpolation, by definition. Hence the “- 1” below.
    //  Note that this final string is added just after the loop completes.
    for (let iii = 0; iii < strings.length - 1; iii++) {
      // The index may be set to “1” here, which indicates we are slicing off a
      //  trailing quote character from a attribute-or-property match. After
      //  slicing, we reset the index to zero so regular expressions know to
      //  match from the start in “exhaustString”.
      let string = strings[iii];
      if (state.index !== 0) {
        string = string.slice(state.index);
        state.index = 0;
      }
      TemplateEngine.#exhaustString(string, state, iii);
      if (state.inside) {
        TemplateEngine.#ATTRIBUTE_OR_PROPERTY_REGEX.lastIndex = state.index;
        const match = TemplateEngine.#ATTRIBUTE_OR_PROPERTY_REGEX.exec(string);
        if (match) {
          const { questions, attribute, property } = match.groups;
          if (attribute) {
            // We found a match like this: html`<div hidden="${value}"></div>`.
            //                  … or this: html`<div ?hidden="${value}"></div>`.
            //                  … or this: html`<div ??hidden="${value}"></div>`.
            // Syntax is 3-5 characters: `${questions}${attribute}="` + `"`.
            let syntax = 3;
            let kind = TemplateEngine.#ATTRIBUTE;
            switch (questions) {
              case '??': kind = TemplateEngine.#DEFINED; syntax = 5; break;
              case '?': kind = TemplateEngine.#BOOLEAN; syntax = 4; break;
            }
            string = string.slice(0, -syntax - attribute.length);
            const key = state.lastOpenContext;
            const keyState = TemplateEngine.#setIfMissing(keyToKeyState, key, () => ({ index: state.lastOpenIndex, items: [] }));
            keyState.items.push(`${kind}=${attribute}`);
          } else {
            // We found a match like this: html`<div .title="${value}"></div>`.
            // Syntax is 4 characters: `.${property}="` + `"`.
            const syntax = 4;
            const kind = TemplateEngine.#PROPERTY;
            string = string.slice(0, -syntax - property.length);
            const key = state.lastOpenContext;
            const keyState = TemplateEngine.#setIfMissing(keyToKeyState, key, () => ({ index: state.lastOpenIndex, items: [] }));
            keyState.items.push(`${kind}=${property}`);
          }
          state.index = 1; // Accounts for an expected quote character next.
        } else {
          // It’s “on or after” because interpolated JS can span multiple lines.
          const handled = [...strings.slice(0, iii), string.slice(0, state.index)].join('');
          const lineCount = handled.split('\n').length;
          throw new Error(`Found invalid template on or after line ${lineCount} in substring \`${string}\`. Failed to parse \`${string.slice(state.index)}\`.`);
        }
      } else {
        // Assume it’s a match like this: html`<div>${value}</div>`.
        string += `<!--${TemplateEngine.#CONTENT_MARKER}-->`;
        state.index = 0; // No characters to account for. Reset to zero.
      }
      htmlStrings[iii] = string;
    }
    // Again, there might be a quote we need to slice off here still.
    let lastString = strings.at(-1);
    if (state.index > 0) {
      lastString = lastString.slice(state.index);
    }
    htmlStrings.push(lastString);
    for (const [iii, { index, items }] of keyToKeyState.entries()) {
      const comment = `<!--${TemplateEngine.#NEXT_MARKER}${items.join(',')}-->`;
      const htmlString = htmlStrings[iii];
      htmlStrings[iii] = `${htmlString.slice(0, index)}${comment}${htmlString.slice(index)}`;
    }
    const html = htmlStrings.join('');
    return type === 'svg'
      ? `<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`
      : html;
  }

  static #createFragment(type, strings) {
    const template = document.createElement('template');
    const html = TemplateEngine.#createHtml(type, strings);
    template.innerHTML = html;
    return template.content;
  }

  // Walk through our fragment that we added special markers to and collect
  //  paths to each future target. We use “paths” because each future instance
  //  will clone this fragment and so paths are all we can really cache. And,
  //  while we go through, clean up our bespoke markers.
  // Note that we are always walking the interpolated strings and the resulting,
  //  instantiated DOM _in the same depth-first manner_. This means that the
  //  ordering is fairly reliable.
  //
  // For example, we walk this structure:
  //
  // <!--x-element-next:attribute=foo,attribute=bar,attribute=baz--><div id="foo-bar-baz">
  //   <!--x-element-content-->
  // </div>
  //
  // And end up with this (which is ready to be injected into a container):
  //
  // <div id="foo-bar-baz">
  //   <!---->
  //   <!---->
  // </div>
  //
  static #findLookups(node, nodeType = Node.DOCUMENT_FRAGMENT_NODE, lookups = [], path = []) {
    // @ts-ignore — TypeScript doesn’t seem to understand the nodeType param.
    if (nodeType === Node.ELEMENT_NODE) {
      // Special case to handle elements which only allow text content (no comments).
      const { localName } = node;
      if (
        (localName === 'style' || localName === 'script') &&
        node.textContent.includes(TemplateEngine.#CONTENT_MARKER)
      ) {
        throw new Error(`Interpolation of "${localName}" tags is not allowed.`);
      } else if (localName === 'textarea' || localName === 'title') {
        if (node.textContent.includes(TemplateEngine.#CONTENT_MARKER)) {
          if (node.textContent === `<!--${TemplateEngine.#CONTENT_MARKER}-->`) {
            node.textContent = '';
            lookups.push({ path, type: TemplateEngine.#TEXT });
          } else {
            throw new Error(`Only basic interpolation of "${localName}" tags is allowed.`);
          }
        }
      }
    }
    if (nodeType === Node.DOCUMENT_FRAGMENT_NODE || nodeType === Node.ELEMENT_NODE) {
      // It’s expensive to make a copy of “childNodes”. Instead, we carefully
      //  manage our index as we iterate over the live collection.
      const childNodes = node.childNodes;
      for (let iii = 0; iii < node.childNodes.length; iii++) {
        const childNode = childNodes[iii];
        const childNodeType = childNode.nodeType;
        if (childNodeType === Node.COMMENT_NODE) {
          const textContent = childNode.textContent;
          if (textContent.startsWith(TemplateEngine.#CONTENT_MARKER)) {
            childNode.textContent = '';
            const startNode = document.createComment('');
            node.insertBefore(startNode, childNode);
            iii++;
            lookups.push({ path: [...path, iii], type: TemplateEngine.#CONTENT });
          } else if (textContent.startsWith(TemplateEngine.#NEXT_MARKER)) {
            const data = textContent.slice(TemplateEngine.#NEXT_MARKER.length);
            const items = data.split(',');
            for (const item of items) {
              const [type, name] = item.split('=');
              lookups.push({ path: [...path, iii], type, name });
            }
            iii--;
            node.removeChild(childNode);
          }
        } else if (childNodeType === Node.ELEMENT_NODE) {
          TemplateEngine.#findLookups(childNode, childNodeType, lookups, [...path, iii]);
        }
      }
    }
    if (nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      return lookups;
    }
  }

  // After cloning our common fragment, we use the “lookups” to cache live
  //  references to DOM nodes so that we can surgically perform updates later in
  //  an efficient manner. Lookups are like directions to find our real targets.
  static #findTargets(fragment, lookups) {
    const targets = [];
    const cache = new Map();
    const find = path => {
      let node = fragment;
      for (const index of path) {
        const ref = node;
        node = TemplateEngine.#setIfMissing(cache, node, () => ref.childNodes)[index];
      }
      return node;
    };
    for (const { path, type, name } of lookups) {
      const node = find(path);
      switch (type) {
        case TemplateEngine.#ATTRIBUTE:
          targets.push(TemplateEngine.#commitAttribute.bind(null, node, name));
          break;
        case TemplateEngine.#BOOLEAN:
          targets.push(TemplateEngine.#commitBoolean.bind(null, node, name));
          break;
        case TemplateEngine.#DEFINED:
          targets.push(TemplateEngine.#commitDefined.bind(null, node, name));
          break;
        case TemplateEngine.#PROPERTY:
          targets.push(TemplateEngine.#commitProperty.bind(null, node, name));
          break;
        case TemplateEngine.#CONTENT:
          targets.push(TemplateEngine.#commitContent.bind(null, node, node.previousSibling));
          break;
        case TemplateEngine.#TEXT:
          targets.push(TemplateEngine.#commitText.bind(null, node));
          break;
      }
    }
    return targets;
  }

  // Loops over given inputs to either create-or-update a list of nodes.
  static #list(node, startNode, inputs, category) {
    startNode[TemplateEngine.#ARRAY_STATE] ??= {};
    const arrayState = startNode[TemplateEngine.#ARRAY_STATE];
    if (!arrayState.map) {
      // There is no mapping in our state — we have a clean slate to work with.
      TemplateEngine.#clearObject(arrayState);
      arrayState.map = new Map();
      const ids = new Set();
      let index = 0;
      for (const input of inputs) {
        let id = String(index);
        let reference = input;
        if (category === 'map') {
          [id, reference] = input;
        }
        if (ids.has(id)) {
          throw new Error(`Unexpected duplicate id found in ${category} "${id}".`);
        }
        ids.add(id);
        const result = reference?.[TemplateEngine.#RESULT] ? reference : null;
        if (result) {
          const cursors = TemplateEngine.#createCursors(node);
          TemplateEngine.#inject(result, cursors.node, true);
          arrayState.map.set(id, { id, result, ...cursors });
        } else {
          throw new Error(`Unexpected ${category} value "${reference}" provided by callback.`);
        }
        index++;
      }
    } else {
      // A mapping has already been created — we need to update the items.
      let lastItem;
      const ids = new Set();
      let index = 0;
      for (const input of inputs) {
        let id = String(index);
        let reference = input;
        if (category === 'map') {
          [id, reference] = input;
        }
        if (ids.has(id)) {
          throw new Error(`Unexpected duplicate id found in ${category} "${id}".`);
        }
        ids.add(id);
        const result = reference?.[TemplateEngine.#RESULT] ? reference : null;
        if (result) {
          if (arrayState.map.has(id)) {
            const item = arrayState.map.get(id);
            if (TemplateEngine.#cannotReuseResult(item.result, result)) {
              // Add new comment cursors before removing old comment cursors.
              const cursors = TemplateEngine.#createCursors(item.startNode);
              TemplateEngine.#removeThrough(item.startNode, item.node);
              TemplateEngine.#inject(result, cursors.node, true);
              Object.assign(item, { result, ...cursors });
            } else {
              TemplateEngine.#update(item.result, result);
            }
          } else {
            const cursors = TemplateEngine.#createCursors(node);
            TemplateEngine.#inject(result, cursors.node, true);
            const item = { id, result, ...cursors };
            arrayState.map.set(id, item);
          }
          const item = arrayState.map.get(id);
          const referenceNode = lastItem ? lastItem.node.nextSibling : startNode.nextSibling;
          if (referenceNode !== item.startNode) {
            const nodesToMove = [item.startNode];
            while (nodesToMove[nodesToMove.length - 1] !== item.node) {
              nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
            }
            TemplateEngine.#insertAllBefore(referenceNode.parentNode, referenceNode, nodesToMove);
          }
          lastItem = item;
        } else {
          throw new Error(`Unexpected ${category} value "${reference}" provided by callback.`);
        }
        index++;
      }
      for (const [id, item] of arrayState.map.entries()) {
        if (!ids.has(id)) {
          TemplateEngine.#removeThrough(item.startNode, item.node);
          arrayState.map.delete(id);
        }
      }
    }
  }

  static #commitAttribute(node, name, value, lastValue) {
    if (value !== lastValue) {
      node.setAttribute(name, value);
    }
  }

  static #commitBoolean(node, name, value, lastValue) {
    if (value !== lastValue) {
      value ? node.setAttribute(name, '') : node.removeAttribute(name);
    }
  }

  static #commitDefined(node, name, value, lastValue) {
    if (value !== lastValue) {
      value === undefined || value === null
        ? node.removeAttribute(name)
        : node.setAttribute(name, value);
    }
  }

  static #commitProperty(node, name, value, lastValue) {
    if (value !== lastValue) {
      node[name] = value;
    }
  }

  static #commitContent(node, startNode, value, lastValue) {
    const category = TemplateEngine.#getValueCategory(value);
    const lastCategory = TemplateEngine.#getValueCategory(lastValue);
    if (lastValue !== TemplateEngine.#UNSET && category !== lastCategory) {
      // Reset content under certain conditions. E.g., `[…]` >> `null`.
      node[TemplateEngine.#STATE] ??= {};
      const state = node[TemplateEngine.#STATE];
      startNode[TemplateEngine.#ARRAY_STATE] ??= {};
      const arrayState = startNode[TemplateEngine.#ARRAY_STATE];
      TemplateEngine.#removeBetween(startNode, node);
      TemplateEngine.#clearObject(state);
      TemplateEngine.#clearObject(arrayState);
    }
    if (value !== lastValue) {
      if (category === 'array' || category === 'map') {
        TemplateEngine.#list(node, startNode, value, category);
      } else if (category === 'result') {
        node[TemplateEngine.#STATE] ??= {};
        const state = node[TemplateEngine.#STATE];
        const result = value;
        if (TemplateEngine.#cannotReuseResult(state.result, result)) {
          TemplateEngine.#removeBetween(startNode, node);
          TemplateEngine.#clearObject(state);
          TemplateEngine.#inject(result, node, true);
          state.result = result;
        } else {
          TemplateEngine.#update(state.result, result);
        }
      } else if (category === 'fragment') {
        if (value.childElementCount === 0) {
          throw new Error(`Unexpected child element count of zero for given DocumentFragment.`);
        }
        const previousSibling = node.previousSibling;
        if (previousSibling !== startNode) {
          TemplateEngine.#removeBetween(startNode, node);
        }
        node.parentNode.insertBefore(value, node);
      } else {
        const previousSibling = node.previousSibling;
        if (previousSibling === startNode) {
          // The `?? ''` is a shortcut for creating a text node and then
          //  setting its textContent. It’s exactly equivalent to the
          //  following code, but faster.
          // const textNode = document.createTextNode('');
          // textNode.textContent = value;
          const textNode = document.createTextNode(value ?? '');
          node.parentNode.insertBefore(textNode, node);
        } else {
          previousSibling.textContent = value;
        }
      }
    }
  }

  static #commitText(node, value, lastValue) {
    if (value !== lastValue) {
      node.textContent = value;
    }
  }

  // Bind the current values from a result by walking through each target and
  //  updating the DOM if things have changed.
  static #commit(result) {
    result.lastValues ??= result.values.map(() => TemplateEngine.#UNSET);
    const { targets, values, lastValues } = result;
    for (let iii = 0; iii < targets.length; iii++) {
      const target = targets[iii];
      const value = values[iii];
      const lastValue = lastValues[iii];
      target(value, lastValue);
    }
  }

  // Inject a given result into a node for the first time. If we’ve never seen
  //  the template “strings” before, we also have to generate html, parse it,
  //  and find out binding targets. Then, we commit the values by iterating over
  //  our targets. Finally, we actually attach our new DOM into our node.
  static #inject(result, node, before) {
    // If we see the _exact_ same result again… that’s an error. We don’t allow
    //  integrators to reuse template results.
    if (result.readied) {
      throw new Error(`Unexpected re-injection of template result.`);
    }

    // Create and prepare a document fragment to be injected.
    result.readied = true;
    const { type, strings } = result;
    const analysis = TemplateEngine.#setIfMissing(TemplateEngine.#stringsToAnalysis, strings, () => ({}));
    if (!analysis.done) {
      analysis.done = true;
      const fragment = TemplateEngine.#createFragment(type, strings);
      const lookups = TemplateEngine.#findLookups(fragment);
      Object.assign(analysis, { fragment, lookups });
    }
    const fragment = analysis.fragment.cloneNode(true);
    const targets = TemplateEngine.#findTargets(fragment, analysis.lookups);
    Object.assign(result, { fragment, targets });

    // Bind values via our live targets into our disconnected DOM.
    TemplateEngine.#commit(result);

    // Attach a document fragment into the node. Note that all the DOM in the
    //  fragment will already have values correctly committed on the line above.
    const nodes = result.type === 'svg'
      ? result.fragment.firstChild.childNodes
      : result.fragment.childNodes;
    before
      ? TemplateEngine.#insertAllBefore(node.parentNode, node, nodes)
      : TemplateEngine.#insertAllBefore(node, null, nodes);
    result.fragment = null;
  }

  static #update(result, newResult) {
    result.lastValues = result.values;
    result.values = newResult.values;
    TemplateEngine.#commit(result);
  }

  static #getValueCategory(value) {
    if (value?.[TemplateEngine.#RESULT]) {
      return 'result';
    } else if (Array.isArray(value)) {
      return Array.isArray(value[0]) ? 'map' : 'array';
    } else if (value instanceof DocumentFragment) {
      return 'fragment';
    } else {
      return 'basic';
    }
  }

  static #cannotReuseResult(result, newResult) {
    return (
      result?.strings !== newResult.strings || result?.type !== newResult.type
    );
  }

  static #createCursors(referenceNode) {
    const startNode = document.createComment('');
    const node = document.createComment('');
    referenceNode.parentNode.insertBefore(startNode, referenceNode);
    referenceNode.parentNode.insertBefore(node, referenceNode);
    return { startNode, node };
  }

  static #insertAllBefore(parentNode, referenceNode, nodes) {
    // Make a copy of the array, else the live NodeList will be mutated as you
    //  iterate — which would cause us to miss nodes.
    // Note that passing “null” as the reference node appends nodes to the end.
    for (const node of [...nodes]) {
      parentNode.insertBefore(node, referenceNode);
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

  // TODO: Replace with Map.prototype.getOrInsert when TC39 proposal lands.
  //  https://github.com/tc39/proposal-upsert
  static #setIfMissing(map, key, callback) {
    // Values set in this file are ALL truthy, so "get" is used (versus "has").
    let value = map.get(key);
    if (!value) {
      value = callback();
      map.set(key, value);
    }
    return value;
  }
}
