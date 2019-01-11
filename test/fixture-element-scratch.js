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
        reflect: true,
      },
      // reflected with falsy initial value (null)
      prop2: {
        type: String,
        value: null,
        reflect: true,
      },
      // reflected with falsy initial value (undefined)
      prop3: {
        type: String,
        value: null,
        reflect: true,
      },
      // reflected with falsy initial value (false)
      prop4: {
        type: String,
        value: false,
        reflect: true,
      },
      // reflected with initial value
      prop5: {
        type: String,
        value: 'test',
        reflect: true,
      },
      // Boolean without initial value
      prop6: {
        type: Boolean,
        reflect: true,
      },
      // Boolean with `false` initial value
      prop7: {
        type: Boolean,
        value: false,
        reflect: true,
      },
      // Boolean with `true` initial value
      prop8: {
        type: Boolean,
        value: true,
        reflect: true,
      },
      // Boolean with truthy initial value (String)
      prop9: {
        type: Boolean,
        value: 'ok',
        reflect: true,
      },
      // Boolean with falsy initial value (Number)
      prop10: {
        type: Boolean,
        value: 0,
        reflect: true,
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
        reflect: true,
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
