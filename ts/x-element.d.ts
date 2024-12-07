/** Base element class for creating custom elements. */
export default class XElement extends HTMLElement {
    /**
     * Extends HTMLElement.observedAttributes to handle the properties block.
     * @returns {string[]}
     */
    static get observedAttributes(): string[];
    /**
     * Default templating engine. Use "templateEngine" to override.
     * @returns {{[key: string]: Function}}
     */
    static get defaultTemplateEngine(): {
        [key: string]: Function;
    };
    /**
     * Configured templating engine. Defaults to "defaultTemplateEngine".
     * Override this as needed if x-element's default template engine does not
     * meet your needs. A "render" method is the only required field. An "html"
     * tagged template literal is expected, but not strictly required.
     * @returns {{[key: string]: Function}}
     */
    static get templateEngine(): {
        [key: string]: Function;
    };
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
    static get properties(): {
        [key: string]: {
            type?: any;
            attribute?: string;
            input?: string[];
            compute?: Function;
            observe?: (host: HTMLElement, value: any, oldValue: any) => any;
            reflect?: boolean;
            internal?: boolean;
            readOnly?: boolean;
            initial?: any | Function;
            default?: any | Function;
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
    static template(html: Function, engine: {
        [key: string]: Function;
    }): (properties: object, host: HTMLElement) => any;
    static "__#3@#analyzeConstructor"(constructor: any): void;
    static "__#3@#validateProperties"(constructor: any, properties: any, entries: any): void;
    static "__#3@#validateProperty"(constructor: any, key: any, property: any): void;
    static "__#3@#validatePropertyAttribute"(constructor: any, key: any, property: any, attribute: any): void;
    static "__#3@#propertyIsCyclic"(property: any, inputMap: any, seen?: Set<any>): boolean;
    static "__#3@#validateListeners"(constructor: any, listeners: any, entries: any): void;
    static "__#3@#mutateProperty"(constructor: any, propertyMap: any, key: any, property: any): void;
    static "__#3@#addPropertyInitial"(constructor: any, property: any): void;
    static "__#3@#addPropertyDefault"(constructor: any, property: any): void;
    static "__#3@#addPropertySync"(constructor: any, property: any): void;
    static "__#3@#addPropertyReflect"(constructor: any, property: any): void;
    static "__#3@#addPropertyCompute"(constructor: any, property: any): void;
    static "__#3@#addPropertyObserve"(constructor: any, property: any): void;
    static "__#3@#constructHost"(host: any): void;
    static "__#3@#createInternal"(host: any): any;
    static "__#3@#createProperties"(host: any): any;
    static "__#3@#connectHost"(host: any): void;
    static "__#3@#disconnectHost"(host: any): void;
    static "__#3@#initializeHost"(host: any): boolean;
    static "__#3@#upgradeOwnProperties"(host: any): void;
    static "__#3@#getPreUpgradePropertyValue"(host: any, property: any): {
        value: any;
        found: boolean;
    };
    static "__#3@#initializeProperty"(host: any, property: any): void;
    static "__#3@#addListener"(host: any, element: any, type: any, callback: any, options: any): void;
    static "__#3@#addListeners"(host: any): void;
    static "__#3@#removeListener"(host: any, element: any, type: any, callback: any, options: any): void;
    static "__#3@#removeListeners"(host: any): void;
    static "__#3@#getListener"(host: any, listener: any): any;
    static "__#3@#updateHost"(host: any): void;
    static "__#3@#toPathString"(host: any): string;
    static "__#3@#invalidateProperty"(host: any, property: any): Promise<void>;
    static "__#3@#getPropertyValue"(host: any, property: any): any;
    static "__#3@#validatePropertyValue"(host: any, property: any, value: any): void;
    static "__#3@#setPropertyValue"(host: any, property: any, value: any): void;
    static "__#3@#serializeProperty"(host: any, property: any, value: any): any;
    static "__#3@#deserializeProperty"(host: any, property: any, value: any): any;
    static "__#3@#propertyHasAttribute"(property: any): boolean;
    static "__#3@#getTypeName"(value: any): any;
    static "__#3@#notNullish"(value: any): boolean;
    static "__#3@#typeIsWrong"(type: any, value: any): boolean;
    static "__#3@#camelToKebab"(camel: any): any;
    static "__#3@#constructors": WeakMap<WeakKey, any>;
    static "__#3@#hosts": WeakMap<WeakKey, any>;
    static "__#3@#propertyKeys": Set<string>;
    static "__#3@#serializableTypes": Set<StringConstructor | BooleanConstructor | NumberConstructor>;
    static "__#3@#caseMap": Map<any, any>;
    static "__#3@#prototypeInterface": Set<string>;
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