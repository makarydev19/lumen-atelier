"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/** Register every plugin exactly once (module scope runs once per bundle). */
let registered = false;
if (!registered && typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

/** gsap.matchMedia conditions (DESIGN.md §5). */
export const MQ = {
  isDesktop: "(min-width: 1200px) and (prefers-reduced-motion: no-preference)",
  isMobile: "(max-width: 1199px) and (prefers-reduced-motion: no-preference)",
  isPinGallery: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MQConditions = { [K in keyof typeof MQ]: boolean };

export const CURSOR_MQ = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

/** Resolves when web fonts are ready, or after `timeout` ms (never blocks forever). */
export function fontsReady(timeout = 2500): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return Promise.resolve();
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((r) => setTimeout(r, timeout)),
  ]);
}

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

export { gsap, ScrollTrigger, SplitText, useGSAP };
