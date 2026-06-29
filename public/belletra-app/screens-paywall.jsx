/* Belletra — Paywall / subscription. Appears after the 3rd free sentence.
   An invitation, not a push: calm, intellectual, on-brand. */
const { useState: useStatePay } = React;

/* a single value line, led by the gold "genius" mark */
function ValueProp({ children }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", textAlign: "left" }}>
      <span style={{ color: "var(--gold)", fontSize: 13, lineHeight: 1.5, flexShrink: 0, marginTop: 1 }}>{MARK.genius}</span>
      <span style={{ font: "400 13.5px/1.55 var(--sans)", color: "var(--soft)" }}>{children}</span>
    </div>
  );
}

/* a selectable plan */
function PlanRow({ selected, onClick, title, price, period, note, badge }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
      padding: "15px 17px", borderRadius: 14, cursor: "pointer",
      background: selected ? "var(--goldBg)" : "var(--card)",
      border: `1px solid ${selected ? "var(--gold)" : "var(--line)"}`,
      transition: "all .2s var(--ease)",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `1.5px solid ${selected ? "var(--gold)" : "var(--line2)"}`,
        display: "grid", placeItems: "center", transition: "border-color .2s var(--ease)",
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--gold)" }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{title}</span>
          {badge && <span style={{
            font: "600 9px var(--sans)", letterSpacing: ".09em", textTransform: "uppercase",
            color: "var(--gold)", border: "1px solid var(--gold)", borderRadius: 6, padding: "3px 7px",
          }}>{badge}</span>}
        </div>
        <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", marginTop: 3 }}>{note}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ font: "600 16px var(--sans)", color: "var(--ink)" }}>{price}</div>
        <div style={{ font: "400 11px var(--sans)", color: "var(--faint)" }}>{period}</div>
      </div>
    </button>
  );
}

function ScreenPaywall({ ctx }) {
  const { nav, mode } = ctx;
  const [plan, setPlan] = useStatePay("year");
  const trailing = plan === "year" ? "then $9.99 / year" : "then $1.99 / month";

  return (
    <Pad style={{ paddingTop: 6 }}>
      <TopBar
        left={<span style={{ width: 30 }} />}
        center={<span />}
        right={<IconBtn label="close" onClick={() => nav.back()}>×</IconBtn>}
      />

      {/* invitation */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <BrandSeal size={44} dark={mode === "dark"} />
        <div style={{ font: "600 11px var(--sans)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginTop: 16 }}>
          {MARK.fleuron}&nbsp; The full library
        </div>
        <div className="serif" style={{ fontSize: 27, lineHeight: 1.3, color: "var(--ink)", marginTop: 13, textWrap: "balance" }}>
          You've read three.<br />Read the rest.
        </div>
        <div style={{ font: "400 13.5px/1.6 var(--sans)", color: "var(--soft)", marginTop: 12, maxWidth: 300 }}>
          The three you've met were chosen and annotated by hand. So are the hundreds waiting.
        </div>
      </div>

      {/* value */}
      <Card style={{ marginTop: 24, padding: "18px 18px", display: "flex", flexDirection: "column", gap: 13 }}>
        <ValueProp>Every sentence is hand-picked and deeply analysed — never generated, never crowdsourced.</ValueProp>
        <ValueProp>Learn the French that writers reached for, not just the French that gets you by.</ValueProp>
        <ValueProp>More sentences — and more languages — added every week.</ValueProp>
      </Card>

      {/* plans */}
      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 18 }}>
        <PlanRow
          selected={plan === "year"} onClick={() => setPlan("year")}
          title="Yearly" price="$9.99" period="/ year"
          note="≈ $0.83 / month · 7-day free trial" badge="Best value · saves 58%"
        />
        <PlanRow
          selected={plan === "month"} onClick={() => setPlan("month")}
          title="Monthly" price="$1.99" period="/ month"
          note="7-day free trial"
        />
      </div>

      {/* CTA */}
      <div style={{ marginTop: 20 }}>
        <Button kind="primary" onClick={() => nav.reset("cover")}>Start 7-day free trial →</Button>
        <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", textAlign: "center", marginTop: 10 }}>
          Free for 7 days — {trailing}.
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 16 }} />

      <div style={{ font: "400 12.5px var(--sans)", color: "var(--faint)", fontStyle: "italic", textAlign: "center", paddingBottom: 4 }}>
        Cancel anytime. Grows with you.
      </div>
    </Pad>
  );
}

Object.assign(window, { ScreenPaywall, PlanRow, ValueProp });
