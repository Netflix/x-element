let _initProto, _internalPropertyDecs, _init_internalProperty, _get_internalProperty, _set_internalProperty, _internalComputedPropertyDecs, _init_internalComputedProperty, _get_internalComputedProperty, _set_internalComputedProperty, _childrenDecs, _init_children, _get_children, _set_children;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
// TODO: #346: We likely should rename this to test-private-properties and
//  rewrite to target idiomatic private fields in the future.

import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
class TestElement extends XElement {
  static {
    [_init_internalProperty, _get_internalProperty, _set_internalProperty, _init_internalComputedProperty, _get_internalComputedProperty, _set_internalComputedProperty, _init_children, _get_children, _set_children, _initProto] = _applyDecs(this, [[_internalPropertyDecs, 1, "internalProperty", o => o.#A, (o, v) => o.#A = v], [_internalComputedPropertyDecs, 1, "internalComputedProperty", o => o.#B, (o, v) => o.#B = v], [_childrenDecs, 1, "children", o => o.#C, (o, v) => o.#C = v]], [], 0, _ => #internalProperty in _, XElement).e;
  }
  #A = (_initProto(this), _init_internalProperty(this));
  set #internalProperty(v) {
    _set_internalProperty(this, v);
  }
  get #internalProperty() {
    return _get_internalProperty(this);
  }
  #B = _init_internalComputedProperty(this); // This exists on the public interface, we want to ensure that there's no
  //  issue using this same name on the internal interface.
  set #internalComputedProperty(v) {
    _set_internalComputedProperty(this, v);
  }
  get #internalComputedProperty() {
    return _get_internalComputedProperty(this);
  }
  #C = _init_children(this);
  set #children(v) {
    _set_children(this, v);
  }
  get #children() {
    return _get_children(this);
  }
  static [(_internalPropertyDecs = property({
    type: String,
    initial: 'Ferus'
  }), _internalComputedPropertyDecs = property({
    type: String,
    input: ['#internalProperty'],
    compute: internalProperty => internalProperty
  }), _childrenDecs = property({
    // Use a type that's in conflict with the public interface.
    type: Boolean
  }), "template")](host) {
    return html`<div>${host.#internalProperty}</div>`;
  }
}
customElements.define('test-element-next', TestElement);
it('initialization', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'Ferus', 'initialized as expected');
});

// TODO: #346: We can likely delete. It used to test the "in" operator on
//  el.internal proxy, but decorator API uses native private fields (#).
it.skip('can use "has" api or "in" operator.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert('internalProperty' in el.internal, 'The "has" trap does not work.');
});

// TODO: #346: We can likely delete. It used to test Reflect.ownKeys on el.internal
//  proxy, but decorator API uses native private fields which don't appear in ownKeys.
it.skip('can use "ownKeys" api.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  const ownKeys = Reflect.ownKeys(el.internal);
  assert(ownKeys.length === 3 && ownKeys[0] === 'internalProperty' && ownKeys[1] === 'internalComputedProperty' && ownKeys[2] === 'children', 'The "ownKeys" trap does not work.');
});
it('cannot be read on host', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.internalProperty === undefined);
});
it('cannot be written to on host', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.internalProperty === undefined);
  el.internalProperty = 'ignored';
  assert(el.internalProperty === 'ignored');
});

// TODO: #346: We can likely delete. It used to test reading via el.internal proxy,
//  but decorator API uses native private fields which can only be accessed within the class.
it.skip('can be read from "internal"', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.internal.internalProperty === 'Ferus');
});

// TODO: #346: We can likely delete. It used to test writing via el.internal proxy,
//  but decorator API uses native private fields which can only be modified within the class.
it.skip('can be written to from "internal"', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.internal.internalProperty = 'Dromedary';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'Dromedary', 'written to as expected');
});

