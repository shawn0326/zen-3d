(function() {
    /**
     * RenderTarget Class
     * it's actrually a framebuffer with a needed renderbuffer(or not)
     * @class
     */
    var RenderTarget = function(gl, width, height) {
        this.gl = gl;

        this.width = width;
        this.height = height;

        this.frameBuffer = gl.createFramebuffer();

        this.renderBuffer = null;
    }

    /**
     * bind the render target
     *
     */
    RenderTarget.prototype.bind = function() {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        return this;
    }

    /**
     * unbind the render target
     *
     */
    RenderTarget.prototype.unbind = function() {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return this;
    }

    /**
     * attach a render buffer
     * @param [type] {string} "depth": gl.DEPTH_ATTACHMENT, "default": gl.DEPTH_STENCIL_ATTACHMENT
     */
    RenderTarget.prototype.attachRenderBuffer = function(type) {
        var gl = this.gl;

        var renderBuffer = gl.createRenderbuffer();

        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);

        if(type == "depth") {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        } else if(type == "stencil") {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, this.width, this.height);
        } else {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
        }

        this.renderBuffer = renderBuffer;

        return this;
    }

    /**
     * bind a 2d texture
     * @param texture {TextureCube} texture to bind
     */
    RenderTarget.prototype.bindTexture2D = function(texture) {
        var gl = this.gl;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.glTexture, 0);

        return this;
    }

    /**
     * bind a cube texture
     * @param texture {TextureCube} texture to bind
     * @param faceCode {number} face code order: 0: right, 1: left, 2: up, 3: down, 4: back, 5: front.
     */
    RenderTarget.prototype.bindTextureCube = function(texture, faceCode) {
        var gl = this.gl;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture.faces[faceCode], texture.glTexture, 0);

        return this;
    }

    /**
     * resize render target
     * so we can recycling a render target
     */
    RenderTarget.prototype.resize = function(width, height) {
        // TODO
        // if bind, resize texture
        // if bind, resize renderBuffer
    }

    /**
     * destroy
     */
    RenderTarget.prototype.destroy = function() {
        var gl = this.gl;

        gl.deleteFramebuffer(this.frameBuffer);

        if(this.renderBuffer) {
            gl.deleteRenderbuffer(this.renderBuffer);
        }
    }

    zen3d.RenderTarget = RenderTarget;
})();