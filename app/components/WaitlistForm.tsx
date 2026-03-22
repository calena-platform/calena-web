'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'

type WaitlistStatus = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<WaitlistStatus>('idle')

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    const supabase = getSupabase()
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

  if (status === 'success' || status === 'duplicate' || status === 'error') {
    return (
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
    )
  }

  return (
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
          fontWeight: 300,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(181,153,111,0.2)',
          borderRadius: '6px',
          padding: '10px 14px',
          color: 'rgba(248,246,242,0.8)',
          width: '220px',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: 1,
        }}
        onFocus={(e) => { e.target.style.borderColor = 'rgba(181,153,111,0.45)' }}
        onBlur={(e) => { e.target.style.borderColor = 'rgba(181,153,111,0.2)' }}
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
          boxSizing: 'border-box',
          lineHeight: 1,
        }}
      >
        Join
      </button>
    </form>
  )
}
