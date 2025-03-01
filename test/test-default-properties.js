import { assert, it } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

class TestElementBasic extends XElement {
  static get properties() {
    return {
      one: {
        type: String,
        default: 'one',
      },
    };
  }
  static template(html) {
    return ({ one }) => {
      return html`<div>${one}</div>`;
    };
  }
}
customElements.define('test-element-basic', TestElementBasic);

class TestElementAnonymous extends XElement {
  static get properties() {
    return {
      one: {
        type: String,
        default: (() => 'one')(),
      },
      two: {
        type: Object,
        default: () => ({ two: 'two' }),
      },
    };
  }
  static template(html) {
    return ({ one, two }) => {
      return html`<div>${one}, ${two.two}</div>`;
    };
  }
}
customElements.define('test-element-anonymous', TestElementAnonymous);

class TestElementStatic extends XElement {
  static get one() {
    return 'one';
  }
  static getOne() {
    return this.one;
  }
  static get two() {
    return { two: 'two' };
  }
  static getTwo() {
    return this.two;
  }
  static get properties() {
    return {
      one: {
        type: String,
        default: this.getOne(),
      },
      two: {
        type: Object,
        default: this.getTwo,
      },
    };
  }
  static template(html) {
    return ({ one, two }) => {
      return html`<div>${one}, ${two.two}</div>`;
    };
  }
}
customElements.define('test-element-static', TestElementStatic);

class TestElementEdge extends XElement {
  static get properties() {
    return {
      one: {
        type: String,
        initial: undefined,
        default: 'one',
      },
      two: {
        type: Object,
        initial: null,
        default: () => ({ two: 'two' }),
      },
      three: {
        type: String,
        input: [],
        compute: () => {},
        default: 'three',
      },
    };
  }
  static template(html) {
    return ({ one, two, three }) => {
      return html`<div>${one}, ${two.two}, ${three}</div>`;
    };
  }
}
customElements.define('test-element-edge', TestElementEdge);

it('basic default properties', async () => {
  const el = document.createElement('test-element-basic');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');

  // Test that we can override the default.
  el.one = 'ONE';
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'ONE');

  // Test that we get our default back via undefined.
  el.one = undefined;
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one');

  // Override again...
  el.one = 'ONE';
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'ONE');

  // Test that we get our default back via null.
  el.one = null;
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one');
});

it('basic default properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-basic');
  el.one = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic default properties (predefined null properties)', () => {
  const el = document.createElement('test-element-basic');
  el.one = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic default properties (predefined properties)', () => {
  const el = document.createElement('test-element-basic');
  el.one = 'ONE';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});

it('basic default properties (predefined attributes)', () => {
  const el = document.createElement('test-element-basic');
  el.setAttribute('one', 'ONE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});

it('anonymous default properties', () => {
  const el = document.createElement('test-element-anonymous');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous default properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = undefined;
  el.two = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous default properties (predefined null properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = null;
  el.two = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous default properties (predefined properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = 'ONE';
  el.two = { two: 'TWO' };
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});

it('anonymous default properties (predefined attributes)', () => {
  const el = document.createElement('test-element-anonymous');
  el.setAttribute('one', 'ONE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, two');
});

it('initial + default & computed + default properties', () => {
  const el = document.createElement('test-element-edge');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two, three');
});

it('default values from functions are unique per instance', () => {
  const el1 = document.createElement('test-element-edge');
  const el2 = document.createElement('test-element-edge');
  document.body.append(el1, el2);
  assert(el1.shadowRoot.textContent === 'one, two, three');
  assert(el2.shadowRoot.textContent === 'one, two, three');
  assert(el1.two !== el2.two);
});

it('default values from functions persist per instance', async () => {
  const el = document.createElement('test-element-edge');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two, three');
  const defaultTwo = el.two;
  el.two = { two: 'TWO' };
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one, TWO, three');
  assert(el.two !== defaultTwo);
  el.two = undefined;
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one, two, three');
  assert(el.two === defaultTwo);
});

it('cannot set default to a bad type', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return { bad: { type: String, default: 0 } };
    }
  }
  customElements.define('bad-test-element-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "BadTestElement.properties.bad" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
