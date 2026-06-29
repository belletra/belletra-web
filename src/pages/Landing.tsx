import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DescentPhone } from '../components/DescentPhone'

export default function Landing() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      data-mode={darkMode ? 'dark' : 'light'}
      style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh', transition: 'background .5s cubic-bezier(.2,.7,.2,1), color .5s cubic-bezier(.2,.7,.2,1)', overflowX: 'hidden' }}
    >
      <style>{`
        @keyframes blRise { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
        @keyframes blFade { from { opacity:0; } to { opacity:1; } }
        @keyframes blReveal { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .bl-nav-link { font: 500 14px var(--sans); color: var(--soft); transition: color .2s; }
        .bl-nav-link:hover { color: var(--ink); }
        .bl-toggle:hover { color: var(--ink); border-color: var(--gold) !important; }
        .bl-hero-cta:hover { filter: brightness(1.06); }
        .bl-feat-card { transition: transform .28s cubic-bezier(.2,.7,.2,1), box-shadow .28s cubic-bezier(.2,.7,.2,1), border-color .28s cubic-bezier(.2,.7,.2,1); }
        .bl-feat-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(40,30,15,.16); border-color: var(--gold) !important; }
        .bl-price-monthly:hover { background: var(--ink); color: var(--card); }
        .bl-price-lifetime:hover { background: var(--ink); color: var(--card); }
        .bl-cta-main:hover { filter: brightness(1.06); }
        .bl-store-btn:hover { opacity: .88; }
        .bl-web-link:hover { border-color: var(--gold) !important; }
        .bl-footer-link:hover { color: var(--ink) !important; }
        @media (max-width: 860px) {
          .bl-hero-grid { grid-template-columns: 1fr !important; }
          .hero-phone { display: none !important; }
          .bl-feat-grid { grid-template-columns: 1fr 1fr !important; }
          .bl-anatomy-grid { grid-template-columns: 1fr !important; }
          .bl-method-grid { grid-template-columns: 1fr !important; }
          .bl-lang-grid { grid-template-columns: 1fr !important; }
          .bl-price-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .bl-feat-grid { grid-template-columns: 1fr !important; }
          .bl-nav-links { display: none !important; }
          .bl-nav-login { display: none !important; }
          .bl-pill { font-size: 10px !important; padding: 5px 10px !important; }
          .bl-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
        }
      `}</style>

      {/* ===== NAV ===== */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 clamp(14px,4vw,32px)', height: 60, display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,28px)' }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, marginRight: 'auto', textDecoration: 'none' }}>
            <span style={{
              width: 34, height: 34, borderRadius: 9, background: 'var(--card)',
              border: '1px solid var(--line2)', display: 'grid', placeItems: 'center',
              position: 'relative', boxShadow: 'var(--shadow-card)',
            }}>
              <span className="serif" style={{ fontSize: 21, color: 'var(--ink)', lineHeight: 1 }}>B</span>
              <span style={{ position: 'absolute', right: 4, bottom: 3, fontSize: 8, color: 'var(--gold)', lineHeight: 1, fontStyle: 'normal' }}>❧</span>
            </span>
            <span className="serif" style={{ fontSize: 21, letterSpacing: '.02em', color: 'var(--ink)' }}>Belletra</span>
          </a>
          <nav className="bl-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <a href="#features" className="bl-nav-link">Features</a>
            <a href="#method" className="bl-nav-link">The method</a>
            <a href="#languages" className="bl-nav-link">Languages</a>
            <a href="#pricing" className="bl-nav-link">Pricing</a>
          </nav>
          <button
            onClick={() => setDarkMode(d => !d)}
            aria-label="toggle light and dark"
            className="bl-toggle"
            style={{
              width: 36, height: 36, borderRadius: 9, border: '1px solid var(--line2)',
              background: 'var(--card)', color: 'var(--soft)', cursor: 'pointer',
              display: 'grid', placeItems: 'center', fontSize: 15,
            }}
          >{darkMode ? '☀' : '☾'}</button>
          <Link to="/login" className="bl-nav-login" style={{ font: '600 14px var(--sans)', color: 'var(--soft)', padding: '9px 4px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>Log in</Link>
          <Link to="/signup" style={{ font: '600 14px var(--sans)', color: '#fff', background: 'var(--ink)', padding: '10px 18px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>Start free</Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="top" style={{ maxWidth: 1120, margin: '0 auto', padding: '78px 32px 30px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }} className="bl-hero-grid">
        <div style={{ animation: 'blRise .8s cubic-bezier(.2,.7,.2,1) both', minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase',
            color: 'var(--gold)', border: '1px solid var(--line2)', borderRadius: 999,
            padding: '7px 14px', marginBottom: 26, whiteSpace: 'nowrap',
          }} className="bl-pill">
            <span className="sym" style={{ fontSize: 12 }}>✧</span> French, through its greatest sentences
          </div>
          <h1 className="serif" style={{
            fontWeight: 400, fontSize: 'clamp(42px,5.4vw,72px)', lineHeight: 1.04,
            letterSpacing: '-.01em', margin: '0 0 22px',
          }}>
            Learn the French that<br /><span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>writers reached for.</span>
          </h1>
          <p style={{ font: '400 19px/1.65 var(--sans)', color: 'var(--soft)', maxWidth: 480, margin: '0 0 32px' }}>
            Not the French that merely gets you by. Every sentence is hand-picked from poetry and prose, then taken apart word by word — why this verb, what the grammar unlocks, why only French can say it this way.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/signup" className="bl-hero-cta" style={{
              font: '600 16px var(--sans)', color: '#fff', background: 'var(--gold)',
              padding: '15px 26px', borderRadius: 999, boxShadow: 'var(--shadow-cta)',
              textDecoration: 'none',
            }}>Start your free week →</Link>
            <a href="#method" style={{ font: '500 15px var(--sans)', color: 'var(--ink)', padding: '14px 6px', textDecoration: 'none' }}>See how it works</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 34, font: '400 13.5px var(--sans)', color: 'var(--faint)' }}>
            <span>7-day free trial</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--line2)', display: 'inline-block' }}></span>
            <span>No card to read your first line</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', animation: 'blRise 1s cubic-bezier(.2,.7,.2,1) .12s both', minWidth: 0 }}>
          <DescentPhone dark={darkMode} />
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 32px 64px' }}>
        <div style={{
          borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
          padding: '26px 0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 24, textAlign: 'center',
        }} className="bl-stats-grid">
          <div>
            <div className="serif" style={{ fontSize: 32, color: 'var(--gold)' }}>100%</div>
            <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginTop: 4 }}>human-curated &amp; annotated</div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 32, color: 'var(--gold)' }}>8</div>
            <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginTop: 4 }}>steps down into each line</div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 32, color: 'var(--gold)' }}>Weekly</div>
            <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginTop: 4 }}>new sentences added</div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 32, color: 'var(--gold)' }}>0</div>
            <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginTop: 4 }}>guilt-tripping streaks</div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM / POSITIONING ===== */}
      <section style={{ background: 'var(--card)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Why Belletra</div>
          <p className="serif" style={{ fontSize: 'clamp(26px,3.4vw,38px)', lineHeight: 1.4, margin: 0, fontWeight: 400 }}>
            Most apps teach you to order coffee. Belletra teaches you the sentence a poet spent a lifetime learning to write — and shows you everything hidden inside it.
          </p>
        </div>
      </section>

      {/* ===== ANATOMY OF ONE LINE ===== */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '90px 32px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Anatomy of one line</div>
        </div>

        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 14px' }}>
          <div className="serif" style={{ fontSize: 'clamp(26px,3.6vw,40px)', lineHeight: 1.4, fontStyle: 'italic', color: 'var(--ink)' }}>
            «&#8201;Il <span style={{ color: 'var(--gold)' }}>pleure</span> dans mon c&oelig;ur, comme il pleut sur la ville&#8201;»
          </div>
          <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginTop: 16 }}>Paul Verlaine · <span className="serif" style={{ fontStyle: 'italic' }}>Romances sans paroles</span> · 1874</div>
          <div className="serif" style={{ fontSize: 16, color: 'var(--soft)', fontStyle: 'italic', marginTop: 14 }}>"It weeps in my heart, as it rains on the town."</div>
        </div>

        <div style={{ maxWidth: 680, margin: '30px auto 40px', display: 'flex', alignItems: 'stretch', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, background: 'var(--paper2)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 9 }}>Useful French</div>
            <div className="serif" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--soft)' }}>«&#8201;j'ai le c&oelig;ur gros&#8201;»</div>
            <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', marginTop: 7 }}>my heart is heavy — it names the self</div>
          </div>
          <div style={{ flex: 1, minWidth: 240, background: 'var(--goldBg)', border: '1px solid var(--gold)', borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 9 }}>Beautiful French</div>
            <div className="serif" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--ink)' }}>«&#8201;Il pleure dans mon c&oelig;ur&#8201;»</div>
            <div style={{ font: '400 12.5px var(--sans)', color: 'var(--soft)', marginTop: 7 }}>it refuses to name the self at all</div>
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto 22px', background: 'var(--card)', border: '1px solid var(--gold)', borderRadius: 20, padding: '30px 34px', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 11px var(--sans)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
            <span className="sym">✶</span> Only in French
          </div>
          <p style={{ font: '400 17px/1.7 var(--sans)', color: 'var(--soft)', margin: '0 auto', maxWidth: 600 }}>
            English demands a <em>who</em> — "I weep," someone must do it. French alone keeps a grammatical seat for the unowned event and lets grief arrive like weather: <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink)' }}>«&#8201;il pleure&#8201;»</span> — no one need. The line is untranslatable not for its words, but for a thought only French grammar will let you think.
          </p>
        </div>

        <div className="bl-anatomy-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 9 }}>
              <span className="sym">↳</span> The root · pleure
            </div>
            <p style={{ font: '400 14px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}>From Latin <span className="serif" style={{ fontStyle: 'italic' }}>plorāre</span> — to wail aloud, the grief of mourners. French smoothed the vowel and hushed it into something private, almost soundless.</p>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 9 }}>
              Ⓐ The grammar · the impersonal «&#8201;il&#8201;»
            </div>
            <p style={{ font: '400 14px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}>French keeps a hollow <span className="serif" style={{ fontStyle: 'italic' }}>il</span> for events with no doer — <span className="serif" style={{ fontStyle: 'italic' }}>«&#8201;il pleut&#8201;»</span>, it rains. Verlaine borrows that weather-grammar and points it at the heart.</p>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 9 }}>
              <span className="sym">♪</span> The music
            </div>
            <p style={{ font: '400 14px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}><span className="serif" style={{ fontStyle: 'italic' }}>pleure / pleut</span> — the verb is one vowel from the word for rain. The line rains without ever saying so, all liquid <span className="serif" style={{ fontStyle: 'italic' }}>l</span>'s and <span className="serif" style={{ fontStyle: 'italic' }}>r</span>'s.</p>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 9 }}>
              <span className="sym">○</span> The silence
            </div>
            <p style={{ font: '400 14px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}>Nothing tells us <em>why</em>. No event, no loss is named — <span className="serif" style={{ fontStyle: 'italic' }}>«&#8201;C'est bien la pire peine / De ne savoir pourquoi&#8201;»</span>. What it withholds is what it is about.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 26, font: '400 13.5px var(--sans)', color: 'var(--faint)', fontStyle: 'italic' }}>One line. Eight steps down. This is a single sitting in Belletra.</div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ maxWidth: 1120, margin: '0 auto', padding: '66px 32px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>What you get</div>
          <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(32px,4vw,46px)', margin: 0, letterSpacing: '-.01em' }}>Six things no flashcard app does</h2>
        </div>
        <div className="bl-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          <div className="bl-feat-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: '34px 32px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--card)', border: '1px solid rgba(160,111,36,.34)', boxShadow: '0 2px 9px rgba(40,30,15,.07)' }}>
                <span className="sym" style={{ fontSize: 20, color: 'var(--gold)', lineHeight: 1 }}>❦</span>
              </span>
              <span className="serif" style={{ fontSize: 36, color: 'var(--gold)', opacity: .2, lineHeight: 1, fontStyle: 'italic' }}>01</span>
            </div>
            <h3 className="serif" style={{ fontWeight: 400, fontSize: 23, margin: '0 0 14px', lineHeight: 1.3, minHeight: 60, display: 'flex', alignItems: 'flex-end' }}>Hand-picked, never generated</h3>
            <div style={{ width: 28, height: 2, background: 'var(--gold)', borderRadius: 2, opacity: .5, marginBottom: 15 }}></div>
            <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', margin: 0 }}>
              A curator chooses each line and writes its study by hand — etymology, grammar, register, the precise reason a writer reached for this word and not its plainer cousin. No AI slop, no crowdsourced glosses. Every line is signed.
            </p>
          </div>
          <div className="bl-feat-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: '34px 32px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--card)', border: '1px solid rgba(160,111,36,.34)', boxShadow: '0 2px 9px rgba(40,30,15,.07)' }}>
                <span className="sym" style={{ fontSize: 20, color: 'var(--gold)', lineHeight: 1 }}>↓</span>
              </span>
              <span className="serif" style={{ fontSize: 36, color: 'var(--gold)', opacity: .2, lineHeight: 1, fontStyle: 'italic' }}>02</span>
            </div>
            <h3 className="serif" style={{ fontWeight: 400, fontSize: 23, margin: '0 0 14px', lineHeight: 1.3, minHeight: 60, display: 'flex', alignItems: 'flex-end' }}>The Descent</h3>
            <div style={{ width: 28, height: 2, background: 'var(--gold)', borderRadius: 2, opacity: .5, marginBottom: 15 }}></div>
            <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', margin: 0 }}>
              One line, taken down eight steps: hear it, guess the word it turns on, weigh the words it could have used, the grammar beneath it, the thought only French can think — then its music, its turn, its silence. Last, you rebuild it from memory. You don't memorise the sentence; you understand it completely.
            </p>
          </div>
          <div className="bl-feat-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: '34px 32px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--card)', border: '1px solid rgba(160,111,36,.34)', boxShadow: '0 2px 9px rgba(40,30,15,.07)' }}>
                <span className="sym" style={{ fontSize: 20, color: 'var(--gold)', lineHeight: 1 }}>✿</span>
              </span>
              <span className="serif" style={{ fontSize: 36, color: 'var(--gold)', opacity: .2, lineHeight: 1, fontStyle: 'italic' }}>03</span>
            </div>
            <h3 className="serif" style={{ fontWeight: 400, fontSize: 23, margin: '0 0 14px', lineHeight: 1.3, minHeight: 60, display: 'flex', alignItems: 'flex-end' }}>A rhythm, not a streak</h3>
            <div style={{ width: 28, height: 2, background: 'var(--gold)', borderRadius: 2, opacity: .5, marginBottom: 15 }}></div>
            <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', margin: 0 }}>
              A gentle cadence you can actually keep. Miss a day and nothing breaks, nothing scolds you. Belletra is built to be returned to for years — not to punish you for a Tuesday.
            </p>
          </div>
          <div className="bl-feat-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: '34px 32px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--card)', border: '1px solid rgba(160,111,36,.34)', boxShadow: '0 2px 9px rgba(40,30,15,.07)' }}>
                <span className="sym" style={{ fontSize: 20, color: 'var(--gold)', lineHeight: 1 }}>✧</span>
              </span>
              <span className="serif" style={{ fontSize: 36, color: 'var(--gold)', opacity: .2, lineHeight: 1, fontStyle: 'italic' }}>04</span>
            </div>
            <h3 className="serif" style={{ fontWeight: 400, fontSize: 23, margin: '0 0 14px', lineHeight: 1.3, minHeight: 60, display: 'flex', alignItems: 'flex-end' }}>Your anthology</h3>
            <div style={{ width: 28, height: 2, background: 'var(--gold)', borderRadius: 2, opacity: .5, marginBottom: 15 }}></div>
            <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', margin: 0 }}>
              Keep the lines that move you and each one is gilded into a private anthology — the slow accumulation of a reader's taste, line by line, saved across every device.
            </p>
          </div>
          <div className="bl-feat-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: '34px 32px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--card)', border: '1px solid rgba(160,111,36,.34)', boxShadow: '0 2px 9px rgba(40,30,15,.07)' }}>
                <span className="sym" style={{ fontSize: 20, color: 'var(--gold)', lineHeight: 1 }}>✺</span>
              </span>
              <span className="serif" style={{ fontSize: 36, color: 'var(--gold)', opacity: .2, lineHeight: 1, fontStyle: 'italic' }}>05</span>
            </div>
            <h3 className="serif" style={{ fontWeight: 400, fontSize: 23, margin: '0 0 14px', lineHeight: 1.3, minHeight: 60, display: 'flex', alignItems: 'flex-end' }}>Ever-growing library</h3>
            <div style={{ width: 28, height: 2, background: 'var(--gold)', borderRadius: 2, opacity: .5, marginBottom: 15 }}></div>
            <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', margin: 0 }}>
              A new line every week — Baudelaire, Rimbaud, Proust, Hugo and more are queued behind Verlaine. Tomorrow's is already waiting: <span className="serif" style={{ fontStyle: 'italic' }}>«&#8201;Le vent se lève…&#8201;»</span>, Valéry. The library you join today is the smallest it will ever be.
            </p>
          </div>
          <div className="bl-feat-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: '34px 32px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--card)', border: '1px solid rgba(160,111,36,.34)', boxShadow: '0 2px 9px rgba(40,30,15,.07)' }}>
                <span className="sym" style={{ fontSize: 20, color: 'var(--gold)', lineHeight: 1 }}>⇄</span>
              </span>
              <span className="serif" style={{ fontSize: 36, color: 'var(--gold)', opacity: .2, lineHeight: 1, fontStyle: 'italic' }}>06</span>
            </div>
            <h3 className="serif" style={{ fontWeight: 400, fontSize: 23, margin: '0 0 14px', lineHeight: 1.3, minHeight: 60, display: 'flex', alignItems: 'flex-end' }}>The line returns</h3>
            <div style={{ width: 28, height: 2, background: 'var(--gold)', borderRadius: 2, opacity: .5, marginBottom: 15 }}></div>
            <p style={{ font: '400 15px/1.6 var(--sans)', color: 'var(--soft)', margin: 0 }}>
              The words you keep don't vanish into a list. They come back days later, at just the right moment, woven into a calm review — so a line that moved you in March is still yours in June.
            </p>
          </div>
        </div>
      </section>

      {/* ===== METHOD / PROOF ===== */}
      <section id="method" style={{ background: 'var(--card)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginTop: 46 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '84px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>The method</div>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(32px,4vw,46px)', margin: '0 auto', letterSpacing: '-.01em', maxWidth: 680 }}>Beauty is the most memorable thing there is</h2>
          </div>

          <div style={{ maxWidth: 760, margin: '34px auto 56px', textAlign: 'center', background: 'var(--paper)', border: '1px solid var(--line2)', borderRadius: 20, padding: '36px 40px' }}>
            <div style={{ font: '600 11px var(--sans)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>The proof</div>
            <p className="serif" style={{ fontSize: 'clamp(22px,2.8vw,30px)', lineHeight: 1.45, margin: 0, fontStyle: 'italic' }}>
              "Without spaced review, you'd forget most of a week's new words within days. Belletra brings each line back at the edge of forgetting — so it stays."
            </p>
          </div>

          <div className="bl-method-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '34px 48px' }}>
            <div>
              <div className="serif" style={{ fontSize: 40, color: 'var(--gold)', marginBottom: 10 }}>01</div>
              <h3 className="serif" style={{ fontWeight: 500, fontSize: 21, margin: '0 0 9px' }}>A guess before the answer</h3>
              <p style={{ font: '400 14.5px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}>
                Before any explanation, Belletra asks which word carries the line. Reaching for an answer before you're told — the generation effect — carves a deeper trace than simply being shown. The guess primes the memory.
              </p>
            </div>
            <div>
              <div className="serif" style={{ fontSize: 40, color: 'var(--gold)', marginBottom: 10 }}>02</div>
              <h3 className="serif" style={{ fontWeight: 500, fontSize: 21, margin: '0 0 9px' }}>Eight kinds of attention</h3>
              <p style={{ font: '400 14.5px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}>
                Sound, root, grammar, register, silence — each line is processed eight ways. Decades of memory research find that the more richly something is encoded, the longer it stays. Depth, not repetition, is what makes a line unforgettable.
              </p>
            </div>
            <div>
              <div className="serif" style={{ fontSize: 40, color: 'var(--gold)', marginBottom: 10 }}>03</div>
              <h3 className="serif" style={{ fontWeight: 500, fontSize: 21, margin: '0 0 9px' }}>You rebuild it yourself</h3>
              <p style={{ font: '400 14.5px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}>
                At the end of the Descent you reconstruct the line word by word, from memory. Producing an answer beats re-reading one — the testing effect is among the most replicated findings in the science of learning.
              </p>
            </div>
            <div>
              <div className="serif" style={{ fontSize: 40, color: 'var(--gold)', marginBottom: 10 }}>04</div>
              <h3 className="serif" style={{ fontWeight: 500, fontSize: 21, margin: '0 0 9px' }}>It returns before you forget</h3>
              <p style={{ font: '400 14.5px/1.65 var(--sans)', color: 'var(--soft)', margin: 0 }}>
                The words you keep come back days later, at widening intervals timed to the forgetting curve — the spacing effect, confirmed by a 2006 meta-analysis of 254 studies across more than 14,000 learners.
              </p>
            </div>
          </div>
          <p style={{ font: '400 12px var(--sans)', color: 'var(--faint)', textAlign: 'center', margin: '42px 0 0', fontStyle: 'italic' }}>
            Grounded in the generation &amp; testing effects, depth of processing, and distributed practice (Ebbinghaus, 1885; Cepeda et al., 2006).
          </p>
        </div>
      </section>

      {/* ===== LANGUAGES ===== */}
      <section id="languages" style={{ maxWidth: 1120, margin: '0 auto', padding: '84px 32px' }}>
        <div className="bl-lang-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Grows with you</div>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(30px,3.6vw,42px)', margin: '0 0 18px', letterSpacing: '-.01em', lineHeight: 1.15 }}>French today.<br />The language you ask for next.</h2>
            <p style={{ font: '400 17px/1.7 var(--sans)', color: 'var(--soft)', margin: '0 0 22px', maxWidth: 440 }}>
              Belletra opens with French, authored to full depth. Which language we build next isn't guesswork — you tell us. When you set up the app, you cast a vote, and the languages readers ask for most are the ones we write.
            </p>
            <a href="#pricing" style={{ font: '600 15px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>Cast your vote inside the app →</a>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: 30, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 18 }}>What readers are asking for</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                { lang: 'Italian', pct: '82%' },
                { lang: 'Spanish', pct: '71%' },
                { lang: 'Latin', pct: '58%' },
                { lang: 'Russian', pct: '44%' },
                { lang: 'Japanese', pct: '38%' },
              ].map(({ lang, pct }) => (
                <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="serif" style={{ fontSize: 15, width: 84, color: 'var(--ink)' }}>{lang}</span>
                  <span style={{ flex: 1, height: 7, borderRadius: 4, background: 'var(--paper)', overflow: 'hidden' }}>
                    <span style={{ display: 'block', width: pct, height: '100%', background: 'var(--gold)', borderRadius: 4 }}></span>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ font: '400 12px var(--sans)', color: 'var(--faint)', marginTop: 18, fontStyle: 'italic' }}>Live tally — every new reader nudges the order.</div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ background: 'var(--card)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '84px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Pricing</div>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(32px,4vw,46px)', margin: '0 0 12px' }}>Begin with a free week</h2>
            <p style={{ font: '400 16px var(--sans)', color: 'var(--soft)', margin: 0 }}>Read your first sentence without an account. Subscribe when it's earned your trust.</p>
          </div>
          <div className="bl-price-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, alignItems: 'stretch' }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line2)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
              <div className="serif" style={{ fontSize: 21, marginBottom: 6 }}>Monthly</div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginBottom: 20 }}>For a season of reading</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                <span className="serif" style={{ fontSize: 42, color: 'var(--ink)' }}>$5.99</span>
                <span style={{ font: '400 14px var(--sans)', color: 'var(--faint)' }}>/ month</span>
              </div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginBottom: 26 }}>7-day free trial</div>
              <Link to="/signup" className="bl-price-monthly" style={{
                marginTop: 'auto', textAlign: 'center', font: '600 15px var(--sans)',
                color: 'var(--ink)', border: '1px solid var(--ink)', borderRadius: 999,
                padding: 13, textDecoration: 'none', transition: 'background .2s, color .2s',
              }}>Start free</Link>
            </div>

            <div style={{ background: 'var(--paper)', border: '1.5px solid var(--gold)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                font: '600 10px var(--sans)', letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'var(--card)', background: 'var(--gold)', padding: '5px 13px',
                borderRadius: 999, whiteSpace: 'nowrap',
              }}>Best value · save 44%</div>
              <div className="serif" style={{ fontSize: 21, marginBottom: 6 }}>Yearly</div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginBottom: 20 }}>For the long habit</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                <span className="serif" style={{ fontSize: 42, color: 'var(--gold)' }}>$39.99</span>
                <span style={{ font: '400 14px var(--sans)', color: 'var(--faint)' }}>/ year</span>
              </div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginBottom: 26 }}>≈ $3.33 / month · 7-day free trial</div>
              <Link to="/signup" style={{
                marginTop: 'auto', textAlign: 'center', font: '600 15px var(--sans)',
                color: 'var(--card)', background: 'var(--gold)', borderRadius: 999,
                padding: 13, boxShadow: 'var(--shadow-cta)', textDecoration: 'none',
              }}>Start free</Link>
            </div>

            <div style={{ background: 'var(--paper)', border: '1px solid var(--line2)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
              <div className="serif" style={{ fontSize: 21, marginBottom: 6 }}>Lifetime</div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', marginBottom: 20 }}>Pay once, yours forever</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                <span className="serif" style={{ fontSize: 42, color: 'var(--ink)' }}>$129</span>
                <span style={{ font: '400 14px var(--sans)', color: 'var(--faint)' }}>once</span>
              </div>
              <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginBottom: 26 }}>Every language we ever add</div>
              <Link to="/signup" className="bl-price-lifetime" style={{
                marginTop: 'auto', textAlign: 'center', font: '600 15px var(--sans)',
                color: 'var(--ink)', border: '1px solid var(--ink)', borderRadius: 999,
                padding: 13, textDecoration: 'none', transition: 'background .2s, color .2s',
              }}>Become a member</Link>
            </div>
          </div>
          <p style={{ font: '400 13px var(--sans)', color: 'var(--faint)', textAlign: 'center', margin: '30px 0 0' }}>Cancel anytime. Grows with you.</p>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '96px 32px', textAlign: 'center' }}>
        <div className="sym" style={{ fontSize: 26, color: 'var(--gold)', marginBottom: 24 }}>✧</div>
        <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(34px,4.6vw,54px)', lineHeight: 1.12, margin: '0 0 22px' }}>One sentence is enough to begin.</h2>
        <p style={{ font: '400 18px/1.6 var(--sans)', color: 'var(--soft)', margin: '0 auto 34px', maxWidth: 480 }}>
          Read your first line tonight — no account, no card. See how deep a single sentence can go.
        </p>
        <Link to="/signup" className="bl-cta-main" style={{
          display: 'inline-block', font: '600 16px var(--sans)', color: 'var(--card)',
          background: 'var(--gold)', padding: '16px 32px', borderRadius: 999,
          boxShadow: 'var(--shadow-cta)', textDecoration: 'none',
        }}>Read one sentence free →</Link>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 34 }}>
          <a href="#top" aria-label="Download on the App Store" className="bl-store-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: 'var(--ink)', color: 'var(--card)', padding: '12px 20px', borderRadius: 14,
            textDecoration: 'none',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.7 1.3c.1 1-.3 2-.95 2.78-.69.82-1.78 1.45-2.79 1.36-.12-.98.39-2 .98-2.66.66-.78 1.82-1.4 2.76-1.48zM19.9 17.2c-.5 1.18-.78 1.7-1.43 2.78-.9 1.5-2.18 3.36-3.76 3.37-1.4.01-1.76-.92-3.66-.91-1.9.01-2.3.93-3.7.92-1.58-.01-2.79-1.69-3.7-3.18-2.53-4.2-2.8-9.12-1.24-11.74.9-1.5 2.32-2.38 3.66-2.38 1.36 0 2.22.95 3.66.95 1.4 0 2.25-.95 3.83-.95 1.18 0 2.43.64 3.32 1.75-2.92 1.6-2.45 5.77.02 7.39z"/></svg>
            <span style={{ textAlign: 'left', lineHeight: 1.12 }}>
              <span style={{ display: 'block', font: '400 10px var(--sans)', opacity: .82, letterSpacing: '.02em' }}>Download on the</span>
              <span style={{ display: 'block', font: '600 17px var(--sans)', letterSpacing: '.01em' }}>App Store</span>
            </span>
          </a>
          <a href="#top" aria-label="Get it on Google Play" className="bl-store-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: 'var(--ink)', color: 'var(--card)', padding: '12px 20px', borderRadius: 14,
            textDecoration: 'none',
          }}>
            <svg width="19" height="21" viewBox="0 0 20 22" fill="currentColor" aria-hidden="true"><path d="M1.1 1.04A1 1 0 0 0 .8 1.8v18.4a1 1 0 0 0 1.53.85l1.1-.66L13.2 11 3.43.61 2.33-.05A1 1 0 0 0 1.1 1.04z" transform="translate(0 .9)"/><path d="M13.2 11l3.05-3.05 3.2 1.84a1 1 0 0 1 0 1.73l-3.2 1.86L13.2 11z"/></svg>
            <span style={{ textAlign: 'left', lineHeight: 1.12 }}>
              <span style={{ display: 'block', font: '400 10px var(--sans)', opacity: .82, letterSpacing: '.02em' }}>Get it on</span>
              <span style={{ display: 'block', font: '600 17px var(--sans)', letterSpacing: '.01em' }}>Google Play</span>
            </span>
          </a>
        </div>
        <div style={{ marginTop: 22 }}>
          <Link to="/login" className="bl-web-link" style={{
            font: '500 14px var(--sans)', color: 'var(--gold)',
            borderBottom: '1px solid var(--line2)', paddingBottom: 2,
            textDecoration: 'none',
          }}>or continue on the web →</Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '34px 32px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto' }}>
            <span className="serif" style={{ fontSize: 18 }}>Belletra</span>
            <span className="sym" style={{ fontSize: 11, color: 'var(--gold)' }}>✧</span>
            <span style={{ font: '400 13px var(--sans)', color: 'var(--faint)' }}>The French that writers reached for.</span>
          </div>
          <div style={{ display: 'flex', gap: 22, font: '400 13px var(--sans)', color: 'var(--faint)' }}>
            <a href="#features" className="bl-footer-link" style={{ textDecoration: 'none', color: 'var(--faint)' }}>Features</a>
            <a href="#method" className="bl-footer-link" style={{ textDecoration: 'none', color: 'var(--faint)' }}>Method</a>
            <a href="#pricing" className="bl-footer-link" style={{ textDecoration: 'none', color: 'var(--faint)' }}>Pricing</a>
            <Link to="/privacy" className="bl-footer-link" style={{ textDecoration: 'none', color: 'var(--faint)' }}>Privacy</Link>
            <Link to="/terms" className="bl-footer-link" style={{ textDecoration: 'none', color: 'var(--faint)' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
