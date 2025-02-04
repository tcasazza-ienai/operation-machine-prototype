import { Edge, MarkerType } from "@xyflow/react";
import { Operation } from "../types/operation-machine.types";

export const mappingToNodeOperations = (operations: Operation[]) => {
    const totalNodes = operations.length;
    const columns = Math.ceil(Math.sqrt(totalNodes));
    const nodeSpacingX = 500;
    const nodeSpacingY = 200;

    return operations.map((operation: Operation, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;

        return {
            id: operation.op_name,
            type: 'custom',
            data: { label: operation.op_name, mode: operation.mode.mode_name },
            position: {
                x: col * nodeSpacingX,
                y: row * nodeSpacingY
            }
        };
    });
};

export const mappingToEdgesOperations = (operations: Operation[]) => {
    const edges: Edge[] = []
    operations.forEach((operation: Operation, index) => {
        operation.events.forEach((event) => {
            if (event.effect.includes('ToOp')) {
                const target = event.effect.split('ToOp')[1].replace('(', '').replace(')', '');
                edges.push({
                    id: operation.op_name + '-' + index + '-' + target,
                    source: operation.op_name,
                    target: target,
                    animated: false,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 15,
                        height: 15,
                        color: 'grey',
                    },
                    label: event.trigger,
                    style: {
                        strokeWidth: 4,
                        stroke: 'grey',
                    },
                });
            }
        })
    });
    return edges;
};
