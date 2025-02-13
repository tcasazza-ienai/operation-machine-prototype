import { GroundStation } from "./GroundStation.ts";
import { Propulsion360, SimplePropulsion360 } from "./Propulsion.ts";

export class OperationMachine {
  private readonly operations: Operation360[] = [];

  constructor(operations?: Operation360[]) {
    if (operations && operations.length > 0) {
      this.operations = operations;
    }
  }

  public addOperationToOpMachine(operation: Operation360): Operation360[] {
    this.operations.push(operation);
    return this.operations;
  }

  public getOperations(): Operation360[] {
    return this.operations;
  }
}

export class Operation360 {
  private readonly id: string;
  private readonly op_name: string;
  private readonly mode: Mode360;
  private readonly events: Event360[] = [];
  private isInitial: boolean = false;

  constructor(
    id: string,
    op_name: string,
    mode: Mode360,
    events: Event360[] = []
  ) {
    this.id = id;
    this.op_name = op_name;
    this.mode = mode;
    this.events = events;
  }

  public addEventToOperation(event: Event360): Event360[] {
    this.events?.push(event);
    return this.events;
  }

  public getEvents(): Event360[] {
    return this.events;
  }

  public getId(): string {
    return this.id;
  }

  public getOpName(): string {
    return this.op_name;
  }

  public setIsInitial(): void {
    this.isInitial = true;
  }

  public getIsInitial(): boolean {
    return this.isInitial;
  }

  public getOpMode(): Mode360 {
    return this.mode;
  }
}

export class Mode360 {
  private id: string;
  private name: string;
  private readonly pointing: Pointing360 = new Pointing360(
    "+x",
    Target360.ALONG_VELOCITY
  );
  private readonly systems_modes: SystemsMode[] = [];
  private readonly override_geometry?: OverrideGeometry;

  constructor(
    id: string,
    name: string,
    pointing?: Pointing360,
    systems_modes?: SystemsMode[],
    override_geometry?: OverrideGeometry
  ) {
    this.id = id;
    this.name = name;
    if (pointing) {
      this.pointing = pointing;
    }

    if (systems_modes) {
      this.systems_modes = systems_modes;
    }

    if (override_geometry) {
      this.override_geometry = override_geometry;
    }
  }

  public addSystemsMode(systemsMode: SystemsMode): SystemsMode[] {
    this.systems_modes.push(systemsMode);
    return this.systems_modes;
  }

  public getModeName(): string {
    return this.name;
  }

  public getPointing(): Pointing360 {
    return this.pointing;
  }
}

export enum Target360 {
  ALONG_VELOCITY = "AlongVelocity",
  COUNTER_VELOCITY = "CounterVelocity",
  Q_LAW = "QLaw",
  NADIR = "Nadir",
  SUN_FACING = "SunFacing",
}

export class Pointing360 {
  private readonly pointer: string;
  private readonly target: Target360;

  constructor(pointer: string, target: Target360) {
    this.pointer = pointer;
    this.target = target;
  }
}

export abstract class SystemsMode {
  protected readonly name: string;
  protected readonly baseClass: string;

  constructor(name: string, baseClass: string) {
    this.name = name;
    this.baseClass = baseClass;
  }
}

//////// PROPULSION MODES //////////////
export class BasePropulsionMode extends SystemsMode {
  constructor(name: string) {
    super(name, "Propulsion");
  }
}

export class PM_Off extends BasePropulsionMode {
  constructor(name: string) {
    super(name);
  }
}

export class PM_Thrust extends BasePropulsionMode {
  constructor(name: string) {
    super(name);
  }
}

export class PM_Idle extends BasePropulsionMode {
  private readonly power: number;

  constructor(name: string, power: number) {
    super(name);
    this.power = power;
  }
}

export class PM_Startup extends BasePropulsionMode {
  private readonly power: number;

  constructor(name: string, power: number) {
    super(name);
    this.power = power;
  }
}

