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
- `value` [Function|Any Literal]: _initial_ value for the property or getter.
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

Analysis should take place once per class on first construction. This allows all
future instances to share common setup work. The result of the analysis phase is
made available again during initialization.

Note: work to truly cache analysis work per-class is ongoing. Right now, this
happens per instance.

### Initialization

Initialization should take place once per instance on first connection. This
allows each class to leverage cached information in the analysis phase and
leverage initialization work through disconnection and reconnection to the DOM.
Initialization should work in the following order:

- handle post-definition upgrade scenario
- initialize render root
- initialize property values
- compute properties
- render
- enable property effects
- reflect properties
- observe properties

### Update

When properties update on an initialized element, the following should occur:

- reflect property if needed
- observe property if needed
- compute dependent properties if needed, causes subsequent property changes

## Properties

The properties block allows you to define the following:

- `type` [Function]: type associated with the property
- `value` [Function|Any Literal]: _initial_ value for the property or getter
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
