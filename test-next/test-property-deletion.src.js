import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property } from '../x-element-next.js';

class TestElement extends XElement {
  @property({ type: String })
  accessor foo;

  @property({ type: Number })
  accessor bar;

  @property({ type: String })
  accessor #readOnlyProp;

  @property({
    type: String,
    input: ['#readOnlyProp'],
    compute: (readOnlyProp) => readOnlyProp,
  })
  accessor readOnlyProp;

  @property({
    type: String,
    input: ['foo'],
    compute: (foo) => `computed-${foo}`,
  })
  accessor computedProp;
}
customElements.define('test-delete-element-next', TestElement);

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('properties are non-configurable from construction', () => {
  const el = document.createElement('test-delete-element-next');
  const descriptor = Object.getOwnPropertyDescriptor(el, 'foo');
  assert(descriptor !== undefined);
  assert(descriptor.configurable === false);
  assert(descriptor.enumerable === true);
  assert(typeof descriptor.get === 'function');
  assert(typeof descriptor.set === 'function');
});

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('prevents deletion of properties after construction', () => {
  const el = document.createElement('test-delete-element-next');
  assert('foo' in el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    delete el.foo;
  } catch (error) {
    message = error.message;
    passed = error.message.includes('Cannot delete property');
  }
  assert(passed, message);
  assert('foo' in el);
});

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('returns false for Reflect.deleteProperty after construction', () => {
  const el = document.createElement('test-delete-element-next');
  assert('foo' in el);
  const result = Reflect.deleteProperty(el, 'foo');
  assert(result === false);
  assert('foo' in el);
});

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('properties remain non-configurable after initialization', () => {
  const el = document.createElement('test-delete-element-next');
  document.body.append(el);
  const descriptor = Object.getOwnPropertyDescriptor(el, 'foo');
  assert(descriptor !== undefined);
  assert(descriptor.configurable === false);
  assert(descriptor.enumerable === true);
  assert(typeof descriptor.get === 'function');
  assert(typeof descriptor.set === 'function');
  el.remove();
});
