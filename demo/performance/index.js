// TODO: Test array / map bindings.

class CommonTest {
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
    await CommonTest.#test(test, name, setup, run);
  }

  static initialContext = {};
  static initialSetup() { throw new Error('Not Implemented.'); }
  static initialRun() { throw new Error('Not Implemented.'); }
  static async initialTest() {
    const test = this;
    const name = 'initial';
    const setup = test.initialSetup.bind(test);
    const run = test.initialRun.bind(test);
    await CommonTest.#test(test, name, setup, run);
  }

  static updateContext = {};
  static updateSetup() { throw new Error('Not Implemented.'); }
  static updateRun() { throw new Error('Not Implemented.'); }
  static async updateTest() {
    const test = this;
    const name = 'update';
    const setup = test.updateSetup.bind(test);
    const run = test.updateRun.bind(test);
    await CommonTest.#test(test, name, setup, run);
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
    },
  ];

  static {
    let count = 0;
    CommonTest.getProperties = () => {
      return CommonTest.properties[count++ % 2];
    };
  }

  /*****************************************************************************
   ** Internal Interface *******************************************************
   ****************************************************************************/

  static #targetAnimationFrames = 500; // At ~16ms per frame, this is ~8 seconds per test, per engine.
  static #tests = [];

  // TODO: The math for the lowIndex / highIndex might be off ever-so-slightly.
  //  Might be worth it to look it up in a stats book if we need to be more
  //  precise there.
  static #percentile(percentile, numbers) {
    numbers = numbers.toSorted();
    if (percentile === 0) {
      return numbers[0];
    } else if (percentile === 100) {
      return numbers[numbers.length - 1];
    } else {
      const lowIndex = Math.floor(numbers.length / (100 / percentile));
      const highIndex = Math.ceil(numbers.length / (100 / percentile));
      const low = numbers[lowIndex];
      const high = numbers[highIndex];
      return (low + high) / 2;
    }
  }

  static async #waitAFrame() {
    await new Promise(resolve => requestAnimationFrame(resolve));
  }

  static async #waitAWhile() {
    await new Promise(resolve => setTimeout(resolve, 300));
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

  // Print 10-90 percentiles (by ten).
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
      element.textContent = '*';
      fragment.append(element);
    }
    const minElement = document.createElement('div');
    minElement.classList.add('min');
    minElement.textContent = CommonTest.#getMicrosecondsText(min * 1_000);
    const maxElement = document.createElement('div');
    maxElement.classList.add('max');
    maxElement.textContent = CommonTest.#getMicrosecondsText(max * 1_000);
    fragment.append(minElement, maxElement);
    container.style.position = 'relative';
    container.replaceChildren(fragment);
  }

  static #printOutput(name) {
    const output = document.getElementById(name).querySelector('.output');
    output.replaceChildren();
    const tests = CommonTest.#tests.filter(candidate => candidate.name === name);
    // We only show 10-90 percentiles to ditch some outliers.
    const min = Math.min(...tests.map(({ percentiles }) => percentiles[20]));
    const max = Math.max(...tests.map(({ percentiles }) => percentiles[80]));
    for (const { test, percentiles } of tests) {
      const container = document.createElement('div');
      container.classList.add('distribution');
      const left = document.createElement('div');
      left.classList.add('left');
      const right = document.createElement('div');
      right.classList.add('right');
      CommonTest.#printDistribution(right, percentiles, min, max);
      const label = document.createElement('div');
      label.textContent = test.id.padEnd(10, '\u00A0');
      const median = percentiles[50];
      const value = document.createElement('div');
      value.textContent = CommonTest.#getMicrosecondsText(median * 1_000).padStart(7, '\u00A0');
      left.append(label, value);
      container.append(left, right);
      output.append(container);
    }
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
    const batch = Math.ceil(16 / estimate * 1 / 2); // Shoot for a 1/2 duty cycle.
    return batch;
  }

  static async #test(test, name, setup, run) {
    await CommonTest.#waitAWhile();
    await setup();
    const batch = CommonTest.#getBatch(name, run);
    await CommonTest.#waitAWhile();
    const results = [];
    for (let iii = 0; iii < CommonTest.#targetAnimationFrames; iii++) {
      await CommonTest.#waitAFrame();
      const t0 = performance.now();
      for (let jjj = 0; jjj < batch; jjj++) {
        // Batch up actions — this is tuned to work within an animation frame.
        run();
      }
      const t1 = performance.now();
      results.push((t1 - t0) / batch);
    }
    const percentiles = {};
    for (const percentile of [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) {
      percentiles[percentile] = CommonTest.#percentile(percentile, results);
    }
    CommonTest.#tests.push({ test, name, results, percentiles });
    CommonTest.#printOutput(name);
  }
}

