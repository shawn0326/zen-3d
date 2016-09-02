(function() {
    /**
     * RenderTexture Class
     * for render target to draw into, can be render as a texture
     **/
    var RenderTexture = function(gl, width, height) {

        RenderTexture.superClass.constructor.call(this, gl);

        if(width && height) {
            this.resize(width, height);
        }
    }

    // inherit
    zen3d.inherit(RenderTexture, zen3d.Texture);

    /**
     * resize this render texture
     * this function will clear color of this texture
     */
    RenderTexture.prototype.resize = function(width, height, bind) {
        var gl = this.gl;

        if(bind) {
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        }

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.width = width;
        this.height = height;

        this.isInit = true;
    }

    zen3d.RenderTexture = RenderTexture;
})();