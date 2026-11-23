import { Instrument_Serif, Hanken_Grotesk } from "next/font/google";

// CSS variables are --font-instrument / --font-hanken; Tailwind exposes them as
// --font-serif / --font-sans in globals.css (@theme inline) to avoid a self-referencing var.
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});
