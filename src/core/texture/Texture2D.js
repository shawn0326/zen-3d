(function() {
    /**
     * Texture2D
     * @class
     * @extends TextureBase
     */
    var Texture2D = function(gl, options) {
        Texture2D.superClass.constructor.call(this, gl, options);

    }

    zen3d.inherit(Texture2D, zen3d.TextureBase);

    /**
     * bind texture
     */
    Texture2D.prototype.bind = function() {
        var gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

        return this;
    }

    /**
     * tex parameteri
     */
    Texture2D.prototype.texParam = function() {
        var gl = this.gl;

        if(this.hasMipMaps) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._filterFallback(gl, this.magFilter));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._filterFallback(gl, this.minFilter));
        }

        var isPowerOf2 = zen3d.isPowerOf2(this.width) && zen3d.isPowerOf2(this.height);

        if(isPowerOf2) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        return this;
    }

    /**
     * tex image
     * upload pixels or set size to GPU
     * notice: if width and height are undefined, pixels must has both width and height properties!!
     * @param pixels {} pixels to be upload
     */
    Texture2D.prototype.texImage = function(pixels, width, height) {
        var gl = this.gl;

        var isRenderTexture = (pixels == null);
        var isSetSize = ( (width !== undefined) && (height !== undefined) );

        var _width, _height;
        if(isSetSize) {
            _width = width;
            _height = height;
        } else {

            // if need mip maps, make image power of 2
            if(this.generateMipMaps && !(zen3d.isPowerOf2(pixels.width) && zen3d.isPowerOf2(pixels.height)) ) {
                pixels = zen3d.makePowerOf2(pixels);
            }

            _width = pixels.width;
            _height = pixels.height;
        }

        var isPowerOf2 = zen3d.isPowerOf2(_width) && zen3d.isPowerOf2(_height);

        if(isSetSize) {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.dataFormat, _width, _height, this.border, this.dataFormat, this.dataType, pixels);
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.dataFormat, this.dataFormat, this.dataType, pixels);
        }

        if(!isRenderTexture && this.generateMipMaps && isPowerOf2) {
            this.generateMipMap();
        } else {
            this.hasMipMaps = false;
        }

        this.width = _width;
        this.height = _height;

        this.isRenderable = true;

        return this;
    }

    /**
     * generate mipmap
     */
    Texture2D.prototype.generateMipMap = function() {
        var gl = this.gl;
        gl.generateMipmap( gl.TEXTURE_2D );

        this.hasMipMaps = true;

        return this;
    }

    /**
     * get texture from image|TypedArray|canvas
     */
    Texture2D.fromRes = function(gl, data, width, height) {
        var texture = new Texture2D(gl);

        texture.bind().texImage(
            data, width, height
        ).texParam();

        return texture;
    }

    /**
     * get texture from jpg|png|jpeg src
     * texture maybe not init util image is loaded
     */
    Texture2D.fromSrc = function(gl, src) {
        var texture = new Texture2D(gl);

        var image = new Image();
        image.src = src;
        image.onload = function() {

            texture.bind().texImage(
                image
            ).texParam();

        }

        return texture;
    }

    /**
     * create a render texture
     */
    Texture2D.createRenderTexture = function(gl, width, height) {
        var texture = new Texture2D(gl);

        texture.bind().texImage(
            null, width, height
        ).texParam();

        return texture;
    }

    zen3d.Texture2D = Texture2D;
})();