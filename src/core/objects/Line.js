import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * A continuous line.
 * The line is rendered using gl.LINES.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Object3D
 * @param {zen3d.Geometry} geometry — an instance of {@link zen3d.Geometry}.
 * @param {zen3d.Material} material - an instance of {@link zen3d.Material}.
 */
function Line(geometry, material) {

    Object3D.call(this);

    /**
     * an instance of {@link zen3d.Geometry}.
     * @type {zen3d.Geometry}
     */
    this.geometry = geometry;

    /**
     * an instance of {@link zen3d.Material}.
     * @type {zen3d.Material}
     */
    this.material = material;

    this.type = OBJECT_TYPE.LINE;

}

Line.prototype = Object.assign(Object.create(Object3D.prototype), /** @lends zen3d.Line.prototype */{

    constructor: Line,

    /**
     * @override 
     */
    raycast: function(raycaster, intersects) {
        // TODO
    }

});

export {Line};
