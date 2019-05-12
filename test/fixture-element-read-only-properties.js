import XElementProperties from '../x-element-properties.js';

class TestElement extends XElementProperties {
  static template() {
    return ({ readOnlyProperty }) => `
      <div id="container">
        <span id="read-only-property">${readOnlyProperty}</span>
      </div>
    `;
  }

  static get properties() {
    return {
      readOnlyProperty: {
        type: String,
        readOnly: true,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // TODO: improve interface for readOnly properties.
    const property = 'readOnlyProperty';
    const definition = this.finalizedProperties[property];
    const value = 'Ferus';
    this.constructor.changeProperty(this, property, definition, value);
  }
}

customElements.define('test-element-read-only-properties', TestElement);
