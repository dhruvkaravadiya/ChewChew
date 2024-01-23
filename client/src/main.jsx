import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
);
