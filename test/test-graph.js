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

const checkGraph = graph => {
  // We have to have the same nodes in our solution as we do in the graph.
  if (
    graph.solution.length !== graph.nodes.length ||
    graph.nodes.some(node => graph.solution.includes(node) === false)
  ) {
    return false;
  }
  // For each edge, "edge[0]" must precede "edge[1]" in "solution".
  for (const edge of graph.edges) {
    if (graph.solution.indexOf(edge[1]) <= graph.solution.indexOf(edge[0])) {
      return false;
    }
  }
  return true;
};

suite('Graph.createFromNode', () => {
  const nodes = ['a', 'b', 'c', 'd'];
  const edges = [['a', 'b'], ['a', 'c'], ['b', 'c'], ['b', 'd'], ['c', 'd']];
  const graph = new Graph(nodes, edges);
  const actual1 = Graph.createFromNode(graph, 'a');
  const expected1 = new Graph(
    ['a', 'b', 'c', 'd'],
    [['a', 'b'], ['b', 'c'], ['c', 'd'], ['b', 'd'], ['a', 'c']]
  );
  it('can create a graph for "a"', graphsAreEqual(actual1, expected1));

  const actual2 = Graph.createFromNode(graph, 'b');
  const expected2 = new Graph(
    ['b', 'c', 'd'],
    [['b', 'c'], ['c', 'd'], ['b', 'd']]
  );
  it('can create a graph for "b"', graphsAreEqual(actual2, expected2));
});

// Note that Directed Acyclic Graphs can have multiple, correct solutions.
suite('Graph.sort (for handling computed property dependencies)', () => {
  const graph1 = new Graph(['c', 'b', 'a'], [['a', 'b'], ['b', 'c']]);
  it('can solve a simple graph', checkGraph(graph1));

  const graph2 = new Graph(['a', 'b', 'c'], [['a', 'b']]);
  it('can solve a disconnected graph', checkGraph(graph2));

  const graph3 = new Graph(
    ['a', 'b', 'c', 'd'],
    [['a', 'b'], ['a', 'd'], ['b', 'd'], ['c', 'd']]
  );
  it('can solve a complex graph', checkGraph(graph3));

  const graph4 = new Graph(
    ['prop1', 'prop2', 'prop3'],
    [['prop1', 'prop2'], ['prop1', 'prop3'], ['prop2', 'prop3']]
  );
  it('can have anything for node names', checkGraph(graph4));

  let simpleCycles = false;
  try {
    new Graph(['a'], [['a', 'a']]);
  } catch (err) {
    simpleCycles = err.message === 'Graph is cyclic.';
  }
  it('can find simple cycles', simpleCycles);

  let complexCycles = false;
  try {
    new Graph(
      ['a', 'b', 'c', 'd'],
      [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'b']]
    );
  } catch (err) {
    complexCycles = err.message === 'Graph is cyclic.';
  }
  it('can find complex cycles', complexCycles);
});
