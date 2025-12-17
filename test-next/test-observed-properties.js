let _initProto, _aDecs, _init_a, _bDecs, _init_b, _cDecs, _init_c, _changesDecs, _init_changes, _poppedDecs, _init_popped, _asyncDecs, _init_async;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
class TestElement extends XElement {
  static {
    [_init_a, _init_b, _init_c, _init_changes, _init_popped, _init_async, _initProto] = _applyDecs(this, [[_aDecs, 1, "a"], [_bDecs, 1, "b"], [_cDecs, 1, "c"], [_changesDecs, 1, "changes"], [_poppedDecs, 1, "popped"], [_asyncDecs, 1, "async"]], [], 0, void 0, XElement).e;
  }
  static get [(_aDecs = property({
    type: String,
    observe: (host, value, oldValue) => TestElement.#observeA(host, value, oldValue)
  }), _bDecs = property({
    type: String,
    observe: (host, value, oldValue) => TestElement.#observeB(host, value, oldValue)
  }), _cDecs = property({
    type: String,
    input: ['a', 'b'],
    compute: (a, b) => TestElement.#computeC(a, b),
    observe: (host, value, oldValue) => TestElement.#observeC(host, value, oldValue)
  }), _changesDecs = property({
    type: Array,
    observe: () => {}
  }), _poppedDecs = property({
    type: Boolean,
    reflect: true,
    observe: (host, value, oldValue) => TestElement.#observePopped(host, value, oldValue)
  }), _asyncDecs = property({
    observe: async () => {}
  }), "styles")]() {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`\
      :host #container {
        transition-property: box-shadow;
        transition-duration: 300ms;
        transition-timing-function: linear;
        box-shadow: 0 0 0 1px black;
        padding: 10px;
      }

      :host([popped]) #container {
        box-shadow: 0 0 10px 0 black;
      }
    `);
    return [styleSheet];
  }
  #A = (_initProto(this), _init_a(this));
  get a() {
    return this.#A;
  }
  set a(v) {
    this.#A = v;
  }
  #B = _init_b(this);
  get b() {
    return this.#B;
  }
  set b(v) {
    this.#B = v;
  }
  #C = _init_c(this);
  get c() {
    return this.#C;
  }
  set c(v) {
    this.#C = v;
  }
  #D = _init_changes(this);
  get changes() {
    return this.#D;
  }
  set changes(v) {
    this.#D = v;
  }
  #E = _init_popped(this);
  get popped() {
    return this.#E;
  }
  set popped(v) {
    this.#E = v;
  }
  #F = _init_async(this);
  get async() {
    return this.#F;
  }
  set async(v) {
    this.#F = v;
  }
  static #computeC(a, b) {
    return `${a} ${b}`;
  }
  static #observeA(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({
      property: 'a',
      value,
      oldValue
    });
    host.changes = changes;
  }
  static #observeB(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({
      property: 'b',
      value,
      oldValue
    });
    host.changes = changes;
  }
  static #observeC(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({
      property: 'c',
      value,
      oldValue
    });
    host.changes = changes;
  }
  static #observePopped(host, value, oldValue) {
    const changes = Object.assign([], host.changes);
    changes.push({
      property: 'popped',
      value,
      oldValue
    });
    host.changes = changes;
  }
  static template(host) {
    return html`
      <div id="container">
        <div>Changes:</div>
        <ul>
          ${(host.changes || []).map(change => {
      return html`
              <li>
                <code>${change.property}</code>: "${change.oldValue}" &#x2192; "${change.value}"
              </li>
            `;
    })}
        </ul>
      </div>
    `;
  }
}
customElements.define('test-element-next', TestElement);
const isObject = obj => obj instanceof Object && obj !== null;
const deepEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  return isObject(a) && isObject(b) &&
  // Note, we ignore non-enumerable properties (Symbols) here.
  Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => deepEqual(a[key], b[key]));
};
it('initialized as expected', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(deepEqual(el.changes, [{
    property: 'c',
    value: 'undefined undefined',
    oldValue: undefined
  }]), 'initialized as expected');
  document.body.removeChild(el);
});
it('x-element observed properties', async () => {
  const el = document.createElement('test-element-next');
  el.a = '11';
  el.b = '22';
  document.body.append(el);
  assert(deepEqual(el.changes, [{
    property: 'a',
    value: '11',
    oldValue: undefined
  }, {
    property: 'b',
    value: '22',
    oldValue: undefined
  }, {
    property: 'c',
    value: '11 22',
    oldValue: undefined
  }]), 'initialized as expected');
  el.b = 'hey';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(deepEqual(el.changes, [{
    property: 'a',
    value: '11',
    oldValue: undefined
  }, {
    property: 'b',
    value: '22',
    oldValue: undefined
  }, {
    property: 'c',
    value: '11 22',
    oldValue: undefined
  }, {
    property: 'c',
    value: '11 hey',
    oldValue: '11 22'
  }, {
    property: 'b',
    value: 'hey',
    oldValue: '22'
  }]), 'observe callbacks are called when properties change');
  el.b = 'hey';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(deepEqual(el.changes, [{
    property: 'a',
    value: '11',
    oldValue: undefined
  }, {
    property: 'b',
    value: '22',
    oldValue: undefined
  }, {
    property: 'c',
    value: '11 22',
    oldValue: undefined
  }, {
    property: 'c',
    value: '11 hey',
    oldValue: '11 22'
  }, {
    property: 'b',
    value: 'hey',
    oldValue: '22'
  }]), 'observe callbacks are not called when set property is the same');
  el.popped = true;

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  el.setAttribute('popped', 'still technically true');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(deepEqual(el.changes, [{
    property: 'a',
    value: '11',
    oldValue: undefined
  }, {
    property: 'b',
    value: '22',
    oldValue: undefined
  }, {
    property: 'c',
    value: '11 22',
    oldValue: undefined
  }, {
    property: 'c',
    value: '11 hey',
    oldValue: '11 22'
  }, {
    property: 'b',
    value: 'hey',
    oldValue: '22'
  }, {
    property: 'popped',
    value: true,
    oldValue: undefined
  }]), 'no re-entrance for observed, reflected properties');
});
it('child properties are bound before initialization', () => {
  let _initProto2, _fooDecs, _init_foo, _initProto3, _fooDecs2, _init_foo2;
  const observations = [];
  class TestInner extends XElement {
    static {
      [_init_foo, _initProto2] = _applyDecs(this, [[_fooDecs, 1, "foo"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto2(this), _init_foo(this));
    get [(_fooDecs = property({
      type: Boolean,
      observe: (host, value) => observations.push(value),
      default: false
    }), "foo")]() {
      return this.#A;
    }
    set foo(v) {
      this.#A = v;
    }
  }
  customElements.define('test-inner-next', TestInner);
  class TestOuter extends XElement {
    static {
      [_init_foo2, _initProto3] = _applyDecs(this, [[_fooDecs2, 1, "foo"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto3(this), _init_foo2(this));
    get [(_fooDecs2 = property({
      type: Boolean,
      default: true
    }), "foo")]() {
      return this.#A;
    }
    set foo(v) {
      this.#A = v;
    }
    static template(host) {
      return html`<test-inner-next .foo="${host.foo}"></test-inner-next>`;
    }
  }
  customElements.define('test-outer-next', TestOuter);
  const el = document.createElement('test-outer-next');
  document.body.append(el);
  assert(observations[0] === true, observations[0]);
  assert(observations.length === 1, observations);
  el.remove();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9hIiwiX2luaXRfYiIsIl9pbml0X2MiLCJfaW5pdF9jaGFuZ2VzIiwiX2luaXRfcG9wcGVkIiwiX2luaXRfYXN5bmMiLCJfaW5pdFByb3RvIiwiX2FwcGx5RGVjcyIsIl9hRGVjcyIsIl9iRGVjcyIsIl9jRGVjcyIsIl9jaGFuZ2VzRGVjcyIsIl9wb3BwZWREZWNzIiwiX2FzeW5jRGVjcyIsImUiLCJ0eXBlIiwiU3RyaW5nIiwib2JzZXJ2ZSIsImhvc3QiLCJ2YWx1ZSIsIm9sZFZhbHVlIiwib2JzZXJ2ZUEiLCJvYnNlcnZlQiIsImlucHV0IiwiY29tcHV0ZSIsImEiLCJiIiwiY29tcHV0ZUMiLCJvYnNlcnZlQyIsIkFycmF5IiwiQm9vbGVhbiIsInJlZmxlY3QiLCJvYnNlcnZlUG9wcGVkIiwic3R5bGVTaGVldCIsIkNTU1N0eWxlU2hlZXQiLCJyZXBsYWNlU3luYyIsIkEiLCJ2IiwiQiIsIkMiLCJjIiwiRCIsImNoYW5nZXMiLCJFIiwicG9wcGVkIiwiRiIsImFzeW5jIiwiI2NvbXB1dGVDIiwiI29ic2VydmVBIiwiT2JqZWN0IiwiYXNzaWduIiwicHVzaCIsIiNvYnNlcnZlQiIsIiNvYnNlcnZlQyIsIiNvYnNlcnZlUG9wcGVkIiwidGVtcGxhdGUiLCJtYXAiLCJjaGFuZ2UiLCJjdXN0b21FbGVtZW50cyIsImRlZmluZSIsImlzT2JqZWN0Iiwib2JqIiwiZGVlcEVxdWFsIiwia2V5cyIsImxlbmd0aCIsImV2ZXJ5Iiwia2V5IiwiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kIiwidW5kZWZpbmVkIiwicmVtb3ZlQ2hpbGQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldEF0dHJpYnV0ZSIsIl9pbml0UHJvdG8yIiwiX2Zvb0RlY3MiLCJfaW5pdF9mb28iLCJfaW5pdFByb3RvMyIsIl9mb29EZWNzMiIsIl9pbml0X2ZvbzIiLCJvYnNlcnZhdGlvbnMiLCJUZXN0SW5uZXIiLCJkZWZhdWx0IiwiZm9vIiwiVGVzdE91dGVyIiwicmVtb3ZlIl0sInNvdXJjZXMiOlsidGVzdC1vYnNlcnZlZC1wcm9wZXJ0aWVzLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHksIGh0bWwgfSBmcm9tICcuLi94LWVsZW1lbnQtbmV4dC5qcyc7XG5cbmNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICBzdGF0aWMgZ2V0IHN0eWxlcygpIHtcbiAgICBjb25zdCBzdHlsZVNoZWV0ID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICBzdHlsZVNoZWV0LnJlcGxhY2VTeW5jKGBcXFxuICAgICAgOmhvc3QgI2NvbnRhaW5lciB7XG4gICAgICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IGJveC1zaGFkb3c7XG4gICAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDMwMG1zO1xuICAgICAgICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogbGluZWFyO1xuICAgICAgICBib3gtc2hhZG93OiAwIDAgMCAxcHggYmxhY2s7XG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICB9XG5cbiAgICAgIDpob3N0KFtwb3BwZWRdKSAjY29udGFpbmVyIHtcbiAgICAgICAgYm94LXNoYWRvdzogMCAwIDEwcHggMCBibGFjaztcbiAgICAgIH1cbiAgICBgKTtcbiAgICByZXR1cm4gW3N0eWxlU2hlZXRdO1xuICB9XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb2JzZXJ2ZTogKGhvc3QsIHZhbHVlLCBvbGRWYWx1ZSkgPT4gVGVzdEVsZW1lbnQuI29ic2VydmVBKGhvc3QsIHZhbHVlLCBvbGRWYWx1ZSksXG4gIH0pXG4gIGFjY2Vzc29yIGE7XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb2JzZXJ2ZTogKGhvc3QsIHZhbHVlLCBvbGRWYWx1ZSkgPT4gVGVzdEVsZW1lbnQuI29ic2VydmVCKGhvc3QsIHZhbHVlLCBvbGRWYWx1ZSksXG4gIH0pXG4gIGFjY2Vzc29yIGI7XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5wdXQ6IFsnYScsICdiJ10sXG4gICAgY29tcHV0ZTogKGEsIGIpID0+IFRlc3RFbGVtZW50LiNjb21wdXRlQyhhLCBiKSxcbiAgICBvYnNlcnZlOiAoaG9zdCwgdmFsdWUsIG9sZFZhbHVlKSA9PiBUZXN0RWxlbWVudC4jb2JzZXJ2ZUMoaG9zdCwgdmFsdWUsIG9sZFZhbHVlKSxcbiAgfSlcbiAgYWNjZXNzb3IgYztcblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IEFycmF5LFxuICAgIG9ic2VydmU6ICgpID0+IHt9LFxuICB9KVxuICBhY2Nlc3NvciBjaGFuZ2VzO1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogQm9vbGVhbixcbiAgICByZWZsZWN0OiB0cnVlLFxuICAgIG9ic2VydmU6IChob3N0LCB2YWx1ZSwgb2xkVmFsdWUpID0+IFRlc3RFbGVtZW50LiNvYnNlcnZlUG9wcGVkKGhvc3QsIHZhbHVlLCBvbGRWYWx1ZSksXG4gIH0pXG4gIGFjY2Vzc29yIHBvcHBlZDtcblxuICBAcHJvcGVydHkoe1xuICAgIG9ic2VydmU6IGFzeW5jICgpID0+IHt9LFxuICB9KVxuICBhY2Nlc3NvciBhc3luYztcblxuICBzdGF0aWMgI2NvbXB1dGVDKGEsIGIpIHtcbiAgICByZXR1cm4gYCR7YX0gJHtifWA7XG4gIH1cblxuICBzdGF0aWMgI29ic2VydmVBKGhvc3QsIHZhbHVlLCBvbGRWYWx1ZSkge1xuICAgIGNvbnN0IGNoYW5nZXMgPSBPYmplY3QuYXNzaWduKFtdLCBob3N0LmNoYW5nZXMpO1xuICAgIGNoYW5nZXMucHVzaCh7IHByb3BlcnR5OiAnYScsIHZhbHVlLCBvbGRWYWx1ZSB9KTtcbiAgICBob3N0LmNoYW5nZXMgPSBjaGFuZ2VzO1xuICB9XG5cbiAgc3RhdGljICNvYnNlcnZlQihob3N0LCB2YWx1ZSwgb2xkVmFsdWUpIHtcbiAgICBjb25zdCBjaGFuZ2VzID0gT2JqZWN0LmFzc2lnbihbXSwgaG9zdC5jaGFuZ2VzKTtcbiAgICBjaGFuZ2VzLnB1c2goeyBwcm9wZXJ0eTogJ2InLCB2YWx1ZSwgb2xkVmFsdWUgfSk7XG4gICAgaG9zdC5jaGFuZ2VzID0gY2hhbmdlcztcbiAgfVxuXG4gIHN0YXRpYyAjb2JzZXJ2ZUMoaG9zdCwgdmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgY29uc3QgY2hhbmdlcyA9IE9iamVjdC5hc3NpZ24oW10sIGhvc3QuY2hhbmdlcyk7XG4gICAgY2hhbmdlcy5wdXNoKHsgcHJvcGVydHk6ICdjJywgdmFsdWUsIG9sZFZhbHVlIH0pO1xuICAgIGhvc3QuY2hhbmdlcyA9IGNoYW5nZXM7XG4gIH1cblxuICBzdGF0aWMgI29ic2VydmVQb3BwZWQoaG9zdCwgdmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgY29uc3QgY2hhbmdlcyA9IE9iamVjdC5hc3NpZ24oW10sIGhvc3QuY2hhbmdlcyk7XG4gICAgY2hhbmdlcy5wdXNoKHsgcHJvcGVydHk6ICdwb3BwZWQnLCB2YWx1ZSwgb2xkVmFsdWUgfSk7XG4gICAgaG9zdC5jaGFuZ2VzID0gY2hhbmdlcztcbiAgfVxuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgXG4gICAgICA8ZGl2IGlkPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXY+Q2hhbmdlczo8L2Rpdj5cbiAgICAgICAgPHVsPlxuICAgICAgICAgICR7KGhvc3QuY2hhbmdlcyB8fCBbXSkubWFwKChjaGFuZ2UgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGh0bWxgXG4gICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICA8Y29kZT4ke2NoYW5nZS5wcm9wZXJ0eX08L2NvZGU+OiBcIiR7Y2hhbmdlLm9sZFZhbHVlfVwiICYjeDIxOTI7IFwiJHtjaGFuZ2UudmFsdWV9XCJcbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIGA7XG4gICAgICAgICAgfSkpfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgYDtcbiAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1uZXh0JywgVGVzdEVsZW1lbnQpO1xuXG5cbmNvbnN0IGlzT2JqZWN0ID0gb2JqID0+IG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiBvYmogIT09IG51bGw7XG5jb25zdCBkZWVwRXF1YWwgPSAoYSwgYikgPT4ge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiAoXG4gICAgaXNPYmplY3QoYSkgJiZcbiAgICBpc09iamVjdChiKSAmJlxuICAgIC8vIE5vdGUsIHdlIGlnbm9yZSBub24tZW51bWVyYWJsZSBwcm9wZXJ0aWVzIChTeW1ib2xzKSBoZXJlLlxuICAgIE9iamVjdC5rZXlzKGEpLmxlbmd0aCA9PT0gT2JqZWN0LmtleXMoYikubGVuZ3RoICYmXG4gICAgT2JqZWN0LmtleXMoYSkuZXZlcnkoa2V5ID0+IGRlZXBFcXVhbChhW2tleV0sIGJba2V5XSkpXG4gICk7XG59O1xuXG5pdCgnaW5pdGlhbGl6ZWQgYXMgZXhwZWN0ZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoXG4gICAgZGVlcEVxdWFsKGVsLmNoYW5nZXMsIFtcbiAgICAgIHsgcHJvcGVydHk6ICdjJywgdmFsdWU6ICd1bmRlZmluZWQgdW5kZWZpbmVkJywgb2xkVmFsdWU6IHVuZGVmaW5lZCB9LFxuICAgIF0pLFxuICAgICdpbml0aWFsaXplZCBhcyBleHBlY3RlZCdcbiAgKTtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbCk7XG59KTtcblxuaXQoJ3gtZWxlbWVudCBvYnNlcnZlZCBwcm9wZXJ0aWVzJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGVsLmEgPSAnMTEnO1xuICBlbC5iID0gJzIyJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuXG4gIGFzc2VydChcbiAgICBkZWVwRXF1YWwoZWwuY2hhbmdlcywgW1xuICAgICAgeyBwcm9wZXJ0eTogJ2EnLCB2YWx1ZTogJzExJywgb2xkVmFsdWU6IHVuZGVmaW5lZCB9LFxuICAgICAgeyBwcm9wZXJ0eTogJ2InLCB2YWx1ZTogJzIyJywgb2xkVmFsdWU6IHVuZGVmaW5lZCB9LFxuICAgICAgeyBwcm9wZXJ0eTogJ2MnLCB2YWx1ZTogJzExIDIyJywgb2xkVmFsdWU6IHVuZGVmaW5lZCB9LFxuICAgIF0pLFxuICAgICdpbml0aWFsaXplZCBhcyBleHBlY3RlZCdcbiAgKTtcblxuICBlbC5iID0gJ2hleSc7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KFxuICAgIGRlZXBFcXVhbChlbC5jaGFuZ2VzLCBbXG4gICAgICB7IHByb3BlcnR5OiAnYScsIHZhbHVlOiAnMTEnLCBvbGRWYWx1ZTogdW5kZWZpbmVkIH0sXG4gICAgICB7IHByb3BlcnR5OiAnYicsIHZhbHVlOiAnMjInLCBvbGRWYWx1ZTogdW5kZWZpbmVkIH0sXG4gICAgICB7IHByb3BlcnR5OiAnYycsIHZhbHVlOiAnMTEgMjInLCBvbGRWYWx1ZTogdW5kZWZpbmVkIH0sXG4gICAgICB7IHByb3BlcnR5OiAnYycsIHZhbHVlOiAnMTEgaGV5Jywgb2xkVmFsdWU6ICcxMSAyMicgfSxcbiAgICAgIHsgcHJvcGVydHk6ICdiJywgdmFsdWU6ICdoZXknLCBvbGRWYWx1ZTogJzIyJyB9LFxuICAgIF0pLFxuICAgICdvYnNlcnZlIGNhbGxiYWNrcyBhcmUgY2FsbGVkIHdoZW4gcHJvcGVydGllcyBjaGFuZ2UnXG4gICk7XG5cbiAgZWwuYiA9ICdoZXknO1xuXG4gIC8vIFdlIG11c3QgYXdhaXQgYSBtaWNyb3Rhc2sgZm9yIHRoZSB1cGRhdGUgdG8gdGFrZSBwbGFjZS5cbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChcbiAgICBkZWVwRXF1YWwoZWwuY2hhbmdlcywgW1xuICAgICAgeyBwcm9wZXJ0eTogJ2EnLCB2YWx1ZTogJzExJywgb2xkVmFsdWU6IHVuZGVmaW5lZCB9LFxuICAgICAgeyBwcm9wZXJ0eTogJ2InLCB2YWx1ZTogJzIyJywgb2xkVmFsdWU6IHVuZGVmaW5lZCB9LFxuICAgICAgeyBwcm9wZXJ0eTogJ2MnLCB2YWx1ZTogJzExIDIyJywgb2xkVmFsdWU6IHVuZGVmaW5lZCB9LFxuICAgICAgeyBwcm9wZXJ0eTogJ2MnLCB2YWx1ZTogJzExIGhleScsIG9sZFZhbHVlOiAnMTEgMjInIH0sXG4gICAgICB7IHByb3BlcnR5OiAnYicsIHZhbHVlOiAnaGV5Jywgb2xkVmFsdWU6ICcyMicgfSxcbiAgICBdKSxcbiAgICAnb2JzZXJ2ZSBjYWxsYmFja3MgYXJlIG5vdCBjYWxsZWQgd2hlbiBzZXQgcHJvcGVydHkgaXMgdGhlIHNhbWUnXG4gICk7XG5cbiAgZWwucG9wcGVkID0gdHJ1ZTtcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBlbC5zZXRBdHRyaWJ1dGUoJ3BvcHBlZCcsICdzdGlsbCB0ZWNobmljYWxseSB0cnVlJyk7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KFxuICAgIGRlZXBFcXVhbChlbC5jaGFuZ2VzLCBbXG4gICAgICB7IHByb3BlcnR5OiAnYScsIHZhbHVlOiAnMTEnLCBvbGRWYWx1ZTogdW5kZWZpbmVkIH0sXG4gICAgICB7IHByb3BlcnR5OiAnYicsIHZhbHVlOiAnMjInLCBvbGRWYWx1ZTogdW5kZWZpbmVkIH0sXG4gICAgICB7IHByb3BlcnR5OiAnYycsIHZhbHVlOiAnMTEgMjInLCBvbGRWYWx1ZTogdW5kZWZpbmVkIH0sXG4gICAgICB7IHByb3BlcnR5OiAnYycsIHZhbHVlOiAnMTEgaGV5Jywgb2xkVmFsdWU6ICcxMSAyMicgfSxcbiAgICAgIHsgcHJvcGVydHk6ICdiJywgdmFsdWU6ICdoZXknLCBvbGRWYWx1ZTogJzIyJyB9LFxuICAgICAgeyBwcm9wZXJ0eTogJ3BvcHBlZCcsIHZhbHVlOiB0cnVlLCBvbGRWYWx1ZTogdW5kZWZpbmVkIH0sXG4gICAgXSksXG4gICAgJ25vIHJlLWVudHJhbmNlIGZvciBvYnNlcnZlZCwgcmVmbGVjdGVkIHByb3BlcnRpZXMnXG4gICk7XG59KTtcblxuaXQoJ2NoaWxkIHByb3BlcnRpZXMgYXJlIGJvdW5kIGJlZm9yZSBpbml0aWFsaXphdGlvbicsICgpID0+IHtcbiAgY29uc3Qgb2JzZXJ2YXRpb25zID0gW107XG4gIGNsYXNzIFRlc3RJbm5lciBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoe1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIG9ic2VydmU6IChob3N0LCB2YWx1ZSkgPT4gb2JzZXJ2YXRpb25zLnB1c2godmFsdWUpLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSlcbiAgICBhY2Nlc3NvciBmb287XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWlubmVyLW5leHQnLCBUZXN0SW5uZXIpO1xuICBjbGFzcyBUZXN0T3V0ZXIgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgQHByb3BlcnR5KHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0pXG4gICAgYWNjZXNzb3IgZm9vO1xuXG4gICAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICAgIHJldHVybiBodG1sYDx0ZXN0LWlubmVyLW5leHQgLmZvbz1cIiR7aG9zdC5mb299XCI+PC90ZXN0LWlubmVyLW5leHQ+YDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LW91dGVyLW5leHQnLCBUZXN0T3V0ZXIpO1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3Qtb3V0ZXItbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChvYnNlcnZhdGlvbnNbMF0gPT09IHRydWUsIG9ic2VydmF0aW9uc1swXSk7XG4gIGFzc2VydChvYnNlcnZhdGlvbnMubGVuZ3RoID09PSAxLCBvYnNlcnZhdGlvbnMpO1xuICBlbC5yZW1vdmUoKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxTQUFTQSxNQUFNLEVBQUVDLEVBQUUsUUFBUSwyQkFBMkI7QUFDdEQsU0FBU0MsUUFBUSxFQUFFQyxRQUFRLEVBQUVDLElBQUksUUFBUSxzQkFBc0I7QUFFL0QsTUFBTUMsV0FBVyxTQUFTSCxRQUFRLENBQUM7RUFBQTtJQUFBLENBQUFJLE9BQUEsRUFBQUMsT0FBQSxFQUFBQyxPQUFBLEVBQUFDLGFBQUEsRUFBQUMsWUFBQSxFQUFBQyxXQUFBLEVBQUFDLFVBQUEsSUFBQUMsVUFBQSxTQUFBQyxNQUFBLFlBQUFDLE1BQUEsWUFBQUMsTUFBQSxZQUFBQyxZQUFBLGtCQUFBQyxXQUFBLGlCQUFBQyxVQUFBLCtCQUFUakIsUUFBUSxFQUFBa0IsQ0FBQTtFQUFBO0VBQ2hDLGFBQUFOLE1BQUEsR0FrQkNYLFFBQVEsQ0FBQztJQUNSa0IsSUFBSSxFQUFFQyxNQUFNO0lBQ1pDLE9BQU8sRUFBRUEsQ0FBQ0MsSUFBSSxFQUFFQyxLQUFLLEVBQUVDLFFBQVEsS0FBS3JCLFdBQVcsQ0FBQyxDQUFDc0IsUUFBUSxD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