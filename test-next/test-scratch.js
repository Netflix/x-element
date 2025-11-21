let _initProto, _prop1Decs, _init_prop, _prop2Decs, _init_prop2, _prop3Decs, _init_prop3, _prop5Decs, _init_prop4, _prop6Decs, _init_prop5, _prop7Decs, _init_prop6, _prop8Decs, _init_prop7, _arrayPropDecs, _init_arrayProp, _objPropDecs, _init_objProp, _objDatePropDecs, _init_objDateProp, _objMapPropDecs, _init_objMapProp, _computedPropDecs, _init_computedProp, _adoptedDecs, _init_adopted;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';

// TODO: #346: Scratch tests are general integration tests. Updated to use
//  decorator syntax for properties.
class TestElement extends XElement {
  static {
    [_init_prop, _init_prop2, _init_prop3, _init_prop4, _init_prop5, _init_prop6, _init_prop7, _init_arrayProp, _init_objProp, _init_objDateProp, _init_objMapProp, _init_computedProp, _init_adopted, _initProto] = _applyDecs(this, [[_prop1Decs, 1, "prop1"], [_prop2Decs, 1, "prop2"], [_prop3Decs, 1, "prop3"], [_prop5Decs, 1, "prop5"], [_prop6Decs, 1, "prop6"], [_prop7Decs, 1, "prop7"], [_prop8Decs, 1, "prop8"], [_arrayPropDecs, 1, "arrayProp"], [_objPropDecs, 1, "objProp"], [_objDatePropDecs, 1, "objDateProp"], [_objMapPropDecs, 1, "objMapProp"], [_computedPropDecs, 1, "computedProp"], [_adoptedDecs, 1, "adopted"]], [], 0, void 0, XElement).e;
  }
  // reflected with no value
  #A = (_initProto(this), _init_prop(this)); // reflected with falsy initial value (null)
  get [(_prop1Decs = property({
    type: String,
    reflect: true
  }), _prop2Decs = property({
    type: String,
    initial: null,
    reflect: true
  }), _prop3Decs = property({
    type: String,
    initial: null,
    reflect: true
  }), _prop5Decs = property({
    type: String,
    initial: 'test',
    reflect: true
  }), _prop6Decs = property({
    type: Boolean,
    reflect: true
  }), _prop7Decs = property({
    type: Boolean,
    initial: false,
    reflect: true
  }), _prop8Decs = property({
    type: Boolean,
    initial: true,
    reflect: true
  }), _arrayPropDecs = property({
    type: Array,
    initial: () => ['foo', 'bar']
  }), _objPropDecs = property({
    type: Object,
    initial: () => {
      return {
        foo: 'bar'
      };
    }
  }), _objDatePropDecs = property({
    type: Date,
    initial: () => {
      return new Date();
    }
  }), _objMapPropDecs = property({
    type: Map,
    initial: () => {
      return new Map();
    }
  }), _computedPropDecs = property({
    type: String,
    input: ['prop1', 'prop2'],
    compute: (prop1, prop2) => `${prop1} ${prop2}`
  }), _adoptedDecs = property({
    type: Boolean,
    initial: false
  }), "prop1")]() {
    return this.#A;
  }
  set prop1(v) {
    this.#A = v;
  }
  #B = _init_prop2(this); // reflected with falsy initial value (undefined)
  get prop2() {
    return this.#B;
  }
  set prop2(v) {
    this.#B = v;
  }
  #C = _init_prop3(this); // reflected with initial value
  get prop3() {
    return this.#C;
  }
  set prop3(v) {
    this.#C = v;
  }
  #D = _init_prop4(this); // Boolean without initial value
  get prop5() {
    return this.#D;
  }
  set prop5(v) {
    this.#D = v;
  }
  #E = _init_prop5(this); // Boolean with `false` initial value
  get prop6() {
    return this.#E;
  }
  set prop6(v) {
    this.#E = v;
  }
  #F = _init_prop6(this); // Boolean with `true` initial value
  get prop7() {
    return this.#F;
  }
  set prop7(v) {
    this.#F = v;
  }
  #G = _init_prop7(this);
  get prop8() {
    return this.#G;
  }
  set prop8(v) {
    this.#G = v;
  }
  #H = _init_arrayProp(this);
  get arrayProp() {
    return this.#H;
  }
  set arrayProp(v) {
    this.#H = v;
  }
  #I = _init_objProp(this);
  get objProp() {
    return this.#I;
  }
  set objProp(v) {
    this.#I = v;
  }
  #J = _init_objDateProp(this);
  get objDateProp() {
    return this.#J;
  }
  set objDateProp(v) {
    this.#J = v;
  }
  #K = _init_objMapProp(this);
  get objMapProp() {
    return this.#K;
  }
  set objMapProp(v) {
    this.#K = v;
  }
  #L = _init_computedProp(this);
  get computedProp() {
    return this.#L;
  }
  set computedProp(v) {
    this.#L = v;
  }
  #M = _init_adopted(this);
  get adopted() {
    return this.#M;
  }
  set adopted(v) {
    this.#M = v;
  }
  static get observedAttributes() {
    return [...super.observedAttributes, 'custom-observed-attribute'];
  }
  static template(host) {
    return html`<span>${host.prop1}</span>`;
  }
  attributeChangedCallback(attribute, oldValue, value) {
    super.attributeChangedCallback(attribute, oldValue, value);
    if (attribute === 'custom-observed-attribute') {
      this.customObservedAttributeChange = true;
    }
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.adopted = true;
  }
}
customElements.define('test-element-scratch', TestElement);
it('scratch', async () => {
  const el = document.createElement('test-element-scratch');
  document.body.append(el);

  // Attribute reflection tests
  assert(el.hasAttribute('prop1') === false, 'should not reflect when initial value is unspecified');
  el.prop1 = 'test';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.getAttribute('prop1') === 'test', 'should reflect when value changes from unspecified to a string');
  el.prop1 = null;

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.hasAttribute('prop1') === false, 'should not reflect when value changes from a string to null');
  assert(el.hasAttribute('prop2') === false, 'should not reflect when initial value is falsy (null)');
  assert(el.hasAttribute('prop3') === false, 'should not reflect when initial value is falsy (undefined)');
  assert(el.getAttribute('prop5') === 'test', 'should reflect when initial value is a String');

  // Boolean attribute reflection tests
  assert(el.hasAttribute('prop6') === false, 'reflect boolean');
  assert(el.hasAttribute('prop7') === false, 'should not reflect when initial value is false');
  assert(el.getAttribute('prop8') === '', 'should reflect when initial value is true');

  // Async data binding
  el.prop1 = null;

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.querySelector('span').textContent === '', 'should update the DOM bindings');
  el.prop1 = 'test2';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.querySelector('span').textContent === 'test2', 'should update the DOM bindings again');

  // complex properties
  assert(Array.isArray(el.arrayProp) && el.arrayProp[0] === 'foo', 'should allow Array types');
  assert(el.objProp.foo === 'bar', 'should allow Object types');
  assert(el.objDateProp.getFullYear() > 2017, 'should allow Date types');
  assert(el.objMapProp.has('foo') === false, 'should allow Map types');

  // lifecycle
  document.body.removeChild(el);
  document.body.append(el);
});
it('test dispatchError', () => {
  const el = document.createElement('test-element-scratch');
  const error = new Error('Foo');
  let passed = false;
  const onError = event => {
    if (event.error === error && event.message === error.message && event.bubbles === true && event.composed === true) {
      passed = true;
    }
  };
  el.addEventListener('error', onError);
  el.dispatchError(error);
  el.removeEventListener('error', onError);
  assert(passed);
});

