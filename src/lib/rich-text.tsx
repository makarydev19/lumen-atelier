import { Fragment, type ReactNode } from "react";

/**
 * Renders the RichText convention from content/types.ts:
 * `*text*` → <em>, `|` → desktop-only line break (a space on mobile).
 */
export function renderRich(text: string): ReactNode {
  const lines = text.split("|");
  return lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && (
        <>
          <br className="hidden lg:inline" />
          <span className="lg:hidden"> </span>
        </>
      )}
      {line.split(/(\*[^*]+\*)/g).map((part, pi) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <em key={pi}>{part.slice(1, -1)}</em>
        ) : (
          <Fragment key={pi}>{part}</Fragment>
        ),
      )}
    </Fragment>
  ));
}

/** Plain text version (for aria-labels). */
export function plainRich(text: string): string {
  return text.replace(/\*/g, "").replace(/\|/g, " ");
}
