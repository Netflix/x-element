import XElement from '../../x-element.js';
import { html as litHtmlHtml, render as litHtmlRender } from 'https://unpkg.com/lit-html@3.1.2/lit-html.js';
import { html as uhtmlHtml, render as uhtmlRender } from 'https://unpkg.com/uhtml@4.4.7';

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

/*
  // Reference template string (since it's hard to read as an interpolated array).
  //  Note that there are no special characters here so strings == strings.raw.
  <div id="p1" attr="${attr}"><div id="p2" data-foo><div id="p3" data-bar="bar"><div id="${id}" boolean ?hidden="${hidden}" .title="${title}">${content1} -- ${content2}</div></div></div></div>
*/
const getStrings = () => {
  const strings = ['<div id="p1" attr="', '"><div id="p2" data-foo><div id="p3" data-bar="bar"><div id="', '" boolean ?hidden="', '" .title="', '">', ' -- ', '</div></div></div></div>'];
  strings.raw = ['<div id="p1" attr="', '"><div id="p2" data-foo><div id="p3" data-bar="bar"><div id="', '" boolean ?hidden="', '" .title="', '">', ' -- ', '</div></div></div></div>'];
  return strings;
};
const getValues = ({ attr, id, hidden, title, content1, content2 }) => {
  const values = [attr, id, hidden, title, content1, content2];
  return values;
};
const tick = async () => {
  await new Promise(resolve => requestAnimationFrame(resolve));
};

const run = async (output, constructor, ...tests) => {
  output.textContent = '';
  const { render, html } = constructor.templateEngine;
  const slop = 1000;
  const injectCount = 10000;
  const initialCount = 100000;
  const updateCount = 100000;

  if (tests.includes('inject')) {
    // Test inject performance.
    await tick();
    let injectSum = 0;
    const injectProperties = { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' };
    const injectContainer = document.createElement('div');
    for (let iii = 0; iii < injectCount + slop; iii++) {
      const strings = getStrings();
      const values = getValues(injectProperties);
      const t0 = performance.now();
      render(injectContainer, html(strings, ...values));
      const t1 = performance.now();
      if (iii >= slop) {
        injectSum += t1 - t0;
      }
      if (iii % 100 === 0) {
        await tick();
      }
    }
    const injectAverage = `${(injectSum / injectCount * 1000).toFixed(1).padStart(6)} µs`;
    output.textContent += `${output.textContent ? '\n' : ''}inject: ${injectAverage} (tested ${injectCount.toLocaleString()} times)`;
  }

  if (tests.includes('initial')) {
    // Test initial performance.
    await new Promise(resolve => setTimeout(resolve, 0));
    let initialSum = 0;
    const initialStrings = getStrings();
    const initialProperties = { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' };
    const initialValues = getValues(initialProperties);
    const initialContainer = document.createElement('div');
    for (let iii = 0; iii < initialCount + slop; iii++) {
      const t0 = performance.now();
      render(initialContainer, html(initialStrings, ...initialValues));
      const t1 = performance.now();
      if (iii >= slop) {
        initialSum += t1 - t0;
      }
      if (iii % 1000 === 0) {
        await tick();
      }
    }
    const initialAverage = `${(initialSum / initialCount * 1000).toFixed(1).padStart(4)}  µs`;
    output.textContent += `${output.textContent ? '\n' : ''}initial: ${initialAverage} (tested ${initialCount.toLocaleString()} times)`;
  }

  if (tests.includes('update')) {
    // Test update performance.
    await new Promise(resolve => setTimeout(resolve, 0));
    let updateSum = 0;
    const updateStrings = getStrings();
    const updateProperties = [
      { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' },
      { attr: '456', id: 'bar', hidden: false,  title: 'test', content1: 'ZZZ', content2: 'BBB' },
    ];
    const updateContainer = document.createElement('div');
    for (let iii = 0; iii < updateCount + slop; iii++) {
      const values = getValues(updateProperties[iii % 2]);
      const t0 = performance.now();
      render(updateContainer, html(updateStrings, ...values));
      const t1 = performance.now();
      if (iii >= slop) {
        updateSum += t1 - t0;
      }
      if (iii % 1000 === 0) {
        await tick();
      }
    }
    const updateAverage = `${(updateSum / updateCount * 1000).toFixed(1).padStart(5)}  µs`;
    output.textContent += `${output.textContent ? '\n' : ''}update: ${updateAverage} (tested ${updateCount.toLocaleString()} times)`;
  }
};

await run(document.getElementById('default'), XElement, 'inject', 'initial', 'update');
await run(document.getElementById('lit-html'), LitHtmlElement, 'inject', 'initial', 'update');
await run(document.getElementById('uhtml'), UhtmlElement, 'inject', 'initial', 'update');
