import XElement from '../../x-element.js';
import { asyncAppend } from 'https://unpkg.com/lit-html/directives/async-append.js?module';
import { asyncReplace } from 'https://unpkg.com/lit-html/directives/async-replace.js?module';
import { cache } from 'https://unpkg.com/lit-html/directives/cache.js?module';
import { classMap } from 'https://unpkg.com/lit-html/directives/class-map.js?module';
import { directive } from 'https://unpkg.com/lit-html/directive.js?module';
import { guard } from 'https://unpkg.com/lit-html/directives/guard.js?module';
import { html, render as originalRender, svg } from 'https://unpkg.com/lit-html/lit-html.js?module';
import { ifDefined } from 'https://unpkg.com/lit-html/directives/if-defined.js?module';
import { live } from 'https://unpkg.com/lit-html/directives/live.js?module';
import { repeat } from 'https://unpkg.com/lit-html/directives/repeat.js?module';
import { styleMap } from 'https://unpkg.com/lit-html/directives/style-map.js?module';
import { templateContent } from 'https://unpkg.com/lit-html/directives/template-content.js?module';
import { unsafeHTML } from 'https://unpkg.com/lit-html/directives/unsafe-html.js?module';
import { unsafeSVG } from 'https://unpkg.com/lit-html/directives/unsafe-svg.js?module';
import { until } from 'https://unpkg.com/lit-html/directives/until.js?module';

export default class BaseElement extends XElement {
  // Use lit-html's template engine rather than the built-in x-element engine.
  static get templateEngine() {
    const render = (container, template) => originalRender(template, container);
    return {
      render, html, svg, asyncAppend, asyncReplace, cache, classMap, directive,
      guard, ifDefined, live, repeat, styleMap, templateContent, unsafeHTML,
      unsafeSVG, until,
    };
  }
}
