import { useState } from 'react'

import { cx } from '../lib/cx'

/**
 * Avatar con red de seguridad: primero el proxy del propio dominio (la CSP del
 * sitio solo permite imágenes de `'self'` y `data:`, así que el CDN de GitHub
 * no se puede cargar directamente), después la URL recibida de GitHub y, si
 * nada funciona, la inicial sobre el degradado de la marca.
 */
export function ProfileImage({
  src,
  login,
  name,
  alt,
  className,
  letterClassName,
}: {
  src: string
  login: string
  name: string
  alt?: string
  className?: string
  letterClassName?: string
}) {
  const sources = [
    `/api/avatar?user=${encodeURIComponent(login)}`,
    src,
    `https://github.com/${login}.png?size=400`,
  ].filter(Boolean)
  const [index, setIndex] = useState(0)

  if (index >= sources.length) {
    return (
      <span
        role="img"
        aria-label={alt ?? name}
        className={cx('font-display grid place-items-center text-white', className, letterClassName)}
        style={{ backgroundImage: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))' }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      key={sources[index]}
      src={sources[index]}
      alt={alt ?? name}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setIndex((value) => value + 1)}
      className={className}
    />
  )
}
