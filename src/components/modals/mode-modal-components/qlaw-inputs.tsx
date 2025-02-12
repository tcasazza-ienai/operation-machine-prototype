import React, { useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from "@mui/material";
import { Mode, QLaw } from "../../../types/operation-machine.types.ts";
import orbitalElements from "../../../data/mockedObjects/orbitalElements.json";

interface QLawInputsProps {
  QLaw: QLaw;
  setQLaw: (QLaw) => void;
}
const QLawInputs: React.FC<QLawInputsProps> = ({ QLaw, setQLaw }) => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Link
          href="https://py-docs-360.ienai.space/1.9.0/userguide/objects/behaviors/modes/#i360.objects.maneuvers.QLaw"
          target="_blank"
          sx={{
            color: "var(--Primary, #5641E2)",
            paddingX: "16px",
            width: "auto",
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: "16px",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Learn more about QLaw
        </Link>
      </Box>
      <Box sx={{ display: "flex", gap: "16px" }}>
        <TextField
          label="a Weight"
          value={QLaw.w_a || ""}
          type="number"
          onChange={(e) =>
            setQLaw({
              ...QLaw,
              w_a:
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/^0+(?=\d)/, "") || 0,
            })
          }
          fullWidth
        />
        <TextField
          label="e Weight"
          value={QLaw.w_e || ""}
          type="number"
          onChange={(e) =>
            setQLaw({
              ...QLaw,
              w_e:
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/^0+(?=\d)/, "") || "0",
            })
          }
          fullWidth
        />
        <TextField
          label="i Weight"
          type="number"
          value={QLaw.w_i || ""}
          onChange={(e) =>
            setQLaw({
              ...QLaw,
              w_i:
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/^0+(?=\d)/, "") || "0",
            })
          }
          fullWidth
        />
      </Box>
      <FormControl fullWidth>
        <InputLabel>Orbit targeted</InputLabel>
        <Select
          label="Orbit targeted"
          value={QLaw.orbitTargeted}
          onChange={(e) => setQLaw({ ...QLaw, orbitTargeted: e.target.value })}
        >
          {orbitalElements.map((target, index) => (
            <MenuItem key={target + index} value={target}>
              {target}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default QLawInputs;
