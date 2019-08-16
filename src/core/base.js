/**
 * Method for generate uuid.
 * ( http://www.broofa.com/Tools/Math.uuid.htm )
 * @method
 * @name zen3d.generateUUID
 * @return {string} - The uuid.
 */
export var generateUUID = (function () {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = new Array(36);
	var rnd = 0, r;

	return function generateUUID() {
		for (var i = 0; i < 36; i++) {
			if (i === 8 || i === 13 || i === 18 || i === 23) {
				uuid[i] = '-';
			} else if (i === 14) {
				uuid[i] = '4';
			} else {
				if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
			}
		}

		return uuid.join('');
	};
})();

/**
 * Is this number a power of two.
 * @method
 * @name zen3d.isPowerOfTwo
 * @param {number} value - The input number.
 * @return {boolean} - Is this number a power of two.
 */
export function isPowerOfTwo(value) {
	return (value & (value - 1)) === 0 && value !== 0;
}

/**
 * Return the nearest power of two number of this number.
 * @method
 * @name zen3d.nearestPowerOfTwo
 * @param {number} value - The input number.
 * @return {number} - The result number.
 */
export function nearestPowerOfTwo(value) {
	return Math.pow(2, Math.round(Math.log(value) / Math.LN2));
}

/**
 * Return the next power of two number of this number.
 * @method
 * @name zen3d.nextPowerOfTwo
 * @param {number} value - The input number.
 * @return {number} - The result number.
 */
export function nextPowerOfTwo(value) {
	value--;
	value |= value >> 1;
	value |= value >> 2;
	value |= value >> 4;
	value |= value >> 8;
	value |= value >> 16;
	value++;

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

	for (var name in uniforms_src) {
		var uniform_src = uniforms_src[name];
		// TODO zen3d object clone
		if (Array.isArray(uniform_src)) {
			uniforms_dst[name] = uniform_src.slice();
		} else {
			uniforms_dst[name] = uniform_src;
		}
	}

	return uniforms_dst;
}