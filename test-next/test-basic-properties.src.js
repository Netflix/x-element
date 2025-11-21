import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

class TestElementNext extends XElement {
  @property({ type: String, initial: 'Ferus' })
  accessor normalProperty;

  @property({ type: Object })
  accessor objectProperty;

  @property({ type: String, initial: 'Bactrian' })
  accessor camelCaseProperty;

  @property({ type: Number, default: 10 })
  accessor numericProperty;

  @property({ type: String, default: null })
  accessor nullProperty;

  @property({ type: String })
  accessor undefinedProperty;

  @property({})
  accessor typelessProperty;

  @property({ attribute: 'custom-attribute-typeless' })
  accessor typelessPropertyWithCustomAttribute;

  @property({})
  accessor #internalProperty;

  static template(host) {
    return html`
      <div id="normal">${host.normalProperty}</div>
      <span id="camel">${host.camelCaseProperty}</span>
      <span id="num">${host.numericProperty}</span>
      <span id="nul">${host.nullProperty}</span>
      <span id="undef">${host.undefinedProperty}</span>
    `;
  }
}
customElements.define('test-element-next', TestElementNext);

it('initialization', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('normal').textContent === 'Ferus');
  assert(el.shadowRoot.getElementById('camel').textContent === 'Bactrian');
  assert(el.shadowRoot.getElementById('num').textContent === '10');
  assert(el.shadowRoot.getElementById('nul').textContent === '');
});

it('renders an empty string in place of null value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('nul').textContent === '');
});

it('renders an empty string in place of undefined value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('undef').textContent === '');
});

it('property setter updates on next micro tick after connect', async () => {
  const el = document.createElement('test-element-next');
  el.camelCaseProperty = 'Nonconforming';

  // Initial render happens synchronously after initial connection.
  document.body.append(el);
  assert(el.shadowRoot.getElementById('camel').textContent === 'Nonconforming');

  // Updates are debounced on a microtask, so they are not immediately seen.
  el.camelCaseProperty = 'Dromedary';
  assert(el.shadowRoot.getElementById('camel').textContent === 'Nonconforming');

  // After the microtask runs, the update is handled.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === 'Dromedary');
});

it('property setter renders blank value', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.camelCaseProperty = '';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === '');
  el.camelCaseProperty = 'Bactrian';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === 'Bactrian');
});

it('observes all dash-cased versions of public, typeless, serializable, and declared properties', () => {
  const el = document.createElement('test-element-next');
  const expected = [
    'normal-property',
    'camel-case-property',
    'numeric-property',
    'null-property',
    'undefined-property',
    'typeless-property',
    'custom-attribute-typeless',
  ];
  const actual = el.constructor.observedAttributes;
  assert(expected.length === actual.length);
  assert(expected.every(attribute => actual.includes(attribute)));
});

it('removeAttribute renders blank', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.removeAttribute('camel-case-property');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  // Note, in general, changing non-reflected properties via attributes can
  // be problematic. For example, attributeChangedCallback is not fired if the
  // attribute does not change.
  assert(el.shadowRoot.getElementById('camel').textContent !== '');
  el.setAttribute('camel-case-property', 'foo');
  el.removeAttribute('camel-case-property');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === '');
});

it('setAttribute renders the new value', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.setAttribute('camel-case-property', 'Racing Camel');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === 'Racing Camel');
});

it('coerces attributes to the specified type', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.setAttribute('numeric-property', '-99');
  assert(el.numericProperty === -99);
});

it('allows properties without types', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  for (const value of [{}, 'foo', '5', [], 2]) {
    el.typelessProperty = value;
    assert(el.typelessProperty === value);
  }
});

it('syncs attributes to properties without types', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  const value = '123';
  el.setAttribute('typeless-property', value);
  assert(el.typelessProperty === value);
});

