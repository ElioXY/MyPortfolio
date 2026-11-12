import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { site } from '../../data/site'
import { useI18n, type Locale } from '../lib/i18n'
import { useTheme } from '../lib/theme'
import { cx } from '../lib/cx'
import { GithubMark } from './GithubMark'
import { LogoMark } from './Logo'

export function Nav() {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggle } = useTheme()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 200)
      setScrolled(y > 16)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#proyectos', label: t.nav.projects },
    { href: '#sobre-mi', label: t.nav.about },
    { href: '#contacto', label: t.nav.contact },
  ]

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hidden && '-translate-y-full',
      )}
    >
      <div
        className={cx(
          'transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled ? 'nav-blur' : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="group inline-flex items-center gap-2.5 text-[15px] font-medium">
            <LogoMark className="size-8 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105" />
            <span className="font-display text-[17px]">{site.name}</span>
          </a>

          <nav className="flex items-center gap-1 sm:gap-1.5">
            <div className="mr-1 hidden items-center sm:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="link-draw rounded-full px-3 py-2 text-[13.5px] text-muted transition-colors hover:text-fg"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <LanguageSwitch locale={locale} onChange={setLocale} label={t.nav.language} />

            <button
              type="button"
              onClick={toggle}
              aria-label={t.nav.theme}
              className="grid size-9 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-fg hover:text-fg"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <a
              href={`https://github.com/${site.handle}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t.nav.github}
              className="grid size-9 place-items-center rounded-full border border-line transition-all duration-300 hover:-translate-y-0.5 hover:border-fg hover:bg-fg hover:text-bg"
            >
              <GithubMark className="size-4" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

function LanguageSwitch({
  locale,
  onChange,
  label,
}: {
  locale: Locale
  onChange: (locale: Locale) => void
  label: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center rounded-full border border-line p-0.5 text-[11px] font-medium uppercase"
    >
      {(['es', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          aria-pressed={locale === code}
          className={cx(
            'rounded-full px-2 py-1.5 transition-colors duration-300',
            locale === code ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
