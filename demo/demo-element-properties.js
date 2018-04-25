import XElementProperties from '../x-element-properties.js';

class DemoPropertiesElement extends XElementProperties {
  static template() {
    return ({ reflected }) => `
      <style>
        :host {
          display: block;
          width: 200px;
        }

        :host([reflected]) {
          background-color: cyan;
        }

        :host([boolean-value]) {
          font-weight: bold;
        }
      </style>
      <div id="demo">${reflected}</div>
    `;
  }

  static get properties() {
    return {
      reflected: {
        type: String,
        reflectToAttribute: true,
      },
      booleanValue: {
        type: Boolean,
        reflectToAttribute: true,
        value: true,
      },
    };
  }
}

customElements.define('demo-element-properties', DemoPropertiesElement);
