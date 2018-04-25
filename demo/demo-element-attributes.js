import XElementProperties from '../x-element-properties.js';

class DemoAttributesElement extends XElementProperties {
  static template() {
    return ({ hyphenatedValue }) => `
      <style>
        :host {
          display: block;
          width: 200px;
        }

        :host([hyphenated-value]) {
          background-color: magenta;
        }

        :host([boolean-value]) {
          font-weight: bold;
        }
      </style>
      <div id="demo">${hyphenatedValue}</div>
    `;
  }

  static get properties() {
    return {
      hyphenatedValue: {
        type: String,
      },
      booleanValue: {
        type: Boolean,
      },
    };
  }
}

customElements.define('demo-element-attributes', DemoAttributesElement);
