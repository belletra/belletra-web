import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Data ── */
const VERLAINE = {
  id: 'verlaine-pleure',
  text: 'Il pleure dans mon cœur, comme il pleut sur la ville',
  lines: ['Il pleure dans mon cœur,', 'comme il pleut sur la ville.'],
  tokens: ['Il','pleure','dans','mon','cœur','comme','il','pleut','sur','la','ville'],
  audio: 'https://lnxwunwkuikqwpqvwckf.supabase.co/storage/v1/object/public/audio/sentences/verlaine-pleure.mp3',
  author: 'Paul Verlaine', work: 'Romances sans paroles', year: 1874,
  translation: 'It weeps in my heart, as it rains on the town.',
  plain_register: 'An ordinary French speaker would simply say « j\'ai le cœur gros » — my heart is heavy. Beautiful French refuses to name the self at all: it lets the weeping happen, with no one to blame.',
  hinge_token: 'pleure',
  words: {
    'Il': { pos: 'pronoun', gloss: 'it — but an « it » that points at no one', etymology: { surface: 'From Latin ille, "that one." The same root gives English the article-like "the" in other Romance tongues.', deep: 'Latin ille began as a demonstrative — that one, over there. French wore it down to two jobs: the personal il (he), and this colder, emptier il, the grammatical placeholder that fills a subject slot when there is no subject to be found.' } },
    'pleure': { pos: 'verb · 3rd person singular', gloss: 'weeps, sheds tears', etymology: { surface: 'From Latin plorāre, to wail or lament aloud. A loud, public grief in Latin — softened in French to something quieter and inward.', deep: 'Plorāre in Latin was not delicate: it meant to cry out, to wail, the grief of mourners. French smoothed the vowel and hushed the sense — pleurer is private, almost soundless.' } },
    'dans': { pos: 'preposition', gloss: 'in, inside', etymology: { surface: 'From Latin de intus, "from within." Two words fused into one small, interior word.', deep: 'De intus — "from the inside out." The Latin already carries a direction: not merely located in, but coming from within.' } },
    'mon': { pos: 'possessive', gloss: 'my', etymology: { surface: 'From Latin meum, "mine." The single concession to a self in the whole line.', deep: 'Mon is the only first-person mark Verlaine allows. He will not write je — I weep — but he cannot quite erase himself; the heart is owned.' } },
    'cœur': { pos: 'noun · masculine', gloss: 'heart', etymology: { surface: 'From Latin cor, cordis. The same root sits inside English "cordial," "courage," and "record."', deep: 'Cor was, for the Romans, the seat of thought as much as feeling — to learn by heart, to record (re-cordis, to carry back through the heart).' } },
    'pleut': { pos: 'verb · impersonal', gloss: 'rains — « il pleut », it rains', etymology: { surface: 'From Latin pluere, to rain. The weather-verb that French reserves almost entirely for the empty, agentless « il ».', deep: 'Pluere gave French pleuvoir, and it is the model case of the impersonal: « il pleut » has a subject that names nobody.' } },
    'ville': { pos: 'noun · feminine', gloss: 'town, city', etymology: { surface: 'From Latin villa, a country house or estate — which, over centuries, swelled from a single farmstead into the whole town.', deep: 'Latin villa was one dwelling in the fields; medieval French widened it to the cluster of houses around it, then to the town entire.' } },
  } as Record<string, { pos: string; gloss: string; etymology: { surface: string; deep: string } }>,
  lenses: {
    swap: {
      alternatives: [
        { form: 'Il pleure dans mon cœur', highlight: ['Il','pleure'], is_original: true, tag: 'the original', verdict: 'This is the line. The impersonal il pours the weeping into the heart with no hand to do it — grief that simply happens, like weather.' },
        { form: 'Je pleure dans mon cœur', highlight: ['Je'], is_original: false, tag: 'the lesser — it names the self', verdict: '« Je pleure » — I weep — is honest, and ordinary, and smaller. The moment a je appears, the grief acquires an owner, a cause, a story.' },
        { form: 'Il pleut dans mon cœur', highlight: ['pleut'], is_original: false, tag: 'the lesser — too literal', verdict: '« Il pleut » — it rains in my heart — says the metaphor out loud, and so kills it. The genius of the real line is that pleure only sounds like pleut.' },
      ],
    },
    grammar: { name: 'the impersonal « il »', explain: { surface: 'French keeps a special, hollow il for events with no doer: « il pleut » (it rains), « il faut » (one must). Verlaine borrows this weather-grammar and points it at the heart.', deep: 'In most sentences a verb needs an agent — someone weeps, something falls. French carved out an exception for phenomena that befall the world with no author.' }, rule: 'il + impersonal verb = an action with no agent' },
    genius: { name: 'the agentless impersonal', claim: { surface: 'Only French can let a verb of feeling run on the empty weather-il — so that an emotion arrives like rain, with no one performing it.', deep: 'English can say "it is raining," but the moment you reach for a verb of feeling — to weep, to grieve — English demands a who.' }, contrast: 'English: "I weep" — someone must do it. French: « il pleure » — no one need.' },
    ear: { note: { surface: 'pleure / pleut — the verb is one vowel away from the word for rain. The line rains without ever saying so, all liquid l\'s and r\'s.', deep: 'Read it aloud: « il pleure dans mon cœur ». The mouth never closes hard — it is all l, r, and the soft nasal of mon.' } },
    turn: { note: { surface: 'The full stanza answers itself: « Il pleure dans mon cœur / Comme il pleut sur la ville. » The second line says aloud what the first only let us hear.', deep: 'Verlaine builds the poem as an echo. The first line keeps the rain hidden inside pleure; the second finally lets it fall, outside, on the roofs.' } },
    silence: { note: { surface: 'Nothing in the line tells us why. No event, no person, no loss is named. The weeping is given without a cause — and that withholding is the point.', deep: 'A lesser poet explains. Verlaine refuses: there is no because, no story, no name attached to the sorrow.' } },
  },
}
type V = typeof VERLAINE

