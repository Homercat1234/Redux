import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import getPosts from "../functions/getPosts";

export default function Posts(props) {
  const [posts, setPosts] = useState([]);
  const style = props.style;

  useEffect(() => {
    (async () => {
      setPosts(await getPosts());
    })();
  }, []);

  return (
    <Paper style={style} variant="outlined" square>
      {posts != null && posts}
    </Paper>
  );
}
