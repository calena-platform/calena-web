import type { Metadata } from "next";
import {
  JoinShell,
  Wordmark,
  Eyebrow,
  Lead,
  Body,
  Cta,
  ByInvitation,
} from "../_components";
import { PRICING_LIVE, MEMBERSHIP_PRICING } from "@/lib/membership-pricing";

/*
 * /join/standing — Screen A "The Standing".
 *
 * Where the membership price is presented, off-app. Quiet and factual — never a
 * "buy now / limited spots" pitch. ALL figures + price/founding wording are
 * counsel-gated (GL-C1-1): when PRICING_LIVE is off (default), this route
 * reveals NO figures — only a quiet "by invitation" placeholder. Always noindex
 * (private surface). Figures come from the single MEMBERSHIP_PRICING source.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "caléna — Membership",
  robots: { index: false, follow: false },
};

function Stream({ title, children }: { title: string; children: string }) {
  return (
    <div style={{ background: "var(--navy)", padding: "22px 20px" }}>
      <h4
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--bronze)",
          margin: "0 0 8px",
          fontWeight: 500,
        }}
      >
        {title}
      </h4>
      <p style={{ fontSize: "12.5px", lineHeight: 1.7, color: "#cdc3b4", margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function PricedStanding() {
  return (
    <>
      <div style={{ marginTop: "30px" }}>
        <Eyebrow>Founding Membership</Eyebrow>
      </div>
      <Lead>Access, not a transaction.</Lead>
      <Body style={{ textAlign: "center", maxWidth: "52ch", margin: "18px auto 0" }}>
        Caléna is a private membership: a human and AI concierge that arranges the
        real world, a vetted community, and access held for the few. By invitation
        only.
      </Body>

      <div style={{ textAlign: "center", margin: "44px 0 0" }}>
        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "64px",
            lineHeight: 1,
            color: "var(--off)",
            fontWeight: 400,
          }}
        >
          {MEMBERSHIP_PRICING.foundingFee}{" "}
          <small
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              fontSize: "14px",
              color: "#cdc3b4",
              letterSpacing: "0.02em",
            }}
          >
            {MEMBERSHIP_PRICING.foundingPeriod}
          </small>
        </div>
        <Body muted style={{ margin: "10px auto 0" }}>
          Founding rate — <span style={{ color: "var(--off)" }}>locked for life.</span>
        </Body>
      </div>

      <div
        style={{
          border: "1px solid rgba(181,153,111,0.38)",
          borderRadius: "8px",
          background: "rgba(181,153,111,0.05)",
          padding: "30px 32px",
          marginTop: "38px",
          textAlign: "left",
        }}
      >
        <Eyebrow>Founding Standing</Eyebrow>
        <Body style={{ margin: "10px 0 0" }}>
          Your membership confers up to{" "}
          <strong>{MEMBERSHIP_PRICING.standingValue} a year</strong> in
          partner-funded benefits — upgrades, residence credits, experiences and
          waived fees — at no cost to you. Real value, returned; not a wallet, not
          a balance.
        </Body>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1px",
          background: "rgba(181,153,111,0.18)",
          border: "1px solid rgba(181,153,111,0.18)",
          borderRadius: "8px",
          overflow: "hidden",
          marginTop: "34px",
          textAlign: "left",
        }}
      >
        <Stream title="Membership">
          Your standing with Caléna and CEIL. Real, not refundable.
        </Stream>
        <Stream title="Service fee">
          A small, decaying fee per arrangement — stated plainly, never hidden.
        </Stream>
        <Stream title="Partner commission">
          Paid by partners, from their own rate. Never touches your price.
        </Stream>
      </div>

      <Body
        muted
        style={{ textAlign: "center", fontSize: "12.5px", margin: "30px auto 0", maxWidth: "50ch" }}
      >
        You pay each partner directly. Caléna never holds your funds.
      </Body>

      <div style={{ marginTop: "42px" }}>
        <Cta href="/" solid>
          Put your name forward
        </Cta>
      </div>
    </>
  );
}

export default function StandingPage() {
  return (
    <JoinShell>
      <Wordmark />
      {PRICING_LIVE ? <PricedStanding /> : <ByInvitation />}
    </JoinShell>
  );
}
