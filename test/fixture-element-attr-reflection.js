import XElementProperties from '../x-element-properties.js';

class TestElement extends XElementProperties {
  static template() {
    return ({ camelCaseProperty: ccp }) => `
      <span>${ccp}</span>
    `;
  }

  static get properties() {
    return {
      camelCaseProperty: {
        type: String,
        value: 'reflectedCamel',
        reflectToAttribute: true,
      },
      overrideProperty: {
        type: String,
        value: 'override_me',
        reflectToAttribute: true,
      },
      booleanPropertyTrue: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
      },
      booleanPropertyFalse: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.overrideProperty = 'overridden';
  }
}

customElements.define('test-element-attr-reflection', TestElement);
