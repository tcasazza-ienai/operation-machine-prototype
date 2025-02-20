import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { Mode } from "../../../types/operation-machine.types";
import { useEdges } from "@xyflow/react";
import {
  Mode360,
  OverrideGeometry,
  SphereGeometry360,
} from "../../../entities/OpMachine.ts";

interface GeometryModeProps {
  formMode: Mode360;
  setFormMode: React.Dispatch<React.SetStateAction<Mode360>>;
  sphericalGeometryStatus: boolean;
  setSphericalGeometryStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const GeometryMode: React.FC<GeometryModeProps> = ({
  formMode,
  setFormMode,
  sphericalGeometryStatus,
  setSphericalGeometryStatus,
}) => {
  const [sphericalGeometryForm, setSphericalGeometryForm] = useState<{
    area: string;
    cd: string;
    cr: string;
  }>({ area: "", cd: "", cr: "" });

  const handleGeometry = (e: SelectChangeEvent<string>) => {
    const geometry = e.target.value;
    console.log("geometry", geometry);
    if (geometry === "Spherical geometry") {
      setSphericalGeometryStatus(true);
    } else {
      setSphericalGeometryStatus(false);
      const updatedFormMode = new Mode360(
        formMode.getModeId(),
        formMode.getModeName(),
        formMode.getPointing(),
        formMode.getSystemsModes(),
        formMode.getOverrideGeometry()
      );
      updatedFormMode.setOverrideGeometryEmpty();
      setFormMode(updatedFormMode);

      setSphericalGeometryForm({ area: "", cd: "", cr: "" });
    }
  };

  useEffect(() => {
    if (sphericalGeometryStatus) {
      setSphericalGeometryStatus(false);
      const updatedFormMode = new Mode360(
        formMode.getModeId(),
        formMode.getModeName(),
        formMode.getPointing(),
        formMode.getSystemsModes(),
        formMode.getOverrideGeometry()
      );
      updatedFormMode.setOverrideGeometry(
        new SphereGeometry360(
          Number.parseFloat(sphericalGeometryForm.area),
          Number.parseFloat(sphericalGeometryForm.cd),
          Number.parseFloat(sphericalGeometryForm.cr)
        )
      );
      setFormMode(updatedFormMode);
    }
  }, [sphericalGeometryForm]);

  useEffect(() => {
    const currentOverrideGeometry = formMode.getOverrideGeometry();
    if (currentOverrideGeometry instanceof SphereGeometry360) {
      setSphericalGeometryForm({
        area: currentOverrideGeometry?.getArea().toString(),
        cd: currentOverrideGeometry?.getCD().toString(),
        cr: currentOverrideGeometry?.getCR().toString(),
      });
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "16px",
        gap: "16px",
      }}
    >
      <Typography sx={{ fontWeight: "bold" }}>Geometry Mode</Typography>
      <FormControl fullWidth>
        <InputLabel>Geometry</InputLabel>
        <Select
          label="Geometry"
          defaultValue={
            sphericalGeometryStatus === true
              ? "Spherical geometry"
              : "Spacecraft geometry"
          }
          fullWidth
          onChange={handleGeometry}
        >
          <MenuItem value="Spacecraft geometry">Spacecraft geometry</MenuItem>
          <MenuItem value="Spherical geometry">Spherical geometry</MenuItem>
        </Select>
      </FormControl>
      {sphericalGeometryStatus === true && (
        <Box sx={{ display: "flex", gap: "16px" }}>
          <TextField
            label="Area*"
            type="number"
            value={() => {
              const geometry = formMode.getOverrideGeometry();
              if (geometry instanceof SphereGeometry360) {
                return geometry.getArea();
              } else {
                return "";
              }
            }}
            onChange={(e) => {
              const value =
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/^0+(?=\d)/, "") || "0";
              setSphericalGeometryForm({
                ...sphericalGeometryForm,
                area: value,
              });
            }}
            sx={{
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#79747E",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#79747E",
                },
            }}
            fullWidth
          />
          <TextField
            label="CD*"
            type="number"
            value={() => {
              const geometry = formMode.getOverrideGeometry();
              if (geometry instanceof SphereGeometry360) {
                return geometry.getCD();
              } else {
                return "";
              }
            }}
            onChange={(e) => {
              const value =
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/^0+(?=\d)/, "") || "0";
              setSphericalGeometryForm({
                ...sphericalGeometryForm,
                cd: value,
              });
            }}
            sx={{
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#79747E",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#79747E",
                },
            }}
            fullWidth
          />
          <TextField
            label="CR*"
            type="number"
            value={() => {
              const geometry = formMode.getOverrideGeometry();
              if (geometry instanceof SphereGeometry360) {
                return geometry.getCR();
              } else {
                return "";
              }
            }}
            onChange={(e) => {
              const value =
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/^0+(?=\d)/, "") || "0";
              setSphericalGeometryForm({
                ...sphericalGeometryForm,
                cr: value,
              });
            }}
            sx={{
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#79747E",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#79747E",
                },
            }}
            fullWidth
          />
        </Box>
      )}
    </Box>
  );
};

export default GeometryMode;