// The default templating engine, lit-html, and uhtml can all share common
//  fixtures because they have enough overlap in their interfaces. If we need to
//  do more complex testing, we may need to break this out into each test class.
class HtmlLiteralInterface {
  // The browser will optimize “strings” here to return the same actual reference.
  static getResult(html, properties) {
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2 } = properties;
    return html`<div data-id="p1" attr="${attr}">
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
  </div>`;
  }

  // We can get around the optimization by using eval though!
  static getResultEval(html, properties) {
    // eslint-disable-next-line no-unused-vars
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2 } = properties;
    // eslint-disable-next-line no-eval
    return eval(`html\`<div data-id="p1" attr="\${attr}">
      <div data-id="p2" data-foo one="\${one}" two="\${two}" three="\${three}" four="\${four}" five="\${five}" .six="\${six}" .seven="\${seven}" .eight="\${eight}" .nine="\${nine}" .ten="\${ten}">
        <div data-id="p3" data-bar="bar">
          <div data-id="\${id}" boolean ?hidden="\${hidden}" .title="\${title}">
            \${content1} -- \${content2}
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
    </div>\``);
  }
}

class DefaultTest extends CommonTest {
  static id = 'default';

  static async injectSetup() {
    const { default: XElement } = await import('../../x-element.js');
    const { render, html } = XElement.defaultTemplateEngine;
    const properties = this.properties[0];
    this.injectContext = { render, html, properties };
  }
  static injectRun() {
    const { render, html, properties } = this.injectContext;
    render(document.createElement('div'), HtmlLiteralInterface.getResultEval(html, properties));
  }

  static async initialSetup() {
    const { default: XElement } = await import('../../x-element.js');
    const { render, html } = XElement.defaultTemplateEngine;
    const properties = this.properties[0];
    this.initialContext = { render, html, properties };
  }
  static initialRun() {
    const { render, html, properties } = this.initialContext;
    render(document.createElement('div'), HtmlLiteralInterface.getResult(html, properties));
  }

  static async updateSetup() {
    const { default: XElement } = await import('../../x-element.js');
    const { render, html } = XElement.defaultTemplateEngine;
    const container = document.createElement('div');
    const getProperties = this.getProperties;
    render(container, HtmlLiteralInterface.getResult(html, getProperties()));
    this.updateContext = { render, html, container, getProperties };
  }
  static updateRun() {
    const { render, html, container, getProperties } = this.updateContext;
    render(container, HtmlLiteralInterface.getResult(html, getProperties()));
  }
}

class LitHtmlTest extends CommonTest {
  static id = 'lit-html';

  static async injectSetup() {
    const { render, html } = await import('lit-html');
    const properties = this.properties[0];
    this.injectContext = { render, html, properties };
  }
  static injectRun() {
    const { render, html, properties } = this.injectContext;
    render(HtmlLiteralInterface.getResultEval(html, properties), document.createElement('div'));
  }

  static async initialSetup() {
    const { render, html } = await import('lit-html');
    const properties = this.properties[0];
    this.initialContext = { render, html, properties };
  }
  static initialRun() {
    const { render, html, properties } = this.initialContext;
    render(HtmlLiteralInterface.getResult(html, properties), document.createElement('div'));
  }

  static async updateSetup() {
    const { render, html } = await import('lit-html');
    const container = document.createElement('div');
    const getProperties = this.getProperties;
    render(HtmlLiteralInterface.getResult(html, getProperties()), container);
    this.initialContext = { render, html, container, getProperties };
  }
  static updateRun() {
    const { render, html, container, getProperties } = this.initialContext;
    render(HtmlLiteralInterface.getResult(html, getProperties()), container);
  }
}

