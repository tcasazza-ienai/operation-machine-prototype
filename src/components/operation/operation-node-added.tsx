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
import { Mode360, Operation360 } from "../../entities/OpMachine.ts";
import { useModesStore } from "../../store/modesStore.ts";
import IenaiButton from "../common/ienai-button.tsx";
import AddIcon from "@mui/icons-material/Add";
import ModeSelector from "../modes/modeSelector.tsx";
import ModeModal from "../modals/mode-modal.tsx";

const OperationNodeAdded: React.FC<{
  data;
  options: PopupMenuProp[];
  selectOnChange: (mode: Mode360) => void;
}> = ({ data, options, selectOnChange }) => {
  const modes = useModesStore((state) => state.modes);

  const { operation, isBiDirectional, dataFlow, hasEndNode, isEndNode } = data;
  const [selected, setSelected] = useState<Mode360>(
    (data.operation as Operation360).getOpMode()
  );
  //TO DO: Filter modes by system_mode of the current spacecraft selected
  const [modesList, setModeList] = useState<string[]>([]);
  const [menuOptions, setMenuOptions] = useState<PopupMenuProp[]>(
    options ? options : []
  );
  const [modeModal, setModeModal] = useState<boolean>(false);

  const selectMode = (e: SelectChangeEvent<string>) => {
    const mode = modes.find((mode) => mode.getModeName() === e.target.value);
    setSelected(mode || (data.operation as Operation360).getOpMode());
    selectOnChange(mode || (data.operation as Operation360).getOpMode());
  };

  return (
    <Box sx={nodeContainerStyle}>
      <Box sx={titleContainterStyle}>
        <Typography sx={titleStyle} variant="h6">
          {operation.op_name as string}{" "}
        </Typography>
        <PopupMenu items={menuOptions} />
      </Box>
      <Box sx={{ height: "57px" }}>
        {modes?.length < 1 ? (
          <Box sx={addButtonContainerStyle}>
            <IenaiButton
              onClick={() => setModeModal(true)}
              label={"Add Mode"}
              icon={<AddIcon fontSize="medium" />}
            />
          </Box>
        ) : (
          <ModeSelector
            modesList={modes}
            selectMode={selectMode}
            selected={selected}
          />
        )}
      </Box>
      <Handle
        type="source"
        position={
          isBiDirectional && dataFlow === "LL"
            ? Position.Left
            : dataFlow === "RR"
            ? Position.Right
            : Position.Right
        }
        style={{ visibility: "hidden" }}
      />
      <Handle
        type="source"
        id="terminate-sim-source"
        position={Position.Right}
        style={{ visibility: "hidden" }}
      />
      <Handle
        type="target"
        position={
          isEndNode
            ? Position.Left
            : isBiDirectional && dataFlow === "LL"
            ? Position.Right
            : dataFlow === "RR"
            ? Position.Left
            : Position.Left
        }
      />
      <Box sx={addTriggerContainerStyle}>
        <AddCircleOutlineIcon sx={addTriggerButtonStyle} />
      </Box>
      <ModeModal onClose={() => setModeModal(false)} open={modeModal} />
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
  cursor: "drag",
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
