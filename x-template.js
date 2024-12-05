/** Internal implementation details for template engine. */
class TemplateEngine {
  // Special markers added to markup enabling discovery post-instantiation.
  static #NEXT_MARKER = 'x-element-next:'; // The ":" helps for debugging.
  static #CONTENT_MARKER = 'x-element-content';

  // Types of bindings that we can have.
  static #ATTRIBUTE = 'attribute';
  static #BOOLEAN = 'boolean';
  static #DEFINED = 'defined';
  static #PROPERTY = 'property';
  static #CONTENT = 'content';
  static #TEXT = 'text';

  // Patterns to find special edges in original html strings.
  static #OPEN_REGEX = /<[a-z][a-z0-9-]*(?=\s)/g;
  static #STEP_REGEX = /(?:\s+[a-z][a-z0-9-]*(?=[\s>])|\s+[a-z][a-zA-Z0-9-]*="[^"]*")+/y;
  static #ATTRIBUTE_OR_PROPERTY_REGEX = /\s+(?:(?<questions>\?{0,2})?(?<attribute>([a-z][a-zA-Z0-9-]*))|\.(?<property>[a-z][a-zA-Z0-9_]*))="$/y;
  static #CLOSE_REGEX = />/g;

  // Sentinel to hold raw result language. Also leveraged to determine whether a
  //  value is a raw result or not. Template engine supports html and svg.
  static #HTML = 'html';
  static #SVG = 'svg';

  // Sentinel to hold internal result information. Also leveraged to determine
  //  whether a value is a raw result or not.
  static #ANALYSIS = Symbol();

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

