import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    // If session is immediately available, email auto-confirm is on — go to app
    if (data.session) { navigate('/app'); return }
    // Otherwise email confirmation is required — show the check-email screen
    setConfirmed(true)
  }

  async function handleGoogle() {
    setError('')
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (err) setError(err.message)
  }

  const logo = (
    <div style={{
      width: 60, height: 60, margin: '0 auto 20px',
      borderRadius: 15, background: 'var(--card)',
      border: '1px solid var(--line2)', boxShadow: 'var(--shadow-card)',
      display: 'grid', placeItems: 'center', position: 'relative',
    }}>
      <span className="serif" style={{ fontSize: 36, lineHeight: 1 }}>B</span>
      <span className="sym" style={{ position: 'absolute', right: 9, bottom: 9, fontSize: 8, color: 'var(--gold)' }}>❧</span>
    </div>
  )

  if (confirmed) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 95,
        background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px',
      }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center', animation: 'blRise .5s var(--ease) both' }}>
          {logo}
          <div style={{ fontSize: 36, marginBottom: 16 }}>✉️</div>
          <h1 className="serif" style={{ fontWeight: 400, fontSize: 26, margin: '0 0 14px' }}>Check your inbox</h1>
          <p style={{ font: '400 15px/1.7 var(--sans)', color: 'var(--soft)', margin: '0 auto 28px', maxWidth: 300 }}>
            We sent a confirmation link to <strong style={{ color: 'var(--ink)' }}>{email}</strong>. Click it to activate your account, then come back to sign in.
          </p>
          <Link to="/login" style={{ display: 'inline-block', font: '600 14px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>
            Go to sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 95,
      background: 'var(--paper)', overflowY: 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
    }}>
      <style>{`
        .auth-input { width: 100%; padding: 13px 15px; border: 1px solid var(--line2); border-radius: 10px; font: 400 15px var(--sans); background: var(--card); color: var(--ink); outline: none; transition: border-color .18s; box-sizing: border-box; }
        .auth-input:focus { border-color: var(--gold); }
        .auth-btn-primary { width: 100%; padding: 15px; border: none; border-radius: 999px; font: 600 15px var(--sans); background: var(--ink); color: var(--card); cursor: pointer; transition: opacity .18s; }
        .auth-btn-primary:hover { opacity: .9; }
        .auth-btn-outline { width: 100%; padding: 13px; border: 1px solid var(--line2); border-radius: 999px; font: 600 14px var(--sans); background: var(--card); color: var(--ink); cursor: pointer; transition: border-color .18s; }
        .auth-btn-outline:hover { border-color: var(--gold); }
      `}</style>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center', animation: 'blRise .5s var(--ease) both' }}>
        {logo}

        <h1 className="serif" style={{ fontWeight: 400, fontSize: 28, margin: '0 0 12px' }}>Create your account</h1>
        <p style={{ font: '400 14.5px/1.6 var(--sans)', color: 'var(--soft)', margin: '0 auto 26px', maxWidth: 320 }}>
          Start with one French sentence tonight. No card required for your free week.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginBottom: 18 }}>
          <label style={{ display: 'block' }}>
            <span style={{ font: '600 11px var(--sans)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)', display: 'block', marginBottom: 6 }}>Email</span>
            <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label style={{ display: 'block' }}>
            <span style={{ font: '600 11px var(--sans)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)', display: 'block', marginBottom: 6 }}>Password</span>
            <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
          </label>
          {error && <p style={{ font: '400 13px var(--sans)', color: 'var(--rose)', margin: 0, padding: '10px 14px', background: 'rgba(176,69,93,.08)', borderRadius: 8 }}>{error}</p>}
          <button className="auth-btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ font: '400 11px var(--sans)', color: 'var(--faint)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="auth-btn-outline" type="button" disabled>Continue with Apple</button>
          <button className="auth-btn-outline" type="button" onClick={handleGoogle}>Continue with Google</button>
        </div>

        <Link to="/login" style={{ display: 'block', marginTop: 24, background: 'transparent', border: 'none', cursor: 'pointer', font: '500 13.5px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>
          Already reading? Sign in
        </Link>
      </div>
    </div>
  )
}
