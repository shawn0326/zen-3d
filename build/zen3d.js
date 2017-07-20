(function(win) {
    /**
     * zen3d as a global namespace
     * @namespace
     */
    var zen3d = win.zen3d = win.zen3d || {};

    /**
     * Class inherit
     */
    var emptyConstructor = function() {};

    var inherit = function(subClass, superClass) {
        emptyConstructor.prototype = superClass.prototype;
        subClass.superClass = superClass.prototype;
        subClass.prototype = new emptyConstructor;
        subClass.prototype.constructor = subClass;
    }

    zen3d.inherit = inherit;

    /**
     * generate uuid
     */
    var generateUUID = function () {

		// http://www.broofa.com/Tools/Math.uuid.htm

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

	};

    zen3d.generateUUID = generateUUID();

    /**
     * is mobile
     */
    var isMobile = function() {
        if (!win["navigator"]) {
            return true;
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    }

    zen3d.isMobile = isMobile();

    /**
     * is web
     */
    var isWeb = function() {
        return !!document;
    }

    zen3d.isWeb = isWeb();

    /**
     * create checker board pixels
     */
    var createCheckerBoardPixels = function(width, height, blockSize) {
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

    zen3d.createCheckerBoardPixels = createCheckerBoardPixels;

    var isPowerOfTwo = function(value) {
        return ( value & ( value - 1 ) ) === 0 && value !== 0;
    }

    zen3d.isPowerOfTwo = isPowerOfTwo;

    var nearestPowerOfTwo = function ( value ) {
		return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );
	}

    zen3d.nearestPowerOfTwo = nearestPowerOfTwo;

    var nextPowerOfTwo = function ( value ) {
		value --;
		value |= value >> 1;
		value |= value >> 2;
		value |= value >> 4;
		value |= value >> 8;
		value |= value >> 16;
		value ++;

		return value;
	}
    zen3d.nextPowerOfTwo = nextPowerOfTwo;

})(window);

(function() {
    /**
     * OBJECT_TYPE
     */
    var OBJECT_TYPE = {
        MESH: "mesh",
        SKINNED_MESH: "skinned_mesh",
        LIGHT: "light",
        CAMERA: "camera",
        SCENE: "scene",
        GROUP: "group",
        POINT: "point",
        LINE: "line",
        LINE_LOOP: "line_loop",
        LINE_SEGMENTS: "line_segments",
        CANVAS2D: "canvas2d",
        SPRITE: "sprite",
        PARTICLE: "particle"
    };

    zen3d.OBJECT_TYPE = OBJECT_TYPE;

    /**
     * LIGHT_TYPE
     */
    var LIGHT_TYPE = {
        AMBIENT: "ambient",
        DIRECT: "direct",
        POINT: "point",
        SPOT: "spot"
    };

    zen3d.LIGHT_TYPE = LIGHT_TYPE;

    /**
     * MATERIAL_TYPE
     */
    var MATERIAL_TYPE = {
        BASIC: "basic",
        LAMBERT: "lambert",
        PHONG: "phong",
        CUBE: "cube",
        POINT: "point",
        LINE_BASIC: "linebasic",
        LINE_DASHED: "linedashed",
        CANVAS2D: "canvas2d",
        SPRITE: "sprite",
        SHADER: "shader",
        DEPTH: "depth",
        PARTICLE: "particle"
    };

    zen3d.MATERIAL_TYPE = MATERIAL_TYPE;

    /**
     * FOG_TYPE
     */
    var FOG_TYPE = {
        NORMAL: "normal",
        EXP2: "exp2"
    };

    zen3d.FOG_TYPE = FOG_TYPE;

    /**
     * BLEND_TYPE
     */
    var BLEND_TYPE = {
        NONE: "none",
        NORMAL: "normal",
        ADD: "add"
    };

    zen3d.BLEND_TYPE = BLEND_TYPE;

    /**
     * CULL_FACE_TYPE
     */
    var CULL_FACE_TYPE = {
        NONE: "none",
        FRONT: "front",
        BACK: "back",
        FRONT_AND_BACK: "front_and_back"
    };

    zen3d.CULL_FACE_TYPE = CULL_FACE_TYPE;

    /**
     * DRAW_SIDE
     */
    var DRAW_SIDE = {
        FRONT: "front",
        BACK: "back",
        DOUBLE: "double"
    };

    zen3d.DRAW_SIDE = DRAW_SIDE;

    /**
     * SHADING_TYPE
     */
    var SHADING_TYPE = {
        SMOOTH_SHADING: "smooth_shading",
        FLAT_SHADING: "flat_shading"
    }

    zen3d.SHADING_TYPE = SHADING_TYPE;

    /**
     * WEBGL_TEXTURE_TYPE
     */
    var WEBGL_TEXTURE_TYPE = {
        TEXTURE_2D: 0x0DE1,
        TEXTURE_CUBE_MAP: 0x8513
    };

    zen3d.WEBGL_TEXTURE_TYPE = WEBGL_TEXTURE_TYPE;

    /**
     * WEBGL_PIXEL_FORMAT
     */
    var WEBGL_PIXEL_FORMAT = {
        DEPTH_COMPONENT: 0x1902,
        ALPHA: 0x1906,
        RGB: 0x1907,
        RGBA: 0x1908,
        LUMINANCE: 0x1909,
        LUMINANCE_ALPHA: 0x190A
    }

    zen3d.WEBGL_PIXEL_FORMAT = WEBGL_PIXEL_FORMAT;

    /**
     * WEBGL_PIXEL_TYPE
     */
    var WEBGL_PIXEL_TYPE = {
        UNSIGNED_BYTE: 0x1401,
        UNSIGNED_SHORT_4_4_4_4:	0x8033,
        UNSIGNED_SHORT_5_5_5_1: 0x8034,
        UNSIGNED_SHORT_5_6_5: 0x8363,
        FLOAT: 0x1406
    }

    zen3d.WEBGL_PIXEL_TYPE = WEBGL_PIXEL_TYPE;

    /**
     * WEBGL_TEXTURE_FILTER
     */
    var WEBGL_TEXTURE_FILTER = {
        NEAREST: 0x2600,
        LINEAR: 0x2601,
        NEAREST_MIPMAP_NEAREST: 0x2700,
        LINEAR_MIPMAP_NEAREST: 0x2701,
        NEAREST_MIPMAP_LINEAR: 0x2702,
        LINEAR_MIPMAP_LINEAR: 0x2703
    }

    zen3d.WEBGL_TEXTURE_FILTER = WEBGL_TEXTURE_FILTER;

    /**
     * WEBGL_TEXTURE_WRAP
     */
    var WEBGL_TEXTURE_WRAP = {
        REPEAT:	0x2901,
        CLAMP_TO_EDGE: 0x812F,
        MIRRORED_REPEAT: 0x8370
    }

    zen3d.WEBGL_TEXTURE_WRAP = WEBGL_TEXTURE_WRAP;

    // Taken from the WebGl spec:
    // http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14
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
        SAMPLER_CUBE: 0x8B60,
        BYTE: 0xffff,
        UNSIGNED_BYTE: 0x1401,
        SHORT: 0x1402,
        UNSIGNED_SHORT: 0x1403,
        INT: 0x1404,
        UNSIGNED_INT: 0x1405,
        FLOAT: 0x1406
    }

    zen3d.WEBGL_UNIFORM_TYPE = WEBGL_UNIFORM_TYPE;

    var WEBGL_ATTRIBUTE_TYPE = {
        FLOAT_VEC2: 0x8B50,
        FLOAT_VEC3: 0x8B51,
        FLOAT_VEC4: 0x8B52,
        FLOAT: 0x1406,
        BYTE: 0xffff,
        UNSIGNED_BYTE: 0x1401,
        UNSIGNED_SHORT: 0x1403
    }

    zen3d.WEBGL_ATTRIBUTE_TYPE = WEBGL_ATTRIBUTE_TYPE;

    var WEBGL_BUFFER_USAGE = {
        STREAM_DRAW: 0x88e0,
        STATIC_DRAW: 0x88E4,
        DYNAMIC_DRAW: 0x88E8
    }

    zen3d.WEBGL_BUFFER_USAGE = WEBGL_BUFFER_USAGE;

    var SHADOW_TYPE = {
        HARD: "hard",
        PCF_SOFT: "pcf_soft"
    }

    zen3d.SHADOW_TYPE = SHADOW_TYPE;

    var TEXEL_ENCODING_TYPE = {
        LINEAR: "linear",
        SRGB: "sRGB",
        RGBE: "RGBE",
        RGBM7: "RGBM7",
        RGBM16: "RGBM16",
        RGBD: "RGBD",
        GAMMA: "Gamma"
    }

    zen3d.TEXEL_ENCODING_TYPE = TEXEL_ENCODING_TYPE;
})();

(function() {
    /**
     * a Euler class
     * @class
     */
    var Euler = function(x, y, z, order) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._order = order || Euler.DefaultOrder;
    }

    Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

    Euler.DefaultOrder = 'XYZ';

    Object.defineProperties(Euler.prototype, {
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
        order: {
            get: function() {
                return this._order;
            },
            set: function(value) {
                this._order = value;
                this.onChangeCallback();
            }
        }
    });

    /**
     * copy from another euler
     **/
    Euler.prototype.copyFrom = function(euler) {
        this._x = euler._x;
        this._y = euler._y;
        this._z = euler._z;
        this._order = euler._order;

        this.onChangeCallback();

        return this;
    }

    /**
     * set values of this euler
     **/
    Euler.prototype.set = function(x, y, z, order) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._order = order || this._order;

        this.onChangeCallback();

        return this;
    }

    /**
     * set values from rotation matrix
     **/
    Euler.prototype.setFromRotationMatrix = function(m, order, update) {

		var clamp = function(value, min, max) {

			return Math.max( min, Math.min( max, value ) );

		};

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements;
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._y = Math.asin( clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m33 );
				this._z = Math.atan2( - m12, m11 );

			} else {

				this._x = Math.atan2( m32, m22 );
				this._z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this._x = Math.asin( - clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.99999 ) {

				this._y = Math.atan2( m13, m33 );
				this._z = Math.atan2( m21, m22 );

			} else {

				this._y = Math.atan2( - m31, m11 );
				this._z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin( clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.99999 ) {

				this._y = Math.atan2( - m31, m33 );
				this._z = Math.atan2( - m12, m22 );

			} else {

				this._y = 0;
				this._z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this._y = Math.asin( - clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m33 );
				this._z = Math.atan2( m21, m11 );

			} else {

				this._x = 0;
				this._z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this._z = Math.asin( clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m22 );
				this._y = Math.atan2( - m31, m11 );

			} else {

				this._x = 0;
				this._y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this._z = Math.asin( - clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m22 );
				this._y = Math.atan2( m13, m11 );

			} else {

				this._x = Math.atan2( - m23, m33 );
				this._y = 0;

			}

		} else {

			console.warn( 'given unsupported order: ' + order );

		}

		this._order = order;

		if ( update !== false ) this.onChangeCallback();

		return this;

	}

    /**
     * set values from quaternion
     **/
    Euler.prototype.setFromQuaternion = function(q, order, update) {

		var matrix = zen3d.helpMatrix;

		q.toMatrix4(matrix);

		return this.setFromRotationMatrix(matrix, order, update);

	}

    /**
     * set change callback
     **/
    Euler.prototype.onChange = function(callback) {
        this.onChangeCallback = callback;

        return this;
    }

    Euler.prototype.onChangeCallback = function() {}

    zen3d.Euler = Euler;
})();

(function() {
    /**
     * a 3x3 matrix class
     * @class
     */
    var Matrix3 = function() {
        this.elements = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }

    /**
     * identity matrix
     **/
    Matrix3.prototype.identity = function() {
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        );

        return this;
    }

    /**
     * set the value of matrix
     **/
    Matrix3.prototype.set = function(n11, n12, n13,
        n21, n22, n23,
        n31, n32, n33) {

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
    }

    /**
     * copy matrix
     **/
    Matrix3.prototype.copy = function(m) {
        this.elements.set(m.elements);

        return this;
    }

    /**
     * multiply matrix
     **/
    Matrix3.prototype.multiply = function(m) {

        return this.multiplyMatrices(this, m);

    }

    Matrix3.prototype.premultiply = function(m) {

        return this.multiplyMatrices(m, this);

    }

    Matrix3.prototype.multiplyMatrices = function(a, b) {

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

    }

    // transform 2d
    Matrix3.prototype.transform = function(x, y, scaleX, scaleY, rotation, anchorX, anchorY) {
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
    }

    zen3d.Matrix3 = Matrix3;
})();
(function() {
    /**
     * a 4x4 matrix class
     * @class
     */
    var Matrix4 = function() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * identity matrix
     **/
    Matrix4.prototype.identity = function() {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        return this;
    }

    /**
     * set the value of matrix
     **/
    Matrix4.prototype.set = function(n11, n12, n13, n14,
        n21, n22, n23, n24,
        n31, n32, n33, n34,
        n41, n42, n43, n44) {

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
    }

    /**
     * copy matrix
     **/
    Matrix4.prototype.copy = function(m) {
        this.elements.set(m.elements);

        return this;
    }

    Matrix4.prototype.makeTranslation = function(x, y, z) {
        this.set(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        );

        return this;
    }

    /**
     * multiply matrix
     **/
    Matrix4.prototype.multiply = function(m) {

        return this.multiplyMatrices(this, m);

    }

    Matrix4.prototype.premultiply = function(m) {

        return this.multiplyMatrices(m, this);

    }

    Matrix4.prototype.multiplyMatrices = function(a, b) {

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

    }

    /**
     * transpose matrix
     **/
    Matrix4.prototype.transpose = function() {

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
    }

    Matrix4.prototype.inverse = function() {
        return this.getInverse(this);
    }

    Matrix4.prototype.getInverse = function(m) {

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

    }

    /**
     * make transform from pos&scale&rotation(Quaternion)
     **/
    Matrix4.prototype.transform = function(pos, scale, rot) {

        var rotMatrix = rot.toMatrix4();

        var rele = rotMatrix.elements;
        var ele = this.elements;

        ele[0] = rele[0] * scale.x;
        ele[1] = rele[1] * scale.y;
        ele[2] = rele[2] * scale.z;
        ele[3] = 0;

        ele[4] = rele[4] * scale.x;
        ele[5] = rele[5] * scale.y;
        ele[6] = rele[6] * scale.z;
        ele[7] = 0;

        ele[8] = rele[8] * scale.x;
        ele[9] = rele[9] * scale.y;
        ele[10] = rele[10] * scale.z;
        ele[11] = 0;

        ele[12] = pos.x;
        ele[13] = pos.y;
        ele[14] = pos.z;
        ele[15] = 1;

        return this;
    }

    Matrix4.prototype.makeRotationFromQuaternion = function(q) {

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
        te[10] = 1 - (xx + yy);

        // last column
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;

        // bottom row
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;

        return this;

    }

    var vector, matrix;
    Matrix4.prototype.decompose = function(position, quaternion, scale) {
        if (vector === undefined) {
            vector = new zen3d.Vector3();
            matrix = new Matrix4();
        }

        var te = this.elements;

        var sx = vector.set(te[0], te[1], te[2]).getLength();
        var sy = vector.set(te[4], te[5], te[6]).getLength();
        var sz = vector.set(te[8], te[9], te[10]).getLength();

        // if determine is negative, we need to invert one scale
        var det = this.determinant();
        if (det < 0) {
            sx = -sx;
        }

        position.x = te[12];
        position.y = te[13];
        position.z = te[14];

        // scale the rotation part

        matrix.elements.set(this.elements); // at this point matrix is incomplete so we can't use .copy()

        var invSX = 1 / sx;
        var invSY = 1 / sy;
        var invSZ = 1 / sz;

        matrix.elements[0] *= invSX;
        matrix.elements[1] *= invSX;
        matrix.elements[2] *= invSX;

        matrix.elements[4] *= invSY;
        matrix.elements[5] *= invSY;
        matrix.elements[6] *= invSY;

        matrix.elements[8] *= invSZ;
        matrix.elements[9] *= invSZ;
        matrix.elements[10] *= invSZ;

        quaternion.setFromRotationMatrix(matrix);

        scale.x = sx;
        scale.y = sy;
        scale.z = sz;

        return this;
    }

    Matrix4.prototype.determinant = function() {

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
            n44 = te[15];

        //TODO: make this more efficient
        //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

        return (
            n41 * (+n14 * n23 * n32 -
                n13 * n24 * n32 -
                n14 * n22 * n33 +
                n12 * n24 * n33 +
                n13 * n22 * n34 -
                n12 * n23 * n34
            ) +
            n42 * (+n11 * n23 * n34 -
                n11 * n24 * n33 +
                n14 * n21 * n33 -
                n13 * n21 * n34 +
                n13 * n24 * n31 -
                n14 * n23 * n31
            ) +
            n43 * (+n11 * n24 * n32 -
                n11 * n22 * n34 -
                n14 * n21 * n32 +
                n12 * n21 * n34 +
                n14 * n22 * n31 -
                n12 * n24 * n31
            ) +
            n44 * (-n13 * n22 * n31 -
                n11 * n23 * n32 +
                n11 * n22 * n33 +
                n13 * n21 * n32 -
                n12 * n21 * n33 +
                n12 * n23 * n31
            )

        );

    }

    Matrix4.prototype.fromArray = function(array, offset) {
        if (offset === undefined) offset = 0;

        for (var i = 0; i < 16; i++) {
            this.elements[i] = array[i + offset];
        }

        return this;
    }

    Matrix4.prototype.getMaxScaleOnAxis = function() {
        var te = this.elements;

        var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
        var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
        var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

        return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }

    Matrix4.prototype.toArray = function(array, offset) {
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

    zen3d.Matrix4 = Matrix4;
    zen3d.helpMatrix = new Matrix4();
})();
(function() {
    /**
     * a vector 2 class
     * @class
     */
    var Vector2 = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector2.prototype.lerpVectors = function(v1, v2, ratio) {
        return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
    }

    /**
     * set values of this vector
     **/
    Vector2.prototype.set = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        return this;
    }

    Vector2.prototype.min = function(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);

        return this;
    }

    Vector2.prototype.max = function(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);

        return this;
    }

    Vector2.prototype.getLength = function() {
        return Math.sqrt(this.getLengthSquared());
    }

    Vector2.prototype.getLengthSquared = function() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * normalize
     **/
    Vector2.prototype.normalize = function(thickness) {
        thickness = thickness || 1;
        var length = this.getLength();
        if (length != 0) {
            var invLength = thickness / length;
            this.x *= invLength;
            this.y *= invLength;
            return this;
        }
    }

    /**
     * subtract a vector and return a new instance
     **/
    Vector2.prototype.subtract = function(a, target) {
        if (!target) {
            target = new Vector2();
        }
        target.set(this.x - a.x, this.y - a.y);
        return target;
    }

    /**
     * copy
     */
    Vector2.prototype.copy = function(v) {
        this.x = v.x;
        this.y = v.y;

        return this;
    }

    /**
     * addVectors
     */
    Vector2.prototype.addVectors = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;
    }

    /**
     * subVectors
     */
    Vector2.prototype.subVectors = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;
    }

    /**
     * multiplyScalar
     */
    Vector2.prototype.multiplyScalar = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    /**
     * distanceToSquared
     */
    Vector2.prototype.distanceToSquared = function(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;

        return dx * dx + dy * dy;
    }

    /**
     * distanceTo
     */
    Vector2.prototype.distanceTo = function(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    /**
     * fromArray
     **/
    Vector2.prototype.fromArray = function(array, offset) {
        if (offset === undefined) offset = 0;

        this.x = array[offset];
        this.y = array[offset + 1];

        return this;
    }

    Vector2.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;

        return this;
    }

    /**
     * clone
     */
    Vector2.prototype.clone = function() {
        return new Vector2(this.x, this.y);
    }

    zen3d.Vector2 = Vector2;
})();
(function() {
    /**
     * a vector 3 class
     * @class
     */
    var Vector3 = function(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    Vector3.prototype.lerpVectors = function(v1, v2, ratio) {
        return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
    }

    /**
     * set values of this vector
     **/
    Vector3.prototype.set = function(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

        return this;
    }

    Vector3.prototype.min = function(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);

        return this;
    }

    Vector3.prototype.max = function(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);

        return this;
    }

    Vector3.prototype.getLength = function() {
        return Math.sqrt(this.getLengthSquared());
    }

    Vector3.prototype.getLengthSquared = function() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * normalize
     **/
    Vector3.prototype.normalize = function(thickness) {
        thickness = thickness || 1;
        var length = this.getLength();
        if (length != 0) {
            var invLength = thickness / length;
            this.x *= invLength;
            this.y *= invLength;
            this.z *= invLength;
            return this;
        }
    }

    /**
     * subtract a vector and return a new instance
     **/
    Vector3.prototype.subtract = function(a, target) {
        if (!target) {
            target = new Vector3();
        }
        target.set(this.x - a.x, this.y - a.y, this.z - a.z);
        return target;
    }

    /**
     * cross vectors
     **/
    Vector3.prototype.crossVectors = function(a, b) {
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
    }

    /**
     * cross
     **/
    Vector3.prototype.cross = function(v) {
        var x = this.x,
            y = this.y,
            z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;

        return this;
    }

    /**
     * dot product a vector and return a new instance
     **/
    Vector3.prototype.dot = function(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }

    /**
     * apply quaternion
     **/
    Vector3.prototype.applyQuaternion = function(q) {

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
    }

    /**
     * apply quaternion
     **/
    Vector3.prototype.applyMatrix4 = function(m) {

        // input: zen3d.Matrix4 affine matrix

        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;

        this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

        return this;

    }

    /**
     * transformDirection
     **/
    Vector3.prototype.transformDirection = function(m) {

        // input: zen3d.Matrix4 affine matrix
        // vector interpreted as a direction

        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;

        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;

        return this.normalize();

    }

    /**
     * setFromMatrixPosition
     **/
    Vector3.prototype.setFromMatrixPosition = function(m) {

        return this.setFromMatrixColumn(m, 3);

    }

    /**
     * setFromMatrixColumn
     **/
    Vector3.prototype.setFromMatrixColumn = function(m, index) {

        return this.fromArray(m.elements, index * 4);

    }

    /**
     * fromArray
     **/
    Vector3.prototype.fromArray = function(array, offset) {

        if (offset === undefined) offset = 0;

        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];

        return this;

    }

    /**
     * copy
     */
    Vector3.prototype.copy = function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;
    }

    /**
     * addVectors
     */
    Vector3.prototype.addVectors = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;
    }

    Vector3.prototype.addScalar = function(s) {
        this.x += s;
        this.y += s;
        this.z += s;

        return this;
    }

    Vector3.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
    }

    /**
     * subVectors
     */
    Vector3.prototype.subVectors = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;
    }

    Vector3.prototype.sub = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;
    }

    /**
     * multiplyScalar
     */
    Vector3.prototype.multiplyScalar = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    }

    /**
     * distanceToSquared
     */
    Vector3.prototype.distanceToSquared = function(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * distanceTo
     */
    Vector3.prototype.distanceTo = function(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    /**
     * unproject
     */
    Vector3.prototype.unproject = function() {
        var matrix;

        return function unproject(camera) {
            if (matrix === undefined) matrix = new zen3d.Matrix4();

            matrix.multiplyMatrices(camera.worldMatrix, matrix.getInverse(camera.projectionMatrix));
            return this.applyProjection(matrix);
        };
    }()

    /**
     * applyProjection
     */
    Vector3.prototype.applyProjection = function(m) {
        // input: zen3d.Matrix4 projection matrix
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

        return this;
    }

    Vector3.prototype.equals = function(v) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    }

    /**
     * clone
     */
    Vector3.prototype.clone = function() {
        return new Vector3(this.x, this.y, this.z);
    }

    zen3d.Vector3 = Vector3;
})();
(function() {
    /**
     * a vector 4 class
     * @class
     */
    var Vector4 = function(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = ( w !== undefined ) ? w : 1;
    }

    Vector4.prototype.lerpVectors = function(v1, v2, ratio) {
        return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
    }

    /**
     * set values of this vector
     **/
    Vector4.prototype.set = function(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = ( w !== undefined ) ? w : 1;

        return this;
    }

    /**
     * apply a 4x4 matrix
     */
    Vector4.prototype.applyMatrix4 = function(m) {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
		this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

		return this;
	}

    /**
     * equals
     */
    Vector4.prototype.equals = function(v) {
		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );
	}

    Vector4.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;
    }

    /**
     * multiplyScalar
     */
    Vector4.prototype.multiplyScalar = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;

        return this;
    }

    /**
     * subVectors
     */
    Vector4.prototype.subVectors = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;

        return this;
    }

    /**
     * copy
     */
    Vector4.prototype.copy = function(v) {
        this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;
	}

    zen3d.Vector4 = Vector4;
})();
(function() {
    /**
     * a Quaternion class
     * @class
     */
    var Quaternion = function(x, y, z, w) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = ( w !== undefined ) ? w : 1;
    }

    /**
     * normalize
     **/
    Quaternion.prototype.normalize = function(thickness) {
        var l = this.length();

		if ( l === 0 ) {

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
    }

    Quaternion.prototype.length = function () {
		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );
	}

    /*
     * Linearly interpolates between two quaternions.
     */
    Quaternion.prototype.lerpQuaternions = function(q1, q2, ratio) {
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
    }

    /*
     * Spherically interpolates between two quaternions
     * providing an interpolation between rotations with constant angle change rate.
     */
    Quaternion.prototype.slerpQuaternions = function(q1, q2, ratio) {
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

    /**
     * set values of this vector
     **/
    Quaternion.prototype.set = function(x, y, z, w) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = ( w !== undefined ) ? w : 1;

        this.onChangeCallback();

        return this;
    }

    /**
     * copy
     */
    Quaternion.prototype.copy = function(v) {
        this._x = v.x;
		this._y = v.y;
		this._z = v.z;
		this._w = ( v.w !== undefined ) ? v.w : 1;

        this.onChangeCallback();

		return this;
	}

    /**
     * set values from euler
     **/
    Quaternion.prototype.setFromEuler = function(euler, update) {
		var c1 = Math.cos( euler._x / 2 );
		var c2 = Math.cos( euler._y / 2 );
		var c3 = Math.cos( euler._z / 2 );
		var s1 = Math.sin( euler._x / 2 );
		var s2 = Math.sin( euler._y / 2 );
		var s3 = Math.sin( euler._z / 2 );

		var order = euler._order;

		if ( order === 'XYZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'YXZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( order === 'ZXY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'ZYX' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( order === 'YZX' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'XZY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		}

        if ( update !== false ) this.onChangeCallback();

		return this;

	}

    /**
     * set values from rotation matrix
     **/
    Quaternion.prototype.setFromRotationMatrix = function ( m ) {

		var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this.onChangeCallback();

		return this;

	}

    Quaternion.prototype.setFromUnitVectors = function () {

		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1 = new zen3d.Vector3();
		var r;

		var EPS = 0.000001;

		return function setFromUnitVectors( vFrom, vTo ) {

			if ( v1 === undefined ) v1 = new zen3d.Vector3();

			r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			return this.normalize();

		};

	}();

    /**
     * quaternion to matrix
     **/
    Quaternion.prototype.toMatrix4 = function(target) {
        if(!target) {
            target = new zen3d.Matrix4();
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
    }

    /**
     * set quaternion from axis angle
     **/
    Quaternion.prototype.setFromAxisAngle = function(axis, angle) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this.onChangeCallback();

		return this;
	}

    /**
     * set change callback
     **/
    Quaternion.prototype.onChange = function(callback) {
        this.onChangeCallback = callback;

        return this;
    }

    Quaternion.prototype.onChangeCallback = function() {}

    zen3d.Quaternion = Quaternion;
})();

