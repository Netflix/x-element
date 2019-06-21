import './fixture-element-basic.js';
import { it, assert } from '../../../x-test-js/x-test.js';

it('upgrades the element with a shadowRoot', () => {
  const el = document.createElement('test-element-basic');
  assert(el.shadowRoot instanceof DocumentFragment);
});

it('renders the template with variables', () => {
  const el = document.createElement('test-element-basic');
  document.body.appendChild(el);
  assert(el.shadowRoot.querySelector('span').textContent === 'Hello world.');
});

it('has correct innerHTML', () => {
  const el = document.createElement('test-element-basic');
  document.body.appendChild(el);
  assert(el.shadowRoot.innerHTML.trim() === '<span>Hello world.</span>');
});

it('has override value after connected', () => {
  const el = document.createElement('test-element-basic');
  document.body.appendChild(el);
  assert(el.overrideProperty === 'overridden');
});

it('has expected boolean functionality', () => {
  const el = document.createElement('test-element-basic');
  document.body.appendChild(el);
  el.booleanProperty = true;
  assert(el.booleanProperty === true);
  el.booleanProperty = 1;
  assert(el.booleanProperty === true);
  el.booleanProperty = 'ok';
  assert(el.booleanProperty === true);
  el.removeAttribute('boolean-property');
  assert(el.booleanProperty === false);
});
