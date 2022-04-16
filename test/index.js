import { test, cover } from './x-test.js';

// We import this here so we can see code coverage.
import '../x-element.js';

// Set a high bar for code coverage!
cover(new URL('../x-element.js', import.meta.url).href, 100);

test('./test-analysis-errors.html');
test('./test-initialization-errors.html');
test('./test-attribute-changed-errors.html');
test('./test-element-upgrade.html');
test('./test-template-engine.html');
test('./test-render.html');
test('./test-render-root.html');
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
