import { assert, it } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

class TestElement extends XElement {
  static get properties() {
    return {
      readOnlyProperty: {
        type: String,
        readOnly: true,
        initial: 'Dromedary',
      },
    };
  }
  static template(html) {
    return ({ readOnlyProperty }) => {
      return html`<div>${readOnlyProperty}</div>`;
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.internal.readOnlyProperty = 'Ferus';
  }
}
customElements.define('test-element', TestElement);

it('initialization', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'Dromedary', 'initialized correctly');
  assert(el.readOnlyProperty === 'Ferus', 'correct value after connection');
});

it('re-render in connectedCallback works', async () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.readOnlyProperty === 'Ferus', 'correct value after connection');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'Ferus', 'correct value after re-render');
});

it('cannot be written to', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.readOnlyProperty = `don't do it`;
  } catch (error) {
    const expected = 'Property "TestElement.properties.readOnlyProperty" is read-only.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('cannot be read from "internal"', () => {
  const el = document.createElement('test-element');
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
    static get properties() {
      return {
        readOnlyProperty: {
          type: String,
          readOnly: true,
        },
      };
    }
    static template(html) {
      return properties => {
        properties.readOnlyProperty = 'Dromedary';
        return html`<div>${properties.readOnlyProperty}</div>`;
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
    const expected = 'Cannot set "BadTestElement.properties.readOnlyProperty" via "properties".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

