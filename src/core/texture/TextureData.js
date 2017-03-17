(function() {
    var TextureData = function(data, width, height) {
        TextureData.superClass.constructor.call(this);

        this.image = {data: data, width: width, height: height};

        // default pixel type set to float
        this.pixelType = zen3d.WEBGL_PIXEL_TYPE.FLOAT;

        this.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
        this.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;

        this.generateMipmaps = false;
    }

    zen3d.inherit(TextureData, zen3d.Texture2D);

    TextureData.prototype.isDataTexture = true;

    zen3d.TextureData = TextureData;
})();