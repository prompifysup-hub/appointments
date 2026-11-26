import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource-variable/inter";
import "@/theme.css";
import "@/styles/globals.css";

import App from "@/App";
import { THEME_MODE } from "@/prompify-settings";
import { APP } from "@/config/app";

// Browser tab: the business's name and description (placeholders in src/config/app.ts).
document.title = APP.name;
document.querySelector('meta[name="description"]')?.setAttribute("content", APP.description);

// First visit: start in the theme's default mode (index.html applies a saved choice before this).
if (!document.documentElement.classList.contains("light") && !document.documentElement.classList.contains("dark")) {
  document.documentElement.classList.add(THEME_MODE);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
