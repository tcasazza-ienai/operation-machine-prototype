import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  confirmBottonLabel?: string;
}

const BasicDialog: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  confirmBottonLabel = "Confirm",
  title = "Confirm Item",
  description = "",
  confirmColor = "secondary",
}) => {
  const onClickConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={dialogStyle}>
      <DialogTitle sx={dialogTitleStyle}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={dialogDescriptionStyle}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "24px 8px 24px 8px" }}>
        <Button onClick={onClose} sx={buttonStyle}>
          Cancel
        </Button>
        <Button onClick={() => onClickConfirm()} sx={buttonStyle}>
          {confirmBottonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BasicDialog;

const dialogStyle = {
  "& .MuiDialog-paper": {
    borderRadius: "28px",
    backgroundColor: "#ECE6F0",
    MaxWidth: "560px",
    padding: "24px 24px 0px 24px",
  },
};

const dialogTitleStyle = {
  color: "#1D1B20",
  fontSize: "var(--Headline-Small-Size, 24px)",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "var(--Headline-Small-Line-Height, 32px)",
  letterSpacing: "var(--Headline-Small-Tracking, 0px)",
  alignSelf: "stretch",
};

const dialogDescriptionStyle = {
  color: "var(--On-Surface-Variant, #49454F)",
  fontSize: "var(--Body-Medium-Size, 14px)",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "var(--Body-Medium-Line-Height, 20px)" /* 142.857% */,
  letterSpacing: "var(--Body-Medium-Tracking, 0.25px)",
};

const buttonStyle = {
  color: "var(--Primary, #5641E2)",
  textAlign: "center",
  fontSize: "var(--Label-Large-Size, 14px)",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "var(--Label-Large-Line-Height, 20px)" /* 142.857% */,
  letterSpacing: "var(--Label-Large-Tracking, 0.1px)",
  textTransform: "none",
};
