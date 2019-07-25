import { it, assert } from '../../../@netflix/x-test/x-test.js';
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

// Note that Directed Acyclic Graphs can have multiple, correct solutions.
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

const getDependencyToDependents = () => {
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
  return dependencyToDependents;
};

it('createFromNodeMapping can create a graph for "a"', () => {
  const dependencyToDependents = getDependencyToDependents();
  const actual = Graph.createFromNodeMapping('a', dependencyToDependents);
  const expected = {
    edges: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['b', 'd'], ['a', 'c']],
    nodes: ['a', 'b', 'c', 'd'],
  };
  assert(graphsAreEqual(actual, expected));
});

it('createFromNodeMapping can create a graph for "b"', () => {
  const dependencyToDependents = getDependencyToDependents();
  const actual = Graph.createFromNodeMapping('b', dependencyToDependents);
  const expected = {
    edges: [['b', 'c'], ['c', 'd'], ['b', 'd']],
    nodes: ['b', 'c', 'd'],
  };
  assert(graphsAreEqual(actual, expected));
});

it('createFromNodeMapping handles simple cycles', () => {
  const actual = Graph.createFromNodeMapping('a', { a: ['a'] });
  const expected = { edges: [['a', 'a']], nodes: ['a'] };
  assert(graphsAreEqual(actual, expected));
});

it('createFromNodeMapping handles complex cycles', () => {
  const actual = Graph.createFromNodeMapping('a', {
    a: ['b'],
    b: ['c'],
    c: ['a'],
  });
  const expected = {
    edges: [['a', 'b'], ['b', 'c'], ['c', 'a']],
    nodes: ['a', 'b', 'c'],
  };
  assert(graphsAreEqual(actual, expected));
});

it('can sort solve a simple graph', () => {
  const graph = new Graph(['c', 'b', 'a'], [['a', 'b'], ['b', 'c']]);
  const actual = Graph.sort(graph);
  const expected = ['a', 'b', 'c'];
  assert(checkSolution(expected, graph));
  assert(checkSolution(actual, graph));
});

it('can sort solve a disconnected graph', () => {
  const graph = new Graph(['a', 'b', 'c'], [['a', 'b']]);
  const actual = Graph.sort(graph);
  const expected = ['c', 'a', 'b'];
  assert(checkSolution(expected, graph));
  assert(checkSolution(actual, graph));
});

it('can sort solve a complex graph', () => {
  const graph = new Graph(
    ['a', 'b', 'c', 'd'],
    [['a', 'b'], ['a', 'd'], ['b', 'd'], ['c', 'd']]
  );
  const actual = Graph.sort(graph);
  const expected = ['c', 'a', 'b', 'd'];
  assert(checkSolution(expected, graph));
  assert(checkSolution(actual, graph));
});

it('can find simple cycles', () => {
  const graph = new Graph(['a'], [['a', 'a']]);
  const actual = Graph.sort(graph);
  assert(actual === undefined);
});

it('can find complex cycles', () => {
  const graph = new Graph(
    ['a', 'b', 'c', 'd'],
    [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'b']]
  );
  const actual = Graph.sort(graph);
  assert(actual === undefined);
});

it('can have anything for node names', () => {
  const graph = new Graph(
    ['prop1', 'prop2', 'prop3'],
    [['prop1', 'prop2'], ['prop1', 'prop3'], ['prop2', 'prop3']]
  );
  const actual = Graph.sort(graph);
  const expected = ['prop1', 'prop2', 'prop3'];
  assert(checkSolution(expected, graph));
  assert(checkSolution(actual, graph));
});
