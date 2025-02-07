import React from "react";
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
import { Mode } from "../../types/operation-machine.types";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

interface ModeSelectorProps {
  selected: Mode;
  selectMode: (event: SelectChangeEvent<string>) => void;
  modeList: Mode[];
}
const ModeSelector: React.FC<ModeSelectorProps> = ({
  selected,
  modeList: modesList,
  selectMode,
}) => {
  return (
    <Select
      value={selected.mode_name}
      className="nodrag"
      displayEmpty
      renderValue={
        selected.id !== ""
          ? undefined
          : () => <Typography sx={{ color: "#49454F" }}>Select mode</Typography>
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
            Modes:
          </Typography>
          <Button disableRipple size="small" sx={addModeButtonStyle}>
            <AddCircleOutlineIcon fontSize="small" />
          </Button>
        </>
      </Box>
      {modesList.map((item, index) => (
        <MenuItem value={item.mode_name} sx={menuItemDesign} key={index}>
          {item.mode_name}
          <Box className="icons" sx={{ display: "none", gap: "8px" }}>
            <Tooltip title="Edit">
              <ModeEditOutlinedIcon fontSize="small" />
            </Tooltip>
            <Tooltip title="Duplicate">
              <ContentCopyRoundedIcon fontSize="small" />
            </Tooltip>
          </Box>
        </MenuItem>
      ))}
    </Select>
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
