import { Button, Menu, MenuItem } from '@mui/material';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const PopupMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <Button disableRipple size="small" onClick={handleClick} sx={{
                borderRadius: 50, color: "#49454F", padding: "16px", width: "24px",
                height: "24px",
                minWidth: "24px",
                minHeight: "24px",
            }}>
                <MoreVertIcon fontSize="small" />
            </Button>
            <Menu
                className='nodrag'
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
                <MenuItem onClick={handleClose}>Rename operation</MenuItem>
                <MenuItem onClick={handleClose}>Duplicate</MenuItem>
                <MenuItem onClick={handleClose}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export default PopupMenu;