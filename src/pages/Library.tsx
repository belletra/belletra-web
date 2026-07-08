import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AppNav } from '../components/AppNav'
import { getAllSentences, getTodaySentence, getSubscriptionStatus, getReadSentenceIds, type SentenceCard } from '../lib/db'

export default function Library() {
  const navigate = useNavigate()
  const [initials, setInitials] = useState('B')
  const [sentences, setSentences] = useState<SentenceCard[]>([])
  const [loading, setLoading] = useState(true)
  const [todayId, setTodayId] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())
  const [hideDone, setHideDone] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setInitials(data.user.email[0].toUpperCase())
    })
    Promise.all([getAllSentences(), getTodaySentence(), getSubscriptionStatus(), getReadSentenceIds()]).then(([data, today, sub, done]) => {
      setSentences(data)
      setTodayId(today?.id ?? null)
      setIsSubscribed(sub.isSubscribed)
      setDoneIds(done)
      setLoading(false)
    })
  }, [])

  const isFree = (s: SentenceCard) => isSubscribed || s.id === todayId
  const visible = hideDone ? sentences.filter(s => !doneIds.has(s.id)) : sentences

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      <style>{`
        @keyframes blFade { from { opacity:0; } to { opacity:1; } }
        .lib-card {
          text-align: left; background: var(--card); border: 1px solid var(--line);
          border-radius: 18px; padding: 26px 28px; box-shadow: var(--shadow-card);
          cursor: pointer; transition: transform .2s cubic-bezier(.2,.7,.2,1), border-color .2s;
          display: flex; flex-direction: column; gap: 14px; width: 100%;
        }
        .lib-card:hover { transform: translateY(-3px); border-color: var(--gold); }
        .lib-card.locked { opacity: 0.68; cursor: pointer; }
        .lib-card.locked:hover { transform: translateY(-2px); border-color: var(--line2); }
      `}</style>
      <AppNav active="library" initials={initials} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px) 90px', animation: 'blFade .35s cubic-bezier(.2,.7,.2,1) both' }}>
        <button onClick={() => navigate('/app')} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>← Today</button>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <div>
            <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(28px,3.6vw,42px)', margin: '0 0 8px' }}>The library</h1>
            <p style={{ font: '400 15px var(--sans)', color: 'var(--soft)', margin: 0 }}>
              {loading ? '' : `${visible.length}${hideDone ? ` of ${sentences.length}` : ''} lines, each authored to full depth — a new one every day.`}
            </p>
          </div>
          {doneIds.size > 0 && (
            <button
              onClick={() => setHideDone(h => !h)}
              style={{
                font: '500 13px var(--sans)', border: '1px solid var(--line2)', borderRadius: 20,
                padding: '7px 16px', cursor: 'pointer', background: hideDone ? 'var(--goldBg)' : 'var(--card)',
                color: hideDone ? 'var(--gold)' : 'var(--soft)', borderColor: hideDone ? 'var(--gold)' : 'var(--line2)',
                transition: 'all .15s',
              }}
            >
              {hideDone ? `Showing unread (${visible.length})` : `Hide done (${doneIds.size})`}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', font: '400 15px var(--sans)', color: 'var(--faint)' }}>
            <span className="sym" style={{ fontSize: 22, display: 'block', marginBottom: 12 }}>❧</span>
            Loading…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {visible.map(s => {
              const free = isFree(s)
              const done = doneIds.has(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/app/sentence/${s.id}`)}
                  className={`lib-card${free ? '' : ' locked'}`}
                >
                  <div style={{ position: 'relative' }}>
                    {s.id === todayId && (
                      <span style={{ position: 'absolute', top: 0, right: 0, font: '600 9px var(--sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)', background: 'var(--goldBg)', border: '1px solid var(--gold)', borderRadius: 6, padding: '3px 7px' }}>today</span>
                    )}
                    {!free && (
                      <span style={{ position: 'absolute', top: 0, right: 0, fontSize: 13, color: 'var(--faint)' }}>🔒</span>
                    )}
                    {done && free && s.id !== todayId && (
                      <span style={{ position: 'absolute', top: 0, right: 0, fontSize: 13, color: 'var(--faint)' }}>✓</span>
                    )}
                    <div className="serif" style={{ fontSize: 19, fontStyle: 'italic', color: done ? 'var(--soft)' : 'var(--ink)', lineHeight: 1.4, paddingRight: (s.id === todayId || !free || done) ? 44 : 0 }}>
                      «&#8201;{s.text}&#8201;»
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ font: '400 13px var(--sans)', color: 'var(--soft)' }}>{s.author}</span>
                    <span style={{ font: '600 9px var(--sans)', letterSpacing: '.06em', color: 'var(--gold)', border: '1px solid var(--line2)', borderRadius: 5, padding: '2px 6px' }}>{s.cefr}</span>
                  </div>
                  <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', fontStyle: 'italic', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{s.feature}</div>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