/* ── Marks ── */
const MARK = { fleuron: '❧', anthology: '❦', genius: '✦', music: '♪', turn: '⇄', silence: '◦', root: '↳' }

/* ── Helpers ── */
function lookupWord(v: V, tok: string) {
  return v.words[tok] || v.words[tok.toLowerCase()] || v.words[tok.charAt(0).toUpperCase() + tok.slice(1)] || null
}

/* ── Components ── */
function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ font: '600 11px var(--sans)', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', ...style }}>{children}</div>
}

function Button({ kind = 'default', children, onClick, style, disabled }: { kind?: string; children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; disabled?: boolean }) {
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)
  const base: React.CSSProperties = { font: '600 15px var(--sans)', border: '1px solid transparent', borderRadius: 13, padding: '14px 22px', cursor: disabled ? 'default' : 'pointer', width: '100%', transition: 'all .2s var(--ease)', transform: down ? 'scale(.98)' : 'scale(1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disabled ? .5 : 1, lineHeight: 1.2 }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: hover && !disabled ? 'var(--goldHi)' : 'var(--gold)', color: '#FFFEFB', boxShadow: 'var(--shadow-cta)', borderColor: 'transparent' },
    default: { background: 'var(--card)', color: 'var(--ink)', borderColor: hover && !disabled ? 'var(--gold)' : 'var(--line2)', fontWeight: 500 },
  }
  return <button disabled={disabled} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false) }} onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)} style={{ ...base, ...variants[kind], ...style }}>{children}</button>
}

function ContinuePill({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  const [hover, setHover] = useState(false)
  return <button onClick={onClick} disabled={disabled} onMouseEnter={() => !disabled && setHover(true)} onMouseLeave={() => setHover(false)} style={{ font: '500 14px var(--sans)', color: hover ? 'var(--gold)' : 'var(--soft)', background: 'transparent', border: `1px solid ${hover ? 'var(--gold)' : 'var(--line2)'}`, borderRadius: 24, padding: '11px 24px', cursor: disabled ? 'default' : 'pointer', transition: 'all .2s var(--ease)', display: 'inline-flex', alignItems: 'center', gap: 8, opacity: disabled ? .42 : 1 }}>{children}</button>
}

function TopBar({ left, center, right }: { left?: React.ReactNode; center?: React.ReactNode; right?: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 18px', gap: 12, minHeight: 30 }}>
    <div style={{ minWidth: 30, display: 'flex', justifyContent: 'flex-start' }}>{left}</div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{center}</div>
    <div style={{ minWidth: 30, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
  </div>
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick?: () => void; label?: string }) {
  const [hover, setHover] = useState(false)
  return <button onClick={onClick} aria-label={label} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ font: '400 19px var(--sans)', color: hover ? 'var(--gold)' : 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'grid', placeItems: 'center', transition: 'color .2s var(--ease)' }}>{children}</button>
}

function ProgressThread({ total, current }: { total: number; current: number }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
    {Array.from({ length: total }).map((_, i) => {
      const done = i < current, now = i === current
      return <div key={i} style={{ height: 6, borderRadius: 3, width: now ? 16 : 6, background: done ? 'var(--soft)' : now ? 'var(--gold)' : 'var(--line2)', transition: 'all .3s var(--ease)' }} />
    })}
  </div>
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, ...style }}>{children}</div>
}

