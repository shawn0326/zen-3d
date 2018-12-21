/**
 * a vector 4 class
 * @constructor
 * @memberof zen3d
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @param {number} [w=1]
 */
function Vector4(x, y, z, w) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = (w !== undefined) ? w : 1;
}

Object.assign(Vector4.prototype, /** @lends zen3d.Vector4.prototype */{

	/**
     *
     */
	lerpVectors: function(v1, v2, ratio) {
		return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
	},

	/**
     *
     */
	set: function(x, y, z, w) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = (w !== undefined) ? w : 1;

		return this;
	},

	/**
     *
     */
	normalize: function () {
		return this.multiplyScalar(1 / (this.getLength() || 1));
	},

	/**
     *
     */
	multiplyScalar: function (scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;

		return this;
	},

	/**
     *
     */
	getLengthSquared: function () {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	},

	/**
     *
     */
	getLength: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	},

	/**
     *
     */
	applyMatrix4: function(m) {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
		this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
		this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
		this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

		return this;
	},

	/**
     *
     */
	equals: function(v) {
		return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z) && (v.w === this.w));
	},

	/**
     *
     */
	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;
	},

	/**
     *
     */
	multiply: function (v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		this.w *= v.w;

		return this;
	},

	/**
     *
     */
	multiplyScalar: function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;

		return this;
	},

	/**
     *
     */
	subVectors: function(a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;

		return this;
	},

	/**
     *
     */
	copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = (v.w !== undefined) ? v.w : 1;

		return this;
	}

});

export { Vector4 };