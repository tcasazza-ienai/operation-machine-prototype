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
  PowerDeviceModeType,
  PropultionModeType,
  SystemsMode,
} from "../entities/OpMachine.ts";
export type SystemBaseClass = "SimpleElectricPropulsion360" | "PowerDevice360";

function createSystemMode(
  name: string,
  systemBaseClass: SystemBaseClass,
  mode: PropultionModeType | PowerDeviceModeType,
  power?: number
): SystemsMode {
  if (systemBaseClass === "SimpleElectricPropulsion360" && mode === "OFF") {
    return new PM_Off(name);
  } else if (
    systemBaseClass === "SimpleElectricPropulsion360" &&
    mode === "THRUST"
  ) {
    return new PM_Thrust(name);
  } else if (
    systemBaseClass === "SimpleElectricPropulsion360" &&
    mode === "IDLE"
  ) {
    return new PM_Idle(name, power ? power : 0);
  } else if (
    systemBaseClass === "SimpleElectricPropulsion360" &&
    mode === "STARTUP"
  ) {
    return new PM_Startup(name, power ? power : 0);
  } else if (
    systemBaseClass === "SimpleElectricPropulsion360" &&
    mode === "SELECT_OPERATING_POINT"
  ) {
    return new PM_SelectOperatingPoint(name, "default");
  } else if (systemBaseClass === "PowerDevice360" && mode === "ON") {
    return new PDM_On(name);
  } else if (systemBaseClass === "PowerDevice360" && mode === "IDLE") {
    return new PDM_Idle(name);
  } else if (systemBaseClass === "PowerDevice360" && mode === "OFF") {
    return new PDM_Off(name);
  } else {
    throw new Error(`Unknown baseClass or mode: ${systemBaseClass}, ${mode}`);
  }
}

function parseSystemMode(systemMode: SystemsMode): {
  name: string;
  systemBaseClass: SystemBaseClass;
  mode: PropultionModeType | PowerDeviceModeType;
  power?: number;
} {
  console.log("systemMode", systemMode);
  const name = systemMode.getName();
  let systemBaseClass: SystemBaseClass;
  let mode: PropultionModeType | PowerDeviceModeType;
  let power: number | undefined;

  if (systemMode instanceof PM_Off) {
    systemBaseClass = "SimpleElectricPropulsion360";
    mode = "OFF";
  } else if (systemMode instanceof PM_Thrust) {
    systemBaseClass = "SimpleElectricPropulsion360";
    mode = "THRUST";
  } else if (systemMode instanceof PM_Idle) {
    systemBaseClass = "SimpleElectricPropulsion360";
    mode = "IDLE";
  } else if (systemMode instanceof PM_Startup) {
    systemBaseClass = "SimpleElectricPropulsion360";
    mode = "STARTUP";
  } else if (systemMode instanceof PM_SelectOperatingPoint) {
    systemBaseClass = "SimpleElectricPropulsion360";
    mode = "SELECT_OPERATING_POINT";
  } else if (systemMode instanceof PDM_On) {
    systemBaseClass = "PowerDevice360";
    mode = "ON";
  } else if (systemMode instanceof PDM_Idle) {
    systemBaseClass = "PowerDevice360";
    mode = "IDLE";
  } else if (systemMode instanceof PDM_Off) {
    systemBaseClass = "PowerDevice360";
    mode = "OFF";
  } else {
    throw new Error(`Unknown SystemsMode instance: ${systemMode}`);
  }

  return { name, systemBaseClass, mode, power };
}

export { createSystemMode, parseSystemMode };
