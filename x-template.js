import { XParser } from './x-parser.js';

/** Internal implementation details for template engine. */
class TemplateEngine {
  /** @typedef {string | null} TagName */

  /**
   * @typedef {object} LookupValue
   * @property {string} binding
   * @property {string} name
   */

  /**
   * @typedef {object} Lookups
   * @property {LookupValue[]} [values]
   * @property {[number, Lookups][]} [map]
   */

  /** @typedef {(value: unknown, lastValue: unknown) => void} CommitTarget */

  /**
   * @typedef {object} PreparedResult
   * @property {any} rawResult
   * @property {DocumentFragment} fragment
   * @property {CommitTarget[]} targets
   * @property {unknown[]} values
   * @property {unknown[]} lastValues
   */

  /**
   * @typedef {object} ArrayItem
   * @property {string} id
   * @property {PreparedResult} preparedResult
   * @property {Comment} startNode
   * @property {Comment} node
   */

  /**
   * @typedef {object} OnTokenState
   * @property {number[]} path
   * @property {(DocumentFragment | Element)[]} parentElements
   * @property {TagName[]} parentTagNames
   * @property {DocumentFragment | Element} element
   * @property {TagName} tagName
   * @property {number} childNodesIndex
   * @property {boolean} encoded
   * @property {string} text
   * @property {string} name
   */

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

  // Inert document used during template analysis to avoid triggering custom
  //  element constructors when building the template fragment.
  static #document = document.implementation.createHTMLDocument('');

  // It's more performant to clone a single fragment, so we keep a reference.
  static #fragment = TemplateEngine.#document.createDocumentFragment();

  // We decode character references via “setHTMLUnsafe” on this container.
  static #htmlEntityContainer = TemplateEngine.#document.createElement('template');

  /** @type {WeakMap<object, any>} Mapping of tagged template function “strings” to cached computations. */
  static #stringsToAnalysis = new WeakMap();

