# Decorator-Based XElement Architecture

## Overview

This document describes the decorator-based API for `x-element` using TC39
Stage 3+ decorators. The implementation is **complete and shipping** - users
can adopt it today with TypeScript 5.0+ or Babel transpilation, and the same
code will work natively when decorators reach Stage 4.

```javascript
import { XElement, property, listener, html } from '@netflix/x-element';

class HelloWorldElement extends XElement {
  @property({ type: String, default: 'World' })
  accessor name;

  @property({ type: Number, initial: 0 })
  accessor #count;

  @listener('click')
  static #onClick(host) {
    host.#count++;
  }

  static template(host) {
    return html`<button>Hello, ${host.name}! Count: ${host.#count}</button>`;
  }
}

customElements.define('hello-world', HelloWorldElement);
```

## Key Benefits

✅ **Idiomatic JavaScript** - Leverages native language features instead of framework-specific patterns
✅ **True privacy** - Private accessors with `#` syntax, native JavaScript encapsulation
✅ **Better IntelliSense** - Decorators analyzed by IDEs, properties visible on prototype
✅ **No invented proxies** - Removes `this.properties` proxy and `this.internal` proxy concepts entirely
✅ **Simpler mental model** - Properties on prototype, callbacks stay static (like current API)
✅ **Simpler configuration** - All config options are simple, single words (removed `readOnly`)
✅ **No breaking changes** - Classic API supported through 2.x
✅ **Future-proof** - Ready for Stage 4 decorators

## Key Concepts

- **Constructor** - The class itself (e.g., `MyElement`), where static methods live
- **Prototype** - Where instance members are defined (`MyElement.prototype`)
- **Host** - The actual instance at runtime, passed to callbacks as first parameter
- **Shadow Root** - Shadow DOM render target (bi-directional with host)

## Core Design Decisions

1.  Properties use auto-accessor syntax: `@property() accessor foo;`
2.  Properties live on prototype for IntelliSense and type checking
3.  Private properties use native `#` syntax: `@property() accessor #internal;`
4.  Initial values via config (`initial`), not accessor initializers
5.  No `readOnly` config - use identity transform: `compute: (v) => v`
6.  Callbacks remain static method references (like classic API)
7.  Arrow function wrappers to avoid TDZ: `(a, b) => MyElement.#method(a, b)`
8.  Private static methods by convention (clean public API)
9.  Input arrays use strings: `input: ['firstName', 'lastName']`
10. Listener signature: `@listener(type, options?)`
11. Template signature: `static template(host)` with imported `html`
12. Two-file structure: `x-element-next.js` (modern) + `x-element.js` (classic + re-exports)
13. No API mixing - use all-classic or all-modern in inheritance chain
14. Ships today via TypeScript / Babel, native when decorators reach Stage 4

## Shipping Before Stage 4

**Key insight:** The decorator API infrastructure can be shipped TODAY, even
before decorators reach Stage 4.

### Why This Works

The modern `XElement` class and decorator functions (`property()`, `listener()`)
are **just regular JavaScript**:

```javascript
// x-element.js - Valid JavaScript today! ✅
const decoratorProperties = new WeakMap();

export function property(config) {
  return function(target, context) {  // Just a function returning a function
    decoratorProperties.set(target, config);
    return { /* accessor descriptor */ };
  };
}

export class XElement extends HTMLElement {
  constructor() {
    super();
    // Read from WeakMaps - regular JavaScript code
    const props = decoratorProperties.get(this.constructor.prototype);
    // ... analyze and initialize
  }
}
```

**Only USER CODE requires decorator support:**

```javascript
// user-code.js - Requires decorator transpilation ❌
import { XElement, property } from './x-element.js';

class MyElement extends XElement {
  @property({ type: String })  // ← Decorator syntax (needs transpilation)
  accessor foo;                // ← Auto-accessor (needs transpilation)
}
```

### Practical Impact

✅ **Ship immediately** - No need to wait for Stage 4
✅ **Users adopt now** - With TypeScript 5.0+ or Babel transpilation
✅ **Gather feedback** - Real-world usage informs the API
✅ **Native support ready** - When Stage 4 ships, existing code _just works_
✅ **No breaking changes** - Same code works with transpilation AND natively

## Version Isolation

**Design principle:** We trust developers to use a single x-element version
correctly throughout their application and avoid mixing different versions in
the same inheritance chain.

### No Enforcement

Version isolation is **not enforced** by x-element. Detecting and preventing
version mixing across an inheritance chain would require:

