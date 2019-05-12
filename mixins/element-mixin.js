/**
 * Provides base functionality.
 */
// TODO: come closer to parity with LitElement.
//  * consider mimicking createRenderRoot (instead of shadowRootInit) which
//    returns a root instance.
const analyzedSet = new Set();
const initializedSet = new WeakSet();
const dirtySet = new WeakSet();

export default superclass =>
  class extends superclass {
    constructor() {
      super();
      const ctor = this.constructor;
      if (ctor.analyzed === false) {
        ctor.analyze();
        analyzedSet.add(ctor);
      }
    }
    connectedCallback() {
      if (this.constructor.isTargetInitialized(this) === false) {
        this.constructor.initialize(this);
        initializedSet.add(this);
      }
    }

    disconnectedCallback() {}

    attributeChangedCallback() {}

    adoptedCallback() {}

    static get shadowRootInit() {
      return { mode: 'open' };
    }

    static get analyzed() {
      return analyzedSet.has(this);
    }

    static isTargetInitialized(target) {
      return initializedSet.has(target);
    }

    static analyze() {
      // Hook for subclasses.
    }

    static beforeInitialRender(target) {
      // Hook for subclasses.
    }

    static afterInitialRender(target) {
      // Hook for subclasses.
    }

    static initialize(target) {
      this.upgradeOwnProperties(target);
      target.attachShadow(this.shadowRootInit);
      this.beforeInitialRender(target);
      // cause the template to perform an initial synchronous render
      target.render();
      this.afterInitialRender(target);
    }

    render() {
      const proxy = this.constructor.renderProxy(this);
      this.shadowRoot.innerHTML = this.constructor.template()(proxy, this);
      dirtySet.delete(this);
    }

    /**
     * Used to flag element for async template render. This prevents the
     * template from rendering more than once for multiple synchronous property
     * changes. All the changes will be batched in a single render.
     */
    async invalidate() {
      if (dirtySet.has(this) === false) {
        dirtySet.add(this);
        // schedule microtask, which runs before requestAnimationFrame
        // https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
        if ((await true) && dirtySet.has(this)) {
          // This guard checks if a synchronous render happened while awaiting.
          this.render();
          dirtySet.delete(this);
        }
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

    /**
     * Prevent shadowing from properties added to element instance pre-upgrade.
     * @see https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
     */
    static upgradeOwnProperties(target) {
      for (const key of Reflect.ownKeys(target)) {
        const value = Reflect.get(target, key);
        Reflect.deleteProperty(target, key);
        Reflect.set(target, key, value);
      }
    }
  };
