import { Propulsion360 } from "./Propulsion.ts";
import { SpaceCraftSystem360 } from "./SpaceCraftSystem.ts";
import { System360 } from "./System.ts";

export class Spacecraft360 {
  private name: string;
  private sc_systems: SpaceCraftSystem360<System360 | Propulsion360>[] = [];
  private override_dry_mass?: number;
  private area: number;
  private CD: number;

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

  public getName(): string {
    return this.name;
  }

  public getOverrideDryMass(): number | undefined {
    return this.override_dry_mass;
  }

  public getArea(): number {
    return this.area;
  }

  public getCD(): number {
    return this.CD;
  }

  public getScSystems(): SpaceCraftSystem360<System360 | Propulsion360>[] {
    return this.sc_systems;
  }

  public setOverrideDryMass(override_dry_mass: number | undefined): void {
    this.override_dry_mass = override_dry_mass;
  }

  public setArea(area: number): void {
    this.area = area;
  }

  public setCD(CD: number): void {
    this.CD = CD;
  }

  public setScSystems(
    sc_systems: SpaceCraftSystem360<System360 | Propulsion360>[]
  ): void {
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
