import { Edge, MarkerType } from "@xyflow/react";
import {
  Mode360,
  Operation360,
  OperationMachine,
  TerminateSimulation_E,
  ToOp_E,
} from "../entities/OpMachine.ts";
import dagre from "@dagrejs/dagre";

type OperationNode = {
  id: string;
  type: "custom";
  data: {
    operation: Operation360;
    isInitial?: boolean;
    isBiDirectional?: boolean;
    dataFlow?: "LL" | "RR";
    isEndNode?: boolean;
    hasEndNode?: boolean;
  };
  position: { x: number; y: number };
  className?: string;
};

const nodeWidth = 280;
const nodeHeight = 100;

export const buildGraphElements = (opMachine: OperationMachine) => {
  console.log("opMachine", opMachine);
  const newNodes: OperationNode[] = [];
  const newEdges: Edge[] = [];
  const processedOperations = new Set<string>();
  const validOpIds = new Set(opMachine.getOperations().map((op) => op.getId()));

  opMachine.getOperations().forEach((op) => {
    if (op.getIsInitial()) {
      processOperation(op, newNodes, newEdges, processedOperations, validOpIds);
    }
  });

  opMachine.getOperations().forEach((op) => {
    processOperation(op, newNodes, newEdges, processedOperations, validOpIds);
  });

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    newNodes,
    newEdges
  );
  return { nodes: layoutedNodes, edges: layoutedEdges };
};

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: "tight-tree",
    nodesep: 300,
    ranksep: 100,
    edgesep: 300,
    marginx: 50,
  });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph, { minlen: 3 });
  const layoutedNodes = nodes.map((node, index) => {
    const dagreNode = dagreGraph.node(node.id);
    let position_x = dagreNode.x - nodeWidth / 2;
    let position_y = dagreNode.y - nodeHeight / 2;
    if (index === nodes.length - 1 && index > 0) {
      const previousNode = dagreGraph.node(nodes[index - 1].id);
      position_x = previousNode.x + nodeWidth * 1.5;
    }
    return {
      ...node,
      position: { x: position_x, y: position_y },
    };
  });
  return { nodes: layoutedNodes, edges };
};

const processOperation = (
  operation,
  newNodes,
  newEdges,
  processedOperations,
  validOpIds: Set<string>
) => {
  if (processedOperations.has(operation.getId())) return;
  processedOperations.add(operation.getId());

  const currentNode: OperationNode = {
    id: operation.getId(),
    type: "custom",
    data: { operation: operation, isInitial: operation.getIsInitial() },
    position: { x: 0, y: 0 },
  };

  // Se agrega el nodo de la operación una única vez
  newNodes.push(currentNode);

  operation.getEvents().forEach((event, index) => {
    const effect = event.getEffect();
    let isBidirectional = false;
    if (effect instanceof ToOp_E) {
      const targetOp = effect.getTargetOperation();
      if (!validOpIds.has(targetOp.getId())) return;
      const eventsFromTarget = targetOp.getEvents();
      if (
        eventsFromTarget.some((ev) => {
          const t_ef = ev.getEffect();
          if (t_ef instanceof ToOp_E) {
            const t_op = t_ef.getTargetOperation();
            return t_op.getId() === operation.getId();
          }
          return false;
        })
      ) {
        isBidirectional = true;
      }
      const newEdge: Edge = {
        id: `${operation.getId()}-${targetOp.getId()}`,
        source: operation.getId(),
        target: targetOp.getId(),
        label: event.getTrigger().getTriggerName(),
        type: "start-end",
        markerEnd: { type: MarkerType.ArrowClosed },
        className: "text-sm",
        animated: true,
      };
      if (isBidirectional) {
        const flow = processedOperations.has(targetOp.getId()) ? "LL" : "RR";
        currentNode.data = {
          dataFlow: flow,
          isBiDirectional: true,
          ...currentNode.data,
        };
        newEdge.data = {
          startLabel:
            flow === "LL" ? event.getTrigger().getTriggerName() : undefined,
          endLabel:
            flow === "RR" ? event.getTrigger().getTriggerName() : undefined,
        };
      }
      newEdges.push(newEdge);
      processOperation(
        targetOp,
        newNodes,
        newEdges,
        processedOperations,
        validOpIds
      );
    } else if (effect instanceof TerminateSimulation_E) {
      currentNode.data = { hasEndNode: true, ...currentNode.data };
      // Se agrega el nodo "terminate" solo si no existe
      if (!newNodes.some((n) => n.id === "terminate")) {
        newNodes.push({
          id: "terminate",
          data: {
            operation: new Operation360(
              "",
              "End Simulation",
              new Mode360("", "")
            ),
            isEndNode: true,
          },
          type: "custom",
          position: { x: 0, y: 0 },
          className: "px-4 py-2 rounded border border-red-500",
        });
      }
      newEdges.push({
        id: `${operation.getId()}-terminate-${index}`,
        source: operation.getId(),
        target: "terminate",
        sourceHandle: "terminate-sim-source",
        label: event.getTrigger().getTriggerName(),
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        className: "text-sm",
        animated: true,
      });
      // Se agrega el nodo "0" solo si no existe
      if (!newNodes.some((n) => n.id === "0")) {
        newNodes.push({
          id: "0",
          data: {
            operation: new Operation360("", "", new Mode360("", "")),
            isEndNode: true,
          },
          type: "custom",
          position: { x: 0, y: 0 },
          className: "px-4 py-2 rounded border border-red-500",
        });
      }
    }
  });
};
