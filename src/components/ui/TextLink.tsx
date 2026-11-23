import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function TextLink({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <a
      href={href}
      data-cursor="link"
      className={cn(
        "u-link u-link--rest t-label inline-flex min-h-11 items-center",
        tone === "light" ? "text-terra-ink" : "text-clay",
        className,
      )}
    >
      <span className="relative">{children}</span>
    </a>
  );
}
