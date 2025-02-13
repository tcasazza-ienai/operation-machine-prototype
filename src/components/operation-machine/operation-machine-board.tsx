import { Box } from "@mui/material";
import {
  Background,
  Controls,
  Edge,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import { Operation } from "../../types/operation-machine.types";
import OperationNode from "../operation/operation-node.tsx";
import "@xyflow/react/dist/style.css";
import {
  Operation360,
  TerminateSimulation_E,
  ToOp_E,
} from "../../entities/OpMachine.ts";

import dagre from "@dagrejs/dagre";
import CustomEdgeOther from "../edges/CustomEdgeOther.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";

const nodeWidth = 280;
const nodeHeight = 100;

const endSimulationOperation: Operation = {
  id: "0",
  op_name: "End Simulation",
};

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure graph settings
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: "tight-tree",
    nodesep: 300,
    ranksep: 100,
    edgesep: 300,
    marginx: 50,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    console.log("NODE SETTING: ", node);
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph, {
    minlen: 3,
  });

  // Get new node positions
  const layoutedNodes = nodes.map((node, index) => {
    const dagreNode = dagreGraph.node(node.id);
    let position_x = dagreNode.x - nodeWidth / 2;
    let position_y = dagreNode.y - nodeHeight / 2;
    if (index === nodes.length - 1) {
      const previousNode = dagreGraph.node(nodes[index - 1].id);
      //position_y = previousNode.y - nodeHeight / 2;
      position_x = previousNode.x + nodeWidth * 1.5;
      console.log("\nTHIS IS THE LAST NOOOOOODE!!!!!\n");
    }

    return {
      ...node,
      position: {
        x: position_x,
        y: position_y,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

type OperationNode = {
  id: string;
  type: "custom";
  data: {
    operation: Operation;
    isInitial?: boolean;
    isBiDirectional?: boolean;
    dataFlow?: "LL" | "RR";
    isEndNode?: boolean;
    hasEndNode?: boolean;
  };
  position: { x: number; y: number };
  className?: string;
};

const OperationMachineBoard: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const [operations, setOperations] = useState<Operation360[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const buildGraphElements = useCallback(() => {
    const newNodes: OperationNode[] = [];
    const newEdges: Edge[] = [];
    const processedOperations = new Set<string>();
    let hasTerminateNode = false;

    // Helper function to process operations recursively
    const processOperation = (operation) => {
      if (processedOperations.has(operation.getId())) return;
      processedOperations.add(operation.getId());

      let currentNode: OperationNode = {
        id: operation.getId(),
        type: "custom",
        data: {
          operation: operation,
          isInitial: operation.getIsInitial(),
        },
        position: { x: 0, y: 0 }, // Initial position, will be calculated by dagre
      };

      // Process events and create edges
      operation.getEvents().forEach((event, index) => {
        const effect = event.getEffect();
        let isBidirectional = false;

        if (effect instanceof ToOp_E) {
          const targetOp = effect.getTargetOperation();

          //Check if target operation points to this operation
          const eventsFromtTargetOperation = targetOp.getEvents();
          if (
            eventsFromtTargetOperation.some((ev) => {
              const t_ef = ev.getEffect();
              if (t_ef instanceof ToOp_E) {
                const t_op = t_ef.getTargetOperation();
                return t_op.getId() === operation.getId();
              }
            })
          ) {
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
            animated: true,
          };

          if (isBidirectional) {
            const flow = processedOperations.has(targetOp.getId())
              ? "LL"
              : "RR";
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

          // //Check if target operation already has data label
          // const targetEdge = edges.find((edge: Edge) => edge.id ===  `${targetOp.getId()}-${operation.getId()}`)
          newNodes.push(currentNode);
          newEdges.push(newEdge);

          // Recursively process target operation
          processOperation(targetOp);
        } else if (effect instanceof TerminateSimulation_E) {
          currentNode.data = {
            hasEndNode: true,
            ...currentNode.data,
          };
          if (!hasTerminateNode) {
            newNodes.push({
              id: "terminate",
              data: { operation: endSimulationOperation, isEndNode: true },
              type: "custom",
              position: { x: 0, y: 0 },
              className: "px-4 py-2 rounded border border-red-500",
            });
            hasTerminateNode = true;
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

  useEffect(() => {
    fitView();
  }, [nodes]);

  console.log("NODES => ", nodes);

  useEffect(() => {
    setOperations(opMachine.getOperations());
  }, [opMachine]);

  const nodeTypes = {
    custom: OperationNode,
  };
  const edgeTypes = {
    "start-end": CustomEdgeOther,
  };
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
        style={{ width: "100%" }}
        deleteKeyCode={""}
        nodesDraggable
      >
        <Controls />
        <Background gap={1} color="transparent" />
      </ReactFlow>
    </Box>
  );
};

export default OperationMachineBoard;

//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
//________________________________________________________________________________________________________
/*
const OperationMachineBoardexample: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const hasFitViewRun = useRef(false);

  const refreshNodes = (operations: Operation[]) => {
    const newNodes = mappingToNodeOperations(operations);
    setTimeout(() => {
      setNodes(newNodes as never[]);
    }, 100);
  };

  useEffect(() => {
    if (nodes.length > 0) {
      setEdges(mappingToEdgesOperations(opMachine.operations) as never[]);
    }
    setTimeout(() => {
      if (!hasFitViewRun.current) {
        fitView();
        hasFitViewRun.current = true;
      }
    }, 200);
  }, [nodes]);

  useEffect(() => {
    //TO DO: Ask about the functionality of what to do when the spacecraft is changed and
    // the operation has a mode with a different system_mode than the selected spacecraft
    refreshNodes(opMachine.operations);
  }, [opMachine]);

  useEffect(() => {
    if (!opMachine.operations.find((op) => op.id == "")) {
      const newOperationMachine = opMachine;
      newOperationMachine.operations.push({
        id: "",
        op_name: "",
        mode: { id: "", name: "", pointing: { pointer: "", target: "" } },
        events: [],
      });
      setOpMachine(newOperationMachine);
    }
  }, []);

  const nodeTypes = {
    custom: OperationNode,
  };
  return (
    <Box sx={operationMachineContainerStyle}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        zoomOnPinch={false}
        style={{ width: "100%" }}
        nodesDraggable
      >
        <Controls />
        <Background gap={1} color="transparent" />
      </ReactFlow>
    </Box>
  );
};

const operationMachineContainerStylebefore = {
  border: "2px solid #ddd",
  borderRadius: "8px",
  height: "70vh",
  display: "flex",
  flexDirection: "column",
  marginTop: "20px",
};

const OperationMachineBoardbefore: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const hasFitViewRun = useRef(false);

  const refreshNodes = (operations: Operation[]) => {
    const newNodes = mappingToNodeOperations(operations);
    setTimeout(() => {
      setNodes(newNodes as never[]);
    }, 100);
  };

  useEffect(() => {
    if (nodes.length > 0) {
      setEdges(mappingToEdgesOperations(opMachine.operations) as never[]);
    }
    setTimeout(() => {
      if (!hasFitViewRun.current) {
        fitView();
        hasFitViewRun.current = true;
      }
    }, 200);
  }, [nodes]);

  useEffect(() => {
    //TO DO: Ask about the functionality of what to do when the spacecraft is changed and
    // the operation has a mode with a different system_mode than the selected spacecraft
    refreshNodes(opMachine.operations);
  }, [opMachine]);

  useEffect(() => {
    if (!opMachine.operations.find((op) => op.id == "")) {
      const newOperationMachine = opMachine;
      newOperationMachine.operations.push({
        id: "",
        op_name: "",
        mode: { id: "", name: "", pointing: { pointer: "", target: "" } },
        events: [],
      });
      setOpMachine(newOperationMachine);
    }
  }, []);

  const nodeTypes = {
    custom: OperationNode,
  };
  return (
    <Box sx={operationMachineContainerStyle}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        zoomOnPinch={false}
        style={{ width: "100%" }}
        nodesDraggable
      >
        <Controls />
        <Background gap={1} color="transparent" />
      </ReactFlow>
    </Box>
  );
};
*/
