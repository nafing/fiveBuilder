import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./samples/node-api";
import "./assets/index.css";

import { ContextProvider } from "./hooks/ContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
