import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import PopupMenu from "../menu/popup-menu.tsx";
import { Mode360 } from "../../entities/OpMachine.ts";

const OperationNodeEdit: React.FC<{
  defaultName: string;
  operationName: string;
  setOperationName: (newName) => void;
  selectedMode?: Mode360;
}> = ({ defaultName, operationName, selectedMode, setOperationName }) => {
  const [selected, setSelected] = useState<string>(
    selectedMode?.getModeName() ? selectedMode.getModeName() : ""
  );
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [selected]);
  return (
    <Box className="nodrag" sx={nodeContainerStyle}>
      <Box sx={titleContainterStyle}>
        <TextField
          inputRef={textFieldRef}
          placeholder={defaultName}
          value={operationName}
          onChange={(e) => setOperationName(e.target.value)}
          variant="standard"
          sx={titleStyle}
        >
          {operationName}
        </TextField>
        <PopupMenu items={[]} />
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
        sx={selectStyle}
        IconComponent={() => null}
      >
        <MenuItem value={selected}>{selected}</MenuItem>
      </Select>
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

export default OperationNodeEdit;

const nodeContainerStyle = {
  padding: 2,
  border: "1px solid #ADAAAA",
  borderRadius: "8px",
  background: "#FEF7FF",
  position: "relative",
  minWidth: "180px",
  textAlign: "center",
  overflow: "visible",
};

const titleContainterStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "11px",
};

const titleStyle = { fontSize: "14px", fontWeight: "bold" };

const selectStyle = {
  position: "relative",
  width: "100%",
  color: "#49454F",
  textAlign: "justify",
};

const addTriggerContainerStyle = {
  position: "absolute",
  right: "-13px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const addTriggerButtonStyle = { color: "#1D1B20", zIndex: 1000, opacity: 0.4 };
