const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim()
export const contactConfigured = Boolean(ACCESS_KEY)
export type ContactPayoad = {
    name: string
    email: string
    message: string
    company?: string
}

export async function sendMessage(payload:ContactPayload): Promise<'sent' | 'unconfigured' | 'error'> {
    if (!ACCESS_KEY) return 'unconfigured'
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'content-type':'application/json'},
            body: JSON.stringify({
                access_key: ACCESS_KEY,
                subject: `Mensaje de ${payload.name} · portafolio`,
                from_name: 'Portafolio de Elio',
                name: payload.name,
                email: payload.email,
                replyto: payload.email,
                message: payload.message,
                bootcheck: Boolean(payload.company)
            }),
        })
        const data = (await response.json().catch(() => ({}))) as {success?: boolean}
        if (response.ok && data.success) return 'sent'
        return 'error'
    } catch {
        return 'error'
    }
    
}