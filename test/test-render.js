import { assert, test } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

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

test('test super.render can be ignored', async () => {
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

test('test host is available', async () => {
  const el = document.createElement('test-element');
  // Get around our render guard — we're not testing that here.
  el.count = 2;
  assert(el.hasAttribute('host-available') === false);
  document.body.append(el);
  assert(el.hasAttribute('host-available') === true);
});
