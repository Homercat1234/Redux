import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import {
  Box,
  useTheme,
  Button,
  Paper,
  TextField,
  Grid,
} from "@mui/material";

export default function Blog() {
  const theme = useTheme();
  const [textValue, setTextValue] = useState("");

  const onTextChange = (e) => setTextValue(e.target.value);
  const handleSubmit = () => console.log(textValue);
  const handleReset = () => setTextValue("");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <Box sx={{ height: "100vh", background: "white" }}>
      <Paper>
        <h2>Form Demo</h2>

        <TextField
          onChange={onTextChange}
          value={textValue}
          label={"Text Value"} //optional
        />

        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Item><Button onClick={handleSubmit}>Submit</Button></Item>
          </Grid>
          <Grid item xs={5}>
            <Item><Button onClick={handleReset}>Reset</Button></Item>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
