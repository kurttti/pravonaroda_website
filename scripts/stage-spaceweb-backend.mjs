import { access, copyFile, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const backendRoot = resolve("spaceweb");
const publicOutput = resolve("spaceweb-dist", "api");
const privateOutput = resolve("spaceweb-private-dist");
const autoloadPath = resolve(backendRoot, "vendor", "autoload.php");

await access(autoloadPath).catch(() => {
  throw new Error("Missing spaceweb/vendor/autoload.php. Run Composer install before the SpaceWeb build.");
});

await rm(privateOutput, { recursive: true, force: true });
await mkdir(publicOutput, { recursive: true });
await mkdir(privateOutput, { recursive: true });

await copyFile(resolve(backendRoot, "api", "send-request.php"), resolve(publicOutput, "send-request.php"));
await copyFile(resolve(backendRoot, "bootstrap.php"), resolve(privateOutput, "bootstrap.php"));
await cp(resolve(backendRoot, "src"), resolve(privateOutput, "src"), { recursive: true });
await cp(resolve(backendRoot, "vendor"), resolve(privateOutput, "vendor"), { recursive: true });

console.log("SpaceWeb PHP backend staged.");
