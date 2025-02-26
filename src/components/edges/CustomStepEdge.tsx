import React, { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  EdgeText,
  getSmoothStepPath,
} from "@xyflow/react";
import EditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import TrashOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Tooltip } from "@mui/material";
import {
  Event360,
  Operation360,
  OperationMachine,
  TerminateSimulation_E,
  ToOp_E,
} from "../../entities/OpMachine.ts";
import BasicDialog from "../modals/basic-dialog.tsx";
import { useOpMachineStore } from "../../store/opMachineStore.ts";
import EventModal from "../modals/event-modal.tsx";

const CustomStepEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  labelBgStyle,
  labelStyle,
  sourcePosition,
  targetPosition,
  style = {},
  animated,
  data = {},
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const [bidirectionalEdgePath, bidirectionalLabelX, bidirectionalLabelY] =
    getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition: sourcePosition,
      targetPosition,
    });

  console.log(sourcePosition);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [eventModal, setEventModal] = useState<boolean>(false);
  const opMachine = useOpMachineStore((state) => state.opMachine);
  const setOpMachine = useOpMachineStore((state) => state.updateOpMachine);

  function buildTriggerText(trigger: any): string {
    if (trigger.conditions && trigger.type) {
      const operator = trigger.type === "AND" ? " AND " : " OR ";
      const conditionsText = trigger.conditions
        .map((cond: any) => buildTriggerText(cond))
        .join(operator);
      return `(${conditionsText})`;
    } else if (typeof trigger.getTriggerName === "function") {
      let text = trigger.getTriggerName();

      return text;
    }
    return "Unknown trigger";
  }

  function buildEffectText(effect: any): string {
    if (effect && typeof effect === "object") {
      if (effect.constructor.name === "ToOp_E") {
        return `To Op: ${effect.getTargetOperation().getOpName()}`;
      } else if (effect.constructor.name === "TerminateSimulation_E") {
        return "Terminate simulation";
      } else if (effect.constructor.name === "Impulse_E") {
        return "Impulse effect";
      }
    }
    return "Unknown effect";
  }

  function eventToConditionalText(event: Event360): string {
    console.log("EVENT:", data);
    const triggerText = buildTriggerText(event.getTrigger());
    const effectText = buildEffectText(event.getEffect());
    return `IF ${triggerText} THEN ${effectText}`;
  }

  const deleteEvent = () => {
    const newOperation = data.operation as Operation360;
    const newOpMachine = new OperationMachine(opMachine.getOperations());
    newOperation.deleteEventToOperation(data.event as Event360);
    newOpMachine.deleteOperationById(newOperation.getId());
    newOpMachine.addOperationToOpMachine(newOperation);
    setOpMachine(newOpMachine);
    setDeleteModal(false);
  };

  return (
    <>
      <svg className="react-flow__marker">
        <defs>
          <marker
            id={`arrowclosed-${id}`}
            markerWidth="15"
            markerHeight="15"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
            color="#b1b1b7"
            viewBox="0 0 10 10"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
          </marker>
        </defs>
        <BaseEdge
          id={id}
          path={
            data.startLabel || data.endLabel ? bidirectionalEdgePath : edgePath
          }
          style={{ strokeWidth: 3, ...style }}
          className={`react-flow__edge-path ${animated ? "animated" : ""}`}
          markerEnd={`url(#arrowclosed-${id})`}
        />
      </svg>
      <EdgeLabelRenderer>
        <Tooltip
          title={
            <div style={{ maxWidth: "150px" }}>
              <div style={{ margin: "8px", fontSize: "14px" }}>
                {data?.event &&
                (data?.event as Event360).getEffect().constructor.name ===
                  "TerminateSimulation_E"
                  ? "Terminate simulation"
                  : eventToConditionalText(data?.event as Event360)}
              </div>
              <div style={{ margin: "0px 8px 0px 8px" }}>
                <Tooltip title="Edit">
                  <EditOutlinedIcon
                    onClick={() => {
                      setEventModal(true);
                    }}
                    style={{ cursor: "pointer", margin: "8px" }}
                    fontSize="small"
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <TrashOutlinedIcon
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                    style={{ cursor: "pointer", margin: "8px" }}
                    fontSize="small"
                  />
                </Tooltip>
              </div>
            </div>
          }
          slotProps={{
            tooltip: {
              sx: {
                margin: "0 !important",
                backgroundColor: "#322F35",
              },
            },
          }}
        >
          <div
            className="edge-label-renderer__custom-edge"
            style={{
              position: "absolute",
              pointerEvents: "auto",
              transform: `translate(0%, ${
                105 * (data?.operationEdges as Array<any>).length -
                (data?.operationEdges as Array<any>).length
              }%) translate(${labelX}px, ${labelY}px)`,
              background: labelBgStyle?.fill,
              color: labelStyle?.fill,
              fontSize: labelStyle?.fontSize,
              fontWeight: labelStyle?.fontWeight,
              zIndex: labelStyle?.zIndex,
              padding: "5px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <div className="edge-label-renderer__custom-edge">{label}</div>
            {data.startLabel || data.endLabel ? (
              <div className="edge-label-renderer__custom-edge">
                ({(data?.operation as Operation360).getOpName()})
              </div>
            ) : (
              <></>
            )}
          </div>
        </Tooltip>
      </EdgeLabelRenderer>
      <BasicDialog
        open={deleteModal}
        confirmBottonLabel="Delete"
        onClose={() => setDeleteModal(false)}
        onConfirm={deleteEvent}
        confirmColor="error"
        title={`${label}`}
        description={`Are you sure you want to DELETE this Event?: ${eventToConditionalText(
          data.event as Event360
        )}`}
      />
      <EventModal
        onClose={() => setEventModal(false)}
        open={eventModal}
        operation={data.operation as Operation360}
        event={data.event as Event360}
      />
    </>
  );
};

export default CustomStepEdge;
