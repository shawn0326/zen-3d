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
     * is mobile
     */
    var isMobile = function() {
        if (!win["navigator"]) {
            return true;
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    }

    zen3d.isMobile = isMobile;

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
     * hex to rgb
     */
    var hex2RGB = function(hex) {
        var r = (hex >> 16) & 0xff;
        var g = (hex >> 8) & 0xff;
        var b = hex & 0xff;

        return [r, g, b];
    }

    zen3d.hex2RGB = hex2RGB;

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
        GROUP: "group"
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
        CUBE: "cube"
    };

    zen3d.MATERIAL_TYPE = MATERIAL_TYPE;

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
        ele[0 ] = n11; ele[4 ] = n12; ele[8 ] = n13; ele[12] = n14;
        ele[1 ] = n21; ele[5 ] = n22; ele[9 ] = n23; ele[13] = n24;
        ele[2 ] = n31; ele[6 ] = n32; ele[10] = n33; ele[14] = n34;
        ele[3 ] = n41; ele[7 ] = n42; ele[11] = n43; ele[15] = n44;

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
    Matrix4.prototype.multiply = function ( m ) {

		return this.multiplyMatrices( this, m );

	}

	Matrix4.prototype.premultiply = function ( m ) {

		return this.multiplyMatrices( m, this );

	}

	Matrix4.prototype.multiplyMatrices = function ( a, b ) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	}

    /**
     * transpose matrix
     **/
    Matrix4.prototype.transpose = function() {

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;
	}

    Matrix4.prototype.inverse = function() {
        return this.getInverse(this);
    }

    Matrix4.prototype.getInverse = function(m) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements,
			me = m.elements,

			n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ], n41 = me[ 3 ],
			n12 = me[ 4 ], n22 = me[ 5 ], n32 = me[ 6 ], n42 = me[ 7 ],
			n13 = me[ 8 ], n23 = me[ 9 ], n33 = me[ 10 ], n43 = me[ 11 ],
			n14 = me[ 12 ], n24 = me[ 13 ], n34 = me[ 14 ], n44 = me[ 15 ],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if ( det === 0 ) {

			console.warn("can't invert matrix, determinant is 0");

			return this.identity();

		}

		var detInv = 1 / det;

		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

		te[ 4 ] = t12 * detInv;
		te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

		te[ 8 ] = t13 * detInv;
		te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

		te[ 12 ] = t14 * detInv;
		te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

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

    Matrix4.prototype.makeRotationFromQuaternion = function ( q ) {

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	}

    var vector, matrix;
    Matrix4.prototype.decompose = function(position, quaternion, scale) {
        if ( vector === undefined ) {
			vector = new zen3d.Vector3();
			matrix = new Matrix4();
		}

        var te = this.elements;

		var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).getLength();
		var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).getLength();
		var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).getLength();

		// if determine is negative, we need to invert one scale
		var det = this.determinant();
		if ( det < 0 ) {
			sx = - sx;
		}

		position.x = te[ 12 ];
		position.y = te[ 13 ];
		position.z = te[ 14 ];

		// scale the rotation part

		matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()

		var invSX = 1 / sx;
		var invSY = 1 / sy;
		var invSZ = 1 / sz;

		matrix.elements[ 0 ] *= invSX;
		matrix.elements[ 1 ] *= invSX;
		matrix.elements[ 2 ] *= invSX;

		matrix.elements[ 4 ] *= invSY;
		matrix.elements[ 5 ] *= invSY;
		matrix.elements[ 6 ] *= invSY;

		matrix.elements[ 8 ] *= invSZ;
		matrix.elements[ 9 ] *= invSZ;
		matrix.elements[ 10 ] *= invSZ;

		quaternion.setFromRotationMatrix( matrix );

		scale.x = sx;
		scale.y = sy;
		scale.z = sz;

		return this;
    }

    Matrix4.prototype.determinant = function () {

		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);

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
     * cross product a vector and return a new instance
     **/
    Vector3.prototype.crossProduct = function(a, target) {
        if (!target) {
            target = new Vector3();
        }
        target.x = this.y * a.z - this.z * a.y;
        target.y = this.z * a.x - this.x * a.z;
        target.z = this.x * a.y - this.y * a.x;
        return target;
    }

    /**
     * dot product a vector and return a new instance
     **/
    Vector3.prototype.dotProduct = function(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }

    /**
     * apply quaternion
     **/
    Vector3.prototype.applyQuaternion = function(q) {

		var x = this.x, y = this.y, z = this.z;
		var qx = q._x, qy = q._y, qz = q._z, qw = q._w;

		// calculate quat * vector

		var ix =  qw * x + qy * z - qz * y;
		var iy =  qw * y + qz * x - qx * z;
		var iz =  qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;
	}

    /**
     * apply quaternion
     **/
    Vector3.prototype.applyMatrix4 = function ( m ) {

		// input: zen3d.Matrix4 affine matrix

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

		return this;

	}

    /**
     * transformDirection
     **/
    Vector3.prototype.transformDirection = function ( m ) {

		// input: zen3d.Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		return this.normalize();

	}

    /**
     * setFromMatrixPosition
     **/
    Vector3.prototype.setFromMatrixPosition = function ( m ) {

		return this.setFromMatrixColumn( m, 3 );

	}

    /**
     * setFromMatrixColumn
     **/
    Vector3.prototype.setFromMatrixColumn = function ( m, index ) {

		return this.fromArray( m.elements, index * 4 );

	}

    /**
     * fromArray
     **/
    Vector3.prototype.fromArray = function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

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

    zen3d.Vector4 = Vector4;
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
                // 'RE_Phong(diffuseColor, light, N, L, V, 4., reflectLight);',
                'RE_BlinnPhong(diffuseColor, light, N, normalize(L), V, u_Specular, reflectLight);',
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
                // 'RE_Phong(diffuseColor, light, N, L, V, 4., reflectLight);',
                'RE_BlinnPhong(diffuseColor, light, N, normalize(L), V, u_Specular, reflectLight);',
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
                    // 'RE_Phong(diffuseColor, light, N, L, V, 4., reflectLight);',
                    'RE_BlinnPhong(diffuseColor, light, N, normalize(L), V, u_Specular, reflectLight);',
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
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                envMap_frag,
                frag_end,
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
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                normal_frag,
                light_frag,
                envMap_frag,
                shadowMap_frag,
                frag_end,
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
            'uniform float u_Specular;',
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
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                normal_frag,
                light_frag,
                envMap_frag,
                shadowMap_frag,
                frag_end,
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
        ].join("\n")

    };

    zen3d.ShaderLib = ShaderLib;
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
        if(!compiled) {
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
            var type = uniformData.type;// analysis

            // TODO get update method

            uniforms[name] = {
                type: type,
                size: uniformData.size,
                location: gl.getUniformLocation(program, name)
            };
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
            var type = attribData.type;

            attributes[name] = {
                type: type,
                size: 1,
                location: gl.getAttribLocation(program, name)
            };
        }

        return attributes;
    }

    /**
     * get max precision
     * @param gl
     * @param precision {string} the expect precision, can be: "highp"|"mediump"|"lowp"
     */
    function getMaxPrecision(gl, precision) {
		if ( precision === 'highp' ) {
			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision > 0 ) {
				return 'highp';
			}
			precision = 'mediump';
		}
		if ( precision === 'mediump' ) {
			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision > 0 ) {
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
        for(var key in props) {
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
            default:

        }

        var vshader_define, fshader_define;
        if(basic) {
            vshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : ''
            ].join("\n");
            fshader_define = [
                props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
                props.useEnvMap ? '#define USE_ENV_MAP' : ''
            ].join("\n");
        } else if(cube) {
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
                props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : ''
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
            fragment
        ].join("\n");

        return new Program(gl, vshader, fshader);
    }

    /**
     * get a suitable program by object & lights
     */
    var getProgram = function(gl, object, lightsNum) {

        var material = object.material;

        var ambientLightNum = lightsNum[0],
        directLightNum = lightsNum[1],
        pointLightNum = lightsNum[2],
        spotLightNum = lightsNum[3]

        var props = {
            precision: getMaxPrecision(gl, "highp"),
            useDiffuseMap: !!material.map,
            useNormalMap: !!material.normalMap,
            useEnvMap: !!material.envMap,
            useDiffuseColor: !material.map,
            ambientLightNum: ambientLightNum,
            directLightNum: directLightNum,
            pointLightNum: pointLightNum,
            spotLightNum: spotLightNum,
            materialType: material.type,
            useShadow: object.receiveShadow
        };

        var code = generateProgramCode(props);
        var map = programMap;
        var program;

        if(map[code]) {
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
    var getDepthProgram = function(gl) {
        var program;
        var map = programMap;
        var code = "depth";
        var precision = getMaxPrecision(gl, "highp");

        if(map[code]) {
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


    zen3d.getProgram = getProgram;
    zen3d.getDepthProgram = getDepthProgram;
})();

(function() {
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;

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
        this.width = view.clientWidth;
        this.height = view.clientHeight;

        // array buffer
        this.vertices = new Float32Array(524288);
        this.vertexBuffer = gl.createBuffer();
        this.indices = new Uint16Array(524288);
        this.indexBuffer = gl.createBuffer();

        // init webgl
        gl.enable(gl.STENCIL_TEST);
        gl.enable(gl.DEPTH_TEST);
        // cull face
        gl.enable(gl.CULL_FACE);
        // gl.FRONT_AND_BACK, gl.FRONT, gl.BACK
        gl.cullFace(gl.BACK);
        // gl.CW, gl.CCW
        gl.frontFace(gl.CW);

        // object cache
        this.cache = new zen3d.RenderCache();

        // camera
        this.camera = null;

        // use dfdx and dfdy must enable OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "OES_standard_derivatives");
        // GL_OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "GL_OES_standard_derivatives");
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera) {

        scene.updateMatrix();

        camera.viewMatrix.getInverse(camera.worldMatrix);// update view matrix
        this.camera = camera;

        this.cache.cache(scene);

        this.cache.sort();

        this.renderShadow();

        this.flush();

        this.cache.clear();
    }

    /**
     * render shadow map for lights
     */
    Renderer.prototype.renderShadow = function() {
        var renderList = this.cache.shadowObjects;

        if(renderList.length == 0) {
            return;
        }

        var gl = this.gl;

        var lights = this.cache.shadowLights;
        for(var i = 0; i < lights.length; i++) {
            var light = lights[i];

            if(!light.shadow.isInit) {
                light.shadow.init(gl);
            }

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;

            this.setRenderTarget(shadowTarget);

            for(var j = 0; j < faces; j++) {

                if(isPointLight) {
                    shadow.update(light, j);
                    // bind faces
                    shadowTarget.bindTextureCube(shadow.map, j);
                } else {
                    shadow.update(light);
                }

                gl.clearColor(1., 1., 1., 1.);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                for(var n = 0, l = renderList.length; n < l; n++) {
                    var object = renderList[n];
                    var material = object.material;

                    var offset = this._uploadGeometry(object.geometry);

                    var program = zen3d.getDepthProgram(gl);
                    gl.useProgram(program.id);

                    var location = program.attributes.a_Position.location;
                    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 4 * 17, 0);
                    gl.enableVertexAttribArray(location);

                    // update uniforms
                    var uniforms = program.uniforms;
                    for(var key in uniforms) {
                        var location = uniforms[key].location;
                        switch(key) {
                            // pvm matrix
                            case "u_Projection":
                                var projectionMat = camera.projectionMatrix.elements;
                                gl.uniformMatrix4fv(location, false, projectionMat);
                                break;
                            case "u_View":
                                var viewMatrix = camera.viewMatrix.elements;
                                gl.uniformMatrix4fv(location, false, viewMatrix);
                                break;
                            case "u_Model":
                                var modelMatrix = object.worldMatrix.elements;
                                gl.uniformMatrix4fv(location, false, modelMatrix);
                                break;
                            case "lightPos":
                                helpVector3.setFromMatrixPosition(light.worldMatrix);
                                gl.uniform3f(location, helpVector3.x, helpVector3.y, helpVector3.z);
                        }
                    }

                    gl.disable(gl.BLEND);

                    // draw
                    gl.drawElements(gl.TRIANGLES, offset, gl.UNSIGNED_SHORT, 0);
                }

            }

            this.clearRenderTarget();
        }
    }

    /**
     * flush
     */
    Renderer.prototype.flush = function() {
        this.flushList(this.cache.opaqueObjects);
        this.flushList(this.cache.transparentObjects);
    }

    var helpVector3 = new zen3d.Vector3();

    Renderer.prototype.flushList = function(renderList) {
        var camera = this.camera;
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

        for(var i = 0, l = renderList.length; i < l; i++) {

            var object = renderList[i];
            var material = object.material;

            var offset = this._uploadGeometry(object.geometry);

            // get program
            var program = zen3d.getProgram(gl, object, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum,
                spotLightsNum
            ]);
            gl.useProgram(program.id);

            // update attributes
            var attributes = program.attributes;
            for(var key in attributes) {
                var location = attributes[key].location;
                switch(key) {
                    case "a_Position":
                        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 4 * 17, 0);
                        break;
                    case "a_Normal":
                        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 4 * 17, 4 * 3);
                        break;
                    case "a_Uv":
                        gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 4 * 17, 4 * 13);
                        break;
                    default:
                        console.warn("attribute " + key + " not found!");
                }
                gl.enableVertexAttribArray(location);
            }

            // update uniforms
            var uniforms = program.uniforms;
            for(var key in uniforms) {
                var location = uniforms[key].location;
                switch(key) {

                    // pvm matrix
                    case "u_Projection":
                        var projectionMat = camera.projectionMatrix.elements;
                        gl.uniformMatrix4fv(location, false, projectionMat);
                        break;
                    case "u_View":
                        var viewMatrix = camera.viewMatrix.elements;
                        gl.uniformMatrix4fv(location, false, viewMatrix);
                        break;
                    case "u_Model":
                        var modelMatrix = object.worldMatrix.elements;
                        gl.uniformMatrix4fv(location, false, modelMatrix);
                        break;

                    case "u_Color":
                        var color = zen3d.hex2RGB(material.color);
                        gl.uniform3f(location, color[0] / 255, color[1] / 255, color[2] / 255);
                        break;
                    case "u_Opacity":
                        gl.uniform1f(location, material.opacity);
                        break;

                    case "texture":
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, material.map.glTexture);
                        gl.uniform1i(location, 0);
                        break;
                    case "normalMap":
                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, material.normalMap.glTexture);
                        gl.uniform1i(location, 1);
                        break;
                    case "envMap":
                        gl.activeTexture(gl.TEXTURE2);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, material.envMap.glTexture);
                        gl.uniform1i(location, 2);
                        break;
                    case "cubeMap":
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, material.cubeMap.glTexture);
                        gl.uniform1i(location, 0);
                        break;

                    case "u_EnvMap_Intensity":
                        gl.uniform1f(location, material.envMapIntensity);
                        break;
                    case "u_Specular":
                        var specular = material.specular;
                        gl.uniform1f(location, specular);
                        break;
                    case "u_CameraPosition":
                        helpVector3.setFromMatrixPosition(camera.worldMatrix);
                        gl.uniform3f(location, helpVector3.x, helpVector3.y, helpVector3.z);
                        break;
                }
            }

            /////////////////light
            var basic = material.type == MATERIAL_TYPE.BASIC;
            var cube = material.type == MATERIAL_TYPE.CUBE;

            if(!basic && !cube) {
                for(var k = 0; k < ambientLightsNum; k++) {
                    var light = ambientLights[k];

                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);

                    var u_Ambient_intensity = uniforms["u_Ambient[" + k + "].intensity"].location;
                    var u_Ambient_color = uniforms["u_Ambient[" + k + "].color"].location;
                    gl.uniform4f(u_Ambient_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                    gl.uniform1f(u_Ambient_intensity, intensity);
                }


                for(var k = 0; k < directLightsNum; k++) {
                    var light = directLights[k];

                    var intensity = light.intensity;
                    light.getWorldDirection(helpVector3);
                    helpVector3.transformDirection(camera.viewMatrix);
                    var color = zen3d.hex2RGB(light.color);

                    var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"].location;
                    var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"].location;
                    var u_Directional_color = uniforms["u_Directional[" + k + "].color"].location;
                    gl.uniform3f(u_Directional_direction, helpVector3.x, helpVector3.y, helpVector3.z);
                    gl.uniform1f(u_Directional_intensity, intensity);
                    gl.uniform4f(u_Directional_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);

                    // shadow
                    var u_Directional_shadow = uniforms["u_Directional[" + k + "].shadow"].location;
                    gl.uniform1i(u_Directional_shadow, light.castShadow ? 1 : 0);

                    if(light.castShadow && object.receiveShadow && light.shadow.isInit) {
                        var directionalShadowMatrix = uniforms["directionalShadowMatrix[" + k + "]"].location;
                        gl.uniformMatrix4fv(directionalShadowMatrix, false, light.shadow.matrix.elements);

                        var directionalShadowMap = uniforms["directionalShadowMap[" + k + "]"].location;
                        gl.activeTexture(gl.TEXTURE3);
                        gl.bindTexture(gl.TEXTURE_2D, light.shadow.map.glTexture);
                        gl.uniform1i(directionalShadowMap, 3);
                    }

                }

                for(var k = 0; k < pointLightsNum; k++) {
                    var light = pointLights[k];

                    helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);
                    var distance = light.distance;
                    var decay = light.decay;

                    var u_Point_position = uniforms["u_Point[" + k + "].position"].location;
                    gl.uniform3f(u_Point_position, helpVector3.x, helpVector3.y, helpVector3.z);
                    var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"].location;
                    gl.uniform1f(u_Point_intensity, intensity);
                    var u_Point_color = uniforms["u_Point[" + k + "].color"].location;
                    gl.uniform4f(u_Point_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                    var u_Point_distance = uniforms["u_Point[" + k + "].distance"].location;
                    gl.uniform1f(u_Point_distance, distance);
                    var u_Point_decay = uniforms["u_Point[" + k + "].decay"].location;
                    gl.uniform1f(u_Point_decay, decay);

                    // shadow
                    var u_Point_shadow = uniforms["u_Point[" + k + "].shadow"].location;
                    gl.uniform1i(u_Point_shadow, light.castShadow ? 1 : 0);

                    if(light.castShadow && object.receiveShadow && light.shadow.isInit) {
                        var pointShadowMap = uniforms["pointShadowMap[" + k + "]"].location;
                        gl.activeTexture(gl.TEXTURE3);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, light.shadow.map.glTexture);
                        gl.uniform1i(pointShadowMap, 3);
                    }
                }

                for(var k = 0; k < spotLightsNum; k++) {
                    var light = spotLights[k];

                    helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

                    var u_Spot_position = uniforms["u_Spot[" + k + "].position"].location;
                    gl.uniform3f(u_Spot_position, helpVector3.x, helpVector3.y, helpVector3.z);

                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);
                    var distance = light.distance;
                    var decay = light.decay;

                    light.getWorldDirection(helpVector3);
                    helpVector3.transformDirection(camera.viewMatrix);

                    var u_Spot_direction = uniforms["u_Spot[" + k + "].direction"].location;
                    gl.uniform3f(u_Spot_direction, helpVector3.x, helpVector3.y, helpVector3.z);

                    var u_Spot_intensity = uniforms["u_Spot[" + k + "].intensity"].location;
                    gl.uniform1f(u_Spot_intensity, intensity);
                    var u_Spot_color = uniforms["u_Spot[" + k + "].color"].location;
                    gl.uniform4f(u_Spot_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                    var u_Spot_distance = uniforms["u_Spot[" + k + "].distance"].location;
                    gl.uniform1f(u_Spot_distance, distance);
                    var u_Spot_decay = uniforms["u_Spot[" + k + "].decay"].location;
                    gl.uniform1f(u_Spot_decay, decay);

                    var coneCos = Math.cos( light.angle );
                    var penumbraCos = Math.cos( light.angle * ( 1 - light.penumbra ) );
                    var u_Spot_coneCos = uniforms["u_Spot[" + k + "].coneCos"].location;
                    gl.uniform1f(u_Spot_coneCos, coneCos);
                    var u_Spot_penumbraCos = uniforms["u_Spot[" + k + "].penumbraCos"].location;
                    gl.uniform1f(u_Spot_penumbraCos, penumbraCos);

                    // shadow
                    var u_Spot_shadow = uniforms["u_Spot[" + k + "].shadow"].location;
                    gl.uniform1i(u_Spot_shadow, light.castShadow ? 1 : 0);

                    if(light.castShadow && object.receiveShadow && light.shadow.isInit) {
                        var spotShadowMatrix = uniforms["spotShadowMatrix[" + k + "]"].location;
                        gl.uniformMatrix4fv(spotShadowMatrix, false, light.shadow.matrix.elements);

                        var spotShadowMap = uniforms["spotShadowMap[" + k + "]"].location;
                        gl.activeTexture(gl.TEXTURE3);
                        gl.bindTexture(gl.TEXTURE_2D, light.shadow.map.glTexture);
                        gl.uniform1i(spotShadowMap, 3);
                    }
                }
            }
            ///////

            if(material.transparent) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            } else {
                gl.disable(gl.BLEND);
            }

            // draw
            gl.drawElements(gl.TRIANGLES, offset, gl.UNSIGNED_SHORT, 0);
        }
    }

    /**
     * update geometry to GPU
     * @return offset {number}
     */
    Renderer.prototype._uploadGeometry = function(geometry) {
        var vertices = this.vertices;
        var indices = this.indices;

        var verticesIndex = 0;
        var indicesIndex = 0;
        // copy vertices
        for(var j = 0, verticesArray = geometry.verticesArray, verticesLen = verticesArray.length; j < verticesLen; j++) {
            vertices[verticesIndex++] = verticesArray[j];
        }
        // copy indices
        for(var k = 0, indicesArray = geometry.indicesArray, indicesLen = indicesArray.length; k < indicesLen; k++) {
            indices[indicesIndex++] = indicesArray[k];
        }

        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var vertices_view = vertices.subarray(0, verticesIndex);
        gl.bufferData(gl.ARRAY_BUFFER, vertices_view, gl.STREAM_DRAW);
        var indices_view = indices.subarray(0, indicesIndex);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices_view, gl.STATIC_DRAW);

        return indicesIndex;
    }

    /**
     * set render target
     */
    Renderer.prototype.setRenderTarget = function(target) {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, target.frameBuffer);

        gl.viewport(0, 0, target.width, target.height);
    }

    /**
     * clear render target
     */
    Renderer.prototype.clearRenderTarget = function() {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.viewport(0, 0, this.width, this.height);
    }

    /**
     * clear buffer
     */
    Renderer.prototype.clear = function() {
        var gl = this.gl;

        gl.clearColor(0., 0., 0., 0.);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
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

        this.shadowObjects = new Array();

        // lights
        this.ambientLights = new Array();
        this.directLights = new Array();
        this.pointLights = new Array();
        this.spotLights = new Array();

        this.shadowLights = new Array();
    }

    /**
     * cache object
     */
    RenderCache.prototype.cache = function(object) {

        // cache all type of objects
        switch (object.type) {
            case OBJECT_TYPE.MESH:
                var material = object.material;

                if(material.checkMapInit()) {
                    if(material.transparent) {
                        this.transparentObjects.push(object);
                    } else {
                        this.opaqueObjects.push(object);
                    }

                    if(object.castShadow) {
                        this.shadowObjects.push(object);
                    }
                }
                break;
            case OBJECT_TYPE.LIGHT:
                if(object.lightType == LIGHT_TYPE.AMBIENT) {
                    this.ambientLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.DIRECT) {
                    this.directLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.POINT) {
                    this.pointLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.SPOT) {
                    this.spotLights.push(object);
                }

                if(object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
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
        var children = object.children;
		for ( var i = 0, l = children.length; i < l; i ++ ) {
			this.cache(children[i]);
		}
    }

    /**
     * sort render list
     */
    RenderCache.prototype.sort = function() {
        // opaque objects render from front to back
        this.opaqueObjects.sort(function(a, b) {
            var za = a.position.z;
            var zb = b.position.z;
            return za - zb;
        });

        // transparent objects render from back to front
        this.transparentObjects.sort(function(a, b) {
            var za = a.position.z;
            var zb = b.position.z;
            return zb - za;
        });
    }

    /**
     * clear
     */
    RenderCache.prototype.clear = function() {
        this.transparentObjects.length = 0;
        this.opaqueObjects.length = 0;

        this.shadowObjects.length = 0;

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
     * RenderTarget Class
     * it's actrually a framebuffer with a needed renderbuffer(or not)
     * @class
     */
    var RenderTarget = function(gl, width, height) {
        this.gl = gl;

        this.width = width;
        this.height = height;

        this.frameBuffer = gl.createFramebuffer();

        this.renderBuffer = null;
    }

    /**
     * bind the render target
     *
     */
    RenderTarget.prototype.bind = function() {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        return this;
    }

    /**
     * unbind the render target
     *
     */
    RenderTarget.prototype.unbind = function() {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return this;
    }

    /**
     * attach a render buffer
     * @param [type] {string} "depth": gl.DEPTH_ATTACHMENT, "default": gl.DEPTH_STENCIL_ATTACHMENT
     */
    RenderTarget.prototype.attachRenderBuffer = function(type) {
        var gl = this.gl;

        var renderBuffer = gl.createRenderbuffer();

        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);

        if(type == "depth") {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        } else if(type == "stencil") {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, this.width, this.height);
        } else {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
        }

        this.renderBuffer = renderBuffer;

        return this;
    }

    /**
     * bind a 2d texture
     * @param texture {TextureCube} texture to bind
     */
    RenderTarget.prototype.bindTexture2D = function(texture) {
        var gl = this.gl;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.glTexture, 0);

        return this;
    }

    /**
     * bind a cube texture
     * @param texture {TextureCube} texture to bind
     * @param faceCode {number} face code order: 0: right, 1: left, 2: up, 3: down, 4: back, 5: front.
     */
    RenderTarget.prototype.bindTextureCube = function(texture, faceCode) {
        var gl = this.gl;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture.faces[faceCode], texture.glTexture, 0);

        return this;
    }

    /**
     * resize render target
     * so we can recycling a render target
     */
    RenderTarget.prototype.resize = function(width, height) {
        // TODO
        // if bind, resize texture
        // if bind, resize renderBuffer
    }

    /**
     * destroy
     */
    RenderTarget.prototype.destroy = function() {
        var gl = this.gl;

        gl.deleteFramebuffer(this.frameBuffer);

        if(this.renderBuffer) {
            gl.deleteRenderbuffer(this.renderBuffer);
        }
    }

    zen3d.RenderTarget = RenderTarget;
})();
(function() {
    /**
     * Object3D
     * @class
     */
    var Object3D = function(geometry, material) {

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

    }

    Object.defineProperties(Object3D.prototype, {
        /**
         * rotation set by euler
         **/
        rotation: {
            get: function () {
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
        if ( index !== - 1 ) {
			this.children.splice(index, 1);
		}
        object.parent = null;
    }

    /**
     * update matrix
     */
    Object3D.prototype.updateMatrix = function() {
        var matrix = this.matrix.transform(this.position, this.scale, this.quaternion);

        this.worldMatrix.copy(matrix);

        if(this.parent) {
            var parentMatrix = this.parent.worldMatrix;
            this.worldMatrix.premultiply(parentMatrix);
        }

        var children = this.children;
        for(var i = 0, l = children.length; i < l; i++) {
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

        return function getWorldDirection( optionalTarget ) {

			var result = optionalTarget || new zen3d.Vector3();

			this.worldMatrix.decompose(position, quaternion, scale );

            result.set(0, 0, 1).applyQuaternion(quaternion);

			return result;

		};
    }();

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
    }

    zen3d.inherit(Scene, zen3d.Object3D);

    zen3d.Scene = Scene;
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
        this.color = 0xffffff;

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
        this.camera = null;

        this.matrix = null;

        // size force to 1024x1024
        this.renderTarget = null;

        this.map = null;

        // the cast shadow window size
        this.windowSize = 500;

        this.isInit = false;

        this._lookTarget = new zen3d.Vector3();

        this._up = new zen3d.Vector3(0, 1, 0);
    }

    /**
     * init
     */
    DirectionalLightShadow.prototype.init = function(gl) {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        // size force to 1024x1024
        this.renderTarget = new zen3d.RenderTarget(gl, 1024, 1024);

        this.map = zen3d.Texture2D.createRenderTexture(gl, 1024, 1024);

        this.renderTarget.bind().attachRenderBuffer("depth").bindTexture2D(this.map).unbind();

        this.isInit = true;
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
        this.camera = null;

        this.matrix = null;

        // size force to 1024x1024
        this.renderTarget = null;

        this.map = null;

        this.isInit = false;

        this._lookTarget = new zen3d.Vector3();

        this._up = new zen3d.Vector3(0, 1, 0);
    }

    /**
     * init
     */
    SpotLightShadow.prototype.init = function(gl) {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        // size force to 1024x1024
        this.renderTarget = new zen3d.RenderTarget(gl, 1024, 1024);

        this.map = zen3d.Texture2D.createRenderTexture(gl, 1024, 1024);

        this.renderTarget.bind().attachRenderBuffer("depth").bindTexture2D(this.map).unbind();

        this.isInit = true;
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
        this.camera = null;

        this.matrix = null;

        // size force to 1024x1024
        this.renderTarget = null;

        this.map = null;

        this.isInit = false;

        this._targets = [
            new zen3d.Vector3( 1, 0, 0 ), new zen3d.Vector3( -1, 0, 0 ), new zen3d.Vector3( 0, 1, 0 ),
            new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, 0, 1 ), new zen3d.Vector3( 0, 0, -1 )
        ];

        this._ups = [
            new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, 0, 1 ),
            new zen3d.Vector3( 0, 0, -1 ), new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, -1, 0 )
        ];

        this._lookTarget = new zen3d.Vector3();
    }

    /**
     * init
     */
    PointLightShadow.prototype.init = function(gl) {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        // size force to 1024x1024
        this.renderTarget = new zen3d.RenderTarget(gl, 512, 512);

        this.map = zen3d.TextureCube.createRenderTexture(gl, 512, 512);

        this.renderTarget.bind().attachRenderBuffer("depth").unbind();

        this.isInit = true;
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
        up.crossProduct(zaxis, xaxis);
        xaxis.normalize();

        var yaxis = new zen3d.Vector3();
        zaxis.crossProduct(xaxis, yaxis);

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

        return function getWorldQuaternion( optionalTarget ) {

			var result = optionalTarget || new zen3d.Vector3();

			this.worldMatrix.decompose(position, quaternion, scale );

            result.set(0, 0, -1).applyQuaternion(quaternion);

			return result;

		};
    }();

    zen3d.Camera = Camera;
})();

