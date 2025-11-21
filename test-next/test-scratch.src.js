import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

// TODO: #346: Scratch tests are general integration tests. Updated to use
//  decorator syntax for properties.
class TestElement extends XElement {
  // reflected with no value
  @property({
    type: String,
    reflect: true,
  })
  accessor prop1;

  // reflected with falsy initial value (null)
  @property({
    type: String,
    initial: null,
    reflect: true,
  })
  accessor prop2;

  // reflected with falsy initial value (undefined)
  @property({
    type: String,
    initial: null,
    reflect: true,
  })
  accessor prop3;

  // reflected with initial value
  @property({
    type: String,
    initial: 'test',
    reflect: true,
  })
  accessor prop5;

  // Boolean without initial value
  @property({
    type: Boolean,
    reflect: true,
  })
  accessor prop6;

  // Boolean with `false` initial value
  @property({
    type: Boolean,
    initial: false,
    reflect: true,
  })
  accessor prop7;

  // Boolean with `true` initial value
  @property({
    type: Boolean,
    initial: true,
    reflect: true,
  })
  accessor prop8;

  @property({
    type: Array,
    initial: () => ['foo', 'bar'],
  })
  accessor arrayProp;

  @property({
    type: Object,
    initial: () => {
      return { foo: 'bar' };
    },
  })
  accessor objProp;

  @property({
    type: Date,
    initial: () => {
      return new Date();
    },
  })
  accessor objDateProp;

  @property({
    type: Map,
    initial: () => {
      return new Map();
    },
  })
  accessor objMapProp;

  @property({
    type: String,
    input: ['prop1', 'prop2'],
    compute: (prop1, prop2) => `${prop1} ${prop2}`,
  })
  accessor computedProp;

  @property({
    type: Boolean,
    initial: false,
  })
  accessor adopted;

  static get observedAttributes() {
    return [...super.observedAttributes, 'custom-observed-attribute'];
  }

  static template(host) {
    return html`<span>${host.prop1}</span>`;
  }

  attributeChangedCallback(attribute, oldValue, value) {
    super.attributeChangedCallback(attribute, oldValue, value);
    if (attribute === 'custom-observed-attribute') {
      this.customObservedAttributeChange = true;
    }
  }

  adoptedCallback() {
    super.adoptedCallback();
    this.adopted = true;
  }
}

customElements.define('test-element-scratch', TestElement);


it('scratch', async () => {
  const el = document.createElement('test-element-scratch');
  document.body.append(el);

  // Attribute reflection tests
  assert(
    el.hasAttribute('prop1') === false,
    'should not reflect when initial value is unspecified'
  );

  el.prop1 = 'test';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(
    el.getAttribute('prop1') === 'test',
    'should reflect when value changes from unspecified to a string'
  );

  el.prop1 = null;

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(
    el.hasAttribute('prop1') === false,
    'should not reflect when value changes from a string to null'
  );

  assert(
    el.hasAttribute('prop2') === false,
    'should not reflect when initial value is falsy (null)'
  );

  assert(
    el.hasAttribute('prop3') === false,
    'should not reflect when initial value is falsy (undefined)'
  );

  assert(
    el.getAttribute('prop5') === 'test',
    'should reflect when initial value is a String'
  );

  // Boolean attribute reflection tests
  assert(el.hasAttribute('prop6') === false, 'reflect boolean');

  assert(
    el.hasAttribute('prop7') === false,
    'should not reflect when initial value is false'
  );

  assert(
    el.getAttribute('prop8') === '',
    'should reflect when initial value is true'
  );

  // Async data binding
  el.prop1 = null;

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(
    el.shadowRoot.querySelector('span').textContent === '',
    'should update the DOM bindings'
  );
  el.prop1 = 'test2';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(
    el.shadowRoot.querySelector('span').textContent === 'test2',
    'should update the DOM bindings again'
  );

  // complex properties
  assert(
    Array.isArray(el.arrayProp) && el.arrayProp[0] === 'foo',
    'should allow Array types'
  );
  assert(el.objProp.foo === 'bar', 'should allow Object types');

  assert(el.objDateProp.getFullYear() > 2017, 'should allow Date types');

  assert(el.objMapProp.has('foo') === false, 'should allow Map types');

  // lifecycle
  document.body.removeChild(el);
  document.body.append(el);
});

it('test dispatchError', () => {
  const el = document.createElement('test-element-scratch');
  const error = new Error('Foo');
  let passed = false;
  const onError = event => {
    if (
      event.error === error &&
      event.message === error.message &&
      event.bubbles === true &&
      event.composed === true
    ) {
      passed = true;
    }
  };
  el.addEventListener('error', onError);
  el.dispatchError(error);
  el.removeEventListener('error', onError);
  assert(passed);
});

// TODO: Firefox somehow returns an un-upgraded instance after adoption. This
//  seems like a bug in the browser, but we should look into it.
(navigator.userAgent.includes('Firefox') ? it.skip : it)('test adoptedCallback', () => {
  const el = document.createElement('test-element-scratch');
  el.prop1 = 'adopt me!';
  document.body.append(el);
  assert(el.adopted === false);
  const iframe = document.createElement('iframe');
  iframe.src = 'about:blank';
  iframe.style.height = '10vh';
  iframe.style.width = '10vw';
  document.body.append(iframe);
  iframe.ownerDocument.adoptNode(el);
  iframe.contentDocument.body.append(el);
  assert(el.adopted);
});

it('authors can extend observed attributes', () => {
  const el = document.createElement('test-element-scratch');
  assert(!el.customObservedAttributeChange);
  el.setAttribute('custom-observed-attribute', '');
  assert(el.customObservedAttributeChange);
});

it('throws error when getting property on prototype', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    TestElement.prototype.prop1;
  } catch (error) {
    const expected = 'Cannot access property "prop1" on prototype.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws error when setting property on prototype', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    TestElement.prototype.prop1 = 'value';
  } catch (error) {
    const expected = 'Cannot set property "prop1" on prototype.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
