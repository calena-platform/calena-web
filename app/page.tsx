'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type WaitlistStatus = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<WaitlistStatus>('idle')

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    const { error } = await supabase
      .from('waitlist')
      .insert({ email: email.trim().toLowerCase(), source: 'calena.com.au' })

    if (!error) {
      setStatus('success')
    } else if (error.code === '23505') {
      setStatus('duplicate')
    } else {
      setStatus('error')
    }
  }

  const feedbackMessage = {
    success: "You're on the list.",
    duplicate: 'Already registered.',
    error: 'Something went wrong. Try again.',
  }

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
      {/* Wordmark — Syncopate Bold, always lowercase */}
      <h1
        style={{
          fontFamily: "var(--font-syncopate), 'Syncopate', sans-serif",
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#F8F6F2',
          lineHeight: 1,
          textAlign: 'center',
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

      {/* Waitlist form / feedback */}
      {status === 'success' || status === 'duplicate' || status === 'error' ? (
        <p
          style={{
            fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
            fontSize: '11px',
            fontWeight: 400,
            color: 'rgba(181,153,111,0.7)',
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          {feedbackMessage[status]}
        </p>
      ) : (
        <form
          onSubmit={handleWaitlist}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: '12px',
              fontWeight: 400,
              backgroundColor: '#031B28',
              border: '1px solid rgba(181,153,111,0.2)',
              borderRadius: '6px',
              padding: '10px 14px',
              color: 'rgba(248,246,242,0.7)',
              width: '220px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              backgroundColor: status === 'submitting' ? 'rgba(181,153,111,0.5)' : 'rgba(181,153,111,0.85)',
              color: '#031B28',
              borderRadius: '6px',
              padding: '10px 20px',
              border: 'none',
              cursor: status === 'submitting' ? 'default' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Join
          </button>
        </form>
      )}

      {/* Copyright — absolute bottom */}
      <p
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: '9px',
          fontWeight: 400,
          color: 'rgba(248,246,242,0.2)',
          letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        &copy; 2026 cal&eacute;na HNWI OS. All rights reserved.
      </p>
    </main>
  )
}
