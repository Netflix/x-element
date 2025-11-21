import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

class TestElement extends XElement {
  @property({ type: String, initial: 'Dromedary' })
  accessor #readOnlyProperty;

  @property({
    type: String,
    input: ['#readOnlyProperty'],
    compute: (readOnlyProperty) => readOnlyProperty,
  })
  accessor readOnlyProperty;

  static template(host) {
    return html`<div>${host.readOnlyProperty}</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.#readOnlyProperty = 'Ferus';
  }
}
customElements.define('test-element-next', TestElement);

it('initialization', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'Dromedary', 'initialized correctly');
  assert(el.readOnlyProperty === 'Ferus', 'correct value after connection');
});

it('re-render in connectedCallback works', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.readOnlyProperty === 'Ferus', 'correct value after connection');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'Ferus', 'correct value after re-render');
});

it('cannot be written to', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.readOnlyProperty = `don't do it`;
  } catch (error) {
    const expected = 'Property "TestElement.prototype.readOnlyProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy restrictions,
//  but decorator API uses private fields for the backing store.
it.skip('cannot be read from "internal"', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.readOnlyProperty;
  } catch (error) {
    const expected = 'Property "TestElement.properties.readOnlyProperty" is publicly available (use normal getter).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot set to known properties', () => {
  class BadTestElement extends XElement {
    @property({ type: String })
    accessor #readOnlyProperty;

    @property({
      type: String,
      input: ['#readOnlyProperty'],
      compute: (readOnlyProperty) => readOnlyProperty,
    })
    accessor readOnlyProperty;

    static template(host) {
      host.readOnlyProperty = 'Dromedary';
      return html`<div>${host.readOnlyProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.prototype.readOnlyProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
