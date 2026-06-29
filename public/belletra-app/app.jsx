/* Belletra — app shell: device frame, status bar, router, control rail. */
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA, useCallback: useCallbackA } = React;

const SCREEN_W = 393, SCREEN_H = 852, STATUS_H = 46;

/* ——— Status bar ——— */
function StatusBar() {
  return (
    <div style={{
      height: STATUS_H, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 30px", flexShrink: 0, position: "relative",
    }}>
      <div style={{ font: "600 14px var(--sans)", color: "var(--ink)", letterSpacing: ".02em" }}>9:41</div>
      <div style={{ color: "var(--gold)", fontSize: 15 }}>{MARK.fleuron}</div>
    </div>
  );
}

/* ——— Control rail (chrome, sits outside the scaled phone) ——— */
const SCREEN_MENU = [
  ["onboarding", "Onboarding"],
  ["auth", "Auth · Sign in"],
  ["cover", "Cover · Today"],
  ["descent", "The Descent"],
  ["review", "Spaced review"],
  ["complete", "Session complete"],
  ["library", "Library"],
  ["detail", "Sentence detail"],
  ["dbrecord", "DB record"],
  ["anthology", "Anthology"],
  ["you", "You · Progress"],
  ["account", "Account"],
  ["managesub", "Manage subscription"],
  ["deleteaccount", "Delete account"],
  ["paywall", "Paywall"],
  ["curator", "Curator authoring"],
];

