var _vector = new Vector3();

/**
 * a vector 3 class
 * @constructor
 * @memberof zen3d
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 */
function Vector3(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}

Object.assign(Vector3.prototype, /** @lends zen3d.Vector3.prototype */{

	/**
     *
     */
	lerpVectors: function(v1, v2, ratio) {
		return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
	},

	/**
     *
     */
	set: function(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;

		return this;
	},

	/**
     *
     */
	min: function(v) {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		this.z = Math.min(this.z, v.z);

		return this;
	},

	/**
     *
     */
	max: function(v) {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		this.z = Math.max(this.z, v.z);

		return this;
	},

	/**
     *
     */
	getLength: function() {
		return Math.sqrt(this.getLengthSquared());
	},

	/**
     *
     */
	getLengthSquared: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},

	/**
     *
     */
	normalize: function(thickness) {
		thickness = thickness || 1;
		var length = this.getLength();
		if (length != 0) {
			var invLength = thickness / length;
			this.x *= invLength;
			this.y *= invLength;
			this.z *= invLength;
			return this;
		}
	},

	/**
     *
     */
	subtract: function(a, target) {
		if (!target) {
			target = new Vector3();
		}
		target.set(this.x - a.x, this.y - a.y, this.z - a.z);
		return target;
	},

	/**
     *
     */
	multiply: function (v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;
	},

	/**
     *
     */
	crossVectors: function(a, b) {
		var ax = a.x,
			ay = a.y,
			az = a.z;
		var bx = b.x,
			by = b.y,
			bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	},

	/**
     *
     */
	cross: function(v) {
		var x = this.x,
			y = this.y,
			z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;
	},

	/**
     *
     */
	negate: function () {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;

		return this;
	},

	/**
     *
     */
	dot: function(a) {
		return this.x * a.x + this.y * a.y + this.z * a.z;
	},

	/**
     *
     */
	applyQuaternion: function(q) {
		var x = this.x,
			y = this.y,
			z = this.z;
		var qx = q._x,
			qy = q._y,
			qz = q._z,
			qw = q._w;

		// calculate quat * vector

		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return this;
	},

	/**
     *
     */
	applyMatrix4: function(m) {
		var x = this.x,
			y = this.y,
			z = this.z;
		var e = m.elements;

		var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

		return this;
	},

	/**
     *
     */
	applyMatrix3: function (m) {
		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[0] * x + e[3] * y + e[6] * z;
		this.y = e[1] * x + e[4] * y + e[7] * z;
		this.z = e[2] * x + e[5] * y + e[8] * z;

		return this;
	},

	/**
     *
     */
	transformDirection: function(m) {
		// input: Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x,
			y = this.y,
			z = this.z;
		var e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z;
		this.y = e[1] * x + e[5] * y + e[9] * z;
		this.z = e[2] * x + e[6] * y + e[10] * z;

		return this.normalize();
	},

	/**
     *
     */
	setFromMatrixPosition: function(m) {
		return this.setFromMatrixColumn(m, 3);
	},

	/**
     *
     */
	setFromMatrixColumn: function(m, index) {
		return this.fromArray(m.elements, index * 4);
	},

	/**
     *
     */
	fromArray: function(array, offset) {
		if (offset === undefined) offset = 0;

		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];

		return this;
	},

	/**
     *
     */
	toArray: function (array, offset) {
		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;

		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;

		return array;
	},

	/**
     *
     */
	copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;
	},

	/**
     *
     */
	addVectors: function(a, b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;
	},

	/**
     *
     */
	addScalar: function(s) {
		this.x += s;
		this.y += s;
		this.z += s;

		return this;
	},

	/**
     *
     */
	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;
	},

	/**
     *
     */
	addScaledVector: function (v, s) {
		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;

		return this;
	},

	/**
     *
     */
	subVectors: function(a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;
	},

	/**
     *
     */
	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;
	},

	/**
     *
     */
	multiplyScalar: function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	},

	/**
     *
     */
	distanceToSquared: function(v) {
		var dx = this.x - v.x,
			dy = this.y - v.y,
			dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;
	},

	/**
     *
     */
	distanceTo: function(v) {
		return Math.sqrt(this.distanceToSquared(v));
	},

	/**
     *
     */
	setFromSpherical: function (s) {
		var sinPhiRadius = Math.sin(s.phi) * s.radius;

		this.x = sinPhiRadius * Math.sin(s.theta);
		this.y = Math.cos(s.phi) * s.radius;
		this.z = sinPhiRadius * Math.cos(s.theta);

		return this;
	},

	/**
     *
     */
	project: function(camera) {
		return this.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);
	},

	/**
     *
     */
	unproject: function(camera) {
		return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.worldMatrix);
	},

	/**
     *
     */
	reflect: function (normal) {
		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
	},

	/**
     *
     */
	equals: function(v) {
		return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
	},

	/**
     *
     */
	clone: function() {
		return new Vector3(this.x, this.y, this.z);
	}

});

export { Vector3 };