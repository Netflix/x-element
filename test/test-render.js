import XElement from '../x-element.js';
import { assert, it } from './x-test.js';

class TestElement extends XElement {
  static get properties() {
    return {
      property: {
        initial: 'initial',
      },
    };
  }
  static template(html) {
    return ({ property }, host) => {
      host.setAttribute('host-available', '');
      return html`<div>${property}</div>`;
    };
  }
  constructor() {
    super();
    this.count = 0;
  }
  render() {
    this.count++;
    if (this.count > 1) {
      super.render();
    }
  }
}
customElements.define('test-element', TestElement);

it('test super.render can be ignored', async () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.count === 1);
  assert(el.property === 'initial');
  assert(el.shadowRoot.textContent === '');
  el.property = 'next';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.count === 2);
  assert(el.property === 'next');
  assert(el.shadowRoot.textContent === 'next');
});

it('test host is available', async () => {
  const el = document.createElement('test-element');
  // Get around our render guard — we're not testing that here.
  el.count = 2;
  assert(el.hasAttribute('host-available') === false);
  document.body.append(el);
  assert(el.hasAttribute('host-available') === true);
});
