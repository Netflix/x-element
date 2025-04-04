import XElement from '../../x-element.js';
import data from './form-control.json' with { type: 'json' };
import styleSheet from './form-control.css' with { type: 'css' };

const entries = Object.entries(data);

class FormControl extends XElement {
  static #internalsMap = new WeakMap();

  static get formAssociated() {
    return true;
  }

  static get styles() {
    return [styleSheet];
  }

  static createRenderRoot(host) {
    return host.attachShadow({ mode: 'open', delegatesFocus: true });
  }

  // TODO: This feels awkward to keep internals… internal. We need access to
  //  this in callbacks so it’s not currently feasible to make it private on the
  //  “host” instance.
  static #getInternals(host) {
    return FormControl.#internalsMap.get(host);
  }

  static get properties() {
    return {
      // Public interface (see also getters / setters below)
      name: {
        type: String,
        reflect: true,
      },
      required: {
        type: Boolean,
        reflect: true,
      },
      value: {
        type: String,
        reflect: true,
        // TODO: Setting the default to "''" here ensures that validation will
        //  be hit. However, this has a weird side-effect of immediately marking
        //  the field as “:invalid” — which is typically not what users will
        //  expect. Not sure if we’re missing something from the spec still…
        default: '',
        observe: (host, value) => {
          const input = host.shadowRoot.getElementById('input');
          const internals = FormControl.#getInternals(host);
          internals.setFormValue(value);
          // TODO: This binding within the observer feels a little awkward. It
          //  would break if we property-bound with a “live” updater though.
          input.value = value;
          FormControl.validate(host);
        },
      },

      // Internal interface
      emoji: {
        type: String,
        internal: true,
        input: ['value'],
        compute: value => {
          if (value) {
            const codePoint = data[value];
            if (codePoint) {
              return String.fromCodePoint(...codePoint);
            }
          }
        },
      },
      matches: {
        type: Array,
        internal: true,
        default: () => [],
      },
    };
  }

  static get listeners() {
    return {
      input: (host) => {
        this.input(host);
      },
      change: (host, event) => {
        host.value = event.target.value;
        this.change(host);
      },
      click: (host, event) => {
        if (event.target.dataset.value) {
          const input = host.shadowRoot.getElementById('input');
          host.value = event.target.dataset.value;
          input.value = host.value;
          this.match(host);
          this.change(host);
          input.focus();
        }
      },
      keydown: (host, event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const input = host.shadowRoot.getElementById('input');
          const matches = host.shadowRoot.getElementById('matches');
          const activeElement = host.shadowRoot.activeElement;
          if (activeElement === input) {
            matches.firstElementChild?.focus();
          } else if (matches.contains(activeElement)) {
            activeElement.nextElementSibling?.focus();
          }
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          const input = host.shadowRoot.getElementById('input');
          const matches = host.shadowRoot.getElementById('matches');
          const activeElement = host.shadowRoot.activeElement;
          if (matches.contains(activeElement)) {
            const previousElementSibling = activeElement.previousElementSibling;
            if (previousElementSibling) {
              previousElementSibling.focus();
            } else {
              input.focus();
            }
          }
        } else if (event.key === 'Enter') {
          // TODO: Inputs typically submit when you hit enter. Not sure that
          //  there is a way to control that from the element itself.
          const input = host.shadowRoot.getElementById('input');
          input.blur();
        }
      },
    };
  }

  static template(html) {
    return ({ emoji, matches }) => {
      return html`
        <div id="container">
          <input id="input" type="text"> ${emoji}
          <div id="matches-wrapper">
            <div id="matches">
              ${matches.map(match => {
                return html`
                  <button type="button" class="match" data-value="${match.value}">
                    ${match.emoji} ${match.value} 
                  </button>
                `;
              })}
              <div id="no-matches">(no matches)</div>
            </div>
          </div>
        </div>
      `;
    };
  }

  static match(host) {
    const substring = host.shadowRoot.getElementById('input').value;
    if (substring) {
      host.internal.matches = entries
        .filter(([value]) => value.includes(substring))
        .slice(0, 100)
        .map(([value, codePoint]) => ({ value, emoji: String.fromCodePoint(...codePoint) }));
    } else {
      host.internal.matches = entries
        .slice(0, 100)
        .map(([value, codePoint]) => ({ value, emoji: String.fromCodePoint(...codePoint) }));
    }
  }

  static input(host) {
    this.match(host);
    const eventType = 'input';
    const eventData = { bubbles: true };
    host.dispatchEvent(new CustomEvent(eventType, eventData));
  }

  static change(host) {
    const eventType = 'change';
    const eventData = { bubbles: true };
    host.dispatchEvent(new CustomEvent(eventType, eventData));
  }

  static validate(host) {
    const input = host.shadowRoot.getElementById('input');
    const internals = FormControl.#getInternals(host);
    const valueOk = !!data[host.value];
    const hasValue = !!host.value;
    const required = host.required;
    if (!required && !hasValue || valueOk) {
      internals.setValidity({
        valueMissing: false,
        customError: false,
      });
    } else if (required && !hasValue) {
      internals.setValidity({
        valueMissing: true,
        customError: false,
      }, 'Please enter an emoji.', input);
    } else {
      internals.setValidity({
        valueMissing: false,
        customError: true,
      }, 'Unrecognized emoji.', input);
    }
  }

  connectedCallback() {
    // TODO: This is awkward to need to initialize ahead of the connected
    //  callback. We do this to satisfy the observe callback for our value.
    if (!FormControl.#getInternals(this)) {
      // Initialize the form control.
      FormControl.#internalsMap.set(this, this.attachInternals());
    }
    super.connectedCallback();
    FormControl.match(this);
  }

  formAssociatedCallback(/*form*/) {
    // TODO: Consider adding this lifecycle function to the base class.
    // super.formAssociatedCallback(form);
  }

  formDisabledCallback(/*disabled*/) {
    // TODO: Consider adding this lifecycle function to the base class.
    // super.formDisabledCallback(disabled);
  }

  formResetCallback() {
    // TODO: Consider adding this lifecycle function to the base class.
    // super.formResetCallback();
  }

  formStateRestoreCallback(/*state, mode*/) {
    // TODO: Consider adding this lifecycle function to the base class.
    // super.formStateRestoreCallback(state, mode);
  }

  get form() {
    const internals = FormControl.#getInternals(this);
    return internals.form;
  }

  get type() {
    return this.localName;
  }

  get validity() {
    const internals = FormControl.#getInternals(this);
    return internals.validity;
  }

  get validationMessage() {
    const internals = FormControl.#getInternals(this);
    return internals.validationMessage;
  }

  get willValidate() {
    const internals = FormControl.#getInternals(this);
    return internals.willValidate;
  }

  checkValidity() {
    const internals = FormControl.#getInternals(this);
    return internals.checkValidity();
  }

  reportValidity() {
    const internals = FormControl.#getInternals(this);
    return internals.reportValidity();
  }
}

customElements.define('form-control', FormControl);