(function() {
    var Box2 = function(min, max) {
        this.min = (min !== undefined) ? min : new zen3d.Vector2(+Infinity, +Infinity);
        this.max = (max !== undefined) ? max : new zen3d.Vector2(-Infinity, -Infinity);
    }

    Box2.prototype.set = function(x1, y1, x2, y2) {
        this.min.set(x1, y1);
        this.max.set(x2, y2);
    }

    Box2.prototype.copy = function(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);

        return this;
    }

    zen3d.Box2 = Box2;
})();
(function() {
    var Box3 = function(min, max) {
        this.min = (min !== undefined) ? min : new zen3d.Vector3(+Infinity, +Infinity, +Infinity);
        this.max = (max !== undefined) ? max : new zen3d.Vector3(-Infinity, -Infinity, -Infinity);
    }

    Box3.prototype.set = function(min, max) {
        this.min.copy(min);
        this.max.copy(max);
    }

    Box3.prototype.setFromPoints = function(points) {
        this.makeEmpty();

        for (var i = 0, il = points.length; i < il; i++) {
            this.expandByPoint(points[i]);
        }

        return this;
    }

    Box3.prototype.makeEmpty = function() {
        this.min.x = this.min.y = this.min.z = +Infinity;
        this.max.x = this.max.y = this.max.z = -Infinity;

        return this;
    }

    Box3.prototype.expandByPoint = function(point) {
        this.min.min(point);
        this.max.max(point);

        return this;
    }

    Box3.prototype.expandByScalar = function(scalar) {
        this.min.addScalar(-scalar);
        this.max.addScalar(scalar);

        return this;
    }

    Box3.prototype.setFromArray = function(array, gap) {
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
    }

    Box3.prototype.isEmpty = function() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }

    Box3.prototype.equals = function(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }

    Box3.prototype.getCenter = function(optionalTarget) {
        var result = optionalTarget || new zen3d.Vector3();
        return this.isEmpty() ? result.set(0, 0, 0) : result.addVectors(this.min, this.max).multiplyScalar(0.5);
    }

    Box3.prototype.applyMatrix4 = function() {
        var points = [
            new zen3d.Vector3(),
            new zen3d.Vector3(),
            new zen3d.Vector3(),
            new zen3d.Vector3(),
            new zen3d.Vector3(),
            new zen3d.Vector3(),
            new zen3d.Vector3(),
            new zen3d.Vector3()
        ];

        return function applyMatrix4(matrix) {
            // transform of empty box is an empty box.
            if (this.isEmpty()) return this;

            // NOTE: I am using a binary pattern to specify all 2^3 combinations below
            points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
            points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
            points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
            points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
            points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
            points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
            points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
            points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

            this.setFromPoints(points);

            return this;
        };
    }()

    Box3.prototype.copy = function(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);

        return this;
    }

    zen3d.Box3 = Box3;
})();
(function() {
    var Sphere = function(center, radius) {
        this.center = (center !== undefined) ? center : new zen3d.Vector3();
        this.radius = (radius !== undefined) ? radius : 0;
    }

    Sphere.prototype.set = function(center, radius) {
        this.center.copy(center);
        this.radius = radius;

        return this;
    }

    Sphere.prototype.setFromArray = function() {
        var box = new zen3d.Box3();
        var point = new zen3d.Vector3();

        return function setFromArray(array, gap) {
            var _gap = (gap !== undefined ? gap : 3);

            var center = this.center;

            box.setFromArray(array, _gap).getCenter(center);

            var maxRadiusSq = 0;

            for (var i = 0, l = array.length; i < l; i += _gap) {
                var x = array[i];
                var y = array[i + 1];
                var z = array[i + 2];

                point.set(x, y, z);

                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(point));
            }

            this.radius = Math.sqrt(maxRadiusSq);

            return this;
        }
    }();

    Sphere.prototype.applyMatrix4 = function(matrix) {
        this.center.applyMatrix4(matrix);
        this.radius = this.radius * matrix.getMaxScaleOnAxis();

        return this;
    }

    Sphere.prototype.getBoundingBox = function(optionalTarget) {
        var box = optionalTarget || new zen3d.Box3();

        box.set(this.center, this.center);
        box.expandByScalar(this.radius);

        return box;
    }

    Sphere.prototype.clone = function() {
        return new Sphere().copy(this);
    }

    Sphere.prototype.copy = function(sphere) {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;

        return this;
    }

    zen3d.Sphere = Sphere;
})();
(function() {
    var Plane = function(normal, constant) {
        this.normal = (normal !== undefined) ? normal : new zen3d.Vector3(1, 0, 0);
        this.constant = (constant !== undefined) ? constant : 0;
    }

    Plane.prototype.set = function(normal, constant) {
        this.normal.copy(normal);
        this.constant = constant;

        return this;
    }

    Plane.prototype.setComponents = function(x, y, z, w) {
        this.normal.set(x, y, z);
        this.constant = w;

        return this;
    }

    Plane.prototype.normalize = function() {
        // Note: will lead to a divide by zero if the plane is invalid.

        var inverseNormalLength = 1.0 / this.normal.getLength();
        this.normal.multiplyScalar(inverseNormalLength);
        this.constant *= inverseNormalLength;

        return this;
    }

    Plane.prototype.distanceToPoint = function(point) {
        return this.normal.dot(point) + this.constant;
    }

    zen3d.Plane = Plane;
})();
(function() {
    var Frustum = function(p0, p1, p2, p3, p4, p5) {
        this.planes = [
            (p0 !== undefined) ? p0 : new zen3d.Plane(),
            (p1 !== undefined) ? p1 : new zen3d.Plane(),
            (p2 !== undefined) ? p2 : new zen3d.Plane(),
            (p3 !== undefined) ? p3 : new zen3d.Plane(),
            (p4 !== undefined) ? p4 : new zen3d.Plane(),
            (p5 !== undefined) ? p5 : new zen3d.Plane()
        ];
    }

    Frustum.prototype.set = function(p0, p1, p2, p3, p4, p5) {
        var planes = this.planes;

        planes[0].copy(p0);
        planes[1].copy(p1);
        planes[2].copy(p2);
        planes[3].copy(p3);
        planes[4].copy(p4);
        planes[5].copy(p5);

        return this;
    }

    Frustum.prototype.setFromMatrix = function(m) {
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
    }

    Frustum.prototype.intersectsSphere = function(sphere) {
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
    }

    Frustum.prototype.intersectsBox = function() {
        var p1 = new zen3d.Vector3();
        var p2 = new zen3d.Vector3();

        return function intersectsBox(box) {
            var planes = this.planes;

            for (var i = 0; i < 6; i++) {
                var plane = planes[i];

                p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
                p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
                p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
                p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
                p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
                p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

                var d1 = plane.distanceToPoint(p1);
                var d2 = plane.distanceToPoint(p2);

                // if both outside plane, no intersection

                if (d1 < 0 && d2 < 0) {
                    return false;
                }
            }

            return true;
        }
    }();

    zen3d.Frustum = Frustum;
})();
(function() {
    var Color3 = function(r, g, b) {
        this.r = 0;
        this.g = 0;
        this.b = 0;

        if(g === undefined && b === undefined) {
            return this.setHex(r);
        }

        return this.setRGB(r, g, b);
    }

    Color3.prototype.lerpColors = function(c1, c2, ratio) {
        this.r = ratio * (c2.r - c1.r) + c1.r;
        this.g = ratio * (c2.g - c1.g) + c1.g;
        this.b = ratio * (c2.b - c1.b) + c1.b;

        this.r = this.r;
        this.g = this.g;
        this.b = this.b;
    }

    /**
     * copy
     */
    Color3.prototype.copy = function(v) {
        this.r = v.r;
        this.g = v.g;
        this.b = v.b;

        return this;
    }

    // set from hex
    Color3.prototype.setHex = function(hex) {
        hex = Math.floor(hex);

        this.r = (hex >> 16 & 255) / 255;
        this.g = (hex >> 8 & 255) / 255;
        this.b = (hex & 255) / 255;

        return this;
    }

    // set from RGB
    Color3.prototype.setRGB = function(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;

        return this;
    }

    // set from HSL
    Color3.prototype.setHSL = function() {

        function euclideanModulo(n, m) {
            return ((n % m) + m) % m;
        }

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
            return p;
        }

        return function setHSL(h, s, l) {
            // h,s,l ranges are in 0.0 - 1.0
            h = euclideanModulo(h, 1);
            s = Math.max(0, Math.min(1, s));
            l = Math.max(0, Math.min(1, l));

            if (s === 0) {
                this.r = this.g = this.b = l;
            } else {
                var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
                var q = (2 * l) - p;

                this.r = hue2rgb(q, p, h + 1 / 3);
                this.g = hue2rgb(q, p, h);
                this.b = hue2rgb(q, p, h - 1 / 3);
            }
            return this;
        };

    }();

    zen3d.Color3 = Color3;
})();
(function() {
    var Ray = function(origin, direction) {
        this.origin = (origin !== undefined) ? origin : new zen3d.Vector3();
        this.direction = (direction !== undefined) ? direction : new zen3d.Vector3();
    }

    Ray.prototype.set = function(origin, direction) {
        this.origin.copy(origin);
        this.direction.copy(direction);
    }

    Ray.prototype.at = function(t, optionalTarget) {
        var result = optionalTarget || new zen3d.Vector3();

        return result.copy(this.direction).multiplyScalar(t).add(this.origin);
    }

    Ray.prototype.intersectsSphere = function() {
        var v1 = new zen3d.Vector3();

        return function intersectSphere(sphere, optionalTarget) {
            v1.subVectors(sphere.center, this.origin);
            var tca = v1.dot(this.direction);
            var d2 = v1.dot(v1) - tca * tca;
            var radius2 = sphere.radius * sphere.radius;
            if (d2 > radius2) {
                return null;
            }

            var thc = Math.sqrt(radius2 - d2);

            // t0 = first intersect point - entrance on front of sphere
            var t0 = tca - thc;

            // t1 = second intersect point - exit point on back of sphere
            var t1 = tca + thc;
            // console.log(t0, t1);
            // test to see if both t0 and t1 are behind the ray - if so, return null
            if (t0 < 0 && t1 < 0) {
                return null;
            }
            // test to see if t0 is behind the ray:
            // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
            // in order to always return an intersect point that is in front of the ray.
            if (t0 < 0) {
                return this.at(t1, optionalTarget);
            }

            // else t0 is in front of the ray, so return the first collision point scaled by t0
            return this.at(t0, optionalTarget);
        };
    }()

    Ray.prototype.intersectsBox = function(box, optionalTarget) {
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

        if ((tmin > tymax) || (tymin > tmax)) return null;

        // These lines also handle the case where tmin or tmax is NaN
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

        if ((tmin > tzmax) || (tzmin > tmax)) return null;

        if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

        if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

        //return point closest to the ray (positive side)

        if (tmax < 0) return null;

        return this.at(tmin >= 0 ? tmin : tmax, optionalTarget);
    }

    Ray.prototype.intersectTriangle = function() {

        // Compute the offset origin, edges, and normal.
        var diff = new zen3d.Vector3();
        var edge1 = new zen3d.Vector3();
        var edge2 = new zen3d.Vector3();
        var normal = new zen3d.Vector3();

        return function intersectTriangle(a, b, c, backfaceCulling, optionalTarget) {
            // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

            edge1.subVectors(b, a);
            edge2.subVectors(c, a);
            normal.crossVectors(edge1, edge2);

            // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
            // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
            //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
            //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
            //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
            var DdN = this.direction.dot(normal);
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

            diff.subVectors(this.origin, a);
            var DdQxE2 = sign * this.direction.dot(edge2.crossVectors(diff, edge2));

            // b1 < 0, no intersection
            if (DdQxE2 < 0) {

                return null;

            }

            var DdE1xQ = sign * this.direction.dot(edge1.cross(diff));

            // b2 < 0, no intersection
            if (DdE1xQ < 0) {

                return null;

            }

            // b1+b2 > 1, no intersection
            if (DdQxE2 + DdE1xQ > DdN) {

                return null;

            }

            // Line intersects triangle, check if ray does.
            var QdN = -sign * diff.dot(normal);

            // t < 0, no intersection
            if (QdN < 0) {

                return null;

            }

            // Ray intersects triangle.
            return this.at(QdN / DdN, optionalTarget);
        }
    }()

    Ray.prototype.copy = function(ray) {
        this.origin.copy(ray.origin);
        this.direction.copy(ray.direction);

        return this;
    }

    Ray.prototype.applyMatrix4 = function(matrix4) {
        this.direction.add(this.origin).applyMatrix4(matrix4);
        this.origin.applyMatrix4(matrix4);
        this.direction.sub(this.origin);
        this.direction.normalize();

        return this;
    }

    zen3d.Ray = Ray;
})();
(function() {
    function Triangle(a, b, c) {
        this.a = (a !== undefined) ? a : new zen3d.Vector3();
        this.b = (b !== undefined) ? b : new zen3d.Vector3();
        this.c = (c !== undefined) ? c : new zen3d.Vector3();
    }

    Triangle.prototype.set = function(a, b, c) {
        this.a.copy(a);
        this.b.copy(b);
        this.c.copy(c);

        return this;
    }

    Triangle.normal = function() {
        var v0 = new zen3d.Vector3();

        return function normal(a, b, c, optionalTarget) {
            var result = optionalTarget || new zen3d.Vector3();

            result.subVectors(c, b);
            v0.subVectors(a, b);
            result.cross(v0);

            var resultLengthSq = result.getLengthSquared();
            if (resultLengthSq > 0) {
                return result.multiplyScalar(1 / Math.sqrt(resultLengthSq));
            }

            return result.set(0, 0, 0);
        };
    }();

    // static/instance method to calculate barycentric coordinates
    // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
    Triangle.barycoordFromPoint = function() {
        var v0 = new zen3d.Vector3();
        var v1 = new zen3d.Vector3();
        var v2 = new zen3d.Vector3();

        return function barycoordFromPoint(point, a, b, c, optionalTarget) {
            v0.subVectors(c, a);
            v1.subVectors(b, a);
            v2.subVectors(point, a);

            var dot00 = v0.dot(v0);
            var dot01 = v0.dot(v1);
            var dot02 = v0.dot(v2);
            var dot11 = v1.dot(v1);
            var dot12 = v1.dot(v2);

            var denom = (dot00 * dot11 - dot01 * dot01);

            var result = optionalTarget || new zen3d.Vector3();

            // collinear or singular triangle
            if (denom === 0) {
                // arbitrary location outside of triangle?
                // not sure if this is the best idea, maybe should be returning undefined
                return result.set(-2, -1, -1);
            }

            var invDenom = 1 / denom;
            var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

            // barycentric coordinates must always sum to 1
            return result.set(1 - u - v, v, u);
        };
    }();

    Triangle.containsPoint = function() {
        var v1 = new zen3d.Vector3();

        return function containsPoint(point, a, b, c) {
            var result = Triangle.barycoordFromPoint(point, a, b, c, v1);

            return (result.x >= 0) && (result.y >= 0) && ((result.x + result.y) <= 1);
        };
    }();

    zen3d.Triangle = Triangle;
})();
(function() {
    var Curve = function(posPoints, ctrlPoints) {
        this.posPoints = undefined;
        this.ctrlPoints = undefined;

        this.segCount = 0;

        this.set(posPoints, ctrlPoints);
    }

    Curve.prototype.set = function (posPoints, ctrlPoints) {
        this.posPoints = posPoints;
        this.ctrlPoints = ctrlPoints;

        if(posPoints.length !== ctrlPoints.length) {
            console.warn("Curve: posPoints and ctrlPoints's length not equal!");
        }

        this.segCount = posPoints.length - 1;
    }

    Curve.prototype.calc = function () {
        var A0 = new zen3d.Vector2();
        var B0 = new zen3d.Vector2();
        var A1 = new zen3d.Vector2();
        var B1 = new zen3d.Vector2();

        return function calc(t) {
            for(var i = 0; i < this.segCount; i++) {
                if(t >= this.posPoints[i].x && t <= this.posPoints[i + 1].x) {
                    A0.copy(this.posPoints[i]);
                    A1.copy(this.posPoints[i + 1]);
                    B0.copy(this.ctrlPoints[i]);
                    B1.copy(this.ctrlPoints[i + 1]);
                    break;
                }
            }

            if (!A0) {
                A0.copy(this.posPoints[this.posPoints.length - 1]);
            }
            if (!B0) {
                B0.copy(this.ctrlPoints[this.ctrlPoints.length - 1]);
            }
            A1.copy(A1 || A0);
            B1.copy(B1 || B0);

            t = (t - A0.x) / (A1.x - A0.x);
            return this._cubic_bezier(A0.y, B0.y, B1.y, A1.y, t);
        }
    }();

    // TODO: a smarter curve sampler?????

    // average x sampler
    // first x and last x must in result
    // samplerNum can't less than 2
    // result: [t0, value0, t1, value1, ...]
    Curve.prototype.averageXSampler = function(samplerNum) {
        if(samplerNum < 2) {
            console.warn("Curve: sampler num less than 2!");
        }

        var sampler = [];

        var firstT = this.posPoints[0].x;
        var lastT = this.posPoints[this.posPoints.length - 1].x;
        var tempT = (lastT - firstT) / (samplerNum - 1);
        var t = 0;
        for(var i = 0; i < samplerNum; i++) {
            if(i === samplerNum - 1) {
                t = lastT;// fix
            } else {
                t = firstT + i * tempT;
            }

            sampler.push(t, this.calc(t));
        }

        return sampler;
    }

    Curve.prototype._cubic_bezier = function(p0, p1, p2, p3, t) {
        p0 = this._mix(p0, p1, t);
        p1 = this._mix(p1, p2, t);
        p2 = this._mix(p2, p3, t);

        p0 = this._mix(p0, p1, t);
        p1 = this._mix(p1, p2, t);

        p0 = this._mix(p0, p1, t);

        return p0;
    }

    Curve.prototype._mix = function(value0, value1, t) {
        return value0 * (1 - t) + value1 * t;
    }

    zen3d.Curve = Curve;
})();
(function() {
    /**
     * EventDispatcher Class
     **/
    var EventDispatcher = function() {
        this.eventMap = {};
    }

    /**
     * add a event listener
     **/
    EventDispatcher.prototype.addEventListener = function(type, listener, thisObject) {
        var list = this.eventMap[type];

        if(!list) {
            list = this.eventMap[type] = [];
        }

        list.push({listener: listener, thisObject: thisObject || this});
    }

    /**
     * remove a event listener
     **/
    EventDispatcher.prototype.removeEventListener = function(type, listener, thisObject) {
        var list = this.eventMap[type];

        if(!list) {
            return;
        }

        for(var i = 0, len = list.length; i < len; i++) {
            var bin = list[i];
            if(bin.listener == listener && bin.thisObject == (thisObject || this)) {
                list.splice(i, 1);
                break;
            }
        }
    }

    /**
     * dispatch a event
     **/
    EventDispatcher.prototype.dispatchEvent = function(event) {
        event.target = this;
        this.notifyListener(event);
    }

    /**
     * notify listener
     **/
    EventDispatcher.prototype.notifyListener = function(event) {
        var list = this.eventMap[event.type];

        if(!list) {
            return;
        }

        for(var i = 0, len = list.length; i < len; i++) {
            var bin = list[i];
            bin.listener.call(bin.thisObject, event);
        }
    }

    zen3d.EventDispatcher = EventDispatcher;
})();

