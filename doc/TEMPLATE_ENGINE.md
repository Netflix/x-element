# Template Engine

Heads up! This is an **advanced topic** aimed at developers looking to deepen
their understanding of html templating or folks looking to contribute to the
`x-element` template engine.

Still here? Great! Here’s a rundown of what this document covers:

1. What is an html template engine, anyways?
2. So, how do you go about building one?

What you _won’t_ see in this document is any real mention of Custom Elements /
Web Components. That’s because from the perspective of markup… custom elements
_are just plain html_! So, there’s nothing _special_ a template engine really
needs to do with respect to custom elements.

## What is an html template engine, anyways?

An html template engine allows developers to ergonomically create dynamic web
applications — plain and simple.

One way to accomplish this would be to create an entire html document in a
server by injecting dynamically-fetched data into a specialized template file.
This is what [jinja](https://jinja.palletsprojects.com/) is used for (among many
other things) and it has a Python-adjacent DSL to accomplish this. In general,
the formula looks like `x.html.jinja + data = x.html`.

Another approach is to _dynamically_ manage the DOM. In this case, the desired
result would be a _modification_ to the living DOM. That looks more like
`render(container, template + data)`. In a way, it’s a _dom template engine_.
Moving forward, we’ll just call it a “template engine”.

## So, how do you go about building one?

Well… let’s try it! In general, there are three concepts to consider: template
definition, data hydration, and result rendering. In particular, the desired
interface ought to be something like:

```js
render(container, html`<div>markup</div> + <div>${data}</div>`);
```

Let’s try and design an engine that exposes an `html` and a `render` function
which help us express how we want to merge markup with data. We’ll target the
following _integration_ for the rest of this document

```js
// Import the template engine.
const { html, render } = engine;

// Pick a container to render DOM in.
const container = document.body;

// Set up our application state.
const data = {
  label: 'My TODOs',
  selected: 0,
  items: [
    { label: 'walk the dog', description: '…' },
    { label: 'document template engine', description: '…' },
    { label: 'water the plants', description: '…' },
  ],
};

// Derive rendering-specific information from our state.
const label = data.label;
const items = data.items;
const selectedItem = data.items[data.selected];

// Interpolate our template with our state idiomatically.
const result = html`
  <main id="container">
    <custom-badge .active="${!!selectedItem}"></custom-badge>
    <section>
      <h1>${data.label}</h1>
      <menu>
        ${data.items.map((item, index) => {
          return html`
            <li data-selected="${index === data.selected}">${item.label}</li>
          `;
        })}
      </menu>
    </section>
    ${
      data.items[data.selected]
        ? html`
          <section>
            <h2>${data.items[data.selected].label}</h2>
            <p>${data.items[data.selected].description}</p>
          </section>
        `
        : null
    }
  </main>
`;

// Finally, we perform the update.
render(container, result);
```

### Iteration 1 — a first crack

```js
// Recursively create html by joining strings with values.
function createHtml(result) {
  const { strings, values } = result;
  let html = '';
  for (let iii = 0; iii < strings.length; iii++) {
    const string = strings[iii];
    const value = values[iii];
    html += string;
    if (Array.isArray(value)) {
      html += value.map(subValue => createHtml(subValue)).join('');
    } else if (value?.strings && value?.values) {
      html += createHtml(value);
    } else {
      html += value ?? '';
    }
  }
  return html;
}

// Tagged template function for idiomatic interpolation.
function html(strings, ...values) {
  return { strings, values };
}

// Renderer to update DOM in the desired container.
const render = (container, result) => {
  container.innerHTML = createHtml(result);
};

export { html, render };
```

For ~30 lines of code, that actually does a whole lot! Let’s enumerate what this
currently _does_ and _doesn’t_ do…

**What it does**

* It’s got the right functional interface (i.e., `html` and `render`).
* Hydration is idiomatic JS.
* It’s composable — i.e., you can nest, loop, etc.
* Content can be interpolated between tags (e.g., text in a paragraph).
* Attributes can be interpolated inside opening tags (e.g., flag on an item).

