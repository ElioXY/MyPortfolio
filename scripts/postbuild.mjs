// Strips files the Sites uploader refuses (hidden files and source maps)
// from the build output, so `deploy.json` can point straight at dist/.
import { readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist', import.meta.url))

function clean(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (name.startsWith('.') || name.endsWith('.map')) {
      rmSync(path, { recursive: true, force: true })
      continue
    }
    if (statSync(path).isDirectory()) clean(path)
  }
}

clean(root)

// El bundle apunta a un mapa que se acaba de borrar. Sin quitar el comentario,
// Wrangler aborta el deploy con "Invalid source map path".
const bundle = join(root, 'portfolio', 'index.js')
try {
  const code = readFileSync(bundle, 'utf8')
  const stripped = code.replace(/\/\/# sourceMappingURL=\S+\s*$/, '')
  if (stripped !== code) writeFileSync(bundle, stripped)
} catch {
  // Sin bundle (build parcial) no hay nada que limpiar.
}
