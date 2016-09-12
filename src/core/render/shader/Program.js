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
        if(!compiled) {
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
            var type = uniformData.type;// analysis

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
        for(var key in props) {
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
            case MATERIAL_TYPE.PHONE:
                vertex = zen3d.ShaderLib.phoneVertex;
                fragment = zen3d.ShaderLib.phoneFragment;
                break;
            default:

        }

        var vshader = [
            (!basic && props.pointLightNum > 0) ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
            (!basic && (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0)) ? '#define USE_LIGHT' : '',
            (props.pointLightNum > 0 || props.directLightNum > 0) ? '#define USE_NORMAL' : '',
            ((props.pointLightNum > 0 || props.directLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
            props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',

            props.materialType == MATERIAL_TYPE.BASIC ? '#define USE_BASIC' : '',
            props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
            props.materialType == MATERIAL_TYPE.PHONE ? '#define USE_PHONE' : '',

            vertex
        ].join("\n");

        var fshader = [
            (!basic && props.pointLightNum) > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
            (!basic && props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
            (!basic && props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
            (!basic && (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0)) ? '#define USE_LIGHT' : '',
            (props.pointLightNum > 0 || props.directLightNum > 0) ? '#define USE_NORMAL' : '',
            ((props.pointLightNum > 0 || props.directLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
            props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
            // props.useNormalMap ? '#define USE_NORMAL_MAP' : '',

            props.materialType == MATERIAL_TYPE.BASIC ? '#define USE_BASIC' : '',
            props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
            props.materialType == MATERIAL_TYPE.PHONE ? '#define USE_PHONE' : '',

            fragment
        ].join("\n");

        return new Program(gl, vshader, fshader);
    }

    /**
     * get a suitable program by material & lights
     */
    var getProgram = function(gl, material, lightsNum) {

        var ambientLightNum = lightsNum[0],
        directLightNum = lightsNum[1],
        pointLightNum = lightsNum[2];

        var props = {
            useDiffuseMap: !!material.map,
            useNormalMap: !!material.normalMap,
            useDiffuseColor: !material.map,
            ambientLightNum: ambientLightNum,
            directLightNum: directLightNum,
            pointLightNum: pointLightNum,
            materialType: material.type
        };

        var code = generateProgramCode(props);
        var map = programMap;
        var program;

        if(map[code]) {
            program = map[code];
        } else {
            program = createProgram(gl, props);
            map[code] = program;
        }

        return program;
    }

    zen3d.getProgram = getProgram;
})();
