"use client";

import { gsap, ScrollTrigger, $, $$ } from "../gsap";
import { createDigitSwap, fadeUp, lineReveal } from "../split";

type Layer = { g: SVGGElement; strokes: SVGGeometryElement[]; fills: SVGElement[]; fades: SVGElement[] };

function readLayers(svg: SVGSVGElement | null): Layer[] {
  if (!svg) return [];
  return $$<SVGGElement>("g[data-layer]", svg).map((g) => ({
    g,
    strokes: $$<SVGGeometryElement>("[pathLength]", g),
    fills: $$<SVGElement>("[data-fill]", g),
    fades: $$<SVGElement>("[data-sunpath], text", g),
  }));
}

/**
 * §5.5 Process. Desktop: CSS-sticky left column; step triggers drive the giant numeral,
 * the label list, and the progressive ProcessVisual layers. Mobile: composite visual draws once.
 */
export function processTimeline({ isDesktop }: { isDesktop: boolean }) {
  const section = $("#process");
  if (!section) return;
  const steps = $$("li[data-step]", section);
  const stepsWrap = $("ol[data-steps]", section);

  // Header + intro (both breakpoints).
  fadeUp($("[data-eyebrow]", section), { trigger: section, start: "top 75%", y: 16, duration: 0.8 });
  lineReveal([$("#process-title", section), $("p.t-lead[data-anim='lines']", section)].filter(Boolean) as HTMLElement[], {
    trigger: section,
    start: "top 75%",
  });

  // Step content fade-up.
  steps.forEach((step) => {
    const items = $$("[data-step-content]", step);
    const tags = $$("[data-tag]", step);
    const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 75%", once: true } });
    tl.from(items, { y: 32, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 }, 0);
    if (tags.length) tl.from(tags, { y: 12, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0.3);
  });

  if (!isDesktop) {
    const svg = $<SVGSVGElement>("svg[data-process-visual][data-mode='composite']", section);
    const layers = readLayers(svg);
    if (!svg || layers.length === 0) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 70%", once: true } });
    layers.forEach((l, i) => {
      const at = i * 0.4;
      if (l.strokes.length) {
        tl.fromTo(l.strokes, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.04 }, at);
      }
      if (l.fills.length) {
        tl.from(l.fills, { autoAlpha: 0, scale: 0.9, transformOrigin: "50% 50%", duration: 0.6, ease: "power3.out" }, at + 0.4);
      }
      if (l.fades.length) tl.from(l.fades, { autoAlpha: 0, duration: 0.6, ease: "power3.out" }, at + 0.2);
    });
    return;
  }

  // ---------- Desktop ----------
  const svg = $<SVGSVGElement>("svg[data-process-visual][data-mode='progressive']", section);
  const layers = readLayers(svg);
  const numCur = $("[data-numeral-current]", section);
  const numNext = $("[data-numeral-next]", section);
  const swap = numCur && numNext ? createDigitSwap(numCur, numNext, 0.7, "expo.out") : null;
  const labels = $$("[data-step-label]", section);
  const progress = $("[data-process-progress-fill]", section);

  // Initial visual state: nothing drawn until step 1 becomes active.
  layers.forEach((l) => {
    gsap.set(l.g, { opacity: 0 });
    if (l.strokes.length) gsap.set(l.strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    if (l.fills.length) gsap.set(l.fills, { autoAlpha: 0, scale: 0.9, transformOrigin: "50% 50%" });
    if (l.fades.length) gsap.set(l.fades, { autoAlpha: 0 });
  });

  const drawn = new Set<number>();
  const draw = (i: number) => {
    const l = layers[i];
    if (!l || drawn.has(i)) return;
    drawn.add(i);
    gsap.to(l.g, { opacity: 1, duration: 0.4, overwrite: true });
    if (l.strokes.length) gsap.to(l.strokes, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.04, overwrite: true });
    if (l.fills.length) gsap.to(l.fills, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.3, overwrite: true });
    if (l.fades.length) gsap.to(l.fades, { autoAlpha: 1, duration: 0.6, ease: "power3.out", delay: 0.2, overwrite: true });
  };
  const undraw = (i: number) => {
    const l = layers[i];
    if (!l || !drawn.has(i)) return;
    drawn.delete(i);
    gsap.to(l.g, {
      opacity: 0,
      duration: 0.4,
      overwrite: true,
      onComplete: () => {
        if (l.strokes.length) gsap.set(l.strokes, { strokeDashoffset: 1, overwrite: true });
        if (l.fills.length) gsap.set(l.fills, { autoAlpha: 0, scale: 0.9, overwrite: true });
        if (l.fades.length) gsap.set(l.fades, { autoAlpha: 0, overwrite: true });
      },
    });
  };

  let active = 0; // 1-based; 0 = none yet
  const setActive = (n: number) => {
    if (n === active || n < 1) return;
    const dir: 1 | -1 = n > active ? 1 : -1;
    active = n;
    swap?.(String(n).padStart(2, "0"), dir);
    labels.forEach((label, i) => {
      const on = i === n - 1;
      label.dataset.active = on ? "true" : "false";
      const dot = $("[data-step-dot]", label);
      if (dot) gsap.to(dot, { scale: on ? 1 : 0, duration: 0.3, ease: "power3.out", overwrite: true });
    });
    layers.forEach((l, i) => {
      if (i < n - 1) {
        draw(i);
        gsap.to(l.g, { opacity: 0.25, duration: 0.6, overwrite: true });
      } else if (i === n - 1) {
        draw(i);
        gsap.to(l.g, { opacity: 1, duration: 0.6, overwrite: "auto" });
      } else {
        undraw(i);
      }
    });
  };
  // Dots: GSAP owns the scale (classes reset to a neutral transform).
  labels.forEach((label) => {
    const dot = $("[data-step-dot]", label);
    if (!dot) return;
    dot.classList.remove("scale-0", "scale-100");
    gsap.set(dot, { scale: 0 });
  });

  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 55%",
      end: "bottom 55%",
      onToggle: (self) => {
        if (self.isActive) setActive(i + 1);
      },
    });
  });
  // Entering the section from above activates step 1 (draws the first layer).
  ScrollTrigger.create({ trigger: section, start: "top 60%", onEnter: () => setActive(1) });

  if (progress && stepsWrap) {
    gsap.fromTo(
      progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "50% 0%",
        scrollTrigger: { trigger: stepsWrap, start: "top 55%", end: "bottom 55%", scrub: 0.5 },
      },
    );
  }

  return () => {
    labels.forEach((label, i) => {
      label.dataset.active = i === 0 ? "true" : "false";
      $("[data-step-dot]", label)?.classList.add(i === 0 ? "scale-100" : "scale-0");
    });
  };
}
