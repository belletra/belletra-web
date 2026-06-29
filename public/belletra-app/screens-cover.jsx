/* Belletra — Cover / Today (home), plus the shared reading-rhythm widget. */
const { useState: useStateC } = React;

function Pad({ children, center, style }) {
  return <div style={{
    padding: "6px 26px 30px", display: "flex", flexDirection: "column", flex: 1,
    ...(center ? { justifyContent: "center" } : {}), ...style
  }}>{children}</div>;
}

/* Reading-rhythm widget — forgiving, never punitive */
function RhythmWidget({ days = [1,1,2,1,1,0,0], caption = "a missed day breaks nothing." }) {
  // 1 = practiced, 2 = freeze held, 0 = upcoming/empty
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
        {days.map((d, i) => (
          <div key={i} style={{
            width: 9, height: 9, borderRadius: "50%", display: "grid", placeItems: "center",
            background: d === 1 ? "var(--gold)" : "transparent",
            border: d === 1 ? "none" : `1px solid var(--line2)`,
            color: "var(--blue)", fontSize: 9,
          }}>{d === 2 ? MARK.freeze : ""}</div>
        ))}
      </div>
      <div style={{ font: "400 11px var(--sans)", color: "var(--faint)", fontStyle: "italic" }}>{caption}</div>
    </div>
  );
}

function ScreenCover({ ctx }) {
  const { nav, data, mode } = ctx;
  const v = data.VERLAINE;
  return (
    <Pad style={{ paddingTop: 16 }}>
      {/* brand header — compact */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <BrandSeal size={48} dark={mode === "dark"} />
        <div className="serif" style={{ fontSize: 29, letterSpacing: ".02em", color: "var(--ink)", fontWeight: 400, marginTop: 13 }}>Belletra</div>
        <div style={{ font: "600 10.5px var(--sans)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--faint)", marginTop: 11 }}>Tuesday · 9 June</div>
      </div>

      {/* hero — today's sentence, centered in the remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, minHeight: 0 }}>
        <Card style={{ textAlign: "center", padding: "26px 22px 24px" }}>
          <Eyebrow style={{ color: "var(--gold)" }}>{MARK.fleuron}&nbsp; Today's sentence</Eyebrow>
          <div className="serif" style={{ fontSize: 14, color: "var(--soft)", marginTop: 15 }}>from {v.author}</div>
          <div className="serif" style={{ fontSize: 24, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.5, marginTop: 8, textWrap: "balance" }}>
            « Il pleure dans mon cœur… »
          </div>
          <div style={{ width: 28, height: 2, background: "var(--gold)", borderRadius: 2, margin: "18px auto 0" }} />
          <div style={{ font: "400 11.5px var(--sans)", color: "var(--faint)", marginTop: 16 }}>
            chosen &amp; annotated by {v.curator}
          </div>
        </Card>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 13, alignItems: "center" }}>
          <Button kind="primary" onClick={() => nav.go("descent")} style={{ maxWidth: 280 }}>Read it deeply →</Button>
          <TextLink onClick={() => nav.go("library")}>browse the library →</TextLink>
        </div>
      </div>

      {/* footer — quiet anchor */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, paddingTop: 18 }}>
        <RhythmWidget />
        <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
          <TextLink onClick={() => nav.go("anthology")} style={{ fontSize: 12.5, textDecoration: "none", color: "var(--faint)" }}>anthology</TextLink>
          <span style={{ color: "var(--line2)", alignSelf: "center" }}>·</span>
          <TextLink onClick={() => nav.go("you")} style={{ fontSize: 12.5, textDecoration: "none", color: "var(--faint)" }}>you</TextLink>
        </div>
      </div>
    </Pad>
  );
}

Object.assign(window, { ScreenCover, RhythmWidget, Pad });
