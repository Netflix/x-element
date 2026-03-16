import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

class TestElement extends XElement {
  static get styles() {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`\
      :host #container {
        transition-property: box-shadow;
        transition-duration: 300ms;
        transition-timing-function: linear;
        box-shadow: 0 0 0 1px black;
        padding: 10px;
      }

      :host([popped]) #container {
        box-shadow: 0 0 10px 0 black;
      }
    `);
    return [styleSheet];
  }

  @property({
    type: String,
    observe: (host, value, oldValue) => TestElement.#observeA(host, value, oldValue),
  })
  accessor a;

  @property({
    type: String,
    observe: (host, value, oldValue) => TestElement.#observeB(host, value, oldValue),
  })
  accessor b;

  @property({
    type: String,
    input: ['a', 'b'],
    compute: (a, b) => TestElement.#computeC(a, b),
    observe: (host, value, oldValue) => TestElement.#observeC(host, value, oldValue),
  })
  accessor c;

  @property({
    type: Array,
    observe: () => {},
  })
  accessor changes;

  @property({
    type: Boolean,
    reflect: true,
    observe: (host, value, oldValue) => TestElement.#observePopped(host, value, oldValue),
  })
  accessor popped;

  @property({
    observe: async () => {},
  })
  accessor async;

  static #computeC(a, b) {
    return `${a} ${b}`;
  }

  static #observeA(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'a', value, oldValue });
    host.changes = changes;
  }

  static #observeB(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'b', value, oldValue });
    host.changes = changes;
  }

  static #observeC(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'c', value, oldValue });
    host.changes = changes;
  }

  static #observePopped(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'popped', value, oldValue });
    host.changes = changes;
  }

  static template(host) {
    return html`
      <div id="container">
        <div>Changes:</div>
        <ul>
          ${(host.changes || []).map((change => {
            return html`
              <li>
                <code>${change.property}</code>: "${change.oldValue}" &#x2192; "${change.value}"
              </li>
            `;
          }))}
        </ul>
      </div>
    `;
  }
}

customElements.define('test-element-next', TestElement);


const isObject = obj => obj instanceof Object && obj !== null;
const deepEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  return (
    isObject(a) &&
    isObject(b) &&
    // Note, we ignore non-enumerable properties (Symbols) here.
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every(key => deepEqual(a[key], b[key]))
  );
};

it('initialized as expected', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(
    deepEqual(el.changes, [
      { property: 'c', value: 'undefined undefined', oldValue: undefined },
    ]),
    'initialized as expected'
  );
  document.body.removeChild(el);
});

it('x-element observed properties', async () => {
  const el = document.createElement('test-element-next');
  el.a = '11';
  el.b = '22';
  document.body.append(el);

  assert(
    deepEqual(el.changes, [
      { property: 'a', value: '11', oldValue: undefined },
      { property: 'b', value: '22', oldValue: undefined },
      { property: 'c', value: '11 22', oldValue: undefined },
    ]),
    'initialized as expected'
  );

  el.b = 'hey';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(
    deepEqual(el.changes, [
      { property: 'a', value: '11', oldValue: undefined },
      { property: 'b', value: '22', oldValue: undefined },
      { property: 'c', value: '11 22', oldValue: undefined },
      { property: 'c', value: '11 hey', oldValue: '11 22' },
      { property: 'b', value: 'hey', oldValue: '22' },
    ]),
    'observe callbacks are called when properties change'
  );

  el.b = 'hey';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(
    deepEqual(el.changes, [
      { property: 'a', value: '11', oldValue: undefined },
      { property: 'b', value: '22', oldValue: undefined },
      { property: 'c', value: '11 22', oldValue: undefined },
      { property: 'c', value: '11 hey', oldValue: '11 22' },
      { property: 'b', value: 'hey', oldValue: '22' },
    ]),
    'observe callbacks are not called when set property is the same'
  );

  el.popped = true;

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  el.setAttribute('popped', 'still technically true');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(
    deepEqual(el.changes, [
      { property: 'a', value: '11', oldValue: undefined },
      { property: 'b', value: '22', oldValue: undefined },
      { property: 'c', value: '11 22', oldValue: undefined },
      { property: 'c', value: '11 hey', oldValue: '11 22' },
      { property: 'b', value: 'hey', oldValue: '22' },
      { property: 'popped', value: true, oldValue: undefined },
    ]),
    'no re-entrance for observed, reflected properties'
  );
});

it('child properties are bound before initialization', () => {
  const observations = [];
  class TestInner extends XElement {
    @property({
      type: Boolean,
      observe: (host, value) => observations.push(value),
      default: false,
    })
    accessor foo;
  }
  customElements.define('test-inner-next', TestInner);
  class TestOuter extends XElement {
    @property({
      type: Boolean,
      default: true,
    })
    accessor foo;

    static template(host) {
      return html`<test-inner-next .foo="${host.foo}"></test-inner-next>`;
    }
  }
  customElements.define('test-outer-next', TestOuter);
  const el = document.createElement('test-outer-next');
  document.body.append(el);
  assert(observations[0] === true, observations[0]);
  assert(observations.length === 1, observations);
  el.remove();
});
