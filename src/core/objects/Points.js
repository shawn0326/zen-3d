import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * A class for displaying points. 
 * The points are rendered using gl.POINTS.
 * @constructor
 * @extends Object3D
 * @param {Geometry} geometry — an instance of {@link Geometry}.
 * @param {Material} material - a single or an array of {@link Material}.
 */
function Points(geometry, material) {
    Object3D.call(this);

    this.geometry = geometry;

    this.material = material;

    this.type = OBJECT_TYPE.POINT;
}

Points.prototype = Object.create(Object3D.prototype);
Points.prototype.constructor = Points;

export {Points};