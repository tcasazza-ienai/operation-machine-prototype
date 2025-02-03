import React, { useEffect, useState } from 'react';
import './App.css';
import { Operation, OperationMachine } from './types/operation-machine.types';
import operationMachine1 from './data/operation-machines/operation-machine-2.json'
import Spacecraft1 from './data/spacecraft/spacecraft-1.json'
import { Spacecraft } from './types/spacecraft.types';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { MenuItem, Select, Box } from '@mui/material';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import OperationNode from './components/operation/operation-node.tsx';



function App() {
  const [operationMachine, setOperationMachine] = useState<OperationMachine>(operationMachine1)
  const [spacecraft, setSpaceCraft] = useState<Spacecraft>(Spacecraft1)
  const mappingToNodeOperations = (operations: Operation[]) => {
    return operations.map((operation: Operation, index) => {
      return {
        id: operation.op_name,
        type: 'custom',
        data: { label: operation.op_name, mode: operation.mode.mode_name },
        position: { x: (250 * index + 2), y: (20 * index + 2) }
      }
    })
  }
  const [operations, setOperations] = useState(mappingToNodeOperations(operationMachine.operations));


  const nodeTypes = {
    custom: OperationNode,
  };

  return (
    <div className="App">
      <header className="App-header">
        <AccountTreeOutlinedIcon />
        Operations machine
      </header>
      <body className="App-body">
        <Select
          labelId="Spacecraft-label"
          id="Spacecraft-select"
          value={Spacecraft1.name}
          sx={{
            width: "30%", minWidth: "200px", '& .MuiOutlinedInput-input': {
              display: "flex"
            },
          }}
        >
          <MenuItem value={Spacecraft1.name} style={{ display: "flex", justifyContent: "start" }}>Spacecraft</MenuItem>
        </Select>
        <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column', marginTop: "20px" }}>
          <ReactFlow
            nodes={operations}
            nodeTypes={nodeTypes}
            style={{ width: '100%', border: '2px solid #ddd' }}
            nodesDraggable
          >
            <Controls />
            <Background
              gap={1}
              size={0}
              color="transparent"
            />
          </ReactFlow>
        </Box>
      </body>
    </div>
  );
}

export default App;

