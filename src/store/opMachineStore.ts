import { create } from "zustand";
import { combine } from "zustand/middleware";
import { OperationMachine } from "../entities/OpMachine.ts";

export const useOpMachineStore = create(
  combine(
    { opMachine: new OperationMachine([]) as OperationMachine },
    (set) => ({
      updateOpMachine: (newOpMachine: OperationMachine) =>
        set({ opMachine: newOpMachine }),
    })
  )
);
