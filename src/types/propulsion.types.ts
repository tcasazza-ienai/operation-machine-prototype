interface ISimplePropulsion {
    id: string;
    name: string;
    thrust: number;
    specific_impulse: number;
    propellant_mass: number;
    dry_mass: number;
}

export type Propulsion = {
    id: string;
    name: string;
    thruster_unit: ThrusterUnit;
    reservoir: Reservoir;
    power_control_unit: PowerControlUnit;
}

export type SimpleElectricPropulsion = ISimplePropulsion & {
    efficiency: number;
}

export type SimpleChemicalPropulsion = ISimplePropulsion



type ThrusterUnit = {
    name: string;
    performance_model: PerformanceModel;
    mass: number;
    cost: number;
}

type PerformanceModel = {
    name: string;
    thrust: number;
    isp: number;
    power_draw: number;
}


type Reservoir = {
    name: string;
    propellant_mass: number;
    dry_mass: number;
    cost: number;
}

type PowerControlUnit = {
    name: string;
    efficiency: number;
    mass: number;
    cost: number;
}
