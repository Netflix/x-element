import XElementBasic from '../x-element-basic.js';

export default class TestElement extends XElementBasic {
  constructor() {
    super();
    this._readOnlyProperty = 'didelphidae';
    this._readOnlyKey = 'didelphimorphia';
    Reflect.defineProperty(this, 'readOnlyDefinedProperty', {
      value: 'phalangeriformes',
      configurable: false,
    });
  }

  static template() {
    return ({ readOnlyProperty }) => `<div>${readOnlyProperty}</div>`;
  }

  get readOnlyProperty() {
    return this._readOnlyProperty;
  }

  get [Symbol.for('readOnlyKey')]() {
    return this._readOnlyKey;
  }

  get reflectedProperty() {
    return this.getAttribute('reflected-property');
  }

  set reflectedProperty(value) {
    this.setAttribute('reflected-property', value);
  }
}

// NOTE, this is not defined in this file on purpose.
