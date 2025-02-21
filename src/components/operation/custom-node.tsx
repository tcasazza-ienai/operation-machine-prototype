import { NodeProps } from "@xyflow/react";
import React from "react";
import { Operation360 } from "../../entities/OpMachine.ts";
import OperationNode from "./operation-node.tsx";
import { Box } from "@mui/material";

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <Box sx={{ width: "280px" }}>
      <OperationNode
        operation={data.operation as Operation360}
        aditionalData={data}
      />
    </Box>
  );
};

export default CustomNode;
