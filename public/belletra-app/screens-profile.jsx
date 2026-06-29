/* Belletra — Anthology (kept lines) + You / Progress. */
const { useState: useStateP } = React;

function AnthologyCard({ item, gilt }) {
  return (
    <div style={{
      position: "relative", background: gilt ? "var(--goldBg)" : "var(--card)",
      border: `1px solid ${gilt ? "var(--gold)" : "var(--line)"}`, borderRadius: 14, padding: "18px 18px",
    }}>
      {gilt && <div style={{ position: "absolute", top: 12, right: 14, color: "var(--gold)", fontSize: 15 }}>{MARK.genius}</div>}
      <div className="serif" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1.5, textWrap: "pretty", paddingRight: gilt ? 22 : 0 }}>{item.text}</div>
      <div className="serif" style={{ fontStyle: "italic", fontSize: 12.5, color: "var(--faint)", marginTop: 11 }}>{item.author} · {item.theme}</div>
    </div>
  );
}

function ScreenAnthology({ ctx }) {
  const { nav, data, kept } = ctx;
  const v = data.VERLAINE;
  const list = [];
  if (kept.includes(v.id)) list.push({ text: v.text, author: v.author, theme: "agentless grief", gilt: true });
  data.ANTHOLOGY_SEED.forEach(s => list.push(s));

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>Anthology</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />
      <div className="serif" style={{ fontSize: 25, color: "var(--ink)", marginBottom: 4 }}>Your kept lines.</div>
      <div style={{ font: "400 12.5px var(--sans)", color: "var(--faint)", marginBottom: 22 }}>
        {list.length} line{list.length === 1 ? "" : "s"} · a book you write simply by reading
      </div>

      {list.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((item, i) => <AnthologyCard key={i} item={item} gilt={item.gilt} />)}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div className="serif" style={{ fontSize: 20, fontStyle: "italic", color: "var(--faint)", lineHeight: 1.8 }}>
            The lines you love<br />will gather here —<br />a book you write<br />simply by reading.
          </div>
        </div>
      )}
    </Pad>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{ height: 7, borderRadius: 4, background: "var(--line)", overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: "var(--gold)", borderRadius: 4, transition: "width .5s var(--ease)" }} />
    </div>
  );
}

function ScreenYou({ ctx }) {
  const { nav, data, kept, mode, setMode, sub } = ctx;
  const keptCount = (kept.includes(data.VERLAINE.id) ? 1 : 0) + data.ANTHOLOGY_SEED.length;
  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>You</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />
      <div className="serif" style={{ fontSize: 25, color: "var(--ink)", marginBottom: 18 }}>Your reading life.</div>

      <Card style={{ padding: "6px 18px" }}>
        <StatRow label="Active words (can recall)" value="48" />
        <StatRow label="Grammar met" value="12" />
        <StatRow label="Lines kept" value={keptCount} />
        <StatRow label="Reading rhythm" value="5 ⁄ 7" last />
      </Card>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }}>
          <span style={{ font: "400 13px var(--sans)", color: "var(--soft)" }}>Toward B2</span>
          <span style={{ font: "500 12px var(--sans)", color: "var(--gold)" }}>62%</span>
        </div>
        <ProgressBar value={62} />
      </div>

      <Card style={{ marginTop: 18, background: "var(--goldBg)", border: "none" }}>
        <div style={{ font: "600 10px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>Sentence of the day</div>
        <div className="serif" style={{ fontSize: 17, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.5 }}>« Il pleure dans mon cœur »</div>
        <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", marginTop: 8 }}>Paul Verlaine · kept today</div>
      </Card>

      <Card style={{ marginTop: 14 }}>
        <div style={{ font: "600 11px var(--sans)", letterSpacing: ".04em", color: "var(--ink)", marginBottom: 8 }}>Want to speak it too?</div>
        <div style={{ font: "400 13px/1.7 var(--sans)", color: "var(--soft)" }}>
          Belletra builds reading &amp; vocabulary. When you're ready to talk, we pass your kept words to a tutor or AI partner.
        </div>
        <TextLink style={{ marginTop: 10, padding: "6px 0", color: "var(--gold)", textDecorationColor: "var(--goldBg)" }}>find a partner →</TextLink>
      </Card>

      <Card style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ font: "400 13px var(--sans)", color: "var(--soft)" }}>Appearance</span>
        <div style={{ display: "flex", gap: 7 }}>
          {[["light", "☀ light"], ["dark", "☾ dark"]].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              font: "500 12px var(--sans)", padding: "7px 13px", borderRadius: 20, cursor: "pointer",
              border: `1px solid ${mode === m ? "var(--gold)" : "var(--line2)"}`,
              background: mode === m ? "var(--goldBg)" : "transparent", color: mode === m ? "var(--gold)" : "var(--soft)",
              transition: "all .2s var(--ease)",
            }}>{label}</button>
          ))}
        </div>
      </Card>

      <button onClick={() => nav.go("account")} style={{
        marginTop: 14, width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
        background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px", cursor: "pointer",
      }}>
        <span style={{ flex: 1, font: "400 13.5px var(--sans)", color: "var(--ink)" }}>Account &amp; subscription</span>
        <span style={{ font: "400 12.5px var(--sans)", color: "var(--faint)" }}>{sub.plan === "life" ? "Lifelong" : sub.status === "canceled" ? "No plan" : sub.plan === "year" ? "Yearly" : "Monthly"}</span>
        <span style={{ color: "var(--faint)", fontSize: 16 }}>›</span>
      </button>

      <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", fontStyle: "italic", textAlign: "center", padding: "22px 0 4px" }}>
        No streaks to lose. A rhythm to keep, gently.
      </div>
    </Pad>
  );
}

Object.assign(window, { ScreenAnthology, ScreenYou, ProgressBar, AnthologyCard });
