import { NodeProps } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import OperationNodeAdded from "./operation-node-added.tsx";
import OperationNodeEmpty from "./operation-node-empty.tsx";
import { Box } from "@mui/material";
import OperationNodeEdit from "./operation-node-edit.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";

const OperationNode: React.FC<NodeProps> = ({ data }) => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
  const defaultName = () => "OPERATION " + (opMachine.operations.filter((op) => op.op_name.includes("OPERATION")).length + 1);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [dataLabel, setDataLabel] = useState<string>(data.label as string);

  const newOperation = (name: string) => {
    let newOpMachine = { ...opMachine };
    newOpMachine.operations.push({
      id: (opMachine.operations.length + 2).toString(),
      op_name: name.toUpperCase(),
      mode: { id: '', mode_name: '', pointing: { pointer: '', target: '' } },
      events: [],
    });
    setOpMachine(newOpMachine)
  }

  useEffect(() => {
    console.log("operations", opMachine.operations)
  }, [opMachine])

  return (
    <>
      {(data.label as string).length > 0 ? (
        <OperationNodeAdded data={data} />
      ) : editMode ? (
        <Box onBlur={() => {
          newOperation(dataLabel ? dataLabel : defaultName())
          setEditMode(false)
        }}>
          <OperationNodeEdit defaultName={defaultName()} operationName={dataLabel} setOperationName={setDataLabel} selectedMode={data.mode as string} />
        </Box>
      ) : (
        <Box onClick={() => setEditMode(true)} sx={{ cursor: "pointer" }}>
          <OperationNodeEmpty />
        </Box>
      )}
    </>


  );
};

export default OperationNode;