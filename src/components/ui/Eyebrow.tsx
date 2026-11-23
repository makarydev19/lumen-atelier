import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Renders `(01) Philosophy`; the index is aria-hidden so headings read cleanly. */
export function Eyebrow({
  index,
  children,
  className,
  id,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <p id={id} className={cn("t-label", className)} data-anim="fade-up" data-eyebrow="">
      {index && (
        <span aria-hidden="true" className="mr-2 tabular">
          ({index})
        </span>
      )}
      {children}
    </p>
  );
}
