import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { GlobalContextProvider } from "./context/globalContext";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalContextProvider>
      <App />
      <Toaster />
    </GlobalContextProvider>
  </React.StrictMode>
);
