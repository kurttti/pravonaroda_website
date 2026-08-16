import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import Home from "../app/page";
import FraudHelpPage from "../app/pomoshch-pri-moshennichestve/page";
import PrivacyPolicyPage from "../app/politika-konfidencialnosti/page";
import "../app/globals.css";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const pages = {
  "/": Home,
  "/pomoshch-pri-moshennichestve": FraudHelpPage,
  "/politika-konfidencialnosti": PrivacyPolicyPage,
};
const Page = pages[pathname as keyof typeof pages] ?? Home;

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <Page />
  </StrictMode>,
);
