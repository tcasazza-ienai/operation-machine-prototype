import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export interface PopupMenuProp {
  label: string;
  action: () => void;
}

const PopupMenu: React.FC<{ items: PopupMenuProp[] }> = ({ items }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const clickItem = (item) => {
    handleClose();
    item.action();
  };
  return (
    <div>
      <Button disableRipple size="small" onClick={handleClick} sx={buttonStyle}>
        <MoreVertIcon fontSize="small" />
      </Button>
      <Menu
        className="nodrag"
        slotProps={{
          paper: {
            sx: {
              background: "var(--Surface-Container, #F3EDF7)",
              paddingTop: "0px",
            },
          },
        }}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {items.map((item, index) => (
          <MenuItem key={item.label + index} onClick={() => clickItem(item)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default PopupMenu;

const buttonStyle = {
  borderRadius: 50,
  color: "#49454F",
  padding: "16px",
  width: "24px",
  height: "24px",
  minWidth: "24px",
  minHeight: "24px",
};
