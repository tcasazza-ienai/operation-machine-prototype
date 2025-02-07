import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PopupMenu, { PopupMenuProp } from "../menu/popup-menu.tsx";
import modes from "../../data/modes/modes1.json";
import { Mode, Operation } from "../../types/operation-machine.types.ts";
import IenaiButton from "../common/ienai-button.tsx";
import AddIcon from "@mui/icons-material/Add";
import ModeSelector from "../modes/modeSelector.tsx";

const OperationNodeAdded: React.FC<{
  data: Operation;
  options: PopupMenuProp[];
  selectOnChange: (mode: Mode) => void;
}> = ({ data, options, selectOnChange }) => {
  const [selected, setSelected] = useState<Mode>(data?.mode);
  //TO DO: Filter modes by system_mode of the current spacecraft selected
  const [modeList, setModeList] = useState<Mode[]>(modes);
  const [menuOptions, setMenuOptions] = useState<PopupMenuProp[]>(
    options ? options : []
  );

  const selectMode = (e: SelectChangeEvent<string>) => {
    const mode = modeList.find((mode) => mode.mode_name === e.target.value);
    setSelected(mode || data.mode);
    selectOnChange(mode || data.mode);
  };
  return (
    <Box className="nodrag" sx={nodeContainerStyle}>
      <Box sx={titleContainterStyle}>
        <Typography sx={titleStyle} variant="h6">
          {data.op_name as string}{" "}
        </Typography>
        <PopupMenu items={menuOptions} />
      </Box>
      <Box sx={{ height: "57px" }}>
        {modeList.length < 1 ? (
          <Box sx={addButtonContainerStyle}>
            <IenaiButton
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
              label={"Add Mode"}
              icon={<AddIcon fontSize="medium" />}
            />
          </Box>
        ) : (
          <ModeSelector
            modeList={modeList}
            selectMode={selectMode}
            selected={selected}
          />
        )}
      </Box>

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

export default OperationNodeAdded;

const nodeContainerStyle = {
  padding: 2,
  border: "1px solid #1D1B20",
  borderRadius: "12px",
  background: "#FEF7FF",
  position: "relative",
  minWidth: "280px",
  textAlign: "center",
  cursor: "auto",
  overflow: "visible",
};

const titleContainterStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const titleStyle = { fontSize: "14px", fontWeight: "bold" };

const addButtonContainerStyle = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
};

const addTriggerContainerStyle = {
  position: "absolute",
  right: "-13px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const addTriggerButtonStyle = {
  color: "#1D1B20",
  cursor: "pointer",
  zIndex: 1000,
};
