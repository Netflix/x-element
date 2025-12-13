let _initProto, _fooDecs, _init_foo, _barDecs, _init_bar, _readOnlyPropDecs, _init_readOnlyProp, _get_readOnlyProp, _set_readOnlyProp, _readOnlyPropDecs2, _init_readOnlyProp2, _computedPropDecs, _init_computedProp;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property } from '../x-element-next.js';
class TestElement extends XElement {
  static {
    [_init_foo, _init_bar, _init_readOnlyProp, _get_readOnlyProp, _set_readOnlyProp, _init_readOnlyProp2, _init_computedProp, _initProto] = _applyDecs(this, [[_fooDecs, 1, "foo"], [_barDecs, 1, "bar"], [_readOnlyPropDecs, 1, "readOnlyProp", o => o.#C, (o, v) => o.#C = v], [_readOnlyPropDecs2, 1, "readOnlyProp"], [_computedPropDecs, 1, "computedProp"]], [], 0, _ => #readOnlyProp in _, XElement).e;
  }
  #A = (_initProto(this), _init_foo(this));
  get [(_fooDecs = property({
    type: String
  }), _barDecs = property({
    type: Number
  }), _readOnlyPropDecs = property({
    type: String
  }), _readOnlyPropDecs2 = property({
    type: String,
    input: ['#readOnlyProp'],
    compute: readOnlyProp => readOnlyProp
  }), _computedPropDecs = property({
    type: String,
    input: ['foo'],
    compute: foo => `computed-${foo}`
  }), "foo")]() {
    return this.#A;
  }
  set foo(v) {
    this.#A = v;
  }
  #B = _init_bar(this);
  get bar() {
    return this.#B;
  }
  set bar(v) {
    this.#B = v;
  }
  #C = _init_readOnlyProp(this);
  set #readOnlyProp(v) {
    _set_readOnlyProp(this, v);
  }
  get #readOnlyProp() {
    return _get_readOnlyProp(this);
  }
  #D = _init_readOnlyProp2(this);
  get readOnlyProp() {
    return this.#D;
  }
  set readOnlyProp(v) {
    this.#D = v;
  }
  #E = _init_computedProp(this);
  get computedProp() {
    return this.#E;
  }
  set computedProp(v) {
    this.#E = v;
  }
}
customElements.define('test-delete-element-next', TestElement);

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('properties are non-configurable from construction', () => {
  const el = document.createElement('test-delete-element-next');
  const descriptor = Object.getOwnPropertyDescriptor(el, 'foo');
  assert(descriptor !== undefined);
  assert(descriptor.configurable === false);
  assert(descriptor.enumerable === true);
  assert(typeof descriptor.get === 'function');
  assert(typeof descriptor.set === 'function');
});

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('prevents deletion of properties after construction', () => {
  const el = document.createElement('test-delete-element-next');
  assert('foo' in el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    delete el.foo;
  } catch (error) {
    message = error.message;
    passed = error.message.includes('Cannot delete property');
  }
  assert(passed, message);
  assert('foo' in el);
});

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('returns false for Reflect.deleteProperty after construction', () => {
  const el = document.createElement('test-delete-element-next');
  assert('foo' in el);
  const result = Reflect.deleteProperty(el, 'foo');
  assert(result === false);
  assert('foo' in el);
});

// TODO: #346 — Decorator API uses prototype-based accessors instead of
// instance properties. Properties are defined on the prototype, not on each
// instance, which is more memory-efficient. This test checked instance-level
// non-configurability, which doesn't apply to the prototype-based approach.
it.skip('properties remain non-configurable after initialization', () => {
  const el = document.createElement('test-delete-element-next');
  document.body.append(el);
  const descriptor = Object.getOwnPropertyDescriptor(el, 'foo');
  assert(descriptor !== undefined);
  assert(descriptor.configurable === false);
  assert(descriptor.enumerable === true);
  assert(typeof descriptor.get === 'function');
  assert(typeof descriptor.set === 'function');
  el.remove();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJUZXN0RWxlbWVudCIsIl9pbml0X2ZvbyIsIl9pbml0X2JhciIsIl9pbml0X3JlYWRPbmx5UHJvcCIsIl9nZXRfcmVhZE9ubHlQcm9wIiwiX3NldF9yZWFkT25seVByb3AiLCJfaW5pdF9yZWFkT25seVByb3AyIiwiX2luaXRfY29tcHV0ZWRQcm9wIiwiX2luaXRQcm90byIsIl9hcHBseURlY3MiLCJfZm9vRGVjcyIsIl9iYXJEZWNzIiwiX3JlYWRPbmx5UHJvcERlY3MiLCJvIiwiQyIsInYiLCJfcmVhZE9ubHlQcm9wRGVjczIiLCJfY29tcHV0ZWRQcm9wRGVjcyIsIl8iLCJyZWFkT25seVByb3AiLCJlIiwiQSIsInR5cGUiLCJTdHJpbmciLCJOdW1iZXIiLCJpbnB1dCIsImNvbXB1dGUiLCJmb28iLCJCIiwiYmFyIiwiI3JlYWRPbmx5UHJvcCIsIkQiLCJFIiwiY29tcHV0ZWRQcm9wIiwiY3VzdG9tRWxlbWVudHMiLCJkZWZpbmUiLCJza2lwIiwiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJkZXNjcmlwdG9yIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidW5kZWZpbmVkIiwiY29uZmlndXJhYmxlIiwiZW51bWVyYWJsZSIsImdldCIsInNldCIsInBhc3NlZCIsIm1lc3NhZ2UiLCJlcnJvciIsImluY2x1ZGVzIiwicmVzdWx0IiwiUmVmbGVjdCIsImRlbGV0ZVByb3BlcnR5IiwiYm9keSIsImFwcGVuZCIsInJlbW92ZSJdLCJzb3VyY2VzIjpbInRlc3QtcHJvcGVydHktZGVsZXRpb24uc3JjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCwgaXQgfSBmcm9tICdAbmV0ZmxpeC94LXRlc3QveC10ZXN0LmpzJztcbmltcG9ydCB7IFhFbGVtZW50LCBwcm9wZXJ0eSB9IGZyb20gJy4uL3gtZWxlbWVudC1uZXh0LmpzJztcblxuY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZyB9KVxuICBhY2Nlc3NvciBmb287XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyIH0pXG4gIGFjY2Vzc29yIGJhcjtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgYWNjZXNzb3IgI3JlYWRPbmx5UHJvcDtcblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbnB1dDogWycjcmVhZE9ubHlQcm9wJ10sXG4gICAgY29tcHV0ZTogKHJlYWRPbmx5UHJvcCkgPT4gcmVhZE9ubHlQcm9wLFxuICB9KVxuICBhY2Nlc3NvciByZWFkT25seVByb3A7XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5wdXQ6IFsnZm9vJ10sXG4gICAgY29tcHV0ZTogKGZvbykgPT4gYGNvbXB1dGVkLSR7Zm9vfWAsXG4gIH0pXG4gIGFjY2Vzc29yIGNvbXB1dGVkUHJvcDtcbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1kZWxldGUtZWxlbWVudC1uZXh0JywgVGVzdEVsZW1lbnQpO1xuXG4vLyBUT0RPOiAjMzQ2IOKAlCBEZWNvcmF0b3IgQVBJIHVzZXMgcHJvdG90eXBlLWJhc2VkIGFjY2Vzc29ycyBpbnN0ZWFkIG9mXG4vLyBpbnN0YW5jZSBwcm9wZXJ0aWVzLiBQcm9wZXJ0aWVzIGFyZSBkZWZpbmVkIG9uIHRoZSBwcm90b3R5cGUsIG5vdCBvbiBlYWNoXG4vLyBpbnN0YW5jZSwgd2hpY2ggaXMgbW9yZSBtZW1vcnktZWZmaWNpZW50LiBUaGlzIHRlc3QgY2hlY2tlZCBpbnN0YW5jZS1sZXZlbFxuLy8gbm9uLWNvbmZpZ3VyYWJpbGl0eSwgd2hpY2ggZG9lc24ndCBhcHBseSB0byB0aGUgcHJvdG90eXBlLWJhc2VkIGFwcHJvYWNoLlxuaXQuc2tpcCgncHJvcGVydGllcyBhcmUgbm9uLWNvbmZpZ3VyYWJsZSBmcm9tIGNvbnN0cnVjdGlvbicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWRlbGV0ZS1lbGVtZW50LW5leHQnKTtcbiAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZWwsICdmb28nKTtcbiAgYXNzZXJ0KGRlc2NyaXB0b3IgIT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpO1xuICBhc3NlcnQoZGVzY3JpcHRvci5lbnVtZXJhYmxlID09PSB0cnVlKTtcbiAgYXNzZXJ0KHR5cGVvZiBkZXNjcmlwdG9yLmdldCA9PT0gJ2Z1bmN0aW9uJyk7XG4gIGFzc2VydCh0eXBlb2YgZGVzY3JpcHRvci5zZXQgPT09ICdmdW5jdGlvbicpO1xufSk7XG5cbi8vIFRPRE86ICMzNDYg4oCUIERlY29yYXRvciBBUEkgdXNlcyBwcm90b3R5cGUtYmFzZWQgYWNjZXNzb3JzIGluc3RlYWQgb2Zcbi8vIGluc3RhbmNlIHByb3BlcnRpZXMuIFByb3BlcnRpZXMgYXJlIGRlZmluZWQgb24gdGhlIHByb3RvdHlwZSwgbm90IG9uIGVhY2hcbi8vIGluc3RhbmNlLCB3aGljaCBpcyBtb3JlIG1lbW9yeS1lZmZpY2llbnQuIFRoaXMgdGVzdCBjaGVja2VkIGluc3RhbmNlLWxldmVsXG4vLyBub24tY29uZmlndXJhYmlsaXR5LCB3aGljaCBkb2Vzbid0IGFwcGx5IHRvIHRoZSBwcm90b3R5cGUtYmFzZWQgYXBwcm9hY2guXG5pdC5za2lwKCdwcmV2ZW50cyBkZWxldGlvbiBvZiBwcm9wZXJ0aWVzIGFmdGVyIGNvbnN0cnVjdGlvbicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWRlbGV0ZS1lbGVtZW50LW5leHQnKTtcbiAgYXNzZXJ0KCdmb28nIGluIGVsKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBkZWxldGUgZWwuZm9vO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ0Nhbm5vdCBkZWxldGUgcHJvcGVydHknKTtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbiAgYXNzZXJ0KCdmb28nIGluIGVsKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2IOKAlCBEZWNvcmF0b3IgQVBJIHVzZXMgcHJvdG90eXBlLWJhc2VkIGFjY2Vzc29ycyBpbnN0ZWFkIG9mXG4vLyBpbnN0YW5jZSBwcm9wZXJ0aWVzLiBQcm9wZXJ0aWVzIGFyZSBkZWZpbmVkIG9uIHRoZSBwcm90b3R5cGUsIG5vdCBvbiBlYWNoXG4vLyBpbnN0YW5jZSwgd2hpY2ggaXMgbW9yZSBtZW1vcnktZWZmaWNpZW50LiBUaGlzIHRlc3QgY2hlY2tlZCBpbnN0YW5jZS1sZXZlbFxuLy8gbm9uLWNvbmZpZ3VyYWJpbGl0eSwgd2hpY2ggZG9lc24ndCBhcHBseSB0byB0aGUgcHJvdG90eXBlLWJhc2VkIGFwcHJvYWNoLlxuaXQuc2tpcCgncmV0dXJucyBmYWxzZSBmb3IgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSBhZnRlciBjb25zdHJ1Y3Rpb24nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1kZWxldGUtZWxlbWVudC1uZXh0Jyk7XG4gIGFzc2VydCgnZm9vJyBpbiBlbCk7XG4gIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoZWwsICdmb28nKTtcbiAgYXNzZXJ0KHJlc3VsdCA9PT0gZmFsc2UpO1xuICBhc3NlcnQoJ2ZvbycgaW4gZWwpO1xufSk7XG5cbi8vIFRPRE86ICMzNDYg4oCUIERlY29yYXRvciBBUEkgdXNlcyBwcm90b3R5cGUtYmFzZWQgYWNjZXNzb3JzIGluc3RlYWQgb2Zcbi8vIGluc3RhbmNlIHByb3BlcnRpZXMuIFByb3BlcnRpZXMgYXJlIGRlZmluZWQgb24gdGhlIHByb3RvdHlwZSwgbm90IG9uIGVhY2hcbi8vIGluc3RhbmNlLCB3aGljaCBpcyBtb3JlIG1lbW9yeS1lZmZpY2llbnQuIFRoaXMgdGVzdCBjaGVja2VkIGluc3RhbmNlLWxldmVsXG4vLyBub24tY29uZmlndXJhYmlsaXR5LCB3aGljaCBkb2Vzbid0IGFwcGx5IHRvIHRoZSBwcm90b3R5cGUtYmFzZWQgYXBwcm9hY2guXG5pdC5za2lwKCdwcm9wZXJ0aWVzIHJlbWFpbiBub24tY29uZmlndXJhYmxlIGFmdGVyIGluaXRpYWxpemF0aW9uJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZGVsZXRlLWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGVsLCAnZm9vJyk7XG4gIGFzc2VydChkZXNjcmlwdG9yICE9PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoZGVzY3JpcHRvci5jb25maWd1cmFibGUgPT09IGZhbHNlKTtcbiAgYXNzZXJ0KGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9PT0gdHJ1ZSk7XG4gIGFzc2VydCh0eXBlb2YgZGVzY3JpcHRvci5nZXQgPT09ICdmdW5jdGlvbicpO1xuICBhc3NlcnQodHlwZW9mIGRlc2NyaXB0b3Iuc2V0ID09PSAnZnVuY3Rpb24nKTtcbiAgZWwucmVtb3ZlKCk7XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsU0FBU0EsTUFBTSxFQUFFQyxFQUFFLFFBQVEsMkJBQTJCO0FBQ3RELFNBQVNDLFFBQVEsRUFBRUMsUUFBUSxRQUFRLHNCQUFzQjtBQUV6RCxNQUFNQyxXQUFXLFNBQVNGLFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQUcsU0FBQSxFQUFBQyxTQUFBLEVBQUFDLGtCQUFBLEVBQUFDLGlCQUFBLEVBQUFD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