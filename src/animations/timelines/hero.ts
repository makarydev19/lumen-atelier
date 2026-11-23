"use client";

import { gsap, $, $$ } from "../gsap";
import { whenIntro } from "../intro";
import { splitLines } from "../split";

const ARCH_HIDDEN = "inset(100% 0% 0% 0% round 999px 999px 0px 0px)";
const ARCH_SHOWN = "inset(0% 0% 0% 0% round 999px 999px 0px 0px)";

/**
 * §5.2 Hero: entrance after the curtain, scroll-out parallax, pointer-driven light shaft.
 * Media inner parallax is limited to yPercent 6 (desktop) / 3 (mobile): the inner only bleeds 8%
 * past the arch, and the spec's 12 would expose the frame edge.
 */
let entrancePlayed = false;

export function heroTimeline({ isDesktop }: { isDesktop: boolean }) {
  const hero = $("[data-hero]");
  if (!hero) return;
  const root = document.documentElement;
  const frame = $("[data-hero-media] .frame", hero);
  const inner = $("[data-hero-media] .frame-inner", hero);
  const h1 = $("h1", hero);
  const headlineBlock = $("[data-hero-headline]", hero);
  const fades = [...$$("[data-hero-fade]", hero), ...$$("[data-hero-media] figcaption", hero)];
  const cue = $("[data-scroll-cue-line]", hero);
  const shaft = $<SVGGElement>("g[data-shaft]", hero);

  // Initial states (set by JS only; html.js-intro CSS covers the first paint).
  // After a breakpoint change the context re-runs: do not replay the entrance.
  const playEntrance = !entrancePlayed;
  const split = h1 && playEntrance ? splitLines(h1) : null;
  const em = h1?.querySelector("em");
  const emLine = em ? (split?.lines.find((l) => l.contains(em)) ?? null) : null;
  if (playEntrance) {
    if (frame) gsap.set(frame, { clipPath: ARCH_HIDDEN, autoAlpha: 1 });
    if (inner) gsap.set(inner, { scale: 1.25 });
    if (split) gsap.set(split.lines, { yPercent: 110 });
    if (emLine) gsap.set(emLine, { skewX: -8, transformOrigin: "0% 100%" });
    gsap.set(fades, { y: 24, autoAlpha: 0 });
  }
  if (h1) gsap.set(h1, { autoAlpha: 1 });
  if (frame) gsap.set(frame, { autoAlpha: 1 });
  root.classList.remove("js-intro");

  const tl = gsap.timeline({ paused: true, onComplete: () => split?.revert() });
  if (playEntrance) {
    if (frame) tl.to(frame, { clipPath: ARCH_SHOWN, duration: 1.4, ease: "expo.out" }, 0);
    if (inner) tl.to(inner, { scale: 1, duration: 1.6, ease: "expo.out" }, 0);
    if (split) tl.to(split.lines, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.08 }, 0.15);
    if (emLine) tl.to(emLine, { skewX: 0, duration: 1.0, ease: "expo.out" }, 0.45);
    tl.to(fades, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.5);
  }
  // Scroll cue loop starts once the entrance has settled.
  const cueLoop = cue
    ? gsap
        .timeline({ paused: true, repeat: -1, repeatDelay: 0.4 })
        .fromTo(cue, { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.8, ease: "power2.inOut" })
        .set(cue, { transformOrigin: "50% 100%" })
        .to(cue, { scaleY: 0, duration: 0.8, ease: "power2.inOut" })
    : null;
  if (cueLoop) tl.call(() => void cueLoop.play(), [], playEntrance ? 1.4 : 0);

  let alive = true;
  whenIntro().then(() => {
    if (!alive) return;
    entrancePlayed = true;
    tl.play();
  });

  // Scroll-out scrub.
  const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true } as const;
  if (inner) gsap.fromTo(inner, { yPercent: 0 }, { yPercent: isDesktop ? 6 : 3, ease: "none", scrollTrigger: scrub });
  if (headlineBlock && isDesktop) {
    gsap.fromTo(headlineBlock, { yPercent: 0, autoAlpha: 1 }, { yPercent: -18, autoAlpha: 0.2, ease: "none", scrollTrigger: scrub });
  }

  // Pointer-driven light shaft (desktop).
  let onMove: ((e: PointerEvent) => void) | null = null;
  if (isDesktop && shaft) {
    gsap.set(shaft, { svgOrigin: "580 240" });
    const rot = gsap.quickTo(shaft, "rotation", { duration: 1.2, ease: "power3.out" });
    onMove = (e: PointerEvent) => rot(((e.clientX / window.innerWidth) * 2 - 1) * 2);
    hero.addEventListener("pointermove", onMove);
  }

  return () => {
    alive = false;
    if (onMove) hero.removeEventListener("pointermove", onMove);
    split?.revert();
  };
}
