import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

class TestElement extends XElement {
  @property({ type: String, initial: 'reflectedCamel', reflect: true })
  accessor camelCaseProperty;

  @property({ type: String, initial: 'override_me', reflect: true })
  accessor overrideProperty;

  @property({ type: Boolean, initial: true, reflect: true })
  accessor booleanPropertyTrue;

  @property({ type: Boolean, initial: false, reflect: true })
  accessor booleanPropertyFalse;

  static template(host) {
    return html`<span>${host.camelCaseProperty}</span>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.overrideProperty = 'overridden';
  }
}
customElements.define('test-element-next', TestElement);


it('reflects initial value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.getAttribute('camel-case-property') === 'reflectedCamel');
});

it('renders the template with the initial value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.querySelector('span').textContent === 'reflectedCamel');
});

it('reflects initial value (Boolean, true)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-true'));
});

it('does not reflect initial value (Boolean, false)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-false') === false);
});

it('reflects next value after a micro tick', async () => {
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.getAttribute('override-property') === 'override_me');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.getAttribute('override-property') === 'overridden');
});

it('does not reflect next false value (Boolean)', async () => {
  const el = document.createElement('test-element-next');
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
