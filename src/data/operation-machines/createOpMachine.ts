import {
  AtAscendingNode_T,
  AtEclipseToSunlight_T,
  AtEpoch_T,
  AtReservoirLevel_T,
  AtSunlightToEclipse_T,
  Event360,
  Mode360,
  OnBatteryLevel_T,
  OnSemiMajorAxis_T,
  Operation360,
  OperationMachine,
  PDM_Idle,
  PDM_On,
  PM_Idle,
  PM_Off,
  PM_Thrust,
  Pointing360,
  Target360,
  TerminateSimulation_E,
  ToOp_E,
} from "../../entities/OpMachine.ts";
import { SimpleElectricPropulsion360 } from "../../entities/Propulsion.ts";
import { Spacecraft360 } from "../../entities/Spacecraft.ts";
import { SpaceCraftSystem360 } from "../../entities/SpaceCraftSystem.ts";
import {
  Battery360,
  PowerDevice360,
  SolarPanel360,
  Structure360,
} from "../../entities/System.ts";
import { SpacecraftSystem } from "../../types/spacecraft.types.ts";

const getRandomId = () => {
  return Math.floor(Math.random() * 10000000).toString(16);
};

export const createSimpleOpMachine = (): OperationMachine => {
  const nominalMode = new Mode360("0", "NominalMode");

  //Trigger
  const onSmaTrigger = new OnSemiMajorAxis_T({ direction: "<", sma: 6678.0 });
  delete onSmaTrigger["attrs"];

  //Effect
  const terminateSimulationEffect = new TerminateSimulation_E();

  //Event
  const terminalEvent = new Event360(onSmaTrigger, terminateSimulationEffect);

  //Operation
  const nominalOp = new Operation360(getRandomId(), "NOM", nominalMode, [
    terminalEvent,
  ]);

  const opsMachine = new OperationMachine([nominalOp]);

  return opsMachine;
};

export const createOpsMachine_Tutorial4 = (): OperationMachine => {
  //Propulsion
  const prop = new SimpleElectricPropulsion360(
    "MyPropSys",
    0.45,
    1650,
    0.6,
    0.42,
    0.7
  );

  //Propulsion Mode
  const thrustMode = new PM_Thrust("Thrust");

  //Mode
  const nominalMode = new Mode360("0", "NominalMode", undefined, [thrustMode]);

  //Trigger
  const atResLevel = new AtReservoirLevel_T({ level: 0.05 });
  delete atResLevel["attrs"];

  //Effect
  const terminateSimulationEffect = new TerminateSimulation_E();

  //Event
  const terminalEvent = new Event360(atResLevel, terminateSimulationEffect);

  //Op
  const nominalOperation = new Operation360(getRandomId(), "NOM", nominalMode, [
    terminalEvent,
  ]);

  const opsMachine = new OperationMachine([nominalOperation]);

  return opsMachine;
};

export const createOpsMachine_Tutorial5 = () => {
  //Propulsion System
  const ps = new SimpleElectricPropulsion360(
    "ElectricPropulsion",
    0.45,
    1250,
    0.8,
    0.1
  );

  //Mode
  const nominalMode = new Mode360("0", "NominalMode", undefined, [
    new PM_Off("Off"),
  ]);
  const thrustingMode = new Mode360("0", "ThrustingMode", undefined, [
    new PM_Thrust("Thrust"),
  ]);

  const nominalId = getRandomId();
  const thrustId = getRandomId();

  //Op
  const nominalOp = new Operation360(nominalId, "NOM", nominalMode);
  nominalOp.setIsInitial();
  const thrustingOp = new Operation360(thrustId, "THR", thrustingMode);

  //Events
  const eventNom = new Event360(
    new OnSemiMajorAxis_T({ direction: "<", sma: 6780 }),
    new ToOp_E(thrustingOp)
  );

  const eventThr = new Event360(
    //new OnSemiMajorAxis_T({ direction: ">", sma: 6840 }),
    new OnBatteryLevel_T({ direction: ">", capacity: 4 }),
    new ToOp_E(nominalOp)
  );

  const eventEpoch = new Event360(
    new AtEpoch_T({ epoch: "2015-02-01T00:00:00" }),
    new TerminateSimulation_E()
  );

  nominalOp.addEventToOperation(eventNom);
  nominalOp.addEventToOperation(eventEpoch);

  thrustingOp.addEventToOperation(eventThr);

  const opsMachine = new OperationMachine([nominalOp, thrustingOp]);

  return opsMachine;
};

