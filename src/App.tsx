import React, { useRef } from "react";
import "./App.css";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import OperationMachineBoard from "./components/operation-machine/operation-machine-board.tsx";
import SpacecraftSelect from "./components/select/spacecraft-select.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Box,
  Link,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from "@mui/material";
import NewOperationsList from "./components/operation/new-operations-list.tsx";
import OpMachineStepper from "./components/operation-machine/op-machine-stepper.tsx";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import IenaiButton from "./components/common/ienai-button.tsx";

function App() {
  const steps = ["Info", "Preview"];
  return (
    <ReactFlowProvider>
      <div className="App">
        <header className="App-header">
          <AccountTreeOutlinedIcon sx={accountTreeIconSx} />
          Operation machine
        </header>
        <body className="App-body">
          <Typography sx={typographySx}>
            Define the behaviors of your spacecraft during the mission. More
            about{" "}
            <Link
              href="https://py-docs-360.ienai.space/1.9.0/userguide/objects/behaviors/"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              Op-Machine at docs
            </Link>
            .
          </Typography>

          <Box sx={mainBoxSx}>
            <Box sx={leftBoxSx}>
              <OpMachineStepper stepNumber={0} steps={["Info", "Preview"]} />
              <Box sx={spacecraftHeaderBoxSx}>
                <Typography sx={typographyBoldSx}>
                  Spacecraft associated
                </Typography>
                <Tooltip
                  slotProps={{
                    tooltip: { sx: tooltipStyleSx },
                  }}
                  title="The spacecraft selected will condition the modes available for your operations. If you need to add more modes, open the spacecraft object and modify it to meet the requirements."
                >
                  <ErrorOutlineIcon fontSize="small" />
                </Tooltip>
              </Box>
              <SpacecraftSelect />
              <NewOperationsList />
            </Box>
            <Box sx={rightBoxSx}>
              <OperationMachineBoard />
            </Box>
          </Box>
        </body>
        <Box sx={bottomBoxSx}>
          <IenaiButton
            label="Preview Code"
            onClick={() => console.log("send code")}
          />
        </Box>
      </div>
    </ReactFlowProvider>
  );
}

export default App;

const accountTreeIconSx = { marginLeft: "12px" };

const typographySx = { textAlign: "start" };

const linkSx = {
  color: "#5641E2",
  fontWeight: "bold",
  textDecoration: "none",
  "&:hover": { textDecoration: "underline" },
};

const mainBoxSx = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  gap: "8px",
  marginTop: "20px",
};

const leftBoxSx = {
  display: "flex",
  flexDirection: "column",
  width: { xs: "100%", md: "25%" },
  marginRight: "20px",
  gap: "16px",
};

const spacecraftHeaderBoxSx = {
  display: "flex",
  justifyContent: "space-between",
  color: "#1D1B20",
};

const typographyBoldSx = { fontWeight: "bold" };

const tooltipStyleSx = {
  margin: "0 !important",
  color: "#F5EFF7",
  paddingX: "8px",
  maxWidth: "180px",
  backgroundColor: "#322F35",
  borderRadius: "4px",
  letterSpacing: "0.4px",
};

const rightBoxSx = { width: { xs: "100%", md: "75%" } };

const bottomBoxSx = {
  display: "flex",
  borderTop: "1px solid #CAC4D0",
  paddingTop: "8px",
};
