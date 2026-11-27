# Portafolio de Elio

Portafolio personal de una sola página (React + Vite + Tailwind) servido por un
Worker de Cloudflare con Hono. Los proyectos no están escritos a mano: la página
pide los repositorios a GitHub a través de `/api/github`, que los cachea 15
minutos en el edge y usa una copia local si GitHub no responde.

## Dónde tocar

- `src/data/site.ts` — nombre, rol, textos ES/EN, herramientas, redes y la copia de
  respaldo de los repositorios.
- `src/app/pages/Home.tsx` — las secciones: inicio, proyectos y sobre mí.
- `src/styles.css` — colores de ambos temas, tipografía y animaciones.
- `wrangler.jsonc` — `GITHUB_USER`, la cuenta que se sincroniza.

## Contacto

El formulario del pie envía desde el navegador a Web3Forms. Su clave es pública
(el navegador la manda en cada petición), así que vive en
`src/app/lib/contact.ts` para que todos los builds la tengan; con
`VITE_WEB3FORMS_KEY` en `.env` se puede rotar sin tocar el código. La CSP del
dominio necesita `connect-src 'self' https://api.web3forms.com` o el navegador
bloquea la petición. Si Web3Forms falla, el formulario muestra el email directo.

## Opcional

Con mucho tráfico, un token de solo lectura evita el límite de GitHub:

```sh
npx wrangler secret put GITHUB_TOKEN
```

## Desplegar

`deploy.json` apunta al resultado del build; tras `npm run build`, despliega con
`sites_deploy` desde este directorio.
