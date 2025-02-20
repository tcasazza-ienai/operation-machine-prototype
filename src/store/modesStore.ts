import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Mode360 } from "../entities/OpMachine.ts";

const initialModesStore: Mode360[] = [
  new Mode360("1", "NominalMode"),
  new Mode360("2", "ThrustingMode"),
  new Mode360("3", "NOM"),
  new Mode360("4", "COAST"),
  new Mode360("5", "COMMS"),
];

export const useModesStore = create(
  combine({ modes: initialModesStore }, (set) => ({
    updateModes: (newModes: Mode360[]) => set({ modes: newModes }),
  }))
);
