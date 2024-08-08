## Testing locally

The test runner leverages [x-test](https://github.com/Netflix/x-test) and [puppeteer](https://pptr.dev). At this time this is done in two processes:

```
# serve the source (long running process)
npm start

# run the suite and exit
npm test
```

Test output is recorded in the [TAP format](https://testanything.org).
