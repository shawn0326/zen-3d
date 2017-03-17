(function() {

    /**
     * get max precision
     * @param gl
     * @param precision {string} the expect precision, can be: "highp"|"mediump"|"lowp"
     */
    function getMaxPrecision(gl, precision) {
        if (precision === 'highp') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
                return 'highp';
            }
            precision = 'mediump';
        }
        if (precision === 'mediump') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
                return 'mediump';
            }
        }
        return 'lowp';
    }

    /**
     * webgl get extension
     */
    var getExtension = function(gl, name) {
        var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
        var ext = null;
        for (var i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) { break; }
        }
        return ext;
    }

    var WebGLCapabilities = function(gl) {
        this.precision = "highp";

        this.maxPrecision = getMaxPrecision(gl, this.precision);

        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

        this.maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);

        this.floatTextures = !!getExtension(gl, 'OES_texture_float');

        // use dfdx and dfdy must enable OES_standard_derivatives
        var ext = getExtension(gl, "OES_standard_derivatives");
        // GL_OES_standard_derivatives
        var ext = getExtension(gl, "GL_OES_standard_derivatives");
    }

    zen3d.WebGLCapabilities = WebGLCapabilities;
})();