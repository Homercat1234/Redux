import { Box, useTheme } from "@mui/material";

export default function Home() {
  const theme = useTheme();

  return (
    <Box sx={{ height: "100vh", background: theme.palette.primary.dark }}></Box>
  );
}
