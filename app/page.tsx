// The Threshold — calena.com.au. Full six-beat structure lands in commit 2.
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 28px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-syncopate)",
          fontSize: 15,
          letterSpacing: "0.55em",
          paddingLeft: "0.55em",
        }}
      >
        cal<span style={{ color: "var(--bronze)" }}>é</span>na
      </div>
    </main>
  );
}
