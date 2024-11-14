import XElement from '../../x-element.js';
import { render, html, svg } from 'uhtml';

export default class BaseElement extends XElement {
  // Use µhtml's template engine rather than the built-in x-element engine.
  static get templateEngine() {
    return { render, html, svg };
  }
}
