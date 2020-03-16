import buble from 'rollup-plugin-buble';

const INDENT = '\t';
const BANNER = '/* github.com/shawn0326/zen-3d */';

export default [
	{
		input: 'src/extension/canvas2D/main.js',
		plugins: [
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
				file: 'build/zen3d.canvas2d.js',
				indent: INDENT,
				banner: BANNER,
				extend: true
			}
		]
	}
];