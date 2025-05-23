import { assert, it } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

class TestElement extends XElement {
  static get properties() {
    return {
      normalProperty: {
        type: String,
        initial: 'Ferus',
      },
      objectProperty: {
        type: Object,
      },
      camelCaseProperty: {
        type: String,
        initial: 'Bactrian',
      },
      numericProperty: {
        type: Number,
        default: 10,
      },
      nullProperty: {
        type: String,
        default: null,
      },
      undefinedProperty: {
        type: String,
      },
      typelessProperty: {},
      typelessPropertyWithCustomAttribute: {
        attribute: 'custom-attribute-typeless',
      },
      internalProperty: {
        internal: true,
      },
    };
  }
  static template(html) {
    return ({ normalProperty, camelCaseProperty, numericProperty, nullProperty, undefinedProperty }) => {
      return html`
        <div id="normal">${normalProperty}</div>
        <span id="camel">${camelCaseProperty}</span>
        <span id="num">${numericProperty}</span>
        <span id="nul">${nullProperty}</span>
        <span id="undef">${undefinedProperty}</span>
      `;
    };
  }
}
customElements.define('test-element', TestElement);

it('initialization', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('normal').textContent === 'Ferus');
  assert(el.shadowRoot.getElementById('camel').textContent === 'Bactrian');
  assert(el.shadowRoot.getElementById('num').textContent === '10');
  assert(el.shadowRoot.getElementById('nul').textContent === '');
});

it('renders an empty string in place of null value', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('nul').textContent === '');
});

it('renders an empty string in place of undefined value', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('undef').textContent === '');
});

it('property setter updates on next micro tick after connect', async () => {
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
  document.body.append(el);
  el.setAttribute('camel-case-property', 'Racing Camel');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === 'Racing Camel');
});

it('coerces attributes to the specified type', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  el.setAttribute('numeric-property', '-99');
  assert(el.numericProperty === -99);
});

it('allows properties without types', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  for (const value of [{}, 'foo', '5', [], 2]) {
    el.typelessProperty = value;
    assert(el.typelessProperty === value);
  }
});

it('syncs attributes to properties without types', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  const value = '123';
  el.setAttribute('typeless-property', value);
  assert(el.typelessProperty === value);
});

it('initializes from attributes on connect', () => {
  const el = document.createElement('test-element');
  el.setAttribute('camel-case-property', 'Dromedary');
  document.body.append(el);
  assert(el.camelCaseProperty === 'Dromedary');
});

it('can use "has" api or "in" operator.', () => {
  class TempTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        if (!('normalProperty' in properties) || Reflect.has(properties, 'normalProperty') === false) {
          throw new Error('The "has" trap does not work.');
        }
        return html``;
      };
    }
  }
  customElements.define('temp-test-element-1', TempTestElement);
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

it('can use "ownKeys" api.', () => {
  class TempTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        const ownKeys = Reflect.ownKeys(properties);
        if (ownKeys.length !== 1 || ownKeys[0] !== 'normalProperty') {
          throw new Error('The "ownKeys" trap does not work.');
        }
        return html``;
      };
    }
  }
  customElements.define('temp-test-element-2', TempTestElement);
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
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.normalProperty === 'Ferus', 'property was read');
  el.normalProperty = 'Dromedary';
  assert(el.normalProperty === 'Dromedary', 'property was written to');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('normal').textContent === 'Dromedary');
});

it('inheritance is considered in type checking', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  const array = [];
  el.objectProperty = array;
  assert(el.objectProperty === array, 'property was set');
});

it('numeric properties deserialize "" (empty) to "NaN"', () => {
  const el = document.createElement('test-element');
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

it('cannot set to known properties', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        properties.normalProperty = 'Dromedary';
        return html`<div>${properties.normalProperty}</div>`;
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
    const expected = 'Cannot set "BadTestElement.properties.normalProperty" via "properties".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot set to unknown properties', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        properties.doesNotExist = 'Dromedary';
        return html`<div>${properties.normalProperty}</div>`;
      };
    }
  }
  customElements.define('bad-test-element-2', BadTestElement);
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

it('cannot get unknown properties', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return ({ doesNotExist }) => {
        return html`<div>${doesNotExist}</div>`;
      };
    }
  }
  customElements.define('bad-test-element-3', BadTestElement);
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

it('cannot set on "internal"', () => {
  const el = document.createElement('test-element');
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

it('cannot "defineProperty" on properties.', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        Reflect.defineProperty(properties, 'foo', {});
        return html``;
      };
    }
  }
  customElements.define('bad-test-element-4', BadTestElement);
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

it('cannot "delete" on properties.', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        Reflect.deleteProperty(properties, 'normalProperty');
        return html``;
      };
    }
  }
  customElements.define('bad-test-element-5', BadTestElement);
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

it('cannot "getOwnPropertyDescriptor" on properties.', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        Reflect.getOwnPropertyDescriptor(properties, 'normalProperty');
        return html``;
      };
    }
  }
  customElements.define('bad-test-element-6', BadTestElement);
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

it('cannot "getPrototypeOf" on properties.', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        Reflect.getPrototypeOf(properties);
        return html``;
      };
    }
  }
  customElements.define('bad-test-element-7', BadTestElement);
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

it('cannot "isExtensible" on properties.', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        Reflect.isExtensible(properties);
        return html``;
      };
    }
  }
  customElements.define('bad-test-element-8', BadTestElement);
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

it('cannot "preventExtensions" on properties.', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        Reflect.preventExtensions(properties);
        return html``;
      };
    }
  }
  customElements.define('bad-test-element-9', BadTestElement);
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

it('cannot "setPrototypeOf" on properties.', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        normalProperty: {
          type: String,
        },
      };
    }
    static template(html) {
      return properties => {
        Reflect.setPrototypeOf(properties, Array);
        return html``;
      };
    }
  }
  customElements.define('bad-test-element-10', BadTestElement);
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
