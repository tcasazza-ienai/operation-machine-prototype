import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Spacecraft360 } from "../../entities/Spacecraft.ts";
import {
  createNewSimpleSpaceCraft,
  createSpacecraft_tutorial5,
} from "../../data/spacecraft/createSpacecraft.ts";
import BasicDialog from "../modals/basic-dialog.tsx";
import { useSpacecraftStore } from "../../store/spacecraftStore.ts";

const SpacecraftSelect: React.FC = () => {
  const currentSpacecraft = useSpacecraftStore((state) => state.spacecraft);
  const setSpacecraft = useSpacecraftStore((state) => state.updateSpacecraft);

  const [spacecraftList, setSpacecraftList] = useState<Spacecraft360[]>([
    createSpacecraft_tutorial5(),
    createNewSimpleSpaceCraft(),
  ]);
  const [spacecraftSelected, setSpacecraftSelected] = useState<
    Spacecraft360 | undefined
  >(currentSpacecraft);
  const [selected, setSelected] = useState<string>("");
  const [changeSelectDialog, setChangeSelectDialog] = useState<boolean>(false);

  const onChangeSelect = (e: SelectChangeEvent<string>) => {
    setSelected(e.target.value as string);
    console.log(!spacecraftSelected);
    if (!spacecraftSelected) {
      setSpacecraft(
        spacecraftList.find(
          (spacecraft) => spacecraft.getName() === e.target.value
        ) || undefined
      );
    } else {
      setChangeSelectDialog(true);
    }
  };

  const confirmChangeSelect = () => {
    setSpacecraft(
      spacecraftList.find((spacecraft) => spacecraft.getName() === selected) ||
        undefined
    );
    setSelected("");
    setChangeSelectDialog(false);
  };

  useEffect(() => {
    setSpacecraftSelected(currentSpacecraft);
  }, [currentSpacecraft]);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Spacecraft associated</InputLabel>
        <Select
          labelId="Spacecraft-label"
          id="Spacecraft-select"
          label="Spacecraft associated"
          value={
            spacecraftSelected instanceof Spacecraft360
              ? spacecraftSelected.getName()
              : ""
          }
          onChange={(e) => onChangeSelect(e)}
          sx={selectStyle}
        >
          {spacecraftList.map((spacecraft, index) => (
            <MenuItem
              key={spacecraft.getName() + index}
              value={spacecraft.getName()}
              style={menuItemStyle}
            >
              {spacecraft.getName()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
  width: "100%",
  "& .MuiOutlinedInput-input": {
    display: "flex",
  },
};

const menuItemStyle = { display: "flex", justifyContent: "start" };
