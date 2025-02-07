import React, { useState } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import Spacecraft1 from "../../data/spacecraft/spacecraft-1.json";
import Spacecraft2 from "../../data/spacecraft/spacecraft-2.json";
import { Spacecraft } from "../../types/spacecraft.types";
import BasicDialog from "../modals/basic-dialog.tsx";
import { useSpacecraftStore } from "../../store/spacecraftStore.ts";

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
  const spacecraftSelected = useSpacecraftStore((state) => state.spacecraft);
  const setSpacecraftSelected = useSpacecraftStore(
    (state) => state.updateSpacecraft
  );
  const [selected, setSelected] = useState<string>("");
  const [changeSelectDialog, setChangeSelectDialog] = useState<boolean>(false);

  const onChangeSelect = (e: SelectChangeEvent<string>) => {
    setSelected(e.target.value as string);
    setChangeSelectDialog(true);
  };

  const confirmChangeSelect = () => {
    setSpacecraftSelected(
      spacecraftList.find((spacecraft) => spacecraft.name === selected) ||
        emptySpacecraft
    );
    setSelected("");
    setChangeSelectDialog(false);
  };

  return (
    <>
      <Select
        labelId="Spacecraft-label"
        id="Spacecraft-select"
        value={spacecraftSelected.name}
        onChange={(e) => onChangeSelect(e)}
        sx={selectStyle}
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
      <BasicDialog
        onClose={() => setChangeSelectDialog(false)}
        onConfirm={() => confirmChangeSelect()}
        open={changeSelectDialog}
        confirmBottonLabel="Accept"
        title="Op Machine will be affected"
        description="By selecting that spacecraft your oP Machine will be affected, some of the modes selected are not compatible with the spacecraft characteristics"
      />
    </>
  );
};

export default SpacecraftSelect;

const selectStyle = {
  width: "30%",
  minWidth: "200px",
  "& .MuiOutlinedInput-input": {
    display: "flex",
  },
};
