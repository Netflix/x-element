/**
 * Provides declarative 'listeners' block.
 */

const sheetMap = new Map();

export default superclass =>
  class extends superclass {
    static get styles() {
      // Array of css text strings.
      return [];
    }

    static beforeInitialRender(target) {
      super.beforeInitialRender(target);
      target.shadowRoot.adoptedStyleSheets = this.styles.map(this.cssToSheet);
    }

    static cssToSheet(css) {
      if (sheetMap.has(css) === false) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        sheetMap.set(css, sheet);
      }
      return sheetMap.get(css);
    }
  };
