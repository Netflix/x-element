import XElement from '../../x-element.js';
import { html as litHtmlHtml, render as litHtmlRender } from 'lit-html';
import { html as uhtmlHtml, render as uhtmlRender } from 'uhtml';

class LitHtmlElement extends XElement {
  // Use lit-html's template engine rather than the built-in x-element engine.
  static get templateEngine() {
    const render = (container, template) => litHtmlRender(template, container);
    const html = litHtmlHtml;
    return { render, html };
  }
}

class UhtmlElement extends XElement {
  // Use µhtml's template engine rather than the built-in x-element engine.
  static get templateEngine() {
    return { render: uhtmlRender, html: uhtmlHtml };
  }
}

// Note that there are no special characters here so strings == strings.raw.
const fixture = `\
<div id="p1" attr="\${attr}">
  <div id="p2" data-foo>
    <div id="p3" data-bar="bar">
      <div id="\${id}" boolean ?hidden="\${hidden}" .title="\${title}">
        \${content1} -- \${content2}
      </div>
    </div>
  </div>
</div>`;
const fixtureSplit = fixture.split(/\${[^}]*}/);
const getStrings = () => {
  const strings = [...fixtureSplit];
  strings.raw = [...fixtureSplit];
  Object.freeze(strings.raw);
  Object.freeze(strings);
  return strings;
};
const getValues = ({ attr, id, hidden, title, content1, content2 }) => {
  const values = [attr, id, hidden, title, content1, content2];
  return values;
};
const tick = async () => {
  await new Promise(resolve => requestAnimationFrame(resolve));
};

const median = numbers => {
  const copy = numbers.toSorted();
  const low = copy[Math.floor(numbers.length / 2)];
  const high = copy[Math.ceil(numbers.length / 2)];
  return (low + high) / 2;
};

const run = async (output, constructor, ...tests) => {
  output.textContent = '';
  const { render, html } = constructor.templateEngine;

  const injectCount = 50000;
  const injectSlop = 1000;
  const injectBatch = 200;
  if (injectSlop % injectBatch !== 0) {
    throw new Error('"injectSlop % injectBatch" mush equal zero');
  }
  if (injectCount % injectBatch !== 0) {
    throw new Error('"injectCount % injectBatch" mush equal zero');
  }

  const initialCount = 1000000;
  const initialSlop = 10000;
  const initialBatch = 10000;
  if (initialSlop % initialBatch !== 0) {
    throw new Error('"initialSlop % initialBatch" mush equal zero');
  }
  if (initialCount % initialBatch !== 0) {
    throw new Error('"initialCount % initialBatch" mush equal zero');
  }

  const updateCount = 1000000;
  const updateSlop = 10000;
  const updateBatch = 10000;
  if (updateSlop % updateBatch !== 0) {
    throw new Error('"updateSlop % updateBatch" mush equal zero');
  }
  if (updateCount % updateBatch !== 0) {
    throw new Error('"updateCount % updateBatch" mush equal zero');
  }

  if (tests.includes('inject')) {
    // Test inject performance.
    await new Promise(resolve => setTimeout(resolve, 0));
    const injectResults = [];
    const injectProperties = { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' };
    const injectContainer = document.createElement('div');

    for (let iii = 0; iii < injectSlop / injectBatch; iii++) {
      // Throw away a few runs — they often cause outlier data.
      await tick();
      for (let jjj = 0; jjj < injectBatch; jjj++) {
        const strings = getStrings();
        const values = getValues(injectProperties);
        render(injectContainer, html(strings, ...values));
      }
    }

    for (let iii = 0; iii < injectCount / injectBatch; iii++) {
      await tick();
      const t0 = performance.now();
      for (let jjj = 0; jjj < injectBatch; jjj++) {
        // Batch up actions — this is tuned to work within an animation frame.
        const strings = getStrings();
        const values = getValues(injectProperties);
        render(injectContainer, html(strings, ...values));
      }
      const t1 = performance.now();
      injectResults.push(t1 - t0);
    }

    const injectMedian = median(injectResults);
    const injectResult = `${(injectMedian / injectBatch * 1_000).toFixed().padStart(6)} µs`;
    output.textContent += `${output.textContent ? '\n' : ''}inject: ${injectResult} (tested ${injectCount.toLocaleString()} times)`;
  }

  if (tests.includes('initial')) {
    // Test initial performance.
    await new Promise(resolve => setTimeout(resolve, 0));
    const initialResults = [];
    const initialStrings = getStrings();
    const initialProperties = { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' };
    const initialValues = getValues(initialProperties);
    const initialContainer = document.createElement('div');

    for (let iii = 0; iii < initialSlop / initialBatch; iii++) {
      // Throw away a few runs — they often cause outlier data.
      await tick();
      for (let jjj = 0; jjj < initialBatch; jjj++) {
        render(initialContainer, html(initialStrings, ...initialValues));
      }
    }

    for (let iii = 0; iii < initialCount / initialBatch; iii++) {
      await tick();
      const t0 = performance.now();
      for (let jjj = 0; jjj < initialBatch; jjj++) {
        // Batch up actions — this is tuned to work within an animation frame.
        render(initialContainer, html(initialStrings, ...initialValues));
      }
      const t1 = performance.now();
      initialResults.push(t1 - t0);
    }

    const initialMedian = median(initialResults);
    const initialResult = `${(initialMedian / initialBatch * 1_000).toFixed(2).padStart(5)} µs`;
    output.textContent += `${output.textContent ? '\n' : ''}initial: ${initialResult} (tested ${initialCount.toLocaleString()} times)`;
  }

  if (tests.includes('update')) {
    // Test update performance.
    await new Promise(resolve => setTimeout(resolve, 0));
    const updateResults = [];
    const updateStrings = getStrings();
    const updateProperties = [
      { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' },
      { attr: '456', id: 'bar', hidden: false,  title: 'test', content1: 'ZZZ', content2: 'BBB' },
    ];
    const updateValues = [
      getValues(updateProperties[0]),
      getValues(updateProperties[1]),
    ];
    const updateContainer = document.createElement('div');

    for (let iii = 0; iii < updateSlop / updateBatch; iii++) {
      // Throw away a few runs — they often cause outlier data.
      await tick();
      for (let jjj = 0; jjj < updateBatch; jjj++) {
        render(updateContainer, html(updateStrings, ...updateValues[iii % 2]));
      }
    }

    for (let iii = 0; iii < updateCount / updateBatch; iii++) {
      await tick();
      const t0 = performance.now();
      for (let jjj = 0; jjj < updateBatch; jjj++) {
        // Batch up actions — this is tuned to work within an animation frame.
        render(updateContainer, html(updateStrings, ...updateValues[iii % 2]));
      }
      const t1 = performance.now();
      updateResults.push(t1 - t0);
    }

    const updateMedian = median(updateResults);
    const updateResult = `${(updateMedian / updateBatch * 1_000).toFixed(2).padStart(6)} µs`;
    output.textContent += `${output.textContent ? '\n' : ''}update: ${updateResult} (tested ${updateCount.toLocaleString()} times)`;
  }
};

document.getElementById('fixture').textContent = fixture;

await run(document.getElementById('default'), XElement, 'inject', 'initial', 'update');
await run(document.getElementById('lit-html'), LitHtmlElement, 'inject', 'initial', 'update');
await run(document.getElementById('uhtml'), UhtmlElement, 'inject', 'initial', 'update');
