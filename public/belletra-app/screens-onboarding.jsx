/* Belletra — Onboarding: welcome/scope, language, why, daily dose. */
const { useState: useStateO } = React;

function OptionRow({ selected, disabled, onClick, title, sub, right, check }) {
  const [hover, setHover] = useStateO(false);
  return (
    <button disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
        padding: "16px 17px", borderRadius: 13, cursor: disabled ? "default" : "pointer",
        background: selected ? "var(--goldBg)" : "var(--card)",
        border: `1px solid ${selected ? "var(--gold)" : hover && !disabled ? "var(--line2)" : "var(--line)"}`,
        opacity: disabled ? .5 : 1, transition: "all .2s var(--ease)",
      }}>
      <div style={{ flex: 1 }}>
        <div className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{title}</div>
        {sub && <div style={{ font: "400 12.5px var(--sans)", color: "var(--faint)", marginTop: 3 }}>{sub}</div>}
      </div>
      {right && <div style={{ font: "600 10px var(--sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>{right}</div>}
      {check && selected && <div style={{ color: "var(--gold)", fontSize: 16 }}>✓</div>}
    </button>
  );
}

function ScreenOnboarding({ ctx }) {
  const { nav, mode } = ctx;
  const [step, setStep] = useStateO(0);
  const [lang, setLang] = useStateO("fr");
  const [why, setWhy] = useStateO([]);
  const [dose, setDose] = useStateO(5);
  const [wishlist, setWishlist] = useStateO([]);
  const toggleWhy = (k) => setWhy(w => w.includes(k) ? w.filter(x => x !== k) : [...w, k]);
  const toggleWish = (k) => setWishlist(w => w.includes(k) ? w.filter(x => x !== k) : [...w, k]);

  const upcoming = [
    ["it", "Italian"],
    ["es", "Spanish"],
    ["la", "Latin"],
    ["ru", "Russian"],
    ["ja", "Japanese"],
  ];
  const whys = [
    ["read", "To read its literature"],
    ["sound", "To love the sound of it"],
    ["write", "To write beautifully"],
    ["beauty", "Simply for the beauty"],
  ];
  const doses = [
    [3, "3", "a quiet few"],
    [5, "5", "a daily sitting"],
    [8, "8", "a deep draught"],
  ];

  if (step === 0) {
    return (
      <Pad center>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <BrandSeal size={76} dark={mode === "dark"} />
          <div className="serif" style={{ fontSize: 30, color: "var(--ink)", marginTop: 22 }}>Welcome to Belletra</div>
          <Card style={{ marginTop: 26, textAlign: "left", padding: "20px 19px" }}>
            <div className="serif" style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink)" }}>
              Each day: one beautiful sentence, inhabited deeply — its words, grammar, music, and the genius of the language — plus a few earlier words brought back, so your vocabulary truly grows.
            </div>
            <div style={{ font: "400 13px/1.7 var(--sans)", color: "var(--soft)", marginTop: 14 }}>
              Honestly: this builds reading, appreciation, and real — but unhurried — vocabulary. Not party fluency. For speaking, we'll hand you to a partner.
            </div>
          </Card>
          <div style={{ width: "100%", marginTop: 26 }}>
            <Button kind="primary" onClick={() => setStep(1)}>I'm here for that →</Button>
          </div>
        </div>
      </Pad>
    );
  }

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => setStep(s => s - 1)}>←</IconBtn>}
        center={<ProgressThread total={3} current={step - 1} />}
        right={<span style={{ width: 30 }} />}
      />
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Eyebrow>Step 1 of 3</Eyebrow>
          <div className="serif" style={{ fontSize: 25, color: "var(--ink)", margin: "10px 0 20px" }}>The language you'll read</div>
          <OptionRow title="French" sub="Fully authored · available today" selected check onClick={() => setLang("fr")} />

          <div style={{ font: "600 11px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--faint)", margin: "28px 0 6px" }}>What should we author next?</div>
          <div style={{ font: "400 12.5px/1.6 var(--sans)", color: "var(--soft)", fontStyle: "italic", marginBottom: 14 }}>
            For now Belletra speaks only French. Tell us where to go next — each pick is a vote that shapes what we build.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map(([k, name]) => (
              <OptionRow key={k} title={name}
                right={wishlist.includes(k) ? "on your list" : "vote"}
                selected={wishlist.includes(k)} check onClick={() => toggleWish(k)} />
            ))}
          </div>
          {wishlist.length > 0 && (
            <div style={{ font: "400 12px var(--sans)", color: "var(--gold)", fontStyle: "italic", marginTop: 14 }}>
              We'll write to you the day {wishlist.length === 1 ? "it" : "the first"} opens.
            </div>
          )}
          <div style={{ flex: 1, minHeight: 18 }} />
          <Button kind="dark" onClick={() => setStep(2)}>Continue with French</Button>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Eyebrow>Step 2 of 3 · Why are you here?</Eyebrow>
          <div className="serif" style={{ fontSize: 25, color: "var(--ink)", margin: "10px 0 22px" }}>What draws you to French?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {whys.map(([k, label]) => (
              <OptionRow key={k} title={label} selected={why.includes(k)} check onClick={() => toggleWhy(k)} />
            ))}
          </div>
          <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", fontStyle: "italic", marginTop: 16 }}>
            Choose as many as are true. There's no wrong reason to love a language.
          </div>
          <div style={{ flex: 1, minHeight: 12 }} />
          <Button kind="dark" disabled={!why.length} onClick={() => setStep(3)}>Continue</Button>
        </div>
      )}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Eyebrow>Step 3 of 3 · How many sentences a day?</Eyebrow>
          <div className="serif" style={{ fontSize: 25, color: "var(--ink)", margin: "10px 0 22px" }}>Set your daily dose.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {doses.map(([k, n, sub]) => (
              <OptionRow key={k} title={n} sub={sub} selected={dose === k} check onClick={() => setDose(k)} />
            ))}
          </div>
          <Card style={{ marginTop: 18, background: "var(--goldBg)", border: "none", padding: "13px 15px" }}>
            <div style={{ font: "400 12px/1.6 var(--sans)", color: "var(--soft)", fontStyle: "italic" }}>
              A sitting is finite and ends cleanly. No streaks to lose, no “just one more.” Read what you can love, then close the book.
            </div>
          </Card>
          <div style={{ flex: 1, minHeight: 12 }} />
          <Button kind="primary" onClick={() => nav.reset("cover")}>Enter Belletra</Button>
        </div>
      )}
    </Pad>
  );
}

Object.assign(window, { ScreenOnboarding, OptionRow });
