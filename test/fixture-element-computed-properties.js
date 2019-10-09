import XElementProperties from '../x-element-properties.js';

let count = 0;

class TestElementComputedProperties extends XElementProperties {
  static get properties() {
    return {
      a: {
        type: Number,
      },
      b: {
        type: Number,
      },
      c: {
        type: Number,
        // Checks that multiline computed strings will work.
        computed: `
          computeC(
            a,
            b,
          )
        `,
      },
      negative: {
        type: Boolean,
        computed: 'computeNegative(c)',
        reflect: true,
      },
      underline: {
        type: Boolean,
        computed: 'computeUnderline(negative)',
        reflect: true,
      },
      italic: {
        type: Boolean,
        reflect: true,
      },
      y: {
        type: Boolean,
      },
      z: {
        type: Boolean,
        computed: 'computeZ(y)',
      },
      today: {
        type: Date,
      },
      tomorrow: {
        type: Date,
        computed: 'computeTomorrow(today)',
      },
      countTrigger: {
        type: String,
      },
      count: {
        type: Number,
        computed: 'computeCount(countTrigger)',
        value: count,
      },
    };
  }
  computeC(a, b) {
    return a + b;
  }
  static computeNegative(c) {
    return c < 0;
  }
  static computeCount() {
    // This doesn't use an observer to prevent a coupled test.
    return ++count;
  }
  static computeUnderline(negative) {
    return !!negative;
  }
  static computeZ(y) {
    return y;
  }
  static computeTomorrow(today) {
    if (today) {
      return today.valueOf() + 1000 * 60 * 60 * 24;
    }
  }
  static template() {
    return ({ a, b, c }) => {
      return `
        <style>
          #calculation {
            background-color: lightgreen;
            padding: 10px;
          }
          :host([negative]) #calculation {
            background-color: lightcoral;
          }
          :host([underline]) #calculation {
            text-decoration: underline;
          }
          :host([italic]) #calculation {
            font-style: italic;
          }
        </style>
        <span id="calculation">${a} + ${b} = ${c}</span>
      `;
    };
  }
}

customElements.define(
  'test-element-computed-properties',
  TestElementComputedProperties
);

class TestElementComputedPropertiesErrors extends XElementProperties {
  static get properties() {
    return {
      malformed: {
        type: Boolean,
        computed: 'malformed(a,,b)',
      },
      dne: {
        type: Boolean,
        computed: 'thisDNE(malformed)',
      },
      missing: {
        type: String,
        computed: 'computeMissing(notDeclared)',
      },
      zz: {
        type: Boolean,
      },
      cyclic: {
        type: String,
        computed: 'computeCyclic(zz, cyclic)',
      },
    };
  }
  static computeMissing() {
    return `this is just here to get past the unresolved method check`;
  }
  static computeCyclic() {
    return `this is just here to get past the unresolved method check`;
  }
  static template() {
    return () => ``;
  }
}

customElements.define(
  'test-element-computed-properties-errors',
  TestElementComputedPropertiesErrors
);
