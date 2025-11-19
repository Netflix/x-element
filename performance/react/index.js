// performance/react/index.jsx
import ReactDOMClient from "react-dom/client";
import CommonTest from "../common.js";
import { jsx, jsxs } from "react/jsx-runtime";
var { createRoot } = ReactDOMClient;
var Test = class _Test extends CommonTest {
  static id = "react";
  // TODO: This is sorta cheating since we aren’t asking it to _parse_ anything…
  //  I.e., it is simply compiled ahead of time into “index.js” file.
  static Component(properties) {
    const { attr, one, two, three, four, five, six, seven, eight, nine, ten, id, hidden, title, content1, content2, items } = properties;
    return /* @__PURE__ */ jsxs("div", { "data-id": "p1", attr, children: [
      /* @__PURE__ */ jsx("div", { "data-id": "p2", "data-foo": true, one, two, three, four, five, six, seven, eight, nine, ten, children: /* @__PURE__ */ jsx("div", { "data-id": "p3", "data-bar": "bar", children: /* @__PURE__ */ jsxs("div", { "data-id": id, boolean: true, hidden: hidden ? true : void 0, title, children: [
        content1,
        " -- ",
        content2
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { class: "extra", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Just something a little ",
          /* @__PURE__ */ jsx("em", { children: "extra" }),
          " at the end!"
        ] }),
        /* @__PURE__ */ jsx("p", { children: "There are no more interpolations, so this ought to just get skipped." })
      ] })
    ] });
  }
  static async injectSetup() {
    const properties = this.properties[0];
    this.injectContext = { properties };
  }
  static injectRun() {
    const { properties } = this.injectContext;
    const root = createRoot(document.createElement("div"));
    root.render(/* @__PURE__ */ jsx(_Test.Component, { ...properties }));
  }
  static async initialSetup() {
    const properties = this.properties[0];
    this.initialContext = { properties };
  }
  static initialRun() {
    const { properties } = this.initialContext;
    const root = createRoot(document.createElement("div"));
    root.render(/* @__PURE__ */ jsx(_Test.Component, { ...properties }));
  }
  static async updateSetup() {
    const getProperties = this.getProperties;
    const properties = getProperties();
    const root = createRoot(document.createElement("div"));
    root.render(/* @__PURE__ */ jsx(_Test.Component, { ...properties }));
    this.updateContext = { root, getProperties };
  }
  static updateRun() {
    const { root, getProperties } = this.updateContext;
    const properties = getProperties();
    root.render(/* @__PURE__ */ jsx(_Test.Component, { ...properties }));
  }
};
Test.initialize();
