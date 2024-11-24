/** Forgiving HTML parser which leverages innerHTML. */
/*
class Forgiving {
  // Special markers added to markup enabling discovery post-instantiation.
  static #NEXT_MARKER = 'forgiving-next:'; // The ":" helps for debugging.
  static #CONTENT_MARKER = 'forgiving-content';

  // Types of bindings that we can have.
  static #ATTRIBUTE = 'attribute';
  static #BOOLEAN = 'boolean';
  static #DEFINED = 'defined';
  static #PROPERTY = 'property';

  // TODO: Could be more forgiving here!
  // Patterns to find special edges in original html strings.
  static #OPEN_REGEX = /<[a-z][a-z0-9-]*(?=\s)/g;
  static #STEP_REGEX = /(?:\s+[a-z][a-z0-9-]*(?=[\s>])|\s+[a-z][a-zA-Z0-9-]*="[^"]*")+/y;
  static #ATTRIBUTE_OR_PROPERTY_REGEX = /\s+(?:(?<questions>\?{0,2})?(?<attribute>([a-z][a-zA-Z0-9-]*))|\.(?<property>[a-z][a-zA-Z0-9_]*))="$/y;
  static #CLOSE_REGEX = />/g;

  // Walk through each string from our tagged template function “strings” array
  //  in a stateful way so that we know what kind of bindings are implied at
  //  each interpolated value.
  static #exhaustString(string, state, context) {
    if (!state.inside) {
      // We're outside the opening tag.
      Forgiving.#OPEN_REGEX.lastIndex = state.index;
      const openMatch = Forgiving.#OPEN_REGEX.exec(string);
      if (openMatch) {
        state.inside = true;
        state.index = Forgiving.#OPEN_REGEX.lastIndex;
        state.lastOpenContext = context;
        state.lastOpenIndex = openMatch.index;
        Forgiving.#exhaustString(string, state, context);
      }
    } else {
      // We're inside the opening tag.
      Forgiving.#STEP_REGEX.lastIndex = state.index;
      if (Forgiving.#STEP_REGEX.test(string)) {
        state.index = Forgiving.#STEP_REGEX.lastIndex;
      }
      Forgiving.#CLOSE_REGEX.lastIndex = state.index;
      if (Forgiving.#CLOSE_REGEX.test(string)) {
        state.inside = false;
        state.index = Forgiving.#CLOSE_REGEX.lastIndex;
        Forgiving.#exhaustString(string, state, context);
      }
    }
  }

  // Flesh out an html string from our tagged template function “strings” array
  //  and add special markers that we can detect later, after instantiation.
  //
  // E.g., the user might have passed this interpolation:
  //
  // <div id="foo-bar-baz" foo="${foo}" bar="${bar}" .baz="${baz}">
  //   ${content}
  // </div>
  //
  // … and we would instrument it as follows:
  //
  // <!--forgiving-next:attribute=foo,attribute=bar,attribute=baz--><div id="foo-bar-baz">
  //   <!--forgiving-content-->
  // </div>
  //
  static #createHtml(language, strings) {
    const keyToKeyState = new Map();
    const htmlStrings = [];
    const state = { inside: false, index: 0, lastOpenContext: 0, lastOpenIndex: 0 };
    // We don’t have to test the last string since it is already on the other
    //  side of the last interpolation, by definition. Hence the “- 1” below.
    //  Note that this final string is added just after the loop completes.
    for (let iii = 0; iii < strings.length - 1; iii++) {
      // The index may be set to “1” here, which indicates we are slicing off a
      //  trailing quote character from a attribute-or-property match. After
      //  slicing, we reset the index to zero so regular expressions know to
      //  match from the start in “exhaustString”.
      let string = strings[iii];
      if (state.index !== 0) {
        string = string.slice(state.index);
        state.index = 0;
      }
      Forgiving.#exhaustString(string, state, iii);
      if (state.inside) {
        Forgiving.#ATTRIBUTE_OR_PROPERTY_REGEX.lastIndex = state.index;
        const match = Forgiving.#ATTRIBUTE_OR_PROPERTY_REGEX.exec(string);
        if (match) {
          const { questions, attribute, property } = match.groups;
          if (attribute) {
            // We found a match like this: html`<div hidden="${value}"></div>`.
            //                  … or this: html`<div ?hidden="${value}"></div>`.
            //                  … or this: html`<div ??hidden="${value}"></div>`.
            // Syntax is 3-5 characters: `${questions}${attribute}="` + `"`.
            let syntax = 3;
            let kind = Forgiving.#ATTRIBUTE;
            switch (questions) {
              case '??': kind = Forgiving.#DEFINED; syntax = 5; break;
              case '?': kind = Forgiving.#BOOLEAN; syntax = 4; break;
            }
            string = string.slice(0, -syntax - attribute.length);
            const key = state.lastOpenContext;
            const keyState = Forgiving.#setIfMissing(keyToKeyState, key, () => ({ index: state.lastOpenIndex, items: [] }));
            keyState.items.push(`${kind}=${attribute}`);
          } else {
            // We found a match like this: html`<div .title="${value}"></div>`.
            // Syntax is 4 characters: `.${property}="` + `"`.
            const syntax = 4;
            const kind = Forgiving.#PROPERTY;
            string = string.slice(0, -syntax - property.length);
            const key = state.lastOpenContext;
            const keyState = Forgiving.#setIfMissing(keyToKeyState, key, () => ({ index: state.lastOpenIndex, items: [] }));
            keyState.items.push(`${kind}=${property}`);
          }
          state.index = 1; // Accounts for an expected quote character next.
        } else {
          // It’s “on or after” because interpolated JS can span multiple lines.
          const handled = [...strings.slice(0, iii), string.slice(0, state.index)].join('');
          const lineCount = handled.split('\n').length;
          throw new Error(`Found invalid template on or after line ${lineCount} in substring \`${string}\`. Failed to parse \`${string.slice(state.index)}\`.`);
        }
      } else {
        // Assume it’s a match like this: html`<div>${value}</div>`.
        string += `<!--${Forgiving.#CONTENT_MARKER}-->`;
        state.index = 0; // No characters to account for. Reset to zero.
      }
      htmlStrings[iii] = string;
    }
    // Again, there might be a quote we need to slice off here still.
    let lastString = strings.at(-1);
    if (state.index > 0) {
      lastString = lastString.slice(state.index);
    }
    htmlStrings.push(lastString);
    for (const [iii, { index, items }] of keyToKeyState.entries()) {
      const comment = `<!--${Forgiving.#NEXT_MARKER}${items.join(',')}-->`;
      const htmlString = htmlStrings[iii];
      htmlStrings[iii] = `${htmlString.slice(0, index)}${comment}${htmlString.slice(index)}`;
    }
    const html = htmlStrings.join('');
    return language === Forgiving.svg
      ? `<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`
      : html;
  }

  static #createFragment(language, strings) {
    const template = document.createElement('template');
    const html = Forgiving.#createHtml(language, strings);
    template.innerHTML = html;
    return template.content;
  }

  // Walk through our fragment that we added special markers to and notify
  //  integrator when we hit target “paths”. The integrator can use this with
  //  a subsequent clone of the fragment to establish “targets”. And, while we
  //  walk, clean up our bespoke markers.
  // Note that we are always walking the interpolated strings and the resulting,
  //  instantiated DOM _in the same depth-first manner_. This means that the
  //  ordering is fairly reliable.
  //
  // For example, we walk this structure:
  //
  // <!--forgiving-next:attribute=foo,attribute=bar,attribute=baz--><div id="foo-bar-baz">
  //   <!--forgiving-content-->
  // </div>
  //
  // And end up with this (which is ready to be injected into a container):
  //
  // <div id="foo-bar-baz">
  //   <!---->
  //   <!---->
  // </div>
  //
  static #walkFragment(
    onBoolean,
    onDefined,
    onAttribute,
    onProperty,
    onContent,
    onText,
    node,
    nodeType = Node.DOCUMENT_FRAGMENT_NODE,
    path = [],
  ) {
    // @ts-ignore — TypeScript doesn’t seem to understand the nodeType param.
    if (nodeType === Node.ELEMENT_NODE) {
      // Special case to handle elements which only allow text content (no comments).
      const { localName } = node;
      if (
        (localName === 'style' || localName === 'script') &&
        node.textContent.includes(Forgiving.#CONTENT_MARKER)
      ) {
        throw new Error(`Interpolation of "${localName}" tags is not allowed.`);
      } else if (localName === 'textarea' || localName === 'title') {
        if (node.textContent.includes(Forgiving.#CONTENT_MARKER)) {
          if (node.textContent === `<!--${Forgiving.#CONTENT_MARKER}-->`) {
            node.textContent = '';
            onText(path);
          } else {
            throw new Error(`Only basic interpolation of "${localName}" tags is allowed.`);
          }
        }
      }
    }
    if (nodeType === Node.DOCUMENT_FRAGMENT_NODE || nodeType === Node.ELEMENT_NODE) {
      // It’s expensive to make a copy of “childNodes”. Instead, we carefully
      //  manage our index as we iterate over the live collection.
      const childNodes = node.childNodes;
      for (let iii = 0; iii < childNodes.length; iii++) {
        const childNode = childNodes[iii];
        const childNodeType = childNode.nodeType;
        if (childNodeType === Node.COMMENT_NODE) {
          const textContent = childNode.textContent;
          if (textContent.startsWith(Forgiving.#CONTENT_MARKER)) {
            childNode.textContent = '';
            const startNode = document.createComment('');
            node.insertBefore(startNode, childNode);
            iii++;
            onContent([...path, iii]);
          } else if (textContent.startsWith(Forgiving.#NEXT_MARKER)) {
            const data = textContent.slice(Forgiving.#NEXT_MARKER.length);
            const items = data.split(',');
            for (const item of items) {
              const [binding, name] = item.split('=');
              switch (binding) {
                case Forgiving.#ATTRIBUTE: onAttribute(name, [...path, iii]); break;
                case Forgiving.#BOOLEAN:   onBoolean(name, [...path, iii]); break;
                case Forgiving.#DEFINED:   onDefined(name, [...path, iii]); break;
                case Forgiving.#PROPERTY:  onProperty(name, [...path, iii]); break;
              }
            }
            iii--;
            node.removeChild(childNode);
          }
        } else if (childNodeType === Node.ELEMENT_NODE) {
          Forgiving.#walkFragment(
            onBoolean,
            onDefined,
            onAttribute,
            onProperty,
            onContent,
            onText,
            childNode,
            childNodeType,
            [...path, iii],
          );
        }
      }
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

  // Languages.
  static html = 'html';
  static svg = 'svg';

  static parse(strings, onBoolean, onDefined, onAttribute, onProperty, onContent, onText, language) {
    const fragment = Forgiving.#createFragment(language, strings);
    Forgiving.#walkFragment(onBoolean, onDefined, onAttribute, onProperty, onContent, onText, fragment);
    return fragment;
  }
}
*/

