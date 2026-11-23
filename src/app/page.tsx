import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { ProjectsGallery } from "@/components/sections/projects/ProjectsGallery";
import { ProcessSection } from "@/components/sections/process/ProcessSection";
import { StatsSection } from "@/components/sections/stats/StatsSection";
import { ContactFooter } from "@/components/sections/contact/ContactFooter";

export default function Home() {
  return (
    <>
      <SiteHeader nav={site.nav} cta={site.cta} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero content={site.hero} />
        <Philosophy content={site.philosophy} />
        <ProjectsGallery
          heading={site.work.heading}
          intro={site.work.intro}
          projects={site.work.projects}
          endCard={site.work.endCard}
        />
        <ProcessSection heading={site.process.heading} intro={site.process.intro} steps={site.process.steps} />
        <StatsSection
          heading={site.studio.heading}
          body={site.studio.body}
          stats={site.studio.stats}
          recognition={site.studio.recognition}
          recognitionLabel={site.studio.recognitionLabel}
        />
      </main>
      <ContactFooter content={site.contact} />
    </>
  );
}
