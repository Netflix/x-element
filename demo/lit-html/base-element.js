import XElement from '../../x-element.js';
import { asyncAppend } from 'https://unpkg.com/lit-html/directives/async-append.js';
import { asyncReplace } from 'https://unpkg.com/lit-html/directives/async-replace.js';
import { cache } from 'https://unpkg.com/lit-html/directives/cache.js';
import { classMap } from 'https://unpkg.com/lit-html/directives/class-map.js';
import { directive } from 'https://unpkg.com/lit-html/directive.js';
import { guard } from 'https://unpkg.com/lit-html/directives/guard.js';
import { html, render as originalRender, svg } from 'https://unpkg.com/lit-html/lit-html.js';
import { ifDefined } from 'https://unpkg.com/lit-html/directives/if-defined.js';
import { live } from 'https://unpkg.com/lit-html/directives/live.js';
import { repeat } from 'https://unpkg.com/lit-html/directives/repeat.js';
import { styleMap } from 'https://unpkg.com/lit-html/directives/style-map.js';
import { templateContent } from 'https://unpkg.com/lit-html/directives/template-content.js';
import { unsafeHTML } from 'https://unpkg.com/lit-html/directives/unsafe-html.js';
import { unsafeSVG } from 'https://unpkg.com/lit-html/directives/unsafe-svg.js';
import { until } from 'https://unpkg.com/lit-html/directives/until.js';

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
