#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { exit } from 'node:process'

const isWindows = process.platform === 'win32'
const npmCmd = isWindows ? 'npm.cmd' : 'npm'

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  })
  return result
}

function runCapture(cmd, args) {
  return spawnSync(cmd, args, { encoding: 'utf-8' })
}

if (!existsSync('package.json')) {
  console.error(
    'Arquivo package.json nao encontrado. Certifique-se de estar no diretorio do projeto.'
  )
  exit(1)
}

if (!existsSync('node_modules')) {
  console.log(
    'Diretorio node_modules nao encontrado. Instalando as dependencias...'
  )
  run(npmCmd, ['install'])
}

const pm = existsSync('pnpm-lock.yaml')
  ? 'pnpm'
  : existsSync('package-lock.json')
    ? 'npm'
    : 'pnpm'

console.log(`Verificando dependencias desatualizadas (${pm})`)
run(pm, ['outdated'])

console.log(`Atualizando as dependencias (${pm})`)
run(pm, ['update'])

console.log('Verificando se houve atualizacoes')
const outdated = runCapture(pm, ['outdated', '--json'])
const updated = runCapture(pm, ['outdated'])

if (outdated.stdout !== updated.stdout && outdated.stdout) {
  console.log('Realizando commit das atualizacoes')
  const lockFile = pm === 'pnpm' ? 'pnpm-lock.yaml' : 'package-lock.json'
  run('git', ['add', 'package.json', lockFile])
  run('git', ['commit', '-m', 'chore(deps): update outdated dependencies'])
}

console.log('Dependencias atualizadas:')
console.log(execSync(`${pm} outdated || true`, { encoding: 'utf-8' }))
