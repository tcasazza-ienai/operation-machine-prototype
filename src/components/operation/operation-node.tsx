import { NodeProps } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import OperationNodeAdded from "./operation-node-added.tsx";
import OperationNodeEmpty from "./operation-node-empty.tsx";
import { Box } from "@mui/material";
import OperationNodeEdit from "./operation-node-edit.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import { Mode, Operation } from "../../types/operation-machine.types.ts";

const OperationNode: React.FC<NodeProps> = ({ data }) => {

  const [operationOptions, setOperationOptions] = useState<{ label: string, action: () => void }[]>([{ label: "Rename operation", action: () => { setEditMode({ active: true, operationId: data.id as string }) } }, { label: "Duplicate", action: () => { } }, { label: "Delete", action: () => { } }]);
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
  const defaultName = () => "OPERATION " + (opMachine.operations.filter((op) => op.op_name.includes("OPERATION")).length + 1);
  const [editMode, setEditMode] = useState<{ active: boolean, operationId?: string }>({ active: false });
  const [dataLabel, setDataLabel] = useState<string>(data.op_name as string);

  const onBlurEditOperation = () => {
    if (data.id !== "") {
      editOperation()
    } else {
      newOperation()
      setDataLabel("")
    }
    setEditMode({ active: false })
  }

  const newOperation = () => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.push({
      id: (opMachine.operations.length + 2).toString(),
      op_name: (dataLabel || defaultName()).toUpperCase(),
      mode: { id: '', mode_name: '', pointing: { pointer: '', target: '' } },
      events: [],
    });
    setOpMachine(newOpMachine)
  }

  const editOperation = () => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.filter((op) => op.id === data.id)[0].op_name = dataLabel || defaultName();
    setOpMachine(newOpMachine);
  }

  return (
    <>
      {editMode.active ?
        (
          <Box onBlur={() => {
            onBlurEditOperation()
          }}>
            <OperationNodeEdit defaultName={defaultName()} operationName={dataLabel} setOperationName={setDataLabel} selectedMode={data.mode as Mode} />
          </Box>
        )
        : (dataLabel).length > 0 ?
          (
            <OperationNodeAdded data={data as Operation} options={operationOptions} />
          )
          :
          (
            <Box onClick={() => setEditMode({ active: true })} sx={{ cursor: "pointer" }}>
              <OperationNodeEmpty />
            </Box>
          )}
    </>
  );
};

export default OperationNode;