/** Strict HTML parser meant to handle interpolated HTML. */
class Unforgiving {
  // It’s more performant to clone a single fragment, so we keep a reference.
  static #fragment = new DocumentFragment();

  // We decode character references via “setHTMLUnsafe” on this container.
  static #htmlEntityContainer = document.createElement('template');

  // DOM introspection is expensive. Since we are creating all of the elements,
  //  we can cache the introspections we need behind performant lookups.
  static #localName = Symbol();
  static #parentNode = Symbol();
  // TODO: #237: Remove “namespace” code once “<svg>” is no longer supported.
  static #namespace = Symbol();

  // Delimiter we add to improve debugging. E.g., `<div id="${…}"></div>`.
  static #delimiter = '${\u2026}';

  // Simple flags to ensure we only warn once about things being deprecated.
  // TODO: #237: Remove <style> tag usage.
  // TODO: #236: Remove <svg> tag usage.
  static #hasWarnedAboutStyleDeprecation = false;
  static #hasWarnedAboutSvgDeprecation = false;

  //////////////////////////////////////////////////////////////////////////////
  // HTML - https://developer.mozilla.org/en-US/docs/Web/HTML/Element //////////
  //////////////////////////////////////////////////////////////////////////////

  // Void tags - https://developer.mozilla.org/en-US/docs/Glossary/Void_element
  static #voidHtmlElements = new Set([
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'source', 'track', 'wbr',
  ]);

  static #htmlElements = new Set([
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
  static #deniedHtmlElements = new Set([
    'html', 'head', 'base', 'link', 'meta', 'title', 'body', 'script',
    'noscript', 'canvas', 'acronym', 'big', 'center', 'content', 'dir', 'font',
    'frame', 'frameset', 'image', 'marquee', 'menuitem', 'nobr', 'noembed',
    'noframes', 'param', 'plaintext', 'rb', 'rtc', 'shadow', 'strike',
    'tt', 'xmp', 'math',
    // TODO: #237: Remove <style> tag usage — add 'style' to this list.
    // TODO: #237: Remove <svg> tag usage — add 'svg' to this list.
  ]);
  static #allowedHtmlElements = Unforgiving.#htmlElements.difference(Unforgiving.#deniedHtmlElements);

  // TODO: #236: Remove <svg> completely.
  //////////////////////////////////////////////////////////////////////////////
  // SVG - https://developer.mozilla.org/en-US/docs/Web/SVG/Element ////////////
  //////////////////////////////////////////////////////////////////////////////

  static #svgElements = new Set([
    // Animation elements
    'animate', 'animateMotion', 'animateTransform', 'mpath', 'set',
    // Basic shapes
    'circle', 'ellipse', 'line', 'polygon', 'polyline', 'rect',
    // Container elements
    'a', 'defs', 'g', 'marker', 'mask', 'pattern', 'svg', 'switch', 'symbol',
    'missing-glyph',
    // Descriptive elements
    'desc', 'metadata', 'title',
    // Filter primitive elements
    'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
    'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
    'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
    'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
    'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence',
    // Font elements
    'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
    'font-face-uri', 'hkern', 'vkern',
    // Gradient elements
    'linearGradient', 'radialGradient', 'stop',
    // Graphics elements
    'circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect',
    'text', 'use',
    // Graphics referencing elements
    'use',
    // Light source elements
    'feDistantLight', 'fePointLight', 'feSpotLight',
    // Never-rendered elements
    'clipPath', 'defs', 'linearGradient', 'marker', 'mask', 'pattern', 'symbol',
    'title', 'metadata', 'radialGradient', 'script', 'style',
    // Paint server elements
    'linearGradient', 'pattern', 'radialGradient',
    // Renderable elements
    'a', 'circle', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'path',
    'polygon', 'polyline', 'rect', 'svg', 'switch', 'symbol', 'text',
    'textpath', 'tspan', 'use',
    // Shape elements
    'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect',
    // Structural elements
    'defs', 'g', 'svg', 'symbol', 'use',
    // Text content elements
    'glyph', 'glyphRef', 'textPath', 'text', 'tref', 'tspan',
    // Text content child elements
    'clipPath', 'cursor', 'filter', 'foreignObject', 'script', 'style', 'view',
    // Obsolete and deprecated elements
    'cursor', 'font', 'font-face', 'font-face-format', 'font-face-name',
    'font-face-src', 'font-face-uri', 'glyph', 'glyphRef', 'hkern',
    'missing-glyph', 'tref', 'vkern',
  ]);
  static #deniedSvgElements = new Set([
    'animate', 'animateMotion', 'animateTransform', 'mpath', 'set',
    'missing-glyph', 'desc', 'metadata', 'title', 'feBlend', 'feColorMatrix',
    'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
    'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood',
    'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur',
    'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset',
    'feSpecularLighting', 'feTile', 'feTurbulence', 'font', 'font-face',
    'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
    'hkern', 'vkern', 'linearGradient', 'radialGradient', 'stop',
    'feDistantLight', 'fePointLight', 'feSpotLight', 'metadata',
    'radialGradient', 'script', 'style', 'linearGradient', 'pattern',
    'radialGradient', 'glyph', 'glyphRef', 'textPath', 'text', 'tref', 'tspan',
    'cursor', 'filter', 'foreignObject', 'script', 'style', 'view', 'cursor',
    'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
    'font-face-uri', 'glyph', 'glyphRef', 'hkern', 'missing-glyph',
    'tref', 'vkern',
  ]);
  static #allowedSvgElements = Unforgiving.#svgElements.difference(Unforgiving.#deniedSvgElements);

  //////////////////////////////////////////////////////////////////////////////
  // Parsing State Values //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // These are all the states we can be in while we parse a string.
  //  https://w3c.github.io/html-reference/syntax.html

  // The “initial” and “boundContent” states are special in that there is no
  //  related pattern to match. Initial is just the state we start in and we
  //  only find bound content at string terminals (i.e., interpolations). The
  //  patterns below are intentionally unmatchable.
  static #initial =      /\b\B/y;
  static #boundContent = /\b\B/y;

  // Our unbound content rules follow the “normal character data” spec.
  //  https://w3c.github.io/html-reference/syntax.html#normal-character-data
  static #unboundContent = /[^<]+/y;

  // Our comment rules follow the “comments” spec.
  //  https://w3c.github.io/html-reference/syntax.html#comments
  static #unboundComment = /<!--.*?-->/ys;

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
  // TODO: #236: Restrict tags to lowercase once <svg> support is removed.
  // Svg tag names follow the above rules, but may have capital letters.
  static #openTagStart = /<(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)(?=[\s\n>])/y;
  static #closeTag =   /<\/(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)>/y;
  static #openTagEnd = /(?<![\s\n])>/y;

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
  static #openTagSpace = / (?! )|\n *(?!\n)(?=[-_.?a-zA-Z0-9>])/y;

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
  // TODO: #236: Restrict attribute names to lowercase once <svg> support is removed.
  // Svg attribute names follow the above rules, but may have capital letters.
  static #unboundBoolean =   /(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)(?=[\s\n>])/y;
  static #unboundAttribute = /(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="[^"]*"(?=[\s\n>])/y;
  static #boundBoolean =   /\?(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="$/y;
  static #boundDefined = /\?\?(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="$/y;
  static #boundAttribute =   /(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="$/y;

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
  static #boundProperty = /\.(?![A-Z0-9_])[a-zA-Z0-9_]+(?<!_)="$/y;

  // We require that values bound to attributes and properties be enclosed
  //  in double-quotes (see above patterns). Because interpolations delimit our
  //  “strings”, we need to check that the _next_ string begins with a
  //  double-quote. Note that it must precede a space, a newline, or the closing
  //  angle bracket of the opening tag.
  static #danglingQuote = /"(?=[ \n>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Special Tag Patterns //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The “textarea” tag is special in that it’s content is considered
  //  “replaceable” character data. We treat all characters between the opening
  //  and closing tags as the content. Note that we allow the “.” to match
  //  across newlines.
  //  https://w3c.github.io/html-reference/syntax.html#replaceable-character-data
  static #throughTextarea = /.*?<\/textarea>/ys;

  // The “style” tag is deprecated and will be removed in future versions. It
  //  contains “non-replaceable” character data.
  //  https://w3c.github.io/html-reference/syntax.html#non-replaceable-character-data
  // TODO: #237: Remove support for <style> tags.
  static #throughStyle = /.*?<\/style>/ys;

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
  // The only escapes we expect to see are for the “\” and “`” characters, which
  //  you _must_ use if you need those literal characters.
  // The simplest way to check this is to ensure that back slashes always come
  //  in pairs of two or a single back slash preceding a back tick.
  // Examples:
  //  - ok: html`&#8230;`, html`&#x2026;`, html`&mldr;`, html`&hellip;`, html`\\n`
  //  - not ok: html`\nhi\nthere`, html`\x8230`, html`\u2026`, html`\s\t\o\p\ \i\t\.`
  static #rawJsEscape = /.*(?<!\\)(?:\\{2})*\\(?![\\`])/ys;

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
  static #entity =          /&.*?;/ys;
  static #htmlEntityStart = /[^&]*&[^&\s\n<]/y;

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
  static #cdataStart = /<!CDATA\[/y;

  //////////////////////////////////////////////////////////////////////////////
  // Common Mistakes ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // See if weird spaces were added or if incorrect characters were used in
  //  open or close tags.
  static #openTagStartMalformed = /<[\s\n]*[a-zA-Z0-9_-]+/y;
  static #openTagSpaceMalformed = /[\s\n]+/y;
  static #openTagEndMalformed =   /[\s\n]*\/?>/y;
  static #closeTagMalformed =     /<[\s\n]*\/[\s\n]*[a-zA-Z0-9_-]+[^>]*>/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  either unbound or bound attributes.
  static #unboundBooleanMalformed =   /[a-zA-Z0-9-_]+(?=[\s\n>])/y;
  static #unboundAttributeMalformed = /[a-zA-Z0-9-_]+=(?:"[^"]*"|'[^']*')?(?=[\s\n>])/y;
  static #boundBooleanMalformed =   /\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static #boundDefinedMalformed = /\?\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static #boundAttributeMalformed =   /[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  a bound property.
  static #boundPropertyMalformed = /\.[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if the quote pair was malformed or missing.
  static #danglingQuoteMalformed = /'?(?=[\s\n>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Errors ////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  static #errorMessages = new Map([
    ['#100', 'Markup at the start of your template could not be parsed.'],
    ['#101', 'Markup after content text found in your template could not be parsed.'],
    ['#102', 'Markup after a comment found in your template could not be parsed.'],
    ['#103', 'Markup after a content interpolation in your template could not be parsed.'],
    ['#104', 'Markup after the tag name in an opening tag in your template could not be parsed.'],
    ['#105', 'Markup after a spacing in an opening tag in your template could not be parsed.'],
    ['#106', 'Markup after an opening tag in your template could not be parsed.'],
    ['#107', 'Markup after a boolean attribute text in an opening tag in your template could not be parsed.'],
    ['#108', 'Markup after an attribute text in an opening tag in your template could not be parsed.'],
    ['#109', 'Markup after a boolean attribute value interpolation in an opening tag in your template could not be parsed.'],
    ['#110', 'Markup after a defined attribute value interpolation in an opening tag in your template could not be parsed.'],
    ['#111', 'Markup after an attribute value interpolation in an opening tag in your template could not be parsed.'],
    ['#112', 'Markup after a property value interpolation in an opening tag in your template could not be parsed.'],
    ['#113', 'Markup after the closing quote of an attribute or property in an opening tag in your template could not be parsed.'],
    ['#114', 'Markup after a closing tag in your template could not be parsed.'],

    ['#120', 'Malformed open start tag — tag names must be alphanumeric, lowercase, cannot start or end with hyphens, and cannot start with a number.'],
    ['#121', 'Malformed open tag space — spaces in open tags must be literal whitespace characters or newlines. Inter-declaration spaces must be singular. Spaces after newlines may be used for indentation. Only one newline is allowed.'],
    ['#122', 'Malformed end to an opening tag — opening tags must close without any extraneous spaces or newlines.'],
    ['#123', 'Malformed close tag — close tags must not contain any extraneous spaces or newlines and tag names must be alphanumeric, lowercase, cannot start or end with hyphens, and cannot start with a number.'],
    ['#124', 'Malformed boolean attribute text — attribute names must be alphanumeric (both uppercase and lowercase is allowed), must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#125', 'Malformed attribute text — attribute names must be alphanumeric (both uppercase and lowercase is allowed), must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#126', 'Malformed boolean attribute interpolation — attribute names must be alphanumeric (both uppercase and lowercase is allowed), must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#127', 'Malformed defined attribute interpolation — attribute names must be alphanumeric (both uppercase and lowercase is allowed), must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#128', 'Malformed attribute interpolation — attribute names must be alphanumeric (both uppercase and lowercase is allowed), must not start or end with hyphens, and cannot start with a number — and, attribute values must be enclosed in double-quotes.'],
    ['#129', 'Malformed property interpolation — property names must be alphanumeric (both uppercase and lowercase is allowed), must not start or end with underscores, and cannot start with a number — and, property values must be enclosed in double-quotes.'],
    ['#130', 'Malformed closing quote to a bound attribute or property. Enclosing quotes must be simple, double-quotes.'],

    ['#140', 'CDATA sections are forbidden. Use html entities (character encodings) instead.'],

    ['#150', 'Improper javascript escape (\\x, \\u, \\t, \\n, etc.) in raw string input. Only an escape to create a literal slash (“\\”) or back tick (“`”) characters a literal is allowed. Only valid HTML entities (character references) are supported in html as code points. Use literal characters (e.g., newlines) to enter newlines in your templates.'],
    ['#151', 'Malformed hexadecimal character reference (html entity) or ambiguous ampersand.'],
    ['#152', 'Malformed html comment. Comments cannot start with a “>” character or “->” characters. They cannot include a set of “--” characters. They cannot end with a “-” character.'],
    ['#153', 'Forbidden html element was used — this parser is opinionated about which elements are allowed in order to reduce complexity and improve performance.'],
    ['#154', 'Closing tag at the end of your template is missing. To avoid unintended markup, non-void tags must explicitly be closed.'],
    ['#155', 'Mismatched closing tag was used. To avoid unintended markup, non-void tags must explicitly be closed and all closing tag names must be a case-sensitive match.'],
    ['#156', 'Only basic interpolation of <textarea> tags is allowed — e.g., <textarea>${…}</textarea>.'],
    ['#157', 'Forbidden declarative shadow root was used (e.g., `<template shadowrootmode="open">`).'],

    // TODO: #236: Remove support for <svg> completely.
    ['#190', 'Forbidden svg element was used — this parser is opinionated about which elements are allowed in order to reduce complexity and improve performance.'],
    // TODO: #237: Remove support for <style> tags completely.
    ['#191', 'Interpolation of <style> tags is not allowed.'],
    // TODO: #236: Will be obviated once foreign elements like <svg> are gone.
    ['#192', 'Forbidden uppercase letters in html attribute name. Because html attributes are case-insensitive, it is preferable to always use the lowercased equivalent.'],
  ]);

  // Block #100-#119 — Invalid transition errors.
  static #valueToErrorMessagesKey = new Map([
    [Unforgiving.#initial,                   '#100'],
    [Unforgiving.#unboundContent,            '#101'],
    [Unforgiving.#unboundComment,            '#102'],
    [Unforgiving.#boundContent,              '#103'],
    [Unforgiving.#openTagStart,              '#104'],
    [Unforgiving.#openTagSpace,              '#105'],
    [Unforgiving.#openTagEnd,                '#106'],
    [Unforgiving.#unboundBoolean,            '#107'],
    [Unforgiving.#unboundAttribute,          '#108'],
    [Unforgiving.#boundBoolean,              '#109'],
    [Unforgiving.#boundDefined,              '#110'],
    [Unforgiving.#boundAttribute,            '#111'],
    [Unforgiving.#boundProperty,             '#112'],
    [Unforgiving.#danglingQuote,             '#113'],
    [Unforgiving.#closeTag,                  '#114'],
  ]);

  // Block #120-#139 — Common mistakes.
  static #valueMalformedToErrorMessagesKey = new Map([
    [Unforgiving.#openTagStartMalformed,     '#120'],
    [Unforgiving.#openTagSpaceMalformed,     '#121'],
    [Unforgiving.#openTagEndMalformed,       '#122'],
    [Unforgiving.#closeTagMalformed,         '#123'],
    [Unforgiving.#unboundBooleanMalformed,   '#124'],
    [Unforgiving.#unboundAttributeMalformed, '#125'],
    [Unforgiving.#boundBooleanMalformed,     '#126'],
    [Unforgiving.#boundDefinedMalformed,     '#127'],
    [Unforgiving.#boundAttributeMalformed,   '#128'],
    [Unforgiving.#boundPropertyMalformed,    '#129'],
    [Unforgiving.#danglingQuoteMalformed,    '#130'],
  ]);

  // Block #140-#149 — Forbidden transitions.
  static #valueForbiddenToErrorMessagesKey = new Map([
    [Unforgiving.#cdataStart,                '#140'],
  ]);

  // Block #150+ — Special, named issues.
  static #namedErrorsToErrorMessagesKey = new Map([
    ['javascript-escape',                    '#150'],
    ['malformed-html-entity',                '#151'],
    ['malformed-comment',                    '#152'],
    ['forbidden-html-element',               '#153'],
    ['missing-closing-tag',                  '#154'],
    ['mismatched-closing-tag',               '#155'],
    ['complex-textarea-interpolation',       '#156'],
    ['declarative-shadow-root',              '#157'],

    // Deprecated features which will be obviated in the future.
    // TODO: #236: Remove support for <svg> tags completely.
    ['forbidden-svg-element',                '#190'],
    // TODO: #237: Remove support for <style> tags completely.
    ['style-interpolation',                  '#191'],
    // TODO: #236: Will be obviated once foreign elements like <svg> are gone.
    ['uppercase-html-attribute',             '#192'],
  ]);

  //////////////////////////////////////////////////////////////////////////////
  // Internal parsing logic ////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  static #try(string, stringIndex, ...values) {
    for (const value of values) {
      value.lastIndex = stringIndex;
      if (value.test(string)) {
        return value;
      }
    }
  }

  // Special cases we want to warn about, but which are not just malformed
  //  versions of valid transitions.
  static #forbiddenTransition(string, stringIndex, value) {
    switch (value) {
      case Unforgiving.#unboundContent: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#cdataStart);
    }
  }

  // This should roughly match our “valid” transition mapping, but for errors.
  static #invalidTransition(string, stringIndex, value) {
    switch (value) {
      case Unforgiving.#initial: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagStartMalformed);
      case Unforgiving.#unboundContent: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#closeTagMalformed,
        Unforgiving.#openTagStartMalformed);
      case Unforgiving.#boundContent: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#closeTagMalformed,
        Unforgiving.#openTagStartMalformed);
      case Unforgiving.#unboundComment: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#closeTagMalformed,
        Unforgiving.#openTagStartMalformed);
      case Unforgiving.#openTagStart:
      case Unforgiving.#unboundBoolean:
      case Unforgiving.#unboundAttribute:
      case Unforgiving.#danglingQuote: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagSpaceMalformed);
      case Unforgiving.#openTagSpace: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundBooleanMalformed,
        Unforgiving.#unboundAttributeMalformed,
        Unforgiving.#boundBooleanMalformed,
        Unforgiving.#boundDefinedMalformed,
        Unforgiving.#boundAttributeMalformed,
        Unforgiving.#boundPropertyMalformed,
        Unforgiving.#openTagEndMalformed);
      case Unforgiving.#openTagEnd: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagStartMalformed,
        Unforgiving.#closeTagMalformed);
      case Unforgiving.#boundBoolean:
      case Unforgiving.#boundDefined:
      case Unforgiving.#boundAttribute:
      case Unforgiving.#boundProperty: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#danglingQuoteMalformed);
      case Unforgiving.#closeTag: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagStartMalformed,
        Unforgiving.#closeTagMalformed);
    }
  }

  static #validTransition(string, stringIndex, value) {
    switch (value) {
      // The “initial” state is where we start when we begin parsing.
      //  E.g., html`‸hello world!`
      case Unforgiving.#initial: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundContent,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundComment);

      // The “unboundContent” state means that we’ve just parse through some
      //  literal html text either in the root of the template or between an
      //  open-close tag pair.
      //  E.g., html`hello ‸${world}!`
      case Unforgiving.#unboundContent: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#closeTag,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundComment);

      // The “boundContent” state means that we just hit an interpolation (i.e.,
      //  started a new string).
      //  E.g., html`hello ${world}‸!`
      // The “unboundComment” state means that we just completed a comment. We
      //  don’t allow comment interpolations.
      //  E.g., html`hello <!-- todo -->‸ ${world}!`
      case Unforgiving.#boundContent:
      case Unforgiving.#unboundComment: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundContent,
        Unforgiving.#closeTag,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundComment);

      // The “openTagStart” means that we’ve successfully parse through the open
      //  angle bracket “<” and the tag name.
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
      case Unforgiving.#openTagStart:
      case Unforgiving.#unboundBoolean:
      case Unforgiving.#unboundAttribute:
      case Unforgiving.#danglingQuote: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagSpace,
        Unforgiving.#openTagEnd);

      // The “openTagSpace” is an arbitrary number of spaces, newlines, etc.
      //  after the open tag name or some attribute or property.
      //  E.g., html`<div ‸foo></div>`
      case Unforgiving.#openTagSpace: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundBoolean,
        Unforgiving.#unboundAttribute,
        Unforgiving.#boundBoolean,
        Unforgiving.#boundDefined,
        Unforgiving.#boundAttribute,
        Unforgiving.#boundProperty,
        Unforgiving.#openTagEnd);

      // The “openTagEnd” is just the “>” character.
      //  E.g., html`<div>‸</div>`
      case Unforgiving.#openTagEnd: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundContent,
        Unforgiving.#closeTag,
        Unforgiving.#unboundComment);

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
      case Unforgiving.#boundBoolean:
      case Unforgiving.#boundDefined:
      case Unforgiving.#boundAttribute:
      case Unforgiving.#boundProperty: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#danglingQuote);

      // The “closeTag” state means we just closed some tag successfully,
      //  E.g., html`<div><span></span>‸</div>`
      case Unforgiving.#closeTag: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundContent,
        Unforgiving.#openTagStart,
        Unforgiving.#closeTag,
        Unforgiving.#unboundComment);
    }
  }

  static #getErrorInfo(strings, stringsIndex, string, stringIndex) {
    let prefix;
    let prefixIndex;
    if (stringsIndex > 0) {
      const validPrefix = strings.slice(0, stringsIndex).join(Unforgiving.#delimiter);
      prefix = [validPrefix, string].join(Unforgiving.#delimiter);
      prefixIndex = validPrefix.length + Unforgiving.#delimiter.length + stringIndex;
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

  static #throwTransitionError(strings, stringsIndex, string, stringIndex, value) {
    const { parsed, notParsed } = Unforgiving.#getErrorInfo(strings, stringsIndex, string, stringIndex);
    const valueForbidden = Unforgiving.#forbiddenTransition(string, stringIndex, value);
    const valueMalformed = Unforgiving.#invalidTransition(string, stringIndex, value);
    const errorMessagesKey = valueForbidden
      ? Unforgiving.#valueForbiddenToErrorMessagesKey.get(valueForbidden)
      : valueMalformed
        ? Unforgiving.#valueMalformedToErrorMessagesKey.get(valueMalformed)
        : Unforgiving.#valueToErrorMessagesKey.get(value);
    const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
    const substringMessage = `See substring \`${notParsed}\`.`;
    const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
    const message = `[${errorMessagesKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`;
    throw new Error(message);
  }

  static #validateRawString(rawString) {
    Unforgiving.#rawJsEscape.lastIndex = 0;
    if (Unforgiving.#rawJsEscape.test(rawString)) {
      const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('javascript-escape');
      const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
      const substringMessage = `See (raw) substring \`${rawString.slice(0, Unforgiving.#rawJsEscape.lastIndex)}\`.`;
      const message = `[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`;
      throw new Error(message);
    }
  }

  static #validateExit(fragment, element) {
    if (element.value !== fragment) {
      const tagName = element.value[Unforgiving.#localName];
      const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('missing-closing-tag');
      const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
      const substringMessage = `Missing a closing </${tagName}>.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
    }
  }

  // https://html.spec.whatwg.org/multipage/named-characters.html
  static #replaceHtmlEntities(originalContent) {
    let content = originalContent;
    Unforgiving.#htmlEntityStart.lastIndex = 0;
    while (Unforgiving.#htmlEntityStart.test(content)) {
      const contentIndex = Unforgiving.#htmlEntityStart.lastIndex - 2;
      Unforgiving.#entity.lastIndex = contentIndex;
      if (!Unforgiving.#entity.test(content)) {
        const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('malformed-html-entity');
        const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
        const substringMessage = `See substring \`${originalContent}\`.`;
        throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
      }
      const encoded = content.slice(contentIndex, Unforgiving.#entity.lastIndex);
      Unforgiving.#htmlEntityContainer.innerHTML = encoded;
      const decoded = Unforgiving.#htmlEntityContainer.content.textContent;
      content = content.replace(encoded, decoded);
      Unforgiving.#htmlEntityStart.lastIndex = contentIndex + decoded.length;
    }
    return content;
  }

  static #finalizeVoidElement(path, element, childNodesIndex, nextStringIndex) {
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.#parentNode];
    Unforgiving.#closeTag.lastIndex = nextStringIndex;
    return Unforgiving.#closeTag;
  }

  // Textarea contains so-called “replaceable” character data.
  static #finalizeTextarea(string, path, element, childNodesIndex, nextStringIndex) {
    const closeTagLength = 11; // </textarea>
    Unforgiving.#throughTextarea.lastIndex = nextStringIndex;
    if (Unforgiving.#throughTextarea.test(string)) {
      const encoded = string.slice(nextStringIndex, Unforgiving.#throughTextarea.lastIndex - closeTagLength);
      const decoded = Unforgiving.#replaceHtmlEntities(encoded);
      element.value.textContent = decoded;
    } else {
      const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('complex-textarea-interpolation');
      const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
      throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.#parentNode];
    Unforgiving.#closeTag.lastIndex = Unforgiving.#throughTextarea.lastIndex;
    return Unforgiving.#closeTag;
  }

  // TODO: #237: Remove support for <style> tags.
  // Style contains so-called “non-replaceable” character data.
  static #finalizeStyle(string, path, element, childNodesIndex, nextStringIndex) {
    const closeTagLength = 8; // </style>
    Unforgiving.#throughStyle.lastIndex = nextStringIndex;
    if (Unforgiving.#throughStyle.test(string)) {
      const content = string.slice(nextStringIndex, Unforgiving.#throughStyle.lastIndex - closeTagLength);
      element.value.textContent = content;
    } else {
      const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('style-interpolation');
      const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
      throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.#parentNode];
    Unforgiving.#closeTag.lastIndex = Unforgiving.#throughStyle.lastIndex;
    return Unforgiving.#closeTag;
  }

  static #addUnboundContent(string, stringIndex, element, childNodesIndex, nextStringIndex) {
    const encoded = string.slice(stringIndex, nextStringIndex);
    const decoded = Unforgiving.#replaceHtmlEntities(encoded);
    element.value.appendChild(document.createTextNode(decoded));
    childNodesIndex.value += 1;
  }

  static #addUnboundComment(string, stringIndex, element, childNodesIndex, nextStringIndex) {
    const content = string.slice(stringIndex, nextStringIndex);
    const data = content.slice(4, -3);
    // https://w3c.github.io/html-reference/syntax.html#comments
    if (data.startsWith('>') || data.startsWith('->') || data.includes('--') || data.endsWith('-')) {
      const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('malformed-comment');
      const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
      const substringMessage = `See substring \`${content}\`.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
    }
    element.value.appendChild(document.createComment(data));
    childNodesIndex.value += 1;
  }

  static #addBoundContent(onContent, path, element, childNodesIndex) {
    element.value.append(document.createComment(''), document.createComment(''));
    childNodesIndex.value += 2;
    path.push(childNodesIndex.value);
    onContent(path);
    path.pop();
  }

  // This can only happen with a “textarea” element, currently.
  static #addBoundText(onText, string, path, sloppyStartInterpolation) {
      // If the prior match isn’t our opening tag… that’s a problem. If the next
      //  match isn’t our closing tag… that’s also a problem.
      // Because we tightly control the end-tag format, we can predict what the
      //  next string’s prefix should be.
      if (sloppyStartInterpolation || !string.startsWith(`</textarea>`)) {
        const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('complex-textarea-interpolation');
        const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
        throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
      }
      onText(path);
  }

  // TODO: #236: Remove validation once <svg> is unsupported and we restrict
  //  initial pattern to math for attributes.
  static #uppercaseLetters = /[A-Z]/;
  static #validateAttributeName(namespace, attributeName) {
    if (namespace === Unforgiving.html) {
      if (Unforgiving.#uppercaseLetters.test(attributeName)) {
        const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('uppercase-html-attribute');
        const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
        const substringMessage = `Rewrite the html attribute "${attributeName}" as "${attributeName.toLowerCase()}".`;
        throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
      }
    }
  }

  static #addUnboundBoolean(string, stringIndex, element, nextStringIndex) {
    const attributeName = string.slice(stringIndex, nextStringIndex);
    const namespace = element.value[Unforgiving.#namespace];
    Unforgiving.#validateAttributeName(namespace, attributeName);
    element.value.setAttribute(attributeName, '');
  }

  static #addUnboundAttribute(string, stringIndex, element, nextStringIndex) {
    const unboundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = unboundAttribute.indexOf('=');
    const attributeName = unboundAttribute.slice(0, equalsIndex);
    const namespace = element.value[Unforgiving.#namespace];
    Unforgiving.#validateAttributeName(namespace, attributeName);
    const encoded = unboundAttribute.slice(equalsIndex + 2, -1);
    const decoded = Unforgiving.#replaceHtmlEntities(encoded);
    element.value.setAttribute(attributeName, decoded);
  }

  static #addBoundBoolean(onBoolean, string, stringIndex, path, element, nextStringIndex) {
    const boundBoolean = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundBoolean.indexOf('=');
    const attributeName = boundBoolean.slice(1, equalsIndex);
    const namespace = element.value[Unforgiving.#namespace];
    Unforgiving.#validateAttributeName(namespace, attributeName);
    onBoolean(attributeName, path);
  }

  static #addBoundDefined(onDefined, string, stringIndex, path, element, nextStringIndex) {
    const boundDefined = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundDefined.indexOf('=');
    const attributeName = boundDefined.slice(2, equalsIndex);
    const namespace = element.value[Unforgiving.#namespace];
    Unforgiving.#validateAttributeName(namespace, attributeName);
    onDefined(attributeName, path);
  }

  static #addBoundAttribute(onAttribute, string, stringIndex, path, element, nextStringIndex) {
    const boundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundAttribute.indexOf('=');
    const attributeName = boundAttribute.slice(0, equalsIndex);
    const namespace = element.value[Unforgiving.#namespace];
    Unforgiving.#validateAttributeName(namespace, attributeName);
    onAttribute(attributeName, path);
  }

  static #addBoundProperty(onProperty, string, stringIndex, path, nextStringIndex) {
    const boundProperty = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundProperty.indexOf('=');
    const propertyName = boundProperty.slice(1, equalsIndex);
    onProperty(propertyName, path);
  }

  static #validateTagName(namespace, tagName) {
    switch (namespace) {
      case Unforgiving.html:
        if (
          tagName.indexOf('-') === -1 &&
          !Unforgiving.#allowedHtmlElements.has(tagName)
        ) {
          const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('forbidden-html-element');
          const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
          const substringMessage = `The <${tagName}> html element is forbidden.`;
          throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
        }
        break;
      case Unforgiving.svg:
        // TODO: #236: Remove support for <svg> completely.
        if (!Unforgiving.#allowedSvgElements.has(tagName)) {
          const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('forbidden-svg-element');
          const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
          const substringMessage = `The <${tagName}> svg element is forbidden.`;
          throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
        }
        break;
    }
  }

  static #addElement(string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const prefixedTagName = string.slice(stringIndex, nextStringIndex);
    const tagName = prefixedTagName.slice(1);
    const currentNamespace = element.value[Unforgiving.#namespace];
    Unforgiving.#validateTagName(currentNamespace, tagName);
    let namespace = currentNamespace;
    if (tagName === 'svg') {
      Unforgiving.#svgDeprecationWarning();
      namespace = Unforgiving.svg;
    }
    const childNode = document.createElementNS(namespace, tagName);
    element.value[Unforgiving.#localName] === 'template'
      ? element.value.content.appendChild(childNode)
      : element.value.appendChild(childNode);
    childNode[Unforgiving.#localName] = tagName;
    childNode[Unforgiving.#parentNode] = element.value;
    childNode[Unforgiving.#namespace] = namespace;
    element.value = childNode;
    childNodesIndex.value += 1;
    path.push(childNodesIndex.value);
  }

  static #finalizeElement(strings, stringsIndex, string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const closeTag = string.slice(stringIndex, nextStringIndex);
    const tagName = closeTag.slice(2, -1);
    const expectedTagName = element.value[Unforgiving.#localName];
    if (tagName !== expectedTagName) {
      const { parsed } = Unforgiving.#getErrorInfo(strings, stringsIndex, string, stringIndex);
      const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('mismatched-closing-tag');
      const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
      const substringMessage = `The closing tag </${tagName}> does not match <${expectedTagName}>.`;
      const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.#parentNode];
  }

  // TODO: #237: Remove support for <style> tags.
  static #styleDeprecationWarning() {
    if (!Unforgiving.#hasWarnedAboutStyleDeprecation) {
      Unforgiving.#hasWarnedAboutStyleDeprecation = true;
      const error = new Error('Support for the <style> tag is deprecated and will be removed in future versions.');
      console.warn(error); // eslint-disable-line no-console
    }
  }

  // TODO: #236: Remove support for <svg> tags.
  static #svgDeprecationWarning() {
    if (!Unforgiving.#hasWarnedAboutSvgDeprecation) {
      Unforgiving.#hasWarnedAboutSvgDeprecation = true;
      const error = new Error('Support for the <svg> tag is deprecated and will be removed in future versions.');
      console.warn(error); // eslint-disable-line no-console
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public parsing interface //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  static html = 'http://www.w3.org/1999/xhtml';
  // TODO: #236: Remove support for <svg> completely.
  static svg = 'http://www.w3.org/2000/svg';

  static parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText, namespace) {
    const fragment = Unforgiving.#fragment.cloneNode(false);
    fragment[Unforgiving.#namespace] = namespace ??= Unforgiving.html;

    const path = [];
    const childNodesIndex = { value: -1 }; // Wrapper to allow better factoring.
    const element = { value: fragment }; // Wrapper to allow better factoring.

    const stringsLength = strings.length;
    let stringsIndex = 0;
    let string = null;
    let stringLength = null;
    let stringIndex = null;
    let nextStringIndex = null;
    let value = Unforgiving.#initial;

    while (stringsIndex < stringsLength) {
      string = strings[stringsIndex];

      Unforgiving.#validateRawString(strings.raw[stringsIndex]);
      if (stringsIndex > 0) {
        switch (value) {
          case Unforgiving.#initial:
          case Unforgiving.#boundContent:
          case Unforgiving.#unboundContent:
          case Unforgiving.#openTagEnd:
          case Unforgiving.#closeTag:
            if (element.value[Unforgiving.#localName] === 'textarea') {
              // The textarea tag only accepts text, we restrict interpolation
              //  there. See note on “replaceable character data” in the
              //  following reference document:
              //  https://w3c.github.io/html-reference/syntax.html#text-syntax
              const sloppyStartInterpolation = value !== Unforgiving.#openTagEnd;
              Unforgiving.#addBoundText(onText, string, path, sloppyStartInterpolation);
            } else {
              Unforgiving.#addBoundContent(onContent, path, element, childNodesIndex);
            }
            value = Unforgiving.#boundContent;
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
          const nextValue = Unforgiving.#validTransition(string, stringIndex, value);
          if (!nextValue) {
            Unforgiving.#throwTransitionError(strings, stringsIndex, string, stringIndex, value);
          }
          value = nextValue;
          nextStringIndex = value.lastIndex;
        }

        // When we transition into certain values, we need to take action.
        switch (value) {
          case Unforgiving.#unboundContent:
            Unforgiving.#addUnboundContent(string, stringIndex, element, childNodesIndex, nextStringIndex);
            break;
          case Unforgiving.#unboundComment:
            Unforgiving.#addUnboundComment(string, stringIndex, element, childNodesIndex, nextStringIndex);
            break;
          case Unforgiving.#openTagStart:
            Unforgiving.#addElement(string, stringIndex, path, element, childNodesIndex, nextStringIndex);
            break;
          case Unforgiving.#unboundBoolean:
            Unforgiving.#addUnboundBoolean(string, stringIndex, element, nextStringIndex);
            break;
          case Unforgiving.#unboundAttribute:
            Unforgiving.#addUnboundAttribute(string, stringIndex, element, nextStringIndex);
            break;
          case Unforgiving.#boundBoolean:
            Unforgiving.#addBoundBoolean(onBoolean, string, stringIndex, path, element, nextStringIndex);
            break;
          case Unforgiving.#boundDefined:
            Unforgiving.#addBoundDefined(onDefined, string, stringIndex, path, element, nextStringIndex);
            break;
          case Unforgiving.#boundAttribute:
            Unforgiving.#addBoundAttribute(onAttribute, string, stringIndex, path, element, nextStringIndex);
            break;
          case Unforgiving.#boundProperty:
            Unforgiving.#addBoundProperty(onProperty, string, stringIndex, path, nextStringIndex);
            break;
          case Unforgiving.#openTagEnd:
            if (element.value[Unforgiving.#namespace] === Unforgiving.html) {
              const tagName = element.value[Unforgiving.#localName];
              if (Unforgiving.#voidHtmlElements.has(tagName)) {
                value = Unforgiving.#finalizeVoidElement(path, element, childNodesIndex, nextStringIndex);
                nextStringIndex = value.lastIndex;
              } else if (tagName === 'style') {
                // TODO: #237: Remove support for <style> tags.
                Unforgiving.#styleDeprecationWarning();
                value = Unforgiving.#finalizeStyle(string, path, element, childNodesIndex, nextStringIndex);
                nextStringIndex = value.lastIndex;
              } else if (
                tagName === 'textarea' &&
                Unforgiving.#openTagEnd.lastIndex !== string.length
              ) {
                value = Unforgiving.#finalizeTextarea(string, path, element, childNodesIndex, nextStringIndex);
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
                const errorMessagesKey = Unforgiving.#namedErrorsToErrorMessagesKey.get('declarative-shadow-root');
                const errorMessage = Unforgiving.#errorMessages.get(errorMessagesKey);
                throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
              } else {
                // Assume we’re traversing into the new element and reset index.
                childNodesIndex.value = -1;
              }
            } else {
              // Assume we’re traversing into the new element and reset index.
              childNodesIndex.value = -1;
            }
            break;
          case Unforgiving.#closeTag:
            Unforgiving.#finalizeElement(strings, stringsIndex, string, stringIndex, path, element, childNodesIndex, nextStringIndex);
            break;
        }
        stringIndex = nextStringIndex; // Update out pointer from our pattern match.
      }
      stringsIndex++;
    }
    Unforgiving.#validateExit(fragment, element);
    return fragment;
  }
}

/** Internal implementation details for template engine. */
class TemplateEngine {
  // Types of bindings that we can have.
  static #ATTRIBUTE = 'attribute';
  static #BOOLEAN = 'boolean';
  static #DEFINED = 'defined';
  static #PROPERTY = 'property';
  static #CONTENT = 'content';
  static #TEXT = 'text';

  // Sentinel to hold internal result information. Also leveraged to determine
  //  whether a value is a raw result or not.
  static #ANALYSIS = Symbol();

  // TODO: #236: Remove support for <svg> and always presume html.
  static #HTML = Symbol();
  static #SVG = Symbol();

  // Sentinel to initialize the “last values” array.
  static #UNSET = Symbol();

  // Sentinels to manage internal state on nodes.
  static #STATE = Symbol();
  static #ARRAY_STATE = Symbol();

  // Mapping of tagged template function “strings” to caches computations.
  static #stringsToAnalysis = new WeakMap();

  // Mapping of opaque references to internal update objects.
  static #symbolToUpdate = new WeakMap();

  /**
   * Default template engine interface — what you get inside “template”.
   * @type {{[key: string]: Function}}
   */
  static interface = Object.freeze({
    // Long-term interface.
    render: TemplateEngine.render,
    html: TemplateEngine.html,

    // Deprecated interface.
    // TODO: #236: Remove support for svg tagged template function.
    svg: TemplateEngine.#interfaceDeprecated('svg', TemplateEngine.svg),
    map: TemplateEngine.#interfaceDeprecated('map', TemplateEngine.map),
    live: TemplateEngine.#interfaceDeprecated('live', TemplateEngine.live),
    unsafeHTML: TemplateEngine.#interfaceDeprecated('unsafeHTML', TemplateEngine.unsafeHTML),
    unsafeSVG: TemplateEngine.#interfaceDeprecated('unsafeSVG', TemplateEngine.unsafeSVG),
    ifDefined: TemplateEngine.#interfaceDeprecated('ifDefined', TemplateEngine.ifDefined),
    nullish: TemplateEngine.#interfaceDeprecated('nullish', TemplateEngine.nullish),
    repeat: TemplateEngine.#interfaceDeprecated('repeat', TemplateEngine.repeat),

    // Removed interface.
    asyncAppend: TemplateEngine.#interfaceRemoved('asyncAppend'),
    asyncReplace: TemplateEngine.#interfaceRemoved('asyncReplace'),
    cache: TemplateEngine.#interfaceRemoved('cache'),
    classMap: TemplateEngine.#interfaceRemoved('classMap'),
    directive: TemplateEngine.#interfaceRemoved('directive'),
    guard: TemplateEngine.#interfaceRemoved('guard'),
    styleMap: TemplateEngine.#interfaceRemoved('styleMap'),
    templateContent: TemplateEngine.#interfaceRemoved('templateContent'),
    until: TemplateEngine.#interfaceRemoved('until'),
  });

  /**
   * Declare HTML markup to be interpolated.
   * ```js
   * html`<div attr="${obj.attr}" .prop="${obj.prop}">${obj.content}</div>`;
   * ```
   * @param {string[]} strings
   * @param {any[]} values
   * @returns {any}
   */
  static html(strings, ...values) {
    return TemplateEngine.#createRawResult(TemplateEngine.#HTML, strings, values);
  }

  // TODO: #236: Remove support for “svg” tagged template function.
  /**
   * Declare SVG markup to be interpolated.
   * ```js
   * svg`<circle r="${obj.r}" cx="${obj.cx}" cy="${obj.cy}"></div>`;
   * ```
   * @deprecated
   * @param {string[]} strings
   * @param {any[]} values
   * @returns {any}
   */
  static svg(strings, ...values) {
    return TemplateEngine.#createRawResult(TemplateEngine.#SVG, strings, values);
  }

  /**
   * Core rendering entry point for x-element template engine.
   * Accepts a "container" element and renders the given "raw result" into it.
   * @param {HTMLElement} container
   * @param {any} rawResult
   */
  static render(container, rawResult) {
    if (!(container instanceof Node)) {
      throw new Error(`Unexpected non-node render container "${container}".`);
    }
    rawResult = TemplateEngine.#isRawResult(rawResult) ? rawResult : null;
    const state = TemplateEngine.#getState(container, TemplateEngine.#STATE);
    if (rawResult) {
      if (!TemplateEngine.#canReuseDom(state.preparedResult, rawResult)) {
        TemplateEngine.#removeWithin(container);
        const preparedResult = TemplateEngine.#inject(rawResult, container);
        state.preparedResult = preparedResult;
      } else {
        TemplateEngine.#update(state.preparedResult, rawResult);
      }
    } else {
      TemplateEngine.#clearObject(state);
      TemplateEngine.#removeWithin(container);
    }
  }

  /**
   * Updater to manage an attribute which may be undefined.
   * In the following example, the "ifDefined" updater will remove the
   * attribute if it's undefined. Else, it sets the key-value pair.
   * ```js
   * html`<a href="${ifDefined(obj.href)}"></div>`;
   * ```
   * @deprecated
   * @param {any} value
   * @returns {any}
   */
  static ifDefined(value) {
    const symbol = Object.create(null);
    const updater = TemplateEngine.#ifDefined;
    TemplateEngine.#symbolToUpdate.set(symbol, { updater, value });
    return symbol;
  }

  /**
   * Updater to manage an attribute which may not exist.
   * In the following example, the "nullish" updater will remove the
   * attribute if it's nullish. Else, it sets the key-value pair.
   * ```js
   * html`<a href="${nullish(obj.href)}"></div>`;
   * ```
   * @deprecated
   * @param {any} value
   * @returns {any}
   */
  static nullish(value) {
    const symbol = Object.create(null);
    const updater = TemplateEngine.#nullish;
    const update = { updater, value };
    TemplateEngine.#symbolToUpdate.set(symbol, update);
    return symbol;
  }

  /**
   * Updater to manage a property which may change outside the template engine.
   * Typically, properties are declaratively managed from state and efficient
   * value checking is used (i.e., "value !== lastValue"). However, if DOM state
   * is expected to change, the "live" updater can be used to essentially change
   * this check to "value !== node[property]".
   * ```js
   * html`<input .value="${live(obj.value)}"/>`;
   * ```
   * @deprecated
   * @param {any} value
   * @returns {any}
   */
  static live(value) {
    const symbol = Object.create(null);
    const updater = TemplateEngine.#live;
    const update = { updater, value };
    TemplateEngine.#symbolToUpdate.set(symbol, update);
    return symbol;
  }

  /**
   * Updater to inject trusted HTML into the DOM.
   * Use with caution. The "unsafeHTML" updater allows arbitrary input to be
   * parsed as HTML and injected into the DOM.
   * ```js
   * html`<div>${unsafeHTML(obj.trustedMarkup)}</div>`;
   * ```
   * @deprecated
   * @param {any} value
   * @returns {any}
   */
  static unsafeHTML(value) {
    const symbol = Object.create(null);
    const updater = TemplateEngine.#unsafeHTML;
    const update = { updater, value };
    TemplateEngine.#symbolToUpdate.set(symbol, update);
    return symbol;
  }

  /**
   * Updater to inject trusted SVG into the DOM.
   * Use with caution. The "unsafeSVG" updater allows arbitrary input to be
   * parsed as SVG and injected into the DOM.
   * ```js
   * html`
   *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
   *     ${unsafeSVG(obj.trustedMarkup)}
   *   </svg>
   * `;
   * ```
   * @deprecated
   * @param {any} value
   * @returns {any}
   */
  static unsafeSVG(value) {
    const symbol = Object.create(null);
    const updater = TemplateEngine.#unsafeSVG;
    const update = { updater, value };
    TemplateEngine.#symbolToUpdate.set(symbol, update);
    return symbol;
  }

  /**
   * Updater to manage a keyed array of templates (allows for DOM reuse).
   * ```js
   * html`
   *   <ul>
   *     ${map(items, item => item.id, item => html`<li>${item.value}</li>`)}
   *   </div>
   * `;
   * ```
   * @param {any[]} items
   * @param {Function} identify
   * @param {Function} callback
   * @returns {any}
   */
  static map(items, identify, callback) {
    if (!Array.isArray(items)) {
      throw new Error(`Unexpected map items "${items}" provided, expected an array.`);
    }
    if (typeof identify !== 'function') {
      throw new Error(`Unexpected map identify "${identify}" provided, expected a function.`);
    }
    if (typeof callback !== 'function') {
      throw new Error(`Unexpected map callback "${callback}" provided, expected a function.`);
    }
    return items.map(item => [identify(item), callback(item)]);
  }

  /**
   * Shim for prior "repeat" function. Use "map".
   * @deprecated
   * @param {any[]} items
   * @param {Function} identify
   * @param {Function} [callback]
   * @returns {any}
   */
  static repeat(items, identify, callback) {
    if (arguments.length === 2) {
      callback = identify;
      identify = null;
    }
    if (!Array.isArray(items)) {
      throw new Error(`Unexpected repeat items "${items}" provided, expected an array.`);
    }
    if (arguments.length !== 2 && typeof identify !== 'function') {
      throw new Error(`Unexpected repeat identify "${identify}" provided, expected a function.`);
    } else if (typeof callback !== 'function') {
      throw new Error(`Unexpected repeat callback "${callback}" provided, expected a function.`);
    }
    return identify
      ? items.map(item => [identify(item), callback(item)])
      : items.map(item => callback(item)); // Just a basic array.
  }

  // Deprecated. Will remove in future release.
  static #ifDefined(node, name, value, lastValue) {
    if (value !== lastValue) {
      value === undefined || value === null
        ? node.removeAttribute(name)
        : node.setAttribute(name, value);
    }
  }

  // Deprecated. Will remove in future release.
  static #nullish(node, name, value, lastValue) {
    if (value !== lastValue) {
      value === undefined || value === null
        ? node.removeAttribute(name)
        : node.setAttribute(name, value);
    }
  }

  // Deprecated. Will remove in future release.
  static #live(node, name, value) {
    if (node[name] !== value) {
      node[name] = value;
    }
  }

  // Deprecated. Will remove in future release.
  static #unsafeHTML(node, startNode, value, lastValue) {
    if (value !== lastValue) {
      if (typeof value === 'string') {
        const template = document.createElement('template');
        template.innerHTML = value;
        TemplateEngine.#removeBetween(startNode, node);
        TemplateEngine.#insertAllBefore(node.parentNode, node, template.content.childNodes);
      } else {
        throw new Error(`Unexpected unsafeHTML value "${value}".`);
      }
    }
  }

  // Deprecated. Will remove in future release.
  static #unsafeSVG(node, startNode, value, lastValue) {
    if (value !== lastValue) {
      if (typeof value === 'string') {
        const template = document.createElement('template');
        template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${value}</svg>`;
        TemplateEngine.#removeBetween(startNode, node);
        TemplateEngine.#insertAllBefore(node.parentNode, node, template.content.firstChild.childNodes);
      } else {
        throw new Error(`Unexpected unsafeSVG value "${value}".`);
      }
    }
  }

  // After cloning our common fragment, we use the “lookups” to cache live
  //  references to DOM nodes so that we can surgically perform updates later in
  //  an efficient manner. Lookups are like directions to find our real targets.
  // As a performance boost, we pre-bind references so that the interface is
  //  just a simple function call when we need to bind new values.
  static #findTargets(node, lookups, targets) {
    targets ??= [];
    if (lookups.values) {
      for (const { binding, name } of lookups.values) {
        switch (binding) {
          case TemplateEngine.#ATTRIBUTE:
            targets.push(TemplateEngine.#commitAttribute.bind(null, node, name));
            break;
          case TemplateEngine.#BOOLEAN:
            targets.push(TemplateEngine.#commitBoolean.bind(null, node, name));
            break;
          case TemplateEngine.#DEFINED:
            targets.push(TemplateEngine.#commitDefined.bind(null, node, name));
            break;
          case TemplateEngine.#PROPERTY:
            targets.push(TemplateEngine.#commitProperty.bind(null, node, name));
            break;
          case TemplateEngine.#CONTENT:
            targets.push(TemplateEngine.#commitContent.bind(null, node, node.previousSibling));
            break;
          case TemplateEngine.#TEXT:
            targets.push(TemplateEngine.#commitText.bind(null, node));
            break;
        }
      }
    }
    if (lookups.map) {
      // It’s not possible to require a prior child node in this iteration. We
      //  are always going forward. Therefore, we can start from a prior cursor.
      let iii = 0;
      let childNode = node.firstChild;
      for (const [index, subLookups] of lookups.map) {
        while (iii < index) {
          childNode = childNode.nextSibling;
          iii++;
        }
        TemplateEngine.#findTargets(childNode, subLookups, targets);
      }
    }
    return targets;
  }

  // Validates array item or map entry and returns an “id” and a “rawResult”.
  static #parseListValue(value, index, category, ids) {
    if (category === 'array') {
      // Values should look like "<raw result>".
      const id = String(index);
      const rawResult = value;
      ids.add(id);
      if (!TemplateEngine.#isRawResult(rawResult)) {
        throw new Error(`Unexpected non-template value found in array item at ${index} "${rawResult}".`);
      }
      return [id, rawResult];
    } else {
      // Values should look like "[<key>, <raw result>]".
      if (value.length !== 2) {
        throw new Error(`Unexpected entry length found in map entry at ${index} with length "${value.length}".`);
      }
      const [id, rawResult] = value;
      if (typeof id !== 'string') {
        throw new Error(`Unexpected non-string key found in map entry at ${index} "${id}".`);
      }
      if (ids.has(id)) {
        throw new Error(`Unexpected duplicate key found in map entry at ${index} "${id}".`);
      }
      ids.add(id);
      if (!TemplateEngine.#isRawResult(rawResult)) {
        throw new Error(`Unexpected non-template value found in map entry at ${index} "${rawResult}".`);
      }
      return [id, rawResult];
    }
  }

  // Loops over given value array to either create-or-update a list of nodes.
  static #list(node, startNode, values, category) {
    const arrayState = TemplateEngine.#getState(startNode, TemplateEngine.#ARRAY_STATE);
    if (!arrayState.map) {
      // There is no mapping in our state — we have a clean slate to work with.
      TemplateEngine.#clearObject(arrayState);
      arrayState.map = new Map();
      const ids = new Set(); // Populated in “parseListValue”.
      let index = 0;
      for (const value of values) {
        const [id, rawResult] = TemplateEngine.#parseListValue(value, index, category, ids);
        const cursors = TemplateEngine.#createCursors(node);
        const preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
        arrayState.map.set(id, { id, preparedResult, ...cursors });
        index++;
      }
    } else {
      // A mapping has already been created — we need to update the items.
      let lastItem;
      const ids = new Set(); // Populated in “parseListValue”.
      let index = 0;
      for (const value of values) {
        const [id, rawResult] = TemplateEngine.#parseListValue(value, index, category, ids);
        let item = arrayState.map.get(id);
        if (item) {
          if (!TemplateEngine.#canReuseDom(item.preparedResult, rawResult)) {
            // Add new comment cursors before removing old comment cursors.
            const cursors = TemplateEngine.#createCursors(item.startNode);
            TemplateEngine.#removeThrough(item.startNode, item.node);
            item.preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
            item.startNode = cursors.startNode;
            item.node = cursors.node;
          } else {
            TemplateEngine.#update(item.preparedResult, rawResult);
          }
        } else {
          const cursors = TemplateEngine.#createCursors(node);
          const preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
          item = { id, preparedResult, ...cursors };
          arrayState.map.set(id, item);
        }
        // TODO: We should be able to make the following code more performant.
        if (category === 'map') {
          const referenceNode = lastItem ? lastItem.node.nextSibling : startNode.nextSibling;
          if (referenceNode !== item.startNode) {
            const nodesToMove = [item.startNode];
            while (nodesToMove[nodesToMove.length - 1] !== item.node) {
              nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
            }
            TemplateEngine.#insertAllBefore(referenceNode.parentNode, referenceNode, nodesToMove);
          }
        }
        lastItem = item;
        index++;
      }
      // TODO: Can we more performantly mark some of this stuff in the above
      //  loop? Versus looping again here?
      for (const [id, item] of arrayState.map.entries()) {
        if (!ids.has(id)) {
          TemplateEngine.#removeThrough(item.startNode, item.node);
          arrayState.map.delete(id);
        }
      }
    }
  }

  static #commitAttribute(node, name, value, lastValue) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    const lastUpdate = TemplateEngine.#symbolToUpdate.get(lastValue);
    if (update) {
      switch (update.updater) {
        case TemplateEngine.#ifDefined:
          TemplateEngine.#ifDefined(node, name, update.value, lastUpdate?.value);
          break;
        case TemplateEngine.#nullish:
          TemplateEngine.#nullish(node, name, update.value, lastUpdate?.value);
          break;
        default:
          TemplateEngine.#throwUpdaterError(update.updater, TemplateEngine.#ATTRIBUTE);
          break;
      }
    } else {
      if (value !== lastValue) {
        node.setAttribute(name, value);
      }
    }
  }

  static #commitBoolean(node, name, value, lastValue) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      TemplateEngine.#throwUpdaterError(update.updater, TemplateEngine.#BOOLEAN);
    } else {
      if (value !== lastValue) {
        value ? node.setAttribute(name, '') : node.removeAttribute(name);
      }
    }
  }

  static #commitDefined(node, name, value, lastValue) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      TemplateEngine.#throwUpdaterError(update.updater, TemplateEngine.#DEFINED);
    } else {
      if (value !== lastValue) {
        value === undefined || value === null
          ? node.removeAttribute(name)
          : node.setAttribute(name, value);
      }
    }
  }

  static #commitProperty(node, name, value, lastValue) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      switch (update.updater) {
        case TemplateEngine.#live:
          TemplateEngine.#live(node, name, update.value);
          break;
        default:
          TemplateEngine.#throwUpdaterError(update.updater, TemplateEngine.#PROPERTY);
          break;
      }
    } else {
      if (value !== lastValue) {
        node[name] = value;
      }
    }
  }

  // TODO: Future state here — we’ll eventually just guard against value changes
  //  at a higher level and will remove all updater logic.
  // static #commitAttribute(node, name, value) {
  //   node.setAttribute(name, value);
  // }
  // static #commitBoolean(node, name, value) {
  //   value ? node.setAttribute(name, '') : node.removeAttribute(name);
  // }
  // static #commitDefined(node, name, value) {
  //   value === undefined || value === null
  //     ? node.removeAttribute(name)
  //     : node.setAttribute(name, value);
  // }
  // static #commitProperty(node, name, value) {
  //   node[name] = value;
  // }
  // static #commitContent(node, startNode, value, lastValue) {
  //   const category = TemplateEngine.#getCategory(value);
  //   const lastCategory = TemplateEngine.#getCategory(lastValue);
  //   if (category !== lastCategory && lastValue !== TemplateEngine.#UNSET) {
  //     // Reset content under certain conditions. E.g., `map(…)` >> `null`.
  //     const state = TemplateEngine.#getState(node, TemplateEngine.#STATE);
  //     const arrayState = TemplateEngine.#getState(startNode, TemplateEngine.#ARRAY_STATE);
  //     TemplateEngine.#removeBetween(startNode, node);
  //     TemplateEngine.#clearObject(state);
  //     TemplateEngine.#clearObject(arrayState);
  //   }
  //   if (category === 'result') {
  //     const state = TemplateEngine.#getState(node, TemplateEngine.#STATE);
  //     const rawResult = value;
  //     if (!TemplateEngine.#canReuseDom(state.preparedResult, rawResult)) {
  //       TemplateEngine.#removeBetween(startNode, node);
  //       TemplateEngine.#clearObject(state);
  //       const preparedResult = TemplateEngine.#inject(rawResult, node, true);
  //       state.preparedResult = preparedResult;
  //     } else {
  //       TemplateEngine.#update(state.preparedResult, rawResult);
  //     }
  //   } else if (category === 'array' || category === 'map') {
  //     TemplateEngine.#list(node, startNode, value, category);
  //   } else if (category === 'fragment') {
  //     if (value.childElementCount === 0) {
  //       throw new Error(`Unexpected child element count of zero for given DocumentFragment.`);
  //     }
  //     const previousSibling = node.previousSibling;
  //     if (previousSibling !== startNode) {
  //       TemplateEngine.#removeBetween(startNode, node);
  //     }
  //     node.parentNode.insertBefore(value, node);
  //   } else {
  //     // TODO: Is there a way to more-performantly skip this init step? E.g., if
  //     //  the prior value here was not “unset” and we didn’t just reset? We
  //     //  could cache the target node in these cases or something?
  //     const previousSibling = node.previousSibling;
  //     if (previousSibling === startNode) {
  //       // The `?? ''` is a shortcut for creating a text node and then
  //       //  setting its textContent. It’s exactly equivalent to the
  //       //  following code, but faster.
  //       // const textNode = document.createTextNode('');
  //       // textNode.textContent = value;
  //       const textNode = document.createTextNode(value ?? '');
  //       node.parentNode.insertBefore(textNode, node);
  //     } else {
  //       previousSibling.textContent = value;
  //     }
  //   }
  // }
  // static #commitText(node, value) {
  //   node.textContent = value;
  // }

  static #commitContent(node, startNode, value, lastValue) {
    const introspection = TemplateEngine.#getValueIntrospection(value);
    const lastIntrospection = TemplateEngine.#getValueIntrospection(lastValue);
    if (
      lastValue !== TemplateEngine.#UNSET && (
        introspection?.category !== lastIntrospection?.category ||
        introspection?.update?.updater !== lastIntrospection?.update?.updater
      )
    ) {
      // Reset content under certain conditions. E.g., `map(…)` >> `null`.
      const state = TemplateEngine.#getState(node, TemplateEngine.#STATE);
      const arrayState = TemplateEngine.#getState(startNode, TemplateEngine.#ARRAY_STATE);
      TemplateEngine.#removeBetween(startNode, node);
      TemplateEngine.#clearObject(state);
      TemplateEngine.#clearObject(arrayState);
    }
    if (introspection?.category === 'update') {
      const { update } = introspection;
      const lastUpdate = lastIntrospection?.update;
      switch (update.updater) {
        case TemplateEngine.#unsafeHTML:
          TemplateEngine.#unsafeHTML(node, startNode, update.value, lastUpdate?.value);
          break;
        case TemplateEngine.#unsafeSVG:
          TemplateEngine.#unsafeSVG(node, startNode, update.value, lastUpdate?.value);
          break;
        default:
          TemplateEngine.#throwUpdaterError(update.updater, TemplateEngine.#CONTENT);
          break;
      }
    } else {
      // Note that we always want to re-render results / lists, but because the
      //  way they are created, a new outer reference should always have been
      //  generated, so it’s ok to leave inside this value check.
      if (value !== lastValue) {
        if (introspection?.category === 'result') {
          const state = TemplateEngine.#getState(node, TemplateEngine.#STATE);
          const rawResult = value;
          if (!TemplateEngine.#canReuseDom(state.preparedResult, rawResult)) {
            TemplateEngine.#removeBetween(startNode, node);
            TemplateEngine.#clearObject(state);
            const preparedResult = TemplateEngine.#inject(rawResult, node, true);
            state.preparedResult = preparedResult;
          } else {
            TemplateEngine.#update(state.preparedResult, rawResult);
          }
        } else if (introspection?.category === 'array' || introspection?.category === 'map') {
          TemplateEngine.#list(node, startNode, value, introspection.category);
        } else if (introspection?.category === 'fragment') {
          if (value.childElementCount === 0) {
            throw new Error(`Unexpected child element count of zero for given DocumentFragment.`);
          }
          const previousSibling = node.previousSibling;
          if (previousSibling !== startNode) {
            TemplateEngine.#removeBetween(startNode, node);
          }
          node.parentNode.insertBefore(value, node);
        } else {
          const previousSibling = node.previousSibling;
          if (previousSibling === startNode) {
            // The `?? ''` is a shortcut for creating a text node and then
            //  setting its textContent. It’s exactly equivalent to the
            //  following code, but faster.
            // const textNode = document.createTextNode('');
            // textNode.textContent = value;
            const textNode = document.createTextNode(value ?? '');
            node.parentNode.insertBefore(textNode, node);
          } else {
            previousSibling.textContent = value;
          }
        }
      }
    }
  }

  static #commitText(node, value, lastValue) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      TemplateEngine.#throwUpdaterError(update.updater, TemplateEngine.#TEXT);
    } else {
      if (value !== lastValue) {
        node.textContent = value;
      }
    }
  }

  // TODO: Future state — we’ll later do change-by-reference detection here.
  // // Bind the current values from a result by walking through each target and
  // //  updating the DOM if things have changed.
  // static #commit(preparedResult) {
  //   preparedResult.values ??= preparedResult.rawResult.values;
  //   preparedResult.lastValues ??= preparedResult.values.map(() => TemplateEngine.#UNSET);
  //   const { targets, values, lastValues } = preparedResult;
  //   for (let iii = 0; iii < targets.length; iii++) {
  //     const value = values[iii];
  //     const lastValue = lastValues[iii];
  //     if (value !== lastValue) {
  //       const target = targets[iii];
  //       target(value, lastValue);
  //     }
  //   }
  // }

  // Bind the current values from a result by walking through each target and
  //  updating the DOM if things have changed.
  static #commit(preparedResult) {
    preparedResult.values ??= preparedResult.rawResult.values;
    preparedResult.lastValues ??= preparedResult.values.map(() => TemplateEngine.#UNSET);
    const { targets, values, lastValues } = preparedResult;
    for (let iii = 0; iii < targets.length; iii++) {
      const target = targets[iii];
      const value = values[iii];
      const lastValue = lastValues[iii];
      target(value, lastValue);
    }
  }

  static #textValue = { binding: TemplateEngine.#TEXT };
  static #storeTextLookup(lookups, path) {
    const value = TemplateEngine.#textValue;
    TemplateEngine.#storeLookup(lookups, value, path);
  }

  static #contentValue = { binding: TemplateEngine.#CONTENT };
  static #storeContentLookup(lookups, path) {
    const value = TemplateEngine.#contentValue;
    TemplateEngine.#storeLookup(lookups, value, path);
  }

  static #storeKeyLookup(lookups, binding, name, path) {
    const value = { binding, name };
    TemplateEngine.#storeLookup(lookups, value, path);
  }

  // TODO: This function is a bit of a performance bottleneck. It starts from
  //  the top of the object each time because it wants to avoid creating paths
  //  that do not end in bindings… However, then we have to do a lot of checking
  //  perhaps there’s a better way!
  static #storeLookup(lookups, value, path) {
    let reference = lookups;
    for (let iii = 0; iii < path.length; iii++) {
      const index = path[iii];
      reference.map ??= [];
      let lastEntry = reference.map.at(-1);
      if (lastEntry?.[0] !== index) {
        lastEntry = [index, {}];
        reference.map.push(lastEntry);
      }
      reference = lastEntry[1];
    }
    reference.values ??= [];
    reference.values.push(value);
  }

  // Inject a given result into a node for the first time.
  static #inject(rawResult, node, before) {
    // Create and prepare a document fragment to be injected.
    const { [TemplateEngine.#ANALYSIS]: analysis } = rawResult;
    const fragment = analysis.fragment.cloneNode(true);
    const targets = TemplateEngine.#findTargets(fragment, analysis.lookups);
    const preparedResult = { rawResult, fragment, targets };

    // Bind values via our live targets into our disconnected DOM.
    TemplateEngine.#commit(preparedResult);

    // Attach a document fragment into the node. Note that all the DOM in the
    //  fragment will already have values correctly committed on the line above.
    const nodes = fragment.childNodes;
    before
      ? TemplateEngine.#insertAllBefore(node.parentNode, node, nodes)
      : TemplateEngine.#insertAllBefore(node, null, nodes);

    return preparedResult;
  }

  static #update(preparedResult, rawResult) {
    preparedResult.lastValues = preparedResult.values;
    preparedResult.values = rawResult.values;
    TemplateEngine.#commit(preparedResult);
  }

  static #createRawResult(language, strings, values) {
    const analysis = TemplateEngine.#setIfMissing(TemplateEngine.#stringsToAnalysis, strings, () => ({}));
    if (!analysis.done) {
      const lookups = {};
      const onBoolean = TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#BOOLEAN);
      const onDefined = TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#DEFINED);
      const onAttribute = TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#ATTRIBUTE);
      const onProperty =  TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#PROPERTY);
      const onContent = TemplateEngine.#storeContentLookup.bind(null, lookups);
      const onText = TemplateEngine.#storeTextLookup.bind(null, lookups);
      // TODO: #236: No need to pass a namespace once svg tagged template function is removed.
      const namespace = language === TemplateEngine.#SVG ? Unforgiving.svg : Unforgiving.html;
      const fragment = Unforgiving.parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText, namespace);
      analysis.fragment = fragment;
      analysis.lookups = lookups;
      analysis.done = true;
    }
    // This is a leaking implementation detail, but fixing the leak comes at
    //  a non-negligible performance cost.
    return { [TemplateEngine.#ANALYSIS]: analysis, strings, values };
  }

  static #isRawResult(value) {
    return !!value?.[TemplateEngine.#ANALYSIS];
  }

  // TODO: Revisit this concept when we delete deprecated interfaces. Once that
  //  happens, the _only_ updater available for content is `map`, and we may be
  //  able to make this more performant.
  // We can probably change this to something like the following eventually:
  //
  // static #getCategory(value) {
  //   if (typeof value === 'object') {
  //     if (TemplateEngine.#isRawResult(value)) {
  //       return 'result';
  //     } else if (Array.isArray(value)) {
  //       return Array.isArray(value[0]) ? 'map' : 'array';
  //     } else if (value instanceof DocumentFragment) {
  //       return 'fragment';
  //     }
  //   }
  // }
  //
  static #getValueIntrospection(value) {
    if (Array.isArray(value)) {
      return Array.isArray(value[0]) ? { category: 'map' } : { category: 'array' };
    } else if (value instanceof DocumentFragment) {
      return { category: 'fragment' };
    } else if (value !== null && typeof value === 'object') {
      if (TemplateEngine.#isRawResult(value)) {
        return { category: 'result' };
      } else {
        const update = TemplateEngine.#symbolToUpdate.get(value);
        if (update) {
          return { category: 'update', update };
        }
      }
    }
  }

  static #throwUpdaterError(updater, binding) {
    switch (updater) {
      // We’ll delete these updaters later.
      case TemplateEngine.#live:
        throw new Error(`The live update must be used on ${TemplateEngine.#getBindingText(TemplateEngine.#PROPERTY)}, not on ${TemplateEngine.#getBindingText(binding)}.`);
      case TemplateEngine.#unsafeHTML:
        throw new Error(`The unsafeHTML update must be used on ${TemplateEngine.#getBindingText(TemplateEngine.#CONTENT)}, not on ${TemplateEngine.#getBindingText(binding)}.`);
      case TemplateEngine.#unsafeSVG:
        throw new Error(`The unsafeSVG update must be used on ${TemplateEngine.#getBindingText(TemplateEngine.#CONTENT)}, not on ${TemplateEngine.#getBindingText(binding)}.`);
      case TemplateEngine.#ifDefined:
        throw new Error(`The ifDefined update must be used on ${TemplateEngine.#getBindingText(TemplateEngine.#ATTRIBUTE)}, not on ${TemplateEngine.#getBindingText(binding)}.`);
      case TemplateEngine.#nullish:
        throw new Error(`The nullish update must be used on ${TemplateEngine.#getBindingText(TemplateEngine.#ATTRIBUTE)}, not on ${TemplateEngine.#getBindingText(binding)}.`);
    }
  }

  static #canReuseDom(preparedResult, rawResult) {
    // TODO: Is it possible that we might have the same strings from a different
    //  template language? Probably not. The following check should suffice.
    return preparedResult?.rawResult.strings === rawResult?.strings;
  }

  static #createCursors(referenceNode) {
    const startNode = document.createComment('');
    const node = document.createComment('');
    referenceNode.parentNode.insertBefore(startNode, referenceNode);
    referenceNode.parentNode.insertBefore(node, referenceNode);
    return { startNode, node };
  }

  static #insertAllBefore(parentNode, referenceNode, nodes) {
    // Iterate backwards over the live node collection since we’re mutating it.
    // Note that passing “null” as the reference node appends nodes to the end.
    for (let iii = nodes.length - 1; iii >= 0; iii--) {
      const node = nodes[iii];
      parentNode.insertBefore(node, referenceNode);
      referenceNode = node;
    }
  }

  // TODO: Future state — we may choose to iterate differently as an
  //  optimization in later versions.
  // static #removeWithin(node) {
  //   let childNode = node.lastChild;
  //   while (childNode) {
  //     const nextChildNode = childNode.previousSibling;
  //     node.removeChild(childNode);
  //     childNode = nextChildNode;
  //   }
  // }
  static #removeWithin(node) {
    // Iterate backwards over the live node collection since we’re mutating it.
    const childNodes = node.childNodes;
    for (let iii = childNodes.length - 1; iii >= 0; iii--) {
      node.removeChild(childNodes[iii]);
    }
  }

  // TODO: Future state — we may choose to iterate differently as an
  //  optimization in later versions.
  // static #removeBetween(startNode, node, parentNode) {
  //   parentNode ??= node.parentNode;
  //   let childNode = node.previousSibling;
  //   while(childNode !== startNode) {
  //     const nextChildNode = childNode.previousSibling;
  //     parentNode.removeChild(childNode);
  //     childNode = nextChildNode;
  //   }
  // }
  static #removeBetween(startNode, node) {
    while(node.previousSibling !== startNode) {
      node.previousSibling.remove();
    }
  }

  // TODO: Future state — we may choose to iterate differently as an
  //  optimization in later versions.
  // static #removeThrough(startNode, node, parentNode) {
  //   parentNode ??= node.parentNode;
  //   TemplateEngine.#removeBetween(startNode, node, parentNode);
  //   parentNode.removeChild(startNode);
  //   parentNode.removeChild(node);
  // }
  static #removeThrough(startNode, node) {
    TemplateEngine.#removeBetween(startNode, node);
    startNode.remove();
    node.remove();
  }

  static #clearObject(object) {
    for (const key of Object.keys(object)) {
      delete object[key];
    }
  }

  // TODO: Replace with Map.prototype.getOrInsert when TC39 proposal lands.
  //  https://github.com/tc39/proposal-upsert
  static #setIfMissing(map, key, callback) {
    // Values set in this file are ALL truthy, so "get" is used (versus "has").
    let value = map.get(key);
    if (!value) {
      value = callback();
      map.set(key, value);
    }
    return value;
  }

  static #getState(object, key) {
    // Values set in this file are ALL truthy.
    let value = object[key];
    if (!value) {
      value = {};
      object[key] = value;
    }
    return value;
  }

  static #getBindingText(binding) {
    switch (binding) {
      case TemplateEngine.#ATTRIBUTE: return 'an attribute';
      case TemplateEngine.#BOOLEAN: return 'a boolean attribute';
      case TemplateEngine.#DEFINED: return 'a defined attribute';
      case TemplateEngine.#PROPERTY: return 'a property';
      case TemplateEngine.#CONTENT: return 'content';
      case TemplateEngine.#TEXT: return 'text content';
    }
  }

  static #interfaceDeprecatedMessages = new Set();
  static #interfaceDeprecated(name, callback) {
    return (...args) => {
      const message = `Deprecated "${name}" from default templating engine interface.`;
      if (!this.#interfaceDeprecatedMessages.has(message)) {
        this.#interfaceDeprecatedMessages.add(message);
        console.warn(new Error(message)); // eslint-disable-line no-console
      }
      return callback(...args);
    };
  }

  static #interfaceRemoved(name) {
    return () => {
      throw new Error(`Removed "${name}" from default templating engine interface. Import and plug-in "lit-html" as your element's templating engine if you want this functionality.`);
    };
  }
}

