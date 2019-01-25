import { suite, it } from './runner.js';
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

suite('x-element observed properties', ctx => {
  const unresolvedMessage = `Cannot resolve methodName "thisDNE".`;

  let unresolved = false;

  document.onerror = evt => {
    if (evt.error.message === unresolvedMessage) {
      unresolved = true;
    } else {
      console.error(evt.error);
    }
  };

  const el = document.createElement('test-element-observed-properties');
  el.a = 'oh';
  el.b = 'hai';

  ctx.body.appendChild(el);

  it('should error for unresolved method names', unresolved);

  it(
    'initialized as expected',
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
    ])
  );

  el.b = 'hey';
  it(
    'observers are called when properties change',
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
    ])
  );

  el.b = 'hey';
  it(
    'observers are not called when set property is the same',
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
    ])
  );

  el.popped = true;
  el.setAttribute('popped', 'still technically true');
  it(
    'no re-entrance for observed, reflected properties',
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
    ])
  );
});
