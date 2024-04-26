# XElement

A base class for custom elements.

Define and register your element:

```javascript
import XElement from 'https://deno.land/x/element/x-element.js';

class HelloWorld extends XElement {
  static template(html) {
    return () => html`<span>Hello World!</span>`;
  }
}

customElements.define('hello-world', HelloWorld);
```

And use it in your markup:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World</title>
    <script type="module" src="./hello-world.js"></script>
  </head>
  <body>
    <hello-world></hello-world>
  </body>
</html>
```

## Rendering

XElement has a built-in templating engine to efficiently manage DOM generation and data binding using native [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

It is also possible to use third party rendering engines. Check out the (template guide)[./TEMPLATES.md] to learn more.

## Properties

Properties and their related attributes are watched. When a property or related
attribute is updated, a render is queued.

Property definitions have the following options:

- `type`      [Function]: associate properties with types.
- `attribute` [String]: override default attribute for properties.
- `input`     [StringArray]: declare names of watched properties for a computed property.
- `compute`   [Function]: compute property value when input changes.
- `reflect`   [Boolean]: reflect properties back to attributes.
- `observe`   [Function]: react when properties change.
- `initial`   [Function|Any]: provide initial, default values for nullish properties.
- `default`   [Function|Any]: provide recurring, default values for nullish properties.
- `readOnly`  [Boolean]: prevent setting properties on the host.
- `internal`  [Boolean]: prevent getting / setting properties on the host.

### Example

```javascript
class RightTriangle extends XElement {
  static get properties() {
    return {
      base: {
        type: Number,
        initial: 3,
      },
      height: {
        type: Number,
        initial: 4,
      },
      hypotenuse: {
        type: Number,
        input: ['base', 'height'],
        compute: Math.hypot,
      },
    };
  }

  static template(html) {
    return ({ base, height, hypotenuse }) => html`
      <code>Math.hypot(${base}, ${height}) = ${hypotenuse}<code>
    `;
  }
}
```

## Reflected properties

By default, property attributes are synced — i.e., updating the attribute will
update the property. Bi-directional syncing only happens if you _reflect_ the
property by setting `reflect: true`.

## Read-only and internal properties

Sometimes you want a property to be part of the public interface (either for
attribute or property introspection), but you want to manage the value of that
property internally. You can set `readOnly: true` to achieve this. Such a
property can only be written to using `host.internal`.

Other times, you don't want a property to be part of the public interface
(common for computed properties). You can set `internal: true` to achieve this.
Such a property can only be read from or written to using `host.internal`.

### Example

```javascript
class MyElement extends XElement {
  static get properties() {
    return {
      date: {
        type: String,
        readOnly: true,
        initial: () => new Date().toISOString(),
        reflect: true,
      },
      interval: {
        internal: true,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    clearInterval(this.internal.interval);
    this.internal.interval = setInterval(() => this.tick(), 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.internal.interval);
  }

  tick() {
    this.internal.date = new Date().toISOString();
  }

  static template(html) {
    return ({ date }) => html`<span>${date}<span>`;
  }
}
```

## Computed properties

Create a computed property by providing a list other property names as `input`
and a `compute` callback to be invoked when the input changes. The `compute`
callbacks are memoized and are expected to be pure.

If the given function is defined on the constructor, the context (`this`) is
guaranteed to be the constructor when called later.

**Computed properties are lazily evaluated.** If a computed property is not
rendered in a template function or accessed programmatically, its code will
not run.

## Observed properties

Create an observed property by providing an `observe` function. Whenever an
observable change occurs, your function will be called with
`host, value, oldValue`.

If the given function is defined on the constructor, the context (`this`) is
guaranteed to be the constructor when called later.

## Listeners

XElement supports declarative, delegated event handlers via a `listeners`
block. Listeners are added during the `connectedCallback` and are removed during
the `disconnectedCallback` in the element's lifecycle. Listeners defined in
the `listeners` block are added to the render root.

Because it's so common to want to introspect the `event` and call a function on
the `host`, the provided arguments are `host, event`.

If the given function is defined on the constructor, the context (`this`) is
guaranteed to be the constructor when called later.

### Example

```javascript
class MyElement extends XElement {
  static get properties() {
    return {
      clicks: {
        type: Number,
        readOnly: true,
        default: 0,
      },
    };
  }

  static get listeners() {
    return { click: this.onClick };
  }

  static onClick(host, event) {
    host.internal.clicks += event.detail;
  }

  static template(html) {
    return ({ clicks }) => {
      return html`<span>Clicks: ${clicks}</span>`;
    }
  }
}
```

## Manually adding listeners

If you need more fine-grain control over when listeners are added or removed,
you can use the `listen` and `unlisten` functions.

Because it's so common to want to introspect the `event` and call a function on
the `host`, the provided arguments will always be `host, event`.

If the given function is defined on the constructor, the context (`this`) is
guaranteed to be the constructor when called later.

### Example

```javascript
class MyElement extends XElement {
  static get properties() {
    return {
      clicks: {
        type: Number,
        readOnly: true,
        default: 0,
      },
    };
  }

  static onClick(host, event) {
    host.internal.clicks += event.detail;
  }

  connectedCallback() {
    super.connectedCallback();
    this.listen(this.shadowRoot, 'click', this.constructor.onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unlisten(this.shadowRoot, 'click', this.constructor.onClick);
  }

  static template(html) {
    return ({ clicks }) => {
      return html`<span>Clicks: ${clicks}</span>`;
    }
  }
}
```

## Render Root

By default, XElement will create an open shadow root. However, you can change
this behavior by overriding the `createRenderRoot` method. There are a few
reasons why you might want to do this as shown below.

### No Shadow Root

```javascript
class MyElement extends XElement {
  static createRenderRoot(host) {
    return host;
  }
}
```

### Focus Delegation

```javascript
class MyElement extends XElement {
  static createRenderRoot(host) {
    return host.attachShadowRoot({ mode: 'open', delegatesFocus: true });
  }
}
```

## Lifecycle

### Constructor Analysis

Analysis takes place once per class. This allows all future instances to share
common setup work. Halting errors are thrown here to assist in development.

### Instance Construction

Each instance undergoes one-time setup work in the `constructor` callback.

### Instance Initialization

Each instance is initialized once during the first `connectedCallback`.

### Update

When properties update on an initialized element, the following should occur:

- await a queued microtask (prevents unnecessary, synchronous work)
- compute properties (this is implied and happens lazily)
- reflect properties
- render result
- observe properties

## Recipes

### Observing multiple properties

In certain cases, you may want to observe multiple properties at once. One way
to achieve this is to compute a new object and observe that object.

```javascript
class MyElement extends XElement {
  static get properties() {
    return {
      tag: {
        type: String,
        default: 'div',
      },
      text: {
        type: String,
        default: '',
      },
      element: {
        type: HTMLElement,
        internal: true,
        input: ['tag'],
        compute: tag => document.createElement(tag),
        observe: (host, element) => {
          const container = host.shadowRoot.getElementById('container');
          container.innerHTML = '';
          container.append(element);
        }
      },
      update: {
        type: Object,
        internal: true,
        input: ['element', 'text'],
        compute: (element, text) => ({ element, text }),
        observe: (host, { element, text }) => {
          element.textContent = text;
        },
      },
    };
  }

  static template(html) {
    return () => {
      return html`<div id="container"></span>`;
    }
  }
}
```

## References

- [WHATWG Custom Elements Spec](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [lit-html](https://lit.dev)
