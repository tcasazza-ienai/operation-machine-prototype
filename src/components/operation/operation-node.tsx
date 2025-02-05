import { Box, Button, Menu, MenuItem, Select, Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "@xyflow/react";
import React, { useEffect } from "react";
import { useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OperationNodeAdded from "./operation-node-added.tsx";
import OperationNodeEmpty from "./operation-node-empty.tsx";

const OperationNode: React.FC<NodeProps> = ({ data }) => {

    useEffect(() => {
        console.log(data);
    }, [])
    return (
        <>
            {(data.label as string).length > 0 ? <OperationNodeAdded data={data} /> : <OperationNodeEmpty />}
        </>


    );
};

export default OperationNode;