(function() {

    // imports
    var Texture2D = zen3d.Texture2D;
    var WEBGL_PIXEL_TYPE = zen3d.WEBGL_PIXEL_TYPE;
    var WEBGL_TEXTURE_FILTER = zen3d.WEBGL_TEXTURE_FILTER;

    function TextureData(data, width, height) {
        Texture2D.call(this);

        this.image = {data: data, width: width, height: height};

        // default pixel type set to float
        this.pixelType = WEBGL_PIXEL_TYPE.FLOAT;

        this.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
        this.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

        this.generateMipmaps = false;

        this.flipY = false;
    }

    TextureData.prototype = Object.assign(Object.create(Texture2D.prototype), {

        constructor: TextureData,

        isDataTexture: true

    });

    // exports
    zen3d.TextureData = TextureData;

})();