(function() {
    var Raycaster = function(origin, direction, near, far) {
        this.ray = new zen3d.Ray(origin, direction);

        this.near = near || 0;

        this.far = far || Infinity;
    }

    Raycaster.prototype.set = function(origin, direction) {
        this.ray.set(origin, direction);
    }

    Raycaster.prototype.setFromCamera = function(coords, camera) {
        // if ((camera && camera.isPerspectiveCamera)) {
            this.ray.origin.setFromMatrixPosition(camera.worldMatrix);
            this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
        // } else if ((camera && camera.isOrthographicCamera)) {
        //     this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
        //     this.ray.direction.set(0, 0, -1).transformDirection(camera.worldMatrix);
        // } else {
        //     console.error('Raycaster: Unsupported camera type.');
        // }
    }

    function ascSort(a, b) {
        return a.distance - b.distance;
    }

    function intersectObject(object, raycaster, intersects, recursive) {
        object.raycast(raycaster, intersects);

        if (recursive === true) {
            var children = object.children;

            for (var i = 0, l = children.length; i < l; i++) {
                intersectObject(children[i], raycaster, intersects, true);
            }
        }
    }

    Raycaster.prototype.intersectObject = function(object, recursive) {
        var intersects = [];

        intersectObject(object, this, intersects, recursive);

        intersects.sort(ascSort);

        return intersects;
    }

    Raycaster.prototype.intersectObjects = function(objects, recursive) {
        var intersects = [];

        if (Array.isArray(objects) === false) {
            console.warn('Raycaster.intersectObjects: objects is not an Array.');
            return intersects;
        }

        for (var i = 0, l = objects.length; i < l; i++) {
            intersectObject(objects[i], this, intersects, recursive);
        }

        intersects.sort(ascSort);

        return intersects;
    }

    zen3d.Raycaster = Raycaster;
})();
(function() {

    /**
     * get max precision
     * @param gl
     * @param precision {string} the expect precision, can be: "highp"|"mediump"|"lowp"
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

    /**
     * webgl get extension
     */
    var getExtension = function(gl, name) {
        var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
        var ext = null;
        for (var i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) {
                break;
            }
        }
        return ext;
    }

    var WebGLCapabilities = function(gl) {
        this.version = parseFloat(/^WebGL\ ([0-9])/.exec(gl.getParameter(gl.VERSION))[1]);

        this.precision = "highp";

        this.maxPrecision = getMaxPrecision(gl, this.precision);

        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

        this.maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);

        this.floatTextures = !!getExtension(gl, 'OES_texture_float');

        this.anisotropyExt = getExtension(gl, 'EXT_texture_filter_anisotropic');

        this.maxAnisotropy = (this.anisotropyExt !== null) ? gl.getParameter(this.anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;

        // use dfdx and dfdy must enable OES_standard_derivatives
        var ext = getExtension(gl, "OES_standard_derivatives");
        // GL_OES_standard_derivatives
        var ext = getExtension(gl, "GL_OES_standard_derivatives");
    }

    zen3d.WebGLCapabilities = WebGLCapabilities;
})();
(function() {
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;

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

    var WebGLState = function(gl, capabilities) {
        this.gl = gl;
        this.capabilities = capabilities;

        this.states = {};

        this.currentBlending = null;
        this.currentPremultipliedAlpha = null;

        this.currentCullFace = null;

        this.currentViewport = new zen3d.Vector4();

        this.currentClearColor = new zen3d.Vector4();

        this.currentTextureSlot = null;
        this.currentBoundTextures = {};

        this.currentBoundBuffers = {};

        this.emptyTextures = {};
        this.emptyTextures[gl.TEXTURE_2D] = createTexture(gl, gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
        this.emptyTextures[gl.TEXTURE_CUBE_MAP] = createTexture(gl, gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);

        this.currentFlipSided = false;

        this.currentDepthMask = true;

        this.currentLineWidth = null;

        this.currentProgram = null;
    }

    WebGLState.prototype.setBlend = function(blend, premultipliedAlpha) {
        var gl = this.gl;

        if (blend !== BLEND_TYPE.NONE) {
            this.enable(gl.BLEND);
        } else {
            this.disable(gl.BLEND);
        }

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

            this.currentBlending = blend;
            this.currentPremultipliedAlpha = premultipliedAlpha;
        }
    }

    WebGLState.prototype.setFlipSided = function(flipSided) {
        var gl = this.gl;

        if (this.currentFlipSided !== flipSided) {
            if (flipSided) {
                gl.frontFace(gl.CW);
            } else {
                gl.frontFace(gl.CCW);
            }

            this.currentFlipSided = flipSided;
        }
    }

    WebGLState.prototype.setCullFace = function(cullFace) {
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
    }

    WebGLState.prototype.viewport = function(x, y, width, height) {
        var currentViewport = this.currentViewport;
        if (currentViewport.x !== x ||
            currentViewport.y !== y ||
            currentViewport.z !== width ||
            currentViewport.w !== height
        ) {
            var gl = this.gl;
            gl.viewport(x, y, width, height);
            currentViewport.set(x, y, width, height);
        }
    }

    WebGLState.prototype.clearColor = function(r, g, b, a) {
        var currentClearColor = this.currentClearColor;
        if (currentClearColor.x !== r ||
            currentClearColor.y !== g ||
            currentClearColor.z !== b ||
            currentClearColor.w !== a
        ) {
            var gl = this.gl;
            gl.clearColor(r, g, b, a);
            currentClearColor.set(r, g, b, a);
        }
    }

    WebGLState.prototype.activeTexture = function(slot) {
        var gl = this.gl;

        if (slot === undefined) {
            slot = gl.TEXTURE0 + this.capabilities.maxTextures - 1;
        }

        if (this.currentTextureSlot !== slot) {
            gl.activeTexture(slot);
            this.currentTextureSlot = slot;
        }
    }

    WebGLState.prototype.bindTexture = function(type, texture) {
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
    }

    WebGLState.prototype.bindBuffer = function(type, buffer) {
        var gl = this.gl;

        var boundBuffer = this.currentBoundBuffers[type];

        if (boundBuffer !== buffer) {
            gl.bindBuffer(type, buffer);
            this.currentBoundBuffers[type] = buffer;
        }
    }

    WebGLState.prototype.enable = function(id) {
        if (this.states[id] !== true) {
            this.gl.enable(id);
            this.states[id] = true;
        }
    }

    WebGLState.prototype.disable = function(id) {
        if (this.states[id] !== false) {
            this.gl.disable(id);
            this.states[id] = false;
        }
    }

    // depth mask should attach to a frame buffer???
    WebGLState.prototype.depthMask = function(flag) {
        if(flag !== this.currentDepthMask) {
            this.gl.depthMask(flag);
            this.currentDepthMask = flag;
        }
    }

    WebGLState.prototype.setLineWidth = function(width) {
        if(width !== this.currentLineWidth) {
            if(this.capabilities.version >= 1.0) {
                this.gl.lineWidth(width);
            }
            this.currentLineWidth = width;
        }
    }

    WebGLState.prototype.setProgram = function(program) {
        if(this.currentProgram !== program) {
            this.gl.useProgram(program.id);
            this.currentProgram = program;
        }
    }

    zen3d.WebGLState = WebGLState;
})();
(function() {
    var WebGLProperties = function() {
        this.properties = {};
    }

    WebGLProperties.prototype.get = function(object) {
        var uuid = object.uuid;
        var map = this.properties[uuid];
        if (map === undefined) {
            map = {};
            this.properties[uuid] = map;
        }
        return map;
    }

    WebGLProperties.prototype.delete = function(object) {
        delete this.properties[object.uuid];
    }

    WebGLProperties.prototype.clear = function() {
        this.properties = {};
    }

    zen3d.WebGLProperties = WebGLProperties;
})();
(function() {
    var WEBGL_TEXTURE_FILTER = zen3d.WEBGL_TEXTURE_FILTER;
    var WEBGL_TEXTURE_WRAP = zen3d.WEBGL_TEXTURE_WRAP;
    var isWeb = zen3d.isWeb;

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

    var _isPowerOfTwo = zen3d.isPowerOfTwo;
    var _nearestPowerOfTwo = zen3d.nearestPowerOfTwo;

    function isPowerOfTwo(image) {
        return _isPowerOfTwo(image.width) && _isPowerOfTwo(image.height);
    }

    function makePowerOf2(image) {
        if (isWeb && (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement)) {

            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = _nearestPowerOfTwo(image.width);
            canvas.height = _nearestPowerOfTwo(image.height);

            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            console.warn('image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

            return canvas;

        }

        return image;
    }

    function clampToMaxSize(image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {

            if (!isWeb) {
                console.warn('image is too big (' + image.width + 'x' + image.height + '). max size is ' + maxSize + 'x' + maxSize, image);
                return image;
            }
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

    var WebGLTexture = function(gl, state, properties, capabilities) {
        this.gl = gl;

        this.state = state;

        this.properties = properties;

        this.capabilities = capabilities;
    }

    WebGLTexture.prototype.setTexture2D = function(texture, slot) {
        var gl = this.gl;
        var state = this.state;

        var textureProperties = this.properties.get(texture);

        if (texture.version > 0 && textureProperties.__version !== texture.version) {

            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }

            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);

            var image = clampToMaxSize(texture.image, this.capabilities.maxTextureSize);

            if (textureNeedsPowerOfTwo(texture) && isPowerOfTwo(image) === false) {
                image = makePowerOf2(image);
            }

            var isPowerOfTwoImage = isPowerOfTwo(image);

            this.setTextureParameters(texture, isPowerOfTwoImage);

            var mipmap, mipmaps = texture.mipmaps,
                pixelFormat = texture.pixelFormat,
                pixelType = texture.pixelType;

            if(texture.isDataTexture) {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {

                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, pixelFormat, mipmap.width, mipmap.height, texture.border, pixelFormat, pixelType, mipmap.data);
                    }

                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, image.width, image.height, texture.border, pixelFormat, pixelType, image.data);
                }
            } else {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {

                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, pixelFormat, pixelFormat, pixelType, mipmap);
                    }

                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, pixelFormat, pixelType, image);
                }
            }

            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            textureProperties.__version = texture.version;

            return;
        }

        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
    }

    WebGLTexture.prototype.setTextureCube = function(texture, slot) {
        var gl = this.gl;
        var state = this.state;

        var textureProperties = this.properties.get(texture);

        if (texture.version > 0 && textureProperties.__version !== texture.version) {

            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }

            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);

            var images = [];

            for (var i = 0; i < 6; i++) {
                images[i] = clampToMaxSize(texture.images[i], this.capabilities.maxCubemapSize);
            }

            var image = images[0];
            var isPowerOfTwoImage = isPowerOfTwo(image);

            this.setTextureParameters(texture, isPowerOfTwoImage);

            var pixelFormat = texture.pixelFormat,
                pixelType = texture.pixelType;

            for (var i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, pixelFormat, pixelFormat, pixelType, images[i]);
            }

            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }

            textureProperties.__version = texture.version;

            return;
        }

        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
    }

    WebGLTexture.prototype.setTextureParameters = function(texture, isPowerOfTwoImage) {
        var gl = this.gl;
        var textureType = texture.textureType;

        if (isPowerOfTwoImage) {
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, texture.wrapS);
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, texture.wrapT);

            gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, texture.magFilter);
            gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, texture.minFilter);
        } else {
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            if (texture.wrapS !== gl.CLAMP_TO_EDGE || texture.wrapT !== gl.CLAMP_TO_EDGE) {
                console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to zen3d.TEXTURE_WRAP.CLAMP_TO_EDGE.', texture);
            }

            gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter));
            gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter));

            if (
                (texture.minFilter !== gl.NEAREST && texture.minFilter !== gl.LINEAR) ||
                (texture.magFilter !== gl.NEAREST && texture.magFilter !== gl.LINEAR)
            ) {
                console.warn('Texture is not power of two. Texture.minFilter and Texture.magFilter should be set to zen3d.TEXTURE_FILTER.NEAREST or zen3d.TEXTURE_FILTER.LINEAR.', texture);
            }
        }

        // EXT_texture_filter_anisotropic
        var extension = this.capabilities.anisotropyExt;
        if(extension && texture.anisotropy > 1) {
            gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, this.capabilities.maxAnisotropy));
        }
    }

    WebGLTexture.prototype.setRenderTarget2D = function(renderTarget) {
        var gl = this.gl;
        var state = this.state;

        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);

        if (textureProperties.__webglTexture === undefined || renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            textureProperties.__webglTexture = gl.createTexture();
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);

            var isTargetPowerOfTwo = isPowerOfTwo(renderTarget);

            this.setTextureParameters(renderTarget.texture, isTargetPowerOfTwo);

            var pixelFormat = renderTarget.texture.pixelFormat,
                pixelType = renderTarget.texture.pixelType;
            gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, renderTarget.width, renderTarget.height, 0, pixelFormat, pixelType, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureProperties.__webglTexture, 0);

            if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            state.bindTexture(gl.TEXTURE_2D, null);

            if (renderTarget.depthBuffer) {
                renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();

                var renderbuffer = renderTargetProperties.__webglDepthbuffer;

                gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

                if (renderTarget.stencilBuffer) {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                } else {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                }

                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            }

            return;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
    }

    WebGLTexture.prototype.setRenderTargetCube = function(renderTarget) {
        var gl = this.gl;
        var state = this.state;

        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);

        if (textureProperties.__webglTexture === undefined || renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            textureProperties.__webglTexture = gl.createTexture();
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);

            var isTargetPowerOfTwo = isPowerOfTwo(renderTarget);

            this.setTextureParameters(renderTarget.texture, isTargetPowerOfTwo);

            var pixelFormat = renderTarget.texture.pixelFormat,
                pixelType = renderTarget.texture.pixelType;
            for (var i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, pixelFormat, renderTarget.width, renderTarget.height, 0, pixelFormat, pixelType, null);
            }
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);

            if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }

            state.bindTexture(gl.TEXTURE_CUBE_MAP, null);

            if (renderTarget.depthBuffer) {
                renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();

                var renderbuffer = renderTargetProperties.__webglDepthbuffer;

                gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

                if (renderTarget.stencilBuffer) {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                } else {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                }

                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            }

            return;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
    }

    WebGLTexture.prototype.updateRenderTargetMipmap = function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
        var texture = renderTarget.texture;

        if (texture.generateMipmaps && isPowerOfTwo(renderTarget) &&
            texture.minFilter !== gl.NEAREST &&
            texture.minFilter !== gl.LINEAR) {

            var target = texture.textureType;
            var webglTexture = this.properties.get(texture).__webglTexture;

            state.bindTexture(target, webglTexture);
            gl.generateMipmap(target);
            state.bindTexture(target, null);

        }
    }

    WebGLTexture.prototype.onTextureDispose = function(event) {
        var gl = this.gl;
        var texture = event.target;
        var textureProperties = this.properties.get(texture);

        texture.removeEventListener('dispose', this.onTextureDispose, this);

        if(textureProperties.__webglTexture) {
            gl.deleteTexture(textureProperties.__webglTexture);
        }

        this.properties.delete(texture);
    }

    WebGLTexture.prototype.onRenderTargetDispose = function(event) {
        var gl = this.gl;
        var renderTarget = event.target;
        var renderTargetProperties = this.properties.get(renderTarget);

        renderTarget.removeEventListener('dispose', this.onRenderTargetDispose, this);

        if(renderTargetProperties.__webglTexture) {
            gl.deleteTexture(textureProperties.__webglTexture);
        }

        if(renderTargetProperties.__webglFramebuffer) {
            gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer)
        }

        if(renderTargetProperties.__webglDepthbuffer) {
            gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer)
        }

        this.properties.delete(renderTarget);
    }

    zen3d.WebGLTexture = WebGLTexture;
})();
(function() {
    var WebGLGeometry = function(gl, state, properties, capabilities) {
        this.gl = gl;

        this.state = state;

        this.properties = properties;

        this.capabilities = capabilities;
    }

    WebGLGeometry.prototype.setGeometry = function(geometry) {
        var gl = this.gl;
        var state = this.state;

        var geometryProperties = this.properties.get(geometry);

        if(geometry.dirty) {

            if(geometryProperties.__webglVAO === undefined) {
                geometry.addEventListener('dispose', this.onGeometryDispose, this);
                geometryProperties.__webglVAO = gl.createBuffer();
                geometry.dirtyRange.enable = false;
            }

            state.bindBuffer(gl.ARRAY_BUFFER, geometryProperties.__webglVAO);

            // geometry.dirtyRange.enable = false;
            if(geometry.dirtyRange.enable) {
                var vertices = new Float32Array(geometry.verticesArray);
                vertices = vertices.subarray(geometry.dirtyRange.start, geometry.dirtyRange.start + geometry.dirtyRange.count);
                gl.bufferSubData(gl.ARRAY_BUFFER, geometry.dirtyRange.start * 4, vertices)
                geometry.dirtyRange.enable = false;
                geometry.dirtyRange.start = 0;
                geometry.dirtyRange.count = 0;
            } else {
                var vertices = new Float32Array(geometry.verticesArray);
                gl.bufferData(gl.ARRAY_BUFFER, vertices, geometry.usageType);
            }

            if(geometry.indicesArray.length > 0) {
                if(geometryProperties.__webglEAO === undefined) {
                    geometryProperties.__webglEAO = gl.createBuffer();
                }

                state.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryProperties.__webglEAO);

                var indices = new Uint16Array(geometry.indicesArray);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, geometry.usageType);
            }

            geometry.dirty = false;

            return;
        }

        state.bindBuffer(gl.ARRAY_BUFFER, geometryProperties.__webglVAO);
        if(geometry.indicesArray.length > 0) {
            state.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryProperties.__webglEAO);
        }
    }

    WebGLGeometry.prototype.onGeometryDispose = function(event) {
        var gl = this.gl;
        var geometry = event.target;
        var geometryProperties = this.properties.get(geometry);

        geometry.removeEventListener('dispose', this.onGeometryDispose, this);

        if(geometryProperties.__webglVAO) {
            gl.deleteBuffer(geometryProperties.__webglVAO);
        }

        if(geometryProperties.__webglEAO) {
            gl.deleteBuffer(geometryProperties.__webglEAO);
        }

        this.properties.delete(geometry);
    }

    zen3d.WebGLGeometry = WebGLGeometry;
})();
(function() {
    var WEBGL_UNIFORM_TYPE = zen3d.WEBGL_UNIFORM_TYPE;

    var WebGLUniform = function(gl, program, uniformData) {
        this.gl = gl;

        this.name = uniformData.name;

        // WEBGL_UNIFORM_TYPE
        this.type = uniformData.type;

        this.size = uniformData.size;

        this.location = gl.getUniformLocation(program, this.name);

        this.value = undefined;
        this._setDefaultValue();

        this.setValue = undefined;
        this.set = undefined;
        this._generateSetValue();

        this.upload = undefined;
        this._generateUpload();
    }

    WebGLUniform.prototype._setDefaultValue = function() {
        var type = this.type;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.value = 0;
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.value = [0, 0];
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.value = [0, 0, 0];
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.value = [0, 0, 0, 0];
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                this.value = new Float32Array([
                    1, 0,
                    0, 1
                ]);
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                this.value = new Float32Array([
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ]);
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.value = new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]);
                break;
        }
    }

    WebGLUniform.prototype._generateSetValue = function() {
        var type = this.type;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.setValue = function(p1) {
                    this.value = p1;
                    this.upload();
                }
                this.set = function(value) {
                    this.value = value;
                    this.upload();
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.setValue = function(p1, p2) {
                    this.value[0] = p1;
                    this.value[1] = p2;
                    this.upload();
                }
                this.set = function(value) {
                    this.value.set(value);
                    this.upload();
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.setValue = function(p1, p2, p3) {
                    this.value[0] = p1;
                    this.value[1] = p2;
                    this.value[2] = p3;
                    this.upload();
                }
                this.set = function(value) {
                    this.value.set(value);
                    this.upload();
                }
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.setValue = function(p1, p2, p3, p4) {
                    this.value[0] = p1;
                    this.value[1] = p2;
                    this.value[2] = p3;
                    this.value[3] = p4;
                    this.upload();
                }
                this.set = function(value) {
                    this.value.set(value);
                    this.upload();
                }
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.setValue = function(p1) {
                    this.value.set(p1);
                    this.upload();
                }
                this.set = function(value) {
                    this.value.set(value);
                    this.upload();
                }
                break;
        }
    }

    WebGLUniform.prototype._generateUpload = function() {
        var gl = this.gl;
        var type = this.type;
        var location = this.location;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform1f(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform2f(location, value[0], value[1]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform3f(location, value[0], value[1], value[2]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                };
                break;

            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform1i(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform2i(location, value[0], value[1]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform3i(location, value[0], value[1], value[2]);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.upload = function() {
                    var value = this.value;
                    gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                };
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                this.upload = function() {
                    var value = this.value;
                    gl.uniformMatrix2fv(location, false, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                this.upload = function() {
                    var value = this.value;
                    gl.uniformMatrix3fv(location, false, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.upload = function() {
                    var value = this.value;
                    gl.uniformMatrix4fv(location, false, value);
                };
                break;
        }
    }

    zen3d.WebGLUniform = WebGLUniform;
})();
(function() {
    var WEBGL_ATTRIBUTE_TYPE = zen3d.WEBGL_ATTRIBUTE_TYPE;

    var WebGLAttribute = function(gl, program, attributeData) {
        this.gl = gl;

        this.name = attributeData.name;

        // WEBGL_ATTRIBUTE_TYPE
        this.type = attributeData.type;

        this.size = attributeData.size;

        this.location = gl.getAttribLocation(program, this.name);

        this.count = 0;
        this.initCount(gl);

        this.format = gl.FLOAT;
        this.initFormat(gl);
    }

    WebGLAttribute.prototype.initCount = function(gl) {
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
    }

    WebGLAttribute.prototype.initFormat = function(gl) {
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

    zen3d.WebGLAttribute = WebGLAttribute;
})();
(function() {

    /**
     * create a shader
     **/
    function loadShader(gl, type, source) {
        // create a shader object
        var shader = gl.createShader(type);
        // bind the shader source, source must be string type?
        gl.shaderSource(shader, source);
        // compile shader
        gl.compileShader(shader);
        // if compile failed, log error
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            console.log("shader not compiled!")
            console.log(gl.getShaderInfoLog(shader))
        }

        return shader;
    }

    /**
     * create a WebGL program
     **/
    function createWebGLProgram(gl, vertexShader, fragmentShader) {
        // create a program object
        var program = gl.createProgram();
        // attach shaders to program
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // link vertex shader and fragment shader
        gl.linkProgram(program);
        // if link failed, log error
        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(!linked) {
            console.log("program not linked!")
            console.log(gl.getProgramInfoLog(program))
        }

        return program;
    }

    /**
     * extract uniforms
     */
    function extractUniforms(gl, program) {
        var uniforms = {};

        var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (var i = 0; i < totalUniforms; i++) {
            var uniformData = gl.getActiveUniform(program, i);
            var name = uniformData.name;
            var uniform = new zen3d.WebGLUniform(gl, program, uniformData);
            uniforms[name] = uniform;
        }

        return uniforms;
    }

    /**
     * extract attributes
     */
    function extractAttributes(gl, program) {
        var attributes = {};

        var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (var i = 0; i < totalAttributes; i++) {
            var attribData = gl.getActiveAttrib(program, i);
            var name = attribData.name;
            var attribute = new zen3d.WebGLAttribute(gl, program, attribData);
            attributes[name] = attribute;
        }

        return attributes;
    }

    /**
     * WebGL Program
     * @class Program
     */
    var WebGLProgram = function(gl, vshader, fshader) {
        // vertex shader source
        this.vshaderSource = vshader;

        // fragment shader source
        this.fshaderSource = fshader;

        // WebGL vertex shader
        var vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);

        // WebGL fragment shader
        var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);

        // program id
        this.id = createWebGLProgram(gl, vertexShader, fragmentShader);

        this.uniforms = extractUniforms(gl, this.id);

        this.attributes = extractAttributes(gl, this.id);

        // here we can delete shaders,
        // according to the documentation: https://www.opengl.org/sdk/docs/man/html/glLinkProgram.xhtml
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    WebGLProgram.prototype.dispose = function(gl) {
        gl.deleteProgram(this.id);
    }

    zen3d.WebGLProgram = WebGLProgram;
})();
(function(){
zen3d.ShaderChunk = {
ambientlight_pars_frag: "uniform vec4 u_AmbientLightColor;",
begin_frag: "vec4 outColor = vec4(u_Color, u_Opacity);",
begin_vert: "vec3 transformed = vec3(a_Position);\n#if defined(USE_NORMAL) || defined(USE_ENV_MAP)\n    vec3 objectNormal = vec3(a_Normal);\n#endif",
bsdfs: "\nvec4 BRDF_Diffuse_Lambert(vec4 diffuseColor) {\n    return RECIPROCAL_PI * diffuseColor;\n}\nvec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {\n\tfloat fresnel = pow( 1.0 - dotLH, 5.0 );\n\treturn ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nfloat G_BlinnPhong_Implicit( ) {\n\treturn 0.25;\n}\nvec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {\n    vec3 H = normalize(L + V);\n    float dotNH = saturate(dot(N, H));\n    float dotLH = saturate(dot(L, H));\n    vec4 F = F_Schlick(specularColor, dotLH);\n    float G = G_BlinnPhong_Implicit( );\n    float D = D_BlinnPhong(shininess, dotNH);\n    return F * G * D;\n}",
bumpMap_pars_frag: "#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd(vec2 uv) {\n\t\tvec2 dSTdx = dFdx( uv );\n\t\tvec2 dSTdy = dFdy( uv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, uv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\n\t\tvec3 vSigmaX = dFdx( surf_pos );\n\t\tvec3 vSigmaY = dFdy( surf_pos );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif\n",
common_frag: "uniform mat4 u_View;\nuniform float u_Opacity;\nuniform vec3 u_Color;\nuniform vec3 u_CameraPosition;",
common_vert: "attribute vec3 a_Position;\nattribute vec3 a_Normal;\n#include <transpose>\n#include <inverse>\nuniform mat4 u_Projection;\nuniform mat4 u_View;\nuniform mat4 u_Model;\nuniform vec3 u_CameraPosition;",
diffuseMap_frag: "#ifdef USE_DIFFUSE_MAP\n    vec4 texelColor = texture2D( texture, v_Uv );\n    texelColor = mapTexelToLinear( texelColor );\n    outColor *= texelColor;\n#endif",
diffuseMap_pars_frag: "#ifdef USE_DIFFUSE_MAP\n    uniform sampler2D texture;\n#endif",
directlight_pars_frag: "struct DirectLight\n{\n    vec3 direction;\n    vec4 color;\n    float intensity;\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n};\nuniform DirectLight u_Directional[USE_DIRECT_LIGHT];",
emissiveMap_frag: "#ifdef USE_EMISSIVEMAP\n\tvec4 emissiveColor = texture2D(emissiveMap, v_Uv);\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
emissiveMap_pars_frag: "#ifdef USE_EMISSIVEMAP\n\tuniform sampler2D emissiveMap;\n#endif",
encodings_frag: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
encodings_pars_frag: "\nvec4 LinearToLinear( in vec4 value ) {\n\treturn value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n\treturn vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n\tfloat maxComponent = max( max( value.r, value.g ), value.b );\n\tfloat fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n\treturn vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.xyz * value.w * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\n\tM            = ceil( M * 255.0 ) / 255.0;\n\treturn vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat D      = max( maxRange / maxRGB, 1.0 );\n\tD            = min( floor( D ) / 255.0, 1.0 );\n\treturn vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value )  {\n\tvec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n\tXp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n\tvec4 vResult;\n\tvResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n\tfloat Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n\tvResult.w = fract(Le);\n\tvResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n\treturn vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n\tfloat Le = value.z * 255.0 + value.w;\n\tvec3 Xp_Y_XYZp;\n\tXp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n\tXp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n\tXp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n\tvec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n\treturn vec4( max(vRGB, 0.0), 1.0 );\n}\n",
end_frag: "gl_FragColor = outColor;",
envMap_frag: "#ifdef USE_ENV_MAP\n    vec4 envColor = textureCube(envMap, v_EnvPos);\n    envColor = envMapTexelToLinear( envColor );\n    outColor += envColor * u_EnvMap_Intensity;\n#endif",
envMap_pars_frag: "#ifdef USE_ENV_MAP\n    varying vec3 v_EnvPos;\n    uniform samplerCube envMap;\n    uniform float u_EnvMap_Intensity;\n#endif",
envMap_pars_vert: "#ifdef USE_ENV_MAP\n    varying vec3 v_EnvPos;\n#endif",
envMap_vert: "#ifdef USE_ENV_MAP\n    v_EnvPos = reflect(normalize((u_Model * vec4(transformed, 1.0)).xyz - u_CameraPosition), (transpose(inverse(u_Model)) * vec4(objectNormal, 1.0)).xyz);\n#endif",
fog_frag: "#ifdef USE_FOG\n    float depth = gl_FragCoord.z / gl_FragCoord.w;\n    #ifdef USE_EXP2_FOG\n        float fogFactor = whiteCompliment( exp2( - u_FogDensity * u_FogDensity * depth * depth * LOG2 ) );\n    #else\n        float fogFactor = smoothstep( u_FogNear, u_FogFar, depth );\n    #endif\n    gl_FragColor.rgb = mix( gl_FragColor.rgb, u_FogColor, fogFactor );\n#endif",
fog_pars_frag: "#ifdef USE_FOG\n    uniform vec3 u_FogColor;\n    #ifdef USE_EXP2_FOG\n        uniform float u_FogDensity;\n    #else\n        uniform float u_FogNear;\n        uniform float u_FogFar;\n    #endif\n#endif",
inverse: "mat4 inverse(mat4 m) {\n    float\n    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n    return mat4(\n        a11 * b11 - a12 * b10 + a13 * b09,\n        a02 * b10 - a01 * b11 - a03 * b09,\n        a31 * b05 - a32 * b04 + a33 * b03,\n        a22 * b04 - a21 * b05 - a23 * b03,\n        a12 * b08 - a10 * b11 - a13 * b07,\n        a00 * b11 - a02 * b08 + a03 * b07,\n        a32 * b02 - a30 * b05 - a33 * b01,\n        a20 * b05 - a22 * b02 + a23 * b01,\n        a10 * b10 - a11 * b08 + a13 * b06,\n        a01 * b08 - a00 * b10 - a03 * b06,\n        a30 * b04 - a31 * b02 + a33 * b00,\n        a21 * b02 - a20 * b04 - a23 * b00,\n        a11 * b07 - a10 * b09 - a12 * b06,\n        a00 * b09 - a01 * b07 + a02 * b06,\n        a31 * b01 - a30 * b03 - a32 * b00,\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\n}",
light_frag: "#ifdef USE_LIGHT\n    vec4 light;\n    vec3 L;\n    vec4 totalReflect = vec4(0., 0., 0., 0.);\n    vec4 diffuseColor = outColor.xyzw;\n    #ifdef USE_PHONG\n        vec4 specularColor = u_SpecularColor;\n    #endif\n    #ifdef USE_AMBIENT_LIGHT\n        totalReflect += RECIPROCAL_PI * diffuseColor * u_AmbientLightColor;\n    #endif\n    #if defined(USE_PHONG) && ( defined(USE_DIRECT_LIGHT) || defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) )\n        vec3 V = normalize( (u_View * vec4(u_CameraPosition, 1.)).xyz - v_ViewModelPos);\n    #endif\n    #ifdef USE_DIRECT_LIGHT\n    for(int i = 0; i < USE_DIRECT_LIGHT; i++) {\n        L = -u_Directional[i].direction;\n        light = u_Directional[i].color * u_Directional[i].intensity;\n        L = normalize(L);\n        float dotNL = saturate( dot(N, L) );\n        vec4 irradiance = light * dotNL;\n        #ifdef USE_SHADOW\n            irradiance *= bool( u_Directional[i].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[i].shadowBias, u_Directional[i].shadowRadius, u_Directional[i].shadowMapSize ) : 1.0;\n        #endif\n        vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n        #ifdef USE_PHONG\n            reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, u_Specular) * specularStrength;\n        #endif\n        totalReflect += reflectLight;\n    }\n    #endif\n    #ifdef USE_POINT_LIGHT\n    for(int i = 0; i < USE_POINT_LIGHT; i++) {\n        L = u_Point[i].position - v_ViewModelPos;\n        float dist = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);\n        light = u_Point[i].color * u_Point[i].intensity * dist;\n        L = normalize(L);\n        float dotNL = saturate( dot(N, L) );\n        vec4 irradiance = light * dotNL;\n        #ifdef USE_SHADOW\n            vec3 worldV = (vec4(v_ViewModelPos, 1.) * u_View - vec4(u_Point[i].position, 1.) * u_View).xyz;\n            irradiance *= bool( u_Point[i].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV, u_Point[i].shadowBias, u_Point[i].shadowRadius, u_Point[i].shadowMapSize ) : 1.0;\n        #endif\n        vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n        #ifdef USE_PHONG\n            reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, u_Specular) * specularStrength;\n        #endif\n        totalReflect += reflectLight;\n    }\n    #endif\n    #ifdef USE_SPOT_LIGHT\n    for(int i = 0; i < USE_SPOT_LIGHT; i++) {\n        L = u_Spot[i].position - v_ViewModelPos;\n        float lightDistance = length(L);\n        L = normalize(L);\n        float angleCos = dot( L, -normalize(u_Spot[i].direction) );\n        if( all( bvec2(angleCos > u_Spot[i].coneCos, lightDistance < u_Spot[i].distance) ) ) {\n            float spotEffect = smoothstep( u_Spot[i].coneCos, u_Spot[i].penumbraCos, angleCos );\n            float dist = pow(clamp(1. - lightDistance / u_Spot[i].distance, 0.0, 1.0), u_Spot[i].decay);\n            light = u_Spot[i].color * u_Spot[i].intensity * dist * spotEffect;\n            float dotNL = saturate( dot(N, L) );\n            vec4 irradiance = light * dotNL;\n            #ifdef USE_SHADOW\n                irradiance *= bool( u_Spot[i].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[i].shadowBias, u_Spot[i].shadowRadius, u_Spot[i].shadowMapSize ) : 1.0;\n            #endif\n            vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n            #ifdef USE_PHONG\n                reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, u_Specular) * specularStrength;\n            #endif\n            totalReflect += reflectLight;\n        }\n    }\n    #endif\n    outColor.xyz = totalReflect.xyz;\n#endif",
light_pars_frag: "#ifdef USE_AMBIENT_LIGHT\n    #include <ambientlight_pars_frag>\n#endif\n#ifdef USE_DIRECT_LIGHT\n    #include <directlight_pars_frag>\n#endif\n#ifdef USE_POINT_LIGHT\n    #include <pointlight_pars_frag>\n#endif\n#ifdef USE_SPOT_LIGHT\n    #include <spotlight_pars_frag>\n#endif",
normalMap_pars_frag: "#include <tbn>\n#include <tsn>\nuniform sampler2D normalMap;",
normal_frag: "#ifdef USE_NORMAL\n    #ifdef DOUBLE_SIDED\n    \tfloat flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n    #else\n    \tfloat flipNormal = 1.0;\n    #endif\n    #ifdef FLAT_SHADED\n    \tvec3 fdx = vec3( dFdx( v_ViewModelPos.x ), dFdx( v_ViewModelPos.y ), dFdx( v_ViewModelPos.z ) );\n    \tvec3 fdy = vec3( dFdy( v_ViewModelPos.x ), dFdy( v_ViewModelPos.y ), dFdy( v_ViewModelPos.z ) );\n    \tvec3 N = normalize( cross( fdx, fdy ) );\n    #else\n        vec3 N = normalize(v_Normal) * flipNormal;\n    #endif\n    #ifdef USE_NORMAL_MAP\n        vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;\n        mat3 tspace = tsn(N, -v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));\n        N = normalize(tspace * (normalMapColor * 2.0 - 1.0));\n    #elif defined(USE_BUMPMAP)\n        N = perturbNormalArb(-v_ViewModelPos, N, dHdxy_fwd(v_Uv));\n    #endif\n#endif",
normal_pars_frag: "#ifdef USE_NORMAL\n    varying vec3 v_Normal;\n#endif",
normal_pars_vert: "#ifdef USE_NORMAL\n    varying vec3 v_Normal;\n#endif",
normal_vert: "#ifdef USE_NORMAL\n    v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(objectNormal, 1.0)).xyz;\n    #ifdef FLIP_SIDED\n    \tv_Normal = - v_Normal;\n    #endif\n#endif",
packing: "const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n    vec4 r = vec4( fract( v * PackFactors ), v );\n    r.yzw -= r.xyz * ShiftRight8;    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n    return dot( v, UnpackFactors );\n}",
pointlight_pars_frag: "struct PointLight\n{\n    vec3 position;\n    vec4 color;\n    float intensity;\n    float distance;\n    float decay;\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n};\nuniform PointLight u_Point[USE_POINT_LIGHT];",
premultipliedAlpha_frag: "#ifdef USE_PREMULTIPLIED_ALPHA\n    gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;\n#endif",
pvm_vert: "gl_Position = u_Projection * u_View * u_Model * vec4(transformed, 1.0);",
shadowMap_frag: "#ifdef USE_SHADOW\n#endif",
shadowMap_pars_frag: "#ifdef USE_SHADOW\n    #include <packing>\n    #ifdef USE_DIRECT_LIGHT\n        uniform sampler2D directionalShadowMap[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n    #endif\n    #ifdef USE_POINT_LIGHT\n        uniform samplerCube pointShadowMap[ USE_POINT_LIGHT ];\n    #endif\n    #ifdef USE_SPOT_LIGHT\n        uniform sampler2D spotShadowMap[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n    #endif\n    float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n        return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n    }\n    float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {\n        return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );\n    }\n    float getShadow( sampler2D shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n        shadowCoord.xyz /= shadowCoord.w;\n        float depth = shadowCoord.z + shadowBias;\n        bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n        bool inFrustum = all( inFrustumVec );\n        bvec2 frustumTestVec = bvec2( inFrustum, depth <= 1.0 );\n        bool frustumTest = all( frustumTestVec );\n        if ( frustumTest ) {\n            #ifdef USE_PCF_SOFT_SHADOW\n                float texelSize = shadowRadius / shadowMapSize.x;\n                vec2 poissonDisk[4];\n                poissonDisk[0] = vec2(-0.94201624, -0.39906216);\n                poissonDisk[1] = vec2(0.94558609, -0.76890725);\n                poissonDisk[2] = vec2(-0.094184101, -0.92938870);\n                poissonDisk[3] = vec2(0.34495938, 0.29387760);\n                return texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[3] * texelSize, depth ) * 0.25;\n            #else\n                return texture2DCompare( shadowMap, shadowCoord.xy, depth );\n            #endif\n        }\n        return 1.0;\n    }\n    float getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n        float depth = (length(V) + shadowBias) / 1000.;\n        #ifdef USE_PCF_SOFT_SHADOW\n            float texelSize = shadowRadius / shadowMapSize.x;\n            vec3 poissonDisk[4];\n    \t\tpoissonDisk[0] = vec3(-1.0, 1.0, -1.0);\n    \t\tpoissonDisk[1] = vec3(1.0, -1.0, -1.0);\n    \t\tpoissonDisk[2] = vec3(-1.0, -1.0, -1.0);\n    \t\tpoissonDisk[3] = vec3(1.0, -1.0, 1.0);\n            return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;\n        #else\n            return textureCubeCompare( shadowMap, normalize(V), depth);\n        #endif\n    }\n#endif",
shadowMap_pars_vert: "#ifdef USE_SHADOW\n    #ifdef USE_DIRECT_LIGHT\n        uniform mat4 directionalShadowMatrix[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n    #endif\n    #ifdef USE_POINT_LIGHT\n    #endif\n    #ifdef USE_SPOT_LIGHT\n        uniform mat4 spotShadowMatrix[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n    #endif\n#endif",
shadowMap_vert: "#ifdef USE_SHADOW\n    vec4 worldPosition = u_Model * vec4(transformed, 1.0);\n    #ifdef USE_DIRECT_LIGHT\n        for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {\n            vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n        }\n    #endif\n    #ifdef USE_POINT_LIGHT\n    #endif\n    #ifdef USE_SPOT_LIGHT\n        for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {\n            vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n        }\n    #endif\n#endif",
skinning_pars_vert: "#ifdef USE_SKINNING\n    attribute vec4 skinIndex;\n\tattribute vec4 skinWeight;\n    #ifdef BONE_TEXTURE\n        uniform sampler2D boneTexture;\n        uniform int boneTextureSize;\n        mat4 getBoneMatrix( const in float i ) {\n            float j = i * 4.0;\n            float x = mod( j, float( boneTextureSize ) );\n            float y = floor( j / float( boneTextureSize ) );\n            float dx = 1.0 / float( boneTextureSize );\n            float dy = 1.0 / float( boneTextureSize );\n            y = dy * ( y + 0.5 );\n            vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n            vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n            vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n            vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n            mat4 bone = mat4( v1, v2, v3, v4 );\n            return bone;\n        }\n    #else\n        uniform mat4 boneMatrices[MAX_BONES];\n        mat4 getBoneMatrix(const in float i) {\n            mat4 bone = boneMatrices[int(i)];\n            return bone;\n        }\n    #endif\n#endif",
skinning_vert: "#ifdef USE_SKINNING\n    mat4 boneMatX = getBoneMatrix( skinIndex.x );\n    mat4 boneMatY = getBoneMatrix( skinIndex.y );\n    mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n    mat4 boneMatW = getBoneMatrix( skinIndex.w );\n    vec4 skinVertex = vec4(transformed, 1.0);\n    vec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n    transformed = vec3(skinned.xyz / skinned.w);\n    #if defined(USE_NORMAL) || defined(USE_ENV_MAP)\n        mat4 skinMatrix = mat4( 0.0 );\n        skinMatrix += skinWeight.x * boneMatX;\n        skinMatrix += skinWeight.y * boneMatY;\n        skinMatrix += skinWeight.z * boneMatZ;\n        skinMatrix += skinWeight.w * boneMatW;\n        objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n    #endif\n#endif",
specularMap_frag: "float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, v_Uv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif",
specularMap_pars_frag: "#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif",
spotlight_pars_frag: "struct SpotLight\n{\n    vec3 position;\n    vec4 color;\n    float intensity;\n    float distance;\n    float decay;\n    float coneCos;\n    float penumbraCos;\n    vec3 direction;\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n};\nuniform SpotLight u_Spot[USE_SPOT_LIGHT];",
tbn: "mat3 tbn(vec3 N, vec3 p, vec2 uv) {\n    vec3 dp1 = dFdx(p.xyz);\n    vec3 dp2 = dFdy(p.xyz);\n    vec2 duv1 = dFdx(uv.st);\n    vec2 duv2 = dFdy(uv.st);\n    vec3 dp2perp = cross(dp2, N);\n    vec3 dp1perp = cross(N, dp1);\n    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\n    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\n    float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B)));\n    return mat3(T * invmax, B * invmax, N);\n}",
transpose: "mat4 transpose(mat4 inMatrix) {\n    vec4 i0 = inMatrix[0];\n    vec4 i1 = inMatrix[1];\n    vec4 i2 = inMatrix[2];\n    vec4 i3 = inMatrix[3];\n    mat4 outMatrix = mat4(\n        vec4(i0.x, i1.x, i2.x, i3.x),\n        vec4(i0.y, i1.y, i2.y, i3.y),\n        vec4(i0.z, i1.z, i2.z, i3.z),\n        vec4(i0.w, i1.w, i2.w, i3.w)\n    );\n    return outMatrix;\n}",
tsn: "mat3 tsn(vec3 N, vec3 V, vec2 uv) {\n    vec3 q0 = dFdx( V.xyz );\n    vec3 q1 = dFdy( V.xyz );\n    vec2 st0 = dFdx( uv.st );\n    vec2 st1 = dFdy( uv.st );\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n    mat3 tsn = mat3( S, T, N );\n    return tsn;\n}",
uv_pars_frag: "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP)\n    varying vec2 v_Uv;\n#endif",
uv_pars_vert: "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP)\n    attribute vec2 a_Uv;\n    varying vec2 v_Uv;\n#endif",
uv_vert: "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP)\n    v_Uv = a_Uv;\n#endif",
viewModelPos_pars_frag: "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )\n    varying vec3 v_ViewModelPos;\n#endif",
viewModelPos_pars_vert: "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )\n    varying vec3 v_ViewModelPos;\n#endif",
viewModelPos_vert: "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )\n    v_ViewModelPos = (u_View * u_Model * vec4(transformed, 1.0)).xyz;\n#endif",
}
})();
(function(){
zen3d.ShaderLib = {
basic_frag: "#include <common_frag>\n#include <uv_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <envMap_pars_frag>\n#include <fog_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #include <diffuseMap_frag>\n    #include <envMap_frag>\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
basic_vert: "#include <common_vert>\n#include <uv_pars_vert>\n#include <envMap_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    #include <uv_vert>\n    #include <envMap_vert>\n}",
canvas2d_frag: "#include <common_frag>\nvarying vec2 v_Uv;\nuniform sampler2D spriteTexture;\nvoid main() {\n    #include <begin_frag>\n    outColor *= texture2D(spriteTexture, v_Uv);\n    #include <end_frag>\n    #include <premultipliedAlpha_frag>\n}",
canvas2d_vert: "#include <common_vert>\nattribute vec2 a_Uv;\nvarying vec2 v_Uv;\nvoid main() {\n    #include <begin_vert>\n    #include <pvm_vert>\n    v_Uv = a_Uv;\n}",
cube_frag: "#include <common_frag>\nuniform samplerCube cubeMap;\nvarying vec3 v_ModelPos;\nvoid main() {\n    #include <begin_frag>\n    outColor *= textureCube(cubeMap, v_ModelPos);\n    #include <end_frag>\n}",
cube_vert: "#include <common_vert>\nvarying vec3 v_ModelPos;\nvoid main() {\n    #include <begin_vert>\n    #include <pvm_vert>\n    v_ModelPos = (u_Model * vec4(transformed, 1.0)).xyz;\n}",
depth_frag: "#include <common_frag>\nuniform vec3 lightPos;\nvarying vec3 v_ModelPos;\n#include <packing>\nvoid main() {\n    gl_FragColor = packDepthToRGBA(length(v_ModelPos - lightPos) / 1000.);\n}",
depth_vert: "#include <common_vert>\nvarying vec3 v_ModelPos;\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    v_ModelPos = (u_Model * vec4(transformed, 1.0)).xyz;\n}",
lambert_frag: "#include <common_frag>\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <envMap_pars_frag>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #include <diffuseMap_frag>\n    #include <normal_frag>\n    #include <light_frag>\n    #include <envMap_frag>\n    #include <shadowMap_frag>\n    vec3 totalEmissiveRadiance = emissive;\n    #include <emissiveMap_frag>\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
lambert_vert: "#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    #include <normal_vert>\n    #include <uv_vert>\n    #include <viewModelPos_vert>\n    #include <envMap_vert>\n    #include <shadowMap_vert>\n}",
linedashed_frag: "#include <common_frag>\n#include <fog_pars_frag>\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\nvoid main() {\n    if ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}\n    #include <begin_frag>\n    #include <end_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
linedashed_vert: "#include <common_vert>\nuniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\nvoid main() {\n    vLineDistance = scale * lineDistance;\n    vec3 transformed = vec3(a_Position);\n    #include <pvm_vert>\n}",
particle_frag: "float scaleLinear(float value, vec2 valueDomain) {\n    return (value - valueDomain.x) / (valueDomain.y - valueDomain.x);\n}\nfloat scaleLinear(float value, vec2 valueDomain, vec2 valueRange) {\n    return mix(valueRange.x, valueRange.y, scaleLinear(value, valueDomain));\n}\nvarying vec4 vColor;\nvarying float lifeLeft;\nuniform sampler2D tSprite;\nvoid main() {\n    float alpha = 0.;\n    if( lifeLeft > .995 ) {\n        alpha = scaleLinear( lifeLeft, vec2(1., .995), vec2(0., 1.));\n    } else {\n        alpha = lifeLeft * .75;\n    }\n    vec4 tex = texture2D( tSprite, gl_PointCoord );\n    gl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );\n}",
particle_vert: "const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);\nconst vec4 bitMsk = vec4(0.,vec3(1./256.0));\nconst vec4 bitShifts = vec4(1.) / bitSh;\n#define FLOAT_MAX\t1.70141184e38\n#define FLOAT_MIN\t1.17549435e-38\nlowp vec4 encode_float(highp float v) {\n    highp float av = abs(v);\n    if(av < FLOAT_MIN) {\n        return vec4(0.0, 0.0, 0.0, 0.0);\n    } else if(v > FLOAT_MAX) {\n        return vec4(127.0, 128.0, 0.0, 0.0) / 255.0;\n    } else if(v < -FLOAT_MAX) {\n        return vec4(255.0, 128.0, 0.0, 0.0) / 255.0;\n    }\n    highp vec4 c = vec4(0,0,0,0);\n    highp float e = floor(log2(av));\n    highp float m = av * pow(2.0, -e) - 1.0;\n    c[1] = floor(128.0 * m);\n    m -= c[1] / 128.0;\n    c[2] = floor(32768.0 * m);\n    m -= c[2] / 32768.0;\n    c[3] = floor(8388608.0 * m);\n    highp float ebias = e + 127.0;\n    c[0] = floor(ebias / 2.0);\n    ebias -= c[0] * 2.0;\n    c[1] += floor(ebias) * 128.0;\n    c[0] += 128.0 * step(0.0, -v);\n    return c / 255.0;\n}\nvec4 pack(const in float depth)\n{\n    const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);\n    const vec4 bit_mask\t= vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);\n    vec4 res = mod(depth*bit_shift*vec4(255), vec4(256))/vec4(255);\n    res -= res.xxyz * bit_mask;\n    return res;\n}\nfloat unpack(const in vec4 rgba_depth)\n{\n    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);\n    float depth = dot(rgba_depth, bit_shift);\n    return depth;\n}\nuniform float uTime;\nuniform float uScale;\nuniform sampler2D tNoise;\nuniform mat4 u_Projection;\nuniform mat4 u_View;\nuniform mat4 u_Model;\nattribute vec4 particlePositionsStartTime;\nattribute vec4 particleVelColSizeLife;\nvarying vec4 vColor;\nvarying float lifeLeft;\nvoid main() {\n    vColor = encode_float( particleVelColSizeLife.y );\n    vec4 velTurb = encode_float( particleVelColSizeLife.x );\n    vec3 velocity = vec3( velTurb.xyz );\n    float turbulence = velTurb.w;\n    vec3 newPosition;\n    float timeElapsed = uTime - particlePositionsStartTime.a;\n    lifeLeft = 1. - (timeElapsed / particleVelColSizeLife.w);\n    gl_PointSize = ( uScale * particleVelColSizeLife.z ) * lifeLeft;\n    velocity.x = ( velocity.x - .5 ) * 3.;\n    velocity.y = ( velocity.y - .5 ) * 3.;\n    velocity.z = ( velocity.z - .5 ) * 3.;\n    newPosition = particlePositionsStartTime.xyz + ( velocity * 10. ) * ( uTime - particlePositionsStartTime.a );\n    vec3 noise = texture2D( tNoise, vec2( newPosition.x * .015 + (uTime * .05), newPosition.y * .02 + (uTime * .015) )).rgb;\n    vec3 noiseVel = ( noise.rgb - .5 ) * 30.;\n    newPosition = mix(newPosition, newPosition + vec3(noiseVel * ( turbulence * 5. ) ), (timeElapsed / particleVelColSizeLife.a) );\n    if( velocity.y > 0. && velocity.y < .05 ) {\n        lifeLeft = 0.;\n    }\n    if( velocity.x < -1.45 ) {\n        lifeLeft = 0.;\n    }\n    if( timeElapsed > 0. ) {\n        gl_Position = u_Projection * u_View * u_Model * vec4( newPosition, 1.0 );\n    } else {\n        gl_Position = u_Projection * u_View * u_Model * vec4( particlePositionsStartTime.xyz, 1.0 );\n        lifeLeft = 0.;\n        gl_PointSize = 0.;\n    }\n}",
phong_frag: "#include <common_frag>\nuniform float u_Specular;\nuniform vec4 u_SpecularColor;\n#include <specularMap_pars_frag>\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <envMap_pars_frag>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #include <diffuseMap_frag>\n    #include <normal_frag>\n    #include <specularMap_frag>\n    #include <light_frag>\n    #include <envMap_frag>\n    #include <shadowMap_frag>\n    vec3 totalEmissiveRadiance = emissive;\n    #include <emissiveMap_frag>\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
phong_vert: "#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    #include <normal_vert>\n    #include <uv_vert>\n    #include <viewModelPos_vert>\n    #include <envMap_vert>\n    #include <shadowMap_vert>\n}",
point_frag: "#include <common_frag>\n#include <diffuseMap_pars_frag>\n#include <fog_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #ifdef USE_DIFFUSE_MAP\n        outColor *= texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));\n    #endif\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
point_vert: "#include <common_vert>\nuniform float u_PointSize;\nuniform float u_PointScale;\nvoid main() {\n    #include <begin_vert>\n    #include <pvm_vert>\n    vec4 mvPosition = u_View * u_Model * vec4(transformed, 1.0);\n    #ifdef USE_SIZEATTENUATION\n        gl_PointSize = u_PointSize * ( u_PointScale / - mvPosition.z );\n    #else\n        gl_PointSize = u_PointSize;\n    #endif\n}",
sprite_frag: "uniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nuniform int fogType;\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\nuniform float alphaTest;\nvarying vec2 vUV;\nvoid main() {\n    vec4 texture = texture2D( map, vUV );\n    if ( texture.a < alphaTest ) discard;\n    gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n    if ( fogType > 0 ) {\n        float depth = gl_FragCoord.z / gl_FragCoord.w;\n        float fogFactor = 0.0;\n        if ( fogType == 1 ) {\n            fogFactor = smoothstep( fogNear, fogFar, depth );\n        } else {\n            \n            fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\n            fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n        }\n        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n    }\n}",
sprite_vert: "uniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\n    vUV = uvOffset + uv * uvScale;\n    vec2 alignedPosition = position * scale;\n    vec2 rotatedPosition;\n    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n    vec4 finalPosition;\n    finalPosition = viewMatrix * modelMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\n    finalPosition.xy += rotatedPosition;\n    finalPosition = projectionMatrix * finalPosition;\n    gl_Position = finalPosition;\n}",
}
})();
(function() {

    var programMap = {};

    /**
     * generate program code
     */
    function generateProgramCode(props) {
        var code = "";
        for (var key in props) {
            code += props[key] + "_";
        }
        return code;
    }

    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var TEXEL_ENCODING_TYPE = zen3d.TEXEL_ENCODING_TYPE;

    function getTextureEncodingFromMap( map, gammaOverrideLinear ) {

		var encoding;

		if ( ! map ) {

			encoding = TEXEL_ENCODING_TYPE.LINEAR;

		} else if ( map.encoding ) {

			encoding = map.encoding;

		}

		// add backwards compatibility for Renderer.gammaInput/gammaOutput parameter, should probably be removed at some point.
		if ( encoding === TEXEL_ENCODING_TYPE.LINEAR && gammaOverrideLinear ) {

			encoding = TEXEL_ENCODING_TYPE.GAMMA;

		}

		return encoding;

	}

    function getEncodingComponents( encoding ) {

    	switch ( encoding ) {

    		case TEXEL_ENCODING_TYPE.LINEAR:
    			return [ 'Linear','( value )' ];
    		case TEXEL_ENCODING_TYPE.SRGB:
    			return [ 'sRGB','( value )' ];
    		case TEXEL_ENCODING_TYPE.RGBE:
    			return [ 'RGBE','( value )' ];
    		case TEXEL_ENCODING_TYPE.RGBM7:
    			return [ 'RGBM','( value, 7.0 )' ];
    		case TEXEL_ENCODING_TYPE.RGBM16:
    			return [ 'RGBM','( value, 16.0 )' ];
    		case TEXEL_ENCODING_TYPE.RGBD:
    			return [ 'RGBD','( value, 256.0 )' ];
    		case TEXEL_ENCODING_TYPE.GAMMA:
    			return [ 'Gamma','( value, float( GAMMA_FACTOR ) )' ];
    		default:
    		      console.error( 'unsupported encoding: ' + encoding );

    	}

    }

    function getTexelDecodingFunction( functionName, encoding ) {

    	var components = getEncodingComponents( encoding );
    	return "vec4 " + functionName + "( vec4 value ) { return " + components[ 0 ] + "ToLinear" + components[ 1 ] + "; }";

    }

    function getTexelEncodingFunction( functionName, encoding ) {

    	var components = getEncodingComponents( encoding );
    	return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[ 0 ] + components[ 1 ] + "; }";

    }

    /**
     * create program
     */
    function createProgram(gl, props, vertexCode, fragmentCode) {
        // vertexCode & fragmentCode
        var vertex = zen3d.ShaderLib[props.materialType + "_vert"] || props.vertexShader || zen3d.ShaderLib.basic_vert;
        var fragment = zen3d.ShaderLib[props.materialType + "_frag"] || props.fragmentShader || zen3d.ShaderLib.basic_frag;
        vertex = parseIncludes(vertex);
        fragment = parseIncludes(fragment);

        // create defines
        var vshader_define = [
            ''
        ],
        fshader_define = [
            '#define LOG2 1.442695',
            '#define RECIPROCAL_PI 0.31830988618',
            '#define saturate(a) clamp( a, 0.0, 1.0 )',
            '#define whiteCompliment(a) ( 1.0 - saturate( a ) )'
        ];
        switch (props.materialType) {
            case MATERIAL_TYPE.CUBE:
            case MATERIAL_TYPE.CANVAS2D:
            case MATERIAL_TYPE.SPRITE:
            case MATERIAL_TYPE.PARTICLE:
            case MATERIAL_TYPE.SHADER:
                break;
            case MATERIAL_TYPE.LAMBERT:
            case MATERIAL_TYPE.PHONG:
            case MATERIAL_TYPE.POINT:
                vshader_define.push((props.pointLightNum > 0) ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '');
                vshader_define.push((props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '');
                vshader_define.push((props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '');
                vshader_define.push((props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '');
                vshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '');
                vshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '');
                vshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '');
                vshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '');
                vshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '');

                vshader_define.push(props.useShadow ? '#define USE_SHADOW' : '');

                vshader_define.push(props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '');
                vshader_define.push(props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '');

                vshader_define.push(props.flipSided ? '#define FLIP_SIDED' : '');

                fshader_define.push((props.pointLightNum) > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '');
                fshader_define.push((props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '');
                fshader_define.push((props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '');
                fshader_define.push((props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '');
                fshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '');
                fshader_define.push((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '');
                fshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '');
                fshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '');
                fshader_define.push(((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '');

                fshader_define.push(props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '');
                fshader_define.push(props.useShadow ? '#define USE_SHADOW' : '');
                fshader_define.push(props.usePCFSoftShadow ? '#define USE_PCF_SOFT_SHADOW' : '');
                fshader_define.push(props.flatShading ? '#define FLAT_SHADED' : '');

                fshader_define.push(props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '');
                fshader_define.push(props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '');

                fshader_define.push(props.doubleSided ? '#define DOUBLE_SIDED' : '');
            case MATERIAL_TYPE.BASIC:
                fshader_define.push(zen3d.ShaderChunk["encodings_pars_frag"]);
                fshader_define.push('#define GAMMA_FACTOR ' + props.gammaFactor);

                fshader_define.push(getTexelDecodingFunction("mapTexelToLinear", props.diffuseMapEncoding));
                fshader_define.push(getTexelDecodingFunction("envMapTexelToLinear", props.envMapEncoding));
                fshader_define.push(getTexelDecodingFunction("emissiveMapTexelToLinear", props.emissiveMapEncoding));
                fshader_define.push(getTexelEncodingFunction("linearToOutputTexel", props.outputEncoding));
            case MATERIAL_TYPE.LINE_BASIC:
                vshader_define.push(props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '');
                vshader_define.push(props.useEnvMap ? '#define USE_ENV_MAP' : '');

                vshader_define.push(props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '');

                fshader_define.push(props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '');
                fshader_define.push(props.useEnvMap ? '#define USE_ENV_MAP' : '');
                fshader_define.push(props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '');
            case MATERIAL_TYPE.DEPTH:
                vshader_define.push(props.useSkinning ? '#define USE_SKINNING' : '');
                vshader_define.push((props.bonesNum > 0) ? ('#define MAX_BONES ' + props.bonesNum) : '');
                vshader_define.push(props.useVertexTexture ? '#define BONE_TEXTURE' : '');
            case MATERIAL_TYPE.LINE_DASHED:
                fshader_define.push(props.fog ? '#define USE_FOG' : '');
                fshader_define.push(props.fogExp2 ? '#define USE_EXP2_FOG' : '');
                break;
            default:
                break;
        }

        var vshader = [
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            vshader_define.join("\n"),
            vertex
        ].join("\n");

        var fshader = [
            '#extension GL_OES_standard_derivatives : enable',
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            fshader_define.join("\n"),
            fragment
        ].join("\n");

        return new zen3d.WebGLProgram(gl, vshader, fshader);
    }

    var parseIncludes = function(string) {

        var pattern = /#include +<([\w\d.]+)>/g;

        function replace(match, include) {

            var replace = zen3d.ShaderChunk[include];

            if (replace === undefined) {

                throw new Error('Can not resolve #include <' + include + '>');

            }

            return parseIncludes(replace);

        }

        return string.replace(pattern, replace);

    }

    /**
     * get a suitable program by object & lights & fog
     */
    var getProgram = function(gl, render, material, object, lights, fog) {
        var material = material || object.material;

        var props = {}; // cache this props?
        props.precision = render.capabilities.maxPrecision;
        props.materialType = material.type;

        var currentRenderTarget = render.getCurrentRenderTarget();

        switch (material.type) {
            case MATERIAL_TYPE.BASIC:
            case MATERIAL_TYPE.LAMBERT:
            case MATERIAL_TYPE.PHONG:
            case MATERIAL_TYPE.POINT:
                props.gammaFactor = render.gammaFactor;
                props.outputEncoding = getTextureEncodingFromMap(currentRenderTarget ? currentRenderTarget.texture : null, render.gammaOutput);
                props.diffuseMapEncoding = getTextureEncodingFromMap(material.diffuseMap, render.gammaInput);
                props.envMapEncoding = getTextureEncodingFromMap(material.envMap, render.gammaInput);
                props.emissiveMapEncoding = getTextureEncodingFromMap(material.emissiveMap, render.gammaInput);
            case MATERIAL_TYPE.CUBE:
            case MATERIAL_TYPE.LINE_BASIC:
            case MATERIAL_TYPE.LINE_DASHED:
                props.useDiffuseMap = !!material.diffuseMap;
                props.useNormalMap = !!material.normalMap;
                props.useBumpMap = !!material.bumpMap;
                props.useSpecularMap = !!material.specularMap;
                props.useEnvMap = !!material.envMap;
                props.useEmissiveMap = !!material.emissiveMap;
                props.useDiffuseColor = !material.diffuseMap;
                props.ambientLightNum = lights.ambientsNum;
                props.directLightNum = lights.directsNum;
                props.pointLightNum = lights.pointsNum;
                props.spotLightNum = lights.spotsNum;
                props.flatShading = material.shading === zen3d.SHADING_TYPE.FLAT_SHADING;
                props.useShadow = object.receiveShadow;
                props.usePCFSoftShadow = render.shadowType === zen3d.SHADOW_TYPE.PCF_SOFT;
                props.premultipliedAlpha = material.premultipliedAlpha;
                props.fog = !!fog;
                props.fogExp2 = !!fog && (fog.fogType === zen3d.FOG_TYPE.EXP2);
                props.sizeAttenuation = material.sizeAttenuation;
                props.doubleSided = material.side === zen3d.DRAW_SIDE.DOUBLE;
                props.flipSided = material.side === zen3d.DRAW_SIDE.BACK;
            case MATERIAL_TYPE.DEPTH:
                var useSkinning = object.type === zen3d.OBJECT_TYPE.SKINNED_MESH && object.skeleton;
                var maxVertexUniformVectors = render.capabilities.maxVertexUniformVectors;
                var useVertexTexture = render.capabilities.maxVertexTextures > 0 && render.capabilities.floatTextures;
                var maxBones = 0;

                if(useVertexTexture) {
                    maxBones = 1024;
                } else {
                    maxBones = object.skeleton ? object.skeleton.bones.length : 0;
                    if(maxBones * 16 > maxVertexUniformVectors) {
                        console.warn("Program: too many bones (" + maxBones + "), current cpu only support " + Math.floor(maxVertexUniformVectors / 16) + " bones!!");
                        maxBones = Math.floor(maxVertexUniformVectors / 16);
                    }
                }

                props.useSkinning = useSkinning;
                props.bonesNum = maxBones;
                props.useVertexTexture = useVertexTexture;
                break;
            case MATERIAL_TYPE.SHADER:
                props.vertexShader = material.vertexShader;
                props.fragmentShader = material.fragmentShader;
            case MATERIAL_TYPE.CANVAS2D:
            case MATERIAL_TYPE.PARTICLE:
            case MATERIAL_TYPE.SPRITE:
            default:
                break;
        }

        var code = generateProgramCode(props);
        var map = programMap;
        var program;

        if (map[code]) {
            program = map[code];
        } else {
            program = createProgram(gl, props);

            map[code] = program;
        }

        return program;
    }

    zen3d.getProgram = getProgram;
})();
(function() {
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var DRAW_SIDE = zen3d.DRAW_SIDE;
    var WEBGL_UNIFORM_TYPE = zen3d.WEBGL_UNIFORM_TYPE;

    /**
     * Renderer
     * @class
     */
    var Renderer = function(view) {

        // canvas
        this.view = view;
        // gl context
        var gl = this.gl = view.getContext("webgl", {
            antialias: true, // antialias
            alpha: false, // effect performance, default false
            // premultipliedAlpha: false, // effect performance, default false
            stencil: true
        });
        // width and height, same with the canvas
        this.width = view.width;
        this.height = view.height;

        this.autoClear = true;

        this.shadowType = zen3d.SHADOW_TYPE.PCF_SOFT;

        this.gammaFactor = 2.0;
    	this.gammaInput = false;
    	this.gammaOutput = false;

        // init webgl
        var properties = new zen3d.WebGLProperties();
        this.properties = properties;

        var capabilities = new zen3d.WebGLCapabilities(gl);
        this.capabilities = capabilities;

        var state = new zen3d.WebGLState(gl, capabilities);
        state.enable(gl.STENCIL_TEST);
        state.enable(gl.DEPTH_TEST);
        state.setCullFace(CULL_FACE_TYPE.BACK);
        state.setFlipSided(false);
        state.viewport(0, 0, this.width, this.height);
        state.clearColor(0, 0, 0, 0);
        this.state = state;

        this.texture = new zen3d.WebGLTexture(gl, state, properties, capabilities);

        this.geometry = new zen3d.WebGLGeometry(gl, state, properties, capabilities);

        this.performance = new zen3d.Performance();

        this.depthMaterial = new zen3d.DepthMaterial();

        // object cache
        this.cache = new zen3d.RenderCache();

        this._usedTextureUnits = 0;

        this._currentRenderTarget = null;

        this._currentViewport = new zen3d.Vector4(0, 0, this.width, this.height);
    }

    /**
     * resize
     */
    Renderer.prototype.resize = function(width, height) {
        this.width = width;
        this.height = height;

        this.view.width = width;
        this.view.height = height;

        this.setViewport(0, 0, width, height);
    }

    /**
     * setViewport
     */
    Renderer.prototype.setViewport = function(x, y, width, height) {
        this._currentViewport.set(x, y, width, height);
        this.state.viewport(x, y, width, height);
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
        var performance = this.performance;

        performance.updateFps();

        performance.startCounter("render", 60);

        performance.startCounter("updateMatrix", 60);
        scene.updateMatrix();
        performance.endCounter("updateMatrix");

        camera.viewMatrix.getInverse(camera.worldMatrix); // update view matrix

        performance.startCounter("cacheScene", 60);
        this.cache.cacheScene(scene, camera);
        this.cache.sort();
        performance.endCounter("cacheScene");

        performance.startCounter("renderShadow", 60);
        this.renderShadow();
        performance.endCounter("renderShadow");

        if (renderTarget === undefined) {
            renderTarget = null;
        }
        this.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear) {
            this.state.clearColor(0, 0, 0, 0);
            this.clear(true, true, true);
        }

        performance.startCounter("renderList", 60);
        this.renderList(this.cache.opaqueObjects);
        this.renderList(this.cache.transparentObjects);
        this.renderList(this.cache.canvas2dObjects);
        this.renderSprites(this.cache.sprites);
        this.renderParticles(this.cache.particles);
        performance.endCounter("renderList");

        this.cache.clear();

        if (renderTarget) {
            this.texture.updateRenderTargetMipmap(renderTarget);
        }

        this.performance.endCounter("render");
    }

    /**
     * render shadow map for lights
     */
    Renderer.prototype.renderShadow = function() {
        var gl = this.gl;
        var state = this.state;

        var lights = this.cache.lights.shadows;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;
            var renderList = this.cache.shadowObjects;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                this.setRenderTarget(shadowTarget);

                state.clearColor(1, 1, 1, 1);
                this.clear(true, true);

                if (renderList.length == 0) {
                    continue;
                }

                for (var n = 0, l = renderList.length; n < l; n++) {
                    var object = renderList[n];
                    var material = this.depthMaterial;
                    var geometry = object.geometry;

                    var program = zen3d.getProgram(gl, this, material, object);
                    state.setProgram(program);

                    this.geometry.setGeometry(geometry);
                    this.setupVertexAttributes(program, geometry);

                    // update uniforms
                    var uniforms = program.uniforms;
                    for (var key in uniforms) {
                        var uniform = uniforms[key];
                        switch (key) {
                            // pvm matrix
                            case "u_Projection":
                                var projectionMat = camera.projectionMatrix.elements;
                                uniform.setValue(projectionMat);
                                break;
                            case "u_View":
                                var viewMatrix = camera.viewMatrix.elements;
                                uniform.setValue(viewMatrix);
                                break;
                            case "u_Model":
                                var modelMatrix = object.worldMatrix.elements;
                                uniform.setValue(modelMatrix);
                                break;
                            case "lightPos":
                                helpVector3.setFromMatrixPosition(light.worldMatrix);
                                uniform.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
                                break;
                        }
                    }

                    // boneMatrices
                    if(object.type === zen3d.OBJECT_TYPE.SKINNED_MESH) {
                        this.uploadSkeleton(uniforms, object, program.id);
                    }

                    // copy draw side
                    material.side = object.material.side;

                    this.setStates(material);

                    // draw
                    gl.drawElements(gl.TRIANGLES, object.geometry.getIndicesCount(), gl.UNSIGNED_SHORT, 0);
                }

            }

            // set generateMipmaps false
            // this.texture.updateRenderTargetMipmap(shadowTarget);

        }
    }

    var helpVector3 = new zen3d.Vector3();

    Renderer.prototype.renderList = function(renderList) {
        var camera = this.cache.camera;
        var fog = this.cache.fog;
        var gl = this.gl;
        var state = this.state;

        var lights = this.cache.lights;

        for (var i = 0, l = renderList.length; i < l; i++) {

            var renderItem = renderList[i];
            var object = renderItem.object;
            var material = renderItem.material;
            var geometry = renderItem.geometry;

            var program = zen3d.getProgram(gl, this, object.material, object, lights, fog);
            state.setProgram(program);

            this.geometry.setGeometry(geometry);
            this.setupVertexAttributes(program, geometry);

            // update uniforms
            // TODO need a better upload method
            var uniforms = program.uniforms;
            for (var key in uniforms) {
                var uniform = uniforms[key];
                switch (key) {

                    // pvm matrix
                    case "u_Projection":
                        if (object.type === zen3d.OBJECT_TYPE.CANVAS2D && object.isScreenCanvas) {
                            var projectionMat = object.orthoCamera.projectionMatrix.elements;
                        } else {
                            var projectionMat = camera.projectionMatrix.elements;
                        }

                        uniform.setValue(projectionMat);
                        break;
                    case "u_View":
                        if (object.type === zen3d.OBJECT_TYPE.CANVAS2D && object.isScreenCanvas) {
                            var viewMatrix = object.orthoCamera.viewMatrix.elements;
                        } else {
                            var viewMatrix = camera.viewMatrix.elements;
                        }

                        uniform.setValue(viewMatrix);
                        break;
                    case "u_Model":
                        var modelMatrix = object.worldMatrix.elements;
                        uniform.setValue(modelMatrix);
                        break;

                    case "u_Color":
                        var color = material.diffuse;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_Opacity":
                        uniform.setValue(material.opacity);
                        break;

                    case "texture":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.diffuseMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "normalMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.normalMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "bumpMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.bumpMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "bumpScale":
                        uniform.setValue(material.bumpScale);
                        break;
                    case "envMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.envMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "cubeMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.cubeMap, slot);
                        uniform.setValue(slot);
                        break;

                    case "u_EnvMap_Intensity":
                        uniform.setValue(material.envMapIntensity);
                        break;
                    case "u_Specular":
                        uniform.setValue(material.shininess);
                        break;
                    case "u_SpecularColor":
                        var color = material.specular;
                        uniform.setValue(color.r, color.g, color.b, 1);
                        break;
                    case "specularMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.specularMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "emissive":
                        var color = material.emissive;
                        var intensity = material.emissiveIntensity;
                        uniform.setValue(color.r * intensity, color.g * intensity, color.b * intensity);
                        break;
                    case "emissiveMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.emissiveMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "u_CameraPosition":
                        helpVector3.setFromMatrixPosition(camera.worldMatrix);
                        uniform.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
                        break;
                    case "u_FogColor":
                        var color = fog.color;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_FogDensity":
                        uniform.setValue(fog.density);
                        break;
                    case "u_FogNear":
                        uniform.setValue(fog.near);
                        break;
                    case "u_FogFar":
                        uniform.setValue(fog.far);
                        break;
                    case "u_PointSize":
                        uniform.setValue(material.size);
                        break;
                    case "u_PointScale":
                        var scale = this.height * 0.5; // three.js do this
                        uniform.setValue(scale);
                        break;
                    case "dashSize":
                        uniform.setValue(material.dashSize);
                        break;
                    case "totalSize":
                        uniform.setValue(material.dashSize + material.gapSize);
                        break;
                    case "scale":
                        uniform.setValue(material.scale);
                        break;
                    default:
                        // upload custom uniforms
                        if(material.uniforms && material.uniforms[key]) {
                            if(uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_2D) {
                                var slot = this.allocTexUnit();
                                this.texture.setTexture2D(material.uniforms[key], slot);
                                uniform.setValue(slot);
                            } else if(uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_CUBE) {
                                var slot = this.allocTexUnit();
                                this.texture.setTextureCube(material.uniforms[key], slot);
                                uniform.setValue(slot);
                            } else {
                                uniform.set(material.uniforms[key]);
                            }
                        }
                        break;
                }
            }

            // boneMatrices
            if(object.type === zen3d.OBJECT_TYPE.SKINNED_MESH) {
                this.uploadSkeleton(uniforms, object, program.id);
            }

            if (material.acceptLight) {
                this.uploadLights(uniforms, lights, object.receiveShadow, camera, program.id);
            }

            this.setStates(material);

            // draw
            if (object.type === zen3d.OBJECT_TYPE.POINT) {
                gl.drawArrays(gl.POINTS, 0, geometry.getVerticesCount());
            } else if(object.type === zen3d.OBJECT_TYPE.LINE) {
                state.setLineWidth(material.lineWidth);
                gl.drawArrays(gl.LINE_STRIP, 0, geometry.getVerticesCount());
            } else if(object.type === zen3d.OBJECT_TYPE.LINE_LOOP) {
                state.setLineWidth(material.lineWidth);
                gl.drawArrays(gl.LINE_LOOP, 0, geometry.getVerticesCount());
            } else if(object.type === zen3d.OBJECT_TYPE.LINE_SEGMENTS) {
                state.setLineWidth(material.lineWidth);
                gl.drawArrays(gl.LINES, 0, geometry.getVerticesCount());
            } else if (object.type === zen3d.OBJECT_TYPE.CANVAS2D) {
                var _offset = 0;
                for (var j = 0; j < object.drawArray.length; j++) {
                    var drawData = object.drawArray[j];

                    var slot = this.allocTexUnit();
                    this.texture.setTexture2D(drawData.texture, slot);
                    uniforms.spriteTexture.setValue(slot);

                    gl.drawElements(gl.TRIANGLES, drawData.count * 6, gl.UNSIGNED_SHORT, _offset * 2);
                    _offset += drawData.count * 6;
                    this._usedTextureUnits = 0;
                }
            } else {
                gl.drawElements(gl.TRIANGLES, geometry.getIndicesCount(), gl.UNSIGNED_SHORT, 0);
            }

            // reset used tex Unit
            this._usedTextureUnits = 0;
        }
    }

    var spritePosition = new zen3d.Vector3();
    var spriteRotation = new zen3d.Quaternion();
    var spriteScale = new zen3d.Vector3();

    Renderer.prototype.renderSprites = function(sprites) {
        if (this.cache.sprites.length === 0) {
            return;
        }

        var camera = this.cache.camera;
        var fog = this.cache.fog;
        var gl = this.gl;
        var state = this.state;
        var geometry = zen3d.Sprite.geometry;
        var material = sprites[0].material;

        var program = zen3d.getProgram(gl, this, material);
        state.setProgram(program);

        // bind a shared geometry
        this.geometry.setGeometry(geometry);
        this.setupVertexAttributes(program, geometry);

        var uniforms = program.uniforms;
        uniforms.projectionMatrix.setValue(camera.projectionMatrix.elements);

        // fog
        var sceneFogType = 0;
        if (fog) {
            uniforms.fogColor.setValue(fog.color.r, fog.color.g, fog.color.b);

            if (fog.fogType === zen3d.FOG_TYPE.NORMAL) {
                uniforms.fogNear.setValue(fog.near);
                uniforms.fogFar.setValue(fog.far);

                uniforms.fogType.setValue(1);
                sceneFogType = 1;
            } else if (fog.fogType === zen3d.FOG_TYPE.EXP2) {
                uniforms.fogDensity.setValue(fog.density);
                uniforms.fogType.setValue(2);
                sceneFogType = 2;
            }
        } else {
            uniforms.fogType.setValue(0);
            sceneFogType = 0;
        }

        // render
        var scale = [];

        for (var i = 0, l = sprites.length; i < l; i++) {
            var sprite = sprites[i].object;
            var material = sprite.material;

            uniforms.alphaTest.setValue(0);
            uniforms.viewMatrix.setValue(camera.viewMatrix.elements);
            uniforms.modelMatrix.setValue(sprite.worldMatrix.elements);

            sprite.worldMatrix.decompose(spritePosition, spriteRotation, spriteScale);

            scale[0] = spriteScale.x;
            scale[1] = spriteScale.y;

            var fogType = 0;

            if (fog && material.fog) {
                fogType = sceneFogType;
            }

            uniforms.fogType.setValue(fogType);

            if (material.diffuseMap !== null) {
                // TODO offset
                // uniforms.uvOffset.setValue(uniforms.uvOffset, material.diffuseMap.offset.x, material.diffuseMap.offset.y);
                // uniforms.uvScale.setValue(uniforms.uvScale, material.diffuseMap.repeat.x, material.diffuseMap.repeat.y);
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            } else {
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            }

            uniforms.opacity.setValue(material.opacity);
            uniforms.color.setValue(material.diffuse.r, material.diffuse.g, material.diffuse.b);

            uniforms.rotation.setValue(material.rotation);
            uniforms.scale.setValue(scale[0], scale[1]);

            this.setStates(material);

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(material.diffuseMap, slot);
            uniforms.map.setValue(slot);

            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

            // reset used tex Unit
            this._usedTextureUnits = 0;
        }

    }

    Renderer.prototype.renderParticles = function(particles) {
        if (this.cache.particles.length === 0) {
            return;
        }

        var camera = this.cache.camera;
        var gl = this.gl;
        var state = this.state;

        for (var i = 0, l = particles.length; i < l; i++) {
            var particle = particles[i].object;
            var geometry = particles[i].geometry;
            var material = particles[i].material;

            var program = zen3d.getProgram(gl, this, material);
            state.setProgram(program);

            this.geometry.setGeometry(geometry);
            this.setupVertexAttributes(program, geometry);

            var uniforms = program.uniforms;
            uniforms.uTime.setValue(particle.time);
            uniforms.uScale.setValue(1);

            uniforms.u_Projection.setValue(camera.projectionMatrix.elements);
            uniforms.u_View.setValue(camera.viewMatrix.elements);
            uniforms.u_Model.setValue(particle.worldMatrix.elements);

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(particle.particleNoiseTex, slot);
            uniforms.tNoise.setValue(slot);

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(particle.particleSpriteTex, slot);
            uniforms.tSprite.setValue(slot);

            this.setStates(material);

            gl.drawArrays(gl.POINTS, 0, geometry.getVerticesCount());

            this._usedTextureUnits = 0;
        }
    }

    /**
     * upload skeleton uniforms
     */
    Renderer.prototype.uploadSkeleton = function(uniforms, object, programId) {
        if(object.skeleton && object.skeleton.bones.length > 0) {
            var skeleton = object.skeleton;
            var gl = this.gl;

            if(this.capabilities.maxVertexTextures > 0 && this.capabilities.floatTextures) {
                if(skeleton.boneTexture === undefined) {
                    var size = Math.sqrt(skeleton.bones.length * 4);
                    size = zen3d.nextPowerOfTwo(Math.ceil(size));
                    size = Math.max(4, size);

                    var boneMatrices = new Float32Array(size * size * 4);
                    boneMatrices.set(skeleton.boneMatrices);

                    var boneTexture = new zen3d.TextureData(boneMatrices, size, size);

                    skeleton.boneMatrices = boneMatrices;
                    skeleton.boneTexture = boneTexture;
                    skeleton.boneTextureSize = size;
                }

                var slot = this.allocTexUnit();
                this.texture.setTexture2D(skeleton.boneTexture, slot);

                if(uniforms["boneTexture"]) {
                    uniforms["boneTexture"].setValue(slot);
                }

                if(uniforms["boneTextureSize"]) {
                    uniforms["boneTextureSize"].setValue(skeleton.boneTextureSize);
                }
            } else {
                // TODO a cache for uniform location
                var location = gl.getUniformLocation(programId, "boneMatrices");
                gl.uniformMatrix4fv(location, false, skeleton.boneMatrices);
            }
        }
    }

    var directShadowMaps = [];
    var pointShadowMaps = [];
    var spotShadowMaps = [];

    /**
     * upload lights uniforms
     * TODO a better function for array & struct uniforms upload
     */
    Renderer.prototype.uploadLights = function(uniforms, lights, receiveShadow, camera, programId) {
        var gl = this.gl;

        var r = 0, g = 0, b = 0;
        for (var k = 0; k < lights.ambientsNum; k++) {
            var light = lights.ambients[k];

            var intensity = light.intensity;
            var color = light.color;

            r += color.r * intensity;
            g += color.g * intensity;
            b += color.b * intensity;
        }
        if(lights.ambientsNum > 0) {
            uniforms.u_AmbientLightColor.setValue(r, g, b, 1);
        }

        for (var k = 0; k < lights.directsNum; k++) {
            var light = lights.directs[k];

            var intensity = light.intensity;
            light.getWorldDirection(helpVector3);
            helpVector3.transformDirection(camera.viewMatrix);
            var color = light.color;

            var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"];
            var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"];
            var u_Directional_color = uniforms["u_Directional[" + k + "].color"];
            u_Directional_direction.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
            u_Directional_intensity.setValue(intensity);
            u_Directional_color.setValue(color.r, color.g, color.b, 1);

            // shadow
            var u_Directional_shadow = uniforms["u_Directional[" + k + "].shadow"];
            u_Directional_shadow.setValue(light.castShadow ? 1 : 0);

            if (receiveShadow) {
                var u_Directional_shadowBias = uniforms["u_Directional[" + k + "].shadowBias"];
                u_Directional_shadowBias.setValue(light.shadow.bias);
                var u_Directional_shadowRadius = uniforms["u_Directional[" + k + "].shadowRadius"];
                u_Directional_shadowRadius.setValue(light.shadow.radius);
                var u_Directional_shadowMapSize = uniforms["u_Directional[" + k + "].shadowMapSize"];
                u_Directional_shadowMapSize.setValue(light.shadow.mapSize.x, light.shadow.mapSize.y);

                var directionalShadowMatrix = uniforms["directionalShadowMatrix[" + k + "]"];
                directionalShadowMatrix.setValue(light.shadow.matrix.elements);

                var slot = this.allocTexUnit();
                this.texture.setTexture2D(light.shadow.map, slot);
                directShadowMaps.push(slot);
            }
        }
        // active uniform can only get 0 if this is a sampler array uniform
        if(directShadowMaps.length > 0) {
            var directionalShadowMap = uniforms["directionalShadowMap[0]"];
            gl.uniform1iv(directionalShadowMap.location, directShadowMaps);

            directShadowMaps.length = 0;
        }

        for (var k = 0; k < lights.pointsNum; k++) {
            var light = lights.points[k];

            helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

            var intensity = light.intensity;
            var color = light.color;
            var distance = light.distance;
            var decay = light.decay;

            var u_Point_position = uniforms["u_Point[" + k + "].position"];
            u_Point_position.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
            var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"];
            u_Point_intensity.setValue(intensity);
            var u_Point_color = uniforms["u_Point[" + k + "].color"];
            u_Point_color.setValue(color.r, color.g, color.b, 1);
            var u_Point_distance = uniforms["u_Point[" + k + "].distance"];
            u_Point_distance.setValue(distance);
            var u_Point_decay = uniforms["u_Point[" + k + "].decay"];
            u_Point_decay.setValue(decay);

            // shadow
            var u_Point_shadow = uniforms["u_Point[" + k + "].shadow"];
            u_Point_shadow.setValue(light.castShadow ? 1 : 0);

            if (receiveShadow) {
                var u_Point_shadowBias = uniforms["u_Point[" + k + "].shadowBias"];
                u_Point_shadowBias.setValue(light.shadow.bias);
                var u_Point_shadowRadius = uniforms["u_Point[" + k + "].shadowRadius"];
                u_Point_shadowRadius.setValue(light.shadow.radius);
                var u_Point_shadowMapSize = uniforms["u_Point[" + k + "].shadowMapSize"];
                u_Point_shadowMapSize.setValue(light.shadow.mapSize.x, light.shadow.mapSize.y);

                var slot = this.allocTexUnit();
                this.texture.setTextureCube(light.shadow.map, slot);
                pointShadowMaps.push(slot);
            }
        }
        // active uniform can only get 0 if this is a sampler array uniform
        if(pointShadowMaps.length > 0) {
            var pointShadowMap = uniforms["pointShadowMap[0]"];
            gl.uniform1iv(pointShadowMap.location, pointShadowMaps);

            pointShadowMaps.length = 0;
        }

        for (var k = 0; k < lights.spotsNum; k++) {
            var light = lights.spots[k];

            helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

            var u_Spot_position = uniforms["u_Spot[" + k + "].position"];
            u_Spot_position.setValue(helpVector3.x, helpVector3.y, helpVector3.z);

            var intensity = light.intensity;
            var color = light.color;
            var distance = light.distance;
            var decay = light.decay;

            light.getWorldDirection(helpVector3);
            helpVector3.transformDirection(camera.viewMatrix);

            var u_Spot_direction = uniforms["u_Spot[" + k + "].direction"];
            u_Spot_direction.setValue(helpVector3.x, helpVector3.y, helpVector3.z);

            var u_Spot_intensity = uniforms["u_Spot[" + k + "].intensity"];
            u_Spot_intensity.setValue(intensity);
            var u_Spot_color = uniforms["u_Spot[" + k + "].color"];
            u_Spot_color.setValue(color.r, color.g, color.b, 1);
            var u_Spot_distance = uniforms["u_Spot[" + k + "].distance"];
            u_Spot_distance.setValue(distance);
            var u_Spot_decay = uniforms["u_Spot[" + k + "].decay"];
            u_Spot_decay.setValue(decay);

            var coneCos = Math.cos(light.angle);
            var penumbraCos = Math.cos(light.angle * (1 - light.penumbra));
            var u_Spot_coneCos = uniforms["u_Spot[" + k + "].coneCos"];
            u_Spot_coneCos.setValue(coneCos);
            var u_Spot_penumbraCos = uniforms["u_Spot[" + k + "].penumbraCos"];
            u_Spot_penumbraCos.setValue(penumbraCos);

            // shadow
            var u_Spot_shadow = uniforms["u_Spot[" + k + "].shadow"];
            u_Spot_shadow.setValue(light.castShadow ? 1 : 0);

            if (receiveShadow) {
                var u_Spot_shadowBias = uniforms["u_Spot[" + k + "].shadowBias"];
                u_Spot_shadowBias.setValue(light.shadow.bias);
                var u_Spot_shadowRadius = uniforms["u_Spot[" + k + "].shadowRadius"];
                u_Spot_shadowRadius.setValue(light.shadow.radius);
                var u_Spot_shadowMapSize = uniforms["u_Spot[" + k + "].shadowMapSize"];
                u_Spot_shadowMapSize.setValue(light.shadow.mapSize.x, light.shadow.mapSize.y);

                var spotShadowMatrix = uniforms["spotShadowMatrix[" + k + "]"];
                spotShadowMatrix.setValue(light.shadow.matrix.elements);

                var slot = this.allocTexUnit();
                this.texture.setTexture2D(light.shadow.map, slot);
                spotShadowMaps.push(slot);
            }
        }
        // active uniform can only get 0 if this is a sampler array uniform
        if(spotShadowMaps.length > 0) {
            var spotShadowMap = uniforms["spotShadowMap[0]"];
            gl.uniform1iv(spotShadowMap.location, spotShadowMaps);

            spotShadowMaps.length = 0;
        }
    }

    /**
     * set states
     */
    Renderer.prototype.setStates = function(material) {
        var gl = this.gl;
        var state = this.state;

        // set blend
        if (material.transparent) {
            state.setBlend(material.blending, material.premultipliedAlpha);
        } else {
            state.setBlend(BLEND_TYPE.NONE);
        }

        // set depth test
        if (material.depthTest) {
            state.enable(gl.DEPTH_TEST);
            state.depthMask(material.depthWrite);
        } else {
            state.disable(gl.DEPTH_TEST);
        }

        // set draw side
        state.setCullFace(
            (material.side === DRAW_SIDE.DOUBLE) ? CULL_FACE_TYPE.NONE : CULL_FACE_TYPE.BACK
        );
        state.setFlipSided(
            material.side === DRAW_SIDE.BACK
        );
    }

    /**
     * set render target
     */
    Renderer.prototype.setRenderTarget = function(target) {
        var gl = this.gl;

        if (!target) {
            if (this._currentRenderTarget === target) {

            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                this._currentRenderTarget = null;

                this.state.viewport(
                    this._currentViewport.x,
                    this._currentViewport.y,
                    this._currentViewport.z,
                    this._currentViewport.w);
            }

            return;
        }

        var isCube = target.activeCubeFace !== undefined;

        if (this._currentRenderTarget !== target) {
            if (!isCube) {
                this.texture.setRenderTarget2D(target);
            } else {
                this.texture.setRenderTargetCube(target);
            }

            this._currentRenderTarget = target;
        } else {
            if (isCube) {
                var textureProperties = this.properties.get(target.texture);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.activeCubeFace, textureProperties.__webglTexture, 0);
            }
        }

        this.state.viewport(0, 0, target.width, target.height);
    }

    Renderer.prototype.getCurrentRenderTarget = function() {
        return this._currentRenderTarget;
    }

    /**
     * clear buffer
     */
    Renderer.prototype.clear = function(color, depth, stencil) {
        var gl = this.gl;

        var bits = 0;

        if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
        if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
        if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;

        gl.clear(bits);
    }

    /**
     * alloc texture unit
     **/
    Renderer.prototype.allocTexUnit = function() {
        var textureUnit = this._usedTextureUnits;

        if (textureUnit >= this.capabilities.maxTextures) {

            console.warn('trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);

        }

        this._usedTextureUnits += 1;

        return textureUnit;
    }

    Renderer.prototype.setupVertexAttributes = function(program, geometry) {
        var gl = this.gl;
        var attributes = program.attributes;
        for (var key in attributes) {
            var attribute = attributes[key];
            var format = geometry.vertexFormat[key];
            if(format) {
                if(attribute.count !== format.size) {
                    console.warn("Renderer: attribute " + key + " size not match!");
                }
                gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, format.normalized, 4 * format.stride, 4 * format.offset);
                gl.enableVertexAttribArray(attribute.location);
            } else {
                console.warn("Renderer: attribute " + key + " not found!");
            }
        }
    }

    zen3d.Renderer = Renderer;
})();
(function() {
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;

    /**
     * Render Cache
     * use this class to cache and organize objects
     */
    var RenderCache = function() {

        // render list
        this.opaqueObjects = new Array();
        this.transparentObjects = new Array();
        this.canvas2dObjects = new Array();

        this.shadowObjects = new Array();

        this.sprites = new Array();

        this.particles = new Array();

        // lights
        this.lights = {
            ambients: [],
            directs: [],
            points: [],
            spots: [],
            shadows: [],
            ambientsNum: 0,
            directsNum: 0,
            pointsNum: 0,
            spotsNum: 0,
            shadowsNum: 0,
            totalNum: 0
        }
        // this.ambientLights = new Array();
        // this.directLights = new Array();
        // this.pointLights = new Array();
        // this.spotLights = new Array();
        // this.shadowLights = new Array();

        // camera
        this.camera = null;

        // fog
        this.fog = null;
    }

    var helpVector3 = new zen3d.Vector3();
    var helpFrustum = new zen3d.Frustum();
    var helpMatrix = new zen3d.Matrix4();
    var helpSphere = new zen3d.Sphere();

    /**
     * cache scene
     */
    RenderCache.prototype.cacheScene = function(scene, camera) {
        this.camera = camera;
        this.fog = scene.fog;
        this.cacheObject(scene);
    }

    RenderCache.prototype.cacheObject = function(object) {
        var camera = this.camera;

        // cache all type of objects
        switch (object.type) {
            case OBJECT_TYPE.POINT:
            case OBJECT_TYPE.LINE:
            case OBJECT_TYPE.LINE_LOOP:
            case OBJECT_TYPE.LINE_SEGMENTS:
            case OBJECT_TYPE.CANVAS2D:
            case OBJECT_TYPE.MESH:
            case OBJECT_TYPE.SKINNED_MESH:

                // frustum test
                if(object.frustumCulled) {
                    helpSphere.copy(object.geometry.boundingSphere).applyMatrix4(object.worldMatrix);
        			helpMatrix.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix);
        			helpFrustum.setFromMatrix(helpMatrix);
                    var frustumTest = helpFrustum.intersectsSphere(helpSphere);
                    if(!frustumTest) {
                        break;
                    }
                }

                var material = object.material;

                var array;
                if (object.type == OBJECT_TYPE.CANVAS2D) {
                    array = this.canvas2dObjects;
                } else if (material.transparent) {
                    array = this.transparentObjects;
                } else {
                    array = this.opaqueObjects;
                }

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                array.push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });

                if (object.castShadow) {
                    this.shadowObjects.push(object);
                }

                break;
            case OBJECT_TYPE.SPRITE:
                // frustum test
                if(object.frustumCulled) {
                    helpSphere.center.set(0, 0, 0);
                    helpSphere.radius = 0.7071067811865476;
                    helpSphere.applyMatrix4(object.worldMatrix);
                    helpMatrix.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix);
                    helpFrustum.setFromMatrix(helpMatrix);
                    var frustumTest = helpFrustum.intersectsSphere(helpSphere);
                    if(!frustumTest) {
                        break;
                    }
                }

                var array = this.sprites;

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                array.push({
                    object: object,
                    material: object.material,
                    z: helpVector3.z
                });

                // no shadow
                break;
            case OBJECT_TYPE.PARTICLE:
                var array = this.particles;

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                array.push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });
                break;
            case OBJECT_TYPE.LIGHT:
                var lights = this.lights;
                if (object.lightType == LIGHT_TYPE.AMBIENT) {
                    lights.ambients.push(object);
                    lights.ambientsNum++;
                } else if (object.lightType == LIGHT_TYPE.DIRECT) {
                    lights.directs.push(object);
                    lights.directsNum++;
                } else if (object.lightType == LIGHT_TYPE.POINT) {
                    lights.points.push(object);
                    lights.pointsNum++;
                } else if (object.lightType == LIGHT_TYPE.SPOT) {
                    lights.spots.push(object);
                    lights.spotsNum++;
                }

                if (object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
                    lights.shadows.push(object);
                    lights.shadowsNum++;
                }

                lights.totalNum++;
                break;
            case OBJECT_TYPE.CAMERA:
                // do nothing
                // main camera will set by hand
                // camera put to object tree just for update position
                break;
            case OBJECT_TYPE.SCENE:
                // do nothing
                break;
            case OBJECT_TYPE.GROUP:
                // do nothing
                break;
            default:
                console.log("undefined object type")
        }

        // handle children by recursion
        if(OBJECT_TYPE.CANVAS2D !== object.type) {
            var children = object.children;
            for (var i = 0, l = children.length; i < l; i++) {
                this.cacheObject(children[i]);
            }
        }
    }

    /**
     * sort render list
     */
    RenderCache.prototype.sort = function() {
        // opaque objects render from front to back
        this.opaqueObjects.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return za - zb;
        });

        // transparent objects render from back to front
        this.transparentObjects.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return zb - za;
        });

        // sprites render from back to front
        this.sprites.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return zb - za;
        });

        // particles render from back to front
        this.particles.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return zb - za;
        });

        // TODO canvas2d object should render in order
    }

    /**
     * clear
     */
    RenderCache.prototype.clear = function() {
        this.transparentObjects.length = 0;
        this.opaqueObjects.length = 0;
        this.canvas2dObjects.length = 0;

        this.shadowObjects.length = 0;

        this.sprites.length = 0;

        this.particles.length = 0;

        var lights = this.lights;
        lights.ambients.length = 0;
        lights.directs.length = 0;
        lights.points.length = 0;
        lights.spots.length = 0;
        lights.shadows.length = 0;
        lights.ambientsNum = 0;
        lights.directsNum = 0;
        lights.pointsNum = 0;
        lights.spotsNum = 0;
        lights.shadowsNum = 0;
        lights.totalNum = 0;
    }

    zen3d.RenderCache = RenderCache;
})();
(function() {
    /**
     * RenderTargetBase Class
     * @class
     */
    var RenderTargetBase = function(width, height) {
        RenderTargetBase.superClass.constructor.call(this);

        this.uuid = zen3d.generateUUID();

        this.width = width;
        this.height = height;

        this.viewport = new zen3d.Vector4(0, 0, width, height);

        this.depthBuffer = true;
        this.stencilBuffer = true;
    }

    zen3d.inherit(RenderTargetBase, zen3d.EventDispatcher);

    /**
     * resize render target
     */
    RenderTargetBase.prototype.resize = function(width, height) {
        if(this.width !== width || this.height !== height) {
            this.dispose();
        }

        this.width = width;
        this.height = height;

        this.viewport.copy(0, 0, width, height);
    }

    RenderTargetBase.prototype.dispose = function() {
        this.dispatchEvent({type: 'dispose'});
    }

    zen3d.RenderTargetBase = RenderTargetBase;
})();
(function() {
    /**
     * RenderTarget2D Class
     * @class
     */
    var RenderTarget2D = function(width, height) {
        RenderTarget2D.superClass.constructor.call(this, width, height);

        this.texture = new zen3d.Texture2D();
    }

    zen3d.inherit(RenderTarget2D, zen3d.RenderTargetBase);

    zen3d.RenderTarget2D = RenderTarget2D;
})();
(function() {
    /**
     * RenderTargetCube Class
     * @class
     */
    var RenderTargetCube = function(width, height) {
        RenderTargetCube.superClass.constructor.call(this, width, height);

        this.texture = new zen3d.TextureCube();

        this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
    }

    zen3d.inherit(RenderTargetCube, zen3d.RenderTargetBase);

    zen3d.RenderTargetCube = RenderTargetCube;
})();
(function() {
    /**
     * Geometry data
     * @class
     */
    var Geometry = function() {
        Geometry.superClass.constructor.call(this);

        this.uuid = zen3d.generateUUID();

        this.verticesArray = new Array();

        this.indicesArray = new Array();

        // maybe need something to discrib vertex format
        this.vertexSize = 17; // static

        // vertex format
        this.vertexFormat = {
            "a_Position": {size: 3, normalized: false, stride: 17, offset: 0},
            "a_Normal": {size: 3, normalized: false, stride: 17, offset: 3},
            "a_Uv": {size: 2, normalized: false, stride: 17, offset: 13}
        };

        this.usageType = zen3d.WEBGL_BUFFER_USAGE.STATIC_DRAW;

        this.boundingBox = new zen3d.Box3();

        this.boundingSphere = new zen3d.Sphere();

        this.dirty = true;

        // if part dirty, update part of buffers
        this.dirtyRange = {enable: false, start: 0, count: 0};
    }

    zen3d.inherit(Geometry, zen3d.EventDispatcher);

    Geometry.prototype.computeBoundingBox = function() {
        this.boundingBox.setFromArray(this.verticesArray, this.vertexSize);
    }

    Geometry.prototype.computeBoundingSphere = function() {
        this.boundingSphere.setFromArray(this.verticesArray, this.vertexSize);
    }

    Geometry.prototype.getVerticesCount = function() {
        return this.verticesArray.length / this.vertexSize;
    }

    Geometry.prototype.getIndicesCount = function() {
        return this.indicesArray.length;
    }

    Geometry.prototype.dispose = function() {
        this.dispatchEvent({type: 'dispose'});

        this.dirty = true;
    }

    zen3d.Geometry = Geometry;
})();

