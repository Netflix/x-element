import XElement from '../x-element.js';

const logo = `\
  _________
 / /__ __\\ \\
/ / \\ \\ / \\ \\
\\ \\ /_\\_\\ / /
 \\_\\_____/_/
`;

class HelloElement extends XElement {
  static template(html) {
    return () => {
      return html`
        <style>
          :host {
            display: contents;
          }

          #container {
            position: fixed;
            --width: 150px;
            --height: 150px;
            --font-size: 13px;
            font-weight: bold;
            line-height: calc(var(--font-size) * 1.8);
            font-size: var(--font-size);
            top: calc(0px - var(--width) / 2);
            left: calc(0px - var(--height) / 2);
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--width);
            height: var(--height);
            transform: translate(calc(0vw - var(--width)), 50vh) rotate(0deg);
            opacity: 1;
            transform-origin: center;
            border-radius: 100vmax;
            cursor: default;
          }

          #logo {
            padding-bottom: var(--font-size);
          }
        </style>
        <div id="container"><pre id="logo">${logo}</pre></div>
      `;
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


customElements.define('hello-world', HelloElement);
