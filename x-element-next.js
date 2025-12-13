import { html, render } from './x-template.js';

if (!Symbol.metadata) {
  // See https://github.com/tc39/proposal-decorator-metadata
  // @ts-expect-error - Polyfilling readonly Symbol.metadata for decorator support
  Symbol.metadata = Symbol.for('Symbol.metadata');
}

/** Base element class for creating custom elements. */
class XElement extends HTMLElement {
  /**
   * Extends HTMLElement.observedAttributes to handle decorated properties.
   * @returns {string[]}
   */
  static get observedAttributes() {
    // Guard for developer introspection of static "observedAttributes" getter.
    if (!Object.hasOwn(this, XElement.#info)) {
      XElement.#analyzeConstructor(this);
    }
    return [...this[XElement.#info].attributes.keys()];
  }

  /**
   * Declare an array of CSSStyleSheet objects to adopt on the shadow root.
   * Note that a CSSStyleSheet object is the type returned when importing a
   * stylesheet file via import attributes.
   * @example
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
   * The property configuration value passed via the property decorator.
   * @typedef {object} PropertyConfiguration
   * @property {(new (...args: unknown[]) => unknown) | undefined} [type]
   * @property {string} [attribute]
   * @property {string[]} [input]
   * @property {(...args: unknown[]) => unknown} [compute]
   * @property {(host: HTMLElement, value: unknown, oldValue: unknown) => void} [observe]
   * @property {boolean} [reflect]
   * @property {unknown | (() => unknown)} [initial]
   * @property {unknown | (() => unknown)} [default]
   */

  /**
   * Declare watched properties (and related attributes) on an element.
   * @example
   * ```js
   * @property({ type: String })
   * accessor property1;
   *
   * @property({
   *   type: Number,
   *   input: ['property1'],
   *   compute: MyElement.computeProperty2,
   *   reflect: true,
   *   observe: MyElement.observeProperty2,
   *   default: 0,
   * })
   * accessor property2;
   * ```
   * @param {PropertyConfiguration} configuration
   * @returns {(target: unknown, context: object) => object}
   */
  static property(configuration) {
    return (target, context) => {
      if (context.kind !== 'accessor') {
        throw new Error('The @property decorator can only be used on accessor fields.');
      }
      if (context.static) {
        throw new Error('The @property decorator cannot be used on static accessors.');
      }

      const key = context.name;
      const internal = context.private;
      const name = typeof key === 'symbol' ? `#${key.description}` : key;
      configuration = configuration && typeof configuration === 'object' ? { ...configuration } : configuration;

      const metadata = context.metadata;
      if (!Object.hasOwn(metadata, XElement.#info)) {
        metadata[XElement.#info] = XElement.#mintMetadataInfo();
      }
      const metadataInfo = metadata[XElement.#info];
      metadataInfo.propertyNameToKey.set(name, key);
      metadataInfo.properties.set(key, { context: { key, name, internal, metadata }, configuration });

      return {
        get() {
          if (this.constructor.prototype === this) {
            throw new Error(`Cannot access property "${String(key)}" on prototype.`);
          }
          const hostInfo = this[XElement.#info];
          const constructorInfo = this.constructor[XElement.#info];
          const property = constructorInfo.properties.get(key);
          if (hostInfo.initialized) {
            return XElement.#getPropertyValue(this, property);
          } else {
            return hostInfo.values.get(property);
          }
        },
        set(value) {
          if (this.constructor.prototype === this) {
            throw new Error(`Cannot set property "${String(key)}" on prototype.`);
          }
          const hostInfo = this[XElement.#info];
          const constructorInfo = this.constructor[XElement.#info];
          const property = constructorInfo.properties.get(key);
          if (hostInfo.initialized) {
            XElement.#setPropertyValue(this, property, value);
          } else {
            hostInfo.values.set(property, value);
          }
        },
        init(value) {
          if (value !== undefined) {
            throw new Error(`Property "${String(context.name)}" should not have an initializer.`);
          }
          return value;
        },
      };
    };
  }

  /**
   * Declare event handlers on an element.
   * @example
   * ```js
   * @listener('scroll', { passive: true })
   * static onScroll(host, event) {
   *   // Handle scroll with passive option…
   * }
   *```
   * @param {string} type
   * @param {AddEventListenerOptions} [options]
   * @returns {(method: unknown, context: object) => void}
   */
  static listener(type, options) {
    return (method, context) => {
      if (context.kind !== 'method') {
        throw new Error('The @listener decorator can only be used on methods.');
      }
      if (!context.static) {
        throw new Error('The @listener decorator can only be used on static methods.');
      }

      const key = context.name;
      const name = typeof key === 'symbol' ? `#${key.description}` : key;
      const internal = context.private;
      options = options && typeof options === 'object' ? { ...options } : options;

      const metadata = context.metadata;
      if (!Object.hasOwn(metadata, XElement.#info)) {
        metadata[XElement.#info] = XElement.#mintMetadataInfo();
      }
      const metadataInfo = metadata[XElement.#info];
      const configuration = { type, options };
      if (!metadataInfo.listeners.has(type)) {
        metadataInfo.listeners.set(type, []);
      }
      metadataInfo.listeners.get(type).push({ configuration, context: { key, name, method, internal } });

      return method;
    };
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
   * Setup template callback to update DOM when properties change.
   * @example
   * ```js
   * static template(host) {
   *   return html`<a href="${host.href}">click me</a>`;
   * }
   * ```
   * @param {HTMLElement} host
   * @returns {unknown}
   */
  static template(host) { // eslint-disable-line no-unused-vars
    return html``;
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

  // TODO: #254: Uncomment once we leverage "moveBefore".
  // /**
  //  * Extends HTMLElement.prototype.connectedMoveCallback.
  //  */
  // connectedMoveCallback() {}

  /**
   * Extends HTMLElement.prototype.attributeChangedCallback.
   * @param {string} attribute
   * @param {string|null} oldValue
   * @param {string|null} value
   */
  attributeChangedCallback(attribute, oldValue, value) {
    const { attributes } = this.constructor[XElement.#info];
    // Authors may extend "observedAttributes". Optionally chain to account for
    // attributes which we don't know about.
    attributes.get(attribute)?.sync(this, value, oldValue);
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
    const { template, renderRoot } = this[XElement.#info];
    const result = template(this);
    try {
      render(renderRoot, result);
    } catch (error) {
      const pathString = XElement.#toPathString(this);
      // TypeScript can’t infer this as a custom element constructor yet.
      const constructor = /** @type {CustomElementConstructor} */ (this.constructor);
      const tagName = customElements.getName(constructor);
      const message = `Invalid template for "${constructor.name}" / <${tagName}> at path "${pathString}".`;
      throw new Error(message, { cause: error });
    }
  }

  /**
   * Wrapper around HTMLElement.addEventListener.
   * Advanced — use this only if declaring listeners statically is not possible.
   * @param {EventTarget} element
   * @param {string} type
   * @param {(event: Event) => void} callback
   * @param {AddEventListenerOptions} [options]
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
   * @param {(event: Event) => void} callback
   * @param {AddEventListenerOptions} [options]
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

  // Collect properties and listeners from this class and its parent.
  // Note: Properties / listeners accumulate. Parent already has grandparent data.
  static #analyzeDecorators(constructor) {
    const parentConstructor = Object.getPrototypeOf(constructor);
    const parentConstructorInfo = parentConstructor[XElement.#info];
    const parentProperties = parentConstructorInfo?.properties ?? new Map();
    const parentListeners = parentConstructorInfo?.listeners ?? new Map();
    const parentPropertyNameToKey = parentConstructorInfo?.propertyNameToKey ?? new Map();

    const metadata = Object.hasOwn(constructor, Symbol.metadata) ? constructor[Symbol.metadata] : null;
    const metadataInfo = (metadata && Object.hasOwn(metadata, XElement.#info))
      ? metadata[XElement.#info]
      : XElement.#mintMetadataInfo();

    // Add parent properties to child if missing.
    for (const [key, property] of parentProperties) {
      if (!metadataInfo.properties.has(key)) {
        // Copy only immutable parts; validation will set top-level properties fresh.
        metadataInfo.properties.set(key, {
          context: property.context,
          configuration: property.configuration,
        });
      } else if (typeof key === 'string' && key.startsWith('#')) {
        // TODO: #346: Remove this check when we use native decorators.
        throw new Error(`${constructor.name}: Cannot use private property "${key}" in both parent and child classes.`);
      }
    }

    // Add parent listeners to child, handling method name overrides.
    for (const [type, parentListenersArray] of parentListeners) {
      if (!metadataInfo.listeners.has(type)) {
        metadataInfo.listeners.set(type, parentListenersArray.map(listener => ({
          configuration: listener.configuration,
          context: listener.context,
        })));
      } else {
        const childListenersArray = metadataInfo.listeners.get(type);
        for (let iii = parentListenersArray.length - 1; iii >= 0; iii--) {
          // Iterate in reverse and unshift to ensure parent is before child.
          const parentListener = parentListenersArray[iii];
          const parentKey = parentListener.context.key;
          let overridden = false;
          if (parentListener.context.internal) {
            // TODO: #346: Remove this check when we use native decorators.
            overridden = false;
          } else {
            for (const childListener of childListenersArray) {
              if (childListener.context.key === parentKey) {
                overridden = true;
                break;
              }
            }
          }
          if (!overridden) {
            childListenersArray.unshift({
              configuration: parentListener.configuration,
              context: parentListener.context,
            });
          }
        }
      }
    }

    // Add parent public property names to child propertyNameToKey (skip private accessors).
    for (const [name, key] of parentPropertyNameToKey) {
      // Private accessors are not inherited (they're not accessible in child classes).
      if (!name.startsWith('#') && !metadataInfo.propertyNameToKey.has(name)) {
        metadataInfo.propertyNameToKey.set(name, key);
      }
    }

    const { properties, listeners, propertyNameToKey } = metadataInfo;
    return { properties, listeners, propertyNameToKey };
  }

  // Validates listener configurations.
  static #analyzeListeners(constructor, listeners) {
    for (const listenersArray of listeners.values()) {
      for (const listener of listenersArray) {
        if (XElement.#typeIsWrong(String, listener.configuration.type)) {
          const typeName = XElement.#getTypeName(listener.configuration.type);
          throw new Error(`Unexpected value for "${constructor.name}.${listener.context.name}" type (expected String, got ${typeName}).`);
        }
        if (Reflect.has(listener.configuration, 'options')) {
          const { options } = listener.configuration;
          if (XElement.#notNullish(options) && XElement.#typeIsWrong(Object, options)) {
            const typeName = XElement.#getTypeName(options);
            throw new Error(`Unexpected value for "${constructor.name}.${listener.context.name}" options (expected Object, got ${typeName}).`);
          }
        }
        listener.method = listener.context.method;
        listener.options = listener.configuration.options;
      }
    }
  }

  // Validates and sets up all property configurations.
  static #analyzeProperties(constructor, properties) {
    const entries = Array.from(properties.entries());
    const path = `${constructor.name}.prototype`;
    const attributes = new Map();
    for (const [key, property] of entries) {
      XElement.#validatePropertyConfiguration(constructor, key, property);
      property.key = property.context.key;
      property.name = property.context.name;
      property.internal = property.context.internal;
      property.metadata = property.context.metadata;
      property.type = property.configuration.type;
      property.output = new Set();
      property.attribute = XElement.#propertyHasAttribute(property)
        ? property.configuration.attribute ?? XElement.#camelToKebab(String(key))
        : undefined;
      if (typeof property.attribute === 'string') {
        // Attribute names are case-insensitive — lowercase to properly check for duplicates.
        if (property.attribute !== property.attribute.toLowerCase()) {
          throw new Error(`${path}.${key} has non-standard attribute casing "${property.attribute}" (use lower-cased names).`);
        }
        if (attributes.has(property.attribute)) {
          throw new Error(`${path}.${key} causes a duplicated attribute "${property.attribute}".`);
        }
        attributes.set(property.attribute, property);
      }
      if (property.configuration.input) {
        const inputConfig = property.configuration.input;
        const metadataInfo = property.metadata[XElement.#info];
        const resolvedInput = inputConfig.map((inputKey, index) => {
          const resolvedInputKey = metadataInfo.propertyNameToKey.get(inputKey);
          if (resolvedInputKey === undefined) {
            throw new Error(`${path}.${key}.input[${index}] has an unexpected item ("${inputKey}" cannot be resolved).`);
          }
          return resolvedInputKey;
        });
        property.input = new Set(resolvedInput.map(resolvedKey => properties.get(resolvedKey)));
      }

      // Add wrapper functions for property behaviors.
      XElement.#addPropertyInitial(constructor, property);
      XElement.#addPropertyDefault(constructor, property);
      XElement.#addPropertySync(constructor, property);
      XElement.#addPropertyCompute(constructor, property);
      XElement.#addPropertyReflect(constructor, property);
      XElement.#addPropertyObserve(constructor, property);
    }

    // Check for cyclic dependencies and build output graph.
    for (const [key, property] of entries) {
      if (XElement.#propertyIsCyclic(property)) {
        throw new Error(`${path}.${String(key)}.input is cyclic.`);
      }
      if (property.input) {
        for (const input of property.input) {
          input.output.add(property);
        }
      }
    }

    return attributes;
  }

  // Called once per class — kicked off from "static get observedAttributes".
  static #analyzeConstructor(constructor) {
    // Ensure parent constructor is analyzed first for proper inheritance.
    const parentConstructor = Object.getPrototypeOf(constructor);
    if (parentConstructor !== XElement && !Object.hasOwn(parentConstructor, XElement.#info)) {
      XElement.#analyzeConstructor(parentConstructor);
    }
    const { styles } = constructor;
    const { properties, listeners, propertyNameToKey } = XElement.#analyzeDecorators(constructor);
    XElement.#analyzeListeners(constructor, listeners);
    const attributes = XElement.#analyzeProperties(constructor, properties);
    constructor[XElement.#info] = { styles, properties, attributes, listeners, propertyNameToKey };
  }

  static #validatePropertyConfiguration(constructor, key, property) {
    const path = `${constructor.name}.prototype.${key}`;
    if (XElement.#typeIsWrong(Object, property.configuration)) {
      const typeName = XElement.#getTypeName(property.configuration);
      throw new Error(`${path} has an unexpected value (expected Object, got ${typeName}).`);
    }
    const { configuration, context } = property;
    const { internal } = context;
    if (key.includes('-')) {
      throw new Error(`Unexpected key "${path}" contains "-" (property names should be camelCased).`);
    }
    for (const propertyKey of Object.keys(configuration)) {
      if (XElement.#propertyConfigurationKeys.has(propertyKey) === false) {
        throw new Error(`Unexpected key "${path}.${propertyKey}".`);
      }
    }
    const { type, attribute, compute, input, reflect } = configuration;
    if (Reflect.has(configuration, 'type') && XElement.#typeIsWrong(Function, type)) {
      const typeName = XElement.#getTypeName(type);
      throw new Error(`Unexpected value for "${path}.type" (expected constructor Function, got ${typeName}).`);
    }
    for (const subKey of ['compute', 'observe']) {
      if (Reflect.has(configuration, subKey) && XElement.#typeIsWrong(Function, configuration[subKey])) {
        const typeName = XElement.#getTypeName(configuration[subKey]);
        throw new Error(`Unexpected value for "${path}.${subKey}" (expected Function, got ${typeName}).`);
      }
    }
    if (Reflect.has(configuration, 'reflect') && XElement.#typeIsWrong(Boolean, reflect)) {
      const typeName = XElement.#getTypeName(reflect);
      throw new Error(`Unexpected value for "${path}.reflect" (expected Boolean, got ${typeName}).`);
    }
    if (XElement.#prototypeInterface.has(key)) {
      throw new Error(`Unexpected key "${path}" shadows in XElement.prototype interface.`);
    }
    if (Reflect.has(configuration, 'attribute') && XElement.#typeIsWrong(String, attribute)) {
      const typeName = XElement.#getTypeName(attribute);
      throw new Error(`Unexpected value for "${path}.attribute" (expected String, got ${typeName}).`);
    }
    if (Reflect.has(configuration, 'attribute') && attribute === '') {
      throw new Error(`Unexpected value for "${path}.attribute" (expected non-empty String).`);
    }
    for (const subKey of ['initial', 'default']) {
      const value = Reflect.get(configuration, subKey);
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
    if (Reflect.has(configuration, 'input') && XElement.#typeIsWrong(Array, input)) {
      const typeName = XElement.#getTypeName(input);
      throw new Error(`Unexpected value for "${path}.input" (expected Array, got ${typeName}).`);
    }
    if (Reflect.has(configuration, 'input')) {
      const seenKeys = new Set();
      for (const [index, inputKey] of Object.entries(input)) {
        if (XElement.#typeIsWrong(String, inputKey)) {
          const typeName = XElement.#getTypeName(inputKey);
          throw new Error(`Unexpected value for "${path}.input[${index}]" (expected String, got ${typeName}).`);
        }
        if (seenKeys.has(inputKey)) {
          throw new Error(`Duplicate key "${inputKey}" in "${path}.input" (each input key must be unique).`);
        }
        seenKeys.add(inputKey);
      }
    }
    const unserializable = XElement.#serializableTypes.has(type) === false;
    const typeName = type?.prototype && type?.name ? type.name : XElement.#getTypeName(type);
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
    if (Reflect.has(configuration, 'initial') && compute) {
      throw new Error(`Found "${path}.initial" and "${path}.compute" (computed properties cannot set an initial value).`);
    }
    if (reflect && internal) {
      throw new Error(`Found "${path}.reflect" but property is private (private properties cannot be reflected).`);
    }
    if (internal && attribute) {
      throw new Error(`Found "${path}.attribute" but property is private (private properties cannot have attributes).`);
    }
  }

  // Determines if computed property inputs form a cycle.
  static #propertyIsCyclic(property, seen = new Set()) {
    if (property.input) {
      for (const input of property.input) {
        const nextSeen = new Set([...seen, property]);
        if (
          input === property ||
          seen.has(input) ||
          XElement.#propertyIsCyclic(input, nextSeen)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // Wrapper to improve ergonomics of coalescing nullish, initial value.
  static #addPropertyInitial(constructor, property) {
    if (Reflect.has(property.configuration, 'initial')) {
      const initialValue = property.configuration.initial;
      const isFunction = XElement.#typeIsWrong(Function, initialValue) === false;
      property.initial = value =>
        value ?? (isFunction ? initialValue.call(constructor) : initialValue);
    } else {
      property.initial = value => value;
    }
  }

  // Wrapper to improve ergonomics of coalescing nullish, default value.
  static #addPropertyDefault(constructor, property) {
    if (Reflect.has(property.configuration, 'default')) {
      const { key } = property;
      const defaultValue = property.configuration.default;
      const isFunction = XElement.#typeIsWrong(Function, defaultValue) === false;
      const getOrCreateDefault = host => {
        const { defaultMap } = host[XElement.#info];
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
        const { initialized, reflecting } = host[XElement.#info];
        if (reflecting === false && initialized && value !== oldValue) {
          const deserialization = XElement.#deserializeProperty(host, property, value);
          XElement.#setPropertyValue(host, property, deserialization);
        }
      };
    }
  }

  // Wrapper to centralize logic needed to perform reflection.
  static #addPropertyReflect(constructor, property) {
    if (property.configuration.reflect) {
      property.reflect = host => {
        const value = XElement.#getPropertyValue(host, property);
        const serialization = XElement.#serializeProperty(host, property, value);
        const hostInfo = host[XElement.#info];
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
    const compute = property.configuration.compute;
    if (compute) {
      property.compute = host => {
        const { computeMap, values } = host[XElement.#info];
        const saved = computeMap.get(property);
        if (saved.valid === false) {
          const args = [];
          for (const input of property.input) {
            args.push(XElement.#getPropertyValue(host, input));
          }
          if (saved.args === undefined || args.some((arg, index) => arg !== saved.args[index])) {
            const value = property.default(host, compute.call(constructor, ...args));
            XElement.#validatePropertyValue(host, property, value);
            values.set(property, value);
            saved.args = args;
          }
          saved.valid = true;
        }
        return values.get(property);
      };
    }
  }

  // Wrapper to provide last value to observe callbacks.
  static #addPropertyObserve(constructor, property) {
    const observe = property.configuration.observe;
    if (observe) {
      property.observe = host => {
        const saved = host[XElement.#info].observeMap.get(property);
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
    const methods = new Map();
    const values = new Map();
    const renderRoot = host.constructor.createRenderRoot(host);
    if (!renderRoot || renderRoot !== host && renderRoot !== host.shadowRoot) {
      throw new Error('Unexpected render root returned. Expected "host" or "host.shadowRoot".');
    }
    const template = host.constructor.template.bind(host.constructor);
    const computeMap = new Map();
    const observeMap = new Map();
    const defaultMap = new Map();
    const constructorInfo = host.constructor[XElement.#info];
    const { styles, properties } = constructorInfo;
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
    for (const property of properties.values()) {
      if (property.compute) {
        computeMap.set(property, { valid: false, args: undefined });
      }
      if (property.observe) {
        observeMap.set(property, { value: undefined });
      }
    }
    host[XElement.#info] = {
      initialized: false, reflecting: false, invalidProperties, methods,
      renderRoot, template, computeMap, observeMap, defaultMap, values,
    };
    XElement.#upgradeOwnProperties(host);
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
    const hostInfo = host[XElement.#info];
    const { computeMap, initialized, invalidProperties, values } = hostInfo;
    if (initialized === false) {
      const { properties } = host.constructor[XElement.#info];
      for (const property of properties.values()) {
        const { value, found } = XElement.#getPreInitializedPropertyValue(host, property);
        if (found) {
          XElement.#validatePropertyMutable(host, property);
          const initialValue = property.default(host, property.initial(value));
          XElement.#validatePropertyValue(host, property, initialValue);
          values.set(property, initialValue);
        } else if (!property.compute) {
          // Set to a nullish value so that it coalesces to the default.
          const initialValue = property.default(host, property.initial());
          XElement.#validatePropertyValue(host, property, initialValue);
          values.set(property, initialValue);
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
  static #getPreInitializedPropertyValue(host, property) {
    // Process possible sources of initial state, with this priority:
    // 1. imperative, e.g. `element.prop = 'value';`
    // 2. declarative, e.g. `<element prop="value"></element>`
    const { attribute } = property;
    let value;
    let found = false;
    const { values } = host[XElement.#info];
    if (values.has(property)) {
      value = values.get(property);
      values.delete(property);
      found = true;
    } else if (attribute && host.hasAttribute(attribute)) {
      const attributeValue = host.getAttribute(attribute);
      value = XElement.#deserializeProperty(host, property, attributeValue);
      found = true;
    }
    return { value, found };
  }

  static #addListener(host, element, type, callback, options) {
    callback = XElement.#getListener(host, callback);
    element.addEventListener(type, callback, options);
  }

  static #addListeners(host) {
    const { renderRoot } = host[XElement.#info];
    const { listeners } = host.constructor[XElement.#info];
    for (const [type, listenersArray] of listeners) {
      for (const listener of listenersArray) {
        XElement.#addListener(host, renderRoot, type, listener.method, listener.options);
      }
    }
  }

  static #removeListener(host, element, type, callback, options) {
    callback = XElement.#getListener(host, callback);
    element.removeEventListener(type, callback, options);
  }

  static #removeListeners(host) {
    const { renderRoot } = host[XElement.#info];
    const { listeners } = host.constructor[XElement.#info];
    for (const [type, listenersArray] of listeners) {
      for (const listener of listenersArray) {
        XElement.#removeListener(host, renderRoot, type, listener.method, listener.options);
      }
    }
  }

  static #getListener(host, listenerMethod) {
    const { methods } = host[XElement.#info];
    if (methods.has(listenerMethod) === false) {
      methods.set(listenerMethod, listenerMethod.bind(host.constructor, host));
    }
    return methods.get(listenerMethod);
  }

  static #updateHost(host) {
    // Order of operations: compute, reflect, render, then observe.
    const { invalidProperties } = host[XElement.#info];
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
        const array = Array.from(element.attributes)
          .map(({ name, value }) => value ? `${name}="${value}"` : name);
        return `${tag}${array.length ? `[${array.join('][')}]` : ''}`;
      })
      .join(' < ');
  }

  static #invalidateProperty(host, property) {
    const { invalidProperties, computeMap } = host[XElement.#info];
    for (const output of property.output) {
      XElement.#invalidateProperty(host, output);
    }
    const queueUpdate = invalidProperties.size === 0;
    invalidProperties.add(property);
    if (property.compute) {
      computeMap.get(property).valid = false;
    }
    if (queueUpdate) {
      // Batch on microtask to allow multiple, synchronous changes.
      queueMicrotask(() => XElement.#updateHost(host));
    }
  }

  static #getPropertyValue(host, property) {
    const { values } = host[XElement.#info];
    return property.compute?.(host) ?? values.get(property);
  }

  static #validatePropertyMutable(host, property) {
    const { compute, key } = property;
    if (compute) {
      const path = `${host.constructor.name}.prototype.${String(key)}`;
      throw new Error(`Property "${path}" is computed (computed properties are read-only).`);
    }
  }

  static #validatePropertyValue(host, property, value) {
    if (property.type && XElement.#notNullish(value)) {
      if (XElement.#typeIsWrong(property.type, value)) {
        const path = `${host.constructor.name}.prototype.${String(property.key)}`;
        const typeName = XElement.#getTypeName(value);
        throw new Error(`Unexpected value for "${path}" (expected ${property.type.name}, got ${typeName}).`);
      }
    }
  }

  static #setPropertyValue(host, property, value) {
    const { values } = host[XElement.#info];
    if (Object.is(value, values.get(property)) === false) {
      XElement.#validatePropertyMutable(host, property);
      value = property.default(host, value);
      XElement.#validatePropertyValue(host, property, value);
      values.set(property, value);
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
      return value !== null;
    } else if (value === null) {
      return undefined;
    } else if (!property.type) {
      return value;
    } else {
      switch (property.type) {
        case Number:
          return value.trim() ? property.type(value) : Number.NaN;
        default:
          return property.type(value);
      }
    }
  }

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
    return (
      XElement.#notNullish(value) === false ||
      (!(value instanceof type) && XElement.#getTypeName(value) !== type.name)
    );
  }

  static #camelToKebab(camel) {
    const str = String(camel);
    if (XElement.#caseMap.has(str) === false) {
      XElement.#caseMap.set(str, str.replace(/([A-Z])/g, '-$1').toLowerCase());
    }
    return XElement.#caseMap.get(str);
  }

  static #mintMetadataInfo() {
    const properties = new Map();
    const listeners = new Map();
    const propertyNameToKey = new Map();
    return { properties, listeners, propertyNameToKey };
  }

  // Using symbols trades true privacy for performance. Property access is
  //  significantly faster than WeakMap lookups, especially in hot paths like
  //  property getters / setters. Symbols are only discoverable via reflection
  //  APIs like Object.getOwnPropertySymbols(), but are not enumerable.
  static #info = Symbol('__x-element-info__');
  static #propertyConfigurationKeys = new Set(['type', 'attribute', 'input', 'compute', 'observe', 'reflect', 'initial', 'default']);
  static #serializableTypes = new Set([Boolean, String, Number]);
  static #caseMap = new Map();
  static #prototypeInterface = new Set(Object.getOwnPropertyNames(XElement.prototype));
}

const { property, listener } = XElement;
export { XElement, property, listener, html };
