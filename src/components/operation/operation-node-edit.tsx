import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { useEffect, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useOpMachineStore } from '../../store/opMachineStore.ts';
import PopupMenu from '../menu/popup-menu.tsx';
import { Mode } from '../../types/operation-machine.types.ts';

const OperationNodeEdit: React.FC<{ defaultName: string, operationName: string, setOperationName: (newName) => void, selectedMode?: Mode }> = ({ defaultName, operationName, selectedMode, setOperationName }) => {
    const [selected, setSelected] = useState<string>(selectedMode?.mode_name ? selectedMode.mode_name : "");
    const textFieldRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    }, [selected]);
    return (
        <Box
            className="nodrag"
            sx={{
                padding: 2,
                border: "1px solid #1D1B20",
                borderRadius: "12px",
                background: "#FEF7FF",
                position: "relative",
                minWidth: "280px",
                textAlign: "center",
                overflow: "visible",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "11px" }}>
                <TextField
                    inputRef={textFieldRef}
                    placeholder={defaultName}
                    value={operationName}
                    onChange={(e) => setOperationName(e.target.value)}
                    variant='standard'
                    sx={{ fontSize: "14px", fontWeight: "bold" }}
                >{operationName}</TextField>
                <PopupMenu items={[]} />
            </Box>
            <Select
                disabled
                displayEmpty
                renderValue={selected !== "" ? undefined : () => <Typography sx={{ color: "#49454F" }}>Mode</Typography>}
                value={selected}
                sx={{ position: "relative", width: "100%", color: "#49454F", textAlign: "justify" }}
                IconComponent={() => null}
            >
                <MenuItem value={selected}>
                    {selected}
                </MenuItem>
            </Select>
            <Handle
                type="source"
                position={Position.Right}
                style={{ visibility: "hidden" }}
            />
            <Handle
                type="target"
                position={Position.Right}
                style={{ visibility: "hidden" }}
            />
            <Box
                sx={{
                    position: "absolute",
                    right: "-13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                }}
            >
                <AddCircleOutlineIcon sx={{ color: "#1D1B20", zIndex: 1000, opacity: 0.4 }} />
            </Box>
        </Box>
    );
};

export default OperationNodeEdit;