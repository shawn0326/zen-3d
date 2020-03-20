import buble from 'rollup-plugin-buble';

function glsl() {
	return {

		transform(code, id) {
			if (/\.glsl$/.test(id) === false) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.replace(/[ \t]*\/\/.*\n/g, '') // remove //
					.replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
					.replace(/\n{2,}/g, '\n') // # \n+ to \n
			) + ';';
			return {
				code: transformedCode,
				map: { mappings: '' }
			};
		}

	};
}

const INDENT = '\t';
const BANNER = '/* github.com/shawn0326/zen-3d */';

export default [
	{
		input: 'src/core/main.js',
		plugins: [
			glsl(),
			buble({
				transforms: {
					arrow: false,
					classes: true
				}
			})
		],
		output: [
			{
				format: 'umd',
				name: 'zen3d',
				file: 'build/zen3d.js',
				indent: INDENT,
				banner: BANNER
			}
		]
	},
	{
		input: 'src/core/main.js',
		plugins: [
			glsl()
		],
		// sourceMap: true,
		output: [
			{
				format: 'esm',
				file: 'build/zen3d.module.js',
				indent: INDENT,
				banner: BANNER
			}
		]
	}
];