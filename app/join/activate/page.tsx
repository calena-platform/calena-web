import type { Metadata } from "next";
import { JoinShell, Wordmark, ByInvitation } from "../_components";

/*
 * /join/activate — Screen B "Activate" (SCAFFOLD).
 *
 * Reached from Email 2's activation_url: confirms the reserved numeral + offer,
 * then hands to a secure Stripe pay link (a link, NOT an embedded checkout —
 * Apple 3.1.5(a)). The full activation layout + counsel-gated price/renewal copy
 * lands in GL-J1c (task 4), gated by PRICING_LIVE. Until counsel clears
 * (GL-C1-1) the flag is off and this route reveals NO figures — only a quiet
 * "by invitation" placeholder. Always noindex (private surface).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "caléna — Activate",
  robots: { index: false, follow: false },
};

export default function ActivatePage() {
  return (
    <JoinShell>
      <Wordmark />
      <ByInvitation />
    </JoinShell>
  );
}
