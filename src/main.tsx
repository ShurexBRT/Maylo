// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./app/App";
import "./styles/global.css";

// service worker registration (PWA auto-update)
registerSW({
  immediate: true,
  onNeedRefresh() {
    // TODO: optional toast: "New version available"
  },
  onOfflineReady() {
    // TODO: optional toast: "App is ready offline"
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
