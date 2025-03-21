import { assert, it } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

class TestElementBasic extends XElement {
  static get properties() {
    return {
      one: {
        type: String,
        initial: 'one',
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
        initial: (() => 'one')(),
      },
      two: {
        type: String,
        initial: () => 'two',
      },
    };
  }
  static template(html) {
    return ({ one, two }) => {
      return html`<div>${one}, ${two}</div>`;
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
    return 'two';
  }
  static getTwo() {
    return this.two;
  }
  static get properties() {
    return {
      one: {
        type: String,
        initial: this.getOne(),
      },
      two: {
        type: String,
        initial: this.getTwo,
      },
    };
  }
  static template(html) {
    return ({ one, two }) => {
      return html`<div>${one}, ${two}</div>`;
    };
  }
}
customElements.define('test-element-static', TestElementStatic);

class Compound {
  get foo() {
    return 'foo';
  }
}

class TestElementCompound extends XElement {
  static get properties() {
    return {
      compound: {
        type: Compound,
        initial: () => new Compound(),
      },
    };
  }
  static template(html) {
    return ({ compound }) => {
      return html`<div>${compound.foo}</div>`;
    };
  }
}
customElements.define('test-element-compound', TestElementCompound);

it('basic initial properties', () => {
  const el = document.createElement('test-element-basic');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic initial properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-basic');
  el.one = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic initial properties (predefined null properties)', () => {
  const el = document.createElement('test-element-basic');
  el.one = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic initial properties (predefined properties)', () => {
  const el = document.createElement('test-element-basic');
  el.one = 'ONE';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});

it('basic initial properties (predefined attributes)', () => {
  const el = document.createElement('test-element-basic');
  el.setAttribute('one', 'ONE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});

it('anonymous initial properties', () => {
  const el = document.createElement('test-element-anonymous');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous initial properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = undefined;
  el.two = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous initial properties (predefined null properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = null;
  el.two = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous initial properties (predefined properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = 'ONE';
  el.two = 'TWO';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});

it('anonymous initial properties (predefined attributes)', () => {
  const el = document.createElement('test-element-anonymous');
  el.setAttribute('one', 'ONE');
  el.setAttribute('two', 'TWO');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});

it('compound initial properties are not shared accross element instances', () => {
  const el1 = document.createElement('test-element-compound');
  const el2 = document.createElement('test-element-compound');
  document.body.append(el1, el2);
  assert(el1.shadowRoot.textContent === 'foo');
  assert(el2.shadowRoot.textContent === 'foo');
  assert(el1.compound !== el2.compound);
});

it('cannot set initial to a bad type', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return { bad: { type: String, initial: 0 } };
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
