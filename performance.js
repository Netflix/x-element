#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const DEFAULT_OPTIONS = {
  frames: 100,
  timing: 'fixed',
  skip: [],
  profile: false,
  suffix: '',
  headless: false,
  screenshot: false,
  viewport: '616x800',
};

const HELP = `
Usage: node performance.js [options]

Options:
  --frames=<number>    Number of animation frames to run (default: 100)
                       Note: Use 200+ frames for reliable optimization measurements.
                       Lower values (5-20) are useful for quick sanity checks.
  --timing=<mode>      Timing mode: 'raf' or 'fixed' (default: 'fixed')
  --skip=<group>       Skip test group: 'inject', 'initial', or 'update' (can be used multiple times)
  --profile=true       Enable performance profiling with Chrome DevTools
  --suffix=<string>    File suffix for output files (default: none)
                       Examples: --suffix=before, --suffix=optimized
  --headless=true      Run in headless mode (default: false, shows browser)
  --screenshot=true    Save screenshot after tests complete (default: false)
  --viewport=WxH       Set browser viewport size (default: 616x800)
                       Examples: --viewport=1920x1080, --viewport=800x600
  --help               Show this help message

Examples:
  node performance.js --frames=5           # Quick sanity check
  node performance.js --frames=200         # Reliable optimization testing
  node performance.js --frames=50 --timing=raf
  node performance.js --skip=inject --skip=initial
  node performance.js --profile=true
  node performance.js --suffix=before      # Saves to performance-before.json
  node performance.js --suffix=optimized   # Saves to performance-optimized.json
  node performance.js --headless=true      # Run without visible browser
  node performance.js --screenshot=true    # Save screenshot for record keeping
  node performance.js --viewport=1920x1080 # High resolution viewport and screenshot

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
    } else if (arg.startsWith('--timing=')) {
      options.timing = arg.split('=')[1];
    } else if (arg.startsWith('--skip=')) {
      options.skip.push(arg.split('=')[1]);
    } else if (arg.startsWith('--suffix=')) {
      options.suffix = arg.split('=')[1];
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
    } else if (arg.startsWith('--headless=')) {
      const value = arg.split('=')[1];
      if (value === 'true') {
        options.headless = true;
      } else if (value === 'false') {
        options.headless = false;
      } else {
        console.error(`Invalid headless value: ${value}. Must be "true" or "false".`); // eslint-disable-line no-console
        process.exit(1);
      }
    } else if (arg.startsWith('--screenshot=')) {
      const value = arg.split('=')[1];
      if (value === 'true') {
        options.screenshot = true;
      } else if (value === 'false') {
        options.screenshot = false;
      } else {
        console.error(`Invalid screenshot value: ${value}. Must be "true" or "false".`); // eslint-disable-line no-console
        process.exit(1);
      }
    } else if (arg.startsWith('--viewport=')) {
      const viewport = arg.split('=')[1];
      if (!/^\d+x\d+$/.test(viewport)) {
        console.error(`Invalid viewport format: ${viewport}. Must be WIDTHxHEIGHT (e.g., 1920x1080).`); // eslint-disable-line no-console
        process.exit(1);
      }
      options.viewport = viewport;
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
  const suffix = options.suffix ? `-${options.suffix}` : '';
  const resultsFile = path.join(performanceDir, `performance${suffix}.json`);
  const profileFile = path.join(performanceDir, `performance-profile${suffix}.json`);
  if (fs.existsSync(resultsFile)) {
    fs.unlinkSync(resultsFile);
  }
  if (fs.existsSync(profileFile)) {
    fs.unlinkSync(profileFile);
  }

  const browser = await puppeteer.launch({ 
    headless: options.headless,
    timeout: 10000,
    args: [
      '--no-sandbox',                                     // Required for CI/CD environments
      '--disable-setuid-sandbox',                         // Disable setuid sandbox for compatibility
      '--disable-background-timer-throttling',            // Prevent background throttling
      '--disable-renderer-backgrounding',                 // Keep renderer priority high
      '--disable-backgrounding-occluded-windows',         // Prevent window throttling
      '--disable-web-security',                           // Reduce security overhead
      '--disable-features=TranslateUI',                   // Disable translate features
      '--disable-dev-shm-usage',                          // Use /tmp instead of /dev/shm
      '--memory-pressure-off',                            // Disable memory pressure signals
      '--js-flags=--max-old-space-size=8192 --expose-gc', // Control heap and expose window.gc()
    ],
  });
  try {
    const page = await browser.newPage();

    // Set viewport size
    const [width, height] = options.viewport.split('x').map(Number);
    await page.setViewport({ width, height });

    // Configure page for stable performance testing
    await page.setCacheEnabled(false);
    await page.setJavaScriptEnabled(true);

    // Build URL with query parameters
    const params = new URLSearchParams();
    params.set('frames', options.frames.toString());
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
        path: `performance/performance-profile${suffix}.json`,
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
      fs.writeFileSync(resultsFile, JSON.stringify(performanceResults, null, 2));
    }

    // Take screenshot if requested
    if (options.screenshot) {
      if (!fs.existsSync(performanceDir)) {
        fs.mkdirSync(performanceDir, { recursive: true });
      }
      const screenshotFile = path.join(performanceDir, `performance-screenshot${suffix}.png`);
      await page.screenshot({ path: screenshotFile, fullPage: true, type: 'png' });
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
