import { ATTACHMENT } from '../../const.js';
import { isPowerOfTwo } from '../../base.js';

function _isPowerOfTwo(image) {
	return isPowerOfTwo(image.width) && isPowerOfTwo(image.height);
}

function WebGLRenderTarget(gl, state, texture, renderBuffer, properties, capabilities) {
	this.gl = gl;

	this.state = state;

	this.texture = texture;

	this.renderBuffer = renderBuffer;

	this.properties = properties;

	this.capabilities = capabilities;
}

Object.assign(WebGLRenderTarget.prototype, {

	setRenderTarget2D: function(renderTarget) {
		var gl = this.gl;
		var state = this.state;
		var texture = this.texture;
		var renderBuffer = this.renderBuffer;
		var capabilities = this.capabilities;

		var renderTargetProperties = this.properties.get(renderTarget);

		if (renderTargetProperties.__webglFramebuffer === undefined) {
			renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);

			renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();

			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

			var buffers = [];
			for (var attachment in renderTarget._attachments) {
				attachment = Number(attachment);

				if (attachment === ATTACHMENT.DEPTH_ATTACHMENT || attachment === ATTACHMENT.DEPTH_STENCIL_ATTACHMENT) {
					if (capabilities.version < 2 && !capabilities.getExtension('WEBGL_depth_texture')) {
						console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
					}
				}

				if ((attachment <= 0x8CE9 && attachment >= 0x8CE0) || (attachment <= 0x8CE15 && attachment >= 0x8CE10)) {
					buffers.push(attachment);
				}

				if (renderTarget._attachments[attachment].isTexture) {
					var textureProperties = texture.setTexture2D(renderTarget._attachments[attachment]);
					gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, textureProperties.__webglTexture, 0);
					state.bindTexture(gl.TEXTURE_2D, null);
				} else {
					var renderBufferProperties = renderBuffer.setRenderBuffer(renderTarget._attachments[attachment]);
					gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);
					gl.bindRenderbuffer(gl.RENDERBUFFER, null);
				}
			}

			if (buffers.length > 1) {
				if (capabilities.version >= 2) {
					gl.drawBuffers(buffers);
				} else if (capabilities.getExtension('WEBGL_draw_buffers')) {
					capabilities.getExtension('WEBGL_draw_buffers').drawBuffersWEBGL(buffers);
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
		var renderBuffer = this.renderBuffer;
		var capabilities = this.capabilities;

		var renderTargetProperties = this.properties.get(renderTarget);

		if (renderTargetProperties.__webglFramebuffer === undefined) {
			renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);

			renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
			renderTargetProperties.__currentActiveCubeFace = renderTarget.activeCubeFace;

			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

			var buffers = [];
			for (var attachment in renderTarget._attachments) {
				attachment = Number(attachment);

				if (attachment === ATTACHMENT.DEPTH_ATTACHMENT || attachment === ATTACHMENT.DEPTH_STENCIL_ATTACHMENT) {
					if (capabilities.version < 2 && !capabilities.getExtension('WEBGL_depth_texture')) {
						console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
					}
				}

				if ((attachment <= 0x8CE9 && attachment >= 0x8CE0) || (attachment <= 0x8CE15 && attachment >= 0x8CE10)) {
					buffers.push(attachment);
				}

				if (renderTarget._attachments[attachment].isTexture) {
					var textureProperties = texture.setTextureCube(renderTarget._attachments[attachment]);
					gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
					state.bindTexture(gl.TEXTURE_CUBE_MAP, null);
				} else {
					var renderBufferProperties = renderBuffer.setRenderBuffer(renderTarget._attachments[attachment]);
					gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);
					gl.bindRenderbuffer(gl.RENDERBUFFER, null);
				}
			}

			if (buffers.length > 1) {
				if (capabilities.version >= 2) {
					gl.drawBuffers(buffers);
				} else if (capabilities.getExtension('WEBGL_draw_buffers')) {
					capabilities.getExtension('WEBGL_draw_buffers').drawBuffersWEBGL(buffers);
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

		for (var attachment in renderTarget._attachments) {
			if (renderTarget._attachments[attachment].isTexture) {
				var textureProperties = this.properties.get(renderTarget._attachments[attachment]);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
			}
		}
		renderTargetProperties.__currentActiveCubeFace = renderTarget.activeCubeFace;
	},

	// Blit framebuffers.
	blitRenderTarget: function(read, draw, color, depth, stencil) {
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

		var mask = 0;
		if (color === undefined || !!color) mask |= gl.COLOR_BUFFER_BIT;
		if (depth === undefined || !!depth) mask |= gl.DEPTH_BUFFER_BIT;
		if (stencil === undefined || !!stencil) mask |= gl.STENCIL_BUFFER_BIT;

		// gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);

		gl.blitFramebuffer(
			0, 0, read.width, read.height,
			0, 0, draw.width, draw.height,
			mask, gl.NEAREST
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

		for (var attachment in renderTarget._attachments) {
			renderTarget._attachments[attachment].dispose();
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
					for (var attachment in target._attachments) {
						var textureProperties = this.properties.get(target._attachments[attachment]);
						gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.activeCubeFace, textureProperties.__webglTexture, 0);
					}
					renderTargetProperties.__currentActiveCubeFace = target.activeCubeFace;
				}
			}
		}
	}

});

export { WebGLRenderTarget };