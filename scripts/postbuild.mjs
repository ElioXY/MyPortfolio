
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


const bundle = join(root, 'portfolio', 'index.js')
try {
  const code = readFileSync(bundle, 'utf8')
  const stripped = code.replace(/\/\/# sourceMappingURL=\S+\s*$/, '')
  if (stripped !== code) writeFileSync(bundle, stripped)
} catch {
  
}
