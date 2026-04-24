export default {
  url:      'http://127.0.0.1:8080/test/',
  client:   'puppeteer',
  browser:  'chromium',
  coverage: true,
  coverageGoals: {
    './x-element.js':  { lines: 100 },
    './x-parser.js':   { lines: 100 },
    './x-template.js': { lines: 100 },
  },
};
