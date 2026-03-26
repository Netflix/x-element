---
name: test
description: Use when the user asks to run tests, check tests, verify tests
             pass, or after making code changes that should be validated. Runs
             unit tests either via CLI (puppeteer) or in the browser via Chrome
             DevTools MCP.
---

# Unit Tests

Unit tests confirm that changes don't break things unexpectedly. Run targeted
subsets of the test suite when developing a particular feature.

## First Steps

Before running tests, verify the dev server is running on port 8080. Check if
http://localhost:8080/test/ is accessible. If the server doesn't respond, inform
the user that they need to start it (via `npm start`).

## Determining What to Test

Use conversation context to determine the appropriate test scope:

- **If user asks to run a test by name** (e.g., "run the 'click events' test"):
  Use filtering with the `--test-name` flag (CLI) or `?x-test-name=<pattern>`
  query param (MCP). The pattern should match the test description from the
  `it` block.

  Example: For a test like `it('handles click events', ...)`, use:
  - CLI: `x-test --client=puppeteer --url=http://localhost:8080/test/ --test-name="click events"`
  - MCP: `http://localhost:8080/test/?x-test-name=click+events`

  The pattern is a regex match, so partial matches work (e.g., "click events"
  will match "handles click events").

- **If working on a specific component**: Run only that component's tests

- **If no specific context**: Run all tests

Use judgment to pick the most targeted test scope for the situation.

## Two Approaches

There are two ways to run tests. Choose based on context:

### 1. CLI Approach (simpler, faster)

Run tests via puppeteer from the terminal. Best when:

- You just need a quick pass/fail check
- You don't need to visually inspect the UI
- You want TAP output directly in the terminal

**Commands:**

```bash
# Run all tests
x-test --client=puppeteer --url=http://localhost:8080/test/

# Run a specific test file
x-test --client=puppeteer --url=http://localhost:8080/test/path/to/file.html

# Filter to specific test cases
x-test --client=puppeteer --url=http://localhost:8080/test/ --test-name="pattern"
```

The CLI outputs TAP format directly and exits with code 1 on failure.

### 2. MCP Browser Approach (interactive, visual)

Run tests via Chrome DevTools MCP. Best when:

- You're already iterating with the browser open
- You need to visually inspect test behavior
- You want to interact with the test UI
- You're debugging a specific failure

**Requirements:** Dev server running on port 8080 (via `npm start`)

Navigate to:
- All tests: `http://localhost:8080/test/`
- Component tests: `http://localhost:8080/test/path/to/file.html`
- Filtered: append `?x-test-name=<pattern>`

## Test Hierarchy

Tests are hierarchical. Running all tests executes sub-tests in iframes. The
iframe src links are printed in the output, so navigating to that src runs only
that subtest in isolation.

## Detecting Test Completion (MCP only)

When using the MCP browser approach, there is a custom element called
`x-test-reporter` (a singleton on the test HTML page) with two boolean attributes:

- **`testing`**: Present while tests are running. Removed when tests complete.
- **`ok`**: Present if no tests have failed (yet). Removed on first failure.

To determine the final result, use JavaScript via Chrome DevTools MCP:

```javascript
const reporter = document.querySelector('x-test-reporter');
const done = !reporter.hasAttribute('testing');
const passed = reporter.hasAttribute('ok') && !reporter.hasAttribute('testing');
```

**Test is successful if and only if:** `hasAttribute('ok') && !hasAttribute('testing')`

Poll for `!hasAttribute('testing')` to know when tests have finished running.

## TAP Output

The test output follows the [TAP version 14 specification](https://testanything.org/tap-version-14-specification.html).
For CLI, TAP appears in stdout. For MCP, read console messages.

**Important:** Report test results using actual TAP format. Do not
"pretty print" with emojis or check marks. TAP is a plain text protocol.

### TAP Format Examples

**Passing tests:**
```tap
TAP version 14
ok 1 - renders with default props
ok 2 - handles click events
ok 3 - displays error state
1..3
```

**Failing tests:**
```tap
TAP version 14
ok 1 - renders with default props
not ok 2 - handles click events
  ---
  message: Expected button to be disabled
  severity: fail
  stack: |-
    Error: Expected button to be disabled
        at XTestSuite.assert (/.../x-test.js:1343:15)
        at assert (/.../x-test.js:5:48)
  ...
1..2
```

Note: x-test outputs the plan line (`1..N`) at the end, after all
tests complete.

**Key TAP elements:**
- `ok N - description` = test passed
- `not ok N - description` = test failed
- `1..N` = plan line indicating total test count
- `# Subtest: Name` = nested test suite
- YAML blocks (`---` to `...`) contain failure details

When reporting results to the user, preserve the TAP format or summarize
accurately (e.g., "5 tests passed" or "1 of 5 tests failed"). Do not invent
formatting that isn't in the output.

## Timeout

If tests take longer than ~60 seconds, something is likely broken. Check for
errors — common causes include:

- A sub-test HTML file doesn't exist
- A JavaScript import statement failed
- A network request is hanging

## Important: No Parallel Test Runs

Do NOT run multiple test suites in parallel (e.g., with `&`). When you need to
run tests across multiple files, prefer running the full test suite with
`--test-name` pattern matching to filter to the relevant tests, rather than
running individual test files one at a time.

## Post-Failure Behavior

Use judgment based on context:

- **If iterating on a feature**: Diagnose the failure and attempt to fix it.
- **Otherwise**: Just report the results to the user.