function Gloss({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="serif" style={{ fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.5, color: 'var(--soft)', ...style }}>{children}</div>
}

function Disclosure({ label = 'deeper', children }: { label?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div>
    <button onClick={() => setOpen(o => !o)} style={{ font: '500 12.5px var(--sans)', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 0', textDecoration: 'underline', textUnderlineOffset: 3, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {open ? 'less' : label} <span style={{ transition: 'transform .3s var(--ease)', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>↓</span>
    </button>
    {open && <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--line2)', animation: 'blReveal .32s var(--ease) both' }}>
      <div style={{ font: '400 13.5px/1.8 var(--sans)', color: 'var(--soft)' }}>{children}</div>
    </div>}
  </div>
}

function LensCard({ tag, surface, deep, rule, ruleKind = 'blue', contrast }: { tag: React.ReactNode; surface?: string; deep?: string; rule?: string; ruleKind?: string; contrast?: string }) {
  const ruleTints: Record<string, { bg: string; color: string }> = { blue: { bg: 'var(--blueBg)', color: 'var(--blue)' }, gold: { bg: 'var(--goldBg)', color: 'var(--gold)' } }
  return <Card style={{ textAlign: 'left' }}>
    <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 11, lineHeight: 1.5 }}>{tag}</div>
    {surface && <div style={{ font: '400 14.5px/1.75 var(--sans)', color: 'var(--ink)' }}>{surface}</div>}
    {deep && <Disclosure>{deep}</Disclosure>}
    {rule && <div style={{ marginTop: 12, padding: '10px 13px', borderRadius: 10, background: ruleTints[ruleKind].bg, color: ruleTints[ruleKind].color, font: '500 12.5px/1.5 var(--sans)' }}>{rule}</div>}
    {contrast && <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--line)', font: '400 13px/1.6 var(--sans)', color: 'var(--faint)' }}>{contrast}</div>}
  </Card>
}

function MiniAccordion({ icon, label, surface, deep, defaultOpen }: { icon: string; label: string; surface: string; deep: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
    <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, font: '500 14.5px var(--sans)', color: 'var(--ink)' }}><span style={{ color: 'var(--gold)', fontSize: 15, width: 16, textAlign: 'center' }}>{icon}</span>{label}</span>
      <span style={{ font: '400 18px var(--sans)', color: 'var(--faint)', transition: 'transform .3s var(--ease)', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
    </button>
    {open && <div style={{ padding: '0 16px 16px', animation: 'blReveal .32s var(--ease) both' }}>
      <div style={{ font: '400 14px/1.7 var(--sans)', color: 'var(--ink)' }}>{surface}</div>
      <Disclosure>{deep}</Disclosure>
    </div>}
  </div>
}

function SerifLine({ children, size = 27, style }: { children: React.ReactNode; size?: number; style?: React.CSSProperties }) {
  return <div className="serif" style={{ fontSize: size, lineHeight: 1.5, color: 'var(--ink)', fontWeight: 400, ...style }}>{children}</div>
}

function prefersReducedMotion() {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useLineAudio() {
  const [playing, setPlaying] = useState(false)
  const [levels, setLevels] = useState<number[] | null>(null)
  const r = useRef<Record<string, any>>({})

  const stop = useCallback(() => {
    const s = r.current
    if (s.raf) cancelAnimationFrame(s.raf)
    s.raf = null
    if (s.audio) { try { s.audio.pause(); s.audio.currentTime = 0 } catch (_) {} }
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
    setPlaying(false); setLevels(null)
  }, [])

  const play = useCallback((url: string | null, text: string) => {
    const s = r.current
    if (playing) { stop(); return }
    const reduced = prefersReducedMotion()
    if (url) {
      const audio = new Audio(url)
      s.audio = audio
      setPlaying(true)
      if (!reduced) {
        let t0 = performance.now()
        const loop = (t: number) => {
          const e = (t - t0) / 130
          setLevels(Array.from({ length: 8 }, (_, i) => 0.18 + 0.62 * Math.abs(Math.sin(e + i * 0.7))))
          if (!audio.paused && !audio.ended) s.raf = requestAnimationFrame(loop); else stop()
        }
        audio.addEventListener('canplay', () => { t0 = performance.now(); s.raf = requestAnimationFrame(loop) }, { once: true })
      }
      audio.addEventListener('ended', stop, { once: true })
      audio.addEventListener('error', stop, { once: true })
      audio.play().catch(stop)
      return
    }
    if (typeof speechSynthesis !== 'undefined' && text) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'fr-FR'; u.rate = 0.82; u.pitch = 1
      const voices = speechSynthesis.getVoices()
      const fr = voices.find(v => (v.lang || '').toLowerCase().startsWith('fr'))
      if (fr) u.voice = fr
      u.onend = stop; u.onerror = stop
      speechSynthesis.cancel(); speechSynthesis.speak(u)
      setPlaying(true)
      if (!reduced) {
        let t0 = performance.now()
        const loop = (t: number) => {
          const e = (t - t0) / 130
          const out = Array.from({ length: 8 }, (_, i) => 0.18 + 0.62 * Math.abs(Math.sin(e + i * 0.7)))
          setLevels(out)
          if (speechSynthesis.speaking) s.raf = requestAnimationFrame(loop); else stop()
        }
        s.raf = requestAnimationFrame(loop)
      }
      return
    }
    setPlaying(true)
    if (!reduced) {
      let t0 = performance.now()
      const loop = (t: number) => {
        if (t - t0 > 2400) { stop(); return }
        const e = (t - t0) / 130
        setLevels(Array.from({ length: 8 }, (_, i) => 0.18 + 0.62 * Math.abs(Math.sin(e + i * 0.7))))
        s.raf = requestAnimationFrame(loop)
      }
      s.raf = requestAnimationFrame(loop)
    } else { setTimeout(stop, 1200) }
  }, [playing, stop])

  useEffect(() => () => stop(), [stop])
  return { play, stop, playing, levels }
}

function Waveform({ playing, levels }: { playing: boolean; levels: number[] | null }) {
  const bars = 8
  const reduced = prefersReducedMotion()
  return <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 24 }} aria-hidden="true">
    {Array.from({ length: bars }).map((_, i) => {
      const lvl = levels ? Math.max(0.06, levels[i]) : null
      const live = lvl != null
      return <div key={i} style={{ width: 3, borderRadius: 2, height: live ? `${6 + lvl! * 18}px` : (playing && !reduced ? undefined : 8), background: i % 2 ? 'var(--gold)' : 'var(--blue)', animation: (!live && playing && !reduced) ? `blWave .9s ease-in-out ${i * 0.08}s infinite` : 'none', transition: live ? 'height .08s linear' : 'none', opacity: playing ? 1 : .5 }} />
    })}
  </div>
}

