/* Belletra — Account layer: auth, account home, subscription management, delete account.
   Same calm vocabulary as the rest of the app. */
const { useState: useStateAcc } = React;

const PLANS = {
  year:  { label: "Yearly",   price: "$9.99",  period: "/ year",  note: "≈ $0.83 / month" },
  month: { label: "Monthly",  price: "$1.99",  period: "/ month", note: "billed monthly" },
  life:  { label: "Lifetime", price: "$29.99", period: "once",     note: "Pay once — yours forever" },
};

/* ——— shared bits ——— */
function TextField({ label, type = "text", value, onChange, placeholder, autoFocus }) {
  const [focused, setFocused] = useStateAcc(false);
  return (
    <label style={{ display: "block" }}>
      <div style={{ font: "600 11px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 7 }}>{label}</div>
      <input
        type={type} value={value} placeholder={placeholder} autoFocus={autoFocus}
        onChange={e => onChange && onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", font: "400 15px var(--sans)", color: "var(--ink)", padding: "13px 15px",
          borderRadius: 10, border: `1px solid ${focused ? "var(--gold)" : "var(--line2)"}`,
          background: "var(--card)", outline: "none", boxSizing: "border-box",
          transition: "border-color .2s var(--ease)",
        }} />
    </label>
  );
}

function NavRow({ label, value, onClick, danger, last }) {
  const [hover, setHover] = useStateAcc(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
        padding: "15px 2px", cursor: "pointer", background: "transparent", border: "none",
        borderBottom: last ? "none" : "1px solid var(--line)",
      }}>
      <span style={{ flex: 1, font: "400 14.5px var(--sans)", color: danger ? "var(--rose)" : "var(--ink)" }}>{label}</span>
      {value && <span style={{ font: "400 13px var(--sans)", color: "var(--faint)" }}>{value}</span>}
      <span style={{ color: danger ? "var(--rose)" : "var(--faint)", fontSize: 16, opacity: hover ? 1 : .6, transition: "opacity .2s" }}>›</span>
    </button>
  );
}

/* ——— Auth — sign in / create account ——— */
function ScreenAuth({ ctx }) {
  const { nav, mode } = ctx;
  const [tab, setTab] = useStateAcc("create"); // create | signin
  const [email, setEmail] = useStateAcc("");
  const [pw, setPw] = useStateAcc("");
  const creating = tab === "create";

  return (
    <Pad style={{ paddingTop: 8 }}>
      <TopBar
        left={<span style={{ width: 30 }} />}
        center={<span />}
        right={<span style={{ width: 30 }} />}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <BrandSeal size={48} dark={mode === "dark"} />
        <div className="serif" style={{ fontSize: 27, color: "var(--ink)", marginTop: 16 }}>
          {creating ? "Make a Belletra account" : "Welcome back"}
        </div>
        <div style={{ font: "400 13px/1.6 var(--sans)", color: "var(--soft)", marginTop: 10, maxWidth: 290 }}>
          {creating
            ? "Your kept lines and reading rhythm, saved and carried across your devices."
            : "Pick up where you left off — your anthology is waiting."}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 13, marginTop: 28 }}>
        <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <TextField label="Password" type="password" value={pw} onChange={setPw} placeholder="••••••••" />
      </div>

      <div style={{ marginTop: 18 }}>
        <Button kind="primary" onClick={() => nav.reset(creating ? "onboarding" : "cover")}>
          {creating ? "Create account →" : "Sign in →"}
        </Button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ font: "400 11px var(--sans)", color: "var(--faint)", letterSpacing: ".06em" }}>or</span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Button kind="default" onClick={() => nav.reset(creating ? "onboarding" : "cover")}> Continue with Apple</Button>
        <Button kind="default" onClick={() => nav.reset(creating ? "onboarding" : "cover")}>Continue with Google</Button>
      </div>

      {/* taste it first — one sentence, no account */}
      <div style={{ textAlign: "center", marginTop: 22 }}>
        <TextLink onClick={() => nav.go("descent")} style={{ fontSize: 14, color: "var(--gold)" }}>
          Read one sentence first →
        </TextLink>
        <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", marginTop: 5 }}>
          No account needed. See how deep one line can go.
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 18 }} />
      <div style={{ textAlign: "center", paddingBottom: 4 }}>
        <span style={{ font: "400 13px var(--sans)", color: "var(--faint)" }}>
          {creating ? "Already have an account? " : "New to Belletra? "}
        </span>
        <TextLink onClick={() => setTab(creating ? "signin" : "create")} style={{ fontSize: 13, color: "var(--gold)" }}>
          {creating ? "Sign in" : "Create one"}
        </TextLink>
      </div>
    </Pad>
  );
}

