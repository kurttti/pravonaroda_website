import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function startChrome() {
  const userDataDir = await mkdtemp(join(tmpdir(), "pravonaroda-mobile-test-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  return new Promise((resolve, reject) => {
    let stderr = "";
    const timeout = setTimeout(() => reject(new Error(`Chrome did not start: ${stderr}`)), 10_000);

    chrome.stderr.setEncoding("utf8");
    chrome.stderr.on("data", (chunk) => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolve({ chrome, browserWebSocketUrl: match[1], userDataDir });
      }
    });
    chrome.once("error", reject);
    chrome.once("exit", (code) => {
      if (!stderr.includes("DevTools listening on")) reject(new Error(`Chrome exited with ${code}: ${stderr}`));
    });
  });
}

async function createPage(browserWebSocketUrl) {
  const socket = new WebSocket(browserWebSocketUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const callback = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) callback?.reject(new Error(message.error.message));
      else callback?.resolve(message.result);
      return;
    }
    const callback = listeners.get(message.method);
    if (callback) {
      listeners.delete(message.method);
      callback(message.params);
    }
  });

  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const once = (method) => new Promise((resolve) => listeners.set(method, resolve));

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);

  return { socket, send, once, sessionId };
}

test("keeps the complete hero heading inside narrow mobile viewports", async (t) => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><main><section class="hero hero-simple"><div class="container hero-simple-grid"><div class="hero-copy"><h1>Юридическая помощь при <em>мошенничестве</em></h1></div></div></section></main></body></html>`;
  const pageUrl = `data:text/html;base64,${Buffer.from(html).toString("base64")}`;
  const { chrome, browserWebSocketUrl, userDataDir } = await startChrome();
  t.after(async () => {
    if (chrome.exitCode === null) {
      const exited = new Promise((resolve) => chrome.once("exit", resolve));
      chrome.kill("SIGTERM");
      await exited;
    }
    await rm(userDataDir, { recursive: true, force: true });
  });

  const page = await createPage(browserWebSocketUrl);
  t.after(() => page.socket.close());

  for (const width of [320, 360, 390, 430]) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: true,
    }, page.sessionId);

    const loaded = page.once("Page.loadEventFired");
    await page.send("Page.navigate", { url: pageUrl }, page.sessionId);
    await loaded;

    const { result } = await page.send("Runtime.evaluate", {
      expression: `(() => {
        const title = document.querySelector("h1");
        const accentWord = document.querySelector("h1 em");
        const container = document.querySelector(".container");
        return {
          titleLeft: title.getBoundingClientRect().left,
          accentRight: accentWord.getBoundingClientRect().right,
          containerLeft: container.getBoundingClientRect().left,
          containerRight: container.getBoundingClientRect().right,
          fontSize: getComputedStyle(title).fontSize,
        };
      })()`,
      returnByValue: true,
    }, page.sessionId);

    const layout = result.value;
    assert.ok(layout.titleLeft >= layout.containerLeft - 0.5, `heading starts outside ${width}px viewport`);
    assert.ok(
      layout.accentRight <= layout.containerRight + 0.5,
      `accent word overflows at ${width}px: ${JSON.stringify(layout)}`,
    );
  }
});
