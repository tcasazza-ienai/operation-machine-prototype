interface ISystem {
  name: string;
  mass: number;
  cost: number;
}

export type Battery = ISystem & {
  capacity: number;
};

export type SolarPanel = {
  name: string;
  n_cells: number[];
  struct_mass: number;
  cost: number;
  cell: number;
};

export type Structure = ISystem;

export type PowerDevice = ISystem & {
  power: number;
  idle: number;
};

export type Sensor = ISystem & {
  fov: number;
};

export type System = Battery | SolarPanel | Structure | PowerDevice | Sensor;
