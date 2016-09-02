(function() {
    /**
     * Render Target Class
     * the render target can bind a renderTexture
     * the render target can attach some renderBuffer
     * @class
     */
    var RenderTarget = function(gl, width, height) {
        this.gl = gl;

        this.width = width;
        this.height = height;

        this.frameBuffer = gl.createFramebuffer();

        this.texture = null;

        this.renderBuffer = null;
    }

    /**
     * bind a 2d texture
     * @param [bind] {boolean} bind frame buffer or not, default is false
     * @param [renderTexture] {zen3d.RenderTexture} the render texture render to, if not set, this will create a renderTexture
     */
    RenderTarget.prototype.bindTexture2D = function(bind, renderTexture) {
        var gl = this.gl;

        var texture = null;

        if(renderTexture) {
            texture = renderTexture;
            texture.resize(this.width, this.height, true);//bind
        } else {
            texture = new zen3d.RenderTexture(gl, this.width, this.height);
        }

        if(bind) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        }

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.glTexture, 0);

        this.texture = texture;
    }

    /**
     * attach a render buffer
     * @param [bind] {boolean} bind frame buffer or not, default is false
     * @param [type] {string} "depth": gl.DEPTH_ATTACHMENT, "default": gl.DEPTH_STENCIL_ATTACHMENT
     */
    RenderTarget.prototype.attachRenderBuffer = function(bind, type) {
        var gl = this.gl;

        var renderBuffer = gl.createRenderbuffer();

        if(bind) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        }

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

        // TODO multiple render buffer needed?
        this.renderBufferType = type;
        this.renderBuffer = renderBuffer;
    }

    /**
     * resize render target
     * so we can recycling a render buffer
     */
    RenderTarget.prototype.resize = function(width, height) {
        this.width = width;
        this.height = height;

        // resize texture
        this.texture.resize(width, height, true);

        // resize render buffer
        if(this.renderBuffer) {
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
            if(this.renderBufferType == "depth") {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            } else if(this.renderBufferType == "stencil") {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, width, height);
            } else {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            }
        }
    }

    /**
     * bind the render target
     *
     */
    RenderTarget.prototype.bind = function() {
        var gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    }

    /**
     * unbind the render target
     *
     */
    RenderTarget.prototype.unbind = function() {
        var gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * check state
     */
    RenderTarget.prototype.checkState = function() {

        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
            switch(status) {
                case gl.FRAMEBUFFER_COMPLETE:
                     console.log("Framebuffer complete.")
                    break;

                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                     console.log("[ERROR] Framebuffer incomplete: Attachment is NOT complete.")
                    break;

                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                     console.log("[ERROR] Framebuffer incomplete: No image is attached to FBO.")
                    break;

                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                     console.log("[ERROR] Framebuffer incomplete: Attached images have different dimensions.")
                    break;

                case gl.FRAMEBUFFER_INCOMPLETE_FORMATS:
                     console.log("[ERROR] Framebuffer incomplete: Color attached images have different internal formats.")
                    break;

                case gl.FRAMEBUFFER_INCOMPLETE_DRAW_BUFFER:
                     console.log("[ERROR] Framebuffer incomplete: Draw buffer.")
                    break;

                case gl.FRAMEBUFFER_INCOMPLETE_READ_BUFFER:
                     console.log("[ERROR] Framebuffer incomplete: Read buffer.")
                    break;

                case gl.FRAMEBUFFER_UNSUPPORTED:
                     console.log("[ERROR] Unsupported by FBO implementation.")
                    break;

                default:
                     console.log("[ERROR] Unknow error.")
                    break;
            }
        }

    }

    zen3d.RenderTarget = RenderTarget;
})();