import {
  AtEclipseToSunlight_T,
  AtEpoch_T,
  AtOperationDuration_T,
  AtSunlightToEclipse_T,
  OnBatteryLevel_T,
  OnBatterySOC_T,
  OnManeuveringEfficiency_T,
  OnOrbitalElement_T,
  OnSemiMajorAxis_T,
  Trigger360,
  AtApoapsis_T,
  AtPeriapsis_T,
  OnLatitude_T,
  AtAscendingNode_T,
  AtDescendingNode_T,
  AtNorthernAntinode_T,
  AtSouthernAntinode_T,
  AtReservoirLevel_T,
  OnGroundStationVisibilityGain_T,
  OnGroundStationVisibilityLoss_T,
} from "../entities/OpMachine.ts";

const triggerList: Trigger360[] = [
  new AtOperationDuration_T(),
  new AtEpoch_T(),
  new OnSemiMajorAxis_T(),
  new OnOrbitalElement_T(),
  new OnManeuveringEfficiency_T(),
  new OnBatteryLevel_T(),
  new OnBatterySOC_T(),
  new AtEclipseToSunlight_T(),
  new AtSunlightToEclipse_T(),
  new AtApoapsis_T(),
  new AtPeriapsis_T(),
  new OnLatitude_T(),
  new AtAscendingNode_T(),
  new AtDescendingNode_T(),
  new AtNorthernAntinode_T(),
  new AtSouthernAntinode_T(),
  new AtReservoirLevel_T(),
  new OnGroundStationVisibilityGain_T(),
  new OnGroundStationVisibilityLoss_T(),
];

export function getAllTrigger360(): Trigger360[] {
  return triggerList;
}

export function getTriggerClassByName(name: string): Trigger360 | undefined {
  const triggerMap: { [key: string]: new () => Trigger360 } = {
    AtOperationDuration_T,
    AtEpoch_T,
    OnSemiMajorAxis_T,
    OnOrbitalElement_T,
    OnManeuveringEfficiency_T,
    OnBatteryLevel_T,
    OnBatterySOC_T,
    AtEclipseToSunlight_T,
    AtSunlightToEclipse_T,
    AtApoapsis_T,
    AtPeriapsis_T,
    OnLatitude_T,
    AtAscendingNode_T,
    AtDescendingNode_T,
    AtNorthernAntinode_T,
    AtSouthernAntinode_T,
    AtReservoirLevel_T,
    OnGroundStationVisibilityGain_T,
    OnGroundStationVisibilityLoss_T,
  };

  return triggerMap[name] ? new triggerMap[name]() : undefined;
}
