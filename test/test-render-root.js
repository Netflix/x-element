import { assert, it } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

class TestElement1 extends XElement {
  static createRenderRoot(host) {
    return host;
  }
  static template(html) {
    return () => {
      return html`I'm not in a shadow root.`;
    };
  }
}
customElements.define('test-element-1', TestElement1);

it('test render root was respected', () => {
  const el = document.createElement('test-element-1');
  document.body.append(el);
  assert(el.shadowRoot === null);
  assert(el.textContent === `I'm not in a shadow root.`);
  el.remove();
});

it('errors are thrown in for creating a bad render root', () => {
  class BadElement extends XElement {
    static createRenderRoot() {}
  }
  customElements.define('test-element-2', BadElement);
  let passed = false;
  let message = 'no error was thrown';
  try {
    new BadElement();
  } catch (error) {
    const expected = 'Unexpected render root returned. Expected "host" or "host.shadowRoot".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