function ControlRail({ mode, toggleMode, onJump, current }) {
  return (
    <div style={{
      position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 8, zIndex: 50,
      background: "var(--card)", border: "1px solid var(--line2)", borderRadius: 30,
      padding: "7px 9px", boxShadow: "var(--shadow-card)",
    }}>
      <select value={current} onChange={e => onJump(e.target.value)} style={{
        font: "500 12px var(--sans)", color: "var(--soft)", background: "transparent",
        border: "none", borderRadius: 20, padding: "6px 8px", cursor: "pointer", outline: "none",
        appearance: "none", textAlignLast: "center",
      }}>
        {SCREEN_MENU.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <div style={{ width: 1, height: 18, background: "var(--line2)" }} />
      <button onClick={toggleMode} aria-label="toggle theme" style={{
        font: "400 15px var(--sans)", width: 30, height: 30, borderRadius: 18, cursor: "pointer",
        border: "none", background: "var(--goldBg)", color: "var(--gold)", display: "grid", placeItems: "center",
      }}>{mode === "dark" ? "☾" : "☀"}</button>
    </div>
  );
}

/* dev chrome (screen jumper + theme toggle) only when explicitly enabled */
const BL_DEV = (typeof window !== "undefined") && (
  window.BELLETRA_DEV === true ||
  new URLSearchParams(location.search).has("dev")
);

/* chromeless full-bleed mode — for embedding a screen in the web app (no bezel) */
const BL_BARE = (typeof window !== "undefined") &&
  new URLSearchParams(location.search).get("bare") === "1";

/* initial theme: stored override first, else the OS preference, else light */
function initialMode() {
  const p = new URLSearchParams(location.search).get("mode");
  if (p === "light" || p === "dark") return p;
  const stored = (typeof localStorage !== "undefined") && localStorage.getItem("bl-mode");
  if (stored === "light" || stored === "dark") return stored;
  if (typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

/* ——— App ——— */
function App() {
  const data = window.BELLETRA_DATA;
  const [mode, setMode] = useStateA(initialMode);
  const [stack, setStack] = useStateA(() => {
    const s = new URLSearchParams(location.search).get("screen");
    return s ? [{ name: s, params: {} }] : [{ name: "auth", params: {} }];
  });
  const [kept, setKept] = useStateA(() => {
    try { return JSON.parse(localStorage.getItem("bl-kept")) || []; } catch { return []; }
  });
  const [scale, setScale] = useStateA(1);
  const [sub, setSub] = useStateA(() => {
    try { return JSON.parse(localStorage.getItem("bl-sub")) || { plan: "year", status: "trial" }; }
    catch { return { plan: "year", status: "trial" }; }
  });

  useEffectA(() => {
    document.documentElement.setAttribute("data-mode", mode);
    localStorage.setItem("bl-mode", mode);
  }, [mode]);
  useEffectA(() => {
    // when embedded via ?screen=, drop the surround so the host page shows through
    if (new URLSearchParams(location.search).get("screen")) {
      document.body.style.background = "transparent";
    }
  }, []);
  useEffectA(() => { localStorage.setItem("bl-kept", JSON.stringify(kept)); }, [kept]);
  useEffectA(() => { localStorage.setItem("bl-sub", JSON.stringify(sub)); }, [sub]);

  useEffectA(() => {
    const fit = () => {
      const sc = Math.min((window.innerHeight - 120) / SCREEN_H, (window.innerWidth - 32) / SCREEN_W, 1.0);
      setScale(Math.max(0.4, sc));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const top = stack[stack.length - 1];
  const go = useCallbackA((name, params = {}) => setStack(s => [...s, { name, params }]), []);
  const back = useCallbackA(() => setStack(s => s.length > 1 ? s.slice(0, -1) : s), []);
  const reset = useCallbackA((name, params = {}) => setStack([{ name, params }]), []);
  const jump = useCallbackA((name) => setStack([{ name, params: {} }]), []);

  const keepLine = useCallbackA((id) => setKept(k => k.includes(id) ? k : [...k, id]), []);
  const nav = { go, back, reset, top };
  const ctx = { nav, mode, setMode, kept, keepLine, data, sub, setSub };

  const SCREENS = {
    onboarding: window.ScreenOnboarding,
    auth: window.ScreenAuth,
    account: window.ScreenAccount,
    managesub: window.ScreenManageSub,
    deleteaccount: window.ScreenDeleteAccount,
    cover: window.ScreenCover,
    descent: window.ScreenDescent,
    review: window.ScreenReview,
    complete: window.ScreenComplete,
    library: window.ScreenLibrary,
    detail: window.ScreenDetail,
    dbrecord: window.ScreenDBRecord,
    anthology: window.ScreenAnthology,
    you: window.ScreenYou,
    paywall: window.ScreenPaywall,
    curator: window.ScreenCurator,
  };
  const Screen = SCREENS[top.name] || (() => <div style={{ padding: 40 }}>missing: {top.name}</div>);

  /* chromeless: render the screen full-bleed in a centered reading column (for web embedding) */
  if (BL_BARE) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", justifyContent: "center", transition: "background .5s var(--ease)" }}>
        <div className="bl-scroll" style={{ width: "100%", maxWidth: 460, minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--paper)" }}>
          <div className="bl-screen" key={top.name + JSON.stringify(top.params)} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", flex: 1 }}>
            <Screen ctx={ctx} params={top.params} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: (SCREEN_W + 24) * scale, height: (SCREEN_H + 24) * scale, transition: "width .2s var(--ease), height .2s var(--ease)" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {/* bezel */}
        <div style={{
          width: SCREEN_W + 24, height: SCREEN_H + 24, borderRadius: 46, padding: 12,
          background: "linear-gradient(160deg, var(--bezel-edge), var(--bezel))",
          boxShadow: "var(--shadow-device)",
        }}>
          <div style={{
            width: SCREEN_W, height: SCREEN_H, borderRadius: 38, overflow: "hidden",
            background: "var(--paper)", position: "relative", display: "flex", flexDirection: "column",
            transition: "background .5s var(--ease)",
          }}>
            <StatusBar />
            <div className="bl-scroll" style={{
              height: SCREEN_H - STATUS_H, overflowY: "auto", overflowX: "hidden", position: "relative",
            }}>
              <div className="bl-screen" key={top.name + JSON.stringify(top.params)} style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
                <Screen ctx={ctx} params={top.params} />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      {BL_DEV && <ControlRail mode={mode} toggleMode={() => setMode(m => m === "dark" ? "light" : "dark")} onJump={jump} current={top.name} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
