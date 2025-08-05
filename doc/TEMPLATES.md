# Templates & DOM

Because `x-element` has zero dependencies, it ships with an integrated template
engine which is invoked when you use the `html` tagged template function.
Developers can choose alternatives according to their preference, e.g.
`lit-html`, `ReactDOM`, etc.

Add a static template function in your `x-element` definition in order to
leverage automagical DOM generation and data binding:

```javascript
static template(html) {
  return ({ options, selectedId }) => {
    return html`
      <select name="my-options">
        ${options.map(option => [
          option.id,
          html`<option value="${option.value}" ?selected="${option.id === selectedId}">`,
        ])}
      </select>
    `;
  };
}
```

The following bindings are supported:

| Binding             | Template                     | Emulates                                                      |
| :------------------ | :--------------------------- | :------------------------------------------------------------ |
| --                  | --                           | `const el = document.createElement('div');`                   |
| attribute           | `<div foo="${bar}"></div>`   | `el.setAttribute('foo', bar);`                                |
| attribute (boolean) | `<div ?foo="${bar}"></div>`  | `el.setAttribute('foo', ''); // if  “bar” is truthy`          |
| --                  | --                           | `el.removeAttribute('foo'); // if  “bar” is falsy`            |
| attribute (defined) | `<div ??foo="${bar}"></div>` | `el.setAttribute('foo', bar); // if  “bar” is non-nullish`    |
| --                  | --                           | `el.removeAttribute('foo'); // if  “bar” is nullish`          |
| property            | `<div .foo="${bar}"></div>`  | `el.foo = bar;`                                               |
| content             | `<div>${foo}</div>`          | `el.append(document.createTextNode(foo)) // if “bar” is text` |
| --                  | --                           | (see [content binding](#content-binding) for composition)     |

**Important note on serialization during data binding:**

Browsers must serialize values assigned to a DOM node’s attributes using
`toString()`. It only makes sense to bind serializable values to attributes
(i.e., `String`, `Number`, and `Boolean`). To avoid `[object Object]` surprises,
you can specify the anticipated type of an `x-element` property which will
throw a runtime error if it’s ever set to a value of an unanticipated type.

**A note on non-primitive data:**

Because DOM manipulation is *slow* — template engines do their best to avoid it
(if a value hasn’t changed, DOM manipulation is skipped). To know if a
non-primitive property has changed, a change-by-reference check is performed
(versus a change-by-value check). Therefore, treat non-primitives as if they’re
immutable. Do this: `element.property = { ...element.property, foo: 'bar' }`,
and don’t do this: `element.property.foo = 'bar'`.

## Value binding (in detail)

There are only a handful of bindings. And for each of those bindings, there are
only a handful of _value types_ that are appropriate. This section will cover
everything by “binding”, and then by “value type”.

### Attribute binding

The basic attribute binding simply calls `setAttribute`, verbatim.

```js
const bar = 'something';
html`<div foo="${bar}"></div>`;
// <div foo="something"></div>

const bar = 99;
html`<div foo="${bar}"></div>`;
// <div foo="99"></div>

const bar = undefined;
html`<div foo="${bar}"></div>`;
// <div foo="undefined"></div>

const bar = null;
html`<div foo="${bar}"></div>`;
// <div foo="null"></div>

const bar = true;
html`<div foo="${bar}"></div>`;
// <div foo="true"></div>

const bar = false;
html`<div foo="${bar}"></div>`;
// <div foo="false"></div>

const bar = {};
html`<div foo="${bar}"></div>`;
// <div foo="[object Object]"></div>
```

### Boolean attribute binding

The boolean attribute binding will either set the attribute to the empty string
or remove the attribute.

```js
const bar = 'something';
html`<div ?foo="${bar}"></div>`;
// <div foo></div>

const bar = 99;
html`<div ?foo="${bar}"></div>`;
// <div foo></div>

const bar = undefined;
html`<div ?foo="${bar}"></div>`;
// <div></div>

const bar = null;
html`<div ?foo="${bar}"></div>`;
// <div></div>

const bar = true;
html`<div ?foo="${bar}"></div>`;
// <div foo></div>

const bar = false;
html`<div ?foo="${bar}"></div>`;
// <div></div>

const bar = {};
html`<div ?foo="${bar}"></div>`;
// <div foo></div>
```

### Defined attribute binding

The defined attribute binding will set the attribute via `setAttribute` verbatim
_if_ the value is non-nullish. Otherwise, it will remove the attribute.

```js
const bar = 'something';
html`<div ??foo="${bar}"></div>`;
// <div foo="something"></div>

const bar = 99;
html`<div ??foo="${bar}"></div>`;
// <div foo="99"></div>

const bar = undefined;
html`<div ??foo="${bar}"></div>`;
// <div></div>

const bar = null;
html`<div ??foo="${bar}"></div>`;
// <div></div>

const bar = true;
html`<div ??foo="${bar}"></div>`;
// <div foo="true"></div>

const bar = false;
html`<div ??foo="${bar}"></div>`;
// <div foo="false"></div>

const bar = {};
html`<div ??foo="${bar}"></div>`;
// <div foo="[object Object]"></div>
```

### Property binding

#### Basic property binding

The basic property binding binds the value to the target element, verbatim.

```js
const bar = 'something';
html`<div .foo="${bar}"></div>`;
// <div></div>
// el.foo = bar;
```

### Content binding

The content binding does different things based on the value type passed in.

#### Basic content binding

The most basic content binding sets the value as text content.

```js
const bar = 'something';
html`<div>${bar}</div>`;
// <div>something</div>

const bar = 99;
html`<div>${bar}</div>`;
// <div>99</div>

const bar = undefined;
html`<div>${bar}</div>`;
// <div></div>

const bar = null;
html`<div>${bar}</div>`;
// <div></div>

const bar = true;
html`<div>${bar}</div>`;
// <div>true</div>

const bar = false;
html`<div>${bar}</div>`;
// <div>false</div>

const bar = {};
html`<div>${bar}</div>`;
// <div>[object Object]</div>
```

#### Composed content binding

When the content being bound is itself a template result, you get composition.

```js
const tmpl = html`<span>something</span>`;
html`<div>${tmpl}</div>`;
// <div><span>something</span></div>
```

#### Array content binding

When the content being bound is an array of template results, you get a list.

```js
const list = [
  html`<li>one</li>`,
  html`<li>two</li>`,
  html`<li>three</li>`,
];
html`<ol>${list}</ol>`;
// <ol><li>one</li><li>two</li><li>three</li></ol>

// … or you can use map to generate the list:
const terms = ['one', 'two', 'three'];
const list = terms.map(term => html`<li>${term}</li>`);
html`<ol>${list}</ol>`;
// <ol><li>one</li><li>two</li><li>three</li></ol>
```

#### Map content binding

When the content being bound is an array of key-value map entries (where the
`key` is a unique string within the list and the `value` is a template result),
you get also list. But, this value will come with some special behavior on top
of the basic array content binding. In particular, it _keeps track_ of each
child node based on the given `key` you declare. This enables the template
engine to _move_ child nodes under certain circumstances (versus having to
constantly destroy and recreate). And that shuffling behavior enables authors to
animate DOM nodes across such transitions.

```js
// Note that you can shuffle the deck without destroying / creating DOM.
const deck = [
  { id: 'hearts-one', symbol: '\u26651' },
  // …
  { id: 'clubs-ace', symbol: '\u2663A' },
];
const cards = deck.map(card => [card.id, html`<my-card id="${card.id}">${card.symbol}</my-card>`]);
html`<my-deck>${cards}</my-deck>`;
// <my-deck><my-card id="hearts-one">♥1</my-card>…<my-card id="clubs-ace">♣A</my-card></my-deck>
```

#### DocumentFragment content binding

When the content being bound is a `DocumentFragment` (e.g., from a `<template>`
element’s `.content` property), the child nodes of that fragment will be added
via an `.append(fragment)` on the parent container. This _moves_ those nodes
from the fragment to the container (i.e., _not_ a copy).

```js
const template = document.createElement('template');
template.setHTMLUnsafe(`<svg><circle cx="1" cy="1" r="1" /></svg>`);
const fragment = template.content.cloneNode(true);

html`<div>${fragment}</div>`;
// <div><svg><circle cx="1" cy="1" r="1"></circle></svg></div>
```

## Supported native tags

The default template engine is opinionated about which elements are allowed in
order to reduce complexity and improve performance. The following tags are
supported:

```html
  <!-- Content sectioning -->
  <address> <article> <aside> <footer> <header> <h1> <h2> <h3> <h4> <h5> <h6>
  <hgroup> <main> <nav> <section> <search>

  <!-- Text content -->
  <blockquote> <dd> <div> <dl> <dt> <figcaption> <figure> <hr> <li> <menu> <ol>
  <p> <pre> <ul>

  <!-- Inline text semantics -->
  <a> <abbr> <b> <bdi> <bdo> <br> <cite> <code> <data> <dfn> <em> <i> <kbd>
  <mark> <q> <rp> <rt> <ruby> <s> <samp> <small> <span> <strong> <sub> <sup>
  <time> <u> <var> <wbr>

  <!-- Image and multimedia -->
  <area> <audio> <img> <map> <track> <video>

  <!-- Embedded content -->
  <embed> <fencedframe> <iframe> <object> <picture> <portal> <source>

  <!-- Demarcating edits -->
  <del> <ins>

  <!-- Table content -->
  <caption> <col> <colgroup> <table> <tbody> <td> <tfoot> <th> <thead> <tr>

  <!-- Forms -->
  <button> <datalist> <fieldset> <form> <input> <label> <legend> <meter>
  <optgroup> <option> <output> <progress> <select> <textarea>

  <!-- Interactive elements -->
  <details> <dialog> <summary>

  <!-- Web components -->
  <slot> <template>
```

## Customizing your base class

Following is a working example using [lit-html](https://lit.dev):

```javascript
// base-element.js
import XElement from 'https://deno.land/x/element/x-element.js';
import { html, render as litRender, svg } from 'https://unpkg.com/lit-html@3.1.2/lit-html.js';
import { repeat } from 'https://unpkg.com/lit-html@3.1.2/directives/repeat.js';

export default class BaseElement extends XElement {
  static get templateEngine() {
    const render = (container, template) => litRender(template, container);
    return { render, html, repeat };
  }
}
```

Use it in your elements like this:

```javascript
// my-custom-element.js
import BaseElement from './base-element.js';

class MyCustomElement extends BaseElement {
  static get properties() {
    return {
      items: {
        type: Array,
      },
    };
  }
  static template(html, { repeat }) {
    return ({ items }) => {
      return html`
        <div id="container">
          ${repeat(items, item => item.id, item => html`
            <div id="${item.id}">${item.label}</div>
          `)}
        </div>
      `;
    };
  }
}

customElements.define('my-custom-element', MyCustomElement);
```

A more complete implementation that incorporates all of the Lit directives can be viewed [here](../demo/lit-html/).

## Choosing your template engine(s)

Because native [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) are now part of the browser specification it is important to distinguish `x-element` from other popular JavaScript frameworks. **The manner in which custom elements are defined is framework-agnostic.** Here’s more explanation:

- We can register a new custom element `my-custom-element` within the current page context using a native browser API: `customElements.define('my-custom-element', MyCustomElement);`
- If the features of our custom element are really basic, we could do this easily without any libraries. As your features become more complex some common concerns and conveniences start to emerge (in our case these items became the `x-element` project).
- Regardless of the manner in which the element has been defined, the current page context now guarantees a relationship between the new tag `<my-custom-element>` and the class `MyCustomElement`. This concept is critical to understand because this normalization liberates developers from the need to choose a single framework (or framework version) to define their features.
- Note that it is possible to create a DOM node named `my-custom-element` _before_ the custom element has been defined via `customElements.define('my-custom-element', MyCustomElement)`. This can be done using declarative HTML like `<my-custom-element></my-custom-element>` or with imperative API calls like `const el = document.createElement('my-custom-element')`. However at this stage the `my-custom-element` DOM node is functionally equivalent to a `span`.
- When `my-custom-element` is eventually defined within the page context all instances of that element are instantly “upgraded” using the `MyCustomElement` class. This is the second important concept: DOM composition is independent from custom element definition. This decoupling enables composable feature developers to have flexibility when selecting a DOM template engine. Because child nodes within `my-custom-element` can be fully encapsulated using the [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) creating and managing them becomes an implementation detail that template engines have no awareness of.

Consider the following illustration…

Node composition looks like:

```
+-- BODY -------------------------------------+
|                                             |
|    +-- DIV #root ----------------------+    |
|    |                                   |    |
|    |    +-- DIV #component -------+    |    |
|    |    |                         |    |    |
|    |    |    DIV #light           |    |    |
|    |    |                         |    |    |
|    |    +-------------------------+    |    |
|    |                                   |    |
|    |    +-- MY-CUSTOM-ELEMENT ----+    |    |
|    |    |                         |    |    |
|    |    |    DIV #shadow          |    |    |
|    |    |                         |    |    |
|    |    +-------------------------+    |    |
|    |                                   |    |
|    +-----------------------------------+    |
|                                             |
+---------------------------------------------+
```

The declarative Light DOM representation looks like:

```html
<body>
  <div id="root">
    <div id="component">
      <div id="light"></div>
    </div>
    <my-custom-element></my-custom-element>
  <my-app>
</body>

```

We can generate these nodes any way we prefer while leveraging `my-custom-element`. In this scenario we will use `React` and `ReactDOM` to accomplish this:

```javascript
function Example() {
  return (
    <>
      <div id="component">
        <div id="light" />
      </div>
      <my-custom-element />
    </>
  )
};

const root = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(Example);
```

A working example can be found (here)[../demo/react/]

### Important note regarding React versions before React 19

Because `my-custom-element` has no bound properties, the above example works as expected. `ReactDOM` will generate and attach `<my-custom-element>` to your root just like any other native element. However **React 18 and all prior versions contain compatibility issues with custom elements**, due to a variety of past design decisions that were deliberated at length [here](https://github.com/facebook/react/issues/11347). In short, React’s original property binding and event management system predates the custom element specification. Addressing the incompatibility causes breaking changes to the framework which needed careful consideration.

Fortunately the React team recently [announced support for custom elements](https://react.dev/blog/2024/04/25/react-19#support-for-custom-elements) in its next major version, React 19.

---

## Summary

Features distributed as custom elements are framework and library agnostic. Thus, custom elements can integrate with [any modern framework](https://custom-elements-everywhere.com/). By using native ShadowDOM encapsulation developers can choose the manner in which they manage the DOM while avoiding the risk of vendor lock-in.

Key concepts repeated:

* Custom elements are not a framework (native feature)
* Custom elements provide DOM, JS and CSS encapsulation (native feature)
* Developers can choose a framework to manage the DOM within their custom element
* Developers can choose a framework to manage the DOM that leverages their custom elements
* Developers can work with custom elements without using any framework at all (native feature)
* Developers can mix and match frameworks within the same page context
* It’s all good
