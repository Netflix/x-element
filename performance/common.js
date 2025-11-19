// TODO: Test array / map bindings.

export default class CommonTest {
  /*****************************************************************************
   ** Test Interface ***********************************************************
   ****************************************************************************/

  static get id() { throw new Error('Not Implemented.'); }

  static injectContext = {};
  static injectSetup() { throw new Error('Not Implemented.'); }
  static injectRun() { throw new Error('Not Implemented.'); }
  static async injectTest() {
    const test = this;
    const name = 'inject';
    const setup = test.injectSetup.bind(test);
    const run = test.injectRun.bind(test);
    return await CommonTest.#test(test, name, setup, run);
  }

  static initialContext = {};
  static initialSetup() { throw new Error('Not Implemented.'); }
  static initialRun() { throw new Error('Not Implemented.'); }
  static async initialTest() {
    const test = this;
    const name = 'initial';
    const setup = test.initialSetup.bind(test);
    const run = test.initialRun.bind(test);
    return await CommonTest.#test(test, name, setup, run);
  }

  static updateContext = {};
  static updateSetup() { throw new Error('Not Implemented.'); }
  static updateRun() { throw new Error('Not Implemented.'); }
  static async updateTest() {
    const test = this;
    const name = 'update';
    const setup = test.updateSetup.bind(test);
    const run = test.updateRun.bind(test);
    return await CommonTest.#test(test, name, setup, run);
  }

  static properties = [
    {
      attr: '123',
      one: 1,
      two: 2,
      three: 'three',
      four: 'four',
      five: 5,
      six: true,
      seven: false,
      eight: 8,
      nine: 'nine',
      ten: '10',
      id: 'foo',
      hidden: false,
      title: 'test',
      content1: 'AAA',
      content2: 'BBB',
      items: [{ text: 'one' }, { text: 'two' }, { text: 'three' }],
    },
    {
      attr: '456',
      one: 1,
      two: 2,
      three: 3,
      four: 'four',
      five: 5,
      six: '6',
      seven: false,
      eight: 8,
      nine: 9,
      ten: 10_000,
      id: 'bar',
      hidden: false, 
      title: 'test',
      content1: 'ZZZ',
      content2: 'BBB',
      items: [{ text: 'one' }, { text: 'two' }, { text: 'three' }, { text: 'four' }, { text: 'five' }, { text: 'six' }],
    },
  ];

  static {
    let count = 0;
    CommonTest.getProperties = () => {
      return CommonTest.properties[count++ % 2];
    };
  }

  static async initialize() {
    const { promise, resolve, reject } = Promise.withResolvers();
    setTimeout(() => reject(new Error('Timed out.')), 5_000);
    window.addEventListener('message', event => {
      if (event.data?.type === 'ping') {
        resolve(event.ports[0]);
      }
    }, { once: true });

    const port2 = await promise;
    port2.start();
    port2.postMessage({ type: 'pong' });
    port2.addEventListener('message', async event => {
      if (event.data?.type === 'start') {
        const test = new URL(location.href).searchParams.get('test');
        switch (test) {
          case 'inject': {
            const result = await this.injectTest();
            port2.postMessage({ type: 'result', result });
            break;
          }
          case 'initial': {
            const result = await this.initialTest();
            port2.postMessage({ type: 'result', result });
            break;
          }
          case 'update': {
            const result = await this.updateTest();
            port2.postMessage({ type: 'result', result });
            break;
          }
          default:
            throw new Error(`Unexpected test "${test}".`);
        }
        setTimeout(() => {
          port2.postMessage({ type: 'result', result: test });
        }, 5_000);
      }
    });
  }

  /*****************************************************************************
   ** Internal Interface *******************************************************
   ****************************************************************************/

