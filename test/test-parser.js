import { parse, validate, errorContextKey } from '../x-parser.js';
import { assert, describe, it } from './x-test.js';

// Special symbol to hang test information off of.
const TEST = Symbol();

// Overwrite console warn for testing so we don’t get spammed with our own
//  deprecation warnings.
const seen = new Set();
const warn = console.warn; // eslint-disable-line no-console
const localMessages = [
  'Support for the <style> tag is deprecated and will be removed in future versions.',
  'Support for the <svg> tag is deprecated and will be removed in future versions.',
];
console.warn = (...args) => { // eslint-disable-line no-console
  if (!localMessages.includes(args[0]?.message)) {
    warn(...args);
  } else {
    seen.add(args[0].message);
  }
};

// Simple helper for asserting thrown messages.
const assertThrows = (callback, expectedMessage, options) => {
  let thrown = false;
  try {
    callback();
  } catch (error) {
    thrown = true;
    if (options?.startsWith === true) {
      assert(error.message.startsWith(expectedMessage), error.message);
    } else {
      assert(error.message === expectedMessage, error.message);
    }
  }
  assert(thrown, 'no error was thrown');
};

const wrapper = (strings, mode, language) => {
  const bindings = {
    boolean: [],
    defined: [],
    attribute: [],
    property: [],
    content: [],
    text: [],
  };
  const onBoolean = (name, path) => bindings.boolean.push({ name, path: String(path) });
  const onDefined = (name, path) => bindings.defined.push({ name, path: String(path) });
  const onAttribute = (name, path) => bindings.attribute.push({ name, path: String(path) });
  const onProperty = (name, path) => bindings.property.push({ name, path: String(path) });
  const onContent = path => bindings.content.push({ path: String(path) });
  const onText = path => bindings.text.push({ path: String(path) });
  if (mode === 'validate') {
    validate(strings);
  } else {
    const fragment = parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText, language);
    fragment[TEST] = { bindings };
    return fragment;
  }
};

// Simple function to return strings array from tagged template function call.
//  Since IDEs will pick up on the “html” syntax, they should highlight, which
//  will make this more readable.
const html = strings => wrapper(strings);

// Certain tests require that we write _terribly broken_ html. To prevent IDEs
//  from choking when trying to highlight, we also have a “htmlol” function.
const htmlol = strings => wrapper(strings);

// Placeholder for values which delimit tagged template functions. These are
//  not considered by the parser, so the value here has no significance and will
//  not show up in any of the resulting fragments from the initial parse.
const VALUE = '…';

describe('basic', () => {
  it('empty template works', () => {
    const fragment = html``;
    assert(fragment.childNodes.length === 0);
  });

  it('single string works', () => {
    const fragment = html`<div id="target">No interpolation.</div>`;
    assert(fragment.childNodes.length === 1);
    assert(fragment.querySelector('#target').textContent === 'No interpolation.');
  });

  it('multi-line string works', () => {
    const fragment = html`
      one
      two
      three
    `;
    assert(fragment.childNodes.length === 1);
    assert(fragment.childNodes[0].nodeType === Node.TEXT_NODE);
    assert(fragment.childNodes[0].textContent.trim() === 'one\n      two\n      three');
  });
});

describe('comments', () => {
  it('comments work', () => {
    const fragment = html`<!--hi-->`;
    assert(fragment.childNodes.length === 1);
    assert(fragment.childNodes[0].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[0].data === 'hi');
  });

  it('multi-line comments work', () => {
    const fragment = html`<!--
        hi
      -->`;
    assert(fragment.childNodes.length === 1);
    assert(fragment.childNodes[0].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[0].data.trim() === 'hi');
  });
});

