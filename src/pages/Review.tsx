import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AppNav } from '../components/AppNav'
import { getWordQueue, type WordQueueItem } from '../lib/db'

export default function Review() {
  const navigate = useNavigate()
  const [initials, setInitials] = useState('B')
  const [queue, setQueue] = useState<WordQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setInitials(data.user.email[0].toUpperCase())
    })
    getWordQueue().then(q => { setQueue(q); setLoading(false) })
  }, [])

  const advance = () => {
    if (idx + 1 < queue.length) { setIdx(idx + 1); setRevealed(false) }
    else setDone(true)
  }

  const w = queue[idx]

  if (loading) return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav active="review" initials={initials} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="sym" style={{ fontSize: 28, color: 'var(--faint)' }}>❧</span>
      </div>
    </div>
  )

  if (queue.length === 0) return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav active="review" initials={initials} />
      <main style={{ maxWidth: 660, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px)', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <button onClick={() => navigate('/app')} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, alignSelf: 'flex-start', padding: 0 }}>← Today</button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 14 }}>
          <div className="sym" style={{ fontSize: 32, color: 'var(--gold)' }}>✧</div>
          <div className="serif" style={{ fontSize: 26, color: 'var(--ink)' }}>Nothing to review yet.</div>
          <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', maxWidth: 360, margin: 0 }}>Read a sentence from the library and keep the words that move you — they'll appear here when it's time to bring them back.</p>
          <button onClick={() => navigate('/app/library')} style={{ font: '600 14px var(--sans)', color: 'var(--card)', background: 'var(--gold)', border: 'none', padding: '13px 28px', borderRadius: 999, cursor: 'pointer', marginTop: 8 }}>Go to the library →</button>
        </div>
      </main>
    </div>
  )

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes blFade { from { opacity:0; } to { opacity:1; } }`}</style>
      <AppNav active="review" initials={initials} />
      <main style={{ maxWidth: 660, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px) 90px', animation: 'blFade .35s cubic-bezier(.2,.7,.2,1) both', minHeight: '70vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
        <button onClick={() => navigate('/app')} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, alignSelf: 'flex-start', padding: 0 }}>← Today</button>

        {!done ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ font: '600 11px var(--sans)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'center', marginBottom: 20 }}>
              Bringing back · {idx + 1} of {queue.length}
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 24, boxShadow: 'var(--shadow-card)', padding: 'clamp(36px,6vw,64px) 32px', textAlign: 'center', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
              {w.sentence_text && (
                <div className="serif" style={{ fontSize: 'clamp(15px,2.2vw,18px)', fontStyle: 'italic', color: 'var(--soft)', lineHeight: 1.6 }}>
                  {w.sentence_text.split(new RegExp(`(${w.token})`, 'i')).map((part, i) =>
                    part.toLowerCase() === w.token.toLowerCase()
                      ? <span key={i} style={{ color: 'var(--gold)', fontStyle: 'normal', fontWeight: 600 }}>{part}</span>
                      : part
                  )}
                </div>
              )}
              <div className="serif" style={{ fontSize: 'clamp(28px,4.5vw,44px)', color: 'var(--ink)' }}>{w.token}</div>
              {revealed && (
                <div style={{ animation: 'blFade .25s both' }}>
                  <div className="serif" style={{ fontSize: 20, fontStyle: 'italic', color: 'var(--gold)' }}>{w.gloss}</div>
                  {w.source_author && <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', marginTop: 10 }}>— {w.source_author}</div>}
                </div>
              )}
            </div>
            <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', gap: 12 }}>
              {!revealed ? (
                <button onClick={() => setRevealed(true)} style={{ font: '600 14px var(--sans)', color: 'var(--card)', background: 'var(--ink)', border: 'none', padding: '14px 32px', borderRadius: 999, cursor: 'pointer' }}>Show meaning</button>
              ) : (
                <>
                  <button onClick={advance} style={{ font: '600 14px var(--sans)', color: 'var(--rose)', background: 'transparent', border: '1px solid var(--rose)', padding: '13px 28px', borderRadius: 999, cursor: 'pointer' }}>Again</button>
                  <button onClick={advance} style={{ font: '600 14px var(--sans)', color: 'var(--card)', background: 'var(--green)', border: 'none', padding: '14px 30px', borderRadius: 999, cursor: 'pointer' }}>Got it</button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 18 }}>
            <div className="sym" style={{ fontSize: 34, color: 'var(--gold)' }}>✓</div>
            <div className="serif" style={{ fontSize: 30, color: 'var(--ink)' }}>{queue.length === 1 ? 'One line, kept close.' : `${queue.length} lines, kept close.`}</div>
            <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', maxWidth: 380, margin: 0 }}>We'll bring the next ones back when you're about to forget them. See you tomorrow.</p>
            <button onClick={() => navigate('/app')} style={{ font: '600 15px var(--sans)', color: 'var(--card)', background: 'var(--gold)', border: 'none', padding: '14px 30px', borderRadius: 999, cursor: 'pointer', boxShadow: 'var(--shadow-cta)', marginTop: 8 }}>Back to today</button>
          </div>
        )}
      </main>
    </div>
  )
}
