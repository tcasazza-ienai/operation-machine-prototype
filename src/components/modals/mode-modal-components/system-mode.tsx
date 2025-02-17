import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SystemMode: React.FC<any> = ({
  spacecraftSelected,
  formMode,
  setFormMode,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "16px",
        gap: "16px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Object Name (Functional ID)</InputLabel>
        <Select
          label="Object Name (Functional ID)"
          value={formMode.system_mode?.[0]?.functional_id || ""}
          onChange={(e) => {
            const selectedSystem = spacecraftSelected.sc_systems.find(
              (system) => system.functional_id === e.target.value
            );
            const newSystemMode = selectedSystem
              ? [selectedSystem, ...(formMode.system_mode?.slice(1) || [])]
              : formMode.system_mode;
            setFormMode({ ...formMode, system_mode: newSystemMode || [] });
          }}
        >
          <MenuItem value="">_</MenuItem>
          {spacecraftSelected.sc_systems.map((system) => (
            <MenuItem key={system.functional_id} value={system.functional_id}>
              {system.functional_id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Object Name (Functional ID)</InputLabel>
        <Select
          label="Object Name (Functional ID)"
          disabled={!formMode.system_mode?.[0]}
          value={formMode.system_mode?.[1]?.functional_id || ""}
          onChange={(e) => {
            const selectedSystem = spacecraftSelected.sc_systems.find(
              (system) => system.functional_id === e.target.value
            );
            const newSystemMode = selectedSystem
              ? [formMode.system_mode[0], selectedSystem]
              : formMode.system_mode;
            setFormMode({ ...formMode, system_mode: newSystemMode || [] });
          }}
        >
          <MenuItem value="">_</MenuItem>
          {spacecraftSelected.sc_systems
            .filter(
              (system) =>
                system.functional_id !==
                formMode.system_mode?.[0]?.functional_id
            )
            .map((system) => (
              <MenuItem key={system.functional_id} value={system.functional_id}>
                {system.functional_id}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SystemMode;
