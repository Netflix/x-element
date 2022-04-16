import ready from '../../etc/ready.js';

await ready(document);

const log = (container, count, initializeAverage, updateAverage) => {
  const element = document.createElement('pre');
  element.textContent = `initialize: ${initializeAverage}, update: ${updateAverage} (tested ${count.toLocaleString()} times)`;
  container.append(element);
};

const run = (container, localName) => {
  const count = 100000;

  // Test initialize performance.
  let initializeSum = 0;
  for (let iii = 0; iii < count; iii++) {
    const element = document.createElement(localName);
    const t0 = performance.now();
    container.append(element); // Initial, sync render happens on connection.
    const t1 = performance.now();
    initializeSum += t1 - t0;
    element.remove(); // cleanup
  }
  const initializeAverage = `${(initializeSum / count * 1000).toFixed(1).padStart(4)} µs`;

  // Test update performance.
  let updateSum = 0;
  const updates = [{ base: 5, height: 12 }, { base: 3, height: 4 }];
  const element = document.createElement(localName);
  container.append(element);
  for (let iii = 0; iii < count; iii++) {
    const update = updates[iii % 2];
    Object.assign(element, update);
    const t0 = performance.now();
    element.render(); // Force a sync render.
    const t1 = performance.now();
    updateSum += t1 - t0;
  }
  const updateAverage = `${(updateSum / count * 1000).toFixed(1).padStart(4)} µs`;

  log(container, count, initializeAverage, updateAverage);
};

await new Promise(resolve => setTimeout(resolve, 0));
run(document.getElementById('default'), 'default-performance');
await new Promise(resolve => setTimeout(resolve, 0));
run(document.getElementById('lit-html'), 'lit-html-performance');
await new Promise(resolve => setTimeout(resolve, 0));
run(document.getElementById('uhtml'), 'uhtml-performance');
