import {MATERIAL_TYPE, DRAW_MODE} from '../const.js';
import {Material} from './Material.js';

/**
 * The default material used by Points.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function PointsMaterial() {

    Material.call(this);

    this.type = MATERIAL_TYPE.POINT;

    /**
     * Sets the size of the points.
     * @type {number}
     * @default 1 
     */
    this.size = 1;

    /**
     * Specify whether points' size is attenuated by the camera depth. (Perspective camera only.)
     * @type {boolean}
     * @default true
     */
    this.sizeAttenuation = true;

    /**
     * Set draw mode to POINTS.
     * @type {zen3d.DRAW_MODE}
     * @default zen3d.DRAW_MODE.POINTS
     */
    this.drawMode = DRAW_MODE.POINTS;

}

PointsMaterial.prototype = Object.assign(Object.create(Material.prototype), /** @lends zen3d.PointsMaterial.prototype */{

    constructor: PointsMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;

        return this;
    }

});

export {PointsMaterial};
