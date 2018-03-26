(function() {

    var programMap = {};

    /**
     * generate program code
     */
    function generateProgramCode(props) {
        var code = "";
        for (var key in props) {
            code += props[key] + "_";
        }
        return code;
    }

    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var TEXEL_ENCODING_TYPE = zen3d.TEXEL_ENCODING_TYPE;
    var ENVMAP_COMBINE_TYPE = zen3d.ENVMAP_COMBINE_TYPE;

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

    /**
     * create program
     */
    function createProgram(gl, props, vertexCode, fragmentCode) {
        // vertexCode & fragmentCode
        var vertex = zen3d.ShaderLib[props.materialType + "_vert"] || props.vertexShader || zen3d.ShaderLib.basic_vert;
        var fragment = zen3d.ShaderLib[props.materialType + "_frag"] || props.fragmentShader || zen3d.ShaderLib.basic_frag;
        vertex = parseIncludes(vertex);
        fragment = parseIncludes(fragment);

        // create defines
        var vshader_define = [
            ''
        ],
        fshader_define = [
            '#define PI 3.14159265359',
            '#define EPSILON 1e-6',
            'float pow2( const in float x ) { return x*x; }',
            '#define LOG2 1.442695',
            '#define RECIPROCAL_PI 0.31830988618',
            '#define saturate(a) clamp( a, 0.0, 1.0 )',
            '#define whiteCompliment(a) ( 1.0 - saturate( a ) )'
        ];
        switch (props.materialType) {
            case MATERIAL_TYPE.CUBE:
            case MATERIAL_TYPE.CANVAS2D:
            case MATERIAL_TYPE.SPRITE:
            case MATERIAL_TYPE.PARTICLE:
            case MATERIAL_TYPE.SHADER:
                break;
            case MATERIAL_TYPE.LAMBERT:
            case MATERIAL_TYPE.PHONG:
            case MATERIAL_TYPE.PBR:
                fshader_define.push(props.useRoughnessMap ? '#define USE_ROUGHNESSMAP' : '');
                fshader_define.push(props.useMetalnessMap ? '#define USE_METALNESSMAP' : '');
            case MATERIAL_TYPE.POINT:
                vshader_define.push((props.pointLightNum > 0) ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '');
                vshader_define.push((props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '');
                vshader_define.push((props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '');
                vshader_define.push((props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '');
                vshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '');
                vshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '');
                vshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '');
                vshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '');
                vshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '');

                vshader_define.push(props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '');
                vshader_define.push(props.useShadow ? '#define USE_SHADOW' : '');

                vshader_define.push(props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '');
                vshader_define.push(props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '');
                vshader_define.push(props.materialType == MATERIAL_TYPE.PBR ? '#define USE_PBR' : '');

                vshader_define.push(props.flipSided ? '#define FLIP_SIDED' : '');

                vshader_define.push(props.numClippingPlanes > 0 ? ('#define NUM_CLIPPING_PLANES ' + props.numClippingPlanes) : '');

                fshader_define.push((props.pointLightNum) > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '');
                fshader_define.push((props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '');
                fshader_define.push((props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '');
                fshader_define.push((props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '');
                fshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '');
                fshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '');
                fshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '');
                fshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '');
                fshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '');

                fshader_define.push(props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '');
                fshader_define.push(props.useShadow ? '#define USE_SHADOW' : '');
                fshader_define.push(props.usePCFSoftShadow ? '#define USE_PCF_SOFT_SHADOW' : '');
                fshader_define.push(props.flatShading ? '#define FLAT_SHADED' : '');

                fshader_define.push(props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '');
                fshader_define.push(props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '');
                fshader_define.push(props.materialType == MATERIAL_TYPE.PBR ? '#define USE_PBR' : '');

                fshader_define.push(props.doubleSided ? '#define DOUBLE_SIDED' : '');

                fshader_define.push((props.envMap && props.useShaderTextureLOD) ? '#define TEXTURE_LOD_EXT' : '');

                fshader_define.push(props.numClippingPlanes > 0 ? ('#define NUM_CLIPPING_PLANES ' + props.numClippingPlanes) : '');
            case MATERIAL_TYPE.BASIC:
                vshader_define.push(props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '');
                vshader_define.push(props.useEnvMap ? '#define USE_ENV_MAP' : '');
                vshader_define.push(props.useVertexColors ? '#define USE_VCOLOR' : '');

                vshader_define.push(props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '');
                vshader_define.push(props.useAOMap ? '#define USE_AOMAP' : '');

                fshader_define.push(props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '');
                fshader_define.push(props.useEnvMap ? '#define USE_ENV_MAP' : '');
                fshader_define.push(props.useVertexColors ? '#define USE_VCOLOR' : '');
                if(props.useEnvMap) {
                    var define = "";
                    switch (props.envMapCombine) {
                        case ENVMAP_COMBINE_TYPE.MULTIPLY:
                            define = "ENVMAP_BLENDING_MULTIPLY";
                            break;
                        case ENVMAP_COMBINE_TYPE.MIX:
                            define = "ENVMAP_BLENDING_MIX";
                            break;
                        case ENVMAP_COMBINE_TYPE.ADD:
                            define = "ENVMAP_BLENDING_ADD";
                            break;
                        default:

                    }
                    fshader_define.push('#define ' + define);
                }
                fshader_define.push(props.useAOMap ? '#define USE_AOMAP' : '');
            case MATERIAL_TYPE.LINE:
            case MATERIAL_TYPE.LINE_LOOP:
                fshader_define.push(zen3d.ShaderChunk["encodings_pars_frag"]);
                fshader_define.push('#define GAMMA_FACTOR ' + props.gammaFactor);

                fshader_define.push(getTexelDecodingFunction("mapTexelToLinear", props.diffuseMapEncoding));
                fshader_define.push(getTexelDecodingFunction("envMapTexelToLinear", props.envMapEncoding));
                fshader_define.push(getTexelDecodingFunction("emissiveMapTexelToLinear", props.emissiveMapEncoding));
                fshader_define.push(getTexelEncodingFunction("linearToOutputTexel", props.outputEncoding));

                fshader_define.push(props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '');
            case MATERIAL_TYPE.DEPTH:
                fshader_define.push(props.packDepthToRGBA ? '#define DEPTH_PACKING_RGBA' : '');
            case MATERIAL_TYPE.DISTANCE:
                vshader_define.push(props.useSkinning ? '#define USE_SKINNING' : '');
                vshader_define.push((props.bonesNum > 0) ? ('#define MAX_BONES ' + props.bonesNum) : '');
                vshader_define.push(props.useVertexTexture ? '#define BONE_TEXTURE' : '');
            case MATERIAL_TYPE.LINE_DASHED:
                fshader_define.push(props.fog ? '#define USE_FOG' : '');
                fshader_define.push(props.fogExp2 ? '#define USE_EXP2_FOG' : '');
                break;
            default:
                break;
        }

        var vshader = [
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            vshader_define.join("\n"),
            vertex
        ].join("\n");

        var fshader = [
            '#extension GL_OES_standard_derivatives : enable',
            (props.useShaderTextureLOD && props.useEnvMap) ? '#extension GL_EXT_shader_texture_lod : enable' : '',
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            fshader_define.join("\n"),
            fragment
        ].join("\n");

        return new zen3d.WebGLProgram(gl, vshader, fshader);
    }

    var parseIncludes = function(string) {

        var pattern = /#include +<([\w\d.]+)>/g;

        function replace(match, include) {

            var replace = zen3d.ShaderChunk[include];

            if (replace === undefined) {

                throw new Error('Can not resolve #include <' + include + '>');

            }

            return parseIncludes(replace);

        }

        return string.replace(pattern, replace);

    }

    /**
     * get a suitable program by object & lights & fog
     */
    var getProgram = function(gl, render, material, object, lights, fog) {
        var material = material || object.material;

        var props = {}; // cache this props?
        props.precision = render.capabilities.maxPrecision;
        props.materialType = material.type;

        var currentRenderTarget = render.getCurrentRenderTarget();

        switch (material.type) {
            case MATERIAL_TYPE.PBR:
                props.useRoughnessMap = !!material.roughnessMap;
                props.useMetalnessMap = !!material.metalnessMap;
            case MATERIAL_TYPE.BASIC:
            case MATERIAL_TYPE.LAMBERT:
            case MATERIAL_TYPE.PHONG:
            case MATERIAL_TYPE.POINT:
            case MATERIAL_TYPE.LINE:
            case MATERIAL_TYPE.LINE_LOOP:
                props.gammaFactor = render.gammaFactor;
                props.outputEncoding = getTextureEncodingFromMap(currentRenderTarget ? currentRenderTarget.texture : null, render.gammaOutput);
                props.diffuseMapEncoding = getTextureEncodingFromMap(material.diffuseMap, render.gammaInput);
                props.envMapEncoding = getTextureEncodingFromMap(material.envMap, render.gammaInput);
                props.emissiveMapEncoding = getTextureEncodingFromMap(material.emissiveMap, render.gammaInput);
                props.useShaderTextureLOD = !!render.capabilities.shaderTextureLOD;
                props.useVertexColors = material.vertexColors;
                props.numClippingPlanes = render.clippingPlanes.length;
                props.useAOMap = !!material.aoMap;
            case MATERIAL_TYPE.CUBE:
            case MATERIAL_TYPE.LINE_DASHED:
                props.useDiffuseMap = !!material.diffuseMap;
                props.useNormalMap = !!material.normalMap;
                props.useBumpMap = !!material.bumpMap;
                props.useSpecularMap = !!material.specularMap;
                props.useEnvMap = !!material.envMap;
                props.envMapCombine = material.envMapCombine;
                props.useEmissiveMap = !!material.emissiveMap;
                props.useDiffuseColor = !material.diffuseMap;
                props.ambientLightNum = lights.ambientsNum;
                props.directLightNum = lights.directsNum;
                props.pointLightNum = lights.pointsNum;
                props.spotLightNum = lights.spotsNum;
                props.flatShading = material.shading === zen3d.SHADING_TYPE.FLAT_SHADING;
                props.useShadow = object.receiveShadow;
                props.usePCFSoftShadow = render.shadowType === zen3d.SHADOW_TYPE.PCF_SOFT;
                props.premultipliedAlpha = material.premultipliedAlpha;
                props.fog = !!fog;
                props.fogExp2 = !!fog && (fog.fogType === zen3d.FOG_TYPE.EXP2);
                props.sizeAttenuation = material.sizeAttenuation;
                props.doubleSided = material.side === zen3d.DRAW_SIDE.DOUBLE;
                props.flipSided = material.side === zen3d.DRAW_SIDE.BACK;
            case MATERIAL_TYPE.DEPTH:
                props.packDepthToRGBA = material.packToRGBA;
            case MATERIAL_TYPE.DISTANCE:
                var useSkinning = object.type === zen3d.OBJECT_TYPE.SKINNED_MESH && object.skeleton;
                var maxVertexUniformVectors = render.capabilities.maxVertexUniformVectors;
                var useVertexTexture = render.capabilities.maxVertexTextures > 0 && render.capabilities.floatTextures;
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
                break;
            case MATERIAL_TYPE.SHADER:
                props.vertexShader = material.vertexShader;
                props.fragmentShader = material.fragmentShader;
            case MATERIAL_TYPE.CANVAS2D:
            case MATERIAL_TYPE.PARTICLE:
            case MATERIAL_TYPE.SPRITE:
            default:
                break;
        }

        var code = generateProgramCode(props);
        var map = programMap;
        var program;

        if (map[code]) {
            program = map[code];
        } else {
            program = createProgram(gl, props);

            map[code] = program;
        }

        return program;
    }

    zen3d.getProgram = getProgram;
})();