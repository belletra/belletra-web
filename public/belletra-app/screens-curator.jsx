/* Belletra — Curator authoring view (internal tool): compose a queued line's six lenses. */
/* curator authoring */
const { useState: useStateCur } = React;

function Field({ label, hint, target, value, onChange, rows = 3 }) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const met = target ? words >= target * 0.7 : false;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ font: "600 10px var(--sans)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--soft)" }}>{label}</label>
        {target ? <span style={{ font: "500 10px var(--sans)", color: met ? "var(--green)" : "var(--faint)" }}>{words} / ~{target} words</span> : null}
      </div>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} style={{
        width: "100%", resize: "vertical", font: "400 13px/1.6 var(--sans)", color: "var(--ink)",
        background: "var(--card)", border: "1px solid var(--line2)", borderRadius: 11, padding: "10px 12px",
        outline: "none",
      }} />
      {hint && <div style={{ font: "400 11px var(--sans)", color: "var(--faint)", fontStyle: "italic", marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "20px 0 12px" }}>
        <span style={{ color: "var(--gold)", fontSize: 14, width: 16, textAlign: "center" }}>{icon}</span>
        <span style={{ font: "600 11px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink)" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      {children}
    </div>
  );
}

function ScreenCurator({ ctx }) {
  const { nav } = ctx;
  const [f, setF] = useStateCur({
    grammarSurface: "", grammarDeep: "", grammarRule: "",
    geniusSurface: "", geniusDeep: "", geniusContrast: "",
    earSurface: "", earDeep: "",
    etymSurface: "From Latin mare — the sea.", etymDeep: "",
  });
  const set = (k) => (val) => setF(s => ({ ...s, [k]: val }));
  const [status, setStatus] = useStateCur("drafted");
  const [verified, setVerified] = useStateCur(false);

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>Authoring</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />

      {/* the line being authored */}
      <Card style={{ padding: "16px 17px" }}>
        <div style={{ font: "600 10px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 9 }}>Now composing</div>
        <div className="serif" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1.45 }}>La mer, la mer, toujours recommencée</div>
        <div className="serif" style={{ fontStyle: "italic", fontSize: 12.5, color: "var(--faint)", marginTop: 8 }}>Paul Valéry · Le Cimetière marin · 1920 · B2</div>
        <div style={{ font: "400 12px var(--sans)", color: "var(--gold)", marginTop: 8 }}>{MARK.genius} the participle as eternity</div>
      </Card>

      {/* depth rubric */}
      <div style={{ background: "var(--blueBg)", borderRadius: 11, padding: "12px 14px", marginTop: 14 }}>
        <div style={{ font: "600 10px var(--sans)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 6 }}>Depth rubric</div>
        <div style={{ font: "400 12px/1.6 var(--sans)", color: "var(--soft)" }}>
          Each lens: a one-sentence <em>surface</em> the casual reader rests on, and a paragraph <em>deep</em> (~60–90 words) that earns the word “scholarship.” No filler. Verify every etymological claim.
        </div>
      </div>

      <Section icon={MARK.root} title="Word — etymology">
        <Field label="surface" target={20} rows={2} value={f.etymSurface} onChange={set("etymSurface")} />
        <Field label="deep" target={70} rows={4} value={f.etymDeep} onChange={set("etymDeep")} hint="trace the root; what did the Latin/Greek carry that French kept?" />
      </Section>

      <Section icon="ⓐ" title="Grammar">
        <Field label="construction name" target={0} rows={1} value={f.grammarRule ? "" : ""} onChange={() => {}} />
        <Field label="surface" target={28} rows={2} value={f.grammarSurface} onChange={set("grammarSurface")} />
        <Field label="deep" target={80} rows={4} value={f.grammarDeep} onChange={set("grammarDeep")} />
        <Field label="rule chip" target={0} rows={1} value={f.grammarRule} onChange={set("grammarRule")} hint="one line, e.g. “participle + recommencée = an action eternally re-begun”" />
      </Section>

      <Section icon={MARK.genius} title="Only in French — the genius">
        <Field label="claim · surface" target={28} rows={2} value={f.geniusSurface} onChange={set("geniusSurface")} />
        <Field label="claim · deep" target={85} rows={4} value={f.geniusDeep} onChange={set("geniusDeep")} />
        <Field label="contrast (English: …)" target={0} rows={2} value={f.geniusContrast} onChange={set("geniusContrast")} />
      </Section>

      <Section icon={MARK.music} title="The music · ear">
        <Field label="surface" target={24} rows={2} value={f.earSurface} onChange={set("earSurface")} />
        <Field label="deep" target={70} rows={4} value={f.earDeep} onChange={set("earDeep")} />
      </Section>

      <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", fontStyle: "italic", textAlign: "center", margin: "6px 0 16px" }}>
        ⇄ the turn · ◦ the silence · + two swaps remaining
      </div>

      {/* status + verified */}
      <Card style={{ padding: "16px 17px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ font: "400 13px var(--sans)", color: "var(--soft)" }}>Status</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["drafted", "queued", "published"].map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{
                font: "500 11px var(--sans)", padding: "6px 11px", borderRadius: 18, cursor: "pointer",
                border: `1px solid ${status === s ? "var(--gold)" : "var(--line2)"}`,
                background: status === s ? "var(--goldBg)" : "transparent",
                color: status === s ? "var(--gold)" : "var(--faint)", transition: "all .2s var(--ease)",
              }}>{s}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setVerified(v => !v)} style={{
          display: "flex", alignItems: "center", gap: 10, background: "none", border: "none",
          cursor: "pointer", padding: 0, width: "100%",
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${verified ? "var(--green)" : "var(--line2)"}`,
            background: verified ? "var(--green)" : "transparent", color: "#fff", display: "grid", placeItems: "center", fontSize: 13,
          }}>{verified ? "✓" : ""}</span>
          <span style={{ font: "400 13px var(--sans)", color: "var(--soft)" }}>human verified — claims checked against sources</span>
        </button>
      </Card>

      <div style={{ marginTop: 16 }}>
        <Button kind="default" onClick={() => nav.go("descent")} style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>preview the descent →</Button>
      </div>
    </Pad>
  );
}

Object.assign(window, { ScreenCurator });
