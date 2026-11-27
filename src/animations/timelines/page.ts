"use client";

import { gsap, ScrollTrigger, $, $$ } from "../gsap";

const THEMES: Record<string, { bg: string; fg: string }> = {
  light: { bg: "#F3EEE6", fg: "#1C1A18" },
  dark: { bg: "#1C1A18", fg: "#F3EEE6" },
  linen: { bg: "#E7DFD2", fg: "#1C1A18" },
};

const themedSections = () => $$("main section[data-theme], footer[data-theme]");

/**
 * §5.0 Theme background tween: sections go transparent (`.js-theme`) and <body>'s background
 * follows the section crossing 55% of the viewport.
 *
 * Perf: this used to tween the custom properties --page-bg / --page-fg on <body>. Custom
 * properties (and `color`) inherit, so every frame of the 0.8s tween restyled the whole document
 * (~900 elements): the longest main-thread tasks while scrolling on phones. Now only body's own
 * (non-inherited) background-color tweens. Its text colour, which no themed section inherits
 * (each sets its own), switches once per section, and the custom cursor, the one consumer of
 * --page-fg, gets the tween on its own small subtree.
 */
export function themeTween() {
  const root = document.documentElement;
  const body = document.body;
  const cursor = $(".cursor");
  root.classList.add("js-theme");
  themedSections().forEach((section) => {
    const theme = THEMES[section.dataset.theme ?? "light"] ?? THEMES.light;
    ScrollTrigger.create({
      trigger: section,
      start: "top 55%",
      end: "bottom 55%",
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.set(body, { color: theme.fg });
        gsap.to(body, { backgroundColor: theme.bg, duration: 0.8, ease: "power2.inOut", overwrite: "auto" });
        if (cursor) gsap.to(cursor, { "--page-fg": theme.fg, duration: 0.8, ease: "power2.inOut", overwrite: true });
      },
    });
  });
  // First section is active before anything crosses 55%.
  gsap.set(body, { backgroundColor: THEMES.light.bg, color: THEMES.light.fg });
  if (cursor) gsap.set(cursor, { "--page-fg": THEMES.light.fg });
  return () => {
    root.classList.remove("js-theme");
    gsap.set(body, { clearProps: "backgroundColor,color" });
    if (cursor) gsap.set(cursor, { clearProps: "--page-fg" });
  };
}

/**
 * Header colour (data-header-theme, all modes incl. reduced motion), active nav link,
 * and hide-on-scroll-down once content scrolls under it (motion only).
 */
export function headerTimeline({ hideOnScroll }: { hideOnScroll: boolean }) {
  const header = $("header[data-site-header]");
  if (!header) return;

  themedSections().forEach((section) => {
    const theme = section.dataset.theme === "dark" ? "dark" : "light";
    ScrollTrigger.create({
      trigger: section,
      start: "top 44px",
      end: "bottom 44px",
      onToggle: (self) => {
        if (!self.isActive) return;
        header.dataset.headerTheme = theme;
        header.dataset.headerSurface = section.dataset.theme ?? "light";
      },
    });
  });

  // Active section → nav dot + aria-current.
  const links = $$<HTMLAnchorElement>("[data-nav-link]", header);
  const setActiveLink = (id: string | null) => {
    links.forEach((a) => {
      const on = a.dataset.navLink === id;
      a.dataset.active = on ? "true" : "false";
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
      const dot = $("[data-nav-dot]", a);
      dot?.classList.toggle("scale-100", on);
      dot?.classList.toggle("scale-0", !on);
    });
  };
  links.forEach((a) => {
    const section = document.getElementById(a.dataset.navLink ?? "");
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (self.isActive) setActiveLink(section.id);
        else if (links.every((l) => l.dataset.active !== "true" || l === a)) setActiveLink(null);
      },
    });
  });

  // Solid surface once content scrolls under the (otherwise transparent) header.
  const SCROLLED = () => Math.min(window.innerHeight * 0.1, 80);
  ScrollTrigger.create({
    start: SCROLLED,
    end: "max",
    onToggle: (self) => {
      header.dataset.scrolled = self.isActive ? "true" : "false";
    },
  });

  if (!hideOnScroll) return;
  let hidden = false;
  const move = (h: boolean) => {
    if (h === hidden) return;
    hidden = h;
    gsap.to(header, { yPercent: h ? -100 : 0, duration: 0.48, ease: "power3.out", overwrite: true });
  };
  const show = () => move(false);
  const hide = () => move(true);
  ScrollTrigger.create({
    // QA: was 120vh, but the transparent header then sat on top of the hero's lead/headline
    // while they scrolled under it. Hide as soon as content reaches the header instead.
    start: SCROLLED,
    end: "max",
    onUpdate: (self) => {
      const busy = header.dataset.menuOpen === "true" || header.contains(document.activeElement);
      if (self.direction === 1 && !busy) hide();
      else show();
    },
    onLeaveBack: show,
  });
  const onFocus = () => show();
  header.addEventListener("focusin", onFocus);
  return () => header.removeEventListener("focusin", onFocus);
}
