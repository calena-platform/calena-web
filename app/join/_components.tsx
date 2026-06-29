// Shared chrome for the off-app join surfaces (GL-J4). Tokens come from
// globals.css (--navy / --bronze / --off) + fonts.ts; the underscore prefix
// keeps this folder out of Next's route table.

import type { ReactNode } from "react";

export function JoinShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 py-16 text-off">
      <div className="w-full max-w-xl text-center">{children}</div>
    </main>
  );
}

export function Wordmark() {
  return (
    <>
      <div
        style={{
          fontFamily: "var(--font-syncopate)",
          fontWeight: 700,
          fontSize: "15px",
          letterSpacing: "0.5em",
          paddingLeft: "0.5em",
          color: "var(--off)",
        }}
      >
        caléna
      </div>
      <div
        aria-hidden="true"
        className="mx-auto"
        style={{
          width: "34px",
          height: "1px",
          background: "var(--bronze)",
          marginTop: "14px",
        }}
      />
    </>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-bronze"
      style={{
        fontFamily: "var(--font-cinzel)",
        fontSize: "10px",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <h1
      style={{
        fontFamily: "var(--font-cormorant)",
        fontWeight: 400,
        fontSize: "30px",
        lineHeight: 1.3,
        margin: "16px auto 0",
        maxWidth: "18ch",
      }}
    >
      {children}
    </h1>
  );
}

export function Body({
  children,
  muted,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 300,
        fontSize: "15px",
        lineHeight: 1.85,
        color: muted ? "#9aa6ac" : "#e9e6e0",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

// Shown on the priced routes while the pricing flag is off (counsel gate
// GL-C1-1). Quiet, factual, no figures — a private surface that reveals nothing.
export function ByInvitation() {
  return (
    <>
      <div style={{ marginTop: "30px" }}>
        <Eyebrow>By Invitation</Eyebrow>
      </div>
      <Lead>Held for the few.</Lead>
      <Body style={{ maxWidth: "46ch", margin: "18px auto 0" }}>
        caléna is a private membership, extended by invitation. If your name is
        before us, your concierge will be in touch.
      </Body>
    </>
  );
}

export function Cta({
  href,
  children,
  solid,
}: {
  href: string;
  children: ReactNode;
  solid?: boolean;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        fontFamily: "var(--font-cinzel)",
        fontSize: "12px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--off)",
        textDecoration: "none",
        border: "1px solid var(--bronze)",
        borderRadius: "3px",
        padding: "16px 44px",
        background: solid ? "rgba(181,153,111,0.12)" : "transparent",
      }}
    >
      {children}
    </a>
  );
}
