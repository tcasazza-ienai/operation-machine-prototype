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
import { Mode, SphereGeometry } from "../../../types/operation-machine.types";
import { useEdges } from "@xyflow/react";

interface GeometryModeProps {
  formMode: Mode;
  setFormMode: React.Dispatch<React.SetStateAction<Mode>>;
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
    if (geometry === "Spherical geometry") {
      setSphericalGeometryStatus(true);
    } else {
      setSphericalGeometryStatus(false);
      setFormMode({
        ...formMode,
        override_geometry: undefined,
        id: formMode.id,
        name: formMode.name,
        pointing: formMode.pointing,
      });
      setSphericalGeometryForm({ area: "", cd: "", cr: "" });
    }
  };

  useEffect(() => {
    if (sphericalGeometryStatus) {
      setFormMode({
        ...formMode,
        override_geometry: {
          area: Number.parseFloat(sphericalGeometryForm.area),
          CD: Number.parseFloat(sphericalGeometryForm.cd),
          CR: Number.parseFloat(sphericalGeometryForm.cr),
        },
      });
    }
  }, [sphericalGeometryForm]);

  useEffect(() => {
    if (formMode.override_geometry) {
      setSphericalGeometryForm({
        area: formMode.override_geometry.area.toString(),
        cd: formMode.override_geometry.CD.toString(),
        cr: formMode.override_geometry.CR.toString(),
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
            value={formMode.override_geometry?.area || ""}
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
            value={formMode.override_geometry?.CD || ""}
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
            value={formMode.override_geometry?.CR || ""}
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
