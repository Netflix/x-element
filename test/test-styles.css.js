// TODO: Replace with actual css file when ESLint accepts import attributes.
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
export default styleSheet;
