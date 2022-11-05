import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const session = createSlice({
  name: "session",
  initialState: {
    value: false,
  },
  reducers: {
    update: (state, data) => {
      state.value = data;
    },
    create: (state, data) => {
      console.log(data);
      const cookies = new Cookies();
      const { uid, expires, hash } = data.payload;
      cookies.set(
        "session",
        { uid, expires, hash },
        {
          path: "/",
          expires: new Date(expires),
        }
      );
      state.value = true;
    },
    remove: (state) => {
      const cookies = new Cookies();
      cookies.remove("session");
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { validate, create, update } = session.actions;

export default session.reducer;
