import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * A class for displaying points. 
 * The points are rendered using gl.POINTS.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Object3D
 * @param {zen3d.Geometry} geometry — an instance of {@link zen3d.Geometry}.
 * @param {zen3d.Material} material - an instance of {@link zen3d.Material}.
 */
function Points(geometry, material) {

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

    this.type = OBJECT_TYPE.POINT;

}

Points.prototype = Object.create(Object3D.prototype);
Points.prototype.constructor = Points;

export {Points};