import Image from "next/image";
import { media as mediaSlots, type Media } from "@/content/media";
import { LightStudy } from "@/components/visuals/LightStudy";
import { ProcessVisual } from "@/components/visuals/ProcessVisual";
import { cn } from "@/lib/cn";

type Shape = "arch" | "window" | "rect";

/**
 * Media slot (DESIGN.md §4).
 * Structure (ANIM hooks):
 *   figure[data-media]
 *     div.frame[data-anim="window"][data-shape]   ← clip-path target, overflow hidden
 *       div.frame-inner[data-speed]               ← parallax / scale target (116%, inset -8%)
 *         svg | img
 *     figcaption (outside the clip so the window reveal never crops it)
 */
export function MediaFrame({
  media,
  shape,
  size = "md",
  speed,
  caption,
  priority,
  className,
  frameClassName,
  idPrefix,
  processMode = "composite",
  anim = "window",
}: {
  media: Media;
  shape: Shape;
  size?: "sm" | "md" | "lg";
  speed?: number;
  caption?: string;
  priority?: boolean;
  className?: string;
  /** Sizing classes for the clipping frame (aspect / height). */
  frameClassName?: string;
  idPrefix?: string;
  processMode?: "progressive" | "composite";
  anim?: "window" | "none";
}) {
  return (
    <figure className={cn("relative", className)} data-media="" data-size={size}>
      <div
        className={cn("frame", shape === "arch" && "frame--arch", frameClassName)}
        data-anim={anim === "window" ? "window" : undefined}
        data-shape={shape}
      >
        <div className={cn("frame-inner", media.kind === "process" && "frame-inner--flush")} data-speed={speed}>
          {media.kind === "svg" && <LightStudy variant={media.variant} title={media.alt} idPrefix={idPrefix} />}
          {media.kind === "process" && (
            <ProcessVisual mode={processMode} title={media.alt} idPrefix={idPrefix ?? "pv"} />
          )}
          {media.kind === "image" && (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              priority={priority}
              sizes="(min-width: 1200px) 40vw, 100vw"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        {media.kind === "image" && (
          /* §7: bone → transparent scrim under text overlap */
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-2/5"
            style={{ background: "linear-gradient(90deg, rgb(243 238 230 / 0.7), transparent)" }}
          />
        )}
      </div>
      {caption && <figcaption className="mt-3 text-right text-small text-muted" data-anim="fade-up">{caption}</figcaption>}
    </figure>
  );
}

export { mediaSlots };
