(function() {
    /**
     * TextureCube
     * @class
     * @extends TextureBase
     */
    var TextureCube = function(gl, options) {
        TextureCube.superClass.constructor.call(this, gl, options);

        var gl = this.gl;

        // faces direction
        this.faces = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];
    }

    zen3d.inherit(TextureCube, zen3d.TextureBase);

    /**
     * bind texture
     */
    TextureCube.prototype.bind = function() {
        var gl = this.gl;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.glTexture);

        return this;
    }

    /**
     * tex parameteri
     */
    TextureCube.prototype.texParam = function() {
        var gl = this.gl;

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);

        return this;
    }

    /**
     * tex image
     * upload image or set size to GPU
     * notice: if width and height are undefined, pixels must has both width and height properties!!
     * @param pixelsArray {Array} pixels array, order: right, left, up, down, back, front.
     */
    TextureCube.prototype.texImage = function(pixelsArray, width, height) {
        var gl = this.gl;
        var faces = this.faces;

        for(var i = 0; i < 6; i++) {
            if((width !== undefined) && (height !== undefined)) {
                gl.texImage2D(faces[i], 0, this.dataFormat, width, height, this.border, this.dataFormat, this.dataType, pixelsArray[i]);
            } else {
                gl.texImage2D(faces[i], 0, this.dataFormat, this.dataFormat, this.dataType, pixelsArray[i]);
            }
        }

        if((width !== undefined) && (height !== undefined)) {
            this.width = width;
            this.height = height;
        } else {
            this.width = pixelsArray[0].width;
            this.height = pixelsArray[0].height;
        }

        this.isRenderable = true;

        return this;
    }

    /**
     * get texture from image|TypedArray|canvas
     */
    TextureCube.fromRes = function(gl, dataArray, width, height) {
        var texture = new TextureCube(gl);

        texture.bind().texParam().texImage(
            dataArray, width, height
        );

        return texture;
    }

    /**
     * get texture from jpg|png|jpeg srcArray
     * texture maybe not init util image is loaded
     */
    TextureCube.fromSrc = function(gl, srcArray) {
        // TODO need a load list
    }

    /**
     * create a render texture
     */
    TextureCube.createRenderTexture = function(gl, width, height) {
        var texture = new TextureCube(gl);

        texture.bind().texParam().texImage(
            [null, null, null, null, null, null], width, height
        );

        return texture;
    }

    zen3d.TextureCube = TextureCube;
})();