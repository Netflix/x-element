# Templates & DOM

Because `x-element` has zero dependencies it ships with an integrated template engine. Developers can choose alternatives according to their preference, e.g. `lit-html`, `React`, etc.

Add a static template function in your `x-element` definition in order to leverage automagical DOM generation and data binding:

```
static template(html, { repeat }) {
  return ({ options, selectedId }) => {
    return html`
      <select name="my-options">
        ${repeat(options, option => option.id, option => html`
          <option value="${option.value}" ?selected="${option.id === selectedId}">
        `)}
      </select>
    `;
  };
}
```

The following binding types are supported:

| Type                | Example                |
| ------------------- | ---------------------- |
| attribute           | `<div foo="${bar}">`   |
| attribute (boolean) | `<div ?foo="${bar}">`  |
| property            | `<div .foo="${bar}">`  |
| text                | `<div>${foo}</div>`    |
| content             | `${foo}`               |

Equivalent to:

```
const el = document.createElement('my-custom-element');

// attribute value bindings add or modify the attribute value
el.setAttribute('foo', bar);

// attribute boolean bindings add or remove the attribute
el.setAttribute('foo', '');

// property bindings assign the value to the property of the node
el.foo = bar;

// text bindings assign the value to the content of the node
el.textContent = foo;

// content bindings create and append text to the node
el.appendChild(document.createTextNode(foo))
```

### Important note on serialization during data binding:
Values assigned to DOM attributes are always serialized using `toString()` during assignment. To help you avoid `[object Object]` surprises, properties defined using `x-element` allow you to specify their anticipated type. Properties with scalar types `String`, `Number`, and `Boolean` may be bound to attributes using native serialization. Attempting to bind non-scalar types to attributes will result in an `x-element` error message.

The following directives are supported:

* ifDefined
* live
* map
* nullish
* repeat
* unsafeHTML
* unsafeSVG

The following template languages are supported:

* html
* svg

### A word on Repeat, Map, and template re-rendering

In web components, arrays and other complex data types are expected (if they are present at all) to be handed to the parent component as content within [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots), using the contents as XML-like data (or as freestanding tags/web components), rather than on attributes.

This has some subtle consequences for the built-in reactivity of web components. The main way that web components are notified of changes to their data are by updates to their attributes. This means that if you use repeat or map to render a section of your template, **changes to the arrays or objects iterated over will not automatically trigger a re-render.**

As a result, you must manually trigger the `.render` method of your component somehow. The most idiomatic way to trigger a re-render would be to ensure the data you're iterating over is derived from contents within your component's slot, and then to add a listener to the [`slotchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event) event which retriggers your component's render function:

```
static get listeners() {
  return {slotchange: this.render}
}
```

Another method might be to use an observation library to watch for changes to the objects you're iterating over, and then run the render function as a callback.

#### Cache key functions

Due to the limitations in the last section, we always re-render repeat and map templates by default. However, this can get expensive depending on the number of items that must be re-rendered. If you want to avoid re-rendering items in a repeat or map template, you can specify a `key` function that will checked. If the key function's output is the same as the last time the render ran, the template will not be re-rendered.

This snippet includes a key function as its last argument that ensures the repeat template will not be re-run unless the `options` array is completely replaced:

```
return ({ options, selectedId }) => {
  return html`
  <select name="my-options">
    ${repeat(options, option => option.id, option => html`
      <option value="${option.value}" ?selected="${option.id === selectedId}">${option.text}</option>
    `, () => options)}
  </select>
  <slot></slot>`;
};
```

## Customizing your base class

Following is a working example using [lit-html](https://lit.dev):

```
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

```
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

A more complete implementation with all the Lit directives can be viewed [here](../demo/lit-html/).

## Choosing your template engine(s)

Because native [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) are now part of the browser specification it is important to distinguish `x-element` from other popular JavaScript frameworks. **The manner in which custom elements are defined is framework-agnostic.** Here's more explanation:

- We can register a new custom element `my-custom-element` within the current page context using a native browser API: `customElements.define('my-custom-element', MyCustomElement);`
- If the features of our custom element are really basic, we could do this easily without any libraries. As your features become more complex some common concerns and conveniences start to emerge (in our case these items became the `x-element` project).
- Regardless of the manner in which the element has been defined, the current page context now guarantees a relationship between the new tag `<my-custom-element>` and the class `MyCustomElement`. This concept is critical to understand because this normalization liberates developers from the need to choose a single framework (or framework version) to define their features.
- Note that it is possible to create a DOM node named `my-custom-element` _before_ the custom element has been defined via `customElements.define('my-custom-element', MyCustomElement)`. This can be done using declarative HTML like `<my-custom-element></my-custom-element>` or with imperative API calls like `const el = document.createElement('my-custom-element')`. At this stage the `my-custom-element` DOM node is functionally equivalent to a `span`.
- When `my-custom-element` is eventually defined within the page context all instances of that element are instantly "upgraded" using the `MyCustomElement` class. This is the second important concept: DOM composition is independent from custom element definition. This decoupling enables composible feature developers to have flexibility when selecting a DOM template engine. Because child nodes within `my-custom-element` can be fully encapsulated using the [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) creating and managing them becomes an implementation detail.

Consider the following illustration...

```

Node composition looks like:

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

The declarative Light DOM representation looks like:

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

```

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

const example = (
  <>
    <div id="component">
      <div id="global"></div>
    </div>
    <my-custom-element/>
  </>
);

root.render(example);

```

A working example can be found (here)[../demo/react/]

### Important note regarding React versions before React 19

Because `my-custom-element` has no bound properties, the above example works as expected. `ReactDOM` will generate and attach `<my-custom-element>` to your root just like any other native element. However, **React 18 and all prior versions remain incompatible with custom elements**, due to a variety of past design decisions that were deliberated at length [here](https://github.com/facebook/react/issues/11347). In short, React's original property binding and event management system predates the custom element specification. Addressing the incompatibility causes breaking changes to the framework which needed careful consideration.

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
* It's all good baby
