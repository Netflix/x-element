## Testing locally

The test runner leverages [x-test](https://github.com/Netflix/x-test),
[x-test-cli](https://github.com/Netflix/x-test-cli), and
[puppeteer](https://pptr.dev). Testing is done in two processes:

```bash
# serve the source (long running process)
npm start

# run the suite and exit
npm test
```

Test output is recorded in the [TAP format](https://testanything.org).

## Running specific tests

You can filter tests by name using the `--test-name` argument:

```bash
# Run all tests matching a regex pattern
npm test -- --test-name="basic"

# Run tests from a specific test suite
npm test -- --test-name="computed properties"
```

The `--test-name` argument accepts a regex pattern that will be matched against
test names.
