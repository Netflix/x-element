let _initProto, _oneDecs, _init_one, _initProto2, _oneDecs2, _init_one2, _twoDecs, _init_two, _initProto3, _oneDecs3, _init_one3, _twoDecs2, _init_two2, _initProto4, _oneDecs4, _init_one4, _twoDecs3, _init_two3, _threeDecs, _init_three;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
class TestElementBasic extends XElement {
  static {
    [_init_one, _initProto] = _applyDecs(this, [[_oneDecs, 1, "one"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto(this), _init_one(this));
  get [(_oneDecs = property({
    type: String,
    default: 'one'
  }), "one")]() {
    return this.#A;
  }
  set one(v) {
    this.#A = v;
  }
  static template(host) {
    return html`<div>${host.one}</div>`;
  }
}
customElements.define('test-element-basic-next', TestElementBasic);
class TestElementAnonymous extends XElement {
  static {
    [_init_one2, _init_two, _initProto2] = _applyDecs(this, [[_oneDecs2, 1, "one"], [_twoDecs, 1, "two"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto2(this), _init_one2(this));
  get [(_oneDecs2 = property({
    type: String,
    default: (() => 'one')()
  }), _twoDecs = property({
    type: Object,
    default: () => ({
      two: 'two'
    })
  }), "one")]() {
    return this.#A;
  }
  set one(v) {
    this.#A = v;
  }
  #B = _init_two(this);
  get two() {
    return this.#B;
  }
  set two(v) {
    this.#B = v;
  }
  static template(host) {
    return html`<div>${host.one}, ${host.two.two}</div>`;
  }
}
customElements.define('test-element-anonymous-next', TestElementAnonymous);
class TestElementStatic extends XElement {
  static {
    [_init_one3, _init_two2, _initProto3] = _applyDecs(this, [[_oneDecs3, 1, "one"], [_twoDecs2, 1, "two"]], [], 0, void 0, XElement).e;
  }
  static get [(_oneDecs3 = property({
    type: String,
    default: () => TestElementStatic.getOne()
  }), _twoDecs2 = property({
    type: Object,
    default: () => TestElementStatic.getTwo()
  }), "one")]() {
    return 'one';
  }
  static getOne() {
    return this.one;
  }
  static get two() {
    return {
      two: 'two'
    };
  }
  static getTwo() {
    return this.two;
  }
  #A = (_initProto3(this), _init_one3(this));
  get one() {
    return this.#A;
  }
  set one(v) {
    this.#A = v;
  }
  #B = _init_two2(this);
  get two() {
    return this.#B;
  }
  set two(v) {
    this.#B = v;
  }
  static template(host) {
    return html`<div>${host.one}, ${host.two.two}</div>`;
  }
}
customElements.define('test-element-static-next', TestElementStatic);
class TestElementEdge extends XElement {
  static {
    [_init_one4, _init_two3, _init_three, _initProto4] = _applyDecs(this, [[_oneDecs4, 1, "one"], [_twoDecs3, 1, "two"], [_threeDecs, 1, "three"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto4(this), _init_one4(this));
  get [(_oneDecs4 = property({
    type: String,
    initial: undefined,
    default: 'one'
  }), _twoDecs3 = property({
    type: Object,
    initial: null,
    default: () => ({
      two: 'two'
    })
  }), _threeDecs = property({
    type: String,
    input: [],
    compute: () => {},
    default: 'three'
  }), "one")]() {
    return this.#A;
  }
  set one(v) {
    this.#A = v;
  }
  #B = _init_two3(this);
  get two() {
    return this.#B;
  }
  set two(v) {
    this.#B = v;
  }
  #C = _init_three(this);
  get three() {
    return this.#C;
  }
  set three(v) {
    this.#C = v;
  }
  static template(host) {
    return html`<div>${host.one}, ${host.two.two}, ${host.three}</div>`;
  }
}
customElements.define('test-element-edge-next', TestElementEdge);
it('basic default properties', async () => {
  const el = document.createElement('test-element-basic-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');

  // Test that we can override the default.
  el.one = 'ONE';
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'ONE');

  // Test that we get our default back via undefined.
  el.one = undefined;
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one');

  // Override again...
  el.one = 'ONE';
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'ONE');

  // Test that we get our default back via null.
  el.one = null;
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one');
});
it('basic default properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});
it('basic default properties (predefined null properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});
it('basic default properties (predefined properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = 'ONE';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});
it('basic default properties (predefined attributes)', () => {
  const el = document.createElement('test-element-basic-next');
  el.setAttribute('one', 'ONE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});
it('anonymous default properties', () => {
  const el = document.createElement('test-element-anonymous-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});
it('anonymous default properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = undefined;
  el.two = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});
it('anonymous default properties (predefined null properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = null;
  el.two = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});
it('anonymous default properties (predefined properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = 'ONE';
  el.two = {
    two: 'TWO'
  };
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});
it('anonymous default properties (predefined attributes)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.setAttribute('one', 'ONE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, two');
});
it('initial + default & computed + default properties', () => {
  const el = document.createElement('test-element-edge-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two, three');
});
it('default values from functions are unique per instance', () => {
  const el1 = document.createElement('test-element-edge-next');
  const el2 = document.createElement('test-element-edge-next');
  document.body.append(el1, el2);
  assert(el1.shadowRoot.textContent === 'one, two, three');
  assert(el2.shadowRoot.textContent === 'one, two, three');
  assert(el1.two !== el2.two);
});
it('default values from functions persist per instance', async () => {
  const el = document.createElement('test-element-edge-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two, three');
  const defaultTwo = el.two;
  el.two = {
    two: 'TWO'
  };
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one, TWO, three');
  assert(el.two !== defaultTwo);
  el.two = undefined;
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'one, two, three');
  assert(el.two === defaultTwo);
});
it('cannot set default to a bad type', () => {
  let _initProto5, _badDecs, _init_bad;
  class BadTestElement extends XElement {
    static {
      [_init_bad, _initProto5] = _applyDecs(this, [[_badDecs, 1, "bad"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto5(this), _init_bad(this));
    get [(_badDecs = property({
      type: String,
      default: 0
    }), "bad")]() {
      return this.#A;
    }
    set bad(v) {
      this.#A = v;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "BadTestElement.prototype.bad" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnRCYXNpYyIsIl9pbml0X29uZSIsIl9pbml0UHJvdG8iLCJfYXBwbHlEZWNzIiwiX29uZURlY3MiLCJlIiwiQSIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0Iiwib25lIiwidiIsInRlbXBsYXRlIiwiaG9zdCIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiVGVzdEVsZW1lbnRBbm9ueW1vdXMiLCJfaW5pdF9vbmUyIiwiX2luaXRfdHdvIiwiX2luaXRQcm90bzIiLCJfb25lRGVjczIiLCJfdHdvRGVjcyIsIk9iamVjdCIsInR3byIsIkIiLCJUZXN0RWxlbWVudFN0YXRpYyIsIl9pbml0X29uZTMiLCJfaW5pdF90d28yIiwiX2luaXRQcm90bzMiLCJfb25lRGVjczMiLCJfdHdvRGVjczIiLCJnZXRPbmUiLCJnZXRUd28iLCJUZXN0RWxlbWVudEVkZ2UiLCJfaW5pdF9vbmU0IiwiX2luaXRfdHdvMyIsIl9pbml0X3RocmVlIiwiX2luaXRQcm90bzQiLCJfb25lRGVjczQiLCJfdHdvRGVjczMiLCJfdGhyZWVEZWNzIiwiaW5pdGlhbCIsInVuZGVmaW5lZCIsImlucHV0IiwiY29tcHV0ZSIsIkMiLCJ0aHJlZSIsImVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm9keSIsImFwcGVuZCIsInNoYWRvd1Jvb3QiLCJ0ZXh0Q29udGVudCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0QXR0cmlidXRlIiwiZWwxIiwiZWwyIiwiZGVmYXVsdFR3byIsIl9pbml0UHJvdG81IiwiX2JhZERlY3MiLCJfaW5pdF9iYWQiLCJCYWRUZXN0RWxlbWVudCIsImJhZCIsInBhc3NlZCIsIm1lc3NhZ2UiLCJjb25uZWN0ZWRDYWxsYmFjayIsImVycm9yIiwiZXhwZWN0ZWQiXSwic291cmNlcyI6WyJ0ZXN0LWRlZmF1bHQtcHJvcGVydGllcy5zcmMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0LCBpdCB9IGZyb20gJ0BuZXRmbGl4L3gtdGVzdC94LXRlc3QuanMnO1xuaW1wb3J0IHsgWEVsZW1lbnQsIHByb3BlcnR5LCBodG1sIH0gZnJvbSAnLi4veC1lbGVtZW50LW5leHQuanMnO1xuXG5jbGFzcyBUZXN0RWxlbWVudEJhc2ljIGV4dGVuZHMgWEVsZW1lbnQge1xuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdvbmUnIH0pXG4gIGFjY2Vzc29yIG9uZTtcblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0Lm9uZX08L2Rpdj5gO1xuICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYXNpYy1uZXh0JywgVGVzdEVsZW1lbnRCYXNpYyk7XG5cbmNsYXNzIFRlc3RFbGVtZW50QW5vbnltb3VzIGV4dGVuZHMgWEVsZW1lbnQge1xuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICgoKSA9PiAnb25lJykoKSB9KVxuICBhY2Nlc3NvciBvbmU7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogT2JqZWN0LCBkZWZhdWx0OiAoKSA9PiAoeyB0d286ICd0d28nIH0pIH0pXG4gIGFjY2Vzc29yIHR3bztcblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0Lm9uZX0sICR7aG9zdC50d28udHdvfTwvZGl2PmA7XG4gIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWFub255bW91cy1uZXh0JywgVGVzdEVsZW1lbnRBbm9ueW1vdXMpO1xuXG5jbGFzcyBUZXN0RWxlbWVudFN0YXRpYyBleHRlbmRzIFhFbGVtZW50IHtcbiAgc3RhdGljIGdldCBvbmUoKSB7XG4gICAgcmV0dXJuICdvbmUnO1xuICB9XG4gIHN0YXRpYyBnZXRPbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMub25lO1xuICB9XG4gIHN0YXRpYyBnZXQgdHdvKCkge1xuICAgIHJldHVybiB7IHR3bzogJ3R3bycgfTtcbiAgfVxuICBzdGF0aWMgZ2V0VHdvKCkge1xuICAgIHJldHVybiB0aGlzLnR3bztcbiAgfVxuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogKCkgPT4gVGVzdEVsZW1lbnRTdGF0aWMuZ2V0T25lKCkgfSlcbiAgYWNjZXNzb3Igb25lO1xuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IE9iamVjdCwgZGVmYXVsdDogKCkgPT4gVGVzdEVsZW1lbnRTdGF0aWMuZ2V0VHdvKCkgfSlcbiAgYWNjZXNzb3IgdHdvO1xuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3Qub25lfSwgJHtob3N0LnR3by50d299PC9kaXY+YDtcbiAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtc3RhdGljLW5leHQnLCBUZXN0RWxlbWVudFN0YXRpYyk7XG5cbmNsYXNzIFRlc3RFbGVtZW50RWRnZSBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiB1bmRlZmluZWQsIGRlZmF1bHQ6ICdvbmUnIH0pXG4gIGFjY2Vzc29yIG9uZTtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBPYmplY3QsIGluaXRpYWw6IG51bGwsIGRlZmF1bHQ6ICgpID0+ICh7IHR3bzogJ3R3bycgfSkgfSlcbiAgYWNjZXNzb3IgdHdvO1xuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5wdXQ6IFtdLCBjb21wdXRlOiAoKSA9PiB7fSwgZGVmYXVsdDogJ3RocmVlJyB9KVxuICBhY2Nlc3NvciB0aHJlZTtcblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0Lm9uZX0sICR7aG9zdC50d28udHdvfSwgJHtob3N0LnRocmVlfTwvZGl2PmA7XG4gIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWVkZ2UtbmV4dCcsIFRlc3RFbGVtZW50RWRnZSk7XG5cbml0KCdiYXNpYyBkZWZhdWx0IHByb3BlcnRpZXMnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWJhc2ljLW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ29uZScpO1xuXG4gIC8vIFRlc3QgdGhhdCB3ZSBjYW4gb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIGVsLm9uZSA9ICdPTkUnO1xuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdPTkUnKTtcblxuICAvLyBUZXN0IHRoYXQgd2UgZ2V0IG91ciBkZWZhdWx0IGJhY2sgdmlhIHVuZGVmaW5lZC5cbiAgZWwub25lID0gdW5kZWZpbmVkO1xuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUnKTtcblxuICAvLyBPdmVycmlkZSBhZ2Fpbi4uLlxuICBlbC5vbmUgPSAnT05FJztcbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnT05FJyk7XG5cbiAgLy8gVGVzdCB0aGF0IHdlIGdldCBvdXIgZGVmYXVsdCBiYWNrIHZpYSBudWxsLlxuICBlbC5vbmUgPSBudWxsO1xuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUnKTtcbn0pO1xuXG5pdCgnYmFzaWMgZGVmYXVsdCBwcm9wZXJ0aWVzIChwcmVkZWZpbmVkIHVuZGVmaW5lZCBwcm9wZXJ0aWVzKScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtYmFzaWMtbmV4dCcpO1xuICBlbC5vbmUgPSB1bmRlZmluZWQ7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUnKTtcbn0pO1xuXG5pdCgnYmFzaWMgZGVmYXVsdCBwcm9wZXJ0aWVzIChwcmVkZWZpbmVkIG51bGwgcHJvcGVydGllcyknLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWJhc2ljLW5leHQnKTtcbiAgZWwub25lID0gbnVsbDtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ29uZScpO1xufSk7XG5cbml0KCdiYXNpYyBkZWZhdWx0IHByb3BlcnRpZXMgKHByZWRlZmluZWQgcHJvcGVydGllcyknLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWJhc2ljLW5leHQnKTtcbiAgZWwub25lID0gJ09ORSc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdPTkUnKTtcbn0pO1xuXG5pdCgnYmFzaWMgZGVmYXVsdCBwcm9wZXJ0aWVzIChwcmVkZWZpbmVkIGF0dHJpYnV0ZXMpJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1iYXNpYy1uZXh0Jyk7XG4gIGVsLnNldEF0dHJpYnV0ZSgnb25lJywgJ09ORScpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnT05FJyk7XG59KTtcblxuaXQoJ2Fub255bW91cyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWFub255bW91cy1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUsIHR3bycpO1xufSk7XG5cbml0KCdhbm9ueW1vdXMgZGVmYXVsdCBwcm9wZXJ0aWVzIChwcmVkZWZpbmVkIHVuZGVmaW5lZCBwcm9wZXJ0aWVzKScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtYW5vbnltb3VzLW5leHQnKTtcbiAgZWwub25lID0gdW5kZWZpbmVkO1xuICBlbC50d28gPSB1bmRlZmluZWQ7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUsIHR3bycpO1xufSk7XG5cbml0KCdhbm9ueW1vdXMgZGVmYXVsdCBwcm9wZXJ0aWVzIChwcmVkZWZpbmVkIG51bGwgcHJvcGVydGllcyknLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWFub255bW91cy1uZXh0Jyk7XG4gIGVsLm9uZSA9IG51bGw7XG4gIGVsLnR3byA9IG51bGw7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUsIHR3bycpO1xufSk7XG5cbml0KCdhbm9ueW1vdXMgZGVmYXVsdCBwcm9wZXJ0aWVzIChwcmVkZWZpbmVkIHByb3BlcnRpZXMpJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1hbm9ueW1vdXMtbmV4dCcpO1xuICBlbC5vbmUgPSAnT05FJztcbiAgZWwudHdvID0geyB0d286ICdUV08nIH07XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdPTkUsIFRXTycpO1xufSk7XG5cbml0KCdhbm9ueW1vdXMgZGVmYXVsdCBwcm9wZXJ0aWVzIChwcmVkZWZpbmVkIGF0dHJpYnV0ZXMpJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1hbm9ueW1vdXMtbmV4dCcpO1xuICBlbC5zZXRBdHRyaWJ1dGUoJ29uZScsICdPTkUnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ09ORSwgdHdvJyk7XG59KTtcblxuaXQoJ2luaXRpYWwgKyBkZWZhdWx0ICYgY29tcHV0ZWQgKyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWVkZ2UtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnb25lLCB0d28sIHRocmVlJyk7XG59KTtcblxuaXQoJ2RlZmF1bHQgdmFsdWVzIGZyb20gZnVuY3Rpb25zIGFyZSB1bmlxdWUgcGVyIGluc3RhbmNlJywgKCkgPT4ge1xuICBjb25zdCBlbDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtZWRnZS1uZXh0Jyk7XG4gIGNvbnN0IGVsMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1lZGdlLW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwxLCBlbDIpO1xuICBhc3NlcnQoZWwxLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUsIHR3bywgdGhyZWUnKTtcbiAgYXNzZXJ0KGVsMi5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnb25lLCB0d28sIHRocmVlJyk7XG4gIGFzc2VydChlbDEudHdvICE9PSBlbDIudHdvKTtcbn0pO1xuXG5pdCgnZGVmYXVsdCB2YWx1ZXMgZnJvbSBmdW5jdGlvbnMgcGVyc2lzdCBwZXIgaW5zdGFuY2UnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWVkZ2UtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnb25lLCB0d28sIHRocmVlJyk7XG4gIGNvbnN0IGRlZmF1bHRUd28gPSBlbC50d287XG4gIGVsLnR3byA9IHsgdHdvOiAnVFdPJyB9O1xuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdvbmUsIFRXTywgdGhyZWUnKTtcbiAgYXNzZXJ0KGVsLnR3byAhPT0gZGVmYXVsdFR3byk7XG4gIGVsLnR3byA9IHVuZGVmaW5lZDtcbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnb25lLCB0d28sIHRocmVlJyk7XG4gIGFzc2VydChlbC50d28gPT09IGRlZmF1bHRUd28pO1xufSk7XG5cbml0KCdjYW5ub3Qgc2V0IGRlZmF1bHQgdG8gYSBiYWQgdHlwZScsICgpID0+IHtcbiAgY2xhc3MgQmFkVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAwIH0pXG4gICAgYWNjZXNzb3IgYmFkO1xuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFkLXRlc3QtZWxlbWVudC1uZXh0LTEnLCBCYWRUZXN0RWxlbWVudCk7XG4gIGNvbnN0IGVsID0gbmV3IEJhZFRlc3RFbGVtZW50KCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIkJhZFRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRcIiAoZXhwZWN0ZWQgU3RyaW5nLCBnb3QgTnVtYmVyKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFNBQVNBLE1BQU0sRUFBRUMsRUFBRSxRQUFRLDJCQUEyQjtBQUN0RCxTQUFTQyxRQUFRLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxRQUFRLHNCQUFzQjtBQUUvRCxNQUFNQyxnQkFBZ0IsU0FBU0gsUUFBUSxDQUFDO0VBQUE7SUFBQSxDQUFBSSxTQUFBLEVBQUFDLFVBQUEsSUFBQUMsVUFBQSxTQUFBQyxRQUFBLDZCQUFUUCxRQUFRLEVBQUFRLENBQUE7RUFBQTtFQUFBLENBQUFDLENBQUEsSUFBQUosVUFBQSxRQUFBRCxTQUFBO0VBQUEsTUFBQUcsUUFBQSxHQUNwQ04sUUFBUSxDQUFDO0lBQUVTLElBQUksRUFBRUMsTUFBTTtJQUFFQyxPQUFPLEVBQUU7RUFBTSxDQUFDLENBQUM7SUFBQSxhQUFBSCxDQUFBO0VBQUE7RUFBQSxJQUNsQ0ksR0FBR0EsQ0FBQUMsQ0FBQTtJQUFBLE1BQUFMLENBQUEsR0FBQUssQ0FBQTtFQUFBO0VBRVosT0FBT0MsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO0lBQ3BCLE9BQU9kLElBQUksUUFBUWMsSUFBSSxDQUFDSCxHQUFHLFFBQVE7RUFDckM7QUFDRjtBQUNBSSxjQUFjLENBQUNDLE1BQU0s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RSxDQUFDSyxVQUFVLENBQUNDLFdBQVcsS0FBSyxpQkFBaUIsQ0FBQztFQUN2RDFELE1BQU0sQ0FBQ29ELEVBQUUsQ0FBQ3hCLEdBQUcsS0FBS29DLFVBQVUsQ0FBQztFQUM3QlosRUFBRSxDQUFDeEIsR0FBRyxHQUFHbUIsU0FBUztFQUNsQixNQUFNWSxPQUFPLENBQUNDLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZCNUQsTUFBTSxDQUFDb0QsRUFBRSxDQUFDSyxVQUFVLENBQUNDLFdBQVcsS0FBSyxpQkFBaUIsQ0FBQztFQUN2RDFELE1BQU0sQ0FBQ29ELEVBQUUsQ0FBQ3hCLEdBQUcsS0FBS29DLFVBQVUsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFFRi9ELEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxNQUFNO0VBQUEsSUFBQWdFLFdBQUEsRUFBQUMsUUFBQSxFQUFBQyxTQUFBO0VBQzNDLE1BQU1DLGNBQWMsU0FBU2xFLFFBQVEsQ0FBQztJQUFBO01BQUEsQ0FBQWlFLFNBQUEsRUFBQUYsV0FBQSxJQUFBekQsVUFBQSxTQUFBMEQsUUFBQSw2QkFBVGhFLFFBQVEsRUFBQVEsQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBc0QsV0FBQSxRQUFBRSxTQUFBO0lBQUEsTUFBQUQsUUFBQSxHQUNsQy9ELFFBQVEsQ0FBQztNQUFFUyxJQUFJLEVBQUVDLE1BQU07TUFBRUMsT0FBTyxFQUFFO0lBQUUsQ0FBQyxDQUFDO01BQUEsYUFBQUgsQ0FBQTtJQUFBO0lBQUEsSUFDOUIwRCxHQUFHQSxDQUFBckQsQ0FBQTtNQUFBLE1BQUFMLENBQUEsR0FBQUssQ0FBQTtJQUFBO0VBQ2Q7RUFDQUcsY0FBYyxDQUFDQyxNQUFNLENBQUMseUJBQXlCLEVBQUVnRCxjQUFjLENBQUM7RUFDaEUsTUFBTWhCLEVBQUUsR0FBRyxJQUFJZ0IsY0FBYyxDQUFDLENBQUM7RUFDL0IsSUFBSUUsTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSUMsT0FBTyxHQUFHLHFCQUFxQjtFQUNuQyxJQUFJO0lBQ0ZuQixFQUFFLENBQUNvQixpQkFBaUIsQ0FBQyxDQUFDO0VBQ3hCLENBQUMsQ0FBQyxPQUFPQyxLQUFLLEVBQUU7SUFDZCxNQUFNQyxRQUFRLEdBQUcsb0ZBQW9GO0lBQ3JHSCxPQUFPLEdBQUdFLEtBQUssQ0FBQ0YsT0FBTztJQUN2QkQsTUFBTSxHQUFHRyxLQUFLLENBQUNGLE9BQU8sS0FBS0csUUFBUTtFQUNyQztFQUNBMUUsTUFBTSxDQUFDc0UsTUFBTSxFQUFFQyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDIiwiaWdub3JlTGlzdCI6W119