// TODO: The `XParser` interface now requires instantiation.

// This is just kept here as an example alternative to our more “unforgiving”
//  parsing solution. In particular, it could be interesting to try and keep the
//  interfaces to both “forgiving” and “unforgiving” as similar as possible to
//  enable us to show performance-testing deltas in the future.
/** Forgiving HTML parser which leverages innerHTML. */
export default class Forgiving {
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
        throw new Error(`Interpolation of <${localName}> tags is not allowed.`);
      } else if (localName === 'textarea' || localName === 'title') {
        if (node.textContent.includes(Forgiving.#CONTENT_MARKER)) {
          if (node.textContent === `<!--${Forgiving.#CONTENT_MARKER}-->`) {
            node.textContent = '';
            onText(path);
          } else {
            throw new Error(`Only basic interpolation of <${localName}> tags is allowed.`);
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
