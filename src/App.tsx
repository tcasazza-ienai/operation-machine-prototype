import React, { useRef } from "react";
import "./App.css";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

import OperationMachineBoard from "./components/operation-machine/operation-machine-board.tsx";
import SpacecraftSelect from "./components/select/spacecraft-select.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { Box } from "@mui/material";
import NewOperationsList from "./components/operation/new-operations-list.tsx";

function App() {
  return (
    <ReactFlowProvider>
      <div className="App">
        <header className="App-header">
          <AccountTreeOutlinedIcon sx={{ marginLeft: "12px" }} />
          Operation machine
        </header>
        <body className="App-body">
          <SpacecraftSelect />

          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
          >
            <NewOperationsList />
            <Box sx={{ width: { xs: "100%", md: "75%" }, marginTop: "20px" }}>
              <OperationMachineBoard />
            </Box>
          </Box>
        </body>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
