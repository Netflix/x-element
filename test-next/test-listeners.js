let _initProto, _initStatic, _clicksDecs, _init_clicks, _connectionsDecs, _init_connections, _countDecs, _init_count, _customEventCountDecs, _init_customEventCount, _customEventOnceCountDecs, _init_customEventOnceCount, _onClickDecs, _onConnectedDecs, _initProto2, _initStatic2, _count1Decs, _init_count2, _count2Decs, _init_count3, _onTestEvent1Decs, _onTestEvent2Decs, _initProto3, _initStatic3, _onceCountDecs, _init_onceCount, _normalCountDecs, _init_normalCount, _onOnceDecs, _onNormalDecs, _initProto4, _initStatic4, _orderDecs, _init_order, _onCaptureDecs, _onBubbleDecs, _initProto5, _initStatic5, _normalCountDecs2, _init_normalCount2, _passiveCountDecs, _init_passiveCount, _onceCountDecs2, _init_onceCount2, _onNormalDecs2, _onPassiveDecs, _onOnceDecs2;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, listener, html } from '../x-element-next.js';
class TestElementChild extends HTMLElement {
  connectedCallback() {
    const eventType = 'connected';
    const eventData = {
      bubbles: true,
      composed: true
    };
    this.dispatchEvent(new CustomEvent(eventType, eventData));
  }
}
customElements.define('test-element-child', TestElementChild);
class TestElement extends XElement {
  static {
    [_init_clicks, _init_connections, _init_count, _init_customEventCount, _init_customEventOnceCount, _initProto, _initStatic] = _applyDecs(this, [[_onClickDecs, 10, "onClick"], [_onConnectedDecs, 10, "onConnected"], [_clicksDecs, 1, "clicks"], [_connectionsDecs, 1, "connections"], [_countDecs, 1, "count"], [_customEventCountDecs, 1, "customEventCount"], [_customEventOnceCountDecs, 1, "customEventOnceCount"]], [], 0, void 0, XElement).e;
    _initStatic(this);
  }
  #A = (_initProto(this), _init_clicks(this));
  get [(_clicksDecs = property({
    type: Number,
    default: 0
  }), _connectionsDecs = property({
    type: Number,
    default: 0
  }), _countDecs = property({
    type: Number,
    default: 0
  }), _customEventCountDecs = property({
    type: Number,
    default: 0
  }), _customEventOnceCountDecs = property({
    type: Number,
    default: () => 0
  }), _onClickDecs = listener('click'), _onConnectedDecs = listener('connected'), "clicks")]() {
    return this.#A;
  }
  set clicks(v) {
    this.#A = v;
  }
  #B = _init_connections(this);
  get connections() {
    return this.#B;
  }
  set connections(v) {
    this.#B = v;
  }
  #C = _init_count(this);
  get count() {
    return this.#C;
  }
  set count(v) {
    this.#C = v;
  }
  #D = _init_customEventCount(this);
  get customEventCount() {
    return this.#D;
  }
  set customEventCount(v) {
    this.#D = v;
  }
  #E = _init_customEventOnceCount(this);
  get customEventOnceCount() {
    return this.#E;
  }
  set customEventOnceCount(v) {
    this.#E = v;
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
    this.listen(this.shadowRoot, 'custom-event', this.constructor.onCustomEventOnce, {
      once: true
    });
    this.listen(this.shadowRoot, 'custom-event', this.constructor.onCustomEvent);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.unlisten(this.shadowRoot, 'custom-event', this.constructor.onCustomEventOnce, {
      once: true
    });
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
  eventEmitter.dispatchEvent(new CustomEvent('custom-event', {
    bubbles: true
  }));
  assert(el.customEventOnceCount === 1);
  assert(el.customEventCount === 1);
  eventEmitter.dispatchEvent(new CustomEvent('custom-event', {
    bubbles: true
  }));
  assert(el.customEventOnceCount === 1);
  assert(el.customEventCount === 2);
  document.body.removeChild(el);
  eventEmitter.dispatchEvent(new CustomEvent('custom-event', {
    bubbles: true
  }));
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
  static {
    [_init_count2, _init_count3, _initProto2, _initStatic2] = _applyDecs(this, [[_onTestEvent1Decs, 10, "onTestEvent1"], [_onTestEvent2Decs, 10, "onTestEvent2"], [_count1Decs, 1, "count1"], [_count2Decs, 1, "count2"]], [], 0, void 0, XElement).e;
    _initStatic2(this);
  }
  #A = (_initProto2(this), _init_count2(this));
  get [(_count1Decs = property({
    type: Number,
    initial: 0
  }), _count2Decs = property({
    type: Number,
    initial: 0
  }), _onTestEvent1Decs = listener('test-event'), _onTestEvent2Decs = listener('test-event'), "count1")]() {
    return this.#A;
  }
  set count1(v) {
    this.#A = v;
  }
  #B = _init_count3(this);
  get count2() {
    return this.#B;
  }
  set count2(v) {
    this.#B = v;
  }
  static onTestEvent1(host) {
    host.count1++;
  }
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
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.count1 === 1 && el.count2 === 1, 'both listeners fire');
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.count1 === 2 && el.count2 === 2, 'both listeners fire on repeat');
  el.remove();
});

// Test listener with once option
class OnceListenerElement extends XElement {
  static {
    [_init_onceCount, _init_normalCount, _initProto3, _initStatic3] = _applyDecs(this, [[_onOnceDecs, 10, "onOnce"], [_onNormalDecs, 10, "onNormal"], [_onceCountDecs, 1, "onceCount"], [_normalCountDecs, 1, "normalCount"]], [], 0, void 0, XElement).e;
    _initStatic3(this);
  }
  #A = (_initProto3(this), _init_onceCount(this));
  get [(_onceCountDecs = property({
    type: Number,
    initial: 0
  }), _normalCountDecs = property({
    type: Number,
    initial: 0
  }), _onOnceDecs = listener('test-event', {
    once: true
  }), _onNormalDecs = listener('test-event'), "onceCount")]() {
    return this.#A;
  }
  set onceCount(v) {
    this.#A = v;
  }
  #B = _init_normalCount(this);
  get normalCount() {
    return this.#B;
  }
  set normalCount(v) {
    this.#B = v;
  }
  static onOnce(host) {
    host.onceCount++;
  }
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
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.onceCount === 1 && el.normalCount === 1, 'both fire on first event');
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.onceCount === 1 && el.normalCount === 2, 'once listener stops, normal continues');
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.onceCount === 1 && el.normalCount === 3, 'once listener still stopped');
  el.remove();
});

// Test listener with capture option
class CaptureListenerElement extends XElement {
  static {
    [_init_order, _initProto4, _initStatic4] = _applyDecs(this, [[_onCaptureDecs, 10, "onCapture"], [_onBubbleDecs, 10, "onBubble"], [_orderDecs, 1, "order"]], [], 0, void 0, XElement).e;
    _initStatic4(this);
  }
  #A = (_initProto4(this), _init_order(this));
  get [(_orderDecs = property({
    type: Array,
    initial: () => []
  }), _onCaptureDecs = listener('test-event', {
    capture: true
  }), _onBubbleDecs = listener('test-event'), "order")]() {
    return this.#A;
  }
  set order(v) {
    this.#A = v;
  }
  static onCapture(host) {
    host.order = [...host.order, 'capture'];
  }
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
  child.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.order.length === 2, 'both listeners fired');
  assert(el.order[0] === 'capture', 'capture listener fired first');
  assert(el.order[1] === 'bubble', 'bubble listener fired second');
  el.remove();
});

// Test multiple listeners with different options
class MixedOptionsElement extends XElement {
  static {
    [_init_normalCount2, _init_passiveCount, _init_onceCount2, _initProto5, _initStatic5] = _applyDecs(this, [[_onNormalDecs2, 10, "onNormal"], [_onPassiveDecs, 10, "onPassive"], [_onOnceDecs2, 10, "onOnce"], [_normalCountDecs2, 1, "normalCount"], [_passiveCountDecs, 1, "passiveCount"], [_onceCountDecs2, 1, "onceCount"]], [], 0, void 0, XElement).e;
    _initStatic5(this);
  }
  #A = (_initProto5(this), _init_normalCount2(this));
  get [(_normalCountDecs2 = property({
    type: Number,
    initial: 0
  }), _passiveCountDecs = property({
    type: Number,
    initial: 0
  }), _onceCountDecs2 = property({
    type: Number,
    initial: 0
  }), _onNormalDecs2 = listener('test-event'), _onPassiveDecs = listener('test-event', {
    passive: true
  }), _onOnceDecs2 = listener('test-event', {
    once: true
  }), "normalCount")]() {
    return this.#A;
  }
  set normalCount(v) {
    this.#A = v;
  }
  #B = _init_passiveCount(this);
  get passiveCount() {
    return this.#B;
  }
  set passiveCount(v) {
    this.#B = v;
  }
  #C = _init_onceCount2(this);
  get onceCount() {
    return this.#C;
  }
  set onceCount(v) {
    this.#C = v;
  }
  static onNormal(host) {
    host.normalCount++;
  }
  static onPassive(host) {
    host.passiveCount++;
  }
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
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.normalCount === 1, 'normal listener fires');
  assert(el.passiveCount === 1, 'passive listener fires');
  assert(el.onceCount === 1, 'once listener fires');
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.normalCount === 2, 'normal listener fires again');
  assert(el.passiveCount === 2, 'passive listener fires again');
  assert(el.onceCount === 1, 'once listener does not fire again');
  el.remove();
});