**What it doesn’t do**

* It doesn’t actually understand html. †
* You can only bind attributes — the `.` and `?` from our DSL don’t work. ††
* Nothing is cached and the DOM is thrashed. †††
* Some scripted implementation details leaking. ††††
* Change-by-value detection. †††††

† This has broad implications — including unsafe injection of strings.<br>
†† This is prevents us from using typed properties and boolean attributes.<br>
††† For each update, markup is re-computed, re-parsed, and replaced.<br>
†††† The `html` result should be opaque. It’s of no concern to integrators.<br>
††††† Any update will always cause everything to update.

### Iteration 2 — understanding html and properties

Our `html` tagged template function has the _right name_, but all it really does
is concatenate a series of strings. The `render` function just resets the
content of the container by fully replacing it’s `innerHTML` string. So, room
for improvement! Let‘s try to make this more _html-aware_.

```js
// Patterns to find special edges in original html strings.
const ATTRIBUTE_STRING_REGEX = /(.*) ([a-z-]+)="$/s;
const BOOLEAN_ATTRIBUTE_STRING_REGEX = /(.*) \?([a-z-]+)="$/s;
const PROPERTY_STRING_REGEX = /(.*) .([a-zA-Z]+)="$/s;

// Create html from strings and add some breadcrumbs.
function createHtml(strings) {
  let html = '';
  for (let iii = 0; iii < strings.length; iii++) {
    const string = strings[iii];
    const attributeMatch = string.match(ATTRIBUTE_STRING_REGEX);
    const booleanAttributeMatch =
      string.match(BOOLEAN_ATTRIBUTE_STRING_REGEX);
    const propertyMatch = string.match(PROPERTY_STRING_REGEX);
    if (attributeMatch) {
      const prefix = attributeMatch[1];
      const key = attributeMatch[2];
      html += `${prefix} ^${iii}="${key}`;
    } else if (booleanAttributeMatch) {
      const prefix = booleanAttributeMatch[1];
      const key = booleanAttributeMatch[2];
      html += `${prefix} ^?${iii}="${key}`;
    } else if (propertyMatch) {
      const prefix = propertyMatch[1];
      const key = propertyMatch[2];
      html += `${prefix} ^.${iii}="${key}`;
    } else if (iii < strings.length - 1) {
      html += `${string}<!--^${iii}--><!--$${iii}-->`;
    } else {
      html += string;
    }
  }
  return html;
}

// Instantiate a fragment by setting innerHTML.
function createFragment(strings) {
  const template = document.createElement('template');
  template.innerHTML = createHtml(strings);
  return template.content;
}

// Walk a fragment to get live node references.
function findTargets(fragment, targets = []) {
  for (const node of fragment.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        for (const attribute of [...node.attributes]) {
          if (attribute.name.match(/^\^(\d+)$/)) {
            node.removeAttribute(attribute.name);
            targets.push({ type: 'attribute', name: attribute.value, node });
          } else if (attribute.name.match(/^\^\?(\d+)$/)) {
            node.removeAttribute(attribute.name);
            targets.push({ type: 'boolean-attribute', name: attribute.value, node });
          } else if (attribute.name.match(/^\^\.(\d+)$/)) {
            node.removeAttribute(attribute.name);
            targets.push({ type: 'property', name: attribute.value, node });
          }
        }
        findTargets(node, targets);
        break;
      case Node.COMMENT_NODE: {
        if (node.textContent.match(/^\^(\d+)$/)) {
          node.textContent = '';
          node.nextSibling.textContent = '';
          targets.push({ type: 'content', node, endNode: node.nextSibling });
        }
        break;
      }
    }
  }
  return targets;
}

// Commit a value change to a DOM node attribute.
function commitAttribute(node, name, value) {
  node.setAttribute(name, value ?? '');
}

// Commit a boolean value change to a DOM node attribute.
function commitBooleanAttribute(node, name, value) {
  if (value) {
    node.setAttribute(name, '');
  } else {
    node.removeAttribute(name);
  }
}

