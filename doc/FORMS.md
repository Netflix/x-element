# Forms

Both templating and managing custom form elements are different-enough from
normal development flows that they warrant their own dedicated documentation.

## What’s so different about forms?

Here are a few topics which will come up throughout the document. And, it’s
worth noting that “yes” forms are often nuanced and complex — but they are also
incredibly powerful and designed with accessibility in mind. I.e., they’re worth
understanding and implementing right!

* [Form-Associated Custom Elements][FACE] (FACE).
* [Element Internals][ElementInternals] (`attachInternals`).
* Controls have to be in the form’s light DOM.
* Timing issues related to `change` / `submit` and a control’s value need to
  be considered.
* There are two sources-of-truth to contend with. DOM vs. application state.
* Form apis tend to either be imperative, or introspective (vs. declarative).
* Attribute-to-property syncing is often, unexpectedly asymmetric.
* Values, default values, and resetting can take finesse.
* In general, you may need _very_ tight control.

## Form-Associated Custom Element primer

TODO: NOT SURE IF THIS IS THE RIGHT DIRECTION TO GO IN.

Let’s just make a “simple” form control that wraps a checkbox to make a
fancy-looking toggle.

```js
// TODO: Should we wrap an input? Or, just build one from scratch? Maybe the
//  latter is actually more interesting?
class ToggleInput extends XElement {
  // Instruct the browser that this element can participate in a form. This is a
  //  native browser flag.
  static formAssociated = true;

  // Instruct x-element to re-render DOM _as soon_ as properties change. This is
  //  not performant, but is often a requirement to get nuanced form-control
  //  timing just right.
  static experimentalSynchronousRender = true;

  // Write up our encapsulated CSS to make a track and a thumb.
  static get styles() {
    const text = `\
      :host { display: inline; }
      #input {}
      #input::before {}
      #input::after {}
    `;
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(text);
    return [styleSheet];
  };

  // TODO: Demonstrate how default values need to work?
  // Set up our interface.
  static get properties() {
    return {
      on: { type: Boolean }, // Note that re-entrance will happen here!
      onValue: { type: String, default: '' },
      offValue: { type: String, default: '' },
      value: {
        type: String,
        input: ['on', 'onValue', 'offValue'],
        compute: (on, onValue, offValue) => on ? onValue : offValue,
      },
    };
  }

  // Listen for change events and synchronously re-bind values.
  static get listeners() {
    return {
      change: (host, event) => {
        host.on = event.target.checked;
      }
    }
  }

  // Render out a native checkbox so we can piggy-back off native functionality
  //  like apis, validity, css selectors, etc.
  static template(html) {
    return ({ on }) => {
      return html`<input type="checkbox" .checked="${on}">`;
    }
  }
}
```

## References

* [Form-Associated Custom Elements][FACE]
* [Element Internals][ElementInternals]
* [More capable form controls (web.dev)][web.dev article]

[web.dev article]: https://web.dev/articles/more-capable-form-controls
[FACE]: https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-face-example
[ElementInternals]: https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
