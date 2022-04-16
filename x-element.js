/** Base element class for creating custom elements. */
export default class XElement extends HTMLElement {
  /** Extends HTMLElement.observedAttributes to handle the properties block. */
  static get observedAttributes() {
    XElement.#analyzeConstructor(this);
    return [...XElement.#constructors.get(this).attributeMap.keys()];
  }

  /**
   * @typedef {object} PropertyDefinition
   * @property {object} [type] - Associate property with a type  (e.g., "String").
   * @property {string} [attribute] - Customize related property's attribute.
   * @property {string[]} [input] - Array of property names on which a computed property depends.
   * @property {function} [compute] - Callback function to compute property value. Called with "input" values.
   * @property {boolean} [reflect] - Should setting the property update its attribute?
   * @property {function} [observe] - Callback function to observe property value changes. Called with "(host, value, oldValue)".
   * @property {function|*} [initial] - Initial callback or primitive value used to coalesce nullish properties.
   * @property {function|*} [default] - Callback or primitive value used to coalesce nullish properties.
   * @property {boolean} [readOnly] - Prevent setting property value on the host?
   * @property {boolean} [internal] - Prevent getting and setting property value on the host?
   */

  /**
   * Default templating engine provided by x-element.
   *
   * You should not need to override this. See "templateEngine" getter below.
   *
   * @returns {{render: (function(HTMLElement, *)), html: (function([String], ...[*])), svg: (function([String], ...[*]))}}
   */
  static get defaultTemplateEngine() {
    const {
      render, html, svg, updater, boolean, notNullish, live, unsafeHtml,
      unsafeSvg, keyedMap,
    } = TemplateEngine;
    return {
      render, html, svg, updater, boolean, notNullish, live, unsafeHtml,
      unsafeSvg, keyedMap,
    };
  }

  /**
   * Configured templating engine.
   *
   * Override this as needed if x-element's default template engine does not
   * meet your needs. The response MUST include an "html" tagged template
   * function and a "render" function. The "html" function allows users to
   * interpolate markup/values and the "render" function accepts a container and
   * a template (the output of "html"). The conceptual relationship in code:
   *
   *   const container = document.createElement('div');
   *   const template = html`<span>${100}</span>`;
   *   render(container, template);
   *
   * Everything else returned as part of the "engine" will be piped through to
   * x-element's "template" method.
   * @returns {{html: (function([String], ...[*])), render: (function(HTMLElement|SVGSVGElement, *))}}
   */
  static get templateEngine() {
    return XElement.defaultTemplateEngine;
  }

  /**
   * Statically declare watched properties (and related attributes) on an element.
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
   *
   * @returns {Object.<string, PropertyDefinition>}
   */
  static get properties() {
    return {};
  }

  /**
   * Statically declare event handlers on an element.
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
   *
   * @returns {Object.<string, function>}
   */
  static get listeners() {
    return {};
  }

  /**
   * Customize shadow root initialization and optionally forgo encapsulation.
   *
   * E.g., setup focus delegation or return host instead of host.shadowRoot.
   *
   * @param {XElement} host - An instance of you custom element constructor class.
   * @returns {ShadowRoot|XElement} - Template results will get stamped into this value.
   */
  static createRenderRoot(host) {
    return host.attachShadow({ mode: 'open' });
  }

  /**
   * Setup template callback to update DOM when properties change.
   *
   *   static template(html, { notNullish }) {
   *     return (href) => {
   *       return html`<a href=${notNullish(href)}>click me</a>`;
   *     }
   *   }
   *
   * @param {function} html - See [lit-html]{@link https://lit-html.polymer-project.org/}.
   * @param {Object.<string, function>} engine - Directives and template functions from lit-html.
   * @returns {function} - Callback which is called when properties change.
   */
  static template(html, engine) { // eslint-disable-line no-unused-vars, no-shadow
    return (properties, host) => {}; // eslint-disable-line no-unused-vars
  }

  /** Standard instance constructor. */
  constructor() {
    super();
    XElement.#constructHost(this);
  }

  /** Extends HTMLElement.prototype.connectedCallback. */
  connectedCallback() {
    XElement.#initializeHost(this);
    XElement.#addListeners(this);
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
    XElement.#removeListeners(this);
  }

  /**
   * Uses the result of your template callback to update your render root.
   *
   * This is called when properties update, but is exposed for advanced use cases.
   *
   * It's common for the template to produce a result that will fail when
   * rendered. When this happens, the stack trace may not show the actual
   * template that produced the result. We append information for ease of
   * debugging such issues.
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
   *
   * @param {HTMLElement} element - The element to which the listener will be added.
   * @param {string} type - The event type for which we're listening.
   * @param {function} callback - The handler callback.
   * @param {object} [options] - Listener options (e.g., { useCapture: true }).
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
   *
   * @param {HTMLElement} element - The element to which the listener will be added.
   * @param {string} type - The event type for which we're listening.
   * @param {function} callback - The handler callback.
   * @param {object} [options] - Listener options (e.g., { useCapture: true }).
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
   *
   * @param {Error} error - An error instance to dispatch.
   */
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
   *
   * @see PropertyDefinition.internal
   * @see PropertyDefinition.readOnly
   *
   * @returns {Object.<string, *>}
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
      XElement.#updateHost(host);
    }
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
    const { key, attribute } = property;
    let value;
    let found = false;
    if (Reflect.has(host, key)) {
      value = host[key];
      found = true;
    } else if (attribute && host.hasAttribute(attribute)) {
      const attributeValue = host.getAttribute(attribute);
      value = XElement.#deserializeProperty(host, property, attributeValue);
      found = true;
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
  /**
   * Declare HTML markup to be interpolated.
   *
   *   html`<div attr="${obj.attr}" .prop="${obj.prop}">${obj.content}</div>`;
   *
   * @param {[string]} strings - An array of markup strings.
   * @param {[*]} values - An array of values to insert into the markup.
   * @returns {object} - A reference to an internal Template.
   */
  static html(strings, ...values) {
    return Template.html(strings, ...values);
  }

  /**
   * Declare SVG markup to be interpolated.
   *
   *   svg`<circle r="${obj.r}" cx="${obj.cx}" cy="${obj.cy}"></div>`;
   *
   * @param {[string]} strings - An array of markup strings.
   * @param {[*]} values - An array of values to insert into the markup.
   * @returns {object} - A reference to an internal Template.
   */
  static svg(strings, ...values) {
    return Template.svg(strings, ...values);
  }

  /**
   * Core rendering entry point for x-element template engine.
   *
   * Accepts a "container" element and renders the given "template" into it.
   *
   * @param {Element} container - The element within which to render a template.
   * @param {object} template - An output instance from the "html"/"svg" methods.
   */
  static render(container, template) {
    Template.render(container, template);
  }

  /**
   * @typedef {function} update
   * @param {('attribute'|'property'|'content'|'text-content')} type - The type of update being performed.
   * type, value, lastValue, details, context
   * @param {*} value - The current template value.
   * @param {*} lastValue - The previous template value.
   * @param {Node} details.node - The DOM node related to this update.
   * @param {string} [details.name] - If an 'attribute' or 'property' update. The attribute / property name.
   * @param {Node} [details.startNode] - If a 'content' update. The related "startNode" bracketing the content.
   * @param {object} [context] - The object blob created via the "transform" method based on input arguments.
   */

  /**
   * Wrapper to define a custom updater.
   *
   *   // Basic example — convert attribute value to lowercase.
   *   const update = (type, value, lastValue, { node, name }) => {
   *     if (type === 'attribute' && value !== lastValue) {
   *       node.setAttribute(name, value?.toLowerCase() ?? value);
   *     }
   *   };
   *   const lower = updater(update);
   *
   *   // Advanced example — wrap attribute value with a prefix and suffix.
   *   const update = (type, value, lastValue, { node, name }, { prefix, suffix }) => {
   *     if (type === 'attribute' && value !== lastValue) {
   *       node.setAttribute(name, `${prefix}-${value}-${suffix}`);
   *     }
   *   };
   *   const transform = (prefix, suffix) => ({ prefix, suffix });
   *   const wrap = updater(update, transform);
   *
   * @param {update} update - The callback to update the DOM.
   * @param {function} [transform] - Define how additional input arguments work.
   * @returns {object} - A reference to an internal Updater.
   */
  static updater(update, transform) {
    return Template.updater(update, transform);
  }

  /**
   * Updater to manage a boolean attribute (versus a key-value paired attribute).
   *
   * In the following example, the "boolean" updater sets/removes the attribute
   * in question rather than managing the value alone.
   *
   *  html`<div bool="${boolean(obj.bool)}"></div>`;
   *  // Truthy? "<div bool></div>"
   *  // Falsy? "<div></div>"
   *
   * @param {*} value - If value is truthy, set the attribute. Else, remove it.
   * @returns {object} - A reference to an internal Updater.
   */
  static boolean(value) {
    return Template.boolean(value);
  }

  /**
   * Updater to manage an attribute which may not exist.
   *
   * In the following example, the "notNullish" updater will remove the
   * attribute if it's nullish. Else, it sets the key-value pair.
   *
   *  html`<a href="${notNullish(obj.href)}"></div>`;
   *
   * @param {*} value - If value is nullish, remove the attribute. Else, set the key-value pair.
   * @returns {object} - A reference to an internal Updater.
   */
  static notNullish(value) {
    return Template.notNullish(value);
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
   *
   * @param {*} value - If node's value differs, set the value.
   * @returns {object} - A reference to an internal Updater.
   */
  static live(value) {
    return Template.live(value);
  }

  /**
   * Updater to inject trusted HTML into the DOM.
   *
   * Use with caution. The "unsafeHtml" updater allows arbitrary input to be
   * parsed as HTML and injected into the DOM.
   *
   *  html`<div>${unsafeHtml(obj.trustedMarkup)}</div>`;
   *
   * @param {string} value - An arbitrary HTML markup string.
   * @returns {object} - A reference to an internal Updater.
   */
  static unsafeHtml(value) {
    return Template.unsafeHtml(value);
  }

  /**
   * Updater to inject trusted SVG into the DOM.
   *
   * Use with caution. The "unsafeSvg" updater allows arbitrary input to be
   * parsed as SVG and injected into the DOM.
   *
   *  html`
   *    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
   *      ${unsafeSvg(obj.trustedMarkup)}
   *    </svg>
   *  `;
   *
   * @param {string} value - An arbitrary SVG markup string.
   * @returns {object} - A reference to an internal Updater.
   */
  static unsafeSvg(value) {
    return Template.unsafeSvg(value);
  }

  /**
   * Updater to manage a keyed-list of templates.
   *
   * Typically, you should prefer to simply return an array of templates, but if
   * you need to keep references to DOM nodes across renders when the order of
   * the nodes is expected to shift (think animations in shuffling lists), you
   * will need to use the "keyedMap" updater.
   *
   *  html`
   *    <ul>
   *      ${keyedMap(items, item => item.id, item => html`<li>${item.value}</li>`)}
   *    </div>
   *  `;
   *
   * @param {[*]} value - An array of items to render into a list.
   * @param {function} lookup - Accepts an item and returns an id.
   * @param {function} callback - Accepts an item and returns a template.
   * @returns {object} - A reference to an internal Updater.
   */
  static keyedMap(value, lookup, callback) {
    return Template.keyedMap(value, lookup, callback);
  }
}

// TODO: Do we need to consider event bindings? I.e., '@click="${clickHandler}"'.
// TODO: Do we need to consider boolean attribute bindings? I.e., '?bool="${maybe}"'?
// TODO: Performance test our template engine. It must be as fast as the competition.
// TODO: Regular expressions are based off of https://html.spec.whatwg.org/multipage/syntax.html — they likely need work.
/** Internal implementation details for templating and updating. */
class Template {
  #type = null;
  #strings = null;
  #values = null;
  #key = null;
  #template = null;
  #mapping = null;
  #injected = false;
  #lastValues = null;

  constructor(type, strings, values) {
    this.#type = type;
    this.#strings = strings;
    this.#values = values;
    this.#lastValues = this.#values.map(() => Template.#UNSET);
  }

  get key() {
    this.#key = this.#key ?? Template.#getKey(this.#type, this.#strings);
    return this.#key;
  }

  get values() {
    return this.#values;
  }

  inject(node, options) {
    if (this.#injected) {
      throw new Error(`Unexpected re-injection of template.`);
    }
    this.#injected = true;
    this.#template = Template.#getTemplate(this.#type, this.#strings);
    this.#mapping = Template.#mapTemplate(this.#template); // mutates template
    if (options?.before) {
      if (this.#type === 'svg') {
        Template.#insertAllBefore(this.#template.content.firstChild.childNodes, node);
      } else {
        Template.#insertAllBefore(this.#template.content.childNodes, node);
      }
    } else {
      if (this.#type === 'svg') {
        node.append(...this.#template.content.firstChild.childNodes);
      } else {
        node.append(this.#template.content);
      }
    }
  }

  assign(template) {
    this.#lastValues = this.#values;
    this.#values = template.values;
  }

  commit() {
    Template.#commit(this.#mapping, this.#values, this.#lastValues);
  }

  static html(strings, ...values) {
    const reference = Template.#createReference();
    Template.#templates.set(reference, new Template('html', strings, values));
    return reference;
  }

  static svg(strings, ...values) {
    const reference = Template.#createReference();
    Template.#templates.set(reference, new Template('svg', strings, values));
    return reference;
  }

  static render(container, templateReference) {
    if (templateReference !== null && templateReference !== undefined) {
      if (!Template.#internals.has(container)) {
        Template.#internals.set(container, {});
      }
      const internals = Template.#internals.get(container);
      const template = Template.#templates.get(templateReference);
      if (internals.template?.key !== template.key) {
        Template.#removeWithin(container);
        internals.template = template;
        template.inject(container);
      } else {
        internals.template.assign(template);
      }
      internals.template.commit();
    } else {
      if (!Template.#internals.has(container)) {
        Template.#internals.set(container, {});
      }
      const internals = Template.#internals.get(container);
      Template.#clearObject(internals);
      Template.#removeWithin(container);
    }
  }

  static updater(update, transform) {
    return (value, ...args) => {
      const reference = Template.#createReference();
      const context = transform?.(...args);
      const updater = (type, lastValue, details) => {
        update(type, value, lastValue, details, context);
      };
      Template.#updaters.set(reference, updater);
      return reference;
    };
  }

  static boolean(value) {
    const reference = Template.#createReference();
    const updater = (type, lastValue, details) => Template.#boolean(type, value, lastValue, details);
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static notNullish(value) {
    const reference = Template.#createReference();
    const updater = (type, lastValue, details) => Template.#notNullish(type, value, lastValue, details);
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static live(value) {
    const reference = Template.#createReference();
    const updater = (type, lastValue, details) => Template.#live(type, value, lastValue, details);
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static unsafeHtml(value) {
    const reference = Template.#createReference();
    const updater = (type, lastValue, details) => Template.#unsafeHtml(type, value, lastValue, details);
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static unsafeSvg(value) {
    const reference = Template.#createReference();
    const updater = (type, lastValue, details) => Template.#unsafeSvg(type, value, lastValue, details);
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static keyedMap(value, lookup, callback) {
    const reference = Template.#createReference();
    const context = { lookup, callback };
    const updater = (type, lastValue, details) => Template.#keyedMap(type, value, lastValue, details, context);
    Template.#updaters.set(reference, updater);
    return reference;
  }

  static #internals = new WeakMap();
  static #templates = new WeakMap();
  static #updaters = new WeakMap();
  static #UNSET = Symbol('unset');
  static #ATTRIBUTE = /<[a-z]+[a-z-][^/<>]* ([a-z-]+)="$/;
  static #PROPERTY = /<[a-z]+[a-z-][^/<>]* \.([a-z][a-zA-Z0-9_]*)="$/;

  static #createReference() {
    // We leverage WeakMaps and simply need the _lightest weight_ object to use.
    return Object.create(null);
  }

  static #clearObject(object) {
    for (const key of Object.keys(object)) {
      delete object[key];
    }
  }

  static #getKey(type, strings) {
    return `${type}: ${JSON.stringify(strings)}`;
  }

  static #getTemplate(type, strings) {
    let string = '';
    for (const [key, value] of Object.entries(strings)) {
      string += value;
      const attributeMatch = string.match(Template.#ATTRIBUTE);
      const propertyMatch = !attributeMatch ? string.match(Template.#PROPERTY) : null;
      if (attributeMatch) {
        const name = attributeMatch[1];
        string = string.slice(0, -2 - name.length) + `x-element-attribute-$${key}="${name}`;
      } else if (propertyMatch) {
        const name = propertyMatch[1];
        string = string.slice(0, -3 - name.length) + `x-element-property-$${key}="${name}`;
      } else if (Number(key) < strings.length - 1) {
        string += `<!--x-element-content-$${key}-->`;
      }
    }
    if (type === 'svg') {
      string = `<svg xmlns="http://www.w3.org/2000/svg">${string}</svg>`;
    }
    const template = document.createElement('template');
    template.innerHTML = string;
    return template;
  }

  static #mapTemplate(template) {
    return Template.#map(template.content);
  }

  static #map(node) {
    const mapping = {};
    if (node.nodeType === Node.ELEMENT_NODE) {
      const attributeNamesToRemove = [];
      for (const attribute of node.attributes) {
        const attributeMatch = attribute.name.match(/x-element-attribute-\$(\d+)/);
        const propertyMatch = !attributeMatch ? attribute.name.match(/x-element-property-\$(\d+)/) : null;
        if (attributeMatch) {
          mapping[attributeMatch[1]] = { node, type: 'attribute', name: attribute.value };
          attributeNamesToRemove.push(attributeMatch[0]);
        } else if (propertyMatch) {
          mapping[propertyMatch[1]] = { node, type: 'property', name: attribute.value };
          attributeNamesToRemove.push(propertyMatch[0]);
        }
      }
      for (const attributeName of attributeNamesToRemove) {
        node.removeAttribute(attributeName);
      }
      // Special case to handle elements which only allow text content (no comments).
      if (node.localName.match(/^plaintext|script|style|textarea|title$/)) {
        const contentMatch = node.textContent.match(/x-element-content-\$(\d+)/);
        if (contentMatch) {
          node.textContent = '';
          mapping[contentMatch[1]] = { node, type: 'text-content' };
        }
      }
    } else if (node.nodeType === Node.COMMENT_NODE) {
      const contentMatch = node.textContent.match(/x-element-content-\$(\d+)/);
      if (contentMatch) {
        const startNode = document.createComment('');
        node.parentNode.insertBefore(startNode, node);
        node.textContent = '';
        mapping[contentMatch[1]] = { node, type: 'content', startNode };
      }
    }
    for (const childNode of node.childNodes) {
      Object.assign(mapping, Template.#map(childNode));
    }
    return mapping;
  }

  static #commit(mapping, values, lastValues) {
    for (const [key, { type, node, startNode, name }] of Object.entries(mapping)) {
      const lastUpdater = Template.#updaters.get(lastValues[key]);
      const lastValue = lastUpdater ? lastValues[key].value : lastValues[key];
      const updater = Template.#updaters.get(values[key]);
      switch (type) {
        case 'attribute':
          if (updater) {
            updater('attribute', lastValue, { node, name });
          } else {
            Template.#attribute('attribute', values[key], lastValue, { node, name });
          }
          break;
        case 'property':
          if (updater) {
            updater('property', lastValue, { node, name });
          } else {
            Template.#property('property', values[key], lastValue, { node, name });
          }
          break;
        case 'content':
          if (updater) {
            updater('content', lastValue, { node, startNode });
          } else {
            Template.#content('content', values[key], lastValue, { node, startNode });
          }
          break;
        case 'text-content':
          if (updater) {
            updater('text-content', lastValue, { node });
          } else {
            Template.#textContent('text-content', values[key], lastValue, { node });
          }
          break;
      }
    }
  }

  static #attribute(type, value, lastValue, { node, name }) {
    if (type === 'attribute' && value !== lastValue) {
      node.setAttribute(name, value);
    }
  }

  static #property(type, value, lastValue, { node, name }) {
    if (type === 'property' && value !== lastValue) {
      node[name] = value;
    }
  }

  static #createItem(template, referenceNode) {
    const startNode = document.createComment('');
    const node = document.createComment('');
    referenceNode.parentNode.insertBefore(startNode, referenceNode);
    template.inject(referenceNode, { before: true });
    referenceNode.parentNode.insertBefore(node, referenceNode);
    return { template, startNode, node };
  }

  static #content(type, value, lastValue, { node, startNode }) {
    if (type === 'content' && value !== lastValue) {
      if (!Template.#internals.has(startNode)) {
        Template.#internals.set(startNode, {});
      }
      const internals = Template.#internals.get(startNode);
      if (Template.#templates.has(value)) {
        const template = Template.#templates.get(value);
        if (internals.template?.key !== template.key) {
          Template.#removeBetween(startNode, node);
          Template.#clearObject(internals);
          internals.template = template;
          template.inject(node, { before: true });
        } else {
          internals.template.assign(template);
        }
        internals.template.commit();
      } else if (Array.isArray(value)) {
        const templateReferences = value;
        if (!internals.items) {
          Template.#clearObject(internals);
          const items = [];
          for (const templateReference of templateReferences) {
            const template = Template.#templates.get(templateReference);
            if (template) {
              const item = Template.#createItem(template, node);
              items.push(item);
              item.template.commit();
            } else {
              throw new Error(`Unexpected value "${templateReference}".`);
            }
          }
          internals.items = items;
        } else {
          for (const [key, templateReference] of Object.entries(templateReferences)) {
            const template = Template.#templates.get(templateReference);
            if (template) {
              if (!internals.items[key]) {
                internals.items[key] = Template.#createItem(template, node);
              } else if (internals.items[key].template.key !== template.key) {
                const item = internals.items[key];
                const itemClone = { ...item };
                Object.assign(item, Template.#createItem(template, itemClone.startNode));
                Template.#removeThrough(itemClone.startNode, itemClone.node);
              } else {
                const item = internals.items[key];
                item.template.assign(template);
              }
              internals.items[key].template.commit();
            } else {
              throw new Error(`Unexpected value "${templateReference}".`);
            }
          }
          for (const [key, item] of Object.entries(internals.items)) {
            if (!templateReferences[key]) {
              Template.#removeThrough(item.startNode, item.node);
              delete internals.items[key];
            }
          }
        }
      } else {
        if (internals.template?.key) {
          Template.#removeBetween(startNode, node);
          Template.#clearObject(internals);
        }
        if (node.previousSibling === startNode) {
          const textNode = document.createTextNode(value ?? '');
          node.parentNode.insertBefore(textNode, node);
        } else {
          node.previousSibling.textContent = value ?? '';
        }
      }
    }
  }

  static #textContent(type, value, lastValue, { node }) {
    if (type === 'text-content' && value !== lastValue) {
      node.textContent = value;
    }
  }

  static #boolean(type, value, lastValue, { node, name }) {
    if (type === 'attribute' && value !== lastValue) {
      if (value) {
        node.setAttribute(name, '');
      } else {
        node.removeAttribute(name);
      }
    }
  }

