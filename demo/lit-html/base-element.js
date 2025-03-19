import XElement from '../../x-element.js';
import { asyncAppend } from 'lit-html/directives/async-append.js';
import { asyncReplace } from 'lit-html/directives/async-replace.js';
import { cache } from 'lit-html/directives/cache.js';
import { choose } from 'lit-html/directives/choose.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { directive } from 'lit-html/directive.js';
import { guard } from 'lit-html/directives/guard.js';
import { html, render as originalRender, svg } from 'lit-html/lit-html.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { join } from 'lit-html/directives/join.js';
import { keyed } from 'lit-html/directives/keyed.js';
import { live } from 'lit-html/directives/live.js';
import { map } from 'lit-html/directives/map.js';
import { range } from 'lit-html/directives/range.js';
import { ref } from 'lit-html/directives/ref.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { templateContent } from 'lit-html/directives/template-content.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { until } from 'lit-html/directives/until.js';
import { when } from 'lit-html/directives/when.js';

export default class BaseElement extends XElement {
  // Use lit-html's template engine rather than the built-in x-element engine.
  static get templateEngine() {
    const render = (container, template) => originalRender(template, container);
    return {
      render, html, svg, asyncAppend, asyncReplace, cache, choose, classMap,
      directive, guard, ifDefined, join, keyed, live, map, range, ref, repeat,
      styleMap, templateContent, unsafeHTML, unsafeSVG, until, when,
    };
  }
}
