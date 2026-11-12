# Portafolio de Elio

Portafolio personal de una sola página (React + Vite + Tailwind) servido por un
Worker de Cloudflare con Hono. Los proyectos no están escritos a mano: la página
pide los repositorios a GitHub a través de `/api/github`, que los cachea 15
minutos en el edge y usa una copia local si GitHub no responde.

## Correr

```sh
bun install      # o npm install
bun run dev      # http://localhost:5173
bun run build    # dist/client (assets) + dist/portfolio/index.js (Worker)
bun run typecheck
```

## Dónde tocar

- `src/data/site.ts` — nombre, rol, textos ES/EN, herramientas, redes y la copia de
  respaldo de los repositorios.
- `src/app/pages/Home.tsx` — las secciones: inicio, proyectos y sobre mí.
- `src/styles.css` — colores de ambos temas, tipografía y animaciones.
- `wrangler.jsonc` — `GITHUB_USER`, la cuenta que se sincroniza.

## Contacto

El formulario del pie usa Web3Forms desde el navegador. Copia `.env.example` a
`.env` y pon tu clave:

```sh
VITE_WEB3FORMS_KEY=tu-clave
```

Sin clave, el formulario avisa y muestra el email directo.

## Opcional

Con mucho tráfico, un token de solo lectura evita el límite de GitHub:

```sh
npx wrangler secret put GITHUB_TOKEN
```

## Desplegar

`deploy.json` apunta al resultado del build; tras `bun run build`, despliega con
`sites_deploy` desde este directorio.
