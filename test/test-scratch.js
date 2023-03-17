import XElement from '../x-element.js';
import { assert, it } from './x-test.js';

class TestElement extends XElement {
  static get properties() {
    return {
      // reflected with no value
      prop1: {
        type: String,
        reflect: true,
      },
      // reflected with falsy initial value (null)
      prop2: {
        type: String,
        initial: null,
        reflect: true,
      },
      // reflected with falsy initial value (undefined)
      prop3: {
        type: String,
        initial: null,
        reflect: true,
      },
      // reflected with initial value
      prop5: {
        type: String,
        initial: 'test',
        reflect: true,
      },
      // Boolean without initial value
      prop6: {
        type: Boolean,
        reflect: true,
      },
      // Boolean with `false` initial value
      prop7: {
        type: Boolean,
        initial: false,
        reflect: true,
      },
      // Boolean with `true` initial value
      prop8: {
        type: Boolean,
        initial: true,
        reflect: true,
      },
      arrayProp: {
        type: Array,
        initial: () => ['foo', 'bar'],
      },
      objProp: {
        type: Object,
        initial: () => {
          return { foo: 'bar' };
        },
      },
      objDateProp: {
        type: Date,
        initial: () => {
          return new Date();
        },
      },
      objMapProp: {
        type: Map,
        initial: () => {
          return new Map();
        },
      },
      computedProp: {
        type: String,
        input: ['prop1', 'prop2'],
        compute: this.computeComputedProp,
      },
      adopted: {
        type: Boolean,
        initial: false,
      },
    };
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'custom-observed-attribute'];
  }

  static template(html) {
    return ({ prop1 }) => {
      return html`<span>${prop1}</span>`;
    };
  }

  static computeComputedProp(prop1, prop2) {
    return `${prop1} ${prop2}`;
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

customElements.define('test-element', TestElement);


it('scratch', async () => {
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
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
  const el = document.createElement('test-element');
  assert(!el.customObservedAttributeChange);
  el.setAttribute('custom-observed-attribute', '');
  assert(el.customObservedAttributeChange);
});
