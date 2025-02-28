import React, { useEffect } from "react";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import { Mode360, Operation360, ToOp_E } from "../../entities/OpMachine.ts";
import { Box, Tooltip, Typography } from "@mui/material";
import IenaiButton from "../common/ienai-button.tsx";
import OperationNode from "./operation-node.tsx";
import AddIcon from "@mui/icons-material/Add";
import { useSpacecraftStore } from "../../store/spacecraftStore.ts";
import IenaiButtonOutlined from "../common/ienai-button-outlined.tsx";
import { filterOperationsByNOEventsToOpOrEnter } from "../../utils/eventsFunctions.ts";

const NewOperationsList: React.FC = () => {
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const spacecraftSelected = useSpacecraftStore((state) => state.spacecraft);
  const [operations, setOperations] = React.useState<Operation360[]>(
    opMachine.getOperations()
  );
  const createOperation = () => {
    const newNode = new Operation360("", "", new Mode360("", ""));
    const newOperations = [...operations, newNode];
    setOperations(newOperations);
  };

  useEffect(() => {
    setOperations(opMachine.getOperations());
  }, [opMachine]);

  return (
    <Box sx={outerBoxSx}>
      <Typography sx={typographySx}>
        Unallocated operations (
        {filterOperationsByNOEventsToOpOrEnter(operations).length})
      </Typography>
      <Box sx={controlBoxSx}>
        <Tooltip
          slotProps={{
            tooltip: { sx: tooltipSx(spacecraftSelected) },
          }}
          title="First associate an spacecraft to your Op-Machine"
        >
          <Box>
            <IenaiButtonOutlined
              onClick={createOperation}
              props={{
                disabled: !spacecraftSelected,
              }}
              label={"Add operation"}
              icon={<AddIcon fontSize="medium" />}
            />
          </Box>
        </Tooltip>
      </Box>
      <Box sx={operationsListBoxSx}>
        {operations.filter(
          (op) => op.getEvents().length === 0 || !op.getEvents()
        ).length > 0 &&
          filterOperationsByNOEventsToOpOrEnter(operations).map(
            (operation, index) => (
              <Box key={operation.getId() + index}>
                <OperationNode
                  operation={operation}
                  initialEditState={{ active: operation.getId() === "" }}
                />
              </Box>
            )
          )}
      </Box>
    </Box>
  );
};

export default NewOperationsList;

const outerBoxSx = {
  marginTop: "20px",
  maxHeight: { md: "50vh" },
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  gap: "10px",
};

const typographySx = {
  fontWeight: "bold",
  textAlign: "start",
};

const controlBoxSx = {
  display: "flex",
  justifyContent: "start",
  minWidth: "160px",
};

const tooltipSx = (spacecraftSelected: any) => ({
  display: spacecraftSelected ? "none" : "auto",
  margin: "0 !important",
  color: "#F5EFF7",
  paddingX: "8px",
  maxWidth: "180px",
  backgroundColor: "#322F35",
  borderRadius: "4px",
  letterSpacing: "0.4px",
});

const operationsListBoxSx = {
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
};