(function() {
    /**
     * CubeGeometry data
     * @class
     */
    var CubeGeometry = function(width, height, depth, front) {
        CubeGeometry.superClass.constructor.call(this);

        this.buildGeometry(width, height, depth, (front === undefined) ? true : front);
    }

    zen3d.inherit(CubeGeometry, zen3d.Geometry);

    CubeGeometry.prototype.buildGeometry = function(width, height, depth, front) {

        this.verticesArray.push(
            -width * 0.5, -height * 0.5, -depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
            -width * 0.5, height * 0.5, -depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
            width * 0.5, height * 0.5, -depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,

            width * 0.5, height * 0.5, -depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
            width * 0.5, -height * 0.5, -depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
            -width * 0.5, -height * 0.5, -depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,

            -width * 0.5, -height * 0.5, depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
            width * 0.5, -height * 0.5, depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
            width * 0.5, height * 0.5, depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,

            width * 0.5, height * 0.5, depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
            -width * 0.5, height * 0.5, depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
            -width * 0.5, -height * 0.5, depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,

            -width * 0.5, -height * 0.5, -depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
            width * 0.5, -height * 0.5, -depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
            width * 0.5, -height * 0.5, depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,

            width * 0.5, -height * 0.5, depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
            -width * 0.5, -height * 0.5, depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
            -width * 0.5, -height * 0.5, -depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,

            width * 0.5, -height * 0.5, -depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
            width * 0.5, height * 0.5, -depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
            width * 0.5, height * 0.5, depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,

            width * 0.5, height * 0.5, depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
            width * 0.5, -height * 0.5, depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
            width * 0.5, -height * 0.5, -depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,

            width * 0.5, height * 0.5, -depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
            -width * 0.5, height * 0.5, -depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
            -width * 0.5, height * 0.5, depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,

            -width * 0.5, height * 0.5, depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
            width * 0.5, height * 0.5, depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
            width * 0.5, height * 0.5, -depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,

            -width * 0.5, height * 0.5, -depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
            -width * 0.5, -height * 0.5, -depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
            -width * 0.5, -height * 0.5, depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,

            - width * 0.5, -height * 0.5, depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
            -width * 0.5, height * 0.5, depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
            -width * 0.5, height * 0.5, -depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0
        );

        if (front) {
            this.indicesArray.push(
                0, 1, 2, 3, 4, 5,
                6, 7, 8, 9, 10, 11,
                12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23,
                24, 25, 26, 27, 28, 29,
                30, 31, 32, 33, 34, 35);
        } else {
            this.indicesArray.push(
                0, 2, 1, 3, 5, 4,
                6, 8, 7, 9, 11, 10,
                12, 14, 13, 15, 17, 16,
                18, 20, 19, 21, 23, 22,
                24, 26, 25, 27, 29, 28,
                30, 32, 31, 33, 35, 34);
        }

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    zen3d.CubeGeometry = CubeGeometry;
})();

(function() {
    /**
     * PlaneGeometry data
     * @class
     */
    var PlaneGeometry = function(width, height, segmentsW, segmentsH) {
        PlaneGeometry.superClass.constructor.call(this);

        this.buildGeometry(width, height, segmentsW || 1, segmentsH || 1);
    }

    zen3d.inherit(PlaneGeometry, zen3d.Geometry);

    PlaneGeometry.prototype.buildGeometry = function(width, height, segmentsW, segmentsH) {
        var tw = segmentsW + 1;
        var th = segmentsH + 1;

        var verticesData = this.verticesArray;
        var indexData = this.indicesArray;

        var index = 0;
        var numIndices = 0;
        for(var yi = 0; yi < th; yi++) {
            for(var xi = 0; xi < tw; xi++) {
                var x = (xi / segmentsW - .5) * width;
                var y = (yi / segmentsH - .5) * height;

                verticesData[index++] = x;
                verticesData[index++] = 0;
                verticesData[index++] = y;

                verticesData[index++] = 0;
                verticesData[index++] = 1;
                verticesData[index++] = 0;

                verticesData[index++] = 1;
                verticesData[index++] = 0;
                verticesData[index++] = 0;

                verticesData[index++] = 1;
                verticesData[index++] = 1;
                verticesData[index++] = 1;
                verticesData[index++] = 1;

                verticesData[index++] = (xi / segmentsW) * 1;
                verticesData[index++] = (1 - yi / segmentsH) * 1;

                verticesData[index++] = (xi / segmentsW) * 1;
                verticesData[index++] = (1 - yi / segmentsH) * 1;

                if (xi != segmentsW && yi != segmentsH) {
                    base = xi + yi * tw;
                    var mult = 1;

                    indexData[numIndices++] = base * mult;
                    indexData[numIndices++] = (base + tw) * mult;
                    indexData[numIndices++] = (base + tw + 1) * mult;

                    indexData[numIndices++] = base * mult;
                    indexData[numIndices++] = (base + tw + 1) * mult;
                    indexData[numIndices++] = (base + 1) * mult;

                }
            }
        }

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    zen3d.PlaneGeometry = PlaneGeometry;
})();

(function() {
    /**
     * SphereGeometry data
     * @class
     */
    var SphereGeometry = function(radius, segmentsW, segmentsH, front) {
        SphereGeometry.superClass.constructor.call(this);

        this.buildGeometry(radius, segmentsW || 20, segmentsH || 20, (front === undefined) ? true : front);
    }

    zen3d.inherit(SphereGeometry, zen3d.Geometry);

    SphereGeometry.prototype.buildGeometry = function(radius, segmentsW, segmentsH, front) {
        var i = 0, j = 0, triIndex = 0;
        var numVerts = (segmentsH + 1) * (segmentsW + 1);

        var stride = 17;
        var skip = stride - 9;

        var verticesData = this.verticesArray;
        var indexData = this.indicesArray;

        var startIndex = 0;
        var index = 0;
        var comp1 = 0, comp2 = 0, t1 = 0, t2 = 0;

        for (j = 0; j <= segmentsH; ++j) {

            startIndex = index;

            var horangle = Math.PI * j / segmentsH;
            var z = -radius * Math.cos(horangle);
            var ringradius = radius * Math.sin(horangle);

            for (i = 0; i <= segmentsW; ++i) {
                var verangle = 2 * Math.PI * i / segmentsW;
                var x = ringradius * Math.cos(verangle);
                var y = ringradius * Math.sin(verangle);
                var normLen = 1 / Math.sqrt(x * x + y * y + z * z);
                var tanLen = Math.sqrt(y * y + x * x);

                t1 = 0;
                t2 = tanLen > .007 ? x / tanLen : 0;
                comp1 = -z;
                comp2 = y;

                if (i == segmentsW) {

                    verticesData[index++] = verticesData[startIndex];
                    verticesData[index++] = verticesData[startIndex + 1];
                    verticesData[index++] = verticesData[startIndex + 2];

                    verticesData[index++] = x * normLen;;
                    verticesData[index++] = comp1 * normLen;;
                    verticesData[index++] = comp2 * normLen;;

                    verticesData[index++] = tanLen > .007 ? -y / tanLen : 1;
                    verticesData[index++] = t1;
                    verticesData[index++] = t2;

                    verticesData[index + 0] = 1.0;
                    verticesData[index + 1] = 1.0;
                    verticesData[index + 2] = 1.0;
                    verticesData[index + 3] = 1.0;

                } else {
                    verticesData[index++] = x;
                    verticesData[index++] = comp1;
                    verticesData[index++] = comp2;

                    verticesData[index++] = x * normLen;
                    verticesData[index++] = comp1 * normLen;
                    verticesData[index++] = comp2 * normLen;
                    verticesData[index++] = tanLen > .007 ? -y / tanLen : 1;
                    verticesData[index++] = t1;
                    verticesData[index++] = t2;

                    verticesData[index] = 1.0;
                    verticesData[index + 1] = 1.0;
                    verticesData[index + 2] = 1.0;
                    verticesData[index + 3] = 1.0;
                }

                if (i > 0 && j > 0) {
                    var a = (segmentsW + 1) * j + i;
                    var b = (segmentsW + 1) * j + i - 1;
                    var c = (segmentsW + 1) * (j - 1) + i - 1;
                    var d = (segmentsW + 1) * (j - 1) + i;

                    if (j == segmentsH) {
                        verticesData[index - 9] = verticesData[startIndex];
                        verticesData[index - 8] = verticesData[startIndex + 1];
                        verticesData[index - 7] = verticesData[startIndex + 2];

                        if (front) {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = d;
                        }
                        else {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = d;
                            indexData[triIndex++] = c;
                        }


                    } else if (j == 1) {

                        if (front) {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = b;
                            indexData[triIndex++] = c;
                        }
                        else {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = b;
                        }


                    } else {

                        if (front) {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c
                            indexData[triIndex++] = d;
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = b;
                            indexData[triIndex++] = c;
                        }
                        else {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = d
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = b;
                        }
                    }
                }

                index += skip;
            }
        }

        //var i, j;
        var stride = 17;
        var numUvs = (segmentsH + 1) * (segmentsW + 1) * stride;
        var data;
        var skip = stride - 2;


        var index = 13;
        for (j = 0; j <= segmentsH; ++j) {
            for (i = 0; i <= segmentsW; ++i) {
                verticesData[index++] = (i / segmentsW);
                verticesData[index++] = (j / segmentsH);
                index += skip;
            }
        }

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    zen3d.SphereGeometry = SphereGeometry;
})();

(function() {
    /**
     * CylinderGeometry data
     * same as CylinderGeometry of three.js
     * @class
     */
    var CylinderGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        CylinderGeometry.superClass.constructor.call(this);

        radiusTop = radiusTop !== undefined ? radiusTop : 20;
        radiusBottom = radiusBottom !== undefined ? radiusBottom : 20;
        height = height !== undefined ? height : 100;

        radialSegments = Math.floor(radialSegments) || 8;
        heightSegments = Math.floor(heightSegments) || 1;

        openEnded = openEnded !== undefined ? openEnded : false;
        thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
        thetaLength = thetaLength !== undefined ? thetaLength : 2.0 * Math.PI;

        this.buildGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
    }

    zen3d.inherit(CylinderGeometry, zen3d.Geometry);

    CylinderGeometry.prototype.buildGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        var vertices = this.verticesArray;
        var indices = this.indicesArray;

        var halfHeight = height / 2;

        var index = 0;
        var indexArray = [];

        generateTorso();

        if (openEnded === false) {
            if (radiusTop > 0) {
                generateCap(true);
            }
            if (radiusBottom > 0) {
                generateCap(false);
            }
        }

        function generateTorso() {
            var x, y;
            var normal = new zen3d.Vector3();
            var vertex = new zen3d.Vector3();

            // this will be used to calculate the normal
            var slope = (radiusBottom - radiusTop) / height;

            // generate vertices
            for (y = 0; y <= heightSegments; y++) {
                var indexRow = [];

                var v = y / heightSegments;

                // calculate the radius of the current row
                var radius = v * (radiusBottom - radiusTop) + radiusTop;

                for (x = 0; x <= radialSegments; x++) {
                    var u = x / radialSegments;

                    var theta = u * thetaLength + thetaStart;

                    var sinTheta = Math.sin(theta);
                    var cosTheta = Math.cos(theta);

                    vertex.x = radius * sinTheta;
                    vertex.y = -v * height + halfHeight;
                    vertex.z = radius * cosTheta;

                    normal.set(sinTheta, slope, cosTheta).normalize();

                    vertices.push(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z, 1.0, 0.0, 0.0, 1, 1, 1, 1, u, 1 - v, 0., 0.);

                    // save index of vertex in respective row
                    indexRow.push(index++);
                }
                // now save vertices of the row in our index array
                indexArray.push(indexRow);
            }

            // generate indices
            for (x = 0; x < radialSegments; x++) {
                for (y = 0; y < heightSegments; y++) {
                    // we use the index array to access the correct indices
                    var a = indexArray[y][x];
                    var b = indexArray[y + 1][x];
                    var c = indexArray[y + 1][x + 1];
                    var d = indexArray[y][x + 1];

                    // faces
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }
        }

        function generateCap(top) {
            var x, centerIndexStart, centerIndexEnd;

            var uv = new zen3d.Vector2();
            var vertex = new zen3d.Vector3();

            var radius = (top === true) ? radiusTop : radiusBottom;
            var sign = (top === true) ? 1 : -1;

            // save the index of the first center vertex
            centerIndexStart = index;

            // first we generate the center vertex data of the cap.
            // because the geometry needs one set of uvs per face,
            // we must generate a center vertex per face/segment

            for (x = 1; x <= radialSegments; x++) {
                vertices.push(0, halfHeight * sign, 0, 0, sign, 0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.5, 0.5, 0., 0.);

                index++;
            }

            // save the index of the last center vertex
            centerIndexEnd = index;

            // now we generate the surrounding vertices
            for (x = 0; x <= radialSegments; x++) {
                var u = x / radialSegments;
                var theta = u * thetaLength + thetaStart;

                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);

                vertex.x = radius * sinTheta;
                vertex.y = halfHeight * sign;
                vertex.z = radius * cosTheta;

                uv.x = (cosTheta * 0.5) + 0.5;
                uv.y = (sinTheta * 0.5 * sign) + 0.5;

                vertices.push(vertex.x, vertex.y, vertex.z, 0, sign, 0, 1.0, 0.0, 0.0, 1, 1, 1, 1, uv.x, uv.y, 0., 0.);

                index++;
            }

            // generate indices
            for (x = 0; x < radialSegments; x++) {
                var c = centerIndexStart + x;
                var i = centerIndexEnd + x;

                if (top === true) {
                    indices.push(i, i + 1, c);
                } else {
                    indices.push(i + 1, i, c);
                }
            }
        }

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    zen3d.CylinderGeometry = CylinderGeometry;
})();
(function() {
    /**
     * TextureBase
     * @class
     */
    var TextureBase = function() {
        TextureBase.superClass.constructor.call(this);

        this.uuid = zen3d.generateUUID();

        this.textureType = "";

        this.border = 0;

        this.pixelFormat = zen3d.WEBGL_PIXEL_FORMAT.RGBA;

        this.pixelType = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

        this.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;

        this.wrapS = zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
        this.wrapT = zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

        this.anisotropy = 1;

        this.generateMipmaps = true;

        this.encoding = zen3d.TEXEL_ENCODING_TYPE.LINEAR;

        this.version = 0;
    }

    zen3d.inherit(TextureBase, zen3d.EventDispatcher);

    TextureBase.prototype.dispose = function() {
        this.dispatchEvent({type: 'dispose'});

        this.version = 0;
    }

    zen3d.TextureBase = TextureBase;
})();
(function() {
    /**
     * Texture2D
     * @class
     */
    var Texture2D = function() {
        Texture2D.superClass.constructor.call(this);

        this.textureType = zen3d.WEBGL_TEXTURE_TYPE.TEXTURE_2D;

        this.image = null;
        this.mipmaps = [];
    }

    zen3d.inherit(Texture2D, zen3d.TextureBase);

    Texture2D.fromImage = function(image) {
        var texture = new Texture2D();

        texture.image = image;
        texture.version++;

        return texture;
    }

    Texture2D.fromSrc = function(src) {
        var texture = new Texture2D();

        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
		var isJPEG = src.search( /\.(jpg|jpeg)$/ ) > 0 || src.search( /^data\:image\/jpeg/ ) === 0;

        var isTGA = src.search( /\.(tga)$/ ) > 0 || src.search( /^data\:image\/tga/ ) === 0;

        var loader = isTGA ? new zen3d.TGALoader() : new zen3d.ImageLoader();
        loader.load(src, function(image) {
            texture.pixelFormat = isJPEG ? zen3d.WEBGL_PIXEL_FORMAT.RGB : zen3d.WEBGL_PIXEL_FORMAT.RGBA;
            texture.image = image;
            texture.version++;
        });

        return texture;
    }

    zen3d.Texture2D = Texture2D;
})();
(function() {
    /**
     * TextureCube
     * @class
     */
    var TextureCube = function() {
        TextureCube.superClass.constructor.call(this);

        this.textureType = zen3d.WEBGL_TEXTURE_TYPE.TEXTURE_CUBE_MAP;

        this.images = [];
    }

    zen3d.inherit(TextureCube, zen3d.TextureBase);

    TextureCube.fromImage = function(imageArray) {
        var texture = new TextureCube();
        var images = texture.images;

        for(var i = 0; i < 6; i++) {
            images[i] = imageArray[i];
        }

        texture.version++;

        return texture;
    }

    TextureCube.fromSrc = function(srcArray) {
        var texture = new TextureCube();
        var images = texture.images;

        var src = srcArray[0];
        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
		var isJPEG = src.search( /\.(jpg|jpeg)$/ ) > 0 || src.search( /^data\:image\/jpeg/ ) === 0;

        var isTGA = src.search( /\.(tga)$/ ) > 0 || src.search( /^data\:image\/tga/ ) === 0;

        var count = 0;
        function next(image) {
            if(image) {
                images.push(image);
                count++;
            }
            if(count >= 6) {
                loaded();
                return;
            }
            var loader = isTGA ? new zen3d.TGALoader() : new zen3d.ImageLoader();
            loader.load(srcArray[count], next);
        }
        next();

        function loaded() {
            texture.pixelFormat = isJPEG ? zen3d.WEBGL_PIXEL_FORMAT.RGB : zen3d.WEBGL_PIXEL_FORMAT.RGBA;
            texture.version++;
        }

        return texture;
    }

    zen3d.TextureCube = TextureCube;
})();
(function() {
    var TextureData = function(data, width, height) {
        TextureData.superClass.constructor.call(this);

        this.image = {data: data, width: width, height: height};

        // default pixel type set to float
        this.pixelType = zen3d.WEBGL_PIXEL_TYPE.FLOAT;

        this.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
        this.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;

        this.generateMipmaps = false;
    }

    zen3d.inherit(TextureData, zen3d.Texture2D);

    TextureData.prototype.isDataTexture = true;

    zen3d.TextureData = TextureData;
})();
(function() {
    /**
     * base material class
     * @class
     */
    var Material = function() {

        // material type
        this.type = "";

        this.opacity = 1;

        this.transparent = false;

        this.premultipliedAlpha = false;

        // diffuse
        this.diffuse = new zen3d.Color3(0xffffff);
        this.diffuseMap = null;

        // normal
        this.normalMap = null;

        // bump
        this.bumpMap = null;
	    this.bumpScale = 1;

        // env
        this.envMap = null;
        this.envMapIntensity = 1;

        // emissive
        this.emissive = new zen3d.Color3(0x000000);
        this.emissiveMap = null;
        this.emissiveIntensity = 1;

        //blending
        this.blending = zen3d.BLEND_TYPE.NORMAL;

        // depth test
        this.depthTest = true;
        this.depthWrite = true;

        // draw side
        this.side = zen3d.DRAW_SIDE.FRONT;

        // shading type: SMOOTH_SHADING, FLAT_SHADING
        this.shading = zen3d.SHADING_TYPE.SMOOTH_SHADING;

        // use light
        // if use light, renderer will try to upload light uniforms
        this.acceptLight = false;
    }

    zen3d.Material = Material;
})();

(function() {
    /**
     * BasicMaterial
     * @class
     */
    var BasicMaterial = function() {
        BasicMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.BASIC;
    }

    zen3d.inherit(BasicMaterial, zen3d.Material);

    zen3d.BasicMaterial = BasicMaterial;
})();

(function() {
    /**
     * LambertMaterial
     * @class
     */
    var LambertMaterial = function() {
        LambertMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LAMBERT;

        this.acceptLight = true;
    }

    zen3d.inherit(LambertMaterial, zen3d.Material);

    zen3d.LambertMaterial = LambertMaterial;
})();

(function() {
    /**
     * PhongMaterial
     * @class
     */
    var PhongMaterial = function() {
        PhongMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PHONG;

        // specular
        this.shininess = 30;
        this.specular = new zen3d.Color3(0x666666);
        this.specularMap = null;

        this.acceptLight = true;
    }

    zen3d.inherit(PhongMaterial, zen3d.Material);

    zen3d.PhongMaterial = PhongMaterial;
})();

(function() {
    /**
     * CubeMaterial
     * @class
     */
    var CubeMaterial = function() {
        CubeMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.CUBE;

        this.cubeMap = null;
    }

    zen3d.inherit(CubeMaterial, zen3d.Material);

    zen3d.CubeMaterial = CubeMaterial;
})();

(function() {
    /**
     * PointsMaterial
     * @class
     */
    var PointsMaterial = function() {
        PointsMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.POINT;

        this.size = 1;

        this.sizeAttenuation = true;
    }

    zen3d.inherit(PointsMaterial, zen3d.Material);

    zen3d.PointsMaterial = PointsMaterial;
})();

(function() {
    /**
     * LineBasicMaterial
     * @class
     */
    var LineBasicMaterial = function() {
        LineBasicMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LINE_BASIC;

        this.lineWidth = 1;
    }

    zen3d.inherit(LineBasicMaterial, zen3d.Material);

    zen3d.LineBasicMaterial = LineBasicMaterial;
})();

(function() {
    /**
     * LineDashedMaterial
     * @class
     */
    var LineDashedMaterial = function() {
        LineDashedMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LINE_DASHED;

        this.lineWidth = 1;

        this.scale = 1;
        this.dashSize = 3;
        this.gapSize = 1;
    }

    zen3d.inherit(LineDashedMaterial, zen3d.Material);

    zen3d.LineDashedMaterial = LineDashedMaterial;
})();

(function() {
    /**
     * SpriteMaterial
     * @class
     */
    var SpriteMaterial = function() {
        SpriteMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.SPRITE;

        this.rotation = 0;

    	this.fog = false;
    }

    zen3d.inherit(SpriteMaterial, zen3d.Material);

    zen3d.SpriteMaterial = SpriteMaterial;
})();

(function() {
    /**
     * ShaderMaterial
     * @class
     */
    var ShaderMaterial = function(vertexShader, fragmentShader, uniforms) {
        ShaderMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.SHADER;

        this.vertexShader = vertexShader || "";

        this.fragmentShader = fragmentShader || "";

        // uniforms should match fragment shader
        this.uniforms = uniforms || {};
    }

    zen3d.inherit(ShaderMaterial, zen3d.Material);

    zen3d.ShaderMaterial = ShaderMaterial;
})();

(function() {
    /**
     * DepthMaterial
     * @class
     */
    var DepthMaterial = function() {
        DepthMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.DEPTH;

        this.blending = zen3d.BLEND_TYPE.NONE;

        this.depthTest = false;
    }

    zen3d.inherit(DepthMaterial, zen3d.Material);

    zen3d.DepthMaterial = DepthMaterial;
})();
(function() {
    /**
     * ParticleMaterial
     * @class
     */
    var ParticleMaterial = function() {
        ParticleMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PARTICLE;

        this.transparent = true;

        this.blending = zen3d.BLEND_TYPE.ADD;

        this.depthTest = true;
        this.depthWrite = false;
    }

    zen3d.inherit(ParticleMaterial, zen3d.Material);

    zen3d.ParticleMaterial = ParticleMaterial;
})();
(function() {
    /**
     * Object3D
     * @class
     */
    var Object3D = function() {

        // a custom name for this object
        this.name = "";

        // type of this object, set by subclass
        this.type = "";

        // position
        this.position = new zen3d.Vector3();
        // scale
        this.scale = new zen3d.Vector3(1, 1, 1);

        // euler rotate
        var euler = this.euler = new zen3d.Euler();
        // quaternion rotate
        var quaternion = this.quaternion = new zen3d.Quaternion();

        // bind euler and quaternion
        euler.onChange(function() {
            quaternion.setFromEuler(euler, false);
        });
        quaternion.onChange(function() {
            euler.setFromQuaternion(quaternion, undefined, false);
        });

        // transform matrix
        this.matrix = new zen3d.Matrix4();
        // world transform matrix
        this.worldMatrix = new zen3d.Matrix4();

        // children
        this.children = new Array();
        // parent
        this.parent = null;

        // shadow
        this.castShadow = false;
        this.receiveShadow = false;

        // frustum test
        this.frustumCulled = true;
    }

    Object.defineProperties(Object3D.prototype, {
        /**
         * rotation set by euler
         **/
        rotation: {
            get: function() {
                return this.euler;
            },
            set: function(euler) {
                var _euler = this.euler;
                _euler.copyFrom(euler);

                this.quaternion.setFromEuler(euler);
            }
        }
    });

    /**
     * add child to object3d
     */
    Object3D.prototype.add = function(object) {
        this.children.push(object);
        object.parent = this;
    }

    /**
     * remove child from object3d
     */
    Object3D.prototype.remove = function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        object.parent = null;
    }

    /**
     * get object by name
     */
    Object3D.prototype.getObjectByName = function(name) {
        return this.getObjectByProperty('name', name);
    }

    /**
     * get object by property
     */
    Object3D.prototype.getObjectByProperty = function(name, value) {
        if (this[name] === value) return this;

        for (var i = 0, l = this.children.length; i < l; i++) {

            var child = this.children[i];
            var object = child.getObjectByProperty(name, value);

            if (object !== undefined) {

                return object;

            }

        }

        return undefined;
    }

    /**
     * update matrix
     */
    Object3D.prototype.updateMatrix = function() {
        var matrix = this.matrix.transform(this.position, this.scale, this.quaternion);

        this.worldMatrix.copy(matrix);

        if (this.parent) {
            var parentMatrix = this.parent.worldMatrix;
            this.worldMatrix.premultiply(parentMatrix);
        }

        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].updateMatrix();
        }
    }

    /*
     * get world direction
     * must call after world matrix updated
     */
    Object3D.prototype.getWorldDirection = function() {

        var position = new zen3d.Vector3();
        var quaternion = new zen3d.Quaternion();
        var scale = new zen3d.Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new zen3d.Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, 1).applyQuaternion(quaternion);

            return result;

        };
    }();

    /**
     * raycast
     */
    Object3D.prototype.raycast = function() {
        // implemental by subclass
    }

    zen3d.Object3D = Object3D;
})();
(function() {
    /**
     * Scene
     * @class
     */
    var Scene = function() {
        Scene.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.SCENE;

        this.fog = null;
    }

    zen3d.inherit(Scene, zen3d.Object3D);

    zen3d.Scene = Scene;
})();

