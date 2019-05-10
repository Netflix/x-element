import { suite, it } from './runner.js';
import './fixture-element-listeners.js';

suite('x-element listeners', async ctx => {
  document.onerror = evt => {
    console.error(evt.error);
  };
  const el = document.createElement('test-element-listeners');
  ctx.body.appendChild(el);

  it('initialized as expected', el.clicks === 0 && el.count === 0);

  el.click();
  it('listens on shadowRoot, not on host', el.clicks === 0 && el.count === 0);

  el.shadowRoot.getElementById('increment').click();
  it('listens to events', el.clicks === 1 && el.count === 1);

  el.shadowRoot.getElementById('decrement').click();
  it('works for delegated event handling', el.clicks === 2 && el.count === 0);

  ctx.body.removeChild(el);
  el.shadowRoot.getElementById('increment').click();
  it('removes listeners on disconnection', el.clicks === 2 && el.count === 0);

  ctx.body.appendChild(el);
  el.shadowRoot.getElementById('increment').click();
  it('adds back listeners on reconnection', el.clicks === 3 && el.count === 1);
});
