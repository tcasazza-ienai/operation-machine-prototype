import { Box } from '@mui/material';
import { Background, Controls, Handle, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import React, { useEffect, useState } from 'react';
import { Operation, OperationMachine } from '../../types/operation-machine.types';
import { mappingToEdgesOperations, mappingToNodeOperations } from '../../utils/nodeOperations.ts';
import OperationNode from '../operation/operation-node.tsx';
import '@xyflow/react/dist/style.css';
import { useOpMachineStore } from '../../store/opMachineStore.ts';
const OperationMachineBoard: React.FC = () => {
    const opMachine = useOpMachineStore((state) => state.opMachine);
    const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();

    const refreshNodes = (operations: Operation[]) => {
        const newNodes = mappingToNodeOperations(operations);
        setTimeout(() => {
            setNodes(newNodes as never[]);
        }, 100)
    }

    useEffect(() => {
        if (nodes.length > 0) {
            setEdges(mappingToEdgesOperations(opMachine.operations) as never[]);
        }
        fitView();
    }, [nodes])


    useEffect(() => {
        refreshNodes(opMachine.operations)
    }, [opMachine])

    useEffect(() => {
        if (!opMachine.operations.find((op) => op.id == "")) {
            const newOperationMachine = opMachine;
            newOperationMachine.operations.push({ id: '', op_name: '', mode: { id: '', mode_name: '', pointing: { pointer: '', target: '' }, }, events: [] });
            setOpMachine(newOperationMachine)
        }
    }, [])

    const nodeTypes = {
        custom: OperationNode,
    };
    return (
        <Box sx={{ border: '2px solid #ddd', borderRadius: "8px", padding: "16px", height: '70vh', display: 'flex', flexDirection: 'column', marginTop: "20px" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                zoomOnPinch={false}
                style={{ width: '100%' }}
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