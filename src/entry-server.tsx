import { renderToString } from "react-dom/server";
import Home from "../app/page";
import FraudHelpPage from "../app/pomoshch-pri-moshennichestve/page";
import PrivacyPolicyPage from "../app/politika-konfidencialnosti/page";

export function render(pathname = "/") {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const pages = {
    "/": Home,
    "/pomoshch-pri-moshennichestve": FraudHelpPage,
    "/politika-konfidencialnosti": PrivacyPolicyPage,
  };
  const Page = pages[normalizedPath as keyof typeof pages] ?? Home;
  return renderToString(<Page />);
}
