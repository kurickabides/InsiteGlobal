import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app";
import { store } from "./appStore/store";
//import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import { xlmStateServer } from "./components/stellar/providers/xlmClientFactory";

declare global {
  interface Window {
    rabet: any;
    cryoRioAccountServer?: xlmStateServer;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

//reportWebVitals();
serviceWorker.unregister();