/* ── WordCard ── */
function WordCard({ tok, word }: { tok: string; word: { pos: string; gloss: string; etymology: { surface: string; deep: string } } | null }) {
  if (!word) return null
  return <Card style={{ textAlign: 'left', animation: 'blReveal .32s var(--ease) both' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      <div className="serif" style={{ fontSize: 24, color: 'var(--blue)' }}>{tok}</div>
      <div className="serif" style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--faint)' }}>{word.pos}</div>
    </div>
    <Gloss style={{ marginTop: 6, color: 'var(--ink)', fontStyle: 'normal', fontSize: 15.5 }}>{word.gloss}</Gloss>
    <div style={{ marginTop: 12, font: '400 13.5px/1.7 var(--sans)', color: 'var(--soft)' }}>
      <span style={{ color: 'var(--gold)' }}>{MARK.root}</span> {word.etymology.surface}
    </div>
    <Disclosure label="the whole root">{word.etymology.deep}</Disclosure>
  </Card>
}

/* ── LineDisplay ── */
function LineDisplay({ v, size = 26, style }: { v: V; size?: number; style?: React.CSSProperties }) {
  return <div className="serif" style={{ fontSize: size, lineHeight: 1.5, color: 'var(--ink)', fontWeight: 400, ...style }}>
    « {v.lines[0]}<br />{v.lines[1]} »
  </div>
}

/* ── TappableLine ── */
function TappableLine({ v, size = 21, selected, onSelect }: { v: V; size?: number; selected: string | null; onSelect: (tok: string | null) => void }) {
  const firstCount = v.lines ? v.lines[0].replace(/[.,;:]/g, '').trim().split(/\s+/).length : null
  return <div className="serif" style={{ fontSize: size, lineHeight: 1.7, color: 'var(--ink)' }}>
    {v.tokens.map((tok, i) => {
      const known = !!lookupWord(v, tok)
      const isSel = selected === tok
      const sep = i < v.tokens.length - 1 ? (firstCount && i + 1 === firstCount ? <br key={'br' + i} /> : ' ') : ''
      return (
        <span key={i}>
          {known ? (
            <span role="button" tabIndex={0} aria-pressed={isSel}
              onClick={() => onSelect(isSel ? null : tok)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(isSel ? null : tok) } }}
              style={{ cursor: 'pointer', color: isSel ? 'var(--blue)' : 'var(--ink)', borderBottom: `1.5px dashed ${isSel ? 'var(--blue)' : 'var(--gold)'}`, paddingBottom: 1, borderRadius: 2, transition: 'color .2s var(--ease)' }}>{tok}</span>
          ) : <span>{tok}</span>}
          {sep}
        </span>
      )
    })}
  </div>
}

