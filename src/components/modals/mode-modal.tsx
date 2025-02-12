import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Select,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { Mode, SphereGeometry } from "../../types/operation-machine.types.ts";
import IenaiButton from "../common/ienai-button.tsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSpacecraftStore } from "../../store/spacecraftStore.ts";
import { useModesStore } from "../../store/modesStore.ts";
import { SpacecraftSystem } from "../../types/spacecraft.types.ts";
import PointingMode from "./mode-modal-components/pointing-mode.tsx";
import GeometryMode from "./mode-modal-components/geometry-mode.tsx";

const emptyMode: Mode = {
  id: "0",
  mode_name: "",
  pointing: {
    pointer: "",
    target: "",
  },
  system_mode: [],
};

const emptySphericalGeometry: {
  activate: boolean;
  measurements: SphereGeometry;
} = {
  activate: false,
  measurements: { area: 0, CD: 0, CR: 0 },
};
const ModeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mode?: Mode;
}> = ({ open, onClose, mode }) => {
  const spacecraftSelected = useSpacecraftStore((state) => state.spacecraft);
  const modes = useModesStore((state) => state.modes);
  const setModes = useModesStore((state) => state.updateModes);

  const [formMode, setFormMode] = useState<Mode>(emptyMode);
  const [sphericalGeometryStatus, setSphericalGeometryStatus] =
    useState<boolean>(false);

  const confirmValidation = () => {
    if (!formMode.mode_name) return false;
    if (!formMode.pointing.pointer || formMode.pointing.pointer === "")
      return false;
    if (!formMode.pointing.target) return false;
    if (sphericalGeometryStatus) {
      if (!formMode.override_geometry?.area) return false;
      if (!formMode.override_geometry?.CD) return false;
      if (!formMode.override_geometry?.CR) return false;
    }
    return true;
  };

  const confirmForm = () => {
    if (formMode.id !== "0") {
      setModes(modes.map((m) => (m.id === formMode.id ? formMode : m)));
    } else {
      setModes([...modes, formMode]);
    }
    closeForm();
  };

  const closeForm = () => {
    setFormMode(emptyMode);
    onClose();
  };

  useEffect(() => {
    if (mode) setFormMode(mode);
  }, [mode]);

  useEffect(() => {
    setFormMode(mode ? mode : emptyMode);
    if (formMode.override_geometry) {
      setSphericalGeometryStatus(true);
    }
  }, []);
  return (
    <>
      <Dialog
        open={open}
        onClose={closeForm}
        fullScreen
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "right",
            padding: "0px",
            margin: "0px",
          },
          "& .MuiDialog-paper": {
            backgroundColor: "#FFF",
            width: "30%",
            minWidth: "400px",
            padding: "16px",
            gap: "16px",
            height: "100%",
            margin: "0px",
            borderRadius: "0px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <DialogTitle sx={{ padding: "0px" }}>Mode</DialogTitle>
          <Button sx={{ color: "rgba(29, 27, 32, 1)" }} onClick={closeForm}>
            <CloseRoundedIcon />
          </Button>
        </Box>
        <DialogContentText sx={{ color: "var(--On-Surface, #1D1B20)" }}>
          Create different modes for your spacecraft during mission
        </DialogContentText>

        <TextField
          value={formMode.mode_name}
          onChange={(e) =>
            setFormMode({ ...formMode, mode_name: e.target.value })
          }
          sx={{
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#79747E",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#79747E",
              },
          }}
          label="Mode name*"
          fullWidth
        />

        <PointingMode formMode={formMode} setFormMode={setFormMode} />
        <GeometryMode
          setSphericalGeometryStatus={setSphericalGeometryStatus}
          sphericalGeometryStatus={sphericalGeometryStatus}
          formMode={formMode}
          setFormMode={setFormMode}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "16px",
            gap: "16px",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>System Mode</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <FormControl fullWidth>
              <InputLabel>Object Name (Functional ID)</InputLabel>
              <Select
                label="Object Name (Functional ID)"
                value={
                  formMode.system_mode && formMode.system_mode.length > 0
                    ? formMode.system_mode[0].functional_id
                    : ""
                }
                onChange={(e) => {
                  const selectedSystem = spacecraftSelected.sc_systems?.find(
                    (system) => system.functional_id === e.target.value
                  );
                  const newSystemMode: SpacecraftSystem[] = [];

                  if (selectedSystem) newSystemMode.push(selectedSystem);
                  if (formMode.system_mode && formMode.system_mode[1]) {
                    newSystemMode.push(formMode.system_mode[1]);
                  }
                  if (newSystemMode !== undefined) {
                    setFormMode({
                      ...formMode,
                      system_mode: newSystemMode,
                    });
                  }
                }}
                defaultValue=""
              >
                <MenuItem value="">_</MenuItem>
                {spacecraftSelected?.sc_systems &&
                  spacecraftSelected?.sc_systems?.length > 0 &&
                  spacecraftSelected.sc_systems.map((system, index) => (
                    <MenuItem
                      key={system.functional_id + index}
                      value={system.functional_id}
                    >
                      {system.functional_id}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Object Name (Functional ID)</InputLabel>
              <Select
                label="Object Name (Functional ID)"
                disabled={formMode.system_mode?.length == 0}
                value={
                  formMode.system_mode &&
                  formMode.system_mode[1] &&
                  formMode.system_mode.length > 0
                    ? formMode.system_mode[1].functional_id
                    : ""
                }
                onChange={(e) => {
                  const selectedSystem = spacecraftSelected.sc_systems?.find(
                    (system) => system.functional_id === e.target.value
                  );
                  const newSystemMode: SpacecraftSystem[] = [];

                  if (formMode.system_mode && formMode.system_mode[0])
                    newSystemMode.push(formMode.system_mode[0]);
                  if (selectedSystem) {
                    newSystemMode.push(selectedSystem);
                  }
                  if (newSystemMode !== undefined) {
                    setFormMode({
                      ...formMode,
                      system_mode: newSystemMode,
                    });
                  }
                }}
                defaultValue=""
              >
                <MenuItem value="">_</MenuItem>
                {spacecraftSelected?.sc_systems &&
                  spacecraftSelected?.sc_systems?.length > 0 &&
                  spacecraftSelected.sc_systems
                    .filter(
                      (system) =>
                        system.functional_id !==
                        formMode.system_mode?.[0]?.functional_id
                    )
                    .map((system, index) => (
                      <MenuItem
                        key={system.functional_id + index}
                        value={system.functional_id}
                      >
                        {system.functional_id}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <DialogActions sx={{ alignSelf: "flex-start" }}>
          <IenaiButton
            onClick={confirmForm}
            label={mode ? "Edit mode" : "Create mode"}
            props={{ disabled: !confirmValidation() }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModeModal;
