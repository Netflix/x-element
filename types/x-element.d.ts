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
    static "__#private@#analyzeConstructor"(constructor: any): void;
    static "__#private@#validateProperties"(constructor: any, properties: any, entries: any): void;
    static "__#private@#validateProperty"(constructor: any, key: any, property: any): void;
    static "__#private@#validatePropertyAttribute"(constructor: any, key: any, property: any, attribute: any): void;
    static "__#private@#propertyIsCyclic"(property: any, inputMap: any, seen?: Set<any>): boolean;
    static "__#private@#validateListeners"(constructor: any, listeners: any, entries: any): void;
    static "__#private@#mutateProperty"(constructor: any, propertyMap: any, key: any, property: any): void;
    static "__#private@#addPropertyInitial"(constructor: any, property: any): void;
    static "__#private@#addPropertyDefault"(constructor: any, property: any): void;
    static "__#private@#addPropertySync"(constructor: any, property: any): void;
    static "__#private@#addPropertyReflect"(constructor: any, property: any): void;
    static "__#private@#addPropertyCompute"(constructor: any, property: any): void;
    static "__#private@#addPropertyObserve"(constructor: any, property: any): void;
    static "__#private@#constructHost"(host: any): void;
    static "__#private@#defineProperty"(host: any, property: any, hostInfo: any): void;
    static "__#private@#createInternal"(host: any): any;
    static "__#private@#createProperties"(host: any): any;
    static "__#private@#connectHost"(host: any): void;
    static "__#private@#disconnectHost"(host: any): void;
    static "__#private@#initializeHost"(host: any): boolean;
    static "__#private@#upgradeOwnProperties"(host: any): void;
    static "__#private@#getPreUpgradePropertyValue"(host: any, property: any, hostInfo: any): {
        value: any;
        found: boolean;
    };
    static "__#private@#addListener"(host: any, element: any, type: any, callback: any, options: any): void;
    static "__#private@#addListeners"(host: any): void;
    static "__#private@#removeListener"(host: any, element: any, type: any, callback: any, options: any): void;
    static "__#private@#removeListeners"(host: any): void;
    static "__#private@#getListener"(host: any, listener: any): any;
    static "__#private@#updateHost"(host: any): void;
    static "__#private@#toPathString"(host: any): string;
    static "__#private@#invalidateProperty"(host: any, property: any): void;
    static "__#private@#getPropertyValue"(host: any, property: any): any;
    static "__#private@#validatePropertyMutable"(host: any, property: any): void;
    static "__#private@#validatePropertyValue"(host: any, property: any, value: any): void;
    static "__#private@#setPropertyValue"(host: any, property: any, value: any): void;
    static "__#private@#serializeProperty"(host: any, property: any, value: any): any;
    static "__#private@#deserializeProperty"(host: any, property: any, value: any): any;
    static "__#private@#propertyHasAttribute"(property: any): boolean;
    static "__#private@#getTypeName"(value: any): any;
    static "__#private@#notNullish"(value: any): boolean;
    static "__#private@#typeIsWrong"(type: any, value: any): boolean;
    static "__#private@#camelToKebab"(camel: any): any;
    static "__#private@#constructors": WeakMap<WeakKey, any>;
    static "__#private@#hosts": WeakMap<WeakKey, any>;
    static "__#private@#propertyKeys": Set<string>;
    static "__#private@#serializableTypes": Set<StringConstructor | BooleanConstructor | NumberConstructor>;
    static "__#private@#caseMap": Map<any, any>;
    static "__#private@#prototypeInterface": Set<string>;
    /**
     * Extends HTMLElement.prototype.connectedCallback.
     */
    connectedCallback(): void;
    /**
     * Extends HTMLElement.prototype.connectedMoveCallback.
     */
    connectedMoveCallback(): void;
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