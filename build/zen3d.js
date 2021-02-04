// github.com/shawn0326/zen-3d
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zen3d = {}));
}(this, (function (exports) { 'use strict';

	var _lut = [];

	for (var i = 0; i < 256; i++) {
		_lut[i] = (i < 16 ? '0' : '') + i.toString(16);
	}
	/**
	 * Method for generate uuid.
	 * ( http://www.broofa.com/Tools/Math.uuid.htm )
	 * @method
	 * @name zen3d.generateUUID
	 * @return {string} - The uuid.
	 */


	function generateUUID() {
		// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		var uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' + _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' + _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] + _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff]; // .toUpperCase() here flattens concatenated strings to save heap memory space.

		return uuid.toUpperCase();
	}
	/**
	 * Is this number a power of two.
	 * @method
	 * @name zen3d.isPowerOfTwo
	 * @param {number} value - The input number.
	 * @return {boolean} - Is this number a power of two.
	 */

	function isPowerOfTwo(value) {
		return (value & value - 1) === 0 && value !== 0;
	}
	/**
	 * Return the nearest power of two number of this number.
	 * @method
	 * @name zen3d.nearestPowerOfTwo
	 * @param {number} value - The input number.
	 * @return {number} - The result number.
	 */

	function nearestPowerOfTwo(value) {
		return Math.pow(2, Math.round(Math.log(value) / Math.LN2));
	}
	/**
	 * Return the next power of two number of this number.
	 * @method
	 * @name zen3d.nextPowerOfTwo
	 * @param {number} value - The input number.
	 * @return {number} - The result number.
	 */

	function nextPowerOfTwo(value) {
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

	function cloneUniforms(uniforms_src) {
		var uniforms_dst = {};

		for (var name in uniforms_src) {
			var uniform_src = uniforms_src[name]; // TODO zen3d object clone

			if (Array.isArray(uniform_src)) {
				uniforms_dst[name] = uniform_src.slice();
			} else {
				uniforms_dst[name] = uniform_src;
			}
		}

		return uniforms_dst;
	}

	/**
	 * Enum for object Type.
	 * @name zen3d.OBJECT_TYPE
	 * @readonly
	 * @enum {string}
	 */
	var OBJECT_TYPE = {
		MESH: "mesh",
		SKINNED_MESH: "skinned_mesh",
		LIGHT: "light",
		CAMERA: "camera",
		SCENE: "scene",
		GROUP: "group"
	};
	/**
	 * Enum for light Type.
	 * @name zen3d.LIGHT_TYPE
	 * @readonly
	 * @enum {string}
	 */

	var LIGHT_TYPE = {
		AMBIENT: "ambient",
		DIRECT: "direct",
		POINT: "point",
		SPOT: "spot"
	};
	/**
	 * Enum for material Type.
	 * @name zen3d.MATERIAL_TYPE
	 * @readonly
	 * @enum {string}
	 */

	var MATERIAL_TYPE = {
		BASIC: "basic",
		LAMBERT: "lambert",
		PHONG: "phong",
		PBR: "pbr",
		PBR2: "pbr2",
		MATCAP: 'matcap',
		POINT: "point",
		LINE: "line",
		SHADER: "shader",
		DEPTH: "depth",
		DISTANCE: "distance"
	};
	/**
	 * Enum for fog Type.
	 * @name zen3d.FOG_TYPE
	 * @readonly
	 * @enum {string}
	 */

	var FOG_TYPE = {
		NORMAL: "normal",
		EXP2: "exp2"
	};
	/**
	 * Enum for blend Type.
	 * @name zen3d.BLEND_TYPE
	 * @readonly
	 * @enum {string}
	 */

	var BLEND_TYPE = {
		NONE: "none",
		NORMAL: "normal",
		ADD: "add",
		CUSTOM: "custom"
	};
	/**
	 * Enum for blend equation.
	 * @name zen3d.BLEND_EQUATION
	 * @readonly
	 * @enum {number}
	 */

	var BLEND_EQUATION = {
		ADD: 0x8006,
		SUBTRACT: 0x800A,
		REVERSE_SUBTRACT: 0x800B
	};
	/**
	 * Enum for blend factor.
	 * @name zen3d.BLEND_FACTOR
	 * @readonly
	 * @enum {number}
	 */

	var BLEND_FACTOR = {
		ZERO: 0,
		ONE: 1,
		SRC_COLOR: 0x0300,
		ONE_MINUS_SRC_COLOR: 0x0301,
		SRC_ALPHA: 0x0302,
		ONE_MINUS_SRC_ALPHA: 0x0303,
		DST_ALPHA: 0x0304,
		ONE_MINUS_DST_ALPHA: 0x0305,
		DST_COLOR: 0x0306,
		ONE_MINUS_DST_COLOR: 0x0307
	};
	/**
	 * Enum for cull face Type.
	 * @name zen3d.CULL_FACE_TYPE
	 * @readonly
	 * @enum {string}
	 */

	var CULL_FACE_TYPE = {
		NONE: "none",
		FRONT: "front",
		BACK: "back",
		FRONT_AND_BACK: "front_and_back"
	};
	/**
	 * Enum for draw side.
	 * @name zen3d.DRAW_SIDE
	 * @readonly
	 * @enum {string}
	 */

	var DRAW_SIDE = {
		FRONT: "front",
		BACK: "back",
		DOUBLE: "double"
	};
	/**
	 * Enum for shading side.
	 * @name zen3d.SHADING_TYPE
	 * @readonly
	 * @enum {string}
	 */

	var SHADING_TYPE = {
		SMOOTH_SHADING: "smooth_shading",
		FLAT_SHADING: "flat_shading"
	};
	/**
	 * Enum for WebGL Texture Type.
	 * @name zen3d.WEBGL_TEXTURE_TYPE
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_TEXTURE_TYPE = {
		TEXTURE_2D: 0x0DE1,
		TEXTURE_CUBE_MAP: 0x8513,
		TEXTURE_3D: 0x806F // webgl2

	};
	/**
	 * Enum for WebGL pixel format.
	 * @name zen3d.WEBGL_PIXEL_FORMAT
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_PIXEL_FORMAT = {
		DEPTH_COMPONENT: 0x1902,
		DEPTH_STENCIL: 0x84F9,
		ALPHA: 0x1906,
		RED: 0x1903,
		// webgl2
		RGB: 0x1907,
		RGBA: 0x1908,
		LUMINANCE: 0x1909,
		LUMINANCE_ALPHA: 0x190A,
		// only for internal formats
		R8: 0x8229,
		// webgl2
		RGBA8: 0x8058,
		RGBA16F: 0x881A,
		RGBA32F: 0x8814,
		DEPTH_COMPONENT16: 0x81A5,
		DEPTH_COMPONENT24: 0x81A6,
		DEPTH_COMPONENT32F: 0x8CAC,
		DEPTH24_STENCIL8: 0x88F0,
		DEPTH32F_STENCIL8: 0x8CAD
	};
	/**
	 * Enum for WebGL pixel Type.
	 * @name zen3d.WEBGL_PIXEL_TYPE
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_PIXEL_TYPE = {
		BYTE: 0x1400,
		UNSIGNED_BYTE: 0x1401,
		SHORT: 0x1402,
		UNSIGNED_SHORT: 0x1403,
		INT: 0x1404,
		UNSIGNED_INT: 0x1405,
		FLOAT: 0x1406,
		HALF_FLOAT: 36193,
		UNSIGNED_INT_24_8: 0x84FA,
		UNSIGNED_SHORT_4_4_4_4: 0x8033,
		UNSIGNED_SHORT_5_5_5_1: 0x8034,
		UNSIGNED_SHORT_5_6_5: 0x8363,
		FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8DAD
	};
	/**
	 * Enum for WebGL Texture filter.
	 * @name zen3d.WEBGL_TEXTURE_FILTER
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_TEXTURE_FILTER = {
		NEAREST: 0x2600,
		LINEAR: 0x2601,
		NEAREST_MIPMAP_NEAREST: 0x2700,
		LINEAR_MIPMAP_NEAREST: 0x2701,
		NEAREST_MIPMAP_LINEAR: 0x2702,
		LINEAR_MIPMAP_LINEAR: 0x2703
	};
	/**
	 * Enum for WebGL Texture wrap.
	 * @name zen3d.WEBGL_TEXTURE_WRAP
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_TEXTURE_WRAP = {
		REPEAT: 0x2901,
		CLAMP_TO_EDGE: 0x812F,
		MIRRORED_REPEAT: 0x8370
	};
	/**
	 * Enum for WebGL compare function.
	 * @name zen3d.WEBGL_COMPARE_FUNC
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_COMPARE_FUNC = {
		LEQUAL: 0x0203,
		GEQUAL: 0x0206,
		LESS: 0x0201,
		GREATER: 0x0204,
		EQUAL: 0x0202,
		NOTEQUAL: 0x0205,
		ALWAYS: 0x0207,
		NEVER: 0x0200
	};
	/**
	 * Enum for WebGL Operation.
	 * @name zen3d.WEBGL_OP
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_OP = {
		KEEP: 0x1E00,
		REPLACE: 0x1E01,
		INCR: 0x1E02,
		DECR: 0x1E03,
		INVERT: 0x150A,
		INCR_WRAP: 0x8507,
		DECR_WRAP: 0x8508
	};
	/**
	 * Enum for WebGL Uniform Type.
	 * Taken from the {@link http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14 WebGl spec}.
	 * @name zen3d.WEBGL_UNIFORM_TYPE
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_UNIFORM_TYPE = {
		FLOAT_VEC2: 0x8B50,
		FLOAT_VEC3: 0x8B51,
		FLOAT_VEC4: 0x8B52,
		INT_VEC2: 0x8B53,
		INT_VEC3: 0x8B54,
		INT_VEC4: 0x8B55,
		BOOL: 0x8B56,
		BOOL_VEC2: 0x8B57,
		BOOL_VEC3: 0x8B58,
		BOOL_VEC4: 0x8B59,
		FLOAT_MAT2: 0x8B5A,
		FLOAT_MAT3: 0x8B5B,
		FLOAT_MAT4: 0x8B5C,
		SAMPLER_2D: 0x8B5E,
		SAMPLER_2D_SHADOW: 0x8B62,
		SAMPLER_CUBE: 0x8B60,
		SAMPLER_CUBE_SHADOW: 0x8DC5,
		SAMPLER_3D: 0x8B5F,
		BYTE: 0xffff,
		UNSIGNED_BYTE: 0x1401,
		SHORT: 0x1402,
		UNSIGNED_SHORT: 0x1403,
		INT: 0x1404,
		UNSIGNED_INT: 0x1405,
		FLOAT: 0x1406
	};
	/**
	 * Enum for WebGL Attribute Type.
	 * @name zen3d.WEBGL_ATTRIBUTE_TYPE
	 * @readonly
	 * @enum {number}
	 */

	var WEBGL_ATTRIBUTE_TYPE = {
		FLOAT_VEC2: 0x8B50,
		FLOAT_VEC3: 0x8B51,
		FLOAT_VEC4: 0x8B52,
		FLOAT: 0x1406,
		BYTE: 0xffff,
		UNSIGNED_BYTE: 0x1401,
		UNSIGNED_SHORT: 0x1403
	};
	/**
	 * Enum for Shadow Type.
	 * @name zen3d.SHADOW_TYPE
	 * @readonly
	 * @enum {number}
	 */

	var SHADOW_TYPE = {
		HARD: "hard",
		POISSON_SOFT: "poisson_soft",
		PCF3_SOFT: "pcf3_soft",
		PCF5_SOFT: "pcf5_soft",
		PCSS16_SOFT: "pcss16_soft",
		// webgl2
		PCSS32_SOFT: "pcss32_soft",
		// webgl2
		PCSS64_SOFT: "pcss64_soft" // webgl2

	};
	/**
	 * Enum for Texel Encoding Type.
	 * @name zen3d.TEXEL_ENCODING_TYPE
	 * @readonly
	 * @enum {number}
	 */

	var TEXEL_ENCODING_TYPE = {
		LINEAR: "linear",
		SRGB: "sRGB",
		RGBE: "RGBE",
		RGBM7: "RGBM7",
		RGBM16: "RGBM16",
		RGBD: "RGBD",
		GAMMA: "Gamma"
	};
	/**
	 * Enum for Envmap Combine Type.
	 * @name zen3d.ENVMAP_COMBINE_TYPE
	 * @readonly
	 * @enum {number}
	 */

	var ENVMAP_COMBINE_TYPE = {
		MULTIPLY: "ENVMAP_BLENDING_MULTIPLY",
		MIX: "ENVMAP_BLENDING_MIX",
		ADD: "ENVMAP_BLENDING_ADD"
	};
	/**
	 * Enum for Draw Mode.
	 * @name zen3d.DRAW_MODE
	 * @readonly
	 * @enum {number}
	 */

	var DRAW_MODE = {
		POINTS: 0,
		LINES: 1,
		LINE_LOOP: 2,
		LINE_STRIP: 3,
		TRIANGLES: 4,
		TRIANGLE_STRIP: 5,
		TRIANGLE_FAN: 6
	};
	/**
	 * Enum for Vertex Color.
	 * @name zen3d.VERTEX_COLOR
	 * @readonly
	 * @enum {number}
	 */

	var VERTEX_COLOR = {
		NONE: 0,
		RGB: 1,
		RGBA: 2
	};
	/**
	 * Enum for ATTACHMENT
	 * @name zen3d.ATTACHMENT
	 * @readonly
	 * @enum {number}
	 */

	var ATTACHMENT = {
		COLOR_ATTACHMENT0: 0x8CE0,
		COLOR_ATTACHMENT1: 0x8CE1,
		COLOR_ATTACHMENT2: 0x8CE2,
		COLOR_ATTACHMENT3: 0x8CE3,
		COLOR_ATTACHMENT4: 0x8CE4,
		COLOR_ATTACHMENT5: 0x8CE5,
		COLOR_ATTACHMENT6: 0x8CE6,
		COLOR_ATTACHMENT7: 0x8CE7,
		COLOR_ATTACHMENT8: 0x8CE8,
		COLOR_ATTACHMENT9: 0x8CE9,
		COLOR_ATTACHMENT10: 0x8CE10,
		COLOR_ATTACHMENT11: 0x8CE11,
		COLOR_ATTACHMENT12: 0x8CE12,
		COLOR_ATTACHMENT13: 0x8CE13,
		COLOR_ATTACHMENT14: 0x8CE14,
		COLOR_ATTACHMENT15: 0x8CE15,
		DEPTH_ATTACHMENT: 0x8D00,
		STENCIL_ATTACHMENT: 0x8D20,
		DEPTH_STENCIL_ATTACHMENT: 0x821A
	};
	/**
	 * Enum for DRAW_BUFFER
	 * @name zen3d.DRAW_BUFFER
	 * @readonly
	 * @enum {number}
	 */

	var DRAW_BUFFER = {
		DRAW_BUFFER0: 0x8825,
		DRAW_BUFFER1: 0x8826,
		DRAW_BUFFER2: 0x8827,
		DRAW_BUFFER3: 0x8828,
		DRAW_BUFFER4: 0x8829,
		DRAW_BUFFER5: 0x882A,
		DRAW_BUFFER6: 0x882B,
		DRAW_BUFFER7: 0x882C,
		DRAW_BUFFER8: 0x882D,
		DRAW_BUFFER9: 0x882E,
		DRAW_BUFFER10: 0x882F,
		DRAW_BUFFER11: 0x8830,
		DRAW_BUFFER12: 0x8831,
		DRAW_BUFFER13: 0x8832,
		DRAW_BUFFER14: 0x8833,
		DRAW_BUFFER15: 0x8834
	};

	/**
	 * JavaScript events for custom objects.
	 * @memberof zen3d
	 * @constructor
	 */
	function EventDispatcher() {
		this.eventMap = {};
	}

	Object.assign(EventDispatcher.prototype,
	/** @lends zen3d.EventDispatcher.prototype */
	{
		/**
				* Adds a listener to an event type.
				* @param {string} type - The type of event to listen to.
				* @param {function} listener - The function that gets called when the event is fired.
				* @param {Object} [thisObject = this] - The Object of calling listener method.
				*/
		addEventListener: function addEventListener(type, listener, thisObject) {
			var list = this.eventMap[type];

			if (!list) {
				list = this.eventMap[type] = [];
			}

			list.push({
				listener: listener,
				thisObject: thisObject || this
			});
		},

		/**
				* Removes a listener from an event type.
				* @param {string} type - The type of the listener that gets removed.
				* @param {function} listener - The listener function that gets removed.
				* @param {Object} [thisObject = this] thisObject - The Object of calling listener method.
				*/
		removeEventListener: function removeEventListener(type, listener, thisObject) {
			var list = this.eventMap[type];

			if (!list) {
				return;
			}

			for (var i = 0, len = list.length; i < len; i++) {
				var bin = list[i];

				if (bin.listener == listener && bin.thisObject == (thisObject || this)) {
					list.splice(i, 1);
					break;
				}
			}
		},

		/**
				* Fire an event type.
				* @param {Object} event - The event that gets fired.
				*/
		dispatchEvent: function dispatchEvent(event) {
			event.target = this;
			this.notifyListener(event);
		},

		/**
				* notify listener
				* @private
				* @param {Object} event - The event that gets fired.
				*/
		notifyListener: function notifyListener(event) {
			var list = this.eventMap[event.type];

			if (!list) {
				return;
			}

			for (var i = 0, len = list.length; i < len; i++) {
				var bin = list[i];
				bin.listener.call(bin.thisObject, event);
			}
		}
	});

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

	Object.assign(Vector3.prototype,
	/** @lends zen3d.Vector3.prototype */
	{
		/**
				*
				*/
		lerpVectors: function lerpVectors(v1, v2, ratio) {
			return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
		},

		/**
				*
				*/
		set: function set(x, y, z) {
			this.x = x || 0;
			this.y = y || 0;
			this.z = z || 0;
			return this;
		},

		/**
				*
				*/
		min: function min(v) {
			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);
			return this;
		},

		/**
				*
				*/
		max: function max(v) {
			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);
			return this;
		},

		/**
				*
				*/
		getLength: function getLength() {
			return Math.sqrt(this.getLengthSquared());
		},

		/**
				*
				*/
		getLengthSquared: function getLengthSquared() {
			return this.x * this.x + this.y * this.y + this.z * this.z;
		},

		/**
				*
				*/
		normalize: function normalize(thickness) {
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
		subtract: function subtract(a, target) {
			if (!target) {
				target = new Vector3();
			}

			target.set(this.x - a.x, this.y - a.y, this.z - a.z);
			return target;
		},

		/**
				*
				*/
		multiply: function multiply(v) {
			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
			return this;
		},

		/**
				*
				*/
		crossVectors: function crossVectors(a, b) {
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
		cross: function cross(v) {
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
		negate: function negate() {
			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;
			return this;
		},

		/**
				*
				*/
		dot: function dot(a) {
			return this.x * a.x + this.y * a.y + this.z * a.z;
		},

		/**
				*
				*/
		applyQuaternion: function applyQuaternion(q) {
			var x = this.x,
					y = this.y,
					z = this.z;
			var qx = q._x,
					qy = q._y,
					qz = q._z,
					qw = q._w; // calculate quat * vector

			var ix = qw * x + qy * z - qz * y;
			var iy = qw * y + qz * x - qx * z;
			var iz = qw * z + qx * y - qy * x;
			var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
			return this;
		},

		/**
				*
				*/
		applyMatrix4: function applyMatrix4(m) {
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
		applyMatrix3: function applyMatrix3(m) {
			var x = this.x,
					y = this.y,
					z = this.z;
			var e = m.elements;
			this.x = e[0] * x + e[3] * y + e[6] * z;
			this.y = e[1] * x + e[4] * y + e[7] * z;
			this.z = e[2] * x + e[5] * y + e[8] * z;
			return this;
		},

		/**
				*
				*/
		transformDirection: function transformDirection(m) {
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
		setFromMatrixPosition: function setFromMatrixPosition(m) {
			return this.setFromMatrixColumn(m, 3);
		},

		/**
				*
				*/
		setFromMatrixColumn: function setFromMatrixColumn(m, index) {
			return this.fromArray(m.elements, index * 4);
		},

		/**
				*
				*/
		fromArray: function fromArray(array, offset) {
			if (offset === undefined) offset = 0;
			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			return this;
		},

		/**
				*
				*/
		toArray: function toArray(array, offset) {
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
		copy: function copy(v) {
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			return this;
		},

		/**
				*
				*/
		addVectors: function addVectors(a, b) {
			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			return this;
		},

		/**
				*
				*/
		addScalar: function addScalar(s) {
			this.x += s;
			this.y += s;
			this.z += s;
			return this;
		},

		/**
				*
				*/
		add: function add(v) {
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			return this;
		},

		/**
				*
				*/
		addScaledVector: function addScaledVector(v, s) {
			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;
			return this;
		},

		/**
				*
				*/
		subVectors: function subVectors(a, b) {
			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			return this;
		},

		/**
				*
				*/
		sub: function sub(v) {
			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			return this;
		},

		/**
				*
				*/
		multiplyScalar: function multiplyScalar(scalar) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			return this;
		},

		/**
				*
				*/
		distanceToSquared: function distanceToSquared(v) {
			var dx = this.x - v.x,
					dy = this.y - v.y,
					dz = this.z - v.z;
			return dx * dx + dy * dy + dz * dz;
		},

		/**
				*
				*/
		distanceTo: function distanceTo(v) {
			return Math.sqrt(this.distanceToSquared(v));
		},

		/**
				*
				*/
		setFromSpherical: function setFromSpherical(s) {
			var sinPhiRadius = Math.sin(s.phi) * s.radius;
			this.x = sinPhiRadius * Math.sin(s.theta);
			this.y = Math.cos(s.phi) * s.radius;
			this.z = sinPhiRadius * Math.cos(s.theta);
			return this;
		},

		/**
				*
				*/
		project: function project(camera) {
			return this.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);
		},

		/**
				*
				*/
		unproject: function unproject(camera) {
			return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.worldMatrix);
		},

		/**
				*
				*/
		reflect: function reflect(normal) {
			// reflect incident vector off plane orthogonal to normal
			// normal is assumed to have unit length
			return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
		},

		/**
				*
				*/
		equals: function equals(v) {
			return v.x === this.x && v.y === this.y && v.z === this.z;
		},

		/**
				*
				*/
		clone: function clone() {
			return new Vector3(this.x, this.y, this.z);
		},
		applyProjection: function applyProjection(m) {
			console.error("zen3d.Vector3: .applyProjection has been removed. Use .applyMatrix4 instead.");
		}
	});

	var _vec3_1 = new Vector3();

	var _diff = new Vector3();

	var _edge1 = new Vector3();

	var _edge2 = new Vector3();

	var _normal = new Vector3();
	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Vector3} [origin=]
	 * @param {zen3d.Vector3} [direction=]
	 */


	function Ray(origin, direction) {
		this.origin = origin !== undefined ? origin : new Vector3();
		this.direction = direction !== undefined ? direction : new Vector3();
	}

	Object.assign(Ray.prototype,
	/** @lends zen3d.Ray.prototype */
	{
		/**
				*
				*/
		set: function set(origin, direction) {
			this.origin.copy(origin);
			this.direction.copy(direction);
		},

		/**
				*
				*/
		at: function at(t, optionalTarget) {
			var result = optionalTarget || new Vector3();
			return result.copy(this.direction).multiplyScalar(t).add(this.origin);
		},

		/**
				* @method
				*/
		intersectsSphere: function intersectsSphere(sphere, optionalTarget) {
			_vec3_1.subVectors(sphere.center, this.origin);

			var tca = _vec3_1.dot(this.direction);

			var d2 = _vec3_1.dot(_vec3_1) - tca * tca;
			var radius2 = sphere.radius * sphere.radius;

			if (d2 > radius2) {
				return null;
			}

			var thc = Math.sqrt(radius2 - d2); // t0 = first intersect point - entrance on front of sphere

			var t0 = tca - thc; // t1 = second intersect point - exit point on back of sphere

			var t1 = tca + thc; // console.log(t0, t1);
			// test to see if both t0 and t1 are behind the ray - if so, return null

			if (t0 < 0 && t1 < 0) {
				return null;
			} // test to see if t0 is behind the ray:
			// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
			// in order to always return an intersect point that is in front of the ray.


			if (t0 < 0) {
				return this.at(t1, optionalTarget);
			} // else t0 is in front of the ray, so return the first collision point scaled by t0


			return this.at(t0, optionalTarget);
		},

		/**
				*
				*/
		intersectsBox: function intersectsBox(box, optionalTarget) {
			var tmin, tmax, tymin, tymax, tzmin, tzmax;
			var invdirx = 1 / this.direction.x,
					invdiry = 1 / this.direction.y,
					invdirz = 1 / this.direction.z;
			var origin = this.origin;

			if (invdirx >= 0) {
				tmin = (box.min.x - origin.x) * invdirx;
				tmax = (box.max.x - origin.x) * invdirx;
			} else {
				tmin = (box.max.x - origin.x) * invdirx;
				tmax = (box.min.x - origin.x) * invdirx;
			}

			if (invdiry >= 0) {
				tymin = (box.min.y - origin.y) * invdiry;
				tymax = (box.max.y - origin.y) * invdiry;
			} else {
				tymin = (box.max.y - origin.y) * invdiry;
				tymax = (box.min.y - origin.y) * invdiry;
			}

			if (tmin > tymax || tymin > tmax) return null; // These lines also handle the case where tmin or tmax is NaN
			// (result of 0 * Infinity). x !== x returns true if x is NaN

			if (tymin > tmin || tmin !== tmin) tmin = tymin;
			if (tymax < tmax || tmax !== tmax) tmax = tymax;

			if (invdirz >= 0) {
				tzmin = (box.min.z - origin.z) * invdirz;
				tzmax = (box.max.z - origin.z) * invdirz;
			} else {
				tzmin = (box.max.z - origin.z) * invdirz;
				tzmax = (box.min.z - origin.z) * invdirz;
			}

			if (tmin > tzmax || tzmin > tmax) return null;
			if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
			if (tzmax < tmax || tmax !== tmax) tmax = tzmax; // return point closest to the ray (positive side)

			if (tmax < 0) return null;
			return this.at(tmin >= 0 ? tmin : tmax, optionalTarget);
		},

		/**
				* @method
				*/
		intersectTriangle: function intersectTriangle(a, b, c, backfaceCulling, optionalTarget) {
			// Compute the offset origin, edges, and normal.
			// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
			_edge1.subVectors(b, a);

			_edge2.subVectors(c, a);

			_normal.crossVectors(_edge1, _edge2); // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//	 |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//	 |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//	 |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)


			var DdN = this.direction.dot(_normal);
			var sign;

			if (DdN > 0) {
				if (backfaceCulling) return null;
				sign = 1;
			} else if (DdN < 0) {
				sign = -1;
				DdN = -DdN;
			} else {
				return null;
			}

			_diff.subVectors(this.origin, a);

			var DdQxE2 = sign * this.direction.dot(_edge2.crossVectors(_diff, _edge2)); // b1 < 0, no intersection

			if (DdQxE2 < 0) {
				return null;
			}

			var DdE1xQ = sign * this.direction.dot(_edge1.cross(_diff)); // b2 < 0, no intersection

			if (DdE1xQ < 0) {
				return null;
			} // b1+b2 > 1, no intersection


			if (DdQxE2 + DdE1xQ > DdN) {
				return null;
			} // Line intersects triangle, check if ray does.


			var QdN = -sign * _diff.dot(_normal); // t < 0, no intersection


			if (QdN < 0) {
				return null;
			} // Ray intersects triangle.


			return this.at(QdN / DdN, optionalTarget);
		},

		/**
				*
				*/
		copy: function copy(ray) {
			this.origin.copy(ray.origin);
			this.direction.copy(ray.direction);
			return this;
		},

		/**
				*
				*/
		applyMatrix4: function applyMatrix4(matrix4) {
			this.direction.add(this.origin).applyMatrix4(matrix4);
			this.origin.applyMatrix4(matrix4);
			this.direction.sub(this.origin);
			this.direction.normalize();
			return this;
		}
	});

	/**
	 * This creates a new raycaster object.
	 * @memberof zen3d
	 * @constructor
	 * @param {zen3d.Vector3} origin — The origin vector where the ray casts from.
	 * @param {zen3d.Vector3} direction — The direction vector that gives direction to the ray. Should be normalized.
	 * @param {number} [near=0] — All results returned are further away than near. Near can't be negative.
	 * @param {number} [far=Infinity] All results returned are closer than far. Far can't be lower than near.
	 */

	function Raycaster(origin, direction, near, far) {
		/**
				* The Ray used for the raycasting.
				* @member {zen3d.Ray}
				*/
		this.ray = new Ray(origin, direction);
		/**
				* The near factor of the raycaster. This value indicates which objects can be discarded based on the distance. This value shouldn't be negative and should be smaller than the far property.
				* @member {number}
				*/

		this.near = near || 0;
		/**
				* The far factor of the raycaster. This value indicates which objects can be discarded based on the distance. This value shouldn't be negative and should be larger than the near property.
				* @member {number}
				*/

		this.far = far || Infinity;
	}

	function ascSort(a, b) {
		return a.distance - b.distance;
	}

	function _intersectObject(object, raycaster, intersects, recursive) {
		object.raycast(raycaster, intersects);

		if (recursive === true) {
			var children = object.children;

			for (var i = 0, l = children.length; i < l; i++) {
				_intersectObject(children[i], raycaster, intersects, true);
			}
		}
	}

	Object.assign(Raycaster.prototype,
	/** @lends zen3d.Raycaster.prototype */
	{
		/**
				* Updates the ray with a new origin and direction.
				* @param {zen3d.Vector3} origin — The origin vector where the ray casts from.
				* @param {zen3d.Vector3} direction — The normalized direction vector that gives direction to the ray.
				*/
		set: function set(origin, direction) {
			this.ray.set(origin, direction);
		},

		/**
				* Updates the ray with a new origin and direction.
				* @param {zen3d.Vector2} coords — 2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1.
				* @param {zen3d.Camera} camera — camera from which the ray should originate.
		 * @param {string} type - camera type: 'perspective' or 'orthographic'
				*/
		setFromCamera: function setFromCamera(coords, camera, type) {
			type = type || 'perspective';

			if (type == 'orthographic') {
				// set origin in plane of camera
				// projectionMatrix.elements[14] = (near + far) / (near - far)
				this.ray.origin.set(coords.x, coords.y, camera.projectionMatrix.elements[14]).unproject(camera);
				this.ray.direction.set(0, 0, -1).transformDirection(camera.worldMatrix);
			} else {
				this.ray.origin.setFromMatrixPosition(camera.worldMatrix);
				this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
			}
		},

		/**
				* Checks all intersection between the ray and the object with or without the descendants. Intersections are returned sorted by distance, closest first. An array of intersections is returned:
				* [ { distance, point, face, faceIndex, object }, ... ]
				* @param {zen3d.Object3D} object — The object to check for intersection with the ray.
				* @param {boolean} [recursive=] — If true, it also checks all descendants. Otherwise it only checks intersecton with the object.
				* @return {Object[]} An array of intersections
				*/
		intersectObject: function intersectObject(object, recursive) {
			var intersects = [];

			_intersectObject(object, this, intersects, recursive);

			intersects.sort(ascSort);
			return intersects;
		},

		/**
				* Checks all intersection between the ray and the objects with or without the descendants. Intersections are returned sorted by distance, closest first. An array of intersections is returned:
				* [ { distance, point, face, faceIndex, object }, ... ]
				* @param {zen3d.Object3D[]} objects — The objects to check for intersection with the ray.
				* @param {boolean} [recursive=] — If true, it also checks all descendants. Otherwise it only checks intersecton with the object.
				* @return {Object[]} An array of intersections
				*/
		intersectObjects: function intersectObjects(objects, recursive) {
			var intersects = [];

			if (Array.isArray(objects) === false) {
				console.warn('Raycaster.intersectObjects: objects is not an Array.');
				return intersects;
			}

			for (var i = 0, l = objects.length; i < l; i++) {
				_intersectObject(objects[i], this, intersects, recursive);
			}

			intersects.sort(ascSort);
			return intersects;
		}
	});

	var _vec3_1$1 = new Vector3();

	var _mat4_1 = new Matrix4();

	var _x = new Vector3();

	var _y = new Vector3();

	var _z = new Vector3();
	/**
	 * a 4x4 matrix class
	 * @constructor
	 * @memberof zen3d
	 */


	function Matrix4() {
		this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	}

	Object.assign(Matrix4.prototype,
	/** @lends zen3d.Matrix4.prototype */
	{
		/**
				*
				*/
		identity: function identity() {
			this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
			return this;
		},

		/**
				*
				*/
		set: function set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
			var ele = this.elements;
			ele[0] = n11;
			ele[4] = n12;
			ele[8] = n13;
			ele[12] = n14;
			ele[1] = n21;
			ele[5] = n22;
			ele[9] = n23;
			ele[13] = n24;
			ele[2] = n31;
			ele[6] = n32;
			ele[10] = n33;
			ele[14] = n34;
			ele[3] = n41;
			ele[7] = n42;
			ele[11] = n43;
			ele[15] = n44;
			return this;
		},

		/**
				*
				*/
		copy: function copy(m) {
			this.elements.set(m.elements);
			return this;
		},

		/**
				*
				*/
		makeTranslation: function makeTranslation(x, y, z) {
			this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
			return this;
		},

		/**
				*
				*/
		multiply: function multiply(m) {
			return this.multiplyMatrices(this, m);
		},

		/**
				*
				*/
		premultiply: function premultiply(m) {
			return this.multiplyMatrices(m, this);
		},

		/**
				*
				*/
		multiplyMatrices: function multiplyMatrices(a, b) {
			var ae = a.elements;
			var be = b.elements;
			var te = this.elements;
			var a11 = ae[0],
					a12 = ae[4],
					a13 = ae[8],
					a14 = ae[12];
			var a21 = ae[1],
					a22 = ae[5],
					a23 = ae[9],
					a24 = ae[13];
			var a31 = ae[2],
					a32 = ae[6],
					a33 = ae[10],
					a34 = ae[14];
			var a41 = ae[3],
					a42 = ae[7],
					a43 = ae[11],
					a44 = ae[15];
			var b11 = be[0],
					b12 = be[4],
					b13 = be[8],
					b14 = be[12];
			var b21 = be[1],
					b22 = be[5],
					b23 = be[9],
					b24 = be[13];
			var b31 = be[2],
					b32 = be[6],
					b33 = be[10],
					b34 = be[14];
			var b41 = be[3],
					b42 = be[7],
					b43 = be[11],
					b44 = be[15];
			te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
			te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
			te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
			te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
			return this;
		},

		/**
				*
				*/
		transpose: function transpose() {
			var te = this.elements;
			var tmp;
			tmp = te[1];
			te[1] = te[4];
			te[4] = tmp;
			tmp = te[2];
			te[2] = te[8];
			te[8] = tmp;
			tmp = te[6];
			te[6] = te[9];
			te[9] = tmp;
			tmp = te[3];
			te[3] = te[12];
			te[12] = tmp;
			tmp = te[7];
			te[7] = te[13];
			te[13] = tmp;
			tmp = te[11];
			te[11] = te[14];
			te[14] = tmp;
			return this;
		},

		/**
				*
				*/
		inverse: function inverse() {
			return this.getInverse(this);
		},

		/**
				*
				*/
		getInverse: function getInverse(m) {
			// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
			var te = this.elements,
					me = m.elements,
					n11 = me[0],
					n21 = me[1],
					n31 = me[2],
					n41 = me[3],
					n12 = me[4],
					n22 = me[5],
					n32 = me[6],
					n42 = me[7],
					n13 = me[8],
					n23 = me[9],
					n33 = me[10],
					n43 = me[11],
					n14 = me[12],
					n24 = me[13],
					n34 = me[14],
					n44 = me[15],
					t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
					t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
					t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
					t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
			var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

			if (det === 0) {
				console.warn("can't invert matrix, determinant is 0");
				return this.identity();
			}

			var detInv = 1 / det;
			te[0] = t11 * detInv;
			te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
			te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
			te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
			te[4] = t12 * detInv;
			te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
			te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
			te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
			te[8] = t13 * detInv;
			te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
			te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
			te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
			te[12] = t14 * detInv;
			te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
			te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
			te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
			return this;
		},

		/**
				* Make transform from pos&scale&rotation(Quaternion).
				* @method
				*/
		transform: function transform(pos, scale, rot) {
			var rotMatrix = rot.toMatrix4(_mat4_1);
			var rele = rotMatrix.elements;
			var ele = this.elements;
			ele[0] = rele[0] * scale.x;
			ele[1] = rele[1] * scale.x;
			ele[2] = rele[2] * scale.x;
			ele[3] = 0;
			ele[4] = rele[4] * scale.y;
			ele[5] = rele[5] * scale.y;
			ele[6] = rele[6] * scale.y;
			ele[7] = 0;
			ele[8] = rele[8] * scale.z;
			ele[9] = rele[9] * scale.z;
			ele[10] = rele[10] * scale.z;
			ele[11] = 0;
			ele[12] = pos.x;
			ele[13] = pos.y;
			ele[14] = pos.z;
			ele[15] = 1;
			return this;
		},

		/**
				*
				*/
		makeRotationFromQuaternion: function makeRotationFromQuaternion(q) {
			var te = this.elements;
			var x = q.x,
					y = q.y,
					z = q.z,
					w = q.w;
			var x2 = x + x,
					y2 = y + y,
					z2 = z + z;
			var xx = x * x2,
					xy = x * y2,
					xz = x * z2;
			var yy = y * y2,
					yz = y * z2,
					zz = z * z2;
			var wx = w * x2,
					wy = w * y2,
					wz = w * z2;
			te[0] = 1 - (yy + zz);
			te[4] = xy - wz;
			te[8] = xz + wy;
			te[1] = xy + wz;
			te[5] = 1 - (xx + zz);
			te[9] = yz - wx;
			te[2] = xz - wy;
			te[6] = yz + wx;
			te[10] = 1 - (xx + yy); // last column

			te[3] = 0;
			te[7] = 0;
			te[11] = 0; // bottom row

			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;
			return this;
		},

		/**
				* @method
				*/
		extractRotation: function extractRotation(m) {
			// this method does not support reflection matrices
			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / _vec3_1$1.setFromMatrixColumn(m, 0).getLength();

			var scaleY = 1 / _vec3_1$1.setFromMatrixColumn(m, 1).getLength();

			var scaleZ = 1 / _vec3_1$1.setFromMatrixColumn(m, 2).getLength();

			te[0] = me[0] * scaleX;
			te[1] = me[1] * scaleX;
			te[2] = me[2] * scaleX;
			te[3] = 0;
			te[4] = me[4] * scaleY;
			te[5] = me[5] * scaleY;
			te[6] = me[6] * scaleY;
			te[7] = 0;
			te[8] = me[8] * scaleZ;
			te[9] = me[9] * scaleZ;
			te[10] = me[10] * scaleZ;
			te[11] = 0;
			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;
			return this;
		},

		/**
				* @method
				*/
		lookAtRH: function lookAtRH(eye, target, up) {
			var te = this.elements;

			_z.subVectors(eye, target);

			if (_z.getLengthSquared() === 0) {
				// eye and target are in the same position
				_z.z = 1;
			}

			_z.normalize();

			_x.crossVectors(up, _z);

			if (_x.getLengthSquared() === 0) {
				// up and z are parallel
				if (Math.abs(up.z) === 1) {
					_z.x += 0.0001;
				} else {
					_z.z += 0.0001;
				}

				_z.normalize();

				_x.crossVectors(up, _z);
			}

			_x.normalize();

			_y.crossVectors(_z, _x);

			te[0] = _x.x;
			te[4] = _y.x;
			te[8] = _z.x;
			te[1] = _x.y;
			te[5] = _y.y;
			te[9] = _z.y;
			te[2] = _x.z;
			te[6] = _y.z;
			te[10] = _z.z;
			return this;
		},

		/**
				* @method
				*/
		decompose: function decompose(position, quaternion, scale) {
			var te = this.elements;

			var sx = _vec3_1$1.set(te[0], te[1], te[2]).getLength();

			var sy = _vec3_1$1.set(te[4], te[5], te[6]).getLength();

			var sz = _vec3_1$1.set(te[8], te[9], te[10]).getLength(); // if determine is negative, we need to invert one scale


			var det = this.determinant();

			if (det < 0) {
				sx = -sx;
			}

			position.x = te[12];
			position.y = te[13];
			position.z = te[14]; // scale the rotation part

			_mat4_1.copy(this);

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;
			_mat4_1.elements[0] *= invSX;
			_mat4_1.elements[1] *= invSX;
			_mat4_1.elements[2] *= invSX;
			_mat4_1.elements[4] *= invSY;
			_mat4_1.elements[5] *= invSY;
			_mat4_1.elements[6] *= invSY;
			_mat4_1.elements[8] *= invSZ;
			_mat4_1.elements[9] *= invSZ;
			_mat4_1.elements[10] *= invSZ;
			quaternion.setFromRotationMatrix(_mat4_1);
			scale.x = sx;
			scale.y = sy;
			scale.z = sz;
			return this;
		},

		/**
				* @method
				*/
		determinant: function determinant() {
			var te = this.elements;
			var n11 = te[0],
					n12 = te[4],
					n13 = te[8],
					n14 = te[12];
			var n21 = te[1],
					n22 = te[5],
					n23 = te[9],
					n24 = te[13];
			var n31 = te[2],
					n32 = te[6],
					n33 = te[10],
					n34 = te[14];
			var n41 = te[3],
					n42 = te[7],
					n43 = te[11],
					n44 = te[15]; // TODO: make this more efficient
			// ( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

			return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
		},

		/**
				*
				*/
		fromArray: function fromArray(array, offset) {
			if (offset === undefined) offset = 0;

			for (var i = 0; i < 16; i++) {
				this.elements[i] = array[i + offset];
			}

			return this;
		},

		/**
				*
				*/
		getMaxScaleOnAxis: function getMaxScaleOnAxis() {
			var te = this.elements;
			var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
			var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
			var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
			return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
		},

		/**
				*
				*/
		toArray: function toArray(array, offset) {
			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;
			var te = this.elements;
			array[offset] = te[0];
			array[offset + 1] = te[1];
			array[offset + 2] = te[2];
			array[offset + 3] = te[3];
			array[offset + 4] = te[4];
			array[offset + 5] = te[5];
			array[offset + 6] = te[6];
			array[offset + 7] = te[7];
			array[offset + 8] = te[8];
			array[offset + 9] = te[9];
			array[offset + 10] = te[10];
			array[offset + 11] = te[11];
			array[offset + 12] = te[12];
			array[offset + 13] = te[13];
			array[offset + 14] = te[14];
			array[offset + 15] = te[15];
			return array;
		}
	});

	var _matrix = new Matrix4();
	/**
	 * a Euler class
	 * @constructor
	 * @memberof zen3d
	 */


	function Euler(x, y, z, order) {
		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._order = order || Euler.DefaultOrder;
	}

	Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
	Euler.DefaultOrder = 'XYZ';
	Object.defineProperties(Euler.prototype, {
		x: {
			get: function get() {
				return this._x;
			},
			set: function set(value) {
				this._x = value;
				this.onChangeCallback();
			}
		},
		y: {
			get: function get() {
				return this._y;
			},
			set: function set(value) {
				this._y = value;
				this.onChangeCallback();
			}
		},
		z: {
			get: function get() {
				return this._z;
			},
			set: function set(value) {
				this._z = value;
				this.onChangeCallback();
			}
		},
		order: {
			get: function get() {
				return this._order;
			},
			set: function set(value) {
				this._order = value;
				this.onChangeCallback();
			}
		}
	});
	Object.assign(Euler.prototype,
	/** @lends zen3d.Euler.prototype */
	{
		/**
				*
				*/
		copyFrom: function copyFrom(euler) {
			this._x = euler._x;
			this._y = euler._y;
			this._z = euler._z;
			this._order = euler._order;
			this.onChangeCallback();
			return this;
		},

		/**
				*
				*/
		set: function set(x, y, z, order) {
			this._x = x || 0;
			this._y = y || 0;
			this._z = z || 0;
			this._order = order || this._order;
			this.onChangeCallback();
			return this;
		},

		/**
				*
				*/
		setFromRotationMatrix: function setFromRotationMatrix(m, order, update) {
			var clamp = function clamp(value, min, max) {
				return Math.max(min, Math.min(max, value));
			}; // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)


			var te = m.elements;
			var m11 = te[0],
					m12 = te[4],
					m13 = te[8];
			var m21 = te[1],
					m22 = te[5],
					m23 = te[9];
			var m31 = te[2],
					m32 = te[6],
					m33 = te[10];
			order = order || this._order;

			if (order === 'XYZ') {
				this._y = Math.asin(clamp(m13, -1, 1));

				if (Math.abs(m13) < 0.99999) {
					this._x = Math.atan2(-m23, m33);
					this._z = Math.atan2(-m12, m11);
				} else {
					this._x = Math.atan2(m32, m22);
					this._z = 0;
				}
			} else if (order === 'YXZ') {
				this._x = Math.asin(-clamp(m23, -1, 1));

				if (Math.abs(m23) < 0.99999) {
					this._y = Math.atan2(m13, m33);
					this._z = Math.atan2(m21, m22);
				} else {
					this._y = Math.atan2(-m31, m11);
					this._z = 0;
				}
			} else if (order === 'ZXY') {
				this._x = Math.asin(clamp(m32, -1, 1));

				if (Math.abs(m32) < 0.99999) {
					this._y = Math.atan2(-m31, m33);
					this._z = Math.atan2(-m12, m22);
				} else {
					this._y = 0;
					this._z = Math.atan2(m21, m11);
				}
			} else if (order === 'ZYX') {
				this._y = Math.asin(-clamp(m31, -1, 1));

				if (Math.abs(m31) < 0.99999) {
					this._x = Math.atan2(m32, m33);
					this._z = Math.atan2(m21, m11);
				} else {
					this._x = 0;
					this._z = Math.atan2(-m12, m22);
				}
			} else if (order === 'YZX') {
				this._z = Math.asin(clamp(m21, -1, 1));

				if (Math.abs(m21) < 0.99999) {
					this._x = Math.atan2(-m23, m22);
					this._y = Math.atan2(-m31, m11);
				} else {
					this._x = 0;
					this._y = Math.atan2(m13, m33);
				}
			} else if (order === 'XZY') {
				this._z = Math.asin(-clamp(m12, -1, 1));

				if (Math.abs(m12) < 0.99999) {
					this._x = Math.atan2(m32, m22);
					this._y = Math.atan2(m13, m11);
				} else {
					this._x = Math.atan2(-m23, m33);
					this._y = 0;
				}
			} else {
				console.warn('given unsupported order: ' + order);
			}

			this._order = order;
			if (update !== false) this.onChangeCallback();
			return this;
		},

		/**
				*
				*/
		setFromQuaternion: function setFromQuaternion(q, order, update) {
			q.toMatrix4(_matrix);
			return this.setFromRotationMatrix(_matrix, order, update);
		},
		onChange: function onChange(callback) {
			this.onChangeCallback = callback;
			return this;
		},
		onChangeCallback: function onChangeCallback() {}
	});

	/**
	 * a vector 2 class
	 * @constructor
	 * @memberof zen3d
	 * @param {number} [x=0]
	 * @param {number} [y=0]
	 */
	function Vector2(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	Object.assign(Vector2.prototype,
	/** @lends zen3d.Vector2.prototype */
	{
		/**
				*
				*/
		set: function set(x, y) {
			this.x = x || 0;
			this.y = y || 0;
			return this;
		},

		/**
				*
				*/
		lerpVectors: function lerpVectors(v1, v2, ratio) {
			return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
		},

		/**
				*
				*/
		min: function min(v) {
			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			return this;
		},

		/**
				*
				*/
		max: function max(v) {
			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			return this;
		},

		/**
				*
				*/
		getLength: function getLength() {
			return Math.sqrt(this.getLengthSquared());
		},

		/**
				*
				*/
		getLengthSquared: function getLengthSquared() {
			return this.x * this.x + this.y * this.y;
		},

		/**
				*
				*/
		normalize: function normalize(thickness) {
			thickness = thickness || 1;
			var length = this.getLength();

			if (length != 0) {
				var invLength = thickness / length;
				this.x *= invLength;
				this.y *= invLength;
				return this;
			}
		},

		/**
				*
				*/
		subtract: function subtract(a, target) {
			if (!target) {
				target = new Vector2();
			}

			target.set(this.x - a.x, this.y - a.y);
			return target;
		},

		/**
				*
				*/
		sub: function sub(v) {
			this.x -= v.x;
			this.y -= v.y;
			return this;
		},

		/**
				*
				*/
		copy: function copy(v) {
			this.x = v.x;
			this.y = v.y;
			return this;
		},

		/**
				*
				*/
		addVectors: function addVectors(a, b) {
			this.x = a.x + b.x;
			this.y = a.y + b.y;
			return this;
		},

		/**
				*
				*/
		subVectors: function subVectors(a, b) {
			this.x = a.x - b.x;
			this.y = a.y - b.y;
			return this;
		},

		/**
				*
				*/
		multiplyScalar: function multiplyScalar(scalar) {
			this.x *= scalar;
			this.y *= scalar;
			return this;
		},

		/**
				*
				*/
		distanceToSquared: function distanceToSquared(v) {
			var dx = this.x - v.x,
					dy = this.y - v.y;
			return dx * dx + dy * dy;
		},

		/**
				*
				*/
		distanceTo: function distanceTo(v) {
			return Math.sqrt(this.distanceToSquared(v));
		},

		/**
				*
				*/
		fromArray: function fromArray(array, offset) {
			if (offset === undefined) offset = 0;
			this.x = array[offset];
			this.y = array[offset + 1];
			return this;
		},

		/**
				*
				*/
		add: function add(v) {
			this.x += v.x;
			this.y += v.y;
			return this;
		},

		/**
				*
				*/
		angle: function angle() {
			// computes the angle in radians with respect to the positive x-axis
			var angle = Math.atan2(this.y, this.x);
			if (angle < 0) angle += 2 * Math.PI;
			return angle;
		},

		/**
				*
				*/
		clone: function clone() {
			return new Vector2(this.x, this.y);
		}
	});

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
		this.w = w !== undefined ? w : 1;
	}

	Object.assign(Vector4.prototype,
	/** @lends zen3d.Vector4.prototype */
	{
		/**
				*
				*/
		lerpVectors: function lerpVectors(v1, v2, ratio) {
			return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
		},

		/**
				*
				*/
		set: function set(x, y, z, w) {
			this.x = x || 0;
			this.y = y || 0;
			this.z = z || 0;
			this.w = w !== undefined ? w : 1;
			return this;
		},

		/**
				*
				*/
		normalize: function normalize() {
			return this.multiplyScalar(1 / (this.getLength() || 1));
		},

		/**
				*
				*/
		multiplyScalar: function multiplyScalar(scalar) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			this.w *= scalar;
			return this;
		},

		/**
				*
				*/
		dot: function dot(v) {
			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
		},

		/**
				*
				*/
		getLengthSquared: function getLengthSquared() {
			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
		},

		/**
				*
				*/
		getLength: function getLength() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
		},

		/**
				*
				*/
		applyMatrix4: function applyMatrix4(m) {
			var x = this.x,
					y = this.y,
					z = this.z,
					w = this.w;
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
		equals: function equals(v) {
			return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
		},

		/**
				*
				*/
		add: function add(v) {
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;
			return this;
		},

		/**
				*
				*/
		multiply: function multiply(v) {
			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
			this.w *= v.w;
			return this;
		},

		/**
				*
				*/
		subVectors: function subVectors(a, b) {
			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			this.w = a.w - b.w;
			return this;
		},

		/**
				*
				*/
		fromArray: function fromArray(array, offset) {
			if (offset === undefined) offset = 0;
			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			this.w = array[offset + 3];
			return this;
		},

		/**
				*
				*/
		toArray: function toArray(array, offset) {
			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;
			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;
			array[offset + 3] = this.w;
			return array;
		},

		/**
				*
				*/
		copy: function copy(v) {
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			this.w = v.w !== undefined ? v.w : 1;
			return this;
		}
	});

	/**
	 * a 3x3 matrix class
	 * @constructor
	 * @memberof zen3d
	 */
	function Matrix3() {
		this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
	}

	Object.assign(Matrix3.prototype,
	/** @lends zen3d.Matrix3.prototype */
	{
		/**
				*
				*/
		identity: function identity() {
			this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
			return this;
		},

		/**
				*
				*/
		inverse: function inverse() {
			return this.getInverse(this);
		},

		/**
				*
				*/
		getInverse: function getInverse(matrix) {
			var me = matrix.elements,
					te = this.elements,
					n11 = me[0],
					n21 = me[1],
					n31 = me[2],
					n12 = me[3],
					n22 = me[4],
					n32 = me[5],
					n13 = me[6],
					n23 = me[7],
					n33 = me[8],
					t11 = n33 * n22 - n32 * n23,
					t12 = n32 * n13 - n33 * n12,
					t13 = n23 * n12 - n22 * n13,
					det = n11 * t11 + n21 * t12 + n31 * t13;

			if (det === 0) {
				var msg = "zen3d.Matrix3: .getInverse() can't invert matrix, determinant is 0";
				console.warn(msg);
				return this.identity();
			}

			var detInv = 1 / det;
			te[0] = t11 * detInv;
			te[1] = (n31 * n23 - n33 * n21) * detInv;
			te[2] = (n32 * n21 - n31 * n22) * detInv;
			te[3] = t12 * detInv;
			te[4] = (n33 * n11 - n31 * n13) * detInv;
			te[5] = (n31 * n12 - n32 * n11) * detInv;
			te[6] = t13 * detInv;
			te[7] = (n21 * n13 - n23 * n11) * detInv;
			te[8] = (n22 * n11 - n21 * n12) * detInv;
			return this;
		},
		transpose: function transpose() {
			var tmp,
					m = this.elements;
			tmp = m[1];
			m[1] = m[3];
			m[3] = tmp;
			tmp = m[2];
			m[2] = m[6];
			m[6] = tmp;
			tmp = m[5];
			m[5] = m[7];
			m[7] = tmp;
			return this;
		},

		/**
				*
				*/
		set: function set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
			var ele = this.elements;
			ele[0] = n11;
			ele[3] = n12;
			ele[6] = n13;
			ele[1] = n21;
			ele[4] = n22;
			ele[7] = n23;
			ele[2] = n31;
			ele[5] = n32;
			ele[8] = n33;
			return this;
		},

		/**
				*
				*/
		copy: function copy(m) {
			this.elements.set(m.elements);
			return this;
		},

		/**
				*
				*/
		multiply: function multiply(m) {
			return this.multiplyMatrices(this, m);
		},

		/**
				*
				*/
		premultiply: function premultiply(m) {
			return this.multiplyMatrices(m, this);
		},

		/**
				*
				*/
		multiplyMatrices: function multiplyMatrices(a, b) {
			var ae = a.elements;
			var be = b.elements;
			var te = this.elements;
			var a11 = ae[0],
					a12 = ae[3],
					a13 = ae[6];
			var a21 = ae[1],
					a22 = ae[4],
					a23 = ae[7];
			var a31 = ae[2],
					a32 = ae[5],
					a33 = ae[8];
			var b11 = be[0],
					b12 = be[3],
					b13 = be[6];
			var b21 = be[1],
					b22 = be[4],
					b23 = be[7];
			var b31 = be[2],
					b32 = be[5],
					b33 = be[8];
			te[0] = a11 * b11 + a12 * b21 + a13 * b31;
			te[3] = a11 * b12 + a12 * b22 + a13 * b32;
			te[6] = a11 * b13 + a12 * b23 + a13 * b33;
			te[1] = a21 * b11 + a22 * b21 + a23 * b31;
			te[4] = a21 * b12 + a22 * b22 + a23 * b32;
			te[7] = a21 * b13 + a22 * b23 + a23 * b33;
			te[2] = a31 * b11 + a32 * b21 + a33 * b31;
			te[5] = a31 * b12 + a32 * b22 + a33 * b32;
			te[8] = a31 * b13 + a32 * b23 + a33 * b33;
			return this;
		},

		/**
				* Transform 2D
				*/
		transform: function transform(x, y, scaleX, scaleY, rotation, anchorX, anchorY) {
			var te = this.elements;
			var cr = 1;
			var sr = 0;

			if (rotation % 360) {
				var r = rotation;
				cr = Math.cos(r);
				sr = Math.sin(r);
			}

			te[0] = cr * scaleX;
			te[3] = -sr * scaleY;
			te[6] = x;
			te[1] = sr * scaleX;
			te[4] = cr * scaleY;
			te[7] = y;
			te[2] = 0;
			te[5] = 0;
			te[8] = 1;

			if (anchorX || anchorY) {
				// prepend the anchor offset:
				te[6] -= anchorX * te[0] + anchorY * te[3];
				te[7] -= anchorX * te[1] + anchorY * te[4];
			}

			return this;
		},

		/**
				*
				*/
		setUvTransform: function setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
			var c = Math.cos(rotation);
			var s = Math.sin(rotation);
			this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1);
		},

		/**
				*
				*/
		setFromMatrix4: function setFromMatrix4(m) {
			var me = m.elements;
			this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);
			return this;
		}
	});

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
		this._w = w !== undefined ? w : 1;
	}

	Object.defineProperties(Quaternion.prototype, {
		x: {
			get: function get() {
				return this._x;
			},
			set: function set(value) {
				this._x = value;
				this.onChangeCallback();
			}
		},
		y: {
			get: function get() {
				return this._y;
			},
			set: function set(value) {
				this._y = value;
				this.onChangeCallback();
			}
		},
		z: {
			get: function get() {
				return this._z;
			},
			set: function set(value) {
				this._z = value;
				this.onChangeCallback();
			}
		},
		w: {
			get: function get() {
				return this._w;
			},
			set: function set(value) {
				this._w = value;
				this.onChangeCallback();
			}
		}
	});
	Object.assign(Quaternion.prototype,
	/** @lends zen3d.Quaternion.prototype */
	{
		/**
				*
				*/
		normalize: function normalize(thickness) {
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
		length: function length() {
			return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
		},

		/**
				* Linearly interpolates between two quaternions.
				*/
		lerpQuaternions: function lerpQuaternions(q1, q2, ratio) {
			var w1 = q1._w,
					x1 = q1._x,
					y1 = q1._y,
					z1 = q1._z;
			var w2 = q2._w,
					x2 = q2._x,
					y2 = q2._y,
					z2 = q2._z;
			var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2; // shortest direction

			if (dot < 0) {
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
		slerpQuaternions: function slerpQuaternions(q1, q2, ratio) {
			var w1 = q1._w,
					x1 = q1._x,
					y1 = q1._y,
					z1 = q1._z;
			var w2 = q2._w,
					x2 = q2._x,
					y2 = q2._y,
					z2 = q2._z;
			var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2; // shortest direction

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
		set: function set(x, y, z, w) {
			this._x = x || 0;
			this._y = y || 0;
			this._z = z || 0;
			this._w = w !== undefined ? w : 1;
			this.onChangeCallback();
			return this;
		},

		/**
				*
				*/
		copy: function copy(v) {
			this._x = v.x;
			this._y = v.y;
			this._z = v.z;
			this._w = v.w !== undefined ? v.w : 1;
			this.onChangeCallback();
			return this;
		},

		/**
				*
				*/
		setFromEuler: function setFromEuler(euler, update) {
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
		setFromRotationMatrix: function setFromRotationMatrix(m) {
			var te = m.elements,
					m11 = te[0],
					m12 = te[4],
					m13 = te[8],
					m21 = te[1],
					m22 = te[5],
					m23 = te[9],
					m31 = te[2],
					m32 = te[6],
					m33 = te[10],
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
		setFromUnitVectors: function setFromUnitVectors(vFrom, vTo) {
			// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final
			// assumes direction vectors vFrom and vTo are normalized
			var EPS = 0.000001;
			var r = vFrom.dot(vTo) + 1;

			if (r < EPS) {
				r = 0;

				if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
					this._x = -vFrom.y;
					this._y = vFrom.x;
					this._z = 0;
					this._w = r;
				} else {
					this._x = 0;
					this._y = -vFrom.z;
					this._z = vFrom.y;
					this._w = r;
				}
			} else {
				// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
				this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
				this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
				this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
				this._w = r;
			}

			return this.normalize();
		},

		/**
				*
				*/
		multiply: function multiply(q) {
			return this.multiplyQuaternions(this, q);
		},

		/**
				*
				*/
		premultiply: function premultiply(q) {
			return this.multiplyQuaternions(q, this);
		},

		/**
				*
				*/
		multiplyQuaternions: function multiplyQuaternions(a, b) {
			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
			var qax = a._x,
					qay = a._y,
					qaz = a._z,
					qaw = a._w;
			var qbx = b._x,
					qby = b._y,
					qbz = b._z,
					qbw = b._w;
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
		toMatrix4: function toMatrix4(target) {
			if (!target) {
				target = new Matrix4();
			}

			var ele = target.elements;
			var xy2 = 2.0 * this._x * this._y,
					xz2 = 2.0 * this._x * this._z,
					xw2 = 2.0 * this._x * this._w;
			var yz2 = 2.0 * this._y * this._z,
					yw2 = 2.0 * this._y * this._w,
					zw2 = 2.0 * this._z * this._w;
			var xx = this._x * this._x,
					yy = this._y * this._y,
					zz = this._z * this._z,
					ww = this._w * this._w;
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
		dot: function dot(v) {
			return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
		},

		/**
				* Set quaternion from axis angle
				*/
		setFromAxisAngle: function setFromAxisAngle(axis, angle) {
			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
			// assumes axis is normalized
			var halfAngle = angle / 2,
					s = Math.sin(halfAngle);
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
		fromArray: function fromArray(array, offset) {
			if (offset === undefined) offset = 0;
			this._x = array[offset];
			this._y = array[offset + 1];
			this._z = array[offset + 2];
			this._w = array[offset + 3];
			this.onChangeCallback();
			return this;
		},
		toArray: function toArray(array, offset) {
			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;
			array[offset] = this._x;
			array[offset + 1] = this._y;
			array[offset + 2] = this._z;
			array[offset + 3] = this._w;
			return array;
		},
		onChange: function onChange(callback) {
			this.onChangeCallback = callback;
			return this;
		},
		onChangeCallback: function onChangeCallback() {}
	});
	Object.assign(Quaternion, {
		/**
				* @memberof zen3d.Quaternion
				*/
		slerpFlat: function slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
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
						dir = cos >= 0 ? 1 : -1,
						sqrSin = 1 - cos * cos; // Skip the Slerp for tiny steps to avoid numeric problems:

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
				w0 = w0 * s + w1 * tDir; // Normalize in case we just did a lerp:

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

	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Vector2} min
	 * @param {zen3d.Vector2} max
	 */

	function Box2(min, max) {
		this.min = min !== undefined ? min : new Vector2(+Infinity, +Infinity);
		this.max = max !== undefined ? max : new Vector2(-Infinity, -Infinity);
	}

	Object.assign(Box2.prototype,
	/** @lends zen3d.Box2.prototype */
	{
		/**
				* @param {number} x1
				* @param {number} y1
				* @param {number} x2
				* @param {number} y2
				*/
		set: function set(x1, y1, x2, y2) {
			this.min.set(x1, y1);
			this.max.set(x2, y2);
		},

		/**
				* @param {zen3d.Box2} box
				* @return {zen3d.Box2}
				*/
		copy: function copy(box) {
			this.min.copy(box.min);
			this.max.copy(box.max);
			return this;
		}
	});

	var _points = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Vector3} min
	 * @param {zen3d.Vector3} max
	 */

	function Box3(min, max) {
		this.min = min !== undefined ? min : new Vector3(+Infinity, +Infinity, +Infinity);
		this.max = max !== undefined ? max : new Vector3(-Infinity, -Infinity, -Infinity);
	}

	Object.assign(Box3.prototype,
	/** @lends zen3d.Box3.prototype */
	{
		/**
				*
				*/
		set: function set(min, max) {
			this.min.copy(min);
			this.max.copy(max);
		},

		/**
				*
				*/
		setFromPoints: function setFromPoints(points) {
			this.makeEmpty();

			for (var i = 0, il = points.length; i < il; i++) {
				this.expandByPoint(points[i]);
			}

			return this;
		},

		/**
				*
				*/
		makeEmpty: function makeEmpty() {
			this.min.x = this.min.y = this.min.z = +Infinity;
			this.max.x = this.max.y = this.max.z = -Infinity;
			return this;
		},

		/**
				*
				*/
		expandByPoint: function expandByPoint(point) {
			this.min.min(point);
			this.max.max(point);
			return this;
		},

		/**
				*
				*/
		expandByScalar: function expandByScalar(scalar) {
			this.min.addScalar(-scalar);
			this.max.addScalar(scalar);
			return this;
		},

		/**
		 *
		 */
		expandByBox3: function expandByBox3(box3) {
			this.min.min(box3.min);
			this.max.max(box3.max);
			return this;
		},

		/**
				*
				*/
		setFromArray: function setFromArray(array, gap) {
			var minX = +Infinity;
			var minY = +Infinity;
			var minZ = +Infinity;
			var maxX = -Infinity;
			var maxY = -Infinity;
			var maxZ = -Infinity;

			var _gap = gap !== undefined ? gap : 3;

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
		isEmpty: function isEmpty() {
			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
			return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
		},

		/**
				*
				*/
		equals: function equals(box) {
			return box.min.equals(this.min) && box.max.equals(this.max);
		},

		/**
				*
				*/
		getCenter: function getCenter(optionalTarget) {
			var result = optionalTarget || new Vector3();
			return this.isEmpty() ? result.set(0, 0, 0) : result.addVectors(this.min, this.max).multiplyScalar(0.5);
		},

		/**
				* @method
				*/
		applyMatrix4: function applyMatrix4(matrix) {
			// transform of empty box is an empty box.
			if (this.isEmpty()) return this; // NOTE: I am using a binary pattern to specify all 2^3 combinations below

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
		copy: function copy(box) {
			this.min.copy(box.min);
			this.max.copy(box.max);
			return this;
		}
	});

	var _box3_1 = new Box3();

	var _vec3_1$2 = new Vector3();
	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Vector3} [center=Vector3()]
	 * @param {number} [radius=0]
	 */


	function Sphere(center, radius) {
		this.center = center !== undefined ? center : new Vector3();
		this.radius = radius !== undefined ? radius : 0;
	}

	Object.assign(Sphere.prototype,
	/** @lends zen3d.Sphere.prototype */
	{
		/**
				*
				*/
		set: function set(center, radius) {
			this.center.copy(center);
			this.radius = radius;
			return this;
		},

		/**
				* @method
				*/
		setFromArray: function setFromArray(array, gap) {
			var _gap = gap !== undefined ? gap : 3;

			var center = this.center;

			_box3_1.setFromArray(array, _gap).getCenter(center);

			var maxRadiusSq = 0;

			for (var i = 0, l = array.length; i < l; i += _gap) {
				_vec3_1$2.fromArray(array, i);

				maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vec3_1$2));
			}

			this.radius = Math.sqrt(maxRadiusSq);
			return this;
		},

		/**
				*
				*/
		applyMatrix4: function applyMatrix4(matrix) {
			this.center.applyMatrix4(matrix);
			this.radius = this.radius * matrix.getMaxScaleOnAxis();
			return this;
		},

		/**
				*
				*/
		getBoundingBox: function getBoundingBox(optionalTarget) {
			var box = optionalTarget || new Box3();
			box.set(this.center, this.center);
			box.expandByScalar(this.radius);
			return box;
		},

		/**
				*
				*/
		clone: function clone() {
			return new Sphere().copy(this);
		},

		/**
				*
				*/
		copy: function copy(sphere) {
			this.center.copy(sphere.center);
			this.radius = sphere.radius;
			return this;
		}
	});

	var _vec3_1$3 = new Vector3();

	var _mat4_1$1 = new Matrix3();
	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Vector3} [normal=Vector3(1, 0, 0)]
	 * @param {number} [constant=0]
	 */


	function Plane(normal, constant) {
		this.normal = normal !== undefined ? normal : new Vector3(1, 0, 0);
		this.constant = constant !== undefined ? constant : 0;
	}

	Object.assign(Plane.prototype,
	/** @lends zen3d.Plane.prototype */
	{
		/**
				*
				*/
		set: function set(normal, constant) {
			this.normal.copy(normal);
			this.constant = constant;
			return this;
		},

		/**
				*
				*/
		setComponents: function setComponents(x, y, z, w) {
			this.normal.set(x, y, z);
			this.constant = w;
			return this;
		},

		/**
				*
				*/
		setFromNormalAndCoplanarPoint: function setFromNormalAndCoplanarPoint(normal, point) {
			this.normal.copy(normal);
			this.constant = -point.dot(this.normal);
			return this;
		},

		/**
				*
				*/
		normalize: function normalize() {
			// Note: will lead to a divide by zero if the plane is invalid.
			var inverseNormalLength = 1.0 / this.normal.getLength();
			this.normal.multiplyScalar(inverseNormalLength);
			this.constant *= inverseNormalLength;
			return this;
		},

		/**
				*
				*/
		distanceToPoint: function distanceToPoint(point) {
			return this.normal.dot(point) + this.constant;
		},

		/**
				*
				*/
		coplanarPoint: function coplanarPoint(optionalTarget) {
			var result = optionalTarget || new Vector3();
			return result.copy(this.normal).multiplyScalar(-this.constant);
		},

		/**
				*
				*/
		copy: function copy(plane) {
			this.normal.copy(plane.normal);
			this.constant = plane.constant;
			return this;
		},

		/**
				* @method
				*/
		applyMatrix4: function applyMatrix4(matrix, optionalNormalMatrix) {
			var normalMatrix = optionalNormalMatrix || _mat4_1$1.setFromMatrix4(matrix).inverse().transpose();

			var referencePoint = this.coplanarPoint(_vec3_1$3).applyMatrix4(matrix);
			var normal = this.normal.applyMatrix3(normalMatrix).normalize();
			this.constant = -referencePoint.dot(normal);
			return this;
		}
	});

	var _vec3_1$4 = new Vector3();
	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Plane} p0
	 * @param {zen3d.Plane} p1
	 * @param {zen3d.Plane} p2
	 * @param {zen3d.Plane} p3
	 * @param {zen3d.Plane} p4
	 * @param {zen3d.Plane} p5
	 */


	function Frustum(p0, p1, p2, p3, p4, p5) {
		this.planes = [p0 !== undefined ? p0 : new Plane(), p1 !== undefined ? p1 : new Plane(), p2 !== undefined ? p2 : new Plane(), p3 !== undefined ? p3 : new Plane(), p4 !== undefined ? p4 : new Plane(), p5 !== undefined ? p5 : new Plane()];
	}

	Object.assign(Frustum.prototype,
	/** @lends zen3d.Frustum.prototype */
	{
		set: function set(p0, p1, p2, p3, p4, p5) {
			var planes = this.planes;
			planes[0].copy(p0);
			planes[1].copy(p1);
			planes[2].copy(p2);
			planes[3].copy(p3);
			planes[4].copy(p4);
			planes[5].copy(p5);
			return this;
		},
		setFromMatrix: function setFromMatrix(m) {
			var planes = this.planes;
			var me = m.elements;
			var me0 = me[0],
					me1 = me[1],
					me2 = me[2],
					me3 = me[3];
			var me4 = me[4],
					me5 = me[5],
					me6 = me[6],
					me7 = me[7];
			var me8 = me[8],
					me9 = me[9],
					me10 = me[10],
					me11 = me[11];
			var me12 = me[12],
					me13 = me[13],
					me14 = me[14],
					me15 = me[15];
			planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
			planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
			planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
			planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
			planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
			planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();
			return this;
		},
		intersectsSphere: function intersectsSphere(sphere) {
			var planes = this.planes;
			var center = sphere.center;
			var negRadius = -sphere.radius;

			for (var i = 0; i < 6; i++) {
				var distance = planes[i].distanceToPoint(center);

				if (distance < negRadius) {
					return false;
				}
			}

			return true;
		},
		intersectsBox: function intersectsBox(box) {
			var planes = this.planes;

			for (var i = 0; i < 6; i++) {
				var plane = planes[i]; // corner at max distance

				_vec3_1$4.x = plane.normal.x > 0 ? box.max.x : box.min.x;
				_vec3_1$4.y = plane.normal.y > 0 ? box.max.y : box.min.y;
				_vec3_1$4.z = plane.normal.z > 0 ? box.max.z : box.min.z; // if both outside plane, no intersection

				if (plane.distanceToPoint(_vec3_1$4) < 0) {
					return false;
				}
			}

			return true;
		},
		clone: function clone() {
			return new this.constructor().copy(this);
		},
		copy: function copy(frustum) {
			var planes = this.planes;

			for (var i = 0; i < 6; i++) {
				planes[i].copy(frustum.planes[i]);
			}

			return this;
		}
	});

	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 */
	function Color3(r, g, b) {
		this.r = 0;
		this.g = 0;
		this.b = 0;

		if (g === undefined && b === undefined) {
			return this.setHex(r);
		}

		return this.setRGB(r, g, b);
	}

	function euclideanModulo(n, m) {
		return (n % m + m) % m;
	}

	function hue2rgb(p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
		return p;
	}

	Object.assign(Color3.prototype,
	/** @lends zen3d.Color3.prototype */
	{
		/**
				*
				*/
		lerpColors: function lerpColors(c1, c2, ratio) {
			this.r = ratio * (c2.r - c1.r) + c1.r;
			this.g = ratio * (c2.g - c1.g) + c1.g;
			this.b = ratio * (c2.b - c1.b) + c1.b;
		},

		/**
				*
				*/
		lerp: function lerp(c, ratio) {
			this.lerpColors(this, c, ratio);
		},

		/**
				*
				*/
		copy: function copy(v) {
			this.r = v.r;
			this.g = v.g;
			this.b = v.b;
			return this;
		},

		/**
				* Set from hex.
				*/
		setHex: function setHex(hex) {
			hex = Math.floor(hex);
			this.r = (hex >> 16 & 255) / 255;
			this.g = (hex >> 8 & 255) / 255;
			this.b = (hex & 255) / 255;
			return this;
		},

		/**
				* Set from RGB.
				*/
		setRGB: function setRGB(r, g, b) {
			this.r = r;
			this.g = g;
			this.b = b;
			return this;
		},

		/**
				* Set from HSL.
				*/
		setHSL: function setHSL(h, s, l) {
			// h,s,l ranges are in 0.0 - 1.0
			h = euclideanModulo(h, 1);
			s = Math.max(0, Math.min(1, s));
			l = Math.max(0, Math.min(1, l));

			if (s === 0) {
				this.r = this.g = this.b = l;
			} else {
				var p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
				var q = 2 * l - p;
				this.r = hue2rgb(q, p, h + 1 / 3);
				this.g = hue2rgb(q, p, h);
				this.b = hue2rgb(q, p, h - 1 / 3);
			}

			return this;
		},

		/**
				*
				*/
		fromArray: function fromArray(array, offset) {
			if (offset === undefined) offset = 0;
			this.r = array[offset];
			this.g = array[offset + 1];
			this.b = array[offset + 2];
			return this;
		},

		/**
				*
				*/
		toArray: function toArray(array, offset) {
			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;
			array[offset] = this.r;
			array[offset + 1] = this.g;
			array[offset + 2] = this.b;
			return array;
		}
	});

	var _v0 = new Vector3();

	var _v1 = new Vector3();

	var _v2 = new Vector3();

	var _v3 = new Vector3();
	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Vector3} [a=]
	 * @param {zen3d.Vector3} [b=]
	 * @param {zen3d.Vector3} [c=]
	 */


	function Triangle(a, b, c) {
		this.a = a !== undefined ? a : new Vector3();
		this.b = b !== undefined ? b : new Vector3();
		this.c = c !== undefined ? c : new Vector3();
	}

	Object.assign(Triangle.prototype,
	/** @lends zen3d.Triangle.prototype */
	{
		/**
				*
				*/
		set: function set(a, b, c) {
			this.a.copy(a);
			this.b.copy(b);
			this.c.copy(c);
			return this;
		}
	});
	/**
	 * @method
	 */

	Triangle.normal = function (a, b, c, optionalTarget) {
		var result = optionalTarget || new Vector3();
		result.subVectors(c, b);

		_v0.subVectors(a, b);

		result.cross(_v0);
		var resultLengthSq = result.getLengthSquared();

		if (resultLengthSq > 0) {
			return result.multiplyScalar(1 / Math.sqrt(resultLengthSq));
		}

		return result.set(0, 0, 0);
	};
	/**
	 * static/instance method to calculate barycentric coordinates.
	 * based on: http://www.blackpawn.com/texts/pointinpoly/default.html
	 * @method
	 */


	Triangle.barycoordFromPoint = function (point, a, b, c, optionalTarget) {
		_v0.subVectors(c, a);

		_v1.subVectors(b, a);

		_v2.subVectors(point, a);

		var dot00 = _v0.dot(_v0);

		var dot01 = _v0.dot(_v1);

		var dot02 = _v0.dot(_v2);

		var dot11 = _v1.dot(_v1);

		var dot12 = _v1.dot(_v2);

		var denom = dot00 * dot11 - dot01 * dot01;
		var result = optionalTarget || new Vector3(); // collinear or singular triangle

		if (denom === 0) {
			// arbitrary location outside of triangle?
			// not sure if this is the best idea, maybe should be returning undefined
			return result.set(-2, -1, -1);
		}

		var invDenom = 1 / denom;
		var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		var v = (dot00 * dot12 - dot01 * dot02) * invDenom; // barycentric coordinates must always sum to 1

		return result.set(1 - u - v, v, u);
	};
	/**
	 * @method
	 */


	Triangle.containsPoint = function (point, a, b, c) {
		Triangle.barycoordFromPoint(point, a, b, c, _v3);
		return _v3.x >= 0 && _v3.y >= 0 && _v3.x + _v3.y <= 1;
	};

	/**
	 * @author bhouston / http://clara.io
	 * @author WestLangley / http://github.com/WestLangley
	 * @author shawn0326 / http://halflab.me
	 *
	 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
	 *
	 * The poles (phi) are at the positive and negative y axis.
	 * The equator starts at positive z.
	 * @constructor
	 * @memberof zen3d
	 * @param {number} [radius=1]
	 * @param {number} [phi=0]
	 * @param {number} [theta=0]
	 */
	function Spherical(radius, phi, theta) {
		this.radius = radius !== undefined ? radius : 1.0;
		this.phi = phi !== undefined ? phi : 0; // up / down towards top and bottom pole

		this.theta = theta !== undefined ? theta : 0; // around the equator of the sphere
	}

	Object.assign(Spherical.prototype,
	/** @lends zen3d.Spherical.prototype */
	{
		/**
				*
				*/
		set: function set(radius, phi, theta) {
			this.radius = radius;
			this.phi = phi;
			this.theta = theta;
			return this;
		},

		/**
				*
				*/
		copy: function copy(other) {
			this.radius = other.radius;
			this.phi = other.phi;
			this.theta = other.theta;
			return this;
		},

		/**
				*
				*/
		clone: function clone() {
			return new this.constructor().copy(this);
		},

		/**
				* Restrict phi to be betwee EPS and PI-EPS.
				*/
		makeSafe: function makeSafe() {
			var EPS = 0.000001;
			this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
			return this;
		},

		/**
				*
				*/
		setFromVector3: function setFromVector3(vec3) {
			this.radius = vec3.getLength();

			if (this.radius === 0) {
				this.theta = 0;
				this.phi = 0;
			} else {
				this.theta = Math.atan2(vec3.x, vec3.z); // equator angle around y-up axis

				this.phi = Math.acos(Math.min(1, Math.max(-1, vec3.y / this.radius))); // polar angle
			}

			return this;
		}
	});

	/**
	 * Create a texture to apply to a surface or as a reflection or refraction map.
	 * @constructor
	 * @memberof zen3d
	 * @abstract
	 * @extends zen3d.EventDispatcher
	 */

	function TextureBase() {
		EventDispatcher.call(this);
		/**
				* UUID of this texture instance.
				* This gets automatically assigned, so this shouldn't be edited.
				* @readonly
				* @type {string}
				*/

		this.uuid = generateUUID();
		this.textureType = "";
		/**
				* Array of user-specified mipmaps (optional).
				* @member {HTMLImageElement[]|Object[]}
				* @default []
				*/

		this.mipmaps = [];
		/**
				* WebGLTexture border.
				* See {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D WebGLTexture texImage2D()}.
				* Must be zero.
				* @type {number}
				*/

		this.border = 0;
		/**
				* WebGLTexture texel data format.
				* @type {zen3d.WEBGL_PIXEL_FORMAT}
				* @default zen3d.WEBGL_PIXEL_FORMAT.RGBA
				*/

		this.format = WEBGL_PIXEL_FORMAT.RGBA;
		/**
				* WebGLTexture texel data internal format.
				* If null, internalformat is set to be same as format.
				* This must be null in WebGL 1.0.
				* @type {null|zen3d.WEBGL_PIXEL_FORMAT}
				* @default null
				*/

		this.internalformat = null;
		/**
				* WebGLTexture texel data type.
				* @type {zen3d.WEBGL_PIXEL_TYPE}
				* @default zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE
				*/

		this.type = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;
		/**
				* How the texture is sampled when a texel covers more than one pixel.
				* @type {zen3d.WEBGL_TEXTURE_FILTER}
				* @default zen3d.WEBGL_TEXTURE_FILTER.LINEAR
				*/

		this.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;
		/**
				* How the texture is sampled when a texel covers less than one pixel.
				* @type {zen3d.WEBGL_TEXTURE_FILTER}
				* @default zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR
				*/

		this.minFilter = WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;
		/**
				* This defines how the texture is wrapped horizontally and corresponds to U in UV mapping.
				* @type {zen3d.WEBGL_TEXTURE_WRAP}
				* @default zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE
				*/

		this.wrapS = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
		/**
				* This defines how the texture is wrapped vertically and corresponds to V in UV mapping.
				* @type {zen3d.WEBGL_TEXTURE_WRAP}
				* @default zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE
				*/

		this.wrapT = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
		/**
				* The number of samples taken along the axis through the pixel that has the highest density of texels.
				* A higher value gives a less blurry result than a basic mipmap, at the cost of more texture samples being used.
				* Use {@link WebGLcapabilities#maxAnisotropy} to find the maximum valid anisotropy value for the GPU; this value is usually a power of 2.
				* @type {number}
				* @default 1
				*/

		this.anisotropy = 1;
		/**
				* Use for shadow sampler (WebGL 2.0 Only).
				* @type {zen3d.WEBGL_COMPARE_FUNC|undefined}
				* @default undefined
				*/

		this.compare = undefined;
		/**
				* Whether to generate mipmaps (if possible) for a texture.
				* Set this to false if you are creating mipmaps manually.
				* @type {boolean}
				* @default true
				*/

		this.generateMipmaps = true;
		/**
				* texture pixel encoding.
				* @type {zen3d.TEXEL_ENCODING_TYPE}
				* @default zen3d.TEXEL_ENCODING_TYPE.LINEAR
				*/

		this.encoding = TEXEL_ENCODING_TYPE.LINEAR;
		/**
				* Flips the image's Y axis to match the WebGL texture coordinate space.
				* @type {boolean}
				* @default true
				*/

		this.flipY = true;
		/**
				* version code increse if texture changed.
				* if version is still 0, this texture will be skiped.
				* @type {number}
				* @default 0
				*/

		this.version = 0;
	}

	TextureBase.prototype = Object.assign(Object.create(EventDispatcher.prototype),
	/** @lends zen3d.TextureBase.prototype */
	{
		constructor: TextureBase,
		isTexture: true,

		/**
				* Returns a clone of this texture.
				* @return {zen3d.TextureBase}
				*/
		clone: function clone() {
			return new this.constructor().copy(this);
		},

		/**
				* Copy the given texture into this texture.
				* @param {zen3d.TextureBase} source - The texture to be copied.
				* @return {zen3d.TextureBase}
				*/
		copy: function copy(source) {
			this.textureType = source.textureType;
			this.border = source.border;
			this.format = source.format;
			this.internalformat = source.internalformat;
			this.type = source.type;
			this.magFilter = source.magFilter;
			this.minFilter = source.minFilter;
			this.wrapS = source.wrapS;
			this.wrapT = source.wrapT;
			this.anisotropy = source.anisotropy;
			this.generateMipmaps = source.generateMipmaps;
			this.encoding = source.encoding;
			this.flipY = source.flipY;
			this.version = source.version;
			return this;
		},

		/**
				* Dispatches a dispose event.
				*/
		dispose: function dispose() {
			this.dispatchEvent({
				type: 'dispose'
			});
			this.version = 0;
		}
	});

	/**
	 * Handles and keeps track of loaded and pending data. A default global instance of this class is created and used by loaders if not supplied manually - see {@link zen3d.DefaultLoadingManager}.
	 * In general that should be sufficient, however there are times when it can be useful to have seperate loaders - for example if you want to show seperate loading bars for objects and textures.
	 * @constructor
	 * @author mrdoob / http://mrdoob.com/
	 * @param {Function} onLoad — (optional) this function will be called when all loaders are done.
	 * @param {Function} onProgress — (optional) this function will be called when an item is complete.
	 * @param {Function} onError — (optional) this function will be called a loader encounters errors.
	 */
	function LoadingManager(onLoad, onProgress, onError) {
		var scope = this;
		var isLoading = false;
		var itemsLoaded = 0;
		var itemsTotal = 0;
		var urlModifier = undefined; // Refer to #5689 for the reason why we don't set .onStart
		// in the constructor

		this.onStart = undefined;
		this.onLoad = onLoad;
		this.onProgress = onProgress;
		this.onError = onError;

		this.itemStart = function (url) {
			itemsTotal++;

			if (isLoading === false) {
				if (scope.onStart !== undefined) {
					scope.onStart(url, itemsLoaded, itemsTotal);
				}
			}

			isLoading = true;
		};

		this.itemEnd = function (url) {
			itemsLoaded++;

			if (scope.onProgress !== undefined) {
				scope.onProgress(url, itemsLoaded, itemsTotal);
			}

			if (itemsLoaded === itemsTotal) {
				isLoading = false;

				if (scope.onLoad !== undefined) {
					scope.onLoad();
				}
			}
		};

		this.itemError = function (url) {
			if (scope.onError !== undefined) {
				scope.onError(url);
			}
		};

		this.resolveURL = function (url) {
			if (urlModifier) {
				return urlModifier(url);
			}

			return url;
		};

		this.setURLModifier = function (transform) {
			urlModifier = transform;
			return this;
		};
	}

	var DefaultLoadingManager = new LoadingManager();

	/**
	 * A loader for loading an Image.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.LoadingManager} manager — The loadingManager for the loader to use. Default is zen3d.DefaultLoadingManager.
	 */

	function ImageLoader(manager) {
		this.crossOrigin = undefined;
		this.path = undefined;
		this.manager = manager !== undefined ? manager : DefaultLoadingManager;
	}

	Object.assign(ImageLoader.prototype,
	/** @lends zen3d.ImageLoader.prototype */
	{
		/**
				* Load the URL and pass the response to the onLoad function.
				* @param {string} url — the path or URL to the file. This can also be a Data URI.
				* @param {Function} [onLoad=] — Will be called when loading completes. The argument will be the loaded image.
				* @param {Function} [onProgress=] — Will be called while load progresses. todo.
				* @param {Function} [onError=] — Will be called if an error occurs.
				*/
		load: function load(url, onLoad, onProgress, onError) {
			if (url === undefined) url = '';
			if (this.path !== undefined) url = this.path + url;
			url = this.manager.resolveURL(url);
			var scope = this;
			var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

			function onImageLoad() {
				image.removeEventListener('load', onImageLoad, false);
				image.removeEventListener('error', onImageError, false);
				if (onLoad) onLoad(this);
				scope.manager.itemEnd(url);
			}

			function onImageError(event) {
				image.removeEventListener('load', onImageLoad, false);
				image.removeEventListener('error', onImageError, false);
				if (onError) onError(event);
				scope.manager.itemError(url);
				scope.manager.itemEnd(url);
			}

			image.addEventListener('load', onImageLoad, false);
			image.addEventListener('error', onImageError, false);

			if (url.substr(0, 5) !== 'data:') {
				if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;
			}

			scope.manager.itemStart(url);
			image.src = url;
			return image;
		},

		/**
				* If set, assigns the crossOrigin attribute of the image to the value of crossOrigin, prior to starting the load.
				* Default is "anonymous".
				* @param {string} value
				* @return {zen3d.ImageLoader}
				*/
		setCrossOrigin: function setCrossOrigin(value) {
			this.crossOrigin = value;
			return this;
		},

		/**
				* Set the base path or URL from which to load files.
				* This can be useful if you are loading many images from the same directory.
				* @param {string} value
				* @return {zen3d.ImageLoader}
				*/
		setPath: function setPath(value) {
			this.path = value;
			return this;
		}
	});

	/**
	 * A low level class for loading resources with XMLHttpRequest, used internaly by most loaders.
	 * It can also be used directly to load any file type that does not have a loader.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.LoadingManager} manager — The loadingManager for the loader to use. Default is zen3d.DefaultLoadingManager.
	 */

	function FileLoader(manager) {
		this.path = undefined;
		this.responseType = undefined;
		this.withCredentials = undefined;
		this.mimeType = undefined;
		this.requestHeader = undefined;
		this.manager = manager !== undefined ? manager : DefaultLoadingManager;
	}

	Object.assign(FileLoader.prototype,
	/** @lends zen3d.FileLoader.prototype */
	{
		/**
				* Load the URL and pass the response to the onLoad function.
				* @param {string} url — the path or URL to the file. This can also be a Data URI.
				* @param {Function} [onLoad=] — Will be called when loading completes. The argument will be the loaded response.
				* @param {Function} [onProgress=] — Will be called while load progresses. The argument will be the XMLHttpRequest instance, which contains .total and .loaded bytes.
				* @param {Function} [onError=] — Will be called if an error occurs.
				*/
		load: function load(url, onLoad, onProgress, onError) {
			if (url === undefined) url = '';
			if (this.path != undefined) url = this.path + url;
			url = this.manager.resolveURL(url);
			var scope = this; // Check for data: URI

			var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
			var dataUriRegexResult = url.match(dataUriRegex);
			var request;

			if (dataUriRegexResult) {
				// Safari can not handle Data URIs through XMLHttpRequest so process manually
				var mimeType = dataUriRegexResult[1];
				var isBase64 = !!dataUriRegexResult[2];
				var data = dataUriRegexResult[3];
				data = decodeURIComponent(data);
				if (isBase64) data = atob(data); // decode base64

				try {
					var response;
					var responseType = (this.responseType || '').toLowerCase();

					switch (responseType) {
						case 'arraybuffer':
						case 'blob':
							response = new ArrayBuffer(data.length);
							var view = new Uint8Array(response);

							for (var i = 0; i < data.length; i++) {
								view[i] = data.charCodeAt(i);
							}

							if (responseType === 'blob') {
								response = new Blob([response], {
									type: mimeType
								});
							}

							break;

						case 'document':
							var parser = new DOMParser();
							response = parser.parseFromString(data, mimeType);
							break;

						case 'json':
							response = JSON.parse(data);
							break;

						default:
							// 'text' or other
							response = data;
							break;
					} // Wait for next browser tick


					setTimeout(function () {
						if (onLoad) onLoad(response);
						scope.manager.itemEnd(url);
					}, 0);
				} catch (error) {
					// Wait for next browser tick
					setTimeout(function () {
						onError && onError(error);
						scope.manager.itemError(url);
						scope.manager.itemEnd(url);
					}, 0);
				}
			} else {
				request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.addEventListener('load', function (event) {
					var response = this.response;

					if (this.status === 200) {
						if (onLoad) onLoad(response);
						scope.manager.itemEnd(url);
					} else if (this.status === 0) {
						// Some browsers return HTTP Status 0 when using non-http protocol
						// e.g. 'file://' or 'data://'. Handle as success.
						console.warn('zen3d.FileLoader: HTTP Status 0 received.');
						if (onLoad) onLoad(response);
						scope.manager.itemEnd(url);
					} else {
						if (onError) onError(event);
						scope.manager.itemError(url);
						scope.manager.itemEnd(url);
					}
				}, false);

				if (onProgress !== undefined) {
					request.addEventListener('progress', function (event) {
						onProgress(event);
					}, false);
				}

				if (onError !== undefined) {
					request.addEventListener('error', function (event) {
						onError(event);
						scope.manager.itemError(url);
						scope.manager.itemEnd(url);
					}, false);
				}

				if (this.responseType !== undefined) request.responseType = this.responseType;
				if (this.withCredentials !== undefined) request.withCredentials = this.withCredentials;
				if (request.overrideMimeType) request.overrideMimeType(this.mimeType !== undefined ? this.mimeType : 'text/plain');

				for (var header in this.requestHeader) {
					request.setRequestHeader(header, this.requestHeader[header]);
				}

				request.send(null);
			}

			scope.manager.itemStart(url);
			return request;
		},

		/**
				* Set the base path or URL from which to load files.
				* This can be useful if you are loading many models from the same directory.
				* @param {string} value
				* @return {zen3d.FileLoader}
				*/
		setPath: function setPath(value) {
			this.path = value;
			return this;
		},

		/**
				* Change the response type. Valid values are:
				* text or empty string (default) - returns the data as string.
				* arraybuffer - loads the data into a ArrayBuffer and returns that.
				* blob - returns the data as a Blob.
				* document - parses the file using the DOMParser.
				* json - parses the file using JSON.parse.
				* @param {string} value
				* @return {zen3d.FileLoader}
				*/
		setResponseType: function setResponseType(value) {
			this.responseType = value;
			return this;
		},

		/**
				* Whether the XMLHttpRequest uses credentials such as cookies, authorization headers or TLS client certificates.
				* See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials XMLHttpRequest.withCredentials}.
				* Note that this has no effect if you are loading files locally or from the same domain.
				* @param {boolean} value
				* @return {zen3d.FileLoader}
				*/
		setWithCredentials: function setWithCredentials(value) {
			this.withCredentials = value;
			return this;
		},

		/**
				* Set the expected mimeType of the file being loaded.
				* Note that in many cases this will be determined automatically, so by default it is undefined.
				* @param {string} value
				* @return {zen3d.FileLoader}
				*/
		setMimeType: function setMimeType(value) {
			this.mimeType = value;
			return this;
		},

		/**
				* The request header used in HTTP request.
				* Default is undefined.
				* @param {string} value
				* @return {zen3d.FileLoader}
				*/
		setRequestHeader: function setRequestHeader(value) {
			this.requestHeader = value;
			return this;
		}
	});

	/**
	 * A loader for loading a .tga Image.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.LoadingManager} manager — The loadingManager for the loader to use. Default is zen3d.DefaultLoadingManager.
	 */

	function TGALoader(manager) {
		this.manager = manager !== undefined ? manager : DefaultLoadingManager;
	}

	Object.assign(TGALoader.prototype,
	/** @lends zen3d.TGALoader.prototype */
	{
		/**
				* Load the URL and pass the response to the onLoad function.
				* @param {string} url — the path or URL to the file. This can also be a Data URI.
				* @param {Function} [onLoad=] — Will be called when loading completes. The argument will be the loaded image ( draw to an canvas element ).
				* @param {Function} [onProgress=] — Will be called while load progresses. The argument will be the XMLHttpRequest instance, which contains .total and .loaded bytes.
				* @param {Function} [onError=] — Will be called if an error occurs.
				*/
		load: function load(url, onLoad, onProgress, onError) {
			var that = this;
			var loader = new FileLoader(this.manager);
			loader.setResponseType('arraybuffer');
			loader.load(url, function (buffer) {
				if (onLoad !== undefined) {
					onLoad(that.parse(buffer));
				}
			}, onProgress, onError);
		},
		// reference from vthibault, https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js
		parse: function parse(buffer) {
			// TGA Constants
			var TGA_TYPE_NO_DATA = 0,
					TGA_TYPE_INDEXED = 1,
					TGA_TYPE_RGB = 2,
					TGA_TYPE_GREY = 3,
					TGA_TYPE_RLE_INDEXED = 9,
					TGA_TYPE_RLE_RGB = 10,
					TGA_TYPE_RLE_GREY = 11,
					TGA_ORIGIN_MASK = 0x30,
					TGA_ORIGIN_SHIFT = 0x04,
					TGA_ORIGIN_BL = 0x00,
					TGA_ORIGIN_BR = 0x01,
					TGA_ORIGIN_UL = 0x02,
					TGA_ORIGIN_UR = 0x03;

			if (buffer.length < 19) {
				console.error('TGALoader.parse: Not enough data to contain header.');
			}

			var content = new Uint8Array(buffer),
					offset = 0,
					header = {
				id_length: content[offset++],
				colormap_type: content[offset++],
				image_type: content[offset++],
				colormap_index: content[offset++] | content[offset++] << 8,
				colormap_length: content[offset++] | content[offset++] << 8,
				colormap_size: content[offset++],
				origin: [content[offset++] | content[offset++] << 8, content[offset++] | content[offset++] << 8],
				width: content[offset++] | content[offset++] << 8,
				height: content[offset++] | content[offset++] << 8,
				pixel_size: content[offset++],
				flags: content[offset++]
			};

			function tgaCheckHeader(header) {
				switch (header.image_type) {
					// Check indexed type
					case TGA_TYPE_INDEXED:
					case TGA_TYPE_RLE_INDEXED:
						if (header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1) {
							console.error('TGALoader.parse.tgaCheckHeader: Invalid type colormap data for indexed type');
						}

						break;
					// Check colormap type

					case TGA_TYPE_RGB:
					case TGA_TYPE_GREY:
					case TGA_TYPE_RLE_RGB:
					case TGA_TYPE_RLE_GREY:
						if (header.colormap_type) {
							console.error('TGALoader.parse.tgaCheckHeader: Invalid type colormap data for colormap type');
						}

						break;
					// What the need of a file without data ?

					case TGA_TYPE_NO_DATA:
						console.error('TGALoader.parse.tgaCheckHeader: No data');
					// Invalid type ?

					default:
						console.error('TGALoader.parse.tgaCheckHeader: Invalid type " ' + header.image_type + '"');
				} // Check image width and height


				if (header.width <= 0 || header.height <= 0) {
					console.error('TGALoader.parse.tgaCheckHeader: Invalid image size');
				} // Check image pixel size


				if (header.pixel_size !== 8 && header.pixel_size !== 16 && header.pixel_size !== 24 && header.pixel_size !== 32) {
					console.error('TGALoader.parse.tgaCheckHeader: Invalid pixel size "' + header.pixel_size + '"');
				}
			} // Check tga if it is valid format


			tgaCheckHeader(header);

			if (header.id_length + offset > buffer.length) {
				console.error('TGALoader.parse: No data');
			} // Skip the needn't data


			offset += header.id_length; // Get targa information about RLE compression and palette

			var use_rle = false,
					use_pal = false,
					use_grey = false;

			switch (header.image_type) {
				case TGA_TYPE_RLE_INDEXED:
					use_rle = true;
					use_pal = true;
					break;

				case TGA_TYPE_INDEXED:
					use_pal = true;
					break;

				case TGA_TYPE_RLE_RGB:
					use_rle = true;
					break;

				case TGA_TYPE_RGB:
					break;

				case TGA_TYPE_RLE_GREY:
					use_rle = true;
					use_grey = true;
					break;

				case TGA_TYPE_GREY:
					use_grey = true;
					break;
			} // Parse tga image buffer


			function tgaParse(use_rle, use_pal, header, offset, data) {
				var pixel_data, pixel_size, pixel_total, palettes;
				pixel_size = header.pixel_size >> 3;
				pixel_total = header.width * header.height * pixel_size; // Read palettes

				if (use_pal) {
					palettes = data.subarray(offset, offset += header.colormap_length * (header.colormap_size >> 3));
				} // Read RLE


				if (use_rle) {
					pixel_data = new Uint8Array(pixel_total);
					var c, count, i;
					var shift = 0;
					var pixels = new Uint8Array(pixel_size);

					while (shift < pixel_total) {
						c = data[offset++];
						count = (c & 0x7f) + 1; // RLE pixels.

						if (c & 0x80) {
							// Bind pixel tmp array
							for (i = 0; i < pixel_size; ++i) {
								pixels[i] = data[offset++];
							} // Copy pixel array


							for (i = 0; i < count; ++i) {
								pixel_data.set(pixels, shift + i * pixel_size);
							}

							shift += pixel_size * count;
						} else {
							// Raw pixels.
							count *= pixel_size;

							for (i = 0; i < count; ++i) {
								pixel_data[shift + i] = data[offset++];
							}

							shift += count;
						}
					}
				} else {
					// RAW Pixels
					pixel_data = data.subarray(offset, offset += use_pal ? header.width * header.height : pixel_total);
				}

				return {
					pixel_data: pixel_data,
					palettes: palettes
				};
			}

			function tgaGetImageData8bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes) {
				var colormap = palettes;
				var color,
						i = 0,
						x,
						y;
				var width = header.width;

				for (y = y_start; y !== y_end; y += y_step) {
					for (x = x_start; x !== x_end; x += x_step, i++) {
						color = image[i];
						imageData[(x + width * y) * 4 + 3] = 255;
						imageData[(x + width * y) * 4 + 2] = colormap[color * 3 + 0];
						imageData[(x + width * y) * 4 + 1] = colormap[color * 3 + 1];
						imageData[(x + width * y) * 4 + 0] = colormap[color * 3 + 2];
					}
				}

				return imageData;
			}

			function tgaGetImageData16bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
				var color,
						i = 0,
						x,
						y;
				var width = header.width;

				for (y = y_start; y !== y_end; y += y_step) {
					for (x = x_start; x !== x_end; x += x_step, i += 2) {
						color = image[i + 0] + (image[i + 1] << 8); // Inversed ?

						imageData[(x + width * y) * 4 + 0] = (color & 0x7C00) >> 7;
						imageData[(x + width * y) * 4 + 1] = (color & 0x03E0) >> 2;
						imageData[(x + width * y) * 4 + 2] = (color & 0x001F) >> 3;
						imageData[(x + width * y) * 4 + 3] = color & 0x8000 ? 0 : 255;
					}
				}

				return imageData;
			}

			function tgaGetImageData24bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
				var i = 0,
						x,
						y;
				var width = header.width;

				for (y = y_start; y !== y_end; y += y_step) {
					for (x = x_start; x !== x_end; x += x_step, i += 3) {
						imageData[(x + width * y) * 4 + 3] = 255;
						imageData[(x + width * y) * 4 + 2] = image[i + 0];
						imageData[(x + width * y) * 4 + 1] = image[i + 1];
						imageData[(x + width * y) * 4 + 0] = image[i + 2];
					}
				}

				return imageData;
			}

			function tgaGetImageData32bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
				var i = 0,
						x,
						y;
				var width = header.width;

				for (y = y_start; y !== y_end; y += y_step) {
					for (x = x_start; x !== x_end; x += x_step, i += 4) {
						imageData[(x + width * y) * 4 + 2] = image[i + 0];
						imageData[(x + width * y) * 4 + 1] = image[i + 1];
						imageData[(x + width * y) * 4 + 0] = image[i + 2];
						imageData[(x + width * y) * 4 + 3] = image[i + 3];
					}
				}

				return imageData;
			}

			function tgaGetImageDataGrey8bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
				var color,
						i = 0,
						x,
						y;
				var width = header.width;

				for (y = y_start; y !== y_end; y += y_step) {
					for (x = x_start; x !== x_end; x += x_step, i++) {
						color = image[i];
						imageData[(x + width * y) * 4 + 0] = color;
						imageData[(x + width * y) * 4 + 1] = color;
						imageData[(x + width * y) * 4 + 2] = color;
						imageData[(x + width * y) * 4 + 3] = 255;
					}
				}

				return imageData;
			}

			function tgaGetImageDataGrey16bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
				var i = 0,
						x,
						y;
				var width = header.width;

				for (y = y_start; y !== y_end; y += y_step) {
					for (x = x_start; x !== x_end; x += x_step, i += 2) {
						imageData[(x + width * y) * 4 + 0] = image[i + 0];
						imageData[(x + width * y) * 4 + 1] = image[i + 0];
						imageData[(x + width * y) * 4 + 2] = image[i + 0];
						imageData[(x + width * y) * 4 + 3] = image[i + 1];
					}
				}

				return imageData;
			}

			function getTgaRGBA(data, width, height, image, palette) {
				var x_start, y_start, x_step, y_step, x_end, y_end;

				switch ((header.flags & TGA_ORIGIN_MASK) >> TGA_ORIGIN_SHIFT) {
					default:
					case TGA_ORIGIN_UL:
						x_start = 0;
						x_step = 1;
						x_end = width;
						y_start = 0;
						y_step = 1;
						y_end = height;
						break;

					case TGA_ORIGIN_BL:
						x_start = 0;
						x_step = 1;
						x_end = width;
						y_start = height - 1;
						y_step = -1;
						y_end = -1;
						break;

					case TGA_ORIGIN_UR:
						x_start = width - 1;
						x_step = -1;
						x_end = -1;
						y_start = 0;
						y_step = 1;
						y_end = height;
						break;

					case TGA_ORIGIN_BR:
						x_start = width - 1;
						x_step = -1;
						x_end = -1;
						y_start = height - 1;
						y_step = -1;
						y_end = -1;
						break;
				}

				if (use_grey) {
					switch (header.pixel_size) {
						case 8:
							tgaGetImageDataGrey8bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
							break;

						case 16:
							tgaGetImageDataGrey16bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
							break;

						default:
							console.error('TGALoader.parse.getTgaRGBA: not support this format');
							break;
					}
				} else {
					switch (header.pixel_size) {
						case 8:
							tgaGetImageData8bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette);
							break;

						case 16:
							tgaGetImageData16bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
							break;

						case 24:
							tgaGetImageData24bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
							break;

						case 32:
							tgaGetImageData32bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
							break;

						default:
							console.error('TGALoader.parse.getTgaRGBA: not support this format');
							break;
					}
				} // Load image data according to specific method
				// var func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
				// func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );


				return data;
			}

			var canvas = document.createElement('canvas');
			canvas.width = header.width;
			canvas.height = header.height;
			var context = canvas.getContext('2d');
			var imageData = context.createImageData(header.width, header.height);
			var result = tgaParse(use_rle, use_pal, header, offset, content);
			getTgaRGBA(imageData.data, header.width, header.height, result.pixel_data, result.palettes);
			context.putImageData(imageData, 0, 0);
			return canvas;
		}
	});

	/**
	 * A loader for loading a .hdr Image.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.LoadingManager} manager — The loadingManager for the loader to use. Default is zen3d.DefaultLoadingManager.
	 */

	function RGBELoader(manager) {
		this.manager = manager !== undefined ? manager : DefaultLoadingManager;
		this.type = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;
	}

	Object.assign(RGBELoader.prototype,
	/** @lends zen3d.RGBELoader.prototype */
	{
		/**
				* Load the URL and pass the response to the onLoad function.
				* @param {string} url — the path or URL to the file. This can also be a Data URI.
				* @param {Function} [onLoad=] — Will be called when loading completes. The argument will be the loaded image ( draw to an canvas element ).
				* @param {Function} [onProgress=] — Will be called while load progresses. The argument will be the XMLHttpRequest instance, which contains .total and .loaded bytes.
				* @param {Function} [onError=] — Will be called if an error occurs.
				*/
		load: function load(url, onLoad, onProgress, onError) {
			var that = this;
			var loader = new FileLoader(this.manager);
			loader.setResponseType('arraybuffer');
			loader.load(url, function (buffer) {
				if (onLoad !== undefined) {
					onLoad(that.parse(buffer));
				}
			}, onProgress, onError);
		},
		// adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
		parse: function parse(buffer) {
			var
			/* return codes for rgbe routines */
			// RGBE_RETURN_SUCCESS = 0,
			RGBE_RETURN_FAILURE = -1,

			/* default error routine.	change this to change error handling */
			rgbe_read_error = 1,
					rgbe_write_error = 2,
					rgbe_format_error = 3,
					rgbe_memory_error = 4,
					rgbe_error = function rgbe_error(rgbe_error_code, msg) {
				switch (rgbe_error_code) {
					case rgbe_read_error:
						console.error("zen3d.RGBELoader Read Error: " + (msg || ''));
						break;

					case rgbe_write_error:
						console.error("zen3d.RGBELoader Write Error: " + (msg || ''));
						break;

					case rgbe_format_error:
						console.error("zen3d.RGBELoader Bad File Format: " + (msg || ''));
						break;

					default:
					case rgbe_memory_error:
						console.error("zen3d.RGBELoader: Error: " + (msg || ''));
				}

				return RGBE_RETURN_FAILURE;
			},

			/* offsets to red, green, and blue components in a data (float) pixel */
			// RGBE_DATA_RED = 0,
			// RGBE_DATA_GREEN = 1,
			// RGBE_DATA_BLUE = 2,

			/* number of floats per pixel, use 4 since stored in rgba image format */
			// RGBE_DATA_SIZE = 4,

			/* flags indicating which fields in an rgbe_header_info are valid */
			RGBE_VALID_PROGRAMTYPE = 1,
					RGBE_VALID_FORMAT = 2,
					RGBE_VALID_DIMENSIONS = 4,
					NEWLINE = "\n",
					fgets = function fgets(buffer, lineLimit, consume) {
				lineLimit = !lineLimit ? 1024 : lineLimit;
				var p = buffer.pos,
						i = -1,
						len = 0,
						s = '',
						chunkSize = 128,
						chunk = String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));

				while (0 > (i = chunk.indexOf(NEWLINE)) && len < lineLimit && p < buffer.byteLength) {
					s += chunk;
					len += chunk.length;
					p += chunkSize;
					chunk += String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
				}

				if (-1 < i) {
					/* for (i=l-1; i>=0; i--) {
					byteCode = m.charCodeAt(i);
					if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
					else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
					if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
					} */
					if (false !== consume) buffer.pos += len + i + 1;
					return s + chunk.slice(0, i);
				}

				return false;
			},

			/* minimal header reading.	modify if you want to parse more information */
			RGBE_ReadHeader = function RGBE_ReadHeader(buffer) {
				var line,
						match,
						// regexes to parse header info fields
				magic_token_re = /^#\?(\S+)$/,
						gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
						exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
						format_re = /^\s*FORMAT=(\S+)\s*$/,
						dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,
						// RGBE format header struct
				header = {
					valid: 0,

					/* indicate which fields are valid */
					string: '',

					/* the actual header string */
					comments: '',

					/* comments found in header */
					programtype: 'RGBE',

					/* listed at beginning of file to identify it after "#?". defaults to "RGBE" */
					format: '',

					/* RGBE format, default 32-bit_rle_rgbe */
					gamma: 1.0,

					/* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */
					exposure: 1.0,

					/* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */
					width: 0,
					height: 0
					/* image dimensions, width/height */

				};

				if (buffer.pos >= buffer.byteLength || !(line = fgets(buffer))) {
					return rgbe_error(rgbe_read_error, "no header found");
				}
				/* if you want to require the magic token then uncomment the next line */


				if (!(match = line.match(magic_token_re))) {
					return rgbe_error(rgbe_format_error, "bad initial token");
				}

				header.valid |= RGBE_VALID_PROGRAMTYPE;
				header.programtype = match[1];
				header.string += line + "\n";

				while (true) {
					line = fgets(buffer);
					if (false === line) break;
					header.string += line + "\n";

					if ('#' === line.charAt(0)) {
						header.comments += line + "\n";
						continue; // comment line
					}

					if (match = line.match(gamma_re)) {
						header.gamma = parseFloat(match[1]);
					}

					if (match = line.match(exposure_re)) {
						header.exposure = parseFloat(match[1]);
					}

					if (match = line.match(format_re)) {
						header.valid |= RGBE_VALID_FORMAT;
						header.format = match[1]; // '32-bit_rle_rgbe';
					}

					if (match = line.match(dimensions_re)) {
						header.valid |= RGBE_VALID_DIMENSIONS;
						header.height = parseInt(match[1], 10);
						header.width = parseInt(match[2], 10);
					}

					if (header.valid & RGBE_VALID_FORMAT && header.valid & RGBE_VALID_DIMENSIONS) break;
				}

				if (!(header.valid & RGBE_VALID_FORMAT)) {
					return rgbe_error(rgbe_format_error, "missing format specifier");
				}

				if (!(header.valid & RGBE_VALID_DIMENSIONS)) {
					return rgbe_error(rgbe_format_error, "missing image size specifier");
				}

				return header;
			},
					RGBE_ReadPixels_RLE = function RGBE_ReadPixels_RLE(buffer, w, h) {
				var data_rgba,
						offset,
						pos,
						count,
						byteValue,
						scanline_buffer,
						ptr,
						ptr_end,
						i,
						l,
						off,
						isEncodedRun,
						scanline_width = w,
						num_scanlines = h,
						rgbeStart;

				if ( // run length encoding is not allowed so read flat
				scanline_width < 8 || scanline_width > 0x7fff || // this file is not run length encoded
				2 !== buffer[0] || 2 !== buffer[1] || buffer[2] & 0x80) {
					// return the flat buffer
					return new Uint8Array(buffer);
				}

				if (scanline_width !== (buffer[2] << 8 | buffer[3])) {
					return rgbe_error(rgbe_format_error, "wrong scanline width");
				}

				data_rgba = new Uint8Array(4 * w * h);

				if (!data_rgba.length) {
					return rgbe_error(rgbe_memory_error, "unable to allocate buffer space");
				}

				offset = 0;
				pos = 0;
				ptr_end = 4 * scanline_width;
				rgbeStart = new Uint8Array(4);
				scanline_buffer = new Uint8Array(ptr_end); // read in each successive scanline

				while (num_scanlines > 0 && pos < buffer.byteLength) {
					if (pos + 4 > buffer.byteLength) {
						return rgbe_error(rgbe_read_error);
					}

					rgbeStart[0] = buffer[pos++];
					rgbeStart[1] = buffer[pos++];
					rgbeStart[2] = buffer[pos++];
					rgbeStart[3] = buffer[pos++];

					if (2 != rgbeStart[0] || 2 != rgbeStart[1] || (rgbeStart[2] << 8 | rgbeStart[3]) != scanline_width) {
						return rgbe_error(rgbe_format_error, "bad rgbe scanline format");
					} // read each of the four channels for the scanline into the buffer
					// first red, then green, then blue, then exponent


					ptr = 0;

					while (ptr < ptr_end && pos < buffer.byteLength) {
						count = buffer[pos++];
						isEncodedRun = count > 128;
						if (isEncodedRun) count -= 128;

						if (0 === count || ptr + count > ptr_end) {
							return rgbe_error(rgbe_format_error, "bad scanline data");
						}

						if (isEncodedRun) {
							// a (encoded) run of the same value
							byteValue = buffer[pos++];

							for (i = 0; i < count; i++) {
								scanline_buffer[ptr++] = byteValue;
							} // ptr += count;

						} else {
							// a literal-run
							scanline_buffer.set(buffer.subarray(pos, pos + count), ptr);
							ptr += count;
							pos += count;
						}
					} // now convert data from buffer into rgba
					// first red, then green, then blue, then exponent (alpha)


					l = scanline_width; // scanline_buffer.byteLength;

					for (i = 0; i < l; i++) {
						off = 0;
						data_rgba[offset] = scanline_buffer[i + off];
						off += scanline_width; // 1;

						data_rgba[offset + 1] = scanline_buffer[i + off];
						off += scanline_width; // 1;

						data_rgba[offset + 2] = scanline_buffer[i + off];
						off += scanline_width; // 1;

						data_rgba[offset + 3] = scanline_buffer[i + off];
						offset += 4;
					}

					num_scanlines--;
				}

				return data_rgba;
			};

			var byteArray = new Uint8Array(buffer); // var byteLength = byteArray.byteLength;

			byteArray.pos = 0;
			var rgbe_header_info = RGBE_ReadHeader(byteArray);

			if (RGBE_RETURN_FAILURE !== rgbe_header_info) {
				var w = rgbe_header_info.width,
						h = rgbe_header_info.height,
						image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);

				if (RGBE_RETURN_FAILURE !== image_rgba_data) {
					if (this.type === WEBGL_PIXEL_TYPE.UNSIGNED_BYTE) {
						var data = image_rgba_data;
						var format = WEBGL_PIXEL_FORMAT.RGBA; // RGBE handled as RGBA in shaders

						var type = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;
					} else if (this.type === WEBGL_PIXEL_TYPE.FLOAT) {
						var RGBEByteToRGBFloat = function RGBEByteToRGBFloat(sourceArray, sourceOffset, destArray, destOffset) {
							var e = sourceArray[sourceOffset + 3];
							var scale = Math.pow(2.0, e - 128.0) / 255.0;
							destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
							destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
							destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
						};

						var numElements = image_rgba_data.length / 4 * 3;
						var floatArray = new Float32Array(numElements);

						for (var j = 0; j < numElements; j++) {
							RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 3);
						}

						var data = floatArray;
						var format = WEBGL_PIXEL_FORMAT.RGB;
						var type = WEBGL_PIXEL_TYPE.FLOAT;
					} else {
						console.error('zen3d.RGBELoader: unsupported type: ', this.type);
					}

					return {
						width: w,
						height: h,
						data: data,
						header: rgbe_header_info.string,
						gamma: rgbe_header_info.gamma,
						exposure: rgbe_header_info.exposure,
						format: format,
						type: type
					};
				}
			}

			return null;
		}
	});

	/**
	 * Creates a cube texture made up of single image.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.TextureBase
	 */

	function Texture2D() {
		TextureBase.call(this);
		this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_2D;
		/**
				* Image data for this texture.
				* @member {null|HTMLImageElement|Object}
				* @default null
				*/

		this.image = null;
		/**
				* How much a single repetition of the texture is offset from the beginning, in each direction U and V.
				* Typical range is 0.0 to 1.0.
				* _Note:_ The offset property is a convenience modifier and only affects the Texture's application to the first set of UVs on a model.
				* If the Texture is used as a map requiring additional UV sets (e.g. the aoMap or lightMap of most stock materials), those UVs must be manually assigned to achieve the desired offset..
				* @member {zen3d.Vector2}
				* @default zen3d.Vector2(0, 0)
				*/

		this.offset = new Vector2();
		/**
				* How many times the texture is repeated across the surface, in each direction U and V.
				* If repeat is set greater than 1 in either direction, the corresponding Wrap parameter should also be set to {@link zen3d.WEBGL_TEXTURE_WRAP.REPEAT} or {@link zen3d.WEBGL_TEXTURE_WRAP.MIRRORED_REPEAT} to achieve the desired tiling effect.
				* _Note:_ The repeat property is a convenience modifier and only affects the Texture's application to the first set of UVs on a model.
				* If the Texture is used as a map requiring additional UV sets (e.g. the aoMap or lightMap of most stock materials), those UVs must be manually assigned to achieve the desired repetiton.
				* @member {zen3d.Vector2}
				* @default zen3d.Vector2(1, 1)
				*/

		this.repeat = new Vector2(1, 1);
		/**
				* The point around which rotation occurs.
				* A value of (0.5, 0.5) corresponds to the center of the texture.
				* Default is (0, 0), the lower left.
				* @member {zen3d.Vector2}
				* @default zen3d.Vector2(0, 0)
				*/

		this.center = new Vector2();
		/**
				* How much the texture is rotated around the center point, in radians.
				* Postive values are counter-clockwise.
				* @member {number}
				* @default 0
				*/

		this.rotation = 0;
		/**
				* The uv-transform matrix for the texture. Updated by the renderer from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center} when the texture's {@link zen3d.Texture2D#matrixAutoUpdate} property is true.
				* When {@link zen3d.Texture2D#matrixAutoUpdate}	property is false, this matrix may be set manually.
				* Default is the identity matrix.
				* @member {zen3d.Matrix3}
				* @default Matrix3()
				*/

		this.matrix = new Matrix3();
		/**
				* Whether to update the texture's uv-transform {@link zen3d.Texture2D#matrix} from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center}.
				* Set this to false if you are specifying the uv-transform matrix directly.
				* @member {boolean}
				* @default true
				*/

		this.matrixAutoUpdate = true;
		/**
		 * Whether to use the texture's uv-transform {@link zen3d.Texture2D#matrix} from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center}.
		 * This is only useful when the texture is an alphaMap for Now.
		 * Other material map will use a same uv-transform by default.
		 * @member {boolean}
		 * @default true
		 */

		this.useUVTransform = true;
	}

	Texture2D.prototype = Object.assign(Object.create(TextureBase.prototype),
	/** @lends zen3d.Texture2D.prototype */
	{
		constructor: Texture2D,
		copy: function copy(source) {
			TextureBase.prototype.copy.call(this, source);
			this.image = source.image;
			this.mipmaps = source.mipmaps.slice(0);
			this.offset.copy(source.offset);
			this.repeat.copy(source.repeat);
			this.center.copy(source.center);
			this.rotation = source.rotation;
			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrix.copy(source.matrix);
			return this;
		},

		/**
				* Update the texture's uv-transform {@link zen3d.Texture2D#matrix} from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center}.
				*/
		updateMatrix: function updateMatrix() {
			this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
		}
	});
	/**
	 * Create Texture2D from image.
	 * @param {HTMLImageElement} image
	 * @return {TextureCube} - The result Texture.
	 */

	Texture2D.fromImage = function (image) {
		var texture = new Texture2D();
		texture.image = image;
		texture.version++;
		return texture;
	};
	/**
	 * Create Texture2D from src.
	 * @param {string} src
	 * @return {TextureCube} - The result Texture.
	 */


	Texture2D.fromSrc = function (src) {
		var texture = new Texture2D(); // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.

		var isJPEG = src.search(/\.(jpg|jpeg)$/) > 0 || src.search(/^data\:image\/jpeg/) === 0;
		var isTGA = src.search(/\.(tga)$/) > 0 || src.search(/^data\:image\/tga/) === 0;
		var isHDR = src.search(/\.(hdr)$/) > 0;

		if (isHDR) {
			var loader = new RGBELoader();
			loader.load(src, function (textureData) {
				texture.image = {
					data: textureData.data,
					width: textureData.width,
					height: textureData.height
				};
				texture.encoding = zen3d.TEXEL_ENCODING_TYPE.RGBE;
				texture.type = textureData.type;
				texture.format = textureData.format;
				texture.version++;
				texture.dispatchEvent({
					type: 'onload'
				});
			});
		} else {
			var loader = isTGA ? new TGALoader() : new ImageLoader();
			loader.load(src, function (image) {
				texture.format = isJPEG ? WEBGL_PIXEL_FORMAT.RGB : WEBGL_PIXEL_FORMAT.RGBA;
				texture.image = image;
				texture.version++;
				texture.dispatchEvent({
					type: 'onload'
				});
			});
		}

		return texture;
	};

	/**
	 * Creates a cube texture made up of six images.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.TextureBase
	 */

	function TextureCube() {
		TextureBase.call(this);
		this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_CUBE_MAP;
		/**
				* Images data for this texture.
				* @member {HTMLImageElement[]}
				* @default []
				*/

		this.images = [];
		/**
				* @default false
				*/

		this.flipY = false;
	}

	TextureCube.prototype = Object.assign(Object.create(TextureBase.prototype),
	/** @lends zen3d.TextureCube.prototype */
	{
		constructor: TextureCube,
		copy: function copy(source) {
			TextureBase.prototype.copy.call(this, source);
			this.images = source.images.slice(0);
			return this;
		}
	});
	/**
	 * Create TextureCube from images.
	 * @param {HTMLImageElement[]} imageArray
	 * @return {TextureCube} - The result Texture.
	 */

	TextureCube.fromImage = function (imageArray) {
		var texture = new TextureCube();
		var images = texture.images;

		for (var i = 0; i < 6; i++) {
			images[i] = imageArray[i];
		}

		texture.version++;
		return texture;
	};
	/**
	 * Create TextureCube from src array.
	 * @param {string[]} srcArray
	 * @return {TextureCube} - The result Texture.
	 */


	TextureCube.fromSrc = function (srcArray) {
		var texture = new TextureCube();
		var images = texture.images;
		var src = srcArray[0]; // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.

		var isJPEG = src.search(/\.(jpg|jpeg)$/) > 0 || src.search(/^data\:image\/jpeg/) === 0;
		var isTGA = src.search(/\.(tga)$/) > 0 || src.search(/^data\:image\/tga/) === 0;
		var isHDR = src.search(/\.(hdr)$/) > 0;
		var loader;

		if (isHDR) {
			loader = new RGBELoader();
		} else {
			loader = isTGA ? new TGALoader() : new ImageLoader();
		}

		var count = 0;

		function next(image) {
			if (image) {
				if (isHDR) {
					images.push({
						data: image.data,
						width: image.width,
						height: image.height
					});
				} else {
					images.push(image);
				}

				count++;
			}

			if (count >= 6) {
				loaded(isHDR ? image : undefined);
				return;
			}

			loader.load(srcArray[count], next);
		}

		next();

		function loaded(imageData) {
			if (imageData) {
				texture.encoding = TEXEL_ENCODING_TYPE.RGBE;
				texture.type = imageData.type;
				texture.format = imageData.format;
			} else {
				texture.format = isJPEG ? WEBGL_PIXEL_FORMAT.RGB : WEBGL_PIXEL_FORMAT.RGBA;
			}

			texture.version++;
			texture.dispatchEvent({
				type: 'onload'
			});
		}

		return texture;
	};

	/**
	 * Creates a 3D texture. (WebGL 2.0)
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.TextureBase
	 */

	function Texture3D() {
		TextureBase.call(this);
		this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_3D;
		/**
				* Image data for this texture.
				* @member {Object}
				* @default null
				*/

		this.image = {
			data: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]),
			width: 2,
			height: 2,
			depth: 2
		};
		/**
				* WebGLTexture texel data format.
				* @type {zen3d.WEBGL_PIXEL_FORMAT}
				* @default zen3d.WEBGL_PIXEL_FORMAT.RED
				*/

		this.format = WEBGL_PIXEL_FORMAT.RED;
		/**
				* WebGLTexture texel data internal format.
				* If null, internalformat is set to be same as format.
				* This must be null in WebGL 1.0.
				* @type {null|zen3d.WEBGL_PIXEL_FORMAT}
				* @default zen3d.WEBGL_PIXEL_FORMAT.R8
				*/

		this.internalformat = WEBGL_PIXEL_FORMAT.R8;
		/**
				* WebGLTexture texel data type.
				* @type {zen3d.WEBGL_PIXEL_TYPE}
				* @default zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE
				*/

		this.type = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;
		/**
				* @default false
				*/

		this.flipY = false;
	}

	Texture3D.prototype = Object.assign(Object.create(TextureBase.prototype),
	/** @lends zen3d.TextureCube.prototype */
	{
		constructor: Texture3D
	});

	var _object3DId = 0;

	var _mat4_1$2 = new Matrix4();
	/**
	 * This is the base class for most objects in zen3d
	 * and provides a set of properties and methods for manipulating objects in 3D space.
	 * @constructor
	 * @memberof zen3d
	 */


	function Object3D() {
		Object.defineProperty(this, 'id', {
			value: _object3DId++
		});
		/**
				* UUID of this object instance.
				* This gets automatically assigned, so this shouldn't be edited.
				* @type {string}
				*/

		this.uuid = generateUUID();
		/**
				* Optional name of the object (doesn't need to be unique).
				* @type {string}
				* @default ""
				*/

		this.name = "";
		/**
				* Type of the object.
				* Set by Subclass.
				* @type {zen3d.OBJECT_TYPE}
				*/

		this.type = "";
		/**
				* A Vector3 representing the object's local position.
				* @type {zen3d.Vector3}
				* @default Vector3(0, 0, 0)
				*/

		this.position = new Vector3();
		/**
				* The object's local scale.
				* @type {zen3d.Vector3}
				* @default Vector3(1, 1, 1)
				*/

		this.scale = new Vector3(1, 1, 1);
		/**
				* Object's local rotation as an {@link zen3d.Euler}, in radians.
				* @type {zen3d.Euler}
				* @default Euler(0, 0, 0)
				*/

		this.euler = new Euler();
		/**
				* Object's local rotation as a {@link zen3d.Quaternion}.
				* @type {zen3d.Quaternion}
				* @default Quaternion(0, 0, 0, 1)
				*/

		this.quaternion = new Quaternion(); // bind euler and quaternion

		var euler = this.euler,
				quaternion = this.quaternion;
		euler.onChange(function () {
			quaternion.setFromEuler(euler, false);
		});
		quaternion.onChange(function () {
			euler.setFromQuaternion(quaternion, undefined, false);
		});
		/**
				* The local transform matrix.
				* @type {zen3d.Matrix4}
				*/

		this.matrix = new Matrix4();
		/**
				* The global transform of the object.
				* If the Object3D has no parent, then it's identical to the local transform {@link zen3d.Object3D#matrix}.
				* @type {zen3d.Matrix4}
				*/

		this.worldMatrix = new Matrix4();
		/**
				* Object's parent in the scene graph.
				* An object can have at most one parent.
				* @type {zen3d.Object3D[]}
				*/

		this.children = new Array();
		/**
				* Object's parent in the scene graph.
				* An object can have at most one parent.
				* @type {zen3d.Object3D}
				*/

		this.parent = null;
		/**
				* Whether the object gets rendered into shadow map.
				* @type {boolean}
				* @default false
				*/

		this.castShadow = false;
		/**
				* Whether the material receives shadows.
				* @type {boolean}
				* @default false
				*/

		this.receiveShadow = false;
		/**
				* Defines shadow map type.
				* @type {zen3d.SHADOW_TYPE}
				* @default SHADOW_TYPE.PCF3_SOFT
				*/

		this.shadowType = SHADOW_TYPE.PCF3_SOFT;
		/**
				* When this is set, it checks every frame if the object is in the frustum of the camera before rendering the object.
				* Otherwise the object gets rendered every frame even if it isn't visible.
				* @type {boolean}
				* @default true
				*/

		this.frustumCulled = true;
		/**
				* Object gets rendered if true.
				* @type {boolean}
				* @default true
				*/

		this.visible = true;
		/**
				* This value allows the default rendering order of scene graph objects to be overridden although opaque and transparent objects remain sorted independently.
				* Sorting is from lowest to highest renderOrder.
				* @type {number}
				* @default 0
				*/

		this.renderOrder = 0;
		/**
				* An object that can be used to store custom data about the {@link zen3d.Object3D}.
				* It should not hold references to functions as these will not be cloned.
				* @type {Object}
				* @default {}
				*/

		this.userData = {};
		/**
		 * When this is set, it calculates the matrix of position, (rotation or quaternion) and scale every frame and also recalculates the worldMatrix property.
		 * @type {boolean}
		 * @default true
		 */

		this.matrixAutoUpdate = true;
		/**
		 * When this is set, it calculates the matrix in that frame and resets this property to false.
		 * @type {boolean}
		 * @default true
		 */

		this.matrixNeedsUpdate = true;
		/**
		 * When this is set, it calculates the world matrix in that frame and resets this property to false.
		 * @type {boolean}
		 * @default true
		 */

		this.worldMatrixNeedsUpdate = true;
	}

	Object.assign(Object3D.prototype,
	/** @lends zen3d.Object3D.prototype */
	{
		/**
				* An optional callback that is executed immediately before the Object3D is rendered.
				* @type {Function}
				*/
		onBeforeRender: function onBeforeRender() {},

		/**
				* An optional callback that is executed immediately after the Object3D is rendered.
				* @type {Function}
				*/
		onAfterRender: function onAfterRender() {},

		/**
				* Add object as child of this object.
				* @param {zen3d.Object3D} object
				*/
		add: function add(object) {
			if (object === this) {
				console.error("Object3D.add: object can't be added as a child of itself.", object);
				return;
			}

			if (object.parent !== null) {
				object.parent.remove(object);
			}

			object.parent = this;
			this.children.push(object);
			object.worldMatrixNeedsUpdate = true;
		},

		/**
				* Remove object as child of this object.
				* @param {zen3d.Object3D} object
				*/
		remove: function remove(object) {
			var index = this.children.indexOf(object);

			if (index !== -1) {
				object.parent = null;
				this.children.splice(index, 1);
				object.worldMatrixNeedsUpdate = true;
			}
		},

		/**
				* Searches through the object's children and returns the first with a matching name.
				* Note that for most objects the name is an empty string by default.
				* You will have to set it manually to make use of this method.
				* @param {string} name - String to match to the children's {@link zen3d.Object3D#name} property.
				* @return {zen3d.Object3D}
				*/
		getObjectByName: function getObjectByName(name) {
			return this.getObjectByProperty('name', name);
		},

		/**
				* Searches through the object's children and returns the first with a property that matches the value given.
				* @param {string} name - the property name to search for.
				* @param {number} value - value of the given property.
				* @return {zen3d.Object3D}
				*/
		getObjectByProperty: function getObjectByProperty(name, value) {
			if (this[name] === value) return this;

			for (var i = 0, l = this.children.length; i < l; i++) {
				var child = this.children[i];
				var object = child.getObjectByProperty(name, value);

				if (object !== undefined) {
					return object;
				}
			}

			return undefined;
		},

		/**
				* Update the local transform.
				*/
		updateMatrix: function updateMatrix(force) {
			if (this.matrixAutoUpdate || this.matrixNeedsUpdate) {
				this.matrix.transform(this.position, this.scale, this.quaternion);
				this.matrixNeedsUpdate = false;
				this.worldMatrixNeedsUpdate = true;
			}

			if (this.worldMatrixNeedsUpdate || force) {
				this.worldMatrix.copy(this.matrix);

				if (this.parent) {
					var parentMatrix = this.parent.worldMatrix;
					this.worldMatrix.premultiply(parentMatrix);
				}

				this.worldMatrixNeedsUpdate = false;
				force = true;
			}

			var children = this.children;

			for (var i = 0, l = children.length; i < l; i++) {
				children[i].updateMatrix(force);
			}
		},

		/**
				* Returns a vector representing the direction of object's positive z-axis in world space.
				* This call must be after {@link zen3d.Object3D#updateMatrix}.
				* @method
				* @param {Vector3} [optionalTarget=] — the result will be copied into this Vector3.
				* @return {Vector3} - the result.
				*/
		getWorldDirection: function getWorldDirection(optionalTarget) {
			optionalTarget = optionalTarget || new Vector3();
			var e = this.worldMatrix.elements;
			return optionalTarget.set(e[8], e[9], e[10]).normalize();
		},

		/**
				* Rotates the object to face a point in local space.
				* @method
				* @param {Vector3} target - A vector representing a position in local space.
				* @param {Vector3} up — A vector representing the up direction in local space.
				*/
		lookAt: function lookAt(target, up) {
			_mat4_1$2.lookAtRH(target, this.position, up);

			this.quaternion.setFromRotationMatrix(_mat4_1$2);
		},

		/**
				* Method to get intersections between a casted ray and this object.
				* @abstract
				* @param {Raycaster} raycaster - The {@link zen3d.Raycaster} instance.
				* @param {Array} intersects - output intersects array.
				*/
		raycast: function raycast(raycaster, intersects) {},

		/**
				* Executes the callback on this object and all descendants.
				* @param {Function} callback - A function with as first argument an object3D object.
				*/
		traverse: function traverse(callback) {
			callback(this);
			var children = this.children;

			for (var i = 0, l = children.length; i < l; i++) {
				children[i].traverse(callback);
			}
		},

		/**
				* Returns a clone of this object and optionally all descendants.
				* @param {Function} [recursive=true] - if true, descendants of the object are also cloned.
				* @return {zen3d.Object3D}
				*/
		clone: function clone(recursive) {
			return new this.constructor().copy(this, recursive);
		},

		/**
				* Copy the given object into this object.
				* @param {zen3d.Object3D} source - The object to be copied.
				* @param {Function} [recursive=true] - if true, descendants of the object are also copied.
				* @return {zen3d.Object3D}
				*/
		copy: function copy(source, recursive) {
			if (recursive === undefined) recursive = true;
			this.name = source.name;
			this.type = source.type;
			this.position.copy(source.position);
			this.quaternion.copy(source.quaternion);
			this.scale.copy(source.scale);
			this.matrix.copy(source.matrix);
			this.worldMatrix.copy(source.worldMatrix);
			this.castShadow = source.castShadow;
			this.receiveShadow = source.receiveShadow;
			this.frustumCulled = source.frustumCulled;
			this.userData = JSON.parse(JSON.stringify(source.userData));

			if (recursive === true) {
				for (var i = 0; i < source.children.length; i++) {
					var child = source.children[i];
					this.add(child.clone());
				}
			}

			return this;
		}
	});

	/**
	 * A bone which is part of a Skeleton.
	 * The skeleton in turn is used by the SkinnedMesh.
	 * Bones are almost identical to a blank Object3D.
	 * Bone acturely is a joint.
	 * The position means joint position.
	 * Mesh transform is based this joint space.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Object3D
	 */

	function Bone() {
		Object3D.call(this);
		this.type = "bone";
		/**
				* The origin offset matrix - inverse matrix of the origin transform matrix.
				* @type {zen3d.Matrix4}
				*/

		this.offsetMatrix = new Matrix4();
	}

	Bone.prototype = Object.create(Object3D.prototype);
	Bone.prototype.constructor = Bone;

	var _offsetMatrix = new Matrix4();
	/**
	 * Use an array of bones to create a skeleton that can be used by a SkinnedMesh.
	 * @constructor
	 * @memberof zen3d
	 */


	function Skeleton(bones) {
		// bones in array
		bones = bones || [];
		/**
				* The array of bones.
				* @type {zen3d.Bone[]}
				* @default []
				*/

		this.bones = bones.slice(0);
		/**
				* The array buffer holding the bone data.
				* @type {Float32Array}
				*/

		this.boneMatrices = new Float32Array(16 * this.bones.length);
		/**
				* The {@link zen3d.Texture2D} holding the bone data when using a vertex texture.
				* Use vertex texture to update boneMatrices, by that way, we can use more bones on phone.
				* @type {zen3d.Texture2D|undefined}
				* @default undefined
				*/

		this.boneTexture = undefined;
	}

	Object.assign(Skeleton.prototype,
	/** @lends zen3d.Skeleton.prototype */
	{
		/**
				* Returns the skeleton to the base pose.
				* @method
				*/
		pose: function pose() {
			for (var i = 0; i < this.bones.length; i++) {
				var bone = this.bones[i];
				bone.worldMatrix.getInverse(bone.offsetMatrix);
			}

			for (var i = 0; i < this.bones.length; i++) {
				var bone = this.bones[i];

				if (bone.parent && bone.parent.type == "bone") {
					bone.matrix.getInverse(bone.parent.worldMatrix);
					bone.matrix.multiply(bone.worldMatrix);
				} else {
					bone.matrix.copy(bone.worldMatrix);
				}

				bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);
			}
		},

		/**
				* Updates the boneMatrices and boneTexture after changing the bones.
				* This is called automatically if the skeleton is used with a SkinnedMesh.
				* @method
				* @param {string} name -- String to match to the Bone's .name property.
				* @return {zen3d.Bone}
				*/
		updateBones: function updateBones() {
			for (var i = 0; i < this.bones.length; i++) {
				var bone = this.bones[i];

				_offsetMatrix.multiplyMatrices(bone.worldMatrix, bone.offsetMatrix);

				_offsetMatrix.toArray(this.boneMatrices, i * 16);
			}

			if (this.boneTexture !== undefined) {
				this.boneTexture.version++;
			}
		},

		/**
				* Searches through the skeleton's bone array and returns the first with a matching name.
				* @param {string} name -- String to match to the Bone's .name property.
				* @return {zen3d.Bone}
				*/
		getBoneByName: function getBoneByName(name) {
			for (var i = 0, il = this.bones.length; i < il; i++) {
				var bone = this.bones[i];

				if (bone.name === name) {
					return bone;
				}
			}

			return undefined;
		}
	});

	function select(buffer, dstOffset, srcOffset, t, stride) {
		if (t >= 0.5) {
			for (var i = 0; i !== stride; ++i) {
				buffer[dstOffset + i] = buffer[srcOffset + i];
			}
		}
	}

	function slerp(buffer, dstOffset, srcOffset, t) {
		Quaternion.slerpFlat(buffer, dstOffset, buffer, dstOffset, buffer, srcOffset, t);
	}

	function lerp(buffer, dstOffset, srcOffset, t, stride) {
		var s = 1 - t;

		for (var i = 0; i !== stride; ++i) {
			var j = dstOffset + i;
			buffer[j] = buffer[j] * s + buffer[srcOffset + i] * t;
		}
	} // get array


	function getArray(target, source, stride, count) {
		for (var i = 0; i < count; i++) {
			target[i] = source[stride + i];
		}
	}

	function setArray(target, source, stride, count) {
		for (var i = 0; i < count; i++) {
			target[stride + i] = source[i];
		}
	}
	/**
	 * This holds a reference to a real property in the scene graph; used internally.
	 * Binding property and value, mixer for multiple values.
	 * @constructor
	 * @memberof zen3d
	 * @param {Object3D} target
	 * @param {string} propertyPath
	 * @param {string} typeName - vector/bool/string/quaternion/number/color
	 * @param {Integer} valueSize
	 */


	function PropertyBindingMixer(target, propertyPath, typeName, valueSize) {
		this.target = null;
		this.property = "";
		this.parseBinding(target, propertyPath);
		this.valueSize = valueSize;
		var BufferType = Float64Array;
		var mixFunction;

		switch (typeName) {
			case 'quaternion':
				mixFunction = slerp;
				break;

			case 'string':
			case 'bool':
				BufferType = Array;
				mixFunction = select;
				break;

			default:
				mixFunction = lerp;
		} // [ incoming | accu | orig ]


		this.buffer = new BufferType(valueSize * 3);
		this._mixBufferFunction = mixFunction;
		this.cumulativeWeight = 0;
		this.referenceCount = 0;
		this.useCount = 0;
	}

	Object.assign(PropertyBindingMixer.prototype,
	/** @lends zen3d.PropertyBindingMixer.prototype */
	{
		parseBinding: function parseBinding(target, propertyPath) {
			propertyPath = propertyPath.split(".");

			if (propertyPath.length > 1) {
				var property = target[propertyPath[0]];

				for (var index = 1; index < propertyPath.length - 1; index++) {
					property = property[propertyPath[index]];
				}

				this.property = propertyPath[propertyPath.length - 1];
				this.target = property;
			} else {
				this.property = propertyPath[0];
				this.target = target;
			}
		},
		// remember the state of the bound property and copy it to both accus
		saveOriginalState: function saveOriginalState() {
			var buffer = this.buffer,
					stride = this.valueSize,
					originalValueOffset = stride * 2; // get value

			if (this.valueSize > 1) {
				if (this.target[this.property].toArray) {
					this.target[this.property].toArray(buffer, originalValueOffset);
				} else {
					setArray(buffer, this.target[this.property], originalValueOffset, this.valueSize);
				}
			} else {
				this.target[this.property] = buffer[originalValueOffset];
			} // accu[0..1] := orig -- initially detect changes against the original


			for (var i = stride, e = originalValueOffset; i !== e; ++i) {
				buffer[i] = buffer[originalValueOffset + i % stride];
			}

			this.cumulativeWeight = 0;
		},
		// apply the state previously taken via 'saveOriginalState' to the binding
		restoreOriginalState: function restoreOriginalState() {
			var buffer = this.buffer,
					stride = this.valueSize,
					originalValueOffset = stride * 2; // accu[0..1] := orig -- initially detect changes against the original

			for (var i = stride, e = originalValueOffset; i !== e; ++i) {
				buffer[i] = buffer[originalValueOffset + i % stride];
			}

			this.apply();
		},

		/**
				* Accumulate value.
				* @param {number} weight
				*/
		accumulate: function accumulate(weight) {
			var buffer = this.buffer,
					stride = this.valueSize,
					offset = stride,
					currentWeight = this.cumulativeWeight;

			if (currentWeight === 0) {
				for (var i = 0; i !== stride; ++i) {
					buffer[offset + i] = buffer[i];
				}

				currentWeight = weight;
			} else {
				currentWeight += weight;
				var mix = weight / currentWeight;

				this._mixBufferFunction(buffer, offset, 0, mix, stride);
			}

			this.cumulativeWeight = currentWeight;
		},

		/**
				* Apply to scene graph.
				*/
		apply: function apply() {
			var buffer = this.buffer,
					stride = this.valueSize,
					weight = this.cumulativeWeight;
			this.cumulativeWeight = 0;

			if (weight < 1) {
				// accuN := accuN + original * ( 1 - cumulativeWeight )
				var originalValueOffset = stride * 2;

				this._mixBufferFunction(buffer, stride, originalValueOffset, 1 - weight, stride);
			} // set value


			if (this.valueSize > 1) {
				if (this.target[this.property].fromArray) {
					this.target[this.property].fromArray(buffer, stride);
				} else {
					getArray(this.target[this.property], buffer, stride, this.valueSize);
				}
			} else {
				this.target[this.property] = buffer[stride];
			}
		}
	});

	/**
	 * The AnimationMixer is a player for animations on a particular object in the scene.
	 * When multiple objects in the scene are animated independently, one AnimationMixer may be used for each object.
	 * @constructor
	 * @memberof zen3d
	 */

	function AnimationMixer() {
		this._clips = {};
		this._bindings = {};
		this._activeClips = {};
	}

	Object.assign(AnimationMixer.prototype,
	/** @lends zen3d.AnimationMixer.prototype */
	{
		add: function add(clip) {
			if (this._clips[clip.name] !== undefined) {
				console.warn("AnimationMixer.add: already has clip: " + clip.name);
				return;
			}

			var tracks = clip.tracks;

			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];
				var trackName = track.name;
				var binding;

				if (!this._bindings[trackName]) {
					binding = new PropertyBindingMixer(track.target, track.propertyPath, track.valueTypeName, track.valueSize);
					this._bindings[trackName] = binding;
				} else {
					binding = this._bindings[trackName];
				}

				binding.referenceCount++;
			}

			this._clips[clip.name] = clip;
		},
		remove: function remove(clip) {
			if (!this._clips[clip.name]) {
				console.warn("AnimationMixer.remove: has no clip: " + clip.name);
				return;
			}

			var tracks = clip.tracks;

			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];
				var trackName = track.name;
				var binding = this._bindings[trackName];

				if (binding) {
					binding.referenceCount--;
				}

				if (binding.referenceCount <= 0) {
					delete this._bindings[trackName];
				}
			}

			delete this._clips[clip.name];
		},
		play: function play(name, weight) {
			if (this._activeClips[name] !== undefined) {
				console.warn("AnimationMixer.play: clip " + name + " is playing.");
				return;
			}

			this._activeClips[name] = weight === undefined ? 1 : weight;
			var clip = this._clips[name];

			if (!clip) {
				console.warn("AnimationMixer.stop: clip " + name + " is not found.");
				return;
			}

			clip.frame = 0;
			var tracks = clip.tracks;

			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];
				var trackName = track.name;
				var binding = this._bindings[trackName];

				if (binding) {
					if (binding.useCount++ === 0) {
						binding.saveOriginalState();
					}
				}
			}
		},
		stop: function stop(name) {
			if (this._activeClips[name] === undefined) {
				console.warn("AnimationMixer.stop: clip " + name + " is not playing.");
				return;
			}

			delete this._activeClips[name];
			var clip = this._clips[name];

			if (!clip) {
				console.warn("AnimationMixer.stop: clip " + name + " is not found.");
				return;
			}

			var tracks = clip.tracks;

			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];
				var trackName = track.name;
				var binding = this._bindings[trackName];

				if (binding && binding.useCount > 0) {
					if (--binding.useCount === 0) {
						binding.restoreOriginalState();
					}
				}
			}
		},
		update: function update(t) {
			for (var name in this._activeClips) {
				var clip = this._clips[name];
				var weight = this._activeClips[name];
				clip.update(t, this._bindings, weight);
			}

			for (var key in this._bindings) {
				if (this._bindings[key].useCount > 0) {
					this._bindings[key].apply();
				}
			}
		},
		// set clip weight
		// this method can be used for cross fade
		setClipWeight: function setClipWeight(name, weight) {
			if (this._activeClips[name] === undefined) {
				console.warn("AnimationMixer.stop: clip " + name + " is not playing.");
				return;
			}

			this._activeClips[name] = weight;
		},
		// return all clip names of this animation
		getAllClipNames: function getAllClipNames() {
			var array = [];

			for (var key in this._clips) {
				array.push(key);
			}

			return array;
		}
	});

	/**
	 * Base class for property track.
	 * @constructor
	 * @memberof zen3d
	 * @abstract
	 * @param {zen3d.Object3D} target
	 * @param {string} propertyPath
	 * @param {Array} times
	 * @param {Array} values
	 * @param {Boolean} interpolant
	 */
	function KeyframeTrack(target, propertyPath, times, values, interpolant) {
		this.target = target;
		this.propertyPath = propertyPath;
		this.name = this.target.uuid + "." + propertyPath;
		this.times = times;
		this.values = values;
		this.valueSize = values.length / times.length;
		this.interpolant = interpolant === undefined ? true : interpolant;
	}

	Object.assign(KeyframeTrack.prototype, {
		_getLastTimeIndex: function _getLastTimeIndex(t) {
			var lastTimeIndex = 0;
			var i,
					l = this.times.length;

			for (i = 0; i < l; i++) {
				if (t >= this.times[i]) {
					lastTimeIndex = i;
				}
			}

			return lastTimeIndex;
		},
		getValue: function getValue(t, outBuffer) {
			var index = this._getLastTimeIndex(t),
					times = this.times,
					values = this.values,
					valueSize = this.valueSize;

			var key1 = times[index],
					key2 = times[index + 1],
					value1,
					value2;

			for (var i = 0; i < valueSize; i++) {
				value1 = values[index * valueSize + i];
				value2 = values[(index + 1) * valueSize + i];

				if (this.interpolant) {
					if (value1 !== undefined && value2 !== undefined) {
						var ratio = (t - key1) / (key2 - key1);
						outBuffer[i] = value1 * (1 - ratio) + value2 * ratio;
					} else {
						outBuffer[i] = value1;
					}
				} else {
					outBuffer[i] = value1;
				}
			}
		}
	});

	/**
	 * Used for boolean property track.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Object3D} target
	 * @param {string} propertyPath
	 * @param {Array} times
	 * @param {Array} values
	 * @param {Boolean} interpolant
	 */

	function BooleanKeyframeTrack(target, propertyPath, times, values, interpolant) {
		KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
	}

	BooleanKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {
		constructor: BooleanKeyframeTrack,
		valueTypeName: 'bool',
		getValue: function getValue(t, outBuffer) {
			var index = this._getLastTimeIndex(t),
					key = this.times[index];

			outBuffer[0] = this.values[key];
		}
	});

	/**
	 * Used for color property track.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Object3D} target
	 * @param {string} propertyPath
	 * @param {Array} times
	 * @param {Array} values
	 * @param {Boolean} interpolant
	 */

	function ColorKeyframeTrack(target, propertyPath, times, values, interpolant) {
		KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
	}

	ColorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {
		constructor: ColorKeyframeTrack,
		valueTypeName: 'color'
	});

	/**
	 * An KeyframeClip is a reusable set of keyframe tracks which represent an animation.
	 * @constructor
	 * @memberof zen3d
	 * @param {string} [name=""]
	 */
	function KeyframeClip(name) {
		/**
				* The name of the clip.
				* @type {string}
				*/
		this.name = name || "";
		/**
				* All tracks for this clip.
				* @type {zen3d.KeyframeTrack[]}
				*/

		this.tracks = [];
		/**
				* @type {boolean}
				* @default true
				*/

		this.loop = true;
		/**
				* Start frame.
				* @type {number}
				* @default 0
				*/

		this.startFrame = 0;
		/**
				* End frame.
				* @type {number}
				* @default 0
				*/

		this.endFrame = 0;
		this.frame = 0;
	}

	Object.assign(KeyframeClip.prototype,
	/** @lends zen3d.KeyframeClip.prototype */
	{
		/**
				* Update tracks.
				* @param {number} t
				* @param {Object} bindings
				* @param {number} weight
				*/
		update: function update(t, bindings, weight) {
			this.frame += t;

			if (this.frame > this.endFrame) {
				if (this.loop) {
					this.frame = this.startFrame;
				} else {
					this.frame = this.endFrame;
				}
			}

			for (var i = 0, l = this.tracks.length; i < l; i++) {
				var track = this.tracks[i];
				var bind = bindings[track.name];
				track.getValue(this.frame, bind.buffer);
				bind.accumulate(weight);
			}
		}
	});

	/**
	 * Used for number property track.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Object3D} target
	 * @param {string} propertyPath
	 * @param {Array} times
	 * @param {Array} values
	 * @param {Boolean} interpolant
	 */

	function NumberKeyframeTrack(target, propertyPath, times, values, interpolant) {
		KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
	}

	NumberKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {
		constructor: NumberKeyframeTrack,
		valueTypeName: 'number'
	});

	/**
	 * Used for quaternion property track.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Object3D} target
	 * @param {string} propertyPath
	 * @param {Array} times
	 * @param {Array} values
	 * @param {Boolean} interpolant
	 */

	function QuaternionKeyframeTrack(target, propertyPath, times, values, interpolant) {
		KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
	}

	QuaternionKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {
		constructor: QuaternionKeyframeTrack,
		valueTypeName: 'quaternion',
		getValue: function getValue(t, outBuffer) {
			var index = this._getLastTimeIndex(t),
					times = this.times,
					values = this.values,
					key1 = times[index],
					key2 = times[index + 1],
					i = 0;

			if (this.interpolant) {
				if (key2 !== undefined) {
					var ratio = (t - key1) / (key2 - key1);
					Quaternion.slerpFlat(outBuffer, 0, values, index * 4, values, (index + 1) * 4, ratio);
				} else {
					// just copy
					for (i = 0; i < 4; i++) {
						outBuffer[i] = values[index * 4 + i];
					}
				}
			} else {
				// just copy
				for (i = 0; i < 4; i++) {
					outBuffer[i] = values[index * 4 + i];
				}
			}
		}
	});

	/**
	 * Used for string property track.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Object3D} target
	 * @param {string} propertyPath
	 * @param {Array} times
	 * @param {Array} values
	 * @param {Boolean} interpolant
	 */

	function StringKeyframeTrack(target, propertyPath, times, values, interpolant) {
		KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
	}

	StringKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {
		constructor: StringKeyframeTrack,
		valueTypeName: 'string',
		getValue: function getValue(t, outBuffer) {
			var index = this._getLastTimeIndex(t),
					key = this.times[index];

			outBuffer[0] = this.values[key];
		}
	});

	/**
	 * Used for vector property track.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.Object3D} target
	 * @param {string} propertyPath
	 * @param {Array} times
	 * @param {Array} values
	 * @param {Boolean} interpolant
	 */

	function VectorKeyframeTrack(target, propertyPath, times, values, interpolant) {
		KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
	}

	VectorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {
		constructor: VectorKeyframeTrack,
		valueTypeName: 'vector'
	});

	/**
	 * This class stores data for an attribute (such as vertex positions, face indices, normals, colors, UVs, and any custom attributes ) associated with a Geometry, which allows for more efficient passing of data to the GPU.
	 * Data is stored as vectors of any length (defined by itemSize).
	 * @constructor
	 * @memberof zen3d
	 * @param {TypedArray} array - Used to instantiate the buffer.
	 * @param {Integer} size - the number of values of the array that should be associated with a particular vertex. For instance, if this attribute is storing a 3-component vector (such as a position, normal, or color), then itemSize should be 3.
	 * @param {boolean} [normalized=false] - Indicates how the underlying data in the buffer maps to the values in the GLSL code. For instance, if array is an instance of UInt16Array, and normalized is true, the values 0 - +65535 in the array data will be mapped to 0.0f - +1.0f in the GLSL attribute. An Int16Array (signed) would map from -32767 - +32767 to -1.0f - +1.0f. If normalized is false, the values will be converted to floats which contain the exact value, i.e. 32767 becomes 32767.0f.
	 */
	function BufferAttribute(array, size, normalized) {
		/**
				* The array holding data stored in the buffer.
				* @type {TypedArray}
				*/
		this.array = array;
		/**
				* The length of vectors that are being stored in the array.
				* @type {Integer}
				*/

		this.size = size;
		/**
				* Stores the array's length divided by the size.
				* If the buffer is storing a 3-component vector (such as a position, normal, or color), then this will count the number of such vectors stored.
				* @type {Integer}
				*/

		this.count = array !== undefined ? array.length / size : 0;
		/**
				* Indicates how the underlying data in the buffer maps to the values in the GLSL shader code.
				* See the constructor above for details.
				* @type {boolean}
				*/

		this.normalized = normalized === true;
		/**
				* Whether the buffer is dynamic or not.
				* If false, the GPU is informed that contents of the buffer are likely to be used often and not change often.
				* This corresponds to the gl.STATIC_DRAW flag.
				* If true, the GPU is informed that contents of the buffer are likely to be used often and change often.
				* This corresponds to the gl.DYNAMIC_DRAW flag.
				* @type {boolean}
				* @default false
				*/

		this.dynamic = false;
		/**
				* Object containing:
				* offset: Default is 0. Position at whcih to start update.
				* count: Default is -1, which means don't use update ranges.
				* This can be used to only update some components of stored vectors (for example, just the component related to color).
				*/

		this.updateRange = {
			offset: 0,
			count: -1
		};
		/**
				* A version number, incremented every time the data changes.
				* @type {Integer}
				* @default 0
				*/

		this.version = 0;
	}

	Object.assign(BufferAttribute.prototype,
	/** @lends zen3d.BufferAttribute.prototype */
	{
		/**
				* Array to the TypedArray passed in here.
				* After setting the array, {@link zen3d.BufferAttribute#version} should be incremented.
				* @param {TypedArray} array
				*/
		setArray: function setArray(array) {
			this.count = array !== undefined ? array.length / this.size : 0;
			this.array = array;
			return this;
		},

		/**
				* Copy the parameters from the passed attribute.
				* @param {zen3d.BufferAttribute} source - The attribute to be copied.
				* @return {zen3d.BufferAttribute}
				*/
		copy: function copy(source) {
			this.array = new source.array.constructor(source.array);
			this.size = source.size;
			this.count = source.count;
			this.normalized = source.normalized;
			this.dynamic = source.dynamic;
			return this;
		},

		/**
				* Return a new attribute with the same parameters as this attribute.
				* @return {zen3d.BufferAttribute}
				*/
		clone: function clone() {
			return new this.constructor(this.array, this.size).copy(this);
		}
	});

	function _inheritsLoose(subClass, superClass) {
		subClass.prototype = Object.create(superClass.prototype);
		subClass.prototype.constructor = subClass;

		_setPrototypeOf(subClass, superClass);
	}

	function _setPrototypeOf(o, p) {
		_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
			o.__proto__ = p;
			return o;
		};

		return _setPrototypeOf(o, p);
	}

	var geometryId = 1;
	/**
	 * An efficient representation of mesh, line, or point geometry.
	 * Includes vertex positions, face indices, normals, colors, UVs, and custom attributes within buffers, reducing the cost of passing all this data to the GPU.
	 * To read and edit data in {@link zen3d.Geometry#attributes}.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.EventDispatcher
	 */

	function Geometry() {
		EventDispatcher.call(this);
		Object.defineProperty(this, 'id', {
			value: geometryId++
		});
		/**
				* UUID of this geometry instance.
				* This gets automatically assigned, so this shouldn't be edited.
				* @type {string}
				*/

		this.uuid = generateUUID();
		/**
				* This hashmap has as id the name of the attribute to be set and as value the buffer to set it to.
				* Rather than accessing this property directly, use {@link zen3d.Geometry#addAttribute} and {@link zen3d.Geometry#getAttribute} to access attributes of this geometry.
				* @type {Object}
				*/

		this.attributes = {};
		/**
		 * Hashmap of Attributes Array for morph targets.
		 * @type {Object}
		 */

		this.morphAttributes = {};
		/**
				* Allows for vertices to be re-used across multiple triangles; this is called using "indexed triangles" and each triangle is associated with the indices of three vertices.
				* This attribute therefore stores the index of each vertex for each triangular face.
				* If this attribute is not set, the renderer assumes that each three contiguous positions represent a single triangle.
				* @type {zen3d.BufferAttribute|null}
				*/

		this.index = null;
		/**
				* Bounding box for the bufferGeometry, which can be calculated with {@link zen3d.Geometry#computeBoundingBox}.
				* @type {zen3d.Box3}
				* @default zen3d.Box3()
				*/

		this.boundingBox = new Box3();
		/**
				* Bounding sphere for the bufferGeometry, which can be calculated with {@link zen3d.Geometry#computeBoundingSphere}.
				* @type {zen3d.Sphere}
				* @default zen3d.Sphere()
				*/

		this.boundingSphere = new Sphere();
		/**
				* Split the geometry into groups, each of which will be rendered in a separate WebGL draw call. This allows an array of materials to be used with the geometry.
				* Each group is an object of the form:
				* { start: Integer, count: Integer, materialIndex: Integer }
				* @type {Array}
				* @default []
				*/

		this.groups = [];
		/**
				* A version number, incremented every time the attribute object or index object changes to mark VAO drity.
				* @type {Integer}
				* @default 0
				*/

		this.version = 0;
	}

	Geometry.prototype = Object.assign(Object.create(EventDispatcher.prototype),
	/** @lends zen3d.Geometry.prototype */
	{
		constructor: Geometry,

		/**
				* Adds an attribute to this geometry.
				* Use this rather than the attributes property.
				* @param {string} name
				* @param {zen3d.BufferAttribute|zen3d.InterleavedBufferAttribute} attribute
				*/
		addAttribute: function addAttribute(name, attribute) {
			this.attributes[name] = attribute;
		},

		/**
				* Returns the attribute with the specified name.
				* @return {zen3d.BufferAttribute|zen3d.InterleavedBufferAttribute}
				*/
		getAttribute: function getAttribute(name) {
			return this.attributes[name];
		},

		/**
				* Removes the attribute with the specified name.
				*/
		removeAttribute: function removeAttribute(name) {
			delete this.attributes[name];
		},

		/**
				* Set the {@link zen3d.Geometry#index} buffer.
				* @param {Array|zen3d.BufferAttribute} index
				*/
		setIndex: function setIndex(index) {
			if (Array.isArray(index)) {
				this.index = new BufferAttribute(new Uint16Array(index), 1);
			} else {
				this.index = index;
			}
		},

		/**
				* Adds a group to this geometry; see the {@link zen3d.Geometry#groups} for details.
				* @param {Integer} start
				* @param {Integer} count
				* @param {Integer} materialIndex
				*/
		addGroup: function addGroup(start, count, materialIndex) {
			this.groups.push({
				start: start,
				count: count,
				materialIndex: materialIndex !== undefined ? materialIndex : 0
			});
		},

		/**
				* Clears all groups.
				*/
		clearGroups: function clearGroups() {
			this.groups = [];
		},

		/**
				* Computes bounding box of the geometry, updating {@link zen3d.Geometry#boundingBox}.
				* Bounding boxes aren't computed by default. They need to be explicitly computed.
				*/
		computeBoundingBox: function computeBoundingBox() {
			var position = this.attributes["a_Position"] || this.attributes["position"];

			if (position.isInterleavedBufferAttribute) {
				var data = position.data;
				this.boundingBox.setFromArray(data.array, data.stride);
			} else {
				this.boundingBox.setFromArray(position.array, position.size);
			}
		},

		/**
				* Computes bounding sphere of the geometry, updating {@link zen3d.Geometry#boundingSphere}.
				* Bounding spheres aren't computed by default. They need to be explicitly computed.
				*/
		computeBoundingSphere: function computeBoundingSphere() {
			var position = this.attributes["a_Position"] || this.attributes["position"];

			if (position.isInterleavedBufferAttribute) {
				var data = position.data;
				this.boundingSphere.setFromArray(data.array, data.stride);
			} else {
				this.boundingSphere.setFromArray(position.array, position.size);
			}
		},

		/**
				* Disposes the object from memory.
				* You need to call this when you want the BufferGeometry removed while the application is running.
				*/
		dispose: function dispose() {
			this.dispatchEvent({
				type: 'dispose'
			});
		},

		/**
				* Copies another Geometry to this Geometry.
				* @param {zen3d.Geometry} source - The geometry to be copied.
				* @return {zen3d.Geometry}
				*/
		copy: function copy(source) {
			var name, i, l; // reset

			this.index = null;
			this.attributes = {};
			this.morphAttributes = {};
			this.groups = [];
			this.boundingBox = null;
			this.boundingSphere = null; // index

			var index = source.index;

			if (index !== null) {
				this.setIndex(index.clone());
			} // attributes


			var attributes = source.attributes;

			for (name in attributes) {
				var attribute = attributes[name];
				this.addAttribute(name, attribute.clone());
			} // morph attributes


			var morphAttributes = source.morphAttributes;

			for (name in morphAttributes) {
				var array = [];
				var morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

				for (i = 0, l = morphAttribute.length; i < l; i++) {
					array.push(morphAttribute[i].clone());
				}

				this.morphAttributes[name] = array;
			} // groups


			var groups = source.groups;

			for (i = 0, l = groups.length; i < l; i++) {
				var group = groups[i];
				this.addGroup(group.start, group.count, group.materialIndex);
			}

			var boundingBox = source.boundingBox;

			if (boundingBox !== null) {
				this.boundingBox = new Box3().copy(boundingBox);
			} // bounding sphere


			var boundingSphere = source.boundingSphere;

			if (boundingSphere !== null) {
				this.boundingSphere = new Sphere().copy(boundingSphere);
			}

			return this;
		},

		/**
				* Creates a clone of this Geometry.
				* @return {zen3d.Geometry}
				*/
		clone: function clone() {
			return new Geometry().copy(this);
		}
	});

	/**
	 * CubeGeometry is the quadrilateral primitive geometry class.
	 * It is typically used for creating a cube or irregular quadrilateral of the dimensions provided with the 'width', 'height', and 'depth' constructor arguments.
	 * @memberof zen3d
	 * @extends zen3d.Geometry
	 */

	var CubeGeometry = /*#__PURE__*/function (_Geometry) {
		_inheritsLoose(CubeGeometry, _Geometry);

		/**
		 * @param {number} [width=1] - Width of the sides on the X axis.
		 * @param {number} [height=1] - Height of the sides on the Y axis.
		 * @param {number} [depth=1] - Depth of the sides on the Z axis.
		 * @param {Integer} [widthSegments=1] - Number of segmented faces along the width of the sides.
		 * @param {Integer} [heightSegments=1] - Number of segmented faces along the height of the sides.
		 * @param {Integer} [depthSegments=1] - Number of segmented faces along the depth of the sides.
		 */
		function CubeGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
			var _this;

			_this = _Geometry.call(this) || this;

			_this.buildGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);

			return _this;
		}

		var _proto = CubeGeometry.prototype;

		_proto.buildGeometry = function buildGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
			var scope = this;
			width = width || 1;
			height = height || 1;
			depth = depth || 1; // segments

			widthSegments = Math.floor(widthSegments) || 1;
			heightSegments = Math.floor(heightSegments) || 1;
			depthSegments = Math.floor(depthSegments) || 1; // buffers

			var indices = [];
			var vertices = [];
			var normals = [];
			var uvs = []; // helper variables

			var numberOfVertices = 0;
			var groupStart = 0; // build each side of the box geometry

			buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments, 0); // px

			buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments, 1); // nx

			buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2); // py

			buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments, 3); // ny

			buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments, 4); // pz

			buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments, 5); // nz
			// build geometry

			this.setIndex(indices);
			this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
			this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
			this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

			function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex) {
				var segmentWidth = width / gridX;
				var segmentHeight = height / gridY;
				var widthHalf = width / 2;
				var heightHalf = height / 2;
				var depthHalf = depth / 2;
				var gridX1 = gridX + 1;
				var gridY1 = gridY + 1;
				var vertexCounter = 0;
				var groupCount = 0;
				var ix, iy;
				var vector = new Vector3(); // generate vertices, normals and uvs

				for (iy = 0; iy < gridY1; iy++) {
					var y = iy * segmentHeight - heightHalf;

					for (ix = 0; ix < gridX1; ix++) {
						var x = ix * segmentWidth - widthHalf; // set values to correct vector component

						vector[u] = x * udir;
						vector[v] = y * vdir;
						vector[w] = depthHalf; // now apply vector to vertex buffer

						vertices.push(vector.x, vector.y, vector.z); // set values to correct vector component

						vector[u] = 0;
						vector[v] = 0;
						vector[w] = depth > 0 ? 1 : -1; // now apply vector to normal buffer

						normals.push(vector.x, vector.y, vector.z); // uvs

						uvs.push(ix / gridX);
						uvs.push(1 - iy / gridY); // counters

						vertexCounter += 1;
					}
				} // indices
				// 1. you need three indices to draw a single face
				// 2. a single segment consists of two faces
				// 3. so we need to generate six (2*3) indices per segment


				for (iy = 0; iy < gridY; iy++) {
					for (ix = 0; ix < gridX; ix++) {
						var a = numberOfVertices + ix + gridX1 * iy;
						var b = numberOfVertices + ix + gridX1 * (iy + 1);
						var c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
						var d = numberOfVertices + (ix + 1) + gridX1 * iy; // faces

						indices.push(a, b, d);
						indices.push(b, c, d); // increase counter

						groupCount += 6;
					}
				} // add a group to the geometry. this will ensure multi material support


				scope.addGroup(groupStart, groupCount, materialIndex); // calculate new start value for groups

				groupStart += groupCount; // update total number of vertices

				numberOfVertices += vertexCounter;
			}

			this.computeBoundingBox();
			this.computeBoundingSphere();
		};

		return CubeGeometry;
	}(Geometry);

	/**
	 * A class for generating cylinder geometries.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Geometry
	 * @param {number} [radiusTop=1] — Radius of the cylinder at the top.
	 * @param {number} [radiusBottom=1] — Radius of the cylinder at the bottom.
	 * @param {number} [height=1] — Height of the cylinder.
	 * @param {Integer} [radialSegments=8] — Number of segmented faces around the circumference of the cylinder.
	 * @param {Integer} [heightSegments=1] — Number of rows of faces along the height of the cylinder.
	 * @param {number} [openEnded=false] — A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
	 * @param {number} [thetaStart=0] — Start angle for first segment, default = 0 (three o'clock position).
	 * @param {number} [thetaLength=2*Pi] — The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder.
	 */

	function CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
		Geometry.call(this);
		this.buildGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
	}

	CylinderGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {
		constructor: CylinderGeometry,
		buildGeometry: function buildGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
			var scope = this;
			radiusTop = radiusTop !== undefined ? radiusTop : 1;
			radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
			height = height || 1;
			radialSegments = Math.floor(radialSegments) || 8;
			heightSegments = Math.floor(heightSegments) || 1;
			openEnded = openEnded !== undefined ? openEnded : false;
			thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
			thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2; // buffers

			var indices = [];
			var vertices = [];
			var normals = [];
			var uvs = []; // helper variables

			var index = 0;
			var indexArray = [];
			var halfHeight = height / 2;
			var groupStart = 0; // generate geometry

			generateTorso();

			if (openEnded === false) {
				if (radiusTop > 0) generateCap(true);
				if (radiusBottom > 0) generateCap(false);
			} // build geometry


			this.setIndex(indices);
			this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
			this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
			this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

			function generateTorso() {
				var x, y;
				var normal = new Vector3();
				var vertex = new Vector3();
				var groupCount = 0; // this will be used to calculate the normal

				var slope = (radiusBottom - radiusTop) / height; // generate vertices, normals and uvs

				for (y = 0; y <= heightSegments; y++) {
					var indexRow = [];
					var v = y / heightSegments; // calculate the radius of the current row

					var radius = v * (radiusBottom - radiusTop) + radiusTop;

					for (x = 0; x <= radialSegments; x++) {
						var u = x / radialSegments;
						var theta = u * thetaLength + thetaStart;
						var sinTheta = Math.sin(theta);
						var cosTheta = Math.cos(theta); // vertex

						vertex.x = radius * sinTheta;
						vertex.y = -v * height + halfHeight;
						vertex.z = radius * cosTheta;
						vertices.push(vertex.x, vertex.y, vertex.z); // normal

						normal.set(sinTheta, slope, cosTheta).normalize();
						normals.push(normal.x, normal.y, normal.z); // uv

						uvs.push(u, 1 - v); // save index of vertex in respective row

						indexRow.push(index++);
					} // now save vertices of the row in our index array


					indexArray.push(indexRow);
				} // generate indices


				for (x = 0; x < radialSegments; x++) {
					for (y = 0; y < heightSegments; y++) {
						// we use the index array to access the correct indices
						var a = indexArray[y][x];
						var b = indexArray[y + 1][x];
						var c = indexArray[y + 1][x + 1];
						var d = indexArray[y][x + 1]; // faces

						indices.push(a, b, d);
						indices.push(b, c, d); // update group counter

						groupCount += 6;
					}
				} // add a group to the geometry. this will ensure multi material support


				scope.addGroup(groupStart, groupCount, 0); // calculate new start value for groups

				groupStart += groupCount;
			}

			function generateCap(top) {
				var x, centerIndexStart, centerIndexEnd;
				var uv = new Vector2();
				var vertex = new Vector3();
				var groupCount = 0;
				var radius = top === true ? radiusTop : radiusBottom;
				var sign = top === true ? 1 : -1; // save the index of the first center vertex

				centerIndexStart = index; // first we generate the center vertex data of the cap.
				// because the geometry needs one set of uvs per face,
				// we must generate a center vertex per face/segment

				for (x = 1; x <= radialSegments; x++) {
					// vertex
					vertices.push(0, halfHeight * sign, 0); // normal

					normals.push(0, sign, 0); // uv

					uvs.push(0.5, 0.5); // increase index

					index++;
				} // save the index of the last center vertex


				centerIndexEnd = index; // now we generate the surrounding vertices, normals and uvs

				for (x = 0; x <= radialSegments; x++) {
					var u = x / radialSegments;
					var theta = u * thetaLength + thetaStart;
					var cosTheta = Math.cos(theta);
					var sinTheta = Math.sin(theta); // vertex

					vertex.x = radius * sinTheta;
					vertex.y = halfHeight * sign;
					vertex.z = radius * cosTheta;
					vertices.push(vertex.x, vertex.y, vertex.z); // normal

					normals.push(0, sign, 0); // uv

					uv.x = cosTheta * 0.5 + 0.5;
					uv.y = sinTheta * 0.5 * sign + 0.5;
					uvs.push(uv.x, uv.y); // increase index

					index++;
				} // generate indices


				for (x = 0; x < radialSegments; x++) {
					var c = centerIndexStart + x;
					var i = centerIndexEnd + x;

					if (top === true) {
						// face top
						indices.push(i, i + 1, c);
					} else {
						// face bottom
						indices.push(i + 1, i, c);
					}

					groupCount += 3;
				} // add a group to the geometry. this will ensure multi material support


				scope.addGroup(groupStart, groupCount, top === true ? 1 : 2); // calculate new start value for groups

				groupStart += groupCount;
			}

			this.computeBoundingBox();
			this.computeBoundingSphere();
		}
	});

	/**
	 * An instanced version of {@link zen3d.BufferAttribute}.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.BufferAttribute
	 * @param {TypedArray} array - Used to instantiate the buffer.
	 * @param {Integer} size - the number of values of the array that should be associated with a particular vertex. For instance, if this attribute is storing a 3-component vector (such as a position, normal, or color), then itemSize should be 3.
	 * @param {boolean} [normalized=false] - Indicates how the underlying data in the buffer maps to the values in the GLSL code. For instance, if array is an instance of UInt16Array, and normalized is true, the values 0 - +65535 in the array data will be mapped to 0.0f - +1.0f in the GLSL attribute. An Int16Array (signed) would map from -32767 - +32767 to -1.0f - +1.0f. If normalized is false, the values will be converted to floats which contain the exact value, i.e. 32767 becomes 32767.0f.
	 * @param {Integer} [meshPerAttribute=1]
	 */

	function InstancedBufferAttribute(array, itemSize, normalized, meshPerAttribute) {
		BufferAttribute.call(this, array, itemSize, normalized);
		/**
				* @type {Integer}
				*/

		this.meshPerAttribute = meshPerAttribute || 1;
	}

	InstancedBufferAttribute.prototype = Object.assign(Object.create(BufferAttribute.prototype),
	/** @lends zen3d.InstancedBufferAttribute.prototype */
	{
		constructor: InstancedBufferAttribute,

		/**
				* @readonly
				* @type {boolean}
				* @default true
				*/
		isInstancedBufferAttribute: true,
		copy: function copy(source) {
			BufferAttribute.prototype.copy.call(this, source);
			this.meshPerAttribute = source.meshPerAttribute;
			return this;
		}
	});

	/**
	 * An instanced version of {@link zen3d.Geometry}.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Geometry
	 */

	function InstancedGeometry() {
		Geometry.call(this);
		/**
				* @type {Integer|undefined}
				*/

		this.maxInstancedCount = undefined;
	}

	InstancedGeometry.prototype = Object.assign(Object.create(Geometry.prototype),
	/** @lends zen3d.InstancedGeometry.prototype */
	{
		constructor: InstancedGeometry,

		/**
				* @readonly
				* @type {boolean}
				* @default true
				*/
		isInstancedGeometry: true
	});

	/**
	 * "Interleaved" means that multiple attributes, possibly of different types, (e.g., position, normal, uv, color) are packed into a single array buffer.
	 * An introduction into interleaved arrays can be found here: {@link https://blog.tojicode.com/2011/05/interleaved-array-basics.html Interleaved array basics}.
	 * @constructor
	 * @memberof zen3d
	 * @param {TypedArray} array -- A typed array with a shared buffer. Stores the geometry data.
	 * @param {Integer} stride -- The number of typed-array elements per vertex.
	 */
	function InterleavedBuffer(array, stride) {
		/**
				* A typed array with a shared buffer.
				* Stores the geometry data.
				* @type {TypedArray}
				*/
		this.array = array;
		/**
				* The number of typed-array elements per vertex.
				* @type {Integer}
				*/

		this.stride = stride;
		/**
				* Gives the total number of elements in the array.
				* @type {Integer}
				*/

		this.count = array !== undefined ? array.length / stride : 0;
		/**
				* @type {boolean}
				* @default false
				*/

		this.dynamic = false;
		/**
				* Object containing offset and count.
				* @type {Object}
				* @default { offset: 0, count: - 1 }
				*/

		this.updateRange = {
			offset: 0,
			count: -1
		};
		/**
				* A version number, incremented every time the data is changed.
				* @type {Integer}
				* @default 0
				*/

		this.version = 0;
	}

	Object.assign(InterleavedBuffer.prototype,
	/** @lends zen3d.InterleavedBuffer.prototype */
	{
		/**
				* @param {TypedArray} array
				*/
		setArray: function setArray(array) {
			this.count = array !== undefined ? array.length / this.stride : 0;
			this.array = array;
		}
	});

	/**
	 * An instanced version of {@link zen3d.InterleavedBuffer}.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.InterleavedBuffer
	 * @param {TypedArray} array -- A typed array with a shared buffer. Stores the geometry data.
	 * @param {Integer} stride -- The number of typed-array elements per vertex.
	 * @param {Integer} [meshPerAttribute=1]
	 */

	function InstancedInterleavedBuffer(array, itemSize, meshPerAttribute) {
		InterleavedBuffer.call(this, array, itemSize);
		/**
				* @type {Integer}
				*/

		this.meshPerAttribute = meshPerAttribute || 1;
	}

	InstancedInterleavedBuffer.prototype = Object.assign(Object.create(InterleavedBuffer.prototype),
	/** @lends zen3d.InstancedInterleavedBuffer.prototype */
	{
		constructor: InstancedInterleavedBuffer,

		/**
				* @readonly
				* @type {boolean}
				* @default true
				*/
		isInstancedInterleavedBuffer: true
	});

	/**
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.InterleavedBuffer} interleavedBuffer
	 * @param {Integer} size
	 * @param {Integer} offset
	 * @param {boolean} [normalized=false]
	 */
	function InterleavedBufferAttribute(interleavedBuffer, size, offset, normalized) {
		/**
				* The InterleavedBuffer instance passed in the constructor.
				* @type {zen3d.InterleavedBuffer}
				*/
		this.data = interleavedBuffer;
		/**
				* How many values make up each item.
				* @type {Integer}
				*/

		this.size = size;
		/**
				* The offset in the underlying array buffer where an item starts.
				* @type {Integer}
				*/

		this.offset = offset;
		/**
				* @type {boolean}
				* @default false
				*/

		this.normalized = normalized === true;
	}
	/**
	 * @readonly
	 * @type {boolean}
	 * @default true
	 */


	InterleavedBufferAttribute.prototype.isInterleavedBufferAttribute = true;
	Object.defineProperties(InterleavedBufferAttribute.prototype, {
		/**
				* The value of data.count.
				* If the buffer is storing a 3-component item (such as a position, normal, or color), then this will count the number of such items stored.
				* @memberof zen3d.InterleavedBufferAttribute#
				* @readonly
				* @type {Integer}
				*/
		count: {
			get: function get() {
				return this.data.count;
			}
		},

		/**
				* The value of data.array.
				* @memberof zen3d.InterleavedBufferAttribute#
				* @readonly
				* @type {TypedArray}
				*/
		array: {
			get: function get() {
				return this.data.array;
			}
		}
	});

	/**
	 * A class for generating plane geometries.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Geometry
	 * @param {number} [width=1] — Width along the X axis.
	 * @param {number} [height=1] — Height along the Y axis.
	 * @param {Integer} [widthSegments=1] — Optional.
	 * @param {Integer} [heightSegments=1] — Optional.
	 */

	function PlaneGeometry(width, height, widthSegments, heightSegments) {
		Geometry.call(this);
		this.buildGeometry(width, height, widthSegments, heightSegments);
	}

	PlaneGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {
		constructor: PlaneGeometry,
		buildGeometry: function buildGeometry(width, height, widthSegments, heightSegments) {
			width = width || 1;
			height = height || 1;
			var width_half = width / 2;
			var height_half = height / 2;
			var gridX = Math.floor(widthSegments) || 1;
			var gridY = Math.floor(heightSegments) || 1;
			var gridX1 = gridX + 1;
			var gridY1 = gridY + 1;
			var segment_width = width / gridX;
			var segment_height = height / gridY;
			var ix, iy; // buffers

			var indices = [];
			var vertices = [];
			var normals = [];
			var uvs = []; // generate vertices, normals and uvs

			for (iy = 0; iy < gridY1; iy++) {
				var y = iy * segment_height - height_half;

				for (ix = 0; ix < gridX1; ix++) {
					var x = ix * segment_width - width_half;
					vertices.push(x, 0, y);
					normals.push(0, 1, 0);
					uvs.push(ix / gridX);
					uvs.push(1 - iy / gridY);
				}
			} // indices


			for (iy = 0; iy < gridY; iy++) {
				for (ix = 0; ix < gridX; ix++) {
					var a = ix + gridX1 * iy;
					var b = ix + gridX1 * (iy + 1);
					var c = ix + 1 + gridX1 * (iy + 1);
					var d = ix + 1 + gridX1 * iy; // faces

					indices.push(a, b, d);
					indices.push(b, c, d);
				}
			} // build geometry


			this.setIndex(indices);
			this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
			this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
			this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));
			this.computeBoundingBox();
			this.computeBoundingSphere();
		}
	});

	/**
	 * A class for generating sphere geometries.
	 * The geometry is created by sweeping and calculating vertexes around the Y axis (horizontal sweep) and the Z axis (vertical sweep).
	 * Thus, incomplete spheres (akin to 'sphere slices') can be created through the use of different values of phiStart, phiLength, thetaStart and thetaLength, in order to define the points in which we start (or end) calculating those vertices.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Geometry
	 * @param {number} [radius=1] — sphere radius. Default is 1.
	 * @param {Integer} [widthSegments=8] — number of horizontal segments. Minimum value is 3, and the default is 8.
	 * @param {Integer} [heightSegments=6] — number of vertical segments. Minimum value is 2, and the default is 6.
	 * @param {number} [phiStart=0] — specify horizontal starting angle. Default is 0.
	 * @param {number} [phiLength=Math.PI*2] — specify horizontal sweep angle size. Default is Math.PI * 2.
	 * @param {number} [thetaStart=0] — specify vertical starting angle. Default is 0.
	 * @param {number} [thetaLength=Math.PI] — specify vertical sweep angle size. Default is Math.PI.
	 */

	function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
		Geometry.call(this);
		this.buildGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
	}

	SphereGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {
		constructor: SphereGeometry,
		buildGeometry: function buildGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
			radius = radius || 1;
			widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
			heightSegments = Math.max(2, Math.floor(heightSegments) || 6);
			phiStart = phiStart !== undefined ? phiStart : 0;
			phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;
			thetaStart = thetaStart !== undefined ? thetaStart : 0;
			thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;
			var thetaEnd = thetaStart + thetaLength;
			var ix, iy;
			var index = 0;
			var grid = [];
			var vertex = new Vector3();
			var normal = new Vector3(); // buffers

			var indices = [];
			var vertices = [];
			var normals = [];
			var uvs = []; // generate vertices, normals and uvs

			for (iy = 0; iy <= heightSegments; iy++) {
				var verticesRow = [];
				var v = iy / heightSegments;

				for (ix = 0; ix <= widthSegments; ix++) {
					var u = ix / widthSegments; // vertex

					vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
					vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
					vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
					vertices.push(vertex.x, vertex.y, vertex.z); // normal

					normal.set(vertex.x, vertex.y, vertex.z).normalize();
					normals.push(normal.x, normal.y, normal.z); // uv

					uvs.push(u, 1 - v);
					verticesRow.push(index++);
				}

				grid.push(verticesRow);
			} // indices


			for (iy = 0; iy < heightSegments; iy++) {
				for (ix = 0; ix < widthSegments; ix++) {
					var a = grid[iy][ix + 1];
					var b = grid[iy][ix];
					var c = grid[iy + 1][ix];
					var d = grid[iy + 1][ix + 1];
					if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
					if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
				}
			}

			this.setIndex(indices);
			this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
			this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
			this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));
			this.computeBoundingBox();
			this.computeBoundingSphere();
		}
	});

	/**
	 * Creates a torus knot, the particular shape of which is defined by a pair of coprime integers, p and q.
	 * If p and q are not coprime, the result will be a torus link.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Geometry
	 * @param {number} [radius=1] — Radius of the torus. Default is 1.
	 * @param {number} [tube=0.4] — Radius of the tube. Default is 0.4.
	 * @param {Integer} [tubularSegments=64] — Default is 64.
	 * @param {Integer} [radialSegments=8] — Default is 8.
	 * @param {Integer} [p=2] — This value determines, how many times the geometry winds around its axis of rotational symmetry. Default is 2.
	 * @param {Integer} [q=3] — This value determines, how many times the geometry winds around a circle in the interior of the torus. Default is 3.
	 */

	function TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q) {
		Geometry.call(this); // this.type = 'TorusKnotGeometry';

		this.parameters = {
			radius: radius,
			tube: tube,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			p: p,
			q: q
		};
		radius = radius || 1;
		tube = tube || 0.4;
		tubularSegments = Math.floor(tubularSegments) || 64;
		radialSegments = Math.floor(radialSegments) || 8;
		p = p || 2;
		q = q || 3; // buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = []; // helper variables

		var i, j;
		var vertex = new Vector3();
		var normal = new Vector3();
		var P1 = new Vector3();
		var P2 = new Vector3();
		var B = new Vector3();
		var T = new Vector3();
		var N = new Vector3(); // generate vertices, normals and uvs

		for (i = 0; i <= tubularSegments; ++i) {
			// the radian "u" is used to calculate the position on the torus curve of the current tubular segement
			var u = i / tubularSegments * p * Math.PI * 2; // now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
			// these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions

			calculatePositionOnCurve(u, p, q, radius, P1);
			calculatePositionOnCurve(u + 0.01, p, q, radius, P2); // calculate orthonormal basis

			T.subVectors(P2, P1);
			N.addVectors(P2, P1);
			B.crossVectors(T, N);
			N.crossVectors(B, T); // normalize B, N. T can be ignored, we don't use it

			B.normalize();
			N.normalize();

			for (j = 0; j <= radialSegments; ++j) {
				// now calculate the vertices. they are nothing more than an extrusion of the torus curve.
				// because we extrude a shape in the xy-plane, there is no need to calculate a z-value.
				var v = j / radialSegments * Math.PI * 2;
				var cx = -tube * Math.cos(v);
				var cy = tube * Math.sin(v); // now calculate the final vertex position.
				// first we orient the extrusion with our basis vectos, then we add it to the current position on the curve

				vertex.x = P1.x + (cx * N.x + cy * B.x);
				vertex.y = P1.y + (cx * N.y + cy * B.y);
				vertex.z = P1.z + (cx * N.z + cy * B.z);
				vertices.push(vertex.x, vertex.y, vertex.z); // normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)

				normal.subVectors(vertex, P1).normalize();
				normals.push(normal.x, normal.y, normal.z); // uv

				uvs.push(i / tubularSegments);
				uvs.push(j / radialSegments);
			}
		} // generate indices


		for (j = 1; j <= tubularSegments; j++) {
			for (i = 1; i <= radialSegments; i++) {
				// indices
				var a = (radialSegments + 1) * (j - 1) + (i - 1);
				var b = (radialSegments + 1) * j + (i - 1);
				var c = (radialSegments + 1) * j + i;
				var d = (radialSegments + 1) * (j - 1) + i; // faces

				indices.push(a, b, d);
				indices.push(b, c, d);
			}
		} // build geometry


		this.setIndex(indices);
		this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
		this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
		this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));
		this.computeBoundingBox();
		this.computeBoundingSphere(); // this function calculates the current position on the torus curve

		function calculatePositionOnCurve(u, p, q, radius, position) {
			var cu = Math.cos(u);
			var su = Math.sin(u);
			var quOverP = q / p * u;
			var cs = Math.cos(quOverP);
			position.x = radius * (2 + cs) * 0.5 * cu;
			position.y = radius * (2 + cs) * su * 0.5;
			position.z = radius * Math.sin(quOverP) * 0.5;
		}
	}

	TorusKnotGeometry.prototype = Object.create(Geometry.prototype);
	TorusKnotGeometry.prototype.constructor = TorusKnotGeometry;

	var materialId = 0;
	/**
	 * Abstract base class for materials.
	 * Materials describe the appearance of {@link zen3d.Object3D}.
	 * They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer.
	 * The following properties and methods are inherited by all other material types (although they may have different defaults).
	 * @constructor
	 * @abstract
	 * @memberof zen3d
	 */

	function Material() {
		EventDispatcher.call(this);
		Object.defineProperty(this, 'id', {
			value: materialId++
		}); // material type

		this.type = "";
		/**
				* UUID of this material instance.
				* This gets automatically assigned, so this shouldn't be edited.
				* @type {string}
				*/

		this.uuid = generateUUID();
		/**
				 * Override the renderer's default precision for this material.
				 * Can be "highp", "mediump" or "lowp".
				 * @type {string}
				 * @default null
				 */

		this.precision = null;
		/**
				* Float in the range of 0.0 - 1.0 indicating how transparent the material is.
				* A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
				* @type {number}
				* @default 1
				*/

		this.opacity = 1;
		/**
				* Defines whether this material is transparent.
				* This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
				* When set to true, the extent to which the material is transparent is controlled by setting it's blending property.
				* @type {boolean}
				* @default false
				*/

		this.transparent = false;
		/**
				* Which blending to use when displaying objects with this material.
				* This must be set to zen3d.BLEND_TYPE.CUSTOM to use custom blendSrc, blendDst or blendEquation.
				* @type {zen3d.BLEND_TYPE}
				* @default zen3d.BLEND_TYPE.NORMAL
				*/

		this.blending = BLEND_TYPE.NORMAL;
		/**
				* Blending source.
				* The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
				* @type {zen3d.BLEND_FACTOR}
				* @default zen3d.BLEND_FACTOR.SRC_ALPHA
				*/

		this.blendSrc = BLEND_FACTOR.SRC_ALPHA;
		/**
				* Blending destination.
				* The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
				* @type {zen3d.BLEND_FACTOR}
				* @default zen3d.BLEND_FACTOR.ONE_MINUS_SRC_ALPHA
				*/

		this.blendDst = BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
		/**
				* Blending equation to use when applying blending.
				* The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
				* @type {zen3d.BLEND_EQUATION}
				* @default zen3d.BLEND_EQUATION.ADD
				*/

		this.blendEquation = BLEND_EQUATION.ADD;
		/**
				* The transparency of the {@link zen3d.Material#blendSrc}.
				* The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
				* @type {zen3d.BLEND_FACTOR}
				* @default null
				*/

		this.blendSrcAlpha = null;
		/**
				* The transparency of the {@link zen3d.Material#blendDst}.
				* The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
				* @type {zen3d.BLEND_FACTOR}
				* @default null
				*/

		this.blendDstAlpha = null;
		/**
				* The tranparency of the {@link zen3d.Material#blendEquation}.
				* The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
				* @type {zen3d.BLEND_EQUATION}
				* @default null
				*/

		this.blendEquationAlpha = null;
		/**
				* Whether to premultiply the alpha (transparency) value.
				* @type {boolean}
				* @default false
				*/

		this.premultipliedAlpha = false;
		/**
				* Defines whether vertex coloring is used.
				* @type {zen3d.VERTEX_COLOR}
				* @default zen3d.VERTEX_COLOR.NONE
				*/

		this.vertexColors = VERTEX_COLOR.NONE;
		/**
				* Defines whether precomputed vertex tangents, which must be provided in a vec4 "tangent" attribute, are used.
				* When disabled, tangents are derived automatically.
				* Using precomputed tangents will give more accurate normal map details in some cases, such as with mirrored UVs.
				* @type {boolean}
				* @default false
				*/

		this.vertexTangents = false;
		/**
				* The diffuse color.
				* @type {zen3d.Color3}
				* @default zen3d.Color3(0xffffff)
				*/

		this.diffuse = new Color3(0xffffff);
		/**
				* The diffuse map.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.diffuseMap = null;
		/**
				* Define the UV chanel for the diffuse map to use starting from 0 and defaulting to 0.
				* @type {number}
				* @default 0
				*/

		this.diffuseMapCoord = 0;
		/**
				* The normal map.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.normalMap = null;
		/**
				* The alpha map.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.alphaMap = null;
		/**
				* Define the UV chanel for the alpha map to use starting from 0 and defaulting to 0.
				* @type {number}
				* @default 0
				*/

		this.alphaMapCoord = 0;
		/**
				* The red channel of this texture is used as the ambient occlusion map.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.aoMap = null;
		/**
				* Intensity of the ambient occlusion effect.
				* @type {number}
				* @default 1
				*/

		this.aoMapIntensity = 1.0;
		/**
				* Define the UV chanel for the ao map to use starting from 0 and defaulting to 0.
				* @type {number}
				* @default 0
				*/

		this.aoMapCoord = 0;
		/**
				* The texture to create a bump map.
				* The black and white values map to the perceived depth in relation to the lights. Bump doesn't actually affect the geometry of the object, only the lighting.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.bumpMap = null;
		/**
				* How much the bump map affects the material.
				* Typical ranges are 0-1.
				* @type {number}
				* @default 1
				*/

		this.bumpScale = 1;
		/**
				* The environment map.
				* @type {zen3d.TextureCube}
				* @default null
				*/

		this.envMap = null;
		/**
				* Scales the effect of the environment map by multiplying its color.
				* @type {number}
				* @default 1
				*/

		this.envMapIntensity = 1;
		/**
				* How to combine the result of the surface's color with the environment map, if any.
				* This has no effect in a {@link zen3d.PBRMaterial}.
				* @type {zen3d.ENVMAP_COMBINE_TYPE}
				* @default zen3d.ENVMAP_COMBINE_TYPE.MULTIPLY
				*/

		this.envMapCombine = ENVMAP_COMBINE_TYPE.MULTIPLY;
		/**
				* Emissive (light) color of the material, essentially a solid color unaffected by other lighting.
				* @type {zen3d.Color3}
				* @default zen3d.Color3(0x000000)
				*/

		this.emissive = new Color3(0x000000);
		/**
				* Set emissive (glow) map.
				* The emissive map color is modulated by the emissive color and the emissive intensity.
				* If you have an emissive map, be sure to set the emissive color to something other than black.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.emissiveMap = null;
		/**
				* Define the UV chanel for the emissive map to use starting from 0 and defaulting to 0.
				* @type {number}
				* @default 0
				*/

		this.emissiveMapCoord = 0;
		/**
				* Intensity of the emissive light.
				* Modulates the emissive color.
				* @type {number}
				* @default 1
				*/

		this.emissiveIntensity = 1;
		/**
				 * Which depth function to use. See the {@link zen3d.WEBGL_COMPARE_FUNC} constants for all possible values.
				 * @type {zen3d.WEBGL_COMPARE_FUNC}
				 * @default zen3d.WEBGL_COMPARE_FUNC.LEQUAL
				 */

		this.depthFunc = WEBGL_COMPARE_FUNC.LEQUAL;
		/**
				* Whether to have depth test enabled when rendering this material.
				* @type {boolean}
				* @default true
				*/

		this.depthTest = true;
		/**
				* Whether rendering this material has any effect on the depth buffer.
				* When drawing 2D overlays it can be useful to disable the depth writing in order to layer several things together without creating z-index artifacts.
				* @type {boolean}
				* @default true
				*/

		this.depthWrite = true;
		/**
				* Whether to render the material's color.
				* This can be used in conjunction with a mesh's renderOrder property to create invisible objects that occlude other objects.
				* @type {boolean}
				* @default true
				*/

		this.colorWrite = true;
		/**
				* Whether stencil operations are performed against the stencil buffer.
				* In order to perform writes or comparisons against the stencil buffer this value must be true.
				* @type {boolean}
				* @default false
				*/

		this.stencilTest = false;
		/**
				* The bit mask to use when writing to the stencil buffer.
				* @type {number}
				* @default 0xFF
				*/

		this.stencilWriteMask = 0xff;
		/**
				* The stencil comparison function to use.
				* See the {@link zen3d.WEBGL_COMPARE_FUNC} constants for all possible values.
				* @type {zen3d.WEBGL_COMPARE_FUNC}
				* @default zen3d.WEBGL_COMPARE_FUNC.ALWAYS
				*/

		this.stencilFunc = WEBGL_COMPARE_FUNC.ALWAYS;
		/**
				* The value to use when performing stencil comparisons or stencil operations.
				* @type {number}
				* @default 0
				*/

		this.stencilRef = 0;
		/**
				* The bit mask to use when comparing against the stencil buffer.
				* @type {number}
				* @default 0xFF
				*/

		this.stencilFuncMask = 0xff;
		/**
				* Which stencil operation to perform when the comparison function returns false.
				* See the {@link zen3d.WEBGL_OP} constants for all possible values.
				* @type {zen3d.WEBGL_OP}
				* @default zen3d.WEBGL_OP.KEEP
				*/

		this.stencilFail = WEBGL_OP.KEEP;
		/**
				* Which stencil operation to perform when the comparison function returns true but the depth test fails.
				* See the {@link zen3d.WEBGL_OP} constants for all possible values.
				* @type {zen3d.WEBGL_OP}
				* @default zen3d.WEBGL_OP.KEEP
				*/

		this.stencilZFail = WEBGL_OP.KEEP;
		/**
				* Which stencil operation to perform when the comparison function returns true and the depth test passes.
				* See the {@link zen3d.WEBGL_OP} constants for all possible values.
				* @type {zen3d.WEBGL_OP}
				* @default zen3d.WEBGL_OP.KEEP
				*/

		this.stencilZPass = WEBGL_OP.KEEP;
		/**
				* The stencil comparison function to use.
				* See the {@link zen3d.WEBGL_COMPARE_FUNC} constants for all possible values.
				* You can explicitly specify the two-sided stencil function state by defining stencilFuncBack, stencilRefBack and stencilFuncMaskBack.
				* @type {zen3d.WEBGL_COMPARE_FUNC|null}
				* @default null
				*/

		this.stencilFuncBack = null;
		/**
				* The value to use when performing stencil comparisons or stencil operations.
				* You can explicitly specify the two-sided stencil function state by defining stencilFuncBack, stencilRefBack and stencilFuncMaskBack.
				* @type {number|null}
				* @default null
				*/

		this.stencilRefBack = null;
		/**
				* The bit mask to use when comparing against the stencil buffer.
				* You can explicitly specify the two-sided stencil function state by defining stencilFuncBack, stencilRefBack and stencilFuncMaskBack.
				* @type {number|null}
				* @default null
				*/

		this.stencilFuncMaskBack = null;
		/**
				* Which stencil operation to perform when the comparison function returns false.
				* See the {@link zen3d.WEBGL_OP} constants for all possible values.
				* You can explicitly specify the two-sided stencil op state by defining stencilFailBack, stencilZFailBack and stencilZPassBack.
				* @type {zen3d.WEBGL_OP|null}
				* @default null
				*/

		this.stencilFailBack = null;
		/**
				* Which stencil operation to perform when the comparison function returns true but the depth test fails.
				* See the {@link zen3d.WEBGL_OP} constants for all possible values.
				* You can explicitly specify the two-sided stencil op state by defining stencilFailBack, stencilZFailBack and stencilZPassBack.
				* @type {zen3d.WEBGL_OP|null}
				* @default null
				*/

		this.stencilZFailBack = null;
		/**
				* Which stencil operation to perform when the comparison function returns true and the depth test passes.
				* See the {@link zen3d.WEBGL_OP} constants for all possible values.
				* You can explicitly specify the two-sided stencil op state by defining stencilFailBack, stencilZFailBack and stencilZPassBack.
				* @type {zen3d.WEBGL_OP|null}
				* @default null
				*/

		this.stencilZPassBack = null;
		/**
				* Sets the alpha value to be used when running an alpha test.
				* The material will not be renderered if the opacity is lower than this value.
				* @type {number}
				* @default 0
				*/

		this.alphaTest = 0;
		/**
				* Defines which side of faces will be rendered - front, back or double.
				* @type {zen3d.DRAW_SIDE}
				* @default zen3d.DRAW_SIDE.FRONT
				*/

		this.side = DRAW_SIDE.FRONT;
		/**
				* Whether to use polygon offset.
				* This corresponds to the GL_POLYGON_OFFSET_FILL WebGL feature.
				* @type {boolean}
				* @default false
				*/

		this.polygonOffset = false;
		/**
				* Sets the polygon offset factor.
				* @type {number}
				* @default 0
				*/

		this.polygonOffsetFactor = 0;
		/**
				* Sets the polygon offset units.
				* @type {number}
				* @default 0
				*/

		this.polygonOffsetUnits = 0;
		/**
				* Define whether the material is rendered with flat shading or smooth shading.
				* @type {zen3d.SHADING_TYPE}
				* @default zen3d.SHADING_TYPE.SMOOTH_SHADING
				*/

		this.shading = SHADING_TYPE.SMOOTH_SHADING;
		/**
				 * Whether to apply dithering to the color to remove the appearance of banding.
				 * @type {boolean}
				 * @default false
				 */

		this.dithering = false;
		/**
				* Whether the material is affected by lights.
				* If set true, renderer will try to upload light uniforms.
				* @type {boolean}
				* @default false
				*/

		this.acceptLight = false;
		/**
				* Determines how the mesh triangles are constructed from the vertices.
				* @type {zen3d.DRAW_MODE}
				* @default zen3d.DRAW_MODE.TRIANGLES
				*/

		this.drawMode = DRAW_MODE.TRIANGLES;
		/**
				* Specifies that the material needs to be recompiled.
				* This property is automatically set to true when instancing a new material.
				* @type {boolean}
				* @default true
				*/

		this.needsUpdate = true;
	}

	Material.prototype = Object.assign(Object.create(EventDispatcher.prototype),
	/** @lends zen3d.Material.prototype */
	{
		constructor: Material,

		/**
				* Copy the parameters from the passed material into this material.
				* @param {zen3d.Material} source - The material to be copied.
				* @return {zen3d.Material}
				*/
		copy: function copy(source) {
			this.type = source.type;
			this.precision = source.precision;

			if (source.defines) {
				this.defines = Object.assign({}, source.defines);
			}

			this.opacity = source.opacity;
			this.transparent = source.transparent;
			this.premultipliedAlpha = source.premultipliedAlpha;
			this.vertexColors = source.vertexColors;
			this.diffuse.copy(source.diffuse);
			this.diffuseMap = source.diffuseMap;
			this.diffuseMapCoord = source.diffuseMapCoord;
			this.alphaMap = source.alphaMap;
			this.alphaMapCoord = source.alphaMapCoord;
			this.normalMap = source.normalMap;
			this.aoMap = source.aoMap;
			this.aoMapIntensity = source.aoMapIntensity;
			this.aoMapCoord = source.aoMapCoord;
			this.bumpMap = source.bumpMap;
			this.bumpScale = source.bumpScale;
			this.envMap = source.envMap;
			this.envMapIntensity = source.envMapIntensity;
			this.envMapCombine = source.envMapCombine;
			this.emissive.copy(source.emissive);
			this.emissiveMap = source.emissiveMap;
			this.emissiveMapCoord = source.emissiveMapCoord;
			this.emissiveIntensity = source.emissiveIntensity;
			this.blending = source.blending;
			this.depthFunc = source.depthFunc;
			this.depthTest = source.depthTest;
			this.depthWrite = source.depthWrite;
			this.colorWrite = source.colorWrite;
			this.alphaTest = source.alphaTest;
			this.side = source.side;
			this.polygonOffset = source.polygonOffset;
			this.polygonOffsetFactor = source.polygonOffsetFactor;
			this.polygonOffsetUnits = source.polygonOffsetUnits;
			this.dithering = source.dithering;
			this.shading = source.shading;
			this.acceptLight = source.acceptLight;
			this.drawMode = source.drawMode;
			return this;
		},

		/**
				* Return a new material with the same parameters as this material.
				* @return {zen3d.Material}
				*/
		clone: function clone() {
			return new this.constructor().copy(this);
		},

		/**
				* This disposes the material.
				* Textures of a material don't get disposed. These needs to be disposed by Texture.
				*/
		dispose: function dispose() {
			this.dispatchEvent({
				type: 'dispose'
			});
		}
	});

	/**
	 * A material for drawing geometries in a simple shaded (flat or wireframe) way.
	 * This material is not affected by lights.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function BasicMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.BASIC;
	}

	BasicMaterial.prototype = Object.create(Material.prototype);
	BasicMaterial.prototype.constructor = BasicMaterial;

	/**
	 * A material for non-shiny surfaces, without specular highlights.
	 * The material uses a non-physically based Lambertian model for calculating reflectance.
	 * This can simulate some surfaces (such as untreated wood or stone) well, but cannot simulate shiny surfaces with specular highlights (such as varnished wood).
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function LambertMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.LAMBERT;
		/**
				* Lambert material is affected by lights.
				* @type {boolean}
				* @default true
				*/

		this.acceptLight = true;
	}

	LambertMaterial.prototype = Object.create(Material.prototype);
	LambertMaterial.prototype.constructor = LambertMaterial;

	/**
	 * A material for shiny surfaces with specular highlights.
	 * The material uses a non-physically based Blinn-Phong model for calculating reflectance.
	 * Unlike the Lambertian model used in the {@link zen3d.LambertMaterial} this can simulate shiny surfaces with specular highlights (such as varnished wood).
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function PhongMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.PHONG;
		/**
				* How shiny the {@link zen3d.PhongMaterial#specular} highlight is; a higher value gives a sharper highlight.
				* @type {number}
				* @default 30
				*/

		this.shininess = 30;
		/**
				* Specular color of the material.
				* This defines how shiny the material is and the color of its shine.
				* @type {zen3d.Color3}
				* @default zen3d.Color(0x111111)
				*/

		this.specular = new Color3(0x111111);
		/**
				* The specular map value affects both how much the specular surface highlight contributes and how much of the environment map affects the surface.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.specularMap = null;
		/**
				* Phong material is affected by lights.
				* @type {boolean}
				* @default true
				*/

		this.acceptLight = true;
	}

	PhongMaterial.prototype = Object.assign(Object.create(Material.prototype),
	/** @lends zen3d.PhongMaterial.prototype */
	{
		constructor: PhongMaterial,
		copy: function copy(source) {
			Material.prototype.copy.call(this, source);
			this.shininess = source.shininess;
			this.specular.copy(source.specular);
			this.specularMap = source.specularMap;
			return this;
		}
	});

	/**
	 * A standard physically based material, using Metallic-Roughness workflow.
	 * Physically based rendering (PBR) has recently become the standard in many 3D applications, such as Unity, Unreal and 3D Studio Max.
	 * This approach differs from older approaches in that instead of using approximations for the way in which light interacts with a surface, a physically correct model is used.
	 * The idea is that, instead of tweaking materials to look good under specific lighting, a material can	be created that will react 'correctly' under all lighting scenarios.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function PBRMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.PBR;
		/**
				* How rough the material appears. 0.0 means a smooth mirror reflection, 1.0 means fully diffuse.
				* If roughnessMap is also provided, both values are multiplied.
				* @type {number}
				* @default 0.5
				*/

		this.roughness = 0.5;
		/**
				* How much the material is like a metal.
				* Non-metallic materials such as wood or stone use 0.0, metallic use 1.0, with nothing (usually) in between.
				* A value between 0.0 and 1.0 could be used for a rusty metal look. If metalnessMap is also provided, both values are multiplied.
				* @type {number}
				* @default 0.5
				*/

		this.metalness = 0.5;
		/**
				* The green channel of this texture is used to alter the roughness of the material.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.roughnessMap = null;
		/**
				* The blue channel of this texture is used to alter the metalness of the material.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.metalnessMap = null;
		/**
				* PBR material is affected by lights.
				* @type {boolean}
				* @default true
				*/

		this.acceptLight = true;
	}

	PBRMaterial.prototype = Object.assign(Object.create(Material.prototype),
	/** @lends zen3d.PBRMaterial.prototype */
	{
		constructor: PBRMaterial,
		copy: function copy(source) {
			Material.prototype.copy.call(this, source);
			this.roughness = source.roughness;
			this.metalness = source.metalness;
			this.roughnessMap = source.roughnessMap;
			this.metalnessMap = source.metalnessMap;
			return this;
		}
	});

	/**
	 * A standard physically based material, using Specular-Glossiness workflow.
	 * Physically based rendering (PBR) has recently become the standard in many 3D applications, such as Unity, Unreal and 3D Studio Max.
	 * This approach differs from older approaches in that instead of using approximations for the way in which light interacts with a surface, a physically correct model is used.
	 * The idea is that, instead of tweaking materials to look good under specific lighting, a material can	be created that will react 'correctly' under all lighting scenarios.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function PBR2Material() {
		Material.call(this);
		this.type = MATERIAL_TYPE.PBR2;
		/**
				* Specular color of the material.
				* @type {number}
				* @default 0.5
				*/

		this.specular = new Color3(0x111111);
		/**
				* Glossiness of the material.
				* @type {number}
				* @default 0.5
				*/

		this.glossiness = 0.5;
		/**
				* The RGB channel of this texture is used to alter the specular of the material.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.specularMap = null;
		/**
				* The A channel of this texture is used to alter the glossiness of the material.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.glossinessMap = null;
		/**
				* PBR2 material is affected by lights.
				* @type {boolean}
				* @default true
				*/

		this.acceptLight = true;
	}

	PBR2Material.prototype = Object.assign(Object.create(Material.prototype),
	/** @lends zen3d.PBR2Material.prototype */
	{
		constructor: PBR2Material,
		copy: function copy(source) {
			Material.prototype.copy.call(this, source);
			this.specular = source.specular;
			this.glossiness = source.glossiness;
			this.specularMap = source.specularMap;
			this.glossinessMap = source.glossinessMap;
			return this;
		}
	});

	/**
	 * MatcapMaterial is defined by a MatCap (or Lit Sphere) texture, which encodes the material color and shading.
	 * MatcapMaterial does not respond to lights since the matcap image file encodes baked lighting.
	 * It will cast a shadow onto an object that receives shadows (and shadow clipping works), but it will not self-shadow or receive shadows.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function MatcapMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.MATCAP;
		/**
				* The matcap map.
				* @type {zen3d.Texture2D}
				* @default null
				*/

		this.matcap = null;
	}

	MatcapMaterial.prototype = Object.assign(Object.create(Material.prototype),
	/** @lends zen3d.MatcapMaterial.prototype */
	{
		constructor: MatcapMaterial,
		copy: function copy(source) {
			Material.prototype.copy.call(this, source);
			this.matcap = source.matcap;
			return this;
		}
	});

	/**
	 * The default material used by Points.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function PointsMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.POINT;
		/**
				* Sets the size of the points.
				* @type {number}
				* @default 1
				*/

		this.size = 1;
		/**
				* Specify whether points' size is attenuated by the camera depth. (Perspective camera only.)
				* @type {boolean}
				* @default true
				*/

		this.sizeAttenuation = true;
		/**
				* Set draw mode to POINTS.
				* @type {zen3d.DRAW_MODE}
				* @default zen3d.DRAW_MODE.POINTS
				*/

		this.drawMode = DRAW_MODE.POINTS;
	}

	PointsMaterial.prototype = Object.assign(Object.create(Material.prototype),
	/** @lends zen3d.PointsMaterial.prototype */
	{
		constructor: PointsMaterial,
		copy: function copy(source) {
			Material.prototype.copy.call(this, source);
			this.size = source.size;
			this.sizeAttenuation = source.sizeAttenuation;
			return this;
		}
	});

	/**
	 * A material for drawing wireframe-style geometries.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function LineMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.LINE;
		/**
				* Controls line thickness.
				* Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always be 1 regardless of the set value.
				* @type {number}
				* @default 1
				*/

		this.lineWidth = 1;
		/**
				* Set draw mode to LINES / LINE_LOOP / LINE_STRIP
				* @type {zen3d.DRAW_MODE}
				* @default zen3d.DRAW_MODE.LINES
				*/

		this.drawMode = DRAW_MODE.LINES;
	}

	LineMaterial.prototype = Object.assign(Object.create(Material.prototype),
	/** @lends zen3d.LineMaterial.prototype */
	{
		constructor: LineMaterial,
		copy: function copy(source) {
			Material.prototype.copy.call(this, source);
			this.lineWidth = source.lineWidth;
			return this;
		}
	});

	/**
	 * A material rendered with custom shaders.
	 * A shader is a small program written in GLSL that runs on the GPU.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 * @param {Object} shader - Shader object for the shader material.
	 * @param {string} shader.vertexShader -	Vertex shader GLSL code.
	 * @param {string} shader.fragmentShader - Fragment shader GLSL code.
	 * @param {Object} [shader.defines={}] - Defines of the shader.
	 * @param {Object} [shader.uniforms={}] - Uniforms of the shader.
	 */

	function ShaderMaterial(shader) {
		Material.call(this);
		this.type = MATERIAL_TYPE.SHADER;
		/**
				* Vertex shader GLSL code. This is the actual code for the shader.
				* @type {number}
				* @default ""
				*/

		this.vertexShader = "";
		/**
				* Fragment shader GLSL code. This is the actual code for the shader.
				* @type {number}
				* @default ""
				*/

		this.fragmentShader = "";
		/**
				* Defines of the shader
				* @type {Object}
				* @default {}
				*/

		this.defines = {};
		/**
				* Uniforms of the shader.
				* Uniforms should match with fragment shader
				* @type {Object}
				* @default {}
				*/

		this.uniforms = {}; // Set values

		if (shader) {
			this.vertexShader = shader.vertexShader;
			this.fragmentShader = shader.fragmentShader;
			Object.assign(this.defines, shader.defines);
			this.uniforms = cloneUniforms(shader.uniforms);
		}
	}

	ShaderMaterial.prototype = Object.assign(Object.create(Material.prototype),
	/** @lends zen3d.ShaderMaterial.prototype */
	{
		constructor: ShaderMaterial,
		copy: function copy(source) {
			Material.prototype.copy.call(this, source);
			this.vertexShader = source.vertexShader;
			this.fragmentShader = source.fragmentShader;
			this.uniforms = cloneUniforms(source.uniforms);
			return this;
		}
	});

	/**
	 * A material for drawing geometry by depth.
	 * Depth is based off of the camera near and far plane. White is nearest, black is farthest.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function DepthMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.DEPTH;
		/**
				* Encoding for depth packing.
				* @type {boolean}
				* @default false
				*/

		this.packToRGBA = false;
	}

	DepthMaterial.prototype = Object.create(Material.prototype);
	DepthMaterial.prototype.constructor = DepthMaterial;

	/**
	 * A material for drawing geometry by distance.
	 * @constructor
	 * @extends zen3d.Material
	 * @memberof zen3d
	 */

	function DistanceMaterial() {
		Material.call(this);
		this.type = MATERIAL_TYPE.DISTANCE;
	}

	DistanceMaterial.prototype = Object.create(Material.prototype);
	DistanceMaterial.prototype.constructor = DistanceMaterial;

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
				if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
					return 'highp';
				}

				precision = 'mediump';
			}

			if (precision === 'mediump') {
				if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
					return 'mediump';
				}
			}

			return 'lowp';
		}

		var version = parseFloat(/^WebGL\ ([0-9])/.exec(gl.getParameter(gl.VERSION))[1]); // This extension is available to both, WebGL1 and WebGL2 contexts.

		var anisotropyExt = getExtension('EXT_texture_filter_anisotropic');
		return (
			/** @lends zen3d.WebGLCapabilities# */
			{
				/**
							 * WebGL version.
							 * @type {number}
							 */
				version: version,

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
				maxAnisotropy: anisotropyExt !== null ? gl.getParameter(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1,

				/**
							 * The max samples value.
							 * @type {Integer}
							 */
				maxSamples: version > 1 ? gl.getParameter(gl.MAX_SAMPLES) : 1,
				getExtension: getExtension
			}
		);
	}

	function createTexture(gl, type, target, count) {
		var data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.

		var texture = gl.createTexture();
		gl.bindTexture(type, texture);
		gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		for (var i = 0; i < count; i++) {
			gl.texImage2D(target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
		}

		return texture;
	}

	function ColorBuffer(gl) {
		var locked = false;
		var color = new Vector4();
		var currentColorMask = null;
		var currentColorClear = new Vector4(0, 0, 0, 0);
		return {
			setMask: function setMask(colorMask) {
				if (currentColorMask !== colorMask && !locked) {
					gl.colorMask(colorMask, colorMask, colorMask, colorMask);
					currentColorMask = colorMask;
				}
			},
			setLocked: function setLocked(lock) {
				locked = lock;
			},
			setClear: function setClear(r, g, b, a, premultipliedAlpha) {
				if (premultipliedAlpha === true) {
					r *= a;
					g *= a;
					b *= a;
				}

				color.set(r, g, b, a);

				if (currentColorClear.equals(color) === false) {
					gl.clearColor(r, g, b, a);
					currentColorClear.copy(color);
				}
			},
			getClear: function getClear() {
				return currentColorClear;
			},
			reset: function reset() {
				locked = false;
				currentColorMask = null;
				currentColorClear.set(-1, 0, 0, 0); // set to invalid state
			}
		};
	}

	function DepthBuffer(gl, state) {
		var locked = false;
		var currentDepthMask = null;
		var currentDepthFunc = null;
		var currentDepthClear = null;
		return {
			setTest: function setTest(depthTest) {
				if (depthTest) {
					state.enable(gl.DEPTH_TEST);
				} else {
					state.disable(gl.DEPTH_TEST);
				}
			},
			setMask: function setMask(depthMask) {
				if (currentDepthMask !== depthMask && !locked) {
					gl.depthMask(depthMask);
					currentDepthMask = depthMask;
				}
			},
			setFunc: function setFunc(depthFunc) {
				if (currentDepthFunc !== depthFunc) {
					gl.depthFunc(depthFunc);
					currentDepthFunc = depthFunc;
				}
			},
			setLocked: function setLocked(lock) {
				locked = lock;
			},
			setClear: function setClear(depth) {
				if (currentDepthClear !== depth) {
					gl.clearDepth(depth);
					currentDepthClear = depth;
				}
			},
			reset: function reset() {
				locked = false;
				currentDepthMask = null;
				currentDepthFunc = null;
				currentDepthClear = null;
			}
		};
	}

	function StencilBuffer(gl, state) {
		var locked = false;
		var currentStencilMask = null;
		var currentStencilFunc = null;
		var currentStencilRef = null;
		var currentStencilFuncMask = null;
		var currentStencilFail = null;
		var currentStencilZFail = null;
		var currentStencilZPass = null;
		var currentStencilFuncBack = null;
		var currentStencilRefBack = null;
		var currentStencilFuncMaskBack = null;
		var currentStencilFailBack = null;
		var currentStencilZFailBack = null;
		var currentStencilZPassBack = null;
		var currentStencilClear = null;
		return {
			setTest: function setTest(stencilTest) {
				if (stencilTest) {
					state.enable(gl.STENCIL_TEST);
				} else {
					state.disable(gl.STENCIL_TEST);
				}
			},
			setMask: function setMask(stencilMask) {
				if (currentStencilMask !== stencilMask && !locked) {
					gl.stencilMask(stencilMask);
					currentStencilMask = stencilMask;
				}
			},
			setFunc: function setFunc(stencilFunc, stencilRef, stencilMask, stencilFuncBack, stencilRefBack, stencilMaskBack) {
				if (currentStencilFunc !== stencilFunc || currentStencilRef !== stencilRef || currentStencilFuncMask !== stencilMask || currentStencilFuncBack !== stencilFuncBack || currentStencilRefBack !== stencilRefBack || currentStencilFuncMaskBack !== stencilMaskBack) {
					if (stencilFuncBack === null || stencilRefBack === null || stencilMaskBack === null) {
						gl.stencilFunc(stencilFunc, stencilRef, stencilMask);
					} else {
						gl.stencilFuncSeparate(gl.FRONT, stencilFunc, stencilRef, stencilMask);
						gl.stencilFuncSeparate(gl.BACK, stencilFuncBack, stencilRefBack, stencilMaskBack);
					}

					currentStencilFunc = stencilFunc;
					currentStencilRef = stencilRef;
					currentStencilFuncMask = stencilMask;
					currentStencilFuncBack = stencilFuncBack;
					currentStencilRefBack = stencilRefBack;
					currentStencilFuncMaskBack = stencilMaskBack;
				}
			},
			setOp: function setOp(stencilFail, stencilZFail, stencilZPass, stencilFailBack, stencilZFailBack, stencilZPassBack) {
				if (currentStencilFail !== stencilFail || currentStencilZFail !== stencilZFail || currentStencilZPass !== stencilZPass || currentStencilFailBack !== stencilFailBack || currentStencilZFailBack !== stencilZFailBack || currentStencilZPassBack !== stencilZPassBack) {
					if (stencilFailBack === null || stencilZFailBack === null || stencilZPassBack === null) {
						gl.stencilOp(stencilFail, stencilZFail, stencilZPass);
					} else {
						gl.stencilOpSeparate(gl.FRONT, stencilFail, stencilZFail, stencilZPass);
						gl.stencilOpSeparate(gl.BACK, stencilFailBack, stencilZFailBack, stencilZPassBack);
					}

					currentStencilFail = stencilFail;
					currentStencilZFail = stencilZFail;
					currentStencilZPass = stencilZPass;
					currentStencilFailBack = stencilFailBack;
					currentStencilZFailBack = stencilZFailBack;
					currentStencilZPassBack = stencilZPassBack;
				}
			},
			setLocked: function setLocked(lock) {
				locked = lock;
			},
			setClear: function setClear(stencil) {
				if (currentStencilClear !== stencil) {
					gl.clearStencil(stencil);
					currentStencilClear = stencil;
				}
			},
			reset: function reset() {
				locked = false;
				currentStencilMask = null;
				currentStencilFunc = null;
				currentStencilRef = null;
				currentStencilFuncMask = null;
				currentStencilFail = null;
				currentStencilZFail = null;
				currentStencilZPass = null;
				currentStencilClear = null;
			}
		};
	}

	function WebGLState(gl, capabilities) {
		this.gl = gl;
		this.capabilities = capabilities;
		this.colorBuffer = new ColorBuffer(gl);
		this.depthBuffer = new DepthBuffer(gl, this);
		this.stencilBuffer = new StencilBuffer(gl, this);
		this.states = {};
		this.currentBlending = null;
		this.currentBlendEquation = null;
		this.currentBlendSrc = null;
		this.currentBlendDst = null;
		this.currentBlendEquationAlpha = null;
		this.currentBlendSrcAlpha = null;
		this.currentBlendDstAlpha = null;
		this.currentPremultipliedAlpha = null;
		this.currentCullFace = null;
		this.currentViewport = new Vector4();
		this.currentTextureSlot = null;
		this.currentBoundTextures = {};
		this.currentBoundBuffers = {};
		this.emptyTextures = {};
		this.emptyTextures[gl.TEXTURE_2D] = createTexture(gl, gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
		this.emptyTextures[gl.TEXTURE_CUBE_MAP] = createTexture(gl, gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);
		this.currentFlipSided = false;
		this.currentLineWidth = null;
		this.currentPolygonOffsetFactor = null;
		this.currentPolygonOffsetUnits = null;
		this.currentProgram = null;
		this.currentRenderTarget = null; // init

		this.colorBuffer.setClear(0, 0, 0, 1);
		this.depthBuffer.setClear(1);
		this.stencilBuffer.setClear(0);
		this.depthBuffer.setTest(true);
		this.depthBuffer.setFunc(WEBGL_COMPARE_FUNC.LEQUAL);
		this.setCullFace(CULL_FACE_TYPE.BACK);
		this.setFlipSided(false);
	}

	Object.assign(WebGLState.prototype, {
		setBlend: function setBlend(blend, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha) {
			var gl = this.gl;

			if (blend !== BLEND_TYPE.NONE) {
				this.enable(gl.BLEND);
			} else {
				this.disable(gl.BLEND);
			}

			if (blend !== BLEND_TYPE.CUSTOM) {
				if (blend !== this.currentBlending || premultipliedAlpha !== this.currentPremultipliedAlpha) {
					if (blend === BLEND_TYPE.NORMAL) {
						if (premultipliedAlpha) {
							gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
							gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
						} else {
							gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
							gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
						}
					}

					if (blend === BLEND_TYPE.ADD) {
						if (premultipliedAlpha) {
							gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
							gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
						} else {
							gl.blendEquation(gl.FUNC_ADD);
							gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
						}
					}
				}

				this.currentBlendEquation = null;
				this.currentBlendSrc = null;
				this.currentBlendDst = null;
				this.currentBlendEquationAlpha = null;
				this.currentBlendSrcAlpha = null;
				this.currentBlendDstAlpha = null;
			} else {
				blendEquationAlpha = blendEquationAlpha || blendEquation;
				blendSrcAlpha = blendSrcAlpha || blendSrc;
				blendDstAlpha = blendDstAlpha || blendDst;

				if (blendEquation !== this.currentBlendEquation || blendEquationAlpha !== this.currentBlendEquationAlpha) {
					gl.blendEquationSeparate(blendEquation, blendEquationAlpha);
					this.currentBlendEquation = blendEquation;
					this.currentBlendEquationAlpha = blendEquationAlpha;
				}

				if (blendSrc !== this.currentBlendSrc || blendDst !== this.currentBlendDst || blendSrcAlpha !== this.currentBlendSrcAlpha || blendDstAlpha !== this.currentBlendDstAlpha) {
					gl.blendFuncSeparate(blendSrc, blendDst, blendSrcAlpha, blendDstAlpha);
					this.currentBlendSrc = blendSrc;
					this.currentBlendDst = blendDst;
					this.currentBlendSrcAlpha = blendSrcAlpha;
					this.currentBlendDstAlpha = blendDstAlpha;
				}
			}

			this.currentBlending = blend;
			this.currentPremultipliedAlpha = premultipliedAlpha;
		},
		setFlipSided: function setFlipSided(flipSided) {
			var gl = this.gl;

			if (this.currentFlipSided !== flipSided) {
				if (flipSided) {
					gl.frontFace(gl.CW);
				} else {
					gl.frontFace(gl.CCW);
				}

				this.currentFlipSided = flipSided;
			}
		},
		setCullFace: function setCullFace(cullFace) {
			var gl = this.gl;

			if (cullFace !== CULL_FACE_TYPE.NONE) {
				this.enable(gl.CULL_FACE);

				if (cullFace !== this.currentCullFace) {
					if (cullFace === CULL_FACE_TYPE.BACK) {
						gl.cullFace(gl.BACK);
					} else if (cullFace === CULL_FACE_TYPE.FRONT) {
						gl.cullFace(gl.FRONT);
					} else {
						gl.cullFace(gl.FRONT_AND_BACK);
					}
				}
			} else {
				this.disable(gl.CULL_FACE);
			}

			this.currentCullFace = cullFace;
		},
		viewport: function viewport(x, y, width, height) {
			var currentViewport = this.currentViewport;

			if (currentViewport.x !== x || currentViewport.y !== y || currentViewport.z !== width || currentViewport.w !== height) {
				var gl = this.gl;
				gl.viewport(x, y, width, height);
				currentViewport.set(x, y, width, height);
			}
		},
		activeTexture: function activeTexture(slot) {
			var gl = this.gl;

			if (slot === undefined) {
				slot = gl.TEXTURE0 + this.capabilities.maxTextures - 1;
			}

			if (this.currentTextureSlot !== slot) {
				gl.activeTexture(slot);
				this.currentTextureSlot = slot;
			}
		},
		bindTexture: function bindTexture(type, texture) {
			var gl = this.gl;

			if (this.currentTextureSlot === null) {
				this.activeTexture();
			}

			var boundTexture = this.currentBoundTextures[this.currentTextureSlot];

			if (boundTexture === undefined) {
				boundTexture = {
					type: undefined,
					texture: undefined
				};
				this.currentBoundTextures[this.currentTextureSlot] = boundTexture;
			}

			if (boundTexture.type !== type || boundTexture.texture !== texture) {
				gl.bindTexture(type, texture || this.emptyTextures[type]);
				boundTexture.type = type;
				boundTexture.texture = texture;
			}
		},
		bindBuffer: function bindBuffer(type, buffer) {
			var gl = this.gl;
			var boundBuffer = this.currentBoundBuffers[type];

			if (boundBuffer !== buffer) {
				gl.bindBuffer(type, buffer);
				this.currentBoundBuffers[type] = buffer;
			}
		},
		enable: function enable(id) {
			if (this.states[id] !== true) {
				this.gl.enable(id);
				this.states[id] = true;
			}
		},
		disable: function disable(id) {
			if (this.states[id] !== false) {
				this.gl.disable(id);
				this.states[id] = false;
			}
		},
		setLineWidth: function setLineWidth(width) {
			if (width !== this.currentLineWidth) {
				var lineWidthRange = this.capabilities.lineWidthRange;

				if (lineWidthRange[0] <= width && width <= lineWidthRange[1]) {
					this.gl.lineWidth(width);
				} else {
					console.warn("GL_ALIASED_LINE_WIDTH_RANGE is [" + lineWidthRange[0] + "," + lineWidthRange[1] + "], but set to " + width + ".");
				}

				this.currentLineWidth = width;
			}
		},
		setPolygonOffset: function setPolygonOffset(polygonOffset, factor, units) {
			var gl = this.gl;

			if (polygonOffset) {
				this.enable(gl.POLYGON_OFFSET_FILL);

				if (this.currentPolygonOffsetFactor !== factor || this.currentPolygonOffsetUnits !== units) {
					gl.polygonOffset(factor, units);
					this.currentPolygonOffsetFactor = factor;
					this.currentPolygonOffsetUnits = units;
				}
			} else {
				this.disable(gl.POLYGON_OFFSET_FILL);
			}
		},
		setProgram: function setProgram(program) {
			if (this.currentProgram !== program) {
				this.gl.useProgram(program.program);
				this.currentProgram = program;
			}
		}
	});

	function WebGLProperties() {
		this.properties = new WeakMap();
	}

	Object.assign(WebGLProperties.prototype, {
		get: function get(object) {
			var map = this.properties.get(object);

			if (map === undefined) {
				map = {};
				this.properties.set(object, map);
			}

			return map;
		},
		delete: function _delete(object) {
			this.properties.delete(object);
		},
		clear: function clear() {
			this.properties = new WeakMap();
		}
	});

	function textureNeedsPowerOfTwo(texture) {
		if (texture.wrapS !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE || texture.wrapT !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE) return true;
		if (texture.minFilter !== WEBGL_TEXTURE_FILTER.NEAREST && texture.minFilter !== WEBGL_TEXTURE_FILTER.LINEAR) return true;
		return false;
	}

	function filterFallback(filter) {
		if (filter === WEBGL_TEXTURE_FILTER.NEAREST || filter === WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_LINEAR || filter === WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_NEAREST) {
			return WEBGL_TEXTURE_FILTER.NEAREST;
		}

		return WEBGL_TEXTURE_FILTER.LINEAR;
	}

	function _isPowerOfTwo(image) {
		return isPowerOfTwo(image.width) && isPowerOfTwo(image.height);
	}

	function makePowerOf2(image) {
		if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement) {
			var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
			canvas.width = nearestPowerOfTwo(image.width);
			canvas.height = nearestPowerOfTwo(image.height);
			var context = canvas.getContext('2d');
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
			console.warn('image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);
			return canvas;
		}

		return image;
	}

	function clampToMaxSize(image, maxSize) {
		if (image.width > maxSize || image.height > maxSize) {
			// console.warn('image is too big (' + image.width + 'x' + image.height + '). max size is ' + maxSize + 'x' + maxSize, image);
			// return image;
			// Warning: Scaling through the canvas will only work with images that use
			// premultiplied alpha.
			var scale = maxSize / Math.max(image.width, image.height);
			var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
			canvas.width = Math.floor(image.width * scale);
			canvas.height = Math.floor(image.height * scale);
			var context = canvas.getContext('2d');
			context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
			console.warn('image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);
			return canvas;
		}

		return image;
	}

	function getTextureParameters(texture, needFallback) {
		var wrapS = texture.wrapS,
				wrapT = texture.wrapT,
				magFilter = texture.magFilter,
				minFilter = texture.minFilter,
				anisotropy = texture.anisotropy,
				compare = texture.compare; // fix for non power of 2 image in WebGL 1.0

		if (needFallback) {
			wrapS = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
			wrapT = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

			if (texture.wrapS !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE || texture.wrapT !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE) {
				console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to zen3d.TEXTURE_WRAP.CLAMP_TO_EDGE.', texture);
			}

			magFilter = filterFallback(texture.magFilter);
			minFilter = filterFallback(texture.minFilter);

			if (texture.minFilter !== WEBGL_TEXTURE_FILTER.NEAREST && texture.minFilter !== WEBGL_TEXTURE_FILTER.LINEAR || texture.magFilter !== WEBGL_TEXTURE_FILTER.NEAREST && texture.magFilter !== WEBGL_TEXTURE_FILTER.LINEAR) {
				console.warn('Texture is not power of two. Texture.minFilter and Texture.magFilter should be set to zen3d.TEXTURE_FILTER.NEAREST or zen3d.TEXTURE_FILTER.LINEAR.', texture);
			}
		}

		return [wrapS, wrapT, magFilter, minFilter, anisotropy, compare];
	}

	function WebGLTexture(gl, state, properties, capabilities) {
		this.gl = gl;
		this.state = state;
		this.properties = properties;
		this.capabilities = capabilities; // this.samplers = {};
	}

	Object.assign(WebGLTexture.prototype, {
		setTexture2D: function setTexture2D(texture, slot) {
			var gl = this.gl;
			var state = this.state;
			var capabilities = this.capabilities;

			if (slot !== undefined) {
				slot = gl.TEXTURE0 + slot;
			}

			var textureProperties = this.properties.get(texture);

			if (texture.image && (!texture.image.rtt || slot === undefined) && textureProperties.__version !== texture.version) {
				if (textureProperties.__webglTexture === undefined) {
					texture.addEventListener('dispose', this.onTextureDispose, this);
					textureProperties.__webglTexture = gl.createTexture();
				}

				state.activeTexture(slot);
				state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
				var image = texture.image;
				var isElement = image instanceof HTMLImageElement || image instanceof HTMLCanvasElement;

				if (isElement) {
					image = clampToMaxSize(image, capabilities.maxTextureSize);

					if (textureNeedsPowerOfTwo(texture) && _isPowerOfTwo(image) === false && capabilities.version < 2) {
						image = makePowerOf2(image);
					}
				}

				var needFallback = !_isPowerOfTwo(image) && capabilities.version < 2;
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
				this.setTextureParameters(texture, needFallback);
				var mipmap,
						mipmaps = texture.mipmaps,
						format = texture.format,
						internalformat = texture.internalformat || texture.format,
						type = texture.type;

				if (capabilities.version < 2) {
					if (format !== internalformat) {
						console.warn("texture format " + format + " not same as internalformat " + internalformat + " in webgl 1.0.");
					}

					if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
						if (!capabilities.getExtension('OES_texture_half_float')) {
							console.warn("extension OES_texture_half_float is not support in webgl 1.0.");
						}
					}

					if (type === WEBGL_PIXEL_TYPE.FLOAT) {
						if (!capabilities.getExtension('OES_texture_float')) {
							console.warn("extension OES_texture_float is not support in webgl 1.0.");
						}
					}

					if (format === WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT || format === WEBGL_PIXEL_FORMAT.DEPTH_STENCIL) {
						if (!capabilities.getExtension('WEBGL_depth_texture')) {
							console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
						}
					}
				} else {
					if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
						type = 0x140B; // webgl2 half float value
					}
				}

				if (isElement) {
					if (mipmaps.length > 0 && !needFallback) {
						for (var i = 0, il = mipmaps.length; i < il; i++) {
							mipmap = mipmaps[i];
							gl.texImage2D(gl.TEXTURE_2D, i, internalformat, format, type, mipmap);
						}

						texture.generateMipmaps = false;
						textureProperties.__maxMipLevel = mipmaps.length - 1;
					} else {
						gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, image);
						textureProperties.__maxMipLevel = 0;
					}
				} else {
					if (mipmaps.length > 0 && !needFallback) {
						for (var i = 0, il = mipmaps.length; i < il; i++) {
							mipmap = mipmaps[i];
							gl.texImage2D(gl.TEXTURE_2D, i, internalformat, mipmap.width, mipmap.height, texture.border, format, type, mipmap.data);
						}

						texture.generateMipmaps = false;
						textureProperties.__maxMipLevel = mipmaps.length - 1;
					} else {
						gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, image.width, image.height, texture.border, format, type, image.data);
						textureProperties.__maxMipLevel = 0;
					}
				}

				if (texture.generateMipmaps && !needFallback) {
					this.generateMipmap(gl.TEXTURE_2D, texture, image.width, image.height);
				}

				textureProperties.__version = texture.version;
				return textureProperties;
			}

			state.activeTexture(slot);
			state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
			return textureProperties;
		},
		setTextureCube: function setTextureCube(texture, slot) {
			var gl = this.gl;
			var state = this.state;
			var capabilities = this.capabilities;

			if (slot !== undefined) {
				slot = gl.TEXTURE0 + slot;
			}

			var textureProperties = this.properties.get(texture);

			if (texture.images.length === 6 && (!texture.images[0].rtt || slot === undefined) && textureProperties.__version !== texture.version) {
				if (textureProperties.__webglTexture === undefined) {
					texture.addEventListener('dispose', this.onTextureDispose, this);
					textureProperties.__webglTexture = gl.createTexture();
				}

				state.activeTexture(slot);
				state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
				var images = [];
				var mipmap,
						mipmaps = texture.mipmaps,
						format = texture.format,
						internalformat = texture.internalformat || texture.format,
						type = texture.type;

				if (capabilities.version < 2) {
					if (format !== internalformat) {
						console.warn("texture format " + format + " not same as internalformat " + internalformat + " in webgl 1.0.");
					}

					if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
						if (!capabilities.getExtension('OES_texture_half_float')) {
							console.warn("extension OES_texture_half_float is not support in webgl 1.0.");
						}
					}

					if (type === WEBGL_PIXEL_TYPE.FLOAT) {
						if (!capabilities.getExtension('OES_texture_float')) {
							console.warn("extension OES_texture_float is not support in webgl 1.0.");
						}
					}

					if (format === WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT || format === WEBGL_PIXEL_FORMAT.DEPTH_STENCIL) {
						if (!capabilities.getExtension('WEBGL_depth_texture')) {
							console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
						}
					}
				} else {
					if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
						type = 0x140B; // webgl2 half float value
					}
				}

				var needFallback = false;

				for (var i = 0; i < 6; i++) {
					var image = texture.images[i];
					var isElement = image instanceof HTMLImageElement || image instanceof HTMLCanvasElement;

					if (isElement) {
						image = clampToMaxSize(image, capabilities.maxTextureSize);

						if (textureNeedsPowerOfTwo(texture) && _isPowerOfTwo(image) === false && capabilities.version < 2) {
							image = makePowerOf2(image);
						}
					}

					if (!_isPowerOfTwo(image) && capabilities.version < 2) {
						needFallback = true;
					}

					images[i] = image;
					image.__isElement = isElement;
				}

				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
				this.setTextureParameters(texture, needFallback);

				for (var i = 0; i < 6; i++) {
					var image = images[i];
					var isElement = image.__isElement;

					if (isElement) {
						if (mipmaps.length > 0 && !needFallback) {
							for (var j = 0, jl = mipmaps.length; j < jl; j++) {
								mipmap = mipmaps[j][i];
								gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalformat, format, type, mipmap);
							}

							textureProperties.__maxMipLevel = mipmaps.length - 1;
							texture.generateMipmaps = false;
						} else {
							gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalformat, format, type, image);
							textureProperties.__maxMipLevel = 0;
						}
					} else {
						if (mipmaps.length > 0 && !needFallback) {
							for (var j = 0, jl = mipmaps.length; j < jl; j++) {
								mipmap = mipmaps[j][i];
								gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, internalformat, mipmap.width, mipmap.height, texture.border, format, type, mipmap.data);
							}

							textureProperties.__maxMipLevel = mipmaps.length - 1;
							texture.generateMipmaps = false;
						} else {
							gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalformat, image.width, image.height, texture.border, format, type, image.data);
							textureProperties.__maxMipLevel = 0;
						}
					}
				}

				if (texture.generateMipmaps && !needFallback) {
					this.generateMipmap(gl.TEXTURE_CUBE_MAP, texture, image.width, image.height);
				}

				textureProperties.__version = texture.version;
				return textureProperties;
			}

			state.activeTexture(slot);
			state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
			return textureProperties;
		},
		setTexture3D: function setTexture3D(texture, slot) {
			var gl = this.gl;
			var state = this.state;
			var capabilities = this.capabilities;

			if (capabilities.version < 2) {
				console.warn("Try to use Texture3D but browser not support WebGL2.0");
				return;
			}

			if (slot !== undefined) {
				slot = gl.TEXTURE0 + slot;
			}

			var textureProperties = this.properties.get(texture);

			if (texture.image && textureProperties.__version !== texture.version) {
				if (textureProperties.__webglTexture === undefined) {
					texture.addEventListener('dispose', this.onTextureDispose, this);
					textureProperties.__webglTexture = gl.createTexture();
				}

				state.activeTexture(slot);
				state.bindTexture(gl.TEXTURE_3D, textureProperties.__webglTexture);
				var image = texture.image;
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
				this.setTextureParameters(texture, false);
				var format = texture.format,
						internalformat = texture.internalformat || texture.format,
						type = texture.type;
				gl.texImage3D(gl.TEXTURE_3D, 0, internalformat, image.width, image.height, image.depth, texture.border, format, type, image.data);

				if (texture.generateMipmaps) {
					this.generateMipmap(gl.TEXTURE_3D, texture, image.width, image.height);
				}

				textureProperties.__version = texture.version;
				return textureProperties;
			}

			state.activeTexture(slot);
			state.bindTexture(gl.TEXTURE_3D, textureProperties.__webglTexture);
			return textureProperties;
		},
		setTextureParameters: function setTextureParameters(texture, needFallback) {
			var gl = this.gl;
			var capabilities = this.capabilities;
			var textureType = texture.textureType;
			var parameters = getTextureParameters(texture, needFallback); // TODO sampler bug
			// if (capabilities.version >= 2) {
			//		 var samplerKey = parameters.join("_");
			//		 if (!this.samplers[samplerKey]) {
			//				 var samplerA = gl.createSampler();
			//				 gl.samplerParameteri(samplerA, gl.TEXTURE_WRAP_S, parameters[0]);
			//				 gl.samplerParameteri(samplerA, gl.TEXTURE_WRAP_T, parameters[1]);
			//				 gl.samplerParameteri(samplerA, gl.TEXTURE_MAG_FILTER, parameters[2]);
			//				 gl.samplerParameteri(samplerA, gl.TEXTURE_MIN_FILTER, parameters[3]);
			//				 // anisotropy if EXT_texture_filter_anisotropic exist
			//				 // TODO bug here: https://github.com/KhronosGroup/WebGL/issues/2006
			//				 // var extension = capabilities.anisotropyExt;
			//				 // if (extension) {
			//				 //		 gl.samplerParameterf(samplerA, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(parameters[4], capabilities.maxAnisotropy));
			//				 // }
			//				 this.samplers[samplerKey] = samplerA;
			//		 }
			//		 gl.bindSampler(this.state.currentTextureSlot - gl.TEXTURE0, this.samplers[samplerKey]);
			// } else {

			gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, parameters[0]);
			gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, parameters[1]);
			gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, parameters[2]);
			gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, parameters[3]); // anisotropy if EXT_texture_filter_anisotropic exist

			var extension = capabilities.anisotropyExt;

			if (extension) {
				gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(parameters[4], capabilities.maxAnisotropy));
			}

			if (capabilities.version >= 2) {
				if (parameters[5] !== undefined) {
					gl.texParameteri(textureType, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
					gl.texParameteri(textureType, gl.TEXTURE_COMPARE_FUNC, parameters[5]);
				} else {
					gl.texParameteri(textureType, gl.TEXTURE_COMPARE_MODE, gl.NONE);
				}
			} // }

		},
		generateMipmap: function generateMipmap(target, texture, width, height) {
			var gl = this.gl;
			gl.generateMipmap(target);
			var textureProperties = this.properties.get(texture); // Note: Math.log( x ) * Math.LOG2E used instead of Math.log2( x ) which is not supported by IE11

			textureProperties.__maxMipLevel = Math.log(Math.max(width, height)) * Math.LOG2E;
		},
		onTextureDispose: function onTextureDispose(event) {
			var gl = this.gl;
			var texture = event.target;
			var textureProperties = this.properties.get(texture);
			texture.removeEventListener('dispose', this.onTextureDispose, this);

			if (textureProperties.__webglTexture) {
				gl.deleteTexture(textureProperties.__webglTexture);
			}

			this.properties.delete(texture);
		}
	});

	function createBuffer(gl, data, attribute, bufferType) {
		var array = attribute.array;
		var usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
		var buffer = gl.createBuffer();
		gl.bindBuffer(bufferType, buffer);
		gl.bufferData(bufferType, array, usage);
		var type = gl.FLOAT;

		if (array instanceof Float32Array) {
			type = gl.FLOAT;
		} else if (array instanceof Float64Array) {
			console.warn('Unsupported data buffer format: Float64Array.');
		} else if (array instanceof Uint16Array) {
			type = gl.UNSIGNED_SHORT;
		} else if (array instanceof Int16Array) {
			type = gl.SHORT;
		} else if (array instanceof Uint32Array) {
			type = gl.UNSIGNED_INT;
		} else if (array instanceof Int32Array) {
			type = gl.INT;
		} else if (array instanceof Int8Array) {
			type = gl.BYTE;
		} else if (array instanceof Uint8Array) {
			type = gl.UNSIGNED_BYTE;
		}

		data.buffer = buffer;
		data.type = type;
		data.bytesPerElement = array.BYTES_PER_ELEMENT;
		data.version = attribute.version;
	}

	function updateBuffer(gl, capabilities, buffer, attribute, bufferType) {
		var array = attribute.array;
		var updateRange = attribute.updateRange;
		gl.bindBuffer(bufferType, buffer);

		if (attribute.dynamic === false) {
			gl.bufferData(bufferType, array, gl.STATIC_DRAW);
		} else if (updateRange.count === -1) {
			// Not using update ranges
			gl.bufferSubData(bufferType, 0, array);
		} else if (updateRange.count === 0) {
			console.error('updateBuffer: dynamic BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.');
		} else {
			if (capabilities.version >= 2) {
				gl.bufferSubData(bufferType, updateRange.offset * array.BYTES_PER_ELEMENT, array, updateRange.offset, updateRange.count);
			} else {
				gl.bufferSubData(bufferType, updateRange.offset * array.BYTES_PER_ELEMENT, array.subarray(updateRange.offset, updateRange.offset + updateRange.count));
			}

			updateRange.count = -1; // reset range
		}
	}

	function updateAttribute(gl, properties, capabilities, attribute, bufferType) {
		// if isInterleavedBufferAttribute, get InterleavedBuffer as data.
		// else get BufferAttribute as data
		if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;
		var data = properties.get(attribute);

		if (data.buffer === undefined) {
			createBuffer(gl, data, attribute, bufferType);
		} else if (data.version < attribute.version) {
			updateBuffer(gl, capabilities, data.buffer, attribute, bufferType);
			data.version = attribute.version;
		}
	}

	function removeAttribute(gl, properties, attribute) {
		if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;
		var data = properties.get(attribute);

		if (data.buffer) {
			gl.deleteBuffer(data.buffer);
		}

		properties.delete(attribute);
	}

	function WebGLGeometry(gl, state, vertexArrayBindings, properties, capabilities) {
		this.gl = gl;
		this.state = state;
		this.vertexArrayBindings = vertexArrayBindings;
		this.properties = properties;
		this.capabilities = capabilities;
	}

	Object.assign(WebGLGeometry.prototype, {
		// if need, create webgl buffers; but not bind
		setGeometry: function setGeometry(geometry) {
			var gl = this.gl;
			var properties = this.properties;
			var capabilities = this.capabilities;
			var geometryProperties = this.properties.get(geometry);

			if (!geometryProperties.created) {
				geometry.addEventListener('dispose', this.onGeometryDispose, this);
				geometryProperties.created = true;
				geometryProperties._vaos = {};
			}

			if (geometry.index !== null) {
				updateAttribute(gl, properties, capabilities, geometry.index, gl.ELEMENT_ARRAY_BUFFER);
			}

			for (var name in geometry.attributes) {
				updateAttribute(gl, properties, capabilities, geometry.attributes[name], gl.ARRAY_BUFFER);
			}

			for (var name in geometry.morphAttributes) {
				var array = geometry.morphAttributes[name];

				for (var i = 0, l = array.length; i < l; i++) {
					updateAttribute(gl, properties, capabilities, array[i], gl.ARRAY_BUFFER);
				}
			}

			return geometryProperties;
		},
		onGeometryDispose: function onGeometryDispose(event) {
			var gl = this.gl;
			var geometry = event.target;
			var geometryProperties = this.properties.get(geometry);
			geometry.removeEventListener('dispose', this.onGeometryDispose, this);

			if (geometry.index !== null) {
				removeAttribute(gl, this.properties, geometry.index);
			}

			for (var name in geometry.attributes) {
				removeAttribute(gl, this.properties, geometry.attributes[name]);
			}

			for (var name in geometry.morphAttributes) {
				var array = geometry.morphAttributes[name];

				for (var i = 0, l = array.length; i < l; i++) {
					removeAttribute(gl, this.properties, array[i]);
				}
			} // dispose vaos


			for (var key in geometryProperties._vaos) {
				var vao = geometryProperties[key];

				if (vao) {
					this.vertexArrayBindings.disposeVAO(vao.object);
				}
			}

			geometryProperties._vaos = {};
			geometryProperties.created = false;
			this.properties.delete(geometry);
		}
	});

	var emptyTexture = new Texture2D();
	emptyTexture.image = {
		data: new Uint8Array([1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]),
		width: 2,
		height: 2
	};
	emptyTexture.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
	emptyTexture.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;
	emptyTexture.generateMipmaps = false;
	emptyTexture.version++;
	var emptyShadowTexture = new Texture2D();
	emptyShadowTexture.image = {
		data: null,
		width: 2,
		height: 2
	};
	emptyShadowTexture.version++;
	emptyShadowTexture.type = WEBGL_PIXEL_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV;
	emptyShadowTexture.format = WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;
	emptyShadowTexture.internalformat = WEBGL_PIXEL_FORMAT.DEPTH32F_STENCIL8;
	emptyShadowTexture.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
	emptyShadowTexture.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;
	emptyShadowTexture.compare = WEBGL_COMPARE_FUNC.LESS;
	emptyShadowTexture.generateMipmaps = false;
	emptyShadowTexture.version++;
	var emptyTexture3d = new Texture3D();
	var emptyCubeTexture = new TextureCube(); // --- Base for inner nodes (including the root) ---

	function UniformContainer() {
		this.seq = [];
		this.map = {};
	}

	function arraysEqual(a, b) {
		if (a.length !== b.length) return false;

		for (var i = 0, l = a.length; i < l; i++) {
			if (a[i] !== b[i]) return false;
		}

		return true;
	}

	function copyArray(a, b) {
		for (var i = 0, l = b.length; i < l; i++) {
			a[i] = b[i];
		}
	} // Texture unit allocation


	var arrayCacheI32 = [];

	function allocTexUnits(glCore, n) {
		var r = arrayCacheI32[n];

		if (r === undefined) {
			r = new Int32Array(n);
			arrayCacheI32[n] = r;
		}

		for (var i = 0; i !== n; ++i) {
			r[i] = glCore.allocTexUnit();
		}

		return r;
	} // Helper to pick the right setter for uniform


	function generateSetter(uniform, pureArray) {
		var gl = uniform.gl;
		var type = uniform.type;
		var location = uniform.location;
		var cache = uniform.cache;

		switch (type) {
			case WEBGL_UNIFORM_TYPE.FLOAT:
				uniform.setValue = function (value) {
					if (cache[0] === value) return;
					gl.uniform1f(location, value);
					cache[0] = value;
				};

				if (pureArray) {
					uniform.set = function (value) {
						if (arraysEqual(cache, value)) return;
						gl.uniform1fv(location, value);
						copyArray(cache, value);
					};
				} else {
					uniform.set = uniform.setValue;
				}

				break;

			case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
			case WEBGL_UNIFORM_TYPE.SAMPLER_2D_SHADOW:
				uniform.setValue = function (value, glCore) {
					var unit = glCore.allocTexUnit();
					glCore.texture.setTexture2D(value || (type === WEBGL_UNIFORM_TYPE.SAMPLER_2D_SHADOW ? emptyShadowTexture : emptyTexture), unit);
					if (cache[0] === unit) return;
					gl.uniform1i(location, unit);
					cache[0] = unit;
				};

				if (pureArray) {
					uniform.set = function (value, glCore) {
						var n = value.length;
						var units = allocTexUnits(glCore, n);

						for (var i = 0; i !== n; ++i) {
							glCore.texture.setTexture2D(value[i] || (type === WEBGL_UNIFORM_TYPE.SAMPLER_2D_SHADOW ? emptyShadowTexture : emptyTexture), units[i]);
						}

						if (arraysEqual(cache, units)) return;
						gl.uniform1iv(location, units);
						copyArray(cache, units);
					};
				} else {
					uniform.set = uniform.setValue;
				}

				break;

			case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
			case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE_SHADOW:
				uniform.setValue = function (value, glCore) {
					var unit = glCore.allocTexUnit();
					glCore.texture.setTextureCube(value || emptyCubeTexture, unit);
					if (cache[0] === unit) return;
					gl.uniform1i(location, unit);
					cache[0] = unit;
				};

				if (pureArray) {
					uniform.set = function (value, glCore) {
						var n = value.length;
						var units = allocTexUnits(glCore, n);

						for (var i = 0; i !== n; ++i) {
							glCore.texture.setTextureCube(value[i] || emptyCubeTexture, units[i]);
						}

						if (arraysEqual(cache, units)) return;
						gl.uniform1iv(location, units);
						copyArray(cache, units);
					};
				} else {
					uniform.set = uniform.setValue;
				}

				break;

			case WEBGL_UNIFORM_TYPE.SAMPLER_3D:
				uniform.setValue = function (value, glCore) {
					var unit = glCore.allocTexUnit();
					glCore.texture.setTexture3D(value || emptyTexture3d, unit);
					if (cache[0] === unit) return;
					gl.uniform1i(location, unit);
					cache[0] = unit;
				};

				if (pureArray) {
					uniform.set = function (value, glCore) {
						var n = value.length;
						var units = allocTexUnits(glCore, n);

						for (var i = 0; i !== n; ++i) {
							glCore.texture.setTexture3D(value[i] || emptyTexture3d, units[i]);
						}

						if (arraysEqual(cache, units)) return;
						gl.uniform1iv(location, units);
						copyArray(cache, units);
					};
				} else {
					uniform.set = uniform.setValue;
				}

				break;

			case WEBGL_UNIFORM_TYPE.BOOL:
			case WEBGL_UNIFORM_TYPE.INT:
				uniform.setValue = function (value) {
					if (cache[0] === value) return;
					gl.uniform1i(location, value);
					cache[0] = value;
				};

				if (pureArray) {
					uniform.set = function (value) {
						if (arraysEqual(cache, value)) return;
						gl.uniform1iv(location, value);
						copyArray(cache, value);
					};
				} else {
					uniform.set = uniform.setValue;
				}

				break;

			case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
				uniform.setValue = function (p1, p2) {
					if (cache[0] !== p1 || cache[1] !== p2) {
						gl.uniform2f(location, p1, p2);
						cache[0] = p1;
						cache[1] = p2;
					}
				};

				uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniform2fv(location, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
			case WEBGL_UNIFORM_TYPE.INT_VEC2:
				uniform.setValue = function (p1, p2) {
					if (cache[0] !== p1 || cache[1] !== p2) {
						gl.uniform2i(location, p1, p2);
						cache[0] = p1;
						cache[1] = p2;
					}
				};

				uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniform2iv(location, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
				uniform.setValue = function (p1, p2, p3) {
					if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3) {
						gl.uniform3f(location, p1, p2, p3);
						cache[0] = p1;
						cache[1] = p2;
						cache[2] = p3;
					}
				};

				uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniform3fv(location, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
			case WEBGL_UNIFORM_TYPE.INT_VEC3:
				uniform.setValue = function (p1, p2, p3) {
					if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3) {
						gl.uniform3i(location, p1, p2, p3);
						cache[0] = p1;
						cache[1] = p2;
						cache[2] = p3;
					}
				};

				uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniform3iv(location, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
				uniform.setValue = function (p1, p2, p3, p4) {
					if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3 || cache[3] !== p4) {
						gl.uniform4f(location, p1, p2, p3, p4);
						cache[0] = p1;
						cache[1] = p2;
						cache[2] = p3;
						cache[3] = p4;
					}
				};

				uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniform4fv(location, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
			case WEBGL_UNIFORM_TYPE.INT_VEC4:
				uniform.setValue = function (p1, p2, p3, p4) {
					if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3 || cache[3] !== p4) {
						gl.uniform4i(location, p1, p2, p3, p4);
						cache[0] = p1;
						cache[1] = p2;
						cache[2] = p3;
						cache[3] = p4;
					}
				};

				uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniform4iv(location, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
				uniform.setValue = uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniformMatrix2fv(location, false, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
				uniform.setValue = uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniformMatrix3fv(location, false, value);
					copyArray(cache, value);
				};

				break;

			case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
				uniform.setValue = uniform.set = function (value) {
					if (arraysEqual(cache, value)) return;
					gl.uniformMatrix4fv(location, false, value);
					copyArray(cache, value);
				};

				break;
		}
	} // --- Uniform Classes ---


	function SingleUniform(gl, id, activeInfo, location) {
		this.gl = gl;
		this.id = id; // WEBGL_UNIFORM_TYPE

		this.type = activeInfo.type; // this.size = activeInfo.size; // always be 1

		this.location = location;
		this.setValue = undefined;
		this.set = undefined;
		this.cache = [];
		generateSetter(this);
	}

	function PureArrayUniform(gl, id, activeInfo, location) {
		this.gl = gl;
		this.id = id; // WEBGL_UNIFORM_TYPE

		this.type = activeInfo.type;
		this.size = activeInfo.size;
		this.location = location;
		this.setValue = undefined;
		this.set = undefined;
		this.cache = [];
		generateSetter(this, true);
	}

	function StructuredUniform(id) {
		this.id = id;
		UniformContainer.call(this); // mix-in
	}

	StructuredUniform.prototype.set = function (value, glCore) {
		var seq = this.seq;

		for (var i = 0, n = seq.length; i !== n; ++i) {
			var u = seq[i];
			u.set(value[u.id], glCore);
		}
	}; // --- Top-level ---
	// Parser - builds up the property tree from the path strings


	var RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g; // extracts
	// 	- the identifier (member name or array index)
	//	- followed by an optional right bracket (found when array index)
	//	- followed by an optional left bracket or dot (type of subscript)
	//
	// Note: These portions can be read in a non-overlapping fashion and
	// allow straightforward parsing of the hierarchy that WebGL encodes
	// in the uniform names.

	function addUniform(container, uniformObject) {
		container.seq.push(uniformObject);
		container.map[uniformObject.id] = uniformObject;
	} // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform


	function parseUniform(gl, activeInfo, location, container) {
		var path = activeInfo.name,
				pathLength = path.length; // reset RegExp object, because of the early exit of a previous run

		RePathPart.lastIndex = 0;

		while (true) {
			var match = RePathPart.exec(path),
					matchEnd = RePathPart.lastIndex,
					id = match[1],
					idIsIndex = match[2] === ']',
					subscript = match[3];
			if (idIsIndex) id = id | 0; // convert to integer

			if (subscript === undefined || subscript === '[' && matchEnd + 2 === pathLength) {
				// bare name or "pure" bottom-level array "[0]" suffix
				addUniform(container, subscript === undefined ? new SingleUniform(gl, id, activeInfo, location) : new PureArrayUniform(gl, id, activeInfo, location));
				break;
			} else {
				// step into inner node / create it in case it doesn't exist
				var map = container.map,
						next = map[id];

				if (next === undefined) {
					next = new StructuredUniform(id);
					addUniform(container, next);
				}

				container = next;
			}
		}
	} // Root Container


	function WebGLUniforms(gl, program) {
		UniformContainer.call(this);
		var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

		for (var i = 0; i < n; ++i) {
			var info = gl.getActiveUniform(program, i),
					addr = gl.getUniformLocation(program, info.name);
			parseUniform(gl, info, addr, this);
		}
	}

	WebGLUniforms.prototype.set = function (name, value, glCore) {
		var u = this.map[name];
		if (u !== undefined) u.set(value, glCore);
	};

	WebGLUniforms.prototype.has = function (name) {
		return !!this.map[name];
	};

	function WebGLAttribute(gl, program, attributeData) {
		this.gl = gl;
		this.name = attributeData.name; // WEBGL_ATTRIBUTE_TYPE

		this.type = attributeData.type;
		this.size = attributeData.size;
		this.location = gl.getAttribLocation(program, this.name);
		this.count = 0;
		this.initCount(gl);
		this.format = gl.FLOAT;
		this.initFormat(gl);
	}

	Object.assign(WebGLAttribute.prototype, {
		initCount: function initCount(gl) {
			var type = this.type;

			switch (type) {
				case WEBGL_ATTRIBUTE_TYPE.FLOAT:
				case WEBGL_ATTRIBUTE_TYPE.BYTE:
				case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
				case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
					this.count = 1;
					break;

				case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
					this.count = 2;
					break;

				case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
					this.count = 3;
					break;

				case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
					this.count = 4;
					break;
			}
		},
		initFormat: function initFormat(gl) {
			var type = this.type;

			switch (type) {
				case WEBGL_ATTRIBUTE_TYPE.FLOAT:
				case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
				case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
				case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
					this.format = gl.FLOAT;
					break;

				case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
					this.format = gl.UNSIGNED_BYTE;
					break;

				case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
					this.format = gl.UNSIGNED_SHORT;
					break;

				case WEBGL_ATTRIBUTE_TYPE.BYTE:
					this.format = gl.BYTE;
					break;
			}
		}
	});

	function addLineNumbers(string) {
		var lines = string.split('\n');

		for (var i = 0; i < lines.length; i++) {
			lines[i] = i + 1 + ': ' + lines[i];
		}

		return lines.join('\n');
	} // create a shader


	function loadShader(gl, type, source) {
		// create a shader object
		var shader = gl.createShader(type); // bind the shader source, source must be string type?

		gl.shaderSource(shader, source); // compile shader

		gl.compileShader(shader); // if compile failed, log error

		var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

		if (!compiled) {
			console.warn("shader not compiled!", gl.getShaderInfoLog(shader), addLineNumbers(source));
		}

		return shader;
	} // create a WebGL program


	function createWebGLProgram(gl, vertexShader, fragmentShader) {
		// create a program object
		var program = gl.createProgram(); // attach shaders to program

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader); // link vertex shader and fragment shader

		gl.linkProgram(program); // if link failed, log error

		var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

		if (!linked) {
			console.warn("program not linked!", gl.getProgramInfoLog(program));
		}

		return program;
	} // extract attributes


	function extractAttributes(gl, program) {
		var attributes = {};
		var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

		for (var i = 0; i < totalAttributes; i++) {
			var attribData = gl.getActiveAttrib(program, i);
			var name = attribData.name;
			var attribute = new WebGLAttribute(gl, program, attribData);
			attributes[name] = attribute;
		}

		return attributes;
	}

	var programIdCount = 0; // WebGL Program Class

	function WebGLProgram(gl, vshader, fshader) {
		this.id = programIdCount++;
		this.usedTimes = 1;
		this.code = "";
		this.gl = gl; // vertex shader source

		this.vshaderSource = vshader; // fragment shader source

		this.fshaderSource = fshader; // WebGL vertex shader

		var vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource); // WebGL fragment shader

		var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource); // program

		this.program = createWebGLProgram(gl, vertexShader, fragmentShader);
		this.uniforms = new WebGLUniforms(gl, this.program);
		this.attributes = extractAttributes(gl, this.program); // here we can delete shaders,
		// according to the documentation: https://www.opengl.org/sdk/docs/man/html/glLinkProgram.xhtml

		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
	}

	WebGLProgram.prototype.dispose = function () {
		this.gl.deleteProgram(this.program);
		this.program = undefined;
	};

	var alphaTest_frag = "#ifdef ALPHATEST\n\tif ( outColor.a < ALPHATEST ) {\n\t\tdiscard;\n\t} else {\n\t\toutColor.a = u_Opacity;\n\t}\n#endif";

	var ambientlight_pars_frag = "uniform vec3 u_AmbientLightColor;";

	var aoMap_pars_frag = "#ifdef USE_AOMAP\n\tuniform sampler2D aoMap;\n\tuniform float aoMapIntensity;\n#endif";

	var begin_frag = "vec4 outColor = vec4(u_Color, u_Opacity);";

	var begin_vert = "vec3 transformed = vec3(a_Position);\nvec3 objectNormal = vec3(a_Normal);\n#ifdef USE_TANGENT\n		vec3 objectTangent = vec3(a_Tangent.xyz);\n#endif";

	var bsdfs = "\nvec4 BRDF_Diffuse_Lambert(vec4 diffuseColor) {\n		return RECIPROCAL_PI * diffuseColor;\n}\nvec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {\n\tfloat fresnel = pow( 1.0 - dotLH, 5.0 );\n\treturn ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nfloat G_BlinnPhong_Implicit( ) {\n\treturn 0.25;\n}\nvec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {\n		vec3 H = normalize(L + V);\n		float dotNH = saturate(dot(N, H));\n		float dotLH = saturate(dot(L, H));\n		vec4 F = F_Schlick(specularColor, dotLH);\n		float G = G_BlinnPhong_Implicit( );\n		float D = D_BlinnPhong(shininess, dotNH);\n		return F * G * D;\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\tfloat a2 = pow2( alpha );\n\tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n\treturn RECIPROCAL_PI * a2 / pow2( denom );\n}\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\tfloat gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\treturn 1.0 / ( gl * gv );\n}\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\treturn 0.5 / max( gv + gl, EPSILON );\n}\nvec4 BRDF_Specular_GGX(vec4 specularColor, vec3 N, vec3 L, vec3 V, float roughness) {\n\tfloat alpha = pow2( roughness );\n\tvec3 H = normalize(L + V);\n\tfloat dotNL = saturate( dot(N, L) );\n\tfloat dotNV = saturate( dot(N, V) );\n\tfloat dotNH = saturate( dot(N, H) );\n\tfloat dotLH = saturate( dot(L, H) );\n\tvec4 F = F_Schlick( specularColor, dotLH );\n\tfloat G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\tfloat D = D_GGX( alpha, dotNH );\n\treturn F * G * D;\n}\nvec4 BRDF_Specular_GGX_Environment( const in vec3 N, const in vec3 V, const in vec4 specularColor, const in float roughness ) {\n\tfloat dotNV = saturate( dot( N, V ) );\n\tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\tvec4 r = roughness * c0 + c1;\n\tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\tvec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n\treturn specularColor * AB.x + AB.y;\n}\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n\treturn ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n\treturn sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}";

	var bumpMap_pars_frag = "#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd(vec2 uv) {\n\t\tvec2 dSTdx = dFdx( uv );\n\t\tvec2 dSTdy = dFdy( uv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, uv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\n\t\tvec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );\n\t\tvec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tfDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif";

	var clippingPlanes_frag = "#if NUM_CLIPPING_PLANES > 0\n		vec4 plane;\n		#pragma unroll_loop\n		for ( int i = 0; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				if ( dot( -v_modelPos, plane.xyz ) > plane.w ) discard;\n		}\n#endif";

	var clippingPlanes_pars_frag = "#if NUM_CLIPPING_PLANES > 0\n		uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif";

	var color_frag = "#ifdef USE_VCOLOR_RGB\n		outColor.rgb *= v_Color;\n#endif\n#ifdef USE_VCOLOR_RGBA\n		outColor *= v_Color;\n#endif";

	var color_pars_frag = "#ifdef USE_VCOLOR_RGB\n		varying vec3 v_Color;\n#endif\n#ifdef USE_VCOLOR_RGBA\n		varying vec4 v_Color;\n#endif";

	var color_pars_vert = "#ifdef USE_VCOLOR_RGB\n		attribute vec3 a_Color;\n		varying vec3 v_Color;\n#endif\n#ifdef USE_VCOLOR_RGBA\n		attribute vec4 a_Color;\n		varying vec4 v_Color;\n#endif";

	var color_vert = "#if defined(USE_VCOLOR_RGB) || defined(USE_VCOLOR_RGBA)\n		v_Color = a_Color;\n#endif";

	var common_frag = "uniform mat4 u_View;\nuniform float u_Opacity;\nuniform vec3 u_Color;\nuniform vec3 u_CameraPosition;";

	var common_vert = "attribute vec3 a_Position;\nattribute vec3 a_Normal;\n#ifdef USE_TANGENT\n\tattribute vec4 a_Tangent;\n#endif\n#include <transpose>\n#include <inverse>\nuniform mat4 u_Projection;\nuniform mat4 u_View;\nuniform mat4 u_Model;\nuniform vec3 u_CameraPosition;\n#ifdef USE_MORPHTARGETS\n		attribute vec3 morphTarget0;\n		attribute vec3 morphTarget1;\n		attribute vec3 morphTarget2;\n		attribute vec3 morphTarget3;\n		#ifdef USE_MORPHNORMALS\n		\tattribute vec3 morphNormal0;\n		\tattribute vec3 morphNormal1;\n		\tattribute vec3 morphNormal2;\n		\tattribute vec3 morphNormal3;\n		#else\n		\tattribute vec3 morphTarget4;\n		\tattribute vec3 morphTarget5;\n		\tattribute vec3 morphTarget6;\n		\tattribute vec3 morphTarget7;\n		#endif\n#endif";

	var diffuseMap_frag = "#ifdef USE_DIFFUSE_MAP\n		#if (USE_DIFFUSE_MAP == 1)\n				vec4 texelColor = texture2D( diffuseMap, v_Uv );\n		#elif (USE_DIFFUSE_MAP == 2)\n				vec4 texelColor = texture2D( diffuseMap, v_Uv2 );\n		#else \n				vec4 texelColor = texture2D( diffuseMap, v_Uv );\n		#endif\n		\n		texelColor = mapTexelToLinear( texelColor );\n		outColor *= texelColor;\n#endif";

	var diffuseMap_pars_frag = "#ifdef USE_DIFFUSE_MAP\n		uniform sampler2D diffuseMap;\n#endif";

	var directlight_pars_frag = "struct DirectLight\n{\n		vec3 direction;\n		vec4 color;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n};\nuniform DirectLight u_Directional[NUM_DIR_LIGHTS];";

	var emissiveMap_frag = "#ifdef USE_EMISSIVEMAP\n\t#if (USE_EMISSIVEMAP == 1)\n\t\tvec4 emissiveColor = texture2D(emissiveMap, v_Uv);\n\t#elif (USE_EMISSIVEMAP == 2)\n				vec4 emissiveColor = texture2D(emissiveMap, v_Uv2);\n		#else \n				vec4 emissiveColor = texture2D(emissiveMap, v_Uv);\n		#endif\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n#endif";

	var emissiveMap_pars_frag = "#ifdef USE_EMISSIVEMAP\n\tuniform sampler2D emissiveMap;\n#endif";

	var encodings_frag = "gl_FragColor = linearToOutputTexel( gl_FragColor );";

	var encodings_pars_frag = "\nvec4 LinearToLinear( in vec4 value ) {\n\treturn value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n\treturn vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n\tfloat maxComponent = max( max( value.r, value.g ), value.b );\n\tfloat fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n\treturn vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.xyz * value.w * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat M			= clamp( maxRGB / maxRange, 0.0, 1.0 );\n\tM						= ceil( M * 255.0 ) / 255.0;\n\treturn vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat D			= max( maxRange / maxRGB, 1.0 );\n\tD						= min( floor( D ) / 255.0, 1.0 );\n\treturn vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value )	{\n\tvec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n\tXp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n\tvec4 vResult;\n\tvResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n\tfloat Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n\tvResult.w = fract(Le);\n\tvResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n\treturn vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n\tfloat Le = value.z * 255.0 + value.w;\n\tvec3 Xp_Y_XYZp;\n\tXp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n\tXp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n\tXp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n\tvec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n\treturn vec4( max(vRGB, 0.0), 1.0 );\n}";

	var end_frag = "gl_FragColor = outColor;";

	var envMap_frag = "#ifdef USE_ENV_MAP\n		vec3 envDir;\n		#if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\n				envDir = reflect(normalize(v_worldPos - u_CameraPosition), N);\n		#else\n				envDir = v_EnvPos;\n		#endif\n		vec4 envColor = textureCube(envMap, envDir);\n		envColor = envMapTexelToLinear( envColor );\n		#ifdef ENVMAP_BLENDING_MULTIPLY\n\t\toutColor = mix(outColor, envColor * outColor, u_EnvMap_Intensity);\n\t#elif defined( ENVMAP_BLENDING_MIX )\n\t\toutColor = mix(outColor, envColor, u_EnvMap_Intensity);\n\t#elif defined( ENVMAP_BLENDING_ADD )\n\t\toutColor += envColor * u_EnvMap_Intensity;\n\t#endif\n#endif";

	var envMap_pars_frag = "#ifdef USE_ENV_MAP\n		#if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\n				varying vec3 v_worldPos;\n		#else\n				varying vec3 v_EnvPos;\n		#endif\n		uniform samplerCube envMap;\n		uniform float u_EnvMap_Intensity;\n		uniform int maxMipLevel;\n#endif";

	var envMap_pars_vert = "#ifdef USE_ENV_MAP\n		#if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\n				varying vec3 v_worldPos;\n		#else\n				varying vec3 v_EnvPos;\n		#endif\n#endif";

	var envMap_vert = "#ifdef USE_ENV_MAP\n		#if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\n				v_worldPos = (u_Model * vec4(transformed, 1.0)).xyz;\n		#else\n				v_EnvPos = reflect(normalize((u_Model * vec4(transformed, 1.0)).xyz - u_CameraPosition), (transposeMat4(inverseMat4(u_Model)) * vec4(objectNormal, 1.0)).xyz);\n		#endif\n#endif";

	var fog_frag = "#ifdef USE_FOG\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n		#ifdef USE_EXP2_FOG\n				float fogFactor = whiteCompliment( exp2( - u_FogDensity * u_FogDensity * depth * depth * LOG2 ) );\n		#else\n				float fogFactor = smoothstep( u_FogNear, u_FogFar, depth );\n		#endif\n		gl_FragColor.rgb = mix( gl_FragColor.rgb, u_FogColor, fogFactor );\n#endif";

	var fog_pars_frag = "#ifdef USE_FOG\n		uniform vec3 u_FogColor;\n		#ifdef USE_EXP2_FOG\n				uniform float u_FogDensity;\n		#else\n				uniform float u_FogNear;\n				uniform float u_FogFar;\n		#endif\n#endif";

	var inverse = "mat4 inverseMat4(mat4 m) {\n		float\n		a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n		a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n		a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n		a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n		b00 = a00 * a11 - a01 * a10,\n		b01 = a00 * a12 - a02 * a10,\n		b02 = a00 * a13 - a03 * a10,\n		b03 = a01 * a12 - a02 * a11,\n		b04 = a01 * a13 - a03 * a11,\n		b05 = a02 * a13 - a03 * a12,\n		b06 = a20 * a31 - a21 * a30,\n		b07 = a20 * a32 - a22 * a30,\n		b08 = a20 * a33 - a23 * a30,\n		b09 = a21 * a32 - a22 * a31,\n		b10 = a21 * a33 - a23 * a31,\n		b11 = a22 * a33 - a23 * a32,\n		det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n		return mat4(\n				a11 * b11 - a12 * b10 + a13 * b09,\n				a02 * b10 - a01 * b11 - a03 * b09,\n				a31 * b05 - a32 * b04 + a33 * b03,\n				a22 * b04 - a21 * b05 - a23 * b03,\n				a12 * b08 - a10 * b11 - a13 * b07,\n				a00 * b11 - a02 * b08 + a03 * b07,\n				a32 * b02 - a30 * b05 - a33 * b01,\n				a20 * b05 - a22 * b02 + a23 * b01,\n				a10 * b10 - a11 * b08 + a13 * b06,\n				a01 * b08 - a00 * b10 - a03 * b06,\n				a30 * b04 - a31 * b02 + a33 * b00,\n				a21 * b02 - a20 * b04 - a23 * b00,\n				a11 * b07 - a10 * b09 - a12 * b06,\n				a00 * b09 - a01 * b07 + a02 * b06,\n				a31 * b01 - a30 * b03 - a32 * b00,\n				a20 * b03 - a21 * b01 + a22 * b00) / det;\n}";

	var light_frag = "#ifdef USE_LIGHT\n		vec4 light;\n		vec3 L;\n		vec4 totalReflect = vec4(0., 0., 0., 0.);\n		vec3 indirectIrradiance = vec3(0., 0., 0.);		vec3 indirectRadiance = vec3(0., 0., 0.);\n		#ifdef USE_PBR\n				#ifdef USE_PBR2\n						vec4 diffuseColor = outColor.xyzw;\n						vec4 specularColor = vec4(specularFactor.rgb, 1.);\n\t\t\tfloat roughness = clamp(1.0 - glossinessFactor, 0.04, 1.0);\n				 #else\n						vec4 diffuseColor = outColor.xyzw * (1.0 - metalnessFactor);\n						vec4 specularColor = mix(vec4(0.04), outColor.xyzw, metalnessFactor);\n						float roughness = clamp(roughnessFactor, 0.04, 1.0);\n				 #endif\n		#else\n				vec4 diffuseColor = outColor.xyzw;\n				#ifdef USE_PHONG\n						vec4 specularColor = vec4(u_SpecularColor, 1.);\n						float shininess = u_Specular;\n				#endif\n		#endif\n		#ifdef USE_AMBIENT_LIGHT\n				indirectIrradiance += u_AmbientLightColor;\n		#endif\n		#ifdef USE_PBR\n				#ifdef USE_ENV_MAP\n		\t\tvec3 envDir;\n		\t		#if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\n		\t				envDir = reflect(normalize(v_worldPos - u_CameraPosition), N);\n		\t		#else\n		\t				envDir = v_EnvPos;\n		\t		#endif\n						indirectIrradiance += getLightProbeIndirectIrradiance(maxMipLevel, envDir);\n						indirectRadiance += getLightProbeIndirectRadiance(GGXRoughnessToBlinnExponent(roughness), maxMipLevel, envDir);\n		\t#endif\n		#endif\n		#if (defined(USE_PHONG) || defined(USE_PBR))\n				vec3 V = normalize( u_CameraPosition - v_modelPos );\n		#endif\n		float dotNL;\n		vec4 irradiance;\n		vec4 reflectLight;\n		float dist;\n		#if NUM_DIR_LIGHTS > 0\n				#pragma unroll_loop\n				for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n						L = -u_Directional[ i ].direction;\n						light = u_Directional[ i ].color;\n						L = normalize(L);\n						dotNL = saturate( dot(N, L) );\n						irradiance = light * dotNL;\n						#if NUM_DIR_SHADOWS > 0\n								#ifdef USE_PCSS_SOFT_SHADOW\n										irradiance *= bool( u_Directional[ i ].shadow ) ? getShadowWithPCSS( directionalDepthMap[ i ], directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[ i ].shadowBias, u_Directional[ i ].shadowRadius, u_Directional[ i ].shadowMapSize ) : 1.0;\n								#else\n										irradiance *= bool( u_Directional[ i ].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[ i ].shadowBias, u_Directional[ i ].shadowRadius, u_Directional[ i ].shadowMapSize ) : 1.0;\n								#endif\n						#endif\n						reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n						#ifdef USE_PHONG\n								reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;\n						#endif\n						#ifdef USE_PBR\n								reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness);\n						#endif\n						totalReflect += reflectLight;\n				}\n		#endif\n		#if NUM_POINT_LIGHTS > 0\n				vec3 worldV;\n				#pragma unroll_loop\n				for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n						L = u_Point[ i ].position - v_modelPos;\n						dist = pow(clamp(1. - length(L) / u_Point[ i ].distance, 0.0, 1.0), u_Point[ i ].decay);\n						light = u_Point[ i ].color * dist;\n						L = normalize(L);\n						dotNL = saturate( dot(N, L) );\n						irradiance = light * dotNL;\n						#if NUM_POINT_SHADOWS > 0\n								worldV = v_modelPos - u_Point[ i ].position;\n								irradiance *= bool( u_Point[ i ].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV, u_Point[ i ].shadowBias, u_Point[ i ].shadowRadius, u_Point[ i ].shadowMapSize, u_Point[ i ].shadowCameraNear, u_Point[ i ].shadowCameraFar ) : 1.0;\n						#endif\n						reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n						#ifdef USE_PHONG\n								reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;\n						#endif\n						#ifdef USE_PBR\n								reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness);\n						#endif\n						totalReflect += reflectLight;\n				}\n		#endif\n		#if NUM_SPOT_LIGHTS > 0\n				float lightDistance;\n				float angleCos;\n				float spotEffect;\n				#pragma unroll_loop\n				for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n						L = u_Spot[ i ].position - v_modelPos;\n						lightDistance = length(L);\n						L = normalize(L);\n						angleCos = dot( L, -normalize(u_Spot[ i ].direction) );\n						if( all( bvec2(angleCos > u_Spot[ i ].coneCos, lightDistance < u_Spot[ i ].distance) ) ) {\n								spotEffect = smoothstep( u_Spot[ i ].coneCos, u_Spot[ i ].penumbraCos, angleCos );\n								dist = pow(clamp(1. - lightDistance / u_Spot[ i ].distance, 0.0, 1.0), u_Spot[ i ].decay);\n								light = u_Spot[ i ].color * dist * spotEffect;\n								dotNL = saturate( dot(N, L) );\n								irradiance = light * dotNL;\n								#if NUM_SPOT_SHADOWS > 0\n										#ifdef USE_PCSS_SOFT_SHADOW\n												irradiance *= bool( u_Spot[ i ].shadow ) ? getShadowWithPCSS( spotDepthMap[ i ], spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[ i ].shadowBias, u_Spot[ i ].shadowRadius, u_Spot[ i ].shadowMapSize ) : 1.0;\n										#else\n												irradiance *= bool( u_Spot[ i ].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[ i ].shadowBias, u_Spot[ i ].shadowRadius, u_Spot[ i ].shadowMapSize ) : 1.0;\n										#endif\n								#endif\n								reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n								#ifdef USE_PHONG\n										reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;\n								#endif\n								#ifdef USE_PBR\n										reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness);\n								#endif\n								totalReflect += reflectLight;\n						}\n				}\n		#endif\n		vec3 indirectDiffuse = indirectIrradiance * BRDF_Diffuse_Lambert(diffuseColor).rgb;\n		vec3 indirectSpecular = vec3(0., 0., 0.);\n		#if defined( USE_ENV_MAP ) && defined( USE_PBR )\n				indirectSpecular += indirectRadiance * BRDF_Specular_GGX_Environment(N, V, specularColor, roughness).rgb;\n		#endif\n		#ifdef USE_AOMAP\n				#if (USE_AOMAP == 1)\n		\t		float ambientOcclusion = ( texture2D( aoMap, v_Uv ).r - 1.0 ) * aoMapIntensity + 1.0;\n				#elif (USE_AOMAP == 2)\n						float ambientOcclusion = ( texture2D( aoMap, v_Uv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n				#else\n						float ambientOcclusion = ( texture2D( aoMap, v_Uv ).r - 1.0 ) * aoMapIntensity + 1.0;\n				#endif\n		\t\n		\tindirectDiffuse *= ambientOcclusion;\n		\t#if defined( USE_ENV_MAP ) && defined( USE_PBR )\n		\t\tfloat dotNV = saturate( dot( N, V ) );\n		\t\tindirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, GGXRoughnessToBlinnExponent(roughness) );\n		\t#endif\n		#endif\n		outColor.xyz = totalReflect.xyz + indirectDiffuse + indirectSpecular;\n#endif";

	var light_pars_frag = "#ifdef USE_AMBIENT_LIGHT\n		#include <ambientlight_pars_frag>\n#endif\n#if NUM_DIR_LIGHTS > 0\n		#include <directlight_pars_frag>\n#endif\n#if NUM_POINT_LIGHTS > 0\n		#include <pointlight_pars_frag>\n#endif\n#if NUM_SPOT_LIGHTS > 0\n		#include <spotlight_pars_frag>\n#endif\n#if defined(USE_PBR) && defined(USE_ENV_MAP)\n		vec3 getLightProbeIndirectIrradiance(const in int maxMIPLevel, const in vec3 envDir) {\n		\t#ifdef TEXTURE_LOD_EXT\n		\t\tvec4 envMapColor = textureCubeLodEXT( envMap, envDir, float( maxMIPLevel ) );\n		\t#else\n		\t\tvec4 envMapColor = textureCube( envMap, envDir, float( maxMIPLevel ) );\n		\t#endif\n				envMapColor = envMapTexelToLinear( envMapColor );\n				return PI * envMapColor.rgb * u_EnvMap_Intensity;\n		}\n		float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\n		\tfloat maxMIPLevelScalar = float( maxMIPLevel );\n		\tfloat desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n		\treturn clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n		}\n		vec3 getLightProbeIndirectRadiance(const in float blinnShininessExponent, const in int maxMIPLevel, const in vec3 envDir) {\n				float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\n				#ifdef TEXTURE_LOD_EXT\n		\t\tvec4 envMapColor = textureCubeLodEXT( envMap, envDir, specularMIPLevel );\n		\t#else\n		\t\tvec4 envMapColor = textureCube( envMap, envDir, specularMIPLevel );\n		\t#endif\n				envMapColor = envMapTexelToLinear( envMapColor );\n				return envMapColor.rgb * u_EnvMap_Intensity;\n		}\n		float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n		\treturn saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n		}\n#endif";

	var alphamap_pars_frag = "#ifdef USE_ALPHA_MAP\n\tuniform sampler2D alphaMap;\n#endif";

	var alphamap_frag = "#ifdef USE_ALPHA_MAP\n\t#ifdef USE_ALPHA_MAP_UV_TRANSFORM\n\t\toutColor.a *= texture2D(alphaMap, vAlphaMapUV).g;\n\t#else\n\t\t#if (USE_ALPHA_MAP == 1)\n\t\t\toutColor.a *= texture2D(alphaMap, v_Uv).g;\n\t\t#elif (USE_ALPHA_MAP == 2)\n						outColor.a *= texture2D(alphaMap, v_Uv2).g;\n\t\t#else\n						outColor.a *= texture2D(alphaMap, v_Uv).g;\n				#endif\n\t#endif\n#endif";

	var normalMap_pars_frag = "#if !defined(USE_TANGENT) || defined(FLAT_SHADED)\n		#include <tsn>\n#endif\nuniform sampler2D normalMap;";

	var normal_frag = "#ifdef FLAT_SHADED\n		vec3 fdx = vec3( dFdx( v_modelPos.x ), dFdx( v_modelPos.y ), dFdx( v_modelPos.z ) );\n		vec3 fdy = vec3( dFdy( v_modelPos.x ), dFdy( v_modelPos.y ), dFdy( v_modelPos.z ) );\n		vec3 N = normalize( cross( fdx, fdy ) );\n#else\n		vec3 N = normalize(v_Normal);\n		#ifdef DOUBLE_SIDED\n				N = N * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n		#endif	\n#endif\n#ifdef USE_NORMAL_MAP\n		vec3 mapN = texture2D(normalMap, v_Uv).rgb * 2.0 - 1.0;\n		#if defined(USE_TANGENT) && !defined(FLAT_SHADED)\n				vec3 tangent = normalize(v_Tangent);\n				vec3 bitangent = normalize(v_Bitangent);\n				#ifdef DOUBLE_SIDED\n						tangent = tangent * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n						bitangent = bitangent * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n				#endif	\n				mat3 tspace = mat3(tangent, bitangent, N);\n		#else\n				mat3 tspace = tsn(N, v_modelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));\n				mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n		#endif\n		N = normalize(tspace * mapN);\n#elif defined(USE_BUMPMAP)\n		N = perturbNormalArb(v_modelPos, N, dHdxy_fwd(v_Uv));\n#endif";

	var normal_pars_frag = "#ifndef FLAT_SHADED\n		varying vec3 v_Normal;\n		#ifdef USE_TANGENT\n				varying vec3 v_Tangent;\n\t\tvarying vec3 v_Bitangent;\n		#endif\n#endif";

	var normal_pars_vert = "#ifndef FLAT_SHADED\n		varying vec3 v_Normal;\n		#ifdef USE_TANGENT\n				varying vec3 v_Tangent;\n\t\tvarying vec3 v_Bitangent;\n		#endif\n#endif";

	var normal_vert = "#ifndef FLAT_SHADED\n		v_Normal = (transposeMat4(inverseMat4(u_Model)) * vec4(objectNormal, 0.0)).xyz;\n		#ifdef FLIP_SIDED\n		\tv_Normal = - v_Normal;\n		#endif\n		#ifdef USE_TANGENT\n				v_Tangent = (transposeMat4(inverseMat4(u_Model)) * vec4(objectTangent, 0.0)).xyz;\n				#ifdef FLIP_SIDED\n						v_Tangent = - v_Tangent;\n				#endif\n				v_Bitangent = normalize(cross(v_Normal, v_Tangent) * a_Tangent.w);\n		#endif\n#endif";

	var packing = "const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,	256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n		vec4 r = vec4( fract( v * PackFactors ), v );\n		r.yzw -= r.xyz * ShiftRight8;		return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n		return dot( v, UnpackFactors );\n}";

	var pointlight_pars_frag = "struct PointLight\n{\n		vec3 position;\n		vec4 color;\n		float distance;\n		float decay;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n		float shadowCameraNear;\n		float shadowCameraFar;\n};\nuniform PointLight u_Point[NUM_POINT_LIGHTS];";

	var premultipliedAlpha_frag = "#ifdef USE_PREMULTIPLIED_ALPHA\n		gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;\n#endif";

	var pvm_vert = "gl_Position = u_Projection * u_View * u_Model * vec4(transformed, 1.0);";

	var dithering_frag = "#if defined( DITHERING )\n\tgl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif";

	var dithering_pars_frag = "#if defined( DITHERING )\n\tvec3 dithering( vec3 color ) {\n\t\tfloat grid_position = rand( gl_FragCoord.xy );\n\t\tvec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n\t\tdither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n\t\treturn color + dither_shift_RGB;\n\t}\n#endif";

	var shadow = "#ifdef USE_SHADOW_SAMPLER\n		float computeShadow(sampler2DShadow shadowMap, vec3 shadowCoord) {\n				return texture2D( shadowMap, shadowCoord );\n		}\n#else\n		float computeShadow(sampler2D shadowMap, vec3 shadowCoord) {\n				return step( shadowCoord.z, unpackRGBAToDepth( texture2D( shadowMap, shadowCoord.xy ) ) );\n		}\n#endif\nfloat computeShadowWithPoissonSampling( sampler2DShadow shadowMap, vec3 shadowCoord, float texelSize ) {\n		vec3 poissonDisk[4];\n		poissonDisk[0] = vec3(-0.94201624, -0.39906216, 0);\n		poissonDisk[1] = vec3(0.94558609, -0.76890725, 0);\n		poissonDisk[2] = vec3(-0.094184101, -0.92938870, 0);\n		poissonDisk[3] = vec3(0.34495938, 0.29387760, 0);\n		return computeShadow( shadowMap, shadowCoord + poissonDisk[0] * texelSize ) * 0.25 +\n				computeShadow( shadowMap, shadowCoord + poissonDisk[1] * texelSize ) * 0.25 +\n				computeShadow( shadowMap, shadowCoord + poissonDisk[2] * texelSize ) * 0.25 +\n				computeShadow( shadowMap, shadowCoord + poissonDisk[3] * texelSize ) * 0.25;\n}\nfloat computeShadowWithPCF1(sampler2DShadow shadowSampler, vec3 shadowCoord) {\n		return computeShadow(shadowSampler, shadowCoord);\n}\nfloat computeShadowWithPCF3(sampler2DShadow shadowSampler, vec3 shadowCoord, vec2 shadowMapSizeAndInverse) {\n		vec2 uv = shadowCoord.xy * shadowMapSizeAndInverse.x;		uv += 0.5;		vec2 st = fract(uv);		vec2 base_uv = floor(uv) - 0.5;		base_uv *= shadowMapSizeAndInverse.y;\n		vec2 uvw0 = 3. - 2. * st;\n		vec2 uvw1 = 1. + 2. * st;\n		vec2 u = vec2((2. - st.x) / uvw0.x - 1., st.x / uvw1.x + 1.) * shadowMapSizeAndInverse.y;\n		vec2 v = vec2((2. - st.y) / uvw0.y - 1., st.y / uvw1.y + 1.) * shadowMapSizeAndInverse.y;\n		float shadow = 0.;\n		shadow += uvw0.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[0]), shadowCoord.z));\n		shadow += uvw1.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[0]), shadowCoord.z));\n		shadow += uvw0.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[1]), shadowCoord.z));\n		shadow += uvw1.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[1]), shadowCoord.z));\n		shadow = shadow / 16.;\n		return shadow;\n}\nfloat computeShadowWithPCF5(sampler2DShadow shadowSampler, vec3 shadowCoord, vec2 shadowMapSizeAndInverse) {\n		vec2 uv = shadowCoord.xy * shadowMapSizeAndInverse.x;		uv += 0.5;		vec2 st = fract(uv);		vec2 base_uv = floor(uv) - 0.5;		base_uv *= shadowMapSizeAndInverse.y;\n		vec2 uvw0 = 4. - 3. * st;\n		vec2 uvw1 = vec2(7.);\n		vec2 uvw2 = 1. + 3. * st;\n		vec3 u = vec3((3. - 2. * st.x) / uvw0.x - 2., (3. + st.x) / uvw1.x, st.x / uvw2.x + 2.) * shadowMapSizeAndInverse.y;\n		vec3 v = vec3((3. - 2. * st.y) / uvw0.y - 2., (3. + st.y) / uvw1.y, st.y / uvw2.y + 2.) * shadowMapSizeAndInverse.y;\n		float shadow = 0.;\n		shadow += uvw0.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[0]), shadowCoord.z));\n		shadow += uvw1.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[0]), shadowCoord.z));\n		shadow += uvw2.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[0]), shadowCoord.z));\n		shadow += uvw0.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[1]), shadowCoord.z));\n		shadow += uvw1.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[1]), shadowCoord.z));\n		shadow += uvw2.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[1]), shadowCoord.z));\n		shadow += uvw0.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[2]), shadowCoord.z));\n		shadow += uvw1.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[2]), shadowCoord.z));\n		shadow += uvw2.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[2]), shadowCoord.z));\n		shadow = shadow / 144.;\n		return shadow;\n}\nfloat getShadow( sampler2DShadow shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n		shadowCoord.xyz /= shadowCoord.w;\n		shadowCoord.z += shadowBias;\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n		bool frustumTest = all( frustumTestVec );\n		if ( frustumTest ) {\n				#ifdef USE_HARD_SHADOW\n						return computeShadow(shadowMap, shadowCoord.xyz);\n				#else\n						#ifdef USE_PCF3_SOFT_SHADOW\n								vec2 shadowMapSizeAndInverse = vec2(shadowMapSize.x, 1. / shadowMapSize.x);\n								return computeShadowWithPCF3(shadowMap, shadowCoord.xyz, shadowMapSizeAndInverse);\n						#else\n								#ifdef USE_PCF5_SOFT_SHADOW\n										vec2 shadowMapSizeAndInverse = vec2(shadowMapSize.x, 1. / shadowMapSize.x);\n										return computeShadowWithPCF5(shadowMap, shadowCoord.xyz, shadowMapSizeAndInverse);\n								#else\n										float texelSize = shadowRadius / shadowMapSize.x;\n										return computeShadowWithPoissonSampling(shadowMap, shadowCoord.xyz, texelSize);\n								#endif\n						#endif\n				#endif\n		}\n		return 1.0;\n}\nfloat textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {\n		return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );\n}\nfloat getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize, float shadowCameraNear, float shadowCameraFar ) {\n		float depth = ( length( V ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		depth += shadowBias;\n		#ifdef USE_HARD_SHADOW\n				return textureCubeCompare( shadowMap, normalize(V), depth);\n		#else\n				float texelSize = shadowRadius / shadowMapSize.x;\n				vec3 poissonDisk[4];\n				poissonDisk[0] = vec3(-1.0, 1.0, -1.0);\n				poissonDisk[1] = vec3(1.0, -1.0, -1.0);\n				poissonDisk[2] = vec3(-1.0, -1.0, -1.0);\n				poissonDisk[3] = vec3(1.0, -1.0, 1.0);\n				return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +\n						textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +\n						textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +\n						textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;\n		#endif\n}\n#ifdef USE_PCSS_SOFT_SHADOW\n		const vec3 PoissonSamplers32[64] = vec3[64](\n				vec3(0.06407013, 0.05409927, 0.),\n				vec3(0.7366577, 0.5789394, 0.),\n				vec3(-0.6270542, -0.5320278, 0.),\n				vec3(-0.4096107, 0.8411095, 0.),\n				vec3(0.6849564, -0.4990818, 0.),\n				vec3(-0.874181, -0.04579735, 0.),\n				vec3(0.9989998, 0.0009880066, 0.),\n				vec3(-0.004920578, -0.9151649, 0.),\n				vec3(0.1805763, 0.9747483, 0.),\n				vec3(-0.2138451, 0.2635818, 0.),\n				vec3(0.109845, 0.3884785, 0.),\n				vec3(0.06876755, -0.3581074, 0.),\n				vec3(0.374073, -0.7661266, 0.),\n				vec3(0.3079132, -0.1216763, 0.),\n				vec3(-0.3794335, -0.8271583, 0.),\n				vec3(-0.203878, -0.07715034, 0.),\n				vec3(0.5912697, 0.1469799, 0.),\n				vec3(-0.88069, 0.3031784, 0.),\n				vec3(0.5040108, 0.8283722, 0.),\n				vec3(-0.5844124, 0.5494877, 0.),\n				vec3(0.6017799, -0.1726654, 0.),\n				vec3(-0.5554981, 0.1559997, 0.),\n				vec3(-0.3016369, -0.3900928, 0.),\n				vec3(-0.5550632, -0.1723762, 0.),\n				vec3(0.925029, 0.2995041, 0.),\n				vec3(-0.2473137, 0.5538505, 0.),\n				vec3(0.9183037, -0.2862392, 0.),\n				vec3(0.2469421, 0.6718712, 0.),\n				vec3(0.3916397, -0.4328209, 0.),\n				vec3(-0.03576927, -0.6220032, 0.),\n				vec3(-0.04661255, 0.7995201, 0.),\n				vec3(0.4402924, 0.3640312, 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.),\n				vec3(0., 0., 0.)\n		);\n		const vec3 PoissonSamplers64[64] = vec3[64](\n				vec3(-0.613392, 0.617481, 0.),\n				vec3(0.170019, -0.040254, 0.),\n				vec3(-0.299417, 0.791925, 0.),\n				vec3(0.645680, 0.493210, 0.),\n				vec3(-0.651784, 0.717887, 0.),\n				vec3(0.421003, 0.027070, 0.),\n				vec3(-0.817194, -0.271096, 0.),\n				vec3(-0.705374, -0.668203, 0.),\n				vec3(0.977050, -0.108615, 0.),\n				vec3(0.063326, 0.142369, 0.),\n				vec3(0.203528, 0.214331, 0.),\n				vec3(-0.667531, 0.326090, 0.),\n				vec3(-0.098422, -0.295755, 0.),\n				vec3(-0.885922, 0.215369, 0.),\n				vec3(0.566637, 0.605213, 0.),\n				vec3(0.039766, -0.396100, 0.),\n				vec3(0.751946, 0.453352, 0.),\n				vec3(0.078707, -0.715323, 0.),\n				vec3(-0.075838, -0.529344, 0.),\n				vec3(0.724479, -0.580798, 0.),\n				vec3(0.222999, -0.215125, 0.),\n				vec3(-0.467574, -0.405438, 0.),\n				vec3(-0.248268, -0.814753, 0.),\n				vec3(0.354411, -0.887570, 0.),\n				vec3(0.175817, 0.382366, 0.),\n				vec3(0.487472, -0.063082, 0.),\n				vec3(-0.084078, 0.898312, 0.),\n				vec3(0.488876, -0.783441, 0.),\n				vec3(0.470016, 0.217933, 0.),\n				vec3(-0.696890, -0.549791, 0.),\n				vec3(-0.149693, 0.605762, 0.),\n				vec3(0.034211, 0.979980, 0.),\n				vec3(0.503098, -0.308878, 0.),\n				vec3(-0.016205, -0.872921, 0.),\n				vec3(0.385784, -0.393902, 0.),\n				vec3(-0.146886, -0.859249, 0.),\n				vec3(0.643361, 0.164098, 0.),\n				vec3(0.634388, -0.049471, 0.),\n				vec3(-0.688894, 0.007843, 0.),\n				vec3(0.464034, -0.188818, 0.),\n				vec3(-0.440840, 0.137486, 0.),\n				vec3(0.364483, 0.511704, 0.),\n				vec3(0.034028, 0.325968, 0.),\n				vec3(0.099094, -0.308023, 0.),\n				vec3(0.693960, -0.366253, 0.),\n				vec3(0.678884, -0.204688, 0.),\n				vec3(0.001801, 0.780328, 0.),\n				vec3(0.145177, -0.898984, 0.),\n				vec3(0.062655, -0.611866, 0.),\n				vec3(0.315226, -0.604297, 0.),\n				vec3(-0.780145, 0.486251, 0.),\n				vec3(-0.371868, 0.882138, 0.),\n				vec3(0.200476, 0.494430, 0.),\n				vec3(-0.494552, -0.711051, 0.),\n				vec3(0.612476, 0.705252, 0.),\n				vec3(-0.578845, -0.768792, 0.),\n				vec3(-0.772454, -0.090976, 0.),\n				vec3(0.504440, 0.372295, 0.),\n				vec3(0.155736, 0.065157, 0.),\n				vec3(0.391522, 0.849605, 0.),\n				vec3(-0.620106, -0.328104, 0.),\n				vec3(0.789239, -0.419965, 0.),\n				vec3(-0.545396, 0.538133, 0.),\n				vec3(-0.178564, -0.596057, 0.)\n		);\n		float getRand(vec2 seed) {\n				return fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453);\n		}\n		float computeShadowWithPCSS(sampler2D depthSampler, sampler2DShadow shadowSampler, vec3 shadowCoord, float shadowMapSizeInverse, float lightSizeUV, int searchTapCount, int pcfTapCount, vec3[64] poissonSamplers) {\n				float depthMetric = shadowCoord.z;\n				float blockerDepth = 0.0;\n				float sumBlockerDepth = 0.0;\n				float numBlocker = 0.0;\n				for (int i = 0; i < searchTapCount; i ++) {\n						blockerDepth = unpackRGBAToDepth( texture( depthSampler, shadowCoord.xy + (lightSizeUV * shadowMapSizeInverse * PoissonSamplers32[i].xy) ) );\n						if (blockerDepth < depthMetric) {\n								sumBlockerDepth += blockerDepth;\n								numBlocker++;\n						}\n				}\n				if (numBlocker < 1.0) {\n						return 1.0;\n				}\n				float avgBlockerDepth = sumBlockerDepth / numBlocker;\n				float AAOffset = shadowMapSizeInverse * 10.;\n				float penumbraRatio = ((depthMetric - avgBlockerDepth) + AAOffset);\n				float filterRadius = penumbraRatio * lightSizeUV * shadowMapSizeInverse;\n				float random = getRand(shadowCoord.xy);				float rotationAngle = random * 3.1415926;\n				vec2 rotationVector = vec2(cos(rotationAngle), sin(rotationAngle));\n				float shadow = 0.;\n				for (int i = 0; i < pcfTapCount; i++) {\n						vec3 offset = poissonSamplers[i];\n						offset = vec3(offset.x * rotationVector.x - offset.y * rotationVector.y, offset.y * rotationVector.x + offset.x * rotationVector.y, 0.);\n						shadow += texture(shadowSampler, shadowCoord + offset * filterRadius);\n				}\n				shadow /= float(pcfTapCount);\n				shadow = mix(shadow, 1., depthMetric - avgBlockerDepth);\n				return shadow;\n		}\n		float getShadowWithPCSS( sampler2D depthSampler, sampler2DShadow shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n				shadowCoord.xyz /= shadowCoord.w;\n				shadowCoord.z += shadowBias;\n				bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n				bool inFrustum = all( inFrustumVec );\n				bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n				bool frustumTest = all( frustumTestVec );\n				if ( frustumTest ) {\n						#ifdef USE_PCSS16_SOFT_SHADOW\n								return computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 16, 16, PoissonSamplers32);\n						#else\n								#ifdef USE_PCSS32_SOFT_SHADOW\n										return computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 16, 32, PoissonSamplers32);\n								#else\n										return computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 32, 64, PoissonSamplers64);\n								#endif\n						#endif\n				}\n				return 1.0;\n		}\n#endif";

	var shadowMap_frag = "#ifdef USE_SHADOW\n#endif";

	var shadowMap_pars_frag = "#ifdef USE_SHADOW\n		#if NUM_DIR_SHADOWS > 0\n				uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHTS ];\n				varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n				#ifdef USE_PCSS_SOFT_SHADOW\n						uniform sampler2D directionalDepthMap[ NUM_DIR_LIGHTS ];\n				#endif\n		#endif\n		#if NUM_POINT_SHADOWS > 0\n				uniform samplerCube pointShadowMap[ NUM_POINT_LIGHTS ];\n		#endif\n		#if NUM_SPOT_SHADOWS > 0\n				uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHTS ];\n				varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n				#ifdef USE_PCSS_SOFT_SHADOW\n						uniform sampler2D spotDepthMap[ NUM_SPOT_LIGHTS ];\n				#endif\n		#endif\n		#include <packing>\n		#include <shadow>\n#endif";

	var shadowMap_pars_vert = "#ifdef USE_SHADOW\n		#if NUM_DIR_SHADOWS > 0\n				uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n				varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n		#endif\n		#if NUM_POINT_SHADOWS > 0\n		#endif\n		#if NUM_SPOT_SHADOWS > 0\n				uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n				varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n		#endif\n#endif";

	var shadowMap_vert = "#ifdef USE_SHADOW\n		vec4 worldPosition = u_Model * vec4(transformed, 1.0);\n		#if NUM_DIR_SHADOWS > 0\n				#pragma unroll_loop\n				for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n						vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n				}\n		#endif\n		#if NUM_POINT_SHADOWS > 0\n		#endif\n		#if NUM_SPOT_SHADOWS > 0\n				#pragma unroll_loop\n				for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n						vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n				}\n		#endif\n#endif";

	var morphnormal_vert = "#ifdef USE_MORPHNORMALS\n\tobjectNormal += morphNormal0 * morphTargetInfluences[ 0 ];\n\tobjectNormal += morphNormal1 * morphTargetInfluences[ 1 ];\n\tobjectNormal += morphNormal2 * morphTargetInfluences[ 2 ];\n\tobjectNormal += morphNormal3 * morphTargetInfluences[ 3 ];\n#endif";

	var morphtarget_pars_vert = "#ifdef USE_MORPHTARGETS\n\t#ifndef USE_MORPHNORMALS\n\tuniform float morphTargetInfluences[ 8 ];\n\t#else\n\tuniform float morphTargetInfluences[ 4 ];\n\t#endif\n#endif";

	var morphtarget_vert = "#ifdef USE_MORPHTARGETS\n\ttransformed += morphTarget0 * morphTargetInfluences[ 0 ];\n\ttransformed += morphTarget1 * morphTargetInfluences[ 1 ];\n\ttransformed += morphTarget2 * morphTargetInfluences[ 2 ];\n\ttransformed += morphTarget3 * morphTargetInfluences[ 3 ];\n\t#ifndef USE_MORPHNORMALS\n				transformed += morphTarget4 * morphTargetInfluences[ 4 ];\n				transformed += morphTarget5 * morphTargetInfluences[ 5 ];\n				transformed += morphTarget6 * morphTargetInfluences[ 6 ];\n				transformed += morphTarget7 * morphTargetInfluences[ 7 ];\n\t#endif\n#endif";

	var skinning_pars_vert = "#ifdef USE_SKINNING\n		attribute vec4 skinIndex;\n\tattribute vec4 skinWeight;\n		uniform mat4 bindMatrix;\n\tuniform mat4 bindMatrixInverse;\n		#ifdef BONE_TEXTURE\n				uniform sampler2D boneTexture;\n				uniform int boneTextureSize;\n				mat4 getBoneMatrix( const in float i ) {\n						float j = i * 4.0;\n						float x = mod( j, float( boneTextureSize ) );\n						float y = floor( j / float( boneTextureSize ) );\n						float dx = 1.0 / float( boneTextureSize );\n						float dy = 1.0 / float( boneTextureSize );\n						y = dy * ( y + 0.5 );\n						vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n						vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n						vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n						vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n						mat4 bone = mat4( v1, v2, v3, v4 );\n						return bone;\n				}\n		#else\n				uniform mat4 boneMatrices[MAX_BONES];\n				mat4 getBoneMatrix(const in float i) {\n						mat4 bone = boneMatrices[int(i)];\n						return bone;\n				}\n		#endif\n#endif";

	var skinning_vert = "#ifdef USE_SKINNING\n		mat4 boneMatX = getBoneMatrix( skinIndex.x );\n		mat4 boneMatY = getBoneMatrix( skinIndex.y );\n		mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n		mat4 boneMatW = getBoneMatrix( skinIndex.w );\n		vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);\n		vec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n\tskinned = bindMatrixInverse * skinned;\n		transformed = skinned.xyz / skinned.w;\n#endif";

	var skinnormal_vert = "#ifdef USE_SKINNING\n		mat4 skinMatrix = mat4( 0.0 );\n		skinMatrix += skinWeight.x * boneMatX;\n		skinMatrix += skinWeight.y * boneMatY;\n		skinMatrix += skinWeight.z * boneMatZ;\n		skinMatrix += skinWeight.w * boneMatW;\n		skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n		objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n		#ifdef USE_TANGENT\n\t\tobjectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\t#endif\n#endif";

	var specularMap_frag = "float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, v_Uv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif";

	var specularMap_pars_frag = "#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif";

	var spotlight_pars_frag = "struct SpotLight\n{\n		vec3 position;\n		vec4 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n		vec3 direction;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n};\nuniform SpotLight u_Spot[NUM_SPOT_LIGHTS];";

	var transpose = "mat4 transposeMat4(mat4 inMatrix) {\n		vec4 i0 = inMatrix[0];\n		vec4 i1 = inMatrix[1];\n		vec4 i2 = inMatrix[2];\n		vec4 i3 = inMatrix[3];\n		mat4 outMatrix = mat4(\n				vec4(i0.x, i1.x, i2.x, i3.x),\n				vec4(i0.y, i1.y, i2.y, i3.y),\n				vec4(i0.z, i1.z, i2.z, i3.z),\n				vec4(i0.w, i1.w, i2.w, i3.w)\n		);\n		return outMatrix;\n}";

	var tsn = "mat3 tsn(vec3 N, vec3 V, vec2 uv) {\n		vec3 q0 = vec3(dFdx(V.x), dFdx(V.y), dFdx(V.z));\n		vec3 q1 = vec3(dFdy(V.x), dFdy(V.y), dFdy(V.z));\n		vec2 st0 = dFdx( uv.st );\n		vec2 st1 = dFdy( uv.st );\n		float scale = sign( st1.t * st0.s - st0.t * st1.s );\n		vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );\n		vec3 T = normalize( ( -q0 * st1.s + q1 * st0.s ) * scale );\n		mat3 tsn = mat3( S, T, N );\n		return tsn;\n}";

	var uv_pars_frag = "#ifdef USE_UV\n		varying vec2 v_Uv;\n#endif\n#ifdef USE_UV2\n		varying vec2 v_Uv2;\n#endif\n#ifdef USE_ALPHA_MAP_UV_TRANSFORM\n		varying vec2 vAlphaMapUV;\n#endif";

	var uv_pars_vert = "#ifdef USE_UV\n		attribute vec2 a_Uv;\n		varying vec2 v_Uv;\n		uniform mat3 uvTransform;\n#endif\n#ifdef USE_UV2\n		attribute vec2 a_Uv2;\n		varying vec2 v_Uv2;\n#endif\n#ifdef USE_ALPHA_MAP_UV_TRANSFORM\n		varying vec2 vAlphaMapUV;\n		uniform mat3 alphaMapUVTransform;\n#endif";

	var uv_vert = "#ifdef USE_UV\n		v_Uv = (uvTransform * vec3(a_Uv, 1.)).xy;\n#endif\n#ifdef USE_UV2\n		v_Uv2 = a_Uv2;\n#endif\n#ifdef USE_ALPHA_MAP_UV_TRANSFORM\n		#if (USE_ALPHA_MAP == 1)\n				vAlphaMapUV = (alphaMapUVTransform * vec3(a_Uv, 1.)).xy;\n		#elif (USE_ALPHA_MAP == 2)\n				vAlphaMapUV = (alphaMapUVTransform * vec3(a_Uv2, 1.)).xy;\n		#else\n				vAlphaMapUV = (alphaMapUVTransform * vec3(a_Uv, 1.)).xy;\n		#endif\n#endif";

	var viewModelPos_pars_frag = "#if (NUM_POINT_LIGHTS > 0) || (NUM_SPOT_LIGHTS > 0) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR) || (NUM_CLIPPING_PLANES > 0) \n		varying vec3 v_modelPos;\n#endif";

	var viewModelPos_pars_vert = "#if (NUM_POINT_LIGHTS > 0) || (NUM_SPOT_LIGHTS > 0) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR)|| (NUM_CLIPPING_PLANES > 0)\n		varying vec3 v_modelPos;\n#endif";

	var viewModelPos_vert = "#if (NUM_POINT_LIGHTS > 0) || (NUM_SPOT_LIGHTS > 0) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR) || (NUM_CLIPPING_PLANES > 0)\n		v_modelPos = (u_Model * vec4(transformed, 1.0)).xyz;\n#endif";

	var ShaderChunk = {
		alphaTest_frag: alphaTest_frag,
		ambientlight_pars_frag: ambientlight_pars_frag,
		aoMap_pars_frag: aoMap_pars_frag,
		begin_frag: begin_frag,
		begin_vert: begin_vert,
		bsdfs: bsdfs,
		bumpMap_pars_frag: bumpMap_pars_frag,
		clippingPlanes_frag: clippingPlanes_frag,
		clippingPlanes_pars_frag: clippingPlanes_pars_frag,
		color_frag: color_frag,
		color_pars_frag: color_pars_frag,
		color_pars_vert: color_pars_vert,
		color_vert: color_vert,
		common_frag: common_frag,
		common_vert: common_vert,
		diffuseMap_frag: diffuseMap_frag,
		diffuseMap_pars_frag: diffuseMap_pars_frag,
		directlight_pars_frag: directlight_pars_frag,
		emissiveMap_frag: emissiveMap_frag,
		emissiveMap_pars_frag: emissiveMap_pars_frag,
		encodings_frag: encodings_frag,
		encodings_pars_frag: encodings_pars_frag,
		end_frag: end_frag,
		envMap_frag: envMap_frag,
		envMap_pars_frag: envMap_pars_frag,
		envMap_pars_vert: envMap_pars_vert,
		envMap_vert: envMap_vert,
		fog_frag: fog_frag,
		fog_pars_frag: fog_pars_frag,
		inverse: inverse,
		light_frag: light_frag,
		light_pars_frag: light_pars_frag,
		alphamap_pars_frag: alphamap_pars_frag,
		alphamap_frag: alphamap_frag,
		normalMap_pars_frag: normalMap_pars_frag,
		normal_frag: normal_frag,
		normal_pars_frag: normal_pars_frag,
		normal_pars_vert: normal_pars_vert,
		normal_vert: normal_vert,
		packing: packing,
		pointlight_pars_frag: pointlight_pars_frag,
		premultipliedAlpha_frag: premultipliedAlpha_frag,
		pvm_vert: pvm_vert,
		dithering_frag: dithering_frag,
		dithering_pars_frag: dithering_pars_frag,
		shadow: shadow,
		shadowMap_frag: shadowMap_frag,
		shadowMap_pars_frag: shadowMap_pars_frag,
		shadowMap_pars_vert: shadowMap_pars_vert,
		shadowMap_vert: shadowMap_vert,
		morphnormal_vert: morphnormal_vert,
		morphtarget_pars_vert: morphtarget_pars_vert,
		morphtarget_vert: morphtarget_vert,
		skinning_pars_vert: skinning_pars_vert,
		skinning_vert: skinning_vert,
		skinnormal_vert: skinnormal_vert,
		specularMap_frag: specularMap_frag,
		specularMap_pars_frag: specularMap_pars_frag,
		spotlight_pars_frag: spotlight_pars_frag,
		transpose: transpose,
		tsn: tsn,
		uv_pars_frag: uv_pars_frag,
		uv_pars_vert: uv_pars_vert,
		uv_vert: uv_vert,
		viewModelPos_pars_frag: viewModelPos_pars_frag,
		viewModelPos_pars_vert: viewModelPos_pars_vert,
		viewModelPos_vert: viewModelPos_vert
	};

	var basic_frag = "#include <common_frag>\n#include <uv_pars_frag>\n#include <color_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <alphamap_pars_frag>\n#include <envMap_pars_frag>\n#include <aoMap_pars_frag>\n#include <fog_pars_frag>\nvoid main() {\n		#include <begin_frag>\n		#include <color_frag>\n		#include <diffuseMap_frag>\n		#include <alphamap_frag>\n		#include <alphaTest_frag>\n		#include <envMap_frag>\n		#include <end_frag>\n		#include <encodings_frag>\n		#include <premultipliedAlpha_frag>\n		#include <fog_frag>\n}";

	var basic_vert = "#include <common_vert>\n#include <uv_pars_vert>\n#include <color_pars_vert>\n#include <envMap_pars_vert>\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <skinning_vert>\n		#include <pvm_vert>\n		#include <uv_vert>\n		#include <color_vert>\n		#include <envMap_vert>\n}";

	var depth_frag = "#include <common_frag>\n#include <diffuseMap_pars_frag>\n#include <uv_pars_frag>\n#include <packing>\nvoid main() {\n		#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)\n				vec4 texelColor = texture2D( diffuseMap, v_Uv );\n				float alpha = texelColor.a * u_Opacity;\n				if(alpha < ALPHATEST) discard;\n		#endif\n		\n		#ifdef DEPTH_PACKING_RGBA\n				gl_FragColor = packDepthToRGBA(gl_FragCoord.z);\n		#else\n				gl_FragColor = vec4( vec3( 1.0 - gl_FragCoord.z ), u_Opacity );\n		#endif\n}";

	var depth_vert = "#include <common_vert>\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\n#include <uv_pars_vert>\nvoid main() {\n		#include <uv_vert>\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <skinning_vert>\n		#include <pvm_vert>\n}";

	var distance_frag = "#include <common_frag>\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 v_ModelPos;\n#include <packing>\nvoid main() {\n		float dist = length( v_ModelPos - u_CameraPosition );\n\tdist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n\tdist = saturate( dist );\n		gl_FragColor = packDepthToRGBA(dist);\n}";

	var distance_vert = "#include <common_vert>\nvarying vec3 v_ModelPos;\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <skinning_vert>\n		#include <pvm_vert>\n		v_ModelPos = (u_Model * vec4(transformed, 1.0)).xyz;\n}";

	var lambert_frag = "#define USE_LAMBERT\n#include <common_frag>\n#include <dithering_pars_frag>\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <color_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <normalMap_pars_frag>\n#include <alphamap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <envMap_pars_frag>\n#include <aoMap_pars_frag>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\n#include <clippingPlanes_pars_frag>\nvoid main() {\n		#include <clippingPlanes_frag>\n		#include <begin_frag>\n		#include <color_frag>\n		#include <diffuseMap_frag>\n		#include <alphamap_frag>\n		#include <alphaTest_frag>\n		#include <normal_frag>\n		#include <light_frag>\n		#include <envMap_frag>\n		#include <shadowMap_frag>\n		vec3 totalEmissiveRadiance = emissive;\n		#include <emissiveMap_frag>\n		outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n		#include <end_frag>\n		#include <encodings_frag>\n		#include <premultipliedAlpha_frag>\n		#include <fog_frag>\n		#include <dithering_frag>\n}";

	var lambert_vert = "#define USE_LAMBERT\n#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <color_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <morphnormal_vert>\n		#include <skinning_vert>\n		#include <skinnormal_vert>\n		#include <pvm_vert>\n		#include <normal_vert>\n		#include <uv_vert>\n		#include <color_vert>\n		#include <viewModelPos_vert>\n		#include <envMap_vert>\n		#include <shadowMap_vert>\n}";

	var normaldepth_frag = "#include <common_frag>\n#include <diffuseMap_pars_frag>\n#include <uv_pars_frag>\n#include <packing>\n#include <normal_pars_frag>\nvoid main() {\n		#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)\n				vec4 texelColor = texture2D( diffuseMap, v_Uv );\n				float alpha = texelColor.a * u_Opacity;\n				if(alpha < ALPHATEST) discard;\n		#endif\n		vec4 packedNormalDepth;\n		packedNormalDepth.xyz = normalize(v_Normal) * 0.5 + 0.5;\n		packedNormalDepth.w = gl_FragCoord.z;\n		gl_FragColor = packedNormalDepth;\n}";

	var normaldepth_vert = "#include <common_vert>\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\nvoid main() {\n		#include <uv_vert>\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <morphnormal_vert>\n		#include <skinning_vert>\n		#include <skinnormal_vert>\n		#include <normal_vert>\n		#include <pvm_vert>\n}";

	var pbr_frag = "#define USE_PBR\n#include <common_frag>\n#include <dithering_pars_frag>\nuniform float u_Metalness;\n#ifdef USE_METALNESSMAP\n\tuniform sampler2D metalnessMap;\n#endif\nuniform float u_Roughness;\n#ifdef USE_ROUGHNESSMAP\n\tuniform sampler2D roughnessMap;\n#endif\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <color_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <alphamap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <envMap_pars_frag>\n#include <aoMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\n#include <clippingPlanes_pars_frag>\nvoid main() {\n		#include <clippingPlanes_frag>\n		#include <begin_frag>\n		#include <color_frag>\n		#include <diffuseMap_frag>\n		#include <alphamap_frag>\n		#include <alphaTest_frag>\n		#include <normal_frag>\n		float roughnessFactor = u_Roughness;\n		#ifdef USE_ROUGHNESSMAP\n		\tvec4 texelRoughness = texture2D( roughnessMap, v_Uv );\n		\troughnessFactor *= texelRoughness.g;\n		#endif\n		float metalnessFactor = u_Metalness;\n		#ifdef USE_METALNESSMAP\n		\tvec4 texelMetalness = texture2D( metalnessMap, v_Uv );\n		\tmetalnessFactor *= texelMetalness.b;\n		#endif\n		#include <light_frag>\n		#include <shadowMap_frag>\n		vec3 totalEmissiveRadiance = emissive;\n		#include <emissiveMap_frag>\n		outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n		#include <end_frag>\n		#include <encodings_frag>\n		#include <premultipliedAlpha_frag>\n		#include <fog_frag>\n		#include <dithering_frag>\n}";

	var pbr2_frag = "#define USE_PBR\n#define USE_PBR2\n#include <common_frag>\n#include <dithering_pars_frag>\nuniform vec3 u_SpecularColor;\n#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif\nuniform float glossiness;\n#ifdef USE_GLOSSINESSMAP\n\tuniform sampler2D glossinessMap;\n#endif\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <color_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <alphamap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <envMap_pars_frag>\n#include <aoMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\n#include <clippingPlanes_pars_frag>\nvoid main() {\n		#include <clippingPlanes_frag>\n		#include <begin_frag>\n		#include <color_frag>\n		#include <diffuseMap_frag>\n		#include <alphamap_frag>\n		#include <alphaTest_frag>\n		#include <normal_frag>\n		vec3 specularFactor = u_SpecularColor;\n		#ifdef USE_SPECULARMAP\n				vec4 texelSpecular = texture2D(specularMap, v_Uv);\n				texelSpecular = sRGBToLinear(texelSpecular);\n				specularFactor *= texelSpecular.rgb;\n		#endif\n		float glossinessFactor = glossiness;\n		#ifdef USE_GLOSSINESSMAP\n				vec4 texelGlossiness = texture2D(glossinessMap, v_Uv);\n				glossinessFactor *= texelGlossiness.a;\n		#endif\n		#include <light_frag>\n		#include <shadowMap_frag>\n		vec3 totalEmissiveRadiance = emissive;\n		#include <emissiveMap_frag>\n		outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n		#include <end_frag>\n		#include <encodings_frag>\n		#include <premultipliedAlpha_frag>\n		#include <fog_frag>\n		#include <dithering_frag>\n}";

	var pbr_vert = "#define USE_PBR\n#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <color_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <morphnormal_vert>\n		#include <skinning_vert>\n		#include <skinnormal_vert>\n		#include <pvm_vert>\n		#include <normal_vert>\n		#include <uv_vert>\n		#include <color_vert>\n		#include <viewModelPos_vert>\n		#include <envMap_vert>\n		#include <shadowMap_vert>\n}";

	var matcap_frag = "#define MATCAP\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common_frag>\n#include <dithering_pars_frag>\n#include <uv_pars_frag>\n#include <color_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <alphamap_pars_frag>\n#include <normalMap_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bumpMap_pars_frag>\n#include <normal_pars_frag>\n#include <fog_pars_frag>\n#include <clippingPlanes_pars_frag>\nvoid main() {\n		#include <clippingPlanes_frag>\n		#include <begin_frag>\n		#include <color_frag>\n		#include <diffuseMap_frag>\n		#include <alphamap_frag>\n		#include <alphaTest_frag>\n		#include <normal_frag>\n		vec3 viewDir = normalize(vViewPosition);\n\tvec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));\n\tvec3 y = cross(viewDir, x);\n		vec3 viewN = (u_View * vec4(N, 0.0)).xyz;\n\tvec2 uv = vec2(dot(x, viewN), dot(y, viewN)) * 0.495 + 0.5;\n		#ifdef USE_MATCAP\n\t\tvec4 matcapColor = texture2D(matcap, uv);\n\t\tmatcapColor = matcapTexelToLinear(matcapColor);\n\t#else\n\t\tvec4 matcapColor = vec4(1.0);\n\t#endif\n\toutColor.rgb *= matcapColor.rgb;\n		#include <end_frag>\n		#include <encodings_frag>\n		#include <premultipliedAlpha_frag>\n		#include <fog_frag>\n		#include <dithering_frag>\n}";

	var matcap_vert = "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <color_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <morphnormal_vert>\n		#include <skinning_vert>\n		#include <skinnormal_vert>\n		#include <pvm_vert>\n		#include <normal_vert>\n		#include <uv_vert>\n		#include <color_vert>\n		#include <viewModelPos_vert>\n		vec4 mvPosition = u_View * u_Model * vec4(transformed, 1.0);\n		vViewPosition = - mvPosition.xyz;\n}";

	var phong_frag = "#define USE_PHONG\n#include <common_frag>\n#include <dithering_pars_frag>\nuniform float u_Specular;\nuniform vec3 u_SpecularColor;\n#include <specularMap_pars_frag>\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <color_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <alphamap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <envMap_pars_frag>\n#include <aoMap_pars_frag>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\n#include <clippingPlanes_pars_frag>\nvoid main() {\n		#include <clippingPlanes_frag>\n		#include <begin_frag>\n		#include <color_frag>\n		#include <diffuseMap_frag>\n		#include <alphamap_frag>\n		#include <alphaTest_frag>\n		#include <normal_frag>\n		#include <specularMap_frag>\n		#include <light_frag>\n		#include <envMap_frag>\n		#include <shadowMap_frag>\n		vec3 totalEmissiveRadiance = emissive;\n		#include <emissiveMap_frag>\n		outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n		#include <end_frag>\n		#include <encodings_frag>\n		#include <premultipliedAlpha_frag>\n		#include <fog_frag>\n		#include <dithering_frag>\n}";

	var phong_vert = "#define USE_PHONG\n#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <color_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <morphtarget_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n		#include <begin_vert>\n		#include <morphtarget_vert>\n		#include <morphnormal_vert>\n		#include <skinning_vert>\n		#include <skinnormal_vert>\n		#include <pvm_vert>\n		#include <normal_vert>\n		#include <uv_vert>\n		#include <color_vert>\n		#include <viewModelPos_vert>\n		#include <envMap_vert>\n		#include <shadowMap_vert>\n}";

	var point_frag = "#include <common_frag>\n#include <diffuseMap_pars_frag>\n#include <fog_pars_frag>\nvoid main() {\n		#include <begin_frag>\n		#ifdef USE_DIFFUSE_MAP\n				outColor *= texture2D(diffuseMap, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));\n		#endif\n		#include <end_frag>\n		#include <encodings_frag>\n		#include <premultipliedAlpha_frag>\n		#include <fog_frag>\n}";

	var point_vert = "#include <common_vert>\nuniform float u_PointSize;\nuniform float u_PointScale;\nvoid main() {\n		#include <begin_vert>\n		#include <pvm_vert>\n		vec4 mvPosition = u_View * u_Model * vec4(transformed, 1.0);\n		#ifdef USE_SIZEATTENUATION\n				gl_PointSize = u_PointSize * ( u_PointScale / - mvPosition.z );\n		#else\n				gl_PointSize = u_PointSize;\n		#endif\n}";

	var ShaderLib = {
		basic_frag: basic_frag,
		basic_vert: basic_vert,
		depth_frag: depth_frag,
		depth_vert: depth_vert,
		distance_frag: distance_frag,
		distance_vert: distance_vert,
		lambert_frag: lambert_frag,
		lambert_vert: lambert_vert,
		normaldepth_frag: normaldepth_frag,
		normaldepth_vert: normaldepth_vert,
		pbr_frag: pbr_frag,
		pbr_vert: pbr_vert,
		pbr2_frag: pbr2_frag,
		pbr2_vert: pbr_vert,
		matcap_frag: matcap_frag,
		matcap_vert: matcap_vert,
		phong_frag: phong_frag,
		phong_vert: phong_vert,
		point_frag: point_frag,
		point_vert: point_vert
	};

	function generateProgramCode(props, material) {
		var code = "";

		for (var key in props) {
			code += props[key] + "_";
		}

		if (material.defines !== undefined) {
			for (var name in material.defines) {
				code += name + "_" + material.defines[name] + "_";
			}
		}

		return code;
	}

	function getTextureEncodingFromMap(map) {
		var encoding;

		if (!map) {
			encoding = TEXEL_ENCODING_TYPE.LINEAR;
		} else if (map.encoding) {
			encoding = map.encoding;
		}

		return encoding;
	}

	function getEncodingComponents(encoding) {
		switch (encoding) {
			case TEXEL_ENCODING_TYPE.LINEAR:
				return ['Linear', '( value )'];

			case TEXEL_ENCODING_TYPE.SRGB:
				return ['sRGB', '( value )'];

			case TEXEL_ENCODING_TYPE.RGBE:
				return ['RGBE', '( value )'];

			case TEXEL_ENCODING_TYPE.RGBM7:
				return ['RGBM', '( value, 7.0 )'];

			case TEXEL_ENCODING_TYPE.RGBM16:
				return ['RGBM', '( value, 16.0 )'];

			case TEXEL_ENCODING_TYPE.RGBD:
				return ['RGBD', '( value, 256.0 )'];

			case TEXEL_ENCODING_TYPE.GAMMA:
				return ['Gamma', '( value, float( GAMMA_FACTOR ) )'];

			default:
				console.error('unsupported encoding: ' + encoding);
		}
	}

	function getTexelDecodingFunction(functionName, encoding) {
		var components = getEncodingComponents(encoding);
		return "vec4 " + functionName + "( vec4 value ) { return " + components[0] + "ToLinear" + components[1] + "; }";
	}

	function getTexelEncodingFunction(functionName, encoding) {
		var components = getEncodingComponents(encoding);
		return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[0] + components[1] + "; }";
	}

	function generateDefines(defines) {
		var chunks = [];

		for (var name in defines) {
			var value = defines[name];
			if (value === false) continue;
			chunks.push('#define ' + name + ' ' + value);
		}

		return chunks.join('\n');
	} // create program


	function createProgram(gl, props, defines) {
		// create defines
		var prefixVertex = ['precision ' + props.precision + ' float;', 'precision ' + props.precision + ' int;', // depth texture may have precision problem on iOS device.
		'precision ' + props.precision + ' sampler2D;', '#define SHADER_NAME ' + props.materialType, defines, props.version >= 2 ? '#define WEBGL2' : '', props.useRoughnessMap ? '#define USE_ROUGHNESSMAP' : '', props.useMetalnessMap ? '#define USE_METALNESSMAP' : '', props.useGlossinessMap ? '#define USE_GLOSSINESSMAP' : '', props.ambientLightNum > 0 ? '#define USE_AMBIENT_LIGHT ' + props.ambientLightNum : '', props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0 ? '#define USE_LIGHT' : '', props.useNormalMap ? '#define USE_NORMAL_MAP' : '', props.useBumpMap ? '#define USE_BUMPMAP' : '', props.useSpecularMap ? '#define USE_SPECULARMAP' : '', props.useEmissiveMap ? '#define USE_EMISSIVEMAP ' + props.useEmissiveMap : '', props.useShadow ? '#define USE_SHADOW' : '', props.flatShading ? '#define FLAT_SHADED' : '', props.flipSided ? '#define FLIP_SIDED' : '', props.useDiffuseMap ? '#define USE_DIFFUSE_MAP ' + props.useDiffuseMap : '', props.useAlphaMap ? '#define USE_ALPHA_MAP ' + props.useAlphaMap : '', props.useAlphaMapUVTransform ? '#define USE_ALPHA_MAP_UV_TRANSFORM' : '', props.useEnvMap ? '#define USE_ENV_MAP' : '', props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '', props.useAOMap ? '#define USE_AOMAP ' + props.useAOMap : '', props.useVertexColors == VERTEX_COLOR.RGB ? '#define USE_VCOLOR_RGB' : '', props.useVertexColors == VERTEX_COLOR.RGBA ? '#define USE_VCOLOR_RGBA' : '', props.useVertexTangents ? '#define USE_TANGENT' : '', props.useVertexUvs ? '#define USE_UV' : '', props.morphTargets ? '#define USE_MORPHTARGETS' : '', props.morphNormals && props.flatShading === false ? '#define USE_MORPHNORMALS' : '', props.useSkinning ? '#define USE_SKINNING' : '', props.bonesNum > 0 ? '#define MAX_BONES ' + props.bonesNum : '', props.useVertexTexture ? '#define BONE_TEXTURE' : ''].filter(filterEmptyLine).join("\n");
		var prefixFragment = [// use dfdx and dfdy must enable OES_standard_derivatives
		props.useStandardDerivatives && props.version < 2 ? '#extension GL_OES_standard_derivatives : enable' : '', props.useShaderTextureLOD && props.version < 2 ? '#extension GL_EXT_shader_texture_lod : enable' : '', 'precision ' + props.precision + ' float;', 'precision ' + props.precision + ' int;', // depth texture may have precision problem on iOS device.
		'precision ' + props.precision + ' sampler2D;', props.version >= 2 ? 'precision ' + props.precision + ' sampler2DShadow;' : '', props.version >= 2 ? 'precision ' + props.precision + ' samplerCubeShadow;' : '', '#define SHADER_NAME ' + props.materialType, '#define PI 3.14159265359', '#define EPSILON 1e-6', 'float pow2( const in float x ) { return x*x; }', '#define LOG2 1.442695', '#define RECIPROCAL_PI 0.31830988618', '#define saturate(a) clamp( a, 0.0, 1.0 )', '#define whiteCompliment(a) ( 1.0 - saturate( a ) )', // expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
		// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
		'highp float rand( const in vec2 uv ) {', 'const highp float a = 12.9898, b = 78.233, c = 43758.5453;', 'highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );', 'return fract(sin(sn) * c);', '}', defines, props.version >= 2 ? '#define WEBGL2' : '', props.useShadowSampler ? '#define USE_SHADOW_SAMPLER' : '#define sampler2DShadow sampler2D', props.useRoughnessMap ? '#define USE_ROUGHNESSMAP' : '', props.useMetalnessMap ? '#define USE_METALNESSMAP' : '', props.useGlossinessMap ? '#define USE_GLOSSINESSMAP' : '', props.ambientLightNum > 0 ? '#define USE_AMBIENT_LIGHT ' + props.ambientLightNum : '', props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0 ? '#define USE_LIGHT' : '', props.useNormalMap ? '#define USE_NORMAL_MAP' : '', props.useBumpMap ? '#define USE_BUMPMAP' : '', props.useSpecularMap ? '#define USE_SPECULARMAP' : '', props.useEmissiveMap ? '#define USE_EMISSIVEMAP ' + props.useEmissiveMap : '', props.useShadow ? '#define USE_SHADOW' : '', props.shadowType === SHADOW_TYPE.HARD ? '#define USE_HARD_SHADOW' : '', props.shadowType === SHADOW_TYPE.POISSON_SOFT ? '#define USE_POISSON_SOFT_SHADOW' : '', props.shadowType === SHADOW_TYPE.PCF3_SOFT ? '#define USE_PCF3_SOFT_SHADOW' : '', props.shadowType === SHADOW_TYPE.PCF5_SOFT ? '#define USE_PCF5_SOFT_SHADOW' : '', props.shadowType === SHADOW_TYPE.PCSS16_SOFT ? '#define USE_PCSS16_SOFT_SHADOW' : '', props.shadowType === SHADOW_TYPE.PCSS32_SOFT ? '#define USE_PCSS32_SOFT_SHADOW' : '', props.shadowType === SHADOW_TYPE.PCSS64_SOFT ? '#define USE_PCSS64_SOFT_SHADOW' : '', props.shadowType === SHADOW_TYPE.PCSS16_SOFT || props.shadowType === SHADOW_TYPE.PCSS32_SOFT || props.shadowType === SHADOW_TYPE.PCSS64_SOFT ? '#define USE_PCSS_SOFT_SHADOW' : '', props.flatShading ? '#define FLAT_SHADED' : '', props.doubleSided ? '#define DOUBLE_SIDED' : '', props.useShaderTextureLOD ? '#define TEXTURE_LOD_EXT' : '', props.useDiffuseMap ? '#define USE_DIFFUSE_MAP ' + props.useDiffuseMap : '', props.useAlphaMap ? '#define USE_ALPHA_MAP ' + props.useAlphaMap : '', props.useAlphaMapUVTransform ? '#define USE_ALPHA_MAP_UV_TRANSFORM' : '', props.useEnvMap ? '#define USE_ENV_MAP' : '', props.useAOMap ? '#define USE_AOMAP ' + props.useAOMap : '', props.useVertexColors == VERTEX_COLOR.RGB ? '#define USE_VCOLOR_RGB' : '', props.useVertexColors == VERTEX_COLOR.RGBA ? '#define USE_VCOLOR_RGBA' : '', props.useVertexTangents ? '#define USE_TANGENT' : '', props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '', props.fog ? '#define USE_FOG' : '', props.fogExp2 ? '#define USE_EXP2_FOG' : '', props.alphaTest ? '#define ALPHATEST ' + props.alphaTest : '', props.useEnvMap ? '#define ' + props.envMapCombine : '', '#define GAMMA_FACTOR ' + props.gammaFactor, props.useMatcap ? '#define USE_MATCAP' : '', props.useVertexUvs ? '#define USE_UV' : '', props.dithering ? '#define DITHERING' : '', ShaderChunk["encodings_pars_frag"], getTexelDecodingFunction("mapTexelToLinear", props.diffuseMapEncoding), props.useEnvMap ? getTexelDecodingFunction("envMapTexelToLinear", props.envMapEncoding) : '', props.useEmissiveMap ? getTexelDecodingFunction("emissiveMapTexelToLinear", props.emissiveMapEncoding) : '', props.useMatcap ? getTexelDecodingFunction("matcapTexelToLinear", props.matcapEncoding) : '', getTexelEncodingFunction("linearToOutputTexel", props.outputEncoding), props.packDepthToRGBA ? '#define DEPTH_PACKING_RGBA' : ''].filter(filterEmptyLine).join("\n"); // vertexCode & fragmentCode

		var vertex = ShaderLib[props.materialType + "_vert"] || props.vertexShader || ShaderLib.basic_vert;
		var fragment = ShaderLib[props.materialType + "_frag"] || props.fragmentShader || ShaderLib.basic_frag;
		var vshader = [prefixVertex, vertex].join("\n");
		var fshader = [prefixFragment, fragment].join("\n");
		vshader = parseIncludes(vshader);
		fshader = parseIncludes(fshader);
		vshader = replaceLightNums(vshader, props);
		fshader = replaceLightNums(fshader, props);
		vshader = replaceClippingPlaneNums(vshader, props);
		fshader = replaceClippingPlaneNums(fshader, props);
		vshader = unrollLoops(vshader);
		fshader = unrollLoops(fshader); // support glsl version 300 es for webgl ^2.0

		if (props.version > 1) {
			fshader = fshader.replace("#extension GL_EXT_draw_buffers : require", ""); // replace gl_FragData by layout

			var i = 0;
			var layout = [];

			while (fshader.indexOf("gl_FragData[" + i + "]") > -1) {
				fshader = fshader.replace("gl_FragData[" + i + "]", "pc_fragData" + i);
				layout.push("layout(location = " + i + ") out vec4 pc_fragData" + i + ";");
				i++;
			}

			fshader = fshader.replace('#define whiteCompliment(a) ( 1.0 - saturate( a ) )', '#define whiteCompliment(a) ( 1.0 - saturate( a ) )' + '\n' + layout.join('\n') + '\n');
			vshader = ['#version 300 es\n', '#define attribute in', '#define varying out', '#define texture2D texture'].join('\n') + '\n' + vshader;
			fshader = ['#version 300 es\n', '#define varying in', fshader.indexOf("layout") > -1 ? '' : 'out highp vec4 pc_fragColor;', '#define gl_FragColor pc_fragColor', '#define gl_FragDepthEXT gl_FragDepth', '#define texture2D texture', '#define textureCube texture', '#define texture2DProj textureProj', '#define texture2DLodEXT textureLod', '#define texture2DProjLodEXT textureProjLod', '#define textureCubeLodEXT textureLod', '#define texture2DGradEXT textureGrad', '#define texture2DProjGradEXT textureProjGrad', '#define textureCubeGradEXT textureGrad'].join('\n') + '\n' + fshader;
		}

		return new WebGLProgram(gl, vshader, fshader);
	}

	var parseIncludes = function parseIncludes(string) {
		var pattern = /#include +<([\w\d.]+)>/g;

		function replace(match, include) {
			var replace = ShaderChunk[include];

			if (replace === undefined) {
				throw new Error('Can not resolve #include <' + include + '>');
			}

			return parseIncludes(replace);
		}

		return string.replace(pattern, replace);
	};

	function filterEmptyLine(string) {
		return string !== '';
	}

	function replaceLightNums(string, parameters) {
		return string.replace(/NUM_DIR_LIGHTS/g, parameters.directLightNum).replace(/NUM_SPOT_LIGHTS/g, parameters.spotLightNum).replace(/NUM_POINT_LIGHTS/g, parameters.pointLightNum).replace(/NUM_DIR_SHADOWS/g, parameters.directShadowNum).replace(/NUM_SPOT_SHADOWS/g, parameters.spotShadowNum).replace(/NUM_POINT_SHADOWS/g, parameters.pointShadowNum);
	}

	function replaceClippingPlaneNums(string, parameters) {
		return string.replace(/NUM_CLIPPING_PLANES/g, parameters.numClippingPlanes);
	}

	function unrollLoops(string) {
		var pattern = /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;

		function replace(match, start, end, snippet) {
			var unroll = '';

			for (var i = parseInt(start); i < parseInt(end); i++) {
				unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]');
			}

			return unroll;
		}

		return string.replace(pattern, replace);
	}

	function generateProps(state, capabilities, camera, material, object, renderContext) {
		var lights = renderContext && material.acceptLight ? renderContext.lights : null;
		var fog = renderContext ? renderContext.fog : null;
		var clippingPlanes = renderContext ? renderContext.clippingPlanes : null;
		var disableShadowSampler = renderContext ? renderContext.disableShadowSampler : null;
		var props = {}; // cache this props?

		props.materialType = material.type; // capabilities

		var capabilities = capabilities;
		props.version = capabilities.version;
		props.precision = material.precision || capabilities.maxPrecision;
		props.useStandardDerivatives = capabilities.version >= 2 || !!capabilities.getExtension('OES_standard_derivatives') || !!capabilities.getExtension('GL_OES_standard_derivatives');
		props.useShaderTextureLOD = capabilities.version >= 2 || !!capabilities.getExtension('EXT_shader_texture_lod'); // maps

		props.useDiffuseMap = !!material.diffuseMap ? material.diffuseMapCoord + 1 : 0;
		props.useAlphaMap = !!material.alphaMap ? material.alphaMapCoord + 1 : 0;
		props.useAlphaMapUVTransform = !!material.alphaMap && material.alphaMap.useUVTransform;
		props.useNormalMap = !!material.normalMap;
		props.useBumpMap = !!material.bumpMap;
		props.useSpecularMap = !!material.specularMap;
		props.useEnvMap = !!material.envMap;
		props.envMapCombine = material.envMapCombine;
		props.useEmissiveMap = !!material.emissiveMap ? material.emissiveMapCoord + 1 : 0;
		props.useRoughnessMap = !!material.roughnessMap;
		props.useMetalnessMap = !!material.metalnessMap;
		props.useGlossinessMap = !!material.glossinessMap;
		props.useAOMap = !!material.aoMap ? material.aoMapCoord + 1 : 0;
		props.useMatcap = !!material.matcap;
		props.useVertexUvs = !!material.diffuseMap || !!material.alphaMap || !!material.normalMap || !!material.bumpMap || !!material.specularMap || !!material.emissiveMap || !!material.roughnessMap || !!material.metalnessMap || !!material.glossinessMap || !!material.aoMap; // lights

		props.ambientLightNum = !!lights ? lights.ambientsNum : 0;
		props.directLightNum = !!lights ? lights.directsNum : 0;
		props.pointLightNum = !!lights ? lights.pointsNum : 0;
		props.spotLightNum = !!lights ? lights.spotsNum : 0;
		props.directShadowNum = object.receiveShadow && !!lights ? lights.directShadowNum : 0;
		props.pointShadowNum = object.receiveShadow && !!lights ? lights.pointShadowNum : 0;
		props.spotShadowNum = object.receiveShadow && !!lights ? lights.spotShadowNum : 0;
		props.useShadow = object.receiveShadow && !!lights && lights.shadowsNum > 0;

		if (object.shadowType.indexOf("pcss") > -1) {
			if (capabilities.version < 2) {
				console.warn("WebGL 1.0 not support PCSS soft shadow, fallback to POISSON_SOFT");
				props.shadowType = SHADOW_TYPE.POISSON_SOFT;
			} else if (disableShadowSampler) {
				console.warn("Set scene.disableShadowSampler to true can not use pcss, fallback to POISSON_SOFT");
				props.shadowType = SHADOW_TYPE.POISSON_SOFT;
			}
		} else {
			props.shadowType = object.shadowType;
		}

		props.useShadowSampler = capabilities.version >= 2 && !disableShadowSampler;
		props.dithering = material.dithering; // encoding

		var currentRenderTarget = state.currentRenderTarget;
		props.gammaFactor = camera.gammaFactor;
		props.outputEncoding = !!currentRenderTarget.texture ? getTextureEncodingFromMap(currentRenderTarget.texture) : camera.outputEncoding;
		props.diffuseMapEncoding = getTextureEncodingFromMap(material.diffuseMap || material.cubeMap);
		props.envMapEncoding = getTextureEncodingFromMap(material.envMap);
		props.emissiveMapEncoding = getTextureEncodingFromMap(material.emissiveMap);
		props.matcapEncoding = getTextureEncodingFromMap(material.matcap); // other

		props.alphaTest = material.alphaTest;
		props.premultipliedAlpha = material.premultipliedAlpha;
		props.useVertexColors = material.vertexColors;
		props.useVertexTangents = !!material.normalMap && material.vertexTangents;
		props.numClippingPlanes = !!clippingPlanes ? clippingPlanes.length : 0;
		props.flatShading = material.shading === SHADING_TYPE.FLAT_SHADING;
		props.fog = !!fog;
		props.fogExp2 = !!fog && fog.fogType === FOG_TYPE.EXP2;
		props.sizeAttenuation = material.sizeAttenuation;
		props.doubleSided = material.side === DRAW_SIDE.DOUBLE;
		props.flipSided = material.side === DRAW_SIDE.BACK;
		props.packDepthToRGBA = material.packToRGBA; // morph targets

		props.morphTargets = !!object.morphTargetInfluences;
		props.morphNormals = !!object.morphTargetInfluences && object.geometry.morphAttributes.normal; // skinned mesh

		var useSkinning = object.type === OBJECT_TYPE.SKINNED_MESH && object.skeleton;
		var maxVertexUniformVectors = capabilities.maxVertexUniformVectors;
		var useVertexTexture = capabilities.maxVertexTextures > 0 && (!!capabilities.getExtension('OES_texture_float') || capabilities.version >= 2);
		var maxBones = 0;

		if (useVertexTexture) {
			maxBones = 1024;
		} else {
			maxBones = object.skeleton ? object.skeleton.bones.length : 0;

			if (maxBones * 16 > maxVertexUniformVectors) {
				console.warn("Program: too many bones (" + maxBones + "), current cpu only support " + Math.floor(maxVertexUniformVectors / 16) + " bones!!");
				maxBones = Math.floor(maxVertexUniformVectors / 16);
			}
		}

		props.useSkinning = useSkinning;
		props.bonesNum = maxBones;
		props.useVertexTexture = useVertexTexture;

		if (material.type === MATERIAL_TYPE.SHADER) {
			props.vertexShader = material.vertexShader;
			props.fragmentShader = material.fragmentShader;
		}

		return props;
	}

	function WebGLPrograms(gl, state, capabilities) {
		var programs = [];
		/**
		 * get a suitable program
		 * @param {Camera} camera
		 * @param {Material} material
		 * @param {Object3D} object?
		 * @param {RenderCache} cache?
		 * @ignore
		 */

		this.getProgram = function (camera, material, object, cache) {
			var material = material || object.material;
			var props = generateProps(state, capabilities, camera, material, object, cache);
			var code = generateProgramCode(props, material);
			var program;

			for (var p = 0, pl = programs.length; p < pl; p++) {
				var programInfo = programs[p];

				if (programInfo.code === code) {
					program = programInfo;
					++program.usedTimes;
					break;
				}
			}

			if (program === undefined) {
				var customDefines = "";

				if (material.defines !== undefined) {
					customDefines = generateDefines(material.defines);
				}

				program = createProgram(gl, props, customDefines);
				program.code = code;
				programs.push(program);
			}

			return program;
		};

		this.releaseProgram = function (program) {
			if (--program.usedTimes === 0) {
				// Remove from unordered set
				var i = programs.indexOf(program);
				programs[i] = programs[programs.length - 1];
				programs.pop(); // Free WebGL resources

				program.dispose(gl);
			}
		}; // debug


		this.programs = programs;
	}

	function WebGLRenderBuffer(gl, properties, capabilities) {
		this.gl = gl;
		this.properties = properties;
		this.capabilities = capabilities;
	}

	Object.assign(WebGLRenderBuffer.prototype, {
		setRenderBuffer: function setRenderBuffer(renderBuffer) {
			var gl = this.gl;
			var capabilities = this.capabilities;
			var renderBufferProperties = this.properties.get(renderBuffer);

			if (renderBufferProperties.__webglRenderbuffer === undefined) {
				renderBuffer.addEventListener('dispose', this.onRenderBufferDispose, this);
				renderBufferProperties.__webglRenderbuffer = gl.createRenderbuffer();
				gl.bindRenderbuffer(gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);

				if (renderBuffer.multipleSampling > 0) {
					if (capabilities.version < 2) {
						console.error("render buffer multipleSampling is not support in webgl 1.0.");
					}

					gl.renderbufferStorageMultisample(gl.RENDERBUFFER, Math.min(renderBuffer.multipleSampling, capabilities.maxSamples), renderBuffer.format, renderBuffer.width, renderBuffer.height);
				} else {
					gl.renderbufferStorage(gl.RENDERBUFFER, renderBuffer.format, renderBuffer.width, renderBuffer.height);
				}
			} else {
				gl.bindRenderbuffer(gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);
			}

			return renderBufferProperties;
		},
		onRenderBufferDispose: function onRenderBufferDispose(event) {
			var gl = this.gl;
			var renderBuffer = event.target;
			var renderBufferProperties = this.properties.get(renderBuffer);

			if (renderBufferProperties.__webglRenderbuffer) {
				gl.deleteRenderbuffer(renderBufferProperties.__webglRenderbuffer);
			}

			this.properties.delete(renderBuffer);
		}
	});

	function _isPowerOfTwo$1(image) {
		return isPowerOfTwo(image.width) && isPowerOfTwo(image.height);
	}

	function WebGLRenderTarget(gl, state, texture, renderBuffer, properties, capabilities) {
		this.gl = gl;
		this.state = state;
		this.texture = texture;
		this.renderBuffer = renderBuffer;
		this.properties = properties;
		this.capabilities = capabilities;
	}

	Object.assign(WebGLRenderTarget.prototype, {
		setRenderTarget2D: function setRenderTarget2D(renderTarget) {
			var gl = this.gl;
			var state = this.state;
			var texture = this.texture;
			var renderBuffer = this.renderBuffer;
			var capabilities = this.capabilities;
			var renderTargetProperties = this.properties.get(renderTarget);

			if (renderTargetProperties.__webglFramebuffer === undefined) {
				renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
				renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
				var buffers = [];

				for (var attachment in renderTarget._attachments) {
					attachment = Number(attachment);

					if (attachment === ATTACHMENT.DEPTH_ATTACHMENT || attachment === ATTACHMENT.DEPTH_STENCIL_ATTACHMENT) {
						if (capabilities.version < 2 && !capabilities.getExtension('WEBGL_depth_texture')) {
							console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
						}
					}

					if (attachment <= 0x8CE9 && attachment >= 0x8CE0 || attachment <= 0x8CE15 && attachment >= 0x8CE10) {
						buffers.push(attachment);
					}

					if (renderTarget._attachments[attachment].isTexture) {
						var textureProperties = texture.setTexture2D(renderTarget._attachments[attachment]);
						gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, textureProperties.__webglTexture, 0);
						state.bindTexture(gl.TEXTURE_2D, null);
					} else {
						var renderBufferProperties = renderBuffer.setRenderBuffer(renderTarget._attachments[attachment]);
						gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);
						gl.bindRenderbuffer(gl.RENDERBUFFER, null);
					}
				}

				if (buffers.length > 1) {
					if (capabilities.version >= 2) {
						gl.drawBuffers(buffers);
					} else if (capabilities.getExtension('WEBGL_draw_buffers')) {
						capabilities.getExtension('WEBGL_draw_buffers').drawBuffersWEBGL(buffers);
					}
				}

				var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

				if (status !== gl.FRAMEBUFFER_COMPLETE) {
					if (status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
					} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
					} else if (status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
					} else if (status === gl.FRAMEBUFFER_UNSUPPORTED) {
						console.warn("framebuffer not complete: FRAMEBUFFER_UNSUPPORTED");
					} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
					} else {
						console.warn("framebuffer not complete.");
					}
				}

				return;
			}

			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
		},
		setRenderTargetCube: function setRenderTargetCube(renderTarget) {
			var gl = this.gl;
			var state = this.state;
			var texture = this.texture;
			var renderBuffer = this.renderBuffer;
			var capabilities = this.capabilities;
			var renderTargetProperties = this.properties.get(renderTarget);

			if (renderTargetProperties.__webglFramebuffer === undefined) {
				renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
				renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
				renderTargetProperties.__currentActiveCubeFace = renderTarget.activeCubeFace;
				gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
				var buffers = [];

				for (var attachment in renderTarget._attachments) {
					attachment = Number(attachment);

					if (attachment === ATTACHMENT.DEPTH_ATTACHMENT || attachment === ATTACHMENT.DEPTH_STENCIL_ATTACHMENT) {
						if (capabilities.version < 2 && !capabilities.getExtension('WEBGL_depth_texture')) {
							console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
						}
					}

					if (attachment <= 0x8CE9 && attachment >= 0x8CE0 || attachment <= 0x8CE15 && attachment >= 0x8CE10) {
						buffers.push(attachment);
					}

					if (renderTarget._attachments[attachment].isTexture) {
						var textureProperties = texture.setTextureCube(renderTarget._attachments[attachment]);
						gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
						state.bindTexture(gl.TEXTURE_CUBE_MAP, null);
					} else {
						var renderBufferProperties = renderBuffer.setRenderBuffer(renderTarget._attachments[attachment]);
						gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBufferProperties.__webglRenderbuffer);
						gl.bindRenderbuffer(gl.RENDERBUFFER, null);
					}
				}

				if (buffers.length > 1) {
					if (capabilities.version >= 2) {
						gl.drawBuffers(buffers);
					} else if (capabilities.getExtension('WEBGL_draw_buffers')) {
						capabilities.getExtension('WEBGL_draw_buffers').drawBuffersWEBGL(buffers);
					}
				}

				var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

				if (status !== gl.FRAMEBUFFER_COMPLETE) {
					if (status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
					} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
					} else if (status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
					} else if (status === gl.FRAMEBUFFER_UNSUPPORTED) {
						console.warn("framebuffer not complete: FRAMEBUFFER_UNSUPPORTED");
					} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE) {
						console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
					} else {
						console.warn("framebuffer not complete.");
					}
				}

				return;
			}

			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

			for (var attachment in renderTarget._attachments) {
				if (renderTarget._attachments[attachment].isTexture) {
					var textureProperties = this.properties.get(renderTarget._attachments[attachment]);
					gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
				}
			}

			renderTargetProperties.__currentActiveCubeFace = renderTarget.activeCubeFace;
		},
		// Blit framebuffers.
		blitRenderTarget: function blitRenderTarget(read, draw, color, depth, stencil) {
			var gl = this.gl;
			var properties = this.properties;
			var capabilities = this.capabilities;

			if (capabilities.version < 2) {
				console.warn("blitFramebuffer not support by WebGL" + capabilities.version);
				return;
			}

			var readBuffer = properties.get(read).__webglFramebuffer;

			var drawBuffer = properties.get(draw).__webglFramebuffer;

			gl.bindFramebuffer(gl.READ_FRAMEBUFFER, readBuffer);
			gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, drawBuffer);
			var mask = 0;
			if (color === undefined || !!color) mask |= gl.COLOR_BUFFER_BIT;
			if (depth === undefined || !!depth) mask |= gl.DEPTH_BUFFER_BIT;
			if (stencil === undefined || !!stencil) mask |= gl.STENCIL_BUFFER_BIT; // gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);

			gl.blitFramebuffer(0, 0, read.width, read.height, 0, 0, draw.width, draw.height, mask, gl.NEAREST);
		},
		updateRenderTargetMipmap: function updateRenderTargetMipmap(renderTarget) {
			var gl = this.gl;
			var state = this.state;
			var texture = renderTarget.texture;

			if (texture.generateMipmaps && _isPowerOfTwo$1(renderTarget) && texture.minFilter !== gl.NEAREST && texture.minFilter !== gl.LINEAR) {
				var target = texture.textureType;

				var webglTexture = this.properties.get(texture).__webglTexture;

				state.bindTexture(target, webglTexture);
				gl.generateMipmap(target);
				state.bindTexture(target, null);
			}
		},
		onRenderTargetDispose: function onRenderTargetDispose(event) {
			var gl = this.gl;
			var state = this.state;
			var renderTarget = event.target;
			var renderTargetProperties = this.properties.get(renderTarget);
			renderTarget.removeEventListener('dispose', this.onRenderTargetDispose, this);

			if (renderTargetProperties.__webglFramebuffer) {
				gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer);
			}

			for (var attachment in renderTarget._attachments) {
				renderTarget._attachments[attachment].dispose();
			}

			this.properties.delete(renderTarget);

			if (state.currentRenderTarget === renderTarget) {
				state.currentRenderTarget = null;
			}
		},
		setRenderTarget: function setRenderTarget(target) {
			var gl = this.gl;
			var state = this.state;

			if (!!target.view) {
				// back RenderTarget
				if (state.currentRenderTarget === target) ; else {
					gl.bindFramebuffer(gl.FRAMEBUFFER, null);
					state.currentRenderTarget = target;
				}

				return;
			}

			var isCube = target.activeCubeFace !== undefined;

			if (state.currentRenderTarget !== target) {
				if (!isCube) {
					this.setRenderTarget2D(target);
				} else {
					this.setRenderTargetCube(target);
				}

				state.currentRenderTarget = target;
			} else {
				if (isCube) {
					var renderTargetProperties = this.properties.get(target);

					if (renderTargetProperties.__currentActiveCubeFace !== target.activeCubeFace) {
						for (var attachment in target._attachments) {
							var textureProperties = this.properties.get(target._attachments[attachment]);
							gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.activeCubeFace, textureProperties.__webglTexture, 0);
						}

						renderTargetProperties.__currentActiveCubeFace = target.activeCubeFace;
					}
				}
			}
		}
	});

	var WebGLVertexArrayBindings = /*#__PURE__*/function () {
		function WebGLVertexArrayBindings(gl, properties, capabilities) {
			this._gl = gl;
			this._properties = properties;
			this._capabilities = capabilities;
			this._isWebGL2 = capabilities.version >= 2;
			this._vaoExt = capabilities.getExtension("OES_vertex_array_object");
			this._currentGeometryProgram = "";
		}

		var _proto = WebGLVertexArrayBindings.prototype;

		_proto.setup = function setup(object, geometry, program) {
			var geometryProperties = this._properties.get(geometry);

			if (object.morphTargetInfluences) {
				this._setupVertexAttributes(program, geometry);

				this._currentGeometryProgram = "";
			} else if (this._isWebGL2 || this._vaoExt) {
				// use VAO
				var vao;

				if (!geometryProperties._vaos[program.id]) {
					vao = geometryProperties._vaos[program.id] = {
						version: -1,
						object: this._createVAO()
					};
				} else {
					vao = geometryProperties._vaos[program.id];
				}

				this._bindVAO(vao.object);

				if (vao.version !== geometry.version) {
					this._setupVertexAttributes(program, geometry);

					vao.version = geometry.version;
				}
			} else {
				var geometryProgram = program.id + "_" + geometry.id + "_" + geometry.version;

				if (geometryProgram !== this._currentGeometryProgram) {
					this._setupVertexAttributes(program, geometry);

					this._currentGeometryProgram = geometryProgram;
				}
			}
		};

		_proto._createVAO = function _createVAO() {
			if (this._isWebGL2) {
				return this._gl.createVertexArray();
			} else if (this._vaoExt) {
				return this._vaoExt.createVertexArrayOES();
			}

			return null;
		};

		_proto._bindVAO = function _bindVAO(vao) {
			if (this._isWebGL2) {
				return this._gl.bindVertexArray(vao);
			} else if (this._vaoExt) {
				return this._vaoExt.bindVertexArrayOES(vao);
			}
		};

		_proto.resetBinding = function resetBinding() {
			if (this._isWebGL2) {
				this._gl.bindVertexArray(null);
			} else if (this._vaoExt) {
				this._vaoExt.bindVertexArrayOES(null);
			}
		};

		_proto.disposeVAO = function disposeVAO(vao) {
			if (this._isWebGL2) {
				this._gl.deleteVertexArray(vao);
			} else if (this._vaoExt) {
				this._vaoExt.deleteVertexArrayOES(vao);
			}
		};

		_proto._setupVertexAttributes = function _setupVertexAttributes(program, geometry) {
			var gl = this._gl;
			var isWebGL2 = this._isWebGL2;
			var attributes = program.attributes;
			var properties = this._properties;
			var capabilities = this._capabilities;

			for (var key in attributes) {
				var programAttribute = attributes[key];
				var geometryAttribute = geometry.getAttribute(key);

				if (geometryAttribute) {
					var normalized = geometryAttribute.normalized;
					var size = geometryAttribute.size;

					if (programAttribute.count !== size) {
						console.warn("WebGLVertexArrayBindings: attribute " + key + " size not match! " + programAttribute.count + " : " + size);
					}

					var attribute;

					if (geometryAttribute.isInterleavedBufferAttribute) {
						attribute = properties.get(geometryAttribute.data);
					} else {
						attribute = properties.get(geometryAttribute);
					}

					var buffer = attribute.buffer;
					var type = attribute.type;

					if (programAttribute.format !== type) ;

					var bytesPerElement = attribute.bytesPerElement;

					if (geometryAttribute.isInterleavedBufferAttribute) {
						var data = geometryAttribute.data;
						var stride = data.stride;
						var offset = geometryAttribute.offset;
						gl.enableVertexAttribArray(programAttribute.location);

						if (data && data.isInstancedInterleavedBuffer) {
							if (isWebGL2) {
								gl.vertexAttribDivisor(programAttribute.location, data.meshPerAttribute);
							} else if (capabilities.getExtension('ANGLE_instanced_arrays')) {
								capabilities.getExtension('ANGLE_instanced_arrays').vertexAttribDivisorANGLE(programAttribute.location, data.meshPerAttribute);
							} else {
								console.warn("vertexAttribDivisor not supported");
							}

							if (geometry.maxInstancedCount === undefined) {
								geometry.maxInstancedCount = data.meshPerAttribute * data.count;
							}
						}

						gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
						gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, bytesPerElement * stride, bytesPerElement * offset);
					} else {
						gl.enableVertexAttribArray(programAttribute.location);

						if (geometryAttribute.isInstancedBufferAttribute) {
							if (isWebGL2) {
								gl.vertexAttribDivisor(programAttribute.location, geometryAttribute.meshPerAttribute);
							} else if (capabilities.getExtension('ANGLE_instanced_arrays')) {
								capabilities.getExtension('ANGLE_instanced_arrays').vertexAttribDivisorANGLE(programAttribute.location, geometryAttribute.meshPerAttribute);
							} else {
								console.warn("vertexAttribDivisor not supported");
							}

							if (geometry.maxInstancedCount === undefined) {
								geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;
							}
						}

						gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
						gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, 0, 0);
					}
				}
			} // bind index if could


			if (geometry.index) {
				var indexProperty = properties.get(geometry.index);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexProperty.buffer);
			}
		};

		return WebGLVertexArrayBindings;
	}();

	var helpVector3 = new Vector3();
	var helpVector4 = new Vector4();
	var influencesList = new WeakMap();
	var morphInfluences = new Float32Array(8);

	function defaultGetMaterial(renderable) {
		return renderable.material;
	}

	function defaultIfRender(renderable) {
		return true;
	}

	function noop() {}

	var planesData;
	var helpPlane = new Plane();

	function getClippingPlanesData(planes, camera) {
		if (!planesData || planesData.length < planes.length * 4) {
			planesData = new Float32Array(planes.length * 4);
		}

		for (var i = 0; i < planes.length; i++) {
			helpPlane.copy(planes[i]); // .applyMatrix4(camera.viewMatrix);

			planesData[i * 4 + 0] = helpPlane.normal.x;
			planesData[i * 4 + 1] = helpPlane.normal.y;
			planesData[i * 4 + 2] = helpPlane.normal.z;
			planesData[i * 4 + 3] = helpPlane.constant;
		}

		return planesData;
	}
	/**
	 * Core render methods by WebGL.
	 * @constructor
	 * @memberof zen3d
	 * @param {WebGLRenderingContext} gl
	 */


	function WebGLCore(gl) {
		this.gl = gl;
		var properties = new WebGLProperties();
		this.properties = properties;
		var capabilities = new WebGLCapabilities(gl);
		/**
				* An object containing details about the capabilities of the current RenderingContext.
				* @type {zen3d.WebGLCapabilities}
				*/

		this.capabilities = capabilities;
		var state = new WebGLState(gl, capabilities);
		this.state = state;
		var vertexArrayBindings = new WebGLVertexArrayBindings(gl, properties, capabilities);
		this.vertexArrayBindings = vertexArrayBindings;
		var texture = new WebGLTexture(gl, state, properties, capabilities);
		this.texture = texture;
		var renderBuffer = new WebGLRenderBuffer(gl, properties, capabilities);
		this.renderTarget = new WebGLRenderTarget(gl, state, texture, renderBuffer, properties, capabilities);
		this.geometry = new WebGLGeometry(gl, state, vertexArrayBindings, properties, capabilities);
		this.programs = new WebGLPrograms(gl, state, capabilities);
		this._usedTextureUnits = 0;
	}

	Object.assign(WebGLCore.prototype,
	/** @lends zen3d.WebGLCore.prototype */
	{
		/**
				* Clear buffers.
				* @param {boolean} [color=false]
				* @param {boolean} [depth=false]
				* @param {boolean} [stencil=false]
				*/
		clear: function clear(color, depth, stencil) {
			var gl = this.gl;
			var bits = 0;
			if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
			if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
			if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;
			gl.clear(bits);
		},

		/**
				* Render opaque and transparent objects.
				* @param {zen3d.Scene} scene
				* @param {zen3d.Camera} camera
				* @param {boolean} [updateRenderList=true]
				*/
		render: function render(scene, camera, updateRenderList) {
			updateRenderList = updateRenderList !== undefined ? updateRenderList : true;
			var renderList;

			if (updateRenderList) {
				renderList = scene.updateRenderList(camera);
			} else {
				renderList = scene.getRenderList(camera);
			}

			this.renderPass(renderList.opaque, camera, {
				scene: scene,
				getMaterial: function getMaterial(renderable) {
					return scene.overrideMaterial || renderable.material;
				}
			});
			this.renderPass(renderList.transparent, camera, {
				scene: scene,
				getMaterial: function getMaterial(renderable) {
					return scene.overrideMaterial || renderable.material;
				}
			});
		},

		/**
				* Render a single renderable list in camera in sequence.
				* @param {Array} list - List of all renderables.
				* @param {zen3d.Camera} camera - Camera provide view matrix and porjection matrix.
				* @param {Object} [config=] - The config for this render.
				* @param {Function} [config.getMaterial=] - Get renderable material.
				* @param {Function} [config.beforeRender=] - Before render each renderable.
				* @param {Function} [config.afterRender=] - After render each renderable
				* @param {Function} [config.ifRender=] - If render the renderable.
				* @param {zen3d.Scene} [config.scene=] - Rendering scene, have some rendering context.
				*/
		renderPass: function renderPass(renderList, camera, config) {
			config = config || {};
			var state = this.state;
			var capabilities = this.capabilities;
			var getMaterial = config.getMaterial || defaultGetMaterial;
			var beforeRender = config.beforeRender || noop;
			var afterRender = config.afterRender || noop;
			var ifRender = config.ifRender || defaultIfRender;
			var scene = config.scene || {};
			var currentRenderTarget = state.currentRenderTarget;

			for (var i = 0, l = renderList.length; i < l; i++) {
				var renderItem = renderList[i];

				if (!ifRender(renderItem)) {
					continue;
				}

				var object = renderItem.object;
				var material = getMaterial.call(this, renderItem);
				var geometry = renderItem.geometry;
				var group = renderItem.group;
				object.onBeforeRender(renderItem, material);
				beforeRender.call(this, renderItem, material);
				var materialProperties = this.properties.get(material);

				if (material.needsUpdate === false) {
					if (materialProperties.program === undefined) {
						material.needsUpdate = true;
					} else if (materialProperties.fog !== scene.fog) {
						material.needsUpdate = true;
					} else if (scene.clippingPlanes && scene.clippingPlanes.length !== materialProperties.numClippingPlanes) {
						material.needsUpdate = true;
					} else if (camera.outputEncoding !== materialProperties.outputEncoding || camera.gammaFactor !== materialProperties.gammaFactor) {
						material.needsUpdate = true;
					} else if (capabilities.version > 1 && scene.disableShadowSampler !== materialProperties.disableShadowSampler) {
						material.needsUpdate = true;
					} else {
						var acceptLight = material.acceptLight && !!scene.lights && scene.lights.totalNum > 0;

						if (acceptLight !== materialProperties.acceptLight) {
							material.needsUpdate = true;
						} else if (acceptLight) {
							if (!scene.lights.hash.compare(materialProperties.lightsHash) || object.receiveShadow !== materialProperties.receiveShadow || object.shadowType !== materialProperties.shadowType) {
								material.needsUpdate = true;
							}
						}
					}
				}

				if (material.needsUpdate) {
					if (materialProperties.program === undefined) {
						material.addEventListener('dispose', this.onMaterialDispose, this);
					}

					var oldProgram = materialProperties.program;
					materialProperties.program = this.programs.getProgram(camera, material, object, scene);

					if (oldProgram) {
						this.programs.releaseProgram(oldProgram);
					}

					materialProperties.fog = scene.fog;

					if (scene.lights) {
						materialProperties.acceptLight = material.acceptLight;
						materialProperties.lightsHash = scene.lights.hash.copyTo(materialProperties.lightsHash);
						materialProperties.receiveShadow = object.receiveShadow;
						materialProperties.shadowType = object.shadowType;
					} else {
						materialProperties.acceptLight = false;
					}

					materialProperties.numClippingPlanes = scene.clippingPlanes ? scene.clippingPlanes.length : 0;
					materialProperties.outputEncoding = camera.outputEncoding;
					materialProperties.gammaFactor = camera.gammaFactor;
					materialProperties.disableShadowSampler = scene.disableShadowSampler;
					material.needsUpdate = false;
				}

				var program = materialProperties.program;
				state.setProgram(program);
				this.geometry.setGeometry(geometry); // update morph targets

				if (object.morphTargetInfluences) {
					this.updateMorphtargets(object, geometry, program);
				}

				this.vertexArrayBindings.setup(object, geometry, program); // update uniforms

				var uniforms = program.uniforms;

				for (var n = 0, ll = uniforms.seq.length; n < ll; n++) {
					var uniform = uniforms.seq[n];
					var key = uniform.id; // upload custom uniforms

					if (material.uniforms && material.uniforms[key] !== undefined) {
						uniform.set(material.uniforms[key], this);
						continue;
					}

					switch (key) {
						// pvm matrix
						case "u_Projection":
							uniform.set(camera.projectionMatrix.elements);
							break;

						case "u_View":
							uniform.set(camera.viewMatrix.elements);
							break;

						case "u_Model":
							var modelMatrix = object.worldMatrix.elements;
							uniform.set(modelMatrix);
							break;

						case "u_Color":
							var color = material.diffuse;
							uniform.setValue(color.r, color.g, color.b);
							break;

						case "u_Opacity":
							uniform.set(material.opacity);
							break;

						case "diffuseMap":
							uniform.set(material.diffuseMap, this);
							break;

						case "alphaMap":
							uniform.set(material.alphaMap, this);
							break;

						case "normalMap":
							uniform.set(material.normalMap, this);
							break;

						case "bumpMap":
							uniform.set(material.bumpMap, this);
							break;

						case "bumpScale":
							uniform.set(material.bumpScale);
							break;

						case "envMap":
							uniform.set(material.envMap, this);
							break;

						case "cubeMap":
							uniform.set(material.cubeMap, this);
							break;

						case "u_EnvMap_Intensity":
							uniform.set(material.envMapIntensity);
							break;

						case "maxMipLevel":
							uniform.set(this.properties.get(material.envMap).__maxMipLevel || 0);
							break;

						case "u_Specular":
							uniform.set(material.shininess);
							break;

						case "u_SpecularColor":
							var color = material.specular;
							uniform.setValue(color.r, color.g, color.b);
							break;

						case "specularMap":
							uniform.set(material.specularMap, this);
							break;

						case "aoMap":
							uniform.set(material.aoMap, this);
							break;

						case "aoMapIntensity":
							uniform.set(material.aoMapIntensity);
							break;

						case "u_Roughness":
							uniform.set(material.roughness);
							break;

						case "roughnessMap":
							uniform.set(material.roughnessMap, this);
							break;

						case "u_Metalness":
							uniform.set(material.metalness);
							break;

						case "metalnessMap":
							uniform.set(material.metalnessMap, this);
							break;

						case "glossiness":
							uniform.set(material.glossiness);
							break;

						case "glossinessMap":
							uniform.set(material.glossinessMap, this);
							break;

						case "emissive":
							var color = material.emissive;
							var intensity = material.emissiveIntensity;
							uniform.setValue(color.r * intensity, color.g * intensity, color.b * intensity);
							break;

						case "emissiveMap":
							uniform.set(material.emissiveMap, this);
							break;

						case "u_CameraPosition":
							helpVector3.setFromMatrixPosition(camera.worldMatrix);
							uniform.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
							break;

						case "u_FogColor":
							var color = scene.fog.color;
							uniform.setValue(color.r, color.g, color.b);
							break;

						case "u_FogDensity":
							uniform.set(scene.fog.density);
							break;

						case "u_FogNear":
							uniform.set(scene.fog.near);
							break;

						case "u_FogFar":
							uniform.set(scene.fog.far);
							break;

						case "u_PointSize":
							uniform.set(material.size);
							break;

						case "u_PointScale":
							var scale = currentRenderTarget.height * 0.5; // three.js do this

							uniform.set(scale);
							break;

						case "dashSize":
							uniform.set(material.dashSize);
							break;

						case "totalSize":
							uniform.set(material.dashSize + material.gapSize);
							break;

						case "scale":
							uniform.set(material.scale);
							break;

						case "matcap":
							uniform.set(material.matcap, this);
							break;

						case "clippingPlanes":
							var planesData = getClippingPlanesData(scene.clippingPlanes || []);
							uniform.set(planesData);
							break;

						case "uvTransform":
							var uvScaleMap;
							uvScaleMap = material.diffuseMap || material.specularMap || material.normalMap || material.bumpMap || material.roughnessMap || material.metalnessMap || material.emissiveMap;

							if (uvScaleMap) {
								if (uvScaleMap.matrixAutoUpdate) {
									uvScaleMap.updateMatrix();
								}

								uniform.set(uvScaleMap.matrix.elements);
							}

							break;

						case "alphaMapUVTransform":
							material.alphaMap.updateMatrix();
							uniform.set(material.alphaMap.matrix.elements);
					}
				} // boneMatrices


				if (object.type === OBJECT_TYPE.SKINNED_MESH) {
					this.uploadSkeleton(uniforms, object, program.program);
				}

				if (material.acceptLight && scene.lights) {
					this.uploadLights(uniforms, scene.lights, scene.disableShadowSampler);
				}

				var frontFaceCW = object.worldMatrix.determinant() < 0;
				this.setStates(material, frontFaceCW);
				var viewport = helpVector4.set(currentRenderTarget.width, currentRenderTarget.height, currentRenderTarget.width, currentRenderTarget.height).multiply(camera.rect);
				viewport.z -= viewport.x;
				viewport.w -= viewport.y;
				viewport.x = Math.floor(viewport.x);
				viewport.y = Math.floor(viewport.y);
				viewport.z = Math.floor(viewport.z);
				viewport.w = Math.floor(viewport.w);
				state.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
				this.draw(geometry, material, group);
				this.vertexArrayBindings.resetBinding(); // reset used tex Unit

				this._usedTextureUnits = 0; // Ensure depth buffer writing is enabled so it can be cleared on next render

				state.depthBuffer.setTest(true);
				state.depthBuffer.setMask(true);
				state.colorBuffer.setMask(true);
				afterRender(this, renderItem);
				object.onAfterRender(renderItem);
			}
		},
		// Set states.
		setStates: function setStates(material, frontFaceCW) {
			var state = this.state; // set draw side

			state.setCullFace(material.side === DRAW_SIDE.DOUBLE ? CULL_FACE_TYPE.NONE : CULL_FACE_TYPE.BACK);
			var flipSided = material.side === DRAW_SIDE.BACK;
			if (frontFaceCW) flipSided = !flipSided;
			state.setFlipSided(flipSided); // set blend state

			if (material.transparent) {
				state.setBlend(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha);
			} else {
				state.setBlend(BLEND_TYPE.NONE);
			} // set buffers state


			state.depthBuffer.setFunc(material.depthFunc);
			state.depthBuffer.setTest(material.depthTest);
			state.depthBuffer.setMask(material.depthWrite);
			state.colorBuffer.setMask(material.colorWrite); // set stencil buffers

			var stencilTest = material.stencilTest;
			state.stencilBuffer.setTest(stencilTest);

			if (stencilTest) {
				state.stencilBuffer.setMask(material.stencilWriteMask);
				state.stencilBuffer.setFunc(material.stencilFunc, material.stencilRef, material.stencilFuncMask, material.stencilFuncBack, material.stencilRefBack, material.stencilFuncMaskBack);
				state.stencilBuffer.setOp(material.stencilFail, material.stencilZFail, material.stencilZPass, material.stencilFailBack, material.stencilZFailBack, material.stencilZPassBack);
			}

			state.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits); // set line width

			if (material.lineWidth !== undefined) {
				state.setLineWidth(material.lineWidth);
			}
		},
		// GL draw.
		draw: function draw(geometry, material, group) {
			var gl = this.gl;
			var properties = this.properties;
			var capabilities = this.capabilities;
			var useIndexBuffer = geometry.index !== null;
			var drawStart = 0;
			var drawCount = useIndexBuffer ? geometry.index.count : geometry.getAttribute("a_Position").count;
			var groupStart = group ? group.start : 0;
			var groupCount = group ? group.count : Infinity;
			drawStart = Math.max(drawStart, groupStart);
			drawCount = Math.min(drawCount, groupCount);

			if (useIndexBuffer) {
				var indexProperty = properties.get(geometry.index);
				var bytesPerElement = indexProperty.bytesPerElement;
				var type = indexProperty.type;

				if (type === gl.UNSIGNED_INT) {
					if (capabilities.version < 2 && !capabilities.getExtension('OES_element_index_uint')) {
						console.warn("draw elements type not support UNSIGNED_INT!");
					}
				}

				if (geometry.isInstancedGeometry) {
					if (geometry.maxInstancedCount > 0) {
						if (capabilities.version >= 2) {
							gl.drawElementsInstanced(material.drawMode, drawCount, type, drawStart * bytesPerElement, geometry.maxInstancedCount);
						} else if (capabilities.getExtension('ANGLE_instanced_arrays')) {
							capabilities.getExtension('ANGLE_instanced_arrays').drawElementsInstancedANGLE(material.drawMode, drawCount, type, drawStart * bytesPerElement, geometry.maxInstancedCount);
						} else {
							console.warn("no support instanced draw.");
						}
					}
				} else {
					gl.drawElements(material.drawMode, drawCount, type, drawStart * bytesPerElement);
				}
			} else {
				if (geometry.isInstancedGeometry) {
					if (geometry.maxInstancedCount > 0) {
						if (capabilities.version >= 2) {
							gl.drawArraysInstanced(material.drawMode, drawStart, drawCount, geometry.maxInstancedCount);
						} else if (capabilities.getExtension('ANGLE_instanced_arrays')) {
							capabilities.getExtension('ANGLE_instanced_arrays').drawArraysInstancedANGLE(material.drawMode, drawStart, drawCount, geometry.maxInstancedCount);
						} else {
							console.warn("no support instanced draw.");
						}
					}
				} else {
					gl.drawArrays(material.drawMode, drawStart, drawCount);
				}
			}
		},
		// Upload skeleton uniforms.
		uploadSkeleton: function uploadSkeleton(uniforms, object, programId) {
			if (object.skeleton && object.skeleton.bones.length > 0) {
				var skeleton = object.skeleton;
				var capabilities = this.capabilities;
				skeleton.updateBones();

				if (capabilities.maxVertexTextures > 0 && (!!capabilities.getExtension('OES_texture_float') || capabilities.version >= 2)) {
					if (skeleton.boneTexture === undefined) {
						var size = Math.sqrt(skeleton.bones.length * 4);
						size = nextPowerOfTwo(Math.ceil(size));
						size = Math.max(4, size);
						var boneMatrices = new Float32Array(size * size * 4);
						boneMatrices.set(skeleton.boneMatrices);
						var boneTexture = new Texture2D();
						boneTexture.image = {
							data: boneMatrices,
							width: size,
							height: size
						};

						if (capabilities.version >= 2) {
							boneTexture.internalformat = WEBGL_PIXEL_FORMAT.RGBA32F;
							boneTexture.format = WEBGL_PIXEL_FORMAT.RGBA;
						}

						boneTexture.type = WEBGL_PIXEL_TYPE.FLOAT;
						boneTexture.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
						boneTexture.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;
						boneTexture.generateMipmaps = false;
						boneTexture.flipY = false;
						skeleton.boneMatrices = boneMatrices;
						skeleton.boneTexture = boneTexture;
					}

					uniforms.set("boneTexture", skeleton.boneTexture, this);
					uniforms.set("boneTextureSize", skeleton.boneTexture.image.width);
				} else {
					uniforms.set("boneMatrices", skeleton.boneMatrices);
				}

				uniforms.set("bindMatrix", object.bindMatrix.elements);
				uniforms.set("bindMatrixInverse", object.bindMatrixInverse.elements);
			}
		},
		// Upload lights uniforms.
		uploadLights: function uploadLights(uniforms, lights, disableShadowSampler) {
			if (lights.ambientsNum > 0) {
				uniforms.set("u_AmbientLightColor", lights.ambient);
			}

			if (lights.directsNum > 0) {
				uniforms.set("u_Directional", lights.directional);

				if (uniforms.has("directionalShadowMap")) {
					if (this.capabilities.version >= 2 && !disableShadowSampler) {
						uniforms.set("directionalShadowMap", lights.directionalShadowDepthMap, this);
					} else {
						uniforms.set("directionalShadowMap", lights.directionalShadowMap, this);
					}

					uniforms.set("directionalShadowMatrix", lights.directionalShadowMatrix);
				}

				if (uniforms.has("directionalDepthMap")) {
					uniforms.set("directionalDepthMap", lights.directionalShadowMap, this);
				}
			}

			if (lights.pointsNum > 0) {
				uniforms.set("u_Point", lights.point);

				if (uniforms.has("pointShadowMap")) {
					uniforms.set("pointShadowMap", lights.pointShadowMap, this);
				}
			}

			if (lights.spotsNum > 0) {
				uniforms.set("u_Spot", lights.spot);

				if (uniforms.has("spotShadowMap")) {
					if (this.capabilities.version >= 2 && !disableShadowSampler) {
						uniforms.set("spotShadowMap", lights.spotShadowDepthMap, this);
					} else {
						uniforms.set("spotShadowMap", lights.spotShadowMap, this);
					}

					uniforms.set("spotShadowMatrix", lights.spotShadowMatrix);
				}

				if (uniforms.has("spotDepthMap")) {
					uniforms.set("spotDepthMap", lights.spotShadowMap, this);
				}
			}
		},
		// Alloc texture unit.
		allocTexUnit: function allocTexUnit() {
			var textureUnit = this._usedTextureUnits;

			if (textureUnit >= this.capabilities.maxTextures) {
				console.warn('trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);
			}

			this._usedTextureUnits += 1;
			return textureUnit;
		},
		updateMorphtargets: function updateMorphtargets(object, geometry, program) {
			var objectInfluences = object.morphTargetInfluences;

			if (!influencesList.has(geometry)) {
				influencesList.set(geometry, objectInfluences.slice(0));
			}

			var morphTargets = geometry.morphAttributes.position;
			var morphNormals = geometry.morphAttributes.normal; // Remove current morphAttributes

			var influences = influencesList.get(geometry);

			for (var i = 0; i < influences.length; i++) {
				var influence = influences[i];

				if (influence !== 0) {
					if (morphTargets) geometry.removeAttribute('morphTarget' + i);
					if (morphNormals) geometry.removeAttribute('morphNormal' + i);
				}
			} // Collect influences


			for (var i = 0; i < objectInfluences.length; i++) {
				influences[i] = objectInfluences[i];
			}

			influences.length = objectInfluences.length; // Add morphAttributes

			var count = 0;

			for (var i = 0; i < influences.length; i++) {
				var influence = influences[i];

				if (influence > 0) {
					if (morphTargets) geometry.addAttribute('morphTarget' + count, morphTargets[i]);
					if (morphNormals) geometry.addAttribute('morphNormal' + count, morphNormals[i]);
					morphInfluences[count] = influence;
					count++;
				}
			}

			for (; count < 8; count++) {
				morphInfluences[count] = 0;
			}

			program.uniforms.set('morphTargetInfluences', morphInfluences);
		},
		onMaterialDispose: function onMaterialDispose(event) {
			var material = event.target;
			var materialProperties = this.properties.get(material);
			material.removeEventListener('dispose', this.onMaterialDispose, this);
			var program = materialProperties.program;

			if (program !== undefined) {
				// release program reference
				this.programs.releaseProgram(program);
			}

			this.properties.delete(material);
		}
	});

	var _mat4_1$3 = new Matrix4();
	/**
	 * The camera used for rendering a 3D scene.
	 * @memberof zen3d
	 * @constructor
	 * @extends zen3d.Object3D
	 */


	function Camera() {
		Object3D.call(this);
		this.type = OBJECT_TYPE.CAMERA;
		/**
				* This is the inverse of worldMatrix.
				* @type {zen3d.Matrix4}
				*/

		this.viewMatrix = new Matrix4();
		/**
				* This is the matrix which contains the projection.
				* @type {zen3d.Matrix4}
				*/

		this.projectionMatrix = new Matrix4();
		/**
				* This is the matrix which contains the projection.
				* @type {zen3d.Matrix4}
				*/

		this.projectionMatrixInverse = new Matrix4();
		/**
				* The frustum of the camera.
				* @type {zen3d.Frustum}
				*/

		this.frustum = new Frustum(); // gamma space or linear space

		/**
				* The factor of gamma.
				* @type {number}
				* @default 2.0
				*/

		this.gammaFactor = 2.0;
		/**
				* Output pixel encoding.
				* @type {zen3d.TEXEL_ENCODING_TYPE}
				* @default zen3d.TEXEL_ENCODING_TYPE.LINEAR
				*/

		this.outputEncoding = TEXEL_ENCODING_TYPE.LINEAR;
		/**
				* Where on the screen is the camera rendered in normalized coordinates.
				* @type {zen3d.Vector4}
				* @default zen3d.Vector4(0, 0, 1, 1)
				*/

		this.rect = new Vector4(0, 0, 1, 1);
		/**
				* When this is set, it checks every frame if objects are in the frustum of the camera before rendering objects.
				* Otherwise objects gets rendered every frame even if it isn't visible.
				* @type {boolean}
				* @default true
				*/

		this.frustumCulled = true;
	}

	Camera.prototype = Object.assign(Object.create(Object3D.prototype),
	/** @lends zen3d.Camera.prototype */
	{
		constructor: Camera,

		/**
				* Set view by look at, this func will set quaternion of this camera.
				* @method
				* @param {zen3d.Vector3} target - The target that the camera look at.
				* @param {zen3d.Vector3} up - The up direction of the camera.
				*/
		lookAt: function lookAt(target, up) {
			_mat4_1$3.lookAtRH(this.position, target, up);

			this.quaternion.setFromRotationMatrix(_mat4_1$3);
		},

		/**
				* Set orthographic projection matrix.
				* @param {number} left — Camera frustum left plane.
				* @param {number} right — Camera frustum right plane.
				* @param {number} bottom — Camera frustum bottom plane.
				* @param {number} top — Camera frustum top plane.
				* @param {number} near — Camera frustum near plane.
				* @param {number} far — Camera frustum far plane.
				*/
		setOrtho: function setOrtho(left, right, bottom, top, near, far) {
			this.projectionMatrix.set(2 / (right - left), 0, 0, -(right + left) / (right - left), 0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom), 0, 0, -2 / (far - near), -(far + near) / (far - near), 0, 0, 0, 1);
			this.projectionMatrixInverse.getInverse(this.projectionMatrix);
		},

		/**
				* Set perspective projection matrix.
				* @param {number} fov — Camera frustum vertical field of view.
				* @param {number} aspect — Camera frustum aspect ratio.
				* @param {number} near — Camera frustum near plane.
				* @param {number} far — Camera frustum far plane.
				*/
		setPerspective: function setPerspective(fov, aspect, near, far) {
			this.projectionMatrix.set(1 / (aspect * Math.tan(fov / 2)), 0, 0, 0, 0, 1 / Math.tan(fov / 2), 0, 0, 0, 0, -(far + near) / (far - near), -2 * far * near / (far - near), 0, 0, -1, 0);
			this.projectionMatrixInverse.getInverse(this.projectionMatrix);
		},
		getWorldDirection: function getWorldDirection(optionalTarget) {
			optionalTarget = optionalTarget || new Vector3();
			var e = this.worldMatrix.elements;
			return optionalTarget.set(-e[8], -e[9], -e[10]).normalize();
		},
		updateMatrix: function updateMatrix(force) {
			Object3D.prototype.updateMatrix.call(this, force);
			this.viewMatrix.getInverse(this.worldMatrix); // update view matrix

			_mat4_1$3.multiplyMatrices(this.projectionMatrix, this.viewMatrix); // get PV matrix


			this.frustum.setFromMatrix(_mat4_1$3); // update frustum
		},
		copy: function copy(source, recursive) {
			Object3D.prototype.copy.call(this, source, recursive);
			this.viewMatrix.copy(source.viewMatrix);
			this.projectionMatrix.copy(source.projectionMatrix);
			this.projectionMatrixInverse.copy(source.projectionMatrixInverse);
			this.frustum.copy(source.frustum);
			this.gammaFactor = source.gammaFactor;
			this.outputEncoding = source.outputEncoding;
			this.rect.copy(source.rect);
			this.frustumCulled = source.frustumCulled;
			return this;
		}
	});
	Object.defineProperties(Camera.prototype, {
		gammaInput: {
			get: function get() {
				console.warn("zen3d.Camera: .gammaInput has been removed. Use texture.encoding instead.");
				return false;
			},
			set: function set(value) {
				console.warn("zen3d.Camera: .gammaInput has been removed. Use texture.encoding instead.");
			}
		},
		gammaOutput: {
			get: function get() {
				console.warn("zen3d.Camera: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
				return this.outputEncoding == TEXEL_ENCODING_TYPE.GAMMA;
			},
			set: function set(value) {
				console.warn("zen3d.Camera: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");

				if (value) {
					this.outputEncoding = TEXEL_ENCODING_TYPE.GAMMA;
				} else {
					this.outputEncoding = TEXEL_ENCODING_TYPE.LINEAR;
				}
			}
		}
	});

	/**
	 * Render Target is the wrapping class of gl.framebuffer.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.EventDispatcher
	 * @abstract
	 * @param {number} width - The width of the render target.
	 * @param {number} height - The height of the render target.
	 */

	function RenderTargetBase(width, height) {
		EventDispatcher.call(this);
		/**
				* The width of the render target.
				* @type {number}
				*/

		this.width = width;
		/**
				* The height of the render target.
				* @type {number}
				*/

		this.height = height;
	}

	RenderTargetBase.prototype = Object.assign(Object.create(EventDispatcher.prototype),
	/** @lends zen3d.RenderTargetBase.prototype */
	{
		constructor: RenderTargetBase,
		isRenderTarget: true,

		/**
				* Resize the render target.
				* @param {number} width - The width of the render target.
				* @param {number} height - The height of the render target.
				* @return {boolean} - If size changed.
				*/
		resize: function resize(width, height) {
			if (this.width !== width || this.height !== height) {
				this.dispose();
				this.width = width;
				this.height = height;
				return true;
			}

			return false;
		},

		/**
				* Dispatches a dispose event.
				*/
		dispose: function dispose() {
			this.dispatchEvent({
				type: 'dispose'
			});
		}
	});

	/**
	 * Render Buffer can be attached to RenderTarget
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.EventDispatcher
	 */

	function RenderBuffer(width, height, format, multipleSampling) {
		EventDispatcher.call(this);
		/**
				* The width of the render buffer.
				* @type {number}
				*/

		this.width = width;
		/**
				* The height of the render buffer.
				* @type {number}
				*/

		this.height = height;
		/**
				* Render buffer texel storage data format.
				* DEPTH_COMPONENT16: for depth attachments.
				* DEPTH_STENCIL: for depth stencil attachments.
				* RGBA8：for multiple sampled color attachments.
				* DEPTH_COMPONENT16: for multiple sampled depth attachments.
				* DEPTH24_STENCIL8: for multiple sampled depth stencil attachments.
				* @type {zen3d.WEBGL_PIXEL_FORMAT}
				* @default zen3d.WEBGL_PIXEL_FORMAT.RGBA8
				*/

		this.format = format !== undefined ? format : WEBGL_PIXEL_FORMAT.RGBA8;
		/**
				* If bigger than zero, this renderBuffer will support multipleSampling. (Only usable in WebGL 2.0)
				* A Render Target's attachments must have the same multipleSampling value.
				* Texture can't be attached to the same render target with a multiple sampled render buffer.
				* Max support 8.
				* @type {number}
				* @default 0
				*/

		this.multipleSampling = multipleSampling !== undefined ? multipleSampling : 0;
	}

	RenderBuffer.prototype = Object.assign(Object.create(EventDispatcher.prototype),
	/** @lends zen3d.RenderBuffer.prototype */
	{
		constructor: RenderBuffer,
		isRenderBuffer: true,

		/**
				* Resize the render buffer.
				* @param {number} width - The width of the render buffer.
				* @param {number} height - The height of the render buffer.
				* @return {boolean} - If size changed.
				*/
		resize: function resize(width, height) {
			if (this.width !== width || this.height !== height) {
				this.dispose();
				this.width = width;
				this.height = height;
				return true;
			}

			return false;
		},

		/**
				* Returns a clone of this render buffer.
				* @return {zen3d.RenderBuffer}
				*/
		clone: function clone() {
			return new this.constructor().copy(this);
		},

		/**
				* Copy the given render buffer into this render buffer.
				* @param {zen3d.RenderBuffer} source - The render buffer to be copied.
				* @return {zen3d.RenderBuffer}
				*/
		copy: function copy(source) {
			this.format = source.format;
			this.multipleSampling = source.multipleSampling;
			return this;
		},

		/**
				* Dispatches a dispose event.
				*/
		dispose: function dispose() {
			this.dispatchEvent({
				type: 'dispose'
			});
		}
	});

	/**
	 * Render Target that render to cube texture.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.RenderTargetBase
	 * @param {number} width - The width of the render target.
	 * @param {number} height - The height of the render target.
	 */

	function RenderTargetCube(width, height) {
		RenderTargetBase.call(this, width, height);
		this._attachments = {};
		this.attach(new TextureCube(), ATTACHMENT.COLOR_ATTACHMENT0);
		this.attach(new RenderBuffer(width, height, WEBGL_PIXEL_FORMAT.DEPTH_STENCIL), ATTACHMENT.DEPTH_STENCIL_ATTACHMENT);
		/**
				* The activeCubeFace property corresponds to a cube side (PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5).
				* @type {number}
				* @default 0
				*/

		this.activeCubeFace = 0;
	}

	RenderTargetCube.prototype = Object.create(RenderTargetBase.prototype);
	RenderTargetCube.prototype.constructor = RenderTargetCube;
	RenderTargetCube.prototype = Object.assign(Object.create(RenderTargetBase.prototype),
	/** @lends zen3d.RenderTargetCube.prototype */
	{
		constructor: RenderTargetCube,

		/**
				* Attach a texture(RTT) or renderbuffer to the framebuffer.
				* Notice: For now, dynamic Attachment during rendering is not supported.
				* @param	{zen3d.TextureCube|zen3d.RenderBuffer} target
				* @param	{zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
				*/
		attach: function attach(target, attachment) {
			if (target.isTexture) {
				var changed = false;

				for (var i = 0; i < 6; i++) {
					if (target.images[i] && target.images[i].rtt) {
						if (target.images[i].width !== this.width || target.images[i].height !== this.height) {
							target.images[i].width = this.width;
							target.images[i].height = this.height;
							changed = true;
						}
					} else {
						target.images[i] = {
							rtt: true,
							data: null,
							width: this.width,
							height: this.height
						};
						changed = true;
					}
				}

				if (changed) {
					target.version++;
				}
			} else {
				target.resize(this.width, this.height);
			}

			this._attachments[attachment || ATTACHMENT.COLOR_ATTACHMENT0] = target;
		},

		/**
				* Detach a or renderbuffer.
				* @param	{zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
				*/
		detach: function detach(attachment) {
			delete this._attachments[attachment || ATTACHMENT.COLOR_ATTACHMENT0];
		},

		/**
				* @override
				*/
		resize: function resize(width, height) {
			var changed = RenderTargetBase.prototype.resize.call(this, width, height);

			if (changed) {
				for (var attachment in this._attachments) {
					var target = this._attachments[attachment];

					if (target.isTexture) {
						for (var i = 0; i < 6; i++) {
							target.images[i] = {
								rtt: true,
								data: null,
								width: this.width,
								height: this.height
							};
						}

						target.version++;
					} else {
						target.resize(width, height);
					}
				}
			}
		}
	});
	Object.defineProperties(RenderTargetCube.prototype, {
		texture: {
			set: function set(texture) {
				if (texture) {
					if (texture.isTexture) {
						this.attach(texture, ATTACHMENT.COLOR_ATTACHMENT0);
					}
				} else {
					this.detach(ATTACHMENT.COLOR_ATTACHMENT0);
				}
			},
			get: function get() {
				var target = this._attachments[ATTACHMENT.COLOR_ATTACHMENT0];
				return target.isTexture ? target : null;
			}
		}
	});

	/**
	 * environment map pre pass.
	 * @constructor
	 * @memberof zen3d
	 * @param {zen3d.RenderTargetCube} [renderTarget=] - The environment render is done to the renderTarget (if specified).
	 */

	function EnvironmentMapPass(renderTarget) {
		this.camera = new Camera();
		this.targets = [new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)];
		this.ups = [new Vector3(0, -1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(0, -1, 0)];
		this.camera.setPerspective(90 / 180 * Math.PI, 1, 1, 1000);
		this.position = new Vector3();
		this.lookTarget = new Vector3();
		this.renderTarget = renderTarget || new RenderTargetCube(512, 512);
		this.renderTexture = this.renderTarget.texture;
		this.renderTexture.minFilter = WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;
	}
	/**
	 * Render environment map.
	 * @param {zen3d.WebGLCore} glCore
	 * @param {zen3d.Scene} scene
	 */


	EnvironmentMapPass.prototype.render = function (glCore, scene) {
		this.camera.position.copy(this.position);

		for (var i = 0; i < 6; i++) {
			this.lookTarget.set(this.targets[i].x + this.camera.position.x, this.targets[i].y + this.camera.position.y, this.targets[i].z + this.camera.position.z);
			this.camera.lookAt(this.lookTarget, this.ups[i]);
			this.camera.updateMatrix();
			this.renderTarget.activeCubeFace = i;
			glCore.renderTarget.setRenderTarget(this.renderTarget);
			glCore.clear(true, true, true);
			glCore.render(scene, this.camera);
			glCore.renderTarget.updateRenderTargetMipmap(this.renderTarget);
		}
	};

	var shadowSide = {
		"front": DRAW_SIDE.BACK,
		"back": DRAW_SIDE.FRONT,
		"double": DRAW_SIDE.DOUBLE
	};
	var defaultDepthMaterial = new DepthMaterial();
	defaultDepthMaterial.packToRGBA = true;
	var defaultDistanceMaterial = new DistanceMaterial();
	defaultDistanceMaterial.uniforms = {};

	function _getDepthMaterial(renderable, light) {
		defaultDepthMaterial.side = shadowSide[renderable.material.side];
		return defaultDepthMaterial;
	}

	function _getDistanceMaterial(renderable, light) {
		defaultDistanceMaterial.side = shadowSide[renderable.material.side];
		defaultDistanceMaterial.uniforms["nearDistance"] = light.shadow.cameraNear;
		defaultDistanceMaterial.uniforms["farDistance"] = light.shadow.cameraFar;
		return defaultDistanceMaterial;
	}

	var oldClearColor = new Vector4();
	/**
	 * Shadow map pre pass.
	 * @constructor
	 * @memberof zen3d
	 */

	function ShadowMapPass() {
		/**
		 * Get depth material function.
		 * Override this to use custom depth material.
		 * @type {Function}
		 */
		this.getDepthMaterial = _getDepthMaterial;
		/**
		 * Get distance material function.
		 * Override this to use custom distance material.
		 * @type {Function}
		 */

		this.getDistanceMaterial = _getDistanceMaterial;
	}
	/**
	 * Render shadow map.
	 * @param {zen3d.WebGLCore} glCore
	 * @param {zen3d.Scene} scene
	 */


	ShadowMapPass.prototype.render = function (glCore, scene) {
		var gl = glCore.gl;
		var state = glCore.state;
		var getDepthMaterial = this.getDepthMaterial;
		var getDistanceMaterial = this.getDistanceMaterial; // force disable stencil

		var useStencil = state.states[gl.STENCIL_TEST];

		if (useStencil) {
			state.stencilBuffer.setTest(false);
		}

		oldClearColor.copy(state.colorBuffer.getClear());
		state.colorBuffer.setClear(1, 1, 1, 1);
		var lights = scene.lights.shadows;

		for (var i = 0; i < lights.length; i++) {
			var light = lights[i];
			var shadow = light.shadow;
			if (shadow.autoUpdate === false && shadow.needsUpdate === false) continue;
			var camera = shadow.camera;
			var shadowTarget = shadow.renderTarget;
			var isPointLight = light.lightType == LIGHT_TYPE.POINT ? true : false;
			var faces = isPointLight ? 6 : 1;

			if (glCore.capabilities.version >= 2) {
				if (!isPointLight && !shadow.depthMap && !glCore.disableShadowSampler) {
					shadow._initDepthMap();
				}
			}

			for (var j = 0; j < faces; j++) {
				if (isPointLight) {
					shadow.update(light, j);
					shadowTarget.activeCubeFace = j;
				} else {
					shadow.update(light);
				}

				var renderList = scene.updateRenderList(camera);
				glCore.renderTarget.setRenderTarget(shadowTarget);
				glCore.clear(true, true);
				glCore.renderPass(renderList.opaque, camera, {
					getMaterial: function getMaterial(renderable) {
						return isPointLight ? getDistanceMaterial(renderable, light) : getDepthMaterial(renderable, light);
					},
					ifRender: function ifRender(renderable) {
						return renderable.object.castShadow;
					}
				}); // ignore transparent objects?
			} // set generateMipmaps false
			// glCore.renderTarget.updateRenderTargetMipmap(shadowTarget);


			shadow.needsUpdate = false;
		}

		if (useStencil) {
			state.stencilBuffer.setTest(true);
		}

		state.colorBuffer.setClear(oldClearColor.x, oldClearColor.y, oldClearColor.z, oldClearColor.w);
	};

	var helpVector3$1 = new Vector3();
	var lightCaches = new WeakMap();

	function getLightCache(light) {
		if (lightCaches.has(light)) {
			return lightCaches.get(light);
		}

		var cache;

		switch (light.lightType) {
			case LIGHT_TYPE.DIRECT:
				cache = {
					direction: new Float32Array(3),
					color: new Float32Array([0, 0, 0, 1]),
					shadow: 0,
					shadowBias: 0,
					shadowRadius: 1,
					shadowMapSize: new Float32Array(2)
				};
				break;

			case LIGHT_TYPE.POINT:
				cache = {
					position: new Float32Array(3),
					color: new Float32Array([0, 0, 0, 1]),
					distance: 0,
					decay: 0,
					shadow: 0,
					shadowBias: 0,
					shadowRadius: 1,
					shadowMapSize: new Float32Array(2),
					shadowCameraNear: 1,
					shadowCameraFar: 1000
				};
				break;

			case LIGHT_TYPE.SPOT:
				cache = {
					position: new Float32Array(3),
					direction: new Float32Array(3),
					color: new Float32Array([0, 0, 0, 1]),
					distance: 0,
					coneCos: 0,
					penumbraCos: 0,
					decay: 0,
					shadow: 0,
					shadowBias: 0,
					shadowRadius: 1,
					shadowMapSize: new Float32Array(2)
				};
				break;
		}

		lightCaches.set(light, cache);
		return cache;
	}

	function LightHash() {
		this._factor = new Uint16Array(4);
	}

	Object.assign(LightHash.prototype, {
		update: function update(lights) {
			this._factor[0] = lights.ambientsNum;
			this._factor[1] = lights.directsNum;
			this._factor[2] = lights.pointsNum;
			this._factor[3] = lights.spotsNum;
		},
		compare: function compare(factor) {
			if (!factor) {
				return false;
			}

			return !(this._factor[0] !== factor[0] || this._factor[1] !== factor[1] || this._factor[2] !== factor[2] || this._factor[3] !== factor[3]);
		},
		copyTo: function copyTo(factor) {
			if (!factor) {
				factor = new Uint16Array(4);
			}

			factor.set(this._factor);
			return factor;
		}
	});
	/**
	 * Light cache collect all lights in the scene.
	 * @constructor
	 * @hideconstructor
	 * @memberof zen3d
	 */

	function LightCache() {
		this.ambient = new Float32Array([0, 0, 0]);
		this.directional = [];
		this.directionalShadowMap = [];
		this.directionalShadowDepthMap = [];
		this.directionalShadowMatrix = [];
		this.point = [];
		this.pointShadowMap = [];
		this.pointShadowMatrix = [];
		this.spot = [];
		this.spotShadowMap = [];
		this.spotShadowDepthMap = [];
		this.spotShadowMatrix = [];
		this.shadows = [];
		this.ambientsNum = 0;
		this.directsNum = 0;
		this.pointsNum = 0;
		this.spotsNum = 0;
		this.directShadowNum = 0;
		this.pointShadowNum = 0;
		this.spotShadowNum = 0;
		this.shadowsNum = 0;
		this.totalNum = 0;
		this.hash = new LightHash();
	}

	Object.assign(LightCache.prototype, {
		/**
				* Mark count start.
				* @memberof zen3d.LightCache#
				*/
		startCount: function startCount() {
			for (var i = 0; i < 3; i++) {
				this.ambient[i] = 0;
			}

			this.shadows.length = 0;
			this.ambientsNum = 0;
			this.directsNum = 0;
			this.pointsNum = 0;
			this.spotsNum = 0;
			this.directShadowNum = 0;
			this.pointShadowNum = 0;
			this.spotShadowNum = 0;
			this.shadowsNum = 0;
			this.totalNum = 0;
		},

		/**
				* Collect a light.
				* @memberof zen3d.LightCache#
				* @param {zen3d.Light} object - The light to be collected.
				*/
		add: function add(object) {
			if (object.lightType == LIGHT_TYPE.AMBIENT) {
				this._doAddAmbientLight(object);
			} else if (object.lightType == LIGHT_TYPE.DIRECT) {
				this._doAddDirectLight(object);
			} else if (object.lightType == LIGHT_TYPE.POINT) {
				this._doAddPointLight(object);
			} else if (object.lightType == LIGHT_TYPE.SPOT) {
				this._doAddSpotLight(object);
			}

			if (object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
				this.shadows.push(object);
				this.shadowsNum++;
			}

			this.totalNum++;
		},

		/**
				* Mark count finished.
				* @memberof zen3d.LightCache#
				*/
		endCount: function endCount() {
			this.hash.update(this);
		},
		_doAddAmbientLight: function _doAddAmbientLight(object) {
			var intensity = object.intensity;
			var color = object.color;
			this.ambient[0] += color.r * intensity;
			this.ambient[1] += color.g * intensity;
			this.ambient[2] += color.b * intensity;
			this.ambientsNum++;
		},
		_doAddDirectLight: function _doAddDirectLight(object) {
			var intensity = object.intensity;
			var color = object.color;
			var cache = getLightCache(object);
			cache.color[0] = color.r * intensity;
			cache.color[1] = color.g * intensity;
			cache.color[2] = color.b * intensity;
			var direction = helpVector3$1;
			object.getWorldDirection(direction); // direction.transformDirection(camera.viewMatrix);

			cache.direction[0] = direction.x;
			cache.direction[1] = direction.y;
			cache.direction[2] = direction.z;

			if (object.castShadow) {
				cache.shadow = 1;
				cache.shadowBias = object.shadow.bias;
				cache.shadowRadius = object.shadow.radius;
				cache.shadowMapSize[0] = object.shadow.mapSize.x;
				cache.shadowMapSize[1] = object.shadow.mapSize.y;
				this.directShadowNum++;
			} else {
				cache.shadow = 0;
			}

			if (object.castShadow) {
				// resize typed array
				var needSize = (this.directsNum + 1) * 16;

				if (this.directionalShadowMatrix.length < needSize) {
					var old = this.directionalShadowMatrix;
					this.directionalShadowMatrix = new Float32Array(needSize);
					this.directionalShadowMatrix.set(old);
				}

				this.directionalShadowMatrix.set(object.shadow.matrix.elements, this.directsNum * 16);
				this.directionalShadowMap[this.directsNum] = object.shadow.map;
				this.directionalShadowDepthMap[this.directsNum] = object.shadow.depthMap;
			}

			this.directional[this.directsNum] = cache;
			this.directsNum++;
		},
		_doAddPointLight: function _doAddPointLight(object) {
			var intensity = object.intensity;
			var color = object.color;
			var distance = object.distance;
			var decay = object.decay;
			var cache = getLightCache(object);
			cache.color[0] = color.r * intensity;
			cache.color[1] = color.g * intensity;
			cache.color[2] = color.b * intensity;
			cache.distance = distance;
			cache.decay = decay;
			var position = helpVector3$1.setFromMatrixPosition(object.worldMatrix); // .applyMatrix4(camera.viewMatrix);

			cache.position[0] = position.x;
			cache.position[1] = position.y;
			cache.position[2] = position.z;

			if (object.castShadow) {
				cache.shadow = 1;
				cache.shadowBias = object.shadow.bias;
				cache.shadowRadius = object.shadow.radius;
				cache.shadowMapSize[0] = object.shadow.mapSize.x;
				cache.shadowMapSize[1] = object.shadow.mapSize.y;
				cache.shadowCameraNear = object.shadow.cameraNear;
				cache.shadowCameraFar = object.shadow.cameraFar;
				this.pointShadowNum++;
			} else {
				cache.shadow = 0;
			}

			if (object.castShadow) {
				// resize typed array
				var needSize = (this.pointsNum + 1) * 16;

				if (this.pointShadowMatrix.length < needSize) {
					var old = this.pointShadowMatrix;
					this.pointShadowMatrix = new Float32Array(needSize);
					this.pointShadowMatrix.set(old);
				}

				this.pointShadowMatrix.set(object.shadow.matrix.elements, this.pointsNum * 16);
				this.pointShadowMap[this.pointsNum] = object.shadow.map;
			}

			this.point[this.pointsNum] = cache;
			this.pointsNum++;
		},
		_doAddSpotLight: function _doAddSpotLight(object) {
			var intensity = object.intensity;
			var color = object.color;
			var distance = object.distance;
			var decay = object.decay;
			var cache = getLightCache(object);
			cache.color[0] = color.r * intensity;
			cache.color[1] = color.g * intensity;
			cache.color[2] = color.b * intensity;
			cache.distance = distance;
			cache.decay = decay;
			var position = helpVector3$1.setFromMatrixPosition(object.worldMatrix); // .applyMatrix4(camera.viewMatrix);

			cache.position[0] = position.x;
			cache.position[1] = position.y;
			cache.position[2] = position.z;
			var direction = helpVector3$1;
			object.getWorldDirection(helpVector3$1); // helpVector3.transformDirection(camera.viewMatrix);

			cache.direction[0] = direction.x;
			cache.direction[1] = direction.y;
			cache.direction[2] = direction.z;
			var coneCos = Math.cos(object.angle);
			var penumbraCos = Math.cos(object.angle * (1 - object.penumbra));
			cache.coneCos = coneCos;
			cache.penumbraCos = penumbraCos;

			if (object.castShadow) {
				cache.shadow = 1;
				cache.shadowBias = object.shadow.bias;
				cache.shadowRadius = object.shadow.radius;
				cache.shadowMapSize[0] = object.shadow.mapSize.x;
				cache.shadowMapSize[1] = object.shadow.mapSize.y;
				this.spotShadowNum++;
			} else {
				cache.shadow = 0;
			}

			if (object.castShadow) {
				// resize typed array
				var needSize = (this.spotsNum + 1) * 16;

				if (this.spotShadowMatrix.length < needSize) {
					var old = this.spotShadowMatrix;
					this.spotShadowMatrix = new Float32Array(needSize);
					this.spotShadowMatrix.set(old);
				}

				this.spotShadowMatrix.set(object.shadow.matrix.elements, this.spotsNum * 16);
				this.spotShadowMap[this.spotsNum] = object.shadow.map;
				this.spotShadowDepthMap[this.spotsNum] = object.shadow.depthMap;
			}

			this.spot[this.spotsNum] = cache;
			this.spotsNum++;
		}
	});

	var helpVector3$2 = new Vector3();
	var helpSphere = new Sphere();

	var sortFrontToBack = function sortFrontToBack(a, b) {
		if (a.renderOrder !== b.renderOrder) {
			return a.renderOrder - b.renderOrder;
		} else if (a.material.id !== b.material.id) {
			// batch
			return a.material.id - b.material.id;
		} else if (a.z !== b.z) {
			return a.z - b.z;
		} else {
			return a.id - b.id;
		}
	};

	var sortBackToFront = function sortBackToFront(a, b) {
		if (a.renderOrder !== b.renderOrder) {
			return a.renderOrder - b.renderOrder;
		} else if (a.z !== b.z) {
			return b.z - a.z;
		} else if (a.material.id !== b.material.id) {
			// fix Unstable sort below chrome version 7.0
			// if render same object with different materials
			return a.material.id - b.material.id;
		} else {
			return a.id - b.id;
		}
	};
	/**
	 * Render list is used to collect renderable objects from the scene.
	 * Render list has an opaque list and a transparent list.
	 * @constructor
	 * @hideconstructor
	 * @memberof zen3d
	 */


	function RenderList() {
		var renderItems = [];
		var renderItemsIndex = 0;
		/**
				* Opaque list.
				* @memberof zen3d.RenderList#
				*/

		var opaque = [];
		var opaqueCount = 0;
		/**
				* Transparent list.
				* @memberof zen3d.RenderList#
				*/

		var transparent = [];
		var transparentCount = 0;
		/**
				* Mark count start.
				* @memberof zen3d.RenderList#
				*/

		function startCount() {
			renderItemsIndex = 0;
			opaqueCount = 0;
			transparentCount = 0;
		}
		/**
				* Collect render list.
				* @memberof zen3d.RenderList#
				* @param {zen3d.Object3D} object - The object to be collected.
				* @param {zen3d.Camera} camera - The main camera.
				*/


		function add(object, camera) {
			// frustum test
			if (object.frustumCulled && camera.frustumCulled) {
				helpSphere.copy(object.geometry.boundingSphere).applyMatrix4(object.worldMatrix);
				var frustumTest = camera.frustum.intersectsSphere(helpSphere);

				if (!frustumTest) {
					// only test bounding sphere
					return;
				}
			} // calculate z


			helpVector3$2.setFromMatrixPosition(object.worldMatrix);
			helpVector3$2.project(camera);

			if (Array.isArray(object.material)) {
				var groups = object.geometry.groups;

				for (var i = 0; i < groups.length; i++) {
					var group = groups[i];
					var groupMaterial = object.material[group.materialIndex];

					if (groupMaterial) {
						_doAdd(object, object.geometry, groupMaterial, helpVector3$2.z, group);
					}
				}
			} else {
				_doAdd(object, object.geometry, object.material, helpVector3$2.z);
			}
		}

		function _doAdd(object, geometry, material, z, group) {
			var renderable = renderItems[renderItemsIndex];

			if (renderable === undefined) {
				renderable = {
					object: object,
					geometry: geometry,
					material: material,
					z: z,
					renderOrder: object.renderOrder,
					group: group
				};
				renderItems[renderItemsIndex] = renderable;
			} else {
				renderable.object = object;
				renderable.geometry = geometry;
				renderable.material = material;
				renderable.z = z;
				renderable.renderOrder = object.renderOrder;
				renderable.group = group;
			}

			if (material.transparent) {
				transparent[transparentCount] = renderable;
				transparentCount++;
			} else {
				opaque[opaqueCount] = renderable;
				opaqueCount++;
			}

			renderItemsIndex++;
		}
		/**
				* Mark count finished.
				* @memberof zen3d.RenderList#
				*/


		function endCount() {
			opaque.length = opaqueCount;
			transparent.length = transparentCount;
		}
		/**
				* Sort render list.
				* @memberof zen3d.RenderList#
				*/


		function sort() {
			opaque.sort(sortFrontToBack);
			transparent.sort(sortBackToFront);
		}

		return {
			opaque: opaque,
			transparent: transparent,
			startCount: startCount,
			add: add,
			endCount: endCount,
			sort: sort
		};
	}

	/**
	 * Scenes allow you to set up what and where is to be rendered by zen3d.
	 * This is where you place objects, lights and cameras.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Object3D
	 */

	function Scene() {
		Object3D.call(this);
		this.type = OBJECT_TYPE.SCENE;
		/**
				* If not null, it will force everything in the scene to be rendered with that material.
				* @type {zen3d.Material}
				* @default null
				*/

		this.overrideMaterial = null;
		/**
				* A {@link zen3d.Fog} instance defining the type of fog that affects everything rendered in the scene.
				* @type {zen3d.Fog}
				* @default null
				*/

		this.fog = null;
		/**
				* User-defined clipping planes specified as {@link zen3d.Plane} objects in world space.
				* These planes apply to the scene.
				* Points in space whose dot product with the plane is negative are cut away.
				* @type {zen3d.Plane[]}
				* @default []
				*/

		this.clippingPlanes = [];
		/**
				* Defines whether disable shadow sampler feature.
		 * Shader with sampler2DShadow uniforms may cause unknown error on some android phones, set disableShadowSampler to true to avoid these bugs.
				* @type {boolean}
				* @default false
				*/

		this.disableShadowSampler = false;
		/**
				* A {@link zen3d.LightCache} instance that collected all lights info after the calling of {@link zen3d.Scene#updateLights}.
				* @type {zen3d.LightCache}
				* @default zen3d.LightCache()
				*/

		this.lights = new LightCache();
		this._renderListMap = new WeakMap();
	}

	Scene.prototype = Object.assign(Object.create(Object3D.prototype),
	/** @lends zen3d.Scene.prototype */
	{
		constructor: Scene,

		/**
				* Update {@link zen3d.RenderList} for the scene and camera.
				* @param {zen3d.Camera} camera - The camera.
				* @return {RenderList} - The result render list.
				*/
		updateRenderList: function updateRenderList(camera) {
			if (!this._renderListMap.has(camera)) {
				this._renderListMap.set(camera, new RenderList());
			}

			var renderList = this._renderListMap.get(camera);

			renderList.startCount();

			this._doUpdateRenderList(this, camera, renderList);

			renderList.endCount();
			renderList.sort();
			return renderList;
		},

		/**
				* Get {@link zen3d.RenderList} for the scene and camera.
				* The Render List must be updated before this calling.
				* @param {zen3d.Camera} camera - The camera.
				* @return {RenderList} - The target render list.
				*/
		getRenderList: function getRenderList(camera) {
			return this._renderListMap.get(camera);
		},

		/**
				* Update all lights in the scene.
				* @return {LightCache} - An instance of {@link LightCache} whitch contains all lights in the scene.
				*/
		updateLights: function updateLights() {
			var lights = this.lights;
			lights.startCount();

			this._doUpdateLights(this);

			lights.endCount();
			return lights;
		},
		_doUpdateRenderList: function _doUpdateRenderList(object, camera, renderList) {
			if (!object.visible) {
				return;
			}

			if (!!object.geometry && !!object.material) {
				// renderable
				renderList.add(object, camera);
			} // handle children by recursion


			var children = object.children;

			for (var i = 0, l = children.length; i < l; i++) {
				this._doUpdateRenderList(children[i], camera, renderList);
			}
		},
		_doUpdateLights: function _doUpdateLights(object) {
			if (!object.visible) {
				return;
			}

			if (OBJECT_TYPE.LIGHT === object.type) {
				// light
				this.lights.add(object);
			} // handle children by recursion


			var children = object.children;

			for (var i = 0, l = children.length; i < l; i++) {
				this._doUpdateLights(children[i]);
			}
		}
	});

	var _sphere = new Sphere();

	var _box = new Box3();

	var _inverseMatrix = new Matrix4();

	var _ray = new Ray();

	var _barycoord = new Vector3();

	var _vA = new Vector3();

	var _vB = new Vector3();

	var _vC = new Vector3();

	var _uvA = new Vector2();

	var _uvB = new Vector2();

	var _uvC = new Vector2();

	var _intersectionPoint = new Vector3();

	var _intersectionPointWorld = new Vector3();
	/**
	 * Class representing triangular polygon mesh based objects.
	 * Also serves as a base for other classes such as {@link zen3d.SkinnedMesh}.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Object3D
	 * @param {zen3d.Geometry} geometry — an instance of {@link zen3d.Geometry}.
	 * @param {zen3d.Material} material - a single or an array of {@link zen3d.Material}.
	 */


	function Mesh(geometry, material) {
		Object3D.call(this);
		/**
				* an instance of {@link zen3d.Geometry}.
				* @type {zen3d.Geometry}
				*/

		this.geometry = geometry;
		/**
				* a single or an array of {@link zen3d.Material}.
				* @type {zen3d.Material|zen3d.Material[]}
				*/

		this.material = material;
		/**
		 * An array of weights typically from 0-1 that specify how much of the morph is applied.
		 * @type {Number[]|null}
		 * @default null
		 */

		this.morphTargetInfluences = null;
		this.type = OBJECT_TYPE.MESH;
	}

	Mesh.prototype = Object.assign(Object.create(Object3D.prototype),
	/** @lends zen3d.Mesh.prototype */
	{
		constructor: Mesh,

		/**
				* @override
				*/
		raycast: function raycast(raycaster, intersects) {
			var geometry = this.geometry;
			var worldMatrix = this.worldMatrix; // Sphere test

			_sphere.copy(geometry.boundingSphere);

			_sphere.applyMatrix4(worldMatrix);

			if (!raycaster.ray.intersectsSphere(_sphere)) {
				return;
			} // Box test


			_box.copy(geometry.boundingBox);

			_box.applyMatrix4(worldMatrix);

			if (!raycaster.ray.intersectsBox(_box)) {
				return;
			} // Vertex test


			_inverseMatrix.getInverse(worldMatrix);

			_ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

			var index = geometry.index.array;
			var position = geometry.getAttribute("a_Position");
			var uv = geometry.getAttribute("a_Uv");
			var a, b, c;

			for (var i = 0; i < index.length; i += 3) {
				a = index[i];
				b = index[i + 1];
				c = index[i + 2];

				_vA.fromArray(position.array, a * 3);

				_vB.fromArray(position.array, b * 3);

				_vC.fromArray(position.array, c * 3);

				var intersection = checkIntersection(this, raycaster, _ray, _vA, _vB, _vC, _intersectionPoint);

				if (intersection) {
					// uv
					_uvA.fromArray(uv.array, a * 2);

					_uvB.fromArray(uv.array, b * 2);

					_uvC.fromArray(uv.array, c * 2);

					intersection.uv = uvIntersection(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC);
					intersection.face = [a, b, c];
					intersection.faceIndex = a;
					intersects.push(intersection);
				}
			}
		},
		copy: function copy(source) {
			Object3D.prototype.copy.call(this, source);

			if (source.morphTargetInfluences) {
				this.morphTargetInfluences = source.morphTargetInfluences.slice();
			}

			return this;
		},
		clone: function clone() {
			return new this.constructor(this.geometry, this.material).copy(this);
		}
	});

	function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
		Triangle.barycoordFromPoint(point, p1, p2, p3, _barycoord);
		uv1.multiplyScalar(_barycoord.x);
		uv2.multiplyScalar(_barycoord.y);
		uv3.multiplyScalar(_barycoord.z);
		uv1.add(uv2).add(uv3);
		return uv1.clone();
	}

	function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
		var intersect;
		var material = object.material;

		if (material.side === DRAW_SIDE.BACK) {
			intersect = ray.intersectTriangle(pC, pB, pA, true, point);
		} else {
			intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DRAW_SIDE.DOUBLE, point);
		}

		if (intersect === null) return null;

		_intersectionPointWorld.copy(point);

		_intersectionPointWorld.applyMatrix4(object.worldMatrix);

		var distance = raycaster.ray.origin.distanceTo(_intersectionPointWorld);
		if (distance < raycaster.near || distance > raycaster.far) return null;
		return {
			distance: distance,
			point: _intersectionPointWorld.clone(),
			object: object
		};
	}

	/**
	 * Shader post pass.
	 * @constructor
	 * @memberof zen3d
	 * @param {Object} shader - Shader object for the pass.
	 * @param {string} shader.vertexShader -	Vertex shader GLSL code.
	 * @param {string} shader.fragmentShader - Fragment shader GLSL code.
	 * @param {Object} [shader.defines={}] - Defines of the shader.
	 * @param {Object} [shader.uniforms={}] - Uniforms of the shader.
	 */

	function ShaderPostPass(shader) {
		var scene = new Scene();
		var camera = this.camera = new Camera();
		camera.frustumCulled = false;
		camera.position.set(0, 1, 0);
		camera.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, -1));
		camera.setOrtho(-1, 1, -1, 1, 0.1, 2);
		scene.add(camera);
		var geometry = new PlaneGeometry(2, 2, 1, 1);
		var material = this.material = new ShaderMaterial(shader);
		this.uniforms = material.uniforms;
		var plane = new Mesh(geometry, material);
		plane.frustumCulled = false;
		scene.add(plane); // static scene

		scene.updateMatrix();
		this.renderList = scene.updateRenderList(camera);
		this.renderConfig = {};
	}
	/**
	 * Render the post pass.
	 * @param {zen3d.WebGLCore} glCore
	 */


	ShaderPostPass.prototype.render = function (glCore) {
		glCore.renderPass(this.renderList.opaque, this.camera, this.renderConfig);
	};

	/**
	 * Render Target that render to canvas element.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.RenderTargetBase
	 * @param {HTMLCanvasElement} view - The canvas element which the Render Target rendered to.
	 */

	function RenderTargetBack(view) {
		RenderTargetBase.call(this, view.width, view.height);
		/**
				* The canvas element which the Render Target rendered to.
				* @type {HTMLCanvasElement}
				*/

		this.view = view;
	}

	RenderTargetBack.prototype = Object.assign(Object.create(RenderTargetBase.prototype),
	/** @lends zen3d.RenderTargetBack.prototype */
	{
		constructor: RenderTargetBack,
		resize: function resize(width, height) {
			this.view.width = width;
			this.view.height = height;
			this.width = width;
			this.height = height;
		},
		dispose: function dispose() {// TODO dispose canvas?
		}
	});

	/**
	 * A simple forward renderer.
	 * @constructor
	 * @memberof zen3d
	 * @param {HTMLCanvasElement} view - The canvas elements.
	 * @param {Object} [options=] - The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext options for webgl context}.
	 */

	function Renderer(view, options) {
		var defaultContextParams = {
			antialias: true,
			// antialias
			alpha: false,
			// effect performance, default false
			// premultipliedAlpha: false, // effect performance, default false
			stencil: true
		};
		var gl = view.getContext("webgl2", options || defaultContextParams) || view.getContext("webgl", options || defaultContextParams);
		this.glCore = new WebGLCore(gl);
		console.info("ForwardRenderer use WebGL Version: " + this.glCore.capabilities.version);
		this.backRenderTarget = new RenderTargetBack(view);
		this.shadowMapPass = new ShadowMapPass();
		/**
				* Defines whether the shadow pass should automatically update.
				* @type {boolean}
				* @default true
				*/

		this.shadowAutoUpdate = true;
		/**
				* If {@link zen3d.Renderer.shadowAutoUpdate} is set true and this set true, shadow will update and set this to false automatically.
				* @type {boolean}
				* @default false
				*/

		this.shadowNeedsUpdate = false;
		/**
				* Defines whether the scene should automatically update its matrix.
				* @type {boolean}
				* @default true
				*/

		this.matrixAutoUpdate = true;
		/**
				* Defines whether the scene should automatically update its lights.
				* @type {boolean}
				* @default true
				*/

		this.lightsAutoUpdate = true;
		/**
				* Defines whether the renderer should automatically clear its output before rendering a frame.
				* @type {boolean}
				* @default true
				*/

		this.autoClear = true;
	}
	/**
	 * Render a scene using a camera.
	 * The render is done to the renderTarget (if specified) or to the canvas as usual.
	 * @param {zen3d.Scene} scene - The scene.
	 * @param {zen3d.Camera} camera - The camera.
	 * @param {zen3d.RenderTargetBase} [renderTarget=] - The render is done to the renderTarget (if specified) or to the canvas as usual.
	 * @param {boolean} [forceClear=false] - If set true, the depth, stencil and color buffers will be cleared before rendering even if the renderer's autoClear property is false.
	 */


	Renderer.prototype.render = function (scene, camera, renderTarget, forceClear) {
		this.matrixAutoUpdate && scene.updateMatrix();
		this.lightsAutoUpdate && scene.updateLights();

		if (this.shadowAutoUpdate || this.shadowNeedsUpdate) {
			this.shadowMapPass.render(this.glCore, scene);
			this.shadowNeedsUpdate = false;
		}

		if (renderTarget === undefined) {
			renderTarget = this.backRenderTarget;
		}

		this.glCore.renderTarget.setRenderTarget(renderTarget);

		if (this.autoClear || forceClear) {
			this.glCore.clear(true, true, true);
		}

		this.glCore.render(scene, camera);

		if (!!renderTarget.texture) {
			this.glCore.renderTarget.updateRenderTargetMipmap(renderTarget);
		}
	};

	/**
	 * Render Target that render to 2d texture.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.RenderTargetBase
	 * @param {number} width - The width of the render target.
	 * @param {number} height - The height of the render target.
	 */

	function RenderTarget2D(width, height) {
		RenderTargetBase.call(this, width, height);
		this._attachments = {};
		this.attach(new Texture2D(), ATTACHMENT.COLOR_ATTACHMENT0);
		this.attach(new RenderBuffer(width, height, WEBGL_PIXEL_FORMAT.DEPTH_STENCIL), ATTACHMENT.DEPTH_STENCIL_ATTACHMENT);
	}

	RenderTarget2D.prototype = Object.assign(Object.create(RenderTargetBase.prototype),
	/** @lends zen3d.RenderTarget2D.prototype */
	{
		constructor: RenderTarget2D,

		/**
				* Attach a texture(RTT) or renderbuffer to the framebuffer.
				* Notice: For now, dynamic Attachment during rendering is not supported.
				* @param	{zen3d.Texture2D|zen3d.RenderBuffer} target
				* @param	{zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
				*/
		attach: function attach(target, attachment) {
			if (target.isTexture) {
				if (target.image && target.image.rtt) {
					if (target.image.width !== this.width || target.image.height !== this.height) {
						target.version++;
						target.image.width = this.width;
						target.image.height = this.height;
					}
				} else {
					target.version++;
					target.image = {
						rtt: true,
						data: null,
						width: this.width,
						height: this.height
					};
				}
			} else {
				target.resize(this.width, this.height);
			}

			this._attachments[attachment || ATTACHMENT.COLOR_ATTACHMENT0] = target;
		},

		/**
				* Detach a texture or renderbuffer.
				* @param	{zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
				*/
		detach: function detach(attachment) {
			delete this._attachments[attachment || ATTACHMENT.COLOR_ATTACHMENT0];
		},

		/**
				* @override
				*/
		resize: function resize(width, height) {
			var changed = RenderTargetBase.prototype.resize.call(this, width, height);

			if (changed) {
				for (var attachment in this._attachments) {
					var target = this._attachments[attachment];

					if (target.isTexture) {
						target.image = {
							rtt: true,
							data: null,
							width: this.width,
							height: this.height
						};
						target.version++;
					} else {
						target.resize(width, height);
					}
				}
			}

			return changed;
		}
	});
	Object.defineProperties(RenderTarget2D.prototype, {
		texture: {
			set: function set(texture) {
				if (texture) {
					if (texture.isTexture) {
						this.attach(texture, ATTACHMENT.COLOR_ATTACHMENT0);
					}
				} else {
					this.detach(ATTACHMENT.COLOR_ATTACHMENT0);
				}
			},
			get: function get() {
				var target = this._attachments[ATTACHMENT.COLOR_ATTACHMENT0];
				return target.isTexture ? target : null;
			}
		}
	});

	/**
	 * Linear fog.
	 * @memberof zen3d
	 * @constructor
	 * @param {number} [color=0x000000] - The color of the fog.
	 * @param {number} [near=1] - The near clip of the fog.
	 * @param {number} [far=1000] - The far clip of the fog.
	 */

	function Fog(color, near, far) {
		this.fogType = FOG_TYPE.NORMAL;
		/**
				* The color of the fog.
				* @member {zen3d.Color3}
				* @default zen3d.Color3(0x000000)
				*/

		this.color = new Color3(color !== undefined ? color : 0x000000);
		/**
				* The near clip of the fog.
				* @member {number}
				* @default 1
				*/

		this.near = near !== undefined ? near : 1;
		/**
				* The far clip of the fog.
				* @member {number}
				* @default 1000
				*/

		this.far = far !== undefined ? far : 1000;
	}

	/**
	 * Exp2 fog.
	 * @memberof zen3d
	 * @constructor
	 * @param {number} [color=0x000000] - The color of the fog.
	 * @param {number} [density=0.00025] - The density of the exp2 fog.
	 */

	function FogExp2(color, density) {
		this.fogType = FOG_TYPE.EXP2;
		/**
				* The color of the fog.
				* @member {zen3d.Color3}
				* @default zen3d.Color3(0x000000)
				*/

		this.color = new Color3(color !== undefined ? color : 0x000000);
		/**
				* The density of the exp2 fog.
				* @member {number}
				* @default 0.00025
				*/

		this.density = density !== undefined ? density : 0.00025;
	}

	/**
	 * This is almost identical to an {@link zen3d.Object3D}.
	 * Its purpose is to make working with groups of objects syntactically clearer.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Object3D
	 */

	function Group() {
		Object3D.call(this);
		this.type = OBJECT_TYPE.GROUP;
	}

	Group.prototype = Object.create(Object3D.prototype);
	Group.prototype.constructor = Group;

	/**
	 * Abstract base class for lights
	 * - all other light types inherit the properties and methods described here.
	 * @constructor
	 * @abstract
	 * @memberof zen3d
	 * @extends zen3d.Object3D
	 * @param {number} [color=0xffffff]
	 * @param {number} [intensity=1]
	 */

	function Light(color, intensity) {
		Object3D.call(this);
		this.type = OBJECT_TYPE.LIGHT;
		this.lightType = "";
		/**
				* Color of the light.
				* @type {zen3d.Color3}
				* @default zen3d.Color3(0xffffff)
				*/

		this.color = new Color3(color !== undefined ? color : 0xffffff);
		/**
				* The light's intensity, or strength.
				* @type {number}
				* @default 1
				*/

		this.intensity = intensity !== undefined ? intensity : 1;
	}

	Light.prototype = Object.assign(Object.create(Object3D.prototype),
	/** @lends zen3d.Light.prototype */
	{
		constructor: Light,

		/**
				* Copies properties from the source light into this one.
				* @param {zen3d.Light} source - The source light.
				* @return {zen3d.Light} - This light.
				*/
		copy: function copy(source) {
			Object3D.prototype.copy.call(this, source);
			this.type = source.type;
			this.lightType = source.lightType;
			this.color.copy(source.color);
			this.intensity = source.intensity;
			return this;
		}
	});

	/**
	 * This light globally illuminates all objects in the scene equally.
	 * This light cannot be used to cast shadows as it does not have a direction.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Light
	 * @param {number} [color=0xffffff]
	 * @param {number} [intensity=1]
	 */

	function AmbientLight(color, intensity) {
		Light.call(this, color, intensity);
		this.lightType = LIGHT_TYPE.AMBIENT;
	}

	AmbientLight.prototype = Object.create(Light.prototype);
	AmbientLight.prototype.constructor = AmbientLight;

	/**
	 * Serves as a base class for the other shadow classes.
	 * @constructor
	 * @hideconstructor
	 * @abstract
	 * @memberof zen3d
	 */

	function LightShadow() {
		/**
				 * The light's view of the world.
				 * This is used to generate a depth map of the scene; objects behind other objects from the light's perspective will be in shadow.
				 * @type {zen3d.Camera}
				 */
		this.camera = new Camera();
		/**
				 * Model to shadow camera space, to compute location and depth in shadow map. Stored in a {@link zen3d.Matrix4}.
				 * This is computed internally during rendering.
				 * @type {zen3d.Matrix4}
				 */

		this.matrix = new Matrix4();
		/**
				 * Shadow map bias, how much to add or subtract from the normalized depth when deciding whether a surface is in shadow.
				 * Very tiny adjustments here (in the order of 0.0001) may help reduce artefacts in shadows.
				 * @type {number}
				 * @default 0
				 */

		this.bias = 0;
		/**
				 * Setting this to values greater than 1 will blur the edges of the shadow.
				 * High values will cause unwanted banding effects in the shadows - a greater mapSize will allow for a higher value to be used here before these effects become visible.
				 * Note that this has no effect if the {@link @zen3d.Object3D#shadowType} is set to PCF or PCSS.
				 * @type {number}
				 * @default 2
				 */

		this.radius = 2;
		/**
				 * Shadow camera near.
				 * @type {number}
				 * @default 1
				 */

		this.cameraNear = 1;
		/**
				 * Shadow camera far.
				 * @type {number}
				 * @default 500
				 */

		this.cameraFar = 500;
		/**
				 * A {@link zen3d.Vector2} defining the width and height of the shadow map.
				 * Higher values give better quality shadows at the cost of computation time.
				 * Values must be powers of 2.
				 * @type {zen3d.Vector2}
				 * @default zen3d.Vector2(512, 512)
				 */

		this.mapSize = new Vector2(512, 512);
		/**
				 * Enables automatic updates of the light's shadow.
				 * If you do not require dynamic lighting / shadows, you may set this to false.
				 * @type {boolean}
				 * @default true
				 */

		this.autoUpdate = true;
		/**
				 * When set to true, shadow maps will be updated in the next ShadowMapPass.render call.
				 * If you have set .autoUpdate to false, you will need to set this property to true and then make a ShadowMapPass.render call to update the light's shadow.
				 * @type {boolean}
				 * @default false
				 */

		this.needsUpdate = false;
		this.renderTarget = null;
		this.map = null;
	}

	Object.assign(LightShadow.prototype,
	/** @lends zen3d.LightShadow.prototype */
	{
		update: function update(light, face) {},
		copy: function copy(source) {
			this.camera.copy(source.camera);
			this.matrix.copy(source.matrix);
			this.bias = source.bias;
			this.radius = source.radius;
			this.cameraNear = source.cameraNear;
			this.cameraFar = source.cameraFar;
			this.mapSize.copy(source.mapSize);
			return this;
		},
		clone: function clone() {
			return new this.constructor().copy(this);
		}
	});

	/**
	 * This is used internally by DirectionalLights for calculating shadows.
	 * @constructor
	 * @hideconstructor
	 * @memberof zen3d
	 * @extends zen3d.LightShadow
	 */

	function DirectionalLightShadow() {
		LightShadow.call(this); // direct light is just a direction
		// we would not do camera frustum cull, because this light could be any where

		this.camera.frustumCulled = false;
		this.renderTarget = new RenderTarget2D(this.mapSize.x, this.mapSize.y);
		var map = this.renderTarget.texture;
		map.generateMipmaps = false;
		map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
		this.map = map;
		this.depthMap = null;
		/**
				* The cast shadow window size.
				* @type {number}
				* @default 500
				*/

		this.windowSize = 500;
		this._lookTarget = new Vector3();
		this._up = new Vector3(0, 1, 0);
	}

	DirectionalLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {
		constructor: DirectionalLightShadow,
		update: function update(light) {
			this._updateCamera(light);

			this._updateMatrix(); // TODO check size change, remove this from loop


			if (this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
				this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
			}
		},
		_updateCamera: function _updateCamera(light) {
			var camera = this.camera;
			var lookTarget = this._lookTarget; // set camera position and lookAt(rotation)

			light.getWorldDirection(this._lookTarget);
			camera.position.setFromMatrixPosition(light.worldMatrix);
			lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
			camera.lookAt(lookTarget, this._up); // update view matrix

			camera.updateMatrix(); // update projection

			var halfWindowSize = this.windowSize / 2;
			camera.setOrtho(-halfWindowSize, halfWindowSize, -halfWindowSize, halfWindowSize, this.cameraNear, this.cameraFar);
		},
		_updateMatrix: function _updateMatrix() {
			var matrix = this.matrix;
			var camera = this.camera; // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1

			matrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
			matrix.multiply(camera.projectionMatrix);
			matrix.multiply(camera.viewMatrix);
		},
		copy: function copy(source) {
			LightShadow.prototype.copy.call(this, source);
			this.windowSize = source.windowSize;
			return this;
		},
		_initDepthMap: function _initDepthMap() {
			var depthTexture = new Texture2D();
			depthTexture.type = WEBGL_PIXEL_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV;
			depthTexture.format = WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;
			depthTexture.internalformat = WEBGL_PIXEL_FORMAT.DEPTH32F_STENCIL8;
			depthTexture.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;
			depthTexture.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
			depthTexture.compare = WEBGL_COMPARE_FUNC.LESS;
			depthTexture.generateMipmaps = false;
			this.renderTarget.attach(depthTexture, ATTACHMENT.DEPTH_STENCIL_ATTACHMENT);
			this.depthMap = depthTexture;
		}
	});

	/**
	 * A light that gets emitted in a specific direction.
	 * This light will behave as though it is infinitely far away and the rays produced from it are all parallel.
	 * The common use case for this is to simulate daylight; the sun is far enough away that its position can be considered to be infinite, and all light rays coming from it are parallel.
	 * This light can cast shadows - see the {@link zen3d.DirectionalLightShadow} page for details.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Light
	 * @param {number} [color=0xffffff]
	 * @param {number} [intensity=1]
	 */

	function DirectionalLight(color, intensity) {
		Light.call(this, color, intensity);
		this.lightType = LIGHT_TYPE.DIRECT;
		/**
				* A {@link zen3d.DirectionalLightShadow} used to calculate shadows for this light.
				* @type {zen3d.DirectionalLightShadow}
				* @default zen3d.DirectionalLightShadow()
				*/

		this.shadow = new DirectionalLightShadow();
	}

	DirectionalLight.prototype = Object.assign(Object.create(Light.prototype),
	/** @lends zen3d.DirectionalLight.prototype */
	{
		constructor: DirectionalLight,
		copy: function copy(source) {
			Light.prototype.copy.call(this, source);
			this.shadow.copy(source.shadow);
			return this;
		}
	});

	/**
	 * This is used internally by PointLights for calculating shadows.
	 * @constructor
	 * @hideconstructor
	 * @memberof zen3d
	 * @extends zen3d.LightShadow
	 */

	function PointLightShadow() {
		LightShadow.call(this);
		this.renderTarget = new RenderTargetCube(this.mapSize.x, this.mapSize.y);
		var map = this.renderTarget.texture;
		map.generateMipmaps = false;
		map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
		this.map = map;
		this._targets = [new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)];
		this._ups = [new Vector3(0, -1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(0, -1, 0)];
		this._lookTarget = new Vector3();
	}

	PointLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {
		constructor: PointLightShadow,
		update: function update(light, face) {
			this._updateCamera(light, face);

			this._updateMatrix(); // TODO check size change, remove this from loop


			if (this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
				this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
			}
		},
		_updateCamera: function _updateCamera(light, face) {
			var camera = this.camera;
			var lookTarget = this._lookTarget;
			var targets = this._targets;
			var ups = this._ups; // set camera position and lookAt(rotation)

			camera.position.setFromMatrixPosition(light.worldMatrix);
			lookTarget.set(targets[face].x + camera.position.x, targets[face].y + camera.position.y, targets[face].z + camera.position.z);
			camera.lookAt(lookTarget, ups[face]); // update view matrix

			camera.updateMatrix(); // update projection

			camera.setPerspective(90 / 180 * Math.PI, 1, this.cameraNear, this.cameraFar);
		},
		_updateMatrix: function _updateMatrix() {
			var matrix = this.matrix;
			var camera = this.camera; // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1

			matrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
			matrix.multiply(camera.projectionMatrix);
			matrix.multiply(camera.viewMatrix);
		}
	});

	/**
	 * A light that gets emitted from a single point in all directions.
	 * A common use case for this is to replicate the light emitted from a bare lightbulb.
	 * This light can cast shadows - see {@link zen3d.PointLightShadow} page for details.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Light
	 * @param {number} [color=0xffffff]
	 * @param {number} [intensity=1]
	 * @param {number} [distance=200]
	 * @param {number} [decay=1]
	 */

	function PointLight(color, intensity, distance, decay) {
		Light.call(this, color, intensity);
		this.lightType = LIGHT_TYPE.POINT;
		/**
				* The amount the light dims along the distance of the light.
				* @type {number}
				* @default 1
				*/

		this.decay = decay !== undefined ? decay : 1;
		/**
				* The distance from the light where the intensity is 0.
				* @type {number}
				* @default 200
				*/

		this.distance = distance !== undefined ? distance : 200;
		/**
				* A {@link zen3d.PointLightShadow} used to calculate shadows for this light.
				* @type {zen3d.PointLightShadow}
				* @default zen3d.PointLightShadow()
				*/

		this.shadow = new PointLightShadow();
	}

	PointLight.prototype = Object.assign(Object.create(Light.prototype),
	/** @lends zen3d.PointLight.prototype */
	{
		constructor: PointLight,
		copy: function copy(source) {
			Light.prototype.copy.call(this, source);
			this.shadow.copy(source.shadow);
			return this;
		}
	});

	/**
	 * This is used internally by SpotLights for calculating shadows.
	 * @constructor
	 * @hideconstructor
	 * @memberof zen3d
	 * @extends zen3d.LightShadow
	 */

	function SpotLightShadow() {
		LightShadow.call(this);
		this.renderTarget = new RenderTarget2D(this.mapSize.x, this.mapSize.y);
		var map = this.renderTarget.texture;
		map.generateMipmaps = false;
		map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
		this.map = map;
		this.depthMap = null;
		this._lookTarget = new Vector3();
		this._up = new Vector3(0, 1, 0);
	}

	SpotLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {
		constructor: SpotLightShadow,
		update: function update(light) {
			this._updateCamera(light);

			this._updateMatrix(); // TODO check size change, remove this from loop


			if (this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
				this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
			}
		},
		_updateCamera: function _updateCamera(light) {
			var camera = this.camera;
			var lookTarget = this._lookTarget; // set camera position and lookAt(rotation)

			light.getWorldDirection(this._lookTarget);
			camera.position.setFromMatrixPosition(light.worldMatrix);
			lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
			camera.lookAt(lookTarget, this._up); // update view matrix

			camera.updateMatrix(); // update projection
			// TODO distance should be custom?

			camera.setPerspective(light.angle * 2, 1, this.cameraNear, this.cameraFar);
		},
		_updateMatrix: function _updateMatrix() {
			var matrix = this.matrix;
			var camera = this.camera; // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1

			matrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
			matrix.multiply(camera.projectionMatrix);
			matrix.multiply(camera.viewMatrix);
		},
		_initDepthMap: function _initDepthMap() {
			var depthTexture = new Texture2D();
			depthTexture.type = WEBGL_PIXEL_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV;
			depthTexture.format = WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;
			depthTexture.internalformat = WEBGL_PIXEL_FORMAT.DEPTH32F_STENCIL8;
			depthTexture.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;
			depthTexture.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
			depthTexture.compare = WEBGL_COMPARE_FUNC.LESS;
			depthTexture.generateMipmaps = false;
			this.renderTarget.attach(depthTexture, ATTACHMENT.DEPTH_STENCIL_ATTACHMENT);
			this.depthMap = depthTexture;
		}
	});

	/**
	 * This light gets emitted from a single point in one direction, along a cone that increases in size the further from the light it gets.
	 * This light can cast shadows - see the {@link zen3d.SpotLightShadow} page for details.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Light
	 * @param {number} [color=0xffffff]
	 * @param {number} [intensity=1]
	 * @param {number} [distance=200]
	 * @param {number} [angle=Math.PI/6]
	 * @param {number} [penumbra=0]
	 * @param {number} [decay=1]
	 */

	function SpotLight(color, intensity, distance, angle, penumbra, decay) {
		Light.call(this, color, intensity);
		this.lightType = LIGHT_TYPE.SPOT;
		/**
				* The amount the light dims along the distance of the light.
				* @type {number}
				* @default 1
				*/

		this.decay = decay !== undefined ? decay : 1;
		/**
				* The distance from the light where the intensity is 0.
				* @type {number}
				* @default 200
				*/

		this.distance = distance !== undefined ? distance : 200;
		/**
				* Percent of the spotlight cone that is attenuated due to penumbra.
				* Takes values between zero and 1.
				* @type {number}
				* @default 0
				*/

		this.penumbra = penumbra !== undefined ? penumbra : 0;
		/**
				* Maximum extent of the spotlight, in radians, from its direction.
				* Should be no more than Math.PI/2.
				* @type {number}
				* @default Math.PI/6
				*/

		this.angle = angle !== undefined ? angle : Math.PI / 6;
		/**
				* A {@link zen3d.SpotLightShadow} used to calculate shadows for this light.
				* @type {zen3d.SpotLightShadow}
				* @default zen3d.SpotLightShadow()
				*/

		this.shadow = new SpotLightShadow();
	}

	SpotLight.prototype = Object.assign(Object.create(Light.prototype),
	/** @lends zen3d.SpotLight.prototype */
	{
		constructor: SpotLight,
		copy: function copy(source) {
			Light.prototype.copy.call(this, source);
			this.shadow.copy(source.shadow);
			return this;
		}
	});

	/**
	 * A mesh that has a {@link zen3d.Skeleton} with bones that can then be used to animate the vertices of the geometry.
	 * The material must support skinning.
	 * @constructor
	 * @memberof zen3d
	 * @extends zen3d.Mesh
	 */

	function SkinnedMesh(geometry, material) {
		Mesh.call(this, geometry, material);
		this.type = OBJECT_TYPE.SKINNED_MESH;
		/**
				* Skeleton created from the bones of the Geometry.
				* @member {zen3d.Skeleton}
				*/

		this.skeleton = undefined;
		/**
				* Either "attached" or "detached".
				* "attached" uses the {@link zen3d.SkinnedMesh#worldMatrix} property for the base transform matrix of the bones.
				* "detached" uses the {@link zen3d.SkinnedMesh#bindMatrix}.
				* @member {string}
				* @default "attached"
				*/

		this.bindMode = 'attached';
		/**
				* The base matrix that is used for the bound bone transforms.
				* @member {zen3d.Matrix4}
				*/

		this.bindMatrix = new Matrix4();
		/**
				* The base matrix that is used for resetting the bound bone transforms.
				* @member {zen3d.Matrix4}
				*/

		this.bindMatrixInverse = new Matrix4();
	}

	SkinnedMesh.prototype = Object.assign(Object.create(Mesh.prototype),
	/** @lends zen3d.SkinnedMesh.prototype */
	{
		constructor: SkinnedMesh,

		/**
				* Bind a skeleton to the skinned mesh.
				* The bindMatrix gets saved to .bindMatrix property and the .bindMatrixInverse gets calculated.
				* @param {zen3d.Skeleton} skeleton - Skeleton created from a Bones tree.
				* @param {zen3d.Matrix4} [bindMatrix=] - Matrix4 that represents the base transform of the skeleton.
				*/
		bind: function bind(skeleton, bindMatrix) {
			this.skeleton = skeleton;

			if (bindMatrix === undefined) {
				this.updateMatrix();
				bindMatrix = this.worldMatrix;
			}

			this.bindMatrix.copy(bindMatrix);
			this.bindMatrixInverse.getInverse(bindMatrix);
		},
		updateMatrix: function updateMatrix(force) {
			Mesh.prototype.updateMatrix.call(this, force);

			if (this.bindMode === 'attached') {
				this.bindMatrixInverse.getInverse(this.worldMatrix);
			} else if (this.bindMode === 'detached') {
				this.bindMatrixInverse.getInverse(this.bindMatrix);
			} else {
				console.warn('zen3d.SkinnedMesh: Unrecognized bindMode: ' + this.bindMode);
			}
		},
		clone: function clone() {
			return new this.constructor(this.geometry, this.material).copy(this);
		}
	});

	exports.ATTACHMENT = ATTACHMENT;
	exports.AmbientLight = AmbientLight;
	exports.AnimationMixer = AnimationMixer;
	exports.BLEND_EQUATION = BLEND_EQUATION;
	exports.BLEND_FACTOR = BLEND_FACTOR;
	exports.BLEND_TYPE = BLEND_TYPE;
	exports.BasicMaterial = BasicMaterial;
	exports.Bone = Bone;
	exports.BooleanKeyframeTrack = BooleanKeyframeTrack;
	exports.Box2 = Box2;
	exports.Box3 = Box3;
	exports.BufferAttribute = BufferAttribute;
	exports.CULL_FACE_TYPE = CULL_FACE_TYPE;
	exports.Camera = Camera;
	exports.Color3 = Color3;
	exports.ColorKeyframeTrack = ColorKeyframeTrack;
	exports.CubeGeometry = CubeGeometry;
	exports.CylinderGeometry = CylinderGeometry;
	exports.DRAW_BUFFER = DRAW_BUFFER;
	exports.DRAW_MODE = DRAW_MODE;
	exports.DRAW_SIDE = DRAW_SIDE;
	exports.DefaultLoadingManager = DefaultLoadingManager;
	exports.DepthMaterial = DepthMaterial;
	exports.DirectionalLight = DirectionalLight;
	exports.DirectionalLightShadow = DirectionalLightShadow;
	exports.DistanceMaterial = DistanceMaterial;
	exports.ENVMAP_COMBINE_TYPE = ENVMAP_COMBINE_TYPE;
	exports.EnvironmentMapPass = EnvironmentMapPass;
	exports.Euler = Euler;
	exports.EventDispatcher = EventDispatcher;
	exports.FOG_TYPE = FOG_TYPE;
	exports.FileLoader = FileLoader;
	exports.Fog = Fog;
	exports.FogExp2 = FogExp2;
	exports.Frustum = Frustum;
	exports.Geometry = Geometry;
	exports.Group = Group;
	exports.ImageLoader = ImageLoader;
	exports.InstancedBufferAttribute = InstancedBufferAttribute;
	exports.InstancedGeometry = InstancedGeometry;
	exports.InstancedInterleavedBuffer = InstancedInterleavedBuffer;
	exports.InterleavedBuffer = InterleavedBuffer;
	exports.InterleavedBufferAttribute = InterleavedBufferAttribute;
	exports.KeyframeClip = KeyframeClip;
	exports.KeyframeTrack = KeyframeTrack;
	exports.LIGHT_TYPE = LIGHT_TYPE;
	exports.LambertMaterial = LambertMaterial;
	exports.Light = Light;
	exports.LightCache = LightCache;
	exports.LightShadow = LightShadow;
	exports.LineMaterial = LineMaterial;
	exports.LoadingManager = LoadingManager;
	exports.MATERIAL_TYPE = MATERIAL_TYPE;
	exports.MatcapMaterial = MatcapMaterial;
	exports.Material = Material;
	exports.Matrix3 = Matrix3;
	exports.Matrix4 = Matrix4;
	exports.Mesh = Mesh;
	exports.NumberKeyframeTrack = NumberKeyframeTrack;
	exports.OBJECT_TYPE = OBJECT_TYPE;
	exports.Object3D = Object3D;
	exports.PBR2Material = PBR2Material;
	exports.PBRMaterial = PBRMaterial;
	exports.PhongMaterial = PhongMaterial;
	exports.Plane = Plane;
	exports.PlaneGeometry = PlaneGeometry;
	exports.PointLight = PointLight;
	exports.PointLightShadow = PointLightShadow;
	exports.PointsMaterial = PointsMaterial;
	exports.PropertyBindingMixer = PropertyBindingMixer;
	exports.Quaternion = Quaternion;
	exports.QuaternionKeyframeTrack = QuaternionKeyframeTrack;
	exports.RGBELoader = RGBELoader;
	exports.Ray = Ray;
	exports.Raycaster = Raycaster;
	exports.RenderBuffer = RenderBuffer;
	exports.RenderList = RenderList;
	exports.RenderTarget2D = RenderTarget2D;
	exports.RenderTargetBack = RenderTargetBack;
	exports.RenderTargetBase = RenderTargetBase;
	exports.RenderTargetCube = RenderTargetCube;
	exports.Renderer = Renderer;
	exports.SHADING_TYPE = SHADING_TYPE;
	exports.SHADOW_TYPE = SHADOW_TYPE;
	exports.Scene = Scene;
	exports.ShaderChunk = ShaderChunk;
	exports.ShaderLib = ShaderLib;
	exports.ShaderMaterial = ShaderMaterial;
	exports.ShaderPostPass = ShaderPostPass;
	exports.ShadowMapPass = ShadowMapPass;
	exports.Skeleton = Skeleton;
	exports.SkinnedMesh = SkinnedMesh;
	exports.Sphere = Sphere;
	exports.SphereGeometry = SphereGeometry;
	exports.Spherical = Spherical;
	exports.SpotLight = SpotLight;
	exports.SpotLightShadow = SpotLightShadow;
	exports.StringKeyframeTrack = StringKeyframeTrack;
	exports.TEXEL_ENCODING_TYPE = TEXEL_ENCODING_TYPE;
	exports.TGALoader = TGALoader;
	exports.Texture2D = Texture2D;
	exports.Texture3D = Texture3D;
	exports.TextureBase = TextureBase;
	exports.TextureCube = TextureCube;
	exports.TorusKnotGeometry = TorusKnotGeometry;
	exports.Triangle = Triangle;
	exports.VERTEX_COLOR = VERTEX_COLOR;
	exports.Vector2 = Vector2;
	exports.Vector3 = Vector3;
	exports.Vector4 = Vector4;
	exports.VectorKeyframeTrack = VectorKeyframeTrack;
	exports.WEBGL_ATTRIBUTE_TYPE = WEBGL_ATTRIBUTE_TYPE;
	exports.WEBGL_COMPARE_FUNC = WEBGL_COMPARE_FUNC;
	exports.WEBGL_OP = WEBGL_OP;
	exports.WEBGL_PIXEL_FORMAT = WEBGL_PIXEL_FORMAT;
	exports.WEBGL_PIXEL_TYPE = WEBGL_PIXEL_TYPE;
	exports.WEBGL_TEXTURE_FILTER = WEBGL_TEXTURE_FILTER;
	exports.WEBGL_TEXTURE_TYPE = WEBGL_TEXTURE_TYPE;
	exports.WEBGL_TEXTURE_WRAP = WEBGL_TEXTURE_WRAP;
	exports.WEBGL_UNIFORM_TYPE = WEBGL_UNIFORM_TYPE;
	exports.WebGLAttribute = WebGLAttribute;
	exports.WebGLCapabilities = WebGLCapabilities;
	exports.WebGLCore = WebGLCore;
	exports.WebGLGeometry = WebGLGeometry;
	exports.WebGLProgram = WebGLProgram;
	exports.WebGLPrograms = WebGLPrograms;
	exports.WebGLProperties = WebGLProperties;
	exports.WebGLState = WebGLState;
	exports.WebGLTexture = WebGLTexture;
	exports.WebGLUniforms = WebGLUniforms;
	exports.cloneUniforms = cloneUniforms;
	exports.generateUUID = generateUUID;
	exports.isPowerOfTwo = isPowerOfTwo;
	exports.nearestPowerOfTwo = nearestPowerOfTwo;
	exports.nextPowerOfTwo = nextPowerOfTwo;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
