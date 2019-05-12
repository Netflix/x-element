import { suite, it } from './runner.js';
import './fixture-element-basic.js';

suite('x-element basic', async ctx => {
  document.onerror = evt => {
    console.error(evt.error);
  };
  const el = document.createElement('test-element-basic');
  it(
    'upgrades the element without adding a shadowRoot',
    el.shadowRoot instanceof DocumentFragment === false
  );
  ctx.body.appendChild(el);
  await el;
  it(
    'adds shadow root upon connection',
    el.shadowRoot instanceof DocumentFragment
  );
  it(
    'renders the template with variables',
    el.shadowRoot.querySelector('span').textContent === 'Hello world.'
  );
  it(
    'has correct innerHTML',
    el.shadowRoot.innerHTML.trim() === '<span>Hello world.</span>'
  );
  it(
    'has override value after connected',
    el.overrideProperty === 'overridden'
  );
});

suite('x-element basic (Boolean)', ctx => {
  document.onerror = evt => {
    console.error(evt.error);
  };
  const el = document.createElement('test-element-basic');
  ctx.body.appendChild(el);
  el.booleanProperty = true;
  it('coerces to Boolean', el.booleanProperty === true);
  el.booleanProperty = 1;
  it('coerces to Boolean x 1', el.booleanProperty === true);
  el.booleanProperty = 'ok';
  it('coerces to Boolean x 2', el.booleanProperty === true);
  el.removeAttribute('boolean-property');
  it('removing attribute makes property false', el.booleanProperty === false);
});