/* ── SwapOption ── */
function renderForm(form: string, highlight: string[]) {
  return form.split(' ').map((w, i, arr) => {
    const clean = w.replace(/[.,;:»«]/g, '')
    return (
      <span key={i}>
        {highlight.includes(clean) ? <strong style={{ color: 'var(--gold)', fontWeight: 600 }}>{w}</strong> : w}
        {i < arr.length - 1 ? ' ' : ''}
      </span>
    )
  })
}

function SwapOption({ opt, selected, revealed, onClick }: { opt: typeof VERLAINE.lenses.swap.alternatives[0]; selected: boolean; revealed: boolean; onClick: () => void }) {
  const isRight = opt.is_original
  let borderColor = 'var(--line2)', bg = 'var(--card)'
  if (revealed && isRight) { borderColor = 'var(--green)'; bg = 'var(--greenBg)' }
  else if (selected) { borderColor = 'var(--gold)'; bg = 'var(--goldBg)' }
  return <button onClick={onClick} aria-pressed={selected} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 16px', borderRadius: 13, cursor: 'pointer', background: bg, border: `1px solid ${borderColor}`, transition: 'all .2s var(--ease)' }}>
    <span className="serif" style={{ fontSize: 17.5, color: 'var(--ink)', flex: 1, minWidth: 0 }}>{renderForm(opt.form, opt.highlight)}</span>
    <span style={{ font: '600 9px var(--sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: isRight && revealed ? 'var(--green)' : 'var(--faint)', whiteSpace: 'nowrap', flexShrink: 0 }}>{opt.tag}</span>
  </button>
}

/* ── Rebuild ── */
function Rebuild({ tokens, onDone }: { tokens: string[]; onDone?: () => void }) {
  const [placed, setPlaced] = useState<string[]>([])
  const [pool, setPool] = useState<{ t: string; id: number }[]>(() => {
    const arr = tokens.map((t, i) => ({ t, id: i }))
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]] }
    return arr
  })
  const [wrong, setWrong] = useState<number | null>(null)
  const done = placed.length === tokens.length

  useEffect(() => { if (done) onDone?.() }, [done])

  const tap = (item: { t: string; id: number }) => {
    if (item.t === tokens[placed.length]) {
      setPlaced(p => [...p, item.t]); setPool(pl => pl.filter(x => x.id !== item.id))
    } else {
      setWrong(item.id); setTimeout(() => setWrong(null), 340)
    }
  }

  return <div>
    <div style={{ minHeight: 64, border: `1.5px dashed ${done ? 'var(--green)' : 'var(--line2)'}`, borderRadius: 13, padding: '14px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 8px', transition: 'border-color .3s var(--ease)' }}>
      {placed.map((w, i) => <span key={i} className="serif" style={{ fontSize: 21, color: 'var(--green)', animation: 'blPop .2s var(--ease) both' }}>{w}</span>)}
      {!done && <span style={{ width: 2, height: 24, background: 'var(--gold)', display: 'inline-block', animation: 'blCaret 1s step-end infinite', marginLeft: 2 }} />}
    </div>
    {!done ? (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 18, justifyContent: 'center' }}>
        {pool.map(item => <button key={item.id} onClick={() => tap(item)} style={{ font: '400 19px var(--serif)', fontFamily: 'var(--serif)', background: 'var(--card)', border: `1px solid ${wrong === item.id ? 'var(--rose)' : 'var(--line2)'}`, borderRadius: 11, padding: '9px 16px', cursor: 'pointer', transition: 'all .15s var(--ease)', animation: wrong === item.id ? 'blShake .32s var(--ease)' : 'none', color: wrong === item.id ? 'var(--rose)' : 'var(--ink)' }}>{item.t}</button>)}
      </div>
    ) : (
      <div style={{ textAlign: 'center', marginTop: 18, font: '500 14px var(--sans)', color: 'var(--green)', animation: 'blReveal .4s var(--ease) both' }}>✓ it's yours now</div>
    )}
  </div>
}

