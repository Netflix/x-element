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

import { asyncAppend } from '../../lit-html/directives/async-append.js';
import { asyncReplace } from '../../lit-html/directives/async-replace.js';
import { guard } from '../../lit-html/directives/guard.js';
import { ifDefined } from '../../lit-html/directives/if-defined.js';
import { repeat } from '../../lit-html/directives/repeat.js';
import { unsafeHTML } from '../../lit-html/directives/unsafe-html.js';
import { until } from '../../lit-html/directives/until.js';
import { when } from '../../lit-html/directives/when.js';

const directives = {
  asyncAppend,
  asyncReplace,
  guard,
  ifDefined,
  repeat,
  unsafeHTML,
  until,
  when,
};

export default class AbstractElement extends XElementProperties {
  render() {
    const tmpl = this.constructor.template(html, directives);
    const proxy = this.constructor.renderProxy(this);
    render(tmpl(proxy, this), this.shadowRoot);
  }

  /* eslint-disable no-shadow, no-unused-vars */
  static template(html, directives) {
    return (proxy, original) => html``;
  }
}
