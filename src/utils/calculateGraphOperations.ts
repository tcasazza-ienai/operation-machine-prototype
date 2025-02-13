import {
  Operation360,
  TerminateSimulation_E,
  ToOp_E,
} from "../entities/OpMachine.ts";

interface NodePosition {
  op?: Operation360;
  id: string;
  x: number;
  y: number;
  level?: number;
  endNode?: boolean;
}

type OperationNode = {
  id: string;
  type: "custom";
  data: {
    label: string;
    mode?: string;
  };
  position: {
    x: number;
    y: number;
  };
};

// export const calculateGraphLayout = (operations: Operation360[]) => {
//   // Constants for layout
//   const NODE_SPACING_X = 300;
//   const NODE_SPACING_Y = 200;
//   const START_X = 50;
//   const START_Y = 50;

//   // Build adjacency list representation of the graph
//   const graph = new Map<string, string[]>();

//   operations.forEach((op) => {
//     const neighbors: string[] = [];

//     // Analyze events to find transitions
//     op.getEvents().forEach((event) => {
//       const effect = event.getEffect();
//       if (effect instanceof ToOp_E) {
//         const targetOpId = effect.getTargetId();
//         if (!neighbors.includes(targetOpId)) {
//           neighbors.push(targetOpId);
//         }
//       }
//     });

//     graph.set(op.getId(), neighbors);
//   });

//   // Add special "End Simulation" node for terminate effects
//   const END_SIMULATION_NODE = "End Simulation";
//   operations.forEach((op) => {
//     op.getEvents().forEach((event) => {
//       const effect = event.getEffect();
//       if (effect instanceof TerminateSimulation_E) {
//         const neighbors = graph.get(op.getId()) || [];
//         if (!neighbors.includes(END_SIMULATION_NODE)) {
//           neighbors.push(END_SIMULATION_NODE);
//           graph.set(op.getId(), neighbors);
//         }
//       }
//     });
//   });

//   // Find entry points (nodes with no incoming edges)
//   const incomingEdges = new Map<string, number>();
//   operations.forEach((op) => {
//     const opId = op.getId();
//     if (!incomingEdges.has(opId)) {
//       incomingEdges.set(opId, 0);
//     }
//     const neighbors = graph.get(opId) || [];
//     neighbors.forEach((neighbor) => {
//       incomingEdges.set(neighbor, (incomingEdges.get(neighbor) || 0) + 1);
//     });
//   });

//   const entryPoints = Array.from(incomingEdges.entries())
//     .filter(([_, count]) => count === 0)
//     .map(([node]) => node);

//   // Assign levels to nodes using modified BFS
//   const levels = new Map<string, number>();
//   const visited = new Set<string>();
//   const queue: [string, number][] = entryPoints.map((node) => [node, 0]);

//   while (queue.length > 0) {
//     const [node, level] = queue.shift()!;

//     if (!visited.has(node)) {
//       levels.set(node, Math.max(level, levels.get(node) || 0));
//       visited.add(node);

//       const neighbors = graph.get(node) || [];
//       neighbors.forEach((neighbor) => {
//         // Place "End Simulation" node at a deeper level
//         const nextLevel =
//           neighbor === END_SIMULATION_NODE ? level + 2 : level + 1;

//         if (!visited.has(neighbor)) {
//           queue.push([neighbor, nextLevel]);
//         }
//       });
//     }
//   }

//   // Group nodes by level
//   const nodesByLevel = new Map<number, string[]>();
//   levels.forEach((level, node) => {
//     if (!nodesByLevel.has(level)) {
//       nodesByLevel.set(level, []);
//     }
//     nodesByLevel.get(level)!.push(node);
//   });

//   // Calculate final positions
//   const positions = new Map<string, NodePosition>();
//   nodesByLevel.forEach((nodes, level) => {
//     // Center nodes within their level
//     const levelWidth = nodes.length * NODE_SPACING_X;
//     const startX = START_X + NODE_SPACING_X * level;

//     nodes.forEach((node, index) => {
//       const y = START_Y + index * NODE_SPACING_Y;
//       positions.set(node, {
//         id: node,
//         x: startX,
//         y,
//         level,
//       });
//     });
//   });

//   // Handle cycles by adjusting positions of nodes with backward edges
//   graph.forEach((neighbors, node) => {
//     neighbors.forEach((neighbor) => {
//       const nodeLevel = levels.get(node)!;
//       const neighborLevel = levels.get(neighbor)!;

//       if (neighborLevel <= nodeLevel && neighbor !== END_SIMULATION_NODE) {
//         // This is a backward edge, adjust position
//         const nodePos = positions.get(node)!;
//         const neighborPos = positions.get(neighbor)!;

//         // Move the target node slightly to the right if it's a backward edge
//         positions.set(neighbor, {
//           ...neighborPos,
//           x: neighborPos.x + NODE_SPACING_X / 2,
//           y: neighborPos.y + NODE_SPACING_Y / 4, // Also shift slightly down
//         });
//       }
//     });
//   });

//   return Array.from(positions.values());
// };

