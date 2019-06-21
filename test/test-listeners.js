import { assert, it } from '../../../x-test-js/x-test.js';
import './fixture-element-listeners.js';

it('test lifecycle', () => {
  const el = document.createElement('test-element-listeners');
  document.body.appendChild(el);
  assert(el.clicks === 0 && el.count === 0, 'initialized as expected');

  el.click();
  assert(el.clicks === 0 && el.count === 0, 'listens on shadowRoot, not host');

  el.shadowRoot.getElementById('increment').click();
  assert(el.clicks === 1 && el.count === 1, 'listens to events');

  el.shadowRoot.getElementById('decrement').click();
  assert(el.clicks === 2 && el.count === 0, 'works for delegated handling');

  document.body.removeChild(el);
  el.shadowRoot.getElementById('increment').click();
  assert(el.clicks === 2 && el.count === 0, 'removes listeners on disconnect');

  document.body.appendChild(el);
  el.shadowRoot.getElementById('increment').click();
  assert(el.clicks === 3 && el.count === 1, 'adds back listeners on reconnect');
});
