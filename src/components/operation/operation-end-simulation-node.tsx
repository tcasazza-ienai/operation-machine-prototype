import { Box, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";

const OperationEndSimulationNode: React.FC = () => {
  return (
    <Box sx={nodeContainerStyle}>
      <Box sx={titleContainterStyle}>
        <Typography sx={titleStyle} variant="h6">
          {" End Simulation"}
        </Typography>
      </Box>
      <Handle
        type="source"
        position={Position.Right}
        style={{ visibility: "hidden" }}
      />
      <Handle
        type="source"
        id="terminate-sim-source"
        position={Position.Right}
        style={{ visibility: "hidden" }}
      />
      <Handle type="target" position={Position.Top} />
    </Box>
  );
};

export default OperationEndSimulationNode;

const nodeContainerStyle = {
  padding: 2,
  border: "1px solid #1D1B20",
  borderRadius: "12px",
  color: "#fff",
  background: "#A53A36",
  position: "relative",
  minWidth: "280px",
  textAlign: "center",
  cursor: "drag",
  overflow: "visible",
};

const titleContainterStyle = {
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  paddingY: "8px",
};

const titleStyle = {
  fontSize: "14px",
  fontWeight: "bold",
};
