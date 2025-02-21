import React, { useEffect } from "react";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import { Mode360, Operation360 } from "../../entities/OpMachine.ts";
import { Box } from "@mui/material";
import IenaiButton from "../common/ienai-button.tsx";
import OperationNode from "./operation-node.tsx";
import AddIcon from "@mui/icons-material/Add";

const NewOperationsList: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const [operations, setOperations] = React.useState<Operation360[]>(
    opMachine.getOperations()
  );
  const createOperation = () => {
    const newNode = new Operation360("", "", new Mode360("", ""));
    const newOperations = [...operations, newNode];
    setOperations(newOperations);
    console.log(operations);
  };

  useEffect(() => {
    setOperations(opMachine.getOperations());
  }, [opMachine]);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "20%" },
        marginTop: "20px",
        height: { md: "70vh" },
        marginRight: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          minWidth: "160px",
        }}
      >
        <IenaiButton
          onClick={createOperation}
          label={"Add operation"}
          icon={<AddIcon fontSize="medium" />}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          paddingRight: "20px",
          gap: "10px",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
          overflowY: "auto",
        }}
      >
        {operations.filter(
          (op) => op.getEvents().length === 0 || !op.getEvents()
        ).length > 0 &&
          operations
            .filter((op) => op.getEvents().length === 0 || !op.getEvents())
            .map((operation) => (
              <Box>
                <OperationNode
                  operation={operation}
                  initialEditState={{ active: operation.getId() === "" }}
                />
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default NewOperationsList;
