/**
 * WebGL capabilities.
 * @constructor
 * @hideconstructor
 * @memberof zen3d
 * @param {WebGLRenderingContext} gl
 */
function WebGLCapabilities(gl) {

    var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
    var _extensions = {};

    /**
     * Method to get WebGL extensions.
     * @memberof zen3d.WebGLCapabilities#
     * @param {string} name
     * @return {*}
     */
    function getExtension(name) {

        if (_extensions[name] || _extensions[name] === null) {
            return _extensions[name];
        }

        var ext = null;
        for (var i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) {
                break;
            }
        }
        _extensions[name] = ext;

        return ext;

    }

    var targetPrecision = "highp";

    /**
     * Get max precision.
     * @param {WebGLRenderingContext} gl
     * @param {string} precision - The expect precision, can be: "highp"|"mediump"|"lowp".
     * @return {string}
     * @ignore
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

    // This extension is available to both, WebGL1 and WebGL2 contexts.
    var anisotropyExt = getExtension('EXT_texture_filter_anisotropic');

    return /** @lends zen3d.WebGLCapabilities# */{

        /**
         * WebGL version.
         * @type {number}
         */
        version: parseFloat(/^WebGL\ ([0-9])/.exec(gl.getParameter(gl.VERSION))[1]),

        /**
         * The max precision supported in shaders.
         * @type {string}
         */
        maxPrecision: getMaxPrecision(gl, targetPrecision),

        /**
         * The max texture units.
         * @type {Integer}
         */
        maxTextures: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),

        /**
         * Max vertex texture units.
         * @type {Integer}
         */
        maxVertexTextures: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),

        /**
         * The max texture size.
         * @type {Integer}
         */
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),

        /**
         * The max cube map texture size.
         * @type {Integer}
         */
        maxCubemapSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),

        /**
         * The max vertex uniform vectors.
         * @type {Integer}
         */
        maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),

        /**
         * Getting the range of available widths.
         * @type {Float32Array}
         */
        lineWidthRange: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),

        /**
         * The EXT_texture_filter_anisotropic extension.
         * @type {*}
         */
        anisotropyExt: anisotropyExt,

        /**
         * The max anisotropic value.
         * @type {Integer}
         */
        maxAnisotropy: (anisotropyExt !== null) ? gl.getParameter(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1,

        getExtension: getExtension

    }

}

export { WebGLCapabilities };