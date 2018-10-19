import {WEBGL_UNIFORM_TYPE} from '../../const.js';

function WebGLUniform(gl, program, uniformData) {
    this.gl = gl;

    this.name = uniformData.name;

    // WEBGL_UNIFORM_TYPE
    this.type = uniformData.type;

    this.size = uniformData.size;

    this.location = gl.getUniformLocation(program, this.name);

    this.setValue = undefined;
    this.set = undefined;
    this._generateSetValue();
}

Object.assign(WebGLUniform.prototype, {

    _generateSetValue: function() {
        var gl = this.gl;
        var type = this.type;
        var location = this.location;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
                if(this.size > 1) {
                    this.setValue = this.set = function(value) {
                        gl.uniform1fv(location, value);
                    }
                } else {
                    this.setValue = this.set = function(value) {
                        gl.uniform1f(location, value);
                    }
                }
                break;
            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.SAMPLER_2D_SHADOW:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE_SHADOW:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.setValue = this.set = function(value) {
                    gl.uniform1i(location, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                this.setValue = function(p1, p2) {
                    gl.uniform2f(location, p1, p2);
                }
                this.set = function(value) {
                    gl.uniform2fv(location, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.setValue = function(p1, p2) {
                    gl.uniform2i(location, p1, p2);
                }
                this.set = function(value) {
                    gl.uniform2iv(location, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                this.setValue = function(p1, p2, p3) {
                    gl.uniform3f(location, p1, p2, p3);
                }
                this.set = function(value) {
                    gl.uniform3fv(location, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.setValue = function(p1, p2, p3) {
                    gl.uniform3i(location, p1, p2, p3);
                }
                this.set = function(value) {
                    gl.uniform3iv(location, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                this.setValue = function(p1, p2, p3, p4) {
                    gl.uniform4f(location, p1, p2, p3, p4);
                }
                this.set = function(value) {
                    gl.uniform4fv(location, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.setValue = function(p1, p2, p3, p4) {
                    gl.uniform4i(location, p1, p2, p3, p4);
                }
                this.set = function(value) {
                    gl.uniform4iv(location, value);
                }
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                this.setValue = this.set = function(value) {
                    gl.uniformMatrix2fv(location, false, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                this.setValue = this.set = function(value) {
                    gl.uniformMatrix3fv(location, false, value);
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.setValue = this.set = function(value) {
                    gl.uniformMatrix4fv(location, false, value);
                }
                break;
        }
    }

});

export {WebGLUniform};