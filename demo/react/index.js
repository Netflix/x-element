import ready from '../../etc/ready.js';

class Hello extends React.Component {
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('hello-world', { rank: this.props.rank }, null),
      React.createElement('hello-world', { rank: '\u2655' }, null),
      React.createElement('hello-world', {}, null)
    );
  }
}

ready(document).then(() => {
  const ranks = ['\u2655', '\u2654', '\u2656', '\u2657', ''];
  let counter = 0;

  const root = document.getElementById('root');
  ReactDOM.render(React.createElement(Hello, { rank: ranks[0] }, null), root);

  setInterval(() => {
    const rank = ranks[counter % ranks.length];
    counter += 1;
    ReactDOM.render(React.createElement(Hello, { rank: rank }, null), root);
  }, 1250);
});