// Commit a value change to a DOM node property.
function commitProperty(node, name, value) {
  node[name] = value; // To preserve type, no coalescing!
}

// Commit a value change to the content of a DOM node.
function commitContent(node, endNode, value) {
  if (Array.isArray(value)) {
    for (let jjj = 0; jjj < value.length; jjj++) {
      const subValue = value[jjj];
      commit(node, endNode, subValue);
    }
  } else if (value?.strings && value?.values) {
    commit(node, endNode, value);
  } else {
    const textNode = document.createTextNode(value ?? '');
    node.parentNode.insertBefore(textNode, endNode);
  }
}

// Walk through live nodes and commit value changes.
function commit(node, endNode, result) {
  const { strings, values } = result;
  const fragment = createFragment(strings);
  const targets = findTargets(fragment);
  if (endNode) {
    node.parentNode.insertBefore(fragment, endNode);
  } else {
    node.appendChild(fragment);
  }
  for (let iii = 0; iii < values.length; iii++) {
    const target = targets[iii];
    const value = values[iii];
    switch (target.type) {
      case 'attribute':
        commitAttribute(target.node, target.name, value);
        break;
      case 'boolean-attribute':
        commitBooleanAttribute(target.node, target.name, value);
        break;
      case 'property':
        commitProperty(target.node, target.name, value);
        break;
      case 'content':
        commitContent(target.node, target.endNode, value);
        break;
    }
  }
}

// Tagged template function for idiomatic interpolation.
function html(strings, ...values) {
  return { strings, values };
}

// Renderer to update DOM in the desired container.
const render = (container, result) => {
  container.textContent = '';
  commit(container, null, result);
};

export { html, render };
```

Up to ~150 lines of code now… but let’s check out our new pros / cons list.

**What it does**

* It’s got the right functional interface (i.e., `html` and `render`).
* Hydration is idiomatic JS.
* It’s composable — i.e., you can nest, loop, etc.
* Content can be interpolated between tags (e.g., text in a paragraph).
* Attributes can be interpolated inside opening tags (e.g., flag on an item).
* **It understands html.**
* **Boolean attributes and properties work via `.` / `?` DSL.**

**What it doesn’t do**

* Nothing is cached and the DOM is thrashed.
* Some scripted implementation details leaking.
* Change-by-value detection.
* **Some markup abstractions are leaking.** †
* **Many edge cases are not considered.** ††

† Internal comment like `<!---->` now exist.<br>
†† The `textarea` tag will not do what you want, list handling is brittle, etc.

### Iteration 3 — caching in and tightening up

So far, we’ve done a good job making it _ergonomic_ to interpolate data into our
markup in a declarative manner. But that’s really just half the battle — the
other half is to _performantly update_ the DOM that needs to be updated. The
prior example just deletes all the DOM and starts each time anew. While clearly
bad for performance, it would also break most real-world applications which rely
on the persistence of elements (form state, animations, internal state, etc.).

Let’s change our library so that it _updates_ (versus replaces) the DOM it’s
managing.


```js
// Patterns to find special edges in original html strings.
const ATTRIBUTE_STRING_REGEX = /(.*) ([a-z-]+)="$/s;
const BOOLEAN_ATTRIBUTE_STRING_REGEX = /(.*) \?([a-z-]+)="$/s;
const PROPERTY_STRING_REGEX = /(.*) .([a-zA-Z]+)="$/s;

// Sentinel for previously unset value.
const UNSET = Symbol('__unset__');

// Mapping of tagged template function “strings” to cached computations.
const stringsToFragment = new WeakMap();

// Mapping of container node references to live node references.
const nodeToContainerState = new WeakMap();

// Mapping of comments which indicate the beginning of a list.
const nodeToArrayState = new WeakMap();

// Mapping of opaque references to internal result objects.
const symbolToResult = new WeakMap();

