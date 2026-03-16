function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
export default class TestElement extends XElement {
  constructor() {
    super();
    this._readOnlyProperty = 'didelphidae';
    this._readOnlyKey = 'didelphimorphia';
    Reflect.defineProperty(this, 'readOnlyDefinedProperty', {
      value: 'phalangeriformes',
      configurable: false
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.firstElementChild.textContent = this.readOnlyProperty;
  }
  static template() {
    return html`<div></div>`;
  }
  get readOnlyProperty() {
    return this._readOnlyProperty;
  }
  get [Symbol.for('readOnlyKey')]() {
    return this._readOnlyKey;
  }
  get reflectedProperty() {
    return this.getAttribute('reflected-property');
  }
  set reflectedProperty(value) {
    this.setAttribute('reflected-property', value);
  }
}
const setupEl = el => {
  el.className = 'marsupialia';
  el.readOnlyProperty = 'chlamyphoridae';
  el[Symbol.for('readOnlyKey')] = 'dasypodidae';
  el.reflectedProperty = 'plantigrade';
};
const hasNotUpgraded = el => {
  return el instanceof HTMLElement && el instanceof TestElement === false && el.shadowRoot === null && el.getAttribute('class') === 'marsupialia' && el.readOnlyProperty === 'chlamyphoridae' && el[Symbol.for('readOnlyKey')] === 'dasypodidae' && el.readOnlyDefinedProperty === undefined && el.reflectedProperty === 'plantigrade' && el.getAttribute('reflected-property') === null;
};
const hasUpgraded = el => {
  // Properties are still shadowed after upgrade and before initialization.
  return el instanceof TestElement && el.getAttribute('class') === 'marsupialia' && el.readOnlyProperty === 'didelphidae' && el[Symbol.for('readOnlyKey')] === 'didelphimorphia' && el.readOnlyDefinedProperty === 'phalangeriformes' && el.reflectedProperty === 'plantigrade' && el.getAttribute('reflected-property') === 'plantigrade';
};
it('x-element upgrade lifecycle', () => {
  const localName = 'test-element-next';
  assert(customElements.get(localName) === undefined, 'localName is initially undefined');
  const el1 = document.createElement(localName);
  el1.id = 'el1';
  setupEl(el1);
  document.body.append(el1);
  const el2 = document.createElement(localName);
  el2.id = 'el2';
  setupEl(el2);
  assert(el1.localName === localName && document.getElementById('el1') === el1 && hasNotUpgraded(el1), 'el1 is setup as expected');
  assert(el1.localName === localName && document.getElementById('el2') === null && hasNotUpgraded(el2), 'el2 is setup as expected');
  customElements.define(localName, TestElement);
  const el3 = document.createElement(localName);
  el3.id = 'el3';
  el3.className = 'marsupialia';
  el3.reflectedProperty = 'plantigrade';
  const el4 = new TestElement();
  el4.id = 'el4';
  el4.className = 'marsupialia';
  el4.reflectedProperty = 'plantigrade';
  assert(hasUpgraded(el3) && hasUpgraded(el4), 'elements created after definition do not need upgrading');
  assert(hasUpgraded(el1), 'element in document is upgraded upon definition');
  assert(el1.shadowRoot.textContent === 'didelphidae', 'element in document synchronously renders');
  assert(hasNotUpgraded(el2), 'element out of document is still not upgraded');
  document.body.append(el2);
  assert(el2.shadowRoot.textContent === 'didelphidae', 'element out of document upgrades/renders after being added');
  document.body.append(el3);
  assert(el3.shadowRoot.textContent === 'didelphidae', 'element created after definition upgrades/renders after being added');
});
it('preserves x-element properties set before customElements.define', () => {
  let _initProto, _fooDecs, _init_foo, _barDecs, _init_bar;
  class PreUpgradeElement extends XElement {
    static {
      [_init_foo, _init_bar, _initProto] = _applyDecs(this, [[_fooDecs, 1, "foo"], [_barDecs, 1, "bar"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto(this), _init_foo(this));
    get [(_fooDecs = property({
      type: String
    }), _barDecs = property({
      type: Number
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
  }
  const el = document.createElement('pre-upgrade-element-next');
  el.foo = 'test';
  el.bar = 42;
  customElements.define('pre-upgrade-element-next', PreUpgradeElement);
  document.body.append(el);
  assert(el.foo === 'test');
  assert(el.bar === 42);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnQiLCJjb25zdHJ1Y3RvciIsIl9yZWFkT25seVByb3BlcnR5IiwiX3JlYWRPbmx5S2V5IiwiUmVmbGVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJjb25maWd1cmFibGUiLCJjb25uZWN0ZWRDYWxsYmFjayIsInNoYWRvd1Jvb3QiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInRleHRDb250ZW50IiwicmVhZE9ubHlQcm9wZXJ0eSIsInRlbXBsYXRlIiwiU3ltYm9sIiwiZm9yIiwicmVmbGVjdGVkUHJvcGVydHkiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXR1cEVsIiwiZWwiLCJjbGFzc05hbWUiLCJoYXNOb3RVcGdyYWRlZCIsIkhUTUxFbGVtZW50IiwicmVhZE9ubHlEZWZpbmVkUHJvcGVydHkiLCJ1bmRlZmluZWQiLCJoYXNVcGdyYWRlZCIsImxvY2FsTmFtZSIsImN1c3RvbUVsZW1lbnRzIiwiZ2V0IiwiZWwxIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJib2R5IiwiYXBwZW5kIiwiZWwyIiwiZ2V0RWxlbWVudEJ5SWQiLCJkZWZpbmUiLCJlbDMiLCJlbDQiLCJfaW5pdFByb3RvIiwiX2Zvb0RlY3MiLCJfaW5pdF9mb28iLCJfYmFyRGVjcyIsIl9pbml0X2JhciIsIlByZVVwZ3JhZGVFbGVtZW50IiwiX2FwcGx5RGVjcyIsImUiLCJBIiwidHlwZSIsIlN0cmluZyIsIk51bWJlciIsImZvbyIsInYiLCJCIiwiYmFyIl0sInNvdXJjZXMiOlsidGVzdC1lbGVtZW50LXVwZ3JhZGUuc3JjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCwgaXQgfSBmcm9tICdAbmV0ZmxpeC94LXRlc3QveC10ZXN0LmpzJztcbmltcG9ydCB7IFhFbGVtZW50LCBwcm9wZXJ0eSwgaHRtbCB9IGZyb20gJy4uL3gtZWxlbWVudC1uZXh0LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcmVhZE9ubHlQcm9wZXJ0eSA9ICdkaWRlbHBoaWRhZSc7XG4gICAgdGhpcy5fcmVhZE9ubHlLZXkgPSAnZGlkZWxwaGltb3JwaGlhJztcbiAgICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdyZWFkT25seURlZmluZWRQcm9wZXJ0eScsIHtcbiAgICAgIHZhbHVlOiAncGhhbGFuZ2VyaWZvcm1lcycsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICB0aGlzLnNoYWRvd1Jvb3QuZmlyc3RFbGVtZW50Q2hpbGQudGV4dENvbnRlbnQgPSB0aGlzLnJlYWRPbmx5UHJvcGVydHk7XG4gIH1cblxuICBzdGF0aWMgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj48L2Rpdj5gO1xuICB9XG5cbiAgZ2V0IHJlYWRPbmx5UHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRPbmx5UHJvcGVydHk7XG4gIH1cblxuICBnZXQgW1N5bWJvbC5mb3IoJ3JlYWRPbmx5S2V5JyldKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWFkT25seUtleTtcbiAgfVxuXG4gIGdldCByZWZsZWN0ZWRQcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3JlZmxlY3RlZC1wcm9wZXJ0eScpO1xuICB9XG5cbiAgc2V0IHJlZmxlY3RlZFByb3BlcnR5KHZhbHVlKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3JlZmxlY3RlZC1wcm9wZXJ0eScsIHZhbHVlKTtcbiAgfVxufVxuXG5jb25zdCBzZXR1cEVsID0gZWwgPT4ge1xuICBlbC5jbGFzc05hbWUgPSAnbWFyc3VwaWFsaWEnO1xuICBlbC5yZWFkT25seVByb3BlcnR5ID0gJ2NobGFteXBob3JpZGFlJztcbiAgZWxbU3ltYm9sLmZvcigncmVhZE9ubHlLZXknKV0gPSAnZGFzeXBvZGlkYWUnO1xuICBlbC5yZWZsZWN0ZWRQcm9wZXJ0eSA9ICdwbGFudGlncmFkZSc7XG59O1xuXG5jb25zdCBoYXNOb3RVcGdyYWRlZCA9IGVsID0+IHtcbiAgcmV0dXJuIChcbiAgICBlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgZWwgaW5zdGFuY2VvZiBUZXN0RWxlbWVudCA9PT0gZmFsc2UgJiZcbiAgICBlbC5zaGFkb3dSb290ID09PSBudWxsICYmXG4gICAgZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpID09PSAnbWFyc3VwaWFsaWEnICYmXG4gICAgZWwucmVhZE9ubHlQcm9wZXJ0eSA9PT0gJ2NobGFteXBob3JpZGFlJyAmJlxuICAgIGVsW1N5bWJvbC5mb3IoJ3JlYWRPbmx5S2V5JyldID09PSAnZGFzeXBvZGlkYWUnICYmXG4gICAgZWwucmVhZE9ubHlEZWZpbmVkUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJlxuICAgIGVsLnJlZmxlY3RlZFByb3BlcnR5ID09PSAncGxhbnRpZ3JhZGUnICYmXG4gICAgZWwuZ2V0QXR0cmlidXRlKCdyZWZsZWN0ZWQtcHJvcGVydHknKSA9PT0gbnVsbFxuICApO1xufTtcblxuY29uc3QgaGFzVXBncmFkZWQgPSBlbCA9PiB7XG4gIC8vIFByb3BlcnRpZXMgYXJlIHN0aWxsIHNoYWRvd2VkIGFmdGVyIHVwZ3JhZGUgYW5kIGJlZm9yZSBpbml0aWFsaXphdGlvbi5cbiAgcmV0dXJuIChcbiAgICBlbCBpbnN0YW5jZW9mIFRlc3RFbGVtZW50ICYmXG4gICAgZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpID09PSAnbWFyc3VwaWFsaWEnICYmXG4gICAgZWwucmVhZE9ubHlQcm9wZXJ0eSA9PT0gJ2RpZGVscGhpZGFlJyAmJlxuICAgIGVsW1N5bWJvbC5mb3IoJ3JlYWRPbmx5S2V5JyldID09PSAnZGlkZWxwaGltb3JwaGlhJyAmJlxuICAgIGVsLnJlYWRPbmx5RGVmaW5lZFByb3BlcnR5ID09PSAncGhhbGFuZ2VyaWZvcm1lcycgJiZcbiAgICBlbC5yZWZsZWN0ZWRQcm9wZXJ0eSA9PT0gJ3BsYW50aWdyYWRlJyAmJlxuICAgIGVsLmdldEF0dHJpYnV0ZSgncmVmbGVjdGVkLXByb3BlcnR5JykgPT09ICdwbGFudGlncmFkZSdcbiAgKTtcbn07XG5cbml0KCd4LWVsZW1lbnQgdXBncmFkZSBsaWZlY3ljbGUnLCAoKSA9PiB7XG4gIGNvbnN0IGxvY2FsTmFtZSA9ICd0ZXN0LWVsZW1lbnQtbmV4dCc7XG4gIGFzc2VydChcbiAgICBjdXN0b21FbGVtZW50cy5nZXQobG9jYWxOYW1lKSA9PT0gdW5kZWZpbmVkLFxuICAgICdsb2NhbE5hbWUgaXMgaW5pdGlhbGx5IHVuZGVmaW5lZCdcbiAgKTtcblxuICBjb25zdCBlbDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGxvY2FsTmFtZSk7XG4gIGVsMS5pZCA9ICdlbDEnO1xuICBzZXR1cEVsKGVsMSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsMSk7XG5cbiAgY29uc3QgZWwyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsb2NhbE5hbWUpO1xuICBlbDIuaWQgPSAnZWwyJztcbiAgc2V0dXBFbChlbDIpO1xuXG4gIGFzc2VydChcbiAgICBlbDEubG9jYWxOYW1lID09PSBsb2NhbE5hbWUgJiZcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbDEnKSA9PT0gZWwxICYmXG4gICAgICBoYXNOb3RVcGdyYWRlZChlbDEpLFxuICAgICdlbDEgaXMgc2V0dXAgYXMgZXhwZWN0ZWQnXG4gICk7XG5cbiAgYXNzZXJ0KFxuICAgIGVsMS5sb2NhbE5hbWUgPT09IGxvY2FsTmFtZSAmJlxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsMicpID09PSBudWxsICYmXG4gICAgICBoYXNOb3RVcGdyYWRlZChlbDIpLFxuICAgICdlbDIgaXMgc2V0dXAgYXMgZXhwZWN0ZWQnXG4gICk7XG5cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKGxvY2FsTmFtZSwgVGVzdEVsZW1lbnQpO1xuXG4gIGNvbnN0IGVsMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobG9jYWxOYW1lKTtcbiAgZWwzLmlkID0gJ2VsMyc7XG4gIGVsMy5jbGFzc05hbWUgPSAnbWFyc3VwaWFsaWEnO1xuICBlbDMucmVmbGVjdGVkUHJvcGVydHkgPSAncGxhbnRpZ3JhZGUnO1xuXG4gIGNvbnN0IGVsNCA9IG5ldyBUZXN0RWxlbWVudCgpO1xuICBlbDQuaWQgPSAnZWw0JztcbiAgZWw0LmNsYXNzTmFtZSA9ICdtYXJzdXBpYWxpYSc7XG4gIGVsNC5yZWZsZWN0ZWRQcm9wZXJ0eSA9ICdwbGFudGlncmFkZSc7XG5cbiAgYXNzZXJ0KFxuICAgIGhhc1VwZ3JhZGVkKGVsMykgJiYgaGFzVXBncmFkZWQoZWw0KSxcbiAgICAnZWxlbWVudHMgY3JlYXRlZCBhZnRlciBkZWZpbml0aW9uIGRvIG5vdCBuZWVkIHVwZ3JhZGluZydcbiAgKTtcblxuICBhc3NlcnQoaGFzVXBncmFkZWQoZWwxKSwgJ2VsZW1lbnQgaW4gZG9jdW1lbnQgaXMgdXBncmFkZWQgdXBvbiBkZWZpbml0aW9uJyk7XG4gIGFzc2VydChcbiAgICBlbDEuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ2RpZGVscGhpZGFlJyxcbiAgICAnZWxlbWVudCBpbiBkb2N1bWVudCBzeW5jaHJvbm91c2x5IHJlbmRlcnMnXG4gICk7XG5cbiAgYXNzZXJ0KGhhc05vdFVwZ3JhZGVkKGVsMiksICdlbGVtZW50IG91dCBvZiBkb2N1bWVudCBpcyBzdGlsbCBub3QgdXBncmFkZWQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwyKTtcbiAgYXNzZXJ0KFxuICAgIGVsMi5zaGFkb3dSb290LnRleHRDb250ZW50ID09PSAnZGlkZWxwaGlkYWUnLFxuICAgICdlbGVtZW50IG91dCBvZiBkb2N1bWVudCB1cGdyYWRlcy9yZW5kZXJzIGFmdGVyIGJlaW5nIGFkZGVkJ1xuICApO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsMyk7XG4gIGFzc2VydChcbiAgICBlbDMuc2hhZG93Um9vdC50ZXh0Q29udGVudCA9PT0gJ2RpZGVscGhpZGFlJyxcbiAgICAnZWxlbWVudCBjcmVhdGVkIGFmdGVyIGRlZmluaXRpb24gdXBncmFkZXMvcmVuZGVycyBhZnRlciBiZWluZyBhZGRlZCdcbiAgKTtcbn0pO1xuXG5pdCgncHJlc2VydmVzIHgtZWxlbWVudCBwcm9wZXJ0aWVzIHNldCBiZWZvcmUgY3VzdG9tRWxlbWVudHMuZGVmaW5lJywgKCkgPT4ge1xuICBjbGFzcyBQcmVVcGdyYWRlRWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoe1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0pXG4gICAgYWNjZXNzb3IgZm9vO1xuXG4gICAgQHByb3BlcnR5KHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICB9KVxuICAgIGFjY2Vzc29yIGJhcjtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ByZS11cGdyYWRlLWVsZW1lbnQtbmV4dCcpO1xuICBlbC5mb28gPSAndGVzdCc7XG4gIGVsLmJhciA9IDQyO1xuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3ByZS11cGdyYWRlLWVsZW1lbnQtbmV4dCcsIFByZVVwZ3JhZGVFbGVtZW50KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuZm9vID09PSAndGVzdCcpO1xuICBhc3NlcnQoZWwuYmFyID09PSA0Mik7XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxTQUFTQSxNQUFNLEVBQUVDLEVBQUUsUUFBUSwyQkFBMkI7QUFDdEQsU0FBU0MsUUFBUSxFQUFFQyxRQUFRLEVBQUVDLElBQUksUUFBUSxzQkFBc0I7QUFFL0QsZUFBZSxNQUFNQyxXQUFXLFNBQVNILFFBQVEs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