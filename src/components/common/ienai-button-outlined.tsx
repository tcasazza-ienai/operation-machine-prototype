import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";

interface IenaiButtonOutlinedProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  props?: ButtonProps;
}

const IenaiButtonOutlined: React.FC<IenaiButtonOutlinedProps> = ({
  onClick,
  label,
  icon,
  props,
}) => {
  return (
    <Button
      onClick={onClick}
      color={"primary"}
      variant={"outlined"}
      sx={buttonStyle}
      startIcon={icon ? icon : null}
      {...props}
    >
      {label}
    </Button>
  );
};

export default IenaiButtonOutlined;

const buttonStyle = {
  borderRadius: "100px",
  color: "#5641E2",
  textTransform: "none",
  height: "40px",
};
