import type { Metadata } from "next";
import { JoinShell, Wordmark, Eyebrow, Lead, Body, Cta } from "../_components";

/*
 * /join/welcome — Screen C (post-payment). The Stripe success redirect.
 *
 * Ship-safe: NO numeral (revealed in-app), NO price. It carries no
 * counsel-gated content, so it is live regardless of the pricing flag — it
 * simply turns the new member toward the App Store. The single-use code arrives
 * separately by email (Email 3); this page never shows it.
 */

export const dynamic = "force-dynamic";

// Private post-payment surface — never index it.
export const metadata: Metadata = {
  title: "caléna — Welcome",
  robots: { index: false, follow: false },
};

// The App Store listing is not public yet.
// TODO: replace with the real listing URL once published (CALENA_APP_STORE_URL).
const APP_STORE_URL =
  process.env.CALENA_APP_STORE_URL || "https://apps.apple.com/app/calena";

export default function WelcomePage() {
  return (
    <JoinShell>
      <Wordmark />
      <div style={{ marginTop: "30px" }}>
        <Eyebrow>Your seat is settled</Eyebrow>
      </div>
      <Lead>Welcome to caléna.</Lead>
      <Body style={{ maxWidth: "48ch", margin: "18px auto 0" }}>
        We&rsquo;ve sent your single-use key to your inbox. Open caléna on your
        iPhone, choose <em>&ldquo;I have an invitation,&rdquo;</em> and enter it.
        Your numeral is waiting inside.
      </Body>
      <div style={{ marginTop: "40px" }}>
        <Cta href={APP_STORE_URL}>Download caléna</Cta>
      </div>
      <Body muted style={{ fontSize: "12.5px", margin: "22px auto 0" }}>
        Didn&rsquo;t receive your key? Your concierge will resend it.
      </Body>
    </JoinShell>
  );
}
