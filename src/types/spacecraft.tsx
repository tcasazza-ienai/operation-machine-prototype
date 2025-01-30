import { Propulsion, SimpleChemicalPropulsion, SimpleElectricPropulsion } from "./propulsion";
import { System } from "./systems";

export type Spacecraft = {
    name: string;
    sc_systems: SpacecraftSystem;
    override_dry_mass: number;
    area: number;
    CD: number;
}


export type SpacecraftSystem = {
    functional_id: string;
    system: System | Propulsion | SimpleElectricPropulsion | SimpleChemicalPropulsion;
    functional_direction?: string;
}