/* ── Pad ── */
function Pad({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '6px 26px 24px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>{children}</div>
}

/* ── StatusBar ── */
function StatusBar() {
  return <div style={{ height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', flexShrink: 0 }}>
    <div style={{ font: '600 14px var(--sans)', color: 'var(--ink)', letterSpacing: '.02em' }}>9:41</div>
    <div style={{ color: 'var(--gold)', fontSize: 15 }}>{MARK.fleuron}</div>
  </div>
}

/* ── ScreenDescent ── */
function ScreenDescent({ onClose }: { onClose?: () => void }) {
  const v = VERLAINE
  const audio = useLineAudio()
  const [step, setStep] = useState(1)
  const [selWord, setSelWord] = useState<string | null>(null)
  const [guess, setGuess] = useState<string | null>(null)
  const [swapSel, setSwapSel] = useState<number | null>(null)
  const [rebuilt, setRebuilt] = useState(false)
  const [kept, setKept] = useState(false)

  const next = () => { audio.stop(); setStep(s => s + 1) }
  const guessTiles = ['pleure', 'cœur', 'Il']
  const L1 = v.lines[0].replace(/[,.;:]$/, '')
  const labels: Record<number, string> = { 1: 'the line', 2: 'what it means', 3: 'a guess', 4: 'the word', 5: 'the grammar', 6: 'only in French', 7: 'deeper', 8: 'make it yours' }

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="close" onClick={() => { audio.stop(); onClose?.() }}>✕</IconBtn>}
        center={<ProgressThread total={8} current={step - 1} />}
        right={<span style={{ width: 30 }} />}
      />
      <div key={step} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Eyebrow style={{ marginBottom: 18 }}>{labels[step]}</Eyebrow>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 22 }}>
            <LineDisplay v={v} size={27} style={{ padding: '0 4px' }} />
            <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)' }}>{v.author} · {v.work} · {v.year}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <button onClick={() => audio.play(v.audio, v.text)} aria-label="hear the line" style={{ font: '500 14px var(--sans)', color: audio.playing ? 'var(--gold)' : 'var(--soft)', background: 'transparent', border: `1px solid ${audio.playing ? 'var(--gold)' : 'var(--line2)'}`, borderRadius: 24, padding: '10px 22px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 9, transition: 'all .2s var(--ease)' }}>{audio.playing ? '♪ listening…' : '▶ hear it first'}</button>
              <Waveform playing={audio.playing} levels={audio.levels} />
              {!v.audio && <div style={{ font: '400 10.5px var(--sans)', color: 'var(--faint)', fontStyle: 'italic', maxWidth: 220 }}>read aloud by your device's voice — a recorded reading takes its place when one is added</div>}
            </div>
            <div style={{ flex: 1 }} />
            <ContinuePill onClick={next}>read it slowly ↓</ContinuePill>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>
            <TappableLine v={v} size={22} selected={selWord} onSelect={setSelWord} />
            <Gloss>{v.translation}</Gloss>
            {selWord ? <WordCard tok={selWord} word={lookupWord(v, selWord)} /> : <div style={{ font: '400 12.5px var(--sans)', color: 'var(--faint)', fontStyle: 'italic' }}>tap any underlined word to open it ↑</div>}
            <div style={{ background: 'var(--goldBg)', borderRadius: 13, padding: '14px 16px' }}>
              <div style={{ font: '600 10px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Useful vs beautiful</div>
              <div style={{ font: '400 13px/1.65 var(--sans)', color: 'var(--soft)' }}>{v.plain_register}</div>
            </div>
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}><ContinuePill onClick={next}>continue ↓</ContinuePill></div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18 }}>
            <SerifLine size={22}>« {L1} »</SerifLine>
            <div style={{ font: '400 14.5px/1.7 var(--sans)', color: 'var(--ink)' }}>Before any explanation — <strong style={{ fontWeight: 600 }}>which word is carrying this line?</strong></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {guessTiles.map(t => <button key={t} onClick={() => { setGuess(t); next() }} style={{ font: '400 19px var(--serif)', fontFamily: 'var(--serif)', color: 'var(--ink)', background: 'var(--card)', border: '1px solid var(--line2)', borderRadius: 13, padding: '15px 18px', cursor: 'pointer', transition: 'all .2s var(--ease)', textAlign: 'center' }}>{t}</button>)}
            </div>
            <div style={{ font: '400 12px var(--sans)', color: 'var(--faint)', fontStyle: 'italic' }}>There's no wrong answer — the guess primes your memory.</div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>
            <SerifLine size={22}>« {L1} »</SerifLine>
            <div style={{ font: '500 14px var(--sans)', color: guess === v.hinge_token ? 'var(--green)' : 'var(--soft)' }}>
              {guess === v.hinge_token ? <>✓ Yes — <strong className="serif" style={{ fontStyle: 'italic' }}>pleure</strong> is the hinge.</> : <>You felt for <strong className="serif" style={{ fontStyle: 'italic' }}>{guess}</strong>; the weight is on <strong className="serif" style={{ fontStyle: 'italic' }}>pleure</strong>.</>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {v.lenses.swap.alternatives.map((opt, i) => <SwapOption key={i} opt={opt} selected={swapSel === i} revealed={swapSel !== null} onClick={() => setSwapSel(i)} />)}
            </div>
            {swapSel !== null && (() => { const opt = v.lenses.swap.alternatives[swapSel]; return <div style={{ borderLeft: `3px solid ${opt.is_original ? 'var(--gold)' : 'var(--rose)'}`, background: opt.is_original ? 'var(--goldBg)' : 'var(--roseBg)', padding: '13px 16px', borderRadius: '0 10px 10px 0', animation: 'blReveal .34s var(--ease) both', font: '400 13px/1.7 var(--sans)', color: 'var(--soft)' }}>{opt.verdict}</div> })()}
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {swapSel === null && <div style={{ font: '400 11.5px var(--sans)', color: 'var(--faint)', fontStyle: 'italic' }}>choose one to see what it costs</div>}
              <ContinuePill onClick={next} disabled={swapSel === null}>see the grammar that allows it ↓</ContinuePill>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18 }}>
            <SerifLine size={20} style={{ color: 'var(--soft)' }}>« {L1} »</SerifLine>
            <LensCard tag={<>ⓐ Grammar — {v.lenses.grammar.name}</>} surface={v.lenses.grammar.explain.surface} deep={v.lenses.grammar.explain.deep} rule={v.lenses.grammar.rule} ruleKind="blue" />
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}><ContinuePill onClick={next}>…and why only French can ↓</ContinuePill></div>
          </div>
        )}

        {step === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18 }}>
            <SerifLine size={20} style={{ color: 'var(--soft)' }}>« {L1} »</SerifLine>
            <LensCard tag={<>{MARK.genius} Only in French — {v.lenses.genius.name}</>} surface={v.lenses.genius.claim.surface} deep={v.lenses.genius.claim.deep} contrast={v.lenses.genius.contrast} />
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}><ContinuePill onClick={next}>three more ways in ↓</ContinuePill></div>
          </div>
        )}

        {step === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>
            <div style={{ font: '400 13px var(--sans)', color: 'var(--faint)', fontStyle: 'italic', marginBottom: 4 }}>three more ways in — each opens to its depth</div>
            <MiniAccordion icon={MARK.music} label="the music" surface={v.lenses.ear.note.surface} deep={v.lenses.ear.note.deep} defaultOpen />
            <MiniAccordion icon={MARK.turn} label="the turn" surface={v.lenses.turn.note.surface} deep={v.lenses.turn.note.deep} />
            <MiniAccordion icon={MARK.silence} label="the silence" surface={v.lenses.silence.note.surface} deep={v.lenses.silence.note.deep} />
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}><ContinuePill onClick={next}>make it yours ↓</ContinuePill></div>
          </div>
        )}

        {step === 8 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18 }}>
            <div style={{ textAlign: 'center' }}>
              <LineDisplay v={v} size={22} style={{ textAlign: 'center' }} />
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 13.5, color: 'var(--faint)', marginTop: 12 }}>— read it once in silence, then rebuild it —</div>
            </div>
            <Rebuild tokens={v.tokens} onDone={() => setRebuilt(true)} />
            {rebuilt && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', animation: 'blReveal .4s var(--ease) both', marginTop: 4 }}>
                {!kept ? (
                  <Button kind="default" style={{ maxWidth: 240, borderColor: 'var(--gold)', color: 'var(--gold)' }} onClick={() => setKept(true)}>♡ keep this line</Button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 30, color: 'var(--gold)', animation: 'blGild 1.4s var(--ease) both' }}>{MARK.anthology}</div>
                    <div style={{ font: '400 12.5px var(--sans)', color: 'var(--soft)', fontStyle: 'italic' }}>kept in your anthology</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Pad>
  )
}

