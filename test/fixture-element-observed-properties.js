import XElementProperties from '../x-element-properties.js';

class TestElementObservedProperties extends XElementProperties {
  static get properties() {
    return {
      a: {
        type: String,
        observer: 'observeA',
      },
      b: {
        type: String,
        observer: 'observeB',
      },
      c: {
        type: String,
        computed: 'computeC(a, b)',
        observer: 'observeC',
      },
      changes: {
        type: Array,
      },
      popped: {
        type: Boolean,
        reflect: true,
        observer: 'observePopped',
      },
    };
  }
  static computeC(a, b) {
    return `${a} ${b}`;
  }
  // TODO: #26: switch order of arguments.
  static observeA(target, oldValue, newValue) {
    const changes = Object.assign([], target.changes);
    changes.push({ property: 'a', newValue, oldValue });
    target.changes = changes;
  }
  // TODO: #26: switch order of arguments.
  static observeB(target, oldValue, newValue) {
    const changes = Object.assign([], target.changes);
    changes.push({ property: 'b', newValue, oldValue });
    target.changes = changes;
  }
  // TODO: #26: switch order of arguments.
  static observeC(target, oldValue, newValue) {
    const changes = Object.assign([], target.changes);
    changes.push({ property: 'c', newValue, oldValue });
    target.changes = changes;
  }
  // TODO: #26: switch order of arguments.
  static observePopped(target, oldValue, newValue) {
    const changes = Object.assign([], target.changes);
    changes.push({ property: 'popped', newValue, oldValue });
    target.changes = changes;
  }
  static template() {
    return ({ changes }) => {
      return `
        <style>
          :host #container {
            transition-property: box-shadow;
            transition-duration: 300ms;
            transition-timing-function: linear;
            box-shadow: 0 0 0 1px black;
            padding: 10px;
          }
          :host([popped]) #container {
            box-shadow: 0 0 10px 0 black;
          }
        </style>
        <div id="container">
          <div>Changes:</div>
          <ul>${(changes || [])
            .map(({ property, oldValue, newValue }) => {
              return `<li><code>${property}</code>: "${oldValue}" &#x2192; "${newValue}"</li>`;
            })
            .join('')}
          </ul>
        </div>
      `;
    };
  }
}

customElements.define(
  'test-element-observed-properties',
  TestElementObservedProperties
);

class TestElementObservedPropertiesErrorsUnresolved extends XElementProperties {
  static get properties() {
    return { dne: { type: Boolean, observer: 'thisDNE' } };
  }
}
customElements.define(
  'test-element-observed-properties-errors-unresolved',
  TestElementObservedPropertiesErrorsUnresolved
);

export { TestElementObservedPropertiesErrorsUnresolved };
