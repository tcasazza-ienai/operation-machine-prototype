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
import OperationNode from "../operation/operation-node.tsx";
import "@xyflow/react/dist/style.css";
import { Operation360 } from "../../entities/OpMachine.ts";
import CustomEdgeOther from "../edges/CustomEdgeOther.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import { buildGraphElements } from "../../utils/nodeOperations.ts";

const OperationMachineBoard: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const refreshNodes = (operations: Operation360[]) => {
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
