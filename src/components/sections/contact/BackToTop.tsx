"use client";

import { ArrowUp } from "@/components/ui/Icons";
import { expoInOut, scrollToTarget } from "@/animations/SmoothScroll";

/** §5.7: Lenis scroll (2.2s expo.inOut) to the top, then focus the logo. Without Lenis (reduced motion) it jumps. */
export function BackToTop({ label = "Back to top" }: { label?: string }) {
  return (
    <button
      type="button"
      data-back-to-top=""
      data-magnetic=""
      data-cursor="link"
      className="u-link inline-flex min-h-11 items-center gap-2"
      onClick={() => {
        scrollToTarget(0, {
          duration: 2.2,
          easing: expoInOut,
          focus: document.querySelector<HTMLElement>("[data-logo]"),
        });
      }}
    >
      <span data-magnetic-inner="">{label}</span>
      <ArrowUp />
    </button>
  );
}
