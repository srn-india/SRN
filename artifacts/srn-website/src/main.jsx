import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App.jsx";

// Global Fetch Interceptor to handle JWT authorization header for cross-domain requests
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
  
  if (token && typeof url === "string" && url.startsWith(apiBase)) {
    const headers = options.headers || {};
    options.headers = {
      ...headers,
      "Authorization": `Bearer ${token}`
    };
  }
  return originalFetch(url, options);
};

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
