import BaseElement from './base-element.js';

export default class DemoUhtml extends BaseElement {
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
        <style>
          #container[emoji]::before {
            content: " " attr(emoji);
            font-size: 2rem;
          }
        </style>
        <div id="container" emoji="${emoji}">Rendered &ldquo;${message}&rdquo; using <code>µhtml</code>.</div>
      `;
    };
  }
}

customElements.define('demo-uhtml', DemoUhtml);
