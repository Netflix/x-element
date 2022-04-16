import XElement from '../x-element.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

const { html, svg, render, updater, boolean, notNullish, live, unsafeHtml, unsafeSvg, keyedMap } = XElement.templateEngine;

it('html: renders basic string', () => {
  const getTemplate = () => {
    return html`<div id="target">No interpolation.</div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate());
  assert(container.querySelector('#target').textContent === 'No interpolation.');
  container.remove();
});

// TODO: Is it reasonable that we cannot reuse the same template?
//  It seems like that is an OK assumption...
it('html: refuses to reuse a template', () => {
  const template = html`<div id="target"></div>`;
  const container = document.createElement('div');
  document.body.append(container);
  render(container, template);
  assert(!!container.querySelector('#target'));
  render(container, null);
  assert(!container.querySelector('#target'));
  let error;
  try {
    render(container, template);
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected re-injection of template.');
  container.remove();
});

it('html: renders nullish templates', () => {
  const getTemplate = () => {
    return html`<div></div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate());
  assert(!!container.childNodes.length);
  render(container, null);
  assert(!container.childNodes.length);
  render(container, getTemplate());
  assert(!!container.childNodes.length);
  render(container, undefined);
  assert(!container.childNodes.length);
  container.remove();
});

it('html: renders interpolated content', () => {
  const getTemplate = ({ content }) => {
    return html`<div id="target">${content}</div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ content: 'Interpolated.' }));
  assert(container.querySelector('#target').textContent === 'Interpolated.');
  render(container, getTemplate({ content: 'Updated.' }));
  assert(container.querySelector('#target').textContent === 'Updated.');
  container.remove();
});

it('html: renders nested content', () => {
  const getTemplate = ({ show, nestedContent }) => {
    return html`
      <div id="target">
        ${show ? html`<span id="conditional">${nestedContent}</span>` : null}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ show: true, nestedContent: 'oh hai' }));
  assert(!!container.querySelector('#conditional'));
  render(container, getTemplate({ show: false, nestedContent: 'oh hai' }));
  assert(!container.querySelector('#conditional'));
  render(container, getTemplate({ show: true, nestedContent: 'oh hai' }));
  assert(container.querySelector('#conditional').textContent === 'oh hai');
  render(container, getTemplate({ show: true, nestedContent: 'k bye' }));
  assert(container.querySelector('#conditional').textContent === 'k bye');
  container.remove();
});

it('html: renders attributes', () => {
  const getTemplate = ({ attr }) => {
    return html`<div id="target" attr="${attr}"></div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ attr: 'foo' }));
  assert(container.querySelector('#target').getAttribute('attr') === 'foo');
  render(container, getTemplate({ attr: 'bar' }));
  assert(container.querySelector('#target').getAttribute('attr') === 'bar');
  container.remove();
});

it('html: renders properties', () => {
  const getTemplate = ({ prop }) => {
    return html`<div id="target" .prop="${prop}"></div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ prop: 'foo' }));
  assert(container.querySelector('#target').prop === 'foo');
  render(container, getTemplate({ prop: 'bar' }));
  assert(container.querySelector('#target').prop === 'bar');
  container.remove();
});

it('html: maintains DOM nodes', () => {
  const getTemplate = ({ content }) => {
    return html`<div>${content}</div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ content: 'foo' }));
  container.querySelector('div').classList.add('state');
  assert(container.querySelector('div').textContent === 'foo');
  assert(container.querySelector('div').classList.contains('state'));
  render(container, getTemplate({ content: 'bar' }));
  assert(container.querySelector('div').textContent === 'bar');
  assert(container.querySelector('div').classList.contains('state'));
  container.remove();
});

it('html: renders lists', () => {
  const getTemplate = ({ items }) => {
    return html`
      <div id="target">
        ${items.map(item => {
          return html`<div>${item}</div>`;
        })}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ items: ['foo', 'bar', 'baz'] }));
  assert(container.querySelector('#target').childElementCount === 3);
  assert(container.querySelector('#target').children[0].textContent === 'foo');
  assert(container.querySelector('#target').children[1].textContent === 'bar');
  assert(container.querySelector('#target').children[2].textContent === 'baz');
  container.remove();
});

