#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const DEFAULT_OPTIONS = {
  frames: 100,
  skip: [],
  profile: false,
  prefix: '',
  headless: false,
  screenshot: false,
  viewport: '616x800',
  fixInject: null,
  fixInitial: null,
  fixUpdate: null,
  throttling: 8,
};

const HELP = `
Usage: node performance.js [options]

Options:
  --frames=<number>     Number of animation frames to run (default: 100)
                        Note: Use 200+ frames for reliable optimization measurements.
                        Lower values (5-20) are useful for quick sanity checks.
  --skip=<item>         Skip test group ('inject', 'initial', 'update')
                        Skip library ('default', 'lit-html', 'uhtml', 'react')
                        Can be used multiple times.
                        Examples: --skip=react, --skip=inject
  --profile=true        Enable performance profiling with Chrome DevTools
  --prefix=<string>     File prefix for output files (default: none)
                        Examples: --prefix=baseline, --prefix=optimized
  --headless=true       Run in headless mode (default: false, shows browser)
  --screenshot=true     Save screenshot after tests complete (default: false)
  --viewport=WxH        Set browser viewport size (default: 616x800)
                        Examples: --viewport=1920x1080, --viewport=800x600
  --fix-inject=min-max  Fix inject visualization range in microseconds
                        Example: --fix-inject=55-65
  --fix-initial=min-max Fix initial visualization range in microseconds
                        Example: --fix-initial=5-7
  --fix-update=min-max  Fix update visualization range in microseconds
                        Example: --fix-update=0.6-0.8
  --throttling=<number> CPU throttling rate (default: 8, high throttling)
                        Example: --throttling=1 (no throttling)
  --help                Show this help message

Examples:
  node performance.js --frames=5                    # Quick sanity check
  node performance.js --frames=200                  # Reliable optimization testing
  node performance.js --skip=inject --skip=initial
  node performance.js --skip=react --skip=lit-html  # Skip specific libraries
  node performance.js --profile=true
  node performance.js --prefix=baseline             # Saves to baseline-performance.json
  node performance.js --prefix=optimized            # Saves to optimized-performance.json
  node performance.js --headless=true               # Run without visible browser
  node performance.js --screenshot=true             # Save screenshot for record keeping
  node performance.js --viewport=1920x1080          # High resolution viewport and screenshot
  node performance.js --fix-inject=55-65            # Fixed visualization range for inject
  node performance.js --fix-initial=5-7             # Fixed visualization range for initial
  node performance.js --fix-update=0.6-0.8          # Fixed visualization range for update

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
    } else if (arg.startsWith('--skip=')) {
      options.skip.push(arg.split('=')[1]);
    } else if (arg.startsWith('--prefix=')) {
      options.prefix = arg.split('=')[1];
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
    } else if (arg.startsWith('--fix-inject=')) {
      const range = arg.split('=')[1];
      if (!/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(range)) {
        console.error(`Invalid fix-inject format: ${range}. Must be min-max (e.g., 55-65).`); // eslint-disable-line no-console
        process.exit(1);
      }
      options.fixInject = range;
    } else if (arg.startsWith('--fix-initial=')) {
      const range = arg.split('=')[1];
      if (!/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(range)) {
        console.error(`Invalid fix-initial format: ${range}. Must be min-max (e.g., 5-7).`); // eslint-disable-line no-console
        process.exit(1);
      }
      options.fixInitial = range;
    } else if (arg.startsWith('--fix-update=')) {
      const range = arg.split('=')[1];
      if (!/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(range)) {
        console.error(`Invalid fix-update format: ${range}. Must be min-max (e.g., 0.6-0.8).`); // eslint-disable-line no-console
        process.exit(1);
      }
      options.fixUpdate = range;
    } else if (arg.startsWith('--throttling=')) {
      const rate = parseFloat(arg.split('=')[1]);
      if (isNaN(rate) || rate < 1) {
        console.error(`Invalid throttling: ${arg.split('=')[1]}. Must be a number >= 1.`); // eslint-disable-line no-console
        process.exit(1);
      }
      options.throttling = rate;
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
  const resultsDir = path.join('performance', 'results');
  const prefix = options.prefix ? `${options.prefix}-` : '';
  const resultsFile = path.join(resultsDir, `${prefix}performance.json`);
  const oldProfileFile = path.join(resultsDir, `${prefix}performance-profile.json`);
  const cpuProfileFile = path.join(resultsDir, `${prefix}performance-profile.cpuprofile`);
  const profileSummaryFile = path.join(resultsDir, `${prefix}performance-profile-summary.txt`);
  
  // Ensure results directory exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Clean up any existing files that will be regenerated
  const filesToCleanup = [resultsFile, oldProfileFile, cpuProfileFile, profileSummaryFile];
  filesToCleanup.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });

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
      '--run-all-compositor-stages-before-draw',          // Force full render pipeline each frame
      '--js-flags=--max-old-space-size=8192 --expose-gc', // Control heap and expose window.gc()
    ],
  });
  try {
    const page = await browser.newPage();

    // Set viewport size
    const [width, height] = options.viewport.split('x').map(Number);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });

    // Configure page for stable performance testing
    await page.setCacheEnabled(false);
    await page.setJavaScriptEnabled(true);

    // Build URL with query parameters
    const params = new URLSearchParams();
    params.set('frames', options.frames.toString());
    for (const skip of options.skip) {
      params.append('skip', skip);
    }

    // Add profile parameter when profiling is enabled
    if (options.profile) {
      params.set('profile', 'true');
    }

    // Add fixed range parameters when provided
    if (options.fixInject) {
      params.set('fixInject', options.fixInject);
    }
    if (options.fixInitial) {
      params.set('fixInitial', options.fixInitial);
    }
    if (options.fixUpdate) {
      params.set('fixUpdate', options.fixUpdate);
    }

    const url = `http://localhost:8080/performance/?${params.toString()}`;

   const cdpSession = await page.createCDPSession();

    // Fixed CPU throttle if requested.
    await cdpSession.send('Emulation.setCPUThrottlingRate', { rate: options.throttling });

    // Enable CPU profiling if requested.
    if (options.profile) {
      // Connect to Chrome DevTools Protocol.
      await cdpSession.send('Profiler.enable');
      await cdpSession.send('Profiler.start');
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

    // Stop CPU profiling if enabled and save profile
    if (options.profile) {
      const profile = await cdpSession.send('Profiler.stop');

      // Save raw CPU profile
      fs.writeFileSync(cpuProfileFile, JSON.stringify(profile.profile));

      // Generate human-readable summary
      const hotspots = profile.profile.nodes.filter(node => node.hitCount > 0);
      hotspots.sort((a, b) => b.hitCount - a.hitCount);

      let summary = '=== CPU PROFILE HOTSPOTS ===\n';
      summary += 'HitCount | Function | File:Line\n';
      summary += '---------|----------|----------\n';

      hotspots.slice(0, 20).forEach(node => {
        const frame = node.callFrame;
        const fileName = frame.url ? frame.url.split('/').pop() : 'native';
        const location = frame.url ? `${fileName}:${frame.lineNumber}` : 'native';
        const functionName = frame.functionName || '(anonymous)';
        summary += `${node.hitCount.toString().padStart(8)} | ${functionName.padEnd(30)} | ${location}\n`;
      });

      summary += '\n=== X-ELEMENT SPECIFIC HOTSPOTS ===\n';
      const xElementHotspots = hotspots.filter(node => 
        node.callFrame.url && (
          node.callFrame.url.includes('x-parser.js') || 
          node.callFrame.url.includes('x-template.js')
        )
      );

      xElementHotspots.forEach(node => {
        const frame = node.callFrame;
        const fileName = frame.url.split('/').pop();
        const functionName = frame.functionName || '(anonymous)';
        summary += `${node.hitCount.toString().padStart(8)} | ${functionName.padEnd(30)} | ${fileName}:${frame.lineNumber}\n`;
      });

      fs.writeFileSync(profileSummaryFile, summary);
    }

    // Save performance results to file
    if (performanceResults) {
      fs.writeFileSync(resultsFile, JSON.stringify(performanceResults, null, 2));
    }

    // Take screenshot if requested
    if (options.screenshot) {
      const screenshotFile = path.join(resultsDir, `${prefix}performance-screenshot.png`);
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
