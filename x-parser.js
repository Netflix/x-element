// TODO: The “private” fields in here use a __doubleUnderscore as actual private
//  fields were causing problems when used in an eslint plugin. It’s not clear
//  whether this is somehow a bug with our code here, eslint, or a particular
//  Node version. As-written, it should be possible to swap the “__” for “#” in
//  the future.

/** Strict HTML parser meant to handle interpolated HTML. */
class Unforgiving {
  static __mode = null; // 'parse' or 'validate'
  static __window = null;
  static __getMockNode = () => {
    return {
      appendChild() {/* Do nothing. */},
      textContent: '',
    };
  };
  static __getMockCommentNode = () => {
    return { ...Unforgiving.__getMockNode() };
  };
  static __getMockTextNode = () => {
    return { ...Unforgiving.__getMockNode() };
  };
  static __getMockElement = () => {
    return {
      ...Unforgiving.__getMockNode(),
      __attributes: {},
      setAttribute(name, value) { this.__attributes[name] = value; },
      hasAttribute(name) { return Reflect.has(this.__attributes, name); },
      append() {/* Do nothing. */},
      cloneNode() { return Unforgiving.__getMockElement(); },
    };
  };
  static __getMockDocumentFragment = () => {
    return { ...Unforgiving.__getMockElement() };
  };
  static __getMockTemplate = () => {
    return {
      ...Unforgiving.__getMockElement(),
      content: Unforgiving.__getMockDocumentFragment(),
    };
  };

  static __mockWindow = {
    console: { warn: () => {/* Do nothing. */} },
    document: {
      createDocumentFragment() {
        return Unforgiving.__getMockDocumentFragment();
      },
      createElementNS() {
        return Unforgiving.__getMockElement();
      },
      createElement(localName) {
        return localName === 'template'
          ? Unforgiving.__getMockTemplate()
          : Unforgiving.__getMockElement();
      },
      createTextNode() {
        return Unforgiving.__getMockTextNode();
      },
      createComment() {
        return Unforgiving.__getMockCommentNode();
      },
    },
  };

  // It’s more performant to clone a single fragment, so we keep a reference.
  static __fragment = null;

  // We decode character references via “setHTMLUnsafe” on this container.
  static __htmlEntityContainer = null;

  static __toMode(mode) {
    if (Unforgiving.__mode !== mode) {
      Unforgiving.__mode = mode;
      Unforgiving.__window = mode === 'validate' ? Unforgiving.__mockWindow : globalThis;
      Unforgiving.__fragment = Unforgiving.__window.document.createDocumentFragment();
      Unforgiving.__htmlEntityContainer = Unforgiving.__window.document.createElement('template');

      // This is mostly to make testing predictable.
      Unforgiving.__hasWarnedAboutStyleDeprecation = false;
      Unforgiving.__hasWarnedAboutSvgDeprecation = false;
    }
  }

  // DOM introspection is expensive. Since we are creating all of the elements,
  //  we can cache the introspections we need behind performant lookups.
  static __localName = Symbol();
  static __parentNode = Symbol();
  // TODO: #237: Remove “namespace” code once “<svg>” is no longer supported.
  static __namespace = Symbol();

  // Delimiter we add to improve debugging. E.g., `<div id="${…}"></div>`.
  static __delimiter = '${\u2026}';

  // Simple flags to ensure we only warn once about things being deprecated.
  // TODO: #237: Remove <style> tag usage.
  // TODO: #236: Remove <svg> tag usage.
  static __hasWarnedAboutStyleDeprecation = false;
  static __hasWarnedAboutSvgDeprecation = false;

  // TODO: #236: Used temporarily to validate html attributes. It won’t be
  //  necessary to do this validation after we can tighten up patterns related
  //  to <svg> tag name and attribute name casing quirks.
  static __uppercaseLetters = /[A-Z]/;

  // Namespaces for creating elements.
  // TODO: #236: Need for namespaces is obviated once we drop <svg> support.
  static __html = 'http://www.w3.org/1999/xhtml';
  static __svg = 'http://www.w3.org/2000/svg';

  //////////////////////////////////////////////////////////////////////////////
  // HTML - https://developer.mozilla.org/en-US/docs/Web/HTML/Element //////////
  //////////////////////////////////////////////////////////////////////////////

  // Void tags - https://developer.mozilla.org/en-US/docs/Glossary/Void_element
  static __voidHtmlElements = new Set([
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'source', 'track', 'wbr',
  ]);

