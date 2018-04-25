import XElement from '../x-element.js';

class TestElement extends XElement {
  static template(html) {
    return ({ prop1 }) => html`
      <span>${prop1}</span>
    `;
  }

  static get properties() {
    return {
      // reflected with no value
      prop1: {
        type: String,
        reflectToAttribute: true,
      },
      // reflected with falsy initial value (null)
      prop2: {
        type: String,
        value: null,
        reflectToAttribute: true,
      },
      // reflected with falsy initial value (undefined)
      prop3: {
        type: String,
        value: null,
        reflectToAttribute: true,
      },
      // reflected with falsy initial value (false)
      prop4: {
        type: String,
        value: false,
        reflectToAttribute: true,
      },
      // reflected with initial value
      prop5: {
        type: String,
        value: 'test',
        reflectToAttribute: true,
      },
      // Boolean without initial value
      prop6: {
        type: Boolean,
        reflectToAttribute: true,
      },
      // Boolean with `false` initial value
      prop7: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      // Boolean with `true` initial value
      prop8: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
      },
      // Boolean with truthy initial value (String)
      prop9: {
        type: Boolean,
        value: 'ok',
        reflectToAttribute: true,
      },
      // Boolean with falsy initial value (Number)
      prop10: {
        type: Boolean,
        value: 0,
        reflectToAttribute: true,
      },
      arrayProp: {
        type: Array,
        value: () => ['foo', 'bar'],
      },
      objProp: {
        type: Object,
        value: () => {
          return { foo: 'bar' };
        },
      },
      objPropReflect: {
        type: Object,
        reflectToAttribute: true,
        value: () => {
          return { foo: 'bar' };
        },
      },
      objDateProp: {
        type: Date,
        value: () => {
          return new Date();
        },
      },
      objMapProp: {
        type: Map,
        value: () => {
          return new Map();
        },
      },
    };
  }
}

customElements.define('test-element-scratch', TestElement);
