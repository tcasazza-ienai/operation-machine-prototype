import { Box, Button, Menu, MenuItem, Select, Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "@xyflow/react";
import React, { useEffect } from "react";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OperationNodeAdded from "./operation-node-added.tsx";
import OperationNodeEmpty from "./operation-node-empty.tsx";
import PopupMenu from "../menu/popup-menu.tsx";

const OperationNode: React.FC<NodeProps> = ({ data }) => {
  const { isBiDirectional, dataFlow, hasEndNode, isEndNode } = data;
  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <>
      {data.label === "End Simulation" ? (
        <Box
          //   className="nodrag"
          sx={{
            padding: 2,
            border: "1px solid #1D1B20",
            borderRadius: "12px",
            background: "#A53A36",
            position: "relative",
            minWidth: "280px",
            textAlign: "center",
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <Typography
              sx={{ fontSize: "14px", fontWeight: "bold" }}
              variant="h6"
            >
              {data.label as string}{" "}
            </Typography>
          </Box>
          <Handle
            type="source"
            id="terminate-sim-source"
            position={Position.Right}
            style={{ visibility: "hidden" }}
          />
          <Handle
            type="target"
            position={Position.Top}
            style={{ visibility: "hidden" }}
          />
        </Box>
      ) : (data.label as string).length > 0 ? (
        <OperationNodeAdded data={data} />
      ) : (
        <OperationNodeEmpty />
      )}
    </>
  );
};

export default OperationNode;
