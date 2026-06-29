/* Belletra — Spaced word review (the volume layer) + Session complete. */
const { useState: useStateR } = React;

function ScreenReview({ ctx }) {
  const { nav, data } = ctx;
  const queue = data.REVIEW_QUEUE;
  const [idx, setIdx] = useStateR(0);
  const [revealed, setRevealed] = useStateR(false);
  const w = queue[idx];

  const advance = () => {
    if (idx + 1 < queue.length) { setIdx(idx + 1); setRevealed(false); }
    else nav.reset("complete");
  };
  const again = () => { setRevealed(false); /* keep on same word, send to back conceptually */ advance(); };

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="close" onClick={() => nav.reset("complete")}>✕</IconBtn>}
        center={<ProgressThread total={queue.length} current={idx} />}
        right={<span style={{ width: 30 }} />}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Eyebrow>Volume · Spaced review</Eyebrow>
        <div style={{ font: "400 12.5px var(--sans)", color: "var(--faint)", marginTop: 8 }}>
          word {idx + 1} of {queue.length} · from earlier sittings
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Card key={idx} style={{ textAlign: "center", padding: "34px 22px", animation: "blFadeUp .42s var(--ease) both" }}>
            <div className="serif" style={{ fontSize: 34, color: "var(--ink)" }}>{w.term}</div>
            {!revealed ? (
              <div style={{ marginTop: 24 }}>
                <div style={{ font: "400 13px var(--sans)", color: "var(--faint)", fontStyle: "italic", marginBottom: 18 }}>recall its meaning…</div>
                <Button kind="default" style={{ maxWidth: 200, margin: "0 auto" }} onClick={() => setRevealed(true)}>reveal</Button>
              </div>
            ) : (
              <div style={{ marginTop: 20, animation: "blReveal .32s var(--ease) both" }}>
                <div className="serif" style={{ fontSize: 21, color: "var(--green)" }}>{w.gloss}</div>
                <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", marginTop: 8 }}>from {w.from}</div>
              </div>
            )}
          </Card>

          {revealed && (
            <div style={{ display: "flex", gap: 10, marginTop: 16, animation: "blReveal .32s var(--ease) both" }}>
              <Button kind="default" onClick={again}>review again</Button>
              <Button kind="primary" onClick={advance}>I knew it</Button>
            </div>
          )}
        </div>

        <div style={{ font: "400 12px/1.6 var(--sans)", color: "var(--faint)", fontStyle: "italic", textAlign: "center", paddingTop: 16 }}>
          The new sentence is for love; these revisits are what build memory.
        </div>
      </div>
    </Pad>
  );
}

function StatRow({ label, value, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      padding: "13px 0", borderBottom: last ? "none" : "1px solid var(--line)",
    }}>
      <span style={{ font: "400 13.5px var(--sans)", color: "var(--soft)" }}>{label}</span>
      <span className="serif" style={{ fontSize: 22, color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

function ScreenComplete({ ctx }) {
  const { nav, data } = ctx;
  const t = data.TOMORROW;
  return (
    <Pad>
      <TopBar left={<span style={{ width: 30 }} />} center={<span />} right={<IconBtn label="close" onClick={() => nav.reset("cover")}>✕</IconBtn>} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", textAlign: "center" }}>
        <div style={{ height: 14 }} />
        <div style={{ fontSize: 44, color: "var(--gold)", animation: "blGild 1.4s var(--ease) both" }}>{MARK.anthology}</div>
        <div className="serif" style={{ fontSize: 27, color: "var(--ink)", marginTop: 18 }}>The sitting is complete</div>
        <div style={{ font: "400 13px var(--sans)", color: "var(--faint)", marginTop: 10 }}>
          1 line · 4 words revisited · 5 active words
        </div>

        <Card style={{ width: "100%", marginTop: 30, background: "var(--goldBg)", border: "1px solid var(--gold)", textAlign: "left", padding: "18px 19px" }}>
          <div style={{ font: "600 10px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>{MARK.fleuron}&nbsp; Tomorrow's line</div>
          <div className="serif" style={{ fontSize: 19, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.5 }}>{t.preview}</div>
          <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", marginTop: 12 }}>{t.meta}</div>
        </Card>

        <div style={{ height: 34 }} />
        <RhythmWidget days={[1,1,2,1,1,1,0]} caption="today added — gently, no pressure" />

        <div style={{ flex: 1, minHeight: 24 }} />
        <Button kind="primary" style={{ maxWidth: 260 }} onClick={() => nav.reset("cover")}>close the book →</Button>
      </div>
    </Pad>
  );
}

Object.assign(window, { ScreenReview, ScreenComplete, StatRow });
