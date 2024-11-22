# Recipes

Part of the [philosophy](../README.md#project-philosophy) for `x-element` is to
implement only a minimal set of functionality. Rather than build a bespoke
feature to cover each-and-every use case — we simply document how to achieve
some desired outcomes via “recipes” for less common situations.

## How do I instantiate trusted markup?

In certain, _rare_ occasions, it’s acceptable to instantiate a pre-defined
markup string as DOM using `innerHTML`. Rather than supply some sort of special
function (e.g., `carefulWhatYouAreDoingIsUnsafe`), we trust that authors will
understand the hazards of `innerHTML` and will use with care. The basic pattern
here is to instantiate your markup with a `<template>` and then pass its inner
`.content` (a `DocumentFragment`) into the template engine.

```js
class MyElement extends XElement {
  static get properties() {
    return {
      // …
      markup: {
        type: String,
        input: [/* … */],
        compute: (/* … */) => {/* sanitize / purify / careful out there! */},
      },
      fragment: {
        type: DocumentFragment,
        input: ['markup'],
        compute: (markup) => {
          if (markup) {
            const template = document.createElement('template');
            template.innerHTML = markup;
            return template.content;
          }
        },
      },
    };
  }
  static template(html) {
    return ({ fragment }) => {
      return html`
        <div id="container">
          <div id="title">The following is injected…</div>
          ${fragment}
        </div>
      `;
    };
  }
}
```

## How do I force application state to flow the way I want in forms?

A common pain point when building forms is managing the _flow of data_. Does the
model act as the source of truth? Or, does the DOM? Well, that’s up to you! If
you _are_ trying to control forms strictly from some application state, you will
need to make sure that (1) your change events propagate the right information,
(2) your state is guaranteed to flow back to your view, and (3) your DOM state
is correct by the time a potential form submission occurs (e.g., a submit event
can follow _directly_ behind a change event in certain situations). It’s not
possible to predict how authors wish to manage such cases — so it’s not possible
to encode this at a library level. Here’s one way you might go about managing
this though!

```js
class MyElement extends XElement {
  static get properties() {
    return {
      // …
      foo: {
        type: String, // You probably want this to be a string for proper comparisons.
      },
    };
  }
  static get listeners() {
    return {
      change: (host, event) => this.onChange(host, event);
    };
  }
  static template(html, { connected }) {
    return ({ foo }) => {
      return html`
        <form id="container">
          <input id="foo" name="foo" .value="${foo}">
        </form>
      `;
    };
  }
  static onChange(host, event) {
    if (event.target.id === 'foo') {
      // The user has updated the input value. Wait for the next animation
      //  frame and re-bind our value. Note that even in this case, if a submit
      //  follows directly behind a change event — the DOM would still contain
      //  possibly-stale state.
      requestAnimationFrame(() => {
        const foo = host.shadowRoot.getElementById('foo');
        foo.value = host.foo;
      });
    }
  }
}
```
