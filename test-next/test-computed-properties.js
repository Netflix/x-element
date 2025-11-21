let _initProto, _cDecs, _init_c, _get_c, _set_c, _cDecs2, _init_c2, _aDecs, _init_a, _bDecs, _init_b, _negativeDecs, _init_negative, _underlineDecs, _init_underline, _italicDecs, _init_italic, _yDecs, _init_y, _zDecs, _init_z, _todayDecs, _init_today, _tomorrowDecs, _init_tomorrow, _countTriggerDecs, _init_countTrigger, _countDecs, _init_count;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { it, assert } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
let _count = 0;
class TestElement extends XElement {
  static {
    [_init_c, _get_c, _set_c, _init_c2, _init_a, _init_b, _init_negative, _init_underline, _init_italic, _init_y, _init_z, _init_today, _init_tomorrow, _init_countTrigger, _init_count, _initProto] = _applyDecs(this, [[_cDecs, 1, "c", o => o.#A, (o, v) => o.#A = v], [_cDecs2, 1, "c"], [_aDecs, 1, "a"], [_bDecs, 1, "b"], [_negativeDecs, 1, "negative"], [_underlineDecs, 1, "underline"], [_italicDecs, 1, "italic"], [_yDecs, 1, "y"], [_zDecs, 1, "z"], [_todayDecs, 1, "today"], [_tomorrowDecs, 1, "tomorrow"], [_countTriggerDecs, 1, "countTrigger"], [_countDecs, 1, "count"]], [], 0, _ => #c in _, XElement).e;
  }
  static get [(_cDecs = property({
    type: Number,
    input: ['a', 'b'],
    compute: (a, b) => TestElement.#computeC(a, b)
  }), _cDecs2 = property({
    type: Number,
    input: ['#c'],
    compute: c => c
  }), _aDecs = property({
    type: Number
  }), _bDecs = property({
    type: Number
  }), _negativeDecs = property({
    type: Boolean,
    input: ['#c'],
    compute: c => c < 0,
    reflect: true
  }), _underlineDecs = property({
    type: Boolean,
    input: ['negative'],
    compute: negative => TestElement.#computeUnderline(negative),
    reflect: true
  }), _italicDecs = property({
    type: Boolean,
    reflect: true
  }), _yDecs = property({
    type: Boolean
  }), _zDecs = property({
    type: Boolean,
    input: ['y'],
    compute: y => TestElement.#computeZ(y)
  }), _todayDecs = property({
    type: Date
  }), _tomorrowDecs = property({
    type: Date,
    input: ['today'],
    compute: today => TestElement.#computeTomorrow(today)
  }), _countTriggerDecs = property({}), _countDecs = property({
    type: Number,
    input: ['countTrigger'],
    compute: () => TestElement.#computeCount()
  }), "styles")]() {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`\
      #calculation {
        background-color: lightgreen;
        padding: 10px;
      }

      :host([negative]) #calculation {
        background-color: lightcoral;
      }

      :host([underline]) #calculation {
        text-decoration: underline;
      }

      :host([italic]) #calculation {
        font-style: italic;
      }
    `);
    return [styleSheet];
  }
  #A = (_initProto(this), _init_c(this));
  set #c(v) {
    _set_c(this, v);
  }
  get #c() {
    return _get_c(this);
  }
  #B = _init_c2(this);
  get c() {
    return this.#B;
  }
  set c(v) {
    this.#B = v;
  }
  #C = _init_a(this);
  get a() {
    return this.#C;
  }
  set a(v) {
    this.#C = v;
  }
  #D = _init_b(this);
  get b() {
    return this.#D;
  }
  set b(v) {
    this.#D = v;
  }
  #E = _init_negative(this);
  get negative() {
    return this.#E;
  }
  set negative(v) {
    this.#E = v;
  }
  #F = _init_underline(this);
  get underline() {
    return this.#F;
  }
  set underline(v) {
    this.#F = v;
  }
  #G = _init_italic(this);
  get italic() {
    return this.#G;
  }
  set italic(v) {
    this.#G = v;
  }
  #H = _init_y(this);
  get y() {
    return this.#H;
  }
  set y(v) {
    this.#H = v;
  }
  #I = _init_z(this);
  get z() {
    return this.#I;
  }
  set z(v) {
    this.#I = v;
  }
  #J = _init_today(this);
  get today() {
    return this.#J;
  }
  set today(v) {
    this.#J = v;
  }
  #K = _init_tomorrow(this);
  get tomorrow() {
    return this.#K;
  }
  set tomorrow(v) {
    this.#K = v;
  }
  #L = _init_countTrigger(this);
  get countTrigger() {
    return this.#L;
  }
  set countTrigger(v) {
    this.#L = v;
  }
  #M = _init_count(this);
  get count() {
    return this.#M;
  }
  set count(v) {
    this.#M = v;
  }
  static #computeC(a, b) {
    return a + b;
  }
  static #computeCount() {
    // This doesn't use an observer to prevent a coupled test.
    return ++_count;
  }
  static #computeUnderline(negative) {
    return !!negative;
  }
  static #computeZ(y) {
    return y;
  }
  static #computeTomorrow(today) {
    if (today) {
      return today.valueOf() + 1000 * 60 * 60 * 24;
    }
  }
  static template(host) {
    return html`<span id="calculation">${host.a} + ${host.b} = ${host.#c}</span>`;
  }
}
customElements.define('test-element-next', TestElement);
it('initializes as expected', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.a === undefined);
  assert(el.b === undefined);
  assert(el.y === undefined);
  assert(el.z === undefined);
  assert(el.countTrigger === undefined);
  assert(Number.isNaN(el.c));
  assert(el.negative === false);
  assert(el.underline === false);
});
it('properties are recomputed when dependencies change (a, b)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.a = 1;
  el.b = -2;
  assert(el.a === 1);
  assert(el.b === -2);
  assert(el.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);
});
it('properties are recomputed when dependencies change (y)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.y = true;
  assert(el.y === true);
  assert(el.z === true);
  el.y = false;
  assert(el.y === false);
  assert(el.z === false);
});
it('computed properties can be reflected', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.a = -1;
  el.b = 0;
  assert(el.c === -1);
  assert(el.negative === true);
  assert(el.underline === true);

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('negative'));
  assert(el.hasAttribute('underline'));
});
it('skips resolution when dependencies are the same', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let count = el.count;
  el.countTrigger = 'foo';
  assert(el.count === ++count);
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  el.countTrigger = 'foo';
  assert(el.count === count);
  el.countTrigger = 'bar';
  assert(el.count === ++count);
});
it('lazily computes', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let count = el.count;
  el.countTrigger = 'foo';
  assert(el.count === ++count);
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  el.countTrigger = 'bar';
  el.countTrigger = 'foo';
  assert(el.count === count);
  el.countTrigger = 'bar';
  assert(el.count === ++count);
});
it('does correct NaN checking', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let count = el.count;
  el.countTrigger = NaN;
  assert(el.count === ++count);
  el.countTrigger = NaN;
  assert(el.count === count);
});
it('resets compute validity on initialization to catch upgrade edge cases with computed properties', () => {
  const el = document.createElement('test-element-next');
  el.setAttribute('a', '1');
  el.setAttribute('b', '2');
  assert(el.a === undefined);
  assert(el.b === undefined);
  assert(el.c === undefined);
  document.body.append(el);
  assert(el.a === 1);
  assert(el.b === 2);
  assert(el.c === 3);
});
it('cannot be written to from host', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.count = 0;
  } catch (error) {
    const expected = 'Property "TestElement.prototype.count" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('cannot set to known properties', () => {
  let _initProto2, _computedPropertyDecs, _init_computedProperty;
  class BadTestElement extends XElement {
    static {
      [_init_computedProperty, _initProto2] = _applyDecs(this, [[_computedPropertyDecs, 1, "computedProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto2(this), _init_computedProperty(this));
    get [(_computedPropertyDecs = property({
      type: String,
      input: [],
      compute: () => {}
    }), "computedProperty")]() {
      return this.#A;
    }
    set computedProperty(v) {
      this.#A = v;
    }
    static template(host) {
      host.computedProperty = 'Dromedary';
      return html`<div>${host.computedProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.prototype.computedProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('cannot compute a bad value', () => {
  let _initProto3, _computedPropertyDecs2, _init_computedProperty2;
  class BadTestElement extends XElement {
    static {
      [_init_computedProperty2, _initProto3] = _applyDecs(this, [[_computedPropertyDecs2, 1, "computedProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto3(this), _init_computedProperty2(this));
    get [(_computedPropertyDecs2 = property({
      type: String,
      input: [],
      compute: () => 0
    }), "computedProperty")]() {
      return this.#A;
    }
    set computedProperty(v) {
      this.#A = v;
    }
    static template(host) {
      return html`${host.computedProperty}`;
    }
  }
  customElements.define('bad-test-element-next-2', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "BadTestElement.prototype.computedProperty" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpdCIsImFzc2VydCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiX2NvdW50IiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9jIiwiX2dldF9jIiwiX3NldF9jIiwiX2luaXRfYzIiLCJfaW5pdF9hIiwiX2luaXRfYiIsIl9pbml0X25lZ2F0aXZlIiwiX2luaXRfdW5kZXJsaW5lIiwiX2luaXRfaXRhbGljIiwiX2luaXRfeSIsIl9pbml0X3oiLCJfaW5pdF90b2RheSIsIl9pbml0X3RvbW9ycm93IiwiX2luaXRfY291bnRUcmlnZ2VyIiwiX2luaXRfY291bnQiLCJfaW5pdFByb3RvIiwiX2FwcGx5RGVjcyIsIl9jRGVjcyIsIm8iLCJBIiwidiIsIl9jRGVjczIiLCJfYURlY3MiLCJfYkRlY3MiLCJfbmVnYXRpdmVEZWNzIiwiX3VuZGVybGluZURlY3MiLCJfaXRhbGljRGVjcyIsIl95RGVjcyIsIl96RGVjcyIsIl90b2RheURlY3MiLCJfdG9tb3Jyb3dEZWNzIiwiX2NvdW50VHJpZ2dlckRlY3MiLCJfY291bnREZWNzIiwiXyIsImMiLCJlIiwidHlwZSIsIk51bWJlciIsImlucHV0IiwiY29tcHV0ZSIsImEiLCJiIiwiY29tcHV0ZUMiLCJCb29sZWFuIiwicmVmbGVjdCIsIm5lZ2F0aXZlIiwiY29tcHV0ZVVuZGVybGluZSIsInkiLCJjb21wdXRlWiIsIkRhdGUiLCJ0b2RheSIsImNvbXB1dGVUb21vcnJvdyIsImNvbXB1dGVDb3VudCIsInN0eWxlU2hlZXQiLCJDU1NTdHlsZVNoZWV0IiwicmVwbGFjZVN5bmMiLCIjYyIsIkIiLCJDIiwiRCIsIkUiLCJGIiwidW5kZXJsaW5lIiwiRyIsIml0YWxpYyIsIkgiLCJJIiwieiIsIkoiLCJLIiwidG9tb3Jyb3ciLCJMIiwiY291bnRUcmlnZ2VyIiwiTSIsImNvdW50IiwiI2NvbXB1dGVDIiwiI2NvbXB1dGVDb3VudCIsIiNjb21wdXRlVW5kZXJsaW5lIiwiI2NvbXB1dGVaIiwiI2NvbXB1dGVUb21vcnJvdyIsInZhbHVlT2YiLCJ0ZW1wbGF0ZSIsImhvc3QiLCJjdXN0b21FbGVtZW50cyIsImRlZmluZSIsImVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm9keSIsImFwcGVuZCIsInVuZGVmaW5lZCIsImlzTmFOIiwiUHJvbWlzZSIsInJlc29sdmUiLCJoYXNBdHRyaWJ1dGUiLCJOYU4iLCJzZXRBdHRyaWJ1dGUiLCJwYXNzZWQiLCJtZXNzYWdlIiwiZXJyb3IiLCJleHBlY3RlZCIsIl9pbml0UHJvdG8yIiwiX2NvbXB1dGVkUHJvcGVydHlEZWNzIiwiX2luaXRfY29tcHV0ZWRQcm9wZXJ0eSIsIkJhZFRlc3RFbGVtZW50IiwiU3RyaW5nIiwiY29tcHV0ZWRQcm9wZXJ0eSIsImNvbm5lY3RlZENhbGxiYWNrIiwiX2luaXRQcm90bzMiLCJfY29tcHV0ZWRQcm9wZXJ0eURlY3MyIiwiX2luaXRfY29tcHV0ZWRQcm9wZXJ0eTIiXSwic291cmNlcyI6WyJ0ZXN0LWNvbXB1dGVkLXByb3BlcnRpZXMuc3JjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGl0LCBhc3NlcnQgfSBmcm9tICdAbmV0ZmxpeC94LXRlc3QveC10ZXN0LmpzJztcbmltcG9ydCB7IFhFbGVtZW50LCBwcm9wZXJ0eSwgaHRtbCB9IGZyb20gJy4uL3gtZWxlbWVudC1uZXh0LmpzJztcblxubGV0IF9jb3VudCA9IDA7XG5cbmNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICBzdGF0aWMgZ2V0IHN0eWxlcygpIHtcbiAgICBjb25zdCBzdHlsZVNoZWV0ID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICBzdHlsZVNoZWV0LnJlcGxhY2VTeW5jKGBcXFxuICAgICAgI2NhbGN1bGF0aW9uIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmVlbjtcbiAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW25lZ2F0aXZlXSkgI2NhbGN1bGF0aW9uIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRjb3JhbDtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW3VuZGVybGluZV0pICNjYWxjdWxhdGlvbiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgfVxuXG4gICAgICA6aG9zdChbaXRhbGljXSkgI2NhbGN1bGF0aW9uIHtcbiAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgfVxuICAgIGApO1xuICAgIHJldHVybiBbc3R5bGVTaGVldF07XG4gIH1cblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBpbnB1dDogWydhJywgJ2InXSxcbiAgICBjb21wdXRlOiAoYSwgYikgPT4gVGVzdEVsZW1lbnQuI2NvbXB1dGVDKGEsIGIpLFxuICB9KVxuICBhY2Nlc3NvciAjYztcblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBpbnB1dDogWycjYyddLFxuICAgIGNvbXB1dGU6IChjKSA9PiBjLFxuICB9KVxuICBhY2Nlc3NvciBjO1xuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IE51bWJlciB9KVxuICBhY2Nlc3NvciBhO1xuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IE51bWJlciB9KVxuICBhY2Nlc3NvciBiO1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogQm9vbGVhbixcbiAgICBpbnB1dDogWycjYyddLFxuICAgIGNvbXB1dGU6IGMgPT4gYyA8IDAsXG4gICAgcmVmbGVjdDogdHJ1ZSxcbiAgfSlcbiAgYWNjZXNzb3IgbmVnYXRpdmU7XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGlucHV0OiBbJ25lZ2F0aXZlJ10sXG4gICAgY29tcHV0ZTogKG5lZ2F0aXZlKSA9PiBUZXN0RWxlbWVudC4jY29tcHV0ZVVuZGVybGluZShuZWdhdGl2ZSksXG4gICAgcmVmbGVjdDogdHJ1ZSxcbiAgfSlcbiAgYWNjZXNzb3IgdW5kZXJsaW5lO1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogQm9vbGVhbixcbiAgICByZWZsZWN0OiB0cnVlLFxuICB9KVxuICBhY2Nlc3NvciBpdGFsaWM7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogQm9vbGVhbiB9KVxuICBhY2Nlc3NvciB5O1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogQm9vbGVhbixcbiAgICBpbnB1dDogWyd5J10sXG4gICAgY29tcHV0ZTogKHkpID0+IFRlc3RFbGVtZW50LiNjb21wdXRlWih5KSxcbiAgfSlcbiAgYWNjZXNzb3IgejtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBEYXRlIH0pXG4gIGFjY2Vzc29yIHRvZGF5O1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBpbnB1dDogWyd0b2RheSddLFxuICAgIGNvbXB1dGU6ICh0b2RheSkgPT4gVGVzdEVsZW1lbnQuI2NvbXB1dGVUb21vcnJvdyh0b2RheSksXG4gIH0pXG4gIGFjY2Vzc29yIHRvbW9ycm93O1xuXG4gIEBwcm9wZXJ0eSh7fSlcbiAgYWNjZXNzb3IgY291bnRUcmlnZ2VyO1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGlucHV0OiBbJ2NvdW50VHJpZ2dlciddLFxuICAgIGNvbXB1dGU6ICgpID0+IFRlc3RFbGVtZW50LiNjb21wdXRlQ291bnQoKSxcbiAgfSlcbiAgYWNjZXNzb3IgY291bnQ7XG5cbiAgc3RhdGljICNjb21wdXRlQyhhLCBiKSB7XG4gICAgcmV0dXJuIGEgKyBiO1xuICB9XG5cbiAgc3RhdGljICNjb21wdXRlQ291bnQoKSB7XG4gICAgLy8gVGhpcyBkb2Vzbid0IHVzZSBhbiBvYnNlcnZlciB0byBwcmV2ZW50IGEgY291cGxlZCB0ZXN0LlxuICAgIHJldHVybiArK19jb3VudDtcbiAgfVxuXG4gIHN0YXRpYyAjY29tcHV0ZVVuZGVybGluZShuZWdhdGl2ZSkge1xuICAgIHJldHVybiAhIW5lZ2F0aXZlO1xuICB9XG5cbiAgc3RhdGljICNjb21wdXRlWih5KSB7XG4gICAgcmV0dXJuIHk7XG4gIH1cblxuICBzdGF0aWMgI2NvbXB1dGVUb21vcnJvdyh0b2RheSkge1xuICAgIGlmICh0b2RheSkge1xuICAgICAgcmV0dXJuIHRvZGF5LnZhbHVlT2YoKSArIDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICByZXR1cm4gaHRtbGA8c3BhbiBpZD1cImNhbGN1bGF0aW9uXCI+JHtob3N0LmF9ICsgJHtob3N0LmJ9ID0gJHtob3N0LiNjfTwvc3Bhbj5gO1xuICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1uZXh0JywgVGVzdEVsZW1lbnQpO1xuXG5pdCgnaW5pdGlhbGl6ZXMgYXMgZXhwZWN0ZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuYSA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KGVsLmIgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChlbC55ID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoZWwueiA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KGVsLmNvdW50VHJpZ2dlciA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KE51bWJlci5pc05hTihlbC5jKSk7XG4gIGFzc2VydChlbC5uZWdhdGl2ZSA9PT0gZmFsc2UpO1xuICBhc3NlcnQoZWwudW5kZXJsaW5lID09PSBmYWxzZSk7XG59KTtcblxuaXQoJ3Byb3BlcnRpZXMgYXJlIHJlY29tcHV0ZWQgd2hlbiBkZXBlbmRlbmNpZXMgY2hhbmdlIChhLCBiKScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGVsLmEgPSAxO1xuICBlbC5iID0gLTI7XG4gIGFzc2VydChlbC5hID09PSAxKTtcbiAgYXNzZXJ0KGVsLmIgPT09IC0yKTtcbiAgYXNzZXJ0KGVsLmMgPT09IC0xKTtcbiAgYXNzZXJ0KGVsLm5lZ2F0aXZlID09PSB0cnVlKTtcbiAgYXNzZXJ0KGVsLnVuZGVybGluZSA9PT0gdHJ1ZSk7XG59KTtcblxuaXQoJ3Byb3BlcnRpZXMgYXJlIHJlY29tcHV0ZWQgd2hlbiBkZXBlbmRlbmNpZXMgY2hhbmdlICh5KScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGVsLnkgPSB0cnVlO1xuICBhc3NlcnQoZWwueSA9PT0gdHJ1ZSk7XG4gIGFzc2VydChlbC56ID09PSB0cnVlKTtcbiAgZWwueSA9IGZhbHNlO1xuICBhc3NlcnQoZWwueSA9PT0gZmFsc2UpO1xuICBhc3NlcnQoZWwueiA9PT0gZmFsc2UpO1xufSk7XG5cbml0KCdjb21wdXRlZCBwcm9wZXJ0aWVzIGNhbiBiZSByZWZsZWN0ZWQnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBlbC5hID0gLTE7XG4gIGVsLmIgPSAwO1xuICBhc3NlcnQoZWwuYyA9PT0gLTEpO1xuICBhc3NlcnQoZWwubmVnYXRpdmUgPT09IHRydWUpO1xuICBhc3NlcnQoZWwudW5kZXJsaW5lID09PSB0cnVlKTtcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBhc3NlcnQoZWwuaGFzQXR0cmlidXRlKCduZWdhdGl2ZScpKTtcbiAgYXNzZXJ0KGVsLmhhc0F0dHJpYnV0ZSgndW5kZXJsaW5lJykpO1xufSk7XG5cbml0KCdza2lwcyByZXNvbHV0aW9uIHdoZW4gZGVwZW5kZW5jaWVzIGFyZSB0aGUgc2FtZScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBjb3VudCA9IGVsLmNvdW50O1xuICBlbC5jb3VudFRyaWdnZXIgPSAnZm9vJztcbiAgYXNzZXJ0KGVsLmNvdW50ID09PSArK2NvdW50KTtcbiAgZWwuY291bnRUcmlnZ2VyID0gJ2Zvbyc7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdmb28nO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnZm9vJztcbiAgZWwuY291bnRUcmlnZ2VyID0gJ2Zvbyc7XG4gIGFzc2VydChlbC5jb3VudCA9PT0gY291bnQpO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnYmFyJztcbiAgYXNzZXJ0KGVsLmNvdW50ID09PSArK2NvdW50KTtcbn0pO1xuXG5pdCgnbGF6aWx5IGNvbXB1dGVzJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgbGV0IGNvdW50ID0gZWwuY291bnQ7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdmb28nO1xuICBhc3NlcnQoZWwuY291bnQgPT09ICsrY291bnQpO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnYmFyJztcbiAgZWwuY291bnRUcmlnZ2VyID0gJ2Zvbyc7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdiYXInO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnZm9vJztcbiAgZWwuY291bnRUcmlnZ2VyID0gJ2Jhcic7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdmb28nO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnYmFyJztcbiAgZWwuY291bnRUcmlnZ2VyID0gJ2Zvbyc7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdiYXInO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnZm9vJztcbiAgZWwuY291bnRUcmlnZ2VyID0gJ2Jhcic7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdmb28nO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnYmFyJztcbiAgZWwuY291bnRUcmlnZ2VyID0gJ2Zvbyc7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdiYXInO1xuICBlbC5jb3VudFRyaWdnZXIgPSAnZm9vJztcbiAgYXNzZXJ0KGVsLmNvdW50ID09PSBjb3VudCk7XG4gIGVsLmNvdW50VHJpZ2dlciA9ICdiYXInO1xuICBhc3NlcnQoZWwuY291bnQgPT09ICsrY291bnQpO1xufSk7XG5cbml0KCdkb2VzIGNvcnJlY3QgTmFOIGNoZWNraW5nJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgbGV0IGNvdW50ID0gZWwuY291bnQ7XG4gIGVsLmNvdW50VHJpZ2dlciA9IE5hTjtcbiAgYXNzZXJ0KGVsLmNvdW50ID09PSArK2NvdW50KTtcbiAgZWwuY291bnRUcmlnZ2VyID0gTmFOO1xuICBhc3NlcnQoZWwuY291bnQgPT09IGNvdW50KTtcbn0pO1xuXG5pdCgncmVzZXRzIGNvbXB1dGUgdmFsaWRpdHkgb24gaW5pdGlhbGl6YXRpb24gdG8gY2F0Y2ggdXBncmFkZSBlZGdlIGNhc2VzIHdpdGggY29tcHV0ZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBlbC5zZXRBdHRyaWJ1dGUoJ2EnLCAnMScpO1xuICBlbC5zZXRBdHRyaWJ1dGUoJ2InLCAnMicpO1xuICBhc3NlcnQoZWwuYSA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KGVsLmIgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChlbC5jID09PSB1bmRlZmluZWQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5hID09PSAxKTtcbiAgYXNzZXJ0KGVsLmIgPT09IDIpO1xuICBhc3NlcnQoZWwuYyA9PT0gMyk7XG59KTtcblxuaXQoJ2Nhbm5vdCBiZSB3cml0dGVuIHRvIGZyb20gaG9zdCcsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY291bnQgPSAwO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1Byb3BlcnR5IFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLmNvdW50XCIgaXMgY29tcHV0ZWQgKGNvbXB1dGVkIHByb3BlcnRpZXMgYXJlIHJlYWQtb25seSkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnY2Fubm90IHNldCB0byBrbm93biBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICBjbGFzcyBCYWRUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoe1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgaW5wdXQ6IFtdLFxuICAgICAgY29tcHV0ZTogKCkgPT4ge30sXG4gICAgfSlcbiAgICBhY2Nlc3NvciBjb21wdXRlZFByb3BlcnR5O1xuXG4gICAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICAgIGhvc3QuY29tcHV0ZWRQcm9wZXJ0eSA9ICdEcm9tZWRhcnknO1xuICAgICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3QuY29tcHV0ZWRQcm9wZXJ0eX08L2Rpdj5gO1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ2JhZC10ZXN0LWVsZW1lbnQtbmV4dC0xJywgQmFkVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBCYWRUZXN0RWxlbWVudCgpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnUHJvcGVydHkgXCJCYWRUZXN0RWxlbWVudC5wcm90b3R5cGUuY29tcHV0ZWRQcm9wZXJ0eVwiIGlzIGNvbXB1dGVkIChjb21wdXRlZCBwcm9wZXJ0aWVzIGFyZSByZWFkLW9ubHkpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2Nhbm5vdCBjb21wdXRlIGEgYmFkIHZhbHVlJywgKCkgPT4ge1xuICBjbGFzcyBCYWRUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoe1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgaW5wdXQ6IFtdLFxuICAgICAgY29tcHV0ZTogKCkgPT4gMCxcbiAgICB9KVxuICAgIGFjY2Vzc29yIGNvbXB1dGVkUHJvcGVydHk7XG5cbiAgICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgICAgcmV0dXJuIGh0bWxgJHtob3N0LmNvbXB1dGVkUHJvcGVydHl9YDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdiYWQtdGVzdC1lbGVtZW50LW5leHQtMicsIEJhZFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgQmFkVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1VuZXhwZWN0ZWQgdmFsdWUgZm9yIFwiQmFkVGVzdEVsZW1lbnQucHJvdG90eXBlLmNvbXB1dGVkUHJvcGVydHlcIiAoZXhwZWN0ZWQgU3RyaW5nLCBnb3QgTnVtYmVyKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFNBQVNBLEVBQUUsRUFBRUMsTUFBTSxRQUFRLDJCQUEyQjtBQUN0RCxTQUFTQyxRQUFRLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxRQUFRLHNCQUFzQjtBQUUvRCxJQUFJQyxNQUFNLEdBQUcsQ0FBQztBQUVkLE1BQU1DLFdBQVcsU0FBU0osUUFBUSxDQUFDO0VBQUE7SUFBQSxDQUFBSyxPQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxRQUFBLEVBQUFDLE9BQUEsRUFBQUMsT0FBQSxFQUFBQyxjQUFBLEVBQUFDLGVBQUEsRUFBQUMsWUFBQSxFQUFBQyxPQUFBLEVBQUFDLE9BQUEsRUFBQUMsV0FBQSxFQUFBQyxjQUFBLEVBQUFDLGtCQUFBLEVBQUFDLFdBQUEsRUFBQUMsVUFBQSxJQUFBQyxVQUFBLFNBQUFDLE1BQUEsVUFBQUMsQ0FBQSxJQUFBQSxDQUFBLEVBQUFDLENBQUEsR0FBQUQsQ0FBQSxFQUFBRSxDQUFBLEtBQUFGLENBQUEsRUFBQUMsQ0FBQSxHQUFBQyxDQUFBLElBQUFDLE9BQUEsWUFBQUMsTUFBQSxZQUFBQyxNQUFBLFlBQUFDLGFBQUEsbUJBQUFDLGNBQUEsb0JBQUFDLFdBQUEsaUJB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