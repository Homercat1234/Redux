import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";
export default function Home() {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);

  return (
    <Box sx={{ height: "100vh", background: theme.palette.primary.dark }}></Box>
  );
}