  // Walk through each string from our tagged template function “strings” array
  //  in a stateful way so that we know what kind of bindings are implied at
  //  each interpolated value.
  static #exhaustString(string, state, context) {
    if (!state.inside) {
      // We're outside the opening tag.
      TemplateEngine.#OPEN_REGEX.lastIndex = state.index;
      const openMatch = TemplateEngine.#OPEN_REGEX.exec(string);
      if (openMatch) {
        state.inside = true;
        state.index = TemplateEngine.#OPEN_REGEX.lastIndex;
        state.lastOpenContext = context;
        state.lastOpenIndex = openMatch.index;
        TemplateEngine.#exhaustString(string, state, context);
      }
    } else {
      // We're inside the opening tag.
      TemplateEngine.#STEP_REGEX.lastIndex = state.index;
      if (TemplateEngine.#STEP_REGEX.test(string)) {
        state.index = TemplateEngine.#STEP_REGEX.lastIndex;
      }
      TemplateEngine.#CLOSE_REGEX.lastIndex = state.index;
      if (TemplateEngine.#CLOSE_REGEX.test(string)) {
        state.inside = false;
        state.index = TemplateEngine.#CLOSE_REGEX.lastIndex;
        TemplateEngine.#exhaustString(string, state, context);
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
  // <!--x-element-next:attribute=foo,attribute=bar,attribute=baz--><div id="foo-bar-baz">
  //   <!--x-element-content-->
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
      TemplateEngine.#exhaustString(string, state, iii);
      if (state.inside) {
        TemplateEngine.#ATTRIBUTE_OR_PROPERTY_REGEX.lastIndex = state.index;
        const match = TemplateEngine.#ATTRIBUTE_OR_PROPERTY_REGEX.exec(string);
        if (match) {
          const { questions, attribute, property } = match.groups;
          if (attribute) {
            // We found a match like this: html`<div hidden="${value}"></div>`.
            //                  … or this: html`<div ?hidden="${value}"></div>`.
            //                  … or this: html`<div ??hidden="${value}"></div>`.
            // Syntax is 3-5 characters: `${questions}${attribute}="` + `"`.
            let syntax = 3;
            let kind = TemplateEngine.#ATTRIBUTE;
            switch (questions) {
              case '??': kind = TemplateEngine.#DEFINED; syntax = 5; break;
              case '?': kind = TemplateEngine.#BOOLEAN; syntax = 4; break;
            }
            string = string.slice(0, -syntax - attribute.length);
            const key = state.lastOpenContext;
            const keyState = TemplateEngine.#setIfMissing(keyToKeyState, key, () => ({ index: state.lastOpenIndex, items: [] }));
            keyState.items.push(`${kind}=${attribute}`);
          } else {
            // We found a match like this: html`<div .title="${value}"></div>`.
            // Syntax is 4 characters: `.${property}="` + `"`.
            const syntax = 4;
            const kind = TemplateEngine.#PROPERTY;
            string = string.slice(0, -syntax - property.length);
            const key = state.lastOpenContext;
            const keyState = TemplateEngine.#setIfMissing(keyToKeyState, key, () => ({ index: state.lastOpenIndex, items: [] }));
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
        string += `<!--${TemplateEngine.#CONTENT_MARKER}-->`;
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
      const comment = `<!--${TemplateEngine.#NEXT_MARKER}${items.join(',')}-->`;
      const htmlString = htmlStrings[iii];
      htmlStrings[iii] = `${htmlString.slice(0, index)}${comment}${htmlString.slice(index)}`;
    }
    const html = htmlStrings.join('');
    return language === TemplateEngine.#SVG
      ? `<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`
      : html;
  }

  static #createFragment(language, strings) {
    const template = document.createElement('template');
    const html = TemplateEngine.#createHtml(language, strings);
    template.innerHTML = html;
    return template.content;
  }

  // Walk through our fragment that we added special markers to and collect
  //  paths to each future target. We use “paths” because each future instance
  //  will clone this fragment and so paths are all we can really cache. And,
  //  while we go through, clean up our bespoke markers.
  // Note that we are always walking the interpolated strings and the resulting,
  //  instantiated DOM _in the same depth-first manner_. This means that the
  //  ordering is fairly reliable.
  //
  // For example, we walk this structure:
  //
  // <!--x-element-next:attribute=foo,attribute=bar,attribute=baz--><div id="foo-bar-baz">
  //   <!--x-element-content-->
  // </div>
  //
  // And end up with this (which is ready to be injected into a container):
  //
  // <div id="foo-bar-baz">
  //   <!---->
  //   <!---->
  // </div>
  //
  static #findLookups(node, nodeType = Node.DOCUMENT_FRAGMENT_NODE, lookups = [], path = []) {
    // @ts-ignore — TypeScript doesn’t seem to understand the nodeType param.
    if (nodeType === Node.ELEMENT_NODE) {
      // Special case to handle elements which only allow text content (no comments).
      const { localName } = node;
      if (
        (localName === 'style' || localName === 'script') &&
        node.textContent.includes(TemplateEngine.#CONTENT_MARKER)
      ) {
        throw new Error(`Interpolation of "${localName}" tags is not allowed.`);
      } else if (localName === 'textarea' || localName === 'title') {
        if (node.textContent.includes(TemplateEngine.#CONTENT_MARKER)) {
          if (node.textContent === `<!--${TemplateEngine.#CONTENT_MARKER}-->`) {
            node.textContent = '';
            lookups.push({ path, binding: TemplateEngine.#TEXT });
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
          if (textContent.startsWith(TemplateEngine.#CONTENT_MARKER)) {
            childNode.textContent = '';
            const startNode = document.createComment('');
            node.insertBefore(startNode, childNode);
            iii++;
            lookups.push({ path: [...path, iii], binding: TemplateEngine.#CONTENT });
          } else if (textContent.startsWith(TemplateEngine.#NEXT_MARKER)) {
            const data = textContent.slice(TemplateEngine.#NEXT_MARKER.length);
            const items = data.split(',');
            for (const item of items) {
              const [binding, name] = item.split('=');
              lookups.push({ path: [...path, iii], binding, name });
            }
            iii--;
            node.removeChild(childNode);
          }
        } else if (childNodeType === Node.ELEMENT_NODE) {
          TemplateEngine.#findLookups(childNode, childNodeType, lookups, [...path, iii]);
        }
      }
    }
    if (nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      return lookups;
    }
  }

  // After cloning our common fragment, we use the “lookups” to cache live
  //  references to DOM nodes so that we can surgically perform updates later in
  //  an efficient manner. Lookups are like directions to find our real targets.
  // As a performance boost, we pre-bind references so that the interface is
  //  just a simple function call when we need to bind new values.
  static #findTargets(fragment, lookups) {
    const targets = [];
    const cache = new Map();
    const find = path => {
      let node = fragment;
      for (const index of path) {
        // eslint-disable-next-line no-loop-func
        node = TemplateEngine.#setIfMissing(cache, node, () => node.childNodes)[index];
      }
      return node;
    };
    for (const { path, binding, name } of lookups) {
      const node = find(path);
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
        if (arrayState.map.has(id)) {
          const item = arrayState.map.get(id);
          if (!TemplateEngine.#canReuseDom(item.preparedResult, rawResult)) {
            // Add new comment cursors before removing old comment cursors.
            const cursors = TemplateEngine.#createCursors(item.startNode);
            TemplateEngine.#removeThrough(item.startNode, item.node);
            const preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
            item.preparedResult = preparedResult;
            item.startNode = cursors.startNode;
            item.node = cursors.node;
          } else {
            TemplateEngine.#update(item.preparedResult, rawResult);
          }
        } else {
          const cursors = TemplateEngine.#createCursors(node);
          const preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
          const item = { id, preparedResult, ...cursors };
          arrayState.map.set(id, item);
        }
        const item = arrayState.map.get(id);
        const referenceNode = lastItem ? lastItem.node.nextSibling : startNode.nextSibling;
        if (referenceNode !== item.startNode) {
          const nodesToMove = [item.startNode];
          while (nodesToMove[nodesToMove.length - 1] !== item.node) {
            nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
          }
          TemplateEngine.#insertAllBefore(referenceNode.parentNode, referenceNode, nodesToMove);
        }
        lastItem = item;
        index++;
      }
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

  // Inject a given result into a node for the first time.
  static #inject(rawResult, node, before) {
    // Get fragment created from a tagged template function’s “strings”.
    const { [TemplateEngine.#ANALYSIS]: analysis } = rawResult;
    const language = analysis.language;
    const fragment = analysis.fragment.cloneNode(true);
    const targets = TemplateEngine.#findTargets(fragment, analysis.lookups);
    const preparedResult = { rawResult, fragment, targets };

    // Bind values via our live targets into our disconnected DOM.
    TemplateEngine.#commit(preparedResult);

    // Attach a document fragment into the node. Note that all the DOM in the
    //  fragment will already have values correctly committed on the line above.
    const nodes = language === TemplateEngine.#SVG
      ? fragment.firstChild.childNodes
      : fragment.childNodes;
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
      const fragment = TemplateEngine.#createFragment(language, strings);
      const lookups = TemplateEngine.#findLookups(fragment);
      analysis.language = language;
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
    // Iterate backwards over the live node collection since we’re mutating it.
    const childNodes = node.childNodes;
    for (let iii = childNodes.length - 1; iii >= 0; iii--) {
      node.removeChild(childNodes[iii]);
    }
  }

  static #removeBetween(startNode, node) {
    while(node.previousSibling !== startNode) {
      node.previousSibling.remove();
    }
  }

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
