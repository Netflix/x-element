function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, listener } from '../x-element-next.js';
it('properties should not have hyphens (conflicts with attribute names)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto, _computedKeyDecs, _init_computedKey;
    class TestElement extends XElement {
      static {
        [_init_computedKey, _initProto] = _applyDecs(this, [[_computedKeyDecs, 1, 'just-stop']], [], 0, void 0, XElement).e;
      }
      #A = (_initProto(this), _init_computedKey(this));
      get [(_computedKeyDecs = property({
        type: String
      }), 'just-stop')]() {
        return this.#A;
      }
      set 'just-stop'(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-hyphen', TestElement);
  } catch (error) {
    // Note: With decorators, the error message may be different as we're
    // decorating a quoted property name which might fail at the decorator level
    passed = true;
    message = error.message;
  }
  assert(passed, message);
});
it('property attributes should not have non-standard casing', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto2, _okDecs, _init_ok;
    class TestElement extends XElement {
      static {
        [_init_ok, _initProto2] = _applyDecs(this, [[_okDecs, 1, "ok"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto2(this), _init_ok(this));
      get [(_okDecs = property({
        type: String,
        attribute: 'this-IS-not-OK'
      }), "ok")]() {
        return this.#A;
      }
      set ok(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-attr-case', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.ok has non-standard attribute casing "this-IS-not-OK" (use lower-cased names).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('properties should not shadow XElement prototype interface', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto3, _dispatchErrorDecs, _init_dispatchError;
    class TestElement extends XElement {
      static {
        [_init_dispatchError, _initProto3] = _applyDecs(this, [[_dispatchErrorDecs, 1, "dispatchError"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto3(this), _init_dispatchError(this));
      get [(_dispatchErrorDecs = property({}), "dispatchError")]() {
        return this.#A;
      }
      set dispatchError(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-shadow', TestElement);
  } catch (error) {
    const expected = 'Unexpected key "TestElement.prototype.dispatchError" shadows in XElement.prototype interface.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('property keys should only be from our known set', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto4, _badPropertyDecs, _init_badProperty;
    class TestElement extends XElement {
      static {
        [_init_badProperty, _initProto4] = _applyDecs(this, [[_badPropertyDecs, 1, "badProperty"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto4(this), _init_badProperty(this));
      get [(_badPropertyDecs = property({
        doesNotExist: true
      }), "badProperty")]() {
        return this.#A;
      }
      set badProperty(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-key', TestElement);
  } catch (error) {
    const expected = 'Unexpected key "TestElement.prototype.badProperty.doesNotExist".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('properties should be objects', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto5, _badPropertyDecs2, _init_badProperty2;
    class TestElement extends XElement {
      static {
        [_init_badProperty2, _initProto5] = _applyDecs(this, [[_badPropertyDecs2, 1, "badProperty"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto5(this), _init_badProperty2(this));
      get [(_badPropertyDecs2 = property(undefined), "badProperty")]() {
        return this.#A;
      }
      set badProperty(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-prop-type', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.badProperty has an unexpected value (expected Object, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('type should be a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto6, _badTypeDecs, _init_badType;
    class TestElement extends XElement {
      static {
        [_init_badType, _initProto6] = _applyDecs(this, [[_badTypeDecs, 1, "badType"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto6(this), _init_badType(this));
      get [(_badTypeDecs = property({
        type: undefined
      }), "badType")]() {
        return this.#A;
      }
      set badType(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-type', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badType.type" (expected constructor Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('compute should be a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto7, _badComputeDecs, _init_badCompute;
    class TestElement extends XElement {
      static {
        [_init_badCompute, _initProto7] = _applyDecs(this, [[_badComputeDecs, 1, "badCompute"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto7(this), _init_badCompute(this));
      get [(_badComputeDecs = property({
        compute: undefined
      }), "badCompute")]() {
        return this.#A;
      }
      set badCompute(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-compute', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badCompute.compute" (expected Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('observe should be a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto8, _badObserveDecs, _init_badObserve;
    class TestElement extends XElement {
      static {
        [_init_badObserve, _initProto8] = _applyDecs(this, [[_badObserveDecs, 1, "badObserve"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto8(this), _init_badObserve(this));
      get [(_badObserveDecs = property({
        observe: undefined
      }), "badObserve")]() {
        return this.#A;
      }
      set badObserve(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-observe', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badObserve.observe" (expected Function, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('attribute should be a string', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto9, _badAttributeDecs, _init_badAttribute;
    class TestElement extends XElement {
      static {
        [_init_badAttribute, _initProto9] = _applyDecs(this, [[_badAttributeDecs, 1, "badAttribute"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto9(this), _init_badAttribute(this));
      get [(_badAttributeDecs = property({
        attribute: undefined
      }), "badAttribute")]() {
        return this.#A;
      }
      set badAttribute(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-attr', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badAttribute.attribute" (expected String, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('attribute should be a non-empty string', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto0, _badAttributeDecs2, _init_badAttribute2;
    class TestElement extends XElement {
      static {
        [_init_badAttribute2, _initProto0] = _applyDecs(this, [[_badAttributeDecs2, 1, "badAttribute"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto0(this), _init_badAttribute2(this));
      get [(_badAttributeDecs2 = property({
        attribute: ''
      }), "badAttribute")]() {
        return this.#A;
      }
      set badAttribute(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-empty-attr', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badAttribute.attribute" (expected non-empty String).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('attributes cannot be duplicated (1)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto1, _attributeDecs, _init_attribute, _aliasedDecs, _init_aliased;
    class TestElement extends XElement {
      static {
        [_init_attribute, _init_aliased, _initProto1] = _applyDecs(this, [[_attributeDecs, 1, "attribute"], [_aliasedDecs, 1, "aliased"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto1(this), _init_attribute(this));
      get [(_attributeDecs = property({
        type: String
      }), _aliasedDecs = property({
        type: String,
        attribute: 'attribute'
      }), "attribute")]() {
        return this.#A;
      }
      set attribute(v) {
        this.#A = v;
      }
      #B = _init_aliased(this);
      get aliased() {
        return this.#B;
      }
      set aliased(v) {
        this.#B = v;
      }
    }
    customElements.define('test-element-dup-attr-1', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.aliased causes a duplicated attribute "attribute".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('attributes cannot be duplicated (2)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto10, _attributeDecs2, _init_attribute2, _aliasedDecs2, _init_aliased2;
    class TestElement extends XElement {
      static {
        [_init_attribute2, _init_aliased2, _initProto10] = _applyDecs(this, [[_attributeDecs2, 1, "attribute"], [_aliasedDecs2, 1, "aliased"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto10(this), _init_attribute2(this));
      get [(_attributeDecs2 = property({}), _aliasedDecs2 = property({
        attribute: 'attribute'
      }), "attribute")]() {
        return this.#A;
      }
      set attribute(v) {
        this.#A = v;
      }
      #B = _init_aliased2(this);
      get aliased() {
        return this.#B;
      }
      set aliased(v) {
        this.#B = v;
      }
    }
    customElements.define('test-element-dup-attr-2', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.aliased causes a duplicated attribute "attribute".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('default must be a scalar or a function', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto11, _badValueDecs, _init_badValue;
    class TestElement extends XElement {
      static {
        [_init_badValue, _initProto11] = _applyDecs(this, [[_badValueDecs, 1, "badValue"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto11(this), _init_badValue(this));
      get [(_badValueDecs = property({
        default: {}
      }), "badValue")]() {
        return this.#A;
      }
      set badValue(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-default', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badValue.default" (expected Boolean, String, Number, or Function, got Object).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('reflect should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto12, _badReflectDecs, _init_badReflect;
    class TestElement extends XElement {
      static {
        [_init_badReflect, _initProto12] = _applyDecs(this, [[_badReflectDecs, 1, "badReflect"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto12(this), _init_badReflect(this));
      get [(_badReflectDecs = property({
        reflect: undefined
      }), "badReflect")]() {
        return this.#A;
      }
      set badReflect(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-reflect', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badReflect.reflect" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The internal configuration doesn't exist in the decorator API.
//  Users should use private fields to achieve internal property behavior.
//  Skip this test as internal configuration is not supported with decorators.
it.skip('internal should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto13, _badInternalDecs, _init_badInternal;
    class TestElement extends XElement {
      static {
        [_init_badInternal, _initProto13] = _applyDecs(this, [[_badInternalDecs, 1, "badInternal"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto13(this), _init_badInternal(this));
      get [(_badInternalDecs = property({
        internal: undefined
      }), "badInternal")]() {
        return this.#A;
      }
      set badInternal(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-internal', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badInternal.internal" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  Instead, users should use accessor-only decorators (no setter) or private
//  fields with a getter accessor to achieve read-only behavior. Skip this test
//  as readOnly configuration is not supported with decorators.
it.skip('readOnly should be a boolean', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          badReadOnly: {
            readOnly: undefined
          }
        };
      }
    }
    customElements.define('test-element-bad-readonly', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badReadOnly.readOnly" (expected Boolean, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('input should be an array', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto14, _badInputDecs, _init_badInput;
    class TestElement extends XElement {
      static {
        [_init_badInput, _initProto14] = _applyDecs(this, [[_badInputDecs, 1, "badInput"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto14(this), _init_badInput(this));
      get [(_badInputDecs = property({
        input: {}
      }), "badInput")]() {
        return this.#A;
      }
      set badInput(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-input-type', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badInput.input" (expected Array, got Object).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('input items should be strings', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto15, _badInputDecs2, _init_badInput2;
    class TestElement extends XElement {
      static {
        [_init_badInput2, _initProto15] = _applyDecs(this, [[_badInputDecs2, 1, "badInput"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto15(this), _init_badInput2(this));
      get [(_badInputDecs2 = property({
        input: ['foo', 'bar', undefined]
      }), "badInput")]() {
        return this.#A;
      }
      set badInput(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-bad-input-items', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.prototype.badInput.input[2]" (expected String, got Undefined).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('input keys cannot be duplicated', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto16, _fooDecs, _init_foo, _computedDecs, _init_computed;
    class TestElement extends XElement {
      static {
        [_init_foo, _init_computed, _initProto16] = _applyDecs(this, [[_fooDecs, 1, "foo"], [_computedDecs, 1, "computed"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto16(this), _init_foo(this));
      get [(_fooDecs = property({
        type: String
      }), _computedDecs = property({
        input: ['foo', 'foo'],
        compute: () => {}
      }), "foo")]() {
        return this.#A;
      }
      set foo(v) {
        this.#A = v;
      }
      #B = _init_computed(this);
      get computed() {
        return this.#B;
      }
      set computed(v) {
        this.#B = v;
      }
    }
    customElements.define('test-element-duplicate-input', TestElement);
  } catch (error) {
    const expected = 'Duplicate key "foo" in "TestElement.prototype.computed.input" (each input key must be unique).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('input must be declared as other property names', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto17, _fooDecs2, _init_foo2, _badInputDecs3, _init_badInput3;
    class TestElement extends XElement {
      static {
        [_init_foo2, _init_badInput3, _initProto17] = _applyDecs(this, [[_fooDecs2, 1, "foo"], [_badInputDecs3, 1, "badInput"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto17(this), _init_foo2(this));
      get [(_fooDecs2 = property({}), _badInputDecs3 = property({
        input: ['foo', 'bar'],
        compute: () => {}
      }), "foo")]() {
        return this.#A;
      }
      set foo(v) {
        this.#A = v;
      }
      #B = _init_badInput3(this);
      get badInput() {
        return this.#B;
      }
      set badInput(v) {
        this.#B = v;
      }
    }
    customElements.define('test-element-undeclared-input', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.badInput.input[1] has an unexpected item ("bar" cannot be resolved).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('input cannot be cyclic (simple)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto18, _simpleCycleDecs, _init_simpleCycle;
    class TestElement extends XElement {
      static {
        [_init_simpleCycle, _initProto18] = _applyDecs(this, [[_simpleCycleDecs, 1, "simpleCycle"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto18(this), _init_simpleCycle(this));
      get [(_simpleCycleDecs = property({
        input: ['simpleCycle'],
        compute: () => {}
      }), "simpleCycle")]() {
        return this.#A;
      }
      set simpleCycle(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-simple-cycle', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.simpleCycle.input is cyclic.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('input cannot be cyclic (complex)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto19, _aDecs, _init_a, _bDecs, _init_b, _cDecs, _init_c;
    class TestElement extends XElement {
      static {
        [_init_a, _init_b, _init_c, _initProto19] = _applyDecs(this, [[_aDecs, 1, "a"], [_bDecs, 1, "b"], [_cDecs, 1, "c"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto19(this), _init_a(this));
      get [(_aDecs = property({
        input: ['c'],
        compute: () => {}
      }), _bDecs = property({
        input: ['a'],
        compute: () => {}
      }), _cDecs = property({
        input: ['b'],
        compute: () => {}
      }), "a")]() {
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
    }
    customElements.define('test-element-complex-cycle', TestElement);
  } catch (error) {
    const expected = 'TestElement.prototype.a.input is cyclic.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('attribute cannot be declared on unserializable types', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto20, _unserializableDecs, _init_unserializable;
    class TestElement extends XElement {
      static {
        [_init_unserializable, _initProto20] = _applyDecs(this, [[_unserializableDecs, 1, "unserializable"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto20(this), _init_unserializable(this));
      get [(_unserializableDecs = property({
        type: Function,
        attribute: 'nope'
      }), "unserializable")]() {
        return this.#A;
      }
      set unserializable(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-unserializable', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.prototype.unserializable.type" (Function) but "TestElement.prototype.unserializable.attribute" is defined.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('input cannot be declared without a compute callback', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto21, _missingComputeDecs, _init_missingCompute;
    class TestElement extends XElement {
      static {
        [_init_missingCompute, _initProto21] = _applyDecs(this, [[_missingComputeDecs, 1, "missingCompute"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto21(this), _init_missingCompute(this));
      get [(_missingComputeDecs = property({
        input: ['foo', 'bar', 'baz']
      }), "missingCompute")]() {
        return this.#A;
      }
      set missingCompute(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-missing-compute', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.missingCompute.input" without "TestElement.prototype.missingCompute.compute" (computed properties require a compute callback).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('compute cannot be declared without an input callback', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto22, _missingInputDecs, _init_missingInput;
    class TestElement extends XElement {
      static {
        [_init_missingInput, _initProto22] = _applyDecs(this, [[_missingInputDecs, 1, "missingInput"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto22(this), _init_missingInput(this));
      get [(_missingInputDecs = property({
        compute: () => {}
      }), "missingInput")]() {
        return this.#A;
      }
      set missingInput(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-missing-input', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.missingInput.compute" without "TestElement.prototype.missingInput.input" (computed properties require input).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('initial cannot be declared for a computed property', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto23, _unexpectedValueDecs, _init_unexpectedValue;
    class TestElement extends XElement {
      static {
        [_init_unexpectedValue, _initProto23] = _applyDecs(this, [[_unexpectedValueDecs, 1, "unexpectedValue"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto23(this), _init_unexpectedValue(this));
      get [(_unexpectedValueDecs = property({
        compute: () => {},
        input: [],
        initial: 5
      }), "unexpectedValue")]() {
        return this.#A;
      }
      set unexpectedValue(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-computed-initial', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.unexpectedValue.initial" and "TestElement.prototype.unexpectedValue.compute" (computed properties cannot set an initial value).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  This test validates that computed properties cannot be readOnly, but since
//  readOnly doesn't exist in decorators, skip this test.
it.skip('readOnly cannot be declared for a computed property', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          unexpectedValue: {
            compute: () => {},
            input: [],
            readOnly: true
          }
        };
      }
    }
    customElements.define('test-element-computed-readonly', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.unexpectedValue.readOnly" and "TestElement.prototype.unexpectedValue.compute" (computed properties cannot define read-only).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: The readOnly configuration doesn't exist in the decorator API.
//  This test validates that internal properties cannot be readOnly, but since
//  readOnly doesn't exist in decorators, skip this test.
it.skip('internal properties cannot also be readOnly', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    class TestElement extends XElement {
      static get properties() {
        return {
          internalReadOnlyProperty: {
            type: String,
            internal: true,
            readOnly: true
          }
        };
      }
    }
    customElements.define('test-element-internal-readonly', TestElement);
  } catch (error) {
    const expected = 'Both "TestElement.prototype.internalReadOnlyProperty.internal" and "TestElement.prototype.internalReadOnlyProperty.readOnly" are true (read-only properties cannot be internal).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('internal properties cannot also be reflected', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto24, _internalReflectedPropertyDecs, _init_internalReflectedProperty, _get_internalReflectedProperty, _set_internalReflectedProperty;
    class TestElement extends XElement {
      static [(_internalReflectedPropertyDecs = property({
        type: String,
        reflect: true
      }), "_")];
      static {
        delete this._;
        [_init_internalReflectedProperty, _get_internalReflectedProperty, _set_internalReflectedProperty, _initProto24] = _applyDecs(this, [[_internalReflectedPropertyDecs, 1, "internalReflectedProperty", o => o.#A, (o, v) => o.#A = v]], [], 0, _ => #internalReflectedProperty in _, XElement).e;
      }
      #A = (_initProto24(this), _init_internalReflectedProperty(this));
      set #internalReflectedProperty(v) {
        _set_internalReflectedProperty(this, v);
      }
      get #internalReflectedProperty() {
        return _get_internalReflectedProperty(this);
      }
    }
    customElements.define('test-element-internal-reflect', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.#internalReflectedProperty.reflect" but property is private (private properties cannot be reflected).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('internal properties cannot define an attribute', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto25, _internalAttributePropertyDecs, _init_internalAttributeProperty, _get_internalAttributeProperty, _set_internalAttributeProperty;
    class TestElement extends XElement {
      static [(_internalAttributePropertyDecs = property({
        type: String,
        attribute: 'custom-attribute'
      }), "_")];
      static {
        delete this._;
        [_init_internalAttributeProperty, _get_internalAttributeProperty, _set_internalAttributeProperty, _initProto25] = _applyDecs(this, [[_internalAttributePropertyDecs, 1, "internalAttributeProperty", o => o.#A, (o, v) => o.#A = v]], [], 0, _ => #internalAttributeProperty in _, XElement).e;
      }
      #A = (_initProto25(this), _init_internalAttributeProperty(this));
      set #internalAttributeProperty(v) {
        _set_internalAttributeProperty(this, v);
      }
      get #internalAttributeProperty() {
        return _get_internalAttributeProperty(this);
      }
    }
    customElements.define('test-element-internal-attr', TestElement);
  } catch (error) {
    const expected = 'Found "TestElement.prototype.#internalAttributeProperty.attribute" but property is private (private properties cannot have attributes).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('reflected properties must have serializable type', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto26, _nonSerializablePropertyDecs, _init_nonSerializableProperty;
    class TestElement extends XElement {
      static {
        [_init_nonSerializableProperty, _initProto26] = _applyDecs(this, [[_nonSerializablePropertyDecs, 1, "nonSerializableProperty"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto26(this), _init_nonSerializableProperty(this));
      get [(_nonSerializablePropertyDecs = property({
        type: Object,
        reflect: true
      }), "nonSerializableProperty")]() {
        return this.#A;
      }
      set nonSerializableProperty(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-reflect-nonserialized', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.prototype.nonSerializableProperty.type" (Object) but "TestElement.prototype.nonSerializableProperty.reflect" is true.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('reflected properties must have serializable type (2)', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto27, _typelessPropertyDecs, _init_typelessProperty;
    class TestElement extends XElement {
      static {
        [_init_typelessProperty, _initProto27] = _applyDecs(this, [[_typelessPropertyDecs, 1, "typelessProperty"]], [], 0, void 0, XElement).e;
      }
      #A = (_initProto27(this), _init_typelessProperty(this));
      get [(_typelessPropertyDecs = property({
        reflect: true
      }), "typelessProperty")]() {
        return this.#A;
      }
      set typelessProperty(v) {
        this.#A = v;
      }
    }
    customElements.define('test-element-reflect-typeless', TestElement);
  } catch (error) {
    const expected = 'Found unserializable "TestElement.prototype.typelessProperty.type" (Undefined) but "TestElement.prototype.typelessProperty.reflect" is true.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
it('listeners as an object should map to functions', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _fooDecs3, _init_foo3;
    class TestElement extends XElement {
      static {
        [_init_foo3] = _applyDecs(this, [[_fooDecs3, 8, "foo"]], [], 0, void 0, XElement).e;
      }
      // With decorators, this error would be caught differently since we
      // can't decorate non-functions. This test might need to be updated
      // to test the decorator API's validation.
      static [(_fooDecs3 = listener('click'), "foo")] = _init_foo3(this, undefined);
    }
    customElements.define('test-element-bad-listener', TestElement);
  } catch (error) {
    // The error message will be different with decorators
    passed = true;
    message = error.message;
  }
  assert(passed, message);
});
it('listener options should be an object', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initStatic, _onClickDecs;
    class TestElement extends XElement {
      static {
        [_initStatic] = _applyDecs(this, [[_onClickDecs, 10, "onClick"]], [], 0, void 0, XElement).e;
        _initStatic(this);
      }
      static [(_onClickDecs = listener('click', 'not-an-object'), "onClick")]() {}
    }
    customElements.define('test-element-bad-options', TestElement);
  } catch (error) {
    const expected = 'Unexpected value for "TestElement.onClick" options (expected Object, got String).';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});

// TODO: #346: This is a temporary limitation of the babel decorator
//  transpiler. We will be able to invert this test later to prove that we can
//  in fact use the same private property names in parent and child.
it('cannot use same private property name in parent and child', () => {
  let passed = false;
  let message = 'no error was thrown';
  try {
    let _initProto28, _fieldDecs, _init_field, _get_field, _set_field, _initProto29, _fieldDecs2, _init_field2, _get_field2, _set_field2;
    class ParentElement extends XElement {
      static [(_fieldDecs = property({
        type: String
      }), "_")];
      static {
        delete this._;
        [_init_field, _get_field, _set_field, _initProto28] = _applyDecs(this, [[_fieldDecs, 1, "field", o => o.#A, (o, v) => o.#A = v]], [], 0, _ => #field in _, XElement).e;
      }
      #A = (_initProto28(this), _init_field(this));
      set #field(v) {
        _set_field(this, v);
      }
      get #field() {
        return _get_field(this);
      }
    }
    class ChildElement extends ParentElement {
      static [(_fieldDecs2 = property({
        type: String
      }), "_")];
      static {
        delete this._;
        [_init_field2, _get_field2, _set_field2, _initProto29] = _applyDecs(this, [[_fieldDecs2, 1, "field", o => o.#A, (o, v) => o.#A = v]], [], 0, _ => #field in _, ParentElement).e;
      }
      #A = (_initProto29(this), _init_field2(this));
      set #field(v) {
        _set_field2(this, v);
      }
      get #field() {
        return _get_field2(this);
      }
    }
    customElements.define('test-private-collision', ChildElement);
  } catch (error) {
    const expected = 'ChildElement: Cannot use private property "#field" in both parent and child classes.';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJsaXN0ZW5lciIsInBhc3NlZCIsIm1lc3NhZ2UiLCJfaW5pdFByb3RvIiwiX2NvbXB1dGVkS2V5RGVjcyIsIl9pbml0X2NvbXB1dGVkS2V5IiwiVGVzdEVsZW1lbnQiLCJfYXBwbHlEZWNzIiwiZSIsIkEiLCJ0eXBlIiwiU3RyaW5nIiwianVzdC1zdG9wIiwidiIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiZXJyb3IiLCJfaW5pdFByb3RvMiIsIl9va0RlY3MiLCJfaW5pdF9vayIsImF0dHJpYnV0ZSIsIm9rIiwiZXhwZWN0ZWQiLCJfaW5pdFByb3RvMyIsIl9kaXNwYXRjaEVycm9yRGVjcyIsIl9pbml0X2Rpc3BhdGNoRXJyb3IiLCJkaXNwYXRjaEVycm9yIiwiX2luaXRQcm90bzQiLCJfYmFkUHJvcGVydHlEZWNzIiwiX2luaXRfYmFkUHJvcGVydHkiLCJkb2VzTm90RXhpc3QiLCJiYWRQcm9wZXJ0eSIsIl9pbml0UHJvdG81IiwiX2JhZFByb3BlcnR5RGVjczIiLCJfaW5pdF9iYWRQcm9wZXJ0eTIiLCJ1bmRlZmluZWQiLCJfaW5pdFByb3RvNiIsIl9iYWRUeXBlRGVjcyIsIl9pbml0X2JhZFR5cGUiLCJiYWRUeXBlIiwiX2luaXRQcm90bzciLCJfYmFkQ29tcHV0ZURlY3MiLCJfaW5pdF9iYWRDb21wdXRlIiwiY29tcHV0ZSIsImJhZENvbXB1dGUiLCJfaW5pdFByb3RvOCIsIl9iYWRPYnNlcnZlRGVjcyIsIl9pbml0X2JhZE9ic2VydmUiLCJvYnNlcnZlIiwiYmFkT2JzZXJ2ZSIsIl9pbml0UHJvdG85IiwiX2JhZEF0dHJpYnV0ZURlY3MiLCJfaW5pdF9iYWRBdHRyaWJ1dGUiLCJiYWRBdHRyaWJ1dGUiLCJfaW5pdFByb3RvMCIsIl9iYWRBdHRyaWJ1dGVEZWNzMiIsIl9pbml0X2JhZEF0dHJpYnV0ZTIiLCJfaW5pdFByb3RvMSIsIl9hdHRyaWJ1dGVEZWNzIiwiX2luaXRfYXR0cmlidXRlIiwiX2FsaWFzZWREZWNzIiwiX2luaXRfYWxpYXNlZCIsIkIiLCJhbGlhc2VkIiwiX2luaXRQcm90bzEwIiwiX2F0dHJpYnV0ZURlY3MyIiwiX2luaXRfYXR0cmlidXRlMiIsIl9hbGlhc2VkRGVjczIiLCJfaW5pdF9hbGlhc2VkMiIsIl9pbml0UHJvdG8xMSIsIl9iYWRWYWx1ZURlY3MiLCJfaW5pdF9iYWRWYWx1ZSIsImRlZmF1bHQiLCJiYWRWYWx1ZSIsIl9pbml0UHJvdG8xMiIsIl9iYWRSZWZsZWN0RGVjcyIsIl9pbml0X2JhZFJlZmxlY3QiLCJyZWZsZWN0IiwiYmFkUmVmbGVjdCIsInNraXAiLCJfaW5pdFByb3RvMTMiLCJfYmFkSW50ZXJuYWxEZWNzIiwiX2luaXRfYmFkSW50ZXJuYWwiLCJpbnRlcm5hbCIsImJhZEludGVybmFsIiwicHJvcGVydGllcyIsImJhZFJlYWRPbmx5IiwicmVhZE9ubHkiLCJfaW5pdFByb3RvMTQiLCJfYmFkSW5wdXREZWNzIiwiX2luaXRfYmFkSW5wdXQiLCJpbnB1dCIsImJhZElucHV0IiwiX2luaXRQcm90bzE1IiwiX2JhZElucHV0RGVjczIiLCJfaW5pdF9iYWRJbnB1dDIiLCJfaW5pdFByb3RvMTYiLCJfZm9vRGVjcyIsIl9pbml0X2ZvbyIsIl9jb21wdXRlZERlY3MiLCJfaW5pdF9jb21wdXRlZCIsImZvbyIsImNvbXB1dGVkIiwiX2luaXRQcm90bzE3IiwiX2Zvb0RlY3MyIiwiX2luaXRfZm9vMiIsIl9iYWRJbnB1dERlY3MzIiwiX2luaXRfYmFkSW5wdXQzIiwiX2luaXRQcm90bzE4IiwiX3NpbXBsZUN5Y2xlRGVjcyIsIl9pbml0X3NpbXBsZUN5Y2xlIiwic2ltcGxlQ3ljbGUiLCJfaW5pdFByb3RvMTkiLCJfYURlY3MiLCJfaW5pdF9hIiwiX2JEZWNzIiwiX2luaXRfYiIsIl9jRGVjcyIsIl9pbml0X2MiLCJhIiwiYiIsIkMiLCJjIiwiX2luaXRQcm90bzIwIiwiX3Vuc2VyaWFsaXphYmxlRGVjcyIsIl9pbml0X3Vuc2VyaWFsaXphYmxlIiwiRnVuY3Rpb24iLCJ1bnNlcmlhbGl6YWJsZSIsIl9pbml0UHJvdG8yMSIsIl9taXNzaW5nQ29tcHV0ZURlY3MiLCJfaW5pdF9taXNzaW5nQ29tcHV0ZSIsIm1pc3NpbmdDb21wdXRlIiwiX2luaXRQcm90bzIyIiwiX21pc3NpbmdJbnB1dERlY3MiLCJfaW5pdF9taXNzaW5nSW5wdXQiLCJtaXNzaW5nSW5wdXQiLCJfaW5pdFByb3RvMjMiLCJfdW5leHBlY3RlZFZhbHVlRGVjcyIsIl9pbml0X3VuZXhwZWN0ZWRWYWx1ZSIsImluaXRpYWwiLCJ1bmV4cGVjdGVkVmFsdWUiLCJpbnRlcm5hbFJlYWRPbmx5UHJvcGVydHkiLCJfaW5pdFByb3RvMjQiLCJfaW50ZXJuYWxSZWZsZWN0ZWRQcm9wZXJ0eURlY3MiLCJfaW5pdF9pbnRlcm5hbFJlZmxlY3RlZFByb3BlcnR5IiwiX2dldF9pbnRlcm5hbFJlZmxlY3RlZFByb3BlcnR5IiwiX3NldF9pbnRlcm5hbFJlZmxlY3RlZFByb3BlcnR5IiwiXyIsIm8iLCJpbnRlcm5hbFJlZmxlY3RlZFByb3BlcnR5IiwiI2ludGVybmFsUmVmbGVjdGVkUHJvcGVydHkiLCJfaW5pdFByb3RvMjUiLCJfaW50ZXJuYWxBdHRyaWJ1dGVQcm9wZXJ0eURlY3MiLCJfaW5pdF9pbnRlcm5hbEF0dHJpYnV0ZVByb3BlcnR5IiwiX2dldF9pbnRlcm5hbEF0dHJpYnV0ZVByb3BlcnR5IiwiX3NldF9pbnRlcm5hbEF0dHJpYnV0ZVByb3BlcnR5IiwiaW50ZXJuYWxBdHRyaWJ1dGVQcm9wZXJ0eSIsIiNpbnRlcm5hbEF0dHJpYnV0ZVByb3BlcnR5IiwiX2luaXRQcm90bzI2IiwiX25vblNlcmlhbGl6YWJsZVByb3BlcnR5RGVjcyIsIl9pbml0X25vblNlcmlhbGl6YWJsZVByb3BlcnR5IiwiT2JqZWN0Iiwibm9uU2VyaWFsaXphYmxlUHJvcGVydHkiLCJfaW5pdFByb3RvMjciLCJfdHlwZWxlc3NQcm9wZXJ0eURlY3MiLCJfaW5pdF90eXBlbGVzc1Byb3BlcnR5IiwidHlwZWxlc3NQcm9wZXJ0eSIsIl9mb29EZWNzMyIsIl9pbml0X2ZvbzMiLCJfaW5pdFN0YXRpYyIsIl9vbkNsaWNrRGVjcyIsIl9pbml0UHJvdG8yOCIsIl9maWVsZERlY3MiLCJfaW5pdF9maWVsZCIsIl9nZXRfZmllbGQiLCJfc2V0X2ZpZWxkIiwiX2luaXRQcm90bzI5IiwiX2ZpZWxkRGVjczIiLCJfaW5pdF9maWVsZDIiLCJfZ2V0X2ZpZWxkMiIsIl9zZXRfZmllbGQyIiwiUGFyZW50RWxlbWVudCIsImZpZWxkIiwiI2ZpZWxkIiwiQ2hpbGRFbGVtZW50Il0sInNvdXJjZXMiOlsidGVzdC1hbmFseXNpcy1lcnJvcnMuc3JjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCwgaXQgfSBmcm9tICdAbmV0ZmxpeC94LXRlc3QveC10ZXN0LmpzJztcbmltcG9ydCB7IFhFbGVtZW50LCBwcm9wZXJ0eSwgbGlzdGVuZXIgfSBmcm9tICcuLi94LWVsZW1lbnQtbmV4dC5qcyc7XG5cbml0KCdwcm9wZXJ0aWVzIHNob3VsZCBub3QgaGF2ZSBoeXBoZW5zIChjb25mbGljdHMgd2l0aCBhdHRyaWJ1dGUgbmFtZXMpJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nIH0pXG4gICAgICBhY2Nlc3NvciAnanVzdC1zdG9wJztcbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtaHlwaGVuJywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIE5vdGU6IFdpdGggZGVjb3JhdG9ycywgdGhlIGVycm9yIG1lc3NhZ2UgbWF5IGJlIGRpZmZlcmVudCBhcyB3ZSdyZVxuICAgIC8vIGRlY29yYXRpbmcgYSBxdW90ZWQgcHJvcGVydHkgbmFtZSB3aGljaCBtaWdodCBmYWlsIGF0IHRoZSBkZWNvcmF0b3IgbGV2ZWxcbiAgICBwYXNzZWQgPSB0cnVlO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdwcm9wZXJ0eSBhdHRyaWJ1dGVzIHNob3VsZCBub3QgaGF2ZSBub24tc3RhbmRhcmQgY2FzaW5nJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBhdHRyaWJ1dGU6ICd0aGlzLUlTLW5vdC1PSycgfSlcbiAgICAgIGFjY2Vzc29yIG9rO1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1hdHRyLWNhc2UnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVGVzdEVsZW1lbnQucHJvdG90eXBlLm9rIGhhcyBub24tc3RhbmRhcmQgYXR0cmlidXRlIGNhc2luZyBcInRoaXMtSVMtbm90LU9LXCIgKHVzZSBsb3dlci1jYXNlZCBuYW1lcykuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgncHJvcGVydGllcyBzaG91bGQgbm90IHNoYWRvdyBYRWxlbWVudCBwcm90b3R5cGUgaW50ZXJmYWNlJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHt9KVxuICAgICAgYWNjZXNzb3IgZGlzcGF0Y2hFcnJvcjtcbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtc2hhZG93JywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1VuZXhwZWN0ZWQga2V5IFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLmRpc3BhdGNoRXJyb3JcIiBzaGFkb3dzIGluIFhFbGVtZW50LnByb3RvdHlwZSBpbnRlcmZhY2UuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgncHJvcGVydHkga2V5cyBzaG91bGQgb25seSBiZSBmcm9tIG91ciBrbm93biBzZXQnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyBkb2VzTm90RXhpc3Q6IHRydWUgfSlcbiAgICAgIGFjY2Vzc29yIGJhZFByb3BlcnR5O1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQta2V5JywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1VuZXhwZWN0ZWQga2V5IFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLmJhZFByb3BlcnR5LmRvZXNOb3RFeGlzdFwiLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3Byb3BlcnRpZXMgc2hvdWxkIGJlIG9iamVjdHMnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkodW5kZWZpbmVkKVxuICAgICAgYWNjZXNzb3IgYmFkUHJvcGVydHk7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWJhZC1wcm9wLXR5cGUnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVGVzdEVsZW1lbnQucHJvdG90eXBlLmJhZFByb3BlcnR5IGhhcyBhbiB1bmV4cGVjdGVkIHZhbHVlIChleHBlY3RlZCBPYmplY3QsIGdvdCBVbmRlZmluZWQpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3R5cGUgc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyB0eXBlOiB1bmRlZmluZWQgfSlcbiAgICAgIGFjY2Vzc29yIGJhZFR5cGU7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWJhZC10eXBlJywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1VuZXhwZWN0ZWQgdmFsdWUgZm9yIFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLmJhZFR5cGUudHlwZVwiIChleHBlY3RlZCBjb25zdHJ1Y3RvciBGdW5jdGlvbiwgZ290IFVuZGVmaW5lZCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnY29tcHV0ZSBzaG91bGQgYmUgYSBmdW5jdGlvbicsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIEBwcm9wZXJ0eSh7IGNvbXB1dGU6IHVuZGVmaW5lZCB9KVxuICAgICAgYWNjZXNzb3IgYmFkQ29tcHV0ZTtcbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtYmFkLWNvbXB1dGUnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCB2YWx1ZSBmb3IgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUuYmFkQ29tcHV0ZS5jb21wdXRlXCIgKGV4cGVjdGVkIEZ1bmN0aW9uLCBnb3QgVW5kZWZpbmVkKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdvYnNlcnZlIHNob3VsZCBiZSBhIGZ1bmN0aW9uJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgb2JzZXJ2ZTogdW5kZWZpbmVkIH0pXG4gICAgICBhY2Nlc3NvciBiYWRPYnNlcnZlO1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQtb2JzZXJ2ZScsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRPYnNlcnZlLm9ic2VydmVcIiAoZXhwZWN0ZWQgRnVuY3Rpb24sIGdvdCBVbmRlZmluZWQpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2F0dHJpYnV0ZSBzaG91bGQgYmUgYSBzdHJpbmcnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyBhdHRyaWJ1dGU6IHVuZGVmaW5lZCB9KVxuICAgICAgYWNjZXNzb3IgYmFkQXR0cmlidXRlO1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQtYXR0cicsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRBdHRyaWJ1dGUuYXR0cmlidXRlXCIgKGV4cGVjdGVkIFN0cmluZywgZ290IFVuZGVmaW5lZCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnYXR0cmlidXRlIHNob3VsZCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyBhdHRyaWJ1dGU6ICcnIH0pXG4gICAgICBhY2Nlc3NvciBiYWRBdHRyaWJ1dGU7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWVtcHR5LWF0dHInLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCB2YWx1ZSBmb3IgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUuYmFkQXR0cmlidXRlLmF0dHJpYnV0ZVwiIChleHBlY3RlZCBub24tZW1wdHkgU3RyaW5nKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdhdHRyaWJ1dGVzIGNhbm5vdCBiZSBkdXBsaWNhdGVkICgxKScsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZyB9KVxuICAgICAgYWNjZXNzb3IgYXR0cmlidXRlO1xuXG4gICAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGF0dHJpYnV0ZTogJ2F0dHJpYnV0ZScgfSlcbiAgICAgIGFjY2Vzc29yIGFsaWFzZWQ7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWR1cC1hdHRyLTEnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVGVzdEVsZW1lbnQucHJvdG90eXBlLmFsaWFzZWQgY2F1c2VzIGEgZHVwbGljYXRlZCBhdHRyaWJ1dGUgXCJhdHRyaWJ1dGVcIi4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdhdHRyaWJ1dGVzIGNhbm5vdCBiZSBkdXBsaWNhdGVkICgyKScsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIEBwcm9wZXJ0eSh7fSlcbiAgICAgIGFjY2Vzc29yIGF0dHJpYnV0ZTtcblxuICAgICAgQHByb3BlcnR5KHsgYXR0cmlidXRlOiAnYXR0cmlidXRlJyB9KVxuICAgICAgYWNjZXNzb3IgYWxpYXNlZDtcbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtZHVwLWF0dHItMicsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdUZXN0RWxlbWVudC5wcm90b3R5cGUuYWxpYXNlZCBjYXVzZXMgYSBkdXBsaWNhdGVkIGF0dHJpYnV0ZSBcImF0dHJpYnV0ZVwiLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2RlZmF1bHQgbXVzdCBiZSBhIHNjYWxhciBvciBhIGZ1bmN0aW9uJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgZGVmYXVsdDoge30gfSlcbiAgICAgIGFjY2Vzc29yIGJhZFZhbHVlO1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQtZGVmYXVsdCcsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRWYWx1ZS5kZWZhdWx0XCIgKGV4cGVjdGVkIEJvb2xlYW4sIFN0cmluZywgTnVtYmVyLCBvciBGdW5jdGlvbiwgZ290IE9iamVjdCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgncmVmbGVjdCBzaG91bGQgYmUgYSBib29sZWFuJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgcmVmbGVjdDogdW5kZWZpbmVkIH0pXG4gICAgICBhY2Nlc3NvciBiYWRSZWZsZWN0O1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQtcmVmbGVjdCcsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRSZWZsZWN0LnJlZmxlY3RcIiAoZXhwZWN0ZWQgQm9vbGVhbiwgZ290IFVuZGVmaW5lZCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBUaGUgaW50ZXJuYWwgY29uZmlndXJhdGlvbiBkb2Vzbid0IGV4aXN0IGluIHRoZSBkZWNvcmF0b3IgQVBJLlxuLy8gIFVzZXJzIHNob3VsZCB1c2UgcHJpdmF0ZSBmaWVsZHMgdG8gYWNoaWV2ZSBpbnRlcm5hbCBwcm9wZXJ0eSBiZWhhdmlvci5cbi8vICBTa2lwIHRoaXMgdGVzdCBhcyBpbnRlcm5hbCBjb25maWd1cmF0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgd2l0aCBkZWNvcmF0b3JzLlxuaXQuc2tpcCgnaW50ZXJuYWwgc2hvdWxkIGJlIGEgYm9vbGVhbicsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIEBwcm9wZXJ0eSh7IGludGVybmFsOiB1bmRlZmluZWQgfSlcbiAgICAgIGFjY2Vzc29yIGJhZEludGVybmFsO1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQtaW50ZXJuYWwnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCB2YWx1ZSBmb3IgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUuYmFkSW50ZXJuYWwuaW50ZXJuYWxcIiAoZXhwZWN0ZWQgQm9vbGVhbiwgZ290IFVuZGVmaW5lZCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG4vLyBUT0RPOiAjMzQ2OiBUaGUgcmVhZE9ubHkgY29uZmlndXJhdGlvbiBkb2Vzbid0IGV4aXN0IGluIHRoZSBkZWNvcmF0b3IgQVBJLlxuLy8gIEluc3RlYWQsIHVzZXJzIHNob3VsZCB1c2UgYWNjZXNzb3Itb25seSBkZWNvcmF0b3JzIChubyBzZXR0ZXIpIG9yIHByaXZhdGVcbi8vICBmaWVsZHMgd2l0aCBhIGdldHRlciBhY2Nlc3NvciB0byBhY2hpZXZlIHJlYWQtb25seSBiZWhhdmlvci4gU2tpcCB0aGlzIHRlc3Rcbi8vICBhcyByZWFkT25seSBjb25maWd1cmF0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgd2l0aCBkZWNvcmF0b3JzLlxuaXQuc2tpcCgncmVhZE9ubHkgc2hvdWxkIGJlIGEgYm9vbGVhbicsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAgICAgICAgcmV0dXJuIHsgYmFkUmVhZE9ubHk6IHsgcmVhZE9ubHk6IHVuZGVmaW5lZCB9IH07XG4gICAgICB9XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWJhZC1yZWFkb25seScsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRSZWFkT25seS5yZWFkT25seVwiIChleHBlY3RlZCBCb29sZWFuLCBnb3QgVW5kZWZpbmVkKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdpbnB1dCBzaG91bGQgYmUgYW4gYXJyYXknLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyBpbnB1dDoge30gfSlcbiAgICAgIGFjY2Vzc29yIGJhZElucHV0O1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQtaW5wdXQtdHlwZScsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRJbnB1dC5pbnB1dFwiIChleHBlY3RlZCBBcnJheSwgZ290IE9iamVjdCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnaW5wdXQgaXRlbXMgc2hvdWxkIGJlIHN0cmluZ3MnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyBpbnB1dDogWydmb28nLCAnYmFyJywgdW5kZWZpbmVkXSB9KVxuICAgICAgYWNjZXNzb3IgYmFkSW5wdXQ7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWJhZC1pbnB1dC1pdGVtcycsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbmV4cGVjdGVkIHZhbHVlIGZvciBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRJbnB1dC5pbnB1dFsyXVwiIChleHBlY3RlZCBTdHJpbmcsIGdvdCBVbmRlZmluZWQpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2lucHV0IGtleXMgY2Fubm90IGJlIGR1cGxpY2F0ZWQnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICAgIGFjY2Vzc29yIGZvbztcblxuICAgICAgQHByb3BlcnR5KHsgaW5wdXQ6IFsnZm9vJywgJ2ZvbyddLCBjb21wdXRlOiAoKSA9PiB7fSB9KVxuICAgICAgYWNjZXNzb3IgY29tcHV0ZWQ7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWR1cGxpY2F0ZS1pbnB1dCcsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdEdXBsaWNhdGUga2V5IFwiZm9vXCIgaW4gXCJUZXN0RWxlbWVudC5wcm90b3R5cGUuY29tcHV0ZWQuaW5wdXRcIiAoZWFjaCBpbnB1dCBrZXkgbXVzdCBiZSB1bmlxdWUpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ2lucHV0IG11c3QgYmUgZGVjbGFyZWQgYXMgb3RoZXIgcHJvcGVydHkgbmFtZXMnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoe30pXG4gICAgICBhY2Nlc3NvciBmb287XG5cbiAgICAgIEBwcm9wZXJ0eSh7IGlucHV0OiBbJ2ZvbycsICdiYXInXSwgY29tcHV0ZTogKCkgPT4ge30gfSlcbiAgICAgIGFjY2Vzc29yIGJhZElucHV0O1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC11bmRlY2xhcmVkLWlucHV0JywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1Rlc3RFbGVtZW50LnByb3RvdHlwZS5iYWRJbnB1dC5pbnB1dFsxXSBoYXMgYW4gdW5leHBlY3RlZCBpdGVtIChcImJhclwiIGNhbm5vdCBiZSByZXNvbHZlZCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnaW5wdXQgY2Fubm90IGJlIGN5Y2xpYyAoc2ltcGxlKScsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIEBwcm9wZXJ0eSh7IGlucHV0OiBbJ3NpbXBsZUN5Y2xlJ10sIGNvbXB1dGU6ICgpID0+IHt9IH0pXG4gICAgICBhY2Nlc3NvciBzaW1wbGVDeWNsZTtcbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtc2ltcGxlLWN5Y2xlJywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1Rlc3RFbGVtZW50LnByb3RvdHlwZS5zaW1wbGVDeWNsZS5pbnB1dCBpcyBjeWNsaWMuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnaW5wdXQgY2Fubm90IGJlIGN5Y2xpYyAoY29tcGxleCknLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyBpbnB1dDogWydjJ10sIGNvbXB1dGU6ICgpID0+IHt9IH0pXG4gICAgICBhY2Nlc3NvciBhO1xuXG4gICAgICBAcHJvcGVydHkoeyBpbnB1dDogWydhJ10sIGNvbXB1dGU6ICgpID0+IHt9IH0pXG4gICAgICBhY2Nlc3NvciBiO1xuXG4gICAgICBAcHJvcGVydHkoeyBpbnB1dDogWydiJ10sIGNvbXB1dGU6ICgpID0+IHt9IH0pXG4gICAgICBhY2Nlc3NvciBjO1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1jb21wbGV4LWN5Y2xlJywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ1Rlc3RFbGVtZW50LnByb3RvdHlwZS5hLmlucHV0IGlzIGN5Y2xpYy4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdhdHRyaWJ1dGUgY2Fubm90IGJlIGRlY2xhcmVkIG9uIHVuc2VyaWFsaXphYmxlIHR5cGVzJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgdHlwZTogRnVuY3Rpb24sIGF0dHJpYnV0ZTogJ25vcGUnIH0pXG4gICAgICBhY2Nlc3NvciB1bnNlcmlhbGl6YWJsZTtcbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtdW5zZXJpYWxpemFibGUnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnRm91bmQgdW5zZXJpYWxpemFibGUgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUudW5zZXJpYWxpemFibGUudHlwZVwiIChGdW5jdGlvbikgYnV0IFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLnVuc2VyaWFsaXphYmxlLmF0dHJpYnV0ZVwiIGlzIGRlZmluZWQuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnaW5wdXQgY2Fubm90IGJlIGRlY2xhcmVkIHdpdGhvdXQgYSBjb21wdXRlIGNhbGxiYWNrJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgaW5wdXQ6IFsnZm9vJywgJ2JhcicsICdiYXonXSB9KVxuICAgICAgYWNjZXNzb3IgbWlzc2luZ0NvbXB1dGU7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LW1pc3NpbmctY29tcHV0ZScsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdGb3VuZCBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5taXNzaW5nQ29tcHV0ZS5pbnB1dFwiIHdpdGhvdXQgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUubWlzc2luZ0NvbXB1dGUuY29tcHV0ZVwiIChjb21wdXRlZCBwcm9wZXJ0aWVzIHJlcXVpcmUgYSBjb21wdXRlIGNhbGxiYWNrKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdjb21wdXRlIGNhbm5vdCBiZSBkZWNsYXJlZCB3aXRob3V0IGFuIGlucHV0IGNhbGxiYWNrJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQHByb3BlcnR5KHsgY29tcHV0ZTogKCkgPT4ge30gfSlcbiAgICAgIGFjY2Vzc29yIG1pc3NpbmdJbnB1dDtcbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtbWlzc2luZy1pbnB1dCcsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdGb3VuZCBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5taXNzaW5nSW5wdXQuY29tcHV0ZVwiIHdpdGhvdXQgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUubWlzc2luZ0lucHV0LmlucHV0XCIgKGNvbXB1dGVkIHByb3BlcnRpZXMgcmVxdWlyZSBpbnB1dCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnaW5pdGlhbCBjYW5ub3QgYmUgZGVjbGFyZWQgZm9yIGEgY29tcHV0ZWQgcHJvcGVydHknLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyBjb21wdXRlOiAoKSA9PiB7fSwgaW5wdXQ6IFtdLCBpbml0aWFsOiA1IH0pXG4gICAgICBhY2Nlc3NvciB1bmV4cGVjdGVkVmFsdWU7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWNvbXB1dGVkLWluaXRpYWwnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnRm91bmQgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUudW5leHBlY3RlZFZhbHVlLmluaXRpYWxcIiBhbmQgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUudW5leHBlY3RlZFZhbHVlLmNvbXB1dGVcIiAoY29tcHV0ZWQgcHJvcGVydGllcyBjYW5ub3Qgc2V0IGFuIGluaXRpYWwgdmFsdWUpLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuLy8gVE9ETzogIzM0NjogVGhlIHJlYWRPbmx5IGNvbmZpZ3VyYXRpb24gZG9lc24ndCBleGlzdCBpbiB0aGUgZGVjb3JhdG9yIEFQSS5cbi8vICBUaGlzIHRlc3QgdmFsaWRhdGVzIHRoYXQgY29tcHV0ZWQgcHJvcGVydGllcyBjYW5ub3QgYmUgcmVhZE9ubHksIGJ1dCBzaW5jZVxuLy8gIHJlYWRPbmx5IGRvZXNuJ3QgZXhpc3QgaW4gZGVjb3JhdG9ycywgc2tpcCB0aGlzIHRlc3QuXG5pdC5za2lwKCdyZWFkT25seSBjYW5ub3QgYmUgZGVjbGFyZWQgZm9yIGEgY29tcHV0ZWQgcHJvcGVydHknLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgICAgIHJldHVybiB7IHVuZXhwZWN0ZWRWYWx1ZTogeyBjb21wdXRlOiAoKSA9PiB7fSwgaW5wdXQ6IFtdLCByZWFkT25seTogdHJ1ZSB9IH07XG4gICAgICB9XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWNvbXB1dGVkLXJlYWRvbmx5JywgVGVzdEVsZW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ0ZvdW5kIFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLnVuZXhwZWN0ZWRWYWx1ZS5yZWFkT25seVwiIGFuZCBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS51bmV4cGVjdGVkVmFsdWUuY29tcHV0ZVwiIChjb21wdXRlZCBwcm9wZXJ0aWVzIGNhbm5vdCBkZWZpbmUgcmVhZC1vbmx5KS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFRoZSByZWFkT25seSBjb25maWd1cmF0aW9uIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGRlY29yYXRvciBBUEkuXG4vLyAgVGhpcyB0ZXN0IHZhbGlkYXRlcyB0aGF0IGludGVybmFsIHByb3BlcnRpZXMgY2Fubm90IGJlIHJlYWRPbmx5LCBidXQgc2luY2Vcbi8vICByZWFkT25seSBkb2Vzbid0IGV4aXN0IGluIGRlY29yYXRvcnMsIHNraXAgdGhpcyB0ZXN0LlxuaXQuc2tpcCgnaW50ZXJuYWwgcHJvcGVydGllcyBjYW5ub3QgYWxzbyBiZSByZWFkT25seScsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnRlcm5hbFJlYWRPbmx5UHJvcGVydHk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGludGVybmFsOiB0cnVlLFxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtaW50ZXJuYWwtcmVhZG9ubHknLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnQm90aCBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5pbnRlcm5hbFJlYWRPbmx5UHJvcGVydHkuaW50ZXJuYWxcIiBhbmQgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUuaW50ZXJuYWxSZWFkT25seVByb3BlcnR5LnJlYWRPbmx5XCIgYXJlIHRydWUgKHJlYWQtb25seSBwcm9wZXJ0aWVzIGNhbm5vdCBiZSBpbnRlcm5hbCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnaW50ZXJuYWwgcHJvcGVydGllcyBjYW5ub3QgYWxzbyBiZSByZWZsZWN0ZWQnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZmxlY3Q6IHRydWUsXG4gICAgICB9KVxuICAgICAgYWNjZXNzb3IgI2ludGVybmFsUmVmbGVjdGVkUHJvcGVydHk7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWludGVybmFsLXJlZmxlY3QnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnRm91bmQgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUuI2ludGVybmFsUmVmbGVjdGVkUHJvcGVydHkucmVmbGVjdFwiIGJ1dCBwcm9wZXJ0eSBpcyBwcml2YXRlIChwcml2YXRlIHByb3BlcnRpZXMgY2Fubm90IGJlIHJlZmxlY3RlZCkuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnaW50ZXJuYWwgcHJvcGVydGllcyBjYW5ub3QgZGVmaW5lIGFuIGF0dHJpYnV0ZScsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgYXR0cmlidXRlOiAnY3VzdG9tLWF0dHJpYnV0ZScsXG4gICAgICB9KVxuICAgICAgYWNjZXNzb3IgI2ludGVybmFsQXR0cmlidXRlUHJvcGVydHk7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LWludGVybmFsLWF0dHInLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnRm91bmQgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUuI2ludGVybmFsQXR0cmlidXRlUHJvcGVydHkuYXR0cmlidXRlXCIgYnV0IHByb3BlcnR5IGlzIHByaXZhdGUgKHByaXZhdGUgcHJvcGVydGllcyBjYW5ub3QgaGF2ZSBhdHRyaWJ1dGVzKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbml0KCdyZWZsZWN0ZWQgcHJvcGVydGllcyBtdXN0IGhhdmUgc2VyaWFsaXphYmxlIHR5cGUnLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgIHJlZmxlY3Q6IHRydWUsXG4gICAgICB9KVxuICAgICAgYWNjZXNzb3Igbm9uU2VyaWFsaXphYmxlUHJvcGVydHk7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LXJlZmxlY3Qtbm9uc2VyaWFsaXplZCcsIFRlc3RFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBleHBlY3RlZCA9ICdGb3VuZCB1bnNlcmlhbGl6YWJsZSBcIlRlc3RFbGVtZW50LnByb3RvdHlwZS5ub25TZXJpYWxpemFibGVQcm9wZXJ0eS50eXBlXCIgKE9iamVjdCkgYnV0IFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLm5vblNlcmlhbGl6YWJsZVByb3BlcnR5LnJlZmxlY3RcIiBpcyB0cnVlLic7XG4gICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgcGFzc2VkID0gZXJyb3IubWVzc2FnZSA9PT0gZXhwZWN0ZWQ7XG4gIH1cbiAgYXNzZXJ0KHBhc3NlZCwgbWVzc2FnZSk7XG59KTtcblxuaXQoJ3JlZmxlY3RlZCBwcm9wZXJ0aWVzIG11c3QgaGF2ZSBzZXJpYWxpemFibGUgdHlwZSAoMiknLCAoKSA9PiB7XG4gIGxldCBwYXNzZWQgPSBmYWxzZTtcbiAgbGV0IG1lc3NhZ2UgPSAnbm8gZXJyb3Igd2FzIHRocm93bic7XG4gIHRyeSB7XG4gICAgY2xhc3MgVGVzdEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoe1xuICAgICAgICByZWZsZWN0OiB0cnVlLFxuICAgICAgfSlcbiAgICAgIGFjY2Vzc29yIHR5cGVsZXNzUHJvcGVydHk7XG4gICAgfVxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lbGVtZW50LXJlZmxlY3QtdHlwZWxlc3MnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnRm91bmQgdW5zZXJpYWxpemFibGUgXCJUZXN0RWxlbWVudC5wcm90b3R5cGUudHlwZWxlc3NQcm9wZXJ0eS50eXBlXCIgKFVuZGVmaW5lZCkgYnV0IFwiVGVzdEVsZW1lbnQucHJvdG90eXBlLnR5cGVsZXNzUHJvcGVydHkucmVmbGVjdFwiIGlzIHRydWUuJztcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBwYXNzZWQgPSBlcnJvci5tZXNzYWdlID09PSBleHBlY3RlZDtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnbGlzdGVuZXJzIGFzIGFuIG9iamVjdCBzaG91bGQgbWFwIHRvIGZ1bmN0aW9ucycsICgpID0+IHtcbiAgbGV0IHBhc3NlZCA9IGZhbHNlO1xuICBsZXQgbWVzc2FnZSA9ICdubyBlcnJvciB3YXMgdGhyb3duJztcbiAgdHJ5IHtcbiAgICBjbGFzcyBUZXN0RWxlbWVudCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICAgIC8vIFdpdGggZGVjb3JhdG9ycywgdGhpcyBlcnJvciB3b3VsZCBiZSBjYXVnaHQgZGlmZmVyZW50bHkgc2luY2Ugd2VcbiAgICAgIC8vIGNhbid0IGRlY29yYXRlIG5vbi1mdW5jdGlvbnMuIFRoaXMgdGVzdCBtaWdodCBuZWVkIHRvIGJlIHVwZGF0ZWRcbiAgICAgIC8vIHRvIHRlc3QgdGhlIGRlY29yYXRvciBBUEkncyB2YWxpZGF0aW9uLlxuICAgICAgQGxpc3RlbmVyKCdjbGljaycpXG4gICAgICBzdGF0aWMgZm9vID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZWxlbWVudC1iYWQtbGlzdGVuZXInLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gVGhlIGVycm9yIG1lc3NhZ2Ugd2lsbCBiZSBkaWZmZXJlbnQgd2l0aCBkZWNvcmF0b3JzXG4gICAgcGFzc2VkID0gdHJ1ZTtcbiAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgfVxuICBhc3NlcnQocGFzc2VkLCBtZXNzYWdlKTtcbn0pO1xuXG5pdCgnbGlzdGVuZXIgb3B0aW9ucyBzaG91bGQgYmUgYW4gb2JqZWN0JywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFRlc3RFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgICAgQGxpc3RlbmVyKCdjbGljaycsICdub3QtYW4tb2JqZWN0JylcbiAgICAgIHN0YXRpYyBvbkNsaWNrKCkge31cbiAgICB9XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWVsZW1lbnQtYmFkLW9wdGlvbnMnLCBUZXN0RWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5leHBlY3RlZCB2YWx1ZSBmb3IgXCJUZXN0RWxlbWVudC5vbkNsaWNrXCIgb3B0aW9ucyAoZXhwZWN0ZWQgT2JqZWN0LCBnb3QgU3RyaW5nKS4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG5cbi8vIFRPRE86ICMzNDY6IFRoaXMgaXMgYSB0ZW1wb3JhcnkgbGltaXRhdGlvbiBvZiB0aGUgYmFiZWwgZGVjb3JhdG9yXG4vLyAgdHJhbnNwaWxlci4gV2Ugd2lsbCBiZSBhYmxlIHRvIGludmVydCB0aGlzIHRlc3QgbGF0ZXIgdG8gcHJvdmUgdGhhdCB3ZSBjYW5cbi8vICBpbiBmYWN0IHVzZSB0aGUgc2FtZSBwcml2YXRlIHByb3BlcnR5IG5hbWVzIGluIHBhcmVudCBhbmQgY2hpbGQuXG5pdCgnY2Fubm90IHVzZSBzYW1lIHByaXZhdGUgcHJvcGVydHkgbmFtZSBpbiBwYXJlbnQgYW5kIGNoaWxkJywgKCkgPT4ge1xuICBsZXQgcGFzc2VkID0gZmFsc2U7XG4gIGxldCBtZXNzYWdlID0gJ25vIGVycm9yIHdhcyB0aHJvd24nO1xuICB0cnkge1xuICAgIGNsYXNzIFBhcmVudEVsZW1lbnQgZXh0ZW5kcyBYRWxlbWVudCB7XG4gICAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcgfSlcbiAgICAgIGFjY2Vzc29yICNmaWVsZDtcbiAgICB9XG5cbiAgICBjbGFzcyBDaGlsZEVsZW1lbnQgZXh0ZW5kcyBQYXJlbnRFbGVtZW50IHtcbiAgICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZyB9KVxuICAgICAgYWNjZXNzb3IgI2ZpZWxkO1xuICAgIH1cblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1wcml2YXRlLWNvbGxpc2lvbicsIENoaWxkRWxlbWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnQ2hpbGRFbGVtZW50OiBDYW5ub3QgdXNlIHByaXZhdGUgcHJvcGVydHkgXCIjZmllbGRcIiBpbiBib3RoIHBhcmVudCBhbmQgY2hpbGQgY2xhc3Nlcy4nO1xuICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIHBhc3NlZCA9IGVycm9yLm1lc3NhZ2UgPT09IGV4cGVjdGVkO1xuICB9XG4gIGFzc2VydChwYXNzZWQsIG1lc3NhZ2UpO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsU0FBU0EsTUFBTSxFQUFFQyxFQUFFLFFBQVEsMkJBQTJCO0FBQ3RELFNBQVNDLFFBQVEsRUFBRUMsUUFBUSxFQUFFQyxRQUFRLFFBQVEsc0JBQXNCO0FBRW5FSCxFQUFFLENBQUMscUVBQXFFLEVBQUUsTUFBTTtFQUM5RSxJQUFJSSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJQyxPQUFPLEdBQUcs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LENBQUEsSUFBQUEsQ0FBQSxFQUFBM0ksQ0FBQSxHQUFBMkksQ0FBQSxFQUFBdkksQ0FBQSxLQUFBdUksQ0FBQSxFQUFBM0ksQ0FBQSxHQUFBSSxDQUFBLFdBQUFzSSxDQUFBLElBQ2xCLENBQUNtQyxLQUFLLElBQUFuQyxDQUFBLEVBRldySixRQUFRLEVBQUFVLENBQUE7TUFBQTtNQUFBLENBQUFDLENBQUEsSUFBQWtLLFlBQUEsUUFBQUUsV0FBQTtNQUFBLElBRXpCLENBQUNTLEtBQUtDLENBQUExSyxDQUFBO1FBQUFrSyxVQUFBLE9BQUFsSyxDQUFBO01BQUE7TUFBQSxJQUFOLENBQUN5SyxLQUFLQyxDQUFBO1FBQUEsT0FBQVQsVUFBQTtNQUFBO0lBQ2pCO0lBRUEsTUFBTVUsWUFBWSxTQUFTSCxhQUFhLENBQUM7TUFBQSxTQUFBSixXQUFBLEdBQ3RDbEwsUUFBUSxDQUFDO1FBQUVXLElBQUksRUFBRUM7TUFBTyxDQUFDLENBQUM7TUFBQTtRQUFBLFlBQUF3SSxDQUFBO1FBQUEsQ0FBQStCLFlBQUEsRUFBQUMsV0FBQSxFQUFBQyxXQUFBLEVBQUFKLFlBQUEsSUFBQXpLLFVBQUEsU0FBQTBLLFdBQUEsY0FBQTdCLENBQUEsSUFBQUEsQ0FBQSxFQUFBM0ksQ0FBQSxHQUFBMkksQ0FBQSxFQUFBdkksQ0FBQSxLQUFBdUksQ0FBQSxFQUFBM0ksQ0FBQSxHQUFBSSxDQUFBLFdBQUFzSSxDQUFBLElBQ2xCLENBQUNtQyxLQUFLLElBQUFuQyxDQUFBLEVBRlVrQyxhQUFhLEVBQUE3SyxDQUFBO01BQUE7TUFBQSxDQUFBQyxDQUFBLElBQUF1SyxZQUFBLFFBQUFFLFlBQUE7TUFBQSxJQUU3QixDQUFDSSxLQUFLQyxDQUFBMUssQ0FBQTtRQUFBdUssV0FBQSxPQUFBdkssQ0FBQTtNQUFBO01BQUEsSUFBTixDQUFDeUssS0FBS0MsQ0FBQTtRQUFBLE9BQUFKLFdBQUE7TUFBQTtJQUNqQjtJQUVBckssY0FBYyxDQUFDQyxNQUFNLENBQUMsd0JBQXdCLEVBQUV5SyxZQUFZLENBQUM7RUFDL0QsQ0FBQyxDQUFDLE9BQU94SyxLQUFLLEVBQUU7SUFDZCxNQUFNTSxRQUFRLEdBQUcsc0ZBQXNGO0lBQ3ZHcEIsT0FBTyxHQUFHYyxLQUFLLENBQUNkLE9BQU87SUFDdkJELE1BQU0sR0FBR2UsS0FBSyxDQUFDZCxPQUFPLEtBQUtvQixRQUFRO0VBQ3JDO0VBQ0ExQixNQUFNLENBQUNLLE1BQU0sRUFBRUMsT0FBTyxDQUFDO0FBQ3pCLENBQUMsQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==