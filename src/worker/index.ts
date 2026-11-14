import { Hono } from 'hono'

type Env = {
  ASSETS: Fetcher
  GITHUB_USER?: string
  GITHUB_TOKEN?: string
}

type GithubRepo = {
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics?: string[]
  pushed_at: string
  created_at: string
  fork: boolean
  archived: boolean
}

type GithubUser = {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  blog: string | null
  location: string | null
  followers: number
  following: number
  public_repos: number
  created_at: string
}

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ ok: true }))

/**
 * Avatar del perfil, servido desde el propio dominio. La CSP del sitio solo
 * permite imágenes de `'self'` y `data:`, así que el navegador no puede pedir el
 * CDN de GitHub directamente: el Worker lo trae y lo cachea en el edge.
 */
app.get('/api/avatar', async (c) => {
  const user = (c.req.query('user') ?? c.env.GITHUB_USER ?? 'ElioXY').replace(/[^\w-]/g, '')
  if (!user) return c.json({ error: 'No GitHub user configured.' }, 400)

  const cache = await caches.open('avatar')
  const key = new Request(`https://avatar.internal/${user}`)
  const cached = await cache.match(key).catch(() => undefined)
  if (cached) return new Response(cached.body, cached)

  try {
    const upstream = await fetch(`https://github.com/${user}.png?size=400`, {
      headers: { 'user-agent': 'portfolio-site' },
      redirect: 'follow',
    })
    const type = upstream.headers.get('content-type') ?? ''
    if (!upstream.ok || !type.startsWith('image/')) {
      return c.json({ error: 'upstream_error', status: upstream.status }, 502)
    }

    const response = new Response(upstream.body, {
      headers: {
        'content-type': type,
        'cache-control': 'public, max-age=3600, s-maxage=86400',
      },
    })
    const cacheWrite = cache.put(key, response.clone())
    try {
      c.executionCtx.waitUntil(cacheWrite)
    } catch {
      // Sin executionCtx (por ejemplo en pruebas locales) se ignora.
    }
    return response
  } catch {
    return c.json({ error: 'upstream_error' }, 502)
  }
})

/**
 * Live GitHub feed. The browser never talks to api.github.com directly: the
 * Worker does it, caches the result at the edge for 15 minutes, and adds a
 * token when one is configured (Sites -> Secrets, name GITHUB_TOKEN) to lift
 * the 60 requests/hour anonymous limit.
 */
app.get('/api/github', async (c) => {
  const user = (c.req.query('user') ?? c.env.GITHUB_USER ?? 'ElioXY').replace(/[^\w-]/g, '')
  if (!user) return c.json({ error: 'No GitHub user configured.' }, 400)

  const cache = await caches.open('github-feed')
  const key = new Request(`https://github-feed.internal/${user}`)
  const cached = await cache.match(key).catch(() => undefined)
  if (cached) return new Response(cached.body, cached)

  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'portfolio-site',
  }
  if (c.env.GITHUB_TOKEN) headers.authorization = `Bearer ${c.env.GITHUB_TOKEN}`

  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&type=owner`, { headers }),
    ])

    if (profileResponse.status === 404) return c.json({ error: 'not_found', user }, 404)
    if (!profileResponse.ok || !reposResponse.ok) {
      const status = profileResponse.status === 200 ? reposResponse.status : profileResponse.status
      return c.json({ error: status === 403 || status === 429 ? 'rate_limited' : 'upstream_error', status }, 502)
    }

    const profile = (await profileResponse.json()) as GithubUser
    const repos = (await reposResponse.json()) as GithubRepo[]

    const body = {
      profile: {
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar_url,
        url: profile.html_url,
        blog: profile.blog || null,
        location: profile.location,
        followers: profile.followers,
        following: profile.following,
        publicRepos: profile.public_repos,
        memberSince: profile.created_at,
      },
      repos: repos.map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        homepage: repo.homepage || null,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics ?? [],
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at,
        fork: repo.fork,
        archived: repo.archived,
      })),
      syncedAt: new Date().toISOString(),
    }

    const response = new Response(JSON.stringify(body), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=900',
      },
    })
    const cacheWrite = cache.put(key, response.clone())
    try {
      c.executionCtx.waitUntil(cacheWrite)
    } catch {
      // Sin executionCtx (por ejemplo en pruebas locales) la escritura se ignora.
    }
    return response
  } catch {
    return c.json({ error: 'upstream_error' }, 502)
  }
})

/*
 * El formulario de contacto no pasa por el Worker: se envía desde el navegador
 * a Web3Forms (ver src/app/lib/contact.ts), que entrega en el buzón sin
 * verificar dominio ni remitente. Aquí solo se sirven los assets.
 */

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
