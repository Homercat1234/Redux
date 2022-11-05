import { configureStore } from "@reduxjs/toolkit";
import session from "./store/session";

export default configureStore({
  reducer: { session },
});
