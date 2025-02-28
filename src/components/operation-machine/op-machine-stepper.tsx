import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
const OpMachineStepper: React.FC<{ steps: string[]; stepNumber: number }> = ({
  stepNumber,
  steps,
}) => {
  return (
    <Box sx={containerSx}>
      {steps.map((step, index) => (
        <Box key={index}>
          <Typography
            variant="body1"
            component="span"
            sx={getTypographySx(stepNumber === index)}
          >
            {index + 1}. {step}
          </Typography>
          {index < steps.length - 1 && (
            <Typography variant="body1" component="span" sx={dashTypographySx}>
              –
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default OpMachineStepper;

const containerSx = {
  color: "#49454F",
  textAlign: "start",
  paddingLeft: "4px",
  display: "flex",
};

const getTypographySx = (isActive: boolean) => ({
  color: isActive ? "#5641E2" : "#49454F",
  fontWeight: isActive ? "bold" : "normal",
});

const dashTypographySx = { mx: 1 };
