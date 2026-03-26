/** Base element class for creating custom elements. */
export default class XElement extends HTMLElement {
    /**
     * Extends HTMLElement.observedAttributes to handle the properties block.
     * @returns {string[]}
     */
    static get observedAttributes(): string[];
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
    static get styles(): CSSStyleSheet[];
    /**
     * Observe callback.
     * @callback observeCallback
     * @param {HTMLElement} host
     * @param {unknown} value
     * @param {unknown} oldValue
     */
    /**
     * A property value.
     * @typedef {object} Property
     * @property {(new (...args: unknown[]) => unknown) | undefined} [type]
     * @property {string} [attribute]
     * @property {string[]} [input]
     * @property {(...args: unknown[]) => unknown} [compute]
     * @property {observeCallback} [observe]
     * @property {boolean} [reflect]
     * @property {boolean} [internal]
     * @property {boolean} [readOnly]
     * @property {unknown | (() => unknown)} [initial]
     * @property {unknown | (() => unknown)} [default]
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
    static get properties(): {
        [key: string]: {
            type?: (new (...args: unknown[]) => unknown) | undefined;
            attribute?: string | undefined;
            input?: string[] | undefined;
            compute?: ((...args: unknown[]) => unknown) | undefined;
            observe?: ((host: HTMLElement, value: unknown, oldValue: unknown) => any) | undefined;
            reflect?: boolean | undefined;
            internal?: boolean | undefined;
            readOnly?: boolean | undefined;
            initial?: unknown | (() => unknown);
            default?: unknown | (() => unknown);
        };
    };
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
    static get listeners(): {
        [key: string]: (host: HTMLElement, event: Event) => any;
    };
    /**
     * Customize shadow root initialization and optionally forgo encapsulation.
     * E.g., setup focus delegation or return host instead of host.shadowRoot.
     * @param {HTMLElement} host
     * @returns {HTMLElement|ShadowRoot}
     */
    static createRenderRoot(host: HTMLElement): HTMLElement | ShadowRoot;
    /**
     * Template callback.
     * @callback templateCallback
     * @param {object} properties
     * @param {HTMLElement} host
     */
    /**
     * Setup template callback to update DOM when properties change.
     * ```js
     * static template(html) {
     *   return ({ href }) => {
     *     return html`<a href="${href}">click me</a>`;
     *   }
     * }
     * ```
     * @param {(strings: TemplateStringsArray, ...values: unknown[]) => unknown} html
     * @returns {templateCallback}
     */
    static template(html: (strings: TemplateStringsArray, ...values: unknown[]) => unknown): (properties: object, host: HTMLElement) => any;
    /**
     * Called once per class — kicked off from "static get observedAttributes".
     * @param {any} constructor
     */
    static #analyzeConstructor(constructor: any): void;
    /**
     * Called during constructor analysis.
     * @param {any} constructor
     * @param {any} properties
     * @param {any} entries
     */
    static #validateProperties(constructor: any, properties: any, entries: any): void;
    /**
     * @param {any} constructor
     * @param {string} key
     * @param {any} property
     */
    static #validateProperty(constructor: any, key: string, property: any): void;
    /**
     * @param {any} constructor
     * @param {string} key
     * @param {any} property
     * @param {string} attribute
     */
    static #validatePropertyAttribute(constructor: any, key: string, property: any, attribute: string): void;
    /**
     * Determines if computed property inputs form a cycle.
     * @param {any} property
     * @param {any} inputMap
     * @param {Set<any>} [seen]
     * @returns {boolean | undefined}
     */
    static #propertyIsCyclic(property: any, inputMap: any, seen?: Set<any>): boolean | undefined;
    /**
     * @param {any} constructor
     * @param {any} listeners
     * @param {any} entries
     */
    static #validateListeners(constructor: any, listeners: any, entries: any): void;
    /**
     * Called once per-property during constructor analysis.
     * @param {any} constructor
     * @param {any} propertyMap
     * @param {string} key
     * @param {any} property
     */
    static #mutateProperty(constructor: any, propertyMap: any, key: string, property: any): void;
    /**
     * Wrapper to improve ergonomics of coalescing nullish, initial value.
     * @param {any} constructor
     * @param {any} property
     */
    static #addPropertyInitial(constructor: any, property: any): void;
    /**
     * Wrapper to improve ergonomics of coalescing nullish, default value.
     * @param {any} constructor
     * @param {any} property
     */
    static #addPropertyDefault(constructor: any, property: any): void;
    /**
     * Wrapper to improve ergonomics of syncing attributes back to properties.
     * @param {any} constructor
     * @param {any} property
     */
    static #addPropertySync(constructor: any, property: any): void;
    /**
     * Wrapper to centralize logic needed to perform reflection.
     * @param {any} constructor
     * @param {any} property
     */
    static #addPropertyReflect(constructor: any, property: any): void;
    /**
     * Wrapper to prevent repeated compute callbacks.
     * @param {any} constructor
     * @param {any} property
     */
    static #addPropertyCompute(constructor: any, property: any): void;
    /**
     * Wrapper to provide last value to observe callbacks.
     * @param {any} constructor
     * @param {any} property
     */
    static #addPropertyObserve(constructor: any, property: any): void;
    /**
     * Called once per-host during construction.
     * @param {any} host
     */
    static #constructHost(host: any): void;
    /**
     * Called during host construction.
     * @param {any} host
     * @param {any} property
     * @param {any} hostInfo
     */
    static #defineProperty(host: any, property: any, hostInfo: any): void;
    /**
     * Called during host construction.
     * @param {any} host
     * @returns {any}
     */
    static #createInternal(host: any): any;
    /**
     * Only available in template callback. Provides getter for all properties.
     * Called during host construction.
     * @param {any} host
     * @returns {any}
     */
    static #createProperties(host: any): any;
    /**
     * Called once per-host from initial "connectedCallback".
     * @param {any} host
     */
    static #connectHost(host: any): void;
    /** @param {any} host */
    static #disconnectHost(host: any): void;
    /**
     * @param {any} host
     * @returns {boolean}
     */
    static #initializeHost(host: any): boolean;
    /**
     * Prevent shadowing from properties added to element instance pre-upgrade.
     * @param {any} host
     */
    static #upgradeOwnProperties(host: any): void;
    /**
     * Called during host initialization.
     * @param {any} host
     * @param {any} property
     * @param {any} hostInfo
     * @returns {{ value: any, found: boolean }}
     */
    static #getPreUpgradePropertyValue(host: any, property: any, hostInfo: any): {
        value: any;
        found: boolean;
    };
    /**
     * @param {any} host
     * @param {any} element
     * @param {any} type
     * @param {any} callback
     * @param {any} [options]
     */
    static #addListener(host: any, element: any, type: any, callback: any, options?: any): void;
    /** @param {any} host */
    static #addListeners(host: any): void;
    /**
     * @param {any} host
     * @param {any} element
     * @param {any} type
     * @param {any} callback
     * @param {any} [options]
     */
    static #removeListener(host: any, element: any, type: any, callback: any, options?: any): void;
    /** @param {any} host */
    static #removeListeners(host: any): void;
    /**
     * @param {any} host
     * @param {any} listener
     * @returns {any}
     */
    static #getListener(host: any, listener: any): any;
    /** @param {any} host */
    static #updateHost(host: any): void;
    /**
     * Used to improve error messaging by appending DOM path information.
     * @param {any} host
     * @returns {string}
     */
    static #toPathString(host: any): string;
    /**
     * @param {any} host
     * @param {any} property
     */
    static #invalidateProperty(host: any, property: any): void;
    /**
     * @param {any} host
     * @param {any} property
     * @returns {any}
     */
    static #getPropertyValue(host: any, property: any): any;
    /**
     * @param {any} host
     * @param {any} property
     */
    static #validatePropertyMutable(host: any, property: any): void;
    /**
     * @param {any} host
     * @param {any} property
     * @param {any} value
     */
    static #validatePropertyValue(host: any, property: any, value: any): void;
    /**
     * @param {any} host
     * @param {any} property
     * @param {any} value
     */
    static #setPropertyValue(host: any, property: any, value: any): void;
    /**
     * @param {any} host
     * @param {any} property
     * @param {any} value
     * @returns {string | undefined}
     */
    static #serializeProperty(host: any, property: any, value: any): string | undefined;
    /**
     * @param {any} host
     * @param {any} property
     * @param {any} value
     * @returns {any}
     */
    static #deserializeProperty(host: any, property: any, value: any): any;
    /**
     * Public properties which are serializable or typeless have attributes.
     * @param {any} property
     * @returns {boolean}
     */
    static #propertyHasAttribute(property: any): boolean;
    /**
     * @param {unknown} value
     * @returns {string}
     */
    static #getTypeName(value: unknown): string;
    /**
     * @param {unknown} value
     * @returns {boolean}
     */
    static #notNullish(value: unknown): boolean;
    /**
     * @param {any} type
     * @param {unknown} value
     * @returns {boolean}
     */
    static #typeIsWrong(type: any, value: unknown): boolean;
    /**
     * @param {string} camel
     * @returns {string | undefined}
     */
    static #camelToKebab(camel: string): string | undefined;
    static #constructors: WeakMap<WeakKey, any>;
    static #hosts: WeakMap<WeakKey, any>;
    static #propertyKeys: Set<string>;
    static #serializableTypes: Set<StringConstructor | BooleanConstructor | NumberConstructor>;
    static #caseMap: Map<any, any>;
    static #prototypeInterface: Set<string>;
    /**
     * Extends HTMLElement.prototype.connectedCallback.
     */
    connectedCallback(): void;
    /**
     * Extends HTMLElement.prototype.attributeChangedCallback.
     * @param {string} attribute
     * @param {string|null} oldValue
     * @param {string|null} value
     */
    attributeChangedCallback(attribute: string, oldValue: string | null, value: string | null): void;
    /**
     * Extends HTMLElement.prototype.adoptedCallback.
     */
    adoptedCallback(): void;
    /**
     * Extends HTMLElement.prototype.disconnectedCallback.
     */
    disconnectedCallback(): void;
    /**
     * Uses the result of your template callback to update your render root.
     *
     * This is called when properties update, but is exposed for advanced use cases.
     */
    render(): void;
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
    listen(element: EventTarget, type: string, callback: (event: Event) => any, options?: object): void;
    /**
     * Wrapper around HTMLElement.removeEventListener. Inverse of "listen".
     * @param {EventTarget} element
     * @param {string} type
     * @param {listenCallback} callback
     * @param {object} [options]
     */
    unlisten(element: EventTarget, type: string, callback: (event: Event) => any, options?: object): void;
    /**
     * Helper method to dispatch an "ErrorEvent" on the element.
     * @param {Error} error
     */
    dispatchError(error: Error): void;
    /**
     * For element authors. Getter and setter for internal properties.
     * Note that you can set read-only properties from host.internal. However, you
     * must get read-only properties directly from the host.
     * @returns {object}
     */
    get internal(): object;
}
//# sourceMappingURL=x-element.d.ts.map