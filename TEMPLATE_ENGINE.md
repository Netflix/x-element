# Template Engine

## Concepts

The goal of `XElement` is to make it easier for developers to author Custom
Elements. A key part of that functionality is enabling a declarative way to turn
attributes and properties into DOM — that’s the role of the “template engine”.

So, a `template` function like this is using the `html` method from a
“template engine” to create a “template result” — which will be “rendered” into
some “container” (either the “host” element or the host’s “shadow root”).

```js
class FooBar extends XElement {
  static get properties() {
    return {
      foo: { type: String },
      bar: { type: String },
      baz: { type: String },
    };
  }
  static template(html) {
    return ({ foo, bar, baz }) => {
      return html`
        <div id="foo-bar" .foo="${foo}" bar="${bar}">
          ${baz}
        </div>
      `;
    };
  }
}
customElements.define('foo-bar', FooBar);
```

On the surface, when a property like `bar` changes in  the element, this inner
function is invoked and _the_ `#foo-bar` node’s “bar” attribute is updated. No
DOM nodes are created / destroyed and prior state is preserved — only changes in
values cause DOM manipulation.

## By Example

It’s helpful to understand _how_ exactly returning an interpolated html string
results in performant DOM manipulation. Using the `template` function example
from above, we will detail the following steps:

1. Fill in the interpolated html string (container-independent).
2. Create general template element & directions (container-independent).
3. Create specific template element & directions (container-specific).
4. Apply an update (update-specific).

### Step 1 — Fill in the interpolated html string.

The first time `template` is called in our `FooBar` class, the inner-`html`
expression will be seen by the browser for the _first time_, so we need to _read
between the lines_ so-to-speak. Here’s what the `strings` argument will be from
the perspective of `html`:

```js
[
  '\n      <div id="foo-bar" .foo="',    // 0
  '" bar="',                             // 1
  '">\n      </div>\n    ',              // 2
]
```

Obviously, that’s not valid HTML, so we need to fill in the blanks. Rather than
concatenate — we have to leave ourself “breadcrumbs” to follow later. We end up
with a string as follows:

```html
      <div id="foo-bar" x-element-property-0="foo" x-element-attribute-1="bar">
        <!--x-element-content-2-->
      </div>
```

### Step 2 — Create general template element & directions.

Now that we have a valid HTML string, we can instantiate a element which can
serve as the base for _all future instances_. This element’s content ultimately
gets rendered into some container node and then updated as the interpolated
values change.

I.e., we create an element by just setting it’s `innerHTML`:

```html
<div id="foo-bar" x-element-property-0="foo" x-element-attribute-1="bar">
  <!--x-element-content-2-->
</div>
```

And, now that we have breadcrumbs, we split that into a clean template element
and a set of “directions” to apply values.

```html
<div id="foo-bar"><!----><!----></div>
```

… and …

```js
[
  { path: [], key: '0', type: 'property', name: 'foo' },
  { path: [], key: '1', type: 'attribute', name: 'bar' },
  { path: [1], key: '2', type: 'content' },
]
```

### Step 3 — Create specific template element & directions.

Once we have a container to actually dump content into, we can add actual
pointers to our initial directions so that we don’t need to “find” our target
nodes every time an update is applied.

```js
[
  { path: [], key: '0', type: 'property', name: 'foo', node: <ref> },
  { path: [], key: '1', type: 'attribute', name: 'bar', node: <ref> },
  { path: [1], key: '2', type: 'content', startNode: <ref>, node: <ref> },
]
```

### Step 4 — Apply an update.

Finally, whenever a new set of “values” are interpolated into our html
“strings”, we can quickly use our update “directions” to surgically manipulate
the DOM nodes referenced therein.
