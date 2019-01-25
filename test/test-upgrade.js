import { suite, it } from './runner.js';
import TestElement from './fixture-element-upgrade.js';

const setupEl = el => {
  el.className = 'marsupialia';
  el.readOnlyProperty = 'chlamyphoridae';
  el[Symbol.for('readOnlyKey')] = 'dasypodidae';
  el.reflectedProperty = 'plantigrade';
};

const hasNotUpgraded = el => {
  return (
    el instanceof HTMLElement &&
    el instanceof TestElement === false &&
    el.shadowRoot === null &&
    el.getAttribute('class') === 'marsupialia' &&
    el.readOnlyProperty === 'chlamyphoridae' &&
    el[Symbol.for('readOnlyKey')] === 'dasypodidae' &&
    el.readOnlyDefinedProperty === undefined &&
    el.reflectedProperty === 'plantigrade' &&
    el.getAttribute('reflected-property') === null
  );
};

const hasUpgraded = el => {
  // Properties are still shadowed after upgrade and before initialization.
  return (
    el instanceof TestElement &&
    el.getAttribute('class') === 'marsupialia' &&
    el.readOnlyProperty === 'didelphidae' &&
    el[Symbol.for('readOnlyKey')] === 'didelphimorphia' &&
    el.readOnlyDefinedProperty === 'phalangeriformes' &&
    el.reflectedProperty === 'plantigrade' &&
    el.getAttribute('reflected-property') === 'plantigrade'
  );
};

suite('x-element upgrade lifecycle', ctx => {
  const localName = 'test-element-upgrade';
  it(
    'localName is initially undefined',
    customElements.get(localName) === undefined
  );

  const el1 = ctx.createElement(localName);
  el1.id = 'el1';
  setupEl(el1);
  ctx.body.appendChild(el1);

  const el2 = ctx.createElement(localName);
  el2.id = 'el2';
  setupEl(el2);

  it(
    'el1 is setup as expected',
    el1.localName === localName &&
      ctx.getElementById('el1') === el1 &&
      hasNotUpgraded(el1)
  );

  it(
    'el2 is setup as expected',
    el1.localName === localName &&
      ctx.getElementById('el2') === null &&
      hasNotUpgraded(el2)
  );

  customElements.define(localName, TestElement);

  const el3 = ctx.createElement(localName);
  el3.id = 'el3';
  el3.className = 'marsupialia';
  el3.reflectedProperty = 'plantigrade';

  const el4 = new TestElement();
  el4.id = 'el4';
  el4.className = 'marsupialia';
  el4.reflectedProperty = 'plantigrade';

  it(
    'elements created after definition do not need upgrading',
    hasUpgraded(el3) && hasUpgraded(el4)
  );

  it('element in document is upgraded upon definition', hasUpgraded(el1));
  it(
    'element in document synchronously renders',
    el1.shadowRoot.textContent === 'didelphidae'
  );

  it('element out of document is still not upgraded', hasNotUpgraded(el2));
  ctx.body.appendChild(el2);
  it(
    'element out of document upgrades/renders after being added',
    el2.shadowRoot.textContent === 'didelphidae'
  );

  ctx.body.appendChild(el3);
  it(
    'element created after definition upgrades/renders after being added',
    el3.shadowRoot.textContent === 'didelphidae'
  );
});
