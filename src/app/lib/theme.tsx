import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue | null>(null)

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Tema claro/oscuro. El primer valor lo pone el script en línea de index.html
 * (antes del primer pintado), así que aquí solo se sigue y se persiste.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'dark' ? '#0e0f12' : '#f2efe9')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Sin persistencia: el tema dura lo que la sesión.
    }
  }, [theme])

  const value = useMemo<ThemeValue>(
    () => ({ theme, toggle: () => setTheme((value) => (value === 'dark' ? 'light' : 'dark')) }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return context
}
