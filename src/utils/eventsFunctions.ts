import { Operation360, ToOp_E } from "../entities/OpMachine.ts";

export const filterOperationsByEventsToOpOrEnter = (
  operations: Operation360[]
) => {
  return operations.filter(
    (operation) =>
      operation.getEvents().length > 0 ||
      operations.some((op) =>
        op.getEvents().some((event) => {
          const effect = event.getEffect();
          if (effect instanceof ToOp_E)
            return effect.getTargetOperation() === operation;
          else return false;
        })
      )
  );
};

export const filterOperationsByNOEventsToOpOrEnter = (
  operations: Operation360[]
) => {
  return operations.filter(
    (operation) =>
      operation.getEvents().length < 1 &&
      !operations.some((op) =>
        op.getEvents().some((event) => {
          const effect = event.getEffect();
          if (effect instanceof ToOp_E)
            return effect.getTargetOperation() === operation;
          else return false;
        })
      )
  );
};
