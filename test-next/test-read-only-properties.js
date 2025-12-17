let _initProto, _readOnlyPropertyDecs, _init_readOnlyProperty, _get_readOnlyProperty, _set_readOnlyProperty, _readOnlyPropertyDecs2, _init_readOnlyProperty2;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
class TestElement extends XElement {
  static {
    [_init_readOnlyProperty, _get_readOnlyProperty, _set_readOnlyProperty, _init_readOnlyProperty2, _initProto] = _applyDecs(this, [[_readOnlyPropertyDecs, 1, "readOnlyProperty", o => o.#A, (o, v) => o.#A = v], [_readOnlyPropertyDecs2, 1, "readOnlyProperty"]], [], 0, _ => #readOnlyProperty in _, XElement).e;
  }
  #A = (_initProto(this), _init_readOnlyProperty(this));
  set #readOnlyProperty(v) {
    _set_readOnlyProperty(this, v);
  }
  get #readOnlyProperty() {
    return _get_readOnlyProperty(this);
  }
  #B = _init_readOnlyProperty2(this);
  get [(_readOnlyPropertyDecs = property({
    type: String,
    initial: 'Dromedary'
  }), _readOnlyPropertyDecs2 = property({
    type: String,
    input: ['#readOnlyProperty'],
    compute: readOnlyProperty => readOnlyProperty
  }), "readOnlyProperty")]() {
    return this.#B;
  }
  set readOnlyProperty(v) {
    this.#B = v;
  }
  static template(host) {
    return html`<div>${host.readOnlyProperty}</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.#readOnlyProperty = 'Ferus';
  }
}
customElements.define('test-element-next', TestElement);
it('initialization', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.textContent === 'Dromedary', 'initialized correctly');
  assert(el.readOnlyProperty === 'Ferus', 'correct value after connection');
});
it('re-render in connectedCallback works', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.readOnlyProperty === 'Ferus', 'correct value after connection');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.textContent === 'Ferus', 'correct value after re-render');
});
it('cannot be written to', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.readOnlyProperty = `don't do it`;
  } catch (error) {
    const expected = 'Property "TestElement.prototype.readOnlyProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test el.internal proxy restrictions,
//  but decorator API uses private fields for the backing store.
it.skip('cannot be read from "internal"', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.readOnlyProperty;
  } catch (error) {
    const expected = 'Property "TestElement.properties.readOnlyProperty" is publicly available (use normal getter).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('cannot set to known properties', () => {
  let _initProto2, _readOnlyPropertyDecs3, _init_readOnlyProperty3, _get_readOnlyProperty2, _set_readOnlyProperty2, _readOnlyPropertyDecs4, _init_readOnlyProperty4;
  class BadTestElement extends XElement {
    static {
      [_init_readOnlyProperty3, _get_readOnlyProperty2, _set_readOnlyProperty2, _init_readOnlyProperty4, _initProto2] = _applyDecs(this, [[_readOnlyPropertyDecs3, 1, "readOnlyProperty", o => o.#A, (o, v) => o.#A = v], [_readOnlyPropertyDecs4, 1, "readOnlyProperty"]], [], 0, _ => #readOnlyProperty in _, XElement).e;
    }
    #A = (_initProto2(this), _init_readOnlyProperty3(this));
    set #readOnlyProperty(v) {
      _set_readOnlyProperty2(this, v);
    }
    get #readOnlyProperty() {
      return _get_readOnlyProperty2(this);
    }
    #B = _init_readOnlyProperty4(this);
    get [(_readOnlyPropertyDecs3 = property({
      type: String
    }), _readOnlyPropertyDecs4 = property({
      type: String,
      input: ['#readOnlyProperty'],
      compute: readOnlyProperty => readOnlyProperty
    }), "readOnlyProperty")]() {
      return this.#B;
    }
    set readOnlyProperty(v) {
      this.#B = v;
    }
    static template(host) {
      host.readOnlyProperty = 'Dromedary';
      return html`<div>${host.readOnlyProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.prototype.readOnlyProperty" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9yZWFkT25seVByb3BlcnR5IiwiX2dldF9yZWFkT25seVByb3BlcnR5IiwiX3NldF9yZWFkT25seVByb3BlcnR5IiwiX2luaXRfcmVhZE9ubHlQcm9wZXJ0eTIiLCJfaW5pdFByb3RvIiwiX2FwcGx5RGVjcyIsIl9yZWFkT25seVByb3BlcnR5RGVjcyIsIm8iLCJBIiwidiIsIl9yZWFkT25seVByb3BlcnR5RGVjczIiLCJfIiwicmVhZE9ubHlQcm9wZXJ0eSIsImUiLCIjcmVhZE9ubHlQcm9wZXJ0eSIsIkIiLCJ0eXBlIiwiU3RyaW5nIiwiaW5pdGlhbCIsImlucHV0IiwiY29tcHV0ZSIsInRlbXBsYXRlIiwiaG9zdCIsImNvbm5lY3RlZENhbGxiYWNrIiwiY3VzdG9tRWxlbWVudHMiLCJkZWZpbmUiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJvZHkiLCJhcHBlbmQiLCJzaGFkb3dSb290IiwidGV4dENvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInBhc3NlZCIsIm1lc3NhZ2UiLCJlcnJvciIsImV4cGVjdGVkIiwic2tpcCIsImludGVybmFsIiwiX2luaXRQcm90bzIiLCJfcmVhZE9ubHlQcm9wZXJ0eURlY3MzIiwiX2luaXRfcmVhZE9ubHlQcm9wZXJ0eTMiLCJfZ2V0X3JlYWRPbmx5UHJvcGVydHkyIiwiX3NldF9yZWFkT25seVByb3BlcnR5MiIsIl9yZWFkT25seVByb3BlcnR5RGVjczQiLCJfaW5pdF9yZWFkT25seVByb3BlcnR5NCIsIkJhZFRlc3RFbGVtZW50Il0sInNvdXJjZXMiOlsidGVzdC1yZWFkLW9ubHktcHJvcGVydGllcy5zcmMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0LCBpdCB9IGZyb20gJ0BuZXRmbGl4L3gtdGVzdC94LXRlc3QuanMnO1xuaW1wb3J0IHsgWEVsZW1lbnQsIHByb3BlcnR5LCBodG1sIH0gZnJvbSAnLi4veC1lbGVtZW50LW5leHQuanMnO1xuXG5jbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAnRHJvbWVkYXJ5JyB9KVxuICBhY2Nlc3NvciAjcmVhZE9ubHlQcm9wZXJ0eTtcblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbnB1dDogWycjcmVhZE9ubHlQcm9wZXJ0eSddLFxuICAgIGNvbXB1dGU6IChyZWFkT25seVByb3BlcnR5KSA9PiByZWFkT25seVByb3BlcnR5LFxuICB9KVxuICBhY2Nlc3NvciByZWFkT25seVByb3BlcnR5O1xuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3QucmVhZE9ubHlQcm9wZXJ0eX08L2Rpdj5gO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICB0aGlzLiNyZWFkT25seVByb3BlcnR5ID0gJ0ZlcnVzJztcbiAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtbmV4dCcsIFRlc3RFbGVtZW50KTtcblxuaXQoJ2luaXRpYWxpemF0aW9uJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdEcm9tZWRhcnknLCAnaW5pdGlhbGl6ZWQgY29ycmVjdGx5Jyk7XG4gIGFzc2VydChlbC5yZWFkT25seVByb3BlcnR5ID09PSAnRmVydXMnLCAnY29ycmVjdCB2YWx1ZSBhZnRlciBjb25uZWN0aW9uJyk7XG59KTtcblxuaXQoJ3JlLXJlbmRlciBpbiBjb25uZWN0ZWRDYWxsYmFjayB3b3JrcycsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5yZWFkT25seVByb3BlcnR5ID09PSAnRmVydXMnLCAnY29ycmVjdCB2YWx1ZSBhZnRlciBjb25uZWN0aW9uJyk7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICdGZXJ1cycsICdjb3JyZWN0IHZhbHVlIGFmdGVyIHJlLXJlbmRlcicpO1xufSk7XG5cbml0KCdjYW5ub3QgYmUgd3JpdHRlbiB0bycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwucmVhZE9ubHlQcm9wZXJ0eSA9IGBkb24ndCBkbyBpdGA7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnUHJvcGVydHkgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUucmVhZE9ubHlQcm9wZXJ0eVwiIGlzIGNvbXB1dGVkIChjb21wdXRlZCBwcm9wZXJ0aWVzIGFyZSByZWFkLW9ubHkpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBlbC5pbnRlcm5hbCBwcm94eSByZXN0cmljdGlvbnMsXG4vLyAgYnV0IGRlY29yYXRvciBBUEkgdXNlcyBwcml2YXRlIGZpZWxkcyBmb3IgdGhlIGJhY2tpbmcgc3RvcmUuXG5pdC5za2lwKCdjYW5ub3QgYmUgcmVhZCBmcm9tIFwiaW50ZXJuYWxcIicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuaW50ZXJuYWwucmVhZE9ubHlQcm9wZXJ0eTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIlRlc3RFbGVtZW50LnByb3BlcnRpZXMucmVhZE9ubHlQcm9wZXJ0eVwiIGlzIHB1YmxpY2x5IGF2YWlsYWJsZSAodXNlIG5vcm1hbCBnZXR0ZXIpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2Nhbm5vdCBzZXQgdG8ga25vd24gcHJvcGVydGllcycsICgpID0+IHtcbiAgY2xhc3MgQmFkVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nIH0pXG4gICAgYWNjZXNzb3IgI3JlYWRPbmx5UHJvcGVydHk7XG5cbiAgICBAcHJvcGVydHkoe1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgaW5wdXQ6IFsnI3JlYWRPbmx5UHJvcGVydHknXSxcbiAgICAgIGNvbXB1dGU6IChyZWFkT25seVByb3BlcnR5KSA9PiByZWFkT25seVByb3BlcnR5LFxuICAgIH0pXG4gICAgYWNjZXNzb3IgcmVhZE9ubHlQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBob3N0LnJlYWRPbmx5UHJvcGVydHkgPSAnRHJvbWVkYXJ5JztcbiAgICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0LnJlYWRPbmx5UHJvcGVydHl9PC9kaXY+YDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdiYWQtdGVzdC1lbGVtZW50LW5leHQtMScsIEJhZFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgQmFkVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1Byb3BlcnR5IFwiQmFkVGVzdEVsZW1lbnQucHJvdG90eXBlLnJlYWRPbmx5UHJvcGVydHlcIiBpcyBjb21wdXRlZCAoY29tcHV0ZWQgcHJvcGVydGllcyBhcmUgcmVhZC1vbmx5KS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFNBQVNBLE1BQU0sRUFBRUMsRUFBRSxRQUFRLDJCQUEyQjtBQUN0RCxTQUFTQyxRQUFRLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxRQUFRLHNCQUFzQjtBQUUvRCxNQUFNQyxXQUFXLFNBQVNILFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQUksc0JBQUEsRUFBQUMscUJBQUEsRUFBQUMscUJBQUEsRUFBQUMsdUJBQUEsRUFBQUMsVUFBQSxJQUFBQyxVQUFBLFNBQUFDLHFCQUFB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