// Create html from strings and add some breadcrumbs.
function createHtml(strings) {
  let html = '';
  for (let iii = 0; iii < strings.length; iii++) {
    const string = strings[iii];
    const attributeMatch = string.match(ATTRIBUTE_STRING_REGEX);
    const booleanAttributeMatch =
      string.match(BOOLEAN_ATTRIBUTE_STRING_REGEX);
    const propertyMatch = string.match(PROPERTY_STRING_REGEX);
    if (attributeMatch) {
      const prefix = attributeMatch[1];
      const key = attributeMatch[2];
      html += `${prefix} ^${iii}="${key}`;
    } else if (booleanAttributeMatch) {
      const prefix = booleanAttributeMatch[1];
      const key = booleanAttributeMatch[2];
      html += `${prefix} ^?${iii}="${key}`;
    } else if (propertyMatch) {
      const prefix = propertyMatch[1];
      const key = propertyMatch[2];
      html += `${prefix} ^.${iii}="${key}`;
    } else if (iii < strings.length - 1) {
      html += `${string}<!--^${iii}--><!--$${iii}-->`;
    } else {
      html += string;
    }
  }
  return html;
}

// Instantiate a fragment by setting innerHTML.
function createFragment(strings) {
  const template = document.createElement('template');
  template.innerHTML = createHtml(strings);
  return template.content;
}

// Walk a fragment to get live node references.
function findTargets(fragment, targets = []) {
  for (const node of fragment.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        for (const attribute of [...node.attributes]) {
          if (attribute.name.match(/^\^(\d+)$/)) {
            node.removeAttribute(attribute.name);
            targets.push({ type: 'attribute', name: attribute.value, node });
          } else if (attribute.name.match(/^\^\?(\d+)$/)) {
            node.removeAttribute(attribute.name);
            targets.push({ type: 'boolean-attribute', name: attribute.value, node });
          } else if (attribute.name.match(/^\^\.(\d+)$/)) {
            node.removeAttribute(attribute.name);
            targets.push({ type: 'property', name: attribute.value, node });
          }
        }
        findTargets(node, targets);
        break;
      case Node.COMMENT_NODE: {
        if (node.textContent.match(/^\^(\d+)$/)) {
          node.textContent = '';
          node.nextSibling.textContent = '';
          targets.push({ type: 'content', node, endNode: node.nextSibling });
        }
        break;
      }
    }
  }
  return targets;
}

// Clear content between our comment nodes.
function removeNodesBetween(node, endNode) {
  const parentNode = node.parentNode;
  while(node.nextSibling && node.nextSibling !== endNode) {
    parentNode.removeChild(node.nextSibling);
  }
}

// Commit a value change to a DOM node attribute.
function commitAttribute(node, name, value, lastValue) {
  if (value !== lastValue) {
    node.setAttribute(name, value ?? '');
  }
}

// Commit a boolean value change to a DOM node attribute.
function commitBooleanAttribute(node, name, value, lastValue) {
  if (value !== lastValue) {
    if (value) {
      node.setAttribute(name, '');
    } else {
      node.removeAttribute(name);
    }
  }
}

// Commit a value change to a DOM node property.
function commitProperty(node, name, value, lastValue) {
  if (value !== lastValue) {
    node[name] = value; // To preserve type, no coalescing!
  }
}

