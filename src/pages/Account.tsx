import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getSubscriptionStatus } from '../lib/db'
import { AppNav } from '../components/AppNav'
import { useDarkMode } from '../hooks/useDarkMode'

export default function Account() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subPlan, setSubPlan] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [dark, setDark] = useDarkMode()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setEmail(data.user.email ?? '')
      setUserId(data.user.id)
      setAvatarUrl(data.user.user_metadata?.avatar_url ?? null)
    })
    getSubscriptionStatus().then(({ isSubscribed, plan }) => {
      setIsSubscribed(isSubscribed)
      setSubPlan(plan)
    })
  }, [])

  async function handleUpgrade() {
    if (!userId || checkoutLoading) return
    setCheckoutLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: 'year', userId, email },
      })
      if (error || !data?.url) throw error ?? new Error('No checkout URL')
      window.location.href = data.url
    } catch {
      setCheckoutLoading(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = urlData.publicUrl + `?t=${Date.now()}`

      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
      setAvatarUrl(publicUrl)
    } catch (err) {
      console.error('Avatar upload failed', err)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initials = email ? email[0].toUpperCase() : 'B'

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh', transition: 'background .5s cubic-bezier(.2,.7,.2,1), color .5s cubic-bezier(.2,.7,.2,1)' }}>
      <style>{`
        @keyframes blFade { from { opacity:0; } to { opacity:1; } }
        .acct-btn:hover { border-color: var(--gold) !important; }
        .acct-del:hover { border-color: var(--rose) !important; }
        .avatar-wrap:hover .avatar-overlay { opacity: 1 !important; }
      `}</style>
      <AppNav initials={initials} avatarUrl={avatarUrl} />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,4vw,32px) 90px', animation: 'blFade .35s cubic-bezier(.2,.7,.2,1) both' }}>
        <button onClick={() => navigate('/app')} style={{ font: '500 13.5px var(--sans)', color: 'var(--soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, padding: 0 }}>← Today</button>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}>
          <div
            className="avatar-wrap"
            onClick={() => fileRef.current?.click()}
            style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', cursor: 'pointer', flexShrink: 0 }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line2)', display: 'block' }} />
            ) : (
              <span style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--goldBg)', border: '1px solid var(--line2)', display: 'grid', placeItems: 'center', font: '600 20px var(--sans)', color: 'var(--gold)' }}>{initials}</span>
            )}
            <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: uploading ? 1 : 0, transition: 'opacity .18s' }}>
              <span style={{ font: '500 10px var(--sans)', color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>{uploading ? '…' : '✎'}</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          <div>
            <div className="serif" style={{ fontSize: 24, color: 'var(--ink)' }}>{email.split('@')[0] || 'Reader'}</div>
            <div style={{ font: '400 13.5px var(--sans)', color: 'var(--faint)', marginTop: 2 }}>{email}</div>
          </div>
        </div>

        {/* Subscription */}
        <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 12 }}>Subscription</div>
        <div style={{ background: 'var(--goldBg)', border: '1px solid var(--gold)', borderRadius: 18, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 30 }}>
          <div>
            {isSubscribed ? (
              <>
                <div className="serif" style={{ fontSize: 19, color: 'var(--ink)' }}>Belletra · {subPlan === 'year' ? 'Yearly' : 'Monthly'}</div>
                <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginTop: 3 }}>Active subscription</div>
              </>
            ) : (
              <>
                <div className="serif" style={{ fontSize: 19, color: 'var(--ink)' }}>Belletra · Free</div>
                <div style={{ font: '400 13px var(--sans)', color: 'var(--soft)', marginTop: 3 }}>Today's sentence only</div>
              </>
            )}
          </div>
          {!isSubscribed && (
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading || !userId}
              style={{ font: '600 13.5px var(--sans)', color: 'var(--card)', background: checkoutLoading ? 'var(--soft)' : 'var(--gold)', border: 'none', borderRadius: 999, padding: '11px 22px', cursor: checkoutLoading ? 'default' : 'pointer', transition: 'background .2s' }}
            >
              {checkoutLoading ? '…' : 'Upgrade'}
            </button>
          )}
        </div>

        {/* Settings */}
        <div style={{ font: '600 11px var(--sans)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 12 }}>Settings</div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, boxShadow: 'var(--shadow-card)', padding: '6px 24px', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
            <span style={{ font: '400 14.5px var(--sans)', color: 'var(--ink)' }}>Email</span>
            <span style={{ font: '400 13.5px var(--sans)', color: 'var(--faint)' }}>{email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
            <span style={{ font: '400 14.5px var(--sans)', color: 'var(--ink)' }}>Reading language</span>
            <span style={{ font: '400 13.5px var(--sans)', color: 'var(--faint)' }}>French</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
            <span style={{ font: '400 14.5px var(--sans)', color: 'var(--ink)' }}>Daily reminder</span>
            <span style={{ font: '400 13.5px var(--sans)', color: 'var(--faint)' }}>9:00, every morning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
            <span style={{ font: '400 14.5px var(--sans)', color: 'var(--ink)' }}>Appearance</span>
            <button onClick={() => setDark(d => !d)} style={{ font: '500 13px var(--sans)', color: 'var(--gold)', background: 'var(--goldBg)', border: '1px solid var(--line2)', borderRadius: 999, padding: '7px 16px', cursor: 'pointer' }}>
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button onClick={handleSignOut} className="acct-btn" style={{ font: '500 14px var(--sans)', color: 'var(--ink)', background: 'transparent', border: '1px solid var(--line2)', borderRadius: 999, padding: '12px 24px', cursor: 'pointer', transition: 'border-color .18s' }}>Sign out</button>
          <button className="acct-del" style={{ font: '500 14px var(--sans)', color: 'var(--rose)', background: 'transparent', border: '1px solid var(--line2)', borderRadius: 999, padding: '12px 24px', cursor: 'pointer', transition: 'border-color .18s' }}>Delete account</button>
        </div>
      </main>
    </div>
  )
}
