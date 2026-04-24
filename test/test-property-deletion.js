import { assert, test } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

class TestElement extends XElement {
  static get properties() {
    return {
      foo: { type: String },
      bar: { type: Number },
      readOnlyProp: { type: String, readOnly: true },
      computedProp: {
        type: String,
        input: ['foo'],
        compute: foo => `computed-${foo}`,
      },
    };
  }
}
customElements.define('test-delete-element', TestElement);

test('properties are non-configurable from construction', () => {
  const el = document.createElement('test-delete-element');
  const descriptor = Object.getOwnPropertyDescriptor(el, 'foo');
  assert(descriptor !== undefined);
  assert(descriptor.configurable === false);
  assert(descriptor.enumerable === true);
  assert(typeof descriptor.get === 'function');
  assert(typeof descriptor.set === 'function');
});

test('prevents deletion of properties after construction', () => {
  const el = document.createElement('test-delete-element');
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

test('returns false for Reflect.deleteProperty after construction', () => {
  const el = document.createElement('test-delete-element');
  assert('foo' in el);
  const result = Reflect.deleteProperty(el, 'foo');
  assert(result === false);
  assert('foo' in el);
});

test('properties remain non-configurable after initialization', () => {
  const el = document.createElement('test-delete-element');
  document.body.append(el);
  const descriptor = Object.getOwnPropertyDescriptor(el, 'foo');
  assert(descriptor !== undefined);
  assert(descriptor.configurable === false);
  assert(descriptor.enumerable === true);
  assert(typeof descriptor.get === 'function');
  assert(typeof descriptor.set === 'function');
  el.remove();
});
