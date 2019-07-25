import './fixture-element-attr-binding.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

it('converts dash to camel case and back', () => {
  const el = document.createElement('test-element-attr-binding');
  assert(el.constructor.dashToCamelCase('foo-bar') === 'fooBar');
  assert(el.constructor.camelToDashCase('fooBar') === 'foo-bar');
});

it('renders an empty string in place of null value', () => {
  const el = document.createElement('test-element-attr-binding');
  document.body.appendChild(el);
  assert(el.shadowRoot.querySelector('#nul').textContent === '');
});

it('renders the initial value', () => {
  const el = document.createElement('test-element-attr-binding');
  document.body.appendChild(el);
  assert(el.shadowRoot.querySelector('#camel').textContent === 'Bactrian');
});

it('property setter updates on next micro tick after connect', async () => {
  const el = document.createElement('test-element-attr-binding');
  el.camelCaseProperty = 'Nonconforming';
  document.body.appendChild(el);
  assert(el.shadowRoot.querySelector('#camel').textContent === 'Nonconforming');
  el.camelCaseProperty = 'Dromedary';
  assert(el.shadowRoot.querySelector('#camel').textContent === 'Nonconforming');
  await true;
  assert(el.shadowRoot.querySelector('#camel').textContent === 'Dromedary');
});

it('property setter renders blank value', async () => {
  const el = document.createElement('test-element-attr-binding');
  document.body.appendChild(el);
  el.camelCaseProperty = '';
  await true;
  assert(el.shadowRoot.querySelector('#camel').textContent === '');
  el.camelCaseProperty = 'Bactrian';
  await true;
  assert(el.shadowRoot.querySelector('#camel').textContent === 'Bactrian');
});

it('observes all dash-cased versions of declared properties', () => {
  const el = document.createElement('test-element-attr-binding');
  const expected = [
    'camel-case-property',
    'numeric-property',
    'null-property',
    'typeless-property',
  ];
  const actual = el.constructor.observedAttributes;
  assert(expected.length === actual.length);
  assert(expected.every(attribute => actual.includes(attribute)));
});

it('removeAttribute renders blank', async () => {
  const el = document.createElement('test-element-attr-binding');
  document.body.appendChild(el);
  el.removeAttribute('camel-case-property');
  await true;
  // Note, in general, changing non-reflected properties via attributes can
  // be problematic. For example, attributeChangedCallback is not fired if the
  // attribute does not change.
  assert(el.shadowRoot.querySelector('#camel').textContent !== '');
  el.setAttribute('camel-case-property', 'foo');
  el.removeAttribute('camel-case-property');
  await true;
  assert(el.shadowRoot.querySelector('#camel').textContent === '');
});

it('setAttribute renders the new value', async () => {
  const el = document.createElement('test-element-attr-binding');
  document.body.appendChild(el);
  el.setAttribute('camel-case-property', 'Racing Camel');
  await true;
  assert(el.shadowRoot.querySelector('#camel').textContent === 'Racing Camel');
});

it('coerces attributes to the specified type', async () => {
  const el = document.createElement('test-element-attr-binding');
  document.body.appendChild(el);
  el.setAttribute('numeric-property', '-99');
  assert(el.numericProperty === -99);
});

it('allows properties without types', () => {
  const el = document.createElement('test-element-attr-binding');
  document.body.appendChild(el);
  for (const value of [{}, 'foo', '5', [], 2]) {
    el.typelessProperty = value;
    assert(el.typelessProperty === value);
  }
  const attributeValue = 'attribute';
  el.setAttribute('typeless-property', attributeValue);
  assert(el.typelessProperty === attributeValue);
});
