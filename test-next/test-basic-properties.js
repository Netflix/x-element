let _initProto, _normalPropertyDecs, _init_normalProperty, _objectPropertyDecs, _init_objectProperty, _camelCasePropertyDecs, _init_camelCaseProperty, _numericPropertyDecs, _init_numericProperty, _nullPropertyDecs, _init_nullProperty, _undefinedPropertyDecs, _init_undefinedProperty, _typelessPropertyDecs, _init_typelessProperty, _typelessPropertyWithCustomAttributeDecs, _init_typelessPropertyWithCustomAttribute, _internalPropertyDecs, _init_internalProperty, _get_internalProperty, _set_internalProperty;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, html } from '../x-element-next.js';
class TestElementNext extends XElement {
  static {
    [_init_normalProperty, _init_objectProperty, _init_camelCaseProperty, _init_numericProperty, _init_nullProperty, _init_undefinedProperty, _init_typelessProperty, _init_typelessPropertyWithCustomAttribute, _init_internalProperty, _get_internalProperty, _set_internalProperty, _initProto] = _applyDecs(this, [[_normalPropertyDecs, 1, "normalProperty"], [_objectPropertyDecs, 1, "objectProperty"], [_camelCasePropertyDecs, 1, "camelCaseProperty"], [_numericPropertyDecs, 1, "numericProperty"], [_nullPropertyDecs, 1, "nullProperty"], [_undefinedPropertyDecs, 1, "undefinedProperty"], [_typelessPropertyDecs, 1, "typelessProperty"], [_typelessPropertyWithCustomAttributeDecs, 1, "typelessPropertyWithCustomAttribute"], [_internalPropertyDecs, 1, "internalProperty", o => o.#I, (o, v) => o.#I = v]], [], 0, _ => #internalProperty in _, XElement).e;
  }
  #A = (_initProto(this), _init_normalProperty(this));
  get [(_normalPropertyDecs = property({
    type: String,
    initial: 'Ferus'
  }), _objectPropertyDecs = property({
    type: Object
  }), _camelCasePropertyDecs = property({
    type: String,
    initial: 'Bactrian'
  }), _numericPropertyDecs = property({
    type: Number,
    default: 10
  }), _nullPropertyDecs = property({
    type: String,
    default: null
  }), _undefinedPropertyDecs = property({
    type: String
  }), _typelessPropertyDecs = property({}), _typelessPropertyWithCustomAttributeDecs = property({
    attribute: 'custom-attribute-typeless'
  }), _internalPropertyDecs = property({}), "normalProperty")]() {
    return this.#A;
  }
  set normalProperty(v) {
    this.#A = v;
  }
  #B = _init_objectProperty(this);
  get objectProperty() {
    return this.#B;
  }
  set objectProperty(v) {
    this.#B = v;
  }
  #C = _init_camelCaseProperty(this);
  get camelCaseProperty() {
    return this.#C;
  }
  set camelCaseProperty(v) {
    this.#C = v;
  }
  #D = _init_numericProperty(this);
  get numericProperty() {
    return this.#D;
  }
  set numericProperty(v) {
    this.#D = v;
  }
  #E = _init_nullProperty(this);
  get nullProperty() {
    return this.#E;
  }
  set nullProperty(v) {
    this.#E = v;
  }
  #F = _init_undefinedProperty(this);
  get undefinedProperty() {
    return this.#F;
  }
  set undefinedProperty(v) {
    this.#F = v;
  }
  #G = _init_typelessProperty(this);
  get typelessProperty() {
    return this.#G;
  }
  set typelessProperty(v) {
    this.#G = v;
  }
  #H = _init_typelessPropertyWithCustomAttribute(this);
  get typelessPropertyWithCustomAttribute() {
    return this.#H;
  }
  set typelessPropertyWithCustomAttribute(v) {
    this.#H = v;
  }
  #I = _init_internalProperty(this);
  set #internalProperty(v) {
    _set_internalProperty(this, v);
  }
  get #internalProperty() {
    return _get_internalProperty(this);
  }
  static template(host) {
    return html`
      <div id="normal">${host.normalProperty}</div>
      <span id="camel">${host.camelCaseProperty}</span>
      <span id="num">${host.numericProperty}</span>
      <span id="nul">${host.nullProperty}</span>
      <span id="undef">${host.undefinedProperty}</span>
    `;
  }
}
customElements.define('test-element-next', TestElementNext);
it('initialization', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('normal').textContent === 'Ferus');
  assert(el.shadowRoot.getElementById('camel').textContent === 'Bactrian');
  assert(el.shadowRoot.getElementById('num').textContent === '10');
  assert(el.shadowRoot.getElementById('nul').textContent === '');
});
it('renders an empty string in place of null value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('nul').textContent === '');
});
it('renders an empty string in place of undefined value', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.shadowRoot.getElementById('undef').textContent === '');
});
it('property setter updates on next micro tick after connect', async () => {
  const el = document.createElement('test-element-next');
  el.camelCaseProperty = 'Nonconforming';

  // Initial render happens synchronously after initial connection.
  document.body.append(el);
  assert(el.shadowRoot.getElementById('camel').textContent === 'Nonconforming');

  // Updates are debounced on a microtask, so they are not immediately seen.
  el.camelCaseProperty = 'Dromedary';
  assert(el.shadowRoot.getElementById('camel').textContent === 'Nonconforming');

  // After the microtask runs, the update is handled.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === 'Dromedary');
});
it('property setter renders blank value', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.camelCaseProperty = '';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === '');
  el.camelCaseProperty = 'Bactrian';

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === 'Bactrian');
});
it('observes all dash-cased versions of public, typeless, serializable, and declared properties', () => {
  const el = document.createElement('test-element-next');
  const expected = ['normal-property', 'camel-case-property', 'numeric-property', 'null-property', 'undefined-property', 'typeless-property', 'custom-attribute-typeless'];
  const actual = el.constructor.observedAttributes;
  assert(expected.length === actual.length);
  assert(expected.every(attribute => actual.includes(attribute)));
});
it('removeAttribute renders blank', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.removeAttribute('camel-case-property');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  // Note, in general, changing non-reflected properties via attributes can
  // be problematic. For example, attributeChangedCallback is not fired if the
  // attribute does not change.
  assert(el.shadowRoot.getElementById('camel').textContent !== '');
  el.setAttribute('camel-case-property', 'foo');
  el.removeAttribute('camel-case-property');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === '');
});
it('setAttribute renders the new value', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.setAttribute('camel-case-property', 'Racing Camel');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('camel').textContent === 'Racing Camel');
});
it('coerces attributes to the specified type', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  el.setAttribute('numeric-property', '-99');
  assert(el.numericProperty === -99);
});
it('allows properties without types', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  for (const value of [{}, 'foo', '5', [], 2]) {
    el.typelessProperty = value;
    assert(el.typelessProperty === value);
  }
});
it('syncs attributes to properties without types', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  const value = '123';
  el.setAttribute('typeless-property', value);
  assert(el.typelessProperty === value);
});
it('initializes from attributes on connect', () => {
  const el = document.createElement('test-element-next');
  el.setAttribute('camel-case-property', 'Dromedary');
  document.body.append(el);
  assert(el.camelCaseProperty === 'Dromedary');
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it('can use "has" api or "in" operator.', () => {
  let _initProto2, _normalPropertyDecs2, _init_normalProperty2;
  class TempTestElement extends XElement {
    static {
      [_init_normalProperty2, _initProto2] = _applyDecs(this, [[_normalPropertyDecs2, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto2(this), _init_normalProperty2(this));
    get [(_normalPropertyDecs2 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      if (!('normalProperty' in host) || Reflect.has(host, 'normalProperty') === false) {
        throw new Error('The "has" trap does not work.');
      }
      return html``;
    }
  }
  customElements.define('temp-test-element-next-1', TempTestElement);
  const el = new TempTestElement();
  let passed = false;
  let message;
  try {
    el.connectedCallback();
    passed = true;
  } catch (error) {
    message = error.message;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, ownKeys doesn’t
//  work because properties are simply on the `host.prototype`.
it.skip('can use "ownKeys" api.', () => {
  let _initProto3, _normalPropertyDecs3, _init_normalProperty3;
  class TempTestElement extends XElement {
    static {
      [_init_normalProperty3, _initProto3] = _applyDecs(this, [[_normalPropertyDecs3, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto3(this), _init_normalProperty3(this));
    get [(_normalPropertyDecs3 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      const ownKeys = Reflect.ownKeys(host);
      if (ownKeys.length !== 1 || ownKeys[0] !== 'normalProperty') {
        throw new Error('The "ownKeys" trap does not work.');
      }
      return html``;
    }
  }
  customElements.define('temp-test-element-next-2', TempTestElement);
  const el = new TempTestElement();
  let passed = false;
  let message;
  try {
    el.connectedCallback();
    passed = true;
  } catch (error) {
    message = error.message;
  }
  assert(passed, message);
});
it('can be read', async () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  assert(el.normalProperty === 'Ferus', 'property was read');
  el.normalProperty = 'Dromedary';
  assert(el.normalProperty === 'Dromedary', 'property was written to');

  // We must await a microtask for the update to take place.
  await Promise.resolve();
  assert(el.shadowRoot.getElementById('normal').textContent === 'Dromedary');
});
it('inheritance is considered in type checking', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  const array = [];
  el.objectProperty = array;
  assert(el.objectProperty === array, 'property was set');
});
it('numeric properties deserialize "" (empty) to "NaN"', () => {
  const el = document.createElement('test-element-next');
  el.setAttribute('numeric-property', '0');
  document.body.append(el);
  assert(el.numericProperty === 0, '"0" was coerced to 0');
  el.setAttribute('numeric-property', '');
  assert(Number.isNaN(el.numericProperty), '"" was coerced to NaN');
  el.setAttribute('numeric-property', ' ');
  assert(Number.isNaN(el.numericProperty), '" " was coerced to NaN');
  el.setAttribute('numeric-property', '      ');
  assert(Number.isNaN(el.numericProperty), '"      " was coerced to NaN');
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, we expect our
//  users to be experts and not update properties in the render loop.
it.skip('cannot set to known properties', () => {
  let _initProto4, _normalPropertyDecs4, _init_normalProperty4;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty4, _initProto4] = _applyDecs(this, [[_normalPropertyDecs4, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto4(this), _init_normalProperty4(this));
    get [(_normalPropertyDecs4 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      host.normalProperty = 'Dromedary';
      return html`<div>${host.normalProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-1', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Cannot set "BadTestElement.properties.normalProperty" via "properties".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, we expect our
//  users to be experts and not update properties in the render loop.
it.skip('cannot set to unknown properties', () => {
  let _initProto5, _normalPropertyDecs5, _init_normalProperty5;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty5, _initProto5] = _applyDecs(this, [[_normalPropertyDecs5, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto5(this), _init_normalProperty5(this));
    get [(_normalPropertyDecs5 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      host.doesNotExist = 'Dromedary';
      return html`<div>${host.normalProperty}</div>`;
    }
  }
  customElements.define('bad-test-element-next-2', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. In this case, we expect our
//  users to be experts and not pull objects which don’t exist (or understand
//  that it doesn’t exist if it is returning “undefined”).
it.skip('cannot get unknown properties', () => {
  let _initProto6, _normalPropertyDecs6, _init_normalProperty6;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty6, _initProto6] = _applyDecs(this, [[_normalPropertyDecs6, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto6(this), _init_normalProperty6(this));
    get [(_normalPropertyDecs6 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      return html`<div>${host.doesNotExist}</div>`;
    }
  }
  customElements.define('bad-test-element-next-3', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Property "BadTestElement.properties.doesNotExist" does not exist.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test internal proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot set on "internal"', () => {
  const el = document.createElement('test-element-next');
  document.body.append(el);
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.internal.normalProperty = 'Dromedary';
  } catch (error) {
    const expected = 'Property "TestElement.properties.normalProperty" is publicly available (use normal setter).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. You can of course define a
//  new property on an instance like this. This would work even if it was truly
//  shadowing an accessor that already exists.
it.skip('cannot "defineProperty" on properties.', () => {
  let _initProto7, _normalPropertyDecs7, _init_normalProperty7;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty7, _initProto7] = _applyDecs(this, [[_normalPropertyDecs7, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto7(this), _init_normalProperty7(this));
    get [(_normalPropertyDecs7 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      Reflect.defineProperty(host, 'foo', {});
      return html``;
    }
  }
  customElements.define('bad-test-element-next-4', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript. You can of course call delete
//  on an instance like this — but, this doesn’t break the accessors in any way.
it.skip('cannot "delete" on properties.', () => {
  let _initProto8, _normalPropertyDecs8, _init_normalProperty8;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty8, _initProto8] = _applyDecs(this, [[_normalPropertyDecs8, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto8(this), _init_normalProperty8(this));
    get [(_normalPropertyDecs8 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      Reflect.deleteProperty(host, 'normalProperty');
      return html``;
    }
  }
  customElements.define('bad-test-element-next-5', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "getOwnPropertyDescriptor" on properties.', () => {
  let _initProto9, _normalPropertyDecs9, _init_normalProperty9;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty9, _initProto9] = _applyDecs(this, [[_normalPropertyDecs9, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto9(this), _init_normalProperty9(this));
    get [(_normalPropertyDecs9 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      Reflect.getOwnPropertyDescriptor(host, 'normalProperty');
      return html``;
    }
  }
  customElements.define('bad-test-element-next-6', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "getPrototypeOf" on properties.', () => {
  let _initProto0, _normalPropertyDecs0, _init_normalProperty0;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty0, _initProto0] = _applyDecs(this, [[_normalPropertyDecs0, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto0(this), _init_normalProperty0(this));
    get [(_normalPropertyDecs0 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      Reflect.getPrototypeOf(host);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-7', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "isExtensible" on properties.', () => {
  let _initProto1, _normalPropertyDecs1, _init_normalProperty1;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty1, _initProto1] = _applyDecs(this, [[_normalPropertyDecs1, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto1(this), _init_normalProperty1(this));
    get [(_normalPropertyDecs1 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      Reflect.isExtensible(host);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-8', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "preventExtensions" on properties.', () => {
  let _initProto10, _normalPropertyDecs10, _init_normalProperty10;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty10, _initProto10] = _applyDecs(this, [[_normalPropertyDecs10, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto10(this), _init_normalProperty10(this));
    get [(_normalPropertyDecs10 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      Reflect.preventExtensions(host);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-9', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: We can likely delete. It used to test properties proxy, but it
//  now just checks basic, idiomatic JavaScript.
it.skip('cannot "setPrototypeOf" on properties.', () => {
  let _initProto11, _normalPropertyDecs11, _init_normalProperty11;
  class BadTestElement extends XElement {
    static {
      [_init_normalProperty11, _initProto11] = _applyDecs(this, [[_normalPropertyDecs11, 1, "normalProperty"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto11(this), _init_normalProperty11(this));
    get [(_normalPropertyDecs11 = property({
      type: String
    }), "normalProperty")]() {
      return this.#A;
    }
    set normalProperty(v) {
      this.#A = v;
    }
    static template(host) {
      Reflect.setPrototypeOf(host, Array);
      return html``;
    }
  }
  customElements.define('bad-test-element-next-10', BadTestElement);
  const el = new BadTestElement();
  let passed = false;
  let message = 'no error was thrown';
  try {
    el.connectedCallback();
  } catch (error) {
    const expected = 'Invalid use of properties proxy.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJodG1sIiwiVGVzdEVsZW1lbnROZXh0IiwiX2luaXRfbm9ybWFsUHJvcGVydHkiLCJfaW5pdF9vYmplY3RQcm9wZXJ0eSIsIl9pbml0X2NhbWVsQ2FzZVByb3BlcnR5IiwiX2luaXRfbnVtZXJpY1Byb3BlcnR5IiwiX2luaXRfbnVsbFByb3BlcnR5IiwiX2luaXRfdW5kZWZpbmVkUHJvcGVydHkiLCJfaW5pdF90eXBlbGVzc1Byb3BlcnR5IiwiX2luaXRfdHlwZWxlc3NQcm9wZXJ0eVdpdGhDdXN0b21BdHRyaWJ1dGUiLCJfaW5pdF9pbnRlcm5hbFByb3BlcnR5IiwiX2dldF9pbnRlcm5hbFByb3BlcnR5IiwiX3NldF9pbnRlcm5hbFByb3BlcnR5IiwiX2luaXRQcm90byIsIl9hcHBseURlY3MiLCJfbm9ybWFsUHJvcGVydHlEZWNzIiwiX29iamVjdFByb3BlcnR5RGVjcyIsIl9jYW1lbENhc2VQcm9wZXJ0eURlY3MiLCJfbnVtZXJpY1Byb3BlcnR5RGVjcyIsIl9udWxsUHJvcGVydHlEZWNzIiwiX3VuZGVmaW5lZFByb3BlcnR5RGVjcyIsIl90eXBlbGVzc1Byb3BlcnR5RGVjcyIsIl90eXBlbGVzc1Byb3BlcnR5V2l0aEN1c3RvbUF0dHJpYnV0ZURlY3MiLCJfaW50ZXJuYWxQcm9wZXJ0eURlY3MiLCJvIiwiSSIsInYiLCJfIiwiaW50ZXJuYWxQcm9wZXJ0eSIsImUiLCJBIiwidHlwZSIsIlN0cmluZyIsImluaXRpYWwiLCJPYmplY3QiLCJOdW1iZXIiLCJkZWZhdWx0IiwiYXR0cmlidXRlIiwibm9ybWFsUHJvcGVydHkiLCJCIiwib2JqZWN0UHJvcGVydHkiLCJDIiwiY2FtZWxDYXNlUHJvcGVydHkiLCJEIiwibnVtZXJpY1Byb3BlcnR5IiwiRSIsIm51bGxQcm9wZXJ0eSIsIkYiLCJ1bmRlZmluZWRQcm9wZXJ0eSIsIkciLCJ0eXBlbGVzc1Byb3BlcnR5IiwiSCIsInR5cGVsZXNzUHJvcGVydHlXaXRoQ3VzdG9tQXR0cmlidXRlIiwiI2ludGVybmFsUHJvcGVydHkiLCJ0ZW1wbGF0ZSIsImhvc3QiLCJjdXN0b21FbGVtZW50cyIsImRlZmluZSIsImVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm9keSIsImFwcGVuZCIsInNoYWRvd1Jvb3QiLCJnZXRFbGVtZW50QnlJZCIsInRleHRDb250ZW50IiwiUHJvbWlzZSIsInJlc29sdmUiLCJleHBlY3RlZCIsImFjdHVhbCIsImNvbnN0cnVjdG9yIiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwibGVuZ3RoIiwiZXZlcnkiLCJpbmNsdWRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInZhbHVlIiwiX2luaXRQcm90bzIiLCJfbm9ybWFsUHJvcGVydHlEZWNzMiIsIl9pbml0X25vcm1hbFByb3BlcnR5MiIsIlRlbXBUZXN0RWxlbWVudCIsIlJlZmxlY3QiLCJoYXMiLCJFcnJvciIsInBhc3NlZCIsIm1lc3NhZ2UiLCJjb25uZWN0ZWRDYWxsYmFjayIsImVycm9yIiwic2tpcCIsIl9pbml0UHJvdG8zIiwiX25vcm1hbFByb3BlcnR5RGVjczMiLCJfaW5pdF9ub3JtYWxQcm9wZXJ0eTMiLCJvd25LZXlzIiwiYXJyYXkiLCJpc05hTiIsIl9pbml0UHJvdG80IiwiX25vcm1hbFByb3BlcnR5RGVjczQiLCJfaW5pdF9ub3JtYWxQcm9wZXJ0eTQiLCJCYWRUZXN0RWxlbWVudCIsIl9pbml0UHJvdG81IiwiX25vcm1hbFByb3BlcnR5RGVjczUiLCJfaW5pdF9ub3JtYWxQcm9wZXJ0eTUiLCJkb2VzTm90RXhpc3QiLCJfaW5pdFByb3RvNiIsIl9ub3JtYWxQcm9wZXJ0eURlY3M2IiwiX2luaXRfbm9ybWFsUHJvcGVydHk2IiwiaW50ZXJuYWwiLCJfaW5pdFByb3RvNyIsIl9ub3JtYWxQcm9wZXJ0eURlY3M3IiwiX2luaXRfbm9ybWFsUHJvcGVydHk3IiwiZGVmaW5lUHJvcGVydHkiLCJfaW5pdFByb3RvOCIsIl9ub3JtYWxQcm9wZXJ0eURlY3M4IiwiX2luaXRfbm9ybWFsUHJvcGVydHk4IiwiZGVsZXRlUHJvcGVydHkiLCJfaW5pdFByb3RvOSIsIl9ub3JtYWxQcm9wZXJ0eURlY3M5IiwiX2luaXRfbm9ybWFsUHJvcGVydHk5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiX2luaXRQcm90bzAiLCJfbm9ybWFsUHJvcGVydHlEZWNzMCIsIl9pbml0X25vcm1hbFByb3BlcnR5MCIsImdldFByb3RvdHlwZU9mIiwiX2luaXRQcm90bzEiLCJfbm9ybWFsUHJvcGVydHlEZWNzMSIsIl9pbml0X25vcm1hbFByb3BlcnR5MSIsImlzRXh0ZW5zaWJsZSIsIl9pbml0UHJvdG8xMCIsIl9ub3JtYWxQcm9wZXJ0eURlY3MxMCIsIl9pbml0X25vcm1hbFByb3BlcnR5MTAiLCJwcmV2ZW50RXh0ZW5zaW9ucyIsIl9pbml0UHJvdG8xMSIsIl9ub3JtYWxQcm9wZXJ0eURlY3MxMSIsIl9pbml0X25vcm1hbFByb3BlcnR5MTEiLCJzZXRQcm90b3R5cGVPZiIsIkFycmF5Il0sInNvdXJjZXMiOlsidGVzdC1iYXNpYy1wcm9wZXJ0aWVzLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHksIGh0bWwgfSBmcm9tICcuLi94LWVsZW1lbnQtbmV4dC5qcyc7XG5cbmNsYXNzIFRlc3RFbGVtZW50TmV4dCBleHRlbmRzIFhFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAnRmVydXMnIH0pXG4gIGFjY2Vzc29yIG5vcm1hbFByb3BlcnR5O1xuXG4gIEBwcm9wZXJ0eSh7IHR5cGU6IE9iamVjdCB9KVxuICBhY2Nlc3NvciBvYmplY3RQcm9wZXJ0eTtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICdCYWN0cmlhbicgfSlcbiAgYWNjZXNzb3IgY2FtZWxDYXNlUHJvcGVydHk7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0OiAxMCB9KVxuICBhY2Nlc3NvciBudW1lcmljUHJvcGVydHk7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBudWxsIH0pXG4gIGFjY2Vzc29yIG51bGxQcm9wZXJ0eTtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgYWNjZXNzb3IgdW5kZWZpbmVkUHJvcGVydHk7XG5cbiAgQHByb3BlcnR5KHt9KVxuICBhY2Nlc3NvciB0eXBlbGVzc1Byb3BlcnR5O1xuXG4gIEBwcm9wZXJ0eSh7IGF0dHJpYnV0ZTogJ2N1c3RvbS1hdHRyaWJ1dGUtdHlwZWxlc3MnIH0pXG4gIGFjY2Vzc29yIHR5cGVsZXNzUHJvcGVydHlXaXRoQ3VzdG9tQXR0cmlidXRlO1xuXG4gIEBwcm9wZXJ0eSh7fSlcbiAgYWNjZXNzb3IgI2ludGVybmFsUHJvcGVydHk7XG5cbiAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICByZXR1cm4gaHRtbGBcbiAgICAgIDxkaXYgaWQ9XCJub3JtYWxcIj4ke2hvc3Qubm9ybWFsUHJvcGVydHl9PC9kaXY+XG4gICAgICA8c3BhbiBpZD1cImNhbWVsXCI+JHtob3N0LmNhbWVsQ2FzZVByb3BlcnR5fTwvc3Bhbj5cbiAgICAgIDxzcGFuIGlkPVwibnVtXCI+JHtob3N0Lm51bWVyaWNQcm9wZXJ0eX08L3NwYW4+XG4gICAgICA8c3BhbiBpZD1cIm51bFwiPiR7aG9zdC5udWxsUHJvcGVydHl9PC9zcGFuPlxuICAgICAgPHNwYW4gaWQ9XCJ1bmRlZlwiPiR7aG9zdC51bmRlZmluZWRQcm9wZXJ0eX08L3NwYW4+XG4gICAgYDtcbiAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtbmV4dCcsIFRlc3RFbGVtZW50TmV4dCk7XG5cbml0KCdpbml0aWFsaXphdGlvbicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdub3JtYWwnKS50ZXh0Q29udGVudCA9PT0gJ0ZlcnVzJyk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdjYW1lbCcpLnRleHRDb250ZW50ID09PSAnQmFjdHJpYW4nKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ251bScpLnRleHRDb250ZW50ID09PSAnMTAnKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ251bCcpLnRleHRDb250ZW50ID09PSAnJyk7XG59KTtcblxuaXQoJ3JlbmRlcnMgYW4gZW1wdHkgc3RyaW5nIGluIHBsYWNlIG9mIG51bGwgdmFsdWUnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnbnVsJykudGV4dENvbnRlbnQgPT09ICcnKTtcbn0pO1xuXG5pdCgncmVuZGVycyBhbiBlbXB0eSBzdHJpbmcgaW4gcGxhY2Ugb2YgdW5kZWZpbmVkIHZhbHVlJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ3VuZGVmJykudGV4dENvbnRlbnQgPT09ICcnKTtcbn0pO1xuXG5pdCgncHJvcGVydHkgc2V0dGVyIHVwZGF0ZXMgb24gbmV4dCBtaWNybyB0aWNrIGFmdGVyIGNvbm5lY3QnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZWwuY2FtZWxDYXNlUHJvcGVydHkgPSAnTm9uY29uZm9ybWluZyc7XG5cbiAgLy8gSW5pdGlhbCByZW5kZXIgaGFwcGVucyBzeW5jaHJvbm91c2x5IGFmdGVyIGluaXRpYWwgY29ubmVjdGlvbi5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnY2FtZWwnKS50ZXh0Q29udGVudCA9PT0gJ05vbmNvbmZvcm1pbmcnKTtcblxuICAvLyBVcGRhdGVzIGFyZSBkZWJvdW5jZWQgb24gYSBtaWNyb3Rhc2ssIHNvIHRoZXkgYXJlIG5vdCBpbW1lZGlhdGVseSBzZWVuLlxuICBlbC5jYW1lbENhc2VQcm9wZXJ0eSA9ICdEcm9tZWRhcnknO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnY2FtZWwnKS50ZXh0Q29udGVudCA9PT0gJ05vbmNvbmZvcm1pbmcnKTtcblxuICAvLyBBZnRlciB0aGUgbWljcm90YXNrIHJ1bnMsIHRoZSB1cGRhdGUgaXMgaGFuZGxlZC5cbiAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGFzc2VydChlbC5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdjYW1lbCcpLnRleHRDb250ZW50ID09PSAnRHJvbWVkYXJ5Jyk7XG59KTtcblxuaXQoJ3Byb3BlcnR5IHNldHRlciByZW5kZXJzIGJsYW5rIHZhbHVlJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgZWwuY2FtZWxDYXNlUHJvcGVydHkgPSAnJztcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnY2FtZWwnKS50ZXh0Q29udGVudCA9PT0gJycpO1xuICBlbC5jYW1lbENhc2VQcm9wZXJ0eSA9ICdCYWN0cmlhbic7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2NhbWVsJykudGV4dENvbnRlbnQgPT09ICdCYWN0cmlhbicpO1xufSk7XG5cbml0KCdvYnNlcnZlcyBhbGwgZGFzaC1jYXNlZCB2ZXJzaW9ucyBvZiBwdWJsaWMsIHR5cGVsZXNzLCBzZXJpYWxpemFibGUsIGFuZCBkZWNsYXJlZCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICdub3JtYWwtcHJvcGVydHknLFxuICAgICdjYW1lbC1jYXNlLXByb3BlcnR5JyxcbiAgICAnbnVtZXJpYy1wcm9wZXJ0eScsXG4gICAgJ251bGwtcHJvcGVydHknLFxuICAgICd1bmRlZmluZWQtcHJvcGVydHknLFxuICAgICd0eXBlbGVzcy1wcm9wZXJ0eScsXG4gICAgJ2N1c3RvbS1hdHRyaWJ1dGUtdHlwZWxlc3MnLFxuICBdO1xuICBjb25zdCBhY3R1YWwgPSBlbC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG4gIGFzc2VydChleHBlY3RlZC5sZW5ndGggPT09IGFjdHVhbC5sZW5ndGgpO1xuICBhc3NlcnQoZXhwZWN0ZWQuZXZlcnkoYXR0cmlidXRlID0+IGFjdHVhbC5pbmNsdWRlcyhhdHRyaWJ1dGUpKSk7XG59KTtcblxuaXQoJ3JlbW92ZUF0dHJpYnV0ZSByZW5kZXJzIGJsYW5rJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgZWwucmVtb3ZlQXR0cmlidXRlKCdjYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgLy8gTm90ZSwgaW4gZ2VuZXJhbCwgY2hhbmdpbmcgbm9uLXJlZmxlY3RlZCBwcm9wZXJ0aWVzIHZpYSBhdHRyaWJ1dGVzIGNhblxuICAvLyBiZSBwcm9ibGVtYXRpYy4gRm9yIGV4YW1wbGUsIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayBpcyBub3QgZmlyZWQgaWYgdGhlXG4gIC8vIGF0dHJpYnV0ZSBkb2VzIG5vdCBjaGFuZ2UuXG4gIGFzc2VydChlbC5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdjYW1lbCcpLnRleHRDb250ZW50ICE9PSAnJyk7XG4gIGVsLnNldEF0dHJpYnV0ZSgnY2FtZWwtY2FzZS1wcm9wZXJ0eScsICdmb28nKTtcbiAgZWwucmVtb3ZlQXR0cmlidXRlKCdjYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2NhbWVsJykudGV4dENvbnRlbnQgPT09ICcnKTtcbn0pO1xuXG5pdCgnc2V0QXR0cmlidXRlIHJlbmRlcnMgdGhlIG5ldyB2YWx1ZScsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGVsLnNldEF0dHJpYnV0ZSgnY2FtZWwtY2FzZS1wcm9wZXJ0eScsICdSYWNpbmcgQ2FtZWwnKTtcblxuICAvLyBXZSBtdXN0IGF3YWl0IGEgbWljcm90YXNrIGZvciB0aGUgdXBkYXRlIHRvIHRha2UgcGxhY2UuXG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuICBhc3NlcnQoZWwuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnY2FtZWwnKS50ZXh0Q29udGVudCA9PT0gJ1JhY2luZyBDYW1lbCcpO1xufSk7XG5cbml0KCdjb2VyY2VzIGF0dHJpYnV0ZXMgdG8gdGhlIHNwZWNpZmllZCB0eXBlJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgZWwuc2V0QXR0cmlidXRlKCdudW1lcmljLXByb3BlcnR5JywgJy05OScpO1xuICBhc3NlcnQoZWwubnVtZXJpY1Byb3BlcnR5ID09PSAtOTkpO1xufSk7XG5cbml0KCdhbGxvd3MgcHJvcGVydGllcyB3aXRob3V0IHR5cGVzJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiBbe30sICdmb28nLCAnNScsIFtdLCAyXSkge1xuICAgIGVsLnR5cGVsZXNzUHJvcGVydHkgPSB2YWx1ZTtcbiAgICBhc3NlcnQoZWwudHlwZWxlc3NQcm9wZXJ0eSA9PT0gdmFsdWUpO1xuICB9XG59KTtcblxuaXQoJ3N5bmNzIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllcyB3aXRob3V0IHR5cGVzJywgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgY29uc3QgdmFsdWUgPSAnMTIzJztcbiAgZWwuc2V0QXR0cmlidXRlKCd0eXBlbGVzcy1wcm9wZXJ0eScsIHZhbHVlKTtcbiAgYXNzZXJ0KGVsLnR5cGVsZXNzUHJvcGVydHkgPT09IHZhbHVlKTtcbn0pO1xuXG5pdCgnaW5pdGlhbGl6ZXMgZnJvbSBhdHRyaWJ1dGVzIG9uIGNvbm5lY3QnLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZWwuc2V0QXR0cmlidXRlKCdjYW1lbC1jYXNlLXByb3BlcnR5JywgJ0Ryb21lZGFyeScpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5jYW1lbENhc2VQcm9wZXJ0eSA9PT0gJ0Ryb21lZGFyeScpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgcHJvcGVydGllcyBwcm94eSwgYnV0IGl0XG4vLyAgbm93IGp1c3QgY2hlY2tzIGJhc2ljLCBpZGlvbWF0aWMgSmF2YVNjcmlwdC5cbml0KCdjYW4gdXNlIFwiaGFzXCIgYXBpIG9yIFwiaW5cIiBvcGVyYXRvci4nLCAoKSA9PiB7XG4gIGNsYXNzIFRlbXBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICBhY2Nlc3NvciBub3JtYWxQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBpZiAoISgnbm9ybWFsUHJvcGVydHknIGluIGhvc3QpIHx8IFJlZmxlY3QuaGFzKGhvc3QsICdub3JtYWxQcm9wZXJ0eScpID09PSBmYWxzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImhhc1wiIHRyYXAgZG9lcyBub3Qgd29yay4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBodG1sYGA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVtcC10ZXN0LWVsZW1lbnQtbmV4dC0xJywgVGVtcFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgVGVtcFRlc3RFbGVtZW50KCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2U7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICBwYXNzZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgcHJvcGVydGllcyBwcm94eSwgYnV0IGl0XG4vLyAgbm93IGp1c3QgY2hlY2tzIGJhc2ljLCBpZGlvbWF0aWMgSmF2YVNjcmlwdC4gSW4gdGhpcyBjYXNlLCBvd25LZXlzIGRvZXNu4oCZdFxuLy8gIHdvcmsgYmVjYXVzZSBwcm9wZXJ0aWVzIGFyZSBzaW1wbHkgb24gdGhlIGBob3N0LnByb3RvdHlwZWAuXG5pdC5za2lwKCdjYW4gdXNlIFwib3duS2V5c1wiIGFwaS4nLCAoKSA9PiB7XG4gIGNsYXNzIFRlbXBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICBhY2Nlc3NvciBub3JtYWxQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBjb25zdCBvd25LZXlzID0gUmVmbGVjdC5vd25LZXlzKGhvc3QpO1xuICAgICAgaWYgKG93bktleXMubGVuZ3RoICE9PSAxIHx8IG93bktleXNbMF0gIT09ICdub3JtYWxQcm9wZXJ0eScpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJvd25LZXlzXCIgdHJhcCBkb2VzIG5vdCB3b3JrLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGh0bWxgYDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZW1wLXRlc3QtZWxlbWVudC1uZXh0LTInLCBUZW1wVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBUZW1wVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZTtcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgIHBhc3NlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2NhbiBiZSByZWFkJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtZWxlbWVudC1uZXh0Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGVsKTtcbiAgYXNzZXJ0KGVsLm5vcm1hbFByb3BlcnR5ID09PSAnRmVydXMnLCAncHJvcGVydHkgd2FzIHJlYWQnKTtcbiAgZWwubm9ybWFsUHJvcGVydHkgPSAnRHJvbWVkYXJ5JztcbiAgYXNzZXJ0KGVsLm5vcm1hbFByb3BlcnR5ID09PSAnRHJvbWVkYXJ5JywgJ3Byb3BlcnR5IHdhcyB3cml0dGVuIHRvJyk7XG5cbiAgLy8gV2UgbXVzdCBhd2FpdCBhIG1pY3JvdGFzayBmb3IgdGhlIHVwZGF0ZSB0byB0YWtlIHBsYWNlLlxuICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgYXNzZXJ0KGVsLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ25vcm1hbCcpLnRleHRDb250ZW50ID09PSAnRHJvbWVkYXJ5Jyk7XG59KTtcblxuaXQoJ2luaGVyaXRhbmNlIGlzIGNvbnNpZGVyZWQgaW4gdHlwZSBjaGVja2luZycsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGVsLm9iamVjdFByb3BlcnR5ID0gYXJyYXk7XG4gIGFzc2VydChlbC5vYmplY3RQcm9wZXJ0eSA9PT0gYXJyYXksICdwcm9wZXJ0eSB3YXMgc2V0Jyk7XG59KTtcblxuaXQoJ251bWVyaWMgcHJvcGVydGllcyBkZXNlcmlhbGl6ZSBcIlwiIChlbXB0eSkgdG8gXCJOYU5cIicsICgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWVsZW1lbnQtbmV4dCcpO1xuICBlbC5zZXRBdHRyaWJ1dGUoJ251bWVyaWMtcHJvcGVydHknLCAnMCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChlbCk7XG4gIGFzc2VydChlbC5udW1lcmljUHJvcGVydHkgPT09IDAsICdcIjBcIiB3YXMgY29lcmNlZCB0byAwJyk7XG4gIGVsLnNldEF0dHJpYnV0ZSgnbnVtZXJpYy1wcm9wZXJ0eScsICcnKTtcbiAgYXNzZXJ0KE51bWJlci5pc05hTihlbC5udW1lcmljUHJvcGVydHkpLCAnXCJcIiB3YXMgY29lcmNlZCB0byBOYU4nKTtcbiAgZWwuc2V0QXR0cmlidXRlKCdudW1lcmljLXByb3BlcnR5JywgJyAnKTtcbiAgYXNzZXJ0KE51bWJlci5pc05hTihlbC5udW1lcmljUHJvcGVydHkpLCAnXCIgXCIgd2FzIGNvZXJjZWQgdG8gTmFOJyk7XG4gIGVsLnNldEF0dHJpYnV0ZSgnbnVtZXJpYy1wcm9wZXJ0eScsICcgICAgICAnKTtcbiAgYXNzZXJ0KE51bWJlci5pc05hTihlbC5udW1lcmljUHJvcGVydHkpLCAnXCIgICAgICBcIiB3YXMgY29lcmNlZCB0byBOYU4nKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IHByb3BlcnRpZXMgcHJveHksIGJ1dCBpdFxuLy8gIG5vdyBqdXN0IGNoZWNrcyBiYXNpYywgaWRpb21hdGljIEphdmFTY3JpcHQuIEluIHRoaXMgY2FzZSwgd2UgZXhwZWN0IG91clxuLy8gIHVzZXJzIHRvIGJlIGV4cGVydHMgYW5kIG5vdCB1cGRhdGUgcHJvcGVydGllcyBpbiB0aGUgcmVuZGVyIGxvb3AuXG5pdC5za2lwKCdjYW5ub3Qgc2V0IHRvIGtub3duIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIGNsYXNzIEJhZFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZyB9KVxuICAgIGFjY2Vzc29yIG5vcm1hbFByb3BlcnR5O1xuXG4gICAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICAgIGhvc3Qubm9ybWFsUHJvcGVydHkgPSAnRHJvbWVkYXJ5JztcbiAgICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0Lm5vcm1hbFByb3BlcnR5fTwvZGl2PmA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFkLXRlc3QtZWxlbWVudC1uZXh0LTEnLCBCYWRUZXN0RWxlbWVudCk7XG4gIGNvbnN0IGVsID0gbmV3IEJhZFRlc3RFbGVtZW50KCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdDYW5ub3Qgc2V0IFwiQmFkVGVzdEVsZW1lbnQucHJvcGVydGllcy5ub3JtYWxQcm9wZXJ0eVwiIHZpYSBcInByb3BlcnRpZXNcIi4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgcHJvcGVydGllcyBwcm94eSwgYnV0IGl0XG4vLyAgbm93IGp1c3QgY2hlY2tzIGJhc2ljLCBpZGlvbWF0aWMgSmF2YVNjcmlwdC4gSW4gdGhpcyBjYXNlLCB3ZSBleHBlY3Qgb3VyXG4vLyAgdXNlcnMgdG8gYmUgZXhwZXJ0cyBhbmQgbm90IHVwZGF0ZSBwcm9wZXJ0aWVzIGluIHRoZSByZW5kZXIgbG9vcC5cbml0LnNraXAoJ2Nhbm5vdCBzZXQgdG8gdW5rbm93biBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICBjbGFzcyBCYWRUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICBhY2Nlc3NvciBub3JtYWxQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBob3N0LmRvZXNOb3RFeGlzdCA9ICdEcm9tZWRhcnknO1xuICAgICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3Qubm9ybWFsUHJvcGVydHl9PC9kaXY+YDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdiYWQtdGVzdC1lbGVtZW50LW5leHQtMicsIEJhZFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgQmFkVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1Byb3BlcnR5IFwiQmFkVGVzdEVsZW1lbnQucHJvcGVydGllcy5kb2VzTm90RXhpc3RcIiBkb2VzIG5vdCBleGlzdC4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgcHJvcGVydGllcyBwcm94eSwgYnV0IGl0XG4vLyAgbm93IGp1c3QgY2hlY2tzIGJhc2ljLCBpZGlvbWF0aWMgSmF2YVNjcmlwdC4gSW4gdGhpcyBjYXNlLCB3ZSBleHBlY3Qgb3VyXG4vLyAgdXNlcnMgdG8gYmUgZXhwZXJ0cyBhbmQgbm90IHB1bGwgb2JqZWN0cyB3aGljaCBkb27igJl0IGV4aXN0IChvciB1bmRlcnN0YW5kXG4vLyAgdGhhdCBpdCBkb2VzbuKAmXQgZXhpc3QgaWYgaXQgaXMgcmV0dXJuaW5nIOKAnHVuZGVmaW5lZOKAnSkuXG5pdC5za2lwKCdjYW5ub3QgZ2V0IHVua25vd24gcHJvcGVydGllcycsICgpID0+IHtcbiAgY2xhc3MgQmFkVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nIH0pXG4gICAgYWNjZXNzb3Igbm9ybWFsUHJvcGVydHk7XG5cbiAgICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3QuZG9lc05vdEV4aXN0fTwvZGl2PmA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFkLXRlc3QtZWxlbWVudC1uZXh0LTMnLCBCYWRUZXN0RWxlbWVudCk7XG4gIGNvbnN0IGVsID0gbmV3IEJhZFRlc3RFbGVtZW50KCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdQcm9wZXJ0eSBcIkJhZFRlc3RFbGVtZW50LnByb3BlcnRpZXMuZG9lc05vdEV4aXN0XCIgZG9lcyBub3QgZXhpc3QuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IGludGVybmFsIHByb3h5LCBidXQgaXRcbi8vICBub3cganVzdCBjaGVja3MgYmFzaWMsIGlkaW9tYXRpYyBKYXZhU2NyaXB0LlxuaXQuc2tpcCgnY2Fubm90IHNldCBvbiBcImludGVybmFsXCInLCAoKSA9PiB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1lbGVtZW50LW5leHQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZWwpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmludGVybmFsLm5vcm1hbFByb3BlcnR5ID0gJ0Ryb21lZGFyeSc7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnUHJvcGVydHkgXCJUZXN0RWxlbWVudC5wcm9wZXJ0aWVzLm5vcm1hbFByb3BlcnR5XCIgaXMgcHVibGljbHkgYXZhaWxhYmxlICh1c2Ugbm9ybWFsIHNldHRlcikuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IHByb3BlcnRpZXMgcHJveHksIGJ1dCBpdFxuLy8gIG5vdyBqdXN0IGNoZWNrcyBiYXNpYywgaWRpb21hdGljIEphdmFTY3JpcHQuIFlvdSBjYW4gb2YgY291cnNlIGRlZmluZSBhXG4vLyAgbmV3IHByb3BlcnR5IG9uIGFuIGluc3RhbmNlIGxpa2UgdGhpcy4gVGhpcyB3b3VsZCB3b3JrIGV2ZW4gaWYgaXQgd2FzIHRydWx5XG4vLyAgc2hhZG93aW5nIGFuIGFjY2Vzc29yIHRoYXQgYWxyZWFkeSBleGlzdHMuXG5pdC5za2lwKCdjYW5ub3QgXCJkZWZpbmVQcm9wZXJ0eVwiIG9uIHByb3BlcnRpZXMuJywgKCkgPT4ge1xuICBjbGFzcyBCYWRUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICBhY2Nlc3NvciBub3JtYWxQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGhvc3QsICdmb28nLCB7fSk7XG4gICAgICByZXR1cm4gaHRtbGBgO1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ2JhZC10ZXN0LWVsZW1lbnQtbmV4dC00JywgQmFkVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBCYWRUZXN0RWxlbWVudCgpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnSW52YWxpZCB1c2Ugb2YgcHJvcGVydGllcyBwcm94eS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgcHJvcGVydGllcyBwcm94eSwgYnV0IGl0XG4vLyAgbm93IGp1c3QgY2hlY2tzIGJhc2ljLCBpZGlvbWF0aWMgSmF2YVNjcmlwdC4gWW91IGNhbiBvZiBjb3Vyc2UgY2FsbCBkZWxldGVcbi8vICBvbiBhbiBpbnN0YW5jZSBsaWtlIHRoaXMg4oCUIGJ1dCwgdGhpcyBkb2VzbuKAmXQgYnJlYWsgdGhlIGFjY2Vzc29ycyBpbiBhbnkgd2F5LlxuaXQuc2tpcCgnY2Fubm90IFwiZGVsZXRlXCIgb24gcHJvcGVydGllcy4nLCAoKSA9PiB7XG4gIGNsYXNzIEJhZFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZyB9KVxuICAgIGFjY2Vzc29yIG5vcm1hbFByb3BlcnR5O1xuXG4gICAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICAgIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoaG9zdCwgJ25vcm1hbFByb3BlcnR5Jyk7XG4gICAgICByZXR1cm4gaHRtbGBgO1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ2JhZC10ZXN0LWVsZW1lbnQtbmV4dC01JywgQmFkVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBCYWRUZXN0RWxlbWVudCgpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnSW52YWxpZCB1c2Ugb2YgcHJvcGVydGllcyBwcm94eS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFdlIGNhbiBsaWtlbHkgZGVsZXRlLiBJdCB1c2VkIHRvIHRlc3QgcHJvcGVydGllcyBwcm94eSwgYnV0IGl0XG4vLyAgbm93IGp1c3QgY2hlY2tzIGJhc2ljLCBpZGlvbWF0aWMgSmF2YVNjcmlwdC5cbml0LnNraXAoJ2Nhbm5vdCBcImdldE93blByb3BlcnR5RGVzY3JpcHRvclwiIG9uIHByb3BlcnRpZXMuJywgKCkgPT4ge1xuICBjbGFzcyBCYWRUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICBhY2Nlc3NvciBub3JtYWxQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihob3N0LCAnbm9ybWFsUHJvcGVydHknKTtcbiAgICAgIHJldHVybiBodG1sYGA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFkLXRlc3QtZWxlbWVudC1uZXh0LTYnLCBCYWRUZXN0RWxlbWVudCk7XG4gIGNvbnN0IGVsID0gbmV3IEJhZFRlc3RFbGVtZW50KCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdJbnZhbGlkIHVzZSBvZiBwcm9wZXJ0aWVzIHByb3h5Lic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBwcm9wZXJ0aWVzIHByb3h5LCBidXQgaXRcbi8vICBub3cganVzdCBjaGVja3MgYmFzaWMsIGlkaW9tYXRpYyBKYXZhU2NyaXB0LlxuaXQuc2tpcCgnY2Fubm90IFwiZ2V0UHJvdG90eXBlT2ZcIiBvbiBwcm9wZXJ0aWVzLicsICgpID0+IHtcbiAgY2xhc3MgQmFkVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nIH0pXG4gICAgYWNjZXNzb3Igbm9ybWFsUHJvcGVydHk7XG5cbiAgICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgICAgUmVmbGVjdC5nZXRQcm90b3R5cGVPZihob3N0KTtcbiAgICAgIHJldHVybiBodG1sYGA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFkLXRlc3QtZWxlbWVudC1uZXh0LTcnLCBCYWRUZXN0RWxlbWVudCk7XG4gIGNvbnN0IGVsID0gbmV3IEJhZFRlc3RFbGVtZW50KCk7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgZWwuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdJbnZhbGlkIHVzZSBvZiBwcm9wZXJ0aWVzIHByb3h5Lic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogV2UgY2FuIGxpa2VseSBkZWxldGUuIEl0IHVzZWQgdG8gdGVzdCBwcm9wZXJ0aWVzIHByb3h5LCBidXQgaXRcbi8vICBub3cganVzdCBjaGVja3MgYmFzaWMsIGlkaW9tYXRpYyBKYXZhU2NyaXB0LlxuaXQuc2tpcCgnY2Fubm90IFwiaXNFeHRlbnNpYmxlXCIgb24gcHJvcGVydGllcy4nLCAoKSA9PiB7XG4gIGNsYXNzIEJhZFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZyB9KVxuICAgIGFjY2Vzc29yIG5vcm1hbFByb3BlcnR5O1xuXG4gICAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICAgIFJlZmxlY3QuaXNFeHRlbnNpYmxlKGhvc3QpO1xuICAgICAgcmV0dXJuIGh0bWxgYDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdiYWQtdGVzdC1lbGVtZW50LW5leHQtOCcsIEJhZFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgQmFkVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ0ludmFsaWQgdXNlIG9mIHByb3BlcnRpZXMgcHJveHkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IHByb3BlcnRpZXMgcHJveHksIGJ1dCBpdFxuLy8gIG5vdyBqdXN0IGNoZWNrcyBiYXNpYywgaWRpb21hdGljIEphdmFTY3JpcHQuXG5pdC5za2lwKCdjYW5ub3QgXCJwcmV2ZW50RXh0ZW5zaW9uc1wiIG9uIHByb3BlcnRpZXMuJywgKCkgPT4ge1xuICBjbGFzcyBCYWRUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICBhY2Nlc3NvciBub3JtYWxQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKGhvc3QpO1xuICAgICAgcmV0dXJuIGh0bWxgYDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdiYWQtdGVzdC1lbGVtZW50LW5leHQtOScsIEJhZFRlc3RFbGVtZW50KTtcbiAgY29uc3QgZWwgPSBuZXcgQmFkVGVzdEVsZW1lbnQoKTtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBlbC5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ0ludmFsaWQgdXNlIG9mIHByb3BlcnRpZXMgcHJveHkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBXZSBjYW4gbGlrZWx5IGRlbGV0ZS4gSXQgdXNlZCB0byB0ZXN0IHByb3BlcnRpZXMgcHJveHksIGJ1dCBpdFxuLy8gIG5vdyBqdXN0IGNoZWNrcyBiYXNpYywgaWRpb21hdGljIEphdmFTY3JpcHQuXG5pdC5za2lwKCdjYW5ub3QgXCJzZXRQcm90b3R5cGVPZlwiIG9uIHByb3BlcnRpZXMuJywgKCkgPT4ge1xuICBjbGFzcyBCYWRUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICBhY2Nlc3NvciBub3JtYWxQcm9wZXJ0eTtcblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICBSZWZsZWN0LnNldFByb3RvdHlwZU9mKGhvc3QsIEFycmF5KTtcbiAgICAgIHJldHVybiBodG1sYGA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFkLXRlc3QtZWxlbWVudC1uZXh0LTEwJywgQmFkVGVzdEVsZW1lbnQpO1xuICBjb25zdCBlbCA9IG5ldyBCYWRUZXN0RWxlbWVudCgpO1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGVsLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnSW52YWxpZCB1c2Ugb2YgcHJvcGVydGllcyBwcm94eS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFNBQVNBLE1BQU0sRUFBRUMsRUFBRSxRQUFRLDJCQUEyQjtBQUN0RCxTQUFTQyxRQUFRLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxRQUFRLHNCQUFzQjtBQUUvRCxNQUFNQyxlQUFlLFNBQVNILFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQUksb0JBQUEsRUFBQUMsb0JBQUEsRUFBQUMsdUJBQUEsRUFBQUMscUJBQUEsRUFBQUMsa0JBQUEsRUFBQUMsdUJBQUEsRUFBQUMsc0JBQUEsRUFBQUMseUNBQUEsRUFBQUMsc0JBQUEsRUFBQUMscUJBQUEsRUFBQUMscUJBQUEsRUFBQUMsVUFBQSxJQUFBQyxVQUFBLFNBQUFDLG1CQUFBLHlCQUFBQyxtQkFBQSx5QkFBQUMsc0JBQUEsNEJBQUFDLG9CQUFBLDBCQUFBQyxpQkFBQSx1QkFBQUMsc0JBQUEsNEJBQUFDLHFCQUFBLDJCQUFBQyx3Q0FBQSw4Q0FBQUMscUJBQUEseUJBQUFDLENBQUEsSUFBQUEsQ0FBQSxFQUFBQyxDQUFBLEdBQUFELENBQUEsRUFBQUUsQ0FBQSxLQUFBRixDQUFBLEVBQUFDLENBQUEsR0FBQUMsQ0FBQSxXQUFBQyxDQUFBLElBMEI1QixDQUFDQyxnQkFBZ0IsSUFBQUQsQ0FBQSxFQTFCRTdCLFFBQVEsRUFBQStCLENBQUE7RUFBQTtFQUFBLENBQUFDLENBQUEsSUFBQWpCLFVBQUEsUUFBQVgsb0JBQUE7RUFBQSxNQUFBYSxtQkFBQSxHQUNuQ2hCLFFBQVEsQ0FBQztJQUFFZ0MsSUFBSSxFQUFFQyxNQUFNO0lBQUVDLE9BQU8sRUFBRTtFQUFRLENBQUMsQ0FBQyxFQUFBakIsbUJBQUEsR0FHNUNqQixRQUFRLENBQUM7SUFBRWdDLElBQUksRUFBRUc7RUFBTyxDQUFDLENBQUMsRUFBQWpCLHNCQUFBLEdBRzFCbEIsUUFBUSxDQUFDO0lBQUVnQyxJQUFJLEVBQUVDLE1BQU07SUFBRUMsT0FBTyxFQUFFO0VBQVcsQ0FBQyxDQUFDLEVBQUFmLG9CQUFBLEdBRy9DbkIsUUFBUSxDQUFDO0lBQUVnQyxJQUFJLEVBQUVJLE1BQU07SUFBRUMsT0FBTyxFQUFFO0VBQUcsQ0FBQyxDQUFDLEVBQUFqQixpQkFBQSxHQUd2Q3BCLFFBQVEsQ0FBQztJQUFFZ0MsSUFBSSxFQUFFQyxNQUFNO0lBQUVJLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxFQUFBaEIsc0JBQUEsR0FHekNyQixRQUFRLENBQUM7SUFBRWdDLElBQUksRUFBRUM7RUFBTyxDQUFDLENBQUMsRUFBQVgscUJBQUEsR0FHMUJ0QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQXVCLHdDQUFBLEdBR1p2QixRQUFRLENBQUM7SUFBRXNDLFNBQVMsRUFBRTtFQUE0QixDQUFDLENBQUMsRUFBQWQscUJBQUEsR0FHcER4QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBQSxhQUFBK0IsQ0FBQTtFQUFBO0VBQUEsSUF2QkpRLGNBQWNBLENBQUFaLENBQUE7SUFBQSxNQUFBSSxDQUFBLEdBQUFKLENBQUE7RUFBQTtFQUFBLENBQUFhLENBQUEsR0FBQXBDLG9CQUFBO0VBQUEsSUFHZHFDLGNBQWNBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFkQyxjQUFjQSxDQUFBZCxDQUFBO0lBQUEsTUFBQWEsQ0FBQSxHQUFBYixDQUFBO0VBQUE7RUFBQSxDQUFBZSxDQUFBLEdBQUFyQyx1QkFBQTtFQUFBLElBR2RzQyxpQkFBaUJBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFqQkMsaUJBQWlCQSxDQUFBaEIsQ0FBQTtJQUFBLE1BQUFlLENBQUEsR0FBQWYsQ0FBQTtFQUFBO0VBQUEsQ0FBQWlCLENBQUEsR0FBQXRDLHFCQUFBO0VBQUEsSUFHakJ1QyxlQUFlQSxDQUFBO0lBQUEsYUFBQUQsQ0FBQTtFQUFBO0VBQUEsSUFBZkMsZUFBZUEsQ0FBQWxCLENBQUE7SUFBQSxNQUFBaUIsQ0FBQSxHQUFBakIsQ0FBQTtFQUFBO0VBQUEsQ0FBQW1CLENBQUEsR0FBQXZDLGtCQUFBO0VBQUEsSUFHZndDLFlBQVlBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFaQyxZQUFZQSxDQUFBcEIsQ0FBQTtJQUFBLE1BQUFtQixDQUFBLEdBQUFuQixDQUFBO0VBQUE7RUFBQSxDQUFBcUIsQ0FBQSxHQUFBeEMsdUJBQUE7RUFBQSxJQUdaeUMsaUJBQWlCQSxDQUFBO0lBQUEsYUFBQUQsQ0FBQTtFQUFBO0VBQUEsSUFBakJDLGlCQUFpQkEsQ0FBQXRCLENBQUE7SUFBQSxNQUFBcUIsQ0FBQSxHQUFBckIsQ0FBQTtFQUFBO0VBQUEsQ0FBQXVCLENBQUEsR0FBQXpDLHNCQUFBO0VBQUEsSUFHakIwQyxnQkFBZ0JBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFoQkMsZ0JBQWdCQSxDQUFBeEIsQ0FBQTtJQUFBLE1BQUF1QixDQUFBLEdBQUF2QixDQUFBO0VBQUE7RUFBQSxDQUFBeUIsQ0FBQSxHQUFBMUMseUNBQUE7RUFBQSxJQUdoQjJDLG1DQUFtQ0EsQ0FBQTtJQUFBLGFBQUFELENBQUE7RUFBQTtFQUFBLElBQW5DQyxtQ0FBbUNBLENBQUExQixDQUFBO0lBQUEsTUFBQXlCLENBQUEsR0FBQXpCLENBQUE7RUFBQTtFQUFBLENBQUFELENBQUEsR0FBQWYsc0JBQUE7RUFBQSxJQUduQyxDQUFDa0IsZ0JBQWdCeUIsQ0FBQTNCLENBQUE7SUFBQWQscUJBQUEsT0FBQWMsQ0FBQTtFQUFBO0VBQUEsSUFBakIsQ0FBQ0UsZ0JBQWdCeUIsQ0FBQTtJQUFBLE9BQUExQyxxQkFBQTtFQUFBO0VBRTFCLE9BQU8yQyxRQUFRQSxDQUFDQyxJQUFJLEVBQUU7SUFDcEIsT0FBT3ZELElBQUk7QUFDZix5QkFBeUJ1RCxJQUFJLENBQUNqQixjQUFjO0FBQzVDLHlCQUF5QmlCLElBQUksQ0FBQ2IsaUJBQWlCO0FBQy9DLHVCQUF1QmEsSUFBSSxDQUFDWCxlQUFlO0FBQzNDLHVCQUF1QlcsSUFBSSxDQUFDVCxZQUFZO0FBQ3hDLHlCQUF5QlMsSUFBSSxDQUFDUCxpQkFBaUI7QUFDL0MsS0FBSztFQUNIO0FBQ0Y7QUFDQVEsY0FBYyxDQUFDQyxNQUFNLENBQUMsbUJBQW1CLEVBQUV4RCxlQUFlLENBQUM7QUFFM0RKLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNO0VBQ3pCLE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEI5RCxNQUFNLENBQUM4RCxFQUFFLENBQUNLLFVBQVUsQ0FBQ0MsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDQyxXQUFXLEtBQUssT0FBTyxDQUFDO0VBQ3RFckUsTUFBTSxDQUFDOEQsRUFBRSxDQUFDSyxVQUFVLENBQUNDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0MsV0FBVyxLQUFLLFVBQVUsQ0FBQztFQUN4RXJFLE1BQU0sQ0FBQzhELEVBQUUsQ0FBQ0ssVUFBVSxDQUFDQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUNDLFdBQVcsS0FBSyxJQUFJLENBQUM7RUFDaEVyRSxNQUFNLENBQUM4RCxFQUFFLENBQUNLLFVBQVUsQ0FBQ0MsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDQyxXQUFXLEtBQUssRUFBRSxDQUFDO0FBQ2hFLENBQUMsQ0FBQztBQUVGcEUsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLE1BQU07RUFDekQsTUFBTTZELEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QjlELE1BQU0sQ0FBQzhELEVBQUUsQ0FBQ0ssVUFBVSxDQUFDQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUNDLFdBQVcsS0FBSyxFQUFFLENBQUM7QUFDaEUsQ0FBQyxDQUFDO0FBRUZwRSxFQUFFLENBQUMscURBQXFELEVBQUUsTUFBTTtFQUM5RCxNQUFNNkQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCOUQsTUFBTSxDQUFDOEQsRUFBRSxDQUFDSyxVQUFVLENBQUNDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0MsV0FBVyxLQUFLLEVBQUUsQ0FBQztBQUNsRSxDQUFDLENBQUM7QUFFRnBFLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxZQUFZO0VBQ3pFLE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERixFQUFFLENBQUNoQixpQkFBaUIsR0FBRyxlQUFlOztFQUV0QztFQUNBaUIsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCOUQsTUFBTSxDQUFDOEQsRUFBRSxDQUFDSyxVQUFVLENBQUNDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0MsV0FBVyxLQUFLLGVBQWUsQ0FBQzs7RUFFN0U7RUFDQVAsRUFBRSxDQUFDaEIsaUJBQWlCLEdBQUcsV0FBVztFQUNsQzlDLE1BQU0sQ0FBQzhELEVBQUUsQ0FBQ0ssVUFBVSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLFdBQVcsS0FBSyxlQUFlLENBQUM7O0VBRTdFO0VBQ0EsTUFBTUMsT0FBTyxDQUFDQyxPQUFPLENBQUMsQ0FBQztFQUN2QnZFLE1BQU0sQ0FBQzhELEVBQUUsQ0FBQ0ssVUFBVSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLFdBQVcsS0FBSyxXQUFXLENBQUM7QUFDM0UsQ0FBQyxDQUFDO0FBRUZwRSxFQUFFLENBQUMscUNBQXFDLEVBQUUsWUFBWTtFQUNwRCxNQUFNNkQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCQSxFQUFFLENBQUNoQixpQkFBaUIsR0FBRyxFQUFFOztFQUV6QjtFQUNBLE1BQU13QixPQUFPLENBQUNDLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZCdkUsTUFBTSxDQUFDOEQsRUFBRSxDQUFDSyxVQUFVLENBQUNDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0MsV0FBVyxLQUFLLEVBQUUsQ0FBQztFQUNoRVAsRUFBRSxDQUFDaEIsaUJBQWlCLEdBQUcsVUFBVTs7RUFFakM7RUFDQSxNQUFNd0IsT0FBTyxDQUFDQyxPQUFPLENBQUMsQ0FBQztFQUN2QnZFLE1BQU0sQ0FBQzhELEVBQUUsQ0FBQ0ssVUFBVSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLFdBQVcsS0FBSyxVQUFVLENBQUM7QUFDMUUsQ0FBQyxDQUFDO0FBRUZwRSxFQUFFLENBQUMsNkZBQTZGLEVBQUUsTUFBTTtFQUN0RyxNQUFNNkQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0RCxNQUFNUSxRQUFRLEdBQUcsQ0FDZixpQkFBaUIsRUFDakIscUJBQXFCLEVBQ3JCLGtCQUFrQixFQUNsQixlQUFlLEVBQ2Ysb0JBQW9CLEVBQ3BCLG1CQUFtQixFQUNuQiwyQkFBMkIsQ0FDNUI7RUFDRCxNQUFNQyxNQUFNLEdBQUdYLEVBQUUsQ0FBQ1ksV0FBVyxDQUFDQyxrQkFBa0I7RUFDaEQzRSxNQUFNLENBQUN3RSxRQUFRLENBQUNJLE1BQU0sS0FBS0gsTUFBTSxDQUFDRyxNQUFNLENBQUM7RUFDekM1RSxNQUFNLENBQUN3RSxRQUFRLENBQUNLLEtBQUssQ0FBQ3BDLFNBQVMsSUFBSWdDLE1BQU0sQ0FBQ0ssUUFBUSxDQUFDckMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDLENBQUM7QUFFRnhDLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFZO0VBQzlDLE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEJBLEVBQUUsQ0FBQ2lCLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQzs7RUFFekM7RUFDQSxNQUFNVCxPQUFPLENBQUNDLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZCO0VBQ0E7RUFDQTtFQUNBdkUsTUFBTSxDQUFDOEQsRUFBRSxDQUFDSyxVQUFVLENBQUNDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0MsV0FBVyxLQUFLLEVBQUUsQ0FBQztFQUNoRVAsRUFBRSxDQUFDa0IsWUFBWSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQztFQUM3Q2xCLEVBQUUsQ0FBQ2lCLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQzs7RUFFekM7RUFDQSxNQUFNVCxPQUFPLENBQUNDLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZCdkUsTUFBTSxDQUFDOEQsRUFBRSxDQUFDSyxVQUFVLENBQUNDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0MsV0FBVyxLQUFLLEVBQUUsQ0FBQztBQUNsRSxDQUFDLENBQUM7QUFFRnBFLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxZQUFZO0VBQ25ELE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEJBLEVBQUUsQ0FBQ2tCLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxjQUFjLENBQUM7O0VBRXREO0VBQ0EsTUFBTVYsT0FBTyxDQUFDQyxPQUFPLENBQUMsQ0FBQztFQUN2QnZFLE1BQU0sQ0FBQzhELEVBQUUsQ0FBQ0ssVUFBVSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLFdBQVcsS0FBSyxjQUFjLENBQUM7QUFDOUUsQ0FBQyxDQUFDO0FBRUZwRSxFQUFFLENBQUMsMENBQTBDLEVBQUUsTUFBTTtFQUNuRCxNQUFNNkQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCQSxFQUFFLENBQUNrQixZQUFZLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDO0VBQzFDaEYsTUFBTSxDQUFDOEQsRUFBRSxDQUFDZCxlQUFlLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYvQyxFQUFFLENBQUMsaUNBQWlDLEVBQUUsTUFBTTtFQUMxQyxNQUFNNkQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCLEtBQUssTUFBTW1CLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQzNDbkIsRUFBRSxDQUFDUixnQkFBZ0IsR0FBRzJCLEtBQUs7SUFDM0JqRixNQUFNLENBQUM4RCxFQUFFLENBQUNSLGdCQUFnQixLQUFLMkIsS0FBSyxDQUFDO0VBQ3ZDO0FBQ0YsQ0FBQyxDQUFDO0FBRUZoRixFQUFFLENBQUMsOENBQThDLEVBQUUsTUFBTTtFQUN2RCxNQUFNNkQsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUN0REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCLE1BQU1tQixLQUFLLEdBQUcsS0FBSztFQUNuQm5CLEVBQUUsQ0FBQ2tCLFlBQVksQ0FBQyxtQkFBbUIsRUFBRUMsS0FBSyxDQUFDO0VBQzNDakYsTUFBTSxDQUFDOEQsRUFBRSxDQUFDUixnQkFBZ0IsS0FBSzJCLEtBQUssQ0FBQztBQUN2QyxDQUFDLENBQUM7QUFFRmhGLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxNQUFNO0VBQ2pELE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERixFQUFFLENBQUNrQixZQUFZLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDO0VBQ25EakIsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCOUQsTUFBTSxDQUFDOEQsRUFBRSxDQUFDaEIsaUJBQWlCLEtBQUssV0FBVyxDQUFDO0FBQzlDLENBQUMsQ0FBQzs7QUFFRjtBQUNBO0FBQ0E3QyxFQUFFLENBQUMscUNBQXFDLEVBQUUsTUFBTTtFQUFBLElBQUFpRixXQUFBLEVBQUFDLG9CQUFBLEVBQUFDLHFCQUFBO0VBQzlDLE1BQU1DLGVBQWUsU0FBU25GLFFBQVEsQ0FBQztJQUFBO01BQUEsQ0FBQWtGLHFCQUFBLEVBQUFGLFdBQUEsSUFBQWhFLFVBQUEsU0FBQWlFLG9CQUFBLHdDQUFUakYsUUFBUSxFQUFBK0IsQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBZ0QsV0FBQSxRQUFBRSxxQkFBQTtJQUFBLE1BQUFELG9CQUFBLEdBQ25DaEYsUUFBUSxDQUFDO01BQUVnQyxJQUFJLEVBQUVDO0lBQU8sQ0FBQyxDQUFDO01BQUEsYUFBQUYsQ0FBQTtJQUFBO0lBQUEsSUFDbEJRLGNBQWNBLENBQUFaLENBQUE7TUFBQSxNQUFBSSxDQUFBLEdBQUFKLENBQUE7SUFBQTtJQUV2QixPQUFPNEIsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ3BCLElBQUksRUFBRSxnQkFBZ0IsSUFBSUEsSUFBSSxDQUFDLElBQUkyQixPQUFPLENBQUNDLEdBQUcsQ0FBQzVCLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLEtBQUssRUFBRTtRQUNoRixNQUFNLElBQUk2QixLQUFLLENBQUMsK0JBQStCLENBQUM7TUFDbEQ7TUFDQSxPQUFPcEYsSUFBSSxFQUFFO0lBQ2Y7RUFDRjtFQUNBd0QsY0FBYyxDQUFDQyxNQUFNLENBQUMsMEJBQTBCLEVBQUV3QixlQUFlLENBQUM7RUFDbEUsTUFBTXZCLEVBQUUsR0FBRyxJQUFJdUIsZUFBZSxDQUFDLENBQUM7RUFDaEMsSUFBSUksTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSUMsT0FBTztFQUNYLElBQUk7SUFDRjVCLEVBQUUsQ0FBQzZCLGlCQUFpQixDQUFDLENBQUM7SUFDdEJGLE1BQU0sR0FBRyxJQUFJO0VBQ2YsQ0FBQyxDQUFDLE9BQU9HLEtBQUssRUFBRTtJQUNkRixPQUFPLEdBQUdFLEtBQUssQ0FBQ0YsT0FBTztFQUN6QjtFQUNBMUYsTUFBTSxDQUFDeUYsTUFBTSxFQUFFQyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGO0FBQ0E7QUFDQTtBQUNBekYsRUFBRSxDQUFDNEYsSUFBSSxDQUFDLHdCQUF3QixFQUFFLE1BQU07RUFBQSxJQUFBQyxXQUFBLEVBQUFDLG9CQUFBLEVBQUFDLHFCQUFBO0VBQ3RDLE1BQU1YLGVBQWUsU0FBU25GLFFBQVEsQ0FBQztJQUFBO01BQUEsQ0FBQThGLHFCQUFBLEVBQUFGLFdBQUEsSUFBQTVFLFVBQUEsU0FBQTZFLG9CQUFBLHdDQUFUN0YsUUFBUSxFQUFBK0IsQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBNEQsV0FBQSxRQUFBRSxxQkFBQTtJQUFBLE1BQUFELG9CQUFBLEdBQ25DNUYsUUFBUSxDQUFDO01BQUVnQyxJQUFJLEVBQUVDO0lBQU8sQ0FBQyxDQUFDO01BQUEsYUFBQUYsQ0FBQTtJQUFBO0lBQUEsSUFDbEJRLGNBQWNBLENBQUFaLENBQUE7TUFBQSxNQUFBSSxDQUFBLEdBQUFKLENBQUE7SUFBQTtJQUV2QixPQUFPNEIsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ3BCLE1BQU1zQyxPQUFPLEdBQUdYLE9BQU8sQ0FBQ1csT0FBTyxDQUFDdEMsSUFBSSxDQUFDO01BQ3JDLElBQUlzQyxPQUFPLENBQUNyQixNQUFNLEtBQUssQ0FBQyxJQUFJcUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLGdCQUFnQixFQUFFO1FBQzNELE1BQU0sSUFBSVQsS0FBSyxDQUFDLG1DQUFtQyxDQUFDO01BQ3REO01BQ0EsT0FBT3BGLElBQUksRUFBRTtJQUNmO0VBQ0Y7RUFDQXdELGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLDBCQUEwQixFQUFFd0IsZUFBZSxDQUFDO0VBQ2xFLE1BQU12QixFQUFFLEdBQUcsSUFBSXVCLGVBQWUsQ0FBQyxDQUFDO0VBQ2hDLElBQUlJLE1BQU0sR0FBRyxLQUFLO0VBQ2xCLElBQUlDLE9BQU87RUFDWCxJQUFJO0lBQ0Y1QixFQUFFLENBQUM2QixpQkFBaUIsQ0FBQyxDQUFDO0lBQ3RCRixNQUFNLEdBQUcsSUFBSTtFQUNmLENBQUMsQ0FBQyxPQUFPRyxLQUFLLEVBQUU7SUFDZEYsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87RUFDekI7RUFDQTFGLE1BQU0sQ0FBQ3lGLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGekYsRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZO0VBQzVCLE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEI5RCxNQUFNLENBQUM4RCxFQUFFLENBQUNwQixjQUFjLEtBQUssT0FBTyxFQUFFLG1CQUFtQixDQUFDO0VBQzFEb0IsRUFBRSxDQUFDcEIsY0FBYyxHQUFHLFdBQVc7RUFDL0IxQyxNQUFNLENBQUM4RCxFQUFFLENBQUNwQixjQUFjLEtBQUssV0FBVyxFQUFFLHlCQUF5QixDQUFDOztFQUVwRTtFQUNBLE1BQU00QixPQUFPLENBQUNDLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZCdkUsTUFBTSxDQUFDOEQsRUFBRSxDQUFDSyxVQUFVLENBQUNDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQ0MsV0FBVyxLQUFLLFdBQVcsQ0FBQztBQUM1RSxDQUFDLENBQUM7QUFFRnBFLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxNQUFNO0VBQ3JELE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixFQUFFLENBQUM7RUFDeEIsTUFBTW9DLEtBQUssR0FBRyxFQUFFO0VBQ2hCcEMsRUFBRSxDQUFDbEIsY0FBYyxHQUFHc0QsS0FBSztFQUN6QmxHLE1BQU0sQ0FBQzhELEVBQUUsQ0FBQ2xCLGNBQWMsS0FBS3NELEtBQUssRUFBRSxrQkFBa0IsQ0FBQztBQUN6RCxDQUFDLENBQUM7QUFFRmpHLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxNQUFNO0VBQzdELE1BQU02RCxFQUFFLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3RERixFQUFFLENBQUNrQixZQUFZLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDO0VBQ3hDakIsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osRUFBRSxDQUFDO0VBQ3hCOUQsTUFBTSxDQUFDOEQsRUFBRSxDQUFDZCxlQUFlLEtBQUssQ0FBQyxFQUFFLHNCQUFzQixDQUFDO0VBQ3hEYyxFQUFFLENBQUNrQixZQUFZLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDO0VBQ3ZDaEYsTUFBTSxDQUFDdUMsTUFBTSxDQUFDNEQsS0FBSyxDQUFDckMsRUFBRSxDQUFDZCxlQUFlLENBQUMsRUFBRSx1QkFBdUIsQ0FBQztFQUNqRWMsRUFBRSxDQUFDa0IsWUFBWSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQztFQUN4Q2hGLE1BQU0sQ0FBQ3VDLE1BQU0sQ0FBQzRELEtBQUssQ0FBQ3JDLEVBQUUsQ0FBQ2QsZUFBZSxDQUFDLEVBQUUsd0JBQXdCLENBQUM7RUFDbEVjLEVBQUUsQ0FBQ2tCLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUM7RUFDN0NoRixNQUFNLENBQUN1QyxNQUFNLENBQUM0RCxLQUFLLENBQUNyQyxFQUFFLENBQUNkLGVBQWUsQ0FBQyxFQUFFLDZCQUE2QixDQUFDO0FBQ3pFLENBQUMsQ0FBQzs7QUFFRjtBQUNBO0FBQ0E7QUFDQS9DLEVBQUUsQ0FBQzRGLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxNQUFNO0VBQUEsSUFBQU8sV0FBQSxFQUFBQyxvQkFBQSxFQUFBQyxxQkFBQTtFQUM5QyxNQUFNQyxjQUFjLFNBQVNyRyxRQUFRLENBQUM7SUFBQTtNQUFBLENBQUFvRyxxQkFBQSxFQUFBRixXQUFBLElBQUFsRixVQUFBLFNBQUFtRixvQkFBQSx3Q0FBVG5HLFFBQVEsRUFBQStCLENBQUE7SUFBQTtJQUFBLENBQUFDLENBQUEsSUFBQWtFLFdBQUEsUUFBQUUscUJBQUE7SUFBQSxNQUFBRCxvQkFBQSxHQUNsQ2xHLFFBQVEsQ0FBQztNQUFFZ0MsSUFBSSxFQUFFQztJQUFPLENBQUMsQ0FBQztNQUFBLGFBQUFGLENBQUE7SUFBQTtJQUFBLElBQ2xCUSxjQUFjQSxDQUFBWixDQUFBO01BQUEsTUFBQUksQ0FBQSxHQUFBSixDQUFBO0lBQUE7SUFFdkIsT0FBTzRCLFFBQVFBLENBQUNDLElBQUksRUFBRTtNQUNwQkEsSUFBSSxDQUFDakIsY0FBYyxHQUFHLFdBQVc7TUFDakMsT0FBT3RDLElBQUksUUFBUXVELElBQUksQ0FBQ2pCLGNBQWMsUUFBUTtJQUNoRDtFQUNGO0VBQ0FrQixjQUFjLENBQUNDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTBDLGNBQWMsQ0FBQztFQUNoRSxNQUFNekMsRUFBRSxHQUFHLElBQUl5QyxjQUFjLENBQUMsQ0FBQztFQUMvQixJQUFJZCxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRjVCLEVBQUUsQ0FBQzZCLGlCQUFpQixDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1wQixRQUFRLEdBQUcseUVBQXlFO0lBQzFGa0IsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87SUFDdkJELE1BQU0sR0FBR0csS0FBSyxDQUFDRixPQUFPLEtBQUtsQixRQUFRO0VBQ3JDO0VBQ0F4RSxNQUFNLENBQUN5RixNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBO0FBQ0F6RixFQUFFLENBQUM0RixJQUFJLENBQUMsa0NBQWtDLEVBQUUsTUFBTTtFQUFBLElBQUFXLFdBQUEsRUFBQUMsb0JBQUEsRUFBQUMscUJBQUE7RUFDaEQsTUFBTUgsY0FBYyxTQUFTckcsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBd0cscUJBQUEsRUFBQUYsV0FBQSxJQUFBdEYsVUFBQSxTQUFBdUYsb0JBQUEsd0NBQVR2RyxRQUFRLEVBQUErQixDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUFzRSxXQUFBLFFBQUFFLHFCQUFBO0lBQUEsTUFBQUQsb0JBQUEsR0FDbEN0RyxRQUFRLENBQUM7TUFBRWdDLElBQUksRUFBRUM7SUFBTyxDQUFDLENBQUM7TUFBQSxhQUFBRixDQUFBO0lBQUE7SUFBQSxJQUNsQlEsY0FBY0EsQ0FBQVosQ0FBQTtNQUFBLE1BQUFJLENBQUEsR0FBQUosQ0FBQTtJQUFBO0lBRXZCLE9BQU80QixRQUFRQSxDQUFDQyxJQUFJLEVBQUU7TUFDcEJBLElBQUksQ0FBQ2dELFlBQVksR0FBRyxXQUFXO01BQy9CLE9BQU92RyxJQUFJLFFBQVF1RCxJQUFJLENBQUNqQixjQUFjLFFBQVE7SUFDaEQ7RUFDRjtFQUNBa0IsY0FBYyxDQUFDQyxNQUFNLENBQUMseUJBQXlCLEVBQUUwQyxjQUFjLENBQUM7RUFDaEUsTUFBTXpDLEVBQUUsR0FBRyxJQUFJeUMsY0FBYyxDQUFDLENBQUM7RUFDL0IsSUFBSWQsTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSUMsT0FBTyxHQUFHLHFCQUFxQjtFQUNuQyxJQUFJO0lBQ0Y1QixFQUFFLENBQUM2QixpQkFBaUIsQ0FBQyxDQUFDO0VBQ3hCLENBQUMsQ0FBQyxPQUFPQyxLQUFLLEVBQUU7SUFDZCxNQUFNcEIsUUFBUSxHQUFHLG1FQUFtRTtJQUNwRmtCLE9BQU8sR0FBR0UsS0FBSyxDQUFDRixPQUFPO0lBQ3ZCRCxNQUFNLEdBQUdHLEtBQUssQ0FBQ0YsT0FBTyxLQUFLbEIsUUFBUTtFQUNyQztFQUNBeEUsTUFBTSxDQUFDeUYsTUFBTSxFQUFFQyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0F6RixFQUFFLENBQUM0RixJQUFJLENBQUMsK0JBQStCLEVBQUUsTUFBTTtFQUFBLElBQUFlLFdBQUEsRUFBQUMsb0JBQUEsRUFBQUMscUJBQUE7RUFDN0MsTUFBTVAsY0FBYyxTQUFTckcsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBNEcscUJBQUEsRUFBQUYsV0FBQSxJQUFBMUYsVUFBQSxTQUFBMkYsb0JBQUEsd0NBQVQzRyxRQUFRLEVBQUErQixDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUEwRSxXQUFBLFFBQUFFLHFCQUFBO0lBQUEsTUFBQUQsb0JBQUEsR0FDbEMxRyxRQUFRLENBQUM7TUFBRWdDLElBQUksRUFBRUM7SUFBTyxDQUFDLENBQUM7TUFBQSxhQUFBRixDQUFBO0lBQUE7SUFBQSxJQUNsQlEsY0FBY0EsQ0FBQVosQ0FBQTtNQUFBLE1BQUFJLENBQUEsR0FBQUosQ0FBQTtJQUFBO0lBRXZCLE9BQU80QixRQUFRQSxDQUFDQyxJQUFJLEVBQUU7TUFDcEIsT0FBT3ZELElBQUksUUFBUXVELElBQUksQ0FBQ2dELFlBQVksUUFBUTtJQUM5QztFQUNGO0VBQ0EvQyxjQUFjLENBQUNDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTBDLGNBQWMsQ0FBQztFQUNoRSxNQUFNekMsRUFBRSxHQUFHLElBQUl5QyxjQUFjLENBQUMsQ0FBQztFQUMvQixJQUFJZCxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRjVCLEVBQUUsQ0FBQzZCLGlCQUFpQixDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1wQixRQUFRLEdBQUcsbUVBQW1FO0lBQ3BGa0IsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87SUFDdkJELE1BQU0sR0FBR0csS0FBSyxDQUFDRixPQUFPLEtBQUtsQixRQUFRO0VBQ3JDO0VBQ0F4RSxNQUFNLENBQUN5RixNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBekYsRUFBRSxDQUFDNEYsSUFBSSxDQUFDLDBCQUEwQixFQUFFLE1BQU07RUFDeEMsTUFBTS9CLEVBQUUsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEVBQUUsQ0FBQztFQUN4QixJQUFJMkIsTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSUMsT0FBTyxHQUFHLHFCQUFxQjtFQUNuQyxJQUFJO0lBQ0Y1QixFQUFFLENBQUNpRCxRQUFRLENBQUNyRSxjQUFjLEdBQUcsV0FBVztFQUMxQyxDQUFDLENBQUMsT0FBT2tELEtBQUssRUFBRTtJQUNkLE1BQU1wQixRQUFRLEdBQUcsNkZBQTZGO0lBQzlHa0IsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87SUFDdkJELE1BQU0sR0FBR0csS0FBSyxDQUFDRixPQUFPLEtBQUtsQixRQUFRO0VBQ3JDO0VBQ0F4RSxNQUFNLENBQUN5RixNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQXpGLEVBQUUsQ0FBQzRGLElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxNQUFNO0VBQUEsSUFBQW1CLFdBQUEsRUFBQUMsb0JBQUEsRUFBQUMscUJBQUE7RUFDdEQsTUFBTVgsY0FBYyxTQUFTckcsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBZ0gscUJBQUEsRUFBQUYsV0FBQSxJQUFBOUYsVUFBQSxTQUFBK0Ysb0JBQUEsd0NBQVQvRyxRQUFRLEVBQUErQixDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUE4RSxXQUFBLFFBQUFFLHFCQUFBO0lBQUEsTUFBQUQsb0JBQUEsR0FDbEM5RyxRQUFRLENBQUM7TUFBRWdDLElBQUksRUFBRUM7SUFBTyxDQUFDLENBQUM7TUFBQSxhQUFBRixDQUFBO0lBQUE7SUFBQSxJQUNsQlEsY0FBY0EsQ0FBQVosQ0FBQTtNQUFBLE1BQUFJLENBQUEsR0FBQUosQ0FBQTtJQUFBO0lBRXZCLE9BQU80QixRQUFRQSxDQUFDQyxJQUFJLEVBQUU7TUFDcEIyQixPQUFPLENBQUM2QixjQUFjLENBQUN4RCxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3ZDLE9BQU92RCxJQUFJLEVBQUU7SUFDZjtFQUNGO0VBQ0F3RCxjQUFjLENBQUNDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTBDLGNBQWMsQ0FBQztFQUNoRSxNQUFNekMsRUFBRSxHQUFHLElBQUl5QyxjQUFjLENBQUMsQ0FBQztFQUMvQixJQUFJZCxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRjVCLEVBQUUsQ0FBQzZCLGlCQUFpQixDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1wQixRQUFRLEdBQUcsa0NBQWtDO0lBQ25Ea0IsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87SUFDdkJELE1BQU0sR0FBR0csS0FBSyxDQUFDRixPQUFPLEtBQUtsQixRQUFRO0VBQ3JDO0VBQ0F4RSxNQUFNLENBQUN5RixNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBO0FBQ0F6RixFQUFFLENBQUM0RixJQUFJLENBQUMsZ0NBQWdDLEVBQUUsTUFBTTtFQUFBLElBQUF1QixXQUFBLEVBQUFDLG9CQUFBLEVBQUFDLHFCQUFBO0VBQzlDLE1BQU1mLGNBQWMsU0FBU3JHLFFBQVEsQ0FBQztJQUFBO01BQUEsQ0FBQW9ILHFCQUFBLEVBQUFGLFdBQUEsSUFBQWxHLFVBQUEsU0FBQW1HLG9CQUFBLHdDQUFUbkgsUUFBUSxFQUFBK0IsQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBa0YsV0FBQSxRQUFBRSxxQkFBQTtJQUFBLE1BQUFELG9CQUFBLEdBQ2xDbEgsUUFBUSxDQUFDO01BQUVnQyxJQUFJLEVBQUVDO0lBQU8sQ0FBQyxDQUFDO01BQUEsYUFBQUYsQ0FBQTtJQUFBO0lBQUEsSUFDbEJRLGNBQWNBLENBQUFaLENBQUE7TUFBQSxNQUFBSSxDQUFBLEdBQUFKLENBQUE7SUFBQTtJQUV2QixPQUFPNEIsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ3BCMkIsT0FBTyxDQUFDaUMsY0FBYyxDQUFDNUQsSUFBSSxFQUFFLGdCQUFnQixDQUFDO01BQzlDLE9BQU92RCxJQUFJLEVBQUU7SUFDZjtFQUNGO0VBQ0F3RCxjQUFjLENBQUNDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTBDLGNBQWMsQ0FBQztFQUNoRSxNQUFNekMsRUFBRSxHQUFHLElBQUl5QyxjQUFjLENBQUMsQ0FBQztFQUMvQixJQUFJZCxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRjVCLEVBQUUsQ0FBQzZCLGlCQUFpQixDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1wQixRQUFRLEdBQUcsa0NBQWtDO0lBQ25Ea0IsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87SUFDdkJELE1BQU0sR0FBR0csS0FBSyxDQUFDRixPQUFPLEtBQUtsQixRQUFRO0VBQ3JDO0VBQ0F4RSxNQUFNLENBQUN5RixNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBekYsRUFBRSxDQUFDNEYsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLE1BQU07RUFBQSxJQUFBMkIsV0FBQSxFQUFBQyxvQkFBQSxFQUFBQyxxQkFBQTtFQUNoRSxNQUFNbkIsY0FBYyxTQUFTckcsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBd0gscUJBQUEsRUFBQUYsV0FBQSxJQUFBdEcsVUFBQSxTQUFBdUcsb0JBQUEsd0NBQVR2SCxRQUFRLEVBQUErQixDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUFzRixXQUFBLFFBQUFFLHFCQUFBO0lBQUEsTUFBQUQsb0JBQUEsR0FDbEN0SCxRQUFRLENBQUM7TUFBRWdDLElBQUksRUFBRUM7SUFBTyxDQUFDLENBQUM7TUFBQSxhQUFBRixDQUFBO0lBQUE7SUFBQSxJQUNsQlEsY0FBY0EsQ0FBQVosQ0FBQTtNQUFBLE1BQUFJLENBQUEsR0FBQUosQ0FBQTtJQUFBO0lBRXZCLE9BQU80QixRQUFRQSxDQUFDQyxJQUFJLEVBQUU7TUFDcEIyQixPQUFPLENBQUNxQyx3QkFBd0IsQ0FBQ2hFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQztNQUN4RCxPQUFPdkQsSUFBSSxFQUFFO0lBQ2Y7RUFDRjtFQUNBd0QsY0FBYyxDQUFDQyxNQUFNLENBQUMseUJBQXlCLEVBQUUwQyxjQUFjLENBQUM7RUFDaEUsTUFBTXpDLEVBQUUsR0FBRyxJQUFJeUMsY0FBYyxDQUFDLENBQUM7RUFDL0IsSUFBSWQsTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSUMsT0FBTyxHQUFHLHFCQUFxQjtFQUNuQyxJQUFJO0lBQ0Y1QixFQUFFLENBQUM2QixpQkFBaUIsQ0FBQyxDQUFDO0VBQ3hCLENBQUMsQ0FBQyxPQUFPQyxLQUFLLEVBQUU7SUFDZCxNQUFNcEIsUUFBUSxHQUFHLGtDQUFrQztJQUNuRGtCLE9BQU8sR0FBR0UsS0FBSyxDQUFDRixPQUFPO0lBQ3ZCRCxNQUFNLEdBQUdHLEtBQUssQ0FBQ0YsT0FBTyxLQUFLbEIsUUFBUTtFQUNyQztFQUNBeEUsTUFBTSxDQUFDeUYsTUFBTSxFQUFFQyxPQUFPLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGO0FBQ0E7QUFDQXpGLEVBQUUsQ0FBQzRGLElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxNQUFNO0VBQUEsSUFBQStCLFdBQUEsRUFBQUMsb0JBQUEsRUFBQUMscUJBQUE7RUFDdEQsTUFBTXZCLGNBQWMsU0FBU3JHLFFBQVEsQ0FBQztJQUFBO01BQUEsQ0FBQTRILHFCQUFBLEVBQUFGLFdBQUEsSUFBQTFHLFVBQUEsU0FBQTJHLG9CQUFBLHdDQUFUM0gsUUFBUSxFQUFBK0IsQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBMEYsV0FBQSxRQUFBRSxxQkFBQTtJQUFBLE1BQUFELG9CQUFBLEdBQ2xDMUgsUUFBUSxDQUFDO01BQUVnQyxJQUFJLEVBQUVDO0lBQU8sQ0FBQyxDQUFDO01BQUEsYUFBQUYsQ0FBQTtJQUFBO0lBQUEsSUFDbEJRLGNBQWNBLENBQUFaLENBQUE7TUFBQSxNQUFBSSxDQUFBLEdBQUFKLENBQUE7SUFBQTtJQUV2QixPQUFPNEIsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ3BCMkIsT0FBTyxDQUFDeUMsY0FBYyxDQUFDcEUsSUFBSSxDQUFDO01BQzVCLE9BQU92RCxJQUFJLEVBQUU7SUFDZjtFQUNGO0VBQ0F3RCxjQUFjLENBQUNDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTBDLGNBQWMsQ0FBQztFQUNoRSxNQUFNekMsRUFBRSxHQUFHLElBQUl5QyxjQUFjLENBQUMsQ0FBQztFQUMvQixJQUFJZCxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRjVCLEVBQUUsQ0FBQzZCLGlCQUFpQixDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1wQixRQUFRLEdBQUcsa0NBQWtDO0lBQ25Ea0IsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87SUFDdkJELE1BQU0sR0FBR0csS0FBSyxDQUFDRixPQUFPLEtBQUtsQixRQUFRO0VBQ3JDO0VBQ0F4RSxNQUFNLENBQUN5RixNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBekYsRUFBRSxDQUFDNEYsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLE1BQU07RUFBQSxJQUFBbUMsV0FBQSxFQUFBQyxvQkFBQSxFQUFBQyxxQkFBQTtFQUNwRCxNQUFNM0IsY0FBYyxTQUFTckcsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBZ0kscUJBQUEsRUFBQUYsV0FBQSxJQUFBOUcsVUFBQSxTQUFBK0csb0JBQUEsd0NBQVQvSCxRQUFRLEVBQUErQixDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUE4RixXQUFBLFFBQUFFLHFCQUFBO0lBQUEsTUFBQUQsb0JBQUEsR0FDbEM5SCxRQUFRLENBQUM7TUFBRWdDLElBQUksRUFBRUM7SUFBTyxDQUFDLENBQUM7TUFBQSxhQUFBRixDQUFBO0lBQUE7SUFBQSxJQUNsQlEsY0FBY0EsQ0FBQVosQ0FBQTtNQUFBLE1BQUFJLENBQUEsR0FBQUosQ0FBQTtJQUFBO0lBRXZCLE9BQU80QixRQUFRQSxDQUFDQyxJQUFJLEVBQUU7TUFDcEIyQixPQUFPLENBQUM2QyxZQUFZLENBQUN4RSxJQUFJLENBQUM7TUFDMUIsT0FBT3ZELElBQUksRUFBRTtJQUNmO0VBQ0Y7RUFDQXdELGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLHlCQUF5QixFQUFFMEMsY0FBYyxDQUFDO0VBQ2hFLE1BQU16QyxFQUFFLEdBQUcsSUFBSXlDLGNBQWMsQ0FBQyxDQUFDO0VBQy9CLElBQUlkLE1BQU0sR0FBRyxLQUFLO0VBQ2xCLElBQUlDLE9BQU8sR0FBRyxxQkFBcUI7RUFDbkMsSUFBSTtJQUNGNUIsRUFBRSxDQUFDNkIsaUJBQWlCLENBQUMsQ0FBQztFQUN4QixDQUFDLENBQUMsT0FBT0MsS0FBSyxFQUFFO0lBQ2QsTUFBTXBCLFFBQVEsR0FBRyxrQ0FBa0M7SUFDbkRrQixPQUFPLEdBQUdFLEtBQUssQ0FBQ0YsT0FBTztJQUN2QkQsTUFBTSxHQUFHRyxLQUFLLENBQUNGLE9BQU8sS0FBS2xCLFFBQVE7RUFDckM7RUFDQXhFLE1BQU0sQ0FBQ3lGLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQzs7QUFFRjtBQUNBO0FBQ0F6RixFQUFFLENBQUM0RixJQUFJLENBQUMsMkNBQTJDLEVBQUUsTUFBTTtFQUFBLElBQUF1QyxZQUFBLEVBQUFDLHFCQUFBLEVBQUFDLHNCQUFBO0VBQ3pELE1BQU0vQixjQUFjLFNBQVNyRyxRQUFRLENBQUM7SUFBQTtNQUFBLENBQUFvSSxzQkFBQSxFQUFBRixZQUFBLElBQUFsSCxVQUFBLFNBQUFtSCxxQkFBQSx3Q0FBVG5JLFFBQVEsRUFBQStCLENBQUE7SUFBQTtJQUFBLENBQUFDLENBQUEsSUFBQWtHLFlBQUEsUUFBQUUsc0JBQUE7SUFBQSxNQUFBRCxxQkFBQSxHQUNsQ2xJLFFBQVEsQ0FBQztNQUFFZ0MsSUFBSSxFQUFFQztJQUFPLENBQUMsQ0FBQztNQUFBLGFBQUFGLENBQUE7SUFBQTtJQUFBLElBQ2xCUSxjQUFjQSxDQUFBWixDQUFBO01BQUEsTUFBQUksQ0FBQSxHQUFBSixDQUFBO0lBQUE7SUFFdkIsT0FBTzRCLFFBQVFBLENBQUNDLElBQUksRUFBRTtNQUNwQjJCLE9BQU8sQ0FBQ2lELGlCQUFpQixDQUFDNUUsSUFBSSxDQUFDO01BQy9CLE9BQU92RCxJQUFJLEVBQUU7SUFDZjtFQUNGO0VBQ0F3RCxjQUFjLENBQUNDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTBDLGNBQWMsQ0FBQztFQUNoRSxNQUFNekMsRUFBRSxHQUFHLElBQUl5QyxjQUFjLENBQUMsQ0FBQztFQUMvQixJQUFJZCxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcscUJBQXFCO0VBQ25DLElBQUk7SUFDRjVCLEVBQUUsQ0FBQzZCLGlCQUFpQixDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtJQUNkLE1BQU1wQixRQUFRLEdBQUcsa0NBQWtDO0lBQ25Ea0IsT0FBTyxHQUFHRSxLQUFLLENBQUNGLE9BQU87SUFDdkJELE1BQU0sR0FBR0csS0FBSyxDQUFDRixPQUFPLEtBQUtsQixRQUFRO0VBQ3JDO0VBQ0F4RSxNQUFNLENBQUN5RixNQUFNLEVBQUVDLE9BQU8sQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBekYsRUFBRSxDQUFDNEYsSUFBSSxDQUFDLHdDQUF3QyxFQUFFLE1BQU07RUFBQSxJQUFBMkMsWUFBQSxFQUFBQyxxQkFBQSxFQUFBQyxzQkFBQTtFQUN0RCxNQUFNbkMsY0FBYyxTQUFTckcsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBd0ksc0JBQUEsRUFBQUYsWUFBQSxJQUFBdEgsVUFBQSxTQUFBdUgscUJBQUEsd0NBQVR2SSxRQUFRLEVBQUErQixDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUFzRyxZQUFBLFFBQUFFLHNCQUFBO0lBQUEsTUFBQUQscUJBQUEsR0FDbEN0SSxRQUFRLENBQUM7TUFBRWdDLElBQUksRUFBRUM7SUFBTyxDQUFDLENBQUM7TUFBQSxhQUFBRixDQUFBO0lBQUE7SUFBQSxJQUNsQlEsY0FBY0EsQ0FBQVosQ0FBQTtNQUFBLE1BQUFJLENBQUEsR0FBQUosQ0FBQTtJQUFBO0lBRXZCLE9BQU80QixRQUFRQSxDQUFDQyxJQUFJLEVBQUU7TUFDcEIyQixPQUFPLENBQUNxRCxjQUFjLENBQUNoRixJQUFJLEVBQUVpRixLQUFLLENBQUM7TUFDbkMsT0FBT3hJLElBQUksRUFBRTtJQUNmO0VBQ0Y7RUFDQXdELGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLDBCQUEwQixFQUFFMEMsY0FBYyxDQUFDO0VBQ2pFLE1BQU16QyxFQUFFLEdBQUcsSUFBSXlDLGNBQWMsQ0FBQyxDQUFDO0VBQy9CLElBQUlkLE1BQU0sR0FBRyxLQUFLO0VBQ2xCLElBQUlDLE9BQU8sR0FBRyxxQkFBcUI7RUFDbkMsSUFBSTtJQUNGNUIsRUFBRSxDQUFDNkIsaUJBQWlCLENBQUMsQ0FBQztFQUN4QixDQUFDLENBQUMsT0FBT0MsS0FBSyxFQUFFO0lBQ2QsTUFBTXBCLFFBQVEsR0FBRyxrQ0FBa0M7SUFDbkRrQixPQUFPLEdBQUdFLEtBQUssQ0FBQ0YsT0FBTztJQUN2QkQsTUFBTSxHQUFHRyxLQUFLLENBQUNGLE9BQU8sS0FBS2xCLFFBQVE7RUFDckM7RUFDQXhFLE1BQU0sQ0FBQ3lGLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==