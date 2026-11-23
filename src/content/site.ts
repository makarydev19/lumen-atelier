import type { SiteContent } from "./types";

/** All copy from DESIGN.md §3 — single source of truth. */
const EMAIL = "hello@lumen-atelier.studio";

export const site = {
  name: "Lumen Atelier",
  locations: "Lisbon · Copenhagen",
  email: EMAIL,
  coordinates: "Lisbon 38.71° N · Copenhagen 55.68° N",
  nav: [
    { label: "Work", href: "#work" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Process", href: "#process" },
    { label: "Studio", href: "#studio" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Start a project", href: "#contact" },

  hero: {
    eyebrow: "Architecture & Interiors — Est. 2011",
    headline: "Rooms that|hold the|*light.*",
    lead: "We design houses, retreats and public rooms around one material most studios ignore — daylight. Then we build them with lime, oak and stone, slowly.",
    primaryCta: { label: "View selected work", href: "#work" },
    secondaryCta: { label: "Our philosophy", href: "#philosophy" },
    meta: ["Lisbon — Copenhagen", "62 built works"],
    scrollLabel: "Scroll",
    media: "hero",
    caption: "Casa Alvéolo, Comporta — 07:40, March",
  },

  philosophy: {
    index: "01",
    eyebrow: "Philosophy",
    statement:
      "We begin every project by standing in the empty site at dawn and at dusk. Walls come later. First we decide where the *light* should land, and where it should rest — because a room is remembered for its quiet, not its square metres.",
    notes: [
      "Our drawings start with a sun path, not a floor plan. Apertures, depths and ceiling heights are tuned until a single beam crosses the kitchen table at breakfast.",
      "We work with a small network of masons, joiners and lime plasterers we have known for over a decade. Fewer hands, more care.",
    ],
    signature: "— Inês Valadares & Mads Krog, founding partners",
    media: "beam",
  },

  work: {
    heading: { index: "02", eyebrow: "Selected work", title: "Five recent *rooms*" },
    intro: "A selection from 2023–2025. Each was drawn around a single moment of light.",
    projects: [
      {
        slug: "casa-alveolo",
        title: "Casa Alvéolo",
        type: "Private residence",
        place: "Comporta, Portugal",
        year: "2025",
        blurb: "A low courtyard house of lime and cork, carved around one old olive tree.",
        media: "alveolo",
      },
      {
        slug: "the-salt-library",
        title: "The Salt Library",
        type: "Cultural",
        place: "Aveiro, Portugal",
        year: "2024",
        blurb: "A reading room inside a former salt warehouse, lit only from above.",
        media: "salt",
      },
      {
        slug: "halde-bathhouse",
        title: "Halde Bathhouse",
        type: "Wellness",
        place: "Bergen, Norway",
        year: "2024",
        blurb: "Six granite pools stepping down a fjord slope, each facing a different hour.",
        media: "halde",
      },
      {
        slug: "maison-ourse",
        title: "Maison Ourse",
        type: "Interior",
        place: "Lyon, France",
        year: "2023",
        blurb: "A fourth-floor apartment re-planned around a single long oak table.",
        media: "ourse",
      },
      {
        slug: "vesterbro-ateliers",
        title: "Vesterbro Ateliers",
        type: "Adaptive reuse",
        place: "Copenhagen, Denmark",
        year: "2023",
        blurb: "Twelve artists' studios in a 1906 printworks, north light restored.",
        media: "vesterbro",
      },
    ],
    endCard: {
      title: "Thirty-eight more, built *quietly.*",
      body: "Our full archive is shared privately with clients and press.",
      cta: {
        label: "Request the portfolio",
        href: `mailto:${EMAIL}?subject=Portfolio%20request`,
      },
    },
  },

  process: {
    heading: { index: "03", eyebrow: "Process", title: "Four *seasons* of a project" },
    intro:
      "From first visit to the day you move in, most of our houses take eighteen to thirty months. Here is how that time is spent.",
    steps: [
      {
        number: "01",
        title: "Listen",
        duration: "Months 1–2",
        body: "We spend days on the site and hours in your current home. We map the sun, the wind, the views you want and the ones you don't.",
        deliverables: ["Site light study", "Brief document", "Feasibility"],
      },
      {
        number: "02",
        title: "Draw",
        duration: "Months 3–7",
        body: "Hand sketches first, then models in card and plaster. Every room is tested against the light study before a single wall is fixed.",
        deliverables: ["Concept design", "Physical models", "Planning application"],
      },
      {
        number: "03",
        title: "Choose",
        duration: "Months 8–11",
        body: "We source materials with you, in quarries, mills and workshops. Samples live in your kitchen for a week before you decide.",
        deliverables: ["Material palette", "Joinery drawings", "Tender package"],
      },
      {
        number: "04",
        title: "Build",
        duration: "Months 12–30",
        body: "Our site architect is present twice a week. We stay until the last shelf is oiled and the first winter has passed.",
        deliverables: ["Site supervision", "Snagging", "One-year return visit"],
      },
    ],
  },

  studio: {
    heading: { index: "04", eyebrow: "Studio", title: "Small by *choice.*" },
    body: "Nineteen architects, two studios, and one rule: we never run more than six projects at once. It is the only way we know to stay on site.",
    stats: [
      { value: 14, label: "Years of practice" },
      { value: 62, label: "Built works" },
      { value: 9, label: "Countries" },
      { value: 6, label: "Projects at a time, never more" },
    ],
    recognitionLabel: "Recognition",
    recognition: [
      { title: "Mies Light Prize — Shortlist", year: "2025" },
      { title: "Nordic Interior Awards — Residential of the Year", year: "2024" },
      { title: "Portuguese Lime Guild — Honorary Mention", year: "2023" },
      { title: "Habitat Quarterly — 40 Studios to Watch", year: "2021" },
    ],
  },

  contact: {
    index: "05",
    eyebrow: "Contact",
    headline: "Tell us about the light you *wake up* to.",
    body: "We take on four new commissions each year. Write to us with a site, a sketch, or simply a feeling — we reply to every letter within five days.",
    email: EMAIL,
    cta: { label: "Start a project", href: `mailto:${EMAIL}?subject=New%20project` },
    studios: [
      {
        city: "Lisbon",
        address: "Rua das Janelas Verdes 41, 1200-690 Lisboa",
        phone: "+351 21 390 4410",
      },
      {
        city: "Copenhagen",
        address: "Strandgade 27B, 1401 København K",
        phone: "+45 32 96 1180",
      },
    ],
    social: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "Are.na", href: "https://www.are.na/" },
    ],
    copyright: "© 2026 Lumen Atelier. All rights reserved.",
    privacy: { label: "Privacy", href: "#privacy" },
    backToTop: "Back to top",
    wordmark: "Lumen Atelier",
  },
} satisfies SiteContent;
