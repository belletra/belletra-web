import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

export type Sentence = {
  id: string
  text: string
  author: string
  work: string
  year: number
  cefr: string
  feature: string
  translation: string | null
  ord: number
}

export async function getSentences(): Promise<Sentence[]> {
  const { data } = await supabase
    .from('sentences')
    .select('id,text,author,work,year,cefr,feature,translation,ord')
    .eq('status', 'published')
    .order('ord', { ascending: true })
  return data || []
}
