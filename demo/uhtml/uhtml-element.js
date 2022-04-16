import BaseElement from './base-element.js';

export default class UhtmlElement extends BaseElement {
  static get properties() {
    return {
      message: {
        type: String,
      },
    };
  }

  // What's injected into the "template" function is defined in "BaseElement".
  static template(html) {
    return ({ message }) => {
      return html`
        <style>
          #container[message]::after {
            content: attr(message);
          }
        </style>
        <div id="container" message="${message}">Rendered using <code>µhtml</code>.</div>
      `;
    };
  }
}

customElements.define('uhtml-element', UhtmlElement);
