import ReactDOMClient from 'react-dom/client';
import '../chess/chess-piece.js';

function ChessPiece({ rank }) {
  return (
    <>
      <chess-piece rank={rank} />
      <chess-piece rank={'\u2655'} />
      <chess-piece />
    </>
  );
}

const ranks = ['\u2655', '\u2654', '\u2656', '\u2657', ''];
let counter = 0;

const root = document.getElementById('root');
const reactRoot = ReactDOMClient.createRoot(root);
reactRoot.render(<ChessPiece rank={ranks[0]} />);

setInterval(() => {
  const rank = ranks[counter % ranks.length];
  counter += 1;
  reactRoot.render(<ChessPiece rank={rank} />);
}, 1250);
