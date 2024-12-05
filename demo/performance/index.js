class RootTest {
  static #tests = [];

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

  static #printOutput(name) {
    const output = document.getElementById(name).querySelector('.output');
    output.replaceChildren();
    const tests = RootTest.#tests.filter(candidate => candidate.name === name);
    // We only show 20-80 percentiles to ditch some outliers.
    const min = Math.min(...tests.filter(({ skip }) => !skip).map(({ percentiles }) => percentiles[20]));
    const max = Math.max(...tests.filter(({ skip }) => !skip).map(({ percentiles }) => percentiles[80]));
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

await RootTest.test('./default.html?test=inject');
await RootTest.test('./lit-html.html?test=inject');
await RootTest.test('./uhtml.html?test=inject');
await RootTest.skip('./react.html?test=inject', 'React does interpretation during compilation.');

await RootTest.test('./default.html?test=initial');
await RootTest.test('./lit-html.html?test=initial');
await RootTest.test('./uhtml.html?test=initial');
await RootTest.test('./react.html?test=initial');

await RootTest.test('./default.html?test=update');
await RootTest.test('./lit-html.html?test=update');
await RootTest.test('./uhtml.html?test=update');
await RootTest.test('./react.html?test=update');
