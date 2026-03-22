export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#031B28",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "0 24px",
      }}
    >
      {/* Wordmark */}
      <h1
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontSize: "48px",
          fontWeight: 300,
          letterSpacing: "0.15em",
          color: "#F8F6F2",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        Cal&eacute;na
      </h1>

      {/* Bronze rule */}
      <div
        style={{
          width: "40px",
          height: "1px",
          backgroundColor: "#B5996F",
          margin: "24px auto",
        }}
      />

      {/* Tagline */}
      <p
        style={{
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(248,246,242,0.45)",
          textAlign: "center",
        }}
      >
        The World&rsquo;s First HNWI Operating System
      </p>

      {/* Spacer */}
      <div style={{ height: "48px" }} />

      {/* Status pill */}
      <div
        style={{
          border: "1px solid rgba(181,153,111,0.3)",
          backgroundColor: "rgba(181,153,111,0.06)",
          borderRadius: "20px",
          padding: "6px 16px",
          display: "inline-block",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
            fontSize: "9px",
            fontWeight: 400,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(181,153,111,0.7)",
          }}
        >
          By Invitation Only
        </span>
      </div>

      {/* Spacer */}
      <div style={{ height: "16px" }} />

      {/* Waitlist text */}
      <p
        style={{
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: "11px",
          fontWeight: 400,
          color: "rgba(248,246,242,0.3)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        Founding membership now closed &middot; Waitlist open
      </p>

      {/* Copyright — absolute bottom */}
      <p
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: "9px",
          fontWeight: 400,
          color: "rgba(248,246,242,0.2)",
          letterSpacing: "0.15em",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        &copy; 2026 Cal&eacute;na HNWI OS. All rights reserved.
      </p>
    </main>
  );
}