describe('character references', () => {
  it('replaces references in replaceable character data', () => {
    const fragment = html`<div>&#123;&lt;&amp;&gt;&apos;&quot;&#x007D;</div>`;
    assert(fragment.childNodes.length === 1);
    assert(fragment.childNodes[0].textContent === `{<&>'"}`);
  });

  it('replaces references in replaceable character data for special syntax', () => {
    const fragment = html`&amp;&lt;&gt;&quot;&apos;`;
    assert(fragment.textContent === `&<>"'`);
  });

  it('replaces references for commonly-used characters', () => {
    const fragment = html`&nbsp;&lsquo;&rsquo;&ldquo;&rdquo;&ndash;&mdash;&hellip;&bull;&middot;&dagger;`;
    assert(fragment.textContent === '\u00A0\u2018\u2019\u201C\u201D\u2013\u2014\u2026\u2022\u00B7\u2020');
  });

  it('replaces references in attribute values', () => {
    const fragment = html`<div foo="--&#123;&lt;&amp;&gt;&apos;&quot;&#x007D;--"></div>`;
    assert(fragment.childElementCount === 1);
    assert(fragment.children[0].getAttribute('foo') === `--{<&>'"}--`);
  });

  it('replaces named references which require surrogate pairs', () => {
    const fragment = html`<div>--&bopf;&bopf;--&bopf;--</div>`;
    assert(fragment.childElementCount === 1);
    assert(fragment.children[0].textContent === `--\uD835\uDD53\uD835\uDD53--\uD835\uDD53--`);
  });

  it('leaves malformed references as-is', () => {
    const fragment = htmlol`<div>--&:^);--</div>`;
    assert(fragment.childElementCount === 1);
    assert(fragment.children[0].textContent === `--&:^);--`);
  });
});

describe('JS-y escapes', () => {
  it('properly escaped JS escape characters work', () => {
    // Just checks that no errors are thrown.
    htmlol`
      The \\n \\\\n character is a newline.
      The \\r \\\\r is a return.
      The \\', \\\\', \\", \\\\", and \\\`, \\\\\` characters are quotes and back ticks.
      This \\, \\\\ character is a literal backslash.
      The \\t, \\\\t character is a tab.
      The \\b, \\\\b character is a backspace.
      The \\f, \\\\f character is a form feed.
      The \\v, \\\\v character is a vertical tab.
      The \\u2026, \\\\u2026 character is an ellipsis.
      The \\x8230, \\\\x8230 character is also an ellipsis.
      The \\0, \\\\0 character is the nul character.
      The \${interpolation} character is okay to escape.
    `;
  });
});

describe('attributes and properties', () => {
  it('unbound attributes are stamped directly into fragment', () => {
    const fragment = html`<div id="target" f="b"></div>`;
    assert(fragment.querySelector('#target').getAttribute('f') === 'b');
  });

  it('bound attributes are reported', () => {
    const fragment = html`<div id="target" attr="${VALUE}"></div>`;
    assert(!fragment.querySelector('#target').hasAttribute('attr'));
    assert(fragment[TEST].bindings.attribute.length === 1);
    assert(fragment[TEST].bindings.attribute[0].name === 'attr');
    assert(fragment[TEST].bindings.attribute[0].path === '0');
  });

  // It’s also a good test that this is at the _end_ of the opening tag. If we
  //  change this, we should write another test to separately check that.
  it('unbound boolean attributes are stamped directly into fragment', () => {
    const fragment = html`<div id="target" foo></div>`;
    assert(fragment.querySelector('#target').getAttribute('foo') === '');
  });

  it('bound boolean attributes are reported', () => {
    const fragment = html`<div id="target" ?foo="${VALUE}"></div>`;
    assert(!fragment.querySelector('#target').hasAttribute('foo'));
    assert(fragment[TEST].bindings.boolean.length === 1);
    assert(fragment[TEST].bindings.boolean[0].name === 'foo');
    assert(fragment[TEST].bindings.boolean[0].path === '0');
  });

  it('bound defined attributes are reported', () => {
    const fragment = html`<div id="target" ??foo="${VALUE}"></div>`;
    assert(!fragment.querySelector('#target').hasAttribute('foo'));
    assert(fragment[TEST].bindings.defined.length === 1);
    assert(fragment[TEST].bindings.defined[0].name === 'foo');
    assert(fragment[TEST].bindings.defined[0].path === '0');
  });

  it('unbound “on*” attributes as event handlers work', () => {
    const fragment = html`<div onclick="this.textContent = '&hellip;hi\\u2026';"></div>`;
    const container = document.createElement('div');
    container.append(fragment);
    document.body.append(container);
    container.firstElementChild.click();
    // Because attributes have _replaceable_ content, the “&hellip;” should be
    //  immediately replaced and injected as the actual character “…” within the
    //  to-be-evaluated JS script. Because the “\\u2026” is escaped, it passes
    //  validation. Finally, because this is valid HTML text, it ought to
    //  highlight correctly in an IDE (you have to just confirm that visually).
    assert(container.firstElementChild.textContent = '…hi…');
    container.remove();
  });

  it('properties are reported', () => {
    const fragment = html`<div id="target" .prop="${VALUE}"></div>`;
    assert(fragment.querySelector('#target').prop === undefined);
    assert(fragment[TEST].bindings.property.length === 1);
    assert(fragment[TEST].bindings.property[0].name === 'prop');
    assert(fragment[TEST].bindings.property[0].path === '0');
  });
});

