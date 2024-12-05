# Performance

First off… performance isn’t everything! We aim to be _meaningfully_ performant.
I.e., it’s not super meaningful to be 1% faster than an alternative, nor is it
meaningful to shave off a microsecond of time if integration code is expected
to take milliseconds of time.

## Testing performance

### Measurement

The [`performance.now()`][performance.now] method has resolution down to 5 µs
when cross-origin isolated and down to 100 µs otherwise. For simplicity, we
assume that we _do not_ have a cross-origin isolated window. To enable us to
measure timings below this resolution — we batch up tests and measure them
in aggregate.

To combat against tests competing for resources — we run each test in an iframe
so that any resource backups from one test can be cleaned up ahead of loading
the next iframe `src`.

To combat against individual runs of test getting in the way of garbage
collection — each batch of tests is sized to run in ~12 ms. This is roughly 3/4
of an animation frame on a standard 60 Hz screen. This is meant to give the
browser a chance to do some normal cleanup as it would be an atypical
environment to be maxing out / dropping frames. Note that this batching is why
all the tests take roughly the same amount of time to run in your browser.

The individual numbers in the tests are not super meaningful — those can differ
based on the number of tabs you have open, the browser you’re using, whether
your devtools are open, etc. The goal here is to show the _relative_ performance
of a handful of engines within any particular context.

### Visualization

Each dot represents a percentile of the underlying data. The median (p50) is
highlighted in the chart and printed next to the related engine’s name. The
first and last few percentiles are omitted to reduce jumpiness in the charts
from run-to-run. You should take note of both the value of the median and the
overall _spread_ of the shown percentiles.

### Terminology

**Values** — One goal of a template language is to let you author static markup
which is _interpolated_ by dynamic _values_. In jsx that looks something like
`(<div>Hello {name}</div>)` (note that this is _not_ valid js). Or via tagged
template functions you would write `` html`<div>Hello ${name}</div>` `` (this
_is_ valid js). Conceptually, there are static _strings_ which are interpolated
by dynamic, to-be-determined _values_. E.g., `['<div>Hello ', '</div>']` are
the _strings_ in the latter example and some _value_ (`name`) is meant to be
dynamically evaluated and used to update the result.

**Binding** — The process of associating a dynamic, interpolated value with some
well-known action to update dom is called a _binding_. Interpolated values can
be bound to attributes, properties, and content. They can have differing
behaviors, but they all follow the general form _if this value changes,
manipulate the dom by doing xyz_.

**Interpretation** — This refers to the act of taking some developer-authored
string and interpreting that as dom. For Reach, this means a build-time step to
turn jsx into functionally equivalent calls to `React.createElement`. For
`µhtml`, `lit-html`, and the default `x-template` — this is about turning an
interpolated string literal into a `DocumentFragment`. See note on testing. †

**Initialization** — Given some interpretation, the _first_ time we attempt to
render is special. In addition to making sure the value bindings are all
ready… we also need to setup our container to make future _updates_ more
performant.

**Update** — When a container is already initialized and we _only_ need to
execute some value bindings, we call that an _update_. This is typically the
fastest bit of code in any template engine.

† Note that it’s generally not possible to isolate “interpretation” from
“initialization”. This is because the interpretation is typically cached and 
only performed as-needed _just before_ initialization. This is why you will see
the tests reporting something like “Interpretation & Initialization”. Also note
that because React performs this interpretation as part of a compilation step
(i.e., compiling jsx into function calls) — it doesn’t make sense to try and
measure this.

[performance.now]: https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
