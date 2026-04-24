import { assert, suite, test } from '@netflix/x-test/x-test.js';
import { render, html } from '../x-template.js';

suite('html rendering', () => {
  test('renders empty template', () => {
    const container = document.createElement('div');
    render(container, html``);
    assert(container.childNodes.length === 0);
  });

  test('renders basic string', () => {
    const container = document.createElement('div');
    render(container, html`<div id="target">No interpolation.</div>`);
    assert(container.childNodes.length === 1);
    assert(container.querySelector('#target').textContent === 'No interpolation.');
  });

  test('renders comments', () => {
    const container = document.createElement('div');
    render(container, html`<!--This is HTML: "&ldquo;<div></div>&rdquo;"-->`);
    assert(container.childNodes.length === 1);
    // Note that character references are _not_ replaced — this is _just text_.
    assert(container.childNodes[0].textContent === 'This is HTML: "&ldquo;<div></div>&rdquo;"');
  });

  test('renders void tags', () => {
    const container = document.createElement('div');
    render(container, html`<input><br><input>`);
    assert(container.childNodes.length === 3);
    assert(container.childNodes[0].localName === 'input');
    assert(container.childNodes[1].localName === 'br');
    assert(container.childNodes[2].localName === 'input');
  });

  test('renders template elements', () => {
    // It’s important that the _content_ is populated here. Not the template.
    const container = document.createElement('div');
    render(container, html`<template><div><p></p></div></template>`);
    assert(!!container.querySelector('template'));
    assert(container.querySelector('template').content.childElementCount === 1);
    assert(container.querySelector('template').content.children[0].childElementCount === 1);
    assert(container.querySelector('template').content.children[0].children[0].localName === 'p');
  });

  test('renders pre elements with optional, initial newline', () => {
    const expected = '        hi\n      ';
    const container = document.createElement('div');
    render(container, html`
      <pre>
        <span>hi</span>
      </pre>
    `);
    assert(container.querySelector('pre').textContent === expected); // first newline is removed
  });

  test('renders named html entities in text content', () => {
    const container = document.createElement('div');
    render(container, html`<div>${'--'}&#123;&lt;&amp;&gt;&apos;&quot;&#x007D;${'--'}</div>`);
    assert(container.childNodes.length === 1);
    assert(container.childNodes[0].textContent === `--{<&>'"}--`);
  });

  test('renders direct references in replaceable character data', () => {
    const container = document.createElement('div');
    render(container, html`&amp;&lt;&gt;&quot;&apos;`);
    assert(container.textContent === `&<>"'`);
  });

  test('renders references for commonly-used characters', () => {
    const container = document.createElement('div');
    render(container, html`&nbsp;&lsquo;&rsquo;&ldquo;&rdquo;&ndash;&mdash;&hellip;&bull;&middot;&dagger;`);
    assert(container.textContent === '\u00A0\u2018\u2019\u201C\u201D\u2013\u2014\u2026\u2022\u00B7\u2020');
  });

  test('renders named references which require surrogate pairs', () => {
    const container = document.createElement('div');
    render(container,  html`<div>--&bopf;&bopf;--&bopf;--</div>`);
    assert(container.children[0].textContent === `--\uD835\uDD53\uD835\uDD53--\uD835\uDD53--`);
  });

  test('leaves malformed references as-is', () => {
    const container = document.createElement('div');
    render(container,  html`<div>--&:^);--</div>`);
    assert(container.children[0].textContent === `--&:^);--`);
  });

  test('renders interpolated content without parsing', () => {
    const userContent = '<a href="https://evil.com">Click Me!</a>';
    const container = document.createElement('div');
    render(container, html`<div id="target">${userContent}</div>`);
    assert(container.querySelector('#target').textContent === userContent);
  });

  test('renders null / undefined templates', () => {
    const container = document.createElement('div');
    render(container, html`<div></div>`);
    assert(!!container.childNodes.length);
    render(container, null);
    assert(!container.childNodes.length);
    render(container, html`<div></div>`);
    assert(!!container.childNodes.length);
    render(container, undefined);
    assert(!container.childNodes.length);
  });

  test('renders solo interpolation', () => {
    const container = document.createElement('div');
    render(container, html`${''}`);
    assert(container.childNodes.length === 3);
    assert(container.childNodes[0].nodeType === Node.COMMENT_NODE);
    assert(container.childNodes[0].data === '');
    assert(container.childNodes[1].nodeType === Node.TEXT_NODE);
    assert(container.childNodes[1].textContent === '');
    assert(container.childNodes[2].nodeType === Node.COMMENT_NODE);
    assert(container.childNodes[2].data === '');
  });

  test('renders adjacent interpolations', () => {
    const container = document.createElement('div');
    render(container, html`${'hi'}${'there'}`);
    assert(container.childNodes.length === 6);
    assert(container.childNodes[0].nodeType === Node.COMMENT_NODE);
    assert(container.childNodes[0].data === '');
    assert(container.childNodes[1].nodeType === Node.TEXT_NODE);
    assert(container.childNodes[1].textContent === 'hi');
    assert(container.childNodes[2].nodeType === Node.COMMENT_NODE);
    assert(container.childNodes[2].data === '');
    assert(container.childNodes[3].nodeType === Node.COMMENT_NODE);
    assert(container.childNodes[3].data === '');
    assert(container.childNodes[4].nodeType === Node.TEXT_NODE);
    assert(container.childNodes[4].textContent === 'there');
    assert(container.childNodes[5].nodeType === Node.COMMENT_NODE);
    assert(container.childNodes[5].data === '');
  });

  test('renders interpolated content', () => {
    const getTemplate = ({ content }) => {
      return html`<div id="target">a b ${content}</div>`;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ content: 'Interpolated.' }));
    assert(container.querySelector('#target').textContent === 'a b Interpolated.');
    render(container, getTemplate({ content: 'Updated.' }));
    assert(container.querySelector('#target').textContent === 'a b Updated.');
  });

  // Unlike a NodeList, a NamedNodeMap (i.e., “.attributes”) is not technically
  //  ordered in any way. This test just confirms that the template engine logic
  //  doesn’t get confused in any way post-parse.
  test('renders elements with many attributes in a weird order', () => {
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
  });

  test('renders multiple, interpolated content', () => {
    const container = document.createElement('div');
    render(container, html`
      <div id="target">one: ${'ONE'} / two: ${'TWO'}</div>
    `);
    assert(container.querySelector('#target').textContent === 'one: ONE / two: TWO');
  });

  test('renders nested content', () => {
    const getTemplate = ({ show, nestedContent }) => {
      return html`
        <div id="target">
          ${show ? html`<span id="conditional">${nestedContent}</span>` : null}
        </div>
      `;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ show: true, nestedContent: 'oh hai' }));
    assert(!!container.querySelector('#conditional'));
    render(container, getTemplate({ show: false, nestedContent: 'oh hai' }));
    assert(!container.querySelector('#conditional'));
    render(container, getTemplate({ show: true, nestedContent: 'oh hai' }));
    assert(container.querySelector('#conditional').textContent === 'oh hai');
    render(container, getTemplate({ show: true, nestedContent: 'k bye' }));
    assert(container.querySelector('#conditional').textContent === 'k bye');
  });

  test('renders attributes', () => {
    const getTemplate = ({ attr, content }) => {
      return html`<div id="target" attr="${attr}" f="b">Something<span>${content}</span></div>`;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ attr: 'foo' }));
    assert(container.querySelector('#target').getAttribute('attr') === 'foo');
    render(container, getTemplate({ attr: 'bar' }));
    assert(container.querySelector('#target').getAttribute('attr') === 'bar');
  });

  test('renders references in attribute values', () => {
    const container = document.createElement('div');
    render(container, html`<div foo="--&#123;&lt;&amp;&gt;&apos;&quot;&#x007D;--"></div>`);
    assert(container.childElementCount === 1);
    assert(container.children[0].getAttribute('foo') === `--{<&>'"}--`);
  });

  test('renders boolean attributes', () => {
    const getTemplate = ({ attr }) => {
      return html`<div id="target" ?attr="${attr}"></div>`;
    };
    const container = document.createElement('div');
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
  });

  test('renders defined attributes', () => {
    const getTemplate = ({ attr }) => {
      return html`<div id="target" ??attr="${attr}"></div>`;
    };
    const container = document.createElement('div');
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
  });

  test('renders properties', () => {
    const getTemplate = ({ prop }) => {
      return html`
        <div
          id="target"
          foo-bar
          .prop="${prop}">
        </div>`;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ prop: 'foo' }));
    assert(container.querySelector('#target').prop === 'foo');
    render(container, getTemplate({ prop: 'bar' }));
    assert(container.querySelector('#target').prop === 'bar');
  });

  test('renders “on*” attributes as event handlers', () => {
    const container = document.createElement('div');
    document.body.append(container);
    render(container, html`<div onclick="this.textContent = '&hellip;hi&hellip;';"></div>`);
    container.firstElementChild.click();
    // Because attributes have _replaceable_ content, the “&hellip;” should be
    //  immediately replaced and injected as the actual character “…” within the
    //  to-be-evaluated JS script. The default template engine doesn’t allow 
    //  any character escapes, so there is no way to pass “\u2026” as we can
    //  below in the interpolated property test.
    assert(container.firstElementChild.textContent === '…hi…');
    container.remove();
  });

  test('renders “on*” properties as event handlers', () => {
    const container = document.createElement('div');
    document.body.append(container);
    render(container, html`<div .onclick="${function() { this.textContent = '…hi\u2026'; }}"></div>`);
    container.firstElementChild.click();
    // Note that the “\u2026” has _nothing_ to do with our parsing logic. It
    //  simply is interpreted as the literal “…” character as part of an actual
    //  function reference which is bound to “onclick” as a property.
    assert(container.firstElementChild.textContent === '…hi…');
    container.remove();
  });

  test('maintains DOM nodes', () => {
    const getTemplate = ({ content }) => {
      return html`<div>${content}</div>`;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ content: 'foo' }));
    container.querySelector('div').classList.add('state');
    assert(container.querySelector('div').textContent === 'foo');
    assert(container.querySelector('div').classList.contains('state'));
    render(container, getTemplate({ content: 'bar' }));
    assert(container.querySelector('div').textContent === 'bar');
    assert(container.querySelector('div').classList.contains('state'));
  });

  test('renders lists', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => html`<div>${item}</div>`)}
        </div>
      `;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ items: ['foo', 'bar', 'baz'] }));
    assert(container.querySelector('#target').childElementCount === 3);
    assert(container.querySelector('#target').children[0].textContent === 'foo');
    assert(container.querySelector('#target').children[1].textContent === 'bar');
    assert(container.querySelector('#target').children[2].textContent === 'baz');
  });

  test('renders lists with multiple elements', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => html`<div>${item}-</div><div>${item}</div>`)}
        </div>
      `;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ items: ['foo', 'bar', 'baz'] }));
    assert(container.querySelector('#target').childElementCount === 6);
    assert(container.querySelector('#target').children[0].textContent === 'foo-');
    assert(container.querySelector('#target').children[1].textContent === 'foo');
    assert(container.querySelector('#target').children[2].textContent === 'bar-');
    assert(container.querySelector('#target').children[3].textContent === 'bar');
    assert(container.querySelector('#target').children[4].textContent === 'baz-');
    assert(container.querySelector('#target').children[5].textContent === 'baz');
  });

  test('renders lists with changing templates', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => item ? html`<div class="true"></div>` : html`<div class="false"></div>`)}
        </div>
      `;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ items: [true, true, true] }));
    assert(container.querySelector('#target').childElementCount === 3);
    assert(container.querySelector('#target').children[0].classList.contains('true'));
    assert(container.querySelector('#target').children[1].classList.contains('true'));
    assert(container.querySelector('#target').children[2].classList.contains('true'));
    render(container, getTemplate({ items: [true, false, true] }));
    assert(container.querySelector('#target').children[0].classList.contains('true'));
    assert(container.querySelector('#target').children[1].classList.contains('false'));
    assert(container.querySelector('#target').children[2].classList.contains('true'));
  });

  test('renders lists with changing length', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(() => html`<div class="item"></div>`)}
        </div>
      `;
    };
    const container = document.createElement('div');

    // Render 0 > 1 > 2
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: [1] }));
    assert(container.querySelector('#target').childElementCount === 1);
    render(container, getTemplate({ items: [1, 2] }));
    assert(container.querySelector('#target').childElementCount === 2);

    // Render 2 > 1 > 0
    render(container, getTemplate({ items: [1, 2] }));
    assert(container.querySelector('#target').childElementCount === 2);
    render(container, getTemplate({ items: [1] }));
    assert(container.querySelector('#target').childElementCount === 1);
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);

    // Render 0 > 1 > 0 > 1
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: [1] }));
    assert(container.querySelector('#target').childElementCount === 1);
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: [1] }));
    assert(container.querySelector('#target').childElementCount === 1);

    // Render 0 > 2 > 0 > 2
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: [1, 2] }));
    assert(container.querySelector('#target').childElementCount === 2);
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: [1, 2] }));
    assert(container.querySelector('#target').childElementCount === 2);
  });

  test('renders lists of lists', () => {
    const getTemplate = ({ items }) => {
      return html`<div id="target">${items.map(item => {
        return html`${item.items.map(subItem => {
          return html`<div>${`:${item.text}-${subItem.text}:`}</div>`;
        })}`;
      })}</div>`;
    };
    const container = document.createElement('div');
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
  });

  test('renders multiple templates', () => {
    const getTemplate = ({ content }) => {
      if (content) {
        return html`<div id="content">${content}</div>`;
      } else {
        return html`<div id="empty"></div>`;
      }
    };
    const container = document.createElement('div');
    render(container, getTemplate({ content: 'oh hai' }));
    assert(!!container.querySelector('#content'));
    assert(!container.querySelector('#empty'));
    render(container, getTemplate({ content: '' }));
    assert(!container.querySelector('#content'));
    assert(!!container.querySelector('#empty'));
  });

  test('renders multiple templates (as content)', () => {
    const getTemplate = ({ content }) => {
      return html`
        <div id="target">
          ${content ? html`<div id="content">${content}</div>` : html`<div id="empty"></div>`}
        </div>
      `;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ content: 'oh hai' }));
    assert(!!container.querySelector('#content'));
    assert(!container.querySelector('#empty'));
    render(container, getTemplate({ content: '' }));
    assert(!container.querySelector('#content'));
    assert(!!container.querySelector('#empty'));
  });

  test('renders interpolated textarea (text binding)', () => {
    const getTemplate = ({ defaultValue }) => {
      return html`<textarea id="target">${defaultValue}</textarea>`;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ defaultValue: 'default' }));
    assert(container.childElementCount === 1);
    assert(!!container.querySelector('#target'));
    assert(container.querySelector('#target').textContent === 'default');
  });

  test('renders instantiated elements as dumb text', () => {
    const getTemplate = ({ element }) => {
      return html`${element}`;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ element: document.createElement('input') }));
    assert(container.childElementCount === 0);
    assert(container.textContent === '[object HTMLInputElement]');
  });

  test('renders DocumentFragment nodes with simple append action', () => {
    const getTemplate = ({ fragment }) => {
      return html`${fragment}`;
    };
    const container = document.createElement('div');
    const template = document.createElement('template');
    template.setHTMLUnsafe('<input>');
    render(container, getTemplate({ fragment: template.content.cloneNode(true) }));
    assert(container.childElementCount === 1);
    assert(container.children[0].localName === 'input');
    template.setHTMLUnsafe('<textarea></textarea>');
    render(container, getTemplate({ fragment: template.content.cloneNode(true) }));
    assert(container.childElementCount === 1);
    assert(container.children[0].localName === 'textarea');
    template.setHTMLUnsafe('');
    assert(template.content.childNodes.length === 0); // Ensure it’s empty.
    render(container, getTemplate({ fragment: template.content.cloneNode(true) }));
    assert(container.childNodes.length === 2); // Only internal cursors exist.
    assert(container.childNodes[0].nodeType === Node.COMMENT_NODE);
    assert(container.childNodes[1].nodeType === Node.COMMENT_NODE);
  });

  test('renders the same template result multiple times for', () => {
    const rawResult = html`<div id="target"></div>`;
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
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
  });

  // The naming of this test is a little nuanced. Authors expect a custom
  //  element’s constructor to be called _exactly once_ per new instance of that
  //  element in the DOM. Previous to this test, constructors were invoked
  //  during template analysis when we computed a document fragment for later
  //  use as a clone base.
  test('does not call custom element constructor during template analysis', () => {
    let constructorCount = 0;
    class PhantomTestElement extends HTMLElement {
      constructor() {
        super();
        constructorCount++;
      }
    }
    customElements.define('phantom-test-element', PhantomTestElement);

    const container = document.createElement('div');
    document.body.append(container);
    render(container, html`<phantom-test-element></phantom-test-element>`);
    assert(constructorCount === 1, `Expected 1 constructor call, got ${constructorCount}`);
    container.remove();
  });

  test('causes single connect / disconnect for re-rendered elements', () => {
    let connects = 0;
    let disconnects = 0;
    class TestConnectDisconnect extends HTMLElement {
      connectedCallback() { connects++; }
      disconnectedCallback() { disconnects++; }
    }
    customElements.define('test-connect-disconnect', TestConnectDisconnect);

    const getTemplate = ({ text }) => {
      return html`
        <div id="target">
          <test-connect-disconnect>${text}</test-connect-disconnect>
        </div>
      `;
    };
    const container = document.createElement('div');
    document.body.append(container);

    assert(connects === 0);
    assert(disconnects === 0);

    render(container, getTemplate({ text: 'foo' }));

    assert(connects === 1);
    assert(disconnects === 0);

    render(container, getTemplate({ text: 'bar' }));

    assert(connects === 1);
    assert(disconnects === 0);

    render(container, null);

    assert(connects === 1);
    assert(disconnects === 1);
  
    container.remove();
  });

  test('native map renders basic template', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => [
            item.id,
            html`<div id="${item.id}" class="item">${item.id}</div>`,
          ])}
        </div>
      `;
    };
    const container = document.createElement('div');
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
  });

  test('native map renders depth-first', async () => {
    const updates = [];
    class TestDepthFirstOuter extends HTMLElement {
      #item = null;
      set item(value) { updates.push(`outer-${value}`); this.#item = value; }
      get item() { return this.#item; }
    }
    customElements.define('test-depth-first-outer', TestDepthFirstOuter);
    class TestDepthFirstInner extends HTMLElement {
      #item = null;
      set item(value) { updates.push(`inner-${value}`); this.#item = value; }
      get item() { return this.#item; }
    }
    customElements.define('test-depth-first-inner', TestDepthFirstInner);

    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => [
            item.id,
            html`
              <test-depth-first-outer class="outer" .item="${item.id}">
                <test-depth-first-inner class="inner" .item="${item.id}">
                </test-depth-first-inner>
              </test-depth-first-outer>
            `,
          ])}
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
    assert(updates.length === 4, JSON.stringify(updates, null, 2));
    container.remove();
  });

  test('native map re-renders each time', () => {
    const getTemplate = ({ items, lookup }) => {
      return html`
        <div>
          <ul id="target">
            ${items.map(item => [
              item.id,
              html`<li id="${ item.id }">${ lookup?.[item.id] }</li>`,
            ])}
          </ul>
        </div>
      `;
    };
    const container = document.createElement('div');
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
  });

  test('native map renders template changes', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => [
            item.id,
            item.show
              ? html`<div id="${item.id}" class="item">${item.id}</div>`
              : html`<div id="${item.id}" class="item"></div>`,
          ])}
        </div>
      `;
    };
    const container = document.createElement('div');
    render(container, getTemplate({ items: [{ id: 'foo', show: true }] }));
    const foo = container.querySelector('#foo');
    assert(container.querySelector('#target').childElementCount === 1);
    assert(!!foo);
    assert(container.querySelector('#target').children[0] === foo);
    render(container, getTemplate({ items: [{ id: 'foo', show: false }] }));
    assert(container.querySelector('#target').childElementCount === 1);
    assert(!!container.querySelector('#foo'));
    assert(container.querySelector('#target').children[0] !== foo);
  });

  test('native map with changing length', () => {
    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => [item, html`<div class="item"></div>`])}
        </div>
      `;
    };
    const container = document.createElement('div');

    // Render 0 > 1 > 2
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: ['1'] }));
    assert(container.querySelector('#target').childElementCount === 1);
    render(container, getTemplate({ items: ['1', '2'] }));
    assert(container.querySelector('#target').childElementCount === 2);

    // Render 2 > 1 > 0
    render(container, getTemplate({ items: ['1', '2'] }));
    assert(container.querySelector('#target').childElementCount === 2);
    render(container, getTemplate({ items: ['1'] }));
    assert(container.querySelector('#target').childElementCount === 1);
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);

    // Render 0 > 1 > 0 > 1
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: ['1'] }));
    assert(container.querySelector('#target').childElementCount === 1);
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: ['1'] }));
    assert(container.querySelector('#target').childElementCount === 1);

    // Render 0 > 2 > 0 > 2
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: ['1', '2'] }));
    assert(container.querySelector('#target').childElementCount === 2);
    render(container, getTemplate({ items: [] }));
    assert(container.querySelector('#target').childElementCount === 0);
    render(container, getTemplate({ items: ['1', '2'] }));
    assert(container.querySelector('#target').childElementCount === 2);
  });

  // TODO: #254: Uncomment “moves” lines when we leverage “moveBefore”.
  test('native map does not cause disconnectedCallback on prefix removal', () => {
    let connects = 0;
    // let moves = 0;
    let disconnects = 0;
    class TestPrefixRemoval extends HTMLElement {
      connectedCallback() { connects++; }
      // connectedMoveCallback() { moves++; }
      disconnectedCallback() { disconnects++; }
    }
    customElements.define('test-prefix-removal', TestPrefixRemoval);

    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => [
            item.id,
            html`<test-prefix-removal id="${item.id}"></test-prefix-removal>`,
          ])}
        </div>
      `;
    };
    const container = document.createElement('div');

    document.body.append(container);
    assert(connects === 0);
    // assert(moves === 0);
    assert(disconnects === 0);

    render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar' }] }));
    assert(connects === 2);
    // assert(moves === 0);
    assert(disconnects === 0);

    render(container, getTemplate({ items: [{ id: 'bar' }] }));
    assert(connects === 2);
    // assert(moves === 1);
    assert(disconnects === 1);

    render(container, getTemplate({ items: [] }));
    assert(connects === 2);
    // assert(moves === 1);
    assert(disconnects === 2);

    container.remove();
  });

  // TODO: #254: Uncomment “moves” lines when we leverage “moveBefore”.
  test('native map does not cause disconnectedCallback on suffix removal', () => {
    let connects = 0;
    // let moves = 0;
    let disconnects = 0;
    class TestSuffixRemoval extends HTMLElement {
      connectedCallback() { connects++; }
      // connectedMoveCallback() { moves++; }
      disconnectedCallback() { disconnects++; }
    }
    customElements.define('test-suffix-removal', TestSuffixRemoval);

    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => [
            item.id,
            html`<test-suffix-removal id="${item.id}"></test-suffix-removal>`,
          ])}
        </div>
      `;
    };
    const container = document.createElement('div');

    document.body.append(container);
    assert(connects === 0);
    // assert(moves === 0);
    assert(disconnects === 0);

    render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar' }] }));
    assert(connects === 2);
    // assert(moves === 0);
    assert(disconnects === 0);

    render(container, getTemplate({ items: [{ id: 'foo' }] }));
    assert(connects === 2);
    // assert(moves === 0);
    assert(disconnects === 1);

    render(container, getTemplate({ items: [] }));
    assert(connects === 2);
    // assert(moves === 0);
    assert(disconnects === 2);

    container.remove();
  });

  // TODO: #254: See https://chromestatus.com/feature/5135990159835136.
  test.todo('native map does not cause disconnectedCallback on list shuffle', () => {
    let connects = 0;
    let moves = 0;
    let disconnects = 0;
    class TestListShuffle extends HTMLElement {
      connectedCallback() { connects++; }
      connectedMoveCallback() { moves++; }
      disconnectedCallback() { disconnects++; }
    }
    customElements.define('test-list-shuffle', TestListShuffle);

    const getTemplate = ({ items }) => {
      return html`
        <div id="target">
          ${items.map(item => [
            item.id,
            html`<test-list-shuffle id="${item.id}"></test-list-shuffle>`,
          ])}
        </div>
      `;
    };
    const container = document.createElement('div');

    document.body.append(container);
    assert(connects === 0);
    assert(moves === 0);
    assert(disconnects === 0);

    render(container, getTemplate({ items: [{ id: 'foo' }, { id: 'bar' }] }));
    assert(connects === 2);
    assert(moves === 0);
    assert(disconnects === 0);

    render(container, getTemplate({ items: [{ id: 'bar' }, { id: 'foo' }] }));
    assert(connects === 2);
    assert(moves === 1);
    assert(disconnects === 0);

    render(container, getTemplate({ items: [] }));
    assert(connects === 2);
    assert(moves === 1);
    assert(disconnects === 2);

    container.remove();
  });
});

suite('changing content values', () => {
  // The template engine needs to clear content between cursors if the updater
  //  changes — it‘d be far too complex to try and allow one updater try and
  //  take over from a different one.
  const getTemplate = ({ value }) => html`<div id="target">${value}</div>`;
  const run = (...transitions) => {
    const container = document.createElement('div');
    for (const transition of transitions) {
      transition(container);
    }
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

  test('can change from undefined content to null content', () => run(toUndefinedContent, toNullContent));
  test('can change from undefined content to text content', () => run(toUndefinedContent, toTextContent));
  test('can change from undefined content to fragment content', () => run(toUndefinedContent, toFragmentContent));
  test('can change from undefined content to array content', () => run(toUndefinedContent, toArrayContent));
  test('can change from undefined content to map content', () => run(toUndefinedContent, toMapContent));

  test('can change from null content to undefined content', () => run(toNullContent, toUndefinedContent));
  test('can change from null content to text content', () => run(toNullContent, toTextContent));
  test('can change from null content to fragment content', () => run(toNullContent, toFragmentContent));
  test('can change from null content to array content', () => run(toNullContent, toArrayContent));
  test('can change from null content to map content', () => run(toNullContent, toMapContent));

  test('can change from text content to undefined content', () => run(toTextContent, toUndefinedContent));
  test('can change from text content to null content', () => run(toTextContent, toNullContent));
  test('can change from text content to fragment content', () => run(toTextContent, toFragmentContent));
  test('can change from text content to array content', () => run(toTextContent, toArrayContent));
  test('can change from text content to map content', () => run(toTextContent, toMapContent));

  test('can change from fragment content to undefined content', () => run(toFragmentContent, toUndefinedContent));
  test('can change from fragment content to null content', () => run(toFragmentContent, toNullContent));
  test('can change from fragment content to text content', () => run(toFragmentContent, toTextContent));
  test('can change from fragment content to array content', () => run(toFragmentContent, toArrayContent));
  test('can change from fragment content to map content', () => run(toFragmentContent, toMapContent));

  test('can change from array content to undefined content', () => run(toArrayContent, toUndefinedContent));
  test('can change from array content to null content', () => run(toArrayContent, toNullContent));
  test('can change from array content to text content', () => run(toArrayContent, toTextContent));
  test('can change from array content to fragment content', () => run(toArrayContent, toFragmentContent));
  test('can change from array content to map content', () => run(toArrayContent, toMapContent));

  test('can change from map content to undefined content', () => run(toMapContent, toUndefinedContent));
  test('can change from map content to null content', () => run(toMapContent, toNullContent));
  test('can change from map content to text content', () => run(toMapContent, toTextContent));
  test('can change from map content to fragment content', () => run(toMapContent, toFragmentContent));
  test('can change from map content to array content', () => run(toMapContent, toArrayContent));
});

suite('container issues', () => {
  test('throws when given container is not a node', () => {
    const callback = () => render({}, html``);
    const expectedMessage = 'Error: Unexpected non-node render container "[object Object]".';
    assert.throws(callback, new RegExp('^' + RegExp.escape(expectedMessage) + '$'));
  });
});

suite('value issues', () => {
  suite('native array', () => {
    test('throws for list with non-template value for array item', () => {
      const callback = () => render(document.createElement('div'), html`
        <div>
          ${[null].map(item => item ? html`<div>${item}</div>` : null)}
        </div>
      `);
      const expectedMessage = 'Error: Unexpected non-template value found in array item at 0 "null".';
      assert.throws(callback, new RegExp('^' + RegExp.escape(expectedMessage) + '$'));
    });

    test('throws for list with non-template value on re-render', () => {
      const getTemplate = ({ items }) => {
        return html`
          <div>
            ${items.map(item => item ? html`<div>${item}</div>` : null)}
          </div>
        `;
      };
      const container = document.createElement('div');
      render(container, getTemplate({ items: ['foo'] }));
      const callback = () => render(container, getTemplate({ items: [null] }));
      const expectedMessage = 'Error: Unexpected non-template value found in array item at 0 "null".';
      assert.throws(callback, new RegExp('^' + RegExp.escape(expectedMessage) + '$'));
    });

    test('throws for list with empty map entry', () => {
      const callback = () => render(document.createElement('div'), html`<div>${[[]]}</div>`);
      const expectedMessage = 'Error: Unexpected entry length found in map entry at 0 with length "0".';
      assert.throws(callback, new RegExp('^' + RegExp.escape(expectedMessage) + '$'));
    });

    test('throws for list with non-string key in a map entry', () => {
      const callback = () => render(document.createElement('div'), html`<div>${[[1, html``]]}</div>`);
      const expectedMessage = 'Error: Unexpected non-string key found in map entry at 0 "1".';
      assert.throws(callback, new RegExp('^' + RegExp.escape(expectedMessage) + '$'));
    });

    test('throws for list with duplicated key in a map entry', () => {
      const callback = () => render(
        document.createElement('div'),
        html`<div>${[['1', html``], ['2', html``], ['1', html``]]}</div>`,
      );
      const expectedMessage = 'Error: Unexpected duplicate key found in map entry at 2 "1".';
      assert.throws(callback, new RegExp('^' + RegExp.escape(expectedMessage) + '$'));
    });

    test('throws for list with non-template values in a map entry', () => {
      const callback = () => render(document.createElement('div'), html`<div>${[['1', null]]}</div>`);
      const expectedMessage = 'Error: Unexpected non-template value found in map entry at 0 "null".';
      assert.throws(callback, new RegExp('^' + RegExp.escape(expectedMessage) + '$'));
    });
  });
});
