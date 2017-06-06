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
                fshader_define.push(props.flatShading ? '#define FLAT_SHADED' : '');

                fshader_define.push(props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '');
                fshader_define.push(props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '');
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