// TODO: Firefox somehow returns an un-upgraded instance after adoption. This
//  seems like a bug in the browser, but we should look into it.
(navigator.userAgent.includes('Firefox') ? it.skip : it)('test adoptedCallback', () => {
  const el = document.createElement('test-element-scratch');
  el.prop1 = 'adopt me!';
  document.body.append(el);
  assert(el.adopted === false);
  const iframe = document.createElement('iframe');
  iframe.src = 'about:blank';
  iframe.style.height = '10vh';
  iframe.style.width = '10vw';
  document.body.append(iframe);
  iframe.ownerDocument.adoptNode(el);
  iframe.contentDocument.body.append(el);
  assert(el.adopted);
});
it('authors can extend observed attributes', () => {
  const el = document.createElement('test-element-scratch');
  assert(!el.customObservedAttributeChange);
  el.setAttribute('custom-observed-attribute', '');
  assert(el.customObservedAttributeChange);
});
it('throws error when getting property on prototype', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    TestElement.prototype.prop1;
  } catch (error) {
    const expected = 'Cannot access property "prop1" on prototype.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('throws error when setting property on prototype', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    TestElement.prototype.prop1 = 'value';
  } catch (error) {
    const expected = 'Cannot set property "prop1" on prototype.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnQiLCJfaW5pdF9wcm9wIiwiX2luaXRfcHJvcDIiLCJfaW5pdF9wcm9wMyIsIl9pbml0X3Byb3A0IiwiX2luaXRfcHJvcDUiLCJfaW5pdF9wcm9wNiIsIl9pbml0X3Byb3A3IiwiX2luaXRfYXJyYXlQcm9wIiwiX2luaXRfb2JqUHJvcCIsIl9pbml0X29iakRhdGVQcm9wIiwiX2luaXRfb2JqTWFwUHJvcCIsIl9pbml0X2NvbXB1dGVkUHJvcCIsIl9pbml0X2Fkb3B0ZWQiLCJfaW5pdFByb3RvIiwiX2FwcGx5RGVjcyIsIl9wcm9wMURlY3MiLCJfcHJvcDJEZWNzIiwiX3Byb3AzRGVjcyIsIl9wcm9wNURlY3MiLCJfcHJvcDZEZWNzIiwiX3Byb3A3RGVjcyIsIl9wcm9wOERlY3MiLCJfYXJyYXlQcm9wRGVjcyIsIl9vYmpQcm9wRGVjcyIsIl9vYmpEYXRlUHJvcERlY3MiLCJfb2JqTWFwUHJvcERlY3MiLCJfY29tcHV0ZWRQcm9wRGVjcyIsIl9hZG9wdGVkRGVjcyIsImUiLCJBIiwidHlwZSIsIlN0cmluZyIsInJlZmxlY3QiLCJpbml0aWFsIiwiQm9vbGVhbiIsIkFycmF5IiwiT2JqZWN0IiwiZm9vIiwiRGF0ZSIsIk1hcCIsImlucHV0IiwiY29tcHV0ZSIsInByb3AxIiwicHJvcDIiLCJ2IiwiQiIsIkMiLCJwcm9wMyIsIkQiLCJwcm9wNSIsIkUiLCJwcm9wNiIsIkYiLCJwcm9wNyIsIkciLCJwcm9wOCIsIkgiLCJhcnJheVByb3AiLCJJIiwib2JqUHJvcCIsIkoiLCJvYmpEYXRlUHJvcCIsIksiLCJvYmpNYXBQcm9wIiwiTCIsImNvbXB1dGVkUHJvcCIsIk0iLCJhZG9wdGVkIiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwidGVtcGxhdGUiLCJob3N0IiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwiYXR0cmlidXRlIiwib2xkVmFsdWUiLCJ2YWx1ZSIsImN1c3RvbU9ic2VydmVkQXR0cmlidXRlQ2hhbmdlIiwiYWRvcHRlZENhbGxiYWNrIiwiY3VzdG9tRWxlbWVudHMiLCJkZWZpbmUiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJvZHkiLCJhcHBlbmQiLCJoYXNBdHRyaWJ1dGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImdldEF0dHJpYnV0ZSIsInNoYWRvd1Jvb3QiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJpc0FycmF5IiwiZ2V0RnVsbFllYXIiLCJoYXMiLCJyZW1vdmVDaGlsZCIsImVycm9yIiwiRXJyb3IiLCJwYXNzZWQiLCJvbkVycm9yIiwiZXZlbnQiLCJtZXNzYWdlIiwiYnViYmxlcyIsImNvbXBvc2VkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRpc3BhdGNoRXJyb3IiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaW5jbHVkZXMiLCJza2lwIiwiaWZyYW1lIiwic3JjIiwic3R5bGUiLCJoZWlnaHQiLCJ3aWR0aCIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJjb250ZW50RG9jdW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJwcm90b3R5cGUiLCJleHBlY3RlZCJdLCJzb3VyY2VzIjpbInRlc3Qtc2NyYXRjaC5zcmMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0LCBpdCB9IGZyb20gJ0BuZXRmbGl4L3gtdGVzdC94LXRlc3QuanMnO1xuaW1wb3J0IHsgWEVsZW1lbnQsIHByb3BlcnR5LCBodG1sIH0gZnJvbSAnLi4veC1lbGVtZW50LW5leHQuanMnO1xuXG4vLyBUT0RPOiAjMzQ2OiBTY3JhdGNoIHRlc3RzIGFyZSBnZW5lcmFsIGludGVncmF0aW9uIHRlc3RzLiBVcGRhdGVkIHRvIHVzZVxuLy8gIGRlY29yYXRvciBzeW50YXggZm9yIHByb3BlcnRpZXMuXG5jbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgLy8gcmVmbGVjdGVkIHdpdGggbm8gdmFsdWVcbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVmbGVjdDogdHJ1ZSxcbiAgfSlcbiAgYWNjZXNzb3IgcHJvcDE7XG5cbiAgLy8gcmVmbGVjdGVkIHdpdGggZmFsc3kgaW5pdGlhbCB2YWx1ZSAobnVsbClcbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5pdGlhbDogbnVsbCxcbiAgICByZWZsZWN0OiB0cnVlLFxuICB9KVxuICBhY2Nlc3NvciBwcm9wMjtcblxuICAvLyByZWZsZWN0ZWQgd2l0aCBmYWxzeSBpbml0aWFsIHZhbHVlICh1bmRlZmluZWQpXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluaXRpYWw6IG51bGwsXG4gICAgcmVmbGVjdDogdHJ1ZSxcbiAgfSlcbiAgYWNjZXNzb3IgcHJvcDM7XG5cbiAgLy8gcmVmbGVjdGVkIHdpdGggaW5pdGlhbCB2YWx1ZVxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbml0aWFsOiAndGVzdCcsXG4gICAgcmVmbGVjdDogdHJ1ZSxcbiAgfSlcbiAgYWNjZXNzb3IgcHJvcDU7XG5cbiAgLy8gQm9vbGVhbiB3aXRob3V0IGluaXRpYWwgdmFsdWVcbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIHJlZmxlY3Q6IHRydWUsXG4gIH0pXG4gIGFjY2Vzc29yIHByb3A2O1xuXG4gIC8vIEJvb2xlYW4gd2l0aCBgZmFsc2VgIGluaXRpYWwgdmFsdWVcbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGluaXRpYWw6IGZhbHNlLFxuICAgIHJlZmxlY3Q6IHRydWUsXG4gIH0pXG4gIGFjY2Vzc29yIHByb3A3O1xuXG4gIC8vIEJvb2xlYW4gd2l0aCBgdHJ1ZWAgaW5pdGlhbCB2YWx1ZVxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgaW5pdGlhbDogdHJ1ZSxcbiAgICByZWZsZWN0OiB0cnVlLFxuICB9KVxuICBhY2Nlc3NvciBwcm9wODtcblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IEFycmF5LFxuICAgIGluaXRpYWw6ICgpID0+IFsnZm9vJywgJ2JhciddLFxuICB9KVxuICBhY2Nlc3NvciBhcnJheVByb3A7XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBPYmplY3QsXG4gICAgaW5pdGlhbDogKCkgPT4ge1xuICAgICAgcmV0dXJuIHsgZm9vOiAnYmFyJyB9O1xuICAgIH0sXG4gIH0pXG4gIGFjY2Vzc29yIG9ialByb3A7XG5cbiAgQHByb3BlcnR5KHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGluaXRpYWw6ICgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICAgIH0sXG4gIH0pXG4gIGFjY2Vzc29yIG9iakRhdGVQcm9wO1xuXG4gIEBwcm9wZXJ0eSh7XG4gICAgdHlwZTogTWFwLFxuICAgIGluaXRpYWw6ICgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgTWFwKCk7XG4gICAgfSxcbiAgfSlcbiAgYWNjZXNzb3Igb2JqTWFwUHJvcDtcblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbnB1dDogWydwcm9wMScsICdwcm9wMiddLFxuICAgIGNvbXB1dGU6IChwcm9wMSwgcHJvcDIpID0+IGAke3Byb3AxfSAke3Byb3AyfWAsXG4gIH0pXG4gIGFjY2Vzc29yIGNvbXB1dGVkUHJvcDtcblxuICBAcHJvcGVydHkoe1xuICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgaW5pdGlhbDogZmFsc2UsXG4gIH0pXG4gIGFjY2Vzc29yIGFkb3B0ZWQ7XG5cbiAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIFsuLi5zdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMsICdjdXN0b20tb2JzZXJ2ZWQtYXR0cmlidXRlJ107XG4gIH1cblxuICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgIHJldHVybiBodG1sYDxzcGFuPiR7aG9zdC5wcm9wMX08L3NwYW4+YDtcbiAgfVxuXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUsIG9sZFZhbHVlLCB2YWx1ZSkge1xuICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUsIG9sZFZhbHVlLCB2YWx1ZSk7XG4gICAgaWYgKGF0dHJpYnV0ZSA9PT0gJ2N1c3RvbS1vYnNlcnZlZC1hdHRyaWJ1dGUnKSB7XG4gICAgICB0aGlzLmN1c3RvbU9ic2VydmVkQXR0cmlidXRlQ2hhbmdlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhZG9wdGVkQ2FsbGJhY2soKSB7XG4gICAgc3VwZXIuYWRvcHRlZENhbGxiYWNrKCk7XG4gICAgdGhpcy5hZG9wdGVkID0gdHJ1ZTtcbiAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1zY3JhdGNoJywgVGVzdEVsZW1lbnQpO1xuXG5cbml0KCdzY3JhdGNoJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1zY3JhdGNoJyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcblxuICAvLyBBdHRyaWJ1dGUgcmVmbGVjdGlvbiB0ZXN0c1xuICBhc3NlcnQoXG4gICAgZWwuaGFzQXR0cmlidXRlKCdwcm9wMScpID09PSBmYWxzZSxcbiAgICAnc2hvdWxkIG5vdCByZWZsZWN0IHdoZW4gaW5pdGlhbCB2YWx1ZSBpcyB1bnNwZWNpZmllZCdcbiAgKTtcblxuICBlbC5wcm9wMSA9ICd0ZXN0JztcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBhc3NlcnQoXG4gICAgZWwuZ2V0QXR0cmlidXRlKCdwcm9wMScpID09PSAndGVzdCcsXG4gICAgJ3Nob3VsZCByZWZsZWN0IHdoZW4gdmFsdWUgY2hhbmdlcyBmcm9tIHVuc3BlY2lmaWVkIHRvIGEgc3RyaW5nJ1xuICApO1xuXG4gIGVsLnByb3AxID0gbnVsbDtcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBhc3NlcnQoXG4gICAgZWwuaGFzQXR0cmlidXRlKCdwcm9wMScpID09PSBmYWxzZSxcbiAgICAnc2hvdWxkIG5vdCByZWZsZWN0IHdoZW4gdmFsdWUgY2hhbmdlcyBmcm9tIGEgc3RyaW5nIHRvIG51bGwnXG4gICk7XG5cbiAgYXNzZXJ0KFxuICAgIGVsLmhhc0F0dHJpYnV0ZSgncHJvcDInKSA9PT0gZmFsc2UsXG4gICAgJ3Nob3VsZCBub3QgcmVmbGVjdCB3aGVuIGluaXRpYWwgdmFsdWUgaXMgZmFsc3kgKG51bGwpJ1xuICApO1xuXG4gIGFzc2VydChcbiAgICBlbC5oYXNBdHRyaWJ1dGUoJ3Byb3AzJykgPT09IGZhbHNlLFxuICAgICdzaG91bGQgbm90IHJlZmxlY3Qgd2hlbiBpbml0aWFsIHZhbHVlIGlzIGZhbHN5ICh1bmRlZmluZWQpJ1xuICApO1xuXG4gIGFzc2VydChcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ3Byb3A1JykgPT09ICd0ZXN0JyxcbiAgICAnc2hvdWxkIHJlZmxlY3Qgd2hlbiBpbml0aWFsIHZhbHVlIGlzIGEgU3RyaW5nJ1xuICApO1xuXG4gIC8vIEJvb2xlYW4gYXR0cmlidXRlIHJlZmxlY3Rpb24gdGVzdHNcbiAgYXNzZXJ0KGVsLmhhc0F0dHJpYnV0ZSgncHJvcDYnKSA9PT0gZmFsc2UsICdyZWZsZWN0IGJvb2xlYW4nKTtcblxuICBhc3NlcnQoXG4gICAgZWwuaGFzQXR0cmlidXRlKCdwcm9wNycpID09PSBmYWxzZSxcbiAgICAnc2hvdWxkIG5vdCByZWZsZWN0IHdoZW4gaW5pdGlhbCB2YWx1ZSBpcyBmYWxzZSdcbiAgKTtcblxuICBhc3NlcnQoXG4gICAgZWwuZ2V0QXR0cmlidXRlKCdwcm9wOCcpID09PSAnJyxcbiAgICAnc2hvdWxkIHJlZmxlY3Qgd2hlbiBpbml0aWFsIHZhbHVlIGlzIHRydWUnXG4gICk7XG5cbiAgLy8gQXN5bmMgZGF0YSBiaW5kaW5nXG4gIGVsLnByb3AxID0gbnVsbDtcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBhc3NlcnQoXG4gICAgZWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzcGFuJykudGV4dENvbnRlbnQgPT09ICcnLFxuICAgICdzaG91bGQgdXBkYXRlIHRoZSBET00gYmluZGluZ3MnXG4gICk7XG4gIGVsLnByb3AxID0gJ3Rlc3QyJztcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBhc3NlcnQoXG4gICAgZWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzcGFuJykudGV4dENvbnRlbnQgPT09ICd0ZXN0MicsXG4gICAgJ3Nob3VsZCB1cGRhdGUgdGhlIERPTSBiaW5kaW5ncyBhZ2FpbidcbiAgKTtcblxuICAvLyBjb21wbGV4IHByb3BlcnRpZXNcbiAgYXNzZXJ0KFxuICAgIEFycmF5LmlzQXJyYXkoZWwuYXJyYXlQcm9wKSAmJiBlbC5hcnJheVByb3BbMF0gPT09ICdmb28nLFxuICAgICdzaG91bGQgYWxsb3cgQXJyYXkgdHlwZXMnXG4gICk7XG4gIGFzc2VydChlbC5vYmpQcm9wLmZvbyA9PT0gJ2JhcicsICdzaG91bGQgYWxsb3cgT2JqZWN0IHR5cGVzJyk7XG5cbiAgYXNzZXJ0KGVsLm9iakRhdGVQcm9wLmdldEZ1bGxZZWFyKCkgPiAyMDE3LCAnc2hvdWxkIGFsbG93IERhdGUgdHlwZXMnKTtcblxuICBhc3NlcnQoZWwub2JqTWFwUHJvcC5oYXMoJ2ZvbycpID09PSBmYWxzZSwgJ3Nob3VsZCBhbGxvdyBNYXAgdHlwZXMnKTtcblxuICAvLyBsaWZlY3ljbGVcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbn0pO1xuXG5pdCgndGVzdCBkaXNwYXRjaEVycm9yJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1zY3JhdGNoJyk7XG4gIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdGb28nKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBjb25zdCBvbkVycm9yID0gZXZlbnQgPT4ge1xuICAgIGlmIChcbiAgICAgIGV2ZW50LmVycm9yID09PSBlcnJvciAmJlxuICAgICAgZXZlbnQubWVzc2FnZSA9PT0gZXJyb3IubWVzc2FnZSAmJlxuICAgICAgZXZlbnQuYnViYmxlcyA9PT0gdHJ1ZSAmJlxuICAgICAgZXZlbnQuY29tcG9zZWQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIHBhc3NlZCA9IHRydWU7XG4gICAgfVxuICB9O1xuICBlbC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICBlbC5kaXNwYXRjaEVycm9yKGVycm9yKTtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgYXNzZXJ0KHBhc3NlZCk7XG59KTtcblxuLy8gVE9ETzogRmlyZWZveCBzb21laG93IHJldHVybnMgYW4gdW4tdXBncmFkZWQgaW5zdGFuY2UgYWZ0ZXIgYWRvcHRpb24uIFRoaXNcbi8vICBzZWVtcyBsaWtlIGEgYnVnIGluIHRoZSBicm93c2VyLCBidXQgd2Ugc2hvdWxkIGxvb2sgaW50byBpdC5cbihuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdGaXJlZm94JykgPyBpdC5za2lwIDogaXQpKCd0ZXN0IGFkb3B0ZWRDYWxsYmFjaycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtc2NyYXRjaCcpO1xuICBlbC5wcm9wMSA9ICdhZG9wdCBtZSEnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5hZG9wdGVkID09PSBmYWxzZSk7XG4gIGNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICBpZnJhbWUuc3JjID0gJ2Fib3V0OmJsYW5rJztcbiAgaWZyYW1lLnN0eWxlLmhlaWdodCA9ICcxMHZoJztcbiAgaWZyYW1lLnN0eWxlLndpZHRoID0gJzEwdncnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChpZnJhbWUpO1xuICBpZnJhbWUub3duZXJEb2N1bWVudC5hZG9wdE5vZGUoZWwpO1xuICBpZnJhbWUuY29udGVudERvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLmFkb3B0ZWQpO1xufSk7XG5cbml0KCdhdXRob3JzIGNhbiBleHRlbmQgb2JzZXJ2ZWQgYXR0cmlidXRlcycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtc2NyYXRjaCcpO1xuICBhc3NlcnQoIWVsLmN1c3RvbU9ic2VydmVkQXR0cmlidXRlQ2hhbmdlKTtcbiAgZWwuc2V0QXR0cmlidXRlKCdjdXN0b20tb2JzZXJ2ZWQtYXR0cmlidXRlJywgJycpO1xuICBhc3NlcnQoZWwuY3VzdG9tT2JzZXJ2ZWRBdHRyaWJ1dGVDaGFuZ2UpO1xufSk7XG5cbml0KCd0aHJvd3MgZXJyb3Igd2hlbiBnZXR0aW5nIHByb3BlcnR5IG9uIHByb3RvdHlwZScsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBUZXN0RWxlbWVudC5wcm90b3R5cGUucHJvcDE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnQ2Fubm90IGFjY2VzcyBwcm9wZXJ0eSBcInByb3AxXCIgb24gcHJvdG90eXBlLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3Rocm93cyBlcnJvciB3aGVuIHNldHRpbmcgcHJvcGVydHkgb24gcHJvdG90eXBlJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIFRlc3RFbGVtZW50LnByb3RvdHlwZS5wcm9wMSA9ICd2YWx1ZSc7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnQ2Fubm90IHNldCBwcm9wZXJ0eSBcInByb3AxXCIgb24gcHJvdG90eXBlLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsU0FBU0EsTUFBTSxFQUFFQyxFQUFFLFFBQVEsMkJBQTJCO0FBQ3RELFNBQVNDLFFBQVEsRUFBRUMsUUFBUSxFQUFFQyxJQUFJLFFBQVEsc0JBQXNCOztBQUUvRDtBQUNBO0FBQ0EsTUFBTUMsV0FBVyxTQUFTSCxRQUFRLENBQUM7RUFBQTtJQUFBLENBQUFJLFVBQUEsRUFBQUMsV0FBQSxFQUFBQyxXQUFBLEVBQUFDLFdBQUEsRUFBQUMsV0FBQSxFQUFBQyxXQUFBLEVBQUFDLFdBQUEsRUFBQUMsZUFBQSxFQUFBQyxhQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGdCQUFBLEVBQUFDLGtCQUFBLEVBQUFDLGFBQUEsRUFBQUMsVUFBQSxJQUFBQyxVQUFBLFNBQUFDLFVBQUEsZ0JBQUFDLFVBQUEsZ0JBQUFDLFVB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