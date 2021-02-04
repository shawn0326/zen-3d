import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const babelrc = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: '>0.3%, not dead',
				loose: true,
				bugfixes: true,
			},
		],
	]
};

function glsl() {
	return {
		transform(code, id) {
			if (/\.glsl$/.test(id) === false) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.trim()
					.replace( /\r/g, '' )
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

function babelCleanup() {
	const doubleSpaces = / {2}/g;
	return {
		transform(code) {
			code = code.replace(doubleSpaces, '\t');
			return {
				code: code,
				map: null
			};
		}
	};
}

function header() {
	return {
		renderChunk( code ) {
			return '// github.com/shawn0326/zen-3d\n' + code;
		}
	};
}

export default [
	{
		input: 'src/core/main.js',
		plugins: [
			glsl(),
			babel({
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			}),
			babelCleanup(),
			header()
		],
		output: [
			{
				format: 'umd',
				name: 'zen3d',
				file: 'build/zen3d.js',
				indent: '\t'
			}
		]
	},
	{
		input: 'src/core/main.js',
		plugins: [
			glsl(),
			babel({
				babelHelpers: 'bundled',
				babelrc: false,
				...babelrc
			}),
			babelCleanup(),
			terser(),
			header()
		],
		output: [
			{
				format: 'umd',
				name: 'zen3d',
				file: 'build/zen3d.min.js'
			}
		]
	},
	{
		input: 'src/core/main.js',
		plugins: [
			glsl(),
			header()
		],
		output: [
			{
				format: 'esm',
				file: 'build/zen3d.module.js'
			}
		]
	}
];