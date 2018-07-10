(function() {

    // imports
    var Texture2D = zen3d.Texture2D;
    var WEBGL_PIXEL_TYPE = zen3d.WEBGL_PIXEL_TYPE;
    var WEBGL_PIXEL_FORMAT = zen3d.WEBGL_PIXEL_FORMAT;
    var WEBGL_TEXTURE_FILTER = zen3d.WEBGL_TEXTURE_FILTER;

    function TextureDepth(width, height) {
        Texture2D.call(this);

        this.image = {width: width, height: height};

        // DEPTH_ATTACHMENT set to unsigned_short or unsigned_int
        // DEPTH_STENCIL_ATTACHMENT set to UNSIGNED_INT_24_8
        this.pixelType = WEBGL_PIXEL_TYPE.UNSIGNED_SHORT;

        // don't change
        this.pixelFormat = WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT;   

        this.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
        this.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

        this.generateMipmaps = false;

        this.flipY = false;
    }

    TextureDepth.prototype = Object.assign(Object.create(Texture2D.prototype), {

        constructor: TextureDepth,

        isDepthTexture: true

    });

    // exports
    zen3d.TextureDepth = TextureDepth;

})();