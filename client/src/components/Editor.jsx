import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, Paper, TextField, Grid, useTheme } from "@mui/material";
import Axios from "axios";
import Cookies from "universal-cookie";

export default function Editor(props) {
  const [textValue, setTextValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const theme = useTheme();

  const onTextChange = (e) => setTextValue(e.target.value);
  const onTitleChange = (e) => setTitleValue(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(textValue);
    const cookies = new Cookies();
    cookies.get("session");
    await Axios.post(
      "http://localhost:5000/blog/post",
      { post: textValue, title: titleValue },
      {
        headers: {
          session: cookies["cookies"]["session"],
        },
      }
    );
  };
  const handleReset = () => setTextValue("");
  const width = props.customWidth == null ? "50vw" : props.customWidth;

  return (
    <Paper elevation={0} variant="outlined" square style={{ width }}>
      <div style={{ padding: "2px" }}>
        <h2>Editor</h2>

        <TextField
          onChange={onTitleChange}
          value={titleValue}
          label={"Title"}
          fullWidth
          multiline
          style={{marginBottom: "7px"}}
        />
        <TextField
          onChange={onTextChange}
          value={textValue}
          label={"Post"}
          fullWidth
          multiline
          rows={2}
        />
        <Box marginTop={1}>
          <Grid
            container
            spacing={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Grid componet={Paper} sx={{padding: theme.spacing(1), textAlign: 'center'}} item xs={5} elevation={0}>
                <Button onClick={handleSubmit}>Submit</Button>
            </Grid>
            <Grid componet={Paper} sx={{padding: theme.spacing(1), textAlign: 'center'}} item xs={5} elevation={0}>
                <Button onClick={handleReset}>Clear</Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Paper>
  );
}
