import { assert, it } from '@netflix/x-test/x-test.js';
import styleSheet from './test-styles.css' with { type: 'css' };
import XElement from '../x-element.js';

class TestElement1 extends XElement {
  static count = 0;
  static get styles() {
    TestElement1.count++;
    return [styleSheet];
  }
  static template(html) {
    return () => {
      return html``;
    };
  }
}
customElements.define('test-element-1', TestElement1);

it('provided style sheets are adopted', () => {
  const el = document.createElement('test-element-1');
  document.body.append(el);
  const boundingClientRect = el.getBoundingClientRect();
  assert(boundingClientRect.width === 100);
  assert(boundingClientRect.height === 100);
  el.remove();
});

it('should only get styles _once_ per constructor', () => {
  for (let iii = 0; iii < 10; iii++) {
    // No matter how many times you do this, styles must only be accessed once.
    const el = document.createElement('test-element-1');
    document.body.append(el);
    const boundingClientRect = el.getBoundingClientRect();
    assert(boundingClientRect.width === 100);
    assert(boundingClientRect.height === 100);
    el.remove();
    assert(TestElement1.count === 1);
  }
});

it('errors are thrown when providing styles without a shadow root', () => {
  class BadElement extends XElement {
    static get styles() { return [styleSheet]; }
    static createRenderRoot(host) { return host; }
  }
  customElements.define('test-element-2', BadElement);
  let passed = false;
  let message = 'no error was thrown';
  try {
    new BadElement();
  } catch (error) {
    const expected = 'Unexpected "styles" declared without a shadow root.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('errors are thrown when styles already exist on shadow root.', () => {
  class BadElement extends XElement {
    static get styles() { return [styleSheet]; }
    static createRenderRoot(host) {
      host.attachShadow({ mode: 'open' });
      host.shadowRoot.adoptedStyleSheets = [styleSheet];
      return host.shadowRoot;
    }
  }
  customElements.define('test-element-3', BadElement);
  let passed = false;
  let message = 'no error was thrown';
  try {
    new BadElement();
  } catch (error) {
    const expected = 'Unexpected "styles" declared when preexisting "adoptedStyleSheets" exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
