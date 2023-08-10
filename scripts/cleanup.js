// This file is executed from npm script with project root as cwd.
import fs from 'node:fs'

fs.rmSync('dist/types', { recursive: true })

fs.renameSync('dist/npm-pkg-by-rollup.d.ts', 'dist/index.d.ts')