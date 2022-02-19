import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChainId, DAppProvider } from "@usedapp/core";

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={{}}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
