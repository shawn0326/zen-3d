(function() {
    /**
     * TextureBase
     * @class
     */
    var TextureBase = function(gl, options) {
        this.gl = gl;

        this.width = 0;
        this.height = 0;

        this.border = 0;

        this.dataFormat = gl.RGBA;

        this.dataType = gl.UNSIGNED_BYTE;

        // gl.NEAREST, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR ...
        this.magFilter = gl.LINEAR;
        this.minFilter = gl.LINEAR_MIPMAP_LINEAR;

        // gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT
        this.wrapS = gl.CLAMP_TO_EDGE;
        this.wrapT = gl.CLAMP_TO_EDGE;

        this.glTexture = gl.createTexture();

        this.isRenderable = false;

        this.generateMipMaps = true;
        this.hasMipMaps = false;

        // TODO this can set just as a global props?
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    }

    /**
     * bind texture
     */
    TextureBase.prototype.bind = function() {
        // implemented in sub class
    }

    /**
     * tex parameteri
     */
    TextureBase.prototype.texParam = function() {
        // implemented in sub class
    }

    TextureBase.prototype._filterFallback = function(gl, filter) {
		if ( filter === gl.NEAREST || filter === gl.NEAREST_MIPMAP_LINEAR || filter === gl.NEAREST_MIPMAP_NEAREST ) {
			return gl.NEAREST;
		}

		return gl.LINEAR;
	}

    /**
     * tex image
     */
    TextureBase.prototype.texImage = function() {
        // implemented in sub class
        // this.isRenderable = true;
    }

    /**
     * generate mipmaps
     */
    TextureBase.prototype.generateMipMaps = function() {

    }

    /**
     * destory
     */
    TextureBase.prototype.destory = function() {
        var gl = this.gl;
        gl.deleteTexture(this.glTexture);
    }

    zen3d.TextureBase = TextureBase;
})();