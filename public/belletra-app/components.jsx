/* Belletra — shared UI components. Exported to window at the end for cross-script use. */
const { useState, useEffect, useRef, useCallback } = React;

/* ——— marks ——— */
const MARK = { fleuron: "❧", anthology: "❦", genius: "✦", music: "♪", turn: "⇄", silence: "◦", root: "↳", freeze: "❄" };

/* ——— BrandSeal — the app icon as a component (B-plate + corner fleuron) ——— */
function BrandSeal({ size = 84, dark = false }) {
  const r = Math.round(size * 0.23);
  const inset = Math.round(size * 0.09);
  return (
    <div style={{
      width: size, height: size, borderRadius: r, position: "relative",
      display: "grid", placeItems: "center",
      background: dark ? "#211E18" : "linear-gradient(160deg,#F8F3E8,#ECE5D5)",
      boxShadow: dark ? "0 8px 22px rgba(0,0,0,.4)" : "0 8px 22px rgba(40,30,15,.16)",
    }}>
      <div style={{
        position: "absolute", inset: inset, borderRadius: r - inset,
        border: `1px solid ${dark ? "rgba(199,148,68,.48)" : "rgba(160,111,36,.40)"}`,
        pointerEvents: "none",
      }} />
      <span className="serif" style={{ fontSize: size * 0.62, color: dark ? "#F3EEE3" : "#211E18", lineHeight: 1 }}>B</span>
      <span style={{
        fontFamily: "'Noto Sans Symbols 2', serif", fontSize: size * 0.135, lineHeight: 1,
        color: dark ? "#C79444" : "#A06F24", position: "absolute",
        right: size * 0.155, bottom: size * 0.145,
      }}>❧</span>
    </div>
  );
}

/* ——— Eyebrow / step label ——— */
function Eyebrow({ children, style }) {
  return <div style={{
    font: "600 11px var(--sans)", letterSpacing: ".22em", textTransform: "uppercase",
    color: "var(--gold)", ...style
  }}>{children}</div>;
}

/* ——— Buttons ——— */
function Button({ kind = "default", children, onClick, style, disabled }) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const base = {
    font: "600 15px var(--sans)", border: "1px solid transparent", borderRadius: 13,
    padding: "14px 22px", cursor: disabled ? "default" : "pointer", width: "100%",
    transition: "all .2s var(--ease)", transform: down ? "scale(.98)" : "scale(1)",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    opacity: disabled ? .5 : 1, lineHeight: 1.2,
  };
  const variants = {
    primary: {
      background: hover && !disabled ? "var(--goldHi)" : "var(--gold)", color: "#FFFEFB",
      boxShadow: "var(--shadow-cta)", borderColor: "transparent",
    },
    default: {
      background: "var(--card)", color: "var(--ink)",
      borderColor: hover && !disabled ? "var(--gold)" : "var(--line2)",
      fontWeight: 500,
    },
    dark: {
      background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)", fontWeight: 600,
    },
  };
  return (
    <button disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{ ...base, ...variants[kind], ...style }}>{children}</button>
  );
}

/* ——— Continue pill ——— */
function ContinuePill({ children, onClick, style, disabled }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => !disabled && setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        font: "500 14px var(--sans)", color: hover ? "var(--gold)" : "var(--soft)",
        background: "transparent", border: `1px solid ${hover ? "var(--gold)" : "var(--line2)"}`,
        borderRadius: 24, padding: "11px 24px", cursor: disabled ? "default" : "pointer", transition: "all .2s var(--ease)",
        display: "inline-flex", alignItems: "center", gap: 8, opacity: disabled ? .42 : 1, ...style
      }}>{children}</button>
  );
}

/* ——— Text link ——— */
function TextLink({ children, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        font: "500 14px var(--sans)", color: hover ? "var(--gold)" : "var(--soft)",
        background: "none", border: "none", cursor: "pointer", padding: "6px 4px",
        textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: hover ? "var(--gold)" : "var(--line2)",
        transition: "color .2s var(--ease)", ...style
      }}>{children}</button>
  );
}

/* ——— Top bars ——— */
function TopBar({ left, center, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "4px 0 18px", gap: 12, minHeight: 30,
    }}>
      <div style={{ minWidth: 30, display: "flex", justifyContent: "flex-start" }}>{left}</div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", textAlign: "center" }}>{center}</div>
      <div style={{ minWidth: 30, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}
function IconBtn({ children, onClick, label }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} aria-label={label} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        font: "400 19px var(--sans)", color: hover ? "var(--gold)" : "var(--soft)", background: "none",
        border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: 8,
        display: "grid", placeItems: "center", transition: "color .2s var(--ease)",
      }}>{children}</button>
  );
}
function BarTitle({ children }) {
  return <div style={{ font: "600 13px var(--sans)", letterSpacing: ".04em", color: "var(--ink)" }}>{children}</div>;
}

