import type { Metadata, Viewport } from "next";
import { serif, sans } from "./fonts";
import "./globals.css";
import { Grain } from "@/components/visuals/Grain";
import { SkipLink } from "@/components/layout/SkipLink";
import { Cursor } from "@/components/cursor/Cursor";
import { Preloader } from "@/components/preloader/Preloader";
import { SmoothScroll } from "@/animations/SmoothScroll";
import { PageMotion } from "@/animations/PageMotion";

/**
 * Runs before first paint. Adds the classes that hide the hero (js-intro) and show the preloader
 * (js-preload) only when JS is running; if the animation bundle never boots, a timeout removes them,
 * so content is never left hidden.
 */
const bootScript = `(function(){try{var d=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches,s=null;try{s=sessionStorage.getItem('la-loaded')}catch(e){}if(s!=='1')d.classList.add('js-preload');if(!r)d.classList.add('js','js-intro');setTimeout(function(){if(!d.classList.contains('anim-ready'))d.classList.remove('js-preload','js-intro')},3000)}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://lumen-atelier.studio"),
  title: "Lumen Atelier — Architecture & Interiors, Lisbon · Copenhagen",
  description:
    "Lumen Atelier designs houses, retreats and public rooms around daylight, then builds them with lime, oak and stone. Studios in Lisbon and Copenhagen since 2011.",
};

export const viewport: Viewport = {
  themeColor: "#F3EEE6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SkipLink />
        <Grain />
        <SmoothScroll>{children}</SmoothScroll>
        <Preloader />
        <Cursor />
        <PageMotion />
      </body>
    </html>
  );
}
