import { Propulsion360 } from "./Propulsion.ts";
import { SpaceCraftSystem360 } from "./SpaceCraftSystem.ts";
import { System360 } from "./System.ts";

export class Spacecraft360 {
  private readonly name: string;
  private readonly sc_systems: SpaceCraftSystem360<
    System360 | Propulsion360
  >[] = [];
  private readonly override_dry_mass?: number;
  private readonly area: number;
  private readonly CD: number;

  constructor(
    name: string,
    override_dry_mass?: number,
    area: number = 0.0,
    CD: number = 2.2,
    sc_systems: SpaceCraftSystem360<System360 | Propulsion360>[] = []
  ) {
    this.name = name;
    this.override_dry_mass = override_dry_mass;
    this.area = area;
    this.CD = CD;
    this.sc_systems = sc_systems;
  }

  public addSystemsToSpaceCraft<T extends System360 | Propulsion360>(
    functional_id: string,
    system: T,
    functional_direction?: string
  ): SpaceCraftSystem360<System360 | Propulsion360>[] {
    const spacecraft_system = new SpaceCraftSystem360(
      functional_id,
      system,
      functional_direction
    );
    this.sc_systems.push(spacecraft_system);
    return this.sc_systems;
  }
}
