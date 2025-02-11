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
  ToggleButtonGroup,
  ToggleButton,
  Slide,
  SelectChangeEvent,
} from "@mui/material";
import {
  Mode,
  NormalTargets,
  SphereGeometry,
} from "../../types/operation-machine.types.ts";
import IenaiButton from "../common/ienai-button.tsx";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSpacecraftStore } from "../../store/spacecraftStore.ts";
import { useModesStore } from "../../store/modesStore.ts";
import { SpacecraftSystem } from "../../types/spacecraft.types.ts";

type PointingType = "body_axis" | "spacecraft_system";
const emptyMode: Mode = {
  id: "0",
  mode_name: "",
  pointing: {
    pointer: "",
    target: "",
  },
  system_mode: [],
};

const pointerCoordinates: string[] = ["+x", "+y", "+z", "-x", "-y", "-z"];
const pointerTargets: string[] = [
  NormalTargets.av,
  NormalTargets.cv,
  NormalTargets.n,
  NormalTargets.sf,
  "QLaw",
];

const ModeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mode?: Mode;
}> = ({ open, onClose, mode }) => {
  const spacecraftSelected = useSpacecraftStore((state) => state.spacecraft);
  const modes = useModesStore((state) => state.modes);
  const setModes = useModesStore((state) => state.updateModes);

  const [pointingType, setPointingType] = useState<PointingType>("body_axis");
  const [formMode, setFormMode] = useState<Mode>(emptyMode);
  const [sphericalGeometry, setSphericalGeometry] = useState<{
    activate: boolean;
    measurements: SphereGeometry;
  }>({
    activate: false,
    measurements: { area: 0, CD: 0, CR: 0 },
  });
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: PointingType
  ) => {
    setPointingType(newAlignment);
  };

  const handleGeometry = (e: SelectChangeEvent<string>) => {
    const geometry = e.target.value;
    console.log(geometry);
    if (geometry === "Spherical geometry") {
      setSphericalGeometry({ ...sphericalGeometry, activate: true });
    } else {
      setSphericalGeometry({ ...sphericalGeometry, activate: false });
    }
  };

  const confirmValidation = () => {
    if (!formMode.mode_name) return false;
    if (!formMode.pointing.pointer) return false;
    if (!formMode.pointing.target) return false;
    if (sphericalGeometry.activate) {
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
    onClose();
  };

  useEffect(() => {
    if (mode) setFormMode(mode);
  }, [mode]);

  useEffect(() => {
    console.log(formMode);
  }, [formMode]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Button sx={{ color: "rgba(29, 27, 32, 1)" }} onClick={onClose}>
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "16px",
          gap: "16px",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Pointing Mode</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}
        >
          <ToggleButtonGroup
            value={pointingType}
            exclusive
            onChange={handleAlignment}
            aria-label="Pointing Mode"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              height: "40px",
              borderRadius: "25px",
              border: "1px solid #79747E",
            }}
          >
            <ToggleButton
              value="body_axis"
              disabled={pointingType === "body_axis"}
              sx={{
                flex: 1,
                borderRadius: "25px",
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "none",
                gap: "8px",
                color: "#191A2C",
              }}
            >
              <Box
                sx={{
                  width: "24px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {pointingType === "body_axis" && <CheckRoundedIcon />}
              </Box>
              Body axis
            </ToggleButton>
            <ToggleButton
              value="spacecraft_system"
              disabled={pointingType === "spacecraft_system"}
              sx={{
                flex: 1,
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                gap: "8px",
              }}
            >
              <Box
                sx={{
                  width: "24px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {pointingType === "spacecraft_system" && <CheckRoundedIcon />}
              </Box>
              Spacecraft system
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {pointingType === "body_axis" ? (
            <FormControl fullWidth>
              <InputLabel>Pointer (coordinate)*</InputLabel>
              <Select
                label="Pointer (coordinate)"
                value={formMode.pointing.pointer}
                defaultValue=""
                onChange={(e) =>
                  setFormMode({
                    ...formMode,
                    pointing: {
                      ...formMode.pointing,
                      pointer: e.target.value as string,
                    },
                  })
                }
              >
                {pointerCoordinates.map((coordinate) => (
                  <MenuItem key={coordinate} value={coordinate}>
                    {coordinate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            //PENDIENTE DE PROGRAMAR
            <FormControl fullWidth>
              <InputLabel>Object pointer</InputLabel>
              <Select label="Object pointer" defaultValue="">
                {pointerTargets.map((target, index) => (
                  <MenuItem key={target + index} value={target}>
                    {target}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel>Target*</InputLabel>
            <Select
              label="Target"
              value={formMode.pointing.target}
              defaultValue=""
              onChange={(e) =>
                setFormMode({
                  ...formMode,
                  pointing: {
                    ...formMode.pointing,
                    target: e.target.value as string,
                  },
                })
              }
            >
              {pointerTargets.map((target, index) => (
                <MenuItem key={target + index} value={target}>
                  {target}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "16px",
          gap: "16px",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Geometry Mode</Typography>
        <FormControl fullWidth>
          <InputLabel>Geometry</InputLabel>
          <Select
            label="Geometry"
            defaultValue="Spacecraft geometry"
            fullWidth
            onChange={handleGeometry}
          >
            <MenuItem value="Spacecraft geometry">Spacecraft geometry</MenuItem>
            <MenuItem value="Spherical geometry">Spherical geometry</MenuItem>
          </Select>
        </FormControl>
        {sphericalGeometry.activate === true && (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <TextField
              label="Area*"
              value={formMode.override_geometry?.area || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+(?=\d)/, "");
                setFormMode({
                  ...formMode,
                  override_geometry: {
                    ...formMode.override_geometry,
                    CD: formMode.override_geometry?.CD || 0,
                    CR: formMode.override_geometry?.CR || 0,
                    area: Number.parseFloat(value),
                  },
                });
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#79747E",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#79747E",
                  },
              }}
              fullWidth
            />
            <TextField
              label="CD*"
              value={formMode.override_geometry?.CD || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+(?=\d)/, "");
                setFormMode({
                  ...formMode,
                  override_geometry: {
                    ...formMode.override_geometry,
                    CD: Number.parseFloat(value),
                    CR: formMode.override_geometry?.CR || 0,
                    area: formMode.override_geometry?.area || 0,
                  },
                });
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#79747E",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#79747E",
                  },
              }}
              fullWidth
            />
            <TextField
              label="CR*"
              value={formMode.override_geometry?.CR || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+(?=\d)/, "");
                setFormMode({
                  ...formMode,
                  override_geometry: {
                    ...formMode.override_geometry,
                    CD: formMode.override_geometry?.CD || 0,
                    CR: Number.parseFloat(value),
                    area: formMode.override_geometry?.area || 0,
                  },
                });
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#79747E",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#79747E",
                  },
              }}
              fullWidth
            />
          </Box>
        )}
      </Box>
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
                const selectedSystem = spacecraftSelected.sc_systems.find(
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
              {spacecraftSelected.sc_systems.map((system, index) => (
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
                const selectedSystem = spacecraftSelected.sc_systems.find(
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
              {spacecraftSelected.sc_systems.map((system, index) => (
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
          label={mode ? "Edit Mode" : "Create Mode"}
          props={{ disabled: !confirmValidation() }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ModeModal;
