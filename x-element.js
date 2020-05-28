import { asyncAppend } from '../../lit-html/directives/async-append.js';
import { asyncReplace } from '../../lit-html/directives/async-replace.js';
import { cache } from '../../lit-html/directives/cache.js';
import { classMap } from '../../lit-html/directives/class-map.js';
import { directive, html, render, svg } from '../../lit-html/lit-html.js';
import { guard } from '../../lit-html/directives/guard.js';
import { ifDefined } from '../../lit-html/directives/if-defined.js';
import { live } from '../../lit-html/directives/live.js';
import { repeat } from '../../lit-html/directives/repeat.js';
import { styleMap } from '../../lit-html/directives/style-map.js';
import { templateContent } from '../../lit-html/directives/template-content.js';
import { unsafeHTML } from '../../lit-html/directives/unsafe-html.js';
import { unsafeSVG } from '../../lit-html/directives/unsafe-svg.js';
import { until } from '../../lit-html/directives/until.js';

// TODO: replace "__thing >> #thing" when static private fields are supported.
export default class XElement extends HTMLElement {
  // All declared properties are observed via associated attributes.
  static get observedAttributes() {
    XElement.__analyzeConstructor(this);
    const { attributeMap } = XElement.__constructors.get(this);
    return [...attributeMap.keys()];
  }

  // This gets converted into "propertyMap" and "attributeMap" internally.
  static get properties() {
    return {};
  }

  // This gets converted into "listenerMap" internally.
  static get listeners() {
    return {};
  }

  // Typically, you want a shadow root, but "host" could also be returned.
  static createRenderRoot(host) {
    return host.attachShadow({ mode: 'open' });
  }

  // Use the current property values to interpolate an html template.
  static template(html, engine) { // eslint-disable-line no-unused-vars, no-shadow
    return (properties, host) => {}; // eslint-disable-line no-unused-vars
  }

  // Standard instance constructor.
  constructor() {
    super();
    XElement.__constructHost(this);
  }

  // Standard HTMLElement connectedCallback.
  connectedCallback() {
    XElement.__initializeHost(this);
    XElement.__addListeners(this);
  }

  // Standard HTMLElement attributeChangedCallback.
  attributeChangedCallback(attribute, oldValue, value) {
    const { attributeMap } = XElement.__constructors.get(this.constructor);
    attributeMap.get(attribute).sync(this, value, oldValue);
  }

  // Standard HTMLElement adoptedCallback.
  adoptedCallback() {}

  // Standard HTMLElement disconnectedCallback.
  disconnectedCallback() {
    XElement.__removeListeners(this);
  }

  // Bind template result to render root.
  render() {
    const { template, properties, renderRoot } = XElement.__hosts.get(this);
    render(template(properties, this), renderRoot);
  }

  // Convenience wrapper around addEventListener to get the "this" right.
  listen(element, type, callback, options) {
    if (XElement.__typeIsWrong(EventTarget, element)) {
      const typeName = XElement.__getTypeName(element);
      throw new Error(`Unexpected element passed to listen (expected EventTarget, got ${typeName}).`);
    }
    if (XElement.__typeIsWrong(String, type)) {
      const typeName = XElement.__getTypeName(type);
      throw new Error(`Unexpected type passed to listen (expected String, got ${typeName}).`);
    }
    if (XElement.__typeIsWrong(Function, callback)) {
      const typeName = XElement.__getTypeName(callback);
      throw new Error(`Unexpected callback passed to listen (expected Function, got ${typeName}).`);
    }
    if (XElement.__notNullish(options) && XElement.__typeIsWrong(Object, options)) {
      const typeName = XElement.__getTypeName(options);
      throw new Error(`Unexpected options passed to listen (expected Object, got ${typeName}).`);
    }
    XElement.__addListener(this, element, type, callback, options);
  }

  // Inverse of listen. Use this to make sure function pointer is the same.
  unlisten(element, type, callback, options) {
    if (XElement.__typeIsWrong(EventTarget, element)) {
      const typeName = XElement.__getTypeName(element);
      throw new Error(`Unexpected element passed to unlisten (expected EventTarget, got ${typeName}).`);
    }
    if (XElement.__typeIsWrong(String, type)) {
      const typeName = XElement.__getTypeName(type);
      throw new Error(`Unexpected type passed to unlisten (expected String, got ${typeName}).`);
    }
    if (XElement.__typeIsWrong(Function, callback)) {
      const typeName = XElement.__getTypeName(callback);
      throw new Error(`Unexpected callback passed to unlisten (expected Function, got ${typeName}).`);
    }
    if (XElement.__notNullish(options) && XElement.__typeIsWrong(Object, options)) {
      const typeName = XElement.__getTypeName(options);
      throw new Error(`Unexpected options passed to unlisten (expected Object, got ${typeName}).`);
    }
    XElement.__removeListener(this, element, type, callback, options);
  }

