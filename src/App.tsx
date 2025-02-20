import React from "react";
import "./App.css";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

import OperationMachineBoard from "./components/operation-machine/operation-machine-board.tsx";
import SpacecraftSelect from "./components/select/spacecraft-select.tsx";
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AccountTreeOutlinedIcon sx={{ marginLeft: "12px" }} />
        Operation machine
      </header>
      <body className="App-body">
        <SpacecraftSelect />
        <ReactFlowProvider>
          <OperationMachineBoard />
        </ReactFlowProvider>
      </body>
    </div>
  );
}

export default App;
