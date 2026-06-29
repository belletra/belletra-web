import { useState, useCallback, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { getSentenceFull, getSentencePreview, getTodaySentence, addToAnthology, getSubscriptionStatus, type Sentence, type Word, type Lens, type SwapAlt, type SentencePreview } from '../lib/db'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

const VALUE_PROPS = [
  'Every sentence is hand-picked and deeply analysed — never generated, never crowdsourced.',
  'Learn the French that writers reached for, not just the French that gets you by.',
  'More sentences — and more languages — added every week.',
]

function PaywallGate({ userId, email }: { userId: string; email: string }) {
  const [plan, setPlan] = useState<'year' | 'month'>('year')
  const [loading, setLoading] = useState(false)
  const trailing = plan === 'year' ? 'then $9.99 / year' : 'then $1.99 / month'

  const startCheckout = async () => {
    if (!userId || loading) return
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan, userId, email },
      })
      if (error || !data?.url) throw error ?? new Error('No checkout URL')
      window.location.href = data.url
    } catch {
      setLoading(false)
    }
  }

  const PlanRow = ({ id, title, price, period, note, badge }: { id: 'year'|'month', title: string, price: string, period: string, note: string, badge?: string }) => (
    <button onClick={() => setPlan(id)} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 17px', borderRadius: 14, cursor: 'pointer',
      background: plan === id ? 'var(--goldBg)' : 'var(--card)',
      border: `1px solid ${plan === id ? 'var(--gold)' : 'var(--line)'}`,
      transition: 'all .2s cubic-bezier(.2,.7,.2,1)',
    }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${plan === id ? 'var(--gold)' : 'var(--line2)'}`, display: 'grid', placeItems: 'center' }}>
        {plan === id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span className="serif" style={{ fontSize: 18, color: 'var(--ink)' }}>{title}</span>
          {badge && <span style={{ font: '600 9px var(--sans)', letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: 6, padding: '3px 7px' }}>{badge}</span>}
        </div>
        <div style={{ font: '400 12px var(--sans)', color: 'var(--faint)', marginTop: 3 }}>{note}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ font: '600 16px var(--sans)', color: 'var(--ink)' }}>{price}</div>
        <div style={{ font: '400 11px var(--sans)', color: 'var(--faint)' }}>{period}</div>
      </div>
    </button>
  )

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 24, padding: 'clamp(28px,4vw,44px)', boxShadow: 'var(--shadow-card)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <div style={{ font: '600 11px var(--sans)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 13 }}>✦&nbsp; The full library</div>
        <div className="serif" style={{ fontSize: 27, lineHeight: 1.3, color: 'var(--ink)', marginBottom: 12 }}>
          You've read three.<br />Read the rest.
        </div>
        <div style={{ font: '400 13.5px/1.6 var(--sans)', color: 'var(--soft)', maxWidth: 320, margin: '0 auto' }}>
          The three you've met were chosen and annotated by hand. So are the hundreds waiting.
        </div>
      </div>

      {/* Value props */}
      <div style={{ background: 'var(--paper)', borderRadius: 14, padding: '18px', display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 18 }}>
        {VALUE_PROPS.map((v, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--gold)', fontSize: 13, lineHeight: 1.5, flexShrink: 0, marginTop: 1 }}>✦</span>
            <span style={{ font: '400 13.5px/1.55 var(--sans)', color: 'var(--soft)' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 18 }}>
        <PlanRow id="year" title="Yearly" price="$9.99" period="/ year" note="≈ $0.83 / month · 7-day free trial" badge="Best value · saves 58%" />
        <PlanRow id="month" title="Monthly" price="$1.99" period="/ month" note="7-day free trial" />
      </div>

      {/* CTA */}
      <button
        onClick={startCheckout}
        disabled={loading}
        style={{ width: '100%', font: '600 15px var(--sans)', color: 'var(--card)', background: (loading || !userId) ? 'var(--soft)' : 'var(--gold)', border: 'none', borderRadius: 999, padding: '15px 0', cursor: (loading || !userId) ? 'default' : 'pointer', boxShadow: 'var(--shadow-cta)', marginBottom: 10, transition: 'background .2s' }}
      >
        {loading ? 'Opening checkout…' : 'Start 7-day free trial →'}
      </button>
      <div style={{ font: '400 12px var(--sans)', color: 'var(--faint)', textAlign: 'center', marginBottom: 16 }}>
        Free for 7 days — {trailing}.
      </div>
      <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', fontStyle: 'italic', textAlign: 'center' }}>
        Cancel anytime. Grows with you.
      </div>
    </div>
  )
}

// ── Audio hook ────────────────────────────────────────────────────────────────

function useLineAudio(audioPath?: string | null) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
    setPlaying(false)
  }, [])
  const play = useCallback((text: string) => {
    if (playing) { stop(); return }
    const url = audioPath ? `${SUPABASE_URL}/storage/v1/object/public/audio/${audioPath}` : null
    if (url) {
      const a = new Audio(url); audioRef.current = a
      a.onended = stop; a.onerror = () => fallbackSpeak(text, stop, setPlaying)
      a.play().then(() => setPlaying(true)).catch(() => fallbackSpeak(text, stop, setPlaying))
    } else { fallbackSpeak(text, stop, setPlaying) }
  }, [playing, stop, audioPath])
  useEffect(() => () => stop(), [stop])
  return { play, stop, playing }
}

function fallbackSpeak(text: string, onEnd: () => void, setPlaying: (v: boolean) => void) {
  if (typeof speechSynthesis === 'undefined') return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'fr-FR'; u.rate = 0.82
  const fr = speechSynthesis.getVoices().find(v => (v.lang || '').toLowerCase().startsWith('fr'))
  if (fr) u.voice = fr
  u.onend = onEnd; u.onerror = onEnd
  speechSynthesis.cancel(); speechSynthesis.speak(u)
  setPlaying(true)
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function WordCard({ word, onClose }: { word: Word; onClose: () => void }) {
  const [showDeep, setShowDeep] = useState(false)
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '18px 20px', marginTop: 16, animation: 'blFade .22s cubic-bezier(.2,.7,.2,1) both', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 14, font: '400 18px var(--sans)', color: 'var(--faint)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingRight: 20 }}>
        <span className="serif" style={{ fontSize: 26, color: 'var(--blue)' }}>{word.token}</span>
        <span className="serif" style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--faint)' }}>{word.pos}</span>
      </div>
      <div style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--ink)', marginTop: 8 }}>{word.gloss}</div>
      {word.etymology_surface && (
        <div style={{ font: '400 13.5px/1.7 var(--sans)', color: 'var(--soft)', marginTop: 10 }}>
          <span style={{ color: 'var(--gold)' }}>↳ </span>{word.etymology_surface}
        </div>
      )}
      {word.etymology_deep && (
        <>
          {!showDeep ? (
            <button onClick={() => setShowDeep(true)} style={{ font: '500 12px var(--sans)', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 0', display: 'block' }}>the whole root ↓</button>
          ) : (
            <div style={{ font: '400 13px/1.75 var(--sans)', color: 'var(--soft)', marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 10, animation: 'blFade .2s both' }}>{word.etymology_deep}</div>
          )}
        </>
      )}
    </div>
  )
}

function TappableLine({ lines, words, selectedToken, onSelect, fontSize }: {
  lines: string[]; words: Word[]; selectedToken: string | null; onSelect: (tok: string | null) => void; fontSize: string
}) {
  const wordMap = new Map(words.map(w => [w.token.toLowerCase(), w]))
  const lookup = (tok: string) => wordMap.get(tok.toLowerCase()) ?? wordMap.get(tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase()) ?? null

  return (
    <div className="serif" style={{ fontSize, lineHeight: 1.45, color: 'var(--ink)', marginBottom: 4 }}>
      «&nbsp;{lines.map((line, li) => {
        const tokens = line.split(/(\s+)/)
        return (
          <span key={li}>
            {tokens.map((tok, ti) => {
              if (/^\s+$/.test(tok)) return <span key={ti}>{tok}</span>
              const clean = tok.replace(/[.,;:»«!?]/g, '')
              const word = lookup(clean)
              const isSel = selectedToken === clean || selectedToken === tok
              if (!word) return <span key={ti}>{tok}</span>
              return (
                <span key={ti} role="button" tabIndex={0}
                  onClick={() => onSelect(isSel ? null : (wordMap.has(clean.toLowerCase()) ? clean : tok))}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(isSel ? null : clean) } }}
                  style={{
                    cursor: 'pointer',
                    color: isSel ? 'var(--blue)' : 'var(--ink)',
                    borderBottom: `1.5px dashed ${isSel ? 'var(--blue)' : 'var(--gold)'}`,
                    paddingBottom: 1, borderRadius: 2,
                    transition: 'color .18s',
                  }}>{tok}</span>
              )
            })}
            {li < lines.length - 1 && <br />}
          </span>
        )
      })}&nbsp;»
    </div>
  )
}

function AnalysisCard({ title, accent, deep, children }: { title: string; accent?: string; deep?: string | null; children: React.ReactNode }) {
  const [showDeep, setShowDeep] = useState(false)
  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${accent || 'var(--line)'}`, borderRadius: 18, padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ font: '600 10px var(--sans)', letterSpacing: '.16em', textTransform: 'uppercase', color: accent ? 'var(--gold)' : 'var(--faint)', marginBottom: 16 }}>{title}</div>
      {children}
      {deep && (
        <>
          {showDeep ? (
            <div style={{ font: '400 13.5px/1.75 var(--sans)', color: 'var(--soft)', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)', animation: 'blFade .22s cubic-bezier(.2,.7,.2,1) both' }}>{deep}</div>
          ) : (
            <button onClick={() => setShowDeep(true)} style={{ font: '500 12px var(--sans)', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0 0', display: 'block' }}>go deeper ↓</button>
          )}
        </>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function Sentence() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<{ sentence: Sentence; words: Word[]; lenses: Lens[]; swaps: SwapAlt[] } | null>(null)
  const [preview, setPreview] = useState<SentencePreview | null>(null)
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [kept, setKept] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([
      getTodaySentence(),
      getSubscriptionStatus(),
      supabase.auth.getUser(),
    ]).then(([today, sub, { data: authData }]) => {
      const isSubscribed = sub.isSubscribed
      const isLocked = !isSubscribed && today?.id !== id
      setUserId(authData.user?.id ?? '')
      setUserEmail(authData.user?.email ?? '')
      setLocked(isLocked)
      if (isLocked) {
        getSentencePreview(id).then(p => { setPreview(p); setLoading(false) })
      } else {
        getSentenceFull(id).then(d => { setData(d); setLoading(false) })
      }
    })
  }, [id])

  const audio = useLineAudio(data?.sentence.audio)
  const fullText = data ? (data.sentence.lines ? data.sentence.lines.join(' ') : data.sentence.text) : ''

  const handleKeep = async () => {
    if (!data || kept) return
    setKept(true)
    await addToAnthology({
      text: data.sentence.text,
      author: data.sentence.author,
      theme: data.sentence.feature ?? '',
    })
  }

  if (loading) return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav active="library" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="sym" style={{ fontSize: 28, color: 'var(--faint)' }}>❧</span>
      </div>
    </div>
  )

  // Locked sentence — render preview only (no full data in browser)
  if (locked) {
    const p = preview
    if (!p) return (
      <div style={{ background: 'var(--paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppNav active="library" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, textAlign: 'center', padding: '40px 24px' }}>
          <div className="serif" style={{ fontSize: 24, color: 'var(--ink)' }}>Sentence not found.</div>
          <Link to="/app/library" style={{ font: '500 14px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>← Back to library</Link>
        </div>
      </div>
    )
    return (
      <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
        <style>{`
          @keyframes blFade { from { opacity:0; } to { opacity:1; } }
          .descent-cols { display: grid; grid-template-columns: minmax(320px,1fr) minmax(320px,1fr); gap: 48px; align-items: start; }
          @media (max-width: 760px) { .descent-cols { grid-template-columns: 1fr; } }
        `}</style>
        <AppNav active="library" />
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px) 90px', animation: 'blFade .35s cubic-bezier(.2,.7,.2,1) both' }}>
          <button onClick={() => navigate(-1)} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>←</button>
          <div className="descent-cols">
            <div style={{ position: 'sticky', top: 90 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ font: '600 10px var(--sans)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)' }}>
                  {p.author}{p.work ? ` · ${p.work}` : ''}{p.year ? ` · ${p.year}` : ''}
                </span>
              </div>
              <div className="serif" style={{ fontSize: 'clamp(34px,4.5vw,52px)', lineHeight: 1.45, color: 'var(--ink)' }}>
                «&nbsp;{p.text}&nbsp;»
              </div>
              {p.feature && (
                <div style={{ font: '400 13px var(--sans)', color: 'var(--gold)', marginTop: 16 }}>✦ {p.feature}</div>
              )}
              {/* Teaser of locked analysis layers */}
              <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 4 }}>Six lenses, fully written</div>
                {[
                  ['Grammar', 'The construction beneath the beauty'],
                  ['✦ Genius', 'What only French can do here'],
                  ['♪ Music', 'Sound, rhythm, breath'],
                  ['⇄ Turn', 'Where the meaning shifts'],
                  ['◦ Silence', 'What the line withholds'],
                  ['Words & roots', 'Every word, back to its origin'],
                ].map(([title, sub]) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, gap: 12, opacity: 0.55 }}>
                    <div>
                      <div style={{ font: '500 13px var(--sans)', color: 'var(--ink)' }}>{title}</div>
                      <div style={{ font: '400 11.5px var(--sans)', color: 'var(--faint)', marginTop: 2 }}>{sub}</div>
                    </div>
                    <span style={{ color: 'var(--faint)', fontSize: 13, flexShrink: 0 }}>🔒</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <PaywallGate userId={userId} email={userEmail} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav active="library" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, textAlign: 'center', padding: '40px 24px' }}>
        <div className="serif" style={{ fontSize: 24, color: 'var(--ink)' }}>Sentence not found.</div>
        <Link to="/app/library" style={{ font: '500 14px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>← Back to library</Link>
      </div>
    </div>
  )

  const { sentence, words, lenses } = data

  const grammar = lenses.find(l => l.kind === 'grammar')
  const genius = lenses.find(l => l.kind === 'genius')
  const ear = lenses.find(l => l.kind === 'ear')
  const turn = lenses.find(l => l.kind === 'turn')
  const silence = lenses.find(l => l.kind === 'silence')

  const displayLines = (sentence.lines && sentence.lines.length > 0) ? sentence.lines : [sentence.text]

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      <style>{`
        @keyframes blFade { from { opacity:0; } to { opacity:1; } }
        .descent-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .descent-cols { display: grid; grid-template-columns: minmax(320px,1fr) minmax(320px,1fr); gap: 48px; align-items: start; }
        @media (max-width: 760px) { .descent-grid { grid-template-columns: 1fr; } .descent-cols { grid-template-columns: 1fr; } }
      `}</style>
      <AppNav active="library" />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px) 90px', animation: 'blFade .35s cubic-bezier(.2,.7,.2,1) both' }}>
        <button onClick={() => navigate(-1)} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>←</button>

        <div className="descent-cols">

          {/* LEFT — sticky verse */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ font: '600 10px var(--sans)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)' }}>
                {sentence.author} · {sentence.work} · {sentence.year}
              </span>
            </div>
            {words.length > 0 ? (
              <TappableLine
                lines={displayLines}
                words={words}
                selectedToken={selectedToken}
                onSelect={setSelectedToken}
                fontSize="clamp(34px,4.5vw,52px)"
              />
            ) : (
              <div className="serif" style={{ fontSize: 'clamp(34px,4.5vw,52px)', lineHeight: 1.45, color: 'var(--ink)' }}>
                «&nbsp;{displayLines.map((line, i) => (
                  <span key={i}>{line}{i < displayLines.length - 1 && <br />}</span>
                ))}&nbsp;»
              </div>
            )}

            {selectedToken && (() => {
              const wordMap = new Map(words.map(w => [w.token.toLowerCase(), w]))
              const w = wordMap.get(selectedToken.toLowerCase()) ?? wordMap.get(selectedToken.charAt(0).toUpperCase() + selectedToken.slice(1).toLowerCase())
              return w ? <WordCard word={w} onClose={() => setSelectedToken(null)} /> : null
            })()}

            {!selectedToken && sentence.translation && (
              <div className="serif" style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--soft)', marginTop: 16, marginBottom: 14, lineHeight: 1.5 }}>
                {sentence.translation}
              </div>
            )}
            {words.length > 0 && !selectedToken && (
              <div style={{ font: '400 12px var(--sans)', color: 'var(--faint)', fontStyle: 'italic', marginBottom: 14 }}>tap any underlined word to open it</div>
            )}
            {selectedToken && sentence.translation && (
              <div className="serif" style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--soft)', marginTop: 8, marginBottom: 14, lineHeight: 1.5 }}>
                {sentence.translation}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => audio.play(fullText)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '500 14px var(--sans)', color: audio.playing ? 'var(--gold)' : 'var(--soft)', background: 'transparent', border: `1px solid ${audio.playing ? 'var(--gold)' : 'var(--line2)'}`, borderRadius: 999, padding: '11px 22px', cursor: 'pointer', transition: 'color .18s, border-color .18s' }}>
                {audio.playing ? <><span>♪</span> listening…</> : <><span>▶</span> Hear it</>}
              </button>
              {!kept ? (
                <button onClick={handleKeep} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '500 14px var(--sans)', color: 'var(--gold)', background: 'var(--goldBg)', border: '1px solid var(--line2)', borderRadius: 999, padding: '11px 22px', cursor: 'pointer' }}>
                  <span>❦</span> Keep this line
                </button>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '500 14px var(--sans)', color: 'var(--faint)', fontStyle: 'italic', padding: '11px 0' }}>
                  ✓ kept in your anthology
                </div>
              )}
            </div>
            {sentence.plain_register && (
              <div style={{ marginTop: 28, padding: '16px 20px', background: 'var(--goldBg)', borderRadius: 14 }}>
                <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Useful vs beautiful</div>
                <div style={{ font: '400 13px/1.65 var(--sans)', color: 'var(--soft)' }}>{sentence.plain_register}</div>
              </div>
            )}
          </div>

          {/* RIGHT — analysis cards or paywall */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {locked ? <PaywallGate userId={userId} email={userEmail} /> : (<>

            {grammar && (
              <AnalysisCard title={`Grammar — ${grammar.name ?? ''}`} deep={grammar.deep}>
                <div style={{ font: '400 14.5px/1.75 var(--sans)', color: 'var(--ink)', marginBottom: 12 }}>{grammar.surface}</div>
                {grammar.rule && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(70,115,190,.1)', color: 'var(--blue)', font: '500 12.5px/1.5 var(--sans)' }}>{grammar.rule}</div>
                )}
              </AnalysisCard>
            )}

            {genius && (
              <AnalysisCard title={`✦ Only in French — ${genius.name ?? ''}`} accent="var(--gold)" deep={genius.deep}>
                <div style={{ font: '400 14.5px/1.75 var(--sans)', color: 'var(--ink)', marginBottom: 12 }}>{genius.surface}</div>
                {genius.contrast && (
                  <div style={{ font: '400 13px/1.6 var(--sans)', color: 'var(--faint)', paddingTop: 12, borderTop: '1px solid var(--line)' }}>{genius.contrast}</div>
                )}
              </AnalysisCard>
            )}

            {(ear || turn || silence) && (
              <div className="descent-grid">
                {ear && (
                  <AnalysisCard title="♪ The music" deep={ear.deep}>
                    <div style={{ font: '400 13.5px/1.7 var(--sans)', color: 'var(--soft)' }}>{ear.surface}</div>
                  </AnalysisCard>
                )}
                {turn && (
                  <AnalysisCard title="⇄ The turn" deep={turn.deep}>
                    <div style={{ font: '400 13.5px/1.7 var(--sans)', color: 'var(--soft)' }}>{turn.surface}</div>
                  </AnalysisCard>
                )}
                {silence && (
                  <AnalysisCard title="◦ The silence" deep={silence.deep}>
                    <div style={{ font: '400 13.5px/1.7 var(--sans)', color: 'var(--soft)' }}>{silence.surface}</div>
                  </AnalysisCard>
                )}
                <AnalysisCard title="Bring it back">
                  <div style={{ font: '400 13.5px/1.7 var(--sans)', color: 'var(--soft)', marginBottom: 14 }}>These words will come back in review — spaced so you keep them just before you forget.</div>
                  <Link to="/app/review" style={{ display: 'inline-block', font: '600 13.5px var(--sans)', color: 'var(--gold)', background: 'var(--goldBg)', border: '1px solid var(--line2)', borderRadius: 999, padding: '9px 18px', textDecoration: 'none' }}>Review now →</Link>
                </AnalysisCard>
              </div>
            )}

          </>)}
          </div>
        </div>
      </div>
    </div>
  )
}