  static __htmlElements = new Set([
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
  static __deniedHtmlElements = new Set([
    'html', 'head', 'base', 'link', 'meta', 'title', 'body', 'script',
    'noscript', 'canvas', 'acronym', 'big', 'center', 'content', 'dir', 'font',
    'frame', 'frameset', 'image', 'marquee', 'menuitem', 'nobr', 'noembed',
    'noframes', 'param', 'plaintext', 'rb', 'rtc', 'shadow', 'strike',
    'tt', 'xmp', 'math',
    // TODO: #237: Remove <style> tag usage — add 'style' to this list.
    // TODO: #237: Remove <svg> tag usage — add 'svg' to this list.
  ]);
  static __allowedHtmlElements = Unforgiving.__htmlElements.difference(Unforgiving.__deniedHtmlElements);

  // TODO: #236: Remove <svg> completely.
  //////////////////////////////////////////////////////////////////////////////
  // SVG - https://developer.mozilla.org/en-US/docs/Web/SVG/Element ////////////
  //////////////////////////////////////////////////////////////////////////////

  static __svgElements = new Set([
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
  static __deniedSvgElements = new Set([
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
  static __allowedSvgElements = Unforgiving.__svgElements.difference(Unforgiving.__deniedSvgElements);

  //////////////////////////////////////////////////////////////////////////////
  // Parsing State Values //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // These are all the states we can be in while we parse a string.
  //  https://w3c.github.io/html-reference/syntax.html

  // The “initial” and “boundContent” states are special in that there is no
  //  related pattern to match. Initial is just the state we start in and we
  //  only find bound content at string terminals (i.e., interpolations). The
  //  patterns below are intentionally unmatchable.
  static __initial =      /\b\B/y;
  static __boundContent = /\b\B/y;

  // Our unbound content rules follow the “normal character data” spec.
  //  https://w3c.github.io/html-reference/syntax.html#normal-character-data
  static __unboundContent = /[^<]+/y;

  // Our comment rules follow the “comments” spec.
  //  https://w3c.github.io/html-reference/syntax.html#comments
  static __unboundComment = /<!--.*?-->/ys;

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
  static __openTagStart = /<(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)(?=[\s\n>])/y;
  static __closeTag =   /<\/(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)>/y;
  static __openTagEnd = /(?<![\s\n])>/y;

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
  static __openTagSpace = / (?! )|\n *(?!\n)(?=[-_.?a-zA-Z0-9>])/y;

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
  static __unboundBoolean =   /(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)(?=[\s\n>])/y;
  static __unboundAttribute = /(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="[^"]*"(?=[\s\n>])/y;
  static __boundBoolean =   /\?(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="$/y;
  static __boundDefined = /\?\?(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="$/y;
  static __boundAttribute =   /(?![0-9A-Z-])[a-zA-Z0-9-]+(?<!-)="$/y;

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
  static __boundProperty = /\.(?![A-Z0-9_])[a-zA-Z0-9_]+(?<!_)="$/y;

  // We require that values bound to attributes and properties be enclosed
  //  in double-quotes (see above patterns). Because interpolations delimit our
  //  “strings”, we need to check that the _next_ string begins with a
  //  double-quote. Note that it must precede a space, a newline, or the closing
  //  angle bracket of the opening tag.
  static __danglingQuote = /"(?=[ \n>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Special Tag Patterns //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The “textarea” tag is special in that it’s content is considered
  //  “replaceable” character data. We treat all characters between the opening
  //  and closing tags as the content. Note that we allow the “.” to match
  //  across newlines.
  //  https://w3c.github.io/html-reference/syntax.html#replaceable-character-data
  static __throughTextarea = /.*?<\/textarea>/ys;

  // The “style” tag is deprecated and will be removed in future versions. It
  //  contains “non-replaceable” character data.
  //  https://w3c.github.io/html-reference/syntax.html#non-replaceable-character-data
  // TODO: #237: Remove support for <style> tags.
  static __throughStyle = /.*?<\/style>/ys;

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
  static __rawJsEscape = /.*(?<!\\)(?:\\{2})*\\(?![$\\`])/ys;

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
  static __entity =          /&.*?;/ys;
  static __htmlEntityStart = /[^&]*&[^&\s\n<]/y;

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
  static __cdataStart = /<!\[CDATA\[/y;

  //////////////////////////////////////////////////////////////////////////////
  // Common Mistakes ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // See if weird spaces were added or if incorrect characters were used in
  //  open or close tags.
  static __openTagStartMalformed = /<[\s\n]*[a-zA-Z0-9_-]+/y;
  static __openTagSpaceMalformed = /[\s\n]+/y;
  static __openTagEndMalformed =   /[\s\n]*\/?>/y;
  static __closeTagMalformed =     /<[\s\n]*\/[\s\n]*[a-zA-Z0-9_-]+[^>]*>/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  either unbound or bound attributes.
  static __unboundBooleanMalformed =   /[a-zA-Z0-9-_]+(?=[\s\n>])/y;
  static __unboundAttributeMalformed = /[a-zA-Z0-9-_]+=(?:"[^"]*"|'[^']*')?(?=[\s\n>])/y;
  static __boundBooleanMalformed =   /\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static __boundDefinedMalformed = /\?\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static __boundAttributeMalformed =   /[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  a bound property.
  static __boundPropertyMalformed = /\.[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if the quote pair was malformed or missing.
  static __danglingQuoteMalformed = /'?(?=[\s\n>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Errors ////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Simple mapping of all the errors which can be thrown by the parser. The
  //  parsing errors are allotted numbers #100-#199.
  static __errorMessages = new Map([
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

    ['#150', 'Improper javascript escape (\\x, \\u, \\t, \\n, etc.) in raw template string. Only escapes to create a literal slash (“\\”) or back tick (“`”) is allowed. Only valid HTML entities (character references) are supported in html as code points. Use literal characters (e.g., newlines) to enter newlines in your templates.'],
    ['#151', 'Malformed hexadecimal character reference (html entity) or ambiguous ampersand.'],
    ['#152', 'Malformed html comment. Comments cannot start with “>” or “->” characters, they cannot include a set of “--” characters, and they cannot end with a “-” character.'],
    ['#153', 'Forbidden html element used — this parser is opinionated about which elements are allowed in order to reduce complexity and improve performance.'],
    ['#154', 'Unmatched closing tag at the end of your template. To avoid unintended markup, non-void tags must explicitly be closed.'],
    ['#155', 'Mismatched closing tag used. To avoid unintended markup, non-void tags must explicitly be closed and all closing tag names must be a case-sensitive match.'],
    ['#156', 'Forbidden, nontrivial interpolation of <textarea> tag used. Only basic interpolation is allowed — e.g., <textarea>${…}</textarea>.'],
    ['#157', 'Forbidden declarative shadow root used (e.g., `<template shadowrootmode="open">`).'],

    // TODO: #236: Remove support for <svg> completely.
    ['#190', 'Forbidden svg element used — this parser is opinionated about which elements are allowed in order to reduce complexity and improve performance.'],
    // TODO: #237: Remove support for <style> tags completely.
    ['#191', 'Interpolation of <style> tags is not allowed.'],
    // TODO: #236: Obviated once foreign elements like <svg> are gone.
    ['#192', 'Forbidden uppercase letters in html attribute name. Because html attributes are case-insensitive, prefer to use the lowercased equivalent.'],
    // TODO: #236: Obviated once patterns are updated after <svg> is gone.
    ['#193', 'Forbidden uppercase letters in html tag name. Because html tag names are case-insensitive, prefer to use the lowercased equivalent.'],
    // TODO: #236: Obviated once <svg> is gone and namespacing is deleted.
    ['#194', 'Forbidden language provided — only svg and html are allowed. In the future this configuration will be removed completely.'],
  ]);

  // Block #100-#119 — Invalid transition errors.
  static __valueToErrorMessagesKey = new Map([
    [Unforgiving.__initial,                   '#100'],
    [Unforgiving.__unboundContent,            '#101'],
    [Unforgiving.__unboundComment,            '#102'],
    [Unforgiving.__boundContent,              '#103'],
    [Unforgiving.__openTagStart,              '#104'],
    [Unforgiving.__openTagSpace,              '#105'],
    [Unforgiving.__openTagEnd,                '#106'],
    [Unforgiving.__unboundBoolean,            '#107'],
    [Unforgiving.__unboundAttribute,          '#108'],
    [Unforgiving.__boundBoolean,              '#109'],
    [Unforgiving.__boundDefined,              '#110'],
    [Unforgiving.__boundAttribute,            '#111'],
    [Unforgiving.__boundProperty,             '#112'],
    [Unforgiving.__danglingQuote,             '#113'],
    [Unforgiving.__closeTag,                  '#114'],
  ]);

  // Block #120-#139 — Common mistakes.
  static __valueMalformedToErrorMessagesKey = new Map([
    [Unforgiving.__openTagStartMalformed,     '#120'],
    [Unforgiving.__openTagSpaceMalformed,     '#121'],
    [Unforgiving.__openTagEndMalformed,       '#122'],
    [Unforgiving.__closeTagMalformed,         '#123'],
    [Unforgiving.__unboundBooleanMalformed,   '#124'],
    [Unforgiving.__unboundAttributeMalformed, '#125'],
    [Unforgiving.__boundBooleanMalformed,     '#126'],
    [Unforgiving.__boundDefinedMalformed,     '#127'],
    [Unforgiving.__boundAttributeMalformed,   '#128'],
    [Unforgiving.__boundPropertyMalformed,    '#129'],
    [Unforgiving.__danglingQuoteMalformed,    '#130'],
  ]);

  // Block #140-#149 — Forbidden transitions.
  static __valueForbiddenToErrorMessagesKey = new Map([
    [Unforgiving.__cdataStart,                '#140'],
  ]);

  // Block #150+ — Special, named issues.
  static __namedErrorsToErrorMessagesKey = new Map([
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
    // TODO: #236: Obviated once foreign elements like <svg> are gone.
    ['uppercase-html-attribute',             '#192'],
    // TODO: #236: Obviated once patterns are updated after <svg> is gone.
    ['uppercase-html-tag',                   '#193'],
    // TODO: #236: Delete language input interface when <svg> is gone.
    ['forbidden-language',                   '#194'],
  ]);

  //////////////////////////////////////////////////////////////////////////////
  // Internal parsing logic ////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Returns the first valid state-machine transition (if one exists).
  static __try(string, stringIndex, ...values) {
    for (const value of values) {
      value.lastIndex = stringIndex;
      if (value.test(string)) {
        return value;
      }
    }
  }

  // Special cases we want to warn about, but which are not just malformed
  //  versions of valid transitions.
  static __forbiddenTransition(string, stringIndex, value) {
    switch (value) {
      case Unforgiving.__initial:
      case Unforgiving.__boundContent:
      case Unforgiving.__unboundContent:
      case Unforgiving.__openTagEnd:
      case Unforgiving.__closeTag: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__cdataStart);
    }
  }

  // This should roughly match our “valid” transition mapping, but for errors.
  static __invalidTransition(string, stringIndex, value) {
    switch (value) {
      case Unforgiving.__initial: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__openTagStartMalformed);
      case Unforgiving.__unboundContent: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__closeTagMalformed,
        Unforgiving.__openTagStartMalformed);
      case Unforgiving.__boundContent: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__closeTagMalformed,
        Unforgiving.__openTagStartMalformed);
      case Unforgiving.__unboundComment: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__closeTagMalformed,
        Unforgiving.__openTagStartMalformed);
      case Unforgiving.__openTagStart:
      case Unforgiving.__unboundBoolean:
      case Unforgiving.__unboundAttribute:
      case Unforgiving.__danglingQuote: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__openTagSpaceMalformed);
      case Unforgiving.__openTagSpace: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__unboundBooleanMalformed,
        Unforgiving.__unboundAttributeMalformed,
        Unforgiving.__boundBooleanMalformed,
        Unforgiving.__boundDefinedMalformed,
        Unforgiving.__boundAttributeMalformed,
        Unforgiving.__boundPropertyMalformed,
        Unforgiving.__openTagEndMalformed);
      case Unforgiving.__openTagEnd: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__openTagStartMalformed,
        Unforgiving.__closeTagMalformed);
      case Unforgiving.__boundBoolean:
      case Unforgiving.__boundDefined:
      case Unforgiving.__boundAttribute:
      case Unforgiving.__boundProperty: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__danglingQuoteMalformed);
      case Unforgiving.__closeTag: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__openTagStartMalformed,
        Unforgiving.__closeTagMalformed);
    }
  }

  // This is the core of the state machine. It describes every valid traversal
  //  through a set of html template “strings” array.
  static __validTransition(string, stringIndex, value) {
    switch (value) {
      // The “initial” state is where we start when we begin parsing.
      //  E.g., html`‸hello world!`
      case Unforgiving.__initial: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__unboundContent,
        Unforgiving.__openTagStart,
        Unforgiving.__unboundComment);

      // The “unboundContent” state means that we’ve just parsed through some
      //  literal html text either in the root of the template or between an
      //  open / close tag pair.
      //  E.g., html`hello ‸${world}!`
      case Unforgiving.__unboundContent: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__closeTag,
        Unforgiving.__openTagStart,
        Unforgiving.__unboundComment);

      // The “boundContent” state means that we just hit an interpolation (i.e.,
      //  started a new string).
      //  E.g., html`hello ${world}‸!`
      // The “unboundComment” state means that we just completed a comment. We
      //  don’t allow comment interpolations.
      //  E.g., html`hello <!-- todo -->‸ ${world}!`
      case Unforgiving.__boundContent:
      case Unforgiving.__unboundComment: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__unboundContent,
        Unforgiving.__closeTag,
        Unforgiving.__openTagStart,
        Unforgiving.__unboundComment); 

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
      case Unforgiving.__openTagStart:
      case Unforgiving.__unboundBoolean:
      case Unforgiving.__unboundAttribute:
      case Unforgiving.__danglingQuote: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__openTagSpace,
        Unforgiving.__openTagEnd);

      // The “openTagSpace” is either one space or a single newline and some
      //  indentation space after the open tag name, an attribute, or property.
      //  E.g., html`<div ‸foo></div>`
      case Unforgiving.__openTagSpace: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__unboundBoolean,
        Unforgiving.__unboundAttribute,
        Unforgiving.__boundBoolean,
        Unforgiving.__boundDefined,
        Unforgiving.__boundAttribute,
        Unforgiving.__boundProperty,
        Unforgiving.__openTagEnd);

      // The “openTagEnd” is just the “>” character.
      //  E.g., html`<div>‸</div>`
      case Unforgiving.__openTagEnd: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__openTagStart,
        Unforgiving.__unboundContent,
        Unforgiving.__closeTag,
        Unforgiving.__unboundComment);

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
      case Unforgiving.__boundBoolean:
      case Unforgiving.__boundDefined:
      case Unforgiving.__boundAttribute:
      case Unforgiving.__boundProperty: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__danglingQuote);

      // The “closeTag” state means we just closed some tag successfully,
      //  E.g., html`<div><span></span>‸</div>`
      case Unforgiving.__closeTag: return Unforgiving.__try(string, stringIndex,
        Unforgiving.__unboundContent,
        Unforgiving.__openTagStart,
        Unforgiving.__closeTag,
        Unforgiving.__unboundComment);
    }
  }

  // Common functionality to help print out template context when displaying
  //  helpful error messages to developers.
  static __getErrorInfo(strings, stringsIndex, string, stringIndex) {
    let prefix;
    let prefixIndex;
    if (stringsIndex > 0) {
      const validPrefix = strings.slice(0, stringsIndex).join(Unforgiving.__delimiter);
      prefix = [validPrefix, string].join(Unforgiving.__delimiter);
      prefixIndex = validPrefix.length + Unforgiving.__delimiter.length + stringIndex;
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
  static __throwTransitionError(strings, stringsIndex, string, stringIndex, value) {
    const { parsed, notParsed } = Unforgiving.__getErrorInfo(strings, stringsIndex, string, stringIndex);
    const valueForbidden = Unforgiving.__forbiddenTransition(string, stringIndex, value);
    const valueMalformed = Unforgiving.__invalidTransition(string, stringIndex, value);
    const errorMessagesKey = valueForbidden
      ? Unforgiving.__valueForbiddenToErrorMessagesKey.get(valueForbidden)
      : valueMalformed
        ? Unforgiving.__valueMalformedToErrorMessagesKey.get(valueMalformed)
        : Unforgiving.__valueToErrorMessagesKey.get(value);
    const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
    const substringMessage = `See substring \`${notParsed}\`.`;
    const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
    const message = `[${errorMessagesKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`;
    throw new Error(message);
  }

  // This validates a value from our “strings.raw” array passed into our tagged
  //  template function. It checks to make sure superfluous, JS-y escapes are
  //  not being used as html (since there are perfectly-valid alternatives).
  static __validateRawString(rawString) {
    Unforgiving.__rawJsEscape.lastIndex = 0;
    if (Unforgiving.__rawJsEscape.test(rawString)) {
      const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('javascript-escape');
      const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
      const substringMessage = `See (raw) substring \`${rawString.slice(0, Unforgiving.__rawJsEscape.lastIndex)}\`.`;
      const message = `[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`;
      throw new Error(message);
    }
  }

  // Before a successful exit, the parser ensures that all non-void opening tags
  //  have been matched successfully to prevent any unexpected behavior.
  static __validateExit(fragment, element) {
    if (element.value !== fragment) {
      const tagName = element.value[Unforgiving.__localName];
      const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('missing-closing-tag');
      const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
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
  static __replaceHtmlEntities(originalContent) {
    let content = originalContent;
    Unforgiving.__htmlEntityStart.lastIndex = 0;
    while (Unforgiving.__htmlEntityStart.test(content)) {
      const contentIndex = Unforgiving.__htmlEntityStart.lastIndex - 2;
      Unforgiving.__entity.lastIndex = contentIndex;
      if (!Unforgiving.__entity.test(content)) {
        const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('malformed-html-entity');
        const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
        const substringMessage = `See substring \`${originalContent}\`.`;
        throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
      }
      const encoded = content.slice(contentIndex, Unforgiving.__entity.lastIndex);
      Unforgiving.__htmlEntityContainer.innerHTML = encoded;
      const decoded = Unforgiving.__htmlEntityContainer.content.textContent;
      content = content.replace(encoded, decoded);
      Unforgiving.__htmlEntityStart.lastIndex = contentIndex + decoded.length;
    }
    return content;
  }

  // Void elements are treated with special consideration as they will never
  //  contain child nodes.
  static __finalizeVoidElement(path, element, childNodesIndex, nextStringIndex) {
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.__parentNode];
    Unforgiving.__closeTag.lastIndex = nextStringIndex;
    return Unforgiving.__closeTag;
  }

  // Textarea contains so-called “replaceable” character data. We throw an error
  //  if a “complex” interpolation exists — anything other than a perfectly-fit
  //  content interpolation between the opening and closing tags.
  static __finalizeTextarea(string, path, element, childNodesIndex, nextStringIndex) {
    const closeTagLength = 11; // </textarea>
    Unforgiving.__throughTextarea.lastIndex = nextStringIndex;
    if (Unforgiving.__throughTextarea.test(string)) {
      const encoded = string.slice(nextStringIndex, Unforgiving.__throughTextarea.lastIndex - closeTagLength);
      const decoded = Unforgiving.__replaceHtmlEntities(encoded);
      element.value.textContent = decoded;
    } else {
      const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('complex-textarea-interpolation');
      const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
      throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.__parentNode];
    Unforgiving.__closeTag.lastIndex = Unforgiving.__throughTextarea.lastIndex;
    return Unforgiving.__closeTag;
  }

  // TODO: #237: Remove support for <style> tags.
  // Style contains so-called “non-replaceable” character data.
  static __finalizeStyle(string, path, element, childNodesIndex, nextStringIndex) {
    const closeTagLength = 8; // </style>
    Unforgiving.__throughStyle.lastIndex = nextStringIndex;
    if (Unforgiving.__throughStyle.test(string)) {
      const content = string.slice(nextStringIndex, Unforgiving.__throughStyle.lastIndex - closeTagLength);
      element.value.textContent = content;
    } else {
      const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('style-interpolation');
      const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
      throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.__parentNode];
    Unforgiving.__closeTag.lastIndex = Unforgiving.__throughStyle.lastIndex;
    return Unforgiving.__closeTag;
  }

  // Unbound content is just literal text in a template string that needs to
  //  land as text content. We replace any character references (html entities)
  //  found in the content.
  static __addUnboundContent(string, stringIndex, element, childNodesIndex, nextStringIndex) {
    const encoded = string.slice(stringIndex, nextStringIndex);
    const decoded = Unforgiving.__replaceHtmlEntities(encoded);
    element.value.appendChild(Unforgiving.__window.document.createTextNode(decoded));
    childNodesIndex.value += 1;
  }

  // An unbound comment is just a basic html comment. Comments may not be
  //  interpolated and follow some specific rules from the html specification.
  //  https://w3c.github.io/html-reference/syntax.html#comments
  static __addUnboundComment(string, stringIndex, element, childNodesIndex, nextStringIndex) {
    const content = string.slice(stringIndex, nextStringIndex);
    const data = content.slice(4, -3);
    if (data.startsWith('>') || data.startsWith('->') || data.includes('--') || data.endsWith('-')) {
      const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('malformed-comment');
      const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
      const substringMessage = `See substring \`${content}\`.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
    }
    element.value.appendChild(Unforgiving.__window.document.createComment(data));
    childNodesIndex.value += 1;
  }

  // Bound content is simply an interpolation in the template which exists in a
  //  location destined to be bound as “textContent” on some node. We notify our
  //  listener about the content binding’s path.
  static __addBoundContent(onContent, path, element, childNodesIndex) {
    element.value.append(
      Unforgiving.__window.document.createComment(''),
      Unforgiving.__window.document.createComment('')
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
  static __addBoundText(onText, string, path, sloppyStartInterpolation) {
    // If the prior match isn’t our opening tag… that’s a problem. If the next
    //  match isn’t our closing tag… that’s also a problem.
    // Because we tightly control the end-tag format, we can predict what the
    //  next string’s prefix should be.
    if (sloppyStartInterpolation || !string.startsWith(`</textarea>`)) {
      const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('complex-textarea-interpolation');
      const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
      throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
    }
    onText(path);
  }

  // TODO: #236: Remove validation once <svg> is unsupported and we restrict
  //  initial pattern to math for attributes.
  static __validateAttributeName(namespace, attributeName) {
    if (namespace === Unforgiving.__html) {
      if (Unforgiving.__uppercaseLetters.test(attributeName)) {
        const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('uppercase-html-attribute');
        const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
        const substringMessage = `Rewrite the html attribute "${attributeName}" as "${attributeName.toLowerCase()}".`;
        throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
      }
    }
  }

  // An unbound boolean is a literal boolean attribute declaration with no
  //  associated value at all.
  static __addUnboundBoolean(string, stringIndex, element, nextStringIndex) {
    const attributeName = string.slice(stringIndex, nextStringIndex);
    const namespace = element.value[Unforgiving.__namespace];
    Unforgiving.__validateAttributeName(namespace, attributeName);
    element.value.setAttribute(attributeName, '');
  }

  // An unbound attribute is a literal attribute declaration, but this time, it
  //  does have an associated value — forming a key-value pair.
  static __addUnboundAttribute(string, stringIndex, element, nextStringIndex) {
    const unboundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = unboundAttribute.indexOf('=');
    const attributeName = unboundAttribute.slice(0, equalsIndex);
    const namespace = element.value[Unforgiving.__namespace];
    Unforgiving.__validateAttributeName(namespace, attributeName);
    const encoded = unboundAttribute.slice(equalsIndex + 2, -1);
    const decoded = Unforgiving.__replaceHtmlEntities(encoded);
    element.value.setAttribute(attributeName, decoded);
  }

  // A bound boolean is a boolean attribute flag with an associated value
  //  binding. It has a single, preceding “?” character. We notify subscribers
  //  about this flag.
  static __addBoundBoolean(onBoolean, string, stringIndex, path, element, nextStringIndex) {
    const boundBoolean = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundBoolean.indexOf('=');
    const attributeName = boundBoolean.slice(1, equalsIndex);
    const namespace = element.value[Unforgiving.__namespace];
    Unforgiving.__validateAttributeName(namespace, attributeName);
    onBoolean(attributeName, path);
  }

  // Similar to a bound boolean, but with two preceding “??” characters. We
  //  notify subscribers about this attribute which exists only when defined.
  static __addBoundDefined(onDefined, string, stringIndex, path, element, nextStringIndex) {
    const boundDefined = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundDefined.indexOf('=');
    const attributeName = boundDefined.slice(2, equalsIndex);
    const namespace = element.value[Unforgiving.__namespace];
    Unforgiving.__validateAttributeName(namespace, attributeName);
    onDefined(attributeName, path);
  }

  // This is an attribute with a name / value pair where the “value” is bound
  //  as an interpolation. We notify subscribers about this attribute binding.
  static __addBoundAttribute(onAttribute, string, stringIndex, path, element, nextStringIndex) {
    const boundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundAttribute.indexOf('=');
    const attributeName = boundAttribute.slice(0, equalsIndex);
    const namespace = element.value[Unforgiving.__namespace];
    Unforgiving.__validateAttributeName(namespace, attributeName);
    onAttribute(attributeName, path);
  }

  // This is an property with a name / value pair where the “value” is bound
  //  as an interpolation. We notify subscribers about this property binding.
  static __addBoundProperty(onProperty, string, stringIndex, path, nextStringIndex) {
    const boundProperty = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundProperty.indexOf('=');
    const propertyName = boundProperty.slice(1, equalsIndex);
    onProperty(propertyName, path);
  }

  // In addition to the allow-list of html tag names, any tag with a hyphen in
  //  the middle is considered a valid custom element. Therefore, we must allow
  //  for such declarations.
  static __validateTagName(namespace, tagName) {
    switch (namespace) {
      case Unforgiving.__html:
        if (
          tagName.indexOf('-') === -1 &&
          !Unforgiving.__allowedHtmlElements.has(tagName)
        ) {
          const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('forbidden-html-element');
          const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
          const substringMessage = `The <${tagName}> html element is forbidden.`;
          throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
        } else if (Unforgiving.__uppercaseLetters.test(tagName)) {
          // TODO: #236: Remove error handling here after <svg> is gone. The
          //  top-level patterns will be updated to consider this case.
          const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('uppercase-html-tag');
          const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
          const substringMessage = `Rewrite the html tag name "${tagName}" as "${tagName.toLowerCase()}".`;
          throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
        }
        break;
      case Unforgiving.__svg:
        // TODO: #236: Remove support for <svg> completely.
        if (!Unforgiving.__allowedSvgElements.has(tagName)) {
          const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('forbidden-svg-element');
          const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
          const substringMessage = `The <${tagName}> svg element is forbidden.`;
          throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}`);
        }
        break;
    }
  }

  // We’ve parsed through and open tag start and are ready to instantiate a new
  //  dom node and potentially add attributes, properties, and children.
  static __addElement(string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const prefixedTagName = string.slice(stringIndex, nextStringIndex);
    const tagName = prefixedTagName.slice(1);
    const currentNamespace = element.value[Unforgiving.__namespace];
    Unforgiving.__validateTagName(currentNamespace, tagName);
    let namespace = currentNamespace;
    if (tagName === 'svg') {
      Unforgiving.__svgDeprecationWarning();
      namespace = Unforgiving.__svg;
    }

    const childNode = namespace === Unforgiving.__html
      ? Unforgiving.__window.document.createElement(tagName)
      : Unforgiving.__window.document.createElementNS(namespace, tagName);
    element.value[Unforgiving.__localName] === 'template'
      ? element.value.content.appendChild(childNode)
      : element.value.appendChild(childNode);
    childNode[Unforgiving.__localName] = tagName;
    childNode[Unforgiving.__parentNode] = element.value;
    childNode[Unforgiving.__namespace] = namespace;
    element.value = childNode;
    childNodesIndex.value += 1;
    path.push(childNodesIndex.value);
  }

  // We’ve parsed through a close tag and can validate it, update our state to
  //  point back to our parent node, and continue parsing.
  static __finalizeElement(strings, stringsIndex, string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const closeTag = string.slice(stringIndex, nextStringIndex);
    const tagName = closeTag.slice(2, -1);
    const expectedTagName = element.value[Unforgiving.__localName];
    if (tagName !== expectedTagName) {
      const { parsed } = Unforgiving.__getErrorInfo(strings, stringsIndex, string, stringIndex);
      const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('mismatched-closing-tag');
      const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
      const substringMessage = `The closing tag </${tagName}> does not match <${expectedTagName}>.`;
      const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
      throw new Error(`[${errorMessagesKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.__parentNode];
  }

  // TODO: #237: Remove support for <style> tags.
  static __styleDeprecationWarning() {
    if (!Unforgiving.__hasWarnedAboutStyleDeprecation) {
      Unforgiving.__hasWarnedAboutStyleDeprecation = true;
      const error = new Error('Support for the <style> tag is deprecated and will be removed in future versions.');
      Unforgiving.__window.console.warn(error);
    }
  }

  // TODO: #236: Remove support for <svg> tags.
  static __svgDeprecationWarning() {
    if (!Unforgiving.__hasWarnedAboutSvgDeprecation) {
      Unforgiving.__hasWarnedAboutSvgDeprecation = true;
      const error = new Error('Support for the <svg> tag is deprecated and will be removed in future versions.');
      Unforgiving.__window.console.warn(error);
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Main parsing functionality ////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The core __parse function takes in the “strings” from a tagged template
  //  function and returns a document fragment. The “on*” callbacks are an
  //  optimization to allow a subscriber to store future lookups without
  //  needing to re-walk the resulting document fragment.
  static __parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText, language) {
    const fragment = Unforgiving.__fragment.cloneNode(false);
    const path = [];
    const childNodesIndex = { value: -1 }; // Wrapper to allow better factoring.
    const element = { value: fragment }; // Wrapper to allow better factoring.

    const stringsLength = strings.length;
    let stringsIndex = 0;
    let string = null;
    let stringLength = null;
    let stringIndex = null;
    let nextStringIndex = null;
    let value = Unforgiving.__initial;

    try {
      // TODO: #236: Need for namespaces is obviated once we drop <svg> support.
      let namespace;
      switch (language) {
        case undefined:
        case null:
        case 'html':
          namespace = Unforgiving.__html;
          break;
        case 'svg':
          namespace = Unforgiving.__svg;
          break;
        default: {
          const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('forbidden-language');
          const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
          throw new Error(`[${errorMessagesKey}] ${errorMessage}`);
        }
      }
      fragment[Unforgiving.__namespace] = namespace ??= Unforgiving.__html;

      while (stringsIndex < stringsLength) {
        string = strings[stringsIndex];

        Unforgiving.__validateRawString(strings.raw[stringsIndex]);
        if (stringsIndex > 0) {
          switch (value) {
            case Unforgiving.__initial:
            case Unforgiving.__boundContent:
            case Unforgiving.__unboundContent:
            case Unforgiving.__openTagEnd:
            case Unforgiving.__closeTag:
              if (element.value[Unforgiving.__localName] === 'textarea') {
                // The textarea tag only accepts text, we restrict interpolation
                //  there. See note on “replaceable character data” in the
                //  following reference document:
                //  https://w3c.github.io/html-reference/syntax.html#text-syntax
                const sloppyStartInterpolation = value !== Unforgiving.__openTagEnd;
                Unforgiving.__addBoundText(onText, string, path, sloppyStartInterpolation);
              } else {
                Unforgiving.__addBoundContent(onContent, path, element, childNodesIndex);
              }
              value = Unforgiving.__boundContent;
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
            const nextValue = Unforgiving.__validTransition(string, stringIndex, value);
            if (!nextValue) {
              Unforgiving.__throwTransitionError(strings, stringsIndex, string, stringIndex, value);
            }
            value = nextValue;
            nextStringIndex = value.lastIndex;
          }

          // When we transition into certain values, we need to take action.
          switch (value) {
            case Unforgiving.__unboundContent:
              Unforgiving.__addUnboundContent(string, stringIndex, element, childNodesIndex, nextStringIndex);
              break;
            case Unforgiving.__unboundComment:
              Unforgiving.__addUnboundComment(string, stringIndex, element, childNodesIndex, nextStringIndex);
              break;
            case Unforgiving.__openTagStart:
              Unforgiving.__addElement(string, stringIndex, path, element, childNodesIndex, nextStringIndex);
              break;
            case Unforgiving.__unboundBoolean:
              Unforgiving.__addUnboundBoolean(string, stringIndex, element, nextStringIndex);
              break;
            case Unforgiving.__unboundAttribute:
              Unforgiving.__addUnboundAttribute(string, stringIndex, element, nextStringIndex);
              break;
            case Unforgiving.__boundBoolean:
              Unforgiving.__addBoundBoolean(onBoolean, string, stringIndex, path, element, nextStringIndex);
              break;
            case Unforgiving.__boundDefined:
              Unforgiving.__addBoundDefined(onDefined, string, stringIndex, path, element, nextStringIndex);
              break;
            case Unforgiving.__boundAttribute:
              Unforgiving.__addBoundAttribute(onAttribute, string, stringIndex, path, element, nextStringIndex);
              break;
            case Unforgiving.__boundProperty:
              Unforgiving.__addBoundProperty(onProperty, string, stringIndex, path, nextStringIndex);
              break;
            case Unforgiving.__openTagEnd:
              if (element.value[Unforgiving.__namespace] === Unforgiving.__html) {
                const tagName = element.value[Unforgiving.__localName];
                if (Unforgiving.__voidHtmlElements.has(tagName)) {
                  value = Unforgiving.__finalizeVoidElement(path, element, childNodesIndex, nextStringIndex);
                  nextStringIndex = value.lastIndex;
                } else if (tagName === 'style') {
                  // TODO: #237: Remove support for <style> tags.
                  Unforgiving.__styleDeprecationWarning();
                  value = Unforgiving.__finalizeStyle(string, path, element, childNodesIndex, nextStringIndex);
                  nextStringIndex = value.lastIndex;
                } else if (
                  tagName === 'textarea' &&
                  Unforgiving.__openTagEnd.lastIndex !== string.length
                ) {
                  value = Unforgiving.__finalizeTextarea(string, path, element, childNodesIndex, nextStringIndex);
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
                  const errorMessagesKey = Unforgiving.__namedErrorsToErrorMessagesKey.get('declarative-shadow-root');
                  const errorMessage = Unforgiving.__errorMessages.get(errorMessagesKey);
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
            case Unforgiving.__closeTag:
              Unforgiving.__finalizeElement(strings, stringsIndex, string, stringIndex, path, element, childNodesIndex, nextStringIndex);
              break;
          }
          stringIndex = nextStringIndex; // Update out pointer from our pattern match.
        }
        stringsIndex++;
      }
      Unforgiving.__validateExit(fragment, element);
      return fragment;
    } catch (error) {
      error[Unforgiving.errorContextKey] = { stringsIndex, string, stringIndex };
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public interface //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  static errorContextKey = Symbol();

  static parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText, language) {
    Unforgiving.__toMode('parse');
    return Unforgiving.__parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText, language);
  }

  static validate(strings) {
    Unforgiving.__toMode('validate');
    const onBoolean = () => {};
    const onDefined = () => {};
    const onAttribute = () => {};
    const onProperty = () => {};
    const onContent = () => {};
    const onText = () => {};
    return Unforgiving.__parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText);
  }
}

export const parse = Unforgiving.parse.bind(Unforgiving);
export const validate = Unforgiving.validate.bind(Unforgiving);
export const errorContextKey = Unforgiving.errorContextKey;
