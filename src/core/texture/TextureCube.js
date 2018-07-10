(function() {

    // imports
    var TextureBase = zen3d.TextureBase;
    var WEBGL_TEXTURE_TYPE = zen3d.WEBGL_TEXTURE_TYPE;

    /**
     * TextureCube
     * @class
     */
    function TextureCube() {
        TextureBase.call(this);

        this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_CUBE_MAP;

        this.images = [];

        this.flipY = false;
    }

    TextureCube.prototype = Object.assign(Object.create(TextureBase.prototype), {

        constructor: TextureCube

    });

    TextureCube.fromImage = function(imageArray) {
        var texture = new TextureCube();
        var images = texture.images;

        for(var i = 0; i < 6; i++) {
            images[i] = imageArray[i];
        }

        texture.version++;

        return texture;
    }

    TextureCube.fromSrc = function(srcArray) {
        var texture = new TextureCube();
        var images = texture.images;

        var src = srcArray[0];
        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
		var isJPEG = src.search( /\.(jpg|jpeg)$/ ) > 0 || src.search( /^data\:image\/jpeg/ ) === 0;

        var isTGA = src.search( /\.(tga)$/ ) > 0 || src.search( /^data\:image\/tga/ ) === 0;

        var count = 0;
        function next(image) {
            if(image) {
                images.push(image);
                count++;
            }
            if(count >= 6) {
                loaded();
                return;
            }
            var loader = isTGA ? new zen3d.TGALoader() : new zen3d.ImageLoader();
            loader.load(srcArray[count], next);
        }
        next();

        function loaded() {
            texture.pixelFormat = isJPEG ? zen3d.WEBGL_PIXEL_FORMAT.RGB : zen3d.WEBGL_PIXEL_FORMAT.RGBA;
            texture.version++;
            texture.dispatchEvent({type: 'onload'});
        }

        return texture;
    }

    // exports
    zen3d.TextureCube = TextureCube;

})();