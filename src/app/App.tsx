import { motion, useScroll, useSpring } from 'motion/react'

import { fallbackFeed } from '../data/site'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'
import { useGithub } from './lib/github'
import { I18nProvider, useI18n } from './lib/i18n'
import { ThemeProvider } from './lib/theme'

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Shell />
      </I18nProvider>
    </ThemeProvider>
  )
}

function Shell() {
  const feed = useGithub(fallbackFeed)
  const { t } = useI18n()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 })

  return (
    <>
      <a
        href="#proyectos"
        className="sr-only rounded-full focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-fg focus:px-4 focus:py-2 focus:text-[13px] focus:text-bg"
      >
        {t.nav.skip}
      </a>

      <Cursor />

      <motion.div
        style={{ scaleX: progress }}
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent/70"
      />

      <Nav />
      <main>
        <Home feed={feed} />
      </main>
      <Footer feed={feed} />
    </>
  )
}
