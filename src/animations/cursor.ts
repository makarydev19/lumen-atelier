"use client";

import { gsap, $, $$ } from "./gsap";

type CursorState = "default" | "link" | "view" | "hide";
const SCALE: Record<CursorState, number> = { default: 0.096, link: 0.423, view: 1, hide: 0 };

/**
 * §5.0 custom cursor + magnetic elements + pointer-origin button fill.
 * Run only under (hover: hover) and (pointer: fine) without reduced motion (inside a gsap context).
 */
export function setupCursor() {
  const root = document.documentElement;
  const cursor = $(".cursor");
  const disc = $(".cursor-disc", cursor ?? document);
  const label = $(".cursor-label", cursor ?? document);
  if (!cursor || !disc || !label) return;

  root.classList.add("has-cursor");
  cursor.dataset.state = "default";
  gsap.set(cursor, { autoAlpha: 0 });
  gsap.set(disc, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: SCALE.default });
  gsap.set(label, { autoAlpha: 0, y: 8 });

  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

  let state: CursorState = "default";
  let pressed = false;
  let visible = false;

  const applyState = (next: CursorState, text?: string) => {
    if (next === state && !text) return;
    state = next;
    // Fill / ring colours transition in CSS (they follow --page-fg); GSAP owns the scale.
    cursor.dataset.state = next;
    gsap.to(disc, {
      scale: SCALE[next] * (pressed ? 0.85 : 1),
      duration: 0.48,
      ease: "power3.out",
      overwrite: "auto",
    });
    if (next === "view") {
      if (text) label.textContent = text;
      gsap.to(label, { autoAlpha: 1, y: 0, duration: 0.3, delay: 0.08, ease: "power3.out", overwrite: true });
    } else {
      gsap.to(label, { autoAlpha: 0, y: 8, duration: 0.2, ease: "power3.out", overwrite: true });
    }
  };

  const stateFor = (el: Element | null): [CursorState, string | undefined] => {
    const target = el?.closest<HTMLElement>("[data-cursor], a, button");
    if (!target) return ["default", undefined];
    const attr = target.dataset.cursor as CursorState | undefined;
    if (attr === "view") return ["view", target.dataset.cursorLabel ?? "View"];
    if (attr === "hide") return ["hide", undefined];
    return ["link", undefined];
  };

  // Magnetic elements (header CTA, hero CTA, footer email + button, Back to top).
  const magnets = $$("[data-magnetic]").map((el) => {
    const inner = $("[data-magnetic-inner]", el);
    const strength = parseFloat(el.dataset.magnetic || "") || 0.35;
    return {
      el,
      inner,
      strength,
      x: gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" }),
      ix: inner ? gsap.quickTo(inner, "x", { duration: 0.4, ease: "power3.out" }) : null,
      iy: inner ? gsap.quickTo(inner, "y", { duration: 0.4, ease: "power3.out" }) : null,
      active: false,
    };
  });
  const PAD = 24;

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    let tx = e.clientX;
    let ty = e.clientY;
    for (const m of magnets) {
      // Bounds without the current magnetic offset.
      const r = m.el.getBoundingClientRect();
      const ox = Number(gsap.getProperty(m.el, "x")) || 0;
      const oy = Number(gsap.getProperty(m.el, "y")) || 0;
      const left = r.left - ox;
      const top = r.top - oy;
      const inside =
        r.width > 0 &&
        e.clientX > left - PAD &&
        e.clientX < left + r.width + PAD &&
        e.clientY > top - PAD &&
        e.clientY < top + r.height + PAD;
      if (inside) {
        const cx = left + r.width / 2;
        const cy = top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        m.active = true;
        m.x(dx * m.strength);
        m.y(dy * m.strength);
        m.ix?.(dx * m.strength * 0.15);
        m.iy?.(dy * m.strength * 0.15);
        tx = e.clientX + (cx - e.clientX) * 0.4;
        ty = e.clientY + (cy - e.clientY) * 0.4;
      } else if (m.active) {
        m.active = false;
        gsap.to(m.el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: true });
        if (m.inner) gsap.to(m.inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: true });
      }
    }
    xTo(tx);
    yTo(ty);
    if (!visible) {
      visible = true;
      gsap.set(cursor, { x: tx, y: ty });
      gsap.to(cursor, { autoAlpha: 1, duration: 0.24, ease: "power3.out" });
    }
  };

  const onOver = (e: PointerEvent) => {
    const [s, text] = stateFor(e.target as Element);
    applyState(s, text);
    // Pointer-origin fill for pill buttons (§5.8).
    const btn = (e.target as Element).closest<HTMLElement>(".btn");
    if (btn && !(e.relatedTarget instanceof Node && btn.contains(e.relatedTarget))) {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
      btn.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
    }
  };
  const onDown = () => {
    pressed = true;
    gsap.to(disc, { scale: SCALE[state] * 0.85, duration: 0.15, ease: "power3.out", overwrite: "auto" });
  };
  const onUp = () => {
    pressed = false;
    gsap.to(disc, { scale: SCALE[state], duration: 0.15, ease: "power3.out", overwrite: "auto" });
  };
  const onLeaveWindow = (e: MouseEvent) => {
    if (e.relatedTarget) return;
    visible = false;
    gsap.to(cursor, { autoAlpha: 0, duration: 0.24, ease: "power3.out" });
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver);
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  document.addEventListener("mouseout", onLeaveWindow);

  return () => {
    root.classList.remove("has-cursor");
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    document.removeEventListener("mouseout", onLeaveWindow);
    magnets.forEach((m) => gsap.set([m.el, m.inner].filter(Boolean), { clearProps: "transform" }));
  };
}
