import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type FirstTouch = {
  source: string
  medium: string
  campaign: string
  landing_path: string
  captured_at: string
}

const STORAGE_KEY = 'belletra_first_touch_v1'
const VALUE_LIMIT = 80
const PATH_LIMIT = 240

function clean(value: string | null, limit = VALUE_LIMIT) {
  return (value ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9._~:/+-]/g, '_')
    .slice(0, limit)
}

function isFirstTouch(value: unknown): value is FirstTouch {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return ['source', 'medium', 'campaign', 'landing_path', 'captured_at']
    .every(key => typeof item[key] === 'string' && item[key] !== '')
}

export function getFirstTouch(): FirstTouch | null {
  if (typeof window === 'undefined') return null
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null')
    return isFirstTouch(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function captureFirstTouch() {
  if (typeof window === 'undefined' || getFirstTouch()) return
  const params = new URLSearchParams(window.location.search)
  const source = clean(params.get('utm_source'))
  const medium = clean(params.get('utm_medium'))
  const campaign = clean(params.get('utm_campaign'))
  if (!source || !medium || !campaign) return

  const touch: FirstTouch = {
    source,
    medium,
    campaign,
    landing_path: clean(window.location.pathname, PATH_LIMIT) || '/',
    captured_at: new Date().toISOString(),
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(touch))
}

export function signupMetadata() {
  const acquisition = getFirstTouch()
  return acquisition ? { acquisition } : undefined
}

export async function persistFirstTouchForNewOAuthUser(user: User) {
  if (user.user_metadata?.acquisition || !getFirstTouch()) return

  const createdAt = Date.parse(user.created_at)
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > 10 * 60 * 1000) return

  await supabase.auth.updateUser({
    data: { acquisition: getFirstTouch() },
  })
}
