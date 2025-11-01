/** Strict HTML parser meant to handle interpolated HTML. */
export class XParser {
  // We use this to add machine-readable context to parsing errors.
  static #errorContextKey = Symbol();

  // Delimiter we add to improve debugging. E.g., `<div id="${…}"></div>`.
  static #delimiter = '${\u2026}';

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
    'html', 'head', 'base', 'link', 'meta', 'title', 'style', 'body', 'script',
    'noscript', 'canvas', 'acronym', 'big', 'center', 'content', 'dir', 'font',
    'frame', 'frameset', 'image', 'marquee', 'menuitem', 'nobr', 'noembed',
    'noframes', 'param', 'plaintext', 'rb', 'rtc', 'shadow', 'strike',
    'tt', 'xmp', 'math', 'svg',
  ]);
  static #allowedHtmlElements = XParser.#htmlElements.difference(XParser.#deniedHtmlElements);

  //////////////////////////////////////////////////////////////////////////////
  // Parsing State Values //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // These are all the states we can be in while we parse a string.
  //  https://w3c.github.io/html-reference/syntax.html

  // The “initial” and “boundContent” states are special in that there is no
  //  related pattern to match. Initial is just the state we start in and we
  //  only find bound content at string terminals (i.e., interpolations). The
  //  patterns below are intentionally unmatchable.
  static #initial                 = /\b\B/y;
  static #boundContent            = /\b\B/y;

  // Our text rules follow the “normal character data” spec.
  //  https://w3c.github.io/html-reference/syntax.html#normal-character-data
  static #text                    = /[^<]+/y;

  // Our comment rules follow the “comments” spec.
  //  https://w3c.github.io/html-reference/syntax.html#comments
  static #comment                 = /<!--.*?-->/ys;

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
  static #startTagOpen            =   /<(?![0-9-])[a-z0-9-]+(?<!-)(?=[\s>])/y;
  static #endTag                  = /<\/(?![0-9-])[a-z0-9-]+(?<!-)>/y;
  static #startTagClose           =    /(?<!\s)>/y;

  // Our space-delimiter rules more restrictive than the “space” spec.
  //  https://w3c.github.io/html-reference/terminology.html#space
  // Spaces must either be singular — or, a single newline followed by spaces
  //  used as indentation (we do not validate uniform indentation). Spaces may
  //  contain a maximum of _one_ newline.
  // Examples:
  //  - ok: <div foo bar>, <div\n  foo\n  bar>
  //  - not ok: <div foo  bar>, <div\n\n  foo\n\n  bar>, <div\tfoo\tbar>
  static #startTagSpace           = / |\n */y;

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
  static #boolean                 =     /(?![0-9-])[a-z0-9-]+(?<!-)(?=[\s>])/y;
  static #attribute               =     /(?![0-9-])[a-z0-9-]+(?<!-)="[^"]*"(?=[\s>])/y;
  static #boundBoolean            =   /\?(?![0-9-])[a-z0-9-]+(?<!-)="$/y;
  static #boundDefined            = /\?\?(?![0-9-])[a-z0-9-]+(?<!-)="$/y;
  static #boundAttribute          =     /(?![0-9-])[a-z0-9-]+(?<!-)="$/y;

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
  static #boundProperty           = /\.(?![A-Z0-9_])[a-zA-Z0-9_]+(?<!_)="$/y;

  // We require that values bound to attributes and properties be enclosed
  //  in double-quotes (see above patterns). Because interpolations delimit our
  //  “strings”, we need to check that the _next_ string begins with a
  //  double-quote. Note that it must precede a space, a newline, or the closing
  //  angle bracket of the opening tag.
  static #danglingQuote           = /"(?=[\s>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Special Tag Patterns //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The “textarea” tag is special in that it’s content is considered
  //  “replaceable” character data. We treat all characters between the opening
  //  and closing tags as the content. Note that we allow the “.” to match
  //  across newlines.
  //  https://w3c.github.io/html-reference/syntax.html#replaceable-character-data
  static #throughTextarea         = /.*?<\/textarea>/ys;

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
  static #entity                  = /&.*?;/ys;
  static #htmlEntityStart         = /[^&]*&[^&\s<]/y;

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
  static #cdataStart              = /<!\[CDATA\[/y;

  //////////////////////////////////////////////////////////////////////////////
  // Common Mistakes ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // See if weird spaces were added or if incorrect characters were used in
  //  open or close tags.
  static #startTagOpenMalformed   = /<\s*[a-zA-Z0-9_-]+/y;
  static #startTagSpaceMalformed  =  /\s+/y;
  static #startTagCloseMalformed  =  /\s*\/?>/y;
  static #endTagMalformed         = /<\s*\/\s*[a-zA-Z0-9_-]+[^>]*>/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  either normal or bound attributes.
  static #booleanMalformed        =     /[a-zA-Z0-9-_]+(?=[\s>])/y;
  static #attributeMalformed      =     /[a-zA-Z0-9-_]+=(?:"[^"]*"|'[^']*')?(?=[\s>])/y;
  static #boundBooleanMalformed   =   /\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static #boundDefinedMalformed   = /\?\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static #boundAttributeMalformed =     /[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  //  a bound property.
  static #boundPropertyMalformed  = /\.[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if the quote pair was malformed or missing.
  static #danglingQuoteMalformed  = /'?(?=[\s>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Errors ////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The following “mappings” (switch statements) are written this way so code
  //  coverage tooling will enforce that all these errors are reachable.

  // Simple mapping of all the errors which can be thrown by the parser. The
  //  parsing errors are allotted numbers #100-#199.
  static #getErrorMessage(key) {
    switch (key) {
      case '#100': return 'Could not parse template markup (at template start).';
      case '#101': return 'Could not parse template markup (after text content).';
      case '#102': return 'Could not parse template markup (after a comment).';
      case '#103': return 'Could not parse template markup (after interpolated content).';
      case '#104': return 'Could not parse template markup (after a spacing within start tag).';
      case '#105': return 'Could not parse template markup (after a start tag).';
      case '#106': return 'Could not parse template markup (after a boolean attribute interpolation in a start tag).';
      case '#107': return 'Could not parse template markup (after a defined attribute interpolation in a start tag).';
      case '#108': return 'Could not parse template markup (after an attribute interpolation in a start tag).';
      case '#109': return 'Could not parse template markup (after a property interpolation in a start tag).';
      case '#110': return 'Could not parse template markup (after an end tag).';

      case '#120': return 'Invalid tag name - refer to https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names).';
      case '#121': return 'Invalid tag whitespace (extraneous whitespace in start tag).';
      case '#122': return 'Invalid start tag (extraneous whitespace at close of start tag).';
      case '#123': return 'Invalid end tag.';
      case '#124': return 'Invalid tag attribute (must use kebab-case names and double-quoted values).';
      case '#125': return 'Invalid tag attribute interpolation (must use kebab-case names and double-quoted values).';
      case '#126': return 'Invalid tag property interpolation (must use kebab-case names and double-quoted values).';
      case '#127': return 'Invalid closing quote on tag attribute or property.';

      case '#140': return 'CDATA sections are not supported. Use character references instead: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference.';

      case '#150': return 'Bad escape in tagged template string. Use “&bsol;” for “\\”, “&dollar;” for “\\$”, and “&grave;” for “\\`”. All character references are supported: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference.';
      case '#151': return 'Ambiguous ampersand character or invalid hexadecimal character reference.';
      case '#152': return 'Invalid comment. Comments cannot start with “>” or “->” characters, they cannot include a set of “--” characters, and they cannot end with a “-” character.';
      case '#153': return 'Unsupported native tag - supported native tags are listed here: https://github.com/Netflix/x-element/blob/main/doc/TEMPLATES.md#supported-native-tags.';
      case '#154': return 'Invalid end tag (all non-void start tags much have matching end tags).';
      case '#155': return 'Unsupported <textarea> interpolation. Interpolation must be exact (<textarea>${…}</textarea>).';
      case '#156': return 'Unsupported declarative shadow root on <template>. The “shadowrootmode” attribute is not supported.';
      case '#157': return 'Missing closing quote on bound attribute or property.';
    }
  }

  // Block #100-#119 — Invalid transition errors.
  static #getErrorMessageKeyFromValue(value) {
    // Note that the following states _never_ have their own generic errors. The
    //  main reason is because they all encode a lookahead which is a subset of
    //  a related “*Malformed” pattern.
    // - XParser.#startTagOpen  (caught by XParser.#startTagSpaceMalformed)
    // - XParser.#boolean       (caught by XParser.#startTagSpaceMalformed)
    // - XParser.#attribute     (caught by XParser.#startTagSpaceMalformed)
    // - XParser.#danglingQuote (caught by XParser.#startTagSpaceMalformed)
    switch (value) {
      case XParser.#initial:                  return '#100';
      case XParser.#text:                     return '#101';
      case XParser.#comment:                  return '#102';
      case XParser.#boundContent:             return '#103';
      case XParser.#startTagSpace:            return '#104';
      case XParser.#startTagClose:            return '#105';
      case XParser.#boundBoolean:             return '#106';
      case XParser.#boundDefined:             return '#107';
      case XParser.#boundAttribute:           return '#108';
      case XParser.#boundProperty:            return '#109';
      case XParser.#endTag:                   return '#110';
    }
  }

  // Block #120-#139 — Common mistakes.
  static #getErrorMessageKeyFromValueMalformed(valueMalformed) {
    switch (valueMalformed) {
      case XParser.#startTagOpenMalformed:    return '#120';
      case XParser.#startTagSpaceMalformed:   return '#121';
      case XParser.#startTagCloseMalformed:   return '#122';
      case XParser.#endTagMalformed:          return '#123';
      case XParser.#booleanMalformed:         return '#124';
      case XParser.#attributeMalformed:       return '#124';
      case XParser.#boundBooleanMalformed:    return '#125';
      case XParser.#boundDefinedMalformed:    return '#125';
      case XParser.#boundAttributeMalformed:  return '#125';
      case XParser.#boundPropertyMalformed:   return '#126';
      case XParser.#danglingQuoteMalformed:   return '#127';
    }
  }

  // Block #140-#149 — Forbidden transitions.
  static #getErrorMessageKeyFromValueForbidden(valueForbidden) {
    switch (valueForbidden) {
      case XParser.#cdataStart:               return '#140';
    }
  }

  // Block #150+ — Special, named issues.
  static #getErrorMessageKeyFromErrorName(errorName) {
    switch (errorName) {
      case 'javascript-escape':               return '#150';
      case 'malformed-html-entity':           return '#151';
      case 'malformed-comment':               return '#152';
      case 'forbidden-html-element':          return '#153';
      case 'missing-end-tag':                 return '#154';
      case 'mismatched-end-tag':              return '#154';
      case 'complex-textarea-interpolation':  return '#155';
      case 'declarative-shadow-root':         return '#156';
      case 'missing-closing-quote':           return '#157';
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Internal parsing logic ////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Returns the first valid state-machine transition (if one exists).
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
      case XParser.#initial:
      case XParser.#boundContent:
      case XParser.#text:
      case XParser.#startTagClose:
      case XParser.#endTag: return XParser.#try(string, stringIndex,
        XParser.#cdataStart);
    }
  }

  // This should roughly match our “valid” transition mapping, but for errors.
  static #invalidTransition(string, stringIndex, value) {
    switch (value) {
      case XParser.#initial: return XParser.#try(string, stringIndex,
        XParser.#startTagOpenMalformed);
      case XParser.#text: return XParser.#try(string, stringIndex,
        XParser.#endTagMalformed,
        XParser.#startTagOpenMalformed);
      case XParser.#boundContent: return XParser.#try(string, stringIndex,
        XParser.#endTagMalformed,
        XParser.#startTagOpenMalformed);
      case XParser.#comment: return XParser.#try(string, stringIndex,
        XParser.#endTagMalformed,
        XParser.#startTagOpenMalformed);
      case XParser.#startTagOpen:
      case XParser.#boolean:
      case XParser.#attribute:
      case XParser.#danglingQuote: return XParser.#try(string, stringIndex,
        XParser.#startTagSpaceMalformed);
      case XParser.#startTagSpace: return XParser.#try(string, stringIndex,
        XParser.#startTagSpaceMalformed,
        XParser.#booleanMalformed,
        XParser.#attributeMalformed,
        XParser.#boundBooleanMalformed,
        XParser.#boundDefinedMalformed,
        XParser.#boundAttributeMalformed,
        XParser.#boundPropertyMalformed,
        XParser.#startTagCloseMalformed);
      case XParser.#startTagClose: return XParser.#try(string, stringIndex,
        XParser.#startTagOpenMalformed,
        XParser.#endTagMalformed);
      case XParser.#boundBoolean:
      case XParser.#boundDefined:
      case XParser.#boundAttribute:
      case XParser.#boundProperty: return XParser.#try(string, stringIndex,
        XParser.#danglingQuoteMalformed);
      case XParser.#endTag: return XParser.#try(string, stringIndex,
        XParser.#startTagOpenMalformed,
        XParser.#endTagMalformed);
    }
  }

  // This is the core of the state machine. It describes every valid traversal
  //  through a set of html template “strings” array.
  static #validTransition(string, stringIndex, value) {
    switch (value) {
      // The “initial” state is where we start when we begin parsing.
      //  E.g., html`‸hello world!`
      case XParser.#initial: return XParser.#try(string, stringIndex,
        XParser.#text,
        XParser.#startTagOpen,
        XParser.#comment);

      // The “text” state means that we’ve just parsed through some literal html
      //  text either in the root of the template or between an start / end tag.
      //  E.g., html`hello ‸${world}!`
      case XParser.#text: return XParser.#try(string, stringIndex,
        XParser.#endTag,
        XParser.#startTagOpen,
        XParser.#comment);

      // The “boundContent” state means that we just hit an interpolation (i.e.,
      //  started a new string).
      //  E.g., html`hello ${world}‸!`
      // The “comment” state means that we just completed a comment. We  don’t
      //  allow comment interpolations.
      //  E.g., html`hello <!-- todo -->‸ ${world}!`
      case XParser.#boundContent:
      case XParser.#comment: return XParser.#try(string, stringIndex,
        XParser.#text,
        XParser.#endTag,
        XParser.#startTagOpen,
        XParser.#comment); 

      // The “startTagOpen” means that we’ve successfully parsed through the
      //  open angle bracket (“<”) and the tag name in a start tag.
      //  E.g., html`<div‸></div>`
      // The “boolean” means we parsed through a literal boolean attribute which
      //  doesn’t have an interpolated binding.
      //  E.g., html`<div foo‸></div>`
      // The “attribute” means we parsed through a literal key-value attribute
      //  pair which doesn’t have an interpolated binding.
      //  E.g., html`<div foo="bar"‸></div>`
      // The “danglingQuote” means we parsed through a prefixing, closing quote
      //  as the first character in a new string on the other side of an
      //  interpolated value for a bound boolean attribute, a bound defined
      //  attribute, a bound normal attribute, or a bound property.
      //  E.g., html`<div foo="${bar}"‸></div>`
      case XParser.#startTagOpen:
      case XParser.#boolean:
      case XParser.#attribute:
      case XParser.#danglingQuote: return XParser.#try(string, stringIndex,
        XParser.#startTagSpace,
        XParser.#startTagClose);

      // The “startTagSpace” is either one space or a single newline and some
      //  indentation space after the start tag name, an attribute, or property.
      //  E.g., html`<div ‸foo></div>`
      case XParser.#startTagSpace: return XParser.#try(string, stringIndex,
        XParser.#boolean,
        XParser.#attribute,
        XParser.#boundBoolean,
        XParser.#boundDefined,
        XParser.#boundAttribute,
        XParser.#boundProperty,
        XParser.#startTagClose);

      // The “startTagClose” is just the “>” character.
      //  E.g., html`<div>‸</div>`
      case XParser.#startTagClose: return XParser.#try(string, stringIndex,
        XParser.#startTagOpen,
        XParser.#text,
        XParser.#endTag,
        XParser.#comment);

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
      case XParser.#boundBoolean:
      case XParser.#boundDefined:
      case XParser.#boundAttribute:
      case XParser.#boundProperty: return XParser.#try(string, stringIndex,
        XParser.#danglingQuote);

      // The “endTag” state means we just found an some end tag successfully,
      //  E.g., html`<div><span></span>‸</div>`
      case XParser.#endTag: return XParser.#try(string, stringIndex,
        XParser.#text,
        XParser.#startTagOpen,
        XParser.#endTag,
        XParser.#comment);
    }
  }

  // Common functionality to help print out template context when displaying
  //  helpful error messages to developers.
  static #getErrorInfo(strings, stringsIndex, string, stringIndex) {
    let prefix;
    let prefixIndex;
    if (stringsIndex > 0) {
      const validPrefix = strings.slice(0, stringsIndex).join(XParser.#delimiter);
      prefix = [validPrefix, string].join(XParser.#delimiter);
      prefixIndex = validPrefix.length + XParser.#delimiter.length + stringIndex;
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
  static #throwTransitionError(strings, stringsIndex, string, stringIndex, value) {
    const { parsed, notParsed } = XParser.#getErrorInfo(strings, stringsIndex, string, stringIndex);
    const valueForbidden = XParser.#forbiddenTransition(string, stringIndex, value);
    const valueMalformed = XParser.#invalidTransition(string, stringIndex, value);
    const errorMessageKey = valueForbidden
      ? XParser.#getErrorMessageKeyFromValueForbidden(valueForbidden)
      : valueMalformed
        ? XParser.#getErrorMessageKeyFromValueMalformed(valueMalformed)
        : XParser.#getErrorMessageKeyFromValue(value);
    const errorMessage = XParser.#getErrorMessage(errorMessageKey);
    const substringMessage = `See substring \`${notParsed}\`.`;
    const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
    const message = `[${errorMessageKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`;
    throw new Error(message);
  }

  // Character escapes like “\n”, “\u” or ”\x” are a JS-ism. We want developers
  //  to use HTML here, not JS. You can of course interpolate whatever you want.
  //  https://w3c.github.io/html-reference/syntax.html#character-encoding
  //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape
  // Note that syntax highlighters expect the text after the “html” tag to be
  //  real HTML. Another reason to reject JS-y unicode is that it won’t be
  //  interpreted correctly by tooling that expects _html_.
  // Escapes for the “$”, “\”, and “`” characters are required within a template
  //  literal — users will need to use “&dollar;”, “&bsol;”, and “&grave;”.
  // Examples:
  //  - ok: html`&#8230;`, html`&#x2026;`, html`&mldr;`, html`&hellip;`
  //  - not ok: html`\nhi\nthere`, html`\x8230`, html`\u2026`, html`\s\t\o\p\ \i\t\.`
  static #validateRawString(rawString) {
    const backslashIndex = rawString.indexOf('\\');
    if (backslashIndex !== -1) {
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('javascript-escape');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      const substringMessage = `See (raw) substring \`${rawString.slice(0, backslashIndex + 1)}\`.`;
      const message = `[${errorMessageKey}] ${errorMessage}\n${substringMessage}`;
      throw new Error(message);
    }
  }

  // Before a successful exit, the parser ensures that all non-void opening tags
  //  have been matched successfully to prevent any unexpected behavior.
  static #validateExit(value, tagName) {
    switch (value) {
      case XParser.#boundBoolean:
      case XParser.#boundDefined:
      case XParser.#boundAttribute:
      case XParser.#boundProperty: {
        const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('missing-closing-quote');
        const errorMessage = XParser.#getErrorMessage(errorMessageKey);
        const substringMessage = `Missing closing double-quote.`;
        throw new Error(`[${errorMessageKey}] ${errorMessage}\n${substringMessage}`);
      }
    }
    if (tagName) {
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('missing-end-tag');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      const substringMessage = `Missing a closing </${tagName}>.`;
      throw new Error(`[${errorMessageKey}] ${errorMessage}\n${substringMessage}`);
    }
  }

  // Certain parts of an html document may contain character references (html
  //  entities). We find them via a performant pattern, and then parse them out
  //  via a non-performant pattern. This way, the cost is only as high as the
  //  number of character references used (which is often low).
  //  Note that malformed references or ambiguous ampersands will cause errors.
  //  https://html.spec.whatwg.org/multipage/named-characters.html
  // Note that we test against the “content”, but ensure to report tokens as
  //  compared to the original “string”. This is significantly more performant.
  static #sendInnerTextTokens(onToken, string, index, start, end, plaintextType, referenceType) {
    const content = string.slice(start, end);
    const contentStart = 0;
    const contentEnd = content.length;
    let plaintextStart = contentStart;
    XParser.#htmlEntityStart.lastIndex = plaintextStart;
    let referenceEnd = contentEnd;
    while (XParser.#htmlEntityStart.test(content)) {
      const referenceStart = XParser.#htmlEntityStart.lastIndex - 2;
      if (plaintextStart < referenceStart) {
        const substringStart = start + plaintextStart;
        const substringEnd = start + referenceStart;
        const substring = string.slice(substringStart, substringEnd);
        onToken(plaintextType, index, substringStart, substringEnd, substring);
      }
      XParser.#entity.lastIndex = referenceStart;
      if (!XParser.#entity.test(content)) {
        const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('malformed-html-entity');
        const errorMessage = XParser.#getErrorMessage(errorMessageKey);
        const substringMessage = `See substring \`${content}\`.`;
        throw new Error(`[${errorMessageKey}] ${errorMessage}\n${substringMessage}`);
      }
      referenceEnd = XParser.#entity.lastIndex;
      plaintextStart = referenceEnd;
      XParser.#htmlEntityStart.lastIndex = plaintextStart;
      const substringStart = start + referenceStart;
      const substringEnd = start + referenceEnd;
      const substring = string.slice(substringStart, substringEnd);
      onToken(referenceType, index, substringStart, substringEnd, substring);
    }
    if (plaintextStart === contentStart) {
      // There were no references.
      onToken(plaintextType, index, start, end, content);
    } else if (referenceEnd !== contentEnd) {
      // We had references and there was some leftover plaintext.
      const substringStart = start + referenceEnd;
      const substringEnd = start + contentEnd;
      const substring = string.slice(substringStart, substringEnd);
      onToken(plaintextType, index, substringStart, substringEnd, substring);
    }
  }

  // In addition to the allow-list of html tag names, any tag with a hyphen in
  //  the middle is considered a valid custom element. Therefore, we must allow
  //  for such declarations.
  static #validateTagName(tagName) {
    if (
      tagName.indexOf('-') === -1 &&
      !XParser.#allowedHtmlElements.has(tagName)
    ) {
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('forbidden-html-element');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      const substringMessage = `The <${tagName}> html element is forbidden.`;
      throw new Error(`[${errorMessageKey}] ${errorMessage}\n${substringMessage}`);
    }
  }

  // This validates a specific case where we need to reject “template” elements
  //  which have “declarative shadow roots” via a “shadowrootmode” attribute.
  static #validateNoDeclarativeShadowRoots(tagName, attributeName) {
    if (tagName === 'template' && attributeName === 'shadowrootmode') {
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('declarative-shadow-root');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      throw new Error(`[${errorMessageKey}] ${errorMessage}`);
    }
  }

  // This can only happen with a “textarea” element, currently. Note that the
  //  subscriber is notified about this as a “text” binding not a “content”
  //  binding so that it correctly bind _any_ interpolated value to the
  //  “textContent” property as a string — no matter the type.
  static #sendBoundTextTokens(onToken, stringsIndex, string, stringIndex, sloppyStartInterpolation) {
    // If the prior match isn’t our opening tag… that’s a problem. If the next
    //  match isn’t our closing tag… that’s also a problem.
    // Because we tightly control the end-tag format, we can predict what the
    //  next string’s prefix should be.
    if (sloppyStartInterpolation || !string.startsWith(`</textarea>`)) {
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('complex-textarea-interpolation');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      throw new Error(`[${errorMessageKey}] ${errorMessage}`);
    }
    onToken(XParser.tokenTypes.boundTextValue, stringsIndex, stringIndex, stringIndex, '');
  }

  // Bound content is simply an interpolation in the template which exists in a
  //  location destined to be bound as “textContent” on some node.
  static #sendBoundContentTokens(onToken, stringsIndex, string, stringIndex) {
    onToken(XParser.tokenTypes.boundContentValue, stringsIndex, stringIndex, stringIndex, '');
  }

  // This handles literal text in a template that needs to become text content.
  static #sendTextTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    onToken(XParser.tokenTypes.textStart, stringsIndex, stringIndex, stringIndex, '');
    XParser.#sendInnerTextTokens(onToken, string, stringsIndex, stringIndex, nextStringIndex, XParser.tokenTypes.textPlaintext, XParser.tokenTypes.textReference);
    onToken(XParser.tokenTypes.textEnd, stringsIndex, nextStringIndex, nextStringIndex, '');
  }

  // A comment is just a basic html comment. Comments may not be interpolated
  //  and follow some specific rules from the html specification. Note that
  //  character references are not replaced in comments.
  //  https://w3c.github.io/html-reference/syntax.html#comments
  static #sendCommentTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    const commentStart = stringIndex + 4;
    const commentEnd = nextStringIndex - 3;
    onToken(XParser.tokenTypes.commentOpen, stringsIndex, stringIndex, commentStart, '<!--');
    const data = string.slice(commentStart, commentEnd);
    if (data.startsWith('>') || data.startsWith('->') || data.includes('--') || data.endsWith('-')) {
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('malformed-comment');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      const substringMessage = `See substring \`${string.slice(stringIndex, nextStringIndex)}\`.`;
      throw new Error(`[${errorMessageKey}] ${errorMessage}\n${substringMessage}`);
    }
    onToken(XParser.tokenTypes.comment, stringsIndex, commentStart, commentEnd, data);
    onToken(XParser.tokenTypes.commentClose, stringsIndex, commentEnd, nextStringIndex, '-->');
  }

  // The beginning of a start tag — e.g., “<div”.
  static #sendStartTagOpenTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    const tagNameStart = stringIndex + 1;
    const tagName = string.slice(tagNameStart, nextStringIndex);
    XParser.#validateTagName(tagName);
    onToken(XParser.tokenTypes.startTagOpen, stringsIndex, stringIndex, tagNameStart, '<');
    onToken(XParser.tokenTypes.startTagName, stringsIndex, tagNameStart, nextStringIndex, tagName);
    return tagName;
  }

  // Simple spaces and newlines withing a start tag.
  static #sendStartTagSpaceTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    const substring = string.slice(stringIndex, nextStringIndex);
    onToken(XParser.tokenTypes.startTagSpace, stringsIndex, stringIndex, nextStringIndex, substring);
  }

  // A single double-quote after a binding in a start tag.
  static #sendDanglingQuoteTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    onToken(XParser.tokenTypes.startTagQuote, stringsIndex, stringIndex, nextStringIndex, '"');
  }

  // A boolean is a literal boolean attribute declaration with no value.
  static #sendBooleanTokens(onToken, tagName, stringsIndex, string, stringIndex, nextStringIndex) {
    // A boolean attribute in a start tag — “data-has-flag”
    const attributeName = string.slice(stringIndex, nextStringIndex);
    XParser.#validateNoDeclarativeShadowRoots(tagName, attributeName);
    onToken(XParser.tokenTypes.booleanName, stringsIndex, stringIndex, nextStringIndex, attributeName);
  }

  // An attribute is a literal attribute declaration. It has an associated value
  //  which forms a key-value pair.
  static #sendAttributeTokens(onToken, tagName, stringsIndex, string, stringIndex, nextStringIndex) {
    // An attribute in a start tag — “data-foo="bar"”
    const equalsStart = string.indexOf('=', stringIndex);
    const attributeName = string.slice(stringIndex, equalsStart);
    XParser.#validateNoDeclarativeShadowRoots(tagName, attributeName);
    const equalsEnd = equalsStart + 1;
    const valueStart = equalsEnd + 1;
    const valueEnd = nextStringIndex - 1;
    onToken(XParser.tokenTypes.attributeName, stringsIndex, stringIndex, equalsStart, attributeName);
    onToken(XParser.tokenTypes.startTagEquals, stringsIndex, equalsStart, equalsEnd, '=');
    onToken(XParser.tokenTypes.startTagQuote, stringsIndex, equalsEnd, valueStart, '"');
    onToken(XParser.tokenTypes.attributeValueStart, stringsIndex, valueStart, valueStart, '');
    XParser.#sendInnerTextTokens(onToken, string, stringsIndex, valueStart, valueEnd, XParser.tokenTypes.attributeValuePlaintext, XParser.tokenTypes.attributeValueReference);
    onToken(XParser.tokenTypes.attributeValueEnd, stringsIndex, valueEnd, valueEnd, '');
    onToken(XParser.tokenTypes.startTagQuote, stringsIndex, valueEnd, nextStringIndex, '"');
  }

  // A bound boolean is a boolean attribute flag with an associated value
  //  binding. It has a single, preceding “?” character.
  static #sendBoundBooleanTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    // A bound boolean in a start tag — “?data-foo="”
    const nameStart = stringIndex + 1;
    const equalsStart = string.indexOf('=', stringIndex);
    const equalsEnd = equalsStart + 1;
    const attributeName = string.slice(nameStart, equalsStart);
    onToken(XParser.tokenTypes.boundBooleanPrefix, stringsIndex, stringIndex, nameStart, '?');
    onToken(XParser.tokenTypes.boundBooleanName, stringsIndex, nameStart, equalsStart, attributeName);
    onToken(XParser.tokenTypes.startTagEquals, stringsIndex, equalsStart, equalsEnd, '=');
    onToken(XParser.tokenTypes.startTagQuote, stringsIndex, equalsEnd, nextStringIndex, '"');
    onToken(XParser.tokenTypes.boundBooleanValue, stringsIndex, nextStringIndex, nextStringIndex, '');
  }

  // Similar to a bound boolean, but with two preceding “??” characters. We
  //  notify subscribers about this attribute which exists only when defined.
  static #sendBoundDefinedTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    // A bound defined in a start tag — “??data-foo="”
    const nameStart = stringIndex + 2;
    const equalsStart = string.indexOf('=', stringIndex);
    const equalsEnd = equalsStart + 1;
    const attributeName = string.slice(nameStart, equalsStart);
    onToken(XParser.tokenTypes.boundDefinedPrefix, stringsIndex, stringIndex, nameStart, '??');
    onToken(XParser.tokenTypes.boundDefinedName, stringsIndex, nameStart, equalsStart, attributeName);
    onToken(XParser.tokenTypes.startTagEquals, stringsIndex, equalsStart, equalsEnd, '=');
    onToken(XParser.tokenTypes.startTagQuote, stringsIndex, equalsEnd, nextStringIndex, '"');
    onToken(XParser.tokenTypes.boundDefinedValue, stringsIndex, nextStringIndex, nextStringIndex, '');
  }

  // This is an attribute with a name / value pair where the “value” is bound
  //  as an interpolation.
  static #sendBoundAttributeTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    // A bound attribute in a start tag — “data-foo="”
    const equalsStart = string.indexOf('=', stringIndex);
    const equalsEnd = equalsStart + 1;
    const attributeName = string.slice(stringIndex, equalsStart);
    onToken(XParser.tokenTypes.boundAttributeName, stringsIndex, stringIndex, equalsStart, attributeName);
    onToken(XParser.tokenTypes.startTagEquals, stringsIndex, equalsStart, equalsEnd, '=');
    onToken(XParser.tokenTypes.startTagQuote, stringsIndex, equalsEnd, nextStringIndex, '"');
    onToken(XParser.tokenTypes.boundAttributeValue, stringsIndex, nextStringIndex, nextStringIndex, '');
  }

  // This is an property with a name / value pair where the “value” is bound
  //  as an interpolation.
  static #sendBoundPropertyTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    // A bound boolean in a start tag — “.dataFoo="”
    const nameStart = stringIndex + 1;
    const equalsStart = string.indexOf('=', stringIndex);
    const equalsEnd = equalsStart + 1;
    const attributeName = string.slice(nameStart, equalsStart);
    onToken(XParser.tokenTypes.boundPropertyPrefix, stringsIndex, stringIndex, nameStart, '.');
    onToken(XParser.tokenTypes.boundPropertyName, stringsIndex, nameStart, equalsStart, attributeName);
    onToken(XParser.tokenTypes.startTagEquals, stringsIndex, equalsStart, equalsEnd, '=');
    onToken(XParser.tokenTypes.startTagQuote, stringsIndex, equalsEnd, nextStringIndex, '"');
    onToken(XParser.tokenTypes.boundPropertyValue, stringsIndex, nextStringIndex, nextStringIndex, '');
  }

  // Because void elements to not have an end tag, we close them slightly
  //  differently so downstream consumers can track DOM paths easily.
  static #sendVoidElementTokens(onToken, stringsIndex, stringIndex, nextStringIndex) {
    // Void elements are treated with special consideration as they
    //  will never contain child nodes.
    onToken(XParser.tokenTypes.voidTagClose, stringsIndex, stringIndex, nextStringIndex, '>');
  }

  // Textarea contains so-called “replaceable” character data. We throw an error
  //  if a “complex” interpolation exists — anything other than a perfectly-fit
  //  content interpolation between the opening and closing tags.
  static #sendTextareaTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex) {
    onToken(XParser.tokenTypes.startTagClose, stringsIndex, stringIndex, nextStringIndex, '>');
    XParser.#throughTextarea.lastIndex = nextStringIndex;
    if (XParser.#throughTextarea.test(string)) {
      const nextNextStringIndex = XParser.#throughTextarea.lastIndex;
      const textContentEnd = nextNextStringIndex - 11; // “</textarea>” has 11 characters.
      const tagNameStart = textContentEnd + 2;
      const tagNameEnd = nextNextStringIndex - 1;
      onToken(XParser.tokenTypes.textStart, stringsIndex, nextStringIndex, nextStringIndex, '');
      XParser.#sendInnerTextTokens(onToken, string, stringsIndex, nextStringIndex, textContentEnd, XParser.tokenTypes.textPlaintext, XParser.tokenTypes.textReference);
      onToken(XParser.tokenTypes.textEnd, stringsIndex, textContentEnd, textContentEnd, '');
      onToken(XParser.tokenTypes.endTagOpen, stringsIndex, textContentEnd, tagNameStart, '</');
      onToken(XParser.tokenTypes.endTagName, stringsIndex, tagNameStart, tagNameEnd, 'textarea');
      onToken(XParser.tokenTypes.endTagClose, stringsIndex, tagNameEnd, nextNextStringIndex, '>');
      return nextNextStringIndex;
    } else {
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('complex-textarea-interpolation');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      throw new Error(`[${errorMessageKey}] ${errorMessage}`);
    }
  }

  // Literally just indicating the “>” to close a start tag.
  static #sendStartTagCloseTokens(onToken, stringsIndex, stringIndex, nextStringIndex) {
    onToken(XParser.tokenTypes.startTagClose, stringsIndex, stringIndex, nextStringIndex, '>');
  }

  // An end tag — e.g., “</div>”.
  static #sendEndTagTokens(onToken, tagName, strings, stringsIndex, string, stringIndex, nextStringIndex) {
    const endTagNameStart = stringIndex + 2;
    const endTagNameEnd = nextStringIndex - 1;
    const endTagName = string.slice(endTagNameStart, endTagNameEnd);
    if (endTagName !== tagName) {
      const { parsed } = XParser.#getErrorInfo(strings, stringsIndex, string, stringIndex);
      const errorMessageKey = XParser.#getErrorMessageKeyFromErrorName('mismatched-end-tag');
      const errorMessage = XParser.#getErrorMessage(errorMessageKey);
      const substringMessage = `The closing tag </${endTagName}> does not match <${tagName}>.`;
      const parsedThroughMessage = `Your HTML was parsed through: \`${parsed}\`.`;
      throw new Error(`[${errorMessageKey}] ${errorMessage}\n${substringMessage}\n${parsedThroughMessage}`);
    }
    onToken(XParser.tokenTypes.endTagOpen, stringsIndex, stringIndex, endTagNameStart, '</');
    onToken(XParser.tokenTypes.endTagName, stringsIndex, endTagNameStart, endTagNameEnd, endTagName);
    onToken(XParser.tokenTypes.endTagClose, stringsIndex, endTagNameEnd, nextStringIndex, '>');
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public interface //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // This object enumerates all the different classifications we have for
  //  substring interpretations and bindings for interpolated html markup.
  static tokenTypes = {
    // Syntax
    startTagOpen: 'start-tag-open',                        // “<”
    startTagSpace: 'start-tag-space',                      // “ ”, “\n”, etc.
    startTagEquals: 'start-tag-equals',                    // “=”
    startTagQuote: 'start-tag-quote',                      // “"”
    startTagClose: 'start-tag-close',                      // “>”
    voidTagClose: 'void-tag-close',                        // “>” (special case)
    boundBooleanPrefix: 'bound-boolean-prefix',            // “?”
    boundDefinedPrefix: 'bound-defined-prefix',            // “??”
    boundPropertyPrefix: 'bound-property-prefix',          // “.”
    endTagOpen: 'end-tag-open',                            // “</”
    endTagClose: 'end-tag-close',                          // “>”
    commentOpen: 'comment-open',                           // “<!--”
    commentClose: 'comment-close',                         // “-->”

    // Literals
    startTagName: 'start-tag-name',                        // e.g., “div”
    endTagName: 'end-tag-name',                            // e.g., “span”
    comment: 'comment',                                    // text in comment
    attributeName: 'attribute-name',                       // e.g., “id”
    booleanName: 'boolean-name',                           // e.g., “disabled”

    // Text
    textStart: 'text-start',                               // begin text
    textReference: 'text-reference',                       // html entity
    textPlaintext: 'text-plaintext',                       // normal text
    textEnd: 'text-end',                                   // end text

    // Attribute Values
    attributeValueStart: 'attribute-value-start',          // begin value
    attributeValueReference: 'attribute-value-reference',  // html entity
    attributeValuePlaintext: 'attribute-value-plaintext',  // normal text
    attributeValueEnd: 'attribute-value-end',              // end value

    // Bindings
    boundAttributeName: 'bound-attribute-name',            // binding name
    boundBooleanName: 'bound-boolean-name',                // binding name
    boundDefinedName: 'bound-defined-name',                // binding name
    boundPropertyName: 'bound-property-name',              // binding name
    boundTextValue: 'bound-text-value',                    // binding location
    boundContentValue: 'bound-content-value',              // binding location
    boundAttributeValue: 'bound-attribute-value',          // binding location
    boundBooleanValue: 'bound-boolean-value',              // binding location
    boundDefinedValue: 'bound-defined-value',              // binding location
    boundPropertyValue: 'bound-property-value',            // binding location
  };

  /**
   * Additional error context.
   * @typedef {object} ErrorContext
   * @property {number} index
   * @property {number} start
   * @property {number} end
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
   * Main parsing callback.
   * @callback onToken
   * @param {string} type
   * @param {number} index
   * @param {number} start
   * @param {number} end
   * @param {string} substring
   */

  /**
   * The core parse function takes in the “strings” from a tagged template
   * function and returns an array of tokens representing the parsed result.
   * @param {TemplateStringsArray} strings
   * @param {onToken} onToken
   */
  static parse(strings, onToken) {
    const stringsLength = strings.length;
    const tagNames = [null];
    let tagName = null;
    let stringsIndex = 0;
    let string = null;
    let stringLength = null;
    let stringIndex = null;
    let nextStringIndex = null;
    let value = XParser.#initial; // Values are stateful regular expressions.

    try {
      while (stringsIndex < stringsLength) {
        XParser.#validateRawString(strings.raw[stringsIndex]);

        string = strings[stringsIndex];
        if (stringsIndex > 0) {
          switch (value) {
            case XParser.#initial:
            case XParser.#boundContent:
            case XParser.#text:
            case XParser.#startTagClose:
            case XParser.#endTag:
              if (tagName === 'textarea') {
                // The textarea tag only accepts text, we restrict interpolation
                //  there. See note on “replaceable character data” in the
                //  following reference document:
                //  https://w3c.github.io/html-reference/syntax.html#text-syntax
                const sloppyStartInterpolation = value !== XParser.#startTagClose;
                XParser.#sendBoundTextTokens(onToken, stringsIndex - 1, string, stringIndex, sloppyStartInterpolation);
              } else {
                XParser.#sendBoundContentTokens(onToken, stringsIndex - 1, string, stringIndex);
              }
              value = XParser.#boundContent;
              break;
          }
        }

        stringLength = string.length;
        stringIndex = 0;
        while (stringIndex < stringLength) {
          // The string will be empty if we have a template like this `${…}${…}`.
          //  See related logic at the end of the inner loop;
          if (string.length > 0) {
            const nextValue = XParser.#validTransition(string, stringIndex, value);
            if (!nextValue) {
              XParser.#throwTransitionError(strings, stringsIndex, string, stringIndex, value);
            }
            value = nextValue;
            nextStringIndex = value.lastIndex;
          }

          // When we transition into certain values, we need to take action.
          switch (value) {
            case XParser.#text:
              XParser.#sendTextTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#comment:
              XParser.#sendCommentTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#startTagOpen:
              tagName = XParser.#sendStartTagOpenTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              tagNames.push(tagName);
              break;
            case XParser.#startTagSpace:
              XParser.#sendStartTagSpaceTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#danglingQuote:
              XParser.#sendDanglingQuoteTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#boolean:
              XParser.#sendBooleanTokens(onToken, tagName, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#attribute:
              XParser.#sendAttributeTokens(onToken, tagName, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#boundBoolean:
              XParser.#sendBoundBooleanTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#boundDefined:
              XParser.#sendBoundDefinedTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#boundAttribute:
              XParser.#sendBoundAttributeTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#boundProperty:
              XParser.#sendBoundPropertyTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
              break;
            case XParser.#startTagClose:
              if (XParser.#voidHtmlElements.has(tagName)) {
                XParser.#sendVoidElementTokens(onToken, stringsIndex, stringIndex, nextStringIndex);
                tagNames.pop();
                tagName = tagNames[tagNames.length - 1];
              } else if (tagName === 'textarea' && XParser.#startTagClose.lastIndex !== string.length) {
                // If successful, move cursor through textarea element end tag.
                nextStringIndex = XParser.#sendTextareaTokens(onToken, stringsIndex, string, stringIndex, nextStringIndex);
                value = XParser.#endTag;
                value.lastIndex = nextStringIndex;
                tagNames.pop();
                tagName = tagNames[tagNames.length - 1];
              } else {
                XParser.#sendStartTagCloseTokens(onToken, stringsIndex, stringIndex, nextStringIndex);
              }
              break;
            case XParser.#endTag: {
              XParser.#sendEndTagTokens(onToken, tagName, strings, stringsIndex, string, stringIndex, nextStringIndex);
              tagNames.pop();
              tagName = tagNames[tagNames.length - 1];
              break;
            }
          }
          stringIndex = nextStringIndex; // Update out pointer from our pattern match.
          nextStringIndex = null;
        }
        stringsIndex++;
      }

      XParser.#validateExit(value, tagName);
    } catch (error) {
      // Roughly match the conventions for “onToken”.
      const index = stringsIndex;
      const start = stringIndex;
      const end = nextStringIndex;
      error[XParser.#errorContextKey] = { index, start, end };
      throw error;
    }
  }
}
