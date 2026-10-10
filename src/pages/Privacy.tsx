import { Link } from 'react-router-dom'

export default function Privacy() {
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
        <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(32px,4vw,46px)', margin: '0 0 14px', letterSpacing: '-.01em' }}>Privacy Policy</h1>
        <p style={{ font: '400 14px var(--sans)', color: 'var(--faint)', marginBottom: 48 }}>Last updated: October 2026</p>

        <div style={{ font: '400 16px/1.8 var(--sans)', color: 'var(--soft)', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>What we collect</h2>
            <p style={{ margin: 0 }}>We collect your email address and a hashed password when you create an account. If you sign in with Google, we receive your email and name from Google. We store the sentences you have studied, the words you have kept, and your review progress so the app works across devices.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>What we do not collect</h2>
            <p style={{ margin: 0 }}>We do not collect your contacts or serve advertising. We do not sell your personal data. We use Google Analytics on the website to understand pages viewed, general device and browser information, approximate region, and anonymised actions such as account creation or starting checkout. When you arrive through a tagged campaign link, we retain the source, medium, campaign name, landing path, and capture time in first-party browser storage and, for a newly created account, in that account's metadata. This lets us connect a later subscription to the campaign that introduced Belletra without placing your email address, payment details, sentence text, or anthology content in the attribution record or sending those fields to Google Analytics.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>How we use your data</h2>
            <p style={{ margin: 0 }}>Your data is used to authenticate you, personalise your study queue (spaced review), and save your anthology across devices. We use aggregated website and conversion measurements to improve the product and understand which educational guides help readers discover it. We will never contact you for marketing purposes without your explicit opt-in.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Data storage</h2>
            <p style={{ margin: 0 }}>Your data is stored on Supabase (PostgreSQL) hosted in the EU. Supabase encrypts data at rest and in transit. We retain your data for as long as your account is active. You may request deletion at any time by writing to us.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Payments</h2>
            <p style={{ margin: 0 }}>Subscriptions are processed by Apple (App Store) or Google (Play Store) on mobile, and by Stripe on the web. We never see or store your payment card details. Stripe's privacy policy governs the handling of payment information.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Cookies</h2>
            <p style={{ margin: 0 }}>We use session storage needed to keep you signed in. Google Analytics may use first-party cookies or similar identifiers to distinguish visits and measure site usage. These measurements are not used by Belletra to serve advertising, and we do not combine them with your email address or reading content.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Your rights</h2>
            <p style={{ margin: 0 }}>You may access, correct, or delete your personal data at any time. To exercise these rights, email us at <a href="mailto:hello@belletra.app" style={{ color: 'var(--gold)' }}>hello@belletra.app</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Changes to this policy</h2>
            <p style={{ margin: 0 }}>We may update this policy as the app grows. Material changes will be announced inside the app. Continued use after a change constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>Contact</h2>
            <p style={{ margin: 0 }}>For any privacy questions, write to <a href="mailto:hello@belletra.app" style={{ color: 'var(--gold)' }}>hello@belletra.app</a>.</p>
          </section>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <span className="serif" style={{ fontSize: 16, marginRight: 'auto', color: 'var(--faint)' }}>Belletra</span>
          <div style={{ display: 'flex', gap: 22, font: '400 13px var(--sans)', color: 'var(--faint)' }}>
            <Link to="/privacy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms" style={{ textDecoration: 'none', color: 'var(--faint)' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
