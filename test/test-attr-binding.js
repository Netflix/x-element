import { suite, it } from './runner.js';
import './fixture-element-attr-binding.js';

suite('x-element property (unit)', ctx => {
  const el = document.createElement('test-element-attr-binding');
  it(
    'converts dash to camel case',
    el.constructor.dashToCamelCase('foo-bar') === 'fooBar'
  );

  it(
    'converts camel to dash case',
    el.constructor.camelToDashCase('fooBar') === 'foo-bar'
  );
});

suite('x-element property binding', async ctx => {
  const el = document.createElement('test-element-attr-binding');
  ctx.body.appendChild(el);

  await el;
  it(
    'renders an empty string in place of null value',
    el.shadowRoot.querySelector('#nul').textContent === ''
  );

  it(
    'renders the initial value',
    el.shadowRoot.querySelector('#camel').textContent === 'Bactrian'
  );

  el.camelCaseProperty = 'Dromedary';
  await el;
  it(
    'renders new value',
    el.shadowRoot.querySelector('#camel').textContent === 'Dromedary'
  );

  el.camelCaseProperty = '';
  await el;
  it(
    'renders blank value',
    el.shadowRoot.querySelector('#camel').textContent === ''
  );

  el.camelCaseProperty = 'Bactrian';
  await el;
  it(
    'renders new value',
    el.shadowRoot.querySelector('#camel').textContent === 'Bactrian'
  );
});

suite('x-element attribute binding (2)', async ctx => {
  const el = document.createElement('test-element-attr-binding');
  ctx.body.appendChild(el);

  await el;
  it(
    'renders the initial value',
    el.shadowRoot.querySelector('#camel').textContent === 'Bactrian'
  );

  el.setAttribute('camel-case-property', 'Racing Camel');
  await el;
  it(
    'renders the attr value',
    el.shadowRoot.querySelector('#camel').textContent === 'Racing Camel'
  );

  el.removeAttribute('camel-case-property');
  await el;
  it(
    'renders blank on attribute removal',
    el.shadowRoot.querySelector('#camel').textContent === ''
  );

  el.setAttribute('camel-case-property', 'Bactrian');
  await el;
  it(
    'renders the attr value',
    el.shadowRoot.querySelector('#camel').textContent === 'Bactrian'
  );
});

suite('x-element attribute binding (3)', async ctx => {
  const el = document.createElement('test-element-attr-binding');
  ctx.body.appendChild(el);

  await el;
  it(
    'renders the initial value',
    el.shadowRoot.querySelector('#num').textContent === '10'
  );
  it('has a numeric type', el.numericProperty === 10);
});
