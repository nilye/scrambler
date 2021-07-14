const path = require('path')
const fs = require('fs')
const rollup = require('rollup')
const [mode = 'dev', pkg] = process.argv.slice(2)
const createRollupConfig = require('./rollup.config')
const createDtsConfig = require('./rollup.dts')

const packagesPath = path.resolve(__dirname, '../../packages')


async function run(){

	const pkgPath = path.resolve(packagesPath, pkg)
	const outputPath = path.resolve(pkgPath, 'lib')
	const { inputConfig, outputConfig } = createRollupConfig(pkgPath, outputPath)
	const dtsConfig = createDtsConfig(pkgPath, outputPath)

	fs.rmdirSync(outputPath, { recursive: true })

	if (mode === 'prod') {

		const bundle = await rollup.rollup(inputConfig)
		for (let output of outputConfig){
			try {
				await bundle.write(output)
			} catch (e){
				console.error(e.stack)
			}
		}
		await bundle.close()

		// dts bundle
		const dtsBundle = await rollup.rollup(dtsConfig.inputConfig)
		await dtsBundle.write(dtsConfig.outputConfig)
		await bundle.close()
		fs.rmdirSync( path.resolve(pkgPath, 'lib/types'), { recursive: true })

	} else {

		const watchConfig = {
			...inputConfig,
			output: outputConfig,
			watch: {
				exclude: 'node_modules/**'
			}
		}

		const watchDtsConfig = {
			...dtsConfig.inputConfig,
			output: dtsConfig.outputConfig
		}

		const watcher = rollup.watch([watchConfig, watchDtsConfig])
		watcher.on('event', event => {
			// console.log(event)
			if (event.code === 'START'){
				console.log('Start: ' + pkg)
			}
			if (event.code === 'BUNDLE_END'){
				console.log('Bundled: \n' + event.output.map(p => path.relative(pkgPath, p)).join('\n'))
			}
			if (event.code === 'ERROR'){
				console.error(event.error.stack)
			}
		})

	}
}

run().then()
