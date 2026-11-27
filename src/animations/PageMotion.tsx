"use client";

import { useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ, CURSOR_MQ, fontsReady, type MQConditions } from "./gsap";
import { runPreloader } from "./timelines/preloader";
import { heroTimeline } from "./timelines/hero";
import { philosophyTimeline } from "./timelines/philosophy";
import { projectsTimeline } from "./timelines/projects";
import { processTimeline } from "./timelines/process";
import { statsTimeline, recognitionTimeline } from "./timelines/stats";
import { footerTimeline } from "./timelines/footer";
import { headerTimeline, themeTween } from "./timelines/page";
import { parallaxSpeeds } from "./timelines/parallax";
import { setupCursor } from "./cursor";
import { whenPageReady } from "./PageReady";

/**
 * Orchestrates every GSAP animation on the page (DESIGN.md §5). Renders nothing.
 * - Preloader runs immediately (it gates itself on fonts).
 * - Section timelines are built once fonts are ready (SplitText measures real glyphs), inside one
 *   gsap.matchMedia so desktop / mobile / reduced-motion variants are reverted and rebuilt cleanly.
 * Everything lives in useGSAP contexts, so unmounting reverts all tweens, splits and ScrollTriggers.
 */
export function PageMotion() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("anim-ready");
    let alive = true;
    // Fonts (SplitText measures real glyphs) and a hydrated page (GSAP must not touch DOM React
    // has not hydrated yet: on phones the page segment can hydrate after this component mounts).
    Promise.all([fontsReady(), whenPageReady()]).then(() => alive && setFontsLoaded(true));
    // Last-resort: never leave the hero hidden if something below throws.
    const safety = window.setTimeout(() => root.classList.remove("js-intro"), 8000);
    return () => {
      alive = false;
      window.clearTimeout(safety);
    };
  }, []);

  // Preloader (§5.1): once per mount.
  useGSAP(() => runPreloader(), []);

  // Section motion: built once fonts are ready.
  useGSAP(
    () => {
      if (!fontsLoaded) return;
      const mm = gsap.matchMedia();

      mm.add(MQ, (ctx) => {
        const c = ctx.conditions as MQConditions;
        if (c.reduce) {
          // Reduced motion: content static and visible; only the header colour follows sections.
          document.documentElement.classList.remove("js-intro");
          headerTimeline({ hideOnScroll: false });
          return;
        }
        const cleanups = [
          heroTimeline({ isDesktop: c.isDesktop }),
          philosophyTimeline({ isDesktop: c.isDesktop }),
          projectsTimeline({ pin: c.isPinGallery }),
          processTimeline({ isDesktop: c.isDesktop }),
          statsTimeline(),
          recognitionTimeline(),
          footerTimeline({ isDesktop: c.isDesktop }),
          parallaxSpeeds(),
          // Created after the pins so their start/end include pin spacing.
          themeTween(),
          headerTimeline({ hideOnScroll: true }),
        ];
        ScrollTrigger.refresh();
        return () => cleanups.forEach((fn) => typeof fn === "function" && fn());
      });

      mm.add(CURSOR_MQ, () => setupCursor());

      // A refresh reverts and re-applies the pins, which moves pinned nodes in the DOM and
      // drops keyboard focus to <body> (e.g. while tabbing through the gallery). Keep it.
      let focused: HTMLElement | null = null;
      const saveFocus = () => {
        const el = document.activeElement;
        focused = el instanceof HTMLElement && el !== document.body ? el : null;
      };
      const restoreFocus = () => {
        if (focused?.isConnected && document.activeElement !== focused) focused.focus({ preventScroll: true });
        focused = null;
      };
      ScrollTrigger.addEventListener("refreshInit", saveFocus);
      ScrollTrigger.addEventListener("refresh", restoreFocus);

      // Late font swaps / image decode can shift layout: re-measure.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.addEventListener?.("loadingdone", refresh);
      window.addEventListener("load", refresh);
      return () => {
        document.fonts?.removeEventListener?.("loadingdone", refresh);
        window.removeEventListener("load", refresh);
        ScrollTrigger.removeEventListener("refreshInit", saveFocus);
        ScrollTrigger.removeEventListener("refresh", restoreFocus);
        mm.revert();
      };
    },
    { dependencies: [fontsLoaded] },
  );

  return null;
}
