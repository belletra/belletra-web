import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Sentence {
  id: string
  text: string
  lines: string[] | null
  teaser: string | null
  audio: string | null
  author: string
  work?: string
  year?: number
  cefr?: string
  feature?: string
  status: string
  translation: string | null
  plain_register: string | null
  ord: number
  // internal authoring fields — never fetched by client queries
  tokens?: string[] | null
  curator?: string | null
  hinge_token?: string | null
  swap_prompt?: string | null
}

export interface Word {
  id: number
  sentence_id: string
  token: string
  pos: string
  gloss: string
  etymology_surface: string | null
  etymology_deep: string | null
  ord: number
}

export interface Lens {
  id: number
  sentence_id: string
  kind: 'grammar' | 'genius' | 'ear' | 'turn' | 'silence'
  name: string | null
  surface: string
  deep: string
  rule: string | null
  contrast: string | null
  ord: number
}

export interface SwapAlt {
  id: number
  sentence_id: string
  form: string
  highlight: string[]
  is_original: boolean
  tag: string
  verdict: string
  ord: number
}

export interface AnthologyItem {
  id: number
  text: string
  author: string
  theme: string
}

export interface WordQueueItem {
  token: string
  gloss: string
  source_author: string
  sentence_id: string
  sentence_text: string
}

export interface ReadingLogEntry {
  read_date: string
}

// ── Public queries ─────────────────────────────────────────────────────────────

// Display fields only — no internal authoring data exposed to client
const SENTENCE_DISPLAY = 'id, text, lines, teaser, audio, author, work, year, cefr, feature, status, translation, plain_register, ord'

export async function getTodaySentence(): Promise<Sentence | null> {
  await supabase.rpc('rotate_daily_sentence').then(() => {}, () => {})
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabase
    .from('sentences')
    .select(SENTENCE_DISPLAY)
    .eq('status', 'published')
    .eq('date_published', today)
    .order('ord', { ascending: true })
    .limit(1)
    .single()
  return data
}

export async function getTomorrowSentence(): Promise<Pick<Sentence,'id'|'text'|'teaser'|'author'|'ord'|'status'> | null> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)
  const { data } = await supabase
    .from('sentences')
    .select('id, text, teaser, author, ord, status')
    .eq('status', 'queued')
    .eq('date_published', tomorrowStr)
    .order('ord', { ascending: true })
    .limit(1)
    .single()
  return data
}

// Minimal projection — library cards only need these fields
export interface SentenceCard {
  id: string
  text: string
  author: string
  cefr: string
  feature: string
  status: string
  ord: number
}

export async function getAllSentences(): Promise<SentenceCard[]> {
  const { data } = await supabase
    .from('sentences')
    .select('id, text, author, cefr, feature, status, ord')
    .in('status', ['published', 'queued'])
    .order('ord', { ascending: true })
  return data ?? []
}

// Minimal preview for locked sentences — no translation, audio, lines, or plain_register
export interface SentencePreview {
  id: string
  text: string
  author: string
  work?: string
  year?: number
  cefr?: string
  feature?: string
}

export async function getSentencePreview(id: string): Promise<SentencePreview | null> {
  const { data } = await supabase
    .from('sentences')
    .select('id, text, author, work, year, cefr, feature')
    .eq('id', id)
    .single()
  return data
}

export async function getSentenceById(id: string): Promise<Sentence | null> {
  const { data } = await supabase
    .from('sentences')
    .select(SENTENCE_DISPLAY)
    .eq('id', id)
    .single()
  return data
}

export async function getSentenceFull(id: string): Promise<{
  sentence: Sentence
  words: Word[]
  lenses: Lens[]
  swaps: SwapAlt[]
} | null> {
  const [sentRes, wordsRes, lensesRes, swapsRes] = await Promise.all([
    supabase.from('sentences').select(SENTENCE_DISPLAY).eq('id', id).single(),
    supabase.from('words').select('*').eq('sentence_id', id).order('ord'),
    supabase.from('lenses').select('*').eq('sentence_id', id).order('ord'),
    supabase.from('swap_alternatives').select('*').eq('sentence_id', id).order('ord'),
  ])
  if (!sentRes.data) return null
  return {
    sentence: sentRes.data,
    words: wordsRes.data ?? [],
    lenses: lensesRes.data ?? [],
    swaps: swapsRes.data ?? [],
  }
}

// ── Anthology (user-scoped) ────────────────────────────────────────────────────

export async function getAnthology(limit = 3): Promise<AnthologyItem[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from('anthology')
    .select('id, text, author, theme')
    .eq('user_id', user.id)
    .order('id', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getAnthologyCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0
  const { count } = await supabase
    .from('anthology')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  return count ?? 0
}

export async function addToAnthology(item: Omit<AnthologyItem, 'id'>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { error } = await supabase.from('anthology').insert({ ...item, user_id: user.id })
  if (error) throw error
}

// ── Done / reads ──────────────────────────────────────────────────────────────

export async function getReadSentenceIds(): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Set()
  const { data } = await supabase
    .from('sentence_reads')
    .select('sentence_id')
    .eq('user_id', user.id)
  return new Set((data ?? []).map((r: any) => r.sentence_id))
}

export async function markDone(sentenceId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('sentence_reads').upsert({ user_id: user.id, sentence_id: sentenceId }, { onConflict: 'user_id,sentence_id', ignoreDuplicates: true })
}

export async function unmarkDone(sentenceId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('sentence_reads').delete().eq('user_id', user.id).eq('sentence_id', sentenceId)
}

// ── User-scoped (requires auth) ────────────────────────────────────────────────

export async function addWordsToQueue(
  sentenceId: string,
  words: Array<{ token: string; gloss: string | null }>,
  author: string,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const rows = words
    .filter(w => w.gloss)
    .map(w => ({
      user_id: user.id,
      sentence_id: sentenceId,
      token: w.token,
      gloss: w.gloss,
      source_author: author,
    }))
  if (rows.length === 0) return
  await supabase.from('user_word_queue').upsert(rows, { onConflict: 'user_id,sentence_id,token', ignoreDuplicates: true })
}

export async function getWordQueue(): Promise<WordQueueItem[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from('user_word_queue')
    .select('token, gloss, source_author, sentence_id, sentences(text)')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })
    .limit(40)
  if (!data || data.length === 0) return []
  const shuffled = [...data].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 20).map((r: any) => ({
    token: r.token,
    gloss: r.gloss,
    source_author: r.source_author,
    sentence_id: r.sentence_id,
    sentence_text: r.sentences?.text ?? '',
  }))
}

export async function getReadingLog(): Promise<ReadingLogEntry[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  // Last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })
  const { data } = await supabase
    .from('reading_log')
    .select('read_date')
    .eq('user_id', user.id)
    .in('read_date', days)
  return data ?? []
}

export async function getSubscriptionStatus(): Promise<{ isSubscribed: boolean; plan: string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isSubscribed: false, plan: null }
  const { data } = await supabase
    .from('user_subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()
  const isSubscribed = data?.status === 'active'
  return { isSubscribed, plan: data?.plan ?? null }
}

export async function logReading(sentenceId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const today = new Date().toISOString().slice(0, 10)
  await supabase.from('reading_log').upsert(
    { user_id: user.id, sentence_id: sentenceId, read_date: today },
    { onConflict: 'user_id,read_date', ignoreDuplicates: true }
  )
}
