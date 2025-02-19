/** Strict HTML parser meant to handle interpolated HTML. */
export class XParser {
  // We use this to add machine-readable context to parsing errors.
  static #errorContextKey = Symbol();

  // Integrators may mock global window object (e.g., for eslint validation).
  #window = null;

  // It’s more performant to clone a single fragment, so we keep a reference.
  #fragment = null;

  // We decode character references via “setHTMLUnsafe” on this container.
  #htmlEntityContainer = null;

  // DOM introspection is expensive. Since we are creating all of the elements,
  //  we can cache the introspections we need behind performant lookups.
  #localName = Symbol();
  #parentNode = Symbol();

  // Delimiter we add to improve debugging. E.g., `<div id="${…}"></div>`.
  #delimiter = '${\u2026}';

  //////////////////////////////////////////////////////////////////////////////
  // HTML - https://developer.mozilla.org/en-US/docs/Web/HTML/Element //////////
  //////////////////////////////////////////////////////////////////////////////

  // Void tags - https://developer.mozilla.org/en-US/docs/Glossary/Void_element
  #voidHtmlElements = new Set([
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'source', 'track', 'wbr',
  ]);

  #htmlElements = new Set([
    // Main Root
    'html',
    // Document metadata
    'head', 'base', 'link', 'meta', 'title', 'style',
    // Sectioning root
    'body',
    // Content sectioning
    'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'search',
    // Text content
    'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li',
    'menu', 'ol', 'p', 'pre', 'ul',
    // Inline text semantics
    'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em',
    'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span',
    'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',
    // Image and multimedia
    'area', 'audio', 'img', 'map', 'track', 'video',
    // Embedded content
    'embed', 'fencedframe', 'iframe', 'object', 'picture', 'portal', 'source',
    // SVG and MathML
    'svg', 'math',
    // Scripting
    'script', 'noscript', 'canvas',
    // Demarcating edits
    'del', 'ins',
    // Table content
    'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr',
    // Forms
    'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend',
    'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea',
    // Interactive elements
    'details', 'dialog', 'summary',
    // Web components
    'slot', 'template',
    // Obsolete and deprecated elements
    'acronym', 'big', 'center', 'content', 'dir', 'font', 'frame', 'frameset',
    'image', 'marquee', 'menuitem', 'nobr', 'noembed', 'noframes', 'param',
    'plaintext', 'rb', 'rtc', 'shadow', 'strike', 'tt', 'xmp',
  ]);
  #deniedHtmlElements = new Set([
    'html', 'head', 'base', 'link', 'meta', 'title', 'style', 'body', 'script',
    'noscript', 'canvas', 'acronym', 'big', 'center', 'content', 'dir', 'font',
    'frame', 'frameset', 'image', 'marquee', 'menuitem', 'nobr', 'noembed',
    'noframes', 'param', 'plaintext', 'rb', 'rtc', 'shadow', 'strike',
    'tt', 'xmp', 'math', 'svg',
  ]);
  #allowedHtmlElements = this.#htmlElements.difference(this.#deniedHtmlElements);

  //////////////////////////////////////////////////////////////////////////////
  // Parsing State Values //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // These are all the states we can be in while we parse a string.
  //  https://w3c.github.io/html-reference/syntax.html

  // The “initial” and “boundContent” states are special in that there is no
  //  related pattern to match. Initial is just the state we start in and we
  //  only find bound content at string terminals (i.e., interpolations). The
  //  patterns below are intentionally unmatchable.
  #initial =      /\b\B/y;
  #boundContent = /\b\B/y;

  // Our unbound content rules follow the “normal character data” spec.
  //  https://w3c.github.io/html-reference/syntax.html#normal-character-data
  #unboundContent = /[^<]+/y;

  // Our comment rules follow the “comments” spec.
  //  https://w3c.github.io/html-reference/syntax.html#comments
  #unboundComment = /<!--.*?-->/ys;

  // Our tag name rules are more restrictive than the “tag name” spec.
  //  https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-name
  // Html tag names can contain the characters [a-z], [0-9], and a hyphen. The
  //  first character must be [a-z] and must directly follow the opening angle
  //  bracket. The last character cannot be a hyphen. The closing bracket of the
  //  open tag cannot be preceded by a space or newline. The closing tag must
  //  not contain spaces or newlines.
  // Examples:
  //  - ok: <h6>, <my-element-1>
  //  - not ok: <-div>, <1-my-element>
  #openTagStart = /<(?![0-9-])[a-z0-9-]+(?<!-)(?=[\s\n>])/y;
  #closeTag =   /<\/(?![0-9-])[a-z0-9-]+(?<!-)>/y;
  #openTagEnd = /(?<![\s\n])>/y;

  // TODO: Check on performance for this pattern. We want to do a positive
  //  lookahead so that we report the correct failure on fail.
  // Our space-delimiter rules more restrictive than the “space” spec.
  //  https://w3c.github.io/html-reference/terminology.html#space
  // Spaces must either be singular — or, a single newline followed by spaces
  //  used as indentation (we do not validate uniform indentation). Spaces may
  //  contain a maximum of _one_ newline.
  // Examples:
  //  - ok: <div foo bar>, <div\n  foo\n  bar>
  //  - not ok: <div foo  bar>, <div\n\n  foo\n\n  bar>, <div\tfoo\tbar>
  #openTagSpace = / (?! )|\n *(?!\n)(?=[-_.?a-zA-Z0-9>])/y;

  // Our attribute rules are more restrictive than the “attribute” spec.
  //  https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
  // Our DSL allows for a preceding “?” for bound boolean attributes and a
  //  preceding “??” for bound defined attributes.
  // Attribute names can contain the characters [a-z], [0-9], and a hyphen. But,
  //  they cannot begin with numbers and cannot begin or end in a hyphen.
  // When binding a name to a value, the value must be strictly enclosed in
  //  double-quotes.
  // Attribute name examples:
  //  - ok: id, x1, foo-bar
  //  - not ok: 1a, Hi, fooBar, -id, title-
  // Full attribute examples:
  //  - ok: foo, foo="bar", ?foo="${'bar'}", ??foo="${'bar'}", foo="${'bar'}"
  //  - not ok: foo='bar', ?foo, foo=${'bar'}
  #unboundBoolean =   /(?![0-9-])[a-z0-9-]+(?<!-)(?=[\s\n>])/y;
  #unboundAttribute = /(?![0-9-])[a-z0-9-]+(?<!-)="[^"]*"(?=[\s\n>])/y;
  #boundBoolean =   /\?(?![0-9-])[a-z0-9-]+(?<!-)="$/y;
  #boundDefined = /\?\?(?![0-9-])[a-z0-9-]+(?<!-)="$/y;
  #boundAttribute =   /(?![0-9-])[a-z0-9-]+(?<!-)="$/y;

  // There is no concept of a property binding in the HTML specification, but
  //  our DSL allows for a preceding “.” for bound properties.
  // Property names can contain the characters [a-z], [A-Z], [0-9], and an
  //  underscore. But, they cannot begin with numbers, capital letters, or
  //  underscores — and they cannot end with an underscore. Values bound to
  //  properties must be interpolations and those interpolations must be
  //  strictly enclosed in double-quotes.
  // Property name examples:
  //  - ok: id, className, defaultValue, test123
  //  - not ok: snake_case, YELLING, 1a, _private
  // Full property examples:
  //  - ok: .foo="${'bar'}"
  //  - not ok: .foo='${'bar'}', .foo="bar"
  #boundProperty = /\.(?![A-Z0-9_])[a-zA-Z0-9_]+(?<!_)="$/y;

  // We require that values bound to attributes and properties be enclosed
  //  in double-quotes (see above patterns). Because interpolations delimit our
  //  “strings”, we need to check that the _next_ string begins with a
  //  double-quote. Note that it must precede a space, a newline, or the closing
  //  angle bracket of the opening tag.
  #danglingQuote = /"(?=[ \n>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Special Tag Patterns //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The “textarea” tag is special in that it’s content is considered
  //  “replaceable” character data. We treat all characters between the opening
  //  and closing tags as the content. Note that we allow the “.” to match
  //  across newlines.
  //  https://w3c.github.io/html-reference/syntax.html#replaceable-character-data
  #throughTextarea = /.*?<\/textarea>/ys;

  //////////////////////////////////////////////////////////////////////////////
  // JS-y Escapes //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Character escapes like “\n”, “\u” or ”\x” are a JS-ism. We want developers
  //  to use HTML here, not JS. You can of course interpolate whatever you want.
  //  https://w3c.github.io/html-reference/syntax.html#character-encoding
  //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape
  // Note that syntax highlighters expect the text after the “html” tag to be
  //  real HTML. Another reason to reject JS-y unicode is that it won’t be
  //  interpreted correctly by tooling that expects _html_.
  // The only escapes we expect to see are for the “$”, “\”, and “`” characters,
  //  which you _must_ use if you need those literal characters.
  // The simplest way to check this is to ensure that back slashes always come
  //  in pairs of two or a single back slash preceding a back tick.
  // Examples:
  //  - ok: html`&#8230;`, html`&#x2026;`, html`&mldr;`, html`&hellip;`, html`\\n`
  //  - not ok: html`\nhi\nthere`, html`\x8230`, html`\u2026`, html`\s\t\o\p\ \i\t\.`
  #rawJsEscape = /.*(?<!\\)(?:\\{2})*\\(?![$\\`])/ys;

  //////////////////////////////////////////////////////////////////////////////
  // Character References //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Text, comments, and replaceable character data may include so-called
  //  character references (or html entities). We have a couple patterns for
  //  disambiguating between ambiguous ampersands and reference starts as well.
  // So-called “replaceable” character data (e.g., most content) can contain
  //  character references (i.e., html entities) which need to be decoded. Such
  //  references can be “named”, “hexadecimal” code points or “decimal” code
  //  points. And, for completeness, large code points can result in multiple
  //  characters as replacement text. We match such entities broadly and then
  //  rely on setHTMLUnsafe to decode.
  // https://w3c.github.io/html-reference/syntax.html#character-encoding
  #entity =          /&.*?;/ys;
  #htmlEntityStart = /[^&]*&[^&\s\n<]/y;

  //////////////////////////////////////////////////////////////////////////////
  // CDATA /////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // You can use a CDATA section to enable _any_ text — even otherwise-special
  //  characters like “&”, “<”, “>”, etc. However, this is an infrequently-used
  //  feature so we don’t support it as you can simply encode such things. For
  //  example, to get the text “x < y” you could do either:
  //  - <div><![CDATA[x < y]]></div>
  //  - <div>x &lt; y</div>
  //  … we make an opinion that authors should just use the latter.
  #cdataStart = /<!\[CDATA\[/y;

  //////////////////////////////////////////////////////////////////////////////
  // Common Mistakes ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // See if weird spaces were added or if incorrect characters were used in
  //  open or close tags.
  #openTagStartMalformed = /<[\s\n]*[a-zA-Z0-9_-]+/y;
  #openTagSpaceMalformed = /[\s\n]+/y;
  #openTagEndMalformed =   /[\s\n]*\/?>/y;
  #closeTagMalformed =     /<[\s\n]*\/[\s\n]*[a-zA-Z0-9_-]+[^>]*>/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  either unbound or bound attributes.
  #unboundBooleanMalformed =   /[a-zA-Z0-9-_]+(?=[\s\n>])/y;
  #unboundAttributeMalformed = /[a-zA-Z0-9-_]+=(?:"[^"]*"|'[^']*')?(?=[\s\n>])/y;
  #boundBooleanMalformed =   /\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  #boundDefinedMalformed = /\?\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  #boundAttributeMalformed =   /[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  a bound property.
  #boundPropertyMalformed = /\.[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if the quote pair was malformed or missing.
  #danglingQuoteMalformed = /'?(?=[\s\n>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Errors ////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Simple mapping of all the errors which can be thrown by the parser. The
  //  parsing errors are allotted numbers #100-#199.
  #errorMessages = new Map([
    ['#100', 'Markup at the start of your template could not be parsed.'],
    ['#101', 'Markup after content text found in your template could not be parsed.'],
    ['#102', 'Markup after a comment found in your template could not be parsed.'],
    ['#103', 'Markup after a content interpolation in your template could not be parsed.'],
    ['#104', 'Markup after the tag name in an opening tag in your template could not be parsed.'],
    ['#105', 'Markup after a spacing in an opening tag in your template could not be parsed.'],
    ['#106', 'Markup after an opening tag in your template could not be parsed.'],
    ['#107', 'Markup after a boolean attribute in an opening tag in your template could not be parsed.'],
    ['#108', 'Markup after an attribute in an opening tag in your template could not be parsed.'],
    ['#109', 'Markup after a boolean attribute interpolation in an opening tag in your template could not be parsed.'],
    ['#110', 'Markup after a defined attribute interpolation in an opening tag in your template could not be parsed.'],
    ['#111', 'Markup after an attribute interpolation in an opening tag in your template could not be parsed.'],
    ['#112', 'Markup after a property interpolation in an opening tag in your template could not be parsed.'],
    ['#113', 'Markup after the closing quote of an interpolated attribute or property in an opening tag in your template could not be parsed.'],
    ['#114', 'Markup after a closing tag in your template could not be parsed.'],

    ['#120', 'Malformed open start tag — tag names must be alphanumeric, lowercase, cannot start or end with hyphens, and cannot start with a number.'],
    ['#121', 'Malformed open tag space — spaces in open tags must be literal whitespace characters or newlines. Inter-declaration spaces must be singular. Spaces after newlines may be used for indentation. Only one newline is allowed.'],
    ['#122', 'Malformed end to an opening tag — opening tags must close without any extraneous spaces or newlines.'],
    ['#123', 'Malformed close tag — close tags must not contain any extraneous spaces or newlines and tag names must be alphanumeric, lowercase, cannot start or end with hyphens, and cannot start with a number.'],
    ['#124', 'Malformed boolean attribute text — attribute names must be alphanumeric, must be lowercase, must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#125', 'Malformed attribute text — attribute names must be alphanumeric, must be lowercase, must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#126', 'Malformed boolean attribute interpolation — attribute names must be alphanumeric, must be lowercase, must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#127', 'Malformed defined attribute interpolation — attribute names must be alphanumeric, must be lowercase, must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#128', 'Malformed attribute interpolation — attribute names must be alphanumeric, must be lowercase, must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#129', 'Malformed property interpolation — property names must be alphanumeric, must be lowercase, must not start or end with underscores, and cannot start with a number — and, property values must be enclosed in double-quotes.'],
    ['#130', 'Malformed closing quote to a bound attribute or property. Enclosing quotes must be simple, double-quotes.'],

    ['#140', 'CDATA sections are forbidden. Use html entities (character encodings) instead.'],

    ['#150', 'Improper javascript escape (\\x, \\u, \\t, \\n, etc.) in raw template string. Only escapes to create a literal dollar (“$”), slash (“\\”), or back tick (“`”) is allowed. Only valid HTML entities (character references) are supported in html as code points. Use literal characters (e.g., newlines) to enter newlines in your templates.'],
    ['#151', 'Malformed hexadecimal character reference (html entity) or ambiguous ampersand.'],
    ['#152', 'Malformed html comment. Comments cannot start with “>” or “->” characters, they cannot include a set of “--” characters, and they cannot end with a “-” character.'],
    ['#153', 'Forbidden html element used — this parser is opinionated about which elements are allowed in order to reduce complexity and improve performance.'],
    ['#154', 'Unmatched closing tag at the end of your template. To avoid unintended markup, non-void tags must explicitly be closed.'],
    ['#155', 'Mismatched closing tag used. To avoid unintended markup, non-void tags must explicitly be closed and all closing tag names must be a case-sensitive match.'],
    ['#156', 'Forbidden, nontrivial interpolation of <textarea> tag used. Only basic interpolation is allowed — e.g., <textarea>${…}</textarea>.'],
    ['#157', 'Forbidden declarative shadow root used (e.g., `<template shadowrootmode="open">`).'],
  ]);

  // Block #100-#119 — Invalid transition errors.
  #valueToErrorMessagesKey = new Map([
    [this.#initial,                   '#100'],
    [this.#unboundContent,            '#101'],
    [this.#unboundComment,            '#102'],
    [this.#boundContent,              '#103'],
    [this.#openTagStart,              '#104'],
    [this.#openTagSpace,              '#105'],
    [this.#openTagEnd,                '#106'],
    [this.#unboundBoolean,            '#107'],
    [this.#unboundAttribute,          '#108'],
    [this.#boundBoolean,              '#109'],
    [this.#boundDefined,              '#110'],
    [this.#boundAttribute,            '#111'],
    [this.#boundProperty,             '#112'],
    [this.#danglingQuote,             '#113'],
    [this.#closeTag,                  '#114'],
  ]);

  // Block #120-#139 — Common mistakes.
  #valueMalformedToErrorMessagesKey = new Map([
    [this.#openTagStartMalformed,     '#120'],
    [this.#openTagSpaceMalformed,     '#121'],
    [this.#openTagEndMalformed,       '#122'],
    [this.#closeTagMalformed,         '#123'],
    [this.#unboundBooleanMalformed,   '#124'],
    [this.#unboundAttributeMalformed, '#125'],
    [this.#boundBooleanMalformed,     '#126'],
    [this.#boundDefinedMalformed,     '#127'],
    [this.#boundAttributeMalformed,   '#128'],
    [this.#boundPropertyMalformed,    '#129'],
    [this.#danglingQuoteMalformed,    '#130'],
  ]);

  // Block #140-#149 — Forbidden transitions.
  #valueForbiddenToErrorMessagesKey = new Map([
    [this.#cdataStart,                '#140'],
  ]);

  // Block #150+ — Special, named issues.
  #namedErrorsToErrorMessagesKey = new Map([
    ['javascript-escape',                    '#150'],
    ['malformed-html-entity',                '#151'],
    ['malformed-comment',                    '#152'],
    ['forbidden-html-element',               '#153'],
    ['missing-closing-tag',                  '#154'],
    ['mismatched-closing-tag',               '#155'],
    ['complex-textarea-interpolation',       '#156'],
    ['declarative-shadow-root',              '#157'],
  ]);

  //////////////////////////////////////////////////////////////////////////////
  // Internal parsing logic ////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Returns the first valid state-machine transition (if one exists).
  #try(string, stringIndex, ...values) {
    for (const value of values) {
      value.lastIndex = stringIndex;
      if (value.test(string)) {
        return value;
      }
    }
  }

  // Special cases we want to warn about, but which are not just malformed
  //  versions of valid transitions.
  #forbiddenTransition(string, stringIndex, value) {
    switch (value) {
      case this.#initial:
      case this.#boundContent:
      case this.#unboundContent:
      case this.#openTagEnd:
      case this.#closeTag: return this.#try(string, stringIndex,
        this.#cdataStart);
    }
  }

  // This should roughly match our “valid” transition mapping, but for errors.
  #invalidTransition(string, stringIndex, value) {
    switch (value) {
      case this.#initial: return this.#try(string, stringIndex,
        this.#openTagStartMalformed);
      case this.#unboundContent: return this.#try(string, stringIndex,
        this.#closeTagMalformed,
        this.#openTagStartMalformed);
      case this.#boundContent: return this.#try(string, stringIndex,
        this.#closeTagMalformed,
        this.#openTagStartMalformed);
      case this.#unboundComment: return this.#try(string, stringIndex,
        this.#closeTagMalformed,
        this.#openTagStartMalformed);
      case this.#openTagStart:
      case this.#unboundBoolean:
      case this.#unboundAttribute:
      case this.#danglingQuote: return this.#try(string, stringIndex,
        this.#openTagSpaceMalformed);
      case this.#openTagSpace: return this.#try(string, stringIndex,
        this.#unboundBooleanMalformed,
        this.#unboundAttributeMalformed,
        this.#boundBooleanMalformed,
        this.#boundDefinedMalformed,
        this.#boundAttributeMalformed,
        this.#boundPropertyMalformed,
        this.#openTagEndMalformed);
      case this.#openTagEnd: return this.#try(string, stringIndex,
        this.#openTagStartMalformed,
        this.#closeTagMalformed);
      case this.#boundBoolean:
      case this.#boundDefined:
      case this.#boundAttribute:
      case this.#boundProperty: return this.#try(string, stringIndex,
        this.#danglingQuoteMalformed);
      case this.#closeTag: return this.#try(string, stringIndex,
        this.#openTagStartMalformed,
        this.#closeTagMalformed);
    }
  }

  // This is the core of the state machine. It describes every valid traversal
  //  through a set of html template “strings” array.
  #validTransition(string, stringIndex, value) {
    switch (value) {
      // The “initial” state is where we start when we begin parsing.
      //  E.g., html`‸hello world!`
      case this.#initial: return this.#try(string, stringIndex,
        this.#unboundContent,
        this.#openTagStart,
        this.#unboundComment);

      // The “unboundContent” state means that we’ve just parsed through some
      //  literal html text either in the root of the template or between an
      //  open / close tag pair.
      //  E.g., html`hello ‸${world}!`
      case this.#unboundContent: return this.#try(string, stringIndex,
        this.#closeTag,
        this.#openTagStart,
        this.#unboundComment);

      // The “boundContent” state means that we just hit an interpolation (i.e.,
      //  started a new string).
      //  E.g., html`hello ${world}‸!`
      // The “unboundComment” state means that we just completed a comment. We
      //  don’t allow comment interpolations.
      //  E.g., html`hello <!-- todo -->‸ ${world}!`
      case this.#boundContent:
      case this.#unboundComment: return this.#try(string, stringIndex,
        this.#unboundContent,
        this.#closeTag,
        this.#openTagStart,
        this.#unboundComment); 

      // The “openTagStart” means that we’ve successfully parsed through the
      //  open angle bracket (“<”) and the tag name.
      //  E.g., html`<div‸></div>`
      // The “unboundBoolean” means we parsed through a literal boolean
      //  attribute which doesn’t have an interpolated binding.
      //  E.g., html`<div foo‸></div>`
      // The “unboundAttribute” means we parsed through a literal key-value
      //  attribute pair which doesn’t have an interpolated binding.
      //  E.g., html`<div foo="bar"‸></div>`
      // The “danglingQuote” means we parsed through a prefixing, closing quote
      //  as the first character in a new string on the other side of an
      //  interpolated value for a bound boolean attribute, a bound defined
      //  attribute, a bound normal attribute, or a bound property.
      //  E.g., html`<div foo="${bar}"‸></div>`
      case this.#openTagStart:
      case this.#unboundBoolean:
      case this.#unboundAttribute:
      case this.#danglingQuote: return this.#try(string, stringIndex,
        this.#openTagSpace,
        this.#openTagEnd);

      // The “openTagSpace” is either one space or a single newline and some
      //  indentation space after the open tag name, an attribute, or property.
      //  E.g., html`<div ‸foo></div>`
      case this.#openTagSpace: return this.#try(string, stringIndex,
        this.#unboundBoolean,
        this.#unboundAttribute,
        this.#boundBoolean,
        this.#boundDefined,
        this.#boundAttribute,
        this.#boundProperty,
        this.#openTagEnd);

      // The “openTagEnd” is just the “>” character.
      //  E.g., html`<div>‸</div>`
      case this.#openTagEnd: return this.#try(string, stringIndex,
        this.#openTagStart,
        this.#unboundContent,
        this.#closeTag,
        this.#unboundComment);

      // The “boundBoolean” state means we just ended our prior string with an
      //  interpolated boolean binding.
      //  E.g., html`<div ?foo="${bar}‸"></div>`
      // The “boundDefined” state means we just ended our prior string with an
      //  interpolated defined binding.
      //  E.g., html`<div ??foo="${bar}‸"></div>`
      // The “boundAttribute” state means we just ended our prior string with an
      //  interpolated normal attribute binding.
      //  E.g., html`<div foo="${bar}‸"></div>`
      // The “boundProperty” state means we just ended our prior string with an
      //  interpolated property binding.
      //  E.g., html`<div .foo="${bar}‸"></div>`
      case this.#boundBoolean:
      case this.#boundDefined:
      case this.#boundAttribute:
      case this.#boundProperty: return this.#try(string, stringIndex,
        this.#danglingQuote);

      // The “closeTag” state means we just closed some tag successfully,
      //  E.g., html`<div><span></span>‸</div>`
      case this.#closeTag: return this.#try(string, stringIndex,
        this.#unboundContent,
        this.#openTagStart,
        this.#closeTag,
        this.#unboundComment);
    }
  }

  // Common functionality to help print out template context when displaying
  //  helpful error messages to developers.
  #getErrorInfo(strings, stringsIndex, string, stringIndex) {
    let prefix;
    let prefixIndex;
    if (stringsIndex > 0) {
      const validPrefix = strings.slice(0, stringsIndex).join(this.#delimiter);
      prefix = [validPrefix, string].join(this.#delimiter);
      prefixIndex = validPrefix.length + this.#delimiter.length + stringIndex;
    } else {
      prefix = string;
      prefixIndex = stringIndex;
    }
    const preview = 10;
    const truncate = prefix.length > prefixIndex + preview;
    const parsed = prefix.slice(0, prefixIndex);
    const notParsed = `${prefix.slice(prefixIndex, prefixIndex + preview)}${truncate ? '…' : ''}`;
    return { parsed, notParsed };
  }

  // When we cannot transition to a valid state in our state machine — we must
  //  throw an error. Because we have to halt execution anyhow, we can use it as
  //  an opportunity to test some additional patterns to improve our messaging.
  //  This would otherwise be non-performant — but we are about to error anyhow.
  #throwTransitionError(strings, stringsIndex, string, stringIndex, value) {
    const { parsed, notParsed } = this.#getErrorInfo(strings, stringsIndex, string, stringIndex);
    const valueForbidden = this.#forbiddenTransition(string, stringIndex, value);
    const valueMalformed = this.#invalidTransition(string, stringIndex, value);
    const errorMessagesKey = valueForbidden
      ? this.#valueForbiddenToErrorMessagesKey.get(valueForbidden)
      : valueMalformed
        ? this.#valueMalformedToErrorMessagesKey.get(valueMalformed)
        : this.#valueToErrorMessagesKey.get(value);
    const errorMessage = this.#errorMessages.get(errorMessagesKey);
    const substringMessage = `See substring \`${notParsed}\`.`;
    const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
    const message = `[${errorMessagesKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`;
    throw new Error(message);
  }

  // This validates a value from our “strings.raw” array passed into our tagged
  //  template function. It checks to make sure superfluous, JS-y escapes are
  //  not being used as html (since there are perfectly-valid alternatives).
  #validateRawString(rawString) {
    this.#rawJsEscape.lastIndex = 0;
    if (this.#rawJsEscape.test(rawString)) {
      const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('javascript-escape');
      const errorMessage = this.#errorMessages.get(errorMessagesKey);
      const substringMessage = `See (raw) substring \`${rawString.slice(0, this.#rawJsEscape.lastIndex)}\`.`;
      const message = `[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`;
      throw new Error(message);
    }
  }

  // Before a successful exit, the parser ensures that all non-void opening tags
  //  have been matched successfully to prevent any unexpected behavior.
  #validateExit(fragment, element) {
    if (element.value !== fragment) {
      const tagName = element.value[this.#localName];
      const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('missing-closing-tag');
      const errorMessage = this.#errorMessages.get(errorMessagesKey);
      const substringMessage = `Missing a closing </${tagName}>.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
    }
  }

  // Certain parts of an html document may contain character references (html
  //  entities). We find them via a performant pattern, and then replace them
  //  via a non-performant usage of “setHTMLUnsafe”. This way, the cost is only
  //  as high as the number of character references used (which is often low).
  //  Note that malformed references or ambiguous ampersands will cause errors.
  //  https://html.spec.whatwg.org/multipage/named-characters.html
  #replaceHtmlEntities(originalContent) {
    let content = originalContent;
    this.#htmlEntityStart.lastIndex = 0;
    while (this.#htmlEntityStart.test(content)) {
      const contentIndex = this.#htmlEntityStart.lastIndex - 2;
      this.#entity.lastIndex = contentIndex;
      if (!this.#entity.test(content)) {
        const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('malformed-html-entity');
        const errorMessage = this.#errorMessages.get(errorMessagesKey);
        const substringMessage = `See substring \`${originalContent}\`.`;
        throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
      }
      const encoded = content.slice(contentIndex, this.#entity.lastIndex);
      this.#htmlEntityContainer.innerHTML = encoded;
      const decoded = this.#htmlEntityContainer.content.textContent;
      content = content.replace(encoded, decoded);
      this.#htmlEntityStart.lastIndex = contentIndex + decoded.length;
    }
    return content;
  }

  // Void elements are treated with special consideration as they will never
  //  contain child nodes.
  #finalizeVoidElement(path, element, childNodesIndex, nextStringIndex) {
    childNodesIndex.value = path.pop();
    element.value = element.value[this.#parentNode];
    this.#closeTag.lastIndex = nextStringIndex;
    return this.#closeTag;
  }

  // Textarea contains so-called “replaceable” character data. We throw an error
  //  if a “complex” interpolation exists — anything other than a perfectly-fit
  //  content interpolation between the opening and closing tags.
  #finalizeTextarea(string, path, element, childNodesIndex, nextStringIndex) {
    const closeTagLength = 11; // </textarea>
    this.#throughTextarea.lastIndex = nextStringIndex;
    if (this.#throughTextarea.test(string)) {
      const encoded = string.slice(nextStringIndex, this.#throughTextarea.lastIndex - closeTagLength);
      const decoded = this.#replaceHtmlEntities(encoded);
      element.value.textContent = decoded;
    } else {
      const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('complex-textarea-interpolation');
      const errorMessage = this.#errorMessages.get(errorMessagesKey);
      throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[this.#parentNode];
    this.#closeTag.lastIndex = this.#throughTextarea.lastIndex;
    return this.#closeTag;
  }

  // Unbound content is just literal text in a template string that needs to
  //  land as text content. We replace any character references (html entities)
  //  found in the content.
  #addUnboundContent(string, stringIndex, element, childNodesIndex, nextStringIndex) {
    const encoded = string.slice(stringIndex, nextStringIndex);
    const decoded = this.#replaceHtmlEntities(encoded);
    element.value.appendChild(this.#window.document.createTextNode(decoded));
    childNodesIndex.value += 1;
  }

  // An unbound comment is just a basic html comment. Comments may not be
  //  interpolated and follow some specific rules from the html specification.
  //  https://w3c.github.io/html-reference/syntax.html#comments
  #addUnboundComment(string, stringIndex, element, childNodesIndex, nextStringIndex) {
    const content = string.slice(stringIndex, nextStringIndex);
    const data = content.slice(4, -3);
    if (data.startsWith('>') || data.startsWith('->') || data.includes('--') || data.endsWith('-')) {
      const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('malformed-comment');
      const errorMessage = this.#errorMessages.get(errorMessagesKey);
      const substringMessage = `See substring \`${content}\`.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
    }
    element.value.appendChild(this.#window.document.createComment(data));
    childNodesIndex.value += 1;
  }

  // Bound content is simply an interpolation in the template which exists in a
  //  location destined to be bound as “textContent” on some node. We notify our
  //  listener about the content binding’s path.
  #addBoundContent(onContent, path, element, childNodesIndex) {
    element.value.append(
      this.#window.document.createComment(''),
      this.#window.document.createComment('')
    );
    childNodesIndex.value += 2;
    path.push(childNodesIndex.value);
    onContent(path);
    path.pop();
  }

  // This can only happen with a “textarea” element, currently. Note that the
  //  subscriber is notified about this as a “text” binding not a “content”
  //  binding so that it correctly bind _any_ interpolated value to the
  //  “textContent” property as a string — no matter the type.
  #addBoundText(onText, string, path, sloppyStartInterpolation) {
    // If the prior match isn’t our opening tag… that’s a problem. If the next
    //  match isn’t our closing tag… that’s also a problem.
    // Because we tightly control the end-tag format, we can predict what the
    //  next string’s prefix should be.
    if (sloppyStartInterpolation || !string.startsWith(`</textarea>`)) {
      const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('complex-textarea-interpolation');
      const errorMessage = this.#errorMessages.get(errorMessagesKey);
      throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
    }
    onText(path);
  }

  // An unbound boolean is a literal boolean attribute declaration with no
  //  associated value at all.
  #addUnboundBoolean(string, stringIndex, element, nextStringIndex) {
    const attributeName = string.slice(stringIndex, nextStringIndex);
    element.value.setAttribute(attributeName, '');
  }

  // An unbound attribute is a literal attribute declaration, but this time, it
  //  does have an associated value — forming a key-value pair.
  #addUnboundAttribute(string, stringIndex, element, nextStringIndex) {
    const unboundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = unboundAttribute.indexOf('=');
    const attributeName = unboundAttribute.slice(0, equalsIndex);
    const encoded = unboundAttribute.slice(equalsIndex + 2, -1);
    const decoded = this.#replaceHtmlEntities(encoded);
    element.value.setAttribute(attributeName, decoded);
  }

  // A bound boolean is a boolean attribute flag with an associated value
  //  binding. It has a single, preceding “?” character. We notify subscribers
  //  about this flag.
  #addBoundBoolean(onBoolean, string, stringIndex, path, element, nextStringIndex) {
    const boundBoolean = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundBoolean.indexOf('=');
    const attributeName = boundBoolean.slice(1, equalsIndex);
    onBoolean(attributeName, path);
  }

  // Similar to a bound boolean, but with two preceding “??” characters. We
  //  notify subscribers about this attribute which exists only when defined.
  #addBoundDefined(onDefined, string, stringIndex, path, element, nextStringIndex) {
    const boundDefined = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundDefined.indexOf('=');
    const attributeName = boundDefined.slice(2, equalsIndex);
    onDefined(attributeName, path);
  }

  // This is an attribute with a name / value pair where the “value” is bound
  //  as an interpolation. We notify subscribers about this attribute binding.
  #addBoundAttribute(onAttribute, string, stringIndex, path, element, nextStringIndex) {
    const boundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundAttribute.indexOf('=');
    const attributeName = boundAttribute.slice(0, equalsIndex);
    onAttribute(attributeName, path);
  }

  // This is an property with a name / value pair where the “value” is bound
  //  as an interpolation. We notify subscribers about this property binding.
  #addBoundProperty(onProperty, string, stringIndex, path, nextStringIndex) {
    const boundProperty = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundProperty.indexOf('=');
    const propertyName = boundProperty.slice(1, equalsIndex);
    onProperty(propertyName, path);
  }

  // In addition to the allow-list of html tag names, any tag with a hyphen in
  //  the middle is considered a valid custom element. Therefore, we must allow
  //  for such declarations.
  #validateTagName(tagName) {
    if (
      tagName.indexOf('-') === -1 &&
      !this.#allowedHtmlElements.has(tagName)
    ) {
      const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('forbidden-html-element');
      const errorMessage = this.#errorMessages.get(errorMessagesKey);
      const substringMessage = `The <${tagName}> html element is forbidden.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
    }
  }

  // We’ve parsed through and open tag start and are ready to instantiate a new
  //  dom node and potentially add attributes, properties, and children.
  #addElement(string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const prefixedTagName = string.slice(stringIndex, nextStringIndex);
    const tagName = prefixedTagName.slice(1);
    this.#validateTagName(tagName);

    const childNode = this.#window.document.createElement(tagName);
    element.value[this.#localName] === 'template'
      ? element.value.content.appendChild(childNode)
      : element.value.appendChild(childNode);
    childNode[this.#localName] = tagName;
    childNode[this.#parentNode] = element.value;
    element.value = childNode;
    childNodesIndex.value += 1;
    path.push(childNodesIndex.value);
  }

  // We’ve parsed through a close tag and can validate it, update our state to
  //  point back to our parent node, and continue parsing.
  #finalizeElement(strings, stringsIndex, string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const closeTag = string.slice(stringIndex, nextStringIndex);
    const tagName = closeTag.slice(2, -1);
    const expectedTagName = element.value[this.#localName];
    if (tagName !== expectedTagName) {
      const { parsed } = this.#getErrorInfo(strings, stringsIndex, string, stringIndex);
      const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('mismatched-closing-tag');
      const errorMessage = this.#errorMessages.get(errorMessagesKey);
      const substringMessage = `The closing tag </${tagName}> does not match <${expectedTagName}>.`;
      const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[this.#parentNode];
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public interface //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Additional error context.
   * @typedef {object} ErrorContext
   * @property {number} stringsIndex
   * @property {string} string
   * @property {number} stringIndex
   */

  /**
   * Get additional context for parsing errors.
   * @param {Error} error
   * @returns {ErrorContext|void}
   */
  static getErrorContext(error) {
    return error[XParser.#errorContextKey];
  }

  /**
   * Instantiation options.
   * @typedef {object} XParserOptions
   * @property {window} [window]
   */

  /**
   * Creates an XParser instance. Mock the “window” for validation-only usage.
   * @param {XParserOptions} [options]
   */
  constructor(options) {
    if (this.constructor !== XParser) {
      throw new Error('XParser class extension is not supported.');
    }
    this.#window = options?.window ?? globalThis;
    this.#fragment = this.#window.document.createDocumentFragment();
    this.#htmlEntityContainer = this.#window.document.createElement('template');
  }

  /**
   * The onBoolean callback.
   * @callback onBoolean
   * @param {string} attributeName
   * @param {number[]} path
   */

  /**
   * The onDefined callback.
   * @callback onDefined
   * @param {string} attributeName
   * @param {number[]} path
   */

  /**
   * The onAttribute callback.
   * @callback onAttribute
   * @param {string} attributeName
   * @param {number[]} path
   */

  /**
   * The onProperty callback.
   * @callback onProperty
   * @param {string} propertyName
   * @param {number[]} path
   */

  /**
   * The onContent callback.
   * @callback onContent
   * @param {number[]} path
   */

  /**
   * The onText callback.
   * @callback onText
   * @param {number[]} path
   */

  /**
   * The core parse function takes in the “strings” from a tagged template
   * function and returns a document fragment. The “on*” callbacks are an
   * optimization to allow a subscriber to store future lookups without
   * needing to re-walk the resulting document fragment.
   * @param {TemplateStringsArray} strings
   * @param {onBoolean} onBoolean
   * @param {onDefined} onDefined
   * @param {onAttribute} onAttribute
   * @param {onProperty} onProperty
   * @param {onContent} onContent
   * @param {onText} onText
   * @returns {DocumentFragment}
   */
  parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText) {
    const fragment = this.#fragment.cloneNode(false);
    const path = [];
    const childNodesIndex = { value: -1 }; // Wrapper to allow better factoring.
    const element = { value: fragment }; // Wrapper to allow better factoring.

    const stringsLength = strings.length;
    let stringsIndex = 0;
    let string = null;
    let stringLength = null;
    let stringIndex = null;
    let nextStringIndex = null;
    let value = this.#initial;

    try {
      while (stringsIndex < stringsLength) {
        string = strings[stringsIndex];

        this.#validateRawString(strings.raw[stringsIndex]);
        if (stringsIndex > 0) {
          switch (value) {
            case this.#initial:
            case this.#boundContent:
            case this.#unboundContent:
            case this.#openTagEnd:
            case this.#closeTag:
              if (element.value[this.#localName] === 'textarea') {
                // The textarea tag only accepts text, we restrict interpolation
                //  there. See note on “replaceable character data” in the
                //  following reference document:
                //  https://w3c.github.io/html-reference/syntax.html#text-syntax
                const sloppyStartInterpolation = value !== this.#openTagEnd;
                this.#addBoundText(onText, string, path, sloppyStartInterpolation);
              } else {
                this.#addBoundContent(onContent, path, element, childNodesIndex);
              }
              value = this.#boundContent;
              nextStringIndex = value.lastIndex;
              break;
          }
        }

        stringLength = string.length;
        stringIndex = 0;
        while (stringIndex < stringLength) {
          // The string will be empty if we have a template like this `${…}${…}`.
          //  See related logic at the end of the inner loop;
          if (string.length > 0) {
            const nextValue = this.#validTransition(string, stringIndex, value);
            if (!nextValue) {
              this.#throwTransitionError(strings, stringsIndex, string, stringIndex, value);
            }
            value = nextValue;
            nextStringIndex = value.lastIndex;
          }

          // When we transition into certain values, we need to take action.
          switch (value) {
            case this.#unboundContent:
              this.#addUnboundContent(string, stringIndex, element, childNodesIndex, nextStringIndex);
              break;
            case this.#unboundComment:
              this.#addUnboundComment(string, stringIndex, element, childNodesIndex, nextStringIndex);
              break;
            case this.#openTagStart:
              this.#addElement(string, stringIndex, path, element, childNodesIndex, nextStringIndex);
              break;
            case this.#unboundBoolean:
              this.#addUnboundBoolean(string, stringIndex, element, nextStringIndex);
              break;
            case this.#unboundAttribute:
              this.#addUnboundAttribute(string, stringIndex, element, nextStringIndex);
              break;
            case this.#boundBoolean:
              this.#addBoundBoolean(onBoolean, string, stringIndex, path, element, nextStringIndex);
              break;
            case this.#boundDefined:
              this.#addBoundDefined(onDefined, string, stringIndex, path, element, nextStringIndex);
              break;
            case this.#boundAttribute:
              this.#addBoundAttribute(onAttribute, string, stringIndex, path, element, nextStringIndex);
              break;
            case this.#boundProperty:
              this.#addBoundProperty(onProperty, string, stringIndex, path, nextStringIndex);
              break;
            case this.#openTagEnd: {
              const tagName = element.value[this.#localName];
              if (this.#voidHtmlElements.has(tagName)) {
                value = this.#finalizeVoidElement(path, element, childNodesIndex, nextStringIndex);
                nextStringIndex = value.lastIndex;
              } else if (
                tagName === 'textarea' &&
                this.#openTagEnd.lastIndex !== string.length
              ) {
                value = this.#finalizeTextarea(string, path, element, childNodesIndex, nextStringIndex);
                nextStringIndex = value.lastIndex;
              } else if (tagName === 'pre' && string[value.lastIndex] === '\n') {
                // An initial newline character is optional for <pre> tags.
                //  https://html.spec.whatwg.org/multipage/syntax.html#element-restrictions
                value.lastIndex++;
                nextStringIndex = value.lastIndex;
                // Assume we’re traversing into the new element and reset index.
                childNodesIndex.value = -1;
              } else if (
                tagName === 'template' &&
                // @ts-ignore — TypeScript doesn’t get that this is a “template”.
                element.value.hasAttribute('shadowrootmode')
              ) {
                const errorMessagesKey = this.#namedErrorsToErrorMessagesKey.get('declarative-shadow-root');
                const errorMessage = this.#errorMessages.get(errorMessagesKey);
                throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
              } else {
                // Assume we’re traversing into the new element and reset index.
                childNodesIndex.value = -1;
              }
              break;
            }
            case this.#closeTag:
              this.#finalizeElement(strings, stringsIndex, string, stringIndex, path, element, childNodesIndex, nextStringIndex);
              break;
          }
          stringIndex = nextStringIndex; // Update out pointer from our pattern match.
        }
        stringsIndex++;
      }
      this.#validateExit(fragment, element);
      return fragment;
    } catch (error) {
      error[XParser.#errorContextKey] = { stringsIndex, string, stringIndex };
      throw error;
    }
  }
}
