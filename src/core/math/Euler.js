import { Matrix4 } from './Matrix4.js';

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

Object.assign(Euler.prototype, /** @lends zen3d.Euler.prototype */{

    /**
     *
     */
    copyFrom: function(euler) {
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
    set: function(x, y, z, order) {
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
    setFromRotationMatrix: function(m, order, update) {

        var clamp = function(value, min, max) {

            return Math.max(min, Math.min(max, value));

        };

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var te = m.elements;
        var m11 = te[0], m12 = te[4], m13 = te[8];
        var m21 = te[1], m22 = te[5], m23 = te[9];
        var m31 = te[2], m32 = te[6], m33 = te[10];

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
    setFromQuaternion: function() {

        var matrix = new Matrix4();

        return function(q, order, update) {

            q.toMatrix4(matrix);

            return this.setFromRotationMatrix(matrix, order, update);

        };

    }(),

    onChange: function(callback) {
        this.onChangeCallback = callback;

        return this;
    },

    onChangeCallback: function() {}

});

export { Euler };
