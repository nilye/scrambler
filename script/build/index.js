const esbuild = require('esbuild')
const path = require('path')

function build(mode = 'dev'){

	const options = {
		entryPoints: ['src/index.ts'],
		bundle: true,
		target: 'es2016',
		platform: 'browser',
		format: 'esm',
		outfile: 'dist/index.esm.js'
	}

	if (mode === 'dev'){
		process.env.NODE_ENV = 'development'
		const devOptions = {
			format: 'iife',
			globalName: 'Shuffle',
			outfile: 'dist/index.browser.js',
			watch: true
		}
		Object.assign(options, devOptions)
	}

	esbuild.build(options).then(() => {
		console.log('DONE!!')
	}, err => {
		console.log(err.stack)
	})
}

build(process.argv.slice(2)[0])