(function() {
    /**
     * Fog
     * @class
     */
    var Fog = function(color, near, far) {

        this.fogType = zen3d.FOG_TYPE.NORMAL;

        this.color = new zen3d.Color3( (color !== undefined) ? color : 0x000000 );

        this.near = (near !== undefined) ? near : 1;
        this.far = (far !== undefined) ? far : 1000;
    }

    zen3d.Fog = Fog;
})();
(function() {
    /**
     * FogExp2
     * @class
     */
    var FogExp2 = function(color, density) {

        this.fogType = zen3d.FOG_TYPE.EXP2;

        this.color = new zen3d.Color3( (color !== undefined) ? color : 0x000000 );

        this.density = (density !== undefined) ? density : 0.00025;
    }

    zen3d.FogExp2 = FogExp2;
})();
(function() {
    /**
     * Group
     * @class
     */
    var Group = function() {
        Group.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.GROUP;
    }

    zen3d.inherit(Group, zen3d.Object3D);

    zen3d.Group = Group;
})();

(function() {
    /**
     * Light
     * @class
     */
    var Light = function() {
        Light.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.LIGHT;

        this.lightType = "";

        // default light color is white
        this.color = new zen3d.Color3(0xffffff);

        // light intensity, default 1
        this.intensity = 1;
    }

    zen3d.inherit(Light, zen3d.Object3D);

    zen3d.Light = Light;
})();

