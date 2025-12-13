import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppsProvider } from "./app/AppsProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppsProvider>
      <App />
    </AppsProvider>
  </React.StrictMode>,
);