1. Injecting version markers into prototypes
2. Walking the prototype chain during element construction
3. Comparing version identifiers at runtime
4. Handling edge cases like bundler deduplication, npm peer dependencies,
   and monorepo scenarios

This complexity was deemed **not worth the effort** given:

- Module resolution naturally prevents most version mixing scenarios
- Expert developers understand dependency management
- Any issues that do arise surface as standard JS errors that can be debugged
- The performance cost of runtime checks is undesirable

### Best Practices

**Avoid version mixing:**
```javascript
// ✅ GOOD - Single version throughout
import { XElement, property } from 'x-element.js';

class Base extends XElement {
  @property({ type: String })
  accessor name;
}

class Derived extends Base {
  @property({ type: Number })
  accessor age;
}
```

```javascript
// ❌ BAD - Mixing versions (not enforced, but will cause issues)
import { XElement as XElement1 } from 'x-element@1.0.0';
import { XElement as XElement2 } from 'x-element@2.0.0';

class Base extends XElement1 { /* ... */ }
class Derived extends Base { /* ... */ }  // Mixed versions in chain
```

### API Style Consistency

Similarly, mixing classic and modern APIs in the same inheritance chain is
**not recommended** but **not enforced**:

```javascript
// ❌ NOT RECOMMENDED - Mixing API styles
import XElement from 'x-element.js';           // Classic
import { property } from 'x-element.js';       // Modern

class Base extends XElement {
  static get properties() {
    return { name: { type: String } };  // Classic API
  }
}

class Derived extends Base {
  @property({ type: Number })          // Modern API
  accessor age;
}
```

Each API style has its own internal metadata system. Mixing them may cause
confusing failures like properties not being defined or observers not running.
We trust developers to maintain consistency within an inheritance chain.

## Template Signature Change (Proposed)

**Proposed Change:** Update the template signature to import `html` instead of
receiving it as a parameter. The current `main` branch still passes `html` as
the first argument to `template(html)`, but the decorator-based API will use
imported `html` and a simplified `template(host)` signature.

### New Signature (Modern)

```javascript
import { XElement, property, html } from './x-element.js';

class MyElement extends XElement {
  @property({ type: String })
  accessor name;

  static template(host) {
    return html`<h1>Hello ${host.name}!</h1>`;
  }
}
```

This direct approach:
- Import `html` from x-element
- Framework passes only `host` to `template()`
- Returns template result immediately (no currying)
- Direct property access via `host.name`
- Consistent with observers and listeners

### Why `template(host)` with Imported `html`?

Since x-element will restrict to its own template engine, we can import `html`
directly and simplify the template signature to just `template(host)`.

**Alternative considered: `template(host, html)`**
- Would thread `html` as parameter
- **Rejected:** Since we're restricting to x-element's template engine, no need
  to pass `html` as parameter
- **Rejected:** Importing `html` is cleaner and more consistent with other
  decorator libraries

**Why `template(host)` with imported `html` wins:**
- ✅ **Simplest signature** - Just one parameter
- ✅ **No threading** - Import `html` once, use anywhere
- ✅ **Consistency** - Matches patterns from other decorator libraries
- ✅ **Clean imports** - `import { XElement, property, listener, html }`

**Caching:** For expensive setup, use static class fields instead of the curried pattern:
```javascript
static #dateFormatter = new Intl.DateTimeFormat('en-US');
static template(host) {
  return html`<div>${this.#dateFormatter.format(host.date)}</div>`;
}
```

## Naming Convention: Private Callbacks

**Convention:** All compute, observe, and listener callbacks should be
**private static methods** using `#` syntax. This keeps the public API surface
clean—only properties should be public.

- **Compute methods:** `static #computeFoo()`
- **Observers:** `static #observeFoo()`
- **Listeners:** `static #onClick()`

The public API surface should consist **only of properties**. Callbacks are
implementation details.

## Read-Only Properties Pattern

To create a public read-only property with private write access, use a private property with a public computed property that applies an identity transform:

```javascript
class MyElement extends XElement {
  // Private writable property
  @property({ type: String })
  accessor #value;

  // Public read-only via identity transform
  @property({
    type: String,
    input: ['#value'],
    compute: (value) => value,  // Pass through unchanged
  })
  accessor value;

  @listener('click')
  static #onClick(host, event) {
    host.#value = 'new';        // ✅ Write to private
    console.log(host.value);    // ✅ Read from public computed
  }
}
```

