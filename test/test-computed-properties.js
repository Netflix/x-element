import { it, assert, todo } from '../../../x-test-js/x-test.js';
import './fixture-element-computed-properties.js';

const parsingTestCases = [
  {
    label: 'parses simple case',
    computed: 'computeC(a, b)',
    expected: { methodName: 'computeC', dependencies: ['a', 'b'] },
  },
  {
    label: 'parses multiline case',
    computed: `
      computeC(
        a,
        b
      )
    `,
    expected: { methodName: 'computeC', dependencies: ['a', 'b'] },
  },
  {
    label: 'allows trailing commas',
    computed: `
      computeC(
        a,
        b,
      )
    `,
    expected: { methodName: 'computeC', dependencies: ['a', 'b'] },
  },
  {
    label: 'does not allow middle commas',
    computed: `
      computeC(
        a,,
        b,
      )
    `,
    expected: undefined,
  },
  {
    label: 'does not allow spaces in tokens',
    computed: `
      computeC(
        a a,
        b,
      )
    `,
    expected: undefined,
  },
  {
    label: 'does not allow commas in method name',
    computed: 'comp,uteC(a, b)',
    expected: undefined,
  },
  {
    label: 'does not allow spaces in method name',
    computed: 'comp uteC(a, b)',
    expected: undefined,
  },
  {
    label: 'does not allow parentheses in tokens (0)',
    computed: 'computeC(a), b)',
    expected: undefined,
  },
  {
    label: 'does not allow parentheses in tokens (1)',
    computed: 'computeC(a(, b)',
    expected: undefined,
  },
];

it('should dispatch expected errors', () => {
  const malformedMessage = `Malformed computed "malformed(a,,b)".`;
  const unresolvedMessage = `Cannot resolve methodName "thisDNE".`;
  const missingMessage = `Missing dependency "notDeclared".`;
  const cyclicMessage = 'Computed properties are cyclic.';
  let malformed = false;
  let unresolved = false;
  let missing = false;
  let cyclic = false;
  const onError = evt => {
    evt.stopPropagation();
    if (evt.error.message === malformedMessage) {
      malformed = true;
    } else if (evt.error.message === unresolvedMessage) {
      unresolved = true;
    } else if (evt.error.message === missingMessage) {
      missing = true;
    } else if (evt.error.message === cyclicMessage) {
      cyclic = true;
    } else {
      throw new Error(`unexpected malformedMessage: "${malformedMessage}"`);
    }
  };
  const el = document.createElement('test-element-computed-properties-errors');
  el.addEventListener('error', onError);
  document.body.appendChild(el);
  assert(malformed);
  assert(unresolved);
  assert(missing);
  assert(cyclic);
});

it('computed property dsl', () => {
  const el = document.createElement('test-element-computed-properties-errors');
  for (const { label, computed, expected } of parsingTestCases) {
    const actual = el.constructor.parseComputed(computed);
    assert(JSON.stringify(actual) === JSON.stringify(expected), label);
  }
});

it('initializes as expected', () => {
  const el = document.createElement('test-element-computed-properties');
  document.body.appendChild(el);
  assert(el.a === undefined);
  assert(el.b === undefined);
  assert(el.y === undefined);
  assert(el.z === undefined);
  assert(el.countTrigger === undefined);
  // TODO: #27. Should revert these.
  assert(Number.isNaN(el.c));
  assert(el.negative === false);
  assert(el.underline === false);
});

todo('Issue #27', `don't initialize until a dependency is defined`, () => {
  const el = document.createElement('test-element-computed-properties');
  document.body.appendChild(el);
  assert(el.c === undefined);
  assert(el.negative === undefined);
});

it('properties are recomputed when dependencies change (a, b)', () => {
  const el = document.createElement('test-element-computed-properties');
  document.body.appendChild(el);
  el.a = 1;
  el.b = -2;
  assert(el.a === 1);
  assert(el.b === -2);
  assert(el.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);
});

it('properties are recomputed when dependencies change (y)', () => {
  const el = document.createElement('test-element-computed-properties');
  document.body.appendChild(el);
  el.y = true;
  assert(el.y === true);
  assert(el.z === true);
  el.y = false;
  assert(el.y === false);
  assert(el.z === false);
});

it('computed properties can be reflected', () => {
  const el = document.createElement('test-element-computed-properties');
  document.body.appendChild(el);
  el.a = -1;
  el.b = 0;
  assert(el.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);
  assert(el.hasAttribute('negative'));
  assert(el.hasAttribute('underline'));
});

it('skips computation when dependencies are the same', () => {
  const el = document.createElement('test-element-computed-properties');
  document.body.appendChild(el);
  let count = el.count;
  el.countTrigger = 'foo';
  assert(el.count === ++count);
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  assert(el.count === count);
  el.countTrigger = 'bar';
  assert(el.count === ++count);
});
