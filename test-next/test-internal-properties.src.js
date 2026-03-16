// TODO: #346: We likely should rename this to test-private-properties and
//  rewrite to target idiomatic private fields in the future.

import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

class TestElement extends XElement {
  @property({ type: String, initial: 'Ferus' })
  accessor #internalProperty;

  @property({
    type: String,
    input: ['#internalProperty'],
    compute: internalProperty => internalProperty,
  })
  accessor #internalComputedProperty;

  // This exists on the public interface, we want to ensure that there's no
  //  issue using this same name on the internal interface.
  @property({
    // Use a type that's in conflict with the public interface.
    type: Boolean,
  })
  accessor #children;

  static template(host) {
    return html`<div>${host.#internalProperty}</div>`;
  }
}
customElements.define('test-element-next', TestElement);

it('initialization', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'Ferus', 'initialized as expected');
});

// TODO: #346: We can likely delete. It used to test the "in" operator on
//  el.internal proxy, but decorator API uses native private fields (#).
it.skip('can use "has" api or "in" operator.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert('internalProperty' in el.internal, 'The "has" trap does not work.');
});

// TODO: #346: We can likely delete. It used to test Reflect.ownKeys on el.internal
//  proxy, but decorator API uses native private fields which don't appear in ownKeys.
it.skip('can use "ownKeys" api.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  const ownKeys = Reflect.ownKeys(el.internal);
  assert(
    ownKeys.length === 3 &&
    ownKeys[0] === 'internalProperty' &&
    ownKeys[1] === 'internalComputedProperty' &&
    ownKeys[2] === 'children',
    'The "ownKeys" trap does not work.'
  );
});

it('cannot be read on host', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.internalProperty === undefined);
});

it('cannot be written to on host', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.internalProperty === undefined);
  el.internalProperty = 'ignored';
  assert(el.internalProperty === 'ignored');
});

// TODO: #346: We can likely delete. It used to test reading via el.internal proxy,
//  but decorator API uses native private fields which can only be accessed within the class.
it.skip('can be read from "internal"', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.internal.internalProperty === 'Ferus');
});

// TODO: #346: We can likely delete. It used to test writing via el.internal proxy,
//  but decorator API uses native private fields which can only be modified within the class.
it.skip('can be written to from "internal"', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.internal.internalProperty = 'Dromedary';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'Dromedary', 'written to as expected');
});

// TODO: #346: We can likely delete. It used to test computed property read-only
//  enforcement via el.internal proxy, but decorator API uses native private fields.
it.skip('cannot be written to from "internal" if computed', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.internalComputedProperty = `don't do it`;
  } catch (error) {
    const expected = 'Property "TestElement.properties.internalComputedProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy constraints in
//  template, but decorator API receives the host directly. Private fields can't be accessed
//  from static methods anyway (syntax error).
it.skip('cannot set to known properties', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor #internalProperty;

    static template(host) {
      // This would be a syntax error - can't access private field from static method
      // host.#internalProperty = 'Dromedary';
      return html`<div>${host.#internalProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Cannot set "BadTestElement.properties.internalProperty" via "properties".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy errors for
//  unknown property access, but decorator API uses native private fields.
it.skip('cannot get unknown properties', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.doesNotExist;
  } catch (error) {
    const expected = 'Property "TestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy errors for
//  unknown property writes, but decorator API uses native private fields.
it.skip('cannot get unknown properties', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.doesNotExist = 'nope';
  } catch (error) {
    const expected = 'Property "TestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "defineProperty" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.defineProperty(el.internal, 'foo', {});
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// This is a funny one, you can set to undefined, but we strictly don't let you
// "delete" since it has a different meaning and you strictly cannot delete our
// accessors.
// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "delete" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.deleteProperty(el.internal, 'internalProperty');
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "getOwnPropertyDescriptor" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.getOwnPropertyDescriptor(el.internal, 'internalProperty');
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "getPrototypeOf" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.getPrototypeOf(el.internal);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "isExtensible" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.isExtensible(el.internal);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "preventExtensions" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.preventExtensions(el.internal);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "setPrototypeOf" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.setPrototypeOf(el.internal, Array);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
