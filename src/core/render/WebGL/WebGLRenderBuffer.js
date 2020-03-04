function WebGLRenderBuffer(gl, properties, capabilities) {
	this.gl = gl;

	this.properties = properties;

	this.capabilities = capabilities;
}

Object.assign(WebGLRenderBuffer.prototype, {

	setRenderBuffer: function(renderBuffer) {
		var gl = this.gl;
		var capabilities = this.capabilities;

		var renderBufferProperties = this.properties.get(renderBuffer);

		if (renderBufferProperties.__webglRenderbuffer === undefined) {
			renderBuffer.addEventListener('dispose', this.onRenderBufferDispose, this);

			renderBufferProperties.__webglRenderbuffer = gl.createRenderbuffer();

			gl.bindRenderbuffer(gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);

			if (renderBuffer.multipleSampling > 0) {
				if (capabilities.version < 2) {
					console.error("render buffer multipleSampling is not support in webgl 1.0.");
				}
				gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderBuffer.multipleSampling, capabilities.maxSamples), renderBuffer.format, renderBuffer.width, renderBuffer.height);
			} else {
				gl.renderbufferStorage(gl.RENDERBUFFER, renderBuffer.format, renderBuffer.width, renderBuffer.height);
			}
		} else {
			gl.bindRenderbuffer(gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);
		}

		return renderBufferProperties;
	},

	onRenderBufferDispose: function(event) {
		var gl = this.gl;
		var renderBuffer = event.target;

		var renderBufferProperties = this.properties.get(renderBuffer);

		if (renderBufferProperties.__webglRenderbuffer) {
			gl.deleteRenderbuffer(renderBufferProperties.__webglRenderbuffer)
		}

		this.properties.delete(renderBuffer);
	}

});

export { WebGLRenderBuffer };