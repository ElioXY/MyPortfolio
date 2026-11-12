import { ArrowUpRight, ArrowUp } from 'lucide-react'

import { site } from '../../data/site'
import { timeAgo, type FeedState } from '../lib/github'
import { useI18n } from '../lib/i18n'
import { ContactForm } from './ContactForm'
import { GithubMark } from './GithubMark'
import { LogoMark } from './Logo'
import { Lines, Magnetic, Reveal } from './motion'

export function Footer({ feed }: { feed: FeedState }) {
  const { t, locale } = useI18n()
  const github = `https://github.com/${feed.data.profile.login}`

  return (
    <footer id="contacto" className="mt-28 border-t border-line sm:mt-40">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
        <p className="inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[0.18em] text-faint uppercase">
          <span className="h-px w-6 bg-accent" />
          {t.footer.eyebrow}
        </p>

        <div className="mt-5 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div>
            <Lines
              as="h2"
              className="font-display max-w-[18ch] text-[clamp(44px,8vw,104px)]"
              lines={[
                t.footer.heading[0],
                <span key="accent" className="text-accent">
                  {t.footer.heading[1]}
                </span>,
              ]}
            />

            <Reveal delay={0.15} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor={t.nav.github}
                  className="inline-flex h-14 items-center gap-2 rounded-[16px] border border-line-strong px-6 text-[15px] transition-colors duration-300 hover:border-fg"
                >
                  <GithubMark className="size-4" />
                  github.com/{feed.data.profile.login}
                  <ArrowUpRight className="size-4" />
                </a>
              </Magnetic>
              <p className="text-[13.5px] text-muted">
                {site.available ? t.footer.open : t.footer.busy}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-line pt-8 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <LogoMark className="size-4" />© {new Date().getFullYear()} {site.name} · {t.footer.madeWith}
          </p>
          <p className="flex items-center gap-2">
            <span
              className={`size-1.5 rounded-full ${feed.status === 'live' ? 'bg-emerald-500' : 'bg-amber-500'}`}
            />
            {feed.status === 'live'
              ? `${t.footer.synced} ${timeAgo(feed.data.syncedAt, locale)}`
              : t.footer.local}
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
          >
            {t.footer.top}
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
