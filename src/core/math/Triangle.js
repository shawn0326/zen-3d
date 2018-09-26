import {Vector3} from './Vector3.js';

/**
 * @constructor
 * @memberof zen3d 
 * @param {zen3d.Vector3} [a=]
 * @param {zen3d.Vector3} [b=]
 * @param {zen3d.Vector3} [c=]
 */
function Triangle(a, b, c) {
    this.a = (a !== undefined) ? a : new Vector3();
    this.b = (b !== undefined) ? b : new Vector3();
    this.c = (c !== undefined) ? c : new Vector3();
}

Object.assign(Triangle.prototype, /** @lends zen3d.Triangle.prototype */{

    /**
     * 
     */
    set: function(a, b, c) {
        this.a.copy(a);
        this.b.copy(b);
        this.c.copy(c);

        return this;
    }

});

/**
 * @method
 */
Triangle.normal = function() {
    var v0 = new Vector3();

    return function normal(a, b, c, optionalTarget) {
        var result = optionalTarget || new Vector3();

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

/**
 * static/instance method to calculate barycentric coordinates.
 * based on: http://www.blackpawn.com/texts/pointinpoly/default.html
 * @method
 */
Triangle.barycoordFromPoint = function() {
    var v0 = new Vector3();
    var v1 = new Vector3();
    var v2 = new Vector3();

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

        var result = optionalTarget || new Vector3();

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

/**
 * @method
 */
Triangle.containsPoint = function() {
    var v1 = new Vector3();

    return function containsPoint(point, a, b, c) {
        var result = Triangle.barycoordFromPoint(point, a, b, c, v1);

        return (result.x >= 0) && (result.y >= 0) && ((result.x + result.y) <= 1);
    };
}();

export {Triangle};