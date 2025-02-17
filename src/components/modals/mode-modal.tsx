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
import { SphereGeometry } from "../../types/operation-machine.types.ts";
import IenaiButton from "../common/ienai-button.tsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSpacecraftStore } from "../../store/spacecraftStore.ts";
import { useModesStore } from "../../store/modesStore.ts";
import { SpacecraftSystem } from "../../types/spacecraft.types.ts";
import PointingMode from "./mode-modal-components/pointing-mode.tsx";
import GeometryMode from "./mode-modal-components/geometry-mode.tsx";
import {
  Mode360,
  SphereGeometry360,
  SystemsMode,
} from "../../entities/OpMachine.ts";
import { Spacecraft360 } from "../../entities/Spacecraft.ts";
import {
  createSystemMode,
  SystemBaseClass,
} from "../../utils/mappingSystemsMode.ts";
import { Mode } from "@mui/icons-material";

const emptyMode: Mode360 = new Mode360("0", "");

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
  mode?: Mode360;
}> = ({ open, onClose, mode }) => {
  const spacecraftSelected: Spacecraft360 = useSpacecraftStore(
    (state) => state.spacecraft
  );
  const modes = useModesStore((state) => state.modes);
  const setModes = useModesStore((state) => state.updateModes);

  const [formMode, setFormMode] = useState<Mode360>(emptyMode);
  const [sphericalGeometryStatus, setSphericalGeometryStatus] =
    useState<boolean>(false);

  const confirmValidation = () => {
    if (!formMode.getModeName()) return false;
    if (
      !formMode.getPointing().getPointer() ||
      formMode.getPointing().getPointer() === ""
    )
      return false;
    if (!formMode.getPointing().getTarget()) return false;
    if (
      sphericalGeometryStatus &&
      formMode.getOverrideGeometry() &&
      formMode.getOverrideGeometry() instanceof SphereGeometry360
    ) {
      if (!(formMode.getOverrideGeometry() as SphereGeometry360)?.getArea())
        return false;
      if (!(formMode.getOverrideGeometry() as SphereGeometry360)?.getCD())
        return false;
      if (!(formMode.getOverrideGeometry() as SphereGeometry360)?.getCR())
        return false;
    }
    return true;
  };

  const confirmForm = () => {
    if (formMode.getModeId() !== "0") {
      setModes(
        modes.map((m) =>
          m.getModeId() === formMode.getModeId() ? formMode : m
        )
      );
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
    if (formMode.getOverrideGeometry() instanceof SphereGeometry360) {
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
          value={formMode.getModeName()}
          onChange={(e) => {
            const updatedMode: Mode360 = new Mode360(
              formMode.getModeId(),
              formMode.getModeName(),
              formMode.getPointing(),
              formMode.getSystemsModes(),
              formMode.getOverrideGeometry()
            );

            updatedMode.setModeName(e.target.value);
            setFormMode(updatedMode);
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
                  formMode.getSystemsModes() &&
                  formMode.getSystemsModes()?.length > 0
                    ? formMode.getSystemsModeByIndex(0).getName()
                    : ""
                }
                onChange={(e) => {
                  const selectedSystem = spacecraftSelected
                    .getScSystems()
                    .find(
                      (system) => system.getFunctionalId() === e.target.value
                    );
                  const newSystemMode: SystemsMode[] = [];

                  if (selectedSystem) {
                    console.log(
                      selectedSystem.getSystem().constructor
                        .name as SystemBaseClass
                    );
                    newSystemMode.push(
                      createSystemMode(
                        selectedSystem.getFunctionalId(),
                        selectedSystem.getSystem().constructor
                          .name as SystemBaseClass
                      )
                    );
                  }
                  if (
                    formMode.getSystemsModes() &&
                    formMode.getSystemsModeByIndex(1)
                  ) {
                    newSystemMode.push(formMode.getSystemsModeByIndex(1));
                  }
                  if (newSystemMode !== undefined) {
                    const updatedFormMode = new Mode360(
                      formMode.getModeId(),
                      formMode.getModeName()
                    );
                    updatedFormMode.setSystemsModes(newSystemMode);
                    setFormMode(updatedFormMode);
                  }
                }}
                defaultValue=""
              >
                <MenuItem value="">_</MenuItem>
                {spacecraftSelected?.getScSystems()?.length > 0 &&
                  spacecraftSelected.getScSystems().map((system, index) => (
                    <MenuItem
                      key={system.getFunctionalId() + index}
                      value={system.getFunctionalId()}
                    >
                      {system.getFunctionalId()}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Object Name (Functional ID)</InputLabel>
              <Select
                label="Object Name (Functional ID)"
                disabled={formMode.getSystemsModes()?.length == 0}
                value={
                  formMode.getSystemsModes() &&
                  formMode.getSystemsModes()[1] &&
                  formMode.getSystemsModes()?.length > 0
                    ? formMode.getSystemsModes()[1].getName()
                    : ""
                }
                onChange={(e) => {
                  const selectedSystem = spacecraftSelected
                    .getScSystems()
                    .find(
                      (system) => system.getFunctionalId() === e.target.value
                    );
                  const newSystemMode: SystemsMode[] = [];

                  if (
                    formMode.getSystemsModes() &&
                    formMode.getSystemsModeByIndex(0)
                  )
                    newSystemMode.push(formMode.getSystemsModeByIndex(0));
                  if (selectedSystem) {
                    newSystemMode.push(
                      createSystemMode(
                        selectedSystem.getFunctionalId(),
                        selectedSystem.getSystem().constructor
                          .name as SystemBaseClass
                      )
                    );
                  }
                  if (newSystemMode !== undefined) {
                    const updatedFormMode = new Mode360(
                      formMode.getModeId(),
                      formMode.getModeName()
                    );
                    updatedFormMode.setSystemsModes(newSystemMode);
                    setFormMode(updatedFormMode);
                  }
                }}
                defaultValue=""
              >
                <MenuItem value="">_</MenuItem>
                {spacecraftSelected?.getScSystems()?.length > 0 &&
                  spacecraftSelected.getScSystems().map((system, index) => (
                    <MenuItem
                      key={system.getFunctionalId() + index}
                      value={system.getFunctionalId()}
                    >
                      {system.getFunctionalId()}
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
