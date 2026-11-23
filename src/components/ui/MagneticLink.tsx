import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Link with `data-magnetic` (strength) and an inner `[data-magnetic-inner]` for parallax. */
export function MagneticLink({
  href,
  strength = 0.35,
  className,
  children,
}: {
  href: string;
  strength?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} data-magnetic={String(strength)} data-cursor="link" className={cn("inline-block", className)}>
      <span data-magnetic-inner="" className="inline-block">
        {children}
      </span>
    </a>
  );
}
