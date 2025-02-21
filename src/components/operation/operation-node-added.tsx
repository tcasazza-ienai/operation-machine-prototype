import {
  Box,
  Button,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PopupMenu, { PopupMenuProp } from "../menu/popup-menu.tsx";
import { Mode360, Operation360 } from "../../entities/OpMachine.ts";
import { useModesStore } from "../../store/modesStore.ts";
import IenaiButton from "../common/ienai-button.tsx";
import AddIcon from "@mui/icons-material/Add";
import ModeSelector from "../modes/modeSelector.tsx";
import ModeModal from "../modals/mode-modal.tsx";

const OperationNodeAdded: React.FC<{
  operation: Operation360;
  options: PopupMenuProp[];
  selectOnChange: (mode: Mode360) => void;
  aditionalData?: any;
}> = ({ operation, options, selectOnChange, aditionalData }) => {
  const modes = useModesStore((state) => state.modes);
  const [selected, setSelected] = useState<Mode360>(
    (operation as Operation360).getOpMode()
  );
  //TO DO: Filter modes by system_mode of the current spacecraft selected
  const [modesList, setModeList] = useState<string[]>([]);
  const [menuOptions, setMenuOptions] = useState<PopupMenuProp[]>(
    options ? options : []
  );
  const [modeModal, setModeModal] = useState<boolean>(false);

  const selectMode = (e: SelectChangeEvent<string>) => {
    const mode = modes.find((mode) => mode.getModeName() === e.target.value);
    setSelected(mode || (operation as Operation360).getOpMode());
    selectOnChange(mode || (operation as Operation360).getOpMode());
  };

  return (
    <Box sx={nodeContainerStyle}>
      <Box sx={titleContainterStyle}>
        <Typography sx={titleStyle} variant="h6">
          {operation.getOpName() as string}{" "}
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
          aditionalData?.isBiDirectional && aditionalData?.dataFlow === "LL"
            ? Position.Left
            : aditionalData?.dataFlow === "RR"
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
          aditionalData?.isEndNode
            ? Position.Left
            : aditionalData?.isBiDirectional && aditionalData?.dataFlow === "LL"
            ? Position.Right
            : aditionalData?.dataFlow === "RR"
            ? Position.Left
            : Position.Left
        }
      />

      <Tooltip
        title={
          operation.getOpMode() && operation.getOpMode().getModeId() !== ""
            ? "Add event"
            : "Add a mode to enable events"
        }
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -20],
                },
              },
            ],
          },
        }}
      >
        <Button
          sx={
            operation.getOpMode() && operation.getOpMode().getModeId() !== ""
              ? addTriggerContainerStyle
              : addTriggerContainerStyleDisabled
          }
        >
          <AddCircleOutlineIcon />
        </Button>
      </Tooltip>

      <ModeModal onClose={() => setModeModal(false)} open={modeModal} />
    </Box>
  );
};

export default OperationNodeAdded;

const nodeContainerStyle = {
  padding: 2,
  border: "1px solid #ADAAAA",
  borderRadius: "8px",
  background: "#FEF7FF",
  position: "relative",
  minWidth: "180px",
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
  minWidth: "15px",
  padding: "2px",
  right: "-15px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "#1D1B20",
  zIndex: 1000,
};

const addTriggerContainerStyleDisabled = {
  position: "absolute",
  minWidth: "15px",
  padding: "2px",
  right: "-15px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "default",
  color: "#ADAAAA",
  zIndex: 1000,
};