(function() {
    /**
     * AmbientLight
     * @class
     */
    var AmbientLight = function() {
        AmbientLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.AMBIENT;
    }

    zen3d.inherit(AmbientLight, zen3d.Light);

    zen3d.AmbientLight = AmbientLight;
})();

(function() {
    /**
     * DirectionalLight
     * @class
     */
    var DirectionalLight = function() {
        DirectionalLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.DIRECT;

        this.shadow = new zen3d.DirectionalLightShadow();
    }

    zen3d.inherit(DirectionalLight, zen3d.Light);

    zen3d.DirectionalLight = DirectionalLight;
})();

(function() {
    /**
     * PointLight
     * @class
     */
    var PointLight = function() {
        PointLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.POINT;

        // decay of this light
        this.decay = 2;

        // distance of this light
        this.distance = 200;

        this.shadow = new zen3d.PointLightShadow();
    }

    zen3d.inherit(PointLight, zen3d.Light);

    zen3d.PointLight = PointLight;
})();

(function() {
    /**
     * SpotLight
     * @class
     */
    var SpotLight = function() {
        SpotLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.SPOT;

        // decay of this light
        this.decay = 2;

        // distance of this light
        this.distance = 200;

        // from 0 to 1
        this.penumbra = 0;

        this.angle = Math.PI / 6;

        this.shadow = new zen3d.SpotLightShadow();
    }

    zen3d.inherit(SpotLight, zen3d.Light);

    zen3d.SpotLight = SpotLight;
})();

