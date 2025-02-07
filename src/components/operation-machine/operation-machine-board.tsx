import { Box } from "@mui/material";
import {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Operation,
  OperationMachine,
} from "../../types/operation-machine.types";
import operationMachine1 from "../../data/operation-machines/operation-machine-1.json";
import {
  mappingToEdgesOperations,
  mappingToNodeOperations,
} from "../../utils/nodeOperations.ts";
import OperationNode from "../operation/operation-node.tsx";
import "@xyflow/react/dist/style.css";
import {
  Operation360,
  TerminateSimulation_E,
  ToOp_E,
} from "../../entities/OpMachine.ts";

import dagre from "@dagrejs/dagre";
import CustomEdge from "../edges/CustomEdge.tsx";

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure graph settings
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: "network-simplex",
    nodesep: 80,
    ranksep: 100,
    edgesep: 50,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Get new node positions
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

type OperationNode = {
  id: string;
  data: {
    label: string;
    isInitial?: boolean;
  };
  position: { x: number; y: number };
  className?: string;
};

const OperationMachineBoard: React.FC<{ operations: Operation360[] }> = ({
  operations,
}) => {
  const [operationMachine, setOperationMachine] =
    useState<OperationMachine>(operationMachine1);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const buildGraphElements = useCallback(() => {
    const newNodes: OperationNode[] = [];
    const newEdges: Edge[] = [];
    const processedOperations = new Set();
    let hasTerminateNode = false;

    // Helper function to process operations recursively
    const processOperation = (operation) => {
      if (processedOperations.has(operation.getId())) return;
      processedOperations.add(operation.getId());

      // Add node for current operation
      newNodes.push({
        id: operation.getId(),
        data: {
          label: operation.getOpName(),
          isInitial: operation.getIsInitial(),
        },
        position: { x: 0, y: 0 }, // Initial position, will be calculated by dagre
        className: `px-4 py-2 rounded border ${
          operation.getIsInitial() ? "border-green-500" : "border-gray-300"
        }`,
      });

      // Process events and create edges
      operation.getEvents().forEach((event, index) => {
        const effect = event.getEffect();
        let isBidirectional = false;

        if (effect instanceof ToOp_E) {
          const targetOp = effect.getTargetOperation();

          //Check if target operation points to this operation
          const eventsFromtTargetOperation = targetOp.getEvents();
          if (eventsFromtTargetOperation.some(ev => {
            const t_ef = ev.getEffect();
            if (t_ef instanceof ToOp_E) {
              const t_op = t_ef.getTargetOperation();
              return t_op.getId() === operation.getId();
            }
          })) {
            isBidirectional = true;
          }

          let newEdge: Edge = {
            id: `${operation.getId()}-${targetOp.getId()}`,
            source: operation.getId(),
            target: targetOp.getId(),
            label: event.getTrigger().getTriggerName(),
            type: "start-end",
            markerEnd: { type: MarkerType.ArrowClosed },
            className: "text-sm",
            animated: true
          }

          if (isBidirectional) {
            let data = {}
            //If it is bidirectional then we can check if there is already an edge with data labels
          const oppositeEdge: Edge | undefined = edges.find((edge: Edge) => edge.id === `${targetOp.getId()}-${operation.getId()}`)

          if (!oppositeEdge) {
            //no edge yet, assign data label as startLabel
            data = {
              startLabel: event.getTrigger().getTriggerName()
            }
          } else {
            data = {
              endLabel: event.getTrigger().getTriggerName()
            }
          }
          newEdge = {
            ...newEdge,
            data: data
          }
          }
          
          // //Check if target operation already has data label
          // const targetEdge = edges.find((edge: Edge) => edge.id ===  `${targetOp.getId()}-${operation.getId()}`)


          newEdges.push(newEdge);

          // Recursively process target operation
          processOperation(targetOp);
        } else if (effect instanceof TerminateSimulation_E) {
          if (!hasTerminateNode) {
            newNodes.push({
              id: "terminate",
              data: { label: "End Simulation" },
              position: { x: 0, y: 0 },
              className: "px-4 py-2 rounded border border-red-500",
            });
            hasTerminateNode = true;
          }

          newEdges.push({
            id: `${operation.getId()}-terminate-${index}`,
            source: operation.getId(),
            target: "terminate",
            label: event.getTrigger().getTriggerName(),
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            className: "text-sm",
            animated: true
          });
        }
      });
    };

    // Start processing from initial operations
    operations.forEach((op) => {
      if (op.getIsInitial()) {
        processOperation(op);
      }
    });

    // Process any remaining operations that weren't reached from initial states
    operations.forEach((op) => {
      processOperation(op);
    });

    // Apply layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges
    );

    return { nodes: layoutedNodes, edges: layoutedEdges };
  }, [operations]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = buildGraphElements();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [operations, buildGraphElements, setNodes, setEdges]);

  //   const refreshNodes = (operations: Operation[]) => {
  //     const initialOperations = operations;
  //     initialOperations.push({
  //       op_name: "",
  //       mode: { mode_name: "", pointing: { pointer: "", target: "" } },
  //       events: [],
  //     });
  //     const initialNodes = mappingToNodeOperations(initialOperations);

  //     setNodes(initialNodes as never[]);
  //   };

  //   useEffect(() => {
  //     if (nodes.length > 0) {
  //       setEdges(
  //         mappingToEdgesOperations(operationMachine.operations) as never[]
  //       );
  //     }
  //     fitView();
  //   }, [nodes]);

  //   useEffect(() => {
  //     fitView();
  //   }, [edges]);

  //   useEffect(() => {
  //     refreshNodes(operationMachine.operations);
  //   }, [operationMachine]);
  console.log('Edges: ', edges)

  const nodeTypes = {
    custom: OperationNode,
  };
  const edgeTypes = {
    'start-end': CustomEdge
  }
  return (
    <Box
      sx={{
        border: "2px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        style={{ width: "100%" }}
        nodesDraggable
      >
        <Background gap={1} color="transparent" />
      </ReactFlow>
    </Box>
  );
};

export default OperationMachineBoard;
