/**
 * Implements property to attribute reflection.
 */

import ElementMixin from './mixins/element-mixin.js';
import PropertiesMixin from './mixins/properties-mixin.js';

export default PropertiesMixin(ElementMixin(HTMLElement));
