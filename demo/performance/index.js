import XElement from '../../x-element.js';
import { html as litHtmlHtml, render as litHtmlRender } from 'https://unpkg.com/lit-html/lit-html.js?module';
import { render as uhtmlRender, html as uhtmlHtml } from 'https://unpkg.com/uhtml?module';

class DefaultPerformanceElement extends XElement {
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
      perfect: {
        type: Boolean,
        input: ['hypotenuse'],
        compute: hypotenuse => Number.isInteger(hypotenuse),
        reflect: true,
      },
      title: {
        type: String,
        internal: true,
        input: ['valid', 'perfect'],
        compute: (valid, perfect) => {
          return !valid
            ? 'This is not a triangle.'
            : perfect
              ? 'This is a perfect triangle.'
            : 'This is a triangle.';
        },
      },
    };
  }

  static template(html) {
    return ({ base, height, hypotenuse, title }) => html`
      <style>
        :host {
          display: block;
        }
        :host(:not([valid])) {
          color: red;
        }
        :host([perfect]) {
          color: green;
        }
      </style>
      <code base="${base}" height="${height}" .title="${title}">
        Math.hypot(${base}, ${height}) = ${hypotenuse}
      <code>
    `;
  }
}
customElements.define('default-performance', DefaultPerformanceElement);

class LitHtmlPerformanceElement extends DefaultPerformanceElement {
  // Use lit-html's template engine rather than the built-in x-element engine.
  static get templateEngine() {
    const render = (container, template) => litHtmlRender(template, container);
    const html = litHtmlHtml;
    return { render, html };
  }
}
customElements.define('lit-html-performance', LitHtmlPerformanceElement);

class UhtmlPerformanceElement extends DefaultPerformanceElement {
  // Use µhtml's template engine rather than the built-in x-element engine.
  static get templateEngine() {
    return { render: uhtmlRender, html: uhtmlHtml };
  }
}
customElements.define('uhtml-performance', UhtmlPerformanceElement);
