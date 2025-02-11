import { Propulsion360 } from "./Propulsion.ts";
import { System360 } from "./System.ts";

export class SpaceCraftSystem360<T extends System360 | Propulsion360> {
  private readonly functional_id: string;
  private readonly system: T;
  private readonly functional_direction?: string;

  constructor(functional_id: string, system: T, functional_direction?: string) {
    this.functional_id = functional_id;
    this.system = system;
    this.functional_direction = functional_direction;
  }
}
