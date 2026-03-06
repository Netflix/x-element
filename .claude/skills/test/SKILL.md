---
name: test
description: Use when the user asks to run tests, check tests, verify tests
             pass, or after making code changes that should be validated. Runs
             unit tests either via CLI (puppeteer) or by visiting a test page
             in the browser via Chrome DevTools MCP.
---

# Unit Tests

Tests run in a real browser by loading a document (`test/test-parser.html`).
Pick the narrowest URL that covers the change.

- All tests: `http://localhost:8080/test/`
- One test: `http://localhost:8080/test/test-parser.html`

Output is [TAP v14](https://testanything.org/tap-version-14-specification.html).
Preserve it or summarize plainly ("5/5 passed"). No emojis or checkmarks.

## CLI

Running `npm test` invokes `@netflix/x-test-cli` via `test.sh`.
See `cd ui && npm test -- --help` for flags (URL, filtering, client). Examples:

```sh
npm test -- --url=http://localhost:8080/test/test-parser.html
npm test -- --name-pattern=parser
```

## MCP (Chrome DevTools)

Use this path to **debug** failures, not just check pass / fail — tests run
sequentially, each in its own iframe, so you can inspect live DOM, set
breakpoints, watch network, and evaluate in the failing test’s context. Navigate
to the test URL. Check the `x-test-reporter` singleton for completion.

```js
const reporter = document.querySelector('x-test-reporter');
const done = !reporter.hasAttribute('testing');
const passed = done && reporter.hasAttribute('ok');
```

## Writing tests

`@netflix/x-test` mirrors `node:test` + `node:assert/strict` — see its README
for the API. One x-test-specific constraint: tests must register
synchronously, so no top-level `await` in test modules. Start async setup as a
promise at module scope and `await` it inside each `test` callback.
