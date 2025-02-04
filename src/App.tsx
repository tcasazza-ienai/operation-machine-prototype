import React, { useState } from 'react';
import './App.css';
import { Spacecraft } from './types/spacecraft.types';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { MenuItem, Select, Box } from '@mui/material';

import OperationMachineBoard from './components/operation-machine/operation-machine-board.tsx';
import SpacecraftSelect from './components/select/spacecraft-select.tsx';



function App() {






  return (
    <div className="App">
      <header className="App-header">
        <AccountTreeOutlinedIcon sx={{ marginLeft: "12px" }} />
        Operations machine
      </header>
      <body className="App-body">
        <SpacecraftSelect />
        <OperationMachineBoard />
      </body>
    </div>
  );
}

export default App;

