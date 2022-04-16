/* eslint-env node */
const puppeteer = require('puppeteer');

(async () => {
  try {
    // Open our browser.
    const browser = await puppeteer.launch({ timeout: 10000 });
    const page = await browser.newPage();

    // Starts to gather coverage information for JS and CSS files
    await page.coverage.startJSCoverage();

    // Before navigation, start mapping browser logs to stdout.
    page.on('console', message => console.log(message.text())); // eslint-disable-line no-console

    // Visit our test page.
    await page.goto('http://127.0.0.1:8080/test/?x-test-cover');

    // Wait to be signaled about the end of the test. Because the test may have
    // not started, already started, or already ended, ping for status.
    await page.evaluate(async () => {
      await new Promise(resolve => {
        const onMessage = evt => {
          const { type, data } = evt.data;
          if (type === 'x-test-ended' || (type === 'x-test-pong' && data.ended)) {
            top.removeEventListener('message', onMessage);
            resolve();
          }
        };
        top.addEventListener('message', onMessage);
        top.postMessage({ type: 'x-test-ping' }, '*');
      });
    });

    // Gather coverage information.
    const js = await page.coverage.stopJSCoverage();

    // Send coverage information to x-test and await test completion.
    await page.evaluate(async data => {
      await new Promise(resolve => {
        const onMessage = evt => {
          const { type } = evt.data;
          if (type === 'x-test-cover-ended') {
            top.removeEventListener('message', onMessage);
            resolve();
          }
        };
        top.addEventListener('message', onMessage);
        top.postMessage({ type: 'x-test-cover-start', data }, '*');
      });
    }, { js });

    // Close our browser.
    await browser.close();
  } catch (err) {
    // Ensure we exit with a non-zero code if anything fails (e.g., timeout).
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
})();