/* ——— Account home ——— */
function ScreenAccount({ ctx }) {
  const { nav, sub, mode } = ctx;
  const planLabel = sub.plan === "life" ? "Lifelong member" : sub.status === "canceled" ? "No plan" : PLANS[sub.plan].label;
  const planSub = sub.status === "canceled"
    ? "Reading access ends 9 June 2026"
    : sub.status === "trial"
      ? `Free trial · renews 16 June 2026`
      : `Renews 9 June 2026`;

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>Account</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />

      {/* identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 22 }}>
        <BrandSeal size={52} dark={mode === "dark"} />
        <div>
          <div className="serif" style={{ fontSize: 20, color: "var(--ink)" }}>Claire Dubois</div>
          <div style={{ font: "400 13px var(--sans)", color: "var(--faint)", marginTop: 2 }}>claire@example.com</div>
        </div>
      </div>

      {/* subscription */}
      <div style={{ font: "600 11px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 10 }}>Subscription</div>
      {sub.plan === "life" ? (
        <Card style={{ background: "var(--goldBg)", border: "1px solid var(--gold)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--gold)", fontSize: 15 }}>{MARK.genius}</span>
            <span className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>Lifelong member</span>
          </div>
          <div style={{ font: "400 12.5px/1.6 var(--sans)", color: "var(--soft)", marginTop: 8 }}>
            You own Belletra for life — every sentence and every language we add, forever. Nothing to manage.
          </div>
        </Card>
      ) : (
        <Card style={{
          background: sub.status === "canceled" ? "var(--card)" : "var(--goldBg)",
          border: `1px solid ${sub.status === "canceled" ? "var(--line)" : "var(--gold)"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>Belletra · {planLabel}</div>
            <div style={{ font: "400 12.5px var(--sans)", color: sub.status === "canceled" ? "var(--rose)" : "var(--soft)", marginTop: 3 }}>{planSub}</div>
          </div>
          <TextLink onClick={() => nav.go("managesub")} style={{ fontSize: 13, color: "var(--gold)" }}>Manage →</TextLink>
        </Card>
      )}

      {/* account rows */}
      <div style={{ font: "600 11px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--faint)", margin: "24px 0 4px" }}>Account</div>
      <Card style={{ padding: "2px 18px" }}>
        <NavRow label="Email" value="claire@example.com" onClick={() => {}} />
        <NavRow label="Password" value="Change" onClick={() => {}} />
        <NavRow label="Reading language" value="French" onClick={() => {}} />
        <NavRow label="Notifications" value="Daily" onClick={() => {}} last />
      </Card>

      <div style={{ marginTop: 22 }}>
        <Button kind="default" onClick={() => nav.reset("auth")}>Sign out</Button>
      </div>

      <div style={{ flex: 1, minHeight: 14 }} />
      <div style={{ textAlign: "center", padding: "16px 0 6px" }}>
        <TextLink onClick={() => nav.go("deleteaccount")} style={{ fontSize: 13, color: "var(--rose)" }}>Delete account</TextLink>
      </div>
    </Pad>
  );
}

/* ——— Manage subscription — upgrade / downgrade / cancel ——— */
function PlanCard({ k, selected, current, onClick }) {
  const p = PLANS[k];
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
      padding: "16px 17px", borderRadius: 14, cursor: "pointer",
      background: selected ? "var(--goldBg)" : "var(--card)",
      border: `1px solid ${selected ? "var(--gold)" : "var(--line)"}`, transition: "all .2s var(--ease)",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `1.5px solid ${selected ? "var(--gold)" : "var(--line2)"}`, display: "grid", placeItems: "center",
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--gold)" }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{p.label}</span>
          {current && <span style={{ font: "600 9px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--soft)", border: "1px solid var(--line2)", borderRadius: 6, padding: "3px 7px" }}>Current</span>}
          {k === "year" && <span style={{ font: "600 9px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", border: "1px solid var(--gold)", borderRadius: 6, padding: "3px 7px" }}>Saves 58%</span>}
          {k === "life" && <span style={{ font: "600 9px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", border: "1px solid var(--gold)", borderRadius: 6, padding: "3px 7px" }}>Pay once</span>}
        </div>
        <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", marginTop: 3 }}>{p.note}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ font: "600 16px var(--sans)", color: "var(--ink)" }}>{p.price}</div>
        <div style={{ font: "400 11px var(--sans)", color: "var(--faint)" }}>{p.period}</div>
      </div>
    </button>
  );
}

function ScreenManageSub({ ctx }) {
  const { nav, sub, setSub } = ctx;
  const RENEW = "9 June 2026";
  const [choice, setChoice] = useStateAcc(sub.pendingPlan || sub.plan);

  // Lifelong members have nothing to manage.
  if (sub.plan === "life") {
    return (
      <Pad>
        <TopBar
          left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
          center={<BarTitle>Subscription</BarTitle>}
          right={<span style={{ width: 30 }} />}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 16 }}>
          <span style={{ color: "var(--gold)", fontSize: 30 }}>{MARK.genius}</span>
          <div className="serif" style={{ fontSize: 26, color: "var(--ink)" }}>You're a lifelong member.</div>
          <div style={{ font: "400 13.5px/1.7 var(--sans)", color: "var(--soft)", maxWidth: 280 }}>
            Belletra is yours for life — every sentence and every language we add, forever. There's nothing to renew, change, or cancel.
          </div>
        </div>
      </Pad>
    );
  }

  const isUpgrade = sub.plan === "month" && choice === "year";
  const isDowngrade = sub.plan === "year" && choice === "month";
  const isLifetime = choice === "life" && sub.plan !== "life";
  const clearsPending = sub.pendingPlan && choice === sub.plan; // re-selecting current cancels a scheduled switch
  const actionable = (isUpgrade || isDowngrade || isLifetime || clearsPending) && sub.status !== "canceled";

  const apply = () => {
    if (isLifetime) setSub(s => ({ ...s, plan: "life", status: "active", pendingPlan: null })); // one-time: now, forever
    else if (isUpgrade) setSub(s => ({ ...s, plan: "year", pendingPlan: null }));      // upgrade: now
    else if (isDowngrade) setSub(s => ({ ...s, pendingPlan: "month" }));            // downgrade: scheduled
    else if (clearsPending) setSub(s => ({ ...s, pendingPlan: null }));             // cancel scheduled switch
    nav.back();
  };
  const cancel = () => { setSub(s => ({ ...s, status: "canceled", pendingPlan: null })); nav.back(); };
  const resume = () => { setSub(s => ({ ...s, status: "active" })); };

  let ctaLabel = "This is your current plan";
  if (isLifetime) ctaLabel = "Become a lifelong member — $29.99 once →";
  else if (isUpgrade) ctaLabel = "Upgrade to yearly — effective today →";
  else if (isDowngrade) ctaLabel = `Switch to monthly on ${RENEW} →`;
  else if (clearsPending) ctaLabel = "Keep yearly — cancel the switch";

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>Subscription</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />
      <div className="serif" style={{ fontSize: 24, color: "var(--ink)", marginBottom: 4 }}>Your plan</div>
      <div style={{ font: "400 12.5px/1.6 var(--sans)", color: "var(--faint)", marginBottom: 18 }}>
        {sub.status === "canceled"
          ? `Canceled — your reading access stays open until ${RENEW}.`
          : "Upgrading takes effect today. Switching to monthly takes effect at your next renewal."}
      </div>

      {sub.pendingPlan && sub.status !== "canceled" && (
        <div style={{ background: "var(--goldBg)", border: "1px solid var(--gold)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ font: "400 12.5px/1.5 var(--sans)", color: "var(--soft)" }}>
            Scheduled: switching to <strong style={{ color: "var(--ink)" }}>Monthly</strong> on {RENEW}.
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <PlanCard k="year"  selected={choice === "year"}  current={sub.plan === "year"  && sub.status !== "canceled"} onClick={() => setChoice("year")} />
        <PlanCard k="month" selected={choice === "month"} current={sub.plan === "month" && sub.status !== "canceled"} onClick={() => setChoice("month")} />
        <PlanCard k="life"  selected={choice === "life"}  current={false} onClick={() => setChoice("life")} />
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />

      {sub.status === "canceled" ? (
        <Button kind="primary" onClick={resume}>Resume subscription</Button>
      ) : (
        <React.Fragment>
          <Button kind="primary" onClick={actionable ? apply : undefined} disabled={!actionable}>
            {ctaLabel}
          </Button>
          <div style={{ textAlign: "center", paddingTop: 16 }}>
            <TextLink onClick={cancel} style={{ fontSize: 13, color: "var(--rose)" }}>Cancel subscription</TextLink>
          </div>
        </React.Fragment>
      )}
    </Pad>
  );
}

/* ——— Delete account ——— */
function ScreenDeleteAccount({ ctx }) {
  const { nav } = ctx;
  const losses = [
    "Your anthology — every line you've kept",
    "Your reading rhythm and progress toward B2",
    "Your saved words and the languages you've voted for",
  ];
  return (
    <Pad>
      <TopBar
        left={<IconBtn label="back" onClick={() => nav.back()}>←</IconBtn>}
        center={<BarTitle>Delete account</BarTitle>}
        right={<span style={{ width: 30 }} />}
      />
      <div className="serif" style={{ fontSize: 24, color: "var(--ink)", marginBottom: 8 }}>This can't be undone.</div>
      <div style={{ font: "400 13.5px/1.7 var(--sans)", color: "var(--soft)", marginBottom: 20 }}>
        Deleting your account permanently removes everything you've gathered in Belletra. We keep no backup.
      </div>

      <Card style={{ background: "var(--roseBg)", border: "1px solid var(--rose)", display: "flex", flexDirection: "column", gap: 12 }}>
        {losses.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            <span style={{ color: "var(--rose)", fontSize: 13, marginTop: 1, flexShrink: 0 }}>×</span>
            <span style={{ font: "400 13.5px/1.5 var(--sans)", color: "var(--ink)" }}>{l}</span>
          </div>
        ))}
      </Card>

      <div style={{ font: "400 12.5px/1.6 var(--sans)", color: "var(--faint)", fontStyle: "italic", margin: "18px 2px 0" }}>
        Prefer to step away quietly? You can cancel your subscription and keep your anthology instead.
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />

      <Button kind="dark" onClick={() => nav.back()}>Keep my account</Button>
      <div style={{ textAlign: "center", paddingTop: 16 }}>
        <TextLink onClick={() => nav.reset("auth")} style={{ fontSize: 13, color: "var(--rose)" }}>Permanently delete account</TextLink>
      </div>
    </Pad>
  );
}

Object.assign(window, {
  ScreenAuth, ScreenAccount, ScreenManageSub, ScreenDeleteAccount,
  TextField, NavRow, PlanCard,
});
