import { XParser } from './x-parser.js';

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

  // Sentinel to initialize the “last values” array.
  static #UNSET = Symbol();

  // Sentinels to manage internal state on nodes.
  static #STATE = Symbol();
  static #ARRAY_STATE = Symbol();

  // It’s more performant to clone a single fragment, so we keep a reference.
  static #fragment = new DocumentFragment();

  // We decode character references via “setHTMLUnsafe” on this container.
  static #htmlEntityContainer = document.createElement('template');

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
    ifDefined: TemplateEngine.#interfaceDeprecated('ifDefined', TemplateEngine.ifDefined),
    repeat: TemplateEngine.#interfaceDeprecated('repeat', TemplateEngine.repeat),
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
    return TemplateEngine.#createRawResult(strings, values);
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
   * Shim for prior "repeat" function. Use native entries array.
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


  // We only decode things we know to be encoded since it’s non-performant.
  static #decode(encoded) {
    this.#htmlEntityContainer.setHTMLUnsafe(encoded);
    const decoded = this.#htmlEntityContainer.content.textContent;
    return decoded;
  }

  // Walk over a pre-validated set of tokens from our parser. Note that because
  //  the parser is _very_ strict, we can make a lot of simplifying assumptions.
  static #onToken(
    // These areguments are passed in through a “bind”.
    state, onBoolean, onDefined, onAttribute, onProperty, onContent, onText,
    // These arguments are passed in through the “onToken” callback.
    type, index, start, end, substring
  ) {
    switch (type) {
      case XParser.tokenTypes.startTagName: {
        const tagName = substring;
        const childNode = globalThis.document.createElement(tagName);
        state.tagName === 'template'
          // @ts-ignore — TypeScript doesn’t get that this is a template.
          ? state.element.content.appendChild(childNode)
          : state.element.appendChild(childNode);
        state.parentElements.push(state.element);
        state.parentTagNames.push(state.tagName);
        state.element = childNode;
        state.tagName = tagName;
        state.childNodesIndex += 1;
        state.path.push(state.childNodesIndex);
        break;
      }
      case XParser.tokenTypes.voidTagClose:
        state.element = state.parentElements.pop();
        state.tagName = state.parentTagNames.pop();
        state.childNodesIndex = state.path.pop();
        break;
      case XParser.tokenTypes.startTagClose:
        // Assume we’re traversing into the new element and reset index.
        state.childNodesIndex = -1;
        break;
      case XParser.tokenTypes.endTagName:
        state.childNodesIndex = state.path.pop();
        state.element = state.parentElements.pop();
        state.tagName = state.parentTagNames.pop();
        break;
      case XParser.tokenTypes.attributeName:
      case XParser.tokenTypes.boundAttributeName:
      case XParser.tokenTypes.boundBooleanName:
      case XParser.tokenTypes.boundDefinedName:
      case XParser.tokenTypes.boundPropertyName:
        state.name = substring;
        break;
      case XParser.tokenTypes.booleanName: {
        // @ts-ignore — TypeScript doesn’t get that this is an element.
        state.element.setAttribute(substring, '');
        break;
      }
      case XParser.tokenTypes.comment:
        state.element.appendChild(document.createComment(substring));
        state.childNodesIndex += 1;
        break;
      case XParser.tokenTypes.textPlaintext:
      case XParser.tokenTypes.attributeValuePlaintext:
        state.text += substring;
        break;
      case XParser.tokenTypes.textReference:
      case XParser.tokenTypes.attributeValueReference:
        state.text += substring;
        state.encoded = true;
        break;
      case XParser.tokenTypes.textEnd: {
        const decoded = state.encoded ? TemplateEngine.#decode(state.text) : state.text;
        if (
          state.tagName === 'pre' &&
          state.childNodesIndex === -1 &&
          decoded.startsWith('\n')
        ) {
          // First newline is stripped according to the <pre> tag specification.
          //  https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
          state.element.appendChild(document.createTextNode(decoded.slice(1)));
        } else {
          state.element.appendChild(document.createTextNode(decoded));
        }
        state.childNodesIndex += 1;
        state.encoded = false;
        state.text = '';
        break;
      }
      case XParser.tokenTypes.attributeValueEnd: {
        const decoded = state.encoded ? TemplateEngine.#decode(state.text) : state.text;
        // @ts-ignore — TypeScript doesn’t get that this is an element.
        state.element.setAttribute(state.name, decoded);
        state.name = null;
        state.encoded = false;
        state.text = '';
        break;
      }
      case XParser.tokenTypes.boundTextValue:
        onText(state.path);
        break;
      case XParser.tokenTypes.boundContentValue:
        // @ts-ignore — TypeScript doesn’t get that this is an element.
        state.element.append(document.createComment(''), document.createComment(''));
        state.childNodesIndex += 2;
        state.path.push(state.childNodesIndex);
        onContent(state.path);
        state.path.pop();
        break;
      case XParser.tokenTypes.boundAttributeValue:
        onAttribute(state.name, state.path);
        state.name = null;
        break;
      case XParser.tokenTypes.boundBooleanValue:
        onBoolean(state.name, state.path);
        state.name = null;
        break;
      case XParser.tokenTypes.boundDefinedValue:
        onDefined(state.name, state.path);
        state.name = null;
        break;
      case XParser.tokenTypes.boundPropertyValue:
        onProperty(state.name, state.path);
        state.name = null;
        break;
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

  // TODO: #254: Use new “moveBefore” when available with cross-browser support.
  //  This enables us to preserve things like animations and prevent node
  //  disconnects. See https://chromestatus.com/feature/5135990159835136
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
      // TODO: Can we refactor this all into a _single_ loop? Right now, we do
      //  the following:
      //  1. Loop once to add new things.
      //  2. Loop a second time to remove old things.
      //  3. Loop a third time to reorder (if we have a mapping).

      // A mapping has already been created — we need to update the items.
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
        index++;
      }
      for (const [id, item] of arrayState.map.entries()) {
        if (!ids.has(id)) {
          TemplateEngine.#removeThrough(item.startNode, item.node);
          arrayState.map.delete(id);
        }
      }
      let lastItem;
      for (const id of ids) {
        const item = arrayState.map.get(id);
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
      }
    }
  }

  static #commitAttribute(node, name, value, lastValue) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      // If there’s an update, it _has_ to be #ifDefined at this point.
      const lastUpdate = TemplateEngine.#symbolToUpdate.get(lastValue);
      TemplateEngine.#ifDefined(node, name, update.value, lastUpdate?.value);
    } else {
      node.setAttribute(name, value);
    }
  }

  static #commitBoolean(node, name, value) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      TemplateEngine.#throwIfDefinedError(TemplateEngine.#BOOLEAN);
    } else {
      value ? node.setAttribute(name, '') : node.removeAttribute(name);
    }
  }

  static #commitDefined(node, name, value) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      TemplateEngine.#throwIfDefinedError(TemplateEngine.#DEFINED);
    } else {
      value === undefined || value === null
        ? node.removeAttribute(name)
        : node.setAttribute(name, value);
    }
  }

  static #commitProperty(node, name, value) {
    const update = TemplateEngine.#symbolToUpdate.get(value);
    if (update) {
      TemplateEngine.#throwIfDefinedError(TemplateEngine.#PROPERTY);
    } else {
      node[name] = value;
    }
  }

  // TODO: Future state here once “ifDefined” is gone.
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

  static #commitContent(node, startNode, value, lastValue) {
    const category = TemplateEngine.#getCategory(value);
    const lastCategory = TemplateEngine.#getCategory(lastValue);
    if (category !== lastCategory && lastValue !== TemplateEngine.#UNSET) {
      // Reset content under certain conditions. E.g., `map` >> `null`.
      const state = TemplateEngine.#getState(node, TemplateEngine.#STATE);
      const arrayState = TemplateEngine.#getState(startNode, TemplateEngine.#ARRAY_STATE);
      TemplateEngine.#removeBetween(startNode, node);
      TemplateEngine.#clearObject(state);
      TemplateEngine.#clearObject(arrayState);
    }
    if (category === 'result') {
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
    } else if (category === 'array' || category === 'map') {
      TemplateEngine.#list(node, startNode, value, category);
    } else if (category === 'fragment') {
      if (value.childElementCount === 0) {
        throw new Error(`Unexpected child element count of zero for given DocumentFragment.`);
      }
      const previousSibling = node.previousSibling;
      if (previousSibling !== startNode) {
        TemplateEngine.#removeBetween(startNode, node);
      }
      node.parentNode.insertBefore(value, node);
    } else {
      // TODO: Is there a way to more-performantly skip this init step? E.g., if
      //  the prior value here was not “unset” and we didn’t just reset? We
      //  could cache the target node in these cases or something?
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

  static #commitText(node, value) {
    node.textContent = value;
  }

  // Bind the current values from a result by walking through each target and
  //  updating the DOM if things have changed.
  static #commit(preparedResult) {
    preparedResult.values ??= preparedResult.rawResult.values;
    preparedResult.lastValues ??= preparedResult.values.map(() => TemplateEngine.#UNSET);
    const { targets, values, lastValues } = preparedResult;
    for (let iii = 0; iii < targets.length; iii++) {
      const value = values[iii];
      const lastValue = lastValues[iii];
      if (value !== lastValue) {
        const target = targets[iii];
        target(value, lastValue);
      }
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

  static #createRawResult(strings, values) {
    const analysis = TemplateEngine.#setIfMissing(TemplateEngine.#stringsToAnalysis, strings, () => ({}));
    if (!analysis.done) {
      const fragment = TemplateEngine.#fragment.cloneNode(false);
      const state = {
        path: [],
        parentElements: [],
        parentTagNames: [],
        element: fragment,
        tagName: null,
        childNodesIndex: -1,
        encoded: false,
        text: '',
        name: null,
      };
      const lookups = {};
      const onBoolean = TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#BOOLEAN);
      const onDefined = TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#DEFINED);
      const onAttribute = TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#ATTRIBUTE);
      const onProperty =  TemplateEngine.#storeKeyLookup.bind(null, lookups, TemplateEngine.#PROPERTY);
      const onContent = TemplateEngine.#storeContentLookup.bind(null, lookups);
      const onText = TemplateEngine.#storeTextLookup.bind(null, lookups);
      const onToken = TemplateEngine.#onToken.bind(null, state, onBoolean, onDefined, onAttribute, onProperty, onContent, onText);
      XParser.parse(strings, onToken);
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

  static #getCategory(value) {
    if (typeof value === 'object') {
      if (TemplateEngine.#isRawResult(value)) {
        return 'result';
      } else if (Array.isArray(value)) {
        return Array.isArray(value[0]) ? 'map' : 'array';
      } else if (value instanceof DocumentFragment) {
        return 'fragment';
      }
    }
  }

  static #throwIfDefinedError(binding) {
    throw new Error(`The ifDefined update must be used on ${TemplateEngine.#getBindingText(TemplateEngine.#ATTRIBUTE)}, not on ${TemplateEngine.#getBindingText(binding)}.`);
  }

  static #canReuseDom(preparedResult, rawResult) {
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
}

// Long-term interface.
export const render = TemplateEngine.interface.render.bind(TemplateEngine);
export const html = TemplateEngine.interface.html.bind(TemplateEngine);

// Deprecated interface.
export const ifDefined = TemplateEngine.interface.ifDefined.bind(TemplateEngine);
export const repeat = TemplateEngine.interface.repeat.bind(TemplateEngine);
