import ElementMixin from '../mixins/element-mixin.js';
import PropertiesMixin from '../mixins/properties-mixin.js';

class TestElement extends PropertiesMixin(ElementMixin(HTMLElement)) {
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