// TODO: is this something we do in fact want to support?
it('html: renders lists with changing templates', () => {
  const getTemplate = ({ items }) => {
    return html`
      <div id="target">
        ${items.map(item => {
          return item ? html`<div class="true"></div>` : html`<div class="false"></div>`;
        })}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ items: [true, true, true] }));
  assert(container.querySelector('#target').childElementCount === 3);
  assert(container.querySelector('#target').children[0].classList.contains('true'));
  assert(container.querySelector('#target').children[1].classList.contains('true'));
  assert(container.querySelector('#target').children[2].classList.contains('true'));
  render(container, getTemplate({ items: [true, false, true] }));
  assert(container.querySelector('#target').children[0].classList.contains('true'));
  assert(container.querySelector('#target').children[1].classList.contains('false'));
  assert(container.querySelector('#target').children[2].classList.contains('true'));
  container.remove();
});

it('html: renders lists with changing length', () => {
  const getTemplate = ({ items }) => {
    return html`
      <div id="target">
        ${items.map(() => {
          return html`<div class="item"></div>`;
        })}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ items: [1, 2, 3] }));
  assert(container.querySelector('#target').childElementCount === 3);
  render(container, getTemplate({ items: [1, 2, 3, 4, 5] }));
  assert(container.querySelector('#target').childElementCount === 5);
  render(container, getTemplate({ items: [1, 2] }));
  assert(container.querySelector('#target').childElementCount === 2);
  container.remove();
});

it('html: renders multiple templates', () => {
  const getTemplate = ({ content }) => {
    if (content) {
      return html`<div id="content">${content}</div>`;
    } else {
      return html`<div id="empty"></div>`;
    }
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ content: 'oh hai' }));
  assert(!!container.querySelector('#content'));
  assert(!container.querySelector('#empty'));
  render(container, getTemplate({ content: '' }));
  assert(!container.querySelector('#content'));
  assert(!!container.querySelector('#empty'));
  container.remove();
});

it('html: renders multiple templates (as content)', () => {
  const getTemplate = ({ content }) => {
    return html`
      <div id="target">
        ${content ? html`<div id="content">${content}</div>` : html`<div id="empty"></div>`}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ content: 'oh hai' }));
  assert(!!container.querySelector('#content'));
  assert(!container.querySelector('#empty'));
  render(container, getTemplate({ content: '' }));
  assert(!container.querySelector('#content'));
  assert(!!container.querySelector('#empty'));
  container.remove();
});

it('html: self-closing tags work', () => {
  const getTemplate = ({ type }) => {
    return html`<input type="${notNullish(type)}"/>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ type: null }));
  assert(container.querySelector('input').type === 'text');
  render(container, getTemplate({ type: 'checkbox' }));
  assert(container.querySelector('input').type === 'checkbox');
  container.remove();
});

it('html: textarea element content', () => {
  const getTemplate = ({ defaultValue }) => {
    return html`<textarea>${defaultValue}</textarea>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ defaultValue: 'foo' }));
  assert(container.querySelector('textarea').value === 'foo');
  container.remove();
});

it('html: updaters: boolean', () => {
  const getTemplate = ({ bool }) => {
    return html`<div id="target" bool="${boolean(bool)}"></div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ bool: true }));
  assert(container.querySelector('#target').getAttribute('bool') === '');
  render(container, getTemplate({ bool: false }));
  assert(container.querySelector('#target').getAttribute('bool') === null);
  container.remove();
});

