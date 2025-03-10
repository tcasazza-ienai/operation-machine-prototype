import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import {
  Mode360,
  PowerDeviceModeType,
  PropultionModeType,
  SystemsMode,
} from "../../../entities/OpMachine.ts";
import {
  createSystemMode,
  parseSystemMode,
  SystemBaseClass,
} from "../../../utils/mappingSystemsMode.ts";
import { useSpacecraftStore } from "../../../store/spacecraftStore.ts";
import { Spacecraft360 } from "../../../entities/Spacecraft.ts";
import { copyMode } from "../../../utils/modesFunctions.ts";

const SystemMode: React.FC<{
  formMode: Mode360;
  setFormMode: React.Dispatch<React.SetStateAction<Mode360>>;
}> = ({ formMode, setFormMode }) => {
  const spacecraftSelected: Spacecraft360 | undefined = useSpacecraftStore(
    (state) => state.spacecraft
  );
  const propultionModeTypes: PropultionModeType[] = [
    "IDLE",
    "THRUST",
    "OFF",
    "SELECT_OPERATING_POINT",
    "STARTUP",
  ];
  const powerDeviceModeTypes: PowerDeviceModeType[] = ["IDLE", "OFF", "ON"];

  const onChangeSystemMode = (
    e: SelectChangeEvent<string>,
    selectNumber: number
  ) => {
    if (selectNumber === 0 && e.target.value.trim() === "") {
      const updatedFormMode = new Mode360(
        formMode.getModeId(),
        formMode.getModeName(),
        formMode.getPointing(),
        [],
        formMode.getOverrideGeometry()
      );
      setFormMode(updatedFormMode);
      return;
    }

    const [functionalId, modeType] = e.target.value.split("-");
    const selectedSystem =
      spacecraftSelected instanceof Spacecraft360 &&
      spacecraftSelected
        .getScSystems()
        .find((system) => system.getFunctionalId() === functionalId);

    const newSystemMode: SystemsMode[] = [];

    if (selectNumber === 0) {
      if (selectedSystem) {
        newSystemMode[0] = createSystemMode(
          selectedSystem.getFunctionalId(),
          selectedSystem.getSystem().constructor.name as SystemBaseClass,
          modeType as PropultionModeType | PowerDeviceModeType
        );
      }
      if (formMode.getSystemsModes()?.[1] !== undefined) {
        newSystemMode[1] = formMode.getSystemsModeByIndex(1);
      }
    } else if (selectNumber === 1) {
      if (formMode.getSystemsModes()?.[0] === undefined) return;
      newSystemMode[0] = formMode.getSystemsModeByIndex(0);
      if (selectedSystem) {
        newSystemMode[1] = createSystemMode(
          selectedSystem.getFunctionalId(),
          selectedSystem.getSystem().constructor.name as SystemBaseClass,
          modeType as PropultionModeType | PowerDeviceModeType
        );
      }
    }

    const updatedFormMode = copyMode(formMode);
    updatedFormMode.setSystemsModes(newSystemMode);
    setFormMode(updatedFormMode);
  };

  const getSystemModesItmes = () => {
    const items: {
      functional_id: string;
      systemBaseClass: string;
      mode: PropultionModeType | PowerDeviceModeType;
    }[] = [];
    spacecraftSelected instanceof Spacecraft360 &&
      spacecraftSelected
        .getScSystems()
        .filter(
          (system) =>
            system.getSystem().constructor.name ===
              "SimpleElectricPropulsion360" ||
            system.getSystem().constructor.name === "PowerDevice360"
        )
        .forEach((system) => {
          if (
            system.getSystem().constructor.name ===
            "SimpleElectricPropulsion360"
          ) {
            propultionModeTypes.forEach((type) => {
              items.push({
                functional_id: system.getFunctionalId(),
                systemBaseClass: system.getSystem().constructor.name,
                mode: type,
              });
            });
          } else {
            powerDeviceModeTypes.forEach((type) => {
              items.push({
                functional_id: system.getFunctionalId(),
                systemBaseClass: system.getSystem().constructor.name,
                mode: type,
              });
            });
          }
        });
    return items;
  };

  return (
    <Box sx={containerSx}>
      <Typography sx={titleSx}>System Mode</Typography>
      <Box sx={innerBoxSx}>
        <FormControl fullWidth>
          <InputLabel>Object Name (Functional ID)</InputLabel>
          <Select
            label="Object Name (Functional ID)"
            value={
              formMode.getSystemsModes()?.length > 0
                ? `${formMode.getSystemsModeByIndex(0)?.getName() || ""}-${
                    formMode.getSystemsModeByIndex(0)?.getMode() || ""
                  }`
                : ""
            }
            renderValue={() => {
              return formMode.getSystemsModes() &&
                formMode.getSystemsModes()?.length > 0 ? (
                <div>{`${
                  parseSystemMode(
                    formMode.getSystemsModeByIndex(0)
                  ).systemBaseClass.replace("360", "") || ""
                } (${
                  parseSystemMode(formMode.getSystemsModeByIndex(0)).name
                }) - ${
                  parseSystemMode(formMode.getSystemsModeByIndex(0)).mode
                }`}</div>
              ) : (
                <></>
              );
            }}
            onChange={(e) => onChangeSystemMode(e, 0)}
            defaultValue=""
          >
            <MenuItem value="">_</MenuItem>
            {getSystemModesItmes().map((item) => (
              <MenuItem
                key={item.functional_id + item.mode}
                value={`${item.functional_id}-${item.mode}`}
              >
                {item.systemBaseClass.replace("360", "")} ({item.functional_id})
                - {item.mode}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Object Name (Functional ID)</InputLabel>
          <Select
            label="Object Name (Functional ID)"
            disabled={formMode.getSystemsModes()?.length === 0}
            value={
              formMode.getSystemsModes()?.length > 1
                ? `${formMode.getSystemsModeByIndex(1)?.getName() || ""}-${
                    formMode.getSystemsModeByIndex(1)?.getMode() || ""
                  }`
                : ""
            }
            renderValue={() =>
              formMode.getSystemsModes() &&
              formMode.getSystemsModes()?.length > 0 ? (
                <div>{`${
                  parseSystemMode(
                    formMode.getSystemsModeByIndex(1)
                  ).systemBaseClass.replace("360", "") || ""
                } (${
                  parseSystemMode(formMode.getSystemsModeByIndex(1)).name
                }) - ${
                  parseSystemMode(formMode.getSystemsModeByIndex(1)).mode
                }`}</div>
              ) : (
                <></>
              )
            }
            onChange={(e) => onChangeSystemMode(e, 1)}
            defaultValue=""
          >
            <MenuItem value="">_</MenuItem>
            {getSystemModesItmes().map((item) => (
              <MenuItem
                key={item.functional_id + item.mode}
                value={`${item.functional_id}-${item.mode}`}
              >
                {item.systemBaseClass.replace("360", "")} ({item.functional_id})
                - {item.mode}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SystemMode;

const containerSx = {
  display: "flex",
  flexDirection: "column",
  marginTop: "16px",
  gap: "16px",
};

const titleSx = {
  fontWeight: "bold",
};

const innerBoxSx = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};
