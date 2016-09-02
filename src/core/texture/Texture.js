(function() {
    /**
     * Texture
     * @class
     */
    var Texture = function(gl) {

        this.gl = gl;

        this.width = 0;
        this.height = 0;

        this.isInit = false;

        this.glTexture = gl.createTexture();

        // set webgl texture
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

        // this can set just as a global props?
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        // set repeat
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // a mipmap optimize
        // if (isPowerOfTwo(this.glTexture.width) && isPowerOfTwo(this.glTexture.height)) {
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        //     gl.generateMipmap(gl.TEXTURE_2D);
        // } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    }

    /**
     * uploadImage
     * upload a image for this texture
     */
    Texture.prototype.uploadImage = function(image, bind) {
        var gl = this.gl;

        if(bind) {
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        }

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        this.width = image.width;
        this.height = image.height;

        this.isInit = true;
    }

    /**
     * uploadCheckerboard
     * upload a checker boader for this texture
     */
    Texture.prototype.uploadCheckerboard = function(width, height) {
        var gl = this.gl;

        var pixelArray = new Uint8Array(width * height * 4);

        var colors = [[255, 255, 255, 255], [0, 0, 0, 255]];

        var colorIndex = 0;

        var blockSize = 5;

        for(var y = 0; y < height; y++) {
            for(var x = 0; x < width; x++) {

                if(x == 0) {
                    colorIndex = 1;
                } else if((x % blockSize) == 0) {
                    colorIndex = (colorIndex + 1) % 2;
                }

                if ((y % blockSize) == 0 && x == 0) {
                    var tmp = colors[0];
                    colors[0] = colors[1];
                    colors[1] = tmp;
                }

                pixelArray[(y * (width * 4) + x * 4) + 0] = colors[colorIndex][0];
                pixelArray[(y * (width * 4) + x * 4) + 1] = colors[colorIndex][1];
                pixelArray[(y * (width * 4) + x * 4) + 2] = colors[colorIndex][2];
                pixelArray[(y * (width * 4) + x * 4) + 3] = colors[colorIndex][3];
            }
        }

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixelArray);

        this.width = width;
        this.height = height;

        this.isInit = true;
    }

    zen3d.Texture = Texture;
})();