// Test disconnection removes all multiple listeners
it('disconnection removes all multiple listeners', () => {
  const el = document.createElement('test-multi-listener');
  document.body.append(el);
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.count1 === 1 && el.count2 === 1, 'both listeners work when connected');
  el.remove();
  el.count1 = 0;
  el.count2 = 0;
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.count1 === 0 && el.count2 === 0, 'neither listener fires when disconnected');
  document.body.append(el);
  el.shadowRoot.dispatchEvent(new CustomEvent('test-event', {
    bubbles: true
  }));
  assert(el.count1 === 1 && el.count2 === 1, 'both listeners work again when reconnected');
  el.remove();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJsaXN0ZW5lciIsImh0bWwiLCJUZXN0RWxlbWVudENoaWxkIiwiSFRNTEVsZW1lbnQiLCJjb25uZWN0ZWRDYWxsYmFjayIsImV2ZW50VHlwZSIsImV2ZW50RGF0YSIsImJ1YmJsZXMiLCJjb21wb3NlZCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9jbGlja3MiLCJfaW5pdF9jb25uZWN0aW9ucyIsIl9pbml0X2NvdW50IiwiX2luaXRfY3VzdG9tRXZlbnRDb3VudCIsIl9pbml0X2N1c3RvbUV2ZW50T25jZUNvdW50IiwiX2luaXRQcm90byIsIl9pbml0U3RhdGljIiwiX2FwcGx5RGVjcyIsIl9vbkNsaWNrRGVjcyIsIl9vbkNvbm5lY3RlZERlY3MiLCJfY2xpY2tzRGVjcyIsIl9jb25uZWN0aW9uc0RlY3MiLCJfY291bnREZWNzIiwiX2N1c3RvbUV2ZW50Q291bnREZWNzIiwiX2N1c3RvbUV2ZW50T25jZUNvdW50RGVjcyIsImUiLCJBIiwidHlwZSIsIk51bWJlciIsImRlZmF1bHQiLCJjbGlja3MiLCJ2IiwiQiIsImNvbm5lY3Rpb25zIiwiQyIsImNvdW50IiwiRCIsImN1c3RvbUV2ZW50Q291bnQiLCJFIiwiY3VzdG9tRXZlbnRPbmNlQ291bnQiLCJvbkNsaWNrIiwiaG9zdCIsImV2dCIsInRhcmdldCIsImlkIiwib25Db25uZWN0ZWQiLCJvbkN1c3RvbUV2ZW50T25jZSIsImNvbnN0cnVjdG9yIiwib25DdXN0b21FdmVudCIsInRlbXBsYXRlIiwibGlzdGVuIiwic2hhZG93Um9vdCIsIm9uY2UiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsInVubGlzdGVuIiwiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kIiwiY2xpY2siLCJnZXRFbGVtZW50QnlJZCIsInJlbW92ZUNoaWxkIiwiZXZlbnRFbWl0dGVyIiwib25NYW51YWxDaGVjayIsImRvY3VtZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicGFzc2VkIiwibWVzc2FnZSIsImVycm9yIiwiZXhwZWN0ZWQiLCJNdWx0aUxpc3RlbmVyRWxlbWVudCIsIl9pbml0X2NvdW50MiIsIl9pbml0X2NvdW50MyIsIl9pbml0UHJvdG8yIiwiX2luaXRTdGF0aWMyIiwiX29uVGVzdEV2ZW50MURlY3MiLCJfb25UZXN0RXZlbnQyRGVjcyIsIl9jb3VudDFEZWNzIiwiX2NvdW50MkRlY3MiLCJpbml0aWFsIiwiY291bnQxIiwiY291bnQyIiwib25UZXN0RXZlbnQxIiwib25UZXN0RXZlbnQyIiwicmVtb3ZlIiwiT25jZUxpc3RlbmVyRWxlbWVudCIsIl9pbml0X29uY2VDb3VudCIsIl9pbml0X25vcm1hbENvdW50IiwiX2luaXRQcm90bzMiLCJfaW5pdFN0YXRpYzMiLCJfb25PbmNlRGVjcyIsIl9vbk5vcm1hbERlY3MiLCJfb25jZUNvdW50RGVjcyIsIl9ub3JtYWxDb3VudERlY3MiLCJvbmNlQ291bnQiLCJub3JtYWxDb3VudCIsIm9uT25jZSIsIm9uTm9ybWFsIiwiQ2FwdHVyZUxpc3RlbmVyRWxlbWVudCIsIl9pbml0X29yZGVyIiwiX2luaXRQcm90bzQiLCJfaW5pdFN0YXRpYzQiLCJfb25DYXB0dXJlRGVjcyIsIl9vbkJ1YmJsZURlY3MiLCJfb3JkZXJEZWNzIiwiQXJyYXkiLCJjYXB0dXJlIiwib3JkZXIiLCJvbkNhcHR1cmUiLCJvbkJ1YmJsZSIsImNoaWxkIiwibGVuZ3RoIiwiTWl4ZWRPcHRpb25zRWxlbWVudCIsIl9pbml0X25vcm1hbENvdW50MiIsIl9pbml0X3Bhc3NpdmVDb3VudCIsIl9pbml0X29uY2VDb3VudDIiLCJfaW5pdFByb3RvNSIsIl9pbml0U3RhdGljNSIsIl9vbk5vcm1hbERlY3MyIiwiX29uUGFzc2l2ZURlY3MiLCJfb25PbmNlRGVjczIiLCJfbm9ybWFsQ291bnREZWNzMiIsIl9wYXNzaXZlQ291bnREZWNzIiwiX29uY2VDb3VudERlY3MyIiwicGFzc2l2ZSIsInBhc3NpdmVDb3VudCIsIm9uUGFzc2l2ZSJdLCJzb3VyY2VzIjpbInRlc3QtbGlzdGVuZXJzLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHksIGxpc3RlbmVyLCBodG1sIH0gZnJvbSAnLi4veC1lbGVtZW50LW5leHQuanMnO1xuXG5jbGFzcyBUZXN0RWxlbWVudENoaWxkIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICBjb25zdCBldmVudFR5cGUgPSAnY29ubmVjdGVkJztcbiAgICBjb25zdCBldmVudERhdGEgPSB7IGJ1YmJsZXM6IHRydWUsIGNvbXBvc2VkOiB0cnVlIH07XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudFR5cGUsIGV2ZW50RGF0YSkpO1xuICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1jaGlsZCcsIFRlc3RFbGVtZW50Q2hpbGQpO1xuXG5jbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMCxcbiAgfSlcbiAgYWNjZXNzb3IgY2xpY2tzO1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDAsXG4gIH0pXG4gIGFjY2Vzc29yIGNvbm5lY3Rpb25zO1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDAsXG4gIH0pXG4gIGFjY2Vzc29yIGNvdW50O1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDAsXG4gIH0pXG4gIGFjY2Vzc29yIGN1c3RvbUV2ZW50Q291bnQ7XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogKCkgPT4gMCxcbiAgfSlcbiAgYWNjZXNzb3IgY3VzdG9tRXZlbnRPbmNlQ291bnQ7XG5cbiAgQGxpc3RlbmVyKCdjbGljaycpXG4gIHN0YXRpYyBvbkNsaWNrKGhvc3QsIGV2dCkge1xuICAgIGhvc3QuY2xpY2tzKys7XG4gICAgaWYgKGV2dC50YXJnZXQuaWQgPT09ICdpbmNyZW1lbnQnKSB7XG4gICAgICBob3N0LmNvdW50Kys7XG4gICAgfSBlbHNlIGlmIChldnQudGFyZ2V0LmlkID09PSAnZGVjcmVtZW50Jykge1xuICAgICAgaG9zdC5jb3VudC0tO1xuICAgIH1cbiAgfVxuXG4gIEBsaXN0ZW5lcignY29ubmVjdGVkJylcbiAgc3RhdGljIG9uQ29ubmVjdGVkKGhvc3QpIHtcbiAgICBob3N0LmNvbm5lY3Rpb25zKys7XG4gIH1cblxuICBzdGF0aWMgb25DdXN0b21FdmVudE9uY2UoaG9zdCkge1xuICAgIGlmICh0aGlzID09PSBUZXN0RWxlbWVudCAmJiBob3N0LmNvbnN0cnVjdG9yID09PSBUZXN0RWxlbWVudCkge1xuICAgICAgaG9zdC5jdXN0b21FdmVudE9uY2VDb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBvbkN1c3RvbUV2ZW50KGhvc3QpIHtcbiAgICBpZiAodGhpcyA9PT0gVGVzdEVsZW1lbnQgJiYgaG9zdC5jb25zdHJ1Y3RvciA9PT0gVGVzdEVsZW1lbnQpIHtcbiAgICAgIGhvc3QuY3VzdG9tRXZlbnRDb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgXG4gICAgICA8YnV0dG9uIGlkPVwiaW5jcmVtZW50XCIgdHlwZT1cImJ1dHRvblwiPis8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJkZWNyZW1lbnRcIiB0eXBlPVwiYnV0dG9uXCI+LTwvYnV0dG9uPlxuICAgICAgPHNwYW4+Y2xpY2tzOiAke2hvc3QuY2xpY2tzfSBjb3VudCAke2hvc3QuY291bnR9PC9zcGFuPlxuICAgICAgPGRpdiBpZD1cImN1c3RvbS1ldmVudC1lbWl0dGVyXCI+PC9kaXY+XG4gICAgICA8dGVzdC1lbGVtZW50LWNoaWxkIGlkPVwiY29ubmVjdGVkLWV2ZW50LWVtaXR0ZXJcIj48L3Rlc3QtZWxlbWVudC1jaGlsZD5cbiAgICBgO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICB0aGlzLmxpc3Rlbih0aGlzLnNoYWRvd1Jvb3QsICdjdXN0b20tZXZlbnQnLCB0aGlzLmNvbnN0cnVjdG9yLm9uQ3VzdG9tRXZlbnRPbmNlLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgdGhpcy5saXN0ZW4odGhpcy5zaGFkb3dSb290LCAnY3VzdG9tLWV2ZW50JywgdGhpcy5jb25zdHJ1Y3Rvci5vbkN1c3RvbUV2ZW50KTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgdGhpcy51bmxpc3Rlbih0aGlzLnNoYWRvd1Jvb3QsICdjdXN0b20tZXZlbnQnLCB0aGlzLmNvbnN0cnVjdG9yLm9uQ3VzdG9tRXZlbnRPbmNlLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgdGhpcy51bmxpc3Rlbih0aGlzLnNoYWRvd1Jvb3QsICdjdXN0b20tZXZlbnQnLCB0aGlzLmNvbnN0cnVjdG9yLm9uQ3VzdG9tRXZlbnQpO1xuICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1uZXh0JywgVGVzdEVsZW1lbnQpO1xuXG5pdCgndGVzdCBsaWZlY3ljbGUnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuY2xpY2tzID09PSAwICYmIGVsLmNvdW50ID09PSAwLCAnaW5pdGlhbGl6ZWQgYXMgZXhwZWN0ZWQnKTtcblxuICBlbC5jbGljaygpO1xuICBhc3NlcnQoZWwuY2xpY2tzID09PSAwICYmIGVsLmNvdW50ID09PSAwLCAnbGlzdGVucyBvbiBzaGFkb3dSb290LCBub3QgaG9zdCcpO1xuXG4gIGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2luY3JlbWVudCcpLmNsaWNrKCk7XG4gIGFzc2VydChlbC5jbGlja3MgPT09IDEgJiYgZWwuY291bnQgPT09IDEsICdsaXN0ZW5zIHRvIGV2ZW50cycpO1xuXG4gIGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2RlY3JlbWVudCcpLmNsaWNrKCk7XG4gIGFzc2VydChlbC5jbGlja3MgPT09IDIgJiYgZWwuY291bnQgPT09IDAsICd3b3JrcyBmb3IgZGVsZWdhdGVkIGhhbmRsaW5nJyk7XG5cbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbCk7XG4gIGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2luY3JlbWVudCcpLmNsaWNrKCk7XG4gIGFzc2VydChlbC5jbGlja3MgPT09IDIgJiYgZWwuY291bnQgPT09IDAsICdyZW1vdmVzIGxpc3RlbmVycyBvbiBkaXNjb25uZWN0Jyk7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBlbC5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdpbmNyZW1lbnQnKS5jbGljaygpO1xuICBhc3NlcnQoZWwuY2xpY2tzID09PSAzICYmIGVsLmNvdW50ID09PSAxLCAnYWRkcyBiYWNrIGxpc3RlbmVycyBvbiByZWNvbm5lY3QnKTtcbn0pO1xuXG5pdCgndGVzdCBjb25uZWN0ZWRDYWxsYmFjayBsaWZlY3ljbGUnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBjb25zdCBldmVudEVtaXR0ZXIgPSBlbC5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdjdXN0b20tZXZlbnQtZW1pdHRlcicpO1xuICBldmVudEVtaXR0ZXIuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2N1c3RvbS1ldmVudCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGFzc2VydChlbC5jdXN0b21FdmVudE9uY2VDb3VudCA9PT0gMSk7XG4gIGFzc2VydChlbC5jdXN0b21FdmVudENvdW50ID09PSAxKTtcbiAgZXZlbnRFbWl0dGVyLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjdXN0b20tZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBhc3NlcnQoZWwuY3VzdG9tRXZlbnRPbmNlQ291bnQgPT09IDEpO1xuICBhc3NlcnQoZWwuY3VzdG9tRXZlbnRDb3VudCA9PT0gMik7XG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWwpO1xuICBldmVudEVtaXR0ZXIuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2N1c3RvbS1ldmVudCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGFzc2VydChlbC5jdXN0b21FdmVudE9uY2VDb3VudCA9PT0gMSk7XG4gIGFzc2VydChlbC5jdXN0b21FdmVudENvdW50ID09PSAyKTtcbn0pO1xuXG5pdCgndGVzdCBtYW51YWwgbGlmZWN5Y2xlJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgbGV0IGNvdW50ID0gMDtcbiAgY29uc3Qgb25NYW51YWxDaGVjayA9ICgpID0+IGNvdW50Kys7XG4gIGVsLmxpc3RlbihlbC5zaGFkb3dSb290LCAnbWFudWFsLWNoZWNrJywgb25NYW51YWxDaGVjayk7XG4gIGVsLnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ21hbnVhbC1jaGVjaycpKTtcbiAgZWwuc2hhZG93Um9vdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbWFudWFsLWNoZWNrJykpO1xuICBhc3NlcnQoY291bnQgPT09IDIsICdsaXN0ZW5lciB3YXMgYWRkZWQnKTtcbiAgZWwudW5saXN0ZW4oZWwuc2hhZG93Um9vdCwgJ21hbnVhbC1jaGVjaycsIG9uTWFudWFsQ2hlY2spO1xuICBlbC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdtYW51YWwtY2hlY2snKSk7XG4gIGFzc2VydChjb3VudCA9PT0gMiwgJ2xpc3RlbmVyIHdhcyByZW1vdmVkJyk7XG59KTtcblxuaXQoJ3Rlc3Qgc3luY2hyb25vdXMgZXZlbnQgaGFuZGxpbmcnLCAoKSA9PiB7XG4gIC8vIFRoaXMgaXMgc3VidGxlLCBidXQgaXQgdGVzdHMgdGhhdCBpZiBjaGlsZCBlbGVtZW50cyBlbWl0IGV2ZW50c1xuICAvLyAgc3luY2hyb25vdXNseSBpbiB0aGVpciBmaXJzdCByZW5kZXIsIGRlbGVnYXRlZCBldmVudCBsaXN0ZW5pbmcgZnJvbSB0aGVcbiAgLy8gIHBhcmVudCB3aWxsIHN0aWxsIHdvcmsuXG4gIGxldCBjb3VudCA9IDA7XG4gIGNvbnN0IGRvY3VtZW50TGlzdGVuZXIgPSAoKSA9PiBjb3VudCsrO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb25uZWN0ZWQnLCBkb2N1bWVudExpc3RlbmVyKTtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChjb3VudCA9PT0gMSk7XG4gIGFzc2VydChlbC5jb25uZWN0aW9ucyA9PT0gY291bnQpO1xufSk7XG5cbml0KCd0aHJvd3MgZm9yIGJhZCBlbGVtZW50IG9uIGxpc3RlbicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwubGlzdGVuKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCBlbGVtZW50IHBhc3NlZCB0byBsaXN0ZW4gKGV4cGVjdGVkIEV2ZW50VGFyZ2V0LCBnb3QgVW5kZWZpbmVkKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCd0aHJvd3MgZm9yIGJhZCB0eXBlIG9uIGxpc3RlbicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwubGlzdGVuKGVsKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHR5cGUgcGFzc2VkIHRvIGxpc3RlbiAoZXhwZWN0ZWQgU3RyaW5nLCBnb3QgVW5kZWZpbmVkKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCd0aHJvd3MgZm9yIGJhZCBjYWxsYmFjayBvbiBsaXN0ZW4nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmxpc3RlbihlbC5zaGFkb3dSb290LCAndGVzdCcpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1VuZXhwZWN0ZWQgY2FsbGJhY2sgcGFzc2VkIHRvIGxpc3RlbiAoZXhwZWN0ZWQgRnVuY3Rpb24sIGdvdCBVbmRlZmluZWQpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3Rocm93cyBmb3IgYmFkIG9wdGlvbnMgb24gbGlzdGVuJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5saXN0ZW4oZWwuc2hhZG93Um9vdCwgJ3Rlc3QnLCAoKSA9PiB7fSwgdHJ1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCBvcHRpb25zIHBhc3NlZCB0byBsaXN0ZW4gKGV4cGVjdGVkIE9iamVjdCwgZ290IEJvb2xlYW4pLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3Rocm93cyBmb3IgYmFkIGVsZW1lbnQgb24gdW5saXN0ZW4nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLnVubGlzdGVuKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCBlbGVtZW50IHBhc3NlZCB0byB1bmxpc3RlbiAoZXhwZWN0ZWQgRXZlbnRUYXJnZXQsIGdvdCBVbmRlZmluZWQpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3Rocm93cyBmb3IgYmFkIHR5cGUgb24gdW5saXN0ZW4nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLnVubGlzdGVuKGVsKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHR5cGUgcGFzc2VkIHRvIHVubGlzdGVuIChleHBlY3RlZCBTdHJpbmcsIGdvdCBVbmRlZmluZWQpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3Rocm93cyBmb3IgYmFkIGNhbGxiYWNrIG9uIHVubGlzdGVuJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC51bmxpc3RlbihlbC5zaGFkb3dSb290LCAndGVzdCcpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1VuZXhwZWN0ZWQgY2FsbGJhY2sgcGFzc2VkIHRvIHVubGlzdGVuIChleHBlY3RlZCBGdW5jdGlvbiwgZ290IFVuZGVmaW5lZCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgndGhyb3dzIGZvciBiYWQgb3B0aW9ucyBvbiB1bmxpc3RlbicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwudW5saXN0ZW4oZWwuc2hhZG93Um9vdCwgJ3Rlc3QnLCAoKSA9PiB7fSwgdHJ1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCBvcHRpb25zIHBhc3NlZCB0byB1bmxpc3RlbiAoZXhwZWN0ZWQgT2JqZWN0LCBnb3QgQm9vbGVhbikuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUZXN0IG11bHRpcGxlIGxpc3RlbmVycyBmb3Igc2FtZSBldmVudCB0eXBlXG5jbGFzcyBNdWx0aUxpc3RlbmVyRWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAwIH0pXG4gIGFjY2Vzc29yIGNvdW50MTtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDAgfSlcbiAgYWNjZXNzb3IgY291bnQyO1xuXG4gIEBsaXN0ZW5lcigndGVzdC1ldmVudCcpXG4gIHN0YXRpYyBvblRlc3RFdmVudDEoaG9zdCkge1xuICAgIGhvc3QuY291bnQxKys7XG4gIH1cblxuICBAbGlzdGVuZXIoJ3Rlc3QtZXZlbnQnKVxuICBzdGF0aWMgb25UZXN0RXZlbnQyKGhvc3QpIHtcbiAgICBob3N0LmNvdW50MisrO1xuICB9XG5cbiAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICByZXR1cm4gaHRtbGA8ZGl2PiR7aG9zdC5jb3VudDF9LSR7aG9zdC5jb3VudDJ9PC9kaXY+YDtcbiAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LW11bHRpLWxpc3RlbmVyJywgTXVsdGlMaXN0ZW5lckVsZW1lbnQpO1xuXG5pdCgnbXVsdGlwbGUgbGlzdGVuZXJzIGZvciBzYW1lIGV2ZW50IHR5cGUnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1tdWx0aS1saXN0ZW5lcicpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5jb3VudDEgPT09IDAgJiYgZWwuY291bnQyID09PSAwLCAnY291bnRlcnMgc3RhcnQgYXQgMCcpO1xuXG4gIGVsLnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Rlc3QtZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBhc3NlcnQoZWwuY291bnQxID09PSAxICYmIGVsLmNvdW50MiA9PT0gMSwgJ2JvdGggbGlzdGVuZXJzIGZpcmUnKTtcblxuICBlbC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd0ZXN0LWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgYXNzZXJ0KGVsLmNvdW50MSA9PT0gMiAmJiBlbC5jb3VudDIgPT09IDIsICdib3RoIGxpc3RlbmVycyBmaXJlIG9uIHJlcGVhdCcpO1xuXG4gIGVsLnJlbW92ZSgpO1xufSk7XG5cbi8vIFRlc3QgbGlzdGVuZXIgd2l0aCBvbmNlIG9wdGlvblxuY2xhc3MgT25jZUxpc3RlbmVyRWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAwIH0pXG4gIGFjY2Vzc29yIG9uY2VDb3VudDtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDAgfSlcbiAgYWNjZXNzb3Igbm9ybWFsQ291bnQ7XG5cbiAgQGxpc3RlbmVyKCd0ZXN0LWV2ZW50JywgeyBvbmNlOiB0cnVlIH0pXG4gIHN0YXRpYyBvbk9uY2UoaG9zdCkge1xuICAgIGhvc3Qub25jZUNvdW50Kys7XG4gIH1cblxuICBAbGlzdGVuZXIoJ3Rlc3QtZXZlbnQnKVxuICBzdGF0aWMgb25Ob3JtYWwoaG9zdCkge1xuICAgIGhvc3Qubm9ybWFsQ291bnQrKztcbiAgfVxuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3Qub25jZUNvdW50fS0ke2hvc3Qubm9ybWFsQ291bnR9PC9kaXY+YDtcbiAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LW9uY2UtbGlzdGVuZXInLCBPbmNlTGlzdGVuZXJFbGVtZW50KTtcblxuaXQoJ2xpc3RlbmVyIHdpdGggb25jZSBvcHRpb24gZmlyZXMgb25jZSBvbmx5JywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3Qtb25jZS1saXN0ZW5lcicpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG5cbiAgZWwuc2hhZG93Um9vdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndGVzdC1ldmVudCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGFzc2VydChlbC5vbmNlQ291bnQgPT09IDEgJiYgZWwubm9ybWFsQ291bnQgPT09IDEsICdib3RoIGZpcmUgb24gZmlyc3QgZXZlbnQnKTtcblxuICBlbC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd0ZXN0LWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgYXNzZXJ0KGVsLm9uY2VDb3VudCA9PT0gMSAmJiBlbC5ub3JtYWxDb3VudCA9PT0gMiwgJ29uY2UgbGlzdGVuZXIgc3RvcHMsIG5vcm1hbCBjb250aW51ZXMnKTtcblxuICBlbC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd0ZXN0LWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgYXNzZXJ0KGVsLm9uY2VDb3VudCA9PT0gMSAmJiBlbC5ub3JtYWxDb3VudCA9PT0gMywgJ29uY2UgbGlzdGVuZXIgc3RpbGwgc3RvcHBlZCcpO1xuXG4gIGVsLnJlbW92ZSgpO1xufSk7XG5cbi8vIFRlc3QgbGlzdGVuZXIgd2l0aCBjYXB0dXJlIG9wdGlvblxuY2xhc3MgQ2FwdHVyZUxpc3RlbmVyRWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogQXJyYXksIGluaXRpYWw6ICgpID0+IFtdIH0pXG4gIGFjY2Vzc29yIG9yZGVyO1xuXG4gIEBsaXN0ZW5lcigndGVzdC1ldmVudCcsIHsgY2FwdHVyZTogdHJ1ZSB9KVxuICBzdGF0aWMgb25DYXB0dXJlKGhvc3QpIHtcbiAgICBob3N0Lm9yZGVyID0gWy4uLmhvc3Qub3JkZXIsICdjYXB0dXJlJ107XG4gIH1cblxuICBAbGlzdGVuZXIoJ3Rlc3QtZXZlbnQnKVxuICBzdGF0aWMgb25CdWJibGUoaG9zdCkge1xuICAgIGhvc3Qub3JkZXIgPSBbLi4uaG9zdC5vcmRlciwgJ2J1YmJsZSddO1xuICB9XG5cbiAgc3RhdGljIHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBodG1sYDxkaXYgaWQ9XCJjaGlsZFwiPjwvZGl2PmA7XG4gIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1jYXB0dXJlLWxpc3RlbmVyJywgQ2FwdHVyZUxpc3RlbmVyRWxlbWVudCk7XG5cbml0KCdsaXN0ZW5lciB3aXRoIGNhcHR1cmUgb3B0aW9uIGZpcmVzIGluIGNhcHR1cmUgcGhhc2UnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1jYXB0dXJlLWxpc3RlbmVyJyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcblxuICBjb25zdCBjaGlsZCA9IGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2NoaWxkJyk7XG4gIGNoaWxkLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd0ZXN0LWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcblxuICBhc3NlcnQoZWwub3JkZXIubGVuZ3RoID09PSAyLCAnYm90aCBsaXN0ZW5lcnMgZmlyZWQnKTtcbiAgYXNzZXJ0KGVsLm9yZGVyWzBdID09PSAnY2FwdHVyZScsICdjYXB0dXJlIGxpc3RlbmVyIGZpcmVkIGZpcnN0Jyk7XG4gIGFzc2VydChlbC5vcmRlclsxXSA9PT0gJ2J1YmJsZScsICdidWJibGUgbGlzdGVuZXIgZmlyZWQgc2Vjb25kJyk7XG5cbiAgZWwucmVtb3ZlKCk7XG59KTtcblxuLy8gVGVzdCBtdWx0aXBsZSBsaXN0ZW5lcnMgd2l0aCBkaWZmZXJlbnQgb3B0aW9uc1xuY2xhc3MgTWl4ZWRPcHRpb25zRWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAwIH0pXG4gIGFjY2Vzc29yIG5vcm1hbENvdW50O1xuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IE51bWJlciwgaW5pdGlhbDogMCB9KVxuICBhY2Nlc3NvciBwYXNzaXZlQ291bnQ7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAwIH0pXG4gIGFjY2Vzc29yIG9uY2VDb3VudDtcblxuICBAbGlzdGVuZXIoJ3Rlc3QtZXZlbnQnKVxuICBzdGF0aWMgb25Ob3JtYWwoaG9zdCkge1xuICAgIGhvc3Qubm9ybWFsQ291bnQrKztcbiAgfVxuXG4gIEBsaXN0ZW5lcigndGVzdC1ldmVudCcsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuICBzdGF0aWMgb25QYXNzaXZlKGhvc3QpIHtcbiAgICBob3N0LnBhc3NpdmVDb3VudCsrO1xuICB9XG5cbiAgQGxpc3RlbmVyKCd0ZXN0LWV2ZW50JywgeyBvbmNlOiB0cnVlIH0pXG4gIHN0YXRpYyBvbk9uY2UoaG9zdCkge1xuICAgIGhvc3Qub25jZUNvdW50Kys7XG4gIH1cblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0Lm5vcm1hbENvdW50fS0ke2hvc3QucGFzc2l2ZUNvdW50fS0ke2hvc3Qub25jZUNvdW50fTwvZGl2PmA7XG4gIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1taXhlZC1vcHRpb25zJywgTWl4ZWRPcHRpb25zRWxlbWVudCk7XG5cbml0KCdtdWx0aXBsZSBsaXN0ZW5lcnMgd2l0aCBkaWZmZXJlbnQgb3B0aW9ucycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LW1peGVkLW9wdGlvbnMnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuXG4gIGVsLnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Rlc3QtZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBhc3NlcnQoZWwubm9ybWFsQ291bnQgPT09IDEsICdub3JtYWwgbGlzdGVuZXIgZmlyZXMnKTtcbiAgYXNzZXJ0KGVsLnBhc3NpdmVDb3VudCA9PT0gMSwgJ3Bhc3NpdmUgbGlzdGVuZXIgZmlyZXMnKTtcbiAgYXNzZXJ0KGVsLm9uY2VDb3VudCA9PT0gMSwgJ29uY2UgbGlzdGVuZXIgZmlyZXMnKTtcblxuICBlbC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd0ZXN0LWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgYXNzZXJ0KGVsLm5vcm1hbENvdW50ID09PSAyLCAnbm9ybWFsIGxpc3RlbmVyIGZpcmVzIGFnYWluJyk7XG4gIGFzc2VydChlbC5wYXNzaXZlQ291bnQgPT09IDIsICdwYXNzaXZlIGxpc3RlbmVyIGZpcmVzIGFnYWluJyk7XG4gIGFzc2VydChlbC5vbmNlQ291bnQgPT09IDEsICdvbmNlIGxpc3RlbmVyIGRvZXMgbm90IGZpcmUgYWdhaW4nKTtcblxuICBlbC5yZW1vdmUoKTtcbn0pO1xuXG4vLyBUZXN0IGRpc2Nvbm5lY3Rpb24gcmVtb3ZlcyBhbGwgbXVsdGlwbGUgbGlzdGVuZXJzXG5pdCgnZGlzY29ubmVjdGlvbiByZW1vdmVzIGFsbCBtdWx0aXBsZSBsaXN0ZW5lcnMnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1tdWx0aS1saXN0ZW5lcicpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG5cbiAgZWwuc2hhZG93Um9vdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndGVzdC1ldmVudCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGFzc2VydChlbC5jb3VudDEgPT09IDEgJiYgZWwuY291bnQyID09PSAxLCAnYm90aCBsaXN0ZW5lcnMgd29yayB3aGVuIGNvbm5lY3RlZCcpO1xuXG4gIGVsLnJlbW92ZSgpO1xuICBlbC5jb3VudDEgPSAwO1xuICBlbC5jb3VudDIgPSAwO1xuXG4gIGVsLnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Rlc3QtZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBhc3NlcnQoZWwuY291bnQxID09PSAwICYmIGVsLmNvdW50MiA9PT0gMCwgJ25laXRoZXIgbGlzdGVuZXIgZmlyZXMgd2hlbiBkaXNjb25uZWN0ZWQnKTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGVsLnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Rlc3QtZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBhc3NlcnQoZWwuY291bnQxID09PSAxICYmIGVsLmNvdW50MiA9PT0gMSwgJ2JvdGggbGlzdGVuZXJzIHdvcmsgYWdhaW4gd2hlbiByZWNvbm5lY3RlZCcpO1xuXG4gIGVsLnJlbW92ZSgpO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFNBQVNBLE1BQU0sRUFBRUMsRUFBRSxRQUFRLDJCQUEyQjtBQUN0RCxTQUFTQyxRQUFRLEVBQUVDLFFBQVEsRUFBRUMsUUFBUSxFQUFFQyxJQUFJLFFBQVEsc0JBQXNCO0FBRXpFLE1BQU1DLGdCQUFnQixTQUFTQyxXQUFXLENBQUM7RUFDekNDLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCLE1BQU1DLFNBQVMsR0FBRyxXQUFXO0lBQzdCLE1BQU1DLFNBQVMsR0FBRztNQUFFQyxPQUFPLEVBQUUsSUFBSTtNQUFFQyxRQUFRLEVBQUU7SUFBSyxDQUFDO0lBQ25ELElBQUksQ0FBQ0MsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQ0wsU0FBUyxFQUFFQyxTQUFTLENBQUMsQ0FBQztFQUMzRDtBQUNGO0FBQ0FLLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLG9CQUFvQixFQUFFVixnQkFBZ0IsQ0FBQztBQUU3RCxNQUFNVyxXQUFXLFNBQVNmLFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQWdCLFlBQUEsRUFBQUMsaUJBQUEsRUFBQUMsV0FBQSxFQUFBQyxzQkFBQSxFQUFBQywwQkFBQSxFQUFBQyxVQUFBLEVBQUFDLFdBQUEsSUFBQUMsVUFBQSxTQUFBQyxZQUFBLG1CQUFBQyxnQkFBQSx1QkFBQUMsV0FBQSxpQkFBQUMsZ0JBQUEsc0JBQUFDLFVBQUEsZ0JBQUFDLHFCQUFBLDJCQUFBQyx5QkFBQSw4Q0FBVDlCLFFBQVEsRUFBQStCLENBQUE7SUFBQVQsV0FBQTtFQUFBO0VBQUEsQ0FBQVUsQ0FBQSxJQUFBWCxVQUFBLFFBQUFMLFlBQUE7RUFBQSxNQUFBVSxXQUFBLEdBQy9CekIsUUFBUSxDQUFDO0lBQ1JnQyxJQUFJLEVBQUVDLE1BQU07SUFDWkMsT0FBTyxFQUFFO0VBQ1gsQ0FBQyxDQUFDLEVBQUFSLGdCQUFBLEdBR0QxQixRQUFRLENBQUM7SUFDUmdDLElBQUksRUFBRUMsTUFBTTtJQUNaQyxPQUFPLEVBQUU7RUFDWCxDQUFDLENBQUMsRUFBQVAsVUFBQSxHQUdEM0IsUUFBUSxDQUFDO0lBQ1JnQyxJQUFJLEVBQUVDLE1BQU07SUFDWkMsT0FBTyxFQUFFO0VBQ1gsQ0FBQyxDQUFDLEVBQUFOLHFCQUFBLEdBR0Q1QixRQUFRLENBQUM7SUFDUmdDLElBQUksRUFBRUMsTUFBTTtJQUNaQyxPQUFPLEVBQUU7RUFDWCxDQUFDLENBQUMsRUFBQUwseUJBQUEsR0FHRDdCLFFBQVEsQ0FBQztJQUNSZ0MsSUFBSSxFQUFFQyxNQUFNO0lBQ1pDLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO0VBQ2pCLENBQUMsQ0FBQyxFQUFBWCxZQUFBLEdBR0R0QixRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUF1QixnQkFBQSxHQVVqQnZCLFFBQVEsQ0FBQyxXQUFXLENBQUM7SUFBQSxhQUFBOEIsQ0FBQTtFQUFBO0VBQUEsSUFwQ2JJLE1BQU1BLENBQUFDLENBQUE7SUFBQSxNQUFBTCxDQUFBLEdBQUFLLENBQUE7RUFBQTtFQUFBLENBQUFDLENBQUEsR0FBQXJCLGlCQUFBO0VBQUEsSUFNTnNCLFdBQVdBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFYQyxXQUFXQSxDQUFBRixDQUFBO0lBQUEsTUFBQUMsQ0FBQSxHQUFBRCxDQUFBO0VBQUE7RUFBQSxDQUFBRyxDQUFBLEdBQUF0QixXQUFBO0VBQUEsSUFNWHVCLEtBQUtBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFMQyxLQUFLQSxDQUFBSixDQUFBO0lBQUEsTUFBQUcsQ0FBQSxHQUFBSCxDQUFBO0VBQUE7RUFBQSxDQUFBSyxDQUFBLEdBQUF2QixzQkFBQTtFQUFBLElBTUx3QixnQkFBZ0JBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFoQkMsZ0JBQWdCQSxDQUFBTixDQUFBO0lBQUEsTUFBQUssQ0FBQSxHQUFBTCxDQUFBO0VBQUE7RUFBQSxDQUFBTyxDQUFBLEdBQUF4QiwwQkFBQTtFQUFBLElBTWhCeUIsb0JBQW9CQSxDQUFBO0lBQUEsYUFBQUQsQ0FBQTtFQUFBO0VBQUEsSUFBcEJDLG9CQUFvQkEsQ0FBQVIsQ0FBQTtJQUFBLE1BQUFPLENBQUEsR0FBQVAsQ0FBQTtFQUFBO0VBRTdCLE9BQ09TLE9BQU9BLENBQUNDLElBQUksRUFBRUMsR0FBRyxFQUFFO0lBQ3hCRCxJQUFJLENBQUNYLE1BQU0sRUFBRTtJQUNiLElBQUlZLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDQyxFQUFFLEtBQUssV0FBVyxFQUFFO01BQ2pDSCxJQUFJLENBQUNOLEtBQUssRUFBRTtJQUNkLENBQUMsTUFBTSxJQUFJTyxHQUFHLENBQUNDLE1BQU0sQ0FBQ0MsRUFBRSxLQUFLLFdBQVcsRUFBRTtNQUN4Q0gsSUFBSSxDQUFDTixLQUFLLEVBQUU7SUFDZDtFQUNGO0VBRUEsT0FDT1UsV0FBV0EsQ0FBQ0osSUFBSSxFQUFFO0lBQ3ZCQSxJQUFJLENBQUNSLFdBQVcsRUFBRTtFQUNwQjtFQUVBLE9BQU9hLGlCQUFpQkEsQ0FBQ0wsSUFBSSxFQUFFO0lBQzdCLElBQUksSUFBSSxLQUFLaEMsV0FBVyxJQUFJZ0MsSUFBSSxDQUFDTSxXQUFXLEtBQUt0QyxXQUFXLEVBQUU7TUFDNURnQyxJQUFJLENBQUNGLG9CQUFvQixFQUFFO0lBQzdCO0VBQ0Y7RUFFQSxPQUFPUyxhQUFhQSxDQUFDUCxJQUFJLEVBQUU7SUFDekIsSUFBSSxJQUFJLEtBQUtoQyxXQUFXLElBQUlnQyxJQUFJLENBQUNNLFdBQVcsS0FBS3RDLFdBQVcsRUFBRTtNQUM1RGdDLElBQUksQ0FBQ0osZ0JBQWdCLEVBQUU7SUFDekI7RUFDRjtFQUVBLE9BQU9ZLFFBQVFBLENBQUNSLElBQUksRUFBRTtJQUNwQixPQUFPNUMsSUFBSTtBQUNmO0FBQ0E7QUFDQSxzQkFBc0I0QyxJQUFJLENBQUNYLE1BQU0sVUFBVVcsSUFBSSxDQUFDTixLQUFLO0FBQ3JEO0FBQ0E7QUFDQSxLQUFLO0VBQ0g7RUFFQW5DLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCLEtBQUssQ0FBQ0EsaUJBQWlCLENBQUMsQ0FBQztJQUN6QixJQUFJLENBQUNrRCxNQUFNLENBQUMsSUFBSSxDQUFDQyxVQUFVLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQ0osV0FBVyxDQUFDRCxpQkFBaUIsRUFBRTtNQUFFTSxJQUFJLEVBQUU7SUFBSyxDQUFDLENBQUM7SUFDaEcsSUFBSSxDQUFDRixNQUFNLENBQUMsSUFBSSxDQUFDQyxVQUFVLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQ0osV0FBVyxDQUFDQyxhQUFhLENBQUM7RUFDOUU7RUFFQUssb0JBQW9CQSxDQUFBLEVBQUc7SUFDckIsS0FBSyxDQUFDQSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzVCLElBQUksQ0FBQ0MsUUFBUSxDQUFDLElBQUksQ0FBQ0gsVUFBVSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUNKLFdBQVcsQ0FBQ0QsaUJBQWlCLEVBQUU7TUFBRU0sSUFBSSxFQUFFO0lBQUssQ0FBQyxDQUFDO0lBQ2xHLElBQUksQ0FBQ0UsUUFBUSxDQUFDLElBQUksQ0FBQ0gsVUFBVSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUNKLFdBQVcsQ0FBQ0MsYUFBYSxDQUFDO0VBQ2hGO0FBQ0Y7QUFDQXpDLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLG1CQUFtQixFQUFFQyxXQUFXLENBQUM7QUFFdkRoQixFQUFFLENBQUMsZ0JBQWdCLEVBQUUsTUFBTTtFQUN6QixNQUFNOEQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCL0QsTUFBTSxDQUFDK0QsRUFBRSxDQUFDekIsTUFBTSxLQUFLLENBQUMsSUFBSXlCLEVBQUUsQ0FBQ3BCLEtBQUssS0FBSyxDQUFDLEVBQUUseUJBQXlCLENBQUM7RUFFcEVvQixFQUFFLENBQUNLLEtBQUssQ0FBQyxDQUFDO0VBQ1ZwRSxNQUFNLENBQUMrRCxFQUFFLENBQUN6QixNQUFNLEtBQUssQ0FBQyxJQUFJeUIsRUFBRSxDQUFDcEIsS0FBSyxLQUFLLENBQUMsRUFBRSxpQ0FBaUMsQ0FBQztFQUU1RW9CLEVBQUUsQ0FBQ0osVUFBVSxDQUFDVSxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUNELEtBQUssQ0FBQyxDQUFDO0VBQ2pEcEUsTUFBTSxDQUFDK0QsRUFBRSxDQUFDekIsTUFBTSxLQUFLLENBQUMsSUFBSXlCLEVBQUUsQ0FBQ3BCLEtBQUssS0FBSyxDQUFDLEVBQUUsbUJBQW1CLENBQUM7RUFFOURvQixFQUFFLENBQUNKLFVBQVUsQ0FBQ1UsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDRCxLQUFLLENBQUMsQ0FBQztFQUNqRHBFLE1BQU0sQ0FBQytELEVBQUUsQ0FBQ3pCLE1BQU0sS0FBSyxDQUFDLElBQUl5QixFQUFFLENBQUNwQixLQUFLLEtBQUssQ0FBQyxFQUFFLDhCQUE4QixDQUFDO0VBRXpFcUIsUUFBUSxDQUFDRSxJQUFJLENBQUNJLFdBQVcsQ0FBQ1AsRUFBRSxDQUFDO0VBQzdCQSxFQUFFLENBQUNKLFVBQVUsQ0FBQ1UsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDRCxLQUFLLENBQUMsQ0FBQztFQUNqRHBFLE1BQU0sQ0FBQytELEVBQUUsQ0FBQ3pCLE1BQU0sS0FBSyxDQUFDLElBQUl5QixFQUFFLENBQUNwQixLQUFLLEtBQUssQ0FBQyxFQUFFLGlDQUFpQyxDQUFDO0VBRTVFcUIsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCQSxFQUFFLENBQUNKLFVBQVUsQ0FBQ1UsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDRCxLQUFLLENBQUMsQ0FBQztFQUNqRHBFLE1BQU0sQ0FBQytELEVBQUUsQ0FBQ3pCLE1BQU0sS0FBSyxDQUFDLElBQUl5QixFQUFFLENBQUNwQixLQUFLLEtBQUssQ0FBQyxFQUFFLGtDQUFrQyxDQUFDO0FBQy9FLENBQUMsQ0FBQztBQUVGMUMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLE1BQU07RUFDM0MsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixNQUFNUSxZQUFZLEdBQUdSLEVBQUUsQ0FBQ0osVUFBVSxDQUFDVSxjQUFjLENBQUMsc0JBQXNCLENBQUM7RUFDekVFLFlBQVksQ0FBQzFELGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsY0FBYyxFQUFFO0lBQUVILE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBQzlFWCxNQUFNLENBQUMrRCxFQUFFLENBQUNoQixvQkFBb0IsS0FBSyxDQUFDLENBQUM7RUFDckMvQyxNQUFNLENBQUMrRCxFQUFFLENBQUNsQixnQkFBZ0IsS0FBSyxDQUFDLENBQUM7RUFDakMwQixZQUFZLENBQUMxRCxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLGNBQWMsRUFBRTtJQUFFSCxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FBQztFQUM5RVgsTUFBTSxDQUFDK0QsRUFBRSxDQUFDaEIsb0JBQW9CLEtBQUssQ0FBQyxDQUFDO0VBQ3JDL0MsTUFBTSxDQUFDK0QsRUFBRSxDQUFDbEIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDO0VBQ2pDbUIsUUFBUSxDQUFDRSxJQUFJLENBQUNJLFdBQVcsQ0FBQ1AsRUFBRSxDQUFDO0VBQzdCUSxZQUFZLENBQUMxRCxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLGNBQWMsRUFBRTtJQUFFSCxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FBQztFQUM5RVgsTUFBTSxDQUFDK0QsRUFBRSxDQUFDaEIsb0JBQW9CLEtBQUssQ0FBQyxDQUFDO0VBQ3JDL0MsTUFBTSxDQUFDK0QsRUFBRSxDQUFDbEIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGNUMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLE1BQU07RUFDaEMsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixJQUFJcEIsS0FBSyxHQUFHLENBQUM7RUFDYixNQUFNNkIsYUFBYSxHQUFHQSxDQUFBLEtBQU03QixLQUFLLEVBQUU7RUFDbkNvQixFQUFFLENBQUNMLE1BQU0sQ0FBQ0ssRUFBRSxDQUFDSixVQUFVLEVBQUUsY0FBYyxFQUFFYSxhQUFhLENBQUM7RUFDdkRULEVBQUUsQ0FBQ0osVUFBVSxDQUFDOUMsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM1RGlELEVBQUUsQ0FBQ0osVUFBVSxDQUFDOUMsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM1RGQsTUFBTSxDQUFDMkMsS0FBSyxLQUFLLENBQUMsRUFBRSxvQkFBb0IsQ0FBQztFQUN6Q29CLEVBQUUsQ0FBQ0QsUUFBUSxDQUFDQyxFQUFFLENBQUNKLFVBQVUsRUFBRSxjQUFjLEVBQUVhLGFBQWEsQ0FBQztFQUN6RFQsRUFBRSxDQUFDSixVQUFVLENBQUM5QyxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQzVEZCxNQUFNLENBQUMyQyxLQUFLLEtBQUssQ0FBQyxFQUFFLHNCQUFzQixDQUFDO0FBQzdDLENBQUMsQ0FBQztBQUVGMUMsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLE1BQU07RUFDMUM7RUFDQTtFQUNBO0VBQ0EsSUFBSTBDLEtBQUssR0FBRyxDQUFDO0VBQ2IsTUFBTThCLGdCQUFnQixHQUFHQSxDQUFBLEtBQU05QixLQUFLLEVBQUU7RUFDdENxQixRQUFRLENBQUNVLGdCQUFnQixDQUFDLFdBQVcsRUFBRUQsZ0JBQWdCLENBQUM7RUFDeEQsTUFBTVYsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCL0QsTUFBTSxDQUFDMkMsS0FBSyxLQUFLLENBQUMsQ0FBQztFQUNuQjNDLE1BQU0sQ0FBQytELEVBQUUsQ0FBQ3RCLFdBQVcsS0FBS0UsS0FBSyxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQUVGMUMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLE1BQU07RUFDM0MsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixJQUFJWSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRmIsRUFBRSxDQUFDTCxNQUFNLENBQUMsQ0FBQztFQUNiLENBQUMsQ0FBQyxPQUFPbUIsS0FBSyxFQUFFO0lBQ2QsTUFBTUMsUUFBUSxHQUFHLDRFQUE0RTtJQUM3RkYsT0FBTyxHQUFHQyxLQUFLLENBQUNELE9BQU87SUFDdkJELE1BQU0sR0FBR0UsS0FBSyxDQUFDRCxPQUFPLEtBQUtFLFFBQVE7RUFDckM7RUFDQTlFLE1BQU0sQ0FBQzJFLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGM0UsRUFBRSxDQUFDLCtCQUErQixFQUFFLE1BQU07RUFDeEMsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixJQUFJWSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRmIsRUFBRSxDQUFDTCxNQUFNLENBQUNLLEVBQUUsQ0FBQztFQUNmLENBQUMsQ0FBQyxPQUFPYyxLQUFLLEVBQUU7SUFDZCxNQUFNQyxRQUFRLEdBQUcsb0VBQW9FO0lBQ3JGRixPQUFPLEdBQUdDLEtBQUssQ0FBQ0QsT0FBTztJQUN2QkQsTUFBTSxHQUFHRSxLQUFLLENBQUNELE9BQU8sS0FBS0UsUUFBUTtFQUNyQztFQUNBOUUsTUFBTSxDQUFDMkUsTUFBTSxFQUFFQyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBRUYzRSxFQUFFLENBQUMsbUNBQW1DLEVBQUUsTUFBTTtFQUM1QyxNQUFNOEQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCLElBQUlZLE1BQU0sR0FBRyxLQUFLO0VBQ2xCLElBQUlDLE9BQU8sR0FBRyxxQkFBcUI7RUFDbkMsSUFBSTtJQUNGYixFQUFFLENBQUNMLE1BQU0sQ0FBQ0ssRUFBRSxDQUFDSixVQUFVLEVBQUUsTUFBTSxDQUFDO0VBQ2xDLENBQUMsQ0FBQyxPQUFPa0IsS0FBSyxFQUFFO0lBQ2QsTUFBTUMsUUFBUSxHQUFHLDBFQUEwRTtJQUMzRkYsT0FBTyxHQUFHQyxLQUFLLENBQUNELE9BQU87SUFDdkJELE1BQU0sR0FBR0UsS0FBSyxDQUFDRCxPQUFPLEtBQUtFLFFBQVE7RUFDckM7RUFDQTlFLE1BQU0sQ0FBQzJFLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGM0UsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLE1BQU07RUFDM0MsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixJQUFJWSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRmIsRUFBRSxDQUFDTCxNQUFNLENBQUNLLEVBQUUsQ0FBQ0osVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztFQUNsRCxDQUFDLENBQUMsT0FBT2tCLEtBQUssRUFBRTtJQUNkLE1BQU1DLFFBQVEsR0FBRyxxRUFBcUU7SUFDdEZGLE9BQU8sR0FBR0MsS0FBSyxDQUFDRCxPQUFPO0lBQ3ZCRCxNQUFNLEdBQUdFLEtBQUssQ0FBQ0QsT0FBTyxLQUFLRSxRQUFRO0VBQ3JDO0VBQ0E5RSxNQUFNLENBQUMyRSxNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRjNFLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxNQUFNO0VBQzdDLE1BQU04RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEIsSUFBSVksTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSUMsT0FBTyxHQUFHLHFCQUFxQjtFQUNuQyxJQUFJO0lBQ0ZiLEVBQUUsQ0FBQ0QsUUFBUSxDQUFDLENBQUM7RUFDZixDQUFDLENBQUMsT0FBT2UsS0FBSyxFQUFFO0lBQ2QsTUFBTUMsUUFBUSxHQUFHLDhFQUE4RTtJQUMvRkYsT0FBTyxHQUFHQyxLQUFLLENBQUNELE9BQU87SUFDdkJELE1BQU0sR0FBR0UsS0FBSyxDQUFDRCxPQUFPLEtBQUtFLFFBQVE7RUFDckM7RUFDQTlFLE1BQU0sQ0FBQzJFLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGM0UsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLE1BQU07RUFDMUMsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixJQUFJWSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRmIsRUFBRSxDQUFDRCxRQUFRLENBQUNDLEVBQUUsQ0FBQztFQUNqQixDQUFDLENBQUMsT0FBT2MsS0FBSyxFQUFFO0lBQ2QsTUFBTUMsUUFBUSxHQUFHLHNFQUFzRTtJQUN2RkYsT0FBTyxHQUFHQyxLQUFLLENBQUNELE9BQU87SUFDdkJELE1BQU0sR0FBR0UsS0FBSyxDQUFDRCxPQUFPLEtBQUtFLFFBQVE7RUFDckM7RUFDQTlFLE1BQU0sQ0FBQzJFLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGM0UsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLE1BQU07RUFDOUMsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixJQUFJWSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRmIsRUFBRSxDQUFDRCxRQUFRLENBQUNDLEVBQUUsQ0FBQ0osVUFBVSxFQUFFLE1BQU0sQ0FBQztFQUNwQyxDQUFDLENBQUMsT0FBT2tCLEtBQUssRUFBRTtJQUNkLE1BQU1DLFFBQVEsR0FBRyw0RUFBNEU7SUFDN0ZGLE9BQU8sR0FBR0MsS0FBSyxDQUFDRCxPQUFPO0lBQ3ZCRCxNQUFNLEdBQUdFLEtBQUssQ0FBQ0QsT0FBTyxLQUFLRSxRQUFRO0VBQ3JDO0VBQ0E5RSxNQUFNLENBQUMyRSxNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRjNFLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxNQUFNO0VBQzdDLE1BQU04RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEIsSUFBSVksTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSUMsT0FBTyxHQUFHLHFCQUFxQjtFQUNuQyxJQUFJO0lBQ0ZiLEVBQUUsQ0FBQ0QsUUFBUSxDQUFDQyxFQUFFLENBQUNKLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7RUFDcEQsQ0FBQyxDQUFDLE9BQU9rQixLQUFLLEVBQUU7SUFDZCxNQUFNQyxRQUFRLEdBQUcsdUVBQXVFO0lBQ3hGRixPQUFPLEdBQUdDLEtBQUssQ0FBQ0QsT0FBTztJQUN2QkQsTUFBTSxHQUFHRSxLQUFLLENBQUNELE9BQU8sS0FBS0UsUUFBUTtFQUNyQztFQUNBOUUsTUFBTSxDQUFDMkUsTUFBTSxFQUFFQyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGO0FBQ0EsTUFBTUcsb0JBQW9CLFNBQVM3RSxRQUFRLENBQUM7RUFBQTtJQUFBLENBQUE4RSxZQUFBLEVBQUFDLFlBQUEsRUFBQUMsV0FBQSxFQUFBQyxZQUFBLElBQUExRCxVQUFBLFNBQUEyRCxpQkFBQSx3QkFBQUMsaUJBQUEsd0JBQUFDLFdBQUEsaUJBQUFDLFdBQUEsZ0NBQVRyRixRQUFRLEVBQUErQixDQUFBO0lBQUFrRCxZQUFBO0VBQUE7RUFBQSxDQUFBakQsQ0FBQSxJQUFBZ0QsV0FBQSxRQUFBRixZQUFBO0VBQUEsTUFBQU0sV0FBQSxHQUN4Q25GLFFBQVEsQ0FBQztJQUFFZ0MsSUFBSSxFQUFFQyxNQUFNO0lBQUVvRCxPQUFPLEVBQUU7RUFBRSxDQUFDLENBQUMsRUFBQUQsV0FBQSxHQUd0Q3BGLFFBQVEsQ0FBQztJQUFFZ0MsSUFBSSxFQUFFQyxNQUFNO0lBQUVvRCxPQUFPLEVBQUU7RUFBRSxDQUFDLENBQUMsRUFBQUosaUJBQUEsR0FHdENoRixRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUFpRixpQkFBQSxHQUt0QmpGLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFBQSxhQUFBOEIsQ0FBQTtFQUFBO0VBQUEsSUFWZHVELE1BQU1BLENBQUFsRCxDQUFBO0lBQUEsTUFBQUwsQ0FBQSxHQUFBSyxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLEdBQUF5QyxZQUFBO0VBQUEsSUFHTlMsTUFBTUEsQ0FBQTtJQUFBLGFBQUFsRCxDQUFBO0VBQUE7RUFBQSxJQUFOa0QsTUFBTUEsQ0FBQW5ELENBQUE7SUFBQSxNQUFBQyxDQUFBLEdBQUFELENBQUE7RUFBQTtFQUVmLE9BQ09vRCxZQUFZQSxDQUFDMUMsSUFBSSxFQUFFO0lBQ3hCQSxJQUFJLENBQUN3QyxNQUFNLEVBQUU7RUFDZjtFQUVBLE9BQ09HLFlBQVlBLENBQUMzQyxJQUFJLEVBQUU7SUFDeEJBLElBQUksQ0FBQ3lDLE1BQU0sRUFBRTtFQUNmO0VBRUEsT0FBT2pDLFFBQVFBLENBQUNSLElBQUksRUFBRTtJQUNwQixPQUFPNUMsSUFBSSxRQUFRNEMsSUFBSSxDQUFDd0MsTUFBTSxJQUFJeEMsSUFBSSxDQUFDeUMsTUFBTSxRQUFRO0VBQ3ZEO0FBQ0Y7QUFDQTNFLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLHFCQUFxQixFQUFFK0Qsb0JBQW9CLENBQUM7QUFFbEU5RSxFQUFFLENBQUMsd0NBQXdDLEVBQUUsTUFBTTtFQUNqRCxNQUFNOEQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztFQUN4REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCL0QsTUFBTSxDQUFDK0QsRUFBRSxDQUFDMEIsTUFBTSxLQUFLLENBQUMsSUFBSTFCLEVBQUUsQ0FBQzJCLE1BQU0sS0FBSyxDQUFDLEVBQUUscUJBQXFCLENBQUM7RUFFakUzQixFQUFFLENBQUNKLFVBQVUsQ0FBQzlDLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsWUFBWSxFQUFFO0lBQUVILE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBQzdFWCxNQUFNLENBQUMrRCxFQUFFLENBQUMwQixNQUFNLEtBQUssQ0FBQyxJQUFJMUIsRUFBRSxDQUFDMkIsTUFBTSxLQUFLLENBQUMsRUFBRSxxQkFBcUIsQ0FBQztFQUVqRTNCLEVBQUUsQ0FBQ0osVUFBVSxDQUFDOUMsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7SUFBRUgsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFDN0VYLE1BQU0sQ0FBQytELEVBQUUsQ0FBQzBCLE1BQU0sS0FBSyxDQUFDLElBQUkxQixFQUFFLENBQUMyQixNQUFNLEtBQUssQ0FBQyxFQUFFLCtCQUErQixDQUFDO0VBRTNFM0IsRUFBRSxDQUFDOEIsTUFBTSxDQUFDLENBQUM7QUFDYixDQUFDLENBQUM7O0FBRUY7QUFDQSxNQUFNQyxtQkFBbUIsU0FBUzVGLFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQTZGLGVBQUEsRUFBQUMsaUJBQUEsRUFBQUMsV0FBQSxFQUFBQyxZQUFBLElBQUF6RSxVQUFBLFNBQUEwRSxXQUFBLGtCQUFBQyxhQUFBLG9CQUFBQyxjQUFBLG9CQUFBQyxnQkFBQSxxQ0FBVHBHLFFBQVEsRUFBQStCLENBQUE7SUFBQWlFLFlBQUE7RUFBQTtFQUFBLENBQUFoRSxDQUFBLElBQUErRCxXQUFBLFFBQUFGLGVBQUE7RUFBQSxNQUFBTSxjQUFBLEdBQ3ZDbEcsUUFBUSxDQUFDO0lBQUVnQyxJQUFJLEVBQUVDLE1BQU07SUFBRW9ELE9BQU8sRUFBRTtFQUFFLENBQUMsQ0FBQyxFQUFBYyxnQkFBQSxHQUd0Q25HLFFBQVEsQ0FBQztJQUFFZ0MsSUFBSSxFQUFFQyxNQUFNO0lBQUVvRCxPQUFPLEVBQUU7RUFBRSxDQUFDLENBQUMsRUFBQVcsV0FBQSxHQUd0Qy9GLFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFBRXdELElBQUksRUFBRTtFQUFLLENBQUMsQ0FBQyxFQUFBd0MsYUFBQSxHQUt0Q2hHLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFBQSxhQUFBOEIsQ0FBQTtFQUFBO0VBQUEsSUFWZHFFLFNBQVNBLENBQUFoRSxDQUFBO0lBQUEsTUFBQUwsQ0FBQSxHQUFBSyxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLEdBQUF3RCxpQkFBQTtFQUFBLElBR1RRLFdBQVdBLENBQUE7SUFBQSxhQUFBaEUsQ0FBQTtFQUFBO0VBQUEsSUFBWGdFLFdBQVdBLENBQUFqRSxDQUFBO0lBQUEsTUFBQUMsQ0FBQSxHQUFBRCxDQUFBO0VBQUE7RUFFcEIsT0FDT2tFLE1BQU1BLENBQUN4RCxJQUFJLEVBQUU7SUFDbEJBLElBQUksQ0FBQ3NELFNBQVMsRUFBRTtFQUNsQjtFQUVBLE9BQ09HLFFBQVFBLENBQUN6RCxJQUFJLEVBQUU7SUFDcEJBLElBQUksQ0FBQ3VELFdBQVcsRUFBRTtFQUNwQjtFQUVBLE9BQU8vQyxRQUFRQSxDQUFDUixJQUFJLEVBQUU7SUFDcEIsT0FBTzVDLElBQUksUUFBUTRDLElBQUksQ0FBQ3NELFNBQVMsSUFBSXRELElBQUksQ0FBQ3VELFdBQVcsUUFBUTtFQUMvRDtBQUNGO0FBQ0F6RixjQUFjLENBQUNDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRThFLG1CQUFtQixDQUFDO0FBRWhFN0YsRUFBRSxDQUFDLDJDQUEyQyxFQUFFLE1BQU07RUFDcEQsTUFBTThELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDdkRELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUV4QkEsRUFBRSxDQUFDSixVQUFVLENBQUM5QyxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLFlBQVksRUFBRTtJQUFFSCxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FBQztFQUM3RVgsTUFBTSxDQUFDK0QsRUFBRSxDQUFDd0MsU0FBUyxLQUFLLENBQUMsSUFBSXhDLEVBQUUsQ0FBQ3lDLFdBQVcsS0FBSyxDQUFDLEVBQUUsMEJBQTBCLENBQUM7RUFFOUV6QyxFQUFFLENBQUNKLFVBQVUsQ0FBQzlDLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsWUFBWSxFQUFFO0lBQUVILE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBQzdFWCxNQUFNLENBQUMrRCxFQUFFLENBQUN3QyxTQUFTLEtBQUssQ0FBQyxJQUFJeEMsRUFBRSxDQUFDeUMsV0FBVyxLQUFLLENBQUMsRUFBRSx1Q0FBdUMsQ0FBQztFQUUzRnpDLEVBQUUsQ0FBQ0osVUFBVSxDQUFDOUMsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7SUFBRUgsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFDN0VYLE1BQU0sQ0FBQytELEVBQUUsQ0FBQ3dDLFNBQVMsS0FBSyxDQUFDLElBQUl4QyxFQUFFLENBQUN5QyxXQUFXLEtBQUssQ0FBQyxFQUFFLDZCQUE2QixDQUFDO0VBRWpGekMsRUFBRSxDQUFDOEIsTUFBTSxDQUFDLENBQUM7QUFDYixDQUFDLENBQUM7O0FBRUY7QUFDQSxNQUFNYyxzQkFBc0IsU0FBU3pHLFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQTBHLFdBQUEsRUFBQUMsV0FBQSxFQUFBQyxZQUFBLElBQUFyRixVQUFBLFNBQUFzRixjQUFBLHFCQUFBQyxhQUFBLG9CQUFBQyxVQUFBLCtCQUFUL0csUUFBUSxFQUFBK0IsQ0FBQTtJQUFBNkUsWUFBQTtFQUFBO0VBQUEsQ0FBQTVFLENBQUEsSUFBQTJFLFdBQUEsUUFBQUQsV0FBQTtFQUFBLE1BQUFLLFVBQUEsR0FDMUM5RyxRQUFRLENBQUM7SUFBRWdDLElBQUksRUFBRStFLEtBQUs7SUFBRTFCLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO0VBQUcsQ0FBQyxDQUFDLEVBQUF1QixjQUFBLEdBRzVDM0csUUFBUSxDQUFDLFlBQVksRUFBRTtJQUFFK0csT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLEVBQUFILGFBQUEsR0FLekM1RyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQUEsYUFBQThCLENBQUE7RUFBQTtFQUFBLElBUGRrRixLQUFLQSxDQUFBN0UsQ0FBQTtJQUFBLE1BQUFMLENBQUEsR0FBQUssQ0FBQTtFQUFBO0VBRWQsT0FDTzhFLFNBQVNBLENBQUNwRSxJQUFJLEVBQUU7SUFDckJBLElBQUksQ0FBQ21FLEtBQUssR0FBRyxDQUFDLEdBQUduRSxJQUFJLENBQUNtRSxLQUFLLEVBQUUsU0FBUyxDQUFDO0VBQ3pDO0VBRUEsT0FDT0UsUUFBUUEsQ0FBQ3JFLElBQUksRUFBRTtJQUNwQkEsSUFBSSxDQUFDbUUsS0FBSyxHQUFHLENBQUMsR0FBR25FLElBQUksQ0FBQ21FLEtBQUssRUFBRSxRQUFRLENBQUM7RUFDeEM7RUFFQSxPQUFPM0QsUUFBUUEsQ0FBQSxFQUFHO0lBQ2hCLE9BQU9wRCxJQUFJLHdCQUF3QjtFQUNyQztBQUNGO0FBQ0FVLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLHVCQUF1QixFQUFFMkYsc0JBQXNCLENBQUM7QUFFdEUxRyxFQUFFLENBQUMscURBQXFELEVBQUUsTUFBTTtFQUM5RCxNQUFNOEQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQztFQUMxREQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBRXhCLE1BQU13RCxLQUFLLEdBQUd4RCxFQUFFLENBQUNKLFVBQVUsQ0FBQ1UsY0FBYyxDQUFDLE9BQU8sQ0FBQztFQUNuRGtELEtBQUssQ0FBQzFHLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsWUFBWSxFQUFFO0lBQUVILE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBRXJFWCxNQUFNLENBQUMrRCxFQUFFLENBQUNxRCxLQUFLLENBQUNJLE1BQU0sS0FBSyxDQUFDLEVBQUUsc0JBQXNCLENBQUM7RUFDckR4SCxNQUFNLENBQUMrRCxFQUFFLENBQUNxRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFLDhCQUE4QixDQUFDO0VBQ2pFcEgsTUFBTSxDQUFDK0QsRUFBRSxDQUFDcUQsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRSw4QkFBOEIsQ0FBQztFQUVoRXJELEVBQUUsQ0FBQzhCLE1BQU0sQ0FBQyxDQUFDO0FBQ2IsQ0FBQyxDQUFDOztBQUVGO0FBQ0EsTUFBTTRCLG1CQUFtQixTQUFTdkgsUUFBUSxDQUFDO0VBQUE7SUFBQSxDQUFBd0gsa0JBQUEsRUFBQUMsa0JBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsV0FBQSxFQUFBQyxZQUFBLElBQUFyRyxVQUFBLFNBQUFzRyxjQUFBLG9CQUFBQyxjQUFBLHFCQUFBQyxZQUFBLGtCQUFBQyxpQkFBQSxzQkFBQUMsaUJBQUEsdUJBQUFDLGVBQUEsbUNBQVRsSSxRQUFRLEVBQUErQixDQUFBO0lBQUE2RixZQUFBO0VBQUE7RUFBQSxDQUFBNUYsQ0FBQSxJQUFBMkYsV0FBQSxRQUFBSCxrQkFBQTtFQUFBLE1BQUFRLGlCQUFBLEdBQ3ZDL0gsUUFBUSxDQUFDO0lBQUVnQyxJQUFJLEVBQUVDLE1BQU07SUFBRW9ELE9BQU8sRUFBRTtFQUFFLENBQUMsQ0FBQyxFQUFBMkMsaUJBQUEsR0FHdENoSSxRQUFRLENBQUM7SUFBRWdDLElBQUksRUFBRUMsTUFBTTtJQUFFb0QsT0FBTyxFQUFFO0VBQUUsQ0FBQyxDQUFDLEVBQUE0QyxlQUFBLEdBR3RDakksUUFBUSxDQUFDO0lBQUVnQyxJQUFJLEVBQUVDLE1BQU07SUFBRW9ELE9BQU8sRUFBRTtFQUFFLENBQUMsQ0FBQyxFQUFBdUMsY0FBQSxHQUd0QzNILFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBQTRILGNBQUEsR0FLdEI1SCxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQUVpSSxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsRUFBQUosWUFBQSxHQUt6QzdILFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFBRXdELElBQUksRUFBRTtFQUFLLENBQUMsQ0FBQztJQUFBLGFBQUExQixDQUFBO0VBQUE7RUFBQSxJQWxCOUJzRSxXQUFXQSxDQUFBakUsQ0FBQTtJQUFBLE1BQUFMLENBQUEsR0FBQUssQ0FBQTtFQUFBO0VBQUEsQ0FBQUMsQ0FBQSxHQUFBbUYsa0JBQUE7RUFBQSxJQUdYVyxZQUFZQSxDQUFBO0lBQUEsYUFBQTlGLENBQUE7RUFBQTtFQUFBLElBQVo4RixZQUFZQSxDQUFBL0YsQ0FBQTtJQUFBLE1BQUFDLENBQUEsR0FBQUQsQ0FBQTtFQUFBO0VBQUEsQ0FBQUcsQ0FBQSxHQUFBa0YsZ0JBQUE7RUFBQSxJQUdackIsU0FBU0EsQ0FBQTtJQUFBLGFBQUE3RCxDQUFBO0VBQUE7RUFBQSxJQUFUNkQsU0FBU0EsQ0FBQWhFLENBQUE7SUFBQSxNQUFBRyxDQUFBLEdBQUFILENBQUE7RUFBQTtFQUVsQixPQUNPbUUsUUFBUUEsQ0FBQ3pELElBQUksRUFBRTtJQUNwQkEsSUFBSSxDQUFDdUQsV0FBVyxFQUFFO0VBQ3BCO0VBRUEsT0FDTytCLFNBQVNBLENBQUN0RixJQUFJLEVBQUU7SUFDckJBLElBQUksQ0FBQ3FGLFlBQVksRUFBRTtFQUNyQjtFQUVBLE9BQ083QixNQUFNQSxDQUFDeEQsSUFBSSxFQUFFO0lBQ2xCQSxJQUFJLENBQUNzRCxTQUFTLEVBQUU7RUFDbEI7RUFFQSxPQUFPOUMsUUFBUUEsQ0FBQ1IsSUFBSSxFQUFFO0lBQ3BCLE9BQU81QyxJQUFJLFFBQVE0QyxJQUFJLENBQUN1RCxXQUFXLElBQUl2RCxJQUFJLENBQUNxRixZQUFZLElBQUlyRixJQUFJLENBQUNzRCxTQUFTLFFBQVE7RUFDcEY7QUFDRjtBQUNBeEYsY0FBYyxDQUFDQyxNQUFNLENBQUMsb0JBQW9CLEVBQUV5RyxtQkFBbUIsQ0FBQztBQUVoRXhILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxNQUFNO0VBQ3BELE1BQU04RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG9CQUFvQixDQUFDO0VBQ3ZERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFFeEJBLEVBQUUsQ0FBQ0osVUFBVSxDQUFDOUMsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7SUFBRUgsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFDN0VYLE1BQU0sQ0FBQytELEVBQUUsQ0FBQ3lDLFdBQVcsS0FBSyxDQUFDLEVBQUUsdUJBQXVCLENBQUM7RUFDckR4RyxNQUFNLENBQUMrRCxFQUFFLENBQUN1RSxZQUFZLEtBQUssQ0FBQyxFQUFFLHdCQUF3QixDQUFDO0VBQ3ZEdEksTUFBTSxDQUFDK0QsRUFBRSxDQUFDd0MsU0FBUyxLQUFLLENBQUMsRUFBRSxxQkFBcUIsQ0FBQztFQUVqRHhDLEVBQUUsQ0FBQ0osVUFBVSxDQUFDOUMsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7SUFBRUgsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFDN0VYLE1BQU0sQ0FBQytELEVBQUUsQ0FBQ3lDLFdBQVcsS0FBSyxDQUFDLEVBQUUsNkJBQTZCLENBQUM7RUFDM0R4RyxNQUFNLENBQUMrRCxFQUFFLENBQUN1RSxZQUFZLEtBQUssQ0FBQyxFQUFFLDhCQUE4QixDQUFDO0VBQzdEdEksTUFBTSxDQUFDK0QsRUFBRSxDQUFDd0MsU0FBUyxLQUFLLENBQUMsRUFBRSxtQ0FBbUMsQ0FBQztFQUUvRHhDLEVBQUUsQ0FBQzhCLE1BQU0sQ0FBQyxDQUFDO0FBQ2IsQ0FBQyxDQUFDOztBQUVGO0FBQ0E1RixFQUFFLENBQUMsOENBQThDLEVBQUUsTUFBTTtFQUN2RCxNQUFNOEQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztFQUN4REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBRXhCQSxFQUFFLENBQUNKLFVBQVUsQ0FBQzlDLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsWUFBWSxFQUFFO0lBQUVILE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBQzdFWCxNQUFNLENBQUMrRCxFQUFFLENBQUMwQixNQUFNLEtBQUssQ0FBQyxJQUFJMUIsRUFBRSxDQUFDMkIsTUFBTSxLQUFLLENBQUMsRUFBRSxvQ0FBb0MsQ0FBQztFQUVoRjNCLEVBQUUsQ0FBQzhCLE1BQU0sQ0FBQyxDQUFDO0VBQ1g5QixFQUFFLENBQUMwQixNQUFNLEdBQUcsQ0FBQztFQUNiMUIsRUFBRSxDQUFDMkIsTUFBTSxHQUFHLENBQUM7RUFFYjNCLEVBQUUsQ0FBQ0osVUFBVSxDQUFDOUMsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7SUFBRUgsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFDN0VYLE1BQU0sQ0FBQytELEVBQUUsQ0FBQzBCLE1BQU0sS0FBSyxDQUFDLElBQUkxQixFQUFFLENBQUMyQixNQUFNLEtBQUssQ0FBQyxFQUFFLDBDQUEwQyxDQUFDO0VBRXRGMUIsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCQSxFQUFFLENBQUNKLFVBQVUsQ0FBQzlDLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsWUFBWSxFQUFFO0lBQUVILE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBQzdFWCxNQUFNLENBQUMrRCxFQUFFLENBQUMwQixNQUFNLEtBQUssQ0FBQyxJQUFJMUIsRUFBRSxDQUFDMkIsTUFBTSxLQUFLLENBQUMsRUFBRSw0Q0FBNEMsQ0FBQztFQUV4RjNCLEVBQUUsQ0FBQzhCLE1BQU0sQ0FBQyxDQUFDO0FBQ2IsQ0FBQyxDQUFDIiwiaWdub3JlTGlzdCI6W119