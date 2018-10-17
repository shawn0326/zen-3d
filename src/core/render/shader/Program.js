import {MATERIAL_TYPE, TEXEL_ENCODING_TYPE, SHADOW_TYPE, SHADING_TYPE, FOG_TYPE, DRAW_SIDE, OBJECT_TYPE} from '../../const.js';
import {WebGLProgram} from '../WebGL/WebGLProgram.js';
import {ShaderChunk} from '../shader/ShaderChunk.js';
import {ShaderLib} from '../shader/ShaderLib.js';

var programMap = {};

// generate program code
function generateProgramCode(props, material) {
    var code = "";
    for (var key in props) {
        code += props[key] + "_";
    }
    if(material.defines !== undefined) {
        for (var name in material.defines) {
            code += name + "_" + material.defines[ name ] + "_";
        }
    }
    return code;
}

function getTextureEncodingFromMap( map, gammaOverrideLinear ) {

    var encoding;

    if ( ! map ) {

        encoding = TEXEL_ENCODING_TYPE.LINEAR;

    } else if ( map.encoding ) {

        encoding = map.encoding;

    }

    // add backwards compatibility for Renderer.gammaInput/gammaOutput parameter, should probably be removed at some point.
    if ( encoding === TEXEL_ENCODING_TYPE.LINEAR && gammaOverrideLinear ) {

        encoding = TEXEL_ENCODING_TYPE.GAMMA;

    }

    return encoding;

}

function getEncodingComponents( encoding ) {

    switch ( encoding ) {

        case TEXEL_ENCODING_TYPE.LINEAR:
            return [ 'Linear','( value )' ];
        case TEXEL_ENCODING_TYPE.SRGB:
            return [ 'sRGB','( value )' ];
        case TEXEL_ENCODING_TYPE.RGBE:
            return [ 'RGBE','( value )' ];
        case TEXEL_ENCODING_TYPE.RGBM7:
            return [ 'RGBM','( value, 7.0 )' ];
        case TEXEL_ENCODING_TYPE.RGBM16:
            return [ 'RGBM','( value, 16.0 )' ];
        case TEXEL_ENCODING_TYPE.RGBD:
            return [ 'RGBD','( value, 256.0 )' ];
        case TEXEL_ENCODING_TYPE.GAMMA:
            return [ 'Gamma','( value, float( GAMMA_FACTOR ) )' ];
        default:
                console.error( 'unsupported encoding: ' + encoding );

    }

}

function getTexelDecodingFunction( functionName, encoding ) {

    var components = getEncodingComponents( encoding );
    return "vec4 " + functionName + "( vec4 value ) { return " + components[ 0 ] + "ToLinear" + components[ 1 ] + "; }";

}

function getTexelEncodingFunction( functionName, encoding ) {

    var components = getEncodingComponents( encoding );
    return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[ 0 ] + components[ 1 ] + "; }";

}

function generateDefines( defines ) {

    var chunks = [];

    for ( var name in defines ) {

        var value = defines[ name ];

        if ( value === false ) continue;

        chunks.push( '#define ' + name + ' ' + value );

    }

    return chunks.join( '\n' );

}

