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

// Depending on the browser — the underlying error is surfaced differently.
// We just match our custom suffix to be agnostic.
it('errors are thrown in connectedCallback when template result fails to render', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static get properties() {
      return {
        strings: {},
      };
    }
    static template(html, { repeat }) {
      return ({ strings }) => {
        // In this case, "repeat" will fail if "strings" is not an array.
        return html`${repeat(strings, string => html`${string}`)}`;
      };
    }
  }
  customElements.define('test-element-4', TestElement);
  const el = new TestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = ' — Invalid template for "TestElement" at path "test-element-4"';
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
    static get properties() {
      return {
        strings: {},
      };
    }
    static template(html, { repeat }) {
      return ({ strings }) => {
        // In this case, "repeat" will fail if "strings" is not an array.
        return html`${repeat(strings, string => html`${string}`)}`;
      };
    }
  }
  customElements.define('test-element-5', TestElement);
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
    const expected = ' — Invalid template for "TestElement" at path "test-element-5[id="testing"][class="foo bar"][boolean][variation="primary"]"';
    message = error.message;
    passed = error.message.endsWith(expected);
  }
  assert(passed, message);
});
