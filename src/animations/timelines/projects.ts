"use client";

import { gsap, $, $$ } from "../gsap";
import { createDigitSwap, fadeUp, lineReveal } from "../split";
import { getLenis } from "../SmoothScroll";
import { MAX_PARALLAX, WINDOW_FROM, WINDOW_TO, windowReveal } from "./shared";

/**
 * §5.4 Selected projects. ≥768px: pinned horizontal track driven by vertical scroll,
 * per-card window reveal / parallax / text via containerAnimation, progress + counter.
 * <768px: vertical list, window reveal on vertical scroll.
 */
export function projectsTimeline({ pin }: { pin: boolean }) {
  const section = $("#work");
  if (!section) return;
  const pinEl = $("[data-pin]", section);
  const viewport = $("[data-gallery-viewport]", section);
  const track = $("[data-track]", section);
  const header = $("[data-gallery-header]", section);
  const cards = $$("li[data-card]:not([data-end-card])", section);
  const endCard = $("[data-end-card]", section);
  if (!pinEl || !viewport || !track) return;

  // Header entrance (before the pin).
  if (header) {
    fadeUp($("[data-eyebrow]", header), { trigger: header, start: "top 70%", y: 16, duration: 0.8 });
    lineReveal($$("[data-anim='lines']", header), { trigger: header, start: "top 70%", duration: 1.1 });
  }

  if (!pin) {
    cards.forEach((card) => {
      const frame = $(".frame[data-anim='window']", card);
      if (frame) windowReveal(frame, { mode: "scrub" });
      fadeUp($$("[data-card-text]", card), { trigger: card, start: "top 75%", stagger: 0.06, duration: 0.8 });
    });
    if (endCard) fadeUp($$("[data-card-text]", endCard), { trigger: endCard, start: "top 85%", stagger: 0.06 });
    return;
  }

  // Pinned mode: the viewport must not clip or scroll; the region leaves the tab order
  // (cards stay focusable and focusing one scrolls it into view, see below).
  const prevTab = viewport.getAttribute("tabindex");
  gsap.set(viewport, { overflow: "visible" });
  viewport.removeAttribute("tabindex");
  viewport.scrollLeft = 0;

  // Counter digit swap (driven by the pin's onUpdate below).
  const counterCur = $("[data-counter-current]", section);
  const counterNext = $("[data-counter-next]", section);
  const swap = counterCur && counterNext ? createDigitSwap(counterCur, counterNext, 0.5) : null;

  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const leftInTrack = (el: HTMLElement) => el.offsetLeft - track.offsetLeft;
  const progressFill = $("[data-progress-fill]", section);
  const setProgress = progressFill ? gsap.quickSetter(progressFill, "scaleX") : null;

  const containerTween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + distance(),
      pin: pinEl,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        setProgress?.(self.progress);
        // Counter follows the track: card N is "current" as it nears the centre; the last card
        // can never reach the exact centre (the track ends), so progress maps onto 01…05.
        swap?.(String(Math.round(self.progress * (cards.length - 1)) + 1).padStart(2, "0"), self.direction === -1 ? -1 : 1);
      },
    },
  });
  if (progressFill) gsap.set(progressFill, { scaleX: 0, transformOrigin: "0% 50%" });

  cards.forEach((card) => {
    const frame = $(".frame[data-anim='window']", card);
    const inner = $(".frame-inner", card);
    if (frame) {
      gsap.fromTo(
        frame,
        { clipPath: WINDOW_FROM },
        {
          clipPath: WINDOW_TO,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: containerTween,
            start: "left 95%",
            // "left 45%", unless the track ends before this card gets there (last card).
            end: () => `left ${Math.max(45, ((leftInTrack(card) - distance()) / window.innerWidth) * 100 + 3)}%`,
            scrub: true,
          },
        },
      );
    }
    if (inner) {
      gsap.fromTo(
        inner,
        { xPercent: -MAX_PARALLAX },
        {
          xPercent: MAX_PARALLAX,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: containerTween, start: "left right", end: "right left", scrub: true },
        },
      );
    }
    gsap.from($$("[data-card-text]", card), {
      y: 24,
      opacity: 0, // not autoAlpha: keeps the end card link in the tab order
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: {
        trigger: card,
        containerAnimation: containerTween,
        start: "left 80%",
        toggleActions: "play none none reverse",
      },
    });
  });
  if (endCard) {
    gsap.from($$("[data-card-text]", endCard), {
      y: 24,
      opacity: 0, // not autoAlpha: keeps the end card link in the tab order
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: { trigger: endCard, containerAnimation: containerTween, start: "left 85%", toggleActions: "play none none reverse" },
    });
  }

  // Keyboard: focusing a card (Tab) scrolls the page to the position that brings it into view.
  const padLeft = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const onFocusIn = (e: FocusEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("li[data-card]");
    const st = containerTween.scrollTrigger;
    if (!card || !st) return;
    const x = Math.min(distance(), Math.max(0, leftInTrack(card) - padLeft()));
    const y = st.start + x;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
    containerTween.scrollTrigger?.update();
    viewport.scrollLeft = 0;
  };
  track.addEventListener("focusin", onFocusIn);

  return () => {
    track.removeEventListener("focusin", onFocusIn);
    if (prevTab !== null) viewport.setAttribute("tabindex", prevTab);
  };
}
