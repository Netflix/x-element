import XElement from '../x-element.js';
import { assert, describe, it } from './x-test.js';

// Long-term interface.
const { render, html, svg } = XElement.templateEngine;

// Deprecated interface. We will eventually delete these.
const { map, ifDefined, nullish, repeat, live, unsafeHTML, unsafeSVG } = XElement.templateEngine;

// Overwrite console warn for testing so we don’t get spammed with our own
//  deprecation warnings.
const seen = new Set();
const warn = console.warn; // eslint-disable-line no-console
const localMessages = [
  'Deprecated "ifDefined" from default templating engine interface.',
  'Deprecated "nullish" from default templating engine interface.',
  'Deprecated "live" from default templating engine interface.',
  'Deprecated "unsafeHTML" from default templating engine interface.',
  'Deprecated "unsafeSVG" from default templating engine interface.',
  'Deprecated "repeat" from default templating engine interface.',
  'Deprecated "map" from default templating engine interface.',
];
console.warn = (...args) => { // eslint-disable-line no-console
  if (!localMessages.includes(args[0]?.message)) {
    warn(...args);
  } else {
    seen.add(args[0].message);
  }
};

describe('html rendering', () => {
  it('renders basic string', () => {
    const getTemplate = () => {
      return html`<div id="target">No interpolation.</div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate());
    assert(container.childNodes.length === 1);
    assert(container.querySelector('#target').textContent === 'No interpolation.');
    container.remove();
  });

  it('renders interpolated content without parsing', () => {
    const userContent = '<a href="https://evil.com">Click Me!</a>';
    const getTemplate = () => {
      return html`<div id="target">${userContent}</div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate());
    assert(container.querySelector('#target').textContent === userContent);
    container.remove();
  });

  it('renders nullish templates', () => {
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

  it('renders interpolated content', () => {
    const getTemplate = ({ content }) => {
      return html`<div id="target">a b ${content}</div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ content: 'Interpolated.' }));
    assert(container.querySelector('#target').textContent === 'a b Interpolated.');
    render(container, getTemplate({ content: 'Updated.' }));
    assert(container.querySelector('#target').textContent === 'a b Updated.');
    container.remove();
  });

  // Unlike a NodeList, a NamedNodeMap (i.e., “.attributes”) is not technically
  //  ordered in any way. This test just confirms that the template engine logic
  //  doesn’t get confused in any way post-parse.
  it('renders elements with many attributes in a weird order', () => {
    const getTemplate = ({
      property1,
      z99,
      defined,
      dataFoo,
      property2,
      title,
      dataBar,
      className,
      property3,
      boolean,
      ariaLabel,
      content,
    }) => {
      return html`
        <div
          id="target"
          .property1="${property1}"
          z-99="${z99}"
          ??defined="${defined}"
          data-foo="${dataFoo}"
          .property2="${property2}"
          title="${title}"
          static="just hanging"
          data-bar="${dataBar}"
          class="${className}"
          .property3="${property3}"
          ?boolean="${boolean}"
          aria-label="${ariaLabel}">
          ${content}
        </div>
      `;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({
      property1: null,
      z99: true,
      defined: false,
      dataFoo: 10,
      property2: -1,
      title: 'a title',
      dataBar: 'data attribute',
      className: 'a b c',
      property3: new URL('https://github.com/Netflix/x-element'),
      boolean: 'yes',
      ariaLabel: 'this is what it does',
      content: 'influencing',
    }));
    const target = container.querySelector('#target');
    assert(target.property1 === null);
    assert(target.getAttribute('z-99') === 'true');
    assert(target.getAttribute('defined') === 'false');
    assert(target.getAttribute('data-foo') === '10');
    assert(target.property2 === -1);
    assert(target.getAttribute('title') === 'a title');
    assert(target.getAttribute('data-bar') === 'data attribute');
    assert(target.getAttribute('class') === 'a b c');
    assert(target.property3.href === 'https://github.com/Netflix/x-element');
    assert(target.getAttribute('boolean') === '');
    assert(target.getAttribute('aria-label') === 'this is what it does');
    assert(target.textContent.trim() === 'influencing');
    container.remove();
  });

  it('renders multiple, interpolated content', () => {
    const getTemplate = ({ one, two }) => {
      return html`
        <div id="target">one: ${one} / two: ${two}</div>
      `;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ one: 'ONE', two: 'TWO' }));
    assert(container.querySelector('#target').textContent === 'one: ONE / two: TWO');
    container.remove();
  });

  it('renders nested content', () => {
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

  it('renders attributes', () => {
    const getTemplate = ({ attr, content }) => {
      return html`<div id="target" attr="${attr}" f="b">Something<span>${content}</span></div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ attr: 'foo' }));
    assert(container.querySelector('#target').getAttribute('attr') === 'foo');
    render(container, getTemplate({ attr: 'bar' }));
    assert(container.querySelector('#target').getAttribute('attr') === 'bar');
    container.remove();
  });

  it('renders boolean attributes', () => {
    const getTemplate = ({ attr }) => {
      return html`<div id="target" ?attr="${attr}"></div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ attr: 'foo' }));
    assert(container.querySelector('#target').getAttribute('attr') === '');
    render(container, getTemplate({ attr: '' }));
    assert(container.querySelector('#target').getAttribute('attr') === null);
    render(container, getTemplate({ attr: 'bar' }));
    assert(container.querySelector('#target').getAttribute('attr') === '');
    render(container, getTemplate({ attr: undefined }));
    assert(container.querySelector('#target').getAttribute('attr') === null);
    render(container, getTemplate({ attr: 'baz' }));
    assert(container.querySelector('#target').getAttribute('attr') === '');
    render(container, getTemplate({ attr: false }));
    assert(container.querySelector('#target').getAttribute('attr') === null);
    render(container, getTemplate({ attr: true }));
    assert(container.querySelector('#target').getAttribute('attr') === '');
    container.remove();
  });

  it('renders defined attributes', () => {
    const getTemplate = ({ attr }) => {
      return html`<div id="target" ??attr="${attr}"></div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ attr: 'foo' }));
    assert(container.querySelector('#target').getAttribute('attr') === 'foo');
    render(container, getTemplate({ attr: '' }));
    assert(container.querySelector('#target').getAttribute('attr') === '');
    render(container, getTemplate({ attr: 'bar' }));
    assert(container.querySelector('#target').getAttribute('attr') === 'bar');
    render(container, getTemplate({ attr: undefined }));
    assert(container.querySelector('#target').getAttribute('attr') === null);
    render(container, getTemplate({ attr: 'baz' }));
    assert(container.querySelector('#target').getAttribute('attr') === 'baz');
    render(container, getTemplate({ attr: null }));
    assert(container.querySelector('#target').getAttribute('attr') === null);
    render(container, getTemplate({ attr: false }));
    assert(container.querySelector('#target').getAttribute('attr') === 'false');
    render(container, getTemplate({ attr: true }));
    assert(container.querySelector('#target').getAttribute('attr') === 'true');
    container.remove();
  });

  it('renders properties', () => {
    const getTemplate = ({ prop }) => {
      return html`\
        <div
          id="target"
          foo-bar
          .prop="${prop}">
        </div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ prop: 'foo' }));
    assert(container.querySelector('#target').prop === 'foo');
    render(container, getTemplate({ prop: 'bar' }));
    assert(container.querySelector('#target').prop === 'bar');
    container.remove();
  });

  it('maintains DOM nodes', () => {
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

  it('renders lists', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => html`<div>${item}</div>`)}
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

  it('renders lists with multiple elements', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => html`<div>${item}-</div><div>${item}</div>`)}
        </div>
      `;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ items: ['foo', 'bar', 'baz'] }));
    assert(container.querySelector('#target').childElementCount === 6);
    assert(container.querySelector('#target').children[0].textContent === 'foo-');
    assert(container.querySelector('#target').children[1].textContent === 'foo');
    assert(container.querySelector('#target').children[2].textContent === 'bar-');
    assert(container.querySelector('#target').children[3].textContent === 'bar');
    assert(container.querySelector('#target').children[4].textContent === 'baz-');
    assert(container.querySelector('#target').children[5].textContent === 'baz');
    container.remove();
  });

  it('renders lists with changing templates', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => item ? html`<div class="true"></div>` : html`<div class="false"></div>`)}
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

  it('renders lists with changing length', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(() => html`<div class="item"></div>`)}
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

  it('renders lists of lists', () => {
    const getTemplate = ({ items }) => {
      return html`<div id="target">${items.map(item => {
        return html`${item.items.map(subItem => {
          return html`<div>${`:${item.text}-${subItem.text}:`}</div>`;
        })}`;
      })}</div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({
      items: [
        { text: 'foo', items: [{ text: 'one' }] },
      ],
    }));
    assert(container.querySelector('#target').textContent === ':foo-one:');
    render(container, getTemplate({
      items: [
        { text: 'foo', items: [{ text: 'one' }, { text: 'two' }] },
        { text: 'bar', items: [{ text: 'one' }, { text: 'two' }] },
      ],
    }));
    assert(container.querySelector('#target').textContent === ':foo-one::foo-two::bar-one::bar-two:');
    render(container, getTemplate({
      items: [
        { text: 'foo', items: [{ text: 'one' }, { text: 'two' }] },
        { text: 'bar', items: [{ text: 'one' }, { text: 'two' }] },
        { text: 'baz', items: [{ text: 'one' }, { text: 'two' }] },
      ],
    }));
    assert(container.querySelector('#target').textContent === ':foo-one::foo-two::bar-one::bar-two::baz-one::baz-two:');
    container.remove();
  });

  it('renders multiple templates', () => {
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

  it('renders multiple templates (as content)', () => {
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

  it('renders elements with "/" characters in attributes', () => {
    // Note the "/" character.
    const getTemplate = ({ width, height }) => {
      return html`\
        <svg
          id="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          ??width="${width}"
          ??height="${height}">
          <circle id="circle" r="${width / 2}" cx="${width / 2}" cy="${height / 2}"></circle>
        </svg>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    const width = 24;
    const height = 24;
    render(container, getTemplate({ width, height }));
    const svgBox = container.querySelector('#svg').getBoundingClientRect();
    assert(svgBox.width === width);
    assert(svgBox.height === height);
    const circleBox = container.querySelector('#circle').getBoundingClientRect();
    assert(circleBox.width === width);
    assert(circleBox.height === height);
    container.remove();
  });

  it('renders elements with "<" or ">" characters in attributes', () => {
    // Note the "/", "<", and ">" characters.
    const getTemplate = ({ width, height }) => {
      return html`\
        <svg
          id="svg"
          class="<><></></>"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          ??width="${width}"
          ??height="${height}">
          <circle id="circle" r="${width / 2}" cx="${width / 2}" cy="${height / 2}"></circle>
        </svg>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    const width = 24;
    const height = 24;
    render(container, getTemplate({ width, height }));
    const svgBox = container.querySelector('#svg').getBoundingClientRect();
    assert(svgBox.width === width);
    assert(svgBox.height === height);
    const circleBox = container.querySelector('#circle').getBoundingClientRect();
    assert(circleBox.width === width);
    assert(circleBox.height === height);
    container.remove();
  });

  it('self-closing tags work', () => {
    const getTemplate = ({ type }) => {
      return html`<input ??type="${type}"/>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ type: null }));
    assert(container.querySelector('input').type === 'text');
    render(container, getTemplate({ type: 'checkbox' }));
    assert(container.querySelector('input').type === 'checkbox');
    container.remove();
  });

  it('textarea element content', () => {
    const getTemplate = ({ defaultValue }) => {
      return html`<textarea>${defaultValue}</textarea>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ defaultValue: 'foo' }));
    assert(container.querySelector('textarea').value === 'foo');
    container.remove();
  });

  it('renders instantiated elements as dumb text', () => {
    const getTemplate = ({ element }) => {
      return html`${element}`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ element: document.createElement('input') }));
    assert(container.childElementCount === 0);
    assert(container.textContent === '[object HTMLInputElement]');
    container.remove();
  });

  it('renders DocumentFragment nodes with simple append action', () => {
    const getTemplate = ({ fragment }) => {
      return html`${fragment}`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    const template = document.createElement('template');
    template.innerHTML = '<input>';
    render(container, getTemplate({ fragment: template.content.cloneNode(true) }));
    assert(container.childElementCount === 1);
    assert(container.children[0].localName === 'input');
    template.innerHTML = '<textarea></textarea>';
    render(container, getTemplate({ fragment: template.content.cloneNode(true) }));
    assert(container.childElementCount === 1);
    assert(container.children[0].localName === 'textarea');
    container.remove();
  });

  it('renders the same template result multiple times for', () => {
    const rawResult = html`<div id="target"></div>`;
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
    document.body.append(container1, container2);
    render(container1, rawResult);
    render(container2, rawResult);
    assert(!!container1.querySelector('#target'));
    assert(!!container2.querySelector('#target'));
    render(container1, null);
    render(container2, null);
    assert(!container1.querySelector('#target'));
    assert(!container2.querySelector('#target'));
    render(container1, rawResult);
    render(container2, rawResult);
    assert(!!container1.querySelector('#target'));
    assert(!!container2.querySelector('#target'));
    container1.remove();
    container2.remove();
  });
});

describe('html updaters', () => {
  // This is mainly for backwards compat, "nullish" is likely a better match.
  it('ifDefined', () => {
    const getTemplate = ({ maybe }) => {
      return html`<div id="target" maybe="${ifDefined(maybe)}"></div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ maybe: 'yes' }));
    assert(container.querySelector('#target').getAttribute('maybe') === 'yes');
    render(container, getTemplate({ maybe: undefined }));
    assert(container.querySelector('#target').getAttribute('maybe') === null);
    render(container, getTemplate({ maybe: false }));
    assert(container.querySelector('#target').getAttribute('maybe') === 'false');
    render(container, getTemplate({ maybe: null }));
    assert(container.querySelector('#target').getAttribute('maybe') === null);
    container.remove();
  });

  it('nullish', () => {
    const getTemplate = ({ maybe }) => {
      return html`<div id="target" maybe="${nullish(maybe)}"></div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ maybe: 'yes' }));
    assert(container.querySelector('#target').getAttribute('maybe') === 'yes');
    render(container, getTemplate({ maybe: undefined }));
    assert(container.querySelector('#target').getAttribute('maybe') === null);
    render(container, getTemplate({ maybe: false }));
    assert(container.querySelector('#target').getAttribute('maybe') === 'false');
    render(container, getTemplate({ maybe: null }));
    assert(container.querySelector('#target').getAttribute('maybe') === null);
    container.remove();
  });

  it('live', () => {
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

  it('unsafeHTML', () => {
    const getTemplate = ({ content }) => {
      return html`<div id="target">${unsafeHTML(content)}</div>`;
    };
    const container = document.createElement('div');
    document.body.append(container);
    render(container, getTemplate({ content: '<div id="injected">oh hai</div>' }));
    assert(!!container.querySelector('#injected'));
    render(container, getTemplate({ content: '<div id="booster">oh hai, again</div>' }));
    assert(!!container.querySelector('#booster'));
    container.remove();
  });

  // This is mainly for backwards compat, TBD if we deprecate or not.
  it('repeat works when called with all arguments', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${repeat(items, item => item.id, item => {
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

  it('repeat works when called with omitted lookup', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${repeat(items, item => {
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

    // Because "lookup" is omitted, we don't expect DOM nodes to remain after a shift.
    render(container, getTemplate({ items: [{ id: 'baz' }, { id: 'foo' }, { id: 'bar'}] }));
    assert(container.querySelector('#target').childElementCount === 3);
    assert(container.querySelector('#target').children[0] !== baz);
    assert(container.querySelector('#target').children[1] !== foo);
    assert(container.querySelector('#target').children[2] !== bar);
    container.remove();
  });

  it('repeat re-runs each time', () => {
    const getTemplate = ({ items, lookup }) => {
      return html`
      <div>
        <ul id="target">
          ${repeat(items, item => item.id, item => {
            return html`<li id="${item.id}">${lookup?.[item.id]}</li>`;
          })}
        </ul>
      </div>
    `;
    };
    const container = document.createElement('div');
    document.body.append(container);
    const items = [{ id: 'a' }, { id: 'b'}, { id: 'c' }];
    let lookup = { a: 'foo', b: 'bar', c: 'baz' };
    render(container, getTemplate({ items, lookup }));
    assert(container.querySelector('#target').childElementCount === 3);
    assert(container.querySelector('#a').textContent === 'foo');
    assert(container.querySelector('#b').textContent === 'bar');
    assert(container.querySelector('#c').textContent === 'baz');
    lookup = { a: 'fizzle', b: 'bop', c: 'fuzz' };
    render(container, getTemplate({ items, lookup }));
    assert(container.querySelector('#target').childElementCount === 3);
    assert(container.querySelector('#a').textContent === 'fizzle');
    assert(container.querySelector('#b').textContent === 'bop');
    assert(container.querySelector('#c').textContent === 'fuzz');
    container.remove();
  });

  it('map', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${map(items, item => item.id, item => {
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

  it('map: renders depth-first', async () => {
    const updates = [];
    class TestDepthFirstOuter extends HTMLElement {
      #item = null;
      set item(value) { updates.push(`outer-${value}`); this.#item = value; }
      get item() { return this.#item; }
      connectedCallback() {
        // Prevent property shadowing by deleting before setting on connect.
        const item = this.item ?? '???';
        Reflect.deleteProperty(this, 'item');
        Reflect.set(this, 'item', item);
      }
    }
    customElements.define('test-depth-first-outer', TestDepthFirstOuter);
    class TestDepthFirstInner extends HTMLElement {
      #item = null;
      set item(value) { updates.push(`inner-${value}`); this.#item = value; }
      get item() { return this.#item; }
      connectedCallback() {
        // Prevent property shadowing by deleting before setting on connect.
        const item = this.item ?? '???';
        Reflect.deleteProperty(this, 'item');
        Reflect.set(this, 'item', item);
      }
    }
    customElements.define('test-depth-first-inner', TestDepthFirstInner);

    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${map(items, item => item.id, item => {
            return html`
              <test-depth-first-outer class="outer" .item="${item.id}">
                <test-depth-first-inner class="inner" .item="${item.id}">
                </test-depth-first-inner>
              </test-depth-first-outer>
            `;
          })}
        </div>
      `;
    };
    const container = document.createElement('div');
    document.body.append(container);
    const items = [{ id: 'foo' }, { id: 'bar'}];
    render(container, getTemplate({ items }));
    await Promise.resolve();
    assert(updates[0] === 'outer-foo', updates[0]);
    assert(updates[1] === 'inner-foo', updates[1]);
    assert(updates[2] === 'outer-bar', updates[2]);
    assert(updates[3] === 'inner-bar', updates[3]);
    assert(updates.length === 4, updates);
    container.remove();
  });

  it('map: re-renders each time', () => {
    const getTemplate = ({ items, lookup }) => {
      return html`
        <div>
          <ul id="target">
            ${map(items, item => item.id, item => {
              return html`<li id="${ item.id }">${ lookup?.[item.id] }</li>`;
            })}
          </ul>
        </div>
      `;
    };
    const container = document.createElement('div');
    document.body.append(container);
    const items = [{ id: 'a' }, { id: 'b'}, { id: 'c' }];
    let lookup = { a: 'foo', b: 'bar', c: 'baz' };
    render(container, getTemplate({ items, lookup }));
    assert(container.querySelector('#target').childElementCount === 3);
    assert(container.querySelector('#a').textContent === 'foo');
    assert(container.querySelector('#b').textContent === 'bar');
    assert(container.querySelector('#c').textContent === 'baz');
    lookup = { a: 'fizzle', b: 'bop', c: 'fuzz' };
    render(container, getTemplate({ items, lookup }));
    assert(container.querySelector('#target').childElementCount === 3);
    assert(container.querySelector('#a').textContent === 'fizzle');
    assert(container.querySelector('#b').textContent === 'bop');
    assert(container.querySelector('#c').textContent === 'fuzz');
    container.remove();
  });

  it('map: template changes', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${map(items, item => item.id, item => {
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

  describe('changing content updaters', () => {
    // The template engine needs to clear content between cursors if the updater
    //  changes — it‘d be far too complex to try and allow one updater try and
    //  take over from a different one.
    const getTemplate = ({ value }) => html`<div id="target">${value}</div>`;
    const run = (...transitions) => {
      const container = document.createElement('div');
      document.body.append(container);
      for (const transition of transitions) {
        transition(container);
      }
      container.remove();
    };
    const toUndefinedContent = container => {
      render(container, getTemplate({ value: undefined }));
      assert(!!container.querySelector('#target'));
      assert(container.querySelector('#target').childElementCount === 0);
    };
    const toNullContent = container => {
      render(container, getTemplate({ value: null }));
      assert(!!container.querySelector('#target'));
      assert(container.querySelector('#target').childElementCount === 0);
    };
    const toTextContent = container => {
      render(container, getTemplate({ value: 'hi there' }));
      assert(!!container.querySelector('#target'));
      assert(container.querySelector('#target').childElementCount === 0);
      assert(container.querySelector('#target').textContent === 'hi there');
    };
    const toFragmentContent = container => {
      const fragment = new DocumentFragment();
      fragment.append(document.createElement('p'), document.createElement('p'));
      render(container, getTemplate({ value: fragment }));
      assert(!!container.querySelector('#target'));
      assert(container.querySelector('#target').childElementCount === 2);
      assert(container.querySelector('#target').children[0].localName === 'p');
      assert(container.querySelector('#target').children[1].localName === 'p');
    };
    const toArrayContent = container => {
      const items = [{ id: 'moo' }, { id: 'mar' }, { id: 'maz' }];
      render(container, getTemplate({
        value: items.map(item =>  html`<div id="${item.id}"></div>`),
      }));
      assert(!!container.querySelector('#target'));
      assert(!!container.querySelector('#moo'));
      assert(!!container.querySelector('#mar'));
      assert(!!container.querySelector('#maz'));
      assert(container.querySelector('#target').childElementCount === 3);
      assert(container.querySelector('#target').textContent === '', container.querySelector('#target').textContent);
    };
    const toMapContent = container => {
      const items = [{ id: 'foo' }, { id: 'bar' }];
      render(container, getTemplate({ 
        value: items.map(item => [item.id, html`<div id="${item.id}"></div>`]),
      }));
      assert(!!container.querySelector('#target'));
      assert(!!container.querySelector('#foo'));
      assert(!!container.querySelector('#bar'));
      assert(container.querySelector('#target').childElementCount === 2);
      assert(container.querySelector('#target').textContent === '');
    };

    it('can change from undefined content to null content', () => run(toUndefinedContent, toNullContent));
    it('can change from undefined content to text content', () => run(toUndefinedContent, toTextContent));
    it('can change from undefined content to fragment content', () => run(toUndefinedContent, toFragmentContent));
    it('can change from undefined content to array content', () => run(toUndefinedContent, toArrayContent));
    it('can change from undefined content to map content', () => run(toUndefinedContent, toMapContent));

    it('can change from null content to undefined content', () => run(toNullContent, toUndefinedContent));
    it('can change from null content to text content', () => run(toNullContent, toTextContent));
    it('can change from null content to fragment content', () => run(toNullContent, toFragmentContent));
    it('can change from null content to array content', () => run(toNullContent, toArrayContent));
    it('can change from null content to map content', () => run(toNullContent, toMapContent));

    it('can change from text content to undefined content', () => run(toTextContent, toUndefinedContent));
    it('can change from text content to null content', () => run(toTextContent, toNullContent));
    it('can change from text content to fragment content', () => run(toTextContent, toFragmentContent));
    it('can change from text content to array content', () => run(toTextContent, toArrayContent));
    it('can change from text content to map content', () => run(toTextContent, toMapContent));

    it('can change from fragment content to undefined content', () => run(toFragmentContent, toUndefinedContent));
    it('can change from fragment content to null content', () => run(toFragmentContent, toNullContent));
    it('can change from fragment content to text content', () => run(toFragmentContent, toTextContent));
    it('can change from fragment content to array content', () => run(toFragmentContent, toArrayContent));
    it('can change from fragment content to map content', () => run(toFragmentContent, toMapContent));

    it('can change from array content to undefined content', () => run(toArrayContent, toUndefinedContent));
    it('can change from array content to null content', () => run(toArrayContent, toNullContent));
    it('can change from array content to text content', () => run(toArrayContent, toTextContent));
    it('can change from array content to fragment content', () => run(toArrayContent, toFragmentContent));
    it('can change from array content to map content', () => run(toArrayContent, toMapContent));

    it('can change from map content to undefined content', () => run(toMapContent, toUndefinedContent));
    it('can change from map content to null content', () => run(toMapContent, toNullContent));
    it('can change from map content to text content', () => run(toMapContent, toTextContent));
    it('can change from map content to fragment content', () => run(toMapContent, toFragmentContent));
    it('can change from map content to array content', () => run(toMapContent, toArrayContent));
  });
});

describe('svg rendering', () => {
  it('renders a basic string', () => {
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

  it('renders lists', () => {
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
});

describe('svg updaters', () => {
  it('unsafeSVG', () => {
    const getTemplate = ({ content }) => {
      return html`
        <svg
          id="target"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          style="width: 100px; height: 100px;">
          ${unsafeSVG(content)}
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
});

describe('rendering errors', () => {
  describe('templating', () => {
    it('throws when given container is not a node', () => {
      let error;
      try {
        render({}, html``);
      } catch (e) {
        error = e;
      }
      assert(error?.message === 'Unexpected non-node render container "[object Object]".', error.message);
    });

    it('throws when attempting to interpolate within a style tag', () => {
      const getTemplate = ({ color }) => {
        return html`
          <style id="target">
            #target {
              background-color: ${color};
            }
          </style>
        `;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, getTemplate({ color: 'url(evil-url)' }));
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Interpolation of "style" tags is not allowed.`, error.message);
      container.remove();
    });

    it('throws when attempting to interpolate within a script tag', () => {
      const getTemplate = ({ message }) => {
        return html`
          <script id="target">
            console.log('${message}');
          </script>
        `;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, getTemplate({ message: '\' + prompt(\'evil\') + \'' }));
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Interpolation of "script" tags is not allowed.`, error.message);
      container.remove();
    });

    it('throws when attempting non-trivial interpolation of a textarea tag', () => {
      const getTemplate = ({ content }) => {
        return html`<textarea id="target">please ${content} no</textarea>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, getTemplate({ content: 'foo' }));
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Only basic interpolation of "textarea" tags is allowed.`, error.message);
      container.remove();
    });

    it('throws when attempting non-trivial interpolation of a title tag', () => {
      const getTemplate = ({ content }) => {
        return html`<title id="target">please ${content} no</title>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, getTemplate({ defaultValue: 'foo' }));
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Only basic interpolation of "title" tags is allowed.`, error.message);
      container.remove();
    });

    it('throws for unquoted attributes', () => {
      const rawResult = html`<div id="target" not-ok=${'foo'}>Gotta double-quote those.</div>`;
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, rawResult);
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Found invalid template on or after line 1 in substring \`<div id="target" not-ok=\`. Failed to parse \` not-ok=\`.`, error.message);
      container.remove();
    });

    it('throws for single-quoted attributes', () => {
      const rawResult = html`\n<div id="target" not-ok='${'foo'}'>Gotta double-quote those.</div>`;
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, rawResult);
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Found invalid template on or after line 2 in substring \`\n<div id="target" not-ok='\`. Failed to parse \` not-ok='\`.`, error.message);
      container.remove();
    });

    it('throws for unquoted properties', () => {
      const rawResult = html`\n\n\n<div id="target" .notOk=${'foo'}>Gotta double-quote those.</div>`;
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, rawResult);
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Found invalid template on or after line 4 in substring \`\n\n\n<div id="target" .notOk=\`. Failed to parse \` .notOk=\`.`, error.message);
      container.remove();
    });

    it('throws for single-quoted properties', () => {
      const rawResult = html`<div id="target" .notOk='${'foo'}'>Gotta double-quote those.</div>`;
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, rawResult);
      } catch (e) {
        error = e;
      }
      assert(error?.message === `Found invalid template on or after line 1 in substring \`<div id="target" .notOk='\`. Failed to parse \` .notOk='\`.`, error.message);
      container.remove();
    });

    it('throws for empty DocumentFragment value binding', () => {
      const expected = 'Unexpected child element count of zero for given DocumentFragment.';
      const getTemplate = ({ fragment }) => {
        return html`<div id="target">${fragment}</div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ fragment: new DocumentFragment() }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });
  });

  describe('ifDefined', () => {
    it('throws if used on a "boolean"', () => {
      const expected = 'The ifDefined update must be used on an attribute, not on a boolean attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ?maybe="${ifDefined(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "property"', () => {
      const expected = 'The ifDefined update must be used on an attribute, not on a property.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" .maybe="${ifDefined(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "content"', () => {
      const expected = 'The ifDefined update must be used on an attribute, not on content.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target">${ifDefined(maybe)}</div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "text"', () => {
      const expected = 'The ifDefined update must be used on an attribute, not on text content.';
      const getTemplate = ({ maybe }) => {
        return html`<textarea id="target">${ifDefined(maybe)}</textarea>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });
  });

  describe('nullish', () => {
    it('throws if used on a "boolean"', () => {
      const expected = 'The nullish update must be used on an attribute, not on a boolean attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ?maybe="${nullish(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "property"', () => {
      const expected = 'The nullish update must be used on an attribute, not on a property.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" .maybe="${nullish(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "content"', () => {
      const expected = 'The nullish update must be used on an attribute, not on content.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target">${nullish(maybe)}</div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "text"', () => {
      const expected = 'The nullish update must be used on an attribute, not on text content.';
      const getTemplate = ({ maybe }) => {
        return html`<textarea id="target">${nullish(maybe)}</textarea>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });
  });

  describe('live', () => {
    it('throws if used on an "attribute"', () => {
      const expected = 'The live update must be used on a property, not on an attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" maybe="${live(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "boolean"', () => {
      const expected = 'The live update must be used on a property, not on a boolean attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ?maybe="${live(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "defined"', () => {
      const expected = 'The live update must be used on a property, not on a defined attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ??maybe="${live(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "content"', () => {
      const expected = 'The live update must be used on a property, not on content.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target">${live(maybe)}</div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "text"', () => {
      const expected = 'The live update must be used on a property, not on text content.';
      const getTemplate = ({ maybe }) => {
        return html`<textarea id="target">${live(maybe)}</textarea>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });
  });

  describe('unsafeHTML', () => {
    it('throws if used on an "attribute"', () => {
      const expected = 'The unsafeHTML update must be used on content, not on an attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" maybe="${unsafeHTML(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "boolean"', () => {
      const expected = 'The unsafeHTML update must be used on content, not on a boolean attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ?maybe="${unsafeHTML(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "defined"', () => {
      const expected = 'The unsafeHTML update must be used on content, not on a defined attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ??maybe="${unsafeHTML(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with a "property"', () => {
      const expected = 'The unsafeHTML update must be used on content, not on a property.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" .maybe="${unsafeHTML(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "text"', () => {
      const expected = 'The unsafeHTML update must be used on content, not on text content.';
      const getTemplate = ({ maybe }) => {
        return html`<textarea id="target">${unsafeHTML(maybe)}</textarea>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws for non-string value', () => {
      const getTemplate = ({ content }) => {
        return html`
          <div id="target">
            ${unsafeHTML(content)}
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
      assert(error?.message === 'Unexpected unsafeHTML value "null".', error?.message);
      container.remove();
    });
  });

  describe('unsafeSVG', () => {
    it('throws if used on an "attribute"', () => {
      const expected = 'The unsafeSVG update must be used on content, not on an attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" maybe="${unsafeSVG(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "boolean"', () => {
      const expected = 'The unsafeSVG update must be used on content, not on a boolean attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ?maybe="${unsafeSVG(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used on a "defined"', () => {
      const expected = 'The unsafeSVG update must be used on content, not on a defined attribute.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" ??maybe="${unsafeSVG(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with a "property"', () => {
      const expected = 'The unsafeSVG update must be used on content, not on a property.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" .maybe="${unsafeSVG(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if used with "text"', () => {
      const expected = 'The unsafeSVG update must be used on content, not on text content.';
      const getTemplate = ({ maybe }) => {
        return html`<textarea id="target">${unsafeSVG(maybe)}</textarea>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: 'yes' }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws for non-string value', () => {
    const getTemplate = ({ content }) => {
      return html`
        <svg id="target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          ${unsafeSVG(content)}
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
    assert(error?.message === 'Unexpected unsafeSVG value "null".', error?.message);
    container.remove();
  });
  });

  describe('map', () => {
    it('throws if identify is not a function', () => {
      const expected = 'Unexpected map identify "undefined" provided, expected a function.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" maybe="${map(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: ['yes'] }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if callback is not a function', () => {
      const expected = 'Unexpected map callback "undefined" provided, expected a function.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" maybe="${map(maybe, () => {})}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: ['yes'] }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws for duplicate identify responses on initial render', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${map(array, () => 'foo', () => html``)}
          </div>
        `;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, getTemplate({ array: [1, 2, 3] }));
      } catch (e) {
        error = e;
      }
      assert(error?.message === 'Unexpected duplicate key found in map entry at 1 "foo".', error?.message);
      container.remove();
    });

    it('throws for duplicate identify responses on subsequent render', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${map(array, item => String(item), () => html``)}
          </div>
        `;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      render(container, getTemplate({ array: [1, 2, 3] }));
      try {
        render(container, getTemplate({ array: [1, 2, 3, 4, 4] }));
      } catch (e) {
        error = e;
      }
      assert(error?.message === 'Unexpected duplicate key found in map entry at 4 "4".', error?.message);
      container.remove();
    });

    it('throws for non-array value', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${map(array, () => {}, () => html``)}
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
      assert(error?.message === 'Unexpected map items "5" provided, expected an array.', error?.message);
      container.remove();
    });

    it('throws for non-template callback value', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${map(array, item => item.id, item => item.value ? html`<div>${item.value}</div>` : null)}
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
      assert(error?.message === 'Unexpected non-template value found in map entry at 0 "null".', error?.message);
      container.remove();
    });

    it('throws for non-template callback value (on re-render)', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${map(array, item => item.id, item => item.value ? html`<div>${item.value}</div>` : null)}
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
      assert(error?.message === 'Unexpected non-template value found in map entry at 0 "null".', error?.message);
      container.remove();
    });
  });

  describe('repeat', () => {
    it('throws if callback is not a function (1)', () => {
      const expected = 'Unexpected repeat identify "undefined" provided, expected a function.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" maybe="${repeat(maybe)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: ['yes'] }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws if callback is not a function (2)', () => {
      const expected = 'Unexpected repeat callback "5" provided, expected a function.';
      const getTemplate = ({ maybe }) => {
        return html`<div id="target" maybe="${repeat(maybe, 5)}"></div>`;
      };
      const container = document.createElement('div');
      document.body.append(container);
      let actual;
      try {
        render(container, getTemplate({ maybe: ['yes'] }));
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
      container.remove();
    });

    it('throws for non-array value', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${repeat(array, () => {}, () => html``)}
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
      assert(error?.message === 'Unexpected repeat items "5" provided, expected an array.', error?.message);
      container.remove();
    });

    it('throws for non-template callback value', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${repeat(array, item => item.id, item => item.value ? html`<div>${item.value}</div>` : null)}
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
      assert(error?.message === 'Unexpected non-template value found in map entry at 0 "null".', error?.message);
      container.remove();
    });

    it('throws for non-template callback value (on re-render)', () => {
      const getTemplate = ({ array }) => {
        return html`
          <div id="target">
            ${repeat(array, item => item.id, item => item.value ? html`<div>${item.value}</div>` : null)}
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
      assert(error?.message === 'Unexpected non-template value found in map entry at 0 "null".', error?.message);
      container.remove();
    });
  });

  describe('native array', () => {
    it('throws for list with non-template value for array item', () => {
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
      assert(error?.message === 'Unexpected non-template value found in array item at 0 "null".', error?.message);
      container.remove();
    });

    it('throws for list with non-template value on re-render', () => {
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
      assert(error?.message === 'Unexpected non-template value found in array item at 0 "null".', error?.message);
      container.remove();
    });

    it('throws for list with empty map entry', () => {
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, html`<div>${[[]]}</div>`);
      } catch (e) {
        error = e;
      }
      assert(error?.message === 'Unexpected entry length found in map entry at 0 with length "0".', error?.message);
      container.remove();
    });

    it('throws for list with non-string key in a map entry', () => {
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, html`<div>${[[1, html``]]}</div>`);
      } catch (e) {
        error = e;
      }
      assert(error?.message === 'Unexpected non-string key found in map entry at 0 "1".', error?.message);
      container.remove();
    });

    it('throws for list with duplicated key in a map entry', () => {
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, html`<div>${[['1', html``], ['2', html``], ['1', html``]]}</div>`);
      } catch (e) {
        error = e;
      }
      assert(error?.message === 'Unexpected duplicate key found in map entry at 2 "1".', error?.message);
      container.remove();
    });

    it('throws for list with non-template values in a map entry', () => {
      const container = document.createElement('div');
      document.body.append(container);
      let error;
      try {
        render(container, html`<div>${[['1', null]]}</div>`);
      } catch (e) {
        error = e;
      }
      assert(error?.message === 'Unexpected non-template value found in map entry at 0 "null".', error?.message);
      container.remove();
    });

  });
});

describe('interface migration errors', () => {
  const removedInterfaceNames = [
    'asyncAppend', 'asyncReplace', 'cache', 'classMap', 'directive', 'guard',
    'styleMap', 'templateContent', 'until',
  ];
  for (const name of removedInterfaceNames) {
    it(`warns that "${name}" no longer exists.`, () => {
      const expected = `Removed "${name}" from default templating engine interface. Import and plug-in "lit-html" as your element's templating engine if you want this functionality.`;
      let actual;
      try {
        XElement.templateEngine[name]();
      } catch (error) {
        actual = error.message;
      }
      assert(!!actual, 'No error was thrown.');
      assert(actual === expected, actual);
    });
  }
});

it('confirm that deprecation warnings are still necessary', () => {
  for (const message of localMessages) {
    assert(seen.has(message), `Unused deprecation warning: ${message}`);
  }
});
