/** Base element class for creating custom elements. */
export default class XElement extends HTMLElement {
  /** Extends HTMLElement.observedAttributes to handle the properties block. */
  static get observedAttributes() {
    XElement.#analyzeConstructor(this);
    return [...XElement.#constructors.get(this).attributeMap.keys()];
  }

  /** Default templating engine. Use "templateEngine" to override. */
  static get defaultTemplateEngine() {
    return TemplateEngine.interface;
  }

  /** Configured templating engine. Defaults to "defaultTemplateEngine".
   *
   * Override this as needed if x-element's default template engine does not
   * meet your needs. A "render" method is the only required field. An "html"
   * tagged template literal is expected, but not strictly required.
   */
  static get templateEngine() {
    return XElement.defaultTemplateEngine;
  }

  /**
   * Declare watched properties (and related attributes) on an element.
   *
   *   static get properties() {
   *     return {
   *       property1: {
   *         type: String,
   *       },
   *       property2: {
   *         type: Number,
   *         input: ['property1'],
   *         compute: this.computeProperty2,
   *         reflect: true,
   *         observe: this.observeProperty2,
   *         default: 0,
   *       }
   *     };
   *   }
   */
  static get properties() {
    return {};
  }

  /**
   * Declare event handlers on an element.
   *
   *   static get listeners() {
   *     return {
   *       click: this.onClick,
   *     }
   *   }
   *
   * Note that listeners are added to the element's render root. Listeners are
   * added during "connectedCallback" and removed during "disconnectedCallback".
   *
   * The arguments passed to your callback are always "(host, event)".
   */
  static get listeners() {
    return {};
  }

  /**
   * Customize shadow root initialization and optionally forgo encapsulation.
   *
   * E.g., setup focus delegation or return host instead of host.shadowRoot.
   */
  static createRenderRoot(host) {
    return host.attachShadow({ mode: 'open' });
  }

  /**
   * Setup template callback to update DOM when properties change.
   *
   *   static template(html, { nullish }) {
   *     return (href) => {
   *       return html`<a href=${nullish(href)}>click me</a>`;
   *     }
   *   }
   */
  static template(html, engine) { // eslint-disable-line no-unused-vars
    return (properties, host) => {}; // eslint-disable-line no-unused-vars
  }

  /** Standard instance constructor. */
  constructor() {
    super();
    XElement.#constructHost(this);
  }

  /** Extends HTMLElement.prototype.connectedCallback. */
  connectedCallback() {
    XElement.#connectHost(this);
  }

  /** Extends HTMLElement.prototype.attributeChangedCallback. */
  attributeChangedCallback(attribute, oldValue, value) {
    const { attributeMap } = XElement.#constructors.get(this.constructor);
    // Authors may extend "observedAttributes". Optionally chain to account for
    // attributes which we don't know about.
    attributeMap.get(attribute)?.sync(this, value, oldValue);
  }

  /** Extends HTMLElement.prototype.adoptedCallback. */
  adoptedCallback() {}

  /** Extends HTMLElement.prototype.disconnectedCallback. */
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
      error.message = `${error.message} — Invalid template for "${this.constructor.name}" at path "${pathString}"`;
      throw error;
    }
  }

  /**
   * Wrapper around HTMLElement.addEventListener.
   *
   * Advanced — use this only if declaring listeners statically is not possible.
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
   * Wrapper around HTMLElement.removeEventListener.
   *
   * Inverse of "listen".
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

  /** Helper method to dispatch an "ErrorEvent" on the element. */
  dispatchError(error) {
    const { message } = error;
    const eventData = { error, message, bubbles: true, composed: true };
    this.dispatchEvent(new ErrorEvent('error', eventData));
  }

  /**
   * For element authors. Getter and setter for internal properties.
   *
   * Note that you can set read-only properties from host.internal. However, you
   * must get read-only properties directly from the host.
   */
  get internal() {
    return XElement.#hosts.get(this).internal;
  }

  // Called once per class — kicked off from "static get observedAttributes".
  static #analyzeConstructor(constructor) {
    const { properties, listeners } = constructor;
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
      propertyMap, internalPropertyMap, attributeMap, listenerMap,
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
    const { propertyMap } = XElement.#constructors.get(host.constructor);
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
    const { initialized, invalidProperties } = hostInfo;
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
      return property.type(value);
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

