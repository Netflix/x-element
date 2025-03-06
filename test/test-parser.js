import { assert, describe, it } from '@netflix/x-test/x-test.js';
import { XParser } from '../x-parser.js';

// Special symbol to hang test information off of.
const TEST = Symbol();

// Placeholder for values which delimit tagged template functions. These are
//  not considered by the parser, so the value here has no significance and will
//  not show up in any of the resulting fragments from the initial parse.
const VALUE = '…';

// Helper to stringify tokens the way we want to write them in our assertions.
const escape = string => {
  return string
    .replaceAll('\'', '\\\'')
    .replaceAll('\n', '\\n')
    .replaceAll('\\u', '\\\\u');
};
const stringifyObject = object => {
  if (object === null) {
    return 'null';
  }
  let text = '{ ';
  const keys = [...Object.keys(object)];
  let index = 0;
  for (const key of keys) {
    const value = object[key];
    switch (typeof value) {
      case 'object':
        text += `${key}: ${stringifyObject(value)}`;
        break;
      case 'string':
        text += `${key}: '${escape(value)}'`;
        break;
      case 'undefined':
      case 'number':
      case 'boolean':
        text += `${key}: ${value}`;
        break;
      default:
        // Make sure we print _something_ for debugging even if it’s wrong.
        text += `${key}: "${value}"`;
    }
    if (index++ < keys.length - 1) {
      text += ', ';
    }
  }
  text += ' }';
  return text;
};
const stringifyTokens = tokens => {
  const lines = [];
  for (const token of tokens) {
    lines.push(`  ${stringifyObject(token)},`);
  }
  return `[\n${lines.join('\n')}\n]`;
};

// Helper for figuring out if the tokens we got were correct.
const isObject = obj => obj instanceof Object && obj !== null;
const deepEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  return (
    isObject(a) &&
    isObject(b) &&
    // Note, we ignore non-enumerable properties (Symbols) here.
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every(key => deepEqual(a[key], b[key]))
  );
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

// Simpler helper to add some test information under a TEST symbol.
const wrapper = strings => {
  const tokens = [];
  const onToken = (type, index, start, end, substring) => {
    tokens.push({ type, index, start, end, substring });
  };
  XParser.parse(strings, onToken);
  tokens[TEST] = { strings };
  return tokens;
};

// Simple function to return strings array from tagged template function call.
//  Since IDEs will pick up on the “html” syntax, they should highlight, which
//  will make this more readable.
const html = strings => wrapper(strings);

// Certain tests require that we write _terribly broken_ html. To prevent IDEs
//  from choking when trying to highlight, we also have a “htmlol” function.
const htmlol = strings => wrapper(strings);

