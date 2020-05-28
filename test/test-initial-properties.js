import XElement from '../x-element.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

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
      three: {
        type: String,
        initial: () => () => 'three',
      },
    };
  }
  static template(html) {
    return ({ one, two, three }) => {
      return html`<div>${one}, ${two}, ${three}</div>`;
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
  static get three() {
    return 'three';
  }
  static getThree() {
    return this.three;
  }
  static getThreeWrapper() {
    return this.getThree;
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
      wrappedFunctionInitial: {
        type: String,
        initial: this.getThree,
      },
    };
  }
  static template(html) {
    return ({ one, two, three }) => {
      return html`<div>${one}, ${two}, ${three}</div>`;
    };
  }
}
customElements.define('test-element-static', TestElementStatic);

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
  assert(el.shadowRoot.textContent === 'one, two, three');
});

it('anonymous initial properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = undefined;
  el.two = undefined;
  el.three = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two, three');
});

it('anonymous initial properties (predefined null properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = null;
  el.two = null;
  el.three = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two, three');
});

it('anonymous initial properties (predefined properties)', () => {
  const el = document.createElement('test-element-anonymous');
  el.one = 'ONE';
  el.two = 'TWO';
  el.three = 'THREE';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO, THREE');
});

it('anonymous initial properties (predefined attributes)', () => {
  const el = document.createElement('test-element-anonymous');
  el.setAttribute('one', 'ONE');
  el.setAttribute('two', 'TWO');
  el.setAttribute('three', 'THREE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO, THREE');
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
