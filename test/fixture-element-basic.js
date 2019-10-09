import XElementBasic from '../x-element-basic.js';

class TestElement extends XElementBasic {
  static template() {
    return ({ user }) => `
      <span>Hello ${user}.</span>
    `;
  }

  get user() {
    return 'world';
  }

  set overrideProperty(value) {
    if (value) {
      this.setAttribute('override-property', value);
    } else {
      this.removeAttribute('override-property');
    }
    this.invalidate();
  }

  get overrideProperty() {
    return this.getAttribute('override-property');
  }

  set booleanProperty(value) {
    if (value) {
      this.setAttribute('boolean-property', '');
    } else {
      this.removeAttribute('boolean-property');
    }
    this.invalidate();
  }

  get booleanProperty() {
    return this.hasAttribute('boolean-property');
  }

  connectedCallback() {
    super.connectedCallback();
    this.overrideProperty = 'overridden';
  }
}

customElements.define('test-element-basic', TestElement);