export const calculateGraphLayout_v2 = (operations: Operation360[]) => {
  // Constants for layout
  const NODE_SPACING_X = 300;
  const NODE_SPACING_Y = 200;
  const START_X = 50;
  const START_Y = 50;

  //End Simulation
  const opsThatPointToEnd: Operation360[] = [];

  // Build adjacency list representation of the graph
  const graph = new Map<string, Operation360[]>();

  operations.forEach((op) => {
    const neighbors: Operation360[] = [];

    // Analyze events to find transitions
    op.getEvents().forEach((event) => {
      const effect = event.getEffect();
      if (effect instanceof ToOp_E) {
        const targetOp = effect.getTargetOperation();
        if (!neighbors.includes(targetOp)) {
          neighbors.push(targetOp);
        }
      }
    });

    graph.set(op.getId(), neighbors);
  });

  // Add special "End Simulation" node for terminate effects
  operations.forEach((op) => {
    op.getEvents().forEach((event) => {
      const effect = event.getEffect();
      if (effect instanceof TerminateSimulation_E) {
        opsThatPointToEnd.push(op);
      }
    });
  });

  // Find entry points (nodes with no incoming edges)
  const incomingEdges = new Map<Operation360, number>();
  operations.forEach((op) => {
    const opId = op.getId();
    if (!incomingEdges.has(op)) {
      incomingEdges.set(op, 0);
    }
    const neighbors = graph.get(opId) || [];
    neighbors.forEach((neighbor) => {
      incomingEdges.set(neighbor, (incomingEdges.get(neighbor) || 0) + 1);
    });
  });

  // Find entry points based on isInitial flag first, then fall back to zero incoming edges
  let entryPoints: Operation360[] = operations.filter((op) =>
    op.getIsInitial()
  );

  // If no initial states marked, try to find nodes with no incoming edges
  if (entryPoints.length === 0) {
    entryPoints = Array.from(incomingEdges.entries())
      .filter(([_, count]) => count === 0)
      .map(([node]) => node);

    // If still no entry points found (due to cycles), use the first operation
    if (entryPoints.length === 0 && operations.length > 0) {
      entryPoints.push(operations[0]);
    }
  }

  // Assign levels to nodes using modified BFS
  const levels = new Map<Operation360, number>();
  const visited = new Set<Operation360>();
  const queue: [Operation360, number][] = entryPoints.map((node) => [node, 0]);
  let maxLevel = 0;

  while (queue.length > 0) {
    const [node, level] = queue.shift()!;

    if (!visited.has(node)) {
      levels.set(node, Math.max(level, levels.get(node) || 0));
      visited.add(node);

      const neighbors = graph.get(node.getId()) || [];
      neighbors.forEach((neighbor) => {
        // Place "End Simulation" node at a deeper level
        const nextLevel = level + 1;
        if (!visited.has(neighbor)) {
          queue.push([neighbor, nextLevel]);
        }
      });
    }
    maxLevel = level;
  }

  // Group nodes by level
  const nodesByLevel = new Map<number, Operation360[]>();
  levels.forEach((level, node) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
  });

  let lastXPosition;
  let lastYPosition;

  // Calculate final positions
  const positions = new Map<Operation360, NodePosition>();
  nodesByLevel.forEach((nodes, level) => {
    const startX = START_X + NODE_SPACING_X * level;
    nodes.forEach((node, index) => {
      const y = START_Y + index * NODE_SPACING_Y;
      positions.set(node, {
        op: node,
        id: node.getId(),
        x: startX,
        y,
        level,
      });

      lastXPosition = START_X + NODE_SPACING_X * level;
      lastYPosition = START_Y + index * NODE_SPACING_Y;
    });
  });

  // Handle cycles by adjusting positions of nodes with backward edges
  graph.forEach((neighbors, node) => {
    neighbors.forEach((neighbor) => {
      const currentNode = operations.filter((op) => op.getId() === node)[0];
      const nodeLevel = levels.get(currentNode)!;
      const neighborLevel = levels.get(neighbor)!;

      if (neighborLevel <= nodeLevel) {
        // This is a backward edge, adjust position
        const neighborPos = positions.get(neighbor)!;

        // Move the target node slightly to the right if it's a backward edge
        positions.set(neighbor, {
          ...neighborPos,
          x: neighborPos.x + NODE_SPACING_X / 2,
          y: neighborPos.y + NODE_SPACING_Y / 4, // Also shift slightly down
        });
      }
    });
  });

  const nodePositions = Array.from(positions.values());
  nodePositions.push({
    id: "End Simulation",
    endNode: true,
    x: lastXPosition + NODE_SPACING_X * maxLevel,
    y: lastYPosition + nodePositions.length * NODE_SPACING_Y,
    level: maxLevel,
  });
  return nodePositions;
};

export const mapNodes_v2 = (nodes: NodePosition[]): OperationNode[] => {
  return nodes.map((node) => ({
    id: node.endNode ? "END SIMULATION" : node.id,
    type: "custom",
    data: {
      label: node.endNode
        ? "End Simulation"
        : node.op?.getOpName() ?? "Unknown Node",
      mode: node.op?.getOpMode().getModeName() ?? undefined,
    },
    position: {
      x: node.x,
      y: node.y,
    },
    className: "px-4 py-2 rounded border border-red-500 text-[18px]",
  }));
};
