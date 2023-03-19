import XElement from '../../x-element.js';
import { html as litHtmlHtml, render as litHtmlRender } from 'https://unpkg.com/lit-html/lit-html.js?module';
import { render as uhtmlRender, html as uhtmlHtml } from 'https://unpkg.com/uhtml?module';

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

const run = async (output, constructor) => {
  output.textContent = '';
  const { render, html } = constructor.templateEngine;
  const injectCount = 100000;
  const initialCount = 1000000;
  const updateCount = 1000000;

  // Test inject performance.
  await new Promise(resolve => setTimeout(resolve, 0));
  let injectSum = 0;
  const injectProperties = { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' };
  const injectContainer = document.createElement('div');
  for (let iii = 0; iii < injectCount; iii++) {
    const strings = getStrings();
    const values = getValues(injectProperties);
    const t0 = performance.now();
    render(injectContainer, html(strings, ...values));
    const t1 = performance.now();
    injectSum += t1 - t0;
  }
  const injectAverage = `${(injectSum / injectCount * 1000).toFixed(1).padStart(6)} µs`;
  output.textContent += `${output.textContent ? '\n' : ''}inject: ${injectAverage} (tested ${injectCount.toLocaleString()} times)`;

  // Test initial performance.
  await new Promise(resolve => setTimeout(resolve, 0));
  let initialSum = 0;
  const initialStrings = getStrings();
  const initialProperties = { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' };
  const initialValues = getValues(initialProperties);
  const initialContainer = document.createElement('div');
  for (let iii = 0; iii < initialCount; iii++) {
    const t0 = performance.now();
    render(initialContainer, html(initialStrings, ...initialValues));
    const t1 = performance.now();
    initialSum += t1 - t0;
  }
  const initialAverage = `${(initialSum / initialCount * 1000).toFixed(1).padStart(4)}  µs`;
  output.textContent += `${output.textContent ? '\n' : ''}initial: ${initialAverage} (tested ${initialCount.toLocaleString()} times)`;

  // Test update performance.
  await new Promise(resolve => setTimeout(resolve, 0));
  let updateSum = 0;
  const updateStrings = getStrings();
  const updateProperties = [
    { attr: '123', id: 'foo', hidden: false, title: 'test', content1: 'AAA', content2: 'BBB' },
    { attr: '456', id: 'bar', hidden: false,  title: 'test', content1: 'ZZZ', content2: 'BBB' },
  ];
  const updateContainer = document.createElement('div');
  for (let iii = 0; iii < updateCount; iii++) {
    const values = getValues(updateProperties[iii % 2]);
    const t0 = performance.now();
    render(updateContainer, html(updateStrings, ...values));
    const t1 = performance.now();
    updateSum += t1 - t0;
  }
  const updateAverage = `${(updateSum / updateCount * 1000).toFixed(1).padStart(5)}  µs`;
  output.textContent += `${output.textContent ? '\n' : ''}update: ${updateAverage} (tested ${updateCount.toLocaleString()} times)`;
};

await run(document.getElementById('default'), XElement);
await run(document.getElementById('lit-html'), LitHtmlElement);
await run(document.getElementById('uhtml'), UhtmlElement);
