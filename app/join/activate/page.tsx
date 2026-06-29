import type { Metadata } from "next";
import { JoinShell, Wordmark, Eyebrow, Body, Cta, ByInvitation } from "../_components";
import { PRICING_LIVE, MEMBERSHIP_PRICING } from "@/lib/membership-pricing";

/*
 * /join/activate — Screen B "Activate".
 *
 * Reached from Email 2's activation_url. Confirms the reserved numeral + offer,
 * then hands to a secure Stripe pay link — a LINK, never an embedded checkout
 * (Apple 3.1.5(a)). The numeral + pay link arrive on the URL (carried by the
 * concierge's activation link); both degrade gracefully if absent. ALL figures +
 * the renewal-consent copy are counsel-gated (GL-C1-1): when PRICING_LIVE is off
 * (default) this route reveals NO figures — only a quiet "by invitation"
 * placeholder. Always noindex (private surface).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "caléna — Activate",
  robots: { index: false, follow: false },
};

function FeeRow({
  label,
  value,
  valueColor,
  muted,
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  muted?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        color: muted ? "#9aa6ac" : "#cdc3b4",
        padding: "9px 0",
        borderBottom: last ? "none" : "1px solid rgba(181,153,111,0.14)",
      }}
    >
      <span>{label}</span>
      <span style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

function PricedActivate({ seat, payUrl }: { seat: string | null; payUrl: string }) {
  return (
    <>
      <div style={{ marginTop: "30px" }}>
        <Eyebrow>A seat is reserved for you</Eyebrow>
      </div>

      {seat ? (
        <div style={{ marginTop: "18px" }}>
          <span
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "54px",
              color: "var(--off)",
            }}
          >
            {seat}
          </span>
        </div>
      ) : null}

      <Body style={{ textAlign: "center", maxWidth: "48ch", margin: "14px auto 0" }}>
        Your place is held. Settle it below and your numeral is revealed when you
        open the app.
      </Body>

      <div
        style={{
          border: "1px solid rgba(181,153,111,0.38)",
          borderRadius: "8px",
          background: "rgba(181,153,111,0.05)",
          padding: "24px 28px",
          marginTop: "36px",
          textAlign: "left",
        }}
      >
        <FeeRow
          label="Founding membership · year one"
          value={MEMBERSHIP_PRICING.foundingFee}
          valueColor="var(--off)"
        />
        <FeeRow
          label="Founding Standing (partner-funded value)"
          value={`up to ${MEMBERSHIP_PRICING.standingValue}`}
          valueColor="var(--bronze-light)"
        />
        <FeeRow label="Rate locked for life · founding cohort" value="—" muted last />
      </div>

      <div style={{ marginTop: "38px" }}>
        <Cta href={payUrl} solid>
          Pay securely
        </Cta>
      </div>
      <Body
        muted
        style={{ textAlign: "center", fontSize: "12.5px", margin: "14px auto 0", maxWidth: "46ch" }}
      >
        A secure link, handled personally by your concierge. Bank transfer is
        available on request.
      </Body>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 300,
          fontSize: "11.5px",
          lineHeight: 1.7,
          color: "#8c9aa0",
          textAlign: "center",
          margin: "26px auto 0",
          maxWidth: "54ch",
          borderTop: "1px solid rgba(181,153,111,0.16)",
          paddingTop: "18px",
        }}
      >
        Your card is kept on file so year two renews automatically at your locked
        founding rate. You may change this at any time. A first-period guarantee
        applies.
      </p>
    </>
  );
}

export default async function ActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ seat?: string; pay?: string }>;
}) {
  const { seat, pay } = await searchParams;
  // The pay link is the concierge's Stripe-hosted invoice/payment link, carried
  // on the activation URL. No link yet → the CTA is inert (#), never a fabricated
  // checkout. The whole priced surface is gated off until counsel clears anyway.
  const payUrl = pay && /^https?:\/\//.test(pay) ? pay : "#";

  return (
    <JoinShell>
      <Wordmark />
      {PRICING_LIVE ? (
        <PricedActivate seat={seat ?? null} payUrl={payUrl} />
      ) : (
        <ByInvitation />
      )}
    </JoinShell>
  );
}
