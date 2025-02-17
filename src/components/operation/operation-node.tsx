import { Box, Button, Menu, MenuItem, Select, Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "@xyflow/react";
import React, { useEffect } from "react";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OperationNodeAdded from "./operation-node-added.tsx";
import OperationNodeEmpty from "./operation-node-empty.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import {
  Event360,
  Mode360,
  Operation360,
  OperationMachine,
  Pointing360,
} from "../../entities/OpMachine.ts";
import OperationNodeEdit from "./operation-node-edit.tsx";
import BasicDialog from "../modals/basic-dialog.tsx";

const OperationNode: React.FC<NodeProps> = ({ data }) => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);

  const [editMode, setEditMode] = useState<{
    active: boolean;
    operationId?: string;
  }>({ active: false });

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [duplicateModal, setDuplicateModal] = useState<boolean>(false);
  const [dataLabel, setDataLabel] = useState<string>(
    (data.operation as Operation360).getOpName()
  );

  const [operationOptions, setOperationOptions] = useState<
    { label: string; action: () => void }[]
  >([
    {
      label: "Rename operation",
      action: () => {
        setEditMode({
          active: true,
          operationId: (data.operation as Operation360).getId() as string,
        });
      },
    },
    { label: "Duplicate", action: () => setDuplicateModal(true) },
    { label: "Delete", action: () => setDeleteModal(true) },
  ]);

  const defaultName = () =>
    "OPERATION " +
    (opMachine
      .getOperations()
      .filter((op) => op.getOpName().includes("OPERATION"))?.length +
      1);

  const onBlurEditOperation = () => {
    if ((data.operation as Operation360).getId() !== "") {
      editOperation();
    } else {
      newOperation();
      setDataLabel("");
    }
    setEditMode({ active: false });
  };

  const newOperation = () => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    const newOperation = new Operation360(
      (opMachine.getOperations()?.length + 2).toString(),
      (dataLabel || defaultName()).toUpperCase(),
      new Mode360("", ""),
      []
    );

    newOpMachine.addOperationToOpMachine(newOperation);
    setOpMachine(newOpMachine);
  };

  const editOperation = () => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    opMachine
      .getOperationById((data.operation as Operation360).getId() as string)
      ?.setOpName(dataLabel || defaultName());

    setOpMachine(newOpMachine);
  };

  const deleteOperation = () => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    newOpMachine.deleteOperationById(
      (data.operation as Operation360).getId() as string
    );
    setOpMachine(newOpMachine);
  };

  const duplicateOperation = () => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    const newOperation = new Operation360(
      (opMachine.getOperations()?.length + 2).toString(),
      (dataLabel || defaultName()).toUpperCase(),
      data.mode as Mode360,
      data.events as Event360[]
    );

    newOpMachine.addOperationToOpMachine(newOperation);

    setOpMachine(newOpMachine);
  };

  const onChangeMode = (mode: Mode360) => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    newOpMachine.getOperationById(data.id as string)?.setOpMode(mode);
    setOpMachine(newOpMachine);
  };

  useEffect(() => {
    setDataLabel((data.operation as Operation360).getOpName());
  }, [data]);
  return (
    <>
      {editMode.active ? (
        <Box
          onBlur={() => {
            onBlurEditOperation();
          }}
        >
          <OperationNodeEdit
            defaultName={defaultName()}
            operationName={dataLabel}
            setOperationName={setDataLabel}
            selectedMode={
              (data.operation as Operation360).getOpMode() as Mode360
            }
          />
        </Box>
      ) : dataLabel?.length > 0 ? (
        <OperationNodeAdded
          selectOnChange={onChangeMode}
          data={data}
          options={operationOptions}
        />
      ) : (
        <Box
          onClick={() => setEditMode({ active: true })}
          sx={{ cursor: "pointer" }}
        >
          <OperationNodeEmpty />
        </Box>
      )}
      <BasicDialog
        open={deleteModal}
        confirmBottonLabel="Delete"
        onClose={() => setDeleteModal(false)}
        onConfirm={deleteOperation}
        confirmColor="error"
        title={`Delete Operation: ${dataLabel}`}
        description="Are you sure you want to delete this operation?"
      />
      <BasicDialog
        open={duplicateModal}
        confirmBottonLabel="Duplicate"
        onClose={() => setDuplicateModal(false)}
        onConfirm={duplicateOperation}
        confirmColor="success"
        title={`Duplicate Operation: ${dataLabel}`}
        description="Are you sure you want to duplicate this operation?"
      />
    </>
  );
};

export default OperationNode;