  static #targetAnimationFrames = (() => {
    const url = new URL(location.href);
    if (url.searchParams.has('frames')) {
      const param = url.searchParams.get('frames');
      if (!/^[1-9]\d*$/.test(param)) {
        throw new Error(`frames must be a positive integer >= 1, got: ${param}`);
      }
      return Number.parseInt(param, 10);
    }
    return 500; // At ~16ms per frame, this is ~8 seconds per test, per engine.
  })();
  static #tests = [];

  // TODO: The math for the lowIndex / highIndex might be off ever-so-slightly.
  //  Might be worth it to look it up in a stats book if we need to be more
  //  precise there.
  static #percentile(percentile, numbers) {
    if (numbers.length === 0) {
      return null;
    }
    numbers = numbers.toSorted();
    if (percentile === 0) {
      return numbers[0];
    } else if (percentile === 100) {
      return numbers[numbers.length - 1];
    } else {
      const position = (percentile / 100) * (numbers.length - 1);
      const lowIndex = Math.floor(position);
      const highIndex = Math.ceil(position);

      // Ensure indices are valid.
      if (lowIndex >= numbers.length) {
        return numbers[numbers.length - 1];
      }
      if (highIndex >= numbers.length) {
        return numbers[numbers.length - 1];
      }

      const low = numbers[lowIndex];
      const high = numbers[highIndex];
      if (low === undefined || high === undefined) {
        return null;
      }

      // Interpolate between the two values.
      const fraction = position - lowIndex;
      return low + fraction * (high - low);
    }
  }

  static async #waitAFrame() {
    const url = new URL(location.href);
    const timing = url.searchParams.has('timing') ? url.searchParams.get('timing') : 'raf';
    switch (timing) {
      case 'raf':
        await new Promise(resolve => requestAnimationFrame(resolve));
        break;
      case 'fixed':
        await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
        break;
      default:
        throw new Error(`Invalid timing mode: ${timing}. Use 'raf' or 'fixed'.`);
    }
  }

  static async #jitWarmup(run, batch) {
    // JIT warmup: Run the function multiple times to ensure JIT compilation.
    //  This stabilizes performance by ensuring code is optimized before the
    //  actual measurements are performed.
    const warmupIterations = Math.min(batch * 10, 1000);
    for (let iii = 0; iii < warmupIterations; iii++) {
      run();
    }
    await new Promise(resolve => setTimeout(resolve, 10)); // Allow JIT compilation to settle.
  }

  static async #measureSingleFrame(run, batch) {
    // Take a single clean measurement for this frame.
    const t0 = performance.now();
    for (let jjj = 0; jjj < batch; jjj++) {
      run();
    }
    const t1 = performance.now();
    return (t1 - t0) / batch;
  }

  static #removeOutliers(data) {
    if (data.length < 4) {
      return [...data]; // Need at least 4 points for IQR
    }
    const sorted = [...data].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;

    // Standard IQR outlier detection: beyond 1.5 * IQR from quartiles
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return data.filter(value => value >= lowerBound && value <= upperBound);
  }

  // This assumes we have ~16ms per frame (i.e., ~60Hz refresh).
  static #getBatch(name, run) {
    const count = name === 'update' ? 1000 : 200;
    const t0 = performance.now();
    for (let iii = 0; iii < count; iii++) {
      run();
    }
    const t1 = performance.now();
    const estimate = (t1 - t0) / count;
    const batch = Math.ceil(16 / estimate * 3 / 4); // Shoot for a 3/4 duty cycle.
    return batch;
  }

  static async #test(test, name, setup, run) {
    const label = document.createElement('div');
    label.textContent = `${test.id} | ${name}`;
    const progress = document.createElement('progress');
    document.body.append(label, progress);

    // Setup phase.
    await setup();
    const batch = CommonTest.#getBatch(name, run);

    // JIT warmup phase to stabilize performance.
    await CommonTest.#jitWarmup(run, batch);

    // Force GC before measurements if available.
    if (typeof window.gc === 'function') {
      window.gc();
      await new Promise(resolve => setTimeout(resolve, 50)); // Allow GC to complete.
    }

    const results = [];
    progress.max = batch * CommonTest.#targetAnimationFrames;
    progress.value = 0;

    for (let iii = 0; iii < CommonTest.#targetAnimationFrames; iii++) {
      await CommonTest.#waitAFrame();
      const measurement = await CommonTest.#measureSingleFrame(run, batch);
      results.push(measurement);
      progress.value = (iii + 1) * batch;
    }

    // Remove statistical outliers using Interquartile Range (IQR) method.
    const cleanedResults = CommonTest.#removeOutliers(results);

    const percentiles = {};
    for (const percentile of [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) {
      percentiles[percentile] = CommonTest.#percentile(percentile, cleanedResults);
    }
    CommonTest.#tests.push({ test, name, results: cleanedResults, percentiles });
    return { id: test.id, name, percentiles };
  }
}

// The default templating engine, lit-html, and uhtml can all share common
//  fixtures because they have enough overlap in their interfaces. If we need to
//  do more complex testing, we may need to break this out into each test class.
export class HtmlLiteralInterface {
  // The browser will optimize “strings” here to return the same actual reference.
  static getResult(html, properties) {
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2 } = properties;
    return html`
      <div data-id="p1" attr="${attr}">
        <div data-id="p2" data-foo one="${one}" two="${two}" three="${three}" four="${four}" five="${five}" .six="${six}" .seven="${seven}" .eight="${eight}" .nine="${nine}" .ten="${ten}">
          <div data-id="p3" data-bar="bar">
            <div data-id="${id}" boolean ?hidden="${hidden}" .title="${title}">
              ${content1} -- ${content2}
            </div>
          </div>
        </div>
        <div class="extra">
          <p>
            Just something a little <em>extra</em> at the end!
          </p>
          <p>
            There are no more interpolations, so this ought to just get skipped.
          </p>
        </div>
      </div>
    `;
  }

  // We can get around the optimization by using eval though!
  static getResultEval(html, properties) {
    // eslint-disable-next-line no-unused-vars
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2, items } = properties;
    // eslint-disable-next-line no-eval
    return eval(`html\`<div data-id="p1" attr="\${attr}">
      <div data-id="p2" data-foo one="\${one}" two="\${two}" three="\${three}" four="\${four}" five="\${five}" .six="\${six}" .seven="\${seven}" .eight="\${eight}" .nine="\${nine}" .ten="\${ten}">
        <div data-id="p3" data-bar="bar">
          <div data-id="\${id}" boolean ?hidden="\${hidden}" .title="\${title}">
            \${content1} -- \${content2}
          </div>
          <ul data-id="list">
            \${(items ?? []).map(item => {
              return html\`<li>\${item.text}</li>\`;
            })}
          </ul>
        </div>
      </div>
      <div class="extra">
        <p>
          Just something a little <em>extra</em> at the end!
        </p>
        <p>
          There are no more interpolations, so this ought to just get skipped.
        </p>
      </div>
    </div>\``);
  }
}
