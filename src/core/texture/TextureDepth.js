(function() {
    var TextureDepth = function(width, height) {
        TextureDepth.superClass.constructor.call(this);

        this.image = {width: width, height: height};

        // DEPTH_ATTACHMENT set to unsigned_short or unsigned_int
        // DEPTH_STENCIL_ATTACHMENT set to UNSIGNED_INT_24_8
        this.pixelType = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_SHORT;

        // don't change
        this.pixelFormat = zen3d.WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT;   

        this.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
        this.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;

        this.generateMipmaps = false;

        this.flipY = false;
    }

    zen3d.inherit(TextureDepth, zen3d.Texture2D);

    TextureDepth.prototype.isDepthTexture = true;

    zen3d.TextureDepth = TextureDepth;
})();