describe('content interpolation', () => {
  it('solo interpolation works', () => {
    const fragment = html`${VALUE}`;
    assert(fragment.childNodes.length === 2);
    assert(fragment.childNodes[0].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[0].data === '');
    assert(fragment.childNodes[1].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[1].data === '');
    assert(fragment[TEST].bindings.content.length === 1);
  });

  it('adjacent interpolations work', () => {
    const fragment = html`${VALUE}${VALUE}`;
    assert(fragment.childNodes.length === 4);
    assert(fragment.childNodes[0].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[0].data === '');
    assert(fragment.childNodes[1].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[1].data === '');
    assert(fragment.childNodes[2].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[2].data === '');
    assert(fragment.childNodes[3].nodeType === Node.COMMENT_NODE);
    assert(fragment.childNodes[3].data === '');
    assert(fragment[TEST].bindings.content.length === 2);
  });
});

describe('odds and ends', () => {
  it('surprisingly-accepted characters work', () => {
    const fragment = html`>'"&& & &<div></div>&`;
    assert(fragment.childElementCount === 1);
    assert(fragment.children[0].textContent === ``);
  });

  it('elements with "/" characters in attributes work', () => {
    // Note the "/" character.
    const fragment = html`
      <a
        id="a"
        href="https://github.com/Netflix/x-element">
        click me
      </a>
    `;
    const link = fragment.querySelector('#a');
    assert(link.href === 'https://github.com/Netflix/x-element');
    assert(link.textContent.trim() === 'click me');
  });

  it('elements with "<" or ">" characters in attributes work', () => {
    // Note the "/", "<", and ">" characters.
    const fragment = html`
      <a
        id="a"
        data-foo="<><></></>"
        href="https://github.com/Netflix/x-element">
        click me
      </a>
    `;
    const link = fragment.querySelector('#a');
    assert(link.href === 'https://github.com/Netflix/x-element');
    assert(link.textContent.trim() === 'click me');
    assert(link.dataset.foo === '<><></></>');
  });

  it('multiple opening and closing tags work', () => {
    const fragment = html`<div><div></div></div>`;
    assert(fragment.childElementCount === 1);
    assert(fragment.children[0].childElementCount === 1);
  });

  it('void elements work', () => {
    const fragment = html`<input type="checkbox" value="${VALUE}">`;
    assert(fragment.querySelector('input').type === 'checkbox');
    assert(fragment[TEST].bindings.attribute.length === 1);
  });

  it('textarea elements work', () => {
    const fragment = html`<textarea><em>this</em> is the &ldquo;default&rdquo; value</textarea>`;
    assert(fragment.querySelector('textarea').value === '<em>this</em> is the “default” value');
  });

  it('textarea elements with strict interpolation work', () => {
    const fragment = html`<textarea>${VALUE}</textarea>`;
    assert(fragment[TEST].bindings.text.length === 1);
  });

  it('pre elements with optional, initial newline work', () => {
    const expected = '        hi\n      ';
    const fragment = html`
      <pre>
        <span>hi</span>
      </pre>
    `;
    assert(fragment.querySelector('pre').textContent === expected); // first newline is removed
  });

  it('custom elements work', () => {
    const fragment = html`<foo-bar></foo-bar>`;
    assert(fragment.childElementCount === 1);
    assert(fragment.children[0].localName === 'foo-bar');
  });

  it('template elements work', () => {
    // It’s important that the _content_ is populated here. Not the template.
    const fragment = html`<template><div><p></p></div></template>`;
    assert(!!fragment.querySelector('template'));
    assert(fragment.querySelector('template').content.childElementCount === 1);
    assert(fragment.querySelector('template').content.children[0].childElementCount === 1);
    assert(fragment.querySelector('template').content.children[0].children[0].localName === 'p');
  });
});

