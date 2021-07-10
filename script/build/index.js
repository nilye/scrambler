const path = require('path')
const fs = require('fs')
const [mode = 'dev', pkg] = process.argv.slice(2)
const runDevBuild = require('./dev')
const runProdBuild = require('./prod')

const pkgRoot = path.resolve(__dirname, '../../packages', pkg)
if (fs.existsSync(pkgRoot)){
	if (mode === 'prod'){
		runProdBuild(pkgRoot)
	} else {
		runDevBuild(pkgRoot)
	}
}
