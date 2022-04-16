import XElement from '../x-element.js';
import { assert, it } from './x-test.js';

class TestElement extends XElement {
  static createRenderRoot(host) {
    return host;
  }
  static template(html) {
    return () => {
      return html`I'm not in a shadow root.`;
    };
  }
}
customElements.define('test-element', TestElement);


it('test render root was respected', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.shadowRoot === null);
  assert(el.textContent === `I'm not in a shadow root.`);
});

it('errors are thrown in for creating a bad render root', () => {
  class BadElement extends XElement {
    static createRenderRoot() {}
  }
  customElements.define('test-element-1', BadElement);
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
