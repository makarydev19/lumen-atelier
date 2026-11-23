import type { EndCardContent, Project, SectionHeading } from "@/content/types";
import { renderRich } from "@/lib/rich-text";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ProjectCard } from "./ProjectCard";
import { EndCard } from "./EndCard";
import { GalleryCounter } from "./GalleryCounter";
import { GalleryProgress } from "./GalleryProgress";

/**
 * §3.3 Selected projects. Static: md+ is a native horizontally scrollable row
 * ([data-gallery-viewport], overflow-x auto). ANIM: pin [data-pin] and translate [data-track] x,
 * setting [data-gallery-viewport] to overflow: visible.
 */
export function ProjectsGallery({
  projects,
  endCard,
  heading,
  intro,
}: {
  projects: Project[];
  endCard: EndCardContent;
  heading: SectionHeading;
  intro: string;
}) {
  return (
    <section id="work" data-theme="dark" aria-labelledby="work-title" className="relative overflow-clip">
      <div data-pin="" className="flex flex-col py-[var(--section-y)] md:min-h-svh md:py-0">
        <div className="grid-site gap-y-6 md:pt-24" data-gallery-header="">
          <div className="col-span-full lg:col-[1/3]">
            <Eyebrow index={heading.index}>{heading.eyebrow}</Eyebrow>
          </div>
          <div className="col-span-full md:col-[1/7] lg:col-[3/10]">
            <SplitHeading as="h2" size="h2" anim="lines" id="work-title" className="lg:whitespace-nowrap">
              {renderRich(heading.title)}
            </SplitHeading>
            <p className="mt-4 max-w-[46ch] text-stone" data-anim="lines">
              {intro}
            </p>
          </div>
          <div className="hidden md:col-[7/9] md:block md:justify-self-end lg:col-[11/13]">
            <GalleryCounter total={projects.length} />
          </div>
        </div>

        <div
          className="gallery-viewport mt-12 md:mt-0 md:flex md:flex-1 md:items-center md:overflow-x-auto md:overflow-y-hidden md:py-6"
          data-gallery-viewport=""
          tabIndex={0}
          role="region"
          aria-label="Selected projects, scroll horizontally"
        >
          <ol
            data-track=""
            className="flex flex-col gap-16 px-[var(--margin-eff)] md:w-max md:flex-row md:items-start md:gap-12 md:pr-12 lg:pl-[calc(var(--margin-eff)+2*var(--col)+2*var(--gutter))]"
          >
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} offset={i % 2 === 1} />
            ))}
            <EndCard content={endCard} />
          </ol>
        </div>

        <div className="grid-site hidden pb-12 md:grid">
          <div className="col-span-full lg:col-[3/13]">
            <GalleryProgress />
          </div>
        </div>
      </div>
    </section>
  );
}
