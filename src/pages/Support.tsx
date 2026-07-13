import { Link } from 'react-router-dom'

export default function Support() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', gap: 11 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', marginRight: 'auto' }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--card)', border: '1px solid var(--line2)', display: 'grid', placeItems: 'center', position: 'relative', boxShadow: 'var(--shadow-card)' }}>
              <span className="serif" style={{ fontSize: 21, color: 'var(--ink)', lineHeight: 1 }}>B</span>
              <span className="sym" style={{ position: 'absolute', right: 5, bottom: 5, fontSize: 6, color: 'var(--gold)', lineHeight: 1 }}>✧</span>
            </span>
            <span className="serif" style={{ fontSize: 21, letterSpacing: '.02em', color: 'var(--ink)' }}>Belletra</span>
          </Link>
          <Link to="/" style={{ font: '500 14px var(--sans)', color: 'var(--soft)', textDecoration: 'none' }}>← Back</Link>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 32px 96px' }}>
        <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Help</div>
        <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(32px,4vw,46px)', margin: '0 0 14px', letterSpacing: '-.01em' }}>Support</h1>
        <p style={{ font: '400 16px/1.7 var(--sans)', color: 'var(--soft)', marginBottom: 56 }}>
          We're here to help. Reach us by email and we'll respond within one business day.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '32px 36px' }}>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 10px' }}>Contact us</h2>
            <p style={{ font: '400 15px/1.7 var(--sans)', color: 'var(--soft)', margin: '0 0 18px' }}>
              For account issues, billing questions, or anything else — email us directly.
            </p>
            <a href="mailto:support@belletra.app" style={{ font: '600 15px var(--sans)', color: 'var(--gold)', textDecoration: 'none' }}>
              support@belletra.app
            </a>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 20px' }}>Common questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                {
                  q: 'How do I cancel my subscription?',
                  a: 'On iOS, go to Settings → Apple ID → Subscriptions, find Belletra, and tap Cancel. On the web, contact us at support@belletra.app and we will cancel immediately.',
                },
                {
                  q: 'I didn\'t receive my confirmation email.',
                  a: 'Check your spam or junk folder. If it\'s not there, try requesting a new one from the sign-in page, or contact us and we\'ll confirm your account manually.',
                },
                {
                  q: 'How do I reset my password?',
                  a: 'Go to belletra.app/login and click "Forgot password." Enter your email and we\'ll send a reset link.',
                },
                {
                  q: 'Can I use Belletra on multiple devices?',
                  a: 'Yes. Your account, progress, and library sync automatically across all your devices.',
                },
                {
                  q: 'What languages does Belletra support?',
                  a: 'French is available now. Italian, Spanish, and German are coming soon.',
                },
                {
                  q: 'How do I request a refund?',
                  a: 'For App Store purchases, request a refund directly through Apple at reportaproblem.apple.com. For web purchases, email support@belletra.app within 14 days.',
                },
              ].map(({ q, a }) => (
                <div key={q} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
                  <p style={{ font: '600 15px var(--sans)', color: 'var(--ink)', margin: '0 0 8px' }}>{q}</p>
                  <p style={{ font: '400 14.5px/1.7 var(--sans)', color: 'var(--soft)', margin: 0 }}>{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ paddingTop: 8 }}>
            <p style={{ font: '400 14px var(--sans)', color: 'var(--faint)', margin: 0 }}>
              Also see our <Link to="/privacy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Privacy Policy</Link> and <Link to="/terms" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Terms of Use</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
