let _initProto, _camelCasePropertyDecs, _init_camelCaseProperty, _overridePropertyDecs, _init_overrideProperty, _booleanPropertyTrueDecs, _init_booleanPropertyTrue, _booleanPropertyFalseDecs, _init_booleanPropertyFalse;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
class TestElement extends XElement {
  static {
    [_init_camelCaseProperty, _init_overrideProperty, _init_booleanPropertyTrue, _init_booleanPropertyFalse, _initProto] = _applyDecs(this, [[_camelCasePropertyDecs, 1, "camelCaseProperty"], [_overridePropertyDecs, 1, "overrideProperty"], [_booleanPropertyTrueDecs, 1, "booleanPropertyTrue"], [_booleanPropertyFalseDecs, 1, "booleanPropertyFalse"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto(this), _init_camelCaseProperty(this));
  get [(_camelCasePropertyDecs = property({
    type: String,
    initial: 'reflectedCamel',
    reflect: true
  }), _overridePropertyDecs = property({
    type: String,
    initial: 'override_me',
    reflect: true
  }), _booleanPropertyTrueDecs = property({
    type: Boolean,
    initial: true,
    reflect: true
  }), _booleanPropertyFalseDecs = property({
    type: Boolean,
    initial: false,
    reflect: true
  }), "camelCaseProperty")]() {
    return this.#A;
  }
  set camelCaseProperty(v) {
    this.#A = v;
  }
  #B = _init_overrideProperty(this);
  get overrideProperty() {
    return this.#B;
  }
  set overrideProperty(v) {
    this.#B = v;
  }
  #C = _init_booleanPropertyTrue(this);
  get booleanPropertyTrue() {
    return this.#C;
  }
  set booleanPropertyTrue(v) {
    this.#C = v;
  }
  #D = _init_booleanPropertyFalse(this);
  get booleanPropertyFalse() {
    return this.#D;
  }
  set booleanPropertyFalse(v) {
    this.#D = v;
  }
  static template(host) {
    return html`<span>${host.camelCaseProperty}</span>`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.overrideProperty = 'overridden';
  }
}
customElements.define('test-element-next', TestElement);
it('reflects initial value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.getAttribute('camel-case-property') === 'reflectedCamel');
});
it('renders the template with the initial value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.querySelector('span').textContent === 'reflectedCamel');
});
it('reflects initial value (Boolean, true)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-true'));
});
it('does not reflect initial value (Boolean, false)', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-false') === false);
});
it('reflects next value after a micro tick', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.camelCaseProperty = 'dromedary';
  assert(el.getAttribute('camel-case-property') === 'reflectedCamel' && el.shadowRoot.querySelector('span').textContent === 'reflectedCamel');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.querySelector('span').textContent === 'dromedary');
});
it('has reflected override value after connected', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.getAttribute('override-property') === 'override_me');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.getAttribute('override-property') === 'overridden');
});
it('does not reflect next false value (Boolean)', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.hasAttribute('boolean-property-true'));
  el.booleanPropertyTrue = false;
  assert(el.hasAttribute('boolean-property-true'));

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('boolean-property-true') === false);
  el.booleanPropertyTrue = true;
  assert(el.hasAttribute('boolean-property-true') === false);

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('boolean-property-true'));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9jYW1lbENhc2VQcm9wZXJ0eSIsIl9pbml0X292ZXJyaWRlUHJvcGVydHkiLCJfaW5pdF9ib29sZWFuUHJvcGVydHlUcnVlIiwiX2luaXRfYm9vbGVhblByb3BlcnR5RmFsc2UiLCJfaW5pdFByb3RvIiwiX2FwcGx5RGVjcyIsIl9jYW1lbENhc2VQcm9wZXJ0eURlY3MiLCJfb3ZlcnJpZGVQcm9wZXJ0eURlY3MiLCJfYm9vbGVhblByb3BlcnR5VHJ1ZURlY3MiLCJfYm9vbGVhblByb3BlcnR5RmFsc2VEZWNzIiwiZSIsIkEiLCJ0eXBlIiwiU3RyaW5nIiwiaW5pdGlhbCIsInJlZmxlY3QiLCJCb29sZWFuIiwiY2FtZWxDYXNlUHJvcGVydHkiLCJ2IiwiQiIsIm92ZXJyaWRlUHJvcGVydHkiLCJDIiwiYm9vbGVhblByb3BlcnR5VHJ1ZSIsIkQiLCJib29sZWFuUHJvcGVydHlGYWxzZSIsInRlbXBsYXRlIiwiaG9zdCIsImNvbm5lY3RlZENhbGxiYWNrIiwiY3VzdG9tRWxlbWVudHMiLCJkZWZpbmUiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJvZHkiLCJhcHBlbmQiLCJnZXRBdHRyaWJ1dGUiLCJzaGFkb3dSb290IiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiaGFzQXR0cmlidXRlIiwiUHJvbWlzZSIsInJlc29sdmUiXSwic291cmNlcyI6WyJ0ZXN0LXJlZmxlY3RlZC1wcm9wZXJ0aWVzLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHksIGh0bWwgfSBmcm9tICcuLi94LWVsZW1lbnQtbmV4dC5qcyc7XG5cbmNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICdyZWZsZWN0ZWRDYW1lbCcsIHJlZmxlY3Q6IHRydWUgfSlcbiAgYWNjZXNzb3IgY2FtZWxDYXNlUHJvcGVydHk7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAnb3ZlcnJpZGVfbWUnLCByZWZsZWN0OiB0cnVlIH0pXG4gIGFjY2Vzc29yIG92ZXJyaWRlUHJvcGVydHk7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogQm9vbGVhbiwgaW5pdGlhbDogdHJ1ZSwgcmVmbGVjdDogdHJ1ZSB9KVxuICBhY2Nlc3NvciBib29sZWFuUHJvcGVydHlUcnVlO1xuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IEJvb2xlYW4sIGluaXRpYWw6IGZhbHNlLCByZWZsZWN0OiB0cnVlIH0pXG4gIGFjY2Vzc29yIGJvb2xlYW5Qcm9wZXJ0eUZhbHNlO1xuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPHNwYW4+JHtob3N0LmNhbWVsQ2FzZVByb3BlcnR5fTwvc3Bhbj5gO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICB0aGlzLm92ZXJyaWRlUHJvcGVydHkgPSAnb3ZlcnJpZGRlbic7XG4gIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LW5leHQnLCBUZXN0RWxlbWVudCk7XG5cblxuaXQoJ3JlZmxlY3RzIGluaXRpYWwgdmFsdWUnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuZ2V0QXR0cmlidXRlKCdjYW1lbC1jYXNlLXByb3BlcnR5JykgPT09ICdyZWZsZWN0ZWRDYW1lbCcpO1xufSk7XG5cbml0KCdyZW5kZXJzIHRoZSB0ZW1wbGF0ZSB3aXRoIHRoZSBpbml0aWFsIHZhbHVlJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3BhbicpLnRleHRDb250ZW50ID09PSAncmVmbGVjdGVkQ2FtZWwnKTtcbn0pO1xuXG5pdCgncmVmbGVjdHMgaW5pdGlhbCB2YWx1ZSAoQm9vbGVhbiwgdHJ1ZSknLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuaGFzQXR0cmlidXRlKCdib29sZWFuLXByb3BlcnR5LXRydWUnKSk7XG59KTtcblxuaXQoJ2RvZXMgbm90IHJlZmxlY3QgaW5pdGlhbCB2YWx1ZSAoQm9vbGVhbiwgZmFsc2UpJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLmhhc0F0dHJpYnV0ZSgnYm9vbGVhbi1wcm9wZXJ0eS1mYWxzZScpID09PSBmYWxzZSk7XG59KTtcblxuaXQoJ3JlZmxlY3RzIG5leHQgdmFsdWUgYWZ0ZXIgYSBtaWNybyB0aWNrJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgZWwuY2FtZWxDYXNlUHJvcGVydHkgPSAnZHJvbWVkYXJ5JztcbiAgYXNzZXJ0KFxuICAgIGVsLmdldEF0dHJpYnV0ZSgnY2FtZWwtY2FzZS1wcm9wZXJ0eScpID09PSAncmVmbGVjdGVkQ2FtZWwnICYmXG4gICAgICBlbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS50ZXh0Q29udGVudCA9PT0gJ3JlZmxlY3RlZENhbWVsJ1xuICApO1xuXG4gIC8vIFdlIG11c3QgYXdhaXQgYSBtaWNyb3Rhc2sgZm9yIHRoZSB1cGRhdGUgdG8gdGFrZSBwbGFjZS5cbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS50ZXh0Q29udGVudCA9PT0gJ2Ryb21lZGFyeScpO1xufSk7XG5cbml0KCdoYXMgcmVmbGVjdGVkIG92ZXJyaWRlIHZhbHVlIGFmdGVyIGNvbm5lY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5nZXRBdHRyaWJ1dGUoJ292ZXJyaWRlLXByb3BlcnR5JykgPT09ICdvdmVycmlkZV9tZScpO1xuXG4gIC8vIFdlIG11c3QgYXdhaXQgYSBtaWNyb3Rhc2sgZm9yIHRoZSB1cGRhdGUgdG8gdGFrZSBwbGFjZS5cbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5nZXRBdHRyaWJ1dGUoJ292ZXJyaWRlLXByb3BlcnR5JykgPT09ICdvdmVycmlkZGVuJyk7XG59KTtcblxuaXQoJ2RvZXMgbm90IHJlZmxlY3QgbmV4dCBmYWxzZSB2YWx1ZSAoQm9vbGVhbiknLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuaGFzQXR0cmlidXRlKCdib29sZWFuLXByb3BlcnR5LXRydWUnKSk7XG4gIGVsLmJvb2xlYW5Qcm9wZXJ0eVRydWUgPSBmYWxzZTtcbiAgYXNzZXJ0KGVsLmhhc0F0dHJpYnV0ZSgnYm9vbGVhbi1wcm9wZXJ0eS10cnVlJykpO1xuXG4gIC8vIFdlIG11c3QgYXdhaXQgYSBtaWNyb3Rhc2sgZm9yIHRoZSB1cGRhdGUgdG8gdGFrZSBwbGFjZS5cbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5oYXNBdHRyaWJ1dGUoJ2Jvb2xlYW4tcHJvcGVydHktdHJ1ZScpID09PSBmYWxzZSk7XG4gIGVsLmJvb2xlYW5Qcm9wZXJ0eVRydWUgPSB0cnVlO1xuICBhc3NlcnQoZWwuaGFzQXR0cmlidXRlKCdib29sZWFuLXByb3BlcnR5LXRydWUnKSA9PT0gZmFsc2UpO1xuXG4gIC8vIFdlIG11c3QgYXdhaXQgYSBtaWNyb3Rhc2sgZm9yIHRoZSB1cGRhdGUgdG8gdGFrZSBwbGFjZS5cbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5oYXNBdHRyaWJ1dGUoJ2Jvb2xlYW4tcHJvcGVydHktdHJ1ZScpKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxTQUFTQSxNQUFNLEVBQUVDLEVBQUUsUUFBUSwyQkFBMkI7QUFDdEQsU0FBU0MsUUFBUSxFQUFFQyxRQUFRLEVBQUVDLElBQUksUUFBUSxzQkFBc0I7QUFFL0QsTUFBTUMsV0FBVyxTQUFTSCxRQUFRLENBQUM7RUFBQTtJQUFBLENBQUFJLHVCQUFBLEVBQUFDLHNCQUFBLEVBQUFDLHlCQUFBLEVBQUFDLDBCQUFBLEVBQUFDLFVBQUEsSUFBQUMsVUFBQSxTQUFBQyxzQkFBQSw0QkFBQUMscUJBQUEsMkJBQUFDLHdCQUFBLDhCQUFBQyx5QkFBQSw4Q0FBVGIsUUFBUSxFQUFBYyxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLElBQUFQLFVBQUEsUUFBQUosdUJBQUE7RUFBQSxNQUFBTSxzQkFBQSxHQUMvQlQsUUFBUSxDQUFDO0lBQUVlLElBQUksRUFBRUMsTUFBTTtJQUFFQyxPQUFPLEVBQUUsZ0JBQWdCO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxFQUFBUixx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