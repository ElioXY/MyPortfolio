import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue | null>(null)

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Solo hay valor guardado si el visitante tocó el interruptor alguna vez. */
function storedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('theme')
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

/**
 * Tema claro/oscuro. El primer valor lo pone `/theme-init.js` antes del primer
 * pintado. Si nadie ha elegido tema, se sigue al sistema y se reacciona a sus
 * cambios; solo el interruptor escribe en localStorage, para no congelar la
 * preferencia del sistema en la primera visita.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(currentTheme)
  const [manual, setManual] = useState(() => storedTheme() !== null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'dark' ? '#0e0f12' : '#f2efe9')
  }, [theme])

  useEffect(() => {
    if (manual) return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [manual])

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      toggle: () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        setManual(true)
        try {
          localStorage.setItem('theme', next)
        } catch {
          // Sin persistencia: el tema dura lo que la sesión.
        }
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return context
}