// TODO: #346: We can likely delete. It used to test computed property read-only
//  enforcement via el.internal proxy, but decorator API uses native private fields.
it.skip('cannot be written to from "internal" if computed', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.internalComputedProperty = `don't do it`;
  } catch (error) {
    const expected = 'Property "TestElement.properties.internalComputedProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy constraints in
//  template, but decorator API receives the host directly. Private fields can't be accessed
//  from static methods anyway (syntax error).
it.skip('cannot set to known properties', () => {
  let _initProto2, _internalPropertyDecs2, _init_internalProperty2, _get_internalProperty2, _set_internalProperty2;
  class BadTestElement extends XElement {
    static {
      [_init_internalProperty2, _get_internalProperty2, _set_internalProperty2, _initProto2] = _applyDecs(this, [[_internalPropertyDecs2, 1, "internalProperty", o => o.#A, (o, v) => o.#A = v]], [], 0, _ => #internalProperty in _, XElement).e;
    }
    #A = (_initProto2(this), _init_internalProperty2(this));
    set #internalProperty(v) {
      _set_internalProperty2(this, v);
    }
    get #internalProperty() {
      return _get_internalProperty2(this);
    }
    static [(_internalPropertyDecs2 = property({
      type: String
    }), "template")](host) {
      // This would be a syntax error - can't access private field from static method
      // host.#internalProperty = 'Dromedary';
      return html`<div>${host.#internalProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Cannot set "BadTestElement.properties.internalProperty" via "properties".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy errors for
//  unknown property access, but decorator API uses native private fields.
it.skip('cannot get unknown properties', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.doesNotExist;
  } catch (error) {
    const expected = 'Property "TestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy errors for
//  unknown property writes, but decorator API uses native private fields.
it.skip('cannot get unknown properties', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.doesNotExist = 'nope';
  } catch (error) {
    const expected = 'Property "TestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "defineProperty" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.defineProperty(el.internal, 'foo', {});
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// This is a funny one, you can set to undefined, but we strictly don't let you
// "delete" since it has a different meaning and you strictly cannot delete our
// accessors.
// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "delete" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.deleteProperty(el.internal, 'internalProperty');
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "getOwnPropertyDescriptor" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.getOwnPropertyDescriptor(el.internal, 'internalProperty');
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "getPrototypeOf" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.getPrototypeOf(el.internal);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "isExtensible" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.isExtensible(el.internal);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "preventExtensions" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.preventExtensions(el.internal);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy trap, but
//  decorator API uses native private fields without proxy.
it.skip('cannot "setPrototypeOf" on internal.', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    Reflect.setPrototypeOf(el.internal, Array);
  } catch (error) {
    const expected = 'Invalid use of internal proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9pbnRlcm5hbFByb3BlcnR5IiwiX2dldF9pbnRlcm5hbFByb3BlcnR5IiwiX3NldF9pbnRlcm5hbFByb3BlcnR5IiwiX2luaXRfaW50ZXJuYWxDb21wdXRlZFByb3BlcnR5IiwiX2dldF9pbnRlcm5hbENvbXB1dGVkUHJvcGVydHkiLCJfc2V0X2ludGVybmFsQ29tcHV0ZWRQcm9wZXJ0eSIsIl9pbml0X2NoaWxkcmVuIiwiX2dldF9jaGlsZHJlbiIsIl9zZXRfY2hpbGRyZW4iLCJfaW5pdFByb3RvIiwiX2FwcGx5RGVjcyIsIl9pbnRlcm5hbFByb3BlcnR5RGVjcyIsIm8iLCJBIiwidiIsIl9pbnRlcm5hbENvbXB1dGVkUHJvcGVydHlEZWNzIiwiQiIsIl9jaGlsZHJlbkRlY3MiLCJDIiwiXyIsImludGVybmFsUHJvcGVydHkiLCJlIiwiI2ludGVybmFsUHJvcGVydHkiLCJpbnRlcm5hbENvbXB1dGVkUHJvcGVydHkiLCIjaW50ZXJuYWxDb21wdXRlZFByb3BlcnR5IiwiY2hpbGRyZW4iLCIjY2hpbGRyZW4iLCJ0eXBlIiwiU3RyaW5nIiwiaW5pdGlhbCIsImlucHV0IiwiY29tcHV0ZSIsIkJvb2xlYW4iLCJob3N0IiwiY3VzdG9tRWxlbWVudHMiLCJkZWZpbmUiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJvZHkiLCJhcHBlbmQiLCJzaGFkb3dSb290IiwidGV4dENvbnRlbnQiLCJza2lwIiwiaW50ZXJuYWwiLCJvd25LZXlzIiwiUmVmbGVjdCIsImxlbmd0aCIsInVuZGVmaW5lZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicGFzc2VkIiwibWVzc2FnZSIsImVycm9yIiwiZXhwZWN0ZWQiLCJfaW5pdFByb3RvMiIsIl9pbnRlcm5hbFByb3BlcnR5RGVjczIiLCJfaW5pdF9pbnRlcm5hbFByb3BlcnR5MiIsIl9nZXRfaW50ZXJuYWxQcm9wZXJ0eTIiLCJfc2V0X2ludGVybmFsUHJvcGVydHkyIiwiQmFkVGVzdEVsZW1lbnQiLCJjb25uZWN0ZWRDYWxsYmFjayIsImRvZXNOb3RFeGlzdCIsImRlZmluZVByb3BlcnR5IiwiZGVsZXRlUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXRQcm90b3R5cGVPZiIsImlzRXh0ZW5zaWJsZSIsInByZXZlbnRFeHRlbnNpb25zIiwic2V0UHJvdG90eXBlT2YiLCJBcnJheSJdLCJzb3VyY2VzIjpbInRlc3QtaW50ZXJuYWwtcHJvcGVydGllcy5zcmMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETzogIzM0NjogV2UgbGlrZWx5IHNob3VsZCByZW5hbWUgdGhpcyB0byB0ZXN0LXByaXZhdGUtcHJvcGVydGllcyBhbmRcbi8vICByZXdyaXRlIHRvIHRhcmdldCBpZGlvbWF0aWMgcHJpdmF0ZSBmaWVsZHMgaW4gdGhlIGZ1dHVyZS5cblxuaW1wb3J0IHsgYXNzZXJ0LCBpdCB9IGZyb20gJ0BuZXRmbGl4L3gtdGVzdC94LXRlc3QuanMnO1xuaW1wb3J0IHsgWEVsZW1lbnQsIHByb3BlcnR5LCBodG1sIH0gZnJvbSAnLi4veC1lbGVtZW50LW5leHQuanMnO1xuXG5jbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAnRmVydXMnIH0pXG4gIGFjY2Vzc29yICNpbnRlcm5hbFByb3BlcnR5O1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGlucHV0OiBbJyNpbnRlcm5hbFByb3BlcnR5J10sXG4gICAgY29tcHV0ZTogaW50ZXJuYWxQcm9wZXJ0eSA9PiBpbnRlcm5hbFByb3BlcnR5LFxuICB9KVxuICBhY2Nlc3NvciAjaW50ZXJuYWxDb21wdXRlZFByb3BlcnR5O1xuXG4gIC8vIFRoaXMgZXhpc3RzIG9uIHRoZSBwdWJsaWMgaW50ZXJmYWNlLCB3ZSB3YW50IHRvIGVuc3VyZSB0aGF0IHRoZXJlJ3Mgbm9cbiAgLy8gIGlzc3VlIHVzaW5nIHRoaXMgc2FtZSBuYW1lIG9uIHRoZSBpbnRlcm5hbCBpbnRlcmZhY2UuXG4gIEBwcm9wZXJ0eSh7XG4gICAgLy8gVXNlIGEgdHlwZSB0aGF0J3MgaW4gY29uZmxpY3Qgd2l0aCB0aGUgcHVibGljIGludGVyZmFjZS5cbiAgICB0eXBlOiBCb29sZWFuLFxuICB9KVxuICBhY2Nlc3NvciAjY2hpbGRyZW47XG5cbiAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICByZXR1cm4gaHRtbGA8ZGl2PiR7aG9zdC4jaW50ZXJuYWxQcm9wZXJ0eX08L2Rpdj5gO1xuICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1uZXh0JywgVGVzdEVsZW1lbnQpO1xuXG5pdCgnaW5pdGlhbGl6YXRpb24nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ0ZlcnVzJywgJ2luaXRpYWxpemVkIGFzIGV4cGVjdGVkJyk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCB0aGUgXCJpblwiIG9wZXJhdG9yIG9uXG4vLyAgZWwuaW50ZXJuYWwgcHJveHksIGJ1dCBkZWNvcmF0b3IgQVBJIHVzZXMgbmF0aXZlIHByaXZhdGUgZmllbGRzICgjKS5cbml0LnNraXAoJ2NhbiB1c2UgXCJoYXNcIiBhcGkgb3IgXCJpblwiIG9wZXJhdG9yLicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydCgnaW50ZXJuYWxQcm9wZXJ0eScgaW4gZWwuaW50ZXJuYWwsICdUaGUgXCJoYXNcIiB0cmFwIGRvZXMgbm90IHdvcmsuJyk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBSZWZsZWN0Lm93bktleXMgb24gZWwuaW50ZXJuYWxcbi8vICBwcm94eSwgYnV0IGRlY29yYXRvciBBUEkgdXNlcyBuYXRpdmUgcHJpdmF0ZSBmaWVsZHMgd2hpY2ggZG9uJ3QgYXBwZWFyIGluIG93bktleXMuXG5pdC5za2lwKCdjYW4gdXNlIFwib3duS2V5c1wiIGFwaS4nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBjb25zdCBvd25LZXlzID0gUmVmbGVjdC5vd25LZXlzKGVsLmludGVybmFsKTtcbiAgYXNzZXJ0KFxuICAgIG93bktleXMubGVuZ3RoID09PSAzICYmXG4gICAgb3duS2V5c1swXSA9PT0gJ2ludGVybmFsUHJvcGVydHknICYmXG4gICAgb3duS2V5c1sxXSA9PT0gJ2ludGVybmFsQ29tcHV0ZWRQcm9wZXJ0eScgJiZcbiAgICBvd25LZXlzWzJdID09PSAnY2hpbGRyZW4nLFxuICAgICdUaGUgXCJvd25LZXlzXCIgdHJhcCBkb2VzIG5vdCB3b3JrLidcbiAgKTtcbn0pO1xuXG5pdCgnY2Fubm90IGJlIHJlYWQgb24gaG9zdCcsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5pbnRlcm5hbFByb3BlcnR5ID09PSB1bmRlZmluZWQpO1xufSk7XG5cbml0KCdjYW5ub3QgYmUgd3JpdHRlbiB0byBvbiBob3N0JywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLmludGVybmFsUHJvcGVydHkgPT09IHVuZGVmaW5lZCk7XG4gIGVsLmludGVybmFsUHJvcGVydHkgPSAnaWdub3JlZCc7XG4gIGFzc2VydChlbC5pbnRlcm5hbFByb3BlcnR5ID09PSAnaWdub3JlZCcpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgcmVhZGluZyB2aWEgZWwuaW50ZXJuYWwgcHJveHksXG4vLyAgYnV0IGRlY29yYXRvciBBUEkgdXNlcyBuYXRpdmUgcHJpdmF0ZSBmaWVsZHMgd2hpY2ggY2FuIG9ubHkgYmUgYWNjZXNzZWQgd2l0aGluIHRoZSBjbGFzcy5cbml0LnNraXAoJ2NhbiBiZSByZWFkIGZyb20gXCJpbnRlcm5hbFwiJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLmludGVybmFsLmludGVybmFsUHJvcGVydHkgPT09ICdGZXJ1cycpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3Qgd3JpdGluZyB2aWEgZWwuaW50ZXJuYWwgcHJveHksXG4vLyAgYnV0IGRlY29yYXRvciBBUEkgdXNlcyBuYXRpdmUgcHJpdmF0ZSBmaWVsZHMgd2hpY2ggY2FuIG9ubHkgYmUgbW9kaWZpZWQgd2l0aGluIHRoZSBjbGFzcy5cbml0LnNraXAoJ2NhbiBiZSB3cml0dGVuIHRvIGZyb20gXCJpbnRlcm5hbFwiJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgZWwuaW50ZXJuYWwuaW50ZXJuYWxQcm9wZXJ0eSA9ICdEcm9tZWRhcnknO1xuXG4gIC8vIFdlIG11c3QgYXdhaXQgYSBtaWNyb3Rhc2sgZm9yIHRoZSB1cGRhdGUgdG8gdGFrZSBwbGFjZS5cbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnRHJvbWVkYXJ5JywgJ3dyaXR0ZW4gdG8gYXMgZXhwZWN0ZWQnKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IGNvbXB1dGVkIHByb3BlcnR5IHJlYWQtb25seVxuLy8gIGVuZm9yY2VtZW50IHZpYSBlbC5pbnRlcm5hbCBwcm94eSwgYnV0IGRlY29yYXRvciBBUEkgdXNlcyBuYXRpdmUgcHJpdmF0ZSBmaWVsZHMuXG5pdC5za2lwKCdjYW5ub3QgYmUgd3JpdHRlbiB0byBmcm9tIFwiaW50ZXJuYWxcIiBpZiBjb21wdXRlZCcsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuaW50ZXJuYWwuaW50ZXJuYWxDb21wdXRlZFByb3BlcnR5ID0gYGRvbid0IGRvIGl0YDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIlRlc3RFbGVtZW50LnByb3BlcnRpZXMuaW50ZXJuYWxDb21wdXRlZFByb3BlcnR5XCIgaXMgY29tcHV0ZWQgKGNvbXB1dGVkIHByb3BlcnRpZXMgYXJlIHJlYWQtb25seSkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IHByb3BlcnRpZXMgcHJveHkgY29uc3RyYWludHMgaW5cbi8vICB0ZW1wbGF0ZSwgYnV0IGRlY29yYXRvciBBUEkgcmVjZWl2ZXMgdGhlIGhvc3QgZGlyZWN0bHkuIFByaXZhdGUgZmllbGRzIGNhbid0IGJlIGFjY2Vzc2VkXG4vLyAgZnJvbSBzdGF0aWMgbWV0aG9kcyBhbnl3YXkgKHN5bnRheCBlcnJvcikuXG5pdC5za2lwKCdjYW5ub3Qgc2V0IHRvIGtub3duIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIGNsYXNzIEJhZFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZyB9KVxuICAgIGFjY2Vzc29yICNpbnRlcm5hbFByb3BlcnR5O1xuXG4gICAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICAgIC8vIFRoaXMgd291bGQgYmUgYSBzeW50YXggZXJyb3IgLSBjYW4ndCBhY2Nlc3MgcHJpdmF0ZSBmaWVsZCBmcm9tIHN0YXRpYyBtZXRob2RcbiAgICAgIC8vIGhvc3QuI2ludGVybmFsUHJvcGVydHkgPSAnRHJvbWVkYXJ5JztcbiAgICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0LiNpbnRlcm5hbFByb3BlcnR5fTwvZGl2PmA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFkLXRlc3QtZWxlbWVudC1uZXh0LTEnLCBCYWRUZXN0RWxlbWVudCk7XG4gIGNvbnN0IGVsID0gbmV3IEJhZFRlc3RFbGVtZW50KCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdDYW5ub3Qgc2V0IFwiQmFkVGVzdEVsZW1lbnQucHJvcGVydGllcy5pbnRlcm5hbFByb3BlcnR5XCIgdmlhIFwicHJvcGVydGllc1wiLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBlbC5pbnRlcm5hbCBwcm94eSBlcnJvcnMgZm9yXG4vLyAgdW5rbm93biBwcm9wZXJ0eSBhY2Nlc3MsIGJ1dCBkZWNvcmF0b3IgQVBJIHVzZXMgbmF0aXZlIHByaXZhdGUgZmllbGRzLlxuaXQuc2tpcCgnY2Fubm90IGdldCB1bmtub3duIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmludGVybmFsLmRvZXNOb3RFeGlzdDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIlRlc3RFbGVtZW50LnByb3BlcnRpZXMuZG9lc05vdEV4aXN0XCIgZG9lcyBub3QgZXhpc3QuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IGVsLmludGVybmFsIHByb3h5IGVycm9ycyBmb3Jcbi8vICB1bmtub3duIHByb3BlcnR5IHdyaXRlcywgYnV0IGRlY29yYXRvciBBUEkgdXNlcyBuYXRpdmUgcHJpdmF0ZSBmaWVsZHMuXG5pdC5za2lwKCdjYW5ub3QgZ2V0IHVua25vd24gcHJvcGVydGllcycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuaW50ZXJuYWwuZG9lc05vdEV4aXN0ID0gJ25vcGUnO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1Byb3BlcnR5IFwiVGVzdEVsZW1lbnQucHJvcGVydGllcy5kb2VzTm90RXhpc3RcIiBkb2VzIG5vdCBleGlzdC4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgZWwuaW50ZXJuYWwgcHJveHkgdHJhcCwgYnV0XG4vLyAgZGVjb3JhdG9yIEFQSSB1c2VzIG5hdGl2ZSBwcml2YXRlIGZpZWxkcyB3aXRob3V0IHByb3h5LlxuaXQuc2tpcCgnY2Fubm90IFwiZGVmaW5lUHJvcGVydHlcIiBvbiBpbnRlcm5hbC4nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoZWwuaW50ZXJuYWwsICdmb28nLCB7fSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnSW52YWxpZCB1c2Ugb2YgaW50ZXJuYWwgcHJveHkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUaGlzIGlzIGEgZnVubnkgb25lLCB5b3UgY2FuIHNldCB0byB1bmRlZmluZWQsIGJ1dCB3ZSBzdHJpY3RseSBkb24ndCBsZXQgeW91XG4vLyBcImRlbGV0ZVwiIHNpbmNlIGl0IGhhcyBhIGRpZmZlcmVudCBtZWFuaW5nIGFuZCB5b3Ugc3RyaWN0bHkgY2Fubm90IGRlbGV0ZSBvdXJcbi8vIGFjY2Vzc29ycy5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgZWwuaW50ZXJuYWwgcHJveHkgdHJhcCwgYnV0XG4vLyAgZGVjb3JhdG9yIEFQSSB1c2VzIG5hdGl2ZSBwcml2YXRlIGZpZWxkcyB3aXRob3V0IHByb3h5LlxuaXQuc2tpcCgnY2Fubm90IFwiZGVsZXRlXCIgb24gaW50ZXJuYWwuJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGVsLmludGVybmFsLCAnaW50ZXJuYWxQcm9wZXJ0eScpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ0ludmFsaWQgdXNlIG9mIGludGVybmFsIHByb3h5Lic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBlbC5pbnRlcm5hbCBwcm94eSB0cmFwLCBidXRcbi8vICBkZWNvcmF0b3IgQVBJIHVzZXMgbmF0aXZlIHByaXZhdGUgZmllbGRzIHdpdGhvdXQgcHJveHkuXG5pdC5za2lwKCdjYW5ub3QgXCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcIiBvbiBpbnRlcm5hbC4nLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGVsLmludGVybmFsLCAnaW50ZXJuYWxQcm9wZXJ0eScpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ0ludmFsaWQgdXNlIG9mIGludGVybmFsIHByb3h5Lic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBlbC5pbnRlcm5hbCBwcm94eSB0cmFwLCBidXRcbi8vICBkZWNvcmF0b3IgQVBJIHVzZXMgbmF0aXZlIHByaXZhdGUgZmllbGRzIHdpdGhvdXQgcHJveHkuXG5pdC5za2lwKCdjYW5ub3QgXCJnZXRQcm90b3R5cGVPZlwiIG9uIGludGVybmFsLicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgUmVmbGVjdC5nZXRQcm90b3R5cGVPZihlbC5pbnRlcm5hbCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnSW52YWxpZCB1c2Ugb2YgaW50ZXJuYWwgcHJveHkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IGVsLmludGVybmFsIHByb3h5IHRyYXAsIGJ1dFxuLy8gIGRlY29yYXRvciBBUEkgdXNlcyBuYXRpdmUgcHJpdmF0ZSBmaWVsZHMgd2l0aG91dCBwcm94eS5cbml0LnNraXAoJ2Nhbm5vdCBcImlzRXh0ZW5zaWJsZVwiIG9uIGludGVybmFsLicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgUmVmbGVjdC5pc0V4dGVuc2libGUoZWwuaW50ZXJuYWwpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ0ludmFsaWQgdXNlIG9mIGludGVybmFsIHByb3h5Lic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBlbC5pbnRlcm5hbCBwcm94eSB0cmFwLCBidXRcbi8vICBkZWNvcmF0b3IgQVBJIHVzZXMgbmF0aXZlIHByaXZhdGUgZmllbGRzIHdpdGhvdXQgcHJveHkuXG5pdC5za2lwKCdjYW5ub3QgXCJwcmV2ZW50RXh0ZW5zaW9uc1wiIG9uIGludGVybmFsLicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhlbC5pbnRlcm5hbCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnSW52YWxpZCB1c2Ugb2YgaW50ZXJuYWwgcHJveHkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IGVsLmludGVybmFsIHByb3h5IHRyYXAsIGJ1dFxuLy8gIGRlY29yYXRvciBBUEkgdXNlcyBuYXRpdmUgcHJpdmF0ZSBmaWVsZHMgd2l0aG91dCBwcm94eS5cbml0LnNraXAoJ2Nhbm5vdCBcInNldFByb3RvdHlwZU9mXCIgb24gaW50ZXJuYWwuJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBSZWZsZWN0LnNldFByb3RvdHlwZU9mKGVsLmludGVybmFsLCBBcnJheSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnSW52YWxpZCB1c2Ugb2YgaW50ZXJuYWwgcHJveHkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOztBQUVBLFNBQVNBLE1BQU0sRUFBRUMsRUFBRSxRQUFRLDJCQUEyQjtBQUN0RCxTQUFTQyxRQUFRLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxRQUFRLHNCQUFzQjtBQUUvRCxNQUFNQyxXQUFXLFNBQVNILFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQUksc0JBQUEsRUFBQUMscUJBQUEsRUFBQUMscUJBQUEsRUFBQUMsOEJBQUEsRUFBQUMsNkJBQUEsRUFBQUMsNkJBQUEsRUFBQUMsY0FBQSxFQUFBQyxhQUFBLEVBQUFDLGFBQUEsRUFBQUMsVUFBQSxJQUFBQyxVQUFBLFNBQUFDLHFCQUFBLHlCQUFBQyxDQUFBLElBQUFBLENBQUEsRUFBQUMsQ0FBQSxHQUFBRCxDQUFBLEVBQUFFLENBQUEsS0FBQUYsQ0FBQSxFQUFBQyxDQUFBLEdBQUFDLENBQUEsSUFBQUMsNkJBQUEsaUNBQUFILENBQUEsSUFBQUEsQ0FBQSxFQUFBSSxDQUFBLEdBQUFK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