import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * Points
 * @class
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