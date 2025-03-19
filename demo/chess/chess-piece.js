import XElement from '../../x-element.js';
import styleSheet from './chess-piece.css' with { type: 'css' };

class ChessPieceElement extends XElement {
  static get styles() {
    return [styleSheet];
  }

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
      return html`<div id="container">${rank}</div>`;
    };
  }
}

customElements.define('chess-piece', ChessPieceElement);
