(function() {
    /**
     * Shader
     * @class
     */
    var Shader = function(gl, vshader, fshader) {
        this.vshaderSource = vshader;

        this.fshaderSource = fshader;

        // create program
        this.vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
        this.fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
        this.program = this._createProgram(gl);
    }

    /**
     * create a shader program
     **/
    Shader.prototype._createProgram = function(gl) {
        // create a program object
        var program = gl.createProgram();
        // attach shaders to program
        gl.attachShader(program, this.vertexShader);
        gl.attachShader(program, this.fragmentShader);
        // link vertex shader and fragment shader
        gl.linkProgram(program);

        return program;
    }

    /**
     * create a shader
     **/
    Shader.prototype._loadShader = function(gl, type, source) {
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
     * program map
     */
    Shader.programMap = {};

    /**
     * get a suitable program by material & lights
     */
    Shader.getProgram = function(gl, material, lights) {

        var ambientLightNum = lights.ambientLights.length,
        directLightNum = lights.directLights.length,
        pointLightNum = lights.pointLights.length;

        var props = {
            useDiffuseMap: material.type == "texture",
            useDiffuseColor: material.type == "color",
            ambientLightNum: ambientLightNum,
            directLightNum: directLightNum,
            pointLightNum: pointLightNum
        };

        var code = Shader.generateProgramCode(props);
        var map = Shader.programMap;
        var program;

        if(map[code]) {
            program = map[code];
        } else {
            program = Shader.createProgram(gl, props);
            map[code] = program;
        }

        return program;
    }

    /**
     * create program
     */
    Shader.createProgram = function(gl, props) {

        var vshader = [
            props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
            props.useDiffuseColor ? '#define USE_DIFFUSE_COLOR' : '',

            zen3d.vertexBase
        ].join("\n");

        var fshader = [
            props.pointLightNum > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
            props.directLightNum > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
            props.ambientLightNum > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
            (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0) ? '#define USE_LIGHT' : '',
            props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
            props.useDiffuseColor ? '#define USE_DIFFUSE_COLOR' : '',

            zen3d.fragmentBase
        ].join("\n");

        return new Shader(gl, vshader, fshader);
    }

    /**
     * generate program code
     */
    Shader.generateProgramCode = function(props) {
        var code = "";
        for(var key in props) {
            code += props[key] + "_";
        }
        return code;
    }

    zen3d.Shader = Shader;

})();
