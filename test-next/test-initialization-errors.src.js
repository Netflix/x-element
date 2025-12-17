import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

it('errors are thrown in connectedCallback for initializing values with bad types', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    @property({ type: String })
    accessor string;
  }
  customElements.define('test-element-init-type', TestElement);
  const el = new TestElement();
  el.string = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.string" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  Users should use accessor-only decorators (no setter) or private fields
//  to achieve read-only behavior. Skip this test as readOnly is not supported.
it.skip('errors are thrown in connectedCallback for initializing read-only properties', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static get properties() {
      return {
        readOnlyProperty: {
          type: String,
          readOnly: true,
        },
      };
    }
  }
  customElements.define('test-element-1', TestElement);
  const el = new TestElement();
  el.readOnlyProperty = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "TestElement.prototype.readOnlyProperty" is read-only.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('errors are thrown in connectedCallback for initializing computed properties', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    @property({
      type: String,
      input: [],
      compute: () => {},
    })
    accessor computed;
  }
  customElements.define('test-element-init-computed', TestElement);
  const el = new TestElement();
  el.computed = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "TestElement.prototype.computed" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// Depending on the browser — the underlying error is surfaced differently.
// We just match our custom suffix to be agnostic.
it('errors are thrown in connectedCallback when template result fails to render', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    @property({ default: () => ['one', 'two', 'three'] })
    accessor strings;

    static template(host) {
      // In this case, the array will fail if items are not template results.
      return html`<div>${host.strings}</div>`;
    }
  }
  customElements.define('test-element-render-fail', TestElement);
  const el = new TestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid template for "TestElement" / <test-element-render-fail> at path "test-element-render-fail".';
    message = error.message;
    passed = error.message.endsWith(expected);
  }
  assert(passed, message);
});

// Depending on the browser — the underlying error is surfaced differently.
// We just match our custom suffix to be agnostic.
it('errors are thrown in connectedCallback when template result fails to render (with ids, classes, and attributes)', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    @property({ default: () => ['one', 'two', 'three'] })
    accessor strings;

    static template(host) {
      // In this case, the array will fail if items are not template results.
      return html`<div>${host.strings}</div>`;
    }
  }
  customElements.define('test-element-render-fail-details', TestElement);
  const el = new TestElement();
  let passed = false;
  let message = 'no error was thrown';
  el.id = 'testing';
  el.classList.add('foo');
  el.classList.add('bar');
  el.setAttribute('boolean', '');
  el.setAttribute('variation', 'primary');
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid template for "TestElement" / <test-element-render-fail-details> at path "test-element-render-fail-details[id="testing"][class="foo bar"][boolean][variation="primary"]".';
    message = error.message;
    passed = error.message.endsWith(expected);
  }
  assert(passed, message);
});
