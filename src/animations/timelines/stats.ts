"use client";

import { gsap, $, $$ } from "../gsap";
import { fadeUp, lineReveal } from "../split";

/**
 * §5.6 Studio stats. Final numbers are server-rendered; JS zeroes them right before the
 * count-up (the visible numerals are aria-hidden, an sr-only copy holds the value).
 */
export function statsTimeline() {
  const section = $("#studio");
  if (!section) return;

  fadeUp($("[data-eyebrow]", section), { trigger: section, start: "top 75%", y: 16, duration: 0.8 });
  lineReveal([$("#studio-title", section), $("p[data-anim='lines']", section)].filter(Boolean) as HTMLElement[], {
    trigger: section,
    start: "top 75%",
  });

  const dl = $("dl", section);
  const nums = $$("[data-anim='count']", section);
  const rules = $$("[data-stat-rule]", section);
  const labels = $$("[data-stat-label]", section);
  if (!dl || nums.length === 0) return;

  const tl = gsap.timeline({ scrollTrigger: { trigger: dl, start: "top 80%", once: true } });
  nums.forEach((el, i) => {
    const to = Number(el.dataset.countTo ?? el.textContent ?? 0);
    const obj = { v: 0 };
    el.textContent = "0";
    tl.to(
      obj,
      {
        v: to,
        duration: 1.8,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
        onComplete: () => {
          el.textContent = String(to);
        },
      },
      i * 0.12,
    );
  });
  if (rules.length) tl.from(rules, { scaleY: 0, transformOrigin: "50% 0%", duration: 1.0, ease: "expo.out", stagger: 0.12 }, 0);
  if (labels.length) tl.from(labels, { y: 12, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }, 0.3);

  // If the context is reverted mid-count, restore the real values.
  return () => nums.forEach((el) => (el.textContent = el.dataset.countTo ?? el.textContent));
}

export function recognitionTimeline() {
  const rows = $$("li[data-award]");
  if (rows.length === 0) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: rows[0], start: "top 85%", once: true } });
  tl.from(
    rows.map((r) => $("[data-rule]", r)).filter(Boolean),
    { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, ease: "expo.out", stagger: 0.08 },
    0,
  );
  tl.from(
    rows.map((r) => $$("[data-award-text]", r)),
    { y: 16, autoAlpha: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 },
    0.05,
  );
}
