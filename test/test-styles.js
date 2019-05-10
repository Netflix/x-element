import { suite, it } from './runner.js';
import './fixture-element-styles.js';

suite('x-element styles', async ctx => {
  document.onerror = evt => {
    console.error(evt.error);
  };
  const el = document.createElement('test-element-styles');
  ctx.body.appendChild(el);
  const computedStyle = window.getComputedStyle(el);

  it(
    'should have blue text from adoptedStyles',
    computedStyle.getPropertyValue('color') === 'rgb(0, 0, 255)'
  );

  it(
    'should have be underlines from local styles',
    computedStyle.getPropertyValue('text-decoration') ===
      'underline solid rgb(0, 0, 255)'
  );
});
