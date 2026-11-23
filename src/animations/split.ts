"use client";

import { gsap, ScrollTrigger, SplitText } from "./gsap";

/** Re-measure triggers if reverting a split changed layout height (debounced). */
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
function refreshSoon() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
}

type LineRevealOptions = {
  /** ScrollTrigger trigger; omit to return a paused-free tween for a timeline. */
  trigger?: Element | null;
  start?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  yPercent?: number;
};

/**
 * Masked SplitText line reveal (§5). Lines slide up out of their masks; the split is
 * reverted when the reveal ends so later resizes re-flow the real text (no stale lines).
 * SplitText `aria: "auto"` puts the plain text on the element and hides the line wrappers.
 */
export function splitLines(el: Element) {
  const create = () => SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line", aria: "auto" });
  // SplitText breaks lines at every <br>, even responsive ones hidden with `display: none`
  // (renderRich's `hidden lg:inline`). Below lg that forced extra lines while split and the
  // heading jumped back to its natural wrap on revert (layout shift). Drop hidden <br>s for
  // the split and restore the original markup on revert.
  const hiddenBrs = Array.from(el.querySelectorAll("br")).filter((br) => getComputedStyle(br).display === "none");
  if (hiddenBrs.length === 0) return create();
  const html = el.innerHTML;
  hiddenBrs.forEach((br) => br.remove());
  const split = create();
  const revert = split.revert.bind(split);
  split.revert = () => {
    revert();
    el.innerHTML = html;
    return split;
  };
  return split;
}

export function lineReveal(targets: Element | Element[] | null | undefined, opts: LineRevealOptions = {}) {
  const els = (Array.isArray(targets) ? targets : targets ? [targets] : []).filter(Boolean);
  if (els.length === 0) return null;
  const splits = els.map(splitLines);
  const lines = splits.flatMap((s) => s.lines);
  gsap.set(els, { autoAlpha: 1 });
  return gsap.from(lines, {
    yPercent: opts.yPercent ?? 110,
    duration: opts.duration ?? 1.1,
    ease: "expo.out",
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.trigger
      ? { trigger: opts.trigger, start: opts.start ?? "top 75%", once: true }
      : undefined,
    onComplete: () => {
      const before = els.map((el) => (el as HTMLElement).offsetHeight);
      splits.forEach((s) => s.revert());
      if (els.some((el, i) => (el as HTMLElement).offsetHeight !== before[i])) refreshSoon();
    },
  });
}

/**
 * y/opacity fade-up on enter (generic `data-anim="fade-up"` recipe). Opacity rather than
 * autoAlpha, so links inside stay in the tab order (focusing one scrolls it in and reveals it).
 */
export function fadeUp(
  targets: Element[] | Element | null | undefined,
  opts: { trigger?: Element | null; start?: string; y?: number; delay?: number; stagger?: number; duration?: number } = {},
) {
  const els = (Array.isArray(targets) ? targets : targets ? [targets] : []).filter(Boolean);
  if (els.length === 0) return null;
  return gsap.from(els, {
    y: opts.y ?? 24,
    opacity: 0,
    duration: opts.duration ?? 0.9,
    ease: "power3.out",
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.trigger ? { trigger: opts.trigger, start: opts.start ?? "top 80%", once: true } : undefined,
  });
}

/**
 * Two-span digit swap inside a 1-line mask (gallery counter, process numeral).
 * `next` sits at top:100% of the mask. Direction 1 = forward (rolls up), -1 = back (rolls down).
 */
export function createDigitSwap(current: HTMLElement, next: HTMLElement, duration = 0.5, ease = "power3.out") {
  let tl: gsap.core.Timeline | null = null;
  let value = current.textContent ?? "";
  return (text: string, dir: 1 | -1 = 1) => {
    if (text === value) return;
    tl?.progress(1);
    value = text;
    next.textContent = text;
    tl = gsap
      .timeline({
        onComplete: () => {
          current.textContent = text;
          gsap.set([current, next], { yPercent: 0 });
        },
      })
      .fromTo(current, { yPercent: 0 }, { yPercent: dir === 1 ? -100 : 100, duration, ease }, 0)
      .fromTo(next, { yPercent: dir === 1 ? 0 : -200 }, { yPercent: -100, duration, ease }, 0);
  };
}
