import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const HOOK_SECRET = Deno.env.get('SEND_EMAIL_HOOK_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? 'https://lnxwunwkuikqwpqvwckf.supabase.co'
const FROM = 'Belletra <noreply@belletra.app>'
const APP_URL = 'https://belletra.app'

async function verifyHookSignature(req: Request, body: string): Promise<boolean> {
  if (!HOOK_SECRET) return true // no secret set, allow all
  const signature = req.headers.get('x-supabase-signature') ?? req.headers.get('webhook-signature')
  if (!signature) return true // no signature header, allow (direct call)
  try {
    const secret = HOOK_SECRET.replace('v1,whsec_', '')
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(atob(secret)),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const sig = Uint8Array.from(atob(signature.replace('v1=', '')), c => c.charCodeAt(0))
    return await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(body))
  } catch {
    return true // verification error — allow through
  }
}

// ── Shared layout ────────────────────────────────────────────────────────────

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Belletra</title>
</head>
<body style="margin:0;padding:0;background:#F3EEE3;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3EEE3;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1D1A15;border-radius:8px 8px 0 0;padding:36px 48px;text-align:center;">
              <div style="font-size:32px;color:#A06F24;margin-bottom:8px;">❧</div>
              <div style="font-family:'Georgia',serif;font-size:22px;letter-spacing:0.18em;text-transform:uppercase;color:#F3EEE3;">Belletra</div>
              <div style="width:40px;height:1px;background:#A06F24;margin:12px auto 0;opacity:0.6;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#FFFEFB;border-left:1px solid rgba(160,111,36,0.15);border-right:1px solid rgba(160,111,36,0.15);padding:48px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1D1A15;border-radius:0 0 8px 8px;padding:24px 48px;text-align:center;">
              <p style="margin:0;font-family:'Georgia',serif;font-size:12px;color:#5D574C;letter-spacing:0.04em;">
                Read literature. Learn languages. One sentence at a time.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#3A3630;">
                <a href="${APP_URL}" style="color:#A06F24;text-decoration:none;">belletra.app</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/unsubscribe" style="color:#5D574C;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Button component ──────────────────────────────────────────────────────────

function btn(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:32px auto;">
    <tr>
      <td style="background:#1D1A15;border-radius:4px;padding:14px 36px;">
        <a href="${href}" style="font-family:'Georgia',serif;font-size:15px;color:#F3EEE3;text-decoration:none;letter-spacing:0.06em;">${label}</a>
      </td>
    </tr>
  </table>`
}

function fallback(href: string): string {
  return `<p style="margin:24px 0 0;font-size:12px;color:#5D574C;font-style:italic;text-align:center;">
    If the button doesn't work, copy this link:<br/>
    <a href="${href}" style="color:#A06F24;word-break:break-all;">${href}</a>
  </p>`
}

function quote(): string {
  return `<div style="margin:36px 0 0;padding:24px 28px;border-left:3px solid #A06F24;background:#F3EEE3;border-radius:0 4px 4px 0;">
    <p style="margin:0;font-family:'Georgia',serif;font-style:italic;font-size:15px;color:#A06F24;line-height:1.6;">
      « Il pleure dans mon cœur, comme il pleut sur la ville. »
    </p>
    <p style="margin:8px 0 0;font-size:11px;color:#5D574C;letter-spacing:0.08em;">— PAUL VERLAINE, 1874</p>
  </div>`
}

// ── Templates ─────────────────────────────────────────────────────────────────

function confirmEmail(confirmUrl: string): string {
  return layout(`
    <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#211E18;">Confirm your email</h1>
    <div style="width:32px;height:2px;background:#A06F24;margin-bottom:24px;"></div>
    <p style="margin:0 0 16px;font-size:15px;color:#211E18;line-height:1.7;">
      Welcome to Belletra. You're one step away from reading literature in a new language.
    </p>
    <p style="margin:0;font-size:15px;color:#5D574C;line-height:1.7;">
      Click below to confirm your email address and begin.
    </p>
    ${btn(confirmUrl, 'Confirm my email')}
    ${fallback(confirmUrl)}
    ${quote()}
  `)
}

function magicLink(magicUrl: string): string {
  return layout(`
    <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#211E18;">Your sign-in link</h1>
    <div style="width:32px;height:2px;background:#A06F24;margin-bottom:24px;"></div>
    <p style="margin:0 0 16px;font-size:15px;color:#211E18;line-height:1.7;">
      Here is your one-time link to sign in to Belletra. It expires in 1 hour.
    </p>
    <p style="margin:0;font-size:15px;color:#5D574C;line-height:1.7;">
      If you didn't request this, you can safely ignore this email.
    </p>
    ${btn(magicUrl, 'Sign in to Belletra')}
    ${fallback(magicUrl)}
    ${quote()}
  `)
}

function resetPassword(resetUrl: string): string {
  return layout(`
    <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#211E18;">Reset your password</h1>
    <div style="width:32px;height:2px;background:#A06F24;margin-bottom:24px;"></div>
    <p style="margin:0 0 16px;font-size:15px;color:#211E18;line-height:1.7;">
      We received a request to reset the password for your Belletra account.
    </p>
    <p style="margin:0;font-size:15px;color:#5D574C;line-height:1.7;">
      Click below to choose a new password. This link expires in 1 hour.
    </p>
    ${btn(resetUrl, 'Reset my password')}
    ${fallback(resetUrl)}
    <p style="margin:24px 0 0;font-size:12px;color:#5D574C;font-style:italic;text-align:center;">
      If you didn't request a password reset, no action is needed — your account is safe.
    </p>
  `)
}

function welcome(email: string): string {
  return layout(`
    <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#211E18;">Welcome to Belletra</h1>
    <div style="width:32px;height:2px;background:#A06F24;margin-bottom:24px;"></div>
    <p style="margin:0 0 16px;font-size:15px;color:#211E18;line-height:1.7;">
      Your account is ready. You can now read literature in a new language — one sentence at a time, taken apart word by word.
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:#5D574C;line-height:1.7;">
      Start with your first sentence today. Etymology, grammar, the precise reason a poet reached for this word over any simpler one — it's all there, waiting.
    </p>
    ${btn(`${APP_URL}/app`, 'Read my first sentence')}
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:36px;border-top:1px solid rgba(160,111,36,0.2);padding-top:28px;">
      <tr>
        <td width="33%" style="text-align:center;padding:0 8px;">
          <div style="font-size:20px;color:#A06F24;margin-bottom:6px;">❧</div>
          <div style="font-size:12px;color:#211E18;font-weight:bold;margin-bottom:4px;">One sentence</div>
          <div style="font-size:11px;color:#5D574C;">per day, in depth</div>
        </td>
        <td width="33%" style="text-align:center;padding:0 8px;">
          <div style="font-size:20px;color:#A06F24;margin-bottom:6px;">∞</div>
          <div style="font-size:12px;color:#211E18;font-weight:bold;margin-bottom:4px;">Every language</div>
          <div style="font-size:11px;color:#5D574C;">French, Italian & more</div>
        </td>
        <td width="33%" style="text-align:center;padding:0 8px;">
          <div style="font-size:20px;color:#A06F24;margin-bottom:6px;">⟡</div>
          <div style="font-size:12px;color:#211E18;font-weight:bold;margin-bottom:4px;">Real depth</div>
          <div style="font-size:11px;color:#5D574C;">etymology & grammar</div>
        </td>
      </tr>
    </table>
    ${quote()}
  `)
}

function onboarding(email: string, day: number): string {
  const tips = [
    { title: 'Read the sentence aloud', body: 'Say it slowly. Let the sounds land before you reach for the meaning.' },
    { title: 'Tap a word you don\'t know', body: 'Etymology reveals why a poet chose this word over every simpler one.' },
    { title: 'Rebuild it from memory', body: 'That moment of reconstruction — that\'s when the sentence becomes yours.' },
  ]
  const tip = tips[(day - 1) % tips.length]
  return layout(`
    <p style="margin:0 0 4px;font-size:11px;color:#A06F24;letter-spacing:0.16em;text-transform:uppercase;">Day ${day}</p>
    <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#211E18;">${tip.title}</h1>
    <div style="width:32px;height:2px;background:#A06F24;margin-bottom:24px;"></div>
    <p style="margin:0 0 24px;font-size:15px;color:#211E18;line-height:1.7;">
      ${tip.body}
    </p>
    <p style="margin:0;font-size:15px;color:#5D574C;line-height:1.7;">
      Your sentence is waiting. It takes two minutes. The understanding lasts longer.
    </p>
    ${btn(`${APP_URL}/app`, 'Read today\'s sentence')}
    ${quote()}
  `)
}

// ── Email sender ──────────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error: ${err}`)
  }
  return res.json()
}

