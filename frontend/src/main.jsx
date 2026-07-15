import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import { LeadProvider } from "./context/LeadContext";
import { DarkModeProvider } from "./context/DarkModeContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeProvider>
      <LeadProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </LeadProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
