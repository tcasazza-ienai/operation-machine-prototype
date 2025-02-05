import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const OperationNodeEmpty: React.FC = () => {
    const [selected, setSelected] = useState<string>("");
    const [modesList, setModeList] = useState<string[]>(["QLaw", "Counter Velocity", "Pointing Nadir", "Along Velocity"])

    return (
        <Box
            className="nodrag"
            sx={{
                padding: 2,
                border: "2px dashed #79747E",
                borderRadius: "12px",
                opacity: 0.8,
                background: "#FEF7FF",
                position: "relative",
                minWidth: "280px",
                textAlign: "center",
                overflow: "visible",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <Typography sx={{ color: "#1D1B20", fontSize: "14px", fontWeight: "400" }} variant="h6">Operation $n </Typography>
            </Box>
            <Select
                displayEmpty
                renderValue={selected !== "" ? undefined : () => <Typography sx={{ color: "#49454F" }}>Select mode</Typography>}
                value={selected}
                className='nodrag'
                onChange={(e) => setSelected(e.target.value)}
                sx={{ position: "relative", width: "100%", color: "#49454F", textAlign: "justify" }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", height: "40px", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #CAC4D0", zIndex: "-1" }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }} variant="h6">Modes:</Typography>
                    <Button disableRipple size="small" sx={{
                        borderRadius: 50, color: "#49454F", padding: "16px", width: "24px",
                        height: "24px",
                        minWidth: "24px",
                        minHeight: "24px",
                    }}>
                        <AddCircleOutlineIcon fontSize="small" />
                    </Button>
                </Box>
                {modesList.map((item, index) => (
                    <MenuItem value={item} key={item + index}>{item}</MenuItem>
                ))}

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
                <AddCircleOutlineIcon sx={{ color: "#1D1B20", cursor: "pointer", zIndex: 1000, opacity: 0.4 }} />
            </Box>
        </Box>
    );
};

export default OperationNodeEmpty;