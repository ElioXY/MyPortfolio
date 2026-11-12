// Todo lo que no viene de GitHub vive aquí. El texto está en dos idiomas:
// el sitio elige uno según el navegador y deja cambiarlo desde el nav.

export const site = {
  name: 'Elio',
  handle: 'ElioXY',
  // Destino del formulario de contacto y del botón de email.
  email: 'hello@elioxy.us.ci',
  available: true,
  stack: ['TypeScript', 'React', 'Vite', 'Node.js', 'Tailwind CSS', 'Cloudflare', 'Git'],
  copy: {
    es: {
      role: 'Desarrollador y estudiante',
      intro:
        'Construyo apps web donde la interfaz importa tanto como el código. Estudio, experimento y publico lo que aprendo en GitHub; esta página lee esos repositorios directamente.',
      about: [
        'Empecé con pequeños bots y páginas estáticas, y acabé escribiendo TypeScript a diario. Me interesan las herramientas que quitan fricción: tomar apuntes, organizar ideas, automatizar lo repetitivo.',
        'Trabajo sobre todo con React, Vite y Cloudflare, y cuido los detalles pequeños que hacen que una app se sienta terminada: el estado vacío, el foco del teclado, la animación que dura lo justo.',
      ],
      marquee: ['TypeScript', 'React', 'Vite', 'Cloudflare', 'Node.js', 'UI', 'Automatización', 'APIs'],
    },
    en: {
      role: 'Developer and student',
      intro:
        'I build web apps where the interface matters as much as the code. I study, experiment and publish what I learn on GitHub; this page reads those repositories directly.',
      about: [
        'I started with small bots and static pages, and ended up writing TypeScript every day. I’m drawn to tools that remove friction: taking notes, organising ideas, automating the repetitive parts.',
        'I work mostly with React, Vite and Cloudflare, and I care about the small details that make an app feel finished: the empty state, the keyboard focus, the animation that lasts just long enough.',
      ],
      marquee: ['TypeScript', 'React', 'Vite', 'Cloudflare', 'Node.js', 'UI', 'Automation', 'APIs'],
    },
  },
}

/**
 * Copia de respaldo: se muestra mientras llega la respuesta del Worker y si
 * GitHub está caído o sin cuota de peticiones. No hace falta mantenerla al día,
 * pero así la página nunca se queda vacía.
 */
export const fallbackFeed = {
  profile: {
    login: 'ElioXY',
    name: 'Elio',
    bio: null,
    avatar: 'https://avatars.githubusercontent.com/u/129208147?v=4',
    url: 'https://github.com/ElioXY',
    blog: null,
    location: null,
    followers: 0,
    following: 0,
    publicRepos: 3,
    memberSince: '2023-03-28T16:44:31Z',
  },
  repos: [
    {
      name: 'MindMesh',
      url: 'https://github.com/ElioXY/MindMesh',
      description: 'App de notas visuales y mapas mentales para estudiantes como yo.',
      homepage: 'https://mindmesh.elio.hackclub.app',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      topics: [],
      pushedAt: '2026-10-31T13:11:25Z',
      createdAt: '2026-10-09T17:35:26Z',
      fork: false,
      archived: false,
    },
    {
      name: 'my-bot',
      url: 'https://github.com/ElioXY/my-bot',
      description: 'Un bot de Slack para automatizar tareas del día a día.',
      homepage: null,
      language: 'JavaScript',
      stars: 0,
      forks: 0,
      topics: [],
      pushedAt: '2026-10-07T15:23:41Z',
      createdAt: '2026-10-03T10:43:31Z',
      fork: false,
      archived: false,
    },
    {
      name: 'soulseek-addon',
      url: 'https://github.com/ElioXY/soulseek-addon',
      description: 'Addon para SoulSeek.',
      homepage: null,
      language: 'JavaScript',
      stars: 0,
      forks: 0,
      topics: [],
      pushedAt: '2026-10-29T17:13:26Z',
      createdAt: '2026-10-28T17:43:43Z',
      fork: true,
      archived: false,
    },
  ],
  syncedAt: new Date('2026-10-31T13:11:25Z').toISOString(),
}
