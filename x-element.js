/**
 * Base class for custom elements.
 */

import ElementMixin from './mixins/element-mixin.js';
import ListenersMixin from './mixins/listeners-mixin.js';
import LitHtmlMixin from './mixins/lit-html-mixin.js';
import PropertiesMixin from './mixins/properties-mixin.js';
import PropertyEffectsMixin from './mixins/property-effects-mixin.js';

export default LitHtmlMixin(
  ListenersMixin(
    PropertyEffectsMixin(PropertiesMixin(ElementMixin(HTMLElement)))
  )
);
