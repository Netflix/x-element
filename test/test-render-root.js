import XElement from '../x-element.js';
import { assert, it } from './x-test.js';

class TestElement1 extends XElement {
  static createRenderRoot(host) {
    return host;
  }
  static template(html) {
    return () => {
      return html`I'm not in a shadow root.`;
    };
  }
}
customElements.define('test-element-1', TestElement1);

class TestElement2 extends XElement {
  static get styleSheets() {
    // TODO: Replace with direct import of css file when better-supported in
    //  browsers. I.e., use import attributes with { type: 'css' }.
    const css = `\
      :host {
        display: block;
        background-color: coral;
        width: 100px;
        height: 100px;
      }
    `;
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(css);
    return [styleSheet];
  }
  static template(html) {
    return () => {
      return html``;
    };
  }
}
customElements.define('test-element-2', TestElement2);


it('test render root was respected', () => {
  const el = document.createElement('test-element-1');
  document.body.append(el);
  assert(el.shadowRoot === null);
  assert(el.textContent === `I'm not in a shadow root.`);
  el.remove();
});

it('provided style sheets are adopted', () => {
  const el = document.createElement('test-element-2');
  document.body.append(el);
  const boundingClientRect = el.getBoundingClientRect();
  assert(boundingClientRect.width === 100);
  assert(boundingClientRect.height === 100);
  el.remove();
});

it('errors are thrown in for creating a bad render root', () => {
  class BadElement extends XElement {
    static createRenderRoot() {}
  }
  customElements.define('test-element-3', BadElement);
  let passed = false;
  let message = 'no error was thrown';
  try {
    new BadElement();
  } catch (error) {
    const expected = 'Unexpected render root returned. Expected "host" or "host.shadowRoot".';
    message = error.message;
    passed = error.message === expected;
  }
  assert(passed, message);
});
