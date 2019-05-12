# The `x-element` spec

This describes the expected behavior of `x-element`.

## Mixin hierarchy

The `x-element` code is organized in a set of progressively-enhancing mixins
which are intended to be used in order. You can only omit mixins from the tail,
not from the middle/head. The intent is to force the correct base hooks so that
custom extension is supported.

### `element-mixin`

Provides base functionality for creating custom elements with shadow roots and
hooks to re-render the element.

### `properties-mixin`

Allows you to declare the `properties` block. This leverages the `element-mixin`
to observe and `invalidate` on property changes to cause a re-render. The
`properties` block allows you to declare the following via this mixin:

- `type` [Function]: type associated with the property.
- `value` [Function|Any]: _initial_ value for the property or getter.
- `readOnly` [Boolean]: prevent property updates via normal setter?

### `property-effects-mixin`

Enhances the interface to properties block to handle _property effects_. I.e.,
effects that can take place whenever a property updates. This adds the following
configuration to the properties block:

- `reflect` [Boolean]: reflect property to attribute?
- `observer` [String]: DSL used to resolve an observer callback
- `computed` [String]: DSL used to resolve computed callback and dependencies

### `listeners-mixin`

Provides a declarative `listeners` block which adds bound listeners on connect
and removes them on disconnect.

### `lit-html-mixin`

This mixin simply makes an opinion to use `lit-html` as the templating engine.

## Lifecycle

### Analysis

Analysis should take place once per class before first construction. This allows
all future instances to share common, class-level setup work.

### Setup

Setup should take place as soon as an instance is available during construction.
Setup binds a context to our analysis and may create a render root.

### Initialization

Initialization should take place on first connection. The element is considered
fully operational only after it's been initialized.

Initialization should work in the following order:

- handle element upgrade
- initialize properties
- compute properties
- render
- enable property effects
- reflect properties
- observe properties

### Update

When properties update on an initialized element, the following should occur:

- reflect property if needed
- observe property if needed
- compute dependent properties

## Properties

The properties block allows you to define the following:

- `type` [Function]: type associated with the property
- `value` [Funciton|Any Literal]: _initial_ value for the property or getter
- `readOnly` [Boolean]: prevent property updates via normal setter?
- `reflect` [Boolean]: reflect property to attribute?
- `observer` [String]: DSL used to resolve an observer callback
- `computed` [String]: DSL used to resolve computed callback and dependencies

## References

- [WHATWG Custom Elements Spec](https://html.spec.whatwg.org/multipage/custom-elements.html)


## Computed properties and graphs

Consider the following properties:

```
{
  a: { type: Boolean },
  b: { type: Boolean, computed: 'computeB(a)' },
  c: { type: Boolean, computed: 'computeC(a, b)' }
}
```

This properties block declares that `c` depends on `a` and `b` and that `b`
depends on `a`. However, the _order_ in which we resolve `b` and `c` when `a`
changes is important. In general, computed properties form a Directed, Acyclic
Graph (DAG). The DAG looks like this:

```
      a
   ↙     ↘
b     →     c
```

DAGs can be solved using a topological sorting algorithm and this computation
can be done at analysis-time to prevent repeating expensive work at runtime.

Note that DAGs can have multiple solutions. For completeness, the solution for
this DAG is `[a, b, c]`. This means that if `a` changes, you need to then update
`b` and then update `c`--in that order.