describe('errors', () => {
  it('throws when attempting to interpolate within a style tag', () => {
    const callback = () => html`
      <style>
        div { background-color: ${VALUE}; }
      </style>
    `;
    const expectedMessage = '[#191]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag (preceding space)', () => {
    const callback = () => html`<textarea id="target"> ${VALUE}</textarea>`;
    const expectedMessage = '[#156]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag (succeeding space)', () => {
    const callback = () => html`<textarea id="target">${VALUE} </textarea>`;
    const expectedMessage = '[#156]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag', () => {
    const callback = () => html`<textarea id="target">please ${VALUE} no</textarea>`;
    const expectedMessage = '[#156]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag via nesting', () => {
    const callback = () => html`<textarea id="target"><b>please ${VALUE} no</b></textarea>`;
    const expectedMessage = '[#156]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag via nesting', () => {
    const callback = () => html`<textarea><b>please ${VALUE} no</b></textarea>`;
    const expectedMessage = '[#156]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for unquoted attributes', () => {
    const callback = () => html`<div id="target" not-ok=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#128]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for single-quoted attributes', () => {
    const callback = () => html`<div id="target" not-ok='${VALUE}'>Gotta double-quote those.</div>`;
    const expectedMessage = '[#128]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for unquoted properties', () => {
    const callback = () => html`<div id="target" .notOk=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#129]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for single-quoted properties', () => {
    const callback = () => html`<div id="target" .notOk='${VALUE}'>Gotta double-quote those.</div>`;
    const expectedMessage = '[#129]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('no weird re-entrance issues', async () => {
    class TestElement1 extends HTMLElement {
      constructor() {
        super();
        html`<style></style>`;
      }
    }
    customElements.define('test-element-1', TestElement1);
    class TestElement2 extends HTMLElement {
      constructor() {
        super();
        html`<test-element-1></test-element-1>`;
      }
    }
    customElements.define('test-element-2', TestElement2);
    // At one point, we had a bug where the mutable “.lastIndex” was being
    //  changed mid-parse due to some re-entrance. This test was able to repro
    //  that specific issue because construction happens
    //  _as soon as the element is created_ during the parsing routine.
    document.createElement('test-element-2');
  });

  it('throws every time if there is a parsing error', () => {
    // At one point, we only threw the _first_ time we encountered a given
    //  tagged template function “strings” array. We want to throw always.
    const callback = () => html`<-div></-div>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
    assertThrows(callback, expectedMessage, { startsWith: true });
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws correct message for complex template', () => {
    // Just creating a more complex test to make sure nothing is missed. Many
    //  of the other tests have errors within the first string of the “strings”
    //  array, for example.
    const callback = () => html`
      <div id="container">
        <span class="${VALUE}">${VALUE}</span>
        <span id="name" _foo>${VALUE}</span>
      </div>
    `;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when unbound content is followed by malformed html', () => {
    const callback = () => html`hi <-div>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when an unbound comment is followed by malformed html', () => {
    const callback = () => html`<!--hi--><-div>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if open tag starts with a hyphen', () => {
    const callback = () => html`<-div></-div>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if open tag starts with a number', () => {
    const callback = () => html`<3h-></3h->`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if open tag ends in a hyphen', () => {
    const callback = () => html`<div-></div->`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if you give a tag name with capital letters', () => {
    const callback = () => html`<Div></Div>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if you give a custom element tag name with capital letters', () => {
    const callback = () => html`<my-Element></my-Element>`;
    const expectedMessage = '[#193]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an open tag has a trailing space before the ">" character', () => {
    const callback = () => html`<div foo ></div>`;
    const expectedMessage = '[#122]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an open tag has a trailing newline before the ">" character', () => {
    const callback = () => html`
      <div
        foo
      >
      </div>
    `;
    const expectedMessage = '[#122]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an open tag has a slash before the ">" character', () => {
    const callback = () => html`<input foo/>`;
    const expectedMessage = '[#105]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an open tag has a space-slash before the ">" character', () => {
    const callback = () => html`<input foo />`;
    const expectedMessage = '[#122]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for tabs after open tag start', () => {
    // There is a literal tab character here.
    const callback = () => html`<div	></div>`;
    const expectedMessage = '[#121]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for tabs between declarations in an open tag', () => {
    // There is a literal tab character between the two boolean attributes here.
    const callback = () => html`<div foo	bar></div>`;
    const expectedMessage = '[#121]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for multiple spaces between declarations in an open tag', () => {
    // This sort of formatting is the only thing that _might_ make sense to
    //  allow in the future, but I think it’s fairly uncommon to use. Mostly,
    //  the multiple spaces are a typo when they exist.
    const callback = () => html`
      <div foo     bar></div>
      <div fooooo  bar></div>
    `;
    const expectedMessage = '[#121]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for multiple newlines between declarations in an open tag', () => {
    const callback = () => html`
      <div
        foo
        
        bar>
      </div>`;
    const expectedMessage = '[#121]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a close tag has a space after the "<" characters', () => {
    const callback = () => html`<div>< /div>`;
    const expectedMessage = '[#123]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a close tag has a space after the "</" characters', () => {
    const callback = () => html`<div></ div>`;
    const expectedMessage = '[#123]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a close tag has a space before the ">" characters', () => {
    const callback = () => html`<div></div >`;
    const expectedMessage = '[#123]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a close tag name ends with a hyphen', () => {
    const callback = () => html`<div></div->`;
    const expectedMessage = '[#123]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if there is other junk attached to the close tag', () => {
    const callback = () => html`<div></div class="nope">`;
    const expectedMessage = '[#123]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound boolean attribute starts with a hyphen', () => {
    const callback = () => html`<div -what></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound boolean attribute starts with a number', () => {
    const callback = () => html`<div 9what></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound boolean attribute has an uppercase letter', () => {
    const callback = () => html`<div wHat></div>`;
    const expectedMessage = '[#192]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound boolean attribute ends with a hyphen', () => {
    const callback = () => html`<div what-></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute starts with a hyphen', () => {
    const callback = () => html`<div -what="no"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute starts with a number', () => {
    const callback = () => html`<div 5what="no"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute has an uppercase letter', () => {
    const callback = () => html`<div wHat="no"></div>`;
    const expectedMessage = '[#192]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute ends with a hyphen', () => {
    const callback = () => html`<div what-="no"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute starts with a hyphen', () => {
    const callback = () => html`<div ?-what="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute starts with a number', () => {
    const callback = () => html`<div ?3what="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute has an uppercase letter', () => {
    const callback = () => html`<div ?wHat="${VALUE}"></div>`;
    const expectedMessage = '[#192]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute ends with a hyphen', () => {
    const callback = () => html`<div ?what-="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute has a malformed dangling quote', () => {
    const callback = () => html`<div ?what="${VALUE} "></div>`;
    const expectedMessage = '[#130]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute ends with a hyphen', () => {
    const callback = () => html`<div ?what-="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute has a malformed dangling quote', () => {
    const callback = () => html`<div ?what="${VALUE} "></div>`;
    const expectedMessage = '[#130]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute starts with a hyphen', () => {
    const callback = () => html`<div ??-what="${VALUE}"></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute starts with a number', () => {
    const callback = () => html`<div ??3what="${VALUE}"></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute has an uppercase letter', () => {
    const callback = () => html`<div ??wHat="${VALUE}"></div>`;
    const expectedMessage = '[#192]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute ends with a hyphen', () => {
    const callback = () => html`<div ??what-="${VALUE}"></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute has a malformed dangling quote', () => {
    const callback = () => html`<div ??what="${VALUE} "></div>`;
    const expectedMessage = '[#130]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute starts with a hyphen', () => {
    const callback = () => html`<div -what="${VALUE}"></div>`;
    const expectedMessage = '[#128]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute starts with a number', () => {
    const callback = () => html`<div 3what="${VALUE}"></div>`;
    const expectedMessage = '[#128]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute has an uppercase letter', () => {
    const callback = () => html`<div wHat="${VALUE}"></div>`;
    const expectedMessage = '[#192]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute ends with a hyphen', () => {
    const callback = () => html`<div what-="${VALUE}"></div>`;
    const expectedMessage = '[#128]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute has a malformed dangling quote', () => {
    const callback = () => html`<div what="${VALUE} "></div>`;
    const expectedMessage = '[#130]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property starts with an underscore', () => {
    const callback = () => html`<div ._what="${VALUE}"></div>`;
    const expectedMessage = '[#129]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property starts with a number', () => {
    const callback = () => html`<div .3what="${VALUE}"></div>`;
    const expectedMessage = '[#129]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property starts with a capital letter', () => {
    const callback = () => html`<div .Yak="${VALUE}"></div>`;
    const expectedMessage = '[#129]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property ends with an underscore', () => {
    const callback = () => html`<div .what_="${VALUE}"></div>`;
    const expectedMessage = '[#129]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property has a malformed dangling quote', () => {
    const callback = () => html`<div .what="${VALUE} "></div>`;
    const expectedMessage = '[#130]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if bound content is followed by a malformed close tag', () => {
    const callback = () => html`<div>${VALUE}</ div>`;
    const expectedMessage = '[#123]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if you forget to close a tag', () => {
    const callback = () => html`<div>`;
    const expectedMessage = '[#154]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if you mismatch a close a tag', () => {
    const callback = () => html`<div></span>`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a close a tag is followed by malformed html', () => {
    const callback = () => html`<div></div><-div>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write unicode in a js-y decimal format', () => {
    const callback1 = () => html`<div>please no\x8230</div>`;
    const callback2 = () => html`<div>please no\\\x8230</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write unicode in a js-y hexadecimal format', () => {
    const callback1 = () => html`<div>please no\u2026</div>`;
    const callback2 = () => html`<div>please no\\\u2026</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write newlines in a js-y format', () => {
    const callback1 = () => html`<div>please no\n</div>`;
    const callback2 = () => html`<div>please no\\\n</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write tabs in a js-y format', () => {
    const callback1 = () => html`<div>please no\t</div>`;
    const callback2 = () => html`<div>please no\\\t</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write returns in a js-y format', () => {
    const callback1 = () => html`<div>please no\r</div>`;
    const callback2 = () => html`<div>please no\\\r</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write null characters in a js-y format', () => {
    const callback1 = () => html`<div>please no\0</div>`;
    const callback2 = () => html`<div>please no\\\0</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write form feed characters in a js-y format', () => {
    const callback1 = () => html`<div>please no\f</div>`;
    const callback2 = () => html`<div>please no\\\f</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write backspace characters in a js-y format', () => {
    const callback1 = () => html`<div>please no\b</div>`;
    const callback2 = () => html`<div>please no\\\b</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write vertical tab characters in a js-y format', () => {
    const callback1 = () => html`<div>please no\v</div>`;
    const callback2 = () => html`<div>please no\\\v</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for ambiguous ampersands', () => {
    const callback = () => html`<div>please &a no</div>`;
    const expectedMessage = '[#151]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for malformed comment because it starts with a ">" character', () => {
    const callback = () => html`<!-->do not start with that character-->`;
    const expectedMessage = '[#152]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for malformed comment because it starts with "->" characters', () => {
    const callback = () => html`<!--->do not start with those characters-->`;
    const expectedMessage = '[#152]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for malformed comment because it has "--" characters', () => {
    const callback = () => html`<!--do not use "--" in a comment-->`;
    const expectedMessage = '[#152]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for malformed comment because it ends with a "-" character', () => {
    const callback = () => html`<!--do not end with this character--->`;
    const expectedMessage = '[#152]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for initial CDATA sections', () => {
    const callback = () => html`<![CDATA[<]]> as &lt;!`;
    const expectedMessage = '[#140]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for CDATA sections after unbound content', () => {
    const callback = () => html`just encode <![CDATA[<]]> as &lt;!`;
    const expectedMessage = '[#140]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for CDATA sections after bound content', () => {
    const callback = () => html`${VALUE}<![CDATA[<]]>${VALUE}`;
    const expectedMessage = '[#140]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for CDATA sections after open tag', () => {
    const callback = () => html`<div><![CDATA[<]]></div>`;
    const expectedMessage = '[#140]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for CDATA sections after close tag', () => {
    const callback = () => html`<div></div><![CDATA[<]]>`;
    const expectedMessage = '[#140]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <html> tag', () => {
    const callback = () => html`<html></html>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <head> tag', () => {
    const callback = () => html`<head></head>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <body> tag', () => {
    const callback = () => html`<body></body>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <base> tag', () => {
    const callback = () => html`<base>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <link> tag', () => {
    const callback = () => html`<link>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <meta> tag', () => {
    const callback = () => html`<meta>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <title> tag', () => {
    const callback = () => html`<title></title>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <script> tag', () => {
    const callback = () => html`<script></script>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <noscript> tag', () => {
    const callback = () => html`<noscript></noscript>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <canvas> tag', () => {
    const callback = () => html`<canvas></canvas>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <math> tag', () => {
    const callback = () => html`<math></math>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for declarative shadow roots', () => {
    const callback = () => html`<template shadowrootmode="open"></template>`;
    const expectedMessage = '[#157]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });
});

describe('html error formatting', () => {
  it('single line template', () => {
    const callback = () => html`<div id="target" not-ok=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#128] Malformed attribute interpolation — attribute names must be alphanumeric, must be lowercase, must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.\nSee substring `not-ok=`.\nYour HTML was parsed through: `<div id="target" `.';
    assertThrows(callback, expectedMessage);
  });

  it('template with two lines', () => {
    const callback = () => html`
      <div id="target" not-ok='${VALUE}'>Gotta double-quote those.</div>`;
    const expectedMessage = '[#128] Malformed attribute interpolation — attribute names must be alphanumeric, must be lowercase, must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.\nSee substring `not-ok=\'`.\nYour HTML was parsed through: `\n      <div id="target" `.';
    assertThrows(callback, expectedMessage);
  });

  it('template with three lines', () => {
    const callback = () => html`
      
      
      <div id="target" .notOk=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#129] Malformed property interpolation — property names must be alphanumeric, must be lowercase, must not start or end with underscores, and cannot start with a number — and, property values must be enclosed in double-quotes.\nSee substring `.notOk=`.\nYour HTML was parsed through: `\n      \n      \n      <div id="target" `.';
    assertThrows(callback, expectedMessage);
  });
});

describe('validate', () => {
  // eslint-disable-next-line no-shadow
  const html = strings => wrapper(strings, 'validate');

  it('basic templates work', () => {
    html`<div>hello world</div>`;
  });

  it('complex templates work', () => {
    html`
      <div
        one="one"
        two
        three="${VALUE}"
        ?four="${VALUE}"
        ??five="${VALUE}"
        .six="${VALUE}">
        hello world
        ${VALUE}
        <textarea>${VALUE}</textarea>
        <template></template>
      </div>
    `;
  });

  it('errors contain context for debugging', () => {
    let error;
    try {
      html`<diff>hello world</diff>`;
    } catch (err) {
      error = err;
    }
    assert(!!error, 'no error was thrown');
    assert(!!error[errorContextKey], 'no context was provided');
  });
});

describe('deprecated', () => {
  const svg = strings => wrapper(strings, 'parse', 'svg');

  it('parses svg', () => {
    const width = 24;
    const height = 24;
    const fragment = html`
      <svg
        viewBox="0 0 24 24"
        ??width="${width}"
        ??height="${height}">
        <circle r="${width / 2}" cx="${width / 2}" cy="${height / 2}"></circle>
      </svg>`;
    // This would be “HTMLUnknownElement” if we didn’t get the namespacing right.
    assert(fragment.querySelector('svg').constructor.name === 'SVGSVGElement');
    assert(fragment.querySelector('circle').constructor.name === 'SVGCircleElement');
    assert(fragment[TEST].bindings.defined.length === 2);
    assert(fragment[TEST].bindings.attribute.length === 3);
  });

  it('parses non-interpolated style', () => {
    const fragment = html`
      <style>
        #target {
          /* the color is red */
          color: rgb(255, 0, 0);
        }
        #target::after {
          content: "\\2026"; /* This is the right syntax. The slash just needs escaping for the template literal. */
        }
      </style>
      <div id="target">hi</div>
    `;
    const container = document.createElement('div');
    container.append(fragment);
    document.body.append(container); // Need to connect for computed styles.
    assert(container.childElementCount === 2);
    assert(getComputedStyle(container.querySelector('#target')).color === 'rgb(255, 0, 0)');
    assert(container.querySelector('#target').textContent === 'hi');
    container.remove();
  });

  it('throws for forbidden <style> tag', () => {
    const callback = () => svg`<style></style>`;
    const expectedMessage = '[#190]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for forbidden <script> tag', () => {
    const callback = () => svg`<script></script>`;
    const expectedMessage = '[#190]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('parse throws for forbidden language', () => {
    const math = strings => wrapper(strings, 'parse', 'math');
    const callback = () => math`<math></math>`;
    const expectedMessage = '[#194]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('validate deprecation warnings work', () => {
    // eslint-disable-next-line no-shadow
    const html = strings => wrapper(strings, 'validate');
    html`
      <style>/* causes console warning which we need for coverage */</style>
      <svg><!-- uses of createElementNS which we need for coverage --></svg>
    `;
  });
});

it('confirm that deprecation warnings are still necessary', () => {
  for (const message of localMessages) {
    assert(seen.has(message), `Unused deprecation warning: ${message}`);
  }
});
