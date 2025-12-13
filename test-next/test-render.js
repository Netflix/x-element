let _initProto, _propertyDecs, _init_property;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

// TODO: #346: Render behavior is not decorator-specific. Updated to use
//  decorator syntax for properties but the render tests remain the same.
class TestElement extends XElement {
  static {
    [_init_property, _initProto] = _applyDecs(this, [[_propertyDecs, 1, "property"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto(this), _init_property(this));
  get [(_propertyDecs = property({
    initial: 'initial'
  }), "property")]() {
    return this.#A;
  }
  set property(v) {
    this.#A = v;
  }
  static template(host) {
    host.setAttribute('host-available', '');
    return html`<div>${host.property}</div>`;
  }
  constructor() {
    super();
    this.count = 0;
  }
  render() {
    this.count++;
    if (this.count > 1) {
      super.render();
    }
  }
}
customElements.define('test-element-render', TestElement);
it('test super.render can be ignored', async () => {
  const el = document.createElement('test-element-render');
  document.body.append(el);
  assert(el.count === 1);
  assert(el.property === 'initial');
  assert(el.shadowRoot.textContent === '');
  el.property = 'next';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.count === 2);
  assert(el.property === 'next');
  assert(el.shadowRoot.textContent === 'next');
});
it('test host is available', async () => {
  const el = document.createElement('test-element-render');
  // Get around our render guard — we're not testing that here.
  el.count = 2;
  assert(el.hasAttribute('host-available') === false);
  document.body.append(el);
  assert(el.hasAttribute('host-available') === true);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9wcm9wZXJ0eSIsIl9pbml0UHJvdG8iLCJfYXBwbHlEZWNzIiwiX3Byb3BlcnR5RGVjcyIsImUiLCJBIiwiaW5pdGlhbCIsInYiLCJ0ZW1wbGF0ZSIsImhvc3QiLCJzZXRBdHRyaWJ1dGUiLCJjb25zdHJ1Y3RvciIsImNvdW50IiwicmVuZGVyIiwiY3VzdG9tRWxlbWVudHMiLCJkZWZpbmUiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJvZHkiLCJhcHBlbmQiLCJzaGFkb3dSb290IiwidGV4dENvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImhhc0F0dHJpYnV0ZSJdLCJzb3VyY2VzIjpbInRlc3QtcmVuZGVyLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHksIGh0bWwgfSBmcm9tICcuLi94LWVsZW1lbnQtbmV4dC5qcyc7XG5cbi8vIFRPRE86ICMzNDY6IFJlbmRlciBiZWhhdmlvciBpcyBub3QgZGVjb3JhdG9yLXNwZWNpZmljLiBVcGRhdGVkIHRvIHVzZVxuLy8gIGRlY29yYXRvciBzeW50YXggZm9yIHByb3BlcnRpZXMgYnV0IHRoZSByZW5kZXIgdGVzdHMgcmVtYWluIHRoZSBzYW1lLlxuY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gIEBwcm9wZXJ0eSh7IGluaXRpYWw6ICdpbml0aWFsJyB9KVxuICBhY2Nlc3NvciBwcm9wZXJ0eTtcblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIGhvc3Quc2V0QXR0cmlidXRlKCdob3N0LWF2YWlsYWJsZScsICcnKTtcbiAgICByZXR1cm4gaHRtbGA8ZGl2PiR7aG9zdC5wcm9wZXJ0eX08L2Rpdj5gO1xuICB9XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuY291bnQrKztcbiAgICBpZiAodGhpcy5jb3VudCA+IDEpIHtcbiAgICAgIHN1cGVyLnJlbmRlcigpO1xuICAgIH1cbiAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtcmVuZGVyJywgVGVzdEVsZW1lbnQpO1xuXG5pdCgndGVzdCBzdXBlci5yZW5kZXIgY2FuIGJlIGlnbm9yZWQnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LXJlbmRlcicpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5jb3VudCA9PT0gMSk7XG4gIGFzc2VydChlbC5wcm9wZXJ0eSA9PT0gJ2luaXRpYWwnKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QudGV4dENvbnRlbnQgPT09ICcnKTtcbiAgZWwucHJvcGVydHkgPSAnbmV4dCc7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLmNvdW50ID09PSAyKTtcbiAgYXNzZXJ0KGVsLnByb3BlcnR5ID09PSAnbmV4dCcpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ25leHQnKTtcbn0pO1xuXG5pdCgndGVzdCBob3N0IGlzIGF2YWlsYWJsZScsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtcmVuZGVyJyk7XG4gIC8vIEdldCBhcm91bmQgb3VyIHJlbmRlciBndWFyZCDigJQgd2UncmUgbm90IHRlc3RpbmcgdGhhdCBoZXJlLlxuICBlbC5jb3VudCA9IDI7XG4gIGFzc2VydChlbC5oYXNBdHRyaWJ1dGUoJ2hvc3QtYXZhaWxhYmxlJykgPT09IGZhbHNlKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuaGFzQXR0cmlidXRlKCdob3N0LWF2YWlsYWJsZScpID09PSB0cnVlKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxTQUFTQSxNQUFNLEVBQUVDLEVBQUUsUUFBUSwyQkFBMkI7QUFDdEQsU0FBU0MsUUFBUSxFQUFFQyxRQUFRLEVBQUVDLElBQUksUUFBUSxzQkFBc0I7O0FBRS9EO0FBQ0E7QUFDQSxNQUFNQyxXQUFXLFNBQVNILFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQUksY0FBQSxFQUFBQyxVQUFBLElBQUFDLFVBQUEsU0FBQUMsYUFBQSxrQ0FBVFAsUUFBUSxFQUFBUSxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLElBQUFKLFVBQUEsUUFBQUQsY0FBQTtFQUFBLE1BQUFHLGFBQUEsR0FDL0JOLFFBQVEsQ0FBQztJQUFFUyxPQUFPLEVBQUU7RUFBVSxDQUFDLENBQUM7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUN4QlIsUUFBUUEsQ0FBQVUsQ0FBQTtJQUFBLE1BQUFGLENBQUEsR0FBQUUsQ0FBQTtFQUFBO0VBRWpCLE9BQU9DLFFBQVFBLENBQUNDLElBQUksRUFBRTtJQUNwQkEsSUFBSSxDQUFDQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDO0lBQ3ZDLE9BQU9aLElBQUksUUFBUVcsSUFBSSxDQUFDWixRQUFRLFFBQVE7RUFDMUM7RUFDQWMsV0FBV0EsQ0FBQSxFQUFHO0lBQ1osS0FBSyxDQUFDLENBQUM7SUFDUCxJQUFJLENBQUNDLEtBQUssR0FBRyxDQUFDO0VBQ2hCO0VBQ0FDLE1BQU1BLENBQUEsRUFBRztJQUNQLElBQUksQ0FBQ0QsS0FBSyxFQUFFO0lBQ1osSUFBSSxJQUFJLENBQUNBLEtBQUssR0FBRyxDQUFDLEVBQUU7TUFDbEIsS0FBSyxDQUFDQyxNQUFNLENBQUMsQ0FBQztJQUNoQjtFQUNGO0FBQ0Y7QUFDQUMsY0FBYyxDQUFDQyxNQUFNLENBQUMscUJBQXFCLEVBQUVoQixXQUFXLENBQUM7QUFFekRKLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFZO0VBQ2pELE1BQU1xQixFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLHFCQUFxQixDQUFDO0VBQ3hERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEJ0QixNQUFNLENBQUNzQixFQUFFLENBQUNKLEtBQUssS0FBSyxDQUFDLENBQUM7RUFDdEJsQixNQUFNLENBQUNzQixFQUFFLENBQUNuQixRQUFRLEtBQUssU0FBUyxDQUFDO0VBQ2pDSCxNQUFNLENBQUNzQixFQUFFLENBQUNLLFVBQVUsQ0FBQ0MsV0FBVyxLQUFLLEVBQUUsQ0FBQztFQUN4Q04sRUFBRSxDQUFDbkIsUUFBUSxHQUFHLE1BQU07O0VBRXBCO0VBQ0EsTUFBTTBCLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDLENBQUM7RUFDdkI5QixNQUFNLENBQUNzQixFQUFFLENBQUNKLEtBQUssS0FBSyxDQUFDLENBQUM7RUFDdEJsQixNQUFNLENBQUNzQixFQUFFLENBQUNuQixRQUFRLEtBQUssTUFBTSxDQUFDO0VBQzlCSCxNQUFNLENBQUNzQixFQUFFLENBQUNLLFVBQVUsQ0FBQ0MsV0FBVyxLQUFLLE1BQU0sQ0FBQztBQUM5QyxDQUFDLENBQUM7QUFFRjNCLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxZQUFZO0VBQ3ZDLE1BQU1xQixFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLHFCQUFxQixDQUFDO0VBQ3hEO0VBQ0FGLEVBQUUsQ0FBQ0osS0FBSyxHQUFHLENBQUM7RUFDWmxCLE1BQU0sQ0FBQ3NCLEVBQUUsQ0FBQ1MsWUFBWSxDQUFDLGdCQUFnQixDQUFDLEtBQUssS0FBSyxDQUFDO0VBQ25EUixRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEJ0QixNQUFNLENBQUNzQixFQUFFLENBQUNTLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLElBQUksQ0FBQztBQUNwRCxDQUFDLENBQUMiLCJpZ25vcmVMaXN0IjpbXX0=