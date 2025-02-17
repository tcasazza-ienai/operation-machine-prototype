import {
  BasePropulsionMode,
  PDM_Idle,
  PDM_Off,
  PDM_On,
  PM_Idle,
  PM_Off,
  PM_SelectOperatingPoint,
  PM_Startup,
  PM_Thrust,
  SystemsMode,
} from "../entities/OpMachine.ts";
export type SystemBaseClass =
  | "BasePropulsionMode"
  | "PM_Off"
  | "PM_Thrust"
  | "PM_Idle"
  | "PM_Startup"
  | "PM_SelectOperatingPoint"
  | "BasePowerDeviceMode"
  | "PDM_On"
  | "PDM_Idle"
  | "PDM_Off";

function createSystemMode(
  name: string,
  baseClass: SystemBaseClass,
  power?: number
): SystemsMode {
  switch (baseClass) {
    case "BasePropulsionMode":
      return new BasePropulsionMode(name);
    case "PM_Off":
      return new PM_Off(name);
    case "PM_Thrust":
      return new PM_Thrust(name);
    case "PM_Idle":
      return new PM_Idle(name, power ? power : 0);
    case "PM_Startup":
      return new PM_Startup(name, power ? power : 0);
    case "PM_SelectOperatingPoint":
      return new PM_SelectOperatingPoint(name, "default");
    case "PDM_On":
      return new PDM_On(name);
    case "PDM_Idle":
      return new PDM_Idle(name);
    case "PDM_Off":
      return new PDM_Off(name);
    default:
      throw new Error(`Unknown baseClass: ${baseClass}`);
  }
}

export { createSystemMode };
