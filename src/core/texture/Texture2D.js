(function() {
    /**
     * Texture2D
     * @class
     */
    var Texture2D = function() {
        Texture2D.superClass.constructor.call(this);

        this.textureType = zen3d.WEBGL_TEXTURE_TYPE.TEXTURE_2D;

        this.image = null;
        this.mipmaps = [];
    }

    zen3d.inherit(Texture2D, zen3d.TextureBase);

    Texture2D.fromImage = function(image) {
        var texture = new Texture2D();

        texture.image = image;
        texture.version++;

        return texture;
    }

    Texture2D.fromSrc = function(src) {
        var texture = new Texture2D();

        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
		var isJPEG = src.search( /\.(jpg|jpeg)$/ ) > 0 || src.search( /^data\:image\/jpeg/ ) === 0;

        zen3d.requireImage(src, function(image) {
            texture.pixelFormat = isJPEG ? zen3d.WEBGL_PIXEL_FORMAT.RGB : zen3d.WEBGL_PIXEL_FORMAT.RGBA;
            texture.image = image;
            texture.version++;
        });

        return texture;
    }

    zen3d.Texture2D = Texture2D;
})();