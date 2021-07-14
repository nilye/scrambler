const { resolve } = require('path')
const dts = require('rollup-plugin-dts').default

module.exports = function (pkgPath, outputPath){

	const inputConfig = {
		input: resolve(outputPath, 'types/index.d.ts'),
		plugins: [dts()]
	}

	const outputConfig = {
		file: resolve(outputPath, `index.d.ts`),
		format: 'es'
	}

	return {
		inputConfig,
		outputConfig
	}
}
