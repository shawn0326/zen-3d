import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';

/**
 * A material for non-shiny surfaces, without specular highlights.
 * The material uses a non-physically based Lambertian model for calculating reflectance.
 * This can simulate some surfaces (such as untreated wood or stone) well, but cannot simulate shiny surfaces with specular highlights (such as varnished wood).
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function LambertMaterial() {

    Material.call(this);

    this.type = MATERIAL_TYPE.LAMBERT;

    /**
     * Lambert material is affected by lights.
     * @type {boolean}
     * @default true
     */
    this.acceptLight = true;

}

LambertMaterial.prototype = Object.create(Material.prototype);
LambertMaterial.prototype.constructor = LambertMaterial;

export {LambertMaterial};