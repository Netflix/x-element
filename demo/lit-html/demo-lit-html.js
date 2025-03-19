import BaseElement from './base-element.js';
import styleSheet from './demo-lit-html.css' with { type: 'css' };

export default class DemoLitHtml extends BaseElement {
  static get styles() {
    return [styleSheet];
  }

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
        <div id="container" emoji="${ifDefined(emoji)}">Rendered &ldquo;${message}&rdquo; using <code>lit-html</code>.</div>
      `;
    };
  }
}

customElements.define('demo-lit-html', DemoLitHtml);
