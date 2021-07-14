const { resolve } = require('path')
const ts = require('rollup-plugin-typescript2')

module.exports = function (pkgPath, outputPath){
	const inputPath = resolve(pkgPath, 'src/index.ts')
	const pkgJsonPath = resolve(pkgPath, 'package.json')
	const pkgJson = require(pkgJsonPath)

	const buildOptions = pkgJson.buildOptions || {}
	const external = Object.keys(pkgJson.dependencies || {})

	const inputConfig = {
		external,
		input: inputPath,
		plugins: [
			ts({
				tsconfig: resolve(__dirname, '../../', 'tsconfig.json'),
				tsconfigOverride: {
					compilerOptions: {
						declaration: true,
						declarationDir:resolve(outputPath, 'types')
					},
					include: [
						resolve(pkgPath, 'src')
					]
				},
				useTsconfigDeclarationDir: true,
			}),
		]
	}

	const outputConfig = [
		{
			file: resolve(outputPath, `index.esm.js`),
			format: 'es'
		}
	]

	if (buildOptions.globalName){
		outputConfig.push({
			file: resolve(outputPath, `index.browser.js`),
			format: 'iife',
			name: buildOptions.globalName,
		})
	}

	return {
		inputConfig,
		outputConfig
	}
}