  // Dispatch a standard "ErrorEvent" on the element.
  dispatchError(error) {
    const { message } = error;
    const eventData = { error, message, bubbles: true, composed: true };
    this.dispatchEvent(new ErrorEvent('error', eventData));
  }

  // For element authors. Set and get "internal" properties.
  get internal() {
    return XElement.__hosts.get(this).internal;
  }

  static __analyzeConstructor(constructor) {
    const { properties, listeners } = constructor;
    const propertiesEntries = Object.entries(properties);
    const listenersEntries = Object.entries(listeners);
    XElement.__validateProperties(constructor, properties, propertiesEntries);
    XElement.__validateListeners(constructor, listeners, listenersEntries);
    const propertyMap = new Map(propertiesEntries);
    const internalPropertyMap = new Map();
    // Use a normal object for better autocomplete when debugging in console.
    const propertiesTarget = {};
    const internalTarget = {};
    const attributeMap = new Map();
    for (const [key, property] of propertyMap) {
      // We mutate (vs copy) to allow cross-referencing property objects.
      XElement.__mutateProperty(constructor, propertyMap, key, property);
      if (property.internal || property.readOnly) {
        internalPropertyMap.set(key, property);
        internalTarget[key] = undefined;
      }
      propertiesTarget[key] = undefined;
      attributeMap.set(property.attribute, property);
    }
    const listenerMap = new Map(listenersEntries);
    XElement.__constructors.set(constructor, {
      propertyMap, internalPropertyMap, attributeMap, listenerMap,
      propertiesTarget, internalTarget,
    });
  }

  static __validateProperties(constructor, properties, entries) {
    const path = `${constructor.name}.properties`;
    for (const [key, property] of entries) {
      if (XElement.__typeIsWrong(Object, property)) {
        const typeName = XElement.__getTypeName(property);
        throw new Error(`${path}.${key} has an unexpected value (expected Object, got ${typeName}).`);
      }
    }
    for (const [key, property] of entries) {
      XElement.__validateProperty(constructor, key, property);
    }
    const attributes = new Set();
    const inputMap = new Map();
    for (const [key, property] of entries) {
      const attribute = property.attribute || XElement.__camelToKebab(key);
      if (attributes.has(attribute)) {
        throw new Error(`${path}.${key} causes a duplicated attribute "${attribute}".`);
      }
      attributes.add(attribute);
      if (Reflect.has(property, 'input')) {
        const { input } = property;
        inputMap.set(property, input.map(inputKey => properties[inputKey]));
        for (const [index, inputKey] of Object.entries(input)) {
          if (XElement.__typeIsWrong(Object, properties[inputKey])) {
            throw new Error(`${path}.${key}.input[${index}] has an unexpected item ("${inputKey}" has not been declared).`);
          }
        }
      }
    }
    for (const [key, property] of entries) {
      if (XElement.__propertyIsCyclic(property, inputMap)) {
        throw new Error(`${path}.${key}.input is cyclic.`);
      }
    }
  }

