const { build } = require('esbuild')
const { resolve } = require('path')

module.exports = function runDevBuild(pkgPath){
	const options = {
		entryPoints: [resolve(pkgPath, 'src/index.ts')],
		bundle: true,
		target: 'es2016',
		format: 'iife',
		globalName: 'createTextScrambler',
		outfile: resolve(pkgPath, 'lib/index.browser.js'),
		incremental: true,
		watch: {
			onRebuild(error, result){
				console.log('Rebuild succeeded at ' + new Date().toString())
			}
		}
	}

	build(options).then(() => {
		console.log('Watching...')
	}, err => {
		console.log(err.stack)
	})
}
