import { it, assert } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

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

  static get properties() {
    return {
      c: {
        type: Number,
        internal: true,
        input: ['a', 'b'],
        compute: this.computeC,
      },
      a: {
        type: Number,
      },
      b: {
        type: Number,
      },
      negative: {
        type: Boolean,
        input: ['c'],
        compute: c => c < 0,
        reflect: true,
      },
      underline: {
        type: Boolean,
        input: ['negative'],
        compute: this.computeUnderline,
        reflect: true,
      },
      italic: {
        type: Boolean,
        reflect: true,
      },
      y: {
        type: Boolean,
      },
      z: {
        type: Boolean,
        input: ['y'],
        compute: this.computeZ,
      },
      today: {
        type: Date,
      },
      tomorrow: {
        type: Date,
        input: ['today'],
        compute: this.computeTomorrow,
      },
      countTrigger: {},
      count: {
        type: Number,
        input: ['countTrigger'],
        compute: this.computeCount,
      },
    };
  }

  static computeC(a, b) {
    return a + b;
  }

  static computeCount() {
    // This doesn't use an observer to prevent a coupled test.
    return ++_count;
  }

  static computeUnderline(negative) {
    return !!negative;
  }

  static computeZ(y) {
    return y;
  }

  static computeTomorrow(today) {
    if (today) {
      return today.valueOf() + 1000 * 60 * 60 * 24;
    }
  }

  static template(html) {
    return ({ a, b, c }) => {
      return html`<span id="calculation">${a} + ${b} = ${c}</span>`;
    };
  }
}
customElements.define('test-element', TestElement);

it('initializes as expected', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.a === undefined);
  assert(el.b === undefined);
  assert(el.y === undefined);
  assert(el.z === undefined);
  assert(el.countTrigger === undefined);
  assert(Number.isNaN(el.internal.c));
  assert(el.negative === false);
  assert(el.underline === false);
});

it('properties are recomputed when dependencies change (a, b)', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  el.a = 1;
  el.b = -2;
  assert(el.a === 1);
  assert(el.b === -2);
  assert(el.internal.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);
});

it('properties are recomputed when dependencies change (y)', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  el.y = true;
  assert(el.y === true);
  assert(el.z === true);
  el.y = false;
  assert(el.y === false);
  assert(el.z === false);
});

it('computed properties can be reflected', async () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  el.a = -1;
  el.b = 0;
  assert(el.internal.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('negative'));
  assert(el.hasAttribute('underline'));
});

it('skips resolution when dependencies are the same', () => {
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
  document.body.append(el);
  let count = el.count;
  el.countTrigger = NaN;
  assert(el.count === ++count);
  el.countTrigger = NaN;
  assert(el.count === count);
});

it('resets compute validity on initialization to catch upgrade edge cases with internal, computed properties', () => {
  const el = document.createElement('test-element');
  el.setAttribute('a', '1');
  el.setAttribute('b', '2');
  assert(el.a === undefined);
  assert(el.b === undefined);
  assert(Number.isNaN(el.internal.c));
  document.body.append(el);
  assert(el.a === 1);
  assert(el.b === 2);
  assert(el.internal.c === 3);
});

it('throws when computed property is set before connection', () => {
  const el = document.createElement('test-element');
  el.count = undefined;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "TestElement.properties.count" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot be written to from host', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.count = 0;
  } catch (error) {
    const expected = 'Property "TestElement.properties.count" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot set to known properties', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        computedProperty: {
          type: String,
          input: [],
          compute: () => {},
        },
      };
    }
    static template(html) {
      return properties => {
        properties.computedProperty = 'Dromedary';
        return html`<div>${properties.computedProperty}</div>`;
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
    const expected = 'Cannot set "BadTestElement.properties.computedProperty" via "properties".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot compute a bad value', () => {
  class BadTestElement extends XElement {
    static get properties() {
      return {
        computedProperty: {
          type: String,
          input: [],
          compute: () => 0,
        },
      };
    }
    static template(html) {
      return ({ computedProperty }) => html`${computedProperty}`;
    }
  }
  customElements.define('bad-test-element-2', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "BadTestElement.properties.computedProperty" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
