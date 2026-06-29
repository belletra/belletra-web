/* Belletra — Library, Sentence detail, DB record (curator inspector). */
const { useState: useStateL } = React;

function Chip({ on, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      font: "500 12px var(--sans)", padding: "8px 15px", borderRadius: 22, cursor: "pointer",
      border: `1px solid ${on ? "var(--ink)" : "var(--line2)"}`,
      background: on ? "var(--ink)" : "transparent", color: on ? "var(--paper)" : "var(--soft)",
      transition: "all .2s var(--ease)", whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

function LineRow({ line, onClick }) {
  return (
    <Card hoverable onClick={onClick} style={{ padding: "16px 17px" }}>
      <div className="serif" style={{ fontSize: 18.5, color: "var(--ink)", lineHeight: 1.45, textWrap: "pretty" }}>{line.text}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 10 }}>
        <div className="serif" style={{ fontStyle: "italic", fontSize: 13, color: "var(--faint)" }}>{line.author} · {line.cefr}</div>
        <Badge kind={line.status === "published" ? "deep" : "queued"}>{line.status === "published" ? "deep" : "queued"}</Badge>
      </div>
      <div style={{ font: "400 12px var(--sans)", color: "var(--gold)", marginTop: 9 }}>{MARK.genius} {line.feature}</div>
    </Card>
  );
}

function ScreenLibrary({ ctx }) {
  const { nav, data } = ctx;
  const [q, setQ] = useStateL("");
  const [focused, setFocused] = useStateL(false);

  let list = data.LIBRARY.filter(l => {
    if (l.status !== "published") return false;
    if (!q.trim()) return true;
    const s = (l.text + " " + l.author + " " + l.feature).toLowerCase();
    return s.includes(q.toLowerCase());
  });

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>The library</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />
      <input
        value={q} onChange={e => setQ(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder="search line, author, or feature…"
        style={{
          width: "100%", font: "400 14px var(--sans)", color: "var(--ink)", padding: "12px 16px",
          borderRadius: 22, border: `1px solid ${focused ? "var(--gold)" : "var(--line2)"}`,
          background: "var(--card)", outline: "none", transition: "border-color .2s var(--ease)",
        }} />
      <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", margin: "18px 0 14px" }}>
        {list.length} lines, each written to full depth
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map(l => (
          <LineRow key={l.id} line={l} onClick={() => nav.go("detail", { id: l.id })} />
        ))}
        {!list.length && <div style={{ font: "400 13px var(--sans)", color: "var(--faint)", fontStyle: "italic", textAlign: "center", padding: "30px 0" }}>no lines match that search.</div>}
      </div>
    </Pad>
  );
}

