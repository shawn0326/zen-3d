import {Vector3} from './Vector3.js';
import {Box3} from './Box3.js';

/**
 * @constructor
 * @memberof zen3d
 * @param {*} center 
 * @param {*} radius 
 */
function Sphere(center, radius) {
    this.center = (center !== undefined) ? center : new Vector3();
    this.radius = (radius !== undefined) ? radius : 0;
}

Object.assign(Sphere.prototype, /** @lends zen3d.Sphere.prototype */{

    set: function(center, radius) {
        this.center.copy(center);
        this.radius = radius;

        return this;
    },

    setFromArray: function() {
        var box = new Box3();
        var point = new Vector3();

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
    }(),

    applyMatrix4: function(matrix) {
        this.center.applyMatrix4(matrix);
        this.radius = this.radius * matrix.getMaxScaleOnAxis();

        return this;
    },

    getBoundingBox: function(optionalTarget) {
        var box = optionalTarget || new Box3();

        box.set(this.center, this.center);
        box.expandByScalar(this.radius);

        return box;
    },

    clone: function() {
        return new Sphere().copy(this);
    },

    copy: function(sphere) {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;

        return this;
    }

});

export {Sphere};