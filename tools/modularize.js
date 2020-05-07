/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

var fs = require('fs');
zen3d = require('../build/zen3d.js');

var srcFolder = __dirname + '/../examples/js/';
var dstFolder = __dirname + '/../examples/jsm/';

var files = [
	{ path: 'controls/FlyControls.js', dependencies: [], ignoreList: [] },
	{ path: 'controls/FreeControls.js', dependencies: [], ignoreList: [] },
	{ path: 'controls/OrbitControls.js', dependencies: [], ignoreList: [] },

	{ path: 'loaders/GLTFLoader.js', dependencies: [], ignoreList: ['TextureBase'] },
	{ path: 'loaders/AssimpJsonLoader.js', dependencies: [], ignoreList: [] },
	{ path: 'loaders/DRACOLoader.js', dependencies: [], ignoreList: ['LoadingManager'] },

	{ path: 'objects/DirectionalLightHelper.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/GridHelper.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/ParticleContainer.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/PointLightHelper.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/SkeletonHelper.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/Sky.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/SkyBox.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/SpotLightHelper.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/Sprite.js', dependencies: [], ignoreList: [] },
	{ path: 'objects/Water.js', dependencies: [], ignoreList: [] },

	{ path: 'pass/BlurPass.js', dependencies: [{ name: 'BlurShader', path: 'shaders/BlurShader.js' }], ignoreList: [] },
	{ path: 'pass/SSAOPass.js', dependencies: [{ name: 'SSAOShader', path: 'shaders/SSAOShader.js' }], ignoreList: [] },

	{ path: 'renderers/DeferredRenderer.js', dependencies: [], ignoreList: [] },

	{ path: 'shaders/BlendShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/BlurShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/ColorAdjustShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/CopyShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/DeferredShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/DepthLinearShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/FastGaussianBlurShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/FilmShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/FXAAShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/LineDashedShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/LuminosityHighPassShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/MotionBlurShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/ShadowShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/SketchShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/SSAOShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/SSRShader.js', dependencies: [], ignoreList: [] },
	{ path: 'shaders/VolumeShader.js', dependencies: [], ignoreList: [] },

	{ path: 'stereo/StereoCamera.js', dependencies: [], ignoreList: [] },
	{ path: 'stereo/StereoRenderer.js', dependencies: [], ignoreList: [] },
	{ path: 'stereo/WebVRControls.js', dependencies: [], ignoreList: [] },
	{ path: 'stereo/WebXRControls.js', dependencies: [], ignoreList: [] },

	{ path: 'Clock.js', dependencies: [], ignoreList: [] },
	{ path: 'GBuffer.js', dependencies: [], ignoreList: ['Camera'] },
	{ path: 'GeometryUtils.js', dependencies: [], ignoreList: ['Geoemtry'] },
	{ path: 'PMREM.js', dependencies: [], ignoreList: ['GLCore'] },
	{ path: 'SuperSampling.js', dependencies: [], ignoreList: ['Camera', 'TextureBase'] },
	{ path: 'VoxMeshBuilder.js', dependencies: [], ignoreList: ['Material', 'Texture2D'] },
];

for (var i = 0; i < files.length; i++) {
	var file = files[i];
	convert(file.path, file.dependencies, file.ignoreList);
}

//

function convert(path, exampleDependencies, ignoreList) {
	var contents = fs.readFileSync(srcFolder + path, 'utf8');

	var classNames = [];
	var coreDependencies = {};

	// imports

	contents = contents.replace(/^\/\*+[^*]*\*+(?:[^/*][^*]*\*+)*\//, function (match) {
		return `${match}\n\n_IMPORTS_`;
	});

	// class name

	contents = contents.replace(/zen3d\.([a-zA-Z0-9]+) = /g, function (match, p1) {
		classNames.push(p1);

		console.log(p1);

		return `var ${p1} = `;
	});

	contents = contents.replace(/(\'?)zen3d\.([a-zA-Z0-9]+)(\.{0,1})/g, function (match, p1, p2, p3) {
		if (p1 === '\'') return match; // Inside a string
		if (classNames.includes(p2)) return `${p2}${p3}`;

		return match;
	});

	// methods

	contents = contents.replace(/new zen3d\.([a-zA-Z0-9]+)\(/g, function (match, p1) {
		if (ignoreList.includes(p1)) return match;

		if (p1 in zen3d) coreDependencies[p1] = true;

		return `new ${p1}(`;
	});

	// constants

	contents = contents.replace(/(\'?)zen3d\.([a-zA-Z0-9_]+)/g, function (match, p1, p2) {
		if (ignoreList.includes(p2)) return match;
		if (p1 === '\'') return match; // Inside a string
		if (classNames.includes(p2)) return p2;

		if (p2 in zen3d) coreDependencies[p2] = true;

		// console.log( match, p2 );

		return `${p2}`;
	});

	//

	var keys = Object.keys(coreDependencies)
		.filter(value => !classNames.includes(value))
		.map(value => '\n\t' + value)
		.sort()
		.toString();

	var imports = '';

	// compute path prefix for imports/exports

	var level = path.split('/').length - 1;
	var pathPrefix = '../'.repeat(level);

	// core imports

	if (keys) imports += `import {${keys}\n} from "${pathPrefix}../../build/zen3d.module.js";`;

	// example imports

	for (var dependency of exampleDependencies) {
		imports += `\nimport { ${dependency.name} } from "${pathPrefix}${dependency.path}";`;
	}

	// exports

	var exports = `\nexport { ${classNames.join(", ")} };`;

	var output = contents.replace('_IMPORTS_', imports) + '\n' + exports;
	// console.log( output );

	fs.writeFileSync(dstFolder + path, output, 'utf-8');
}
