import ElementMixin from '../mixins/element-mixin.js';
import ListenersMixin from '../mixins/listeners-mixin.js';

class TestElement extends ListenersMixin(ElementMixin(HTMLElement)) {
  static get listeners() {
    return { click: 'onClick' };
  }

  static get observedAttributes() {
    return ['clicks', 'count'];
  }

  static template() {
    return ({ clicks, count }) => `
      <button id="increment" type="button">+</button>
      <button id="decrement" type="button">-</button>
      <span>clicks: ${clicks} count ${count}</span>
    `;
  }

  attributeChangedCallback() {
    this.invalidate();
  }

  get clicks() {
    return Number(this.getAttribute('clicks'));
  }

  set clicks(value) {
    this.setAttribute('clicks', value);
  }

  get count() {
    return Number(this.getAttribute('count'));
  }

  set count(value) {
    this.setAttribute('count', value);
  }

  onClick(evt) {
    this.clicks++;
    if (evt.target.id === 'increment') {
      this.count++;
    } else if (evt.target.id === 'decrement') {
      this.count--;
    }
  }
}

customElements.define('test-element-listeners', TestElement);
