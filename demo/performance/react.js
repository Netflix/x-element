import React from 'react';
import ReactDOMClient from 'react-dom/client';
import CommonTest from './common.js';

const { createElement } = React;
const { createRoot } = ReactDOMClient;

// TODO: React cannot really test “inject” it doesn’t compare.
class Test extends CommonTest {
  static id = 'react';

  // TODO: This is sorta cheating since we aren’t asking it to _parse_ anything…
  static getResult(properties) {
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2 } = properties;
    return createElement('div', { 'data-id': 'p1', attr }, [
      createElement('div', { 'data-id': 'p2', 'data-foo': '', one, two, three, four, five, six, seven, eight, nine, ten }, [
        createElement('div', { 'data-id': 'p3', 'data-bar': 'bar' }, [
          createElement('div', hidden ? { 'data-id': id, boolean: '', hidden: '', 'data-bar': 'bar', title } : { 'data-id': id, boolean: '', 'data-bar': 'bar', title }, [
            content1,
            ' -- ',
            content2,
          ]),
        ]),
        createElement('p', null, [
          'Just something a little ',
          createElement('em', null, ['extra']),
          ' at the end!',
        ]),
        createElement('p', null, [
          'There are no more interpolations, so this ought to just get skipped.',
        ]),
      ]),
    ]);
  }

  static async injectSetup() {
    const properties = this.properties[0];
    this.injectContext = { properties };
  }
  static injectRun() {
    const { properties } = this.injectContext;
    const root = createRoot(document.createElement('div'));
    root.render(this.getResult(createElement, properties));
  }

  static async initialSetup() {
    const properties = this.properties[0];
    this.injectContext = { properties };
  }
  static initialRun() {
    const { properties } = this.injectContext;
    const root = createRoot(document.createElement('div'));
    root.render(this.getResult(createElement, properties));
  }

  static async updateSetup() {
    const getProperties = this.getProperties;
    const root = createRoot(document.createElement('div'));
    root.render(this.getResult(createElement, getProperties()));
    this.injectContext = { root, getProperties };
  }
  static updateRun() {
    const { root, getProperties } = this.injectContext;
    root.render(this.getResult(createElement, getProperties()));
  }
}

Test.initialize();
