import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  TextField,
  Select,
} from "@mui/material";
import IenaiButton from "../common/ienai-button.tsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useModesStore } from "../../store/modesStore.ts";
import PointingMode from "./mode-modal-components/pointing-mode.tsx";
import GeometryMode from "./mode-modal-components/geometry-mode.tsx";
import {
  Event360,
  Mode360,
  Operation360,
  SphereGeometry360,
} from "../../entities/OpMachine.ts";
import SystemMode from "./mode-modal-components/system-mode.tsx";

const emptyEvent: Event360 = new Event360("", "");

const EventModal: React.FC<{
  open: boolean;
  onClose: () => void;
  operation: Operation360;
}> = ({ open, onClose, operation }) => {
  const modes = useModesStore((state) => state.modes);
  const setModes = useModesStore((state) => state.updateModes);

  const [formEvent, setFormEvent] = useState<Event360>(emptyEvent);
  const [sphericalGeometryStatus, setSphericalGeometryStatus] =
    useState<boolean>(false);

  const confirmValidation = () => {
    if (!formEvent.getTrigger()) return false;
    if (!formEvent.getEffect()) {
      return false;
    }
    return true;
  };

  const confirmForm = () => {
    const newEvent = new Event360(
      formEvent.getTrigger(),
      formEvent.getEffect()
    );
    operation.addEventToOperation(newEvent);

    closeForm();
  };

  const closeForm = () => {
    setFormEvent(emptyEvent);
    onClose();
  };

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
          <DialogTitle sx={{ padding: "0px" }}>Events</DialogTitle>
          <Button sx={{ color: "rgba(29, 27, 32, 1)" }} onClick={closeForm}>
            <CloseRoundedIcon />
          </Button>
        </Box>
        <DialogContentText sx={{ color: "var(--On-Surface, #1D1B20)" }}>
          If
        </DialogContentText>

        <Select></Select>

        <DialogContentText sx={{ color: "var(--On-Surface, #1D1B20)" }}>
          Then
        </DialogContentText>
        <Select></Select>
        <Select></Select>

        <DialogActions sx={{ alignSelf: "flex-start" }}>
          <IenaiButton
            onClick={confirmForm}
            label={"Create event"}
            props={{ disabled: !confirmValidation() }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventModal;
