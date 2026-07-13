import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
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

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--paper)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px',
    }}>
      <style>{`
        .rp-input { width: 100%; padding: 13px 15px; border: 1px solid var(--line2); border-radius: 10px; font: 400 15px var(--sans); background: var(--card); color: var(--ink); outline: none; transition: border-color .18s; box-sizing: border-box; }
        .rp-input:focus { border-color: var(--gold); }
      `}</style>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center', animation: 'blRise .5s var(--ease) both' }}>
        {logo}
        {done ? (
          <>
            <h1 className="serif" style={{ fontWeight: 400, fontSize: 26, margin: '0 0 14px' }}>Password updated</h1>
            <p style={{ font: '400 15px/1.7 var(--sans)', color: 'var(--soft)', margin: '0 auto 28px', maxWidth: 300 }}>
              Your new password is set. You can now sign in.
            </p>
            <button onClick={() => navigate('/app')} style={{ font: '600 14px var(--sans)', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Go to app →
            </button>
          </>
        ) : (
          <>
            <h1 className="serif" style={{ fontWeight: 400, fontSize: 26, margin: '0 0 14px' }}>Set a new password</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginBottom: 18 }}>
              <label style={{ display: 'block' }}>
                <span style={{ font: '600 11px var(--sans)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--faint)', display: 'block', marginBottom: 6 }}>New password</span>
                <input className="rp-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoFocus />
              </label>
              {error && <p style={{ font: '400 13px var(--sans)', color: 'var(--rose)', margin: 0, padding: '10px 14px', background: 'rgba(176,69,93,.08)', borderRadius: 8 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: 15, border: 'none', borderRadius: 999, font: '600 15px var(--sans)', background: 'var(--ink)', color: 'var(--card)', cursor: 'pointer', transition: 'opacity .18s' }}>
                {loading ? 'Saving…' : 'Set password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
