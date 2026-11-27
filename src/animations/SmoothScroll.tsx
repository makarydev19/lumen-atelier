"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/* ------------------------------------------------------------------
   Module-level singleton so timelines (outside React) can reach Lenis.
   ------------------------------------------------------------------ */
let lenisInstance: Lenis | null = null;
const locks = new Set<string>();

export const getLenis = () => lenisInstance;

/**
 * Touch-first devices (phones, tablets) scroll natively. Lenis never smooths touch here
 * (`syncTouch: false`), so on those devices it only added cost: non-passive window
 * touchstart/touchmove listeners (every touch scroll waited on the main thread) and a class
 * rewrite on <html> at each scroll start/stop (a full-document style recalc).
 */
const TOUCH_MQ = "(hover: none) and (pointer: coarse)";
const isTouchDevice = () => typeof window !== "undefined" && window.matchMedia(TOUCH_MQ).matches;

/** expo.out — the anchor easing from §5.0. */
export const anchorEase = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
/** expo.inOut — Back to top (§5.7). */
export const expoInOut = (t: number) =>
  t === 0
    ? 0
    : t === 1
      ? 1
      : t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;

function applyLocks() {
  if (!lenisInstance) {
    // Native scroll (touch devices, reduced motion): lock with overflow instead.
    if (typeof document !== "undefined") document.documentElement.classList.toggle("scroll-locked", locks.size > 0);
    return;
  }
  if (locks.size > 0) lenisInstance.stop();
  else lenisInstance.start();
}

/** Stop smooth scroll while something (preloader, menu) owns the screen. Safe before Lenis exists. */
export function lockScroll(reason: string) {
  locks.add(reason);
  applyLocks();
}
export function unlockScroll(reason: string) {
  locks.delete(reason);
  applyLocks();
}

function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute("tabindex") && !el.matches("a[href],button,input,select,textarea")) {
    el.setAttribute("tabindex", "-1");
  }
  el.focus({ preventScroll: true });
}

/** Scroll to an element or y (Lenis when present, native otherwise) and move focus. */
export function scrollToTarget(
  target: HTMLElement | number,
  opts: { duration?: number; easing?: (t: number) => number; focus?: HTMLElement | null } = {},
) {
  const done = () => {
    const f = opts.focus ?? (typeof target === "number" ? null : target);
    if (f) focusTarget(f);
  };
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      duration: opts.duration ?? 1.6,
      easing: opts.easing ?? anchorEase,
      offset: 0,
      force: true,
      onComplete: done,
    });
  } else {
    const y = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
    // Touch devices without Lenis still get an eased jump; reduced motion jumps instantly.
    const smooth = !prefersReducedMotion() && Math.abs(window.scrollY - y) > 1;
    window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
    if (smooth && "onscrollend" in window) window.addEventListener("scrollend", done, { once: true });
    else done();
  }
}

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * §5.0 Lenis provider. Created once on mount (not for reduced motion or touch devices), bridged to the GSAP ticker
 * and ScrollTrigger. Handles in-page anchor clicks with an eased scroll + focus move.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Anchor clicks get an eased scroll + focus move on every device (Lenis or native smooth).
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href") ?? "";
      const target = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (!target) return;
      e.preventDefault();
      if (location.hash !== hash) history.pushState(null, "", hash);
      // Let the mobile menu close (and release its scroll lock) before scrolling.
      requestAnimationFrame(() => scrollToTarget(target));
    };
    document.addEventListener("click", onClick);

    if (isTouchDevice() || lenisInstance) {
      return () => document.removeEventListener("click", onClick);
    }

    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
      anchors: false,
      autoRaf: false,
    });
    lenisInstance = instance;
    document.documentElement.classList.remove("scroll-locked");
    applyLocks();

    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expose the instance created in this effect
    setLenis(instance);

    // Reduced-motion preference flipped at runtime → drop smooth scroll.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      if (mq.matches) {
        instance.destroy();
        gsap.ticker.remove(raf);
        if (lenisInstance === instance) lenisInstance = null;
        setLenis(null);
        applyLocks();
      }
    };
    mq.addEventListener("change", onMq);

    return () => {
      document.removeEventListener("click", onClick);
      mq.removeEventListener("change", onMq);
      gsap.ticker.remove(raf);
      instance.destroy();
      if (lenisInstance === instance) lenisInstance = null;
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
