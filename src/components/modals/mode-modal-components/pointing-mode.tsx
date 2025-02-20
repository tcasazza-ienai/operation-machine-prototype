import React, { useEffect, useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import QLawInputs from "./qlaw-inputs.tsx";
import {
  Mode,
  NormalTargets,
  QLaw,
} from "../../../types/operation-machine.types.ts";
import { useSpacecraftStore } from "../../../store/spacecraftStore.ts";
import {
  Mode360,
  Pointing360,
  Target360,
} from "../../../entities/OpMachine.ts";

const emptyQLaw: QLaw = {
  orbitTargeted: "",
  w_a: "",
  w_e: "",
  w_i: "",
};

type PointingType = "body_axis" | "spacecraft_system";

interface PointingModeProps {
  formMode: Mode360;
  setFormMode: React.Dispatch<React.SetStateAction<Mode360>>;
}
const PointingMode: React.FC<PointingModeProps> = ({
  formMode,
  setFormMode,
}) => {
  const pointerCoordinates: string[] = ["+x", "+y", "+z", "-x", "-y", "-z"];
  const pointerTargets: string[] = [
    NormalTargets.av,
    NormalTargets.cv,
    NormalTargets.n,
    NormalTargets.sf,
    "QLaw",
  ];
  const spacecraftSelected = useSpacecraftStore((state) => state.spacecraft);
  const [QLaw, setQLaw] = useState(emptyQLaw);
  const [pointingType, setPointingType] = useState<PointingType>("body_axis");
  const [initialUpdateState, setInitialUpdateState] = useState<boolean>(false);

  const changePointer = (newPointer: string) => {
    const updatedFormMode = new Mode360(
      formMode.getModeId(),
      formMode.getModeName(),
      formMode.getPointing(),
      formMode.getSystemsModes(),
      formMode.getOverrideGeometry()
    );
    updatedFormMode.setPointing(
      new Pointing360(newPointer, formMode.getPointing().getTarget())
    );
    setFormMode(updatedFormMode);
  };

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: PointingType
  ) => {
    setPointingType(newAlignment);
    changePointer("");
  };

  useEffect(() => {
    if (pointingType === "body_axis" && !formMode.getPointing().getPointer()) {
      changePointer("+x");
    } else if (
      pointingType === "spacecraft_system" &&
      !formMode.getPointing().getPointer()
    ) {
      changePointer(spacecraftSelected.getScSystems()[0].getFunctionalId());
    }
  }, [pointingType, formMode, setFormMode]);

  useEffect(() => {
    if (
      spacecraftSelected
        .getScSystems()
        .some(
          (system) =>
            system.getFunctionalId() === formMode.getPointing().getPointer()
        )
    ) {
      setPointingType("spacecraft_system");
    } else {
      setPointingType("body_axis");
    }
  }, [spacecraftSelected]);

  useEffect(() => {
    if (formMode.getPointing().getTarget().includes("QLaw")) {
      const { orbitTargeted, w_a, w_e, w_i } = QLaw;
      const qLawString = `QLaw("${orbitTargeted}", w_a=${w_a.replace(
        ",",
        "."
      )}, w_e=${w_e.replace(",", ".")}, w_i=${w_i.replace(",", ".")})`;

      const updatedFormMode = new Mode360(
        formMode.getModeId(),
        formMode.getModeName(),
        formMode.getPointing(),
        formMode.getSystemsModes(),
        formMode.getOverrideGeometry()
      );
      updatedFormMode.setPointing(
        new Pointing360(formMode.getPointing().getPointer(), qLawString)
      );
      setFormMode(updatedFormMode);
    }
  }, [QLaw]);

  useEffect(() => {
    if (
      formMode.getPointing().getTarget().startsWith("QLaw") &&
      initialUpdateState === false
    ) {
      setInitialUpdateState(true);
      const qLawParams = formMode
        .getPointing()
        .getTarget()
        .match(/QLaw\("([^"]+)", w_a=([^,]+), w_e=([^,]+), w_i=([^)]+)\)/);
      if (qLawParams) {
        setQLaw({
          orbitTargeted: qLawParams[1],
          w_a: qLawParams[2],
          w_e: qLawParams[3],
          w_i: qLawParams[4],
        });
      }
    }
  }, [formMode]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "16px",
        gap: "16px",
      }}
    >
      <Typography sx={{ fontWeight: "bold" }}>Pointing Mode</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        <ToggleButtonGroup
          value={pointingType}
          exclusive
          onChange={handleAlignment}
          aria-label="Pointing Mode"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            height: "40px",
            borderRadius: "25px",
            border: "1px solid #79747E",
          }}
        >
          <ToggleButton
            value="body_axis"
            disabled={pointingType === "body_axis"}
            sx={{
              flex: 1,
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              gap: "8px",
              color: "#191A2C",
            }}
          >
            <Box
              sx={{
                width: "24px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {pointingType === "body_axis" && <CheckRoundedIcon />}
            </Box>
            Body axis
          </ToggleButton>
          <ToggleButton
            value="spacecraft_system"
            disabled={pointingType === "spacecraft_system"}
            sx={{
              flex: 1,
              borderRadius: "25px",
              fontWeight: "bold",
              textTransform: "none",
              gap: "8px",
            }}
          >
            <Box
              sx={{
                width: "24px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {pointingType === "spacecraft_system" && <CheckRoundedIcon />}
            </Box>
            Spacecraft system
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {pointingType === "body_axis" ? (
          <FormControl fullWidth>
            <InputLabel>Pointer (coordinate)*</InputLabel>
            <Select
              label="Pointer (coordinate)"
              value={formMode.getPointing().getPointer()}
              defaultValue=""
              onChange={(e) => {
                changePointer(e.target.value);
              }}
            >
              {pointerCoordinates.map((coordinate) => (
                <MenuItem key={coordinate} value={coordinate}>
                  {coordinate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <FormControl fullWidth>
            <InputLabel>Object pointer</InputLabel>
            <Select
              label="Object pointer"
              defaultValue=""
              value={formMode.getPointing().getPointer()}
              onChange={(e) => {
                changePointer(e.target.value);
              }}
            >
              {spacecraftSelected.getScSystems().map((target, index) => (
                <MenuItem
                  key={target.getFunctionalId() + index}
                  value={target.getFunctionalId()}
                >
                  {target.getSystem().constructor.name.replace("360", "")} (
                  {target.getFunctionalId()})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth>
          <InputLabel>Target*</InputLabel>
          <Select
            label="Target"
            value={
              formMode.getPointing().getTarget().includes("QLaw")
                ? formMode.getPointing().getTarget().substring(0, 4)
                : formMode.getPointing().getTarget()
            }
            defaultValue=""
            onChange={(e) => {
              const updatedFormMode = new Mode360(
                formMode.getModeId(),
                formMode.getModeName(),
                formMode.getPointing(),
                formMode.getSystemsModes(),
                formMode.getOverrideGeometry()
              );
              updatedFormMode.setPointing(
                new Pointing360(
                  formMode.getPointing().getPointer(),
                  e.target.value
                )
              );
              setFormMode(updatedFormMode);
            }}
          >
            {pointerTargets.map((target, index) => (
              <MenuItem key={target + index} value={target}>
                {target}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formMode.getPointing().getTarget().includes("QLaw") && (
          <QLawInputs QLaw={QLaw} setQLaw={setQLaw} />
        )}
      </Box>
    </Box>
  );
};

export default PointingMode;
