"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { lockScroll, unlockScroll } from "@/animations/SmoothScroll";
import { EASE } from "@/lib/motion-tokens";
import type { LinkItem, NavItem } from "@/content/types";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";

/**
 * Fixed header. ANIM hooks:
 *  - header[data-site-header] — hide/show yPercent on scroll
 *  - data-header-theme="light|dark" — colour (CSS transition)
 *  - [data-nav-link="work"] etc. + data-active for the active-section dot
 *  - [data-menu-toggle] with [data-toggle-label="menu|close"] spans for the crossfade
 */
export function SiteHeader({ nav, cta }: { nav: NavItem[]; cta: LinkItem }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const reduce = useReducedMotion();

  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.getElementById("contact");
    const root = document.documentElement;
    if (open) {
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      root.style.overflow = "hidden";
      lockScroll("menu");
    } else {
      unlockScroll("menu");
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      root.style.overflow = "";
    }
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !headerRef.current) return;
      const focusables = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 75rem)").matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      data-site-header=""
      data-header-theme="light"
      data-menu-open={open ? "true" : "false"}
      className="site-header fixed inset-x-0 top-0 z-50"
    >
      <div className="grid-site relative z-50 h-[var(--header-h)] items-center">
        <div className="col-span-2 md:col-span-4 lg:col-[1/4]">
          <Logo withLocations />
        </div>

        <nav aria-label="Primary" className="hidden lg:col-[6/11] lg:block">
          <ul className="flex items-center gap-10">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden justify-self-end lg:col-[11/13] lg:block">
          <Button href={cta.href} variant="ink" magnetic className="min-h-11 px-6" >
            {cta.label}
          </Button>
        </div>

        <div className="col-span-2 justify-self-end md:col-span-4 lg:hidden">
          <button
            ref={toggleRef}
            type="button"
            data-menu-toggle=""
            data-cursor="link"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="t-label relative -mr-2 inline-flex h-11 min-w-16 items-center justify-end overflow-hidden px-2"
          >
            {/* §5.8 Menu ↔ Close crossfade (y 100% / −100%). Reduced motion keeps y at 0 explicitly,
                because the server render (reduce === null) already applied the y offsets. */}
            <motion.span
              data-toggle-label="menu"
              aria-hidden={open}
              className="block"
              initial={false}
              animate={reduce ? { y: "0%", opacity: open ? 0 : 1 } : { y: open ? "-100%" : "0%", opacity: open ? 0 : 1 }}
              transition={{ duration: reduce ? 0.2 : 0.48, ease: EASE.outSoft }}
            >
              Menu
            </motion.span>
            <motion.span
              data-toggle-label="close"
              aria-hidden={!open}
              className="absolute right-2 block"
              initial={false}
              animate={reduce ? { y: "0%", opacity: open ? 1 : 0 } : { y: open ? "0%" : "100%", opacity: open ? 1 : 0 }}
              transition={{ duration: reduce ? 0.2 : 0.48, ease: EASE.outSoft }}
            >
              Close
            </motion.span>
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={close} nav={nav} cta={cta} email={site.email} />
    </header>
  );
}
