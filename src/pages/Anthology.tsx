import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AppNav } from '../components/AppNav'

interface AnthologyEntry {
  id: number
  text: string
  author: string
  theme: string
  sentence_id: string | null
}

export default function Anthology() {
  const navigate = useNavigate()
  const [initials, setInitials] = useState('B')
  const [items, setItems] = useState<AnthologyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setInitials(data.user.email[0].toUpperCase())
    })

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      try {
        const { data, error: err } = await supabase
          .from('anthology')
          .select('id, text, author, theme, sentence_id')
          .eq('user_id', user.id)
          .order('id', { ascending: false })
        if (err) throw err
        setItems((data ?? []) as AnthologyEntry[])
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      <style>{`@keyframes blFade { from { opacity:0; } to { opacity:1; } }`}</style>
      <AppNav active="library" initials={initials} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px) 90px', animation: 'blFade .35s both' }}>
        <button onClick={() => navigate('/app')} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>← Today</button>

        <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(28px,3.6vw,42px)', margin: '0 0 8px' }}>Your anthology</h1>

        {error && <p style={{ color: 'red', font: '14px var(--sans)' }}>Error: {error}</p>}

        {loading ? (
          <p style={{ font: '400 15px var(--sans)', color: 'var(--soft)' }}>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ font: '400 15px var(--sans)', color: 'var(--soft)' }}>
            No lines kept yet. Read a sentence and keep the ones that stay with you.
          </p>
        ) : (
          <>
            <p style={{ font: '400 15px var(--sans)', color: 'var(--soft)', margin: '0 0 32px' }}>
              {items.length} line{items.length !== 1 ? 's' : ''} kept — gilded, and yours.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
              {items.map(a => (
                <button
                  key={a.id}
                  onClick={() => { if (a.sentence_id) navigate(`/app/sentence/${a.sentence_id}`) }}
                  style={{
                    textAlign: 'left', background: 'var(--card)', border: '1px solid var(--line)',
                    borderRadius: 18, padding: '26px 28px', boxShadow: 'var(--shadow-card)',
                    cursor: a.sentence_id ? 'pointer' : 'default',
                    display: 'flex', flexDirection: 'column', gap: 12, width: '100%',
                    transition: 'transform .2s, border-color .2s',
                  }}
                >
                  <span style={{ fontSize: 14, color: 'var(--gold)' }}>❧</span>
                  <p className="serif" style={{ fontSize: 19, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>
                    {a.text}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                    <span style={{ font: '400 13px var(--sans)', color: 'var(--soft)' }}>{a.author}</span>
                    {a.theme && a.theme !== 'kept' && (
                      <span style={{ font: '400 12px var(--sans)', color: 'var(--faint)', fontStyle: 'italic' }}>· {a.theme}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link to="/app/library" style={{ font: '500 13.5px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>Browse the library →</Link>
        </div>
      </main>
    </div>
  )
}
