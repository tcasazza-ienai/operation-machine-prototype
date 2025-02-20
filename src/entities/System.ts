export abstract class System360 {
  protected readonly name: string;
  protected readonly mass: number;
  protected readonly cost: number;

  constructor(name: string, mass: number, cost: number) {
    this.name = name;
    this.mass = mass;
    this.cost = cost;
  }
}

export class Battery360 extends System360 {
  private readonly capacity: number = 1.0;

  constructor(
    name: string,
    mass: number,
    cost: number,
    capacity: number = 1.0
  ) {
    super(name, mass, cost);
    this.capacity = capacity;
  }
}

export type SolarCell = {
  efficiency: number;
  area: number;
  mass: number;
  cost: number;
  degradation_rate: number;
};

export class SolarPanel360 extends System360 {
  private readonly n_cells: number[] | number;
  private readonly struct_mass: number;
  private readonly cell: SolarCell = {
    efficiency: 0.3,
    area: 0.003,
    mass: 0.0,
    cost: 0.0,
    degradation_rate: 0.0,
  };

  constructor(
    name: string,
    mass: number,
    cost: number,
    n_cells: number[] | number,
    cell?: SolarCell
  ) {
    super(name, mass, cost);
    this.n_cells = n_cells;
    this.struct_mass = mass;

    if (cell) {
      this.cell = cell;
    }
  }
}

export class Structure360 extends System360 {}

export class PowerDevice360 extends System360 {
  private readonly power: number;
  private readonly idle: number;

  constructor(
    name: string,
    mass: number,
    cost: number,
    power: number,
    idle: number
  ) {
    super(name, mass, cost);
    this.power = power;
    this.idle = idle;
  }
}

export class Sensor360 extends System360 {
  private readonly fov: number = 10.0;

  constructor(name: string, mass: number, cost: number, fov: number) {
    super(name, mass, cost);
    this.fov = fov;
  }
}
