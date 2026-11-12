import { AnimatePresence, motion } from 'motion/react'
import { Check, Loader2, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { site } from '../../data/site'
import { sendMessage } from '../lib/contact'
import { useI18n } from '../lib/i18n'
import { cx } from '../lib/cx'

type Status = 'idle' | 'sending' | 'sent'

const ease = [0.22, 1, 0.36, 1] as const

const field =
  'h-13 w-full rounded-[13px] border border-line bg-bg px-4 text-[15px] placeholder:text-faint transition-colors duration-300 focus:border-accent focus:outline-none'

export function ContactForm() {
  const { t } = useI18n()
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  // El email directo solo tiene sentido cuando falla el envío, no al validar.
  const [deliveryFailed, setDeliveryFailed] = useState(false)

  const validate = (): string | null => {
    if (form.name.trim().length < 2) return t.form.errorName
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return t.form.errorEmail
    if (form.message.trim().length < 10) return t.form.errorMessage
    return null
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const invalid = validate()
    if (invalid) {
      setError(invalid)
      setDeliveryFailed(false)
      return
    }

    setStatus('sending')
    setError('')
    setDeliveryFailed(false)

    const result = await sendMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      company: form.company,
    })

    if (result === 'sent') {
      setStatus('sent')
      return
    }

    setStatus('idle')
    setError(result === 'unconfigured' ? t.form.errorMissing : t.form.errorSend)
    setDeliveryFailed(true)
  }

  return (
    <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[22px]">{t.form.title}</h3>
        <a href={`mailto:${site.email}`} className="link-draw text-[12.5px] text-muted">
          {site.email}
        </a>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mt-6 flex flex-col items-start gap-3"
            role="status"
          >
            <span className="grid size-11 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
              <Check className="size-5" />
            </span>
            <p className="font-display text-[26px]">{t.form.sentTitle}</p>
            <p className="max-w-[36ch] text-[14.5px] leading-relaxed text-muted">{t.form.sentBody}</p>
            <button
              type="button"
              onClick={() => {
                setForm({ name: '', email: '', message: '', company: '' })
                setStatus('idle')
              }}
              className="mt-2 text-[13.5px] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-fg"
            >
              {t.form.another}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={submit}
            noValidate
            className="mt-6 flex flex-col gap-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] text-muted">{t.form.name}</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] text-muted">{t.form.email}</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className={field}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-muted">{t.form.message}</span>
              <textarea
                required
                name="message"
                rows={5}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className={cx(field, 'h-auto min-h-[132px] resize-y py-3 leading-relaxed')}
              />
            </label>

            {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Company
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  name="company"
                  value={form.company}
                  onChange={(event) => setForm({ ...form, company: event.target.value })}
                />
              </label>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex h-13 items-center gap-2 rounded-[13px] bg-fg px-5 text-[14.5px] font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-white disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                )}
                {status === 'sending' ? t.form.sending : t.form.send}
              </button>
              <p className="text-[12px] text-faint">{t.form.privacy}</p>
            </div>

            {error && (
              <p role="alert" className="mt-1 flex flex-wrap gap-1 text-[13px] text-accent">
                {error}
                {deliveryFailed && (
                  <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                    {site.email}
                  </a>
                )}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
