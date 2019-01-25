function makeGraphLoop(vertex, mapping, edges, vertices) {
  if (vertices.includes(vertex) === false) {
    // Don't traverse vertices we've already traversed. Prevents infinite loop.
    vertices.push(vertex);
    if (vertex in mapping) {
      for (const nextVertex of mapping[vertex]) {
        edges.push([vertex, nextVertex]);
        makeGraphLoop(nextVertex, mapping, edges, vertices);
      }
    }
  }
}

export function makeGraph(vertex, mapping) {
  const edges = [];
  const vertices = [];
  makeGraphLoop(vertex, mapping, edges, vertices);
  return { edges, vertices };
}

function topologicalSortLoop(edges, visitedEdges, stack, solution) {
  const vertex = stack[stack.length - 1];
  for (const edge of edges.filter(e => e[0] === vertex)) {
    if (visitedEdges.includes(edge)) {
      continue;
    }
    if (solution.includes(edge[1])) {
      // Cross edge.
      continue;
    }
    visitedEdges.push(edge);
    if (
      visitedEdges.some(visitedEdge => visitedEdge[0] === edge[1]) &&
      solution.includes(edge[1]) === false
    ) {
      // Back edge.
      throw new Error('Graph is cyclic.');
    }
    stack.push(edge[1]);
    topologicalSortLoop(edges, visitedEdges, stack, solution);
  }
  solution.unshift(vertex);
  stack.pop();
}

// Edges is an array of pairs where the first entry in each pair is a vertex to
// be visited *before* the second entry in the pair.
// E.g., `[['a', 'b'], ['a', 'c']]` which has a solution of either
// `['a', 'b', 'c']` or `['a', 'c', 'b']`.
export function topologicalSort(graph) {
  const visitedEdges = [];
  const stack = [];
  const solution = [];
  while (solution.length < graph.vertices.length) {
    stack.push(graph.vertices.find(v => solution.includes(v) === false));
    try {
      topologicalSortLoop(graph.edges, visitedEdges, stack, solution);
    } catch (err) {
      if (err.message === 'Graph is cyclic.') {
        // There is no solution to a cyclic graph. Return undefined.
        return;
      } else {
        throw err;
      }
    }
  }
  return solution;
}
