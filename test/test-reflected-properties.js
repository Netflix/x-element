import XElement from '../x-element.js';
import { it, assert } from '../../../@netflix/x-test/x-test.js';

class TestElement extends XElement {
  static get properties() {
    return {
      camelCaseProperty: {
        type: String,
        initial: 'reflectedCamel',
        reflect: true,
      },
      overrideProperty: {
        type: String,
        initial: 'override_me',
        reflect: true,
      },
      booleanPropertyTrue: {
        type: Boolean,
        initial: true,
        reflect: true,
      },
      booleanPropertyFalse: {
        type: Boolean,
        initial: false,
        reflect: true,
      },
    };
  }
  static template(html) {
    return ({ camelCaseProperty }) => {
      return html`<span>${camelCaseProperty}</span>`;
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.overrideProperty = 'overridden';
  }
}
customElements.define('test-element', TestElement);


it('reflects initial value', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.getAttribute('camel-case-property') === 'reflectedCamel');
});

it('renders the template with the initial value', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.shadowRoot.querySelector('span').textContent === 'reflectedCamel');
});

it('reflects initial value (Boolean, true)', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-true'));
});

it('does not reflect initial value (Boolean, false)', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-false') === false);
});

it('reflects next value after a micro tick', async () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  el.camelCaseProperty = 'dromedary';
  assert(
    el.getAttribute('camel-case-property') === 'reflectedCamel' &&
      el.shadowRoot.querySelector('span').textContent === 'reflectedCamel'
  );

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.querySelector('span').textContent === 'dromedary');
});

it('has reflected override value after connected', async () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.getAttribute('override-property') === 'override_me');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.getAttribute('override-property') === 'overridden');
});

it('does not reflect next false value (Boolean)', async () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-true'));
  el.booleanPropertyTrue = false;
  assert(el.hasAttribute('boolean-property-true'));

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('boolean-property-true') === false);
  el.booleanPropertyTrue = true;
  assert(el.hasAttribute('boolean-property-true') === false);

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('boolean-property-true'));
});
