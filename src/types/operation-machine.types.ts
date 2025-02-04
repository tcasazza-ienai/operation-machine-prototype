import { Propulsion } from "./propulsion.types";
import { SpacecraftSystem } from "./spacecraft.types";

export type OperationMachine = {
    operations: Operation[]
}

export type Operation = {
    op_name: string;
    mode: Mode;
    events: OperationEvent[];
}

export type Mode = {
    mode_name: string;
    pointing: Pointing;
    system_mode?: SpacecraftSystem[];
    override_geometry?: SphereGeometry;
}


type OperationEvent = {
    trigger: string,
    effect: string,
}

// CONSULTAR CON SAM
type Effect =
    | ((target_op_name: string) => number) // ToOp(target_op_name)
    | ((DV_r: number, DV_c: number, DV_n: number, propulsion_system: Propulsion) => void) // Impulse
    | (() => void);                      // TerminateSimulation()



type Pointing = {
    pointer: string;
    target: string | NormalTargets;
}

type SphereGeometry = {
    area: number;
    CD: number;
    CR: number;
}

enum NormalTargets {
    av = "AlongVelocity",
    cv = "CounterVelocity",
    n = "Nadir",
    sf = "SunFacing"
}
