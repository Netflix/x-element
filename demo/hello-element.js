import XElement from '../x-element.js';
import styleSheet from './hello-element.css' with { type: 'css' };

const logo = `\
  _________
 / /__ __\\ \\
/ / \\ \\ / \\ \\
\\ \\ /_\\_\\ / /
 \\_\\_____/_/
`;

class HelloElement extends XElement {
  static get styles() {
    return [styleSheet];
  }

  static template(html) {
    return () => {
      return html`<div id="container"><pre id="logo">${logo}</pre></div>`;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const { keyframes, options } = HelloElement.animation;
    this.shadowRoot.getElementById('container').animate(keyframes, options);
  }

  static get animation() {
    return {
      keyframes: [
        // The "-93px" is centering the logo on the "x" text.
        { transform: 'translate(calc(50vw - 93px), 50vh) rotate(720deg)', opacity: 0.3, offset: 1 },
      ],
      options: {
        duration: 3000,
        iterations: 1,
        easing: 'ease-out',
        fill: 'forwards',
      },
    };
  }
}

customElements.define('hello-element', HelloElement);
