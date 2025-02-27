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
  Tooltip,
} from "@mui/material";
import IenaiButton from "../common/ienai-button.tsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddIcon from "@mui/icons-material/Add";
import IenaiButtonText from "../common/ienai-button-text.tsx";
import TrashOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  createCustomTrigger,
  effectEnum,
  Event360,
  Mode360,
  OnAllConditions_T,
  OnAnyCondition_T,
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
  event?: Event360;
}> = ({ open, onClose, operation, event }) => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const [andOrTriggerList, setAndOrTriggerList] = useState<
    { type: "OR" | "AND"; trigger?: Trigger360 }[]
  >([]);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
  const [toOpSelected, setToOpSelected] = useState<Operation360>();
  const [triggerList, setTriggerList] = useState<Trigger360[]>(
    getAllTrigger360()
  );
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

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
    if (e.target.value === effectEnum.ToOp_E) {
      newEvent.setEffect(
        new ToOp_E(new Operation360("", "", new Mode360("", "")))
      );
      setFormEvent(newEvent);
    } else if (e.target.value === effectEnum.TerminateSimulation_E) {
      newEvent.setEffect(new TerminateSimulation_E());
      setFormEvent(newEvent);
    }
  };

  const toOpOnChangeHandler = (e: SelectChangeEvent<string>) => {
    const newEvent = new Event360(
      formEvent.getTrigger(),
      formEvent.getEffect()
    );
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
    if (formEvent.getEffect().constructor.name === effectEnum.ToOp_E) {
      if (!toOpSelected?.getId()) return false;
    }
    if (andOrTriggerList.some((andOrTrigger) => !andOrTrigger.trigger)) {
      return false;
    }

    return true;
  };

  const confirmForm = () => {
    const newOpMachine = new OperationMachine(opMachine.getOperations());
    const operationNewEvent = newOpMachine.getOperationById(operation.getId());

    if (event) {
      operationNewEvent?.deleteEventToOperation(event);
    }

    newOpMachine.deleteOperationById(operation.getId());

    let finalTrigger = formEvent.getTrigger();
    andOrTriggerList.forEach((item) => {
      if (item.trigger) {
        if (item.type === "AND") {
          finalTrigger = new OnAllConditions_T([finalTrigger, item.trigger]);
        } else if (item.type === "OR") {
          finalTrigger = new OnAnyCondition_T([finalTrigger, item.trigger]);
        }
      }
    });

    const newEvent = new Event360(finalTrigger, formEvent.getEffect());
    if (operationNewEvent) {
      operationNewEvent.addEventToOperation(newEvent);
      newOpMachine.addOperationToOpMachine(operationNewEvent);
    }
    setOpMachine(newOpMachine);

    closeForm();
  };

  const closeForm = () => {
    setFormEvent(emptyEvent);
    setToOpSelected(undefined);
    onClose();
  };

  useEffect(() => {
    if (event) {
      let baseTrigger = event.getTrigger();
      const chain: { type: "AND" | "OR"; trigger?: Trigger360 }[] = [];

      while (
        (baseTrigger instanceof OnAllConditions_T ||
          baseTrigger instanceof OnAnyCondition_T) &&
        baseTrigger.getConditions().length > 0
      ) {
        const conditions = baseTrigger.getConditions();
        const compositeType =
          baseTrigger instanceof OnAllConditions_T ? "AND" : "OR";

        if (conditions.length > 1) {
          for (let i = 1; i < conditions.length; i++) {
            chain.push({ type: compositeType, trigger: conditions[i] });
          }
        }

        baseTrigger = conditions[0];
      }

      const newEvent = new Event360(baseTrigger, event.getEffect());
      setFormEvent(newEvent);
      chain.reverse();
      setAndOrTriggerList(chain);

      if (newEvent.getEffect().constructor.name === effectEnum.ToOp_E) {
        setToOpSelected((newEvent.getEffect() as ToOp_E).getTargetOperation());
      }
    }
  }, [event]);

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
        {andOrTriggerList.map((andOrTrigger, index) => (
          <Box
            key={andOrTrigger.type + index}
            sx={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Box sx={{ display: "flex", width: "50px", justifyContent: "end" }}>
              {andOrTrigger.type.charAt(0).toUpperCase() +
                andOrTrigger.type.slice(1).toLowerCase()}
            </Box>
            <FormControl fullWidth>
              <InputLabel>Trigger*</InputLabel>
              <Select
                label="Trigger"
                value={
                  (andOrTrigger.trigger as { className: string })?.className ||
                  ""
                }
                defaultValue=""
                onChange={(e) => {
                  const newTriggerList = [...andOrTriggerList];
                  newTriggerList[index].trigger = getTriggerClassByName(
                    e.target.value
                  );
                  setAndOrTriggerList(newTriggerList);
                }}
              >
                {triggerList
                  .filter(
                    (trigger) =>
                      !andOrTriggerList.some(
                        (andOrTrigger, i) =>
                          i !== index &&
                          (andOrTrigger.trigger as { className: string })
                            ?.className ===
                            (trigger as { className: string }).className
                      ) &&
                      (formEvent.getTrigger() as { className: string })
                        .className !==
                        (trigger as { className: string }).className
                  )
                  .map((trigger, index) => (
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
            <Button
              onClick={() => {
                setAndOrTriggerList((prevList) =>
                  prevList.filter((_, i) => i !== index)
                );
              }}
              sx={{
                minWidth: "15px",
                padding: "8px",
                cursor: "pointer",
                color: "#1D1B20",
                zIndex: 1000,
              }}
            >
              <TrashOutlinedIcon />
            </Button>
          </Box>
        ))}
        <Box sx={{ width: "40%" }}>
          <Tooltip
            onClose={handleTooltipClose}
            open={tooltipOpen}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
              <>
                <Box
                  onClick={() => {
                    setAndOrTriggerList((prevList) => [
                      ...prevList,
                      { type: "AND" },
                    ]);
                    handleTooltipClose();
                  }}
                  sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "start",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#3b383e",
                    },
                  }}
                >
                  And
                </Box>
                <Box
                  onClick={() => {
                    setAndOrTriggerList((prevList) => [
                      ...prevList,
                      { type: "OR" },
                    ]);
                    handleTooltipClose();
                  }}
                  sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "start",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#3b383e",
                    },
                  }}
                >
                  Or
                </Box>
              </>
            }
            slotProps={{
              tooltip: {
                sx: {
                  margin: "0 !important",
                  width: "88px",
                  backgroundColor: "#322F35",
                },
              },
              popper: {
                disablePortal: true,
              },
            }}
          >
            <div>
              <IenaiButtonText
                onClick={() => handleTooltipOpen()}
                label={"Add Trigger"}
                icon={<AddIcon fontSize="medium" />}
              />
            </div>
          </Tooltip>
        </Box>

        <DialogContentText sx={{ color: "var(--On-Surface, #1D1B20)" }}>
          Then
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel>Effect*</InputLabel>
          <Select
            label="Effect"
            value={
              formEvent.getEffect().constructor.name === effectEnum.ToOp_E ||
              formEvent.getEffect().constructor.name ===
                effectEnum.TerminateSimulation_E
                ? formEvent.getEffect().constructor.name
                : ""
            }
            defaultValue=""
            onChange={(e) => {
              effectOnChangeHandler(e);
            }}
          >
            <MenuItem value={effectEnum.ToOp_E}>To Operation</MenuItem>
            <MenuItem value={effectEnum.TerminateSimulation_E}>
              End Simulation
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Operation</InputLabel>
          <Select
            disabled={
              formEvent.getEffect().constructor.name !== effectEnum.ToOp_E
            }
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
            label={event ? "Edit event" : "Create event"}
            props={{ disabled: !confirmValidation() }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventModal;
