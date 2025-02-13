import { NodeProps } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import OperationNodeAdded from "./operation-node-added.tsx";
import OperationNodeEmpty from "./operation-node-empty.tsx";
import { Box } from "@mui/material";
import OperationNodeEdit from "./operation-node-edit.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import {
  Mode,
  Operation,
  OperationEvent,
} from "../../types/operation-machine.types.ts";
import BasicDialog from "../modals/basic-dialog.tsx";
import {
  Event360,
  Mode360,
  Operation360,
  OperationMachine,
  Pointing360,
  Target360,
} from "../../entities/OpMachine.ts";

const OperationNode: React.FC<NodeProps> = ({ data }) => {
  const [operationOptions, setOperationOptions] = useState<
    { label: string; action: () => void }[]
  >([
    {
      label: "Rename operation",
      action: () => {
        setEditMode({ active: true, operationId: data.id as string });
      },
    },
    { label: "Duplicate", action: () => setDuplicateModal(true) },
    { label: "Delete", action: () => setDeleteModal(true) },
  ]);
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
  const defaultName = () =>
    "OPERATION " +
    (opMachine
      .getOperations()
      .filter((op) => op.getOpName().includes("OPERATION")).length +
      1);
  const [editMode, setEditMode] = useState<{
    active: boolean;
    operationId?: string;
  }>({ active: false });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [duplicateModal, setDuplicateModal] = useState<boolean>(false);
  const [dataLabel, setDataLabel] = useState<string>(
    (data.operation as Operation).op_name as string
  );

  const onBlurEditOperation = () => {
    if (data.id !== "") {
      editOperation();
    } else {
      newOperation();
      setDataLabel("");
    }
    setEditMode({ active: false });
  };

  const newOperation = () => {
    const newOpMachine: OperationMachine = Object.assign({}, opMachine);
    newOpMachine.addOperationToOpMachine(
      new Operation360(
        (opMachine.getOperations().length + 2).toString(),
        (dataLabel || defaultName()).toUpperCase(),
        new Mode360("", "", new Pointing360("", Target360.ALONG_VELOCITY)),
        []
      )
    );
    setOpMachine(newOpMachine);
  };

  const editOperation = () => {
    const newOpMachine: OperationMachine = Object.assign({}, opMachine);
    const operation = newOpMachine.getOperationById(data.id as string);
    if (operation) {
      operation.setOpName(dataLabel || defaultName());
      setOpMachine(newOpMachine);
    }
  };

  const deleteOperation = () => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations = newOpMachine.operations.filter(
      (op) => op.id !== data.id
    );
    setOpMachine(newOpMachine);
  };

  const duplicateOperation = () => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.push({
      id: (opMachine.operations.length + 2).toString(),
      op_name: (dataLabel || defaultName()).toUpperCase(),
      mode: data.mode as Mode,
      events: data.events as Event360[],
    });
    setOpMachine(newOpMachine);
  };

  const onChangeMode = (mode: Mode) => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.filter((op) => op.id === data.id)[0].mode = mode;
    setOpMachine(newOpMachine);
  };

  useEffect(() => {
    console.log(data);
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
            selectedMode={(data.operation as Operation).mode as Mode}
          />
        </Box>
      ) : dataLabel && dataLabel.length > 0 ? (
        <OperationNodeAdded
          selectOnChange={onChangeMode}
          data={data.operation as Operation}
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
