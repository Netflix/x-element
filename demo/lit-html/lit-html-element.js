import BaseElement from './base-element.js';

export default class LitHtmlElement extends BaseElement {
  static get properties() {
    return {
      message: {
        type: String,
      },
    };
  }

  // What's injected into the "template" function is defined in "BaseElement".
  static template(html, { ifDefined }) {
    return ({ message }) => {
      return html`
        <style>
          #container[message]::after {
            content: attr(message);
          }
        </style>
        <div id="container" message="${ifDefined(message)}">Rendered using <code>lit-html</code>.</div>
      `;
    };
  }
}

customElements.define('lit-html-element', LitHtmlElement);
