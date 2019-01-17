import { suite, it } from './runner.js';
import './fixture-element-computed-properties.js';

suite('x-element computed properties', async ctx => {
  const el = document.createElement('test-element-computed-properties');
  ctx.body.appendChild(el);

  await el;
  it(
    'initialized as expected',
    el.a === undefined &&
      el.b === undefined &&
      Number.isNaN(el.c) === true &&
      el.negative === false &&
      el.underline === false
  );

  el.a = 1;
  el.b = -2;
  it(
    'properties are recomputed when dependencies change',
    el.a === 1 &&
      el.b === -2 &&
      el.c === -1 &&
      el.negative === true &&
      el.underline === true
  );

  it(
    'computed properties can be reflected',
    el.hasAttribute('negative') && el.hasAttribute('underline')
  );
});
