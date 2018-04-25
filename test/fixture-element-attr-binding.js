import XElementProperties from '../x-element-properties.js';

class TestElement extends XElementProperties {
  static template() {
    return ({
      camelCaseProperty: ccp,
      numericProperty: num,
      nullProperty: nul,
    }) => `
      <div id="container">
        <span id="camel">${ccp}</span>
        <span id="num">${num}</span>
        <span id="nul">${nul}</span>
      </div>
    `;
  }

  static get properties() {
    return {
      camelCaseProperty: {
        type: String,
        value: 'Bactrian',
      },
      numericProperty: {
        type: Number,
        value: 10,
      },
      nullProperty: {
        type: String,
        value: null,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define('test-element-attr-binding', TestElement);
