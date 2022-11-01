import * as React from "react";
import { Typography, Box, CssBaseline, useTheme } from "@mui/material";
export default function Footer() {
  const theme = useTheme();

  return (
    <Box 
    >
      <CssBaseline />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mb: 0,
          mt: "auto",
          backgroundColor: theme.palette.primary.dark,
        }}
      >
        <Typography variant="body2" style={{ textAlign: "center", color: "white"}}>
          <>&copy;</> <b>Michael A. Smith</b> 2022.
        </Typography>
      </Box>
    </Box>
  );
}
