import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * Line
 * @class
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
     * raycast
     */
    raycast: function() {
        // TODO
    }

});

export {Line};