describe('basic', () => {
  it('empty template works', () => {
    const expectedTokens = [];
    const tokens = html``;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('single string works', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 4, end: 5, substring: '>' },
      { type: 'text-start', index: 0, start: 5, end: 5, substring: '' },
      { type: 'text-plaintext', index: 0, start: 5, end: 22, substring: 'No interpolation.' },
      { type: 'text-end', index: 0, start: 22, end: 22, substring: '' },
      { type: 'end-tag-open', index: 0, start: 22, end: 24, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 24, end: 27, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 27, end: 28, substring: '>' },
    ];
    const tokens = html`<div>No interpolation.</div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('multi-line string works', () => {
    const expectedTokens = [
      { type: 'text-start', index: 0, start: 0, end: 0, substring: '' },
      { type: 'text-plaintext', index: 0, start: 0, end: 37, substring: '\n      one\n      two\n      three\n    ' },
      { type: 'text-end', index: 0, start: 37, end: 37, substring: '' },
    ];
    const tokens = html`
      one
      two
      three
    `;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });
});

describe('comments', () => {
  it('comments work', () => {
    const expectedTokens = [
      { type: 'comment-open', index: 0, start: 0, end: 4, substring: '<!--' },
      { type: 'comment', index: 0, start: 4, end: 6, substring: 'hi' },
      { type: 'comment-close', index: 0, start: 6, end: 9, substring: '-->' },
    ];
    const tokens = html`<!--hi-->`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('multi-line comments work', () => {
    const expectedTokens = [
      { type: 'comment-open', index: 0, start: 0, end: 4, substring: '<!--' },
      { type: 'comment', index: 0, start: 4, end: 22, substring: '\n        hi\n      ' },
      { type: 'comment-close', index: 0, start: 22, end: 25, substring: '-->' },
    ];
    const tokens = html`<!--
        hi
      -->`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });
});

describe('character references', () => {
  it('accepts references in replaceable character data', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 4, end: 5, substring: '>' },
      { type: 'text-start', index: 0, start: 5, end: 5, substring: '' },
      { type: 'text-reference', index: 0, start: 5, end: 11, substring: '&#123;' },
      { type: 'text-plaintext', index: 0, start: 11, end: 13, substring: '--' },
      { type: 'text-reference', index: 0, start: 13, end: 17, substring: '&lt;' },
      { type: 'text-reference', index: 0, start: 17, end: 22, substring: '&amp;' },
      { type: 'text-plaintext', index: 0, start: 22, end: 24, substring: '--' },
      { type: 'text-reference', index: 0, start: 24, end: 28, substring: '&gt;' },
      { type: 'text-reference', index: 0, start: 28, end: 34, substring: '&apos;' },
      { type: 'text-reference', index: 0, start: 34, end: 40, substring: '&quot;' },
      { type: 'text-plaintext', index: 0, start: 40, end: 42, substring: '--' },
      { type: 'text-reference', index: 0, start: 42, end: 50, substring: '&#x007D;' },
      { type: 'text-end', index: 0, start: 50, end: 50, substring: '' },
      { type: 'end-tag-open', index: 0, start: 50, end: 52, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 52, end: 55, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 55, end: 56, substring: '>' },
    ];
    const tokens = html`<div>&#123;--&lt;&amp;--&gt;&apos;&quot;--&#x007D;</div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('accepts references in replaceable character data for special syntax', () => {
    const expectedTokens = [
      { type: 'text-start', index: 0, start: 0, end: 0, substring: '' },
      { type: 'text-reference', index: 0, start: 0, end: 5, substring: '&amp;' },
      { type: 'text-reference', index: 0, start: 5, end: 9, substring: '&lt;' },
      { type: 'text-reference', index: 0, start: 9, end: 13, substring: '&gt;' },
      { type: 'text-reference', index: 0, start: 13, end: 19, substring: '&quot;' },
      { type: 'text-reference', index: 0, start: 19, end: 25, substring: '&apos;' },
      { type: 'text-end', index: 0, start: 25, end: 25, substring: '' },
    ];
    const tokens = html`&amp;&lt;&gt;&quot;&apos;`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('accepts references for commonly-used characters', () => {
    const expectedTokens = [
      { type: 'text-start', index: 0, start: 0, end: 0, substring: '' },
      { type: 'text-reference', index: 0, start: 0, end: 6, substring: '&nbsp;' },
      { type: 'text-reference', index: 0, start: 6, end: 13, substring: '&lsquo;' },
      { type: 'text-reference', index: 0, start: 13, end: 20, substring: '&rsquo;' },
      { type: 'text-reference', index: 0, start: 20, end: 27, substring: '&ldquo;' },
      { type: 'text-reference', index: 0, start: 27, end: 34, substring: '&rdquo;' },
      { type: 'text-reference', index: 0, start: 34, end: 41, substring: '&ndash;' },
      { type: 'text-reference', index: 0, start: 41, end: 48, substring: '&mdash;' },
      { type: 'text-reference', index: 0, start: 48, end: 56, substring: '&hellip;' },
      { type: 'text-reference', index: 0, start: 56, end: 62, substring: '&bull;' },
      { type: 'text-reference', index: 0, start: 62, end: 70, substring: '&middot;' },
      { type: 'text-reference', index: 0, start: 70, end: 78, substring: '&dagger;' },
      { type: 'text-end', index: 0, start: 78, end: 78, substring: '' },
    ];
    const tokens = html`&nbsp;&lsquo;&rsquo;&ldquo;&rdquo;&ndash;&mdash;&hellip;&bull;&middot;&dagger;`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('accepts references in attribute values', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'attribute-name', index: 0, start: 5, end: 8, substring: 'foo' },
      { type: 'start-tag-equals', index: 0, start: 8, end: 9, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 9, end: 10, substring: '"' },
      { type: 'attribute-value-start', index: 0, start: 10, end: 10, substring: '' },
      { type: 'attribute-value-plaintext', index: 0, start: 10, end: 12, substring: '--' },
      { type: 'attribute-value-reference', index: 0, start: 12, end: 18, substring: '&#123;' },
      { type: 'attribute-value-reference', index: 0, start: 18, end: 22, substring: '&lt;' },
      { type: 'attribute-value-reference', index: 0, start: 22, end: 27, substring: '&amp;' },
      { type: 'attribute-value-reference', index: 0, start: 27, end: 31, substring: '&gt;' },
      { type: 'attribute-value-reference', index: 0, start: 31, end: 37, substring: '&apos;' },
      { type: 'attribute-value-reference', index: 0, start: 37, end: 43, substring: '&quot;' },
      { type: 'attribute-value-reference', index: 0, start: 43, end: 51, substring: '&#x007D;' },
      { type: 'attribute-value-plaintext', index: 0, start: 51, end: 53, substring: '--' },
      { type: 'attribute-value-end', index: 0, start: 53, end: 53, substring: '' },
      { type: 'start-tag-quote', index: 0, start: 53, end: 54, substring: '"' },
      { type: 'start-tag-close', index: 0, start: 54, end: 55, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 55, end: 57, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 57, end: 60, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 60, end: 61, substring: '>' },
    ];
    const tokens = html`<div foo="--&#123;&lt;&amp;&gt;&apos;&quot;&#x007D;--"></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('accepts named references which require surrogate pairs', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 4, end: 5, substring: '>' },
      { type: 'text-start', index: 0, start: 5, end: 5, substring: '' },
      { type: 'text-plaintext', index: 0, start: 5, end: 7, substring: '--' },
      { type: 'text-reference', index: 0, start: 7, end: 13, substring: '&bopf;' },
      { type: 'text-reference', index: 0, start: 13, end: 19, substring: '&bopf;' },
      { type: 'text-plaintext', index: 0, start: 19, end: 21, substring: '--' },
      { type: 'text-reference', index: 0, start: 21, end: 27, substring: '&bopf;' },
      { type: 'text-plaintext', index: 0, start: 27, end: 29, substring: '--' },
      { type: 'text-end', index: 0, start: 29, end: 29, substring: '' },
      { type: 'end-tag-open', index: 0, start: 29, end: 31, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 31, end: 34, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 34, end: 35, substring: '>' },
    ];
    const tokens = html`<div>--&bopf;&bopf;--&bopf;--</div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('leaves malformed references as-is', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 4, end: 5, substring: '>' },
      { type: 'text-start', index: 0, start: 5, end: 5, substring: '' },
      { type: 'text-plaintext', index: 0, start: 5, end: 7, substring: '--' },
      { type: 'text-reference', index: 0, start: 7, end: 12, substring: '&:^);' },
      { type: 'text-plaintext', index: 0, start: 12, end: 14, substring: '--' },
      { type: 'text-end', index: 0, start: 14, end: 14, substring: '' },
      { type: 'end-tag-open', index: 0, start: 14, end: 16, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 16, end: 19, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 19, end: 20, substring: '>' },
    ];
    const tokens = htmlol`<div>--&:^);--</div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });
});

describe('JS-y escapes / encodings', () => {
  it('properly encoded JS escape characters work', () => {
    // Just checks that no errors are thrown.
    html`
      The &bsol;n is a newline.
      The &bsol;r is a return.
      The ', ", and &grave; characters are quotes and back ticks.
      This &bsol; is a literal backslash.
      The &bsol;t character is a tab.
      The &bsol;b is a backspace.
      The &bsol;f is a form feed.
      The &bsol;v character is a vertical tab.
      The &bsol;u2026 character is an ellipsis (&hellip;).
      The &bsol;x8230 character is also an ellipsis (&hellip;).
      The &bsol;0 character is the nul character.
      The &dollar;{interpolation} character is used to work around interpolations.
    `;
  });
});

describe('attributes and properties', () => {
  it('unbound attributes are reported', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'attribute-name', index: 0, start: 5, end: 6, substring: 'f' },
      { type: 'start-tag-equals', index: 0, start: 6, end: 7, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 7, end: 8, substring: '"' },
      { type: 'attribute-value-start', index: 0, start: 8, end: 8, substring: '' },
      { type: 'attribute-value-plaintext', index: 0, start: 8, end: 9, substring: 'b' },
      { type: 'attribute-value-end', index: 0, start: 9, end: 9, substring: '' },
      { type: 'start-tag-quote', index: 0, start: 9, end: 10, substring: '"' },
      { type: 'start-tag-close', index: 0, start: 10, end: 11, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 11, end: 13, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 13, end: 16, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 16, end: 17, substring: '>' },
    ];
    const tokens = html`<div f="b"></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('bound attributes are reported', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'bound-attribute-name', index: 0, start: 5, end: 9, substring: 'attr' },
      { type: 'start-tag-equals', index: 0, start: 9, end: 10, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 10, end: 11, substring: '"' },
      { type: 'bound-attribute-value', index: 0, start: 11, end: 11, substring: '' },
      { type: 'start-tag-quote', index: 1, start: 0, end: 1, substring: '"' },
      { type: 'start-tag-close', index: 1, start: 1, end: 2, substring: '>' },
      { type: 'end-tag-open', index: 1, start: 2, end: 4, substring: '</' },
      { type: 'end-tag-name', index: 1, start: 4, end: 7, substring: 'div' },
      { type: 'end-tag-close', index: 1, start: 7, end: 8, substring: '>' },
    ];
    const tokens = html`<div attr="${VALUE}"></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  // It’s also a good test that this is at the _end_ of the opening tag. If we
  //  change this, we should write another test to separately check that.
  it('unbound boolean attributes are reported', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'boolean-name', index: 0, start: 5, end: 8, substring: 'foo' },
      { type: 'start-tag-close', index: 0, start: 8, end: 9, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 9, end: 11, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 11, end: 14, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 14, end: 15, substring: '>' },
    ];
    const tokens = html`<div foo></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('bound boolean attributes are reported', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'bound-boolean-prefix', index: 0, start: 5, end: 6, substring: '?' },
      { type: 'bound-boolean-name', index: 0, start: 6, end: 9, substring: 'foo' },
      { type: 'start-tag-equals', index: 0, start: 9, end: 10, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 10, end: 11, substring: '"' },
      { type: 'bound-boolean-value', index: 0, start: 11, end: 11, substring: '' },
      { type: 'start-tag-quote', index: 1, start: 0, end: 1, substring: '"' },
      { type: 'start-tag-close', index: 1, start: 1, end: 2, substring: '>' },
      { type: 'end-tag-open', index: 1, start: 2, end: 4, substring: '</' },
      { type: 'end-tag-name', index: 1, start: 4, end: 7, substring: 'div' },
      { type: 'end-tag-close', index: 1, start: 7, end: 8, substring: '>' },
    ];
    const tokens = html`<div ?foo="${VALUE}"></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('bound defined attributes are reported', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'bound-defined-prefix', index: 0, start: 5, end: 7, substring: '??' },
      { type: 'bound-defined-name', index: 0, start: 7, end: 10, substring: 'foo' },
      { type: 'start-tag-equals', index: 0, start: 10, end: 11, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 11, end: 12, substring: '"' },
      { type: 'bound-defined-value', index: 0, start: 12, end: 12, substring: '' },
      { type: 'start-tag-quote', index: 1, start: 0, end: 1, substring: '"' },
      { type: 'start-tag-close', index: 1, start: 1, end: 2, substring: '>' },
      { type: 'end-tag-open', index: 1, start: 2, end: 4, substring: '</' },
      { type: 'end-tag-name', index: 1, start: 4, end: 7, substring: 'div' },
      { type: 'end-tag-close', index: 1, start: 7, end: 8, substring: '>' },
    ];
    const tokens = html`<div ??foo="${VALUE}"></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('unbound “on*” attributes as event handlers work', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'attribute-name', index: 0, start: 5, end: 12, substring: 'onclick' },
      { type: 'start-tag-equals', index: 0, start: 12, end: 13, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 13, end: 14, substring: '"' },
      { type: 'attribute-value-start', index: 0, start: 14, end: 14, substring: '' },
      { type: 'attribute-value-plaintext', index: 0, start: 14, end: 34, substring: 'this.textContent = \'' },
      { type: 'attribute-value-reference', index: 0, start: 34, end: 42, substring: '&hellip;' },
      { type: 'attribute-value-plaintext', index: 0, start: 42, end: 44, substring: 'hi' },
      { type: 'attribute-value-reference', index: 0, start: 44, end: 50, substring: '&bsol;' },
      { type: 'attribute-value-plaintext', index: 0, start: 50, end: 57, substring: 'u2026\';' },
      { type: 'attribute-value-end', index: 0, start: 57, end: 57, substring: '' },
      { type: 'start-tag-quote', index: 0, start: 57, end: 58, substring: '"' },
      { type: 'start-tag-close', index: 0, start: 58, end: 59, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 59, end: 61, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 61, end: 64, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 64, end: 65, substring: '>' },
    ];
    const tokens = html`<div onclick="this.textContent = '&hellip;hi&bsol;u2026';"></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('properties are reported', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-space', index: 0, start: 4, end: 5, substring: ' ' },
      { type: 'bound-property-prefix', index: 0, start: 5, end: 6, substring: '.' },
      { type: 'bound-property-name', index: 0, start: 6, end: 10, substring: 'prop' },
      { type: 'start-tag-equals', index: 0, start: 10, end: 11, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 11, end: 12, substring: '"' },
      { type: 'bound-property-value', index: 0, start: 12, end: 12, substring: '' },
      { type: 'start-tag-quote', index: 1, start: 0, end: 1, substring: '"' },
      { type: 'start-tag-close', index: 1, start: 1, end: 2, substring: '>' },
      { type: 'end-tag-open', index: 1, start: 2, end: 4, substring: '</' },
      { type: 'end-tag-name', index: 1, start: 4, end: 7, substring: 'div' },
      { type: 'end-tag-close', index: 1, start: 7, end: 8, substring: '>' },
    ];
    const tokens = html`<div .prop="${VALUE}"></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });
});

