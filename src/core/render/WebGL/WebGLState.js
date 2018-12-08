import {BLEND_TYPE, CULL_FACE_TYPE, WEBGL_COMPARE_FUNC} from '../../const.js';
import {Vector4} from '../../math/Vector4.js';

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

function ColorBuffer(gl) {

    var locked = false;

    var color = new Vector4();
    var currentColorMask = null;
    var currentColorClear = new Vector4( 0, 0, 0, 0 );

    return {

        setMask: function ( colorMask ) {

            if ( currentColorMask !== colorMask && ! locked ) {

                gl.colorMask( colorMask, colorMask, colorMask, colorMask );
                currentColorMask = colorMask;

            }

        },

        setLocked: function ( lock ) {

            locked = lock;

        },

        setClear: function ( r, g, b, a, premultipliedAlpha ) {

            if ( premultipliedAlpha === true ) {

                r *= a; g *= a; b *= a;

            }

            color.set( r, g, b, a );

            if ( currentColorClear.equals( color ) === false ) {

                gl.clearColor( r, g, b, a );
                currentColorClear.copy( color );

            }

        },

        getClear: function() {
            return currentColorClear;
        },

        reset: function () {

            locked = false;

            currentColorMask = null;
            currentColorClear.set( - 1, 0, 0, 0 ); // set to invalid state

        }

    };
        
}

function DepthBuffer(gl, state) {

    var locked = false;

    var currentDepthMask = null;
    var currentDepthFunc = null;
    var currentDepthClear = null;

    return {

        setTest: function ( depthTest ) {

            if ( depthTest ) {

                state.enable( gl.DEPTH_TEST );

            } else {

                state.disable( gl.DEPTH_TEST );

            }

        },

        setMask: function ( depthMask ) {

            if ( currentDepthMask !== depthMask && ! locked ) {

                gl.depthMask( depthMask );
                currentDepthMask = depthMask;

            }

        },

        setFunc: function ( depthFunc ) {

            if ( currentDepthFunc !== depthFunc ) {

                gl.depthFunc(depthFunc);
                currentDepthFunc = depthFunc;

            }

        },

        setLocked: function ( lock ) {

            locked = lock;

        },

        setClear: function ( depth ) {

            if ( currentDepthClear !== depth ) {

                gl.clearDepth( depth );
                currentDepthClear = depth;

            }

        },

        reset: function () {

            locked = false;

            currentDepthMask = null;
            currentDepthFunc = null;
            currentDepthClear = null;

        }

    };

}

function StencilBuffer(gl, state) {

    var locked = false;

    var currentStencilMask = null;
    var currentStencilFunc = null;
    var currentStencilRef = null;
    var currentStencilFuncMask = null;
    var currentStencilFail = null;
    var currentStencilZFail = null;
    var currentStencilZPass = null;
    var currentStencilClear = null;

    return {

        setTest: function ( stencilTest ) {

            if ( stencilTest ) {

                state.enable( gl.STENCIL_TEST );

            } else {

                state.disable( gl.STENCIL_TEST );

            }

        },

        setMask: function ( stencilMask ) {

            if ( currentStencilMask !== stencilMask && ! locked ) {

                gl.stencilMask( stencilMask );
                currentStencilMask = stencilMask;

            }

        },

        setFunc: function ( stencilFunc, stencilRef, stencilMask ) {

            if ( currentStencilFunc !== stencilFunc ||
                 currentStencilRef 	!== stencilRef 	||
                 currentStencilFuncMask !== stencilMask ) {

                gl.stencilFunc( stencilFunc, stencilRef, stencilMask );

                currentStencilFunc = stencilFunc;
                currentStencilRef = stencilRef;
                currentStencilFuncMask = stencilMask;

            }

        },

        setOp: function ( stencilFail, stencilZFail, stencilZPass ) {

            if ( currentStencilFail	 !== stencilFail 	||
                 currentStencilZFail !== stencilZFail ||
                 currentStencilZPass !== stencilZPass ) {

                gl.stencilOp( stencilFail, stencilZFail, stencilZPass );

                currentStencilFail = stencilFail;
                currentStencilZFail = stencilZFail;
                currentStencilZPass = stencilZPass;

            }

        },

        setLocked: function ( lock ) {

            locked = lock;

        },

        setClear: function ( stencil ) {

            if ( currentStencilClear !== stencil ) {

                gl.clearStencil( stencil );
                currentStencilClear = stencil;

            }

        },

        reset: function () {

            locked = false;

            currentStencilMask = null;
            currentStencilFunc = null;
            currentStencilRef = null;
            currentStencilFuncMask = null;
            currentStencilFail = null;
            currentStencilZFail = null;
            currentStencilZPass = null;
            currentStencilClear = null;

        }

    };

}

