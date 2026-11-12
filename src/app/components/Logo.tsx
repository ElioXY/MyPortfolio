import { useId } from 'react'

import { cx } from '../lib/cx'

/**
 * Marca del sitio: una baldosa redondeada con el degradado de acento y una «E»
 * trazada en trazos redondeados. Sustituye al punto suelto del nav y se repite
 * en el pie para que la identidad no dependa solo del texto.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const gradient = `logo-${id}`

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cx('shrink-0', className)}>
      <defs>
        <linearGradient id={gradient} x1="3" y1="1" x2="30" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-2)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9.5" fill={`url(#${gradient})`} />
      <rect
        x="1.7"
        y="1.7"
        width="28.6"
        height="28.6"
        rx="8.8"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.1"
      />
      <path
        d="M11.4 10.1h9.4M11.4 16h6.4M11.4 21.9h9.4"
        stroke="#ffffff"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Marca + nombre, para la cabecera. */
export function Logo({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="size-7" />
      <span className="font-display text-[17px]">{name}</span>
    </span>
  )
}