it('html: updaters: notNullish', () => {
  const getTemplate = ({ maybe }) => {
    return html`<div id="target" maybe="${notNullish(maybe)}"></div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ maybe: 'yes' }));
  assert(container.querySelector('#target').getAttribute('maybe') === 'yes');
  render(container, getTemplate({ maybe: null }));
  assert(container.querySelector('#target').getAttribute('maybe') === null);
  render(container, getTemplate({ maybe: undefined }));
  assert(container.querySelector('#target').getAttribute('maybe') === null);
  render(container, getTemplate({ maybe: false }));
  assert(container.querySelector('#target').getAttribute('maybe') === 'false');
  container.remove();
});

it('html: updaters: live', () => {
  const getTemplate = ({ alive, dead }) => {
    return html`<div id="target" .alive="${live(alive)}" .dead="${dead}"></div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ alive: 'lively', dead: 'deadly' }));
  assert(container.querySelector('#target').alive === 'lively');
  assert(container.querySelector('#target').dead === 'deadly');
  container.querySelector('#target').alive = 'changed';
  container.querySelector('#target').dead = 'changed';
  assert(container.querySelector('#target').alive === 'changed');
  assert(container.querySelector('#target').dead === 'changed');
  render(container, getTemplate({ alive: 'lively', dead: 'deadly' }));
  assert(container.querySelector('#target').alive === 'lively');
  assert(container.querySelector('#target').dead === 'changed');
  container.remove();
});

it('html: updaters: unsafeHtml', () => {
  const getTemplate = ({ content }) => {
    return html`<div id="target">${unsafeHtml(content)}</div>`;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ content: '<div id="injected">oh hai</div>' }));
  assert(!!container.querySelector('#injected'));
  render(container, getTemplate({ content: '<div id="booster">oh hai, again</div>' }));
  assert(!!container.querySelector('#booster'));
  container.remove();
});

it('html: updaters: keyedMap', () => {
  const getTemplate = ({ items }) => {
    return html`
      <div id="target">
        ${keyedMap(items, item => item.id, item => {
          return html`<div id="${item.id}" class="item">${item.id}</div>`;
        })}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar'}, { id: 'baz' }] }));
  const foo = container.querySelector('#foo');
  const bar = container.querySelector('#bar');
  const baz = container.querySelector('#baz');
  assert(container.querySelector('#target').childElementCount === 3);
  assert(!!foo);
  assert(!!bar);
  assert(!!baz);
  assert(container.querySelector('#target').children[0] === foo);
  assert(container.querySelector('#target').children[1] === bar);
  assert(container.querySelector('#target').children[2] === baz);
  render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar'}, { id: 'baz' }] }));
  assert(container.querySelector('#target').childElementCount === 3);
  assert(container.querySelector('#target').children[0] === foo);
  assert(container.querySelector('#target').children[1] === bar);
  assert(container.querySelector('#target').children[2] === baz);
  render(container, getTemplate({ items: [{ id: 'baz' }, { id: 'foo' }, { id: 'bar'}] }));
  assert(container.querySelector('#target').childElementCount === 3);
  assert(container.querySelector('#target').children[0] === baz);
  assert(container.querySelector('#target').children[1] === foo);
  assert(container.querySelector('#target').children[2] === bar);
  render(container, getTemplate({ items: [{ id: 'bar'}, { id: 'baz' }, { id: 'foo' }] }));
  assert(container.querySelector('#target').childElementCount === 3);
  assert(container.querySelector('#target').children[0] === bar);
  assert(container.querySelector('#target').children[1] === baz);
  assert(container.querySelector('#target').children[2] === foo);
  render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar'}, { id: 'baz' }] }));
  assert(container.querySelector('#target').childElementCount === 3);
  assert(container.querySelector('#target').children[0] === foo);
  assert(container.querySelector('#target').children[1] === bar);
  assert(container.querySelector('#target').children[2] === baz);
  render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar'}] }));
  assert(container.querySelector('#target').childElementCount === 2);
  assert(container.querySelector('#target').children[0] === foo);
  assert(container.querySelector('#target').children[1] === bar);
  render(container, getTemplate({ items: [{ id: 'foo' }] }));
  assert(container.querySelector('#target').childElementCount === 1);
  assert(container.querySelector('#target').children[0] === foo);
  render(container, getTemplate({ items: [] }));
  assert(container.querySelector('#target').childElementCount === 0);
  render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar'}, { id: 'baz' }] }));
  assert(container.querySelector('#target').childElementCount === 3);
  assert(container.querySelector('#target').children[0] !== foo);
  assert(container.querySelector('#target').children[1] !== bar);
  assert(container.querySelector('#target').children[2] !== baz);
  container.remove();
});

it('html: updaters: keyedMap: template changes', () => {
  const getTemplate = ({ items }) => {
    return html`
      <div id="target">
        ${keyedMap(items, item => item.id, item => {
          return item.show ? html`<div id="${item.id}" class="item">${item.id}</div>` : html`<div id="${item.id}" class="item"></div>`;
        })}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ items: [{ id: 'foo', show: true }] }));
  const foo = container.querySelector('#foo');
  assert(container.querySelector('#target').childElementCount === 1);
  assert(!!foo);
  assert(container.querySelector('#target').children[0] === foo);
  render(container, getTemplate({ items: [{ id: 'foo', show: false }] }));
  assert(container.querySelector('#target').childElementCount === 1);
  assert(!!container.querySelector('#foo'));
  assert(container.querySelector('#target').children[0] !== foo);
  container.remove();
});

