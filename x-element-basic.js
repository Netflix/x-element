/**
 * Implements a naive template rendering system and a few helpers.
 */

export default class AbstractBasicElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // cause the template to perform an initial synchronous render
    this.render();
  }

  connectedCallback() {
    this.constructor.upgradeObservedAttributes(this);
  }

  disconnectedCallback() {}

  attributeChangedCallback() {}

  adoptedCallback() {}

  render() {
    const proxy = this.constructor.renderProxy(this);
    this.shadowRoot.innerHTML = this.constructor.template()(proxy, this);
  }

  /**
   * Used to flag element for async template render. This prevents the template
   * from rendering more than once for multiple synchronous property changes.
   * All the changes will be batched in a single render.
   */
  async invalidate() {
    const symbol = Symbol.for('__dirty__');
    if (!this[symbol]) {
      this[symbol] = true;
      // schedule microtask, which runs before requestAnimationFrame
      // https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
      this[symbol] = await false;
      this.render();
    }
  }

  listen(el, type, cb, ...args) {
    if (el instanceof EventTarget && type && cb instanceof Function) {
      const bound = this[cb.name].bind(this);
      el.addEventListener(type, bound, ...args);
      // save reference to instance bound function
      this[Symbol.for(cb.name)] = bound;
      return true;
    }
    return false;
  }

  unlisten(el, type, cb, ...args) {
    const bound = this[Symbol.for(cb.name)];
    if (bound) {
      el.removeEventListener(type, bound, ...args);
      return true;
    }
    return false;
  }

  dispatchError(err) {
    const evt = new ErrorEvent('error', {
      error: err,
      message: err.message,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  static renderProxy(target) {
    const handler = {
      get(host, key) {
        // avoid rendering "null" and "undefined" strings in template,
        // treat as empty instead
        const value = host[key];
        return value === undefined || Object.is(value, null) ? '' : value;
      },
    };
    return new Proxy(target, handler);
  }

  static template() {
    return () => ``;
  }

  static upgradeObservedAttributes(target) {
    const attrs = this.observedAttributes;
    if (Array.isArray(attrs)) {
      attrs.forEach(attr => this.upgradeProperty(target, attr));
    }
  }

  /**
   * @see https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   */
  static upgradeProperty(target, prop) {
    if (target.hasOwnProperty(prop)) {
      const value = target[prop];
      // delete property so it does not shadow the element post-upgrade
      // noop if the property is not configurable (e.g. already has accessors)
      Reflect.deleteProperty(target, prop);
      target[prop] = value;
    }
  }
}
