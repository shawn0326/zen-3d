import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * A continuous line.
 * The line is rendered using gl.LINES.
 * @constructor
 * @extends Object3D
 * @param {Geometry} geometry — an instance of {@link Geometry}.
 * @param {Material} material - a single or an array of {@link Material}.
 */
function Line(geometry, material) {
    Object3D.call(this);

    this.geometry = geometry;

    this.material = material;

    this.type = OBJECT_TYPE.LINE;
}

Line.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Line,

    /**
     * @memberof Line#
     * @override
     */
    raycast: function(raycaster, intersects) {
        // TODO
    }

});

export {Line};
