import { assert, it } from '@netflix/x-test/x-test.js';
import { XElement, property, listener, html } from '../x-element-next.js';

// Test basic property inheritance
class ParentElement extends XElement {
  @property({ type: String, initial: 'parent-value' })
  accessor parentProp;

  @property({ type: Number, initial: 42 })
  accessor sharedProp;

  static template(host) {
    return html`<div>${host.parentProp}-${host.sharedProp}</div>`;
  }
}

class ChildElement extends ParentElement {
  @property({ type: String, initial: 'child-value' })
  accessor childProp;

  // Override parent property with different configuration
  @property({ type: Number, initial: 100 })
  accessor sharedProp;

  static template(host) {
    return html`<div>${host.parentProp}-${host.childProp}-${host.sharedProp}</div>`;
  }
}

// Test listener inheritance
class ParentWithListener extends XElement {
  @property({ type: Number, initial: 0 })
  accessor parentClicks;

  @listener('parent-event')
  static onParentEvent(host) {
    host.parentClicks++;
  }

  static template(host) {
    return html`<div>parent: ${host.parentClicks}</div>`;
  }
}

class ChildWithListener extends ParentWithListener {
  @property({ type: Number, initial: 0 })
  accessor childClicks;

  @listener('child-event')
  static onChildEvent(host) {
    host.childClicks++;
  }

  static template(host) {
    return html`<div>parent: ${host.parentClicks}, child: ${host.childClicks}</div>`;
  }
}

// Test multi-level inheritance
class GrandparentLevel extends XElement {
  @property({ type: String, initial: 'grandparent' })
  accessor level;

  @property({ type: Number, initial: 1 })
  accessor generation;
}

class ParentLevel extends GrandparentLevel {
  @property({ type: String, initial: 'parent' })
  accessor level;

  @property({ type: Number, initial: 2 })
  accessor generation;
}

class ChildLevel extends ParentLevel {
  @property({ type: String, initial: 'child' })
  accessor level;

  @property({ type: Number, initial: 3 })
  accessor generation;
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
  child.shadowRoot.dispatchEvent(new CustomEvent('parent-event', { bubbles: true }));
  assert(child.parentClicks === 1, 'parent listener works in child');

  child.shadowRoot.dispatchEvent(new CustomEvent('child-event', { bubbles: true }));
  assert(child.childClicks === 1, 'child listener works');

  child.remove();
});

it('parent listeners remain independent', () => {
  const parent = document.createElement('test-parent-with-listener');
  document.body.append(parent);

  // Events must be dispatched from within shadow root since listeners attach there
  parent.shadowRoot.dispatchEvent(new CustomEvent('parent-event', { bubbles: true }));
  assert(parent.parentClicks === 1, 'parent listener works');

  // Parent should not respond to child-only events
  parent.shadowRoot.dispatchEvent(new CustomEvent('child-event', { bubbles: true }));
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
  // Define new parent and child classes inline to ensure fresh analysis
  class OutOfOrderParent extends XElement {
    @property({ type: String, initial: 'parent-ooo' })
    accessor parentValue;

    @property({ type: Number, initial: 10 })
    accessor sharedValue;
  }

  class OutOfOrderChild extends OutOfOrderParent {
    @property({ type: String, initial: 'child-ooo' })
    accessor childValue;

    @property({ type: Number, initial: 20 })
    accessor sharedValue;
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
  // Parent and child each have different methods listening to same event type
  class ParentMultiListener extends XElement {
    @property({ type: Number, initial: 0 })
    accessor parentCount;

    @listener('shared-event')
    static onParentShared(host) {
      host.parentCount++;
    }

    static template(host) {
      return html`<div>parent: ${host.parentCount}</div>`;
    }
  }

  class ChildMultiListener extends ParentMultiListener {
    @property({ type: Number, initial: 0 })
    accessor childCount;

    @listener('shared-event')
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
  child.shadowRoot.dispatchEvent(new CustomEvent('shared-event', { bubbles: true }));

  assert(child.parentCount === 1, 'parent listener fired');
  assert(child.childCount === 1, 'child listener fired');

  // Fire again - both should increment
  child.shadowRoot.dispatchEvent(new CustomEvent('shared-event', { bubbles: true }));

  assert(child.parentCount === 2, 'parent listener fired again');
  assert(child.childCount === 2, 'child listener fired again');

  // Verify parent instance only has parent listener
  const parent = document.createElement('test-parent-multi');
  document.body.append(parent);

  parent.shadowRoot.dispatchEvent(new CustomEvent('shared-event', { bubbles: true }));

  assert(parent.parentCount === 1, 'parent listener works on parent instance');
  assert(parent.childCount === undefined, 'parent instance has no child listener');

  child.remove();
  parent.remove();
});

it('child overrides parent listener with same method name', () => {
  // When child redefines a method with the same name, only child's listener fires
  class ParentWithMethod extends XElement {
    @property({ type: Number, initial: 0 })
    accessor parentClicks;

    @listener('click')
    static onClick(host) {
      host.parentClicks++;
    }

    static template(host) {
      return html`<div>parent: ${host.parentClicks}</div>`;
    }
  }

  class ChildOverridesMethod extends ParentWithMethod {
    @property({ type: Number, initial: 0 })
    accessor childClicks;

    @listener('click')
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
  child.shadowRoot.dispatchEvent(new CustomEvent('click', { bubbles: true }));

  assert(child.parentClicks === 0, 'parent listener did not fire (overridden by child)');
  assert(child.childClicks === 1, 'child listener fired');

  // Verify parent instance uses parent's onClick
  const parent = document.createElement('test-parent-with-method');
  document.body.append(parent);

  parent.shadowRoot.dispatchEvent(new CustomEvent('click', { bubbles: true }));

  assert(parent.parentClicks === 1, 'parent listener works on parent instance');
  assert(parent.childClicks === undefined, 'parent instance has no child property');

  child.remove();
  parent.remove();
});

it('plain class without decorators (missing metadata link) works correctly', () => {
  // Test that a class without decorators in the middle of the inheritance chain
  // works correctly and doesn't have Symbol.metadata polluted onto it

  class DecoratedBase extends XElement {
    @property({ type: String, initial: 'base-value' })
    accessor baseProp;

    @property({ type: Number, initial: 1 })
    accessor generation;
  }

  // Plain class with NO decorators - this is the "missing link"
  class PlainMiddle extends DecoratedBase {
    // No decorators! Just plain class extending decorated base
  }

  class DecoratedChild extends PlainMiddle {
    @property({ type: String, initial: 'child-value' })
    accessor childProp;

    @property({ type: Number, initial: 3 })
    accessor generation;
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
