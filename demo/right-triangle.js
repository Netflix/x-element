import XElement from '../x-element.js';

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
      valid: {
        type: Boolean,
        input: ['hypotenuse'],
        compute: hypotenuse => !!hypotenuse,
        reflect: true,
      },
    };
  }

  static template(html) {
    return ({ base, height, hypotenuse }) => html`
      <style>
        :host {
          display: block;
        }
        :host(:not([valid])) {
          display: none;
        }
      </style>
      <code>Math.hypot(${base}, ${height}) = ${hypotenuse}<code>
    `;
  }
}

customElements.define('right-triangle', RightTriangle);
