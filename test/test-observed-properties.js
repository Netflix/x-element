import { suite, it } from './runner.js';
import './fixture-element-observed-properties.js';

suite('x-element observed properties', ctx => {
  const el = document.createElement('test-element-observed-properties');
  el.a = 'oh';
  el.b = 'hai';

  ctx.body.appendChild(el);

  it(
    'initialized as expected',
    JSON.stringify(el.changes) ===
      '[{"property":"a","newValue":"oh"},{"property":"b","newValue":"hai"},{"property":"c","newValue":"oh hai"}]'
  );

  el.b = 'hey';
  it(
    'observers are called when properties change',
    JSON.stringify(el.changes) ===
      '[{"property":"a","newValue":"oh"},{"property":"b","newValue":"hai"},{"property":"c","newValue":"oh hai"},{"property":"b","newValue":"hey","oldValue":"hai"},{"property":"c","newValue":"oh hey","oldValue":"oh hai"}]'
  );

  el.b = 'hey';
  it(
    'observers are not called when set property is the same',
    JSON.stringify(el.changes) ===
      '[{"property":"a","newValue":"oh"},{"property":"b","newValue":"hai"},{"property":"c","newValue":"oh hai"},{"property":"b","newValue":"hey","oldValue":"hai"},{"property":"c","newValue":"oh hey","oldValue":"oh hai"}]'
  );

  el.popped = true;
  el.setAttribute('popped', 'still technically true');
  it(
    'no re-entrance for observed, reflected properties',
    JSON.stringify(el.changes) ===
      '[{"property":"a","newValue":"oh"},{"property":"b","newValue":"hai"},{"property":"c","newValue":"oh hai"},{"property":"b","newValue":"hey","oldValue":"hai"},{"property":"c","newValue":"oh hey","oldValue":"oh hai"},{"property":"popped","newValue":true}]'
  );
});
