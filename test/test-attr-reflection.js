import { suite, it } from './runner.js';
import './fixture-element-attr-reflection.js';

suite('x-element attribute reflection', async ctx => {
  const el = document.createElement('test-element-attr-reflection');
  ctx.body.appendChild(el);
  it(
    'reflects initial value',
    el.getAttribute('camel-case-property') === 'reflectedCamel'
  );
  await el;
  it(
    'renders the template with the initial value',
    el.shadowRoot.querySelector('span').textContent === 'reflectedCamel'
  );
  it(
    'reflects initial value (Boolean, true)',
    el.hasAttribute('boolean-property-true')
  );
  it(
    'does not reflect initial value (Boolean, false)',
    el.hasAttribute('boolean-property-false') === false
  );
  el.camelCaseProperty = 'dromedary';
  it(
    'reflects next value',
    el.getAttribute('camel-case-property') === 'dromedary'
  );
  await el;
  it(
    'renders the template with the next value',
    el.shadowRoot.querySelector('span').textContent === 'dromedary'
  );
  it(
    'has reflected override value after connected',
    el.getAttribute('override-property') === 'overridden'
  );
  el.booleanPropertyTrue = false;
  it(
    'does not reflect next false value (Boolean)',
    el.hasAttribute('boolean-property-true') === false
  );
});