function WebGLState(gl, capabilities) {

    this.gl = gl;
    this.capabilities = capabilities;

    this.colorBuffer = new ColorBuffer(gl);
    this.depthBuffer = new DepthBuffer(gl, this);
    this.stencilBuffer = new StencilBuffer(gl, this);

    this.states = {};

    this.currentBlending = null;

    this.currentBlendEquation = null;
    this.currentBlendSrc = null;
    this.currentBlendDst = null;
    this.currentBlendEquationAlpha = null;
    this.currentBlendSrcAlpha = null;
    this.currentBlendDstAlpha = null;
        
    this.currentPremultipliedAlpha = null;

    this.currentCullFace = null;

    this.currentViewport = new Vector4();

    this.currentTextureSlot = null;
    this.currentBoundTextures = {};

    this.currentBoundBuffers = {};

    this.emptyTextures = {};
    this.emptyTextures[gl.TEXTURE_2D] = createTexture(gl, gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
    this.emptyTextures[gl.TEXTURE_CUBE_MAP] = createTexture(gl, gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);

    this.currentFlipSided = false;

    this.currentLineWidth = null;

    this.currentPolygonOffsetFactor = null;
    this.currentPolygonOffsetUnits = null;

    this.currentProgram = null;

    this.currentRenderTarget = null;

    // init

    this.colorBuffer.setClear( 0, 0, 0, 1 );
	this.depthBuffer.setClear( 1 );
    this.stencilBuffer.setClear( 0 );
    
    this.depthBuffer.setTest( true );
    this.depthBuffer.setFunc( WEBGL_COMPARE_FUNC.LEQUAL );

    this.setCullFace( CULL_FACE_TYPE.BACK );
    this.setFlipSided( false );

}

Object.assign(WebGLState.prototype, {

    setBlend: function(blend, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha) {
        var gl = this.gl;

        if (blend !== BLEND_TYPE.NONE) {
            this.enable(gl.BLEND);
        } else {
            this.disable(gl.BLEND);
        }

        if(blend !== BLEND_TYPE.CUSTOM) {
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
        
            }

            this.currentBlendEquation = null;
            this.currentBlendSrc = null;
            this.currentBlendDst = null;
            this.currentBlendEquationAlpha = null;
            this.currentBlendSrcAlpha = null;
            this.currentBlendDstAlpha = null;
        } else {
            blendEquationAlpha = blendEquationAlpha || blendEquation;
            blendSrcAlpha = blendSrcAlpha || blendSrc;
            blendDstAlpha = blendDstAlpha || blendDst;
            
            if ( blendEquation !== this.currentBlendEquation || blendEquationAlpha !== this.currentBlendEquationAlpha ) {

                gl.blendEquationSeparate( blendEquation, blendEquationAlpha );

                this.currentBlendEquation = blendEquation;
                this.currentBlendEquationAlpha = blendEquationAlpha;

            }

            if ( blendSrc !== this.currentBlendSrc || blendDst !== this.currentBlendDst || blendSrcAlpha !== this.currentBlendSrcAlpha || blendDstAlpha !== this.currentBlendDstAlpha ) {

                gl.blendFuncSeparate( blendSrc, blendDst, blendSrcAlpha, blendDstAlpha );

                this.currentBlendSrc = blendSrc;
                this.currentBlendDst = blendDst;
                this.currentBlendSrcAlpha = blendSrcAlpha;
                this.currentBlendDstAlpha = blendDstAlpha;

            }
        }

        this.currentBlending = blend;
        this.currentPremultipliedAlpha = premultipliedAlpha;
    },

    setFlipSided: function(flipSided) {
        var gl = this.gl;

        if (this.currentFlipSided !== flipSided) {
            if (flipSided) {
                gl.frontFace(gl.CW);
            } else {
                gl.frontFace(gl.CCW);
            }

            this.currentFlipSided = flipSided;
        }
    },

    setCullFace: function(cullFace) {
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
    },

    viewport: function(x, y, width, height) {
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
    },

    activeTexture: function(slot) {
        var gl = this.gl;

        if (slot === undefined) {
            slot = gl.TEXTURE0 + this.capabilities.maxTextures - 1;
        }

        if (this.currentTextureSlot !== slot) {
            gl.activeTexture(slot);
            this.currentTextureSlot = slot;
        }
    },

    bindTexture: function(type, texture) {
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
    },

    bindBuffer: function(type, buffer) {
        var gl = this.gl;

        var boundBuffer = this.currentBoundBuffers[type];

        if (boundBuffer !== buffer) {
            gl.bindBuffer(type, buffer);
            this.currentBoundBuffers[type] = buffer;
        }
    },

    enable: function(id) {
        if (this.states[id] !== true) {
            this.gl.enable(id);
            this.states[id] = true;
        }
    },

    disable: function(id) {
        if (this.states[id] !== false) {
            this.gl.disable(id);
            this.states[id] = false;
        }
    },

    setLineWidth: function(width) {
        if(width !== this.currentLineWidth) {
            var lineWidthRange = this.capabilities.lineWidthRange;
            if(lineWidthRange[0] <= width && width <= lineWidthRange[1]) {
                this.gl.lineWidth(width);
            } else {
                console.warn("GL_ALIASED_LINE_WIDTH_RANGE is [" + lineWidthRange[0] + "," + lineWidthRange[1] + "], but set to " + width + ".");
            }
            this.currentLineWidth = width;
        }
    },

    setPolygonOffset: function( polygonOffset, factor, units ) {

        var gl = this.gl;

		if ( polygonOffset ) {

			this.enable( gl.POLYGON_OFFSET_FILL );

			if ( this.currentPolygonOffsetFactor !== factor || this.currentPolygonOffsetUnits !== units ) {

				gl.polygonOffset( factor, units );

				this.currentPolygonOffsetFactor = factor;
				this.currentPolygonOffsetUnits = units;

			}

		} else {

			this.disable( gl.POLYGON_OFFSET_FILL );

		}

	},

    setProgram: function(program) {
        if(this.currentProgram !== program) {
            this.gl.useProgram(program.program);
            this.currentProgram = program;
        }
    }

});

export {WebGLState};