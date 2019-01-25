import { suite, it } from './runner.js';
import './fixture-element-scratch.js';

suite('scratch', async ctx => {
  document.onerror = evt => {
    console.error(evt.error);
  };

  const el = document.createElement('test-element-scratch');
  ctx.body.appendChild(el);

  // Attribute reflection tests
  it(
    'should not reflect when initial value is unspecified',
    el.hasAttribute('prop1') === false
  );
  el.prop1 = 'test';
  it(
    'should reflect when value changes from unspecified to a string',
    el.getAttribute('prop1') === 'test'
  );
  el.prop1 = null;
  it(
    'should not reflect when value changes from a string to null',
    el.hasAttribute('prop1') === false
  );

  it(
    'should not reflect when initial value is falsy (null)',
    el.hasAttribute('prop2') === false
  );
  it(
    'should not reflect when initial value is falsy (undefined)',
    el.hasAttribute('prop3') === false
  );
  it(
    'should reflect when initial value is false',
    el.getAttribute('prop4') === 'false'
  );
  it(
    'should reflect when initial value is a String',
    el.getAttribute('prop5') === 'test'
  );

  // Boolean attribute reflection tests
  it('reflect boolean', el.hasAttribute('prop6') === false);
  el.prop6 = 1;
  it('boolean coerced', el.prop6 === true);
  it(
    'should not reflect when initial value is false',
    el.hasAttribute('prop7') === false
  );
  it(
    'should reflect when initial value is true',
    el.getAttribute('prop8') === ''
  );
  it(
    'should reflect when initial value is truthy',
    el.getAttribute('prop9') === ''
  );
  it(
    'should not reflect when initial value is falsy',
    el.hasAttribute('prop10') === false
  );

  // Async data binding
  el.prop1 = null;
  await el;
  it(
    'should update the DOM bindings',
    el.shadowRoot.querySelector('span').textContent === ''
  );
  el.prop1 = 'test2';
  await el;
  it(
    'should update the DOM bindings again',
    el.shadowRoot.querySelector('span').textContent === 'test2'
  );

  // complex properties
  it(
    'should allow Array types',
    Array.isArray(el.arrayProp) && el.arrayProp[0] === 'foo'
  );
  it('should allow Object types', el.objProp.foo === 'bar');

  it('should allow Date types', el.objDateProp.getFullYear() > 2017);

  it('should allow Map types', el.objMapProp.has('foo') === false);

  // lifecycle
  ctx.body.removeChild(el);
  ctx.body.appendChild(el);
});
