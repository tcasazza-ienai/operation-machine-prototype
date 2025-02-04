import { Box, Button, Menu, MenuItem, Select, Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "@xyflow/react";
import React, { useEffect } from "react";
import { useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const OperationNode: React.FC<NodeProps> = ({ data }) => {
    const [modesList, setModeList] = useState(["QLaw", "Counter Velocity", "Pointing Nadir", "Along Velocity"])
    const [selected, setSelected] = useState<string>("");



    useEffect(() => {
        if (data?.mode) {
            setSelected(data?.mode as string);
        }
    }, [data.mode]);
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
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }} variant="h6">{data.label as string} </Typography>

            </Box>
            <Select
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
                {modesList.map((item) => (
                    <MenuItem value={item} >{item}</MenuItem>
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
                <AddCircleOutlineIcon sx={{ color: "#1D1B20", cursor: "pointer", zIndex: 1000 }} />
            </Box>
        </Box>
    );
};

export default OperationNode;