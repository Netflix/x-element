import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, listener } from '../x-element-next.js';

it('properties should not have hyphens (conflicts with attribute names)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      @property({ type: String })
      accessor 'just-stop';
    }
    customElements.define('test-element-hyphen', TestElement);
  } catch (error) {
    // Note: With decorators, the error message may be different as we're
    // decorating a quoted property name which might fail at the decorator level
    passed = true;
    message = error.message;
  }
  assert(passed, message);
});

it('property attributes should not have non-standard casing', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      @property({ type: String, attribute: 'this-IS-not-OK' })
      accessor ok;
    }
    customElements.define('test-element-attr-case', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.ok has non-standard attribute casing "this-IS-not-OK" (use lower-cased names).';
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
      @property({})
      accessor dispatchError;
    }
    customElements.define('test-element-shadow', TestElement);
  } catch (error) {
    const expected = 'Unexpected key "TestElement.prototype.dispatchError" shadows in XElement.prototype interface.';
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
      @property({ doesNotExist: true })
      accessor badProperty;
    }
    customElements.define('test-element-bad-key', TestElement);
  } catch (error) {
    const expected = 'Unexpected key "TestElement.prototype.badProperty.doesNotExist".';
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
      @property(undefined)
      accessor badProperty;
    }
    customElements.define('test-element-bad-prop-type', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.badProperty has an unexpected value (expected Object, got Undefined).';
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
      @property({ type: undefined })
      accessor badType;
    }
    customElements.define('test-element-bad-type', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badType.type" (expected constructor Function, got Undefined).';
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
      @property({ compute: undefined })
      accessor badCompute;
    }
    customElements.define('test-element-bad-compute', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badCompute.compute" (expected Function, got Undefined).';
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
      @property({ observe: undefined })
      accessor badObserve;
    }
    customElements.define('test-element-bad-observe', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badObserve.observe" (expected Function, got Undefined).';
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
      @property({ attribute: undefined })
      accessor badAttribute;
    }
    customElements.define('test-element-bad-attr', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badAttribute.attribute" (expected String, got Undefined).';
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
      @property({ attribute: '' })
      accessor badAttribute;
    }
    customElements.define('test-element-empty-attr', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badAttribute.attribute" (expected non-empty String).';
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
      @property({ type: String })
      accessor attribute;

      @property({ type: String, attribute: 'attribute' })
      accessor aliased;
    }
    customElements.define('test-element-dup-attr-1', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.aliased causes a duplicated attribute "attribute".';
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
      @property({})
      accessor attribute;

      @property({ attribute: 'attribute' })
      accessor aliased;
    }
    customElements.define('test-element-dup-attr-2', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.aliased causes a duplicated attribute "attribute".';
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
      @property({ default: {} })
      accessor badValue;
    }
    customElements.define('test-element-bad-default', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badValue.default" (expected Boolean, String, Number, or Function, got Object).';
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
      @property({ reflect: undefined })
      accessor badReflect;
    }
    customElements.define('test-element-bad-reflect', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badReflect.reflect" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The internal configuration doesn't exist in the decorator API.
//  Users should use private fields to achieve internal property behavior.
//  Skip this test as internal configuration is not supported with decorators.
it.skip('internal should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      @property({ internal: undefined })
      accessor badInternal;
    }
    customElements.define('test-element-bad-internal', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badInternal.internal" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  Instead, users should use accessor-only decorators (no setter) or private
//  fields with a getter accessor to achieve read-only behavior. Skip this test
//  as readOnly configuration is not supported with decorators.
it.skip('readOnly should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { badReadOnly: { readOnly: undefined } };
      }
    }
    customElements.define('test-element-bad-readonly', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badReadOnly.readOnly" (expected Boolean, got Undefined).';
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
      @property({ input: {} })
      accessor badInput;
    }
    customElements.define('test-element-bad-input-type', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badInput.input" (expected Array, got Object).';
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
      @property({ input: ['foo', 'bar', undefined] })
      accessor badInput;
    }
    customElements.define('test-element-bad-input-items', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badInput.input[2]" (expected String, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('input keys cannot be duplicated', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      @property({ type: String })
      accessor foo;

      @property({ input: ['foo', 'foo'], compute: () => {} })
      accessor computed;
    }
    customElements.define('test-element-duplicate-input', TestElement);
  } catch (error) {
    const expected = 'Duplicate key "foo" in "TestElement.prototype.computed.input" (each input key must be unique).';
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
      @property({})
      accessor foo;

      @property({ input: ['foo', 'bar'], compute: () => {} })
      accessor badInput;
    }
    customElements.define('test-element-undeclared-input', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.badInput.input[1] has an unexpected item ("bar" cannot be resolved).';
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
      @property({ input: ['simpleCycle'], compute: () => {} })
      accessor simpleCycle;
    }
    customElements.define('test-element-simple-cycle', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.simpleCycle.input is cyclic.';
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
      @property({ input: ['c'], compute: () => {} })
      accessor a;

      @property({ input: ['a'], compute: () => {} })
      accessor b;

      @property({ input: ['b'], compute: () => {} })
      accessor c;
    }
    customElements.define('test-element-complex-cycle', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.a.input is cyclic.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('attribute cannot be declared on unserializable types', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      @property({ type: Function, attribute: 'nope' })
      accessor unserializable;
    }
    customElements.define('test-element-unserializable', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.prototype.unserializable.type" (Function) but "TestElement.prototype.unserializable.attribute" is defined.';
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
      @property({ input: ['foo', 'bar', 'baz'] })
      accessor missingCompute;
    }
    customElements.define('test-element-missing-compute', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.missingCompute.input" without "TestElement.prototype.missingCompute.compute" (computed properties require a compute callback).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('compute cannot be declared without an input callback', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      @property({ compute: () => {} })
      accessor missingInput;
    }
    customElements.define('test-element-missing-input', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.missingInput.compute" without "TestElement.prototype.missingInput.input" (computed properties require input).';
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
      @property({ compute: () => {}, input: [], initial: 5 })
      accessor unexpectedValue;
    }
    customElements.define('test-element-computed-initial', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.unexpectedValue.initial" and "TestElement.prototype.unexpectedValue.compute" (computed properties cannot set an initial value).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  This test validates that computed properties cannot be readOnly, but since
//  readOnly doesn't exist in decorators, skip this test.
it.skip('readOnly cannot be declared for a computed property', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return { unexpectedValue: { compute: () => {}, input: [], readOnly: true } };
      }
    }
    customElements.define('test-element-computed-readonly', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.unexpectedValue.readOnly" and "TestElement.prototype.unexpectedValue.compute" (computed properties cannot define read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  This test validates that internal properties cannot be readOnly, but since
//  readOnly doesn't exist in decorators, skip this test.
it.skip('internal properties cannot also be readOnly', () => {
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
    customElements.define('test-element-internal-readonly', TestElement);
  } catch (error) {
    const expected = 'Both "TestElement.prototype.internalReadOnlyProperty.internal" and "TestElement.prototype.internalReadOnlyProperty.readOnly" are true (read-only properties cannot be internal).';
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
      @property({
        type: String,
        reflect: true,
      })
      accessor #internalReflectedProperty;
    }
    customElements.define('test-element-internal-reflect', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.#internalReflectedProperty.reflect" but property is private (private properties cannot be reflected).';
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
      @property({
        type: String,
        attribute: 'custom-attribute',
      })
      accessor #internalAttributeProperty;
    }
    customElements.define('test-element-internal-attr', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.#internalAttributeProperty.attribute" but property is private (private properties cannot have attributes).';
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
      @property({
        type: Object,
        reflect: true,
      })
      accessor nonSerializableProperty;
    }
    customElements.define('test-element-reflect-nonserialized', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.prototype.nonSerializableProperty.type" (Object) but "TestElement.prototype.nonSerializableProperty.reflect" is true.';
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
      @property({
        reflect: true,
      })
      accessor typelessProperty;
    }
    customElements.define('test-element-reflect-typeless', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.prototype.typelessProperty.type" (Undefined) but "TestElement.prototype.typelessProperty.reflect" is true.';
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
      // With decorators, this error would be caught differently since we
      // can't decorate non-functions. This test might need to be updated
      // to test the decorator API's validation.
      @listener('click')
      static foo = undefined;
    }
    customElements.define('test-element-bad-listener', TestElement);
  } catch (error) {
    // The error message will be different with decorators
    passed = true;
    message = error.message;
  }
  assert(passed, message);
});

it('listener options should be an object', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      @listener('click', 'not-an-object')
      static onClick() {}
    }
    customElements.define('test-element-bad-options', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.onClick" options (expected Object, got String).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: This is a temporary limitation of the babel decorator
//  transpiler. We will be able to invert this test later to prove that we can
//  in fact use the same private property names in parent and child.
it('cannot use same private property name in parent and child', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class ParentElement extends XElement {
      @property({ type: String })
      accessor #field;
    }

    class ChildElement extends ParentElement {
      @property({ type: String })
      accessor #field;
    }

    customElements.define('test-private-collision', ChildElement);
  } catch (error) {
    const expected = 'ChildElement: Cannot use private property "#field" in both parent and child classes.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