class UhtmlTest extends CommonTest {
  static id = 'uhtml';

  static async injectSetup() {
    const { render, html } = await import('uhtml');
    const properties = this.properties[0];
    this.injectContext = { render, html, properties };
  }
  static injectRun() {
    const { render, html, properties } = this.injectContext;
    render(document.createElement('div'), HtmlLiteralInterface.getResultEval(html, properties));
  }

  static async initialSetup() {
    const { render, html } = await import('uhtml');
    const properties = this.properties[0];
    this.initialContext = { render, html, properties };
  }
  static initialRun() {
    const { render, html, properties } = this.initialContext;
    render(document.createElement('div'), HtmlLiteralInterface.getResult(html, properties));
  }

  static async updateSetup() {
    const { render, html } = await import('uhtml');
    const container = document.createElement('div');
    const getProperties = this.getProperties;
    render(container, HtmlLiteralInterface.getResult(html, getProperties()));
    this.initialContext = { render, html, container, getProperties };
  }
  static updateRun() {
    const { render, html, container, getProperties } = this.initialContext;
    render(container, HtmlLiteralInterface.getResult(html, getProperties()));
  }
}

// eslint-disable-next-line no-unused-vars
class ReactTest extends CommonTest {
  static id = 'react';

  // TODO: This is sorta cheating since we aren’t asking it to _parse_ anything…
  static getResult(createElement, properties) {
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2 } = properties;
    return createElement('div', { 'data-id': 'p1', attr }, [
      createElement('div', { 'data-id': 'p2', 'data-foo': '', one, two, three, four, five, six, seven, eight, nine, ten }, [
        createElement('div', { 'data-id': 'p3', 'data-bar': 'bar' }, [
          createElement('div', hidden ? { 'data-id': id, boolean: '', hidden: '', 'data-bar': 'bar', title } : { 'data-id': id, boolean: '', 'data-bar': 'bar', title }, [
            content1,
            ' -- ',
            content2,
          ]),
        ]),
        createElement('p', null, [
          'Just something a little ',
          createElement('em', null, ['extra']),
          ' at the end!',
        ]),
        createElement('p', null, [
          'There are no more interpolations, so this ought to just get skipped.',
        ]),
      ]),
    ]);
  }

  static async injectSetup() {
    const { default: React } = await import('react');
    const { default: ReactDOMClient } = await import('react-dom/client');
    const { createElement } = React;
    const { createRoot } = ReactDOMClient;
    const properties = this.properties[0];
    this.injectContext = { createRoot, createElement, properties };
  }
  static injectRun() {
    const { createRoot, createElement, properties } = this.injectContext;
    const root = createRoot(document.createElement('div'));
    root.render(this.getResult(createElement, properties));
  }

  static async initialSetup() {
    const { default: React } = await import('react');
    const { default: ReactDOMClient } = await import('react-dom/client');
    const { createElement } = React;
    const { createRoot } = ReactDOMClient;
    const properties = this.properties[0];
    this.injectContext = { createRoot, createElement, properties };
  }
  static initialRun() {
    const { createRoot, createElement, properties } = this.injectContext;
    const root = createRoot(document.createElement('div'));
    root.render(this.getResult(createElement, properties));
  }

  static async updateSetup() {
    const { default: React } = await import('react');
    const { default: ReactDOMClient } = await import('react-dom/client');
    const { createElement } = React;
    const { createRoot } = ReactDOMClient;
    const getProperties = this.getProperties;
    const root = createRoot(document.createElement('div'));
    root.render(this.getResult(createElement, getProperties()));
    this.injectContext = { root, createElement, getProperties };
  }
  static updateRun() {
    const { root, createElement, getProperties } = this.injectContext;
    root.render(this.getResult(createElement, getProperties()));
  }
}

await DefaultTest.injectTest();
await LitHtmlTest.injectTest();
await UhtmlTest.injectTest();
// await ReactTest.injectTest();

await DefaultTest.initialTest();
await LitHtmlTest.initialTest();
await UhtmlTest.initialTest();
// await ReactTest.initialTest();

await DefaultTest.updateTest();
await LitHtmlTest.updateTest();
await UhtmlTest.updateTest();
// await ReactTest.updateTest();
