import XElement from '../x-element.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

it('properties should not have hyphens (conflicts with attribute names)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { 'just-stop': {} };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected key "TestElement.properties.just-stop" contains "-" (property names should be camelCased).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('property attributes should not have non-standard casing', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { ok: { type: String, attribute: 'this-IS-not-OK'} };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.properties.ok has non-standard attribute casing "this-IS-not-OK" (use lower-cased names).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('properties should not shadow XElement prototype interface', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { internal: {} };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected key "TestElement.properties.internal" shadows in XElement.prototype interface.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('property keys should only be from our known set', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badProperty: { doesNotExist: true } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected key "TestElement.properties.badProperty.doesNotExist".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('properties should be objects', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badProperty: undefined };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.properties.badProperty has an unexpected value (expected Object, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('type should be a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badType: { type: undefined } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badType.type" (expected constructor Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('compute should be a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badCompute: { compute: undefined } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badCompute.compute" (expected Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('observe should be a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badObserve: { observe: undefined } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badObserve.observe" (expected Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('attribute should be a string', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badAttribute: { attribute: undefined } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badAttribute.attribute" (expected String, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('attribute should be a non-empty string', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badAttribute: { attribute: '' } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badAttribute.attribute" (expected non-empty String).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('attributes cannot be duplicated (1)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { attribute: { type: String }, aliased: { type: String, attribute: 'attribute' } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.properties.aliased causes a duplicated attribute "attribute".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('attributes cannot be duplicated (2)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { attribute: {}, aliased: { attribute: 'attribute' } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.properties.aliased causes a duplicated attribute "attribute".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('default must be a scalar or a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badValue: { default: {} } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badValue.default" (expected Boolean, String, Number, or Function, got Object).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('reflect should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badReflect: { reflect: undefined } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badReflect.reflect" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('internal should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badInternal: { internal: undefined } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badInternal.internal" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('readOnly should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badReadOnly: { readOnly: undefined } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badReadOnly.readOnly" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('input should be an array', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badInput: { input: {} } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badInput.input" (expected Array, got Object).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('input items should be strings', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badInput: { input: ['foo', 'bar', undefined] } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.properties.badInput.input[2]" (expected String, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('input must be declared as other property names', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          foo: {},
          badInput: { input: ['foo', 'bar'], compute: () => {} },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.properties.badInput.input[1] has an unexpected item ("bar" has not been declared).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('input cannot be cyclic (simple)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          simpleCycle: { input: ['simpleCycle'], compute: () => {} },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.properties.simpleCycle.input is cyclic.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('input cannot be cyclic (complex)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          a: { input: ['c'], compute: () => {} },
          b: { input: ['a'], compute: () => {} },
          c: { input: ['b'], compute: () => {} },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.properties.a.input is cyclic.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('input cannot be declared without a compute callback', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { missingCompute: { input: ['foo', 'bar', 'baz'] } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.properties.missingCompute.input" without "TestElement.properties.missingCompute.compute" (computed properties require a compute callback).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('initial cannot be declared for a computed property', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { unexpectedValue: { compute: () => {}, input: [], initial: 5 } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.properties.unexpectedValue.initial" and "TestElement.properties.unexpectedValue.compute" (computed properties cannot set an initial value).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('readOnly cannot be declared for a computed property', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { unexpectedValue: { compute: () => {}, input: [], readOnly: true } };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.properties.unexpectedValue.readOnly" and "TestElement.properties.unexpectedValue.compute" (computed properties cannot define read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('internal properties cannot also be readOnly', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          internalReadOnlyProperty: {
            type: String,
            internal: true,
            readOnly: true,
          },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Both "TestElement.properties.internalReadOnlyProperty.internal" and "TestElement.properties.internalReadOnlyProperty.readOnly" are true (read-only properties cannot be internal).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('internal properties cannot also be reflected', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          internalReflectedProperty: {
            type: String,
            internal: true,
            reflect: true,
          },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Both "TestElement.properties.internalReflectedProperty.reflect" and "TestElement.properties.internalReflectedProperty.internal" are true (reflected properties cannot be internal).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('internal properties cannot define an attribute', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          internalAttributeProperty: {
            type: String,
            internal: true,
            attribute: 'custom-attribute',
          },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.properties.internalAttributeProperty.attribute" but "TestElement.properties.internalAttributeProperty.internal" is true (internal properties cannot have attributes).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('reflected properties must have serializable type', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          nonSerializableProperty: {
            type: Object,
            reflect: true,
          },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.properties.nonSerializableProperty.type" (Object) but "TestElement.properties.nonSerializableProperty.reflect" is true.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('reflected properties must have serializable type (2)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          typelessProperty: {
            reflect: true,
          },
        };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.properties.typelessProperty.type" (Undefined) but "TestElement.properties.typelessProperty.reflect" is true.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('listeners as an object should map to functions', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get listeners() {
        return { foo: undefined };
      }
    }
    customElements.define('test-element', TestElement);
  } catch (error) {
    const expected = 'TestElement.listeners.foo has unexpected value (expected Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
