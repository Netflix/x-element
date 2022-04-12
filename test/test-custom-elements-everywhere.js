import XElement from '../x-element.js';
import { assert, it } from '../../../@netflix/x-test/x-test.js';

// https://github.com/webcomponents/custom-elements-everywhere/blob/main/libraries/__shared__/webcomponents/src/ce-with-children.js
class CEWithChildren extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <h1>Test h1</h1>
      <div>
        <p>Test p</p>
      </div>
      <slot></slot>
    `;
  }
}
customElements.define('ce-with-children', CEWithChildren);

// https://github.com/webcomponents/custom-elements-everywhere/blob/main/libraries/__shared__/webcomponents/src/ce-with-event.js
class CEWithEvent extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', this.onClick);
  }
  onClick() {
    this.dispatchEvent(new CustomEvent('lowercaseevent'));
    this.dispatchEvent(new CustomEvent('kebab-event'));
    this.dispatchEvent(new CustomEvent('camelEvent'));
    this.dispatchEvent(new CustomEvent('CAPSevent'));
    this.dispatchEvent(new CustomEvent('PascalEvent'));
  }
}
customElements.define('ce-with-event', CEWithEvent);

// https://github.com/webcomponents/custom-elements-everywhere/blob/main/libraries/__shared__/webcomponents/src/ce-with-properties.js
class CEWithProperties extends HTMLElement {
  set bool(value) {
    this._bool = value;
  }
  get bool() {
    return this._bool;
  }
  set num(value) {
    this._num = value;
  }
  get num() {
    return this._num;
  }
  set str(value) {
    this._str = value;
  }
  get str() {
    return this._str;
  }
  set arr(value) {
    this._arr = value;
  }
  get arr() {
    return this._arr;
  }
  set obj(value) {
    this._obj = value;
  }
  get obj() {
    return this._obj;
  }
}
customElements.define('ce-with-properties', CEWithProperties);

// https://github.com/webcomponents/custom-elements-everywhere/blob/main/libraries/__shared__/webcomponents/src/ce-without-children.js
class CEWithoutChildren extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('ce-without-children', CEWithoutChildren);

it('no children: can display a Custom Element with no children', () => {
  class TestElement1 extends XElement {
    static template(html) {
      return () => html`<ce-without-children id="ce-without-children"></ce-without-children>`;
    }
  }
  customElements.define('test-element-1', TestElement1);
  const element = document.createElement('test-element-1');
  element.id = 'test-element-1';
  document.body.append(element);
  assert(!!document.getElementById('test-element-1').shadowRoot.getElementById('ce-without-children'));
  document.body.removeChild(element);
});

it('basic support: with children: can display a Custom Element with children in a Shadow Root', () => {
  class TestElement2 extends XElement {
    static template(html) {
      return () => html`<ce-with-children id="ce-with-children"></ce-with-children>`;
    }
  }
  customElements.define('test-element-2', TestElement2);
  const element = document.createElement('test-element-2');
  element.id = 'test-element-2';
  document.body.append(element);
  const children = document.getElementById('test-element-2').shadowRoot.getElementById('ce-with-children').shadowRoot.children;
  assert(!!children.length);
  document.body.removeChild(element);
});

it('basic support: with children: can display a Custom Element with children in a Shadow Root and pass in Light DOM children', () => {
  class TestElement3 extends XElement {
    static template(html) {
      return () => html`<ce-with-children id="ce-with-children"><p id="test-element-3-dom"></p></ce-with-children>`;
    }
  }
  customElements.define('test-element-3', TestElement3);
  const element = document.createElement('test-element-3');
  element.id = 'test-element-3';
  document.body.append(element);
  const assignedElements = document.getElementById('test-element-3').shadowRoot.getElementById('ce-with-children').shadowRoot.querySelector('slot').assignedElements();
  assert(!!assignedElements.length);
  assert(assignedElements[0].id === 'test-element-3-dom');
  document.body.removeChild(element);
});

it('basic support: with children: can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element', () => {
  class TestElement4 extends XElement {
    static get properties() {
      return { show: { type: Boolean } };
    }
    static template(html) {
      return ({ show }) => show ? html`<ce-with-children id="ce-with-children"></ce-with-children>` : null;
    }
  }
  customElements.define('test-element-4', TestElement4);
  const element = document.createElement('test-element-4');
  element.id = 'test-element-4';
  document.body.append(element);
  const initialChildLookup = document.getElementById('test-element-4').shadowRoot.getElementById('ce-with-children');
  assert(!initialChildLookup);
  element.show = true;
  element.render(); // force and immediate re-render.
  const finalChildLookup = document.getElementById('test-element-4').shadowRoot.getElementById('ce-with-children');
  assert(!!finalChildLookup);
  document.body.removeChild(element);
});

it('basic support: attributes and properties: will pass boolean data as either an attribute or a property', () => {
  class TestElement5 extends XElement {
    static get properties() {
      return { bool: { type: Boolean } };
    }
    static template(html) {
      return ({ bool }) => html`<ce-with-properties id="ce-with-properties" .bool="${bool}"></ce-with-properties>`;
    }
  }
  customElements.define('test-element-5', TestElement5);
  const element = document.createElement('test-element-5');
  element.bool = true;
  element.id = 'test-element-5';
  document.body.append(element);
  const bool = document.getElementById('test-element-5').shadowRoot.getElementById('ce-with-properties').bool;
  assert(bool);
  document.body.removeChild(element);
});

it('basic support: attributes and properties: will pass numeric data as either an attribute or a property', () => {
  class TestElement6 extends XElement {
    static get properties() {
      return { num: { type: Number } };
    }
    static template(html) {
      return ({ num }) => html`<ce-with-properties id="ce-with-properties" .num="${num}"></ce-with-properties>`;
    }
  }
  customElements.define('test-element-6', TestElement6);
  const element = document.createElement('test-element-6');
  element.num = 999;
  element.id = 'test-element-6';
  document.body.append(element);
  const num = document.getElementById('test-element-6').shadowRoot.getElementById('ce-with-properties').num;
  assert(num === 999);
  document.body.removeChild(element);
});

it('basic support: attributes and properties: will pass string data as either an attribute or a property', () => {
  class TestElement7 extends XElement {
    static get properties() {
      return { str: { type: String } };
    }
    static template(html) {
      return ({ str }) => html`<ce-with-properties id="ce-with-properties" .str="${str}"></ce-with-properties>`;
    }
  }
  customElements.define('test-element-7', TestElement7);
  const element = document.createElement('test-element-7');
  element.str = 'foo';
  element.id = 'test-element-7';
  document.body.append(element);
  const str = document.getElementById('test-element-7').shadowRoot.getElementById('ce-with-properties').str;
  assert(str === 'foo');
  document.body.removeChild(element);
});

it('basic support: events: can imperatively listen to a DOM event dispatched by a Custom Element', () => {
  class TestElement8 extends XElement {
    static get properties() {
      return { handled: { type: Boolean } };
    }
    static template(html) {
      return () => html`<ce-with-event id="ce-with-event"></ce-with-event>`;
    }
    static onLowercaseevent(host) {
      host.handled = true;
    }
    connectedCallback() {
      super.connectedCallback();
      this.listen(this.shadowRoot.getElementById('ce-with-event'), 'lowercaseevent', TestElement8.onLowercaseevent);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.unlisten(this.shadowRoot.getElementById('ce-with-event'), 'lowercaseevent', TestElement8.onLowercaseevent);
    }
  }
  customElements.define('test-element-8', TestElement8);
  const element = document.createElement('test-element-8');
  element.id = 'test-element-8';
  document.body.append(element);
  const child = document.getElementById('test-element-8').shadowRoot.getElementById('ce-with-event');
  child.click();
  assert(element.handled);
  document.body.removeChild(element);
});

it('advanced support: attributes and properties: will pass array data as a property', () => {
  class TestElement9 extends XElement {
    static get properties() {
      return { arr: { type: Array } };
    }
    static template(html) {
      return ({ arr }) => html`<ce-with-properties id="ce-with-properties" .arr="${arr}"></ce-with-properties>`;
    }
  }
  customElements.define('test-element-9', TestElement9);
  const element = document.createElement('test-element-9');
  const input = [1, 2, 3];
  element.arr = input;
  element.id = 'test-element-9';
  document.body.append(element);
  const arr = document.getElementById('test-element-9').shadowRoot.getElementById('ce-with-properties').arr;
  assert(arr === input);
  document.body.removeChild(element);
});

it('advanced support: attributes and properties: will pass object data as a property', () => {
  class TestElement10 extends XElement {
    static get properties() {
      return { obj: { type: Object } };
    }
    static template(html) {
      return ({ obj }) => html`<ce-with-properties id="ce-with-properties" .obj="${obj}"></ce-with-properties>`;
    }
  }
  customElements.define('test-element-10', TestElement10);
  const element = document.createElement('test-element-10');
  const input = { foo: 'bar' };
  element.obj = input;
  element.id = 'test-element-10';
  document.body.append(element);
  const obj = document.getElementById('test-element-10').shadowRoot.getElementById('ce-with-properties').obj;
  assert(obj === input);
  document.body.removeChild(element);
});

it('advanced support: events: can declaratively listen to a lowercase DOM event dispatched by a Custom Element', () => {
  class TestElement11 extends XElement {
    static get properties() {
      return { handled: { type: Boolean } };
    }
    static template(html) {
      return () => html`<ce-with-event id="ce-with-event"></ce-with-event>`;
    }
    static onLowercaseevent(host) {
      host.handled = true;
    }
    connectedCallback() {
      super.connectedCallback();
      this.listen(this.shadowRoot.getElementById('ce-with-event'), 'lowercaseevent', TestElement11.onLowercaseevent);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.unlisten(this.shadowRoot.getElementById('ce-with-event'), 'lowercaseevent', TestElement11.onLowercaseevent);
    }
  }
  customElements.define('test-element-11', TestElement11);
  const element = document.createElement('test-element-11');
  element.id = 'test-element-11';
  document.body.append(element);
  const child = document.getElementById('test-element-11').shadowRoot.getElementById('ce-with-event');
  child.click();
  assert(element.handled);
  document.body.removeChild(element);
});

it('advanced support: events: can declaratively listen to a kebab-case DOM event dispatched by a Custom Element', () => {
  class TestElement12 extends XElement {
    static get properties() {
      return { handled: { type: Boolean } };
    }
    static template(html) {
      return () => html`<ce-with-event id="ce-with-event"></ce-with-event>`;
    }
    static onKebabEvent(host) {
      host.handled = true;
    }
    connectedCallback() {
      super.connectedCallback();
      this.listen(this.shadowRoot.getElementById('ce-with-event'), 'kebab-event', TestElement12.onKebabEvent);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.unlisten(this.shadowRoot.getElementById('ce-with-event'), 'kebab-event', TestElement12.onKebabEvent);
    }
  }
  customElements.define('test-element-12', TestElement12);
  const element = document.createElement('test-element-12');
  element.id = 'test-element-12';
  document.body.append(element);
  const child = document.getElementById('test-element-12').shadowRoot.getElementById('ce-with-event');
  child.click();
  assert(element.handled);
  document.body.removeChild(element);
});

it('advanced support: events: can declaratively listen to a camelCase DOM event dispatched by a Custom Element', () => {
  class TestElement13 extends XElement {
    static get properties() {
      return { handled: { type: Boolean } };
    }
    static template(html) {
      return () => html`<ce-with-event id="ce-with-event"></ce-with-event>`;
    }
    static onCamelEvent(host) {
      host.handled = true;
    }
    connectedCallback() {
      super.connectedCallback();
      this.listen(this.shadowRoot.getElementById('ce-with-event'), 'camelEvent', TestElement13.onCamelEvent);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.unlisten(this.shadowRoot.getElementById('ce-with-event'), 'camelEvent', TestElement13.onCamelEvent);
    }
  }
  customElements.define('test-element-13', TestElement13);
  const element = document.createElement('test-element-13');
  element.id = 'test-element-13';
  document.body.append(element);
  const child = document.getElementById('test-element-13').shadowRoot.getElementById('ce-with-event');
  child.click();
  assert(element.handled);
  document.body.removeChild(element);
});

it('advanced support: events: can declaratively listen to a CAPScase DOM event dispatched by a Custom Element', () => {
  class TestElement14 extends XElement {
    static get properties() {
      return { handled: { type: Boolean } };
    }
    static template(html) {
      return () => html`<ce-with-event id="ce-with-event"></ce-with-event>`;
    }
    static onCAPSevent(host) {
      host.handled = true;
    }
    connectedCallback() {
      super.connectedCallback();
      this.listen(this.shadowRoot.getElementById('ce-with-event'), 'CAPSevent', TestElement14.onCAPSevent);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.unlisten(this.shadowRoot.getElementById('ce-with-event'), 'CAPSevent', TestElement14.onCAPSevent);
    }
  }
  customElements.define('test-element-14', TestElement14);
  const element = document.createElement('test-element-14');
  element.id = 'test-element-14';
  document.body.append(element);
  const child = document.getElementById('test-element-14').shadowRoot.getElementById('ce-with-event');
  child.click();
  assert(element.handled);
  document.body.removeChild(element);
});

it('advanced support: events: can declaratively listen to a PascalCase DOM event dispatched by a Custom Element', () => {
  class TestElement15 extends XElement {
    static get properties() {
      return { handled: { type: Boolean } };
    }
    static template(html) {
      return () => html`<ce-with-event id="ce-with-event"></ce-with-event>`;
    }
    static onPascalEvent(host) {
      host.handled = true;
    }
    connectedCallback() {
      super.connectedCallback();
      this.listen(this.shadowRoot.getElementById('ce-with-event'), 'PascalEvent', TestElement15.onPascalEvent);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.unlisten(this.shadowRoot.getElementById('ce-with-event'), 'PascalEvent', TestElement15.onPascalEvent);
    }
  }
  customElements.define('test-element-15', TestElement15);
  const element = document.createElement('test-element-15');
  element.id = 'test-element-15';
  document.body.append(element);
  const child = document.getElementById('test-element-15').shadowRoot.getElementById('ce-with-event');
  child.click();
  assert(element.handled);
  document.body.removeChild(element);
});