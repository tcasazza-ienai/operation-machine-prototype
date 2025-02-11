import { create } from "zustand";
import modes from "../data/modes/modes1.json";
import { Mode } from "../types/operation-machine.types";
import { combine } from "zustand/middleware";

export const useModesStore = create(
  combine({ modes: modes as Mode[] }, (set) => ({
    updateModes: (newModes: Mode[]) => set({ modes: newModes }),
  }))
);
