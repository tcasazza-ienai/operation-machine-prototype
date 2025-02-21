import { Box } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import React, { useEffect } from "react";
import { useState } from "react";
import OperationNodeAdded from "./operation-node-added.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import {
  Event360,
  Mode360,
  Operation360,
  OperationMachine,
} from "../../entities/OpMachine.ts";
import OperationNodeEdit from "./operation-node-edit.tsx";
import BasicDialog from "../modals/basic-dialog.tsx";
import OperationEndSimulationNode from "./operation-end-simulation-node.tsx";

const OperationNode: React.FC<{
  operation: Operation360;
  initialEditState?: {
    active: boolean;
    operationId?: string;
  };
  aditionalData?: any;
}> = ({
  operation,
  initialEditState = { active: false, operationId: "" },
  aditionalData,
}) => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);

  const [editMode, setEditMode] = useState<{
    active: boolean;
    operationId?: string;
  }>({
    active: initialEditState.active,
    operationId: initialEditState.operationId,
  });

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [duplicateModal, setDuplicateModal] = useState<boolean>(false);
  const [dataLabel, setDataLabel] = useState<string>(
    (operation as Operation360).getOpName()
  );

  const [operationOptions, setOperationOptions] = useState<
    { label: string; action: () => void }[]
  >([
    {
      label: "Rename operation",
      action: () => {
        setEditMode({
          active: true,
          operationId: (operation as Operation360).getId() as string,
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
    if ((operation as Operation360).getId() !== "") {
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
      .getOperationById((operation as Operation360).getId() as string)
      ?.setOpName(dataLabel || defaultName());

    setOpMachine(newOpMachine);
  };

  const deleteOperation = () => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    newOpMachine.deleteOperationById(
      (operation as Operation360).getId() as string
    );
    setOpMachine(newOpMachine);
  };

  const duplicateOperation = () => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    const newOperation = new Operation360(
      (opMachine.getOperations()?.length + 2).toString(),
      (dataLabel || defaultName()).toUpperCase(),
      (operation as Operation360).getOpMode() as Mode360,
      (operation as Operation360).getEvents() as Event360[]
    );

    newOpMachine.addOperationToOpMachine(newOperation);

    setOpMachine(newOpMachine);
  };

  const onChangeMode = (mode: Mode360) => {
    let newOpMachine = new OperationMachine(opMachine.getOperations());
    newOpMachine
      .getOperationById((operation as Operation360).getId() as string)
      ?.setOpMode(mode);
    setOpMachine(newOpMachine);
  };

  useEffect(() => {
    setDataLabel((operation as Operation360).getOpName());
  }, [operation]);
  return (
    <>
      {(operation as Operation360).getId() === "" &&
      (operation as Operation360).getOpName() === "End Simulation" ? (
        <OperationEndSimulationNode />
      ) : editMode.active ? (
        <Box
          onBlur={() => {
            onBlurEditOperation();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (document.activeElement) {
                (document.activeElement as HTMLElement).blur();
              }
            }
          }}
          tabIndex={0}
        >
          <OperationNodeEdit
            defaultName={defaultName()}
            operationName={dataLabel}
            setOperationName={setDataLabel}
            selectedMode={(operation as Operation360).getOpMode() as Mode360}
          />
        </Box>
      ) : (
        dataLabel?.length > 0 && (
          <OperationNodeAdded
            selectOnChange={onChangeMode}
            operation={operation}
            options={operationOptions}
            aditionalData={aditionalData}
          />
        )
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
