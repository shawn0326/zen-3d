(function() {
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;

    function createTexture(gl, type, target, count) {
        var data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.
        var texture = gl.createTexture();

        gl.bindTexture(type, texture);
        gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        for (var i = 0; i < count; i++) {
            gl.texImage2D(target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }

        return texture;
    }

    var WebGLState = function(gl, capabilities) {
        this.gl = gl;
        this.capabilities = capabilities;

        this.states = {};

        this.currentBlending = null;
        this.currentPremultipliedAlpha = null;

        this.currentCullFace = null;

        this.currentViewport = new zen3d.Vector4();

        this.currentClearColor = new zen3d.Vector4();

        this.currentTextureSlot = null;
        this.currentBoundTextures = {};

        this.currentBoundBuffers = {};

        this.emptyTextures = {};
        this.emptyTextures[gl.TEXTURE_2D] = createTexture(gl, gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
        this.emptyTextures[gl.TEXTURE_CUBE_MAP] = createTexture(gl, gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);

        this.currentFlipSided = false;

        this.currentDepthMask = true;

        this.currentLineWidth = null;

        this.currentProgram = null;
    }

    WebGLState.prototype.setBlend = function(blend, premultipliedAlpha) {
        var gl = this.gl;

        if (blend !== BLEND_TYPE.NONE) {
            this.enable(gl.BLEND);
        } else {
            this.disable(gl.BLEND);
        }

        if (blend !== this.currentBlending || premultipliedAlpha !== this.currentPremultipliedAlpha) {

            if (blend === BLEND_TYPE.NORMAL) {
                if (premultipliedAlpha) {
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                } else {
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }
            }

            if (blend === BLEND_TYPE.ADD) {
                if (premultipliedAlpha) {
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                } else {
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                }
            }

            this.currentBlending = blend;
            this.currentPremultipliedAlpha = premultipliedAlpha;
        }
    }

    WebGLState.prototype.setFlipSided = function(flipSided) {
        var gl = this.gl;

        if (this.currentFlipSided !== flipSided) {
            if (flipSided) {
                gl.frontFace(gl.CW);
            } else {
                gl.frontFace(gl.CCW);
            }

            this.currentFlipSided = flipSided;
        }
    }

    WebGLState.prototype.setCullFace = function(cullFace) {
        var gl = this.gl;

        if (cullFace !== CULL_FACE_TYPE.NONE) {
            this.enable(gl.CULL_FACE);

            if (cullFace !== this.currentCullFace) {

                if (cullFace === CULL_FACE_TYPE.BACK) {
                    gl.cullFace(gl.BACK);
                } else if (cullFace === CULL_FACE_TYPE.FRONT) {
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

    WebGLState.prototype.activeTexture = function(slot) {
        var gl = this.gl;

        if (slot === undefined) {
            slot = gl.TEXTURE0 + this.capabilities.maxTextures - 1;
        }

        if (this.currentTextureSlot !== slot) {
            gl.activeTexture(slot);
            this.currentTextureSlot = slot;
        }
    }

    WebGLState.prototype.bindTexture = function(type, texture) {
        var gl = this.gl;

        if (this.currentTextureSlot === null) {
            this.activeTexture();
        }

        var boundTexture = this.currentBoundTextures[this.currentTextureSlot];

        if (boundTexture === undefined) {
            boundTexture = {
                type: undefined,
                texture: undefined
            };
            this.currentBoundTextures[this.currentTextureSlot] = boundTexture;
        }

        if (boundTexture.type !== type || boundTexture.texture !== texture) {
            gl.bindTexture(type, texture || this.emptyTextures[type]);
            boundTexture.type = type;
            boundTexture.texture = texture;
        }
    }

    WebGLState.prototype.bindBuffer = function(type, buffer) {
        var gl = this.gl;

        var boundBuffer = this.currentBoundBuffers[type];

        if (boundBuffer !== buffer) {
            gl.bindBuffer(type, buffer);
            this.currentBoundBuffers[type] = buffer;
        }
    }

    WebGLState.prototype.enable = function(id) {
        if (this.states[id] !== true) {
            this.gl.enable(id);
            this.states[id] = true;
        }
    }

    WebGLState.prototype.disable = function(id) {
        if (this.states[id] !== false) {
            this.gl.disable(id);
            this.states[id] = false;
        }
    }

    // depth mask should attach to a frame buffer???
    WebGLState.prototype.depthMask = function(flag) {
        if(flag !== this.currentDepthMask) {
            this.gl.depthMask(flag);
            this.currentDepthMask = flag;
        }
    }

    WebGLState.prototype.setLineWidth = function(width) {
        if(width !== this.currentLineWidth) {
            if(this.capabilities.version >= 1.0) {
                this.gl.lineWidth(width);
            }
            this.currentLineWidth = width;
        }
    }

    WebGLState.prototype.setProgram = function(program) {
        if(this.currentProgram !== program) {
            this.gl.useProgram(program.id);
            this.currentProgram = program;
        }
    }

    zen3d.WebGLState = WebGLState;
})();