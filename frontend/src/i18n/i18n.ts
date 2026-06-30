import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import es from './es.json'

const STORAGE_KEY = 'wot.lang'

function detectLanguage(): 'en' | 'es' {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'es') return stored

  const nav = navigator.language?.toLowerCase() ?? 'en'
  if (nav.startsWith('es')) return 'es'
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setLanguage(lng: 'en' | 'es') {
  localStorage.setItem(STORAGE_KEY, lng)
  void i18n.changeLanguage(lng)
}

export function getLanguage(): 'en' | 'es' {
  const lng = i18n.language?.toLowerCase()
  return lng?.startsWith('es') ? 'es' : 'en'
}

export default i18n

