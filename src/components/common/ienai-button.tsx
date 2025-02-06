import React from "react";
import Button from "@mui/material/Button";

interface IenaiButtonProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}

const IenaiButton: React.FC<IenaiButtonProps> = ({ onClick, label, icon }) => {
  return (
    <Button
      onClick={onClick}
      color={"primary"}
      variant={"contained"}
      sx={buttonStyle}
      startIcon={icon ? icon : null}
    >
      {label}
    </Button>
  );
};

export default IenaiButton;

const buttonStyle = {
  borderRadius: "100px",
  backgroundColor: "#5641E2",
  textTransform: "none",
  height: "40px",
};
