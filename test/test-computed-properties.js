import { suite, it } from './runner.js';
import {
  TestElementComputedPropertiesErrorsMalformed,
  TestElementComputedPropertiesErrorsUnresolved,
  TestElementComputedPropertiesErrorsMissing,
  TestElementComputedPropertiesErrorsCyclic,
} from './fixture-element-computed-properties.js';

const parsingTestCases = [
  {
    label: 'parses simple case',
    computed: 'computeC(a, b)',
    expected: ['computeC', 'a', 'b'],
  },
  {
    label: 'parses multiline case',
    computed: `
      computeC(
        a,
        b
      )
    `,
    expected: ['computeC', 'a', 'b'],
  },
  {
    label: 'allows trailing commas',
    computed: `
      computeC(
        a,
        b,
      )
    `,
    expected: ['computeC', 'a', 'b'],
  },
  {
    label: 'does not allow middle commas',
    computed: `
      computeC(
        a,,
        b,
      )
    `,
    error: true,
  },
  {
    label: 'does not allow spaces in tokens',
    computed: `
      computeC(
        a a,
        b,
      )
    `,
    error: true,
  },
  {
    label: 'does not allow commas in method name',
    computed: 'comp,uteC(a, b)',
    error: true,
  },
  {
    label: 'does not allow spaces in method name',
    computed: 'comp uteC(a, b)',
    error: true,
  },
  {
    label: 'does not allow parentheses in tokens (0)',
    computed: 'computeC(a), b)',
    error: true,
  },
  {
    label: 'does not allow parentheses in tokens (1)',
    computed: 'computeC(a(, b)',
    error: true,
  },
];

suite('x-element computed properties', ctx => {
  // Test analysis-time errors.
  let malformed = false;
  try {
    new TestElementComputedPropertiesErrorsMalformed();
  } catch (err) {
    malformed = err.message === `Malformed computed "malformed(a,,b)".`;
  }
  it('should throw halting error for malformed computed DSL', malformed);

  let unresolved = false;
  try {
    new TestElementComputedPropertiesErrorsUnresolved();
  } catch (err) {
    unresolved = err.message === `Cannot resolve methodName "thisDNE".`;
  }
  it('should throw halting error for unresolved method names', unresolved);

  let missing = false;
  try {
    new TestElementComputedPropertiesErrorsMissing();
  } catch (err) {
    missing = err.message === `Missing dependency "notHere".`;
  }
  it('should throw halting error for missing dependencies', missing);

  let cyclic = false;
  try {
    new TestElementComputedPropertiesErrorsCyclic();
  } catch (err) {
    cyclic = err.message === 'Graph is cyclic.';
  }
  it('should error for cyclic dependency graphs', cyclic);

  // Test normal use case.
  document.addEventListener('error', evt => console.error(evt.error));
  const el = document.createElement('test-element-computed-properties');
  ctx.body.appendChild(el);

  // Test parsing of computed DSL.
  for (const { label, computed, expected, error } of parsingTestCases) {
    if (error) {
      let errored = false;
      try {
        el.constructor.parseComputed(computed);
      } catch (err) {
        errored = err.message === `Malformed computed "${computed}".`;
      }
      it(label, errored);
    } else {
      const actual = el.constructor.parseComputed(computed);
      it(label, JSON.stringify(actual) === JSON.stringify(expected));
    }
  }

  it(
    'initialized as expected',
    el.a === undefined &&
      el.b === undefined &&
      // TODO: #27: Don't initialize until at least one dependency is defined.
      //  We should switch the "isNaN" check to the commented out one.
      // el.c === undefined &&
      Number.isNaN(el.c) &&
      // TODO: #27: Don't initialize until at least one dependency is defined.
      //  We should switch the "false" check to the commented out one.
      // el.negative === undefined &&
      el.negative === false &&
      // TODO: #27: Don't initialize until at least one dependency is defined.
      //  We should switch the "false" check to the commented out one.
      // el.underline === undefined &&
      el.underline === false &&
      el.y === undefined &&
      el.z === undefined &&
      el.countTrigger === undefined &&
      // TODO: #27: Don't initialize until at least one dependency is defined.
      //  We should be able to get `0` back here eventually.
      // el.count === 0
      el.count === 1
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

  el.countTrigger = 'foo';
  const count = el.count;
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  it('skips compute when dependencies are the same', count === el.count);

  el.countTrigger = 'bar';
  it('computes when dependencies change again', count === el.count - 1);
});
