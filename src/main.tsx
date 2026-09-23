import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// The site used to have separate routes; send old links to the matching section.
const legacyRoutes: Record<string, string> = { "/projects": "#projects", "/info": "#info" };
const legacy = legacyRoutes[location.pathname.replace(/\/+$/, "")];
if (legacy) history.replaceState(null, "", "/" + legacy);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
