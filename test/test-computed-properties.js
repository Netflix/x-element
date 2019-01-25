import { suite, it } from './runner.js';
import './fixture-element-computed-properties.js';

suite('x-element computed properties', ctx => {
  const malformedMessage = `Malformed computed "thisMalformed!!!".`;
  const unresolvedMessage = `Cannot resolve methodName "thisDNE".`;
  const missingMessage = `Missing dependency "notDeclared".`;
  const cyclicMessage = 'Computed properties are cyclic.';

  let malformed = false;
  let unresolved = false;
  let missing = false;
  let cyclic = false;

  document.onerror = evt => {
    if (evt.error.message === malformedMessage) {
      malformed = true;
    } else if (evt.error.message === unresolvedMessage) {
      unresolved = true;
    } else if (evt.error.message === missingMessage) {
      missing = true;
    } else if (evt.error.message === cyclicMessage) {
      cyclic = true;
    } else {
      console.error(evt.error);
    }
  };

  const el = document.createElement('test-element-computed-properties');
  ctx.body.appendChild(el);

  it('should error for malformed computed DSL', malformed);

  it('should error for unresolved method names', unresolved);

  it('should error for missing dependencies', missing);

  it('should error for cyclic dependency graphs', cyclic);

  it(
    'initialized as expected',
    el.a === undefined &&
      el.b === undefined &&
      el.c === undefined &&
      el.negative === undefined &&
      el.underline === undefined &&
      el.y === undefined &&
      el.z === undefined
  );

  el.a = 1;
  el.b = -2;
  it(
    'properties are recomputed when dependencies change (0)',
    el.a === 1 &&
      el.b === -2 &&
      el.c === -1 &&
      el.negative === true &&
      el.underline === true &&
      el.y === undefined &&
      el.z === undefined
  );

  el.y = true;
  it(
    'properties are recomputed when dependencies change (1)',
    el.a === 1 &&
      el.b === -2 &&
      el.c === -1 &&
      el.negative === true &&
      el.underline === true &&
      el.y === true &&
      el.z === true
  );

  el.y = false;
  it(
    'properties are recomputed when dependencies change (2)',
    el.a === 1 &&
      el.b === -2 &&
      el.c === -1 &&
      el.negative === true &&
      el.underline === true &&
      el.y === false &&
      el.z === false
  );

  it(
    'computed properties can be reflected',
    el.hasAttribute('negative') && el.hasAttribute('underline')
  );
});
