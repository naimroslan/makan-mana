import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// Lottie - CSP Workaround
// Intercept style element creation BEFORE any code runs
// This ensures nonces are added at creation time, not after insertion
if (typeof window !== "undefined") {
  const nonce = (window as any).__nonce__;

  if (nonce) {
    // Intercept document.createElement to add nonce to style elements immediately
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function (
      tagName: string,
      options?: ElementCreationOptions,
    ) {
      const element = originalCreateElement(tagName, options);

      // Add nonce immediately when style element is created
      if (tagName.toLowerCase() === "style" && nonce) {
        element.setAttribute("nonce", nonce);
      }

      return element;
    };

    // Also add nonce to any existing style elements (from SSR)
    document.querySelectorAll("style:not([nonce])").forEach((style) => {
      style.setAttribute("nonce", nonce);
    });
  }
}

// DEFAULT entry.client.tsx below

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
