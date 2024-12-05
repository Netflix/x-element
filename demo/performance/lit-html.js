import { render, html } from 'lit-html';
import CommonTest, { HtmlLiteralInterface } from './common.js';

class Test extends CommonTest {
  static id = 'lit-html';

  static async injectSetup() {
    const properties = this.properties[0];
    this.injectContext = { render, html, properties };
  }
  static injectRun() {
    const { properties } = this.injectContext;
    render(HtmlLiteralInterface.getResultEval(html, properties), document.createElement('div'));
  }

  static async initialSetup() {
    const properties = this.properties[0];
    this.initialContext = { render, html, properties };
  }
  static initialRun() {
    const { properties } = this.initialContext;
    render(HtmlLiteralInterface.getResult(html, properties), document.createElement('div'));
  }

  static async updateSetup() {
    const container = document.createElement('div');
    const getProperties = this.getProperties;
    render(HtmlLiteralInterface.getResult(html, getProperties()), container);
    this.initialContext = { render, html, container, getProperties };
  }
  static updateRun() {
    const { container, getProperties } = this.initialContext;
    render(HtmlLiteralInterface.getResult(html, getProperties()), container);
  }
}

Test.initialize();
