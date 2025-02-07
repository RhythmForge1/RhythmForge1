import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./Components/App";
if (window.ResizeObserver) {
  const ro = new ResizeObserver(() => {});
  ro.observe(document.body);
  ro.disconnect();
}
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