// ── Handler ───────────────────────────────────────────────────────────────────
// Supabase auth hook payload:
// { user: { email, ... }, email_data: { token, token_hash, redirect_to, email_action_type, site_url, token_new, token_hash_new } }

serve(async (req) => {
  try {
    const body = await req.json()
    console.log('Hook payload:', JSON.stringify(body))

    // Supabase auth hook format
    const user = body.user
    const emailData = body.email_data
    const email = user?.email ?? body.email
    const actionType = emailData?.email_action_type ?? body.type

    // Build URL from token_hash — site_url from Supabase already contains /auth/v1 so we use SUPABASE_URL
    const tokenHash = emailData?.token_hash
    const redirectTo = emailData?.redirect_to ?? APP_URL
    const confirmUrl = tokenHash
      ? `${SUPABASE_URL}/auth/v1/verify?token=${tokenHash}&type=${actionType}&redirect_to=${redirectTo}`
      : emailData?.confirmation_url ?? body.data?.url ?? APP_URL

    let subject = ''
    let html = ''

    switch (actionType) {
      case 'signup':
      case 'email_change_current':
      case 'email_change_new':
        subject = 'Confirm your Belletra account'
        html = confirmEmail(confirmUrl)
        break

      case 'magiclink':
      case 'magic_link':
        subject = 'Your Belletra sign-in link'
        html = magicLink(confirmUrl)
        break

      case 'recovery':
        subject = 'Reset your Belletra password'
        html = resetPassword(confirmUrl)
        break

      case 'invite':
        subject = 'You\'ve been invited to Belletra'
        html = confirmEmail(confirmUrl)
        break

      case 'welcome':
        subject = 'Welcome to Belletra'
        html = welcome(email)
        break

      case 'onboarding':
        const day = body.data?.day ?? 1
        subject = `Day ${day} — your sentence is waiting`
        html = onboarding(email, day)
        break

      default:
        console.error('Unknown action type:', actionType, 'Full body:', JSON.stringify(body))
        return new Response(JSON.stringify({ error: `Unknown type: ${actionType}` }), { status: 400 })
    }

    await sendEmail(email, subject, html)
    return new Response(JSON.stringify({ sent: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
