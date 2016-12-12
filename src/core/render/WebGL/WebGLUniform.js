(function() {
    var WEBGL_UNIFORM_TYPE = zen3d.WEBGL_UNIFORM_TYPE;

    var WebGLUniform = function(gl, program, uniformData) {
        this.gl = gl;

        this.name = uniformData.name;

        // WEBGL_UNIFORM_TYPE
        this.type = uniformData.type;

        this.size = uniformData.size;

        this.location = gl.getUniformLocation(program, this.name);

        this.value = undefined;
        this._setDefaultValue();

        this.setValue = undefined;
        this._generateSetValue();

        this.upload = undefined;
        this._generateUpload();
    }

    WebGLUniform.prototype._setDefaultValue = function() {
        var type = this.type;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.value = 0;
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.value = [0, 0];
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.value = [0, 0, 0];
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.value = [0, 0, 0, 0];
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                this.value = new Float32Array([
                    1, 0,
                    0, 1
                ]);
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                this.value = new Float32Array([
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ]);
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.value = new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]);
                break;
        }
    }

    WebGLUniform.prototype._generateSetValue = function() {
        var type = this.type;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.setValue = function(p1) {
                    this.value = p1;
                    this.upload();
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.setValue = function(p1, p2) {
                    this.value[0] = p1;
                    this.value[1] = p2;
                    this.upload();
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.setValue = function(p1, p2, p3) {
                    this.value[0] = p1;
                    this.value[1] = p2;
                    this.value[2] = p3;
                    this.upload();
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.setValue = function(p1, p2, p3, p4) {
                    this.value[0] = p1;
                    this.value[1] = p2;
                    this.value[2] = p3;
                    this.value[3] = p4;
                    this.upload();
                }
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.setValue = function(p1) {
                    this.value.set(p1);
                    this.upload();
                }
                break;
        }
    }

    WebGLUniform.prototype._generateUpload = function() {
        var gl = this.gl;
        var type = this.type;
        var location = this.location;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform1f(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform2f(location, value[0], value[1]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform3f(location, value[0], value[1], value[2]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                };
                break;

            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform1i(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform2i(location, value[0], value[1]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform3i(location, value[0], value[1], value[2]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                };
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                this.upload = function() {
                    var value = this.value;
                    gl.uniformMatrix2fv(location, false, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                this.upload = function() {
                    var value = this.value;
                    gl.uniformMatrix3fv(location, false, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.upload = function() {
                    var value = this.value;
                    gl.uniformMatrix4fv(location, false, value);
                };
                break;
        }
    }

    zen3d.WebGLUniform = WebGLUniform;
})();