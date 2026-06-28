import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/*
 * /invitation/{code} — the public face of a membership invitation.
 *
 * An issued invitation (Desk → admin_issue_invitation) becomes a link that
 * lands here. We validate the code server-side against the LIVE, anon-callable
 * `validate_invitation(p_code)` RPC — read-only, exposes no table rows — and
 * render a quiet confirmation (valid) or an honest cannot-open state (invalid /
 * expired / already redeemed, which the RPC collapses into valid=false).
 *
 * REDEEM IS DEFERRED — a parked product/architecture decision, NOT an oversight:
 *   `redeem_invitation(p_code)` is live but AUTHENTICATED-only (binds the code to
 *   auth.uid()). This marketing site has NO auth layer — no browser Supabase
 *   client, no sign-up — and standing onboarding (the locked 9-screen ceremony)
 *   happens IN THE iOS APP, with in-app email verification. So the binding step
 *   needs a decision: redeem on web (build a member auth/sign-up surface here) or
 *   validate-and-hand-off to the app. Until Geoff decides, this page validates +
 *   confirms only; it fabricates no account flow or fake redeem.
 *   See GEOFF-ON-RETURN. Wiring the binding is a follow-up once decided + env set.
 *
 * GL-J1 (deep-link bridge) — this page is the WEB half. Invitation links are now
 *   claimed by the iOS app via AASA (/invitation/*), so a real device with the app
 *   deep-links straight into the ceremony. For anyone the universal link did not
 *   auto-open (no app yet, or the link opened in a browser), the VALID state shows
 *   the typeable code and a quiet path to download caléna — no redeem, no auth.
 */

export const dynamic = "force-dynamic";

// The App Store listing is not public yet.
// TODO: replace with the real App Store listing URL once published.
const APP_STORE_URL = "https://apps.apple.com/app/calena";

// Invitation links are private — never index them.
export const metadata: Metadata = {
  title: "caléna — Invitation",
  robots: { index: false, follow: false },
};

type ValidationRow = {
  valid: boolean | null;
  tier: string | null;
  email: string | null;
};

type Outcome =
  | { kind: "valid"; tier: string | null; email: string | null }
  | { kind: "invalid" }
  | { kind: "unavailable" };

/** Mask an email for a public surface: g•••@calena.com.au. */
function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const at = email.indexOf("@");
  if (at <= 0) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const head = local.slice(0, 1);
  return `${head}•••${domain}`;
}

/** standard → Member · founding → Founding Member (quiet, no badge). */
function tierLabel(tier: string | null): string {
  if (tier === "founding") return "Founding Member";
  return "Member";
}

async function validateCode(code: string): Promise<Outcome> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("validate_invitation", {
      p_code: code,
    });
    if (error) return { kind: "unavailable" };
    const row = (Array.isArray(data) ? data[0] : data) as
      | ValidationRow
      | null
      | undefined;
    if (!row || row.valid !== true) return { kind: "invalid" };
    return { kind: "valid", tier: row.tier, email: row.email };
  } catch {
    // Env not configured (deploy gate) or transient — soft state, not "invalid".
    return { kind: "unavailable" };
  }
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const outcome = await validateCode(decodeURIComponent(code));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 py-16 text-off">
      <div className="w-full max-w-md text-center">
        <div
          className="text-bronze"
          style={{
            fontFamily: "var(--font-syncopate)",
            fontWeight: 700,
            fontSize: "20px",
            letterSpacing: "0.08em",
          }}
        >
          caléna
        </div>

        {outcome.kind === "valid" ? (
          <ValidState
            code={decodeURIComponent(code)}
            tier={outcome.tier}
            maskedEmail={maskEmail(outcome.email)}
          />
        ) : outcome.kind === "invalid" ? (
          <InvalidState />
        ) : (
          <UnavailableState />
        )}
      </div>
    </main>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-bronze"
      style={{
        fontFamily: "var(--font-cinzel)",
        fontSize: "10.5px",
        letterSpacing: "0.42em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function Hairline() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto"
      style={{
        width: "40px",
        height: "1px",
        background: "var(--bronze)",
        opacity: 0.4,
      }}
    />
  );
}

function ValidState({
  code,
  tier,
  maskedEmail,
}: {
  code: string;
  tier: string | null;
  maskedEmail: string | null;
}) {
  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      <Eyebrow>By Invitation</Eyebrow>
      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 400,
          fontSize: "30px",
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        Your invitation is recognised.
      </h1>
      <Hairline />
      <p
        className="text-off"
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "11px",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        {tierLabel(tier)}
      </p>
      {maskedEmail ? (
        <p className="text-off/50" style={{ fontSize: "12.5px" }}>
          Issued to {maskedEmail}
        </p>
      ) : null}
      <p
        className="text-off/60"
        style={{
          fontFamily: "var(--font-lora)",
          fontStyle: "italic",
          fontSize: "14px",
          lineHeight: 1.6,
          maxWidth: "22rem",
        }}
      >
        Keep this link. caléna will open to you when it is time — quietly, and
        only for you.
      </p>

      <div className="mt-2 flex flex-col items-center gap-4">
        <p
          className="text-bronze"
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "8.5px",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            opacity: 0.7,
            margin: 0,
          }}
        >
          Your code
        </p>
        <p
          className="text-off"
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontSize: "20px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {code.toUpperCase()}
        </p>
        <p
          className="text-off/50"
          style={{
            fontFamily: "var(--font-lora)",
            fontStyle: "italic",
            fontSize: "12.5px",
            lineHeight: 1.6,
            maxWidth: "20rem",
          }}
        >
          Open caléna and enter this when you are asked.
        </p>
      </div>

      <a
        href={APP_STORE_URL}
        className="text-bronze"
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "11px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          textDecoration: "none",
          padding: "12px 28px",
          border: "0.5px solid var(--bronze)",
          borderRadius: "2px",
        }}
      >
        Download caléna
      </a>
    </div>
  );
}

function InvalidState() {
  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      <Eyebrow>Invitation</Eyebrow>
      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 400,
          fontSize: "28px",
          lineHeight: 1.25,
          margin: 0,
        }}
      >
        This invitation cannot be opened.
      </h1>
      <Hairline />
      <p
        className="text-off/60"
        style={{ fontSize: "13px", lineHeight: 1.6, maxWidth: "22rem" }}
      >
        It may have expired, or already been used. If you believe this is in
        error, the member who invited you can request a new one.
      </p>
      <Link
        href="/"
        className="text-bronze"
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "11px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        Request an invitation
      </Link>
    </div>
  );
}

function UnavailableState() {
  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      <Eyebrow>Invitation</Eyebrow>
      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 400,
          fontSize: "28px",
          lineHeight: 1.25,
          margin: 0,
        }}
      >
        We could not reach the house.
      </h1>
      <Hairline />
      <p
        className="text-off/60"
        style={{ fontSize: "13px", lineHeight: 1.6, maxWidth: "22rem" }}
      >
        Your invitation could not be verified just now. Please try again in a
        moment.
      </p>
    </div>
  );
}
