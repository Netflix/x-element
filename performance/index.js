class RootTest {
  static #tests = [];

  static #buildUrl(href, testName) {
    const url = new URL(href, location.href);
    url.searchParams.set('test', testName);

    // Propagate performance config params if they exist in the current URL
    const currentUrl = new URL(location.href);
    if (currentUrl.searchParams.has('frames')) {
      url.searchParams.set('frames', currentUrl.searchParams.get('frames'));
    }
    if (currentUrl.searchParams.has('delay')) {
      url.searchParams.set('delay', currentUrl.searchParams.get('delay'));
    }
    if (currentUrl.searchParams.has('timing')) {
      url.searchParams.set('timing', currentUrl.searchParams.get('timing'));
    }
    return url.toString();
  }

  static async #load(frame, href) {
    const { promise, resolve, reject } = Promise.withResolvers();
    setTimeout(() => reject(new Error('Timed out.')), 5_000);
    const { port1, port2} = new MessageChannel();
    port1.addEventListener('message', event => {
      if (event.data?.type === 'pong') {
        resolve();
      }
    }, { once: true });
    port1.start(); // Needed for use with addEventListener.

    frame.src = href;
    frame.setAttribute('data-running', '');
    frame.addEventListener('load', () => {
      frame.contentWindow.postMessage({ type: 'ping' }, '*', [port2]);
    }, { once: true });
    document.body.append(frame);

    await promise;
    return port1;
  }

  static #getMicrosecondsText(microseconds) {
    if (microseconds >= 10) {
      return `${microseconds.toFixed()} µs`;
    } else if (microseconds >= 1) {
      return `${microseconds.toFixed(1)} µs`;
    } else {
      return `${microseconds.toFixed(2)} µs`;
    }
  }

  // Print percentiles (by ten).
  static #printDistribution(container, percentiles, min, max) {
    const fragment = new DocumentFragment();
    for (const percentile of [20, 30, 40, 50, 60, 70, 80]) {
      const value = percentiles[percentile];
      const percent = (value - min) / (max - min) * 100;
      const element = document.createElement('div');
      element.classList.add('percentile');
      if (percentile === 50) {
        element.classList.add('median');
      }
      element.style.left = `${percent}%`;
      if (percent < 0 || percent > 100) {
        element.classList.add('overflow');
      }
      element.textContent = '•';
      fragment.append(element);
    }
    const minElement = document.createElement('div');
    minElement.classList.add('min');
    minElement.textContent = RootTest.#getMicrosecondsText(min * 1_000);
    const maxElement = document.createElement('div');
    maxElement.classList.add('max');
    maxElement.textContent = RootTest.#getMicrosecondsText(max * 1_000);
    fragment.append(minElement, maxElement);
    container.style.position = 'relative';
    container.replaceChildren(fragment);
  }

  static #roundToSigFigs(num, sigFigs = 3) {
    if (num === 0) {
      return 0;
    }
    const magnitude = Math.floor(Math.log10(Math.abs(num)));
    const factor = Math.pow(10, sigFigs - 1 - magnitude);
    return Math.round(num * factor) / factor;
  }

  static finalize() {
    RootTest.#outputResults();
  }
  
  static #outputResults() {
    const results = {};
    const groupNames = [...new Set(RootTest.#tests.map(test => test.name))];
    for (const groupName of groupNames) {
      const tests = RootTest.#tests.filter(test => test.name === groupName);
      results[groupName] = tests.map(test => {
        if (test.skip) {
          return {
            id: test.id,
            skipped: true,
            reason: test.reason,
          };
        } else {
          return {
            id: test.id,
            median_microseconds: RootTest.#roundToSigFigs(test.percentiles[50] * 1000),
            percentiles: Object.fromEntries(
              Object.entries(test.percentiles).map(([p, value]) => [p, RootTest.#roundToSigFigs(value * 1000)])
            ),
          };
        }
      });
    }
    console.log(JSON.stringify(results)); // eslint-disable-line no-console
    console.log('# Done'); // eslint-disable-line no-console
  }

  static #printOutput(name) {
    const output = document.getElementById(name).querySelector('.output');
    output.replaceChildren();
    const tests = RootTest.#tests.filter(candidate => candidate.name === name);

    // Check for fixed range parameters
    const url = new URL(location.href);
    const fixRangeParam = url.searchParams.get(`fix${name.charAt(0).toUpperCase() + name.slice(1)}`);

    let min, max;
    if (fixRangeParam) {
      // Use fixed range from URL parameter (convert microseconds to milliseconds)
      const [minMicros, maxMicros] = fixRangeParam.split('-').map(Number);
      min = minMicros / 1000;
      max = maxMicros / 1000;
    } else {
      // Use dynamic range based on test results (20-80 percentiles to ditch outliers)
      min = Math.min(...tests.filter(({ skip }) => !skip).map(({ percentiles }) => percentiles[20]));
      max = Math.max(...tests.filter(({ skip }) => !skip).map(({ percentiles }) => percentiles[80]));
    }

    for (const { id, percentiles, skip, reason } of tests) {
      const container = document.createElement('div');
      container.classList.add('distribution');
      if (skip) {
        container.setAttribute('data-skipped', '');
      }
      const left = document.createElement('div');
      left.classList.add('left');
      const right = document.createElement('div');
      right.classList.add('right');
      if (!skip) {
        const inner = document.createElement('div');
        RootTest.#printDistribution(inner, percentiles, min, max);
        right.append(inner);
      } else {
        right.textContent = reason;
      }
      if (!skip) {
        const label = document.createElement('div');
        label.textContent = id.padEnd(15, '\u00A0');
        const median = percentiles[50];
        const value = document.createElement('div');
        value.textContent = RootTest.#getMicrosecondsText(median * 1_000).padStart(7, '\u00A0');
        left.append(label, value);
      } else {
        const label = document.createElement('div');
        label.textContent = id.padEnd(15, '\u00A0');
        const value = document.createElement('div');
        value.textContent = 'N/A'.padStart(7, '\u00A0');
        left.append(label, value);
      }
      container.append(left, right);
      output.append(container);
    }
  }

  static async testGroup(name, testConfigs) {
    // Check if this group should be skipped via query parameter
    const url = new URL(location.href);
    const skipItems = url.searchParams.getAll('skip');
    const validGroups = ['inject', 'initial', 'update'];
    const validLibraries = ['default', 'lit-html', 'uhtml', 'react'];

    // Validate skip parameters
    for (const skipItem of skipItems) {
      if (!validGroups.includes(skipItem) && !validLibraries.includes(skipItem)) {
        throw new Error(`Invalid skip item: ${skipItem}. Must be one of: ${[...validGroups, ...validLibraries].join(', ')}`);
      }
    }

    // Skip entire group if requested
    if (skipItems.includes(name)) {
      return;
    }

    // Run each test in the group, filtering out skipped libraries
    for (const config of testConfigs) {
      // Extract library name from href (e.g., './default.html' -> 'default')
      const libraryName = config.href.replace('./', '').replace('.html', '');
      if (config.skip) {
        RootTest.skip(RootTest.#buildUrl(config.href, name), config.skip);
      } else if (skipItems.includes(libraryName)) {
        RootTest.skip(RootTest.#buildUrl(config.href, name), `Skipped via --skip=${libraryName} parameter.`);
      } else {
        await RootTest.test(RootTest.#buildUrl(config.href, name));
      }
    }
  }

  static async test(href) {
    const frame = document.getElementById('frame');
    const port1 = await this.#load(frame, href);

    const { promise, resolve, reject } = Promise.withResolvers();
    setTimeout(() => reject(new Error('Timed out.')), 30_000);
    port1.addEventListener('message', event => {
      if (event.data?.type === 'result') {
        resolve(event.data.result);
      }
    });
    port1.postMessage({ type: 'start' });
    const { id, name, percentiles } = await promise;
    RootTest.#tests.push({ id, name, percentiles });
    RootTest.#printOutput(name);

    frame.removeAttribute('data-running');
  }

  static skip(href, reason) {
    const match = href.match(/(?<id>[a-z-]+)\.html\?test=(?<name>[a-z]+)/);
    const { id, name } = match.groups;
    this.#tests.push({ id, name, skip: true, reason });
    this.#printOutput(name);
  }
}

// Check if profiling mode is enabled
const url = new URL(location.href);
const profile = url.searchParams.has('profile') && url.searchParams.get('profile') === 'true';

if (profile) {
  // In profile mode, only run default tests
  await RootTest.testGroup('inject', [{ href: './default/index.html' }]);
  await RootTest.testGroup('initial', [{ href: './default/index.html' }]);
  await RootTest.testGroup('update', [{ href: './default/index.html' }]);
} else {
  // Normal mode - run all tests
  await RootTest.testGroup('inject', [
    { href: './default/index.html' },
    { href: './lit-html/index.html' },
    { href: './uhtml/index.html' },
    { href: './react/index.html', skip: 'React does interpretation during compilation.' },
  ]);
  await RootTest.testGroup('initial', [
    { href: './default/index.html' },
    { href: './lit-html/index.html' },
    { href: './uhtml/index.html' },
    { href: './react/index.html', skip: 'React 19+ currently hangs when performing this test.' },
  ]);
  await RootTest.testGroup('update', [
    { href: './default/index.html' },
    { href: './lit-html/index.html' },
    { href: './uhtml/index.html' },
    { href: './react/index.html' },
  ]);
}

RootTest.finalize();
