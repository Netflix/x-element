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
            attribute?: string;
            input?: string[];
            compute?: (...args: unknown[]) => unknown;
            observe?: (host: HTMLElement, value: unknown, oldValue: unknown) => any;
            reflect?: boolean;
            internal?: boolean;
            readOnly?: boolean;
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
    static #analyzeConstructor(constructor: any): void;
    static #validateProperties(constructor: any, properties: any, entries: any): void;
    static #validateProperty(constructor: any, key: any, property: any): void;
    static #validatePropertyAttribute(constructor: any, key: any, property: any, attribute: any): void;
    static #propertyIsCyclic(property: any, inputMap: any, seen?: Set<any>): boolean;
    static #validateListeners(constructor: any, listeners: any, entries: any): void;
    static #mutateProperty(constructor: any, propertyMap: any, key: any, property: any): void;
    static #addPropertyInitial(constructor: any, property: any): void;
    static #addPropertyDefault(constructor: any, property: any): void;
    static #addPropertySync(constructor: any, property: any): void;
    static #addPropertyReflect(constructor: any, property: any): void;
    static #addPropertyCompute(constructor: any, property: any): void;
    static #addPropertyObserve(constructor: any, property: any): void;
    static #constructHost(host: any): void;
    static #defineProperty(host: any, property: any, hostInfo: any): void;
    static #createInternal(host: any): any;
    static #createProperties(host: any): any;
    static #connectHost(host: any): void;
    static #disconnectHost(host: any): void;
    static #initializeHost(host: any): boolean;
    static #upgradeOwnProperties(host: any): void;
    static #getPreUpgradePropertyValue(host: any, property: any, hostInfo: any): {
        value: any;
        found: boolean;
    };
    static #addListener(host: any, element: any, type: any, callback: any, options: any): void;
    static #addListeners(host: any): void;
    static #removeListener(host: any, element: any, type: any, callback: any, options: any): void;
    static #removeListeners(host: any): void;
    static #getListener(host: any, listener: any): any;
    static #updateHost(host: any): void;
    static #toPathString(host: any): string;
    static #invalidateProperty(host: any, property: any): void;
    static #getPropertyValue(host: any, property: any): any;
    static #validatePropertyMutable(host: any, property: any): void;
    static #validatePropertyValue(host: any, property: any, value: any): void;
    static #setPropertyValue(host: any, property: any, value: any): void;
    static #serializeProperty(host: any, property: any, value: any): any;
    static #deserializeProperty(host: any, property: any, value: any): any;
    static #propertyHasAttribute(property: any): boolean;
    static #getTypeName(value: any): string;
    static #notNullish(value: any): boolean;
    static #typeIsWrong(type: any, value: any): boolean;
    static #camelToKebab(camel: any): any;
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