// Long-term interface.
export const render = TemplateEngine.interface.render.bind(TemplateEngine);
export const html = TemplateEngine.interface.html.bind(TemplateEngine);

// Deprecated interface.
export const svg = TemplateEngine.interface.svg.bind(TemplateEngine);
export const map = TemplateEngine.interface.map.bind(TemplateEngine);
export const live = TemplateEngine.interface.live.bind(TemplateEngine);
export const unsafeHTML = TemplateEngine.interface.unsafeHTML.bind(TemplateEngine);
export const unsafeSVG = TemplateEngine.interface.unsafeSVG.bind(TemplateEngine);
export const ifDefined = TemplateEngine.interface.ifDefined.bind(TemplateEngine);
export const nullish = TemplateEngine.interface.nullish.bind(TemplateEngine);
export const repeat = TemplateEngine.interface.repeat.bind(TemplateEngine);

// Removed interface.
export const asyncAppend = TemplateEngine.interface.asyncAppend.bind(TemplateEngine);
export const asyncReplace = TemplateEngine.interface.asyncReplace.bind(TemplateEngine);
export const cache = TemplateEngine.interface.cache.bind(TemplateEngine);
export const classMap = TemplateEngine.interface.classMap.bind(TemplateEngine);
export const directive = TemplateEngine.interface.directive.bind(TemplateEngine);
export const guard = TemplateEngine.interface.guard.bind(TemplateEngine);
export const styleMap = TemplateEngine.interface.styleMap.bind(TemplateEngine);
export const templateContent = TemplateEngine.interface.templateContent.bind(TemplateEngine);
export const until = TemplateEngine.interface.until.bind(TemplateEngine);
