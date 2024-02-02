import BaseElement from './base-element.js';

export default class DemoLitHtml extends BaseElement {
  static get properties() {
    return {
      emoji: {
        type: String,
      },
      message: {
        type: String,
      },
    };
  }

  // What's injected into the "template" function is defined in "BaseElement".
  static template(html, { ifDefined }) {
    return ({ emoji, message }) => {
      return html`
        <style>
          #container[emoji]::before {
            content: " " attr(emoji);
            font-size: 2rem;
          }
        </style>
        <div id="container" emoji="${ifDefined(emoji)}">Rendered &ldquo;${message}&rdquo; using <code>lit-html</code>.</div>
      `;
    };
  }
}

customElements.define('demo-lit-html', DemoLitHtml);
