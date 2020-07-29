import { Vector3 } from './Vector3.js';

var _points = [
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3()
];

/**
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Vector3} min
 * @param {zen3d.Vector3} max
 */
function Box3(min, max) {
	this.min = (min !== undefined) ? min : new Vector3(+Infinity, +Infinity, +Infinity);
	this.max = (max !== undefined) ? max : new Vector3(-Infinity, -Infinity, -Infinity);
}

Object.assign(Box3.prototype, /** @lends zen3d.Box3.prototype */{

	/**
     *
     */
	set: function(min, max) {
		this.min.copy(min);
		this.max.copy(max);
	},

	/**
     *
     */
	setFromPoints: function(points) {
		this.makeEmpty();

		for (var i = 0, il = points.length; i < il; i++) {
			this.expandByPoint(points[i]);
		}

		return this;
	},

	/**
     *
     */
	makeEmpty: function() {
		this.min.x = this.min.y = this.min.z = +Infinity;
		this.max.x = this.max.y = this.max.z = -Infinity;

		return this;
	},

	/**
     *
     */
	expandByPoint: function(point) {
		this.min.min(point);
		this.max.max(point);

		return this;
	},

	/**
     *
     */
	expandByScalar: function(scalar) {
		this.min.addScalar(-scalar);
		this.max.addScalar(scalar);

		return this;
	},

	/**
	 *
	 */
	expandByBox3: function(box3) {
		this.min.min(box3.min);
		this.max.max(box3.max);

		return this;
	},

	/**
     *
     */
	setFromArray: function(array, gap) {
		var minX = +Infinity;
		var minY = +Infinity;
		var minZ = +Infinity;

		var maxX = -Infinity;
		var maxY = -Infinity;
		var maxZ = -Infinity;

		var _gap = (gap !== undefined ? gap : 3);

		for (var i = 0, l = array.length; i < l; i += _gap) {
			var x = array[i];
			var y = array[i + 1];
			var z = array[i + 2];

			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (z < minZ) minZ = z;

			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
			if (z > maxZ) maxZ = z;
		}

		this.min.set(minX, minY, minZ);
		this.max.set(maxX, maxY, maxZ);

		return this;
	},

	/**
     *
     */
	isEmpty: function() {
		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
		return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
	},

	/**
     *
     */
	equals: function(box) {
		return box.min.equals(this.min) && box.max.equals(this.max);
	},

	/**
     *
     */
	getCenter: function(optionalTarget) {
		var result = optionalTarget || new Vector3();
		return this.isEmpty() ? result.set(0, 0, 0) : result.addVectors(this.min, this.max).multiplyScalar(0.5);
	},

	/**
     * @method
     */
	applyMatrix4: function(matrix) {
		// transform of empty box is an empty box.
		if (this.isEmpty()) return this;

		// NOTE: I am using a binary pattern to specify all 2^3 combinations below
		_points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
		_points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
		_points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
		_points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
		_points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
		_points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
		_points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
		_points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

		this.setFromPoints(_points);

		return this;
	},

	/**
     *
     */
	copy: function(box) {
		this.min.copy(box.min);
		this.max.copy(box.max);

		return this;
	}

});

export { Box3 };