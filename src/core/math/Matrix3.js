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