import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";

interface IenaiButtonOutlinedProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  props?: ButtonProps;
}

const IenaiButtonText: React.FC<IenaiButtonOutlinedProps> = ({
  onClick,
  label,
  icon,
  props,
}) => {
  return (
    <Button
      onClick={onClick}
      color={"primary"}
      variant={"text"}
      sx={buttonStyle}
      startIcon={icon ? icon : null}
      {...props}
    >
      {label}
    </Button>
  );
};

export default IenaiButtonText;

const buttonStyle = {
  borderRadius: "100px",
  color: "#5641E2",
  textTransform: "none",
  height: "40px",
};
