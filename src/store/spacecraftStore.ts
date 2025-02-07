import { create } from "zustand";
import spacefract1 from "../data/spacecraft/spacecraft-1.json";
import { OperationMachine } from "../types/operation-machine.types";
import { combine } from "zustand/middleware";
import { Spacecraft } from "../types/spacecraft.types";

export const useSpacecraftStore = create(
  combine({ spacecraft: spacefract1 as Spacecraft }, (set) => ({
    updateSpacecraft: (newSpacecraft: Spacecraft) =>
      set({ spacecraft: newSpacecraft }),
  }))
);
