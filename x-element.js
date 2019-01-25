/**
 * Base class for custom elements.
 *
 * Extends XElementBasic and XElementProperties
 *
 * Introduces template rendering using the `lit-html` library for improved
 * performance and added functionality.
 */

import ElementMixin from './mixins/element-mixin.js';
import LitHtmlMixin from './mixins/lit-html-mixin.js';
import PropertiesMixin from './mixins/properties-mixin.js';
import PropertyEffectsMixin from './mixins/property-effects-mixin.js';

export default LitHtmlMixin(
  PropertyEffectsMixin(PropertiesMixin(ElementMixin(HTMLElement)))
);