// This document is a helpful summary of the spec as it relates to valid and
//  invalid character patterns in different elements and nodes:
//  https://w3c.github.io/html-reference/syntax.html
//  … WHATWG also has a helpful breakdown here:
//  https://html.spec.whatwg.org/multipage/syntax.html#elements-2

// Here is a reference of all named html entities:
//  https://html.spec.whatwg.org/multipage/named-characters.html
//  https://html.spec.whatwg.org/entities.json

// Here is a nicely-formatted list of valid HTML elements from MDN:
//  https://developer.mozilla.org/en-US/docs/Web/HTML/Element
//  … and a related WHATWG specification on the same:
//  https://html.spec.whatwg.org/multipage/indices.html

// TODO: Look into Element.setHTML, Element.getHTML, Element.setHTML.
//  ShadowRoot.setHTMLUnsafe, Document.parseHTMLUnsafe, etc.!

// TODO: Support declarative shadow roots via “shadowrootmode” on template
//  elements. We should create a shadow root on the host when instantiating a
//  template that has this attribute. See other shadow-root-init-y attrs too!
// TODO: Catch errors on “document.createElement” and provide more context. One
//  thing that can happen is a custom element violating the rules for
//  construction as laid out by the WHATWG specification:
//  https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance
//  … ugh! Seems like you cannot actually catch it though:
//  https://issues.chromium.org/issues/382473086
// TODO: Do browsers support custom element’s in document’s HEAD? Seems like it
//  would be an anti-pattern for search algorithms? If not… we could probably
//  refuse to handle elements which are _only_ meant to appear in the HEAD since
//  there ought to be no way to render them there.
// TODO: Do we need to support CDATA?
//  https://w3c.github.io/html-reference/syntax.html#cdata-sections
//  https://developer.mozilla.org/en-US/docs/Web/API/CDATASection
// TODO: Add tons of commentary for each transition. There are many, but it
//  should be possible to explain each one succinctly.
// TODO: Some of the validations around tag name, attribute name, and property
//  name are slow… should we be less strict? Is it the case that the browser
//  would throw on any of these anyhow? Could we just let that happen?
// TODO: HTML often assumed UTF-8, but JS strings (i think) are UTF-16. That
//  means we can accept UTF-16 characters and inject them as text content, 
// TODO: Come up with a way to test UTF-8 multi-byte sequence interop with
//  multi-by UTF-16 surrogate pair interop. Maybe not a problem, but it would be
//  important to know one way or the other!
// TODO: Do we need special handling of NUL character — U+0000? It is forbidden
//  in text / character data. For “permanently undefined Unicode characters”?
// TODO: Can text nodes be added in svg / math namespaces?
// TODO: Should we use setAttributeNS when in a namespace? I don’t fully
//  understand that one…
// TODO: Consider more-flexibly matching closing style / script tags and then
//  throwing if they don’t conform to what we want.
// TODO: Checkout optional newline for pre / textarea:
//  https://html.spec.whatwg.org/multipage/syntax.html#element-restrictions
// TODO: Reject trailing space on opening tag. I.e., no '<div foo ></div>'.

