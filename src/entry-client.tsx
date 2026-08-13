import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import Home from "../app/page";
import FraudHelpPage from "../app/pomoshch-pri-moshennichestve/page";
import "../app/globals.css";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = pathname === "/pomoshch-pri-moshennichestve" ? FraudHelpPage : Home;

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <Page />
  </StrictMode>,
);
