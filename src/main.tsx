import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

function renderBootstrapFallback(message: string) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;background:var(--background, #0b1220);padding:16px;font-family:system-ui,sans-serif;color:var(--foreground, #e5e7eb);">
      <div style="max-width:560px;text-align:center;">
        <h1 style="font-size:1.25rem;font-weight:600;margin:0;">Preview needs a refresh</h1>
        <p style="margin:12px 0 0;color:rgba(229,231,235,0.75);line-height:1.5;">${message}</p>
        <button onclick="window.location.reload()" style="margin-top:24px;border:0;border-radius:8px;padding:10px 16px;background:#f59e0b;color:#111827;font-weight:600;cursor:pointer;">Reload</button>
      </div>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  const message = event.error?.message ?? event.message ?? "";
  const normalized = message.toLowerCase();
  if (
    normalized.includes("failed to fetch dynamically imported module") ||
    normalized.includes("loading chunk") ||
    normalized.includes("chunkloaderror") ||
    normalized.includes("module script")
  ) {
    console.error("[preview recovery] runtime chunk failure", event.error ?? event.message);
  }
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message = reason instanceof Error ? reason.message : String(reason ?? "");
  const normalized = message.toLowerCase();

  if (
    normalized.includes("failed to fetch dynamically imported module") ||
    normalized.includes("loading chunk") ||
    normalized.includes("chunkloaderror") ||
    normalized.includes("modulepreload")
  ) {
    console.error("[preview recovery] unhandled route chunk failure", reason);
    renderBootstrapFallback("A route update failed to finish loading after recent edits. Reloading the preview will reconnect the newest code safely.");
  }
});

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  renderBootstrapFallback("The app root was not ready during preview startup. Reloading the preview should recover the latest build safely.");
  throw new Error("Root element #root not found in index.html");
}

try {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
} catch (error) {
  console.error("[preview recovery] bootstrap render failed", error);
  renderBootstrapFallback("The preview hit a startup error after recent edits. Reloading will retry the latest app state without waiting for a full rebuild message.");
  throw error;
}