  static __validateProperty(constructor, key, property) {
    const path = `${constructor.name}.properties.${key}`;
    if (X_ELEMENT_INTERFACE.has(key)) {
      throw new Error(`Unexpected key "${path}" shadows XElement.prototype interface (${[...X_ELEMENT_INTERFACE].join(', ')}).`);
    }
    if (INHERITED_INTERFACE.has(key)) {
      const error = new Error(`Unexpected key "${path}" shadows inherited property name, behavior not guaranteed.`);
      console.warn(error); // eslint-disable-line no-console
    }
    for (const propertyKey of Object.keys(property)) {
      if (XElement.__propertyKeys.has(propertyKey) === false) {
        throw new Error(`Unexpected key "${path}.${propertyKey}".`);
      }
    }
    const { type, attribute, compute, input, reflect, internal, readOnly } = property;
    if (Reflect.has(property, 'type') && XElement.__typeIsWrong(Function, type)) {
      const typeName = XElement.__getTypeName(type);
      throw new Error(`Unexpected value for "${path}.type" (expected constructor Function, got ${typeName}).`);
    }
    for (const subKey of ['compute', 'observe']) {
      if (Reflect.has(property, subKey) && XElement.__typeIsWrong(Function, property[subKey])) {
        const typeName = XElement.__getTypeName(property[subKey]);
        throw new Error(`Unexpected value for "${path}.${subKey}" (expected Function, got ${typeName}).`);
      }
    }
    for (const subKey of ['reflect', 'internal', 'readOnly']) {
      if (Reflect.has(property, subKey) && XElement.__typeIsWrong(Boolean, property[subKey])) {
        const typeName = XElement.__getTypeName(property[subKey]);
        throw new Error(`Unexpected value for "${path}.${subKey}" (expected Boolean, got ${typeName}).`);
      }
    }
    if (Reflect.has(property, 'attribute') && XElement.__typeIsWrong(String, attribute)) {
      const typeName = XElement.__getTypeName(attribute);
      throw new Error(`Unexpected value for "${path}.attribute" (expected String, got ${typeName}).`);
    }
    if (Reflect.has(property, 'attribute') && attribute === '') {
      throw new Error(`Unexpected value for "${path}.attribute" (expected non-empty String).`);
    }
    for (const subKey of ['initial', 'default']) {
      const value = Reflect.get(property, subKey);
      if (
        XElement.__notNullish(value) &&
        XElement.__typeIsWrong(Boolean, value) &&
        XElement.__typeIsWrong(String, value) &&
        XElement.__typeIsWrong(Number, value) &&
        XElement.__typeIsWrong(Function, value)
      ) {
        const typeName = XElement.__getTypeName(value);
        throw new Error(`Unexpected value for "${path}.${subKey}" (expected Boolean, String, Number, or Function, got ${typeName}).`);
      }
    }
    if (Reflect.has(property, 'input') && XElement.__typeIsWrong(Array, input)) {
      const typeName = XElement.__getTypeName(input);
      throw new Error(`Unexpected value for "${path}.input" (expected Array, got ${typeName}).`);
    }
    if (Reflect.has(property, 'input')) {
      for (const [index, inputKey] of Object.entries(input)) {
        if (XElement.__typeIsWrong(String, inputKey)) {
          const typeName = XElement.__getTypeName(inputKey);
          throw new Error(`Unexpected value for "${path}.input[${index}]" (expected String, got ${typeName}).`);
        }
      }
    }
    if (reflect && (Reflect.has(property, 'type') === false || XElement.__serializableTypes.has(property.type) === false)) {
      const typeName = property.type?.prototype && property.type?.name ? property.type.name : XElement.__getTypeName(property.type);
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

  static __propertyIsCyclic(property, inputMap, seen = new Set()) {
    if (inputMap.has(property)) {
      for (const input of inputMap.get(property)) {
        const nextSeen = new Set([...seen, property]);
        if (
          input === property ||
          seen.has(input) ||
          XElement.__propertyIsCyclic(input, inputMap, nextSeen)
        ) {
          return true;
        }
      }
    }
  }

  static __validateListeners(constructor, listeners, entries) {
    const path = `${constructor.name}.listeners`;
    for (const [type, listener] of entries) {
      if (XElement.__typeIsWrong(Function, listener)) {
        const typeName = XElement.__getTypeName(listener);
        throw new Error(`${path}.${type} has unexpected value (expected Function, got ${typeName}).`);
      }
    }
  }

  static __mutateProperty(constructor, propertyMap, key, property) {
    property.key = key;
    property.attribute = property.attribute ?? XElement.__camelToKebab(key);
    property.input = new Set((property.input ?? []).map(inputKey => propertyMap.get(inputKey)));
    property.output = property.output ?? new Set();
    for (const input of property.input) {
      input.output = input.output ?? new Set();
      input.output.add(property);
    }
    XElement.__addPropertyInitial(constructor, property);
    XElement.__addPropertyDefault(constructor, property);
    XElement.__addPropertySync(constructor, property);
    XElement.__addPropertyCompute(constructor, property);
    XElement.__addPropertyReflect(constructor, property);
    XElement.__addPropertyObserve(constructor, property);
  }

  // Wrapper to improve ergonomics of coalescing nullish, initial value.
  static __addPropertyInitial(constructor, property) {
    // Should take `value` in and spit the initial or value out.
    if (Reflect.has(property, 'initial')) {
      const initialValue = XElement.__typeIsWrong(Function, property.initial)
        ? property.initial
        : property.initial.call(constructor);
      const isFunction = XElement.__typeIsWrong(Function, initialValue) === false;
      property.initial = value => {
        return value ?? (isFunction ? initialValue.call(constructor) : initialValue);
      };
    } else {
      property.initial = value => value;
    }
  }

  // Wrapper to improve ergonomics of coalescing nullish, default value.
  static __addPropertyDefault(constructor, property) {
    // Should take `value` in and spit the default or value out.
    if (Reflect.has(property, 'default')) {
      const defaultValue = XElement.__typeIsWrong(Function, property.default)
        ? property.default
        : property.default.call(constructor);
      const isFunction = XElement.__typeIsWrong(Function, defaultValue) === false;
      property.default = value => {
        return value ?? (isFunction ? defaultValue.call(constructor) : defaultValue);
      };
    } else {
      property.default = value => value;
    }
  }

  // Wrapper to improve ergonomics of syncing attributes back to properties.
  static __addPropertySync(constructor, property) {
    if (Reflect.has(property, 'type') && XElement.__serializableTypes.has(property.type) === false) {
      property.sync = () => {
        const path = `${constructor.name}.properties.${property.key}`;
        throw new Error(`Unexpected deserialization for "${path}" (cannot deserialize into ${property.type.name}).`);
      };
    } else {
      property.sync = (host, value, oldValue) => {
        const { initialized, reflecting } = XElement.__hosts.get(host);
        if (reflecting === false && initialized && value !== oldValue) {
          const deserialization = XElement.__deserializeProperty(host, property, value);
          host[property.key] = deserialization;
        }
      };
    }
  }

  // Wrapper to centralize logic needed to perform reflection.
  static __addPropertyReflect(constructor, property) {
    if (property.reflect) {
      property.reflect = host => {
        const value = XElement.__getPropertyValue(host, property);
        const serialization = XElement.__serializeProperty(host, property, value);
        const hostInfo = XElement.__hosts.get(host);
        hostInfo.reflecting = true;
        serialization === undefined
          ? host.removeAttribute(property.attribute)
          : host.setAttribute(property.attribute, serialization);
        hostInfo.reflecting = false;
      };
    }
  }

  // Wrapper to prevent repeated compute callbacks.
  static __addPropertyCompute(constructor, property) {
    const { compute } = property;
    if (compute) {
      property.compute = host => {
        const { computeMap, valueMap } = XElement.__hosts.get(host);
        const saved = computeMap.get(property);
        if (saved.valid === false) {
          const args = [];
          for (const input of property.input) {
            args.push(XElement.__getPropertyValue(host, input));
          }
          if (saved.args === undefined || args.some((arg, index) => arg !== saved.args[index])) {
            const value = property.default(compute.call(constructor, ...args));
            XElement.__validatePropertyValue(host, property, value);
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
  static __addPropertyObserve(constructor, property) {
    const { observe } = property;
    if (observe) {
      property.observe = host => {
        const saved = XElement.__hosts.get(host).observeMap.get(property);
        const value = XElement.__getPropertyValue(host, property);
        if (Object.is(value, saved.value) === false) {
          observe.call(constructor, host, value, saved.value);
        }
        saved.value = value;
      };
    }
  }

  static __constructHost(host) {
    const invalidProperties = new Set();
    // The weak map prevents memory leaks. E.g., adding anonymous listeners.
    const listenerMap = new WeakMap();
    const valueMap = new Map();
    const renderRoot = host.constructor.createRenderRoot(host);
    if (!renderRoot || renderRoot !== host && renderRoot !== host.shadowRoot) {
      throw new Error('Unexpected render root returned. Expected "host" or "host.shadowRoot".');
    }
    const template = host.constructor.template(html, {
      asyncAppend, asyncReplace, cache, classMap, directive, guard, html,
      ifDefined, live, repeat, styleMap, svg, templateContent, unsafeHTML,
      unsafeSVG, until,
    });
    const properties = XElement.__createProperties(host);
    const internal = XElement.__createInternal(host);
    const computeMap = new Map();
    const observeMap = new Map();
    const { propertyMap } = XElement.__constructors.get(host.constructor);
    for (const property of propertyMap.values()) {
      if (property.compute) {
        computeMap.set(property, { valid: false, args: undefined });
      }
      if (property.observe) {
        observeMap.set(property, { value: undefined });
      }
    }
    XElement.__hosts.set(host, {
      initialized: false, reflecting: false, invalidProperties, listenerMap,
      renderRoot, template, properties, internal, computeMap, observeMap,
      valueMap,
    });
  }

  static __createInternal(host) {
    const { propertyMap, internalPropertyMap, internalTarget } =  XElement.__constructors.get(host.constructor);
    // Everything but "get", "set", "has", and "ownKeys" are considered invalid.
    // Note that impossible traps like "apply" or "construct" are not guarded.
    const invalid = () => { throw new Error('Invalid use of internal proxy.'); };
    const get = (target, key) => {
      const internalProperty = internalPropertyMap.get(key);
      if (internalProperty?.internal) {
        return XElement.__getPropertyValue(host, internalProperty);
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
        XElement.__setPropertyValue(host, internalProperty, value);
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
  static __createProperties(host) {
    const { propertyMap, propertiesTarget } =  XElement.__constructors.get(host.constructor);
    // Everything but "get", "set", "has", and "ownKeys" are considered invalid.
    const invalid = () => { throw new Error('Invalid use of properties proxy.'); };
    const get = (target, key) => {
      if (propertyMap.has(key)) {
        return XElement.__getPropertyValue(host, propertyMap.get(key));
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

  static __initializeHost(host) {
    const hostInfo = XElement.__hosts.get(host);
    const { initialized, invalidProperties } = hostInfo;
    if (initialized === false) {
      XElement.__upgradeOwnProperties(host);
      // Only reflect attributes when the element is connected.
      const { propertyMap } = XElement.__constructors.get(host.constructor);
      for (const property of propertyMap.values()) {
        const { value, found } = XElement.__getPreUpgradePropertyValue(host, property);
        XElement.__initializeProperty(host, property);
        if (found) {
          host[property.key] = property.default(property.initial(value));
        } else if (!property.compute) {
          // Set to a nullish value so that it coalesces to the default.
          XElement.__setPropertyValue(host, property, property.default(property.initial()));
        }
        invalidProperties.add(property);
      }
      hostInfo.initialized = true;
      XElement.__updateHost(host);
    }
  }

  // Prevent shadowing from properties added to element instance pre-upgrade.
  static __upgradeOwnProperties(host) {
    for (const key of Reflect.ownKeys(host)) {
      const value = Reflect.get(host, key);
      Reflect.deleteProperty(host, key);
      Reflect.set(host, key, value);
    }
  }

  static __getPreUpgradePropertyValue(host, property) {
    // Process possible sources of initial state, with this priority:
    // 1. imperative, e.g. `element.prop = 'value';`
    // 2. declarative, e.g. `<element prop="value"></element>`
    const { key, attribute } = property;
    let value;
    let found = false;
    if (Reflect.has(host, key)) {
      value = host[key];
      found = true;
    } else if (host.hasAttribute(attribute)) {
      const attributeValue = host.getAttribute(attribute);
      value = XElement.__deserializeProperty(host, property, attributeValue);
      found = true;
    }
    return { value, found };
  }

  static __initializeProperty(host, property) {
    const { key, compute, readOnly, internal } = property;
    const path = `${host.constructor.name}.properties.${key}`;
    const get = internal
      ? () => { throw new Error(`Property "${path}" is internal (internal.${key}).`); }
      : () => XElement.__getPropertyValue(host, property);
    const set = compute || readOnly || internal
      ? () => {
        if (compute && !internal) {
          throw new Error(`Property "${path}" is computed (computed properties are read-only).`);
        } else if (readOnly) {
          throw new Error(`Property "${path}" is read-only (internal.${key}).`);
        } else {
          throw new Error(`Property "${path}" is internal (internal.${key}).`);
        }
      }
      : value => XElement.__setPropertyValue(host, property, value);
    const enumerable = !internal;
    Reflect.deleteProperty(host, key);
    Reflect.defineProperty(host, key, { get, set, enumerable });
  }

  static __addListener(host, element, type, callback, options) {
    callback = XElement.__getListener(host, callback);
    element.addEventListener(type, callback, options);
  }

  static __addListeners(host) {
    const { listenerMap } = XElement.__constructors.get(host.constructor);
    const { renderRoot } = XElement.__hosts.get(host);
    for (const [type, listener] of listenerMap) {
      XElement.__addListener(host, renderRoot, type, listener);
    }
  }

  static __removeListener(host, element, type, callback, options) {
    callback = XElement.__getListener(host, callback);
    element.removeEventListener(type, callback, options);
  }

  static __removeListeners(host) {
    const { listenerMap } = XElement.__constructors.get(host.constructor);
    const { renderRoot } = XElement.__hosts.get(host);
    for (const [type, listener] of listenerMap) {
      XElement.__removeListener(host, renderRoot, type, listener);
    }
  }

  static __getListener(host, listener) {
    const { listenerMap } = XElement.__hosts.get(host);
    if (listenerMap.has(listener) === false) {
      listenerMap.set(listener, listener.bind(host.constructor, host));
    }
    return listenerMap.get(listener);
  }

  static __updateHost(host) {
    // Order of operations: compute, reflect, render, then observe.
    const { invalidProperties } = XElement.__hosts.get(host);
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

  static async __invalidateProperty(host, property) {
    const { initialized, invalidProperties, computeMap } = XElement.__hosts.get(host);
    if (initialized) {
      for (const output of property.output) {
        XElement.__invalidateProperty(host, output);
      }
      const queueUpdate = invalidProperties.size === 0;
      invalidProperties.add(property);
      if (property.compute) {
        computeMap.get(property).valid = false;
      }
      if (queueUpdate) {
        // Queue a microtask. Allows multiple, synchronous changes.
        await Promise.resolve();
        XElement.__updateHost(host);
      }
    }
  }

  static __getPropertyValue(host, property) {
    const { valueMap } = XElement.__hosts.get(host);
    return property.compute?.(host) ?? valueMap.get(property);
  }

  static __validatePropertyValue(host, property, value) {
    if (property.type && XElement.__notNullish(value)) {
      if (XElement.__typeIsWrong(property.type, value)) {
        const path = `${host.constructor.name}.properties.${property.key}`;
        const typeName = XElement.__getTypeName(value);
        throw new Error(`Unexpected value for "${path}" (expected ${property.type.name}, got ${typeName}).`);
      }
    }
  }

  static __setPropertyValue(host, property, value) {
    const { valueMap } = XElement.__hosts.get(host);
    if (Object.is(value, valueMap.get(property)) === false) {
      value = property.default(value);
      XElement.__validatePropertyValue(host, property, value);
      valueMap.set(property, value);
      XElement.__invalidateProperty(host, property);
    }
  }

  static __serializeProperty(host, property, value) {
    if (XElement.__notNullish(value)) {
      if (property.type === Boolean) {
        return value ? '' : undefined;
      }
      return value.toString();
    }
  }

  static __deserializeProperty(host, property, value) {
    if (property.type) {
      if (property.type === Boolean) {
        // Per HTML spec, every value other than null is considered true.
        return value !== null;
      } else if (value === null) {
        // Null as an attribute is really "undefined" as a property.
        return undefined;
      } else {
        // Coerce type as needed.
        return property.type(value);
      }
    } else {
      return value;
    }
  }

  static __getTypeName(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  }

  static __notNullish(value) {
    return value !== undefined && value !== null;
  }

  static __typeIsWrong(type, value) {
    // Because `instanceof` fails on primitives (`'' instanceof String === false`)
    // and `Object.prototype.toString` cannot handle inheritance, we use both.
    return (
      XElement.__notNullish(value) === false ||
      (!(value instanceof type) && XElement.__getTypeName(value) !== type.name)
    );
  }

  static __camelToKebab(camel) {
    if (XElement.__caseMap.has(camel) === false) {
      XElement.__caseMap.set(camel, camel.replace(/([A-Z])/g, '-$1').toLowerCase());
    }
    return XElement.__caseMap.get(camel);
  }
}

// TODO: define as private class fields inside the constructor when supported.
XElement.__constructors = new WeakMap();
XElement.__hosts = new WeakMap();
XElement.__propertyKeys = new Set(['type', 'attribute', 'input', 'compute', 'observe', 'reflect', 'internal', 'readOnly', 'initial', 'default']);
XElement.__serializableTypes = new Set([Boolean, String, Number]);
XElement.__caseMap = new Map();

const X_ELEMENT_INTERFACE = new Set(Object.getOwnPropertyNames(XElement.prototype));
const INHERITED_INTERFACE = new Set();
let prototype = HTMLElement.prototype;
while (prototype) {
  Object.getOwnPropertyNames(prototype).forEach(name => INHERITED_INTERFACE.add(name));
  prototype = Object.getPrototypeOf(prototype);
}
