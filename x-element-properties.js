/**
 * Implements properties and property effects (computed, observer, reflect).
 */

import ElementMixin from './mixins/element-mixin.js';
import PropertiesMixin from './mixins/properties-mixin.js';
import PropertyEffectsMixin from './mixins/property-effects-mixin.js';

export default PropertyEffectsMixin(PropertiesMixin(ElementMixin(HTMLElement)));
