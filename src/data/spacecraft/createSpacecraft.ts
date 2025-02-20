import { SimpleElectricPropulsion360 } from "../../entities/Propulsion.ts";
import { Spacecraft360 } from "../../entities/Spacecraft.ts";
import { SpaceCraftSystem360 } from "../../entities/SpaceCraftSystem.ts";

export const createNewSimpleSpaceCraft = () => {
  const sc: Spacecraft360 = new Spacecraft360(
    "MySimpleSpacecraft",
    10.0,
    14.0,
    2.4
  );
  return sc;
};

export const createSpacecraft_tutorial5 = () => {
  //Propulsion System
  const ps = new SimpleElectricPropulsion360(
    "ElectricPropulsion",
    0.45,
    1250,
    0.8,
    0.1
  );

  const scSystem = new SpaceCraftSystem360("PROP", ps, "+x");

  const sc = new Spacecraft360("MySpaceCraft", 3.6, 1.0, undefined, [scSystem]);

  return sc;
};