export const createOpsMachine_Tutorial5_2 = () => {
  //Propulsion System
  const ps = new SimpleElectricPropulsion360(
    "ElectricPropulsion",
    0.45,
    1250,
    0.8,
    0.1
  );

  //Mode
  const nominalMode = new Mode360("NominalMode", undefined, [
    new PM_Off("Off"),
  ]);
  const thrustingMode = new Mode360("ThrustingMode", undefined, [
    new PM_Thrust("Thrust"),
  ]);

  const nominalId = getRandomId();
  const thrustId = getRandomId();

  //Op
  const nominalOp = new Operation360(nominalId, "NOM", nominalMode);
  nominalOp.setIsInitial();
  const thrustingOp = new Operation360(thrustId, "THR", thrustingMode);

  //Events
  const eventNom = new Event360(
    new OnSemiMajorAxis_T({ direction: "<", sma: 6780 }),
    new ToOp_E(thrustingOp)
  );

  const eventThr = new Event360(
    //new OnSemiMajorAxis_T({ direction: ">", sma: 6840 }),
    new OnBatteryLevel_T({ direction: ">", capacity: 4 }),
    new ToOp_E(nominalOp)
  );

  const eventEpoch = new Event360(
    new AtEpoch_T({ epoch: "2015-02-01T00:00:00" }),
    new TerminateSimulation_E()
  );

  const endEvent = new Event360(
    new AtAscendingNode_T(),
    new TerminateSimulation_E()
  );

  nominalOp.addEventToOperation(eventNom);
  nominalOp.addEventToOperation(eventEpoch);

  thrustingOp.addEventToOperation(eventThr);
  thrustingOp.addEventToOperation(endEvent);

  const opsMachine = new OperationMachine([nominalOp, thrustingOp]);

  return opsMachine;
};

export const createOpsMachine_Tutorial_6 = () => {
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

  const nominalMode = new Mode360(
    "NOM",
    new Pointing360("+x", Target360.COUNTER_VELOCITY),
    [new PM_Thrust("Thrust"), new PDM_On("ADCS"), new PDM_Idle("COMs")]
  );

  const coastingMode = new Mode360(
    "COAST",
    new Pointing360("+z", Target360.SUN_FACING),
    [new PM_Off("Off"), new PDM_On("ADCS"), new PDM_Idle("COMs")]
  );

  const commMode = new Mode360(
    "COMMS",
    new Pointing360("-z", Target360.NADIR),
    [new PM_Idle("PROP", 2), new PDM_On("ADCS_ON"), new PDM_On("COMS_ON")]
  );

  const terminalEvent = new Event360(
    new OnSemiMajorAxis_T({ direction: "<", sma: 6868 }),
    new TerminateSimulation_E()
  );

  const coastingOpId = getRandomId();
  const nominalId = getRandomId();
  const commsOpId = getRandomId();

  const coastingOp = new Operation360(coastingOpId, "COAST", coastingMode);
  const commsOp = new Operation360(commsOpId, "COMM", commMode);

  const atSunlight = new Event360(
    new AtEclipseToSunlight_T(),
    new ToOp_E(coastingOp)
  );

  const nominalOp = new Operation360(nominalId, "NOM", nominalMode);
  nominalOp.addEventToOperation(terminalEvent);
  nominalOp.addEventToOperation(atSunlight);

  const chargedBattery = new Event360(
    new OnBatteryLevel_T({ direction: ">", capacity: 0.999 }),
    new ToOp_E(commsOp)
  );
  coastingOp.addEventToOperation(terminalEvent);
  coastingOp.addEventToOperation(chargedBattery);

  const atEclipse = new Event360(
    new AtSunlightToEclipse_T(),
    new ToOp_E(nominalOp)
  );
  commsOp.addEventToOperation(terminalEvent);
  commsOp.addEventToOperation(atEclipse);

  const opsMachine = new OperationMachine([nominalOp, coastingOp, commsOp]);

  return opsMachine;
};
