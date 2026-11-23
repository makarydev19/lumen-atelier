import type { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1.5 text-small"
      style={{ border: "1px solid var(--rule)" }}
      data-tag=""
    >
      {children}
    </span>
  );
}
