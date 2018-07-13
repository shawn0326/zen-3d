import {MATERIAL_TYPE, BLEND_TYPE} from '../const.js';
import {Material} from './Material.js';

/**
 * DepthMaterial
 * @class
 */
function DepthMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.DEPTH;

    this.blending = BLEND_TYPE.NONE;

    this.packToRGBA = false;
}

DepthMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: DepthMaterial

});

export {DepthMaterial};