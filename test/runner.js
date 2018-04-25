import ready from '../etc/ready.js';

export function it(message, expression) {
  const result = eval(expression);
  if (result) {
    console.log(`\u2714 ${message}`);
  } else {
    console.error(`\u2716 ${message}:`, result);
  }
}

export function suite(message, callback) {
  ready(document).then(() => {
    console.log(
      `%c${message}\n`,
      'font-weight: bold; font-size: 1.2em; line-height: 3em;'
    );
    callback(document);
  });
}

export default function run(src) {
  const ctx = document.createElement('iframe');
  ctx.srcdoc = `
    <html>
      <head>
        <meta charset="UTF-8">
        <script type="module" src="${src}"></script>
      </head>
    </html>
  `;

  ready(document).then(() => {
    document.body.appendChild(ctx);
  });
}
