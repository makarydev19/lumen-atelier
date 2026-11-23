"use client";

import { gsap } from "../gsap";

/** §5.4 signature clip: a small arched window that grows into the full frame. Same value count both ends. */
export const WINDOW_FROM = "inset(14% 20% 14% 20% round 999px 999px 0px 0px)";
export const WINDOW_TO = "inset(0% 0% 0% 0% round 0px 0px 0px 0px)";

/**
 * Max parallax travel (in % of the 116% inner) before the frame edge shows: the inner bleeds 8%
 * on each side, 8 / 1.16 ≈ 6.9, so amplitudes are clamped to 6.
 */
export const MAX_PARALLAX = 6;

/** Vertical-scroll window reveal + inner parallax (beam vignette, mobile project cards). */
export function windowReveal(
  frame: HTMLElement,
  { mode = "scrub", parallax = MAX_PARALLAX }: { mode?: "scrub" | "enter"; parallax?: number } = {},
) {
  if (mode === "scrub") {
    gsap.fromTo(
      frame,
      { clipPath: WINDOW_FROM },
      { clipPath: WINDOW_TO, ease: "none", scrollTrigger: { trigger: frame, start: "top 90%", end: "top 40%", scrub: true } },
    );
  } else {
    gsap.fromTo(
      frame,
      { clipPath: WINDOW_FROM },
      { clipPath: WINDOW_TO, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: frame, start: "top 85%", once: true } },
    );
  }
  const inner = frame.querySelector<HTMLElement>(".frame-inner");
  const amp = Math.min(parallax, MAX_PARALLAX);
  if (inner && amp > 0) {
    gsap.fromTo(
      inner,
      { yPercent: -amp },
      { yPercent: amp, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
    );
  }
}
