import { animate, motion, useInView, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { ArrowUpRight, RefreshCw, Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { site } from '../../data/site'
import { GithubMark } from '../components/GithubMark'
import { ProfileImage } from '../components/ProfileImage'
import { RepoCard } from '../components/RepoCard'
import { Lines, Magnetic, Reveal } from '../components/motion'
import { languageColor, timeAgo, visibleRepos, type Feed } from '../lib/github'
import { useI18n } from '../lib/i18n'
import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

export function Home({ feed }: { feed: Feed }) {
  const { t, locale } = useI18n()
  const copy = site.copy[locale]
  const repos = useMemo(() => visibleRepos(feed.data.repos), [feed.data.repos])
  const [filter, setFilter] = useState<string | null>(null)

  // La marquesina se inclina según la velocidad del scroll.
  const velocity = useVelocity(useScroll().scrollY)
  const smoothVelocity = useSpring(velocity, { stiffness: 120, damping: 22, mass: 0.4 })
  const marqueeSkew = useTransform(smoothVelocity, [-1600, 0, 1600], [3.5, 0, -3.5], { clamp: true })

  const languages = useMemo(
    () =>
      Array.from(
        new Set(repos.map((repo) => repo.language).filter((value): value is string => Boolean(value))),
      ),
    [repos],
  )
  const shown = filter ? repos.filter((repo) => repo.language === filter) : repos
  const stars = repos.reduce((total, repo) => total + repo.stars, 0)
  const github = feed.data.profile.url

  return (
    <>
      {/* Inicio */}
      <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
        <HeroField />

        <div className="relative mx-auto w-full max-w-[1240px] px-5 pt-28 pb-16 sm:px-8 sm:pt-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-2 pr-4 pl-3 text-[12.5px] text-muted backdrop-blur"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-500/70" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                {site.available ? t.hero.available : t.hero.busy}
                <span className="text-faint">·</span>
                {copy.role}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
                className="font-display mb-3 text-[clamp(26px,3.2vw,38px)] text-fg"
              >
                {t.hero.greeting}
              </motion.p>

              {/* Cada letra es un span animado: el aria-label evita que los
                  lectores de pantalla lo deletreen. */}
              <h1 aria-label={site.name} className="font-display text-[clamp(72px,16vw,220px)] leading-[0.82]">
                <span aria-hidden>
                  {site.name.split('').map((letter, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '112%' }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.1, delay: 0.2 + i * 0.05, ease }}
                      >
                        {letter}
                      </motion.span>
                    </span>
                  ))}
                  <motion.span
                    className="inline-block text-accent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.65, ease }}
                  >
                    .
                  </motion.span>
                </span>
              </h1>

              <Reveal delay={0.15} className="mt-8 max-w-[52ch] border-t border-fg/15 pt-6">
                <p className="text-pretty text-[17px] leading-[1.72] text-muted sm:text-[18.5px]">
                  {copy.intro}
                </p>
              </Reveal>

              <Reveal delay={0.25} className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a
                    href="#proyectos"
                    className="group inline-flex items-center gap-2 rounded-[15px] bg-fg px-6 py-3.5 text-[14.5px] font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-white"
                  >
                    {t.hero.projects}
                    <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="GitHub"
                    className="inline-flex items-center gap-2 rounded-[15px] border border-line-strong px-6 py-3.5 text-[14.5px] transition-colors duration-300 hover:border-fg"
                  >
                    <GithubMark className="size-4" />
                    {feed.data.profile.login}
                  </a>
                </Magnetic>
              </Reveal>
            </div>

            <ProfileCard
              avatar={feed.data.profile.avatar}
              repos={repos.length}
              stars={stars}
              languages={languages.length}
              since={new Date(feed.data.profile.memberSince).getFullYear()}
            />
          </div>
        </div>
      </section>

      {/* Marquesina */}
      <motion.div style={{ skewY: marqueeSkew }} className="overflow-hidden border-y border-line py-4" aria-hidden>
        <ul className="font-display flex w-max animate-marquee items-center gap-9 whitespace-nowrap text-[26px] text-fg/60 sm:text-[32px]">
          {[...copy.marquee, ...copy.marquee].map((item, i) => (
            <li key={i} className="flex items-center gap-9">
              {item}
              <span className="round size-1.5 rounded-full bg-accent/70" />
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Proyectos */}
      <section id="proyectos" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>{t.projects.eyebrow}</Eyebrow>
            <Lines as="h2" className="font-display mt-4 text-[clamp(40px,6vw,76px)]" lines={[t.projects.title]} />
            <Reveal delay={0.1} className="mt-3 text-[14.5px] text-muted">
              {t.projects.syncPrefix}{' '}
              <a href={github} target="_blank" rel="noreferrer noopener" className="link-draw text-fg">
                github.com/{feed.data.profile.login}
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[12.5px] text-muted">
              <span
                className={cx(
                  'size-1.5 rounded-full',
                  feed.status === 'live'
                    ? 'bg-emerald-500'
                    : feed.status === 'loading'
                      ? 'bg-amber-400'
                      : 'bg-amber-500',
                )}
              />
              {feed.status === 'live'
                ? `${t.projects.live} · ${timeAgo(feed.data.syncedAt, locale)}`
                : feed.status === 'loading'
                  ? t.projects.loading
                  : t.projects.cached}
            </span>
            <button
              type="button"
              onClick={feed.refresh}
              aria-label={t.projects.refresh}
              className="grid size-9 place-items-center rounded-full border border-line bg-surface text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-fg hover:text-fg"
            >
              <RefreshCw className={cx('size-3.5', feed.status === 'loading' && 'animate-spin')} />
            </button>
          </Reveal>
        </div>

        {languages.length > 1 && (
          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-2">
            <FilterChip active={filter === null} onClick={() => setFilter(null)}>
              {t.projects.all} <span className="text-faint tabular-nums">{repos.length}</span>
            </FilterChip>
            {languages.map((language) => (
              <FilterChip
                key={language}
                active={filter === language}
                onClick={() => setFilter(filter === language ? null : language)}
              >
                <span className="size-2 rounded-full" style={{ background: languageColor(language) }} />
                {language}
              </FilterChip>
            ))}
          </Reveal>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {feed.status === 'loading'
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="min-h-[300px] animate-pulse rounded-card border border-line bg-surface/70"
                />
              ))
            : shown.map((repo, i) => <RepoCard key={repo.name} repo={repo} index={i} />)}
        </div>

        {feed.status !== 'loading' && shown.length === 0 && (
          <p className="mt-10 rounded-card border border-dashed border-line-strong p-8 text-center text-[14.5px] text-muted">
            {t.projects.empty}
          </p>
        )}

        <Reveal delay={0.1} className="mt-10">
          <a
            href={`${github}?tab=repositories`}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 border-b border-line pb-1 text-[14.5px] text-muted transition-colors hover:text-fg"
          >
            {t.projects.viewAll}
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </section>

      {/* Sobre mí */}
      <section id="sobre-mi" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 pt-28 sm:px-8 sm:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <Portrait src={feed.data.profile.avatar} name={site.name} />
          </Reveal>

          <div>
            <Eyebrow>{t.about.eyebrow}</Eyebrow>
            <Lines as="h2" className="font-display mt-4 text-balance text-[clamp(36px,5vw,60px)]" lines={[t.about.title]} />
            <Reveal delay={0.15} className="mt-6 flex flex-col gap-5 text-pretty text-[17px] leading-[1.72] text-muted">
              {copy.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <p className="text-[13px] tracking-[0.16em] text-faint uppercase">{t.about.tools}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {site.stack.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] text-muted transition-colors duration-300 hover:border-fg hover:text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px]">
              <span className="inline-flex items-center gap-2 text-muted">
                <Star className="size-3.5" />
                <span className="tabular-nums">{stars}</span> {t.about.stars}
              </span>
              <a
                href={github}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
              >
                <GithubMark className="size-3.5" />@{feed.data.profile.login}
                <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[0.18em] text-faint uppercase">
      <span className="h-px w-6 bg-accent" />
      {children}
    </p>
  )
}

/** Número que cuenta al entrar en pantalla. */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.1,
      ease,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, value])

  return <span ref={ref}>{display}</span>
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition-all duration-300',
        active
          ? 'border-fg bg-fg text-bg'
          : 'border-line bg-surface text-muted hover:-translate-y-0.5 hover:border-line-strong hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}

