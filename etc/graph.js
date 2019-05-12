export default class Graph {
  constructor(nodes, edges) {
    // Defend against mutations during sorting by freezing nodes and edges.
    Reflect.defineProperty(this, 'nodes', { value: Object.freeze([...nodes]) });
    Reflect.defineProperty(this, 'edges', { value: Object.freeze([...edges]) });
    for (const edge of this.edges) {
      Object.freeze(edge);
    }
    // Sort immediately to prevent instantiation of cyclic graphs.
    Reflect.defineProperty(this, 'solution', {
      value: Object.freeze(Graph.sort(this)),
    });
    Reflect.defineProperty(this, 'roots', {
      value: Object.freeze(
        nodes.filter(node => edges.every(edge => edge[1] !== node))
      ),
    });
    this._nodeMap = new Map();
  }

  static *createFromNodeGenerator(graph, node, seen = []) {
    if (seen.includes(node) === false) {
      // Don't traverse nodes we've already traversed. Prevents infinite loop.
      seen.push(node);
      yield { node };
      const edges = graph.edges.filter(testEdge => testEdge[0] === node);
      for (const edge of edges) {
        yield { edge };
        const next = edge[1];
        for (const datum of this.createFromNodeGenerator(graph, next, seen)) {
          yield datum;
        }
      }
    }
  }

  // Create a graph of all nodes/edges related to the give node.
  static createFromNode(graph, node) {
    if (graph instanceof Graph === false) {
      throw new Error('Cannot call createFromNode on non-Graph instance.');
    }
    const edges = [];
    const nodes = [];
    for (const datum of this.createFromNodeGenerator(graph, node)) {
      if (datum.edge) {
        edges.push(datum.edge);
      }
      if (datum.node) {
        nodes.push(datum.node);
      }
    }
    return new Graph(nodes, edges);
  }

  fromNode(node) {
    if (this._nodeMap.has(node) === false) {
      this._nodeMap.set(node, this.constructor.createFromNode(this, node));
    }
    return this._nodeMap.get(node);
  }

  static sort(graph) {
    // Implements Kahn's algorithm for topological sorting:
    //
    //   solution ← empty list that will contain the sorted elements
    //   nodes ← set of all nodes with no incoming edge
    //   while nodes is non-empty do
    //     remove a node currentNode from nodes
    //     add currentNode to tail of solution
    //     for each node testNode with an edge testEdge from currentNode to testNode do
    //       remove edge testEdge from edges
    //       if testNode has no other incoming edges then
    //         insert testNode into nodes
    //   if edges then
    //     return undefined (graph has at least one cycle)
    //   else
    //     return solution (a topologically sorted list)
    //
    // Assumptions:
    //
    //   1. Each node in each edge in "graph.edges" is in "graph.nodes".
    //   2. Each node in "graph.nodes" is unique in the list.
    //   3. Each edge in "graph.edges" is unique in the list.
    if (graph instanceof Graph === false) {
      throw new Error('Cannot call topologicalSort on non-Graph instance.');
    }
    const edges = [...graph.edges];
    const solution = [];
    const hasNoIncomingEdges = node => edges.every(edge => edge[1] !== node);
    const nodes = new Set(graph.nodes.filter(hasNoIncomingEdges));
    while (nodes.size) {
      const currentNode = nodes.values().next().value;
      nodes.delete(currentNode);
      solution.push(currentNode);
      // Loop over a copy of "edges" to prevent mutation while looping.
      for (const testEdge of [...edges]) {
        if (testEdge[0] === currentNode) {
          const testNode = testEdge[1];
          edges.splice(edges.indexOf(testEdge), 1);
          if (hasNoIncomingEdges(testNode)) {
            nodes.add(testNode);
          }
        }
      }
    }
    // If there are remaining edges, the graph is cyclic; throw.
    if (edges.length !== 0) {
      throw new Error('Graph is cyclic.');
    }
    return solution;
  }
}
