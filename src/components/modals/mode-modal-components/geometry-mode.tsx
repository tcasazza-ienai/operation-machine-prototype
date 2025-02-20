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
import { Mode360, SphereGeometry360 } from "../../../entities/OpMachine.ts";

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
  // Estado para manejar el valor del Select
  const [geometryType, setGeometryType] = useState<string>(
    sphericalGeometryStatus ? "Spherical geometry" : "Spacecraft geometry"
  );

  const [sphericalGeometryForm, setSphericalGeometryForm] = useState<{
    area: string;
    cd: string;
    cr: string;
  }>({ area: "", cd: "", cr: "" });

  const handleGeometry = (e: SelectChangeEvent<string>) => {
    const geometry = e.target.value;
    setGeometryType(geometry);
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
      // Se actualiza formMode con la nueva geometría
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
  }, [sphericalGeometryForm]); // Se actualiza cuando cambia el formulario

  useEffect(() => {
    const currentOverrideGeometry = formMode.getOverrideGeometry();
    if (currentOverrideGeometry instanceof SphereGeometry360) {
      const newForm = {
        area: currentOverrideGeometry.getArea().toString(),
        cd: currentOverrideGeometry.getCD().toString(),
        cr: currentOverrideGeometry.getCR().toString(),
      };
      // Actualizar solo si hay diferencias
      if (
        sphericalGeometryForm.area !== newForm.area ||
        sphericalGeometryForm.cd !== newForm.cd ||
        sphericalGeometryForm.cr !== newForm.cr
      ) {
        setSphericalGeometryForm(newForm);
      }
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
          value={geometryType} // Se usa "value" para hacerlo controlado
          fullWidth
          onChange={handleGeometry}
        >
          <MenuItem value="Spacecraft geometry">Spacecraft geometry</MenuItem>
          <MenuItem value="Spherical geometry">Spherical geometry</MenuItem>
        </Select>
      </FormControl>
      {sphericalGeometryStatus && (
        <Box sx={{ display: "flex", gap: "16px" }}>
          <TextField
            label="Area*"
            type="number"
            value={
              sphericalGeometryForm.area // Se pasa el valor directamente
            }
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
            fullWidth
          />
          <TextField
            label="CD*"
            type="number"
            value={sphericalGeometryForm.cd}
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
            fullWidth
          />
          <TextField
            label="CR*"
            type="number"
            value={sphericalGeometryForm.cr}
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
            fullWidth
          />
        </Box>
      )}
    </Box>
  );
};

export default GeometryMode;
