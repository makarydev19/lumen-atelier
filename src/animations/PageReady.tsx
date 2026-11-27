"use client";

import { useEffect } from "react";

/**
 * Hydration gate. The page segment hydrates in its own Suspense pass, which can finish after
 * the layout's <PageMotion/> has mounted. GSAP must not split or restyle page DOM before React
 * has hydrated it (that is a hydration mismatch, and React then throws the server DOM away,
 * splits and all). Rendered last in the page: its effect runs once the page has hydrated.
 */
let resolveReady: (() => void) | null = null;
const readyPromise: Promise<void> | null =
  typeof window === "undefined"
    ? null
    : new Promise<void>((r) => {
        resolveReady = r;
      });

export function whenPageReady(timeout = 4000): Promise<void> {
  if (!readyPromise) return Promise.resolve();
  return Promise.race([readyPromise, new Promise<void>((r) => setTimeout(r, timeout))]);
}

export function PageReady() {
  useEffect(() => {
    resolveReady?.();
  }, []);
  return null;
}
