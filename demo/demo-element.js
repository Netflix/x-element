import XElementBasic from '../x-element-basic.js';

class DemoElement extends XElementBasic {
  static template() {
    return ({ reflected }) => `
      <style>
        :host {
          display: block;
          width: 200px;
        }

        :host([reflected]) {
          background-color: yellow;
        }

        :host([boolean-value]) {
          font-weight: bold;
        }
      </style>
      <div id="demo">${reflected}</div>
    `;
  }

  static get observedAttributes() {
    return ['reflected', 'booleanValue'];
  }

  set reflected(value) {
    if (value) {
      this.setAttribute('reflected', value);
    } else {
      this.removeAttribute('reflected');
    }
  }

  get reflected() {
    return this.getAttribute('reflected');
  }

  set booleanValue(value) {
    if (Boolean(value)) {
      this.setAttribute('boolean-value', '');
    } else {
      this.removeAttribute('boolean-value');
    }
  }

  get booleanValue() {
    return this.getAttribute('boolean-value');
  }

  connectedCallback() {
    super.connectedCallback();
    this.booleanValue = true;
  }
}

customElements.define('demo-element', DemoElement);
