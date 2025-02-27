import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
const OpMachineStepper: React.FC<{ steps: string[]; stepNumber: number }> = ({
  stepNumber,
  steps,
}) => {
  return (
    <Box
      sx={{
        color: "#49454F",
        textAlign: "start",
        paddingLeft: "4px",
        display: "flex",
      }}
    >
      {steps.map((step, index) => (
        <Box key={index}>
          <Typography
            variant="body1"
            component="span"
            sx={{
              color: stepNumber === index ? "#5641E2" : "#49454F",
              fontWeight: stepNumber === index ? "bold" : "normal",
            }}
          >
            {index + 1}. {step}
          </Typography>
          {index < steps.length - 1 && (
            <Typography variant="body1" component="span" sx={{ mx: 1 }}>
              –
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default OpMachineStepper;
