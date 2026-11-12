import { motion, useMotionValue, useSpring } from 'motion/react'
import { Star, GitFork, ArrowUpRight, ExternalLink, GitBranch } from 'lucide-react'
import { useRef } from 'react'

import { languageColor, timeAgo, type Repo } from '../lib/github'
import { useI18n } from '../lib/i18n'
import { cx } from '../lib/cx'

/**
 * Una tarjeta por repositorio. Al pasar el puntero se inclina hacia él, un
 * halo de luz sigue al cursor y el color del lenguaje tiñe el borde.
 */
export function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const { t, locale } = useI18n()
  const ref = useRef<HTMLAnchorElement>(null)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const accent = languageColor(repo.language)

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.95, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="[perspective:1000px]"
    >
      <motion.a
        ref={ref}
        href={repo.url}
        target="_blank"
        rel="noreferrer noopener"
        data-cursor={t.repo.view}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={(event) => {
          if (event.pointerType !== 'mouse') return
          const rect = ref.current?.getBoundingClientRect()
          if (!rect) return
          const px = (event.clientX - rect.left) / rect.width
          const py = (event.clientY - rect.top) / rect.height
          rotateY.set((px - 0.5) * 7)
          rotateX.set((0.5 - py) * 7)
          ref.current?.style.setProperty('--mx', `${px * 100}%`)
          ref.current?.style.setProperty('--my', `${py * 100}%`)
        }}
        onPointerLeave={() => {
          rotateX.set(0)
          rotateY.set(0)
        }}
        className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-card border border-line bg-surface p-6 transition-[border-color,box-shadow,background-color] duration-500 hover:border-line-strong hover:shadow-[0_28px_60px_-32px_var(--app-shadow)] sm:p-8"
      >
        {/* Halo que sigue al puntero */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 0%), ${accent}22, transparent 65%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <span className="font-mono text-[12px] tracking-[0.18em] text-faint tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="flex items-center gap-2">
            {repo.fork && (
              <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[10.5px] tracking-[0.12em] text-faint uppercase">
                <GitBranch className="size-3" /> {t.repo.fork}
              </span>
            )}
            <ArrowUpRight className="size-5 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
          </span>
        </div>

        <h3 className="font-display relative mt-8 text-[30px] leading-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 sm:text-[36px]">
          {repo.name}
        </h3>

        <p className="relative mt-3 max-w-[42ch] text-pretty text-[15px] leading-[1.7] text-muted">
          {repo.description ?? t.repo.noDescription}
        </p>

        <div className="relative mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-8 text-[13px] text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: accent }} />
            {repo.language ?? t.repo.noLanguage}
          </span>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <Star className="size-3.5" /> {repo.stars}
          </span>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <GitFork className="size-3.5" /> {repo.forks}
          </span>
          <span className={cx('ml-auto text-faint tabular-nums')}>{timeAgo(repo.pushedAt, locale)}</span>
        </div>

        {repo.homepage && (
          <span
            onClick={(event) => {
              event.preventDefault()
              window.open(repo.homepage!, '_blank', 'noopener')
            }}
            className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-bg/60 px-3 py-1.5 text-[12.5px] text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg"
          >
            <ExternalLink className="size-3.5" /> {t.repo.demo}
          </span>
        )}
      </motion.a>
    </motion.div>
  )
}
