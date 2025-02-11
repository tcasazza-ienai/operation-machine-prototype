import React, { useState } from "react";
import "./App.css";
import { Spacecraft } from "./types/spacecraft.types";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { MenuItem, Select, Box } from "@mui/material";

import OperationMachineBoard from "./components/operation-machine/operation-machine-board.tsx";
import SpacecraftSelect from "./components/select/spacecraft-select.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import {
  createSimpleOpMachine,
  createOpsMachine_Tutorial5,
  createOpsMachine_Tutorial5_2,
} from "./data/operation-machines/createOpMachine.ts";

function App() {
  const opMachine = createSimpleOpMachine();
  const opsMachine2 = createOpsMachine_Tutorial5();

  console.log(opsMachine2);

  return (
    <div className="App">
      <header className="App-header">
        <AccountTreeOutlinedIcon sx={{ marginLeft: "12px" }} />
        Operations machine
      </header>
      <body className="App-body">
        <SpacecraftSelect />
        <ReactFlowProvider>
          <OperationMachineBoard operations={opsMachine2.getOperations()} />
        </ReactFlowProvider>
      </body>
    </div>
  );
}

export default App;
