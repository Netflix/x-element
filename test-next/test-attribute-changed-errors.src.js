import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property } from '../x-element-next.js';

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  Users should use accessor-only decorators (no setter) or private fields
//  to achieve read-only behavior. Skip this test as readOnly is not supported.
it.skip('errors are thrown in attributeChangedCallback for read-only properties', () => {
  // We cannot try-catch setAttribute, so we fake the attributeChangedCallback.
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
  customElements.define('test-element-2', TestElement);
  const el = new TestElement();
  let passed = false;
  let message = 'no error was thrown';
  el.connectedCallback();
  try {
    el.attributeChangedCallback('read-only-property', null, 'nope');
  } catch (error) {
    const expected = 'Property "TestElement.prototype.readOnlyProperty" is read-only.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('errors are thrown in attributeChangedCallback for computed properties', () => {
  // We cannot try-catch setAttribute, so we fake the attributeChangedCallback.
  class TestElement extends XElement {
    @property({
      type: String,
      input: [],
      compute: () => {},
    })
    accessor computed;
  }
  customElements.define('test-element-attr-computed', TestElement);
  const el = new TestElement();
  el.connectedCallback();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.attributeChangedCallback('computed', null, 'nope');
  } catch (error) {
    const expected = 'Property "TestElement.prototype.computed" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
