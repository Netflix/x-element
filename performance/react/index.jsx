import ReactDOMClient from 'react-dom/client';
import CommonTest from '../common.js';

const { createRoot } = ReactDOMClient;

// TODO: React cannot really test “inject” it doesn’t compare.
class Test extends CommonTest {
  static id = 'react';

  // TODO: This is sorta cheating since we aren’t asking it to _parse_ anything…
  //  I.e., it is simply compiled ahead of time into “index.js” file.
  static Component(properties) {
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2, items } = properties;
    return (
      <div data-id="p1" attr={attr}>
        <div data-id="p2" data-foo one={one} two={two} three={three} four={four} five={five} six={six} seven={seven} eight={eight} nine={nine} ten={ten}>
          <div data-id="p3" data-bar="bar">
            <div data-id={id} boolean hidden={hidden ? true : undefined} title={title}>
              {content1} -- {content2}
            </div>
          </div>
        </div>
        <div class="extra">
          <p>
            Just something a little <em>extra</em> at the end!
          </p>
          <p>
            There are no more interpolations, so this ought to just get skipped.
          </p>
        </div>
      </div>
    );
  }

  static async injectSetup() {
    const properties = this.properties[0];
    this.injectContext = { properties };
  }
  static injectRun() {
    const { properties } = this.injectContext;
    const root = createRoot(document.createElement('div'));
    root.render(<Test.Component {...properties} />);
  }

  static async initialSetup() {
    const properties = this.properties[0];
    this.initialContext = { properties };
  }
  static initialRun() {
    const { properties } = this.initialContext;
    const root = createRoot(document.createElement('div'));
    root.render(<Test.Component {...properties} />);
  }

  static async updateSetup() {
    const getProperties = this.getProperties;
    const properties = getProperties();
    const root = createRoot(document.createElement('div'));
    root.render(<Test.Component {...properties} />);
    this.updateContext = { root, getProperties };
  }
  static updateRun() {
    const { root, getProperties } = this.updateContext;
    const properties = getProperties();
    root.render(<Test.Component {...properties} />);
  }
}

Test.initialize();
