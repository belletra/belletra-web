import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      {/* nav */}
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
        <div style={{ font: '600 12px var(--sans)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Legal</div>
        <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(32px,4vw,46px)', margin: '0 0 14px', letterSpacing: '-.01em' }}>Terms of Service</h1>
        <p style={{ font: '400 14px var(--sans)', color: 'var(--faint)', marginBottom: 48 }}>Last updated: June 2026</p>

        <div style={{ font: '400 16px/1.8 var(--sans)', color: 'var(--soft)', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>The service</h2>
            <p style={{ margin: 0 }}>Belletra provides a language-learning application focused on close reading of literary sentences. Access is provided via web app, iOS app, and Android app. A 7-day free trial is offered upon registration; no payment card is required to begin the trial.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Your account</h2>
            <p style={{ margin: 0 }}>You are responsible for maintaining the security of your account credentials. You must be at least 13 years old to use Belletra. You may not create an account on behalf of another person without their consent.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Subscriptions and billing</h2>
            <p style={{ margin: 0 }}>After your free trial, continued access requires a paid subscription (Monthly at $1.99/month, Yearly at $9.99/year, or a one-time Lifetime access at $29.99). Subscriptions renew automatically unless cancelled before the renewal date. You may cancel at any time; access continues until the end of the paid period. We do not offer refunds for unused periods of a current subscription cycle, except where required by law.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Content</h2>
            <p style={{ margin: 0 }}>All literary texts used in Belletra are in the public domain. Annotations, etymologies, and study materials are original works authored by Belletra and protected by copyright. You may not reproduce, redistribute, or create derivative works from Belletra's proprietary content without written permission.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Acceptable use</h2>
            <p style={{ margin: 0 }}>You may not use Belletra to scrape or harvest content, attempt to access systems beyond your authorisation, or interfere with the service. One account per person; account sharing is not permitted under individual plans.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Disclaimer</h2>
            <p style={{ margin: 0 }}>Belletra is provided "as is." We make no warranties about uninterrupted availability, and we are not liable for any indirect or consequential damages arising from use of the service. Our total liability is limited to the amount you paid in the 12 months preceding any claim.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Changes to the service</h2>
            <p style={{ margin: 0 }}>We reserve the right to modify or discontinue features of the service with reasonable notice. Material changes to pricing will be communicated at least 30 days in advance.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Governing law</h2>
            <p style={{ margin: 0 }}>These terms are governed by the laws of the jurisdiction in which Belletra is registered. Any disputes shall be resolved through binding arbitration, except where prohibited by local law.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Contact</h2>
            <p style={{ margin: 0 }}>Questions about these terms? Write to <a href="mailto:hello@belletra.app" style={{ color: 'var(--gold)' }}>hello@belletra.app</a>.</p>
          </section>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <span className="serif" style={{ fontSize: 16, marginRight: 'auto', color: 'var(--faint)' }}>Belletra</span>
          <div style={{ display: 'flex', gap: 22, font: '400 13px var(--sans)', color: 'var(--faint)' }}>
            <Link to="/privacy" style={{ textDecoration: 'none', color: 'var(--faint)' }}>Privacy</Link>
            <Link to="/terms" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