  static #notNullish(type, value, lastValue, { node, name }) {
    if (type === 'attribute' && value !== lastValue) {
      if (value !== undefined && value !== null) {
        node.setAttribute(name, value);
      } else {
        node.removeAttribute(name);
      }
    }
  }

  static #live(type, value, lastValue, { node, name }) {
    if (type === 'property') {
      if (node[name] !== value) {
        node[name] = value;
      }
    }
  }

  static #unsafeHtml(type, value, lastValue, { node, startNode }) {
    if (type === 'content' && value !== lastValue) {
      if (typeof value === 'string') {
        const template = document.createElement('template');
        template.innerHTML = value;
        Template.#removeBetween(startNode, node);
        Template.#insertAllBefore(template.content.childNodes, node);
      } else {
        throw new Error(`Unexpected value "${value}".`);
      }
    }
  }

  static #unsafeSvg(type, value, lastValue, { node, startNode }) {
    if (type === 'content' && value !== lastValue) {
      if (typeof value === 'string') {
        const template = document.createElement('template');
        template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${value}</svg>`;
        Template.#removeBetween(startNode, node);
        Template.#insertAllBefore(template.content.firstChild.childNodes, node);
      } else {
        throw new Error(`Unexpected value "${value}".`);
      }
    }
  }

  static #keyedMap(type, value, lastValue, { node, startNode }, { lookup, callback }) {
    if (type === 'content' && value !== lastValue) {
      if (Array.isArray(value)) {
        const inputs = value;
        if (!Template.#internals.has(startNode)) {
          Template.#internals.set(startNode, {});
        }
        const internals = Template.#internals.get(startNode);
        if (!internals.map) {
          Template.#clearObject(internals);
          const map = {};
          for (const input of inputs) {
            const templateReference = callback(input);
            const template = Template.#templates.get(templateReference);
            if (template) {
              const id = lookup(input);
              map[id] = { id, ...Template.#createItem(template, node) };
              template.commit();
            } else {
              throw new Error(`Unexpected value "${templateReference}".`);
            }
          }
          internals.map = map;
        } else {
          let lastItem;
          const ids = [];
          for (const input of inputs) {
            const templateReference = callback(input);
            const template = Template.#templates.get(templateReference);
            if (template) {
              const id = lookup(input);
              if (internals.map[id]) {
                const item = internals.map[id];
                if (item.template.key !== template.key) {
                  const itemClone = { ...item };
                  Object.assign(item, Template.#createItem(template, itemClone.startNode));
                  Template.#removeThrough(itemClone.startNode, itemClone.node);
                } else {
                  item.template.assign(template);
                }
              } else {
                const item = { id, ...Template.#createItem(template, node) };
                internals.map[id] = item;
              }
              const item = internals.map[id];
              const referenceNode = lastItem ? lastItem.node.nextSibling : startNode.nextSibling;
              if (referenceNode !== item.startNode) {
                const nodesToMove = [item.startNode];
                while (nodesToMove[nodesToMove.length - 1] !== item.node) {
                  nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
                }
                Template.#insertAllBefore(nodesToMove, referenceNode);
              }
              item.template.commit();
              ids.push(item.id);
              lastItem = item;
            } else {
              throw new Error(`Unexpected value "${templateReference}".`);
            }
          }
          for (const [id, item] of Object.entries(internals.map)) {
            if (!ids.includes(id)) {
              Template.#removeThrough(item.startNode, item.node);
              delete internals.map[id];
            }
          }
        }
      } else {
        throw new Error(`Unexpected value "${value}".`);
      }
    }
  }

  static #insertAllBefore(childNodes, node) {
    for (const childNode of childNodes) {
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
}