describe('content interpolation', () => {
  it('solo interpolation works', () => {
    const expectedTokens = [
      { type: 'bound-content-value', index: 0, start: 0, end: 0, substring: '' },
    ];
    const tokens = html`${VALUE}`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('adjacent interpolations work', () => {
    const expectedTokens = [
      { type: 'bound-content-value', index: 0, start: 0, end: 0, substring: '' },
      { type: 'bound-content-value', index: 1, start: 0, end: 0, substring: '' },
    ];
    const tokens = html`${VALUE}${VALUE}`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });
});

describe('odds and ends', () => {
  it('surprisingly-accepted characters work', () => {
    const expectedTokens = [
      { type: 'text-start', index: 0, start: 0, end: 0, substring: '' },
      { type: 'text-plaintext', index: 0, start: 0, end: 9, substring: '>\'"&& & &' },
      { type: 'text-end', index: 0, start: 9, end: 9, substring: '' },
      { type: 'start-tag-open', index: 0, start: 9, end: 10, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 10, end: 13, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 13, end: 14, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 14, end: 16, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 16, end: 19, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 19, end: 20, substring: '>' },
      { type: 'text-start', index: 0, start: 20, end: 20, substring: '' },
      { type: 'text-plaintext', index: 0, start: 20, end: 21, substring: '&' },
      { type: 'text-end', index: 0, start: 21, end: 21, substring: '' },
    ];
    const tokens = html`>'"&& & &<div></div>&`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('elements with "/" characters in attributes work', () => {
    const expectedTokens = [
      { type: 'text-start', index: 0, start: 0, end: 0, substring: '' },
      { type: 'text-plaintext', index: 0, start: 0, end: 7, substring: '\n      ' },
      { type: 'text-end', index: 0, start: 7, end: 7, substring: '' },
      { type: 'start-tag-open', index: 0, start: 7, end: 8, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 8, end: 9, substring: 'a' },
      { type: 'start-tag-space', index: 0, start: 9, end: 18, substring: '\n        ' },
      { type: 'attribute-name', index: 0, start: 18, end: 22, substring: 'href' },
      { type: 'start-tag-equals', index: 0, start: 22, end: 23, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 23, end: 24, substring: '"' },
      { type: 'attribute-value-start', index: 0, start: 24, end: 24, substring: '' },
      { type: 'attribute-value-plaintext', index: 0, start: 24, end: 60, substring: 'https://github.com/Netflix/x-element' },
      { type: 'attribute-value-end', index: 0, start: 60, end: 60, substring: '' },
      { type: 'start-tag-quote', index: 0, start: 60, end: 61, substring: '"' },
      { type: 'start-tag-close', index: 0, start: 61, end: 62, substring: '>' },
      { type: 'text-start', index: 0, start: 62, end: 62, substring: '' },
      { type: 'text-plaintext', index: 0, start: 62, end: 86, substring: '\n        click me\n      ' },
      { type: 'text-end', index: 0, start: 86, end: 86, substring: '' },
      { type: 'end-tag-open', index: 0, start: 86, end: 88, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 88, end: 89, substring: 'a' },
      { type: 'end-tag-close', index: 0, start: 89, end: 90, substring: '>' },
      { type: 'text-start', index: 0, start: 90, end: 90, substring: '' },
      { type: 'text-plaintext', index: 0, start: 90, end: 95, substring: '\n    ' },
      { type: 'text-end', index: 0, start: 95, end: 95, substring: '' },
    ];
    // Note the "/" character.
    const tokens = html`
      <a
        href="https://github.com/Netflix/x-element">
        click me
      </a>
    `;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('elements with "<" or ">" characters in attributes work', () => {
    const expectedTokens = [
      { type: 'text-start', index: 0, start: 0, end: 0, substring: '' },
      { type: 'text-plaintext', index: 0, start: 0, end: 7, substring: '\n      ' },
      { type: 'text-end', index: 0, start: 7, end: 7, substring: '' },
      { type: 'start-tag-open', index: 0, start: 7, end: 8, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 8, end: 9, substring: 'a' },
      { type: 'start-tag-space', index: 0, start: 9, end: 18, substring: '\n        ' },
      { type: 'attribute-name', index: 0, start: 18, end: 26, substring: 'data-foo' },
      { type: 'start-tag-equals', index: 0, start: 26, end: 27, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 27, end: 28, substring: '"' },
      { type: 'attribute-value-start', index: 0, start: 28, end: 28, substring: '' },
      { type: 'attribute-value-plaintext', index: 0, start: 28, end: 38, substring: '<><></></>' },
      { type: 'attribute-value-end', index: 0, start: 38, end: 38, substring: '' },
      { type: 'start-tag-quote', index: 0, start: 38, end: 39, substring: '"' },
      { type: 'start-tag-space', index: 0, start: 39, end: 48, substring: '\n        ' },
      { type: 'attribute-name', index: 0, start: 48, end: 52, substring: 'href' },
      { type: 'start-tag-equals', index: 0, start: 52, end: 53, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 53, end: 54, substring: '"' },
      { type: 'attribute-value-start', index: 0, start: 54, end: 54, substring: '' },
      { type: 'attribute-value-plaintext', index: 0, start: 54, end: 90, substring: 'https://github.com/Netflix/x-element' },
      { type: 'attribute-value-end', index: 0, start: 90, end: 90, substring: '' },
      { type: 'start-tag-quote', index: 0, start: 90, end: 91, substring: '"' },
      { type: 'start-tag-close', index: 0, start: 91, end: 92, substring: '>' },
      { type: 'text-start', index: 0, start: 92, end: 92, substring: '' },
      { type: 'text-plaintext', index: 0, start: 92, end: 116, substring: '\n        click me\n      ' },
      { type: 'text-end', index: 0, start: 116, end: 116, substring: '' },
      { type: 'end-tag-open', index: 0, start: 116, end: 118, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 118, end: 119, substring: 'a' },
      { type: 'end-tag-close', index: 0, start: 119, end: 120, substring: '>' },
      { type: 'text-start', index: 0, start: 120, end: 120, substring: '' },
      { type: 'text-plaintext', index: 0, start: 120, end: 125, substring: '\n    ' },
      { type: 'text-end', index: 0, start: 125, end: 125, substring: '' },
    ];
    // Note the "/", "<", and ">" characters.
    const tokens = html`
      <a
        data-foo="<><></></>"
        href="https://github.com/Netflix/x-element">
        click me
      </a>
    `;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('multiple opening and closing tags work', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 4, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 4, end: 5, substring: '>' },
      { type: 'start-tag-open', index: 0, start: 5, end: 6, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 6, end: 9, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 9, end: 10, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 10, end: 12, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 12, end: 15, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 15, end: 16, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 16, end: 18, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 18, end: 21, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 21, end: 22, substring: '>' },
    ];
    const tokens = html`<div><div></div></div>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('void elements work', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 6, substring: 'input' },
      { type: 'start-tag-space', index: 0, start: 6, end: 7, substring: ' ' },
      { type: 'attribute-name', index: 0, start: 7, end: 11, substring: 'type' },
      { type: 'start-tag-equals', index: 0, start: 11, end: 12, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 12, end: 13, substring: '"' },
      { type: 'attribute-value-start', index: 0, start: 13, end: 13, substring: '' },
      { type: 'attribute-value-plaintext', index: 0, start: 13, end: 21, substring: 'checkbox' },
      { type: 'attribute-value-end', index: 0, start: 21, end: 21, substring: '' },
      { type: 'start-tag-quote', index: 0, start: 21, end: 22, substring: '"' },
      { type: 'start-tag-space', index: 0, start: 22, end: 23, substring: ' ' },
      { type: 'bound-attribute-name', index: 0, start: 23, end: 28, substring: 'value' },
      { type: 'start-tag-equals', index: 0, start: 28, end: 29, substring: '=' },
      { type: 'start-tag-quote', index: 0, start: 29, end: 30, substring: '"' },
      { type: 'bound-attribute-value', index: 0, start: 30, end: 30, substring: '' },
      { type: 'start-tag-quote', index: 1, start: 0, end: 1, substring: '"' },
      { type: 'void-tag-close', index: 1, start: 1, end: 2, substring: '>' },
    ];
    const tokens = html`<input type="checkbox" value="${VALUE}">`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('textarea elements work', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 9, substring: 'textarea' },
      { type: 'start-tag-close', index: 0, start: 9, end: 10, substring: '>' },
      { type: 'text-start', index: 0, start: 10, end: 10, substring: '' },
      { type: 'text-plaintext', index: 0, start: 10, end: 31, substring: '<em>this</em> is the ' },
      { type: 'text-reference', index: 0, start: 31, end: 38, substring: '&ldquo;' },
      { type: 'text-plaintext', index: 0, start: 38, end: 45, substring: 'default' },
      { type: 'text-reference', index: 0, start: 45, end: 52, substring: '&rdquo;' },
      { type: 'text-plaintext', index: 0, start: 52, end: 58, substring: ' value' },
      { type: 'text-end', index: 0, start: 58, end: 58, substring: '' },
      { type: 'end-tag-open', index: 0, start: 58, end: 60, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 60, end: 68, substring: 'textarea' },
      { type: 'end-tag-close', index: 0, start: 68, end: 69, substring: '>' },
    ];
    const tokens = html`<textarea><em>this</em> is the &ldquo;default&rdquo; value</textarea>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('textarea elements with strict interpolation work', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 9, substring: 'textarea' },
      { type: 'start-tag-close', index: 0, start: 9, end: 10, substring: '>' },
      { type: 'bound-text-value', index: 0, start: 10, end: 10, substring: '' },
      { type: 'end-tag-open', index: 1, start: 0, end: 2, substring: '</' },
      { type: 'end-tag-name', index: 1, start: 2, end: 10, substring: 'textarea' },
      { type: 'end-tag-close', index: 1, start: 10, end: 11, substring: '>' },
    ];
    const tokens = html`<textarea>${VALUE}</textarea>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('custom elements work', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 8, substring: 'foo-bar' },
      { type: 'start-tag-close', index: 0, start: 8, end: 9, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 9, end: 11, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 11, end: 18, substring: 'foo-bar' },
      { type: 'end-tag-close', index: 0, start: 18, end: 19, substring: '>' },
    ];
    const tokens = html`<foo-bar></foo-bar>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });

  it('template elements work', () => {
    const expectedTokens = [
      { type: 'start-tag-open', index: 0, start: 0, end: 1, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 1, end: 9, substring: 'template' },
      { type: 'start-tag-close', index: 0, start: 9, end: 10, substring: '>' },
      { type: 'start-tag-open', index: 0, start: 10, end: 11, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 11, end: 14, substring: 'div' },
      { type: 'start-tag-close', index: 0, start: 14, end: 15, substring: '>' },
      { type: 'start-tag-open', index: 0, start: 15, end: 16, substring: '<' },
      { type: 'start-tag-name', index: 0, start: 16, end: 17, substring: 'p' },
      { type: 'start-tag-close', index: 0, start: 17, end: 18, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 18, end: 20, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 20, end: 21, substring: 'p' },
      { type: 'end-tag-close', index: 0, start: 21, end: 22, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 22, end: 24, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 24, end: 27, substring: 'div' },
      { type: 'end-tag-close', index: 0, start: 27, end: 28, substring: '>' },
      { type: 'end-tag-open', index: 0, start: 28, end: 30, substring: '</' },
      { type: 'end-tag-name', index: 0, start: 30, end: 38, substring: 'template' },
      { type: 'end-tag-close', index: 0, start: 38, end: 39, substring: '>' },
    ];
    const tokens = html`<template><div><p></p></div></template>`;
    assert(deepEqual(tokens, expectedTokens), stringifyTokens(tokens));
  });
});

describe('errors', () => {
  it('throws when markup after end tag cannot be parsed', () => {
    const callback = () => htmlol`<div></div><`;
    const expectedMessage = '[#110]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag (preceding space)', () => {
    const callback = () => html`<textarea id="target"> ${VALUE}</textarea>`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag (succeeding space)', () => {
    const callback = () => html`<textarea id="target">${VALUE} </textarea>`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag', () => {
    const callback = () => html`<textarea id="target">please ${VALUE} no</textarea>`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag via nesting', () => {
    const callback = () => html`<textarea id="target"><b>please ${VALUE} no</b></textarea>`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attempting non-trivial interpolation of a textarea tag via nesting', () => {
    const callback = () => html`<textarea><b>please ${VALUE} no</b></textarea>`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when interpolation of a textarea is at the end of the template', () => {
    const callback = () => html`<textarea>${VALUE}`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for unquoted attributes', () => {
    const callback = () => html`<div id="target" not-ok=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for single-quoted attributes', () => {
    const callback = () => html`<div id="target" not-ok='${VALUE}'>Gotta double-quote those.</div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for unquoted properties', () => {
    const callback = () => html`<div id="target" .notOk=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for single-quoted properties', () => {
    const callback = () => html`<div id="target" .notOk='${VALUE}'>Gotta double-quote those.</div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('no weird re-entrance issues', async () => {
    class TestElement1 extends HTMLElement {
      constructor() {
        super();
        html`<div></div>`;
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
    const expectedMessage = '[#120]';
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
    const expectedMessage = '[#104]';
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
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound boolean attribute ends with a hyphen', () => {
    const callback = () => html`<div what-></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute starts with a hyphen', () => {
    const callback = () => html`<div -what="no"></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute starts with a number', () => {
    const callback = () => html`<div 5what="no"></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute has an uppercase letter', () => {
    const callback = () => html`<div wHat="no"></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if an unbound attribute ends with a hyphen', () => {
    const callback = () => html`<div what-="no"></div>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute starts with a hyphen', () => {
    const callback = () => html`<div ?-what="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute starts with a number', () => {
    const callback = () => html`<div ?3what="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute has an uppercase letter', () => {
    const callback = () => html`<div ?wHat="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute ends with a hyphen', () => {
    const callback = () => html`<div ?what-="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute has a malformed dangling quote', () => {
    const callback = () => html`<div ?what="${VALUE} "></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute ends with a hyphen', () => {
    const callback = () => html`<div ?what-="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute has a malformed dangling quote', () => {
    const callback = () => html`<div ?what="${VALUE} "></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound boolean attribute is at the end of the template', () => {
    const callback = () => htmlol`<div ?bool="${VALUE}`;
    const expectedMessage = '[#157]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute starts with a hyphen', () => {
    const callback = () => html`<div ??-what="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute starts with a number', () => {
    const callback = () => html`<div ??3what="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute has an uppercase letter', () => {
    const callback = () => html`<div ??wHat="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute ends with a hyphen', () => {
    const callback = () => html`<div ??what-="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute has a malformed dangling quote', () => {
    const callback = () => html`<div ??what="${VALUE} "></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound defined attribute is at the end of the template', () => {
    const callback = () => htmlol`<div ??what="${VALUE}`;
    const expectedMessage = '[#157]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute starts with a hyphen', () => {
    const callback = () => html`<div -what="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute starts with a number', () => {
    const callback = () => html`<div 3what="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute has an uppercase letter', () => {
    const callback = () => html`<div wHat="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute ends with a hyphen', () => {
    const callback = () => html`<div what-="${VALUE}"></div>`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute has a malformed dangling quote', () => {
    const callback = () => html`<div what="${VALUE} "></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound attribute is at the end of the template', () => {
    const callback = () => htmlol`<div what="${VALUE}`;
    const expectedMessage = '[#157]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for misuse of a bound property prefix with a literal value', () => {
    const callback = () => html`<div .literal="property"></div>`;
    const expectedMessage = '[#104]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property starts with an underscore', () => {
    const callback = () => html`<div ._what="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property starts with a number', () => {
    const callback = () => html`<div .3what="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property starts with a capital letter', () => {
    const callback = () => html`<div .Yak="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property ends with an underscore', () => {
    const callback = () => html`<div .what_="${VALUE}"></div>`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property has a malformed dangling quote', () => {
    const callback = () => html`<div .what="${VALUE} "></div>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a bound property is at the end of the template', () => {
    const callback = () => htmlol`<div .what="${VALUE}`;
    const expectedMessage = '[#157]';
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
    const expectedMessage = '[#154]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws if a close a tag is followed by malformed html', () => {
    const callback = () => html`<div></div><-div>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write unicode in a js-y decimal format', () => {
    const callback1 = () => htmlol`<div>please no\x8230</div>`;
    const callback2 = () => htmlol`<div>please no\\\x8230</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write unicode in a js-y hexadecimal format', () => {
    const callback1 = () => htmlol`<div>please no\u2026</div>`;
    const callback2 = () => htmlol`<div>please no\\\u2026</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write newlines in a js-y format', () => {
    const callback1 = () => htmlol`<div>please no\n</div>`;
    const callback2 = () => htmlol`<div>please no\\\n</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write tabs in a js-y format', () => {
    const callback1 = () => htmlol`<div>please no\t</div>`;
    const callback2 = () => htmlol`<div>please no\\\t</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write returns in a js-y format', () => {
    const callback1 = () => htmlol`<div>please no\r</div>`;
    const callback2 = () => htmlol`<div>please no\\\r</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write null characters in a js-y format', () => {
    const callback1 = () => htmlol`<div>please no\0</div>`;
    const callback2 = () => htmlol`<div>please no\\\0</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write form feed characters in a js-y format', () => {
    const callback1 = () => htmlol`<div>please no\f</div>`;
    const callback2 = () => htmlol`<div>please no\\\f</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write backspace characters in a js-y format', () => {
    const callback1 = () => htmlol`<div>please no\b</div>`;
    const callback2 = () => htmlol`<div>please no\\\b</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write vertical tab characters in a js-y format', () => {
    const callback1 = () => htmlol`<div>please no\v</div>`;
    const callback2 = () => htmlol`<div>please no\\\v</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
    assertThrows(callback2, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write backslash', () => {
    const callback1 = () => htmlol`<div>\\</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write literal backslash via an escape', () => {
    const callback1 = () => htmlol`<div>\\</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write literal back tick via an escape', () => {
    const callback1 = () => htmlol`<div>\`</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
  });

  it('throws for trying to write literal dollar sign via an escape', () => {
    const callback1 = () => htmlol`<div>\$</div>`;
    const expectedMessage = '[#150]';
    assertThrows(callback1, expectedMessage, { startsWith: true });
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

  it('throws for forbidden <style> tag', () => {
    const callback = () => html`<style></style>`;
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

  it('throws for forbidden <svg> tag', () => {
    const callback = () => html`<svg></svg>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for declarative shadow roots', () => {
    const callback = () => html`<template shadowrootmode="open"></template>`;
    const expectedMessage = '[#156]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });
});

// Sanity check to make sure we’re able to hit all our errors.
describe('errors coverage', () => {

  it('throws when initial markup cannot be parsed', () => {
    const callback = () => htmlol`<`;
    const expectedMessage = '[#100]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after text cannot be parsed', () => {
    const callback = () => htmlol`text<`;
    const expectedMessage = '[#101]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after comment cannot be parsed', () => {
    const callback = () => htmlol`<!--comment--><`;
    const expectedMessage = '[#102]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after content interpolation cannot be parsed', () => {
    const callback = () => htmlol`${VALUE}<`;
    const expectedMessage = '[#103]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after start tag space cannot be parsed', () => {
    const callback = () => htmlol`<input !>`;
    const expectedMessage = '[#104]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after start tag cannot be parsed', () => {
    const callback = () => htmlol`<div><`;
    const expectedMessage = '[#105]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after bound boolean cannot be parsed', () => {
    const callback = () => htmlol`<div ?boolean="${VALUE}!`;
    const expectedMessage = '[#106]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after bound defined cannot be parsed', () => {
    const callback = () => htmlol`<div ??defined="${VALUE}!`;
    const expectedMessage = '[#107]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after bound attribute cannot be parsed', () => {
    const callback = () => htmlol`<div attribute="${VALUE}!`;
    const expectedMessage = '[#108]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after bound property cannot be parsed', () => {
    const callback = () => htmlol`<div .property="${VALUE}!`;
    const expectedMessage = '[#109]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when markup after end tag cannot be parsed', () => {
    const callback = () => htmlol`<div></div><`;
    const expectedMessage = '[#110]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  //////////////////////////////////////////////////////////////////////////////

  it('throws when start tag is invalid', () => {
    const callback = () => htmlol`<dIv>`;
    const expectedMessage = '[#120]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when start tag space is invalid', () => {
    // There is a literal tab character here.
    const callback = () => htmlol`<div	>`;
    const expectedMessage = '[#121]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when start tag close is invalid', () => {
    const callback = () => htmlol`<div foo />`;
    const expectedMessage = '[#122]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when end tag is invalid', () => {
    const callback = () => htmlol`<div></ div>`;
    const expectedMessage = '[#123]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when attribute name is invalid', () => {
    const callback = () => htmlol`<div Boolean>`;
    const expectedMessage = '[#124]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when bound attribute name is invalid', () => {
    const callback = () => htmlol`<div ?Boolean="${VALUE}">`;
    const expectedMessage = '[#125]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when bound property name is invalid', () => {
    const callback = () => htmlol`<div .Property="${VALUE}">`;
    const expectedMessage = '[#126]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when bound closing quote is invalid', () => {
    const callback = () => htmlol`<div attribute="${VALUE}'>`;
    const expectedMessage = '[#127]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when cdata exists', () => {
    const callback = () => htmlol`<![CDATA[<]]>`;
    const expectedMessage = '[#140]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when escapes are used', () => {
    const callback = () => htmlol`\n`;
    const expectedMessage = '[#150]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when ambiguous ampersands are used', () => {
    const callback = () => htmlol`&a`;
    const expectedMessage = '[#151]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws when comments are invalid', () => {
    const callback = () => htmlol`<!-- -- -->`;
    const expectedMessage = '[#152]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for unsupported (or unknown) native tags', () => {
    const callback = () => htmlol`<style>`;
    const expectedMessage = '[#153]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for wrong or missing end tag', () => {
    const callback = () => htmlol`<div>`;
    const expectedMessage = '[#154]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for textarea abuse', () => {
    const callback = () => htmlol`<textarea> -- ${VALUE} -- </textarea>`;
    const expectedMessage = '[#155]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for declarative shadow root / shadowrootmode', () => {
    const callback = () => htmlol`<template shadowrootmode>`;
    const expectedMessage = '[#156]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });

  it('throws for missing closing quote at end of template', () => {
    const callback = () => htmlol`<template foo="${VALUE}`;
    const expectedMessage = '[#157]';
    assertThrows(callback, expectedMessage, { startsWith: true });
  });
});

describe('html error formatting', () => {
  it('single line template', () => {
    const callback = () => html`<div id="target" not-ok=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#125] Invalid tag attribute interpolation (must use kebab-case names and double-quoted values).\nSee substring `not-ok=`.\nYour HTML was parsed through: `<div id="target" `.';
    assertThrows(callback, expectedMessage);
  });

  it('template with two lines', () => {
    const callback = () => html`
      <div id="target" not-ok='${VALUE}'>Gotta double-quote those.</div>`;
    const expectedMessage = '[#125] Invalid tag attribute interpolation (must use kebab-case names and double-quoted values).\nSee substring `not-ok=\'`.\nYour HTML was parsed through: `\n      <div id="target" `.';
    assertThrows(callback, expectedMessage);
  });

  it('template with three lines', () => {
    const callback = () => html`
      
      
      <div id="target" .notOk=${VALUE}>Gotta double-quote those.</div>`;
    const expectedMessage = '[#126] Invalid tag property interpolation (must use kebab-case names and double-quoted values).\nSee substring `.notOk=`.\nYour HTML was parsed through: `\n      \n      \n      <div id="target" `.';
    assertThrows(callback, expectedMessage);
  });
});

describe('validate', () => {
  // For simple validation purposes — a noop “onToken” can be provided.
  const onToken = () => {};
  // eslint-disable-next-line no-shadow
  const html = strings => XParser.parse(strings, onToken);

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
    const context = XParser.getErrorContext(error);
    assert(!!context, 'no context was provided');
    assert(context.index === 0);
    assert(context.start === 0);
    assert(context.end === 5);
  });

  it('initial error contains context for debugging', () => {
    let error;
    try {
      html`this will fail immediately because of the following escape \u2026`;
    } catch (err) {
      error = err;
    }
    assert(!!error, 'no error was thrown');
    const context = XParser.getErrorContext(error);
    assert(!!context, 'no context was provided');
    assert(Number.isInteger(context.index));
    assert(context.start === null);
    assert(context.end === null);
  });
});
