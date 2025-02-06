import { System360 } from "./System.ts";

export abstract class Propulsion360 {
  protected readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class SimplePropulsion360 extends Propulsion360 {
  private readonly thrust: number;
  private readonly specific_impulse: number;
  private readonly propellant_mass: number;
  private readonly dry_mass: number = 0.0;

  constructor(
    name: string,
    thrust: number,
    specific_impulse: number,
    propellant_mass: number,
    dry_mass: number = 0.0
  ) {
    super(name);
    this.thrust = thrust;
    this.specific_impulse = specific_impulse;
    this.propellant_mass = propellant_mass;
    this.dry_mass = dry_mass;
  }
}

export class SimpleElectricPropulsion360 extends SimplePropulsion360 {
  private readonly efficiency: number;

  constructor(
    name: string,
    thrust: number,
    specific_impulse: number,
    efficiency: number,
    propellant_mass: number,
    dry_mass: number = 0.0
  ) {
    super(name, thrust, specific_impulse, propellant_mass, dry_mass);
    this.efficiency = efficiency;
  }
}

export class SimpleChemicalPropulsion360 extends SimplePropulsion360 {
  constructor(
    name: string,
    thrust: number,
    specific_impulse: number,
    propellant_mass: number,
    dry_mass: number = 0.0
  ) {
    super(name, thrust, specific_impulse, propellant_mass, dry_mass);
  }
}

type PerformanceModel = {
  name: string;
  thrust: number;
  isp: number;
  power_draw: number;
};

export class ThrusterUnit360 extends System360 {
  private readonly performance_model: PerformanceModel;

  constructor(
    name: string,
    mass: number,
    cost: number,
    performance_model: PerformanceModel
  ) {
    super(name, mass, cost);
    this.performance_model = performance_model;
  }
}

export class Reservoir360 extends System360 {
  private readonly propellant_mass: number;
  private readonly dry_mass: number;

  constructor(
    name: string,
    cost: number,
    propellant_mass: number,
    dry_mass: number
  ) {
    super(name, propellant_mass + dry_mass, cost);
    this.propellant_mass = propellant_mass;
    this.dry_mass = dry_mass;
  }
}

export class PowerControlUnit360 extends System360 {
  private readonly efficiency: number;

  constructor(name: string, mass: number, cost: number, efficiency: number) {
    super(name, mass, cost);
    this.efficiency = efficiency;
  }
}

export class AdvancedPropulsion360 extends Propulsion360 {
  private readonly thruster_unit: ThrusterUnit360;
  private readonly reservoir: Reservoir360;
  private readonly power_control_unit: PowerControlUnit360;
}
