import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useDarkMode } from '../hooks/useDarkMode'
import {
  getTodaySentence, getTomorrowSentence, getAllSentences,
  getAnthology, getAnthologyCount, getWordQueue, getReadingLog,
  type Sentence, type SentenceCard, type AnthologyItem, type WordQueueItem
} from '../lib/db'

const DAYS_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
type DayStatus = 'done' | 'today' | 'skipped' | 'future'

function buildRhythm(logDates: string[]): { status: DayStatus; label: string }[] {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  // Build Mon–Sun of the current week
  const dayOfWeek = today.getDay() // 0=Sun
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    const ds = d.toISOString().slice(0, 10)
    const label = DAYS_LABELS[i]
    if (ds === todayStr) return { status: 'today', label }
    if (ds > todayStr) return { status: 'future', label }
    return { status: logDates.includes(ds) ? 'done' : 'skipped', label }
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [dark, setDark] = useDarkMode()
  const [user, setUser] = useState<{ email?: string; user_metadata?: Record<string, string> } | null>(null)
  const [todaySentence, setTodaySentence] = useState<Sentence | null>(null)
  const [tomorrowSentence, setTomorrowSentence] = useState<Pick<Sentence,'id'|'text'|'teaser'|'author'|'ord'|'status'> | null>(null)
  const [libraryPreview, setLibraryPreview] = useState<SentenceCard[]>([])
  const [libraryCount, setLibraryCount] = useState(0)
  const [anthology, setAnthology] = useState<AnthologyItem[]>([])
  const [anthologyCount, setAnthologyCount] = useState(0)
  const [wordQueue, setWordQueue] = useState<WordQueueItem[]>([])
  const [rhythm, setRhythm] = useState<{ status: DayStatus; label: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))

    Promise.all([
      getTodaySentence(),
      getTomorrowSentence(),
      getAllSentences(),
      getAnthology(3),
      getAnthologyCount(),
      getWordQueue(),
      getReadingLog(),
    ]).then(([today, tomorrow, all, anth, anthCount, queue, log]) => {
      setTodaySentence(today)
      setTomorrowSentence(tomorrow)
      setLibraryCount(all.length)
      // Library preview: one row (4 cards) excluding today's
      setLibraryPreview(all.filter(s => s.id !== today?.id).slice(0, 4))
      setAnthology(anth)
      setAnthologyCount(anthCount)
      setWordQueue(queue)
      const logDates = log.map(e => e.read_date)
      setRhythm(buildRhythm(logDates))
      setLoading(false)
    })
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const [searchParams, setSearchParams] = useSearchParams()
  const upgraded = searchParams.get('upgraded') === 'true'

  useEffect(() => {
    if (upgraded) {
      const t = setTimeout(() => {
        searchParams.delete('upgraded')
        setSearchParams(searchParams, { replace: true })
      }, 5000)
      return () => clearTimeout(t)
    }
  }, [upgraded])

  const now = new Date()
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const initials = user?.email ? user.email[0].toUpperCase() : 'B'
  const avatarUrl = user?.user_metadata?.avatar_url ?? null

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh', transition: 'background .5s cubic-bezier(.2,.7,.2,1), color .5s cubic-bezier(.2,.7,.2,1)' }}>
      <style>{`
        @keyframes blSlideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:none; } }
        .dash-nav-btn { font: 500 14px var(--sans); color: var(--soft); background: none; border: none; cursor: pointer; padding: 6px 2px; transition: color .18s; }
        .dash-nav-btn:hover { color: var(--ink); }
        .dash-nav-btn.active { color: var(--ink); }
        .dash-toggle:hover { color: var(--ink); border-color: var(--gold) !important; }
        .dash-read-btn:hover { filter: brightness(1.06); }
        .dash-anth-card { text-align: left; cursor: pointer; transition: transform .2s cubic-bezier(.2,.7,.2,1), border-color .2s; }
        .dash-anth-card:hover { transform: translateY(-3px); border-color: var(--gold) !important; }
        .dash-lib-card { text-align: left; cursor: pointer; transition: transform .2s cubic-bezier(.2,.7,.2,1), border-color .2s; }
        .dash-lib-card:hover { transform: translateY(-3px); border-color: var(--gold) !important; }
        .dash-review-btn:hover { background: var(--ink); color: var(--card); }
        .dash-acct-btn:hover { border-color: var(--gold) !important; }
        @media (min-width: 541px) { .dash-nav-mobile { display: none !important; } }
        @media (max-width: 540px) { .dash-nav-desktop { display: none !important; } }
        @media (max-width: 720px) { .dash-hero { flex-direction: column !important; } .dash-progress { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .dash-progress { grid-template-columns: 1fr !important; } }
        @keyframes blFade { from { opacity:0; } to { opacity:1; } }
      `}</style>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--paper)', borderBottom: '1px solid var(--line)', transition: 'background .5s cubic-bezier(.2,.7,.2,1)' }}>
        {/* Top row: logo + actions */}
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(12px,4vw,32px)', height: 52, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/app" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--card)', border: '1px solid var(--line2)', display: 'grid', placeItems: 'center', position: 'relative', boxShadow: 'var(--shadow-card)', flexShrink: 0 }}>
              <span className="serif" style={{ fontSize: 18, lineHeight: 1, color: 'var(--ink)' }}>B</span>
              <span className="sym" style={{ position: 'absolute', right: 4, bottom: 4, fontSize: 5, color: 'var(--gold)', lineHeight: 1 }}>✧</span>
            </span>
            <span className="serif" style={{ fontSize: 19, letterSpacing: '.02em', color: 'var(--ink)' }}>Belletra</span>
          </Link>
          {/* Desktop nav links inline */}
          <nav className="dash-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 22, marginRight: 10 }}>
            <span className="dash-nav-btn active" style={{ color: 'var(--ink)' }}>Today</span>
            <Link to="/app/library" className="dash-nav-btn" style={{ textDecoration: 'none' }}>Library</Link>
            <Link to="/app/review" className="dash-nav-btn" style={{ textDecoration: 'none' }}>Review</Link>
          </nav>
          <button onClick={() => setDark(d => !d)} aria-label="toggle dark mode" className="dash-toggle"
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line2)', background: 'var(--card)', color: 'var(--soft)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0 }}>
            {dark ? '☀' : '☾'}
          </button>
          <button onClick={() => navigate('/app/account')} aria-label="account" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line2)', display: 'block' }} />
              : <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--goldBg)', border: '1px solid var(--line2)', display: 'grid', placeItems: 'center', font: '600 12px var(--sans)', color: 'var(--gold)' }}>{initials}</span>
            }
          </button>
        </div>
        {/* Mobile-only nav links row */}
        <div className="dash-nav-mobile" style={{ borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-around', padding: '0 clamp(12px,4vw,32px)' }}>
          <span className="dash-nav-btn active" style={{ color: 'var(--ink)', padding: '10px 8px' }}>Today</span>
          <Link to="/app/library" className="dash-nav-btn" style={{ textDecoration: 'none', padding: '10px 8px' }}>Library</Link>
          <Link to="/app/review" className="dash-nav-btn" style={{ textDecoration: 'none', padding: '10px 8px' }}>Review</Link>
        </div>
      </header>

      {upgraded && (
        <div style={{ background: 'var(--gold)', color: '#fff', textAlign: 'center', padding: '14px 24px', font: '500 14px var(--sans)', animation: 'blSlideDown .4s cubic-bezier(.2,.7,.2,1) both' }}>
          ✦ Welcome to Belletra — every sentence is now yours.
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <span className="sym" style={{ fontSize: 32, color: 'var(--faint)', opacity: .6 }}>❧</span>
        </div>
      ) : (
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(28px,5vw,52px) clamp(16px,4vw,32px) 80px', animation: 'blFade .4s cubic-bezier(.2,.7,.2,1) both' }}>

        {/* TODAY */}
        {todaySentence && (
        <section>
          <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            {dateLabel} &nbsp;·&nbsp; Today's sentence
          </div>
          <div className="dash-hero" style={{ display: 'flex', gap: 'clamp(24px,4vw,48px)', flexWrap: 'wrap', alignItems: 'stretch' }}>
            {/* Sentence card */}
            <div style={{ flex: '2 1 420px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 24, padding: 'clamp(28px,4vw,46px)', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginBottom: 18 }}>
                {todaySentence.author} · <span className="serif" style={{ fontStyle: 'italic' }}>{todaySentence.work}</span> · {todaySentence.year}
              </div>
              <div className="serif" style={{ fontSize: 'clamp(24px,3.2vw,38px)', lineHeight: 1.4, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 18 }}>
                «&#8201;{todaySentence.text}&#8201;»
              </div>
              {todaySentence.translation && (
                <div className="serif" style={{ fontSize: 15, color: 'var(--soft)', fontStyle: 'italic', marginBottom: 28 }}>
                  "{todaySentence.translation}"
                </div>
              )}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                <Link to={`/app/sentence/${todaySentence.id}`} className="dash-read-btn" style={{
                  font: '600 15px var(--sans)', color: 'var(--card)', background: 'var(--gold)',
                  border: 'none', padding: '14px 26px', borderRadius: 999, cursor: 'pointer',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 9,
                  boxShadow: 'var(--shadow-cta)', transition: 'filter .18s',
                }}>
                  <span className="sym" style={{ fontSize: 13 }}>❦</span> Read it deeply
                </Link>
                <span style={{ font: '400 13px var(--sans)', color: 'var(--faint)' }}>8 steps · about 6 minutes</span>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Reading rhythm */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 16 }}>Your reading rhythm</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                  {rhythm.map((day, i) => {
                    const s = day.status
                    const circleStyle: React.CSSProperties = s === 'done'
                      ? { background: 'var(--gold)', color: 'var(--card)', font: '600 12px var(--sans)', border: 'none' }
                      : s === 'today'
                      ? { background: 'var(--goldBg)', border: '1.5px solid var(--gold)', color: 'var(--gold)', font: '600 12px var(--sans)' }
                      : s === 'skipped'
                      ? { border: '1.5px solid var(--line2)', color: 'var(--faint)', fontFamily: 'var(--sym)' }
                      : { border: '1.5px solid var(--line2)' }
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', ...circleStyle }}>
                          {s === 'done' ? '✓' : s === 'today' ? '●' : s === 'skipped' ? '❄' : ''}
                        </div>
                        <div style={{ font: '400 11px var(--sans)', color: s === 'today' ? 'var(--gold)' : 'var(--faint)', marginTop: 6 }}>{day.label}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ font: '400 12.5px var(--sans)', color: 'var(--soft)', fontStyle: 'italic', marginTop: 16 }}>A missed day breaks nothing.</div>
              </div>

              {/* Tomorrow */}
              {tomorrowSentence && (
                <div style={{ background: 'var(--paper2)', border: '1px solid var(--line)', borderRadius: 20, padding: 24 }}>
                  <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 12 }}>Tomorrow</div>
                  <div className="serif" style={{ fontSize: 17, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.4 }}>«&#8201;{tomorrowSentence.teaser ?? tomorrowSentence.text}&#8201;»</div>
                  <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', marginTop: 8 }}>{tomorrowSentence.author} · arriving tomorrow</div>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* PROGRESS */}
        <section style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
          <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(24px,3vw,32px)', margin: '0 0 6px' }}>Your progress</h2>
          <p style={{ font: '400 14.5px var(--sans)', color: 'var(--soft)', margin: '0 0 26px' }}>The quiet proof that it's working.</p>
          {/* Words to bring back — own row, natural height */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: 26, boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Words to bring back</div>
            {wordQueue.length === 0 ? (
              <div style={{ flex: 1, font: '400 13.5px/1.65 var(--sans)', color: 'var(--faint)', fontStyle: 'italic' }}>No words queued yet — keep a line to add words.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>
                {wordQueue.slice(0, 4).map(w => (
                  <div key={w.token} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>{w.token}</span>
                    <span style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)' }}>{w.gloss}</span>
                  </div>
                ))}
                {wordQueue.length > 4 && <div style={{ font: '400 12px var(--sans)', color: 'var(--faint)' }}>+{wordQueue.length - 4} more</div>}
              </div>
            )}
            {wordQueue.length > 0 && (
              <Link to="/app/review" className="dash-review-btn" style={{
                marginTop: 20, font: '600 13.5px var(--sans)', color: 'var(--ink)',
                background: 'transparent', border: '1px solid var(--ink)', borderRadius: 999,
                padding: 11, cursor: 'pointer', textDecoration: 'none', textAlign: 'center',
                transition: 'background .18s, color .18s', display: 'block',
              }}>Review {wordQueue.length} word{wordQueue.length !== 1 ? 's' : ''} · 2 min</Link>
            )}
          </div>

          {/* 3 stat cards — own flex row so they all match each other's height */}
          <div className="dash-progress" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 18 }}>

            {/* Streak */}
            <div style={{ background: 'var(--paper2)', border: '1px solid var(--line)', borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column' }}>
              <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 14 }}>Reading streak</div>
              <div className="serif" style={{ fontSize: 34, color: 'var(--ink)' }}>
                {rhythm.filter(d => d.status === 'done').length}
              </div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginTop: 4 }}>
                day{rhythm.filter(d => d.status === 'done').length !== 1 ? 's' : ''} this week
              </div>
            </div>

            {/* Anthology count */}
            <div style={{ background: 'var(--paper2)', border: '1px solid var(--line)', borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column' }}>
              <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 14 }}>Your anthology</div>
              <div className="serif" style={{ fontSize: 34, color: 'var(--ink)' }}>{anthologyCount}</div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginTop: 4 }}>line{anthologyCount !== 1 ? 's' : ''} kept</div>
            </div>

            {/* Library count */}
            <Link to="/app/library" style={{ textDecoration: 'none', display: 'flex' }}>
            <div style={{ background: 'var(--paper2)', border: '1px solid var(--line)', borderRadius: 20, padding: 26, cursor: 'pointer', transition: 'border-color .2s', display: 'flex', flexDirection: 'column', flex: 1 }} className="dash-lib-card">
              <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 14 }}>The library</div>
              <div className="serif" style={{ fontSize: 34, color: 'var(--gold)' }}>{libraryCount}</div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginTop: 4 }}>sentences in the canon so far</div>
              <div style={{ font: '500 13px var(--sans)', color: 'var(--gold)', marginTop: 'auto', paddingTop: 14 }}>Browse all →</div>
            </div>
            </Link>
          </div>
        </section>

        {/* ANTHOLOGY */}
        {anthology.length > 0 && (
        <section style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div>
              <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(24px,3vw,32px)', margin: '0 0 6px' }}>Your anthology</h2>
              <p style={{ font: '400 14.5px var(--sans)', color: 'var(--soft)', margin: 0 }}>The lines you've kept — gilded, and yours.</p>
            </div>
            <Link to="/app/anthology" style={{ font: '500 13.5px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>See all {anthologyCount} →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 18 }}>
            {anthology.map(a => (
              <Link key={a.id} to="/app/anthology" className="dash-anth-card" style={{
                background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18,
                padding: '26px 28px', boxShadow: 'var(--shadow-card)', display: 'block', textDecoration: 'none',
              }}>
                <div className="sym" style={{ fontSize: 15, color: 'var(--gold)', marginBottom: 12 }}>❦</div>
                <div className="serif" style={{ fontSize: 19, fontStyle: 'italic', lineHeight: 1.45, color: 'var(--ink)' }}>{a.text}</div>
                <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', marginTop: 12 }}>
                  {a.author} · <span style={{ fontStyle: 'italic' }}>{a.theme}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        )}

        {/* LIBRARY PREVIEW */}
        {libraryPreview.length > 0 && (
        <section style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div>
              <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(24px,3vw,32px)', margin: '0 0 6px' }}>The library</h2>
              <p style={{ font: '400 14.5px var(--sans)', color: 'var(--soft)', margin: 0 }}>More lines, waiting for you.</p>
            </div>
            <Link to="/app/library" style={{ font: '500 13.5px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>Browse all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 16 }}>
            {libraryPreview.map(ln => (
              <Link key={ln.id} to={`/app/sentence/${ln.id}`} className="dash-lib-card" style={{
                background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16,
                padding: '22px 24px', boxShadow: 'var(--shadow-card)', display: 'flex',
                flexDirection: 'column', gap: 14, textDecoration: 'none',
              }}>
                <div className="serif" style={{ fontSize: 17, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.4 }}>«&#8201;{ln.text}&#8201;»</div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ font: '400 13px var(--sans)', color: 'var(--soft)' }}>{ln.author}</span>
                  <span style={{ font: '600 9px var(--sans)', letterSpacing: '.06em', color: 'var(--gold)', border: '1px solid var(--line2)', borderRadius: 5, padding: '2px 6px' }}>{ln.cefr}</span>
                </div>
                <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', fontStyle: 'italic' }}>{ln.feature}</div>
              </Link>
            ))}
          </div>
        </section>
        )}

        {/* ACCOUNT STRIP */}
        <section style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: 'clamp(24px,3vw,34px)', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line2)', flexShrink: 0 }} />
              : <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--goldBg)', border: '1px solid var(--line2)', display: 'grid', placeItems: 'center', font: '600 18px var(--sans)', color: 'var(--gold)', flexShrink: 0 }}>{initials}</span>
            }
            <div style={{ flex: '1 1 200px' }}>
              <div className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>{user?.email ?? '—'}</div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginTop: 2 }}>Free trial</div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/app/account" className="dash-acct-btn" style={{
                font: '500 13.5px var(--sans)', color: 'var(--ink)', background: 'transparent',
                border: '1px solid var(--line2)', borderRadius: 999, padding: '10px 18px',
                textDecoration: 'none', transition: 'border-color .18s',
              }}>Account settings</Link>
              <button onClick={signOut} style={{
                font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'transparent',
                border: '1px solid var(--line2)', borderRadius: 999, padding: '10px 18px', cursor: 'pointer',
              }}>Sign out</button>
            </div>
          </div>
        </section>
      </main>
      )}

      <footer style={{ borderTop: '1px solid var(--line)', textAlign: 'center', padding: '24px 16px', font: '400 13px var(--sans)', color: 'var(--faint)' }}>
        Belletra <span className="sym" style={{ color: 'var(--gold)' }}>✧</span>
      </footer>
    </div>
  )
}