/* ——— Progress thread ——— */
function ProgressThread({ total, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current, now = i === current;
        return <div key={i} style={{
          height: 6, borderRadius: 3,
          width: now ? 16 : 6,
          background: done ? "var(--soft)" : now ? "var(--gold)" : "var(--line2)",
          transition: "all .3s var(--ease)",
        }} />;
      })}
    </div>
  );
}

/* ——— Badge ——— */
function Badge({ kind = "deep", children }) {
  const styles = {
    deep:   { background: "var(--gold)", color: "#FFFEFB" },
    queued: { background: "transparent", color: "var(--faint)", border: "1px solid var(--line2)" },
  };
  return <span style={{
    font: "600 9px var(--sans)", letterSpacing: ".1em", textTransform: "uppercase",
    padding: "4px 9px", borderRadius: 22, whiteSpace: "nowrap", ...styles[kind]
  }}>{children}</span>;
}

/* ——— Card ——— */
function Card({ children, style, onClick, hoverable }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hoverable && setHover(true)} onMouseLeave={() => hoverable && setHover(false)}
      style={{
        background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 16,
        transition: "all .22s var(--ease)", cursor: onClick ? "pointer" : "default",
        transform: hover ? "translateY(-1px)" : "none",
        boxShadow: hover ? "var(--shadow-card)" : "none",
        borderColor: hover ? "var(--line2)" : "var(--line)",
        ...style
      }}>{children}</div>
  );
}

/* ——— Gloss (italic translation) ——— */
function Gloss({ children, style }) {
  return <div className="serif" style={{
    fontStyle: "italic", fontSize: 14.5, lineHeight: 1.5, color: "var(--soft)", ...style
  }}>{children}</div>;
}

/* ——— Disclosure ("deeper ↓") ——— */
function Disclosure({ label = "deeper", openLabel = "less", children, tint }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{
        font: "500 12.5px var(--sans)", color: "var(--gold)", background: "none", border: "none",
        cursor: "pointer", padding: "8px 0 0", textDecoration: "underline", textUnderlineOffset: 3,
        textDecorationColor: "var(--goldBg)", display: "inline-flex", alignItems: "center", gap: 5,
      }}>
        {open ? openLabel : label} <span style={{ transition: "transform .3s var(--ease)", transform: open ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</span>
      </button>
      {open && (
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--line2)",
          animation: "blReveal .32s var(--ease) both",
        }}>
          <div style={{ font: "400 13.5px/1.8 var(--sans)", color: "var(--soft)" }}>{children}</div>
          {tint && <div style={{
            marginTop: 12, padding: "10px 13px", borderRadius: 10,
            background: tint.bg, color: tint.color, font: "500 12.5px/1.5 var(--sans)",
          }}>{tint.text}</div>}
        </div>
      )}
    </div>
  );
}

/* ——— Lens card ——— */
function LensCard({ tag, title, surface, deep, rule, ruleKind = "blue", contrast, children }) {
  const ruleTints = {
    blue:  { bg: "var(--blueBg)",  color: "var(--blue)" },
    gold:  { bg: "var(--goldBg)",  color: "var(--gold)" },
  };
  return (
    <Card style={{ textAlign: "left" }}>
      <div style={{
        font: "600 10px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase",
        color: "var(--gold)", marginBottom: 11, lineHeight: 1.5,
      }}>{tag}</div>
      {surface && <div style={{ font: "400 14.5px/1.75 var(--sans)", color: "var(--ink)" }}>{surface}</div>}
      {children}
      {deep && <Disclosure tint={rule ? { ...ruleTints[ruleKind], text: rule } : null}>{deep}</Disclosure>}
      {!deep && rule && <div style={{
        marginTop: 12, padding: "10px 13px", borderRadius: 10,
        background: ruleTints[ruleKind].bg, color: ruleTints[ruleKind].color, font: "500 12.5px/1.5 var(--sans)",
      }}>{rule}</div>}
      {contrast && <div style={{
        marginTop: 12, paddingTop: 11, borderTop: "1px solid var(--line)",
        font: "400 13px/1.6 var(--sans)", color: "var(--faint)",
      }}>{contrast}</div>}
    </Card>
  );
}

/* ——— Mini accordion ——— */
function MiniAccordion({ icon, label, surface, deep, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "15px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, font: "500 14.5px var(--sans)", color: "var(--ink)" }}>
          <span style={{ color: "var(--gold)", fontSize: 15, width: 16, textAlign: "center" }}>{icon}</span>{label}
        </span>
        <span style={{ font: "400 18px var(--sans)", color: "var(--faint)", transition: "transform .3s var(--ease)", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px", animation: "blReveal .32s var(--ease) both" }}>
          <div style={{ font: "400 14px/1.7 var(--sans)", color: "var(--ink)" }}>{surface}</div>
          <Disclosure>{deep}</Disclosure>
        </div>
      )}
    </div>
  );
}