// TODO: May be more performant to turn sets into switches.

/** Strict HTML parser meant to handle interpolated HTML. */
class Unforgiving {
  // More performant to clone a single fragment so we just keep one around.
  static #fragment = new DocumentFragment();

  // Special keys to hang internal state off of nodes we create for performance.
  static #localName = Symbol();
  static #parentNode = Symbol();
  static #namespace = Symbol();

  // Delimiter we add to improve debugging — "${…}".
  static #delimiter = '${\u2026}';

  // Self-closing html elements.
  static #voidHtmlElements = new Set([
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'source', 'track', 'wbr',
  ]);

  // Elements we allow.
  static #allowedHtmlElements = new Set([
    // Main Root
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#main_root
    // 'html',

    // Document metadata
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#document_metadata
    // 'head', 'base', 'link', 'meta', 'title',
    'style', // deprecated, will remove in 2.x

    // Sectioning root
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#sectioning_root
    // 'body',

    // Content sectioning
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning
    'address', 'article', 'aside', 'footer', 'header',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hgroup', 'main', 'nav', 'section', 'search',

    // Text content
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#text_content
    'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr',
    'li', 'menu', 'ol', 'p', 'pre', 'ul',

    // Inline text semantics
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#inline_text_semantics
    'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em',
    'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span',
    'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',

    // Image and multimedia
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#image_and_multimedia
    'area', 'audio', 'img', 'map', 'track', 'video',

    // Embedded content
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#embedded_content
    'embed', 'fencedframe', 'iframe', 'object', 'picture', 'portal', 'source',

    // SVG and MathML (see foreign elements for these namespaces below)
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#svg_and_mathml
    'svg', 'math',

    // Scripting
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#scripting
    // 'script', 'noscript', 'canvas',

    // Demarcating edits
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#demarcating_edits
    'del', 'ins',

    // Table content
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#table_content
    'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr',

    // Forms
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#forms
    'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend',
    'meter', 'optgroup', 'option', 'output', 'progress', 'select',
    'textarea', // note that <textarea> gets some special handling though!

    // Interactive elements
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#interactive_elements
    'details', 'dialog', 'summary',

    // Web components
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#web_components
    'slot', 'template', // note that template gets special handling though!

    // Obsolete and deprecated elements
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#obsolete_and_deprecated_elements
    // 'acronym', 'big', 'center', 'content', 'dir', 'font', 'frame',
    // 'frameset', 'image', 'marquee', 'menuitem', 'nobr', 'noembed',
    // 'noframes', 'param', 'plaintext', 'rb', 'rtc', 'shadow', 'strike',
    // 'tt', 'xmp',
  ]);

  // TODO: Seems like there may be some conventions to use camelCase element
  //  names in SVG. Perhaps we can force them to be lowercase here?
  static #allowedSvgElements = new Set([
    // Animation elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#animation_elements
    // 'animate', 'animatemotion', 'animatetransform', 'mpath', 'set',

    // Basic shapes
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#basic_shapes
    'circle', 'ellipse', 'line', 'polygon', 'polyline', 'rect',

    // Container elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#container_elements
    'a', 'defs', 'g', 'marker', 'mask', 'pattern', 'svg', 'switch', 'symbol',
    // 'missing-glyph',

    // Descriptive elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#descriptive_elements
    // 'desc', 'metadata', 'title',

    // Filter primitive elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#filter_primitive_elements
    // 'feblend', 'fecolormatrix', 'fecomponenttransfer', 'fecomposite',
    // 'feconvolvematrix', 'fediffuselighting', 'fedisplacementmap',
    // 'fedropshadow', 'feflood', 'fefunca', 'fefuncb', 'fefuncg', 'fefuncr',
    // 'fegaussianblur', 'feimage', 'femerge', 'femergenode', 'femorphology',
    // 'feoffset', 'fespecularlighting', 'fetile', 'feturbulance',

    // Font elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#font_elements
    // 'font', 'font-face', 'font-face-format', 'font-face-name',
    // 'font-face-src', 'font-face-uri', 'hkern', 'vkern',

    // Gradient elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#gradient_elements
    // 'lineargradient', 'radialgradient', 'stop',

    // Graphics elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#graphics_elements
    'circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect',
    'text', 'use',

    // Graphics referencing elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#graphics_referencing_elements
    'use',

    // Light source elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#light_source_elements
    // 'fedistantlight', 'fepointlight', 'fespotlight',

    // Never-rendered elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#never-rendered_elements
    'clippath', 'defs', 'lineargradient', 'marker', 'mask', 'pattern',
    'symbol', 'title',
    // 'metadata', 'radialgradient', 'script', 'style',

    // Paint server elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#paint_server_elements
    // 'lineargradient', 'pattern', 'radialgradient',

    // Renderable elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#renderable_elements
    'a', 'circle', 'ellipse', 'foreignobject', 'g', 'image', 'line', 'path',
    'polygon', 'polyline', 'rect', 'svg', 'switch', 'symbol', 'text',
    'textpath', 'tspan', 'use',

    // Shape elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#shape_elements
    'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect',

    // Structural elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#structural_elements
    'defs', 'g', 'svg', 'symbol', 'use',

    // Text content elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#text_content_elements
    // 'glyph', 'glyphref', 'textpath', 'text', 'tref', 'tspan',

    // Text content child elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#text_content_child_elements
    // 'clippath', 'cursor', 'filter', 'foreignobject', 'script', 'style', 'view',

    // Obsolete and deprecated elements
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element#obsolete_and_deprecated_elements
    // 'cursor', 'font', 'font-face', 'font-face-format', 'font-face-name',
    // 'font-face-src', 'font-face-uri', 'glyph', 'glyphref', 'hkern',
    // 'missing-glyph', 'tref', 'vkern',
  ]);

  static #allowedMathElements = new Set([
    // Top-level elements
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element#top-level_elements
    'math',

    // Token elements
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element#token_elements
    'mi', 'mn', 'mo', 'ms', 'mspace', 'mtext',

    // General layout
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element#general_layout
    'merror', 'mfrac', 'mpadded', 'mphantom', 'mroot', 'mrow',
    'msqrt', 'mstyle',
    // 'menuclose', 'mfenced',

    // Script and limit elements
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element#script_and_limit_elements
    'mmultiscripts', 'mover', 'mprescripts', 'msub', 'msubsup', 'msup',
    'munder', 'munderover',

    // Tabular math
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element#tabular_math
    'mtable', 'mtd', 'mtr',

    // Uncategorized elements
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element#uncategorized_elements
    'annotation', 'semantics',
    // 'annotation-xml',

  ]);

  // Tag names, attributes, and properties get some additional validation.
  // static #hyphen = '-';
  // static #underscore = '_';
  // static #numbersOrHyphen = '0123456789-';
  // static #lowercaseAlpha = 'abcdefghijklmnopqrstuvwxyz';

  //////////////////////////////////////////////////////////////////////////////
  // Parsing State Values //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // These are all the states we can be in while we parse a string.
  // Reference: https://w3c.github.io/html-reference/syntax.html

  // The “initial” and “boundContent” states are special in that there is no
  // related pattern to match. Initial is just the state we start in and we only
  // find bound content at string terminals (i.e., interpolations).
  static #initial =      / /y;
  static #boundContent = / /y;

  // We restrict text to any string of characters that doesn’t cross through a
  // “<” character.
  static #unboundContent = /[^<]+/y;

  // Comments start with “<!--” and go until the next occurrence of “-->”. This
  // is the only pattern where we need to employ non-greedy matching. Note that
  // we allow the “.” to match across newlines.
  static #unboundComment = /<!--.*?-->/ys;

  // Tag names can contain the lowercase characters [a-z], [0-9], and a hyphen.
  // But, the first character must be [a-z] and the last character cannot be a
  // hyphen. The first character of the tag must directly follow the opening
  // angle bracket. The closing angle bracket of the open tag cannot be preceded
  // by a space or newline. The closing tag must not contain spaces or newlines.
  // - ok: <h6>, <my-element-1>
  // - not ok: <-div>, <1-my-element>
  static #openTagStart = /<(?![0-9-])[a-z0-9-]+(?<!-)(?=[\s\n>])/y;
  static #closeTag =   /<\/(?![0-9-])[a-z0-9-]+(?<!-)>/y;
  static #openTagSpace =   /[\s\n]+/y;
  static #openTagEnd = /(?<![\s\n])>/y;

  // Attribute names can contain the characters [a-z], [A-Z], [0-9], and a
  // hyphen. But, they cannot begin with numbers, capital letters, or hyphens —
  // and they cannot end in a hyphen.
  // - ok: x1, foo-bar, viewBox
  // - not ok: 1a, Hi, -id, title-
  static #unboundBoolean =   /(?![A-Z0-9-])[a-zA-Z0-9-]+(?<!-)(?=[\s\n>])/y;
  static #unboundAttribute = /(?![A-Z0-9-])[a-zA-Z0-9-]+(?<!-)="[^"]*"(?=[\s\n>])/y;
  static #boundBoolean =   /\?(?![A-Z0-9-])[a-zA-Z0-9-]+(?<!-)="$/y;
  static #boundDefined = /\?\?(?![A-Z0-9-])[a-zA-Z0-9-]+(?<!-)="$/y;
  static #boundAttribute =   /(?![A-Z0-9-])[a-zA-Z0-9-]+(?<!-)="$/y;

  // Property names can contain the characters [a-z], [A-Z], [0-9], and an
  // underscore. But, they cannot begin with numbers, capital letters, or
  // underscores — and they cannot end with an underscore.
  // - ok: id, className, defaultValue
  // - not ok: snake_case, YELLING, 1a, _private
  static #boundProperty = /\.(?![A-Z0-9_])[a-zA-Z0-9_]+(?<!_)="$/y;

  // We require that values bound to attributes and properties be enclosed
  // in double-quotes (see above patterns). Because interpolations delimit our
  // “strings”, we need to check that the _next_ string begins with a
  // double-quote. Note that it must precede a space or the closing angle
  // bracket of the opening tag.
  static #danglingQuote = /"(?=[\s\n>])/y;

  //////////////////////////////////////////////////////////////////////////////
  // Special Tag Patterns //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The “textarea” and “style” tags are special in that they contain so-called
  // “replaceable” and “non-replaceable” character data. In either case, we
  // must begin by treating all characters between the opening and closing tags
  // as their content. Note that we allow the “.” to match across newlines.
  static #throughStyle =    /.*?<\/style>/ys;
  static #throughTextarea = /.*?<\/textarea>/ys;

  //////////////////////////////////////////////////////////////////////////////
  // JS-y Unicode Patterns /////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // This style of entering unicode is a JS-ism. We want developers to write
  // HTML here, not JS. You can of course _interpolate_ whatever you want.
  static #rawUnicode = /[^\\]\\u/;

  //////////////////////////////////////////////////////////////////////////////
  // Character References //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Text, comments, and replaceable character data may include so-called
  // character references (or html entities). We have a couple patterns for
  // disambiguating between ambiguous ampersands and reference starts as well.
  // Note that not all of these are “sticky”.
  //
  // So-called “replaceable” character data (e.g., most content) can contain
  // character references (i.e., html entities) which need to be decoded. We
  // match such entities broadly and then require specific formatting of the
  // entity thereafter (e.g., alpha hex digits must be upper-case). Such
  // references can be “named”, “hexadecimal” code points or “decimal” code
  // points. And, for completeness, large code points can result in multiple
  // characters as replacement text.
  static #entity =           /&.*?;/ys;
  static #hexEntity =        /^&#x[0-9A-F]+;$/;
  static #decEntity =        /^&#[0-9]+;$/;
  static #htmlEntityStart =  /[^&]*&[^&\s\n<]/y;

  //////////////////////////////////////////////////////////////////////////////
  // Common Mistakes ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Mistakes that we want to specifically check for when we’re erroring-out.

  // See if weird spaces were added or if incorrect characters were used in
  // open or close tags.
  static #openTagStartMalformed = /<[\s\n]*[a-zA-Z0-9_-]+/y;
  static #openTagEndMalformed = /[\s\n]*\/?>/y;
  static #closeTagMalformed = /<[\s\n]*\/[\s\n]*[a-zA-Z0-9_-]+[\s\n]*>/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  // either unbound or bound attributes.
  static #unboundBooleanMalformed =   /[a-zA-Z0-9-_]+(?=[\s\n>])/y;
  static #unboundAttributeMalformed = /[a-zA-Z0-9-_]+=(?:"[^"]*"|'[^']*')?(?=[\s\n>])/y;
  static #boundBooleanMalformed =   /\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static #boundDefinedMalformed = /\?\?[a-zA-Z0-9-_]+=(?:"|')?$/y;
  static #boundAttributeMalformed =   /[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if incorrect characters, wrong quotes, or no quotes were used with
  // a bound property.
  static #boundPropertyMalformed = /\.[a-zA-Z0-9-_]+=(?:"|')?$/y;

  // See if the quote pair was malformed or missing.
  static #danglingQuoteMalformed = /'?(?=[\s\n>])/y;

  static #debug(value) {
    switch (value) {
      case Unforgiving.#initial:          return 'the initial';
      case Unforgiving.#unboundContent:   return 'an unbound content';
      case Unforgiving.#unboundComment:   return 'an unbound comment';
      case Unforgiving.#boundContent:     return 'a bound content';
      case Unforgiving.#openTagStart:     return 'an open tag start';
      case Unforgiving.#openTagSpace:     return 'an open tag space';
      case Unforgiving.#openTagEnd:       return 'an open tag end';
      case Unforgiving.#unboundBoolean:   return 'an unbound boolean';
      case Unforgiving.#unboundAttribute: return 'an unbound attribute';
      case Unforgiving.#boundBoolean:     return 'a bound boolean attribute';
      case Unforgiving.#boundDefined:     return 'a bound defined attribute';
      case Unforgiving.#boundAttribute:   return 'a bound attribute';
      case Unforgiving.#boundProperty:    return 'a bound property';
      case Unforgiving.#danglingQuote:    return 'a dangling quote';
      case Unforgiving.#closeTag:         return 'a close tag';

      // TODO: This is clumsy.
      case Unforgiving.#openTagStartMalformed: return [
        'a malformed open start tag — tag names must be alphanumeric,',
        'lowercase, cannot start or end with hyphens, and cannot',
        'start with a number',
      ].join(' ');
      case Unforgiving.#openTagEndMalformed: return [
        'a malformed end to an opening tag — opening tags must close without',
        'any extraneous spaces or newlines',
      ].join(' ');
      case Unforgiving.#closeTagMalformed: return [
        'a malformed close tag — close tags must not contain',
        'any extraneous spaces or newlines and tag names must be alphanumeric,',
        'lowercase, cannot start or end with hyphens, and cannot',
        'start with a number',
      ].join(' ');
      case Unforgiving.#unboundBooleanMalformed:
      case Unforgiving.#unboundAttributeMalformed:
      case Unforgiving.#boundBooleanMalformed:
      case Unforgiving.#boundDefinedMalformed:
      case Unforgiving.#boundAttributeMalformed: return [
        'a malformed attribute — attribute names must be alphanumeric',
        '(both uppercase and lowercase is allowed),',
        'must not start or end with hyphens,',
        'and cannot start with a number —',
        'and, attribute values must be enclosed in double-quotes',
      ].join(' ');
      case Unforgiving.#boundPropertyMalformed: return [
        'a malformed property — property names must be alphanumeric',
        '(both uppercase and lowercase is allowed),',
        'must not start or end with underscores,',
        'and cannot start with a number —',
        'and, property values must be enclosed in double-quotes',
      ].join(' ');
      default:
        throw new Error('FOOBAR!');
    }
  }

  static #try(string, stringIndex, ...values) {
    for (const value of values) {
      value.lastIndex = stringIndex;
      if (value.test(string)) {
        return value;
      }
    }
  }

  // This is an identical mapping for the “valid” transition, but matches more
  // forgiving patterns as error states.
  static #invalidTransition(string, stringIndex, value) {
    switch (value) {
      case Unforgiving.#initial: return Unforgiving.#try(string, stringIndex,
        /*Unforgiving.#unboundContentMalformed,*/
        Unforgiving.#openTagStartMalformed,
        /*Unforgiving.#unboundCommentMalformed*/);
      case Unforgiving.#unboundContent: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#closeTagMalformed,
        Unforgiving.#openTagStartMalformed,
        /*Unforgiving.#unboundCommentMalformed*/);
      case Unforgiving.#boundContent: return Unforgiving.#try(string, stringIndex,
        /*Unforgiving.#unboundContentMalformed,*/
        Unforgiving.#closeTagMalformed,
        Unforgiving.#openTagStartMalformed,
        /*Unforgiving.#unboundCommentMalformed*/);
      case Unforgiving.#unboundComment: return Unforgiving.#try(string, stringIndex,
        /*Unforgiving.#boundContentMalformed,*/
        /*Unforgiving.#unboundContentMalformed,*/
        Unforgiving.#closeTagMalformed,
        Unforgiving.#openTagStartMalformed,
        /*Unforgiving.#unboundCommentMalformed*/);
      case Unforgiving.#openTagStart:
      case Unforgiving.#danglingQuote:
      case Unforgiving.#unboundBoolean:
      case Unforgiving.#unboundAttribute: return Unforgiving.#try(string, stringIndex,
        /*Unforgiving.#openTagSpaceMalformed,*/
        Unforgiving.#openTagEndMalformed);
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
        /*Unforgiving.#unboundContentMalformed,*/
        Unforgiving.#closeTagMalformed,
        /*Unforgiving.#unboundCommentMalformed*/);
      case Unforgiving.#boundBoolean:
      case Unforgiving.#boundDefined:
      case Unforgiving.#boundAttribute:
      case Unforgiving.#boundProperty: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#danglingQuoteMalformed);
      case Unforgiving.#closeTag: return Unforgiving.#try(string, stringIndex,
        /*Unforgiving.#unboundContentMalformed,*/
        Unforgiving.#openTagStartMalformed,
        Unforgiving.#closeTagMalformed,
        /*Unforgiving.#unboundCommentMalformed*/);
      default:
        throw new Error('FOOBAR!');
    }
  }

  static #validTransition(string, stringIndex, value) {
    switch (value) {
      case Unforgiving.#initial: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundContent,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundComment);
      case Unforgiving.#unboundContent: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#closeTag,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundComment);
      case Unforgiving.#boundContent: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundContent,
        Unforgiving.#closeTag,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundComment);
      case Unforgiving.#unboundComment: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#boundContent,
        Unforgiving.#unboundContent,
        Unforgiving.#closeTag,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundComment);
      case Unforgiving.#openTagStart:
      case Unforgiving.#danglingQuote:
      case Unforgiving.#unboundBoolean:
      case Unforgiving.#unboundAttribute: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagSpace,
        Unforgiving.#openTagEnd);
      case Unforgiving.#openTagSpace: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundBoolean,
        Unforgiving.#unboundAttribute,
        Unforgiving.#boundBoolean,
        Unforgiving.#boundDefined,
        Unforgiving.#boundAttribute,
        Unforgiving.#boundProperty,
        Unforgiving.#openTagEnd);
      case Unforgiving.#openTagEnd: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#openTagStart,
        Unforgiving.#unboundContent,
        Unforgiving.#closeTag,
        Unforgiving.#unboundComment);
      case Unforgiving.#boundBoolean:
      case Unforgiving.#boundDefined:
      case Unforgiving.#boundAttribute:
      case Unforgiving.#boundProperty: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#danglingQuote);
      case Unforgiving.#closeTag: return Unforgiving.#try(string, stringIndex,
        Unforgiving.#unboundContent,
        Unforgiving.#openTagStart,
        Unforgiving.#closeTag,
        Unforgiving.#unboundComment);
      default:
        throw new Error('FOOBAR!');
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
    const imperfect = `${prefix.slice(prefixIndex, prefixIndex + preview)}${truncate ? '…' : ''}`;
    const perfection = prefix.slice(0, prefixIndex);
    return { imperfect, perfection };
  }

  // TODO: Should run custom messaging based on value here. Since we’re going to
  //  halt the execution anyhow, we don’t have to worry about performance.
  static #throwTransitionError(strings, stringsIndex, string, stringIndex, value) {
    const { imperfect, perfection } = Unforgiving.#getErrorInfo(strings, stringsIndex, string, stringIndex);
    const invalidValue = Unforgiving.#invalidTransition(string, stringIndex, value);
    let message;
    if (invalidValue) {
      message = [
        `Seems like you have ${Unforgiving.#debug(invalidValue)}.`,
        `See substring \`${imperfect}\`.`,
        `Your HTML was parsed through: \`${perfection}\`.`,
      ].join(' ');
    } else {
      message = [
        `Substring \`${imperfect}\` failed after ${Unforgiving.#debug(value)} state.`,
        `Your HTML was parsed through: \`${perfection}\`.`,
      ].join(' ');
    }
    throw new Error(message);
  }

  static #validateRawString(rawString) {
    if (Unforgiving.#rawUnicode.test(rawString)) {
      throw new Error('No JS unicode characters!');
    }
  }

  static #validateExit(fragment, element) {
    if (element.value !== fragment) {
      const tagName = element.value[Unforgiving.#localName];
      throw new Error(`Did you forget a closing </${tagName}>? To avoid unintended markup, non-void tags must explicitly be closed.`);
    }
  }

  // TODO: Include more context around where the malformed content lives.
  // TODO: This is maybe clumsy.
  static #replaceHtmlEntities(originalContent) {
    let content = originalContent;
    Unforgiving.#htmlEntityStart.lastIndex = 0;
    while (Unforgiving.#htmlEntityStart.test(content)) {
      const contentIndex = Unforgiving.#htmlEntityStart.lastIndex - 2;
      let characters = null;

      Unforgiving.#entity.lastIndex = contentIndex;
      if (!Unforgiving.#entity.test(content)) {
        throw new Error([
          `Seems like you have a malformed hexadecimal character reference`,
          `(html entity). You will need to fix the reference in this content`,
          `"${originalContent}".`,
        ].join(' '));
      }
      const encoded = content.slice(contentIndex, Unforgiving.#entity.lastIndex);
      if (Unforgiving.#hexEntity.test(encoded)) {
        const hexadecimalDigits = encoded.slice(3, -1);
        const number = Number(`0x${hexadecimalDigits}`);
        try {
          characters = String.fromCodePoint(number);
        } catch (cause) {
          throw new Error([
            `Seems like you have a malformed hexadecimal character reference`,
            `(html entity). You will need to fix the reference`,
            `"${encoded}".`,
          ].join(' '), { cause });
        }
      } else if (Unforgiving.#decEntity.test(encoded)) {
        const decimalDigits = encoded.slice(2, -1);
        const number = Number(decimalDigits);
        try {
          characters = String.fromCodePoint(number);
        } catch (cause) {
          throw new Error([
            `Seems like you have a malformed decimal character reference`,
            `(html entity). You will need to fix the reference`,
            `"${encoded}".`,
          ].join(' '), { cause });
        }
      } else {
        // Because named character references can be written as either a decimal
        //  or hexadecimal code points — we only support a small subset of named
        //  entities within this parser.
        switch (encoded) {
          // Special HTML characters. We always want to support these.
          case '&amp;':    characters = '\u0026'; break; // &
          case '&lt;':     characters = '\u003C'; break; // <
          case '&gt;':     characters = '\u003E'; break; // >
          case '&quot;':   characters = '\u0022'; break; // "
          case '&apos;':   characters = '\u0027'; break; // '

          // Commonly used entities. We can add / remove these as we see fit.
          case '&nbsp;':   characters = '\u00A0'; break; //  
          case '&lsquo;':  characters = '\u2018'; break; // ‘
          case '&rsquo;':  characters = '\u2019'; break; // ’
          case '&ldquo;':  characters = '\u201C'; break; // “
          case '&rdquo;':  characters = '\u201D'; break; // ”
          case '&ndash;':  characters = '\u2013'; break; // –
          case '&mdash;':  characters = '\u2014'; break; // —
          case '&hellip;': characters = '\u2026'; break; // …
          case '&bull;':   characters = '\u2022'; break; // •
          case '&middot;': characters = '\u00B7'; break; // ·
          case '&dagger;': characters = '\u2020'; break; // †

          default:
            throw new Error([
              `Seems like you have provided a named character reference`,
              `(html entity) which is not supported. You will need to redefine`,
              `this following reference as a decimal or hexadecimal number`,
              `"${encoded}".`,
            ].join(' '));
        }
      }
      content = content.replace(encoded, characters);
      Unforgiving.#htmlEntityStart.lastIndex = contentIndex + characters.length;
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
      throw new Error(`Only basic interpolation of "textarea" tags is allowed.`);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.#parentNode];
    Unforgiving.#closeTag.lastIndex = Unforgiving.#throughTextarea.lastIndex;
    return Unforgiving.#closeTag;
  }

  // Style contains so-called “non-replaceable” character data.
  static #finalizeStyle(string, path, element, childNodesIndex, nextStringIndex) {
    const closeTagLength = 8; // </style>
    Unforgiving.#throughStyle.lastIndex = nextStringIndex;
    if (Unforgiving.#throughStyle.test(string)) {
      const content = string.slice(nextStringIndex, Unforgiving.#throughStyle.lastIndex - closeTagLength);
      // TODO: The spec says this “must not” contain character references. But
      //  I think just treating them as text is OK?
      // Unforgiving.#validateNoHtmlEntities(content);
      element.value.textContent = content;
    } else {
      throw new Error(`Interpolation of "style" tags is not allowed.`);
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
    if (data.startsWith('>')) {
      throw new Error('TODO: Bad comment, message 1.');
    } else if (data.startsWith('->')) {
      throw new Error('TODO: Bad comment, message 2.');
    } else if (data.includes('--')) {
      throw new Error('TODO: Bad comment, message 3.');
    } else if (data.endsWith('-')) {
      throw new Error('TODO: Bad comment, message 3.');
    }
    element.value.appendChild(document.createComment(data));
    childNodesIndex.value += 1;
  }

  static #addBoundContent(onContent, path, element, childNodesIndex) {
    element.value.append(
      document.createComment(''),
      document.createComment(''),
    );
    childNodesIndex.value += 2;
    path.push(childNodesIndex.value);
    onContent(path);
    path.pop();
  }

  // TODO: Consider refactor so we don’t pass value in here.
  static #addBoundText(onText, string, path, element, value) {
      // If the prior match isn’t our opening tag… that’s a problem. If the next
      //  match isn’t our closing tag… that’s also a problem.
      // Because we tightly control the end-tag format, we can predict what the
      //  next string’s prefix should be.
      const localName = element.value[Unforgiving.#localName];
      if (value !== Unforgiving.#openTagEnd || !string.startsWith(`</${localName}>`)) {
        throw new Error(`Only basic interpolation of "${localName}" tags is allowed.`);
      }
      onText(path);
  }

  static #addUnboundBoolean(string, stringIndex, element, nextStringIndex) {
    const attributeName = string.slice(stringIndex, nextStringIndex);
    element.value.setAttribute(attributeName, '');
  }

  static #addUnboundAttribute(string, stringIndex, element, nextStringIndex) {
    const unboundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = unboundAttribute.indexOf('=');
    const attributeName = unboundAttribute.slice(0, equalsIndex);
    const encoded = unboundAttribute.slice(equalsIndex + 2, -1);
    const decoded = Unforgiving.#replaceHtmlEntities(encoded);
    element.value.setAttribute(attributeName, decoded);
  }

  static #addBoundBoolean(onBoolean, string, stringIndex, path, nextStringIndex) {
    const boundBoolean = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundBoolean.indexOf('=');
    const attributeName = boundBoolean.slice(1, equalsIndex);
    onBoolean(attributeName, path);
  }

  static #addBoundDefined(onDefined, string, stringIndex, path, nextStringIndex) {
    const boundDefined = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundDefined.indexOf('=');
    const attributeName = boundDefined.slice(2, equalsIndex);
    onDefined(attributeName, path);
  }

  static #addBoundAttribute(onAttribute, string, stringIndex, path, nextStringIndex) {
    const boundAttribute = string.slice(stringIndex, nextStringIndex);
    const equalsIndex = boundAttribute.indexOf('=');
    const attributeName = boundAttribute.slice(0, equalsIndex);
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
          throw new Error(`The <${tagName}> html element is forbidden.`);
        }
        break;
      case Unforgiving.svg:
        if (!Unforgiving.#allowedSvgElements.has(tagName)) {
          throw new Error(`The <${tagName}> svg element is forbidden.`);
        }
        break;
      case Unforgiving.math:
        if (!Unforgiving.#allowedMathElements.has(tagName)) {
          throw new Error(`The <${tagName}> math element is forbidden.`);
        }
        break;
    }
  }

  static #addElement(string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const prefixedTagName = string.slice(stringIndex, nextStringIndex);
    const tagName = prefixedTagName.slice(1);
    const currentNamespace = element.value[Unforgiving.#namespace];
    Unforgiving.#validateTagName(currentNamespace, tagName);
    let namespace;
    switch (tagName) {
      case 'svg':  namespace = Unforgiving.svg; break;
      case 'math': namespace = Unforgiving.math; break;
      default:     namespace = currentNamespace; break;
    }
    const childNode = document.createElementNS(namespace, tagName);
    // TODO: Consider “shadowrootmode” attribute on template as well.
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

  static #createShadowRoot(element, childNodesIndex) {
    const mode = element.value.getAttribute('shadowrootmode');
    const clonable = element.value.hasAttribute('shadowrootclonable');
    const delegatesFocus = element.value.hasAttribute('shadowrootdelegatesfocus');
    const serializable = element.value.hasAttribute('shadowrootserializable');
    const parentNode = element.value[Unforgiving.#parentNode];
    parentNode.attachShadow({ mode, clonable, delegatesFocus, serializable });

  }

  static #finalizeElement(strings, stringsIndex, string, stringIndex, path, element, childNodesIndex, nextStringIndex) {
    const closeTag = string.slice(stringIndex, nextStringIndex);
    const tagName = closeTag.slice(2, -1);
    const expectedTagName = element.value[Unforgiving.#localName];
    if (tagName !== expectedTagName) {
      const { perfection } = Unforgiving.#getErrorInfo(strings, stringsIndex, string, stringIndex);
      const message = [
        `Closing tag "${tagName}" does not match "${expectedTagName}".`,
        `Your HTML was parsed through: \`${perfection}\`.`,
      ].join(' ');
      throw new Error(message);
    }
    childNodesIndex.value = path.pop();
    element.value = element.value[Unforgiving.#parentNode];
  }

  static #hasWarnedAboutStyleDeprecation = false;
  static #styleDeprecationWarning() {
    if (!Unforgiving.#hasWarnedAboutStyleDeprecation) {
      Unforgiving.#hasWarnedAboutStyleDeprecation = true;
      const error = new Error('Support for the "style" tag is deprecated and will be removed in future versions.');
      console.warn(error); // eslint-disable-line no-console
    }
  }

  // Namespaces.
  static html = 'http://www.w3.org/1999/xhtml';
  static svg = 'http://www.w3.org/2000/svg';
  static math = 'http://www.w3.org/1998/Math/MathML';

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
              Unforgiving.#addBoundText(onText, string, path, element, value);
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
            Unforgiving.#addBoundBoolean(onBoolean, string, stringIndex, path, nextStringIndex);
            break;
          case Unforgiving.#boundDefined:
            Unforgiving.#addBoundDefined(onDefined, string, stringIndex, path, nextStringIndex);
            break;
          case Unforgiving.#boundAttribute:
            Unforgiving.#addBoundAttribute(onAttribute, string, stringIndex, path, nextStringIndex);
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
                Unforgiving.#styleDeprecationWarning();
                value = Unforgiving.#finalizeStyle(string, path, element, childNodesIndex, nextStringIndex);
                nextStringIndex = value.lastIndex;
              } else if (
                tagName === 'textarea' &&
                Unforgiving.#openTagEnd.lastIndex !== string.length
              ) {
                value = Unforgiving.#finalizeTextarea(string, path, element, childNodesIndex, nextStringIndex);
                nextStringIndex = value.lastIndex;
              } else if (
                tagName === 'template' &&
                // @ts-ignore — TypeScript doesn’t get that this is a “template”.
                element.value.hasAttribute('shadowrootmode') // TODO: Likely non-performant.
              ) {
                throw new Error('Declarative shadow roots are not yet supported.');
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
    svg: TemplateEngine.svg,

    // Deprecated interface.
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

  /**
   * Declare SVG markup to be interpolated.
   * ```js
   * svg`<circle r="${obj.r}" cx="${obj.cx}" cy="${obj.cy}"></div>`;
   * ```
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

  static #removeWithin(node) {
    let childNode = node.lastChild;
    while (childNode) {
      const nextChildNode = childNode.previousSibling;
      node.removeChild(childNode);
      childNode = nextChildNode;
    }
  }

  static #removeBetween(startNode, node, parentNode) {
    parentNode ??= node.parentNode;
    let childNode = node.previousSibling;
    while(childNode !== startNode) {
      const nextChildNode = childNode.previousSibling;
      parentNode.removeChild(childNode);
      childNode = nextChildNode;
    }
  }

  static #removeThrough(startNode, node, parentNode) {
    parentNode ??= node.parentNode;
    TemplateEngine.#removeBetween(startNode, node, parentNode);
    parentNode.removeChild(startNode);
    parentNode.removeChild(node);
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
export const svg = TemplateEngine.interface.svg.bind(TemplateEngine);

// Deprecated interface.
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