it('html: updaters: custom: simple', () => {
  const update = (type, value, lastValue, { node, name }) => {
    if (type === 'attribute' && value !== lastValue) {
      node.setAttribute(name, value?.toLowerCase() ?? value);
    }
  };
  const lower = updater(update);
  const getTemplate = ({ attr }) => {
    return html`
      <div id="target" attr="${lower(attr)}"></div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ attr: 'FOO' }));
  assert(container.querySelector('#target').getAttribute('attr') === 'foo');
  render(container, getTemplate({ attr: 'FoO' }));
  assert(container.querySelector('#target').getAttribute('attr') === 'foo');
  container.remove();
});

it('html: updaters: custom: advanced', () => {
  const update = (type, value, lastValue, { node, name }, { prefix, suffix }) => {
    if (type === 'attribute' && value !== lastValue) {
      node.setAttribute(name, `${prefix}-${value}-${suffix}`);
    }
  };
  const transform = (prefix, suffix) => ({ prefix, suffix });
  const wrap = updater(update, transform);
  const getTemplate = ({ attr }) => {
    return html`
      <div id="target" attr="${wrap(attr, 'before', 'after')}"></div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ attr: 'foo' }));
  assert(container.querySelector('#target').getAttribute('attr') === 'before-foo-after');
  container.remove();
});

it('html: updaters: custom: text-content', () => {
  const update = (type, value, lastValue, { node }) => {
    if (type === 'text-content' && value !== lastValue) {
      node.textContent = value?.toLowerCase() ?? value;
    }
  };
  const lower = updater(update);
  const getTemplate = ({ content }) => {
    return html`
      <textarea id="target">${lower(content)}</textarea>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ content: 'FOO' }));
  assert(container.querySelector('#target').textContent === 'foo');
  container.remove();
});

it('svg: renders a basic string', () => {
  const getTemplate = ({ r, cx, cy }) => {
    return svg`<circle id="target" r="${r}" cx="${cx}" cy="${cy}"/>`;
  };
  const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  container.setAttribute('viewBox', '0 0 100 100');
  container.setAttribute('style', 'height: 100px; width: 100px;');
  document.body.append(container);
  render(container, getTemplate({ r: 10, cx: 50, cy: 50 }));
  assert(container.querySelector('#target').getBoundingClientRect().width === 20);
  assert(container.querySelector('#target').getBoundingClientRect().height === 20);
  render(container, getTemplate({ r: 5, cx: 50, cy: 50 }));
  assert(container.querySelector('#target').getBoundingClientRect().width === 10);
  assert(container.querySelector('#target').getBoundingClientRect().height === 10);
  container.remove();
});

it('svg: renders lists', () => {
  const getTemplate = ({ items }) => {
    return html`
      <svg id="target"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 100"
        style="width: 10px; height: 100px;">
        ${items.map((item, index) => {
          return svg`<circle class="dot" r="${item.r}" cx="5" cy="${10 * (index + 1)}"></circle>`;
        })}
      </svg>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ items: [{ r: 1 }, { r: 2 }, { r: 3 }, { r: 4 }, { r: 5 }] }));
  assert(container.querySelector('#target').childElementCount === 5);
  assert(container.querySelector('#target').children[0].getBoundingClientRect().height = 2);
  assert(container.querySelector('#target').children[1].getBoundingClientRect().height = 4);
  assert(container.querySelector('#target').children[2].getBoundingClientRect().height = 6);
  assert(container.querySelector('#target').children[3].getBoundingClientRect().height = 8);
  assert(container.querySelector('#target').children[4].getBoundingClientRect().height = 10);
  container.remove();
});

