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

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

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

        if((width !== undefined) && (height !== undefined)) {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.dataFormat, width, height, this.border, this.dataFormat, this.dataType, pixels);

            this.width = width;
            this.height = height;
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.dataFormat, this.dataFormat, this.dataType, pixels);

            this.width = pixels.width;
            this.height = pixels.height;
        }

        this.isRenderable = true;

        return this;
    }

    /**
     * get texture from image|TypedArray|canvas
     */
    Texture2D.fromRes = function(gl, data, width, height) {
        var texture = new Texture2D(gl);

        texture.bind().texParam().texImage(
            data, width, height
        );

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

            texture.bind().texParam().texImage(
                image
            );

        }

        return texture;
    }

    /**
     * create a render texture
     */
    Texture2D.createRenderTexture = function(gl, width, height) {
        var texture = new Texture2D(gl);

        texture.bind().texParam().texImage(
            null, width, height
        );

        return texture;
    }

    zen3d.Texture2D = Texture2D;
})();