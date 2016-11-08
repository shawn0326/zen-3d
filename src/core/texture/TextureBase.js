(function() {
    /**
     * TextureBase
     * @class
     */
    var TextureBase = function() {
        TextureBase.superClass.constructor.call(this);

        this.uuid = zen3d.generateUUID();

        this.textureType = "";

        this.border = 0;

        this.pixelFormat = zen3d.WEBGL_PIXEL_FORMAT.RGBA;

        this.pixelType = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

        this.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;

        this.wrapS = zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
        this.wrapT = zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

        this.generateMipmaps = true;

        this.version = 0;
    }

    zen3d.inherit(TextureBase, zen3d.EventDispatcher);

    TextureBase.prototype.dispose = function() {
        this.dispatchEvent({type: 'dispose'});

        this.version = 0;
    }

    zen3d.TextureBase = TextureBase;
})();