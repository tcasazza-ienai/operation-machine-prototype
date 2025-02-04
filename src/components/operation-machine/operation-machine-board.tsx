import { Box } from '@mui/material';
import { Background, Controls, Handle, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import React, { useEffect, useState } from 'react';
import { OperationMachine } from '../../types/operation-machine.types';
import operationMachine1 from '../../data/operation-machines/operation-machine-1.json'
import { mappingToEdgesOperations, mappingToNodeOperations } from '../../utils/nodeOperations.ts';
import OperationNode from '../operation/operation-node.tsx';
import '@xyflow/react/dist/style.css';
const OperationMachineBoard: React.FC = () => {
    const [operationMachine, setOperationMachine] = useState<OperationMachine>(operationMachine1)
    const [nodes, setNodes, onNodesChange] = useNodesState(mappingToNodeOperations(operationMachine.operations));
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);


    useEffect(() => {
        if (nodes.length > 0) {
            setEdges(mappingToEdgesOperations(operationMachine.operations) as never[]);
        }
    }, [nodes])

    const nodeTypes = {
        custom: OperationNode,
    };
    return (
        <Box sx={{ border: '2px solid #ddd', borderRadius: "8px", padding: "16px", height: '70vh', display: 'flex', flexDirection: 'column', marginTop: "20px" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                style={{ width: '100%', }}
                nodesDraggable
            >
                <Controls />
                <Background
                    gap={1}
                    color="transparent"
                />
            </ReactFlow>
        </Box>
    );
};

export default OperationMachineBoard;