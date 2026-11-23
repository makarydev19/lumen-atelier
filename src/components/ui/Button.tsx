import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { icons } from "./Icons";

export interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant: "ink" | "bone" | "outline";
  icon?: "arrow-right" | "arrow-up-right" | "arrow-up";
  /** Adds `data-magnetic` (ANIM: useMagnetic). */
  magnetic?: boolean | number;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/**
 * Pill button. Renders <a> when `href` is set, else <button>.
 * Structure (ANIM hooks): .btn-fill (pointer-origin fill circle, uses --x/--y),
 * [data-magnetic-inner] label, .btn-icon with duplicated arrow for the slide-in.
 */
export function Button({
  href,
  onClick,
  variant,
  icon,
  magnetic,
  className,
  children,
  ...rest
}: ButtonProps) {
  const Icon = icon ? icons[icon] : null;
  const classes = cn(
    "btn t-label",
    variant === "bone" && "btn--bone",
    variant === "outline" && "btn--outline",
    className,
  );
  const magneticAttr =
    magnetic === undefined || magnetic === false
      ? undefined
      : magnetic === true
        ? ""
        : String(magnetic);

  const inner = (
    <>
      <span className="btn-fill" aria-hidden="true" />
      <span data-magnetic-inner="" className="inline-flex items-center gap-3">
        <span className="btn-label">{children}</span>
        {Icon && (
          <span className="btn-icon" aria-hidden="true">
            <Icon />
            <Icon />
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        data-magnetic={magneticAttr}
        data-cursor="link"
        aria-label={rest["aria-label"]}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      data-magnetic={magneticAttr}
      data-cursor="link"
      aria-label={rest["aria-label"]}
    >
      {inner}
    </button>
  );
}
