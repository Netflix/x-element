import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

class TestElementBasic extends XElement {
  @property({ type: String, initial: 'one' })
  accessor one;

  static template(host) {
    return html`<div>${host.one}</div>`;
  }
}
customElements.define('test-element-basic-next', TestElementBasic);

class TestElementAnonymous extends XElement {
  @property({ type: String, initial: (() => 'one')() })
  accessor one;

  @property({ type: String, initial: () => 'two' })
  accessor two;

  static template(host) {
    return html`<div>${host.one}, ${host.two}</div>`;
  }
}
customElements.define('test-element-anonymous-next', TestElementAnonymous);

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

  @property({ type: String, initial: () => TestElementStatic.getOne() })
  accessor one;

  @property({ type: String, initial: () => TestElementStatic.getTwo() })
  accessor two;

  static template(host) {
    return html`<div>${host.one}, ${host.two}</div>`;
  }
}
customElements.define('test-element-static-next', TestElementStatic);

class Compound {
  get foo() {
    return 'foo';
  }
}

class TestElementCompound extends XElement {
  @property({ type: Compound, initial: () => new Compound() })
  accessor compound;

  static template(host) {
    return html`<div>${host.compound.foo}</div>`;
  }
}
customElements.define('test-element-compound-next', TestElementCompound);

it('basic initial properties', () => {
  const el = document.createElement('test-element-basic-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic initial properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic initial properties (predefined null properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});

it('basic initial properties (predefined properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = 'ONE';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});

it('basic initial properties (predefined attributes)', () => {
  const el = document.createElement('test-element-basic-next');
  el.setAttribute('one', 'ONE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});

it('anonymous initial properties', () => {
  const el = document.createElement('test-element-anonymous-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous initial properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = undefined;
  el.two = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous initial properties (predefined null properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = null;
  el.two = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});

it('anonymous initial properties (predefined properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = 'ONE';
  el.two = 'TWO';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});

it('anonymous initial properties (predefined attributes)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.setAttribute('one', 'ONE');
  el.setAttribute('two', 'TWO');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});

it('compound initial properties are not shared accross element instances', () => {
  const el1 = document.createElement('test-element-compound-next');
  const el2 = document.createElement('test-element-compound-next');
  document.body.append(el1, el2);
  assert(el1.shadowRoot.textContent === 'foo');
  assert(el2.shadowRoot.textContent === 'foo');
  assert(el1.compound !== el2.compound);
});

it('cannot set initial to a bad type', () => {
  class BadTestElement extends XElement {
    @property({ type: String, initial: 0 })
    accessor bad;
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "BadTestElement.prototype.bad" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
