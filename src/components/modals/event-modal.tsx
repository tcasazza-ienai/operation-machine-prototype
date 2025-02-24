import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import IenaiButton from "../common/ienai-button.tsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddIcon from "@mui/icons-material/Add";
import IenaiButtonText from "../common/ienai-button-text.tsx";

import {
  createCustomTrigger,
  Event360,
  Mode360,
  Operation360,
  OperationMachine,
  TerminateSimulation_E,
  ToOp_E,
  Trigger360,
} from "../../entities/OpMachine.ts";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import {
  getAllTrigger360,
  getTriggerClassByName,
} from "../../utils/mappingTriggerList.ts";

const emptyEvent: Event360 = new Event360("", "");

const EventModal: React.FC<{
  open: boolean;
  onClose: () => void;
  operation: Operation360;
}> = ({ open, onClose, operation }) => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
  const [toOpSelected, setToOpSelected] = useState<Operation360>();
  const [triggerList, setTriggerList] = useState<Trigger360[]>(
    getAllTrigger360()
  );

  const [formEvent, setFormEvent] = useState<Event360>(emptyEvent);

  const changeTriggerHandler = (e: SelectChangeEvent<string>) => {
    const newEvent = new Event360(
      formEvent.getTrigger(),
      formEvent.getEffect()
    );
    const NewTriggerClass = getTriggerClassByName(e.target.value);
    if (NewTriggerClass) {
      newEvent.setTrigger(new (NewTriggerClass.constructor as any)());
    }

    setFormEvent(newEvent);
  };

  const effectOnChangeHandler = (e: SelectChangeEvent<string>) => {
    const newEvent = new Event360(
      formEvent.getTrigger(),
      formEvent.getEffect()
    );
    if (e.target.value === "ToOp_E") {
      newEvent.setEffect(
        new ToOp_E(new Operation360("", "", new Mode360("", "")))
      );
    } else {
      newEvent.setEffect(new TerminateSimulation_E());
    }
    setFormEvent(newEvent);
  };

  const toOpOnChangeHandler = (e: SelectChangeEvent<string>) => {
    const newEvent = new Event360(
      formEvent.getTrigger(),
      formEvent.getEffect()
    );
    console.log(e.target.value);
    if (newEvent.getEffect() instanceof ToOp_E) {
      newEvent.setEffect(
        new ToOp_E(
          opMachine.getOperationById(e.target.value) ??
            new Operation360("", "", new Mode360("", ""))
        )
      );
    }
    setToOpSelected(opMachine.getOperationById(e.target.value));
    setFormEvent(newEvent);
  };

  const confirmValidation = () => {
    if (!formEvent.getTrigger()) return false;
    if (!formEvent.getEffect()) {
      return false;
    }
    if (formEvent.getEffect().constructor.name === "ToOp_E") {
      if (!toOpSelected?.getId()) return false;
    }
    return true;
  };

  const confirmForm = () => {
    const newOpMachine = new OperationMachine(opMachine.getOperations());
    console.log("newOpMachine", newOpMachine);
    const operationNewEvent = newOpMachine.getOperationById(operation.getId());

    newOpMachine.deleteOperationById(operation.getId());

    const newEvent = new Event360(
      formEvent.getTrigger(),
      formEvent.getEffect()
    );
    if (operationNewEvent) {
      operationNewEvent.addEventToOperation(newEvent);
      newOpMachine.addOperationToOpMachine(operationNewEvent);
    }
    setOpMachine(newOpMachine);

    closeForm();
  };

  const closeForm = () => {
    setFormEvent(emptyEvent);
    onClose();
  };

  useEffect(() => {
    console.log(operation);
  }, [operation]);
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

        <FormControl fullWidth>
          <InputLabel>Trigger*</InputLabel>
          <Select
            label="Trigger"
            value={(formEvent.getTrigger() as { className: string }).className}
            defaultValue=""
            onChange={(e) => {
              changeTriggerHandler(e);
            }}
          >
            {triggerList.map((trigger, index) => (
              <MenuItem
                key={index}
                value={(trigger as { className: string }).className}
              >
                {(trigger as { className: string }).className
                  .toString()
                  .replace(/_T$/, "")
                  .replace(/([A-Z])/g, " $1")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ width: "40%" }}>
          <IenaiButtonText
            onClick={() => console.log("Add Trigger")}
            label={"Add Trigger"}
            icon={<AddIcon fontSize="medium" />}
          />
        </Box>

        <DialogContentText sx={{ color: "var(--On-Surface, #1D1B20)" }}>
          Then
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel>Effect*</InputLabel>
          <Select
            label="Effect"
            value={formEvent.getEffect().constructor.name}
            defaultValue=""
            onChange={(e) => {
              effectOnChangeHandler(e);
            }}
          >
            <MenuItem value={"ToOp_E"}>To Operation</MenuItem>
            <MenuItem value={"TerminateSimulation_E"}>End Simulation</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Operation</InputLabel>
          <Select
            disabled={formEvent.getEffect().constructor.name !== "ToOp_E"}
            label="Operation"
            value={toOpSelected?.getId() ? toOpSelected.getId() : ""}
            defaultValue=""
            onChange={(e) => {
              toOpOnChangeHandler(e);
            }}
          >
            {opMachine
              .getOperations()
              .filter((op) => op.getId() !== operation.getId())
              .map((op, index) => (
                <MenuItem key={index} value={op.getId()}>
                  {op.getOpName()}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

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