/** Wrapper to document public interface to the default templating engine. */
class TemplateEngine {
  static #interface = null;

  /**
   * Declare HTML markup to be interpolated.
   *   html`<div attr="${obj.attr}" .prop="${obj.prop}">${obj.content}</div>`;
   */
  static html(strings, ...values) {
    return Template.html(strings, ...values);
  }

  /**
   * Declare SVG markup to be interpolated.
   *
   *   svg`<circle r="${obj.r}" cx="${obj.cx}" cy="${obj.cy}"></div>`;
   */
  static svg(strings, ...values) {
    return Template.svg(strings, ...values);
  }

  /**
   * Core rendering entry point for x-element template engine.
   *
   * Accepts a "container" element and renders the given "result" into it.
   */
  static render(container, result) {
    Template.render(container, result);
  }

  /**
   * Updater to manage an attribute which may be undefined.
   *
   * In the following example, the "ifDefined" updater will remove the
   * attribute if it's undefined. Else, it sets the key-value pair.
   *
   *  html`<a href="${ifDefined(obj.href)}"></div>`;
   */
  static ifDefined(value) {
    return Template.ifDefined(value);
  }

  /**
   * Updater to manage an attribute which may not exist.
   *
   * In the following example, the "nullish" updater will remove the
   * attribute if it's nullish. Else, it sets the key-value pair.
   *
   *  html`<a href="${nullish(obj.href)}"></div>`;
   */
  static nullish(value) {
    return Template.nullish(value);
  }

  /**
   * Updater to manage a property which may change outside the templating engine.
   *
   * Typically, properties are declaratively managed from state and efficient
   * value checking is used (i.e., "value !== lastValue"). However, if DOM state
   * is expected to change, the "live" updater can be used to essentially change
   * this check to "value !== node[property]".
   *
   *  html`<input .value="${live(obj.value)}"/>`;
   */
  static live(value) {
    return Template.live(value);
  }

  /**
   * Updater to inject trusted HTML into the DOM.
   *
   * Use with caution. The "unsafeHTML" updater allows arbitrary input to be
   * parsed as HTML and injected into the DOM.
   *
   *  html`<div>${unsafeHTML(obj.trustedMarkup)}</div>`;
   */
  static unsafeHTML(value) {
    return Template.unsafeHTML(value);
  }

  /**
   * Updater to inject trusted SVG into the DOM.
   *
   * Use with caution. The "unsafeSVG" updater allows arbitrary input to be
   * parsed as SVG and injected into the DOM.
   *
   *  html`
   *    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
   *      ${unsafeSVG(obj.trustedMarkup)}
   *    </svg>
   *  `;
   */
  static unsafeSVG(value) {
    return Template.unsafeSVG(value);
  }

  /**
   * Updater to manage a keyed array of templates (allows for DOM reuse).
   *
   *  html`
   *    <ul>
   *      ${map(items, item => item.id, item => html`<li>${item.value}</li>`)}
   *    </div>
   *  `;
   */
  static map(items, identify, callback) {
    if (typeof identify !== 'function') {
      throw new Error(`Unexpected map identify "${identify}" provided, expected a function.`);
    }
    if (typeof callback !== 'function') {
      throw new Error(`Unexpected map callback "${callback}" provided, expected a function.`);
    }
    return Template.map(items, identify, callback, 'map');
  }

