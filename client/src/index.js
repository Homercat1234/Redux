import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./state/index";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
const styles = `* {
  margin: 0;
  padding: 0;
}
`
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <style>
        {styles}
      </style>
      <App />
    </Provider>
  </React.StrictMode>
);
