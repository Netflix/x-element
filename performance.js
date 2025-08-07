#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const DEFAULT_OPTIONS = {
  frames: 100,
  delay: 1000,
  timing: 'fixed',
  skip: [],
  profile: false,
};

const HELP = `
Usage: node performance.js [options]

Options:
  --frames=<number>    Number of animation frames to run (default: 100)
  --delay=<number>     Delay between test phases in ms (default: 1000)
  --timing=<mode>      Timing mode: 'raf' or 'fixed' (default: 'fixed')
  --skip=<group>       Skip test group: 'inject', 'initial', or 'update' (can be used multiple times)
  --profile=true       Enable performance profiling with Chrome DevTools
  --help               Show this help message

Examples:
  node performance.js
  node performance.js --frames=50 --timing=raf
  node performance.js --skip=inject --skip=initial
  node performance.js --profile=true

Note: Server must be running on localhost:8080 (use 'npm start')
`;

/**
 * Parse command line arguments.
 * @returns {object} Parsed options
 */
function parseArgs() {
  const options = { ...DEFAULT_OPTIONS };
  const args = process.argv.slice(2);
  for (const arg of args) {
    if (arg === '--help') {
      console.log(HELP); // eslint-disable-line no-console
      process.exit(0);
    }
    if (arg.startsWith('--frames=')) {
      options.frames = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--delay=')) {
      options.delay = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--timing=')) {
      options.timing = arg.split('=')[1];
    } else if (arg.startsWith('--skip=')) {
      options.skip.push(arg.split('=')[1]);
    } else if (arg.startsWith('--profile=')) {
      const value = arg.split('=')[1];
      if (value === 'true') {
        options.profile = true;
      } else if (value === 'false') {
        options.profile = false;
      } else {
        console.error(`Invalid profile value: ${value}. Must be "true" or "false".`); // eslint-disable-line no-console
        process.exit(1);
      }
    }
  }
  return options;
}

/**
 * Run performance tests using puppeteer.
 * @param {object} options - Test configuration options
 */
async function runPerformanceTests(options) {
  // Clean up any existing result files to ensure fresh results
  const performanceDir = 'performance';
  const resultsFile = path.join(performanceDir, 'performance.json');
  const profileFile = path.join(performanceDir, 'performance-profile.json');
  if (fs.existsSync(resultsFile)) {
    fs.unlinkSync(resultsFile);
  }
  if (fs.existsSync(profileFile)) {
    fs.unlinkSync(profileFile);
  }

  const browser = await puppeteer.launch({ 
    headless: true,
    timeout: 10000,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();

    // Build URL with query parameters
    const params = new URLSearchParams();
    params.set('frames', options.frames.toString());
    params.set('delay', options.delay.toString());
    params.set('timing', options.timing);
    for (const skip of options.skip) {
      params.append('skip', skip);
    }

    // Add profile parameter when profiling is enabled
    if (options.profile) {
      params.set('profile', 'true');
    }

    const url = `http://localhost:8080/performance/?${params.toString()}`;

    // Enable profiling if requested
    if (options.profile) {
      // Start tracing with comprehensive categories
      await page.tracing.start({
        path: 'performance/performance-profile.json',
        categories: [
          'devtools.timeline',
          'v8.execute',
          'disabled-by-default-v8.cpu_profiler',
          'disabled-by-default-v8.cpu_profiler.hires',
        ],
      });
    }

    // Capture performance results and wait for completion
    let performanceResults = null;
    const { promise: completionPromise, resolve: resolveCompletion } = Promise.withResolvers();

    // Set overall timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Performance tests timed out after 180 seconds')), 180_000);
    });

    page.on('console', (msg) => {
      const text = msg.text();
      // Check if this is the performance JSON output
      if (text.startsWith('{') && (text.includes('"inject"') || text.includes('"initial"') || text.includes('"update"'))) {
        try {
          performanceResults = JSON.parse(text);
        } catch {
          // If parsing fails, just log it normally
          console.log(text); // eslint-disable-line no-console
        }
      } else if (text === '# Done') {
        resolveCompletion();
      } else {
        console.log(text); // eslint-disable-line no-console
      }
    });

    // Navigate and wait for tests to complete
    await page.goto(url);

    // Wait for tests to complete or timeout
    await Promise.race([completionPromise, timeoutPromise]);

    // Stop profiling if enabled
    if (options.profile) {
      await page.tracing.stop();
    }

    // Save performance results to file
    if (performanceResults) {
      if (!fs.existsSync(performanceDir)) {
        fs.mkdirSync(performanceDir, { recursive: true });
      }
      fs.writeFileSync('performance/performance.json', JSON.stringify(performanceResults, null, 2));
    }
  } finally {
    await browser.close();
  }
}

const options = parseArgs();
runPerformanceTests(options)
  .then(() => { process.exit(0); })
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
