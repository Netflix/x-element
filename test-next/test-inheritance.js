let _initProto, _parentPropDecs, _init_parentProp, _sharedPropDecs, _init_sharedProp, _initProto2, _childPropDecs, _init_childProp, _sharedPropDecs2, _init_sharedProp2, _initProto3, _initStatic, _parentClicksDecs, _init_parentClicks, _onParentEventDecs, _initProto4, _initStatic2, _childClicksDecs, _init_childClicks, _onChildEventDecs, _initProto5, _levelDecs, _init_level, _generationDecs, _init_generation, _initProto6, _levelDecs2, _init_level2, _generationDecs2, _init_generation2, _initProto7, _levelDecs3, _init_level3, _generationDecs3, _init_generation3;
function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, listener, html } from '../x-element-next.js';

// Test basic property inheritance
class ParentElement extends XElement {
  static {
    [_init_parentProp, _init_sharedProp, _initProto] = _applyDecs(this, [[_parentPropDecs, 1, "parentProp"], [_sharedPropDecs, 1, "sharedProp"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto(this), _init_parentProp(this));
  get [(_parentPropDecs = property({
    type: String,
    initial: 'parent-value'
  }), _sharedPropDecs = property({
    type: Number,
    initial: 42
  }), "parentProp")]() {
    return this.#A;
  }
  set parentProp(v) {
    this.#A = v;
  }
  #B = _init_sharedProp(this);
  get sharedProp() {
    return this.#B;
  }
  set sharedProp(v) {
    this.#B = v;
  }
  static template(host) {
    return html`<div>${host.parentProp}-${host.sharedProp}</div>`;
  }
}
class ChildElement extends ParentElement {
  static {
    [_init_childProp, _init_sharedProp2, _initProto2] = _applyDecs(this, [[_childPropDecs, 1, "childProp"], [_sharedPropDecs2, 1, "sharedProp"]], [], 0, void 0, ParentElement).e;
  }
  #A = (_initProto2(this), _init_childProp(this)); // Override parent property with different configuration
  get [(_childPropDecs = property({
    type: String,
    initial: 'child-value'
  }), _sharedPropDecs2 = property({
    type: Number,
    initial: 100
  }), "childProp")]() {
    return this.#A;
  }
  set childProp(v) {
    this.#A = v;
  }
  #B = _init_sharedProp2(this);
  get sharedProp() {
    return this.#B;
  }
  set sharedProp(v) {
    this.#B = v;
  }
  static template(host) {
    return html`<div>${host.parentProp}-${host.childProp}-${host.sharedProp}</div>`;
  }
}

// Test listener inheritance
class ParentWithListener extends XElement {
  static {
    [_init_parentClicks, _initProto3, _initStatic] = _applyDecs(this, [[_onParentEventDecs, 10, "onParentEvent"], [_parentClicksDecs, 1, "parentClicks"]], [], 0, void 0, XElement).e;
    _initStatic(this);
  }
  #A = (_initProto3(this), _init_parentClicks(this));
  get [(_parentClicksDecs = property({
    type: Number,
    initial: 0
  }), _onParentEventDecs = listener('parent-event'), "parentClicks")]() {
    return this.#A;
  }
  set parentClicks(v) {
    this.#A = v;
  }
  static onParentEvent(host) {
    host.parentClicks++;
  }
  static template(host) {
    return html`<div>parent: ${host.parentClicks}</div>`;
  }
}
class ChildWithListener extends ParentWithListener {
  static {
    [_init_childClicks, _initProto4, _initStatic2] = _applyDecs(this, [[_onChildEventDecs, 10, "onChildEvent"], [_childClicksDecs, 1, "childClicks"]], [], 0, void 0, ParentWithListener).e;
    _initStatic2(this);
  }
  #A = (_initProto4(this), _init_childClicks(this));
  get [(_childClicksDecs = property({
    type: Number,
    initial: 0
  }), _onChildEventDecs = listener('child-event'), "childClicks")]() {
    return this.#A;
  }
  set childClicks(v) {
    this.#A = v;
  }
  static onChildEvent(host) {
    host.childClicks++;
  }
  static template(host) {
    return html`<div>parent: ${host.parentClicks}, child: ${host.childClicks}</div>`;
  }
}

// Test multi-level inheritance
class GrandparentLevel extends XElement {
  static {
    [_init_level, _init_generation, _initProto5] = _applyDecs(this, [[_levelDecs, 1, "level"], [_generationDecs, 1, "generation"]], [], 0, void 0, XElement).e;
  }
  #A = (_initProto5(this), _init_level(this));
  get [(_levelDecs = property({
    type: String,
    initial: 'grandparent'
  }), _generationDecs = property({
    type: Number,
    initial: 1
  }), "level")]() {
    return this.#A;
  }
  set level(v) {
    this.#A = v;
  }
  #B = _init_generation(this);
  get generation() {
    return this.#B;
  }
  set generation(v) {
    this.#B = v;
  }
}
class ParentLevel extends GrandparentLevel {
  static {
    [_init_level2, _init_generation2, _initProto6] = _applyDecs(this, [[_levelDecs2, 1, "level"], [_generationDecs2, 1, "generation"]], [], 0, void 0, GrandparentLevel).e;
  }
  #A = (_initProto6(this), _init_level2(this));
  get [(_levelDecs2 = property({
    type: String,
    initial: 'parent'
  }), _generationDecs2 = property({
    type: Number,
    initial: 2
  }), "level")]() {
    return this.#A;
  }
  set level(v) {
    this.#A = v;
  }
  #B = _init_generation2(this);
  get generation() {
    return this.#B;
  }
  set generation(v) {
    this.#B = v;
  }
}
class ChildLevel extends ParentLevel {
  static {
    [_init_level3, _init_generation3, _initProto7] = _applyDecs(this, [[_levelDecs3, 1, "level"], [_generationDecs3, 1, "generation"]], [], 0, void 0, ParentLevel).e;
  }
  #A = (_initProto7(this), _init_level3(this));
  get [(_levelDecs3 = property({
    type: String,
    initial: 'child'
  }), _generationDecs3 = property({
    type: Number,
    initial: 3
  }), "level")]() {
    return this.#A;
  }
  set level(v) {
    this.#A = v;
  }
  #B = _init_generation3(this);
  get generation() {
    return this.#B;
  }
  set generation(v) {
    this.#B = v;
  }
}

// Test private property inheritance
// class ParentWithPrivate extends XElement {
//   @property({ type: String, initial: 'public-parent' })
//   accessor publicProp;

//   @property({ type: String, initial: 'private-parent' })
//   accessor #privateProp;

//   getPrivate() {
//     return this.#privateProp;
//   }

//   static template(host) {
//     return html`<div>${host.publicProp}</div>`;
//   }
// }

// class ChildWithPrivate extends ParentWithPrivate {
//   @property({ type: String, initial: 'public-child' })
//   accessor publicProp;

//   // Child can have its own private property with same name - no collision!
//   @property({ type: String, initial: 'private-child' })
//   accessor #privateProp;

//   getChildPrivate() {
//     return this.#privateProp;
//   }

//   static template(host) {
//     return html`<div>${host.publicProp}</div>`;
//   }
// }

customElements.define('test-parent-element', ParentElement);
customElements.define('test-child-element', ChildElement);
customElements.define('test-parent-with-listener', ParentWithListener);
customElements.define('test-child-with-listener', ChildWithListener);
customElements.define('test-grandparent-level', GrandparentLevel);
customElements.define('test-parent-level', ParentLevel);
customElements.define('test-child-level', ChildLevel);
// TODO: Babel doesn't support decorators on private accessors yet
// customElements.define('test-parent-with-private', ParentWithPrivate);
// customElements.define('test-child-with-private', ChildWithPrivate);

it('child inherits parent properties', () => {
  const child = document.createElement('test-child-element');
  document.body.append(child);
  // Child should have both parent and child properties
  assert(child.parentProp === 'parent-value', 'has parent property');
  assert(child.childProp === 'child-value', 'has child property');
  child.remove();
});
it('child can override parent properties', () => {
  const child = document.createElement('test-child-element');
  document.body.append(child);
  // Child overrides sharedProp with initial value of 100 instead of 42
  assert(child.sharedProp === 100, 'child overrides parent property');
  child.remove();
});
it('parent properties remain independent', () => {
  const parent = document.createElement('test-parent-element');
  document.body.append(parent);
  // Parent should not be affected by child's override
  assert(parent.sharedProp === 42, 'parent property unchanged');
  assert(parent.childProp === undefined, 'parent does not have child property');
  parent.remove();
});
it('child inherits parent template behavior', () => {
  const child = document.createElement('test-child-element');
  document.body.append(child);
  const text = child.shadowRoot.textContent;
  assert(text === 'parent-value-child-value-100', 'child renders with all properties');
  child.remove();
});
it('child inherits parent listeners', () => {
  const child = document.createElement('test-child-with-listener');
  document.body.append(child);

  // Child should respond to both parent and child events
  assert(child.parentClicks === 0, 'parent clicks starts at 0');
  assert(child.childClicks === 0, 'child clicks starts at 0');

  // Events must be dispatched from within shadow root since listeners attach there
  child.shadowRoot.dispatchEvent(new CustomEvent('parent-event', {
    bubbles: true
  }));
  assert(child.parentClicks === 1, 'parent listener works in child');
  child.shadowRoot.dispatchEvent(new CustomEvent('child-event', {
    bubbles: true
  }));
  assert(child.childClicks === 1, 'child listener works');
  child.remove();
});
it('parent listeners remain independent', () => {
  const parent = document.createElement('test-parent-with-listener');
  document.body.append(parent);

  // Events must be dispatched from within shadow root since listeners attach there
  parent.shadowRoot.dispatchEvent(new CustomEvent('parent-event', {
    bubbles: true
  }));
  assert(parent.parentClicks === 1, 'parent listener works');

  // Parent should not respond to child-only events
  parent.shadowRoot.dispatchEvent(new CustomEvent('child-event', {
    bubbles: true
  }));
  assert(parent.childClicks === undefined, 'parent does not have child listener');
  parent.remove();
});
it('multi-level inheritance works (grandparent → parent → child)', () => {
  const grandparent = document.createElement('test-grandparent-level');
  const parent = document.createElement('test-parent-level');
  const child = document.createElement('test-child-level');
  document.body.append(grandparent, parent, child);
  assert(grandparent.level === 'grandparent', 'grandparent has correct level');
  assert(grandparent.generation === 1, 'grandparent has correct generation');
  assert(parent.level === 'parent', 'parent overrides level');
  assert(parent.generation === 2, 'parent overrides generation');
  assert(child.level === 'child', 'child overrides level');
  assert(child.generation === 3, 'child overrides generation');
  grandparent.remove();
  parent.remove();
  child.remove();
});
it.skip('private properties do not collide across inheritance', () => {
  const parent = document.createElement('test-parent-with-private');
  const child = document.createElement('test-child-with-private');
  document.body.append(parent, child);

  // Each class has its own private #privateProp with different values
  assert(parent.getPrivate() === 'private-parent', 'parent has its private value');
  assert(child.getPrivate() === 'private-parent', 'child inherits parent getter');
  assert(child.getChildPrivate() === 'private-child', 'child has its own private value');

  // Public properties override correctly
  assert(parent.publicProp === 'public-parent', 'parent public prop');
  assert(child.publicProp === 'public-child', 'child overrides public prop');
  parent.remove();
  child.remove();
});
it('property modifications do not affect parent class', () => {
  const parent = document.createElement('test-parent-element');
  const child = document.createElement('test-child-element');
  document.body.append(parent, child);

  // Modify child instance
  child.parentProp = 'modified';
  child.sharedProp = 999;

  // Parent instance should be unaffected
  assert(parent.parentProp === 'parent-value', 'parent instance unchanged');
  assert(parent.sharedProp === 42, 'parent instance unchanged');

  // Create new parent to verify class definition unchanged
  const parent2 = document.createElement('test-parent-element');
  document.body.append(parent2);
  assert(parent2.parentProp === 'parent-value', 'parent class definition unchanged');
  assert(parent2.sharedProp === 42, 'parent class definition unchanged');
  parent.remove();
  child.remove();
  parent2.remove();
});
it('out-of-order analysis (child analyzed before parent)', () => {
  let _initProto8, _parentValueDecs, _init_parentValue, _sharedValueDecs, _init_sharedValue, _initProto9, _childValueDecs, _init_childValue, _sharedValueDecs2, _init_sharedValue2;
  // Define new parent and child classes inline to ensure fresh analysis
  class OutOfOrderParent extends XElement {
    static {
      [_init_parentValue, _init_sharedValue, _initProto8] = _applyDecs(this, [[_parentValueDecs, 1, "parentValue"], [_sharedValueDecs, 1, "sharedValue"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto8(this), _init_parentValue(this));
    get [(_parentValueDecs = property({
      type: String,
      initial: 'parent-ooo'
    }), _sharedValueDecs = property({
      type: Number,
      initial: 10
    }), "parentValue")]() {
      return this.#A;
    }
    set parentValue(v) {
      this.#A = v;
    }
    #B = _init_sharedValue(this);
    get sharedValue() {
      return this.#B;
    }
    set sharedValue(v) {
      this.#B = v;
    }
  }
  class OutOfOrderChild extends OutOfOrderParent {
    static {
      [_init_childValue, _init_sharedValue2, _initProto9] = _applyDecs(this, [[_childValueDecs, 1, "childValue"], [_sharedValueDecs2, 1, "sharedValue"]], [], 0, void 0, OutOfOrderParent).e;
    }
    #A = (_initProto9(this), _init_childValue(this));
    get [(_childValueDecs = property({
      type: String,
      initial: 'child-ooo'
    }), _sharedValueDecs2 = property({
      type: Number,
      initial: 20
    }), "childValue")]() {
      return this.#A;
    }
    set childValue(v) {
      this.#A = v;
    }
    #B = _init_sharedValue2(this);
    get sharedValue() {
      return this.#B;
    }
    set sharedValue(v) {
      this.#B = v;
    }
  }
  customElements.define('test-ooo-parent', OutOfOrderParent);
  customElements.define('test-ooo-child', OutOfOrderChild);

  // Create child FIRST - this triggers analysis of child, which should
  // automatically trigger parent analysis first to ensure proper inheritance
  const child = document.createElement('test-ooo-child');
  document.body.append(child);

  // Verify child has correct values (would fail if parent wasn't analyzed first)
  assert(child.parentValue === 'parent-ooo', 'child inherits parent property');
  assert(child.childValue === 'child-ooo', 'child has its own property');
  assert(child.sharedValue === 20, 'child overrides parent property');

  // Now create parent and verify it's unaffected by child
  const parent = document.createElement('test-ooo-parent');
  document.body.append(parent);
  assert(parent.parentValue === 'parent-ooo', 'parent property correct');
  assert(parent.sharedValue === 10, 'parent property not affected by child');
  assert(parent.childValue === undefined, 'parent does not have child property');
  child.remove();
  parent.remove();
});
it('parent and child both listen to same event type', () => {
  let _initProto0, _initStatic3, _parentCountDecs, _init_parentCount, _onParentSharedDecs, _initProto1, _initStatic4, _childCountDecs, _init_childCount, _onChildSharedDecs;
  // Parent and child each have different methods listening to same event type
  class ParentMultiListener extends XElement {
    static {
      [_init_parentCount, _initProto0, _initStatic3] = _applyDecs(this, [[_onParentSharedDecs, 10, "onParentShared"], [_parentCountDecs, 1, "parentCount"]], [], 0, void 0, XElement).e;
      _initStatic3(this);
    }
    #A = (_initProto0(this), _init_parentCount(this));
    get [(_parentCountDecs = property({
      type: Number,
      initial: 0
    }), _onParentSharedDecs = listener('shared-event'), "parentCount")]() {
      return this.#A;
    }
    set parentCount(v) {
      this.#A = v;
    }
    static onParentShared(host) {
      host.parentCount++;
    }
    static template(host) {
      return html`<div>parent: ${host.parentCount}</div>`;
    }
  }
  class ChildMultiListener extends ParentMultiListener {
    static {
      [_init_childCount, _initProto1, _initStatic4] = _applyDecs(this, [[_onChildSharedDecs, 10, "onChildShared"], [_childCountDecs, 1, "childCount"]], [], 0, void 0, ParentMultiListener).e;
      _initStatic4(this);
    }
    #A = (_initProto1(this), _init_childCount(this));
    get [(_childCountDecs = property({
      type: Number,
      initial: 0
    }), _onChildSharedDecs = listener('shared-event'), "childCount")]() {
      return this.#A;
    }
    set childCount(v) {
      this.#A = v;
    }
    static onChildShared(host) {
      host.childCount++;
    }
    static template(host) {
      return html`<div>parent: ${host.parentCount}, child: ${host.childCount}</div>`;
    }
  }
  customElements.define('test-parent-multi', ParentMultiListener);
  customElements.define('test-child-multi', ChildMultiListener);
  const child = document.createElement('test-child-multi');
  document.body.append(child);
  assert(child.parentCount === 0, 'parent count starts at 0');
  assert(child.childCount === 0, 'child count starts at 0');

  // Dispatch shared event - both parent and child listeners should fire
  child.shadowRoot.dispatchEvent(new CustomEvent('shared-event', {
    bubbles: true
  }));
  assert(child.parentCount === 1, 'parent listener fired');
  assert(child.childCount === 1, 'child listener fired');

  // Fire again - both should increment
  child.shadowRoot.dispatchEvent(new CustomEvent('shared-event', {
    bubbles: true
  }));
  assert(child.parentCount === 2, 'parent listener fired again');
  assert(child.childCount === 2, 'child listener fired again');

  // Verify parent instance only has parent listener
  const parent = document.createElement('test-parent-multi');
  document.body.append(parent);
  parent.shadowRoot.dispatchEvent(new CustomEvent('shared-event', {
    bubbles: true
  }));
  assert(parent.parentCount === 1, 'parent listener works on parent instance');
  assert(parent.childCount === undefined, 'parent instance has no child listener');
  child.remove();
  parent.remove();
});
it('child overrides parent listener with same method name', () => {
  let _initProto10, _initStatic5, _parentClicksDecs2, _init_parentClicks2, _onClickDecs, _initProto11, _initStatic6, _childClicksDecs2, _init_childClicks2, _onClickDecs2;
  // When child redefines a method with the same name, only child's listener fires
  class ParentWithMethod extends XElement {
    static {
      [_init_parentClicks2, _initProto10, _initStatic5] = _applyDecs(this, [[_onClickDecs, 10, "onClick"], [_parentClicksDecs2, 1, "parentClicks"]], [], 0, void 0, XElement).e;
      _initStatic5(this);
    }
    #A = (_initProto10(this), _init_parentClicks2(this));
    get [(_parentClicksDecs2 = property({
      type: Number,
      initial: 0
    }), _onClickDecs = listener('click'), "parentClicks")]() {
      return this.#A;
    }
    set parentClicks(v) {
      this.#A = v;
    }
    static onClick(host) {
      host.parentClicks++;
    }
    static template(host) {
      return html`<div>parent: ${host.parentClicks}</div>`;
    }
  }
  class ChildOverridesMethod extends ParentWithMethod {
    static {
      [_init_childClicks2, _initProto11, _initStatic6] = _applyDecs(this, [[_onClickDecs2, 10, "onClick"], [_childClicksDecs2, 1, "childClicks"]], [], 0, void 0, ParentWithMethod).e;
      _initStatic6(this);
    }
    #A = (_initProto11(this), _init_childClicks2(this));
    get [(_childClicksDecs2 = property({
      type: Number,
      initial: 0
    }), _onClickDecs2 = listener('click'), "childClicks")]() {
      return this.#A;
    }
    set childClicks(v) {
      this.#A = v;
    }
    static onClick(host) {
      // Same method name as parent - should override
      host.childClicks++;
    }
    static template(host) {
      return html`<div>parent: ${host.parentClicks}, child: ${host.childClicks}</div>`;
    }
  }
  customElements.define('test-parent-with-method', ParentWithMethod);
  customElements.define('test-child-overrides-method', ChildOverridesMethod);
  const child = document.createElement('test-child-overrides-method');
  document.body.append(child);
  assert(child.parentClicks === 0, 'parent clicks starts at 0');
  assert(child.childClicks === 0, 'child clicks starts at 0');

  // Dispatch click event - only child's onClick should fire
  child.shadowRoot.dispatchEvent(new CustomEvent('click', {
    bubbles: true
  }));
  assert(child.parentClicks === 0, 'parent listener did not fire (overridden by child)');
  assert(child.childClicks === 1, 'child listener fired');

  // Verify parent instance uses parent's onClick
  const parent = document.createElement('test-parent-with-method');
  document.body.append(parent);
  parent.shadowRoot.dispatchEvent(new CustomEvent('click', {
    bubbles: true
  }));
  assert(parent.parentClicks === 1, 'parent listener works on parent instance');
  assert(parent.childClicks === undefined, 'parent instance has no child property');
  child.remove();
  parent.remove();
});
it('plain class without decorators (missing metadata link) works correctly', () => {
  let _initProto12, _basePropDecs, _init_baseProp, _generationDecs4, _init_generation4, _initProto13, _childPropDecs2, _init_childProp2, _generationDecs5, _init_generation5;
  // Test that a class without decorators in the middle of the inheritance chain
  // works correctly and doesn't have Symbol.metadata polluted onto it

  class DecoratedBase extends XElement {
    static {
      [_init_baseProp, _init_generation4, _initProto12] = _applyDecs(this, [[_basePropDecs, 1, "baseProp"], [_generationDecs4, 1, "generation"]], [], 0, void 0, XElement).e;
    }
    #A = (_initProto12(this), _init_baseProp(this));
    get [(_basePropDecs = property({
      type: String,
      initial: 'base-value'
    }), _generationDecs4 = property({
      type: Number,
      initial: 1
    }), "baseProp")]() {
      return this.#A;
    }
    set baseProp(v) {
      this.#A = v;
    }
    #B = _init_generation4(this);
    get generation() {
      return this.#B;
    }
    set generation(v) {
      this.#B = v;
    }
  }

  // Plain class with NO decorators - this is the "missing link"
  class PlainMiddle extends DecoratedBase {
    // No decorators! Just plain class extending decorated base
  }
  class DecoratedChild extends PlainMiddle {
    static {
      [_init_childProp2, _init_generation5, _initProto13] = _applyDecs(this, [[_childPropDecs2, 1, "childProp"], [_generationDecs5, 1, "generation"]], [], 0, void 0, PlainMiddle).e;
    }
    #A = (_initProto13(this), _init_childProp2(this));
    get [(_childPropDecs2 = property({
      type: String,
      initial: 'child-value'
    }), _generationDecs5 = property({
      type: Number,
      initial: 3
    }), "childProp")]() {
      return this.#A;
    }
    set childProp(v) {
      this.#A = v;
    }
    #B = _init_generation5(this);
    get generation() {
      return this.#B;
    }
    set generation(v) {
      this.#B = v;
    }
  }
  customElements.define('test-decorated-base-link', DecoratedBase);
  customElements.define('test-plain-middle-link', PlainMiddle);
  customElements.define('test-decorated-child-link', DecoratedChild);

  // CRITICAL: Verify PlainMiddle doesn't have Symbol.metadata as OWN property
  // (it might inherit from parent via prototype chain, but shouldn't have its own)
  assert(!Object.hasOwn(PlainMiddle, Symbol.metadata), 'plain class has no own Symbol.metadata property');

  // Verify DecoratedBase and DecoratedChild DO have Symbol.metadata (from decorators)
  assert(DecoratedBase[Symbol.metadata] !== undefined, 'decorated base has Symbol.metadata');
  assert(DecoratedChild[Symbol.metadata] !== undefined, 'decorated child has Symbol.metadata');

  // Create instances and verify inheritance still works correctly
  const base = document.createElement('test-decorated-base-link');
  document.body.append(base);
  assert(base.baseProp === 'base-value', 'base has baseProp');
  assert(base.generation === 1, 'base has generation 1');
  assert(base.childProp === undefined, 'base has no child property');
  const middle = document.createElement('test-plain-middle-link');
  document.body.append(middle);
  assert(middle.baseProp === 'base-value', 'middle inherits baseProp from base');
  assert(middle.generation === 1, 'middle inherits generation from base');
  assert(middle.childProp === undefined, 'middle has no child property');
  const child = document.createElement('test-decorated-child-link');
  document.body.append(child);
  assert(child.baseProp === 'base-value', 'child inherits baseProp through plain middle');
  assert(child.childProp === 'child-value', 'child has childProp');
  assert(child.generation === 3, 'child overrides generation');

  // Verify that modifications to child don't affect middle or base
  child.baseProp = 'modified';
  assert(middle.baseProp === 'base-value', 'middle unchanged after child modification');
  assert(base.baseProp === 'base-value', 'base unchanged after child modification');
  base.remove();
  middle.remove();
  child.remove();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3NlcnQiLCJpdCIsIlhFbGVtZW50IiwicHJvcGVydHkiLCJsaXN0ZW5lciIsImh0bWwiLCJQYXJlbnRFbGVtZW50IiwiX2luaXRfcGFyZW50UHJvcCIsIl9pbml0X3NoYXJlZFByb3AiLCJfaW5pdFByb3RvIiwiX2FwcGx5RGVjcyIsIl9wYXJlbnRQcm9wRGVjcyIsIl9zaGFyZWRQcm9wRGVjcyIsImUiLCJBIiwidHlwZSIsIlN0cmluZyIsImluaXRpYWwiLCJOdW1iZXIiLCJwYXJlbnRQcm9wIiwidiIsIkIiLCJzaGFyZWRQcm9wIiwidGVtcGxhdGUiLCJob3N0IiwiQ2hpbGRFbGVtZW50IiwiX2luaXRfY2hpbGRQcm9wIiwiX2luaXRfc2hhcmVkUHJvcDIiLCJfaW5pdFByb3RvMiIsIl9jaGlsZFByb3BEZWNzIiwiX3NoYXJlZFByb3BEZWNzMiIsImNoaWxkUHJvcCIsIlBhcmVudFdpdGhMaXN0ZW5lciIsIl9pbml0X3BhcmVudENsaWNrcyIsIl9pbml0UHJvdG8zIiwiX2luaXRTdGF0aWMiLCJfb25QYXJlbnRFdmVudERlY3MiLCJfcGFyZW50Q2xpY2tzRGVjcyIsInBhcmVudENsaWNrcyIsIm9uUGFyZW50RXZlbnQiLCJDaGlsZFdpdGhMaXN0ZW5lciIsIl9pbml0X2NoaWxkQ2xpY2tzIiwiX2luaXRQcm90bzQiLCJfaW5pdFN0YXRpYzIiLCJfb25DaGlsZEV2ZW50RGVjcyIsIl9jaGlsZENsaWNrc0RlY3MiLCJjaGlsZENsaWNrcyIsIm9uQ2hpbGRFdmVudCIsIkdyYW5kcGFyZW50TGV2ZWwiLCJfaW5pdF9sZXZlbCIsIl9pbml0X2dlbmVyYXRpb24iLCJfaW5pdFByb3RvNSIsIl9sZXZlbERlY3MiLCJfZ2VuZXJhdGlvbkRlY3MiLCJsZXZlbCIsImdlbmVyYXRpb24iLCJQYXJlbnRMZXZlbCIsIl9pbml0X2xldmVsMiIsIl9pbml0X2dlbmVyYXRpb24yIiwiX2luaXRQcm90bzYiLCJfbGV2ZWxEZWNzMiIsIl9nZW5lcmF0aW9uRGVjczIiLCJDaGlsZExldmVsIiwiX2luaXRfbGV2ZWwzIiwiX2luaXRfZ2VuZXJhdGlvbjMiLCJfaW5pdFByb3RvNyIsIl9sZXZlbERlY3MzIiwiX2dlbmVyYXRpb25EZWNzMyIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiY2hpbGQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kIiwicmVtb3ZlIiwicGFyZW50IiwidW5kZWZpbmVkIiwidGV4dCIsInNoYWRvd1Jvb3QiLCJ0ZXh0Q29udGVudCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImJ1YmJsZXMiLCJncmFuZHBhcmVudCIsInNraXAiLCJnZXRQcml2YXRlIiwiZ2V0Q2hpbGRQcml2YXRlIiwicHVibGljUHJvcCIsInBhcmVudDIiLCJfaW5pdFByb3RvOCIsIl9wYXJlbnRWYWx1ZURlY3MiLCJfaW5pdF9wYXJlbnRWYWx1ZSIsIl9zaGFyZWRWYWx1ZURlY3MiLCJfaW5pdF9zaGFyZWRWYWx1ZSIsIl9pbml0UHJvdG85IiwiX2NoaWxkVmFsdWVEZWNzIiwiX2luaXRfY2hpbGRWYWx1ZSIsIl9zaGFyZWRWYWx1ZURlY3MyIiwiX2luaXRfc2hhcmVkVmFsdWUyIiwiT3V0T2ZPcmRlclBhcmVudCIsInBhcmVudFZhbHVlIiwic2hhcmVkVmFsdWUiLCJPdXRPZk9yZGVyQ2hpbGQiLCJjaGlsZFZhbHVlIiwiX2luaXRQcm90bzAiLCJfaW5pdFN0YXRpYzMiLCJfcGFyZW50Q291bnREZWNzIiwiX2luaXRfcGFyZW50Q291bnQiLCJfb25QYXJlbnRTaGFyZWREZWNzIiwiX2luaXRQcm90bzEiLCJfaW5pdFN0YXRpYzQiLCJfY2hpbGRDb3VudERlY3MiLCJfaW5pdF9jaGlsZENvdW50IiwiX29uQ2hpbGRTaGFyZWREZWNzIiwiUGFyZW50TXVsdGlMaXN0ZW5lciIsInBhcmVudENvdW50Iiwib25QYXJlbnRTaGFyZWQiLCJDaGlsZE11bHRpTGlzdGVuZXIiLCJjaGlsZENvdW50Iiwib25DaGlsZFNoYXJlZCIsIl9pbml0UHJvdG8xMCIsIl9pbml0U3RhdGljNSIsIl9wYXJlbnRDbGlja3NEZWNzMiIsIl9pbml0X3BhcmVudENsaWNrczIiLCJfb25DbGlja0RlY3MiLCJfaW5pdFByb3RvMTEiLCJfaW5pdFN0YXRpYzYiLCJfY2hpbGRDbGlja3NEZWNzMiIsIl9pbml0X2NoaWxkQ2xpY2tzMiIsIl9vbkNsaWNrRGVjczIiLCJQYXJlbnRXaXRoTWV0aG9kIiwib25DbGljayIsIkNoaWxkT3ZlcnJpZGVzTWV0aG9kIiwiX2luaXRQcm90bzEyIiwiX2Jhc2VQcm9wRGVjcyIsIl9pbml0X2Jhc2VQcm9wIiwiX2dlbmVyYXRpb25EZWNzNCIsIl9pbml0X2dlbmVyYXRpb240IiwiX2luaXRQcm90bzEzIiwiX2NoaWxkUHJvcERlY3MyIiwiX2luaXRfY2hpbGRQcm9wMiIsIl9nZW5lcmF0aW9uRGVjczUiLCJfaW5pdF9nZW5lcmF0aW9uNSIsIkRlY29yYXRlZEJhc2UiLCJiYXNlUHJvcCIsIlBsYWluTWlkZGxlIiwiRGVjb3JhdGVkQ2hpbGQiLCJPYmplY3QiLCJoYXNPd24iLCJTeW1ib2wiLCJtZXRhZGF0YSIsImJhc2UiLCJtaWRkbGUiXSwic291cmNlcyI6WyJ0ZXN0LWluaGVyaXRhbmNlLnNyYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGl0IH0gZnJvbSAnQG5ldGZsaXgveC10ZXN0L3gtdGVzdC5qcyc7XG5pbXBvcnQgeyBYRWxlbWVudCwgcHJvcGVydHksIGxpc3RlbmVyLCBodG1sIH0gZnJvbSAnLi4veC1lbGVtZW50LW5leHQuanMnO1xuXG4vLyBUZXN0IGJhc2ljIHByb3BlcnR5IGluaGVyaXRhbmNlXG5jbGFzcyBQYXJlbnRFbGVtZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICdwYXJlbnQtdmFsdWUnIH0pXG4gIGFjY2Vzc29yIHBhcmVudFByb3A7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiA0MiB9KVxuICBhY2Nlc3NvciBzaGFyZWRQcm9wO1xuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3QucGFyZW50UHJvcH0tJHtob3N0LnNoYXJlZFByb3B9PC9kaXY+YDtcbiAgfVxufVxuXG5jbGFzcyBDaGlsZEVsZW1lbnQgZXh0ZW5kcyBQYXJlbnRFbGVtZW50IHtcbiAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAnY2hpbGQtdmFsdWUnIH0pXG4gIGFjY2Vzc29yIGNoaWxkUHJvcDtcblxuICAvLyBPdmVycmlkZSBwYXJlbnQgcHJvcGVydHkgd2l0aCBkaWZmZXJlbnQgY29uZmlndXJhdGlvblxuICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDEwMCB9KVxuICBhY2Nlc3NvciBzaGFyZWRQcm9wO1xuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj4ke2hvc3QucGFyZW50UHJvcH0tJHtob3N0LmNoaWxkUHJvcH0tJHtob3N0LnNoYXJlZFByb3B9PC9kaXY+YDtcbiAgfVxufVxuXG4vLyBUZXN0IGxpc3RlbmVyIGluaGVyaXRhbmNlXG5jbGFzcyBQYXJlbnRXaXRoTGlzdGVuZXIgZXh0ZW5kcyBYRWxlbWVudCB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IE51bWJlciwgaW5pdGlhbDogMCB9KVxuICBhY2Nlc3NvciBwYXJlbnRDbGlja3M7XG5cbiAgQGxpc3RlbmVyKCdwYXJlbnQtZXZlbnQnKVxuICBzdGF0aWMgb25QYXJlbnRFdmVudChob3N0KSB7XG4gICAgaG9zdC5wYXJlbnRDbGlja3MrKztcbiAgfVxuXG4gIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgcmV0dXJuIGh0bWxgPGRpdj5wYXJlbnQ6ICR7aG9zdC5wYXJlbnRDbGlja3N9PC9kaXY+YDtcbiAgfVxufVxuXG5jbGFzcyBDaGlsZFdpdGhMaXN0ZW5lciBleHRlbmRzIFBhcmVudFdpdGhMaXN0ZW5lciB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IE51bWJlciwgaW5pdGlhbDogMCB9KVxuICBhY2Nlc3NvciBjaGlsZENsaWNrcztcblxuICBAbGlzdGVuZXIoJ2NoaWxkLWV2ZW50JylcbiAgc3RhdGljIG9uQ2hpbGRFdmVudChob3N0KSB7XG4gICAgaG9zdC5jaGlsZENsaWNrcysrO1xuICB9XG5cbiAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbiAgICByZXR1cm4gaHRtbGA8ZGl2PnBhcmVudDogJHtob3N0LnBhcmVudENsaWNrc30sIGNoaWxkOiAke2hvc3QuY2hpbGRDbGlja3N9PC9kaXY+YDtcbiAgfVxufVxuXG4vLyBUZXN0IG11bHRpLWxldmVsIGluaGVyaXRhbmNlXG5jbGFzcyBHcmFuZHBhcmVudExldmVsIGV4dGVuZHMgWEVsZW1lbnQge1xuICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICdncmFuZHBhcmVudCcgfSlcbiAgYWNjZXNzb3IgbGV2ZWw7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAxIH0pXG4gIGFjY2Vzc29yIGdlbmVyYXRpb247XG59XG5cbmNsYXNzIFBhcmVudExldmVsIGV4dGVuZHMgR3JhbmRwYXJlbnRMZXZlbCB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5pdGlhbDogJ3BhcmVudCcgfSlcbiAgYWNjZXNzb3IgbGV2ZWw7XG5cbiAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAyIH0pXG4gIGFjY2Vzc29yIGdlbmVyYXRpb247XG59XG5cbmNsYXNzIENoaWxkTGV2ZWwgZXh0ZW5kcyBQYXJlbnRMZXZlbCB7XG4gIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5pdGlhbDogJ2NoaWxkJyB9KVxuICBhY2Nlc3NvciBsZXZlbDtcblxuICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDMgfSlcbiAgYWNjZXNzb3IgZ2VuZXJhdGlvbjtcbn1cblxuLy8gVGVzdCBwcml2YXRlIHByb3BlcnR5IGluaGVyaXRhbmNlXG4vLyBjbGFzcyBQYXJlbnRXaXRoUHJpdmF0ZSBleHRlbmRzIFhFbGVtZW50IHtcbi8vICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAncHVibGljLXBhcmVudCcgfSlcbi8vICAgYWNjZXNzb3IgcHVibGljUHJvcDtcblxuLy8gICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICdwcml2YXRlLXBhcmVudCcgfSlcbi8vICAgYWNjZXNzb3IgI3ByaXZhdGVQcm9wO1xuXG4vLyAgIGdldFByaXZhdGUoKSB7XG4vLyAgICAgcmV0dXJuIHRoaXMuI3ByaXZhdGVQcm9wO1xuLy8gICB9XG5cbi8vICAgc3RhdGljIHRlbXBsYXRlKGhvc3QpIHtcbi8vICAgICByZXR1cm4gaHRtbGA8ZGl2PiR7aG9zdC5wdWJsaWNQcm9wfTwvZGl2PmA7XG4vLyAgIH1cbi8vIH1cblxuLy8gY2xhc3MgQ2hpbGRXaXRoUHJpdmF0ZSBleHRlbmRzIFBhcmVudFdpdGhQcml2YXRlIHtcbi8vICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAncHVibGljLWNoaWxkJyB9KVxuLy8gICBhY2Nlc3NvciBwdWJsaWNQcm9wO1xuXG4vLyAgIC8vIENoaWxkIGNhbiBoYXZlIGl0cyBvd24gcHJpdmF0ZSBwcm9wZXJ0eSB3aXRoIHNhbWUgbmFtZSAtIG5vIGNvbGxpc2lvbiFcbi8vICAgQHByb3BlcnR5KHsgdHlwZTogU3RyaW5nLCBpbml0aWFsOiAncHJpdmF0ZS1jaGlsZCcgfSlcbi8vICAgYWNjZXNzb3IgI3ByaXZhdGVQcm9wO1xuXG4vLyAgIGdldENoaWxkUHJpdmF0ZSgpIHtcbi8vICAgICByZXR1cm4gdGhpcy4jcHJpdmF0ZVByb3A7XG4vLyAgIH1cblxuLy8gICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuLy8gICAgIHJldHVybiBodG1sYDxkaXY+JHtob3N0LnB1YmxpY1Byb3B9PC9kaXY+YDtcbi8vICAgfVxuLy8gfVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtcGFyZW50LWVsZW1lbnQnLCBQYXJlbnRFbGVtZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1jaGlsZC1lbGVtZW50JywgQ2hpbGRFbGVtZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1wYXJlbnQtd2l0aC1saXN0ZW5lcicsIFBhcmVudFdpdGhMaXN0ZW5lcik7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtY2hpbGQtd2l0aC1saXN0ZW5lcicsIENoaWxkV2l0aExpc3RlbmVyKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1ncmFuZHBhcmVudC1sZXZlbCcsIEdyYW5kcGFyZW50TGV2ZWwpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXBhcmVudC1sZXZlbCcsIFBhcmVudExldmVsKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1jaGlsZC1sZXZlbCcsIENoaWxkTGV2ZWwpO1xuLy8gVE9ETzogQmFiZWwgZG9lc24ndCBzdXBwb3J0IGRlY29yYXRvcnMgb24gcHJpdmF0ZSBhY2Nlc3NvcnMgeWV0XG4vLyBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtcGFyZW50LXdpdGgtcHJpdmF0ZScsIFBhcmVudFdpdGhQcml2YXRlKTtcbi8vIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1jaGlsZC13aXRoLXByaXZhdGUnLCBDaGlsZFdpdGhQcml2YXRlKTtcblxuaXQoJ2NoaWxkIGluaGVyaXRzIHBhcmVudCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtY2hpbGQtZWxlbWVudCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChjaGlsZCk7XG4gIC8vIENoaWxkIHNob3VsZCBoYXZlIGJvdGggcGFyZW50IGFuZCBjaGlsZCBwcm9wZXJ0aWVzXG4gIGFzc2VydChjaGlsZC5wYXJlbnRQcm9wID09PSAncGFyZW50LXZhbHVlJywgJ2hhcyBwYXJlbnQgcHJvcGVydHknKTtcbiAgYXNzZXJ0KGNoaWxkLmNoaWxkUHJvcCA9PT0gJ2NoaWxkLXZhbHVlJywgJ2hhcyBjaGlsZCBwcm9wZXJ0eScpO1xuICBjaGlsZC5yZW1vdmUoKTtcbn0pO1xuXG5pdCgnY2hpbGQgY2FuIG92ZXJyaWRlIHBhcmVudCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtY2hpbGQtZWxlbWVudCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChjaGlsZCk7XG4gIC8vIENoaWxkIG92ZXJyaWRlcyBzaGFyZWRQcm9wIHdpdGggaW5pdGlhbCB2YWx1ZSBvZiAxMDAgaW5zdGVhZCBvZiA0MlxuICBhc3NlcnQoY2hpbGQuc2hhcmVkUHJvcCA9PT0gMTAwLCAnY2hpbGQgb3ZlcnJpZGVzIHBhcmVudCBwcm9wZXJ0eScpO1xuICBjaGlsZC5yZW1vdmUoKTtcbn0pO1xuXG5pdCgncGFyZW50IHByb3BlcnRpZXMgcmVtYWluIGluZGVwZW5kZW50JywgKCkgPT4ge1xuICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LXBhcmVudC1lbGVtZW50Jyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKHBhcmVudCk7XG4gIC8vIFBhcmVudCBzaG91bGQgbm90IGJlIGFmZmVjdGVkIGJ5IGNoaWxkJ3Mgb3ZlcnJpZGVcbiAgYXNzZXJ0KHBhcmVudC5zaGFyZWRQcm9wID09PSA0MiwgJ3BhcmVudCBwcm9wZXJ0eSB1bmNoYW5nZWQnKTtcbiAgYXNzZXJ0KHBhcmVudC5jaGlsZFByb3AgPT09IHVuZGVmaW5lZCwgJ3BhcmVudCBkb2VzIG5vdCBoYXZlIGNoaWxkIHByb3BlcnR5Jyk7XG4gIHBhcmVudC5yZW1vdmUoKTtcbn0pO1xuXG5pdCgnY2hpbGQgaW5oZXJpdHMgcGFyZW50IHRlbXBsYXRlIGJlaGF2aW9yJywgKCkgPT4ge1xuICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtY2hpbGQtZWxlbWVudCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChjaGlsZCk7XG4gIGNvbnN0IHRleHQgPSBjaGlsZC5zaGFkb3dSb290LnRleHRDb250ZW50O1xuICBhc3NlcnQodGV4dCA9PT0gJ3BhcmVudC12YWx1ZS1jaGlsZC12YWx1ZS0xMDAnLCAnY2hpbGQgcmVuZGVycyB3aXRoIGFsbCBwcm9wZXJ0aWVzJyk7XG4gIGNoaWxkLnJlbW92ZSgpO1xufSk7XG5cbml0KCdjaGlsZCBpbmhlcml0cyBwYXJlbnQgbGlzdGVuZXJzJywgKCkgPT4ge1xuICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtY2hpbGQtd2l0aC1saXN0ZW5lcicpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChjaGlsZCk7XG5cbiAgLy8gQ2hpbGQgc2hvdWxkIHJlc3BvbmQgdG8gYm90aCBwYXJlbnQgYW5kIGNoaWxkIGV2ZW50c1xuICBhc3NlcnQoY2hpbGQucGFyZW50Q2xpY2tzID09PSAwLCAncGFyZW50IGNsaWNrcyBzdGFydHMgYXQgMCcpO1xuICBhc3NlcnQoY2hpbGQuY2hpbGRDbGlja3MgPT09IDAsICdjaGlsZCBjbGlja3Mgc3RhcnRzIGF0IDAnKTtcblxuICAvLyBFdmVudHMgbXVzdCBiZSBkaXNwYXRjaGVkIGZyb20gd2l0aGluIHNoYWRvdyByb290IHNpbmNlIGxpc3RlbmVycyBhdHRhY2ggdGhlcmVcbiAgY2hpbGQuc2hhZG93Um9vdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGFyZW50LWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgYXNzZXJ0KGNoaWxkLnBhcmVudENsaWNrcyA9PT0gMSwgJ3BhcmVudCBsaXN0ZW5lciB3b3JrcyBpbiBjaGlsZCcpO1xuXG4gIGNoaWxkLnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoaWxkLWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgYXNzZXJ0KGNoaWxkLmNoaWxkQ2xpY2tzID09PSAxLCAnY2hpbGQgbGlzdGVuZXIgd29ya3MnKTtcblxuICBjaGlsZC5yZW1vdmUoKTtcbn0pO1xuXG5pdCgncGFyZW50IGxpc3RlbmVycyByZW1haW4gaW5kZXBlbmRlbnQnLCAoKSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtcGFyZW50LXdpdGgtbGlzdGVuZXInKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQocGFyZW50KTtcblxuICAvLyBFdmVudHMgbXVzdCBiZSBkaXNwYXRjaGVkIGZyb20gd2l0aGluIHNoYWRvdyByb290IHNpbmNlIGxpc3RlbmVycyBhdHRhY2ggdGhlcmVcbiAgcGFyZW50LnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BhcmVudC1ldmVudCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGFzc2VydChwYXJlbnQucGFyZW50Q2xpY2tzID09PSAxLCAncGFyZW50IGxpc3RlbmVyIHdvcmtzJyk7XG5cbiAgLy8gUGFyZW50IHNob3VsZCBub3QgcmVzcG9uZCB0byBjaGlsZC1vbmx5IGV2ZW50c1xuICBwYXJlbnQuc2hhZG93Um9vdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hpbGQtZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBhc3NlcnQocGFyZW50LmNoaWxkQ2xpY2tzID09PSB1bmRlZmluZWQsICdwYXJlbnQgZG9lcyBub3QgaGF2ZSBjaGlsZCBsaXN0ZW5lcicpO1xuXG4gIHBhcmVudC5yZW1vdmUoKTtcbn0pO1xuXG5pdCgnbXVsdGktbGV2ZWwgaW5oZXJpdGFuY2Ugd29ya3MgKGdyYW5kcGFyZW50IOKGkiBwYXJlbnQg4oaSIGNoaWxkKScsICgpID0+IHtcbiAgY29uc3QgZ3JhbmRwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWdyYW5kcGFyZW50LWxldmVsJyk7XG4gIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtcGFyZW50LWxldmVsJyk7XG4gIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1jaGlsZC1sZXZlbCcpO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGdyYW5kcGFyZW50LCBwYXJlbnQsIGNoaWxkKTtcblxuICBhc3NlcnQoZ3JhbmRwYXJlbnQubGV2ZWwgPT09ICdncmFuZHBhcmVudCcsICdncmFuZHBhcmVudCBoYXMgY29ycmVjdCBsZXZlbCcpO1xuICBhc3NlcnQoZ3JhbmRwYXJlbnQuZ2VuZXJhdGlvbiA9PT0gMSwgJ2dyYW5kcGFyZW50IGhhcyBjb3JyZWN0IGdlbmVyYXRpb24nKTtcblxuICBhc3NlcnQocGFyZW50LmxldmVsID09PSAncGFyZW50JywgJ3BhcmVudCBvdmVycmlkZXMgbGV2ZWwnKTtcbiAgYXNzZXJ0KHBhcmVudC5nZW5lcmF0aW9uID09PSAyLCAncGFyZW50IG92ZXJyaWRlcyBnZW5lcmF0aW9uJyk7XG5cbiAgYXNzZXJ0KGNoaWxkLmxldmVsID09PSAnY2hpbGQnLCAnY2hpbGQgb3ZlcnJpZGVzIGxldmVsJyk7XG4gIGFzc2VydChjaGlsZC5nZW5lcmF0aW9uID09PSAzLCAnY2hpbGQgb3ZlcnJpZGVzIGdlbmVyYXRpb24nKTtcblxuICBncmFuZHBhcmVudC5yZW1vdmUoKTtcbiAgcGFyZW50LnJlbW92ZSgpO1xuICBjaGlsZC5yZW1vdmUoKTtcbn0pO1xuXG5pdC5za2lwKCdwcml2YXRlIHByb3BlcnRpZXMgZG8gbm90IGNvbGxpZGUgYWNyb3NzIGluaGVyaXRhbmNlJywgKCkgPT4ge1xuICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LXBhcmVudC13aXRoLXByaXZhdGUnKTtcbiAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWNoaWxkLXdpdGgtcHJpdmF0ZScpO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKHBhcmVudCwgY2hpbGQpO1xuXG4gIC8vIEVhY2ggY2xhc3MgaGFzIGl0cyBvd24gcHJpdmF0ZSAjcHJpdmF0ZVByb3Agd2l0aCBkaWZmZXJlbnQgdmFsdWVzXG4gIGFzc2VydChwYXJlbnQuZ2V0UHJpdmF0ZSgpID09PSAncHJpdmF0ZS1wYXJlbnQnLCAncGFyZW50IGhhcyBpdHMgcHJpdmF0ZSB2YWx1ZScpO1xuICBhc3NlcnQoY2hpbGQuZ2V0UHJpdmF0ZSgpID09PSAncHJpdmF0ZS1wYXJlbnQnLCAnY2hpbGQgaW5oZXJpdHMgcGFyZW50IGdldHRlcicpO1xuICBhc3NlcnQoY2hpbGQuZ2V0Q2hpbGRQcml2YXRlKCkgPT09ICdwcml2YXRlLWNoaWxkJywgJ2NoaWxkIGhhcyBpdHMgb3duIHByaXZhdGUgdmFsdWUnKTtcblxuICAvLyBQdWJsaWMgcHJvcGVydGllcyBvdmVycmlkZSBjb3JyZWN0bHlcbiAgYXNzZXJ0KHBhcmVudC5wdWJsaWNQcm9wID09PSAncHVibGljLXBhcmVudCcsICdwYXJlbnQgcHVibGljIHByb3AnKTtcbiAgYXNzZXJ0KGNoaWxkLnB1YmxpY1Byb3AgPT09ICdwdWJsaWMtY2hpbGQnLCAnY2hpbGQgb3ZlcnJpZGVzIHB1YmxpYyBwcm9wJyk7XG5cbiAgcGFyZW50LnJlbW92ZSgpO1xuICBjaGlsZC5yZW1vdmUoKTtcbn0pO1xuXG5pdCgncHJvcGVydHkgbW9kaWZpY2F0aW9ucyBkbyBub3QgYWZmZWN0IHBhcmVudCBjbGFzcycsICgpID0+IHtcbiAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1wYXJlbnQtZWxlbWVudCcpO1xuICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtY2hpbGQtZWxlbWVudCcpO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKHBhcmVudCwgY2hpbGQpO1xuXG4gIC8vIE1vZGlmeSBjaGlsZCBpbnN0YW5jZVxuICBjaGlsZC5wYXJlbnRQcm9wID0gJ21vZGlmaWVkJztcbiAgY2hpbGQuc2hhcmVkUHJvcCA9IDk5OTtcblxuICAvLyBQYXJlbnQgaW5zdGFuY2Ugc2hvdWxkIGJlIHVuYWZmZWN0ZWRcbiAgYXNzZXJ0KHBhcmVudC5wYXJlbnRQcm9wID09PSAncGFyZW50LXZhbHVlJywgJ3BhcmVudCBpbnN0YW5jZSB1bmNoYW5nZWQnKTtcbiAgYXNzZXJ0KHBhcmVudC5zaGFyZWRQcm9wID09PSA0MiwgJ3BhcmVudCBpbnN0YW5jZSB1bmNoYW5nZWQnKTtcblxuICAvLyBDcmVhdGUgbmV3IHBhcmVudCB0byB2ZXJpZnkgY2xhc3MgZGVmaW5pdGlvbiB1bmNoYW5nZWRcbiAgY29uc3QgcGFyZW50MiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtcGFyZW50LWVsZW1lbnQnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQocGFyZW50Mik7XG4gIGFzc2VydChwYXJlbnQyLnBhcmVudFByb3AgPT09ICdwYXJlbnQtdmFsdWUnLCAncGFyZW50IGNsYXNzIGRlZmluaXRpb24gdW5jaGFuZ2VkJyk7XG4gIGFzc2VydChwYXJlbnQyLnNoYXJlZFByb3AgPT09IDQyLCAncGFyZW50IGNsYXNzIGRlZmluaXRpb24gdW5jaGFuZ2VkJyk7XG5cbiAgcGFyZW50LnJlbW92ZSgpO1xuICBjaGlsZC5yZW1vdmUoKTtcbiAgcGFyZW50Mi5yZW1vdmUoKTtcbn0pO1xuXG5pdCgnb3V0LW9mLW9yZGVyIGFuYWx5c2lzIChjaGlsZCBhbmFseXplZCBiZWZvcmUgcGFyZW50KScsICgpID0+IHtcbiAgLy8gRGVmaW5lIG5ldyBwYXJlbnQgYW5kIGNoaWxkIGNsYXNzZXMgaW5saW5lIHRvIGVuc3VyZSBmcmVzaCBhbmFseXNpc1xuICBjbGFzcyBPdXRPZk9yZGVyUGFyZW50IGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5pdGlhbDogJ3BhcmVudC1vb28nIH0pXG4gICAgYWNjZXNzb3IgcGFyZW50VmFsdWU7XG5cbiAgICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDEwIH0pXG4gICAgYWNjZXNzb3Igc2hhcmVkVmFsdWU7XG4gIH1cblxuICBjbGFzcyBPdXRPZk9yZGVyQ2hpbGQgZXh0ZW5kcyBPdXRPZk9yZGVyUGFyZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICdjaGlsZC1vb28nIH0pXG4gICAgYWNjZXNzb3IgY2hpbGRWYWx1ZTtcblxuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IE51bWJlciwgaW5pdGlhbDogMjAgfSlcbiAgICBhY2Nlc3NvciBzaGFyZWRWYWx1ZTtcbiAgfVxuXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1vb28tcGFyZW50JywgT3V0T2ZPcmRlclBhcmVudCk7XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1vb28tY2hpbGQnLCBPdXRPZk9yZGVyQ2hpbGQpO1xuXG4gIC8vIENyZWF0ZSBjaGlsZCBGSVJTVCAtIHRoaXMgdHJpZ2dlcnMgYW5hbHlzaXMgb2YgY2hpbGQsIHdoaWNoIHNob3VsZFxuICAvLyBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgcGFyZW50IGFuYWx5c2lzIGZpcnN0IHRvIGVuc3VyZSBwcm9wZXIgaW5oZXJpdGFuY2VcbiAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LW9vby1jaGlsZCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChjaGlsZCk7XG5cbiAgLy8gVmVyaWZ5IGNoaWxkIGhhcyBjb3JyZWN0IHZhbHVlcyAod291bGQgZmFpbCBpZiBwYXJlbnQgd2Fzbid0IGFuYWx5emVkIGZpcnN0KVxuICBhc3NlcnQoY2hpbGQucGFyZW50VmFsdWUgPT09ICdwYXJlbnQtb29vJywgJ2NoaWxkIGluaGVyaXRzIHBhcmVudCBwcm9wZXJ0eScpO1xuICBhc3NlcnQoY2hpbGQuY2hpbGRWYWx1ZSA9PT0gJ2NoaWxkLW9vbycsICdjaGlsZCBoYXMgaXRzIG93biBwcm9wZXJ0eScpO1xuICBhc3NlcnQoY2hpbGQuc2hhcmVkVmFsdWUgPT09IDIwLCAnY2hpbGQgb3ZlcnJpZGVzIHBhcmVudCBwcm9wZXJ0eScpO1xuXG4gIC8vIE5vdyBjcmVhdGUgcGFyZW50IGFuZCB2ZXJpZnkgaXQncyB1bmFmZmVjdGVkIGJ5IGNoaWxkXG4gIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3Qtb29vLXBhcmVudCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChwYXJlbnQpO1xuXG4gIGFzc2VydChwYXJlbnQucGFyZW50VmFsdWUgPT09ICdwYXJlbnQtb29vJywgJ3BhcmVudCBwcm9wZXJ0eSBjb3JyZWN0Jyk7XG4gIGFzc2VydChwYXJlbnQuc2hhcmVkVmFsdWUgPT09IDEwLCAncGFyZW50IHByb3BlcnR5IG5vdCBhZmZlY3RlZCBieSBjaGlsZCcpO1xuICBhc3NlcnQocGFyZW50LmNoaWxkVmFsdWUgPT09IHVuZGVmaW5lZCwgJ3BhcmVudCBkb2VzIG5vdCBoYXZlIGNoaWxkIHByb3BlcnR5Jyk7XG5cbiAgY2hpbGQucmVtb3ZlKCk7XG4gIHBhcmVudC5yZW1vdmUoKTtcbn0pO1xuXG5pdCgncGFyZW50IGFuZCBjaGlsZCBib3RoIGxpc3RlbiB0byBzYW1lIGV2ZW50IHR5cGUnLCAoKSA9PiB7XG4gIC8vIFBhcmVudCBhbmQgY2hpbGQgZWFjaCBoYXZlIGRpZmZlcmVudCBtZXRob2RzIGxpc3RlbmluZyB0byBzYW1lIGV2ZW50IHR5cGVcbiAgY2xhc3MgUGFyZW50TXVsdGlMaXN0ZW5lciBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDAgfSlcbiAgICBhY2Nlc3NvciBwYXJlbnRDb3VudDtcblxuICAgIEBsaXN0ZW5lcignc2hhcmVkLWV2ZW50JylcbiAgICBzdGF0aWMgb25QYXJlbnRTaGFyZWQoaG9zdCkge1xuICAgICAgaG9zdC5wYXJlbnRDb3VudCsrO1xuICAgIH1cblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICByZXR1cm4gaHRtbGA8ZGl2PnBhcmVudDogJHtob3N0LnBhcmVudENvdW50fTwvZGl2PmA7XG4gICAgfVxuICB9XG5cbiAgY2xhc3MgQ2hpbGRNdWx0aUxpc3RlbmVyIGV4dGVuZHMgUGFyZW50TXVsdGlMaXN0ZW5lciB7XG4gICAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAwIH0pXG4gICAgYWNjZXNzb3IgY2hpbGRDb3VudDtcblxuICAgIEBsaXN0ZW5lcignc2hhcmVkLWV2ZW50JylcbiAgICBzdGF0aWMgb25DaGlsZFNoYXJlZChob3N0KSB7XG4gICAgICBob3N0LmNoaWxkQ291bnQrKztcbiAgICB9XG5cbiAgICBzdGF0aWMgdGVtcGxhdGUoaG9zdCkge1xuICAgICAgcmV0dXJuIGh0bWxgPGRpdj5wYXJlbnQ6ICR7aG9zdC5wYXJlbnRDb3VudH0sIGNoaWxkOiAke2hvc3QuY2hpbGRDb3VudH08L2Rpdj5gO1xuICAgIH1cbiAgfVxuXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1wYXJlbnQtbXVsdGknLCBQYXJlbnRNdWx0aUxpc3RlbmVyKTtcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWNoaWxkLW11bHRpJywgQ2hpbGRNdWx0aUxpc3RlbmVyKTtcblxuICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtY2hpbGQtbXVsdGknKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoY2hpbGQpO1xuXG4gIGFzc2VydChjaGlsZC5wYXJlbnRDb3VudCA9PT0gMCwgJ3BhcmVudCBjb3VudCBzdGFydHMgYXQgMCcpO1xuICBhc3NlcnQoY2hpbGQuY2hpbGRDb3VudCA9PT0gMCwgJ2NoaWxkIGNvdW50IHN0YXJ0cyBhdCAwJyk7XG5cbiAgLy8gRGlzcGF0Y2ggc2hhcmVkIGV2ZW50IC0gYm90aCBwYXJlbnQgYW5kIGNoaWxkIGxpc3RlbmVycyBzaG91bGQgZmlyZVxuICBjaGlsZC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzaGFyZWQtZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIGFzc2VydChjaGlsZC5wYXJlbnRDb3VudCA9PT0gMSwgJ3BhcmVudCBsaXN0ZW5lciBmaXJlZCcpO1xuICBhc3NlcnQoY2hpbGQuY2hpbGRDb3VudCA9PT0gMSwgJ2NoaWxkIGxpc3RlbmVyIGZpcmVkJyk7XG5cbiAgLy8gRmlyZSBhZ2FpbiAtIGJvdGggc2hvdWxkIGluY3JlbWVudFxuICBjaGlsZC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzaGFyZWQtZXZlbnQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIGFzc2VydChjaGlsZC5wYXJlbnRDb3VudCA9PT0gMiwgJ3BhcmVudCBsaXN0ZW5lciBmaXJlZCBhZ2FpbicpO1xuICBhc3NlcnQoY2hpbGQuY2hpbGRDb3VudCA9PT0gMiwgJ2NoaWxkIGxpc3RlbmVyIGZpcmVkIGFnYWluJyk7XG5cbiAgLy8gVmVyaWZ5IHBhcmVudCBpbnN0YW5jZSBvbmx5IGhhcyBwYXJlbnQgbGlzdGVuZXJcbiAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1wYXJlbnQtbXVsdGknKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQocGFyZW50KTtcblxuICBwYXJlbnQuc2hhZG93Um9vdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2hhcmVkLWV2ZW50JywgeyBidWJibGVzOiB0cnVlIH0pKTtcblxuICBhc3NlcnQocGFyZW50LnBhcmVudENvdW50ID09PSAxLCAncGFyZW50IGxpc3RlbmVyIHdvcmtzIG9uIHBhcmVudCBpbnN0YW5jZScpO1xuICBhc3NlcnQocGFyZW50LmNoaWxkQ291bnQgPT09IHVuZGVmaW5lZCwgJ3BhcmVudCBpbnN0YW5jZSBoYXMgbm8gY2hpbGQgbGlzdGVuZXInKTtcblxuICBjaGlsZC5yZW1vdmUoKTtcbiAgcGFyZW50LnJlbW92ZSgpO1xufSk7XG5cbml0KCdjaGlsZCBvdmVycmlkZXMgcGFyZW50IGxpc3RlbmVyIHdpdGggc2FtZSBtZXRob2QgbmFtZScsICgpID0+IHtcbiAgLy8gV2hlbiBjaGlsZCByZWRlZmluZXMgYSBtZXRob2Qgd2l0aCB0aGUgc2FtZSBuYW1lLCBvbmx5IGNoaWxkJ3MgbGlzdGVuZXIgZmlyZXNcbiAgY2xhc3MgUGFyZW50V2l0aE1ldGhvZCBleHRlbmRzIFhFbGVtZW50IHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDAgfSlcbiAgICBhY2Nlc3NvciBwYXJlbnRDbGlja3M7XG5cbiAgICBAbGlzdGVuZXIoJ2NsaWNrJylcbiAgICBzdGF0aWMgb25DbGljayhob3N0KSB7XG4gICAgICBob3N0LnBhcmVudENsaWNrcysrO1xuICAgIH1cblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICByZXR1cm4gaHRtbGA8ZGl2PnBhcmVudDogJHtob3N0LnBhcmVudENsaWNrc308L2Rpdj5gO1xuICAgIH1cbiAgfVxuXG4gIGNsYXNzIENoaWxkT3ZlcnJpZGVzTWV0aG9kIGV4dGVuZHMgUGFyZW50V2l0aE1ldGhvZCB7XG4gICAgQHByb3BlcnR5KHsgdHlwZTogTnVtYmVyLCBpbml0aWFsOiAwIH0pXG4gICAgYWNjZXNzb3IgY2hpbGRDbGlja3M7XG5cbiAgICBAbGlzdGVuZXIoJ2NsaWNrJylcbiAgICBzdGF0aWMgb25DbGljayhob3N0KSB7XG4gICAgICAvLyBTYW1lIG1ldGhvZCBuYW1lIGFzIHBhcmVudCAtIHNob3VsZCBvdmVycmlkZVxuICAgICAgaG9zdC5jaGlsZENsaWNrcysrO1xuICAgIH1cblxuICAgIHN0YXRpYyB0ZW1wbGF0ZShob3N0KSB7XG4gICAgICByZXR1cm4gaHRtbGA8ZGl2PnBhcmVudDogJHtob3N0LnBhcmVudENsaWNrc30sIGNoaWxkOiAke2hvc3QuY2hpbGRDbGlja3N9PC9kaXY+YDtcbiAgICB9XG4gIH1cblxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtcGFyZW50LXdpdGgtbWV0aG9kJywgUGFyZW50V2l0aE1ldGhvZCk7XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1jaGlsZC1vdmVycmlkZXMtbWV0aG9kJywgQ2hpbGRPdmVycmlkZXNNZXRob2QpO1xuXG4gIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1jaGlsZC1vdmVycmlkZXMtbWV0aG9kJyk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGNoaWxkKTtcblxuICBhc3NlcnQoY2hpbGQucGFyZW50Q2xpY2tzID09PSAwLCAncGFyZW50IGNsaWNrcyBzdGFydHMgYXQgMCcpO1xuICBhc3NlcnQoY2hpbGQuY2hpbGRDbGlja3MgPT09IDAsICdjaGlsZCBjbGlja3Mgc3RhcnRzIGF0IDAnKTtcblxuICAvLyBEaXNwYXRjaCBjbGljayBldmVudCAtIG9ubHkgY2hpbGQncyBvbkNsaWNrIHNob3VsZCBmaXJlXG4gIGNoaWxkLnNoYWRvd1Jvb3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NsaWNrJywgeyBidWJibGVzOiB0cnVlIH0pKTtcblxuICBhc3NlcnQoY2hpbGQucGFyZW50Q2xpY2tzID09PSAwLCAncGFyZW50IGxpc3RlbmVyIGRpZCBub3QgZmlyZSAob3ZlcnJpZGRlbiBieSBjaGlsZCknKTtcbiAgYXNzZXJ0KGNoaWxkLmNoaWxkQ2xpY2tzID09PSAxLCAnY2hpbGQgbGlzdGVuZXIgZmlyZWQnKTtcblxuICAvLyBWZXJpZnkgcGFyZW50IGluc3RhbmNlIHVzZXMgcGFyZW50J3Mgb25DbGlja1xuICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LXBhcmVudC13aXRoLW1ldGhvZCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChwYXJlbnQpO1xuXG4gIHBhcmVudC5zaGFkb3dSb290LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjbGljaycsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgYXNzZXJ0KHBhcmVudC5wYXJlbnRDbGlja3MgPT09IDEsICdwYXJlbnQgbGlzdGVuZXIgd29ya3Mgb24gcGFyZW50IGluc3RhbmNlJyk7XG4gIGFzc2VydChwYXJlbnQuY2hpbGRDbGlja3MgPT09IHVuZGVmaW5lZCwgJ3BhcmVudCBpbnN0YW5jZSBoYXMgbm8gY2hpbGQgcHJvcGVydHknKTtcblxuICBjaGlsZC5yZW1vdmUoKTtcbiAgcGFyZW50LnJlbW92ZSgpO1xufSk7XG5cbml0KCdwbGFpbiBjbGFzcyB3aXRob3V0IGRlY29yYXRvcnMgKG1pc3NpbmcgbWV0YWRhdGEgbGluaykgd29ya3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAvLyBUZXN0IHRoYXQgYSBjbGFzcyB3aXRob3V0IGRlY29yYXRvcnMgaW4gdGhlIG1pZGRsZSBvZiB0aGUgaW5oZXJpdGFuY2UgY2hhaW5cbiAgLy8gd29ya3MgY29ycmVjdGx5IGFuZCBkb2Vzbid0IGhhdmUgU3ltYm9sLm1ldGFkYXRhIHBvbGx1dGVkIG9udG8gaXRcblxuICBjbGFzcyBEZWNvcmF0ZWRCYXNlIGV4dGVuZHMgWEVsZW1lbnQge1xuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFN0cmluZywgaW5pdGlhbDogJ2Jhc2UtdmFsdWUnIH0pXG4gICAgYWNjZXNzb3IgYmFzZVByb3A7XG5cbiAgICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDEgfSlcbiAgICBhY2Nlc3NvciBnZW5lcmF0aW9uO1xuICB9XG5cbiAgLy8gUGxhaW4gY2xhc3Mgd2l0aCBOTyBkZWNvcmF0b3JzIC0gdGhpcyBpcyB0aGUgXCJtaXNzaW5nIGxpbmtcIlxuICBjbGFzcyBQbGFpbk1pZGRsZSBleHRlbmRzIERlY29yYXRlZEJhc2Uge1xuICAgIC8vIE5vIGRlY29yYXRvcnMhIEp1c3QgcGxhaW4gY2xhc3MgZXh0ZW5kaW5nIGRlY29yYXRlZCBiYXNlXG4gIH1cblxuICBjbGFzcyBEZWNvcmF0ZWRDaGlsZCBleHRlbmRzIFBsYWluTWlkZGxlIHtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBTdHJpbmcsIGluaXRpYWw6ICdjaGlsZC12YWx1ZScgfSlcbiAgICBhY2Nlc3NvciBjaGlsZFByb3A7XG5cbiAgICBAcHJvcGVydHkoeyB0eXBlOiBOdW1iZXIsIGluaXRpYWw6IDMgfSlcbiAgICBhY2Nlc3NvciBnZW5lcmF0aW9uO1xuICB9XG5cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWRlY29yYXRlZC1iYXNlLWxpbmsnLCBEZWNvcmF0ZWRCYXNlKTtcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXBsYWluLW1pZGRsZS1saW5rJywgUGxhaW5NaWRkbGUpO1xuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZGVjb3JhdGVkLWNoaWxkLWxpbmsnLCBEZWNvcmF0ZWRDaGlsZCk7XG5cbiAgLy8gQ1JJVElDQUw6IFZlcmlmeSBQbGFpbk1pZGRsZSBkb2Vzbid0IGhhdmUgU3ltYm9sLm1ldGFkYXRhIGFzIE9XTiBwcm9wZXJ0eVxuICAvLyAoaXQgbWlnaHQgaW5oZXJpdCBmcm9tIHBhcmVudCB2aWEgcHJvdG90eXBlIGNoYWluLCBidXQgc2hvdWxkbid0IGhhdmUgaXRzIG93bilcbiAgYXNzZXJ0KCFPYmplY3QuaGFzT3duKFBsYWluTWlkZGxlLCBTeW1ib2wubWV0YWRhdGEpLCAncGxhaW4gY2xhc3MgaGFzIG5vIG93biBTeW1ib2wubWV0YWRhdGEgcHJvcGVydHknKTtcblxuICAvLyBWZXJpZnkgRGVjb3JhdGVkQmFzZSBhbmQgRGVjb3JhdGVkQ2hpbGQgRE8gaGF2ZSBTeW1ib2wubWV0YWRhdGEgKGZyb20gZGVjb3JhdG9ycylcbiAgYXNzZXJ0KERlY29yYXRlZEJhc2VbU3ltYm9sLm1ldGFkYXRhXSAhPT0gdW5kZWZpbmVkLCAnZGVjb3JhdGVkIGJhc2UgaGFzIFN5bWJvbC5tZXRhZGF0YScpO1xuICBhc3NlcnQoRGVjb3JhdGVkQ2hpbGRbU3ltYm9sLm1ldGFkYXRhXSAhPT0gdW5kZWZpbmVkLCAnZGVjb3JhdGVkIGNoaWxkIGhhcyBTeW1ib2wubWV0YWRhdGEnKTtcblxuICAvLyBDcmVhdGUgaW5zdGFuY2VzIGFuZCB2ZXJpZnkgaW5oZXJpdGFuY2Ugc3RpbGwgd29ya3MgY29ycmVjdGx5XG4gIGNvbnN0IGJhc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXN0LWRlY29yYXRlZC1iYXNlLWxpbmsnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoYmFzZSk7XG5cbiAgYXNzZXJ0KGJhc2UuYmFzZVByb3AgPT09ICdiYXNlLXZhbHVlJywgJ2Jhc2UgaGFzIGJhc2VQcm9wJyk7XG4gIGFzc2VydChiYXNlLmdlbmVyYXRpb24gPT09IDEsICdiYXNlIGhhcyBnZW5lcmF0aW9uIDEnKTtcbiAgYXNzZXJ0KGJhc2UuY2hpbGRQcm9wID09PSB1bmRlZmluZWQsICdiYXNlIGhhcyBubyBjaGlsZCBwcm9wZXJ0eScpO1xuXG4gIGNvbnN0IG1pZGRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rlc3QtcGxhaW4tbWlkZGxlLWxpbmsnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobWlkZGxlKTtcblxuICBhc3NlcnQobWlkZGxlLmJhc2VQcm9wID09PSAnYmFzZS12YWx1ZScsICdtaWRkbGUgaW5oZXJpdHMgYmFzZVByb3AgZnJvbSBiYXNlJyk7XG4gIGFzc2VydChtaWRkbGUuZ2VuZXJhdGlvbiA9PT0gMSwgJ21pZGRsZSBpbmhlcml0cyBnZW5lcmF0aW9uIGZyb20gYmFzZScpO1xuICBhc3NlcnQobWlkZGxlLmNoaWxkUHJvcCA9PT0gdW5kZWZpbmVkLCAnbWlkZGxlIGhhcyBubyBjaGlsZCBwcm9wZXJ0eScpO1xuXG4gIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVzdC1kZWNvcmF0ZWQtY2hpbGQtbGluaycpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChjaGlsZCk7XG5cbiAgYXNzZXJ0KGNoaWxkLmJhc2VQcm9wID09PSAnYmFzZS12YWx1ZScsICdjaGlsZCBpbmhlcml0cyBiYXNlUHJvcCB0aHJvdWdoIHBsYWluIG1pZGRsZScpO1xuICBhc3NlcnQoY2hpbGQuY2hpbGRQcm9wID09PSAnY2hpbGQtdmFsdWUnLCAnY2hpbGQgaGFzIGNoaWxkUHJvcCcpO1xuICBhc3NlcnQoY2hpbGQuZ2VuZXJhdGlvbiA9PT0gMywgJ2NoaWxkIG92ZXJyaWRlcyBnZW5lcmF0aW9uJyk7XG5cbiAgLy8gVmVyaWZ5IHRoYXQgbW9kaWZpY2F0aW9ucyB0byBjaGlsZCBkb24ndCBhZmZlY3QgbWlkZGxlIG9yIGJhc2VcbiAgY2hpbGQuYmFzZVByb3AgPSAnbW9kaWZpZWQnO1xuICBhc3NlcnQobWlkZGxlLmJhc2VQcm9wID09PSAnYmFzZS12YWx1ZScsICdtaWRkbGUgdW5jaGFuZ2VkIGFmdGVyIGNoaWxkIG1vZGlmaWNhdGlvbicpO1xuICBhc3NlcnQoYmFzZS5iYXNlUHJvcCA9PT0gJ2Jhc2UtdmFsdWUnLCAnYmFzZSB1bmNoYW5nZWQgYWZ0ZXIgY2hpbGQgbW9kaWZpY2F0aW9uJyk7XG5cbiAgYmFzZS5yZW1vdmUoKTtcbiAgbWlkZGxlLnJlbW92ZSgpO1xuICBjaGlsZC5yZW1vdmUoKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxTQUFTQSxNQUFNLEVBQUVDLEVBQUUsUUFBUSwyQkFBMkI7QUFDdEQsU0FBU0MsUUFBUSxFQUFFQyxRQUFRLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxRQUFRLHNCQUFzQjs7QUFFekU7QUFDQSxNQUFNQyxhQUFhLFNBQVNKLFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQUssZ0JBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsVUFBQSxJQUFBQyxVQUFBLFNBQUFDLGVBQUEscUJBQUFDLGVBQUEsb0NBQVRWLFFBQVEsRUFBQVcsQ0FBQTtFQUFBO0VBQUEsQ0FBQUMsQ0FBQSxJQUFBTCxVQUFBLFFBQUFGLGdCQUFBO0VBQUEsTUFBQUksZUFBQSxHQUNqQ1IsUUFBUSxDQUFDO0lBQUVZLElBQUksRUFBRUMsTUFBTTtJQUFFQyxPQUFPLEVBQUU7RUFBZSxDQUFDLENBQUMsRUFBQUwsZUFBQSxHQUduRFQsUUFBUSxDQUFDO0lBQUVZLElBQUksRUFBRUcsTUFBTTtJQUFFRCxPQUFPLEVBQUU7RUFBRyxDQUFDLENBQUM7SUFBQSxhQUFBSCxDQUFBO0VBQUE7RUFBQSxJQUYvQkssVUFBVUEsQ0FBQUMsQ0FBQTtJQUFBLE1BQUFOLENBQUEsR0FBQU0sQ0FBQTtFQUFBO0VBQUEsQ0FBQUMsQ0FBQSxHQUFBYixnQkFBQTtFQUFBLElBR1ZjLFVBQVVBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFWQyxVQUFVQSxDQUFBRixDQUFBO0lBQUEsTUFBQUMsQ0FBQSxHQUFBRCxDQUFBO0VBQUE7RUFFbkIsT0FBT0csUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO0lBQ3BCLE9BQU9uQixJQUFJLFFBQVFtQixJQUFJLENBQUNMLFVBQVUsSUFBSUssSUFBSSxDQUFDRixVQUFVLFFBQVE7RUFDL0Q7QUFDRjtBQUVBLE1BQU1HLFlBQVksU0FBU25CLGFBQWEsQ0FBQztFQUFBO0lBQUEsQ0FBQW9CLGVBQUEsRUFBQUMsaUJBQUEsRUFBQUMsV0FBQSxJQUFBbEIsVUFBQSxTQUFBbUIsY0FBQSxvQkFBQUMsZ0JBQUEsb0NBQWR4QixhQUFhLEVBQUFPLENBQUE7RUFBQTtFQUFBLENBQUFDLENBQUEsSUFBQWMsV0FBQSxRQUFBRixlQUFBLFNBSXRDO0VBQUEsTUFBQUcsY0FBQSxHQUhDMUIsUUFBUSxDQUFDO0lBQUVZLElBQUksRUFBRUMsTUFBTTtJQUFFQyxPQUFPLEVBQUU7RUFBYyxDQUFDLENBQUMsRUFBQWEsZ0JBQUEsR0FJbEQzQixRQUFRLENBQUM7SUFBRVksSUFBSSxFQUFFRyxNQUFNO0lBQUVELE9BQU8sRUFBRTtFQUFJLENBQUMsQ0FBQztJQUFBLGFBQUFILENBQUE7RUFBQTtFQUFBLElBSGhDaUIsU0FBU0EsQ0FBQVgsQ0FBQTtJQUFBLE1BQUFOLENBQUEsR0FBQU0sQ0FBQTtFQUFBO0VBQUEsQ0FBQUMsQ0FBQSxHQUFBTSxpQkFBQTtFQUFBLElBSVRMLFVBQVVBLENBQUE7SUFBQSxhQUFBRCxDQUFBO0VBQUE7RUFBQSxJQUFWQyxVQUFVQSxDQUFBRixDQUFBO0lBQUEsTUFBQUMsQ0FBQSxHQUFBRCxDQUFBO0VBQUE7RUFFbkIsT0FBT0csUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO0lBQ3BCLE9BQU9uQixJQUFJLFFBQVFtQixJQUFJLENBQUNMLFVBQVUsSUFBSUssSUFBSSxDQUFDTyxTQUFTLElBQUlQLElBQUksQ0FBQ0YsVUFBVSxRQUFRO0VBQ2pGO0FBQ0Y7O0FBRUE7QUFDQSxNQUFNVSxrQkFBa0IsU0FBUzlCLFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQStCLGtCQUFBLEVBQUFDLFdBQUEsRUFBQUMsV0FBQSxJQUFBekIsVUFBQSxTQUFBMEIsa0JBQUEseUJBQUFDLGlCQUFBLHNDQUFUbkMsUUFBUSxFQUFBVyxDQUFBO0lBQUFzQixXQUFBO0VBQUE7RUFBQSxDQUFBckIsQ0FBQSxJQUFBb0IsV0FBQSxRQUFBRCxrQkFBQTtFQUFBLE1BQUFJLGlCQUFBLEdBQ3RDbEMsUUFBUSxDQUFDO0lBQUVZLElBQUksRUFBRUcsTUFBTTtJQUFFRCxPQUFPLEVBQUU7RUFBRSxDQUFDLENBQUMsRUFBQW1CLGtCQUFBLEdBR3RDaEMsUUFBUSxDQUFDLGNBQWMsQ0FBQztJQUFBLGFBQUFVLENBQUE7RUFBQTtFQUFBLElBRmhCd0IsWUFBWUEsQ0FBQWxCLENBQUE7SUFBQSxNQUFBTixDQUFBLEdBQUFNLENBQUE7RUFBQTtFQUVyQixPQUNPbUIsYUFBYUEsQ0FBQ2YsSUFBSSxFQUFFO0lBQ3pCQSxJQUFJLENBQUNjLFlBQVksRUFBRTtFQUNyQjtFQUVBLE9BQU9mLFFBQVFBLENBQUNDLElBQUksRUFBRTtJQUNwQixPQUFPbkIsSUFBSSxnQkFBZ0JtQixJQUFJLENBQUNjLFlBQVksUUFBUTtFQUN0RDtBQUNGO0FBRUEsTUFBTUUsaUJBQWlCLFNBQVNSLGtCQUFrQixDQUFDO0VBQUE7SUFBQSxDQUFBUyxpQkFBQSxFQUFBQyxXQUFBLEVBQUFDLFlBQUEsSUFBQWpDLFVBQUEsU0FBQWtDLGlCQUFBLHdCQUFBQyxnQkFBQSxxQ0FBbkJiLGtCQUFrQixFQUFBbkIsQ0FBQTtJQUFBOEIsWUFBQTtFQUFBO0VBQUEsQ0FBQTdCLENBQUEsSUFBQTRCLFdBQUEsUUFBQUQsaUJBQUE7RUFBQSxNQUFBSSxnQkFBQSxHQUMvQzFDLFFBQVEsQ0FBQztJQUFFWSxJQUFJLEVBQUVHLE1BQU07SUFBRUQsT0FBTyxFQUFFO0VBQUUsQ0FBQyxDQUFDLEVBQUEyQixpQkFBQSxHQUd0Q3hDLFFBQVEsQ0FBQyxhQUFhLENBQUM7SUFBQSxhQUFBVSxDQUFBO0VBQUE7RUFBQSxJQUZmZ0MsV0FBV0EsQ0FBQTFCLENBQUE7SUFBQSxNQUFBTixDQUFBLEdBQUFNLENBQUE7RUFBQTtFQUVwQixPQUNPMkIsWUFBWUEsQ0FBQ3ZCLElBQUksRUFBRTtJQUN4QkEsSUFBSSxDQUFDc0IsV0FBVyxFQUFFO0VBQ3BCO0VBRUEsT0FBT3ZCLFFBQVFBLENBQUNDLElBQUksRUFBRTtJQUNwQixPQUFPbkIsSUFBSSxnQkFBZ0JtQixJQUFJLENBQUNjLFlBQVksWUFBWWQsSUFBSSxDQUFDc0IsV0FBVyxRQUFRO0VBQ2xGO0FBQ0Y7O0FBRUE7QUFDQSxNQUFNRSxnQkFBZ0IsU0FBUzlDLFFBQVEsQ0FBQztFQUFBO0lBQUEsQ0FBQStDLFdBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsV0FBQSxJQUFBekMsVUFBQSxTQUFBMEMsVUFBQSxnQkFBQUMsZUFBQSxvQ0FBVG5ELFFBQVEsRUFBQVcsQ0FBQTtFQUFBO0VBQUEsQ0FBQUMsQ0FBQSxJQUFBcUMsV0FBQSxRQUFBRixXQUFBO0VBQUEsTUFBQUcsVUFBQSxHQUNwQ2pELFFBQVEsQ0FBQztJQUFFWSxJQUFJLEVBQUVDLE1BQU07SUFBRUMsT0FBTyxFQUFFO0VBQWMsQ0FBQyxDQUFDLEVBQUFvQyxlQUFBLEdBR2xEbEQsUUFBUSxDQUFDO0lBQUVZLElBQUksRUFBRUcsTUFBTTtJQUFFRCxPQUFPLEVBQUU7RUFBRSxDQUFDLENBQUM7SUFBQSxhQUFBSCxDQUFBO0VBQUE7RUFBQSxJQUY5QndDLEtBQUtBLENBQUFsQyxDQUFBO0lBQUEsTUFBQU4sQ0FBQSxHQUFBTSxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLEdBQUE2QixnQkFBQTtFQUFBLElBR0xLLFVBQVVBLENBQUE7SUFBQSxhQUFBbEMsQ0FBQTtFQUFBO0VBQUEsSUFBVmtDLFVBQVVBLENBQUFuQyxDQUFBO0lBQUEsTUFBQUMsQ0FBQSxHQUFBRCxDQUFBO0VBQUE7QUFDckI7QUFFQSxNQUFNb0MsV0FBVyxTQUFTUixnQkFBZ0IsQ0FBQztFQUFBO0lBQUEsQ0FBQVMsWUFBQSxFQUFBQyxpQkFBQSxFQUFBQyxXQUFBLElBQUFqRCxVQUFBLFNBQUFrRCxXQUFBLGdCQUFBQyxnQkFBQSxvQ0FBakJiLGdCQUFnQixFQUFBbkMsQ0FBQTtFQUFBO0VBQUEsQ0FBQUMsQ0FBQSxJQUFBNkMsV0FBQSxRQUFBRixZQUFBO0VBQUEsTUFBQUcsV0FBQSxHQUN2Q3pELFFBQVEsQ0FBQztJQUFFWSxJQUFJLEVBQUVDLE1BQU07SUFBRUMsT0FBTyxFQUFFO0VBQVMsQ0FBQyxDQUFDLEVBQUE0QyxnQkFBQSxHQUc3QzFELFFBQVEsQ0FBQztJQUFFWSxJQUFJLEVBQUVHLE1BQU07SUFBRUQsT0FBTyxFQUFFO0VBQUUsQ0FBQyxDQUFDO0lBQUEsYUFBQUgsQ0FBQTtFQUFBO0VBQUEsSUFGOUJ3QyxLQUFLQSxDQUFBbEMsQ0FBQTtJQUFBLE1BQUFOLENBQUEsR0FBQU0sQ0FBQTtFQUFBO0VBQUEsQ0FBQUMsQ0FBQSxHQUFBcUMsaUJBQUE7RUFBQSxJQUdMSCxVQUFVQSxDQUFBO0lBQUEsYUFBQWxDLENBQUE7RUFBQTtFQUFBLElBQVZrQyxVQUFVQSxDQUFBbkMsQ0FBQTtJQUFBLE1BQUFDLENBQUEsR0FBQUQsQ0FBQTtFQUFBO0FBQ3JCO0FBRUEsTUFBTTBDLFVBQVUsU0FBU04sV0FBVyxDQUFDO0VBQUE7SUFBQSxDQUFBTyxZQUFBLEVBQUFDLGlCQUFBLEVBQUFDLFdBQUEsSUFBQXZELFVBQUEsU0FBQXdELFdBQUEsZ0JBQUFDLGdCQUFBLG9DQUFaWCxXQUFXLEVBQUEzQyxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLElBQUFtRCxXQUFBLFFBQUFGLFlBQUE7RUFBQSxNQUFBRyxXQUFBLEdBQ2pDL0QsUUFBUSxDQUFDO0lBQUVZLElBQUksRUFBRUMsTUFBTTtJQUFFQyxPQUFPLEVBQUU7RUFBUSxDQUFDLENBQUMsRUFBQWtELGdCQUFBLEdBRzVDaEUsUUFBUSxDQUFDO0lBQUVZLElBQUksRUFBRUcsTUFBTTtJQUFFRCxPQUFPLEVBQUU7RUFBRSxDQUFDLENBQUM7SUFBQSxhQUFBSCxDQUFBO0VBQUE7RUFBQSxJQUY5QndDLEtBQUtBLENBQUFsQyxDQUFBO0lBQUEsTUFBQU4sQ0FBQSxHQUFBTSxDQUFBO0VBQUE7RUFBQSxDQUFBQyxDQUFBLEdBQUEyQyxpQkFBQTtFQUFBLElBR0xULFVBQVVBLENBQUE7SUFBQSxhQUFBbEMsQ0FBQTtFQUFBO0VBQUEsSUFBVmtDLFVBQVVBLENBQUFuQyxDQUFBO0lBQUEsTUFBQUMsQ0FBQSxHQUFBRCxDQUFBO0VBQUE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUFnRCxjQUFjLENBQUNDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRS9ELGFBQWEsQ0FBQztBQUMzRDhELGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLG9CQUFvQixFQUFFNUMsWUFBWSxDQUFDO0FBQ3pEMkMsY0FBYyxDQUFDQyxNQUFNLENBQUMsMkJBQTJCLEVBQUVyQyxrQkFBa0IsQ0FBQztBQUN0RW9DLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLDBCQUEwQixFQUFFN0IsaUJBQWlCLENBQUM7QUFDcEU0QixjQUFjLENBQUNDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRXJCLGdCQUFnQixDQUFDO0FBQ2pFb0IsY0FBYyxDQUFDQyxNQUFNLENBQUMsbUJBQW1CLEVBQUViLFdBQVcsQ0FBQztBQUN2RFksY0FBYyxDQUFDQyxNQUFNLENBQUMsa0JBQWtCLEVBQUVQLFVBQVUsQ0FBQztBQUNyRDtBQUNBO0FBQ0E7O0FBRUE3RCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsTUFBTTtFQUMzQyxNQUFNcUUsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUMxREQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osS0FBSyxDQUFDO0VBQzNCO0VBQ0F0RSxNQUFNLENBQUNzRSxLQUFLLENBQUNuRCxVQUFVLEtBQUssY0FBYyxFQUFFLHFCQUFxQixDQUFDO0VBQ2xFbkIsTUFBTSxDQUFDc0UsS0FBSyxDQUFDdkMsU0FBUyxLQUFLLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQztFQUMvRHVDLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYxRSxFQUFFLENBQUMsc0NBQXNDLEVBQUUsTUFBTTtFQUMvQyxNQUFNcUUsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUMxREQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osS0FBSyxDQUFDO0VBQzNCO0VBQ0F0RSxNQUFNLENBQUNzRSxLQUFLLENBQUNoRCxVQUFVLEtBQUssR0FBRyxFQUFFLGlDQUFpQyxDQUFDO0VBQ25FZ0QsS0FBSyxDQUFDSyxNQUFNLENBQUMsQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRjFFLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxNQUFNO0VBQy9DLE1BQU0yRSxNQUFNLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLHFCQUFxQixDQUFDO0VBQzVERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDRSxNQUFNLENBQUM7RUFDNUI7RUFDQTVFLE1BQU0sQ0FBQzRFLE1BQU0sQ0FBQ3RELFVBQVUsS0FBSyxFQUFFLEVBQUUsMkJBQTJCLENBQUM7RUFDN0R0QixNQUFNLENBQUM0RSxNQUFNLENBQUM3QyxTQUFTLEtBQUs4QyxTQUFTLEVBQUUscUNBQXFDLENBQUM7RUFDN0VELE1BQU0sQ0FBQ0QsTUFBTSxDQUFDLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUYxRSxFQUFFLENBQUMseUNBQXlDLEVBQUUsTUFBTTtFQUNsRCxNQUFNcUUsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUMxREQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osS0FBSyxDQUFDO0VBQzNCLE1BQU1RLElBQUksR0FBR1IsS0FBSyxDQUFDUyxVQUFVLENBQUNDLFdBQVc7RUFDekNoRixNQUFNLENBQUM4RSxJQUFJLEtBQUssOEJBQThCLEVBQUUsbUNBQW1DLENBQUM7RUFDcEZSLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYxRSxFQUFFLENBQUMsaUNBQWlDLEVBQUUsTUFBTTtFQUMxQyxNQUFNcUUsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQztFQUNoRUQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osS0FBSyxDQUFDOztFQUUzQjtFQUNBdEUsTUFBTSxDQUFDc0UsS0FBSyxDQUFDaEMsWUFBWSxLQUFLLENBQUMsRUFBRSwyQkFBMkIsQ0FBQztFQUM3RHRDLE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQ3hCLFdBQVcsS0FBSyxDQUFDLEVBQUUsMEJBQTBCLENBQUM7O0VBRTNEO0VBQ0F3QixLQUFLLENBQUNTLFVBQVUsQ0FBQ0UsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxjQUFjLEVBQUU7SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFDbEZuRixNQUFNLENBQUNzRSxLQUFLLENBQUNoQyxZQUFZLEtBQUssQ0FBQyxFQUFFLGdDQUFnQyxDQUFDO0VBRWxFZ0MsS0FBSyxDQUFDUyxVQUFVLENBQUNFLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsYUFBYSxFQUFFO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ2pGbkYsTUFBTSxDQUFDc0UsS0FBSyxDQUFDeEIsV0FBVyxLQUFLLENBQUMsRUFBRSxzQkFBc0IsQ0FBQztFQUV2RHdCLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYxRSxFQUFFLENBQUMscUNBQXFDLEVBQUUsTUFBTTtFQUM5QyxNQUFNMkUsTUFBTSxHQUFHTCxRQUFRLENBQUNDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQztFQUNsRUQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0UsTUFBTSxDQUFDOztFQUU1QjtFQUNBQSxNQUFNLENBQUNHLFVBQVUsQ0FBQ0UsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxjQUFjLEVBQUU7SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFDbkZuRixNQUFNLENBQUM0RSxNQUFNLENBQUN0QyxZQUFZLEtBQUssQ0FBQyxFQUFFLHVCQUF1QixDQUFDOztFQUUxRDtFQUNBc0MsTUFBTSxDQUFDRyxVQUFVLENBQUNFLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsYUFBYSxFQUFFO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ2xGbkYsTUFBTSxDQUFDNEUsTUFBTSxDQUFDOUIsV0FBVyxLQUFLK0IsU0FBUyxFQUFFLHFDQUFxQyxDQUFDO0VBRS9FRCxNQUFNLENBQUNELE1BQU0sQ0FBQyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGMUUsRUFBRSxDQUFDLDhEQUE4RCxFQUFFLE1BQU07RUFDdkUsTUFBTW1GLFdBQVcsR0FBR2IsUUFBUSxDQUFDQyxhQUFhLENBQUMsd0JBQXdCLENBQUM7RUFDcEUsTUFBTUksTUFBTSxHQUFHTCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUMxRCxNQUFNRixLQUFLLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0VBRXhERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDVSxXQUFXLEVBQUVSLE1BQU0sRUFBRU4sS0FBSyxDQUFDO0VBRWhEdEUsTUFBTSxDQUFDb0YsV0FBVyxDQUFDOUIsS0FBSyxLQUFLLGFBQWEsRUFBRSwrQkFBK0IsQ0FBQztFQUM1RXRELE1BQU0sQ0FBQ29GLFdBQVcsQ0FBQzdCLFVBQVUsS0FBSyxDQUFDLEVBQUUsb0NBQW9DLENBQUM7RUFFMUV2RCxNQUFNLENBQUM0RSxNQUFNLENBQUN0QixLQUFLLEtBQUssUUFBUSxFQUFFLHdCQUF3QixDQUFDO0VBQzNEdEQsTUFBTSxDQUFDNEUsTUFBTSxDQUFDckIsVUFBVSxLQUFLLENBQUMsRUFBRSw2QkFBNkIsQ0FBQztFQUU5RHZELE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQ2hCLEtBQUssS0FBSyxPQUFPLEVBQUUsdUJBQXVCLENBQUM7RUFDeER0RCxNQUFNLENBQUNzRSxLQUFLLENBQUNmLFVBQVUsS0FBSyxDQUFDLEVBQUUsNEJBQTRCLENBQUM7RUFFNUQ2QixXQUFXLENBQUNULE1BQU0sQ0FBQyxDQUFDO0VBQ3BCQyxNQUFNLENBQUNELE1BQU0sQ0FBQyxDQUFDO0VBQ2ZMLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYxRSxFQUFFLENBQUNvRixJQUFJLENBQUMsc0RBQXNELEVBQUUsTUFBTTtFQUNwRSxNQUFNVCxNQUFNLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLDBCQUEwQixDQUFDO0VBQ2pFLE1BQU1GLEtBQUssR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMseUJBQXlCLENBQUM7RUFFL0RELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNFLE1BQU0sRUFBRU4sS0FBSyxDQUFDOztFQUVuQztFQUNBdEUsTUFBTSxDQUFDNEUsTUFBTSxDQUFDVSxVQUFVLENBQUMsQ0FBQyxLQUFLLGdCQUFnQixFQUFFLDhCQUE4QixDQUFDO0VBQ2hGdEYsTUFBTSxDQUFDc0UsS0FBSyxDQUFDZ0IsVUFBVSxDQUFDLENBQUMsS0FBSyxnQkFBZ0IsRUFBRSw4QkFBOEIsQ0FBQztFQUMvRXRGLE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQ2lCLGVBQWUsQ0FBQyxDQUFDLEtBQUssZUFBZSxFQUFFLGlDQUFpQyxDQUFDOztFQUV0RjtFQUNBdkYsTUFBTSxDQUFDNEUsTUFBTSxDQUFDWSxVQUFVLEtBQUssZUFBZSxFQUFFLG9CQUFvQixDQUFDO0VBQ25FeEYsTUFBTSxDQUFDc0UsS0FBSyxDQUFDa0IsVUFBVSxLQUFLLGNBQWMsRUFBRSw2QkFBNkIsQ0FBQztFQUUxRVosTUFBTSxDQUFDRCxNQUFNLENBQUMsQ0FBQztFQUNmTCxLQUFLLENBQUNLLE1BQU0sQ0FBQyxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGMUUsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLE1BQU07RUFDNUQsTUFBTTJFLE1BQU0sR0FBR0wsUUFBUSxDQUFDQyxhQUFhLENBQUMscUJBQXFCLENBQUM7RUFDNUQsTUFBTUYsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUUxREQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0UsTUFBTSxFQUFFTixLQUFLLENBQUM7O0VBRW5DO0VBQ0FBLEtBQUssQ0FBQ25ELFVBQVUsR0FBRyxVQUFVO0VBQzdCbUQsS0FBSyxDQUFDaEQsVUFBVSxHQUFHLEdBQUc7O0VBRXRCO0VBQ0F0QixNQUFNLENBQUM0RSxNQUFNLENBQUN6RCxVQUFVLEtBQUssY0FBYyxFQUFFLDJCQUEyQixDQUFDO0VBQ3pFbkIsTUFBTSxDQUFDNEUsTUFBTSxDQUFDdEQsVUFBVSxLQUFLLEVBQUUsRUFBRSwyQkFBMkIsQ0FBQzs7RUFFN0Q7RUFDQSxNQUFNbUUsT0FBTyxHQUFHbEIsUUFBUSxDQUFDQyxhQUFhLENBQUMscUJBQXFCLENBQUM7RUFDN0RELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNlLE9BQU8sQ0FBQztFQUM3QnpGLE1BQU0sQ0FBQ3lGLE9BQU8sQ0FBQ3RFLFVBQVUsS0FBSyxjQUFjLEVBQUUsbUNBQW1DLENBQUM7RUFDbEZuQixNQUFNLENBQUN5RixPQUFPLENBQUNuRSxVQUFVLEtBQUssRUFBRSxFQUFFLG1DQUFtQyxDQUFDO0VBRXRFc0QsTUFBTSxDQUFDRCxNQUFNLENBQUMsQ0FBQztFQUNmTCxLQUFLLENBQUNLLE1BQU0sQ0FBQyxDQUFDO0VBQ2RjLE9BQU8sQ0FBQ2QsTUFBTSxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDO0FBRUYxRSxFQUFFLENBQUMsc0RBQXNELEVBQUUsTUFBTTtFQUFBLElBQUF5RixXQUFBLEVBQUFDLGdCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGdCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLFdBQUEsRUFBQUMsZUFBQSxFQUFBQyxnQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxrQkFBQTtFQUMvRDtFQUNBLE1BQU1DLGdCQUFnQixTQUFTbEcsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBMEYsaUJBQUEsRUFBQUUsaUJBQUEsRUFBQUosV0FBQSxJQUFBaEYsVUFBQSxTQUFBaUYsZ0JBQUEsc0JBQUFFLGdCQUFBLHFDQUFUM0YsUUFBUSxFQUFBVyxDQUFBO0lBQUE7SUFBQSxDQUFBQyxDQUFBLElBQUE0RSxXQUFBLFFBQUFFLGlCQUFBO0lBQUEsTUFBQUQsZ0JBQUEsR0FDcEN4RixRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFQyxNQUFNO01BQUVDLE9BQU8sRUFBRTtJQUFhLENBQUMsQ0FBQyxFQUFBNEUsZ0JBQUEsR0FHakQxRixRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFRyxNQUFNO01BQUVELE9BQU8sRUFBRTtJQUFHLENBQUMsQ0FBQztNQUFBLGFBQUFILENBQUE7SUFBQTtJQUFBLElBRi9CdUYsV0FBV0EsQ0FBQWpGLENBQUE7TUFBQSxNQUFBTixDQUFBLEdBQUFNLENBQUE7SUFBQTtJQUFBLENBQUFDLENBQUEsR0FBQXlFLGlCQUFBO0lBQUEsSUFHWFEsV0FBV0EsQ0FBQTtNQUFBLGFBQUFqRixDQUFBO0lBQUE7SUFBQSxJQUFYaUYsV0FBV0EsQ0FBQWxGLENBQUE7TUFBQSxNQUFBQyxDQUFBLEdBQUFELENBQUE7SUFBQTtFQUN0QjtFQUVBLE1BQU1tRixlQUFlLFNBQVNILGdCQUFnQixDQUFDO0lBQUE7TUFBQSxDQUFBSCxnQkFBQSxFQUFBRSxrQkFBQSxFQUFBSixXQUFBLElBQUFyRixVQUFBLFNBQUFzRixlQUFBLHFCQUFBRSxpQkFBQSxxQ0FBakJFLGdCQUFnQixFQUFBdkYsQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBaUYsV0FBQSxRQUFBRSxnQkFBQTtJQUFBLE1BQUFELGVBQUEsR0FDM0M3RixRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFQyxNQUFNO01BQUVDLE9BQU8sRUFBRTtJQUFZLENBQUMsQ0FBQyxFQUFBaUYsaUJBQUEsR0FHaEQvRixRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFRyxNQUFNO01BQUVELE9BQU8sRUFBRTtJQUFHLENBQUMsQ0FBQztNQUFBLGFBQUFILENBQUE7SUFBQTtJQUFBLElBRi9CMEYsVUFBVUEsQ0FBQXBGLENBQUE7TUFBQSxNQUFBTixDQUFBLEdBQUFNLENBQUE7SUFBQTtJQUFBLENBQUFDLENBQUEsR0FBQThFLGtCQUFBO0lBQUEsSUFHVkcsV0FBV0EsQ0FBQTtNQUFBLGFBQUFqRixDQUFBO0lBQUE7SUFBQSxJQUFYaUYsV0FBV0EsQ0FBQWxGLENBQUE7TUFBQSxNQUFBQyxDQUFBLEdBQUFELENBQUE7SUFBQTtFQUN0QjtFQUVBZ0QsY0FBYyxDQUFDQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUrQixnQkFBZ0IsQ0FBQztFQUMxRGhDLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLGdCQUFnQixFQUFFa0MsZUFBZSxDQUFDOztFQUV4RDtFQUNBO0VBQ0EsTUFBTWpDLEtBQUssR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsZ0JBQWdCLENBQUM7RUFDdERELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEtBQUssQ0FBQzs7RUFFM0I7RUFDQXRFLE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQytCLFdBQVcsS0FBSyxZQUFZLEVBQUUsZ0NBQWdDLENBQUM7RUFDNUVyRyxNQUFNLENBQUNzRSxLQUFLLENBQUNrQyxVQUFVLEtBQUssV0FBVyxFQUFFLDRCQUE0QixDQUFDO0VBQ3RFeEcsTUFBTSxDQUFDc0UsS0FBSyxDQUFDZ0MsV0FBVyxLQUFLLEVBQUUsRUFBRSxpQ0FBaUMsQ0FBQzs7RUFFbkU7RUFDQSxNQUFNMUIsTUFBTSxHQUFHTCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztFQUN4REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0UsTUFBTSxDQUFDO0VBRTVCNUUsTUFBTSxDQUFDNEUsTUFBTSxDQUFDeUIsV0FBVyxLQUFLLFlBQVksRUFBRSx5QkFBeUIsQ0FBQztFQUN0RXJHLE1BQU0sQ0FBQzRFLE1BQU0sQ0FBQzBCLFdBQVcsS0FBSyxFQUFFLEVBQUUsdUNBQXVDLENBQUM7RUFDMUV0RyxNQUFNLENBQUM0RSxNQUFNLENBQUM0QixVQUFVLEtBQUszQixTQUFTLEVBQUUscUNBQXFDLENBQUM7RUFFOUVQLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7RUFDZEMsTUFBTSxDQUFDRCxNQUFNLENBQUMsQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRjFFLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxNQUFNO0VBQUEsSUFBQXdHLFdBQUEsRUFBQUMsWUFBQSxFQUFBQyxnQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxtQkFBQSxFQUFBQyxXQUFBLEVBQUFDLFlBQUEsRUFBQUMsZUFBQSxFQUFBQyxnQkFBQSxFQUFBQyxrQkFBQTtFQUMxRDtFQUNBLE1BQU1DLG1CQUFtQixTQUFTakgsUUFBUSxDQUFDO0lBQUE7TUFBQSxDQUFBMEcsaUJBQUEsRUFBQUgsV0FBQSxFQUFBQyxZQUFBLElBQUFoRyxVQUFBLFNBQUFtRyxtQkFBQSwwQkFBQUYsZ0JBQUEscUNBQVR6RyxRQUFRLEVBQUFXLENBQUE7TUFBQTZGLFlBQUE7SUFBQTtJQUFBLENBQUE1RixDQUFBLElBQUEyRixXQUFBLFFBQUFHLGlCQUFBO0lBQUEsTUFBQUQsZ0JBQUEsR0FDdkN4RyxRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFRyxNQUFNO01BQUVELE9BQU8sRUFBRTtJQUFFLENBQUMsQ0FBQyxFQUFBNEYsbUJBQUEsR0FHdEN6RyxRQUFRLENBQUMsY0FBYyxDQUFDO01BQUEsYUFBQVUsQ0FBQTtJQUFBO0lBQUEsSUFGaEJzRyxXQUFXQSxDQUFBaEcsQ0FBQTtNQUFBLE1BQUFOLENBQUEsR0FBQU0sQ0FBQTtJQUFBO0lBRXBCLE9BQ09pRyxjQUFjQSxDQUFDN0YsSUFBSSxFQUFFO01BQzFCQSxJQUFJLENBQUM0RixXQUFXLEVBQUU7SUFDcEI7SUFFQSxPQUFPN0YsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ3BCLE9BQU9uQixJQUFJLGdCQUFnQm1CLElBQUksQ0FBQzRGLFdBQVcsUUFBUTtJQUNyRDtFQUNGO0VBRUEsTUFBTUUsa0JBQWtCLFNBQVNILG1CQUFtQixDQUFDO0lBQUE7TUFBQSxDQUFBRixnQkFBQSxFQUFBSCxXQUFBLEVBQUFDLFlBQUEsSUFBQXJHLFVBQUEsU0FBQXdHLGtCQUFBLHlCQUFBRixlQUFBLG9DQUFwQkcsbUJBQW1CLEVBQUF0RyxDQUFBO01BQUFrRyxZQUFBO0lBQUE7SUFBQSxDQUFBakcsQ0FBQSxJQUFBZ0csV0FBQSxRQUFBRyxnQkFBQTtJQUFBLE1BQUFELGVBQUEsR0FDakQ3RyxRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFRyxNQUFNO01BQUVELE9BQU8sRUFBRTtJQUFFLENBQUMsQ0FBQyxFQUFBaUcsa0JBQUEsR0FHdEM5RyxRQUFRLENBQUMsY0FBYyxDQUFDO01BQUEsYUFBQVUsQ0FBQTtJQUFBO0lBQUEsSUFGaEJ5RyxVQUFVQSxDQUFBbkcsQ0FBQTtNQUFBLE1BQUFOLENBQUEsR0FBQU0sQ0FBQTtJQUFBO0lBRW5CLE9BQ09vRyxhQUFhQSxDQUFDaEcsSUFBSSxFQUFFO01BQ3pCQSxJQUFJLENBQUMrRixVQUFVLEVBQUU7SUFDbkI7SUFFQSxPQUFPaEcsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ3BCLE9BQU9uQixJQUFJLGdCQUFnQm1CLElBQUksQ0FBQzRGLFdBQVcsWUFBWTVGLElBQUksQ0FBQytGLFVBQVUsUUFBUTtJQUNoRjtFQUNGO0VBRUFuRCxjQUFjLENBQUNDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRThDLG1CQUFtQixDQUFDO0VBQy9EL0MsY0FBYyxDQUFDQyxNQUFNLENBQUMsa0JBQWtCLEVBQUVpRCxrQkFBa0IsQ0FBQztFQUU3RCxNQUFNaEQsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztFQUN4REQsUUFBUSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0osS0FBSyxDQUFDO0VBRTNCdEUsTUFBTSxDQUFDc0UsS0FBSyxDQUFDOEMsV0FBVyxLQUFLLENBQUMsRUFBRSwwQkFBMEIsQ0FBQztFQUMzRHBILE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQ2lELFVBQVUsS0FBSyxDQUFDLEVBQUUseUJBQXlCLENBQUM7O0VBRXpEO0VBQ0FqRCxLQUFLLENBQUNTLFVBQVUsQ0FBQ0UsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxjQUFjLEVBQUU7SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQUM7RUFFbEZuRixNQUFNLENBQUNzRSxLQUFLLENBQUM4QyxXQUFXLEtBQUssQ0FBQyxFQUFFLHVCQUF1QixDQUFDO0VBQ3hEcEgsTUFBTSxDQUFDc0UsS0FBSyxDQUFDaUQsVUFBVSxLQUFLLENBQUMsRUFBRSxzQkFBc0IsQ0FBQzs7RUFFdEQ7RUFDQWpELEtBQUssQ0FBQ1MsVUFBVSxDQUFDRSxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLGNBQWMsRUFBRTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FBQztFQUVsRm5GLE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQzhDLFdBQVcsS0FBSyxDQUFDLEVBQUUsNkJBQTZCLENBQUM7RUFDOURwSCxNQUFNLENBQUNzRSxLQUFLLENBQUNpRCxVQUFVLEtBQUssQ0FBQyxFQUFFLDRCQUE0QixDQUFDOztFQUU1RDtFQUNBLE1BQU0zQyxNQUFNLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQzFERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDRSxNQUFNLENBQUM7RUFFNUJBLE1BQU0sQ0FBQ0csVUFBVSxDQUFDRSxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLGNBQWMsRUFBRTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FBQztFQUVuRm5GLE1BQU0sQ0FBQzRFLE1BQU0sQ0FBQ3dDLFdBQVcsS0FBSyxDQUFDLEVBQUUsMENBQTBDLENBQUM7RUFDNUVwSCxNQUFNLENBQUM0RSxNQUFNLENBQUMyQyxVQUFVLEtBQUsxQyxTQUFTLEVBQUUsdUNBQXVDLENBQUM7RUFFaEZQLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7RUFDZEMsTUFBTSxDQUFDRCxNQUFNLENBQUMsQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRjFFLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxNQUFNO0VBQUEsSUFBQXdILFlBQUEsRUFBQUMsWUFBQSxFQUFBQyxrQkFBQSxFQUFBQyxtQkFBQSxFQUFBQyxZQUFBLEVBQUFDLFlBQUEsRUFBQUMsWUFBQSxFQUFBQyxpQkFBQSxFQUFBQyxrQkFBQSxFQUFBQyxhQUFBO0VBQ2hFO0VBQ0EsTUFBTUMsZ0JBQWdCLFNBQVNqSSxRQUFRLENBQUM7SUFBQTtNQUFBLENBQUEwSCxtQkFBQSxFQUFBSCxZQUFBLEVBQUFDLFlBQUEsSUFBQWhILFVBQUEsU0FBQW1ILFlBQUEsbUJBQUFGLGtCQUFBLHNDQUFUekgsUUFBUSxFQUFBVyxDQUFBO01BQUE2RyxZQUFBO0lBQUE7SUFBQSxDQUFBNUcsQ0FBQSxJQUFBMkcsWUFBQSxRQUFBRyxtQkFBQTtJQUFBLE1BQUFELGtCQUFBLEdBQ3BDeEgsUUFBUSxDQUFDO01BQUVZLElBQUksRUFBRUcsTUFBTTtNQUFFRCxPQUFPLEVBQUU7SUFBRSxDQUFDLENBQUMsRUFBQTRHLFlBQUEsR0FHdEN6SCxRQUFRLENBQUMsT0FBTyxDQUFDO01BQUEsYUFBQVUsQ0FBQTtJQUFBO0lBQUEsSUFGVHdCLFlBQVlBLENBQUFsQixDQUFBO01BQUEsTUFBQU4sQ0FBQSxHQUFBTSxDQUFBO0lBQUE7SUFFckIsT0FDT2dILE9BQU9BLENBQUM1RyxJQUFJLEVBQUU7TUFDbkJBLElBQUksQ0FBQ2MsWUFBWSxFQUFFO0lBQ3JCO0lBRUEsT0FBT2YsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ3BCLE9BQU9uQixJQUFJLGdCQUFnQm1CLElBQUksQ0FBQ2MsWUFBWSxRQUFRO0lBQ3REO0VBQ0Y7RUFFQSxNQUFNK0Ysb0JBQW9CLFNBQVNGLGdCQUFnQixDQUFDO0lBQUE7TUFBQSxDQUFBRixrQkFBQSxFQUFBSCxZQUFBLEVBQUFDLFlBQUEsSUFBQXJILFVBQUEsU0FBQXdILGFBQUEsbUJBQUFGLGlCQUFBLHFDQUFqQkcsZ0JBQWdCLEVBQUF0SCxDQUFBO01BQUFrSCxZQUFBO0lBQUE7SUFBQSxDQUFBakgsQ0FBQSxJQUFBZ0gsWUFBQSxRQUFBRyxrQkFBQTtJQUFBLE1BQUFELGlCQUFBLEdBQ2hEN0gsUUFBUSxDQUFDO01BQUVZLElBQUksRUFBRUcsTUFBTTtNQUFFRCxPQUFPLEVBQUU7SUFBRSxDQUFDLENBQUMsRUFBQWlILGFBQUEsR0FHdEM5SCxRQUFRLENBQUMsT0FBTyxDQUFDO01BQUEsYUFBQVUsQ0FBQTtJQUFBO0lBQUEsSUFGVGdDLFdBQVdBLENBQUExQixDQUFBO01BQUEsTUFBQU4sQ0FBQSxHQUFBTSxDQUFBO0lBQUE7SUFFcEIsT0FDT2dILE9BQU9BLENBQUM1RyxJQUFJLEVBQUU7TUFDbkI7TUFDQUEsSUFBSSxDQUFDc0IsV0FBVyxFQUFFO0lBQ3BCO0lBRUEsT0FBT3ZCLFFBQVFBLENBQUNDLElBQUksRUFBRTtNQUNwQixPQUFPbkIsSUFBSSxnQkFBZ0JtQixJQUFJLENBQUNjLFlBQVksWUFBWWQsSUFBSSxDQUFDc0IsV0FBVyxRQUFRO0lBQ2xGO0VBQ0Y7RUFFQXNCLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLHlCQUF5QixFQUFFOEQsZ0JBQWdCLENBQUM7RUFDbEUvRCxjQUFjLENBQUNDLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRWdFLG9CQUFvQixDQUFDO0VBRTFFLE1BQU0vRCxLQUFLLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLDZCQUE2QixDQUFDO0VBQ25FRCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDSixLQUFLLENBQUM7RUFFM0J0RSxNQUFNLENBQUNzRSxLQUFLLENBQUNoQyxZQUFZLEtBQUssQ0FBQyxFQUFFLDJCQUEyQixDQUFDO0VBQzdEdEMsTUFBTSxDQUFDc0UsS0FBSyxDQUFDeEIsV0FBVyxLQUFLLENBQUMsRUFBRSwwQkFBMEIsQ0FBQzs7RUFFM0Q7RUFDQXdCLEtBQUssQ0FBQ1MsVUFBVSxDQUFDRSxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FBQztFQUUzRW5GLE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQ2hDLFlBQVksS0FBSyxDQUFDLEVBQUUsb0RBQW9ELENBQUM7RUFDdEZ0QyxNQUFNLENBQUNzRSxLQUFLLENBQUN4QixXQUFXLEtBQUssQ0FBQyxFQUFFLHNCQUFzQixDQUFDOztFQUV2RDtFQUNBLE1BQU04QixNQUFNLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLHlCQUF5QixDQUFDO0VBQ2hFRCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDRSxNQUFNLENBQUM7RUFFNUJBLE1BQU0sQ0FBQ0csVUFBVSxDQUFDRSxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FBQztFQUU1RW5GLE1BQU0sQ0FBQzRFLE1BQU0sQ0FBQ3RDLFlBQVksS0FBSyxDQUFDLEVBQUUsMENBQTBDLENBQUM7RUFDN0V0QyxNQUFNLENBQUM0RSxNQUFNLENBQUM5QixXQUFXLEtBQUsrQixTQUFTLEVBQUUsdUNBQXVDLENBQUM7RUFFakZQLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7RUFDZEMsTUFBTSxDQUFDRCxNQUFNLENBQUMsQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRjFFLEVBQUUsQ0FBQyx3RUFBd0UsRUFBRSxNQUFNO0VBQUEsSUFBQXFJLFlBQUEsRUFBQUMsYUFBQSxFQUFBQyxjQUFBLEVBQUFDLGdCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLFlBQUEsRUFBQUMsZUFBQSxFQUFBQyxnQkFBQSxFQUFBQyxnQkFBQSxFQUFBQyxpQkFBQTtFQUNqRjtFQUNBOztFQUVBLE1BQU1DLGFBQWEsU0FBUzlJLFFBQVEsQ0FBQztJQUFBO01BQUEsQ0FBQXNJLGNBQUEsRUFBQUUsaUJBQUEsRUFBQUosWUFBQSxJQUFBNUgsVUFBQSxTQUFBNkgsYUFBQSxtQkFBQUUsZ0JBQUEsb0NBQVR2SSxRQUFRLEVBQUFXLENBQUE7SUFBQTtJQUFBLENBQUFDLENBQUEsSUFBQXdILFlBQUEsUUFBQUUsY0FBQTtJQUFBLE1BQUFELGFBQUEsR0FDakNwSSxRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFQyxNQUFNO01BQUVDLE9BQU8sRUFBRTtJQUFhLENBQUMsQ0FBQyxFQUFBd0gsZ0JBQUEsR0FHakR0SSxRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFRyxNQUFNO01BQUVELE9BQU8sRUFBRTtJQUFFLENBQUMsQ0FBQztNQUFBLGFBQUFILENBQUE7SUFBQTtJQUFBLElBRjlCbUksUUFBUUEsQ0FBQTdILENBQUE7TUFBQSxNQUFBTixDQUFBLEdBQUFNLENBQUE7SUFBQTtJQUFBLENBQUFDLENBQUEsR0FBQXFILGlCQUFBO0lBQUEsSUFHUm5GLFVBQVVBLENBQUE7TUFBQSxhQUFBbEMsQ0FBQTtJQUFBO0lBQUEsSUFBVmtDLFVBQVVBLENBQUFuQyxDQUFBO01BQUEsTUFBQUMsQ0FBQSxHQUFBRCxDQUFBO0lBQUE7RUFDckI7O0VBRUE7RUFDQSxNQUFNOEgsV0FBVyxTQUFTRixhQUFhLENBQUM7SUFDdEM7RUFBQTtFQUdGLE1BQU1HLGNBQWMsU0FBU0QsV0FBVyxDQUFDO0lBQUE7TUFBQSxDQUFBTCxnQkFBQSxFQUFBRSxpQkFBQSxFQUFBSixZQUFBLElBQUFqSSxVQUFBLFNBQUFrSSxlQUFBLG9CQUFBRSxnQkFBQSxvQ0FBWkksV0FBVyxFQUFBckksQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxJQUFBNkgsWUFBQSxRQUFBRSxnQkFBQTtJQUFBLE1BQUFELGVBQUEsR0FDckN6SSxRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFQyxNQUFNO01BQUVDLE9BQU8sRUFBRTtJQUFjLENBQUMsQ0FBQyxFQUFBNkgsZ0JBQUEsR0FHbEQzSSxRQUFRLENBQUM7TUFBRVksSUFBSSxFQUFFRyxNQUFNO01BQUVELE9BQU8sRUFBRTtJQUFFLENBQUMsQ0FBQztNQUFBLGFBQUFILENBQUE7SUFBQTtJQUFBLElBRjlCaUIsU0FBU0EsQ0FBQVgsQ0FBQTtNQUFBLE1BQUFOLENBQUEsR0FBQU0sQ0FBQTtJQUFBO0lBQUEsQ0FBQUMsQ0FBQSxHQUFBMEgsaUJBQUE7SUFBQSxJQUdUeEYsVUFBVUEsQ0FBQTtNQUFBLGFBQUFsQyxDQUFBO0lBQUE7SUFBQSxJQUFWa0MsVUFBVUEsQ0FBQW5DLENBQUE7TUFBQSxNQUFBQyxDQUFBLEdBQUFELENBQUE7SUFBQTtFQUNyQjtFQUVBZ0QsY0FBYyxDQUFDQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUyRSxhQUFhLENBQUM7RUFDaEU1RSxjQUFjLENBQUNDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRTZFLFdBQVcsQ0FBQztFQUM1RDlFLGNBQWMsQ0FBQ0MsTUFBTSxDQUFDLDJCQUEyQixFQUFFOEUsY0FBYyxDQUFDOztFQUVsRTtFQUNBO0VBQ0FuSixNQUFNLENBQUMsQ0FBQ29KLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDSCxXQUFXLEVBQUVJLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDLEVBQUUsaURBQWlELENBQUM7O0VBRXZHO0VBQ0F2SixNQUFNLENBQUNnSixhQUFhLENBQUNNLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDLEtBQUsxRSxTQUFTLEVBQUUsb0NBQW9DLENBQUM7RUFDMUY3RSxNQUFNLENBQUNtSixjQUFjLENBQUNHLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDLEtBQUsxRSxTQUFTLEVBQUUscUNBQXFDLENBQUM7O0VBRTVGO0VBQ0EsTUFBTTJFLElBQUksR0FBR2pGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLDBCQUEwQixDQUFDO0VBQy9ERCxRQUFRLENBQUNFLElBQUksQ0FBQ0MsTUFBTSxDQUFDOEUsSUFBSSxDQUFDO0VBRTFCeEosTUFBTSxDQUFDd0osSUFBSSxDQUFDUCxRQUFRLEtBQUssWUFBWSxFQUFFLG1CQUFtQixDQUFDO0VBQzNEakosTUFBTSxDQUFDd0osSUFBSSxDQUFDakcsVUFBVSxLQUFLLENBQUMsRUFBRSx1QkFBdUIsQ0FBQztFQUN0RHZELE1BQU0sQ0FBQ3dKLElBQUksQ0FBQ3pILFNBQVMsS0FBSzhDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQztFQUVsRSxNQUFNNEUsTUFBTSxHQUFHbEYsUUFBUSxDQUFDQyxhQUFhLENBQUMsd0JBQXdCLENBQUM7RUFDL0RELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUMrRSxNQUFNLENBQUM7RUFFNUJ6SixNQUFNLENBQUN5SixNQUFNLENBQUNSLFFBQVEsS0FBSyxZQUFZLEVBQUUsb0NBQW9DLENBQUM7RUFDOUVqSixNQUFNLENBQUN5SixNQUFNLENBQUNsRyxVQUFVLEtBQUssQ0FBQyxFQUFFLHNDQUFzQyxDQUFDO0VBQ3ZFdkQsTUFBTSxDQUFDeUosTUFBTSxDQUFDMUgsU0FBUyxLQUFLOEMsU0FBUyxFQUFFLDhCQUE4QixDQUFDO0VBRXRFLE1BQU1QLEtBQUssR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsMkJBQTJCLENBQUM7RUFDakVELFFBQVEsQ0FBQ0UsSUFBSSxDQUFDQyxNQUFNLENBQUNKLEtBQUssQ0FBQztFQUUzQnRFLE1BQU0sQ0FBQ3NFLEtBQUssQ0FBQzJFLFFBQVEsS0FBSyxZQUFZLEVBQUUsOENBQThDLENBQUM7RUFDdkZqSixNQUFNLENBQUNzRSxLQUFLLENBQUN2QyxTQUFTLEtBQUssYUFBYSxFQUFFLHFCQUFxQixDQUFDO0VBQ2hFL0IsTUFBTSxDQUFDc0UsS0FBSyxDQUFDZixVQUFVLEtBQUssQ0FBQyxFQUFFLDRCQUE0QixDQUFDOztFQUU1RDtFQUNBZSxLQUFLLENBQUMyRSxRQUFRLEdBQUcsVUFBVTtFQUMzQmpKLE1BQU0sQ0FBQ3lKLE1BQU0sQ0FBQ1IsUUFBUSxLQUFLLFlBQVksRUFBRSwyQ0FBMkMsQ0FBQztFQUNyRmpKLE1BQU0sQ0FBQ3dKLElBQUksQ0FBQ1AsUUFBUSxLQUFLLFlBQVksRUFBRSx5Q0FBeUMsQ0FBQztFQUVqRk8sSUFBSSxDQUFDN0UsTUFBTSxDQUFDLENBQUM7RUFDYjhFLE1BQU0sQ0FBQzlFLE1BQU0sQ0FBQyxDQUFDO0VBQ2ZMLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLENBQUM7QUFDaEIsQ0FBQyxDQUFDIiwiaWdub3JlTGlzdCI6W119