it('svg: updaters: unsafeSvg', () => {
  const getTemplate = ({ content }) => {
    return html`
      <svg
        id="target"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        style="width: 100px; height: 100px;">
        ${unsafeSvg(content)}
      </svg>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ content: '<circle id="injected" r="10" cx="50" cy="50"></circle>' }));
  assert(!!container.querySelector('#injected'));
  assert(container.querySelector('#injected').getBoundingClientRect().height = 20);
  assert(container.querySelector('#injected').getBoundingClientRect().width = 20);
  render(container, getTemplate({ content: '<circle id="injected" r="5" cx="50" cy="50"></circle>' }));
  assert(!!container.querySelector('#injected'));
  assert(container.querySelector('#injected').getBoundingClientRect().height = 10);
  assert(container.querySelector('#injected').getBoundingClientRect().width = 10);
  container.remove();
});

it('render errors: keyedMap: throws for non-array value', () => {
  const getTemplate = ({ array }) => {
    return html`
      <div id="target">
        ${keyedMap(array, () => {}, () => html``)}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  let error;
  try {
    render(container, getTemplate({ array: 5 }));
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected value "5".', error?.message);
  container.remove();
});

it('render errors: keyedMap: throws for non-template callback value', () => {
  const getTemplate = ({ array }) => {
    return html`
      <div id="target">
        ${keyedMap(array, item => item.id, item => item.value ? html`<div>${item.value}</div>` : null)}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  let error;
  try {
    render(container, getTemplate({ array: [{ id: 'foo', value: null }] }));
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected value "null".', error?.message);
  container.remove();
});

it('render errors: keyedMap: throws for non-template callback value (on re-render)', () => {
  const getTemplate = ({ array }) => {
    return html`
      <div id="target">
        ${keyedMap(array, item => item.id, item => item.value ? html`<div>${item.value}</div>` : null)}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ array: [{ id: 'foo', value: 'oh hai' }] }));
  let error;
  try {
    render(container, getTemplate({ array: [{ id: 'foo', value: null }] }));
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected value "null".', error?.message);
  container.remove();
});

it('render errors: unsafeHtml: throws for non-string value', () => {
  const getTemplate = ({ content }) => {
    return html`
      <div id="target">
        ${unsafeHtml(content)}
      </div>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  let error;
  try {
    render(container, getTemplate({ content: null }));
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected value "null".', error?.message);
  container.remove();
});

it('render errors: unsafeSvg: throws for non-string value', () => {
  const getTemplate = ({ content }) => {
    return html`
      <svg id="target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        ${unsafeSvg(content)}
      </svg>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  let error;
  try {
    render(container, getTemplate({ content: null }));
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected value "null".', error?.message);
  container.remove();
});

it('render errors: template list: throws for non-template value', () => {
  const getTemplate = ({ items }) => {
    return html`
      <svg id="target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        ${items.map(item => item ? html`<div>${item}</div>` : null)}
      </svg>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  let error;
  try {
    render(container, getTemplate({ items: [null] }));
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected value "null".', error?.message);
  container.remove();
});

it('render errors: template list (on re-render): throws for non-template value', () => {
  const getTemplate = ({ items }) => {
    return html`
      <svg id="target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        ${items.map(item => item ? html`<div>${item}</div>` : null)}
      </svg>
    `;
  };
  const container = document.createElement('div');
  document.body.append(container);
  render(container, getTemplate({ items: ['foo'] }));
  let error;
  try {
    render(container, getTemplate({ items: [null] }));
  } catch (e) {
    error = e;
  }
  assert(error?.message === 'Unexpected value "null".', error?.message);
  container.remove();
});