function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
it('errors are thrown in connectedCallback for initializing values with bad types', () => {
  let _initProto, _stringDecs, _init_string;
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static {
      [_init_string, _initProto] = _applyDecs(this, [[_stringDecs, 1, "string"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto(this), _init_string(this));
    get [(_stringDecs = property({
      type: String
    }), "string")]() {
      return this.#A;
    }
    set string(v) {
      this.#A = v;
    }
  }
  customElements.define('test-element-init-type', TestElement);
  const el = new TestElement();
  el.string = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.string" (expected String, got Number).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  Users should use accessor-only decorators (no setter) or private fields
//  to achieve read-only behavior. Skip this test as readOnly is not supported.
it.skip('errors are thrown in connectedCallback for initializing read-only properties', () => {
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static get properties() {
      return {
        readOnlyProperty: {
          type: String,
          readOnly: true
        }
      };
    }
  }
  customElements.define('test-element-1', TestElement);
  const el = new TestElement();
  el.readOnlyProperty = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "TestElement.prototype.readOnlyProperty" is read-only.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('errors are thrown in connectedCallback for initializing computed properties', () => {
  let _initProto2, _computedDecs, _init_computed;
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static {
      [_init_computed, _initProto2] = _applyDecs(this, [[_computedDecs, 1, "computed"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto2(this), _init_computed(this));
    get [(_computedDecs = property({
      type: String,
      input: [],
      compute: () => {}
    }), "computed")]() {
      return this.#A;
    }
    set computed(v) {
      this.#A = v;
    }
  }
  customElements.define('test-element-init-computed', TestElement);
  const el = new TestElement();
  el.computed = 5;
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "TestElement.prototype.computed" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// Depending on the browser — the underlying error is surfaced differently.
// We just match our custom suffix to be agnostic.
it('errors are thrown in connectedCallback when template result fails to render', () => {
  let _initProto3, _stringsDecs, _init_strings;
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static {
      [_init_strings, _initProto3] = _applyDecs(this, [[_stringsDecs, 1, "strings"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto3(this), _init_strings(this));
    get [(_stringsDecs = property({
      default: () => ['one', 'two', 'three']
    }), "strings")]() {
      return this.#A;
    }
    set strings(v) {
      this.#A = v;
    }
    static template(host) {
      // In this case, the array will fail if items are not template results.
      return html`<div>${host.strings}</div>`;
    }
  }
  customElements.define('test-element-render-fail', TestElement);
  const el = new TestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid template for "TestElement" / <test-element-render-fail> at path "test-element-render-fail".';
    message = error.message;
    passed = error.message.endsWith(expected);
  }
  assert(passed, message);
});

// Depending on the browser — the underlying error is surfaced differently.
// We just match our custom suffix to be agnostic.
it('errors are thrown in connectedCallback when template result fails to render (with ids, classes, and attributes)', () => {
  let _initProto4, _stringsDecs2, _init_strings2;
  // We cannot try-catch append, so we fake the connectedCallback.
  class TestElement extends XElement {
    static {
      [_init_strings2, _initProto4] = _applyDecs(this, [[_stringsDecs2, 1, "strings"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto4(this), _init_strings2(this));
    get [(_stringsDecs2 = property({
      default: () => ['one', 'two', 'three']
    }), "strings")]() {
      return this.#A;
    }
    set strings(v) {
      this.#A = v;
    }
    static template(host) {
      // In this case, the array will fail if items are not template results.
      return html`<div>${host.strings}</div>`;
    }
  }
  customElements.define('test-element-render-fail-details', TestElement);
  const el = new TestElement();
  let passed = false;
  let message = 'no error was thrown';
  el.id = 'testing';
  el.classList.add('foo');
  el.classList.add('bar');
  el.setAttribute('boolean', '');
  el.setAttribute('variation', 'primary');
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid template for "TestElement" / <test-element-render-fail-details> at path "test-element-render-fail-details[id="testing"][class="foo bar"][boolean][variation="primary"]".';
    message = error.message;
    passed = error.message.endsWith(expected);
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiX2luaXRQcm90byIsIl9zdHJpbmdEZWNzIiwiX2luaXRfc3RyaW5nIiwiVGVzdEVsZW1lbnQiLCJfYXBwbHlEZWNzIiwiZSIsIkEiLCJ0eXBlIiwiU3RyaW5nIiwic3RyaW5nIiwidiIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiZWwiLCJwYXNzZWQiLCJtZXNzYWdlIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJlcnJvciIsImV4cGVjdGVkIiwic2tpcCIsInByb3BlcnRpZXMiLCJyZWFkT25seVByb3BlcnR5IiwicmVhZE9ubHkiLCJfaW5pdFByb3RvMiIsIl9jb21wdXRlZERlY3MiLCJfaW5pdF9jb21wdXRlZCIsImlucHV0IiwiY29tcHV0ZSIsImNvbXB1dGVkIiwiX2luaXRQcm90bzMiLCJfc3RyaW5nc0RlY3MiLCJfaW5pdF9zdHJpbmdzIiwiZGVmYXVsdCIsInN0cmluZ3MiLCJ0ZW1wbGF0ZSIsImhvc3QiLCJlbmRzV2l0aCIsIl9pbml0UHJvdG80IiwiX3N0cmluZ3NEZWNzMiIsIl9pbml0X3N0cmluZ3MyIiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiXSwic291cmNlcyI6WyJ0ZXN0LWluaXRpYWxpemF0aW9uLWVycm9ycy5zcmMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0LCBpdCB9IGZyb20gJ0BuZXRmbGl4L3gtdGVzdC94LXRlc3QuanMnO1xuaW1wb3J0IHsgWEVsZW1lbnQsIHByb3BlcnR5LCBodG1sIH0gZnJvbSAnLi4veC1lbGVtZW50LW5leHQuanMnO1xuXG5pdCgnZXJyb3JzIGFyZSB0aHJvd24gaW4gY29ubmVjdGVkQ2FsbGJhY2sgZm9yIGluaXRpYWxpemluZyB2YWx1ZXMgd2l0aCBiYWQgdHlwZXMnLCAoKSA9PiB7XG4gIC8vIFdlIGNhbm5vdCB0cnktY2F0Y2ggYXBwZW5kLCBzbyB3ZSBmYWtlIHRoZSBjb25uZWN0ZWRDYWxsYmFjay5cbiAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nIH0pXG4gICAgYWNjZXNzb3Igc3RyaW5nO1xuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWluaXQtdHlwZScsIFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgVGVzdEVsZW1lbnQoKTtcbiAgZWwuc3RyaW5nID0gNTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1VuZXhwZWN0ZWQgdmFsdWUgZm9yIFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLnN0cmluZ1wiIChleHBlY3RlZCBTdHJpbmcsIGdvdCBOdW1iZXIpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogVGhlIHJlYWRPbmx5IGNvbmZpZ3VyYXRpb24gZG9lc24ndCBleGlzdCBpbiB0aGUgZGVjb3JhdG9yIEFQSS5cbi8vICBVc2VycyBzaG91bGQgdXNlIGFjY2Vzc29yLW9ubHkgZGVjb3JhdG9ycyAobm8gc2V0dGVyKSBvciBwcml2YXRlIGZpZWxkc1xuLy8gIHRvIGFjaGlldmUgcmVhZC1vbmx5IGJlaGF2aW9yLiBTa2lwIHRoaXMgdGVzdCBhcyByZWFkT25seSBpcyBub3Qgc3VwcG9ydGVkLlxuaXQuc2tpcCgnZXJyb3JzIGFyZSB0aHJvd24gaW4gY29ubmVjdGVkQ2FsbGJhY2sgZm9yIGluaXRpYWxpemluZyByZWFkLW9ubHkgcHJvcGVydGllcycsICgpID0+IHtcbiAgLy8gV2UgY2Fubm90IHRyeS1jYXRjaCBhcHBlbmQsIHNvIHdlIGZha2UgdGhlIGNvbm5lY3RlZENhbGxiYWNrLlxuICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWFkT25seVByb3BlcnR5OiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgIHJlYWRPbmx5OiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtMScsIFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgVGVzdEVsZW1lbnQoKTtcbiAgZWwucmVhZE9ubHlQcm9wZXJ0eSA9IDU7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5yZWFkT25seVByb3BlcnR5XCIgaXMgcmVhZC1vbmx5Lic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2Vycm9ycyBhcmUgdGhyb3duIGluIGNvbm5lY3RlZENhbGxiYWNrIGZvciBpbml0aWFsaXppbmcgY29tcHV0ZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgLy8gV2UgY2Fubm90IHRyeS1jYXRjaCBhcHBlbmQsIHNvIHdlIGZha2UgdGhlIGNvbm5lY3RlZENhbGxiYWNrLlxuICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoe1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgaW5wdXQ6IFtdLFxuICAgICAgY29tcHV0ZTogKCkgPT4ge30sXG4gICAgfSlcbiAgICBhY2Nlc3NvciBjb21wdXRlZDtcbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1pbml0LWNvbXB1dGVkJywgVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBUZXN0RWxlbWVudCgpO1xuICBlbC5jb21wdXRlZCA9IDU7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5jb21wdXRlZFwiIGlzIGNvbXB1dGVkIChjb21wdXRlZCBwcm9wZXJ0aWVzIGFyZSByZWFkLW9ubHkpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gRGVwZW5kaW5nIG9uIHRoZSBicm93c2VyIOKAlCB0aGUgdW5kZXJseWluZyBlcnJvciBpcyBzdXJmYWNlZCBkaWZmZXJlbnRseS5cbi8vIFdlIGp1c3QgbWF0Y2ggb3VyIGN1c3RvbSBzdWZmaXggdG8gYmUgYWdub3N0aWMuXG5pdCgnZXJyb3JzIGFyZSB0aHJvd24gaW4gY29ubmVjdGVkQ2FsbGJhY2sgd2hlbiB0ZW1wbGF0ZSByZXN1bHQgZmFpbHMgdG8gcmVuZGVyJywgKCkgPT4ge1xuICAvLyBXZSBjYW5ub3QgdHJ5LWNhdGNoIGFwcGVuZCwgc28gd2UgZmFrZSB0aGUgY29ubmVjdGVkQ2FsbGJhY2suXG4gIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IGRlZmF1bHQ6ICgpID0+IFsnb25lJywgJ3R3bycsICd0aHJlZSddIH0pXG4gICAgYWNjZXNzb3Igc3RyaW5ncztcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICAvLyBJbiB0aGlzIGNhc2UsIHRoZSBhcnJheSB3aWxsIGZhaWwgaWYgaXRlbXMgYXJlIG5vdCB0ZW1wbGF0ZSByZXN1bHRzLlxuICAgICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3Quc3RyaW5nc308L2Rpdj5gO1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1yZW5kZXItZmFpbCcsIFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ0ludmFsaWQgdGVtcGxhdGUgZm9yIFwiVGVzdEVsZW1lbnRcIiAvIDx0ZXN0LWVsZW1lbnQtcmVuZGVyLWZhaWw+IGF0IHBhdGggXCJ0ZXN0LWVsZW1lbnQtcmVuZGVyLWZhaWxcIi4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UuZW5kc1dpdGgoZXhwZWN0ZWQpO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIERlcGVuZGluZyBvbiB0aGUgYnJvd3NlciDigJQgdGhlIHVuZGVybHlpbmcgZXJyb3IgaXMgc3VyZmFjZWQgZGlmZmVyZW50bHkuXG4vLyBXZSBqdXN0IG1hdGNoIG91ciBjdXN0b20gc3VmZml4IHRvIGJlIGFnbm9zdGljLlxuaXQoJ2Vycm9ycyBhcmUgdGhyb3duIGluIGNvbm5lY3RlZENhbGxiYWNrIHdoZW4gdGVtcGxhdGUgcmVzdWx0IGZhaWxzIHRvIHJlbmRlciAod2l0aCBpZHMsIGNsYXNzZXMsIGFuZCBhdHRyaWJ1dGVzKScsICgpID0+IHtcbiAgLy8gV2UgY2Fubm90IHRyeS1jYXRjaCBhcHBlbmQsIHNvIHdlIGZha2UgdGhlIGNvbm5lY3RlZENhbGxiYWNrLlxuICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyBkZWZhdWx0OiAoKSA9PiBbJ29uZScsICd0d28nLCAndGhyZWUnXSB9KVxuICAgIGFjY2Vzc29yIHN0cmluZ3M7XG5cbiAgICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgICAgLy8gSW4gdGhpcyBjYXNlLCB0aGUgYXJyYXkgd2lsbCBmYWlsIGlmIGl0ZW1zIGFyZSBub3QgdGVtcGxhdGUgcmVzdWx0cy5cbiAgICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0LnN0cmluZ3N9PC9kaXY+YDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtcmVuZGVyLWZhaWwtZGV0YWlscycsIFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgZWwuaWQgPSAndGVzdGluZyc7XG4gIGVsLmNsYXNzTGlzdC5hZGQoJ2ZvbycpO1xuICBlbC5jbGFzc0xpc3QuYWRkKCdiYXInKTtcbiAgZWwuc2V0QXR0cmlidXRlKCdib29sZWFuJywgJycpO1xuICBlbC5zZXRBdHRyaWJ1dGUoJ3ZhcmlhdGlvbicsICdwcmltYXJ5Jyk7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdJbnZhbGlkIHRlbXBsYXRlIGZvciBcIlRlc3RFbGVtZW50XCIgLyA8dGVzdC1lbGVtZW50LXJlbmRlci1mYWlsLWRldGFpbHM+IGF0IHBhdGggXCJ0ZXN0LWVsZW1lbnQtcmVuZGVyLWZhaWwtZGV0YWlsc1tpZD1cInRlc3RpbmdcIl1bY2xhc3M9XCJmb28gYmFyXCJdW2Jvb2xlYW5dW3ZhcmlhdGlvbj1cInByaW1hcnlcIl1cIi4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UuZW5kc1dpdGgoZXhwZWN0ZWQpO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsU0FBU0EsTUFBTSxFQUFFQyxFQUFFLFFBQVEsMkJBQTJCO0FBQ3RELFNBQVNDLFFBQVEsRUFBRUMsUUFBUSxFQUFFQyxJQUFJLFFBQVEsc0JBQXNCO0FBRS9ESCxFQUFFLENBQUMsK0VBQStFLEVBQUUsTUFBTTtFQUFBLElBQUFJLFVBQUEsRUFBQUMsV0FBQSxFQUFBQyxZQUFBO0VBQ3hGO0VBQ0EsTUFBTUMsV0FBVyxTQUFTTixRQUFRLENBQUM7SUFBQTtNQUFBLENBQUFLLFlBQUEsRUFBQUYsVUFBQSxJQUFBSSxVQUFBLFNBQUFILFdBQUEsZ0NBQVRKLFFBQVEsRUFBQVEsQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBTixVQUFBLFFBQUFFLFlBQUE7SUFBQSxNQUFBRCxXQUFBLEdBQy9CSCxRQUFRLENBQUM7TUFBRVMsSUFBSSxFQUFFQztJQUFPLENBQUMsQ0FBQztNQUFBLGFBQUFGLENBQUE7SUFBQTtJQUFBLElBQ2xCRyxNQUFNQSxDQUFBQyxDQUFBO01BQUEsTUFBQUosQ0FBQSxHQUFBSSxDQUFBO0lBQUE7RUFDakI7RUFDQUMsY0FBYyxDQUFDQyxNQUFNLENBQUMsd0JBQXdCLEVBQUVULFdBQVcsQ0FBQztFQUM1RCxNQUFNVSxFQUFFLEdBQUcsSUFBSVYsV0FBVyxDQUFDLENBQUM7RUFDNUJVLEVBQUUs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