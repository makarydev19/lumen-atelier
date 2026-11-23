"use client";

import { gsap, SplitText, $, $$ } from "../gsap";
import { fadeUp, lineReveal } from "../split";
import { windowReveal } from "./shared";

/**
 * §5.3 Philosophy: word-by-word scrubbed statement (pinned on desktop), eyebrow, rule,
 * side-note line reveals, beam vignette window reveal + parallax.
 */
export function philosophyTimeline({ isDesktop }: { isDesktop: boolean }) {
  const section = $("[data-pin-section='philosophy']");
  if (!section) return;
  const statement = $("h2[data-anim='words-scrub']", section);
  const eyebrow = $("[data-eyebrow]", section);
  const rule = $("[data-rule]", section);
  const notes = $$("[data-anim='lines']", section);
  const beam = $(".frame[data-anim='window']", section);

  if (statement) {
    const split = SplitText.create(statement, { type: "words", wordsClass: "split-word", aria: "auto" });
    const ems = split.words.filter((w) => w.closest("em"));
    const tl = gsap.timeline({
      scrollTrigger: isDesktop
        ? {
            trigger: statement,
            // Centre the statement while pinned; tall statements start a little under the header.
            start: () => (statement.offsetHeight > window.innerHeight * 0.8 ? "top 12%" : "center center"),
            end: "+=150%",
            pin: section,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        : { trigger: statement, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
    });
    tl.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: 0.1, duration: 0.5 }, 0);
    if (ems.length) {
      // Accent words rise from graphite to terracotta as they light up.
      const at = split.words.indexOf(ems[0]) * 0.1;
      tl.fromTo(ems, { color: "#5C564E" }, { color: "#B4532F", ease: "none", duration: 0.5 }, at);
    }
  }

  fadeUp(eyebrow, { trigger: section, start: "top 80%", y: 16, duration: 0.8 });
  if (rule) {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "0% 50%",
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: rule, start: "top 85%", once: true },
    });
  }
  if (notes.length) lineReveal(notes, { trigger: notes[0], start: "top 85%", duration: 0.9, stagger: 0.06, yPercent: 100 });
  // Beam parallax comes from its data-speed (timelines/parallax.ts).
  if (beam) windowReveal(beam, { mode: "enter", parallax: 0 });
}
