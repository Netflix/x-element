export default class Graph {
  constructor(nodes, edges) {
    // Defend against mutations during sorting by freezing nodes and edges.
    Reflect.defineProperty(this, 'nodes', { value: Object.freeze([...nodes]) });
    Reflect.defineProperty(this, 'edges', { value: Object.freeze([...edges]) });
    for (const edge of this.edges) {
      Object.freeze(edge);
    }
  }

  static _makeGraphLoop(n, mapping, edges, nodes) {
    if (nodes.includes(n) === false) {
      // Don't traverse nodes we've already traversed. Prevents infinite loop.
      nodes.push(n);
      if (n in mapping) {
        for (const m of mapping[n]) {
          edges.push([n, m]);
          this._makeGraphLoop(m, mapping, edges, nodes);
        }
      }
    }
  }

  static createFromNodeMapping(node, mapping) {
    const edges = [];
    const nodes = [];
    this._makeGraphLoop(node, mapping, edges, nodes);
    return new Graph(nodes, edges);
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
    // If there are remaining edges, the graph is cyclic; return undefined.
    if (edges.length === 0) {
      return solution;
    }
  }
}
