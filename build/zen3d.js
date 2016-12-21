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
     * webgl get extension
     */
    var getExtension = function(gl, name) {
        var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
        var ext = null;
        for (var i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) { break; }
        }
        return ext;
    }

    zen3d.getExtension = getExtension;

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

    /**
     * require image
     */
    var requireImage = function(url, sucCallback, errCallback) {
        var image = new Image();

        image.onload = function() {
            sucCallback(image);
        }
        // TODO errCallback

        image.src = url;
    }

    zen3d.requireImage = requireImage;

    /**
     * require http
     *
     * param :
     * {
     *   method: "GET"|"POST",
     *   data: {},
     *   parse: true|false
     * }
     *
     */
    var requireHttp = function(url, sucCallback, errCallback, param) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function(event) {

            if(event.target.readyState == 4) {
                var data = event.target.response;

                if(param && param.parse) {
                    data = JSON.parse(data);
                }
                // TODO errCallback
                sucCallback(data);
            }

        };

        if(param && param.method === "POST") {
            request.open("POST", url, true);
            request.send(param.data);
        } else {
            request.open("GET", url, true);
            request.send();
        }
    }

    zen3d.requireHttp = requireHttp;

})(window);

(function() {
    /**
     * OBJECT_TYPE
     */
    var OBJECT_TYPE = {
        MESH: "mesh",
        LIGHT: "light",
        CAMERA: "camera",
        SCENE: "scene",
        GROUP: "group",
        POINT: "point",
        CANVAS2D: "canvas2d",
        SPRITE: "sprite"
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
        CANVAS2D: "canvas2d",
        SPRITE: "sprite"
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
        UNSIGNED_SHORT_5_6_5: 0x8363
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

    zen3d.Matrix4 = Matrix4;
    zen3d.helpMatrix = new Matrix4();
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
    /**
     * a vector 2 class
     * @class
     */
    var Vector2 = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
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


    var WebGLCapabilities = function(gl) {
        this.precision = "highp";

        this.maxPrecision = getMaxPrecision(gl, this.precision);

        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
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

            if(blend === BLEND_TYPE.ADD) {
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

    WebGLState.prototype.setCullFace = function(cullFace) {

        // gl.CW, gl.CCW, default is CCW
        // state.frontFace(gl.CCW);

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

        if(boundBuffer !== buffer) {
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

            if (mipmaps.length > 0 && isPowerOfTwoImage) {

                for (var i = 0, il = mipmaps.length; i < il; i++) {
                    mipmap = mipmaps[i];
                    gl.texImage2D(gl.TEXTURE_2D, i, pixelFormat, pixelFormat, pixelType, mipmap);
                }

                texture.generateMipmaps = false;
            } else {
                gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, pixelFormat, pixelType, image);
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
        // TODO EXT_texture_filter_anisotropic
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
            }

            state.bindBuffer(gl.ARRAY_BUFFER, geometryProperties.__webglVAO);

            var vertices = new Float32Array(geometry.verticesArray);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            if(geometry.indicesArray.length > 0) {
                if(geometryProperties.__webglEAO === undefined) {
                    geometryProperties.__webglEAO = gl.createBuffer();
                }

                state.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryProperties.__webglEAO);

                var indices = new Uint16Array(geometry.indicesArray);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
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
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.setValue = function(p1, p2) {
                    this.value[0] = p1;
                    this.value[1] = p2;
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
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.setValue = function(p1) {
                    this.value.set(p1);
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

    var packing = [
        "const float PackUpscale = 256. / 255.;", // fraction -> 0..1 (including 1)
        "const float UnpackDownscale = 255. / 256.;", // 0..1 -> fraction (excluding 1)

        "const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );",
        "const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );",

        "const float ShiftRight8 = 1. / 256.;",

        "vec4 packDepthToRGBA( const in float v ) {",

            "vec4 r = vec4( fract( v * PackFactors ), v );",
            "r.yzw -= r.xyz * ShiftRight8;", // tidy overflow
            "return r * PackUpscale;",

        "}",

        "float unpackRGBAToDepth( const in vec4 v ) {",

            "return dot( v, UnpackFactors );",

        "}"
    ].join("\n");

    var transpose = "mat4 transpose(mat4 inMatrix) { \n" +
        "vec4 i0 = inMatrix[0]; \n" +
        "vec4 i1 = inMatrix[1]; \n" +
        "vec4 i2 = inMatrix[2]; \n" +
        "vec4 i3 = inMatrix[3]; \n" +
        "mat4 outMatrix = mat4( \n" +
            "vec4(i0.x, i1.x, i2.x, i3.x), \n" +
            "vec4(i0.y, i1.y, i2.y, i3.y), \n" +
            "vec4(i0.z, i1.z, i2.z, i3.z), \n" +
            "vec4(i0.w, i1.w, i2.w, i3.w) \n" +
        "); \n" +
        "return outMatrix; \n" +
    "} \n";

    var inverse = "mat4 inverse(mat4 m) { \n" +
        "float \n" +
        "a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3], \n" +
        "a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3], \n" +
        "a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3], \n" +
        "a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3], \n" +
        "b00 = a00 * a11 - a01 * a10, \n" +
        "b01 = a00 * a12 - a02 * a10, \n" +
        "b02 = a00 * a13 - a03 * a10, \n" +
        "b03 = a01 * a12 - a02 * a11, \n" +
        "b04 = a01 * a13 - a03 * a11, \n" +
        "b05 = a02 * a13 - a03 * a12, \n" +
        "b06 = a20 * a31 - a21 * a30, \n" +
        "b07 = a20 * a32 - a22 * a30, \n" +
        "b08 = a20 * a33 - a23 * a30, \n" +
        "b09 = a21 * a32 - a22 * a31, \n" +
        "b10 = a21 * a33 - a23 * a31, \n" +
        "b11 = a22 * a33 - a23 * a32, \n" +
        "det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; \n" +
        "return mat4( \n" +
            "a11 * b11 - a12 * b10 + a13 * b09, \n" +
            "a02 * b10 - a01 * b11 - a03 * b09, \n" +
            "a31 * b05 - a32 * b04 + a33 * b03, \n" +
            "a22 * b04 - a21 * b05 - a23 * b03, \n" +
            "a12 * b08 - a10 * b11 - a13 * b07, \n" +
            "a00 * b11 - a02 * b08 + a03 * b07, \n" +
            "a32 * b02 - a30 * b05 - a33 * b01, \n" +
            "a20 * b05 - a22 * b02 + a23 * b01, \n" +
            "a10 * b10 - a11 * b08 + a13 * b06, \n" +
            "a01 * b08 - a00 * b10 - a03 * b06, \n" +
            "a30 * b04 - a31 * b02 + a33 * b00, \n" +
            "a21 * b02 - a20 * b04 - a23 * b00, \n" +
            "a11 * b07 - a10 * b09 - a12 * b06, \n" +
            "a00 * b09 - a01 * b07 + a02 * b06, \n" +
            "a31 * b01 - a30 * b03 - a32 * b00, \n" +
            "a20 * b03 - a21 * b01 + a22 * b00) / det; \n" +
    "} \n";

    var tsn = [
        'mat3 tsn(vec3 N, vec3 V, vec2 uv) {',

            'vec3 q0 = dFdx( V.xyz );',
            'vec3 q1 = dFdy( V.xyz );',
            'vec2 st0 = dFdx( uv.st );',
            'vec2 st1 = dFdy( uv.st );',

            'vec3 S = normalize( q0 * st1.t - q1 * st0.t );',
            'vec3 T = normalize( -q0 * st1.s + q1 * st0.s );',
            // 'vec3 N = normalize( N );',

            'mat3 tsn = mat3( S, T, N );',
            'return tsn;',
        '}'
    ].join("\n");

    var tbn = "mat3 tbn(vec3 N, vec3 p, vec2 uv) { \n" +
        "vec3 dp1 = dFdx(p.xyz); \n" +
        "vec3 dp2 = dFdy(p.xyz); \n" +
        "vec2 duv1 = dFdx(uv.st); \n" +
        "vec2 duv2 = dFdy(uv.st); \n" +
        "vec3 dp2perp = cross(dp2, N); \n" +
        "vec3 dp1perp = cross(N, dp1); \n" +
        "vec3 T = dp2perp * duv1.x + dp1perp * duv2.x; \n" +
        "vec3 B = dp2perp * duv1.y + dp1perp * duv2.y; \n" +
        "float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B))); \n" +
        "return mat3(T * invmax, B * invmax, N); \n" +
    "} \n";

    /**
     * common parts
     */

    var vertexCommon = [
        'attribute vec3 a_Position;',
        'attribute vec3 a_Normal;',

        transpose,
        inverse,

        'uniform mat4 u_Projection;',
        'uniform mat4 u_View;',
        'uniform mat4 u_Model;',

        'uniform vec3 u_CameraPosition;'
    ].join("\n");

    var fragmentCommon = [
        'uniform mat4 u_View;',

        'uniform float u_Opacity;',
        'uniform vec3 u_Color;',

        'uniform vec3 u_CameraPosition;'
    ].join("\n");

    /**
     * frag
     */

    var frag_begin = [
        'vec4 outColor = vec4(u_Color, u_Opacity);'
    ].join("\n");

    var frag_end = [
        'gl_FragColor = outColor;'
    ].join("\n");

    /**
     * pvm
     */

    var pvm_vert = [
        'gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);'
    ].join("\n");

    /**
     * uv
     */

    var uv_pars_vert = [
        '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
            'attribute vec2 a_Uv;',
            'varying vec2 v_Uv;',
        '#endif',
    ].join("\n");

    var uv_vert = [
        '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
            'v_Uv = a_Uv;',
        '#endif',
    ].join("\n");

    var uv_pars_frag = [
        '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
            'varying vec2 v_Uv;',
        '#endif',
    ].join("\n");

    /**
     * normal
     */

    var normal_pars_vert = [
        '#ifdef USE_NORMAL',
            //'attribute vec3 a_Normal;',
            'varying vec3 v_Normal;',
        '#endif',
    ].join("\n");

    var normal_vert = [
        '#ifdef USE_NORMAL',
            'v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(a_Normal, 1.0)).xyz;',
        '#endif',
    ].join("\n");

    var normal_pars_frag = [
        '#ifdef USE_NORMAL',
            'varying vec3 v_Normal;',
        '#endif',
    ].join("\n");

    var normal_frag = [
        '#ifdef USE_NORMAL',
            'vec3 N;',
            '#ifdef USE_NORMAL_MAP',
                'vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;',
                // for now, uv coord is flip Y
                'mat3 tspace = tsn(normalize(v_Normal), -v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));',
                // 'mat3 tspace = tbn(normalize(v_Normal), v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));',
                'N = normalize(tspace * (normalMapColor * 2.0 - 1.0));',
            '#else',
                'N = normalize(v_Normal);',
            '#endif',
        '#endif',
    ].join("\n");

    /**
     * diffuse map
     */

    var diffuseMap_pars_frag = [
        '#ifdef USE_DIFFUSE_MAP',
            'uniform sampler2D texture;',
        '#endif',
    ].join("\n");

    var diffuseMap_frag = [
        '#ifdef USE_DIFFUSE_MAP',
            'outColor *= texture2D(texture, v_Uv);',
        '#endif',
    ].join("\n");

    /**
     * normal map
     */

    var normalMap_pars_frag = [
        tsn,
        tbn,
        'uniform sampler2D normalMap;',
    ].join("\n");

    /**
     * env map
     */

    var envMap_pars_vert = [
        '#ifdef USE_ENV_MAP',
            'varying vec3 v_EnvPos;',
        '#endif',
    ].join("\n");

    var envMap_vert = [
        '#ifdef USE_ENV_MAP',
            'v_EnvPos = reflect(normalize((u_Model * vec4(a_Position, 1.0)).xyz - u_CameraPosition), (transpose(inverse(u_Model)) * vec4(a_Normal, 1.0)).xyz);',
        '#endif',
    ].join("\n");

    var envMap_pars_frag = [
        '#ifdef USE_ENV_MAP',
            'varying vec3 v_EnvPos;',
            'uniform samplerCube envMap;',
            'uniform float u_EnvMap_Intensity;',
        '#endif',
    ].join("\n");

    var envMap_frag = [
        '#ifdef USE_ENV_MAP',
            'vec4 envColor = textureCube(envMap, v_EnvPos);',
            // TODO add? mix? or some other method?
            // 'outColor = mix(outColor, envColor, u_EnvMap_Intensity);',
            'outColor += envColor * u_EnvMap_Intensity;',
            // 'outColor = mix(outColor, envColor * outColor, u_EnvMap_Intensity);',
        '#endif',
    ].join("\n");

    /**
     * shadow map
     */

    var shadowMap_pars_vert = [
        '#ifdef USE_SHADOW',

            '#ifdef USE_DIRECT_LIGHT',

                'uniform mat4 directionalShadowMatrix[ USE_DIRECT_LIGHT ];',
                'varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];',

            '#endif',

            '#ifdef USE_POINT_LIGHT',

                // nothing

            '#endif',

            '#ifdef USE_SPOT_LIGHT',

                'uniform mat4 spotShadowMatrix[ USE_SPOT_LIGHT ];',
                'varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];',

            '#endif',

        '#endif'
    ].join("\n");

    var shadowMap_vert = [
        '#ifdef USE_SHADOW',

            'vec4 worldPosition = u_Model * vec4(a_Position, 1.0);',

            '#ifdef USE_DIRECT_LIGHT',

                'for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {',

                    'vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;',

                '}',

            '#endif',

            '#ifdef USE_POINT_LIGHT',

                // nothing

            '#endif',

            '#ifdef USE_SPOT_LIGHT',

                'for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {',

                    'vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;',

                '}',

            '#endif',

        '#endif'
    ].join("\n");

    var shadowMap_pars_frag = [
        '#ifdef USE_SHADOW',

            packing,

            '#ifdef USE_DIRECT_LIGHT',

                'uniform sampler2D directionalShadowMap[ USE_DIRECT_LIGHT ];',
                'varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];',

            '#endif',

            '#ifdef USE_POINT_LIGHT',

                'uniform samplerCube pointShadowMap[ USE_POINT_LIGHT ];',

            '#endif',

            '#ifdef USE_SPOT_LIGHT',

                'uniform sampler2D spotShadowMap[ USE_SPOT_LIGHT ];',
                'varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];',

            '#endif',

            'float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {',

        		'return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );',

        	'}',

            'float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {',

        		'return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );',

        	'}',

            'float getShadow( sampler2D shadowMap, vec4 shadowCoord ) {',
                'shadowCoord.xyz /= shadowCoord.w;',
                'shadowCoord.z += 0.0003;', // shadow bias

                'bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );',
        		'bool inFrustum = all( inFrustumVec );',

        		'bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );',

        		'bool frustumTest = all( frustumTestVec );',

        		'if ( frustumTest ) {',
                    'return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );',
                '}',

                'return 1.0;',

            '}',

            'float getPointShadow( samplerCube shadowMap, vec3 V ) {',
                'return textureCubeCompare( shadowMap, normalize(V), length(V) / 1000.);',
            '}',

            'float getShadowMask() {',
                'float shadow = 1.0;',

                '#ifdef USE_DIRECT_LIGHT',
                    'for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {',
                        'shadow *= bool( u_Directional[i].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ] ) : 1.0;',
                    '}',
                '#endif',

                '#ifdef USE_POINT_LIGHT',
                    'for ( int i = 0; i < USE_POINT_LIGHT; i ++ ) {',
                        'vec3 worldV = (vec4(v_ViewModelPos, 1.) * u_View - vec4(u_Point[i].position, 1.) * u_View).xyz;',
                        'shadow *= bool( u_Point[i].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV ) : 1.0;',
                    '}',
                '#endif',

                '#ifdef USE_SPOT_LIGHT',
                    'for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {',
                        'shadow *= bool( u_Spot[i].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ] ) : 1.0;',
                    '}',
                '#endif',

                'return shadow;',
            '}',

        '#endif'
    ].join("\n");

    var shadowMap_frag = [
        '#ifdef USE_SHADOW',
            'outColor *= getShadowMask();',
        '#endif'
    ].join("\n");

    /**
     * light
     */

    var ambientlight_pars_frag = [
        'struct AmbientLight',
        '{',
            'vec4 color;',
            'float intensity;',
        '};',
        'uniform AmbientLight u_Ambient[USE_AMBIENT_LIGHT];',
    ].join("\n");

    var directlight_pars_frag = [
        'struct DirectLight',
        '{',
            'vec3 direction;',
            'vec4 color;',
            'float intensity;',

            'int shadow;',
        '};',
        'uniform DirectLight u_Directional[USE_DIRECT_LIGHT];',
    ].join("\n");

    var pointlight_pars_frag = [
        'struct PointLight',
        '{',
            'vec3 position;',
            'vec4 color;',
            'float intensity;',
            'float distance;',
            'float decay;',

            'int shadow;',
        '};',
        'uniform PointLight u_Point[USE_POINT_LIGHT];',
    ].join("\n");

    var spotlight_pars_frag = [
        'struct SpotLight',
        '{',
            'vec3 position;',
            'vec4 color;',
            'float intensity;',
            'float distance;',
            'float decay;',
            'float coneCos;',
            'float penumbraCos;',
            'vec3 direction;',

            'int shadow;',
        '};',
        'uniform SpotLight u_Spot[USE_SPOT_LIGHT];',
    ].join("\n");

    var light_pars_frag = [
        '#ifdef USE_AMBIENT_LIGHT',
            ambientlight_pars_frag,
        '#endif',
        '#ifdef USE_DIRECT_LIGHT',
            directlight_pars_frag,
        '#endif',
        '#ifdef USE_POINT_LIGHT',
            pointlight_pars_frag,
        '#endif',
        '#ifdef USE_SPOT_LIGHT',
            spotlight_pars_frag,
        '#endif',
    ].join("\n");

    var light_frag = [
        '#ifdef USE_LIGHT',
            'vec4 light;',
            'vec3 L;',
            'vec4 reflectLight = vec4(0., 0., 0., 0.);',
            'vec4 diffuseColor = outColor.xyzw;',

            '#ifdef USE_AMBIENT_LIGHT',
            'for(int i = 0; i < USE_AMBIENT_LIGHT; i++) {',
                'reflectLight += diffuseColor * u_Ambient[i].color * u_Ambient[i].intensity;',
            '}',
            '#endif',

            '#if defined(USE_PHONG) && ( defined(USE_DIRECT_LIGHT) || defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) )',
                'vec3 V = normalize( (u_View * vec4(u_CameraPosition, 1.)).xyz - v_ViewModelPos);',
            '#endif',

            '#ifdef USE_DIRECT_LIGHT',
            'for(int i = 0; i < USE_DIRECT_LIGHT; i++) {',
                'L = -u_Directional[i].direction;',
                'light = u_Directional[i].color * u_Directional[i].intensity;',
                'L = normalize(L);',

                'RE_Lambert(diffuseColor, light, N, L, reflectLight);',

                '#ifdef USE_PHONG',
                // 'RE_Phong(u_SpecularColor, light, N, L, V, 4., reflectLight);',
                'RE_BlinnPhong(u_SpecularColor, light, N, normalize(L), V, u_Specular, reflectLight);',
                '#endif',
            '}',
            '#endif',

            '#ifdef USE_POINT_LIGHT',
            'for(int i = 0; i < USE_POINT_LIGHT; i++) {',
                'L = u_Point[i].position - v_ViewModelPos;',
                'float dist = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);',
                'light = u_Point[i].color * u_Point[i].intensity * dist;',
                'L = normalize(L);',

                'RE_Lambert(diffuseColor, light, N, L, reflectLight);',

                '#ifdef USE_PHONG',
                // 'RE_Phong(u_SpecularColor, light, N, L, V, u_Specular, reflectLight);',
                'RE_BlinnPhong(u_SpecularColor, light, N, normalize(L), V, u_Specular, reflectLight);',
                '#endif',
            '}',
            '#endif',

            '#ifdef USE_SPOT_LIGHT',
            'for(int i = 0; i < USE_SPOT_LIGHT; i++) {',
                'L = u_Spot[i].position - v_ViewModelPos;',
                'float lightDistance = length(L);',
                'L = normalize(L);',
                'float angleCos = dot( L, -normalize(u_Spot[i].direction) );',

                'if( all( bvec2(angleCos > u_Spot[i].coneCos, lightDistance < u_Spot[i].distance) ) ) {',

                    'float spotEffect = smoothstep( u_Spot[i].coneCos, u_Spot[i].penumbraCos, angleCos );',
                    'float dist = pow(clamp(1. - lightDistance / u_Spot[i].distance, 0.0, 1.0), u_Spot[i].decay);',
                    'light = u_Spot[i].color * u_Spot[i].intensity * dist * spotEffect;',

                    'RE_Lambert(diffuseColor, light, N, L, reflectLight);',

                    '#ifdef USE_PHONG',
                    // 'RE_Phong(u_SpecularColor, light, N, L, V, u_Specular, reflectLight);',
                    'RE_BlinnPhong(u_SpecularColor, light, N, normalize(L), V, u_Specular, reflectLight);',
                    '#endif',

                '}',

            '}',
            '#endif',

            'outColor = reflectLight.xyzw;',
        '#endif'
    ].join("\n");

    var RE_Lambert = [
        'void RE_Lambert(vec4 k, vec4 light, vec3 N, vec3 L, inout vec4 reflectLight) {',
            'float dotNL = max(dot(N, L), 0.);',
            'reflectLight += k * light * dotNL;',
        '}'
    ].join("\n");

    var RE_Phong = [
        'void RE_Phong(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, inout vec4 reflectLight) {',
            'vec3 R = max(dot(2.0 * N, L), 0.) * N - L;',
            'reflectLight += k * light * pow(max(dot(V, R), 0.), n_s);',
        '}'
    ].join("\n");

    var RE_BlinnPhong = [
        'void RE_BlinnPhong(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, inout vec4 reflectLight) {',
            'vec3 H = normalize(L + V);',
            'reflectLight += k * light * pow(max(dot(N, H), 0.), n_s);',
        '}'
    ].join("\n");

    /**
     * view model pos
     */

    var viewModelPos_pars_vert =[
        '#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )',
            'varying vec3 v_ViewModelPos;',
        '#endif'
    ].join("\n");

    var viewModelPos_vert =[
        '#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )',
            'v_ViewModelPos = (u_View * u_Model * vec4(a_Position, 1.0)).xyz;',
        '#endif'
    ].join("\n");

    var viewModelPos_pars_frag =[
        '#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )',
            'varying vec3 v_ViewModelPos;',
        '#endif'
    ].join("\n");

    /**
     * premultiplied alpha
     */
    var premultipliedAlpha_frag = [
        '#ifdef USE_PREMULTIPLIED_ALPHA',
            'gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;',
        '#endif'
    ].join("\n");

    /**
     * fog
     */

    var fog_pars_frag = [
        '#ifdef USE_FOG',

        	'uniform vec3 u_FogColor;',

        	'#ifdef USE_EXP2_FOG',

        		'uniform float u_FogDensity;',

        	'#else',

        		'uniform float u_FogNear;',
        		'uniform float u_FogFar;',
        	'#endif',

        '#endif'
    ].join("\n");

    var fog_frag = [
        '#ifdef USE_FOG',

        	'float depth = gl_FragCoord.z / gl_FragCoord.w;',

        	'#ifdef USE_EXP2_FOG',

        		'float fogFactor = whiteCompliment( exp2( - u_FogDensity * u_FogDensity * depth * depth * LOG2 ) );',

        	'#else',

        		'float fogFactor = smoothstep( u_FogNear, u_FogFar, depth );',

        	'#endif',

        	'gl_FragColor.rgb = mix( gl_FragColor.rgb, u_FogColor, fogFactor );',

        '#endif'
    ].join("\n");

    /**
     * shader libs
     */
    var ShaderLib = {

        // basic shader
        basicVertex: [
            vertexCommon,
            uv_pars_vert,
            envMap_pars_vert,
            'void main() {',
                pvm_vert,
                uv_vert,
                envMap_vert,
            '}'
        ].join("\n"),
        basicFragment: [
            fragmentCommon,
            uv_pars_frag,
            diffuseMap_pars_frag,
            envMap_pars_frag,
            fog_pars_frag,
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                envMap_frag,
                frag_end,
                premultipliedAlpha_frag,
                fog_frag,
            '}'
        ].join("\n"),

        // lambert shader
        lambertVertex: [
            vertexCommon,
            normal_pars_vert,
            uv_pars_vert,
            viewModelPos_pars_vert,
            envMap_pars_vert,
            shadowMap_pars_vert,
            'void main() {',
                pvm_vert,
                normal_vert,
                uv_vert,
                viewModelPos_vert,
                envMap_vert,
                shadowMap_vert,
            '}'
        ].join("\n"),
        lambertFragment: [
            fragmentCommon,
            uv_pars_frag,
            diffuseMap_pars_frag,
            normalMap_pars_frag,
            light_pars_frag,
            normal_pars_frag,
            viewModelPos_pars_frag,
            RE_Lambert,
            envMap_pars_frag,
            shadowMap_pars_frag,
            fog_pars_frag,
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                normal_frag,
                light_frag,
                envMap_frag,
                shadowMap_frag,
                frag_end,
                premultipliedAlpha_frag,
                fog_frag,
            '}'
        ].join("\n"),

        // phong shader
        phongVertex: [
            vertexCommon,
            normal_pars_vert,
            uv_pars_vert,
            viewModelPos_pars_vert,
            envMap_pars_vert,
            shadowMap_pars_vert,
            'void main() {',
                pvm_vert,
                normal_vert,
                uv_vert,
                viewModelPos_vert,
                envMap_vert,
                shadowMap_vert,
            '}'
        ].join("\n"),
        phongFragment: [
            fragmentCommon,
            // if no light, this will not active
            'uniform float u_Specular;',
            'uniform vec4 u_SpecularColor;',
            uv_pars_frag,
            diffuseMap_pars_frag,
            normalMap_pars_frag,
            light_pars_frag,
            normal_pars_frag,
            viewModelPos_pars_frag,
            RE_Lambert,
            RE_Phong,
            RE_BlinnPhong,
            envMap_pars_frag,
            shadowMap_pars_frag,
            fog_pars_frag,
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                normal_frag,
                light_frag,
                envMap_frag,
                shadowMap_frag,
                frag_end,
                premultipliedAlpha_frag,
                fog_frag,
            '}'
        ].join("\n"),

        // cube shader
        cubeVertex: [
            vertexCommon,
            'varying vec3 v_ModelPos;',
            'void main() {',
                pvm_vert,
                'v_ModelPos = (u_Model * vec4(a_Position, 1.0)).xyz;',
            '}'
        ].join("\n"),
        cubeFragment: [
            fragmentCommon,
            'uniform samplerCube cubeMap;',
            'varying vec3 v_ModelPos;',
            'void main() {',
                frag_begin,
                'outColor *= textureCube(cubeMap, v_ModelPos);',
                frag_end,
            '}'
        ].join("\n"),

        // depth shader
        depthVertex: [
            vertexCommon,
            'varying vec3 v_ModelPos;',
            'void main() {',
                pvm_vert,
                'v_ModelPos = (u_Model * vec4(a_Position, 1.0)).xyz;',
            '}'
        ].join("\n"),
        depthFragment: [
            fragmentCommon,
            'uniform vec3 lightPos;',
            'varying vec3 v_ModelPos;',
            packing,
            'void main() {',
                'gl_FragColor = packDepthToRGBA(length(v_ModelPos - lightPos) / 1000.);',
            '}'
        ].join("\n"),

        // points shader
        pointsVertex: [
            vertexCommon,
            'uniform float u_PointSize;',
            'uniform float u_PointScale;',
            'void main() {',
                pvm_vert,
                'vec4 mvPosition = u_View * u_Model * vec4(a_Position, 1.0);',
                '#ifdef USE_SIZEATTENUATION',
            		'gl_PointSize = u_PointSize * ( u_PointScale / - mvPosition.z );',
            	'#else',
            		'gl_PointSize = u_PointSize;',
            	'#endif',
            '}'
        ].join("\n"),
        pointsFragment: [
            fragmentCommon,
            diffuseMap_pars_frag,
            fog_pars_frag,
            'void main() {',
                frag_begin,
                '#ifdef USE_DIFFUSE_MAP',
                    'outColor *= texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));',
                '#endif',
                frag_end,
                premultipliedAlpha_frag,
                fog_frag,
            '}'
        ].join("\n"),

        // canvas2d shader
        canvas2dVertex: [
            vertexCommon,
            'attribute vec2 a_Uv;',
            'varying vec2 v_Uv;',
            'void main() {',
                pvm_vert,
                'v_Uv = a_Uv;',
            '}'
        ].join("\n"),
        canvas2dFragment: [
            fragmentCommon,
            'varying vec2 v_Uv;',
            'uniform sampler2D spriteTexture;',
            'void main() {',
                frag_begin,
                'outColor *= texture2D(spriteTexture, v_Uv);',
                frag_end,
                premultipliedAlpha_frag,
            '}'
        ].join("\n"),

        // sprite shader
        spriteVertex: [
            'uniform mat4 modelMatrix;',
            'uniform mat4 viewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform float rotation;',
			'uniform vec2 scale;',
			'uniform vec2 uvOffset;',
			'uniform vec2 uvScale;',

			'attribute vec2 position;',
			'attribute vec2 uv;',

			'varying vec2 vUV;',

			'void main() {',

				'vUV = uvOffset + uv * uvScale;',

				'vec2 alignedPosition = position * scale;',

				'vec2 rotatedPosition;',
				'rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
				'rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

				'vec4 finalPosition;',

				'finalPosition = viewMatrix * modelMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
				'finalPosition.xy += rotatedPosition;',
				'finalPosition = projectionMatrix * finalPosition;',

				'gl_Position = finalPosition;',

			'}'
        ].join("\n"),
        spriteFragment: [
            'uniform vec3 color;',
			'uniform sampler2D map;',
			'uniform float opacity;',

			'uniform int fogType;',
			'uniform vec3 fogColor;',
			'uniform float fogDensity;',
			'uniform float fogNear;',
			'uniform float fogFar;',
			'uniform float alphaTest;',

			'varying vec2 vUV;',

			'void main() {',

				'vec4 texture = texture2D( map, vUV );',

				'if ( texture.a < alphaTest ) discard;',

				'gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );',

				'if ( fogType > 0 ) {',

					'float depth = gl_FragCoord.z / gl_FragCoord.w;',
					'float fogFactor = 0.0;',

					'if ( fogType == 1 ) {',

						'fogFactor = smoothstep( fogNear, fogFar, depth );',

					'} else {',

						'const float LOG2 = 1.442695;',
						'fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );',
						'fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );',

					'}',

					'gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );',

				'}',

			'}'
        ].join("\n")

    };

    zen3d.ShaderLib = ShaderLib;
})();

(function() {

    // TODO this could move to a new class named WebGLProgram
    // like other WebGL object, program can managed by WebGLProperties

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

        return program;
    }

    var programMap = {};

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
     * WebGL Program
     * @class Program
     */
    var Program = function(gl, vshader, fshader) {

        // vertex shader source
        this.vshaderSource = vshader;

        // fragment shader source
        this.fshaderSource = fshader;

        // WebGL vertex shader
        this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);

        // WebGL fragment shader
        this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);

        // program id
        this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);

        this.uniforms = extractUniforms(gl, this.id);

        this.attributes = extractAttributes(gl, this.id);
    }

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

    /**
     * create program
     */
    function createProgram(gl, props) {

        var basic = props.materialType == MATERIAL_TYPE.BASIC;
        var cube = props.materialType == MATERIAL_TYPE.CUBE;

        var vertex = zen3d.ShaderLib.vertexBase;
        var fragment = zen3d.ShaderLib.fragmentBase;

        switch (props.materialType) {
            case MATERIAL_TYPE.BASIC:
                vertex = zen3d.ShaderLib.basicVertex;
                fragment = zen3d.ShaderLib.basicFragment;
                break;
            case MATERIAL_TYPE.LAMBERT:
                vertex = zen3d.ShaderLib.lambertVertex;
                fragment = zen3d.ShaderLib.lambertFragment;
                break;
            case MATERIAL_TYPE.PHONG:
                vertex = zen3d.ShaderLib.phongVertex;
                fragment = zen3d.ShaderLib.phongFragment;
                break;
            case MATERIAL_TYPE.CUBE:
                vertex = zen3d.ShaderLib.cubeVertex;
                fragment = zen3d.ShaderLib.cubeFragment;
                break;
            case MATERIAL_TYPE.POINT:
                vertex = zen3d.ShaderLib.pointsVertex;
                fragment = zen3d.ShaderLib.pointsFragment;
                break;
            default:

        }

        var vshader_define, fshader_define;
        if (basic) {
            vshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : ''
            ].join("\n");
            fshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
                props.fog ? '#define USE_FOG' : '',
                props.fogExp2 ? '#define USE_EXP2_FOG' : ''
            ].join("\n");
        } else if (cube) {
            vshader_define = [
                ""
            ].join("\n");
            fshader_define = [
                ""
            ].join("\n");
        } else {
            vshader_define = [
                (props.pointLightNum > 0) ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
                (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
                (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
                (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.useShadow ? '#define USE_SHADOW' : '',

                props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
                props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '',
                props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : ''
            ].join("\n");
            fshader_define = [
                (props.pointLightNum) > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
                (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
                (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
                (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
                (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
                ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : '',
                props.useShadow ? '#define USE_SHADOW' : '',
                props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
                props.fog ? '#define USE_FOG' : '',
                props.fogExp2 ? '#define USE_EXP2_FOG' : '',

                props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
                props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : ''
            ].join("\n");
        }

        var vshader = [
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            vshader_define,
            vertex
        ].join("\n");

        var fshader = [
            '#extension GL_OES_standard_derivatives : enable',
            'precision ' + props.precision + ' float;',
            'precision ' + props.precision + ' int;',
            fshader_define,
            '#define LOG2 1.442695',
            '#define saturate(a) clamp( a, 0.0, 1.0 )',
            '#define whiteCompliment(a) ( 1.0 - saturate( a ) )',
            fragment
        ].join("\n");

        return new Program(gl, vshader, fshader);
    }

    /**
     * get a suitable program by object & lights & fog
     */
    var getProgram = function(gl, render, object, lightsNum, fog) {

        var material = object.material;

        if(material.type === MATERIAL_TYPE.CANVAS2D) {
            return getCanvas2DProgram(gl, render);
        }

        var ambientLightNum = lightsNum[0],
            directLightNum = lightsNum[1],
            pointLightNum = lightsNum[2],
            spotLightNum = lightsNum[3];

        var precision = render.capabilities.maxPrecision;

        var props = {
            precision: precision,
            useDiffuseMap: !!material.map,
            useNormalMap: !!material.normalMap,
            useEnvMap: !!material.envMap,
            useDiffuseColor: !material.map,
            ambientLightNum: ambientLightNum,
            directLightNum: directLightNum,
            pointLightNum: pointLightNum,
            spotLightNum: spotLightNum,
            materialType: material.type,
            useShadow: object.receiveShadow,
            premultipliedAlpha: material.premultipliedAlpha,
            fog: !!fog,
            fogExp2: !!fog && (fog.fogType === zen3d.FOG_TYPE.EXP2),
            sizeAttenuation: material.sizeAttenuation
        };

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

    /**
     * get depth program, used to render depth map
     */
    var getDepthProgram = function(gl, render) {
        var program;
        var map = programMap;
        var code = "depth";

        var precision = render.capabilities.maxPrecision;

        if (map[code]) {
            program = map[code];
        } else {
            var vshader = [
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.depthVertex
            ].join("\n");

            var fshader = [
                '#extension GL_OES_standard_derivatives : enable',
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.depthFragment
            ].join("\n");

            program = new Program(gl, vshader, fshader);
            map[code] = program;
        }

        return program;
    }

    /**
     * get canvas2d program, used to render canvas 2d
     */
    var getCanvas2DProgram = function(gl, render) {
        var program;
        var map = programMap;
        var code = "canvas2d";

        var precision = render.capabilities.maxPrecision;

        if (map[code]) {
            program = map[code];
        } else {
            var vshader = [
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.canvas2dVertex
            ].join("\n");

            var fshader = [
                '#extension GL_OES_standard_derivatives : enable',
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.canvas2dFragment
            ].join("\n");

            program = new Program(gl, vshader, fshader);
            map[code] = program;
        }

        return program;
    }

    /**
     * get sprite program, used to render sprites
     */
    var getSpriteProgram = function(gl, render) {
        var program;
        var map = programMap;
        var code = "sprite";

        var precision = render.capabilities.maxPrecision;

        if(map[code]) {
            program = map[code];
        } else {
            var vshader = [
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.spriteVertex
            ].join("\n");

            var fshader = [
                '#extension GL_OES_standard_derivatives : enable',
                'precision ' + precision + ' float;',
                'precision ' + precision + ' int;',
                zen3d.ShaderLib.spriteFragment
            ].join("\n");

            program = new Program(gl, vshader, fshader);
            map[code] = program;
        }

        return program;
    }

    zen3d.getProgram = getProgram;
    zen3d.getDepthProgram = getDepthProgram;
    zen3d.getSpriteProgram = getSpriteProgram;
})();
(function() {
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;

    /**
     * Renderer
     * @class
     */
    var Renderer = function(view) {

        // canvas
        this.view = view;
        // gl context
        var gl = this.gl = view.getContext("webgl", {
            antialias: true, // effect performance!! default false
            alpha: false, // effect performance, default false
            // premultipliedAlpha: false, // effect performance, default false
            stencil: true
        });
        // width and height, same with the canvas
        this.width = view.width;
        this.height = view.height;

        this.autoClear = true;

        // init webgl
        var properties = new zen3d.WebGLProperties();
        this.properties = properties;

        var capabilities = new zen3d.WebGLCapabilities(gl);
        this.capabilities = capabilities;

        var state = new zen3d.WebGLState(gl, capabilities);
        state.enable(gl.STENCIL_TEST);
        state.enable(gl.DEPTH_TEST);
        state.setCullFace(CULL_FACE_TYPE.FRONT);
        state.viewport(0, 0, this.width, this.height);
        state.clearColor(0, 0, 0, 0);
        this.state = state;

        this.texture = new zen3d.WebGLTexture(gl, state, properties, capabilities);

        this.geometry = new zen3d.WebGLGeometry(gl, state, properties, capabilities);

        // object cache
        this.cache = new zen3d.RenderCache();

        // use dfdx and dfdy must enable OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "OES_standard_derivatives");
        // GL_OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "GL_OES_standard_derivatives");

        this._usedTextureUnits = 0;

        this._currentRenderTarget = null;
    }

    /**
     * resize
     */
    Renderer.prototype.resize = function(width, height) {
        this.width = width;
        this.height = height;

        this.view.width = width;
        this.view.height = height;

        this.state.viewport(0, 0, width, height);
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {

        scene.updateMatrix();

        camera.viewMatrix.getInverse(camera.worldMatrix); // update view matrix

        this.cache.cacheScene(scene, camera);

        this.cache.sort();

        this.renderShadow();

        if (renderTarget === undefined) {
            renderTarget = null;
        }
        this.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear) {
            this.state.clearColor(0, 0, 0, 0);
            this.clear(true, true, true);
        }

        this.renderList(this.cache.opaqueObjects);
        this.renderList(this.cache.transparentObjects);
        this.renderList(this.cache.canvas2dObjects);

        this.renderSprites(this.cache.sprites);

        this.cache.clear();

        if (renderTarget) {
            this.texture.updateRenderTargetMipmap(renderTarget);
        }
    }

    /**
     * render shadow map for lights
     */
    Renderer.prototype.renderShadow = function() {
        var renderList = this.cache.shadowObjects;

        if (renderList.length == 0) {
            return;
        }

        var gl = this.gl;

        var lights = this.cache.shadowLights;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                this.setRenderTarget(shadowTarget);

                this.state.clearColor(1, 1, 1, 1);
                this.clear(true, true);

                for (var n = 0, l = renderList.length; n < l; n++) {
                    var object = renderList[n];
                    var material = object.material;

                    this.geometry.setGeometry(object.geometry);

                    var program = zen3d.getDepthProgram(gl, this);
                    gl.useProgram(program.id);

                    var a_Position = program.attributes.a_Position;
                    gl.vertexAttribPointer(a_Position.location, a_Position.count, a_Position.format, false, 4 * 17, 0);
                    gl.enableVertexAttribArray(a_Position.location);

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
                        }
                    }

                    this.state.setBlend(BLEND_TYPE.NONE);
                    this.state.enable(gl.DEPTH_TEST);

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

        var ambientLights = this.cache.ambientLights;
        var directLights = this.cache.directLights;
        var pointLights = this.cache.pointLights;
        var spotLights = this.cache.spotLights;
        var ambientLightsNum = ambientLights.length;
        var directLightsNum = directLights.length;
        var pointLightsNum = pointLights.length;
        var spotLightsNum = spotLights.length;
        var lightsNum = ambientLightsNum + directLightsNum + pointLightsNum + spotLightsNum;

        for (var i = 0, l = renderList.length; i < l; i++) {

            var renderItem = renderList[i];
            var object = renderItem.object;
            var material = renderItem.material;
            var geometry = renderItem.geometry;

            this.geometry.setGeometry(geometry);

            var program = zen3d.getProgram(gl, this, object, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum,
                spotLightsNum
            ], fog);
            gl.useProgram(program.id);

            // update attributes
            var attributes = program.attributes;
            for (var key in attributes) {
                var attribute = attributes[key];
                switch (key) {
                    case "a_Position":
                        gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 0);
                        break;
                    case "a_Normal":
                        gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 4 * 3);
                        break;
                    case "a_Uv":
                        if (object.type === zen3d.OBJECT_TYPE.CANVAS2D) {
                            gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 4 * 3);
                        } else {
                            gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 4 * 13);
                        }
                        break;
                    default:
                        console.warn("attribute " + key + " not found!");
                }
                gl.enableVertexAttribArray(attribute.location);
            }

            // update uniforms
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
                        var color = material.color;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_Opacity":
                        uniform.setValue(material.opacity);
                        break;

                    case "texture":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.map, slot);
                        uniform.setValue(slot);
                        break;
                    case "normalMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.normalMap, slot);
                        uniform.setValue(slot);
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
                        uniform.setValue(material.specular);
                        break;
                    case "u_SpecularColor":
                        var color = material.specularColor;
                        uniform.setValue(color.r, color.g, color.b, 1);
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
                }
            }

            /////////////////light
            var basic = material.type === MATERIAL_TYPE.BASIC;
            var cube = material.type === MATERIAL_TYPE.CUBE;
            var points = material.type === MATERIAL_TYPE.POINT;
            var canvas2d = object.type === zen3d.OBJECT_TYPE.CANVAS2D;

            if (!basic && !cube && !points && !canvas2d) {
                for (var k = 0; k < ambientLightsNum; k++) {
                    var light = ambientLights[k];

                    var intensity = light.intensity;
                    var color = light.color;

                    var u_Ambient_intensity = uniforms["u_Ambient[" + k + "].intensity"];
                    var u_Ambient_color = uniforms["u_Ambient[" + k + "].color"];
                    u_Ambient_intensity.setValue(intensity);
                    u_Ambient_color.setValue(color.r, color.g, color.b, 1);
                }


                for (var k = 0; k < directLightsNum; k++) {
                    var light = directLights[k];

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

                    if (light.castShadow && object.receiveShadow) {
                        var directionalShadowMatrix = uniforms["directionalShadowMatrix[" + k + "]"];
                        directionalShadowMatrix.setValue(light.shadow.matrix.elements);

                        var directionalShadowMap = uniforms["directionalShadowMap[" + k + "]"];
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(light.shadow.map, slot);
                        directionalShadowMap.setValue(slot);
                    }

                }

                for (var k = 0; k < pointLightsNum; k++) {
                    var light = pointLights[k];

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

                    if (light.castShadow && object.receiveShadow) {
                        var pointShadowMap = uniforms["pointShadowMap[" + k + "]"];
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(light.shadow.map, slot);
                        pointShadowMap.setValue(slot);
                    }
                }

                for (var k = 0; k < spotLightsNum; k++) {
                    var light = spotLights[k];

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

                    if (light.castShadow && object.receiveShadow) {
                        var spotShadowMatrix = uniforms["spotShadowMatrix[" + k + "]"];
                        spotShadowMatrix.setValue(light.shadow.matrix.elements);

                        var spotShadowMap = uniforms["spotShadowMap[" + k + "]"];
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(light.shadow.map, slot);
                        spotShadowMap.setValue(slot);
                    }
                }
            }
            ///////

            // set blend
            if (material.transparent) {
                this.state.setBlend(material.blending, material.premultipliedAlpha);
            } else {
                this.state.setBlend(BLEND_TYPE.NONE);
            }

            // set depth test
            if (material.depthTest) {
                this.state.enable(gl.DEPTH_TEST);
            } else {
                this.state.disable(gl.DEPTH_TEST);
            }

            // draw
            if (object.type === zen3d.OBJECT_TYPE.POINT) {
                gl.drawArrays(gl.POINTS, 0, geometry.getVerticesCount());
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

        // bind a shared geometry
        this.geometry.setGeometry(zen3d.Sprite.geometry);

        var program = zen3d.getSpriteProgram(gl, this);
        gl.useProgram(program.id);

        var attributes = program.attributes;
        var position = attributes.position;
        gl.vertexAttribPointer(position.location, position.count, position.format, false, 2 * 8, 0);
        gl.enableVertexAttribArray(position.location);
        var uv = attributes.uv;
        gl.vertexAttribPointer(uv.location, uv.count, uv.format, false, 2 * 8, 8);
        gl.enableVertexAttribArray(uv.location);

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

            if (material.map !== null) {
                // TODO offset
                // uniforms.uvOffset.setValue(uniforms.uvOffset, material.map.offset.x, material.map.offset.y);
                // uniforms.uvScale.setValue(uniforms.uvScale, material.map.repeat.x, material.map.repeat.y);
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            } else {
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            }

            uniforms.opacity.setValue(material.opacity);
            uniforms.color.setValue(material.color.r, material.color.g, material.color.b);

            uniforms.rotation.setValue(material.rotation);
            uniforms.scale.setValue(scale);

            // set blend
            if (material.transparent) {
                this.state.setBlend(material.blending, material.premultipliedAlpha);
            } else {
                this.state.setBlend(BLEND_TYPE.NONE);
            }

            // set depth test
            if (material.depthTest) {
                this.state.enable(gl.DEPTH_TEST);
            } else {
                this.state.disable(gl.DEPTH_TEST);
            }

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(material.map, slot);
            uniforms.map.setValue(slot);

            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

            // reset used tex Unit
            this._usedTextureUnits = 0;
        }

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

                this.state.viewport(0, 0, this.width, this.height);
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

        // lights
        this.ambientLights = new Array();
        this.directLights = new Array();
        this.pointLights = new Array();
        this.spotLights = new Array();

        this.shadowLights = new Array();

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
            case OBJECT_TYPE.CANVAS2D:
            case OBJECT_TYPE.MESH:

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
            case OBJECT_TYPE.LIGHT:
                if (object.lightType == LIGHT_TYPE.AMBIENT) {
                    this.ambientLights.push(object);
                } else if (object.lightType == LIGHT_TYPE.DIRECT) {
                    this.directLights.push(object);
                } else if (object.lightType == LIGHT_TYPE.POINT) {
                    this.pointLights.push(object);
                } else if (object.lightType == LIGHT_TYPE.SPOT) {
                    this.spotLights.push(object);
                }

                if (object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
                    this.shadowLights.push(object);
                }

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

        this.ambientLights.length = 0;
        this.directLights.length = 0;
        this.pointLights.length = 0;
        this.spotLights.length = 0;

        this.shadowLights.length = 0;
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

        this.boundingBox = new zen3d.Box3();

        this.boundingSphere = new zen3d.Sphere();

        this.dirty = true;
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

        this.buildGeometry(width, height, depth, (front == void 0) ? true : front);
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
                0, 2, 1, 3, 5, 4,
                6, 8, 7, 9, 11, 10,
                12, 14, 13, 15, 17, 16,
                18, 20, 19, 21, 23, 22,
                24, 26, 25, 27, 29, 28,
                30, 32, 31, 33, 35, 34);
        } else {
            this.indicesArray.push(
                0, 1, 2, 3, 4, 5,
                6, 7, 8, 9, 10, 11,
                12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23,
                24, 25, 26, 27, 28, 29,
                30, 31, 32, 33, 34, 35);
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
                    indexData[numIndices++] = (base + tw + 1) * mult;
                    indexData[numIndices++] = (base + tw) * mult;

                    indexData[numIndices++] = base * mult;
                    indexData[numIndices++] = (base + 1) * mult;
                    indexData[numIndices++] = (base + tw + 1) * mult;

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
    var SphereGeometry = function(radius, segmentsW, segmentsH) {
        SphereGeometry.superClass.constructor.call(this);

        this.buildGeometry(radius, segmentsW || 20, segmentsH || 20);
    }

    zen3d.inherit(SphereGeometry, zen3d.Geometry);

    SphereGeometry.prototype.buildGeometry = function(radius, segmentsW, segmentsH) {
        var front = true;

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
                            indexData[triIndex++] = d;
                            indexData[triIndex++] = c;
                        }
                        else {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = d;
                        }


                    } else if (j == 1) {

                        if (front) {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = b;
                        }
                        else {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = b;
                            indexData[triIndex++] = c;
                        }


                    } else {

                        if (front) {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = d
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c;
                            indexData[triIndex++] = b;
                        }
                        else {
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = c
                            indexData[triIndex++] = d;
                            indexData[triIndex++] = a;
                            indexData[triIndex++] = b;
                            indexData[triIndex++] = c;
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

        this.generateMipmaps = true;

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

        zen3d.requireImage(src, function(image) {
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
            zen3d.requireImage(srcArray[count], next);
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
    /**
     * base material class
     * @class
     */
    var Material = function() {

        // material type
        this.type = "";

        // material color
        this.color = new zen3d.Color3(0xffffff);

        // material map
        this.map = null;

        this.opacity = 1;

        this.transparent = false;

        this.premultipliedAlpha = false;

        // normal map
        this.normalMap = null;

        // env map
        this.envMap = null;
        this.envMapIntensity = 1;

        //blending
        this.blending = zen3d.BLEND_TYPE.NORMAL;

        // depth test
        this.depthTest = true;
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

        this.specular = 30;

        this.specularColor = new zen3d.Color3(0xffffff);
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

        // size force to 1024x1024
        this.renderTarget = new zen3d.RenderTarget2D(1024, 1024);

        var map = this.renderTarget.texture;
        map.generateMipmaps = false;
        map.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.map = map;

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

        // size force to 1024x1024
        this.renderTarget = new zen3d.RenderTarget2D(1024, 1024);

        var map = this.renderTarget.texture;
        map.generateMipmaps = false;
        map.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.map = map;

        this._lookTarget = new zen3d.Vector3();

        this._up = new zen3d.Vector3(0, 1, 0);
    }

    /**
     * update by light
     */
    SpotLightShadow.prototype.update = function(light) {
        this._updateCamera(light);
        this._updateMatrix();
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

        // size force to 1024x1024
        this.renderTarget = new zen3d.RenderTargetCube(512, 512);

        var map = this.renderTarget.texture;
        map.generateMipmaps = false;
        map.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.map = map;

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

        return function getWorldQuaternion(optionalTarget) {

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

    // all sprites used one shared geometry
    var sharedGeometry = new zen3d.Geometry();
    sharedGeometry.verticesArray = [-0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1, -0.5, 0.5, 0, 1
    ];
    sharedGeometry.indicesArray = [
        2, 1, 0,
        3, 2, 0
    ];
    sharedGeometry.vertexSize = 4;

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

    AssimpJsonLoader.prototype.load = function(url, onLoad) {
        this.texturePath = this.extractUrlBase(url);

        zen3d.requireHttp(url, function(json) {
            var group = this.parse(json);
            onLoad(group);
        }.bind(this), function() {
            console.log("load assimp2json error!");
        }, {
            parse: true
        });
    }

    AssimpJsonLoader.prototype.parse = function(json) {
        var meshes = this.parseList ( json.meshes, this.parseMesh );
		var materials = this.parseList ( json.materials, this.parseMaterial );
		return this.parseObject( json, json.rootnode, meshes, materials );
    }

    AssimpJsonLoader.prototype.parseList = function(json, handler) {
        var arrays = new Array( json.length );
		for ( var i = 0; i < json.length; ++ i ) {

			arrays[ i ] = handler.call( this, json[ i ] );

		}
		return arrays;
    }

    AssimpJsonLoader.prototype.parseMaterial = function(json) {
        var material = new zen3d.PhongMaterial();

        var map = null;
        var normalMap = null;

        var prop = json.properties;

        for(var key in json.properties) {
            prop = json.properties[key];

            if ( prop.key === '$tex.file' ) {
                // prop.semantic gives the type of the texture
    			// 1: diffuse
    			// 2: specular mao
    			// 5: height map (bumps)
    			// 6: normal map
                if(prop.semantic == 1) {
                    var material_url = this.texturePath + prop.value;
					material_url = material_url.replace( /.\\/g, '' );
                    map = new zen3d.Texture2D.fromSrc(material_url);
                    // TODO: read texture settings from assimp.
					// Wrapping is the default, though.
					map.wrapS = map.wrapT = zen3d.WEBGL_TEXTURE_WRAP.REPEAT;
                } else if(prop.semantic == 2) {

                } else if(prop.semantic == 5) {

                } else if(prop.semantic == 6) {
                    var material_url = this.texturePath + prop.value;
					material_url = material_url.replace( /.\\/g, '' );
                    normalMap = new zen3d.Texture2D.fromSrc(material_url);
                    // TODO: read texture settings from assimp.
					// Wrapping is the default, though.
					map.wrapS = map.wrapT = zen3d.WEBGL_TEXTURE_WRAP.REPEAT;
                }
            } else if ( prop.key === '?mat.name' ) {

			} else if ( prop.key === '$clr.diffuse' ) {

			} else if ( prop.key === '$clr.specular' ) {

			} else if ( prop.key === '$clr.emissive' ) {

			} else if ( prop.key === '$mat.opacity' ) {
                material.transparent = prop.value < 1;
                material.opacity = prop.value;
            } else if ( prop.key === '$mat.shadingm' ) {
				// Flat shading?
				if ( prop.value === 1 ) {

				}
			} else if ( prop.key === '$mat.shininess' ) {
                material.specular = prop.value;
			}
        }

        material.map = map;
        material.normalMap = normalMap;

        return material;
    }

    AssimpJsonLoader.prototype.parseMesh = function(json) {
        var geometry = new zen3d.Geometry();

        var faces = json.faces;
        var vertices = json.vertices;
        var normals = json.normals;
        var texturecoords = json.texturecoords[0];
        var verticesCount = vertices.length / 3;
        var g_v = geometry.verticesArray;
        for(var i = 0; i < verticesCount; i++) {
            g_v.push(vertices[i * 3 + 0]);
            g_v.push(vertices[i * 3 + 1]);
            g_v.push(vertices[i * 3 + 2]);

            g_v.push(normals[i * 3 + 0]);
            g_v.push(normals[i * 3 + 1]);
            g_v.push(normals[i * 3 + 2]);

            g_v.push(0);
            g_v.push(0);
            g_v.push(0);

            g_v.push(1);
            g_v.push(1);
            g_v.push(1);
            g_v.push(1);

            // uv1
            if(texturecoords) {
                g_v.push(texturecoords[i * 2 + 0]);
                g_v.push(1 - texturecoords[i * 2 + 1]);
            } else {
                g_v.push(0);
                g_v.push(0);
            }

            g_v.push(0);
            g_v.push(0);
        }

        var g_i = geometry.indicesArray;
        for(var i = 0; i < faces.length; i++) {
            g_i.push(faces[i][2]);
            g_i.push(faces[i][1]);
            g_i.push(faces[i][0]);
        }

        return geometry;
    }

    AssimpJsonLoader.prototype.parseObject = function(json, node, meshes, materials) {
        var group = new zen3d.Group();

        group.name = node.name || "";
		group.matrix.fromArray( node.transformation ).transpose();
		group.matrix.decompose( group.position, group.quaternion, group.scale );

        for(var i = 0, mesh; node.meshes && i < node.meshes.length; ++i) {
			var idx = node.meshes[ i ];
            mesh = new zen3d.Mesh( meshes[ idx ], materials[ json.meshes[ idx ].materialindex ] );
            mesh.frustumCulled = false;
			group.add( mesh );
		}

        for(var i = 0; node.children && i < node.children.length; ++ i) {
			group.add( this.parseObject( json, node.children[ i ], meshes, materials ) );
		}

        return group;
    }

    AssimpJsonLoader.prototype.extractUrlBase = function ( url ) {
		var parts = url.split( '/' );
		parts.pop();
		return ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';
	}

    zen3d.AssimpJsonLoader = AssimpJsonLoader;
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
(function() {
    /**
     * Canvas2D
     * now is alway behind 3d objects...
     *
     * TODO maybe i can add another type of Canvas2D, it can insert to 3D depth test
     * but i think this must request a framebuffer!! *_*
     *
     */
    var Canvas2D = function(width, height) {
        Canvas2D.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.CANVAS2D;

        this.geometry = new zen3d.Geometry();
        this.geometry.vertexSize = 5;
        this.material = new zen3d.Canvas2DMaterial();

        this.width = (width !== undefined) ? width : 0;
        this.height = (height !== undefined) ? height : 0;

        this.sprites = [];
        this.drawArray = [];

        // screen space canvas or world space canvas
        this.isScreenCanvas = true;

        this.frustumCulled = false;

        // screen canvas used ortho camera
        this.orthoCamera = new zen3d.Camera();
        this.orthoCamera.setOrtho(-this.width / 2, this.width / 2, -this.height / 2, this.height / 2, 0, 1);
        this.orthoCamera.viewMatrix.getInverse(this.orthoCamera.worldMatrix); // update view matrix
    }

    zen3d.inherit(Canvas2D, zen3d.Object3D);

    /**
     * add child to canvas2d
     */
    Canvas2D.prototype.add = function(object) {
        this.children.push(object);
    }

    /**
     * remove child from canvas2d
     */
    Canvas2D.prototype.remove = function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    Canvas2D.prototype.updateSprites = function() {
        var geometry = this.geometry;
        var vertices = geometry.verticesArray;
        var indices = geometry.indicesArray;
        var vertexIndex = 0,
            indexIndex = 0;

        var sprites = this.sprites;

        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];

            var x = 0;
            var y = 0;
            var w = sprite.width;
            var h = sprite.height;

            var _x, _y;
            var t = sprite.worldMatrix.elements;
            var a = t[0],
                b = t[1],
                c = t[3],
                d = t[4],
                tx = t[6] - this.width / 2,
                ty = this.height / 2 - t[7] - h;

            _x = x;
            _y = y;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;

            _x = x + w;
            _y = y;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;
            vertices[vertexIndex++] = 1;

            _x = x + w;
            _y = y + h;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;
            vertices[vertexIndex++] = 0;

            _x = x;
            _y = y + h;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;

            var vertCount = vertexIndex / 5 - 4;

            indices[indexIndex++] = vertCount + 2;
            indices[indexIndex++] = vertCount + 1;
            indices[indexIndex++] = vertCount + 0;
            indices[indexIndex++] = vertCount + 0;
            indices[indexIndex++] = vertCount + 3;
            indices[indexIndex++] = vertCount + 2;
        }
        vertices.length = vertexIndex;
        indices.length = indexIndex;

        geometry.dirty = true;

        // drawArray
        this.drawArray = [];
        var currentTexture;
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (currentTexture !== sprite.texture) {
                this.drawArray.push({
                    texture: sprite.texture,
                    count: 1
                });
                currentTexture = sprite.texture;
            } else {
                this.drawArray[this.drawArray.length - 1].count++;
            }
        }

    }

    // override
    Canvas2D.prototype.updateMatrix = function() {
        Canvas2D.superClass.updateMatrix.call(this);

        this.sprites = [];

        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            this.cacheSprites(children[i]);
        }

        var sprites = this.sprites;
        for (var i = 0, l = sprites.length; i < l; i++) {
            sprites[i].updateMatrix();
        }

        // update geometry
        this.updateSprites();
    }

    Canvas2D.prototype.cacheSprites = function(object) {
        var sprites = this.sprites;

        sprites.push(object);

        for(var i = 0, l = object.children.length; i < l; i++) {
            this.cacheSprites(object.children[i]);
        }
    }

    zen3d.Canvas2D = Canvas2D;
})();
(function() {
    /**
     * Canvas2DMaterial
     * @class
     */
    var Canvas2DMaterial = function() {
        Canvas2DMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.CANVAS2D;

        this.depthTest = false;
    }

    zen3d.inherit(Canvas2DMaterial, zen3d.Material);

    zen3d.Canvas2DMaterial = Canvas2DMaterial;
})();

(function() {
    var Object2D = function() {
        this.width = 0;
        this.height = 0;

        // bla bla ...
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.anchorX = 0;
        this.anchorY = 0;

        // a 3x3 transform matrix
        this.matrix = new zen3d.Matrix3();
        // used to cache world transform
        this.worldMatrix = new zen3d.Matrix3();

        // children
        this.children = new Array();
        // parent
        this.parent = null;

        this.boundingBox = new zen3d.Box2();
    }

    /**
     * add child to object2d
     */
    Object2D.prototype.add = function(object) {
        this.children.push(object);
        object.parent = this;
    }

    /**
     * remove child from object2d
     */
    Object2D.prototype.remove = function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        object.parent = null;
    }

    /**
     * get object by name
     */
    Object2D.prototype.getObjectByName = function(name) {
        return this.getObjectByProperty('name', name);
    }

    /**
     * get object by property
     */
    Object2D.prototype.getObjectByProperty = function(name, value) {
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
    Object2D.prototype.updateMatrix = function() {
        var matrix = this.matrix.transform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.anchorX * this.width, this.anchorY * this.height);

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

    Object2D.prototype.computeBoundingBox = function() {
        this.boundingBox.set(this.x, this.y, this.x + this.width, this.y + this.height);
    }

    zen3d.Object2D = Object2D;
})();
(function() {
    var Sprite2D = function() {
        Sprite2D.superClass.constructor.call(this);

        this.texture = null;
    }

    zen3d.inherit(Sprite2D, zen3d.Object2D);

    zen3d.Sprite2D = Sprite2D;
})();