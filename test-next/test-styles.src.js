import { assert, it } from '@netflix/x-test/x-test.js';
import styleSheet from './test-styles.css' with { type: 'css' };
import { XElement, html } from '../x-element-next.js';

// TODO: #346: Styles behavior is not decorator-specific. These tests remain
//  unchanged as they test the static styles getter.
class TestElement1 extends XElement {
  static count = 0;
  static get styles() {
    TestElement1.count++;
    return [styleSheet];
  }
  static template() {
    return html``;
  }
}
customElements.define('test-element-styles-1', TestElement1);

it('provided style sheets are adopted', () => {
  const el = document.createElement('test-element-styles-1');
  document.body.append(el);
  const boundingClientRect = el.getBoundingClientRect();
  assert(boundingClientRect.width === 100);
  assert(boundingClientRect.height === 100);
  el.remove();
});

it('should only get styles _once_ per constructor', () => {
  for (let iii = 0; iii < 10; iii++) {
    // No matter how many times you do this, styles must only be accessed once.
    const el = document.createElement('test-element-styles-1');
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
  customElements.define('test-element-styles-2', BadElement);
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
  customElements.define('test-element-styles-3', BadElement);
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
