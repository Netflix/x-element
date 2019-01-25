import { suite, it } from './runner.js';
import Graph from '../etc/graph.js';

const graphsAreEqual = (a, b) => {
  // Order of nodes and edges should not matter.
  return (
    a.nodes.length === b.nodes.length &&
    a.nodes.every(n => b.nodes.includes(n)) &&
    a.edges.length === b.edges.length &&
    a.edges.every(ae => b.edges.find(be => be[0] === ae[0] && be[1] === ae[1]))
  );
};

const checkSolution = (solution, graph) => {
  // We have to have the same nodes in our solution as we do in the graph.
  if (
    solution.length !== graph.nodes.length ||
    graph.nodes.some(node => solution.includes(node) === false)
  ) {
    return false;
  }
  // For each edge, "edge[0]" must precede "edge[1]" in "solution".
  for (const edge of graph.edges) {
    if (solution.indexOf(edge[1]) <= solution.indexOf(edge[0])) {
      return false;
    }
  }
  return true;
};

suite('Graph.createFromNodeMapping', () => {
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

  const actual1 = Graph.createFromNodeMapping('a', dependencyToDependents);
  const expected1 = {
    edges: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['b', 'd'], ['a', 'c']],
    nodes: ['a', 'b', 'c', 'd'],
  };
  it('can create a graph for "a"', graphsAreEqual(actual1, expected1));

  const actual2 = Graph.createFromNodeMapping('b', dependencyToDependents);
  const expected2 = {
    edges: [['b', 'c'], ['c', 'd'], ['b', 'd']],
    nodes: ['b', 'c', 'd'],
  };
  it('can create a graph for "b"', graphsAreEqual(actual2, expected2));

  const actual3 = Graph.createFromNodeMapping('a', { a: ['a'] });
  const expected3 = { edges: [['a', 'a']], nodes: ['a'] };
  it('handles simple cycles', graphsAreEqual(actual3, expected3));

  const actual4 = Graph.createFromNodeMapping('a', {
    a: ['b'],
    b: ['c'],
    c: ['a'],
  });
  const expected4 = {
    edges: [['a', 'b'], ['b', 'c'], ['c', 'a']],
    nodes: ['a', 'b', 'c'],
  };
  it('handles complex cycles', graphsAreEqual(actual4, expected4));
});

// Note that Directed Acyclic Graphs can have multiple, correct solutions.
suite('Graph.sort (for handling computed property dependencies)', () => {
  const graph1 = new Graph(['c', 'b', 'a'], [['a', 'b'], ['b', 'c']]);
  const actual1 = Graph.sort(graph1);
  const expected1 = ['a', 'b', 'c'];
  it(
    'can solve a simple graph',
    checkSolution(expected1, graph1) && checkSolution(actual1, graph1)
  );

  const graph2 = new Graph(['a', 'b', 'c'], [['a', 'b']]);
  const actual2 = Graph.sort(graph2);
  const expected2 = ['c', 'a', 'b'];
  it(
    'can solve a disconnected graph',
    checkSolution(expected2, graph2) && checkSolution(actual2, graph2)
  );

  const graph3 = new Graph(
    ['a', 'b', 'c', 'd'],
    [['a', 'b'], ['a', 'd'], ['b', 'd'], ['c', 'd']]
  );
  const actual3 = Graph.sort(graph3);
  const expected3 = ['c', 'a', 'b', 'd'];
  it(
    'can solve a complex graph',
    checkSolution(expected3, graph3) && checkSolution(actual3, graph3)
  );

  const graph4 = new Graph(['a'], [['a', 'a']]);
  const actual4 = Graph.sort(graph4);
  it('can find simple cycles', actual4 === undefined);

  const graph5 = new Graph(
    ['a', 'b', 'c', 'd'],
    [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'b']]
  );
  const actual5 = Graph.sort(graph5);
  it('can find complex cycles', actual5 === undefined);

  const graph6 = new Graph(
    ['prop1', 'prop2', 'prop3'],
    [['prop1', 'prop2'], ['prop1', 'prop3'], ['prop2', 'prop3']]
  );
  const actual6 = Graph.sort(graph6);
  const expected6 = ['prop1', 'prop2', 'prop3'];
  it(
    'can have anything for node names',
    checkSolution(expected6, graph6) && checkSolution(actual6, graph6)
  );
});
