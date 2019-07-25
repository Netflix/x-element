import { assert, it } from '../../../@netflix/x-test/x-test.js';
import './fixture-element-read-only-properties.js';

it('x-element readOnly properties', async () => {
  const el = document.createElement('test-element-read-only-properties');
  document.body.appendChild(el);

  await true;
  assert(el.readOnlyProperty === 'Ferus', 'initialized as expected');

  el.readOnlyProperty = 'Dromedary';
  assert(
    el.readOnlyProperty === 'Ferus',
    'read-only properties cannot be changed'
  );
});
