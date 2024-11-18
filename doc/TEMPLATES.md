# Templates & DOM

Because `x-element` has zero dependencies it ships with an integrated template
engine. Developers can choose alternatives according to their preference, e.g.
`lit-html`, `ReactDOM`, etc.

Add a static template function in your `x-element` definition in order to
leverage automagical DOM generation and data binding:

```javascript
static template(html, { map }) {
  return ({ options, selectedId }) => {
    return html`
      <select name="my-options">
        ${map(options, option => option.id, option => html`
          <option value="${option.value}" ?selected="${option.id === selectedId}">
        `)}
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

The following template languages are supported:

* `html`
* `svg`

The following value updaters are supported:

* `map` (can be used with content bindings)
* `unsafe` (can be used with content bindings)
* `live` (can be used with property bindings)

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
everything by binding, and then by value type.

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

#### The `live` property binding

You can wrap the property being bound in the `live` updater to ensure that each
`render` call will sync the template‘s value into the DOM. This is primarily
used to control form inputs.

```js
const bar = 'something';
html`<input .value="${live(bar)}">`;
// <input>
// el.value = bar;
```

The key difference to note is that the basic property binding will not attempt
to perform an update if `value === lastValue`. The `live` binding will instead
check if `value === el.value` whenever a `render` is kicked off.

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
const bar = html`<span>something</span>`;
html`<div>${bar}</div>`;
// <div><span>something</span></div>
```

#### Array content binding

When the content being bound is an array of template results, you get a mapping.

```js
const bar = [
  html`<span>one</span>`,
  html`<span>two</span>`,
];
html`<div>${bar}</div>`;
// <div><span>one</span><span>two</span></div>

// … but, you typically don’t have a static array, you map it idiomatically.
const terms = ['one', 'two'];
const bar = terms.map(term => html`<span>${item}</span>`);
html`<div>${bar}</div>`;
// <div><span>one</span><span>two</span></div>
```

#### The `map` content binding

The `map` content binding adds some special behavior on top of the basic array
content binding. In particular, it _keeps track_ of each child node based on
an `identify` function declared by the caller. This enables the template engine
to _move_ child nodes under certain circumstances (versus having to constantly
destroy and recreate). And that shuffling behavior enables authors to animate
DOM nodes across such transitions.

```js
// Note that you can shuffle the deck without destroying / creating DOM.
const deck = [
  { id: 'hearts-one', text: '\u26651' },
  // …
  { id: 'clubs-ace', text: '\u2663A' },
];
const items = deck;
const identify = item => item.id;
const callback = item => html`<span>${item.text}</span>`;
const bar = map(items, identify, callback);
html`<div>${bar}</div>`;
// <div><span>♥1</span>…<span>♣A</span></div>
```

#### The `unsafe` content binding

The `unsafe` content binding allows you to parse / instantiate text from a
trusted source. This should _only_ be used to inject trusted content — never
user content.

```js
const bar = '<script>console.prompt("can you hear me now?")</script>';
html`<div>${unsafe(bar, 'html')}</div>`;
// <div><script>console.prompt("can you hear me now?")</script></div>
// console.prompt('can you hear me now?');

const bar = '<circle cx="50" cy="50" r="50"></circle>';
html`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100">
    ${unsafe(bar, 'svg')}
  </svg>
`;
//
// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   viewBox="0 0 100 100">
//   <circle cx="50" cy="50" r="50"></circle>
// </svg>
//
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
