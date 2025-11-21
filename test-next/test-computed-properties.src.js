import { it, assert } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

let _count = 0;

class TestElement extends XElement {
  static get styles() {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`\
      #calculation {
        background-color: lightgreen;
        padding: 10px;
      }

      :host([negative]) #calculation {
        background-color: lightcoral;
      }

      :host([underline]) #calculation {
        text-decoration: underline;
      }

      :host([italic]) #calculation {
        font-style: italic;
      }
    `);
    return [styleSheet];
  }

  @property({
    type: Number,
    input: ['a', 'b'],
    compute: (a, b) => TestElement.#computeC(a, b),
  })
  accessor #c;

  @property({
    type: Number,
    input: ['#c'],
    compute: (c) => c,
  })
  accessor c;

  @property({ type: Number })
  accessor a;

  @property({ type: Number })
  accessor b;

  @property({
    type: Boolean,
    input: ['#c'],
    compute: c => c < 0,
    reflect: true,
  })
  accessor negative;

  @property({
    type: Boolean,
    input: ['negative'],
    compute: (negative) => TestElement.#computeUnderline(negative),
    reflect: true,
  })
  accessor underline;

  @property({
    type: Boolean,
    reflect: true,
  })
  accessor italic;

  @property({ type: Boolean })
  accessor y;

  @property({
    type: Boolean,
    input: ['y'],
    compute: (y) => TestElement.#computeZ(y),
  })
  accessor z;

  @property({ type: Date })
  accessor today;

  @property({
    type: Date,
    input: ['today'],
    compute: (today) => TestElement.#computeTomorrow(today),
  })
  accessor tomorrow;

  @property({})
  accessor countTrigger;

  @property({
    type: Number,
    input: ['countTrigger'],
    compute: () => TestElement.#computeCount(),
  })
  accessor count;

  static #computeC(a, b) {
    return a + b;
  }

  static #computeCount() {
    // This doesn't use an observer to prevent a coupled test.
    return ++_count;
  }

  static #computeUnderline(negative) {
    return !!negative;
  }

  static #computeZ(y) {
    return y;
  }

  static #computeTomorrow(today) {
    if (today) {
      return today.valueOf() + 1000 * 60 * 60 * 24;
    }
  }

  static template(host) {
    return html`<span id="calculation">${host.a} + ${host.b} = ${host.#c}</span>`;
  }
}
customElements.define('test-element-next', TestElement);

it('initializes as expected', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.a === undefined);
  assert(el.b === undefined);
  assert(el.y === undefined);
  assert(el.z === undefined);
  assert(el.countTrigger === undefined);
  assert(Number.isNaN(el.c));
  assert(el.negative === false);
  assert(el.underline === false);
});

it('properties are recomputed when dependencies change (a, b)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.a = 1;
  el.b = -2;
  assert(el.a === 1);
  assert(el.b === -2);
  assert(el.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);
});

it('properties are recomputed when dependencies change (y)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.y = true;
  assert(el.y === true);
  assert(el.z === true);
  el.y = false;
  assert(el.y === false);
  assert(el.z === false);
});

it('computed properties can be reflected', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.a = -1;
  el.b = 0;
  assert(el.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('negative'));
  assert(el.hasAttribute('underline'));
});

it('skips resolution when dependencies are the same', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let count = el.count;
  el.countTrigger = 'foo';
  assert(el.count === ++count);
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  assert(el.count === count);
  el.countTrigger = 'bar';
  assert(el.count === ++count);
});

it('lazily computes', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let count = el.count;
  el.countTrigger = 'foo';
  assert(el.count === ++count);
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  assert(el.count === count);
  el.countTrigger = 'bar';
  assert(el.count === ++count);
});

it('does correct NaN checking', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let count = el.count;
  el.countTrigger = NaN;
  assert(el.count === ++count);
  el.countTrigger = NaN;
  assert(el.count === count);
});

it('resets compute validity on initialization to catch upgrade edge cases with computed properties', () => {
  const el = document.createElement('test-element-next');
  el.setAttribute('a', '1');
  el.setAttribute('b', '2');
  assert(el.a === undefined);
  assert(el.b === undefined);
  assert(el.c === undefined);
  document.body.append(el);
  assert(el.a === 1);
  assert(el.b === 2);
  assert(el.c === 3);
});

it('cannot be written to from host', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.count = 0;
  } catch (error) {
    const expected = 'Property "TestElement.prototype.count" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot set to known properties', () => {
  class BadTestElement extends XElement {
    @property({
      type: String,
      input: [],
      compute: () => {},
    })
    accessor computedProperty;

    static template(host) {
      host.computedProperty = 'Dromedary';
      return html`<div>${host.computedProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.prototype.computedProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot compute a bad value', () => {
  class BadTestElement extends XElement {
    @property({
      type: String,
      input: [],
      compute: () => 0,
    })
    accessor computedProperty;

    static template(host) {
      return html`${host.computedProperty}`;
    }
  }
  customElements.define('bad-test-element-next-2', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "BadTestElement.prototype.computedProperty" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
