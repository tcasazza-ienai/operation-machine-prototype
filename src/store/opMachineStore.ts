import { create } from "zustand";
import { combine } from "zustand/middleware";
import { OperationMachine } from "../entities/OpMachine";
import { createOpsMachine_Tutorial_6 } from "../data/operation-machines/createOpMachine.ts";

export const useOpMachineStore = create(
  combine(
    { opMachine: createOpsMachine_Tutorial_6() as OperationMachine },
    (set) => ({
      updateOpMachine: (newOpMachine: OperationMachine) =>
        set({ opMachine: newOpMachine }),
    })
  )
);