**How it works:**
- Private property (`#value`) is both readable and writable internally
- Public property (`value`) is computed from private property
- Identity transform `(value) => value` simply passes the value through
- Public property automatically updates when private property changes
- Attempting to set public property throws (computed properties are read-only)
- Read from either `host.#value` or `host.value` - choose based on context

**Benefits:**
- ✅ Uses existing computed property system - no special concepts
- ✅ Explicit and clear - obvious it's a computed value
- ✅ Full property system integration (observers, dependencies work)
- ✅ Simple - just two regular property declarations

## Method References: Arrow Function Wrappers

To reference private static methods, use arrow function wrappers to avoid
Temporal Dead Zone (TDZ) errors:

```javascript
class MyElement extends XElement {
  @property({
    input: ['first', 'last'],
    compute: (first, last) => MyElement.#computeFull(first, last),
  })
  accessor full;

  @property({
    type: String,
    observe: (host, value) => MyElement.#observeValue(host, value),
  })
  accessor value;

  // Private static methods (implementation details, not public API)
  static #computeFull(first, last) {
    return `${first} ${last}`;
  }

  static #observeValue(host, value) {
    console.log('changed', value);
  }
}
```

This gives us:
- ✅ Type-safe references (no strings!)
- ✅ IntelliSense support
- ✅ Refactor-safe
- ✅ No resolver functions needed
- ✅ Private static methods: `MyElement.#privateMethod`

### Temporal Dead Zone (TDZ) Workaround

