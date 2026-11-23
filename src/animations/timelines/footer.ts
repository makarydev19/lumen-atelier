"use client";

import { gsap, SplitText, $, $$ } from "../gsap";
import { lineReveal } from "../split";

/** §5.7 Contact footer: headline lines, fades, dusk glow scrub, giant wordmark rise + hover lift. */
export function footerTimeline({ isDesktop }: { isDesktop: boolean }) {
  const footer = $("footer#contact");
  if (!footer) return;

  const eyebrow = $("[data-eyebrow]", footer);
  if (eyebrow) {
    gsap.from(eyebrow, {
      y: 16,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: footer, start: "top 70%", once: true },
    });
  }
  lineReveal($("#contact-title", footer), { trigger: footer, start: "top 70%", duration: 1.2 });
  const fades = $$("[data-contact-fade]", footer);
  if (fades.length) {
    // opacity (not autoAlpha): visibility:hidden would drop the links from the tab order
    // until the footer has been scrolled into view.
    gsap.from(fades, {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.06,
      delay: 0.3,
      scrollTrigger: { trigger: footer, start: "top 70%", once: true },
    });
  }

  const dusk = $("[data-dusk]", footer);
  if (dusk) {
    gsap.fromTo(
      dusk,
      { opacity: 0, yPercent: 20 },
      {
        opacity: 1,
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: footer, start: "top bottom", end: "max", scrub: true },
      },
    );
  }

  const mark = $("[data-wordmark]", footer);
  const mask = $("[data-wordmark-mask]", footer);
  if (!mark || !mask) return;
  const split = SplitText.create(mark, { type: "chars", charsClass: "split-char", aria: "none" });
  const chars = split.chars as HTMLElement[];
  gsap.fromTo(
    chars,
    { yPercent: 100 },
    {
      yPercent: 0,
      ease: "none",
      stagger: { each: 0.04, from: "center" },
      // "max": rest is reached exactly at the page bottom, whatever reflowed above.
      scrollTrigger: { trigger: mark, start: "top bottom", end: "max", scrub: 0.8 },
    },
  );

  if (!isDesktop || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  // Hover lift: nearest char −6%, neighbours −3% (as `y`, so it never fights the yPercent scrub).
  const lifts = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.5, ease: "power3.out" }));
  let lit = -1;
  const tint = (i: number, color: string) => gsap.to(chars[i], { color, duration: 0.5, ease: "power3.out" });
  const onMove = (e: PointerEvent) => {
    let nearest = 0;
    let best = Infinity;
    chars.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    const h = chars[nearest].offsetHeight;
    chars.forEach((_, i) => {
      const dist = Math.abs(i - nearest);
      lifts[i](dist === 0 ? -0.06 * h : dist === 1 ? -0.03 * h : 0);
    });
    if (lit !== nearest) {
      if (lit >= 0) tint(lit, "#F3EEE6");
      tint(nearest, "#D9A07F");
      lit = nearest;
    }
  };
  const onLeave = () => {
    lifts.forEach((l) => l(0));
    if (lit >= 0) tint(lit, "#F3EEE6");
    lit = -1;
  };
  mask.addEventListener("pointermove", onMove);
  mask.addEventListener("pointerleave", onLeave);
  return () => {
    mask.removeEventListener("pointermove", onMove);
    mask.removeEventListener("pointerleave", onLeave);
  };
}
