import { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import Editor from "../components/Editor";
import Posts from "../components/Posts";

export default function Blog() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <Box  
      spacing={0}
      direction="column"
      justifyContent="center"
      display="flex"
      style={{ minHeight: "100vh", minWidth:"100vw" }}
    >
      <Grid>
        <Posts style={{marginBottom: "2px", marginTop: "2px"}}/>
        <Editor />
      </Grid>
    </Box>
  );
}
