let _initProto, _oneDecs, _init_one, _initProto2, _oneDecs2, _init_one2, _twoDecs, _init_two, _initProto3, _oneDecs3, _init_one3, _twoDecs2, _init_two2, _initProto4, _compoundDecs, _init_compound;
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
    initial: 'one'
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
    initial: (() => 'one')()
  }), _twoDecs = property({
    type: String,
    initial: () => 'two'
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
    return html`<div>${host.one}, ${host.two}</div>`;
  }
}
customElements.define('test-element-anonymous-next', TestElementAnonymous);
class TestElementStatic extends XElement {
  static {
    [_init_one3, _init_two2, _initProto3] = _applyDecs(this, [[_oneDecs3, 1, "one"], [_twoDecs2, 1, "two"]], [], 0, void 0, XElement).e;
  }
  static get [(_oneDecs3 = property({
    type: String,
    initial: () => TestElementStatic.getOne()
  }), _twoDecs2 = property({
    type: String,
    initial: () => TestElementStatic.getTwo()
  }), "one")]() {
    return 'one';
  }
  static getOne() {
    return this.one;
  }
  static get two() {
    return 'two';
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
    return html`<div>${host.one}, ${host.two}</div>`;
  }
}
customElements.define('test-element-static-next', TestElementStatic);
class Compound {
  get foo() {
    return 'foo';
  }
}
class TestElementCompound extends XElement {
  static {
    [_init_compound, _initProto4] = _applyDecs(this, [[_compoundDecs, 1, "compound"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto4(this), _init_compound(this));
  get [(_compoundDecs = property({
    type: Compound,
    initial: () => new Compound()
  }), "compound")]() {
    return this.#A;
  }
  set compound(v) {
    this.#A = v;
  }
  static template(host) {
    return html`<div>${host.compound.foo}</div>`;
  }
}
customElements.define('test-element-compound-next', TestElementCompound);
it('basic initial properties', () => {
  const el = document.createElement('test-element-basic-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});
it('basic initial properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});
it('basic initial properties (predefined null properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one');
});
it('basic initial properties (predefined properties)', () => {
  const el = document.createElement('test-element-basic-next');
  el.one = 'ONE';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});
it('basic initial properties (predefined attributes)', () => {
  const el = document.createElement('test-element-basic-next');
  el.setAttribute('one', 'ONE');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE');
});
it('anonymous initial properties', () => {
  const el = document.createElement('test-element-anonymous-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});
it('anonymous initial properties (predefined undefined properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = undefined;
  el.two = undefined;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});
it('anonymous initial properties (predefined null properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = null;
  el.two = null;
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'one, two');
});
it('anonymous initial properties (predefined properties)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.one = 'ONE';
  el.two = 'TWO';
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});
it('anonymous initial properties (predefined attributes)', () => {
  const el = document.createElement('test-element-anonymous-next');
  el.setAttribute('one', 'ONE');
  el.setAttribute('two', 'TWO');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'ONE, TWO');
});
it('compound initial properties are not shared accross element instances', () => {
  const el1 = document.createElement('test-element-compound-next');
  const el2 = document.createElement('test-element-compound-next');
  document.body.append(el1, el2);
  assert(el1.shadowRoot.textContent === 'foo');
  assert(el2.shadowRoot.textContent === 'foo');
  assert(el1.compound !== el2.compound);
});
it('cannot set initial to a bad type', () => {
  let _initProto5, _badDecs, _init_bad;
  class BadTestElement extends XElement {
    static {
      [_init_bad, _initProto5] = _applyDecs(this, [[_badDecs, 1, "bad"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto5(this), _init_bad(this));
    get [(_badDecs = property({
      type: String,
      initial: 0
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnRCYXNpYyIsIl9pbml0X29uZSIsIl9pbml0UHJvdG8iLCJfYXBwbHlEZWNzIiwiX29uZURlY3MiLCJlIiwiQSIsInR5cGUiLCJTdHJpbmciLCJpbml0aWFsIiwib25lIiwidiIsInRlbXBsYXRlIiwiaG9zdCIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiVGVzdEVsZW1lbnRBbm9ueW1vdXMiLCJfaW5pdF9vbmUyIiwiX2luaXRfdHdvIiwiX2luaXRQcm90bzIiLCJfb25lRGVjczIiLCJfdHdvRGVjcyIsIkIiLCJ0d28iLCJUZXN0RWxlbWVudFN0YXRpYyIsIl9pbml0X29uZTMiLCJfaW5pdF90d28yIiwiX2luaXRQcm90bzMiLCJfb25lRGVjczMiLCJfdHdvRGVjczIiLCJnZXRPbmUiLCJnZXRUd28iLCJDb21wb3VuZCIsImZvbyIsIlRlc3RFbGVtZW50Q29tcG91bmQiLCJfaW5pdF9jb21wb3VuZCIsIl9pbml0UHJvdG80IiwiX2NvbXBvdW5kRGVjcyIsImNvbXBvdW5kIiwiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kIiwic2hhZG93Um9vdCIsInRleHRDb250ZW50IiwidW5kZWZpbmVkIiwic2V0QXR0cmlidXRlIiwiZWwxIiwiZWwyIiwiX2luaXRQcm90bzUiLCJfYmFkRGVjcyIsIl9pbml0X2JhZCIsIkJhZFRlc3RFbGVtZW50IiwiYmFkIiwicGFzc2VkIiwibWVzc2FnZSIsImNvbm5lY3RlZENhbGxiYWNrIiwiZXJyb3IiLCJleHBlY3RlZCJdLCJzb3VyY2VzIjpbInRlc3QtaW5pdGlhbC1wcm9wZXJ0aWVzLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHksIGh0bWwgfSBmcm9tICcuLi94LWVsZW1lbnQtbmV4dC5qcyc7XG5cbmNsYXNzIFRlc3RFbGVtZW50QmFzaWMgZXh0ZW5kcyBYRWxlbWVudCB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5pdGlhbDogJ29uZScgfSlcbiAgYWNjZXNzb3Igb25lO1xuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3Qub25lfTwvZGl2PmA7XG4gIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWJhc2ljLW5leHQnLCBUZXN0RWxlbWVudEJhc2ljKTtcblxuY2xhc3MgVGVzdEVsZW1lbnRBbm9ueW1vdXMgZXh0ZW5kcyBYRWxlbWVudCB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5pdGlhbDogKCgpID0+ICdvbmUnKSgpIH0pXG4gIGFjY2Vzc29yIG9uZTtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICgpID0+ICd0d28nIH0pXG4gIGFjY2Vzc29yIHR3bztcblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0Lm9uZX0sICR7aG9zdC50d299PC9kaXY+YDtcbiAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtYW5vbnltb3VzLW5leHQnLCBUZXN0RWxlbWVudEFub255bW91cyk7XG5cbmNsYXNzIFRlc3RFbGVtZW50U3RhdGljIGV4dGVuZHMgWEVsZW1lbnQge1xuICBzdGF0aWMgZ2V0IG9uZSgpIHtcbiAgICByZXR1cm4gJ29uZSc7XG4gIH1cbiAgc3RhdGljIGdldE9uZSgpIHtcbiAgICByZXR1cm4gdGhpcy5vbmU7XG4gIH1cbiAgc3RhdGljIGdldCB0d28oKSB7XG4gICAgcmV0dXJuICd0d28nO1xuICB9XG4gIHN0YXRpYyBnZXRUd28oKSB7XG4gICAgcmV0dXJuIHRoaXMudHdvO1xuICB9XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAoKSA9PiBUZXN0RWxlbWVudFN0YXRpYy5nZXRPbmUoKSB9KVxuICBhY2Nlc3NvciBvbmU7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAoKSA9PiBUZXN0RWxlbWVudFN0YXRpYy5nZXRUd28oKSB9KVxuICBhY2Nlc3NvciB0d287XG5cbiAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICByZXR1cm4gaHRtbGA8ZGl2PiR7aG9zdC5vbmV9LCAke2hvc3QudHdvfTwvZGl2PmA7XG4gIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LXN0YXRpYy1uZXh0JywgVGVzdEVsZW1lbnRTdGF0aWMpO1xuXG5jbGFzcyBDb21wb3VuZCB7XG4gIGdldCBmb28oKSB7XG4gICAgcmV0dXJuICdmb28nO1xuICB9XG59XG5cbmNsYXNzIFRlc3RFbGVtZW50Q29tcG91bmQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IENvbXBvdW5kLCBpbml0aWFsOiAoKSA9PiBuZXcgQ29tcG91bmQoKSB9KVxuICBhY2Nlc3NvciBjb21wb3VuZDtcblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0LmNvbXBvdW5kLmZvb308L2Rpdj5gO1xuICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1jb21wb3VuZC1uZXh0JywgVGVzdEVsZW1lbnRDb21wb3VuZCk7XG5cbml0KCdiYXNpYyBpbml0aWFsIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWJhc2ljLW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ29uZScpO1xufSk7XG5cbml0KCdiYXNpYyBpbml0aWFsIHByb3BlcnRpZXMgKHByZWRlZmluZWQgdW5kZWZpbmVkIHByb3BlcnRpZXMpJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1iYXNpYy1uZXh0Jyk7XG4gIGVsLm9uZSA9IHVuZGVmaW5lZDtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ29uZScpO1xufSk7XG5cbml0KCdiYXNpYyBpbml0aWFsIHByb3BlcnRpZXMgKHByZWRlZmluZWQgbnVsbCBwcm9wZXJ0aWVzKScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtYmFzaWMtbmV4dCcpO1xuICBlbC5vbmUgPSBudWxsO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnb25lJyk7XG59KTtcblxuaXQoJ2Jhc2ljIGluaXRpYWwgcHJvcGVydGllcyAocHJlZGVmaW5lZCBwcm9wZXJ0aWVzKScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtYmFzaWMtbmV4dCcpO1xuICBlbC5vbmUgPSAnT05FJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ09ORScpO1xufSk7XG5cbml0KCdiYXNpYyBpbml0aWFsIHByb3BlcnRpZXMgKHByZWRlZmluZWQgYXR0cmlidXRlcyknLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWJhc2ljLW5leHQnKTtcbiAgZWwuc2V0QXR0cmlidXRlKCdvbmUnLCAnT05FJyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdPTkUnKTtcbn0pO1xuXG5pdCgnYW5vbnltb3VzIGluaXRpYWwgcHJvcGVydGllcycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtYW5vbnltb3VzLW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ29uZSwgdHdvJyk7XG59KTtcblxuaXQoJ2Fub255bW91cyBpbml0aWFsIHByb3BlcnRpZXMgKHByZWRlZmluZWQgdW5kZWZpbmVkIHByb3BlcnRpZXMpJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1hbm9ueW1vdXMtbmV4dCcpO1xuICBlbC5vbmUgPSB1bmRlZmluZWQ7XG4gIGVsLnR3byA9IHVuZGVmaW5lZDtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ29uZSwgdHdvJyk7XG59KTtcblxuaXQoJ2Fub255bW91cyBpbml0aWFsIHByb3BlcnRpZXMgKHByZWRlZmluZWQgbnVsbCBwcm9wZXJ0aWVzKScsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtYW5vbnltb3VzLW5leHQnKTtcbiAgZWwub25lID0gbnVsbDtcbiAgZWwudHdvID0gbnVsbDtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ29uZSwgdHdvJyk7XG59KTtcblxuaXQoJ2Fub255bW91cyBpbml0aWFsIHByb3BlcnRpZXMgKHByZWRlZmluZWQgcHJvcGVydGllcyknLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWFub255bW91cy1uZXh0Jyk7XG4gIGVsLm9uZSA9ICdPTkUnO1xuICBlbC50d28gPSAnVFdPJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ09ORSwgVFdPJyk7XG59KTtcblxuaXQoJ2Fub255bW91cyBpbml0aWFsIHByb3BlcnRpZXMgKHByZWRlZmluZWQgYXR0cmlidXRlcyknLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LWFub255bW91cy1uZXh0Jyk7XG4gIGVsLnNldEF0dHJpYnV0ZSgnb25lJywgJ09ORScpO1xuICBlbC5zZXRBdHRyaWJ1dGUoJ3R3bycsICdUV08nKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ09ORSwgVFdPJyk7XG59KTtcblxuaXQoJ2NvbXBvdW5kIGluaXRpYWwgcHJvcGVydGllcyBhcmUgbm90IHNoYXJlZCBhY2Nyb3NzIGVsZW1lbnQgaW5zdGFuY2VzJywgKCkgPT4ge1xuICBjb25zdCBlbDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtY29tcG91bmQtbmV4dCcpO1xuICBjb25zdCBlbDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtY29tcG91bmQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbDEsIGVsMik7XG4gIGFzc2VydChlbDEuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ2ZvbycpO1xuICBhc3NlcnQoZWwyLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdmb28nKTtcbiAgYXNzZXJ0KGVsMS5jb21wb3VuZCAhPT0gZWwyLmNvbXBvdW5kKTtcbn0pO1xuXG5pdCgnY2Fubm90IHNldCBpbml0aWFsIHRvIGEgYmFkIHR5cGUnLCAoKSA9PiB7XG4gIGNsYXNzIEJhZFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5pdGlhbDogMCB9KVxuICAgIGFjY2Vzc29yIGJhZDtcbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ2JhZC10ZXN0LWVsZW1lbnQtbmV4dC0xJywgQmFkVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBCYWRUZXN0RWxlbWVudCgpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCB2YWx1ZSBmb3IgXCJCYWRUZXN0RWxlbWVudC5wcm90b3R5cGUuYmFkXCIgKGV4cGVjdGVkIFN0cmluZywgZ290IE51bWJlcikuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxTQUFTQSxNQUFNLEVBQUVDLEVBQUUsUUFBUSwyQkFBMkI7QUFDdEQsU0FBU0MsUUFBUSxFQUFFQyxRQUFRLEVBQUVDLElBQUksUUFBUSxzQkFBc0I7QUFFL0QsTUFBTUMsZ0JBQWdCLFNBQVNILFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQUksU0FBQSxFQUFBQyxVQUFBLElBQUFDLFVBQUEsU0FBQUMsUUFBQSw2QkFBVFAsUUFBUSxFQUFBUSxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLElBQUFKLFVBQUEsUUFBQUQsU0FBQTtFQUFBLE1BQUFHLFFBQUEsR0FDcENOLFFBQVEsQ0FBQztJQUFFUyxJQUFJLEVBQUVDLE1BQU07SUFBRUMsT0FB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Q2hFRCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSyxHQUFHLEVBQUVDLEdBQUcsQ0FBQztFQUM5QnRELE1BQU0sQ0FBQ3FELEdBQUcsQ0FBQ0osVUFBVSxDQUFDQyxXQUFXLEtBQUssS0FBSyxDQUFDO0VBQzVDbEQsTUFBTSxDQUFDc0QsR0FBRyxDQUFDTCxVQUFVLENBQUNDLFdBQVcsS0FBSyxLQUFLLENBQUM7RUFDNUNsRCxNQUFNLENBQUNxRCxHQUFHLENBQUNWLFFBQVEsS0FBS1csR0FBRyxDQUFDWCxRQUFRLENBQUM7QUFDdkMsQ0FBQyxDQUFDO0FBRUYxQyxFQUFFLENBQUMsa0NBQWtDLEVBQUUsTUFBTTtFQUFBLElBQUFzRCxXQUFBLEVBQUFDLFFBQUEsRUFBQUMsU0FBQTtFQUMzQyxNQUFNQyxjQUFjLFNBQVN4RCxRQUFRLENBQUM7SUFBQTtNQUFBLENBQUF1RCxTQUFBLEVBQUFGLFdBQUEsSUFBQS9DLFVBQUEsU0FBQWdELFFBQUEsNkJBQVR0RCxRQUFRLEVBQUFRLENBQUE7SUFBQTtJQUFBLENBQUFDLENBQUEsSUFBQTRDLFdBQUEsUUFBQUUsU0FBQTtJQUFBLE1BQUFELFFBQUEsR0FDbENyRCxRQUFRLENBQUM7TUFBRVMsSUFBSSxFQUFFQyxNQUFNO01BQUVDLE9BQU8sRUFBRTtJQUFFLENBQUMsQ0FBQztNQUFBLGFBQUFILENBQUE7SUFBQTtJQUFBLElBQzlCZ0QsR0FBR0EsQ0FBQTNDLENBQUE7TUFBQSxNQUFBTCxDQUFBLEdBQUFLLENBQUE7SUFBQTtFQUNkO0VBQ0FHLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLHlCQUF5QixFQUFFc0MsY0FBYyxDQUFDO0VBQ2hFLE1BQU1kLEVBQUUsR0FBRyxJQUFJYyxjQUFjLENBQUMsQ0FBQztFQUMvQixJQUFJRSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRmpCLEVBQUUsQ0FBQ2tCLGlCQUFpQixDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1DLFFBQVEsR0FBRyxvRkFBb0Y7SUFDckdILE9BQU8sR0FBR0UsS0FBSyxDQUFDRixPQUFPO0lBQ3ZCRCxNQUFNLEdBQUdHLEtBQUssQ0FBQ0YsT0FBTyxLQUFLRyxRQUFRO0VBQ3JDO0VBQ0FoRSxNQUFNLENBQUM0RCxNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUMiLCJpZ25vcmVMaXN0IjpbXX0=