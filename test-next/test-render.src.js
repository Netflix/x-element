import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

// TODO: #346: Render behavior is not decorator-specific. Updated to use
//  decorator syntax for properties but the render tests remain the same.
class TestElement extends XElement {
  @property({ initial: 'initial' })
  accessor property;

  static template(host) {
    host.setAttribute('host-available', '');
    return html`<div>${host.property}</div>`;
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
customElements.define('test-element-render', TestElement);

it('test super.render can be ignored', async () => {
  const el = document.createElement('test-element-render');
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
  const el = document.createElement('test-element-render');
  // Get around our render guard — we're not testing that here.
  el.count = 2;
  assert(el.hasAttribute('host-available') === false);
  document.body.append(el);
  assert(el.hasAttribute('host-available') === true);
});
