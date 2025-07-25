import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SettingsProvider } from "./context/SettingsContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  < StrictMode >
    <Router basename="/NOS-fund-scanner">
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </Router>
  </StrictMode >
);
