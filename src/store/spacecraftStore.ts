import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Spacecraft360 } from "../entities/Spacecraft.ts";
import { SpaceCraftSystem360 } from "../entities/SpaceCraftSystem.ts";
import { SimpleElectricPropulsion360 } from "../entities/Propulsion.ts";
import {
  Battery360,
  PowerDevice360,
  SolarPanel360,
  Structure360,
} from "../entities/System.ts";

const ps = new SimpleElectricPropulsion360(
  "MyPropSys",
  0.45,
  1650,
  0.7,
  0.42,
  0.7
);

const batt = new Battery360("MyBat", 0.8, 120, 120);

const sp1 = new SolarPanel360("SP_1", 0.253, 10, 7);
const sp2 = new SolarPanel360("SP_2", 0.253, 10, 6);

const sp3 = new SolarPanel360("SP_3", 0.15, 10, 4, {
  degradation_rate: 0,
  mass: 0.05,
  cost: 1,
  area: 0.002651,
  efficiency: 0.296,
});

const adcs = new PowerDevice360("MyADCS", 0.5, 0, 1.0, 200);
const coms = new PowerDevice360("MyCOMs", 0.3, 0, 3.0, 500);

const structure = new Structure360("MyStructure", 2.0, 0);

const sc_systems = [
  new SpaceCraftSystem360<SimpleElectricPropulsion360>("PROP", ps, "+x"),
  new SpaceCraftSystem360<SolarPanel360>("SPzp", sp1, "+z"),
  new SpaceCraftSystem360<SolarPanel360>("SPyp", sp2, "+y"),
  new SpaceCraftSystem360<SolarPanel360>("SPy", sp2, "-y"),
  new SpaceCraftSystem360<SolarPanel360>("SPz", sp3, "-z"),
  new SpaceCraftSystem360<Battery360>("BATT", batt),
  new SpaceCraftSystem360<PowerDevice360>("ADCS", adcs),
  new SpaceCraftSystem360<PowerDevice360>("COMs", coms),
  new SpaceCraftSystem360<Structure360>("STRUCT", structure),
];

const sc = new Spacecraft360(
  "MySpaceCraft",
  undefined,
  0.1,
  undefined,
  sc_systems
);

export const useSpacecraftStore = create(
  combine({ spacecraft: sc as Spacecraft360 }, (set) => ({
    updateSpacecraft: (newSpacecraft: Spacecraft360) =>
      set({ spacecraft: newSpacecraft }),
  }))
);