(function() {
    /**
     * DirectionalLightShadow
     * @class
     */
    var DirectionalLightShadow = function() {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        var mapSize = new zen3d.Vector2(512, 512);

        this.renderTarget = new zen3d.RenderTarget2D(mapSize.x, mapSize.y);

        var map = this.renderTarget.texture;
        map.generateMipmaps = false;
        map.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.map = map;
        this.mapSize = mapSize;

        this.bias = 0.0003;
	    this.radius = 2;

        // the cast shadow window size
        this.windowSize = 500;

        this._lookTarget = new zen3d.Vector3();

        this._up = new zen3d.Vector3(0, 1, 0);
    }

    /**
     * update by light
     */
    DirectionalLightShadow.prototype.update = function(light) {
        this._updateCamera(light);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    }

    /**
     * update camera matrix by light
     */
    DirectionalLightShadow.prototype._updateCamera = function(light) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;

        // set camera position and lookAt(rotation)
        light.getWorldDirection(this._lookTarget);
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
        camera.setLookAt(lookTarget, this._up);

        // update view matrix
        camera.updateMatrix(); // just copy matrix to world matrix
        camera.viewMatrix.getInverse(camera.worldMatrix);

        // update projection
        var halfWindowSize = this.windowSize / 2;
        camera.setOrtho(-halfWindowSize, halfWindowSize, -halfWindowSize, halfWindowSize, 1, 1000);
    }

    /**
     * update shadow matrix
     */
    DirectionalLightShadow.prototype._updateMatrix = function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    }

    zen3d.DirectionalLightShadow = DirectionalLightShadow;
})();
(function() {
    /**
     * SpotLightShadow
     * @class
     */
    var SpotLightShadow = function() {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        var mapSize = new zen3d.Vector2(512, 512);

        this.renderTarget = new zen3d.RenderTarget2D(mapSize.x, mapSize.y);

        var map = this.renderTarget.texture;
        map.generateMipmaps = false;
        map.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.map = map;
        this.mapSize = mapSize;

        this.bias = 0.0003;
	    this.radius = 2;

        this._lookTarget = new zen3d.Vector3();

        this._up = new zen3d.Vector3(0, 1, 0);
    }

    /**
     * update by light
     */
    SpotLightShadow.prototype.update = function(light) {
        this._updateCamera(light);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    }

    /**
     * update camera matrix by light
     */
    SpotLightShadow.prototype._updateCamera = function(light) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;

        // set camera position and lookAt(rotation)
        light.getWorldDirection(this._lookTarget);
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
        camera.setLookAt(lookTarget, this._up);

        // update view matrix
        camera.updateMatrix(); // just copy matrix to world matrix
        camera.viewMatrix.getInverse(camera.worldMatrix);

        // update projection
        // TODO distance should be custom?
        camera.setPerspective(light.angle * 2, 1, 1, 1000);
    }

    /**
     * update shadow matrix
     */
    SpotLightShadow.prototype._updateMatrix = function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    }

    zen3d.SpotLightShadow = SpotLightShadow;
})();
(function() {
    /**
     * PointLightShadow
     * @class
     */
    var PointLightShadow = function() {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        var mapSize = new zen3d.Vector2(512, 512);

        this.renderTarget = new zen3d.RenderTargetCube(mapSize.x, mapSize.y);

        var map = this.renderTarget.texture;
        map.generateMipmaps = false;
        map.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.map = map;
        this.mapSize = mapSize;

        this.bias = 0.0003;
	    this.radius = 2;

        this._targets = [
            new zen3d.Vector3(1, 0, 0), new zen3d.Vector3(-1, 0, 0), new zen3d.Vector3(0, 1, 0),
            new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, 0, 1), new zen3d.Vector3(0, 0, -1)
        ];

        this._ups = [
            new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, 0, 1),
            new zen3d.Vector3(0, 0, -1), new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, -1, 0)
        ];

        this._lookTarget = new zen3d.Vector3();
    }

    /**
     * update by light
     */
    PointLightShadow.prototype.update = function(light, face) {
        this._updateCamera(light, face);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    }

    /**
     * update camera matrix by light
     */
    PointLightShadow.prototype._updateCamera = function(light, face) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;
        var targets = this._targets;
        var ups = this._ups;

        // set camera position and lookAt(rotation)
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(targets[face].x + camera.position.x, targets[face].y + camera.position.y, targets[face].z + camera.position.z);
        camera.setLookAt(lookTarget, ups[face]);

        // update view matrix
        camera.updateMatrix(); // just copy matrix to world matrix
        camera.viewMatrix.getInverse(camera.worldMatrix);

        // update projection
        camera.setPerspective(90 / 180 * Math.PI, 1, 1, 1000);
    }

    /**
     * update shadow matrix
     */
    PointLightShadow.prototype._updateMatrix = function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    }

    zen3d.PointLightShadow = PointLightShadow;
})();
(function() {
    /**
     * Camera
     * @class
     */
    var Camera = function() {
        Camera.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.CAMERA;

        // view matrix
        this.viewMatrix = new zen3d.Matrix4();

        // projection matrix
        this.projectionMatrix = new zen3d.Matrix4();
    }

    zen3d.inherit(Camera, zen3d.Object3D);

    /**
     * set view by look at, this func will set quaternion of this camera
     */
    Camera.prototype.setLookAt = function(target, up) {
        var eye = this.position;

        var zaxis = new zen3d.Vector3();
        eye.subtract(target, zaxis); // right-hand coordinates system
        zaxis.normalize();

        var xaxis = new zen3d.Vector3();
        xaxis.crossVectors(up, zaxis);
        xaxis.normalize();

        var yaxis = new zen3d.Vector3();
        yaxis.crossVectors(zaxis, xaxis);

        this.quaternion.setFromRotationMatrix(zen3d.helpMatrix.set(
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1
        ));
    }

    /**
     * set orthographic projection matrix
     */
    Camera.prototype.setOrtho = function(left, right, bottom, top, near, far) {
        this.projectionMatrix.set(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        );
    }

    /**
     * set perspective projection matrix
     */
    Camera.prototype.setPerspective = function(fov, aspect, near, far) {
        this.projectionMatrix.set(
            1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
            0, 1 / (Math.tan(fov / 2)), 0, 0,
            0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
            0, 0, -1, 0
        );
    }

    /*
     * get world direction (override)
     * must call after world matrix updated
     */
    Camera.prototype.getWorldDirection = function() {

        var position = new zen3d.Vector3();
        var quaternion = new zen3d.Quaternion();
        var scale = new zen3d.Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new zen3d.Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, -1).applyQuaternion(quaternion);

            return result;

        };
    }();

    zen3d.Camera = Camera;
})();
(function() {
    /**
     * Mesh
     * @class
     */
    var Mesh = function(geometry, material) {
        Mesh.superClass.constructor.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = zen3d.OBJECT_TYPE.MESH;
    }

    zen3d.inherit(Mesh, zen3d.Object3D);

    // override
    Mesh.prototype.raycast = function() {
        var sphere = new zen3d.Sphere();
        var box = new zen3d.Box3();
        var inverseMatrix = new zen3d.Matrix4();
        var ray = new zen3d.Ray();

        var barycoord = new zen3d.Vector3();

        var vA = new zen3d.Vector3();
        var vB = new zen3d.Vector3();
        var vC = new zen3d.Vector3();

        var uvA = new zen3d.Vector2();
        var uvB = new zen3d.Vector2();
        var uvC = new zen3d.Vector2();

        var intersectionPoint = new zen3d.Vector3();
        var intersectionPointWorld = new zen3d.Vector3();

        function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
            zen3d.Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);

            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);

            uv1.add(uv2).add(uv3);

            return uv1.clone();
        }

        function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
            var intersect;
            var material = object.material;

            // if (material.side === BackSide) {
            //     intersect = ray.intersectTriangle(pC, pB, pA, true, point);
            // } else {
                // intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DoubleSide, point);
            // }
            intersect = ray.intersectTriangle(pC, pB, pA, true, point);

            if (intersect === null) return null;

            intersectionPointWorld.copy(point);
            intersectionPointWorld.applyMatrix4(object.worldMatrix);

            var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);

            if (distance < raycaster.near || distance > raycaster.far) return null;

            return {
                distance: distance,
                point: intersectionPointWorld.clone(),
                object: object
            };
        }

        return function raycast(raycaster, intersects) {
            var geometry = this.geometry;
            var worldMatrix = this.worldMatrix;

            // sphere test
            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(worldMatrix);
            if (!raycaster.ray.intersectsSphere(sphere)) {
                return;
            }

            // box test
            box.copy(geometry.boundingBox);
            box.applyMatrix4(worldMatrix);
            if (!raycaster.ray.intersectsBox(box)) {
                return;
            }

            // vertex test
            inverseMatrix.getInverse(worldMatrix);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

            var index = geometry.indicesArray;
            var vertex = geometry.verticesArray;
            var a, b, c;

            for (var i = 0; i < index.length; i += 3) {
                a = index[i];
                b = index[i + 1];
                c = index[i + 2];

                vA.fromArray(vertex, a * geometry.vertexSize);
                vB.fromArray(vertex, b * geometry.vertexSize);
                vC.fromArray(vertex, c * geometry.vertexSize);

                var intersection = checkIntersection(this, raycaster, ray, vA, vB, vC, intersectionPoint);

                if (intersection) {
                    // uv
                    uvA.fromArray(vertex, a * geometry.vertexSize + 13);
                    uvB.fromArray(vertex, b * geometry.vertexSize + 13);
                    uvC.fromArray(vertex, c * geometry.vertexSize + 13);

                    intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);

                    intersection.face = [a, b, c];
                    intersection.faceIndex = a;

                    intersects.push(intersection);
                }
            }
        }
    }()

    zen3d.Mesh = Mesh;
})();
(function() {
    /**
     * SkinnedMesh
     * @class
     */
    var SkinnedMesh = function(geometry, material) {
        SkinnedMesh.superClass.constructor.call(this, geometry, material);

        this.type = zen3d.OBJECT_TYPE.SKINNED_MESH;

        this.skeleton = undefined;
    }

    zen3d.inherit(SkinnedMesh, zen3d.Mesh);

    SkinnedMesh.prototype.updateMatrix = function() {
        SkinnedMesh.superClass.updateMatrix.call(this);

        if(this.skeleton) {
            this.skeleton.updateBones();
        }
    }

    zen3d.SkinnedMesh = SkinnedMesh;
})();

(function() {
    /**
     * Points
     * @class
     */
    var Points = function(geometry, material) {
        Points.superClass.constructor.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = zen3d.OBJECT_TYPE.POINT;
    }

    zen3d.inherit(Points, zen3d.Object3D);

    zen3d.Points = Points;
})();

(function() {
    /**
     * Line
     * @class
     */
    var Line = function(geometry, material) {
        Line.superClass.constructor.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = zen3d.OBJECT_TYPE.LINE;
    }

    zen3d.inherit(Line, zen3d.Object3D);

    /**
     * raycast
     */
    Line.prototype.raycast = function() {
        // TODO
    }

    zen3d.Line = Line;
})();

(function() {
    /**
     * LineLoop
     * @class
     */
    var LineLoop = function(geometry, material) {
        LineLoop.superClass.constructor.call(this, geometry, material);

        this.type = zen3d.OBJECT_TYPE.LINE_LOOP;
    }

    zen3d.inherit(LineLoop, zen3d.Line);

    zen3d.LineLoop = LineLoop;
})();

