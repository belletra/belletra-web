const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'French',
  ja: 'Japanese',
  de: 'German',
  es: 'Spanish',
}

const SPEECH_LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  ja: 'ja-JP',
  de: 'de-DE',
  es: 'es-ES',
}

export function languageName(code?: string | null): string {
  return LANGUAGE_NAMES[code ?? ''] ?? 'this language'
}

export function speechLocale(code?: string | null): string {
  return SPEECH_LOCALES[code ?? ''] ?? 'en-US'
}
