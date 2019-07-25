import { assert, it } from '../../../@netflix/x-test/x-test.js';
import './fixture-element-scratch.js';

it('scratch', async () => {
  let errorsWhenReflectingUnserializableType = false;

  const el = document.createElement('test-element-scratch');
  const onError = evt => {
    if (
      evt.error.message ===
      `Attempted to serialize "objPropReflect" and reflect, but it is not a Boolean, String, or Number type (Object).`
    ) {
      evt.stopPropagation();
      errorsWhenReflectingUnserializableType = true;
      el.removeEventListener('error', onError);
    }
  };
  el.addEventListener('error', onError);

  document.body.appendChild(el);
  assert(
    errorsWhenReflectingUnserializableType,
    'should error on unserializable reflection'
  );

  // Attribute reflection tests
  assert(
    el.hasAttribute('prop1') === false,
    'should not reflect when initial value is unspecified'
  );

  el.prop1 = 'test';
  assert(
    el.getAttribute('prop1') === 'test',
    'should reflect when value changes from unspecified to a string'
  );

  el.prop1 = null;
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
    el.getAttribute('prop4') === 'false',
    'should reflect when initial value is false'
  );

  assert(
    el.getAttribute('prop5') === 'test',
    'should reflect when initial value is a String'
  );

  // Boolean attribute reflection tests
  assert(el.hasAttribute('prop6') === false, 'reflect boolean');
  el.prop6 = 1;
  assert(el.prop6 === true, 'boolean coerced');
  assert(
    el.hasAttribute('prop7') === false,
    'should not reflect when initial value is false'
  );

  assert(
    el.getAttribute('prop8') === '',
    'should reflect when initial value is true'
  );

  assert(
    el.getAttribute('prop9') === '',
    'should reflect when initial value is truthy'
  );

  assert(
    el.hasAttribute('prop10') === false,
    'should not reflect when initial value is falsy'
  );

  // Async data binding
  el.prop1 = null;
  await el;
  assert(
    el.shadowRoot.querySelector('span').textContent === '',
    'should update the DOM bindings'
  );
  el.prop1 = 'test2';
  await el;
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
  document.body.appendChild(el);
});
