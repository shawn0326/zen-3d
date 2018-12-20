import { MATERIAL_TYPE, BLEND_TYPE } from '../const.js';
import { Material } from './Material.js';

/**
 * A material for drawing geometry by depth.
 * Depth is based off of the camera near and far plane. White is nearest, black is farthest.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function DepthMaterial() {

    Material.call(this);

    this.type = MATERIAL_TYPE.DEPTH;

    /**
     * Encoding for depth packing.
     * @type {boolean}
     * @default false
     */
    this.packToRGBA = false;

}

DepthMaterial.prototype = Object.create(Material.prototype);
DepthMaterial.prototype.constructor = DepthMaterial;

export { DepthMaterial };