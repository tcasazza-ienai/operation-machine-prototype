import { SpacecraftSystem } from "./spacecraft.types";

export type OperationMachine = {
  id: string;
  operations: Operation[];
};

export type Operation = {
  id: string;
  op_name: string;
  mode: Mode;
  events: OperationEvent[];
};

export type Mode = {
  id: string;
  mode_name: string;
  pointing: Pointing;
  system_mode?: SpacecraftSystem[];
  override_geometry?: SphereGeometry;
};

export type OperationEvent = {
  id: string;
  trigger: string;
  effect: string;
};

type Pointing = {
  pointer: string;
  target: string | NormalTargets;
};

export type SphereGeometry = {
  area: number;
  CD: number;
  CR: number;
};

export enum NormalTargets {
  av = "AlongVelocity",
  cv = "CounterVelocity",
  n = "Nadir",
  sf = "SunFacing",
}

export type QLaw = {
  orbitTargeted: string;
  w_a: string;
  w_e: string;
  w_i: string;
};
