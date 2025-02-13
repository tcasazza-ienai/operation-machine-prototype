import { NodeProps } from "@xyflow/react";
import React, { useState } from "react";
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
    (opMachine.operations.filter((op) => op.op_name.includes("OPERATION"))
      .length +
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
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.push({
      id: (opMachine.operations.length + 2).toString(),
      op_name: (dataLabel || defaultName()).toUpperCase(),
      mode: { id: "", name: "", pointing: { pointer: "", target: "" } },
      events: [],
    });
    setOpMachine(newOpMachine);
  };

  const editOperation = () => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.filter((op) => op.id === data.id)[0].op_name =
      dataLabel || defaultName();
    setOpMachine(newOpMachine);
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
      events: data.events as OperationEvent[],
    });
    setOpMachine(newOpMachine);
  };

  const onChangeMode = (mode: Mode360) => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.filter((op) => op.id === data.id)[0].mode = mode;
    setOpMachine(newOpMachine);
  };

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
            selectedMode={data.mode as Mode}
          />
        </Box>
      ) : dataLabel && dataLabel.length > 0 ? (
        <OperationNodeAdded
          selectOnChange={onChangeMode}
          data={data as Operation}
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
