/** Base element class for creating custom elements. */
export class XElement extends HTMLElement {
    /**
     * Extends HTMLElement.observedAttributes to handle decorated properties.
     * @returns {string[]}
     */
    static get observedAttributes(): string[];
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
    static get styles(): CSSStyleSheet[];
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
    static property(configuration: {
        type?: (new (...args: unknown[]) => unknown) | undefined;
        attribute?: string;
        input?: string[];
        compute?: (...args: unknown[]) => unknown;
        observe?: (host: HTMLElement, value: unknown, oldValue: unknown) => void;
        reflect?: boolean;
        initial?: unknown | (() => unknown);
        default?: unknown | (() => unknown);
    }): (target: unknown, context: object) => object;
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
    static listener(type: string, options?: AddEventListenerOptions): (method: unknown, context: object) => void;
    /**
     * Customize shadow root initialization and optionally forgo encapsulation.
     * E.g., setup focus delegation or return host instead of host.shadowRoot.
     * @param {HTMLElement} host
     * @returns {HTMLElement|ShadowRoot}
     */
    static createRenderRoot(host: HTMLElement): HTMLElement | ShadowRoot;
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
    static template(host: HTMLElement): unknown;
    static "__#private@#analyzeDecorators"(constructor: any): {
        properties: any;
        listeners: any;
        propertyNameToKey: any;
    };
    static "__#private@#analyzeListeners"(constructor: any, listeners: any): void;
    static "__#private@#analyzeProperties"(constructor: any, properties: any): Map<any, any>;
    static "__#private@#analyzeConstructor"(constructor: any): void;
    static "__#private@#validatePropertyConfiguration"(constructor: any, key: any, property: any): void;
    static "__#private@#propertyIsCyclic"(property: any, seen?: Set<any>): boolean;
    static "__#private@#addPropertyInitial"(constructor: any, property: any): void;
    static "__#private@#addPropertyDefault"(constructor: any, property: any): void;
    static "__#private@#addPropertySync"(constructor: any, property: any): void;
    static "__#private@#addPropertyReflect"(constructor: any, property: any): void;
    static "__#private@#addPropertyCompute"(constructor: any, property: any): void;
    static "__#private@#addPropertyObserve"(constructor: any, property: any): void;
    static "__#private@#constructHost"(host: any): void;
    static "__#private@#connectHost"(host: any): void;
    static "__#private@#disconnectHost"(host: any): void;
    static "__#private@#initializeHost"(host: any): boolean;
    static "__#private@#upgradeOwnProperties"(host: any): void;
    static "__#private@#getPreInitializedPropertyValue"(host: any, property: any): {
        value: any;
        found: boolean;
    };
    static "__#private@#addListener"(host: any, element: any, type: any, callback: any, options: any): void;
    static "__#private@#addListeners"(host: any): void;
    static "__#private@#removeListener"(host: any, element: any, type: any, callback: any, options: any): void;
    static "__#private@#removeListeners"(host: any): void;
    static "__#private@#getListener"(host: any, listenerMethod: any): any;
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
    static "__#private@#mintMetadataInfo"(): {
        properties: Map<any, any>;
        listeners: Map<any, any>;
        propertyNameToKey: Map<any, any>;
    };
    static "__#private@#info": symbol;
    static "__#private@#propertyConfigurationKeys": Set<string>;
    static "__#private@#serializableTypes": Set<StringConstructor | BooleanConstructor | NumberConstructor>;
    static "__#private@#caseMap": Map<any, any>;
    static "__#private@#prototypeInterface": Set<string>;
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
     * Wrapper around HTMLElement.addEventListener.
     * Advanced — use this only if declaring listeners statically is not possible.
     * @param {EventTarget} element
     * @param {string} type
     * @param {(event: Event) => void} callback
     * @param {AddEventListenerOptions} [options]
     */
    listen(element: EventTarget, type: string, callback: (event: Event) => void, options?: AddEventListenerOptions): void;
    /**
     * Wrapper around HTMLElement.removeEventListener. Inverse of "listen".
     * @param {EventTarget} element
     * @param {string} type
     * @param {(event: Event) => void} callback
     * @param {AddEventListenerOptions} [options]
     */
    unlisten(element: EventTarget, type: string, callback: (event: Event) => void, options?: AddEventListenerOptions): void;
    /**
     * Helper method to dispatch an "ErrorEvent" on the element.
     * @param {Error} error
     */
    dispatchError(error: Error): void;
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
export function property(configuration: {
    type?: (new (...args: unknown[]) => unknown) | undefined;
    attribute?: string;
    input?: string[];
    compute?: (...args: unknown[]) => unknown;
    observe?: (host: HTMLElement, value: unknown, oldValue: unknown) => void;
    reflect?: boolean;
    initial?: unknown | (() => unknown);
    default?: unknown | (() => unknown);
}): (target: unknown, context: object) => object;
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
export function listener(type: string, options?: AddEventListenerOptions): (method: unknown, context: object) => void;
import { html } from './x-template.js';
export { html };
//# sourceMappingURL=x-element-next.d.ts.map