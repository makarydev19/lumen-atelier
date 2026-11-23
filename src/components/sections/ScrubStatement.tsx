import type { ReactNode } from "react";
import { SplitHeading } from "@/components/ui/SplitHeading";

/** §3.2 statement — SplitText words, scrubbed opacity (ANIM). `data-pinned` marks desktop pin intent. */
export function ScrubStatement({ text, pinned = true, id }: { text: ReactNode; pinned?: boolean; id?: string }) {
  return (
    <div data-scrub-statement="" data-pinned={pinned ? "true" : "false"}>
      <SplitHeading as="h2" size="statement" anim="words-scrub" id={id}>
        {text}
      </SplitHeading>
    </div>
  );
}
