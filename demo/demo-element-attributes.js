import XElement from '../x-element.js';

class DemoAttributesElement extends XElement {
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

  static template(html) {
    return ({ hyphenatedValue }) => {
      return html`
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
    };
  }
}

customElements.define('demo-element-attributes', DemoAttributesElement);
