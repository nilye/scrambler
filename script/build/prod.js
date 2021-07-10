const { build } = require('esbuild')
const { resolve } = require('path')

module.exports = function runProdBuild(pkgPath){
	const base = {
		entryPoints: [resolve(pkgPath, 'src/index.ts')],
		bundle: true,
		target: 'es2016',
		loader: {
			'.ts': 'ts'
		}
	}

	const browser = {
		...base,
		format: 'iife',
		globalName: 'createTextScrambler',
		outfile: resolve(pkgPath, 'lib/index.browser.js'),
	}

	const esm = {
		...base,
		format: 'esm',
		outfile: resolve(pkgPath, 'lib/index.esm.js')
	}

	const config = [browser, esm]
	Promise.all(config.map(cfg => build(cfg))).then(res => {
		console.log('Build succeeded')
	}).catch(err => {
		console.log(err.stack)
	})
}
