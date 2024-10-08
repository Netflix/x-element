export class XElement extends HTMLElement {
  readonly properties: {
    [property: string]: {
      type: any,
      attribute: string,
      input: string[],
      compute: (...any) => any,
      observe: (host: XElement, value: any, oldValue: any) => void,
      reflect: boolean,
      internal: boolean,
      readOnly: boolean,
      initial: any,
      default: any,
    }
  };
  readonly listeners: {
    [type: string]: (
      this: typeof XElement,
      host: XElement,
      event: Event
    ) => any
  };
  readonly internal: object;
  render(): void;
  listen(
    element: EventTarget,
    type: string,
    callback: (this: typeof XElement, host: XElement, event: Event) => any,
    options: AddEventListenerOptions
  ): void;
  unlisten(
    element: EventTarget,
    type: string,
    callback: (this: typeof XElement, host: XElement, event: Event) => any,
    options: AddEventListenerOptions
  ): void;
  dispatchError(error: Error): void;

  static readonly defaultTemplateEngine: {
    render: (container: HTMLElement, result: any) => void,
    html: (strings: TemplateStringsArray, ...any) => any,
    svg: (strings: TemplateStringsArray, ...any) => any,
    map: (
      items: any[],
      identify: (item: any, index: number) => string,
      callback: (item: any, index: number) => any
    ) => any,
    nullish: (value: any) => any,

    live: (value: any) => any,
    unsafeHTML: (value: any) => any,
    unsafeSVG: (value: any) => any,
    ifDefined: (value: any) => any,
    repeat: (
      items: any[],
      identify: (item: any, index: number) => any,
      callback?: (item: any, index: number) => any
    ) => any,
  };
  static readonly templateEngine: {
    render: (container: HTMLElement, result: any) => void,
    html: (strings: TemplateStringsArray, ...any) => any,
  }
  static readonly styles: [CSSStyleSheet]
  static createRenderRoot(host: XElement): HTMLElement;
  static template(
    html: (strings: TemplateStringsArray, ...any) => any,
    object
  ): (properties: object, host: XElement) => any;
}