(function() {
    /**
     * LineSegments
     * @class
     */
    var LineSegments = function(geometry, material) {
        LineSegments.superClass.constructor.call(this, geometry, material);

        this.type = zen3d.OBJECT_TYPE.LINE_SEGMENTS;
    }

    zen3d.inherit(LineSegments, zen3d.Line);

    zen3d.LineSegments = LineSegments;
})();
(function() {

    // all sprites used one shared geometry
    var sharedGeometry = new zen3d.Geometry();
    sharedGeometry.verticesArray = [-0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1, -0.5, 0.5, 0, 1
    ];
    sharedGeometry.indicesArray = [
        0, 1, 2,
        0, 2, 3
    ];
    sharedGeometry.vertexSize = 4;
    sharedGeometry.vertexFormat = {
        "position": {size: 2, normalized: false, stride: 4, offset: 0},
        "uv": {size: 2, normalized: false, stride: 4, offset: 2}
    };

    /**
     * Sprite
     * @class
     */
    var Sprite = function(material) {
        Sprite.superClass.constructor.call(this);

        this.geometry = sharedGeometry;

        this.material = (material !== undefined) ? material : new zen3d.SpriteMaterial();

        this.type = zen3d.OBJECT_TYPE.SPRITE;
    }

    zen3d.inherit(Sprite, zen3d.Object3D);

    Sprite.geometry = sharedGeometry;

    zen3d.Sprite = Sprite;
})();
(function() {

    // construct a couple small arrays used for packing variables into floats etc
	var UINT8_VIEW = new Uint8Array(4);
	var FLOAT_VIEW = new Float32Array(UINT8_VIEW.buffer);

	function decodeFloat(x, y, z, w) {
		UINT8_VIEW[0] = Math.floor(w);
		UINT8_VIEW[1] = Math.floor(z);
		UINT8_VIEW[2] = Math.floor(y);
		UINT8_VIEW[3] = Math.floor(x);
		return FLOAT_VIEW[0];
	}

	/*
	 * a particle container
	 * reference three.js - flimshaw - Charlie Hoey - http://charliehoey.com
	 */
    var ParticleContainer = function(options) {
        ParticleContainer.superClass.constructor.call(this);

        var options = options || {};

        this.maxParticleCount = options.maxParticleCount || 10000;
        this.particleNoiseTex = options.particleNoiseTex || null;
        this.particleSpriteTex = options.particleSpriteTex || null;

        this.geometry = new zen3d.Geometry();
        var vertices = this.geometry.verticesArray = [];
        for(var i = 0; i < this.maxParticleCount; i++) {
            vertices[i * 8 + 0] = 100                        ; //x
            vertices[i * 8 + 1] = 0                          ; //y
            vertices[i * 8 + 2] = 0                          ; //z
            vertices[i * 8 + 3] = 0.0                        ; //startTime
            vertices[i * 8 + 4] = decodeFloat(128, 128, 0, 0); //vel
            vertices[i * 8 + 5] = decodeFloat(0, 254, 0, 254); //color
            vertices[i * 8 + 6] = 1.0                        ; //size
            vertices[i * 8 + 7] = 0.0                        ; //lifespan
        }
        this.geometry.vertexSize = 8;
		this.geometry.vertexFormat = {
            "particlePositionsStartTime": {size: 4, normalized: false, stride: 8, offset: 0},
            "particleVelColSizeLife": {size: 4, normalized: false, stride: 8, offset: 4}
        };
		this.geometry.usageType = zen3d.WEBGL_BUFFER_USAGE.DYNAMIC_DRAW;

        this.particleCursor = 0;
        this.time = 0;

        this.type = zen3d.OBJECT_TYPE.PARTICLE;

		this.material = new zen3d.ParticleMaterial();
    }

    zen3d.inherit(ParticleContainer, zen3d.Object3D);

    var position = new zen3d.Vector3();
    var velocity = new zen3d.Vector3();
    var positionRandomness = 0;
    var velocityRandomness = 0;
    var color = new zen3d.Color3();
	var colorRandomness = 0;
	var turbulence = 0;
	var lifetime = 0;
	var size = 0;
	var sizeRandomness = 0;
	var smoothPosition = false;

    var maxVel = 2;
	var maxSource = 250;

    ParticleContainer.prototype.spawn = function(options) {
        var options = options || {};

        position = options.position !== undefined ? position.copy(options.position) : position.set(0., 0., 0.);
        velocity = options.velocity !== undefined ? velocity.copy(options.velocity) : velocity.set(0., 0., 0.);
        positionRandomness = options.positionRandomness !== undefined ? options.positionRandomness : 0.0;
        velocityRandomness = options.velocityRandomness !== undefined ? options.velocityRandomness : 0.0;
        color = options.color !== undefined ? color.copy(options.color) : color.setRGB(1, 1, 1);
		colorRandomness = options.colorRandomness !== undefined ? options.colorRandomness : 1.0;
		turbulence = options.turbulence !== undefined ? options.turbulence : 1.0;
		lifetime = options.lifetime !== undefined ? options.lifetime : 5.0;
		size = options.size !== undefined ? options.size : 10;
		sizeRandomness = options.sizeRandomness !== undefined ? options.sizeRandomness : 0.0;

        var cursor = this.particleCursor;
        var vertices = this.geometry.verticesArray;
        var vertexSize = this.geometry.vertexSize;

        vertices[cursor * vertexSize + 0] = position.x + (Math.random() - 0.5) * positionRandomness; //x
        vertices[cursor * vertexSize + 1] = position.y + (Math.random() - 0.5) * positionRandomness; //y
        vertices[cursor * vertexSize + 2] = position.z + (Math.random() - 0.5) * positionRandomness; //z
        vertices[cursor * vertexSize + 3] = this.time + (Math.random() - 0.5) * 2e-2; //startTime

        var velX = velocity.x + (Math.random() - 0.5) * velocityRandomness;
        var velY = velocity.y + (Math.random() - 0.5) * velocityRandomness;
        var velZ = velocity.z + (Math.random() - 0.5) * velocityRandomness;

        // convert turbulence rating to something we can pack into a vec4
		var turbulence = Math.floor(turbulence * 254);

        // clamp our value to between 0. and 1.
		velX = Math.floor(maxSource * ((velX - -maxVel) / (maxVel - -maxVel)));
		velY = Math.floor(maxSource * ((velY - -maxVel) / (maxVel - -maxVel)));
		velZ = Math.floor(maxSource * ((velZ - -maxVel) / (maxVel - -maxVel)));

        vertices[cursor * vertexSize + 4] = decodeFloat(velX, velY, velZ, turbulence); //velocity

        var r = color.r * 254 + (Math.random() - 0.5) * colorRandomness * 254;
        var g = color.g * 254 + (Math.random() - 0.5) * colorRandomness * 254;
        var b = color.b * 254 + (Math.random() - 0.5) * colorRandomness * 254;
        if(r > 254) r = 254;
        if(r < 0) r = 0;
        if(g > 254) g = 254;
        if(g < 0) g = 0;
        if(b > 254) b = 254;
        if(b < 0) b = 0;
        vertices[cursor * vertexSize + 5] = decodeFloat(r, g, b, 254); //color

        vertices[cursor * vertexSize + 6] = size + (Math.random() - 0.5) * sizeRandomness; //size

        vertices[cursor * vertexSize + 7] = lifetime; //lifespan

        this.particleCursor++;

        if(this.particleCursor >= this.maxParticleCount) {
            this.particleCursor = 0;
			this.geometry.dirty = true;
			this.geometry.dirtyRange.enable = false;
			this.geometry.dirtyRange.start = 0;
			this.geometry.dirtyRange.count = 0;
        } else {
			this.geometry.dirty = true;
			if(this.geometry.dirtyRange.enable) {
				this.geometry.dirtyRange.count = this.particleCursor * vertexSize - this.geometry.dirtyRange.start;
			} else {
				this.geometry.dirtyRange.enable = true;
				this.geometry.dirtyRange.start = cursor * vertexSize;
				this.geometry.dirtyRange.count = vertexSize;
			}

		}


    }

    ParticleContainer.prototype.update = function(time) {
        this.time = time;
    }

	zen3d.ParticleContainer = ParticleContainer;
})();
(function() {
    // Bone acturely is a joint
    // the position means joint position
    // mesh transform is based this joint space
    var Bone = function() {
        Bone.superClass.constructor.call(this);

        this.type = "bone";

        // the origin offset matrix
        // the inverse matrix of origin transform matrix
        this.offsetMatrix = new zen3d.Matrix4();
    }

    zen3d.inherit(Bone, zen3d.Object3D);

    zen3d.Bone = Bone;
})();
(function() {
    // extends from Object3D only for use the updateMatrix method
    // so all bones should be the children of skeleton
    // like this:
    // Skeleton
    //    |-- Bone
    //    |    |-- Bone
    //    |    |-- Bone
    //    |         |
    //    |         |--Bone
    //    |         |--Bone
    //    |
    //    |-- Bone
    //    |-- Bone
    var Skeleton = function(bones) {
        Skeleton.superClass.constructor.call(this);

        this.type = "skeleton";

        // bones in array
        this.bones = bones || [];

        // bone matrices data
        this.boneMatrices = new Float32Array(16 * this.bones.length);

        // use vertex texture to update boneMatrices
        // by that way, we can use more bones on phone
        this.boneTexture = undefined;
        this.boneTextureSize = 0;
    }

    zen3d.inherit(Skeleton, zen3d.Object3D);

    var offsetMatrix = new zen3d.Matrix4();

    Skeleton.prototype.updateBones = function() {
        // the world matrix of bones, is based skeleton
        this.updateMatrix();

        for(var i = 0; i < this.bones.length; i++) {
            var bone = this.bones[i];
            offsetMatrix.multiplyMatrices(bone.worldMatrix, bone.offsetMatrix);
            offsetMatrix.toArray(this.boneMatrices, i * 16);
        }

        if (this.boneTexture !== undefined) {
			this.boneTexture.version++;
		}
    }

    zen3d.Skeleton = Skeleton;
})();
(function() {
    var KeyframeData = function() {
        this._keys = [];
        this._values = [];
    }

    KeyframeData.prototype.addFrame = function(key, value) {
        this._keys.push(key);
        this._values.push(value);
    }

    KeyframeData.prototype.removeFrame = function(key) {
        var index = this.keys.indexOf(key);
        if (index > -1) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
        }
    }

    KeyframeData.prototype.clearFrame = function() {
        this._keys.length = 0;
        this._values.length = 0;
    }

    KeyframeData.prototype.sortFrame = function() {
        // TODO
    }

    // return a frame range between two key frames
    // return type: {key1: 0, value1: 0, key2: 0, value2: 0}
    KeyframeData.prototype.getRange = function(t, result) {
        var lastIndex = this._getLastKeyIndex(t);

        var key1 = this._keys[lastIndex];
        var key2 = this._keys[lastIndex + 1];
        var value1 = this._values[lastIndex];
        var value2 = this._values[lastIndex + 1];

        result = result || {key1: 0, value1: 0, key2: 0, value2: 0};

        result.key1 = key1;
        result.key2 = key2;
        result.value1 = value1;
        result.value2 = value2;

        return result;
    }

    KeyframeData.prototype._getLastKeyIndex = function(t) {
        var lastKeyIndex = 0;
        var i, l = this._keys.length;
        for(i = 0; i < l; i++) {
            if(t >= this._keys[i]) {
                lastKeyIndex = i;
            }
        }
        return lastKeyIndex;
    }

    zen3d.KeyframeData = KeyframeData;
})();
(function() {

    var range = {key1: 0, value1: 0, key2: 0, value2: 0};

    /*
     * KeyframeTrack
     * used for number property track
     */
    var KeyframeTrack = function(target, propertyPath) {

        this.target = undefined;
        this.path = undefined;

        this.bind(target, propertyPath);

        this.data = new zen3d.KeyframeData();

        this._frame = 0;

        this.interpolant = true;
    }

    KeyframeTrack.prototype.bind = function(target, propertyPath) {
        propertyPath = propertyPath.split(".");

        if (propertyPath.length > 1) {
            var property = target[propertyPath[0]];


            for (var index = 1; index < propertyPath.length - 1; index++) {
                property = property[propertyPath[index]];
            }

            this.path = propertyPath[propertyPath.length - 1];
            this.target = property;
        } else {
            this.path = propertyPath[0];
            this.target = target;
        }
    }

    Object.defineProperties(KeyframeTrack.prototype, {
        frame: {
            get: function() {
                return this._frame;
            },
            set: function(t) {
                // TODO should not out of range
                this._frame = t;
                this._updateValue(t);
            }
        }
    });

    KeyframeTrack.prototype._updateValue = function(t) {
        this.data.getRange(t, range);

        var key1 = range.key1;
        var key2 = range.key2;
        var value1 = range.value1;
        var value2 = range.value2;

        if(this.interpolant) {
            if(value1 !== undefined && value2 !== undefined) {
                var ratio = (t - key1) / (key2 - key1);
                this.target[this.path] = (value2 - value1) * ratio + value1;
            } else {
                this.target[this.path] = value1;
            }
        } else {
            this.target[this.path] = value1;
        }
    }

    zen3d.KeyframeTrack = KeyframeTrack;
})();
(function() {

    var range = {key1: 0, value1: 0, key2: 0, value2: 0};

    /**
     * QuaternionKeyframeTrack
     * used for vector property track
     */
    var QuaternionKeyframeTrack = function(target, propertyPath) {
        QuaternionKeyframeTrack.superClass.constructor.call(this, target, propertyPath);
    }

    zen3d.inherit(QuaternionKeyframeTrack, zen3d.KeyframeTrack);

    QuaternionKeyframeTrack.prototype._updateValue = function(t) {
        this.data.getRange(t, range);

        var key1 = range.key1;
        var key2 = range.key2;
        var value1 = range.value1;
        var value2 = range.value2;

        if(this.interpolant) {
            if(value1 !== undefined && value2 !== undefined) {
                var ratio = (t - key1) / (key2 - key1);
                this.target[this.path].slerpQuaternions(value1, value2, ratio);
            } else {
                this.target[this.path].copy(value1);
            }
        } else {
            this.target[this.path].copy(value1);
        }
    }

    zen3d.QuaternionKeyframeTrack = QuaternionKeyframeTrack;
})();
(function() {

    var range = {key1: 0, value1: 0, key2: 0, value2: 0};
    
    /**
     * VectorKeyframeTrack
     * used for vector property track
     */
    var VectorKeyframeTrack = function(target, propertyPath) {
        VectorKeyframeTrack.superClass.constructor.call(this, target, propertyPath);
    }

    zen3d.inherit(VectorKeyframeTrack, zen3d.KeyframeTrack);

    VectorKeyframeTrack.prototype._updateValue = function(t) {
        this.data.getRange(t, range);

        var key1 = range.key1;
        var key2 = range.key2;
        var value1 = range.value1;
        var value2 = range.value2;

        if(this.interpolant) {
            if(value1 !== undefined && value2 !== undefined) {
                var ratio = (t - key1) / (key2 - key1);
                this.target[this.path].lerpVectors(value1, value2, ratio);
            } else {
                this.target[this.path].copy(value1);
            }
        } else {
            this.target[this.path].copy(value1);
        }
    }

    zen3d.VectorKeyframeTrack = VectorKeyframeTrack;
})();
(function() {

    var range = {key1: 0, value1: 0, key2: 0, value2: 0};

    /**
     * ColorKeyframeTrack
     * used for color property track
     */
    var ColorKeyframeTrack = function(target, propertyPath) {
        ColorKeyframeTrack.superClass.constructor.call(this, target, propertyPath);
    }

    zen3d.inherit(ColorKeyframeTrack, zen3d.KeyframeTrack);

    ColorKeyframeTrack.prototype._updateValue = function(t) {
        this.data.getRange(t, range);

        var key1 = range.key1;
        var key2 = range.key2;
        var value1 = range.value1;
        var value2 = range.value2;

        if(this.interpolant) {
            if(value1 !== undefined && value2 !== undefined) {
                var ratio = (t - key1) / (key2 - key1);
                this.target[this.path].lerpColors(value1, value2, ratio);
            } else {
                this.target[this.path].copy(value1);
            }
        } else {
            this.target[this.path].copy(value1);
        }
    }

    zen3d.ColorKeyframeTrack = ColorKeyframeTrack;
})();
(function() {
    var KeyframeClip = function(name) {
        this.name = name || "";

        this.tracks = [];

        this.loop = true;

        this.startFrame = 0;

        this.endFrame = 0;

        this.frame = 0;
    }

    KeyframeClip.prototype.update = function(t) {
        this.frame += t;

        if(this.frame > this.endFrame) {
            if(this.loop) {
                this.frame = this.startFrame;
            } else {
                this.frame = this.endFrame;
            }
        }

        this.setFrame(this.frame);
    }

    KeyframeClip.prototype.setFrame = function(frame) {
        for(var i = 0, l = this.tracks.length; i < l; i++) {
            this.tracks[i].frame = frame;
        }

        this.frame = frame;
    }

    zen3d.KeyframeClip = KeyframeClip;
})();
(function() {
    var KeyframeAnimation = function() {
        this._clips = {};

        this._currentClipName = "";
    }

    Object.defineProperties(KeyframeAnimation.prototype, {
        currentClipName: {
            get: function() {
                return this._currentClipName;
            }
        },
        currentClip: {
            get: function() {
                return this._clips[this._currentClipName];
            }
        }
    });

    KeyframeAnimation.prototype.add = function(clip) {
        this._clips[clip.name] = clip;
    }

    KeyframeAnimation.prototype.remove = function(clip) {
        delete this._clips[clip.name];
    }

    KeyframeAnimation.prototype.update = function(t) {
        var currentClip = this._clips[this._currentClipName];
        if(currentClip) {
            currentClip.update(t);
        }
    }

    KeyframeAnimation.prototype.active = function(name) {
        var clip = this._clips[name];
        if(clip) {
            this._currentClipName = name;
            clip.setFrame(clip.startFrame);// restore
        } else {
            console.warn("KeyframeAnimation: try to active a undefind clip!");
        }
    }

    // return all clip names of this animation
    KeyframeAnimation.prototype.getAllClipNames = function() {
        var array = [];
        for(var key in this._clips) {
            array.push(key);
        }
        return array;
    }

    zen3d.KeyframeAnimation = KeyframeAnimation;
})();
(function() {
    /**
     * AssimpJsonLoader
     * @class
     *
     * Loader for models imported with Open Asset Import Library (http://assimp.sf.net)
     * through assimp2json (https://github.com/acgessler/assimp2json).
     *
     * Supports any input format that assimp supports, including 3ds, obj, dae, blend,
     * fbx, x, ms3d, lwo (and many more).
     */
    var AssimpJsonLoader = function() {
        this.texturePath = "./";
    }

    AssimpJsonLoader.prototype.load = function(url, onLoad, onProgress, onError) {
        this.texturePath = this.extractUrlBase(url);

        var loader = new zen3d.FileLoader();
        loader.setResponseType("json").load(url, function(json) {
            var result = this.parse(json);
            onLoad(result.object, result.animation);
        }.bind(this), onProgress, onError);
    }

    AssimpJsonLoader.prototype.parseNodeTree = function(node) {
        var object = new zen3d.Object3D();
        object.name = node.name;

        // save local matrix
        object.matrix.fromArray(node.transformation).transpose();

        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                var child = this.parseNodeTree(node.children[i]);

                object.add(child);
            }
        }

        return object;
    }

    AssimpJsonLoader.prototype.cloneNodeToBones = function(node, boneMap) {
        var bone = new zen3d.Bone();
        bone.name = node.name;
        bone.matrix.copy(node.matrix);
        bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);

        if (!boneMap[node.name]) {
            boneMap[node.name] = [];
        }
        boneMap[node.name].push(bone);

        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                var child = this.cloneNodeToBones(node.children[i], boneMap);
                bone.add(child);
            }
        }

        return bone;
    }

    AssimpJsonLoader.prototype.parseSkeleton = function(meshName, bonesInfo, nodeTree, boneMap) {
        var meshParents = [];
        var mesh = nodeTree.getObjectByName(meshName);
        while (mesh.parent) {
            meshParents.push(mesh.parent.name);
            mesh = mesh.parent;
        }
        meshParents.push(mesh);

        // mark all of its parents as root until 1) find the mesh's node or 2) the parent of the mesh's node
        function getRoot(name) {
            var node = nodeTree.getObjectByName(name);
            var parent;
            var breaked = false;
            while (node.parent) {
                parent = node.parent;

                if (meshParents.indexOf(parent.name) > -1) {
                    break;
                } else {
                    node = parent;
                }
            }
            return node.name;
        }

        var allbones = [];
        var rootBones = [];

        var skeleton;

        var rootNode = nodeTree.getObjectByName(getRoot(bonesInfo[0].name));
        var rootBone = this.cloneNodeToBones(rootNode, boneMap);
        rootBones.push(rootBone);

        for (var i = 0; i < bonesInfo.length; i++) {
            var boneInfo = bonesInfo[i];

            // get bone & push
            var bone = rootBone.getObjectByName(boneInfo.name);

            if (!bone) {
                rootNode = nodeTree.getObjectByName(boneInfo.name);
                rootBone = this.cloneNodeToBones(rootNode, boneMap);
                rootBones.push(rootBone);
                bone = rootBone.getObjectByName(boneInfo.name);
            }

            var offset = bonesInfo[i].offsetmatrix;
            bone.offsetMatrix.fromArray(offset).transpose();

            allbones.push(bone);
        }

        // generate skeleton
        skeleton = new zen3d.Skeleton(allbones);
        for (var i = 0; i < rootBones.length; i++) {
            skeleton.add(rootBones[i]);
        }

        return skeleton;
    }

    AssimpJsonLoader.prototype.parseAnimations = function(json, boneMap) {
        var animation = new zen3d.KeyframeAnimation();

        for (var i = 0; i < json.length; i++) {
            var anim = json[i];
            var name = anim.name;
            var channels = anim.channels;

            var startFrame = 0;
            var endFrame = 0;

            var clip = new zen3d.KeyframeClip(name);

            for (var j = 0; j < channels.length; j++) {
                var channel = channels[j];
                var boneName = channel.name;

                if (!boneMap[boneName]) {
                    console.log(boneName)
                    continue;
                }

                for (var k = 0; k < boneMap[boneName].length; k++) {
                    var bone = boneMap[boneName][k];

                    var positionTrack = new zen3d.VectorKeyframeTrack(bone, "position");
                    for (var k = 0; k < channel.positionkeys.length; k++) {
                        var frame = channel.positionkeys[k];
                        positionTrack.data.addFrame(frame[0], new zen3d.Vector3(frame[1][0], frame[1][1], frame[1][2]));
                        if (frame[0] > endFrame) {
                            endFrame = frame[0];
                        }
                    }
                    clip.tracks.push(positionTrack);

                    var rotationTrack = new zen3d.QuaternionKeyframeTrack(bone, "quaternion");
                    for (var k = 0; k < channel.rotationkeys.length; k++) {
                        var frame = channel.rotationkeys[k];
                        rotationTrack.data.addFrame(frame[0], new zen3d.Quaternion(frame[1][1], frame[1][2], frame[1][3], frame[1][0]));
                        if (frame[0] > endFrame) {
                            endFrame = frame[0];
                        }
                    }
                    clip.tracks.push(rotationTrack);

                    var scalingTrack = new zen3d.VectorKeyframeTrack(bone, "scale");
                    for (var k = 0; k < channel.scalingkeys.length; k++) {
                        var frame = channel.scalingkeys[k];
                        scalingTrack.data.addFrame(frame[0], new zen3d.Vector3(frame[1][0], frame[1][1], frame[1][2]));
                        if (frame[0] > endFrame) {
                            endFrame = frame[0];
                        }
                    }
                    clip.tracks.push(scalingTrack);
                }
            }

            clip.startFrame = startFrame;
            clip.endFrame = endFrame;
            clip.loop = true; // force

            animation.add(clip);
        }

        return animation;
    }

    AssimpJsonLoader.prototype.parse = function(json) {
        var nodeTree = this.parseNodeTree(json.rootnode);

        var meshes = this.parseList(json.meshes, this.parseMesh);
        var materials = this.parseList(json.materials, this.parseMaterial);

        var boneMap = {};

        var skeletons = {};
        for (var i = 0; i < json.meshes.length; i++) {
            if (json.meshes[i].bones) {
                skeletons[i] = this.parseSkeleton(json.meshes[i].name, json.meshes[i].bones, nodeTree, boneMap);
            }
        }

        // animation
        var animation;
        if (json.animations) {
            animation = this.parseAnimations(json.animations, boneMap);
        }

        return {
            object: this.parseObject(json, json.rootnode, meshes, materials, skeletons),
            animation: animation
        };
    }

    AssimpJsonLoader.prototype.parseList = function(json, handler) {
        var arrays = new Array(json.length);
        for (var i = 0; i < json.length; ++i) {

            arrays[i] = handler.call(this, json[i]);

        }
        return arrays;
    }

    AssimpJsonLoader.prototype.parseMaterial = function(json) {
        var material = new zen3d.PhongMaterial();

        var diffuseMap = null;
        var normalMap = null;

        var prop = json.properties;

        for (var key in json.properties) {
            prop = json.properties[key];

            if (prop.key === '$tex.file') {
                // prop.semantic gives the type of the texture
                // 1: diffuse
                // 2: specular map
                // 3: ambient map
                // 4: emissive map
                // 5: height map (bumps)
                // 6: normal map
                // 7: shininess(glow) map
                // 8: opacity map
                // 9: displacement map
                // 10: light map
                // 11: reflection map
                // 12: unknown map
                if (prop.semantic == 1) {
                    var material_url = this.texturePath + prop.value;
                    material_url = material_url.replace(/.\\/g, '');
                    diffuseMap = new zen3d.Texture2D.fromSrc(material_url);
                    // TODO: read texture settings from assimp.
                    // Wrapping is the default, though.
                    diffuseMap.wrapS = diffuseMap.wrapT = zen3d.WEBGL_TEXTURE_WRAP.REPEAT;
                } else if (prop.semantic == 2) {

                } else if (prop.semantic == 5) {

                } else if (prop.semantic == 6) {
                    var material_url = this.texturePath + prop.value;
                    material_url = material_url.replace(/.\\/g, '');
                    normalMap = new zen3d.Texture2D.fromSrc(material_url);
                    // TODO: read texture settings from assimp.
                    // Wrapping is the default, though.
                    normalMap.wrapS = normalMap.wrapT = zen3d.WEBGL_TEXTURE_WRAP.REPEAT;
                }
            } else if (prop.key === '?mat.name') {

            } else if(prop.key === '$clr.ambient') {

            } else if (prop.key === '$clr.diffuse') {
                var value = prop.value;
                material.diffuse.setRGB(value[0], value[1], value[2]);
            } else if (prop.key === '$clr.specular') {
                var value = prop.value;
                material.specular.setRGB(value[0], value[1], value[2]);
            } else if (prop.key === '$clr.emissive') {
                var value = prop.value;
                material.emissive.setRGB(value[0], value[1], value[2]);
            } else if (prop.key === '$mat.opacity') {
                material.transparent = prop.value < 1;
                material.opacity = prop.value;
            } else if (prop.key === '$mat.shadingm') {
                // Flat shading?
                if (prop.value === 1) {

                }
            } else if (prop.key === '$mat.shininess') {
                material.shininess = prop.value;
            }
        }

        material.diffuseMap = diffuseMap;
        material.normalMap = normalMap;

        return material;
    }

    AssimpJsonLoader.prototype.parseMesh = function(json) {
        var geometry = new zen3d.Geometry();

        var faces = json.faces;
        var vertices = json.vertices;
        var normals = json.normals;
        var texturecoords = json.texturecoords && json.texturecoords[0];
        var verticesCount = vertices.length / 3;
        var g_v = geometry.verticesArray;

        // bones
        var bones = json.bones;
        var bind = [];
        if (bones) {
            for (var i = 0; i < verticesCount; i++) {
                bind[i] = [];
            }

            var bone, name, offset, weights, weight;
            for (var i = 0; i < bones.length; i++) {
                bone = bones[i];
                name = bone.name;
                offset = bone.offsetmatrix;
                weights = bone.weights;
                for (var j = 0; j < weights.length; j++) {
                    weight = weights[j];
                    bind[weight[0]].push({
                        index: i,
                        weight: weight[1]
                    });
                }
            }

            // every vertex bind 4 bones
            for (var i = 0; i < verticesCount; i++) {
                var ver = bind[i];

                ver.sort(function(a, b) {
                    return b.weight - a.weight;
                });

                // identify
                var w1 = ver[0] ? ver[0].weight : 0;
                var w2 = ver[1] ? ver[1].weight : 0;
                var w3 = ver[2] ? ver[2].weight : 0;
                var w4 = ver[3] ? ver[3].weight : 0;
                var sum = w1 + w2 + w3 + w4;
                if (sum > 0) {
                    w1 = w1 / sum;
                    w2 = w2 / sum;
                    w3 = w3 / sum;
                    w4 = w4 / sum;
                }
                ver[0] && (ver[0].weight = w1);
                ver[1] && (ver[1].weight = w2);
                ver[2] && (ver[2].weight = w3);
                ver[3] && (ver[3].weight = w4);
            }
        }

        for (var i = 0; i < verticesCount; i++) {
            g_v.push(vertices[i * 3 + 0]);
            g_v.push(vertices[i * 3 + 1]);
            g_v.push(vertices[i * 3 + 2]);

            g_v.push(normals[i * 3 + 0]);
            g_v.push(normals[i * 3 + 1]);
            g_v.push(normals[i * 3 + 2]);

            g_v.push(0);
            g_v.push(0);
            g_v.push(0);

            if (bones) {
                var ver = bind[i];
                // bones index
                for (var k = 0; k < 4; k++) {
                    if (ver[k]) {
                        g_v.push(ver[k].index);
                    } else {
                        g_v.push(0);
                    }
                }
            } else {
                // v color
                g_v.push(1);
                g_v.push(1);
                g_v.push(1);
                g_v.push(1);
            }

            // uv1
            if (texturecoords) {
                g_v.push(texturecoords[i * 2 + 0]);
                g_v.push(1 - texturecoords[i * 2 + 1]);
            } else {
                g_v.push(0);
                g_v.push(0);
            }

            if (bones) {
                // bones weight
                var ver = bind[i];
                // bones index
                for (var k = 0; k < 4; k++) {
                    if (ver[k]) {
                        g_v.push(ver[k].weight);
                    } else {
                        g_v.push(0);
                    }
                }
            } else {
                // uv2
                g_v.push(0);
                g_v.push(0);
            }

        }

        if (bones) {
            geometry.vertexFormat = {
                "a_Position": {
                    size: 3,
                    normalized: false,
                    stride: 19,
                    offset: 0
                },
                "a_Normal": {
                    size: 3,
                    normalized: false,
                    stride: 19,
                    offset: 3
                },
                "a_Uv": {
                    size: 2,
                    normalized: false,
                    stride: 19,
                    offset: 13
                },
                "skinIndex": {
                    size: 4,
                    normalized: false,
                    stride: 19,
                    offset: 9
                },
                "skinWeight": {
                    size: 4,
                    normalized: false,
                    stride: 19,
                    offset: 15
                },
            };
            geometry.vertexSize = 19;
        }

        var g_i = geometry.indicesArray;
        for (var i = 0; i < faces.length; i++) {
            g_i.push(faces[i][0]);
            g_i.push(faces[i][1]);
            g_i.push(faces[i][2]);
        }

        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        return geometry;
    }

    AssimpJsonLoader.prototype.parseObject = function(json, node, meshes, materials, skeletons) {
        var group = new zen3d.Group();

        group.name = node.name || "";
        group.matrix.fromArray(node.transformation).transpose();
        group.matrix.decompose(group.position, group.quaternion, group.scale);

        for (var i = 0, mesh; node.meshes && i < node.meshes.length; ++i) {
            var idx = node.meshes[i];
            if (skeletons[idx]) {
                mesh = new zen3d.SkinnedMesh(meshes[idx], materials[json.meshes[idx].materialindex]);
                mesh.skeleton = skeletons[idx];
            } else {
                mesh = new zen3d.Mesh(meshes[idx], materials[json.meshes[idx].materialindex]);
            }
            mesh.frustumCulled = false;
            group.add(mesh);
        }

        for (var i = 0; node.children && i < node.children.length; ++i) {
            group.add(this.parseObject(json, node.children[i], meshes, materials, skeletons));
        }

        return group;
    }

    AssimpJsonLoader.prototype.extractUrlBase = function(url) {
        var parts = url.split('/');
        parts.pop();
        return (parts.length < 1 ? '.' : parts.join('/')) + '/';
    }

    zen3d.AssimpJsonLoader = AssimpJsonLoader;
})();
(function() {
    /**
     * FileLoader
     * @class
     * Loader for file
     */
    var FileLoader = function() {
        this.path = undefined;
        this.responseType = undefined;
        this.withCredentials = undefined;
        this.mimeType = undefined;
        this.requestHeader = undefined;
    }

    FileLoader.prototype.load = function(url, onLoad, onProgress, onError) {
        if (url === undefined) url = '';
        if (this.path != undefined) url = this.path + url;

        // Check for data: URI
        var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
        var dataUriRegexResult = url.match(dataUriRegex);

        if (dataUriRegexResult) { // Safari can not handle Data URIs through XMLHttpRequest so process manually
            var mimeType = dataUriRegexResult[1];
            var isBase64 = !!dataUriRegexResult[2];
            var data = dataUriRegexResult[3];
            data = window.decodeURIComponent(data);
            if (isBase64) data = window.atob(data); // decode base64
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
                    default: // 'text' or other
                        response = data;
                        break;
                }

                // Wait for next browser tick
                window.setTimeout(function() {
                    if (onLoad) onLoad(response);
                }, 0);
            } catch (error) {
                // Wait for next browser tick
                window.setTimeout(function() {
                    onError && onError(error);
                }, 0);
            }
        } else {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.addEventListener('load', function(event) {
                var response = event.target.response;
                if (this.status === 200) {
                    if (onLoad) onLoad(response);
                } else if (this.status === 0) {
                    // Some browsers return HTTP Status 0 when using non-http protocol
                    // e.g. 'file://' or 'data://'. Handle as success.
                    console.warn('THREE.FileLoader: HTTP Status 0 received.');
                    if (onLoad) onLoad(response);
                } else {
                    if (onError) onError(event);
                }
            }, false);

            if (onProgress !== undefined) {
                request.addEventListener('progress', function(event) {
                    onProgress(event);
                }, false);
            }

            if (onError !== undefined) {
                request.addEventListener('error', function(event) {
                    onError(event);
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
    }

    FileLoader.prototype.setPath = function(value) {
        this.path = value;
        return this;
    }

    FileLoader.prototype.setResponseType = function(value) {
        this.responseType = value;
        return this;
    }

    // Access-Control-Allow-Credentials: true
    FileLoader.prototype.setWithCredentials = function(value) {
        this.withCredentials = value;
        return this;
    }

    FileLoader.prototype.setMimeType = function(value) {
        this.mimeType = value;
        return this;
    }

    FileLoader.prototype.setRequestHeader = function(value) {
        this.requestHeader = value;
        return this;
    }

    zen3d.FileLoader = FileLoader;
})();
(function() {
    /**
     * ImageLoader
     * @class
     * Loader for image
     */
    var ImageLoader = function() {
        this.crossOrigin = undefined;
        this.path = undefined;
    }

    ImageLoader.prototype.load = function(url, onLoad, onProgress, onError) {
        if (url === undefined) url = '';
        if (this.path !== undefined) url = this.path + url;

        var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

        image.addEventListener('load', function() {
            if (onLoad) onLoad(this);
        }, false);

        // image.addEventListener('progress', function(event) {
        //     if (onProgress) onProgress(event);
        // }, false);

        image.addEventListener('error', function(event) {
            if (onError) onError(event);
        }, false);

        if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;
        }

        image.src = url;

        return image;
    }

    ImageLoader.prototype.setCrossOrigin = function(value) {
        this.crossOrigin = value;
        return this;
    }

    ImageLoader.prototype.setPath = function(value) {
        this.path = value;
        return this;
    }

    zen3d.ImageLoader = ImageLoader;
})();
(function() {
    var TGALoader = function() {

    }

    TGALoader.prototype.load = function(url, onLoad, onProgress, onError) {
        var that = this;

        var loader = new zen3d.FileLoader();
        loader.setResponseType('arraybuffer');
        loader.load(url, function(buffer) {
            if (onLoad !== undefined) {
                onLoad(that.parse(buffer));
            }
        }, onProgress, onError);
    }

    // reference from vthibault, https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js
    TGALoader.prototype.parse = function(buffer) {
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


    	if ( buffer.length < 19 )
    		console.error( 'TGALoader.parse: Not enough data to contain header.' );

    	var content = new Uint8Array( buffer ),
    		offset = 0,
    		header = {
    			id_length:       content[ offset ++ ],
    			colormap_type:   content[ offset ++ ],
    			image_type:      content[ offset ++ ],
    			colormap_index:  content[ offset ++ ] | content[ offset ++ ] << 8,
    			colormap_length: content[ offset ++ ] | content[ offset ++ ] << 8,
    			colormap_size:   content[ offset ++ ],

    			origin: [
    				content[ offset ++ ] | content[ offset ++ ] << 8,
    				content[ offset ++ ] | content[ offset ++ ] << 8
    			],
    			width:      content[ offset ++ ] | content[ offset ++ ] << 8,
    			height:     content[ offset ++ ] | content[ offset ++ ] << 8,
    			pixel_size: content[ offset ++ ],
    			flags:      content[ offset ++ ]
    		};

    	function tgaCheckHeader( header ) {

    		switch ( header.image_type ) {

    			// Check indexed type
    			case TGA_TYPE_INDEXED:
    			case TGA_TYPE_RLE_INDEXED:
    				if ( header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1 ) {

    					console.error( 'TGALoader.parse.tgaCheckHeader: Invalid type colormap data for indexed type' );

    				}
    				break;

    			// Check colormap type
    			case TGA_TYPE_RGB:
    			case TGA_TYPE_GREY:
    			case TGA_TYPE_RLE_RGB:
    			case TGA_TYPE_RLE_GREY:
    				if ( header.colormap_type ) {

    					console.error( 'TGALoader.parse.tgaCheckHeader: Invalid type colormap data for colormap type' );

    				}
    				break;

    			// What the need of a file without data ?
    			case TGA_TYPE_NO_DATA:
    				console.error( 'TGALoader.parse.tgaCheckHeader: No data' );

    			// Invalid type ?
    			default:
    				console.error( 'TGALoader.parse.tgaCheckHeader: Invalid type " ' + header.image_type + '"' );

    		}

    		// Check image width and height
    		if ( header.width <= 0 || header.height <= 0 ) {

    			console.error( 'TGALoader.parse.tgaCheckHeader: Invalid image size' );

    		}

    		// Check image pixel size
    		if ( header.pixel_size !== 8  &&
    			header.pixel_size !== 16 &&
    			header.pixel_size !== 24 &&
    			header.pixel_size !== 32 ) {

    			console.error( 'TGALoader.parse.tgaCheckHeader: Invalid pixel size "' + header.pixel_size + '"' );

    		}

    	}

    	// Check tga if it is valid format
    	tgaCheckHeader( header );

    	if ( header.id_length + offset > buffer.length ) {

    		console.error( 'TGALoader.parse: No data' );

    	}

    	// Skip the needn't data
    	offset += header.id_length;

    	// Get targa information about RLE compression and palette
    	var use_rle = false,
    		use_pal = false,
    		use_grey = false;

    	switch ( header.image_type ) {

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

    	}

    	// Parse tga image buffer
    	function tgaParse( use_rle, use_pal, header, offset, data ) {

    		var pixel_data,
    			pixel_size,
    			pixel_total,
    			palettes;

    		pixel_size = header.pixel_size >> 3;
    		pixel_total = header.width * header.height * pixel_size;

    		 // Read palettes
    		 if ( use_pal ) {

    			 palettes = data.subarray( offset, offset += header.colormap_length * ( header.colormap_size >> 3 ) );

    		 }

    		 // Read RLE
    		 if ( use_rle ) {

    			 pixel_data = new Uint8Array( pixel_total );

    			var c, count, i;
    			var shift = 0;
    			var pixels = new Uint8Array( pixel_size );

    			while ( shift < pixel_total ) {

    				c     = data[ offset ++ ];
    				count = ( c & 0x7f ) + 1;

    				// RLE pixels.
    				if ( c & 0x80 ) {

    					// Bind pixel tmp array
    					for ( i = 0; i < pixel_size; ++ i ) {

    						pixels[ i ] = data[ offset ++ ];

    					}

    					// Copy pixel array
    					for ( i = 0; i < count; ++ i ) {

    						pixel_data.set( pixels, shift + i * pixel_size );

    					}

    					shift += pixel_size * count;

    				} else {

    					// Raw pixels.
    					count *= pixel_size;
    					for ( i = 0; i < count; ++ i ) {

    						pixel_data[ shift + i ] = data[ offset ++ ];

    					}
    					shift += count;

    				}

    			}

    		 } else {

    			// RAW Pixels
    			pixel_data = data.subarray(
    				 offset, offset += ( use_pal ? header.width * header.height : pixel_total )
    			);

    		 }

    		 return {
    			pixel_data: pixel_data,
    			palettes: palettes
    		 };

    	}

    	function tgaGetImageData8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes ) {

    		var colormap = palettes;
    		var color, i = 0, x, y;
    		var width = header.width;

    		for ( y = y_start; y !== y_end; y += y_step ) {

    			for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

    				color = image[ i ];
    				imageData[ ( x + width * y ) * 4 + 3 ] = 255;
    				imageData[ ( x + width * y ) * 4 + 2 ] = colormap[ ( color * 3 ) + 0 ];
    				imageData[ ( x + width * y ) * 4 + 1 ] = colormap[ ( color * 3 ) + 1 ];
    				imageData[ ( x + width * y ) * 4 + 0 ] = colormap[ ( color * 3 ) + 2 ];

    			}

    		}

    		return imageData;

    	}

    	function tgaGetImageData16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

    		var color, i = 0, x, y;
    		var width = header.width;

    		for ( y = y_start; y !== y_end; y += y_step ) {

    			for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

    				color = image[ i + 0 ] + ( image[ i + 1 ] << 8 ); // Inversed ?
    				imageData[ ( x + width * y ) * 4 + 0 ] = ( color & 0x7C00 ) >> 7;
    				imageData[ ( x + width * y ) * 4 + 1 ] = ( color & 0x03E0 ) >> 2;
    				imageData[ ( x + width * y ) * 4 + 2 ] = ( color & 0x001F ) >> 3;
    				imageData[ ( x + width * y ) * 4 + 3 ] = ( color & 0x8000 ) ? 0 : 255;

    			}

    		}

    		return imageData;

    	}

    	function tgaGetImageData24bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

    		var i = 0, x, y;
    		var width = header.width;

    		for ( y = y_start; y !== y_end; y += y_step ) {

    			for ( x = x_start; x !== x_end; x += x_step, i += 3 ) {

    				imageData[ ( x + width * y ) * 4 + 3 ] = 255;
    				imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
    				imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
    				imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];

    			}

    		}

    		return imageData;

    	}

    	function tgaGetImageData32bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

    		var i = 0, x, y;
    		var width = header.width;

    		for ( y = y_start; y !== y_end; y += y_step ) {

    			for ( x = x_start; x !== x_end; x += x_step, i += 4 ) {

    				imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
    				imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
    				imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];
    				imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 3 ];

    			}

    		}

    		return imageData;

    	}

    	function tgaGetImageDataGrey8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

    		var color, i = 0, x, y;
    		var width = header.width;

    		for ( y = y_start; y !== y_end; y += y_step ) {

    			for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

    				color = image[ i ];
    				imageData[ ( x + width * y ) * 4 + 0 ] = color;
    				imageData[ ( x + width * y ) * 4 + 1 ] = color;
    				imageData[ ( x + width * y ) * 4 + 2 ] = color;
    				imageData[ ( x + width * y ) * 4 + 3 ] = 255;

    			}

    		}

    		return imageData;

    	}

    	function tgaGetImageDataGrey16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

    		var i = 0, x, y;
    		var width = header.width;

    		for ( y = y_start; y !== y_end; y += y_step ) {

    			for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

    				imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 0 ];
    				imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 0 ];
    				imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
    				imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 1 ];

    			}

    		}

    		return imageData;

    	}

    	function getTgaRGBA( data, width, height, image, palette ) {

    		var x_start,
    			y_start,
    			x_step,
    			y_step,
    			x_end,
    			y_end;

    		switch ( ( header.flags & TGA_ORIGIN_MASK ) >> TGA_ORIGIN_SHIFT ) {
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
    				y_step = - 1;
    				y_end = - 1;
    				break;

    			case TGA_ORIGIN_UR:
    				x_start = width - 1;
    				x_step = - 1;
    				x_end = - 1;
    				y_start = 0;
    				y_step = 1;
    				y_end = height;
    				break;

    			case TGA_ORIGIN_BR:
    				x_start = width - 1;
    				x_step = - 1;
    				x_end = - 1;
    				y_start = height - 1;
    				y_step = - 1;
    				y_end = - 1;
    				break;

    		}

    		if ( use_grey ) {

    			switch ( header.pixel_size ) {
    				case 8:
    					tgaGetImageDataGrey8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
    					break;
    				case 16:
    					tgaGetImageDataGrey16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
    					break;
    				default:
    					console.error( 'TGALoader.parse.getTgaRGBA: not support this format' );
    					break;
    			}

    		} else {

    			switch ( header.pixel_size ) {
    				case 8:
    					tgaGetImageData8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette );
    					break;

    				case 16:
    					tgaGetImageData16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
    					break;

    				case 24:
    					tgaGetImageData24bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
    					break;

    				case 32:
    					tgaGetImageData32bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
    					break;

    				default:
    					console.error( 'TGALoader.parse.getTgaRGBA: not support this format' );
    					break;
    			}

    		}

    		// Load image data according to specific method
    		// var func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
    		// func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );
    		return data;

    	}

    	var canvas = document.createElement( 'canvas' );
    	canvas.width = header.width;
    	canvas.height = header.height;

    	var context = canvas.getContext( '2d' );
    	var imageData = context.createImageData( header.width, header.height );

    	var result = tgaParse( use_rle, use_pal, header, offset, content );
    	var rgbaData = getTgaRGBA( imageData.data, header.width, header.height, result.pixel_data, result.palettes );

    	context.putImageData( imageData, 0, 0 );

    	return canvas;
    }

    zen3d.TGALoader = TGALoader;
})();
(function() {
    var Performance = function() {
        this._entities = {};

        this.enableCounter = false;
    }

    Performance.prototype.getEntity = function(key) {
        return this._entities[key];
    }

    Performance.prototype.getFps = function() {
        var entity = this.getEntity("fps");
        return (entity && entity.averageDelta) ? Math.floor(1000 / entity.averageDelta) : 0;
    }

    Performance.prototype.updateFps = function() {
        if(!this.enableCounter) {
            return;
        }
        this.endCounter("fps");
        this.startCounter("fps", 60);
    }

    Performance.prototype.getNow = function() {
        if(window.performance) {
            return window.performance.now();
        }
        return new Date().getTime();
    }

    Performance.prototype.startCounter = function(key, averageRange) {
        if(!this.enableCounter) {
            return;
        }

        var entity = this._entities[key];
        if(!entity) {
            entity = {
                start: 0,
                end: 0,
                delta: 0,
                _cache: [],
                averageRange: 1,
                averageDelta: 0
            };
            this._entities[key] = entity;
        }
        entity.start = this.getNow();
        entity.averageRange = averageRange || 1;
    }

    Performance.prototype.endCounter = function(key) {
        if(!this.enableCounter) {
            return;
        }

        var entity = this._entities[key];
        if(entity) {
            entity.end = this.getNow();
            entity.delta = entity.end - entity.start;

            if(entity.averageRange > 1) {
                entity._cache.push(entity.delta);
                var length = entity._cache.length;
                if(length >= entity.averageRange) {
                    if(length > entity.averageRange) {
                        entity._cache.shift();
                        length--;
                    }
                    var sum = 0;
                    for(var i = 0; i < length; i++) {
                        sum += entity._cache[i];
                    }
                    entity.averageDelta = sum / length;
                }
            }
        }
    }

    zen3d.Performance = Performance;
})();
(function() {
    /**
     * HoverController Class
     * @class
     */
    var HoverController = function(camera, lookAtPoint) {
        this.camera = camera;

        this.lookAtPoint = lookAtPoint;

        this.up = new zen3d.Vector3(0, 1, 0);

        this.distance = 100;

        this._panAngle = 0;
        this._panRad = 0;
        this.minPanAngle = -Infinity;
        this.maxPanAngle = Infinity;

        this._tiltAngle = 0;
        this._tiltRad = 0;
        this.minTileAngle = -90;
        this.maxTileAngle = 90;
    }

    Object.defineProperties(HoverController.prototype, {
        panAngle: {
            get: function() {
                return this._panAngle;
            },
            set: function(value) {
                this._panAngle = Math.max(this.minPanAngle, Math.min(this.maxPanAngle, value));
                this._panRad = this._panAngle * Math.PI / 180;
            }
        },
        tiltAngle: {
            get: function() {
                return this._tiltAngle;
            },
            set: function(value) {
                this._tiltAngle = Math.max(this.minTileAngle, Math.min(this.maxTileAngle, value));
                this._tiltRad = this._tiltAngle * Math.PI / 180;
            }
        }
    });

    HoverController.prototype.update = function() {
        var distanceX = this.distance * Math.sin(this._panRad) * Math.cos(this._tiltRad);
        var distanceY = this.distance * Math.sin(this._tiltRad);
        var distanceZ = this.distance * Math.cos(this._panRad) * Math.cos(this._tiltRad);

        var camera = this.camera;
        var target = this.lookAtPoint;
        camera.position.set(distanceX + target.x, distanceY + target.y, distanceZ + target.z);
        camera.setLookAt(target, this.up);
    }

    zen3d.HoverController = HoverController;
})();