function ProfileCard({
  avatar,
  repos,
  stars,
  languages,
  since,
}: {
  avatar: string
  repos: number
  stars: number
  languages: number
  since: number
}) {
  const { t } = useI18n()
  return (
    <motion.aside
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease }}
      className="relative mx-auto w-full max-w-[380px]"
    >
      <div className="absolute -inset-3 -z-10 rounded-[34px] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent)] blur-xl" />
      <div className="group rounded-card border border-line bg-surface/85 p-5 backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <ProfileImage
            src={avatar}
            login={site.handle}
            name={site.name}
            className="size-16 rounded-full bg-surface-2 object-cover ring-1 ring-line transition-transform duration-700 group-hover:scale-105"
            letterClassName="text-[26px]"
          />
          <div>
            <p className="font-display text-[22px]">{site.name}</p>
            <p className="text-[13px] text-muted">@{site.handle}</p>
          </div>
          <a
            href={`https://github.com/${site.handle}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={t.nav.github}
            className="ml-auto grid size-9 place-items-center rounded-full border border-line transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg"
          >
            <GithubMark className="size-4" />
          </a>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-line pt-5 text-center">
          {[
            [repos, t.profile.repos],
            [stars, t.profile.stars],
            [languages, t.profile.languages],
          ].map(([value, label]) => (
            <div key={String(label)}>
              <dd className="font-display text-[26px] leading-none tabular-nums">
                <Counter value={Number(value)} />
              </dd>
              <dt className="mt-1.5 text-[11.5px] tracking-[0.1em] text-faint uppercase">{label}</dt>
            </div>
          ))}
        </dl>

        <p className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[12px] text-faint">
          <span>
            {t.profile.since} {since}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            {t.profile.synced}
          </span>
        </p>
      </div>
    </motion.aside>
  )
}

/** Retrato circular con un anillo que gira y un paralaje suave al hacer scroll. */
function Portrait({ src, name }: { src: string; name: string }) {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [56, -56])
  const rotate = useTransform(scrollYProgress, [0, 1], [-3.5, 3.5])

  return (
    <motion.figure ref={ref} style={{ y, rotate }} className="relative mx-auto w-full max-w-[300px]">
      <div className="absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-accent-2)_26%,transparent),transparent)] blur-2xl" />

      <div className="animate-spin-slow absolute -inset-2 rounded-full bg-[conic-gradient(from_0deg,transparent_10%,var(--color-accent),var(--color-accent-2),transparent_78%)] opacity-70" />

      <div className="relative aspect-square overflow-hidden rounded-full border-[5px] border-bg bg-surface-2 shadow-[0_24px_60px_-30px_var(--app-shadow)]">
        <ProfileImage
          src={src}
          login={site.handle}
          name={name}
          alt={`${name} — ${t.about.portrait}`}
          className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
          letterClassName="text-[110px]"
        />
      </div>

      <figcaption className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-line bg-bg px-3.5 py-1.5 text-[11.5px] tracking-[0.14em] text-muted uppercase">
        @{site.handle}
      </figcaption>
    </motion.figure>
  )
}

/** Campos de color que derivan detrás del nombre, con grano encima. */
function HeroField() {
  return (
    <div
      aria-hidden
      className="hero-field pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent_94%)]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0"
      >
        <div className="round absolute -top-[28%] right-[-10%] h-[92%] w-[68%] animate-drift-a rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-accent)_55%,transparent),transparent)] blur-3xl" />
        <div className="round absolute -top-[12%] left-[-14%] h-[78%] w-[60%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-accent-2)_45%,transparent),transparent)] blur-3xl" />
        <div className="round absolute top-[18%] left-[30%] h-[66%] w-[54%] animate-drift-c rounded-full bg-[radial-gradient(closest-side,rgb(255_196_120/0.42),transparent)] blur-3xl" />
        <div className="round absolute top-[42%] right-[10%] h-[46%] w-[38%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,rgb(196_170_255/0.35),transparent)] blur-3xl" />
      </motion.div>
      <div className="grain absolute inset-0" />
    </div>
  )
}
