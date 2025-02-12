import React, { type FC } from "react";
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type Edge,
  type EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import { Box } from "@mui/material";

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform, label }: { transform: string; label: string }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          background: "transparent",
          padding: 10,
          color: "#ff5050",
          fontSize: 12,
          fontWeight: 700,
          zIndex: 5,
          transform,
        }}
        className="nodrag nopan"
      >
        {label}
      </div>
    </div>
  );
}

const CustomEdge: FC<
  EdgeProps<Edge<{ startLabel: string; endLabel: string }>>
> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  source,
  target,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const isBidirectional = source === target;

  // Calculate the midpoint between source and target
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // Calculate the distance between nodes
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate control point offset (adjust this value to control curve size)
  const offset = distance * 0.4;

  // Calculate the perpendicular offset for the control point
  const perpX = (-dy / distance) * offset;
  const perpY = (dx / distance) * offset;

  // Create a quadratic curve path
  const path = `M ${sourceX} ${sourceY} 
                Q ${midX + perpX} ${midY + perpY} ${targetX} ${targetY}`;
  // const [edgePath] = getSmoothStepPath({
  //   sourceX,
  //   sourceY,
  //   sourcePosition,
  //   targetX,
  //   targetY
  // })
  if (!data) {
    return <div>No data</div>;
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        {data.startLabel && (
          <EdgeLabel
            transform={`translate(-20%, -350%) translate(${sourceX}px,${sourceY}px)`}
            label={data.startLabel}
          />
        )}
        {data.endLabel && (
          <EdgeLabel
            transform={`translate(25%, -200%) translate(${targetX}px,${targetY}px)`}
            label={data.endLabel}
          />
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