(function() {
    /**
     * Geometry data
     * @class
     */
    var Geometry = function() {

        this.verticesArray = new Array();

        this.indicesArray = new Array();

        this.verticesCount = 0;
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

        this.verticesCount = 36;
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

        this.verticesCount = tw * th;
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

        this.verticesCount = (segmentsH + 1) * (segmentsW + 1);
    }

    zen3d.SphereGeometry = SphereGeometry;
})();

(function() {
    /**
     * TextureBase
     * @class
     */
    var TextureBase = function(gl, options) {
        this.gl = gl;

        this.width = 0;
        this.height = 0;

        this.border = 0;

        this.dataFormat = gl.RGBA;

        this.dataType = gl.UNSIGNED_BYTE;

        // gl.NEAREST, gl.LINEAR...(mipmap etc)
        this.magFilter = gl.LINEAR;
        this.minFilter = gl.LINEAR;

        // gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT
        this.wrapS = gl.CLAMP_TO_EDGE;
        this.wrapT = gl.CLAMP_TO_EDGE;

        this.glTexture = gl.createTexture();

        this.isRenderable = false;

        // TODO this can set just as a global props?
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    }

    /**
     * bind texture
     */
    TextureBase.prototype.bind = function() {
        // implemented in sub class
    }

    /**
     * tex parameteri
     */
    TextureBase.prototype.texParam = function() {
        // implemented in sub class
    }

    /**
     * tex image
     */
    TextureBase.prototype.texImage = function() {
        // implemented in sub class
        // this.isRenderable = true;
    }

    /**
     * destory
     */
    TextureBase.prototype.destory = function() {
        var gl = this.gl;
        gl.deleteTexture(this.glTexture);
    }

    zen3d.TextureBase = TextureBase;
})();
(function() {
    /**
     * Texture2D
     * @class
     * @extends TextureBase
     */
    var Texture2D = function(gl, options) {
        Texture2D.superClass.constructor.call(this, gl, options);

    }

    zen3d.inherit(Texture2D, zen3d.TextureBase);

    /**
     * bind texture
     */
    Texture2D.prototype.bind = function() {
        var gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

        return this;
    }

    /**
     * tex parameteri
     */
    Texture2D.prototype.texParam = function() {
        var gl = this.gl;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

        return this;
    }

    /**
     * tex image
     * upload pixels or set size to GPU
     * notice: if width and height are undefined, pixels must has both width and height properties!!
     * @param pixels {} pixels to be upload
     */
    Texture2D.prototype.texImage = function(pixels, width, height) {
        var gl = this.gl;

        if((width !== undefined) && (height !== undefined)) {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.dataFormat, width, height, this.border, this.dataFormat, this.dataType, pixels);

            this.width = width;
            this.height = height;
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.dataFormat, this.dataFormat, this.dataType, pixels);

            this.width = pixels.width;
            this.height = pixels.height;
        }

        this.isRenderable = true;

        return this;
    }

    /**
     * get texture from image|TypedArray|canvas
     */
    Texture2D.fromRes = function(gl, data, width, height) {
        var texture = new Texture2D(gl);

        texture.bind().texParam().texImage(
            data, width, height
        );

        return texture;
    }

    /**
     * get texture from jpg|png|jpeg src
     * texture maybe not init util image is loaded
     */
    Texture2D.fromSrc = function(gl, src) {
        var texture = new Texture2D(gl);

        var image = new Image();
        image.src = src;
        image.onload = function() {

            texture.bind().texParam().texImage(
                image
            );

        }

        return texture;
    }

    /**
     * create a render texture
     */
    Texture2D.createRenderTexture = function(gl, width, height) {
        var texture = new Texture2D(gl);

        texture.bind().texParam().texImage(
            null, width, height
        );

        return texture;
    }

    zen3d.Texture2D = Texture2D;
})();
(function() {
    /**
     * TextureCube
     * @class
     * @extends TextureBase
     */
    var TextureCube = function(gl, options) {
        TextureCube.superClass.constructor.call(this, gl, options);

        var gl = this.gl;

        // faces direction
        this.faces = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];
    }

    zen3d.inherit(TextureCube, zen3d.TextureBase);

    /**
     * bind texture
     */
    TextureCube.prototype.bind = function() {
        var gl = this.gl;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.glTexture);

        return this;
    }

    /**
     * tex parameteri
     */
    TextureCube.prototype.texParam = function() {
        var gl = this.gl;

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);

        return this;
    }

    /**
     * tex image
     * upload image or set size to GPU
     * notice: if width and height are undefined, pixels must has both width and height properties!!
     * @param pixelsArray {Array} pixels array, order: right, left, up, down, back, front.
     */
    TextureCube.prototype.texImage = function(pixelsArray, width, height) {
        var gl = this.gl;
        var faces = this.faces;

        for(var i = 0; i < 6; i++) {
            if((width !== undefined) && (height !== undefined)) {
                gl.texImage2D(faces[i], 0, this.dataFormat, width, height, this.border, this.dataFormat, this.dataType, pixelsArray[i]);
            } else {
                gl.texImage2D(faces[i], 0, this.dataFormat, this.dataFormat, this.dataType, pixelsArray[i]);
            }
        }

        if((width !== undefined) && (height !== undefined)) {
            this.width = width;
            this.height = height;
        } else {
            this.width = pixelsArray[0].width;
            this.height = pixelsArray[0].height;
        }

        this.isRenderable = true;

        return this;
    }

    /**
     * get texture from image|TypedArray|canvas
     */
    TextureCube.fromRes = function(gl, dataArray, width, height) {
        var texture = new TextureCube(gl);

        texture.bind().texParam().texImage(
            dataArray, width, height
        );

        return texture;
    }

    /**
     * get texture from jpg|png|jpeg srcArray
     * texture maybe not init util image is loaded
     */
    TextureCube.fromSrc = function(gl, srcArray) {
        var texture = new TextureCube(gl);

        var count = 0;
        var images = [];
        function next() {
            if(count >= 6) {
                loaded();
                return;
            }

            var image = new Image();
            image.src = srcArray[count];
            image.onload = next;
            images.push(image);
            count++;
        }

        function loaded() {
            texture.bind().texParam().texImage(
                images
            );
        }

        next();

        return texture;
    }

    /**
     * create a render texture
     */
    TextureCube.createRenderTexture = function(gl, width, height) {
        var texture = new TextureCube(gl);

        texture.bind().texParam().texImage(
            [null, null, null, null, null, null], width, height
        );

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
        // TODO this should be a diffuse color ?
        this.color = 0xffffff;

        // material map
        this.map = null;

        this.opacity = 1;

        this.transparent = false;

        // normal map
        this.normalMap = null;

        // env map
        this.envMap = null;
        this.envMapIntensity = 1;

    }

    /**
     * check map init
     */
    Material.prototype.checkMapInit = function() {
        return (!this.map || this.map.isRenderable) &&
            (!this.normalMap || this.normalMap.isRenderable) &&
            (!this.envMap || this.envMap.isRenderable) &&
            (!this.cubeMap || this.cubeMap.isRenderable);
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

        this.specular = 20;
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

    zen3d.Mesh = Mesh;
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