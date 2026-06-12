import {
  Montserrat,
  Cinzel,
  Lora,
  Cormorant_Garamond,
  Syncopate,
} from "next/font/google";

// Self-hosted via next/font — fonts are downloaded at build time and served
// from our own origin. No runtime requests to Google, no third-party SDK.
// Privacy is the architecture (binding research rule: no third-party SDKs).

// Montserrat — all UI text. Light (300) for house/manifesto blocks.
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-montserrat",
});

// Cinzel — letterspaced eyebrows + ceremony labels.
export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-cinzel",
});

// Lora — italic only. The single CEIL voice line.
export const lora = Lora({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
  variable: "--font-lora",
});

// Cormorant Garamond — the ceremony Roman numeral.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-cormorant",
});

// Syncopate — the caléna wordmark only.
export const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-syncopate",
});

export const fontVariables = [
  montserrat.variable,
  cinzel.variable,
  lora.variable,
  cormorant.variable,
  syncopate.variable,
].join(" ");
