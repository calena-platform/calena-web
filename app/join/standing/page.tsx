import type { Metadata } from "next";
import { JoinShell, Wordmark, ByInvitation } from "../_components";

/*
 * /join/standing — Screen A "The Standing" (SCAFFOLD).
 *
 * Where the membership price is presented, off-app. The full priced layout +
 * counsel-gated copy lands in GL-J1c (task 4), gated by PRICING_LIVE
 * (NEXT_PUBLIC_MEMBERSHIP_PRICING_LIVE). Until counsel clears (GL-C1-1) the flag
 * is off and this route reveals NO figures — only a quiet "by invitation"
 * placeholder. Always noindex (private surface).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "caléna — Membership",
  robots: { index: false, follow: false },
};

export default function StandingPage() {
  return (
    <JoinShell>
      <Wordmark />
      <ByInvitation />
    </JoinShell>
  );
}