// Commit a value change to the content of a DOM node.
function commitContent(node, endNode, value, lastValue) {
  if (Array.isArray(value)) {
    if (!nodeToArrayState.has(node)) {
      nodeToArrayState.set(node, { items: [] });
    }
    const items = nodeToArrayState.get(node).items;
    for (let jjj = items.length; jjj < value.length; jjj++) {
      const subNode = document.createComment('');
      const subEndNode = document.createComment('');
      node.parentNode.insertBefore(subNode, endNode);
      node.parentNode.insertBefore(subEndNode, endNode);
      items.push({ subNode, subEndNode });
    }
    while(value.length < items.length) {
      const { subNode, subEndNode } = items.pop();
      removeNodesBetween(subNode, subEndNode);
      node.parentNode.removeChild(subNode);
      node.parentNode.removeChild(subEndNode);
    }
    for (let jjj = 0; jjj < value.length; jjj++) {
      const subValue = value[jjj];
      const { subNode, subEndNode } = items[jjj];
      commit(subNode, subEndNode, subValue);
    }
  } else if (symbolToResult.has(value)) {
    commit(node, endNode, value);
  } else {
    if (value !== lastValue) {
      if (
        symbolToResult.has(lastValue) ||
        Array.isArray(lastValue)
      ) {
        removeNodesBetween(node, endNode);
        nodeToContainerState.delete(node);
        nodeToArrayState.delete(node);
      }
      if (node.nextSibling === endNode) {
        const textNode = document.createTextNode(value ?? '');
        node.parentNode.insertBefore(textNode, endNode);
      } else {
        node.nextSibling.textContent = value ?? '';
      }
    }
  }
}

// Walk through live nodes and commit value changes.
function commit(node, endNode, result) {
  const { strings, values } = symbolToResult.get(result);
  if (!stringsToFragment.has(strings)) {
    const fragment = createFragment(strings);
    stringsToFragment.set(strings, fragment);
  }
  if (!nodeToContainerState.has(node) || nodeToContainerState.get(node).strings !== strings) {
    const fragment = stringsToFragment.get(strings).cloneNode(true);
    const targets = findTargets(fragment);
    if (endNode) {
      removeNodesBetween(node, endNode);
      node.parentNode.insertBefore(fragment, endNode);
    } else {
      node.textContent = '';
      node.appendChild(fragment);
    }
    nodeToContainerState.set(node, { targets, strings, endNode, items: [] });
  }
  const targets = nodeToContainerState.get(node).targets;
  for (let iii = 0; iii < values.length; iii++) {
    const target = targets[iii];
    const value = values[iii];
    const lastValue = target.value;
    target.value = value;
    switch (target.type) {
      case 'attribute':
        commitAttribute(target.node, target.name, value, lastValue);
        break;
      case 'boolean-attribute':
        commitBooleanAttribute(target.node, target.name, value, lastValue);
        break;
      case 'property':
        commitProperty(target.node, target.name, value, lastValue);
        break;
      case 'content':
        commitContent(target.node, target.endNode, value, lastValue);
        break;
    }
  }
}

// Tagged template function for idiomatic interpolation.
function html(strings, ...values) {
  const symbol = Symbol('__result__');
  symbolToResult.set(symbol, { strings, values });
  return symbol;
}

// Renderer to update DOM in the desired container.
const render = (container, result) => {
  commit(container, null, result);
};

export { html, render };
```

Phew! About ~220 lines now… but this is approaching something that could be
valuable in real-world scenarios.

**What it does**

* It’s got the right functional interface (i.e., `html` and `render`).
* Hydration is idiomatic JS.
* It’s composable — i.e., you can nest, loop, etc.
* Content can be interpolated between tags (e.g., text in a paragraph).
* Attributes can be interpolated inside opening tags (e.g., flag on an item).
* It understands html.
* Boolean attributes and properties work via `.` / `?` DSL.
* **DOM and HTML is cached (limited thrashing).** †
* **All scripted implementation details are internalized.**
* **Change-by-value detection.**

**What it doesn’t do**

* Some markup abstractions are leaking.
* Many edge cases are not considered.

† Note that the HTML caching actually hinges on a _very_ special property of
  the `strings` argument in a tagged template function. When called from the
  _exact same JS expression_ with the _exact same literals_, the value of the
  `strings` argument will _always be exactly the same_. That means you can stick
  it in a weak map.

## Wrapping up!

In just a couple iterations — we went from a naive implementation which just
does recursive string concatenation… all the way to an html-aware, performant
DOM management system. Nice!

The remaining edge-cases and markup-cleanup won’t be covered here, but this
final iteration is a fairly complete template engine for expressing a merger of
html markup and data and performantly making updates to DOM when things change.
