import { ATTACHMENT } from '../../const.js';
import { isPowerOfTwo } from '../../base.js';

function _isPowerOfTwo(image) {
	return isPowerOfTwo(image.width) && isPowerOfTwo(image.height);
}

function WebGLRenderTarget(gl, state, texture, properties, capabilities) {
	this.gl = gl;

	this.state = state;

	this.texture = texture;

	this.properties = properties;

	this.capabilities = capabilities;
}

Object.assign(WebGLRenderTarget.prototype, {

	setRenderTarget2D: function(renderTarget) {
		var gl = this.gl;
		var state = this.state;
		var texture = this.texture;
		var capabilities = this.capabilities;

		var renderTargetProperties = this.properties.get(renderTarget);

		if (renderTargetProperties.__webglFramebuffer === undefined) {
			renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);

			renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();

			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

			var buffers = [];
			for (var attachment in renderTarget._textures) {
				var textureProperties = texture.setTexture2D(renderTarget._textures[attachment]);

				attachment = Number(attachment);

				if (attachment === ATTACHMENT.DEPTH_ATTACHMENT || attachment === ATTACHMENT.DEPTH_STENCIL_ATTACHMENT) {
					if (capabilities.version < 2 && !capabilities.getExtension('WEBGL_depth_texture')) {
						console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
					}
				}

				gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, textureProperties.__webglTexture, 0);
				state.bindTexture(gl.TEXTURE_2D, null);

				if ((attachment <= 0x8CE9 && attachment >= 0x8CE0) || (attachment <= 0x8CE15 && attachment >= 0x8CE10)) {
					buffers.push(attachment);
				}
			}

			if (buffers.length > 1) {
				if (capabilities.version >= 2) {
					gl.drawBuffers(buffers);
				} else if (capabilities.getExtension('WEBGL_draw_buffers')) {
					capabilities.getExtension('WEBGL_draw_buffers').drawBuffersWEBGL(buffers);
				}
			}

			if (capabilities.version >= 2) {
				if (renderTarget.multipleSampling > 0) {
					var renderbuffer = gl.createRenderbuffer();
					gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
					gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderTarget.multipleSampling, capabilities.maxSamples), gl.RGBA8, renderTarget.width, renderTarget.height);
					gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer);

					renderTargetProperties.__multipleSamplingbuffer = renderbuffer;
				}
			}

			if (renderTarget.depthBuffer) {
				if (!renderTarget._textures[ATTACHMENT.DEPTH_STENCIL_ATTACHMENT] && !renderTarget._textures[ATTACHMENT.DEPTH_ATTACHMENT]) {
					renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();

					var renderbuffer = renderTargetProperties.__webglDepthbuffer;

					gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

					if (renderTarget.stencilBuffer) {
						if (capabilities.version >= 2 && renderTarget.multipleSampling > 0) {
							gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderTarget.multipleSampling, capabilities.maxSamples), gl.DEPTH24_STENCIL8, renderTarget.width, renderTarget.height);
						} else {
							gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
						}

						gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
					} else {
						if (capabilities.version >= 2 && renderTarget.multipleSampling > 0) {
							gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderTarget.multipleSampling, capabilities.maxSamples), gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
						} else {
							gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
						}

						gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
					}

					gl.bindRenderbuffer(gl.RENDERBUFFER, null);
				}
			}

			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				if (status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
				} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
				} else if (status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
				} else if (status === gl.FRAMEBUFFER_UNSUPPORTED) {
					console.warn("framebuffer not complete: FRAMEBUFFER_UNSUPPORTED");
				} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
				} else {
					console.warn("framebuffer not complete.");
				}
			}

			return;
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
	},

	setRenderTargetCube: function(renderTarget) {
		var gl = this.gl;
		var state = this.state;
		var texture = this.texture;
		var capabilities = this.capabilities;

		var renderTargetProperties = this.properties.get(renderTarget);

		if (renderTargetProperties.__webglFramebuffer === undefined) {
			renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);

			renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
			renderTargetProperties.__currentActiveCubeFace = renderTarget.activeCubeFace;

			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

			var buffers = [];
			for (var attachment in renderTarget._textures) {
				var textureProperties = texture.setTextureCube(renderTarget._textures[attachment]);

				attachment = Number(attachment);

				if (attachment === ATTACHMENT.DEPTH_ATTACHMENT || attachment === ATTACHMENT.DEPTH_STENCIL_ATTACHMENT) {
					if (capabilities.version < 2 && !capabilities.getExtension('WEBGL_depth_texture')) {
						console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
					}
				}

				gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
				state.bindTexture(gl.TEXTURE_CUBE_MAP, null);

				if ((attachment <= 0x8CE9 && attachment >= 0x8CE0) || (attachment <= 0x8CE15 && attachment >= 0x8CE10)) {
					buffers.push(attachment);
				}
			}

			if (buffers.length > 1) {
				if (capabilities.version >= 2) {
					gl.drawBuffers(buffers);
				} else if (capabilities.getExtension('WEBGL_draw_buffers')) {
					capabilities.getExtension('WEBGL_draw_buffers').drawBuffersWEBGL(buffers);
				}
			}

			if (capabilities.version >= 2) {
				if (renderTarget.multipleSampling > 0) {
					var renderbuffer = gl.createRenderbuffer();
					gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
					gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderTarget.multipleSampling, capabilities.maxSamples), gl.RGBA8, renderTarget.width, renderTarget.height);
					gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer);

					renderTargetProperties.__multipleSamplingbuffer = renderbuffer;
				}
			}

			if (renderTarget.depthBuffer) {
				if (!renderTarget._textures[ATTACHMENT.DEPTH_STENCIL_ATTACHMENT] && !renderTarget._textures[ATTACHMENT.DEPTH_ATTACHMENT]) {
					renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();

					var renderbuffer = renderTargetProperties.__webglDepthbuffer;

					gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

					if (renderTarget.stencilBuffer) {
						if (capabilities.version >= 2 && renderTarget.multipleSampling > 0) {
							gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderTarget.multipleSampling, capabilities.maxSamples), gl.DEPTH24_STENCIL8, renderTarget.width, renderTarget.height);
						} else {
							gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
						}

						gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
					} else {
						if (capabilities.version >= 2 && renderTarget.multipleSampling > 0) {
							gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderTarget.multipleSampling, capabilities.maxSamples), gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
						} else {
							gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
						}

						gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
					}

					gl.bindRenderbuffer(gl.RENDERBUFFER, null);
				}
			}

			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				if (status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
				} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
				} else if (status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
				} else if (status === gl.FRAMEBUFFER_UNSUPPORTED) {
					console.warn("framebuffer not complete: FRAMEBUFFER_UNSUPPORTED");
				} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE) {
					console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
				} else {
					console.warn("framebuffer not complete.");
				}
			}

			return;
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

		for (var attachment in renderTarget._textures) {
			var textureProperties = this.properties.get(renderTarget._textures[attachment]);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
		}
		renderTargetProperties.__currentActiveCubeFace = renderTarget.activeCubeFace;
	},

	// Blit framebuffers.
	blitRenderTarget: function(read, draw) {
		var gl = this.gl;
		var properties = this.properties;
		var capabilities = this.capabilities;

		if (capabilities.version < 2) {
			console.warn("blitFramebuffer not support by WebGL" + capabilities.version);
			return;
		}

		var readBuffer = properties.get(read).__webglFramebuffer;
		var drawBuffer = properties.get(draw).__webglFramebuffer;
		gl.bindFramebuffer(gl.READ_FRAMEBUFFER, readBuffer);
		gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, drawBuffer);
		gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);
		gl.blitFramebuffer(
			0, 0, read.width, read.height,
			0, 0, draw.width, draw.height,
			gl.COLOR_BUFFER_BIT, gl.NEAREST
		);
	},

	updateRenderTargetMipmap: function(renderTarget) {
		var gl = this.gl;
		var state = this.state;
		var texture = renderTarget.texture;

		if (texture.generateMipmaps && _isPowerOfTwo(renderTarget) &&
            texture.minFilter !== gl.NEAREST &&
            texture.minFilter !== gl.LINEAR) {
			var target = texture.textureType;
			var webglTexture = this.properties.get(texture).__webglTexture;

			state.bindTexture(target, webglTexture);
			gl.generateMipmap(target);
			state.bindTexture(target, null);
		}
	},

	onRenderTargetDispose: function(event) {
		var gl = this.gl;
		var state = this.state;
		var renderTarget = event.target;
		var renderTargetProperties = this.properties.get(renderTarget);

		renderTarget.removeEventListener('dispose', this.onRenderTargetDispose, this);

		if (renderTargetProperties.__webglFramebuffer) {
			gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer)
		}

		if (renderTargetProperties.__webglDepthbuffer) {
			gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer)
		}

		this.properties.delete(renderTarget);

		if (state.currentRenderTarget === renderTarget) {
			state.currentRenderTarget = null;
		}
	},

	setRenderTarget: function(target) {
		var gl = this.gl;
		var state = this.state;

		if (!!target.view) { // back RenderTarget
			if (state.currentRenderTarget === target) {
				// do nothing
			} else {
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);

				state.currentRenderTarget = target;
			}

			return;
		}

		var isCube = target.activeCubeFace !== undefined;

		if (state.currentRenderTarget !== target) {
			if (!isCube) {
				this.setRenderTarget2D(target);
			} else {
				this.setRenderTargetCube(target);
			}

			state.currentRenderTarget = target;
		} else {
			if (isCube) {
				var renderTargetProperties = this.properties.get(target);
				if (renderTargetProperties.__currentActiveCubeFace !== target.activeCubeFace) {
					for (var attachment in target._textures) {
						var textureProperties = this.properties.get(target._textures[attachment]);
						gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.activeCubeFace, textureProperties.__webglTexture, 0);
					}
					renderTargetProperties.__currentActiveCubeFace = target.activeCubeFace;
				}
			}
		}
	}

});

export { WebGLRenderTarget };