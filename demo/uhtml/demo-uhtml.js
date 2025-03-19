import BaseElement from './base-element.js';
import styleSheet from './demo-uhtml.css' with { type: 'css' };

export default class DemoUhtml extends BaseElement {
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
  static template(html) {
    return ({ emoji, message }) => {
      return html`
        <div id="container" emoji="${emoji}">Rendered &ldquo;${message}&rdquo; using <code>µhtml</code>.</div>
      `;
    };
  }
}

customElements.define('demo-uhtml', DemoUhtml);
