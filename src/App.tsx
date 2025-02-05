import React, { useState } from 'react';
import './App.css';
import { Spacecraft } from './types/spacecraft.types';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { MenuItem, Select, Box } from '@mui/material';
import OperationMachineBoard from './components/operation-machine/operation-machine-board.tsx';
import SpacecraftSelect from './components/select/spacecraft-select.tsx';
import { ReactFlowProvider } from '@xyflow/react';
import { OperationMachine } from './types/operation-machine.types.ts';
import { create } from 'zustand';

function App() {


  return (
    <div className="App">
      <header className="App-header">
        <AccountTreeOutlinedIcon sx={{ marginLeft: "12px" }} />
        Operations machine
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

