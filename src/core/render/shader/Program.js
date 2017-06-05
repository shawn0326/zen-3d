(function() {

    // TODO this could move to a new class named WebGLProgram
    // like other WebGL object, program can managed by WebGLProperties

    /**
     * create a shader
     **/
    function loadShader(gl, type, source) {
        // create a shader object
        var shader = gl.createShader(type);
        // bind the shader source, source must be string type?
        gl.shaderSource(shader, source);
        // compile shader
        gl.compileShader(shader);
        // if compile failed, log error
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            console.log("shader not compiled!")
            console.log(gl.getShaderInfoLog(shader))
        }

        return shader;
    }

    /**
     * create a WebGL program
     **/
    function createWebGLProgram(gl, vertexShader, fragmentShader) {
        // create a program object
        var program = gl.createProgram();
        // attach shaders to program
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // link vertex shader and fragment shader
        gl.linkProgram(program);
        // if link failed, log error
        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(!linked) {
            console.log("program not linked!")
            console.log(gl.getProgramInfoLog(program))
        }

        return program;
    }

    var programMap = {};

    /**
     * extract uniforms
     */
    function extractUniforms(gl, program) {
        var uniforms = {};

        var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (var i = 0; i < totalUniforms; i++) {
            var uniformData = gl.getActiveUniform(program, i);
            var name = uniformData.name;
            var uniform = new zen3d.WebGLUniform(gl, program, uniformData);
            uniforms[name] = uniform;
        }

        return uniforms;
    }

    /**
     * extract attributes
     */
    function extractAttributes(gl, program) {
        var attributes = {};

        var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (var i = 0; i < totalAttributes; i++) {
            var attribData = gl.getActiveAttrib(program, i);
            var name = attribData.name;
            var attribute = new zen3d.WebGLAttribute(gl, program, attribData);
            attributes[name] = attribute;
        }

        return attributes;
    }

    /**
     * get max precision
     * @param gl
     * @param precision {string} the expect precision, can be: "highp"|"mediump"|"lowp"
     */
    function getMaxPrecision(gl, precision) {
        if (precision === 'highp') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
                return 'highp';
            }
            precision = 'mediump';
        }
        if (precision === 'mediump') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
                return 'mediump';
            }
        }
        return 'lowp';
    }

    /**
     * WebGL Program
     * @class Program
     */
    var Program = function(gl, vshader, fshader) {

        // vertex shader source
        this.vshaderSource = vshader;

        // fragment shader source
        this.fshaderSource = fshader;

        // WebGL vertex shader
        this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);

        // WebGL fragment shader
        this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);

        // program id
        this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);

        this.uniforms = extractUniforms(gl, this.id);

        this.attributes = extractAttributes(gl, this.id);
    }

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

        var basic = props.materialType == MATERIAL_TYPE.BASIC;
        var cube = props.materialType == MATERIAL_TYPE.CUBE;
        var dashed = props.materialType == MATERIAL_TYPE.LINE_DASHED;
        var canvas2d = props.materialType == MATERIAL_TYPE.CANVAS2D;
        var sprite = props.materialType == MATERIAL_TYPE.SPRITE;
        var particle = props.materialType == MATERIAL_TYPE.PARTICLE;
        var depth = props.materialType == MATERIAL_TYPE.DEPTH;
        var custom = props.materialType == MATERIAL_TYPE.SHADER;

        var vertex = zen3d.ShaderLib[props.materialType + "_vert"] || props.vertexShader || zen3d.ShaderLib.basic_vert;
        var fragment = zen3d.ShaderLib[props.materialType + "_frag"] || props.fragmentShader || zen3d.ShaderLib.basic_frag;

        vertex = parseIncludes(vertex);
        fragment = parseIncludes(fragment);

        var vshader_define, fshader_define;
        if (basic) {
            vshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',

                props.useSkinning ? '#define USE_SKINNING' : '',
                (props.bonesNum > 0) ? ('#define MAX_BONES ' + props.bonesNum) : '',
                props.useVertexTexture ? '#define BONE_TEXTURE' : ''
            ].join("\n");
            fshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
                props.fog ? '#define USE_FOG' : '',
                props.fogExp2 ? '#define USE_EXP2_FOG' : ''
            ].join("\n");
        } else if (cube || dashed || canvas2d || sprite || particle || custom) {
            vshader_define = [
                ""
            ].join("\n");
            fshader_define = [
                props.fog ? '#define USE_FOG' : '',
                props.fogExp2 ? '#define USE_EXP2_FOG' : ''
            ].join("\n");
        } else if(depth) {
            vshader_define = [
                props.useSkinning ? '#define USE_SKINNING' : '',
                (props.bonesNum > 0) ? ('#define MAX_BONES ' + props.bonesNum) : '',
                props.useVertexTexture ? '#define BONE_TEXTURE' : ''
            ].join("\n");
            fshader_define = [
                ""
            ].join("\n");
            console.log(fshader_define)
        } else {
            vshader_define = [
                (props.pointLightNum > 0) ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
                (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
                (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
                (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '',
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.useShadow ? '#define USE_SHADOW' : '',

                props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
                props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '',
                props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',

                props.useSkinning ? '#define USE_SKINNING' : '',
                (props.bonesNum > 0) ? ('#define MAX_BONES ' + props.bonesNum) : '',
                props.useVertexTexture ? '#define BONE_TEXTURE' : ''
            ].join("\n");
            fshader_define = [
                (props.pointLightNum) > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
                (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
                (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
                (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '',
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '',
                props.useShadow ? '#define USE_SHADOW' : '',
                props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
                props.fog ? '#define USE_FOG' : '',
                props.fogExp2 ? '#define USE_EXP2_FOG' : '',
                props.flatShading ? '#define FLAT_SHADED' : '',

                props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
                props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : ''
            ].join("\n");
        }

        var vshader = [
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            vshader_define,
            vertex
        ].join("\n");

        var fshader = [
            '#extension GL_OES_standard_derivatives : enable',
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            fshader_define,
            '#define LOG2 1.442695',
            '#define saturate(a) clamp( a, 0.0, 1.0 )',
            '#define whiteCompliment(a) ( 1.0 - saturate( a ) )',
            fragment
        ].join("\n");

        return new Program(gl, vshader, fshader);
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
    var getProgram = function(gl, render, material, object, lightsNum, fog) {
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
                var ambientLightNum = lightsNum[0],
                    directLightNum = lightsNum[1],
                    pointLightNum = lightsNum[2],
                    spotLightNum = lightsNum[3];

                props.useDiffuseMap = !!material.diffuseMap;
                props.useNormalMap = !!material.normalMap;
                props.useBumpMap = !!material.bumpMap;
                props.useSpecularMap = !!material.specularMap;
                props.useEnvMap = !!material.envMap;
                props.useEmissiveMap = !!material.emissiveMap;
                props.useDiffuseColor = !material.diffuseMap;
                props.ambientLightNum = ambientLightNum;
                props.directLightNum = directLightNum;
                props.pointLightNum = pointLightNum;
                props.spotLightNum = spotLightNum;
                props.flatShading = material.shading === zen3d.SHADING_TYPE.FLAT_SHADING;
                props.useShadow = object.receiveShadow;
                props.premultipliedAlpha = material.premultipliedAlpha;
                props.fog = !!fog;
                props.fogExp2 = !!fog && (fog.fogType === zen3d.FOG_TYPE.EXP2);
                props.sizeAttenuation = material.sizeAttenuation;
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