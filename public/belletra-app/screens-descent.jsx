/* Belletra — The Descent: the 8-step study of one line. */
const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;

/* resolve a token to its word entry, case-insensitively (so line-2 « il » finds « Il ») */
function lookupWord(v, tok) {
  if (!tok) return null;
  return v.words[tok] || v.words[tok.toLowerCase()] ||
    v.words[tok.charAt(0).toUpperCase() + tok.slice(1)] || null;
}

/* render the couplet across its two lines, inside guillemets */
function LineDisplay({ v, size = 26, color, style }) {
  return (
    <div className="serif" style={{ fontSize: size, lineHeight: 1.5, color: color || "var(--ink)", fontWeight: 400, textWrap: "balance", ...style }}>
      « {v.lines[0]}<br />{v.lines[1]} »
    </div>
  );
}

/* tappable line — each known token gets a gold dashed underline; selected → blue. Keyboard-activatable. */
function TappableLine({ v, size = 21, selected, onSelect }) {
  const firstCount = v.lines ? v.lines[0].replace(/[.,;:]/g, "").trim().split(/\s+/).length : null;
  return (
    <div className="serif" style={{ fontSize: size, lineHeight: 1.7, color: "var(--ink)", textWrap: "balance" }}>
      {v.tokens.map((tok, i) => {
        const known = !!lookupWord(v, tok);
        const isSel = selected === tok;
        const sep = i < v.tokens.length - 1
          ? (firstCount && i + 1 === firstCount ? <br key={"br" + i} /> : " ")
          : "";
        return (
          <React.Fragment key={i}>
            {known ? (
              <span role="button" tabIndex={0} aria-pressed={isSel}
                onClick={() => onSelect(isSel ? null : tok)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(isSel ? null : tok); } }}
                style={{
                  cursor: "pointer", color: isSel ? "var(--blue)" : "var(--ink)",
                  borderBottom: `1.5px dashed ${isSel ? "var(--blue)" : "var(--gold)"}`,
                  paddingBottom: 1, borderRadius: 2, transition: "color .2s var(--ease)",
                }}>{tok}</span>
            ) : <span>{tok}</span>}
            {sep}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function WordCard({ tok, word }) {
  if (!word) return null;
  return (
    <Card style={{ textAlign: "left", animation: "blReveal .32s var(--ease) both" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div className="serif" style={{ fontSize: 24, color: "var(--blue)" }}>{tok}</div>
        <div className="serif" style={{ fontStyle: "italic", fontSize: 13, color: "var(--faint)" }}>{word.pos}</div>
      </div>
      <Gloss style={{ marginTop: 6, color: "var(--ink)", fontStyle: "normal", fontSize: 15.5 }}>{word.gloss}</Gloss>
      <div style={{ marginTop: 12, font: "400 13.5px/1.7 var(--sans)", color: "var(--soft)" }}>
        <span style={{ color: "var(--gold)" }}>{MARK.root}</span> {word.etymology.surface}
      </div>
      <Disclosure label="the whole root">{word.etymology.deep}</Disclosure>
    </Card>
  );
}

/* render a swap form with its differing word(s) emphasised in gold */
function renderForm(form, highlight) {
  const parts = form.split(" ");
  return parts.map((w, i) => {
    const clean = w.replace(/[.,;:»«]/g, "");
    const hit = highlight && highlight.includes(clean);
    return (
      <React.Fragment key={i}>
        {hit ? <strong style={{ color: "var(--gold)", fontWeight: 600 }}>{w}</strong> : w}
        {i < parts.length - 1 ? " " : ""}
      </React.Fragment>
    );
  });
}

/* swap option */
function SwapOption({ opt, selected, revealed, onClick }) {
  const isRight = opt.is_original;
  let border = "var(--line2)", bg = "var(--card)";
  if (revealed && isRight) { border = "var(--green)"; bg = "var(--greenBg)"; }
  else if (selected) { border = "var(--gold)"; bg = "var(--goldBg)"; }
  return (
    <button onClick={onClick} aria-pressed={selected} style={{
      width: "100%", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 14, padding: "14px 16px", borderRadius: 13, cursor: "pointer",
      background: bg, border: `1px solid ${border}`, transition: "all .2s var(--ease)",
    }}>
      <span className="serif" style={{ fontSize: 17.5, color: "var(--ink)", flex: 1, minWidth: 0 }}>{renderForm(opt.form, opt.highlight)}</span>
      <span style={{ font: "600 9px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", color: isRight && revealed ? "var(--green)" : "var(--faint)", whiteSpace: "nowrap", flexShrink: 0 }}>{opt.tag}</span>
    </button>
  );
}

/* —— rebuild interaction —— */
function Rebuild({ tokens, onDone }) {
  const [placed, setPlaced] = useStateD([]);
  const [pool, setPool] = useStateD(() => {
    const arr = tokens.map((t, i) => ({ t, id: i }));
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  });
  const [wrong, setWrong] = useStateD(null);
  const done = placed.length === tokens.length;

  useEffectD(() => { if (done) onDone && onDone(); }, [done]);

  const tap = (item) => {
    if (item.t === tokens[placed.length]) {
      setPlaced(p => [...p, item.t]);
      setPool(pl => pl.filter(x => x.id !== item.id));
    } else {
      setWrong(item.id);
      setTimeout(() => setWrong(null), 340);
    }
  };

  return (
    <div>
      {/* slots */}
      <div style={{
        minHeight: 64, border: `1.5px dashed ${done ? "var(--green)" : "var(--line2)"}`, borderRadius: 13,
        padding: "14px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 8px",
        transition: "border-color .3s var(--ease)",
      }}>
        {placed.map((w, i) => (
          <span key={i} className="serif" style={{ fontSize: 21, color: "var(--green)", animation: "blPop .2s var(--ease) both" }}>{w}</span>
        ))}
        {!done && (
          <span style={{ width: 2, height: 24, background: "var(--gold)", display: "inline-block", animation: "blCaret 1s step-end infinite", marginLeft: 2 }} />
        )}
      </div>

      {/* pool */}
      {!done ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 18, justifyContent: "center" }}>
          {pool.map(item => (
            <button key={item.id} onClick={() => tap(item)} style={{
              font: "400 19px var(--serif)", fontFamily: "var(--serif)",
              background: "var(--card)", border: "1px solid var(--line2)", borderRadius: 11,
              padding: "9px 16px", cursor: "pointer", transition: "all .15s var(--ease)",
              animation: wrong === item.id ? "blShake .32s var(--ease)" : "none",
              borderColor: wrong === item.id ? "var(--rose)" : "var(--line2)",
              color: wrong === item.id ? "var(--rose)" : "var(--ink)",
            }}>{item.t}</button>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: 18, font: "500 14px var(--sans)", color: "var(--green)", animation: "blReveal .4s var(--ease) both" }}>
          ✓ it's yours now
        </div>
      )}
    </div>
  );
}

function ScreenDescent({ ctx }) {
  const { nav, data, keepLine } = ctx;
  const v = data.VERLAINE;
  const audio = useLineAudio();
  const [step, setStep] = useStateD(1);
  const [selWord, setSelWord] = useStateD(null);
  const [guess, setGuess] = useStateD(null);
  const [swapSel, setSwapSel] = useStateD(null);
  const [rebuilt, setRebuilt] = useStateD(false);
  const [kept, setKept] = useStateD(false);

  const next = () => { audio.stop(); setStep(s => s + 1); };
  const guessTiles = ["pleure", "cœur", "Il"];
  const L1 = v.lines[0].replace(/[,.;:]$/, ""); // the opening line, for the analytic steps

  const labels = { 1: "the line", 2: "what it means", 3: "a guess", 4: "the word", 5: "the grammar", 6: "only in French", 7: "deeper", 8: "make it yours" };

  return (
    <Pad>
      <TopBar
        left={<IconBtn label="close" onClick={() => { audio.stop(); nav.reset('cover'); }}>✕</IconBtn>}
        center={<ProgressThread total={8} current={step - 1} />}
        right={<span style={{ width: 30 }} />}
      />
      <div key={step} className="bl-screen" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Eyebrow style={{ marginBottom: 18 }}>{labels[step]}</Eyebrow>

        {/* STEP 1 — the line */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", textAlign: "center", gap: 22 }}>
            <LineDisplay v={v} size={27} style={{ padding: "0 4px" }} />
            <div style={{ font: "400 13px var(--sans)", color: "var(--faint)" }}>{v.author} · {v.work} · {v.year}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 8 }}>
              <button onClick={() => audio.play(v.audio, v.text)} aria-label="hear the line" style={{
                font: "500 14px var(--sans)", color: audio.playing ? "var(--gold)" : "var(--soft)", background: "transparent",
                border: `1px solid ${audio.playing ? "var(--gold)" : "var(--line2)"}`, borderRadius: 24, padding: "10px 22px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 9, transition: "all .2s var(--ease)",
              }}>{audio.playing ? "♪ listening…" : "▶ hear it first"}</button>
              <Waveform playing={audio.playing} levels={audio.levels} />
              {!v.audio && (
                <div style={{ font: "400 10.5px var(--sans)", color: "var(--faint)", fontStyle: "italic", maxWidth: 220 }}>
                  read aloud by your device's voice — a recorded reading takes its place when one is added
                </div>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <ContinuePill onClick={next}>read it slowly ↓</ContinuePill>
          </div>
        )}

        {/* STEP 2 — what it means */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
            <TappableLine v={v} size={22} selected={selWord} onSelect={setSelWord} />
            <Gloss>{v.translation}</Gloss>
            {selWord ? (
              <WordCard tok={selWord} word={lookupWord(v, selWord)} />
            ) : (
              <div style={{ font: "400 12.5px var(--sans)", color: "var(--faint)", fontStyle: "italic" }}>
                tap any underlined word to open it ↑
              </div>
            )}
            <div style={{ background: "var(--goldBg)", borderRadius: 13, padding: "14px 16px" }}>
              <div style={{ font: "600 10px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>Useful vs beautiful</div>
              <div style={{ font: "400 13px/1.65 var(--sans)", color: "var(--soft)" }}>{v.plain_register}</div>
            </div>
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: "flex", justifyContent: "center" }}><ContinuePill onClick={next}>continue ↓</ContinuePill></div>
          </div>
        )}

        {/* STEP 3 — a guess */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
            <SerifLine size={22}>« {L1} »</SerifLine>
            <div style={{ font: "400 14.5px/1.7 var(--sans)", color: "var(--ink)" }}>
              Before any explanation — <strong style={{ fontWeight: 600 }}>which word is carrying this line?</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {guessTiles.map(t => (
                <button key={t} onClick={() => { setGuess(t); next(); }} style={{
                  font: "400 19px var(--serif)", fontFamily: "var(--serif)", color: "var(--ink)",
                  background: "var(--card)", border: "1px solid var(--line2)", borderRadius: 13,
                  padding: "15px 18px", cursor: "pointer", transition: "all .2s var(--ease)", textAlign: "center",
                }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line2)"}>{t}</button>
              ))}
            </div>
            <div style={{ font: "400 12px var(--sans)", color: "var(--faint)", fontStyle: "italic", marginTop: 4 }}>
              There's no wrong answer — the guess primes your memory.
            </div>
          </div>
        )}

        {/* STEP 4 — the word (swap) */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
            <SerifLine size={22}>« {L1} »</SerifLine>
            <div style={{ font: "500 14px var(--sans)", color: guess === v.hinge_token ? "var(--green)" : "var(--soft)" }}>
              {guess === v.hinge_token
                ? <>✓ Yes — <strong className="serif" style={{ fontStyle: "italic" }}>pleure</strong> is the hinge.</>
                : <>You felt for <strong className="serif" style={{ fontStyle: "italic" }}>{guess}</strong>; the weight is on <strong className="serif" style={{ fontStyle: "italic" }}>pleure</strong>.</>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {v.lenses.swap.alternatives.map((opt, i) => (
                <SwapOption key={i} opt={opt} selected={swapSel === i} revealed={swapSel !== null} onClick={() => setSwapSel(i)} />
              ))}
            </div>
            {swapSel !== null && (() => {
              const opt = v.lenses.swap.alternatives[swapSel];
              return (
                <div style={{
                  borderLeft: `3px solid ${opt.is_original ? "var(--gold)" : "var(--rose)"}`,
                  background: opt.is_original ? "var(--goldBg)" : "var(--roseBg)",
                  padding: "13px 16px", borderRadius: "0 10px 10px 0", animation: "blReveal .34s var(--ease) both",
                  font: "400 13px/1.7 var(--sans)", color: "var(--soft)",
                }}>{opt.verdict}</div>
              );
            })()}
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {swapSel === null && <div style={{ font: "400 11.5px var(--sans)", color: "var(--faint)", fontStyle: "italic" }}>choose one to see what it costs</div>}
              <ContinuePill onClick={next} disabled={swapSel === null}>see the grammar that allows it ↓</ContinuePill>
            </div>
          </div>
        )}

        {/* STEP 5 — the grammar */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
            <SerifLine size={20} style={{ color: "var(--soft)" }}>« {L1} »</SerifLine>
            <LensCard
              tag={<>ⓐ Grammar — {v.lenses.grammar.name}</>}
              surface={v.lenses.grammar.explain.surface}
              deep={v.lenses.grammar.explain.deep}
              rule={v.lenses.grammar.rule} ruleKind="blue"
            />
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: "flex", justifyContent: "center" }}><ContinuePill onClick={next}>…and why only French can ↓</ContinuePill></div>
          </div>
        )}

        {/* STEP 6 — only in French */}
        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
            <SerifLine size={20} style={{ color: "var(--soft)" }}>« {L1} »</SerifLine>
            <LensCard
              tag={<>{MARK.genius} Only in French — {v.lenses.genius.name}</>}
              surface={v.lenses.genius.claim.surface}
              deep={v.lenses.genius.claim.deep}
              contrast={v.lenses.genius.contrast}
            />
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: "flex", justifyContent: "center" }}><ContinuePill onClick={next}>three more ways in ↓</ContinuePill></div>
          </div>
        )}

        {/* STEP 7 — deeper */}
        {step === 7 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
            <div style={{ font: "400 13px var(--sans)", color: "var(--faint)", fontStyle: "italic", marginBottom: 4 }}>
              three more ways in — each opens to its depth
            </div>
            <MiniAccordion icon={MARK.music} label="the music" surface={v.lenses.ear.note.surface} deep={v.lenses.ear.note.deep} defaultOpen />
            <MiniAccordion icon={MARK.turn} label="the turn" surface={v.lenses.turn.note.surface} deep={v.lenses.turn.note.deep} />
            <MiniAccordion icon={MARK.silence} label="the silence" surface={v.lenses.silence.note.surface} deep={v.lenses.silence.note.deep} />
            <div style={{ flex: 1, minHeight: 8 }} />
            <div style={{ display: "flex", justifyContent: "center" }}><ContinuePill onClick={next}>make it yours ↓</ContinuePill></div>
          </div>
        )}

        {/* STEP 8 — make it yours */}
        {step === 8 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
            <div style={{ textAlign: "center" }}>
              <LineDisplay v={v} size={22} style={{ textAlign: "center" }} />
              <div className="serif" style={{ fontStyle: "italic", fontSize: 13.5, color: "var(--faint)", marginTop: 12 }}>
                — read it once in silence, then rebuild it —
              </div>
            </div>
            <Rebuild tokens={v.tokens} onDone={() => setRebuilt(true)} />
            {rebuilt && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center", animation: "blReveal .4s var(--ease) both", marginTop: 4 }}>
                {!kept ? (
                  <Button kind="default" style={{ maxWidth: 240, borderColor: "var(--gold)", color: "var(--gold)" }}
                    onClick={() => { setKept(true); keepLine(v.id); }}>♡ keep this line</Button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 30, color: "var(--gold)", animation: "blGild 1.4s var(--ease) both" }}>{MARK.anthology}</div>
                    <div style={{ font: "400 12.5px var(--sans)", color: "var(--soft)", fontStyle: "italic" }}>kept in your anthology</div>
                    <Button kind="primary" style={{ maxWidth: 240, marginTop: 6 }} onClick={() => nav.go("review")}>bring back a few words →</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Pad>
  );
}

Object.assign(window, { ScreenDescent });