/* ── Public export ── */
// SCREEN_W/H from design file (app.jsx): 393 × 852, bezel adds 12px padding each side
const SCREEN_W = 393, SCREEN_H = 852, STATUS_H = 46
const BEZEL_W = SCREEN_W + 24, BEZEL_H = SCREEN_H + 24
// Scale so the full bezel fits in the hero column (~720px tall)
const SCALE = 720 / BEZEL_H  // ≈ 0.821

export function DescentPhone({ dark }: { dark: boolean }) {
  const [screen, setScreen] = useState<'descent' | 'cover'>('descent')

  return (
    // Outer box reserves the scaled footprint
    <div style={{ width: BEZEL_W * SCALE, height: BEZEL_H * SCALE, flexShrink: 0 }}>
      {/* Scale-transform wrapper — data-mode here so CSS vars apply to everything inside */}
      <div
        data-mode={dark ? 'dark' : 'light'}
        style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left', width: BEZEL_W, height: BEZEL_H }}
      >
        {/* Bezel — exact structure from app.jsx */}
        <div style={{
          width: BEZEL_W, height: BEZEL_H,
          borderRadius: 46, padding: 12,
          background: 'linear-gradient(160deg, var(--bezel-edge), var(--bezel))',
          boxShadow: 'var(--shadow-device)',
        }}>
          {/* Screen */}
          <div style={{
            width: SCREEN_W, height: SCREEN_H,
            borderRadius: 38, overflow: 'hidden',
            background: 'var(--paper)',
            display: 'flex', flexDirection: 'column',
          }}>
            <StatusBar />
            <div className="bl-scroll" onWheel={e => e.stopPropagation()} style={{ height: SCREEN_H - STATUS_H, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', overscrollBehavior: 'contain' }}>
              {screen === 'descent' && <ScreenDescent onClose={() => setScreen('cover')} />}
              {screen === 'cover' && (
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 32px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, color: 'var(--gold)' }}>❧</div>
                  <div className="serif" style={{ fontSize: 26, color: 'var(--ink)', fontWeight: 400 }}>Belletra</div>
                  <div style={{ font: '400 14px/1.7 var(--sans)', color: 'var(--soft)' }}>French literature, read deeply.</div>
                  <button onClick={() => setScreen('descent')} style={{ marginTop: 8, font: '500 14px var(--sans)', color: 'var(--gold)', background: 'transparent', border: '1px solid var(--gold)', borderRadius: 24, padding: '10px 24px', cursor: 'pointer' }}>read today's line →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
