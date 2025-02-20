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
import OperationNode from "../operation/operation-node.tsx";
import "@xyflow/react/dist/style.css";
import {
  Mode360,
  Operation360,
  TerminateSimulation_E,
  ToOp_E,
} from "../../entities/OpMachine.ts";

import CustomEdge from "../edges/CustomEdge.tsx";
import CustomEdgeOther from "../edges/CustomEdgeOther.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import { buildGraphElements } from "../../utils/nodeOperations.ts";

const OperationMachineBoard: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const refreshNodes = (operations: Operation360[]) => {
    console.log("operations", operations);
    const { nodes: newNodes, edges: newEdges } = buildGraphElements(opMachine);

    setNodes(newNodes);
    setEdges(newEdges);
    setTimeout(() => {
      fitView();
    }, 300);
  };

  useEffect(() => {
    fitView();
  }, [edges]);

  useEffect(() => {
    console.log("opMachine", opMachine.getOperations());
    refreshNodes(opMachine.getOperations());
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
        zoomOnScroll={true}
        zoomOnPinch={false}
        style={{ width: "100%" }}
        nodesDraggable
      >
        <Controls showInteractive={false} />
        <Background gap={1} color="transparent" />
      </ReactFlow>
    </Box>
  );
};

export default OperationMachineBoard;
