import XElement from '../x-element.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

class TestElement extends XElement {
  static get properties() {
    return {
      a: {
        type: String,
        observe: this.observeA,
      },
      b: {
        type: String,
        observe: this.observeB,
      },
      c: {
        type: String,
        input: ['a', 'b'],
        compute: this.computeC,
        observe: this.observeC,
      },
      changes: {
        type: Array,
        observe: () => {},
      },
      popped: {
        type: Boolean,
        reflect: true,
        observe: this.observePopped,
      },
      async: {
        observe: async () => {},
      },
    };
  }

  static computeC(a, b) {
    return `${a} ${b}`;
  }

  static observeA(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'a', value, oldValue });
    host.changes = changes;
  }

  static observeB(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'b', value, oldValue });
    host.changes = changes;
  }

  static observeC(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'c', value, oldValue });
    host.changes = changes;
  }

  static observePopped(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({ property: 'popped', value, oldValue });
    host.changes = changes;
  }

  static template(html) {
    return ({ changes }) => {
      return html`
        <style>
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
        </style>
        <div id="container">
          <div>Changes:</div>
          <ul>
            ${(changes || []).map(({ property, oldValue, value }) => {
              return html`
                <li>
                  <code>${property}</code>: "${oldValue}" &#x2192; "${value}"
                </li>
              `;
            })}
          </ul>
        </div>
      `;
    };
  }
}

customElements.define('test-element', TestElement);


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
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
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
