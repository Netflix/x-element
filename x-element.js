/**
 * Base class for custom elements.
 *
 * Extends XElementBasic and XElementProperties
 *
 * Introduces template rendering using the `lit-html` library for improved
 * performance and added functionality.
 */

import XElementProperties from './x-element-properties.js';
import { render, html } from '../../lit-html/lit-html.js';
import { repeat } from '../../lit-html/directives/repeat.js';

export default class AbstractElement extends XElementProperties {
  render() {
    const tmpl = this.constructor.template(html, repeat);
    const proxy = this.constructor.renderProxy(this);
    render(tmpl(proxy, this), this.shadowRoot);
  }

  /* eslint-disable no-shadow, no-unused-vars */
  static template(html, repeat) {
    return (proxy, original) => html``;
  }
}