/* ——— Audio: real playback (file via Web Audio analyser, else Speech Synthesis) ——— */
function prefersReducedMotion() {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useLineAudio() {
  const [playing, setPlaying] = useState(false);
  const [levels, setLevels] = useState(null); // array(8) of 0..1, or null
  const r = useRef({});

  const stop = useCallback(() => {
    const s = r.current;
    if (s.raf) cancelAnimationFrame(s.raf);
    s.raf = null;
    if (s.audio) { try { s.audio.pause(); s.audio.currentTime = 0; } catch (e) {} }
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    setPlaying(false); setLevels(null);
  }, []);

  const play = useCallback((url, text) => {
    const s = r.current;
    if (playing) { stop(); return; }
    const reduced = prefersReducedMotion();

    // 1) real recording, analysed live
    if (url) {
      try {
        if (!s.audio) s.audio = new Audio();
        s.audio.src = url; s.audio.crossOrigin = "anonymous";
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC && !s.ctx) {
          s.ctx = new AC();
          s.node = s.ctx.createMediaElementSource(s.audio);
          s.analyser = s.ctx.createAnalyser(); s.analyser.fftSize = 64;
          s.node.connect(s.analyser); s.analyser.connect(s.ctx.destination);
        }
        if (s.ctx) s.ctx.resume();
        s.audio.onended = stop;
        s.audio.play().then(() => {
          setPlaying(true);
          if (s.analyser && !reduced) {
            const data = new Uint8Array(s.analyser.frequencyBinCount);
            const loop = () => {
              s.analyser.getByteFrequencyData(data);
              const bins = 8, step = Math.max(1, Math.floor(data.length / bins)), out = [];
              for (let i = 0; i < bins; i++) {
                let sum = 0; for (let j = 0; j < step; j++) sum += data[i * step + j] || 0;
                out.push((sum / step) / 255);
              }
              setLevels(out); s.raf = requestAnimationFrame(loop);
            };
            loop();
          }
        }).catch(() => { setPlaying(false); });
      } catch (e) { setPlaying(false); }
      return;
    }

    // 2) no recording: speak it for real with the browser voice
    if (typeof speechSynthesis !== "undefined" && text) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "fr-FR"; u.rate = 0.82; u.pitch = 1;
      const voices = speechSynthesis.getVoices();
      const fr = voices.find(v => (v.lang || "").toLowerCase().startsWith("fr"));
      if (fr) u.voice = fr;
      u.onend = stop; u.onerror = stop;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
      setPlaying(true);
      if (!reduced) {
        let t0 = performance.now();
        const loop = (t) => {
          const e = (t - t0) / 130;
          const out = Array.from({ length: 8 }, (_, i) => 0.18 + 0.62 * Math.abs(Math.sin(e + i * 0.7)));
          setLevels(out);
          if (speechSynthesis.speaking) s.raf = requestAnimationFrame(loop); else stop();
        };
        s.raf = requestAnimationFrame(loop);
      }
      return;
    }

    // 3) nothing available: brief animation only
    setPlaying(true);
    if (!reduced) {
      let t0 = performance.now();
      const loop = (t) => {
        if (t - t0 > 2400) { stop(); return; }
        const e = (t - t0) / 130;
        setLevels(Array.from({ length: 8 }, (_, i) => 0.18 + 0.62 * Math.abs(Math.sin(e + i * 0.7))));
        s.raf = requestAnimationFrame(loop);
      };
      s.raf = requestAnimationFrame(loop);
    } else { setTimeout(stop, 1200); }
  }, [playing, stop]);

  useEffect(() => () => stop(), [stop]);
  return { play, stop, playing, levels };
}

/* ——— Waveform ——— driven by live `levels` when present, else CSS pulse while `playing` */
function Waveform({ playing, levels }) {
  const bars = 8;
  const reduced = prefersReducedMotion();
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 24 }} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const lvl = levels ? Math.max(0.06, levels[i]) : null;
        const live = lvl != null;
        return (
          <div key={i} style={{
            width: 3, borderRadius: 2,
            height: live ? `${6 + lvl * 18}px` : (playing && !reduced ? undefined : 8),
            background: i % 2 ? "var(--gold)" : "var(--blue)",
            animation: (!live && playing && !reduced) ? `blWave .9s ease-in-out ${i * 0.08}s infinite` : "none",
            transition: live ? "height .08s linear" : "none",
            opacity: playing ? 1 : .5,
          }} />
        );
      })}
    </div>
  );
}

/* ——— Section heading (serif) ——— */
function SerifLine({ children, size = 27, style }) {
  return <div className="serif" style={{
    fontSize: size, lineHeight: 1.5, color: "var(--ink)", fontWeight: 400, textWrap: "pretty", ...style
  }}>{children}</div>;
}

Object.assign(window, {
  MARK, BrandSeal, Eyebrow, Button, ContinuePill, TextLink, TopBar, IconBtn, BarTitle,
  ProgressThread, Badge, Card, Gloss, Disclosure, LensCard, MiniAccordion, Waveform, SerifLine,
  useLineAudio, prefersReducedMotion,
});
