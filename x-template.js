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

  /**
   * Default template engine interface — what you get inside “template”.
   * @type {{[key: string]: (...args: unknown[]) => unknown}}
   */
  static interface = Object.freeze({
    render: TemplateEngine.render,
    html: TemplateEngine.html,
  });

  /**
   * Declare HTML markup to be interpolated.
   * ```js
   * html`<div attr="${obj.attr}" .prop="${obj.prop}">${obj.content}</div>`;
   * ```
   * @param {string[]} strings
   * @param {unknown[]} values
   * @returns {unknown}
   */
  static html(strings, ...values) {
    return TemplateEngine.#createRawResult(strings, values);
  }

  /**
   * Core rendering entry point for x-element template engine.
   * Accepts a "container" element and renders the given "raw result" into it.
   * @param {HTMLElement} container
   * @param {unknown} rawResult
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

  // We only decode things we know to be encoded since it’s non-performant.
  static #decode(encoded) {
    TemplateEngine.#htmlEntityContainer.setHTMLUnsafe(encoded);
    const decoded = TemplateEngine.#htmlEntityContainer.content.textContent;
    return decoded;
  }

  // Walk over a pre-validated set of tokens from our parser. Note that because
  //  the parser is _very_ strict, we can make a lot of simplifying assumptions.
  static #onToken(
    // These arguments are passed in through a “bind”.
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

  static #commitAttribute(node, name, value) {
    node.setAttribute(name, value);
  }
  static #commitBoolean(node, name, value) {
    value ? node.setAttribute(name, '') : node.removeAttribute(name);
  }
  static #commitDefined(node, name, value) {
    value === undefined || value === null
      ? node.removeAttribute(name)
      : node.setAttribute(name, value);
  }
  static #commitProperty(node, name, value) {
    node[name] = value;
  }

  static #commitContentResultValue(node, startNode, value) {
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
  }

  // Validates array value and returns a “rawResult”.
  static #parseArrayValue(value, index) {
    // Values should look like "<raw result>".
    const rawResult = value;
    if (!TemplateEngine.#isRawResult(rawResult)) {
      throw new Error(`Unexpected non-template value found in array item at ${index} "${rawResult}".`);
    }
    return rawResult;
  }

  // Validates array entry and returns an “id” and a “rawResult”.
  static #parseArrayEntry(entry, index, ids) {
    // Entries should look like "[<key>, <raw result>]".
    if (entry.length !== 2) {
      throw new Error(`Unexpected entry length found in map entry at ${index} with length "${entry.length}".`);
    }
    const [id, rawResult] = entry;
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

  // Helper to create / insert “cursors” in managed array of nodes.
  static #createArrayItem(node, id, rawResult) {
    const cursors = TemplateEngine.#createCursors(node);
    const preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
    return { id, preparedResult, ...cursors };
  }

  // Helper to destroy, create, and replace “cursors” in managed array of nodes.
  static #recreateArrayItem(item, rawResult) {
    // Add new comment cursors before removing old comment cursors.
    const cursors = TemplateEngine.#createCursors(item.startNode);
    TemplateEngine.#removeThrough(item.startNode, item.node);
    item.preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
    item.startNode = cursors.startNode;
    item.node = cursors.node;
  }

  // Loops over given array of “values” to manage an array of nodes.
  static #commitContentArrayValues(node, startNode, values) {
    const arrayState = TemplateEngine.#getState(startNode, TemplateEngine.#ARRAY_STATE);
    if (!arrayState.map) {
      // There is no mapping in our state — create an empty one as our base.
      TemplateEngine.#clearObject(arrayState);
      arrayState.map = new Map();
    }

    if (values.length > 0 && arrayState.map.size > 0) {
      // Update existing values.
      for (let index = 0; index < Math.min(arrayState.map.size, values.length); index++) {
        const id = String(index);
        const value = values[index];
        const rawResult = TemplateEngine.#parseArrayValue(value, index);
        const item = arrayState.map.get(id);
        if (!TemplateEngine.#canReuseDom(item.preparedResult, rawResult)) {
          TemplateEngine.#recreateArrayItem(item, rawResult);
        } else {
          TemplateEngine.#update(item.preparedResult, rawResult);
        }
      }
    }

    if (values.length > arrayState.map.size) {
      // Add new values.
      for (let index = arrayState.map.size; index < values.length; index++) {
        const id = String(index);
        const value = values[index];
        const rawResult = TemplateEngine.#parseArrayValue(value, index);
        const item = TemplateEngine.#createArrayItem(node, id, rawResult);
        arrayState.map.set(id, item);
      }
    }

    if (arrayState.map.size > values.length) {
      // Delete removed values.
      const index = values.length;
      const id = String(index);
      const item = arrayState.map.get(id);
      TemplateEngine.#removeBetween(item.startNode, node);
      item.startNode.remove();
      for (let iii = arrayState.map.size - 1; iii >= values.length; iii--) {
        // We iterate backwards since we are deleting keys from the map itself.
        arrayState.map.delete(String(iii));
      }
    }
  }

  // Loops over given array of “entries” to manage an array of nodes.
  static #commitContentArrayEntries(node, startNode, entries) {
    const arrayState = TemplateEngine.#getState(startNode, TemplateEngine.#ARRAY_STATE);
    if (!arrayState.map) {
      // There is no mapping in our state — create an empty one as our base.
      TemplateEngine.#clearObject(arrayState);
      arrayState.map = new Map();
    }

    // A mapping has already been created — we need to update the items.
    const ids = new Set(); // Populated in “parseListValue”.
    let index = 0;
    for (const entry of entries) {
      const [id, rawResult] = TemplateEngine.#parseArrayEntry(entry, index, ids);
      let item = arrayState.map.get(id);
      if (item) {
        if (!TemplateEngine.#canReuseDom(item.preparedResult, rawResult)) {
          TemplateEngine.#recreateArrayItem(item, rawResult);
        } else {
          TemplateEngine.#update(item.preparedResult, rawResult);
        }
      } else {
        item = TemplateEngine.#createArrayItem(node, id, rawResult);
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
      const referenceNode = lastItem ? lastItem.node.nextSibling : startNode.nextSibling;
      if (referenceNode !== item.startNode) {
        const nodesToMove = [item.startNode];
        while (nodesToMove[nodesToMove.length - 1] !== item.node) {
          nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
        }
        TemplateEngine.#insertAllBefore(referenceNode.parentNode, referenceNode, nodesToMove);
      }
      lastItem = item;
    }
  }

  // TODO: #254: Future state where the “moveBefore” API is better-supported.
  // // Loops over given array of “entries” to manage an array of nodes.
  // static #commitContentArrayEntries(node, startNode, entries) {
  //   const arrayState = TemplateEngine.#getState(startNode, TemplateEngine.#ARRAY_STATE);
  //   if (!arrayState.map) {
  //     // There is no mapping in our state — create an empty one as our base.
  //     TemplateEngine.#clearObject(arrayState);
  //     arrayState.map = new Map();
  //   }
  //
  //   const idsToRemove = new Set(arrayState.map.keys());
  //   const ids = new Set(); // Populated in “parseArrayEntry”.
  //   let reference = startNode.nextSibling;
  //   for (let index = 0; index < entries.length; index++) {
  //     const entry = entries[index];
  //     const [id, rawResult] = TemplateEngine.#parseArrayEntry(entry, index, ids);
  //     let item = arrayState.map.get(id);
  //     if (item) {
  //       // Update existing item.
  //       idsToRemove.delete(id);
  //       if (!TemplateEngine.#canReuseDom(item.preparedResult, rawResult)) {
  //         const referenceWasStartNode = reference === item.startNode;
  //         TemplateEngine.#recreateArrayItem(item, rawResult);
  //         reference = referenceWasStartNode ? item.startNode : reference;
  //       } else {
  //         TemplateEngine.#update(item.preparedResult, rawResult);
  //       }
  //     } else {
  //       // Create new item.
  //       item = TemplateEngine.#createArrayItem(node, id, rawResult);
  //       arrayState.map.set(id, item);
  //     }
  //     // Move to the correct location
  //     if (item.startNode !== reference) {
  //       const nodesToMove = [item.startNode];
  //       while (nodesToMove[nodesToMove.length - 1] !== item.node) {
  //         nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
  //       }
  //       TemplateEngine.#moveAllBefore(reference.parentNode, reference, nodesToMove);
  //     }
  //
  //     // Move our position forward.
  //     reference = item.node.nextSibling;
  //   }
  //
  //   // Remove any ids which are not longer in the entries.
  //   for (const id of idsToRemove) {
  //     const item = arrayState.map.get(id);
  //     TemplateEngine.#removeThrough(item.startNode, item.node);
  //     arrayState.map.delete(id);
  //   }
  // }

  static #commitContentFragmentValue(node, startNode, value) {
    const previousSibling = node.previousSibling;
    if (previousSibling !== startNode) {
      TemplateEngine.#removeBetween(startNode, node);
    }
    node.parentNode.insertBefore(value, node);
  }

  static #commitContentTextValue(node, startNode, value) {
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
    switch (category) {
      case 'result':    TemplateEngine.#commitContentResultValue(node, startNode, value);    break;
      case 'array':     TemplateEngine.#commitContentArrayValues(node, startNode, value);    break;
      case 'map':       TemplateEngine.#commitContentArrayEntries(node, startNode, value);   break;
      case 'fragment':  TemplateEngine.#commitContentFragmentValue(node, startNode, value);  break;
      default:          TemplateEngine.#commitContentTextValue(node, startNode, value);      break;
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

  // TODO: #254: Future state when we leverage “moveBefore”.
  // static #moveAllBefore(parentNode, referenceNode, nodes) {
  //   // Iterate backwards over the live node collection since we’re mutating it.
  //   // Note that passing “null” as the reference node moves nodes to the end.
  //   for (let iii = nodes.length - 1; iii >= 0; iii--) {
  //     const node = nodes[iii];
  //     parentNode.moveBefore(node, referenceNode);
  //     referenceNode = node;
  //   }
  // }

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
    node.replaceChildren();
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
}

export const render = TemplateEngine.interface.render.bind(TemplateEngine);
export const html = TemplateEngine.interface.html.bind(TemplateEngine);
