import { useEffect, useState } from 'react'

export interface Repo {
  name: string
  url: string
  description: string | null
  homepage: string | null
  language: string | null
  stars: number
  forks: number
  topics: string[]
  pushedAt: string
  createdAt: string
  fork: boolean
  archived: boolean
}

export interface Profile {
  login: string
  name: string | null
  bio: string | null
  avatar: string
  url: string
  blog: string | null
  location: string | null
  followers: number
  following: number
  publicRepos: number
  memberSince: string
}

export interface GithubFeed {
  profile: Profile
  repos: Repo[]
  syncedAt: string
}

export type FeedState =
  | { status: 'loading'; data: GithubFeed; error: null }
  | { status: 'live'; data: GithubFeed; error: null }
  | { status: 'cached'; data: GithubFeed; error: string }

export type Feed = FeedState & { refresh: () => void }


export function visibleRepos(repos: Repo[]): Repo[] {
  return repos
    .filter((repo) => !repo.archived)
    .sort((a, b) => Number(a.fork) - Number(b.fork) || Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
}

const API = 'https://api.github.com'
const API_HEADERS = { accept: 'application/vnd.github+json' }

type ApiUser = {
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

type ApiRepo = {
  name: string
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

/** Pide el perfil público a GitHub desde el navegador, sin credenciales. */
async function fetchDirect(login: string, signal: AbortSignal): Promise<GithubFeed> {
  const [profileResponse, reposResponse] = await Promise.all([
    fetch(`${API}/users/${login}`, { headers: API_HEADERS, signal }),
    fetch(`${API}/users/${login}/repos?per_page=100&sort=pushed&type=owner`, { headers: API_HEADERS, signal }),
  ])

  if (!profileResponse.ok || !reposResponse.ok) {
    const status = profileResponse.status === 200 ? reposResponse.status : profileResponse.status
    throw new Error(`GitHub respondió ${status}`)
  }

  const profile = (await profileResponse.json()) as ApiUser
  const repos = (await reposResponse.json()) as ApiRepo[]

  return {
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
}


export function useGithub(fallback: GithubFeed): Feed {
  const [state, setState] = useState<FeedState>({ status: 'loading', data: fallback, error: null })
  const [ticket, setTicket] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch('/api/github', { signal: controller.signal, headers: { accept: 'application/json' } })
        if (!response.ok) throw new Error(`GitHub respondió ${response.status}`)
        const data = (await response.json()) as GithubFeed
        if (!Array.isArray(data.repos)) throw new Error('Respuesta inesperada de GitHub')
        setState({ status: 'live', data, error: null })
        return
      } catch {
        if (controller.signal.aborted) return
      }

      try {
        const data = await fetchDirect(fallback.profile.login, controller.signal)
        setState({ status: 'live', data, error: null })
      } catch (error) {
        if (controller.signal.aborted) return
        setState({
          status: 'cached',
          data: fallback,
          error: error instanceof Error ? error.message : 'Sin conexión con GitHub',
        })
      }
    }

    void load()
    return () => controller.abort()
  }, [fallback, ticket])

  return { ...state, refresh: () => setTicket((value) => value + 1) }
}


export function timeAgo(iso: string, locale: string): string {
  const elapsed = Date.now() - Date.parse(iso)
  if (!Number.isFinite(elapsed)) return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day')

  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const minutes = Math.round(elapsed / 60_000)
  if (Math.abs(minutes) < 60) return relative.format(-minutes, 'minute')

  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return relative.format(-hours, 'hour')

  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return relative.format(-days, 'day')

  const months = Math.round(days / 30)
  if (Math.abs(months) < 12) return relative.format(-months, 'month')

  return relative.format(-Math.round(months / 12), 'year')
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#e3b700',
  HTML: '#e34c26',
  CSS: '#663399',
  SCSS: '#c6538c',
  Python: '#3572a5',
  Rust: '#dea584',
  Go: '#00add8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  Svelte: '#ff3e00',
  Vue: '#41b883',
  Astro: '#ff5a03',
  Lua: '#000080',
  Nix: '#7e7eff',
}

export function languageColor(language: string | null): string {
  if (!language) return '#8c8880'
  return languageColors[language] ?? '#8c8880'
}
