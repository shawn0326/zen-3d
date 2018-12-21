import { Vector3 } from './Vector3.js';
import { Matrix4 } from './Matrix4.js';

/**
 * a Quaternion class
 * @constructor
 * @memberof zen3d
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 */
function Quaternion(x, y, z, w) {
	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = (w !== undefined) ? w : 1;
}

Object.defineProperties(Quaternion.prototype, {
	x: {
		get: function() {
			return this._x;
		},
		set: function(value) {
			this._x = value;
			this.onChangeCallback();
		}
	},
	y: {
		get: function() {
			return this._y;
		},
		set: function(value) {
			this._y = value;
			this.onChangeCallback();
		}
	},
	z: {
		get: function() {
			return this._z;
		},
		set: function(value) {
			this._z = value;
			this.onChangeCallback();
		}
	},
	w: {
		get: function() {
			return this._w;
		},
		set: function(value) {
			this._w = value;
			this.onChangeCallback();
		}
	}
});

Object.assign(Quaternion.prototype, /** @lends zen3d.Quaternion.prototype */{

	/**
     *
     */
	normalize: function(thickness) {
		var l = this.length();

		if (l === 0) {
			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;
		} else {
			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;
		}

		this.onChangeCallback();

		return this;
	},

	/**
     *
     */
	length: function () {
		return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
	},

	/**
     * Linearly interpolates between two quaternions.
     */
	lerpQuaternions: function(q1, q2, ratio) {
		var w1 = q1._w, x1 = q1._x, y1 = q1._y, z1 = q1._z;
		var w2 = q2._w, x2 = q2._x, y2 = q2._y, z2 = q2._z;
		var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

		// shortest direction
		if (dot < 0) {
			dot = -dot;
			w2 = -w2;
			x2 = -x2;
			y2 = -y2;
			z2 = -z2;
		}

		this._w = w1 + ratio * (w2 - w1);
		this._x = x1 + ratio * (x2 - x1);
		this._y = y1 + ratio * (y2 - y1);
		this._z = z1 + ratio * (z2 - z1);
		var len = 1.0 / Math.sqrt(this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z);
		this._w *= len;
		this._x *= len;
		this._y *= len;
		this._z *= len;

		this.onChangeCallback();

		return this;
	},

	/**
     * Spherically interpolates between two quaternions
     * providing an interpolation between rotations with constant angle change rate.
     */
	slerpQuaternions: function(q1, q2, ratio) {
		var w1 = q1._w, x1 = q1._x, y1 = q1._y, z1 = q1._z;
		var w2 = q2._w, x2 = q2._x, y2 = q2._y, z2 = q2._z;
		var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

		// shortest direction
		if (dot < 0) {
			dot = -dot;
			w2 = -w2;
			x2 = -x2;
			y2 = -y2;
			z2 = -z2;
		}

		if (dot < 0.95) {
			var angle = Math.acos(dot);
			var s = 1 / Math.sin(angle);
			var s1 = Math.sin(angle * (1 - ratio)) * s;
			var s2 = Math.sin(angle * ratio) * s;
			this._w = w1 * s1 + w2 * s2;
			this._x = x1 * s1 + x2 * s2;
			this._y = y1 * s1 + y2 * s2;
			this._z = z1 * s1 + z2 * s2;
		} else {
			// nearly identical angle, interpolate linearly
			this._w = w1 + ratio * (w2 - w1);
			this._x = x1 + ratio * (x2 - x1);
			this._y = y1 + ratio * (y2 - y1);
			this._z = z1 + ratio * (z2 - z1);
			var len = 1.0 / Math.sqrt(this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z);
			this._w *= len;
			this._x *= len;
			this._y *= len;
			this._z *= len;
		}

		this.onChangeCallback();

		return this;
	},

	/**
     *
     */
	set: function(x, y, z, w) {
		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._w = (w !== undefined) ? w : 1;

		this.onChangeCallback();

		return this;
	},

	/**
     *
     */
	copy: function(v) {
		this._x = v.x;
		this._y = v.y;
		this._z = v.z;
		this._w = (v.w !== undefined) ? v.w : 1;

		this.onChangeCallback();

		return this;
	},

	/**
     *
     */
	setFromEuler: function(euler, update) {
		var c1 = Math.cos(euler._x / 2);
		var c2 = Math.cos(euler._y / 2);
		var c3 = Math.cos(euler._z / 2);
		var s1 = Math.sin(euler._x / 2);
		var s2 = Math.sin(euler._y / 2);
		var s3 = Math.sin(euler._z / 2);

		var order = euler._order;

		if (order === 'XYZ') {
			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === 'YXZ') {
			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (order === 'ZXY') {
			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === 'ZYX') {
			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (order === 'YZX') {
			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === 'XZY') {
			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;
		}

		if (update !== false) this.onChangeCallback();

		return this;
	},

	/**
     *
     */
	setFromRotationMatrix: function (m) {
		var te = m.elements,

			m11 = te[0], m12 = te[4], m13 = te[8],
			m21 = te[1], m22 = te[5], m23 = te[9],
			m31 = te[2], m32 = te[6], m33 = te[10],

			trace = m11 + m22 + m33,
			s;

		if (trace > 0) {
			s = 0.5 / Math.sqrt(trace + 1.0);

			this._w = 0.25 / s;
			this._x = (m32 - m23) * s;
			this._y = (m13 - m31) * s;
			this._z = (m21 - m12) * s;
		} else if (m11 > m22 && m11 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

			this._w = (m32 - m23) / s;
			this._x = 0.25 * s;
			this._y = (m12 + m21) / s;
			this._z = (m13 + m31) / s;
		} else if (m22 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

			this._w = (m13 - m31) / s;
			this._x = (m12 + m21) / s;
			this._y = 0.25 * s;
			this._z = (m23 + m32) / s;
		} else {
			s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

			this._w = (m21 - m12) / s;
			this._x = (m13 + m31) / s;
			this._y = (m23 + m32) / s;
			this._z = 0.25 * s;
		}

		this.onChangeCallback();

		return this;
	},

	/**
     * @method
     */
	setFromUnitVectors: function () {
		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1 = new Vector3();
		var r;

		var EPS = 0.000001;

		return function setFromUnitVectors(vFrom, vTo) {
			if (v1 === undefined) v1 = new Vector3();

			r = vFrom.dot(vTo) + 1;

			if (r < EPS) {
				r = 0;

				if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
					v1.set(-vFrom.y, vFrom.x, 0);
				} else {
					v1.set(0, -vFrom.z, vFrom.y);
				}
			} else {
				v1.crossVectors(vFrom, vTo);
			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			return this.normalize();
		};
	}(),

	/**
     *
     */
	multiply: function (q) {
		return this.multiplyQuaternions(this, q);
	},

	/**
     *
     */
	premultiply: function (q) {
		return this.multiplyQuaternions(q, this);
	},

	/**
     *
     */
	multiplyQuaternions: function (a, b) {
		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this.onChangeCallback();

		return this;
	},

	/**
     *
     */
	toMatrix4: function(target) {
		if (!target) {
			target = new Matrix4();
		}
		var ele = target.elements;

		var xy2 = 2.0 * this._x * this._y, xz2 = 2.0 * this._x * this._z, xw2 = 2.0 * this._x * this._w;
		var yz2 = 2.0 * this._y * this._z, yw2 = 2.0 * this._y * this._w, zw2 = 2.0 * this._z * this._w;
		var xx = this._x * this._x, yy = this._y * this._y, zz = this._z * this._z, ww = this._w * this._w;

		ele[0] = xx - yy - zz + ww;
		ele[4] = xy2 - zw2;
		ele[8] = xz2 + yw2;
		ele[12] = 0;
		ele[1] = xy2 + zw2;
		ele[5] = -xx + yy - zz + ww;
		ele[9] = yz2 - xw2;
		ele[13] = 0;
		ele[2] = xz2 - yw2;
		ele[6] = yz2 + xw2;
		ele[10] = -xx - yy + zz + ww;
		ele[14] = 0;
		ele[3] = 0.0;
		ele[7] = 0.0;
		ele[11] = 0;
		ele[15] = 1;

		return target;
	},

	/**
     *
     */
	dot: function (v) {
		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
	},

	/**
     * Set quaternion from axis angle
     */
	setFromAxisAngle: function(axis, angle) {
		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin(halfAngle);

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos(halfAngle);

		this.onChangeCallback();

		return this;
	},

	/**
     *
     */
	fromArray: function (array, offset) {
		if (offset === undefined) offset = 0;

		this._x = array[offset];
		this._y = array[offset + 1];
		this._z = array[offset + 2];
		this._w = array[offset + 3];

		this.onChangeCallback();

		return this;
	},

	onChange: function(callback) {
		this.onChangeCallback = callback;

		return this;
	},

	onChangeCallback: function() {}

});

Object.assign(Quaternion, {

	/**
     * @memberof zen3d.Quaternion
     */
	slerpFlat: function (dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
		// fuzz-free, array-based Quaternion SLERP operation

		var x0 = src0[srcOffset0 + 0],
			y0 = src0[srcOffset0 + 1],
			z0 = src0[srcOffset0 + 2],
			w0 = src0[srcOffset0 + 3],

			x1 = src1[srcOffset1 + 0],
			y1 = src1[srcOffset1 + 1],
			z1 = src1[srcOffset1 + 2],
			w1 = src1[srcOffset1 + 3];

		if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
			var s = 1 - t,

				cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

				dir = (cos >= 0 ? 1 : -1),
				sqrSin = 1 - cos * cos;

			// Skip the Slerp for tiny steps to avoid numeric problems:
			if (sqrSin > Number.EPSILON) {
				var sin = Math.sqrt(sqrSin),
					len = Math.atan2(sin, cos * dir);

				s = Math.sin(s * len) / sin;
				t = Math.sin(t * len) / sin;
			}

			var tDir = t * dir;

			x0 = x0 * s + x1 * tDir;
			y0 = y0 * s + y1 * tDir;
			z0 = z0 * s + z1 * tDir;
			w0 = w0 * s + w1 * tDir;

			// Normalize in case we just did a lerp:
			if (s === 1 - t) {
				var f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

				x0 *= f;
				y0 *= f;
				z0 *= f;
				w0 *= f;
			}
		}

		dst[dstOffset] = x0;
		dst[dstOffset + 1] = y0;
		dst[dstOffset + 2] = z0;
		dst[dstOffset + 3] = w0;
	}

});

export { Quaternion };