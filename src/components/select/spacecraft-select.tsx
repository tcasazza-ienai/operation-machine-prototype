import React, { useState } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Spacecraft360 } from "../../entities/Spacecraft.ts";
import {
  createNewSimpleSpaceCraft,
  createSpacecraft_tutorial5,
} from "../../data/spacecraft/createSpacecraft.ts";
import BasicDialog from "../modals/basic-dialog.tsx";

const SpacecraftSelect: React.FC = () => {
  const emptySpacecraft: Spacecraft360 = new Spacecraft360("");

  const [spacecraftList, setSpacecraftList] = useState<Spacecraft360[]>([
    createNewSimpleSpaceCraft(),
    createSpacecraft_tutorial5(),
  ]);
  const [spacecraftSelected, setSpacecraftSelected] = useState<Spacecraft360>(
    createNewSimpleSpaceCraft()
  );
  const [selected, setSelected] = useState<string>("");
  const [changeSelectDialog, setChangeSelectDialog] = useState<boolean>(false);

  const onChangeSelect = (e: SelectChangeEvent<string>) => {
    setSelected(e.target.value as string);
    setChangeSelectDialog(true);
  };

  const confirmChangeSelect = () => {
    setSpacecraftSelected(
      spacecraftList.find((spacecraft) => spacecraft.getName() === selected) ||
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
        value={spacecraftSelected.getName()}
        onChange={(e) => onChangeSelect(e)}
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
            key={spacecraft.getName() + index}
            value={spacecraft.getName()}
            style={{ display: "flex", justifyContent: "start" }}
          >
            {spacecraft.getName()}
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
