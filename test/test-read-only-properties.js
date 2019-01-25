import { suite, it } from './runner.js';
import './fixture-element-read-only-properties.js';

suite('x-element readOnly properties', async ctx => {
  document.onerror = evt => {
    console.error(evt.error);
  };
  const el = document.createElement('test-element-read-only-properties');
  ctx.body.appendChild(el);

  await el;
  it('initialized as expected', el.readOnlyProperty === 'Ferus');

  el.readOnlyProperty = 'Dromedary';
  it('read-only properties cannot be changed', el.readOnlyProperty === 'Ferus');
});
