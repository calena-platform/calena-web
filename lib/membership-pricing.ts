// Single source for the membership price/join surfaces (GL-J4).
//
// COUNSEL GATE (GL-C1-1): every figure and the price/founding wording is gated
// on legal sign-off. Two controls live here so the rest of the app never inlines
// a figure or re-checks the env:
//   - PRICING_LIVE: false by default. While false, the priced routes (The
//     Standing, Activate) must not render real figures publicly — they show a
//     quiet "by invitation" placeholder and stay noindex.
//   - MEMBERSHIP_PRICING: the illustrative AUD placeholders from the locked
//     mockup. When counsel clears the wording, this is the ONE edit.

export const PRICING_LIVE =
  process.env.NEXT_PUBLIC_MEMBERSHIP_PRICING_LIVE === "true";

export const MEMBERSHIP_PRICING = {
  foundingFee: "A$12,000",
  foundingPeriod: "/ year",
  standingValue: "A$8,000",
} as const;
