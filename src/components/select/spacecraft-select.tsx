import React, { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import Spacecraft1 from "../../data/spacecraft/spacecraft-1.json";
import Spacecraft2 from "../../data/spacecraft/spacecraft-2.json";
import { Spacecraft } from "../../types/spacecraft.types";

const SpacecraftSelect: React.FC = () => {
  const emptySpacecraft: Spacecraft = {
    name: "",
    sc_systems: {
      functional_id: "",
      system: {
        name: "",
        mass: 0,
        thrust: 0,
        cost: 0,
      },
      functional_direction: "",
    },
    override_dry_mass: 0,
    area: 0,
    CD: 0,
  };

  const [spacecraftList, setSpacecraftList] = useState<Spacecraft[]>([
    Spacecraft1,
    Spacecraft2,
  ]);
  const [spacecraftSelected, setSpacecraftSelected] =
    useState<Spacecraft>(Spacecraft1);

  return (
    <Select
      labelId="Spacecraft-label"
      id="Spacecraft-select"
      value={spacecraftSelected.name}
      onChange={(e) =>
        setSpacecraftSelected(
          spacecraftList.find(
            (spacecraft) => spacecraft.name === e.target.value
          ) || emptySpacecraft
        )
      }
      sx={{
        width: "30%",
        minWidth: "200px",
        "& .MuiOutlinedInput-input": {
          display: "flex",
        },
      }}
    >
      {spacecraftList.map((spacecraft, index) => (
        <MenuItem
          key={spacecraft.name + index}
          value={spacecraft.name}
          style={{ display: "flex", justifyContent: "start" }}
        >
          {spacecraft.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SpacecraftSelect;
