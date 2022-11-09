import Axios from "axios";
import { Grid, Divider } from "@mui/material";

export default async function getPosts() {
  let posts = await Axios.get("http://localhost:5000/blog/post").then(
    (data) => {
      return data.data;
    }
  );

  async function getName(uid) {
    return await Axios.get("http://localhost:5000/blog/name", {
      headers: { uid },
    }).then((res) => {
      return res.data;
    });
  }

  let names = await Promise.all(
    posts.map(async (element, index) => {
      return await getName(element.uid);
    })
  );

  let array = [];
  posts.forEach((item, index) =>
    array.push(
      <div key={item.id}>
        {index > 0 && <Divider /> }
        {item.id} : {item.title}
        <Divider /> 
        <Grid item>{item.post}</Grid>
        <Grid item>by {names[index]}</Grid>
      </div>
    )
  );
  return array;
}
