import { assert, it } from '@netflix/x-test/x-test.js';
import XElement from '../x-element.js';

class TestElementChild extends HTMLElement {
  connectedCallback() {
    const eventType = 'connected';
    const eventData = { bubbles: true, composed: true };
    this.dispatchEvent(new CustomEvent(eventType, eventData));
  }
}
customElements.define('test-element-child', TestElementChild);

class TestElement extends XElement {
  static get properties() {
    return {
      clicks: {
        type: Number,
        default: 0,
      },
      connections: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
      customEventCount: {
        type: Number,
        default: 0,
      },
      customEventOnceCount: {
        type: Number,
        default: () => 0,
      },
    };
  }
  static get listeners() {
    return { click: this.onClick, connected: this.onConnected };
  }
  static template(html) {
    return ({ clicks, count }) => {
      return html`
        <button id="increment" type="button">+</button>
        <button id="decrement" type="button">-</button>
        <span>clicks: ${clicks} count ${count}</span>
        <div id="custom-event-emitter"></div>
        <test-element-child id="connected-event-emitter"></test-element-child>
      `;
    };
  }
  static onClick(host, evt) {
    host.clicks++;
    if (evt.target.id === 'increment') {
      host.count++;
    } else if (evt.target.id === 'decrement') {
      host.count--;
    }
  }
  static onConnected(host) {
    host.connections++;
  }
  static onCustomEventOnce(host) {
    if (this === TestElement && host.constructor === TestElement) {
      host.customEventOnceCount++;
    }
  }
  static onCustomEvent(host) {
    if (this === TestElement && host.constructor === TestElement) {
      host.customEventCount++;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.listen(this.shadowRoot, 'custom-event', this.constructor.onCustomEventOnce, { once: true });
    this.listen(this.shadowRoot, 'custom-event', this.constructor.onCustomEvent);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.unlisten(this.shadowRoot, 'custom-event', this.constructor.onCustomEventOnce, { once: true });
    this.unlisten(this.shadowRoot, 'custom-event', this.constructor.onCustomEvent);
  }
}
customElements.define('test-element', TestElement);

it('test lifecycle', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
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

  document.body.append(el);
  el.shadowRoot.getElementById('increment').click();
  assert(el.clicks === 3 && el.count === 1, 'adds back listeners on reconnect');
});

it('test connectedCallback lifecycle', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  const eventEmitter = el.shadowRoot.getElementById('custom-event-emitter');
  eventEmitter.dispatchEvent(new CustomEvent('custom-event', { bubbles: true }));
  assert(el.customEventOnceCount === 1);
  assert(el.customEventCount === 1);
  eventEmitter.dispatchEvent(new CustomEvent('custom-event', { bubbles: true }));
  assert(el.customEventOnceCount === 1);
  assert(el.customEventCount === 2);
  document.body.removeChild(el);
  eventEmitter.dispatchEvent(new CustomEvent('custom-event', { bubbles: true }));
  assert(el.customEventOnceCount === 1);
  assert(el.customEventCount === 2);
});

it('test manual lifecycle', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let count = 0;
  const onManualCheck = () => count++;
  el.listen(el.shadowRoot, 'manual-check', onManualCheck);
  el.shadowRoot.dispatchEvent(new CustomEvent('manual-check'));
  el.shadowRoot.dispatchEvent(new CustomEvent('manual-check'));
  assert(count === 2, 'listener was added');
  el.unlisten(el.shadowRoot, 'manual-check', onManualCheck);
  el.shadowRoot.dispatchEvent(new CustomEvent('manual-check'));
  assert(count === 2, 'listener was removed');
});

it('test synchronous event handling', () => {
  // This is subtle, but it tests that if child elements emit events
  //  synchronously in their first render, delegated event listening from the
  //  parent will still work.
  let count = 0;
  const documentListener = () => count++;
  document.addEventListener('connected', documentListener);
  const el = document.createElement('test-element');
  document.body.append(el);
  assert(count === 1);
  assert(el.connections === count);
});

it('throws for bad element on listen', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.listen();
  } catch (error) {
    const expected = 'Unexpected element passed to listen (expected EventTarget, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws for bad type on listen', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.listen(el);
  } catch (error) {
    const expected = 'Unexpected type passed to listen (expected String, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws for bad callback on listen', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.listen(el.shadowRoot, 'test');
  } catch (error) {
    const expected = 'Unexpected callback passed to listen (expected Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws for bad options on listen', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.listen(el.shadowRoot, 'test', () => {}, true);
  } catch (error) {
    const expected = 'Unexpected options passed to listen (expected Object, got Boolean).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws for bad element on unlisten', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.unlisten();
  } catch (error) {
    const expected = 'Unexpected element passed to unlisten (expected EventTarget, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws for bad type on unlisten', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.unlisten(el);
  } catch (error) {
    const expected = 'Unexpected type passed to unlisten (expected String, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws for bad callback on unlisten', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.unlisten(el.shadowRoot, 'test');
  } catch (error) {
    const expected = 'Unexpected callback passed to unlisten (expected Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

it('throws for bad options on unlisten', () => {
  const el = document.createElement('test-element');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.unlisten(el.shadowRoot, 'test', () => {}, true);
  } catch (error) {
    const expected = 'Unexpected options passed to unlisten (expected Object, got Boolean).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
