import { cn } from "@/lib/cn";

export function NavLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      data-nav-link={href.slice(1)}
      data-active={active ? "true" : "false"}
      aria-current={active ? "location" : undefined}
      data-cursor="link"
      className="t-label group relative inline-flex min-h-11 items-center"
    >
      <span
        aria-hidden="true"
        data-nav-dot=""
        className={cn(
          "absolute -left-3 top-1/2 size-[5px] -translate-y-1/2 rounded-full bg-terra transition-transform duration-[240ms]",
          active ? "scale-100" : "scale-0",
        )}
      />
      <span className="u-link">{label}</span>
    </a>
  );
}
