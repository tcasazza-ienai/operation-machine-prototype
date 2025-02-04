import { Box } from '@mui/material';
import { Background, Controls, Handle, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import React, { useEffect, useState } from 'react';
import { Operation, OperationMachine } from '../../types/operation-machine.types';
import operationMachine1 from '../../data/operation-machines/operation-machine-1.json'
import { mappingToEdgesOperations, mappingToNodeOperations } from '../../utils/nodeOperations.ts';
import OperationNode from '../operation/operation-node.tsx';
import '@xyflow/react/dist/style.css';
const OperationMachineBoard: React.FC = () => {
    const [operationMachine, setOperationMachine] = useState<OperationMachine>(operationMachine1)
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();

    const refreshNodes = (operations: Operation[]) => {
        const initialOperations = operations
        initialOperations.push({ op_name: '', mode: { mode_name: '', pointing: { pointer: '', target: '' }, }, events: [] });
        const initialNodes = mappingToNodeOperations(initialOperations);

        setNodes(initialNodes as never[]);
    }

    useEffect(() => {
        if (nodes.length > 0) {
            setEdges(mappingToEdgesOperations(operationMachine.operations) as never[]);
        }
        fitView();
    }, [nodes])


    useEffect(() => {
        fitView();
    }, [edges,])

    useEffect(() => {
        refreshNodes(operationMachine.operations)
    }, [operationMachine,])

    const nodeTypes = {
        custom: OperationNode,
    };
    return (
        <Box sx={{ border: '2px solid #ddd', borderRadius: "8px", padding: "16px", height: '70vh', display: 'flex', flexDirection: 'column', marginTop: "20px" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                style={{ width: '100%', }}
                nodesDraggable
            >
                <Background
                    gap={1}
                    color="transparent"
                />
            </ReactFlow>
        </Box>
    );
};

export default OperationMachineBoard;