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
    
        if(_extensions[name]) {
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

    // use dfdx and dfdy must enable OES_standard_derivatives
    getExtension("OES_standard_derivatives");
    // GL_OES_standard_derivatives
    getExtension("GL_OES_standard_derivatives");
    // WEBGL_depth_texture
    getExtension("WEBGL_depth_texture");
    // draw elements support uint
    getExtension('OES_element_index_uint');
    // use half float
    getExtension('OES_texture_half_float');
    
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
         * @type {string} 
         */
        version: parseFloat(/^WebGL\ ([0-9])/.exec(gl.getParameter(gl.VERSION))[1]),

        /**
         * @type {string} 
         */
        maxPrecision: getMaxPrecision(gl, targetPrecision),

        /**
         * @type {Integer} 
         */
        maxTextures: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),

        /**
         * @type {Integer} 
         */
        maxVertexTextures: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),

        /**
         * @type {Integer} 
         */
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),

        /**
         * @type {Integer} 
         */
        maxCubemapSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),

        /**
         * @type {Integer} 
         */
        maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),

        /**
         * @type {boolean} 
         */
        floatTextures: !!getExtension('OES_texture_float'),

        /**
         * @type {*} 
         */
        shaderTextureLOD: getExtension('EXT_shader_texture_lod'),

        /**
         * @type {*} 
         */
        angleInstancedArraysExt: getExtension('ANGLE_instanced_arrays'),

        /**
         * @type {*} 
         */
        drawBuffersExt: getExtension('WEBGL_draw_buffers'),

        /**
         * @type {*} 
         */
        anisotropyExt: anisotropyExt,

        /**
         * @type {Integer} 
         */
        maxAnisotropy: (anisotropyExt !== null) ? gl.getParameter(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0,

        getExtension: getExtension

    }

}

export {WebGLCapabilities};