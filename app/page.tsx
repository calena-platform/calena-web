import WaitlistForm from './components/WaitlistForm'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#031B28',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 24px',
      }}
    >
      {/* Wordmark — Syncopate Bold, forced lowercase */}
      <h1
        style={{
          fontFamily: "var(--font-syncopate), 'Syncopate', sans-serif",
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#F8F6F2',
          lineHeight: 1,
          textAlign: 'center',
          textTransform: 'lowercase',
        }}
      >
        cal&eacute;na
      </h1>

      {/* Bronze rule */}
      <div
        style={{
          width: '40px',
          height: '1px',
          backgroundColor: '#B5996F',
          margin: '24px auto',
        }}
      />

      {/* Tagline */}
      <p
        style={{
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(248,246,242,0.45)',
          textAlign: 'center',
        }}
      >
        The World&rsquo;s First HNWI Operating System
      </p>

      {/* Spacer */}
      <div style={{ height: '48px' }} />

      {/* Status pill — inline-flex for perfect centering */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 24px',
          border: '1px solid rgba(181,153,111,0.35)',
          borderRadius: '24px',
          backgroundColor: 'rgba(181,153,111,0.07)',
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: '9px',
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(181,153,111,0.75)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        By Invitation Only
      </div>

      {/* Founding membership status */}
      <p
        style={{
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: '11px',
          fontWeight: 300,
          color: 'rgba(248,246,242,0.38)',
          letterSpacing: '0.08em',
          textAlign: 'center',
          marginTop: '12px',
        }}
      >
        Founding membership now closed &middot; Waitlist open
      </p>

      {/* Spacer */}
      <div style={{ height: '24px' }} />

      {/* Thin divider rule */}
      <div
        style={{
          width: '20px',
          height: '1px',
          backgroundColor: 'rgba(181,153,111,0.2)',
          margin: '0 auto',
        }}
      />

      {/* Spacer */}
      <div style={{ height: '16px' }} />

      {/* Waitlist label */}
      <p
        style={{
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: '9px',
          fontWeight: 400,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(248,246,242,0.3)',
          textAlign: 'center',
        }}
      >
        Join the waitlist
      </p>

      {/* Spacer */}
      <div style={{ height: '12px' }} />

      {/* Waitlist form — client component */}
      <WaitlistForm />

      {/* Copyright — absolute bottom */}
      <p
        style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: '9px',
          fontWeight: 300,
          color: 'rgba(248,246,242,0.18)',
          letterSpacing: '0.15em',
          textAlign: 'center',
        }}
      >
        &copy; 2026 cal&eacute;na HNWI OS. All rights reserved.
      </p>
    </main>
  )
}
