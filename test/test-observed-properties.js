import { assert, it } from '../../../@netflix/x-test/x-test.js';
import './fixture-element-observed-properties.js';

const isObject = obj => obj instanceof Object && obj !== null;
const deepEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  return (
    isObject(a) &&
    isObject(b) &&
    // Note, we ignore non-enumerable properties (Symbols) here.
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every(key => deepEqual(a[key], b[key]))
  );
};

it('throws expected errors', () => {
  const unresolvedMessage = `Cannot resolve methodName "thisDNE".`;

  let unresolved = false;

  const el = document.createElement('test-element-observed-properties-errors');

  const onError = evt => {
    if (evt.error.message === unresolvedMessage) {
      evt.stopPropagation();
      unresolved = true;
      el.removeEventListener('error', onError);
    }
  };
  el.addEventListener('error', onError);

  document.body.appendChild(el);
  assert(unresolved, 'should error for unresolved method names');
});

it('x-element observed properties', () => {
  const el = document.createElement('test-element-observed-properties');
  el.a = '11';
  el.b = '22';
  document.body.appendChild(el);

  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: '11',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: '22',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: '11 22',
        oldValue: undefined,
      },
    ]),
    'initialized as expected'
  );

  el.b = 'hey';
  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: '11',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: '22',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: '11 22',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hey',
        oldValue: '22',
      },
      {
        property: 'c',
        newValue: '11 hey',
        oldValue: '11 22',
      },
    ]),
    'observers are called when properties change'
  );

  el.b = 'hey';
  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: '11',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: '22',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: '11 22',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hey',
        oldValue: '22',
      },
      {
        property: 'c',
        newValue: '11 hey',
        oldValue: '11 22',
      },
    ]),
    'observers are not called when set property is the same'
  );

  el.a = 11;
  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: '11',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: '22',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: '11 22',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hey',
        oldValue: '22',
      },
      {
        property: 'c',
        newValue: '11 hey',
        oldValue: '11 22',
      },
      {
        property: 'a',
        newValue: '11',
        oldValue: '11',
      },
    ]),
    'observers are not called when set property does not cause computed change'
  );

  el.popped = true;
  el.setAttribute('popped', 'still technically true');
  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: '11',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: '22',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: '11 22',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hey',
        oldValue: '22',
      },
      {
        property: 'c',
        newValue: '11 hey',
        oldValue: '11 22',
      },
      {
        property: 'a',
        newValue: '11',
        oldValue: '11',
      },
      {
        property: 'popped',
        newValue: true,
        oldValue: undefined,
      },
    ]),
    'no re-entrance for observed, reflected properties'
  );
});
