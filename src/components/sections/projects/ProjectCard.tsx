import type { Project } from "@/content/types";
import { media } from "@/content/media";
import { MediaFrame } from "@/components/media/MediaFrame";
import { cn } from "@/lib/cn";

/**
 * §3.3 card. ANIM hooks: li[data-card] (counter trigger, containerAnimation),
 * .frame[data-anim="window"] (arch → full clip reveal), .frame-inner[data-speed] (xPercent parallax),
 * [data-card-text] (index/title/one-liner fade-up), [data-card-title] (hover x 8).
 */
export function ProjectCard({ project, index, offset = false }: { project: Project; index: number; offset?: boolean }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <li className={cn("project-card shrink-0", offset && "md:translate-y-[clamp(0px,calc(100svh-840px),64px)]")} data-card="" data-card-index={index}>
      <a
        href="#contact"
        className="group block"
        data-cursor="view"
        data-cursor-label="View"
        aria-label={`${project.title} — ${project.type}, ${project.place.split(",")[0]}, ${project.year}. Enquire about this project`}
      >
        <MediaFrame
          media={media[project.media]}
          shape="window"
          speed={1}
          className="project-media"
          frameClassName="project-frame"
        />
        <div className="mt-4 md:max-w-[var(--card-w)]">
          <div className="t-label flex items-center justify-between tabular" data-card-text="">
            <span className="text-clay">{num}</span>
            <span className="text-stone">{project.year}</span>
          </div>
          <h3
            className="mt-3 text-h3 transition-[translate] duration-[480ms] ease-[var(--ease-out-soft)] group-hover:translate-x-2"
            data-card-text=""
            data-card-title=""
          >
            {project.title}
          </h3>
          <p className="mt-2 max-w-[36ch] text-small text-stone" data-card-text="">
            {project.blurb}
          </p>
        </div>
      </a>
    </li>
  );
}
