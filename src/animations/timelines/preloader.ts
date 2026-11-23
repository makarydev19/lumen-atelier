"use client";

import { gsap, SplitText, $, fontsReady, prefersReducedMotion } from "../gsap";
import { fireIntro } from "../intro";
import { lockScroll, unlockScroll } from "../SmoothScroll";

const KEY = "la-loaded";

function seen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage blocked: preloader simply shows again next time */
  }
}

/** Fraction of a power2.inOut tween at which the output reaches `v` (v > 0.5). */
const power2InOutAt = (v: number) => 1 - Math.sqrt(2 * (1 - v)) / 2;

/**
 * §5.1 Preloader → curtain. Call inside a gsap context (useGSAP). Fires the hero intro
 * (via `fireIntro`) at t = 2.95s, or after 0.2s on later visits in the session.
 */
export function runPreloader() {
  const root = document.documentElement;
  const overlay = $("[data-preloader]");
  const main = document.getElementById("main");
  const reduce = prefersReducedMotion();

  if (!overlay || seen()) {
    root.classList.remove("js-preload");
    gsap.delayedCall(0.2, fireIntro);
    return;
  }

  // Show the overlay (the inline head script already did for first paint).
  overlay.hidden = false;
  root.classList.add("js-preload");
  main?.setAttribute("inert", "");
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  lockScroll("preloader");

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    overlay.hidden = true;
    gsap.set(overlay, { clearProps: "all" });
    root.classList.remove("js-preload");
    main?.removeAttribute("inert");
    unlockScroll("preloader");
    markSeen();
    fireIntro();
  };

  if (reduce) {
    // Reduced motion: logo for 0.4s, then a 0.3s fade. Content underneath is already visible.
    gsap.timeline({ onComplete: finish }).to(overlay, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0.4);
    return finish;
  }

  const logo = $("[data-preloader-logo]", overlay);
  const counter = $("[data-preloader-counter]", overlay);
  const fill = $("[data-preloader-fill]", overlay);
  const label = $("[data-preloader-label]", overlay);
  const edge = $("[data-preloader-edge]", overlay);

  const logoSplit = logo ? SplitText.create(logo, { type: "chars", mask: "chars", aria: "none" }) : null;
  const count = { v: 0 };
  let fontsDone = false;
  const fonts = fontsReady(3000).then(() => {
    fontsDone = true;
  });

  const tl = gsap.timeline({ onComplete: finish });
  tl.set(overlay, { clipPath: "inset(0% 0% 0% 0%)" });
  if (logoSplit) {
    tl.from(logoSplit.chars, { yPercent: 100, autoAlpha: 0, duration: 0.9, ease: "expo.out", stagger: 0.025 }, 0);
  }
  if (label) tl.from(label, { autoAlpha: 0, duration: 0.6, ease: "power3.out" }, 0.1);
  tl.to(
    count,
    {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter) counter.textContent = String(Math.round(count.v)).padStart(3, "0");
      },
    },
    0.2,
  );
  if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power2.inOut", transformOrigin: "left center" }, 0.2);
  // Gate: hold at 90 until fonts are ready.
  tl.call(
    () => {
      if (!fontsDone) {
        tl.pause();
        fonts.then(() => tl.play());
      }
    },
    [],
    0.2 + power2InOutAt(0.9) * 1.8,
  );
  tl.to([counter, logo, label].filter(Boolean), { yPercent: -110, autoAlpha: 0, duration: 0.6, ease: "power3.in", stagger: 0.05 }, 2.1);
  tl.to(overlay, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" }, 2.5);
  if (edge) tl.fromTo(edge, { scaleX: 0.2 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 2.5);
  tl.call(fireIntro, [], 2.95);
  tl.set({}, {}, 3.7);

  // Safety net: never keep the page covered for long (e.g. a stalled font request).
  const safety = gsap.delayedCall(7, () => tl.progress(1));

  return () => {
    safety.kill();
    finish();
  };
}
