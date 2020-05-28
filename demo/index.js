document.querySelector('demo-element').reflected = 'ok';
document.querySelector('demo-element-properties').reflected = 'ok';

const rightTriangle = document.querySelector('right-triangle');
const pythagoreanTriples = [
  { base: 5, height: 12 },
  { base: 7, height: 24 },
  { base: 8, height: 15 },
  { base: 9, height: 40 },
  { base: 11, height: 60 },
  { base: 0, height: 0 },
  { base: 3, height: 4 },
];
let count = 0;
setInterval(() => {
  Object.assign(rightTriangle, pythagoreanTriples[count++ % pythagoreanTriples.length]);
}, 2000);
