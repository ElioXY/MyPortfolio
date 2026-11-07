import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]

const es = {
  meta: {
    title: 'Elio',
    description: 'Portafolio de Elio: apps web con TypeScript y React. Proyectos sincronizados desde GitHub.',
  },
  nav: {
    projects: 'Proyectos',
    about: 'Sobre mí',
    contact: 'Contacto',
    github: 'Perfil de GitHub',
    theme: 'Cambiar tema',
    language: 'Cambiar idioma',
    skip: 'Saltar al contenido',
  },
  hero: {
    greeting: 'Hola 👋',
    available: 'Disponible para colaborar',
    busy: 'Ocupado por ahora',
    projects: 'Ver proyectos',
    scroll: 'Sigue bajando',
  },
  profile: {
    repos: 'repos',
    stars: 'estrellas',
    languages: 'lenguajes',
    since: 'En GitHub desde',
    synced: 'sincronizado',
  },
  projects: {
    eyebrow: '01 — Repositorios',
    title: 'Proyectos',
    syncPrefix: 'Se sincronizan solos desde',
    live: 'En vivo',
    cached: 'Copia local',
    loading: 'Sincronizando…',
    all: 'Todos',
    refresh: 'Volver a sincronizar con GitHub',
    viewAll: 'Ver todos en GitHub',
    empty: 'No hay repositorios con ese lenguaje ahora mismo.',
  },
  about: {
    eyebrow: '02 — Sobre mí',
    title: 'Sobre mí',
    tools: 'Herramientas',
    stars: 'en repos públicos',
    portrait: 'Retrato',
  },
  repo: {
    view: 'Ver repo',
    fork: 'fork',
    demo: 'Demo en vivo',
    noDescription: 'Todavía sin descripción en GitHub.',
    noLanguage: 'Sin lenguaje',
  },
  footer: {
    eyebrow: '03 — Contacto',
    heading: ['¿Construimos', 'algo juntos?'],
    open: 'Abierto a colaborar en proyectos pequeños',
    busy: 'Sin huecos por ahora',
    email: 'Escríbeme',
    madeWith: 'Hecho con ❤️',
    synced: 'GitHub sincronizado',
    local: 'Mostrando copia local de GitHub',
    top: 'Volver arriba',
  },
  form: {
    title: 'Escríbeme',
    name: 'Tu nombre',
    email: 'Tu email',
    message: 'Cuéntame qué tienes en mente',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    sentTitle: 'Mensaje enviado',
    sentBody: 'Gracias. Te responderé a tu email en cuanto pueda.',
    another: 'Enviar otro',
    errorName: 'Escribe tu nombre.',
    errorEmail: 'Ese email no parece válido.',
    errorMessage: 'Cuéntame algo más, al menos una frase.',
    errorSend: 'No se pudo enviar. Inténtalo otra vez o escríbeme directamente.',
    errorMissing: 'El envío todavía no está configurado. Escríbeme directamente.',
    direct: 'O escríbeme a',
    privacy: 'Solo uso tus datos para responderte.',
  },
}

const en: typeof es = {
  meta: {
    title: 'Elio',
    description: 'Elio’s portfolio: web apps with TypeScript and React. Projects synced straight from GitHub.',
  },
  nav: {
    projects: 'Projects',
    about: 'About',
    contact: 'Contact',
    github: 'GitHub profile',
    theme: 'Toggle theme',
    language: 'Change language',
    skip: 'Skip to content',
  },
  hero: {
    greeting: 'Hi there! 👋',
    available: 'Open to collaborate',
    busy: 'Booked for now',
    projects: 'See projects',
    scroll: 'Keep scrolling',
  },
  profile: {
    repos: 'repos',
    stars: 'stars',
    languages: 'languages',
    since: 'On GitHub since',
    synced: 'synced',
  },
  projects: {
    eyebrow: '01 — Repositories',
    title: 'Projects',
    syncPrefix: 'Synced straight from',
    live: 'Live',
    cached: 'Local copy',
    loading: 'Syncing…',
    all: 'All',
    refresh: 'Re-sync with GitHub',
    viewAll: 'View all on GitHub',
    empty: 'No repositories with that language right now.',
  },
  about: {
    eyebrow: '02 — About',
    title: 'About me',
    tools: 'Tools',
    stars: 'on public repos',
    portrait: 'Portrait',
  },
  repo: {
    view: 'View repo',
    fork: 'fork',
    demo: 'Live demo',
    noDescription: 'No description on GitHub yet.',
    noLanguage: 'No language',
  },
  footer: {
    eyebrow: '03 — Contact',
    heading: ['Shall we build', 'something good?'],
    open: 'Open to small collaborations',
    busy: 'No openings right now',
    email: 'Email me',
    madeWith: 'Built with ❤️',
    synced: 'GitHub synced',
    local: 'Showing a local copy of GitHub',
    top: 'Back to top',
  },
  form: {
    title: 'Email me',
    name: 'Your name',
    email: 'Your email',
    message: 'Tell me what you have in mind',
    send: 'Send message',
    sending: 'Sending…',
    sentTitle: 'Message sent',
    sentBody: 'Thanks. I’ll reply to your email as soon as I can.',
    another: 'Send another',
    errorName: 'Please write your name.',
    errorEmail: 'That email doesn’t look right.',
    errorMessage: 'Add a bit more, at least one sentence.',
    errorSend: 'It didn’t go through. Try again or email me directly.',
    errorMissing: 'Sending isn’t configured yet. Please email me directly.',
    direct: 'Or email me at',
    privacy: 'I only use your details to reply.',
  },
}

const dictionaries: Record<Locale, typeof es> = { es, en }

type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: typeof es; locales: readonly Locale[] }

const I18nContext = createContext<I18nValue | null>(null)

function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value) && (locales as readonly string[]).includes(value as string)
}


export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem('locale')
    if (isLocale(stored)) return stored
  } catch {
    
  }
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const candidate of candidates) {
    const base = candidate?.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'es'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    typeof window === 'undefined' ? 'es' : detectLocale(),
  )

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem('locale', next)
    } catch {
      
    }
  }

  useEffect(() => {
    document.documentElement.lang = locale
    const description = document.querySelector('meta[name="description"]')
    description?.setAttribute('content', dictionaries[locale].meta.description)
    document.title = dictionaries[locale].meta.title
  }, [locale])

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t: dictionaries[locale], locales }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n debe usarse dentro de I18nProvider')
  return context
}
