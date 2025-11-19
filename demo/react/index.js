// demo/react/index.jsx
import ReactDOMClient from "react-dom/client";
import "../chess/chess-piece.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ChessPiece({ rank }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("chess-piece", { rank }),
    /* @__PURE__ */ jsx("chess-piece", { rank: "\u2655" }),
    /* @__PURE__ */ jsx("chess-piece", {})
  ] });
}
var ranks = ["\u2655", "\u2654", "\u2656", "\u2657", ""];
var counter = 0;
var root = document.getElementById("root");
var reactRoot = ReactDOMClient.createRoot(root);
reactRoot.render(/* @__PURE__ */ jsx(ChessPiece, { rank: ranks[0] }));
setInterval(() => {
  const rank = ranks[counter % ranks.length];
  counter += 1;
  reactRoot.render(/* @__PURE__ */ jsx(ChessPiece, { rank }));
}, 1250);