export class PM_SelectOperatingPoint extends BasePropulsionMode {
  private readonly perf_point: string;

  constructor(name: string, perf_point: string) {
    super(name);
    this.perf_point = perf_point;
  }
}
///// END PROPULSION MODES ////////

////// POWER DEVICE MODES //////
export class BasePowerDeviceMode extends SystemsMode {
  constructor(name: string) {
    super(name, "Power Device");
  }
}

export class PDM_On extends BasePowerDeviceMode {
  constructor(name: string) {
    super(name);
  }
}

export class PDM_Idle extends BasePowerDeviceMode {
  constructor(name: string) {
    super(name);
  }
}

export class PDM_Off extends BasePowerDeviceMode {
  constructor(name: string) {
    super(name);
  }
}

/////// END POWER DEVICE MODES ///////////

export abstract class OverrideGeometry {}

export class SphereGeometry360 extends OverrideGeometry {
  private readonly area: number = 0.0;
  private readonly CD: number = 2.2;
  private readonly CR: number = 2.2;

  constructor(area?: number, CD?: number, CR?: number) {
    super();

    this.area = area ? area : this.area;
    this.CD = CD ? CD : this.CD;
    this.CR = CR ? CR : this.CR;
  }
}

export class Event360 {
  private readonly trigger: Trigger360;
  private readonly effect: Effect360;

  constructor(trigger: Trigger360, effect: Effect360) {
    this.trigger = trigger;
    this.effect = effect;
  }

  public getEffect(): Effect360 {
    return this.effect;
  }

  public getTrigger(): Trigger360 {
    return this.trigger;
  }
}

///////// TRIGGERS ///////////////
interface Trigger360 {}

enum BooleanTriggerType {
  AND = "AND",
  OR = "OR",
}

export abstract class BooleanTrigger {
  type: BooleanTriggerType;
  conditions: Trigger360[] = [];

  constructor(type: BooleanTriggerType, conditions?: Trigger360[]) {
    this.type = type;
    if (conditions) {
      this.conditions = conditions;
    }
  }

  public addCondition(condition: Trigger360): Trigger360[] {
    this.conditions.push(condition);
    return this.conditions;
  }
}

export class OnAllConditions_T extends BooleanTrigger implements Trigger360 {
  constructor(conditions: Trigger360[]) {
    super(BooleanTriggerType.AND, conditions);
  }
}

export class OnAnyCondition_T extends BooleanTrigger implements Trigger360 {
  constructor(conditions: Trigger360[]) {
    super(BooleanTriggerType.OR, conditions);
  }
}

function createCustomTrigger<T = void>(className: string) {
  const CustomTriggerClass = class implements Trigger360 {
    private className = `${className}_T`;
    private attrs?: T;

    constructor(attrs?: T) {
      // Only set attributes if they are provided
      if (attrs) {
        Object.entries(attrs).forEach(([key, value]) => {
          Object.defineProperty(this, key, {
            value,
            writable: true,
            enumerable: true,
          });
        });
      }
    }

    // Optional getter that only returns attributes if they exist
    getAttributes(): T | undefined {
      return this.attrs;
    }

    public getTriggerName() {
      const cleanedClassName = this.className.replace("_T", "");
      const splitNameTokens = cleanedClassName.split(/(?=[A-Z])/);
      return splitNameTokens.join(" ").trim();
    }
  };

  return CustomTriggerClass;
}

