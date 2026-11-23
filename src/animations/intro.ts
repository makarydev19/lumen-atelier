"use client";

/**
 * Tiny bus between the preloader and the hero entrance (§5.1 t=2.95 → §5.2).
 * `whenIntro()` resolves once the curtain is far enough up for the hero to enter.
 */
let resolveIntro: (() => void) | null = null;
let introPromise: Promise<void> | null = null;

function ensure() {
  if (!introPromise) {
    introPromise = new Promise<void>((r) => {
      resolveIntro = r;
    });
  }
  return introPromise;
}

export function whenIntro(): Promise<void> {
  return ensure();
}

export function fireIntro() {
  ensure();
  resolveIntro?.();
}
