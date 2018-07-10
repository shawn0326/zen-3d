(function() {

    // imports
    var generateUUID = zen3d.generateUUID;
    var WEBGL_PIXEL_FORMAT = zen3d.WEBGL_PIXEL_FORMAT;
    var WEBGL_PIXEL_TYPE = zen3d.WEBGL_PIXEL_TYPE;
    var WEBGL_TEXTURE_FILTER = zen3d.WEBGL_TEXTURE_FILTER;
    var WEBGL_TEXTURE_WRAP = zen3d.WEBGL_TEXTURE_WRAP;
    var TEXEL_ENCODING_TYPE = zen3d.TEXEL_ENCODING_TYPE;
    var EventDispatcher = zen3d.EventDispatcher;

    /**
     * TextureBase
     * @class
     */
    function TextureBase() {
        EventDispatcher.call(this);

        this.uuid = generateUUID();

        this.textureType = "";

        this.border = 0;

        this.pixelFormat = WEBGL_PIXEL_FORMAT.RGBA;

        this.pixelType = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

        this.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;
        this.minFilter = WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;

        this.wrapS = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
        this.wrapT = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

        this.anisotropy = 1;

        this.generateMipmaps = true;

        this.encoding = TEXEL_ENCODING_TYPE.LINEAR;

        this.flipY = true;

        this.version = 0;
    }

    TextureBase.prototype = Object.assign(TextureBase.prototype, {

        dispose: function() {
            this.dispatchEvent({type: 'dispose'});
    
            this.version = 0;
        }

    });

    // exports
    zen3d.TextureBase = TextureBase;

})();