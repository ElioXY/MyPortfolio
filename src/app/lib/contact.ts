/**
 * Envío del formulario de contacto con Web3Forms.
 *
 * Web3Forms entrega a un buzón sin verificar dominio ni remitente: se pide una
 * clave para `hello@elioxy.us.ci` y los mensajes llegan a esa bandeja. Su API
 * está pensada para llamarse desde el navegador (rechaza el envío desde servidor
 * con 403 y pide el plan Pro para autorizar IPs), así que la clave viaja en el
 * build. No es un secreto: solo puede enviar mensajes a ese buzón, y para eso
 * está el campo trampa. Cualquier otro dato del proyecto sigue en el Worker.
 *
 * La clave va en el código porque es pública (toda clave de Web3Forms lo es: el
 * navegador la envía en cada petición) y así el build de Cloudflare la tiene sin
 * depender de variables del panel, que se olvidan. `.env` con
 * `VITE_WEB3FORMS_KEY` la sustituye si algún día se rota.
 *
 * La CSP del dominio necesita `connect-src 'self' https://api.web3forms.com`;
 * sin eso el navegador bloquea la petición antes de salir.
 */
const PUBLIC_ACCESS_KEY = '7550287a-e7d0-40c6-b104-dc2607d08626'

const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() || PUBLIC_ACCESS_KEY

export const contactConfigured = Boolean(ACCESS_KEY)

export type ContactPayload = {
  name: string
  email: string
  message: string
  /** Campo trampa: si llega relleno, Web3Forms descarta el envío. */
  company?: string
}

export async function sendMessage(payload: ContactPayload): Promise<'sent' | 'unconfigured' | 'error'> {
  if (!ACCESS_KEY) return 'unconfigured'

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Mensaje de ${payload.name} · portafolio`,
        from_name: 'Portafolio de Elio',
        name: payload.name,
        email: payload.email,
        replyto: payload.email,
        message: payload.message,
        botcheck: Boolean(payload.company),
      }),
    })

    const data = (await response.json().catch(() => ({}))) as { success?: boolean }
    if (response.ok && data.success) return 'sent'
    return 'error'
  } catch {
    return 'error'
  }
}
