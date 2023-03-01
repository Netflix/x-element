import XElement from '../x-element.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

class TestElement extends XElement {
  static get properties() {
    return {
      internalProperty: {
        type: String,
        internal: true,
        initial: 'Ferus',
      },
      internalComputedProperty: {
        type: String,
        internal: true,
        input: ['internalProperty'],
        compute: internalProperty => internalProperty,
      },
      // This exists on the public interface, we want to ensure that there's no
      //  issue using this same name on the internal interface.
      children: {
        // Use a type that's in conflict with the public interface.
        type: Boolean,
        internal: true,
      },
    };
  }
  static template(html) {
    return ({ internalProperty }) => {
      return html`<div>${internalProperty}</div>`;
    };
  }
}
customElements.define('test-element', TestElement);

it('initialization', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'Ferus', 'initialized as expected');
});

it('can use "has" api or "in" operator.', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert('internalProperty' in el.internal, 'The "has" trap does not work.');
});

it('can use "ownKeys" api.', () => {
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.internal.internalProperty === 'Ferus');
  assert(el.internalProperty === undefined);
});

it('cannot be written to on host', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.internal.internalProperty === 'Ferus');
  assert(el.internalProperty === undefined);
  el.internalProperty = 'ignored';
  assert(el.internal.internalProperty === 'Ferus');
  assert(el.internalProperty === 'ignored');
});

it('can be read from "internal"', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.internal.internalProperty === 'Ferus');
});

it('can be written to from "internal"', async () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  el.internal.internalProperty = 'Dromedary';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'Dromedary', 'written to as expected');
});

it('cannot be written to from "internal" if computed', () => {
  const el = document.createElement('test-element');
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

it('cannot set to known properties', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        internalProperty: {
          type: String,
          internal: true,
        },
      };
    }
    static template(html) {
      return properties => {
        properties.internalProperty = 'Dromedary';
        return html`<div>${properties.internalProperty}</div>`;
      };
    }
  }
  customElements.define('bad-test-element-1', BadTestElement);
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

it('cannot get unknown properties', () => {
  const el = document.createElement('test-element');
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

it('cannot get unknown properties', () => {
  const el = document.createElement('test-element');
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

it('cannot "defineProperty" on internal.', () => {
  const el = document.createElement('test-element');
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
it('cannot "delete" on internal.', () => {
  const el = document.createElement('test-element');
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

it('cannot "getOwnPropertyDescriptor" on internal.', () => {
  const el = document.createElement('test-element');
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

it('cannot "getPrototypeOf" on internal.', () => {
  const el = document.createElement('test-element');
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

it('cannot "isExtensible" on internal.', () => {
  const el = document.createElement('test-element');
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

it('cannot "preventExtensions" on internal.', () => {
  const el = document.createElement('test-element');
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

it('cannot "setPrototypeOf" on internal.', () => {
  const el = document.createElement('test-element');
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
