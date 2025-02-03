import { Operation } from "../types/operation-machine.types";

export const mappingToNodeOperations = (operations: Operation[]) => {
    const totalNodes = operations.length;
    const columns = Math.ceil(Math.sqrt(totalNodes));
    const nodeSpacingX = 500;
    const nodeSpacingY = 300;

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