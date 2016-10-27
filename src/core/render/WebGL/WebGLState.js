(function() {
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;

    var WebGLState = function(gl) {
        this.gl = gl;

        this.states = {};

        this.currentBlending = null;
        this.currentPremultipliedAlpha = null;

        this.currentCullFace = null;

        this.currentViewport = new zen3d.Vector4();

        this.currentClearColor = new zen3d.Vector4();
    }

    WebGLState.prototype.setBlend = function(blend, premultipliedAlpha) {
        var gl = this.gl;

        if(blend !== BLEND_TYPE.NONE) {
            this.enable(gl.BLEND);
        } else {
            this.disable(gl.BLEND);
        }

        if(blend !== this.currentBlending || premultipliedAlpha !== this.currentPremultipliedAlpha) {

            if(blend === BLEND_TYPE.NORMAL) {
                if(premultipliedAlpha) {
                    gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
					gl.blendFuncSeparate( gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
                } else {
                    gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
					gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
                }
            }

            this.currentBlending = blend;
            this.currentPremultipliedAlpha = premultipliedAlpha;
        }
    }

    WebGLState.prototype.setCullFace = function(cullFace) {

        // gl.CW, gl.CCW, default is CCW
        // state.frontFace(gl.CCW);

        var gl = this.gl;

        if(cullFace !== CULL_FACE_TYPE.NONE) {
            this.enable(gl.CULL_FACE);

            if (cullFace !== this.currentCullFace) {

                if(cullFace === CULL_FACE_TYPE.BACK) {
                    gl.cullFace(gl.BACK);
                } else if(cullFace === CULL_FACE_TYPE.FRONT) {
                    gl.cullFace(gl.FRONT);
                } else {
                    gl.cullFace(gl.FRONT_AND_BACK);
                }

            }
        } else {
            this.disable(gl.CULL_FACE);
        }

        this.currentCullFace = cullFace;
    }

    WebGLState.prototype.viewport = function(x, y, width, height) {
        var currentViewport = this.currentViewport;
        if (currentViewport.x !== x ||
            currentViewport.y !== y ||
            currentViewport.z !== width ||
            currentViewport.w !== height
        ) {
            var gl = this.gl;
			gl.viewport(x, y, width, height);
			currentViewport.set(x, y, width, height);
		}
    }

    WebGLState.prototype.clearColor = function(r, g, b, a) {
        var currentClearColor = this.currentClearColor;
        if (currentClearColor.x !== r ||
            currentClearColor.y !== g ||
            currentClearColor.z !== b ||
            currentClearColor.w !== a
        ) {
            var gl = this.gl;
			gl.clearColor(r, g, b, a);
			currentClearColor.set(r, g, b, a);
		}
    }

    WebGLState.prototype.enable = function(id) {
        if(this.states[id] !== true) {
            this.gl.enable(id);
            this.states[id] = true;
        }
    }

    WebGLState.prototype.disable = function(id) {
        if(this.states[id] !== false) {
            this.gl.disable(id);
            this.states[id] = false;
        }
    }

    zen3d.WebGLState = WebGLState;
})();