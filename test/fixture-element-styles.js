import ElementMixin from '../mixins/element-mixin.js';
import StylesMixin from '../mixins/styles-mixin.js';

// language=CSS
const style = `
  :host {
    color: blue;
  }
`;

class TestElement extends StylesMixin(ElementMixin(HTMLElement)) {
  static get styles() {
    return [style];
  }

  static template() {
    return () => `
      <style>
        :host {
          color: red;
          text-decoration: underline;
        }
      </style>
      I'm blue and underlined.
    `;
  }
}

customElements.define('test-element-styles', TestElement);