  /** Shim for prior "repeat" function. Use "map". */
  static repeat(value, identify, callback) {
    if (arguments.length === 2) {
      callback = identify;
      identify = null;
    }
    if (arguments.length !== 2 && typeof identify !== 'function') {
      throw new Error(`Unexpected repeat identify "${identify}" provided, expected a function.`);
    } else if (typeof callback !== 'function') {
      throw new Error(`Unexpected repeat callback "${callback}" provided, expected a function.`);
    }
    return Template.map(value, identify, callback, 'repeat');
  }

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
        asyncAppend: TemplateEngine.#removed('asyncAppend'), // Removed.
        asyncReplace: TemplateEngine.#removed('asyncReplace'), // Removed.
        cache: TemplateEngine.#removed('cache'), // Removed.
        classMap: TemplateEngine.#removed('classMap'), // Removed.
        directive: TemplateEngine.#removed('directive'), // Removed.
        guard: TemplateEngine.#removed('guard'), // Removed.
        styleMap: TemplateEngine.#removed('styleMap'), // Removed.
        templateContent: TemplateEngine.#removed('templateContent'), // Removed.
        until: TemplateEngine.#removed('until'), // Removed.
      });
    }
    return TemplateEngine.#interface;
  }

  // Throw an error for removed parts of the interface to make migration easier.
  static #removed (name) {
    return () => {
      throw new Error(`Removed "${name}" from default templating engine interface. Import and plug-in "lit-html" as your element's templating engine if you want this functionality.`);
    };
  }
}

