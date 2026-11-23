"use client";

import { gsap, $$ } from "../gsap";
import { MAX_PARALLAX } from "./shared";

/**
 * Generic `data-speed` parallax for media inners (§3 naming convention). Speed < 1 moves the
 * inner against the scroll; travel = (1 − speed) × 60 %, clamped to the 8% bleed of the inner.
 * The hero and the project cards have their own choreography and are skipped here.
 */
export function parallaxSpeeds() {
  $$(".frame-inner[data-speed]")
    .filter((el) => !el.closest("[data-hero], [data-card]"))
    .forEach((inner) => {
      const speed = parseFloat(inner.dataset.speed ?? "1");
      const amp = Math.min(MAX_PARALLAX, Math.abs(1 - speed) * 60);
      if (!amp) return;
      const frame = inner.parentElement ?? inner;
      gsap.fromTo(
        inner,
        { yPercent: -amp },
        { yPercent: amp, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
}
