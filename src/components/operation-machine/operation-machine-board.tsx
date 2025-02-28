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
import {
  Operation360,
  OperationMachine,
  ToOp_E,
} from "../../entities/OpMachine.ts";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import { buildGraphElements } from "../../utils/nodeOperations.ts";
import CustomStepEdge from "../edges/CustomStepEdge.tsx";
import EmptyOpMachineImage from "../../assets/images/emptyOpMachine.png";
import { filterOperationsByEventsToOpOrEnter } from "../../utils/eventsFunctions.ts";

const OperationMachineBoard: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const refreshNodes = () => {
    const filteredOperations = filterOperationsByEventsToOpOrEnter(
      opMachine.getOperations()
    );

    const { nodes: newNodes, edges: newEdges } = buildGraphElements(
      new OperationMachine(filteredOperations)
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
    <Box sx={getBoxSx(edges.length > 0)}>
      {edges.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          zoomOnScroll={true}
          zoomOnPinch={false}
          style={reactFlowStyle}
          nodesDraggable
        >
          <Controls showInteractive={false} position="bottom-right" />
          <Background gap={1} color="transparent" />
        </ReactFlow>
      ) : (
        <img
          src={EmptyOpMachineImage}
          alt="emptyOp-MachineImage"
          style={imgStyle}
        />
      )}
    </Box>
  );
};

export default OperationMachineBoard;

const getBoxSx = (hasEdges: boolean) => ({
  border: hasEdges ? "2px solid #ddd" : "",
  borderRadius: "8px",
  height: "70vh",
  display: "flex",
  flexDirection: "column",
});

const reactFlowStyle = { width: "100%" };

const imgStyle = { height: "70vh" };
