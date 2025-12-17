function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property } from '../x-element-next.js';

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  Users should use accessor-only decorators (no setter) or private fields
//  to achieve read-only behavior. Skip this test as readOnly is not supported.
it.skip('errors are thrown in attributeChangedCallback for read-only properties', () => {
  // We cannot try-catch setAttribute, so we fake the attributeChangedCallback.
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
  customElements.define('test-element-2', TestElement);
  const el = new TestElement();
  let passed = false;
  let message = 'no error was thrown';
  el.connectedCallback();
  try {
    el.attributeChangedCallback('read-only-property', null, 'nope');
  } catch (error) {
    const expected = 'Property "TestElement.prototype.readOnlyProperty" is read-only.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('errors are thrown in attributeChangedCallback for computed properties', () => {
  let _initProto, _computedDecs, _init_computed;
  // We cannot try-catch setAttribute, so we fake the attributeChangedCallback.
  class TestElement extends XElement {
    static {
      [_init_computed, _initProto] = _applyDecs(this, [[_computedDecs, 1, "computed"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto(this), _init_computed(this));
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
  customElements.define('test-element-attr-computed', TestElement);
  const el = new TestElement();
  el.connectedCallback();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.attributeChangedCallback('computed', null, 'nope');
  } catch (error) {
    const expected = 'Property "TestElement.prototype.computed" is computed (computed properties are read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJza2lwIiwiVGVzdEVsZW1lbnQiLCJwcm9wZXJ0aWVzIiwicmVhZE9ubHlQcm9wZXJ0eSIsInR5cGUiLCJTdHJpbmciLCJyZWFkT25seSIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiZWwiLCJwYXNzZWQiLCJtZXNzYWdlIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJlcnJvciIsImV4cGVjdGVkIiwiX2luaXRQcm90byIsIl9jb21wdXRlZERlY3MiLCJfaW5pdF9jb21wdXRlZCIsIl9hcHBseURlY3MiLCJlIiwiQSIsImlucHV0IiwiY29tcHV0ZSIsImNvbXB1dGVkIiwidiJdLCJzb3VyY2VzIjpbInRlc3QtYXR0cmlidXRlLWNoYW5nZWQtZXJyb3JzLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHkgfSBmcm9tICcuLi94LWVsZW1lbnQtbmV4dC5qcyc7XG5cbi8vIFRPRE86ICMzNDY6IFRoZSByZWFkT25seSBjb25maWd1cmF0aW9uIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGRlY29yYXRvciBBUEkuXG4vLyAgVXNlcnMgc2hvdWxkIHVzZSBhY2Nlc3Nvci1vbmx5IGRlY29yYXRvcnMgKG5vIHNldHRlcikgb3IgcHJpdmF0ZSBmaWVsZHNcbi8vICB0byBhY2hpZXZlIHJlYWQtb25seSBiZWhhdmlvci4gU2tpcCB0aGlzIHRlc3QgYXMgcmVhZE9ubHkgaXMgbm90IHN1cHBvcnRlZC5cbml0LnNraXAoJ2Vycm9ycyBhcmUgdGhyb3duIGluIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayBmb3IgcmVhZC1vbmx5IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIC8vIFdlIGNhbm5vdCB0cnktY2F0Y2ggc2V0QXR0cmlidXRlLCBzbyB3ZSBmYWtlIHRoZSBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suXG4gIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlYWRPbmx5UHJvcGVydHk6IHtcbiAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC0yJywgVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBUZXN0RWxlbWVudCgpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB0cnkge1xuICAgIGVsLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaygncmVhZC1vbmx5LXByb3BlcnR5JywgbnVsbCwgJ25vcGUnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5yZWFkT25seVByb3BlcnR5XCIgaXMgcmVhZC1vbmx5Lic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2Vycm9ycyBhcmUgdGhyb3duIGluIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayBmb3IgY29tcHV0ZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgLy8gV2UgY2Fubm90IHRyeS1jYXRjaCBzZXRBdHRyaWJ1dGUsIHNvIHdlIGZha2UgdGhlIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjay5cbiAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgQHByb3BlcnR5KHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGlucHV0OiBbXSxcbiAgICAgIGNvbXB1dGU6ICgpID0+IHt9LFxuICAgIH0pXG4gICAgYWNjZXNzb3IgY29tcHV0ZWQ7XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtYXR0ci1jb21wdXRlZCcsIFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgVGVzdEVsZW1lbnQoKTtcbiAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soJ2NvbXB1dGVkJywgbnVsbCwgJ25vcGUnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5jb21wdXRlZFwiIGlzIGNvbXB1dGVkIChjb21wdXRlZCBwcm9wZXJ0aWVzIGFyZSByZWFkLW9ubHkpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxTQUFTQSxNQUFNLEVBQUVDLEVBQUUsUUFBUSwyQkFBMkI7QUFDdEQsU0FBU0MsUUFBUSxFQUFFQyxRQUFRLFFBQVEsc0JBQXNCOztBQUV6RDtBQUNBO0FBQ0E7QUFDQUYsRUFBRSxDQUFDRyxJQUFJLENBQUMsd0VBQXdFLEVBQUUsTUFBTTtFQUN0RjtFQUNBLE1BQU1DLFdBQVcsU0FBU0gsUUFBUSxDQUFDO0lBQ2pDLFdBQVdJLFVBQVVBLENBQUEsRUFBRztNQUN0QixPQUFPO1FBQ0xDLGdCQUFnQixFQUFFO1VBQ2hCQyxJQUFJLEVBQUVDLE1BQU07VUFDWkMsUUFBUSxFQUFFO1FBQ1o7TUFDRixDQUFDO0lBQ0g7RUFDRjtFQUNBQyxjQUFjLENBQUNDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRVAsV0FBVyxDQUFDO0VBQ3BELE1BQU1RLEVBQUUsR0FBRyxJQUFJUixXQUFXLENBQUMsQ0FBQztFQUM1QixJQUFJUyxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DRixFQUFFLENBQUNHLGlCQUFpQixDQUFDLENBQUM7RUFDdEIsSUFBSTtJQUNGSCxFQUFFLENBQUNJLHdCQUF3QixDQUFDLG9CQUFvQixFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7RUFDakUsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1DLFFBQVEsR0FBRyxpRUFBaUU7SUFDbEZKLE9BQU8sR0FBR0csS0FBSyxDQUFDSCxPQUFPO0lBQ3ZCRCxNQUFNLEdBQUdJLEtBQUssQ0FBQ0gsT0FBTyxLQUFLSSxRQUFRO0VBQ3JDO0VBQ0FuQixNQUFNLENBQUNjLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGZCxFQUFFLENBQUMsdUVBQXVFLEVBQUUsTUFBTTtFQUFBLElBQUFtQixVQUFBLEVBQUFDLGFBQUEsRUFBQUMsY0FBQTtFQUNoRjtFQUNBLE1BQU1qQixXQUFXLFNBQVNILFFBQVEsQ0FBQztJQUFBO01BQUEsQ0FBQW9CLGNBQUEsRUFBQUYsVUFBQSxJQUFBRyxVQUFBLFNBQUFGLGFBQUEsa0NBQVRuQixRQUFRLEVBQUFzQixDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUFMLFVBQUEsUUFBQUUsY0FBQTtJQUFBLE1BQUFELGFBQUEsR0FDL0JsQixRQUFRLENBQUM7TUFDUkssSUFBSSxFQUFFQyxNQUFNO01BQ1ppQixLQUFLLEVBQUUsRUFBRTtNQUNUQyxPQUFPLEVBQUVBLENBQUEsS0FBTSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztNQUFBLGFBQUFGLENBQUE7SUFBQTtJQUFBLElBQ09HLFFBQVFBLENBQUFDLENBQUE7TUFBQSxNQUFBSixDQUFBLEdBQUFJLENBQUE7SUFBQTtFQUNuQjtFQUNBbEIsY0FBYyxDQUFDQyxNQUFNLENBQUMsNEJBQTRCLEVBQUVQLFdBQVcsQ0FBQztFQUNoRSxNQUFNUSxFQUFFLEdBQUcsSUFBSVIsV0FBVyxDQUFDLENBQUM7RUFDNUJRLEVBQUUsQ0FBQ0csaUJBQWlCLENBQUMsQ0FBQztFQUN0QixJQUFJRixNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRkYsRUFBRSxDQUFDSSx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQztFQUN2RCxDQUFDLENBQUMsT0FBT0MsS0FBSyxFQUFFO0lBQ2QsTUFBTUMsUUFBUSxHQUFHLDRGQUE0RjtJQUM3R0osT0FBTyxHQUFHRyxLQUFLLENBQUNILE9BQU87SUFDdkJELE1BQU0sR0FBR0ksS0FBSyxDQUFDSCxPQUFPLEtBQUtJLFFBQVE7RUFDckM7RUFDQW5CLE1BQU0sQ0FBQ2MsTUFBTSxFQUFFQyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDIiwiaWdub3JlTGlzdCI6W119