/**
 * Method for generate uuid.
 * ( http://www.broofa.com/Tools/Math.uuid.htm )
 * @method
 * @name zen3d.generateUUID
 * @return {string} - The uuid.
 */
export var generateUUID = (function () {

    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
    var uuid = new Array( 36 );
    var rnd = 0, r;

    return function generateUUID() {

        for ( var i = 0; i < 36; i ++ ) {

            if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                uuid[ i ] = '-';

            } else if ( i === 14 ) {

                uuid[ i ] = '4';

            } else {

                if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

            }

        }

        return uuid.join( '' );

    };

})();

/**
 * Is mobile.
 * @name zen3d.isMobile
 * @type {boolean}
 */
export var isMobile = (function () {
    if (!window.navigator) {
        return true;
    }
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
})();

/**
 * Is web.
 * @name zen3d.isWeb
 * @type {boolean}
 */
export var isWeb = (function () {
    return !!document;
})();

/**
 * Create an Checker Board Pixels Data.
 * @method
 * @name zen3d.createCheckerBoardPixels
 * @param {number} width - The width of the pixels.
 * @param {number} height - The height of the pixels.
 * @param {number} [blockSize=5] - The block size of the Checker Board.
 * @return {Uint8Array} - The Board Pixels Data.
 */
export function createCheckerBoardPixels(width, height, blockSize) {
    var pixelArray = new Uint8Array(width * height * 4);

    // white and blasck
    var colors = [[255, 255, 255, 255], [0, 0, 0, 255]];

    blockSize = blockSize || 5;

    var colorIndex = 0;

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

    return pixelArray;
}

/**
 * Is this number a power of two.
 * @method
 * @name zen3d.isPowerOfTwo
 * @param {number} value - The input number.
 * @return {boolean} - Is this number a power of two.
 */
export function isPowerOfTwo(value) {
    return ( value & ( value - 1 ) ) === 0 && value !== 0;
}

/**
 * Return the nearest power of two number of this number.
 * @method
 * @name zen3d.nearestPowerOfTwo
 * @param {number} value - The input number.
 * @return {number} - The result number.
 */
export function nearestPowerOfTwo( value ) {
    return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );
}

/**
 * Return the next power of two number of this number.
 * @method
 * @name zen3d.nextPowerOfTwo
 * @param {number} value - The input number.
 * @return {number} - The result number.
 */
export function nextPowerOfTwo( value ) {
    value --;
    value |= value >> 1;
    value |= value >> 2;
    value |= value >> 4;
    value |= value >> 8;
    value |= value >> 16;
    value ++;

    return value;
}

/**
 * Clone Object of Uniforms.
 * @method
 * @name zen3d.cloneUniforms
 * @param {Object} value - The input uniforms.
 * @return {Object} - The result uniforms.
 */
export function cloneUniforms(uniforms_src) {
    var uniforms_dst = {};

    for(var name in uniforms_src) {
        var uniform_src = uniforms_src[name];
        // TODO zen3d object clone
        if ( Array.isArray( uniform_src ) ) {
            uniforms_dst[name] = uniform_src.slice();
        } else {
            uniforms_dst[name] = uniform_src;
        }
    }

    return uniforms_dst;
}

/**
 * Generate {@link https://en.wikipedia.org/wiki/Halton_sequence halton sequence}.
 * @method
 * @name zen3d.halton
 * @param {number} index
 * @param {number} base
 * @return {number} - The result halton number.
 */
export function halton(index, base) {
    var result = 0;
    var f = 1 / base;
    var i = index;
    while (i > 0) {
        result = result + f * (i % base);
        i = Math.floor(i / base);
        f = f / base;
    }
    return result;
}