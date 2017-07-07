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
            '#define LOG2 1.442695',
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

                vshader_define.push(props.useShadow ? '#define USE_SHADOW' : '');

                vshader_define.push(props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '');
                vshader_define.push(props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '');

                vshader_define.push(props.flipSided ? '#define FLIP_SIDED' : '');

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

                fshader_define.push(props.doubleSided ? '#define DOUBLE_SIDED' : '');
            case MATERIAL_TYPE.BASIC:
            case MATERIAL_TYPE.LINE_BASIC:
                vshader_define.push(props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '');
                vshader_define.push(props.useEnvMap ? '#define USE_ENV_MAP' : '');

                vshader_define.push(props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '');

                fshader_define.push(props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '');
                fshader_define.push(props.useEnvMap ? '#define USE_ENV_MAP' : '');
                fshader_define.push(props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '');
            case MATERIAL_TYPE.DEPTH:
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

        switch (material.type) {
            case MATERIAL_TYPE.BASIC:
            case MATERIAL_TYPE.LAMBERT:
            case MATERIAL_TYPE.PHONG:
            case MATERIAL_TYPE.CUBE:
            case MATERIAL_TYPE.POINT:
            case MATERIAL_TYPE.LINE_BASIC:
            case MATERIAL_TYPE.LINE_DASHED:
                props.useDiffuseMap = !!material.diffuseMap;
                props.useNormalMap = !!material.normalMap;
                props.useBumpMap = !!material.bumpMap;
                props.useSpecularMap = !!material.specularMap;
                props.useEnvMap = !!material.envMap;
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