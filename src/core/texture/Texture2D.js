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

        // uv transform
        this.offset = new zen3d.Vector2();
        this.repeat = new zen3d.Vector2(1, 1);
        this.center = new zen3d.Vector2();
        this.rotation = 0;

        this.matrix = new zen3d.Matrix3();

        this.matrixAutoUpdate = true;
    }

    zen3d.inherit(Texture2D, zen3d.TextureBase);

    Texture2D.prototype.updateMatrix = function() {
        this.matrix.setUvTransform( this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y );
    }

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

        var isTGA = src.search( /\.(tga)$/ ) > 0 || src.search( /^data\:image\/tga/ ) === 0;

        var loader = isTGA ? new zen3d.TGALoader() : new zen3d.ImageLoader();
        loader.load(src, function(image) {
            texture.pixelFormat = isJPEG ? zen3d.WEBGL_PIXEL_FORMAT.RGB : zen3d.WEBGL_PIXEL_FORMAT.RGBA;
            texture.image = image;
            texture.version++;

            texture.dispatchEvent({type: 'onload'});
        });

        return texture;
    }

    zen3d.Texture2D = Texture2D;
})();