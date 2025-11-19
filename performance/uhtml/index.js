import { render, html } from 'uhtml';
import CommonTest, { HtmlLiteralInterface } from '../common.js';

class Test extends CommonTest {
  static id = 'uhtml';

  static async injectSetup() {
    const properties = this.properties[0];
    this.injectContext = { render, html, properties };
  }
  static injectRun() {
    const { properties } = this.injectContext;
    render(document.createElement('div'), HtmlLiteralInterface.getResultEval(html, properties));
  }

  static async initialSetup() {
    const properties = this.properties[0];
    this.initialContext = { render, html, properties };
  }
  static initialRun() {
    const { properties } = this.initialContext;
    render(document.createElement('div'), HtmlLiteralInterface.getResult(html, properties));
  }

  static async updateSetup() {
    const container = document.createElement('div');
    const getProperties = this.getProperties;
    render(container, HtmlLiteralInterface.getResult(html, getProperties()));
    this.updateContext = { render, html, container, getProperties };
  }
  static updateRun() {
    const { container, getProperties } = this.updateContext;
    render(container, HtmlLiteralInterface.getResult(html, getProperties()));
  }
}

Test.initialize();
