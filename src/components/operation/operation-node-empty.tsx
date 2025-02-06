import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PopupMenu from "../menu/popup-menu.tsx";

const OperationNodeEmpty: React.FC = () => {
  const [selected, setSelected] = useState<string>("");
  const [modesList, setModeList] = useState<string[]>([
    "QLaw",
    "Counter Velocity",
    "Pointing Nadir",
    "Along Velocity",
  ]);

  return (
    <Box className="nodrag" sx={nodeContainerStyle}>
      <Box sx={titleContainterStyle}>
        <Typography sx={titleStyle} variant="h6">
          Operation $n{" "}
        </Typography>

        <Box sx={{ color: "transparent" }}>
          <PopupMenu items={[]} />
        </Box>
      </Box>
      <Select
        disabled
        displayEmpty
        renderValue={
          selected !== ""
            ? undefined
            : () => <Typography sx={{ color: "#49454F" }}>Mode</Typography>
        }
        value={selected}
        className="nodrag"
        onChange={(e) => setSelected(e.target.value)}
        IconComponent={() => null}
        sx={selectStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ visibility: "hidden" }}
      />
      <Handle
        type="target"
        position={Position.Right}
        style={{ visibility: "hidden" }}
      />
      <Box sx={addTriggerContainerStyle}>
        <AddCircleOutlineIcon sx={addTriggerButtonStyle} />
      </Box>
    </Box>
  );
};

export default OperationNodeEmpty;

const nodeContainerStyle = {
  padding: 2,
  border: "2px dashed #79747E",
  borderRadius: "12px",
  opacity: 0.8,
  background: "#FEF7FF",
  position: "relative",
  minWidth: "280px",
  textAlign: "center",
  overflow: "visible",
};

const titleContainterStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const titleStyle = { color: "#1D1B20", fontSize: "14px", fontWeight: "400" };

const selectStyle = {
  position: "relative",
  width: "100%",
  color: "#49454F",
  textAlign: "justify",
  zIndex: -1,
};

const addTriggerContainerStyle = {
  position: "absolute",
  right: "-13px",
  top: "50%",
  transform: "translateY(-50%)",
};

const addTriggerButtonStyle = {
  color: "#1D1B20",
  cursor: "pointer",
  zIndex: 1000,
  opacity: 0.4,
};
