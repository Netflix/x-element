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
        reflect: true,
      },
      overrideProperty: {
        type: String,
        value: 'override_me',
        reflect: true,
      },
      booleanPropertyTrue: {
        type: Boolean,
        value: true,
        reflect: true,
      },
      booleanPropertyFalse: {
        type: Boolean,
        value: false,
        reflect: true,
      },
      typelessProperty: {
        reflect: true,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.overrideProperty = 'overridden';
  }
}

customElements.define('test-element-attr-reflection', TestElement);
