import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import IenaiButton from "../common/ienai-button.tsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useModesStore } from "../../store/modesStore.ts";
import PointingMode from "./mode-modal-components/pointing-mode.tsx";
import GeometryMode from "./mode-modal-components/geometry-mode.tsx";
import { Mode360, SphereGeometry360 } from "../../entities/OpMachine.ts";
import SystemMode from "./mode-modal-components/system-mode.tsx";

const emptyMode: Mode360 = new Mode360("0", "");

const ModeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mode?: Mode360;
}> = ({ open, onClose, mode }) => {
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
      const newMode = new Mode360(
        (modes.length + 1).toString(),
        formMode.getModeName(),
        formMode.getPointing(),
        formMode.getSystemsModes(),
        formMode.getOverrideGeometry()
      );
      setModes([...modes, newMode]);
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
        <SystemMode formMode={formMode} setFormMode={setFormMode} />

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
