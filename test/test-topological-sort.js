import { suite, it } from './runner.js';
import { makeGraph, topologicalSort } from '../etc/topological-sort.js';

const checkSort = (a, b) => {
  return a.length === b.length && a.every((ai, i) => ai === b[i]);
};

const checkGraph = (a, b) => {
  return (
    checkSort(a.vertices, b.vertices) &&
    a.edges.length === b.edges.length &&
    a.edges.every((ai, i) => ai[0] === b.edges[i][0] && ai[1] === b.edges[i][1])
  );
};

suite('makeGraph', () => {
  // It's easier to think about dependencies this way, so we compute the define
  // dependentToDependencies and compute dependencyToDependents.
  const dependentToDependencies = {
    b: ['a'],
    c: ['a', 'b'],
    d: ['b', 'c'],
  };
  const dependencyToDependents = {};
  const entries = Object.entries(dependentToDependencies);
  for (const [dependent, dependencies] of entries) {
    for (const dependency of dependencies) {
      if (dependency in dependencyToDependents === false) {
        dependencyToDependents[dependency] = [];
      }
      dependencyToDependents[dependency].push(dependent);
    }
  }

  const actual1 = makeGraph('a', dependencyToDependents);
  const expected1 = {
    edges: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['b', 'd'], ['a', 'c']],
    vertices: ['a', 'b', 'c', 'd'],
  };
  it('can create a graph for "a"', checkGraph(actual1, expected1));

  const actual2 = makeGraph('b', dependencyToDependents);
  const expected2 = {
    edges: [['b', 'c'], ['c', 'd'], ['b', 'd']],
    vertices: ['b', 'c', 'd'],
  };
  it('can create a graph for "b"', checkGraph(actual2, expected2));

  const actual3 = makeGraph('a', { a: ['a'] });
  const expected3 = { edges: [['a', 'a']], vertices: ['a'] };
  it('handles simple cycles', checkGraph(actual3, expected3));

  const actual4 = makeGraph('a', { a: ['b'], b: ['c'], c: ['a'] });
  const expected4 = {
    edges: [['a', 'b'], ['b', 'c'], ['c', 'a']],
    vertices: ['a', 'b', 'c'],
  };
  it('handles complex cycles', checkGraph(actual4, expected4));
});

// Note that Directed Acyclic Graphs can have multiple, correct solutions.
suite('topologicalSort (for handling computed property dependencies)', () => {
  const actual1 = topologicalSort({
    vertices: ['c', 'b', 'a'],
    edges: [['a', 'b'], ['b', 'c']],
  });
  const expected1 = ['a', 'b', 'c'];
  it('can solve a simple graph', checkSort(actual1, expected1));

  const actual2 = topologicalSort({
    vertices: ['a', 'b', 'c'],
    edges: [['a', 'b']],
  });
  const expected2 = ['c', 'a', 'b'];
  it('can solve a disconnected graph', checkSort(actual2, expected2));

  const actual3 = topologicalSort({
    vertices: ['a', 'b', 'c', 'd'],
    edges: [['a', 'b'], ['a', 'd'], ['b', 'd'], ['c', 'd']],
  });
  const expected3 = ['c', 'a', 'b', 'd'];
  it('can solve a complex graph', checkSort(actual3, expected3));

  const actual4 = topologicalSort({ vertices: ['a'], edges: [['a', 'a']] });
  it('can find simple cycles', actual4 === undefined);

  const actual5 = topologicalSort({
    vertices: ['a', 'b', 'c', 'd'],
    edges: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'b']],
  });
  it('can find complex cycles', actual5 === undefined);

  const actual6 = topologicalSort({
    vertices: ['prop1', 'prop2', 'prop3'],
    edges: [['prop1', 'prop2'], ['prop1', 'prop3'], ['prop2', 'prop3']],
  });
  const expected6 = ['prop1', 'prop2', 'prop3'];
  it('can find have anything for vertex names', checkSort(actual6, expected6));
});