it('initializes from attributes on connect', () => {
  const el = document.createElement('test-element-next');
  el.setAttribute('camel-case-property', 'Dromedary');
  document.body.append(el);
  assert(el.camelCaseProperty === 'Dromedary');
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it('can use "has" api or "in" operator.', () => {
  class TempTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      if (!('normalProperty' in host) || Reflect.has(host, 'normalProperty') === false) {
        throw new Error('The "has" trap does not work.');
      }
      return html``;
    }
  }
  customElements.define('temp-test-element-next-1', TempTestElement);
  const el = new TempTestElement();
  let passed = false;
  let message;
  try {
    el.connectedCallback();
    passed = true;
  } catch (error) {
    message = error.message;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, ownKeys doesn’t
//  work because properties are simply on the `host.prototype`.
it.skip('can use "ownKeys" api.', () => {
  class TempTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      const ownKeys = Reflect.ownKeys(host);
      if (ownKeys.length !== 1 || ownKeys[0] !== 'normalProperty') {
        throw new Error('The "ownKeys" trap does not work.');
      }
      return html``;
    }
  }
  customElements.define('temp-test-element-next-2', TempTestElement);
  const el = new TempTestElement();
  let passed = false;
  let message;
  try {
    el.connectedCallback();
    passed = true;
  } catch (error) {
    message = error.message;
  }
  assert(passed, message);
});

it('can be read', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.normalProperty === 'Ferus', 'property was read');
  el.normalProperty = 'Dromedary';
  assert(el.normalProperty === 'Dromedary', 'property was written to');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('normal').textContent === 'Dromedary');
});

it('inheritance is considered in type checking', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  const array = [];
  el.objectProperty = array;
  assert(el.objectProperty === array, 'property was set');
});

it('numeric properties deserialize "" (empty) to "NaN"', () => {
  const el = document.createElement('test-element-next');
  el.setAttribute('numeric-property', '0');
  document.body.append(el);
  assert(el.numericProperty === 0, '"0" was coerced to 0');
  el.setAttribute('numeric-property', '');
  assert(Number.isNaN(el.numericProperty), '"" was coerced to NaN');
  el.setAttribute('numeric-property', ' ');
  assert(Number.isNaN(el.numericProperty), '" " was coerced to NaN');
  el.setAttribute('numeric-property', '      ');
  assert(Number.isNaN(el.numericProperty), '"      " was coerced to NaN');
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, we expect our
//  users to be experts and not update properties in the render loop.
it.skip('cannot set to known properties', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      host.normalProperty = 'Dromedary';
      return html`<div>${host.normalProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Cannot set "BadTestElement.properties.normalProperty" via "properties".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, we expect our
//  users to be experts and not update properties in the render loop.
it.skip('cannot set to unknown properties', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      host.doesNotExist = 'Dromedary';
      return html`<div>${host.normalProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-2', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, we expect our
//  users to be experts and not pull objects which don’t exist (or understand
//  that it doesn’t exist if it is returning “undefined”).
it.skip('cannot get unknown properties', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      return html`<div>${host.doesNotExist}</div>`;
    }
  }
  customElements.define('bad-test-element-next-3', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test internal proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot set on "internal"', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.normalProperty = 'Dromedary';
  } catch (error) {
    const expected = 'Property "TestElement.properties.normalProperty" is publicly available (use normal setter).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. You can of course define a
//  new property on an instance like this. This would work even if it was truly
//  shadowing an accessor that already exists.
it.skip('cannot "defineProperty" on properties.', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      Reflect.defineProperty(host, 'foo', {});
      return html``;
    }
  }
  customElements.define('bad-test-element-next-4', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. You can of course call delete
//  on an instance like this — but, this doesn’t break the accessors in any way.
it.skip('cannot "delete" on properties.', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      Reflect.deleteProperty(host, 'normalProperty');
      return html``;
    }
  }
  customElements.define('bad-test-element-next-5', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "getOwnPropertyDescriptor" on properties.', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      Reflect.getOwnPropertyDescriptor(host, 'normalProperty');
      return html``;
    }
  }
  customElements.define('bad-test-element-next-6', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "getPrototypeOf" on properties.', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      Reflect.getPrototypeOf(host);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-7', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "isExtensible" on properties.', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      Reflect.isExtensible(host);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-8', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "preventExtensions" on properties.', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      Reflect.preventExtensions(host);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-9', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "setPrototypeOf" on properties.', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor normalProperty;

    static template(host) {
      Reflect.setPrototypeOf(host, Array);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-10', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
