const {readdirSync, statSync} = require('fs')
const {join} = require('path')
const {spawnSync} = require('child_process')

const ignored = new Set(['node_modules', '.git'])
const files = []

const walk = (directory) => {
    for (const name of readdirSync(directory)) {
        if (ignored.has(name)) continue
        const path = join(directory, name)
        if (statSync(path).isDirectory()) walk(path)
        else if (path.endsWith('.js')) files.push(path)
    }
}

walk(process.cwd())
for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], {stdio: 'inherit'})
    if (result.status !== 0) process.exit(result.status || 1)
}

console.log(`Syntax check passed for ${files.length} JavaScript files.`)
