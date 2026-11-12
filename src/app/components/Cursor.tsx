import { useEffect, useRef, useState } from 'react'

type Mode = 'idle' | 'link' | 'text'

/**
 * Geometría de la flecha: el morro agudo es el punto más alto de la figura, en
 * (0, 0), y el cuerpo cae hacia abajo a la derecha, como un puntero de sistema,
 * con las dos esquinas traseras redondeadas. Como el morro es el origen, la caja
 * del SVG empieza justo en el puntero y crece hacia la derecha y hacia abajo.
 */
const ARROW = { w: 30, h: 30, tipX: 0, tipY: 0 }

/* T(0 0) morro · A(28 11) esquina derecha · B(9 29) esquina inferior,
   las dos suavizadas con curvas de 7 y 6 unidades. */
const SHAPE = 'M0 0 L21.4 8.5 Q28 11 23.3 16.2 L13.5 25 Q9 29 7.2 23.3 Z'

/**
 * Cursor propio: la flecha triangular del portafolio, blanca con contorno
 * oscuro y sombra suave, para que se lea igual sobre fondo claro y oscuro.
 * Sigue al puntero en el mismo frame, sin rastro.
 *
 * Sobre enlaces y botones se tiñe del color de acento y crece un poco; sobre
 * campos de texto se convierte en una barra de inserción. Solo se activa con
 * puntero fino; en táctil se conserva el cursor del sistema.
 */
export function Cursor() {
  const [active, setActive] = useState(false)
  const [mode, setMode] = useState<Mode>('idle')
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const point = useRef({ x: -100, y: -100 })
  const frame = useRef(0)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const sync = () => setActive(fine.matches)
    sync()
    fine.addEventListener('change', sync)
    return () => fine.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!active) return
    document.documentElement.dataset.cursor = 'on'
    return () => {
      delete document.documentElement.dataset.cursor
    }
  }, [active])

  useEffect(() => {
    if (!active) return

    const paint = () => {
      frame.current = 0
      const element = wrapper.current
      if (!element) return
      element.style.transform = `translate3d(${point.current.x}px, ${point.current.y}px, 0)`
    }

    const move = (event: PointerEvent) => {
      point.current = { x: event.clientX, y: event.clientY }
      if (!frame.current) frame.current = requestAnimationFrame(paint)
      setVisible(true)

      const target = event.target as Element | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        setMode('text')
        return
      }
      setMode(target?.closest('a, button, [role="button"], [data-hover]') ? 'link' : 'idle')
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    const hide = () => setVisible(false)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('blur', hide)
    document.addEventListener('pointerleave', hide)
    return () => {
      cancelAnimationFrame(frame.current)
      frame.current = 0
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('blur', hide)
      document.removeEventListener('pointerleave', hide)
    }
  }, [active])

  if (!active) return null

  const arrow = mode !== 'text'
  const scale = pressed ? 0.9 : mode === 'link' ? 1.08 : 1

  return (
    <div
      ref={wrapper}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 120ms linear',
        willChange: 'transform',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -ARROW.tipX,
          top: -ARROW.tipY,
          transformOrigin: `${ARROW.tipX}px ${ARROW.tipY}px`,
          transform: `scale(${scale})`,
          transition: 'transform 140ms cubic-bezier(0.22, 1, 0.36, 1)',
          filter: 'drop-shadow(0 2px 4px rgba(10, 12, 22, 0.3))',
        }}
      >
        <svg
          aria-hidden
          width={ARROW.w}
          height={ARROW.h}
          viewBox="0 0 30 30"
          fill="none"
          style={{ display: 'block', opacity: arrow ? 1 : 0, transition: 'opacity 100ms linear' }}
        >
          <path
            d={SHAPE}
            fill={mode === 'link' ? 'var(--color-accent)' : '#ffffff'}
            stroke="#0d0f16"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ transition: 'fill 140ms ease' }}
          />
        </svg>

        {/* Campo de texto: barra de inserción centrada en el puntero. */}
        <svg
          aria-hidden
          width="12"
          height="22"
          viewBox="0 0 12 22"
          fill="none"
          style={{
            position: 'absolute',
            left: ARROW.tipX - 6,
            top: ARROW.tipY - 11,
            opacity: arrow ? 0 : 1,
            transition: 'opacity 100ms linear',
          }}
        >
          <path
            d="M6 1.4 V20.6 M3 1.4 H9 M3 20.6 H9"
            stroke="#0d0f16"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