**Note:** A potential ergonomic fix for this issue is being discussed at
[tc39/proposal-decorators#567](https://github.com/tc39/proposal-decorators/issues/567).

**Important:** Directly referencing the class name in decorators **will cause
TDZ errors** because decorators run during class construction, before the class
name binding is fully initialized.

**The solution: Wrap callbacks in arrow functions** to defer evaluation:

```javascript
class MyElement extends XElement {
  @property({ type: String })
  accessor first;

  @property({ type: String })
  accessor last;

  // ❌ WILL cause TDZ error (class reference evaluated immediately during
  // decoration)
  @property({
    input: ['first', 'last'],
    compute: MyElement.#computeFull,  // ReferenceError: Cannot access
                                      // 'MyElement' before initialization
  })
  accessor full;

  // ✅ Works - arrow function defers class reference until compute is called
  @property({
    input: ['first', 'last'],
    compute: (first, last) => MyElement.#computeFull(first, last),
  })
  accessor full;

  static #computeFull(first, last) {
    return `${first} ${last}`;
  }
}
```

**Why this works:**
- Arrow function **body** is not evaluated until the function is called
- By the time x-element calls the compute function, class construction is
  complete
- The class name binding is fully initialized

**When to use this pattern:**
- ✅ Always safe to use for `compute` and `observe` callbacks
- ✅ Prevents TDZ errors across all environments
- ✅ Allows parameter flexibility - pass only what the method needs

### Inline Arrow Functions for Simple Callbacks

**For trivial compute or observe logic, use inline arrow functions:**

```javascript
class MyElement extends XElement {
  @property({ type: String })
  accessor firstName;

  @property({ type: String })
  accessor lastName;

  // Inline arrow function for simple compute
  @property({
    input: ['firstName', 'lastName'],
    compute: (first, last) => `${first} ${last}`,  // ✅ Inline!
  })
  accessor fullName;

  // Inline arrow function for simple observe
  @property({
    type: Number,
    observe: (host, value) => console.log('count:', value),  // ✅ Inline!
  })
  accessor count;

  // Inline for simple derived value
  @property({
    input: ['count'],
    compute: (count) => count * 2,  // ✅ Inline!
  })
  accessor doubled;
}
```

**When to use inline vs static methods:**

**Use inline arrow functions when:**
- ✅ Logic is trivial (one line)
- ✅ No reuse needed
- ✅ Compute is a simple expression
- ✅ Observer just logs or sets simple value

**Use private static methods when:**
- ✅ Logic is non-trivial (multiple lines)
- ✅ Method might be reused
- ✅ Needs testing separately
- ✅ Complex business logic

**Example mixing both:**

```javascript
class MyElement extends XElement {
  @property({
    input: ['firstName', 'lastName'],
    compute: (first, last) => `${first} ${last}`,  // Simple - inline
  })
  accessor fullName;

  @property({
    type: String,
    // Complex - static method
    observe: (host, value) => MyElement.#observeName(host, value),
  })
  accessor name;

  static #observeName(host, value) {
    // Complex logic with multiple statements
    host.#updateCache(value);
    host.#notifyListeners(value);
    host.#logAnalytics('name_changed', { value });
  }
}
```

## Private Fields in Static Methods

**Key insight:** Static methods can access private instance fields when passed
an instance as a parameter, because private fields are scoped to the class
lexical scope:

```javascript
class MyElement extends XElement {
  @property({ type: String })
  accessor #token;

  @listener('click')
  static #onClick(host, event) {
    host.#token = 'updated';  // ✅ Static method accesses private field via host
  }
}
```

JavaScript enforces type safety - passing the wrong instance type throws a
TypeError.

## DevTools Debugging: Private Field Introspection

**Critical insight:** Chrome DevTools intentionally allows accessing and
modifying private fields in the console, making the private accessor pattern
practical for real development.

```javascript
class MyElement extends XElement {
  @property({ type: String })
  accessor #token;

  @property({ type: Number, initial: 0 })
  accessor #count;

  @property({
    type: String,
    input: ['#token'],
    compute: (token) => `public-${token}`,
  })
  accessor publicValue;
}
```

**In the DevTools console:**
```javascript
// Select element in Elements panel, then in Console:
$0.#token                    // ✅ Read private field
$0.#token = 'debug-value'    // ✅ Write private field
$0.#count                    // ✅ Inspect private state
$0.#count = 999              // ✅ Modify for testing
```

**Why this matters:**

Without DevTools introspection, private accessors would create a debugging
nightmare - you couldn't inspect or modify internal state during development.
Chrome's intentional design choice to allow console access to private fields
makes this pattern practical:

- ✅ True encapsulation in production code (private is enforced)
- ✅ Full debugging capability in DevTools (can inspect/modify private state)
- ✅ No special "debug mode" or framework code needed
- ✅ Test edge cases by manipulating private state during development
- ✅ Natural debugging workflow - select element, inspect state, modify values

**This design wouldn't be viable without DevTools support.** The ability to
introspect private fields is what enables using native JavaScript privacy
features while maintaining an excellent developer experience.

## Initial Values via Config

All initial values must be specified in the `@property()` config, not as
accessor initializers.

```javascript
class MyElement extends XElement {
  // Scalar initial values
  @property({ type: Number, initial: 0 })
  accessor count;

  @property({ type: String, initial: 'default' })
  accessor name;

  @property({ type: Boolean, initial: false })
  accessor active;

  // Arrays/Objects - MUST use function (to avoid shared references)
  @property({ type: Array, initial: () => [] })
  accessor items;

  @property({ type: Object, initial: () => ({ foo: 'bar' }) })
  accessor data;

  // ❌ INVALID - accessor initializers throw error
  @property({ type: Number })
  accessor bad = 0;  // ❌ Throws: use initial config instead
}
```

**Why functions for non-scalars?**
- Scalars (Number, String, Boolean) are copied by value - safe to share
- Arrays/Objects are referenced - would be shared across all instances!
- Functions are called per-instance to create new values

**Validation:** The decorator's `init()` function throws if any initializer is
provided:
```javascript
init(initialValue) {
  if (initialValue !== undefined) {
    throw new Error(
      `Property "${context.name}" should not have an initializer. ` +
      `Use initial config option instead: @property({ initial: ... })`
    );
  }
  return undefined;
}
```

**Benefits:**
- ✅ All configuration in one place
- ✅ Consistent with current x-element behavior
- ✅ TypeScript types properly express `initial?: T | (() => T)`
- ✅ Clear distinction between `initial` and `default`

**`initial` vs `default`:**
- `initial` - Applied once during element initialization (if value is
  nullish)
- `default` - Fallback value when property is set to `undefined` at runtime
```javascript
@property({ type: String, initial: 'initial', default: 'fallback' })
accessor name;
```

## Input Arrays: Why Not Callbacks?

**Design decision:** Use string arrays (`input: ['firstName', 'lastName']`)
rather than callbacks (`input: (host) => [host.firstName, host.lastName]`).

A callback approach might provide better IntelliSense (live references to
properties), but was rejected for several reasons:

**1. Callback interface feels wrong for declarative config:**
```javascript
// ❌ Callback feels imperative, not declarative
@property({
  input: (host) => [host.firstName, host.lastName],
  compute: (first, last) => `${first} ${last}`,
})
accessor fullName;

// ✅ String array is clearly declarative
@property({
  input: ['firstName', 'lastName'],
  compute: (first, last) => `${first} ${last}`,
})
accessor fullName;
```

**2. Dangerous surface area during analysis:**

The callback provides tempting-but-dangerous access to `host` during class
definition:

```javascript
// ❌ What if developers do this?
@property({
  input: (host) => {
    host.someMethod();           // Called during analysis? 😱
    console.log(host.otherProp); // Side effects during analysis? 😱
    return [host.firstName];
  },
  compute: (first) => `${first}`,
})
accessor fullName;
```

This creates confusion about when the callback executes and encourages misuse.

**3. Forces analysis timing to first construction:**

Callback needs a `host` instance, forcing analysis to defer until first
construction (when an instance exists). We may do this anyway, but this design
would force our hand and eliminate analysis-at-definition as an option.

**4. Requires overly clever initializer tricks:**

To make IntelliSense work, we'd need to:
- Store a special symbol as the accessor initializer
- Detect this symbol during decorator execution
- This would force us to never accept user initializers, reducing flexibility

```javascript
// Theoretical implementation would require:
@property({
  input: (host) => [host.firstName],
  compute: (first) => first,
})
accessor fullName = SPECIAL_INTERNALLY_BOUND_SYMBOL; // ← Overly clever

// And forever prevent this:
accessor fullName = 'default'; // ❌ Would conflict with symbol detection
```

**Conclusion:** String arrays are simpler, more declarative, and don't constrain
future implementation choices. The loss of IntelliSense for property names is
acceptable given the philosophy of treating developers as experts who can
reference their own property names.

## Inheritance and Decorators

**Derived classes automatically inherit properties and their callbacks.** Base's
static methods can access Base's private fields on derived instances.

**Key rules:**
- Private callbacks (`#method`) cannot be overridden - use for final components
- Public callbacks (`method`) can be overridden with `super` - use for extensible base classes
- Derived classes cannot access Base's private fields (true encapsulation)
- Use public extension points with private implementation (mixed pattern) for best of both worlds

## Complete API Example

```javascript
import { XElement, property, listener, html } from './x-element.js';

class MyElement extends XElement {
  // Public properties (on prototype) - the only public API surface
  @property({ type: String, reflect: true })
  accessor first;

  @property({ type: String })
  accessor last;

  @property({ type: Number, initial: 0 })
  accessor count;

  // Read-only property pattern (private + public computed)
  @property({ type: String })
  accessor #status;

  @property({
    type: String,
    input: ['#status'],
    compute: (status) => status,  // Identity transform
  })
  accessor status;

  @property({
    input: ['first', 'last'],
    // ✅ Private implementation!
    compute: (first, last) => MyElement.#computeFull(first, last),
  })
  accessor full;

  @property({
    type: String,
    // ✅ Private implementation!
    observe: (host, value) => MyElement.#observeValue(host, value),
  })
  accessor value;

  // Private/internal property (on prototype)
  @property({ type: String, initial: 'secret' })
  accessor #internalState;

  // Private static compute method (NO host parameter - pure function)
  static #computeFull(first, last) {
    return `${first} ${last}`;
  }

  // Private static observer method (HAS host parameter)
  static #observeValue(host, value) {
    console.log(`Value changed to: ${value}`);
    host.#internalState = `value-is-${value}`;
  }

  // Private event listeners (HAS host parameter)
  @listener('click')
  static #onClick(host, event) {
    host.count++;
    host.#status = `Clicked ${host.count} times`;  // Write to private
    console.log(host.status);  // Read from public computed
  }

  @listener('keydown', { capture: true })
  static #onKeydown(host, event) {
    console.log('key:', event.key);
  }

  // Template with imported html
  static template(host) {
    return html`
      <h1>Hello ${host.full}!</h1>
      <button>Clicks: ${host.count}</button>
    `;
  }
}
```

**Convention: Use private static methods for all callbacks**
- Compute methods: `static #computeFoo()`
- Observers: `static #observeFoo()`
- Listeners: `static #onClick()`
- Only public properties should be on the public API surface

## Callback Signature Summary

| Callback Type | Signature                                    | Reason                               |
|---------------|----------------------------------------------|--------------------------------------|
| **Compute**   | `static #computeFoo(...inputs)`              | Pure function, memoized, NO host     |
| **Observe**   | `static #observeFoo(host, value, oldValue)`  | Needs host to interact with element  |
| **Listener**  | `static #onClick(host, event)`               | Needs host to interact with element  |

**Note:** All callbacks should be private static methods. They are
implementation details, not public API.

## Multiple Listeners

With decorators, you can attach multiple `@listener()` decorators for the same
event type, each with its own method - enabling separation of concerns.
Execution order is top-to-bottom.