/** Internal implementation details for templating and updating. */
class Template {
  static #internals = new WeakMap();
  static #templates = new WeakMap();
  static #templateResults = new WeakMap();
  static #updaters = new WeakMap();
  static #ATTRIBUTE_PREFIXES = {
    attribute: 'x-element-attribute-',
    boolean: 'x-element-boolean-',
    property: 'x-element-property-',
  };
  static #CONTENT_PREFIX = 'x-element-content-';
  static #CONTENT_REGEX = new RegExp(`${Template.#CONTENT_PREFIX}(\\d+)`);
  static #OPEN = /<[a-z][a-z0-9-]*(?=\s)/g;
  static #STEP = /\s+[a-z][a-z0-9-]*(?=[\s>])|\s+[a-z][a-zA-Z0-9-]*="[^"]*"/y;
  static #ATTRIBUTE = /\s+(\??([a-z][a-zA-Z0-9-]*))="$/y;
  static #PROPERTY = /\s+\.([a-z][a-zA-Z0-9_]*)="$/y;
  static #CLOSE = />/g;

  #type = null;
  #strings = null;
  #analysis = null;

  constructor(type, strings) {
    this.#type = type;
    this.#strings = strings;
  }

  inject(node, options) {
    if (!this.#analysis) {
      const htmlStrings = [];
      const state = { inside: false, index: 0 };
      for (let iii = 0; iii < this.#strings.length; iii++) {
        let string = this.#strings[iii];
        Template.#exhaustString(string, state);
        if (state.inside) {
          Template.#ATTRIBUTE.lastIndex = state.index;
          const attributeMatch = Template.#ATTRIBUTE.exec(string);
          if (attributeMatch) {
            const name = attributeMatch[2];
            if (attributeMatch[1].startsWith('?')) {
              // We found a match like this: html`<div ?hidden="${!!value}"></div>`.
              string = string.slice(0, -3 - name.length) + `${Template.#ATTRIBUTE_PREFIXES.boolean}${iii}="${name}`;
            } else {
              // We found a match like this: html`<div title="${value}"></div>`.
              string = string.slice(0, -2 - name.length) + `${Template.#ATTRIBUTE_PREFIXES.attribute}${iii}="${name}`;
            }
            state.index = 1; // Accounts for an expected quote character next.
          } else {
            Template.#PROPERTY.lastIndex = state.index;
            const propertyMatch = Template.#PROPERTY.exec(string);
            if (propertyMatch) {
              // We found a match like this: html`<div .title="${value}"></div>`.
              const name = propertyMatch[1];
              string = string.slice(0, -3 - name.length) + `${Template.#ATTRIBUTE_PREFIXES.property}${iii}="${name}`;
              state.index = 1; // Accounts for an expected quote character next.
            } else {
              throw new Error(`Found invalid template string "${string}" at "${string.slice(state.index)}".`);
            }
          }
        } else {
          // Assume it's a match like this: html`<div>${value}</div>`.
          string += `<!--${Template.#CONTENT_PREFIX}${iii}-->`;
          state.index = 0; // No characters to account for. Reset to zero.
        }
        htmlStrings[iii] = string;
      }
      const html = this.#type === 'svg'
        ? `<svg xmlns="http://www.w3.org/2000/svg">${htmlStrings.join('')}</svg>`
        : htmlStrings.join('');
      const element = document.createElement('template');
      element.innerHTML = html;
      const blueprint = Template.#evaluate(element.content); // mutates element.
      this.#analysis = { element, blueprint };
    }
    const { element, blueprint } = this.#analysis;
    const clone = element.cloneNode(true);
    const mapping = Template.#instrument(blueprint, clone.content); // mutates clone.
    const content = clone.content;
    options?.before
      ? this.#type === 'svg'
        ? Template.#insertAllBefore(content.firstChild.childNodes, node)
        : Template.#insertAllBefore(content.childNodes, node)
      : this.#type === 'svg'
        ? node.append(...content.firstChild.childNodes)
        : node.append(content);
    return { element: clone, mapping };
  }

  commit(mapping, values, lastValues) {
    Template.#commit(mapping, values, lastValues);
  }

  static html(strings, ...values) {
    const template = Template.#setIfMissing(Template.#templates, strings, () => new Template('html', strings));
    const reference = Template.#createWeakMapReference();
    Template.#templateResults.set(reference, new TemplateResult(template, values));
    return reference;
  }

  static svg(strings, ...values) {
    const template = Template.#setIfMissing(Template.#templates, strings, () => new Template('svg', strings));
    const reference = Template.#createWeakMapReference();
    Template.#templateResults.set(reference, new TemplateResult(template, values));
    return reference;
  }

  static render(container, reference) {
    const internals = Template.#setIfMissing(Template.#internals, container, () => ({}));
    if (reference) {
      const templateResult = Template.#templateResults.get(reference);
      if (internals.templateResult?.template !== templateResult.template) {
        Template.#removeWithin(container);
        internals.templateResult = templateResult;
        templateResult.inject(container);
      } else {
        internals.templateResult.assign(templateResult);
      }
      internals.templateResult.commit();
    } else {
      Template.#clearObject(internals);
      Template.#removeWithin(container);
    }
  }

  static ifDefined(value) {
    const reference = Template.#createWeakMapReference();
    const updater = (type, lastValue, details) => Template.#ifDefined(type, value, lastValue, details);
    updater.value = value;
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static nullish(value) {
    const reference = Template.#createWeakMapReference();
    const updater = (type, lastValue, details) => Template.#nullish(type, value, lastValue, details);
    updater.value = value;
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static live(value) {
    const reference = Template.#createWeakMapReference();
    const updater = (type, lastValue, details) => Template.#live(type, value, lastValue, details);
    updater.value = value;
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static unsafeHTML(value) {
    const reference = Template.#createWeakMapReference();
    const updater = (type, lastValue, details) => Template.#unsafeHTML(type, value, lastValue, details);
    updater.value = value;
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static unsafeSVG(value) {
    const reference = Template.#createWeakMapReference();
    const updater = (type, lastValue, details) => Template.#unsafeSVG(type, value, lastValue, details);
    updater.value = value;
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static map(value, identify, callback, name) {
    const reference = Template.#createWeakMapReference();
    const context = { identify, callback };
    const updater = (type, lastValue, details) => Template.#map(type, value, lastValue, details, context, name);
    updater.value = value;
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static #exhaustString(string, state) {
    if (!state.inside) {
      // We're outside the opening tag.
      Template.#OPEN.lastIndex = state.index;
      const openMatch = Template.#OPEN.exec(string);
      if (openMatch) {
        state.inside = true;
        state.index = Template.#OPEN.lastIndex;
        Template.#exhaustString(string, state);
      }
    } else {
      // We're inside the opening tag.
      Template.#STEP.lastIndex = state.index;
      let stepMatch = Template.#STEP.exec(string);
      while (stepMatch) {
        state.index = Template.#STEP.lastIndex;
        stepMatch = Template.#STEP.exec(string);
      }
      Template.#CLOSE.lastIndex = state.index;
      const closeMatch = Template.#CLOSE.exec(string);
      if (closeMatch) {
        state.inside = false;
        state.index = Template.#CLOSE.lastIndex;
        Template.#exhaustString(string, state);
      }
    }
  }

  static #evaluate(node, path) {
    path = path ?? [];
    const items = [];
    if (node.nodeType === Node.ELEMENT_NODE) {
      const attributesToRemove = new Set();
      for (const attribute of node.attributes) {
        const name = attribute.name;
        const type = name.startsWith(Template.#ATTRIBUTE_PREFIXES.attribute)
          ? 'attribute'
          : name.startsWith(Template.#ATTRIBUTE_PREFIXES.boolean)
            ? 'boolean'
            : name.startsWith(Template.#ATTRIBUTE_PREFIXES.property)
              ? 'property'
              : null;
        if (type) {
          const prefix = Template.#ATTRIBUTE_PREFIXES[type];
          const key = name.slice(prefix.length);
          const value = attribute.value;
          items.push({ path, key, type, name: value });
          attributesToRemove.add(name);
        }
      }
      for (const attribute of attributesToRemove) {
        node.removeAttribute(attribute);
      }
      // Special case to handle elements which only allow text content (no comments).
      const localName = node.localName;
      if ((localName === 'style' || localName === 'script') && Template.#CONTENT_REGEX.exec(node.textContent)) {
        throw new Error(`Interpolation of "${localName}" tags is not allowed.`);
      } else if (localName === 'plaintext' || localName === 'textarea' || localName === 'title') {
        const contentMatch = Template.#CONTENT_REGEX.exec(node.textContent);
        if (contentMatch) {
          items.push({ path, key: contentMatch[1], type: 'text' });
        }
      }
    } else if (node.nodeType === Node.COMMENT_NODE) {
      const contentMatch = Template.#CONTENT_REGEX.exec(node.textContent);
      if (contentMatch) {
        node.textContent = '';
        const startNode = document.createComment('');
        node.parentNode.insertBefore(startNode, node);
        path[path.length - 1] = path[path.length - 1] + 1;
        items.push({ path, key: contentMatch[1], type: 'content' });
      }
    }
    let iii = 0;
    for (const childNode of node.childNodes) {
      items.push(...Template.#evaluate(childNode, [...path, iii++]));
    }
    return items;
  }

  static #instrument(blueprint, content) {
    const nextItems = [];
    const lookup = new Map();
    const find = path => {
      let node = content;
      for (const index of path) {
        node = Template.#setIfMissing(lookup, node, () => node.childNodes)[index];
      }
      return node;
    };
    for (const item of blueprint) {
      const node = find(item.path);
      switch (item.type) {
        case 'attribute':
        case 'boolean':
        case 'property': {
          nextItems.push({ key: item.key, type: item.type, name: item.name, node });
          break;
        }
        case 'content': {
          const startNode = node.previousSibling;
          const nextItem = { key: item.key, type: item.type, node, startNode };
          nextItems.push(nextItem);
          break;
        }
        case 'text': {
          const nextItem = { key: item.key, type: item.type, node };
          nextItems.push(nextItem);
          break;
        }
      }
    }
    return nextItems;
  }

  static #commit(mapping, values, lastValues) {
    for (const { key, type, node, startNode, name } of mapping) {
      const lastUpdater = Template.#updaters.get(lastValues[key]);
      const lastValue = lastUpdater ? lastUpdater.value : lastValues[key];
      const updater = Template.#updaters.get(values[key]);
      switch (type) {
        case 'attribute':
          updater
            ? updater(type, lastValue, { node, name })
            : Template.#attribute(type, values[key], lastValue, { node, name });
          break;
        case 'boolean':
          updater
            ? updater(type, lastValue, { node, name })
            : Template.#boolean(type, values[key], lastValue, { node, name });
          break;
        case 'property':
          updater
            ? updater(type, lastValue, { node, name })
            : Template.#property(type, values[key], lastValue, { node, name });
          break;
        case 'content':
          updater
            ? updater(type, lastValue, { node, startNode })
            : Template.#content(type, values[key], lastValue, { node, startNode });
          break;
        case 'text':
          updater
            ? updater(type, lastValue, { node })
            : Template.#text(type, values[key], lastValue, { node });
          break;
      }
    }
  }

  static #attribute(type, value, lastValue, { node, name }) {
    if (value !== lastValue) {
      node.setAttribute(name, value);
    }
  }

  static #boolean(type, value, lastValue, { node, name }) {
    if (value !== lastValue) {
      value
        ? node.setAttribute(name, '')
        : node.removeAttribute(name);
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
      const internals = Template.#setIfMissing(Template.#internals, startNode, () => ({}));
      if (Template.#templateResults.has(value)) {
        const templateResult = Template.#templateResults.get(value);
        if (internals.templateResult?.template !== templateResult.template) {
          Template.#removeBetween(startNode, node);
          Template.#clearObject(internals);
          internals.templateResult = templateResult;
          templateResult.inject(node, { before: true });
        } else {
          internals.templateResult.assign(templateResult);
        }
        internals.templateResult.commit();
      } else if (Array.isArray(value)) {
        Template.#mapInner(internals, node, startNode, null, null, value, 'array');
      } else {
        if (internals.templateResult) {
          Template.#removeBetween(startNode, node);
          Template.#clearObject(internals);
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
      throw new Error(`The ifDefined update must be used on ${Template.#getTypeText('attribute')}, not on ${Template.#getTypeText(type)}.`);
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
      throw new Error(`The nullish update must be used on ${Template.#getTypeText('attribute')}, not on ${Template.#getTypeText(type)}.`);
    }
  }

  static #live(type, value, lastValue, { node, name }) {
    if (type === 'property') {
      if (node[name] !== value) {
        node[name] = value;
      }
    } else {
      throw new Error(`The live update must be used on ${Template.#getTypeText('property')}, not on ${Template.#getTypeText(type)}.`);
    }
  }

  static #unsafeHTML(type, value, lastValue, { node, startNode }) {
    if (type === 'content') {
      if (value !== lastValue) {
        if (typeof value === 'string') {
          const template = document.createElement('template');
          template.innerHTML = value;
          Template.#removeBetween(startNode, node);
          Template.#insertAllBefore(template.content.childNodes, node);
        } else {
          throw new Error(`Unexpected unsafeHTML value "${value}".`);
        }
      }
    } else {
      throw new Error(`The unsafeHTML update must be used on ${Template.#getTypeText('content')}, not on ${Template.#getTypeText(type)}.`);
    }
  }

  static #unsafeSVG(type, value, lastValue, { node, startNode }) {
    if (type === 'content') {
      if (value !== lastValue) {
        if (typeof value === 'string') {
          const template = document.createElement('template');
          template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${value}</svg>`;
          Template.#removeBetween(startNode, node);
          Template.#insertAllBefore(template.content.firstChild.childNodes, node);
        } else {
          throw new Error(`Unexpected unsafeSVG value "${value}".`);
        }
      }
    } else {
      throw new Error(`The unsafeSVG update must be used on ${Template.#getTypeText('content')}, not on ${Template.#getTypeText(type)}.`);
    }
  }

  static #mapInner(internals, node, startNode, identify, callback, inputs, name) {
    if (!internals.map) {
      Template.#clearObject(internals);
      internals.map = new Map;
      let index = 0;
      for (const input of inputs) {
        const reference = callback ? callback(input, index) : input;
        const templateResult = Template.#templateResults.get(reference);
        if (templateResult) {
          const id = identify ? identify(input, index) : String(index);
          internals.map.set(id, { id, ...Template.#createItem(templateResult, node) });
          templateResult.commit();
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
        const templateResult = Template.#templateResults.get(reference);
        if (templateResult) {
          const id = identify ? identify(input, index) : String(index);
          if (internals.map.has(id)) {
            const item = internals.map.get(id);
            if (item.templateResult?.template !== templateResult.template) {
              const itemClone = { ...item };
              Object.assign(item, Template.#createItem(templateResult, itemClone.startNode));
              Template.#removeThrough(itemClone.startNode, itemClone.node);
            } else {
              item.templateResult.assign(templateResult);
            }
          } else {
            const item = { id, ...Template.#createItem(templateResult, node) };
            internals.map.set(id, item);
          }
          const item = internals.map.get(id);
          const referenceNode = lastItem ? lastItem.node.nextSibling : startNode.nextSibling;
          if (referenceNode !== item.startNode) {
            const nodesToMove = [item.startNode];
            while (nodesToMove[nodesToMove.length - 1] !== item.node) {
              nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
            }
            Template.#insertAllBefore(nodesToMove, referenceNode);
          }
          item.templateResult.commit();
          ids.add(item.id);
          lastItem = item;
        } else {
          throw new Error(`Unexpected ${name} value "${reference}" provided by callback.`);
        }
        index++;
      }
      for (const [id, item] of internals.map.entries()) {
        if (!ids.has(id)) {
          Template.#removeThrough(item.startNode, item.node);
          internals.map.delete(id);
        }
      }
    }
  }

  static #map(type, value, lastValue, { node, startNode }, { identify, callback }, name) {
    if (type === 'content') {
      if (value !== lastValue) {
        if (Array.isArray(value)) {
          const internals = Template.#setIfMissing(Template.#internals, startNode, () => ({}));
          Template.#mapInner(internals, node, startNode, identify, callback, value, name);
        } else {
          throw new Error(`Unexpected ${name} value "${value}".`);
        }
      }
    } else {
      throw new Error(`The ${name} update must be used on ${Template.#getTypeText('content')}, not on ${Template.#getTypeText(type)}.`);
    }
  }

  static #createItem(templateResult, referenceNode) {
    const startNode = document.createComment('');
    const node = document.createComment('');
    referenceNode.parentNode.insertBefore(startNode, referenceNode);
    templateResult.inject(referenceNode, { before: true });
    referenceNode.parentNode.insertBefore(node, referenceNode);
    return { templateResult, startNode, node };
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
    Template.#removeBetween(startNode, node);
    startNode.remove();
    node.remove();
  }

  static #clearObject(object) {
    for (const key of Object.keys(object)) {
      delete object[key];
    }
  }

  static #createWeakMapReference() {
    return Object.create(null);
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
}

/** Internal implementation details for template results. */
class TemplateResult {
  static #UNSET = Symbol('unset');
  #template = null;
  #element = null;
  #mapping = null;
  #values = null;
  #lastValues = null;
  #injected = false;

  constructor(template, values) {
    this.#template = template;
    this.#values = values;
    this.#lastValues = this.#values.map(() => TemplateResult.#UNSET);
  }

  get template() {
    return this.#template;
  }

  get values() {
    return this.#values;
  }

  inject(node, options) {
    if (this.#injected) {
      throw new Error(`Unexpected re-injection of template result.`);
    }
    this.#injected = true;
    const { element, mapping } = this.#template.inject(node, options);
    this.#element = element;
    this.#mapping = mapping;
  }

  assign(templateResult) {
    this.#lastValues = this.#values;
    this.#values = templateResult.values;
  }

  commit() {
    this.#template.commit(this.#mapping, this.#values, this.#lastValues);
  }
}
