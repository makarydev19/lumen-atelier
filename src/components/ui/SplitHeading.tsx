import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  hero: "text-hero",
  statement: "text-statement",
  h2: "text-h2",
  h3: "text-h3",
} as const;

/**
 * Heading ready for SplitText. Keeps <em> children intact and exposes
 * `data-anim` (lines | words-scrub | chars) for the ANIMATION agent.
 */
export function SplitHeading({
  as: Tag,
  size,
  anim,
  id,
  className,
  children,
}: {
  as: "h1" | "h2" | "h3";
  size: keyof typeof sizes;
  anim?: "lines" | "words-scrub" | "chars";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag id={id} className={cn("font-serif", sizes[size], className)} data-anim={anim} data-split="">
      {children}
    </Tag>
  );
}
