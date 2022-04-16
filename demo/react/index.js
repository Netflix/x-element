import ready from '../../etc/ready.js';

class ChessPiece extends React.Component {
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('chess-piece', { rank: this.props.rank }, null),
      React.createElement('chess-piece', { rank: '\u2655' }, null),
      React.createElement('chess-piece', {}, null)
    );
  }
}

ready(document).then(() => {
  const ranks = ['\u2655', '\u2654', '\u2656', '\u2657', ''];
  let counter = 0;

  const root = document.getElementById('root');
  ReactDOM.render(React.createElement(ChessPiece, { rank: ranks[0] }, null), root);

  setInterval(() => {
    const rank = ranks[counter % ranks.length];
    counter += 1;
    ReactDOM.render(React.createElement(ChessPiece, { rank: rank }, null), root);
  }, 1250);
});
