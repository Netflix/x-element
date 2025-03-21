import { test, coverage } from '@netflix/x-test/x-test.js';

// We import these here so we can see code coverage.
import '../x-element.js';
import '../x-parser.js';
import '../x-template.js';

// Set a high bar for code coverage!
coverage(new URL('../x-element.js', import.meta.url).href, 100);
coverage(new URL('../x-parser.js', import.meta.url).href, 100);
coverage(new URL('../x-template.js', import.meta.url).href, 100);

test('./test-parser.html');
test('./test-template-engine.html');
test('./test-analysis-errors.html');
test('./test-initialization-errors.html');
test('./test-attribute-changed-errors.html');
test('./test-element-upgrade.html');
test('./test-render.html');
test('./test-render-root.html');
test('./test-styles.html');
test('./test-basic-properties.html');
test('./test-initial-properties.html');
test('./test-default-properties.html');
test('./test-read-only-properties.html');
test('./test-internal-properties.html');
test('./test-reflected-properties.html');
test('./test-computed-properties.html');
test('./test-observed-properties.html');
test('./test-listeners.html');
test('./test-scratch.html');
