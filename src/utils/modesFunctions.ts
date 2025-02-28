import { Mode360 } from "../entities/OpMachine.ts";

export const copyMode = (mode: Mode360) => {
  const newMode = new Mode360(
    mode.getModeId(),
    mode.getModeName(),
    mode.getPointing(),
    mode.getSystemsModes(),
    mode.getOverrideGeometry()
  );
  return newMode;
};
