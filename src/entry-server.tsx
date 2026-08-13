import { renderToString } from "react-dom/server";
import Home from "../app/page";
import FraudHelpPage from "../app/pomoshch-pri-moshennichestve/page";

export function render(pathname = "/") {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const Page = normalizedPath === "/pomoshch-pri-moshennichestve" ? FraudHelpPage : Home;
  return renderToString(<Page />);
}
