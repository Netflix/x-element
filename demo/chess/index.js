import XElement from '../../x-element.js';

class ChessPieceElement extends XElement {
  static get properties() {
    return {
      rank: {
        type: String,
        reflect: true,
      },
      elementTabIndex: {
        type: Number,
        initial: 1,
        observe: (host, value) => { host.tabIndex = value; },
      },
    };
  }

  static template(html) {
    return ({ rank }) => {
      return html`
        <style>
          :host {
            display: block;
            width: var(--hello-size, 8rem);
            height: var(--hello-size, 8rem);
            background-color: cyan;
            border-radius: 50%;
            margin: 0.25rem;
            box-sizing: border-box;
            transition-duration: 250ms;
            transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
            transition-property: transform, border;
            will-change: transform;
            cursor: pointer;
          }
          
          #container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: calc(var(--hello-size, 8rem) * calc(5/11));
          }
          
          :host([rank="\u2655"]) {
            border: 4px dotted hsl(120, 100%, 50%);
            background-color: yellow;
            transform: rotateX(15deg) rotateY(15deg);
          }
          
          :host([rank="\u2654"]) {
            border: 3px solid hsl(270, 100%, 50%);
            background-color: magenta;
            color: blue;
            transform: rotateX(-10deg) rotateY(-15deg);
          }
          
          :host(:not([rank])),
          :host([rank=""]) {
            background-color: #ccc;
          }
          
          :host(:hover) {
            border: 3px solid hsl(180, 100%, 50%);
            transform: translateZ(-25px);
          }
          
          :host(:focus) {
            border: 12px solid hsl(90, 100%, 50%);
            outline: none;
          }
          
          #container:empty::before {
            content: '\u265F';
          }
        </style>
        <div id="container">${rank}</div>
      `;
    };
  }
}

customElements.define('chess-piece', ChessPieceElement);