  /**
   * Default template engine interface — what you get inside “template”.
   * @type {{ render: (container: HTMLElement, rawResult: unknown) => void, html: (strings: TemplateStringsArray, ...values: unknown[]) => unknown }}
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
   * @param {TemplateStringsArray} strings
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

  /**
   * We only decode things we know to be encoded since it’s non-performant.
   * @param {string} encoded
   * @returns {string}
   */
  static #decode(encoded) {
    TemplateEngine.#htmlEntityContainer.setHTMLUnsafe(encoded);
    return TemplateEngine.#htmlEntityContainer.content.textContent;
  }

  /**
   * Walk over a pre-validated set of tokens from our parser. Note that because
   *  the parser is _very_ strict, we can make a lot of simplifying assumptions.
   * @param {OnTokenState} state
   * @param {(name: string, path: number[]) => void} onBoolean
   * @param {(name: string, path: number[]) => void} onDefined
   * @param {(name: string, path: number[]) => void} onAttribute
   * @param {(name: string, path: number[]) => void} onProperty
   * @param {(path: number[]) => void} onContent
   * @param {(path: number[]) => void} onText
   * @param {string} type
   * @param {number} index
   * @param {number} start
   * @param {number} end
   * @param {string} substring
   */
  static #onToken(
    // These arguments are passed in through a “bind”.
    state, onBoolean, onDefined, onAttribute, onProperty, onContent, onText,
    // These arguments are passed in through the “onToken” callback.
    type, index, start, end, substring
  ) {
    switch (type) {
      case XParser.tokenTypes.startTagName: {
        const tagName = substring;
        const childNode = TemplateEngine.#document.createElement(tagName);
        state.tagName === 'template'
          // @ts-expect-error — TS doesn’t get that this is a template.
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
        // Parser guarantees these arrays are non-empty at this point.
        state.element = /** @type {DocumentFragment | Element} */ (state.parentElements.pop());
        state.tagName = /** @type {TagName} */ (state.parentTagNames.pop());
        state.childNodesIndex = /** @type {number} */ (state.path.pop());
        break;
      case XParser.tokenTypes.startTagClose:
        // Assume we’re traversing into the new element and reset index.
        state.childNodesIndex = -1;
        break;
      case XParser.tokenTypes.endTagName:
        // Parser guarantees these arrays are non-empty at this point.
        state.childNodesIndex = /** @type {number} */ (state.path.pop());
        state.element = /** @type {DocumentFragment | Element} */ (state.parentElements.pop());
        state.tagName = /** @type {TagName} */ (state.parentTagNames.pop());
        break;
      case XParser.tokenTypes.attributeName:
      case XParser.tokenTypes.boundAttributeName:
      case XParser.tokenTypes.boundBooleanName:
      case XParser.tokenTypes.boundDefinedName:
      case XParser.tokenTypes.boundPropertyName:
        state.name = substring;
        break;
      case XParser.tokenTypes.booleanName: {
        // @ts-expect-error — TS doesn’t get that this is an element.
        state.element.setAttribute(substring, '');
        break;
      }
      case XParser.tokenTypes.comment:
        state.element.appendChild(TemplateEngine.#document.createComment(substring));
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
          state.element.appendChild(TemplateEngine.#document.createTextNode(decoded.slice(1)));
        } else {
          state.element.appendChild(TemplateEngine.#document.createTextNode(decoded));
        }
        state.childNodesIndex += 1;
        state.encoded = false;
        state.text = '';
        break;
      }
      case XParser.tokenTypes.attributeValueEnd: {
        const decoded = state.encoded ? TemplateEngine.#decode(state.text) : state.text;
        // @ts-expect-error — TS doesn’t get that this is an element.
        state.element.setAttribute(state.name, decoded);
        state.name = '';
        state.encoded = false;
        state.text = '';
        break;
      }
      case XParser.tokenTypes.boundTextValue:
        onText(state.path);
        break;
      case XParser.tokenTypes.boundContentValue:
        state.element.append(TemplateEngine.#document.createComment(''), TemplateEngine.#document.createComment(''));
        state.childNodesIndex += 2;
        state.path.push(state.childNodesIndex);
        onContent(state.path);
        state.path.pop();
        break;
      case XParser.tokenTypes.boundAttributeValue:
        onAttribute(state.name, state.path);
        state.name = '';
        break;
      case XParser.tokenTypes.boundBooleanValue:
        onBoolean(state.name, state.path);
        state.name = '';
        break;
      case XParser.tokenTypes.boundDefinedValue:
        onDefined(state.name, state.path);
        state.name = '';
        break;
      case XParser.tokenTypes.boundPropertyValue:
        onProperty(state.name, state.path);
        state.name = '';
        break;
    }
  }

  /**
   * After cloning our common fragment, we use the “lookups” to cache live
   *  references to DOM nodes so that we can surgically perform updates later in
   *  an efficient manner. Lookups are like directions to find our real targets.
   * As a performance boost, we pre-bind references so that the interface is
   *  just a simple function call when we need to bind new values.
   * @param {any} node
   * @param {Lookups} lookups
   * @param {CommitTarget[]} [targets]
   * @returns {CommitTarget[]}
   */
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

  /**
   * @param {Element} node
   * @param {string} name
   * @param {any} value
   */
  static #commitAttribute(node, name, value) {
    node.setAttribute(name, value);
  }

  /**
   * @param {Element} node
   * @param {string} name
   * @param {any} value
   */
  static #commitBoolean(node, name, value) {
    value ? node.setAttribute(name, '') : node.removeAttribute(name);
  }

  /**
   * @param {Element} node
   * @param {string} name
   * @param {any} value
   */
  static #commitDefined(node, name, value) {
    value === undefined || value === null
      ? node.removeAttribute(name)
      : node.setAttribute(name, value);
  }

  /**
   * @param {any} node
   * @param {string} name
   * @param {any} value
   */
  static #commitProperty(node, name, value) {
    node[name] = value;
  }

  /**
   * @param {Comment} node
   * @param {Comment} startNode
   * @param {any} value
   */
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

  /**
   * Validates array value and returns a “rawResult”.
   * @param {any} value
   * @param {number} index
   * @returns {any}
   */
  static #parseArrayValue(value, index) {
    // Values should look like "<raw result>".
    const rawResult = value;
    if (!TemplateEngine.#isRawResult(rawResult)) {
      throw new Error(`Unexpected non-template value found in array item at ${index} "${rawResult}".`);
    }
    return rawResult;
  }

  /**
   * Validates array entry and returns an “id” and a “rawResult”.
   * @param {any} entry
   * @param {number} index
   * @param {Set<string>} ids
   * @returns {[string, any]}
   */
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

  /**
   * Helper to create / insert “cursors” in managed array of nodes.
   * @param {Comment} node
   * @param {string} id
   * @param {any} rawResult
   * @returns {ArrayItem}
   */
  static #createArrayItem(node, id, rawResult) {
    const cursors = TemplateEngine.#createCursors(node);
    const preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
    return { id, preparedResult, ...cursors };
  }

  /**
   * Helper to destroy, create, and replace “cursors” in managed array of nodes.
   * @param {ArrayItem} item
   * @param {object} rawResult
   */
  static #recreateArrayItem(item, rawResult) {
    // Add new comment cursors before removing old comment cursors.
    const cursors = TemplateEngine.#createCursors(item.startNode);
    TemplateEngine.#removeThrough(item.startNode, item.node);
    item.preparedResult = TemplateEngine.#inject(rawResult, cursors.node, true);
    item.startNode = cursors.startNode;
    item.node = cursors.node;
  }

  /**
   * Loops over given array of “values” to manage an array of nodes.
   * @param {Comment} node
   * @param {Comment} startNode
   * @param {any[]} values
   */
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

  /**
   * Loops over given array of “entries” to manage an array of nodes.
   * @param {Comment} node
   * @param {Comment} startNode
   * @param {Iterable<any>} entries
   */
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

  /**
   * @param {Comment} node
   * @param {Comment} startNode
   * @param {DocumentFragment} value
   */
  static #commitContentFragmentValue(node, startNode, value) {
    const previousSibling = node.previousSibling;
    if (previousSibling !== startNode) {
      TemplateEngine.#removeBetween(startNode, node);
    }
    // @ts-expect-error — TS doesn’t know parentNode is non-null.
    node.parentNode.insertBefore(value, node);
  }

  /**
   * @param {Comment} node
   * @param {Comment} startNode
   * @param {any} value
   */
  static #commitContentTextValue(node, startNode, value) {
      // TODO: Is there a way to more-performantly skip this init step? E.g., if
      //  the prior value here was not “unset” and we didn’t just reset? We
      //  could cache the target node in these cases or something?
      const previousSibling = node.previousSibling;
      if (previousSibling === startNode) {
        // The `?? ''` is a shortcut for creating a text node and then
        //  setting its textContent. It’s exactly equivalent to the
        //  following code, but faster.
        // const textNode = ownerDocument.createTextNode('');
        // textNode.textContent = value;
        const textNode = node.ownerDocument.createTextNode(value ?? '');
        // @ts-expect-error — TS doesn’t know parentNode is non-null.
        node.parentNode.insertBefore(textNode, node);
      } else {
        // @ts-expect-error — TS doesn’t know previousSibling is non-null.
        previousSibling.textContent = value;
      }
  }

  /**
   * @param {Comment} node
   * @param {Comment} startNode
   * @param {any} value
   * @param {any} lastValue
   */
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

  /**
   * @param {Node} node
   * @param {any} value
   */
  static #commitText(node, value) {
    node.textContent = value;
  }

  /**
   * Bind the current values from a result by walking through each target and
   *  updating the DOM if things have changed.
   * @param {PreparedResult} preparedResult
   */
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

  static #textValue = { binding: TemplateEngine.#TEXT, name: '' };
  /**
   * @param {Lookups} lookups
   * @param {number[]} path
   */
  static #storeTextLookup(lookups, path) {
    const value = TemplateEngine.#textValue;
    TemplateEngine.#storeLookup(lookups, value, path);
  }

  static #contentValue = { binding: TemplateEngine.#CONTENT, name: '' };
  /**
   * @param {Lookups} lookups
   * @param {number[]} path
   */
  static #storeContentLookup(lookups, path) {
    const value = TemplateEngine.#contentValue;
    TemplateEngine.#storeLookup(lookups, value, path);
  }

  /**
   * @param {Lookups} lookups
   * @param {string} binding
   * @param {string} name
   * @param {number[]} path
   */
  static #storeKeyLookup(lookups, binding, name, path) {
    const value = { binding, name };
    TemplateEngine.#storeLookup(lookups, value, path);
  }

  // TODO: This function is a bit of a performance bottleneck. It starts from
  //  the top of the object each time because it wants to avoid creating paths
  //  that do not end in bindings… However, then we have to do a lot of checking
  //  perhaps there’s a better way!
  /**
   * @param {Lookups} lookups
   * @param {LookupValue} value
   * @param {number[]} path
   */
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

  /**
   * Inject a given result into a node for the first time.
   * @param {any} rawResult
   * @param {any} node
   * @param {boolean} [before]
   * @returns {PreparedResult}
   */
  static #inject(rawResult, node, before) {
    // Create and prepare a document fragment to be injected.
    const { [TemplateEngine.#ANALYSIS]: analysis } = rawResult;
    const fragment = node.ownerDocument.importNode(analysis.fragment, true);
    const targets = TemplateEngine.#findTargets(fragment, analysis.lookups);
    const preparedResult = { rawResult, fragment, targets };

    // Bind values via our live targets into our disconnected DOM.
    // @ts-expect-error — TS doesn’t know preparedResult is lazily completed.
    TemplateEngine.#commit(preparedResult);

    // Attach a document fragment into the node. Note that all the DOM in the
    //  fragment will already have values correctly committed on the line above.
    const nodes = fragment.childNodes;
    before
      ? TemplateEngine.#insertAllBefore(node.parentNode, node, nodes)
      : TemplateEngine.#insertAllBefore(node, null, nodes);

    // @ts-expect-error — TS doesn’t know preparedResult is lazily completed.
    return preparedResult;
  }

  /**
   * @param {PreparedResult} preparedResult
   * @param {any} rawResult
   */
  static #update(preparedResult, rawResult) {
    preparedResult.lastValues = preparedResult.values;
    preparedResult.values = rawResult.values;
    TemplateEngine.#commit(preparedResult);
  }

  /**
   * @param {TemplateStringsArray} strings
   * @param {unknown[]} values
   * @returns {any}
   */
  static #createRawResult(strings, values) {
    const analysis = TemplateEngine.#setIfMissing(TemplateEngine.#stringsToAnalysis, strings, () => ({}));
    if (!analysis.done) {
      // We know we will always get a DocumentFragment from cloneNode here.
      const fragment = /** @type {DocumentFragment} */ (TemplateEngine.#fragment.cloneNode(false));
      const state = /** @type {OnTokenState} */ ({
        path: [],
        parentElements: [],
        parentTagNames: [],
        element: fragment,
        tagName: null,
        childNodesIndex: -1,
        encoded: false,
        text: '',
        name: '',
      });
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

  /**
   * @param {any} value
   * @returns {boolean}
   */
  static #isRawResult(value) {
    return !!value?.[TemplateEngine.#ANALYSIS];
  }

  /**
   * @param {any} value
   * @returns {string | undefined}
   */
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

  /**
   * @param {PreparedResult | undefined} preparedResult
   * @param {any} rawResult
   * @returns {boolean}
   */
  static #canReuseDom(preparedResult, rawResult) {
    return preparedResult?.rawResult.strings === rawResult?.strings;
  }

  /**
   * @param {Comment} referenceNode
   * @returns {{ startNode: Comment, node: Comment }}
   */
  static #createCursors(referenceNode) {
    const startNode = referenceNode.ownerDocument.createComment('');
    const node = referenceNode.ownerDocument.createComment('');
    // @ts-expect-error — TS doesn’t know parentNode is non-null.
    referenceNode.parentNode.insertBefore(startNode, referenceNode);
    // @ts-expect-error — TS doesn’t know parentNode is non-null.
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

  /**
   * @param {Node} parentNode
   * @param {Node | null} referenceNode
   * @param {NodeListOf<ChildNode> | Node[]} nodes
   */
  static #insertAllBefore(parentNode, referenceNode, nodes) {
    // Iterate backwards over the live node collection since we’re mutating it.
    // Note that passing “null” as the reference node appends nodes to the end.
    for (let iii = nodes.length - 1; iii >= 0; iii--) {
      const node = nodes[iii];
      parentNode.insertBefore(node, referenceNode);
      referenceNode = node;
    }
  }

  /** @param {Element | DocumentFragment} node */
  static #removeWithin(node) {
    node.replaceChildren();
  }

  /**
   * @param {Comment} startNode
   * @param {Comment} node
   */
  static #removeBetween(startNode, node) {
    while(node.previousSibling !== startNode) {
      // @ts-expect-error — TS doesn’t know previousSibling is non-null.
      node.previousSibling.remove();
    }
  }

  /**
   * @param {Comment} startNode
   * @param {Comment} node
   */
  static #removeThrough(startNode, node) {
    TemplateEngine.#removeBetween(startNode, node);
    startNode.remove();
    node.remove();
  }

  /** @param {Record<string, any>} object */
  static #clearObject(object) {
    for (const key of Object.keys(object)) {
      delete object[key];
    }
  }

  // TODO: Replace with Map.prototype.getOrInsert when TC39 proposal lands.
  //  https://github.com/tc39/proposal-upsert
  /**
   * @param {WeakMap<object, any>} map
   * @param {object} key
   * @param {() => any} callback
   * @returns {any}
   */
  static #setIfMissing(map, key, callback) {
    // Values set in this file are ALL truthy, so "get" is used (versus "has").
    let value = map.get(key);
    if (!value) {
      value = callback();
      map.set(key, value);
    }
    return value;
  }

  /**
   * @param {any} object
   * @param {symbol} key
   * @returns {Record<string, any>}
   */
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
