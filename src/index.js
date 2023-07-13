import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DataState from "./pages/components/context/auth/DataState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DataState>
      <App />
    </DataState>
  </React.StrictMode>
);
