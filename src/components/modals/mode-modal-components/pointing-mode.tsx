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
import QLawInputs from "../mode-modal-components/qlaw-inputs.tsx";
import {
  Mode,
  NormalTargets,
  QLaw,
} from "../../../types/operation-machine.types.ts";
import { useSpacecraftStore } from "../../../store/spacecraftStore.ts";

const emptyQLaw: QLaw = {
  orbitTargeted: "",
  w_a: "",
  w_e: "",
  w_i: "",
};

type PointingType = "body_axis" | "spacecraft_system";

interface PointingModeProps {
  formMode: Mode360;
  setFormMode: React.Dispatch<React.SetStateAction<Mode>>;
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
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: PointingType
  ) => {
    setPointingType(newAlignment);
    setFormMode({
      ...formMode,
      pointing: { ...formMode.pointing, pointer: "" },
    });
  };

  useEffect(() => {
    if (pointingType === "body_axis" && !formMode.pointing.pointer) {
      setFormMode({
        ...formMode,
        pointing: { ...formMode.pointing, pointer: "+x" },
      });
    }
  }, [pointingType, formMode, setFormMode]);

  useEffect(() => {
    if (
      spacecraftSelected.sc_systems?.some(
        (system) => system.functional_id === formMode.pointing.pointer
      )
    ) {
      setPointingType("spacecraft_system");
    } else {
      setPointingType("body_axis");
    }
  }, [spacecraftSelected]);

  useEffect(() => {
    if (formMode.pointing.target.includes("QLaw")) {
      const { orbitTargeted, w_a, w_e, w_i } = QLaw;
      const qLawString = `QLaw("${orbitTargeted}", w_a=${w_a.replace(
        ",",
        "."
      )}, w_e=${w_e.replace(",", ".")}, w_i=${w_i.replace(",", ".")})`;

      setFormMode({
        ...formMode,
        pointing: {
          ...formMode.pointing,
          target: qLawString,
        },
      });
    }
  }, [QLaw]);

  useEffect(() => {
    if (
      formMode.pointing.target.startsWith("QLaw") &&
      initialUpdateState === false
    ) {
      setInitialUpdateState(true);
      const qLawParams = formMode.pointing.target.match(
        /QLaw\("([^"]+)", w_a=([^,]+), w_e=([^,]+), w_i=([^)]+)\)/
      );
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
              value={formMode.pointing.pointer}
              defaultValue=""
              onChange={(e) =>
                setFormMode({
                  ...formMode,
                  pointing: {
                    ...formMode.pointing,
                    pointer: e.target.value as string,
                  },
                })
              }
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
              value={formMode.pointing.pointer}
              onChange={(e) =>
                setFormMode({
                  ...formMode,
                  pointing: {
                    ...formMode.pointing,
                    pointer: e.target.value as string,
                  },
                })
              }
            >
              {spacecraftSelected.sc_systems?.map((target, index) => (
                <MenuItem
                  key={target.functional_id + index}
                  value={target.functional_id}
                >
                  {target.functional_id}
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
              formMode.pointing.target.includes("QLaw")
                ? formMode.pointing.target.substring(0, 4)
                : formMode.pointing.target
            }
            defaultValue=""
            onChange={(e) =>
              setFormMode({
                ...formMode,
                pointing: {
                  ...formMode.pointing,
                  target: e.target.value as string,
                },
              })
            }
          >
            {pointerTargets.map((target, index) => (
              <MenuItem key={target + index} value={target}>
                {target}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formMode.pointing.target.includes("QLaw") && (
          <QLawInputs QLaw={QLaw} setQLaw={setQLaw} />
        )}
      </Box>
    </Box>
  );
};

export default PointingMode;
