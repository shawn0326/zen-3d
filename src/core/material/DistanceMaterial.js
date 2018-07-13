import {MATERIAL_TYPE, BLEND_TYPE} from '../const.js';
import {Material} from './Material.js';

/**
 * DistanceMaterial
 * @class
 */
function DistanceMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.DISTANCE;

    this.blending = BLEND_TYPE.NONE;
}

DistanceMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: DistanceMaterial

});

export {DistanceMaterial};