export const AtOperationDuration_T = createCustomTrigger<{ duration: number }>(
  "AtOperationDuration"
);
export const AtEpoch_T = createCustomTrigger<{ epoch: string }>("AtEpoch");
export const OnSemiMajorAxis_T = createCustomTrigger<{
  direction: string;
  sma: number;
}>("OnSemiMajorAxis");
export const OnOrbitalElement_T = createCustomTrigger<{
  element: string;
  direction: string;
  value: number;
}>("OnOrbitalElement");
export const OnManeuveringEfficiency_T = createCustomTrigger<{
  direction: string;
  threshold: number;
  qlaw: number;
}>("OnManeuveringEfficiency");
export const OnBatteryLevel_T = createCustomTrigger<{
  direction: string;
  capacity: number;
}>("OnBatteryLevel");
export const OnBatterySOC_T = createCustomTrigger<{
  direction: string;
  state_of_charge: number;
}>("OnBatterySOC");
export const AtEclipseToSunlight_T = createCustomTrigger("AtEclipseToSunlight");
export const AtSunlightToEclipse_T = createCustomTrigger("AtSunlightToEclipse");
export const AtApoapsis_T = createCustomTrigger("AtApoapsis");
export const AtPeriapsis_T = createCustomTrigger("AtPeriapsis");
export const OnLatitude_T = createCustomTrigger<{
  direction: string;
  latitude: number;
}>("OnLatitude");
export const AtAscendingNode_T = createCustomTrigger("AtAscendingNode");
export const AtDescendingNode_T = createCustomTrigger("AtDescendingNod");
export const AtNorthernAntinode_T = createCustomTrigger("AtNorthernAntinode");
export const AtSouthernAntinode_T = createCustomTrigger("AtSouthernAntinode");
export const AtReservoirLevel_T = createCustomTrigger<{ level: number }>(
  "AtReservoirLevel"
);
export const OnGroundStationVisibilityGain_T = createCustomTrigger<{
  groundstation: GroundStation;
}>("OnGroundStationVisibilityGain");
export const OnGroundStationVisibilityLoss_T = createCustomTrigger<{
  groundstation: GroundStation;
}>("OnGroundStationVisibilityLoss");
////////////////////////

//////// EFFECTS //////////
interface Effect360 {}

export class ToOp_E implements Effect360 {
  private readonly targetOperation: Operation360;

  constructor(targetOperation: Operation360) {
    this.targetOperation = targetOperation;
  }

  public getTargetOperation(): Operation360 {
    return this.targetOperation;
  }
}

export class TerminateSimulation_E implements Effect360 {}

export class Impulse_E implements Effect360 {
  private readonly DV_r: number;
  private readonly DV_c: number;
  private readonly DV_n: number;
  propulsion_system: Propulsion360;

  constructor(
    r: number,
    c: number,
    n: number,
    propulsion_system: Propulsion360
  ) {
    this.DV_r = r;
    this.DV_c = c;
    this.DV_n = n;
    this.propulsion_system = propulsion_system;
  }
}

type ElementEffectAttributes = {
  element: string;
  target: number;
};

// IMPULSE TO ELEMENT
function createImpulseToElementEffect(numberOfElements: number) {
  const CustomImpulseToElementsEffectClass = class implements Effect360 {
    private readonly propulsionSystem: Propulsion360;
    [key: string]: any; // To allow dynamic property names

    constructor(
      elementTargets: ElementEffectAttributes[],
      propulsionSystem: Propulsion360
    ) {
      if (elementTargets.length !== numberOfElements) {
        throw new Error(
          `Expected ${numberOfElements} elements but got ${elementTargets.length}`
        );
      }

      // If there's only one element and it's the only one expected
      if (numberOfElements === 1) {
        this.element = elementTargets[0].element;
        this.target = elementTargets[0].target;
      } else {
        // If there are multiple elements, number them
        elementTargets.forEach((et, index) => {
          this[`element${index + 1}`] = et.element;
          this[`target${index + 1}`] = et.target;
        });
      }

      this.propulsionSystem = propulsionSystem;
    }
  };

  return CustomImpulseToElementsEffectClass;
}

const ImpulseToElement_E = createImpulseToElementEffect(1);
const ImpulseToTwoElements_E = createImpulseToElementEffect(2);
const ImpulseToThreeElements_E = createImpulseToElementEffect(3);