function ScreenDetail({ ctx, params }) {
  const { nav, data } = ctx;
  const line = data.LIBRARY.find(l => l.id === params.id) || data.VERLAINE;
  const deep = line.status === "published";
  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>{deep ? "" : "Spine record"}</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 16 }}>
        <SerifLine size={25} style={{ textAlign: "center", padding: "0 4px" }}>« {line.text} »</SerifLine>
        <div style={{ font: "400 12.5px var(--sans)", color: "var(--faint)" }}>{line.author} · {line.work} · {line.year}</div>
        {line.translation && <Gloss>{line.translation}</Gloss>}

        <Card style={{ width: "100%", marginTop: 12, padding: "17px 19px", textAlign: "left" }}>
          <div style={{ font: "600 10px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 9 }}>The genius it teaches</div>
          <div className="serif" style={{ fontSize: 17, color: "var(--ink)", lineHeight: 1.35 }}>{MARK.genius} {line.feature}</div>
          {deep && line.lenses && line.lenses.genius && (
            <React.Fragment>
              <div style={{ font: "400 13px/1.6 var(--sans)", color: "var(--soft)", marginTop: 10 }}>
                {line.lenses.genius.claim.surface}
              </div>
              <div style={{ height: 1, background: "var(--line)", margin: "14px 0 12px" }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
                <div>
                  <div style={{ font: "600 9px var(--sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>the grammar beneath it</div>
                  <div className="serif" style={{ fontSize: 13.5, color: "var(--ink)", fontStyle: "italic", marginTop: 3 }}>{line.lenses.grammar.name}</div>
                </div>
                <div>
                  <div style={{ font: "600 9px var(--sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>level</div>
                  <div className="serif" style={{ fontSize: 13.5, color: "var(--ink)", marginTop: 3 }}>{line.cefr}</div>
                </div>
              </div>
            </React.Fragment>
          )}
        </Card>

        {deep ? (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            <Button kind="primary" onClick={() => nav.go("descent")}>study deeply →</Button>
            <Button kind="default" onClick={() => nav.go("dbrecord", { id: line.id })}>{"{ }"} data</Button>
          </div>
        ) : (
          <div style={{ width: "100%", marginTop: 4 }}>
            <div style={{ background: "var(--goldBg)", borderRadius: 13, padding: "14px 16px", marginBottom: 12, textAlign: "left" }}>
              <div style={{ font: "400 12.5px/1.6 var(--sans)", color: "var(--soft)", fontStyle: "italic" }}>
                Spine record — queued for authoring. Its six lenses are not yet written to full depth.
              </div>
            </div>
            <Button kind="default" onClick={() => nav.go("dbrecord", { id: line.id })}>{"{ }"} view record</Button>
          </div>
        )}
      </div>
    </Pad>
  );
}

/* —— DB record: pretty, syntax-tinted JSON —— */
function buildRecord(line, isVerlaine) {
  if (isVerlaine) {
    return {
      id: line.id, author: line.author, work: line.work, year: line.year, cefr: line.cefr,
      feature: line.feature, curator: line.curator,
      text: line.text, hinge_token: line.hinge_token,
      tokens: line.tokens,
      translation: line.translation,
      words: { "cœur": { pos: "noun", gloss: "heart", etymology: { surface: "from Latin cor, cordis…", deep: "… (full paragraph)" } }, "…": "4 more" },
      lenses: {
        swap: { alternatives: "[ 3 — each with a paragraph verdict ]" },
        grammar: { name: line.lenses.grammar.name, explain: { surface: "…", deep: "…" }, rule: line.lenses.grammar.rule },
        genius: { name: line.lenses.genius.name, claim: { surface: "…", deep: "…" }, contrast: "…" },
        ear: { note: { surface: "…", deep: "…" } },
        turn: { note: { surface: "…", deep: "…" } },
        silence: { note: { surface: "…", deep: "…" } }
      },
      curation: { status: "published", human_verified: true, depth: "full" }
    };
  }
  return {
    id: line.id, author: line.author, work: line.work, year: line.year, cefr: line.cefr,
    feature: line.feature, text: line.text,
    tokens: null, words: null,
    lenses: { swap: null, grammar: null, genius: null, ear: null, turn: null, silence: null },
    curation: { status: "queued", human_verified: false, depth: 0 }
  };
}

function highlightJSON(obj) {
  const json = JSON.stringify(obj, null, 2);
  const esc = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = "num";
    if (/^"/.test(match)) cls = /:$/.test(match) ? "key" : "str";
    else if (/true|false|null/.test(match)) cls = "bool";
    const colors = { key: "var(--blue)", str: "var(--green)", num: "var(--gold)", bool: "var(--gold)" };
    return `<span style="color:${colors[cls]}">${match}</span>`;
  });
}

function ScreenDBRecord({ ctx, params }) {
  const { nav, data } = ctx;
  const line = data.LIBRARY.find(l => l.id === params.id) || data.VERLAINE;
  const isV = line.id === data.VERLAINE.id;
  const html = highlightJSON(buildRecord(line, isV));
  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>{"{ }"} record</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />
      <div style={{ font: "400 12px/1.6 var(--sans)", color: "var(--faint)", fontStyle: "italic", marginBottom: 14 }}>
        The sentence record. Learner state — anthology, schedule, rhythm — lives separately and never touches this.
      </div>
      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 13, padding: "16px 16px", overflowX: "auto" }}>
        <pre style={{ margin: 0, font: "400 11.5px/1.7 ui-monospace, 'SF Mono', Menlo, Consolas, monospace", color: "var(--soft)", whiteSpace: "pre" }}
          dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {isV && (
        <div style={{ marginTop: 16 }}>
          <Button kind="primary" onClick={() => nav.go("descent")}>study this line →</Button>
        </div>
      )}
    </Pad>
  );
}

Object.assign(window, { ScreenLibrary, ScreenDetail, ScreenDBRecord, Chip, LineRow });
