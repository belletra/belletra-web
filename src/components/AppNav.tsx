import { Link, useNavigate } from 'react-router-dom'
import { useDarkMode } from '../hooks/useDarkMode'

interface AppNavProps {
  active?: 'today' | 'library' | 'anthology' | 'review'
  initials?: string
  avatarUrl?: string | null
}

export function AppNav({ active = 'today', initials = 'B', avatarUrl }: AppNavProps) {
  const navigate = useNavigate()
  const [dark, setDark] = useDarkMode()

  const links = [
    { to: '/app', label: 'Today', key: 'today' },
    { to: '/app/library', label: 'Library', key: 'library' },
    { to: '/app/anthology', label: 'Anthology', key: 'anthology' },
    { to: '/app/review', label: 'Review', key: 'review' },
  ]

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--paper)', borderBottom: '1px solid var(--line)', transition: 'background .5s cubic-bezier(.2,.7,.2,1)' }}>
      <style>{`
        .appnav-link { font: 500 14px var(--sans); color: var(--soft); background: none; border: none; cursor: pointer; padding: 6px 2px; transition: color .18s; text-decoration: none; white-space: nowrap; }
        .appnav-link:hover, .appnav-link.active { color: var(--ink); }
        .appnav-toggle:hover { color: var(--ink); border-color: var(--gold) !important; }
        .appnav-desktop { display: flex; }
        .appnav-mobile { display: none; }
        @media (max-width: 540px) {
          .appnav-desktop { display: none !important; }
          .appnav-mobile { display: flex !important; }
        }
      `}</style>

      {/* Top row: logo + dark toggle + avatar */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(12px,4vw,32px)', height: 52, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link to="/app" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--card)', border: '1px solid var(--line2)', display: 'grid', placeItems: 'center', position: 'relative', boxShadow: 'var(--shadow-card)', flexShrink: 0 }}>
            <span className="serif" style={{ fontSize: 18, lineHeight: 1, color: 'var(--ink)' }}>B</span>
            <span style={{ position: 'absolute', right: 4, bottom: 3, fontSize: 8, color: 'var(--gold)', lineHeight: 1 }}>❧</span>
          </span>
          <span className="serif" style={{ fontSize: 19, letterSpacing: '.02em', color: 'var(--ink)' }}>Belletra</span>
        </Link>

        {/* Desktop: nav links inline */}
        <nav className="appnav-desktop" style={{ alignItems: 'center', gap: 22, marginRight: 10 }}>
          {links.map(l => (
            <Link key={l.key} to={l.to} className={`appnav-link${active === l.key ? ' active' : ''}`}>{l.label}</Link>
          ))}
        </nav>

        <button onClick={() => setDark(d => !d)} aria-label="toggle light and dark" className="appnav-toggle"
          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line2)', background: 'var(--card)', color: 'var(--soft)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0 }}>
          {dark ? '☀' : '☾'}
        </button>
        <button onClick={() => navigate('/app/account')} aria-label="account" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line2)', display: 'block' }} />
            : <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--goldBg)', border: '1px solid var(--line2)', display: 'grid', placeItems: 'center', font: '600 12px var(--sans)', color: 'var(--gold)' }}>{initials}</span>
          }
        </button>
      </div>

      {/* Mobile only: nav links on second row */}
      <nav className="appnav-mobile" style={{ borderTop: '1px solid var(--line)', justifyContent: 'space-around', padding: '0 clamp(12px,4vw,32px)' }}>
        {links.map(l => (
          <Link key={l.key} to={l.to} className={`appnav-link${active === l.key ? ' active' : ''}`} style={{ padding: '10px 8px' }}>{l.label}</Link>
        ))}
      </nav>
    </header>
  )
}
