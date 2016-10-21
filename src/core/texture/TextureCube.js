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

        if(this.hasMipMaps) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
        } else {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this._filterFallback(gl, this.magFilter));
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this._filterFallback(gl, this.minFilter));
        }

        var isPowerOf2 = zen3d.isPowerOf2(this.width) && zen3d.isPowerOf2(this.height);

        if(isPowerOf2) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
        } else {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

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

        var pixels = pixelsArray[0];

        var isRenderTexture = (pixels == null);
        var isSetSize = ( (width !== undefined) && (height !== undefined) );

        var _width, _height;
        if(isSetSize) {
            _width = width;
            _height = height;
        } else {

            // if need mip maps, make image power of 2
            // if(this.generateMipMaps && !(zen3d.isPowerOf2(pixels.width) && zen3d.isPowerOf2(pixels.height)) ) {
            //     pixels = zen3d.makePowerOf2(pixels);
            // }

            _width = pixels.width;
            _height = pixels.height;
        }

        var isPowerOf2 = zen3d.isPowerOf2(_width) && zen3d.isPowerOf2(_height);

        for(var i = 0; i < 6; i++) {
            if(isSetSize) {
                gl.texImage2D(faces[i], 0, this.dataFormat, _width, _height, this.border, this.dataFormat, this.dataType, pixelsArray[i]);
            } else {
                gl.texImage2D(faces[i], 0, this.dataFormat, this.dataFormat, this.dataType, pixelsArray[i]);
            }
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
    TextureCube.prototype.generateMipMap = function() {
        var gl = this.gl;
        gl.generateMipmap( gl.TEXTURE_CUBE_MAP );

        this.hasMipMaps = true;

        return this;
    }

    /**
     * get texture from image|TypedArray|canvas
     */
    TextureCube.fromRes = function(gl, dataArray, width, height) {
        var texture = new TextureCube(gl);

        texture.bind().texImage(
            dataArray, width, height
        ).texParam();

        return texture;
    }

    /**
     * get texture from jpg|png|jpeg srcArray
     * texture maybe not init util image is loaded
     */
    TextureCube.fromSrc = function(gl, srcArray) {
        var texture = new TextureCube(gl);

        var count = 0;
        var images = [];
        function next() {
            if(count >= 6) {
                loaded();
                return;
            }

            var image = new Image();
            image.src = srcArray[count];
            image.onload = next;
            images.push(image);
            count++;
        }

        function loaded() {
            texture.bind().texImage(
                images
            ).texParam();
        }

        next();

        return texture;
    }

    /**
     * create a render texture
     */
    TextureCube.createRenderTexture = function(gl, width, height) {
        var texture = new TextureCube(gl);

        texture.bind().texImage(
            [null, null, null, null, null, null], width, height
        ).texParam();

        return texture;
    }

    zen3d.TextureCube = TextureCube;
})();