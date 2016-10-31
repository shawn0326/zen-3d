(function() {

    /**
     * get max precision
     * @param gl
     * @param precision {string} the expect precision, can be: "highp"|"mediump"|"lowp"
     */
    function getMaxPrecision(gl, precision) {
		if ( precision === 'highp' ) {
			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision > 0 ) {
				return 'highp';
			}
			precision = 'mediump';
		}
		if ( precision === 'mediump' ) {
			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision > 0 ) {
				return 'mediump';
			}
		}
		return 'lowp';
	}


    var WebGLCapabilities = function(gl) {
        this.precision = "highp";

        this.maxPrecision = getMaxPrecision(gl, this.precision);

        this.maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );

        this.maxTextureSize = gl.getParameter( gl.MAX_TEXTURE_SIZE );
        this.maxCubemapSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE );
    }

    zen3d.WebGLCapabilities = WebGLCapabilities;
})();