import { motion, useInView, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Líneas de texto que suben desde detrás de una máscara, una tras otra. Se
 * observa el contenedor: una línea desplazada fuera de su máscara no tiene
 * área visible, así que observarla a ella nunca dispararía.
 */
export function Lines({
  lines,
  className,
  delay = 0,
  as: Tag = 'h1',
}: {
  lines: ReactNode[]
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'p'
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -5% 0px' })
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : { y: '110%' }}
            transition={{ duration: 1, delay: delay + i * 0.1, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Aparece al entrar en pantalla. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.97, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/** Un botón que se inclina hacia el puntero. */
export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={cx('inline-block', className)}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((event.clientX - rect.left - rect.width / 2) * strength)
        y.set((event.clientY - rect.top - rect.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
