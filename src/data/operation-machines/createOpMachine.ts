import {
  AtAscendingNode_T,
  AtEpoch_T,
  AtReservoirLevel_T,
  Event360,
  Mode360,
  OnBatteryLevel_T,
  OnSemiMajorAxis_T,
  Operation360,
  OperationMachine,
  PM_Off,
  PM_Thrust,
  TerminateSimulation_E,
  ToOp_E,
} from "../../entities/OpMachine.ts";
import { SimpleElectricPropulsion360 } from "../../entities/Propulsion.ts";

const getRandomId = () => {
  return Math.floor(Math.random() * 10000000).toString(16);
};

export const createSimpleOpMachine = (): OperationMachine => {
  const nominalMode = new Mode360("NominalMode");

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
  const nominalMode = new Mode360("NominalMode", undefined, [thrustMode]);

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
