(function() {

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
            var type = uniformData.type; // analysis

            // TODO get update method

            uniforms[name] = {
                type: type,
                size: uniformData.size,
                location: gl.getUniformLocation(program, name)
            };
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
            var type = attribData.type;

            attributes[name] = {
                type: type,
                size: 1,
                location: gl.getAttribLocation(program, name)
            };
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
    function createProgram(gl, props) {

        var basic = props.materialType == MATERIAL_TYPE.BASIC;
        var cube = props.materialType == MATERIAL_TYPE.CUBE;

        var vertex = zen3d.ShaderLib.vertexBase;
        var fragment = zen3d.ShaderLib.fragmentBase;

        switch (props.materialType) {
            case MATERIAL_TYPE.BASIC:
                vertex = zen3d.ShaderLib.basicVertex;
                fragment = zen3d.ShaderLib.basicFragment;
                break;
            case MATERIAL_TYPE.LAMBERT:
                vertex = zen3d.ShaderLib.lambertVertex;
                fragment = zen3d.ShaderLib.lambertFragment;
                break;
            case MATERIAL_TYPE.PHONG:
                vertex = zen3d.ShaderLib.phongVertex;
                fragment = zen3d.ShaderLib.phongFragment;
                break;
            case MATERIAL_TYPE.CUBE:
                vertex = zen3d.ShaderLib.cubeVertex;
                fragment = zen3d.ShaderLib.cubeFragment;
                break;
            case MATERIAL_TYPE.POINT:
                vertex = zen3d.ShaderLib.pointsVertex;
                fragment = zen3d.ShaderLib.pointsFragment;
                break;
            default:

        }

        var vshader_define, fshader_define;
        if (basic) {
            vshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : ''
            ].join("\n");
            fshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
                props.fog ? '#define USE_FOG' : '',
                props.fogExp2 ? '#define USE_EXP2_FOG' : ''
            ].join("\n");
        } else if (cube) {
            vshader_define = [
                ""
            ].join("\n");
            fshader_define = [
                ""
            ].join("\n");
        } else {
            vshader_define = [
                (props.pointLightNum > 0) ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
                (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
                (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
                (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.useShadow ? '#define USE_SHADOW' : '',

                props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
                props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '',
                props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : ''
            ].join("\n");
            fshader_define = [
                (props.pointLightNum) > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
                (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
                (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
                (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.useShadow ? '#define USE_SHADOW' : '',
                props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
                props.fog ? '#define USE_FOG' : '',
                props.fogExp2 ? '#define USE_EXP2_FOG' : '',

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

    /**
     * get a suitable program by object & lights & fog
     */
    var getProgram = function(gl, render, object, lightsNum, fog) {

        var material = object.material;

        if(material.type === MATERIAL_TYPE.CANVAS2D) {
            return getCanvas2DProgram(gl, render);
        }

        var ambientLightNum = lightsNum[0],
            directLightNum = lightsNum[1],
            pointLightNum = lightsNum[2],
            spotLightNum = lightsNum[3];

        var precision = render.capabilities.maxPrecision;

        var props = {
            precision: precision,
            useDiffuseMap: !!material.map,
            useNormalMap: !!material.normalMap,
            useEnvMap: !!material.envMap,
            useDiffuseColor: !material.map,
            ambientLightNum: ambientLightNum,
            directLightNum: directLightNum,
            pointLightNum: pointLightNum,
            spotLightNum: spotLightNum,
            materialType: material.type,
            useShadow: object.receiveShadow,
            premultipliedAlpha: material.premultipliedAlpha,
            fog: !!fog,
            fogExp2: !!fog && (fog.fogType === zen3d.FOG_TYPE.EXP2),
            sizeAttenuation: material.sizeAttenuation
        };

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

    /**
     * get depth program, used to render depth map
     */
    var getDepthProgram = function(gl, render) {
        var program;
        var map = programMap;
        var code = "depth";

        var precision = render.capabilities.maxPrecision;

        if (map[code]) {
            program = map[code];
        } else {
            var vshader = [
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.depthVertex
            ].join("\n");

            var fshader = [
                '#extension GL_OES_standard_derivatives : enable',
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.depthFragment
            ].join("\n");

            program = new Program(gl, vshader, fshader);
            map[code] = program;
        }

        return program;
    }

    /**
     * get canvas2d program, used to render canvas 2d
     */
    var getCanvas2DProgram = function(gl, render) {
        var program;
        var map = programMap;
        var code = "canvas2d";

        var precision = render.capabilities.maxPrecision;

        if (map[code]) {
            program = map[code];
        } else {
            var vshader = [
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.canvas2dVertex
            ].join("\n");

            var fshader = [
                '#extension GL_OES_standard_derivatives : enable',
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.canvas2dFragment
            ].join("\n");

            program = new Program(gl, vshader, fshader);
            map[code] = program;
        }

        return program;
    }

    /**
     * get sprite program, used to render sprites
     */
    var getSpriteProgram = function(gl, render) {
        var program;
        var map = programMap;
        var code = "sprite";

        var precision = render.capabilities.maxPrecision;

        if(map[code]) {
            program = map[code];
        } else {
            var vshader = [
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.spriteVertex
            ].join("\n");

            var fshader = [
                '#extension GL_OES_standard_derivatives : enable',
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.spriteFragment
            ].join("\n");

            program = new Program(gl, vshader, fshader);
            map[code] = program;
        }

        return program;
    }

    zen3d.getProgram = getProgram;
    zen3d.getDepthProgram = getDepthProgram;
    zen3d.getSpriteProgram = getSpriteProgram;
})();