// create program
function createProgram(gl, props, defines) {

    // create defines
    var prefixVertex = [

        'precision ' + props.precision + ' float;',
        'precision ' + props.precision + ' int;',
        // depth texture may have precision problem on iOS device.
        'precision ' + props.precision + ' sampler2D;',

        '#define SHADER_NAME ' + props.materialType,

        defines,

        props.useRoughnessMap ? '#define USE_ROUGHNESSMAP' : '',
        props.useMetalnessMap ? '#define USE_METALNESSMAP' : '',

        (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '',
        props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '',
        props.useShadow ? '#define USE_SHADOW' : '',
        props.flatShading ? '#define FLAT_SHADED' : '',
        props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
        props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '',
        props.materialType == MATERIAL_TYPE.PBR ? '#define USE_PBR' : '',
        props.flipSided ? '#define FLIP_SIDED' : '',

        props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
        props.useEnvMap ? '#define USE_ENV_MAP' : '',
        props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',
        props.useAOMap ? '#define USE_AOMAP' : '',
        props.useVertexColors ? '#define USE_VCOLOR' : '',

        props.useSkinning ? '#define USE_SKINNING' : '',
        (props.bonesNum > 0) ? ('#define MAX_BONES ' + props.bonesNum) : '',
        props.useVertexTexture ? '#define BONE_TEXTURE' : ''
        
    ].join("\n");

    var prefixFragment = [

        // use dfdx and dfdy must enable OES_standard_derivatives
        (props.useStandardDerivatives && props.version < 2) ? '#extension GL_OES_standard_derivatives : enable' : '',
        (props.useShaderTextureLOD && props.version < 2) ? '#extension GL_EXT_shader_texture_lod : enable' : '',

        'precision ' + props.precision + ' float;',
        'precision ' + props.precision + ' int;',
        // depth texture may have precision problem on iOS device.
        'precision ' + props.precision + ' sampler2D;',

        '#define SHADER_NAME ' + props.materialType,
        
        '#define PI 3.14159265359',
        '#define EPSILON 1e-6',
        'float pow2( const in float x ) { return x*x; }',
        '#define LOG2 1.442695',
        '#define RECIPROCAL_PI 0.31830988618',
        '#define saturate(a) clamp( a, 0.0, 1.0 )',
        '#define whiteCompliment(a) ( 1.0 - saturate( a ) )',

        defines,

        props.useRoughnessMap ? '#define USE_ROUGHNESSMAP' : '',
        props.useMetalnessMap ? '#define USE_METALNESSMAP' : '',

        (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '',
        props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '',
        props.useShadow ? '#define USE_SHADOW' : '',
        props.usePCFSoftShadow ? '#define USE_PCF_SOFT_SHADOW' : '',
        props.flatShading ? '#define FLAT_SHADED' : '',
        props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
        props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '',
        props.materialType == MATERIAL_TYPE.PBR ? '#define USE_PBR' : '',
        props.doubleSided ? '#define DOUBLE_SIDED' : '',
        props.useShaderTextureLOD ? '#define TEXTURE_LOD_EXT' : '',

        props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
        props.useEnvMap ? '#define USE_ENV_MAP' : '',
        props.useAOMap ? '#define USE_AOMAP' : '',
        props.useVertexColors ? '#define USE_VCOLOR' : '',
        props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
        props.fog ? '#define USE_FOG' : '',
        props.fogExp2 ? '#define USE_EXP2_FOG' : '',
        props.alphaTest ? ('#define ALPHATEST ' + props.alphaTest) : '',
        props.useEnvMap ? '#define ' + props.envMapCombine : '',
        '#define GAMMA_FACTOR ' + props.gammaFactor,

        (props.diffuseMapEncoding || props.envMapEncoding || props.emissiveMapEncoding || props.outputEncoding) ? ShaderChunk["encodings_pars_frag"] : '',
        props.diffuseMapEncoding ? getTexelDecodingFunction("mapTexelToLinear", props.diffuseMapEncoding) : '',
        props.envMapEncoding ? getTexelDecodingFunction("envMapTexelToLinear", props.envMapEncoding) : '',
        props.emissiveMapEncoding ? getTexelDecodingFunction("emissiveMapTexelToLinear", props.emissiveMapEncoding) : '',
        props.outputEncoding ? getTexelEncodingFunction("linearToOutputTexel", props.outputEncoding) : '',

        props.packDepthToRGBA ? '#define DEPTH_PACKING_RGBA' : '',

    ].join("\n");

    // vertexCode & fragmentCode
    var vertex = ShaderLib[props.materialType + "_vert"] || props.vertexShader || ShaderLib.basic_vert;
    var fragment = ShaderLib[props.materialType + "_frag"] || props.fragmentShader || ShaderLib.basic_frag;

    var vshader = [
        prefixVertex,
        vertex
    ].join("\n");

    var fshader = [
        prefixFragment,
        fragment
    ].join("\n");

    vshader = parseIncludes(vshader);
    fshader = parseIncludes(fshader);

    vshader = replaceLightNums(vshader, props);
    fshader = replaceLightNums(fshader, props);

    vshader = replaceClippingPlaneNums(vshader, props);
    fshader = replaceClippingPlaneNums(fshader, props);

    vshader = unrollLoops(vshader);
    fshader = unrollLoops(fshader);

    // support glsl version 300 es for webgl ^2.0
    if (props.version > 1) {

        fshader = fshader.replace("#extension GL_EXT_draw_buffers : require", "");

        // replace gl_FragData by layout
        var i = 0;
        var layout = [];
        while ( fshader.indexOf("gl_FragData[" + i + "]") > -1 ) {
            fshader = fshader.replace("gl_FragData[" + i + "]", "pc_fragData" + i);
            layout.push("layout(location = " + i + ") out vec4 pc_fragData" + i + ";");
            i++;
        }
        fshader = fshader.replace(
            '#define whiteCompliment(a) ( 1.0 - saturate( a ) )',
            '#define whiteCompliment(a) ( 1.0 - saturate( a ) )' + '\n' + layout.join( '\n' ) + '\n'
        );

        vshader = [
            '#version 300 es\n',
			'#define attribute in',
			'#define varying out',
			'#define texture2D texture'
        ].join( '\n' ) + '\n' + vshader;

        fshader = [
            '#version 300 es\n',
			'#define varying in',
			fshader.indexOf("layout") > -1 ? '': 'out highp vec4 pc_fragColor;',
			'#define gl_FragColor pc_fragColor',
			'#define gl_FragDepthEXT gl_FragDepth',
			'#define texture2D texture',
			'#define textureCube texture',
			'#define texture2DProj textureProj',
			'#define texture2DLodEXT textureLod',
			'#define texture2DProjLodEXT textureProjLod',
			'#define textureCubeLodEXT textureLod',
			'#define texture2DGradEXT textureGrad',
			'#define texture2DProjGradEXT textureProjGrad',
			'#define textureCubeGradEXT textureGrad'
        ].join( '\n' ) + '\n' + fshader;
    }

    return new WebGLProgram(gl, vshader, fshader);
}

var parseIncludes = function(string) {

    var pattern = /#include +<([\w\d.]+)>/g;

    function replace(match, include) {

        var replace = ShaderChunk[include];

        if (replace === undefined) {

            throw new Error('Can not resolve #include <' + include + '>');

        }

        return parseIncludes(replace);

    }

    return string.replace(pattern, replace);

}

function replaceLightNums( string, parameters ) {

	return string
		.replace( /NUM_DIR_LIGHTS/g, parameters.directLightNum )
		.replace( /NUM_SPOT_LIGHTS/g, parameters.spotLightNum )
		.replace( /NUM_POINT_LIGHTS/g, parameters.pointLightNum );

}

function replaceClippingPlaneNums( string, parameters ) {

	return string
		.replace( /NUM_CLIPPING_PLANES/g, parameters.numClippingPlanes );

}

function unrollLoops( string ) {

	var pattern = /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;

	function replace( match, start, end, snippet ) {

		var unroll = '';

		for ( var i = parseInt( start ); i < parseInt( end ); i ++ ) {

			unroll += snippet.replace( /\[ i \]/g, '[ ' + i + ' ]' );

		}

		return unroll;

	}

	return string.replace( pattern, replace );

}

function generateProps(glCore, camera, material, object, lights, fog, clippingPlanes) {
    var props = {}; // cache this props?

    props.materialType = material.type;
    // capabilities
    var capabilities = glCore.capabilities;
    props.version = capabilities.version;
    props.precision = capabilities.maxPrecision;
    props.useStandardDerivatives = capabilities.version >= 2 || !!capabilities.getExtension('OES_standard_derivatives') || !!capabilities.getExtension('GL_OES_standard_derivatives');
    props.useShaderTextureLOD =  capabilities.version >= 2 || !!capabilities.getExtension('EXT_shader_texture_lod');
    // maps
    props.useDiffuseMap = !!material.diffuseMap;
    props.useNormalMap = !!material.normalMap;
    props.useBumpMap = !!material.bumpMap;
    props.useSpecularMap = !!material.specularMap;
    props.useEnvMap = !!material.envMap;
    props.envMapCombine = material.envMapCombine;
    props.useEmissiveMap = !!material.emissiveMap;
    props.useRoughnessMap = !!material.roughnessMap;
    props.useMetalnessMap = !!material.metalnessMap;
    props.useAOMap = !!material.aoMap;
    // lights
    props.ambientLightNum = !!lights ? lights.ambientsNum : 0;
    props.directLightNum = !!lights ? lights.directsNum : 0;
    props.pointLightNum = !!lights ? lights.pointsNum : 0;
    props.spotLightNum = !!lights ? lights.spotsNum : 0;
    props.useShadow = object.receiveShadow;
    props.usePCFSoftShadow = object.shadowType === SHADOW_TYPE.PCF_SOFT;
    // encoding
    var currentRenderTarget = glCore.state.currentRenderTarget;
    props.gammaFactor = camera.gammaFactor;
    props.outputEncoding = getTextureEncodingFromMap(currentRenderTarget.texture || null, camera.gammaOutput);
    props.diffuseMapEncoding = getTextureEncodingFromMap(material.diffuseMap, camera.gammaInput);
    props.envMapEncoding = getTextureEncodingFromMap(material.envMap, camera.gammaInput);
    props.emissiveMapEncoding = getTextureEncodingFromMap(material.emissiveMap, camera.gammaInput);
    // other
    props.alphaTest = material.alphaTest;
    props.premultipliedAlpha = material.premultipliedAlpha;
    props.useVertexColors = material.vertexColors;
    props.numClippingPlanes = !!clippingPlanes ? clippingPlanes.length : 0;
    props.flatShading = material.shading === SHADING_TYPE.FLAT_SHADING;
    props.fog = !!fog;
    props.fogExp2 = !!fog && (fog.fogType === FOG_TYPE.EXP2);
    props.sizeAttenuation = material.sizeAttenuation;
    props.doubleSided = material.side === DRAW_SIDE.DOUBLE;
    props.flipSided = material.side === DRAW_SIDE.BACK;
    props.packDepthToRGBA = material.packToRGBA;
    // skinned mesh
    var useSkinning = object.type === OBJECT_TYPE.SKINNED_MESH && object.skeleton;
    var maxVertexUniformVectors = capabilities.maxVertexUniformVectors;
    var useVertexTexture = capabilities.maxVertexTextures > 0 && ( !!capabilities.getExtension('OES_texture_float') || capabilities.version >= 2 );
    var maxBones = 0;
    if(useVertexTexture) {
        maxBones = 1024;
    } else {
        maxBones = object.skeleton ? object.skeleton.bones.length : 0;
        if(maxBones * 16 > maxVertexUniformVectors) {
            console.warn("Program: too many bones (" + maxBones + "), current cpu only support " + Math.floor(maxVertexUniformVectors / 16) + " bones!!");
            maxBones = Math.floor(maxVertexUniformVectors / 16);
        }
    }
    props.useSkinning = useSkinning;
    props.bonesNum = maxBones;
    props.useVertexTexture = useVertexTexture;
    if(material.type === MATERIAL_TYPE.SHADER) {
        props.vertexShader = material.vertexShader;
        props.fragmentShader = material.fragmentShader;
    }

    return props;
}

/**
 * get a suitable program
 * @param {WebGLCore} glCore
 * @param {Camera} camera
 * @param {Material} material
 * @param {Object3D} object?
 * @param {RenderCache} cache?
 * @ignore
 */
function getProgram(glCore, camera, material, object, cache) {
    var gl = glCore.gl;
    var material = material || object.material;

    // get render context from cache
    var lights = (cache && material.acceptLight) ? cache.lights : null;
    var fog = cache ? cache.fog : null;
    var clippingPlanes = cache ? cache.clippingPlanes : null;

    var props = generateProps(glCore, camera, material, object, lights, fog, clippingPlanes);
    var code = generateProgramCode(props, material);
    var map = programMap;
    var program;

    if (map[code]) {
        program = map[code];
    } else {
        var customDefines = "";
        if(material.defines !== undefined) {
            customDefines = generateDefines(material.defines);
        }
        program = createProgram(gl, props, customDefines);

        map[code] = program;
    }

    return program;
}

export {getProgram};