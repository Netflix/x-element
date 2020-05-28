import XElement from '../x-element.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

it('errors are thrown in connectedCallback for initializing values with bad types', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static get properties() {
      return {
        string: {
          type: String,
        },
      };
    }
  }
  customElements.define('test-element-0', TestElement);
  const el = new TestElement();
  el.string = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.string" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('errors are thrown in connectedCallback for initializing read-only properties', () => {
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
    const expected = 'Property "TestElement.properties.readOnlyProperty" is read-only (internal.readOnlyProperty).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('errors are thrown in connectedCallback for initializing internal properties', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static get properties() {
      return {
        internalProperty: {
          type: String,
          internal: true,
        },
      };
    }
  }
  customElements.define('test-element-2', TestElement);
  const el = new TestElement();
  el.internalProperty = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "TestElement.properties.internalProperty" is internal (internal.internalProperty).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('errors are thrown in connectedCallback for initializing computed properties', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static get properties() {
      return {
        computed: {
          type: String,
          input: [],
          compute: () => {},
        },
      };
    }
  }
  customElements.define('test-element-3', TestElement);
  const el = new TestElement();
  el.computed = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "TestElement.properties.computed" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
