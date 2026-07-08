import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AppNav } from '../components/AppNav'
import { getReadSentenceIds } from '../lib/db'

interface AnthologyEntry {
  id: number
  text: string
  author: string
  theme: string
  sentence_id: string | null
}

async function getAllAnthology(): Promise<AnthologyEntry[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('anthology')
    .select('id, text, author, theme, sentence_id')
    .eq('user_id', user.id)
    .order('id', { ascending: false })
  if (error) { console.error('anthology fetch error:', error); return [] }
  return (data ?? []) as AnthologyEntry[]
}

export default function Anthology() {
  const navigate = useNavigate()
  const [initials, setInitials] = useState('B')
  const [items, setItems] = useState<AnthologyEntry[]>([])
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())
  const [hideDone, setHideDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setInitials(data.user.email[0].toUpperCase())
    })
    Promise.all([getAllAnthology(), getReadSentenceIds()]).then(([data, done]) => {
      setItems(data)
      setDoneIds(done)
      setLoading(false)
    })
  }, [])

  const doneCount = items.filter(a => a.sentence_id && doneIds.has(a.sentence_id)).length
  const visible = hideDone
    ? items.filter(a => !a.sentence_id || !doneIds.has(a.sentence_id))
    : items

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      <style>{`
        @keyframes blFade { from { opacity:0; } to { opacity:1; } }
        .anth-card {
          text-align: left; background: var(--card); border: 1px solid var(--line);
          border-radius: 18px; padding: 26px 28px; box-shadow: var(--shadow-card);
          cursor: pointer; transition: transform .2s cubic-bezier(.2,.7,.2,1), border-color .2s;
          display: flex; flex-direction: column; gap: 12px; width: 100%;
        }
        .anth-card:hover { transform: translateY(-3px); border-color: var(--gold); }
        .anth-card.done-card { opacity: 0.6; }
      `}</style>
      <AppNav active="library" initials={initials} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px) 90px', animation: 'blFade .35s cubic-bezier(.2,.7,.2,1) both' }}>
        <button onClick={() => navigate('/app')} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>← Today</button>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <div>
            <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(28px,3.6vw,42px)', margin: '0 0 8px' }}>Your anthology</h1>
            <p style={{ font: '400 15px var(--sans)', color: 'var(--soft)', margin: 0 }}>
              {loading ? '' : `${visible.length}${hideDone ? ` of ${items.length}` : ''} line${items.length !== 1 ? 's' : ''} kept — gilded, and yours.`}
            </p>
          </div>
          {doneCount > 0 && (
            <button
              onClick={() => setHideDone(h => !h)}
              style={{
                font: '500 13px var(--sans)', border: '1px solid var(--line2)', borderRadius: 20,
                padding: '7px 16px', cursor: 'pointer', background: hideDone ? 'var(--goldBg)' : 'var(--card)',
                color: hideDone ? 'var(--gold)' : 'var(--soft)', borderColor: hideDone ? 'var(--gold)' : 'var(--line2)',
                transition: 'all .15s',
              }}
            >
              {hideDone ? `Showing unread (${visible.length})` : `Hide done (${doneCount})`}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', font: '400 15px var(--sans)', color: 'var(--faint)' }}>
            <span className="sym" style={{ fontSize: 22, display: 'block', marginBottom: 12 }}>❧</span>
            Loading…
          </div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', font: '400 15px var(--sans)', color: 'var(--faint)' }}>
            <span className="sym" style={{ fontSize: 28, display: 'block', marginBottom: 14 }}>❧</span>
            {items.length === 0
              ? 'No lines kept yet. Read a sentence and keep the ones that stay with you.'
              : 'All kept lines are done — toggle filter to see them.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {visible.map(a => {
              const isDone = !!a.sentence_id && doneIds.has(a.sentence_id)
              return (
                <button
                  key={a.id}
                  className={`anth-card${isDone ? ' done-card' : ''}`}
                  onClick={() => { if (a.sentence_id) navigate(`/app/sentence/${a.sentence_id}`) }}
                  style={{ cursor: a.sentence_id ? 'pointer' : 'default' }}
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
                    {isDone && <span style={{ font: '600 10px var(--sans)', color: 'var(--faint)', marginLeft: 'auto' }}>✓ done</span>}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {items.length > 0 && (
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Link to="/app/library" style={{ font: '500 13.5px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>Browse the library →</Link>
          </div>
        )}
      </main>
    </div>
  )
}
