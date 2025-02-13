import { Edge, MarkerType } from "@xyflow/react";
import { Operation } from "../types/operation-machine.types";
import { ToOp_E } from "../entities/OpMachine";

export const mappingToNodeOperations = (operations: Operation[]) => {
  const totalNodes = operations.length;
  const columns = Math.ceil(Math.sqrt(totalNodes));
  const nodeSpacingX = 500;
  const nodeSpacingY = 200;

  return operations.map((operation: Operation, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    return {
      id: "node-" + operation.id,
      type: "custom",
      data: operation,
      position: {
        x: col * nodeSpacingX,
        y: row * nodeSpacingY,
      },
    };
  });
};
