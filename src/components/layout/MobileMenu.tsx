"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import type { LinkItem, NavItem } from "@/content/types";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/lib/motion-tokens";

/**
 * Full-screen mobile menu (below lg). §5.8: AnimatePresence; panel clip-path wipe down,
 * masked link stagger; exit reverses at 0.6s. Reduced motion: opacity only (0.2s).
 * Hooks: #mobile-menu[data-menu-panel], [data-menu-link] (masked by [data-menu-mask]).
 *
 * Portalled to <body>: the header is moved by GSAP (hide-on-scroll yPercent), and any transform
 * on an ancestor makes it the containing block of `position: fixed` descendants. Inside the
 * header the panel was clipped to the 64px header box, so on phones the menu never appeared
 * once the header had hidden and come back. The header (z-50) still sits above the panel (z-40),
 * so the Close toggle stays visible and tappable.
 */
const noopSubscribe = () => () => {};
export function MobileMenu({
  open,
  onClose,
  nav,
  cta,
  email,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  cta: LinkItem;
  email: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Portals cannot render on the server; the menu is closed there anyway.
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
  }, [open]);

  const panel: Variants = reduce
    ? {
        closed: { opacity: 0, transition: { duration: 0.2 } },
        open: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        closed: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.6, ease: EASE.inOut } },
        open: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.8, ease: EASE.inOut } },
      };
  const list: Variants = {
    open: { transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: reduce ? 0 : 0.3 } },
    closed: { transition: { staggerChildren: reduce ? 0 : 0.03, staggerDirection: -1 } },
  };
  const link: Variants = reduce
    ? { open: { y: 0 }, closed: { y: 0 } }
    : {
        open: { y: "0%", transition: { duration: 0.8, ease: EASE.out } },
        closed: { y: "110%", transition: { duration: 0.3, ease: EASE.in } },
      };
  const footer: Variants = reduce
    ? { open: { opacity: 1 }, closed: { opacity: 1 } }
    : {
        open: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.outSoft, delay: 0.6 } },
        closed: { opacity: 0, y: 16, transition: { duration: 0.2 } },
      };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          ref={panelRef}
          data-menu-panel=""
          data-theme="dark"
          // Lenis is stopped while the menu is open and then cancels every touchmove/wheel,
          // which made the panel unscrollable on short screens (landscape). Let it scroll natively.
          data-lenis-prevent=""
          variants={panel}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-ink text-bone lg:hidden"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) onClose();
          }}
        >
          <div className="grid-site min-h-full content-between gap-y-12 pb-8 pt-28">
            <nav aria-label="Mobile" className="col-span-full">
              <motion.ol className="flex flex-col gap-2" variants={list}>
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden" data-menu-mask="">
                    <motion.a
                      href={item.href}
                      data-menu-link=""
                      variants={link}
                      className="flex min-h-11 items-baseline gap-4 py-1 font-serif text-[48px] leading-[1.05] tracking-[-0.02em]"
                    >
                      <span className="t-label w-6 text-clay tabular" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </motion.ol>
            </nav>
            <motion.div className="col-span-full flex flex-col gap-6" variants={footer}>
              <a href={`mailto:${email}`} className="u-link w-fit text-lead font-light text-clay">
                {email}
              </a>
              <Button href={cta.href} variant="bone" icon="arrow-right" className="w-full">
                {cta.label}
              </Button>
              <p className="text-small text-stone">{site.coordinates}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
