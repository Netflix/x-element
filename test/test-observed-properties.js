import { assert, it } from '../../../x-test-js/x-test.js';
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

it('x-element observed properties', () => {
  const unresolvedMessage = `Cannot resolve methodName "thisDNE".`;

  let unresolved = false;

  const el = document.createElement('test-element-observed-properties');
  el.a = 'oh';
  el.b = 'hai';

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

  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: 'oh',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hai',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: 'oh hai',
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
        newValue: 'oh',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hai',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: 'oh hai',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hey',
        oldValue: 'hai',
      },
      {
        property: 'c',
        newValue: 'oh hey',
        oldValue: 'oh hai',
      },
    ]),
    'observers are called when properties change'
  );

  el.b = 'hey';
  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: 'oh',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hai',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: 'oh hai',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hey',
        oldValue: 'hai',
      },
      {
        property: 'c',
        newValue: 'oh hey',
        oldValue: 'oh hai',
      },
    ]),
    'observers are not called when set property is the same'
  );

  el.popped = true;
  el.setAttribute('popped', 'still technically true');
  assert(
    deepEqual(el.changes, [
      {
        property: 'a',
        newValue: 'oh',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hai',
        oldValue: undefined,
      },
      {
        property: 'c',
        newValue: 'oh hai',
        oldValue: undefined,
      },
      {
        property: 'b',
        newValue: 'hey',
        oldValue: 'hai',
      },
      {
        property: 'c',
        newValue: 'oh hey',
        oldValue: 'oh hai',
      },
      {
        property: 'popped',
        newValue: true,
        oldValue: undefined,
      },
    ]),
    'no re-entrance for observed, reflected properties',
  );
});
