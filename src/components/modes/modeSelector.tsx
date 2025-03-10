import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  Box,
  Typography,
  Button,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ModeModal from "../modals/mode-modal.tsx";
import { Mode360 } from "../../entities/OpMachine.ts";
import BasicDialog from "../modals/basic-dialog.tsx";

interface ModeSelectorProps {
  selected: Mode360;
  selectMode: (event: SelectChangeEvent<string>) => void;
  modesList: Mode360[];
}
const ModeSelector: React.FC<ModeSelectorProps> = ({
  selected,
  modesList,
  selectMode,
}) => {
  const [modeModal, setModeModal] = useState<boolean>(false);
  const [editedMode, setEditedMode] = useState<Mode360>();
  const [duplicatedMode, setDuplicatedMode] = useState<Mode360>();
  const [changeSelectDialog, setChangeSelectDialog] = useState<boolean>(false);

  const handleEditMode = async (mode: Mode360) => {
    setEditedMode(mode);
  };

  const confirmDuplicateMode = async (mode: Mode360) => {
    const newMode = new Mode360(
      (modesList.length + 1).toString(),
      mode.getModeName() + " (copy)",
      mode.getPointing(),
      mode.getSystemsModes(),
      mode.getOverrideGeometry()
    );
    modesList.push(newMode);
  };

  useEffect(() => {
    if (editedMode !== undefined && editedMode.getModeId() !== "0") {
      setModeModal(true);
    }
  }, [editedMode]);

  return (
    <Box>
      <Select
        value={selected?.getModeName()}
        className="nodrag"
        displayEmpty
        renderValue={
          selected && selected.getModeId() !== ""
            ? undefined
            : () => (
                <Typography sx={{ color: "#49454F" }}>Select mode</Typography>
              )
        }
        onChange={(e) => selectMode(e)}
        sx={selectStyle}
      >
        <Box sx={addModeContainerStyle}>
          <>
            <Typography
              sx={{ fontSize: "14px", fontWeight: "bold" }}
              variant="h6"
            >
              Operation Modes:
            </Typography>
            <Button
              disableRipple
              size="small"
              sx={addModeButtonStyle}
              onClick={() => setModeModal(true)}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </Button>
          </>
        </Box>
        {modesList.map((item, index) => (
          <MenuItem value={item.getModeName()} sx={menuItemDesign} key={index}>
            {item.getModeName()}
            <Box className="icons" sx={{ display: "none", gap: "8px" }}>
              <Tooltip title="Edit">
                <ModeEditOutlinedIcon
                  onClick={() => {
                    handleEditMode(item);
                  }}
                  fontSize="small"
                />
              </Tooltip>
              <Tooltip title="Duplicate">
                <ContentCopyRoundedIcon
                  onClick={() => {
                    setChangeSelectDialog(true);
                    setDuplicatedMode(item);
                  }}
                  fontSize="small"
                />
              </Tooltip>
            </Box>
          </MenuItem>
        ))}
      </Select>
      <ModeModal
        onClose={() => {
          setModeModal(false);
          setEditedMode(undefined);
        }}
        open={modeModal}
        mode={editedMode}
      />
      <BasicDialog
        onClose={() => setChangeSelectDialog(false)}
        onConfirm={() => {
          duplicatedMode
            ? confirmDuplicateMode(duplicatedMode)
            : setChangeSelectDialog(false);
        }}
        open={changeSelectDialog}
        confirmBottonLabel="Accept"
        title="Duplicate Mode"
        description={`Are you sure you want to duplicate this mode?: ${duplicatedMode?.getModeName()}`}
      />
    </Box>
  );
};

export default ModeSelector;

const selectStyle = {
  position: "relative",
  width: "100%",
  color: "#49454F",
  textAlign: "justify",
};

const addModeContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  height: "40px",
  alignItems: "center",
  padding: "8px 12px",
  borderBottom: "1px solid #CAC4D0",
  zIndex: "-1",
};

const addModeButtonStyle = {
  borderRadius: 50,
  color: "#49454F",
  padding: "16px",
  width: "24px",
  height: "24px",
  minWidth: "24px",
  minHeight: "24px",
};

const menuItemDesign = {
  "&:hover": {
    backgroundColor: "rgba(73, 69, 79, 0.08)",
    ".icons": {
      display: "inline-flex",
    },
  },
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
