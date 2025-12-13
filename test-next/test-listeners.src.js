import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, listener, html } from '../x-element-next.js';

class TestElementChild extends HTMLElement {
  connectedCallback() {
    const eventType = 'connected';
    const eventData = { bubbles: true, composed: true };
    this.dispatchEvent(new CustomEvent(eventType, eventData));
  }
}
customElements.define('test-element-child', TestElementChild);

class TestElement extends XElement {
  @property({
    type: Number,
    default: 0,
  })
  accessor clicks;

  @property({
    type: Number,
    default: 0,
  })
  accessor connections;

  @property({
    type: Number,
    default: 0,
  })
  accessor count;

  @property({
    type: Number,
    default: 0,
  })
  accessor customEventCount;

  @property({
    type: Number,
    default: () => 0,
  })
  accessor customEventOnceCount;

  @listener('click')
  static onClick(host, evt) {
    host.clicks++;
    if (evt.target.id === 'increment') {
      host.count++;
    } else if (evt.target.id === 'decrement') {
      host.count--;
    }
  }

  @listener('connected')
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

  static template(host) {
    return html`
      <button id="increment" type="button">+</button>
      <button id="decrement" type="button">-</button>
      <span>clicks: ${host.clicks} count ${host.count}</span>
      <div id="custom-event-emitter"></div>
      <test-element-child id="connected-event-emitter"></test-element-child>
    `;
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
customElements.define('test-element-next', TestElement);

it('test lifecycle', () => {
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(count === 1);
  assert(el.connections === count);
});

it('throws for bad element on listen', () => {
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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
  const el = document.createElement('test-element-next');
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

// Test multiple listeners for same event type
class MultiListenerElement extends XElement {
  @property({ type: Number, initial: 0 })
  accessor count1;

  @property({ type: Number, initial: 0 })
  accessor count2;

  @listener('test-event')
  static onTestEvent1(host) {
    host.count1++;
  }

  @listener('test-event')
  static onTestEvent2(host) {
    host.count2++;
  }

  static template(host) {
    return html`<div>${host.count1}-${host.count2}</div>`;
  }
}
customElements.define('test-multi-listener', MultiListenerElement);

it('multiple listeners for same event type', () => {
  const el = document.createElement('test-multi-listener');
  document.body.append(el);
  assert(el.count1 === 0 && el.count2 === 0, 'counters start at 0');

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.count1 === 1 && el.count2 === 1, 'both listeners fire');

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.count1 === 2 && el.count2 === 2, 'both listeners fire on repeat');

  el.remove();
});

// Test listener with once option
class OnceListenerElement extends XElement {
  @property({ type: Number, initial: 0 })
  accessor onceCount;

  @property({ type: Number, initial: 0 })
  accessor normalCount;

  @listener('test-event', { once: true })
  static onOnce(host) {
    host.onceCount++;
  }

  @listener('test-event')
  static onNormal(host) {
    host.normalCount++;
  }

  static template(host) {
    return html`<div>${host.onceCount}-${host.normalCount}</div>`;
  }
}
customElements.define('test-once-listener', OnceListenerElement);

it('listener with once option fires once only', () => {
  const el = document.createElement('test-once-listener');
  document.body.append(el);

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.onceCount === 1 && el.normalCount === 1, 'both fire on first event');

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.onceCount === 1 && el.normalCount === 2, 'once listener stops, normal continues');

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.onceCount === 1 && el.normalCount === 3, 'once listener still stopped');

  el.remove();
});

// Test listener with capture option
class CaptureListenerElement extends XElement {
  @property({ type: Array, initial: () => [] })
  accessor order;

  @listener('test-event', { capture: true })
  static onCapture(host) {
    host.order = [...host.order, 'capture'];
  }

  @listener('test-event')
  static onBubble(host) {
    host.order = [...host.order, 'bubble'];
  }

  static template() {
    return html`<div id="child"></div>`;
  }
}
customElements.define('test-capture-listener', CaptureListenerElement);

it('listener with capture option fires in capture phase', () => {
  const el = document.createElement('test-capture-listener');
  document.body.append(el);

  const child = el.shadowRoot.getElementById('child');
  child.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));

  assert(el.order.length === 2, 'both listeners fired');
  assert(el.order[0] === 'capture', 'capture listener fired first');
  assert(el.order[1] === 'bubble', 'bubble listener fired second');

  el.remove();
});

// Test multiple listeners with different options
class MixedOptionsElement extends XElement {
  @property({ type: Number, initial: 0 })
  accessor normalCount;

  @property({ type: Number, initial: 0 })
  accessor passiveCount;

  @property({ type: Number, initial: 0 })
  accessor onceCount;

  @listener('test-event')
  static onNormal(host) {
    host.normalCount++;
  }

  @listener('test-event', { passive: true })
  static onPassive(host) {
    host.passiveCount++;
  }

  @listener('test-event', { once: true })
  static onOnce(host) {
    host.onceCount++;
  }

  static template(host) {
    return html`<div>${host.normalCount}-${host.passiveCount}-${host.onceCount}</div>`;
  }
}
customElements.define('test-mixed-options', MixedOptionsElement);

it('multiple listeners with different options', () => {
  const el = document.createElement('test-mixed-options');
  document.body.append(el);

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.normalCount === 1, 'normal listener fires');
  assert(el.passiveCount === 1, 'passive listener fires');
  assert(el.onceCount === 1, 'once listener fires');

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.normalCount === 2, 'normal listener fires again');
  assert(el.passiveCount === 2, 'passive listener fires again');
  assert(el.onceCount === 1, 'once listener does not fire again');

  el.remove();
});

// Test disconnection removes all multiple listeners
it('disconnection removes all multiple listeners', () => {
  const el = document.createElement('test-multi-listener');
  document.body.append(el);

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.count1 === 1 && el.count2 === 1, 'both listeners work when connected');

  el.remove();
  el.count1 = 0;
  el.count2 = 0;

  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.count1 === 0 && el.count2 === 0, 'neither listener fires when disconnected');

  document.body.append(el);
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', { bubbles: true }));
  assert(el.count1 === 1 && el.count2 === 1, 'both listeners work again when reconnected');

  el.remove();
});
