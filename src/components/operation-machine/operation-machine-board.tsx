import { Box } from "@mui/material";
import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useEffect } from "react";
import CustomNode from "../operation/custom-node.tsx";
import "@xyflow/react/dist/style.css";
import { Operation360, OperationMachine } from "../../entities/OpMachine.ts";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import { buildGraphElements } from "../../utils/nodeOperations.ts";
import CustomStepEdge from "../edges/CustomStepEdge.tsx";

const OperationMachineBoard: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const refreshNodes = () => {
    const { nodes: newNodes, edges: newEdges } = buildGraphElements(
      new OperationMachine(
        opMachine
          .getOperations()
          .filter((operation) => operation.getEvents().length > 0)
      )
    );

    setNodes(newNodes);
    setEdges(newEdges);
    setTimeout(() => {
      fitView();
    }, 300);
  };

  useEffect(() => {
    refreshNodes();
  }, [opMachine]);

  const nodeTypes = {
    custom: CustomNode,
  };

  const edgeTypes = {
    "start-end": CustomStepEdge,
  };
  return (
    <Box
      sx={{
        border: "2px solid #ddd",
        borderRadius: "8px",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
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
        <Controls showInteractive={false} position="bottom-right" />
        <Background gap={1} color="transparent" />
      </ReactFlow>
    </Box>
  );
};

export default OperationMachineBoard;
